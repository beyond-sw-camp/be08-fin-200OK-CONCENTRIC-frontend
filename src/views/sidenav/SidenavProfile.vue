<template>
  <div class="row col-auto">
    <div class="col image-container">
      <a :href="selectedItem.link || '/'" class="image-link align-content-center">
        <img
          :src="selectedItem.image || defaultImage"
          class="w-25 ms-5"
          alt="profile_image"
        />
      </a>
    </div>
    <div class="col">
      <router-link class="m-0 navbar-brand d-flex align-items-center" to="#">
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
            <img :src="require('@/assets/img/icons/expand_more_40dp_000000.png')"
                 class="navbar-brand-img w-25"
                 alt="expand_more_icon"/>
          </a>

          <div v-else class="p-0 dropdown-hover ms-4">
            <button type="button" class="btn btn-success ms-3" @click="openCreateTeamModal">
              + 팀 생성
            </button>
          </div>

          <transition name="fade">
            <ul v-show="showMenu && teams.length > 0" class="dropdown-menu" :style="{ position: 'absolute', zIndex: 9999 }">
              <li v-for="team in teams" :key="team.id" class="d-flex justify-content-between align-items-center">
                <a href="#" class="dropdown-item" @click="selectItem(team)">
                  {{ team.name }}
                </a>
                <button v-if="userStore.userInfo && userStore.userInfo.id === team.creatorId" class="delete-icon" @click.stop="deleteTeam(team.id)">X</button>

              </li>
              <li class="dropdown-item">
                <button class="btn btn-link" @click="openCreateTeamModal">+ 팀 생성</button>
              </li>
            </ul>
          </transition>
        </div>
      </router-link>
    </div>
  </div>
  <div v-if="showCreateTeamModal" class="modal-overlay" @click="closeCreateTeamModal">
    <div class="modal-content" @click.stop>
      <h2>팀 생성</h2>
      <input type="text" v-model="newTeamName" placeholder="팀 이름" class="form-control" />
      <div class="modal-actions">
        <button class="btn btn-primary" @click="createTeam">팀 생성</button>
        <button class="btn btn-secondary" @click="closeCreateTeamModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const showMenu = ref(false);
const teams = ref([]);
const selectedItem = ref({ name: "팀 선택", image: null });
const defaultImage = require("@/assets/img/sample_images/371754@2x.png");

const showCreateTeamModal = ref(false);
const newTeamName = ref('');

const router = useRouter();

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const fetchUserTeams = async () => {
  const userStore = useUserStore();
  try {
    const response = await axios.get("/team/list", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userStore.token}`
      }
    });
    
    teams.value = response.data.filter(team => 
      team.createdBy === userStore.userId || team.members.includes(userStore.userId)
    );

    // 로컬 스토리지에서 선택된 팀 정보를 가져와서 설정
    const storedTeamId = localStorage.getItem('selectedTeamId');
    if (storedTeamId) {
      const team = teams.value.find(t => t.id === storedTeamId);
      if (team) {
        selectedItem.value = team;
      }
    }
  } catch (err) {
    console.error("팀 리스트를 가져오는 데 실패했습니다.", err);
  }
};

const selectItem = (item) => {
  if (!item || !item.id) {
    console.error("유효하지 않은 팀을 선택했습니다.");
    return;
  }
  selectedItem.value = item;
  showMenu.value = false;
  router.push(`/team/${item.id}`);

  // 선택된 팀 정보를 로컬 스토리지에 저장
  localStorage.setItem('selectedTeamId', item.id);
};

const openCreateTeamModal = () => {
  showCreateTeamModal.value = true; // 모달 열기
};

const closeCreateTeamModal = () => {
  showCreateTeamModal.value = false; // 모달 닫기
  newTeamName.value = ''; // 입력값 초기화
};

const createTeam = async () => {
  const userStore = useUserStore();
  try {
    await axios.post("/team/register", {
      name: newTeamName.value,
      createdBy: userStore.userId
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userStore.token}`
      }
    });
    await fetchUserTeams();
    closeCreateTeamModal();
  } catch (error) {
    console.error("팀 생성에 실패했습니다.", error);
  }
};

const deleteTeam = async (teamId) => {
  const userStore = useUserStore();
  
  if (!confirm("정말로 이 팀을 삭제하시겠습니까?")) return;
  try {
    await axios.delete(`/team/delete/${teamId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userStore.token}`
      }
    });
    await fetchUserTeams();
    router.push('/tables'); // 팀 삭제 후 팀 리스트 갱신
  
  } catch (error) {
    console.error("팀 삭제에 실패했습니다.", error);
  }
};

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
  z-index: 10000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}
.modal-content .form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
.modal-actions .btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}
.modal-actions .btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}
.modal-actions .btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.image-container {
  display: inline-block;
}

.image-link {
  display: inline-block;
}
.delete-icon {
  background: none; /* 버튼 배경 제거 */
  border: none; /* 테두리 제거 */
  color: black; /* x 색상 */
  font-size: 14px; /* x 크기 줄이기 */
  cursor: pointer; /* 마우스 포인터 */
  padding: 0; /* 여백 제거 */
  line-height: 1; /* x 정렬 */
}

.delete-icon:hover {
  color: red; /* 마우스 오버 시 색상 */
}
</style>
