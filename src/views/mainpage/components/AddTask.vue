<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div
        class="modal-content"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="endDrag"
        :style="{ top: offsetY + 'px', left: offsetX + 'px' }"
        ref="modal"
    >
      <div class="modal-header">
        <h5 class="modal-title">New Task</h5>
        <button type="button" class="close" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="confirm">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="newTask.title" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <input type="text" id="description" v-model="newTask.description" class="form-control" />
          </div>
          <div class="form-group" style="position: relative;">
            <label for="startDate">Start Date</label>
            <div style="position: absolute; top: 0; right: 0;">
              <label>
                <input type="checkbox" v-model="newTask.allDay" @change="toggleAllDay" /> All Day
              </label>
            </div>
            <div class="d-flex align-items-center">
              <input type="date" id="startDate" v-model="newTask.startDate" class="form-control" required @change="validateDates" />
              <input type="time" v-model="newTask.startTime" class="form-control ml-2" :disabled="newTask.allDay" @change="validateTimes" />
            </div>
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <div class="d-flex align-items-center">
              <input type="date" id="endDate" v-model="newTask.endDate" class="form-control" required @change="validateDates" :min="newTask.startDate" />
              <input type="time" v-model="newTask.endTime" class="form-control ml-2" :disabled="newTask.allDay" @change="validateTimes" />
            </div>
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="newTask.status" class="form-control">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="importance">Importance</label>
            <input type="number" id="importance" v-model="newTask.importance" class="form-control" min="0" max="5" />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="newTask.startNotification" /> Start Notification
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="newTask.endNotification" /> End Notification
            </label>
          </div>
          <button type="submit" class="btn btn-primary">Add Task</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    selectedStartDate: {
      type: String,
      default: '',
    },
    selectedEndDate: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    const newTask = ref(getInitialTask());
    const isDragging = ref(false);
    const offsetX = ref(0);
    const offsetY = ref(0);
    const startX = ref(0);
    const startY = ref(0);

    function getInitialTask() {
      return {
        userId: props.userId,
        title: '',
        description: '',
        status: 'ACTIVE',
        startDate: props.selectedStartDate || '',
        endDate: props.selectedEndDate || '',
        startTime: '',
        endTime: '',
        importance: 0,
        startNotification: false,
        endNotification: false,
        allDay: false,
      };
    }

    function confirm() {
      if (newTask.value.allDay) {
        newTask.value.startDate = `${newTask.value.startDate}T00:00`;
        newTask.value.endDate = `${newTask.value.endDate}T23:59`;
      } else {
        newTask.value.startDate = `${newTask.value.startDate}T${newTask.value.startTime}`;
        newTask.value.endDate = `${newTask.value.endDate}T${newTask.value.endTime}`;
      }

      delete newTask.value.startTime;
      delete newTask.value.endTime;
      delete newTask.value.allDay;

      emit('confirm', newTask.value);
      resetTask();
    }

    function closeModal() {
      emit('close');
      resetTask();
    }

    function resetTask() {
      newTask.value = getInitialTask();
    }

    function toggleAllDay() {
      if (newTask.value.allDay) {
        newTask.value.startTime = '00:00';
        newTask.value.endTime = '23:59';
      } else {
        newTask.value.startTime = '';
        newTask.value.endTime = '';
      }
    }

    function validateDates() {
      if (newTask.value.startDate && newTask.value.endDate) {
        if (newTask.value.startDate > newTask.value.endDate) {
          newTask.value.endDate = newTask.value.startDate;
        }
      }
    }

    function validateTimes() {
      if (newTask.value.startDate === newTask.value.endDate) {
        if (newTask.value.startTime && newTask.value.endTime) {
          if (newTask.value.startTime > newTask.value.endTime) {
            newTask.value.endTime = newTask.value.startTime;
          }
        }
      }
    }

    function startDrag(event) {
      isDragging.value = true;
      startX.value = event.clientX - offsetX.value;
      startY.value = event.clientY - offsetY.value;
    }

    function drag(event) {
      if (isDragging.value) {
        offsetX.value = event.clientX - startX.value;
        offsetY.value = event.clientY - startY.value;
      }
    }

    function endDrag() {
      isDragging.value = false;
    }

    return {
      newTask,
      confirm,
      closeModal,
      toggleAllDay,
      validateDates,
      validateTimes,
      startDrag,
      drag,
      endDrag,
      offsetX,
      offsetY,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  z-index: 10000;
  cursor: grab;
  transform: translateY(20%);
}

.modal-content:active {
  cursor: grabbing;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
