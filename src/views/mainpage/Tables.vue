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
          data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a
          class="carousel-control-next"
          href="#carouselExampleIndicators"
          role="button"
          data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue';
import Tasks from '@/views/mainpage/components/Tasks.vue';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import CalenderView from "@/views/calender/CalenderView.vue";
import WeekCalender from "@/views/calender/WeekCalender.vue";

// State variables
const currentView = ref('tasks');
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

// Methods
const toggleView = () => {
  currentView.value = currentView.value === 'tasks' ? 'calendar' : 'tasks';
};

const moveToday = () => {
  if (calendar.value) {
    calendar.value.move(new Date());
  }
};
</script>

<style scoped>

.tasks-slide {
  position: relative;
  padding: 0 50px;
}

.carousel-control-prev {
  justify-content: left;
}

.carousel-control-next {
  justify-content: right;
}
</style>
