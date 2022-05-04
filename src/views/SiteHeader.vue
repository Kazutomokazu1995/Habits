<template>
  <div>
    <v-app-bar color="blue darken-1">
      <v-toolbar-title @click="main" class="title">Habits</v-toolbar-title>
      <div class="flex-grow-1"></div>
      <template v-if="isAuthenticated">
        <!-- 作成 -->
        <v-btn icon @click="create">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <!--記録-->
        <v-btn icon @click="record">
          <v-icon>mdi-calendar-check-outline</v-icon>
        </v-btn>
        <!-- logout -->
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
      <template v-if="!isAuthenticated">
        <v-btn icon @click="login">
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <v-btn icon @click="register">
          <v-icon>mdi-account-plus-outline</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import router from "../router";
export default {
  created() {
    //修正の必要あり
    this.$store.dispatch("configAuthenticated");
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    create() {
      router.push("createList");
    },
    main() {
      router.push("/");
    },
    login() {
      router.push("/login");
    },
    register() {
      router.push("/register");
    },
    record() {
      router.push("/record");
    },
  },
};
</script>

<style scoped>
i.v-icon.v-icon {
  color: #fff;
  font-size: 30px;
}
.title {
  color: #fff;
  cursor: pointer;
  font-size: 40px !important;
}
</style>
