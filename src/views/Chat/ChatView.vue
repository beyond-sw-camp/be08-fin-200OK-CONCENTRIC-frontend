<template>
    <div class="chat-view">
        <!-- 채팅 목록 (ChatList) -->
        <div class="chat-list-view">
            <ChatList :chat="chat" @select-chat-room="selectChatRoom" />
        </div>

        <!-- 채팅방 (ChatRoom) -->
        <div v-if="selectedChatRoom" class="chat-room-view">
            <ChatRoom :chat="selectedChatRoom" 
                @close-chat-room="closeChatRoom"
                @select-file-list="openFileList"
                @toggle-details="toggleChatRoomDetails" />
        </div>

        <!-- 채팅방 상세 페이지 (ChatRoomDetails) -->
        <div v-if="showChatRoomDetails" class="chat-room-details-view">
            <ChatRoomDetails :chat="selectedChatRoom" @close-details="toggleChatRoomDetails" 
            @chat-room-updated="updateChatName"/>
        </div>

        <!-- 파일함 (ChatFile) -->
        <div v-if="selectedFileList" class="file-list-view">
            <ChatFile :chat="selectedChatRoom" @close-file-list="closeFileList" />
        </div>
    </div>
</template>

<script setup>
import { ref, } from 'vue';

import ChatRoom from './ChatComponents/ChatRoom.vue';
import ChatFile from './ChatComponents/ChatFile.vue';
import ChatList from './ChatComponents/ChatList.vue';
import ChatRoomDetails from './ChatComponents/ChatRoomDetails.vue';

const selectedChatRoom = ref(null);
const selectedFileList = ref(false);
const showChatRoomDetails = ref(false);

const selectChatRoom = (chat) => {
    selectedChatRoom.value = chat;
    console.log("선택된 채팅방:", selectedChatRoom.value);
    selectedFileList.value = null; // 파일함 초기화
    showChatRoomDetails.value = false;
};

// 채팅방 이름 전역 업데이트
const updateChatName = ({ chatRoomId, newNickname }) => {
    if (selectedChatRoom.value && selectedChatRoom.value.chatRoomId === chatRoomId) {
        selectedChatRoom.value.nickname = newNickname;
    }
};

const closeChatRoom = () => {
    selectedChatRoom.value = null;
    selectedFileList.value = false;
    showChatRoomDetails.value = false;
};

const openFileList = () => {
    selectedFileList.value = true;
};

const closeFileList = () => {
    selectedFileList.value = false;
};

const toggleChatRoomDetails = () => {
    showChatRoomDetails.value = !showChatRoomDetails.value;
};

</script>

<style scoped>
.chat-view {
    display: flex;
}

.chat-list-view {
    width: 300px;
    border-right: 1px solid #ddd;
    margin-right: 10px;
}

.chat-room-view {
    width: 360px;
    min-height: 550px;
    flex-grow: 0;
    margin-right: 10px;
}

.file-list-view {
    flex-grow: 0;
    margin-right: 10px;
    width: 350px;
    max-height: 550px;
    border-radius: 10px;
}

.chat-room-details-view {
    flex-grow: 0;
    margin-right: 10px;
    width: 350px;
    max-height: 550px;
    border-radius: 10px;
}
</style>
