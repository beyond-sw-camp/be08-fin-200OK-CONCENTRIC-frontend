<template>
  <div class="container position-relative z-index-1">
    <h2 class="text-center mb-4">알림 목록</h2>
    <button
        class="btn btn-outline-danger btn-sm"
        @click="deleteConfirm"
    >
     🗑️ 읽은 알림 삭제
    </button>
    <div class="notification-list">
      <div
          class="notification-item"
          v-for="(notification) in notifications"
          :key="notification.id"
      >
        <div
            class="notification-card"
            :class="notification.isRead ? 'bg-light' : 'bg-white'"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong class="d-block">{{ notification.message }}</strong>
              <p class="mb-1 text-secondary">{{ notification.message }}</p>
              <small class="text-muted">{{ formatDate(notification.createDate) }}</small>
            </div>
            <div class="d-flex align-items-center">
              <button
                  class="btn btn-outline-primary btn-sm me-2"
                  @click="updateRead(notification)"
              >
                {{ notification.isRead ? '읽지 않음' : '읽음' }}
              </button>

            </div>
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

const notifications = ref([]);

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getNotifications = async () => {
  try {
    const response = await axios.get("/notification/list");
    notifications.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const updateRead = (notification) => {
  notification.isRead = !notification.isRead;
  updateReadApi(notification);
};

const updateReadApi = async (notification) => {
  await axios.put(`/notification/read/${notification.id}`);
};

const deleteConfirm = () => {
  if(confirm("읽은 알림을 삭제하시겠습니까?")){
    deleteNotifications();
  }
};

const deleteNotifications = async () => {
  try {
    const response = await axios.delete(`/notification/read/delete`);
  }catch(error) {
    console.error(error);
  }
};


onMounted(() => {
  getNotifications();
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 알림 사이 간격 */
}

.notification-item {
  transition: transform 0.3s, box-shadow 0.3s;
}

.notification-card {
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.notification-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.notification-card.bg-light {
  background-color: #f8f9fa;
}

.notification-card.bg-white {
  background-color: #ffffff;
}

.notification-card .btn {
  font-size: 0.75rem;
}
</style>
