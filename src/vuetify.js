import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        background: "#f5f5f5",
      },
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
