<template>
  <div>
    <!-- Main Content -->
    <div class="main-content">
      <h1 class="main-title">팀 초대 수락</h1>
      <div class="invite-message">
        <p>팀 초대를 수락하시겠습니까?</p>
        <button class="accept-button" @click="joinTeam">초대 수락하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const activeSection = ref("profile");

// 팀 수락 함수
const joinTeam = async () => {
  try {
    const teamId = route.params.id;
    console.log("teamId : ", teamId);
    const response = await axios.post(`/team/invite`, null, {
      params: { teamId: teamId }, // 요청 파라미터로 teamId를 전달
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // 인증 토큰 추가
      },
    });
    console.log("팀 수락 성공:", response.data);
    alert("팀에 성공적으로 참여하였습니다.");
  } catch (error) {
    console.error("팀 수락에 실패했습니다:", error);
    alert("팀 수락에 실패하였습니다.");
  }
};
</script>

<style scoped>
.team-page-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 20%;
  padding: 1.5rem;
  border-right: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.sidebar-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.menu {
  list-style-type: none;
  padding: 0;
}

.menu li {
  padding: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
  font-weight: bold;
  color: #555;
}

.menu li i {
  margin-right: 1rem;
  color: #007bff; /* 아이콘 색상 */
}

.menu li.active,
.menu li:hover {
  background-color: #007bff; /* 활성화 및 호버 시 배경 색상 */
  color: white; /* 텍스트 색상 */
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.invite-message {
  text-align: center;
}

.accept-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.accept-button:hover {
  background-color: #0056b3; /* 버튼 호버 시 색상 */
}
</style>
