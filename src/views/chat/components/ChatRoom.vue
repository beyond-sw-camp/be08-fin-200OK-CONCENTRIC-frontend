<template>
    <div v-if="showChatRoom">
        <div :class="['chat-room-container', isVisible ? 'show' : '']">
        <!-- 채팅방 헤더 -->
            <div class="chat-room-header">
                <img :src="chat.profileImage" class="profile-image" @click="goToDetails"/>
                <div class="profile-info">
                    <h3 class="profile-name">{{ chat.nickname }}</h3>
                </div>
                <!-- 닫기 및 파일함 버튼 -->
                <button @click="goToFileList" class="header-button file-button">
                    <i class="fa fa-folder-open" aria-hidden="true"></i>
                </button>
                <button @click="closeChatRoom" class="header-button close-button">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>

            <!-- 채팅 메시지 목록 -->
            <div class="chat-room-body" ref="messageContainer">
                <div v-for="(chatMessage, index) in chatMessages" :key="index"
                    :class="['chat-message', chatMessage.memberId === loggedInMemberId || chatMessage.sentByMe ? 'my-message' : 'partner-message']">
                    <a class="chat-message-nickname">{{ chatMessage.nickname }}</a>
                    <a class="chat-message-date">{{ formatTime(chatMessage.createAt) }}</a>
                    <div class="message-bubble">
                        <p v-if="chatMessage.message" class="chat-message-text">{{ chatMessage.message }}</p>
                        <template v-else-if="chatMessage.fileName">
                            <img v-if="isImage(chatMessage.fileName)" :src="chatMessage.chatImage"
                                class="chat-message-image img-fluid border border-2 border-white" />
                            <a v-else @click.stop="downloadFile(chatMessage.fileId)" href="#" class="chat-message-file">
                                {{ chatMessage.fileName }}
                            </a>
                        </template>
                    </div>
                </div>
            </div>

            <!-- 채팅 입력 창 -->
            <div class="chat-room-footer">
                <input v-model="newMessage" type="text" placeholder="메시지를 입력하세요..." class="message-input"
                    @keyup.enter.prevent="sendMessage" />
                <label class="attach-button">
                    +
                    <input type="file" ref="fileInput" @change="sendFile" multiple hidden />
                </label>
                <button @click="sendMessage" class="send-button">전송</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const loggedInMemberId = computed(() => userStore.userInfo.id);
const loggedInMemberName = computed(() => userStore.userInfo.nickname);

const chatMessages = ref([]);
const newMessage = ref([]);
const messageContainer = ref(null);
const files = ref(null);
const chatFiles = ref([]);
const imageSrc = ref("");

const props = defineProps({
    chat: {
        type: Object,
        required: true,
    },
    showChatRoom: {
        type: Boolean,
        required: true
    },
    messages: Array,
    stompClient: Object
});

const emit = defineEmits([
    'close-chat-room',
    'select-file-list',
    'select-details'
]);

