<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import SidenavProfile from "@/views/sidenav/SidenavProfile.vue";

import { useUserStore } from "@/store/user.js";
import axios from 'axios';
import { useStateStore } from "@/store/states";
// import RightTopClock from "@/views/navbar/RightTopClock.vue";

const showMenu = ref(false);
const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const route = useRoute();
const userStore = useUserStore();
const router = useRouter();
const stateStore = useStateStore();
const notifications = ref();
const numOfNotifications = ref(stateStore.numOfNotifications);
const friendshipRequests = ref();
const numOfFriendshipRequests = ref(stateStore.numOfFriendRequests);
const profileImage = ref();
const showNotifications = ref([]);

const minimizeSidebar = () => store.commit("sidebarMinimize");
const toggleConfigurator = () => store.commit("toggleConfigurator");

const clearTeamId = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};

  // team_id를 null로 설정
  if (userData.state) {
    userData.state.team_id = null;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Pinia 스토어의 team_id도 업데이트
  userStore.setTeamId(null);
};

watch(() => stateStore.numOfNotifications, (newVal) => {
  numOfNotifications.value = newVal;
});

watch(() => stateStore.numOfFriendRequests, (newVal) => {
  numOfFriendshipRequests.value = newVal;
});

const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};
const toggleDropdown = () => {
  // showMenu.value = true;
  showMenu.value = !showMenu.value;
}
const logout = async () => {
  try {
    const response = await axios.post(
      'member/logout',
      null,
      {
        validateStatus: false,
      }
    );

    if (response.status === 200 || response.status === 400 || response.status === 401) {
      userStore.clearUser();
      axios.defaults.headers.common['Authorization'] = null;
      localStorage.removeItem("user");
      router.push("/");
    }

  } catch (err) {
    console.log(err);
  }

}
const loadNotifications = async () => {
  try {
    const response = await axios.get('/notification/list/read',
      { validateStatus: false }
    );
    notifications.value = response.data;
    let count = 0;
    notifications.value.forEach(notification => {
      notification.createDate = new Date(notification['createDate']).toLocaleString().substring(0, 22);
      if (!notification.isRead) count += 1;
      showNotifications.value.push(true);
    });
    numOfNotifications.value = count;
    stateStore.setNumOfNotifications(numOfNotifications.value);
  } catch (error) {
    console.log(error);
  }
}
const updateRead = (notification, idx) => {
  notification.isRead = !notification.isRead;
  stateStore.decreaseNumOfNotifications();
  numOfNotifications.value = stateStore.numOfNotifications;
  showNotifications.value[idx] = false;
  updateReadApi(notification);
}
const updateReadApi = async (notification) => {
  try {
    const response = await axios.put(`/notification/read/${notification.id}`);
  } catch (err) {
    console.log(err);
  }
}
const loadFriendshipRequest = async () => {
  try {
    const response = await axios.get('/friendship/request/list',
      { validateStatus: false }
    );
    friendshipRequests.value = response.data;
    numOfFriendshipRequests.value = friendshipRequests.value.length;
    stateStore.setNumOfFriendRequests(numOfFriendshipRequests.value);
  } catch (error) {
    console.log(error);
  }
}
const checkLogin = () => {
  console.log("checkLogin");
  console.log(userStore.isLoggedIn);
  if ((userStore.isLoggedIn === undefined || userStore.isLoggedIn === false) && route.path === "team/invite") {
    router.push("/");
    return false;
  }
  return true;
}
const getProfileImage = async () => {
  const user = userStore.userInfo;
  if (user) {
    profileImage.value = user.imageUrl == null ? require('@/assets/img/애옹.png') : user.imageUrl;
  }
}

const handleClickOutside = (event) => {
  const dropdownMenu = document.getElementById('dropdownMenuButton');
  if (showMenu.value && !dropdownMenu.contains(event.target)) {
    showMenu.value = false;
  }
};

