<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import FriendProfile from './FriendProfile.vue';
import { useStateStore } from "@/store/states";

const stateStore = useStateStore();
const selectedFriend = ref(null);
const friendRequests = ref([]);
const showFriendRequests = ref([]);

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
  selectedFriend.value = friend;
};

const closeProfile = () => {
  selectedFriend.value = null;
};

const getProfileImage = (friendRequest) => {
  return friendRequest.profileImage ? friendRequest.profileImage : require('@/assets/img/default/profile.png');
};

const acceptFriend = async (friendRequest, tof, idx) => {
  try {
    const response = await axios.put("friendship/request/update",
        {
            senderId: friendRequest.memberId,
            isAccept: tof,
        });
    if(response.status === 200){
      showFriendRequests.value[idx] = false;
      stateStore.decreaseNumOfFriendRequests();
      console.log(stateStore.numOfFriendRequests);
    }
  }catch(err) {
    console.log(err);
  }
};

onMounted(() => {
  getFriendRequests();
});

</script>

<template>
  <div class="friend-list">
    <!--    <h2 class="friend-list-title">친구 요청</h2>-->
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
                  @click="acceptFriend(friendRequest, false, i)"
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
</template>

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