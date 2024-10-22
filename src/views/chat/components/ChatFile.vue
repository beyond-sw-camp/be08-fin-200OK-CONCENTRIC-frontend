<template>
    <div v-if="showFileList">
        <div :class="['file-container', isVisible ? 'show' : '']">
        <!-- <div class="file-container"> -->
            <!-- 상단 헤더 -->
            <div class="file-header">
                <h3 class="file-header-name">파일</h3>
                <button @click="closeFileList" class="header-button close-button">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>

            <!-- 파일 목록 -->
            <ul class="file-list">
                <li v-for="file in files" :key="file.storageFileId" class="file-item">
                    <span class="file-name">{{ file.originalName }}</span>
                    <button @click.stop="downloadFile(file)" class="download-button">
                        <i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const props = defineProps({
    chat: {
        type: Object,
        required: true,
    },
    showFileList: {
        type: Boolean,
        required: true
    }
});

const chatRoomId = props.chat.chatRoomId;
const files = ref([]);

const emit = defineEmits(['close-file-List']);

// 채팅방 첨부파일 목록
const findChatStorageApi = async () => {
    try {
        const response = await axios.get(
            `/storage/list?ownerId=${chatRoomId}&storageType=CHAT`, {
        });
        files.value = response.data;
    } catch (err) {
        console.error("파일함 목록을 가져오는데 실패했습니다.", err);
    }
};

const isVisible = ref(false);
onMounted(() => {
    findChatStorageApi();
    setTimeout(() => {
        isVisible.value = true;
    }, 50);
});

//파일 다운로드
const downloadFile = async (file) => {
    try {
        emit('set-prevent-close');
        const response = await axios.post(
            `/storage/download?ownerId=${chatRoomId}&storageType=CHAT&storageFileId=${file.storageFileId}`, 
            null,
            {
            responseType: 'blob' 
            }
        );

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
    } catch (err) {
    console.error("파일 다운로드에 실패했습니다.", err);
    }
};

const closeFileList = () => {
    isVisible.value = false
    setTimeout(() => {
        emit('close-file-List');
    }, 300);
};

</script>


<style scoped>
.file-container {
    display: flex;
    flex-direction: column;
    width: 350px;
    max-height: 550px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    opacity: 0;
    transform: translateX(50px) scale(0.9);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.file-container.show {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
}


.file-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 19px;
    border-bottom: 1px solid #ddd;
    background-color: #f5f5f5;
}

.file-header-name {
    margin: 0;
    font-size: 16px;
}

.header-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0px;
    font-size: 14px;
    color: #666;
}

.close-button:hover {
    color: #5b5b5b;
}

.file-list {
    padding: 0;
    list-style-type: none;
    margin: 0;
    overflow-y: auto;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 13px 15px 20px;
    border-bottom: 1px solid #ddd;
}

.file-name {
    flex-grow: 1;
    font-size: 13px;
}

.download-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #666;
}

.download-button:hover {
    color: #5b5b5b;
}
</style>