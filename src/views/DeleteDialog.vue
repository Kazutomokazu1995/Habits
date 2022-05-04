<template>
  <div id="app">
    <v-app id="inspire">
      <v-row justify="space-around">
        <v-col cols="auto">
          <v-dialog
            transition="dialog-top-transition"
            max-width="600"
            v-model="dipDeleteDialogComp"
          >
            <v-card>
              <v-toolbar color="primary" dark>削除</v-toolbar>
              <v-card-text>
                <div class="text-h4 pa-4">「{{ title }}」を削除しますか？</div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn class="info" @click="closeClick">Close</v-btn>
                <v-btn class="error" @click="okClick">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-app>
  </div>
</template>

<script>
export default {
  props: ["dipDeleteDialog", "idData", "title"],
  data() {
    return {
      test: true,
    };
  },
  methods: {
    closeClick() {
      this.$emit("result");
    },
    okClick() {
      this.$emit("result");
      this.$store.dispatch("deleteList", { idData: this.idData });
    },
  },
  computed: {
    dipDeleteDialogComp: {
      get() {
        return this.dipDeleteDialog;
      },
      set(newValue) {
        if (this.dipDeleteDialog != newValue) return this.$emit("result");
      },
    },
  },
};
</script>
