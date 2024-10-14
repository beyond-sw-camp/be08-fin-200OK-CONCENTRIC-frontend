<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Sidenav from "./views/Sidenav/SidenavIndex.vue";
import Configurator from "@/views/PageCustom/Configurator.vue";
import Navbar from "@/views/Navbar/Navbar.vue";
import {VueperSlides, VueperSlide} from "vueperslides";
import AppFooter from "@/examples/FooterExample.vue";
import ActiveUsersChart from "@/components/Charts/ActiveUsersChart.vue";
import GradientLineChart from "@/components/Charts/GradientLineChart.vue";
import ArgonAlert from "@/components/ArgonComponents/ArgonAlert.vue";
import ArgonAvatar from "@/components/ArgonComponents/ArgonAvatar.vue";
import ArgonPagination from "@/components/ArgonComponents/ArgonPagination.vue";
import FooterExample from "@/examples/FooterExample.vue";
import Footer from "@/examples/FooterExample2.vue";
import FooterExample2 from "@/examples/FooterExample2.vue";
import Globe from "@/examples/Globe.vue";

import { useStateStore } from "@/store/states";
import Social from "@/views/PageCustom/Social.vue";

const store = useStore();
const isNavFixed = computed(() => store.state.isNavFixed);
const darkMode = computed(() => store.state.darkMode);
const isAbsolute = computed(() => store.state.isAbsolute);
const showSidenav = computed(() => store.state.showSidenav);
const layout = computed(() => store.state.layout);
const showNavbar = computed(() => store.state.showNavbar);
const showFooter = computed(() => store.state.showFooter);
const showConfig = computed(() => store.state.showConfig);
const hideConfigButton = computed(() => store.state.hideConfigButton);
const toggleConfigurator = () => store.commit("toggleConfigurator");

const navClasses = computed(() => {
  return {
    "position-sticky bg-white left-auto top-2 z-index-sticky":
      isNavFixed.value && !darkMode.value,
    "position-sticky bg-default left-auto top-2 z-index-sticky":
      isNavFixed.value && darkMode.value,
    "position-absolute px-4 mx-0 w-100 z-index-2": isAbsolute.value,
    "px-0 mx-4": !isAbsolute.value,
  };
});

const stateStore = useStateStore();

</script>
<template>
  <div>

  </div>
  <div
    v-show="layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>

  <sidenav v-if="showSidenav" />
  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >

    <navbar :class="[navClasses]" v-if="showNavbar" />

<router-view/>

    <app-footer v-show="showFooter" />

    <configurator
      :toggle="toggleConfigurator"
      :class="[showConfig ? 'show' : '', hideConfigButton ? 'd-none' : '']"
    />

  </main>
</template>
