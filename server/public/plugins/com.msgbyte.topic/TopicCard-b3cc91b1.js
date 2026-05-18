definePlugin('@plugins/com.msgbyte.topic/TopicCard-b3cc91b1.js', ['exports', 'react', '@capital/common', '@capital/component', 'styled-components', './index-f8f06e03', 'zustand', 'zustand/middleware/immer'], (function (exports, React, common, component, styled, index, create, immer) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
	var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
	var create__default = /*#__PURE__*/_interopDefaultLegacy(create);

	const request = common.createPluginRequest("com.msgbyte.topic");
	const assistantRequest = common.createPluginRequest("com.msgbyte.ai-assistant");

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

	function openImageFile() {
	  return new Promise((resolve) => {
	    const input = document.createElement("input");
	    input.type = "file";
	    input.accept = "image/*";
	    input.onchange = () => {
	      var _a, _b;
	      resolve((_b = (_a = input.files) == null ? void 0 : _a[0]) != null ? _b : null);
	    };
	    input.click();
	  });
	}
	async function uploadTopicImage(file) {
	  const fileInfo = await common.uploadFile(file, {
	    usage: "chat"
	  });
	  return fileInfo.url;
	}
	function getClipboardImageFile(event) {
	  var _a, _b, _c;
	  const items = Array.from((_b = (_a = event.clipboardData) == null ? void 0 : _a.items) != null ? _b : []);
	  const imageItem = items.find((item) => item.type.startsWith("image/"));
	  return (_c = imageItem == null ? void 0 : imageItem.getAsFile()) != null ? _c : null;
	}
	function extractContentImages(content = "") {
	  const images = [];
	  const text = content.replace(/\[img(?:\s+[^\]]*)?\]([\s\S]*?)\[\/img\]/gi, (_, url) => {
	    const imageUrl = String(url).trim();
	    if (imageUrl) {
	      images.push(imageUrl);
	    }
	    return "";
	  }).replace(/\n{3,}/g, "\n\n").trim();
	  return {
	    text,
	    images
	  };
	}

	const Root$4 = styled__default["default"].div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 128px));
  gap: 6px;
  max-width: 400px;
  margin-top: 8px;

  .topic-image-preview-item & {
    display: block;
    margin-top: 0;
  }

  .topic-image {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid var(--tc-border-soft-color);
    background: var(--tc-surface-soft-color);

    .ant-image,
    img {
      width: 100%;
      height: 100%;
      display: block;
    }

    img {
      object-fit: cover;
    }
  }
`;
	const TopicImageGrid = React__default["default"].memo((props) => {
	  var _a;
	  const images = ((_a = props.images) != null ? _a : []).filter(Boolean);
	  if (images.length === 0) {
	    return null;
	  }
	  return /* @__PURE__ */ React__default["default"].createElement(Root$4, null, images.map((image, index) => /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "topic-image",
	    key: `${image}-${index}`
	  }, /* @__PURE__ */ React__default["default"].createElement(component.Image, {
	    preview: true,
	    src: common.parseUrlStr(image)
	  }))));
	});
	TopicImageGrid.displayName = "TopicImageGrid";

	const Root$3 = styled__default["default"].div`
  padding: 10px 0 0;
  margin-top: 10px;
  border-top: 1px solid var(--tc-border-soft-color);

  .show-more {
    font-size: 12px;
    cursor: pointer;
    color: var(--tc-primary-color);
    margin-bottom: 8px;

    &:hover {
      color: var(--tc-primary-hover-color);
    }
  }

  .comment-item {
    display: flex;
    gap: 8px;
    padding: 8px 0;

    .left {
      flex: 0 0 auto;
    }

    .right {
      flex: 1;
      min-width: 0;

      .username {
        font-weight: bold;
        line-height: 24px;
        color: var(--tc-text-color);
      }

      .content {
        margin-top: 2px;
        color: var(--tc-text-color);
        line-height: 1.55;
        word-break: break-word;
      }

      .meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;

        .badge {
          border-radius: 3px;
          padding: 1px 5px;
          font-size: 12px;
          line-height: 18px;
          background: var(--tc-primary-soft-color);
          color: var(--tc-primary-color);
        }

        .count {
          font-size: 12px;
          color: var(--tc-text-muted-color);
        }
      }
    }
  }
