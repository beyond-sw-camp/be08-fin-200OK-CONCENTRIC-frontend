import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import ganttastic from "@infectoone/vue-ganttastic";

import axios from 'axios';
axios.defaults.baseURL = 'https://api.200concentric.com/v1/api';
axios.interceptors.request.use((config) => {
    if(config.url === '/member/login') {
        config.headers.authorization = undefined;
        return config;
    }
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
                user['state']['team_id'] = null;
                user['state']['accessToken'] = token;
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        if(response.status === 401){
            console.log("unauthorized");
            const user = JSON.parse(localStorage.getItem('user'));
            if(user){
                user['state']['team_id'] = null;
                user['state']['userInfo'] = undefined;
                user['state']['isLoggedIn'] = false;
                user['state']['accessToken'] = undefined;
                localStorage.setItem('user', JSON.stringify(user));
            }
            router.push("/");
        }
        return response;
    },
    (error) => {
        if(error.response.status === 401){
            console.log("unauthorized.");
            const user = JSON.parse(localStorage.getItem('user'));
            if(user){
                user['state']['team_id'] = null;
                user['state']['userInfo'] = undefined;
                user['state']['isLoggedIn'] = false;
                user['state']['accessToken'] = undefined;
                localStorage.setItem('user', JSON.stringify(user));
                router.push("/");
            }
        }
        return error.response;
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
appInstance.use(ganttastic);
appInstance.mount("#app");
