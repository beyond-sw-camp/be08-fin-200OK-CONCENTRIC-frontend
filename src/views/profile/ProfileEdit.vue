<template>
  <div class="card card-profile" style="box-shadow: none;">
    <a href="javascript:;" @click="triggerBackgroundInput">
      <div class="background-img-container">
        <img :src="background" class="background-img" alt="Background Image" />
      </div>
    </a>
    <input
        type="file"
        ref="backgroundInput"
        @change="onBackGroundFileChange"
        accept="image/*"
        style="display: none;"
    />
    <div class="row justify-content-center">
      <div class="col-4 col-lg-4 order-lg-2">
        <div class="mt-n4 mt-lg-4 mb-4 mb-lg-0">
          <a href="javascript:;" @click="triggerProfileInput" class="profile-img-container">
            <img
                :src="imageUrl"
                class="profile-img rounded-circle img-fluid border border-2 border-white"
                alt="Profile"
            />
          </a>
          <input
              type="file"
              ref="profileInput"
              @change="onProfileFileChange"
              accept="image/*"
              style="display: none;"
          />
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <label for="username" class="form-control-label">이름</label>
          <argon-input id="username" type="text" :model-value="name" disabled />
        </div>
        <div class="col-12">
          <label for="email" class="form-control-label">이메일</label>
          <argon-input id="email" type="text" :model-value="email" disabled />
        </div>
        <div class="col-12">
          <label for="joinDate" class="form-control-label">가입일</label>
          <argon-input id="joinDate" type="text" :model-value="createDate" disabled />
        </div>
      </div>
      <hr class="horizontal dark" />
      <div class="row">
        <div class="col-md-12">
          <label for="nickname" class="form-control-label">닉네임</label>
          <argon-input
              id="nickname"
              type="text"
              v-model="nickname"
          />
          <p class="mx-auto mb-4 text-sm" v-if="nicknameDuplicate">
            중복된 닉네임입니다.
          </p>
        </div>

        <div class="col-md-12">
          <label for="introduction" class="form-control-label">소개</label>
          <argon-input
              id="introduction"
              type="text"
              v-model="introduction"
          />
        </div>

      </div>
      <hr class="horizontal dark" />
      <div class="row">
        <div class="d-flex justify-content-end" style="margin-top: 20px;">
          <argon-button @click="confirmUpdate">수정 완료</argon-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/store/user";
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";

const userStore = useUserStore();
const imageUrl = ref("");
const background = ref("");
const backgroundInput = ref(null);
const profileInput = ref(null);
const name = ref("");
const email = ref("");
const createDate = ref("");
const nickname = ref("");
const introduction = ref("");

const profileFile = ref(null);
const backgroundFile = ref(null);

const nicknameDuplicate = ref(false);

const getUser = () => {
    name.value = userStore.userInfo.name;
    email.value = userStore.userInfo.email;
    createDate.value = userStore.userInfo.createDate;
    nickname.value = userStore.userInfo.nickname;
    introduction.value = userStore.userInfo.content;
};

const getProfileImage = async () => {
  imageUrl.value = userStore.userInfo.imageUrl ? userStore.userInfo.imageUrl : require('@/assets/img/애옹.png');
};

const getBackGroundImage = async () => {
  background.value = userStore.userInfo.background ? userStore.userInfo.background : require('@/assets/img/애옹.png');
};

const triggerProfileInput = () => {
  profileInput.value.click();
};

const triggerBackgroundInput = () => {
  backgroundInput.value.click();
};

const onProfileFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file); // 파일 URL로 변경
    profileFile.value = file; // 파일 객체를 저장
  }
};

const onBackGroundFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    background.value = URL.createObjectURL(file); // 파일 URL로 변경
    backgroundFile.value = file; // 파일 객체를 저장
  }
};

const confirmUpdate = () => {
  if (confirm("수정 사항을 저장하시겠습니까?")) {
    updateUser();
  }
};

const updateUser = async () => {
  const formData = new FormData();
  const user = {
    nickname: nickname.value,
    content: introduction.value,
  };
  console.log(user);
  formData.append("user", JSON.stringify(user));
  formData.append("profile", profileFile.value);
  formData.append("background", backgroundFile.value);
  console.log(introduction.value);
  try {
    const response = await axios.put('/member/update',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          validateStatus: false
        }
    );
    if(response.status === 200) {
      userStore.updateUser(response.data);
      nicknameDuplicate.value = false;
      alert("회원 정보가 변경되었습니다.");
    }else if(response.status === 409){
      nicknameDuplicate.value = true;
    }
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getUser();
  getProfileImage();
  getBackGroundImage();
});
</script>

<style scoped>
.background-img-container {
  width: 100%;
  height: 300px; /* 원하는 고정 높이 설정 */
  border-radius: 10px; /* 필요에 따라 모서리 반경 조정 */
  overflow: hidden;
  display: block;
  position: relative;
}

.background-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 컨테이너에 맞도록 조정 */
}

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
