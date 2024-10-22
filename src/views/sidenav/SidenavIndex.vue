<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import SidenavList from "./SidenavList.vue";
import SidenavProfile from "@/views/sidenav/SidenavProfile.vue";
// import logo from "@/assets/img/logo-ct-dark.png";
// import logoWhite from "@/assets/img/logo-ct.png";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
const darkMode = computed(() => store.state.darkMode);
</script>
<template>
  <div
    v-show="layout === 'default'"
    class="vh-100 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-success-soft'}`"
  />

  <aside
    class="my-3 overflow-hidden border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'}
      ${
        layout === 'landing' ? 'bg-transparent shadow-none' : ' '
      } ${sidebarType}`"
    id="sidenav-main"
    style="width: 20%;"
  >
    <sidenav-list />
  </aside>
</template>
