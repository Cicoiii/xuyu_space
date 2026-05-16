definePlugin('@plugins/com.msgbyte.simplenotify/index-2335170d.js', ['require', 'exports', '@capital/common'], (function (require, exports, common) { 'use strict';

  const Translate = {
    groupSubscribe: common.localTrans({
      "zh-CN": "\u7B80\u6613\u901A\u77E5\u7FA4\u7EC4\u8BA2\u9605",
      "en-US": "Simple Notify Bot Group Subscribe"
    }),
    simplenotifyService: common.localTrans({
      "zh-CN": "\u7B80\u6613\u901A\u77E5\u673A\u5668\u4EBA\u670D\u52A1",
      "en-US": "Simple Notify Bot Service"
    }),
    add: common.localTrans({
      "zh-CN": "\u65B0\u589E",
      "en-US": "Add"
    }),
    panel: common.localTrans({
      "zh-CN": "\u9762\u677F",
      "en-US": "Panel"
    }),
    createdTime: common.localTrans({
      "zh-CN": "\u521B\u5EFA\u65F6\u95F4",
      "en-US": "Created Time"
    }),
    action: common.localTrans({
      "zh-CN": "\u64CD\u4F5C",
      "en-US": "Action"
    }),
    delete: common.localTrans({
      "zh-CN": "\u5220\u9664",
      "en-US": "Delete"
    }),
    textPanel: common.localTrans({
      "zh-CN": "\u6587\u672C\u9891\u9053",
      "en-US": "Text Channel"
    }),
    createNotify: common.localTrans({
      "zh-CN": "\u521B\u5EFA\u901A\u77E5",
      "en-US": "Create Notify"
    }),
    success: common.localTrans({
      "zh-CN": "\u6210\u529F",
      "en-US": "Success"
    }),
    textPanelEmpty: common.localTrans({
      "zh-CN": "\u6587\u672C\u9891\u9053\u4E0D\u80FD\u4E3A\u7A7A",
      "en-US": "Text Panel Not Allowd Empty"
    }),
    permissionTitle: common.localTrans({
      "zh-CN": "\u7B80\u5355\u901A\u77E5\u7BA1\u7406",
      "en-US": "Simple Notify Manager"
    }),
    permissionDesc: common.localTrans({
      "zh-CN": "\u5141\u8BB8\u7BA1\u7406\u7FA4\u7EC4\u7B80\u5355\u901A\u77E5\u673A\u5668\u4EBA",
      "en-US": "Allows admin groups to simply notify bots"
    })
  };

  common.regCustomPanel({
    position: "groupdetail",
    name: "com.msgbyte.simplenotify/groupSubscribe",
    label: Translate.groupSubscribe,
    render: common.Loadable(() => new Promise(function (resolve, reject) { require(['./index-c2939478'], resolve, reject); }))
  });
  common.regInspectService({
    name: "plugin:com.msgbyte.simplenotify",
    label: Translate.simplenotifyService
  });
  common.regPluginPermission({
    key: "plugin.com.msgbyte.simplenotify.subscribe.manage",
    title: Translate.permissionTitle,
    desc: Translate.permissionDesc,
    default: false
  });

  exports.Translate = Translate;

}));
//# sourceMappingURL=index-2335170d.js.map
