import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/mainpage/Tables.vue";
import Billing from "../etc/Billing.vue";
import VirtualReality from "../etc/VirtualReality.vue";
import RTL from "../etc/Rtl.vue";
import Profile from "../views/profile/Profile.vue";
import Signin from "../views/sign/Signin.vue";
import ChatView from "../views/chat/ChatView.vue";
import Social from "@/views/social/FriendList.vue";
import PrivateStorage from "@/views/storage/PrivateStorage.vue";
import ProfileEdit from "@/views/profile/ProfileEdit.vue";
import TeamPage from "../views/team/TeamPage.vue";



const routes = [
  {
    path: "/",
    name: "Login",
    redirect: "/signin",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatView,
  },
  {
    path: "/social",
    name: "Social",
    component: Social,
  },
  {
    path: "/storage/private",
    name: "PrivateStorage",
    component: PrivateStorage,
  },
  {
    path: "/profile/edit",
    name: "ProfileEdit",
    component: ProfileEdit,
  },
  {
    path: "/team/:id",
    name: "Team",
    component: TeamPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user")) || false;
  const isLoggedIn = user.state?.isLoggedIn || false;

  if(to.path !== "/signin" && !isLoggedIn){
    next("/signin");
  }else{
    next();
  }
});

export default router;
