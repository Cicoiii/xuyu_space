definePlugin('@plugins/com.msgbyte.wxpusher/SettingsPanel-6a1583d0.js', ['exports', 'react', '@capital/common', '@capital/component'], (function (exports, React, common, component) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const Translate = {
    loadingState: common.localTrans({
      "zh-CN": "\u6B63\u5728\u68C0\u67E5\u7ED1\u5B9A\u72B6\u6001",
      "en-US": "Checking binding status"
    }),
    binded: common.localTrans({
      "zh-CN": "\u5DF2\u7ED1\u5B9A",
      "en-US": "Binded"
    }),
    currentWXPusherId: common.localTrans({
      "zh-CN": "\u5F53\u524D wxpusher ID",
      "en-US": "Current wxpusher uid"
    }),
    loadingQRCode: common.localTrans({
      "zh-CN": "\u6B63\u5728\u52A0\u8F7D\u7ED1\u5B9A\u4E8C\u7EF4\u7801",
      "en-US": "Binding QR code is loading"
    }),
    useWechatBindTip: common.localTrans({
      "zh-CN": "\u4F7F\u7528\u5FAE\u4FE1\u626B\u7801\u7ED1\u5B9A wxpusher",
      "en-US": "Use wechat scan QRCode to bind wxpusher"
    })
  };

  const request = common.createPluginRequest("com.msgbyte.wxpusher");
  const SettingsPanel = React__default["default"].memo(() => {
    const [wxpusherUserId, setWxpusherUserId] = React.useState("");
    const { loading, error } = common.useAsync(async () => {
      const { data } = await request.get("getWXPusherUserId");
      setWxpusherUserId(data);
    }, []);
    if (loading) {
      return /* @__PURE__ */ React__default["default"].createElement(component.LoadingSpinner, {
        tip: Translate.loadingState
      });
    }
    if (error) {
      return /* @__PURE__ */ React__default["default"].createElement(component.ErrorView, {
        error
      });
    }
    return wxpusherUserId ? /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement("div", null, Translate.binded), /* @__PURE__ */ React__default["default"].createElement("div", null, Translate.currentWXPusherId, ": ", wxpusherUserId)) : /* @__PURE__ */ React__default["default"].createElement(QRCode, {
      onBindSuccess: (wxpusherUserId2) => {
        setWxpusherUserId(wxpusherUserId2);
      }
    });
  });
  SettingsPanel.displayName = "SettingsPanel";
  const QRCode = React__default["default"].memo((props) => {
    const {
      loading,
      error,
      value: url
    } = common.useAsync(async () => {
      const { data } = await request.post("createQRCode");
      return data.data.url;
    }, []);
    const onBindSuccessRef = React.useRef(props.onBindSuccess);
    onBindSuccessRef.current = props.onBindSuccess;
    React.useLayoutEffect(() => {
      let timer;
      async function loop() {
        const { data: wxpusherUserId } = await request.get("getWXPusherUserId");
        if (wxpusherUserId) {
          onBindSuccessRef.current(wxpusherUserId);
        } else {
          timer = window.setTimeout(loop, 4 * 1e3);
        }
      }
      loop();
      return () => {
        if (timer) {
          window.clearTimeout(timer);
        }
      };
    }, []);
    if (loading) {
      return /* @__PURE__ */ React__default["default"].createElement(component.LoadingSpinner, {
        tip: Translate.loadingQRCode
      });
    }
    if (error) {
      return /* @__PURE__ */ React__default["default"].createElement(component.ErrorView, {
        error
      });
    }
    return /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement("div", null, Translate.useWechatBindTip), /* @__PURE__ */ React__default["default"].createElement("img", {
      width: 260,
      src: url
    }));
  });
  QRCode.displayName = "QRCode";

  exports.QRCode = QRCode;
  exports["default"] = SettingsPanel;

}));
//# sourceMappingURL=SettingsPanel-6a1583d0.js.map
