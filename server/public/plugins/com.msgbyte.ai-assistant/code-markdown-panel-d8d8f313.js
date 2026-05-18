definePlugin('@plugins/com.msgbyte.ai-assistant/code-markdown-panel-d8d8f313.js', ['exports', 'react', '@capital/common', '@capital/component'], (function (exports, React, common, component) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const BRAND = "var(--tc-primary-color)";
  const BRAND_HOVER = "var(--tc-primary-hover-color)";
  const SURFACE = "var(--tc-surface-panel-color)";
  const SURFACE_SOFT = "var(--tc-surface-soft-color)";
  const BORDER = "var(--tc-border-color)";
  const TEXT = "var(--tc-text-color)";
  const TEXT_SECONDARY = "var(--tc-text-secondary-color)";
  const TEXT_MUTED = "var(--tc-text-muted-color)";
  const T = {
    sendCode: common.localTrans({ "zh-CN": "\u53D1\u9001\u4EE3\u7801", "en-US": "Send Code" }),
    sendMarkdown: common.localTrans({ "zh-CN": "\u53D1\u9001 Markdown", "en-US": "Send Markdown" }),
    language: common.localTrans({ "zh-CN": "\u8BED\u8A00", "en-US": "Language" }),
    placeholder: common.localTrans({ "zh-CN": "\u8BF7\u8F93\u5165\u5185\u5BB9...", "en-US": "Enter content..." }),
    send: common.localTrans({ "zh-CN": "\u53D1\u9001", "en-US": "Send" }),
    cancel: common.localTrans({ "zh-CN": "\u53D6\u6D88", "en-US": "Cancel" })
  };
  const LANGUAGES = [
    "bash",
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "cpp",
    "go",
    "rust",
    "sql",
    "html",
    "css",
    "json",
    "yaml",
    "xml"
  ];
  const CodeMarkdownPanel = React__default["default"].memo((props) => {
    const { mode } = props;
    const [text, setText] = React.useState("");
    const [lang, setLang] = React.useState("javascript");
    const handleSend = React.useCallback(() => {
      if (!text.trim())
        return;
      const wrapped = mode === "code" ? `[code language=${lang}]${text}[/code]` : `[md]${text}[/md]`;
      props.onSend(wrapped);
      setTimeout(() => common.sharedEvent.emit("sendMessage"), 300);
    }, [text, lang, mode, props.onSend]);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        width: 440,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        background: SURFACE,
        color: TEXT,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 8px 40px rgba(0,0,0,0.08)"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "16px 20px 12px"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: BRAND,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: mode === "code" ? "mdi:code-tags" : "mdi:language-markdown-outline",
      style: { fontSize: 16, color: "#fff" }
    })), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: { fontSize: 15, fontWeight: 600, color: TEXT }
    }, mode === "code" ? T.sendCode : T.sendMarkdown)), mode === "code" && /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { padding: "0 20px 10px" }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: TEXT_MUTED,
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }
    }, T.language), /* @__PURE__ */ React__default["default"].createElement("select", {
      value: lang,
      onChange: (e) => setLang(e.target.value),
      style: {
        width: "100%",
        height: 36,
        borderRadius: 8,
        border: `1px solid ${BORDER}`,
        padding: "0 10px",
        fontSize: 13,
        color: TEXT,
        backgroundColor: SURFACE_SOFT,
        outline: "none",
        cursor: "pointer",
        transition: "border-color 0.15s ease"
      },
      onFocus: (e) => e.currentTarget.style.borderColor = BRAND,
      onBlur: (e) => e.currentTarget.style.borderColor = BORDER
    }, LANGUAGES.map((l) => /* @__PURE__ */ React__default["default"].createElement("option", {
      key: l,
      value: l
    }, l)))), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { padding: "0 20px 10px", flex: 1 }
    }, /* @__PURE__ */ React__default["default"].createElement("textarea", {
      value: text,
      onChange: (e) => setText(e.target.value),
      placeholder: T.placeholder,
      autoFocus: true,
      style: {
        width: "100%",
        minHeight: 180,
        maxHeight: "50vh",
        resize: "vertical",
        borderRadius: 12,
        border: `1px solid ${BORDER}`,
        padding: "12px 14px",
        fontSize: 13,
        lineHeight: 1.6,
        color: TEXT,
        backgroundColor: SURFACE_SOFT,
        outline: "none",
        fontFamily: mode === "code" ? "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace" : "inherit",
        transition: "border-color 0.15s ease"
      },
      onFocus: (e) => e.currentTarget.style.borderColor = BRAND,
      onBlur: (e) => e.currentTarget.style.borderColor = BORDER
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        padding: "4px 20px 18px"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("button", {
      onClick: props.onCancel,
      style: {
        flex: 1,
        height: 36,
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        color: TEXT_SECONDARY,
        backgroundColor: SURFACE_SOFT,
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.15s ease"
      },
      onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "var(--tc-border-soft-color)",
      onMouseLeave: (e) => e.currentTarget.style.backgroundColor = SURFACE_SOFT
    }, T.cancel), /* @__PURE__ */ React__default["default"].createElement("button", {
      onClick: handleSend,
      disabled: !text.trim(),
      style: {
        flex: 1,
        height: 36,
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        color: "#fff",
        backgroundColor: BRAND,
        border: "none",
        cursor: text.trim() ? "pointer" : "default",
        opacity: text.trim() ? 1 : 0.5,
        transition: "all 0.15s ease"
      },
      onMouseEnter: (e) => {
        if (text.trim())
          e.currentTarget.style.backgroundColor = BRAND_HOVER;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.backgroundColor = BRAND;
      }
    }, T.send)));
  });
  CodeMarkdownPanel.displayName = "CodeMarkdownPanel";

  exports.CodeMarkdownPanel = CodeMarkdownPanel;

}));
//# sourceMappingURL=code-markdown-panel-d8d8f313.js.map
