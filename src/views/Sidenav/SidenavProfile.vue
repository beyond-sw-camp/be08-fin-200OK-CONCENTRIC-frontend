<template>
  <div>
    <router-link class="m-0 navbar-brand d-flex align-items-center" to="/tables">
      <img :src="selectedItem.image || defaultImage" class="navbar-brand-img w-25 ms-5" alt="profile_image" />

<!--      <button @click="toggleDropdown" class="ms-2 font-weight-bold me-2 btn btn-primary">-->
<!--        {{ selectedItem.name || "Personal Page" }}-->
<!--      </button>-->
      <a
          href="#"
          class="p-0 dropdown-hover ms-4"
          :class="[showMenu ? 'show' : '']"
          id="dropdownMenuButton"
          aria-expanded="true"
          @click="toggleMenu"
      >
      {{ selectedItem.name || "Personal Page" }}
        <img :src="require('@/assets/img/icons/expand_more_40dp_000000.png')" class="navbar-brand-img w-25" alt="profile_image" />
        <DropdownItems class="text-black" :items="dropdownItems" :visible="showMenu" @select="selectItem" @toggle="toggleMenu" />
      </a>


    </router-link>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import DropdownItems from "@/views/Sidenav/DropdownItems.vue";
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
const dropdownItems = [
  { id: 1, name: 'Test Item 1', image: require('@/assets/img/sample_images/371754@2x.png') },
  { id: 2, name: 'Test Item 2', image: require('@/assets/img/sample_images/371759@2x.png') },
  { id: 3, name: 'Test Item 3', image: require('@/assets/img/sample_images/371772@2x.png') },
];
const showMenu = ref(false);

// 첫번쨰 항목 기본 선택
const selectedItem = ref(dropdownItems[0]);
const defaultImage = require("@/assets/img/애옹.png");

// 폰트 사이즈 정적으로 설정하는 코드 사용시 import에 computed 추가 필요
// const fontSizeBasedOnWidth = computed(() => {
//   const baseFontSize = 1; // 기본 폰트 크기 (vw 단위로 설정)
//   return `${baseFontSize}vw`; // 폰트 크기를 'vw' 단위로 설정
// });



const selectItem = (item) => {
  selectedItem.value = item;
  showMenu.value = false;
};

</script>
