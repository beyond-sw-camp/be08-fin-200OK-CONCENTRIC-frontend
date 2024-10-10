<template>
    <div class="chat-list-container">
        <div class="chat-header">
            <h5 class="chat-header-text">채팅</h5>
            <!-- 채팅방 추가 버튼 -->
            <button class="add-chat-button" @click="toggleModal">
                +</button>
        </div>

        <!-- 채팅 목록 -->
        <ul class="chat-list">
            <li v-for="(chat, index) in sortedChatRooms" :key="index" @click="goToChatRoom(chat)"
                class="chat-list-item">
                <img :src="chat.profileImage" class="profile-image" alt="Profile" />
                <div class="chat-info">
                    <h4 class="chat-name">{{ chat.name }}</h4>
                    <p class="chat-last-message">{{ chat.lastMessage }}</p>
                </div>
                <!-- 즐겨찾기 버튼 -->
                <button @click.stop="toggleFavorite(chat)" class="favorite-button">
                    {{ chat.isFavorite ? '★' : '☆' }}
                </button>
            </li>
        </ul>

        <!-- 모달리스 채팅방 추가 창 -->
        <div v-if="showModal" class="modal-container">
            <div class="modal-header">
                <h5>채팅방 추가</h5>
                <button @click="closeModal" class="close-button">✖</button>
            </div>
            <div class="modal-body">
                <p>이곳에 친구 목록 또는 새로운 채팅방 생성 기능을 추가할 수 있습니다.</p>
                <input type="text" placeholder="채팅방 이름을 입력하세요..." class="modal-input" />
                <button class="modal-add-button">추가</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChatList",
    props: {
        chatRooms: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            showModal: false, // 모달 창 표시 여부
        };
    },
    computed: {
        sortedChatRooms() {
            return [...this.chatRooms].sort((a, b) => b.isFavorite - a.isFavorite);
        },
    },
    methods: {
        goToChatRoom(chat) {
            this.$emit("select-chat-room", chat);
        },
        toggleFavorite(chat) {
            chat.isFavorite = !chat.isFavorite;
            this.$emit("select-favorite", chat);
        },
        toggleModal() {
            this.showModal = !this.showModal; // 모달 창 표시 토글
        },
        closeModal() {
            this.showModal = false; // 모달 창 닫기
        },
    },
};
</script>

<style scoped>
.chat-list-container {
    position: relative;
    /* 모달리스 창을 오버레이하기 위한 상대 위치 */
    padding: 0px;
    background-color: #f5f5f5;
}

/* 채팅 목록 헤더 스타일 */
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin-bottom: 10px; */
    padding: 20px;
}

.chat-header-text {
    margin-bottom: 0px;
}

.add-chat-button {
    border: none;
    /* padding: 0px 8px 10px 0px; */
    border-radius: 5px;
    cursor: pointer;
    background: none;
    color: #444
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

.chat-info {
    flex-grow: 1;
}

.chat-name {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
}

.chat-last-message {
    margin: 0;
    font-size: 13px;
    color: #888;
}

/* 즐겨찾기 버튼 스타일 */
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

/* 모달리스 스타일 */
.modal-container {
    position: absolute;
    /* 부모 컴포넌트 내부에 오버레이로 표시 */
    top: 50px;
    /* 부모 요소 기준으로 상단 위치 */
    left: 20px;
    width: 300px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 999;
    /* 다른 요소들보다 위에 표시 */
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.modal-body {
    padding: 10px 20px;
}

.close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #888;
}

.close-button:hover {
    color: #e74c3c;
}

.modal-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.modal-add-button {
    width: 100%;
    padding: 8px;
    background: #009688;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal-add-button:hover {
    background-color: #00796b;
}
</style>