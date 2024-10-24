<template>
    <main>
      <div class="container-fluid profile-overview" style="padding: 0 2cm;">
        <div class="row justify-content-start" style="margin-left: 4cm;">
          <div class="col-md-10">
            <!-- 팀 프로필 카드 -->
            <div class="card shadow-lg mt-4">
              <div class="card-body p-3">
                <div class="row gx-4">
                  <div class="col-auto">
                    <div class="avatar avatar-xl position-relative">
                      <img
                        :src="selectedTeam.icon"
                        alt="profile_image"
                        class="w-100 border-radius-lg"
                      />
                      <input
                        type="file"
                        id="file-input"
                        @change="updateProfileImage"
                        style="display: none;"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div class="col-auto my-auto">
                    <div class="h-100">
                      <h5 class="mb-1">{{ selectedTeam.name }}</h5>
                      <p class="mb-0 font-weight-bold text-sm">{{ selectedTeam.role }}</p>
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
                    <img :src="leader.profilepic" class="member-icon" />
                    <span class="profile-name">{{ leader.nickname }}</span>
                
                  </div>
                  <hr class="horizontal dark" />
                </div>
  
                <!-- 그룹원 섹션 -->
                <div class="group-members mt-4">
                  <h6 class="text-uppercase">그룹원</h6>
                  <div v-for="member in members" :key="member.id" class="position-relative member-item">
                    <div class="member-box">
                      <img :src="member.profileImage" class="member-icon" />
                      <span class="member-name">{{ member.nickname }}</span>
                      <span class="delete-icon" @click="confirmDelete(member)">X</span>
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
  
            <!-- 프로필 수정 모달 -->
            <div v-if="isEditModalVisible" class="modal">
              <div class="modal-content">
                <span class="close" @click="closeEditModal">&times;</span>
                <h6>프로필 수정</h6>
                <input
                  type="text"
                  v-model="selectedTeam.name"
                  placeholder="팀 이름 수정"
                  class="form-control mb-2"
                />
                <input
                  type="file"
                  id="edit-file-input"
                  @change="updateProfileImage"
                  style="display: none;"
                  accept="image/*"
                />
                <button class="btn btn-custom" @click="openFileDialog">프로필 사진 수정</button>
                <div class="d-flex justify-content-end mt-3">
                  <button class="btn btn-primary" @click="saveProfile">확인</button>
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
  
  export default {
    props: {
      team: Object,
      teams: Array,
    },
    setup(props) {
      const selectedTeam = ref(props.team || {});
      const teamList = ref(props.teams);
      const members = ref([]);
      const leader = ref(null);
      const inviteEmail = ref('');
      const isModalVisible = ref(false);
      const isDeleteModalVisible = ref(false);
      const isEditModalVisible = ref(false);
      const memberToDelete = ref(null);
      const teamMembers = ref([]);
      const userStore = useUserStore();
  
      // 팀원 구분하는 메서드
      const separateMembers = async (teamMembers) => {
        if (!Array.isArray(teamMembers)) {
          console.error('팀원 목록이 배열이 아닙니다:', teamMembers);
          return;
        }
  
        leader.value = teamMembers.find(
            member => member.id === selectedTeam.value.creatorId
        );
        members.value = teamMembers.filter(
            member => member.id !== selectedTeam.value.creatorId
        );
  
        // 그룹원 프로필 이미지 가져오기
        await Promise.all(
        members.value.map(async (member, index) => {
            if (member.profileImage) {
                try {
                    const profileImage = await getTeamsProfileImage(member.profileImage);
                    members.value[index] = { ...member, profileImage }; // 반응성 유지
                    console.log('Profile Image URL:', profileImage);
            } catch (error) {
                    console.error("그룹원 이미지를 불러오는 데 실패했습니다.", error);
            }
        }
    })
  );
  
        // 그룹장의 프로필 사진 가져오기
            if (leader.value && leader.value.profileImage) {
            try {
                const profilePic = await getTeamsProfileImage(leader.value.profileImage); // 여기서 프로필 이미지를 가져옴
                leader.value = { ...leader.value, profilePic }; // 반응성 유지
                console.log('그룹장 Profile Image URL:', profilePic);
            } catch (error) {
                console.error('그룹장 이미지를 불러오는 데 실패했습니다.', error);
            }
        }
      };
  
  

      // 팀원 목록을 백엔드에서 불러오는 메서드
      const fetchTeamMembers = async () => {
        try {
          const response = await axios.get(`/team/list/member?teamId=${selectedTeam.value.id}`);
          console.log('팀원 목록 응답:', response.data);
          const teamMembers = response.data || [];
          console.log('팀원 목록 타입:', Array.isArray(teamMembers));
          await separateMembers(teamMembers); // 팀원 목록 구분
        } catch (error) {
          console.error('팀원 목록을 불러오는 중 오류 발생:', error);
        }
      };
  
      // 팀 정보가 변경될 때마다 팀원 목록을 가져오는 watch
      watch(() => props.team, async (newTeam) => {
        if (newTeam) {
            selectedTeam.value = newTeam;
            await fetchTeamMembers(); // 팀원 목록 불러오기
        } else {
            console.warn("팀 정보가 정의되지 않았습니다.");
        }
        });
  
      // 컴포넌트가 처음 로드될 때 팀원 목록을 가져오기
      onMounted(fetchTeamMembers);
  
      
  
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
        inviteEmail.value = ''; // 이메일 입력 필드 초기화
      };
  
      const sendInvite = async () => {
        try {
          await axios.post(`/team/${selectedTeam.value.id}/invite`, { email: inviteEmail.value });
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
          members.value = members.value.filter(member => member.id !== memberToDelete.value.id);
          closeDeleteModal();
        } catch (error) {
          console.error('팀원 삭제 중 오류 발생:', error);
        }
      };
      const getTeamsProfileImage = (imageString) => {
            const byteCharacters = atob(imageString);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image' });
            return URL.createObjectURL(blob);
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
  
  .profile-name {
  font-weight: bold;
  margin-right: 745px;
  text-align: left;
  }
  .member-name {
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