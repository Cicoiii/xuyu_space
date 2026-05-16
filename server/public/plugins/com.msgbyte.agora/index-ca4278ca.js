definePlugin('@plugins/com.msgbyte.agora/index-ca4278ca.js', ['require', 'exports', '@capital/common', '@capital/component', 'react'], (function (require, exports, common, component, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const Translate = {
    uplink: common.localTrans({
      "zh-CN": "\u4E0A\u884C\u7F51\u7EDC",
      "en-US": "Uplink"
    }),
    downlink: common.localTrans({
      "zh-CN": "\u4E0B\u884C\u7F51\u7EDC",
      "en-US": "Downlink"
    }),
    isSpeaking: common.localTrans({
      "zh-CN": "\u6B63\u5728\u53D1\u8A00",
      "en-US": "is Speaking"
    }),
    nomanSpeaking: common.localTrans({
      "zh-CN": "\u65E0\u4EBA\u53D1\u8A00",
      "en-US": "No one Speaking"
    }),
    startCall: common.localTrans({
      "zh-CN": "\u53D1\u8D77/\u52A0\u5165\u901A\u8BDD",
      "en-US": "Start/Join Call"
    }),
    startCallContent: common.localTrans({
      "zh-CN": "\u662F\u5426\u901A\u8FC7\u58F0\u7F51\u63D2\u4EF6\u5728\u5F53\u524D\u4F1A\u8BDD\u5F00\u542F/\u52A0\u5165\u97F3\u89C6\u9891\u901A\u8BAF\uFF1F",
      "en-US": "Do you want to enable audio and video communication in the current session through the Agora plugin?"
    }),
    expand: common.localTrans({
      "zh-CN": "\u5C55\u5F00",
      "en-US": "expand"
    }),
    foldup: common.localTrans({
      "zh-CN": "\u6536\u8D77",
      "en-US": "foldup"
    }),
    joinTip: common.localTrans({
      "zh-CN": "\u6B63\u5728\u52A0\u5165\u901A\u8BDD...",
      "en-US": "Joining call..."
    }),
    repeatTip: common.localTrans({
      "zh-CN": "\u5F53\u524D\u5DF2\u6709\u6B63\u5728\u8FDB\u884C\u4E2D\u7684\u901A\u8BDD, \u8BF7\u5148\u7ED3\u675F\u4E0A\u4E00\u573A\u901A\u8BDD",
      "en-US": "There is currently an active call, please end the previous call first"
    }),
    hangUp: common.localTrans({
      "zh-CN": "\u6302\u65AD",
      "en-US": "Hang Up"
    }),
    openCamera: common.localTrans({
      "zh-CN": "\u5F00\u542F\u6444\u50CF\u5934",
      "en-US": "Open Camera"
    }),
    closeCamera: common.localTrans({
      "zh-CN": "\u5173\u95ED\u6444\u50CF\u5934",
      "en-US": "Close Camera"
    }),
    openMic: common.localTrans({
      "zh-CN": "\u5F00\u542F\u9EA6\u514B\u98CE",
      "en-US": "Open Mic"
    }),
    closeMic: common.localTrans({
      "zh-CN": "\u5173\u95ED\u9EA6\u514B\u98CE",
      "en-US": "Close Mic"
    }),
    openScreensharing: common.localTrans({
      "zh-CN": "\u5F00\u542F\u5C4F\u5E55\u5171\u4EAB",
      "en-US": "Open Screensharing"
    }),
    closeScreensharing: common.localTrans({
      "zh-CN": "\u5173\u95ED\u5C4F\u5E55\u5171\u4EAB",
      "en-US": "Close Screensharing"
    }),
    someoneScreenName: common.localTrans({
      "zh-CN": " \u7684\u5C4F\u5E55",
      "en-US": "'s Screen"
    })
  };

  const FloatMeetingWindow = component.Loadable(() => new Promise(function (resolve, reject) { require(['./window-5ac8f151'], resolve, reject); }).then((module) => module.FloatMeetingWindow), {
    showLoading: true
  });
  let currentMeeting = null;
  function startFastMeeting(meetingId) {
    if (currentMeeting) {
      common.showToasts(Translate.repeatTip);
      return;
    }
    currentMeeting = meetingId;
    const key = component.PortalAdd(/* @__PURE__ */ React__default["default"].createElement(FloatMeetingWindow, {
      meetingId,
      onClose: () => {
        component.PortalRemove(key);
        currentMeeting = null;
      }
    }));
  }

  console.log("Plugin \u58F0\u7F51\u97F3\u89C6\u9891 is loaded");
  common.regPluginPanelAction({
    name: "plugin:com.msgbyte.agora/groupAction",
    label: Translate.startCall,
    position: "group",
    icon: "mdi:video-box",
    onClick: ({ groupId, panelId }) => {
      component.openConfirmModal({
        title: Translate.startCall,
        content: Translate.startCallContent,
        onConfirm: async () => {
          startFastMeeting(`${groupId}|${panelId}`);
        }
      });
    }
  });

  exports.Translate = Translate;

}));
//# sourceMappingURL=index-ca4278ca.js.map
