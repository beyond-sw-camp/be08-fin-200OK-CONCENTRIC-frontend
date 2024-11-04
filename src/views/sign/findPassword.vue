<template>
  <div class="page-container">
    <div class="modal-content">
      <div class="details-section">
        <div class="modal-header">
          <h5 class="modal-title">비밀번호 찾기</h5>
          <button @click="closeModal" class="close">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="confirm">
            <div class="form-group">
              <label for="email">이메일 주소를 입력하세요</label>
              <input type="email" id="email" v-model="email" class="form-control" required />
            </div>
            <argon-button variant="gradient" class="btn-success btn" color="success" size="lg" @click="confirm">
              확인
            </argon-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FindPassword',
  setup() {
    const email = ref("");

    function confirm() {
      alert(`이메일(${email.value})로 비밀번호 찾기 요청이 전송되었습니다.`);
    }

    return {
      email,
      confirm,
    };
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
