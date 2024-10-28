<script setup>
import { useStore } from "vuex";
const store = useStore();
</script>
<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 text-center mb-2">
          <div
            class="text-sm text-center copyright text-muted"
          >
            ©© 2024 200.ok | Project: CONCENTRIC
            All rights reserved.
          </div>
        </div>
        <div class="col-12 text-center">
          <ul
            class="nav nav-footer justify-content-center"
          >
            <li class="nav-item">
              <a
                href="#"
                class="nav-link text-muted"
                target="_blank"
                >About Us</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://github.com/beyond-sw-camp/be08-fin-200OK-CONCENTRIC-frontend.git"
                class="nav-link text-muted"
                target="_blank"
                >GitHub</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://www.creative-tim.com/license"
                class="nav-link pe-0 text-muted"
                target="_blank"
                >License</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
