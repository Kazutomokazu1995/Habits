<template>
  <v-menu
    v-model="selectedOpenComp"
    :close-on-content-click="false"
    :activator="selectedElement"
    offset-x
  >
    <v-card color="grey lighten-4" min-width="350px" flat>
      <!-- <v-toolbar
      :color="selectedEvent.color"
      dark
      > -->
      <v-toolbar color="blue darken-1" dark>
        <v-toolbar-title class="DateDesign">{{ selectedDate }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <div v-if="isCompDate">タスク完了を取り消しますか？</div>
        <div v-else>タスクを完了にしますか？</div>
        <!-- <span v-html="selectedEvent.details"></span> -->
      </v-card-text>
      <v-card-actions>
        <!--$emitで対応する。(警告が出ているため)-->
        <v-layout wrap>
          <v-flex xs12 sm6 md4 text-center my-5>
            <v-btn text @click="closeUpdateCompletionCancel" class="error">
              Cancel
            </v-btn>
          </v-flex>
          <v-flex xs10 sm6 md4 text-center my-5>
            <v-btn text @click="closeUpdateCompletionOK" class="info">
              OK
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  props: [
    "selectedOpen",
    "selectedElement",
    "selectedDate",
    "events",
    "isCompDate",
    "selectIDData",
    "componentKey",
  ],
  computed: {
    selectedOpenComp: {
      get() {
        return this.selectedOpen;
      },
      set(newselectedOpen) {
        if (!this.selectedOpen) {
          this.$emit("callOpen");
          return;
        }
        if (this.selectedOpen != newselectedOpen && this.selectedOpen) {
          this.$emit("resCloseUpdateComp");
          return;
        }
      },
    },
  },
  methods: {
    closeUpdateCompletionCancel() {
      this.$emit("resCloseUpdateComp");
    },
    closeUpdateCompletionOK() {
      if (this.isCompDate) {
        this.$store.dispatch("updateDeleteCompletionTask", {
          idData: this.selectIDData,
          date: this.selectedDate,
        });
        this.$emit("isTrue", false); //isTrueの名称は変更すること！
      } else {
        this.$store.dispatch("updateTrueCompletionTask", {
          idData: this.selectIDData,
          date: this.selectedDate,
        });
        this.$emit("isTrue", true); //isTrueの名称は変更すること！
      }
      // this.componentKey += 1;
      this.$emit("resCloseUpdateComp");
    },
  },
};
</script>

<style scoped>
.DateDesign {
  font-weight: 600;
}
</style>