`;
	const TopicComments = React__default["default"].memo((props) => {
	  const [showAllComment, setShowAllComment] = React.useState(false);
	  const { topic, currentUserId } = props;
	  const sortedComments = React.useMemo(() => {
	    var _a;
	    return [...(_a = topic.comments) != null ? _a : []].sort((a, b) => {
	      if (a.pinned === b.pinned) {
	        return 0;
	      }
	      return a.pinned ? -1 : 1;
	    });
	  }, [topic.comments]);
	  const visibleComments = React.useMemo(() => {
	    if (showAllComment) {
	      return sortedComments;
	    }
	    const pinnedComments = sortedComments.filter((comment) => comment.pinned);
	    const normalComments = sortedComments.filter((comment) => !comment.pinned);
	    if (pinnedComments.length >= 2) {
	      return pinnedComments;
	    }
	    return [
	      ...pinnedComments,
	      ...takeRight_1(normalComments, 2 - pinnedComments.length)
	    ];
	  }, [showAllComment, sortedComments]);
	  const handleCommentUpvote = (commentId) => {
	    request.post("toggleCommentUpvote", {
	      groupId: topic.groupId,
	      panelId: topic.panelId,
	      topicId: topic._id,
	      commentId
	    });
	  };
	  const handleCommentPinned = (commentId) => {
	    request.post("toggleCommentPinned", {
	      groupId: topic.groupId,
	      panelId: topic.panelId,
	      topicId: topic._id,
	      commentId
	    });
	  };
	  return /* @__PURE__ */ React__default["default"].createElement(Root$3, null, sortedComments.length > 2 && !showAllComment && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "show-more",
	    onClick: () => setShowAllComment(true)
	  }, index.Translate.loadMore, "..."), visibleComments.map((comment) => {
	    var _a, _b;
	    const upvotes = (_a = comment.upvotes) != null ? _a : [];
	    const hasUpvoted = upvotes.includes(currentUserId);
	    const isTopicAuthor = currentUserId === topic.author;
	    const { text, images } = extractContentImages(comment.content);
	    const commentImages = [...images, ...(_b = comment.images) != null ? _b : []];
	    return /* @__PURE__ */ React__default["default"].createElement("div", {
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
	    })), text && /* @__PURE__ */ React__default["default"].createElement("div", {
	      className: "content"
	    }, common.getMessageRender(text)), /* @__PURE__ */ React__default["default"].createElement(TopicImageGrid, {
	      images: commentImages
	    }), /* @__PURE__ */ React__default["default"].createElement("div", {
	      className: "meta"
	    }, comment.pinned && /* @__PURE__ */ React__default["default"].createElement("span", {
	      className: "badge"
	    }, index.Translate.pinned), comment.authorLiked && /* @__PURE__ */ React__default["default"].createElement("span", {
	      className: "badge"
	    }, index.Translate.authorLiked), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
	      size: "small",
	      title: hasUpvoted ? index.Translate.cancelUpvote : index.Translate.upvote,
	      icon: hasUpvoted ? "mdi:thumb-up" : "mdi:thumb-up-outline",
	      active: hasUpvoted,
	      onClick: () => handleCommentUpvote(comment.id)
	    }), upvotes.length > 0 && /* @__PURE__ */ React__default["default"].createElement("span", {
	      className: "count"
	    }, upvotes.length), isTopicAuthor && /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
	      size: "small",
	      title: comment.pinned ? index.Translate.unpinComment : index.Translate.pinComment,
	      icon: comment.pinned ? "mdi:pin-off" : "mdi:pin-outline",
	      active: comment.pinned,
	      onClick: () => handleCommentPinned(comment.id)
	    }))));
	  }));
	});
	TopicComments.displayName = "TopicComments";

	const Root$2 = styled__default["default"].div`
  margin-top: 8px;

  .topic-image-composer-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--tc-border-soft-color);
  }

  .topic-image-composer-extra {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .topic-image-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(88px, 128px));
    gap: 6px;
    max-width: 400px;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .topic-image-preview-item {
    position: relative;
  }

  .topic-image-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.45);
    color: #fff;
    border-radius: 50%;
  }
