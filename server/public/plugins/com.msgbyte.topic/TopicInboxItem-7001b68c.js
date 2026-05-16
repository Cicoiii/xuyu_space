definePlugin('@plugins/com.msgbyte.topic/TopicInboxItem-7001b68c.js', ['exports', 'react', './TopicCard-dd8b2221', '@capital/component', './index-2df3cc0c', '@capital/common', 'styled-components'], (function (exports, React, TopicCard, component, index, common, styled) { 'use strict';

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
//# sourceMappingURL=TopicInboxItem-7001b68c.js.map
