<template>
    <div class="chat-room-container">
        <!-- 채팅방 헤더 -->
        <div class="chat-room-header">
            <img :src="chatRoom.profileImage" alt="Profile" class="profile-image" />
            <div class="profile-info">
                <h3 class="profile-name">{{ chatRoom.name }}</h3>
            </div>
            <!-- 닫기 및 파일함 버튼 -->
            <button @click="goToFileBox" class="header-button file-button">
                <i class="fa fa-folder-open" aria-hidden="true"></i>
            </button>
            <button @click="closeChatRoom" class="header-button close-button">
                <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
        </div>

        <!-- 채팅 메시지 목록 -->
        <div class="chat-room-body">
            <div v-for="(message, index) in chatRoom.messages" :key="index"
                :class="['chat-message', message.sentByMe ? 'my-message' : 'partner-message']">
                <div class="message-bubble">
                    <p class="chat-message-text">{{ message.text }}</p>
                </div>
            </div>
        </div>

        <!-- 채팅 입력 창 -->
        <div class="chat-room-footer">
            <input v-model="newMessage" type="text" placeholder="메시지를 입력하세요..." class="message-input"
                @keyup.enter="sendMessage" />
            <button @click="attachFile" class="attach-button">
                +
            </button>
            <button @click="sendMessage" class="send-button">전송</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChatRoom",
    props: {
        chatRoom: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            newMessage: "", // 새 메시지 입력 값
        };
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim() !== "") {
                this.$emit("send-message", { text: this.newMessage, sentByMe: true });
                this.newMessage = ""; // 입력 필드 초기화
            }
        },
        attachFile() {
            alert("첨부파일 기능은 아직 구현되지 않았습니다.");
        },
        closeChatRoom() {
            this.$emit("close-chat-room");
        },
        goToFileBox() {
            this.$emit("go-to-file-box");
        },
    },
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
    display: flex;
    margin-bottom: 0px;
    font-size: 14px;
}

.partner-message {
    justify-content: flex-start;
}

.my-message {
    justify-content: flex-end;
}

.message-bubble {
    max-width: 70%;
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
    background-color:#ffffff00;
    border-radius: 5px;
    font-size: 13px;
}

.send-button {
    border: none;
    font-size: 13px;
    color:#444;
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
    color:#888;
    cursor: pointer;
    margin-left: 10px;
    margin-top: 8%;
    font-weight: 100;
}

.attach-button:hover{
    color: #5b5b5b;
}
.send-button:hover {
    background-color: #ececec;
}
</style>