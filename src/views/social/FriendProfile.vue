<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeProfile">
    <div class="modal-content">
      <div class="card card-profile">
        <img :src="getBackgroundImage(friend.backgroundImage)" alt="Image placeholder" class="background-img"/>
        <div class="row justify-content-center">
          <div class="col-4 col-lg-4 order-lg-2">
            <div class="mt-n4 mt-lg-4 mb-4 mb-lg-0">
            <div class="profile-image-container">
              <img :src="getImage(friend.profileImage)" class="profile-image rounded-circle img-fluid border border-2 border-white" alt="Profile"/>
            </div>
          </div>
        </div>
        </div>
        <div class="card-body pt-0">
          <div class="text-center mt-4">
            <h5>{{ friend.nickname }}</h5>
            <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>{{ friend.content }}</div>
            <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>가입일 : {{ friend.createDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
  friend: Object,
  showModal: Boolean // 모달 표시 여부
});

// defineEmits에 이벤트 이름을 정의
const emit = defineEmits(['close']);

const closeProfile = () => {
  emit('close'); // 부모 컴포넌트에 이벤트 전파
};

const getImage = (image) => {
  return image ? image : require('@/assets/img/default/profile.png');
};

const getBackgroundImage = (image) => {
  return image ? image : require('@/assets/img/default/background.jpg');
};

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 5px;
  width: 40%;
  height: auto;
  max-width: 90%;
  position: relative;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  margin-top: -60%; /* 배경 이미지와 겹치도록 음수 마진 */
}

.profile-image {
  border-radius: 50%;
  min-width: 150px;
  min-height: 150px;
  max-width: 150px;
  max-height: 150px;
  object-fit: cover;
}

.background-img {
  background-size: cover; /* 이미지가 요소를 가득 채우도록 설정 */
  object-fit: cover;
  background-position: center; /* 중앙에 위치하도록 설정 */
  height: 300px; /* 원하는 높이 설정 (필요에 따라 조정) */
  border-radius: 8px; /* 모서리 둥글게 */
  padding: 10px; /* 내부 여백 */
  display: flex; /* 자식 요소를 유연하게 배치 */
  /* flex-direction: column; 세로 방향으로 정렬 */
  /* justify-content: flex-end; 내용 하단 정렬 */
}

</style>
