<template>
  <div class="py-4 container-fluid">
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
              :data-bs-content="currentView === 'Tasks' ? 'Calendar' : 'Tasks'"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Popover } from 'bootstrap';
import Tasks from '@/views/mainpage/components/Tasks.vue';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import CalenderView from "@/views/calender/CalenderView.vue";
import WeekCalender from "@/views/calender/WeekCalender.vue";

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

.tasks-slide {
  position: relative;
  padding: 0 50px;
}

.carousel-control-prev {
  width: 3%;
  justify-content: left;
}

.carousel-control-next {
  width: 3%;
  justify-content: right;
}

.popover-body {
  max-height: 50px;
  opacity: 0.4;
  background-color: rgba(0, 0, 0, 0.75); /* 반투명한 배경색 */
}

</style>
