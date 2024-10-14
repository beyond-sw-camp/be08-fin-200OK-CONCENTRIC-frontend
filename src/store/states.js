import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

export const useStateStore = defineStore('states', () =>{
    const state = reactive({
       showSocial: false,
    });

    const toggleSocial = () => {
        state.showSocial = !state.showSocial;
        console.log(state.showSocial);
    }

    const showSocial = computed(() => state.showSocial);

    return {
        state,
        toggleSocial,
        showSocial,
    }
});