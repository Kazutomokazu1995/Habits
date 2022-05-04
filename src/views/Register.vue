<template>
  <v-app>
    <v-card width="600px" height="700px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">登録</h1>
      </v-card-title>
      <v-alert v-show="checkRegisterError" type="error">
        登録に失敗しました。既に登録済みの可能性があります。
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
          <v-btn class="info" @click="register">登録</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      isRegisterError: false,
    };
  },
  computed: {
    checkRegisterError() {
      return this.isRegisterError;
    },
  },
  methods: {
    register() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          this.$store.commit("updateIsAuthenticated", true);
        })
        .catch(() => {
          this.isRegisterError = true;
          console.log("登録失敗!");
        });
    },
  },
};
</script>
