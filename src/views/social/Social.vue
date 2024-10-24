<script setup>
import FriendRequest from "@/views/social/FriendRequest.vue";
import FriendList from "@/views/social/FriendList.vue";
import AddFriend from "@/views/social/AddFriend.vue";
import { ref } from "vue";

const selectedTab = ref('list');
</script>

<template>
  <nav class="nav-tabs">
    <ul class="nav">
      <li class="nav-item">
        <a
            class="nav-link"
            :class="{ active: selectedTab === 'list' }"
            href="#"
            @click.prevent="selectedTab = 'list'"
        >
          친구 목록
        </a>
      </li>
      <li class="nav-item">
        <a
            class="nav-link"
            :class="{ active: selectedTab === 'requests' }"
            href="#"
            @click.prevent="selectedTab = 'requests'"
        >
          친구 요청
        </a>
      </li>
      <li class="nav-item">
        <a
            class="nav-link"
            :class="{ active: selectedTab === 'add' }"
            href="#"
            @click.prevent="selectedTab = 'add'"
        >
          친구 추가
        </a>
      </li>
    </ul>
  </nav>
  <div>
    <friend-list v-if="selectedTab === 'list'"/>
    <friend-request v-if="selectedTab === 'requests'"/>
    <add-friend v-if="selectedTab === 'add'"/>
  </div>
</template>

<style scoped>
.nav {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-right: 20px;
}

.nav-link {
  text-decoration: none;
  color: #007bff;
  padding: 10px 20px;
}

.nav-link.active {
  font-weight: bold;
  color: #0056b3;
  border-bottom: 2px solid #007bff;
}

</style>