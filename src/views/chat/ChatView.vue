<template>
<div class="fixed-plugin">
    <a class="px-3 py-2 fixed-plugin-button text-dark position-fixed" @click="openChatView">
        <i class="py-2 fa fa-comments-o"></i>
    </a>
        <!-- <ChatNotification /> -->
    <div :class="['chat-view', showChatView ? 'show' : '']" ref="chatViewContainer">
        <!-- 채팅 목록 (ChatList) -->
        <div class="chat-list-view">
            <ChatList :chatRooms="chatRooms" :messages="messages" :lastPingTime="lastPingTime" :notificationBadge="notificationBadge"
                @select-chat-room="selectChatRoom" @add-chat-room="addChatRoom" />
        </div>

        <div class="chat-components">
        <!-- 채팅방 (ChatRoom) -->
        <div v-if="selectedChatRoom" class="chat-room-view">
            <ChatRoom :chat="selectedChatRoom" :messages="messages[selectedChatRoom.chatRoomId]" :stompClient="stompClient" :showChatRoom="showChatRoom"
                @close-chat-room="closeChatRoom" @select-file-list="openFileList"
                @select-details="openChatRoomDetails" @set-prevent-close="setPreventClose" />
        </div>

        <!-- 채팅방 상세 페이지 (ChatRoomDetails) -->
        <div v-if="selectedChatRoomDetails" class="chat-room-details-view">
            <ChatRoomDetails :chat="selectedChatRoom" :showChatRoomDetails="selectedChatRoomDetails"
                @close-details="closeChatRoomDetails" @chat-room-updated="updateChatName" @set-prevent-close="setPreventClose" />
        </div>

        <!-- 파일함 (ChatFile) -->
        <div v-if="selectedFileList" class="file-list-view">
            <ChatFile :chat="selectedChatRoom" :showFileList="selectedFileList"
                @close-file-list="closeFileList" @set-prevent-close="setPreventClose" />
        </div>
    </div>
    </div>


</div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
let lastPingTime = ref(null);
let timeoutHandle;
let lastMessageTime = [];

import ChatRoom from './components/ChatRoom.vue';
import ChatFile from './components/ChatFile.vue';
import ChatList from './components/ChatList.vue';
import ChatRoomDetails from './components/ChatRoomDetails.vue';

const selectedChatRoom = ref(null);
const selectedFileList = ref(false);
const selectedChatRoomDetails = ref(false);
const showChatRoom = ref(false);
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
const notificationBadge = ref([]);

const isConnected = ref(true);

// 웹소켓 연결
const connectWebSocket = (chatRooms) => {
    if (!stompClient.value || !stompClient.value.connected) {
        const socket = new SockJS('https://api.200concentric.com/wss');
        stompClient.value = Stomp.over(socket);
        stompClient.value.debug = function (string) {
            if (!(string.includes('ping')) && !(string.includes('pong'))) {
            console.log(string);
            }
        };

        stompClient.value.connect({ Authorization: `${accessToken}` }, () => {
            subscribeChatRoom(chatRooms);
            setInterval(() => {
                lastPingTime.value = new Date();
                stompClient.value.send("/pub/ping", {}, JSON.stringify({ message: 'ping' }));

                clearTimeout(timeoutHandle);
                timeoutHandle = setTimeout(() => {
                    handlePingTimeout();
                }, 60000);
            }, 60000);  
            
            stompClient.value.subscribe('/sub/pong', (message) => {
                console.log("Pong 받음:", message.body);
                clearTimeout(timeoutHandle);
            });
        }, (error) => {
            console.error('채팅방을 연결하는 데 실패했습니다.', error);
        });
    }
};

// WebSocket 연결 해제
const disconnectWebSocket = () => {
    if (stompClient.value && stompClient.value.connected) {
        stompClient.value.disconnect();
    }
    isConnected.value = false;
};

watch(() => userStore.isLoggedIn, (isLoggedIn) => {
    if (!isLoggedIn) {
        disconnectWebSocket();
    }
});

// Ping 응답이 없으면 처리
function handlePingTimeout() {
    console.log("Ping 메시지 전송이 중단됨");
    stompClient.value.send("/pub/ping/timeout", {}, JSON.stringify({ loggedInMemberId, lastPingTime }));
}

// 외부 클릭 감지
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
    if (!isConnected.value) return;
    isConnected.value = false;
    try {
        const response = await axios.get("/chat/list");
        chatRooms.value = response.data;
        // console.log(chat.value);
        chatRooms.value.forEach((room) => {
            messages.value[room.chatRoomId] = [];  
            notificationBadge.value[room.chatRoomId] = false;
        });

        if (subscribedChatRooms.length === 0) {
            connectWebSocket(chatRooms.value);
        }

        findLastWebSocketApi(loggedInMemberId.value);
        userStore.setToken(response.headers.authorization);
    } catch (err) {
        console.error("채팅방 목록을 가져오는데 실패했습니다.", err);
    }
};

