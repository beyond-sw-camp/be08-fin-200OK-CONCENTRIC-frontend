import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "@/store/user";

export const useNotificationStore = defineStore("notification", () => {
    const notifications = ref([]);
    const userStore = useUserStore();
    const loggedInMemberId = computed(() => userStore.userInfo.id);

    const showNotification = (memberId, msg, timer = 3000) => {
        if (memberId === loggedInMemberId.value) {
            return;
        }

        const newNotification = {
            message: msg,
            progressWidth: 0,
        };
        notifications.value.push(newNotification);

        const interval = setInterval(() => {
            newNotification.progressWidth += 100 / (timer / 100);
            if (newNotification.progressWidth >= 100) {
                clearInterval(interval);
                removeNotification(0); // 첫 번째 메시지를 삭제
            }
        }, 100);
    };

    const removeNotification = (index) => {
        if (index >= 0 && index < notifications.value.length) {
            notifications.value.splice(index, 1);
        }
    };

    return {
        notifications,
        showNotification,
        removeNotification,
    };
});
