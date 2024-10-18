import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
    const state = reactive({
        userInfo: null,
        isLoggedIn: false,
        accessToken: null
    });

    const setUser = (user) => {
        state.userInfo = user;
        state.isLoggedIn = true;
    }

    const clearUser = () => {
        state.userInfo = null;
        state.isLoggedIn = false;
        state.accessToken = null;
    }

    const setToken = (accessToken) => {
        if(accessToken !== undefined){
            state.accessToken = accessToken;
            axios.defaults.headers.common['authorization'] = accessToken;
        }
    }

    const updateUser = (user) => {
        state.userInfo = user;
    }

    const userInfo = computed(() => state.userInfo);
    const isLoggedIn = computed(() => state.isLoggedIn);
    const accessToken = computed(() => state.accessToken);

    return { 
        state,
        setUser,
        clearUser, 
        setToken,
        updateUser,
        userInfo,
        isLoggedIn,
        accessToken,
    };
},
{
    persist: true
});