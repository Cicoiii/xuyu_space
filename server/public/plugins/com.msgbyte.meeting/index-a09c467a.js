definePlugin('@plugins/com.msgbyte.meeting/index-a09c467a.js', ['require', 'exports', '@capital/common', '@capital/component', 'react', './index-c86c21d0'], (function (require, exports, common, component, React, index) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  async function joinMeeting(meetingId) {
    const { data: joinMeetingInfo } = await index.request.get("getJoinMeetingInfo");
    const { signalingUrl, userId, nickname, avatar } = joinMeetingInfo;
    const { initMeetingClient } = await new Promise(function (resolve, reject) { require(['./client-b086d085'], resolve, reject); });
    const client = initMeetingClient(signalingUrl, userId);
    try {
      await client.join(meetingId, {
        video: false,
        audio: false,
        displayName: nickname,
        picture: avatar
      });
      client.onPeerJoin((peer) => {
        common.showToasts(`${peer.displayName} \u5DF2\u52A0\u5165\u4F1A\u8BDD`, "info");
      });
      client.onPeerLeave((peer) => {
        common.showToasts(`${peer.displayName} \u5DF2\u79BB\u5F00\u4F1A\u8BDD`, "info");
      });
      common.showToasts("\u52A0\u5165\u4F1A\u8BAE\u6210\u529F", "success");
      return client;
    } catch (err) {
      common.showErrorToasts(err);
      throw err;
    }
  }

  function useClientState(client) {
    const [volume, setVolume] = React.useState({ volume: 0, scaledVolume: 0 });
    const [peers, setPeers] = React.useState([]);
    const [webcamSrcObject, setWebcamSrcObject] = React.useState();
    const [webcamEnabled, setWebcamEnabled] = React.useState(false);
    const [micEnabled, setMicEnabled] = React.useState(false);
    React.useLayoutEffect(() => {
      const webcamProduceHandler = (webcamProducer) => {
        if (webcamProducer.track) {
          setWebcamEnabled(true);
          setWebcamSrcObject(new MediaStream([webcamProducer.track]));
        }
      };
      const webcamCloseHandler = () => {
        setWebcamSrcObject(null);
        setWebcamEnabled(false);
      };
      const micProduceHandler = (micProducer) => {
        micProducer.appData.volumeWatcher.on("volumeChange", (data) => {
          setVolume(data);
        });
        setMicEnabled(true);
      };
      const micCloseHandler = () => {
        setMicEnabled(false);
      };
      const peersUpdatedHandler = (peers2) => {
        setPeers([...peers2]);
      };
      client.on("webcamProduce", webcamProduceHandler);
      client.on("webcamClose", webcamCloseHandler);
      client.on("micProduce", micProduceHandler);
      client.on("micClose", micCloseHandler);
      client.room.on("peersUpdated", peersUpdatedHandler);
      setPeers(client.room.peers);
      return () => {
        client.off("webcamProduce", webcamProduceHandler);
        client.off("webcamClose", webcamCloseHandler);
        client.off("micProduce", micProduceHandler);
        client.off("micClose", micCloseHandler);
        client.room.off("peersUpdated", peersUpdatedHandler);
      };
    }, [client]);
    function switchWebcam() {
      if (!client) {
        return;
      }
      if (client.webcamEnabled) {
        client.disableWebcam();
      } else {
        client.enableWebcam();
      }
    }
    function switchMic() {
      if (!client) {
        return;
      }
      if (client.micEnabled) {
        client.disableMic();
      } else {
        client.enableMic();
      }
    }
    return {
      volume,
      peers,
      webcamSrcObject,
      webcamEnabled,
      micEnabled,
      switchWebcam,
      switchMic
    };
  }

  const MeetingClientContext = React__default["default"].createContext({});
  MeetingClientContext.displayName = "MeetingClientContext";
  const MeetingClientContextProvider = React__default["default"].memo((props) => {
    return /* @__PURE__ */ React__default["default"].createElement(MeetingClientContext.Provider, {
      value: { client: props.client }
    }, props.children);
  });
  MeetingClientContextProvider.displayName = "MeetingClientContextProvider";
  function useMeetingClientContext() {
    return React.useContext(MeetingClientContext);
  }

  const PeerView = React__default["default"].memo((props) => {
    const { peer } = props;
    return /* @__PURE__ */ React__default["default"].createElement("div", null, /* @__PURE__ */ React__default["default"].createElement(component.Avatar, {
      size: 92,
      src: peer.picture,
      name: peer.displayName
    }));
  });
  PeerView.displayName = "PeerView";

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".plugin-meeting-floatwindow {\n  z-index: 100;\n  position: fixed;\n  background-color: var(--tc-content-background-color);\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);\n  left: 0;\n  right: 0;\n  top: 0;\n  min-height: 240px;\n  transition: all 0.2s ease-in-out;\n  display: flex;\n  flex-direction: column;\n}\n.plugin-meeting-floatwindow .body {\n  flex: 1;\n}\n.plugin-meeting-floatwindow .body .peers {\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.plugin-meeting-floatwindow .body .peers > div {\n  min-width: 20%;\n  text-align: center;\n  padding: 16px;\n}\n.plugin-meeting-floatwindow .controller {\n  text-align: center;\n  padding: 10px 0;\n}\n.plugin-meeting-floatwindow .controller * + * {\n  margin-left: 10px;\n}\n.plugin-meeting-floatwindow .folder-btn {\n  background-color: var(--tc-content-background-color);\n  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);\n  position: absolute;\n  bottom: -30px;\n  height: 30px;\n  line-height: 30px;\n  left: 50%;\n  width: 60px;\n  margin-left: -30px;\n  text-align: center;\n  cursor: pointer;\n  border-radius: 0 0 3px 3px;\n}\n";
  n(css,{});

  const FloatMeetingWindow = React__default["default"].memo((props) => {
    const [folder, setFolder] = React.useState(false);
    const { client } = useMeetingClientContext();
    const {
      volume,
      peers,
      webcamSrcObject,
      webcamEnabled,
      micEnabled,
      switchWebcam,
      switchMic
    } = useClientState(client);
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-meeting-floatwindow",
      style: {
        transform: folder ? "translateY(-100%)" : "none"
      }
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "body"
    }, /* @__PURE__ */ React__default["default"].createElement("div", null, "\u5F53\u524D\u6B63\u5728\u4F1A\u8BAE\u4E2D"), /* @__PURE__ */ React__default["default"].createElement("div", null, "\u6211\u7684\u97F3\u91CF: ", JSON.stringify(volume)), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "peers"
    }, peers.map((peer) => /* @__PURE__ */ React__default["default"].createElement(PeerView, {
      key: peer.id,
      peer
    })))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "controller"
    }, /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: webcamEnabled ? "mdi:video" : "mdi:video-off",
      title: webcamEnabled ? "\u5173\u95ED\u6444\u50CF\u5934" : "\u5F00\u542F\u6444\u50CF\u5934",
      size: "large",
      onClick: switchWebcam
    }), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: micEnabled ? "mdi:microphone" : "mdi:microphone-off",
      title: micEnabled ? "\u5173\u95ED\u9EA6\u514B\u98CE" : "\u5F00\u542F\u9EA6\u514B\u98CE",
      size: "large",
      onClick: switchMic
    }), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: "mdi:phone-remove-outline",
      title: "\u6302\u65AD",
      danger: true,
      size: "large",
      onClick: () => {
        client.close();
        props.onClose();
      }
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "folder-btn",
      onClick: () => setFolder(!folder)
    }, folder ? "\u5C55\u5F00" : "\u6536\u8D77"));
  });
  FloatMeetingWindow.displayName = "FloatMeetingWindow";
  const FloatMeetingWindowWrapper = React__default["default"].memo((props) => {
    const { loading, value: client } = common.useAsync(() => joinMeeting(props.meetingId), []);
    if (loading) {
      return /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "plugin-meeting-floatwindow"
      }, /* @__PURE__ */ React__default["default"].createElement(component.LoadingSpinner, null));
    }
    if (!client) {
      return /* @__PURE__ */ React__default["default"].createElement("div", null, "\u51FA\u73B0\u9519\u8BEF");
    }
    return /* @__PURE__ */ React__default["default"].createElement(MeetingClientContextProvider, {
      client
    }, /* @__PURE__ */ React__default["default"].createElement(FloatMeetingWindow, {
      onClose: props.onClose
    }), ";");
  });
  FloatMeetingWindowWrapper.displayName = "FloatMeetingWindowWrapper";

  function startFastMeeting(meetingId) {
    console.log("startFastMeeting:", meetingId);
    const key = component.PortalAdd(/* @__PURE__ */ React__default["default"].createElement(component.ErrorBoundary, null, /* @__PURE__ */ React__default["default"].createElement(FloatMeetingWindowWrapper, {
      meetingId,
      onClose: () => {
        component.PortalRemove(key);
      }
    })));
  }

  exports.startFastMeeting = startFastMeeting;

}));
//# sourceMappingURL=index-a09c467a.js.map
