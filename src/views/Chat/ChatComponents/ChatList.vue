<template>
    <div class="chat-list-container">
        <div class="chat-header">
            <h5 class="chat-header-text">채팅</h5>
            <!-- 채팅방 추가 버튼 -->
            <button class="add-chat-button" @click="openFriendList">
                +
            </button>
        </div>

        <!-- 채팅 목록 -->
        <ul class="chat-list">
            <li v-for="(chat, index) in sortedChatRooms" :key="index" @click="goToChatRoom(chat)"
                class="chat-list-item">
                <img :src="chat.profileImage" class="profile-image" />
                <div class="chat-info">
                    <h4 class="chat-name">{{ chat.nickname }}</h4>
                    <p class="chat-last-message">{{ chat.lastMessage }}</p>
                </div>
                <!-- 즐겨찾기 버튼 -->
                <button @click.stop="chatBookmarkApi(chat)" class="favorite-button">
                    {{ chat.bookmark ? '★' : '☆' }}
                </button>
            </li>
        </ul>

        <!-- 모달리스 - 채팅방 추가 -->
        <div>
            <div v-if="showFriendList" class="friend-list-container">
            <div class="friend-list-header">
                <h5 class="friend-list-header-text">대화상대 선택</h5>
                <button @click="closeFriendList" class="close-button">
                <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
            
            <ul class="friend-list-body">
                <li v-for="friend in friends" :key="friend.id" class="friend-list-item">
                    <img :src="friend.imageUrl" class="profile-image" />
                    <span class="friend-name">{{ friend.nickname }}</span>
                <button @click="addPrivateChat(friend)" class="friend-list-select">
                    추가
                </button>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
const accessToken = userStore.accessToken;
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const emit = defineEmits(["select-chat-room", "select-favorite", "chat-room-updated"]);

const showFriendList = ref(false);
const stompClient = ref(null);
const chat = ref([]);
const friends = ref([]);

let subscribedChatRooms = [];

import { useNotificationStore } from '@/store/notification';
const notificationStore = useNotificationStore();

// import { useWebsocketStore } from '@/store/websocket';
// const websocketStore = useWebsocketStore();

// 채팅방 리스트 호출
const chatListApi = async () => {
    try {
        const response = await axios.get("/chat/list",
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        chat.value = response.data;
        console.log(chat.value)
        if (subscribedChatRooms.length === 0) {
            connectChatRoom(chat.value);
        }
    } catch (err) {
        console.error("채팅방 목록을 가져오는데 실패했습니다.", err);
    }
};

onMounted(async () => {
    // await websocketStore.connectWebSocket(accessToken);
    await chatListApi(); 
});

// 채팅방 북마크 설정
const chatBookmarkApi = async (chat) => {
    try {
        const chatRoomId = chat.chatRoomId;
        const response = await axios.put(
            `/chat/bookmark?chatRoomId=${chatRoomId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        if (response.status == 204) {
            emit("select-favorite", chat);
            chatListApi();
        }
    } catch (err) {
        console.error("즐겨찾기를 지정하는데 실패했습니다.", err);
    }
};

// Computed: 즐겨찾기 기준으로 정렬
const sortedChatRooms = computed(() => {
    return [...chat.value].sort((a, b) => b.bookmark - a.bookmark);
});

// 리스트에서 채팅방 구독
// const connectChatRoom = (chatRoom) => {
//     const socket = new SockJS('http://localhost:8080/ws');
//     stompClient.value = Stomp.over(socket);
//     stompClient.value.connect({ Authorization: `${accessToken}` }, (frame) => {
//         console.log('Connected: ' + frame);

//         // 채팅방 목록의 모든 chatRoomId에 대해 구독 설정
//         chatRoom.forEach((room) => {
//             stompClient.value.subscribe(`/sub/chat/${room.chatRoomId}`, (message) => {
//                 const receivedMessage = JSON.parse(message.body);

//                 notificationStore.showNotification(receivedMessage.memberId,`새 메시지: ${receivedMessage.message}`, 3000);

//                 // 각 채팅방의 최신 메시지를 업데이트
//                 // updateChatRoomLatestMessage(room.chatRoomId, receivedMessage);
//             });
//         });
//     });
// };

// 채팅방 연결 및 구독
const connectChatRoom = (chatRooms) => {
    if (!stompClient.value || !stompClient.value.connected) {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.value = Stomp.over(socket);

        stompClient.value.connect({ Authorization: `${accessToken}` }, () => {
            subscribeChatRoom(chatRooms);
        }, (error) => {
            console.error('채팅방을 연결하는 데 실패했습니다.', error);
        });
    } else {
        subscribeChatRoom(chatRooms);
    }
};

const subscribeChatRoom = (chatRooms) => {
    chatRooms.forEach((room) => {
        if (!subscribedChatRooms.includes(room.chatRoomId)) {
            stompClient.value.subscribe(`/sub/chat/${room.chatRoomId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);

                notificationStore.showNotification(receivedMessage.memberId, `새 메시지: ${receivedMessage.message}`, 3000);
            });

            subscribedChatRooms.push(room.chatRoomId);
            console.log(subscribedChatRooms);
        } else {
            console.log(`이미 연결된 채팅방입니다. ${room.chatRoomId}`);
        }
    });
};


