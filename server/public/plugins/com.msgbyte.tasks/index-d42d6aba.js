definePlugin('@plugins/com.msgbyte.tasks/index-d42d6aba.js', ['exports', 'react', '@capital/common', '@capital/component', './index-24cf2308'], (function (exports, React, common, component, index) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const request = common.createPluginRequest("com.msgbyte.tasks");

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css$2 = "@keyframes taskItemIn {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.plugin-task-item {\n  display: flex;\n  align-items: center;\n  height: 48px;\n  padding: 0 8px;\n  border-radius: 8px;\n  transition: background 0.15s;\n  gap: 10px;\n  animation: taskItemIn 0.25s ease-out both;\n  cursor: pointer;\n}\n.plugin-task-item:hover {\n  background: #f1f5f9;\n}\n.plugin-task-item:hover .plugin-task-item-arrow {\n  opacity: 1;\n}\n:global(.dark) .plugin-task-item:hover {\n  background: #334155;\n}\n.plugin-task-item-priority-bar {\n  width: 4px;\n  height: 20px;\n  border-radius: 2px;\n  flex-shrink: 0;\n  align-self: center;\n}\n.plugin-task-item-select {\n  flex-shrink: 0;\n}\n.plugin-task-item-check {\n  flex-shrink: 0;\n}\n.plugin-task-item-body {\n  flex: 1;\n  min-width: 0;\n}\n.plugin-task-item-header {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.plugin-task-item-title {\n  font-size: 13px;\n  font-weight: 500;\n  color: #0f172a;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n:global(.dark) .plugin-task-item-title {\n  color: #f1f5f9;\n}\n.plugin-task-item-title.title-done {\n  text-decoration: line-through;\n  color: #94a3b8;\n}\n:global(.dark) .plugin-task-item-title.title-done {\n  color: #64748b;\n}\n.plugin-task-item-meta {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 2px;\n  flex-wrap: wrap;\n}\n.plugin-task-item-priority-tag {\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.plugin-task-item-deadline {\n  font-size: 11px;\n  color: #94a3b8;\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n:global(.dark) .plugin-task-item-deadline {\n  color: #64748b;\n}\n.plugin-task-item-deadline.urgent {\n  color: #dc2626;\n  font-weight: 600;\n}\n.plugin-task-item-arrow {\n  flex-shrink: 0;\n  opacity: 0;\n  transition: opacity 0.15s;\n  display: flex;\n  align-items: center;\n}\n.plugin-task-item-done {\n  opacity: 0.5;\n}\n.plugin-task-item-done:hover {\n  background: transparent;\n}\n:global(.dark) .plugin-task-item-done:hover {\n  background: transparent;\n}\n.plugin-task-item-done .plugin-task-item-arrow {\n  opacity: 0;\n}\n";
  n(css$2,{});

  const PRIORITY_CONFIG$1 = {
    high: { color: "#ef4444", label: index.Translate.priorityHigh },
    medium: { color: "#f59e0b", label: index.Translate.priorityMedium },
    low: { color: "#22c55e", label: index.Translate.priorityLow }
  };
  function getDeadlineInfo(deadline) {
    if (!deadline)
      return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const d = new Date(deadline);
    d.setHours(0, 0, 0, 0);
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
    if (diff < 0)
      return { text: index.Translate.overdue, urgent: true };
    if (diff === 0)
      return { text: index.Translate.dueToday, urgent: true };
    return { text: `${diff}${index.Translate.daysLeft}`, urgent: diff <= 3 };
  }
  const TaskItem = React__default["default"].memo(({ task, selected, onSelect, onRefresh, onDetail }) => {
    const taskId = task._id;
    const [done, setDone] = React.useState(task.done);
    const [{ loading }, handleToggleDone] = common.useAsyncFn(async (e) => {
      const checked = e.target.checked;
      if (checked) {
        await request.post("done", { taskId });
        setDone(true);
      } else {
        await request.post("undone", { taskId });
        setDone(false);
      }
      onRefresh && onRefresh();
    }, [taskId, onRefresh]);
    const priority = task.priority || "medium";
    const priorityCfg = PRIORITY_CONFIG$1[priority];
    const deadlineInfo = getDeadlineInfo(task.deadline);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: `plugin-task-item ${done ? "plugin-task-item-done" : ""}`,
      onClick: () => onDetail && onDetail(task)
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-item-priority-bar",
      style: { backgroundColor: priorityCfg.color }
    }), onSelect ? /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-item-select",
      onClick: (e) => e.stopPropagation()
    }, /* @__PURE__ */ React__default["default"].createElement(component.Checkbox, {
      checked: selected,
      onChange: (e) => onSelect(taskId, e.target.checked)
    })) : /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-item-check",
      onClick: (e) => e.stopPropagation()
    }, /* @__PURE__ */ React__default["default"].createElement(component.Checkbox, {
      disabled: loading,
      checked: done,
      onChange: handleToggleDone
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-item-body"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-item-header"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: `plugin-task-item-title ${done ? "title-done" : ""}`
    }, task.title)), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-item-meta"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "plugin-task-item-priority-tag",
      style: { color: priorityCfg.color }
    }, priorityCfg.label), deadlineInfo && /* @__PURE__ */ React__default["default"].createElement("span", {
      className: `plugin-task-item-deadline ${deadlineInfo.urgent ? "urgent" : ""}`
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:clock-outline",
      style: { fontSize: 12, marginRight: 2 }
    }), deadlineInfo.text))), onDetail && /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-item-arrow"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:chevron-right",
      style: { fontSize: 18, color: "rgba(0,0,0,0.25)" }
    })));
  });
  TaskItem.displayName = "TaskItem";

  var css$1 = ".plugin-task-quick-add {\n  position: relative;\n  margin-bottom: 16px;\n}\n.plugin-task-quick-add-icon {\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 16px;\n  color: #94a3b8;\n  pointer-events: none;\n}\n:global(.dark) .plugin-task-quick-add-icon {\n  color: #64748b;\n}\n.plugin-task-quick-add-input {\n  width: 100%;\n  height: 40px;\n  padding: 0 14px 0 36px;\n  background: #f8fafc;\n  border: 1.5px solid #e2e8f0;\n  border-radius: 10px;\n  color: #0f172a;\n  font-size: 13px;\n  outline: none;\n  transition: border-color 0.2s, box-shadow 0.2s;\n  box-sizing: border-box;\n}\n.plugin-task-quick-add-input::placeholder {\n  color: #94a3b8;\n}\n.plugin-task-quick-add-input:focus {\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.06);\n  background: #fff;\n}\n:global(.dark) .plugin-task-quick-add-input {\n  background: #334155;\n  border-color: #334155;\n  color: #f1f5f9;\n}\n:global(.dark) .plugin-task-quick-add-input::placeholder {\n  color: #64748b;\n}\n:global(.dark) .plugin-task-quick-add-input:focus {\n  background: #1e293b;\n  border-color: #60a5fa;\n}\n";
  n(css$1,{});

  const NewTask = React__default["default"].memo((props) => {
    const { onSuccess } = props;
    const inputRef = React.useRef(null);
    const handleCreateTask = React.useCallback((e) => {
      if (e.key === "Enter") {
        const title = e.target.value.trim();
        if (title === "") {
          common.showToasts(index.Translate.titleRequired, "warning");
          return;
        }
        request.post("add", { title }).then(() => {
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          onSuccess && onSuccess();
        });
      }
    }, [onSuccess]);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-quick-add"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:plus",
      className: "plugin-task-quick-add-icon"
    }), /* @__PURE__ */ React__default["default"].createElement("input", {
      ref: inputRef,
      className: "plugin-task-quick-add-input",
      placeholder: index.Translate.quickAddTip,
      onKeyDown: handleCreateTask
    }));
  });
  NewTask.displayName = "NewTask";

  var css = "@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.plugin-tasks-panel {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  background: #ffffff;\n  animation: fadeIn 0.3s ease-out;\n}\n:global(.dark) .plugin-tasks-panel {\n  background: #1e293b;\n}\n.plugin-task-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 52px;\n  padding: 0 20px;\n  border-bottom: 1px solid #e2e8f0;\n  flex-shrink: 0;\n}\n:global(.dark) .plugin-task-header {\n  border-bottom-color: #334155;\n}\n.plugin-task-header-title {\n  font-size: 15px;\n  font-weight: 600;\n  color: #0f172a;\n}\n:global(.dark) .plugin-task-header-title {\n  color: #f1f5f9;\n}\n.plugin-task-header-actions {\n  display: flex;\n  gap: 4px;\n}\n.plugin-task-header-btn {\n  width: 28px;\n  height: 28px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 6px;\n  border: none;\n  background: transparent;\n  color: #64748b;\n  font-size: 16px;\n  cursor: pointer;\n  transition: all 0.15s;\n  padding: 0;\n}\n.plugin-task-header-btn:hover {\n  background: #f1f5f9;\n  color: #2563eb;\n}\n:global(.dark) .plugin-task-header-btn:hover {\n  background: #334155;\n  color: #60a5fa;\n}\n.plugin-task-header-btn.active {\n  background: rgba(37, 99, 235, 0.08);\n  color: #2563eb;\n}\n:global(.dark) .plugin-task-header-btn.active {\n  background: rgba(37, 99, 235, 0.2);\n  color: #60a5fa;\n}\n.plugin-task-header-btn.danger:hover {\n  background: rgba(220, 38, 38, 0.06);\n  color: #dc2626;\n}\n:global(.dark) .plugin-task-header-btn.danger:hover {\n  background: rgba(220, 38, 38, 0.15);\n  color: #f87171;\n}\n.plugin-task-tabs {\n  display: flex;\n  gap: 4px;\n  padding: 0 20px;\n  height: 42px;\n  align-items: center;\n  border-bottom: 1px solid #e2e8f0;\n  flex-shrink: 0;\n}\n:global(.dark) .plugin-task-tabs {\n  border-bottom-color: #334155;\n}\n.plugin-task-tab {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 12px;\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  color: #64748b;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  background: transparent;\n  border: none;\n  white-space: nowrap;\n}\n.plugin-task-tab:hover {\n  background: #f1f5f9;\n  color: #0f172a;\n}\n:global(.dark) .plugin-task-tab:hover {\n  background: #334155;\n  color: #f1f5f9;\n}\n.plugin-task-tab.active {\n  background: rgba(37, 99, 235, 0.08);\n  color: #2563eb;\n  font-weight: 600;\n}\n:global(.dark) .plugin-task-tab.active {\n  background: rgba(37, 99, 235, 0.2);\n  color: #60a5fa;\n}\n.plugin-task-tab-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 4px;\n  border-radius: 8px;\n  background: #2563eb;\n  color: white;\n  font-size: 10px;\n  font-weight: 600;\n  line-height: 1;\n}\n.plugin-task-content {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 16px 20px;\n}\n.plugin-task-content::-webkit-scrollbar {\n  width: 4px;\n}\n.plugin-task-content::-webkit-scrollbar-track {\n  background: transparent;\n}\n.plugin-task-content::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n  border-radius: 4px;\n}\n:global(.dark) .plugin-task-content::-webkit-scrollbar-thumb {\n  background: #475569;\n}\n.plugin-task-batch-bar {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  margin-bottom: 12px;\n  border-radius: 8px;\n  background-color: rgba(37, 99, 235, 0.08);\n}\n:global(.dark) .plugin-task-batch-bar {\n  background-color: rgba(37, 99, 235, 0.15);\n}\n.plugin-task-batch-count {\n  font-size: 12px;\n  color: #64748b;\n}\n:global(.dark) .plugin-task-batch-count {\n  color: #94a3b8;\n}\n.plugin-task-list {\n  margin-top: 4px;\n}\n.plugin-task-empty {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 48px 0;\n  color: #94a3b8;\n  font-size: 13px;\n  text-align: center;\n}\n.plugin-task-empty-icon {\n  font-size: 40px;\n  margin-bottom: 12px;\n  color: #cbd5e1;\n}\n:global(.dark) .plugin-task-empty-icon {\n  color: #475569;\n}\n/* ---- 抽屉 ---- */\n.plugin-task-drawer-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.35);\n  z-index: 9999;\n  display: flex;\n  justify-content: flex-end;\n  animation: plugin-drawer-fade-in 0.2s ease;\n}\n.plugin-task-drawer {\n  width: 380px;\n  max-width: 90vw;\n  height: 100%;\n  background-color: #ffffff;\n  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column;\n  animation: plugin-drawer-slide-in 0.25s ease;\n}\n:global(.dark) .plugin-task-drawer {\n  background-color: #1e293b;\n  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.4);\n}\n.plugin-task-drawer-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e2e8f0;\n  flex-shrink: 0;\n}\n:global(.dark) .plugin-task-drawer-header {\n  border-bottom-color: #334155;\n}\n.plugin-task-drawer-title {\n  font-size: 15px;\n  font-weight: 600;\n  color: #0f172a;\n}\n:global(.dark) .plugin-task-drawer-title {\n  color: #f1f5f9;\n}\n.plugin-task-drawer-header-actions {\n  display: flex;\n  gap: 4px;\n}\n.plugin-task-drawer-body {\n  flex: 1;\n  overflow-y: auto;\n  padding: 20px;\n}\n.plugin-task-drawer-body::-webkit-scrollbar {\n  width: 4px;\n}\n.plugin-task-drawer-body::-webkit-scrollbar-track {\n  background: transparent;\n}\n.plugin-task-drawer-body::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n  border-radius: 4px;\n}\n:global(.dark) .plugin-task-drawer-body::-webkit-scrollbar-thumb {\n  background: #475569;\n}\n.plugin-task-drawer-field {\n  margin-bottom: 16px;\n}\n.plugin-task-drawer-field > label {\n  display: block;\n  font-size: 11px;\n  font-weight: 600;\n  color: #94a3b8;\n  margin-bottom: 6px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n:global(.dark) .plugin-task-drawer-field > label {\n  color: #64748b;\n}\n.plugin-task-drawer-priority-options {\n  display: flex;\n  gap: 6px;\n}\n.plugin-task-drawer-priority-options .plugin-task-drawer-priority-item {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 10px;\n  border-radius: 6px;\n  border: 1.5px solid transparent;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 500;\n  transition: all 0.15s ease;\n}\n.plugin-task-drawer-priority-options .plugin-task-drawer-priority-item .plugin-task-drawer-priority-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n}\n.plugin-task-drawer-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e2e8f0;\n}\n:global(.dark) .plugin-task-drawer-actions {\n  border-top-color: #334155;\n}\n.plugin-task-drawer-read-title {\n  font-size: 16px;\n  font-weight: 700;\n  color: #0f172a;\n  margin-bottom: 16px;\n  display: flex;\n  align-items: center;\n}\n:global(.dark) .plugin-task-drawer-read-title {\n  color: #f1f5f9;\n}\n.plugin-task-drawer-meta {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 12px;\n}\n.plugin-task-drawer-meta .plugin-task-drawer-meta-item {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 13px;\n  color: #64748b;\n}\n:global(.dark) .plugin-task-drawer-meta .plugin-task-drawer-meta-item {\n  color: #94a3b8;\n}\n.plugin-task-drawer-meta .plugin-task-drawer-meta-item.overdue {\n  color: #dc2626;\n  font-weight: 600;\n}\n.plugin-task-drawer-desc > label {\n  display: block;\n  font-size: 11px;\n  font-weight: 600;\n  color: #94a3b8;\n  margin-bottom: 6px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n:global(.dark) .plugin-task-drawer-desc > label {\n  color: #64748b;\n}\n.plugin-task-drawer-desc .plugin-task-drawer-desc-content {\n  font-size: 14px;\n  line-height: 1.6;\n  color: #64748b;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n:global(.dark) .plugin-task-drawer-desc .plugin-task-drawer-desc-content {\n  color: #94a3b8;\n}\n@keyframes plugin-drawer-fade-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes plugin-drawer-slide-in {\n  from {\n    transform: translateX(100%);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n";
  n(css,{});

  const PRIORITY_CONFIG = {
    high: { color: "#ef4444", label: index.Translate.priorityHigh },
    medium: { color: "#f59e0b", label: index.Translate.priorityMedium },
    low: { color: "#22c55e", label: index.Translate.priorityLow }
  };
  const TaskDrawer = React__default["default"].memo(({ task, visible, onClose, onRefresh }) => {
    const [editMode, setEditMode] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState("");
    const [editDesc, setEditDesc] = React.useState("");
    const [editPriority, setEditPriority] = React.useState("medium");
    const [editDeadline, setEditDeadline] = React.useState("");
    React.useEffect(() => {
      if (task && visible) {
        setEditTitle(task.title);
        setEditDesc(task.desc || "");
        setEditPriority(task.priority || "medium");
        setEditDeadline(task.deadline ? task.deadline.substring(0, 16) : "");
        setEditMode(false);
      }
    }, [task, visible]);
    const handleSave = React.useCallback(async () => {
      if (!task)
        return;
      await request.post("update", {
        taskId: task._id,
        title: editTitle,
        desc: editDesc,
        priority: editPriority,
        deadline: editDeadline || void 0
      });
      setEditMode(false);
      onRefresh();
    }, [task, editTitle, editDesc, editPriority, editDeadline, onRefresh]);
    if (!task || !visible)
      return null;
    const priorityCfg = PRIORITY_CONFIG[task.priority || "medium"];
    const isOverdue = task.deadline && !task.done && new Date(task.deadline) < new Date();
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-overlay",
      onClick: onClose
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer",
      onClick: (e) => e.stopPropagation()
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-header"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-title"
    }, index.Translate.taskDetail), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-header-actions"
    }, !editMode && /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "text",
      size: "small",
      onClick: () => setEditMode(true)
    }, index.Translate.edit), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "text",
      size: "small",
      onClick: onClose
    }, "\u2715"))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-body"
    }, editMode ? /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-field"
    }, /* @__PURE__ */ React__default["default"].createElement("label", null, index.Translate.insertTip), /* @__PURE__ */ React__default["default"].createElement(component.Input, {
      value: editTitle,
      onChange: (e) => setEditTitle(e.target.value)
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-field"
    }, /* @__PURE__ */ React__default["default"].createElement("label", null, index.Translate.desc), /* @__PURE__ */ React__default["default"].createElement(component.TextArea, {
      value: editDesc,
      onChange: (e) => setEditDesc(e.target.value),
      rows: 4
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-field"
    }, /* @__PURE__ */ React__default["default"].createElement("label", null, index.Translate.priority), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-priority-options"
    }, Object.keys(PRIORITY_CONFIG).map((p) => /* @__PURE__ */ React__default["default"].createElement("div", {
      key: p,
      className: `plugin-task-drawer-priority-item ${editPriority === p ? "active" : ""}`,
      style: {
        borderColor: editPriority === p ? PRIORITY_CONFIG[p].color : "transparent",
        backgroundColor: editPriority === p ? `${PRIORITY_CONFIG[p].color}15` : "transparent"
      },
      onClick: () => setEditPriority(p)
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "plugin-task-drawer-priority-dot",
      style: { backgroundColor: PRIORITY_CONFIG[p].color }
    }), PRIORITY_CONFIG[p].label)))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-field"
    }, /* @__PURE__ */ React__default["default"].createElement("label", null, index.Translate.deadline), /* @__PURE__ */ React__default["default"].createElement(component.Input, {
      type: "datetime-local",
      value: editDeadline,
      onChange: (e) => setEditDeadline(e.target.value)
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-actions"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      onClick: () => setEditMode(false)
    }, index.Translate.cancel), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      onClick: handleSave
    }, index.Translate.save))) : /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-read-title"
    }, task.title, task.done && /* @__PURE__ */ React__default["default"].createElement(component.Tag, {
      color: "green",
      style: { marginLeft: 8 }
    }, index.Translate.done)), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-meta"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-meta-item"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:flag",
      style: { color: priorityCfg.color, fontSize: 16 }
    }), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: { color: priorityCfg.color, fontWeight: 600 }
    }, priorityCfg.label)), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: `plugin-task-drawer-meta-item ${isOverdue ? "overdue" : ""}`
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:clock-outline",
      style: { fontSize: 16 }
    }), /* @__PURE__ */ React__default["default"].createElement("span", null, task.deadline ? new Date(task.deadline).toLocaleString() : index.Translate.noDeadline))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-desc"
    }, /* @__PURE__ */ React__default["default"].createElement("label", null, index.Translate.desc), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-drawer-desc-content"
    }, task.desc || index.Translate.noDesc))))));
  });
  TaskDrawer.displayName = "TaskDrawer";
  const TasksPanel = React__default["default"].memo(() => {
    const [{ value }, fetch] = common.useAsyncFn(() => request.get("all").then(({ data }) => data), []);
    const tasks = Array.isArray(value) ? value : [];
    const [activeTab, setActiveTab] = React.useState("undone");
    const [batchMode, setBatchMode] = React.useState(false);
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [detailTask, setDetailTask] = React.useState(null);
    React.useEffect(() => {
      fetch();
    }, [fetch]);
    const unDoneTasks = React.useMemo(() => tasks.filter((t) => !t.done), [tasks]);
    const doneTasks = React.useMemo(() => tasks.filter((t) => t.done), [tasks]);
    const displayTasks = activeTab === "undone" ? unDoneTasks : doneTasks;
    const handleSelect = React.useCallback((taskId, checked) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked)
          next.add(taskId);
        else
          next.delete(taskId);
        return next;
      });
    }, []);
    const handleSelectAll = React.useCallback((checked) => {
      if (checked) {
        setSelectedIds(new Set(unDoneTasks.map((t) => t._id)));
      } else {
        setSelectedIds(new Set());
      }
    }, [unDoneTasks]);
    const handleBatchDone = React.useCallback(async () => {
      if (selectedIds.size === 0)
        return;
      await request.post("batchDone", { taskIds: Array.from(selectedIds) });
      setSelectedIds(new Set());
      setBatchMode(false);
      fetch();
    }, [selectedIds, fetch]);
    const handleClearCompleted = React.useCallback(async () => {
      await request.post("clearCompleted");
      fetch();
    }, [fetch]);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-tasks-panel"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-header"
    }, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "plugin-task-header-title"
    }, index.Translate.tasks), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-header-actions"
    }, /* @__PURE__ */ React__default["default"].createElement("button", {
      className: `plugin-task-header-btn ${batchMode ? "active" : ""}`,
      title: index.Translate.batchDone,
      onClick: () => {
        setBatchMode(!batchMode);
        setSelectedIds(new Set());
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: batchMode ? "mdi:close" : "mdi:checkbox-multiple-marked-outline"
    })), doneTasks.length > 0 && /* @__PURE__ */ React__default["default"].createElement(component.Popconfirm, {
      title: index.Translate.confirmClear,
      onConfirm: handleClearCompleted
    }, /* @__PURE__ */ React__default["default"].createElement("button", {
      className: "plugin-task-header-btn danger",
      title: index.Translate.clearCompleted
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:delete-sweep-outline"
    }))))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-tabs"
    }, /* @__PURE__ */ React__default["default"].createElement("button", {
      className: `plugin-task-tab ${activeTab === "undone" ? "active" : ""}`,
      onClick: () => setActiveTab("undone")
    }, index.Translate.undone, unDoneTasks.length > 0 && /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "plugin-task-tab-badge"
    }, unDoneTasks.length)), /* @__PURE__ */ React__default["default"].createElement("button", {
      className: `plugin-task-tab ${activeTab === "done" ? "active" : ""}`,
      onClick: () => setActiveTab("done")
    }, index.Translate.done, doneTasks.length > 0 && /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "plugin-task-tab-badge"
    }, doneTasks.length))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-content"
    }, /* @__PURE__ */ React__default["default"].createElement(NewTask, {
      onSuccess: fetch
    }), batchMode && activeTab === "undone" && unDoneTasks.length > 0 && /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-batch-bar"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Checkbox, {
      checked: selectedIds.size === unDoneTasks.length && unDoneTasks.length > 0,
      indeterminate: selectedIds.size > 0 && selectedIds.size < unDoneTasks.length,
      onChange: (e) => handleSelectAll(e.target.checked)
    }, index.Translate.selectAll), selectedIds.size > 0 && /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement("span", {
      className: "plugin-task-batch-count"
    }, index.Translate.selected, " ", selectedIds.size), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
      type: "primary",
      size: "small",
      onClick: handleBatchDone
    }, index.Translate.done))), displayTasks.length === 0 ? /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-empty"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: activeTab === "undone" ? "mdi:checkbox-marked-circle-outline" : "mdi:check-all",
      className: "plugin-task-empty-icon"
    }), /* @__PURE__ */ React__default["default"].createElement("span", null, activeTab === "undone" ? index.Translate.emptyUndone : index.Translate.emptyDone)) : /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-task-list"
    }, displayTasks.map((task) => /* @__PURE__ */ React__default["default"].createElement(TaskItem, {
      key: task._id,
      task,
      selected: selectedIds.has(task._id),
      onSelect: batchMode && activeTab === "undone" ? handleSelect : void 0,
      onRefresh: fetch,
      onDetail: !batchMode ? setDetailTask : void 0
    })))), /* @__PURE__ */ React__default["default"].createElement(TaskDrawer, {
      task: detailTask,
      visible: !!detailTask,
      onClose: () => setDetailTask(null),
      onRefresh: fetch
    }));
  });
  TasksPanel.displayName = "TasksPanel";

  exports["default"] = TasksPanel;

}));
//# sourceMappingURL=index-d42d6aba.js.map
