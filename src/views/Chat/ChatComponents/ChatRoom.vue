<template>
    <div class="chat-room-container">
        <!-- 채팅방 헤더 -->
        <div class="chat-room-header">
            <img :src="chat.profileImage" class="profile-image" @click="toggleDetails" />
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
                <div class="message-bubble">
                    <p v-if="chatMessage.message" class="chat-message-text">{{ chatMessage.message }}</p>
                    <template v-else-if="chatMessage.fileUrl">
                        <img v-if="isImage(chatMessage.fileUrl)" :src="chatMessage.loadedImageUrl" class="chat-message-file" />
                        <a v-else :href="chatMessage.fileUrl" target="_blank" class="chat-message-file">{{ getFileName(chatMessage.fileUrl) }}</a>
                    </template>
                </div>
            </div>
        </div>

        <!-- 채팅 입력 창 -->
        <div class="chat-room-footer">
            <input v-model="newMessage" type="text" placeholder="메시지를 입력하세요..." class="message-input"
                @keyup.enter.prevent="sendMessage"/>
                <label class="attach-button">
                    +
                    <input type="file" ref="fileInput" @change="sendFile" multiple hidden />
                </label>
            <button @click="sendMessage" class="send-button">전송</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user';
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const userStore = useUserStore();
const loggedInMemberId = computed(() => userStore.userInfo.id);
const accessToken = userStore.accessToken;

const chatMessages = ref([]);
const newMessage = ref("");
const stompClient = ref(null);
const messageContainer = ref(null);
const files = ref(null);
const chatFiles = ref([]);
const imageSrc = ref("");

const props = defineProps({
    chat: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits([ 
    'close-chat-room', 
    'select-file-list', 
    'toggle-details'
]);

// 채팅 내역 불러오기
const chatMessageListApi = async () => {
    try {
        const response = await axios.get(`/chat/${props.chat.chatRoomId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        //추가
        const messages = response.data;
        await Promise.all(messages.map(async (message) => {
            if (message.fileUrl && isImage(message.fileUrl)) {
                message.loadedImageUrl = await getImage(message.fileUrl);
            }
        }));
        
        chatMessages.value = response.data;
        scrollToBottom();
    } catch (err) {
        console.error("채팅 메세지 내역을 불러오는데 실패했습니다.", err);
    }
}

onMounted(() => {
    chatMessageListApi();
    connectToChatRoom();
});

// props.chat이 변경될 때마다 API 호출
watch(
    () => props.chat.chatRoomId, // chatRoomId가 변경될 때마다 감지
    (newChatRoomId, oldChatRoomId) => {
        if (newChatRoomId !== oldChatRoomId) {
            console.log(`채팅방 ID가 ${oldChatRoomId}에서 ${newChatRoomId}로 변경되었습니다.`);
            // unsubscribe();
            chatMessageListApi(); 
            connectToChatRoom();
        }
    },
);

// STOMP 연결
const connectToChatRoom = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.value = Stomp.over(socket);

    stompClient.value.connect({ Authorization: `${accessToken}` }, (frame) => {
        console.log('Connected to chat room:', props.chat.chatRoomId);

        // 채팅방 구독 설정
        stompClient.value.subscribe(`/sub/chat/${props.chat.chatRoomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log(`Received message from chatRoom ${props.chat.chatRoomId}:`, receivedMessage);
            chatMessages.value = [...chatMessages.value, receivedMessage];
            scrollToBottom();
        });
    });
};

// 채팅방 구독 해제
// const unsubscribe = () => {
//     if (stompClient.value && stompClient.value.connected) {
//         stompClient.value.disconnect();
//         console.log(`Unsubscribed from chatRoom ${props.chat.chatRoomId}`);
//     }
// };

// 메세지 전송
const sendMessage = async () => {
    if (!newMessage.value || newMessage.value.trim() === "") {
        return;
    }

    const message = {
        memberId: loggedInMemberId.value,
        message: newMessage.value,
        fileUrl: null,
    };

    stompClient.value.send(`/pub/chat/${props.chat.chatRoomId}`, {}, JSON.stringify(message));
    scrollToBottom();
    newMessage.value = '';
};

// 이미지와 일반 파일 분리
const isImage = (fileUrl) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = fileUrl.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
};

// 파일 이름 추출(나중에 api로 original 이름 추출..해야할 듯)
const getFileName = (fileUrl) => {
    return fileUrl.split('/').pop();
};

// 이미지 로드
const getImage = async (fileUrl) => {
    try {
        const response = await axios.post(
            `storage/image/profile?path=${fileUrl}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.imageUrl;        
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

const closeChatRoom = () => {
    emit("close-chat-room");
};

const goToFileList = () => {
    emit("select-file-list");
};

const toggleDetails = () => {
    emit("toggle-details");
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
    display: flex;
    margin: 7px;
}

.chat-message-text {
    display: block;
    margin-bottom: 0px;
    font-size: 14px;
}

.chat-message-file {
    display: flex;
    font-size: 14px;
}

.partner-message {
    justify-content: flex-start;
}

.my-message {
    justify-content: flex-end;
}

.message-bubble {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 25px;
    background-color: #e6e6e6;
}

.my-message .message-bubble {
    background-color: #7ea7ea;
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