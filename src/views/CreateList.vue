<template>
  <div id="app">
    <v-app id="inspire">
      <v-card width="600px" class="mx-auto mt-5 test">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="title"
            :rules="titleRules"
            :counter="10"
            label="Title"
            required
          ></v-text-field>
          <v-textarea
            v-model="subTitle"
            name="subTitle"
            label="SubTitle"
            :counter="10"
          ></v-textarea>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="目標期間"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-select
            v-model="prioritySelect"
            :items="priority"
            label="優先度"
          ></v-select>
          <v-btn class="info" @click="create">作成</v-btn>
        </v-form>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import router from "../router";

export default {
  data() {
    return {
      title: "",
      subTitle: "",
      valid: true,
      date: "",
      startDate: "",
      menu: false,
      listId: "",
      titleRules: [(v) => !!v || "入力必須です。"],
      priority: ["低", "中", "高"],
      prioritySelect: "低",
    };
  },
  created() {
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    this.startDate = y + "-" + m + "-" + d;
  },
  computed: {
    isCreateError() {
      return this.createError;
    },
  },
  methods: {
    create() {
      this.$refs.form.validate();
      if (this.title !== "") {
        this.postTodoList();
        router.push("/");
      } else {
        this.createError = true;
      }
    },
    priorityNum(strPri) {
      if (strPri === "低") {
        return 1;
      } else if (strPri === "中") {
        return 2;
      } else {
        return 3;
      }
    },
    createIdDate() {
      var date1 = new Date();
      const idDate =
        date1.getFullYear() +
        ("00" + (date1.getMonth() + 1)).slice(-2) +
        ("00" + date1.getDate()).slice(-2) +
        ("00" + date1.getHours()).slice(-2) +
        ("00" + date1.getMinutes()).slice(-2) +
        ("00" + date1.getSeconds()).slice(-2) +
        date1.getMilliseconds();
      return idDate;
    },
    postTodoList() {
      var prinum = this.priorityNum(this.prioritySelect);
      var idData = this.createIdDate();
      this.$store.dispatch("postTodoList", {
        prinum: prinum,
        idData: idData,
        title: this.title,
        subTitle: this.subTitle,
        date: this.date,
        startDate: this.startDate,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.test {
  padding: 10px;
}
.fontcolor {
  color: #949494;
}
</style>
