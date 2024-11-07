<template>
    <div v-if="showChatRoomDetails">
        <div :class="['chat-room-detail-container', isVisible ? 'show' : '']">
            <!-- 채팅방 헤더 -->
            <div class="chat-title-header">
                <div class="chat-room-title">
                    <h6 v-if="!isEditingTitle">
                        {{ chatRoomName }}
                        <button @click.stop="editTitle" class="edit-button">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                    </h6>

                    <div v-else class="edit-title-container">
                        <input v-model="newChatRoomName" class="edit-title-input" />
                        <button @click.stop="saveTitle" class="save-button">확인</button>
                    </div>
                </div>
                <button @click="closeChatRoomDetails" class="close-button">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
            <!-- 참여자 -->
            <ul class="member-list">
                <li v-for="member in members" :key="member.memberId" class="member-item">
                    <img :src="member.profileImage ? member.profileImage : require('@/assets/img/default/profile.png')" class="profile-image" />
                    <span class="member-name">{{ member.nickname }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const props = defineProps({
    chat: {
        type: Object,
        required: true,
    },
    showChatRoomDetails: {
        type: Boolean,
        required: true
    }
});

const isEditingTitle = ref(false);
const chatRoomName = ref(props.chat.nickname); // 초기 채팅방 이름
const newChatRoomName = ref(props.chat.nickname); // 수정 채팅방 이름
const chatRoomId = props.chat.chatRoomId;

const members = ref([]); // 참여자 목록
const emit = defineEmits(['chat-room-updated', 'close-details'])

// 채팅방 참여자 목록
const findChatParticipantApi = async () => {
    try {
        const response = await axios.get(
            `/chat/participant?chatRoomId=${chatRoomId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const res = response.data.map(member => ({
            ...member,
            profileImage: null,
        }));
        members.value = res;
        console.log(members.value);

        await Promise.all(
            members.value.map(async (member, index) => {
                if (member.imageUrl) {
                    try {
                        const profileImage = await getProfileImage(member.imageUrl);
                        members.value[index].profileImage = profileImage;
                    } catch (error) {
                        console.error("이미지를 불러오는 데 실패했습니다.", error);
                    }
                }
            })
        );
        return members.value;
    } catch (err) {
        console.error("참여자 목록을 가져오는데 실패했습니다.", err);
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
    // console.log(profileImage.value);
}

const isVisible = ref(false);
onMounted(() => {
    findChatParticipantApi();
    setTimeout(() => {
        isVisible.value = true;
    }, 50);
});

// 채팅방 이름 수정 모드로 전환
const editTitle = () => {
    emit('set-prevent-close');
    isEditingTitle.value = true;
    newChatRoomName.value = chatRoomName.value;
};

// 채팅방 이름 변경
const saveTitle = async () => {
    emit('set-prevent-close');
    if (newChatRoomName.value.trim() === "") {
        alert("채팅방 이름을 입력하세요.");
        return;
    }

    try {
        const response = await axios.put(
            "/chat/rename",
            {
                chatRoomId: chatRoomId,
                nickname: newChatRoomName.value
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        chatRoomName.value = newChatRoomName.value;
        isEditingTitle.value = false;

        emit("chat-room-updated", { chatRoomId: chatRoomId, newNickname: newChatRoomName.value });
    } catch (err) {
        console.error("채팅방 이름 수정에 실패했습니다.", err);
    }
};

const closeChatRoomDetails = () => {
    isVisible.value = false
    setTimeout(() => {
        emit('close-details');
    }, 300);
};


</script>

<style scoped>
.chat-room-detail-container {
    width: 350px;
    max-height: 300px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
    opacity: 0;
    transform: translateX(50px) scale(0.9);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.chat-room-detail-container.show {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
}

.chat-title-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    font-size: 11pt;
    margin-right: 10px;
}

.close-button:hover {
    color: #5b5b5b;
}
</style>