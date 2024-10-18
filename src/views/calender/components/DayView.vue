<template>
  <div class="calendar-day">
    <div class="day-header">
      {{ currentDayLabel }}
    </div>
    <div class="day-tasks">
      <div
          v-for="task in tasksForDay"
          :key="task.id"
          class="event-bar"
          @click="handleTaskClick(task)"
      >
        {{ task.title }} - {{ formatTime(task.startTime) }} ~ {{ formatTime(task.endTime) }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: ['tasks', 'selectedDate'],
  setup(props) {
    const currentDayLabel = computed(() => {
      const date = new Date(props.selectedDate);
      return date.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    });

    const tasksForDay = computed(() => {
      return props.tasks.filter(task => task.date === props.selectedDate);
    });

    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    };

    const handleTaskClick = (task) => {
      console.log(`Clicked task: ${task.title}`);
      // 일별 보기는 시간대별로 일정을 추가하거나 수정할 수 있도록 모달을 띄움
    };

    return {
      currentDayLabel,
      tasksForDay,
      formatTime,
      handleTaskClick,
    };
  },
};
</script>

<style scoped>
.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-header {
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.day-tasks {
  width: 90%;
  border: 1px solid #e1e1e1;
  padding: 10px;
}

.event-bar {
  background-color: #007bff;
  color: white;
  padding: 10px;
  margin-top: 10px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
}
</style>
