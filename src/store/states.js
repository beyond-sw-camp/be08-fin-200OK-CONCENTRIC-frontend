import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

export const useStateStore = defineStore('states', () =>{
    const state = reactive({
        showSocial: false,
        showProfileMenu: false,
    });

    const toggleSocial = () => {
        state.showSocial = !state.showSocial;
        console.log(state.showSocial);
    }

    const setShowProfileMenu = (tof) => {
        state.showProfileMenu = tof;
    }

    const showSocial = computed(() => state.showSocial);
    const showProfileMenu = computed(() => state.showProfileMenu);

    return {
        state,
        toggleSocial,
        showSocial,
        showProfileMenu,
        setShowProfileMenu
    }
});