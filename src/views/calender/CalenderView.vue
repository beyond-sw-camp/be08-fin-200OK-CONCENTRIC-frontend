<template>
  <div class="calendar-page card px-4">
    <!-- 상단에 보기 모드 전환 버튼 -->
    <div class="calendar-header">
      <div class="view-toggle">
        <button @click="setView('month')"
                :class="{ active: currentView === 'month' }"
                type="button"
                class="btn-success btn"
                v-if="currentView === 'week'">
          Month
        </button>
        <button @click="setView('week')"
                :class="{ active: currentView === 'week' }"
                type="button"
                class="btn-success btn"
                v-if="currentView === 'month'">
          Week
        </button>
      </div>
    </div>

    <component
        :is="currentViewComponent"
        :tasks="tasks"
        :selectedDate="selectedDate"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';  // 서버에서 일정 데이터를 가져오기 위한 axios
import MonthView from '@/views/calender/components/MonthView.vue';
import WeekView from '@/views/calender/components/WeekView.vue';
import DayView from '@/views/calender/components/DayView.vue';

export default {
  components: { MonthView, WeekView, DayView },
  setup() {
    const currentView = ref('month');
    const tasks = ref([]); // 일정 데이터를 저장할 배열
    const selectedDate = ref(new Date().toISOString().split('T')[0]); // 선택된 날짜

    const currentDate = ref(new Date());
    const currentMonthYear = computed(() => {
      const month = currentDate.value.toLocaleString("default", { month: "long" });
      const year = currentDate.value.getFullYear();
      return `${month} ${year}`;
    });
    // 현재 보기 모드에 맞는 컴포넌트 결정
    const currentViewComponent = computed(() => {
      if (currentView.value === 'week') return 'WeekView';
      if (currentView.value === 'day') return 'DayView';
      return 'MonthView';
    });

    // 보기 모드 전환
    const setView = (view) => {
      currentView.value = view;
    };

    // 서버에서 일정 데이터 가져오기 (임시로 axios 사용)
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/schedule/list');
        tasks.value = response.data; // 가져온 데이터를 tasks 배열에 저장
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    // 컴포넌트가 마운트될 때 일정 데이터를 가져옴
    onMounted(() => {
      fetchTasks();
    });

    return {
      currentMonthYear,
      currentView,
      currentViewComponent,
      tasks,
      selectedDate,
      setView,
    };
  },
};
</script>

<style scoped>
.calendar-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 90%;
  margin-bottom: 5px;
}

.view-toggle {
  display: flex;
  gap: 10px;
  margin-left: 20px;
  margin-top: 30px;
}

.btn-view {
  cursor: pointer;
  padding: 5px 10px;
}

.btn-view.active {
  background-color: #28a745;
  color: white;
}

.selectTypeButton{
  border: none;
  background-color: transparent;
}

</style>
