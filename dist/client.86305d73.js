// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../dist/client/cjm/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rescale = exports.get = void 0;
/**
 * Thow an error if the key is not in the map otherwise return the value mapped to the key.
 * @param map The map to search in.
 * @param key The key to search for.
 * @returns The value mapped to the key.
 * @throws An error if the key is not in the map.
 */
function get(map, key) {
  if (!map.has(key)) {
    throw new Error("Key ".concat(key, " not found in map"));
  }
  return map.get(key);
}
exports.get = get;
/**
 * Linearly rescale a value from one range to another.
 * @param min The minimum value of the original range.
 * @param range The original range.
 * @param newMin The minimum value of the new range.
 * @param newRange The new range.
 * @param value The value to rescale.
 * @returns The rescaled value.
 */
function rescale(min, range, newMin, newRange, value) {
  // The + 0.0 is to force the division to be a floating point division.
  //return (((value - min) / (range + 0.0)) * (newRange)) + newMin;
  return (value - min) * newRange / (range + 0.0) + newMin;
}
exports.rescale = rescale;
},{}],"../dist/client/cjm/xml.js":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHTML = exports.getSingularElement = exports.getAttributes = exports.getTag = exports.getEndTag = exports.getStartTag = exports.getNodeValue = exports.getFirstChildNode = exports.getFirstElement = exports.getAttribute = void 0;
/**
 * Get the attribute of an xml element.
 * @param xml The xml element to search in.
 * @param name The name of the attribute to search for.
 * @returns The value of the attribute.
 * @throws An error if the attribute is not found.
 */
function getAttribute(xml, name) {
  var v = xml.getAttribute(name);
  if (!v) {
    throw new Error(name + ' attribute not found');
  }
  return v;
}
exports.getAttribute = getAttribute;
/**
 * Get the first element in element with a tag name tagName.
 * @param element The xml element to search in.
 * @param tagName The tag name of the elements to search for.
 * @returns The first element in element with a tag name tagName.
 * @throws An error if the element is not found.
 */
function getFirstElement(element, tagName) {
  var el = element.getElementsByTagName(tagName)[0];
  if (el == null) {
    throw new Error(tagName + ' element not found');
  }
  return el;
}
exports.getFirstElement = getFirstElement;
/**
 * Get the first childNode.
 * @param {Element} element The xml element to search in.
 * @returns {ChildNode} The first ChildNode if there is one.
 * @throws An error if the element has no childNodes.
 */
function getFirstChildNode(element) {
  var cn = element.childNodes;
  if (cn == null) {
    throw new Error('Element has no childNodes');
  }
  return cn[0];
}
exports.getFirstChildNode = getFirstChildNode;
/**
 * Get the nodeValue of a ChildNode.
 * @param {ChildNode} node The node to get the nodeValue of.
 * @returns {string} The nodeValue of the node.
 * @throws An error if the nodeValue is null.
 */
function getNodeValue(node) {
  var nodeValue = node.nodeValue;
  if (nodeValue == null) {
    throw new Error('nodeValue is null');
  }
  return nodeValue;
}
exports.getNodeValue = getNodeValue;
/**
 * Create and return a XML start tag. For multiple attributes, pass them in a map.
 * If there is only one, then pass the name and value as separate parameters.
 * @param tagName The tag name.
 * @param {Map<string, any>} attributes The attributes (optional).
 * @param {string} attributeName The name of the attribute (optional).
 * @param {any} attributeValue The value of the attribute (optional).
 * @param {string} padding The padding (optional).
 * @returns The XML start tag.
 */
function getStartTag(tagName, attributes, attributeName, attributeValue, padding) {
  var s = "";
  if (padding != undefined) {
    s += "\n" + padding;
  }
  s += '<' + tagName;
  if (attributes) {
    var _iterator = _createForOfIteratorHelper(attributes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          k = _step$value[0],
          v = _step$value[1];
        s += ' ' + k + '="' + v.toString() + '"';
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  if (attributeName && attributeValue) {
    s += ' ' + attributeName + '="' + attributeValue.toString() + '"';
  }
  return s + '>';
}
exports.getStartTag = getStartTag;
/**
 * Create and return an XML end tag.
 * @param tagName The tag name.
 * @param padding The padding (optional).
 * @param padValue Whether to pad the value (optional).
 * @returns The XML end tag.
 */
function getEndTag(tagName, padding, padValue) {
  var s = "";
  if (padValue) {
    if (padding != undefined) {
      s += "\n" + padding;
    }
  }
  return s + '</' + tagName + '>';
}
exports.getEndTag = getEndTag;
/**
 * Create and return an XML tag with content. For multiple attributes, pass them in a map.
 * If there is only one, then pass the name and value as separate parameters.
 * @param content The content of the tag.
 * @param tagName The tag name.
 * @param delimeter Whether values are delimeted.
 * @param {Map<string, any>} attributes The attributes (optional).
 * @param {string} attributeName The name of the attribute (optional).
 * @param {any} attributeValue The value of the attribute (optional).
 * @param {string} padding The padding (optional).
 * @param {boolean} padValue Whether to pad the value (optional).
 * @returns The XML tag with content.
 */
function getTag(content, tagName, attributes, attributeName, attributeValue, padding, padValue) {
  var startTag = getStartTag(tagName, attributes, attributeName, attributeValue, padding);
  var endTag = getEndTag(tagName, padding, padValue);
  return startTag + content + endTag;
}
exports.getTag = getTag;
/**
 * Get the attributes of an element.
 * @param {Element} element The element to get the attributes of.
 * @returns {Map<string, string>} The attributes of the element.
 */
function getAttributes(element) {
  var attributeNames = element.getAttributeNames();
  var attributes = new Map();
  attributeNames.forEach(function (attributeName) {
    var attributeValue = element.getAttribute(attributeName);
    if (attributeValue != null) {
      attributes.set(attributeName, attributeValue);
      //console.log("attributeName=" + attributeName + " attributeValue=" + attributeValue);
    }
  });
  return attributes;
}
exports.getAttributes = getAttributes;
/**
 * Get an XML element checking that it is the only one with a given tagName.
 * @param {XMLDocument | Element} xml The XML document or element.
 * @param {string} tagName The tag name.
 * @returns {Element} The element.
 * @throws An error if there is not exactly one element with the given tag name.
 */
function getSingularElement(xml, tagName) {
  ;
  var e = xml.getElementsByTagName(tagName);
  if (e.length != 1) {
    throw new Error("Expecting 1 " + tagName + " but finding " + e.length);
  }
  return e[0];
}
exports.getSingularElement = getSingularElement;
/**
 * Convert XML to HTML.
 * @param {string} text The XML text.
 */
function toHTML(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/  /g, "&nbsp;&nbsp;");
}
exports.toHTML = toHTML;
},{}],"../dist/client/cjm/html.js":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelfClosingTag = exports.getInput = exports.getDiv = exports.getTable = exports.getTR = exports.getTD = exports.getTH = void 0;
/**
 * Create a table header row.
 * @param {string[]} headings The headings.
 * @returns {string} Table row with headings.
 */
function getTH(headings) {
  var th = "";
  for (var i = 0; i < headings.length; i++) {
    th += "<th>" + headings[i] + "</th>";
  }
  return getTR(th);
}
exports.getTH = getTH;
/**
 * Create a table cell.
 * @param {string} x A cell for a table row.
 * @param {boolean} contentEditable If true then the cell is set to be editable.
 * @returns {string} x wrapped in td tags.
 */
function getTD(x) {
  var contentEditable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var r = "<td";
  if (contentEditable) {
    r += " contenteditable=\"true\"";
  }
  r += ">" + x + "</td>";
  return r;
}
exports.getTD = getTD;
/**
 * Create a table row.
 * @param {string} x A row for a table.
 * @returns {string} x wrapped in tr tags.
 */
function getTR(x) {
  return "<tr>" + x + "</tr>\n";
}
exports.getTR = getTR;
/**
 * Create a table.
 * @param {string} x Table rows for a table.
 * @returns {string} x wrapped in table tags.
 */
function getTable(x) {
  return "<table>" + x + "</table>";
}
exports.getTable = getTable;
/**
 * Create a div.
 * @param {string} x The content of the div.
 * @param {string | null} id The id of the div.
 * @param {string | null} html_class The class of the div.
 * @returns {string} x wrapped in div tags.
 */
function getDiv(x, id, html_class) {
  var r = "<div";
  if (id !== null) {
    r += " id=\"" + id + "\"";
  }
  if (html_class !== null) {
    r += " class=\"" + html_class + "\"";
  }
  return r + ">" + x + "</div>";
}
exports.getDiv = getDiv;
/**
 * Create a input.
 * @param {string} type The input type (e.g. text, number).
 * @param {string | null} id The id of the button.
 * @param {string | null} func The function called on a change.
 * @param {string | null} value The value of the input.
 * @returns {string} An input HTML element.
 */
function getInput(type, id, func, value) {
  var r = "<input type=\"" + type + "\"";
  if (id !== null) {
    r += " id=\"" + id + "\"";
  }
  if (func !== null) {
    r += " onchange=\"" + func + "\"";
  }
  if (value !== null) {
    r += " value=\"" + value + "\"";
  }
  return r + ">";
}
exports.getInput = getInput;
/**
 * Create a self closing tag.
 * @param {Map<string, string> | null} attributes The attributes.
 * @param {string} tagName The tag name.
 */
function getSelfClosingTag(attributes, tagName) {
  var s = "<" + tagName;
  if (attributes) {
    var _iterator = _createForOfIteratorHelper(attributes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];
        s += " " + key + "=\"" + value + "\"";
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return s + " />";
}
exports.getSelfClosingTag = getSelfClosingTag;
},{}],"../dist/client/cjm/classes.js":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumberArrayWithAttributes = exports.NumberWithAttributes = exports.Attributes = void 0;
var html_1 = require("./html");
var xml_1 = require("./xml");
/**
 * A class for representing things with attributes.
 * @param {Map<string, string>} attributes The attributes.
 */
var Attributes = /*#__PURE__*/function () {
  /**
   * @param attributes The attributes.
   */
  function Attributes(attributes) {
    _classCallCheck(this, Attributes);
    /**
     * The attributes.
     */
    _defineProperty(this, "attributes", void 0);
    this.attributes = attributes;
  }
  /**
   * @returns The name in lower case.
   */
  /*
  get name(): string {
      return this.constructor.name.toLowerCase().trim();
  }
  */
  /**
   * @returns A string representation.
   */
  _createClass(Attributes, [{
    key: "toString",
    value: function toString() {
      var r = this.constructor.name + "(";
      this.attributes.forEach(function (value, key) {
        r += "".concat(key, "(").concat(value, "), ");
      });
      return r;
    }
    /**
     * Get the tag representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns A tag representation.
     */
  }, {
    key: "toTag",
    value: function toTag(tagName, padding) {
      var s = (0, html_1.getSelfClosingTag)(this.attributes, tagName);
      if (padding) {
        return "\n" + padding + s;
      }
      return "\n" + s;
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(tagName, padding) {
      return (0, xml_1.getTag)("", tagName, this.attributes, undefined, undefined, padding, false);
    }
  }]);
  return Attributes;
}();
exports.Attributes = Attributes;
/**
 * A class for representing a number with attributes.
 * e.g. A value with units and measurement/uncertainty information.
 */
var NumberWithAttributes = /*#__PURE__*/function (_Attributes2) {
  _inherits(NumberWithAttributes, _Attributes2);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {number} value The value.
   */
  function NumberWithAttributes(attributes, value) {
    var _this;
    _classCallCheck(this, NumberWithAttributes);
    _this = _callSuper(this, NumberWithAttributes, [attributes]);
    _defineProperty(_assertThisInitialized(_this), "value", void 0);
    _this.value = value;
    return _this;
  }
  /**
   * @returns A string representation.
   */
  _createClass(NumberWithAttributes, [{
    key: "toString",
    value: function toString() {
      return _get(_getPrototypeOf(NumberWithAttributes.prototype), "toString", this).call(this) + ", ".concat(this.value.toString(), ")");
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(tagName, padding) {
      return (0, xml_1.getTag)(this.value.toString().trim(), tagName, this.attributes, undefined, undefined, padding, false);
    }
  }]);
  return NumberWithAttributes;
}(Attributes);
exports.NumberWithAttributes = NumberWithAttributes;
/**
 * A class for representing numerical values with a shared attributes.
 * e.g. An array values sharing the same units and measurement details.
 */
var NumberArrayWithAttributes = /*#__PURE__*/function (_Attributes3) {
  _inherits(NumberArrayWithAttributes, _Attributes3);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {number[]} values The values.
   * @param {string} delimiter The delimiter of the values (Optional - default will be ",").
   */
  function NumberArrayWithAttributes(attributes, values, delimiter) {
    var _this2;
    _classCallCheck(this, NumberArrayWithAttributes);
    _this2 = _callSuper(this, NumberArrayWithAttributes, [attributes]);
    /**
     * The values.
     */
    _defineProperty(_assertThisInitialized(_this2), "values", void 0);
    /**
     * The delimiter of the values.
     */
    _defineProperty(_assertThisInitialized(_this2), "delimiter", ",");
    _this2.values = values;
    if (delimiter) {
      _this2.delimiter = delimiter;
    }
    return _this2;
  }
  /**
   * @returns A string representation.
   */
  _createClass(NumberArrayWithAttributes, [{
    key: "toString",
    value: function toString() {
      return _get(_getPrototypeOf(NumberArrayWithAttributes.prototype), "toString", this).call(this) + ", ".concat(this.values.toString(), ")");
    }
    /**
     * Set the delimiter.
     * @param {string} delimiter The delimiter.
     */
  }, {
    key: "setDelimiter",
    value: function setDelimiter(delimiter) {
      this.delimiter = delimiter;
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(tagName, padding) {
      return (0, xml_1.getTag)(this.values.toString().replaceAll(",", this.delimiter), tagName, this.attributes, undefined, undefined, padding, false);
    }
  }]);
  return NumberArrayWithAttributes;
}(Attributes);
exports.NumberArrayWithAttributes = NumberArrayWithAttributes;
},{"./html":"../dist/client/cjm/html.js","./xml":"../dist/client/cjm/xml.js"}],"../dist/client/cjm/functions.js":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNumeric = exports.toNumberArray = exports.arrayToString = exports.mapToString = void 0;
/**
 * For convertina a map to a string.
 * @param map The map to convert to a string.
 * @returns A string representation of all the entries in the map.
 */
function mapToString(map) {
  if (map == null) {
    return "";
  }
  return Array.from(map.entries()).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    return "".concat(key == null ? "null" : key.toString(), "(").concat(value == null ? "null" : value.toString(), ")");
  }).join(', ');
}
exports.mapToString = mapToString;
/**
 * For converting an array to a string.
 * @param {any[]} array The array to convert to a string.
 * @param {string} delimiter The (optional) delimiter.
 */
function arrayToString(array, delimiter) {
  if (array == null) {
    return "";
  }
  if (delimiter == null) {
    delimiter = ', ';
  }
  return array.map(function (value) {
    return value == null ? "null" : value.toString();
  }).join(delimiter);
}
exports.arrayToString = arrayToString;
/**
 * For converting a string array to a number array.
 * @param {string[]} s The string to convert to a number array.
 * @returns A number array.
 */
