<template>
  <div class="py-4 container-fluid d-flex justify-content-center align-items-center min-vh-100">
    <main class="mt-0 main-content d-flex justify-content-center align-items-center" :class="{ 'right-panel-active': isRightPanelActive }">
      <div class="page-header min-vh-50 d-flex justify-content-center align-items-center rounded shadow-sm">
        <div class="container" style="border-radius: 20px;">
          <div class="row">
            <!-- 로그인 폼 -->
            <div class="mx-auto col-12 col-md-6 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <argon-input
                          id="email"
                          type="email"
                          placeholder="Email"
                          name="email"
                          size="lg"
                          v-model="loginEmail"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                          id="password"
                          type="password"
                          placeholder="Password"
                          name="password"
                          size="lg"
                          v-model="loginPassword"
                      />
                    </div>
                    <argon-switch id="rememberMe" name="remember-me">
                      Remember me
                    </argon-switch>
                    <div class="text-center">
                      <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          @click="login"
                      >
                        Sign In
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                        href="javascript:;"
                        class="text-success text-gradient font-weight-bold"
                        @click="signUp"
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <!-- 회원가입 폼 -->
            <div class="mx-auto col-12 col-md-6 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign Up</h4>
                  <p class="mb-0">Enter your email and password to sign up</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <argon-input
                          id="email"
                          type="email"
                          placeholder="Email"
                          name="email"
                          size="lg"
                          v-model="signupEmail"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                          id="password"
                          type="password"
                          placeholder="Password"
                          name="password"
                          size="lg"
                          v-model="signupPassword"
                      />
                    </div>
                    <div class="text-center">
                      <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          @click="signup"
                      >
                        Sign Up
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Already have an account?
                    <a
                        href="javascript:;"
                        class="text-success text-gradient font-weight-bold"
                        @click="signIn"
                    >
                      Sign In
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
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <argon-button
                    class="ghost"
                    variant="gradient"
                    color="success"
                    @click="signIn"
                >
                  Sign In
                </argon-button>
              </div>
              <div class="overlay-panel overlay-right">
                <h1 style="color: #9de0f6">Hi!</h1>
                <p>Enter your personal details and start your journey with us</p>
                <argon-button
                    class="ghost"
                    variant="gradient"
                    color="success"
                    @click="signUp"
                >
                  Sign Up
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
import { ref, onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import axios from "axios";

import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import ArgonSwitch from "@/components/ArgonComponents/ArgonSwitch.vue";


const store = useStore();
const router = useRouter();
const { cookies } = useCookies();
const loginEmail = ref("");
const loginPassword = ref("");
const signupEmail = ref("");
const signupPassword = ref("");
const isRightPanelActive = ref(false);
const signUp = () => {
  isRightPanelActive.value = true;
};
const signIn = () => {
  isRightPanelActive.value = false;
};
const login = () => {
  console.log(loginEmail.value, loginPassword.value);
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
          withCredentials: true,
        }
    );
    alert("로그인을 성공했습니다.");
    // store.isLoggedIn = 'true';
    // localStorage.setItem("isLoggedIn", true);
    // localStorage.setItem("userInfo", JSON.stringify(response.data));
    // console.log(JSON.parse(localStorage.getItem("userInfo")));

    console.log(cookies.get("access_token"));

    router.push("/dashboard-default");
  } catch (err) {
    console.log(err);
  }
};

const signup = () => {
  console.log(signupEmail.value, signupPassword.value);
  signupApi();
};

const signupApi = async () => {
  try {
    const response = await axios.post(
        "/member/signup",
        {
          email: signupEmail.value,
          password: signupPassword.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
    );
    alert("회원가입을 성공했습니다.");
    // 회원가입 후 추가 로직

    console.log(response.data);

    // 회원가입 후 로그인 페이지로 이동
    signIn();
  } catch (err) {
    console.log(err);
  }
};

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
