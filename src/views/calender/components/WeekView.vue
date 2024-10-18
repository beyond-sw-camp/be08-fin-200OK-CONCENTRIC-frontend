<template>
  <div class="calendar-week">
    <!-- 주별 보기: 7일을 한 줄로 표시 -->
    <div class="week-header">
      <div class="day-header" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>
    <div class="week">
      <div
          v-for="(day, index) in weekDays"
          :key="index"
          class="day-cell"
          @click="handleDayClick(day)"
      >
        <div class="day-number">{{ day.day }}</div>
        <div v-for="task in getTasksForDay(day.date)" :key="task.id" class="event-bar">
          {{ task.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'; // 'computed'를 제대로 import해야 합니다.

export default {
  props: ['tasks'], // props를 정의해줍니다.
  setup(props) {
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    const weekDays = computed(() => {
      const today = new Date();
      const startOfWeek = today.getDate() - today.getDay(); // 해당 주의 시작일 계산

      const days = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(today.setDate(startOfWeek + i));
        days.push({
          day: currentDay.getDate(),
          date: currentDay.toISOString().split('T')[0],
        });
      }
      return days;
    });

    const handleDayClick = (day) => {
      console.log(`Clicked day: ${day.date}`);
      // 주별 보기는 특정 날짜에 일정을 추가하는 모달을 띄움
    };

    const getTasksForDay = (date) => {
      return props.tasks.filter((task) => task.startDate <= date && task.endDate >= date);
    };

    return {
      daysOfWeek,
      weekDays,
      handleDayClick,
      getTasksForDay,
    };
  },
};
</script>

<style scoped>
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-cell {
  border: 1px solid #e1e1e1;
  height: 150px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.day-number {
  font-weight: bold;
}

.event-bar {
  background-color: #007bff;
  color: white;
  margin-top: 5px;
  padding: 3px;
  font-size: 0.8em;
  text-align: center;
}
</style>
