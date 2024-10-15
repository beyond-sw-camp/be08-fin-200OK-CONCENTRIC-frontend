<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="$emit('close')">✖</button>
      <div class="modal-header"><slot name="header"></slot></div>
      <div class="modal-body">
        <slot name="body"></slot>
        <div class="drop-zone" @dragover.prevent @drop="handleDrop">
          <p>파일을 여기로 드래그 앤 드롭하세요</p>
        </div>
        <input type="file" multiple @change="handleFileSelect" style="display: none;" ref="fileInput" />
        <button class="select-button" @click="selectFiles">파일 선택</button>
        <ul class="file-list">
          <li v-for="file in filesToUpload" :key="file.name">{{ file.name }}</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="upload-button" @click="uploadFiles">업로드</button>
        <button class="cancel-button" @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  filesToUpload: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['files-uploaded']);
const fileInput = ref(null);

const handleDrop = (event) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  emit('files-uploaded', files);
};

const selectFiles = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  emit('files-uploaded', files);
};

const uploadFiles = () => {
  emit('files-uploaded', props.filesToUpload);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  width: 600px;
  max-width: 90%;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin: 10px 0;
}

button {
  margin-top: 10px;
}

.select-button, .upload-button, .cancel-button {
  background-color: #8A9BF9;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.select-button:hover, .upload-button:hover, .cancel-button:hover {
  background-color: #86EDDA;
}

.file-list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
</style>
