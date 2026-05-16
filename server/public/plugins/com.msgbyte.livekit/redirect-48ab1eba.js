definePlugin('@plugins/com.msgbyte.livekit/redirect-48ab1eba.js', ['exports', '@capital/common', 'react', './index-c1925de8', '@capital/component', 'zustand', 'zustand/middleware/immer'], (function (exports, common, React, index, component, zustand, immer) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const LivekitNavbarRedirect = React__default["default"].memo(() => {
    const navigate = common.useNavigate();
    const { isActive, url } = index.useLivekitState();
    React.useEffect(() => {
      if (isActive) {
        navigate(url);
      }
    }, []);
    return /* @__PURE__ */ React__default["default"].createElement("div", null, "Redirect...");
  });
  LivekitNavbarRedirect.displayName = "LivekitNavbarRedirect";

  exports.LivekitNavbarRedirect = LivekitNavbarRedirect;

}));
//# sourceMappingURL=redirect-48ab1eba.js.map
