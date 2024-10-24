<script setup>

import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import { ref } from "vue";
import axios from "axios";

const nickname = ref("");

const friendRequest = async () => {
  try {
    const response = await axios.post('friendship/request/create',
    null,
        {
          params: {
            nickname: nickname.value
          },
          validateStatus: false
        }
    );
    if(response.status === 201){
      alert("친구 요청을 보냈습니다.");
    }else if(response.status === 409){
      alert("이미 등록된 친구입니다.");
    }else if(response.status === 404){
      alert("존재하지 않는 사용자입니다.");
    }
    nickname.value = "";
  }catch (error) {
    console.log(error);
  }
};

</script>

<template>
  <div class="friend-list" style="width: 70%">
    <div class="friend-cards">
      <div class="friend-card"
           style="display: flex; justify-content: space-between; align-items: center;">

        <div class="card card-profile col-md-12" style="box-shadow: none;">
          <div class="card-body">
            <hr class="horizontal dark" />
            <div class="row">
              <div class="col-md-12">
                <label for="password" class="form-control-label">닉네임을 입력하세요</label>
                <argon-input
                    id="nickname"
                    type="nickname"
                    v-model="nickname"
                />
              </div>

              <div class="d-flex justify-content-center" style="margin-top: 20px;">
                <argon-button @click="friendRequest">친구 요청</argon-button>
              </div>

            </div>
            <hr class="horizontal dark" />

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-list {
  padding: 20px;
}

.friend-list-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.friend-cards {
  display: flex;
  flex-direction: column;
}

.friend-card {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.friend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>