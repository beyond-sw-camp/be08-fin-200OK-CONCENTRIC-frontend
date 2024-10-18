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
        <CalenderView />
      </div>
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

  </div>
</template>

<script setup>
import {ref} from 'vue';
import Tasks from '@/views/mainpage/components/Tasks.vue';
import RightTopClock from '@/views/navbar/RightTopClock.vue';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import CalenderView from "@/views/calender/CalenderView.vue";

// State variables
const currentView = ref('tasks');

// Methods
const toggleView = () => {
  currentView.value = currentView.value === 'tasks' ? 'calendar' : 'tasks';
};
</script>
