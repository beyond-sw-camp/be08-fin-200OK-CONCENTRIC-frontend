<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <button @click="prevMonth">◀</button>
      <span>{{ currentMonthYear }}</span>
      <button @click="nextMonth">▶</button>
    </div>

    <div class="calendar">
      <div class="day-header" v-for="day in daysOfWeek" :key="day">{{ day }}</div>

      <div
          class="day-cell"
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="{ 'prev-next-month-day': day.isOtherMonth, 'selected-day': isSelectedDay(day.date) }"
          @click="handleDayClick(day)"
      >
        <div class="day-number">{{ day.day }}</div>
        <div v-for="task in getTasksForDay(day.date)" :key="task.id" class="event-bar">
          {{ truncateTitle(task.title) }}
        </div>
        <div v-if="!getTasksForDay(day.date).length" class="no-events">&nbsp;</div> <!-- 빈 공간 유지 -->
      </div>
    </div>

    <!-- 일정 추가 모달 컴포넌트 -->
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
import { ref, computed, watch } from "vue";
import AddTask from "@/views/mainpage/components/AddTask.vue";

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
    const selectedStartDate = ref(null); // 첫 번째 선택한 날짜
    const selectedEndDate = ref(null); // 두 번째 선택한 날짜
    const isModalVisible = ref(false); // 모달 표시 여부

    // 로컬 상태로 `tasks`를 복사
    const localTasks = ref([...props.tasks]);

    // props가 업데이트될 때 localTasks도 업데이트되도록 watch 사용
    watch(() => props.tasks, (newTasks) => {
      localTasks.value = [...newTasks];
    });

    // 현재 달과 연도를 계산하는 속성
    const currentMonthYear = computed(() => {
      const month = currentDate.value.toLocaleString("default", { month: "long" });
      const year = currentDate.value.getFullYear();
      return `${month} ${year}`;
    });

    // 달력에 표시될 날짜들을 계산하는 속성
    const calendarDays = computed(() => {
      const startOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
      const endOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

      const startDay = startOfMonth.getDay();  // 0: Sunday, 1: Monday, etc.
      const totalDays = endOfMonth.getDate();
      const days = [];

      // 이전 달의 날짜 계산 (수정된 방식)
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

      // 다음 달의 날짜 계산 (수정된 방식)
      const remainingDays = 42 - days.length; // 6x7 grid를 유지하기 위해 42개의 칸 필요
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

    // 이전 달로 이동하는 함수
    const prevMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    };

    // 다음 달로 이동하는 함수
    const nextMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    };

    // 날짜 셀을 클릭했을 때 실행되는 함수
    const handleDayClick = (day) => {
      const clickedDate = new Date(day.date);
      clickedDate.setHours(0, 0, 0, 0); // 시간을 제거하여 날짜만 비교

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
      targetDate.setHours(0, 0, 0, 0); // 시간을 제거하여 날짜만 비교

      if (selectedStartDate.value && selectedEndDate.value) {
        const startDate = new Date(selectedStartDate.value);
        const endDate = new Date(selectedEndDate.value);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // 선택된 날짜가 시작일과 종료일 사이에 있는지 확인
        return targetDate >= startDate && targetDate <= endDate;
      }

      if (selectedStartDate.value) {
        const startDate = new Date(selectedStartDate.value);
        startDate.setHours(0, 0, 0, 0);

        // 시작일과 동일한 날짜인지 확인
        return targetDate.getTime() === startDate.getTime();
      }

      return false;
    };

    // 모달에서 일정 추가 완료 시 실행되는 함수
    const addTask = (task) => {
      // 선택된 날짜를 일정에 자동으로 설정
      if (selectedStartDate.value) {
        task.startDate = selectedStartDate.value;
      }
      if (selectedEndDate.value) {
        task.endDate = selectedEndDate.value;
      }
      task.id = Date.now(); // 임시로 유일한 ID 생성
      localTasks.value.push(task); // 로컬 상태 업데이트
      emit('update:tasks', [...localTasks.value]); // 부모 컴포넌트에 변경 사항 전달
      closeModal(); // 모달 닫기
    };

    // 모달 닫기
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

    return {
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
}

.calendar-header button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  margin: 0 10px;
  cursor: pointer;
}

.calendar-header span {
  font-size: 1.5em;
  font-weight: bold;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.day-header {
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background-color: #f0f0f0;
}

.day-cell {
  border: 1px solid #ddd;
  padding: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 120px;
}

.selected-day {
  background-color: #a0c4ff;
}

.prev-next-month-day.selected-day {
  background-color: #a0c4ff;
}

.prev-next-month-day {
  background-color: #f9f9f9;
  color: #a0a0a0;
}

.event-bar, .no-events {
  background-color: #28a745;
  color: white;
  width: 100%;
  padding: 2px 5px;
  margin-top: 5px;
  font-size: 0.9rem;
  text-align: center;
  border-radius: 5px;
  min-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
    font-size: 0.7rem;
    width: 7ch;
  }
}
</style>
