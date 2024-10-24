import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

export const useStateStore = defineStore('states', () =>{
    const state = reactive({
        numOfNotifications: 0,
        numOfFriendRequests: 0,
    });

    const setNumOfNotifications = (value) => {
      state.numOfNotifications = value;
    };

    const setNumOfFriendRequests = (value) => {
        state.numOfFriendRequests = value;
    }

    const decreaseNumOfNotifications = () => {
        state.numOfNotifications -= 1;
    }

    const decreaseNumOfFriendRequests = () => {
        state.numOfFriendRequests -= 1;
    }

    const numOfNotifications = computed(() => state.numOfNotifications);
    const numOfFriendRequests = computed(() => state.numOfFriendRequests);

    return {
        state,
        setNumOfNotifications,
        setNumOfFriendRequests,
        decreaseNumOfNotifications,
        decreaseNumOfFriendRequests,
        numOfNotifications,
        numOfFriendRequests,
    }
});