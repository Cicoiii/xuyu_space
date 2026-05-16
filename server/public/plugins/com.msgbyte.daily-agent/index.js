definePlugin('@plugins/com.msgbyte.daily-agent', ['@capital/component', 'react', '@capital/common'], (function (component, React, common) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const request = common.createPluginRequest("com.msgbyte.daily-agent");
  const DailyReportModal = ({ visible, onClose }) => {
    const [loading, setLoading] = React.useState(false);
    const [report, setReport] = React.useState(null);
    const [channels, setChannels] = React.useState([]);
    const [selectedChannels, setSelectedChannels] = React.useState([]);
    const loadChannels = React.useCallback(async () => {
      try {
        const data = await request.get("listChannels");
        if (data == null ? void 0 : data.list) {
          setChannels(data.list);
        }
      } catch (err) {
        console.error("Failed to load channels:", err);
      }
    }, []);
    React__default["default"].useEffect(() => {
      if (visible) {
        loadChannels();
      }
    }, [visible, loadChannels]);
    const handleGenerate = async () => {
      if (selectedChannels.length === 0) {
        alert("\u8BF7\u9009\u62E9\u81F3\u5C11\u4E00\u4E2A\u9891\u9053");
        return;
      }
      setLoading(true);
      try {
        const result = await request.post("generateReport", {
          channelIds: selectedChannels,
          panelIds: [],
          date: new Date().toISOString().split("T")[0]
        });
        if (result.result) {
          setReport(result.report);
        } else {
          alert(result.error || "\u751F\u6210\u5931\u8D25");
        }
      } catch (err) {
        alert(err.message || "\u751F\u6210\u5931\u8D25");
      } finally {
        setLoading(false);
      }
    };
    const handleClose = () => {
      setReport(null);
      setSelectedChannels([]);
      onClose();
    };
    const toggleChannel = (id) => {
      setSelectedChannels((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
    };
    if (!visible)
      return null;
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1e3
      },
      onClick: handleClose
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        background: "white",
        borderRadius: 8,
        width: 700,
        maxHeight: "80vh",
        overflow: "auto",
        padding: 24
      },
      onClick: (e) => e.stopPropagation()
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { fontSize: 18, fontWeight: "bold", marginBottom: 16 }
    }, "\u{1F4CA} \u65E5\u62A5\u751F\u6210\u5668"), loading && /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { textAlign: "center", padding: 40 }
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:loading",
      style: { fontSize: 32 }
    }), /* @__PURE__ */ React__default["default"].createElement("p", {
      style: { marginTop: 16 }
    }, "\u6B63\u5728\u5206\u6790\u804A\u5929\u8BB0\u5F55...")), !loading && !report && /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { marginBottom: 16 }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { marginBottom: 8, fontWeight: 500 }
    }, "\u9009\u62E9\u9891\u9053:"), /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        maxHeight: 200,
        overflow: "auto",
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: 8
      }
    }, channels.map((ch) => /* @__PURE__ */ React__default["default"].createElement("div", {
      key: ch.id,
      style: {
        padding: "4px 8px",
        cursor: "pointer",
        background: selectedChannels.includes(ch.id) ? "#e6f7ff" : "transparent",
        borderRadius: 4
      },
      onClick: () => toggleChannel(ch.id)
    }, ch.name)))), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      block: true,
      onClick: handleGenerate
    }, "\u751F\u6210\u65E5\u62A5")), !loading && report && /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        background: "#d4edda",
        padding: 8,
        borderRadius: 4,
        marginBottom: 16
      }
    }, "\u2705 \u65E5\u62A5\u751F\u6210\u5B8C\u6210"), /* @__PURE__ */ React__default["default"].createElement(component.Card, {
      size: "small",
      title: "\u{1F4C8} \u8FDB\u5EA6",
      style: { marginBottom: 12 }
    }, /* @__PURE__ */ React__default["default"].createElement("ul", {
      style: { paddingLeft: 20, margin: 0 }
    }, (report.progress || []).map((item, i) => /* @__PURE__ */ React__default["default"].createElement("li", {
      key: i,
      style: { marginBottom: 8 }
    }, item)))), /* @__PURE__ */ React__default["default"].createElement(component.Card, {
      size: "small",
      title: "\u2705 \u51B3\u7B56",
      style: { marginBottom: 12 }
    }, /* @__PURE__ */ React__default["default"].createElement("ul", {
      style: { paddingLeft: 20, margin: 0 }
    }, (report.decisions || []).map((item, i) => /* @__PURE__ */ React__default["default"].createElement("li", {
      key: i,
      style: { marginBottom: 8 }
    }, item)))), /* @__PURE__ */ React__default["default"].createElement(component.Card, {
      size: "small",
      title: "\u{1F6A7} \u963B\u788D",
      style: { marginBottom: 12 }
    }, /* @__PURE__ */ React__default["default"].createElement("ul", {
      style: { paddingLeft: 20, margin: 0, color: "#dc3545" }
    }, (report.blockers || []).map((item, i) => /* @__PURE__ */ React__default["default"].createElement("li", {
      key: i,
      style: { marginBottom: 8 }
    }, item)))), /* @__PURE__ */ React__default["default"].createElement(component.Card, {
      size: "small",
      title: "\u{1F4CB} \u5F85\u529E",
      style: { marginBottom: 12 }
    }, /* @__PURE__ */ React__default["default"].createElement("ul", {
      style: { paddingLeft: 20, margin: 0 }
    }, (report.todos || []).map((item, i) => /* @__PURE__ */ React__default["default"].createElement("li", {
      key: i,
      style: { marginBottom: 8 }
    }, item)))), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      block: true,
      onClick: handleClose
    }, "\u5173\u95ED"))));
  };

  const Translate = {
    dailyReport: component.common.localTrans({ "zh-CN": "\u65E5\u62A5\u751F\u6210", en: "Daily Report" }),
    openTool: component.common.localTrans({ "zh-CN": "\u6253\u5F00\u65E5\u62A5\u5DE5\u5177", en: "Open Tool" })
  };
  component.common.regCustomPanel({
    position: "personal",
    icon: "mdi:chart-box-outline",
    name: "com.msgbyte.daily-agent/report",
    label: Translate.dailyReport,
    render: () => /* @__PURE__ */ React__default["default"].createElement(DailyReportPanel, null)
  });
  const DailyReportPanel = () => {
    const [visible, setVisible] = React.useState(false);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { padding: 16 }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { textAlign: "center", marginBottom: 24 }
    }, /* @__PURE__ */ React__default["default"].createElement("h2", null, "\u{1F4CA} \u65E5\u62A5\u751F\u6210\u5668"), /* @__PURE__ */ React__default["default"].createElement("p", {
      style: { color: "#666" }
    }, "\u57FA\u4E8E\u7FA4\u804A\u8BB0\u5F55\u548C\u9879\u76EE\u6587\u6863\uFF0C\u81EA\u52A8\u751F\u6210\u7ED3\u6784\u5316\u65E5\u62A5")), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      size: "large",
      block: true,
      onClick: () => setVisible(true)
    }, Translate.openTool), /* @__PURE__ */ React__default["default"].createElement(DailyReportModal, {
      visible,
      onClose: () => setVisible(false)
    }));
  };

  return DailyReportPanel;

}));
//# sourceMappingURL=index.js.map
