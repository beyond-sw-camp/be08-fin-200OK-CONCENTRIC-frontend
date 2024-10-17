<script setup>

</script>

<template>
  <div class="col-md-2">
    <div class="list-group shadow-sm">
      <router-link to="/profile" class="list-group-item list-group-item-action">내 프로필</router-link>
      <router-link to="/profile/edit" class="list-group-item list-group-item-action">내 정보 수정</router-link>
      <router-link to="/storage/private" class="list-group-item list-group-item-action">내 파일함</router-link>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  transition: background-color 0.3s, color 0.3s;
  margin-bottom: 10px; /* 링크 간의 간격 증가 */
  border: none; /* 경계선 제거 */
  border-radius: 5px;
  background-color: transparent;
}

.list-group-item:hover {
  background-color: #007BFF; /* Hover 배경색 */
  color: white; /* Hover 텍스트 색상 */
}
</style>