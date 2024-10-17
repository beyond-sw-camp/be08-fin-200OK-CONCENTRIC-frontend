<template>
  <div class="friend-list">
    <h2 class="friend-list-title">친구 목록</h2>
    <div class="friend-cards">
      <div class="friend-card" v-for="friend in friends" :key="friend.id">
        <img :src="friend.profileImage" alt="Profile Image" class="friend-image" />
        <div class="friend-info">
          <h5 class="friend-name">{{ friend.name }}</h5>
          <p class="friend-status">{{ friend.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const friends = ref([
  {id: 1, name: '홍길동', status: '온라인', profileImage: 'path/to/image1.jpg'},
  {id: 2, name: '이순신', status: '오프라인', profileImage: 'path/to/image2.jpg'},
  {id: 3, name: '김유신', status: '온라인', profileImage: 'path/to/image3.jpg'},
  // 더 많은 친구들 추가...
]);
</script>

<style scoped>
.friend-list {
  padding: 20px;
}

.friend-list-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.friend-cards {
  display: flex;
  flex-direction: column;
}

.friend-card {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.friend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.friend-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.friend-info {
  flex-grow: 1;
}

.friend-name {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
}

.friend-status {
  margin: 0;
  color: #666;
}
</style>
