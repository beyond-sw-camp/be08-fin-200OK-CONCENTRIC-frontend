
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
        :userId=loggedInMemberId
        @update:tasks="fetchTasks"
    />
    <transition name="slideUp" appear>
      <viewDetails
        :isVisible=isDetailsVisible
        @close="isDetailsVisible = false"
        :userId=loggedInMemberId
        :task-details="selectedTaskDetails"/>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios'; 
import MonthView from '@/views/calender/components/MonthView.vue';
import WeekView from '@/views/calender/components/WeekView.vue';
import DayView from '@/views/calender/components/DayView.vue';
import ViewDetails from "@/views/calender/components/viewDetails.vue";
import { useUserStore } from '@/store/user';

export default {
  components: {ViewDetails, MonthView, WeekView, DayView },
  setup() {
    const userStore = useUserStore();
    const loggedInMemberId = userStore.userInfo.id;
    const currentView = ref('month');
    const tasks = ref([]);
    const selectedDate = ref(new Date().toISOString().split('T')[0]); 

    const originalTasks = ref([]);
    const isShowingPrivate = ref(false);

    const isDetailsVisible = ref(false);
    const selectedTaskDetails = ref(null);

    const taskDetails = ref([]);

    const currentDate = ref(new Date());
    const currentMonthYear = computed(() => {
      const month = currentDate.value.toLocaleString("default", { month: "long" });
      const year = currentDate.value.getFullYear();
      return `${month} ${year}`;
    });
    const currentViewComponent = computed(() => {
      if (currentView.value === 'week') return 'WeekView';
      if (currentView.value === 'day') return 'DayView';
      return 'MonthView';
    });

    const setView = (view) => {
      currentView.value = view;
    };

    const fetchTasks = async () => {
      try {
        const userState = JSON.parse(localStorage.getItem('user'));
        const teamId = userState?.state?.team_id;

        const url = teamId
            ? `/schedule/list/team?teamId=${teamId}`
            : '/schedule/list';

        const response = await axios.get(url);

        tasks.value = response.data;
        originalTasks.value = [...response.data];
      } catch (error) {
        console.error('요청 중 오류가 발생했습니다.', error);
      }
    };

    watch(
        () => userStore.teamId, 
        () => {
          fetchTasks();
        }
    );

    onMounted(() => {
      if(userStore.isLoggedIn === undefined || userStore.isLoggedIn === false) return;
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

    const taskDetailsApi = async (task) => {
      try {
        const response = await axios.get(`/schedule/list/${task.id}`);
        taskDetails.value = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const openTaskDetails = async (task) => {
      await taskDetailsApi(task);
      selectedTaskDetails.value = taskDetails.value;
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
      loggedInMemberId
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