function toNumberArray(s) {
  var r = [];
  for (var i = 0; i < s.length; i++) {
    r.push(parseFloat(s[i]));
  }
  return r;
}
exports.toNumberArray = toNumberArray;
/**
 * Is the string numeric in that it can be parsed as a float that is not a NaN?
 * @param {string} s The string.
 * @returns True if the string can be parsed as a float that is not a NaN and false otherwise.
 */
function isNumeric(s) {
  return !isNaN(parseFloat(s));
}
exports.isNumeric = isNumeric;
},{}],"../dist/client/cjm/molecule.js":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Molecule = exports.DOSCMethod = exports.EnergyTransferModel = exports.DeltaEDown = exports.Property = exports.Bond = exports.Atom = void 0;
var classes_js_1 = require("./classes.js");
var functions_js_1 = require("./functions.js");
var xml_js_1 = require("./xml.js");
/**
 * A class for representing an atom.
 * @param {Map<string, string>} attributes The attributes.
 * If there is no "id" or "elementType" key an error will be thrown.
 */
var Atom = /*#__PURE__*/function (_classes_js_1$Attribu) {
  _inherits(Atom, _classes_js_1$Attribu);
  /**
   * @param attributes The attributes. If there is no "id" or "elementType" key an error will be thrown.
   */
  function Atom(attributes) {
    var _this;
    _classCallCheck(this, Atom);
    _this = _callSuper(this, Atom, [attributes]);
    var id = attributes.get("id");
    if (id == undefined) {
      throw new Error('id is undefined');
    }
    var elementType = attributes.get("elementType");
    if (elementType == undefined) {
      throw new Error('elementType is undefined');
    }
    return _this;
  }
  /**
   * @returns A string representation.
   */
  _createClass(Atom, [{
    key: "toString",
    value: function toString() {
      var s = _get(_getPrototypeOf(Atom.prototype), "toString", this).call(this);
      return s + ")";
    }
    /**
     * @returns The id of the atom.
     */
  }, {
    key: "id",
    get: function get() {
      return this.attributes.get("id");
    }
    /**
     * @returns The element type of the atom.
     */
  }, {
    key: "elementType",
    get: function get() {
      return this.attributes.get("elementType");
    }
  }]);
  return Atom;
}(classes_js_1.Attributes);
exports.Atom = Atom;
/**
 * A class for representing an atomic bond - a bond beteen two atoms.
 * @param {Map<string, string>} attributes The attributes.
 * @param {Atom} atomA One atom.
 * @param {Atom} atomB Another atom.
 * @param {string} order The order of the bond.
 */
var Bond = /*#__PURE__*/function (_classes_js_1$Attribu2) {
  _inherits(Bond, _classes_js_1$Attribu2);
  /**
   * @param {Map<string, string>} attributes The attributes.
   */
  function Bond(attributes) {
    _classCallCheck(this, Bond);
    return _callSuper(this, Bond, [attributes]);
  }
  /**
   * @returns A string representation.
   */
  _createClass(Bond, [{
    key: "toString",
    value: function toString() {
      var s = _get(_getPrototypeOf(Bond.prototype), "toString", this).call(this);
      return s + ")";
    }
  }]);
  return Bond;
}(classes_js_1.Attributes);
exports.Bond = Bond;
/**
 * A class for representing a property.
 */
