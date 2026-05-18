definePlugin('@plugins/com.msgbyte.topic/GroupTopicPanelRender-331bcec5.js', ['exports', 'react', './TopicCard-b3cc91b1', '@capital/common', '@capital/component', './index-f8f06e03', 'styled-components', 'zustand', 'zustand/middleware/immer'], (function (exports, React, TopicCard, common, component, index, styled, create, immer) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

  const Root$1 = styled__default["default"].div`
  display: flex;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--tc-border-color);
  border-radius: 8px;
  background: var(--tc-surface-panel-color);
  color: var(--tc-text-color);

  .composer-avatar {
    flex: 0 0 auto;
    padding-top: 2px;
  }

  .composer-body {
    flex: 1;
    min-width: 0;
  }

  .composer-input {
    resize: none;
    border: 0;
    box-shadow: none;
    padding: 0;
    background: transparent;
    color: var(--tc-text-color);
    font-size: 14px;
    line-height: 1.6;

    &:focus {
      border: 0;
      box-shadow: none;
    }

    &::placeholder {
      color: var(--tc-text-muted-color);
    }
  }
`;
  const TopicComposer = React__default["default"].memo(React.forwardRef((props, ref) => {
    const [text, setText] = React.useState("");
    const [images, setImages] = React.useState([]);
    const inputRef = React.useRef(null);
    const userId = common.useCurrentUserInfo()._id;
    React.useImperativeHandle(ref, () => ({
      focus: () => {
        var _a, _b;
        (_b = (_a = inputRef.current) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
      }
    }));
    const [{ loading }, handleCreate] = common.useAsyncRequest(async () => {
      var _a, _b;
      const content = text.trim();
      if (!content && images.length === 0) {
        return;
      }
      await props.onCreate({
        content,
        images
      });
      setText("");
      setImages([]);
      (_b = (_a = inputRef.current) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
    }, [text, images, props.onCreate]);
    const [{ loading: uploading }, handleUploadImage] = common.useAsyncRequest(async () => {
      const file = await TopicCard.openImageFile();
      if (!file) {
        return;
      }
      try {
        const imageUrl = await TopicCard.uploadTopicImage(file);
        setImages((value) => [...value, imageUrl]);
        common.showToasts(index.Translate.uploadImage, "success");
      } catch (err) {
        common.showErrorToasts(err);
      }
    }, []);
    const handlePaste = async (e) => {
      const file = TopicCard.getClipboardImageFile(e);
      if (!file) {
        return;
      }
      e.preventDefault();
      try {
        const imageUrl = await TopicCard.uploadTopicImage(file);
        setImages((value) => [...value, imageUrl]);
        common.showToasts(index.Translate.uploadImage, "success");
      } catch (err) {
        common.showErrorToasts(err);
      }
    };
    return /* @__PURE__ */ React__default["default"].createElement(Root$1, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "composer-avatar"
    }, /* @__PURE__ */ React__default["default"].createElement(component.UserAvatar, {
      userId,
      size: 36
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "composer-body"
    }, /* @__PURE__ */ React__default["default"].createElement(component.TextArea, {
      ref: inputRef,
      className: "composer-input",
      autoSize: { minRows: 2, maxRows: 8 },
      placeholder: index.Translate.createPlaceholder,
      value: text,
      maxLength: 2e3,
      showCount: false,
      onChange: (e) => setText(e.target.value),
      onPaste: handlePaste
    }), /* @__PURE__ */ React__default["default"].createElement(TopicCard.TopicImageComposer, {
      images,
      uploading,
      onUploadImage: handleUploadImage,
      onRemoveImage: (index) => setImages((value) => value.filter((_, i) => i !== index)),
      action: /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement(TopicCard.TopicAssistantTools, {
        value: text,
        onApply: setText
      }), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
        type: "primary",
        loading,
        disabled: !text.trim() && images.length === 0,
        onClick: handleCreate
      }, index.Translate.publish))
    })));
  }));
  TopicComposer.displayName = "TopicComposer";

  const Root = styled__default["default"](component.LoadingOnFirst)`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  padding: 12px;
  background: var(--tc-content-background-color);

  .topic-composer-wrap {
    max-width: 760px;
    width: 100%;
    margin: 0 auto 12px;
  }

  .list {
    height: 100%;
    overflow: auto;
    padding-bottom: 72px;
  }

  .topic-feed {
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
  }

  .topic-load-more {
    display: flex;
    justify-content: center;
    padding: 8px 0 16px;
  }

`;
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
    } = TopicCard.useTopicStore();
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
        if (page === 1) {
          setHasMore(true);
        }
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
    common.useGlobalSocketEvent("plugin:com.msgbyte.topic.update", (topic) => {
      if (topic.panelId === panelId) {
        updateTopicItem(panelId, topic);
      }
    });
    const handleCreateTopic = React.useCallback(async ({ content, images }) => {
      const { data: topic } = await TopicCard.request.post("create", {
        groupId,
        panelId,
        content,
        images
      });
      if (topic) {
        addTopicItem(panelId, topic);
      }
      common.showSuccessToasts();
    }, [groupId, panelId, addTopicItem]);
    return /* @__PURE__ */ React__default["default"].createElement(Root, {
      spinning: loading
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "topic-composer-wrap"
    }, /* @__PURE__ */ React__default["default"].createElement(TopicComposer, {
      onCreate: handleCreateTopic
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "list"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "topic-feed"
    }, Array.isArray(topicList) && topicList.map((item) => /* @__PURE__ */ React__default["default"].createElement(TopicCard.TopicCard, {
      key: item._id,
      topic: item
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "topic-load-more"
    }, Array.isArray(topicList) && topicList.length > 0 && hasMore ? /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "link",
      disabled: loading,
      onClick: handleLoadMore
    }, loading ? index.Translate.loading : index.Translate.loadMore) : Array.isArray(topicList) && topicList.length > 0 ? /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "link",
      disabled: true,
      onClick: handleLoadMore
    }, index.Translate.noMore) : null))));
  });
  GroupTopicPanelRender.displayName = "GroupTopicPanelRender";

  exports["default"] = GroupTopicPanelRender;

}));
//# sourceMappingURL=GroupTopicPanelRender-331bcec5.js.map
