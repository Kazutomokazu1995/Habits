<template>
  <v-app>
    <div class="loading" v-show="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <v-card width="600px" class="mx-auto mt-5 test">
      <div class="loading" v-show="!loading">
        <ListOperation :yetTasks="yetTasks" :allTasks="allTasks" />
      </div>
    </v-card>
  </v-app>
</template>

<script>
import router from "../router";
import ListOperation from "./ListOperation.vue";

export default {
  created() {
    this.$store.dispatch("configAuthenticated");
    this.readDB();
  },
  components: {
    ListOperation,
  },
  data() {
    return {
      yetTasks: [],
      allTasks: [],
      loading: true,
      mustUpdateDB: true,
    };
  },
  methods: {
    initialize() {
      this.readDB();
    },
    readDB() {
      var count = 0;
      const intervalId = setInterval(() => {
        this.posts = [];
        if (this.$store.getters.gettersUid != "") {
          try {
            this.$store.dispatch("getCompletionTask").then(() => {
              this.loading = false;
              this.yetTasks = this.$store.getters.yetTaskList.slice();
              this.allTasks = this.$store.getters.tasklist.slice();
            });
            this.mustUpdateDB = false;
            clearInterval(intervalId);
          } catch {
            count++;
          }
        }
        if (count > 10) {
          router.push("/login");
          this.$store.commit("updateUid", "");
          clearInterval(intervalId);
        }
        count++;
      });
    },
  },
};
</script>

<style scoped>
.loading {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
