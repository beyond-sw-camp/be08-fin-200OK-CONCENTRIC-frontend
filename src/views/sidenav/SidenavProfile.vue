<template>
  <router-link class="m-0 navbar-brand d-flex align-items-center" to="#">
    <img :src="selectedItem.image || defaultImage"
         class="w-25 ms-5"
         alt="profile_image"
    />

    <div class="dropdown-placeholder">
      <a
        v-if="teams.length > 0"
        href="#"
        class="p-0 dropdown-hover ms-4"
        :class="[showMenu ? 'show' : '']"
        id="dropdownMenuButton"
        aria-expanded="true"
        @click="toggleMenu"
      >
        {{ selectedItem.name || "팀 선택" }}
        <img :src="require('@/assets/img/icons/expand_more_40dp_000000.png')" class="navbar-brand-img w-25" alt="expand_more_icon" />
      </a>

      <!-- 팀이 없는 경우에도 공간을 차지하도록 투명 공간 추가 -->
      <div v-else class="p-0 dropdown-hover ms-4">
        <button type="button" class="btn btn-success ms-3" >
          +New Team
        </button>
      </div>

      <transition name="fade">
        <ul v-show="showMenu && teams.length > 0" class="dropdown-menu" :style="{ position: 'absolute', zIndex: 9999 }">
          <li v-for="team in teams" :key="team.id">
            <a href="#" class="dropdown-item" @click="selectItem(team)">
              {{ team.name }}
            </a>
          </li>
          <li class="dropdown-item">
            <button class="btn btn-link" @click="openCreateTeamModal">+ 팀 생성</button>
          </li>
        </ul>
      </transition>
    </div>
  </router-link>

  <!-- 팀 생성 모달 -->
  <div v-if="showCreateTeamModal" class="modal-overlay" @click="closeCreateTeamModal">
    <div class="modal-content" @click.stop>
      <h2>팀 생성</h2>
      <input type="text" v-model="newTeamName" placeholder="팀 이름" />
      <button @click="createTeam">팀 생성</button>
      <button @click="closeCreateTeamModal">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user'; // Pinia 스토어 import

const showMenu = ref(false);
const teams = ref([]);
const selectedItem = ref({ name: "팀 선택", image: null }); // 기본값을 "팀 선택"으로 설정
const defaultImage = require("@/assets/img/sample_images/371754@2x.png");

const showCreateTeamModal = ref(false);
const newTeamName = ref('');

const router = useRouter(); // Vue Router 사용

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// 로그인한 유저의 팀 목록을 가져오는 함수
const fetchUserTeams = async () => {
  const userStore = useUserStore();
  try {
    const response = await axios.get("/team/list", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userStore.token}`
      }
    });

    // 유저가 속한 팀 목록 설정
    teams.value = response.data.filter(team => 
      team.createdBy === userStore.userId || team.members.includes(userStore.userId)
    );
  } catch (err) {
    console.error("팀 리스트를 가져오는 데 실패했습니다.", err);
  }
};

// 선택한 팀 설정 및 팀 페이지로 라우팅
const selectItem = (item) => {
  if (!item || !item.id) {
    console.error("유효하지 않은 팀을 선택했습니다.");
    return; // 유효하지 않은 경우 처리
  }
  selectedItem.value = item;
  showMenu.value = false;

  // 선택한 팀의 페이지로 라우팅 (예: `/team/:id`로 이동)
  router.push(`/team/${item.id}`);
};

// 팀 생성 모달 열기
const openCreateTeamModal = () => {
  showCreateTeamModal.value = true;
};

// 팀 생성 모달 닫기
const closeCreateTeamModal = () => {
  showCreateTeamModal.value = false;
  newTeamName.value = ''; // 입력값 초기화
};

// 팀 생성 API 호출
const createTeam = async () => {
  const userStore = useUserStore();
  try {
    const response = await axios.post("/team/create", {
      name: newTeamName.value,
      createdBy: userStore.userId
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userStore.token}`
      }
    });
    // 팀 생성 후 리스트 새로고침
    await fetchUserTeams();
    closeCreateTeamModal(); // 모달 닫기
  } catch (error) {
    console.error("팀 생성에 실패했습니다.", error);
  }
};

// 컴포넌트가 마운트될 때 팀 목록 가져오기
onMounted(() => {
  fetchUserTeams();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 투명 공간을 차지하는 클래스 */
.invisible {
  visibility: hidden;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
