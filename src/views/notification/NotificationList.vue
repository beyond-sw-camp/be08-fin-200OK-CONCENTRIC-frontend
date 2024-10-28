<template>
    <div class="card">
      <h2 class="text-center mb-4" style="font-size: 1.2rem; font-weight:600;">알림 목록</h2>
      
        <button
            class="btn btn-outline-danger btn-sm"
            @click="deleteConfirm"
            style="margin:0 1rem 2rem 2rem"
        >
        🗑️ 읽은 알림 삭제
        </button>
      <div class="card-list">
        <div class="notification-list">
          <transition-group name="fade" tag="ul" style="margin-left: 0; padding-left: 0;" class="notification-list">
          <div
              class="notification-item"
              v-for="(notification, i) in notifications"
              :key="notification.id"
          >
            <transition name="fade">
            <div
                class="notification-card"
                :class="notification.isRead ? 'bg-light' : 'bg-white'"
                v-if="showNotifications[i]"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong class="d-block">{{ notification.message }}</strong>
                  <p class="mb-1 text-secondary" style="font-size: 10pt">{{ notification.message }}</p>
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
            </transition>
          </div>
          </transition-group>
        </div>
      </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useStateStore} from "@/store/states";

const notifications = ref([]);
const showNotifications = ref([]);
const stateStore = useStateStore();

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getNotifications = async () => {
  try {
    const response = await axios.get("/notification/list");
    notifications.value = response.data;
    notifications.value.forEach(notification => {
      showNotifications.value.push(true);
    });
  } catch (error) {
    console.error(error);
  }
};

const updateRead = (notification) => {
  notification.isRead = !notification.isRead;
  if (notification.isRead) stateStore.decreaseNumOfNotifications();
  else stateStore.increaseNumOfNotifications();
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
    const toDelete = [];
    for(let i = 0; i < notifications.value.length; i++) {
      if(notifications.value[i].isRead){
        toDelete.push(i);
      }
    }
    const response = await axios.delete(`/notification/read/delete`);
    if(response.status === 200){
      toDelete.forEach((idx) => {
        showNotifications.value[idx] = false;
      })
    }
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
  padding: 0;
}

.card{
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 600px;
  width: 120vh;
  padding-top: 6%;
  margin: 0 1.5rem;
}

.card-list {
  margin: 0 2rem;
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
  font-size: 11pt;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
