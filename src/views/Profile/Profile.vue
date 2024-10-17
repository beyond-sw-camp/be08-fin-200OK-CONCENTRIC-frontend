<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ProfileCard from "@/views/Profile/ProfileCard.vue";
import ProfileMenu from "@/views/Profile/ProfileMenu.vue";
import ProfileEdit from "@/views/Profile/ProfileEdit.vue";
import PrivateStorage from "@/views/storage/PrivateStorage.vue";
import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";
import { useStateStore } from "@/store/states";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
const stateStore = useStateStore();
const activeTab = ref("");

const setActiveTab = tab => activeTab.value = tab;

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
});
onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
  setActiveTab("profile_card");
});
onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
</script>
<template>
  <div class="container-fluid">
    <nav class="navbar navbar-expand-lg bg-body-tertiary" style="box-shadow: none;">
      <!-- Navbar Content -->
    </nav>
    <div class="row" style="margin-top: 10%;">
      <div class="col-md-2">
          <ul class="list-group shadow-sm">
          <li class="list-group-item list-group-item-action" @click="setActiveTab('profile_card')">프로필</li>
          <li class="list-group-item list-group-item-action" @click="setActiveTab('profile_edit')">정보 수정</li>
          <li class="list-group-item list-group-item-action" @click="setActiveTab('private_storage')">파일함</li>
          <li class="list-group-item list-group-item-action" @click="setActiveTab('')">친구</li>
          <li class="list-group-item list-group-item-action" @click="setActiveTab('')">알림</li>
          </ul>
      </div>
      <div class="col-md-6" style="margin-left: 10%;">
          <profile-card v-if="activeTab === 'profile_card'"/>
          <profile-edit v-if="activeTab === 'profile_edit'"/>
          <private-storage v-if="activeTab === 'private_storage'"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  transition: background-color 0.3s, color 0.3s;
  margin-bottom: 10px; /* 링크 간의 간격 증가 */
  border: none; /* 경계선 제거 */
  border-radius: 5px;
  background-color: transparent;
}

.list-group-item:hover {
  background-color: #007BFF; /* Hover 배경색 */
  color: white; /* Hover 텍스트 색상 */
}

.card {
  border: none;
  border-radius: 10px;
  overflow: hidden; /* 카드 안의 요소가 경계를 넘지 않도록 */
}
</style>

