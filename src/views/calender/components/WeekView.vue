<template>
  <div class="calender-page">
    <div class="calendar-header">
      <span>{{ currentMonthYear }}</span>
    </div>
    <div class="calendar-week">
      <!-- 주별 보기: 7일을 한 줄로 표시 -->
      <div class="week-header">
        <div class="day-header" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      </div>
      <div class="week mb-4">
        <div
            v-for="(day, index) in weekDays"
            :key="index"
            :class="{ 'prev-next-month-day': day.isOtherMonth, 'selected-day': isSelectedDay(day.date) }"
            class="day-cell"
            @click="handleDayClick(day)"
        >
          <div class="day-number mb-2" style="font-size: 9pt">{{ day.day }}</div>
          <div v-for="task in getTasksForDay(day.date)"
               :key="task.id"
               class="event-bar"
               :class="{ 'team-task': task.type === 'TEAM' }"
               @click.stop="handleTaskClick(task)"
               style="cursor: pointer"
          >
            {{ truncateTitle(task.title) }}
          </div>
          <div v-if="!getTasksForDay(day.date).length" class="no-events">&nbsp;</div>
        </div>
      </div>
    </div>

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
import { computed, ref, watch } from 'vue';
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
    const selectedStartDate = ref(null);
    const selectedEndDate = ref(null);
    const isModalVisible = ref(false);
    const userStore = useUserStore();
    const localTasks = ref([...props.tasks]);

    watch(() => props.tasks, (newTasks) => {
      localTasks.value = [...newTasks];
    });

    const currentDate = ref(new Date());
    const currentMonthYear = computed(() => {
      const month = currentDate.value.toLocaleString("default", { month: "long" });
      const year = currentDate.value.getFullYear();
      return `${year}년 ${month}`;
    });

    const weekDays = computed(() => {
      const startOfWeek = new Date(currentDate.value);
      startOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay());

      const days = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        days.push({
          day: currentDay.getDate(),
          date: formatDateTime(currentDay),
        });
      }
      return days;
    });

    const truncateTitle = (title) => {
      const maxLength = 10;
      return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
    };

    const getTasksForDay = (date) => {
      const selectedDate = new Date(date);
      return localTasks.value.filter((task) => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate || task.startDate);
        return taskStart <= selectedDate && selectedDate <= taskEnd;
      });
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
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        task.startDate = convertToKSTISOString(startDate);
        task.endDate = convertToKSTISOString(endDate);

        const response = await axios.post('/schedule/create', task);
        if(response.status === 400){
            alert("일정 정보를 올바르게 입력해 주세요.");
            return;
          };
        localTasks.value.push(response.data);
        emit('update:tasks', [...localTasks.value]);
      } catch (error) {
        console.error('새 일정을 추가하는 중 오류가 발생했습니다.', error);
      } finally {
        closeModal();
      }
    };

    const convertToKSTISOString = (date) => {
      const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      return kstDate.toISOString();
    };

    const closeModal = () => {
      isModalVisible.value = false;
      selectedStartDate.value = null;
      selectedEndDate.value = null;
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
      currentMonthYear,
      daysOfWeek,
      weekDays,
      handleDayClick,
      getTasksForDay,
      openModal: isModalVisible,
      closeModal,
      addTask,
      isModalVisible,
      selectedStartDate,
      selectedEndDate,
      isSelectedDay,
      localTasks,
      truncateTitle,
      handleTaskClick,
      formatDateTime,
      convertToKSTISOString
    };
  },
};
</script>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #344767;
}

.calender-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: #344767;
}

.calendar-header span {
  font-size: 1.2rem;
  font-weight: bold;
}

.calendar-week {
  display: grid;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  border: 0.5px solid #e1e1e1;
  height: 500px;
  padding: 5px;
  /* cursor: pointer; */
  display: flex;
  flex-direction: column;
}

.day-number {
  padding: 0.3rem;
  /* font-weight: bold; */
}

.event-bar {
  background-color: #c9cff3;
  color: #344767;
  margin-top: 5px;
  padding: 3px;
  font-size: 0.7em;
  text-align: center;
}

.team-task {
  background-color: #cef6ee; 
}

.day-header {
  border: 0.5px solid #ddd;
  font-weight: bold;
  font-size: 10pt;
  text-align: center;
  padding: 3px;
  background-color: #f0f0f0;
}

.selected-day {
  background-color: #fffcdb;
}
</style>
