<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ProfileCard from "@/views/profile/ProfileCard.vue";
import ProfileEdit from "@/views/profile/ProfileEdit.vue";
import PrivateStorage from "@/views/storage/PrivateStorage.vue";
import FriendList from "@/views/social/FriendList.vue";
import NotificationList from "@/views/notification/NotificationList.vue";
import PasswordEdit from "@/views/profile/PasswordEdit.vue";
import ProfileDeactivation from "@/views/profile/ProfileDeactivation.vue";
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
  <div class="container-fluid" style="height: 150vh">
    <nav class="navbar navbar-expand-lg bg-body-tertiary" style="box-shadow: none;">
      <!-- navbar Content -->
    </nav>
    <div class="row" style="margin-top: 10%;">
      <div class="col-md-2">
          <ul class="list-group shadow-sm sticky-menu">
            <li class="list-group-item list-group-item-action"
            style="
              font-size: 1.5rem;
              font-weight: bold;
              text-align: center;
              margin-bottom: 20px;
              background: linear-gradient(90deg, rgba(138, 155, 249, 1) 0%, rgba(134, 237, 218, 1) 100%);
              color: #121235;

            ">
              마이페이지
            </li>
            <li :class="['list-group-item', 'list-group-item-action', { active: activeTab === 'profile_card' }]"
                @click="setActiveTab('profile_card')">프로필</li>
            <li :class="['list-group-item', 'list-group-item-action', { active: activeTab === 'profile_edit' }]"
                @click="setActiveTab('profile_edit')">정보 수정</li>
            <li :class="['list-group-item', 'list-group-item-action', { active: activeTab === 'private_storage' }]"
                @click="setActiveTab('private_storage')">파일함</li>
            <li :class="['list-group-item', 'list-group-item-action', { active: activeTab === 'friend_list' }]"
                @click="setActiveTab('friend_list')">친구</li>
            <li :class="['list-group-item', 'list-group-item-action', { active: activeTab === 'notification_list' }]"
                @click="setActiveTab('notification_list')">알림</li>
            <li :class="['list-group-item', 'list-group-item-action', { active: activeTab === 'password_edit' }]"
                @click="setActiveTab('password_edit')">비밀번호 변경</li>
            <li :class="['list-group-item', 'list-group-item-action', { active: activeTab === 'profile_deactivation' }]"
                @click="setActiveTab('profile_deactivation')">회원 탈퇴</li>

          </ul>
      </div>
      <div class="col-md-6" style="margin-left: 10%;">
          <profile-card v-if="activeTab === 'profile_card'"/>
          <profile-edit v-if="activeTab === 'profile_edit'"/>
          <private-storage v-if="activeTab === 'private_storage'"/>
          <friend-list v-if="activeTab === 'friend_list'"/>
          <notification-list v-if="activeTab === 'notification_list'"/>
          <password-edit v-if="activeTab === 'password_edit'"/>
          <profile-deactivation v-if="activeTab === 'profile_deactivation'"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.list-group {
  background-color: rgba(255, 255, 255, 1); /* 완전히 불투명한 흰색 배경 */
}

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

.list-group-item.active {
  background-color: #66a3ff; /* 선택된 항목의 배경색 */
  color: white; /* 선택된 항목의 텍스트 색상 */
}

.sticky-menu {
  position: sticky;
  top: 10px; /* 상단에서의 거리 */
  z-index: 1000; /* 다른 요소들 위에 위치하도록 설정 */
}

.card {
  border: none;
  border-radius: 10px;
  overflow: hidden; /* 카드 안의 요소가 경계를 넘지 않도록 */
}

</style>