var Property = /*#__PURE__*/function (_classes_js_1$Attribu3) {
  _inherits(Property, _classes_js_1$Attribu3);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {NumberWithAttributes | NumberArrayWithAttributes} property The property.
   */
  function Property(attributes, property) {
    var _this2;
    _classCallCheck(this, Property);
    _this2 = _callSuper(this, Property, [attributes]);
    /**
     * The property value.
     */
    _defineProperty(_assertThisInitialized(_this2), "property", void 0);
    _this2.property = property;
    return _this2;
  }
  /**
   * @returns A string representation.
   */
  _createClass(Property, [{
    key: "toString",
    value: function toString() {
      return _get(_getPrototypeOf(Property.prototype), "toString", this).call(this) + " property(".concat(this.property.toString(), "))");
    }
    /**
     * @param padding The padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(pad, padding) {
      var padding1 = undefined;
      if (pad != undefined) {
        if (padding != undefined) {
          padding1 = padding + pad;
        }
      }
      if (this.property instanceof classes_js_1.NumberWithAttributes) {
        return (0, xml_js_1.getTag)(this.property.toXML("scalar", padding1), "property", this.attributes, undefined, undefined, padding, true);
      } else {
        return (0, xml_js_1.getTag)(this.property.toXML("array", padding1), "property", this.attributes, undefined, undefined, padding, true);
      }
    }
  }]);
  return Property;
}(classes_js_1.Attributes);
exports.Property = Property;
/**
 * Represents the deltaEDown class.
 */
var DeltaEDown = /*#__PURE__*/function (_classes_js_1$NumberW) {
  _inherits(DeltaEDown, _classes_js_1$NumberW);
  /**
   * @param attributes The attributes.
   * @param units The units.
   */
  function DeltaEDown(attributes, value) {
    _classCallCheck(this, DeltaEDown);
    return _callSuper(this, DeltaEDown, [attributes, value]);
  }
  return _createClass(DeltaEDown);
}(classes_js_1.NumberWithAttributes);
exports.DeltaEDown = DeltaEDown;
/**
 * A class for representing an energy transfer model.
 */
var EnergyTransferModel = /*#__PURE__*/function (_classes_js_1$Attribu4) {
  _inherits(EnergyTransferModel, _classes_js_1$Attribu4);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {DeltaEDown} deltaEDown The DeltaEDown.
   */
  function EnergyTransferModel(attributes, deltaEDown) {
    var _this3;
    _classCallCheck(this, EnergyTransferModel);
    _this3 = _callSuper(this, EnergyTransferModel, [attributes]);
    /**
     * The DeltaEDown.
     */
    _defineProperty(_assertThisInitialized(_this3), "deltaEDown", void 0);
    _this3.deltaEDown = deltaEDown;
    return _this3;
  }
  /**
   * @param padding - Optional padding string for formatting the XML output.
   * @returns An XML representation.
   */
  _createClass(EnergyTransferModel, [{
    key: "toXML",
    value: function toXML(pad, padding) {
      if (pad == undefined) {
        return (0, xml_js_1.getTag)(this.deltaEDown.toXML("me.deltaEDown", padding), "me:energyTransferModel", this.attributes, undefined, undefined, padding, false);
      } else {
        return (0, xml_js_1.getTag)(this.deltaEDown.toXML("me.deltaEDown", padding), "energyTransferModel", undefined, undefined, undefined, padding, true);
      }
    }
  }]);
  return EnergyTransferModel;
}(classes_js_1.Attributes);
exports.EnergyTransferModel = EnergyTransferModel;
/**
 * A class for representing a method for calculating the density of states.
 */
var DOSCMethod = /*#__PURE__*/function () {
  function DOSCMethod(type) {
    _classCallCheck(this, DOSCMethod);
    _defineProperty(this, "type", void 0);
    this.type = type;
  }
  /**
   * @returns A string representation.
   */
  _createClass(DOSCMethod, [{
    key: "toString",
    value: function toString() {
      return "DOSCMethod(type(".concat(this.type, "))");
    }
    /**
     * @param padding The padding (Optional).
     * @returns A tag representation.
     */
  }, {
    key: "toTag",
    value: function toTag(padding) {
      var s = "<me.DOSCMethod xsi:type=\"".concat(this.type, "\"/>");
      if (padding) {
        return "\n" + padding + s;
      }
      return "\n" + s;
    }
  }]);
  return DOSCMethod;
}();
exports.DOSCMethod = DOSCMethod;
/**
 * A class for representing a molecule.
 * @param {string} id The id of the molecule.
 * @param {string} description The description of the molecule.
 * @param {boolean} active Indicates if the molecule is active.
 * @param {Map<string, Atom>} atoms A Map of atoms with keys as string atom ids and values as Atoms.
 * @param {Map<string, Bond>} bonds A Map of bonds with keys as string atom ids and values as Bonds.
 * @param {Map<string, Property>} properties A map of properties.
 * @param {EnergyTransferModel | null} energyTransferModel The energy transfer model.
 * @param {DOSCMethod | null} dOSCMethod The method for calculating density of states.
 */
var Molecule = /*#__PURE__*/function (_classes_js_1$Attribu5) {
  _inherits(Molecule, _classes_js_1$Attribu5);
  /**
   * Create a molecule.
   * @param {Map<string, string>} attributes The attributes. If there is no "id" key an error will be thrown.
   * Additional attributes known about are "description" and "active", but these do not exist for all molecules
   * in Mesmer XML input/output files.
   * @param {Map<string, Atom>} atoms A Map of atoms with keys as ids.
   * @param {Map<string, Bond>} bonds A Map of bonds with. The keys combine the ids of the two bonded atoms.
   * @param {Map<string, Property>} properties A map of properties.
   * @param {EnergyTransferModel | null} energyTransferModel The energy transfer model.
   * @param {DOSCMethod | null} dOSCMethod The method for calculating density of states.
   */
  function Molecule(attributes, atoms, bonds, properties, energyTransferModel, dOSCMethod) {
    var _this4;
    _classCallCheck(this, Molecule);
    _this4 = _callSuper(this, Molecule, [attributes]);
    _defineProperty(_assertThisInitialized(_this4), "id", void 0);
    // Atoms
    _defineProperty(_assertThisInitialized(_this4), "atoms", void 0);
    // Bonds
    _defineProperty(_assertThisInitialized(_this4), "bonds", void 0);
    // Properties
    _defineProperty(_assertThisInitialized(_this4), "properties", void 0);
    // EnergyTransferModel
    _defineProperty(_assertThisInitialized(_this4), "energyTransferModel", void 0);
    // DOSCMethod
    _defineProperty(_assertThisInitialized(_this4), "dOSCMethod", void 0);
    var id = _this4.attributes.get("id");
    if (id == undefined) {
      throw new Error('id is undefined');
    }
    _this4.id = id;
    _this4.atoms = atoms;
    _this4.bonds = bonds;
    _this4.properties = properties;
    _this4.energyTransferModel = energyTransferModel;
    _this4.dOSCMethod = dOSCMethod;
    return _this4;
  }
  /**
   * @returns A string representation.
   */
  _createClass(Molecule, [{
    key: "toString",
    value: function toString() {
      var r = "Molecule(id(".concat(this.getID(), "), ");
      var description = this.getDescription();
      if (description != undefined) {
        r += "description(".concat(description, "), ");
      }
      var active = this.getActive();
      if (active != undefined) {
        r += "active(".concat(active, "), ");
      }
      if (this.atoms.size > 0) {
        r += "atoms(".concat((0, functions_js_1.mapToString)(this.atoms), "), ");
      }
      if (this.bonds.size > 0) {
        r += "bonds(".concat((0, functions_js_1.mapToString)(this.bonds), "), ");
      }
      if (this.properties.size > 0) {
        r += "properties(".concat((0, functions_js_1.mapToString)(this.properties), "), ");
      }
      if (this.energyTransferModel) {
        r += "energyTransferModel(".concat(this.energyTransferModel.toString(), "), ");
      }
      if (this.dOSCMethod) {
        r += "dOSCMethod(".concat(this.dOSCMethod.toString(), "), ");
      }
      return r + ")";
    }
    /**
     * @return The id of the molecule.
     */
  }, {
    key: "getID",
    value: function getID() {
      return this.attributes.get("id");
    }
    /**
     * Gets the description of the molecule.
     * @returns The description of the molecule, or undefined if it is not set.
     */
  }, {
    key: "getDescription",
    value: function getDescription() {
      return this.attributes.get("description");
    }
    /**
     * Gets the active status of the molecule.
     * @returns The active status of the molecule, or undefined if it is not set.
     */
  }, {
    key: "getActive",
    value: function getActive() {
      var active = this.attributes.get("active");
      if (active != undefined) {
        return true;
      }
      return active;
    }
    /**
     * @returns {number} The energy of the molecule or zero if the energy is not set.
     * @throws An error if "me.ZPE" is a property, but is not mapped to a PropertyScalar.
     */
  }, {
    key: "getEnergy",
    value: function getEnergy() {
      var zpe = this.properties.get('me:ZPE');
      if (zpe == undefined) {
        return 0;
      }
      if (zpe.property instanceof classes_js_1.NumberWithAttributes) {
        return zpe.property.value;
      } else {
        throw new Error("Expected a PropertyScalar but got a PropertyArray and not sure how to handle that.");
      }
    }
    /**
     * Set the Energy of the molecule.
     * @param {number} energy The energy of the molecule in kcal/mol.
     */
  }, {
    key: "setEnergy",
    value: function setEnergy(energy) {
      var property = this.properties.get('me:ZPE');
      if (property == undefined) {
        throw new Error("No me.ZPE property found");
      }
      if (property.property instanceof classes_js_1.NumberArrayWithAttributes) {
        throw new Error("Expected a NumberWithAttributes but got a NumberArrayWithAttributes and not sure how to handle that.");
      } else {
        property.property.value = energy;
      }
    }
    /**
     * Get the RotationConstants of the molecule.
     * @returns The RotationConstants of the molecule.
     */
  }, {
    key: "getRotationConstants",
    value: function getRotationConstants() {
      var property = this.properties.get('me:rotConsts');
      if (property != undefined) {
        if (property.property != null) {
          if (property.property instanceof classes_js_1.NumberWithAttributes) {
            return [property.property.value];
          } else {
            return property.property.values;
          }
        } else {
          return undefined;
        }
      }
      return property;
    }
    /**
     * Get the VibrationFrequencies of the molecule.
     * @returns The VibrationFrequencies of the molecule.
     */
  }, {
    key: "getVibrationFrequencies",
    value: function getVibrationFrequencies() {
      var property = this.properties.get('me:vibFreqs');
      if (property != undefined) {
        if (property.property instanceof classes_js_1.NumberWithAttributes) {
          return [property.property.value];
        } else if (property.property instanceof classes_js_1.NumberArrayWithAttributes) {
          return property.property.values;
        } else {
          return undefined;
        }
      }
      return property;
    }
    /**
     * @param {string} tagName The tag name.
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(tagName, pad, level) {
      // Padding
      var padding0 = "";
      var padding1 = "";
      var padding2 = "";
      var padding3 = "";
      if (pad != undefined && level != undefined) {
        padding0 = pad.repeat(level);
        padding1 = padding0 + pad;
        padding2 = padding1 + pad;
        padding3 = padding2 + pad;
      }
      // Atoms
      var atoms_xml = "";
      var _iterator = _createForOfIteratorHelper(this.atoms.values()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var atom = _step.value;
          atoms_xml += atom.toTag("atom", padding2);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (this.atoms.size > 1) {
        if (atoms_xml != "") {
          atoms_xml = (0, xml_js_1.getTag)(atoms_xml, "atomArray", undefined, undefined, undefined, padding1, true);
        }
      }
      // Bonds
      var bonds_xml = "";
      var _iterator2 = _createForOfIteratorHelper(this.bonds.values()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var bond = _step2.value;
          bonds_xml += bond.toTag("bond", padding2);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (bonds_xml != "") {
        bonds_xml = (0, xml_js_1.getTag)(bonds_xml, "bondArray", undefined, undefined, undefined, padding1, true);
      }
      // Properties
      var properties_xml = "";
      this.properties.forEach(function (property) {
        var property_xml = "";
        if (property.property instanceof classes_js_1.NumberWithAttributes) {
          property_xml += property.property.toXML("scalar", padding3);
        } else {
          property_xml += property.property.toXML("array", padding3);
        }
        properties_xml += (0, xml_js_1.getTag)(property_xml, "property", property.attributes, undefined, undefined, padding2, true);
      });
      if (this.properties.size > 1) {
        if (properties_xml != "") {
          properties_xml = (0, xml_js_1.getTag)(properties_xml, "propertyList", undefined, undefined, undefined, padding1, true);
        }
      }
      // EnergyTransferModel
      var energyTransferModel_xml = "";
      if (this.energyTransferModel) {
        energyTransferModel_xml = this.energyTransferModel.toXML(pad, padding1);
      }
      // DOSCMethod
      var dOSCMethod_xml = "";
      if (this.dOSCMethod) {
        dOSCMethod_xml = this.dOSCMethod.toTag(padding1);
      }
      return (0, xml_js_1.getTag)(atoms_xml + bonds_xml + properties_xml + energyTransferModel_xml + dOSCMethod_xml, tagName, this.attributes, undefined, undefined, padding0, true);
    }
  }]);
  return Molecule;
}(classes_js_1.Attributes);
exports.Molecule = Molecule;
},{"./classes.js":"../dist/client/cjm/classes.js","./functions.js":"../dist/client/cjm/functions.js","./xml.js":"../dist/client/cjm/xml.js"}],"../dist/client/cjm/reaction.js":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reaction = exports.ZhuNakamuraCrossing = exports.MesmerILT = exports.MCRCMethod = exports.Tunneling = exports.NInfinity = exports.TInfinity = exports.ActivationEnergy = exports.PreExponential = exports.TransitionState = exports.Product = exports.Reactant = exports.ReactionMolecule = void 0;
var functions_js_1 = require("./functions.js");
var classes_js_1 = require("./classes.js");
var xml_js_1 = require("./xml.js");
/**
 * A class for representing a Reaction Molecule.
 */
var ReactionMolecule = /*#__PURE__*/function (_classes_js_1$Attribu) {
  _inherits(ReactionMolecule, _classes_js_1$Attribu);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {Molecule} molecule The molecule.
   */
  function ReactionMolecule(attributes, molecule) {
    var _this;
    _classCallCheck(this, ReactionMolecule);
    _this = _callSuper(this, ReactionMolecule, [attributes]);
    /**
     * A reference to the molecule.
     */
    _defineProperty(_assertThisInitialized(_this), "molecule", void 0);
    _this.molecule = molecule;
    return _this;
  }
  /**
   * Get the XML representation.
   * @param {string} tagName The tag name.
   * @param {string} pad The pad for an extra level of padding (Optional).
   * @param {string} padding The padding (Optional).
   * @returns An XML representation.
   */
  _createClass(ReactionMolecule, [{
    key: "toXML",
    value: function toXML(tagName, pad, padding) {
      var padding1 = "";
      if (pad != undefined && padding != undefined) {
        padding1 = padding + pad;
      }
      var s = this.toTag("molecule", padding1);
      return (0, xml_js_1.getTag)(s, tagName, undefined, undefined, undefined, padding, true);
    }
  }]);
  return ReactionMolecule;
}(classes_js_1.Attributes);
exports.ReactionMolecule = ReactionMolecule;
/**
 * A class for representing a reactant.
 * This is a molecule often with a role in a reaction.
 */
var Reactant = /*#__PURE__*/function (_ReactionMolecule2) {
  _inherits(Reactant, _ReactionMolecule2);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {Molecule} molecule The molecule.
   */
  function Reactant(attributes, molecule) {
    _classCallCheck(this, Reactant);
    return _callSuper(this, Reactant, [attributes, molecule]);
  }
  return _createClass(Reactant);
}(ReactionMolecule);
exports.Reactant = Reactant;
/**
 * A class for representing a product.
 * This is a molecule produced in a reaction.
 */
var Product = /*#__PURE__*/function (_ReactionMolecule3) {
  _inherits(Product, _ReactionMolecule3);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {Molecule} molecule The molecule.
   */
  function Product(attributes, molecule) {
    _classCallCheck(this, Product);
    return _callSuper(this, Product, [attributes, molecule]);
  }
  return _createClass(Product);
}(ReactionMolecule);
exports.Product = Product;
/**
 * A class for representing a transition state.
 */
var TransitionState = /*#__PURE__*/function (_ReactionMolecule4) {
  _inherits(TransitionState, _ReactionMolecule4);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {Molecule} molecule The molecule.
   */
  function TransitionState(attributes, molecule) {
    _classCallCheck(this, TransitionState);
    return _callSuper(this, TransitionState, [attributes, molecule]);
  }
  /**
   * A convenience method to get the ref (the molecule ID) of the transition state.
   * @returns The ref of the transition state.
   */
  _createClass(TransitionState, [{
    key: "getRef",
    value: function getRef() {
      var s = this.attributes.get("ref");
      if (s == null) {
        throw new Error('Attribute "ref" is undefined.');
      }
      return s;
    }
  }]);
  return TransitionState;
}(ReactionMolecule);
exports.TransitionState = TransitionState;
/**
 * A class for representing the Arrhenius pre-exponential factor.
 */
var PreExponential = /*#__PURE__*/function (_classes_js_1$NumberW) {
  _inherits(PreExponential, _classes_js_1$NumberW);
  /**
   * A class for representing the Arrhenius pre-exponential factor.
   * @param {Map<string, string>} attributes The attributes.
   * @param {number} value The value of the factor.
   */
  function PreExponential(attributes, value) {
    _classCallCheck(this, PreExponential);
    return _callSuper(this, PreExponential, [attributes, value]);
  }
  return _createClass(PreExponential);
}(classes_js_1.NumberWithAttributes);
exports.PreExponential = PreExponential;
/**
 * A class for representing the Arrhenius activation energy factor.
 */
var ActivationEnergy = /*#__PURE__*/function (_classes_js_1$NumberW2) {
  _inherits(ActivationEnergy, _classes_js_1$NumberW2);
  /**
   * A class for representing the Arrhenius pre-exponential factor.
   * @param {Map<string, string>} attributes The attributes.
   * @param {number} value The value of the factor.
   */
  function ActivationEnergy(attributes, value) {
    _classCallCheck(this, ActivationEnergy);
    return _callSuper(this, ActivationEnergy, [attributes, value]);
  }
  return _createClass(ActivationEnergy);
}(classes_js_1.NumberWithAttributes);
exports.ActivationEnergy = ActivationEnergy;
/**
 * A class for representing the reference temperature.
 */
var TInfinity = /*#__PURE__*/function (_classes_js_1$NumberW3) {
  _inherits(TInfinity, _classes_js_1$NumberW3);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {number} value The value of the factor.
   */
  function TInfinity(attributes, value) {
    _classCallCheck(this, TInfinity);
    return _callSuper(this, TInfinity, [attributes, value]);
  }
  return _createClass(TInfinity);
}(classes_js_1.NumberWithAttributes);
exports.TInfinity = TInfinity;
/**
 * A class for representing the modified Arrhenius parameter factor.
 */
var NInfinity = /*#__PURE__*/function (_classes_js_1$NumberW4) {
  _inherits(NInfinity, _classes_js_1$NumberW4);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {number} value The value of the factor.
   */
  function NInfinity(attributes, value) {
    _classCallCheck(this, NInfinity);
    return _callSuper(this, NInfinity, [attributes, value]);
  }
  return _createClass(NInfinity);
}(classes_js_1.NumberWithAttributes);
exports.NInfinity = NInfinity;
/**
 * A class for representing tunneling.
 */
var Tunneling = /*#__PURE__*/function (_classes_js_1$Attribu2) {
  _inherits(Tunneling, _classes_js_1$Attribu2);
  /**
   * @param {Map<string, string>} attributes The attributes.
   */
  function Tunneling(attributes) {
    _classCallCheck(this, Tunneling);
    return _callSuper(this, Tunneling, [attributes]);
  }
  return _createClass(Tunneling);
}(classes_js_1.Attributes);
exports.Tunneling = Tunneling;
/**
 * A class for representing the MCRCMethod specifications.
 * Extended classes indicate how microcanonical rate constant is to be treated.
 */
var MCRCMethod = /*#__PURE__*/function (_classes_js_1$Attribu3) {
  _inherits(MCRCMethod, _classes_js_1$Attribu3);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {string} name The name or xsi:type of the method.
   */
  function MCRCMethod(attributes, name) {
    var _this2;
    _classCallCheck(this, MCRCMethod);
    _this2 = _callSuper(this, MCRCMethod, [attributes]);
    /**
     * The name of the method.
     */
    _defineProperty(_assertThisInitialized(_this2), "mCRCMethodName", void 0);
    _this2.mCRCMethodName = name;
    return _this2;
  }
  _createClass(MCRCMethod, [{
    key: "toString",
    value: function toString() {
      return "MCRCMethod(name(".concat(this.mCRCMethodName, "))");
    }
  }]);
  return MCRCMethod;
}(classes_js_1.Attributes);
exports.MCRCMethod = MCRCMethod;
/**
 * A class for representing the inverse Laplace transform (ILT) type of microcanonical rate constant.
 */
var MesmerILT = /*#__PURE__*/function (_MCRCMethod2) {
  _inherits(MesmerILT, _MCRCMethod2);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {PreExponential | undefined} preExponential The pre-exponential factor.
   * @param {ActivationEnergy | undefined} activationEnergy The activation energy.
   * @param {TInfinity | undefined} tInfinity The TInfinity.
   * @param {NInfinity | undefined} nInfinity The nInfinity.
   */
  function MesmerILT(attributes, preExponential, activationEnergy, tInfinity, nInfinity) {
    var _this3;
    _classCallCheck(this, MesmerILT);
    _this3 = _callSuper(this, MesmerILT, [attributes, "MesmerILT"]);
    /**
     * The pre-exponential factor.
     */
    _defineProperty(_assertThisInitialized(_this3), "preExponential", void 0);
    /**
     * The activation energy.
     */
    _defineProperty(_assertThisInitialized(_this3), "activationEnergy", void 0);
    /**
     * The TInfinity.
     */
    _defineProperty(_assertThisInitialized(_this3), "tInfinity", void 0);
    /**
     * The nInfinity.
     */
    _defineProperty(_assertThisInitialized(_this3), "nInfinity", void 0);
    _this3.preExponential = preExponential;
    _this3.activationEnergy = activationEnergy;
    _this3.tInfinity = tInfinity;
    _this3.nInfinity = nInfinity;
    return _this3;
  }
  _createClass(MesmerILT, [{
    key: "toString",
    value: function toString() {
      return "MesmerILT(".concat(_get(_getPrototypeOf(MesmerILT.prototype), "toString", this).call(this), ", ") + "preExponential(".concat(this.preExponential, "), ") + "activationEnergy(".concat(this.activationEnergy, "), ") + "TInfinity(".concat(this.tInfinity, "), ") + "nInfinity(".concat(this.nInfinity, "))");
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(tagName, padding) {
      var padding1 = "";
      if (padding != undefined) {
        padding1 = padding + "  ";
      }
      var preExponential_xml = "";
      if (this.preExponential != undefined) {
        preExponential_xml = this.preExponential.toXML("me.preExponential", padding1);
      }
      var activationEnergy_xml = "";
      if (this.activationEnergy != undefined) {
        activationEnergy_xml = this.activationEnergy.toXML("me.activationEnergy", padding1);
      }
      var tInfinity_xml = "";
      if (this.tInfinity != undefined) {
        tInfinity_xml = this.tInfinity.toXML("me.nInfinity", padding1);
      }
      var nInfinity_xml = "";
      if (this.nInfinity != undefined) {
        nInfinity_xml = this.nInfinity.toXML("me.nInfinity", padding1);
      }
      return (0, xml_js_1.getTag)(preExponential_xml + activationEnergy_xml + tInfinity_xml + nInfinity_xml, tagName, this.attributes, undefined, undefined, padding, true);
    }
  }]);
  return MesmerILT;
}(MCRCMethod);
exports.MesmerILT = MesmerILT;
/**
 * A class for representing the Zhu-Nakamura crossing MCRCMethod.
 */
var ZhuNakamuraCrossing = /*#__PURE__*/function (_MCRCMethod3) {
  _inherits(ZhuNakamuraCrossing, _MCRCMethod3);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {number} harmonicReactantDiabat_FC The harmonic reactant diabatic FC.
   * @param {number} harmonicReactantDiabat_XO The harmonic reactant diabatic XO.
   * @param {number} harmonicProductDiabat_DE The harmonic product diabatic DE.
   * @param {number} exponentialProductDiabat_A The exponential product diabatic A.
   * @param {number} exponentialProductDiabat_B The exponential product diabatic B.
   * @param {number} exponentialProductDiabat_DE The exponential product diabatic DE.
   */
  function ZhuNakamuraCrossing(attributes, harmonicReactantDiabat_FC, harmonicReactantDiabat_XO, harmonicProductDiabat_DE, exponentialProductDiabat_A, exponentialProductDiabat_B, exponentialProductDiabat_DE) {
    var _this4;
    _classCallCheck(this, ZhuNakamuraCrossing);
    _this4 = _callSuper(this, ZhuNakamuraCrossing, [attributes, "ZhuNakamuraCrossing"]);
    _defineProperty(_assertThisInitialized(_this4), "harmonicReactantDiabat_FC", void 0);
    _defineProperty(_assertThisInitialized(_this4), "harmonicReactantDiabat_XO", void 0);
    _defineProperty(_assertThisInitialized(_this4), "harmonicProductDiabat_DE", void 0);
    _defineProperty(_assertThisInitialized(_this4), "exponentialProductDiabat_A", void 0);
    _defineProperty(_assertThisInitialized(_this4), "exponentialProductDiabat_B", void 0);
    _defineProperty(_assertThisInitialized(_this4), "exponentialProductDiabat_DE", void 0);
    _this4.harmonicReactantDiabat_FC = harmonicReactantDiabat_FC;
    _this4.harmonicReactantDiabat_XO = harmonicReactantDiabat_XO;
    _this4.harmonicProductDiabat_DE = harmonicProductDiabat_DE;
    _this4.exponentialProductDiabat_A = exponentialProductDiabat_A;
    _this4.exponentialProductDiabat_B = exponentialProductDiabat_B;
    _this4.exponentialProductDiabat_DE = exponentialProductDiabat_DE;
    return _this4;
  }
  _createClass(ZhuNakamuraCrossing, [{
    key: "toString",
    value: function toString() {
      return "ZhuNakamuraCrossing(".concat(_get(_getPrototypeOf(ZhuNakamuraCrossing.prototype), "toString", this).call(this), ", ") + "harmonicReactantDiabat_FC(".concat(this.harmonicReactantDiabat_FC.toString(), "), ") + "harmonicReactantDiabat_XO(".concat(this.harmonicReactantDiabat_XO.toString(), "), ") + "harmonicProductDiabat_DE(".concat(this.harmonicProductDiabat_DE.toString(), "), ") + "exponentialProductDiabat_A(".concat(this.exponentialProductDiabat_A.toString(), "), ") + "exponentialProductDiabat_B(".concat(this.exponentialProductDiabat_B.toString(), "), ") + "exponentialProductDiabat_DE(".concat(this.exponentialProductDiabat_DE.toString(), "))");
    }
  }]);
  return ZhuNakamuraCrossing;
}(MCRCMethod);
exports.ZhuNakamuraCrossing = ZhuNakamuraCrossing;
/**
 * A class for representing the sum of states.
 * @param {string} units The units of energy.
 * @param {boolean} angularMomentum The angular momentum attribute.
 * @param {boolean} noLogSpline The no log spline attribute.
 * @param {SumOfStatesPoint[]} sumOfStatesPoints The sum of states points.
 */
/*
export class SumOfStates extends NumberWithAttributes {
    units: string;
    angularMomentum: boolean;
    noLogSpline: boolean;
    sumOfStatesPoints: SumOfStatesPoint[];
    constructor(units: string, angularMomentum: boolean, noLogSpline: boolean, sumOfStatesPoints: SumOfStatesPoint[]) {
        this.units = units;
        this.angularMomentum = angularMomentum;
        this.noLogSpline = noLogSpline;
        this.sumOfStatesPoints = sumOfStatesPoints;
    }
    toString() {
        return `SumOfStates(` +
            `units(${this.units}), ` +
            `angularMomentum(${this.angularMomentum.toString()}), ` +
            `noLogSpline(${this.noLogSpline.toString()}), ` +
            `sumOfStatesPoints(${arrayToString(this.sumOfStatesPoints, " ")}))`;
    }
}
*/
/**
 * A class for representing a sum of states point.
 * @param {number} value The value of the point.
 * @param {number} energy The energy of the point.
 * @param {number} angMomMag The angular momentum magnitude of the point.
 */
/*
export class SumOfStatesPoint {
    value: number;
    energy: number;
    angMomMag: number;
    constructor(value: number, energy: number, angMomMag: number) {
        this.value = value;
        this.energy = energy;
        this.angMomMag = angMomMag;
    }
    toString() {
        return `SumOfStatesPoint(` +
            `value(${this.value}), ` +
            `energy(${this.energy.toString()}), ` +
            `angMomMag(${this.angMomMag.toString()}))`;
    }
}
*/
/**
 * A class for representing the DefinedSumOfStates MCRCMethod.
 * @param {string} name The name or xsi:type of the method.
 * @param {SumOfStates} sumOfStates The sum of states.
 */
/*
export class DefinedSumOfStates extends MCRCMethod {
    sumOfStates: SumOfStates;

    constructor(name: string, sumOfStates: SumOfStates) {
        super(name);
        this.sumOfStates = sumOfStates;
    }
    toString() {
        return `DefinedSumOfStates(${super.toString()}, ` +
            `sumOfStates(${this.sumOfStates.toString()}))`;
    }
}
*/
/**
 * A class for representing a reaction.
 */
var Reaction = /*#__PURE__*/function (_classes_js_1$Attribu4) {
  _inherits(Reaction, _classes_js_1$Attribu4);
  /**
   * @param {Map<string, string>} attributes The attributes.
   * @param {string} id The id of the reaction.
   * @param {Map<string, Reactant>} reactants The reactants in the reaction.
   * @param {Map<string, Product>} products The products of the reaction.
   * @param {MCRCMethod | undefined} mCRCMethod The MCRCMethod (optional).
   * @param {TransitionState | undefined} transitionState The transition state (optional).
   * @param {Tunneling | undefined} tunneling The tunneling (optional).
   */
  function Reaction(attributes, id, reactants, products, mCRCMethod, transitionState, tunneling) {
    var _this5;
    _classCallCheck(this, Reaction);
    _this5 = _callSuper(this, Reaction, [attributes]);
    /**
     * The id of the reaction. This is also stored in the attributes, but is hee for convenience...
     */
    _defineProperty(_assertThisInitialized(_this5), "id", void 0);
    /**
     * The reactants in the reaction.
     */
    _defineProperty(_assertThisInitialized(_this5), "reactants", void 0);
    /**
     * The products of the reaction.
     */
    _defineProperty(_assertThisInitialized(_this5), "products", void 0);
    /**
     * The MCRCMethod.
     */
    _defineProperty(_assertThisInitialized(_this5), "mCRCMethod", void 0);
    /**
     * The transition state.
     */
    _defineProperty(_assertThisInitialized(_this5), "transitionState", void 0);
    /**
     * The tunneling.
     */
    _defineProperty(_assertThisInitialized(_this5), "tunneling", void 0);
    _this5.id = id;
    _this5.reactants = reactants;
    _this5.products = products;
    _this5.mCRCMethod = mCRCMethod;
    _this5.transitionState = transitionState;
    _this5.tunneling = tunneling;
    return _this5;
  }
  /**
   * Convert the product to a string.
   * @returns String representation of the product.
   */
  _createClass(Reaction, [{
    key: "toString",
    value: function toString() {
      var _this$mCRCMethod, _this$transitionState, _this$tunneling;
      var s = _get(_getPrototypeOf(Reaction.prototype), "toString", this).call(this);
      return _get(_getPrototypeOf(Reaction.prototype), "toString", this).call(this) + "id(".concat(this.id, "), ") + "reactants(".concat((0, functions_js_1.mapToString)(this.reactants), "), ") + "products(".concat((0, functions_js_1.mapToString)(this.products), "), ") + "mCRCMethod(".concat((_this$mCRCMethod = this.mCRCMethod) === null || _this$mCRCMethod === void 0 ? void 0 : _this$mCRCMethod.toString(), "), ") + "transitionState(".concat((_this$transitionState = this.transitionState) === null || _this$transitionState === void 0 ? void 0 : _this$transitionState.toString(), "), ") + "tunneling(".concat((_this$tunneling = this.tunneling) === null || _this$tunneling === void 0 ? void 0 : _this$tunneling.toString(), "))");
    }
    /**
     * Get the label of the reactants.
     * @returns The label of the reactants.
     */
  }, {
    key: "getReactantsLabel",
    value: function getReactantsLabel() {
      return Array.from(this.reactants.values()).map(function (reactant) {
        return reactant.molecule.id;
      }).join(' + ');
    }
    /**
     * Get the combined energy of the reactants.
     * @returns The combined energy of the reactants.
     */
  }, {
    key: "getReactantsEnergy",
    value: function getReactantsEnergy() {
      return Array.from(this.reactants.values()).map(function (reactant) {
        return reactant.molecule.getEnergy();
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    }
    /**
     * Returns the label for the products.
     * @returns The label for the products.
     */
  }, {
    key: "getProductsLabel",
    value: function getProductsLabel() {
      return Array.from(this.products.values()).map(function (product) {
        return product.molecule.id;
      }).join(' + ');
    }
    /**
     * Returns the total energy of all products.
     * @returns The total energy of all products.
     */
  }, {
    key: "getProductsEnergy",
    value: function getProductsEnergy() {
      return Array.from(this.products.values()).map(function (product) {
        return product.molecule.getEnergy();
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    }
    /**
     * Get the label of the reaction.
     * @returns The label of the reaction.
     */
  }, {
    key: "getLabel",
    value: function getLabel() {
      var label = this.getReactantsLabel() + ' -> ' + this.getProductsLabel();
      return label;
    }
    /**
     * @param {string} tagName The tag name.
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(tagName, pad, level) {
      // Padding
      var padding0 = "";
      var padding1 = "";
      var padding2 = "";
      var padding3 = "";
      if (pad != undefined && level != undefined) {
        padding0 = pad.repeat(level);
        padding1 = padding0 + pad;
        padding2 = padding1 + pad;
        padding3 = padding2 + pad;
      }
      // Reactants
      var reactants_xml = "";
      this.reactants.forEach(function (reactant) {
        reactants_xml += reactant.toXML("reactant", pad, padding1);
      });
      // Products
      var products_xml = "";
      this.products.forEach(function (product) {
        products_xml += product.toXML("product", pad, padding1);
      });
      // Tunneling
      var tunneling_xml = "";
      if (this.tunneling != undefined) {
        tunneling_xml = this.tunneling.toTag("me.tunneling", padding1);
      }
      // TransitionState
      var transitionState_xml = "";
      if (this.transitionState != undefined) {
        transitionState_xml = this.transitionState.toXML("transitionState", pad, padding1);
      }
      // MCRCMethod
      var mCRCMethod_xml = "";
      if (this.mCRCMethod != undefined) {
        if (this.mCRCMethod instanceof MesmerILT) {
          mCRCMethod_xml = this.mCRCMethod.toXML("mCRCMethod", padding1);
        } else {
          mCRCMethod_xml = this.mCRCMethod.toTag("mCRCMethod", padding1);
        }
      }
      return (0, xml_js_1.getTag)(reactants_xml + products_xml + tunneling_xml + transitionState_xml + mCRCMethod_xml, tagName, this.attributes, undefined, undefined, padding0, true);
    }
  }]);
  return Reaction;
}(classes_js_1.Attributes);
exports.Reaction = Reaction;
},{"./functions.js":"../dist/client/cjm/functions.js","./classes.js":"../dist/client/cjm/classes.js","./xml.js":"../dist/client/cjm/xml.js"}],"../dist/client/cjm/canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTextWidth = exports.getTextHeight = exports.writeText = exports.drawLine = exports.drawLevel = void 0;
/**
 * Draw a horizontal line and add labels.
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} strokeStyle The name of a style to use for the line.
 * @param {number} strokewidth The width of the line.
 * @param {number} x0 The start x-coordinate of the line.
 * @param {number} y0 The start y-coordinate of the line. Also used for an energy label.
 * @param {number} x1 The end x-coordinate of the line.
 * @param {number} y1 The end y-coordinate of the line.
 * @param {string} font The font to use.
 * @param {number} th The height of the text in pixels.
 * @param {string} label The label.
 * @param {string} energyString The energy.
 */
function drawLevel(ctx, strokeStyle, strokewidth, x0, y0, x1, y1, font, th, label, energyString) {
  var x_centre = x0 + (x1 - x0) / 2;
  writeText(ctx, energyString, font, strokeStyle, getTextStartX(ctx, energyString, font, x_centre), y1 + th);
  writeText(ctx, label, font, strokeStyle, getTextStartX(ctx, label, font, x_centre), y1 + 3 * th);
  drawLine(ctx, strokeStyle, strokewidth, x0, y0, x1, y1);
}
exports.drawLevel = drawLevel;
/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the start x-coordinate of.
 * @param {string} font The font to use.
 * @param {number} x_centre The x-coordinate of the centre of the text.
 * @returns The x-coordinate of the start of the text.
 */
function getTextStartX(ctx, text, font, x_centre) {
  var tw = getTextWidth(ctx, text, font);
  return x_centre - tw / 2;
}
/**
 * Draw a line (segment) on the canvas.
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} strokeStyle The name of a style to use for the line.
 * @param {Integer} x1 The start x-coordinate of the line.
 * @param {Integer} y1 The start y-coordinate of the line.
 * @param {Integer} x2 The end x-coordinate of the line.
 * @param {Integer} y2 The end y-coordinate of the line.
 */
function drawLine(ctx, strokeStyle, strokewidth, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = strokewidth;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
exports.drawLine = drawLine;
/**
 * Writes text to the canvas. (It is probably better to write all the labels in one go.)
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to write.
 * @param {string} font The font to use.
 * @param {string} colour The colour of the text.
 * @param {number} x The horizontal position of the text.
 * @param {number} y The vertical position of the text.
 */
function writeText(ctx, text, font, colour, x, y) {
  // Save the context (to restore after).
  ctx.save();
  // Translate to the point where text is to be added.
  ctx.translate(x, y);
  // Invert Y-axis.
  ctx.scale(1, -1);
  // Set the text font.
  ctx.font = font;
  // Set the text colour.
  ctx.fillStyle = colour;
  // Write the text.
  ctx.fillText(text, 0, 0);
  // Restore the context.
  ctx.restore();
}
exports.writeText = writeText;
/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the height of.
 * @param {string} font The font to use.
 * @returns {number} The height of the text in pixels.
 */
function getTextHeight(ctx, text, font) {
  ctx.font = font;
  var fontMetric = ctx.measureText(text);
  return fontMetric.actualBoundingBoxAscent + fontMetric.actualBoundingBoxDescent;
}
exports.getTextHeight = getTextHeight;
/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the width of.
 * @param {string} font The font to use.
 * @returns {number} The width of the text in pixels.
 */
function getTextWidth(ctx, text, font) {
  ctx.font = font;
  return ctx.measureText(text).width;
}
exports.getTextWidth = getTextWidth;
},{}],"../dist/client/cjm/conditions.js":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Conditions = exports.BathGas = exports.PTpair = void 0;
var classes_js_1 = require("./classes.js");
var reaction_js_1 = require("./reaction.js");
var xml_js_1 = require("./xml.js");
/**
 * A class for representing a Pressure and Temperature pair.
 */
var PTpair = /*#__PURE__*/function (_classes_js_1$Attribu) {
  _inherits(PTpair, _classes_js_1$Attribu);
  /**
   * @param {Map<string, string>} attributes The attributes.
   */
  function PTpair(attributes) {
    var _this;
    _classCallCheck(this, PTpair);
    _this = _callSuper(this, PTpair, [attributes]);
    /**
     * The pressure also stored as a string in the attributes.
     */
    _defineProperty(_assertThisInitialized(_this), "P", void 0);
    /**
     * The temperature also stored as a string in the attributes.
     */
    _defineProperty(_assertThisInitialized(_this), "T", void 0);
    var p = attributes.get("P");
    if (p) {
      _this.P = parseFloat(p);
    } else {
      throw new Error("P is undefined");
    }
    var t = attributes.get("T");
    if (t) {
      _this.T = parseFloat(t);
    } else {
      throw new Error("T is undefined");
    }
    return _this;
  }
  return _createClass(PTpair);
}(classes_js_1.Attributes);
exports.PTpair = PTpair;
/**
 * A class for representing a bath gas reaction molecule.
 */
var BathGas = /*#__PURE__*/function (_reaction_js_1$Reacti) {
  _inherits(BathGas, _reaction_js_1$Reacti);
  function BathGas(attributes, molecule) {
    _classCallCheck(this, BathGas);
    return _callSuper(this, BathGas, [attributes, molecule]);
  }
  return _createClass(BathGas);
}(reaction_js_1.ReactionMolecule);
exports.BathGas = BathGas;
/**
 * A class for representing the experiment conditions.
 */
var Conditions = /*#__PURE__*/function () {
  /**
   * @param {BathGas} bathGas The bath gas.
   * @param {PTpair} pTs The Pressure and Temperature pairs.
   */
  function Conditions(bathGas, pTs) {
    _classCallCheck(this, Conditions);
    /**
     * The bath gas.
     */
    _defineProperty(this, "bathGas", void 0);
    /**
     * The Pressure and Temperature pair.
     */
    _defineProperty(this, "pTs", void 0);
    this.bathGas = bathGas;
    this.pTs = pTs;
  }
  /**
   * @returns A string representation.
   */
  _createClass(Conditions, [{
    key: "toString",
    value: function toString() {
      return "Conditions(" + "bathGas(".concat(this.bathGas.toString(), "), ") + "pTs(".concat(this.pTs.toString(), "))");
    }
    /**
     * @param padding The padding (optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(pad, padding) {
      var padding1 = "";
      if (pad != undefined && padding != undefined) {
        padding1 = padding + pad;
      }
      var s = this.bathGas.toXML("bathGas", pad, padding1);
      this.pTs.forEach(function (pt) {
        s += pt.toTag("PTpair", padding1);
      });
      return (0, xml_js_1.getTag)(s, "conditions", undefined, undefined, undefined, padding, true);
    }
  }]);
  return Conditions;
}();
exports.Conditions = Conditions;
},{"./classes.js":"../dist/client/cjm/classes.js","./reaction.js":"../dist/client/cjm/reaction.js","./xml.js":"../dist/client/cjm/xml.js"}],"../dist/client/cjm/modelParameters.js":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelParameters = exports.GrainSize = void 0;
var classes_1 = require("./classes");
var xml_1 = require("./xml");
/**
 * A class for measures of grain size.
 */
var GrainSize = /*#__PURE__*/function (_classes_1$NumberWith) {
  _inherits(GrainSize, _classes_1$NumberWith);
  /**
   * @param {string} units The units.
   */
  function GrainSize(attributes, value) {
    _classCallCheck(this, GrainSize);
    return _callSuper(this, GrainSize, [attributes, value]);
  }
  _createClass(GrainSize, [{
    key: "toString",
    value: function toString() {
      return "GrainSize(".concat(_get(_getPrototypeOf(GrainSize.prototype), "toString", this).call(this), ")");
    }
  }]);
  return GrainSize;
}(classes_1.NumberWithAttributes);
exports.GrainSize = GrainSize;
/**
 * A class for model parameters.
 */
var ModelParameters = /*#__PURE__*/function () {
  /**
   * @param {GrainSize} grainSize The grain size.
   * @param {number} energyAboveTheTopHill The energy above the top hill.
   */
  function ModelParameters(grainSize, energyAboveTheTopHill) {
    _classCallCheck(this, ModelParameters);
    /**
     * The grain size.
     */
    _defineProperty(this, "grainSize", void 0);
    /**
     * The energy above the top hill.
     */
    _defineProperty(this, "energyAboveTheTopHill", void 0);
    this.grainSize = grainSize;
    this.energyAboveTheTopHill = energyAboveTheTopHill;
  }
  _createClass(ModelParameters, [{
    key: "toString",
    value: function toString() {
      return "ModelParameters(" + "grainSize(".concat(this.grainSize.toString(), "), ") + "energyAboveTheTopHill(".concat(this.energyAboveTheTopHill.toString(), "))");
    }
    /**
     * Get the XML representation.
     * @param {string} pad The pad (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(pad, padding) {
      var padding2 = "";
      if (pad != undefined && padding != undefined) {
        padding2 = padding + pad;
      }
      var s = this.grainSize.toXML("me:GrainSize", padding2);
      s += (0, xml_1.getTag)(this.energyAboveTheTopHill.toString(), "me:EnergyAboveTheTopHill", undefined, undefined, undefined, padding2, false);
      return (0, xml_1.getTag)(s, "me:modelParameters", undefined, undefined, undefined, padding, true);
    }
  }]);
  return ModelParameters;
}();
exports.ModelParameters = ModelParameters;
},{"./classes":"../dist/client/cjm/classes.js","./xml":"../dist/client/cjm/xml.js"}],"../dist/client/cjm/control.js":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Control = exports.DiagramEnergyOffset = void 0;
var classes_1 = require("./classes");
var html_1 = require("./html");
var xml_1 = require("./xml");
/**
 * A class for the diagram energy offset.
 */
var DiagramEnergyOffset = /*#__PURE__*/function (_classes_1$NumberWith) {
  _inherits(DiagramEnergyOffset, _classes_1$NumberWith);
  /**
   * @param {Map<string, string>} attributes The attributes (ref refers to a particular reaction).
   * @param {number} value The value.
   */
  function DiagramEnergyOffset(attributes, value) {
    _classCallCheck(this, DiagramEnergyOffset);
    return _callSuper(this, DiagramEnergyOffset, [attributes, value]);
  }
  return _createClass(DiagramEnergyOffset);
}(classes_1.NumberWithAttributes);
exports.DiagramEnergyOffset = DiagramEnergyOffset;
/**
 * A class for the control.
 */
var Control = /*#__PURE__*/function () {
  function Control(testDOS, printSpeciesProfile, testMicroRates, testRateConstant, printGrainDOS, printCellDOS, printReactionOperatorColumnSums, printTunnellingCoefficients, printGrainkfE, printGrainBoltzmann, printGrainkbE, eigenvalues, hideInactive, diagramEnergyOffset) {
    _classCallCheck(this, Control);
    _defineProperty(this, "testDOS", void 0);
    _defineProperty(this, "printSpeciesProfile", void 0);
    _defineProperty(this, "testMicroRates", void 0);
    _defineProperty(this, "testRateConstant", void 0);
    _defineProperty(this, "printGrainDOS", void 0);
    _defineProperty(this, "printCellDOS", void 0);
    _defineProperty(this, "printReactionOperatorColumnSums", void 0);
    _defineProperty(this, "printTunnellingCoefficients", void 0);
    _defineProperty(this, "printGrainkfE", void 0);
    _defineProperty(this, "printGrainBoltzmann", void 0);
    _defineProperty(this, "printGrainkbE", void 0);
    _defineProperty(this, "eigenvalues", void 0);
    _defineProperty(this, "hideInactive", void 0);
    _defineProperty(this, "diagramEnergyOffset", void 0);
    this.testDOS = testDOS;
    this.printSpeciesProfile = printSpeciesProfile;
    this.testMicroRates = testMicroRates;
    this.testRateConstant = testRateConstant;
    this.printGrainDOS = printGrainDOS;
    this.printCellDOS = printCellDOS;
    this.printReactionOperatorColumnSums = printReactionOperatorColumnSums;
    this.printTunnellingCoefficients = printTunnellingCoefficients;
    this.printGrainkfE = printGrainkfE;
    this.printGrainBoltzmann = printGrainBoltzmann;
    this.printGrainkbE = printGrainkbE;
    this.eigenvalues = eigenvalues;
    this.hideInactive = hideInactive;
    this.diagramEnergyOffset = diagramEnergyOffset;
  }
  _createClass(Control, [{
    key: "toString",
    value: function toString() {
      var _this$testDOS, _this$printSpeciesPro, _this$testMicroRates, _this$testRateConstan, _this$printGrainDOS, _this$printCellDOS, _this$printReactionOp, _this$printTunnelling, _this$printGrainkfE, _this$printGrainBoltz, _this$printGrainkbE, _this$eigenvalues, _this$hideInactive;
      return "Control(" + "testDOS(".concat((_this$testDOS = this.testDOS) === null || _this$testDOS === void 0 ? void 0 : _this$testDOS.toString(), "), ") + "printSpeciesProfile(".concat((_this$printSpeciesPro = this.printSpeciesProfile) === null || _this$printSpeciesPro === void 0 ? void 0 : _this$printSpeciesPro.toString(), "), ") + "testMicroRates(".concat((_this$testMicroRates = this.testMicroRates) === null || _this$testMicroRates === void 0 ? void 0 : _this$testMicroRates.toString(), "), ") + "testRateConstant(".concat((_this$testRateConstan = this.testRateConstant) === null || _this$testRateConstan === void 0 ? void 0 : _this$testRateConstan.toString(), "), ") + "printGrainDOS(".concat((_this$printGrainDOS = this.printGrainDOS) === null || _this$printGrainDOS === void 0 ? void 0 : _this$printGrainDOS.toString(), "), ") + "printCellDOS(".concat((_this$printCellDOS = this.printCellDOS) === null || _this$printCellDOS === void 0 ? void 0 : _this$printCellDOS.toString(), "), ") + "printReactionOperatorColumnSums(".concat((_this$printReactionOp = this.printReactionOperatorColumnSums) === null || _this$printReactionOp === void 0 ? void 0 : _this$printReactionOp.toString(), "), ") + "printTunnellingCoefficients(".concat((_this$printTunnelling = this.printTunnellingCoefficients) === null || _this$printTunnelling === void 0 ? void 0 : _this$printTunnelling.toString(), "), ") + "printGrainkfE(".concat((_this$printGrainkfE = this.printGrainkfE) === null || _this$printGrainkfE === void 0 ? void 0 : _this$printGrainkfE.toString(), "), ") + "printGrainBoltzmann(".concat((_this$printGrainBoltz = this.printGrainBoltzmann) === null || _this$printGrainBoltz === void 0 ? void 0 : _this$printGrainBoltz.toString(), "), ") + "printGrainkbE(".concat((_this$printGrainkbE = this.printGrainkbE) === null || _this$printGrainkbE === void 0 ? void 0 : _this$printGrainkbE.toString(), "), ") + "eigenvalues(".concat((_this$eigenvalues = this.eigenvalues) === null || _this$eigenvalues === void 0 ? void 0 : _this$eigenvalues.toString(), "), ") + "hideInactive(".concat((_this$hideInactive = this.hideInactive) === null || _this$hideInactive === void 0 ? void 0 : _this$hideInactive.toString(), "))");
    }
    /**
     * Get the XML representation.
     * @param {string} pad The pad (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
  }, {
    key: "toXML",
    value: function toXML(pad, padding) {
      var _this$diagramEnergyOf;
      var padding1 = "";
      if (pad != undefined && padding != undefined) {
        padding1 = padding + pad;
      }
      var s = "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:testDOS") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printSpeciesProfile") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:testMicroRates") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:testRateConstant") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainDOS") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printCellDOS") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printReactionOperatorColumnSums") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printTunnellingCoefficients") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainkfE") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainBoltzmann") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainkbE") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:eigenvalues") + "\n";
      s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:hideInactive");
      s += (_this$diagramEnergyOf = this.diagramEnergyOffset) === null || _this$diagramEnergyOf === void 0 ? void 0 : _this$diagramEnergyOf.toXML("me:diagramEnergyOffset", padding1);
      return (0, xml_1.getTag)(s, "control", undefined, undefined, null, padding, true);
    }
  }]);
  return Control;
}();
exports.Control = Control;
},{"./classes":"../dist/client/cjm/classes.js","./html":"../dist/client/cjm/html.js","./xml":"../dist/client/cjm/xml.js"}],"../dist/client/cjm/client.js":[function(require,module,exports) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEnergy = void 0;
var util_js_1 = require("./util.js");
var xml_js_1 = require("./xml.js");
var molecule_js_1 = require("./molecule.js");
var reaction_js_1 = require("./reaction.js");
var functions_js_1 = require("./functions.js");
var html_js_1 = require("./html.js");
var canvas_js_1 = require("./canvas.js");
var classes_js_1 = require("./classes.js");
var conditions_js_1 = require("./conditions.js");
var modelParameters_js_1 = require("./modelParameters.js");
var control_js_1 = require("./control.js");
// Code for service worker for Progressive Web App (PWA).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register("/__/sw.js").then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
// Expected XML tags strings.
var me_title_s = 'me:title';
/**
 * For storing me.title.
 */
var title;
/**
 * For storing the XML root start tag.
 */
var mesmerStartTag;
/**
 * For storing the XML root end tag.
 */
var mesmerEndTag;
/**
 * A map of molecules with Molecule.id as key and Molecules as values.
 */
var molecules = new Map([]);
/**
 * For storing the maximum molecule energy in a reaction.
 */
var maxMoleculeEnergy = -Infinity;
/**
 * For storing the minimum molecule energy in a reaction.
 */
var minMoleculeEnergy = Infinity;
/**
 * A map of reactions with Reaction.id as keys and Reactions as values.
 */
var reactions = new Map([]);
/**
 * The header of the XML file.
 */
var header = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<?xml-stylesheet type='text/xsl' href='../../mesmer2.xsl' media='other'?>\n<?xml-stylesheet type='text/xsl' href='../../mesmer1.xsl' media='screen'?>";
/**
 * The filename of the mesmer input file loaded.
 */
var input_xml_filename;
/**
 * The load button.
 */
var loadButton;
/**
 * The save button.
 */
var saveButton;
/**
 * The XML text element.
 */
var me_title;
var molecules_title;
var molecules_table;
var reactions_title;
var reactions_table;
var reactions_diagram_title;
var conditions_title;
var conditions_table;
var modelParameters_title;
var modelParameters_table;
var xml_title;
var xml_text;
/**
 * Display the XML.
 * @param {string} xml The XML to display.
 */
function displayXML(xml) {
  //console.log("xml=" + xml);
  if (xml_title != null) {
    xml_title.innerHTML = input_xml_filename;
  }
  if (xml_text != null) {
    xml_text.innerHTML = (0, xml_js_1.toHTML)(xml);
  }
}
/**
 * Parses xml to initilise molecules.
 * @param {XMLDocument} xml The XML document.
 */
function initMolecules(xml) {
  var moleculeList_s = 'moleculeList';
  console.log(moleculeList_s);
  var xml_moleculeList = (0, xml_js_1.getSingularElement)(xml, moleculeList_s);
  // Set molecules_title.
  molecules_title = document.getElementById("molecules_title");
  if (molecules_title != null) {
    molecules_title.innerHTML = "Molecules";
  }
  // xml_moleculeList should have one or more molecule elements and no other elements.
  var moleculeListTagNames = new Set();
  xml_moleculeList.childNodes.forEach(function (node) {
    moleculeListTagNames.add(node.nodeName);
  });
  if (moleculeListTagNames.size != 1) {
    if (!(moleculeListTagNames.size == 2 && moleculeListTagNames.has("#text"))) {
      console.error("moleculeListTagNames:");
      moleculeListTagNames.forEach(function (x) {
        return console.error(x);
      });
      throw new Error("Additional tag names in moleculeList:");
    }
  }
  if (!moleculeListTagNames.has("molecule")) {
    throw new Error("Expecting molecule tagName but it is not present!");
  }
  var xml_molecules = xml_moleculeList.getElementsByTagName('molecule');
  var xml_molecules_length = xml_molecules.length;
  console.log("Number of molecules=" + xml_molecules_length);
  // Process each molecule.
  //xml_molecules.forEach(function (xml_molecule) { // Cannot iterate over HTMLCollectionOf like this.
  var _loop = function _loop() {
    // Set attributes.
    var attributes = (0, xml_js_1.getAttributes)(xml_molecules[i]);
    var moleculeTagNames = new Set();
    var cns = xml_molecules[i].childNodes;
    cns.forEach(function (node) {
      moleculeTagNames.add(node.nodeName);
    });
    //console.log("moleculeTagNames:");
    //moleculeTagNames.forEach(x => console.log(x));
    // Set atoms.
    var atoms = new Map();
    // Sometimes there is an individual atom not in an atomArray.
    //let xml_atomArray = xml_molecules[i].getElementsByTagName("atomArray")[0];
    //if (xml_atomArray != null) {
    moleculeTagNames.delete("atom");
    moleculeTagNames.delete("atomArray");
    var xml_atoms = xml_molecules[i].getElementsByTagName("atom");
    for (var j = 0; j < xml_atoms.length; j++) {
      var attribs = (0, xml_js_1.getAttributes)(xml_atoms[j]);
      var id = attribs.get("id");
      if (id != undefined) {
        var atom = new molecule_js_1.Atom(attribs);
        //console.log(atom.toString());
        atoms.set(id, atom);
      }
    }
    //}
    // Read bondArray.
    moleculeTagNames.delete("bond");
    moleculeTagNames.delete("bondArray");
    var bonds = new Map();
    var xml_bonds = xml_molecules[i].getElementsByTagName("bond");
    for (var _j = 0; _j < xml_bonds.length; _j++) {
      var _attribs = (0, xml_js_1.getAttributes)(xml_bonds[_j]);
      var _id = _attribs.get("atomRefs2");
      if (_id != undefined) {
        var bond = new molecule_js_1.Bond(_attribs);
        //console.log(bond.toString());
        bonds.set(_id, bond);
      }
    }
    // Read propertyList.
    var properties = new Map();
    // Sometimes there is a single property not in propertyList!
    //let xml_propertyList = xml_molecules[i].getElementsByTagName("propertyList")[0];
    //if (xml_propertyList != null) {
    //    let xml_properties = xml_propertyList.getElementsByTagName("property");
    moleculeTagNames.delete("property");
    moleculeTagNames.delete("propertyList");
    var xml_properties = xml_molecules[i].getElementsByTagName("property");
    for (var _j2 = 0; _j2 < xml_properties.length; _j2++) {
      var _attribs2 = (0, xml_js_1.getAttributes)(xml_properties[_j2]);
      var children = xml_properties[_j2].children;
      if (children.length != 1) {
        throw new Error("Expecting 1 child but finding " + children.length);
      }
      var nodeAttributes = (0, xml_js_1.getAttributes)(children[0]);
      var nodeName = children[0].nodeName; // Expecting scalar or array
      var textContent = children[0].textContent;
      if (textContent == null) {
        console.error("nodeName");
        throw new Error('textContent is null');
      }
      textContent = textContent.trim();
      var dictRef = _attribs2.get("dictRef");
      //console.log("dictRef=" + dictRef);
      if (dictRef == null) {
        throw new Error('dictRef is null');
      }
      //console.log("fcnn=" + fcnn);
      if (nodeName == "scalar") {
        moleculeTagNames.delete("scalar");
        var value = parseFloat(textContent);
        properties.set(dictRef, new molecule_js_1.Property(_attribs2, new classes_js_1.NumberWithAttributes(nodeAttributes, value)));
        if (dictRef === "me:ZPE") {
          minMoleculeEnergy = Math.min(minMoleculeEnergy, value);
          maxMoleculeEnergy = Math.max(maxMoleculeEnergy, value);
        }
      } else if (nodeName == "array") {
        moleculeTagNames.delete("array");
        properties.set(dictRef, new molecule_js_1.Property(_attribs2, new classes_js_1.NumberArrayWithAttributes(nodeAttributes, (0, functions_js_1.toNumberArray)(textContent.split(/\s+/)), " ")));
      } else if (nodeName == "matrix") {} else {
        throw new Error("Unexpected nodeName: " + nodeName);
      }
    }
    var els;
    // Read energyTransferModel
    moleculeTagNames.delete("me:energyTransferModel");
    var energyTransferModel = undefined;
    els = xml_molecules[i].getElementsByTagName("me:energyTransferModel");
    if (els != null) {
      if (els.length > 0) {
        if (els.length != 1) {
          throw new Error("energyTransferModel length=" + els.length);
        }
        var xml_deltaEDown = els[0].getElementsByTagName("me:deltaEDown");
        if (xml_deltaEDown != null) {
          if (xml_deltaEDown.length != 1) {
            throw new Error("deltaEDown length=" + xml_deltaEDown.length);
          }
          var _value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_deltaEDown[0])));
          var deltaEDown = new molecule_js_1.DeltaEDown((0, xml_js_1.getAttributes)(xml_deltaEDown[0]), _value);
          energyTransferModel = new molecule_js_1.EnergyTransferModel((0, xml_js_1.getAttributes)(els[0]), deltaEDown);
        }
      }
    }
    // Read DOSCMethod
    moleculeTagNames.delete("me:DOSCMethod");
    var dOSCMethod = undefined;
    els = xml_molecules[i].getElementsByTagName("me:DOSCMethod");
    if (els != null) {
      var el = els[0];
      if (el != null) {
        if (el != null) {
          var type = el.getAttribute("xsi:type");
          if (type != null) {
            dOSCMethod = new molecule_js_1.DOSCMethod(type);
          }
        }
      }
    }
    // Check for unexpected tags.
    moleculeTagNames.delete("#text");
    if (moleculeTagNames.size > 0) {
      console.error("Remaining moleculeTagNames:");
      moleculeTagNames.forEach(function (x) {
        return console.error(x);
      });
      throw new Error("Unexpected tags in molecule.");
    }
    var molecule = new molecule_js_1.Molecule(attributes, atoms, bonds, properties, energyTransferModel, dOSCMethod);
    //console.log(molecule.toString());
    molecules.set(molecule.id, molecule);
  };
  for (var i = 0; i < xml_molecules.length; i++) {
    _loop();
  }
  // Add event listeners to molecules table.
  molecules.forEach(function (molecule, id) {
    var energyKey = id + "_energy";
    var inputElement = document.getElementById(energyKey);
    if (inputElement) {
      inputElement.addEventListener('change', function (event) {
        // The input is set up to call the function setEnergy(HTMLInputElement),
        // so the following commented code is not used. As the input was setup 
        // as a number type. The any non numbers were It seems that there are two 
        // ways to get and store the value of the input element.
        // Both ways have been kept for now as I don't know which way is better!
        var eventTarget = event.target;
        var inputValue = eventTarget.value;
        if ((0, functions_js_1.isNumeric)(inputValue)) {
          molecule.setEnergy(parseFloat(inputValue));
          console.log("Set energy of " + id + " to " + inputValue + " kJ/mol");
        } else {
          alert("Energy input for " + id + " is not a number");
          var _inputElement = document.getElementById(energyKey);
          _inputElement.value = molecule.getEnergy().toString();
          console.log("inputValue=" + inputValue);
          console.log("Type of inputValue: " + _typeof(inputValue));
        }
      });
    }
  });
}
var inputElement;
function reload() {
  inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.onchange = function () {
    if (inputElement.files) {
      for (var i = 0; i < inputElement.files.length; i++) {
        console.log("inputElement.files[" + i + "]=" + inputElement.files[i]);
      }
      var file = inputElement.files[0];
      //console.log("file=" + file);
      console.log(file.name);
      input_xml_filename = file.name;
      if (xml_text != null) {
        var reader = new FileReader();
        var chunkSize = 1024 * 1024; // 1MB
        var start = 0;
        var contents = '';
        reader.onload = function (e) {
          if (!e.target) {
            throw new Error('Event target is null');
          }
          contents += e.target.result;
          if (file != null) {
            if (start < file.size) {
              // Read the next chunk
              var _blob = file.slice(start, start + chunkSize);
              reader.readAsText(_blob);
              start += chunkSize;
            } else {
              // All chunks have been read
              contents = contents.trim();
              displayXML(contents);
              var parser = new DOMParser();
              var xml = parser.parseFromString(contents, "text/xml");
              parse(xml);
              // Send XML to the server
              fetch('http://localhost:1234/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'text/xml'
                },
                body: contents
              }).then(function (response) {
                if (!response.ok) {
                  throw new Error("HTTP error! status: ".concat(response.status));
                }
                return response.text();
              }).then(function (data) {
                console.log('Server response:', data);
              }).catch(function (error) {
                console.error('There was a problem with the fetch operation:', error);
              });
            }
          }
        };
        // Read the first chunk
        var blob = file.slice(start, start + chunkSize);
        reader.readAsText(blob);
        start += chunkSize;
      }
    }
  };
  inputElement.click();
  // Add event listener to load button.
  loadButton = document.getElementById('load_button');
  if (loadButton != null) {
    loadButton.addEventListener('click', reload);
  }
  // Ensure save button is displayed.
  saveButton = document.getElementById('saveButton');
  if (saveButton != null) {
    saveButton.style.display = 'inline';
  }
}
/**
 * Once the DOM is loaded, set up the elements.
 */
document.addEventListener('DOMContentLoaded', function (event) {
  // Initialise elements
  xml_title = document.getElementById("xml_title");
  xml_text = document.getElementById("xml_text");
  window.loadXML = function () {
    reload();
  };
});
/**
 * Set the title.
 * @param {XMLDocument} xml The XML document.
 */
function setTitle(xml) {
  me_title = xml.getElementsByTagName(me_title_s);
  if (me_title == null) {
    throw new Error(me_title_s + ' not found');
  } else {
    if (me_title.length != 1) {
      throw new Error('Multiple ' + me_title_s + ' elements found');
    } else {
      title = me_title[0].childNodes[0].nodeValue;
      title = title.trim();
      console.log("Title=" + title);
      var e = document.getElementById("title");
      if (e != null) {
        e.innerHTML = title;
      }
    }
  }
}
/**
 * Parse the XML.
 * @param {XMLDocument} xml
 */
function parse(xml) {
  /**
   * Set mesmer_xml start tag.
   */
  mesmerStartTag = "\n";
  var documentElement = xml.documentElement;
  if (documentElement == null) {
    throw new Error("Document element not found");
  } else {
    var tagName = documentElement.tagName;
    mesmerStartTag += "<" + tagName;
    console.log(tagName);
    mesmerEndTag = (0, xml_js_1.getEndTag)(tagName, "", true);
    var first = true;
    var pad = " ".repeat(tagName.length + 2);
    var names = documentElement.getAttributeNames();
    names.forEach(function (name) {
      var attribute = documentElement.getAttribute(name);
      var na = "".concat(name, "=\"").concat(attribute, "\"");
      if (first) {
        first = false;
        mesmerStartTag += " " + na;
      } else {
        mesmerStartTag += "\n" + pad + na;
      }
    });
    mesmerStartTag += ">";
    //console.log(mesmerStartTag);
  }
  /**
   *  Set title.
   */
  setTitle(xml);
  /**
   * Generate molecules table.
   */
  initMolecules(xml);
  displayMoleculesTable();
  /**
   * Generate reactions table.
   */
  initReactions(xml);
  displayReactionsTable();
  displayReactionsDiagram();
  /**
   * Generate conditions table.
   */
  initConditions(xml);
  displayConditions();
  /**
   * Generate parameters table.
   */
  initModelParameters(xml);
  displayModelParameters();
  /**
   * Generate control table.
   */
  initControl(xml);
  displayControl();
}
var conditions;
/**
 * Parse xml to initialise conditions.
 * @param {XMLDocument} xml The XML document.
 */
function initConditions(xml) {
  var me_conditions_s = 'me:conditions';
  console.log(me_conditions_s);
  var xml_conditions = (0, xml_js_1.getSingularElement)(xml, me_conditions_s);
  // Set conditions_title.
  conditions_title = document.getElementById("conditions_title");
  if (conditions_title != null) {
    conditions_title.innerHTML = "Conditions";
  }
  // BathGas
  var xml_bathGas = (0, xml_js_1.getSingularElement)(xml_conditions, 'me:bathGas');
  var attributes = (0, xml_js_1.getAttributes)(xml_bathGas);
  var bathGas = new conditions_js_1.BathGas(attributes, (0, util_js_1.get)(molecules, xml_bathGas.childNodes[0].nodeValue));
  // PTs
  var xml_PTs = (0, xml_js_1.getSingularElement)(xml_conditions, 'me:PTs');
  var xml_PTPairs = xml_PTs.getElementsByTagName('me:PTpair');
  // Process each PTpair.
  var PTs = [];
  for (var i = 0; i < xml_PTPairs.length; i++) {
    PTs.push(new conditions_js_1.PTpair((0, xml_js_1.getAttributes)(xml_PTPairs[i])));
  }
  conditions = new conditions_js_1.Conditions(bathGas, PTs);
}
var modelParameters;
/**
 * Parses xml to initialise modelParameters.
 * @param {XMLDocument} xml The XML document.
 */
function initModelParameters(xml) {
  var me_modelParameters_s = 'me:modelParameters';
  console.log(me_modelParameters_s);
  var xml_modelParameters = (0, xml_js_1.getSingularElement)(xml, me_modelParameters_s);
  // Set modelParameters_title.
  modelParameters_title = document.getElementById("modelParameters_title");
  if (modelParameters_title != null) {
    modelParameters_title.innerHTML = "Model Parameters";
  }
  // GrainSize
  var xml_grainSize = (0, xml_js_1.getSingularElement)(xml_modelParameters, 'me:grainSize');
  var attributes = (0, xml_js_1.getAttributes)(xml_grainSize);
  var value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_grainSize)));
  var grainSize = new modelParameters_js_1.GrainSize(attributes, value);
  // EnergyAboveTheTopHill
  var xml_energyAboveTheTopHill = (0, xml_js_1.getSingularElement)(xml_modelParameters, 'me:energyAboveTheTopHill');
  var energyAboveTheTopHill = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_energyAboveTheTopHill)));
  modelParameters = new modelParameters_js_1.ModelParameters(grainSize, energyAboveTheTopHill);
}
var control;
/**
 * Parses xml to initialise control.
 * @param {XMLDocument} xml The XML document.
 */
function initControl(xml) {
  var me_control_s = 'me:control';
  console.log(me_control_s);
  var xml_control = (0, xml_js_1.getSingularElement)(xml, me_control_s);
  // Set control_title.
  var control_title = document.getElementById("control_title");
  if (control_title != null) {
    control_title.innerHTML = "Control";
  }
  // me:testDOS
  var xml_testDOS = xml_control.getElementsByTagName('me:testDOS');
  var testDOS;
  if (xml_testDOS.length > 0) {
    testDOS = true;
  }
  // me:printSpeciesProfile
  var xml_printSpeciesProfile = xml_control.getElementsByTagName('me:printSpeciesProfile');
  var printSpeciesProfile;
  if (xml_printSpeciesProfile.length > 0) {
    printSpeciesProfile = true;
  }
  // me:testMicroRates
  var xml_testMicroRates = xml_control.getElementsByTagName('me:testMicroRates');
  var testMicroRates;
  if (xml_testMicroRates.length > 0) {
    testMicroRates = true;
  }
  // me:testRateConstant
  var xml_testRateConstant = xml_control.getElementsByTagName('me:testRateConstant');
  var testRateConstant;
  if (xml_testRateConstant.length > 0) {
    testRateConstant = true;
  }
  // me:printGrainDOS
  var xml_printGrainDOS = xml_control.getElementsByTagName('me:printGrainDOS');
  var printGrainDOS;
  if (xml_printGrainDOS.length > 0) {
    printGrainDOS = true;
  }
  // me:printCellDOS
  var xml_printCellDOS = xml_control.getElementsByTagName('me:printCellDOS');
  var printCellDOS;
  if (xml_printCellDOS.length > 0) {
    printCellDOS = true;
  }
  // me:printReactionOperatorColumnSums
  var xml_printReactionOperatorColumnSums = xml_control.getElementsByTagName('me:printReactionOperatorColumnSums');
  var printReactionOperatorColumnSums;
  if (xml_printReactionOperatorColumnSums.length > 0) {
    printReactionOperatorColumnSums = true;
  }
  // me:printTunnellingCoefficients
  var xml_printTunnellingCoefficients = xml_control.getElementsByTagName('me:printTunnellingCoefficients');
  var printTunnellingCoefficients;
  if (xml_printTunnellingCoefficients.length > 0) {
    printTunnellingCoefficients = true;
  }
  // me:printGrainkfE
  var xml_printGrainkfE = xml_control.getElementsByTagName('me:printGrainkfE');
  var printGrainkfE;
  if (xml_printGrainkfE.length > 0) {
    printGrainkfE = true;
  }
  // me:printGrainBoltzmann
  var xml_printGrainBoltzmann = xml_control.getElementsByTagName('me:printGrainBoltzmann');
  var printGrainBoltzmann;
  if (xml_printGrainBoltzmann.length > 0) {
    printGrainBoltzmann = true;
  }
  // me:printGrainkbE
  var xml_printGrainkbE = xml_control.getElementsByTagName('me:printGrainkbE');
  var printGrainkbE;
  if (xml_printGrainkbE.length > 0) {
    printGrainkbE = true;
  }
  // me:eigenvalues
  var xml_eigenvalues = xml_control.getElementsByTagName('me:eigenvalues');
  var eigenvalues;
  if (xml_eigenvalues.length > 0) {
    eigenvalues = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_eigenvalues[0])));
  }
  // me:hideInactive
  var xml_hideInactive = xml_control.getElementsByTagName('me:hideInactive');
  var hideInactive;
  if (xml_hideInactive.length > 0) {
    hideInactive = true;
  }
  // me:diagramEnergyOffset
  var xml_diagramEnergyOffset = xml_control.getElementsByTagName('me:diagramEnergyOffset');
  var diagramEnergyOffset;
  if (xml_diagramEnergyOffset.length > 0) {
    var value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_diagramEnergyOffset[0])));
    diagramEnergyOffset = new control_js_1.DiagramEnergyOffset((0, xml_js_1.getAttributes)(xml_diagramEnergyOffset[0]), value);
  }
  control = new control_js_1.Control(testDOS, printSpeciesProfile, testMicroRates, testRateConstant, printGrainDOS, printCellDOS, printReactionOperatorColumnSums, printTunnellingCoefficients, printGrainkfE, printGrainBoltzmann, printGrainkbE, eigenvalues, hideInactive, diagramEnergyOffset);
}
/**
 * Parses xml to initialise reactions.
 * @param {XMLDocument} xml The XML document.
 */
function initReactions(xml) {
  var reactionList_s = 'reactionList';
  console.log(reactionList_s);
  var xml_reactionList = (0, xml_js_1.getSingularElement)(xml, reactionList_s);
  var xml_reactions = xml_reactionList.getElementsByTagName('reaction');
  var xml_reactions_length = xml_reactions.length;
  console.log("Number of reactions=" + xml_reactions_length);
  // Process each reaction.
  if (xml_reactions_length == 0) {
    //return;
    throw new Error("No reactions: There should be at least 1!");
  }
  // Set reactions_title.
  reactions_title = document.getElementById("reactions_title");
  if (reactions_title != null) {
    reactions_title.innerHTML = "Reactions";
  }
  for (var i = 0; i < xml_reactions_length; i++) {
    var attributes = (0, xml_js_1.getAttributes)(xml_reactions[i]);
    var reactionID = attributes.get("id");
    if (reactionID == null) {
      throw new Error("reactionID is null");
    }
    if (reactionID != null) {
      console.log("id=" + reactionID);
      // Load reactants.
      var reactants = new Map([]);
      var xml_reactants = xml_reactions[i].getElementsByTagName('reactant');
      //console.log("xml_reactants.length=" + xml_reactants.length);
      for (var j = 0; j < xml_reactants.length; j++) {
        var xml_molecule = (0, xml_js_1.getFirstElement)(xml_reactants[j], 'molecule');
        var moleculeID = (0, xml_js_1.getAttribute)(xml_molecule, "ref");
        reactants.set(moleculeID, new reaction_js_1.Reactant((0, xml_js_1.getAttributes)(xml_molecule), (0, util_js_1.get)(molecules, moleculeID)));
      }
      // Load products.
      var products = new Map([]);
      var xml_products = xml_reactions[i].getElementsByTagName('product');
      //console.log("xml_products.length=" + xml_products.length);
      for (var _j3 = 0; _j3 < xml_products.length; _j3++) {
        var _xml_molecule = (0, xml_js_1.getFirstElement)(xml_products[_j3], 'molecule');
        var _moleculeID = (0, xml_js_1.getAttribute)(_xml_molecule, "ref");
        products.set(_moleculeID, new reaction_js_1.Product((0, xml_js_1.getAttributes)(_xml_molecule), (0, util_js_1.get)(molecules, _moleculeID)));
      }
      // Load MCRCMethod.
      //console.log("Load MCRCMethod...");
      var mCRCMethod = void 0;
      var xml_MCRCMethod = xml_reactions[i].getElementsByTagName('me:MCRCMethod');
      //console.log("xml_MCRCMethod=" + xml_MCRCMethod);
      //console.log("xml_MCRCMethod.length=" + xml_MCRCMethod.length);
      if (xml_MCRCMethod.length > 0) {
        var _attributes = (0, xml_js_1.getAttributes)(xml_MCRCMethod[0]);
        var name = _attributes.get("name");
        if (name == null) {
          var type = _attributes.get("xsi:type");
          if (type != null) {
            if (type === "me:MesmerILT") {
              var preExponential = void 0;
              var xml_preExponential = xml_MCRCMethod[0].getElementsByTagName("me:preExponential");
              if (xml_preExponential != null) {
                if (xml_preExponential[0] != null) {
                  var value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_preExponential[0])));
                  preExponential = new reaction_js_1.PreExponential((0, xml_js_1.getAttributes)(xml_preExponential[0]), value);
                }
              }
              var activationEnergy = void 0;
              var xml_activationEnergy = xml_MCRCMethod[0].getElementsByTagName("me:activationEnergy");
              if (xml_activationEnergy != null) {
                if (xml_activationEnergy[0] != null) {
                  var _value2 = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_activationEnergy[0])));
                  activationEnergy = new reaction_js_1.ActivationEnergy((0, xml_js_1.getAttributes)(xml_activationEnergy[0]), _value2);
                }
              }
              var tInfinity = void 0;
              var xml_tInfinity = xml_MCRCMethod[0].getElementsByTagName("me:TInfinity");
              if (xml_tInfinity != null) {
                if (xml_tInfinity[0] != null) {
                  var _value3 = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_tInfinity[0])));
                  tInfinity = new reaction_js_1.NInfinity((0, xml_js_1.getAttributes)(xml_tInfinity[0]), _value3);
                }
              }
              var nInfinity = void 0;
              var xml_nInfinity = xml_MCRCMethod[0].getElementsByTagName("me:nInfinity");
              if (xml_nInfinity != null) {
                if (xml_nInfinity[0] != null) {
                  var _value4 = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_nInfinity[0])));
                  nInfinity = new reaction_js_1.NInfinity((0, xml_js_1.getAttributes)(xml_nInfinity[0]), _value4);
                }
              }
              mCRCMethod = new reaction_js_1.MesmerILT(_attributes, preExponential, activationEnergy, tInfinity, nInfinity);
            }
          }
        } else {
          mCRCMethod = new reaction_js_1.MCRCMethod(_attributes, name);
        }
      }
      // Load transition state.
      //console.log("Load  transition state...");
      var xml_transitionState = xml_reactions[i].getElementsByTagName('me:transitionState');
      var transitionState = void 0;
      if (xml_transitionState.length > 0) {
        var _xml_molecule2 = xml_transitionState[0].getElementsByTagName('molecule')[0];
        var _moleculeID2 = _xml_molecule2.getAttribute("ref");
        transitionState = new reaction_js_1.TransitionState((0, xml_js_1.getAttributes)(_xml_molecule2), (0, util_js_1.get)(molecules, _moleculeID2));
        //console.log("transitionState moleculeID=" + transitionState.molecule.getID());
        //console.log("transitionState role=" + transitionState.attributes.get("role"));
      }
      // Load tunneling.
      var xml_tunneling = xml_reactions[i].getElementsByTagName('me:tunneling');
      var tunneling = void 0;
      if (xml_tunneling.length > 0) {
        tunneling = new reaction_js_1.Tunneling((0, xml_js_1.getAttributes)(xml_tunneling[0]));
      }
      var reaction = new reaction_js_1.Reaction(attributes, reactionID, reactants, products, mCRCMethod, transitionState, tunneling);
      reactions.set(reactionID, reaction);
      //console.log("reaction=" + reaction);
    }
  }
}
/**
 * Create a diagram.
 * @param {Map<string, Molecule>} molecules The molecules.
 * @param {Map<string, Reaction>} reactions The reactions.
 * @param {boolean} dark True for dark mode.
 * @returns {HTMLCanvasElement} The diagram.
 * @param {string} font The font to use.
 * @param {number} lw The line width of reactants, transition states and products.
 * @param {string} lwc The line width color to use.
 */
