<template>
  <transition name="fade">
    <ul v-show="visible" class="dropdown-menu"
        :style="{ position: 'absolute', zIndex: 9999 }">
      <li v-for="item in items" :key="item.id">
        <a href="#" class="dropdown-item" @click="handleSelect(item)">
          {{ item.name }}
        </a>
      </li>
    </ul>
  </transition>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const {items, visible} = toRefs(props);
const emit = defineEmits(['select', 'toggle']);

const handleSelect = (item) => {
  emit('select', item);  // 부모로 아이템을 전달
  emit('toggle');        // 드롭다운을 닫기 위해 toggle 이벤트 발생
};
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>