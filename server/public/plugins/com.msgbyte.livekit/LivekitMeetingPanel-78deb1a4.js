definePlugin('@plugins/com.msgbyte.livekit/LivekitMeetingPanel-78deb1a4.js', ['exports', 'react', './LivekitView-18f5eee2', 'react-router', './index-c1925de8', '@capital/component', '@capital/common', './useRoomParticipants-733f51b1', 'styled-components', 'zustand', 'zustand/middleware/immer'], (function (exports, React, LivekitView, reactRouter, index, component, common, useRoomParticipants, styled, zustand, immer) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const LivekitMeetingPanel = React__default["default"].memo(() => {
    const { currentMeetingId, autoInviteIds } = index.useLivekitState();
    const { meetingId: paramsMeetingId } = reactRouter.useParams();
    const meetingId = paramsMeetingId || currentMeetingId;
    const url = paramsMeetingId ? `/${index.PLUGIN_ID}/meeting/${paramsMeetingId}` : `/main/personal/custom/${index.PLUGIN_ID}/livekitPersonMeeting`;
    if (!meetingId) {
      return /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "w-full h-full",
        style: { paddingTop: 40 }
      }, /* @__PURE__ */ React__default["default"].createElement(component.NotFound, {
        message: index.Translate.notFoundMeeting
      }));
    }
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "w-full h-full"
    }, /* @__PURE__ */ React__default["default"].createElement(LivekitView.LivekitView, {
      className: "w-full h-full",
      roomName: meetingId,
      url,
      autoInviteIds
    }));
  });
  LivekitMeetingPanel.displayName = "LivekitMeetingPanel";

  exports["default"] = LivekitMeetingPanel;

}));
//# sourceMappingURL=LivekitMeetingPanel-78deb1a4.js.map
