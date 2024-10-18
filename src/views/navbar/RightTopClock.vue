<template>
  <div class="clock-container">
<!--    <div>{{ formattedTime }}</div>-->
    <div style="white-space: nowrap">{{ formattedDate }}</div>
    <div>{{ formattedDay }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 상태 변수 선언
const currentTime = ref(new Date());
const formattedTime = ref('');
const formattedDate = ref('');
const formattedDay = ref('');
const mouseX = ref(0);
const mouseY = ref(0);

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
  formattedDate.value = `${month}.${day}`;

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


// 마우스가 시계 위에 없을 때의 처리
const handleMouseLeave = () => {
  mouseX.value = 0;
  mouseY.value = 0;
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.clock-container {
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-family: 'Inter', sans-serif;
}

.clock-container div {
  white-space: nowrap;
}
</style>