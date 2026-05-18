definePlugin('@plugins/com.msgbyte.ai-assistant/popover-0fdc360c.js', ['exports', 'react', '@capital/common', '@capital/component', './index-7aab6071'], (function (exports, React, common, component, index) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const Translate = {
    name: common.localTrans({
      "zh-CN": "\u5C0F\u5E8F\u52A9\u624B",
      "en-US": "XiaoXu AI"
    }),
    helpMeTo: common.localTrans({
      "zh-CN": "\u6211\u53EF\u4EE5\u5E2E\u4F60\uFF1A",
      "en-US": "I can help you:"
    }),
    improveText: common.localTrans({
      "zh-CN": "\u6DA6\u8272\u6587\u672C",
      "en-US": "Improve Text"
    }),
    makeShorter: common.localTrans({
      "zh-CN": "\u7CBE\u7B80\u5185\u5BB9",
      "en-US": "Make Shorter"
    }),
    makeLonger: common.localTrans({
      "zh-CN": "\u6269\u5199\u5185\u5BB9",
      "en-US": "Make Longer"
    }),
    summaryMessages: common.localTrans({
      "zh-CN": "\u603B\u7ED3\u804A\u5929\u8BB0\u5F55",
      "en-US": "Summary Messages"
    }),
    translateInputText: common.localTrans({
      "zh-CN": "\u7FFB\u8BD1\u5185\u5BB9",
      "en-US": "Translate Input"
    }),
    inputTextShowMoreActionTip: common.localTrans({
      "zh-CN": "\u5728\u8F93\u5165\u6846\u4E2D\u8F93\u5165\u5185\u5BB9\u540E\u89E3\u9501\u66F4\u591A\u529F\u80FD",
      "en-US": "Type something to unlock more features"
    }),
    serviceBusy: common.localTrans({
      "zh-CN": "\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
      "en-US": "Request failed, please try again later"
    }),
    callError: common.localTrans({
      "zh-CN": "\u8C03\u7528\u5931\u8D25",
      "en-US": "Call Error"
    }),
    apply: common.localTrans({
      "zh-CN": "\u5E94\u7528",
      "en-US": "Apply"
    }),
    send: common.localTrans({
      "zh-CN": "\u53D1\u9001",
      "en-US": "Send"
    }),
    aiThinking: common.localTrans({
      "zh-CN": "\u5C0F\u5E8F\u6B63\u5728\u601D\u8003\u4E2D...",
      "en-US": "AI is thinking..."
    }),
    aiDeepThinking: common.localTrans({
      "zh-CN": "\u5C0F\u5E8F\u6B63\u5728\u6DF1\u5EA6\u601D\u8003\u4E2D...",
      "en-US": "AI is deep thinking..."
    }),
    networkError: common.localTrans({
      "zh-CN": "\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25",
      "en-US": "Network request failed"
    }),
    thinkMode: common.localTrans({
      "zh-CN": "\u6DF1\u5EA6\u601D\u8003",
      "en-US": "Deep Think"
    }),
    showReasoning: common.localTrans({
      "zh-CN": "\u67E5\u770B\u601D\u8003\u8FC7\u7A0B",
      "en-US": "Show Reasoning"
    }),
    hideReasoning: common.localTrans({
      "zh-CN": "\u6536\u8D77\u601D\u8003\u8FC7\u7A0B",
      "en-US": "Hide Reasoning"
    })
  };

  const BRAND = "var(--tc-primary-color)";
  const BRAND_HOVER = "var(--tc-primary-hover-color)";
  const BRAND_SUBTLE = "var(--tc-primary-faint-strong-color)";
  const SURFACE = "var(--tc-surface-panel-color)";
  const SURFACE_SOFT = "var(--tc-surface-soft-color)";
  const BORDER = "var(--tc-border-color)";
  const BORDER_SOFT = "var(--tc-border-soft-color)";
  const TEXT = "var(--tc-text-color)";
  const TEXT_SECONDARY = "var(--tc-text-secondary-color)";
  const TEXT_MUTED = "var(--tc-text-muted-color)";
  const actionItems = [
    { key: "summary", icon: "mdi:text-box-check-outline" },
    { key: "improve", icon: "mdi:auto-fix" },
    { key: "shorter", icon: "mdi:arrow-collapse-horizontal" },
    { key: "longer", icon: "mdi:arrow-expand-horizontal" },
    { key: "translate", icon: "mdi:translate" }
  ];
  const actionLabel = {
    chat: Translate.name,
    summary: Translate.summaryMessages,
    improve: Translate.improveText,
    shorter: Translate.makeShorter,
    longer: Translate.makeLonger,
    translate: Translate.translateInputText
  };
  const AssistantPopover = React__default["default"].memo((props) => {
    const { messages } = common.useConverseMessageContext();
    const { message, setMessage, sendMsg } = component.useChatInputActionContext();
    const [loading, setLoading] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [showReasoning, setShowReasoning] = React.useState(false);
    const resultRef = React.useRef(null);
    React.useEffect(() => {
      if (value && resultRef.current) {
        resultRef.current.scrollTop = resultRef.current.scrollHeight;
      }
    }, [value]);
    const handleCallAI = React.useCallback(async (content, action = "chat") => {
      setLoading(true);
      setValue(null);
      setShowReasoning(false);
      try {
        const res = await index.pluginRequest.post("chat", {
          content,
          action,
          thinkMode: false
        });
        setValue(res.data);
      } catch (e) {
        setValue({ result: false, answer: Translate.networkError });
      } finally {
        setLoading(false);
      }
    }, []);
    const handleSummary = React.useCallback(async () => {
      const plainMessages = (await Promise.all([...messages].filter((item) => !item.hasRecall).slice(messages.length - 30, messages.length).map(async (item) => {
        var _a;
        return `${(await common.getCachedUserInfo(item.author)).nickname}: ${common.getMessageTextDecorators().serialize((_a = item.content) != null ? _a : "")}`;
      }))).join("\n");
      handleCallAI(plainMessages, "summary");
    }, [messages, handleCallAI]);
    const handleApplyResult = React.useCallback((answer) => {
      setMessage(`[md]${answer}[/md]`);
      props.onCompleted();
    }, [setMessage, props.onCompleted]);
    const handleSendResult = React.useCallback((answer) => {
      sendMsg(`[md]${answer}[/md]`);
      setTimeout(() => {
        common.sharedEvent.emit("sendMessage");
      }, 300);
      props.onCompleted();
    }, [sendMsg, props.onCompleted]);
    const hasInput = typeof message === "string" && message.length > 0;
    const showResult = value !== null && !loading;
    const hasReasoning = (value == null ? void 0 : value.reasoning) && value.reasoning.trim().length > 0;
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        width: 400,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
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
        padding: "16px 20px 12px",
        flexShrink: 0
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
      icon: "mdi:creation",
      style: { fontSize: 16, color: "#fff" }
    })), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: TEXT,
        letterSpacing: "-0.01em"
      }
    }, Translate.name), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { flex: 1 }
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }
    }, loading ? /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "48px 20px"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.LoadingSpinner, null), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: { fontSize: 13, color: TEXT_MUTED }
    }, Translate.aiThinking)) : value !== null ? /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "0 20px 8px" }
    }, value.result ? /* @__PURE__ */ React__default["default"].createElement("div", {
      ref: resultRef,
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto"
      }
    }, hasReasoning && /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { marginBottom: 8 }
    }, /* @__PURE__ */ React__default["default"].createElement("button", {
      onClick: () => setShowReasoning((prev) => !prev),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 500,
        color: TEXT_SECONDARY,
        backgroundColor: SURFACE_SOFT,
        border: "none",
        cursor: "pointer",
        transition: "all 0.15s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.backgroundColor = BORDER_SOFT;
        e.currentTarget.style.color = TEXT;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.backgroundColor = SURFACE_SOFT;
        e.currentTarget.style.color = TEXT_SECONDARY;
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: showReasoning ? "mdi:chevron-down" : "mdi:chevron-right",
      style: { fontSize: 14 }
    }), /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:head-lightbulb-outline",
      style: { fontSize: 13 }
    }), showReasoning ? Translate.hideReasoning : Translate.showReasoning), showReasoning && /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        marginTop: 6,
        padding: "10px 14px",
        fontSize: 12,
        lineHeight: 1.7,
        color: TEXT_SECONDARY,
        backgroundColor: "var(--tc-warning-soft-color, rgba(234,179,8,0.12))",
        borderLeft: "3px solid #eab308",
        borderRadius: "0 8px 8px 0",
        maxHeight: 200,
        overflowY: "auto"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.Markdown, {
      raw: value.reasoning
    }))), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        fontSize: 14,
        lineHeight: 1.7,
        color: TEXT,
        backgroundColor: SURFACE_SOFT,
        borderRadius: 12,
        padding: "14px 16px"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.Markdown, {
      raw: value.answer
    }))) : /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        backgroundColor: "var(--tc-dangerous-soft-color, rgba(239,68,68,0.12))",
        borderRadius: 12,
        padding: "12px 16px",
        fontSize: 13
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { color: TEXT_SECONDARY, marginBottom: 4 }
    }, Translate.serviceBusy), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { color: "#ef4444" }
    }, value.answer))) : /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { flex: 1 }
    }), showResult && value.result && /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        padding: "8px 20px 14px",
        flexShrink: 0
      }
    }, /* @__PURE__ */ React__default["default"].createElement("button", {
      onClick: () => handleApplyResult(value.answer),
      style: {
        flex: 1,
        height: 36,
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        color: BRAND,
        backgroundColor: "transparent",
        border: "1px solid var(--tc-primary-strong-color)",
        cursor: "pointer",
        transition: "all 0.15s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.backgroundColor = BRAND_SUBTLE;
        e.currentTarget.style.borderColor = BRAND;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "var(--tc-primary-strong-color)";
      }
    }, Translate.apply), /* @__PURE__ */ React__default["default"].createElement("button", {
      onClick: () => handleSendResult(value.answer),
      style: {
        flex: 1,
        height: 36,
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        color: "#fff",
        backgroundColor: BRAND,
        border: "none",
        cursor: "pointer",
        transition: "all 0.15s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.backgroundColor = BRAND_HOVER;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.backgroundColor = BRAND;
      }
    }, Translate.send))), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        padding: "6px 20px 18px",
        flexShrink: 0
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: TEXT_MUTED,
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }
    }, Translate.helpMeTo), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { display: "flex", flexWrap: "wrap", gap: 6 }
    }, actionItems.map((item) => {
      const disabled = item.key !== "summary" && !hasInput;
      return /* @__PURE__ */ React__default["default"].createElement("button", {
        key: item.key,
        disabled,
        onClick: () => {
          if (disabled)
            return;
          if (item.key === "summary") {
            handleSummary();
          } else {
            handleCallAI(message, item.key);
          }
        },
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "6px 12px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 500,
          border: disabled ? `1px solid ${BORDER_SOFT}` : `1px solid ${BORDER}`,
          backgroundColor: disabled ? SURFACE_SOFT : "transparent",
          color: disabled ? TEXT_MUTED : TEXT_SECONDARY,
          cursor: disabled ? "default" : "pointer",
          transition: "all 0.15s ease",
          whiteSpace: "nowrap"
        },
        onMouseEnter: disabled ? void 0 : (e) => {
          e.currentTarget.style.backgroundColor = BRAND_SUBTLE;
          e.currentTarget.style.borderColor = "var(--tc-primary-shadow-color)";
          e.currentTarget.style.color = BRAND;
        },
        onMouseLeave: disabled ? void 0 : (e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = BORDER;
          e.currentTarget.style.color = TEXT_SECONDARY;
        }
      }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
        className: "flex-shrink-0",
        icon: item.icon,
        style: { fontSize: 13, opacity: disabled ? 0.4 : 0.55 }
      }), actionLabel[item.key]);
    }))));
  });
  AssistantPopover.displayName = "AssistantPopover";

  exports.AssistantPopover = AssistantPopover;

}));
//# sourceMappingURL=popover-0fdc360c.js.map
