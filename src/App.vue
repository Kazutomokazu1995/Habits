<template>
  <v-app id="inspire">
    <SiteHeader />
    <v-container>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
import SiteHeader from "./views/SiteHeader.vue";
export default {
  components: {
    SiteHeader,
  },
};
</script>
