definePlugin('@plugins/com.msgbyte.github/GithubRepoInfo-327661f1.js', ['exports', 'react', 'react-router'], (function (exports, React, reactRouter) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const GithubRepoInfo = React__default["default"].memo((props) => {
    return /* @__PURE__ */ React__default["default"].createElement("div", null, "GithubRepoInfo ", JSON.stringify(props));
  });
  GithubRepoInfo.displayName = "GithubRepoInfo";
  const GithubRepoInfoRoute = React__default["default"].memo(() => {
    const params = reactRouter.useParams();
    return /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement(GithubRepoInfo, {
      owner: params.owner,
      repo: params.repo
    }));
  });
  GithubRepoInfoRoute.displayName = "GithubRepoInfoRoute";

  exports.GithubRepoInfo = GithubRepoInfo;
  exports.GithubRepoInfoRoute = GithubRepoInfoRoute;

}));
//# sourceMappingURL=GithubRepoInfo-327661f1.js.map
