import { getAuth , onAuthStateChanged, signOut } from "firebase/auth";

const state = {
  isAuthenticated: false,
  uid: ""
};
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  gettersUid: state => state.uid
};
const mutations = {
  updateIsAuthenticated(state, auth) {
    state.isAuthenticated = auth
  },
  updateUid(state, uid) {
    state.uid = uid
  }
};
const actions = {
  configAuthenticated({commit}) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        commit('updateIsAuthenticated', true);
        commit('updateUid', user.uid);
      } else {
        commit('updateIsAuthenticated', false);
      }
    });
  },
  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.$store.commit('updateIsAuthenticated', false);
    }).catch(() => {
      console.log('失敗');
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};