const findLastWebSocketApi = async (memberId) => {
    try {
        const response = await axios.get(`/chat/last/connect?memberId=${memberId}`);
        lastPingTime.value = response.data.lastConnect;
        console.log("lastPingTime: ", lastPingTime.value);

        findLastMessageApi();
    } catch (err) {
        console.error("웹소켓 저장 시간을 가져오는데 실패했습니다.", err);
    }
}

const findLastMessageApi = async () => {
    try {
        const response = await axios.get("/chat/last/message");
        lastMessageTime = response.data;
        console.log("lastMessageTime: ", lastMessageTime);

        filterNewMessages(lastMessageTime);
    } catch (err) {
        console.error("마지막 메세지 저장 시간을 가져오는데 실패했습니다.", err);
    }
}

const filterNewMessages = (lastMessageList) => {
    const pingTime = new Date(lastPingTime.value);

    lastMessageList.forEach(lastMessage => {
        const messageTime = new Date(lastMessage.createAt); 

        if (messageTime > pingTime) {
            if (notificationBadge.value[lastMessage.chatRoomId] !== undefined) {
                notificationBadge.value[lastMessage.chatRoomId] = true;  // True로 설정
            } else {
                console.log(`채팅방 ${lastMessage.chatRoomId}에 해당하는 알림 뱃지가 없습니다.`);
            }
        }
    });
}

// 채팅방 구독
const subscribeChatRoom = (chatRooms) => {
    chatRooms.forEach((room) => {
        if (!subscribedChatRooms.includes(room.chatRoomId)) {
            stompClient.value.subscribe(`/sub/chat/${room.chatRoomId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                if (receivedMessage.memberId === loggedInMemberId.value) {
                    notificationBadge.value[room.chatRoomId] = false; 
                } else {
                    notificationBadge.value[room.chatRoomId] = true;
                }
                if (!messages.value[room.chatRoomId]) {
                    messages.value[room.chatRoomId] = [];
                }
                messages.value[room.chatRoomId] = [receivedMessage];
                notificationStore.showNotification(receivedMessage.memberId, `${receivedMessage.nickname}: ${receivedMessage.message}`, 2000);
            
            });
            subscribedChatRooms.push(room.chatRoomId);
        } else {
            console.log(`이미 연결된 채팅방입니다. ${room.chatRoomId}`);
        }
    });
};

// preventClose를 true로 설정
const setPreventClose = () => {
    preventClose = true;
};

onMounted(() => {
    if (userStore.isLoggedIn === undefined || userStore.isLoggedIn === false) {
        return;
    } else {
        chatListApi();
    }
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    disconnectWebSocket();
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
    selectedChatRoom.value = null;
    selectedChatRoomDetails.value = false;
    selectedFileList.value = false;
}

const selectChatRoom = (chat) => {
    selectedChatRoom.value = chat;
    console.log("선택된 채팅방:", selectedChatRoom.value);
    selectedFileList.value = false; // 파일함 초기화
    selectedChatRoomDetails.value = false;
    notificationBadge.value[chat.chatRoomId] = false; // 알림 뱃지 초기화
    showChatRoom.value = true;
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
        // notificationStore.showNotification(receivedMessage.memberId, `${receivedMessage.nickname}: ${receivedMessage.message}`, 2000);
    });
    subscribedChatRooms.push(newChatRoom.id);
    // console.log(subscribedChatRooms);
};

const closeChatRoom = () => {
    selectedChatRoom.value = null;
    selectedFileList.value = false;
    selectedChatRoomDetails.value = false;
    preventClose = true;
};

const openFileList = () => {
    selectedChatRoomDetails.value = false;
    selectedFileList.value = !selectedFileList.value;
};

const closeFileList = () => {
    selectedFileList.value = false;
    preventClose = true;
};

const openChatRoomDetails = () => {
    selectedFileList.value = false;
    selectedChatRoomDetails.value = !selectedChatRoomDetails.value;
}

const closeChatRoomDetails = () => {
    selectedChatRoomDetails.value = false;
    preventClose = true;
}

window.addEventListener('beforeunload', () => {
    disconnectWebSocket();
});

</script>

<style scoped>
.chat-view {
    position: fixed;
    top: 0;
    right: -400px;
    height: 100vh; 
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 1000; 
    display: flex;
    flex-direction: row;
    outline: none;
    transition: right 0.4s ease;
}

.chat-view.show {
    right: 0; /* 애니메이션 후 화면 안으로 슬라이드 */
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
