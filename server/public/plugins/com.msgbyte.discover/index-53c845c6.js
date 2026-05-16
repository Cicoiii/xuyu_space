definePlugin('@plugins/com.msgbyte.discover/index-53c845c6.js', ['require', 'exports', '@capital/common'], (function (require, exports, common) { 'use strict';

  const Translate = {
    discover: common.localTrans({
      "zh-CN": "\u63A2\u7D22",
      "en-US": "Discover"
    }),
    memberCount: common.localTrans({
      "zh-CN": "{count} \u4F4D\u6210\u5458",
      "en-US": "{count} members"
    }),
    discoverHeader: common.localTrans({
      "zh-CN": "\u5728\u8FD9\u91CC\u63A2\u7D22\u4F60\u611F\u5174\u8DA3\u7684\u7FA4\u7EC4",
      "en-US": "Explore the groups you are interested in here"
    }),
    join: common.localTrans({
      "zh-CN": "\u52A0\u5165",
      "en-US": "Join"
    }),
    joined: common.localTrans({
      "zh-CN": "\u5DF2\u52A0\u5165",
      "en-US": "Joined"
    })
  };

  console.log("Plugin Discover is loaded");
  const DiscoverPanel = common.Loadable(() => new Promise(function (resolve, reject) { require(['./index-e12b93dd'], resolve, reject); }).then((m) => m.DiscoverPanel));
  common.regCustomPanel({
    position: "navbar-group",
    icon: "mdi:compass",
    name: "plugin:com.msgbyte.discover/entry",
    label: Translate.discover,
    render: DiscoverPanel
  });

  exports.Translate = Translate;

}));
//# sourceMappingURL=index-53c845c6.js.map
