<template>
    <div>
      <div style="font-size: 1.5rem">
        파일함
      </div>
      <div class="usage-text">{{ currentSizeMB }}MB / {{ capacityMB }}MB ({{ usagePercentage }}%)</div>
      <div class="usage-bar">
        <div
            class="usage-fill"
            :style="{ width: usagePercentage + '%' }"
        ></div>
      </div>
  
      <div class="upload-section">
        <button class="upload-button" @click="openUploadModal">업로드</button>
      </div>
  
      <div class="file-list">
        <transition-group name="fade" tag="ul" style="margin-left: 0; padding-left: 0;">
          <li v-for="(file, i) in storageFiles" :key="file.storageFileId" style="list-style: none;">
          <transition name="fade">
            <div class="file-item" v-if="showFiles[i]">
              <span class="file-name"
                    @click="downloadFile(file.storageFileId)"
              style="font-size: 0.8rem">
                {{ file.originalName }}
              </span>
              <span class="file-size">{{ getSizePresent(file.size) }}</span>
              <span class="file-date">{{ getDatePresent(file.createDate) }}</span>
              <div>
                <button class="download-button" @click="downloadFile(file.storageFileId)">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="delete-button" @click="deleteConfirm(file.storageFileId, i)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </transition>
        </li>
      </transition-group>
    </div>
  
      <transition name="fade-modal">
        <UploadModal v-if="isModalOpen"
                    @close="closeUploadModal"
                    :files-to-upload="filesToUpload"
                    @files-uploaded="handleFilesUploaded"
        >
  
          <template #header>
            <h2>파일 업로드</h2>
          </template>
          <template #body>
            <p>파일을 드래그 앤 드롭하거나 선택하세요.</p>
          </template>
  
        </UploadModal>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useUserStore } from "@/store/user";
  import axios from "axios";
  import UploadModal from '@/views/storage/TeamUploadModal.vue';
  import { useRoute } from 'vue-router';

  const props = defineProps({
  team: {
    type: Object,
    default: () => ({}),
    },
  });

  console.log("Team data in TeamProfile:", props.team); // 팀 데이터 확인
  
  const route = useRoute();
  const userStore = useUserStore();
  const storage = ref({ id: null, currentSize: 0, capacity: 0 });
  const storageFiles = ref([]);
  const currentSizeMB = computed(() => (storage.value.currentSize / 1024 / 1024).toFixed(2));
  const capacityMB = computed(() => (storage.value.capacity / 1024 / 1024).toFixed(2));
  const usagePercentage = computed(() => (storage.value.capacity > 0 ? Math.round((storage.value.currentSize / storage.value.capacity) * 100) : 0));
  
  const showFiles = ref([]);
  const isModalOpen = ref(false);
  const filesToUpload = ref([]);
  const selectedTeam = ref({ ...props.team }); 
  const teamId = props.team.id;

  // const fetchTeamData = async () => {
  //     try {
  //       console.log("teamId : ", teamId);
  //       const response = await axios.get(`/team/${teamId}`);
  //       selectedTeam.value = response.data;
  //       console.log("선택된 팀 : ", selectedTeam.value);
  //     } catch (error) {
  //       console.error('팀 정보를 불러오는데 실패했습니다:', error);
  //     }
  //   };

  
  const openUploadModal = () => {
    isModalOpen.value = true;
  };
  
  const closeUploadModal = () => {
    isModalOpen.value = false;
    filesToUpload.value = [];
  };
  
  const handleFilesUploaded = (uploadedFiles) => {
    console.log("Received files in parent:", uploadedFiles);
    uploadedFiles.forEach(file => {
      const exists = filesToUpload.value.some(f => f.name === file.name);
      if (!exists) {
        filesToUpload.value.push(file);
        console.log("Updated filesToUpload:", filesToUpload.value);
      }
    });
    console.log(filesToUpload.value);
    uploadFiles();
  };
  
  
  const uploadFiles = async () => {
    console.log("teamId:", teamId);
    const formData = new FormData();
    formData.append("ownerId", teamId);
    formData.append("storageType", "TEAM");
  
    filesToUpload.value.forEach(file => {
      formData.append("files", file);
    });
    // FormData 내용 확인
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await axios.post('storage/upload',
        formData,
        {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
  
    if (response.status === 200) {
      await getStorage();
      await getStorageFiles();
      console.log("업로드 성공  ! ! ");
      closeUploadModal();
    }else if(response.status === 400){
      alert("용량 부족");
    }
  };
  
  const getStorage = async () => {
    const response = await axios.get('storage/',
        {
          params: {
            ownerId: teamId,
            storageType: 'TEAM'
          },
        });
    storage.value = response.data;
    console.log(storage.value);
  };
  
  const getStorageFiles = async () => {
    console.log("getStorageFiles!!!!!");
    const response = await axios.get('storage/list',
        {
      params: {
        ownerId: teamId,
        storageType: 'TEAM'
      }
    });
    storageFiles.value = response.data;
    console.log(storageFiles.value);
    showFiles.value = []
    storageFiles.value.forEach((file) => {
      showFiles.value.push(true);
    });
  };
  
  const getSizePresent = (size) => {
    let sizePresent = size / 1024 / 1024;
    if(sizePresent < 1){
      sizePresent *= 1024;
      sizePresent = sizePresent.toFixed(2);
      sizePresent += "KB";
    }else{
      sizePresent = sizePresent.toFixed(2);
      sizePresent += "MB";
    }
    return sizePresent;
  };
  
  const getDatePresent = (date) => {
    return new Date(date).toLocaleString();
  }
  
  const downloadFile = async (id) => {
    console.log(id);
    const response = await axios.post(`storage/download`,
        null,
        {
          params: {
            ownerId: teamId,
            storageType: 'TEAM',
            storageFileId: id,
          },
          responseType: 'blob',
        });
  
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
  
    const disposition = response.headers['content-disposition'];
    let filename = "downloaded_file";
    if (disposition && disposition.includes('attachment')) {
      const matches = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
        filename = decodeURIComponent(filename);
      }
    }
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
  
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  const deleteConfirm = (id, idx) => {
    if(confirm(`${storageFiles.value[idx]['originalName']} 을 삭제하시겠습니까?`)){
      deleteFile(id, idx);
    }
  };
  
  const deleteFile = async (id, idx) => {
    const response = await axios.post(`storage/delete/file`,
        null,
        {
          params: {
            ownerId: teamId,
            storageType: 'TEAM',
            storageFileId: id,
          }
        });
  
    if (response.status === 200) {
      showFiles.value[idx] = false;
    }
    console.log(showFiles.value);
  };
  
  onMounted(() => {
    getStorage();
    getStorageFiles();
  });
  
  </script>
  
  <style scoped>
  
  .fade-modal-enter-active, .fade-modal-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-modal-enter-from, .fade-modal-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .file-storage {
    max-width: 100%;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .usage-text {
    text-align: center;
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .usage-bar {
    width: 100%;
    height: 30px;
    background-color: #e0e0e0;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  
  .usage-fill {
    height: 100%;
    background: linear-gradient(90deg, #8A9BF9, #86EDDA);
    border-radius: 15px 0 0 15px;
  }
  
  .file-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .file-item:last-child {
    border-bottom: none;
  }
  
  .file-item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid rgba(200, 200, 200, 0.2) !important;
    align-items: center;
    overflow: hidden;
  }
  
  .file-name {
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    flex-grow: 1;
  }
  
  .file-name:hover{
    color: #9e9ea8;
    cursor: pointer;
  }
  
  .file-size {
    font-size: 14px;
    color: #666;
    min-width: 80px;
    text-align: right;
    flex-shrink: 0;
  }
  
  .file-date {
    font-size: 12px;
    color: #666;
    min-width: 120px;
    text-align: right;
  }
  
  .upload-section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;
  }
  
  input[type="file"] {
    display: none;
  }
  
  .upload-button {
    background-color: #8A9BF9;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .upload-button:hover {
    background-color: #86EDDA;
  }
  
  .download-button {
    background: none;
    border: none;
    color: #8A9BF9;
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;
    transition: color 0.3s;
  }
  
  .download-button:hover {
    color: #86EDDA;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: #8A9BF9;
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;
    transition: color 0.3s;
  }
  
  .delete-button:hover {
    color: #86EDDA;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>
  