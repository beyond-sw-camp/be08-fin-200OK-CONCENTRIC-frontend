<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Breadcrumbs from "../../examples/Breadcrumbs.vue";
import SidenavProfile from "@/views/sidenav/SidenavProfile.vue";

import { useUserStore } from "@/store/user.js";
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStateStore } from "@/store/states";
import RightTopClock from "@/views/navbar/RightTopClock.vue";
const showMenu = ref(false);
const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const route = useRoute();
const userStore = useUserStore();
const router = useRouter();
const stateStore = useStateStore();
const notifications = ref();
const numOfNotifications = ref(0);
const friendshipRequests = ref();
const numOfFriendshipRequests = ref(0);
const profileImage = ref();
const currentRouteName = computed(() => {
  return route.name;
});
const currentDirectory = computed(() => {
  let dir = route.path.split("/")[1];
  return dir.charAt(0).toUpperCase() + dir.slice(1);
});
const minimizeSidebar = () => store.commit("sidebarMinimize");
const toggleConfigurator = () => store.commit("toggleConfigurator");
const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};
const toggleDropdown = () => {
  showMenu.value = true;
}
const logout = async () => {
  try{
    const response = await axios.post(
      'member/logout',
      null,
      {
        validateStatus: false,
      }
    );

    if(response.status === 200 || response.status === 400 || response.status === 401){
      userStore.clearUser();
      // axios.defaults.headers.common['Authorization'] = null;
      localStorage.removeItem("user");
      router.push("/");
    }

  }catch(err){
    console.log(err);
  }

  // if(response.headers.authorization !== undefined){
  //   axios.defaults.headers.common['Authorization'] = response.headers.authorization;
  //   userStore.updateToken(response.headers.authorization);
  //   console.log(response.headers.authorization);
  // }
}
const loadNotifications = async () => {
  try {
    const response = await axios.get('/notification/list/read',
        {validateStatus: false}
    );
    notifications.value = response.data;
    notifications.value.forEach(notification => {
      notification.createDate = new Date(notification['createDate']).toLocaleString().substring(0, 22);
      if (!notification.isRead) numOfNotifications.value += 1;
    });
  } catch (error) {
    console.log(error);
  }
}
const updateRead = (notification) => {
  notification.isRead = !notification.isRead;
  if(notification.isRead) numOfNotifications.value -= 1;
  else numOfNotifications.value += 1;
  updateReadApi(notification);
}
const updateReadApi = async (notification) => {
  try {
    const response = await axios.put(`/notification/read/${notification.id}`);
  } catch(err){
    console.log(err);
  }
}
const loadFriendshipRequest = async () => {
  try {
    const response = await axios.get('/friendship/request/list',
        {validateStatus: false}
    );
    friendshipRequests.value = response.data;
    numOfFriendshipRequests.value = friendshipRequests.value.length;
  } catch (error) {
    console.log(error);
  }
}
const checkLogin = () => {
  console.log("checkLogin");
  console.log(userStore.isLoggedIn);
  if(userStore.isLoggedIn === undefined || userStore.isLoggedIn === false) {
    router.push("/");
    return false;
  }
  return true;
}
const getProfileImage = async () => {
  try {
    const path = userStore.userInfo['imageUrl'];
    const response = await axios.post(`storage/image/profile`,
        null,
        {
          params: {
            path: path,
          },
          responseType: 'blob',
        });
    console.log(response.data);
    profileImage.value = URL.createObjectURL(response.data);
  } catch (error) {
    console.error(error);
  }
}
const gotoProfile = () => {
  router.push("/profile");
}

onMounted(() => {
  if(!checkLogin()) return;
  loadNotifications();
  loadFriendshipRequest();
  getProfileImage();
});
</script>