`;
	const TopicImageComposer = React__default["default"].memo((props) => {
	  return /* @__PURE__ */ React__default["default"].createElement(Root$2, null, props.images.length > 0 && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "topic-image-preview"
	  }, props.images.map((image, index$1) => /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "topic-image-preview-item",
	    key: `${image}-${index$1}`
	  }, /* @__PURE__ */ React__default["default"].createElement(TopicImageGrid, {
	    images: [image]
	  }), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
	    className: "topic-image-remove",
	    size: "small",
	    title: index.Translate.removeImage,
	    icon: "mdi:close",
	    onClick: () => props.onRemoveImage(index$1)
	  })))), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "topic-image-composer-actions"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
	    disabled: props.uploading,
	    onClick: props.onUploadImage
	  }, props.uploading ? index.Translate.loading : index.Translate.uploadImage), props.action && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "topic-image-composer-extra"
	  }, props.action)));
	});
	TopicImageComposer.displayName = "TopicImageComposer";

	const Root$1 = styled__default["default"].div`
  position: relative;

  .assistant-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 1px solid var(--tc-border-color);
    color: var(--tc-text-secondary-color);
    background: transparent;
    border-radius: 8px;

    &:hover {
      border-color: var(--tc-primary-shadow-color);
      color: var(--tc-primary-color);
      background: var(--tc-primary-faint-color);
    }
  }

  .assistant-panel {
    position: absolute;
    right: 0;
    bottom: calc(100% + 8px);
    z-index: 20;
    width: 380px;
    max-width: min(380px, calc(100vw - 32px));
    border: 1px solid var(--tc-border-color);
    border-radius: 16px;
    background: var(--tc-surface-panel-color);
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04),
      0 8px 40px rgba(0, 0, 0, 0.08);
  }

  .assistant-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 10px;
    color: var(--tc-text-color);
    font-weight: 600;
  }

  .assistant-title-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    color: #fff;
    background: var(--tc-primary-color);
  }

  .assistant-body {
    padding: 0 16px 12px;
  }

  .assistant-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .assistant-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 20px;
    border: 1px solid var(--tc-border-color);
    color: var(--tc-text-secondary-color);
    background: transparent;

    &:hover {
      color: var(--tc-primary-color);
      border-color: var(--tc-primary-shadow-color);
      background: var(--tc-primary-faint-color);
    }
  }

  .assistant-result {
    margin-top: 10px;
    padding: 12px;
    max-height: 220px;
    overflow: auto;
    border-radius: 12px;
    background: var(--tc-surface-soft-color);
    color: var(--tc-text-color);
    line-height: 1.65;
  }

  .assistant-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 16px 14px;
    border-top: 1px solid var(--tc-border-soft-color);
  }
