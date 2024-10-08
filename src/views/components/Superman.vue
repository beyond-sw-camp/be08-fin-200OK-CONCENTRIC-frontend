<template>
  <div :class="['container', { 'right-panel-active': isRightPanelActive }]">
    <div class="form-container sign-up-container">
      <form action="#">
        <h1>Create Account</h1>
        <div class="social-container">
          <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
          <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
        </div>
        <span>or use email for registration</span>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign Up</button>
      </form>
    </div>
    <div class="form-container sign-in-container">
      <form action="#">
        <h1>Sign In</h1>
        <div class="social-container">
          <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
          <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
        </div>
        <span>or use your account</span>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign In</button>
      </form>
    </div>
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button class="ghost" @click="signIn">Sign In</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start your journey with us</p>
          <button class="ghost" @click="signUp">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isRightPanelActive = ref(false);

const signUp = () => {
  isRightPanelActive.value = true;
};

const signIn = () => {
  isRightPanelActive.value = false;
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

body {
  font-family: 'Arial', sans-serif;
  background: #f6f5f7;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 20px rgba(0, 0, 0, 0.25),
  0 10px 20px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.form-container form {
  background: #ffffff;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.form-container form h1 {
  font-size: 24px;
  color: #333;
}

.form-container input {
  background-color: #eee;
  border: none;
  padding: 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.1);
}

.form-container button {
  border-radius: 20px;
  border: 1px solid #8f24c7;
  background-color: #8f24c7;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}

.form-container button:active {
  transform: scale(0.95);
}

.form-container button:focus {
  outline: none;
}

.form-container a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #dddddd;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
  background-color: #ffffff;
  color: #333;
  font-size: 18px;
}

.social-container a:hover {
  background-color: #8f24c7;
  border-color: #8f24c7;
  color: #ffffff;
}

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

.overlay {
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-panel {
  background: #8f24c7;
  background: linear-gradient(to right, #8f24c7, #4f3479);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  position: absolute;
  align-items: center;
  justify-content: center;
  padding: 0px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(0%);
  border-radius: 200px 0 0 200px;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.ghost {
  border-radius: 20px;
  border: 1px solid #8f24c7;
  background-color: #ffffff;
  color: #8f24c7;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
</style>
