definePlugin('@plugins/com.msgbyte.discover/index-e12b93dd.js', ['exports', 'react', '@capital/common', '@capital/component', 'styled-components', './index-53c845c6'], (function (exports, React, common, component, styled, index) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

  const request = common.createPluginRequest("com.msgbyte.discover");

  const Root$1 = styled__default["default"].div`
  --discover-server-card: #fff;

  .dark & {
    --discover-server-card: #2c3441;
  }

  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  background-color: var(--discover-server-card);

  .header {
    height: 143px;
    position: relative;
    display: block;
    overflow: visible;
    margin-bottom: 32px;

    .icon {
      position: absolute;
      bottom: -21px;
      left: 12px;
      border: 6px solid var(--discover-server-card);
      border-radius: 6px;
    }
  }

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 16px 16px;
    overflow: hidden;
    width: 100%;

    .name {
      font-weight: 600;
    }

    .desc {
      opacity: 0.8;
      overflow: auto;
      font-size: 0.9rem;

      > pre {
        text-wrap: wrap;
      }
    }
  }

  .footer {
    padding: 0 16px 16px;
    font-size: 0.7rem;
    opacity: 0.8;
    display: flex;
    justify-content: space-between;
    align-items: center;

    * + * {
      margin-left: 4px;
    }
  }
`;
  const DiscoverServerCard = React__default["default"].memo((props) => {
    const navigate = common.useNavigate();
    const { value: groupBasicInfo } = common.useAsync(async () => {
      const { data } = await common.postRequest("/group/getGroupBasicInfo", {
        groupId: props.groupId
      });
      return data;
    }, [props.groupId]);
    const [{ loading: joinLoading }, handleJoin] = common.useAsyncRequest(async () => {
      await request.post("join", {
        groupId: props.groupId
      });
    }, [props.groupId]);
    const handleJumpTo = common.useEvent(() => {
      navigate(`/main/group/${props.groupId}`);
    });
    const isJoined = React.useMemo(() => {
      try {
        return Object.keys(common.getGlobalState().group.groups).includes(props.groupId);
      } catch (err) {
        console.error(err);
        return false;
      }
    }, [props.groupId]);
    if (!groupBasicInfo) {
      return /* @__PURE__ */ React__default["default"].createElement(Root$1, null, /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "header"
      }, /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "icon"
      }, /* @__PURE__ */ React__default["default"].createElement(component.Skeleton.Avatar, {
        active: true,
        size: 40,
        shape: "square"
      }))), /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "body"
      }, /* @__PURE__ */ React__default["default"].createElement(component.Skeleton, {
        active: true
      })));
    }
    return /* @__PURE__ */ React__default["default"].createElement(Root$1, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "header",
      style: { background: common.getTextColorHex(groupBasicInfo.name) }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "icon"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Avatar, {
      shape: "square",
      size: 40,
      src: groupBasicInfo.avatar,
      name: groupBasicInfo.name
    }))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "body"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "name"
    }, groupBasicInfo.name), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "desc"
    }, /* @__PURE__ */ React__default["default"].createElement("pre", null, groupBasicInfo.description))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "footer"
    }, /* @__PURE__ */ React__default["default"].createElement("div", null, index.Translate.memberCount.replace("{count}", groupBasicInfo.memberCount)), isJoined ? /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      size: "small",
      type: "primary",
      loading: joinLoading,
      onClick: handleJumpTo
    }, index.Translate.joined) : /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      size: "small",
      type: "primary",
      loading: joinLoading,
      onClick: handleJoin
    }, index.Translate.join)));
  });
  DiscoverServerCard.displayName = "DiscoverServerCard";

  const Root = styled__default["default"].div`
  width: 100%;
  overflow: auto;
`;
  const DiscoverServerHeader = styled__default["default"].div`
  font-size: 1.5rem;
  padding: 32px 0;
  text-align: center;
`;
  const DiscoverServerList = styled__default["default"].div`
  margin-top: 16px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
  padding: 10px;
`;
  const DiscoverPanel = React__default["default"].memo(() => {
    const {
      error,
      loading,
      value: list = []
    } = common.useAsync(async () => {
      var _a;
      const { data } = await request.get("all");
      return (_a = data.list) != null ? _a : [];
    }, []);
    if (loading) {
      return /* @__PURE__ */ React__default["default"].createElement(component.LoadingSpinner, null);
    }
    if (error) {
      return /* @__PURE__ */ React__default["default"].createElement(component.ErrorView, {
        error
      });
    }
    return /* @__PURE__ */ React__default["default"].createElement(Root, null, /* @__PURE__ */ React__default["default"].createElement(DiscoverServerHeader, null, index.Translate.discoverHeader), Array.isArray(list) && list.length > 0 ? /* @__PURE__ */ React__default["default"].createElement(DiscoverServerList, null, list.map((item, i) => /* @__PURE__ */ React__default["default"].createElement(DiscoverServerCard, {
      key: i,
      groupId: item.groupId
    }))) : /* @__PURE__ */ React__default["default"].createElement(component.NoData, null));
  });
  DiscoverPanel.displayName = "DiscoverPanel";

  exports.DiscoverPanel = DiscoverPanel;

}));
//# sourceMappingURL=index-e12b93dd.js.map
