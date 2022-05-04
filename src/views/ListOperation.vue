<template>
  <div>
    <template v-if="isList(yetTasks)">
      <transition-group name="listAnime" class="List" tag="ol" appear>
        <li
          :class="`ListInside--${yetTask.priority}`"
          v-for="(yetTask, index) in yetTasks"
          :key="yetTask.idDate"
          @click="select(index)"
        >
          <div class="toDoList">
            <div class="titleFont">
              {{ yetTask.title }}
            </div>
            <template v-if="isAchievement(yetTask.date)">
              <div class="GoalFont">目標達成</div>
            </template>
            <template v-else>
              <div class="dayFont">
                後
                <div class="dayFont2">{{ daysLater(yetTask.date) }}</div>
                日
              </div>
            </template>
          </div>
        </li>
      </transition-group>
    </template>
    <template v-else-if="isList(allTasks)">
      <TodayCompletion />
    </template>
    <template v-else>
      <NoList />
    </template>
  </div>
</template>

<script>
import NoList from "./NoList.vue";
import TodayCompletion from "./TodayCompletion.vue";
export default {
  components: {
    NoList,
    TodayCompletion,
  },
  props: ["yetTasks", "allTasks"],
  date() {
    return {
      show: false,
    };
  },
  methods: {
    isAchievement(dateStr) {
      var now = new Date().getTime();
      var dateDate = Date.parse(dateStr);
      var diffdateMsSec = dateDate - now;
      if (diffdateMsSec < 0) {
        return true;
      } else {
        return false;
      }
    },
    daysLater(dateStr) {
      var now = new Date().getTime();
      var dateDate = Date.parse(dateStr);
      var diffdateMsSec = dateDate - now;
      var diffDays = diffdateMsSec / (1000 * 60 * 60 * 24);
      var showDays = Math.ceil(diffDays);
      return showDays.toString();
    },
    select(index) {
      //本日完了した事をDBへ通知する。
      this.$store.dispatch("postCompletionTask", {
        completionTask: this.yetTasks[index],
      });
      //画面上から削除する。
      this.yetTasks.splice(index, 1);
    },
    isList(yetTasks) {
      if (yetTasks.length === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.List {
  padding: 0;
  position: relative;
}

/*優先度 低 */
.ListInside--1 {
  color: #2d8fdd;
  border-left: solid 6px #2d8fdd; /*左側の線*/
  background: #f1f8ff;
  margin-bottom: 3px; /*下のバーとの余白*/
  line-height: 1.5;
  padding: 0.5em;
  list-style-type: none !important; /*ポチ消す*/
  cursor: pointer;
}
/*優先度 高 */
.ListInside--3 {
  color: #ef9a9a; /*3*/
  border-left: solid 6px #f44336; /*左側の線1*/
  background: #ffebee;
  margin-bottom: 3px; /*下のバーとの余白*/
  line-height: 1.5;
  padding: 0.5em;
  list-style-type: none !important; /*ポチ消す*/
  cursor: pointer;
}
/*優先度 中 */
.ListInside--2 {
  color: #ffcc80;
  border-left: solid 6px #ff9800; /*左側の線*/
  background: #fff3e0;
  margin-bottom: 3px; /*下のバーとの余白*/
  line-height: 1.5;
  padding: 0.5em;
  list-style-type: none !important; /*ポチ消す*/
  cursor: pointer;
}

.ListInside:hover {
  opacity: 0.5;
}
.toDoList {
  display: flex;
}
.dayFont {
  display: inline-flex;
  padding: 4px;
  margin-left: auto;
  font-weight: 600;
  align-items: baseline; /*後何日をそろえる*/
  gap: 6px 4px; /* 余白 */
}
.dayFont2 {
  font-size: 40px;
}
.GoalFont {
  font-size: 25px;
  display: inline-block;
  padding: 4px;
  margin-left: auto;
  font-weight: 600;
}
.titleFont {
  font-size: 30px;
  font-weight: 600;
}
.listAnime-item {
  display: inline-block;
  margin-right: 10px;
}

.listAnime-leave-active,
.listAnime-enter-active {
  transition: all 0.8s;
  position: relative;
}
.listAnime-leave-to,
.listAnime-enter {
  opacity: 0;
  transform: translateX(50px);
}

.listAnime-leave,
.listAnime-enter-to {
  opacity: 1;
}

.listAnime-move {
  transition: all 0.3s ease;
}
</style>
