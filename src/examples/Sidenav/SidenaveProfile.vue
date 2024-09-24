<template>
  <div>
    <router-link class="m-0 navbar-brand" to="/">
      <img :src="selectedItem.image || defaultImage" class="navbar-brand-img h-100" alt="profile_image" />

      <button @click="toggleDropdown" class="ms-2 font-weight-bold me-2 btn btn-primary">
        {{ selectedItem.name || "Argon Dashboard 2" }}
      </button>
    </router-link>

    <ul v-if="dropdownVisible" class="dropdown-menu">
      <li v-for="item in dropdownItems" :key="item.id">
        <a @click="selectItem(item)" class="dropdown-item">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dropdownVisible = ref(false);
const dropdownItems = ref([]);
const selectedItem = ref({});
const defaultImage = "@/assets/img/placeholder.png";

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const selectItem = (item) => {
  selectedItem.value = item;
  dropdownVisible.value = false;
};

const fetchDropdownItems = async () => {
  try {
    const response = await fetch("/api/your-endpoint");
    const data = await response.json();
    dropdownItems.value = data.items;
    selectedItem.value = data.items[0];
  } catch (error) {
    console.error("리스트를 가져오는 중 오류 발생:", error);
  }
};

fetchDropdownItems();
</script>
