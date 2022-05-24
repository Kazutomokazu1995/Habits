<template>
  <v-app>
    <v-card width="600px" height="700px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">ログイン</h1>
      </v-card-title>
      <v-alert v-show="checkLogin" type="error">
        メールアドレスかパスワードが間違っております
      </v-alert>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account-circle"
          label="Email"
          v-model="email"
        />
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="パスワード"
          v-model="password"
        />
        <v-card-actions>
          <v-btn class="info" @click="login">ログイン</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn class="error" @click="loginGoogle"
            >Googleアカウントでログイン</v-btn
          >
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import router from "../router";

export default {
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      isLoginError: false,
    };
  },
  computed: {
    checkLogin() {
      return this.isLoginError;
    },
  },
  methods: {
    login() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          this.$store.commit("updateUid", userCredential.user.uid);
          //複数回呼ばれているため、エラーをもみ消す。
          router.push("/").catch(() => {});
        })
        .catch((error) => {
          this.isLoginError = true;
          console.log("LoginError:" + error);
        });
    },
    loginGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      console.log("click google\n");
      signInWithRedirect(auth, provider);
    },
  },
};
</script>
