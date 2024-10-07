import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
    const state = reactive({
        userInfo: null,
        isLoggedIn: false
    });
    
    const setUser = (user) => {
        state.userInfo = user;
    }

    const clearUser = () => {
        state.userInfo = null;
        state.isLoggedIn = false;
    }

    const setLogin = () => {
        state.isLoggedIn = true;
    }

    const userInfo = computed(() => state.userInfo);
    const isLoggedIn = computed(() => state.isLoggedIn);

    return { 
        setUser,
        setLogin,
        clearUser, 
        userInfo,
        isLoggedIn,
    };
});