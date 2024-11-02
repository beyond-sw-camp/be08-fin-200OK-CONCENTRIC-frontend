<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag" :style="{ top: offsetY + 'px', left: offsetX + 'px' }">
      <div class="modal-header">
        <h5 class="modal-title">View Details</h5>
        <button type="button" class="close" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="confirm">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="details.title" class="form-control" required readonly />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <input type="text" id="description" v-model="details.description" class="form-control" readonly />
          </div>
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" id="startDate" v-model="details.startDate" class="form-control" readonly />
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" id="endDate" v-model="details.endDate" class="form-control" readonly />
          </div>
          <div class="form-group">
            <label for="importance">Importance</label>
            <input type="number" id="importance" v-model="details.importance" class="form-control" min="0" max="5" readonly />
          </div>
          <button type="button" class="btn btn-primary" @click="closeModal">Close</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    taskDetails: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const details = ref({ ...props.taskDetails });
    const offsetX = ref(0);
    const offsetY = ref(0);
    const isDragging = ref(false);
    const startX = ref(0);
    const startY = ref(0);

    function closeModal() {
      emit('close');
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
            offsetX.value = 0;
            offsetY.value = 0;
          }
        }
    );

    return {
      details,
      closeModal,
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

.form-control:hover {
  transition: 0.3s;
}
</style>
