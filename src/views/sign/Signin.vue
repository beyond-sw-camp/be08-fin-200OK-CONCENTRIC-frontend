<template>
  <div class="py-4 container-fluid d-flex justify-content-center align-items-center min-vh-100">
    <main class="mt-0 main-content d-flex justify-content-center align-items-center" :class="{ 'right-panel-active': isRightPanelActive }">
      <div class="page-header min-vh-50 d-flex justify-content-center align-items-center rounded shadow-sm" style="width: 750px;">
        <div class="container" style="border-radius: 20px;">
          <div class="row">
            <!-- 로그인 폼 -->
            <div class="mx-auto col-12 col-md-6 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start" style="background: transparent;">
                  <h4 class="font-weight-bolder">로그인</h4>
                  <p class="mb-0">이메일과 비밀번호를 입력하세요.</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <argon-input
                          id="loginEmail"
                          type="email"
                          placeholder="Email"
                          name="loginEmail"
                          size="lg"
                          v-model="loginEmail"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                          id="loginPassword"
                          type="password"
                          placeholder="Password"
                          name="loginPassword"
                          size="lg"
                          v-model="loginPassword"
                      />
                    </div>
                    <!-- <argon-switch id="rememberMe" name="remember-me">
                      Remember me
                    </argon-switch> -->
                    <div class="text-center">
                      <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          @click="login"
                      >
                        로그인
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    계정이 없으신가요?
                    <a
                        href="javascript:;"
                        class="text-success text-gradient font-weight-bold"
                        @click="signUp"
                    >
                      회원 가입
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <!-- 회원가입 폼 -->
            <div class="mx-auto col-12 col-md-6 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start" style="background: transparent;">
                  <h4 class="font-weight-bolder">회원 가입</h4>
                  <p class="mb-0">이메일과 비밀번호를 입력하세요.</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <argon-input
                          id="signupEmail"
                          type="email"
                          placeholder="Email"
                          name="signupEmail"
                          size="lg"
                          v-model="signupEmail"
                      />
                      <p class="mx-auto mb-4 text-sm" v-if="isVerified">
                        이메일 인증이 완료되었습니다
                      </p>
                      <p class="mx-auto mb-4 text-sm" v-if="!isVerified && isSent && onVerifying">
                        인증에 실패했습니다
                      </p>
                      <p class="mx-auto mb-4 text-sm" v-if="!isVerified && duplicated">
                        이미 가입된 이메일입니다
                      </p>
                      <p class="mx-auto mb-4 text-sm" v-if="emailPatternInvalid && signupEmail">
                        잘못된 형식입니다
                      </p>
                    </div>

                    <div class="mb-3" v-if="isVerified">
                      <argon-input
                          id="signupPassword"
                          type="password"
                          placeholder="Password"
                          name="signupPassword"
                          size="lg"
                          v-model="signupPassword"
                      />
                      <p class="mx-auto mb-4 text-sm" v-if="passwordPatternInvalid && signupPassword">
                        비밀번호는 특수문자, 영문, 숫자가 각각 포함된 8자리 이상이어야 합니다.
                      </p>
                    </div>
                    <div class="mb-3" v-if="isVerified">
                      <argon-input
                          id="name"
                          type="name"
                          placeholder="Name"
                          name="name"
                          size="lg"
                          v-model="signupName"
                      />
                    </div>
                    <div class="mb-3" v-if="isVerified">
                      <argon-input
                          id="nickname"
                          type="nickname"
                          placeholder="Nickname"
                          name="nickname"
                          size="lg"
                          v-model="signupNickname"
                      />
                      <p class="mx-auto mb-4 text-sm" v-if="nicknameDuplicate && signupNickname">
                        이미 사용중인 닉네임입니다
                      </p>
                    </div>

                    <div class="mb-3" v-if="!isVerified && isSent">
                      <argon-input
                          id="verificationCode"
                          type="verificationCode"
                          placeholder="Verification Code"
                          name="verificationCode"
                          size="lg"
                          v-model="verificationCode"
                      />
                    </div>
                    
                    <div class="text-center" v-if="!isVerified && !isSent">
                      <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          @click="sendCode"
                      >
                        인증번호 전송
                      </argon-button>
                    </div>
                    <div class="text-center" v-if="!isVerified && isSent">
                      <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          @click="verifyCode"
                      >
                        인증
                      </argon-button>
                    </div>
                    <div class="text-center" v-if="isVerified">
                      <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          @click="signup"
                      >
                        회원 가입
                      </argon-button>
                    </div>
                    
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    이미 계정이 있으신가요?
                    <a
                        href="javascript:;"
                        class="text-success text-gradient font-weight-bold"
                        @click="signIn"
                    >
                      로그인
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- 오버레이 컨테이너 -->
          <div class="overlay-container">
            <div class="overlay">
              <div class="overlay-panel overlay-left">
                <h2 style="background: linear-gradient(to right, #9de0f6, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">환영합니다!</h2>
                <p>간단한 정보를 입력 후 이용하세요</p>
                <argon-button
                    class="ghost"
                    variant="gradient"
                    color="success"
                    @click="signIn"
                >
                  로그인
                </argon-button>
              </div>
              <div class="overlay-panel overlay-right" v-if="!isRegistered">
                <h2 style="color: #9de0f6">안녕하세요!</h2>
                <p>계정이 없다면 가입하세요</p>
                <argon-button
                    class="ghost"
                    variant="gradient"
                    color="success"
                    @click="signUp"
                >
                  회원 가입
                </argon-button>
              </div>
              <div class="overlay-panel overlay-right" v-if="isRegistered">
                <h1 style="color: #9de0f6">가입되었습니다!</h1>
                <p>이제 이메일과 비밀번호를 입력하세요.</p>
                <argon-button
                    class="ghost"
                    variant="gradient"
                    color="success"
                    @click="signUp"
                >
                  회원 가입
                </argon-button>
              </div>
            </div>
          </div>
          <!-- 오버레이 컨테이너 끝 -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {ref, onBeforeUnmount, onBeforeMount, onMounted, watch} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.js";
