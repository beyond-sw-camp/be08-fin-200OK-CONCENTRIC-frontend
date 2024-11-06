<template>
  <main>
    <div class="container-fluid profile-overview">
      <div class="card-list">
        <div class="card" style="min-height: 150px;">
          <div class="card-body p-3">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative mt-2">
                <img
                  :src="selectedTeam.imageUrl ? selectedTeam.imageUrl : require('@/assets/img/default/profile.png')"
                  class="w-100 border-radius-lg"
                />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{ selectedTeam.name }}</h5>
              </div>
            </div>
          </div>
        </div>

        <!-- 팀원 리스트 -->
        <div class="card mt-4" style="min-height: 425px;">
          <div class="card-header pb-0 mt-2 d-flex justify-content-between align-items-center" style="margin: 0 3rem;">
            <h5 class="mb-0">Member</h5>
            <button class="btn btn-custom btn-sm" @click="showInviteModal">
              팀원 추가
            </button>
          </div>
          <div class="card-body" style="margin: 0 3rem;">
            <!-- 그룹장 섹션 -->
            <div v-if="leader" class="group-leader">
              <h6 class="text-uppercase">그룹장</h6>
              <div class="profile-box position-relative">
                <img :src="leader.profileImage ? leader.profileImage : require('@/assets/img/default/profile.png')" class="member-icon" />
                <span class="member-name">{{ leader.nickname }}</span>
              </div>
              <hr class="horizontal dark" />
            </div>

            <!-- 그룹원 섹션 -->
            <div class="group-members mt-4">
              <h6 class="text-uppercase">그룹원</h6>
              <div v-for="member in members" :key="member.id" class="position-relative member-item">
                <div class="member-box">
                  <img :src="member.profileImage ? member.profileImage : require('@/assets/img/default/profile.png')" class="member-icon" />
                  <span class="member-name">{{ member.nickname }}</span>
                  <span class="delete-icon" @click="confirmDelete(member)" v-if="isLeader">내보내기</span>
                </div>
              </div>
              <hr class="horizontal dark" />
            </div>
          </div>
        </div>

        <!-- 팀원 추가 모달 -->
        <div v-if="isModalVisible" class="modal">
          <div class="modal-content">
            <span class="close" @click="closeInviteModal">&times;</span>
            <h6>팀원 초대하기</h6>
            <input type="email" v-model="inviteEmail" placeholder="이메일 입력" class="form-control" />
            <button class="btn btn-primary mt-3" @click="sendInvite">전송</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user.js';
import { useRoute, useRouter } from 'vue-router';


export default {
  props: {
    team: Object,
    teams: Array,
  },
  setup(props) {
    const selectedTeam = ref(props.team || {});
    const leader = ref(null);
    const members = ref([]);
    const inviteEmail = ref('');
    const isModalVisible = ref(false);
    const memberToDelete = ref(null);
    const route = useRoute();
    const userStore = useUserStore();
    const isLeader = ref(false);


    const separateMembers = (teamMembers) => {
      if (teamMembers.length > 0) {
        leader.value = teamMembers[0]; // 배열의 첫 번째 팀원을 그룹장으로 설정
        members.value = teamMembers.slice(1); // 나머지 팀원들을 그룹원 목록으로 설정
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`/team/list/member?teamId=${route.params.id}`);
        const teamMembers = response.data || [];
        await separateMembers(teamMembers);
        console.log("leader: ", leader.value.id);
        console.log("members.value: ", members.value);
        if(userStore.userInfo.id === leader.value.id) isLeader.value = true;
      } catch (error) {
        console.error('팀원 목록을 불러오는 중 오류 발생:', error);
      }
    };

    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`/team/${route.params.id}`);
        selectedTeam.value = response.data;
      } catch (error) {
        console.error('팀 정보를 불러오는데 실패했습니다:', error);
      }
    };

    watch(
      () => props.team,
      async (newTeam) => {
        if (newTeam) {
          selectedTeam.value = newTeam;
          await fetchTeamMembers();
        }
      }
    );

    onMounted(async () => {
      await fetchTeamMembers();
      await fetchTeamData();
    });

    const showInviteModal = () => {
      isModalVisible.value = true;
    };

    const closeInviteModal = () => {
      isModalVisible.value = false;
      inviteEmail.value = '';
    };

    const sendInvite = async () => {
      try {
        await axios.post(`/team/invite`,
            null,
            {
              params: {
                teamId: selectedTeam.value.id,
                email: inviteEmail.value
              },
        });
        alert("초대 메일이 성공적으로 전송되었습니다.");
        closeInviteModal();
      } catch (error) {
        console.error('초대 이메일 전송 중 오류 발생:', error);
      }
    };

    const confirmDelete = (member) => {
      if (userStore.userInfo.id !== leader.value.id) {
        alert("팀원 삭제는 그룹장만 가능합니다.");
        return;
      }

      if (confirm(`팀원 ${member.nickname}을(를) 삭제하시겠습니까?`)) {
        deleteMember(member);
      }
    };

    const deleteMember = async (member) => {
      try {
        await axios.delete(`/team/remove/${selectedTeam.value.id}/${member.id}`);
        members.value = members.value.filter((m) => m.id !== member.id);
      } catch (error) {
        console.error('팀원 삭제 중 오류 발생:', error);
      }
    };

    return {
      selectedTeam,
      members,
      leader,
      inviteEmail,
      isModalVisible,
      isLeader,
      showInviteModal,
      closeInviteModal,
      sendInvite,
      confirmDelete,
      deleteMember,
    };
  },
};
</script>

<style scoped>
.container-fluid {
  padding: 0;
}

.card-list {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 600px;
  width: 120vh;
  margin: 0 1.5rem;
}

.group-leader,
.group-members {
  margin-bottom: 1rem;
}

.member-icon,
.profile-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 2rem;
  object-fit: cover;
}

.member-name {
  font-weight: bold;
  white-space: nowrap;
}

.member-box,
.profile-box {
  display: flex;
  align-items: center;
  justify-content: left;
  margin-left: 1rem;
  position: relative;
}

.member-item {
  margin-bottom: 2rem; 
}

.delete-icon {
  position: absolute;
  right: 10px; 
  cursor: pointer;
  color: red;
}

.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.close {
  cursor: pointer;
  float: right;
  margin-left: auto;
}

hr.horizontal {
  border: 0;
  height: 1px;
  background: #ccc;
}

.btn-custom {
  background-color: #8A9BF9;
  color: white;
}

.btn-custom:hover {
  background-color: #6f80e3;
  color: white;
}

.card {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: none;
  width: 120vh;
}
</style>
