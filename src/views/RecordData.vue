<template>
  <table>
    <tr>
      <th>継続日数</th>
      <td>{{ runningDays }}日</td>
    </tr>
    <tr>
      <th>未完了連続日数</th>
      <td>{{ notRunnningDays }}日</td>
    </tr>
    <tr>
      <th>{{ thisMonth }}月の完了日数</th>
      <td>{{ monthCompletionDays }}日</td>
    </tr>
    <tr>
      <th>{{ thisMonth }}月の達成率</th>
      <td>{{ AchievementRate }}%</td>
    </tr>
  </table>
</template>

<script>
export default {
  data() {
    return {
      selectCompletionTaskDatas: [],
      taskList: [],
      runningDays: 0,
      notRunnningDays: 3,
      monthCompletionDays: 0,
      AchievementRate: 60,
      toDayDate: "",
      thisMonth: "",
      thisYear: "",
      lastDate: "",
    };
  },
  props: ["selectedTaskIdDate"],
  created() {
    try {
      this.$store
        .dispatch("getCompletionTaskData", this.selectedTaskIdDate)
        .then(() => {
          this.selectCompletionTaskDatas =
            this.$store.getters.selectCompletionDate.slice();
          this.getmonthCompletionDays();
          console.log(this.selectCompletionTaskDatas);
        });
    } catch {
      console.log("Faild Firebase");
    }
  },
  methods: {
    //親コンポーネントに以降予定
    getDate() {
      var dt = new Date();
      var y = dt.getFullYear();
      var m = ("00" + (dt.getMonth() + 1)).slice(-2);
      var d = ("00" + dt.getDate()).slice(-2);
      this.toDayDate = y + m + d;
      this.lastDate = new Date(y, m, 0).getDate();
    },
    getAchievementRate() {
      this.AchievementRate = Math.floor(
        (this.monthCompletionDays / this.lastDate) * 100
      );
    },
    getmonthCompletionDays() {
      this.getDate();
      this.runningDays = 0;
      this.monthCompletionDays = 0;
      console.log(this.selectCompletionTaskDatas);
      this.selectCompletionTaskDatas.forEach((data) => {
        if (Object.values(data)[0] == true) {
          this.runningDays++;
          var dateData = this.toDayDate.toString().slice(0, 6); //本日の年 + 月
          if (Object.keys(data)[0].indexOf(dateData) != -1) {
            this.monthCompletionDays++;
            this.getAchievementRate();
          }
        }
      });
    },
    sleep(waitMsec) {
      var startMsec = new Date();
      // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
      while (new Date() - startMsec < waitMsec);
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table tr {
  border-bottom: solid 2px white;
}

table tr:last-child {
  border-bottom: none;
}

table th {
  position: relative;
  text-align: left;
  width: 30%;
  background-color: #52c2d0;
  color: white;
  text-align: center;
  padding: 10px 0;
}

table th:after {
  display: block;
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  top: calc(50% - 10px);
  right: -10px;
  border-left: 10px solid #52c2d0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}

table td {
  text-align: left;
  width: 70%;
  text-align: center;
  background-color: #eee;
  padding: 10px 0;
}
</style>