function drawReactionDiagram(canvas, molecules, reactions, dark, font, lw, lwc) {
  console.log("drawReactionDiagram");
  // TODO: Set styles depending on dark/light mode settings of users browser and not hard code.
  //let white = "white";
  var black = "black";
  var green = "green";
  var red = "red";
  var blue = "blue";
  //let yellow = "yellow";
  var orange = "orange";
  var background = "black";
  var foreground = "white";
  var ctx = canvas.getContext("2d");
  //ctx.fillStyle = background;
  // Get text height for font size.
  var th = (0, canvas_js_1.getTextHeight)(ctx, "Aj", font);
  //console.log("th=" + th);
  // Go through reactions:
  // 1. Create sets of reactants, end products, intermediate products and transition states.
  // 2. Create maps of orders and energies.
  // 3. Calculate maximum energy.
  var reactants = new Set();
  var products = new Set();
  var intProducts = new Set();
  var transitionStates = new Set();
  var orders = new Map();
  var energies = new Map();
  var i = 0;
  var energyMin = Number.MAX_VALUE;
  var energyMax = Number.MIN_VALUE;
  reactions.forEach(function (reaction, id) {
    // Get TransitionState if there is one.
    var transitionState = reaction.transitionState;
    //console.log("reactant=" + reactant);
    var reactantsLabel = reaction.getReactantsLabel();
    reactants.add(reactantsLabel);
    if (products.has(reactantsLabel)) {
      intProducts.add(reactantsLabel);
    }
    var energy = reaction.getReactantsEnergy();
    energyMin = Math.min(energyMin, energy);
    energyMax = Math.max(energyMax, energy);
    energies.set(reactantsLabel, energy);
    var productsLabel = reaction.getProductsLabel();
    products.add(productsLabel);
    energy = reaction.getProductsEnergy();
    energyMin = Math.min(energyMin, energy);
    energyMax = Math.max(energyMax, energy);
    energies.set(productsLabel, energy);
    if (!orders.has(reactantsLabel)) {
      orders.set(reactantsLabel, i);
      i++;
    }
    if (orders.has(productsLabel)) {
      i--;
      var j = (0, util_js_1.get)(orders, productsLabel);
      // Move product to end and shift everything back.
      orders.forEach(function (value, key) {
        if (value > j) {
          orders.set(key, value - 1);
        }
      });
      // Insert transition state.
      if (transitionState != undefined) {
        var tsn = transitionState.getRef();
        transitionStates.add(tsn);
        orders.set(tsn, i);
        energy = transitionState.molecule.getEnergy();
        energyMin = Math.min(energyMin, energy);
        energyMax = Math.max(energyMax, energy);
        energies.set(tsn, energy);
        i++;
      }
      orders.set(productsLabel, i);
      i++;
    } else {
      if (transitionState != undefined) {
        var _tsn = transitionState.getRef();
        transitionStates.add(_tsn);
        orders.set(_tsn, i);
        energy = transitionState.molecule.getEnergy();
        energyMin = Math.min(energyMin, energy);
        energyMax = Math.max(energyMax, energy);
        energies.set(_tsn, energy);
        i++;
      }
      orders.set(productsLabel, i);
      i++;
    }
  });
  //console.log("orders=" + mapToString(orders));
  //console.log("energies=" + mapToString(energies));
  //console.log("energyMax=" + energyMax);
  //console.log("energyMin=" + energyMin);
  var energyRange = energyMax - energyMin;
  //console.log("energyRange=" + energyRange);
  //console.log("reactants=" + reactants);
  //console.log("products=" + products);
  //console.log("transitionStates=" + transitionStates);
  // Create a lookup from order to label.
  var reorders = [];
  orders.forEach(function (value, key) {
    reorders[value] = key;
  });
  //console.log("reorders=" + arrayToString(reorders));
  // Iterate through the reorders:
  // 1. Capture coordinates for connecting lines.
  // 2. Store maximum x.
  var x0 = 0;
  var y0;
  var x1;
  var y1;
  var xmax = 0;
  var tw;
  var textSpacing = 5; // Spacing between end of line and start of text.
  var stepSpacing = 10; // Spacing between steps.
  var reactantsInXY = new Map();
  var reactantsOutXY = new Map();
  var productsInXY = new Map();
  var productsOutXY = new Map();
  var transitionStatesInXY = new Map();
  var transitionStatesOutXY = new Map();
  reorders.forEach(function (value) {
    //console.log("value=" + value + ".");
    //console.log("energies=" + mapToString(energies));
    var energy = (0, util_js_1.get)(energies, value);
    var energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, canvas.height, energy);
    // Get text width.
    tw = Math.max((0, canvas_js_1.getTextWidth)(ctx, energy.toString(), font), (0, canvas_js_1.getTextWidth)(ctx, value, font));
    x1 = x0 + tw + textSpacing;
    y0 = energyRescaled + lw;
    y1 = y0;
    // Draw horizontal line and add label.
    // (The drawing is now not done here but done later so labels are on top of lines.)
    // The code is left here commented out for reference.
    //drawLevel(ctx, green, 4, x0, y0, x1, y1, th, value);
    reactantsInXY.set(value, [x0, y0]);
    reactantsOutXY.set(value, [x1, y1]);
    if (products.has(value)) {
      productsInXY.set(value, [x0, y0]);
      productsOutXY.set(value, [x1, y1]);
    }
    if (transitionStates.has(value)) {
      transitionStatesInXY.set(value, [x0, y0]);
      transitionStatesOutXY.set(value, [x1, y1]);
    }
    x0 = x1 + stepSpacing;
    xmax = x1;
  });
  // Set canvas width to maximum x.
  canvas.width = xmax;
  //console.log("canvas.width=" + canvas.width);
  // Set canvas height to maximum energy plus the label.
  var canvasHeightWithBorder = canvas.height + 4 * th + 2 * lw;
  //console.log("canvasHeightWithBorder=" + canvasHeightWithBorder);
  var originalCanvasHeight = canvas.height;
  // Update the canvas height.
  canvas.height = canvasHeightWithBorder;
  // Set the transformation matrix.
  //ctx.transform(1, 0, 0, 1, 0, canvasHeightWithBorder);
  ctx.transform(1, 0, 0, -1, 0, canvasHeightWithBorder);
  // Go through reactions and draw connecting lines.
  reactions.forEach(function (reaction, id) {
    //console.log("id=" + id);
    //console.log("reaction=" + reaction);
    // Get TransitionState if there is one.
    var transitionState = reaction.transitionState;
    //console.log("reactant=" + reactant);
    var reactantsLabel = reaction.getReactantsLabel();
    var productsLabel = reaction.getProductsLabel();
    var reactantOutXY = (0, util_js_1.get)(reactantsOutXY, reactantsLabel);
    var productInXY = (0, util_js_1.get)(productsInXY, productsLabel);
    if (transitionState != undefined) {
      var transitionStateLabel = transitionState.getRef();
      var transitionStateInXY = (0, util_js_1.get)(transitionStatesInXY, transitionStateLabel);
      (0, canvas_js_1.drawLine)(ctx, black, lwc, reactantOutXY[0], reactantOutXY[1], transitionStateInXY[0], transitionStateInXY[1]);
      var transitionStateOutXY = (0, util_js_1.get)(transitionStatesOutXY, transitionStateLabel);
      (0, canvas_js_1.drawLine)(ctx, black, lwc, transitionStateOutXY[0], transitionStateOutXY[1], productInXY[0], productInXY[1]);
    } else {
      (0, canvas_js_1.drawLine)(ctx, black, lwc, reactantOutXY[0], reactantOutXY[1], productInXY[0], productInXY[1]);
    }
  });
  // Draw horizontal lines and labels.
  // (This is done last so that the labels are on top of the vertical lines.)
  reactants.forEach(function (value) {
    var energy = (0, util_js_1.get)(energies, value);
    var energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, originalCanvasHeight, energy);
    var x0 = (0, util_js_1.get)(reactantsInXY, value)[0];
    var y = energyRescaled + lw;
    var x1 = (0, util_js_1.get)(reactantsOutXY, value)[0];
    var energyString = energy.toString();
    (0, canvas_js_1.drawLevel)(ctx, blue, lw, x0, y, x1, y, font, th, value, energyString);
  });
  products.forEach(function (value) {
    var energy = (0, util_js_1.get)(energies, value);
    var energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, originalCanvasHeight, energy);
    var x0 = (0, util_js_1.get)(productsInXY, value)[0];
    var y = energyRescaled + lw;
    var x1 = (0, util_js_1.get)(productsOutXY, value)[0];
    var energyString = energy.toString();
    if (intProducts.has(value)) {
      (0, canvas_js_1.drawLevel)(ctx, orange, lw, x0, y, x1, y, font, th, value, energyString);
    } else {
      (0, canvas_js_1.drawLevel)(ctx, green, lw, x0, y, x1, y, font, th, value, energyString);
    }
  });
  transitionStates.forEach(function (value) {
    var v;
    var energy = (0, util_js_1.get)(energies, value);
    var energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, originalCanvasHeight, energy);
    var x0 = (0, util_js_1.get)(transitionStatesInXY, value)[0];
    var y = energyRescaled + lw;
    var x1 = (0, util_js_1.get)(transitionStatesOutXY, value)[0];
    var energyString = energy.toString();
    (0, canvas_js_1.drawLevel)(ctx, red, lw, x0, y, x1, y, font, th, value, energyString);
  });
}
/**
 * Display molecules table.
 */
