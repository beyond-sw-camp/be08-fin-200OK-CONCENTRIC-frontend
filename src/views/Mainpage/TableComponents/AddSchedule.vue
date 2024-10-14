<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
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
  },
  data() {
    return {
      newTask: this.getInitialTask(),
    };
  },
  methods: {
    confirm() {
      // Combine date and time into startDate and endDate
      if (!this.newTask.allDay) {
        this.newTask.startDate = `${this.newTask.startDate}T${this.newTask.startTime}`;
        this.newTask.endDate = `${this.newTask.endDate}T${this.newTask.endTime}`;
      }
      delete this.newTask.startTime;
      delete this.newTask.endTime;
      delete this.newTask.allDay;
      this.$emit('confirm', this.newTask);
      this.resetTask(); // 값 초기화
    },
    closeModal() {
      this.$emit('close');
      this.resetTask(); // 값 초기화
    },
    getInitialTask() {
      return {
        userId: this.userId, // 로그인한 유저의 ID를 부모로부터 받아서 설정
        title: '',
        description: '',
        status: 'ACTIVE',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        importance: 0,
        startNotification: false,
        endNotification: false,
        allDay: false,
      };
    },
    resetTask() {
      this.newTask = this.getInitialTask();
    },
    toggleAllDay() {
      if (this.newTask.allDay) {
        // All Day 선택 시 시간을 기본값으로 설정하고 입력을 비활성화
        this.newTask.startTime = '00:00';
        this.newTask.endTime = '23:59';
      } else {
        // All Day 선택 해제 시 시간을 비우고 입력을 활성화
        this.newTask.startTime = '';
        this.newTask.endTime = '';
      }
    },
    validateDates() {
      if (this.newTask.startDate && this.newTask.endDate) {
        if (this.newTask.startDate > this.newTask.endDate) {
          this.newTask.endDate = this.newTask.startDate;
        }
      }
      if (this.newTask.endDate) {
        const startInput = document.querySelector('#startDate');
        startInput.max = this.newTask.endDate;
      }
      if (this.newTask.startDate) {
        const endInput = document.querySelector('#endDate');
        endInput.min = this.newTask.startDate;
      }
    },
    validateTimes() {
      // 시작일과 종료일이 같을 때만 시간 비교
      if (this.newTask.startDate === this.newTask.endDate) {
        if (this.newTask.startTime && this.newTask.endTime) {
          if (this.newTask.startTime > this.newTask.endTime) {
            this.newTask.endTime = this.newTask.startTime; // 종료 시간을 시작 시간으로 맞춤
          }
        }
      }
    },
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
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  z-index: 10000;
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
