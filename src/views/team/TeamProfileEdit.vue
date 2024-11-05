<template>
  <div class="container">
    <div class="card">
      <div class="team-edit-container" >
        <h2>팀 정보 수정</h2>
    
        <!-- Team Name Input -->
        <div class="form-group">
          <label for="teamName">팀 이름</label>
          <input type="text" id="teamName" v-model="selectedTeam.name" placeholder="팀 이름을 입력하세요" />
        </div>
    
        <!-- Team Image Upload -->
        <div class="form-group">
          <label for="teamImage">팀 이미지</label>
          <input type="file" id="teamImage" @change="handleImageUpload" />
          <img v-if="imageUrl" :src="imageUrl" alt="Team Image" class="image-preview" />
        </div>
    
        <!-- Save Button -->
        <button @click="confirmUpdate" class="save-button">수정 완료</button>
    
        <!-- Leave Team Button -->
        <button @click="leaveTeam" class="leave-button">팀 나가기</button>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from "@/store/user";
  
  // props에서 team을 받아옵니다.
  const props = defineProps({
    team: {
      type: Object,
      default: () => ({}),
    },
  });
  
  const userStore = useUserStore();
  const route = useRoute();
  const router = useRouter();
  const imageUrl = ref(""); // 이미지 미리보기 URL
  const selectedTeam = ref({ ...props.team }); // 선택한 팀 정보
  const profileFile = ref(null); // 업로드된 이미지 파일
  
  const fetchTeamData = async () => {
    try {
      const response = await axios.get(`/team/${route.params.id}`);
      selectedTeam.value = response.data;
      // 이미지 URL 초기화
      if (selectedTeam.value.imageUrl) {
        imageUrl.value = selectedTeam.value.imageUrl;
      }
      console.log(selectedTeam.value);
    } catch (error) {
      console.error('팀 정보를 불러오는데 실패했습니다:', error);
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      imageUrl.value = URL.createObjectURL(file); // 이미지 미리보기
      profileFile.value = file; // 파일 저장
    }
  };
  
  const updateTeam = async () => {
    const formData = new FormData();
    formData.append(
      'team', JSON.stringify({ name: selectedTeam.value.name })
    );
    formData.append('file',profileFile.value);
  
    try {
      const response = await axios.put(`/team/update/${route.params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );
      if(response.status === 200) {
        userStore.updateTeam(response.data);
        alert("팀 정보가 변경되었습니다.");
      } else if (response.status === 403) {
        alert("그룹장만 수정할 수 있습니다.");
      } else {
        alert("팀 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("네트워크 오류 : ", error);
    }
  };
  
  const leaveTeam = async () => {
    if (confirm("정말로 팀을 나가시겠습니까?")) {
      try {
        const response = await axios.delete(`/team/leave/${route.params.id}`,
            {
              validateStatus: false
            }
        ); // 팀 나가기 API 호출
        if(response.status === 200) {
          userStore.leaveTeam(route.params.id); // 유저 스토어에서 팀 제거
          alert("팀에서 나갔습니다.");
          router.push('/tables');
        } else if(response.status === 400) {
          alert("팀장은 팀을 나갈수 없습니다.");
        }
      } catch (error) {
        console.error("팀 나가기 오류 : ", error);
        // alert("팀 나가기 실패했습니다.");
      }
    }
  };
  
  const confirmUpdate = () => {
    if (confirm("수정 사항을 저장하시겠습니까?")) {
      updateTeam();
    }
  };
  watch(
        () => props.team,
        async (newTeam) => {
          if (newTeam) {
            selectedTeam.value = newTeam;
            await fetchTeamData();
          }
        }
      );
  
  // Fetch team data on mount
  onMounted(fetchTeamData);
  </script>
  
  <style scoped>
  .team-edit-container {
    margin: 0 10rem;
  }

  .card{
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    min-height: 600px;
    width: 120vh;
    padding-top: 6%;
    margin: 0 1.5rem;
  }

  .container {
  /* max-width: 600px; */
  padding: 0;
  }

  h2 {
    margin-bottom: 50px;
    font-size: 1.3rem;
  }
  
  .form-group {
    margin-bottom: 40px;
  }
  
  label {
    display: block;
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 11pt;
  }
  
  input[type="text"],
  input[type="file"] {
    width: 100%;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #dee2e6;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    font-size: 11pt;
  }
  
  button {
    padding: 6px 40px;
    background-color: #8A9BF9;
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin: 20px 0 0px 20px;
    transition: background-color 0.3s;
    font-size: 11pt;
  }
  
  button:hover {
    background-color: #6f80e3;
  }
  
  .image-preview {
    max-width: 150px;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
  
  .leave-button {
    background-color: #dc3545; /* 팀 나가기 버튼 색상 */
  }
  
  .leave-button:hover {
    background-color: #c82333; /* 팀 나가기 버튼 호버 색상 */
  }
  </style>
  