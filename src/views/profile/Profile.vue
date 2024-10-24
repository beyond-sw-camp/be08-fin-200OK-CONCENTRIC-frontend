<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useStore } from "vuex";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ProfileCard from "@/views/profile/ProfileCard.vue";
import ProfileEdit from "@/views/profile/ProfileEdit.vue";
import PrivateStorage from "@/views/storage/PrivateStorage.vue";
import Social from "@/views/social/Social.vue";
import NotificationList from "@/views/notification/NotificationList.vue";
import PasswordEdit from "@/views/profile/PasswordEdit.vue";
import ProfileDeactivation from "@/views/profile/ProfileDeactivation.vue";
import { useStateStore } from "@/store/states";
import { useRoute } from "vue-router";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
const stateStore = useStateStore();
const activeTab = ref("");
const route = useRoute();

const setActiveTab = tab => activeTab.value = tab;

watch(
    () => route.query.tab,
    (newTab) => {
      if (newTab) {
        activeTab.value = newTab;
      } else {
        activeTab.value = "profile_card"; // 기본 탭
      }
    },
    { immediate: true } // 초기값 설정
);

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();

  const tabParam = route.query.tab;
  if (tabParam){
    setActiveTab(tabParam);
  } else {
    setActiveTab('profile_card');
  }
});
onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
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
  <div class="team-page-container d-flex">
    <div class="sidebar">
        <ul class="menu">
          <li style="pointer-events: none">
            마이 페이지
          </li>
          <li :class="{ active: activeTab === 'profile_card' }"
              @click="setActiveTab('profile_card')">
            <i class="fa fa-user" aria-hidden="true"></i>프로필</li>
          <li :class="{ active: activeTab === 'profile_edit' }"
              @click="setActiveTab('profile_edit')">
            <i class="fa fa-edit" aria-hidden="true"></i>정보 수정</li>
          <li :class="{ active: activeTab === 'private_storage' }"
              @click="setActiveTab('private_storage')">
            <i class="fa fa-archive" aria-hidden="true"></i>파일함</li>
          <li :class="{ active: activeTab === 'social' }"
              @click="setActiveTab('social')">
            <i class="fa fa-users" aria-hidden="true"></i>친구</li>
          <li :class="{ active: activeTab === 'notification_list' }"
              @click="setActiveTab('notification_list')">
            <i class="fa fa-bell" aria-hidden="true"></i>알림</li>
          <li :class="{ active: activeTab === 'password_edit' }"
              @click="setActiveTab('password_edit')">
            <i class="fa fa-cog" aria-hidden="true"></i>비밀번호 변경</li>
          <li :class="{ active: activeTab === 'profile_deactivation' }"
              @click="setActiveTab('profile_deactivation')">
            <i class="fa fa-trash" aria-hidden="true"></i>회원 탈퇴</li>

        </ul>
    </div>
    <div class="main-content">
        <profile-card v-if="activeTab === 'profile_card'"/>
        <profile-edit v-if="activeTab === 'profile_edit'"/>
        <private-storage v-if="activeTab === 'private_storage'"/>
        <social v-if="activeTab === 'social'"/>
        <notification-list v-if="activeTab === 'notification_list'"/>
        <password-edit v-if="activeTab === 'password_edit'"/>
        <profile-deactivation v-if="activeTab === 'profile_deactivation'"/>
    </div>
  </div>
</template>

<style scoped>
.team-page-container {
  display: flex;
  height: 100vh;
  transform: translateY(18%);
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
  padding-inline: 10rem;
}

.sidebar {
  width: 15%;
  padding: 1rem;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0;
}
</style>

