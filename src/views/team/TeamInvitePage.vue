<template>
<!--  <div>-->
    <!-- Main Content -->
    <div class="main-content">
      <h1 class="main-title">팀 초대 수락</h1>
      <div class="invite-message">
        <p>팀 초대를 수락하시겠습니까?</p>
        <button class="accept-button" @click="joinTeam">초대 수락하기</button>
      </div>
    </div>
<!--  </div>-->
</template>

<script setup>
import {ref, onMounted, watch, computed, onBeforeMount, onBeforeUnmount} from "vue";
import { useRoute, useRouter} from "vue-router";
import axios from "axios";
import { useUserStore } from "@/store/user.js";
import { useStore } from "vuex";

const store = useStore();
const showNavbar = computed(() => store.state.showNavbar);
const showFooter = computed(() => store.state.showFooter);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const key = route.query.key;
const teamId = route.query.teamId;
const email = route.query.email;

console.log("Key:", key);
console.log("Team ID:", teamId);
console.log("Email:", email);

const joinTeam = async () => {
  try {
    const response = await axios.post("team/invite/accept",
        {
          key: key,
          teamId: teamId,
          email: email,
        },
        {
          validateStatus: false
        }
    );

    if(response.status === 200) {
      alert("초대가 수락되었습니다.");
      router.push(`team/${teamId}`);
    }else {
      alert("유효하지 않은 링크입니다.");
    }
  } catch (error) {
    console.log(error);
  }
}


onMounted(() => {

});
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
});

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
