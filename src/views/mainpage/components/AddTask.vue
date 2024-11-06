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
          <div class="form-group">
            <div class="d-flex align-items-center my-2">
              <label for="personal" class="mb-0 me-2">Personal</label>
              <input type="checkbox" id="teamExist" v-model="isPrivate" @change="updateTaskType"/>
            </div>
            <div class="custom-dropdown" v-if="!isPrivate">
              <div class="dropdown-label" @click="togglePersonalDropdown">
                <span>{{ selectedPersonalOption?.label || "팀 선택" }}</span>
                <i :class="isPersonalDropdownOpen ? 'fa fa-caret-up' : 'fa fa-caret-down'" class="dropdown-icon" aria-hidden="true"></i>
              </div>
              <transition name="dropdown-fade-slide">
                <div v-if="isPersonalDropdownOpen" class="dropdown-options">
                  <div
                      v-for="option in personalOptions"
                      :key="option.value"
                      :class="{ 'option-selected': option.value === selectedPersonalOption?.value }"
                      class="dropdown-option"
                      @click="selectPersonalOption(option)"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </transition>
            </div>
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
            <div class="custom-dropdown">
              <div class="dropdown-label" :class="{ 'dropdown-active': isStatusDropdownOpen }" @click="toggleStatusDropdown">
                {{ selectedStatusOption.label }}
                <i :class="isStatusDropdownOpen ? 'fa fa-caret-up' : 'fa fa-caret-down'" class="dropdown-icon" aria-hidden="true"></i>
              </div>
              <transition name="dropdown-fade-slide">
                <div v-if="isStatusDropdownOpen" class="dropdown-options">
                  <div v-for="option in options" :key="option.value" :class="{ 'option-selected': option.value === newTask.status }"
                      class="dropdown-option" @click="selectStatusOption(option)">
                    {{ option.label }}
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="form-group">
            <label for="importance">Importance</label>
            <input type="number" id="importance" v-model="newTask.importance" class="form-control" min="0" max="5" />
          </div>
<!--          <div class="form-group">-->
<!--            <label>-->
<!--              <input type="checkbox" v-model="newTask.startNotification" /> Start Notification-->
<!--            </label>-->
<!--          </div>-->
<!--          <div class="form-group">-->
<!--            <label>-->
<!--              <input type="checkbox" v-model="newTask.endNotification" /> End Notification-->
<!--            </label>-->
<!--          </div>-->
          <button type="submit" class="btn btn-primary" @click="confirm">Add Task</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import axios from "axios";

export default {
  data(){
    return{
      isChecked: true,
      isPrivate: false
    }
  },
  methods: {
    updateTaskType() {
      this.newTask.type = this.isPrivate ? 'PRIVATE' : 'TEAM';
    }
  },
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
    const options = [
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
    ];

    const personalOptions = ref([]);
    const selectedPersonalOption = ref(null);
    const isPersonalDropdownOpen = ref(false);

    const fetchTeamList = async () => {
      try {
        const response = await axios.get('/team/list', {
        });
        personalOptions.value = response.data.map(team => ({
          value: team.id,
          label: team.name
        }));
        selectedPersonalOption.value = personalOptions.value[0] || null;
      } catch (error) {
        console.error("Failed to fetch team list:", error);
      }
    };

    onMounted(fetchTeamList);

    const selectedStatusOption = ref(
        options.find((option) => option.value === props.value) || options[0]
    );

    const isStatusDropdownOpen = ref(false);

    const toggleStatusDropdown = () => {
      isStatusDropdownOpen.value = !isStatusDropdownOpen.value;
    };

    const togglePersonalDropdown = () => {
      isPersonalDropdownOpen.value = !isPersonalDropdownOpen.value;
    };

    const selectStatusOption = (option) => {
      selectedStatusOption.value = options.find((opt) => opt.value === option.value) || options[0];
      isStatusDropdownOpen.value = false;
      emit("update:value", selectedStatusOption.value); // 선택한 값의 value를 부모에 전달
    };

    const selectPersonalOption = (option) => {
      selectedPersonalOption.value = option;
      console.log("option: ", option.value)
      newTask.value.teamId = option.value;
      newTask.value.type = 'TEAM';
      console.log(newTask);
      isPersonalDropdownOpen.value = false;
    };

    const newTask = ref(getInitialTask());
    const isDragging = ref(false);
    const offsetX = ref(0);
    const offsetY = ref(0);
    const startX = ref(0);
    const startY = ref(0);

    function getInitialTask() {
      return {
        // userId: props.userId,
        title: '',
        description: '',
        status: 'ACTIVE',
        startDate: props.selectedStartDate || '',
        endDate: props.selectedEndDate || '',
        startTime: '',
        endTime: '',
        importance: 0,
        type: '',
        teamId: '',
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
    watch(
        () => props.isVisible,
        (newVal) => {
          if (newVal) {
            offsetX.value = 0
            offsetY.value = 0
          }
        }
    );
    return {
      options,
      personalOptions,
      isStatusDropdownOpen,
      isPersonalDropdownOpen,
      selectedStatusOption,
      selectedPersonalOption,
      toggleStatusDropdown,
      togglePersonalDropdown,
      selectStatusOption,
      selectPersonalOption,

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
      // saveTaskToDatabase
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
  transform: translateY(10%);
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

.form-control:hover{
  transition:0.3s;
}

.custom-dropdown {
  position: relative;
  width: 50%;
  cursor: default;

}

.dropdown-label {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  padding: 0.4rem 0.4rem 0.4rem 1rem;
}

.dropdown-label:hover{
  transition:0.3s;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  max-height: 150px;
  overflow-y: auto;
  z-index: 100;
}

.dropdown-option {
  padding: 0.4rem 0.4rem 0.4rem 1rem;
  transition: background-color 0.3s ease; /* 천천히 변하는 트랜지션 */
}

.dropdown-option:hover {
  background-color: #e0f7fa;
}

.dropdown-active {
  border-color: #9caafa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-inactive{
  transition:0.1s;
}

.option-selected {
  background-color: #e0f7fa;
}

.dropdown-fade-slide-enter-active, .dropdown-fade-slide-leave-active {
  transition: all 0.3s ease;
}
.dropdown-fade-slide-enter {
  opacity: 0;
  transform: translateY(-10px);
}
.dropdown-fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.dropdown-fade-slide-leave {
  opacity: 1;
  transform: translateY(0);
}
.dropdown-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>