<template>
  <nav
    class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div class="px-3 py-1 ms-0 d-flex align-items-center justify-content-between" style="padding-left: 0; width: 100%; display: flex">
      <div>
        <a
            href="#"
            @click="minimizeSidebar"
            class="p-0 nav-link text-white"
            id="iconNavbarSidenav"
        >
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line bg-white"></i>
            <i class="sidenav-toggler-line bg-white"></i>
            <i class="sidenav-toggler-line bg-white"></i>
          </div>
        </a>
      </div>
      <div>
        <sidenav-profile/>
      </div>
      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        id="navbar"
      >

        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <button v-if="userStore.isLoggedIn"
              @click="logout"
              class="px-0 nav-link font-weight-bold text-white"
              style="border: none; background-color: transparent;"
            >
              <i class="fa fa-door-open" :class="isRTL ? 'ms-sm-2' : 'me-sm-2'"></i>
              <span class="d-sm-inline d-none">Logout</span>
            </button>
          </li>

          <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link text-white" @click="toggleConfigurator">
              <i class="cursor-pointer fa fa-cog fixed-plugin-button-nav"></i>
            </a>
          </li>
          <li
            class="nav-item dropdown d-flex align-items-center"
          >
            <a
              href="#"
              class="p-0 nav-link text-white"
              :class="[showMenu ? 'show' : '']"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="toggleDropdown"
            >
              <i class="cursor-pointer fa fa-bell"></i>
              <span class="notification-badge" v-show="numOfNotifications > 0">{{ numOfNotifications }}</span>
            </a>
            <ul
              class="px-2 py-3 dropdown-menu dropdown-menu-end me-n4"
              :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
              <li class="mb-2" v-for="notification in notifications" :key="notification.id"

                  @blur="closeMenu"
              >
                <a class="dropdown-item border-radius-md" href="javascript:;"
                   :class="{ 'bg-light': notification.isRead }"
                >
                  <div class="py-1 d-flex">
                    <div class="my-auto">
                      <img
                        src="../../assets/img/koongya.png"
                        class="avatar avatar-sm me-3"
                        alt="user image"
                      />
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
                    <div class="my-auto ms-auto" >
                      <button @click.stop="updateRead(notification)"
                              class="btn btn-sm btn-outline-primary"
                              style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                        {{ notification.isRead ? '읽음' : '안 읽음' }}
                      </button>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item d-flex align-items-center position-relative" style="margin-left: 15px;">
            <a
                href="/profile"
                class="p-0 nav-link text-white"
                aria-expanded="false"
                style="border: none; background-color: transparent;"
            >
              <i class="fa fa-user"></i>
              <span class="notification-badge" v-show="numOfFriendshipRequests > 0">{{ numOfFriendshipRequests }}</span>
            </a>
          </li>
          <li class="nav-item d-flex align-items-center position-relative" style="margin-left: 15px;">
            <a
                href="/social"
                class="p-0 nav-link text-white"
                @click="stateStore.toggleSocial"
                aria-expanded="false"
                style="border: none; background-color: transparent;"
            >
              <i class="fa fa-users"></i>
              <span class="notification-badge" v-show="numOfFriendshipRequests > 0">{{ numOfFriendshipRequests }}</span>
            </a>
          </li>
          <li class="nav-item d-flex align-items-center position-relative" style="margin-left: 15px;">
            <a
                href="/storage/private"
                class="p-0 nav-link text-white"
                aria-expanded="false"
                style="border: none; background-color: transparent;"
            >
              <i class="fa fa-archive"></i>
              <span class="notification-badge" v-show="numOfFriendshipRequests > 0">{{ numOfFriendshipRequests }}</span>
            </a>
          </li>
        </ul>

      </div>
      <div class="input-group d-flex justify-content-center"
      style="
      padding: 1rem;
      justify-content: center;
      width: 50%;"
      >
        <span class="input-group-text text-body">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
        <input
            type="text"
            class="form-control"
            :placeholder="isRTL ? 'أكتب هنا...' : 'Type here...'"
        />
      </div>
      <div
          class="pe-md-5 d-flex align-items-center"
      >
        <a href="javascript:;" @click="gotoProfile" class="profile-img-container">
          <img
              :src="profileImage"
              class="profile-img rounded-circle img-fluid border border-2 border-white"
              alt="Profile"
          />
        </a>
      </div>
      <div class="d-flex align-items-center">
            <right-top-clock/>
      </div>

    </div>

  </nav>
</template>
<style scoped>
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
  .navbar{
    //background-color: #1a2035;
  }
</style>