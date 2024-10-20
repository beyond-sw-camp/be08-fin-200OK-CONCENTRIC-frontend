<template>
<div class="fixed-plugin">
    <a class="px-3 py-2 fixed-plugin-button text-dark position-fixed" @click="openChatView">
        <i class="py-2 fa fa-comments-o"></i>
    </a>
        <!-- <ChatNotification /> -->
    <div v-if="showChatView" class="chat-view" ref="chatViewContainer">
        <!-- 채팅 목록 (ChatList) -->
        <div class="chat-list-view">
            <ChatList :chatRooms="chatRooms" :messages="messages" :lastPingTime="lastPingTime"
                @select-chat-room="selectChatRoom" @add-chat-room="addChatRoom" />
        </div>

        <div class="chat-components">
        <!-- 채팅방 (ChatRoom) -->
        <div v-if="selectedChatRoom" class="chat-room-view">
            <ChatRoom :chat="selectedChatRoom" :messages="messages[selectedChatRoom.chatRoomId]" :stompClient="stompClient"
                @close-chat-room="closeChatRoom" @select-file-list="openFileList"
                @select-details="openChatRoomDetails" @set-prevent-close="setPreventClose" />
        </div>

        <!-- 채팅방 상세 페이지 (ChatRoomDetails) -->
        <div v-if="selectedChatRoomDetails" class="chat-room-details-view">
            <ChatRoomDetails :chat="selectedChatRoom" @close-details="closeChatRoomDetails"
                @chat-room-updated="updateChatName" @set-prevent-close="setPreventClose" />
        </div>

        <!-- 파일함 (ChatFile) -->
        <div v-if="selectedFileList" class="file-list-view">
            <ChatFile :chat="selectedChatRoom" @close-file-list="closeFileList" @set-prevent-close="setPreventClose" />
        </div>
    </div>
    </div>


</div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useStore } from "vuex";

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
let lastPingTime = null;

import ChatRoom from './components/ChatRoom.vue';
import ChatFile from './components/ChatFile.vue';
import ChatList from './components/ChatList.vue';
import ChatRoomDetails from './components/ChatRoomDetails.vue';

const selectedChatRoom = ref(null);
const selectedFileList = ref(false);
const selectedChatRoomDetails = ref(false);
const showChatView = ref(false);


const chatViewContainer = ref(null);

const chatRooms = ref([]);
let preventClose = false;

const messages = ref([]);
const stompClient = ref(null);
let subscribedChatRooms = [];

import { useUserStore } from '@/store/user';
const userStore = useUserStore();
const loggedInMemberId = computed(() => userStore.userInfo.id);
const accessToken = userStore.accessToken;

import { useNotificationStore } from '@/store/notification';
const notificationStore = useNotificationStore();

// 웹소켓 연결
const connectWebSocket = (chatRooms) => {
    if (!stompClient.value || !stompClient.value.connected) {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.value = Stomp.over(socket);
        stompClient.value.debug = function (string) {
            if (!(string.includes('ping')) && !(string.includes('pong'))) {
            console.log(string);
            }
        };
    }

        stompClient.value.connect({ Authorization: `${accessToken}` }, () => {
            subscribeChatRoom(chatRooms);
            setInterval(() => {
                lastPingTime = new Date();
                stompClient.value.send("/pub/ping", {}, JSON.stringify({ message: 'ping' }));
            }, 20000);  
            
            stompClient.value.subscribe('/sub/pong');
        }, (error) => {
            console.error('채팅방을 연결하는 데 실패했습니다.', error);
        });
    };

// 외부 클릭 감지 로직
const handleClickOutside = (event) => {
    if (preventClose) {
        preventClose = false;
        return;
    }
    if (showChatView.value && chatViewContainer.value && !chatViewContainer.value.contains(event.target)) {
        closeChatView(); 
    }
};

const chatListApi = async () => {
    try {
        const response = await axios.get("/chat/list");
        chatRooms.value = response.data;
        // console.log(chat.value);
        chatRooms.value.forEach((room) => {
            messages.value[room.chatRoomId] = [];  // 각 chatRoomId에 빈 배열 생성
        });

        // console.log(messages.value);
        if (subscribedChatRooms.length === 0) {
            connectWebSocket(chatRooms.value);
        }
    } catch (err) {
        console.error("채팅방 목록을 가져오는데 실패했습니다.", err);
    }
};

