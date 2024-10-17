<template>
  <div class="container" style="position: relative; z-index: 1;">
    <h2 class="text-center mb-4">알림 목록</h2>
    <div class="notification-list">
      <div class="notification-item" v-for="notification in notifications" :key="notification.id">
        <div class="alert" :class="notification.isRead ? 'alert-light' : 'alert-secondary'">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ notification.message }}</strong>
              <p class="mb-1">{{ notification.message }}</p>
              <small class="text-muted">{{ formatDate(notification.createDate) }}</small>
            </div>
            <button class="btn btn-link" @click="updateRead(notification)">✔️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/store/user";

const notifications = ref();

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
  }
};

const getNotifications = async () => {
  try {
    const response = await axios.get("/notification/list");
    notifications.value = response.data;
  }catch (error) {
    console.error(error);
  }

}

const updateRead = (notification) => {
  notification.isRead = !notification.isRead;
  updateReadApi(notification);
}

const updateReadApi = async (notification) => {
  const response = await axios.put(`/notification/read/${notification.id}`);
}

onMounted(() => {
  getNotifications();
});
</script>

<style scoped>
.notification-list {
  display: flex;
  flex-direction: column; /* 세로로 배치 */
}

.notification-item {
  margin-bottom: 15px; /* 각 알림 간의 간격 */
}

.alert {
  border-radius: 10px;
  transition: background-color 0.3s;
}

.alert:hover {
  background-color: rgba(0, 123, 255, 0.1); /* Hover 효과 */
}
</style>
