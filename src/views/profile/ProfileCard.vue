<template>
  <div class="card card-profile" style="box-shadow: none; ">
    <img
        :src="background"
        alt="Image placeholder"
    />
    <div class="row justify-content-center">
      <div class="col-4 col-lg-4 order-lg-2">
        <div class="mt-n4 mt-lg-4 mb-4 mb-lg-0">

            <!-- 이미지 바인딩 -->
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
      </div>
    </div>
<!--    <div class="d-flex justify-content-end pe-4" style="font-size: 0.5rem">-->
<!--      <router-link to="/profile/edit">-->
<!--        <argon-button>Edit profile</argon-button>-->
<!--      </router-link>-->
<!--    </div>-->

    <div class="card-body pt-0">
      <div class="text-center mt-4">
        <h5>
          {{ userStore.userInfo['nickname'] }}
<!--          <span class="font-weight-light">, 35</span>-->
        </h5>
<!--        <div class="h6 font-weight-300">-->
<!--          <i class="ni location_pin mr-2"></i>Bucharest, Romania-->
<!--        </div>-->
        <div class="h6 mt-4">
          <i class="ni business_briefcase-24 mr-2"></i>{{ userStore.userInfo['content'] }}
        </div>
<!--        <div>-->
<!--          <i class="ni education_hat mr-2"></i>University of Computer Science-->
<!--        </div>-->
        <div class="h6 mt-4">
          <i class="ni business_briefcase-24 mr-2"></i>가입일 : {{ userStore.userInfo['createDate'] }}
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

const getProfileImage = async (fileUrl) => {
  try {
    const response = await axios.post('storage/image/profile',
        null,
        {
          params: {
            path: userStore.userInfo['imageUrl'],
          },
          responseType: 'blob',
        },
    );
    imageUrl.value = URL.createObjectURL(response.data);
  } catch (error) {
    console.error(error);
  }
};

const getBackGroundImage = async (fileUrl) => {
  try {
    const response = await axios.post('storage/image/profile',
        null,
        {
          params: {
            path: userStore.userInfo['background'],
          },
          responseType: 'blob',
        },
    );
    background.value = URL.createObjectURL(response.data);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getProfileImage();
  getBackGroundImage();
});
</script>
<style scoped>

.profile-img-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  position: relative;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 원형 내에 잘 맞도록 */
  border-radius: 50%; /* 이미지도 원형으로 */
}
</style>