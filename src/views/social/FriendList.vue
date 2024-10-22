<template>
  <div class="friend-list">
    <h2 class="friend-list-title">친구 목록</h2>
    <div class="friend-cards">
      <div class="friend-card" v-for="friend in friends" :key="friend.id" >
        <img :src="getProfileImage(friend.profileImage)" alt="Profile Image" class="friend-image" @click="openProfile(friend)"/>
        <div class="friend-info">
          <h5 class="friend-name">{{ friend.nickname }}</h5>
        </div>
      </div>
    </div>

    <!-- 프로필 모달 -->
    <friend-profile v-if="selectedFriend" :friend="selectedFriend" :show-modal="true" @close="closeProfile" />
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import FriendProfile from './FriendProfile.vue'; // 모달 컴포넌트 임포트

const friends = ref([]);
const selectedFriend = ref(null); // 선택된 친구를 저장할 상태

const getFriends = async () => {
  try {
    const response = await axios.get('friendship/list');
    friends.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const openProfile = (friend) => {
  selectedFriend.value = friend; // 선택된 친구 설정
};

const closeProfile = () => {
  selectedFriend.value = null; // 선택된 친구 초기화
};

const getProfileImage = (imageString) => {
  if (imageString == null) {
    return require('@/assets/img/애옹.png');
  }
  const byteCharacters = atob(imageString);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: 'image'});
  return URL.createObjectURL(blob);
};

onMounted(() => {
  getFriends();
});
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
