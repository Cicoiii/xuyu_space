definePlugin('@plugins/com.msgbyte.topic/GroupTopicPanelRender-835a2a52.js', ['exports', 'react', './TopicCard-dd8b2221', '@capital/common', '@capital/component', './index-2df3cc0c', 'styled-components', 'zustand', 'zustand/middleware/immer'], (function (exports, React, TopicCard, common, component, index, styled, create, immer) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
  var create__default = /*#__PURE__*/_interopDefaultLegacy(create);

  const Footer = styled__default["default"].div({
    textAlign: "right",
    paddingTop: 10
  });
  const TopicCreate = React__default["default"].memo((props) => {
    const [text, setText] = React.useState("");
    const [{ loading }, handleCreate] = common.useAsyncRequest(async () => {
      await props.onCreate(text);
    }, [text]);
    return /* @__PURE__ */ React__default["default"].createElement(component.ModalWrapper, {
      title: index.Translate.createBtn
    }, /* @__PURE__ */ React__default["default"].createElement(component.TextArea, {
      autoFocus: true,
      value: text,
      onChange: (e) => setText(e.target.value)
    }), /* @__PURE__ */ React__default["default"].createElement(Footer, null, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      loading,
      onClick: handleCreate
    }, index.Translate.createBtn)));
  });
  TopicCreate.displayName = "TopicCreate";

  const useTopicStore = create__default["default"](immer.immer((set) => ({
    topicMap: {},
    addTopicPanel: (panelId, topicList) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          state.topicMap[panelId].push(...topicList);
        } else {
          state.topicMap[panelId] = topicList;
        }
      });
    },
    addTopicItem: (panelId, topic) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          state.topicMap[panelId].unshift(topic);
        }
      });
    },
    deleteTopicItem: (panelId, topicId) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          state.topicMap[panelId] = state.topicMap[panelId].filter((item) => item._id !== topicId);
        }
      });
    },
    updateTopicItem: (panelId, topic) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          const findedTopicIndex = state.topicMap[panelId].findIndex((t) => t._id === topic._id);
          if (findedTopicIndex >= 0) {
            state.topicMap[panelId][findedTopicIndex] = topic;
          }
        }
      });
    },
    resetTopicPanel: (panelId) => {
      set((state) => {
        delete state.topicMap[panelId];
      });
    }
  })));

  const Root = styled__default["default"](component.LoadingOnFirst)({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    paddingTop: 10,
    paddingBottom: 10,
    ".ant-empty": {
      paddingTop: 80
    },
    ".list": {
      height: "100%",
      overflow: "auto"
    },
    ".create-btn": {
      position: "absolute",
      right: 20,
      bottom: 20,
      "> .anticon": {
        fontSize: 24
      }
    }
  });
  const PAGE_SIZE = 20;
  const GroupTopicPanelRender = React__default["default"].memo(() => {
    const panelInfo = common.useGroupPanelContext();
    const { panelId, groupId } = panelInfo;
    const {
      topicMap,
      addTopicPanel,
      addTopicItem,
      deleteTopicItem,
      updateTopicItem,
      resetTopicPanel
    } = useTopicStore();
    const topicList = topicMap[panelId];
    const currentPageRef = React.useRef(1);
    const [hasMore, setHasMore] = React.useState(true);
    const [{ loading }, fetch] = common.useAsyncRequest(async (page = 1) => {
      if (!groupId || !panelId) {
        return [];
      }
      const { data: list } = await TopicCard.request.post("list", {
        groupId,
        panelId,
        page,
        size: PAGE_SIZE
      });
      if (Array.isArray(list)) {
        addTopicPanel(panelId, list);
        if (list.length !== PAGE_SIZE) {
          setHasMore(false);
        }
      }
    }, [groupId, panelId, addTopicPanel]);
    React.useEffect(() => {
      fetch();
      return () => {
        resetTopicPanel(panelId);
      };
    }, []);
    const handleLoadMore = React.useCallback(() => {
      currentPageRef.current += 1;
      fetch(currentPageRef.current);
    }, [fetch]);
    common.useGlobalSocketEvent("plugin:com.msgbyte.topic.create", (topic) => {
      if (topic.panelId === panelId) {
        addTopicItem(panelId, topic);
      }
    });
    common.useGlobalSocketEvent("plugin:com.msgbyte.topic.delete", (info) => {
      if (info.panelId === panelId) {
        deleteTopicItem(panelId, info.topicId);
      }
    });
    common.useGlobalSocketEvent("plugin:com.msgbyte.topic.createComment", (topic) => {
      if (topic.panelId === panelId) {
        updateTopicItem(panelId, topic);
      }
    });
    const handleCreateTopic = React.useCallback(() => {
      const key = component.openModal(/* @__PURE__ */ React__default["default"].createElement(TopicCreate, {
        onCreate: async (text) => {
          await TopicCard.request.post("create", {
            groupId,
            panelId,
            content: text
          });
          common.showSuccessToasts();
          component.closeModal(key);
        }
      }));
    }, [panelInfo, fetch]);
    return /* @__PURE__ */ React__default["default"].createElement(Root, {
      spinning: loading
    }, Array.isArray(topicList) && topicList.length > 0 ? /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "list"
    }, topicList.map((item, i) => /* @__PURE__ */ React__default["default"].createElement(TopicCard.TopicCard, {
      key: i,
      topic: item
    })), hasMore ? /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "link",
      disabled: loading,
      onClick: handleLoadMore
    }, loading ? index.Translate.loading : index.Translate.loadMore) : /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "link",
      disabled: true,
      onClick: handleLoadMore
    }, index.Translate.noMore)) : /* @__PURE__ */ React__default["default"].createElement(component.Empty, {
      description: index.Translate.noTopic
    }, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      onClick: handleCreateTopic
    }, index.Translate.createBtn)), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      className: "create-btn",
      size: "large",
      icon: "mdi:plus",
      title: index.Translate.createBtn,
      onClick: handleCreateTopic
    }));
  });
  GroupTopicPanelRender.displayName = "GroupTopicPanelRender";

  exports["default"] = GroupTopicPanelRender;

}));
//# sourceMappingURL=GroupTopicPanelRender-835a2a52.js.map