`;
	const actions = [
	  { type: "improve", label: index.Translate.improveText, icon: "mdi:auto-fix" },
	  {
	    type: "shorter",
	    label: index.Translate.makeShorter,
	    icon: "mdi:arrow-collapse-horizontal"
	  },
	  {
	    type: "longer",
	    label: index.Translate.makeLonger,
	    icon: "mdi:arrow-expand-horizontal"
	  },
	  { type: "translate", label: index.Translate.translateText, icon: "mdi:translate" }
	];
	const TopicAssistantTools = React__default["default"].memo((props) => {
	  const [open, setOpen] = React.useState(false);
	  const [answer, setAnswer] = React.useState("");
	  const [{ loading }, handleRun] = common.useAsyncRequest(async (action) => {
	    const content = props.value.trim();
	    if (!content) {
	      common.showToasts(index.Translate.aiEmptyInput, "warning");
	      return;
	    }
	    const { data } = await assistantRequest.post("chat", {
	      content,
	      action
	    });
	    if ((data == null ? void 0 : data.result) && typeof data.answer === "string") {
	      setAnswer(data.answer);
	    } else {
	      common.showToasts((data == null ? void 0 : data.answer) || index.Translate.topicDataError, "warning");
	    }
	  }, [props.value, props.onApply]);
	  return /* @__PURE__ */ React__default["default"].createElement(Root$1, null, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
	    className: "assistant-trigger",
	    title: index.Translate.xiaoxuAssistant,
	    onClick: () => setOpen((v) => !v)
	  }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
	    icon: "mdi:creation"
	  })), open && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "assistant-panel"
	  }, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "assistant-title"
	  }, /* @__PURE__ */ React__default["default"].createElement("span", {
	    className: "assistant-title-icon"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
	    icon: "mdi:creation"
	  })), /* @__PURE__ */ React__default["default"].createElement("span", null, loading ? index.Translate.aiThinking : index.Translate.xiaoxuAssistant)), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "assistant-body"
	  }, /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "assistant-actions"
	  }, actions.map((item) => /* @__PURE__ */ React__default["default"].createElement(component.Button, {
	    className: "assistant-chip",
	    key: item.type,
	    size: "small",
	    disabled: loading,
	    onClick: () => handleRun(item.type)
	  }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
	    icon: item.icon
	  }), item.label))), answer && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "assistant-result"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.Markdown, {
	    raw: answer
	  }))), answer && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "assistant-footer"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.Button, {
	    onClick: () => setAnswer("")
	  }, index.Translate.delete), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
	    type: "primary",
	    onClick: () => {
	      props.onApply(answer);
	      setOpen(false);
	      setAnswer("");
	    }
	  }, index.Translate.applyToInput))));
	});
	TopicAssistantTools.displayName = "TopicAssistantTools";

	const useTopicStore = create__default["default"](immer.immer((set) => ({
	  topicMap: {},
	  addTopicPanel: (panelId, topicList) => {
	    set((state) => {
	      if (state.topicMap[panelId]) {
	        const topicMap = new Map(state.topicMap[panelId].map((topic) => [topic._id, topic]));
	        topicList.forEach((topic) => {
	          topicMap.set(topic._id, topic);
	        });
	        state.topicMap[panelId] = Array.from(topicMap.values());
	      } else {
	        state.topicMap[panelId] = topicList;
	      }
	    });
	  },
	  addTopicItem: (panelId, topic) => {
	    set((state) => {
	      const topicList = state.topicMap[panelId];
	      if (topicList) {
	        const existedIndex = topicList.findIndex((t) => t._id === topic._id);
	        if (existedIndex >= 0) {
	          topicList[existedIndex] = topic;
	          return;
	        }
	        state.topicMap[panelId].unshift(topic);
	      } else {
	        state.topicMap[panelId] = [topic];
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
	        } else {
	          state.topicMap[panelId].unshift(topic);
	        }
	      } else {
	        state.topicMap[panelId] = [topic];
	      }
	    });
	  },
	  resetTopicPanel: (panelId) => {
	    set((state) => {
	      delete state.topicMap[panelId];
	    });
	  }
	})));

	const Root = styled__default["default"].div`
  background: var(--tc-surface-panel-color);
  color: var(--tc-text-color);
  border: 1px solid var(--tc-border-color);
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: auto;
  display: flex;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: var(--tc-primary-light-strong-color);
  }

  .left {
    margin-right: 12px;
  }

  .right {
    flex: 1;
    user-select: text;

    .header {
      display: flex;
      align-items: baseline;
      line-height: 22px;
      gap: 6px;

      .name {
        font-weight: 600;
        color: var(--tc-text-color);
      }

      .date {
        color: var(--tc-text-muted-color);
        font-size: 12px;
      }
    }

    .body {
      .content {
        margin-top: 6px;
        color: var(--tc-text-color);
        line-height: 1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    .footer {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-top: 10px;
      color: var(--tc-text-secondary-color);

      .count {
        font-size: 12px;
        color: var(--tc-text-muted-color);
        margin-right: 6px;
      }
    }
  }
`;
	const ReplyBox = styled__default["default"].div`
  padding: 10px;
  margin-top: 10px;
  border: 1px solid var(--tc-border-soft-color);
  border-radius: 8px;
  background: var(--tc-surface-soft-color);

  .dark & {
    background: var(--tc-surface-soft-color);
  }

  .reply-input {
    resize: none;
    border: 0;
    box-shadow: none;
    padding: 0;
    background: transparent;
    color: var(--tc-text-color);

    &:focus {
      border: 0;
      box-shadow: none;
    }
  }
`;
	const TopicCard = React__default["default"].memo((props) => {
	  var _a, _b;
	  const topic = (_a = props.topic) != null ? _a : {};
	  const [showReply, toggleShowReply] = React.useReducer((state) => !state, false);
	  const [comment, setComment] = React.useState("");
	  const [commentImages, setCommentImages] = React.useState([]);
	  const groupInfo = common.useGroupInfo(topic.groupId);
	  const groupOwnerId = groupInfo == null ? void 0 : groupInfo.owner;
	  const userId = common.useCurrentUserInfo()._id;
	  const updateTopicItem = useTopicStore((state) => state.updateTopicItem);
	  const upvotes = (_b = topic.upvotes) != null ? _b : [];
	  const hasUpvoted = upvotes.includes(userId);
	  const topicContent = React.useMemo(() => {
	    var _a2;
	    const { text, images } = extractContentImages(topic.content);
	    return {
	      text,
	      images: [...images, ...(_a2 = topic.images) != null ? _a2 : []]
	    };
	  }, [topic.content, topic.images]);
	  const [{ loading }, handleComment] = common.useAsyncRequest(async () => {
	    const content = comment.trim();
	    if (!content && commentImages.length === 0) {
	      return;
	    }
	    const { data: updatedTopic } = await request.post("createComment", {
	      groupId: topic.groupId,
	      panelId: topic.panelId,
	      topicId: topic._id,
	      content,
	      images: commentImages
	    });
	    if (updatedTopic && topic.panelId) {
	      updateTopicItem(topic.panelId, updatedTopic);
	    }
	    setComment("");
	    setCommentImages([]);
	    toggleShowReply();
	    common.showSuccessToasts();
	  }, [
	    topic.groupId,
	    topic.panelId,
	    topic._id,
	    comment,
	    commentImages,
	    updateTopicItem
	  ]);
	  const [{ loading: upvoting }, handleTopicUpvote] = common.useAsyncRequest(async () => {
	    await request.post("toggleTopicUpvote", {
	      groupId: topic.groupId,
	      panelId: topic.panelId,
	      topicId: topic._id
	    });
	  }, [topic.groupId, topic.panelId, topic._id]);
	  const [{ loading: uploading }, handleUploadReplyImage] = common.useAsyncRequest(async () => {
	    const file = await openImageFile();
	    if (!file) {
	      return;
	    }
	    try {
	      const imageUrl = await uploadTopicImage(file);
	      setCommentImages((value) => [...value, imageUrl]);
	      common.showToasts(index.Translate.uploadImage, "success");
	    } catch (err) {
	      common.showErrorToasts(err);
	    }
	  }, []);
	  const handlePasteReply = async (e) => {
	    const file = getClipboardImageFile(e);
	    if (!file) {
	      return;
	    }
	    e.preventDefault();
	    try {
	      const imageUrl = await uploadTopicImage(file);
	      setCommentImages((value) => [...value, imageUrl]);
	      common.showToasts(index.Translate.uploadImage, "success");
	    } catch (err) {
	      common.showErrorToasts(err);
	    }
	  };
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
	  }, topicContent.text && /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "content"
	  }, common.getMessageRender(topicContent.text)), /* @__PURE__ */ React__default["default"].createElement(TopicImageGrid, {
	    images: topicContent.images
	  }), Array.isArray(topic.comments) && topic.comments.length > 0 && /* @__PURE__ */ React__default["default"].createElement(TopicComments, {
	    topic,
	    currentUserId: userId
	  })), /* @__PURE__ */ React__default["default"].createElement("div", {
	    className: "footer"
	  }, /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
	    title: hasUpvoted ? index.Translate.cancelUpvote : index.Translate.upvote,
	    icon: hasUpvoted ? "mdi:thumb-up" : "mdi:thumb-up-outline",
	    active: hasUpvoted,
	    disabled: upvoting,
	    onClick: handleTopicUpvote
	  }), upvotes.length > 0 && /* @__PURE__ */ React__default["default"].createElement("span", {
	    className: "count"
	  }, upvotes.length), /* @__PURE__ */ React__default["default"].createElement(component.IconBtn, {
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
	    className: "reply-input",
	    placeholder: index.Translate.replyThisTopic,
	    disabled: loading,
	    value: comment,
	    autoSize: { minRows: 2, maxRows: 6 },
	    maxLength: 1e3,
	    showCount: false,
	    onChange: (e) => setComment(e.target.value),
	    onPaste: handlePasteReply,
	    onPressEnter: handleComment
	  }), /* @__PURE__ */ React__default["default"].createElement(TopicImageComposer, {
	    images: commentImages,
	    uploading,
	    onUploadImage: handleUploadReplyImage,
	    onRemoveImage: (index) => setCommentImages((value) => value.filter((_, i) => i !== index)),
	    action: /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement(TopicAssistantTools, {
	      value: comment,
	      onApply: setComment
	    }), /* @__PURE__ */ React__default["default"].createElement(component.Button, {
	      type: "primary",
	      loading,
	      disabled: !comment.trim() && commentImages.length === 0,
	      onClick: handleComment
	    }, index.Translate.reply))
	  })))));
	});
	TopicCard.displayName = "TopicCard";

	exports.TopicAssistantTools = TopicAssistantTools;
	exports.TopicCard = TopicCard;
	exports.TopicImageComposer = TopicImageComposer;
	exports.getClipboardImageFile = getClipboardImageFile;
	exports.openImageFile = openImageFile;
	exports.request = request;
	exports.uploadTopicImage = uploadTopicImage;
	exports.useTopicStore = useTopicStore;

}));
//# sourceMappingURL=TopicCard-b3cc91b1.js.map
