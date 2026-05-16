definePlugin('@plugins/com.msgbyte.agora/window-6716f199.js', ['exports', 'react', 'styled-components', '@capital/component', '@capital/common', 'agora-rtc-react', 'zustand', './index-a11c88dc', 'ahooks'], (function (exports, React, styled, component, common, AgoraRTC, create, index, ahooks) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
  var AgoraRTC__default = /*#__PURE__*/_interopDefaultLegacy(AgoraRTC);
  var create__default = /*#__PURE__*/_interopDefaultLegacy(create);

  const config = {
    mode: "rtc",
    codec: "vp8"
  };
  const useClient = AgoraRTC.createClient(config);
  const createCameraVideoTrack = AgoraRTC__default["default"].createCameraVideoTrack;
  const createMicrophoneAudioTrack = AgoraRTC__default["default"].createMicrophoneAudioTrack;
  const useScreenSharingClient = AgoraRTC.createClient(config);
  const createScreenVideoTrack = AgoraRTC__default["default"].createScreenVideoTrack;

  var __defProp$1 = Object.defineProperty;
  var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
  var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
  var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$1 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    if (__getOwnPropSymbols$1)
      for (var prop of __getOwnPropSymbols$1(b)) {
        if (__propIsEnum$1.call(b, prop))
          __defNormalProp$1(a, prop, b[prop]);
      }
    return a;
  };
  const useMeetingStore = create__default["default"]((set) => ({
    users: [],
    mediaPerm: { video: false, audio: false, screensharing: false },
    volumes: [],
    appendUser: (user) => {
      set((state) => ({
        users: [...state.users, user]
      }));
    },
    removeUser: (user) => {
      set((state) => {
        return {
          users: state.users.filter((_u) => _u.uid !== user.uid)
        };
      });
    },
    updateUserInfo: (user) => {
      set((state) => {
        const users = [...state.users];
        const targetUserIndex = state.users.findIndex((u) => u.uid === user.uid);
        if (targetUserIndex === -1) {
          return {};
        }
        users[targetUserIndex] = user;
        return {
          users
        };
      });
    },
    setMediaPerm: (perm) => {
      set((state) => ({
        mediaPerm: __spreadValues$1(__spreadValues$1({}, state.mediaPerm), perm)
      }));
    },
    reset: () => {
      set({
        users: [],
        mediaPerm: { video: false, audio: false }
      });
    }
  }));

  function getClientLocalTrack(client, trackMediaType) {
    var _a;
    return (_a = client.localTracks.find((track) => track.trackMediaType === trackMediaType)) != null ? _a : null;
  }

  const Root$3 = styled__default["default"].div`
  width: 95%;
  height: auto;
  position: relative;
  background-color: #333;
  border-radius: 10px;
  aspect-ratio: 16/9;
  justify-self: center;
  align-self: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  border-width: 3px;
  border-color: ${(props) => props.active ? "#7ab157;" : "transparent"};
  transition: border-color 0.2s;

  .player {
    width: 100%;
    height: 100%;
  }

  .name {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 4px 8px;
    color: white;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
  }

  .screen-icon {
    width: 96px;
    height: 96px;
    font-size: 96px;
  }
`;
  const VideViewIcon = React__default["default"].memo(({ uid }) => {
    if (uid.endsWith("_screen")) {
      return /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "screen-icon"
      }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
        icon: "mdi:projector-screen-outline"
      }));
    } else {
      return /* @__PURE__ */ React__default["default"].createElement(component.UserAvatar, {
        size: 96,
        userId: uid
      });
    }
  });
  VideViewIcon.displayName = "VideViewIcon";
  const VideViewName = React__default["default"].memo(({ uid }) => {
    if (uid.endsWith("_screen")) {
      const userId = uid.substring(0, uid.length - "_screen".length);
      return /* @__PURE__ */ React__default["default"].createElement("span", {
        className: "name"
      }, /* @__PURE__ */ React__default["default"].createElement(component.UserName, {
        userId
      }), index.Translate.someoneScreenName);
    } else {
      return /* @__PURE__ */ React__default["default"].createElement(component.UserName, {
        className: "name",
        userId: uid
      });
    }
  });
  VideViewName.displayName = "VideViewName";
  const VideoView = (props) => {
    const user = props.user;
    const active = useVolumeActive(String(user.uid));
    return /* @__PURE__ */ React__default["default"].createElement(Root$3, {
      active
    }, user.hasVideo && user.videoTrack ? /* @__PURE__ */ React__default["default"].createElement(AgoraRTC.AgoraVideoPlayer, {
      className: "player",
      videoTrack: user.videoTrack
    }) : /* @__PURE__ */ React__default["default"].createElement(VideViewIcon, {
      uid: String(user.uid)
    }), /* @__PURE__ */ React__default["default"].createElement(VideViewName, {
      uid: String(user.uid)
    }));
  };
  VideoView.displayName = "VideoView";
  const OwnVideoView = React__default["default"].memo(() => {
    const client = useClient();
    const mediaPerm = useMeetingStore((state) => state.mediaPerm);
    const active = useVolumeActive(String(client.uid));
    if (!client.uid) {
      return null;
    }
    const videoTrack = getClientLocalTrack(client, "video");
    return /* @__PURE__ */ React__default["default"].createElement(Root$3, {
      active
    }, mediaPerm.video ? /* @__PURE__ */ React__default["default"].createElement(AgoraRTC.AgoraVideoPlayer, {
      className: "player",
      videoTrack
    }) : /* @__PURE__ */ React__default["default"].createElement(VideViewIcon, {
      uid: String(client.uid)
    }), /* @__PURE__ */ React__default["default"].createElement(VideViewName, {
      uid: String(client.uid)
    }));
  });
  OwnVideoView.displayName = "OwnVideoView";
  function useVolumeActive(uid) {
    var _a;
    const volume = useMeetingStore((state) => state.volumes.find((v) => v.uid === uid));
    const volumeLevel = (_a = volume == null ? void 0 : volume.level) != null ? _a : 0;
    return volumeLevel >= 60;
  }

  const Root$2 = styled__default["default"].div`
  height: 70vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
`;
  const Videos = React__default["default"].memo(() => {
    const users = useMeetingStore((state) => state.users);
    return /* @__PURE__ */ React__default["default"].createElement(Root$2, null, /* @__PURE__ */ React__default["default"].createElement(OwnVideoView, null), users.length > 0 && users.map((user) => {
      return /* @__PURE__ */ React__default["default"].createElement(VideoView, {
        key: user.uid,
        user
      });
    }));
  });
  Videos.displayName = "Videos";

  const request = common.createPluginRequest("com.msgbyte.agora");

  function useScreenSharing() {
    const client = useClient();
    const screenSharingClient = useScreenSharingClient();
    React.useEffect(() => {
    }, []);
    const startScreenSharing = ahooks.useMemoizedFn(async () => {
      if (!client.channelName) {
        return;
      }
      const track = await createScreenVideoTrack({
        optimizationMode: "detail"
      }, "auto");
      let t;
      if (Array.isArray(track)) {
        t = track[0];
      } else {
        t = track;
      }
      t.on("track-ended", () => {
        stopScreenSharing();
      });
      const channelName = client.channelName;
      const { _id } = await common.getJWTUserInfo();
      const uid = _id + "_screen";
      const { data } = await request.post("generateJoinInfo", {
        channelName,
        userId: uid
      });
      const { appId, token } = data != null ? data : {};
      await screenSharingClient.join(appId, channelName, token, uid);
      await screenSharingClient.publish(track);
      useMeetingStore.getState().setMediaPerm({ screensharing: true });
    });
    const stopScreenSharing = ahooks.useMemoizedFn(async () => {
      screenSharingClient.localTracks.forEach((t) => t.close());
      await screenSharingClient.unpublish();
      await screenSharingClient.leave();
      useMeetingStore.getState().setMediaPerm({ screensharing: false });
    });
    return {
      startScreenSharing,
      stopScreenSharing
    };
  }

  const Controls = React__default["default"].memo((props) => {
    const client = useClient();
    const { startScreenSharing, stopScreenSharing } = useScreenSharing();
    const mediaPerm = useMeetingStore((state) => state.mediaPerm);
    const [{ loading }, mute] = common.useAsyncFn(ahooks.useMemoizedFn(async (type) => {
      if (type === "audio") {
        if (mediaPerm.audio === true) {
          const track = getClientLocalTrack(client, "audio");
          if (track) {
            await client.unpublish(track);
          }
        } else {
          const track = await createMicrophoneAudioTrack();
          await client.publish(track);
        }
        useMeetingStore.getState().setMediaPerm({ audio: !mediaPerm.audio });
      } else if (type === "video") {
        if (mediaPerm.video === true) {
          const track = getClientLocalTrack(client, "video");
          if (track) {
            await client.unpublish(track);
          }
        } else {
          const track = await createCameraVideoTrack();
          await client.publish(track);
        }
        useMeetingStore.getState().setMediaPerm({ video: !mediaPerm.video });
      } else if (type === "screensharing") {
        if (mediaPerm.screensharing === true) {
          await stopScreenSharing();
        } else {
          await startScreenSharing();
        }
      }
    }), []);
    const leaveChannel = async () => {
      await client.leave();
      client.removeAllListeners();
      useMeetingStore.getState().reset();
      client.localTracks.forEach((track) => {
        track.close();
      });
      props.onClose();
    };
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "controller"
    }, /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: mediaPerm.screensharing ? "mdi:projector-screen-outline" : "mdi:projector-screen-off-outline",
      title: mediaPerm.screensharing ? index.Translate.closeScreensharing : index.Translate.openScreensharing,
      active: mediaPerm.screensharing,
      disabled: loading,
      size: "large",
      onClick: () => mute("screensharing")
    }), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: mediaPerm.video ? "mdi:video" : "mdi:video-off",
      title: mediaPerm.video ? index.Translate.closeCamera : index.Translate.openCamera,
      active: mediaPerm.video,
      disabled: loading,
      size: "large",
      onClick: () => mute("video")
    }), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: mediaPerm.audio ? "mdi:microphone" : "mdi:microphone-off",
      title: mediaPerm.audio ? index.Translate.closeMic : index.Translate.openMic,
      active: mediaPerm.audio,
      disabled: loading,
      size: "large",
      onClick: () => mute("audio")
    }), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
      icon: "mdi:phone-remove-outline",
      title: index.Translate.hangUp,
      danger: true,
      size: "large",
      onClick: leaveChannel
    }));
  });
  Controls.displayName = "Controls";

  const Root$1 = styled__default["default"].div`
  display: flex;
  position: absolute;
  padding: 4px 8px;
  z-index: 20;

  div + div {
    margin-left: 8px;
  }
`;
  const NetworkStats = React__default["default"].memo(() => {
    const client = useClient();
    const [stats, setStats] = React.useState(void 0);
    React.useEffect(() => {
      const cb = (stats2) => {
        setStats(stats2);
      };
      client.on("network-quality", cb);
      return () => {
        client.off("network-quality", cb);
      };
    }, []);
    if (!stats) {
      return null;
    }
    return /* @__PURE__ */ React__default["default"].createElement(Root$1, null, /* @__PURE__ */ React__default["default"].createElement("div", null, index.Translate.uplink, ": ", parseQualityText(stats.uplinkNetworkQuality)), /* @__PURE__ */ React__default["default"].createElement("div", null, index.Translate.downlink, ": ", parseQualityText(stats.downlinkNetworkQuality)));
  });
  NetworkStats.displayName = "NetworkStats";
  function parseQualityText(quality) {
    if (quality === 1 || quality === 2) {
      return common.localTrans({
        "zh-CN": "\u4F18\u79C0",
        "en-US": "Good"
      });
    }
    if (quality === 3 || quality === 4) {
      return common.localTrans({
        "zh-CN": "\u4E00\u822C",
        "en-US": "Normal"
      });
    }
    if (quality === 5 || quality === 6) {
      return common.localTrans({
        "zh-CN": "\u5DEE",
        "en-US": "Bad"
      });
    }
    return common.localTrans({
      "zh-CN": "\u672A\u77E5",
      "en-US": "Unknown"
    });
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /** Used to match a single whitespace character. */

  var reWhitespace = /\s/;

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex$1(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  var _trimmedEndIndex = trimmedEndIndex$1;

  var trimmedEndIndex = _trimmedEndIndex;

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim$1(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  var _baseTrim = baseTrim$1;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */

  function isObject$1(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject$1;

  /** Detect free variable `global` from Node.js. */

  var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal$1;

  var freeGlobal = _freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$1 = freeGlobal || freeSelf || Function('return this')();

  var _root = root$1;

  var root = _root;

  /** Built-in value references. */
  var Symbol$2 = root.Symbol;

  var _Symbol = Symbol$2;

  var Symbol$1 = _Symbol;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto$1.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag$1;

  /** Used for built-in method references. */

  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }

  var _objectToString = objectToString$1;

  var Symbol = _Symbol,
      getRawTag = _getRawTag,
      objectToString = _objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag$1(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  var _baseGetTag = baseGetTag$1;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  function isObjectLike$1(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike$1;

  var baseGetTag = _baseGetTag,
      isObjectLike = isObjectLike_1;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol$1(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  var isSymbol_1 = isSymbol$1;

  var baseTrim = _baseTrim,
      isObject = isObject_1,
      isSymbol = isSymbol_1;

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber$1(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  var toNumber_1 = toNumber$1;

  var toNumber = toNumber_1;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_INTEGER = 1.7976931348623157e+308;

  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */
  function toFinite$1(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  var toFinite_1 = toFinite$1;

  var toFinite = toFinite_1;

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  function toInteger$1(value) {
    var result = toFinite(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  var toInteger_1 = toInteger$1;

  var toInteger = toInteger_1;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that invokes `func`, with the `this` binding and arguments
   * of the created function, while it's called less than `n` times. Subsequent
   * calls to the created function return the result of the last `func` invocation.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {number} n The number of calls at which `func` is no longer invoked.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * jQuery(element).on('click', _.before(5, addContactToList));
   * // => Allows adding up to 4 contacts to the list.
   */
  function before$1(n, func) {
    var result;
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    n = toInteger(n);
    return function() {
      if (--n > 0) {
        result = func.apply(this, arguments);
      }
      if (n <= 1) {
        func = undefined;
      }
      return result;
    };
  }

  var before_1 = before$1;

  var before = before_1;

  /**
   * Creates a function that is restricted to invoking `func` once. Repeat calls
   * to the function return the value of the first invocation. The `func` is
   * invoked with the `this` binding and arguments of the created function.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // => `createApplication` is invoked once
   */
  function once(func) {
    return before(2, func);
  }

  var once_1 = once;

  const Root = styled__default["default"].div`
  .body {
    flex: 1;
  }

  .controller {
    text-align: center;
    padding: 10px 0;

    * + * {
      margin-left: 10px;
    }
  }
`;
  const enableDualStream = once_1((client) => {
    return client.enableDualStream();
  });
  const MeetingView = React__default["default"].memo((props) => {
    const client = useClient();
    const channelName = props.meetingId;
    const [start, setStart] = React.useState(false);
    const initedRef = React.useRef(false);
    const init = ahooks.useMemoizedFn(async (channelName2) => {
      const { _id } = await common.getJWTUserInfo();
      client.on("user-published", async (user, mediaType) => {
        var _a;
        if (String(user.uid).startsWith(_id)) {
          return;
        }
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "audio") {
          (_a = user.audioTrack) == null ? void 0 : _a.play();
        }
        useMeetingStore.getState().updateUserInfo(user);
      });
      client.on("user-unpublished", async (user, mediaType) => {
        var _a;
        console.log("unpublished", user, mediaType);
        await client.unsubscribe(user, mediaType);
        if (mediaType === "audio") {
          (_a = user.audioTrack) == null ? void 0 : _a.stop();
        }
        useMeetingStore.getState().updateUserInfo(user);
      });
      client.on("user-joined", (user) => {
        console.log("user-joined", user);
        useMeetingStore.getState().appendUser(user);
      });
      client.on("user-left", (user) => {
        console.log("user-left", user);
        useMeetingStore.getState().removeUser(user);
      });
      client.on("volume-indicator", (volumes) => {
        useMeetingStore.setState({
          volumes: volumes.map((v) => ({
            uid: String(v.uid),
            level: v.level
          }))
        });
      });
      try {
        const { _id: _id2 } = await common.getJWTUserInfo();
        const { data } = await request.post("generateJoinInfo", {
          channelName: channelName2
        });
        const { appId, token } = data != null ? data : {};
        await client.join(appId, channelName2, token, _id2);
        await enableDualStream(client);
        client.enableAudioVolumeIndicator();
        setStart(true);
      } catch (err) {
        common.showErrorToasts(err);
      }
    });
    React.useEffect(() => {
      if (initedRef.current) {
        return;
      }
      if (common.isValidStr(channelName)) {
        init(channelName);
        initedRef.current = true;
      }
    }, [channelName]);
    return /* @__PURE__ */ React__default["default"].createElement(Root, null, /* @__PURE__ */ React__default["default"].createElement(NetworkStats, null), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "body"
    }, start ? /* @__PURE__ */ React__default["default"].createElement(Videos, null) : /* @__PURE__ */ React__default["default"].createElement(component.LoadingSpinner, {
      tip: index.Translate.joinTip
    })), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "controller"
    }, /* @__PURE__ */ React__default["default"].createElement(Controls, {
      onClose: props.onClose
    })));
  });
  MeetingView.displayName = "MeetingView";

  const SpeakerNames = React__default["default"].memo(() => {
    const volumes = useMeetingStore((state) => state.volumes);
    const activeUserNames = volumes.filter((v) => v.level >= 60).map((v) => /* @__PURE__ */ React__default["default"].createElement(component.UserName, {
      key: v.uid,
      userId: v.uid
    }));
    return /* @__PURE__ */ React__default["default"].createElement("span", null, /* @__PURE__ */ React__default["default"].createElement("span", null, common.joinArray(activeUserNames, ",")), activeUserNames.length > 0 ? " " + index.Translate.isSpeaking : index.Translate.nomanSpeaking);
  });
  SpeakerNames.displayName = "SpeakerNames";

  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  const FloatWindow = styled__default["default"].div`
  z-index: 100;
  position: fixed;
  background-color: var(--tc-content-background-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  left: 0;
  right: 0;
  top: 0;
  min-height: 240px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

  .folder-btn-container {
    position: absolute;
    bottom: -30px;
    left: 0;
    right: 0;
    display: flex;

    > .folder-btn {
      background-color: var(--tc-content-background-color);
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      border-radius: 0 0 3px 3px;
      margin: auto;
      display: inline-block;
      padding: 0 8px;
    }
  }
`;
  const FloatMeetingWindow = React__default["default"].memo((props) => {
    const [folder, setFolder] = React.useState(false);
    React.useEffect(() => {
      common.sharedEvent.emit("ensureWebRTCPermission");
    }, []);
    return /* @__PURE__ */ React__default["default"].createElement(FloatWindow, {
      style: {
        transform: folder ? "translateY(-100%)" : "none"
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.ErrorBoundary, null, /* @__PURE__ */ React__default["default"].createElement(MeetingView, __spreadValues({}, props))), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "folder-btn-container"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "folder-btn",
      onClick: () => setFolder(!folder)
    }, /* @__PURE__ */ React__default["default"].createElement(SpeakerNames, null), /* @__PURE__ */ React__default["default"].createElement(component.Divider, {
      type: "vertical"
    }), /* @__PURE__ */ React__default["default"].createElement("span", {
      style: { marginLeft: 4 }
    }, folder ? index.Translate.expand : index.Translate.foldup))));
  });
  FloatMeetingWindow.displayName = "FloatMeetingWindow";

  exports.FloatMeetingWindow = FloatMeetingWindow;

}));
//# sourceMappingURL=window-6716f199.js.map
