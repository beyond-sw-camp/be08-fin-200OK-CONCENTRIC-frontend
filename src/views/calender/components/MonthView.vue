<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <button type="button" @click="prevMonth">◀</button>
      <span>{{ currentMonthYear }}</span>
      <button type="button" @click="nextMonth">▶</button>
    </div>
    <div class="week-header">
      <div class="day-header" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>
    <transition-group
        name="slide"
        tag="div"
        class="calendar mb-4"
    >
      <div
          class="day-cell"
          v-for="day in calendarDays"
          :key="day.date"
      :class="{ 'prev-next-month-day': day.isOtherMonth, 'selected-day': isSelectedDay(day.date) }"
      @click="handleDayClick(day)"
      >
      <div class="day-number mb-2" style="font-size: 9pt">{{ day.day }}</div>
      <div v-for="task in getTasksForDay(day.date)" :key="task.id" class="event-bar" :class="{ 'team-task': task.type === 'TEAM' }"
           @click.stop="handleTaskClick(task)"
           style="cursor: pointer"
      >
        {{ truncateTitle(task.title) }}
      </div>
      <div v-if="!getTasksForDay(day.date).length" class="no-events">&nbsp;</div> <!-- 빈 공간 유지 -->
  </div>
  </transition-group>

  <add-task
      v-if="isModalVisible"
      :isVisible="isModalVisible"
      :userId="userId"
      @close="closeModal"
      @confirm="addTask"
      :selectedStartDate="selectedStartDate.slice(0,10)"
      :selectedEndDate="selectedEndDate.slice(0,10)"
  />
  </div>
</template>



<script>
import { ref, computed, watch } from "vue";
import axios from 'axios';
import AddTask from "@/views/mainpage/components/AddTask.vue";
import { useUserStore } from '@/store/user';

export default {
  components: { AddTask },
  props: {
    userId: {
      type: Number,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    }
  },
  setup(props, { emit }) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = ref(new Date());
    const selectedStartDate = ref(null);
    const selectedEndDate = ref(null);
    const isModalVisible = ref(false);

    const localTasks = ref([...props.tasks]);

    watch(() => props.tasks, (newTasks) => {
      localTasks.value = [...newTasks];
    });

    const currentMonthYear = computed(() => {
      const month = currentDate.value.toLocaleString("default", { month: "long" });
      const year = currentDate.value.getFullYear();
      return `${year}년 ${month}`;
    });

    const calendarDays = computed(() => {
      const startOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
      const endOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

      const startDay = startOfMonth.getDay(); 
      const totalDays = endOfMonth.getDate();
      const days = [];

      // 이전 달의 날짜 계산 
      for (let i = 0; i < startDay; i++) {
        const prevDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), -(startDay - i - 1));
        days.push({
          day: prevDate.getDate(),
          date: `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}-${prevDate.getDate()}`,
          isOtherMonth: true
        });
      }

      // 현재 달의 날짜 추가
      for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), i);
        days.push({
          day: i,
          date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
          isOtherMonth: false
        });
      }

      // 다음 달의 날짜 계산 
      const remainingDays = 42 - days.length; 
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, i);
        days.push({
          day: nextDate.getDate(),
          date: `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`,
          isOtherMonth: true
        });
      }

      return days;
    });

    const slideDirection = ref("next"); 

    const prevMonth = () => {
      slideDirection.value = "prev"; 
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    };

    const nextMonth = () => {
      slideDirection.value = "next"; 
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    };

    const handleDayClick = (day) => {
      const clickedDate = new Date(day.date);
      clickedDate.setHours(0, 0, 0, 0);

      if (!selectedStartDate.value) {
        selectedStartDate.value = formatDateTime(clickedDate);
      } else if (!selectedEndDate.value) {
        selectedEndDate.value = formatDateTime(clickedDate);

        if (new Date(selectedStartDate.value) > new Date(selectedEndDate.value)) {
          [selectedStartDate.value, selectedEndDate.value] = [selectedEndDate.value, selectedStartDate.value];
        }

        isModalVisible.value = true;
      } else {
        selectedStartDate.value = formatDateTime(clickedDate);
        selectedEndDate.value = null;
      }
    };

    const isSelectedDay = (date) => {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0); 

      if (selectedStartDate.value && selectedEndDate.value) {
        const startDate = new Date(selectedStartDate.value);
        const endDate = new Date(selectedEndDate.value);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return targetDate >= startDate && targetDate <= endDate;
      }

      if (selectedStartDate.value) {
        const startDate = new Date(selectedStartDate.value);
        startDate.setHours(0, 0, 0, 0);

        return targetDate.getTime() === startDate.getTime();
      }

      return false;
    };

    const addTask = async (task) => {
      try {
        const response = await axios.post('/schedule/create', task);
        console.log('Task successfully added:', response.data);
        localTasks.value.push(response.data);
        emit('update:tasks', [...localTasks.value]);
      } catch (error) {
        console.error('새 일정을 추가하는 중 오류가 발생했습니다.', error);
      } finally {
        closeModal();
      }
    };

    const closeModal = () => {
      isModalVisible.value = false;
      selectedStartDate.value = null;
      selectedEndDate.value = null;
    };

    const truncateTitle = (title) => {
      const maxLength = 10;
      if (title.length > maxLength) {
        return title.substring(0, maxLength) + "...";
      }
      return title;
    };

    const getTasksForDay = (date) => {
      const selectedDate = new Date(date);
      return localTasks.value.filter((task) => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate || task.startDate);
        taskStart.setHours(0, 0, 0, 0);
        taskEnd.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        return taskStart <= selectedDate && selectedDate <= taskEnd;
      });
    };

    const handleTaskClick = (task) => {
      emit('openDetails', task); 
    };

    const formatDateTime = (dateTime) => {
      if (!dateTime || isNaN(new Date(dateTime).getTime())) return '';
      
      const date = new Date(dateTime);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return {
      slideDirection,
      daysOfWeek,
      calendarDays,
      prevMonth,
      nextMonth,
      currentMonthYear,
      handleDayClick,
      openModal: isModalVisible,
      closeModal,
      addTask,
      truncateTitle,
      getTasksForDay,
      isModalVisible,
      selectedStartDate,
      selectedEndDate,
      isSelectedDay,
      localTasks,
      handleTaskClick,
      formatDateTime
    };
  },
};
</script>

