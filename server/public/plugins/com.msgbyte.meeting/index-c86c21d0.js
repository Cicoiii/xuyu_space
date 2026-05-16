definePlugin('@plugins/com.msgbyte.meeting/index-c86c21d0.js', ['require', 'exports', '@capital/common', '@capital/component', 'react'], (function (require, exports, common, component, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const request = common.createPluginRequest("com.msgbyte.meeting");

  async function createMeetingAndShare(groupId, panelId) {
    const userInfo = await common.getJWTUserInfo();
    const { data } = await request.post("create");
    const meetingId = data.roomId;
    const fullUrl = `${location.origin}/plugin/meeting/${meetingId}`;
    window.open(fullUrl);
    common.sendMessage({
      groupId,
      converseId: panelId,
      content: `${userInfo.nickname} \u53D1\u8D77\u4E86\u901A\u8BDD\uFF0C\u70B9\u51FB\u94FE\u63A5\u5FEB\u901F\u52A0\u5165\u4F1A\u8BAE: ${fullUrl}`
    });
  }

  const Translate = {
    meeting: common.localTrans({ "zh-CN": "\u89C6\u9891\u4F1A\u8BAE", "en-US": "Meeting" }),
    meetingService: common.localTrans({
      "zh-CN": "\u89C6\u9891\u4F1A\u8BAE\u670D\u52A1",
      "en-US": "Meeting Service"
    })
  };

  console.log("Plugin \u97F3\u89C6\u9891\u670D\u52A1 is loaded");
  async function startFastMeeting(meetingId) {
    const module = await new Promise(function (resolve, reject) { require(['./index-a09c467a'], resolve, reject); });
    module.startFastMeeting(meetingId);
  }
  common.regPluginPanelAction({
    name: "plugin:com.msgbyte.meeting/dmAction",
    label: "\u53D1\u8D77\u901A\u8BDD",
    position: "dm",
    icon: "mdi:video-box",
    onClick: ({ converseId }) => {
      startFastMeeting(converseId).then(() => {
        request.post("inviteUserConverseJoinMeeting", {
          meetingId: converseId,
          converseId
        });
      });
    }
  });
  common.regPluginPanelAction({
    name: "plugin:com.msgbyte.meeting/groupAction",
    label: "\u53D1\u8D77\u901A\u8BDD",
    position: "group",
    icon: "mdi:video-box",
    onClick: ({ groupId, panelId }) => {
      component.openConfirmModal({
        title: "\u53D1\u8D77\u901A\u8BDD",
        content: "\u6253\u5F00 tailchat-meeting \u5F00\u59CB\u901A\u8BDD\u5E76\u5411\u5F53\u524D\u4F1A\u8BDD\u53D1\u9001\u4F1A\u8BAE\u94FE\u63A5",
        onConfirm: async () => {
          await createMeetingAndShare(groupId, panelId);
        }
      });
    }
  });
  common.regPluginRootRoute({
    name: "plugin:com.msgbyte.meeting/route",
    path: "/meeting/:meetingId",
    component: common.Loadable(() => new Promise(function (resolve, reject) { require(['./MeetingUrlWrapper-8d01b093'], resolve, reject); }))
  });
  common.regInspectService({
    name: "plugin:com.msgbyte.meeting",
    label: Translate.meetingService
  });
  common.regSocketEventListener({
    eventName: "plugin:com.msgbyte.meeting.inviteJoinMeeting",
    eventFn: async ({
      meetingId,
      fromId
    }) => {
      console.log(meetingId);
      const selfInfo = await common.getJWTUserInfo();
      if (selfInfo._id === fromId) {
        return;
      }
      const userInfo = await common.getCachedUserInfo(fromId);
      const key = `open${Date.now()}`;
      component.notification.open({
        message: "\u89C6\u9891\u4F1A\u8BAE\u9080\u8BF7",
        description: `${userInfo.nickname} \u9080\u8BF7\u60A8\u52A0\u5165\u89C6\u9891\u4F1A\u8BAE`,
        duration: 0,
        key,
        btn: /* @__PURE__ */ React__default["default"].createElement(component.Button, {
          type: "primary",
          onClick: () => {
            startFastMeeting(meetingId);
            component.notification.close(key);
          }
        }, "\u7ACB\u5373\u52A0\u5165"),
        onClose: () => {
        }
      });
    }
  });

  exports.request = request;

}));
//# sourceMappingURL=index-c86c21d0.js.map
