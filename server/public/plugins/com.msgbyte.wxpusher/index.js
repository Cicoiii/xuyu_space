definePlugin('@plugins/com.msgbyte.wxpusher', ['require', '@capital/common', '@capital/component'], (function (require, common, component) { 'use strict';

  console.log("Plugin wxpusher is loaded");
  common.regCustomPanel({
    position: "setting",
    icon: "",
    name: "com.msgbyte.wxpusher/settings",
    label: "WxPusher",
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./SettingsPanel-6a1583d0'], resolve, reject); }))
  });

}));
//# sourceMappingURL=index.js.map
