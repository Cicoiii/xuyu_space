definePlugin('@plugins/com.msgbyte.iam', ['@capital/common', 'react', '@capital/component'], (function (common, React, component) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const request = common.createPluginRequest("com.msgbyte.iam");

  const Translate = {
    iamLogin: common.localTrans({
      "zh-CN": "\u7B2C\u4E09\u65B9\u767B\u5F55",
      "en-US": "Third party login"
    }),
    loginFailed: common.localTrans({
      "zh-CN": "\u767B\u5F55\u5931\u8D25",
      "en-US": "Login Failed"
    }),
    accountExistedTip: common.localTrans({
      "zh-CN": "\u8D26\u53F7\u5DF2\u5B58\u5728\uFF0C\u8BF7\u4F7F\u7528\u8D26\u53F7\u5BC6\u7801\u767B\u5F55",
      "en-US": "Account Existed, please log in with account password"
    }),
    infoDeviantTip: common.localTrans({
      "zh-CN": "\u8D26\u53F7\u4FE1\u606F\u5F02\u5E38\uFF0C\u8BF7\u4F7F\u7528\u8D26\u53F7\u5BC6\u7801\u767B\u5F55",
      "en-US": "Account Info Deviant, please log in with account password"
    }),
    notSupportMobile: common.localTrans({
      "zh-CN": "\u7B2C\u4E09\u65B9\u767B\u5F55\u529F\u80FD\u6682\u4E0D\u652F\u6301\u79FB\u52A8\u7AEF\u4F7F\u7528",
      "en-US": "The third-party login function does not support mobile use"
    })
  };

  const IAMAction = React__default["default"].memo(() => {
    const { loading, value: strategies } = common.useAsync(async () => {
      const { data: strategies2 } = await request.get("availableStrategies");
      return strategies2;
    }, []);
    const newWin = React.useRef();
    const navigate = common.useNavigate();
    const isMobile = common.useIsMobile();
    React.useEffect(() => {
      const fn = (event) => {
        if (newWin.current && event.source === newWin.current) {
          newWin.current.close();
          const payload = event.data;
          if (payload.type === "existed") {
            common.showToasts(Translate.accountExistedTip, "warning");
          } else if (payload.type === "infoDeviant") {
            common.showToasts(Translate.infoDeviantTip, "error");
          } else if (payload.type === "token") {
            const token = payload.token;
            common.setUserJWT(token).then(common.loginWithToken(token)).then(() => {
              navigate("/main");
            }).catch((err) => {
              console.error(err);
              common.showToasts(Translate.loginFailed, "error");
            });
          } else {
            console.warn("Unknown payload type", payload.type);
          }
        }
      };
      window.addEventListener("message", fn);
      return () => {
        window.removeEventListener("message", fn);
      };
    }, []);
    if (loading) {
      return null;
    }
    if (Array.isArray(strategies) && strategies.length > 0) {
      return /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement(component.Divider, {
        style: { color: "white" }
      }, Translate.iamLogin), isMobile ? /* @__PURE__ */ React__default["default"].createElement("div", {
        style: { textAlign: "center", opacity: 0.8, fontSize: "0.75rem" }
      }, Translate.notSupportMobile) : /* @__PURE__ */ React__default["default"].createElement("div", {
        style: { display: "flex", justifyContent: "center" }
      }, strategies.map((s) => /* @__PURE__ */ React__default["default"].createElement(component.Tooltip, {
        key: s.name,
        title: s.name
      }, /* @__PURE__ */ React__default["default"].createElement(component.Image, {
        style: {
          width: 40,
          height: 40,
          cursor: "pointer",
          borderRadius: 20
        },
        src: s.icon,
        onClick: async () => {
          if (s.type === "oauth") {
            const { data: url } = await request.get(`${s.name}.loginUrl`);
            const win = window.open(url, "square", "frame=true");
            newWin.current = win;
          }
        }
      })))));
    }
    return null;
  });
  IAMAction.displayName = "IAMAction";

  console.log("Plugin Identity and Access Management is loaded");
  common.regLoginAction({
    name: "plugin:com.msgbyte.iam/loginAction",
    component: IAMAction
  });

}));
//# sourceMappingURL=index.js.map
