<template>
  <main>
    <div class="container-fluid profile-overview">
      <div class="row justify-content-start">
        <div class="col-md-10">
          <!-- 팀 프로필 카드 -->
          <div class="card shadow-lg mt-4">
            <div class="card-body p-3">
              <div class="row gx-4">
                <div class="col-auto">
                  <div class="avatar avatar-xl position-relative">
                    <img
                      :src="selectedTeam.imageUrl ? selectedTeam.imageUrl : require('@/assets/img/애옹.png')"
                      class="w-100 border-radius-lg"
                    />
                  </div>
                </div>
                <div class="col-auto my-auto">
                  <div class="h-100">
                    <h5 class="mb-1">{{ selectedTeam.name }}</h5>
                    <!-- <p class="mb-0 font-weight-bold text-sm">{{ selectedTeam.role }}</p> -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 팀원 리스트 -->
          <div class="card mt-4">
            <div class="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Member</h5>
              <button class="btn btn-custom btn-sm" @click="showInviteModal">
                팀원 추가
              </button>
            </div>
            <div class="card-body">
              <!-- 그룹장 섹션 -->
              <div v-if="leader" class="group-leader">
                <h6 class="text-uppercase">그룹장</h6>
                <div class="profile-box position-relative">
                  <img :src="leader.profileImage ? leader.profileImage : require('@/assets/img/애옹.png')" class="member-icon" />
                  <span class="member-name">{{ leader.nickname }}</span>
                </div>
                <hr class="horizontal dark" />
              </div>

              <!-- 그룹원 섹션 -->
              <div class="group-members mt-4">
                <h6 class="text-uppercase">그룹원</h6>
                <div v-for="member in members" :key="member.id" class="position-relative member-item">
                  <div class="member-box">
                    <img :src="member.profileImage ? member.profileImage : require('@/assets/img/애옹.png')" class="member-icon" />
                    <span class="member-name">{{ member.nickname }}</span>
                    <span class="delete-icon"  @click="confirmDelete(member)">X</span>
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

          <!-- 팀원 삭제 확인 모달 -->
          <div v-if="isDeleteModalVisible" class="modal">
            <div class="modal-content">
              <span class="close" @click="closeDeleteModal">&times;</span>
              <h6>팀원을 삭제하시겠습니까?</h6>
              <div class="d-flex justify-content-end mt-4">
                <button class="btn btn-danger me-3" @click="deleteMember">삭제</button>
                <button class="btn btn-secondary" @click="closeDeleteModal">취소</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/user';
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
    const isDeleteModalVisible = ref(false);
    const isEditModalVisible = ref(false);
    const memberToDelete = ref(null);
    const route = useRoute();

    const separateMembers = async (teamMembers) => {
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
        // console.log("teamMembers: ", teamMembers);
        console.log("members.value: ", members.value);
      } catch (error) {
        console.error('팀원 목록을 불러오는 중 오류 발생:', error);
      }
    };
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`/team/${route.params.id}`);
        selectedTeam.value = response.data;
        console.log(selectedTeam.value);
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

    onMounted(async() => (fetchTeamMembers()));
    fetchTeamData();

    const openEditModal = () => {
      isEditModalVisible.value = true;
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
    };

    const showInviteModal = () => {
      isModalVisible.value = true;
    };

    const closeInviteModal = () => {
      isModalVisible.value = false;
      inviteEmail.value = '';
    };

    const sendInvite = async () => {
      console.log("초대할 팀 ID:", selectedTeam.value.id);
      console.log("초대할 이메일:", inviteEmail.value);
      try {
        await axios.post(`/team/${selectedTeam.value.id}/invite`, null, {
          params: { inviteeEmail: inviteEmail.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // 인증 토큰 추가
          },
        });
        alert("초대 메일이 성공적으로 전송되었습니다.");
        closeInviteModal();
      } catch (error) {
        console.error('초대 이메일 전송 중 오류 발생:', error);
      }
};

    const confirmDelete = (member) => {
      memberToDelete.value = member;
      isDeleteModalVisible.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalVisible.value = false;
      memberToDelete.value = null;
    };

    const deleteMember = async () => {
      try {
        await axios.delete(`/team/remove/${selectedTeam.value.id}/${memberToDelete.value.id}`);
        members.value = members.value.filter((member) => member.id !== memberToDelete.value.id);
        closeDeleteModal();
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
      isDeleteModalVisible,
      isEditModalVisible,
      openEditModal,
      closeEditModal,
      showInviteModal,
      closeInviteModal,
      sendInvite,
      confirmDelete,
      closeDeleteModal,
      deleteMember,
    };
  },
};
</script>
  
  
  <style scoped>
  .container-fluid {
  padding: 0 2cm;
  /* padding-left: 5cm; 왼쪽 패딩 추가로 오른쪽으로 이동 */
  /* padding-right: 1cm; */
  }
  
  .card {
  margin-top: 2rem;
  }
  
  .card-body {
  padding: 1rem;
  }
  
  .group-leader,
  .group-members {
  margin-bottom: 1rem;
  }
  
  .member-icon, .profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  }
  
  .profile-name, .member-name{
  font-weight: bold;
  margin-right: 700px;
  text-align: left;
  }

  .member-box, .profile-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  }
  
  .delete-icon {
  cursor: pointer;
  color: red;
  margin-left: 10px; 
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
  }
  
  hr.horizontal {
  border: 0;
  height: 1px;
  background: #ccc;
  }
  
  .btn-custom {
  background-color: #007bff;
  color: white;
  }
  
  .btn-custom:hover {
  background-color: #0056b3;
  }
  </style>