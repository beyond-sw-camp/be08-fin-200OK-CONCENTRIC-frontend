<template>
  <div class="page-container">
    <div class="modal-content">
      <div class="details-section">
        <div class="modal-header">
          <h5 class="modal-title">비밀번호 찾기</h5>
          <button @click="$emit('close')" class="close">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="confirm">
            <div class="form-group">
              <label for="email">이메일 주소를 입력하세요</label>
              <input type="email" id="email" v-model="email" class="form-control" required />
            </div>
            <argon-button variant="gradient" class="btn-success btn" color="success" size="lg"
            @click="sendPassword(email)">
              확인
            </argon-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { defineEmits } from 'vue';

const router = useRouter();
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const email = ref("");
const emit = defineEmits(['close']);

const sendPassword = (email) => {
  if(emailPattern.test(email.value)){
    alert("유효하지 않은 형식 입니다.");
    return;
  }
  sendApi();
};

const sendApi = async () => {
  try {
    const response = await axios.post("email/send/reset",
        null,
        {
          params: {
            email: email.value
          },
          validateStatus: false
        }
    );
    if (response.status === 200) {
      alert("이메일로 초기화된 비밀번호가 전송되었습니다.");
      emit('close');
      router.push("/");
    } else if (response.status === 404) {
      alert("존재하지 않는 유저입니다.");
    } else {
      alert("전송에 실패했습니다.");
    }
  } catch (error) {
    console.log(error);
  }
};

</script>

<style scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  position: relative;
  z-index: 10001; /* modal-content도 높은 z-index */
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
