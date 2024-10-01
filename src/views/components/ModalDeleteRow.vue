<template>
  <transition name="fade">
    <div class="modal-backdrop" v-show="isVisible">
      <div class="modal" tabindex="-1" role="dialog" v-show="isVisible" @click.self="closeModal">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ title }}</h5>
              <button type="button" class="close" @click="closeModal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="confirmAction">Delete</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Modal title',
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmAction() {
      this.$emit('confirm');
    }
  }
};
</script>

<style scoped>

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1040;
}

.modal-content {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.modal {
  display: block;
  z-index: 1050;
}
</style>
