definePlugin('@plugins/com.msgbyte.livekit/InviteCallNotification-3e6bb47b.js', ['exports', 'react', 'styled-components', './index-c1925de8', '@capital/component', '@capital/common', 'zustand', 'zustand/middleware/immer'], (function (exports, React, styled, index, component, common, zustand, immer) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

  const Root = styled__default["default"].div`
  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 20px;
  }
`;
  const InviteCallNotification = React__default["default"].memo((props) => {
    return /* @__PURE__ */ React__default["default"].createElement(Root, null, /* @__PURE__ */ React__default["default"].createElement("audio", {
      src: "/audio/telephone.mp3",
      loop: true,
      autoPlay: true
    }), /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement("b", null, /* @__PURE__ */ React__default["default"].createElement(component.UserNamePure, {
      userId: props.senderUserId
    })), " ", index.Translate.inviteJoinCall), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "actions"
    }, /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: "mdi:phone-in-talk",
      onClick: props.onJoin
    })));
  });
  InviteCallNotification.displayName = "InviteCallNotification";

  exports["default"] = InviteCallNotification;

}));
//# sourceMappingURL=InviteCallNotification-3e6bb47b.js.map
