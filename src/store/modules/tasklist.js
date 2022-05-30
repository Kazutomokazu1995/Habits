import {
  getFirestore,
  doc,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import router from "../../router";

const state = {
  tasklist: [],
  yetTaskList: [],
  selectCompletionDate: [],
};
const getters = {
  tasklist: (state) => state.tasklist,
  yetTaskList: (state) => state.yetTaskList,
  selectCompletionDate: (state) => state.selectCompletionDate,
  //authenticateのUIDを取得する。
  getUid(state, _, rootState) {
    return rootState.authenticate.uid;
  },
};
const mutations = {
  updateTasklist(state, tasklists) {
    state.tasklist = tasklists.slice();
  },
  updateYetTasklist(state, yetTaskList) {
    state.yetTaskList = yetTaskList.slice();
  },
  updateSelectCompletionDate(state, selectCompletionDate) {
    state.selectCompletionDate = selectCompletionDate.slice();
  },
};
const actions = {
  //引数のIDのタスクを削除する。
  async deleteList({ getters }, taskIDData) {
    var deleteDocID;
    var deleteTasksDate = [];
    const db = getFirestore();
    //Task削除
    const qTask = query(
      collection(db, "users", getters.getUid, "toDoList"),
      where("idDate", "==", taskIDData.idData)
    );
    const querySnapshot = await getDocs(qTask);
    querySnapshot.forEach((doc) => {
      deleteDocID = doc.id; //消去対象のドキュメントID
    });
    await deleteDoc(doc(db, "users", getters.getUid, "toDoList", deleteDocID));

    //日付データを削除
    const qData = query(
      collection(
        db,
        "users",
        getters.getUid,
        "toDoList",
        deleteDocID,
        "completionTask"
      )
    );
    const querySnapshot2 = await getDocs(qData);
    querySnapshot2.forEach((doc) => {
      deleteTasksDate.push(doc.id);
    });

    Promise.all(
      deleteTasksDate.map(async (deleteTaskDate) => {
        await deleteDoc(
          doc(
            db,
            "users",
            getters.getUid,
            "toDoList",
            deleteDocID,
            "completionTask",
            deleteTaskDate
          )
        );
      })
    );

    router.push("/"); //ここでrouterは用検討
  },
  //タスクリストを作成する。
  async postTodoList({ getters }, createdata) {
    try {
      const db = getFirestore();
      var userCollection = collection(db, "users", getters.getUid, "toDoList");
      const data = {
        idDate: createdata.idData,
        title: createdata.title,
        subTitle: createdata.subTitle,
        date: createdata.date,
        startDate: createdata.startDate,
        priority: createdata.prinum,
      };
      await setDoc(doc(userCollection), data);
    } catch (e) {
      console.log("Error adding document: ", e);
    }
  },
  //タスクが1件完了した事を通知する。
  async postCompletionTask({ getters }, task) {
    try {
      var completionTaskID; //完了タスクのドキュメントID
      const db = getFirestore();
      const q = query(
        collection(db, "users", getters.getUid, "toDoList"),
        where("idDate", "==", task.completionTask.idDate)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        completionTaskID = doc.id; //完了タスクのドキュメントID
      });
      // completionTaskID = getTaskID(getters.getUid,task);
      var toDay = getToday(); //本日の日付取得
      var completionTaskCollection = collection(
        db,
        "users",
        getters.getUid,
        "toDoList",
        completionTaskID,
        "completionTask"
      );
      const data = {
        [toDay]: true,
      };
      await setDoc(doc(completionTaskCollection), data);
    } catch (e) {
      console.log("Error Completion Task: ", e);
    }
  },
  //タスクを1件Delete
  async updateDeleteCompletionTask({ getters }, taskIDData) {
    const db = getFirestore();
    var completionTaskID;
    var targetDateID;
    var targetDate;
    const qIDdata = query(
      collection(db, "users", getters.getUid, "toDoList"),
      where("idDate", "==", taskIDData.idData)
    );
    const querySnapshotCompletionTask = await getDocs(qIDdata);
    querySnapshotCompletionTask.forEach((doc) => {
      completionTaskID = doc.id; //完了タスクのドキュメントID
    });
    targetDate = taskIDData.date.toString().replaceAll("-", "");
    const qTargetDate = query(
      collection(
        db,
        "users",
        getters.getUid,
        "toDoList",
        completionTaskID,
        "completionTask"
      ),
      where(targetDate, "in", [true])
    );
    const querySnapshotTargetDate = await getDocs(qTargetDate);
    querySnapshotTargetDate.forEach((doc) => {
      targetDateID = doc.id;
    });
    if (targetDateID) {
      await deleteDoc(
        doc(
          db,
          "users",
          getters.getUid,
          "toDoList",
          completionTaskID,
          "completionTask",
          targetDateID
        )
      );
    }
  },
  //タスクを1件Falseに更新する。
  async updateFalseCompletionTask({ getters }, taskIDData) {
    const db = getFirestore();
    var completionTaskID;
    var targetDateID;
    var targetDate;
    const qIDdata = query(
      collection(db, "users", getters.getUid, "toDoList"),
      where("idDate", "==", taskIDData.idData)
    );
    const querySnapshotCompletionTask = await getDocs(qIDdata);
    querySnapshotCompletionTask.forEach((doc) => {
      completionTaskID = doc.id; //完了タスクのドキュメントID
    });
    targetDate = taskIDData.date.toString().replaceAll("-", "");
    const qTargetDate = query(
      collection(
        db,
        "users",
        getters.getUid,
        "toDoList",
        completionTaskID,
        "completionTask"
      ),
      where(targetDate, "in", [true])
    );
    const querySnapshotTargetDate = await getDocs(qTargetDate);
    querySnapshotTargetDate.forEach((doc) => {
      targetDateID = doc.id;
    });
    if (targetDateID) {
      const updateTargetDay = doc(
        db,
        "users",
        getters.getUid,
        "toDoList",
        completionTaskID,
        "completionTask",
        targetDateID
      );
      await updateDoc(updateTargetDay, {
        [targetDate]: false,
      });
    }
  },
  //タスクを1件Trueに更新する。
  async updateTrueCompletionTask({ getters }, taskIDData) {
    const db = getFirestore();
    var completionTaskID;
    var targetDateID;
    var targetDate;
    const qIDdata = query(
      collection(db, "users", getters.getUid, "toDoList"),
      where("idDate", "==", taskIDData.idData)
    );
    const querySnapshotCompletionTask = await getDocs(qIDdata);
    querySnapshotCompletionTask.forEach((doc) => {
      completionTaskID = doc.id; //完了タスクのドキュメントID
    });
    targetDate = taskIDData.date.toString().replaceAll("-", "");
    const qTargetDate = query(
      collection(
        db,
        "users",
        getters.getUid,
        "toDoList",
        completionTaskID,
        "completionTask"
      ),
      where(targetDate, "in", [false])
    );
    const querySnapshotTargetDate = await getDocs(qTargetDate);
    querySnapshotTargetDate.forEach((doc) => {
      targetDateID = doc.id;
    });

    if (targetDateID) {
      const updateTargetDay = doc(
        db,
        "users",
        getters.getUid,
        "toDoList",
        completionTaskID,
        "completionTask",
        targetDateID
      );
      await updateDoc(updateTargetDay, {
        [targetDate]: true,
      });
    } else {
      var completionTaskCollection = collection(
        db,
        "users",
        getters.getUid,
        "toDoList",
        completionTaskID,
        "completionTask"
      );
      const data = {
        [targetDate]: true,
      };
      await setDoc(doc(completionTaskCollection), data);
    }
  },
  //タスクリストを取得する。
  async getCompletionTask({ getters, commit }) {
    var tasklist = []; //タスクリスト一覧
    var tasksID = []; //TaskリストのドキュメントID
    var toDayCompletionTasks = []; //完了しているタスクのドキュメントID
    var yetTaskList = []; //完了していないタスクリスト
    const db = getFirestore();

    //配列を初期化する。
    commit("updateTasklist", []);
    commit("updateYetTasklist", []);

    //タスクリストを取得する。
    const querySnapshot1 = await getDocs(
      collection(db, "users", getters.getUid, "toDoList")
    );
    querySnapshot1.forEach((doc) => {
      tasklist.push(doc.data());
    });
    commit("updateTasklist", tasklist);
    //TaskリストのドキュメントIDを取得する。
    await Promise.all(
      tasklist.map(async (task) => {
        const q = query(
          collection(db, "users", getters.getUid, "toDoList"),
          where("idDate", "==", task.idDate)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          tasksID.push(doc.id);
        });
      })
    );

    //Taskリストから本日完了しているドキュメントIDを取得する。
    var toDay = getToday(); //本日の日付取得
    var strToDay = toDay.toString();
    await Promise.all(
      tasksID.map(async (toDayCompletionTaskID) => {
        const querySnapshot2 = await getDocs(
          collection(
            db,
            "users",
            getters.getUid,
            "toDoList",
            toDayCompletionTaskID,
            "completionTask"
          )
        );
        querySnapshot2.forEach((doc) => {
          if (Object.values(doc.data())[0]) {
            if (Object.keys(doc.data()) == strToDay) {
              toDayCompletionTasks.push(toDayCompletionTaskID); //完了しているタスクのドキュメントID
            }
          }
        });
      })
    );

    //完了しているドキュメントIDから、未完了のタスクを取得する。
    querySnapshot1.forEach((doc) => {
      if (!toDayCompletionTasks.includes(doc.id)) {
        yetTaskList.push(doc.data());
      }
      commit("updateYetTasklist", yetTaskList);
    });
  },
  //引数から取得したタスクから、完了日付を取り出す
  async getCompletionTaskData({ getters, commit }, selectTaskIDData) {
    const db = getFirestore();
    var selectTaskDocID;
    var selectCompletionDate = [];

    //取得する前に配列を初期化する。
    commit("updateSelectCompletionDate", []);

    //引数から取得したタスクからドキュメントIDを取得する。
    const q = query(
      collection(db, "users", getters.getUid, "toDoList"),
      where("idDate", "==", selectTaskIDData)
    );
    const querySnapshotSelectDocID = await getDocs(q);
    querySnapshotSelectDocID.forEach((doc) => {
      selectTaskDocID = doc.id;
    });

    const querySnapshotCompletion = await getDocs(
      collection(
        db,
        "users",
        getters.getUid,
        "toDoList",
        selectTaskDocID,
        "completionTask"
      )
    );
    querySnapshotCompletion.forEach((doc) => {
      if (Object.values(doc.data())[0] == true) {
        selectCompletionDate.push(doc.data()); //完了しているタスクのドキュメントID
      }
    });

    commit("updateSelectCompletionDate", selectCompletionDate);
  },
};

//本日の日付を取得する。
function getToday() {
  var date2 = new Date();
  const date =
    date2.getFullYear() +
    ("00" + (date2.getMonth() + 1)).slice(-2) +
    ("00" + date2.getDate()).slice(-2);
  return date;
}

//タスクデータからタスクIDを取得する。
// async function getTaskID(uid, task) {
//   const db = getFirestore();
//   var completionTaskID;
//   const q = query(collection(db, "users", uid, "toDoList"), where("idDate", "==", task.completionTask.idDate));
//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     completionTaskID = doc.id; //完了タスクのドキュメントID
//   });
//   return completionTaskID;
// }

export default {
  state,
  getters,
  mutations,
  actions,
};
