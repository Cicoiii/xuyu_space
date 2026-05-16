definePlugin('@plugins/com.msgbyte.topic/TopicCard-dd8b2221.js', ['exports', 'react', '@capital/common', '@capital/component', 'styled-components', './index-2df3cc0c'], (function (exports, React, common, component, styled, index) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
	var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

	const request = common.createPluginRequest("com.msgbyte.topic");

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */

	function baseSlice$1(array, start, end) {
	  var index = -1,
	      length = array.length;

	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = end > length ? length : end;
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	var _baseSlice = baseSlice$1;

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

	var baseSlice = _baseSlice,
	    toInteger = toInteger_1;

	/**
	 * Creates a slice of `array` with `n` elements taken from the end.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Array
	 * @param {Array} array The array to query.
	 * @param {number} [n=1] The number of elements to take.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {Array} Returns the slice of `array`.
	 * @example
	 *
	 * _.takeRight([1, 2, 3]);
	 * // => [3]
	 *
	 * _.takeRight([1, 2, 3], 2);
	 * // => [2, 3]
	 *
	 * _.takeRight([1, 2, 3], 5);
	 * // => [1, 2, 3]
	 *
	 * _.takeRight([1, 2, 3], 0);
	 * // => []
	 */
	function takeRight(array, n, guard) {
	  var length = array == null ? 0 : array.length;
	  if (!length) {
	    return [];
	  }
	  n = (guard || n === undefined) ? 1 : toInteger(n);
	  n = length - n;
	  return baseSlice(array, n < 0 ? 0 : n, length);
	}

	var takeRight_1 = takeRight;

	const Root$1 = styled__default["default"].div`
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.05);

  .dark & {
    background-color: rgba(0, 0, 0, 0.25);
  }

  .show-more {
    font-size: 12px;
    cursor: pointer;
    text-align: center;

    &:hover {
      color: #40a9ff;
    }
  }

  .comment-item {
    display: flex;
    margin-bottom: 10px;

    .left {
      margin-right: 4px;
    }

    .right {
      .username {
        font-weight: bold;
        line-height: 24px;
      }
    }
  }
`;
	const TopicComments = React__default["default"].memo((props) => {
	  const [showAllComment, setShowAllComment] = React.useState(false);
	  const comments = showAllComment ? props.comments : takeRight_1(props.comments, 2);
	  return /* @__PURE__ */ React__default["default"].createElement(Root$1, null, props.comments.length > 2 && !showAllComment && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "show-more",
	    onClick: () => setShowAllComment(true)
	  }, index.Translate.loadMore, "..."), comments.map((comment) => /* @__PURE__ */ React__default["default"].createElement("div", {
	    key: comment.id,
	    className: "comment-item"
	  }, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "left"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.UserAvatar, {
	    userId: comment.author,
	    size: 24
	  })), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "right"
	  }, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "username"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.UserName, {
	    userId: comment.author
	  })), /* @__PURE__ */ React__default["default"].createElement("div", null, common.getMessageRender(comment.content))))));
	});
	TopicComments.displayName = "TopicComments";

	const Root = styled__default["default"].div`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 3px;
  margin: 10px;
  width: auto;
  display: flex;

  .dark & {
    background-color: rgba(0, 0, 0, 0.25);
  }

  .left {
    margin-right: 10px;
  }

  .right {
    flex: 1;
    user-select: text;

    .header {
      display: flex;
      line-height: 32px;

      .name {
        margin-right: 4px;
      }

      .date {
        opacity: 0.6;
      }
    }

    .body {
      .content {
        margin-top: 6px;
        margin-bottom: 6px;
      }
    }

    .footer {
      display: flex;
      gap: 4px;
    }
  }
`;
	const ReplyBox = styled__default["default"].div`
  padding: 10px;
  margin-top: 10px;
  background-color: transparent;

  .dark & {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;
	const TopicCard = React__default["default"].memo((props) => {
	  var _a;
	  const topic = (_a = props.topic) != null ? _a : {};
	  const [showReply, toggleShowReply] = React.useReducer((state) => !state, false);
	  const [comment, setComment] = React.useState("");
	  const groupInfo = common.useGroupInfo(topic.groupId);
	  const groupOwnerId = groupInfo == null ? void 0 : groupInfo.owner;
	  const userId = common.useCurrentUserInfo()._id;
	  const [{ loading }, handleComment] = common.useAsyncRequest(async () => {
	    await request.post("createComment", {
	      groupId: topic.groupId,
	      panelId: topic.panelId,
	      topicId: topic._id,
	      content: comment
	    });
	    setComment("");
	    toggleShowReply();
	    common.showSuccessToasts();
	  }, [topic.groupId, topic.panelId, topic._id, comment]);
	  const [, handleDeleteTopic] = common.useAsyncRequest(async () => {
	    await request.post("delete", {
	      groupId: topic.groupId,
	      panelId: topic.panelId,
	      topicId: topic._id
	    });
	  }, []);
	  return /* @__PURE__ */ React__default["default"].createElement(component.MessageAckContainer, {
	    converseId: topic.panelId,
	    messageId: topic._id
	  }, /* @__PURE__ */ React__default["default"].createElement(Root, null, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "left"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.UserAvatar, {
	    userId: topic.author
	  })), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "right"
	  }, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "header"
	  }, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "name"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.UserName, {
	    userId: topic.author
	  })), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "date"
	  }, common.showMessageTime(topic.createdAt))), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "body"
	  }, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "content"
	  }, common.getMessageRender(topic.content)), Array.isArray(topic.comments) && topic.comments.length > 0 && /* @__PURE__ */ React__default["default"].createElement(TopicComments, {
	    comments: topic.comments
	  })), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "footer"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
	    title: index.Translate.reply,
	    icon: "mdi:message-reply-text-outline",
	    onClick: toggleShowReply
	  }), userId === groupOwnerId && /* @__PURE__ */ React__default["default"].createElement(component.Popconfirm, {
	    title: index.Translate.topicDeleteConfimTip,
	    onConfirm: handleDeleteTopic
	  }, /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
	    title: index.Translate.delete,
	    icon: "mdi:delete-outline"
	  }))), showReply && /* @__PURE__ */ React__default["default"].createElement(ReplyBox, null, /* @__PURE__ */ React__default["default"].createElement(component.TextArea, {
	    autoFocus: true,
	    placeholder: index.Translate.replyThisTopic,
	    disabled: loading,
	    value: comment,
	    row: 2,
	    maxLength: 1e3,
	    showCount: true,
	    onChange: (e) => setComment(e.target.value),
	    onPressEnter: handleComment
	  })))));
	});
	TopicCard.displayName = "TopicCard";

	exports.TopicCard = TopicCard;
	exports.request = request;

}));
//# sourceMappingURL=TopicCard-dd8b2221.js.map
