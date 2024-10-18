<script setup>

import ArgonInput from "@/components/ArgonComponents/ArgonInput.vue";
</script>

<template>
  <div class="col-md-12">
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
</template>

<style scoped>

</style>