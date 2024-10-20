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
                <span v-if="chat.unreadCount > 0" class="notification-badge">{{ chat.unreadCount }}</span>
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
                        <img :src="getFriendsProfileImage(friend.profileImage)" class="profile-image" />
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

const emit = defineEmits(["select-chat-room", "chat-room-updated", "add-chat-room"]);

const showFriendList = ref(false);
const chat = ref([]);
const friends = ref([]);

const props = defineProps({
    chatRooms: Array,
    messages: Object
})


const chatListApi = async () => {
    if (props.chatRooms && Array.isArray(props.chatRooms)) {
        const res = props.chatRooms.map(chatroom => ({
            ...chatroom,
            profileImage: null,
            unreadCount: 0,
        }));
        chat.value = res;

        await Promise.all(
            chat.value.map(async (chatRoom, index) => {
                if (chatRoom.profileImageUrl) {
                    try {
                        const profileImage = await getProfileImage(chatRoom.profileImageUrl);
                        chat.value[index].profileImage = profileImage;
                    } catch (error) {
                        console.error("이미지를 불러오는 데 실패했습니다.", error);
                    }
                }
            })
        );
        return chat.value;
    } else {
        console.error("props.chat은 정의되지 않았거나 배열이 아닙니다.");
    }
};

const getProfileImage = async (imageUrl) => {
    const response = await axios.post(`storage/image/profile`,
        null,
        {
            params: {
                path: imageUrl,
            },
            responseType: 'blob',
        });
    const imageSrc = URL.createObjectURL(response.data);
    return imageSrc;
}

onMounted(async () => {
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
            chat.bookmark = !chat.bookmark;
        }
    } catch (err) {
        console.error("즐겨찾기를 지정하는데 실패했습니다.", err);
    }
};

// Computed: 즐겨찾기 기준으로 정렬
const sortedChatRooms = computed(() => {
    return [...chat.value].sort((a, b) => b.bookmark - a.bookmark);
});

const goToChatRoom = (chatRoom) => {
    // 선택한 채팅방의 unreadCount 초기화
    // const chatRoomIndex = chat.value.findIndex(c => c.chatRoomId === chatRoom.chatRoomId);
    // if (chatRoomIndex !== -1) {
    //     chat.value[chatRoomIndex].unreadCount = 0;  // 알림 카운트 초기화
    // }
    emit("select-chat-room", chatRoom);
};

const openFriendList = () => {
    getFriendListApi();
    showFriendList.value = !showFriendList.value;
};

// 친구 목록 조회
const getFriendListApi = async () => {
    try {
        const response = await axios.get("/friendship/list");
        friends.value = response.data;
    } catch (err) {
        console.error("친구 목록을 가져오는데 실패했습니다.", err);
    }
};

const getFriendsProfileImage = (imageString) => {
    const byteCharacters = atob(imageString);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image' });
    return URL.createObjectURL(blob);
};

// 채팅 추가
const addPrivateChat = async (friend) => {
    try {
        const response = await axios.post(
            `/chat/create?friendId=${friend.id}`,
            { name: friend.nickname, },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response);
        const newChatRoom = response.data;
        console.log(newChatRoom);
        emit("add-chat-room", newChatRoom);
        showFriendList.value = false;
    } catch (err) {
        console.error("채팅방 추가에 실패했습니다.", err);
    }
};

watch(
    () => props.chatRooms,   
    (newChatRooms, oldChatRooms) => {
        if (newChatRooms.length !== oldChatRooms.length) {
            chatListApi(); 
        }
    },
    { deep: true } 
);

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
    background-color: #fff;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
}

.chat-list-item:hover {
    background-color: #f5f5f5;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 40%;
    margin-right: 12px;
}

.notification-badge {
    position: relative;
    top: 0;
    right: 0;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 5px;
    font-size: 12px;
    min-width: 20px;
    min-height: 20px;
    text-align: center;
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