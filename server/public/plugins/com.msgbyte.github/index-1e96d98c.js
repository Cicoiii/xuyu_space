definePlugin('@plugins/com.msgbyte.github/index-1e96d98c.js', ['exports', 'react', '@capital/common', '@capital/component', './index-0c36aaaa'], (function (exports, React, common, component, index) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const request = common.createPluginRequest("com.msgbyte.github");

  const schema = common.createFastFormSchema({
    repoName: common.fieldSchema.string().required(index.Translate.repoNameEmpty),
    textPanelId: common.fieldSchema.string().required(index.Translate.textPanelEmpty)
  });
  const AddGroupSubscribeModal = React__default["default"].memo((props) => {
    const groupId = props.groupId;
    const [, handleSubmit] = common.useAsyncRequest(async (values) => {
      var _a;
      const { repoName, textPanelId } = values;
      await request.post("subscribe.add", {
        groupId,
        textPanelId,
        repoName
      });
      common.showToasts(index.Translate.success, "success");
      (_a = props.onSuccess) == null ? void 0 : _a.call(props);
    }, [groupId, props.onSuccess]);
    const fields = React.useMemo(() => [
      {
        type: "text",
        name: "repoName",
        label: index.Translate.repoName,
        placeholder: index.Translate.repoNamePlaceholder
      },
      {
        type: "custom",
        name: "textPanelId",
        label: index.Translate.textPanel,
        render: (props2) => {
          return /* @__PURE__ */ React__default["default"].createElement(component.GroupPanelSelector, {
            style: { width: "100%" },
            value: props2.value,
            onChange: props2.onChange,
            groupId
          });
        }
      }
    ], [groupId]);
    return /* @__PURE__ */ React__default["default"].createElement(component.ModalWrapper, {
      title: index.Translate.createApplication
    }, /* @__PURE__ */ React__default["default"].createElement(component.WebFastForm, {
      schema,
      fields,
      onSubmit: handleSubmit
    }));
  });
  AddGroupSubscribeModal.displayName = "AddGroupSubscribeModal";

  const GroupPanelName = React__default["default"].memo(({ groupId, panelId }) => {
    var _a;
    const groupPanelInfo = common.useGroupPanelInfo(groupId, panelId);
    return (_a = groupPanelInfo == null ? void 0 : groupPanelInfo.name) != null ? _a : "";
  });
  GroupPanelName.displayName = "GroupPanelName";
  const GroupSubscribePanel = React__default["default"].memo(() => {
    const groupId = common.useGroupIdContext();
    const { value: subscribes, refresh } = common.useAsyncRefresh(async () => {
      const { data } = await request.post("subscribe.list", { groupId });
      return data;
    }, [groupId]);
    const handleAdd = React.useCallback(() => {
      const key = component.openModal(/* @__PURE__ */ React__default["default"].createElement(AddGroupSubscribeModal, {
        groupId,
        onSuccess: () => {
          component.closeModal(key);
          refresh();
        }
      }));
    }, [groupId, refresh]);
    const [, handleDelete] = common.useAsyncRequest(async (subscribeId) => {
      await request.post("subscribe.delete", {
        groupId,
        subscribeId
      });
      refresh();
    }, [groupId, refresh]);
    const columns = React.useMemo(() => [
      {
        title: index.Translate.repo,
        key: "repoName",
        dataIndex: "repoName"
      },
      {
        title: index.Translate.panel,
        key: "textPanelId",
        dataIndex: "textPanelId",
        render: (panelId) => /* @__PURE__ */ React__default["default"].createElement(GroupPanelName, {
          groupId,
          panelId
        })
      },
      {
        title: index.Translate.createdTime,
        key: "createdAt",
        dataIndex: "createdAt",
        render: (date) => new Date(date).toLocaleString()
      },
      {
        title: index.Translate.action,
        key: "action",
        render: (_, record) => /* @__PURE__ */ React__default["default"].createElement(component.Space, null, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
          onClick: () => handleDelete(record._id)
        }, index.Translate.delete))
      }
    ], [handleDelete]);
    const url = `${common.getServiceUrl()}/api/plugin:com.msgbyte.github.subscribe/webhook/callback`;
    return /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement("div", {
      style: {
        marginBottom: 10,
        display: "flex",
        justifyContent: "space-between"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("h2", null, index.Translate.groupSubscribe), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      onClick: handleAdd
    }, index.Translate.add)), /* @__PURE__ */ React__default["default"].createElement(component.Table, {
      rowKey: "_id",
      columns,
      dataSource: subscribes,
      pagination: false
    }), Array.isArray(subscribes) && subscribes.length > 0 && /* @__PURE__ */ React__default["default"].createElement("div", {
      style: { marginTop: 10 }
    }, /* @__PURE__ */ React__default["default"].createElement("h3", null, "\u5982\u4F55\u63A5\u5165:"), /* @__PURE__ */ React__default["default"].createElement("p", null, "\u5728\u5BF9\u5E94 Github \u4ED3\u5E93\u4E2D\u6DFB\u52A0 github webhook, \u56DE\u8C03\u5730\u5740\u6307\u5411:", " ", /* @__PURE__ */ React__default["default"].createElement(component.CopyableText, {
      config: { text: url }
    }, /* @__PURE__ */ React__default["default"].createElement("code", {
      style: { userSelect: "text" }
    }, url))), /* @__PURE__ */ React__default["default"].createElement("p", null, "\u5E76\u786E\u4FDD ", /* @__PURE__ */ React__default["default"].createElement("code", null, "Content type"), " \u7C7B\u578B\u4E3A", " ", /* @__PURE__ */ React__default["default"].createElement("code", null, "application/json"))));
  });
  GroupSubscribePanel.displayName = "GroupSubscribePanel";

  exports["default"] = GroupSubscribePanel;

}));
//# sourceMappingURL=index-1e96d98c.js.map
