<template>
    <div id="chat-container">
        <h2>웹소켓 토큰 테스트</h2>

        <!-- 채팅방 ID 입력 필드 -->
        <input v-model="chatRoomId" type="text" placeholder="채팅방 ID를 입력하세요" class="input-field" />
        <input v-model="newMessage" type="text" placeholder="메시지를 입력하세요" class="input-field" />
        <button @click="sendMessage" class="button">메시지 전송</button>

        <!-- 파일 선택 및 전송 버튼 -->
        <input type="file" ref="fileInput" multiple class="input-field" />
        <button @click="sendFile" class="button">파일 전송</button>

        <!-- 채팅 메시지 목록 -->
        <div id="messages">
            <div v-for="(message, index) in messages" :key="index">
                <!-- 메시지 유형에 따른 분기 처리 -->
                <div v-if="message.text" class="chat-message">
                    {{ message.text }}
                </div>
                <div v-else class="chat-message">
                    <a :href="message.fileUrl" target="_blank">첨부 파일 보기</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useUserStore } from '@/store/user';

// const userStore = useUserStore();
// const accessToken = userStore.accessToken;

export default {
    name: "ChatRoom",
    data() {
        return {
            chatRoomId: "",
            newMessage: "",
            messages: [],
            stompClient: null,
        };
    },
    methods: {
        connectToChatRoom() {
            if (!this.chatRoomId) {
                alert("채팅방 ID를 입력하세요.");
                return;
            }

            const socket = new SockJS("http://localhost:8080/ws");
            this.stompClient = Stomp.over(socket);

            const userStore = useUserStore();
            const accessToken = userStore.accessToken;

            this.stompClient.connect({ Authorization: `${accessToken}` }, (frame) => {
                console.log("Connected: " + frame);

                // 채팅방 구독 설정
                this.stompClient.subscribe(`/sub/chat/${this.chatRoomId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    if (receivedMessage.fileUrl) {
                        this.displayFile(receivedMessage.fileUrl);
                    } else {
                        this.displayMessage(receivedMessage.message);
                    }
                });
            });
        },

        // 메시지 전송
        sendMessage() {
            if (!this.chatRoomId) {
                alert("채팅방 ID를 입력하세요.");
                return;
            }

            if (!this.newMessage) {
                alert("메시지를 입력하세요.");
                return;
            }

            const message = {
                memberId: 1,
                message: this.newMessage,
                fileUrl: null,
            };

            this.stompClient.send(`/pub/chat/${this.chatRoomId}`, {}, JSON.stringify(message));
            this.newMessage = "";
        },

        // 파일 전송
        sendFile() {
            const files = this.$refs.fileInput.files;

            if (!files.length) {
                alert("파일을 선택하세요.");
                return;
            }

            if (!this.chatRoomId) {
                alert("채팅방 ID를 입력하세요.");
                return;
            }

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            formData.append("chatRoomId", this.chatRoomId);
            formData.append("memberId", "1");

            // 파일 업로드 API 호출
            fetch("http://localhost:8080/v1/api/chat/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((storageResponse) => {
                        if (storageResponse.fileUrl) {
                            const message = {
                                memberId: 1,
                                message: null,
                                fileUrl: storageResponse.fileUrl,
                            };

                            // STOMP를 통해 파일 URL 전송
                            this.stompClient.send(`/pub/chat/${this.chatRoomId}`, {}, JSON.stringify(message));
                        }
                    });
                })
                .catch((error) => {
                    console.error("파일 업로드 에러:", error);
                });
        },

        // 메시지 표시
        displayMessage(message) {
            this.messages.push({ text: message, fileUrl: null });
        },

        // 파일 표시
        displayFile(fileUrl) {
            this.messages.push({ text: null, fileUrl });
        },
    },

    watch: {
        chatRoomId(newId) {
            // 채팅방 ID가 변경될 때 연결 재설정
            if (this.stompClient !== null) {
                this.stompClient.disconnect();
            }
            this.connectToChatRoom();
        },
    },
};
</script>

<style scoped>
#chat-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

#messages {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    height: 300px;
    overflow-y: auto;
    background-color: #f9f9f9;
}

.input-field {
    width: 100%;
    max-width: 575px;
    padding: 10px;
    margin-bottom: 10px;
}

.button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    margin-bottom: 10px;
}

.button:hover {
    background-color: #0056b3;
}

.chat-message {
    padding: 5px;
    margin-bottom: 5px;
    background-color: #e0e0e0;
    border-radius: 5px;
}
</style>