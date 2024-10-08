<template>
  <div>
    <Calendar
        ref="calendar"
        :initial-page="initialPage"
        :color="selectedColor"
        :attributes="attrs"
        transparent
        borderless
        expanded
    />

    <!-- Argon 버튼 스타일 적용 -->
    <div class="w-full px-4 pb-3">
      <button
          class="btn btn-primary w-100"
          @click="moveToday"
      >
        Today
      </button>
    </div>

    <DatePicker v-model="date" />
  </div>
</template>

<script>
import { ref } from 'vue';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

export default {
  components: {
    Calendar,
    DatePicker,
  },
  setup() {
    const selectedColor = ref('teal');
    const attrs = ref([{
      key: 'test',
      highlight: true,
      dates: {start: new Date(2024, 10, 4), end: new Date(2024, 10, 6)},
    }]);

    const date = ref(new Date());
    const calendar = ref(null);

    // 오늘 기준으로 initial-page 설정
    const today = new Date();
    const initialPage = ref({
      month: today.getMonth() + 1, // JS에서의 month는 0부터 시작하므로 +1
      year: today.getFullYear(),
    });

    const moveToday = () => {
      calendar.value.move(new Date());
    };

    return {
      selectedColor,
      attrs,
      date,
      calendar,
      moveToday,
      initialPage,
    };
  },
};
</script>
