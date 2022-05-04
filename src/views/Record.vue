<template>
  <v-row class="fill-height">
    <DeleteDialog
      :dipDeleteDialog="dipDeleteDialog"
      :idData="selectedTaskIdDate"
      :title="selectedTaskTitle"
      @result="dialogResponce"
    />
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <!-- Todayボタン -->
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <!-- 前へ -->
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <!-- 次へ -->
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <!-- 日付 -->
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <!-- <v-spacer></v-spacer> -->
          <!-- MONTHボタン -->
          <v-toolbar-title>
            {{ getSubTitle }}
            <!--表示されない-->
          </v-toolbar-title>
          <v-menu bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ selectedTaskTitle }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in taskList" :key="index">
                <v-list-item-title @click="selectTaskTitle(item.idDate)">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn class="error" @click="deleteList">削除</v-btn>
        </v-toolbar>
      </v-sheet>
      <!-- 以下カレンダー -->
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:date="showDate"
          @change="updateRange"
        ></v-calendar>
        <div :key="componentKey">
          <RecordData :selectedTaskIdDate="selectedTaskIdDate" />
        </div>
      </v-sheet>
      <UpdateCompletionDay
        :selectedOpen="selectedOpen"
        :selectedElement="selectedElement"
        :selectedDate="selectedDate"
        :isCompDate="isCompDate"
        :selectIDData="selectedTaskIdDate"
        @callOpen="callOpenMethod"
        @resCloseUpdateComp="resCloseUpdateCompMethod"
        @isTrue="updateIsTrue = $event"
      />
    </v-col>
  </v-row>
</template>

<script>
import DeleteDialog from "./DeleteDialog.vue";
import UpdateCompletionDay from "./UpdateCompletionDay.vue";
import RecordData from "./RecordData.vue";

