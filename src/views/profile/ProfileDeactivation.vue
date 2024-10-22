<script setup>

import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import { useUserStore } from "@/store/user";
import { ref, watch } from "vue";
import axios from 'axios';

const userStore = useUserStore();

const password = ref('');
const passwordConfirm = ref('');
const passwordInValid = ref(false);
const passwordNotMatched = ref(false);

watch(passwordConfirm, () => {
  passwordNotMatched.value = password.value !== passwordConfirm.value;
});


const confirmDeactivation = () => {
  if(confirm("정말 탈퇴하시겠습니까?")){
    deactivationRequest();
  }
}

const deactivationRequest = () => {
  return;
}

</script>

<template>
  <div class="card card-profile col-md-8" style="box-shadow: none;">
    <div class="card-body">
      <hr class="horizontal dark" />
      <div class="row">
        <div class="col-md-12">
          <label for="password" class="form-control-label">비밀번호</label>
          <argon-input
              id="password"
              type="password"
              v-model="password"
          />
        </div>

        <div class="col-md-12">
          <label for="password" class="form-control-label">비밀번호 확인</label>
          <argon-input
              id="passwordConfirm"
              type="password"
              v-model="passwordConfirm"
          />
          <p class="mx-auto mb-4 text-sm" v-if="passwordNotMatched && password && passwordConfirm">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>
        <div class="d-flex justify-content-center" style="margin-top: 20px;">
          <argon-button class="btn-danger" v-if="!passwordNotMatched && passwordConfirm" @click="confirmDeactivation">회원 탈퇴</argon-button>
        </div>

      </div>
      <hr class="horizontal dark" />

    </div>
  </div>
</template>

<style scoped>

</style>