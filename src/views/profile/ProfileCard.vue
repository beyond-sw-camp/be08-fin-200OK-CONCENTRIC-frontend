<template>
  <div class="container">
    <div class="card card-profile"
         :style="{ backgroundImage: `url(${background})`}"
    >
    <div class="card-profile">
      <div class="card-body pt-0">
        <div class="d-flex flex-column align-items-center mt-8">
          <img
              :src="imageUrl"
              class="profile-img rounded-circle img-fluid border border-2 border-white"
              alt="Profile"
          />
          <input
              type="file"
              ref="fileInput"
              @change="onFileChange"
              accept="image/*"
              style="display: none;"
          />
        </div>
        <div class="text-center mt-4">
          <h5>
            {{ userStore.userInfo['nickname'] }}
          </h5>
          <div class="h6 mt-4">
            <i class="ni business_briefcase-24 mr-2"></i>{{ userStore.userInfo['content'] }}
          </div>
          <div class="h6 mt-4">
            <i class="ni business_briefcase-24 mr-2"></i>가입일 : {{ userStore.userInfo['createDate'] }}
          </div>
        </div>
      </div>
    </div>

    </div>
  </div>
</template>

<script setup>
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import {onMounted, ref} from 'vue';
import axios from 'axios';
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const imageUrl = ref("");
const background = ref("");

const getProfileImage = async () => {
  imageUrl.value = userStore.userInfo.imageUrl ? userStore.userInfo.imageUrl : require('@/assets/img/default/profile.png');
  console.log(imageUrl.value);
};

const getBackGroundImage = async () => {
  background.value = userStore.userInfo.background ? userStore.userInfo.background : require('@/assets/img/default/background.jpg');
};

onMounted(() => {
  getProfileImage();
  getBackGroundImage();
});
</script>
<style scoped>
.profile-img {
  width: 8rem;
  height: 8rem;
  object-fit: cover; /* 이미지가 원형 내에 잘 맞도록 */
  border-radius: 50%; /* 이미지도 원형으로 */
  background-position: center;
}

.background-image {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.card-profile{
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 20rem;
  width: 120vh;
  padding-top: 6%;
}
.content-over-background {
  position: relative;
  z-index: 2;
}
.card-body{
  z-index:2;
}
.card{
  border-right:none;
}
</style>