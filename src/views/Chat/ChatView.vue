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
                @go-to-file-box="openFileBox"
                @toggle-details="toggleChatRoomDetails" />
        </div>

        <!-- 채팅방 상세 페이지 (ChatRoomDetails) -->
        <div v-if="showChatRoomDetails" class="chat-room-details-view">
            <ChatRoomDetails :chat="selectedChatRoom" @close-details="toggleChatRoomDetails" 
            @chat-room-updated="updateChatName"/>
        </div>

        <!-- 파일함 (ChatFile) -->
        <div v-if="selectedFileList" class="file-box-view">
            <ChatFile :fileList="selectedFileList" @close-file-box="closeFileBox" />
        </div>
    </div>
</template>

<script setup>
import { ref, } from 'vue';

import ChatRoom from './ChatComponents/ChatRoom.vue';
import ChatFile from './ChatComponents/ChatFile.vue';
import ChatList from './ChatComponents/ChatList.vue';
import ChatRoomDetails from './ChatComponents/ChatRoomDetails.vue';

// 선택된 채팅방 및 파일 리스트 상태 변수
const selectedChatRoom = ref(null);
const selectedFileList = ref(null);
const showChatRoomDetails = ref(false);

// 메서드 선언
const selectChatRoom = (chat) => {
    selectedChatRoom.value = chat;
    console.log("선택된 채팅방:", selectedChatRoom.value);
    selectedFileList.value = null; // 파일함 초기화
    showChatRoomDetails.value = false;
};

// const handleSendMessage = (newMessage) => {
//     if (selectedChatRoom.value) {
//         selectedChatRoom.value.messages.push(newMessage);
// };

// 채팅방 이름 전역 업데이트
const updateChatName = ({ chatRoomId, newNickname }) => {
    if (selectedChatRoom.value && selectedChatRoom.value.chatRoomId === chatRoomId) {
        selectedChatRoom.value.nickname = newNickname;
    }
    console.log(`채팅방 이름이 '${newNickname}'으로 업데이트되었습니다.`);
};

const closeChatRoom = () => {
    // 채팅방을 닫을 때 파일함도 닫기
    selectedChatRoom.value = null;
    selectedFileList.value = null;
    showChatRoomDetails.value = false;
};

const openFileBox = () => {
    // 선택된 채팅방의 파일 리스트를 표시
    if (selectedChatRoom.value) {
        selectedFileList.value = selectedChatRoom.value.files;
    }
};

const closeFileBox = () => {
    // 파일함 닫기
    selectedFileList.value = null;
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

.file-box-view {
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
