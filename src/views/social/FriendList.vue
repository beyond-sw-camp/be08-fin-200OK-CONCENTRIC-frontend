<template>
  <div class="friend-list">
    <h2 class="friend-list-title">친구 요청</h2>
    <div class="friend-cards">
      <transition-group name="fade" tag="ul" style="margin-left: 0; padding-left: 0;">
        <ul v-for="(friendRequest, i) in friendRequests" :key="friendRequest.id" style="list-style: none; margin-left: 0; padding-left: 0;">
          <transition name="fade">
            <div class="friend-card"
                 style="display: flex; justify-content: space-between; align-items: center;"
                 v-if="showFriendRequests[i]">
              <img :src="getProfileImage(friendRequest)" alt="Profile Image" class="friend-image" @click="openProfile(friendRequest)"/>
              <div class="friend-info">
                <h5 class="friend-name">{{ friendRequest.nickname }}</h5>
              </div>
              <button
                  class="btn btn-outline btn-sm"
                  style="justify-content: center; margin: 0 auto; margin-right: 10px;"
                  @click="acceptFriend(friendRequest, true, i)"
              >
                수락
              </button>
              <button
                  class="btn btn-outline-danger btn-sm"
                  style="justify-content: center; margin: 0 auto;"
                  @click="acceptFriend(friendRequest, true, i)"
              >
                거절
              </button>

            </div>
          </transition>
        </ul>
      </transition-group>
    </div>
    <!-- 프로필 모달 -->
    <friend-profile v-if="selectedFriend" :friend="selectedFriend" :show-modal="true" @close="closeProfile" />
  </div>
  <div class="friend-list">
    <h2 class="friend-list-title">친구 목록</h2>
    <div class="friend-cards">
      <transition-group name="fade" tag="ul" style="margin-left: 0; padding-left: 0;">
        <ul v-for="(friend, i) in friends" :key="friend.id" style="list-style: none; margin-left: 0; padding-left: 0;">
          <transition name="fade">
          <div class="friend-card"
               style="display: flex; justify-content: space-between; align-items: center;"
               v-if="showFriends[i]">
            <img :src="getProfileImage(friend)" alt="Profile Image" class="friend-image" @click="openProfile(friend)"/>
            <div class="friend-info">
              <h5 class="friend-name">{{ friend.nickname }}</h5>
            </div>
            <button
                class="btn btn-outline-danger btn-sm"
                style="justify-content: center; margin: 0 auto;"
                @click="deleteConfirm(friend, i)"
            >
              친구 삭제
            </button>

          </div>
          </transition>
        </ul>
      </transition-group>
    </div>
    <!-- 프로필 모달 -->
    <friend-profile v-if="selectedFriend" :friend="selectedFriend" :show-modal="true" @close="closeProfile" />
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import FriendProfile from './FriendProfile.vue';
import { useStateStore } from "@/store/states";

const stateStore = useStateStore();
const friends = ref([]);
const selectedFriend = ref(null);
const showFriends = ref([]);
const friendRequests = ref([]);
const showFriendRequests = ref([]);

const getFriends = async () => {
  try {
    const response = await axios.get('friendship/list');
    friends.value = response.data;
    friends.value.forEach((friend) => {
      showFriends.value.push(true);
    });
  } catch (err) {
    console.log(err);
  }
};

const getFriendRequests = async () => {
  try {
    const response = await axios.get('friendship/request/list');
    friendRequests.value = response.data;
    friendRequests.value.forEach((friend) => {
      showFriendRequests.value.push(true);
    });
  }catch(err) {
    console.log(err);
  }
}

const openProfile = (friend) => {
  selectedFriend.value = friend; // 선택된 친구 설정
};

const closeProfile = () => {
  selectedFriend.value = null; // 선택된 친구 초기화
};

const getProfileImage = (friend) => {
  return friend.profileImage ? friend.profileImage : require('@/assets/img/애옹.png');
};

const deleteConfirm = (friend, idx) => {
  if(confirm(`${friend.nickname} 님을 삭제하시겠습니까?`)){
    deleteFriend(friend, idx);
  }
}

const deleteFriend = async (friend, idx) => {
  try {
    const response = await axios.delete(`friendship/delete/${friend.id}`);
    if(response.status === 200){
      showFriends.value[idx] = false;
    }
  }catch (err) {
    console.error(err);
  }
}

const acceptFriend = async (friendRequest, tof, idx) => {
  try {
    const response = await axios.get("friendship/request/update",
        {
          params: {
            senderId: friendRequest.memberId,
            isAccept: tof,
          }
        });
    if(response.status === 200){
      showFriends.value[idx] = false;
      stateStore.decreaseNumOfFriendRequests();
    }
  }catch(err) {
    console.log(err);
  }
}

onMounted(() => {
  getFriends();
  getFriendRequests();
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