const goToChatRoom = (chat) => {
    emit("select-chat-room", chat);
};

const openFriendList = () => {
    showFriendList.value = !showFriendList.value;
    getFriendListApi();
};

// 친구 목록 조회
const getFriendListApi = async () => {
    try {
        const response = await axios.get("/friendship/list/accept",
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        friends.value = response.data;
    } catch (err) {
        console.error("친구 목록을 가져오는데 실패했습니다.", err);
    }
};

// 채팅 추가
const addPrivateChat = async (friend) => {
    try {
        const response = await axios.post(
            `/chat/create?friendId=${friend.id}`,
            {   name: friend.nickname, },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const newChatRoom = response.data;
        chatListApi();
        showFriendList.value = false;
        stompClient.value.subscribe(`/sub/chat/${newChatRoom.chatRoomId}`)
    } catch (err) {
        console.error("채팅방 추가에 실패했습니다.", err);
    }
}

const closeFriendList = () => {
    showFriendList.value = false;
};

</script>

<style scoped>
.chat-list-container {
    position: relative;
    padding: 0px;
    background-color: #f5f5f5;
}

/* 채팅 목록 헤더 */
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.chat-header-text {
    margin-bottom: 0px;
}

.add-chat-button {
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: none;
    color: #444;
}

.add-chat-button:hover {
    color: #5b5b5b;
}

/* 채팅 목록 스타일 */
.chat-list {
    list-style: none;
    padding: 0;
}

.chat-list-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
}

.chat-list-item:hover {
    background-color: #ffffff;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 40%;
    margin-right: 12px;
}
.friend-name {
    flex-grow: 1;
}

.chat-info {
    flex-grow: 1;
}

.chat-name {
    margin: 0;
    font-size: 15px;
    font-weight: 400;
}

.chat-last-message {
    margin: 0;
    font-size: 13px;
    color: #888;
}

.favorite-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #7ea7ea;
    margin-left: 10px;
}

.favorite-button:hover {
    color: #609be8;
}

/* 채팅방 추가 */
.friend-list-container {
    position: absolute;
    top: 50px;
    left: 20px;
    width: 300px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 999;
}

.friend-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    background-color: #f5f5f5;
}

.friend-list-header-text {
    font-size: 16px;
    margin: 0px 10px;
}

.friend-list-body {
    padding: 0px;
    list-style-type: none;
    margin: 0;
    overflow-y: auto;
}

.friend-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 13px 15px 20px;
    border-bottom: 1px solid #ddd;
}

.close-button {
    color: #666;
    font-size: 11pt;
    cursor: pointer;
    background: none;
    border: none;
}

.close-button:hover {
    color: #5b5b5b;
}

.friend-list-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.friend-list-select {
    border: none;
    font-size: 13px;
    color: #444;
    border-radius: 10px;
    padding: 0px 10px;
    cursor: pointer;
    height: 30px;
}

.friend-list-select:hover {
    background-color: #ececec;
}
</style>