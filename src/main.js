import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/v1/api';
axios.interceptors.request.use((config) => {
    if(localStorage.getItem('user')){
        const token = JSON.parse(localStorage.getItem('user'))['state']['accessToken'];
        if(token){
            config.headers.authorization = token;
            config.withCredentials = true;
    }
    }
    return config;
});

axios.interceptors.response.use(
    (response) => {
        const token = response.headers.authorization;
        if(token){
            const user = JSON.parse(localStorage.getItem('user'));
            if(user){
                user['state']['accessToken'] = token;
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        return response;
    },
    (error) => {
        if(error.response.status == 401){
            router.push('/');
        }
    }
);

const appInstance = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);

appInstance.config.globalProperties.$axios = axios;
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.use(pinia);
appInstance.mount("#app");