function displayMoleculesTable() {
  if (molecules.size == 0) {
    return;
  }
  // Prepare table headings.
  var moleculesTable = (0, html_js_1.getTH)(["Name", "Energy<br>kJ/mol", "Rotation constants<br>cm<sup>-1</sup>", "Vibration frequencies<br>cm<sup>-1</sup>"]);
  molecules.forEach(function (molecule, id) {
    //console.log("id=" + id);
    //console.log("molecule=" + molecule);
    var energyNumber = molecule.getEnergy();
    var energy;
    if (energyNumber == null) {
      energy = "";
    } else {
      energy = energyNumber.toString();
    }
    //console.log("energy=" + energy);
    var rotationConstants = "";
    var rotConsts = molecule.getRotationConstants();
    if (rotConsts != undefined) {
      rotationConstants = (0, functions_js_1.arrayToString)(rotConsts, " ");
    }
    var vibrationFrequencies = "";
    var vibFreqs = molecule.getVibrationFrequencies();
    if (vibFreqs != undefined) {
      vibrationFrequencies = (0, functions_js_1.arrayToString)(vibFreqs, " ");
    }
    moleculesTable += (0, html_js_1.getTR)((0, html_js_1.getTD)(id) + (0, html_js_1.getTD)((0, html_js_1.getInput)("number", id + "_energy", "setEnergy(this)", energy)) + (0, html_js_1.getTD)(rotationConstants, true) + (0, html_js_1.getTD)(vibrationFrequencies, true));
  });
  molecules_table = document.getElementById("molecules_table");
  if (molecules_table !== null) {
    molecules_table.innerHTML = moleculesTable;
  }
}
/**
 * Display reactions table.
 */
