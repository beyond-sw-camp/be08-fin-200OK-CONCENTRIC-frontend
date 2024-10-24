<template>
    <div class="team-edit-container">
      <h2>팀 정보 수정</h2>
  
      <!-- Team Name Input -->
      <div class="form-group">
        <label for="teamName">팀 이름</label>
        <input type="text" id="teamName" v-model="teamName" placeholder="팀 이름을 입력하세요" />
      </div>
  
      <!-- Team Image Upload -->
      <div class="form-group">
        <label for="teamImage">팀 이미지</label>
        <input type="file" id="teamImage" @change="handleImageUpload" />
        <img v-if="imageUrl" :src="imageUrl" alt="Team Image" class="image-preview" />
        <img v-else :src="defaultImageUrl" alt="Default Team Image" class="image-preview" />
      </div>
  
      <!-- Save Button -->
      <button @click="confirmUpdate" class="save-button">수정 완료</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const teamName = ref("");  // 팀 이름 저장
  const imageUrl = ref("");  // 이미지 URL 저장
  const defaultImageUrl = require('@/assets/img/애옹.png');  // 기본 이미지 URL 저장
  const selectedTeam = ref({
    image: null,  // 업로드된 파일을 저장할 필드
  });
  
  // 팀 정보를 가져오는 함수
  const getTeamInfo = async (teamId) => {
    try {
      const response = await axios.get(`/team/${teamId}`);
      const teamData = response.data;
      teamName.value = teamData.name;
      imageUrl.value = teamData.imageUrl || defaultImageUrl;  // 기본 이미지 사용
    } catch (error) {
      console.error("팀 정보를 불러오는 중 오류 발생:", error);
    }
  };
  
  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imageUrl.value = reader.result;  // 이미지 미리보기 업데이트
        selectedTeam.value.image = file;  // 파일 객체 저장
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 팀 정보 업데이트 함수
  const updateTeam = async () => {
    try {
      const formData = new FormData();
      formData.append('name', teamName.value);
      if (selectedTeam.value.image) {
        formData.append('image', selectedTeam.value.image);
      }
  
      await axios.put(`/team/update/${route.params.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('팀 정보가 수정되었습니다.');
    } catch (error) {
      console.error('팀 정보를 수정하는데 실패했습니다:', error);
    }
  };
  
  // 수정 확인 후 업데이트 함수 호출
  const confirmUpdate = () => {
    if (confirm("수정 사항을 저장하시겠습니까?")) {
      updateTeam();
    }
  };
  
  // 컴포넌트 마운트 시 팀 정보 불러오기
  onMounted(() => {
    const teamId = route.params.id;  // URL에서 teamId 가져오기
    getTeamInfo(teamId);
  });
  </script>
  
  <style scoped>
  .team-edit-container {
    max-width: 800px;
    margin: 30px auto;
    padding: 30px;
    background-color: #f8f9fa;

    border:none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 추가 */
  }
  
  h2 {
    margin-bottom: 30px;
    font-size: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 40px;
  }
  
  label {
    display: block;
    margin-bottom: 12px;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="file"] {
    width: 100%;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #dee2e6;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
  
  button {
    padding: 12px 20px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
    width: 100%;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  .image-preview {
    max-width: 150px;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
  </style>
  