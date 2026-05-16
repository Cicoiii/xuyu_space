definePlugin('@plugins/com.msgbyte.github/index-0c36aaaa.js', ['require', 'exports', '@capital/common', '@capital/component'], (function (require, exports, common, component) { 'use strict';

  const Translate = {
    groupSubscribe: common.localTrans({
      "zh-CN": "Github \u7FA4\u7EC4\u8BA2\u9605",
      "en-US": "Github Group Subscribe"
    }),
    githubService: common.localTrans({
      "zh-CN": "Github \u7FA4\u7EC4\u8BA2\u9605\u670D\u52A1",
      "en-US": "Github Group Subscribe Service"
    }),
    add: common.localTrans({
      "zh-CN": "\u65B0\u589E",
      "en-US": "Add"
    }),
    repo: common.localTrans({
      "zh-CN": "\u9879\u76EE",
      "en-US": "Repository"
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
    repoName: common.localTrans({
      "zh-CN": "\u4ED3\u5E93\u540D",
      "en-US": "Repo Name"
    }),
    repoNamePlaceholder: common.localTrans({
      "zh-CN": "(\u793A\u4F8B: msgbyte/tailchat)",
      "en-US": "(example: msgbyte/tailchat)"
    }),
    textPanel: common.localTrans({
      "zh-CN": "\u6587\u672C\u9891\u9053",
      "en-US": "Text Channel"
    }),
    success: common.localTrans({
      "zh-CN": "\u6210\u529F",
      "en-US": "Success"
    }),
    createApplication: common.localTrans({
      "zh-CN": "\u521B\u5EFA\u5E94\u7528",
      "en-US": "Create Application"
    }),
    repoNameEmpty: common.localTrans({
      "zh-CN": "\u4ED3\u5E93\u540D\u4E0D\u80FD\u4E3A\u7A7A",
      "en-US": "Github Repo Name Not Allowd Empty"
    }),
    textPanelEmpty: common.localTrans({
      "zh-CN": "\u6587\u672C\u9891\u9053\u4E0D\u80FD\u4E3A\u7A7A",
      "en-US": "Text Panel Not Allowd Empty"
    }),
    permissionTitle: common.localTrans({
      "zh-CN": "Github \u8BA2\u9605\u7BA1\u7406",
      "en-US": "Github Subscribe Manager"
    }),
    permissionDesc: common.localTrans({
      "zh-CN": "\u5141\u8BB8\u7BA1\u7406Github\u8BA2\u9605\u5217\u8868",
      "en-US": "Allows to manage Github subscription list"
    })
  };

  const PLUGIN_ID = "com.msgbyte.github";
  common.regCustomPanel({
    position: "groupdetail",
    name: `${PLUGIN_ID}/groupSubscribe`,
    label: Translate.groupSubscribe,
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./index-1e96d98c'], resolve, reject); }))
  });
  common.regInspectService({
    name: `plugin:${PLUGIN_ID}.subscribe`,
    label: Translate.githubService
  });
  common.regPluginPermission({
    key: `plugin.${PLUGIN_ID}.subscribe.manage`,
    title: Translate.permissionTitle,
    desc: Translate.permissionDesc,
    default: false
  });
  if (common.isDevelopment) {
    common.regPluginRootRoute({
      name: `plugin:${PLUGIN_ID}/route`,
      path: "/github/:owner/:repo",
      component: component.Loadable(() => new Promise(function (resolve, reject) { require(['./GithubRepoInfo-327661f1'], resolve, reject); }).then((m) => m.GithubRepoInfoRoute))
    });
  }

  exports.Translate = Translate;

}));
//# sourceMappingURL=index-0c36aaaa.js.map
