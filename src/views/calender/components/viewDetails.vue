<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" @mousedown="!isSubtaskModalOpen && startDrag"
      @mousemove="!isSubtaskModalOpen && drag"
      @mouseup="!isSubtaskModalOpen && endDrag" :style="{ top: offsetY + 'px', left: offsetX + 'px' }">
      <div class="details-section">
        <div class="modal-header">
          <h5 class="modal-title">상세 보기</h5>
        </div>
        <div class="modal-body">
          <form @submit.prevent="confirm">
            <div class="form-group">
              <label for="title">제목</label>
              <input type="text" id="title" v-model="details.title" class="form-control" required readonly />
            </div>
            <div class="form-group">
              <label for="description">설명</label>
              <input type="text" id="description" v-model="details.description" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="nickname">닉네임</label>
              <input type="text" id="nickname" v-model="details.nickname" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="type">구분</label>
              <input type="text" id="type" v-model="details.type" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="teamName">팀명</label>
              <input type="text" id="teamName" v-model="details.teamName" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="startDate">시작일</label>
              <input type="datetime-local" id="startDate" v-model="details.startDate" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="endDate">종료일</label>
              <input type="datetime-local" id="endDate" v-model="details.endDate" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="status">상태</label>
              <input type="text" id="status" v-model="details.status" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="importance">중요도</label>
              <input type="number" id="importance" v-model="details.importance" class="form-control" min="0" max="5" readonly />
            </div>
          </form>
        </div>
        <!-- <button
          class="btn btn-outline-danger btn-sm mt-2 mb-2"
          style="margin: 0 1rem;"
          @click="showModal = true"
        >
          일정 삭제
        </button> -->
      </div>
      <div class="sub-details-section">
        <button type="button" class="close" @click="closeModal">&times;</button>
        <ViewSubDetails :task-details="taskDetails" />
      </div>
      
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue';
import ViewSubDetails from '@/views/calender/components/ViewSubDetails.vue';

export default {
  components: {
    ViewSubDetails,
  },
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

    const isSubtaskModalOpen = ref(false);

    const handleSubtaskModalToggle = (isOpen) => {
      isSubtaskModalOpen.value = isOpen;
    };


    const details = ref({ 
      title: props.taskDetails?.title || 'Untitled',
      description: props.taskDetails?.description || 'No description',
      nickname: props.taskDetails?.nickname || '',
      type: props.taskDetails?.type || '',
      teamName: props.taskDetails?.teamName || '',
      startDate: props.taskDetails?.startDate ? props.taskDetails.startDate : '',
      endDate: props.taskDetails?.endDate ? props.taskDetails.endDate: '',
      status: props.taskDetails?.status || '',
      importance: props.taskDetails?.importance || 0,
    });

    watch(
      () => props.taskDetails,
      (newVal) => {
        if (newVal) {
          details.value = {
            title: props.taskDetails?.title || 'Untitled',
            description: props.taskDetails?.description || 'No description',
            nickname: props.taskDetails?.nickname || '',
            type: props.taskDetails?.type || '',
            teamName: props.taskDetails?.teamName || '',
            startDate: props.taskDetails?.startDate ? props.taskDetails.startDate : '',
            endDate: props.taskDetails?.endDate ? props.taskDetails.endDate : '',
            status: props.taskDetails?.status || '',
            importance: props.taskDetails?.importance || 0,
          };
        }
      },
      { immediate: true }
    );

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

    onUnmounted(() => {
      isDragging.value = false;
    });


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
      ViewSubDetails,
      isSubtaskModalOpen,
      handleSubtaskModalToggle,
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
  display: flex;
  flex-direction: row;
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 800px;
  max-height: 770px;
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
  margin-left: 90%;
  margin-bottom: 1rem;
}

.form-control:hover {
  transition: 0.3s;
}

.details-section {
  flex: 1;
  margin-right: 20px;
  max-height: 700px;
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
}

.sub-details-section {
  flex: 1;
  border-left: 1px solid #ccc;
  padding-left: 20px;
  max-height: 700px;
}
</style>
