definePlugin('@plugins/com.msgbyte.livekit/LivekitPanel-0db0f04a.js', ['exports', '@capital/common', '@capital/component', 'react', './LivekitView-18f5eee2', './useRoomParticipants-733f51b1', './index-c1925de8', 'zustand', 'zustand/middleware/immer', 'styled-components'], (function (exports, common, component, React, LivekitView, useRoomParticipants, index, zustand, immer, styled) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const LivekitGroupPanel = React__default["default"].memo(() => {
    const { groupId, panelId } = common.useGroupPanelContext();
    const roomName = `${groupId}#${panelId}`;
    const url = `/main/group/${groupId}/${panelId}`;
    return /* @__PURE__ */ React__default["default"].createElement(component.GroupPanelContainer, {
      groupId,
      panelId
    }, /* @__PURE__ */ React__default["default"].createElement(LivekitView.LivekitView, {
      style: { width: "100%", height: "100%" },
      roomName,
      url
    }));
  });
  LivekitGroupPanel.displayName = "LivekitGroupPanel";

  exports.LivekitGroupPanel = LivekitGroupPanel;
  exports["default"] = LivekitGroupPanel;

}));
//# sourceMappingURL=LivekitPanel-0db0f04a.js.map
