definePlugin('@plugins/com.msgbyte.simplenotify/index-c2939478.js', ['exports', 'react', '@capital/common', '@capital/component', './index-2335170d'], (function (exports, React, common, component, index) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const request = common.createPluginRequest("com.msgbyte.simplenotify");

  const schema = common.createFastFormSchema({
    textPanelId: common.fieldSchema.string().required(index.Translate.textPanelEmpty)
  });
  const AddGroupSubscribeModal = React__default["default"].memo((props) => {
    const groupId = props.groupId;
    const [, handleSubmit] = common.useAsyncRequest(async (values) => {
      var _a;
      const { textPanelId } = values;
      await request.post("addGroupSubscribe", {
        groupId,
        textPanelId
      });
      common.showToasts(index.Translate.success, "success");
      (_a = props.onSuccess) == null ? void 0 : _a.call(props);
    }, [groupId, props.onSuccess]);
    const fields = React.useMemo(() => [
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
    return /* @__PURE__ */ React__default["default"].createElement(common.ModalWrapper, {
      title: index.Translate.createNotify
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
      const { data } = await request.post("list", { groupId, type: "group" });
      return data;
    }, [groupId]);
    const handleAdd = React.useCallback(() => {
      const key = common.openModal(/* @__PURE__ */ React__default["default"].createElement(AddGroupSubscribeModal, {
        groupId,
        onSuccess: () => {
          common.closeModal(key);
          refresh();
        }
      }));
    }, [groupId, refresh]);
    const [, handleDelete] = common.useAsyncRequest(async (subscribeId) => {
      await request.post("delete", {
        groupId,
        subscribeId
      });
      refresh();
    }, [groupId, refresh]);
    const columns = React.useMemo(() => [
      {
        title: "ID",
        key: "_id",
        dataIndex: "_id",
        width: 250,
        render: (text) => /* @__PURE__ */ React__default["default"].createElement(component.SensitiveText, {
          text
        })
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
    const url = `${common.getServiceUrl()}/api/plugin:com.msgbyte.simplenotify/webhook/callback?subscribeId=<ID>&text=<\u6587\u672C\u5185\u5BB9>`;
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
    }, /* @__PURE__ */ React__default["default"].createElement("h3", null, "\u5982\u4F55\u63A5\u5165:"), /* @__PURE__ */ React__default["default"].createElement("p", null, "\u76F4\u63A5\u53D1\u9001\u8BF7\u6C42:\xA0", /* @__PURE__ */ React__default["default"].createElement("code", {
      style: { userSelect: "text" }
    }, url)), /* @__PURE__ */ React__default["default"].createElement("p", null, "\u652F\u6301GET\u4E0EPOST"), /* @__PURE__ */ React__default["default"].createElement("p", null, /* @__PURE__ */ React__default["default"].createElement("b", null, "\u8BF7\u4FDD\u7BA1\u597D\u60A8\u7684ID"))));
  });
  GroupSubscribePanel.displayName = "GroupSubscribePanel";

  exports["default"] = GroupSubscribePanel;

}));
//# sourceMappingURL=index-c2939478.js.map
