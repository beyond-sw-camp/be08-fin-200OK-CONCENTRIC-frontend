<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="btn btn-sm dropdown-toggle mb-0 shadow-blur" type="button">
      {{ selected || 'Select' }}
    </button>
    <div v-if="isOpen" class="dropdown-menu show">
      <div
          class="dropdown-item"
          v-for="option in options"
          :key="option"
          @click="selectColumn(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options'],
  data() {
    return {
      isOpen: false,
      selected: ''
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectColumn(option) {
      this.selected = option;
      this.$emit('columnSelected', option);
      this.isOpen = false; // 드롭다운 닫기
    }
  }
};
</script>