onMounted(() => {
  if(route.path === "team/invite") return;
  document.addEventListener('click', handleClickOutside);
  if (!checkLogin()) return;
  loadNotifications();
  loadFriendshipRequest();
  getProfileImage();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="navbar navbar-main navbar-expand-lg w-100 px-0 mx-0 shadow-none"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''" v-bind="$attrs" id="navbarBlur" data-scroll="true">
    <div class="px-3 py-1 ms-0 d-flex align-items-center justify-content-between"
      style="padding: 0 0%; width: 100%; display: flex">
      <div class="d-flex align-items-center">
        <a href="#" @click="minimizeSidebar" class="p-0 nav-link text-white" id="iconNavbarSidenav">
        </a>
      </div>
      <a href="/" class="d-flex align-items-center image-container" @click="clearTeamId">
        <img
          :src="require('@/assets/img/logos/logo.png')"
          class="w-60 mt-1"
          alt="profile_image"
        />
      </a>
      <!-- <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line bg-white"></i>
            <i class="sidenav-toggler-line bg-white"></i>
            <i class="sidenav-toggler-line bg-white"></i>
          </div> -->
      <div class="d-flex" style="width: 15rem; height: 3rem;"></div>
      <!-- <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" id="navbar">  검색 창 -->
      <div class="d-flex align-items-center">
        <sidenav-profile />
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item dropdown d-flex align-items-center me-3">
            <a href="#" class="p-0 nav-link text-white" :class="[showMenu ? 'show' : '']" id="dropdownMenuButton"
              aria-expanded="showMenu" @click.stop="toggleDropdown">
              <i class="cursor-pointer fa fa-bell"></i>
              <span class="notification-badge" v-show="numOfNotifications > 0">{{ numOfNotifications }}</span>
            </a>
            <ul class="px-2 py-3 dropdown-menu dropdown-menu-end me-n4" :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton" v-show="showMenu">
              <transition-group class="dropdown-menu-animation" name="fade" tag="ul"
                style="padding-left: 0; margin-left: 0;">
                <li class="mb-2" v-for="(notification, i) in notifications" :key="notification.id"
                  style="list-style: none;">
                  <transition name="fade">
                    <a v-if="showNotifications[i]" class="dropdown-item border-radius-md" href="javascript:;"
                      :class="{ 'bg-light': notification.isRead }" style="padding-left: 0.5rem;">
                      <div class="py-1 d-flex">
                        <div class="my-auto">
                          <img src="../../assets/img/koongya.png" class="avatar avatar-sm me-3" alt="user image" />
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-1 text-sm font-weight-normal">
                            <span class="font-weight-bold">{{ notification.message }}</span>
                          </h6>
                          <p class="mb-0 text-xs text-secondary">
                            <i class="fa fa-clock me-1"></i>
                            {{ notification.createDate }}
                          </p>
                        </div>
                        <div class="my-auto ms-auto">
                          <button @click.stop="updateRead(notification, i)" class="btn btn-sm btn-outline-primary"
                            style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                            <i class="fa fa-check"></i>
                          </button>

                        </div>
                      </div>
                    </a>
                  </transition>
                </li>
              </transition-group>
            </ul>
          </li>

          <li class="nav-item d-flex align-items-center">
            <button v-if="userStore.isLoggedIn" @click="logout" class="px-0 nav-link font-weight-bold text-white"
              style="border: none; background-color: transparent;">
              <i class="fa fa-door-open" :class="isRTL ? 'ms-sm-2' : 'me-sm-2'"></i>
              <span class="d-sm-inline d-none" style="color: #121235">Logout</span>
            </button>
          </li>

          



        </ul>
      </div>
      
      <!-- <div class="input-group d-flex justify-content-center" style="
      padding: 1rem;
      justify-content: center;
      width: 50%;">
        <span class="input-group-text text-body">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
        <input type="text" class="form-control" :placeholder="isRTL ? 'أكتب هنا...' : 'Type here...'" />
      </div> -->
      <div class="d-flex align-items-center">
<!--        <right-top-clock />-->
      </div>

    </div>

  </nav>
</template>
<style scoped>
.navbar-main {
  margin-right: 0 !important;
  margin-left: 0 !important;
}
.notification-icon {
  position: relative;
  display: inline-block;
}

.notification-badge {
  position: absolute;
  top: 3px;
  right: -6px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0.2em 0.5em;
  font-size: 0.5em;
}

.profile-img-container {
  width: 20%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  position: relative;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.fa {
  color: #121235;
  transition: color 0.1s ease;
  font-size: 1.2rem;
}

.fa:hover {
  color: #5e5e71;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>