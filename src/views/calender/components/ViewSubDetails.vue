<template>
    <div class="subtask-container">
        <button
          class="btn btn-outline-primary btn-sm mb-4"
          @click="showModal = true"
        >
          하위 일정 생성
        </button>
      <div class="card-list">
        <div class="subtask-list">
          <transition-group name="fade" tag="ul" style="margin-left: 0; padding-left: 0;" class="subtask-list">
          <div
              class="subtask-item"
              v-for="(subtask, i) in subtasks"
              :key="subtask.id"
          >
            <transition name="fade">
            <div
                class="subtask-card"
                v-if="showSubtasks[i]"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong class="d-block">{{ subtask.title }}</strong>
                  <p class="mb-1 text-secondary" style="font-size: 10pt">{{ subtask.description }}</p>
                  <!-- <small class="text-muted">{{ formatDate(notification.createDate) }}</small> -->
                </div>
                <div class="d-flex align-items-center">
                  <input
                    type="checkbox"
                    :checked="subtask.status === 'COMPLETED'"
                    @change="toggleCompletion(subtask)"
                    class="form-check-input me-2"
                    id="checkbox-{{ subtask.id }}"
                  />
                  <button class="delete-subtask" @click="deleteSubtask(subtask.id)">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
            </transition>
          </div>
          </transition-group>
        </div>

        <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <button type="button" class="close" @click="showModal = false">&times;</button>
          <h6>하위 일정 추가</h6>
          <input v-model="newSubtaskTitle" placeholder="Title" class="form-control mb-2" />
          <textarea v-model="newSubtaskDescription" placeholder="Description" class="form-control mb-2"></textarea>
          <button class="btn btn-primary" @click="addSubtask">추가</button>
        </div>
      </div>
      </div>
    </div>
</template>

<script setup>
const props = defineProps({
  taskDetails: {
    type: Object,
    required: true,
  },
});

import {onMounted, ref, defineEmits, defineProps} from "vue";
import axios from "axios";
import {useStateStore} from "@/store/states";

const emit = defineEmits(['toggle-modal']);

const subtasks = ref([]);
const stateStore = useStateStore();
const showModal = ref(false);
const newSubtaskTitle = ref('');
const newSubtaskDescription = ref('');
const showSubtasks = ref([]);

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const toggleModal = (isOpen) => {
  showModal.value = isOpen;
  emit('toggle-modal', isOpen);
};

const getSubtasks = async () => {
  try {
    const scheduleId = props.taskDetails.id;
    // console.log("Task details:", props.taskDetails);
    // console.log("Schedule ID:", scheduleId);
    const response = await axios.get(`/subtask/list?scheduleId=${scheduleId}`);
    // console.log("API Response:", response.data);
    subtasks.value = response.data;
    showSubtasks.value = new Array(subtasks.value.length).fill(true);
  } catch (error) {
    console.error(error);
  }
};


const toggleCompletion = (subtask) => {
  if (subtask.status === 'COMPLETED') {
    subtask.status = 'ACTIVE';
    subtask.isCompleted = false; // 상태를 업데이트
  } else {
    subtask.status = 'COMPLETED';
    subtask.isCompleted = true; // 상태를 업데이트
  }
  updateSubtaskApi(subtask);
};

const updateSubtaskApi = async (subtask) => {
  await axios.put(`/subtask/update/status?subScheduleId=${subtask.id}&status=${subtask.status}`);
  await getSubtasks();
};


const deleteSubtask = async (subtaskId) => {
  try {
    const response = await axios.delete(`/subtask/delete?subScheduleId=${subtaskId}`);
    if(response.status === 403){
      alert("권한이 없는 사용자입니다.");
    }
    subtasks.value = subtasks.value.filter((subtask) => subtask.id !== subtaskId);
    showSubtasks.value = showSubtasks.value.slice(0, subtasks.value.length);

    await getSubtasks();
  } catch (error) {
    console.error(error);
    alert("삭제 중 문제가 발생했습니다.");
  }
};

const addSubtask = async () => {
  if (newSubtaskTitle.value.trim() === '') return;
  try {
    const response = await axios.post('/subtask/create', {
      title: newSubtaskTitle.value,
      description: newSubtaskDescription.value,
      status: 'ACTIVE',
      scheduleId: props.taskDetails.id,
    });
    if(response.status === 403){
      alert("권한이 없는 사용자입니다.");
    }
    subtasks.value.push(response.data);
    await getSubtasks();
    showModal.value = false;
    newSubtaskTitle.value = '';
    newSubtaskDescription.value = '';
  } catch (error) {
    console.error("Error creating subtask:", error);
  }
};

onMounted(() => {
  getSubtasks();
});
</script>

<style scoped>
/* .container {
  max-width: 600px;
  padding: 0;
} */

.subtask-container{
  /* background-repeat: no-repeat;
  background-size: cover;
  background-position: center; */
  background-color: none;
  display: flex;
  flex-direction: column;
}

.card-list {
  margin: 0;
  max-height: 580px;
  overflow-y: auto; 
}

.subtask-list {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 알림 사이 간격 */
}

.subtask-item {
  transition: transform 0.3s, box-shadow 0.3s;
}

.subtask-card {
  font-size: 11pt;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.subtask-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.subtask-card.bg-light {
  background-color: #ffffff;
}

.subtask-card.bg-white {
  background-color: #ffffff;
}

.subtask-card .btn {
  font-size: 0.75rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.form-check-input {
  appearance: checkbox; 
  width: auto; 
  height: auto; 
  margin: 0;
  cursor: pointer; 
  border: 2px solid #ced4da; 
  background-color: #ffffff; 
  border-radius: 4px; 
}

.form-check-input:checked {
  background-color: #8A9BF9;
  border-color: #8A9BF9;
}

.delete-subtask {
  background-color: white;
  border: none;
  color: none;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  cursor: default;
}

.subtask-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 90%;
  margin-bottom: -2rem;
  z-index: 999;
}

</style>
