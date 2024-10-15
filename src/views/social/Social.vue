<template>
  <div class="friend-list">
    <h2 class="title">친구 목록</h2>
    <ul class="friend-items">
      <li v-for="friend in friends" :key="friend.id" class="friend-item">
        <img src="../../assets/img/koongya.png" alt="Profile Picture" class="profile-pic" />
        <span class="friend-name">{{ friend.nickname }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import axios from "axios";

const friends = ref();

const loadFriends = async () => {
  const response = await axios.get('/friendship/list/accept');
  friends.value = response.data;

};

onMounted(() => {
  loadFriends();
});

</script>

<style scoped>
.friend-list {
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  margin-bottom: 16px;
  text-align: center;
}

.friend-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.friend-item:last-child {
  border-bottom: none;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.friend-name {
  font-size: 16px;
}
</style>
