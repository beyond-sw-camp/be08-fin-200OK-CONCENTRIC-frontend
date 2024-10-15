<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ProfileCard from "../components/ProfileCard.vue";
import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
import ArgonButton from "@/components/ArgonComponents/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
});
onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});
onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
</script>
<template>
  <main>
    <nav class="navbar navbar-expand-lg bg-body-tertiary" style="box-shadow: none;">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">SSUELILL</a></li>
                <li><a class="dropdown-item" href="#">UPGIN</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">HALGUGATUNDE</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="py-4 container-fluid">
      <div class="row">

        <div class="col-md-4">
          <profile-card />
        </div>

        <div class="col-md-8">
          <div class="card" style="box-shadow: none;">
            <div class="card-body">
              <p class="text-uppercase text-sm">User Information</p>
              <div class="row">
                <div class="col-12">
                  <label for="example-text-input" class="form-control-label">Username</label>
                  <argon-input type="text" value="lucky.jesse" />
                </div>
                <div class="col-12">
                  <label for="example-text-input" class="form-control-label">Email address</label>
                  <argon-input type="email" value="jesse@example.com" />
                </div>
                <div class="col-12">
                  <label for="example-text-input" class="form-control-label">Phone Number</label>
                  <argon-input type="email" value="+82-10-0000-0000" />
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">Contact Information</p>
              <div class="row">
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label">Address</label>
                  <argon-input
                      type="text"
                      value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                  />
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label">City</label>
                  <argon-input type="text" value="New York" />
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label">Country</label>
                  <argon-input type="text" value="United States" />
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label">Postal code</label>
                  <argon-input type="text" value="437300" />
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">About me</p>
              <div class="row">
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label">About me</label>
                  <argon-input
                      type="text"
                      value="A beautiful Dashboard for Bootstrap 5. It is Free and Open Source."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>