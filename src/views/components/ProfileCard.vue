<template>
  <div class="card card-profile" style="box-shadow: none;">
    <img
        src="../../assets/img/bg-profile.jpg"
        alt="Image placeholder"
        class="card-img"
    />
    <div class="row justify-content-center">
      <div class="col-4 col-lg-4 order-lg-2">
        <div class="mt-n4 mt-lg-4 mb-4 mb-lg-0">
          <a href="javascript:;" @click="triggerFileInput" class="profile-img-container">
            <!-- 이미지 바인딩 -->
            <img
                :src="imageUrl"
                class="profile-img rounded-circle img-fluid border border-2 border-white"
                alt="Profile"
            />
          </a>
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
    <div class="d-flex justify-content-end pe-4" style="font-size: 0.5rem">
      <argon-button>Edit Profile</argon-button>
    </div>

    <div class="card-body pt-0">
      <div class="text-center mt-4">
        <h5>
          Mark Davis
          <span class="font-weight-light">, 35</span>
        </h5>
        <div class="h6 font-weight-300">
          <i class="ni location_pin mr-2"></i>Bucharest, Romania
        </div>
        <div class="h6 mt-4">
          <i class="ni business_briefcase-24 mr-2"></i>Solution Manager - Creative Tim Officer
        </div>
        <div>
          <i class="ni education_hat mr-2"></i>University of Computer Science
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import { ref } from 'vue';

const imageUrl = ref(require('../../assets/img/team-2.jpg'));

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};

// 파일 변경 핸들러
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result; // 선택된 이미지로 URL 변경
    };
    reader.readAsDataURL(file); // 파일을 데이터 URL로 변환
  }
};
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