// 채팅 내역 불러오기
const chatMessageListApi = async () => {
    try {
        const response = await axios.get(`/chat/${props.chat.chatRoomId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res = response.data.map(msg => ({
            ...msg,
            chatImage: null,
        }));
        chatMessages.value = res;
        await Promise.all(
            chatMessages.value.map(async (chatMessage, index) => {
                if (isImage(chatMessage.fileName)) {
                    const chatImage = await getImage(chatMessage.fileId);
                    chatMessages.value[index].chatImage = chatImage;
                }
            })
        );
        scrollToBottom();
        userStore.setToken(response.headers.authorization);
    } catch (err) {
        console.error("채팅 메세지 내역을 불러오는데 실패했습니다.", err);
    }
}

const isVisible = ref(false);
onMounted(() => {
    chatMessageListApi();
    setTimeout(() => {
        isVisible.value = true;
    }, 50);
});

// props.chat이 변경될 때마다 API 호출
watch(
    () => props.chat.chatRoomId, // chatRoomId가 변경될 때마다 감지
    (newChatRoomId, oldChatRoomId) => {
        if (newChatRoomId !== oldChatRoomId) {
            console.log(`채팅방 ID가 ${oldChatRoomId}에서 ${newChatRoomId}로 변경되었습니다.`);
            // unsubscribe();
            chatMessageListApi();
            // connectToChatRoom();
        }
    },
);


watch(() => props.messages, async (newMessages) => {
    if (!newMessages) {
        return;
    }
    const res = newMessages.map(msg => ({
            ...msg,
            chatImage: null,
        }));
    newMessages = res;
    await Promise.all(newMessages.map(async (msg) => {
        const isImageFile = isImage(msg.fileName);

        if (isImageFile) {
            const chatImage = await getImage(msg.fileId);
            msg.chatImage = chatImage;
        }
    }));
    chatMessages.value = [...chatMessages.value, ...newMessages];
    scrollToBottom();

});

// 메세지 전송
const sendMessage = async () => {
    if (!newMessage.value || newMessage.value.trim() === "") {
        return;
    }

    const message = {
        memberId: loggedInMemberId.value,
        nickname: loggedInMemberName.value,
        message: newMessage.value,
    };

    props.stompClient.send(`/pub/chat/${props.chat.chatRoomId}`, {}, JSON.stringify(message));
    scrollToBottom();
    newMessage.value = '';
};

// 이미지와 일반 파일 분리
const isImage = (fileName) => {
    if (fileName && typeof fileName === 'string') {
        const extension = fileName.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        return imageExtensions.includes(extension);
    }
    return false;  
};

//파일 다운로드

const downloadFile = async (fileId) => {
    try {
        emit('set-prevent-close');
        const response = await axios.post(
            `/storage/download?ownerId=${props.chat.chatRoomId}&storageType=CHAT&storageFileId=${fileId}`,
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

// 이미지 로드
const getImage = async (fileId) => {
    try {
        const response = await axios.post(
            `storage/image?storageFileId=${fileId}`,
            null,
            {
                responseType: 'blob'
            }
        );
        imageSrc.value = URL.createObjectURL(response.data);
        scrollToBottom();
        return imageSrc.value
    } catch (err) {
        console.error("이미지를 불러오는데 실패했습니다.", err);
    }
};

// 첨부파일 전송
const sendFile = async (event) => {
    files.value = event.target.files;
    try {
        // FormData 생성
        const formData = new FormData();
        formData.append("chatRoomId", props.chat.chatRoomId);
        formData.append("memberId", loggedInMemberId.value);
        formData.append("nickname", loggedInMemberName.value);

        for (let i = 0; i < files.value.length; i++) {
            formData.append("files", files.value[i]);
        }

        const response = await axios.post(`/chat/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        chatFiles.value = response.data;
        scrollToBottom();
    } catch (err) {
        console.error("첨부파일을 전송하는데 실패했습니다.", err);
    }
};

const scrollToBottom = async () => {
    await nextTick();
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
};

const formatTime = (dateString) => {
    if (dateString && typeof dateString === 'string') {
        const timePart = dateString.split('T')[1];
        const [hours, minutes] = timePart.split(':');
        return `${hours}:${minutes}`;
    }
    return '';
};

const closeChatRoom = () => {
    isVisible.value = false
    setTimeout(() => {
        emit('close-chat-room');
    }, 300);
};

const goToFileList = () => {
    emit("select-file-list");
};

const goToDetails = () => {
    emit("select-details");
};

</script>

<style scoped>
.chat-room-container {
    display: flex;
    flex-direction: column;
    height: 550px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    opacity: 0;
    transform: translateX(50px) scale(0.9);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.chat-room-container.show {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
}

/* 채팅방 헤더 스타일 */
.chat-room-header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    background-color: #f5f5f5;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 40%;
    margin-right: 10px;
    cursor: pointer;
}

.profile-info {
    flex-grow: 1;
}

.profile-name {
    margin: 0;
    font-size: 16px;
}

/* 새로 추가된 헤더 버튼 스타일 */
.header-buttons {
    display: flex;
    gap: 10px;
}

.header-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
}

.header-button:hover {
    color: #5b5b5b;
}

.close-button {
    color: #666;
    font-size: 11pt;
}

.file-button {
    color: #666;
    font-size: 11pt;
}

/* 채팅방 메시지 목록 스타일 */
.chat-room-body {
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
}

.chat-message {
    position: relative;
    display: flex;
    margin: 7px;
    margin-top: 25px;
}

.chat-message-text {
    display: block;
    margin-bottom: 0px;
    font-size: 14px;
}

.chat-message .chat-message-nickname {
    position: absolute;
    display: block;
    margin-top: -25px;
    font-size: 14px;
    color: #444;
}

.chat-message-file {
    display: flex;
    font-size: 14px;
}

.partner-message {
    justify-content: flex-start;
    order: 1;
}

.my-message {
    justify-content: flex-end;
}

.my-message .chat-message-date {
    position: relative;
    display: block;
    font-size: 10px;
    margin-right: 2%;
    margin-top: 4%;
    color: #666;
}

.partner-message .chat-message-date {
    position: relative;
    display: block;
    font-size: 10px;
    text-align: right;
    margin-left: 2%;
    margin-top: 4%;
    order: 2;
    color: #666;
}

.message-bubble {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 0px 25px 25px 25px;
    background-color: #e6e6e6;
}

.my-message .message-bubble {
    background-color: #7ea7ea;
    border-radius: 25px 0px 25px 25px;
    color: #fff;
}

/* 채팅방 입력창 스타일 */
.chat-room-footer {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
    background-color: #f5f5f5;
}

.message-input {
    flex-grow: 1;
    padding: 5px 10px 30px;
    border: none;
    background-color: #ffffff00;
    border-radius: 5px;
    font-size: 13px;
}

.send-button {
    border: none;
    font-size: 13px;
    color: #444;
    border-radius: 10px;
    padding: 0px 10px;
    cursor: pointer;
    margin-left: 5px;
    margin-top: 8%;
    height: 30px;
    background-color: #f0f0f0;
}

.attach-button {
    background: none;
    border: none;
    font-size: 16px;
    color: #888;
    cursor: pointer;
    margin-left: 10px;
    margin-top: 8%;
    font-weight: 100;
}

.attach-button:hover {
    color: #5b5b5b;
}

.send-button:hover {
    background-color: #ececec;
}
</style>