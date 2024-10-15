import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Mainpage/Tables.vue";
import Billing from "../etc/Billing.vue";
import VirtualReality from "../etc/VirtualReality.vue";
import RTL from "../etc/Rtl.vue";
import Profile from "../views/Profile/Profile.vue";
import Signin from "../views/Sign/Signin.vue";
import ChatView from "../views/Chat/ChatView.vue";
import Social from "@/views/social/Social.vue";
import PrivateStorage from "@/views/storage/PrivateStorage.vue";



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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
