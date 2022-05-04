import Vue from 'vue';
import vuex from 'vuex';
import authenticate from "./modules/authenticate";
import tasklist from "./modules/tasklist";
import createPersistedState from "vuex-persistedstate";

Vue.use(vuex);

export default new vuex.Store({
  modules: {
    authenticate,
    tasklist
  },
  plugins: [createPersistedState()] //リロードしてもデータが消えないためのplugin
});