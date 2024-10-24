<template>
    <div class="team-edit-container">
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
        <img v-if="selectedTeam.imageUrl" :src="selectedTeam.imageUrl" alt="Team Image" class="image-preview" />
      </div>
  
      <!-- Save Button -->
      <button @click="confirmUpdate" class="save-button">수정 완료</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const selectedTeam = ref({
    name: '',
    description: '',
    imageUrl: '',
  });
  
  const fetchTeamData = async () => {
    try {
      const response = await axios.get(`/team/${route.params.id}`);
      selectedTeam.value = response.data;
      console.log(selectedTeam.value);
    } catch (error) {
      console.error('팀 정보를 불러오는데 실패했습니다:', error);
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      selectedTeam.value.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  };
  
  const updateTeam = async () => {
    try {
      const formData = new FormData();
      formData.append('name', selectedTeam.value.name);
      if (selectedTeam.value.imageUrl) {
        formData.append('image', selectedTeam.value.imageUrl);
      }
  
      await axios.put(`/team/${route.params.id}`, formData);
      alert('팀 정보가 수정되었습니다.');
    } catch (error) {
      console.error('팀 정보를 수정하는데 실패했습니다:', error);
    }
  };
  
  const confirmUpdate = () => {
  if (confirm("수정 사항을 저장하시겠습니까?")) {
    updateTeam();
  }
};
  

  
  // Fetch team data on mount
  fetchTeamData();
  </script>
   
  <style scoped>
  .team-edit-container {
    max-width: 800px; /* 가로 길이를 늘리기 위해 변경 */
    margin: 30px auto 0; /* 상단 마진을 30px 추가 */
    padding: 30px; /* 패딩을 늘려서 공간 확보 */
    background-color: #f8f9fa;
    border:none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 추가 */
  }
  
  h2 {
    margin-bottom: 30px; /* 제목과 요소 간의 간격 추가 */
    font-size: 1.5rem; /* 제목 크기 조정 */
  }
  
  .form-group {
    margin-bottom: 40px; /* 요소 간의 여백을 늘림 */
  }
  
  label {
    display: block;
    margin-bottom: 12px; /* 라벨과 입력 필드 간의 간격 */
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="file"] {
    width: 100%;
    padding: 12px; /* 패딩을 늘려서 입력 필드 넓게 */
    border-radius: 5px;
    border: 1px solid #dee2e6;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 추가 */
  }
  
  button {
    padding: 12px 20px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px; /* 버튼 간의 간격을 늘림 */
    transition: background-color 0.3s;
    width: 100%; /* 버튼의 가로 길이 늘리기 */
  }
  
  button:hover {
    background-color: #218838;
  }
  
  .image-preview {
    max-width: 150px; /* 이미지 프리뷰 크기 조정 */
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1); /* 이미지에 그림자 추가 */
  }
  </style>
  