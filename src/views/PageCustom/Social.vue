<script setup>
import { computed, onMounted, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { activateDarkMode, deactivateDarkMode } from "@/assets/js/dark-mode";
import { useStateStore } from "@/store/states";
defineProps({
  icon: {
    type: [String, Object],
    required: true,
    component: {
      type: String,
    },
    background: {
      type: String,
    },
    default: () => ({
      background: "bg-gradient-success",
    }),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Number],
    default: "",
  },
});
const stateStore = useStateStore();

const handleClickOutside = (event) => {
  const socialWindow = document.getElementById("social-window");
  if(socialWindow && !socialWindow.contains(event.target)) {
    stateStore.toggleSocial();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeMount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div class="fixed-plugin" id="social-window">
    <div class="p-3 mx-4 text-center card-header d-flex justify-content-center">
      <div
          :class="`icon icon-shape icon-lg shadow text-center border-radius-lg ${icon.background}`"
      >
        <i
            class="opacity-10"
            :class="typeof icon === 'string' ? icon : icon.component"
            aria-hidden="true"
        ></i>
      </div>
    </div>
    <div class="p-3 pt-0 text-center card-body">
      <h6 class="mb-0 text-center">{{ title }}</h6>
      <span class="text-xs">{{ description }}</span>
      <hr class="my-3 horizontal dark" />
      <h5 class="mb-0">{{ value }}</h5>
    </div>
  </div>
</template>
