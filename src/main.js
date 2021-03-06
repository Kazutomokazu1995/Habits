import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import { initializeApp } from "firebase/app";

Vue.config.productionTip = false;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvOfLuNCpE6ExfMsvY14gTxHI1YmEyfEo",
  authDomain: "todo-e1130.firebaseapp.com",
  projectId: "todo-e1130",
  storageBucket: "todo-e1130.appspot.com",
  messagingSenderId: "556058688196",
  appId: "1:556058688196:web:661c2c42608d1613496791",
};

initializeApp(firebaseConfig);

new Vue({
  render: (h) => h(App),
  vuetify,
  store,
  router,
}).$mount("#app");
