import Vue from "vue";
import Router from "vue-router";
import Main from "./views/Main";
import Login from "./views/Login";
import Register from "./views/Register";
import CreateList from "./views/CreateList";
import Record from "./views/Record";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import store from "./store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/createList",
      name: "createList",
      component: CreateList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/record",
      name: "record",
      component: Record,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  let redirect = null;
  const auth = getAuth();

  if (to.query.redirect) {
    redirect = to.query.redirect;
  }
  try {
    // 現在ログインしているユーザーを取得する
    onAuthStateChanged(auth, (user) => {
      if (user) {
        store.commit("updateUid", user.uid);
        // リダイレクトが設定されていればリダイレクト先に
        if (redirect != null) {
          next(redirect);
          return;
        }
        if (to.name == "Login") {
          next({ name: Main });
        }
        next();
      } else {
        if (to.matched.some((record) => record.meta.requiresAuth)) {
          next({
            name: "Login",
            query: {
              redirect: to.fullPath,
            },
          });
        }
        next();
      }
    });
  } catch {
    //doNothing
  }
});

export default router;
