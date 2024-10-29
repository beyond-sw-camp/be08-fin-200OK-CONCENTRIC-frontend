<template>
  <div class="row min-vh-75 container">
    <div class="col-2 py-4" >
      <div class="card " style="min-width: 210px;">
        <div class="sidebar d-flex flex-column align-items-start" style="min-height: 600px;">
          <ul class="menu" style="padding-left: 1rem; width: 100%;">
            <li style="border-bottom: 0.5px solid rgba(0, 0, 0, 0.2); width: 90%; border-radius: 0; font-size: 12pt; font-weight: 600;">
              Menu
            </li>
            <li v-if="!userStore.teamId">
              <router-link
                  to="/profile?tab=profile_card"
                  class="p-0 nav-link"
                  style="color: #121235"
              >
                <i class="fa fa-user"></i>마이 페이지
              </router-link>
            </li>
            <li v-if="userStore.teamId">
              <router-link
                  :to="{ path: `/team/${userStore.teamId}` }"
                  class="p-0 nav-link"
                  style="color: #121235"
              >
                <i class="fa fa-user"></i>팀 페이지
              </router-link>
            </li>
            <li v-if="!userStore.teamId">
              <router-link
                  to="/profile?tab=social"
                  class="p-0 nav-link"
                  style="color: #121235;"
              >
                <i class="fa fa-users"></i>소셜
<!--                <span class="notification-badge" v-show="numOfFriendshipRequests > 0">{{ numOfFriendshipRequests }}</span>-->
              </router-link>
            </li>
            <li>
              <a
                  href="javascript:void(0)"
              @click="navigateToPage"
              class="p-0 nav-link"
              aria-expanded="false"
              style="color: #121235"
              >
              <i class="fa fa-archive"></i>파일함
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-10 py-4 container-fluid">
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="false">
        <!-- Indicators -->
        <ol class="carousel-indicators">
          <li
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              class="active">
          </li>
          <li
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1">
          </li>
        </ol>

        <div class="carousel-inner">
          <div class="carousel-item active tasks-slide">
            <Tasks class="d-block w-100" alt="First slide" />
          </div>
          <div class="carousel-item">
            <CalenderView class="d-block w-100" alt="Second slide" />
          </div>
        </div>

        <a
            class="carousel-control-prev"
            href="#carouselExampleIndicators"
            role="button"
            data-bs-slide="prev"
            @click="toggleView"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"
                data-bs-toggle="popover"
                data-bs-placement="top"
                :data-bs-content="currentView === 'Tasks' ? 'Calendar' : 'Tasks'"
          ></span>
          <span class="sr-only"
          >Previous</span>
        </a>
        <a
            class="carousel-control-next"
            href="#carouselExampleIndicators"
            role="button"
            data-bs-slide="next"
            @click="toggleView"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"
                data-bs-toggle="popover"
                data-bs-placement="top"
                :data-bs-content="currentView === 'Tasks' ? 'Calendar' : 'Tasks'"
                ></span>
          <span class="sr-only">Next</span>
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch} from 'vue';
import { useUserStore } from "@/store/user";
import { Popover } from 'bootstrap';
import Tasks from '@/views/mainpage/components/Tasks.vue';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import CalenderView from "@/views/calender/CalenderView.vue";
import { useRouter } from 'vue-router';
import WeekCalender from "@/views/calender/WeekCalender.vue";

const userStore = useUserStore();

const router = useRouter();
const navigateToPage = () => {
  if (userStore.teamId) {
    // 팀 ID가 존재하면 팀 페이지로 이동
    router.push({ path: `/team/${userStore.teamId}` });
  } else {
    // 팀 ID가 없으면 프로필의 파일함으로 이동
    router.push({ path: '/profile', query: { tab: 'private_storage' } });
  }
};

const currentView = ref('Tasks');
let popovers = [];

const initializePopovers = () => {
  // 기존 팝오버 인스턴스 제거
  popovers.forEach((popover) => popover.dispose());
  popovers = []; // 인스턴스 목록 초기화

  // 새로운 팝오버 인스턴스 생성
  const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
  );

  popovers = popoverTriggerList.map((popoverTriggerEl) => {
    return new Popover(popoverTriggerEl, {
      trigger: 'hover',
      placement: 'top',
      content: popoverTriggerEl.getAttribute('data-bs-content'),
    });
  });
};

onMounted(() => {
  const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
  );

  popoverTriggerList.forEach((popoverTriggerEl) => {
    new Popover(popoverTriggerEl, {
      trigger: 'hover',
      placement: 'top',
    });
  });
});

// State variables

const selectedColor = ref('teal');
const attrs = ref([
  {
    key: 'test',
    highlight: true,
    dates: { start: new Date(2024, 10, 4), end: new Date(2024, 10, 6) },
  },
]);
const date = ref(new Date());

// Initial calendar page setup
const today = new Date();
const initialPage = ref({
  month: today.getMonth() + 1,
  year: today.getFullYear(),
});

// Calendar reference
const calendar = ref(null);

const toggleView = async () => {
  currentView.value = currentView.value === 'Tasks' ? 'Calendar' : 'Tasks';

  await nextTick();
  initializePopovers();
};

onMounted(initializePopovers);

const updateView = (view) => {
  currentView.value = view;
};

</script>

<style scoped>
.container {
  padding: 0;
}
.menu li {
  padding: 0.6rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  font-size: 11pt;
  margin-right: 1rem;
  transition: background-color 0.15s, color 0.15s;
}

.menu li i {
  margin-right: 1rem;
  font-size: 12pt;
  align-items: left;
}

.menu li.active,
.menu li:hover {
  background-color: #e3e3e3;
  color: rgb(0, 0, 0);
}

.sidebar {
  width: 100%;
  padding-top: 1rem;
  flex-shrink: 0;
  align-content: center;
}

.tasks-slide {
  position: relative;
  padding: 0 2.5rem;
}

.carousel-control-prev {
  width: 2.5%;
  justify-content: left;
}

.carousel-control-next {
  width: 2.5%;
  justify-content: right;
}

.popover-body {
  max-height: 50px;
  opacity: 0.4;
  background-color: rgba(0, 0, 0, 0.75); /* 반투명한 배경색 */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(1) grayscale(1) brightness(0.5); /* 아이콘 색상 변경 */
}
</style>
