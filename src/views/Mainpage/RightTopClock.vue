<template>
  <div class="clock-container">
    <div class="time">{{ formattedTime }}</div>
    <div class="date-container">
      <div class="date">{{ formattedDate }}</div>
      <div class="day">{{ formattedDay }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 상태 변수 선언
const currentTime = ref(new Date());
const formattedTime = ref('');
const formattedDate = ref('');
const formattedDay = ref('');

// 요일 배열 상수로 선언
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 시간 포맷 업데이트 함수
const updateTime = () => {
  const date = currentTime.value;

  // 시간, 날짜, 요일을 각각 포맷팅
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  formattedTime.value = `${hour}:${minute}:${second}`;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  formattedDate.value = `${month}-${day}`;

  formattedDay.value = WEEKDAYS[date.getDay()];
};

// 매초마다 시간을 업데이트하기 위한 타이머 설정
let updateInterval;
onMounted(() => {
  updateTime(); // 컴포넌트 마운트 시 바로 시간 업데이트
  updateInterval = setInterval(() => {
    currentTime.value = new Date();
    updateTime();
  }, 1000);
});

// 컴포넌트가 언마운트될 때 타이머 해제
onUnmounted(() => {
  clearInterval(updateInterval);
});
</script>

<style scoped>
.clock-container {
  position: fixed;
  top: 20px;
  right: 40px;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0); /* 투명 배경 */
  padding: 10px;
  border-radius: 12px;
  font-family: 'Consolas', sans-serif;
  color: #000; /* 검은색 텍스트 */
  z-index: 10000;
  text-align: right;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.clock-container:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.5);
}

.time {
  font-size: 80px; /* 시간 폰트 크게 */
  font-weight: bold;
  line-height: 1;
  margin-right: 10px;
}

.date-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.date,
.day {
  font-size: 20px; /* 날짜와 요일 폰트 사이즈 동일하게 설정 */
  font-weight: normal;
}
</style>
