<template>
    <div class="chat-room-detail-container">
        <!-- 채팅방 이름 및 수정 버튼 -->
        <div class="chat-title-header">
            <div class="chat-room-title">
                <!-- 수정 모드가 아닐 때 -->
                <h6 v-if="!isEditingTitle">
                    {{ chatRoomName }}
                    <!-- 수정 모드로 전환하는 연필 아이콘 버튼 -->
                    <button @click="editTitle" class="edit-button">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                </h6>

                <!-- 수정 모드일 때 이름 입력과 확인 버튼 표시 -->
                <div v-else class="edit-title-container">
                    <input v-model="newChatRoomName" class="edit-title-input" />
                    <!-- 수정된 이름 저장 버튼 -->
                    <button @click="saveTitle" class="save-button">확인</button>
                </div>
            </div>
        </div>

        <!-- 참여자 목록 -->
        <!-- <h4 class="members-title">참여자 목록</h4> -->
        <ul class="member-list">
            <li v-for="member in members" :key="member.memberId" class="member-item">
                <img :src="member.imageUrl" class="profile-image" />
                <span class="member-name">{{ member.nickname }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
// const accessToken = userStore.accessToken;

// Props 정의
const props = defineProps({
    chat: {
        type: Object,
        required: true,
    },
});

// 상태 변수 정의
const isEditingTitle = ref(false);
const chatRoomName = ref(props.chat.nickname); // 초기 채팅방 이름
const newChatRoomName = ref(props.chat.nickname); // 수정 중인 채팅방 이름
const chatRoomId = props.chat.chatRoomId;

const members = ref([]); // 참여자 목록
const emit = defineEmits(['chat-room-updated'])

// 채팅방 참여자 목록 API 호출
const findChatParticipantApi = async () => {
    try {
        const response = await axios.get(
            `/chat/participant?chatRoomId=${chatRoomId}`, {
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `${accessToken}`,
            },
        });
        members.value = response.data;
    } catch (err) {
        console.error("참여자 목록을 가져오는데 실패했습니다.", err);
    }
};

onMounted(() => {
    findChatParticipantApi(); // 컴포넌트가 마운트되면 참여자 목록 불러오기
});

// 채팅방 이름 수정 모드로 전환
const editTitle = () => {
    isEditingTitle.value = true;
    newChatRoomName.value = chatRoomName.value;
};

// 채팅방 이름 저장
const saveTitle = async () => {
    if (newChatRoomName.value.trim() === "") {
        alert("채팅방 이름을 입력하세요.");
        return;
    }

    try {
        const response = await axios.put(
            "/chat/rename",
            {   chatRoomId: chatRoomId,
                nickname: newChatRoomName.value },
            {
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `${accessToken}`,
                },
            }
        );
        chatRoomName.value = newChatRoomName.value; // 이름 업데이트
        isEditingTitle.value = false; // 수정 모드 종료

        emit("chat-room-updated", { chatRoomId: chatRoomId, newNickname: newChatRoomName.value });
    } catch (err) {
        console.error("채팅방 이름 수정에 실패했습니다.", err);
    }
};

</script>

<style scoped>
.chat-room-detail-container {
    width: 350px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
}

.chat-title-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding: 20px; */
}

.chat-room-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 10px 20px;
}

.edit-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #444;
    font-size: 11pt;
}

/* 수정 모드에서 이름 입력 및 확인 버튼 컨테이너 */
.edit-title-container {
    display: flex;
    align-items: center;
    height: 30px;
    gap: 10px;
}

.edit-title-input {
    width: 150px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* 수정 확인 버튼 스타일 */
.save-button {
    border: none;
    font-size: 13px;
    color: #444;
    border-radius: 10px;
    padding: 0px 10px;
    cursor: pointer;
    height: 30px;
}

.save-button:hover {
    background-color: #ececec;
}

.member-list {
    list-style: none;
    padding: 0;
}

.member-item {
    display: flex;
    align-items: center;
    padding: 10px 20px 10px 20px;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 40%;
    margin-right: 12px;
}

.member-name {
    font-size: 14px;
}

.leave-container {
    align-items: end;
}

.leave-button {
    border: none;
    font-size: 13px;
    color: #444;
    border-radius: 10px;
    padding: 0px 10px;
    cursor: pointer;
    height: 30px;
    margin: 10px;
}

.leave-button:hover {
    background-color: #ececec;
}
</style>