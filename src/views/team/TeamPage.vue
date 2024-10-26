<template>
  <div class="team-page-container d-flex">
    <!-- Sidebar -->
    <div class="sidebar">
      <ul class="menu">
        <li style="pointer-events: none;">
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
        <li :class="{ active: activeSection === 'files' }" @click="setActiveSection('files')">
          <i class="fa fa-archive" aria-hidden="true"></i> 파일함
        </li>   
      </ul>
    </div>
  
    <!-- Main content -->
    <div class="main-content">
      <TeamProfile v-if="activeSection === 'profile'" :team="team" />
      <TeamProfileEdit v-if="activeSection === 'edit'" :team="team" />  <!-- 수정된 부분 -->
      <p v-if="activeSection === 'schedule'"></p>
      <p v-if="activeSection === 'files'"></p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TeamProfile from '../team/TeamProfile.vue';
import TeamProfileEdit from '../team/TeamProfileEdit.vue';  

const route = useRoute();
const team = ref({});
const activeSection = ref('profile');

// Fetch team data
const fetchTeam = async (teamId) => {
  try {
    const response = await axios.get(`/team/${teamId}`);
    team.value = response.data;
  } catch (error) {
    console.error('팀 정보를 불러오는데 실패했습니다:', error);
  }
};

// On component mount, load team data
onMounted(() => {
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
.team-page-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 15%;
  padding: 1rem 1rem 1rem 3rem;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0;
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
  border-radius: 6px;
  transition: background-color 0.15s, color 0.15s;
}

.menu li i {
  margin-right: 1rem;
}

.menu li.active,
.menu li:hover {
  background-color: #e3e3e3;
  color: rgb(0, 0, 0);
}

.main-content {
  flex-grow: 1;
}
</style>
