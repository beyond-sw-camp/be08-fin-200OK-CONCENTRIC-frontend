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
            class="day-cell"
            @click="handleDayClick(day)"
        >
          <div class="day-number mb-2" style="font-size: 9pt">{{ day.day }}</div>
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
      return `${year}년 ${month}`;
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
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.day-number {
  padding: 0.3rem;
  /* font-weight: bold; */
}

.event-bar {
  background-color: #8a9bf9;
  color: white;
  margin-top: 5px;
  padding: 3px;
  font-size: 0.7em;
  text-align: center;
}

.day-header {
  border: 0.5px solid #ddd;
  font-weight: bold;
  font-size: 10pt;
  text-align: center;
  padding: 3px;
  background-color: #f0f0f0;
}
</style>