import axios from "axios";

import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import ArgonSwitch from "@/components/ArgonComponents/ArgonSwitch.vue";


const store = useStore();
const router = useRouter();
const userStore = useUserStore();

const loginEmail = ref("");
const loginPassword = ref("");

const isVerified = ref(false);
const isSent = ref(false);
const onVerifying = ref(false);
const duplicated = ref(false);
const isRegistered = ref(false);
const nicknameDuplicate = ref(false);
const passwordPatternInvalid = ref(false);
const emailPatternInvalid = ref(false);

const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const verificationCode = ref("");
const signupEmail = ref("");
const signupPassword = ref("");
const signupName = ref("");
const signupNickname = ref("");

watch(signupPassword, (newPassword) => {
  passwordPatternInvalid.value = !passwordPattern.test(newPassword);
});

watch(signupEmail, (newEmail) => {
  emailPatternInvalid.value = !emailPattern.test(newEmail);
});

watch()

const isRightPanelActive = ref(false);
const signUp = () => {
  isRightPanelActive.value = true;
};
const signIn = () => {
  isRightPanelActive.value = false;
};

const login = (event) => {
  event.preventDefault();
  loginApi();
};
const loginApi = async () => {
  try {
    const response = await axios.post(
        "/member/login",
        {
          email: loginEmail.value,
          password: loginPassword.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: false
        }
    );
    if(response.status === 200){

      userStore.setUser(response.data);
      userStore.setToken(response.headers.authorization);
      userStore.setTeamId(null);
      
      alert("로그인을 성공했습니다.");
      
      router.push("/tables");
    }else if(response.status === 404 || response.status === 400){
      alert("아이디 또는 패스워드가 잘못되었습니다.");
    }else if(response.status === 403){
      alert("탈퇴한 사용자입니다.");
    }
  } catch (err) {
    console.log(err);
  }
};

const sendCode = (event) => {
  console.log(signupEmail.value);
  event.preventDefault();
  if(emailPatternInvalid.value) return;
  onVerifying.value = false;
  duplicated.value = false;
  sendCodeApi();
}

const sendCodeApi = async () => {
  try {
    const response = await axios.post(
      'email/send', 
      null,
      {
        params: {
          toEmail: signupEmail.value
        },
        validateStatus: false,
        withCredentials: true
      }
    );

    if(response.status === 200){
      isSent.value = true;
    }else if(response.status === 409){
      duplicated.value = true;
    }
  } catch(err){
    console.log(err)
  }
}

const verifyCode = (event) => {
  event.preventDefault();
  onVerifying.value = false;
  verifyCodeApi();
}

const verifyCodeApi = async () => {
  try {
    console.log(signupEmail.value);
    console.log(verificationCode.value);
    const data = {
      email: signupEmail.value,
      verificationCode: verificationCode.value
    }
    const response = await axios.post(
      '/email/verify',
      data,
      {
        withCredentials: true
      }
    );

    if(response.status === 200 && response.data === 'success'){
      isVerified.value = true;
    }
    onVerifying.value = true;

  } catch(err){
    console.log(err);
  }
}

const signup = (event) => {
  event.preventDefault();
  signupApi();
};

const signupApi = async () => {
  if(!(signupEmail.value && signupPassword.value && signupName.value && signupNickname.value && !passwordPatternInvalid.value)) return;
  try {
    const response = await axios.post(
        "/member/register",
        {
          email: signupEmail.value,
          password: signupPassword.value,
          name: signupName.value,
          nickname: signupNickname.value
        },
        {
          validateStatus: false
        }
    );
    
    if(response.status === 201){
      alert("회원가입을 성공했습니다.");
      isVerified.value = false;
      onVerifying.value = false;
      isSent.value = false;
      duplicated.value = false;
      nicknameDuplicate.value = false;
      isRegistered.value = true;

      verificationCode.value = "";
      signupEmail.value = "";
      signupPassword.value = "";
      signupName.value = "";
      signupNickname.value = "";
    }else if(response.status === 409) {
      nicknameDuplicate.value = true;
    }

    console.log(response.data);

    signIn();
  } catch (err) {
    console.log(err);
  }
};

const checkLogin = () => {
  if(userStore.isLoggedIn){
    console.log("login user -> go to main")
    router.push("/tables");
  }
};

onMounted(() => {
  checkLogin();
});

// 페이지 마운트 시 설정
const body = document.getElementsByTagName("body")[0];
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");

});
</script>

<style scoped>
/* 오버레이 컨테이너 스타일 */
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.main-content.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

/* 오버레이 스타일 */
.overlay {
  background: linear-gradient(to right, #8f24c7, #4f3479);
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.main-content.right-panel-active .overlay {
  transform: translateX(50%);
}

/* 오버레이 패널 스타일 */
.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.main-content.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.main-content.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.ghost {
  margin-top: 20px;
  background-color: transparent;
  border-color: #ffffff;
  color: #ffffff;
}

.ghost:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .overlay-container {
    display: none;
  }
}
</style>
