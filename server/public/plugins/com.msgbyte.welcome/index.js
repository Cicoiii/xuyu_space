definePlugin('@plugins/com.msgbyte.welcome', ['@capital/common', '@capital/component', 'react', 'styled-components'], (function (common, component, React, styled) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

  const Translate = {
    welcomeText: common.localTrans({ "zh-CN": "\u6B22\u8FCE\u8BCD", "en-US": "Welcome Text" }),
    welcomeTip: common.localTrans({
      "zh-CN": "\u5411\u65B0\u6210\u5458\u53D1\u9001\u5165\u7FA4\u6B22\u8FCE\u6D88\u606F",
      "en-US": "Send welcome message when new member"
    }),
    welcomeDesc: common.localTrans({
      "zh-CN": "\u6E05\u7A7A\u5219\u89C6\u4E3A\u4E0D\u542F\u7528\uFF0C\u5305\u542B\u90E8\u5206\u7279\u6B8A\u5199\u6CD5\uFF0C\u5982{nickname}\u8868\u793A\u7528\u6237\u6635\u79F0, {@nickname}\u8868\u793A @ \u5BF9\u65B9\u3002\u540C\u65F6\u652F\u6301\u5BCC\u6587\u672C\u8BED\u6CD5\u3002",
      "en-US": "If it is empty, it will be regarded as disabled, including some special writing, such as {nickname} means user nickname, {@nickname} means @ target member.Also supports rich text syntax."
    })
  };

  console.log("Plugin Group Welcome is loaded");
  const Desc = styled__default["default"].div`
  color: rgba(#999, 0.8);
  font-size: 9px;
  margin-top: 2px;
`;
  common.regPluginGroupConfigItem({
    name: "groupWelcomeText",
    title: Translate.welcomeText,
    tip: Translate.welcomeTip,
    component: ({ value, onChange, loading }) => {
      const [text, setText] = React.useState(value != null ? value : "");
      return /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement(component.TextArea, {
        disabled: loading,
        value: text,
        maxLength: 2e3,
        showCount: true,
        rows: 5,
        onChange: (e) => setText(e.target.value),
        onBlur: () => onChange(text)
      }), /* @__PURE__ */ React__default["default"].createElement(Desc, null, Translate.welcomeDesc));
    }
  });

}));
//# sourceMappingURL=index.js.map
