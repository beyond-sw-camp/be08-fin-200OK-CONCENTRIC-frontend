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
  </div>
</template>

<script>
import {computed, ref} from 'vue'; // 'computed'를 제대로 import해야 합니다.

export default {
  props: ['tasks'], // props를 정의해줍니다.
  setup(props) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const currentDate = ref(new Date());
    const currentMonthYear = computed(() => {
      const month = currentDate.value.toLocaleString("default", { month: "long" });
      const year = currentDate.value.getFullYear();
      return `${month} ${year}`;
    });

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
      currentMonthYear,
      daysOfWeek,
      weekDays,
      handleDayClick,
      getTasksForDay,
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
}

.calendar-header span {
  font-size: 2rem;
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
  border: 1px solid #e1e1e1;
  height: 500px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.day-number {
  font-weight: bold;
}

.event-bar {
  background-color: #a0c4ff;
  color: white;
  margin-top: 5px;
  padding: 3px;
  font-size: 0.8em;
  text-align: center;
}

.day-header {
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background-color: #f0f0f0;
}
</style>