function displayReactionsTable() {
  if (reactions.size == 0) {
    return;
  }
  // Prepare table headings.
  var reactionsTable = (0, html_js_1.getTH)(["ID", "Reactants", "Products", "Transition State", "PreExponential", "Activation Energy", "TInfinity", "NInfinity"]);
  reactions.forEach(function (reaction, id) {
    //console.log("id=" + id);
    //console.log("reaction=" + reaction);
    var reactants = (0, functions_js_1.arrayToString)(Array.from(reaction.reactants.keys()), " ");
    var products = (0, functions_js_1.arrayToString)(Array.from(reaction.products.keys()), " ");
    var transitionState = "";
    var preExponential = "";
    var activationEnergy = "";
    var tInfinity = "";
    var nInfinity = "";
    if (reaction.transitionState != undefined) {
      var name = reaction.transitionState.attributes.get("name");
      if (name != null) {
        transitionState = name;
      }
    }
    if (reaction.mCRCMethod != undefined) {
      if (reaction.mCRCMethod instanceof reaction_js_1.MesmerILT) {
        if (reaction.mCRCMethod.preExponential != null) {
          preExponential = reaction.mCRCMethod.preExponential.value.toString() + " " + reaction.mCRCMethod.preExponential.attributes.get("units");
        }
        if (reaction.mCRCMethod.activationEnergy != null) {
          activationEnergy = reaction.mCRCMethod.activationEnergy.value.toString() + " " + reaction.mCRCMethod.activationEnergy.attributes.get("units");
        }
        if (reaction.mCRCMethod.tInfinity != null) {
          tInfinity = reaction.mCRCMethod.tInfinity.toString();
        }
        if (reaction.mCRCMethod.nInfinity != null) {
          nInfinity = reaction.mCRCMethod.nInfinity.value.toString();
        }
      } else {
        if (reaction.mCRCMethod.attributes.get("name") == "RRKM") {} else {
          throw new Error("Unexpected mCRCMethod: " + reaction.mCRCMethod);
        }
      }
    }
    reactionsTable += (0, html_js_1.getTR)((0, html_js_1.getTD)(id) + (0, html_js_1.getTD)(reactants) + (0, html_js_1.getTD)(products) + (0, html_js_1.getTD)(transitionState) + (0, html_js_1.getTD)(preExponential, true) + (0, html_js_1.getTD)(activationEnergy, true) + (0, html_js_1.getTD)(tInfinity, true) + (0, html_js_1.getTD)(nInfinity, true));
    reactions_table = document.getElementById("reactions_table");
    if (reactions_table !== null) {
      reactions_table.innerHTML = reactionsTable;
    }
  });
}
/**
 * Display reactions diagram.
 */