export default {
  components: {
    DeleteDialog,
    UpdateCompletionDay,
    RecordData,
  },
  data() {
    return {
      componentKey: 0,
      taskList: [],
      selectedTaskTitle: "",
      selectedTaskIdDate: "",
      oldSelectCompletionTaskDatas: [],
      selectCompletionTaskDatas: [],
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      selectedDate: "",
      isCompDate: false,
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      names: [
        "Meeting",
        "Holiday",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
      ],
      dipDeleteDialog: false,
      loading: true,
      updateIsTrue: false,
    };
  },
  created() {
    this.loading = true;
    this.taskList = this.$store.getters.tasklist.slice();
    this.selectedTaskTitle = this.taskList[0].title;
    this.selectedTaskIdDate = this.taskList[0].idDate;
    //取得回数を減らすために下記をコメントアウトする。
    //updateRange()にて、取得される。
    // this.$store
    //   .dispatch("getCompletionTaskData", this.selectedTaskIdDate)
    //   .then(() => {
    //     this.selectCompletionTaskDatas =
    //       this.$store.getters.selectCompletionDate.slice();
    //     this.oldSelectCompletionTaskDatas =
    //       this.$store.getters.selectCompletionDate.slice();
    //     this.loading = false;
    //   });
  },
  computed: {
    //SubTitle表示させる。
    getSubTitle() {
      var retSubtTitle = "";
      this.taskList.forEach((task) => {
        if (task.idDate === this.selectedTaskIdDate) {
          retSubtTitle = task.subTitle;
        }
      });
      return retSubtTitle;
    },
  },
  methods: {
    dialogResponce() {
      this.dipDeleteDialog = false;
    },
    deleteList() {
      this.dipDeleteDialog = true;
    },
    async selectTaskTitle(taskID) {
      this.taskList.forEach((task) => {
        if (task.idDate === taskID) {
          this.selectedTaskTitle = task.title;
          this.selectedTaskIdDate = task.idDate;
        }
      });
      await this.$store
        .dispatch("getCompletionTaskData", this.selectedTaskIdDate)
        .then(() => {
          this.selectCompletionTaskDatas =
            this.$store.getters.selectCompletionDate.slice();
          this.loading = false;
        });
      this.selectCompletionTaskDatasAscendingOrder();
      this.isContinueData(this.selectCompletionTaskDatas);
      this.componentKey++;
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showDate({ nativeEvent, event, date }) {
      //変更できるダイアログを表示する。
      const open = () => {
        this.selectedOpen = true;
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        this.selectedDate = date;
        this.isCompleteDate(date);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    //文字列yyyymmddをDate型に変換する
    toData(str) {
      var arr = (
        str.substr(0, 4) +
        "/" +
        str.substr(4, 2) +
        "/" +
        str.substr(6, 2)
      ).split("/");
      return new Date(arr[0], arr[1] - 1, arr[2]);
    },
    nextDay(date) {
      var nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    },
    isContinueData(taskDates) {
      const events = [];
      var fitstDayList = []; //対象の日付を格納する。
      var pushedDayList = []; //push済みの日付を格納する。
      for (let i = 0; i < taskDates.length; ++i) {
        if (Object.values(taskDates[i]) == "false") {
          continue;
        }
        var targetDataTaskDate = this.toData(
          Object.keys(taskDates[i]).toString()
        ); //対象の日付
        var lastTaskData = new Date(targetDataTaskDate); //対象の日付の連続した最終日
        for (let j = 0; j < taskDates.length; ++j) {
          if (Object.values(taskDates[j]) == "false") {
            continue;
          }
          var tommorwDate = this.toData(Object.keys(taskDates[j]).toString());
          var tommorwTaskDate = new Date(tommorwDate);
          var tommorwLastDate = this.nextDay(lastTaskData);
          if (
            tommorwLastDate.getDate() == tommorwTaskDate.getDate() &&
            tommorwLastDate.getMonth() == tommorwTaskDate.getMonth() &&
            tommorwLastDate.getFullYear() == tommorwTaskDate.getFullYear()
          ) {
            //対象の日付と次の日付が一致した場合
            lastTaskData = new Date(tommorwTaskDate);
          }
        }
        ///lastTaskDataが更新された場合のみeventにpushする
        fitstDayList[i] =
          lastTaskData.getMonth().toString() +
          lastTaskData.getDate().toString();
        //既にpushされている日付に2重でpushを防ぐ
        var strTargetDataTaskData =
          targetDataTaskDate.getMonth().toString() +
          targetDataTaskDate.getDate().toString();
        var strLastTaskData =
          lastTaskData.getMonth().toString() +
          lastTaskData.getDate().toString();
        if (
          !pushedDayList.includes(strTargetDataTaskData) &&
          !pushedDayList.includes(strLastTaskData)
        ) {
          this.pushTargetDay(targetDataTaskDate, lastTaskData, events);
          pushedDayList.push(strTargetDataTaskData);
          pushedDayList.push(strLastTaskData);
        }
      }
      return;
    },
    pushTargetDay(firstDay, lastDay, events) {
      try {
        events.push({
          start: firstDay,
          end: lastDay,
          color: "blue",
          timed: false,
        });
        this.events = events;
        return true;
      } catch {
        return false;
      }
    },
    isEqualArray(array1, array2) {
      var i = array1.length;
      if (i != array2.length) {
        return false;
      }
      while (i--) {
        if (array1[i] !== array2[i]) {
          return false;
        }
      }
      return true;
    },
    async updateRange() {
      this.loading = true;
      await this.$store
        .dispatch("getCompletionTaskData", this.selectedTaskIdDate)
        .then(() => {
          this.selectCompletionTaskDatas =
            this.$store.getters.selectCompletionDate.slice();
          this.loading = false;
          // this.componentKey++;
        });
      //配列のkeyを昇順に並び変える(ex.20220214,20220215,20220222)
      this.selectCompletionTaskDatasAscendingOrder();
      this.isContinueData(this.selectCompletionTaskDatas);
    },
    //配列のkeyを昇順に並び変える(ex.20220214,20220215,20220222)
    selectCompletionTaskDatasAscendingOrder() {
      this.selectCompletionTaskDatas.sort(function (first, second) {
        if (Number(Object.keys(first)) > Number(Object.keys(second))) {
          return 1;
        } else if (Number(Object.keys(first)) < Number(Object.keys(second))) {
          return -1;
        } else {
          return 0;
        }
      });
    },
    async resCloseUpdateCompMethod() {
      this.loading = true;
      var existObjyec = false;
      this.selectedOpen = false;
      var selectDataforPush = this.selectedDate.replaceAll("-", "");
      this.selectCompletionTaskDatas.forEach((elem) => {
        if (Object.keys(elem) == selectDataforPush) {
          existObjyec = true;
          if (Object.values(elem) == "true") {
            elem[Object.keys(elem)] = false;
          } else {
            elem[Object.keys(elem)] = true;
          }
        }
      });
      if (!existObjyec && this.updateIsTrue) {
        var selectDataObject = { [selectDataforPush]: this.updateIsTrue };
        this.selectCompletionTaskDatas.push(selectDataObject);
      }
      this.selectCompletionTaskDatasAscendingOrder();
      this.isContinueData(this.selectCompletionTaskDatas);
      this.componentKey += 1;
    },
    callOpenMethod() {
      //連続で押下された場合は、こっちの処理
      this.selectedOpen = true;
    },
    isCompleteDate(date) {
      if (!date) {
        return;
      }
      date = date.toString();
      date = date.replaceAll("-", "");
      this.isCompDate = false;
      this.selectCompletionTaskDatas.forEach((CompDate) => {
        var strCompDate = Object.keys(CompDate).toString();
        if (strCompDate == date) {
          this.isCompDate = true;
        }
      });
    },
  },
};
</script>

<style scoped>
.loading {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
