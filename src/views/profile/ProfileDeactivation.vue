<script setup>

import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import { useUserStore } from "@/store/user";
import { ref, watch } from "vue";
import axios from 'axios';
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const password = ref('');
const passwordConfirm = ref('');
const passwordInValid = ref(false);
const passwordNotMatched = ref(false);

watch(passwordConfirm, () => {
  passwordNotMatched.value = password.value !== passwordConfirm.value;
});

watch(password, () =>{
  passwordInValid.value = false;
});


const confirmDeactivation = () => {
  if(confirm("정말 탈퇴하시겠습니까?")){
    deactivationRequest();
  }
}

const deactivationRequest = async () => {
  try {
    const response = await axios.put('member/delete',
        {
          email: userStore.userInfo['email'],
          password: password.value,
        },
        {
          validateStatus: false
        }
    );
    if(response.status === 400){
      passwordInValid.value = true;
    }else if(response.status === 200){
      userStore.clearUser();
      localStorage.removeItem("user");
      router.push("/");
    }
  }catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <div class="container">
    <div class="card">
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
            <p class="mx-auto mb-4 text-sm" v-if="passwordInValid && password && passwordConfirm">
              비밀번호가 틀렸습니다.
            </p>
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
    </div>
</template>

<style scoped>
.card{
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 600px;
  width: 120vh;
  padding-top: 6%;
}

.card-body{
  margin: 0 3rem;
}
</style>