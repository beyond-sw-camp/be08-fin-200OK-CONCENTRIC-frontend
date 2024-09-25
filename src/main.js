import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/v1/api';

const appInstance = createApp(App);
appInstance.config.globalProperties.$axios = axios;
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");
