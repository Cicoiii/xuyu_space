definePlugin('@plugins/com.msgbyte.topic/TopicInboxItem-42cc49eb.js', ['exports', 'react', './TopicCard-b3cc91b1', '@capital/component', './index-f8f06e03', '@capital/common', 'styled-components', 'zustand', 'zustand/middleware/immer'], (function (exports, React, TopicCard, component, index, common, styled, create, immer) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const TopicInboxItem = React__default["default"].memo((props) => {
    const payload = props.inboxItem.payload;
    if (!payload) {
      return /* @__PURE__ */ React__default["default"].createElement(component.Problem, {
        text: index.Translate.topicDataError
      });
    }
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { width: "100%" }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { height: "100%", overflow: "auto", paddingBottom: 50 }
    }, /* @__PURE__ */ React__default["default"].createElement(TopicCard.TopicCard, {
      topic: payload
    })), /* @__PURE__ */ React__default["default"].createElement(component.JumpToGroupPanelButton, {
      groupId: payload.groupId,
      panelId: payload.panelId
    }));
  });
  TopicInboxItem.displayName = "TopicInboxItem";

  exports.TopicInboxItem = TopicInboxItem;

}));
//# sourceMappingURL=TopicInboxItem-42cc49eb.js.map
