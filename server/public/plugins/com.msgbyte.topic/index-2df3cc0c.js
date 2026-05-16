definePlugin('@plugins/com.msgbyte.topic/index-2df3cc0c.js', ['require', 'exports', '@capital/common', '@capital/component'], (function (require, exports, common, component) { 'use strict';

  const Translate = {
    topicpanel: common.localTrans({ "zh-CN": "\u8BDD\u9898\u9762\u677F", "en-US": "Topic Panel" }),
    noTopic: common.localTrans({ "zh-CN": "\u6682\u65E0\u8BDD\u9898", "en-US": "No Topic" }),
    createBtn: common.localTrans({ "zh-CN": "\u521B\u5EFA\u8BDD\u9898", "en-US": "Create Topic" }),
    reply: common.localTrans({ "zh-CN": "\u56DE\u590D", "en-US": "Reply" }),
    delete: common.localTrans({ "zh-CN": "\u5220\u9664", "en-US": "Delete" }),
    replyThisTopic: common.localTrans({
      "zh-CN": "\u56DE\u590D\u8BE5\u8BDD\u9898",
      "en-US": "Reply this topic"
    }),
    loadMore: common.localTrans({
      "zh-CN": "\u52A0\u8F7D\u66F4\u591A",
      "en-US": "Load More"
    }),
    noMore: common.localTrans({
      "zh-CN": "\u6CA1\u6709\u66F4\u591A\u4E86",
      "en-US": "No More"
    }),
    loading: common.localTrans({
      "zh-CN": "\u52A0\u8F7D\u4E2D...",
      "en-US": "Loading..."
    }),
    topicDataError: common.localTrans({
      "zh-CN": "\u8BDD\u9898\u4FE1\u606F\u5F02\u5E38",
      "en-US": "Topic Data Error"
    }),
    topicDeleteConfimTip: common.localTrans({
      "zh-CN": "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u8BDD\u9898\u4E48",
      "en-US": "Are you sure you want to delete this topic?"
    })
  };

  const PLUGIN_NAME = "com.msgbyte.topic";
  common.regGroupPanel({
    name: `${PLUGIN_NAME}/grouppanel`,
    label: Translate.topicpanel,
    provider: PLUGIN_NAME,
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./GroupTopicPanelRender-835a2a52'], resolve, reject); })),
    feature: ["subscribe", "ack"]
  });
  common.regPluginInboxItemMap("plugin:com.msgbyte.topic.comment", {
    source: Translate.topicpanel,
    getPreview: (item) => {
      var _a, _b;
      return {
        title: Translate.topicpanel,
        desc: common.getMessageRender((_b = (_a = item == null ? void 0 : item.payload) == null ? void 0 : _a.content) != null ? _b : "")
      };
    },
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./TopicInboxItem-7001b68c'], resolve, reject); }).then((module) => module.TopicInboxItem))
  });

  exports.Translate = Translate;

}));
//# sourceMappingURL=index-2df3cc0c.js.map