function displayReactionsDiagram() {
  if (reactions.size > 1) {
    // Set reactions_diagram_title.
    reactions_diagram_title = document.getElementById("reactions_diagram_title");
    if (reactions_diagram_title != null) {
      reactions_diagram_title.innerHTML = "Diagram";
    }
    // Display the diagram.
    var canvas = document.getElementById("reactions_diagram");
    var font = "14px Arial";
    var dark = true;
    var lw = 4;
    var lwc = 2;
    if (canvas != null) {
      canvas.style.display = "block";
      drawReactionDiagram(canvas, molecules, reactions, dark, font, lw, lwc);
    }
  }
}
/**
 * Display conditions.
 */
function displayConditions() {
  var bathGas_element = document.getElementById("bathGas");
  if (bathGas_element != null) {
    bathGas_element.innerHTML = "Bath Gas " + conditions.bathGas.molecule.getID();
  }
  var PTs_element = document.getElementById("PT_table");
  var table = (0, html_js_1.getTH)(["P", "T"]);
  if (PTs_element != null) {
    conditions.pTs.forEach(function (pTpair) {
      table += (0, html_js_1.getTR)((0, html_js_1.getTD)(pTpair.P.toString()) + (0, html_js_1.getTD)(pTpair.T.toString()));
    });
    PTs_element.innerHTML = table;
  }
}
/**
 * Display modelParameters.
 */
