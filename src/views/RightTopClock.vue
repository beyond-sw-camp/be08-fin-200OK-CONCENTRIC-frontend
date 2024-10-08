<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref(new Date()); // 현재 시간으로 초기화

const updateTime = () => {
  currentTime.value = new Date();
};

let intervalId;
onMounted(() => {
  intervalId = setInterval(updateTime, 1000); // 매초마다 시간 업데이트
});

onUnmounted(() => {
  clearInterval(intervalId); // 컴포넌트가 언마운트되면 타이머 해제
});

const formatTime = (date) => {
  if (!date) return 'ㅠㅠ'; // date가 null일 경우 빈 문자열 반환
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day} ${dayName} ${hour}:${minute}:${second}`;
};
</script>

<template>
  <div>
    <h1>Current Time</h1>
    <p>{{ formatTime(currentTime.value) }}</p>
  </div>
</template>

<style scoped>
h1 {
  font-family: 'Consolas', sans-serif;
  color: #8A9BF9;
}
p {
  font-size: 24px;
}
</style>
