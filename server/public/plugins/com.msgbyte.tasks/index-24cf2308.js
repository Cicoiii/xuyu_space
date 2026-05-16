definePlugin('@plugins/com.msgbyte.tasks/index-24cf2308.js', ['require', 'exports', '@capital/common'], (function (require, exports, common) { 'use strict';

  const Translate = {
    tasks: common.localTrans({ "zh-CN": "\u4EFB\u52A1", "en-US": "Tasks" }),
    tasksService: common.localTrans({ "zh-CN": "\u4EFB\u52A1\u670D\u52A1", "en-US": "Tasks Service" }),
    insertTip: common.localTrans({ "zh-CN": "\u6DFB\u52A0\u4EFB\u52A1", "en-US": "Insert Task" }),
    done: common.localTrans({ "zh-CN": "\u5DF2\u5B8C\u6210", "en-US": "Done" }),
    undone: common.localTrans({ "zh-CN": "\u672A\u5B8C\u6210", "en-US": "Undone" }),
    emptyTip: common.localTrans({
      "zh-CN": "\u8BF7\u8F93\u5165\u5185\u5BB9",
      "en-US": "Please enter content"
    }),
    priority: common.localTrans({ "zh-CN": "\u4F18\u5148\u7EA7", "en-US": "Priority" }),
    priorityHigh: common.localTrans({ "zh-CN": "\u9AD8", "en-US": "High" }),
    priorityMedium: common.localTrans({ "zh-CN": "\u4E2D", "en-US": "Medium" }),
    priorityLow: common.localTrans({ "zh-CN": "\u4F4E", "en-US": "Low" }),
    deadline: common.localTrans({ "zh-CN": "\u622A\u6B62\u65E5\u671F", "en-US": "Deadline" }),
    desc: common.localTrans({ "zh-CN": "\u8BE6\u7EC6\u63CF\u8FF0", "en-US": "Description" }),
    taskDetail: common.localTrans({ "zh-CN": "\u4EFB\u52A1\u8BE6\u60C5", "en-US": "Task Detail" }),
    noDesc: common.localTrans({ "zh-CN": "\u6682\u65E0\u63CF\u8FF0", "en-US": "No description" }),
    noDeadline: common.localTrans({ "zh-CN": "\u65E0\u622A\u6B62\u65E5\u671F", "en-US": "No deadline" }),
    clearCompleted: common.localTrans({ "zh-CN": "\u6E05\u7406\u5DF2\u5B8C\u6210", "en-US": "Clear Completed" }),
    batchDone: common.localTrans({ "zh-CN": "\u6279\u91CF\u5B8C\u6210", "en-US": "Batch Done" }),
    selectAll: common.localTrans({ "zh-CN": "\u5168\u9009", "en-US": "Select All" }),
    selected: common.localTrans({ "zh-CN": "\u5DF2\u9009\u62E9", "en-US": "Selected" }),
    confirmClear: common.localTrans({
      "zh-CN": "\u786E\u8BA4\u6E05\u7406\u6240\u6709\u5DF2\u5B8C\u6210\u7684\u4EFB\u52A1\uFF1F",
      "en-US": "Confirm clearing all completed tasks?"
    }),
    overdue: common.localTrans({ "zh-CN": "\u5DF2\u903E\u671F", "en-US": "Overdue" }),
    dueToday: common.localTrans({ "zh-CN": "\u4ECA\u65E5\u622A\u6B62", "en-US": "Due Today" }),
    daysLeft: common.localTrans({ "zh-CN": "\u5929\u540E\u622A\u6B62", "en-US": " days left" }),
    createTask: common.localTrans({ "zh-CN": "\u521B\u5EFA\u4EFB\u52A1", "en-US": "Create Task" }),
    cancel: common.localTrans({ "zh-CN": "\u53D6\u6D88", "en-US": "Cancel" }),
    save: common.localTrans({ "zh-CN": "\u4FDD\u5B58", "en-US": "Save" }),
    delete: common.localTrans({ "zh-CN": "\u5220\u9664", "en-US": "Delete" }),
    edit: common.localTrans({ "zh-CN": "\u7F16\u8F91", "en-US": "Edit" }),
    titleRequired: common.localTrans({ "zh-CN": "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A", "en-US": "Title is required" }),
    quickAddTip: common.localTrans({ "zh-CN": "\u8F93\u5165\u4EFB\u52A1\u540E\u56DE\u8F66\u521B\u5EFA\u2026", "en-US": "Type and press Enter to add\u2026" }),
    emptyUndone: common.localTrans({ "zh-CN": "\u6682\u65E0\u5F85\u529E\u4EFB\u52A1", "en-US": "No pending tasks" }),
    emptyDone: common.localTrans({ "zh-CN": "\u6682\u65E0\u5DF2\u5B8C\u6210\u4EFB\u52A1", "en-US": "No completed tasks" })
  };

  common.regCustomPanel({
    position: "personal",
    icon: "mdi:checkbox-marked-outline",
    name: "com.msgbyte.tasks/tasksPanel",
    label: Translate.tasks,
    render: common.Loadable(() => new Promise(function (resolve, reject) { require(['./index-d42d6aba'], resolve, reject); }))
  });
  common.regInspectService({
    name: "plugin:com.msgbyte.tasks",
    label: Translate.tasksService
  });

  exports.Translate = Translate;

}));
//# sourceMappingURL=index-24cf2308.js.map
