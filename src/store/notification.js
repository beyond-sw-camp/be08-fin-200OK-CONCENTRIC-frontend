import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "@/store/user";

export const useNotificationStore = defineStore("notification", () => {
    const notifications = ref([]);
    const userStore = useUserStore();
    const loggedInMemberId = computed(() => userStore.userInfo.id);

    const showNotification = (memberId, msg, timer = 1500) => {
        if (memberId === loggedInMemberId.value) {
            return;
        }

        const newNotification = ref({
            id: Date.now(),
            message: msg,
            progressWidth: 0,
            fadeOut: false,
        });
        notifications.value.push(newNotification);

        const interval = setInterval(() => {
            newNotification.value.progressWidth += 100 / (timer / 100);
            if (newNotification.value.progressWidth >= 100) {
                clearInterval(interval);
                newNotification.value.fadeOut = true;
                setTimeout(() => {
                    removeNotification(newNotification.value.id); // 첫 번째 메시지를 삭제
                }, 500);
                
            }
        }, 100);
    };

    const removeNotification = (id) => {
        const index = notifications.value.findIndex(notification => notification.value.id === id);
        if (index !== -1) {
            notifications.value.splice(index, 1);
        }
    };

    return {
        notifications,
        showNotification,
        removeNotification,
    };
});
