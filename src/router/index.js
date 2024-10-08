import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Mainpage/Tables.vue";
import Billing from "../etc/Billing.vue";
import VirtualReality from "../etc/VirtualReality.vue";
import RTL from "../etc/Rtl.vue";
import Profile from "../views/Profile/Profile.vue";
import Signup from "../views/Sign/Signup.vue";
import Signin from "../views/Sign/Signin.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/tables",
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
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