const subscribeChatRoom = (chatRooms) => {
    chatRooms.forEach((room) => {
        if (!subscribedChatRooms.includes(room.chatRoomId)) {
            stompClient.value.subscribe(`/sub/chat/${room.chatRoomId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);

                // 해당 채팅방의 알림 카운트 증가
                // const chatRoomIndex = chat.value.findIndex(c => c.chatRoomId === room.chatRoomId);
                // if (chatRoomIndex !== -1) {
                //     if (receivedMessage.memberId === loggedInMemberId.value) {
                //         return;
                //     }
                //     chat.value[chatRoomIndex].unreadCount += 1;  // 알림 카운트 증가
                // }
                // if (!messages.value[room.chatRoomId]) {
                //     messages.value[room.chatRoomId] = [];
                // }
                // messages.value[room.chatRoomId].push(receivedMessage);
                messages.value[room.chatRoomId] = [receivedMessage];
                notificationStore.showNotification(receivedMessage.memberId, `${receivedMessage.nickname}: ${receivedMessage.message}`, 2000);
            
            });
            subscribedChatRooms.push(room.chatRoomId);
            // console.log(subscribedChatRooms);
        } else {
            console.log(`이미 연결된 채팅방입니다. ${room.chatRoomId}`);
        }
    });
};

// preventClose를 true로 설정하는 함수
const setPreventClose = () => {
    preventClose = true;
};

onMounted(() => {
    chatListApi();
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

const openChatView = () => {
    preventClose = true; // 처음 클릭 이벤트를 무시
    showChatView.value = true;

    setTimeout(() => {
        preventClose = false;
    }, 100);
}

const closeChatView = () => {
    showChatView.value = false;
}

const selectChatRoom = (chat) => {
    selectedChatRoom.value = chat;
    console.log("선택된 채팅방:", selectedChatRoom.value);
    selectedFileList.value = false; // 파일함 초기화
    selectedChatRoomDetails.value = false;
};

// 채팅방 이름 전역 업데이트
const updateChatName = ({ chatRoomId, newNickname }) => {
    if (selectedChatRoom.value && selectedChatRoom.value.chatRoomId === chatRoomId) {
        selectedChatRoom.value.nickname = newNickname;
    }
};

const addChatRoom = async (newChatRoom) => {
    await chatListApi();
    stompClient.value.subscribe(`/sub/chat/${newChatRoom.id}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        messages.value[newChatRoom.id] = [receivedMessage];
        notificationStore.showNotification(receivedMessage.memberId, `${receivedMessage.nickname}: ${receivedMessage.message}`, 2000);
    });
    subscribedChatRooms.push(newChatRoom.id);
    console.log(subscribedChatRooms);
};

const closeChatRoom = () => {
    selectedChatRoom.value = null;
    selectedFileList.value = false;
    selectedChatRoomDetails.value = false;
};

const openFileList = () => {
    selectedChatRoomDetails.value = false;
    selectedFileList.value = true;
};

const closeFileList = () => {
    selectedFileList.value = false;
};

const openChatRoomDetails = () => {
    selectedFileList.value = false;
    selectedChatRoomDetails.value = true;
}

const closeChatRoomDetails = () => {
    selectedChatRoomDetails.value = false;
}

</script>

<style scoped>
.chat-view {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh; 
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 1000; 
    display: flex;
    flex-direction: row;
    outline: none;
}

.chat-components {
    position: fixed;
    top: 20%;
    right: 300px;
    /* height: 100vh; */
    display: flex;
    flex-direction: row;
    /* align-items: center; */
}

.chat-list-view {
    flex-grow: 1;
    width: 300px;
    border-right: 1px solid #ddd;
    /* margin-left: 10px; */
}

.chat-room-view {
    width: 360px;
    min-height: 550px;
    flex-grow: 1;
    margin-right: 10px;
    order: 2;
    align-self: center;
    /* margin: auto 0; */
}

.file-list-view {
    flex-grow: 1;
    margin-right: 10px;
    width: 350px;
    max-height: 550px;
    border-radius: 10px;
    order: 1;
}

.chat-room-details-view {
    flex-grow: 1;
    margin-right: 10px;
    width: 350px;
    max-height: 550px;
    border-radius: 10px;
    order: 1;
}

.fixed-plugin {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 1000;
}

.fixed-plugin-button {
    background-color: #333;
    color: #fff;
    border-radius: 50%;
}

.shadow-lg.card {
    display: none;
}
</style>
