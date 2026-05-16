definePlugin('@plugins/com.msgbyte.livekit/index-c1925de8.js', ['require', 'exports', '@capital/common', '@capital/component', 'zustand', 'zustand/middleware/immer', 'react'], (function (require, exports, common, component, zustand, immer, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const useLivekitState = zustand.create()(immer.immer((set, get) => ({
    isActive: false,
    currentMeetingId: "",
    url: "",
    autoInviteIds: Array.isArray(window.autoInviteIds) ? window.autoInviteIds : [],
    activeRoom: null,
    setActive(url) {
      set((state) => {
        state.isActive = true;
        state.url = url;
      });
    },
    async setDeactive() {
      const { activeRoom } = get();
      if (activeRoom) {
        await activeRoom.disconnect(true);
      }
      set((state) => {
        state.isActive = false;
        state.url = "";
        state.activeRoom = null;
      });
    }
  })));

  function useIconIsShow() {
    return useLivekitState().isActive;
  }
  function usePersionPanelIsShow() {
    return useLivekitState().isActive;
  }

  const Translate = {
    voiceChannel: common.localTrans({
      "zh-CN": "\u8BED\u97F3\u9891\u9053",
      "en-US": "Voice Channel"
    }),
    joinLabel: common.localTrans({
      "zh-CN": "\u52A0\u5165\u623F\u95F4",
      "en-US": "Join Room"
    }),
    micLabel: common.localTrans({
      "zh-CN": "\u9EA6\u514B\u98CE",
      "en-US": "Microphone"
    }),
    camLabel: common.localTrans({
      "zh-CN": "\u6444\u50CF\u5934",
      "en-US": "Camera"
    }),
    startScreenShare: common.localTrans({
      "zh-CN": "\u5206\u4EAB\u5C4F\u5E55",
      "en-US": "Share screen"
    }),
    stopScreenShare: common.localTrans({
      "zh-CN": "\u505C\u6B62\u5206\u4EAB\u5C4F\u5E55",
      "en-US": "Stop screen share"
    }),
    startAudio: common.localTrans({
      "zh-CN": "\u542F\u52A8\u97F3\u9891\u64AD\u653E",
      "en-US": "Start Audio"
    }),
    toVoiceChannel: common.localTrans({
      "zh-CN": "\u70B9\u51FB\u8DF3\u8F6C\u5230\u6D3B\u8DC3\u9891\u9053",
      "en-US": "Click to Active Channel"
    }),
    someonesScreen: common.localTrans({
      "zh-CN": "\u7684\u5C4F\u5E55",
      "en-US": "'s screen"
    }),
    chat: common.localTrans({
      "zh-CN": "\u804A\u5929",
      "en-US": "Chat"
    }),
    member: common.localTrans({
      "zh-CN": "\u6210\u5458",
      "en-US": "Member"
    }),
    leave: common.localTrans({
      "zh-CN": "\u79BB\u5F00",
      "en-US": "Leave"
    }),
    send: common.localTrans({
      "zh-CN": "\u53D1\u9001",
      "en-US": "Send"
    }),
    enterMessage: common.localTrans({
      "zh-CN": "\u8F93\u5165\u6D88\u606F...",
      "en-US": "Enter a message..."
    }),
    isSpeaking: common.localTrans({
      "zh-CN": "\u6B63\u5728\u53D1\u8A00",
      "en-US": "Is speaking"
    }),
    nobodyInMeeting: common.localTrans({
      "zh-CN": "\u5F53\u524D\u65E0\u4EBA\u5728\u4F1A...",
      "en-US": "Nobody in Meeting..."
    }),
    peopleInMeeting: common.localTrans({
      "zh-CN": "\u8FD9\u4E9B\u4EBA\u6B63\u5728\u4F1A\u4E2D:",
      "en-US": "Here is people in meeting:"
    }),
    notSupportDOMFullscreen: common.localTrans({
      "zh-CN": "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u89C6\u56FE\u5168\u5C4F",
      "en-US": "Current browser does not support DOM full screen"
    }),
    startCall: common.localTrans({
      "zh-CN": "\u53D1\u8D77/\u52A0\u5165\u901A\u8BDD",
      "en-US": "Start/Join Call"
    }),
    isCalling: common.localTrans({
      "zh-CN": "\u6B63\u5728\u547C\u53EB",
      "en-US": "Is calling"
    }),
    callFailed: common.localTrans({
      "zh-CN": "\u7528\u6237\u547C\u53EB\u5931\u8D25\uFF0C\u8BE5\u7528\u6237\u79BB\u7EBF",
      "en-US": "The user call failed because of offline"
    }),
    inviteJoinCall: common.localTrans({
      "zh-CN": "\u9080\u8BF7\u4F60\u52A0\u5165\u4F1A\u8BDD",
      "en-US": "invite you to join conversation"
    }),
    notFoundMeeting: common.localTrans({
      "zh-CN": "\u6CA1\u6709\u627E\u5230\u4F1A\u8BAE",
      "en-US": "Not found meeting"
    })
  };

  const PLUGIN_ID = "com.msgbyte.livekit";

  console.log(`Plugin ${PLUGIN_ID} is loaded`);
  (() => {
    new Audio("/audio/telephone.mp3").preload = "auto";
  })();
  const LivekitPanel = component.Loadable(() => new Promise(function (resolve, reject) { require(['./LivekitPanel-0db0f04a'], resolve, reject); }), {
    componentName: `${PLUGIN_ID}:LivekitPanel`
  });
  const LivekitMeetingPanel = component.Loadable(() => new Promise(function (resolve, reject) { require(['./LivekitMeetingPanel-78deb1a4'], resolve, reject); }), {
    componentName: `${PLUGIN_ID}:LivekitMeetingPanel`
  });
  const InviteCallNotification = component.Loadable(() => new Promise(function (resolve, reject) { require(['./InviteCallNotification-3e6bb47b'], resolve, reject); }), {
    componentName: `${PLUGIN_ID}:InviteCallNotification`
  });
  common.regGroupPanel({
    name: `${PLUGIN_ID}/livekitPanel`,
    label: Translate.voiceChannel,
    provider: PLUGIN_ID,
    render: LivekitPanel
  });
  common.regGroupPanelBadge({
    name: `${PLUGIN_ID}/livekitPanelBadge`,
    panelType: `${PLUGIN_ID}/livekitPanel`,
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./LivekitPanelBadge-48f9a5ba'], resolve, reject); }), {
      componentName: `${PLUGIN_ID}:LivekitPanelBadge`,
      fallback: null
    })
  });
  common.regCustomPanel({
    position: "navbar-more",
    icon: "mingcute:voice-line",
    name: `${PLUGIN_ID}/livekitNavbarIcon`,
    label: Translate.toVoiceChannel,
    render: component.Loadable(() => new Promise(function (resolve, reject) { require(['./redirect-48ab1eba'], resolve, reject); }).then((module) => module.LivekitNavbarRedirect), {
      componentName: `${PLUGIN_ID}:LivekitNavbarRedirect`
    }),
    useIsShow: useIconIsShow
  });
  common.regPluginPanelRoute({
    name: `${PLUGIN_ID}/livekitPanel`,
    path: `/${PLUGIN_ID}/meeting/:meetingId`,
    component: LivekitMeetingPanel
  });
  common.regCustomPanel({
    position: "personal",
    icon: "mingcute:voice-line",
    name: `${PLUGIN_ID}/livekitPersonMeeting`,
    label: Translate.voiceChannel,
    render: LivekitMeetingPanel,
    useIsShow: usePersionPanelIsShow
  });
  common.regPluginPanelAction({
    name: `${PLUGIN_ID}/groupAction`,
    label: Translate.startCall,
    position: "dm",
    icon: "mdi:video-box",
    onClick: ({ converseId }) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const state = (_a = common.getGlobalState()) != null ? _a : {};
      const currentUserId = (_d = (_c = (_b = state.user) == null ? void 0 : _b.info) == null ? void 0 : _c._id) != null ? _d : "";
      const members = (_h = (_g = (_f = (_e = state.chat) == null ? void 0 : _e.converses) == null ? void 0 : _f[converseId]) == null ? void 0 : _g.members) != null ? _h : [];
      const shouldInviteUserIds = members.filter((m) => m !== currentUserId);
      if (common.isMobile()) {
        useLivekitState.setState({
          currentMeetingId: converseId,
          autoInviteIds: shouldInviteUserIds
        });
        const url = `/main/personal/custom/${PLUGIN_ID}/livekitPersonMeeting`;
        common.navigate(url);
      } else {
        const win = common.panelWindowManager.open(`/panel/plugin/${PLUGIN_ID}/meeting/${converseId}`, {
          width: 1280,
          height: 768
        });
        win.window.autoInviteIds = shouldInviteUserIds;
      }
    }
  });
  common.regSocketEventListener({
    eventName: `plugin:${PLUGIN_ID}.inviteCall`,
    eventFn: (data) => {
      const { senderUserId, roomName } = data;
      const close = common.showNotification(/* @__PURE__ */ React__default["default"].createElement(InviteCallNotification, {
        senderUserId,
        onJoin: () => {
          common.panelWindowManager.open(`/panel/plugin/${PLUGIN_ID}/meeting/${roomName}`, {
            width: 1280,
            height: 768
          });
          close();
        }
      }), 0);
    }
  });

  exports.PLUGIN_ID = PLUGIN_ID;
  exports.Translate = Translate;
  exports.useLivekitState = useLivekitState;

}));
//# sourceMappingURL=index-c1925de8.js.map
