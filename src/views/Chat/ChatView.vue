<template>
<div class="fixed-plugin">
    <a class="px-3 py-2 fixed-plugin-button text-dark position-fixed" @click="openChatView">
        <i class="py-2 fa fa-comments-o"></i>
    </a>
        <!-- <ChatNotification /> -->
    <div v-show="showChatView" class="chat-view" ref="chatViewContainer">
        <!-- 채팅 목록 (ChatList) -->
        <div class="chat-list-view">
            <ChatList :chat="chat" @select-chat-room="selectChatRoom" />
        </div>

        <div class="chat-components">
        <!-- 채팅방 (ChatRoom) -->
        <div v-if="selectedChatRoom" class="chat-room-view">
            <ChatRoom :chat="selectedChatRoom" @close-chat-room="closeChatRoom" @select-file-list="openFileList"
                @select-details="openChatRoomDetails" />
        </div>

        <!-- 채팅방 상세 페이지 (ChatRoomDetails) -->
        <div v-if="selectedChatRoomDetails" class="chat-room-details-view">
            <ChatRoomDetails :chat="selectedChatRoom" @close-details="closeChatRoomDetails"
                @chat-room-updated="updateChatName" />
        </div>

        <!-- 파일함 (ChatFile) -->
        <div v-if="selectedFileList" class="file-list-view">
            <ChatFile :chat="selectedChatRoom" @close-file-list="closeFileList" />
        </div>
    </div>
    </div>


</div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from "vuex";

import ChatRoom from './ChatComponents/ChatRoom.vue';
import ChatFile from './ChatComponents/ChatFile.vue';
import ChatList from './ChatComponents/ChatList.vue';
import ChatRoomDetails from './ChatComponents/ChatRoomDetails.vue';

const selectedChatRoom = ref(null);
const selectedFileList = ref(false);
const selectedChatRoomDetails = ref(false);
const showChatView = ref(false);

// const store = useStore();
// const showChatView = computed(() => store.state.showChatView);
// const showConfigurator = computed(() => store.state.showConfigurator);
// const toggleConfigurator = () => store.commit("toggleConfigurator");

const chatViewContainer = ref(null);

const chat = ref([]);
let preventClose = false;

// 외부 클릭 감지 로직
const handleClickOutside = (event) => {
    if (preventClose) {
        preventClose = false; // 초기 클릭 이벤트를 무시한 후 초기화
        return;
    }
    if (showChatView.value && chatViewContainer.value && !chatViewContainer.value.contains(event.target)) {
        closeChatView(); // 외부 클릭 시 창 닫기
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside); // 클릭 이벤트 제거
});

const openChatView = () => {
    preventClose = true; // 처음 클릭 이벤트를 무시
    showChatView.value = true;
    console.log(`showChatView: ${showChatView.value}`);

    setTimeout(() => {
        preventClose = false; // 약간의 지연 후 클릭 감지 활성화
    }, 100);
}

const closeChatView = () => {
    showChatView.value = false;
    console.log(`showChatView: ${showChatView.value}`);
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
