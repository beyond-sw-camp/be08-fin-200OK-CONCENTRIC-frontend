<template>
  <div class="calendar-page card px-4">
    <!-- 상단에 보기 모드 전환 버튼 -->
    <div class="calendar-header">
      <div class="view-toggle">
        <button @click="setView('month')"
                :class="{ active: currentView === 'month' }"
                type="button"
                class="btn-primary btn"
                v-if="currentView === 'week'">
          Month
        </button>
        <button @click="setView('week')"
                :class="{ active: currentView === 'week' }"
                type="button"
                class="btn-primary btn"
                v-if="currentView === 'month'">
          Week
        </button>
        <button type="button" class="btn btn-success ms-3" @click="toggleTaskView">
          {{ isShowingPrivate ? '전체 일정 보기' : '개인 일정만 보기' }}
        </button>
      </div>
    </div>

    <component class="calendar-view"
        :is="currentViewComponent"
        :tasks="tasks"
        :selectedDate="selectedDate"
        @openDetails="openTaskDetails"
    />
    <transition name="slideUp" appear>
      <viewDetails
          :isVisible=isDetailsVisible
          @close="isDetailsVisible = false"
          user-id="userState.userId"
          :task-details="selectedTaskDetails"/>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';  // 서버에서 일정 데이터를 가져오기 위한 axios
import MonthView from '@/views/calender/components/MonthView.vue';
import WeekView from '@/views/calender/components/WeekView.vue';
import DayView from '@/views/calender/components/DayView.vue';
import ViewDetails from "@/views/calender/components/viewDetails.vue";

export default {
  components: {ViewDetails, MonthView, WeekView, DayView },
  setup() {
    const currentView = ref('month');
    const tasks = ref([]); // 일정 데이터를 저장할 배열
    const selectedDate = ref(new Date().toISOString().split('T')[0]); // 선택된 날짜

    const originalTasks = ref([]);
    const isShowingPrivate = ref(false);

    const isDetailsVisible = ref(false);
    const selectedTaskDetails = ref(null);

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
        originalTasks.value = [...response.data];
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    // 컴포넌트가 마운트될 때 일정 데이터를 가져옴
    onMounted(() => {
      fetchTasks();
    });

    const toggleTaskView = () => {
      if (isShowingPrivate.value) {
        tasks.value = [...originalTasks.value];
      } else {
        tasks.value = originalTasks.value.filter(task => task.type === 'PRIVATE');
      }
      isShowingPrivate.value = !isShowingPrivate.value;
    };

    const openTaskDetails = (taskDetails) => {
      selectedTaskDetails.value = taskDetails;
      isDetailsVisible.value = true;
    };

    return {
      currentMonthYear,
      currentView,
      currentViewComponent,
      tasks,
      selectedDate,
      setView,
      toggleTaskView,
      isShowingPrivate,
      isDetailsVisible,
      selectedTaskDetails,
      openTaskDetails,
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
  margin-bottom: 0px;
  margin-top: 0px;
}

.calendar-view {
  margin-top: -2.8rem;
}

.view-toggle {
  display: flex;
  /* gap: 10px; */
  margin-right: 10px;
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

.btn-primary {
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  /* font-weight: 400; */
}

.btn-success {
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  /* font-weight: 400; */
}

</style>
