<template>
    <div id="notification" class="notification-container">
        <div v-for="(notification, index) in notifications" :key="notification.value.id" class="notificationWrap"
        :class="{ 'fade-out': notification.value.fadeOut }">
            <p class= "notification-remove" @click="removeNotification(index)">x</p>
            <span class="notification-text">
                {{ notification.value.message }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { useNotificationStore } from '@/store/notification';
const notificationStore = useNotificationStore();

const notifications = notificationStore.notifications;
const removeNotification = notificationStore.removeNotification;
</script>

<style scoped>
.notification-container {
    position: fixed;
    z-index: 1000;
    bottom: 50px;
    right: 10px;
    text-align: right;
}

.notificationWrap {
    margin: 6px 0 0;
    padding: 7px 0 15px;
    background-color: #fff;
    border: none;
    color: #444;
    box-shadow: 0 2px 7px #ececec;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 300px;
    opacity: 1;
    transition: opacity 1s ease-in-out;
}

.notificationWrap.fade-out {
    opacity: 0;
}

.notification-remove {
    cursor: pointer;
    font-size: 12px;
    margin: 5px 20px 0px 0px;
    align-self: flex-end;
}

.notification-text {
    display: flex;
    justify-content: space-between;
    padding: 0px 20px 0px 20px;
    width: 100%;
    font-size: 10pt;
}


</style>