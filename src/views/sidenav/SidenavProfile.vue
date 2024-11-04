<template>
  <div class="row col-auto me-4">
    <div class="col">
      <router-link class="m-0 navbar-brand" to="#">
        <div class="dropdown-placeholder">
          <a
            v-if="teams.length > 0"
            href="#"
            class="p-0 dropdown-hover ms-0"
            :class="[showMenu ? 'show' : '']"
            id="dropdownMenuButton"
            aria-expanded="true"
            @click="toggleMenu"
            style="display: flex; align-items: center; margin-left: auto; flex-direction: row-reverse; width: 8rem"
          >
            {{ selectedItem.name || "팀 선택" }}
            <img :src="require('@/assets/img/icons/expand_more_40dp_000000.png')"
                 class="navbar-brand-img w-20"
                 alt="expand_more_icon" />
          </a>

          <div v-else class="p-0 dropdown-hover ms-4 d-flex align-items-center">
            <button type="button" class="" @click="openCreateTeamModal" style="width: 100%; text-align: left; padding: 8px;">
              + 팀 생성
            </button>
          </div>

          <transition name="fade">
            <ul v-show="showMenu && teams.length > 0" class="dropdown-menu" :style="{ position: 'absolute', zIndex: 9999 }">
              <li v-for="team in teams" :key="team.id" class="d-flex justify-content-between align-items-center">
                <a href="#" class="dropdown-item" @click="selectItem(team)">
                  {{ team.name }}
                  <button v-if="userStore.userInfo && userStore.userInfo.id === team.creatorId" class="delete-icon" @click.stop="deleteTeam(team.id)">X</button>
                </a>
              </li>
              <li class="dropdown-item">
                <button class="btn btn-link create-team-btn" @click="openCreateTeamModal">+ 팀 생성</button>
              </li>
            </ul>
          </transition>
        </div>
      </router-link>
    </div>
  </div>

  <div v-if="showCreateTeamModal" class="modal-overlay" @click="closeCreateTeamModal">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">팀 생성</h2>
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
const showCreateTeamModal = ref(false);
const newTeamName = ref('');

const router = useRouter();

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const fetchUserTeams = async () => {
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
  router.push(`/tables`);
  userStore.setTeamId(item.id);
};

const openCreateTeamModal = () => {
  showCreateTeamModal.value = true; 
};

const closeCreateTeamModal = () => {
  showCreateTeamModal.value = false; 
  newTeamName.value = ''; 
};

const createTeam = async () => {
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
  if (!confirm("정말로 이 팀을 삭제하시겠습니까?")) return;
  try {
    await axios.delete(`/team/delete/${teamId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userStore.token}`
      }
    });
    await fetchUserTeams();
    router.push('/tables'); 
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
  transition: opacity 0.1s ease, transform 0.1s ease;
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
  border-radius: 8px;
  width: 350px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin-bottom: 15px;
  font-size: 18px; 
  font-weight: bold; 
  text-align: center; 
}

.modal-content .form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.modal-actions .btn {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
}

.btn-small {
  padding: 3px 8px; 
  font-size: 10px; 
}

.dropdown-menu li {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 11pt;
  transition: background-color 0.15s, color 0.15s;
  padding: 0;
}

.delete-icon {
  background: none; 
  border: none; 
  color: black; 
  font-size: 14px;
  cursor: pointer; 
  padding: 0; 
  line-height: 1; 
  margin-left: 2px; 
}

.delete-icon:hover {
  color: red; 
}

.dropdown-item {
  display: flex;
  justify-content: space-between; 
  align-items: center;
}

.dropdown-item button {
  padding: 8px 0px; 
  padding-left: 10%;
  margin: 0; 
  font-size: 13px; 
  width: auto; 
}

.dropdown-item button:hover {
  background-color: #f0f0f0; /* 호버 효과 */
}

</style>
