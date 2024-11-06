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
      :selectedStartDate="selectedStartDate"
      :selectedEndDate="selectedEndDate"
  />
  </div>
</template>

<script>
import {computed, ref, watch} from 'vue';
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
    const selectedStartDate = ref(null); // 첫 번째 선택한 날짜
    const selectedEndDate = ref(null); // 두 번째 선택한 날짜
    const isModalVisible = ref(false); // 모달 표시 여부

    const userStore = useUserStore();

    // 로컬 상태로 `tasks`를 복사
    const localTasks = ref([...props.tasks]);

    // props가 업데이트될 때 localTasks도 업데이트되도록 watch 사용
    watch(() => props.tasks, (newTasks) => {
      localTasks.value = [...newTasks];
    });


    const currentDate = ref(new Date());
    currentDate.value.setUTCHours(0, 0, 0, 0);
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
        currentDay.setUTCHours(0, 0, 0, 0);
        days.push({
          day: currentDay.getDate(),
          date: currentDay.toISOString().split('T')[0], // YYYY-MM-DD 형식
        });
      }
      return days;
    });


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
        // taskStart.setUTCHours(0, 0, 0, 0);
        // taskEnd.setUTCHours(0, 0, 0, 0);
        selectedDate.setUTCHours(0, 0, 0, 0);

        return taskStart <= selectedDate && selectedDate <= taskEnd;
      });
    };

    // 날짜 셀을 클릭했을 때 실행되는 함수
    const handleDayClick = (day) => {
      console.log("userId: ", props.userId);
      const clickedDate = new Date(day.date);
      clickedDate.setUTCHours(0, 0, 0, 0); // 시간을 제거하여 날짜만 비교

      if (!selectedStartDate.value) {
        // 첫 번째 날짜를 선택한 경우
        selectedStartDate.value = clickedDate.toLocaleDateString('en-CA');
      } else if (!selectedEndDate.value) {
        // 두 번째 날짜를 선택한 경우
        selectedEndDate.value = clickedDate.toLocaleDateString('en-CA');

        // 날짜 순서 정렬 (시작일이 종료일보다 나중일 경우 변경)
        if (new Date(selectedStartDate.value) > new Date(selectedEndDate.value)) {
          [selectedStartDate.value, selectedEndDate.value] = [selectedEndDate.value, selectedStartDate.value];
        }

        // 모달 열기
        isModalVisible.value = true;
      } else {
        // 이미 두 날짜가 선택된 경우 새로 시작
        selectedStartDate.value = clickedDate.toLocaleDateString('en-CA');
        selectedEndDate.value = null;
      }
    };

    // 선택된 날짜 강조 여부 확인
    const isSelectedDay = (date) => {
      const targetDate = new Date(date);
      targetDate.setUTCHours(0, 0, 0, 0); // 시간을 제거하여 날짜만 비교

      if (selectedStartDate.value && selectedEndDate.value) {
        const startDate = new Date(selectedStartDate.value);
        const endDate = new Date(selectedEndDate.value);

        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(0, 0, 0, 0);

        // 선택된 날짜가 시작일과 종료일 사이에 있는지 확인
        return targetDate >= startDate && targetDate <= endDate;
      }

      if (selectedStartDate.value) {
        const startDate = new Date(selectedStartDate.value);
        startDate.setUTCHours(0, 0, 0, 0);

        // 시작일과 동일한 날짜인지 확인
        return targetDate.getTime() === startDate.getTime();
      }

      return false;
    };

    const addTask = async (task) => {
      // 선택된 날짜를 일정에 자동으로 설정
      if (selectedStartDate.value) {
        let startDate = new Date(`${selectedStartDate.value}T00:00`);
        
        // StartDate와 EndDate가 같은 경우 StartDate의 시간을 23:59로 설정
        if (selectedEndDate.value && selectedStartDate.value === selectedEndDate.value) {
          startDate = new Date(`${selectedStartDate.value}T23:59`);
        }

        task.startDate = startDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
      }

      if (selectedEndDate.value) {
        const endDate = new Date(`${selectedEndDate.value}T00:00`);
        task.endDate = endDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
      }
      
      // task.id = Date.now();
      
      try {
        // API 호출
        const response = await axios.post('/schedule/create', task);
        console.log('Task successfully added:', response.data);

        // 로컬 상태 업데이트
        localTasks.value.push(response.data);
        emit('update:tasks', [...localTasks.value]); // 부모 컴포넌트에 변경 사항 전달

      } catch (error) {
        console.error('새 일정을 추가하는 중 오류가 발생했습니다.', error);
      } finally {
        closeModal(); // 모달 닫기
      }
    };

    // 모달 닫기
    const closeModal = () => {
      isModalVisible.value = false;
      selectedStartDate.value = null;
      selectedEndDate.value = null;
    };

    const handleTaskClick = (task) => {
      emit('openDetails', task); // 클릭된 task를 부모로 전달
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
      handleTaskClick
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
