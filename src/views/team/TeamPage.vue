<template>
  <div class="team-page-container row min-vh-75" style="min-height: 100%;">
    <div class="col-2 py-4">
      <div class="card" style="min-width: 210px; height: 100%;">
        <!-- Sidebar -->
        <div class="sidebar d-flex flex-column align-items-start" style="height: 100%;">
          <ul class="menu" style="padding-left: 1rem; width: 100%;">
            <li style="border-bottom: 0.5px solid rgba(0, 0, 0, 0.2); width: 90%; border-radius: 0; font-size: 12pt; font-weight: 600; pointer-events: none;">
              팀 정보 페이지
            </li>
            <li :class="{ active: activeSection === 'profile' }" @click="setActiveSection('profile')">
              <i class="fa fa-user" aria-hidden="true"></i> 팀 정보
            </li>
            <li :class="{ active: activeSection === 'edit' }" @click="setActiveSection('edit')">
              <i class="fa fa-edit" aria-hidden="true"></i> 정보 수정
            </li>
    <!--          <li :class="{ active: activeSection === 'schedule' }" @click="setActiveSection('schedule')">-->
    <!--            <i class="ni ni-calendar-grid-58 text-warning"></i> 팀 일정-->
    <!--          </li>-->
            <!-- <li :class="{ active: activeSection === 'files' }" @click="setActiveSection('files')">
              <i class="fa fa-archive" aria-hidden="true"></i> 파일함
            </li> -->
            <li :class="{ active: activeSection === 'teamstorage' }" @click="setActiveSection('teamstorage')">
                <i class="fa fa-archive" aria-hidden="true"></i>파일함
            </li>   
          </ul>
        </div>
      </div>
    </div>
    <div class="col-10 py-4 container-fluid position-relative">
      <div class="content-box">
        <!-- Main content -->
        <div class="main-content">
          <TeamProfile v-if="activeSection === 'profile'" :team="team" />
          <TeamProfileEdit v-if="activeSection === 'edit'" :team="team" />  
          <TeamStorage v-if="activeSection == 'teamstorage'" :team="team" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TeamProfile from '../team/TeamProfile.vue';
import TeamProfileEdit from '../team/TeamProfileEdit.vue';
import TeamStorage from "../storage/TeamStorage.vue";  

const route = useRoute();
const team = ref({});
const activeSection = ref('profile');

// Fetch team data
const fetchTeam = async (teamId) => {
  try {
    const response = await axios.get(`/team/${teamId}`);
    team.value = response.data;
    console.log("팀 정보 : ", team.value)
  } catch (error) {
    console.error('팀 정보를 불러오는데 실패했습니다:', error);
  }
};

// On component mount, load team data
onMounted(() => {
  console.log("Route ID on mount:", route.params.id); // 라우트 ID 확인
  fetchTeam(route.params.id);
});

// Watch for route changes to reload team data
watch(() => route.params.id, (newId) => {
  fetchTeam(newId);
});

// Set the active section
const setActiveSection = (section) => {
  activeSection.value = section;
};
</script>

<style scoped>
/* .team-page-container {
  display: flex;
  height: 100vh;
} */

.team-page-container {
  padding: 0;
}

/* .sidebar {
  width: 15%;
  padding: 1rem 1rem 1rem 3rem;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0;
} */

.main-content {
  bottom: 0;
  /* transform: translateX(-50%); */
  width: 100%;
  text-align: center; 
  position: relative;
}

.sidebar {
  width: 100%;
  padding-top: 1rem;
  flex-shrink: 0;
  align-content: center;
}

.menu {
  list-style-type: text;
  padding: 0;
}

.menu li {
  padding: 0.6rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  font-size: 11pt;
  margin-right: 1rem;
  transition: background-color 0.15s, color 0.15s;
}

.menu li i {
  margin-right: 1rem;
  font-size: 12pt;
  align-items: left;
}

.menu li.active,
.menu li:hover {
  background-color: #e3e3e3ae;
  color: rgb(0, 0, 0);
}

.main-content {
  flex-grow: 1;
}
</style>
