<template>
  <div class="windowDesign">
    <h1>リストがありません。</h1>
    <div>下記のボタンからリストを作成して下さい</div>
    <v-btn class="info" @click="createWindow">作成する</v-btn>
  </div>
</template>

<script>
import router from "../router";
export default {
  methods: {
    createWindow() {
      router.push("createList");
    },
  },
};
</script>