function displayModelParameters() {
  var modelParameters_element = document.getElementById("modelParameters_table");
  var table = (0, html_js_1.getTH)(["Parameter", "Value"]);
  table += (0, html_js_1.getTR)((0, html_js_1.getTD)("Grain Size") + (0, html_js_1.getTD)(modelParameters.grainSize.value.toString()));
  table += (0, html_js_1.getTR)((0, html_js_1.getTD)("Energy Above The Top Hill") + (0, html_js_1.getTD)(modelParameters.energyAboveTheTopHill.toString()));
  if (modelParameters_element != null) {
    modelParameters_element.innerHTML = table;
  }
}
/**
 * Display control.
 */
function displayControl() {
  var control_table_element = document.getElementById("control_table");
  var table = (0, html_js_1.getTH)(["Control", "Value"]);
  if (control.testDOS != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.testDOS") + (0, html_js_1.getTD)(""));
  }
  if (control.printSpeciesProfile != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printSpeciesProfile") + (0, html_js_1.getTD)(""));
  }
  if (control.testMicroRates != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.testMicroRates") + (0, html_js_1.getTD)(""));
  }
  if (control.testRateConstant != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.testRateConstant") + (0, html_js_1.getTD)(""));
  }
  if (control.printGrainDOS != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainDOS") + (0, html_js_1.getTD)(""));
  }
  if (control.printCellDOS != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printCellDOS") + (0, html_js_1.getTD)(""));
  }
  if (control.printReactionOperatorColumnSums != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printReactionOperatorColumnSums") + (0, html_js_1.getTD)(""));
  }
  if (control.printTunnellingCoefficients != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printTunnellingCoefficients") + (0, html_js_1.getTD)(""));
  }
  if (control.printGrainkfE != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainkfE") + (0, html_js_1.getTD)(""));
  }
  if (control.printGrainBoltzmann != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainBoltzmann") + (0, html_js_1.getTD)(""));
  }
  if (control.printGrainkbE != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainkbE") + (0, html_js_1.getTD)(""));
  }
  if (control.eigenvalues != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.eigenvalues") + (0, html_js_1.getTD)(control.eigenvalues.toString()));
  }
  if (control.hideInactive != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.hideInactive") + (0, html_js_1.getTD)(""));
  }
  if (control.diagramEnergyOffset != undefined) {
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.diagramEnergyOffset") + (0, html_js_1.getTD)(control.diagramEnergyOffset.value.toString()));
  }
  if (control_table_element != null) {
    control_table_element.innerHTML = table;
  }
}
/**
 * Set the energy of a molecule when the energy input value is changed.
 * @param input The input element.
 */
function setEnergy(input) {
  var id_energy = input.id;
  var moleculeID = id_energy.split("_")[0];
  var molecule = molecules.get(moleculeID);
  if (molecule != undefined) {
    var inputValue = parseFloat(input.value);
    if (!isNaN(inputValue)) {
      molecule.setEnergy(inputValue);
      console.log("Energy of " + moleculeID + " set to " + inputValue);
    } else {
      alert("Energy input for " + moleculeID + " is not a number");
      var _inputElement2 = document.getElementById(id_energy);
      _inputElement2.value = molecule.getEnergy().toString();
    }
    //console.log("molecule=" + molecule);
  }
}
exports.setEnergy = setEnergy;
window.setEnergy = setEnergy;
/**
 * Save to XML file.
 */
window.saveXML = function () {
  console.log("saveXML");
  var pad = "  ";
  var level;
  var padding2 = pad.repeat(2);
  // Create me.title.
  var title_xml = "\n" + pad + (0, xml_js_1.getTag)(title, "me:title");
  // Create moleculeList.
  level = 2;
  var moleculeList = "";
  molecules.forEach(function (molecule, id) {
    moleculeList += molecule.toXML("molecule", pad, level);
  });
  moleculeList = (0, xml_js_1.getTag)(moleculeList, "moleculeList", undefined, undefined, undefined, pad, true);
  // Create reactionList.
  level = 2;
  var reactionList = "";
  reactions.forEach(function (reaction, id) {
    reactionList += reaction.toXML("reaction", pad, level);
  });
  reactionList = (0, xml_js_1.getTag)(reactionList, "reactionList", undefined, undefined, undefined, pad, true);
  // Create me.Conditions
  var xml_conditions = conditions.toXML(pad, pad);
  // Create modelParameters
  var xml_modelParameters = modelParameters.toXML(pad, pad);
  // create me.control
  var xml_control = control.toXML(pad, pad);
  // Create a new Blob object from the data
  var blob = new Blob([header, mesmerStartTag, title_xml, moleculeList, reactionList, xml_conditions, xml_modelParameters, xml_control, mesmerEndTag], {
    type: "text/plain"
  });
  // Create a new object URL for the blob
  var url = URL.createObjectURL(blob);
  // Create a new 'a' element
  var a = document.createElement("a");
  // Set the href and download attributes for the 'a' element
  a.href = url;
  a.download = input_xml_filename; // Replace with your desired filename
  // Append the 'a' element to the body and click it to start the download
  document.body.appendChild(a);
  a.click();
  // Remove the 'a' element after the download starts
  document.body.removeChild(a);
};
},{"./util.js":"../dist/client/cjm/util.js","./xml.js":"../dist/client/cjm/xml.js","./molecule.js":"../dist/client/cjm/molecule.js","./reaction.js":"../dist/client/cjm/reaction.js","./functions.js":"../dist/client/cjm/functions.js","./html.js":"../dist/client/cjm/html.js","./canvas.js":"../dist/client/cjm/canvas.js","./classes.js":"../dist/client/cjm/classes.js","./conditions.js":"../dist/client/cjm/conditions.js","./modelParameters.js":"../dist/client/cjm/modelParameters.js","./control.js":"../dist/client/cjm/control.js","./../../../sw.js":[["__/sw.js","../sw.js"],"__/sw.js.map","../sw.js"]}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "37283" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../dist/client/cjm/client.js"], null)
//# sourceMappingURL=/client.86305d73.js.map