definePlugin('@plugins/com.msgbyte.topic/index-f8f06e03.js', ['require', 'exports', '@capital/common', '@capital/component'], (function (require, exports, common, component) { 'use strict';

  const Translate = {
    topicpanel: common.localTrans({ "zh-CN": "\u793E\u533A\u8BDD\u9898", "en-US": "Community Topics" }),
    noTopic: common.localTrans({ "zh-CN": "", "en-US": "" }),
    createBtn: common.localTrans({ "zh-CN": "\u53D1\u5E03\u8BDD\u9898", "en-US": "Post Topic" }),
    createPlaceholder: common.localTrans({
      "zh-CN": "\u6709\u4EC0\u4E48\u65B0\u9C9C\u4E8B\uFF1F",
      "en-US": "What is happening?"
    }),
    publish: common.localTrans({ "zh-CN": "\u53D1\u5E03", "en-US": "Post" }),
    xiaoxuAssistant: common.localTrans({
      "zh-CN": "\u5C0F\u5E8F\u52A9\u624B",
      "en-US": "Xiaoxu Assistant"
    }),
    improveText: common.localTrans({ "zh-CN": "\u6DA6\u8272", "en-US": "Improve" }),
    makeShorter: common.localTrans({ "zh-CN": "\u7F29\u77ED", "en-US": "Shorter" }),
    makeLonger: common.localTrans({ "zh-CN": "\u6269\u5199", "en-US": "Longer" }),
    translateText: common.localTrans({ "zh-CN": "\u7FFB\u8BD1", "en-US": "Translate" }),
    applyToInput: common.localTrans({ "zh-CN": "\u5E94\u7528\u5230\u8F93\u5165", "en-US": "Apply" }),
    aiThinking: common.localTrans({
      "zh-CN": "\u5C0F\u5E8F\u6B63\u5728\u601D\u8003...",
      "en-US": "Xiaoxu is thinking..."
    }),
    aiEmptyInput: common.localTrans({
      "zh-CN": "\u5148\u8F93\u5165\u4E00\u4E9B\u6587\u5B57\uFF0C\u518D\u8BA9\u5C0F\u5E8F\u5E2E\u4F60\u4F18\u5316\u3002",
      "en-US": "Write something first, then ask Xiaoxu to help."
    }),
    reply: common.localTrans({ "zh-CN": "\u56DE\u590D", "en-US": "Reply" }),
    delete: common.localTrans({ "zh-CN": "\u5220\u9664", "en-US": "Delete" }),
    upvote: common.localTrans({ "zh-CN": "\u8D5E\u540C", "en-US": "Upvote" }),
    cancelUpvote: common.localTrans({ "zh-CN": "\u53D6\u6D88\u8D5E\u540C", "en-US": "Cancel upvote" }),
    uploadImage: common.localTrans({ "zh-CN": "\u4E0A\u4F20\u56FE\u7247", "en-US": "Upload image" }),
    removeImage: common.localTrans({ "zh-CN": "\u79FB\u9664\u56FE\u7247", "en-US": "Remove image" }),
    pinned: common.localTrans({ "zh-CN": "\u7F6E\u9876", "en-US": "Pinned" }),
    pinComment: common.localTrans({ "zh-CN": "\u7F6E\u9876\u8BC4\u8BBA", "en-US": "Pin comment" }),
    unpinComment: common.localTrans({
      "zh-CN": "\u53D6\u6D88\u7F6E\u9876",
      "en-US": "Unpin comment"
    }),
    authorLiked: common.localTrans({
      "zh-CN": "\u4F5C\u8005\u8D5E\u8FC7",
      "en-US": "Liked by author"
    }),
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
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./GroupTopicPanelRender-331bcec5'], resolve, reject); })),
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
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./TopicInboxItem-42cc49eb'], resolve, reject); }).then((module) => module.TopicInboxItem))
  });

  exports.Translate = Translate;

}));
//# sourceMappingURL=index-f8f06e03.js.map
