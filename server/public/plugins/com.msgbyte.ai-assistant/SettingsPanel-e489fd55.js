definePlugin('@plugins/com.msgbyte.ai-assistant/SettingsPanel-e489fd55.js', ['exports', 'react', '@capital/component', '@capital/common', 'styled-components', './index-7aab6071'], (function (exports, React, component, common, styled, index) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  const FLASH_MODEL = "deepseek-v4-flash";
  const defaultConfig = {
    providerName: "DeepSeek",
    apiUrl: "https://api.deepseek.com/v1",
    chatModel: FLASH_MODEL,
    thinkModel: FLASH_MODEL,
    configured: false,
    apiKeyMasked: ""
  };
  const providerPresets = [
    {
      name: "DeepSeek",
      apiUrl: "https://api.deepseek.com/v1",
      chatModel: FLASH_MODEL,
      thinkModel: FLASH_MODEL
    }
  ];
  const Root = styled__default["default"].div`
  max-width: 760px;
  color: var(--tc-text-color);

  .settings-header {
    margin-bottom: 16px;
  }

  .settings-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
  }

  .settings-desc {
    margin-top: 6px;
    color: var(--tc-text-muted-color);
    line-height: 1.6;
  }

  .settings-card {
    background: var(--tc-surface-panel-color);
    border: 1px solid var(--tc-border-color);
    border-radius: 8px;
  }

  .settings-section {
    padding: 14px 0;
    border-bottom: 1px solid var(--tc-border-soft-color);
  }

  .settings-section:first-child {
    padding-top: 0;
  }

  .settings-section:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .settings-section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .preset-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .form-field.full {
    grid-column: 1 / -1;
  }

  .field-label {
    color: var(--tc-text-secondary-color);
    font-size: 12px;
  }

  .field-input {
    width: 100%;
    min-width: 0;
    height: 34px;
    padding: 0 10px;
    color: var(--tc-text-color);
    background: var(--tc-surface-color);
    border: 1px solid var(--tc-border-color);
    border-radius: 6px;
    outline: none;
  }

  .field-input:focus {
    border-color: var(--tc-primary-color);
  }

  .field-tip {
    color: var(--tc-text-muted-color);
    font-size: 12px;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .status-line {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--tc-text-secondary-color);
    font-size: 13px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
  }

  .status-dot.ready {
    background: #22c55e;
  }

  @media (max-width: 720px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`;
  const SettingsPanel = React__default["default"].memo(() => {
    const [config, setConfig] = React.useState(defaultConfig);
    const [apiKey, setApiKey] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [testing, setTesting] = React.useState(false);
    const loadConfig = React.useCallback(async () => {
      setLoading(true);
      try {
        const { data } = await index.pluginRequest.get("getConfig");
        setConfig(__spreadValues(__spreadValues({}, defaultConfig), data != null ? data : {}));
        setApiKey("");
      } catch (err) {
        common.showErrorToasts(err);
      } finally {
        setLoading(false);
      }
    }, []);
    React.useEffect(() => {
      loadConfig();
    }, [loadConfig]);
    const updateField = (field, value) => {
      setConfig((prev) => __spreadProps(__spreadValues({}, prev), {
        [field]: value
      }));
    };
    const applyPreset = (preset) => {
      setConfig((prev) => __spreadProps(__spreadValues({}, prev), {
        providerName: preset.name,
        apiUrl: preset.apiUrl,
        chatModel: FLASH_MODEL,
        thinkModel: FLASH_MODEL
      }));
    };
    const handleSave = async () => {
      setSaving(true);
      try {
        const payload = {
          providerName: config.providerName,
          apiUrl: config.apiUrl,
          chatModel: FLASH_MODEL,
          thinkModel: FLASH_MODEL
        };
        if (apiKey.trim()) {
          payload.apiKey = apiKey.trim();
        }
        const { data } = await index.pluginRequest.post("updateConfig", payload);
        setConfig(__spreadValues(__spreadValues({}, defaultConfig), data != null ? data : {}));
        setApiKey("");
        common.showSuccessToasts();
      } catch (err) {
        common.showErrorToasts(err);
      } finally {
        setSaving(false);
      }
    };
    const handleTest = async () => {
      setTesting(true);
      try {
        const { data } = await index.pluginRequest.post("testConfig", {
          content: "\u8BF7\u7528\u4E00\u53E5\u8BDD\u56DE\u590D\uFF1A\u5C0F\u5E8F\u52A9\u624B\u914D\u7F6E\u8FDE\u63A5\u6210\u529F\u3002"
        });
        if (data == null ? void 0 : data.result) {
          common.showToasts(data.answer || "\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F", "success");
        } else {
          common.showToasts((data == null ? void 0 : data.answer) || "\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25", "error");
        }
      } catch (err) {
        common.showErrorToasts(err);
      } finally {
        setTesting(false);
      }
    };
    return /* @__PURE__ */ React__default["default"].createElement(Root, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-header"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-title"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:tune-variant"
    }), "\u5C0F\u5E8F\u52A9\u624B\u9AD8\u7EA7\u8BBE\u7F6E"), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-desc"
    }, "AI \u52A9\u624B\u5DF2\u9650\u5236\u4E3A Flash \u6A21\u578B\u8C03\u7528\uFF0C\u907F\u514D\u4F7F\u7528 Pro \u6216\u63A8\u7406\u6A21\u578B\u3002")), /* @__PURE__ */ React__default["default"].createElement(component.Card, {
      className: "settings-card",
      bordered: false
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-section"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-section-title"
    }, "\u670D\u52A1\u5546\u9884\u8BBE"), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "preset-row"
    }, providerPresets.map((preset) => /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      key: preset.name,
      onClick: () => applyPreset(preset)
    }, preset.name)))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-section"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-section-title"
    }, "\u8FDE\u63A5\u914D\u7F6E"), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "form-grid"
    }, /* @__PURE__ */ React__default["default"].createElement("label", {
      className: "form-field"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-label"
    }, "\u670D\u52A1\u5546\u540D\u79F0"), /* @__PURE__ */ React__default["default"].createElement("input", {
      className: "field-input",
      value: config.providerName,
      disabled: loading,
      placeholder: "\u4F8B\u5982 Qwen / OpenAI / DeepSeek",
      onChange: (event) => updateField("providerName", event.target.value)
    })), /* @__PURE__ */ React__default["default"].createElement("label", {
      className: "form-field"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-label"
    }, "\u666E\u901A\u6A21\u578B"), /* @__PURE__ */ React__default["default"].createElement("input", {
      className: "field-input",
      value: FLASH_MODEL,
      disabled: true,
      placeholder: FLASH_MODEL,
      readOnly: true
    })), /* @__PURE__ */ React__default["default"].createElement("label", {
      className: "form-field full"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-label"
    }, "API \u5730\u5740"), /* @__PURE__ */ React__default["default"].createElement("input", {
      className: "field-input",
      value: config.apiUrl,
      disabled: loading,
      placeholder: "https://api.openai.com/v1",
      onChange: (event) => updateField("apiUrl", event.target.value)
    }), /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-tip"
    }, "\u586B\u5199\u5230 /v1 \u5373\u53EF\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u8BF7\u6C42 /chat/completions\u3002")), /* @__PURE__ */ React__default["default"].createElement("label", {
      className: "form-field"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-label"
    }, "\u601D\u8003\u6A21\u578B"), /* @__PURE__ */ React__default["default"].createElement("input", {
      className: "field-input",
      value: FLASH_MODEL,
      disabled: true,
      placeholder: FLASH_MODEL,
      readOnly: true
    }), /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-tip"
    }, "\u5DF2\u9501\u5B9A\u4E3A Flash\uFF0C\u4FDD\u5B58\u65F6\u4E0D\u4F1A\u5199\u5165 Pro \u6A21\u578B\u3002")), /* @__PURE__ */ React__default["default"].createElement("label", {
      className: "form-field"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-label"
    }, "API Key"), /* @__PURE__ */ React__default["default"].createElement("input", {
      className: "field-input",
      type: "password",
      value: apiKey,
      disabled: loading,
      placeholder: config.configured ? `\u4FDD\u6301\u5F53\u524D Key (${config.apiKeyMasked})` : "\u8BF7\u8F93\u5165 API Key",
      onChange: (event) => setApiKey(event.target.value)
    }), /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "field-tip"
    }, "\u7559\u7A7A\u4FDD\u5B58\u65F6\u4F1A\u7EE7\u7EED\u4F7F\u7528\u5F53\u524D Key\uFF0C\u4E0D\u4F1A\u6E05\u9664\u5DF2\u6709\u914D\u7F6E\u3002")))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "settings-section"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "status-line"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: config.configured ? "status-dot ready" : "status-dot"
    }), config.configured ? `\u5DF2\u914D\u7F6E API Key\uFF1A${config.apiKeyMasked}` : "\u5C1A\u672A\u914D\u7F6E API Key"), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "actions"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      loading: saving,
      disabled: loading,
      onClick: handleSave
    }, "\u4FDD\u5B58\u914D\u7F6E"), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      loading: testing,
      disabled: loading || saving,
      onClick: handleTest
    }, "\u6D4B\u8BD5\u8FDE\u63A5"), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      disabled: loading || saving,
      onClick: loadConfig
    }, "\u91CD\u65B0\u8BFB\u53D6")))));
  });
  SettingsPanel.displayName = "SettingsPanel";

  exports["default"] = SettingsPanel;

}));
//# sourceMappingURL=SettingsPanel-e489fd55.js.map
