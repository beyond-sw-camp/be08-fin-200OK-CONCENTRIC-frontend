import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
    const state = reactive({
        userInfo: null,
        isLoggedIn: false,
        accessToken: null
    });

    const setUser = (user, accessToken) => {
        state.userInfo = user;
        state.isLoggedIn = true;
        state.accessToken = accessToken;
    }

    const clearUser = () => {
        state.userInfo = null;
        state.isLoggedIn = false;
        state.accessToken = null;
    }

    const updateToken = (accessToken) => {
        state.accessToken = accessToken;
    }

    const userInfo = computed(() => state.userInfo);
    const isLoggedIn = computed(() => state.isLoggedIn);
    const accessToken = computed(() => state.accessToken);

    return { 
        state,
        setUser,
        clearUser, 
        updateToken,
        userInfo,
        isLoggedIn,
        accessToken,
    };
},
{
    persist: true
});