<style scoped>
.calendar-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #344767;
}

.calendar-header button {
  background-color: transparent;
  color: #121235;
  border: none;
  /* padding: 10px; */
  margin: 0 10px;
  cursor: pointer;
}

.calendar-header span {
  font-size: 1.2rem;
  font-weight: bold;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* gap: 1px; */
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.day-header {
  border: 0.5px solid #ddd;
  font-weight: bold;
  font-size: 10pt;
  text-align: center;
  color: #344767;
  padding: 3px;
  background-color: #f0f0f0;
}

.day-cell {
  border: 0.5px solid #ddd;
  padding: 10px;
  background-color: white;
  /* display: flex; */
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100px;
}

.selected-day {
  background-color: #fffde0;
}

.prev-next-month-day.selected-day {
  background-color: #fffbd0;
}

.prev-next-month-day {
  background-color: #f9f9f9;
  color: #a0a0a0;
}

.event-bar, .no-events {
  background-color: #c9cff3;
  color: #344767;
  width: 100%;
  margin-bottom: 3px;
  font-size: 0.7rem;
  text-align: center;
  min-height: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-task {
  background-color: #cef6ee; 
}

.no-events {
  visibility: hidden;
}

@media (max-width: 768px) {
  .calendar {
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(60px, auto);
  }

  .event-bar {
    font-size: 0.8rem;
    width: 8ch;
  }
}

@media (max-width: 480px) {
  .calendar {
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(50px, auto);
  }

  .day-cell {
    padding: 5px;
  }

  .event-bar {
    font-size: 0.5rem;
    width: 7ch;
  }
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  width: 100%;
}

/* transition-group의 enter-active 및 leave-active에 슬라이드 효과 추가 */
.slide-enter-active {
  animation: slideInRight 0.5s ease forwards;
}

.slide-leave-active {
  animation: slideOutLeft 0.5s ease forwards;
}

/* prev와 next의 슬라이드 방향 */
.slide-prev-enter-active {
  animation: slideInLeft 0.5s ease forwards;
}

.slide-prev-leave-active {
  animation: slideOutRight 0.5s ease forwards;
}

@keyframes slideInRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

.slideUp-enter-active{
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center center;
}

.slideUp-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 나타날 때 시작 위치 */
.slideUp-enter {
  transform: translateY(20px);
  opacity: 0;
}

/* 나타날 때 최종 위치 */
.slideUp-enter-to {
  transform: translateY(0px);
  opacity: 1;
}

/* 사라질 때 위치 */
.slideUp-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
