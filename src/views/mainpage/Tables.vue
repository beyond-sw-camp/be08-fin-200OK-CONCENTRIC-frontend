<template>
  <div class="py-4 container-fluid">
    <!-- Left arrow (fixed) -->
    <a
        class="page-link"
        href="#"
        aria-label="Previous"
        style="position: fixed; left: 20px; top: 50%; transform: translateY(-50%); z-index: 10;"
        @click.prevent="toggleView"
    >
      <i class="fa fa-angle-left"></i>
      <span class="sr-only">Previous</span>
    </a>

    <!-- Tasks and Calendar components (toggle view) -->
    <div v-if="currentView === 'tasks'" class="tasks-container mx-5" style="min-height: 600px;">
      <Tasks />
    </div>
    <div v-else-if="currentView === 'calendar'" class="card calendar-container mx-5 mt-0 p-3 shadow-sm" style="min-height: 600px;">
      <div class="card-body">
        <Calendar
            ref="calendar"
            :initial-page="initialPage"
            :color="selectedColor"
            :attributes="attrs"
            transparent
            borderless
            expanded
        />
        <div class="w-full px-4 pb-3 mt-3">
          <button class="btn btn-primary w-100" @click="moveToday">
            Today
          </button>
        </div>
      </div>
      <week-calender/>
    </div>

    <!-- Right arrow (fixed) -->
    <a
        class="page-link"
        href="#"
        aria-label="Next"
        style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 10;"
        @click.prevent="toggleView"
    >
      <i class="fa fa-angle-right"></i>
      <span class="sr-only">Next</span>
    </a>

    <!-- Clock Component -->
<!--    <div class="mt-5">-->
<!--      <RightTopClock />-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Tasks from '@/views/mainpage/components/Tasks.vue';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import WeekCalender from "@/views/Calender/WeekCalender.vue";

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
