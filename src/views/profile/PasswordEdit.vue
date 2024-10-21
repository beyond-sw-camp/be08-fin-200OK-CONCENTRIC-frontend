<script setup>

import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import { useUserStore } from "@/store/user";
import { ref, watch } from "vue";
import axios from 'axios';

const userStore = useUserStore();

const previousPassword = ref('');
const password = ref('');
const passwordConfirm = ref('');
const passwordInValid = ref(false);
const passwordPatternInvalid = ref(true);
const passwordNotMatched = ref(false);

const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

watch(password, (newPassword) => {
  passwordPatternInvalid.value = !passwordPattern.test(newPassword);
});

watch(passwordConfirm, () => {
  passwordNotMatched.value = password.value !== passwordConfirm.value;
});


const confirmUpdatePassword = () => {
  if(confirm("비밀번호를 변경하시겠습니까?")){
    if(password.value !== passwordConfirm.value){
      passwordNotMatched.value = true;
      return;
    }
    passwordNotMatched.value = false;
    updatePassword();
  }
}

const updatePassword = async () => {
  try {
    const response = await axios.post('member/password',
        null,
        {
          params: {
            previous: previousPassword.value,
            current: password.value,
          }
        }
    );
    if(response.status === 400){
      passwordInValid.value = true;
    }
  }catch(error){
    console.log(error);
  }
}

</script>

<template>
  <div class="card card-profile col-md-8" style="box-shadow: none;">
    <div class="card-body">
      <hr class="horizontal dark" />
      <div class="row">
        <div class="col-md-12">
          <label for="password" class="form-control-label">이전 비밀번호</label>
          <argon-input
              id="previousPassword"
              type="password"
              v-model="previousPassword"
          />
          <p class="mx-auto mb-4 text-sm" v-if="passwordInValid && previousPassword">
            비밀번호가 틀렸습니다.
          </p>
        </div>

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
          <p class="mx-auto mb-4 text-sm" v-if="passwordPatternInvalid && password">
            비밀번호는 특수문자, 영문, 숫자가 각각 포함된 8자리 이상이어야 합니다.
          </p>
        </div>
        <div class="d-flex justify-content-center" style="margin-top: 20px;">
          <argon-button v-if="!passwordPatternInvalid && !passwordNotMatched && passwordConfirm" @click="confirmUpdatePassword">비밀번호 변경</argon-button>
        </div>

      </div>
      <hr class="horizontal dark" />

    </div>
  </div>
</template>

<style scoped>

</style>