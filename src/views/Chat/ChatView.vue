<template>
    <div class="chat-view">
        <!-- 채팅 목록 (ChatList) -->
        <div class="chat-list-view">
            <ChatList :chatRooms="chatRooms" @select-chat-room="selectChatRoom" />
        </div>

        <!-- 채팅방 (ChatRoom) -->
        <div v-if="selectedChatRoom" class="chat-room-view">
            <ChatRoom :chatRoom="selectedChatRoom" @send-message="handleSendMessage" @close-chat-room="closeChatRoom"
                @go-to-file-box="openFileBox"
                />
        </div>

        <!-- 파일함 (ChatFile) -->
        <div v-if="selectedFileList" class="file-box-view">
            <ChatFile :fileList="selectedFileList" @close-file-box="closeFileBox" />
        </div>
    </div>
</template>

<script>
import ChatRoom from "./ChatComponents/ChatRoom.vue";
import ChatFile from "./ChatComponents/ChatFile.vue";
import ChatList from "./ChatComponents/ChatList.vue";

export default {
    name: "ChatView",
    components: { ChatList, ChatRoom, ChatFile },
    data() {
        return {
            chatRooms: [
                {
                    id: 1,
                    name: "김철수",
                    profileImage: "https://via.placeholder.com/50",
                    lastMessage: "안녕하세요!",
                    isFavorite: false,
                    messages: [
                        { text: "안녕하세요!", sentByMe: false },
                        { text: "반갑습니다.", sentByMe: true },
                    ],
                    files: [
                        { name: "document1.pdf", url: "https://example.com/document1.pdf" },
                        { name: "image1.png", url: "https://example.com/image1.png" },
                    ],
                },
                {
                    id: 2,
                    name: "박영희",
                    profileImage: "https://via.placeholder.com/50",
                    lastMessage: "오늘 일정은?",
                    isFavorite: false,
                    messages: [
                        { text: "오늘 일정은?", sentByMe: false },
                        { text: "회의가 있어요.", sentByMe: true },
                    ],
                    files: [
                        { name: "presentation.pptx", url: "https://example.com/presentation.pptx" },
                        { name: "report.docx", url: "https://example.com/report.docx" },
                    ],
                },
            ],
            selectedChatRoom: null, // 현재 선택된 채팅방
            selectedFileList: null, // 선택된 파일 목록
        };
    },
    methods: {
        selectChatRoom(chat) {
            this.selectedChatRoom = chat;
            this.selectedFileList = null; // 파일함 초기화
        },
        handleSendMessage(newMessage) {
            this.selectedChatRoom.messages.push(newMessage);
        },
        closeChatRoom() {
            // 채팅방을 닫을 때 파일함도 닫기
            this.selectedChatRoom = null;
            this.selectedFileList = null;
        },
        openFileBox() {
            // 선택된 채팅방의 파일 리스트를 표시
            this.selectedFileList = this.selectedChatRoom.files;
        },
        closeFileBox() {
            // 파일함 닫기
            this.selectedFileList = null;
        },
    },
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
</style>