/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(44)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssridKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class BrowserHelpers{

    static addEvent (object, type, callback) {
        if (object === null || typeof(object) === 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on"+type] = callback;
        }
    }

    static formatMoneyNumber(n, decimals=0) {

        n = parseInt(n);

        let number = parseInt(n/WebDollar.Applications.CoinsHelper.WEBD);
        let decimalNumber = BrowserHelpers._getNumberRest(n);

        if(number<100) decimals=4;
        if(number>99999) decimals=0;

        if(decimals===0) return BrowserHelpers._formatIntNumber(number);
        return BrowserHelpers._formatIntNumber(number)+'.'+BrowserHelpers._getFirstDigits(decimalNumber,decimals);
    }

    static _formatIntNumber(number){

        return number.toString().replace(/./g, function(c, i, a) {
            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });

    }

    static _getNumberRest(number){

        return number % WebDollar.Applications.CoinsHelper.WEBD;

    }

    static _getFirstDigits(number,decimals){

        let decimalsVerifier = Math.pow(10,decimals);
        let newNumber = '';

        if(number<10){

            newNumber='000'+number.toString();

        }else if(number<100){

            newNumber='00'+number.toString();

        }else if(number<1000){

            newNumber='0'+number.toString();

        }else if(number<10000){

            newNumber=''+number.toString();

        }

        return newNumber.substring(0,decimals);

    }


}

/* harmony default export */ __webpack_exports__["a"] = (BrowserHelpers);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Vue=e()}(this,function(){"use strict";function t(t){return void 0===t||null===t}function e(t){return void 0!==t&&null!==t}function n(t){return!0===t}function r(t){return"string"==typeof t||"number"==typeof t||"symbol"==typeof t||"boolean"==typeof t}function i(t){return null!==t&&"object"==typeof t}function o(t){return"[object Object]"===Nn.call(t)}function a(t){var e=parseFloat(String(t));return e>=0&&Math.floor(e)===e&&isFinite(t)}function s(t){return null==t?"":"object"==typeof t?JSON.stringify(t,null,2):String(t)}function c(t){var e=parseFloat(t);return isNaN(e)?t:e}function u(t,e){for(var n=Object.create(null),r=t.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return e?function(t){return n[t.toLowerCase()]}:function(t){return n[t]}}function l(t,e){if(t.length){var n=t.indexOf(e);if(n>-1)return t.splice(n,1)}}function f(t,e){return Mn.call(t,e)}function p(t){var e=Object.create(null);return function(n){return e[n]||(e[n]=t(n))}}function d(t,e){function n(n){var r=arguments.length;return r?r>1?t.apply(e,arguments):t.call(e,n):t.call(e)}return n._length=t.length,n}function v(t,e){e=e||0;for(var n=t.length-e,r=new Array(n);n--;)r[n]=t[n+e];return r}function h(t,e){for(var n in e)t[n]=e[n];return t}function m(t){for(var e={},n=0;n<t.length;n++)t[n]&&h(e,t[n]);return e}function y(t,e,n){}function g(t,e){if(t===e)return!0;var n=i(t),r=i(e);if(!n||!r)return!n&&!r&&String(t)===String(e);try{var o=Array.isArray(t),a=Array.isArray(e);if(o&&a)return t.length===e.length&&t.every(function(t,n){return g(t,e[n])});if(o||a)return!1;var s=Object.keys(t),c=Object.keys(e);return s.length===c.length&&s.every(function(n){return g(t[n],e[n])})}catch(t){return!1}}function _(t,e){for(var n=0;n<t.length;n++)if(g(t[n],e))return n;return-1}function b(t){var e=!1;return function(){e||(e=!0,t.apply(this,arguments))}}function $(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function C(t,e,n,r){Object.defineProperty(t,e,{value:n,enumerable:!!r,writable:!0,configurable:!0})}function w(t){return"function"==typeof t&&/native code/.test(t.toString())}function x(t){return new mr(void 0,void 0,void 0,String(t))}function k(t,e){var n=t.componentOptions,r=new mr(t.tag,t.data,t.children,t.text,t.elm,t.context,n,t.asyncFactory);return r.ns=t.ns,r.isStatic=t.isStatic,r.key=t.key,r.isComment=t.isComment,r.fnContext=t.fnContext,r.fnOptions=t.fnOptions,r.fnScopeId=t.fnScopeId,r.isCloned=!0,e&&(t.children&&(r.children=A(t.children,!0)),n&&n.children&&(n.children=A(n.children,!0))),r}function A(t,e){for(var n=t.length,r=new Array(n),i=0;i<n;i++)r[i]=k(t[i],e);return r}function O(t,e,n){t.__proto__=e}function S(t,e,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];C(t,o,e[o])}}function T(t,e){if(i(t)&&!(t instanceof mr)){var n;return f(t,"__ob__")&&t.__ob__ instanceof wr?n=t.__ob__:Cr.shouldConvert&&!ur()&&(Array.isArray(t)||o(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new wr(t)),e&&n&&n.vmCount++,n}}function E(t,e,n,r,i){var o=new vr,a=Object.getOwnPropertyDescriptor(t,e);if(!a||!1!==a.configurable){var s=a&&a.get,c=a&&a.set,u=!i&&T(n);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):n;return vr.target&&(o.depend(),u&&(u.dep.depend(),Array.isArray(e)&&I(e))),e},set:function(e){var r=s?s.call(t):n;e===r||e!=e&&r!=r||(c?c.call(t,e):n=e,u=!i&&T(e),o.notify())}})}}function j(t,e,n){if(Array.isArray(t)&&a(e))return t.length=Math.max(t.length,e),t.splice(e,1,n),n;if(e in t&&!(e in Object.prototype))return t[e]=n,n;var r=t.__ob__;return t._isVue||r&&r.vmCount?n:r?(E(r.value,e,n),r.dep.notify(),n):(t[e]=n,n)}function N(t,e){if(Array.isArray(t)&&a(e))t.splice(e,1);else{var n=t.__ob__;t._isVue||n&&n.vmCount||f(t,e)&&(delete t[e],n&&n.dep.notify())}}function I(t){for(var e=void 0,n=0,r=t.length;n<r;n++)(e=t[n])&&e.__ob__&&e.__ob__.dep.depend(),Array.isArray(e)&&I(e)}function L(t,e){if(!e)return t;for(var n,r,i,a=Object.keys(e),s=0;s<a.length;s++)r=t[n=a[s]],i=e[n],f(t,n)?o(r)&&o(i)&&L(r,i):j(t,n,i);return t}function M(t,e,n){return n?function(){var r="function"==typeof e?e.call(n,n):e,i="function"==typeof t?t.call(n,n):t;return r?L(r,i):i}:e?t?function(){return L("function"==typeof e?e.call(this,this):e,"function"==typeof t?t.call(this,this):t)}:e:t}function D(t,e){return e?t?t.concat(e):Array.isArray(e)?e:[e]:t}function P(t,e,n,r){var i=Object.create(t||null);return e?h(i,e):i}function F(t,e,n){function r(r){var i=xr[r]||Or;u[r]=i(t[r],e[r],n,r)}"function"==typeof e&&(e=e.options),function(t,e){var n=t.props;if(n){var r,i,a={};if(Array.isArray(n))for(r=n.length;r--;)"string"==typeof(i=n[r])&&(a[Pn(i)]={type:null});else if(o(n))for(var s in n)i=n[s],a[Pn(s)]=o(i)?i:{type:i};t.props=a}}(e),function(t,e){var n=t.inject;if(n){var r=t.inject={};if(Array.isArray(n))for(var i=0;i<n.length;i++)r[n[i]]={from:n[i]};else if(o(n))for(var a in n){var s=n[a];r[a]=o(s)?h({from:a},s):{from:s}}}}(e),function(t){var e=t.directives;if(e)for(var n in e){var r=e[n];"function"==typeof r&&(e[n]={bind:r,update:r})}}(e);var i=e.extends;if(i&&(t=F(t,i,n)),e.mixins)for(var a=0,s=e.mixins.length;a<s;a++)t=F(t,e.mixins[a],n);var c,u={};for(c in t)r(c);for(c in e)f(t,c)||r(c);return u}function R(t,e,n,r){if("string"==typeof n){var i=t[e];if(f(i,n))return i[n];var o=Pn(n);if(f(i,o))return i[o];var a=Fn(o);if(f(i,a))return i[a];return i[n]||i[o]||i[a]}}function H(t,e,n,r){var i=e[t],o=!f(n,t),a=n[t];if(U(Boolean,i.type)&&(o&&!f(i,"default")?a=!1:U(String,i.type)||""!==a&&a!==Hn(t)||(a=!0)),void 0===a){a=function(t,e,n){if(!f(e,"default"))return;var r=e.default;if(t&&t.$options.propsData&&void 0===t.$options.propsData[n]&&void 0!==t._props[n])return t._props[n];return"function"==typeof r&&"Function"!==B(e.type)?r.call(t):r}(r,i,t);var s=Cr.shouldConvert;Cr.shouldConvert=!0,T(a),Cr.shouldConvert=s}return a}function B(t){var e=t&&t.toString().match(/^\s*function (\w+)/);return e?e[1]:""}function U(t,e){if(!Array.isArray(e))return B(e)===B(t);for(var n=0,r=e.length;n<r;n++)if(B(e[n])===B(t))return!0;return!1}function V(t,e,n){if(e)for(var r=e;r=r.$parent;){var i=r.$options.errorCaptured;if(i)for(var o=0;o<i.length;o++)try{if(!1===i[o].call(r,t,e,n))return}catch(t){z(t,r,"errorCaptured hook")}}z(t,e,n)}function z(t,e,n){if(Jn.errorHandler)try{return Jn.errorHandler.call(null,t,e,n)}catch(t){K(t,null,"config.errorHandler")}K(t,e,n)}function K(t,e,n){if(!Gn&&!Zn||"undefined"==typeof console)throw t;console.error(t)}function J(){Tr=!1;var t=Sr.slice(0);Sr.length=0;for(var e=0;e<t.length;e++)t[e]()}function q(t,e){var n;if(Sr.push(function(){if(t)try{t.call(e)}catch(t){V(t,e,"nextTick")}else n&&n(e)}),Tr||(Tr=!0,Er?Ar():kr()),!t&&"undefined"!=typeof Promise)return new Promise(function(t){n=t})}function W(t){G(t,Mr),Mr.clear()}function G(t,e){var n,r,o=Array.isArray(t);if((o||i(t))&&!Object.isFrozen(t)){if(t.__ob__){var a=t.__ob__.dep.id;if(e.has(a))return;e.add(a)}if(o)for(n=t.length;n--;)G(t[n],e);else for(n=(r=Object.keys(t)).length;n--;)G(t[r[n]],e)}}function Z(t){function e(){var t=arguments,n=e.fns;if(!Array.isArray(n))return n.apply(null,arguments);for(var r=n.slice(),i=0;i<r.length;i++)r[i].apply(null,t)}return e.fns=t,e}function X(e,n,r,i,o){var a,s,c,u;for(a in e)s=e[a],c=n[a],u=Dr(a),t(s)||(t(c)?(t(s.fns)&&(s=e[a]=Z(s)),r(u.name,s,u.once,u.capture,u.passive,u.params)):s!==c&&(c.fns=s,e[a]=c));for(a in n)t(e[a])&&i((u=Dr(a)).name,n[a],u.capture)}function Y(r,i,o){function a(){o.apply(this,arguments),l(s.fns,a)}r instanceof mr&&(r=r.data.hook||(r.data.hook={}));var s,c=r[i];t(c)?s=Z([a]):e(c.fns)&&n(c.merged)?(s=c).fns.push(a):s=Z([c,a]),s.merged=!0,r[i]=s}function Q(t,n,r,i,o){if(e(n)){if(f(n,r))return t[r]=n[r],o||delete n[r],!0;if(f(n,i))return t[r]=n[i],o||delete n[i],!0}return!1}function tt(t){return e(t)&&e(t.text)&&function(t){return!1===t}(t.isComment)}function et(i,o){var a,s,c,u,l=[];for(a=0;a<i.length;a++)t(s=i[a])||"boolean"==typeof s||(u=l[c=l.length-1],Array.isArray(s)?s.length>0&&(tt((s=et(s,(o||"")+"_"+a))[0])&&tt(u)&&(l[c]=x(u.text+s[0].text),s.shift()),l.push.apply(l,s)):r(s)?tt(u)?l[c]=x(u.text+s):""!==s&&l.push(x(s)):tt(s)&&tt(u)?l[c]=x(u.text+s.text):(n(i._isVList)&&e(s.tag)&&t(s.key)&&e(o)&&(s.key="__vlist"+o+"_"+a+"__"),l.push(s)));return l}function nt(t,e){return(t.__esModule||fr&&"Module"===t[Symbol.toStringTag])&&(t=t.default),i(t)?e.extend(t):t}function rt(t){return t.isComment&&t.asyncFactory}function it(t){if(Array.isArray(t))for(var n=0;n<t.length;n++){var r=t[n];if(e(r)&&(e(r.componentOptions)||rt(r)))return r}}function ot(t,e,n){n?Lr.$once(t,e):Lr.$on(t,e)}function at(t,e){Lr.$off(t,e)}function st(t,e,n){Lr=t,X(e,n||{},ot,at),Lr=void 0}function ct(t,e){var n={};if(!t)return n;for(var r=0,i=t.length;r<i;r++){var o=t[r],a=o.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot,o.context!==e&&o.fnContext!==e||!a||null==a.slot)(n.default||(n.default=[])).push(o);else{var s=a.slot,c=n[s]||(n[s]=[]);"template"===o.tag?c.push.apply(c,o.children||[]):c.push(o)}}for(var u in n)n[u].every(ut)&&delete n[u];return n}function ut(t){return t.isComment&&!t.asyncFactory||" "===t.text}function lt(t,e){e=e||{};for(var n=0;n<t.length;n++)Array.isArray(t[n])?lt(t[n],e):e[t[n].key]=t[n].fn;return e}function ft(t){for(;t&&(t=t.$parent);)if(t._inactive)return!0;return!1}function pt(t,e){if(e){if(t._directInactive=!1,ft(t))return}else if(t._directInactive)return;if(t._inactive||null===t._inactive){t._inactive=!1;for(var n=0;n<t.$children.length;n++)pt(t.$children[n]);vt(t,"activated")}}function dt(t,e){if(!(e&&(t._directInactive=!0,ft(t))||t._inactive)){t._inactive=!0;for(var n=0;n<t.$children.length;n++)dt(t.$children[n]);vt(t,"deactivated")}}function vt(t,e){var n=t.$options[e];if(n)for(var r=0,i=n.length;r<i;r++)try{n[r].call(t)}catch(n){V(n,t,e+" hook")}t._hasHookEvent&&t.$emit("hook:"+e)}function ht(){Ur=!0;var t,e;for(Fr.sort(function(t,e){return t.id-e.id}),Vr=0;Vr<Fr.length;Vr++)e=(t=Fr[Vr]).id,Hr[e]=null,t.run();var n=Rr.slice(),r=Fr.slice();Vr=Fr.length=Rr.length=0,Hr={},Br=Ur=!1,function(t){for(var e=0;e<t.length;e++)t[e]._inactive=!0,pt(t[e],!0)}(n),function(t){var e=t.length;for(;e--;){var n=t[e],r=n.vm;r._watcher===n&&r._isMounted&&vt(r,"updated")}}(r),lr&&Jn.devtools&&lr.emit("flush")}function mt(t,e,n){Jr.get=function(){return this[e][n]},Jr.set=function(t){this[e][n]=t},Object.defineProperty(t,n,Jr)}function yt(t){t._watchers=[];var e=t.$options;e.props&&function(t,e){var n=t.$options.propsData||{},r=t._props={},i=t.$options._propKeys=[],o=!t.$parent;Cr.shouldConvert=o;var a=function(o){i.push(o);var a=H(o,e,n,t);E(r,o,a),o in t||mt(t,"_props",o)};for(var s in e)a(s);Cr.shouldConvert=!0}(t,e.props),e.methods&&function(t,e){t.$options.props;for(var n in e)t[n]=null==e[n]?y:d(e[n],t)}(t,e.methods),e.data?function(t){var e=t.$options.data;e=t._data="function"==typeof e?function(t,e){try{return t.call(e,e)}catch(t){return V(t,e,"data()"),{}}}(e,t):e||{},o(e)||(e={});var n=Object.keys(e),r=t.$options.props,i=(t.$options.methods,n.length);for(;i--;){var a=n[i];r&&f(r,a)||$(a)||mt(t,"_data",a)}T(e,!0)}(t):T(t._data={},!0),e.computed&&function(t,e){var n=t._computedWatchers=Object.create(null),r=ur();for(var i in e){var o=e[i],a="function"==typeof o?o:o.get;r||(n[i]=new Kr(t,a||y,y,qr)),i in t||gt(t,i,o)}}(t,e.computed),e.watch&&e.watch!==ir&&function(t,e){for(var n in e){var r=e[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)bt(t,n,r[i]);else bt(t,n,r)}}(t,e.watch)}function gt(t,e,n){var r=!ur();"function"==typeof n?(Jr.get=r?_t(e):n,Jr.set=y):(Jr.get=n.get?r&&!1!==n.cache?_t(e):n.get:y,Jr.set=n.set?n.set:y),Object.defineProperty(t,e,Jr)}function _t(t){return function(){var e=this._computedWatchers&&this._computedWatchers[t];if(e)return e.dirty&&e.evaluate(),vr.target&&e.depend(),e.value}}function bt(t,e,n,r){return o(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=t[n]),t.$watch(e,n,r)}function $t(t,e){if(t){for(var n=Object.create(null),r=fr?Reflect.ownKeys(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}):Object.keys(t),i=0;i<r.length;i++){for(var o=r[i],a=t[o].from,s=e;s;){if(s._provided&&a in s._provided){n[o]=s._provided[a];break}s=s.$parent}if(!s&&"default"in t[o]){var c=t[o].default;n[o]="function"==typeof c?c.call(e):c}}return n}}function Ct(t,n){var r,o,a,s,c;if(Array.isArray(t)||"string"==typeof t)for(r=new Array(t.length),o=0,a=t.length;o<a;o++)r[o]=n(t[o],o);else if("number"==typeof t)for(r=new Array(t),o=0;o<t;o++)r[o]=n(o+1,o);else if(i(t))for(s=Object.keys(t),r=new Array(s.length),o=0,a=s.length;o<a;o++)c=s[o],r[o]=n(t[c],c,o);return e(r)&&(r._isVList=!0),r}function wt(t,e,n,r){var i,o=this.$scopedSlots[t];if(o)n=n||{},r&&(n=h(h({},r),n)),i=o(n)||e;else{var a=this.$slots[t];a&&(a._rendered=!0),i=a||e}var s=n&&n.slot;return s?this.$createElement("template",{slot:s},i):i}function xt(t){return R(this.$options,"filters",t)||Un}function kt(t,e,n,r){var i=Jn.keyCodes[e]||n;return i?Array.isArray(i)?-1===i.indexOf(t):i!==t:r?Hn(r)!==e:void 0}function At(t,e,n,r,o){if(n)if(i(n)){Array.isArray(n)&&(n=m(n));var a,s=function(i){if("class"===i||"style"===i||Ln(i))a=t;else{var s=t.attrs&&t.attrs.type;a=r||Jn.mustUseProp(e,s,i)?t.domProps||(t.domProps={}):t.attrs||(t.attrs={})}if(!(i in a)&&(a[i]=n[i],o)){(t.on||(t.on={}))["update:"+i]=function(t){n[i]=t}}};for(var c in n)s(c)}else;return t}function Ot(t,e){var n=this._staticTrees||(this._staticTrees=[]),r=n[t];return r&&!e?Array.isArray(r)?A(r):k(r):(r=n[t]=this.$options.staticRenderFns[t].call(this._renderProxy,null,this),Tt(r,"__static__"+t,!1),r)}function St(t,e,n){return Tt(t,"__once__"+e+(n?"_"+n:""),!0),t}function Tt(t,e,n){if(Array.isArray(t))for(var r=0;r<t.length;r++)t[r]&&"string"!=typeof t[r]&&Et(t[r],e+"_"+r,n);else Et(t,e,n)}function Et(t,e,n){t.isStatic=!0,t.key=e,t.isOnce=n}function jt(t,e){if(e)if(o(e)){var n=t.on=t.on?h({},t.on):{};for(var r in e){var i=n[r],a=e[r];n[r]=i?[].concat(i,a):a}}else;return t}function Nt(t){t._o=St,t._n=c,t._s=s,t._l=Ct,t._t=wt,t._q=g,t._i=_,t._m=Ot,t._f=xt,t._k=kt,t._b=At,t._v=x,t._e=gr,t._u=lt,t._g=jt}function It(t,e,r,i,o){var a=o.options;this.data=t,this.props=e,this.children=r,this.parent=i,this.listeners=t.on||jn,this.injections=$t(a.inject,i),this.slots=function(){return ct(r,i)};var s=Object.create(i),c=n(a._compiled),u=!c;c&&(this.$options=a,this.$slots=this.slots(),this.$scopedSlots=t.scopedSlots||jn),a._scopeId?this._c=function(t,e,n,r){var o=Dt(s,t,e,n,r,u);return o&&(o.fnScopeId=a._scopeId,o.fnContext=i),o}:this._c=function(t,e,n,r){return Dt(s,t,e,n,r,u)}}function Lt(t,e){for(var n in e)t[Pn(n)]=e[n]}function Mt(r,o,a,s,c){if(!t(r)){var u=a.$options._base;if(i(r)&&(r=u.extend(r)),"function"==typeof r){var l;if(t(r.cid)&&(l=r,void 0===(r=function(r,o,a){if(n(r.error)&&e(r.errorComp))return r.errorComp;if(e(r.resolved))return r.resolved;if(n(r.loading)&&e(r.loadingComp))return r.loadingComp;if(!e(r.contexts)){var s=r.contexts=[a],c=!0,u=function(){for(var t=0,e=s.length;t<e;t++)s[t].$forceUpdate()},l=b(function(t){r.resolved=nt(t,o),c||u()}),f=b(function(t){e(r.errorComp)&&(r.error=!0,u())}),p=r(l,f);return i(p)&&("function"==typeof p.then?t(r.resolved)&&p.then(l,f):e(p.component)&&"function"==typeof p.component.then&&(p.component.then(l,f),e(p.error)&&(r.errorComp=nt(p.error,o)),e(p.loading)&&(r.loadingComp=nt(p.loading,o),0===p.delay?r.loading=!0:setTimeout(function(){t(r.resolved)&&t(r.error)&&(r.loading=!0,u())},p.delay||200)),e(p.timeout)&&setTimeout(function(){t(r.resolved)&&f(null)},p.timeout))),c=!1,r.loading?r.loadingComp:r.resolved}r.contexts.push(a)}(l,u,a))))return function(t,e,n,r,i){var o=gr();return o.asyncFactory=t,o.asyncMeta={data:e,context:n,children:r,tag:i},o}(l,o,a,s,c);o=o||{},Ft(r),e(o.model)&&function(t,n){var r=t.model&&t.model.prop||"value",i=t.model&&t.model.event||"input";(n.props||(n.props={}))[r]=n.model.value;var o=n.on||(n.on={});e(o[i])?o[i]=[n.model.callback].concat(o[i]):o[i]=n.model.callback}(r.options,o);var f=function(n,r,i){var o=r.options.props;if(!t(o)){var a={},s=n.attrs,c=n.props;if(e(s)||e(c))for(var u in o){var l=Hn(u);Q(a,c,u,l,!0)||Q(a,s,u,l,!1)}return a}}(o,r);if(n(r.options.functional))return function(t,n,r,i,o){var a=t.options,s={},c=a.props;if(e(c))for(var u in c)s[u]=H(u,c,n||jn);else e(r.attrs)&&Lt(s,r.attrs),e(r.props)&&Lt(s,r.props);var l=new It(r,s,o,i,t),f=a.render.call(null,l._c,l);return f instanceof mr&&(f.fnContext=i,f.fnOptions=a,r.slot&&((f.data||(f.data={})).slot=r.slot)),f}(r,f,o,a,s);var p=o.on;if(o.on=o.nativeOn,n(r.options.abstract)){var d=o.slot;o={},d&&(o.slot=d)}!function(t){t.hook||(t.hook={});for(var e=0;e<Gr.length;e++){var n=Gr[e],r=t.hook[n],i=Wr[n];t.hook[n]=r?function(t,e){return function(n,r,i,o){t(n,r,i,o),e(n,r,i,o)}}(i,r):i}}(o);var v=r.options.name||c;return new mr("vue-component-"+r.cid+(v?"-"+v:""),o,void 0,void 0,void 0,a,{Ctor:r,propsData:f,listeners:p,tag:c,children:s},l)}}}function Dt(t,i,o,a,s,c){return(Array.isArray(o)||r(o))&&(s=a,a=o,o=void 0),n(c)&&(s=Xr),function(t,n,i,o,a){if(e(i)&&e(i.__ob__))return gr();e(i)&&e(i.is)&&(n=i.is);if(!n)return gr();Array.isArray(o)&&"function"==typeof o[0]&&((i=i||{}).scopedSlots={default:o[0]},o.length=0);a===Xr?o=function(t){return r(t)?[x(t)]:Array.isArray(t)?et(t):void 0}(o):a===Zr&&(o=function(t){for(var e=0;e<t.length;e++)if(Array.isArray(t[e]))return Array.prototype.concat.apply([],t);return t}(o));var s,c;if("string"==typeof n){var u;c=t.$vnode&&t.$vnode.ns||Jn.getTagNamespace(n),s=Jn.isReservedTag(n)?new mr(Jn.parsePlatformTagName(n),i,o,void 0,void 0,t):e(u=R(t.$options,"components",n))?Mt(u,i,t,o,n):new mr(n,i,o,void 0,void 0,t)}else s=Mt(n,i,t,o);return e(s)?(c&&Pt(s,c),s):gr()}(t,i,o,a,s)}function Pt(r,i,o){if(r.ns=i,"foreignObject"===r.tag&&(i=void 0,o=!0),e(r.children))for(var a=0,s=r.children.length;a<s;a++){var c=r.children[a];e(c.tag)&&(t(c.ns)||n(o))&&Pt(c,i,o)}}function Ft(t){var e=t.options;if(t.super){var n=Ft(t.super);if(n!==t.superOptions){t.superOptions=n;var r=function(t){var e,n=t.options,r=t.extendOptions,i=t.sealedOptions;for(var o in n)n[o]!==i[o]&&(e||(e={}),e[o]=function(t,e,n){{if(Array.isArray(t)){var r=[];n=Array.isArray(n)?n:[n],e=Array.isArray(e)?e:[e];for(var i=0;i<t.length;i++)(e.indexOf(t[i])>=0||n.indexOf(t[i])<0)&&r.push(t[i]);return r}return t}}(n[o],r[o],i[o]));return e}(t);r&&h(t.extendOptions,r),(e=t.options=F(n,t.extendOptions)).name&&(e.components[e.name]=t)}}return e}function Rt(t){this._init(t)}function Ht(t){t.cid=0;var e=1;t.extend=function(t){t=t||{};var n=this,r=n.cid,i=t._Ctor||(t._Ctor={});if(i[r])return i[r];var o=t.name||n.options.name,a=function(t){this._init(t)};return a.prototype=Object.create(n.prototype),a.prototype.constructor=a,a.cid=e++,a.options=F(n.options,t),a.super=n,a.options.props&&function(t){var e=t.options.props;for(var n in e)mt(t.prototype,"_props",n)}(a),a.options.computed&&function(t){var e=t.options.computed;for(var n in e)gt(t.prototype,n,e[n])}(a),a.extend=n.extend,a.mixin=n.mixin,a.use=n.use,zn.forEach(function(t){a[t]=n[t]}),o&&(a.options.components[o]=a),a.superOptions=n.options,a.extendOptions=t,a.sealedOptions=h({},a.options),i[r]=a,a}}function Bt(t){return t&&(t.Ctor.options.name||t.tag)}function Ut(t,e){return Array.isArray(t)?t.indexOf(e)>-1:"string"==typeof t?t.split(",").indexOf(e)>-1:!!function(t){return"[object RegExp]"===Nn.call(t)}(t)&&t.test(e)}function Vt(t,e){var n=t.cache,r=t.keys,i=t._vnode;for(var o in n){var a=n[o];if(a){var s=Bt(a.componentOptions);s&&!e(s)&&zt(n,o,r,i)}}}function zt(t,e,n,r){var i=t[e];!i||r&&i.tag===r.tag||i.componentInstance.$destroy(),t[e]=null,l(n,e)}function Kt(t){for(var n=t.data,r=t,i=t;e(i.componentInstance);)(i=i.componentInstance._vnode)&&i.data&&(n=Jt(i.data,n));for(;e(r=r.parent);)r&&r.data&&(n=Jt(n,r.data));return function(t,n){if(e(t)||e(n))return qt(t,Wt(n));return""}(n.staticClass,n.class)}function Jt(t,n){return{staticClass:qt(t.staticClass,n.staticClass),class:e(t.class)?[t.class,n.class]:n.class}}function qt(t,e){return t?e?t+" "+e:t:e||""}function Wt(t){return Array.isArray(t)?function(t){for(var n,r="",i=0,o=t.length;i<o;i++)e(n=Wt(t[i]))&&""!==n&&(r&&(r+=" "),r+=n);return r}(t):i(t)?function(t){var e="";for(var n in t)t[n]&&(e&&(e+=" "),e+=n);return e}(t):"string"==typeof t?t:""}function Gt(t){return bi(t)?"svg":"math"===t?"math":void 0}function Zt(t){if("string"==typeof t){var e=document.querySelector(t);return e||document.createElement("div")}return t}function Xt(t,e){var n=t.data.ref;if(n){var r=t.context,i=t.componentInstance||t.elm,o=r.$refs;e?Array.isArray(o[n])?l(o[n],i):o[n]===i&&(o[n]=void 0):t.data.refInFor?Array.isArray(o[n])?o[n].indexOf(i)<0&&o[n].push(i):o[n]=[i]:o[n]=i}}function Yt(r,i){return r.key===i.key&&(r.tag===i.tag&&r.isComment===i.isComment&&e(r.data)===e(i.data)&&function(t,n){if("input"!==t.tag)return!0;var r,i=e(r=t.data)&&e(r=r.attrs)&&r.type,o=e(r=n.data)&&e(r=r.attrs)&&r.type;return i===o||wi(i)&&wi(o)}(r,i)||n(r.isAsyncPlaceholder)&&r.asyncFactory===i.asyncFactory&&t(i.asyncFactory.error))}function Qt(t,n,r){var i,o,a={};for(i=n;i<=r;++i)e(o=t[i].key)&&(a[o]=i);return a}function te(t,e){(t.data.directives||e.data.directives)&&function(t,e){var n,r,i,o=t===Ai,a=e===Ai,s=ee(t.data.directives,t.context),c=ee(e.data.directives,e.context),u=[],l=[];for(n in c)r=s[n],i=c[n],r?(i.oldValue=r.value,ne(i,"update",e,t),i.def&&i.def.componentUpdated&&l.push(i)):(ne(i,"bind",e,t),i.def&&i.def.inserted&&u.push(i));if(u.length){var f=function(){for(var n=0;n<u.length;n++)ne(u[n],"inserted",e,t)};o?Y(e,"insert",f):f()}l.length&&Y(e,"postpatch",function(){for(var n=0;n<l.length;n++)ne(l[n],"componentUpdated",e,t)});if(!o)for(n in s)c[n]||ne(s[n],"unbind",t,t,a)}(t,e)}function ee(t,e){var n=Object.create(null);if(!t)return n;var r,i;for(r=0;r<t.length;r++)(i=t[r]).modifiers||(i.modifiers=Ti),n[function(t){return t.rawName||t.name+"."+Object.keys(t.modifiers||{}).join(".")}(i)]=i,i.def=R(e.$options,"directives",i.name);return n}function ne(t,e,n,r,i){var o=t.def&&t.def[e];if(o)try{o(n.elm,t,n,r,i)}catch(r){V(r,n.context,"directive "+t.name+" "+e+" hook")}}function re(n,r){var i=r.componentOptions;if(!(e(i)&&!1===i.Ctor.options.inheritAttrs||t(n.data.attrs)&&t(r.data.attrs))){var o,a,s=r.elm,c=n.data.attrs||{},u=r.data.attrs||{};e(u.__ob__)&&(u=r.data.attrs=h({},u));for(o in u)a=u[o],c[o]!==a&&ie(s,o,a);(Qn||er)&&u.value!==c.value&&ie(s,"value",u.value);for(o in c)t(u[o])&&(hi(o)?s.removeAttributeNS(vi,mi(o)):pi(o)||s.removeAttribute(o))}}function ie(t,e,n){if(di(e))yi(n)?t.removeAttribute(e):(n="allowfullscreen"===e&&"EMBED"===t.tagName?"true":e,t.setAttribute(e,n));else if(pi(e))t.setAttribute(e,yi(n)||"false"===n?"false":"true");else if(hi(e))yi(n)?t.removeAttributeNS(vi,mi(e)):t.setAttributeNS(vi,e,n);else if(yi(n))t.removeAttribute(e);else{if(Qn&&!tr&&"TEXTAREA"===t.tagName&&"placeholder"===e&&!t.__ieph){var r=function(e){e.stopImmediatePropagation(),t.removeEventListener("input",r)};t.addEventListener("input",r),t.__ieph=!0}t.setAttribute(e,n)}}function oe(n,r){var i=r.elm,o=r.data,a=n.data;if(!(t(o.staticClass)&&t(o.class)&&(t(a)||t(a.staticClass)&&t(a.class)))){var s=Kt(r),c=i._transitionClasses;e(c)&&(s=qt(s,Wt(c))),s!==i._prevClass&&(i.setAttribute("class",s),i._prevClass=s)}}function ae(t){function e(){(a||(a=[])).push(t.slice(v,i).trim()),v=i+1}var n,r,i,o,a,s=!1,c=!1,u=!1,l=!1,f=0,p=0,d=0,v=0;for(i=0;i<t.length;i++)if(r=n,n=t.charCodeAt(i),s)39===n&&92!==r&&(s=!1);else if(c)34===n&&92!==r&&(c=!1);else if(u)96===n&&92!==r&&(u=!1);else if(l)47===n&&92!==r&&(l=!1);else if(124!==n||124===t.charCodeAt(i+1)||124===t.charCodeAt(i-1)||f||p||d){switch(n){case 34:c=!0;break;case 39:s=!0;break;case 96:u=!0;break;case 40:d++;break;case 41:d--;break;case 91:p++;break;case 93:p--;break;case 123:f++;break;case 125:f--}if(47===n){for(var h=i-1,m=void 0;h>=0&&" "===(m=t.charAt(h));h--);m&&Ii.test(m)||(l=!0)}}else void 0===o?(v=i+1,o=t.slice(0,i).trim()):e();if(void 0===o?o=t.slice(0,i).trim():0!==v&&e(),a)for(i=0;i<a.length;i++)o=function(t,e){var n=e.indexOf("(");{if(n<0)return'_f("'+e+'")('+t+")";var r=e.slice(0,n),i=e.slice(n+1);return'_f("'+r+'")('+t+","+i}}(o,a[i]);return o}function se(t){console.error("[Vue compiler]: "+t)}function ce(t,e){return t?t.map(function(t){return t[e]}).filter(function(t){return t}):[]}function ue(t,e,n){(t.props||(t.props=[])).push({name:e,value:n}),t.plain=!1}function le(t,e,n){(t.attrs||(t.attrs=[])).push({name:e,value:n}),t.plain=!1}function fe(t,e,n){t.attrsMap[e]=n,t.attrsList.push({name:e,value:n})}function pe(t,e,n,r,i,o){(t.directives||(t.directives=[])).push({name:e,rawName:n,value:r,arg:i,modifiers:o}),t.plain=!1}function de(t,e,n,r,i,o){(r=r||jn).capture&&(delete r.capture,e="!"+e),r.once&&(delete r.once,e="~"+e),r.passive&&(delete r.passive,e="&"+e),"click"===e&&(r.right?(e="contextmenu",delete r.right):r.middle&&(e="mouseup"));var a;r.native?(delete r.native,a=t.nativeEvents||(t.nativeEvents={})):a=t.events||(t.events={});var s={value:n};r!==jn&&(s.modifiers=r);var c=a[e];Array.isArray(c)?i?c.unshift(s):c.push(s):a[e]=c?i?[s,c]:[c,s]:s,t.plain=!1}function ve(t,e,n){var r=he(t,":"+e)||he(t,"v-bind:"+e);if(null!=r)return ae(r);if(!1!==n){var i=he(t,e);if(null!=i)return JSON.stringify(i)}}function he(t,e,n){var r;if(null!=(r=t.attrsMap[e]))for(var i=t.attrsList,o=0,a=i.length;o<a;o++)if(i[o].name===e){i.splice(o,1);break}return n&&delete t.attrsMap[e],r}function me(t,e,n){var r=n||{},i="$$v";r.trim&&(i="(typeof $$v === 'string'? $$v.trim(): $$v)"),r.number&&(i="_n("+i+")");var o=ye(e,i);t.model={value:"("+e+")",expression:'"'+e+'"',callback:"function ($$v) {"+o+"}"}}function ye(t,e){var n=function(t){if(ei=t.length,t.indexOf("[")<0||t.lastIndexOf("]")<ei-1)return(ii=t.lastIndexOf("."))>-1?{exp:t.slice(0,ii),key:'"'+t.slice(ii+1)+'"'}:{exp:t,key:null};ni=t,ii=oi=ai=0;for(;!_e();)be(ri=ge())?$e(ri):91===ri&&function(t){var e=1;oi=ii;for(;!_e();)if(t=ge(),be(t))$e(t);else if(91===t&&e++,93===t&&e--,0===e){ai=ii;break}}(ri);return{exp:t.slice(0,oi),key:t.slice(oi+1,ai)}}(t);return null===n.key?t+"="+e:"$set("+n.exp+", "+n.key+", "+e+")"}function ge(){return ni.charCodeAt(++ii)}function _e(){return ii>=ei}function be(t){return 34===t||39===t}function $e(t){for(var e=t;!_e()&&(t=ge())!==e;);}function Ce(t,e,n,r,i){e=function(t){return t._withTask||(t._withTask=function(){Er=!0;var e=t.apply(null,arguments);return Er=!1,e})}(e),n&&(e=function(t,e,n){var r=si;return function i(){null!==t.apply(null,arguments)&&we(e,i,n,r)}}(e,t,r)),si.addEventListener(t,e,or?{capture:r,passive:i}:r)}function we(t,e,n,r){(r||si).removeEventListener(t,e._withTask||e,n)}function xe(n,r){if(!t(n.data.on)||!t(r.data.on)){var i=r.data.on||{},o=n.data.on||{};si=r.elm,function(t){if(e(t[Li])){var n=Qn?"change":"input";t[n]=[].concat(t[Li],t[n]||[]),delete t[Li]}e(t[Mi])&&(t.change=[].concat(t[Mi],t.change||[]),delete t[Mi])}(i),X(i,o,Ce,we,r.context),si=void 0}}function ke(n,r){if(!t(n.data.domProps)||!t(r.data.domProps)){var i,o,a=r.elm,s=n.data.domProps||{},u=r.data.domProps||{};e(u.__ob__)&&(u=r.data.domProps=h({},u));for(i in s)t(u[i])&&(a[i]="");for(i in u){if(o=u[i],"textContent"===i||"innerHTML"===i){if(r.children&&(r.children.length=0),o===s[i])continue;1===a.childNodes.length&&a.removeChild(a.childNodes[0])}if("value"===i){a._value=o;var l=t(o)?"":String(o);(function(t,n){return!t.composing&&("OPTION"===t.tagName||function(t,e){var n=!0;try{n=document.activeElement!==t}catch(t){}return n&&t.value!==e}(t,n)||function(t,n){var r=t.value,i=t._vModifiers;if(e(i)){if(i.lazy)return!1;if(i.number)return c(r)!==c(n);if(i.trim)return r.trim()!==n.trim()}return r!==n}(t,n))})(a,l)&&(a.value=l)}else a[i]=o}}}function Ae(t){var e=Oe(t.style);return t.staticStyle?h(t.staticStyle,e):e}function Oe(t){return Array.isArray(t)?m(t):"string"==typeof t?Fi(t):t}function Se(n,r){var i=r.data,o=n.data;if(!(t(i.staticStyle)&&t(i.style)&&t(o.staticStyle)&&t(o.style))){var a,s,c=r.elm,u=o.staticStyle,l=o.normalizedStyle||o.style||{},f=u||l,p=Oe(r.data.style)||{};r.data.normalizedStyle=e(p.__ob__)?h({},p):p;var d=function(t,e){var n,r={};if(e)for(var i=t;i.componentInstance;)(i=i.componentInstance._vnode)&&i.data&&(n=Ae(i.data))&&h(r,n);(n=Ae(t.data))&&h(r,n);for(var o=t;o=o.parent;)o.data&&(n=Ae(o.data))&&h(r,n);return r}(r,!0);for(s in f)t(d[s])&&Bi(c,s,"");for(s in d)(a=d[s])!==f[s]&&Bi(c,s,null==a?"":a)}}function Te(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(/\s+/).forEach(function(e){return t.classList.add(e)}):t.classList.add(e);else{var n=" "+(t.getAttribute("class")||"")+" ";n.indexOf(" "+e+" ")<0&&t.setAttribute("class",(n+e).trim())}}function Ee(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(/\s+/).forEach(function(e){return t.classList.remove(e)}):t.classList.remove(e),t.classList.length||t.removeAttribute("class");else{for(var n=" "+(t.getAttribute("class")||"")+" ",r=" "+e+" ";n.indexOf(r)>=0;)n=n.replace(r," ");(n=n.trim())?t.setAttribute("class",n):t.removeAttribute("class")}}function je(t){if(t){if("object"==typeof t){var e={};return!1!==t.css&&h(e,Ki(t.name||"v")),h(e,t),e}return"string"==typeof t?Ki(t):void 0}}function Ne(t){Qi(function(){Qi(t)})}function Ie(t,e){var n=t._transitionClasses||(t._transitionClasses=[]);n.indexOf(e)<0&&(n.push(e),Te(t,e))}function Le(t,e){t._transitionClasses&&l(t._transitionClasses,e),Ee(t,e)}function Me(t,e,n){var r=De(t,e),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s=i===qi?Zi:Yi,c=0,u=function(){t.removeEventListener(s,l),n()},l=function(e){e.target===t&&++c>=a&&u()};setTimeout(function(){c<a&&u()},o+1),t.addEventListener(s,l)}function De(t,e){var n,r=window.getComputedStyle(t),i=r[Gi+"Delay"].split(", "),o=r[Gi+"Duration"].split(", "),a=Pe(i,o),s=r[Xi+"Delay"].split(", "),c=r[Xi+"Duration"].split(", "),u=Pe(s,c),l=0,f=0;e===qi?a>0&&(n=qi,l=a,f=o.length):e===Wi?u>0&&(n=Wi,l=u,f=c.length):f=(n=(l=Math.max(a,u))>0?a>u?qi:Wi:null)?n===qi?o.length:c.length:0;return{type:n,timeout:l,propCount:f,hasTransform:n===qi&&to.test(r[Gi+"Property"])}}function Pe(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max.apply(null,e.map(function(e,n){return Fe(e)+Fe(t[n])}))}function Fe(t){return 1e3*Number(t.slice(0,-1))}function Re(n,r){var o=n.elm;e(o._leaveCb)&&(o._leaveCb.cancelled=!0,o._leaveCb());var a=je(n.data.transition);if(!t(a)&&!e(o._enterCb)&&1===o.nodeType){for(var s=a.css,u=a.type,l=a.enterClass,f=a.enterToClass,p=a.enterActiveClass,d=a.appearClass,v=a.appearToClass,h=a.appearActiveClass,m=a.beforeEnter,y=a.enter,g=a.afterEnter,_=a.enterCancelled,$=a.beforeAppear,C=a.appear,w=a.afterAppear,x=a.appearCancelled,k=a.duration,A=Pr,O=Pr.$vnode;O&&O.parent;)A=(O=O.parent).context;var S=!A._isMounted||!n.isRootInsert;if(!S||C||""===C){var T=S&&d?d:l,E=S&&h?h:p,j=S&&v?v:f,N=S?$||m:m,I=S&&"function"==typeof C?C:y,L=S?w||g:g,M=S?x||_:_,D=c(i(k)?k.enter:k),P=!1!==s&&!tr,F=Ue(I),R=o._enterCb=b(function(){P&&(Le(o,j),Le(o,E)),R.cancelled?(P&&Le(o,T),M&&M(o)):L&&L(o),o._enterCb=null});n.data.show||Y(n,"insert",function(){var t=o.parentNode,e=t&&t._pending&&t._pending[n.key];e&&e.tag===n.tag&&e.elm._leaveCb&&e.elm._leaveCb(),I&&I(o,R)}),N&&N(o),P&&(Ie(o,T),Ie(o,E),Ne(function(){Ie(o,j),Le(o,T),R.cancelled||F||(Be(D)?setTimeout(R,D):Me(o,u,R))})),n.data.show&&(r&&r(),I&&I(o,R)),P||F||R()}}}function He(n,r){function o(){x.cancelled||(n.data.show||((a.parentNode._pending||(a.parentNode._pending={}))[n.key]=n),v&&v(a),$&&(Ie(a,f),Ie(a,d),Ne(function(){Ie(a,p),Le(a,f),x.cancelled||C||(Be(w)?setTimeout(x,w):Me(a,l,x))})),h&&h(a,x),$||C||x())}var a=n.elm;e(a._enterCb)&&(a._enterCb.cancelled=!0,a._enterCb());var s=je(n.data.transition);if(t(s)||1!==a.nodeType)return r();if(!e(a._leaveCb)){var u=s.css,l=s.type,f=s.leaveClass,p=s.leaveToClass,d=s.leaveActiveClass,v=s.beforeLeave,h=s.leave,m=s.afterLeave,y=s.leaveCancelled,g=s.delayLeave,_=s.duration,$=!1!==u&&!tr,C=Ue(h),w=c(i(_)?_.leave:_),x=a._leaveCb=b(function(){a.parentNode&&a.parentNode._pending&&(a.parentNode._pending[n.key]=null),$&&(Le(a,p),Le(a,d)),x.cancelled?($&&Le(a,f),y&&y(a)):(r(),m&&m(a)),a._leaveCb=null});g?g(o):o()}}function Be(t){return"number"==typeof t&&!isNaN(t)}function Ue(n){if(t(n))return!1;var r=n.fns;return e(r)?Ue(Array.isArray(r)?r[0]:r):(n._length||n.length)>1}function Ve(t,e){!0!==e.data.show&&Re(e)}function ze(t,e,n){Ke(t,e,n),(Qn||er)&&setTimeout(function(){Ke(t,e,n)},0)}function Ke(t,e,n){var r=e.value,i=t.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=t.options.length;s<c;s++)if(a=t.options[s],i)o=_(r,qe(a))>-1,a.selected!==o&&(a.selected=o);else if(g(qe(a),r))return void(t.selectedIndex!==s&&(t.selectedIndex=s));i||(t.selectedIndex=-1)}}function Je(t,e){return e.every(function(e){return!g(e,t)})}function qe(t){return"_value"in t?t._value:t.value}function We(t){t.target.composing=!0}function Ge(t){t.target.composing&&(t.target.composing=!1,Ze(t.target,"input"))}function Ze(t,e){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}function Xe(t){return!t.componentInstance||t.data&&t.data.transition?t:Xe(t.componentInstance._vnode)}function Ye(t){var e=t&&t.componentOptions;return e&&e.Ctor.options.abstract?Ye(it(e.children)):t}function Qe(t){var e={},n=t.$options;for(var r in n.propsData)e[r]=t[r];var i=n._parentListeners;for(var o in i)e[Pn(o)]=i[o];return e}function tn(t,e){if(/\d-keep-alive$/.test(e.tag))return t("keep-alive",{props:e.componentOptions.propsData})}function en(t){t.elm._moveCb&&t.elm._moveCb(),t.elm._enterCb&&t.elm._enterCb()}function nn(t){t.data.newPos=t.elm.getBoundingClientRect()}function rn(t){var e=t.data.pos,n=t.data.newPos,r=e.left-n.left,i=e.top-n.top;if(r||i){t.data.moved=!0;var o=t.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)",o.transitionDuration="0s"}}function on(t,e){var n=e?zo:Vo;return t.replace(n,function(t){return Uo[t]})}function an(t,e,n){return{type:1,tag:t,attrsList:e,attrsMap:function(t){for(var e={},n=0,r=t.length;n<r;n++)e[t[n].name]=t[n].value;return e}(e),parent:n,children:[]}}function sn(t,e){function n(t){t.pre&&(s=!1),Lo(t.tag)&&(c=!1);for(var n=0;n<Io.length;n++)Io[n](t,e)}To=e.warn||se,Lo=e.isPreTag||Bn,Mo=e.mustUseProp||Bn,Do=e.getTagNamespace||Bn,jo=ce(e.modules,"transformNode"),No=ce(e.modules,"preTransformNode"),Io=ce(e.modules,"postTransformNode"),Eo=e.delimiters;var r,i,o=[],a=!1!==e.preserveWhitespace,s=!1,c=!1;return function(t,e){function n(e){l+=e,t=t.substring(e)}function r(t,n,r){var i,s;if(null==n&&(n=l),null==r&&(r=l),t&&(s=t.toLowerCase()),t)for(i=a.length-1;i>=0&&a[i].lowerCasedTag!==s;i--);else i=0;if(i>=0){for(var c=a.length-1;c>=i;c--)e.end&&e.end(a[c].tag,n,r);a.length=i,o=i&&a[i-1].tag}else"br"===s?e.start&&e.start(t,[],!0,n,r):"p"===s&&(e.start&&e.start(t,[],!1,n,r),e.end&&e.end(t,n,r))}for(var i,o,a=[],s=e.expectHTML,c=e.isUnaryTag||Bn,u=e.canBeLeftOpenTag||Bn,l=0;t;){if(i=t,o&&Ho(o)){var f=0,p=o.toLowerCase(),d=Bo[p]||(Bo[p]=new RegExp("([\\s\\S]*?)(</"+p+"[^>]*>)","i")),v=t.replace(d,function(t,n,r){return f=r.length,Ho(p)||"noscript"===p||(n=n.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),Jo(p,n)&&(n=n.slice(1)),e.chars&&e.chars(n),""});l+=t.length-v.length,t=v,r(p,l-f,l)}else{var h=t.indexOf("<");if(0===h){if(Ao.test(t)){var m=t.indexOf("--\x3e");if(m>=0){e.shouldKeepComment&&e.comment(t.substring(4,m)),n(m+3);continue}}if(Oo.test(t)){var y=t.indexOf("]>");if(y>=0){n(y+2);continue}}var g=t.match(ko);if(g){n(g[0].length);continue}var _=t.match(xo);if(_){var b=l;n(_[0].length),r(_[1],b,l);continue}var $=function(){var e=t.match(Co);if(e){var r={tagName:e[1],attrs:[],start:l};n(e[0].length);for(var i,o;!(i=t.match(wo))&&(o=t.match(_o));)n(o[0].length),r.attrs.push(o);if(i)return r.unarySlash=i[1],n(i[0].length),r.end=l,r}}();if($){!function(t){var n=t.tagName,i=t.unarySlash;s&&("p"===o&&go(n)&&r(o),u(n)&&o===n&&r(n));for(var l=c(n)||!!i,f=t.attrs.length,p=new Array(f),d=0;d<f;d++){var v=t.attrs[d];So&&-1===v[0].indexOf('""')&&(""===v[3]&&delete v[3],""===v[4]&&delete v[4],""===v[5]&&delete v[5]);var h=v[3]||v[4]||v[5]||"",m="a"===n&&"href"===v[1]?e.shouldDecodeNewlinesForHref:e.shouldDecodeNewlines;p[d]={name:v[1],value:on(h,m)}}l||(a.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:p}),o=n),e.start&&e.start(n,p,l,t.start,t.end)}($),Jo(o,t)&&n(1);continue}}var C=void 0,w=void 0,x=void 0;if(h>=0){for(w=t.slice(h);!(xo.test(w)||Co.test(w)||Ao.test(w)||Oo.test(w)||(x=w.indexOf("<",1))<0);)h+=x,w=t.slice(h);C=t.substring(0,h),n(h)}h<0&&(C=t,t=""),e.chars&&C&&e.chars(C)}if(t===i){e.chars&&e.chars(t);break}}r()}(t,{warn:To,expectHTML:e.expectHTML,isUnaryTag:e.isUnaryTag,canBeLeftOpenTag:e.canBeLeftOpenTag,shouldDecodeNewlines:e.shouldDecodeNewlines,shouldDecodeNewlinesForHref:e.shouldDecodeNewlinesForHref,shouldKeepComment:e.comments,start:function(t,a,u){var l=i&&i.ns||Do(t);Qn&&"svg"===l&&(a=function(t){for(var e=[],n=0;n<t.length;n++){var r=t[n];na.test(r.name)||(r.name=r.name.replace(ra,""),e.push(r))}return e}(a));var f=an(t,a,i);l&&(f.ns=l),function(t){return"style"===t.tag||"script"===t.tag&&(!t.attrsMap.type||"text/javascript"===t.attrsMap.type)}(f)&&!ur()&&(f.forbidden=!0);for(var p=0;p<No.length;p++)f=No[p](f,e)||f;if(s||(!function(t){null!=he(t,"v-pre")&&(t.pre=!0)}(f),f.pre&&(s=!0)),Lo(f.tag)&&(c=!0),s?function(t){var e=t.attrsList.length;if(e)for(var n=t.attrs=new Array(e),r=0;r<e;r++)n[r]={name:t.attrsList[r].name,value:JSON.stringify(t.attrsList[r].value)};else t.pre||(t.plain=!0)}(f):f.processed||(un(f),function(t){var e=he(t,"v-if");if(e)t.if=e,ln(t,{exp:e,block:t});else{null!=he(t,"v-else")&&(t.else=!0);var n=he(t,"v-else-if");n&&(t.elseif=n)}}(f),function(t){null!=he(t,"v-once")&&(t.once=!0)}(f),cn(f,e)),r?o.length||r.if&&(f.elseif||f.else)&&ln(r,{exp:f.elseif,block:f}):r=f,i&&!f.forbidden)if(f.elseif||f.else)!function(t,e){var n=function(t){var e=t.length;for(;e--;){if(1===t[e].type)return t[e];t.pop()}}(e.children);n&&n.if&&ln(n,{exp:t.elseif,block:t})}(f,i);else if(f.slotScope){i.plain=!1;var d=f.slotTarget||'"default"';(i.scopedSlots||(i.scopedSlots={}))[d]=f}else i.children.push(f),f.parent=i;u?n(f):(i=f,o.push(f))},end:function(){var t=o[o.length-1],e=t.children[t.children.length-1];e&&3===e.type&&" "===e.text&&!c&&t.children.pop(),o.length-=1,i=o[o.length-1],n(t)},chars:function(t){if(i&&(!Qn||"textarea"!==i.tag||i.attrsMap.placeholder!==t)){var e=i.children;if(t=c||t.trim()?function(t){return"script"===t.tag||"style"===t.tag}(i)?t:ea(t):a&&e.length?" ":""){var n;!s&&" "!==t&&(n=function(t,e){var n=e?fo(e):uo;if(n.test(t)){for(var r,i,o,a=[],s=[],c=n.lastIndex=0;r=n.exec(t);){(i=r.index)>c&&(s.push(o=t.slice(c,i)),a.push(JSON.stringify(o)));var u=ae(r[1].trim());a.push("_s("+u+")"),s.push({"@binding":u}),c=i+r[0].length}return c<t.length&&(s.push(o=t.slice(c)),a.push(JSON.stringify(o))),{expression:a.join("+"),tokens:s}}}(t,Eo))?e.push({type:2,expression:n.expression,tokens:n.tokens,text:t}):" "===t&&e.length&&" "===e[e.length-1].text||e.push({type:3,text:t})}}},comment:function(t){i.children.push({type:3,text:t,isComment:!0})}}),r}function cn(t,e){!function(t){var e=ve(t,"key");e&&(t.key=e)}(t),t.plain=!t.key&&!t.attrsList.length,function(t){var e=ve(t,"ref");e&&(t.ref=e,t.refInFor=function(t){var e=t;for(;e;){if(void 0!==e.for)return!0;e=e.parent}return!1}(t))}(t),function(t){if("slot"===t.tag)t.slotName=ve(t,"name");else{var e;"template"===t.tag?(e=he(t,"scope"),t.slotScope=e||he(t,"slot-scope")):(e=he(t,"slot-scope"))&&(t.slotScope=e);var n=ve(t,"slot");n&&(t.slotTarget='""'===n?'"default"':n,"template"===t.tag||t.slotScope||le(t,"slot",n))}}(t),function(t){var e;(e=ve(t,"is"))&&(t.component=e);null!=he(t,"inline-template")&&(t.inlineTemplate=!0)}(t);for(var n=0;n<jo.length;n++)t=jo[n](t,e)||t;!function(t){var e,n,r,i,o,a,s,c=t.attrsList;for(e=0,n=c.length;e<n;e++)if(r=i=c[e].name,o=c[e].value,Wo.test(r))if(t.hasBindings=!0,(a=function(t){var e=t.match(ta);if(e){var n={};return e.forEach(function(t){n[t.slice(1)]=!0}),n}}(r))&&(r=r.replace(ta,"")),Qo.test(r))r=r.replace(Qo,""),o=ae(o),s=!1,a&&(a.prop&&(s=!0,"innerHtml"===(r=Pn(r))&&(r="innerHTML")),a.camel&&(r=Pn(r)),a.sync&&de(t,"update:"+Pn(r),ye(o,"$event"))),s||!t.component&&Mo(t.tag,t.attrsMap.type,r)?ue(t,r,o):le(t,r,o);else if(qo.test(r))r=r.replace(qo,""),de(t,r,o,a,!1);else{var u=(r=r.replace(Wo,"")).match(Yo),l=u&&u[1];l&&(r=r.slice(0,-(l.length+1))),pe(t,r,i,o,l,a)}else le(t,r,JSON.stringify(o)),!t.component&&"muted"===r&&Mo(t.tag,t.attrsMap.type,r)&&ue(t,r,"true")}(t)}function un(t){var e;if(e=he(t,"v-for")){var n=function(t){var e=t.match(Go);if(!e)return;var n={};n.for=e[2].trim();var r=e[1].trim().replace(Xo,""),i=r.match(Zo);i?(n.alias=r.replace(Zo,""),n.iterator1=i[1].trim(),i[2]&&(n.iterator2=i[2].trim())):n.alias=r;return n}(e);n&&h(t,n)}}function ln(t,e){t.ifConditions||(t.ifConditions=[]),t.ifConditions.push(e)}function fn(t){return an(t.tag,t.attrsList.slice(),t.parent)}function pn(t){if(t.static=function(t){if(2===t.type)return!1;if(3===t.type)return!0;return!(!t.pre&&(t.hasBindings||t.if||t.for||In(t.tag)||!Fo(t.tag)||function(t){for(;t.parent;){if("template"!==(t=t.parent).tag)return!1;if(t.for)return!0}return!1}(t)||!Object.keys(t).every(Po)))}(t),1===t.type){if(!Fo(t.tag)&&"slot"!==t.tag&&null==t.attrsMap["inline-template"])return;for(var e=0,n=t.children.length;e<n;e++){var r=t.children[e];pn(r),r.static||(t.static=!1)}if(t.ifConditions)for(var i=1,o=t.ifConditions.length;i<o;i++){var a=t.ifConditions[i].block;pn(a),a.static||(t.static=!1)}}}function dn(t,e){if(1===t.type){if((t.static||t.once)&&(t.staticInFor=e),t.static&&t.children.length&&(1!==t.children.length||3!==t.children[0].type))return void(t.staticRoot=!0);if(t.staticRoot=!1,t.children)for(var n=0,r=t.children.length;n<r;n++)dn(t.children[n],e||!!t.for);if(t.ifConditions)for(var i=1,o=t.ifConditions.length;i<o;i++)dn(t.ifConditions[i].block,e)}}function vn(t,e,n){var r=e?"nativeOn:{":"on:{";for(var i in t)r+='"'+i+'":'+hn(i,t[i])+",";return r.slice(0,-1)+"}"}function hn(t,e){if(!e)return"function(){}";if(Array.isArray(e))return"["+e.map(function(e){return hn(t,e)}).join(",")+"]";var n=ca.test(e.value),r=sa.test(e.value);if(e.modifiers){var i="",o="",a=[];for(var s in e.modifiers)if(fa[s])o+=fa[s],ua[s]&&a.push(s);else if("exact"===s){var c=e.modifiers;o+=la(["ctrl","shift","alt","meta"].filter(function(t){return!c[t]}).map(function(t){return"$event."+t+"Key"}).join("||"))}else a.push(s);a.length&&(i+=function(t){return"if(!('button' in $event)&&"+t.map(mn).join("&&")+")return null;"}(a)),o&&(i+=o);return"function($event){"+i+(n?e.value+"($event)":r?"("+e.value+")($event)":e.value)+"}"}return n||r?e.value:"function($event){"+e.value+"}"}function mn(t){var e=parseInt(t,10);if(e)return"$event.keyCode!=="+e;var n=ua[t];return"_k($event.keyCode,"+JSON.stringify(t)+","+JSON.stringify(n)+",$event.key)"}function yn(t,e){var n=new da(e);return{render:"with(this){return "+(t?gn(t,n):'_c("div")')+"}",staticRenderFns:n.staticRenderFns}}function gn(t,e){if(t.staticRoot&&!t.staticProcessed)return _n(t,e);if(t.once&&!t.onceProcessed)return bn(t,e);if(t.for&&!t.forProcessed)return function(t,e,n,r){var i=t.for,o=t.alias,a=t.iterator1?","+t.iterator1:"",s=t.iterator2?","+t.iterator2:"";return t.forProcessed=!0,(r||"_l")+"(("+i+"),function("+o+a+s+"){return "+(n||gn)(t,e)+"})"}(t,e);if(t.if&&!t.ifProcessed)return $n(t,e);if("template"!==t.tag||t.slotTarget){if("slot"===t.tag)return function(t,e){var n=t.slotName||'"default"',r=kn(t,e),i="_t("+n+(r?","+r:""),o=t.attrs&&"{"+t.attrs.map(function(t){return Pn(t.name)+":"+t.value}).join(",")+"}",a=t.attrsMap["v-bind"];!o&&!a||r||(i+=",null");o&&(i+=","+o);a&&(i+=(o?"":",null")+","+a);return i+")"}(t,e);var n;if(t.component)n=function(t,e,n){var r=e.inlineTemplate?null:kn(e,n,!0);return"_c("+t+","+wn(e,n)+(r?","+r:"")+")"}(t.component,t,e);else{var r=t.plain?void 0:wn(t,e),i=t.inlineTemplate?null:kn(t,e,!0);n="_c('"+t.tag+"'"+(r?","+r:"")+(i?","+i:"")+")"}for(var o=0;o<e.transforms.length;o++)n=e.transforms[o](t,n);return n}return kn(t,e)||"void 0"}function _n(t,e){return t.staticProcessed=!0,e.staticRenderFns.push("with(this){return "+gn(t,e)+"}"),"_m("+(e.staticRenderFns.length-1)+(t.staticInFor?",true":"")+")"}function bn(t,e){if(t.onceProcessed=!0,t.if&&!t.ifProcessed)return $n(t,e);if(t.staticInFor){for(var n="",r=t.parent;r;){if(r.for){n=r.key;break}r=r.parent}return n?"_o("+gn(t,e)+","+e.onceId+++","+n+")":gn(t,e)}return _n(t,e)}function $n(t,e,n,r){return t.ifProcessed=!0,Cn(t.ifConditions.slice(),e,n,r)}function Cn(t,e,n,r){function i(t){return n?n(t,e):t.once?bn(t,e):gn(t,e)}if(!t.length)return r||"_e()";var o=t.shift();return o.exp?"("+o.exp+")?"+i(o.block)+":"+Cn(t,e,n,r):""+i(o.block)}function wn(t,e){var n="{",r=function(t,e){var n=t.directives;if(!n)return;var r,i,o,a,s="directives:[",c=!1;for(r=0,i=n.length;r<i;r++){o=n[r],a=!0;var u=e.directives[o.name];u&&(a=!!u(t,o,e.warn)),a&&(c=!0,s+='{name:"'+o.name+'",rawName:"'+o.rawName+'"'+(o.value?",value:("+o.value+"),expression:"+JSON.stringify(o.value):"")+(o.arg?',arg:"'+o.arg+'"':"")+(o.modifiers?",modifiers:"+JSON.stringify(o.modifiers):"")+"},")}if(c)return s.slice(0,-1)+"]"}(t,e);r&&(n+=r+","),t.key&&(n+="key:"+t.key+","),t.ref&&(n+="ref:"+t.ref+","),t.refInFor&&(n+="refInFor:true,"),t.pre&&(n+="pre:true,"),t.component&&(n+='tag:"'+t.tag+'",');for(var i=0;i<e.dataGenFns.length;i++)n+=e.dataGenFns[i](t);if(t.attrs&&(n+="attrs:{"+On(t.attrs)+"},"),t.props&&(n+="domProps:{"+On(t.props)+"},"),t.events&&(n+=vn(t.events,!1,e.warn)+","),t.nativeEvents&&(n+=vn(t.nativeEvents,!0,e.warn)+","),t.slotTarget&&!t.slotScope&&(n+="slot:"+t.slotTarget+","),t.scopedSlots&&(n+=function(t,e){return"scopedSlots:_u(["+Object.keys(t).map(function(n){return xn(n,t[n],e)}).join(",")+"])"}(t.scopedSlots,e)+","),t.model&&(n+="model:{value:"+t.model.value+",callback:"+t.model.callback+",expression:"+t.model.expression+"},"),t.inlineTemplate){var o=function(t,e){var n=t.children[0];if(1===n.type){var r=yn(n,e.options);return"inlineTemplate:{render:function(){"+r.render+"},staticRenderFns:["+r.staticRenderFns.map(function(t){return"function(){"+t+"}"}).join(",")+"]}"}}(t,e);o&&(n+=o+",")}return n=n.replace(/,$/,"")+"}",t.wrapData&&(n=t.wrapData(n)),t.wrapListeners&&(n=t.wrapListeners(n)),n}function xn(t,e,n){if(e.for&&!e.forProcessed)return function(t,e,n){var r=e.for,i=e.alias,o=e.iterator1?","+e.iterator1:"",a=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0,"_l(("+r+"),function("+i+o+a+"){return "+xn(t,e,n)+"})"}(t,e,n);return"{key:"+t+",fn:"+("function("+String(e.slotScope)+"){return "+("template"===e.tag?e.if?e.if+"?"+(kn(e,n)||"undefined")+":undefined":kn(e,n)||"undefined":gn(e,n))+"}")+"}"}function kn(t,e,n,r,i){var o=t.children;if(o.length){var a=o[0];if(1===o.length&&a.for&&"template"!==a.tag&&"slot"!==a.tag)return(r||gn)(a,e);var s=n?function(t,e){for(var n=0,r=0;r<t.length;r++){var i=t[r];if(1===i.type){if(An(i)||i.ifConditions&&i.ifConditions.some(function(t){return An(t.block)})){n=2;break}(e(i)||i.ifConditions&&i.ifConditions.some(function(t){return e(t.block)}))&&(n=1)}}return n}(o,e.maybeComponent):0,c=i||function(t,e){if(1===t.type)return gn(t,e);return 3===t.type&&t.isComment?function(t){return"_e("+JSON.stringify(t.text)+")"}(t):function(t){return"_v("+(2===t.type?t.expression:Sn(JSON.stringify(t.text)))+")"}(t)};return"["+o.map(function(t){return c(t,e)}).join(",")+"]"+(s?","+s:"")}}function An(t){return void 0!==t.for||"template"===t.tag||"slot"===t.tag}function On(t){for(var e="",n=0;n<t.length;n++){var r=t[n];e+='"'+r.name+'":'+Sn(r.value)+","}return e.slice(0,-1)}function Sn(t){return t.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function Tn(t,e){try{return new Function(t)}catch(n){return e.push({err:n,code:t}),y}}function En(t){return Ro=Ro||document.createElement("div"),Ro.innerHTML=t?'<a href="\n"/>':'<div a="\n"/>',Ro.innerHTML.indexOf("&#10;")>0}var jn=Object.freeze({}),Nn=Object.prototype.toString,In=u("slot,component",!0),Ln=u("key,ref,slot,slot-scope,is"),Mn=Object.prototype.hasOwnProperty,Dn=/-(\w)/g,Pn=p(function(t){return t.replace(Dn,function(t,e){return e?e.toUpperCase():""})}),Fn=p(function(t){return t.charAt(0).toUpperCase()+t.slice(1)}),Rn=/\B([A-Z])/g,Hn=p(function(t){return t.replace(Rn,"-$1").toLowerCase()}),Bn=function(t,e,n){return!1},Un=function(t){return t},Vn="data-server-rendered",zn=["component","directive","filter"],Kn=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured"],Jn={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:Bn,isReservedAttr:Bn,isUnknownElement:Bn,getTagNamespace:y,parsePlatformTagName:Un,mustUseProp:Bn,_lifecycleHooks:Kn},qn=/[^\w.$]/,Wn="__proto__"in{},Gn="undefined"!=typeof window,Zn="undefined"!=typeof WXEnvironment&&!!WXEnvironment.platform,Xn=Zn&&WXEnvironment.platform.toLowerCase(),Yn=Gn&&window.navigator.userAgent.toLowerCase(),Qn=Yn&&/msie|trident/.test(Yn),tr=Yn&&Yn.indexOf("msie 9.0")>0,er=Yn&&Yn.indexOf("edge/")>0,nr=Yn&&Yn.indexOf("android")>0||"android"===Xn,rr=Yn&&/iphone|ipad|ipod|ios/.test(Yn)||"ios"===Xn,ir=(Yn&&/chrome\/\d+/.test(Yn),{}.watch),or=!1;if(Gn)try{var ar={};Object.defineProperty(ar,"passive",{get:function(){or=!0}}),window.addEventListener("test-passive",null,ar)}catch(t){}var sr,cr,ur=function(){return void 0===sr&&(sr=!Gn&&"undefined"!=typeof global&&"server"===global.process.env.VUE_ENV),sr},lr=Gn&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,fr="undefined"!=typeof Symbol&&w(Symbol)&&"undefined"!=typeof Reflect&&w(Reflect.ownKeys);cr="undefined"!=typeof Set&&w(Set)?Set:function(){function t(){this.set=Object.create(null)}return t.prototype.has=function(t){return!0===this.set[t]},t.prototype.add=function(t){this.set[t]=!0},t.prototype.clear=function(){this.set=Object.create(null)},t}();var pr=y,dr=0,vr=function(){this.id=dr++,this.subs=[]};vr.prototype.addSub=function(t){this.subs.push(t)},vr.prototype.removeSub=function(t){l(this.subs,t)},vr.prototype.depend=function(){vr.target&&vr.target.addDep(this)},vr.prototype.notify=function(){for(var t=this.subs.slice(),e=0,n=t.length;e<n;e++)t[e].update()},vr.target=null;var hr=[],mr=function(t,e,n,r,i,o,a,s){this.tag=t,this.data=e,this.children=n,this.text=r,this.elm=i,this.ns=void 0,this.context=o,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=e&&e.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1},yr={child:{configurable:!0}};yr.child.get=function(){return this.componentInstance},Object.defineProperties(mr.prototype,yr);var gr=function(t){void 0===t&&(t="");var e=new mr;return e.text=t,e.isComment=!0,e},_r=Array.prototype,br=Object.create(_r);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){var e=_r[t];C(br,t,function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var i,o=e.apply(this,n),a=this.__ob__;switch(t){case"push":case"unshift":i=n;break;case"splice":i=n.slice(2)}return i&&a.observeArray(i),a.dep.notify(),o})});var $r=Object.getOwnPropertyNames(br),Cr={shouldConvert:!0},wr=function(t){if(this.value=t,this.dep=new vr,this.vmCount=0,C(t,"__ob__",this),Array.isArray(t)){(Wn?O:S)(t,br,$r),this.observeArray(t)}else this.walk(t)};wr.prototype.walk=function(t){for(var e=Object.keys(t),n=0;n<e.length;n++)E(t,e[n],t[e[n]])},wr.prototype.observeArray=function(t){for(var e=0,n=t.length;e<n;e++)T(t[e])};var xr=Jn.optionMergeStrategies;xr.data=function(t,e,n){return n?M(t,e,n):e&&"function"!=typeof e?t:M(t,e)},Kn.forEach(function(t){xr[t]=D}),zn.forEach(function(t){xr[t+"s"]=P}),xr.watch=function(t,e,n,r){if(t===ir&&(t=void 0),e===ir&&(e=void 0),!e)return Object.create(t||null);if(!t)return e;var i={};h(i,t);for(var o in e){var a=i[o],s=e[o];a&&!Array.isArray(a)&&(a=[a]),i[o]=a?a.concat(s):Array.isArray(s)?s:[s]}return i},xr.props=xr.methods=xr.inject=xr.computed=function(t,e,n,r){if(!t)return e;var i=Object.create(null);return h(i,t),e&&h(i,e),i},xr.provide=M;var kr,Ar,Or=function(t,e){return void 0===e?t:e},Sr=[],Tr=!1,Er=!1;if("undefined"!=typeof setImmediate&&w(setImmediate))Ar=function(){setImmediate(J)};else if("undefined"==typeof MessageChannel||!w(MessageChannel)&&"[object MessageChannelConstructor]"!==MessageChannel.toString())Ar=function(){setTimeout(J,0)};else{var jr=new MessageChannel,Nr=jr.port2;jr.port1.onmessage=J,Ar=function(){Nr.postMessage(1)}}if("undefined"!=typeof Promise&&w(Promise)){var Ir=Promise.resolve();kr=function(){Ir.then(J),rr&&setTimeout(y)}}else kr=Ar;var Lr,Mr=new cr,Dr=p(function(t){var e="&"===t.charAt(0),n="~"===(t=e?t.slice(1):t).charAt(0),r="!"===(t=n?t.slice(1):t).charAt(0);return t=r?t.slice(1):t,{name:t,once:n,capture:r,passive:e}}),Pr=null,Fr=[],Rr=[],Hr={},Br=!1,Ur=!1,Vr=0,zr=0,Kr=function(t,e,n,r,i){this.vm=t,i&&(t._watcher=this),t._watchers.push(this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++zr,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new cr,this.newDepIds=new cr,this.expression="","function"==typeof e?this.getter=e:(this.getter=function(t){if(!qn.test(t)){var e=t.split(".");return function(t){for(var n=0;n<e.length;n++){if(!t)return;t=t[e[n]]}return t}}}(e),this.getter||(this.getter=function(){})),this.value=this.lazy?void 0:this.get()};Kr.prototype.get=function(){!function(t){vr.target&&hr.push(vr.target),vr.target=t}(this);var t,e=this.vm;try{t=this.getter.call(e,e)}catch(t){if(!this.user)throw t;V(t,e,'getter for watcher "'+this.expression+'"')}finally{this.deep&&W(t),vr.target=hr.pop(),this.cleanupDeps()}return t},Kr.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},Kr.prototype.cleanupDeps=function(){for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var n=this.depIds;this.depIds=this.newDepIds,this.newDepIds=n,this.newDepIds.clear(),n=this.deps,this.deps=this.newDeps,this.newDeps=n,this.newDeps.length=0},Kr.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():function(t){var e=t.id;if(null==Hr[e]){if(Hr[e]=!0,Ur){for(var n=Fr.length-1;n>Vr&&Fr[n].id>t.id;)n--;Fr.splice(n+1,0,t)}else Fr.push(t);Br||(Br=!0,q(ht))}}(this)},Kr.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||i(t)||this.deep){var e=this.value;if(this.value=t,this.user)try{this.cb.call(this.vm,t,e)}catch(t){V(t,this.vm,'callback for watcher "'+this.expression+'"')}else this.cb.call(this.vm,t,e)}}},Kr.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},Kr.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},Kr.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||l(this.vm._watchers,this);for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1}};var Jr={enumerable:!0,configurable:!0,get:y,set:y},qr={lazy:!0};Nt(It.prototype);var Wr={init:function(t,n,r,i){if(!t.componentInstance||t.componentInstance._isDestroyed){(t.componentInstance=function(t,n,r,i){var o={_isComponent:!0,parent:n,_parentVnode:t,_parentElm:r||null,_refElm:i||null},a=t.data.inlineTemplate;return e(a)&&(o.render=a.render,o.staticRenderFns=a.staticRenderFns),new t.componentOptions.Ctor(o)}(t,Pr,r,i)).$mount(n?t.elm:void 0,n)}else if(t.data.keepAlive){var o=t;Wr.prepatch(o,o)}},prepatch:function(t,e){var n=e.componentOptions;!function(t,e,n,r,i){var o=!!(i||t.$options._renderChildren||r.data.scopedSlots||t.$scopedSlots!==jn);if(t.$options._parentVnode=r,t.$vnode=r,t._vnode&&(t._vnode.parent=r),t.$options._renderChildren=i,t.$attrs=r.data&&r.data.attrs||jn,t.$listeners=n||jn,e&&t.$options.props){Cr.shouldConvert=!1;for(var a=t._props,s=t.$options._propKeys||[],c=0;c<s.length;c++){var u=s[c];a[u]=H(u,t.$options.props,e,t)}Cr.shouldConvert=!0,t.$options.propsData=e}if(n){var l=t.$options._parentListeners;t.$options._parentListeners=n,st(t,n,l)}o&&(t.$slots=ct(i,r.context),t.$forceUpdate())}(e.componentInstance=t.componentInstance,n.propsData,n.listeners,e,n.children)},insert:function(t){var e=t.context,n=t.componentInstance;n._isMounted||(n._isMounted=!0,vt(n,"mounted")),t.data.keepAlive&&(e._isMounted?function(t){t._inactive=!1,Rr.push(t)}(n):pt(n,!0))},destroy:function(t){var e=t.componentInstance;e._isDestroyed||(t.data.keepAlive?dt(e,!0):e.$destroy())}},Gr=Object.keys(Wr),Zr=1,Xr=2,Yr=0;!function(t){t.prototype._init=function(t){this._uid=Yr++,this._isVue=!0,t&&t._isComponent?function(t,e){var n=t.$options=Object.create(t.constructor.options),r=e._parentVnode;n.parent=e.parent,n._parentVnode=r,n._parentElm=e._parentElm,n._refElm=e._refElm;var i=r.componentOptions;n.propsData=i.propsData,n._parentListeners=i.listeners,n._renderChildren=i.children,n._componentTag=i.tag,e.render&&(n.render=e.render,n.staticRenderFns=e.staticRenderFns)}(this,t):this.$options=F(Ft(this.constructor),t||{},this),this._renderProxy=this,this._self=this,function(t){var e=t.$options,n=e.parent;if(n&&!e.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(t)}t.$parent=n,t.$root=n?n.$root:t,t.$children=[],t.$refs={},t._watcher=null,t._inactive=null,t._directInactive=!1,t._isMounted=!1,t._isDestroyed=!1,t._isBeingDestroyed=!1}(this),function(t){t._events=Object.create(null),t._hasHookEvent=!1;var e=t.$options._parentListeners;e&&st(t,e)}(this),function(t){t._vnode=null,t._staticTrees=null;var e=t.$options,n=t.$vnode=e._parentVnode,r=n&&n.context;t.$slots=ct(e._renderChildren,r),t.$scopedSlots=jn,t._c=function(e,n,r,i){return Dt(t,e,n,r,i,!1)},t.$createElement=function(e,n,r,i){return Dt(t,e,n,r,i,!0)};var i=n&&n.data;E(t,"$attrs",i&&i.attrs||jn,0,!0),E(t,"$listeners",e._parentListeners||jn,0,!0)}(this),vt(this,"beforeCreate"),function(t){var e=$t(t.$options.inject,t);e&&(Cr.shouldConvert=!1,Object.keys(e).forEach(function(n){E(t,n,e[n])}),Cr.shouldConvert=!0)}(this),yt(this),function(t){var e=t.$options.provide;e&&(t._provided="function"==typeof e?e.call(t):e)}(this),vt(this,"created"),this.$options.el&&this.$mount(this.$options.el)}}(Rt),function(t){var e={};e.get=function(){return this._data};var n={};n.get=function(){return this._props},Object.defineProperty(t.prototype,"$data",e),Object.defineProperty(t.prototype,"$props",n),t.prototype.$set=j,t.prototype.$delete=N,t.prototype.$watch=function(t,e,n){if(o(e))return bt(this,t,e,n);(n=n||{}).user=!0;var r=new Kr(this,t,e,n);return n.immediate&&e.call(this,r.value),function(){r.teardown()}}}(Rt),function(t){var e=/^hook:/;t.prototype.$on=function(t,n){if(Array.isArray(t))for(var r=0,i=t.length;r<i;r++)this.$on(t[r],n);else(this._events[t]||(this._events[t]=[])).push(n),e.test(t)&&(this._hasHookEvent=!0);return this},t.prototype.$once=function(t,e){function n(){r.$off(t,n),e.apply(r,arguments)}var r=this;return n.fn=e,r.$on(t,n),r},t.prototype.$off=function(t,e){if(!arguments.length)return this._events=Object.create(null),this;if(Array.isArray(t)){for(var n=0,r=t.length;n<r;n++)this.$off(t[n],e);return this}var i=this._events[t];if(!i)return this;if(!e)return this._events[t]=null,this;if(e)for(var o,a=i.length;a--;)if((o=i[a])===e||o.fn===e){i.splice(a,1);break}return this},t.prototype.$emit=function(t){var e=this,n=e._events[t];if(n){n=n.length>1?v(n):n;for(var r=v(arguments,1),i=0,o=n.length;i<o;i++)try{n[i].apply(e,r)}catch(n){V(n,e,'event handler for "'+t+'"')}}return e}}(Rt),function(t){t.prototype._update=function(t,e){this._isMounted&&vt(this,"beforeUpdate");var n=this.$el,r=this._vnode,i=Pr;Pr=this,this._vnode=t,r?this.$el=this.__patch__(r,t):(this.$el=this.__patch__(this.$el,t,e,!1,this.$options._parentElm,this.$options._refElm),this.$options._parentElm=this.$options._refElm=null),Pr=i,n&&(n.__vue__=null),this.$el&&(this.$el.__vue__=this),this.$vnode&&this.$parent&&this.$vnode===this.$parent._vnode&&(this.$parent.$el=this.$el)},t.prototype.$forceUpdate=function(){this._watcher&&this._watcher.update()},t.prototype.$destroy=function(){if(!this._isBeingDestroyed){vt(this,"beforeDestroy"),this._isBeingDestroyed=!0;var t=this.$parent;!t||t._isBeingDestroyed||this.$options.abstract||l(t.$children,this),this._watcher&&this._watcher.teardown();for(var e=this._watchers.length;e--;)this._watchers[e].teardown();this._data.__ob__&&this._data.__ob__.vmCount--,this._isDestroyed=!0,this.__patch__(this._vnode,null),vt(this,"destroyed"),this.$off(),this.$el&&(this.$el.__vue__=null),this.$vnode&&(this.$vnode.parent=null)}}}(Rt),function(t){Nt(t.prototype),t.prototype.$nextTick=function(t){return q(t,this)},t.prototype._render=function(){var t=this,e=t.$options,n=e.render,r=e._parentVnode;if(t._isMounted)for(var i in t.$slots){var o=t.$slots[i];(o._rendered||o[0]&&o[0].elm)&&(t.$slots[i]=A(o,!0))}t.$scopedSlots=r&&r.data.scopedSlots||jn,t.$vnode=r;var a;try{a=n.call(t._renderProxy,t.$createElement)}catch(e){V(e,t,"render"),a=t._vnode}return a instanceof mr||(a=gr()),a.parent=r,a}}(Rt);var Qr=[String,RegExp,Array],ti={KeepAlive:{name:"keep-alive",abstract:!0,props:{include:Qr,exclude:Qr,max:[String,Number]},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){for(var t in this.cache)zt(this.cache,t,this.keys)},watch:{include:function(t){Vt(this,function(e){return Ut(t,e)})},exclude:function(t){Vt(this,function(e){return!Ut(t,e)})}},render:function(){var t=this.$slots.default,e=it(t),n=e&&e.componentOptions;if(n){var r=Bt(n),i=this.include,o=this.exclude;if(i&&(!r||!Ut(i,r))||o&&r&&Ut(o,r))return e;var a=this.cache,s=this.keys,c=null==e.key?n.Ctor.cid+(n.tag?"::"+n.tag:""):e.key;a[c]?(e.componentInstance=a[c].componentInstance,l(s,c),s.push(c)):(a[c]=e,s.push(c),this.max&&s.length>parseInt(this.max)&&zt(a,s[0],s,this._vnode)),e.data.keepAlive=!0}return e||t&&t[0]}}};!function(t){var e={};e.get=function(){return Jn},Object.defineProperty(t,"config",e),t.util={warn:pr,extend:h,mergeOptions:F,defineReactive:E},t.set=j,t.delete=N,t.nextTick=q,t.options=Object.create(null),zn.forEach(function(e){t.options[e+"s"]=Object.create(null)}),t.options._base=t,h(t.options.components,ti),function(t){t.use=function(t){var e=this._installedPlugins||(this._installedPlugins=[]);if(e.indexOf(t)>-1)return this;var n=v(arguments,1);return n.unshift(this),"function"==typeof t.install?t.install.apply(t,n):"function"==typeof t&&t.apply(null,n),e.push(t),this}}(t),function(t){t.mixin=function(t){return this.options=F(this.options,t),this}}(t),Ht(t),function(t){zn.forEach(function(e){t[e]=function(t,n){return n?("component"===e&&o(n)&&(n.name=n.name||t,n=this.options._base.extend(n)),"directive"===e&&"function"==typeof n&&(n={bind:n,update:n}),this.options[e+"s"][t]=n,n):this.options[e+"s"][t]}})}(t)}(Rt),Object.defineProperty(Rt.prototype,"$isServer",{get:ur}),Object.defineProperty(Rt.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Rt.version="2.5.13";var ei,ni,ri,ii,oi,ai,si,ci,ui=u("style,class"),li=u("input,textarea,option,select,progress"),fi=function(t,e,n){return"value"===n&&li(t)&&"button"!==e||"selected"===n&&"option"===t||"checked"===n&&"input"===t||"muted"===n&&"video"===t},pi=u("contenteditable,draggable,spellcheck"),di=u("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),vi="http://www.w3.org/1999/xlink",hi=function(t){return":"===t.charAt(5)&&"xlink"===t.slice(0,5)},mi=function(t){return hi(t)?t.slice(6,t.length):""},yi=function(t){return null==t||!1===t},gi={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},_i=u("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),bi=u("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),$i=function(t){return _i(t)||bi(t)},Ci=Object.create(null),wi=u("text,number,password,search,email,tel,url"),xi=Object.freeze({createElement:function(t,e){var n=document.createElement(t);return"select"!==t?n:(e.data&&e.data.attrs&&void 0!==e.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n)},createElementNS:function(t,e){return document.createElementNS(gi[t],e)},createTextNode:function(t){return document.createTextNode(t)},createComment:function(t){return document.createComment(t)},insertBefore:function(t,e,n){t.insertBefore(e,n)},removeChild:function(t,e){t.removeChild(e)},appendChild:function(t,e){t.appendChild(e)},parentNode:function(t){return t.parentNode},nextSibling:function(t){return t.nextSibling},tagName:function(t){return t.tagName},setTextContent:function(t,e){t.textContent=e},setAttribute:function(t,e,n){t.setAttribute(e,n)}}),ki={create:function(t,e){Xt(e)},update:function(t,e){t.data.ref!==e.data.ref&&(Xt(t,!0),Xt(e))},destroy:function(t){Xt(t,!0)}},Ai=new mr("",{},[]),Oi=["create","activate","update","remove","destroy"],Si={create:te,update:te,destroy:function(t){te(t,Ai)}},Ti=Object.create(null),Ei=[ki,Si],ji={create:re,update:re},Ni={create:oe,update:oe},Ii=/[\w).+\-_$\]]/,Li="__r",Mi="__c",Di={create:xe,update:xe},Pi={create:ke,update:ke},Fi=p(function(t){var e={},n=/:(.+)/;return t.split(/;(?![^(]*\))/g).forEach(function(t){if(t){var r=t.split(n);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}),Ri=/^--/,Hi=/\s*!important$/,Bi=function(t,e,n){if(Ri.test(e))t.style.setProperty(e,n);else if(Hi.test(n))t.style.setProperty(e,n.replace(Hi,""),"important");else{var r=Vi(e);if(Array.isArray(n))for(var i=0,o=n.length;i<o;i++)t.style[r]=n[i];else t.style[r]=n}},Ui=["Webkit","Moz","ms"],Vi=p(function(t){if(ci=ci||document.createElement("div").style,"filter"!==(t=Pn(t))&&t in ci)return t;for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=0;n<Ui.length;n++){var r=Ui[n]+e;if(r in ci)return r}}),zi={create:Se,update:Se},Ki=p(function(t){return{enterClass:t+"-enter",enterToClass:t+"-enter-to",enterActiveClass:t+"-enter-active",leaveClass:t+"-leave",leaveToClass:t+"-leave-to",leaveActiveClass:t+"-leave-active"}}),Ji=Gn&&!tr,qi="transition",Wi="animation",Gi="transition",Zi="transitionend",Xi="animation",Yi="animationend";Ji&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Gi="WebkitTransition",Zi="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Xi="WebkitAnimation",Yi="webkitAnimationEnd"));var Qi=Gn?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(t){return t()},to=/\b(transform|all)(,|$)/,eo=function(i){function o(t){var n=A.parentNode(t);e(n)&&A.removeChild(n,t)}function a(t,r,i,o,a){if(t.isRootInsert=!a,!function(t,r,i,o){var a=t.data;if(e(a)){var u=e(t.componentInstance)&&a.keepAlive;if(e(a=a.hook)&&e(a=a.init)&&a(t,!1,i,o),e(t.componentInstance))return s(t,r),n(u)&&function(t,n,r,i){for(var o,a=t;a.componentInstance;)if(a=a.componentInstance._vnode,e(o=a.data)&&e(o=o.transition)){for(o=0;o<x.activate.length;++o)x.activate[o](Ai,a);n.push(a);break}c(r,t.elm,i)}(t,r,i,o),!0}}(t,r,i,o)){var u=t.data,f=t.children,v=t.tag;e(v)?(t.elm=t.ns?A.createElementNS(t.ns,v):A.createElement(v,t),d(t),l(t,f,r),e(u)&&p(t,r),c(i,t.elm,o)):n(t.isComment)?(t.elm=A.createComment(t.text),c(i,t.elm,o)):(t.elm=A.createTextNode(t.text),c(i,t.elm,o))}}function s(t,n){e(t.data.pendingInsert)&&(n.push.apply(n,t.data.pendingInsert),t.data.pendingInsert=null),t.elm=t.componentInstance.$el,f(t)?(p(t,n),d(t)):(Xt(t),n.push(t))}function c(t,n,r){e(t)&&(e(r)?r.parentNode===t&&A.insertBefore(t,n,r):A.appendChild(t,n))}function l(t,e,n){if(Array.isArray(e))for(var i=0;i<e.length;++i)a(e[i],n,t.elm,null,!0);else r(t.text)&&A.appendChild(t.elm,A.createTextNode(String(t.text)))}function f(t){for(;t.componentInstance;)t=t.componentInstance._vnode;return e(t.tag)}function p(t,n){for(var r=0;r<x.create.length;++r)x.create[r](Ai,t);e(C=t.data.hook)&&(e(C.create)&&C.create(Ai,t),e(C.insert)&&n.push(t))}function d(t){var n;if(e(n=t.fnScopeId))A.setAttribute(t.elm,n,"");else for(var r=t;r;)e(n=r.context)&&e(n=n.$options._scopeId)&&A.setAttribute(t.elm,n,""),r=r.parent;e(n=Pr)&&n!==t.context&&n!==t.fnContext&&e(n=n.$options._scopeId)&&A.setAttribute(t.elm,n,"")}function v(t,e,n,r,i,o){for(;r<=i;++r)a(n[r],o,t,e)}function h(t){var n,r,i=t.data;if(e(i))for(e(n=i.hook)&&e(n=n.destroy)&&n(t),n=0;n<x.destroy.length;++n)x.destroy[n](t);if(e(n=t.children))for(r=0;r<t.children.length;++r)h(t.children[r])}function m(t,n,r,i){for(;r<=i;++r){var a=n[r];e(a)&&(e(a.tag)?(y(a),h(a)):o(a.elm))}}function y(t,n){if(e(n)||e(t.data)){var r,i=x.remove.length+1;for(e(n)?n.listeners+=i:n=function(t,e){function n(){0==--n.listeners&&o(t)}return n.listeners=e,n}(t.elm,i),e(r=t.componentInstance)&&e(r=r._vnode)&&e(r.data)&&y(r,n),r=0;r<x.remove.length;++r)x.remove[r](t,n);e(r=t.data.hook)&&e(r=r.remove)?r(t,n):n()}else o(t.elm)}function g(n,r,i,o,s){for(var c,u,l,f=0,p=0,d=r.length-1,h=r[0],y=r[d],g=i.length-1,b=i[0],$=i[g],C=!s;f<=d&&p<=g;)t(h)?h=r[++f]:t(y)?y=r[--d]:Yt(h,b)?(_(h,b,o),h=r[++f],b=i[++p]):Yt(y,$)?(_(y,$,o),y=r[--d],$=i[--g]):Yt(h,$)?(_(h,$,o),C&&A.insertBefore(n,h.elm,A.nextSibling(y.elm)),h=r[++f],$=i[--g]):Yt(y,b)?(_(y,b,o),C&&A.insertBefore(n,y.elm,h.elm),y=r[--d],b=i[++p]):(t(c)&&(c=Qt(r,f,d)),t(u=e(b.key)?c[b.key]:function(t,n,r,i){for(var o=r;o<i;o++){var a=n[o];if(e(a)&&Yt(t,a))return o}}(b,r,f,d))?a(b,o,n,h.elm):Yt(l=r[u],b)?(_(l,b,o),r[u]=void 0,C&&A.insertBefore(n,l.elm,h.elm)):a(b,o,n,h.elm),b=i[++p]);f>d?v(n,t(i[g+1])?null:i[g+1].elm,i,p,g,o):p>g&&m(0,r,f,d)}function _(r,i,o,a){if(r!==i){var s=i.elm=r.elm;if(n(r.isAsyncPlaceholder))e(i.asyncFactory.resolved)?$(r.elm,i,o):i.isAsyncPlaceholder=!0;else if(n(i.isStatic)&&n(r.isStatic)&&i.key===r.key&&(n(i.isCloned)||n(i.isOnce)))i.componentInstance=r.componentInstance;else{var c,u=i.data;e(u)&&e(c=u.hook)&&e(c=c.prepatch)&&c(r,i);var l=r.children,p=i.children;if(e(u)&&f(i)){for(c=0;c<x.update.length;++c)x.update[c](r,i);e(c=u.hook)&&e(c=c.update)&&c(r,i)}t(i.text)?e(l)&&e(p)?l!==p&&g(s,l,p,o,a):e(p)?(e(r.text)&&A.setTextContent(s,""),v(s,null,p,0,p.length-1,o)):e(l)?m(0,l,0,l.length-1):e(r.text)&&A.setTextContent(s,""):r.text!==i.text&&A.setTextContent(s,i.text),e(u)&&e(c=u.hook)&&e(c=c.postpatch)&&c(r,i)}}}function b(t,r,i){if(n(i)&&e(t.parent))t.parent.data.pendingInsert=r;else for(var o=0;o<r.length;++o)r[o].data.hook.insert(r[o])}function $(t,r,i,o){var a,c=r.tag,u=r.data,f=r.children;if(o=o||u&&u.pre,r.elm=t,n(r.isComment)&&e(r.asyncFactory))return r.isAsyncPlaceholder=!0,!0;if(e(u)&&(e(a=u.hook)&&e(a=a.init)&&a(r,!0),e(a=r.componentInstance)))return s(r,i),!0;if(e(c)){if(e(f))if(t.hasChildNodes())if(e(a=u)&&e(a=a.domProps)&&e(a=a.innerHTML)){if(a!==t.innerHTML)return!1}else{for(var d=!0,v=t.firstChild,h=0;h<f.length;h++){if(!v||!$(v,f[h],i,o)){d=!1;break}v=v.nextSibling}if(!d||v)return!1}else l(r,f,i);if(e(u)){var m=!1;for(var y in u)if(!O(y)){m=!0,p(r,i);break}!m&&u.class&&W(u.class)}}else t.data!==r.text&&(t.data=r.text);return!0}var C,w,x={},k=i.modules,A=i.nodeOps;for(C=0;C<Oi.length;++C)for(x[Oi[C]]=[],w=0;w<k.length;++w)e(k[w][Oi[C]])&&x[Oi[C]].push(k[w][Oi[C]]);var O=u("attrs,class,staticClass,staticStyle,key");return function(r,i,o,s,c,u){if(!t(i)){var l=!1,p=[];if(t(r))l=!0,a(i,p,c,u);else{var d=e(r.nodeType);if(!d&&Yt(r,i))_(r,i,p,s);else{if(d){if(1===r.nodeType&&r.hasAttribute(Vn)&&(r.removeAttribute(Vn),o=!0),n(o)&&$(r,i,p))return b(i,p,!0),r;r=function(t){return new mr(A.tagName(t).toLowerCase(),{},[],void 0,t)}(r)}var v=r.elm,y=A.parentNode(v);if(a(i,p,v._leaveCb?null:y,A.nextSibling(v)),e(i.parent))for(var g=i.parent,C=f(i);g;){for(var w=0;w<x.destroy.length;++w)x.destroy[w](g);if(g.elm=i.elm,C){for(var k=0;k<x.create.length;++k)x.create[k](Ai,g);var O=g.data.hook.insert;if(O.merged)for(var S=1;S<O.fns.length;S++)O.fns[S]()}else Xt(g);g=g.parent}e(y)?m(0,[r],0,0):e(r.tag)&&h(r)}}return b(i,p,l),i.elm}e(r)&&h(r)}}({nodeOps:xi,modules:[ji,Ni,Di,Pi,zi,Gn?{create:Ve,activate:Ve,remove:function(t,e){!0!==t.data.show?He(t,e):e()}}:{}].concat(Ei)});tr&&document.addEventListener("selectionchange",function(){var t=document.activeElement;t&&t.vmodel&&Ze(t,"input")});var no={inserted:function(t,e,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?Y(n,"postpatch",function(){no.componentUpdated(t,e,n)}):ze(t,e,n.context),t._vOptions=[].map.call(t.options,qe)):("textarea"===n.tag||wi(t.type))&&(t._vModifiers=e.modifiers,e.modifiers.lazy||(t.addEventListener("change",Ge),nr||(t.addEventListener("compositionstart",We),t.addEventListener("compositionend",Ge)),tr&&(t.vmodel=!0)))},componentUpdated:function(t,e,n){if("select"===n.tag){ze(t,e,n.context);var r=t._vOptions,i=t._vOptions=[].map.call(t.options,qe);if(i.some(function(t,e){return!g(t,r[e])})){(t.multiple?e.value.some(function(t){return Je(t,i)}):e.value!==e.oldValue&&Je(e.value,i))&&Ze(t,"change")}}}},ro={model:no,show:{bind:function(t,e,n){var r=e.value,i=(n=Xe(n)).data&&n.data.transition,o=t.__vOriginalDisplay="none"===t.style.display?"":t.style.display;r&&i?(n.data.show=!0,Re(n,function(){t.style.display=o})):t.style.display=r?o:"none"},update:function(t,e,n){var r=e.value;if(r!==e.oldValue){(n=Xe(n)).data&&n.data.transition?(n.data.show=!0,r?Re(n,function(){t.style.display=t.__vOriginalDisplay}):He(n,function(){t.style.display="none"})):t.style.display=r?t.__vOriginalDisplay:"none"}},unbind:function(t,e,n,r,i){i||(t.style.display=t.__vOriginalDisplay)}}},io={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]},oo={name:"transition",props:io,abstract:!0,render:function(t){var e=this,n=this.$slots.default;if(n&&(n=n.filter(function(t){return t.tag||rt(t)})).length){var i=this.mode,o=n[0];if(function(t){for(;t=t.parent;)if(t.data.transition)return!0}(this.$vnode))return o;var a=Ye(o);if(!a)return o;if(this._leaving)return tn(t,o);var s="__transition-"+this._uid+"-";a.key=null==a.key?a.isComment?s+"comment":s+a.tag:r(a.key)?0===String(a.key).indexOf(s)?a.key:s+a.key:a.key;var c=(a.data||(a.data={})).transition=Qe(this),u=this._vnode,l=Ye(u);if(a.data.directives&&a.data.directives.some(function(t){return"show"===t.name})&&(a.data.show=!0),l&&l.data&&!function(t,e){return e.key===t.key&&e.tag===t.tag}(a,l)&&!rt(l)&&(!l.componentInstance||!l.componentInstance._vnode.isComment)){var f=l.data.transition=h({},c);if("out-in"===i)return this._leaving=!0,Y(f,"afterLeave",function(){e._leaving=!1,e.$forceUpdate()}),tn(t,o);if("in-out"===i){if(rt(a))return u;var p,d=function(){p()};Y(c,"afterEnter",d),Y(c,"enterCancelled",d),Y(f,"delayLeave",function(t){p=t})}}return o}}},ao=h({tag:String,moveClass:String},io);delete ao.mode;var so={Transition:oo,TransitionGroup:{props:ao,render:function(t){for(var e=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=Qe(this),s=0;s<i.length;s++){var c=i[s];c.tag&&null!=c.key&&0!==String(c.key).indexOf("__vlist")&&(o.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a)}if(r){for(var u=[],l=[],f=0;f<r.length;f++){var p=r[f];p.data.transition=a,p.data.pos=p.elm.getBoundingClientRect(),n[p.key]?u.push(p):l.push(p)}this.kept=t(e,null,u),this.removed=l}return t(e,null,o)},beforeUpdate:function(){this.__patch__(this._vnode,this.kept,!1,!0),this._vnode=this.kept},updated:function(){var t=this.prevChildren,e=this.moveClass||(this.name||"v")+"-move";t.length&&this.hasMove(t[0].elm,e)&&(t.forEach(en),t.forEach(nn),t.forEach(rn),this._reflow=document.body.offsetHeight,t.forEach(function(t){if(t.data.moved){var n=t.elm,r=n.style;Ie(n,e),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(Zi,n._moveCb=function t(r){r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Zi,t),n._moveCb=null,Le(n,e))})}}))},methods:{hasMove:function(t,e){if(!Ji)return!1;if(this._hasMove)return this._hasMove;var n=t.cloneNode();t._transitionClasses&&t._transitionClasses.forEach(function(t){Ee(n,t)}),Te(n,e),n.style.display="none",this.$el.appendChild(n);var r=De(n);return this.$el.removeChild(n),this._hasMove=r.hasTransform}}}};Rt.config.mustUseProp=fi,Rt.config.isReservedTag=$i,Rt.config.isReservedAttr=ui,Rt.config.getTagNamespace=Gt,Rt.config.isUnknownElement=function(t){if(!Gn)return!0;if($i(t))return!1;if(t=t.toLowerCase(),null!=Ci[t])return Ci[t];var e=document.createElement(t);return t.indexOf("-")>-1?Ci[t]=e.constructor===window.HTMLUnknownElement||e.constructor===window.HTMLElement:Ci[t]=/HTMLUnknownElement/.test(e.toString())},h(Rt.options.directives,ro),h(Rt.options.components,so),Rt.prototype.__patch__=Gn?eo:y,Rt.prototype.$mount=function(t,e){return t=t&&Gn?Zt(t):void 0,function(t,e,n){t.$el=e,t.$options.render||(t.$options.render=gr),vt(t,"beforeMount");var r;return r=function(){t._update(t._render(),n)},new Kr(t,r,y,null,!0),n=!1,null==t.$vnode&&(t._isMounted=!0,vt(t,"mounted")),t}(this,t,e)},Rt.nextTick(function(){Jn.devtools&&lr&&lr.emit("init",Rt)},0);var co,uo=/\{\{((?:.|\n)+?)\}\}/g,lo=/[-.*+?^${}()|[\]\/\\]/g,fo=p(function(t){var e=t[0].replace(lo,"\\$&"),n=t[1].replace(lo,"\\$&");return new RegExp(e+"((?:.|\\n)+?)"+n,"g")}),po={staticKeys:["staticClass"],transformNode:function(t,e){e.warn;var n=he(t,"class");n&&(t.staticClass=JSON.stringify(n));var r=ve(t,"class",!1);r&&(t.classBinding=r)},genData:function(t){var e="";return t.staticClass&&(e+="staticClass:"+t.staticClass+","),t.classBinding&&(e+="class:"+t.classBinding+","),e}},vo={staticKeys:["staticStyle"],transformNode:function(t,e){e.warn;var n=he(t,"style");n&&(t.staticStyle=JSON.stringify(Fi(n)));var r=ve(t,"style",!1);r&&(t.styleBinding=r)},genData:function(t){var e="";return t.staticStyle&&(e+="staticStyle:"+t.staticStyle+","),t.styleBinding&&(e+="style:("+t.styleBinding+"),"),e}},ho=function(t){return co=co||document.createElement("div"),co.innerHTML=t,co.textContent},mo=u("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),yo=u("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),go=u("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),_o=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,bo="[a-zA-Z_][\\w\\-\\.]*",$o="((?:"+bo+"\\:)?"+bo+")",Co=new RegExp("^<"+$o),wo=/^\s*(\/?)>/,xo=new RegExp("^<\\/"+$o+"[^>]*>"),ko=/^<!DOCTYPE [^>]+>/i,Ao=/^<!--/,Oo=/^<!\[/,So=!1;"x".replace(/x(.)?/g,function(t,e){So=""===e});var To,Eo,jo,No,Io,Lo,Mo,Do,Po,Fo,Ro,Ho=u("script,style,textarea",!0),Bo={},Uo={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t"},Vo=/&(?:lt|gt|quot|amp);/g,zo=/&(?:lt|gt|quot|amp|#10|#9);/g,Ko=u("pre,textarea",!0),Jo=function(t,e){return t&&Ko(t)&&"\n"===e[0]},qo=/^@|^v-on:/,Wo=/^v-|^@|^:/,Go=/(.*?)\s+(?:in|of)\s+(.*)/,Zo=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,Xo=/^\(|\)$/g,Yo=/:(.*)$/,Qo=/^:|^v-bind:/,ta=/\.[^.]+/g,ea=p(ho),na=/^xmlns:NS\d+/,ra=/^NS\d+:/,ia=[po,vo,{preTransformNode:function(t,e){if("input"===t.tag){var n=t.attrsMap;if(n["v-model"]&&(n["v-bind:type"]||n[":type"])){var r=ve(t,"type"),i=he(t,"v-if",!0),o=i?"&&("+i+")":"",a=null!=he(t,"v-else",!0),s=he(t,"v-else-if",!0),c=fn(t);un(c),fe(c,"type","checkbox"),cn(c,e),c.processed=!0,c.if="("+r+")==='checkbox'"+o,ln(c,{exp:c.if,block:c});var u=fn(t);he(u,"v-for",!0),fe(u,"type","radio"),cn(u,e),ln(c,{exp:"("+r+")==='radio'"+o,block:u});var l=fn(t);return he(l,"v-for",!0),fe(l,":type",r),cn(l,e),ln(c,{exp:i,block:l}),a?c.else=!0:s&&(c.elseif=s),c}}}}],oa={expectHTML:!0,modules:ia,directives:{model:function(t,e,n){var r=e.value,i=e.modifiers,o=t.tag,a=t.attrsMap.type;if(t.component)return me(t,r,i),!1;if("select"===o)!function(t,e,n){var r='var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return '+(n&&n.number?"_n(val)":"val")+"});";r=r+" "+ye(e,"$event.target.multiple ? $$selectedVal : $$selectedVal[0]"),de(t,"change",r,null,!0)}(t,r,i);else if("input"===o&&"checkbox"===a)!function(t,e,n){var r=n&&n.number,i=ve(t,"value")||"null",o=ve(t,"true-value")||"true",a=ve(t,"false-value")||"false";ue(t,"checked","Array.isArray("+e+")?_i("+e+","+i+")>-1"+("true"===o?":("+e+")":":_q("+e+","+o+")")),de(t,"change","var $$a="+e+",$$el=$event.target,$$c=$$el.checked?("+o+"):("+a+");if(Array.isArray($$a)){var $$v="+(r?"_n("+i+")":i)+",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&("+e+"=$$a.concat([$$v]))}else{$$i>-1&&("+e+"=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{"+ye(e,"$$c")+"}",null,!0)}(t,r,i);else if("input"===o&&"radio"===a)!function(t,e,n){var r=n&&n.number,i=ve(t,"value")||"null";ue(t,"checked","_q("+e+","+(i=r?"_n("+i+")":i)+")"),de(t,"change",ye(e,i),null,!0)}(t,r,i);else if("input"===o||"textarea"===o)!function(t,e,n){var r=t.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,c=!o&&"range"!==r,u=o?"change":"range"===r?Li:"input",l="$event.target.value";s&&(l="$event.target.value.trim()"),a&&(l="_n("+l+")");var f=ye(e,l);c&&(f="if($event.target.composing)return;"+f),ue(t,"value","("+e+")"),de(t,u,f,null,!0),(s||a)&&de(t,"blur","$forceUpdate()")}(t,r,i);else if(!Jn.isReservedTag(o))return me(t,r,i),!1;return!0},text:function(t,e){e.value&&ue(t,"textContent","_s("+e.value+")")},html:function(t,e){e.value&&ue(t,"innerHTML","_s("+e.value+")")}},isPreTag:function(t){return"pre"===t},isUnaryTag:mo,mustUseProp:fi,canBeLeftOpenTag:yo,isReservedTag:$i,getTagNamespace:Gt,staticKeys:function(t){return t.reduce(function(t,e){return t.concat(e.staticKeys||[])},[]).join(",")}(ia)},aa=p(function(t){return u("type,tag,attrsList,attrsMap,plain,parent,children,attrs"+(t?","+t:""))}),sa=/^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/,ca=/^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/,ua={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},la=function(t){return"if("+t+")return null;"},fa={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:la("$event.target !== $event.currentTarget"),ctrl:la("!$event.ctrlKey"),shift:la("!$event.shiftKey"),alt:la("!$event.altKey"),meta:la("!$event.metaKey"),left:la("'button' in $event && $event.button !== 0"),middle:la("'button' in $event && $event.button !== 1"),right:la("'button' in $event && $event.button !== 2")},pa={on:function(t,e){t.wrapListeners=function(t){return"_g("+t+","+e.value+")"}},bind:function(t,e){t.wrapData=function(n){return"_b("+n+",'"+t.tag+"',"+e.value+","+(e.modifiers&&e.modifiers.prop?"true":"false")+(e.modifiers&&e.modifiers.sync?",true":"")+")"}},cloak:y},da=function(t){this.options=t,this.warn=t.warn||se,this.transforms=ce(t.modules,"transformCode"),this.dataGenFns=ce(t.modules,"genData"),this.directives=h(h({},pa),t.directives);var e=t.isReservedTag||Bn;this.maybeComponent=function(t){return!e(t.tag)},this.onceId=0,this.staticRenderFns=[]},va=(new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)"),function(t){return function(e){function n(n,r){var i=Object.create(e),o=[],a=[];if(i.warn=function(t,e){(e?a:o).push(t)},r){r.modules&&(i.modules=(e.modules||[]).concat(r.modules)),r.directives&&(i.directives=h(Object.create(e.directives||null),r.directives));for(var s in r)"modules"!==s&&"directives"!==s&&(i[s]=r[s])}var c=t(n,i);return c.errors=o,c.tips=a,c}return{compile:n,compileToFunctions:function(t){var e=Object.create(null);return function(n,r,i){(r=h({},r)).warn,delete r.warn;var o=r.delimiters?String(r.delimiters)+n:n;if(e[o])return e[o];var a=t(n,r),s={},c=[];return s.render=Tn(a.render,c),s.staticRenderFns=a.staticRenderFns.map(function(t){return Tn(t,c)}),e[o]=s}}(n)}}}(function(t,e){var n=sn(t.trim(),e);!1!==e.optimize&&function(t,e){t&&(Po=aa(e.staticKeys||""),Fo=e.isReservedTag||Bn,pn(t),dn(t,!1))}(n,e);var r=yn(n,e);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}})(oa).compileToFunctions),ha=!!Gn&&En(!1),ma=!!Gn&&En(!0),ya=p(function(t){var e=Zt(t);return e&&e.innerHTML}),ga=Rt.prototype.$mount;return Rt.prototype.$mount=function(t,e){if((t=t&&Zt(t))===document.body||t===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=ya(r));else{if(!r.nodeType)return this;r=r.innerHTML}else t&&(r=function(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)),e.innerHTML}(t));if(r){var i=va(r,{shouldDecodeNewlines:ha,shouldDecodeNewlinesForHref:ma,delimiters:n.delimiters,comments:n.comments},this),o=i.render,a=i.staticRenderFns;n.render=o,n.staticRenderFns=a}}return ga.call(this,t,e)},Rt.compile=va,Rt});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(13).setImmediate))

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let Vue = null;

class Notification{

    setVueInstance (instance) { Vue = instance }

    addAlert(statusId, statusType, title, statusMessage, timeoutDelete, href){

        Vue.$notify({
            group: (statusId === undefined) ? 'all' : statusId,
            title: title,
            text: statusMessage,
            type: statusType,
            duration: timeoutDelete,
            speed: 2000,
            data: {id:statusId}
        })

    }

    deleteAlert(arrayStatusId){

        Vue.$notify({
            group: arrayStatusId,
            clean: true
        })

    }

}

/* harmony default export */ __webpack_exports__["a"] = (new Notification());

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: Object({"BROWSER":true}).NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: Object({"BROWSER":true}).NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (Object({"BROWSER":true}).NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    Object({"BROWSER":true}).NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && Object({"BROWSER":true}).NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (Object({"BROWSER":true}).NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (
    Object({"BROWSER":true}).NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(false && isObject(value) && ('@binding' in value))
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (Object({"BROWSER":true}).NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                Object({"BROWSER":true}).NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (Object({"BROWSER":true}).NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (Object({"BROWSER":true}).NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = Object({"BROWSER":true}).NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (Object({"BROWSER":true}).NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (Object({"BROWSER":true}).NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (Object({"BROWSER":true}).NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if (Object({"BROWSER":true}).NODE_ENV !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm;
    vnode.fnOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (Object({"BROWSER":true}).NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (Object({"BROWSER":true}).NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (Object({"BROWSER":true}).NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (Object({"BROWSER":true}).NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (Object({"BROWSER":true}).NODE_ENV !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (Object({"BROWSER":true}).NODE_ENV !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (Object({"BROWSER":true}).NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.13';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (Object({"BROWSER":true}).NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (Object({"BROWSER":true}).NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (Object({"BROWSER":true}).NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */









// add a raw attr (use this in preTransforms)








// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (Object({"BROWSER":true}).NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (Object({"BROWSER":true}).NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    Object({"BROWSER":true}).NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (Object({"BROWSER":true}).NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (Object({"BROWSER":true}).NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (Object({"BROWSER":true}).NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (Object({"BROWSER":true}).NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (Object({"BROWSER":true}).NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue$3);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6), __webpack_require__(13).setImmediate))

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_icon_vue__ = __webpack_require__(16);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4a4e8449_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_icon_vue__ = __webpack_require__(50);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(48)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_icon_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4a4e8449_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_icon_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/icon.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4a4e8449", Component.options)
  } else {
    hotAPI.reload("data-v-4a4e8449", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["v-clipboard"]=t():e["v-clipboard"]=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){var t=document.createElement("textarea"),n=!1;t.value=e,t.style.cssText="position:fixed;pointer-events:none;z-index:-9999;opacity:0;",document.body.appendChild(t),t.select();try{n=document.execCommand("copy")}catch(e){}return document.body.removeChild(t),n};t.default={install:function(e){e.prototype.$clipboard=o,e.directive("clipboard",{bind:function(e,t,n){e.addEventListener("click",function(e){if(t.hasOwnProperty("value")){var r=t.value,c={value:r,srcEvent:e},i=n.context;o(r)?i.$emit("copy",c):i.$emit("copyError",c)}})}})}}}])});
//# sourceMappingURL=index.min.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Modal_vue__ = __webpack_require__(21);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d4961080_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Modal_vue__ = __webpack_require__(60);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(58)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d4961080_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/modal/Modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d4961080", Component.options)
  } else {
    hotAPI.reload("data-v-d4961080", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Show_Balance_vue__ = __webpack_require__(22);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_53087030_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Show_Balance_vue__ = __webpack_require__(64);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(61)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Show_Balance_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_53087030_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Show_Balance_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Balance/Show-Balance.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53087030", Component.options)
  } else {
    hotAPI.reload("data-v-53087030", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Show_Sum_Balances_vue__ = __webpack_require__(25);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0a5495d6_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Show_Sum_Balances_vue__ = __webpack_require__(67);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(65)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Show_Sum_Balances_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0a5495d6_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Show_Sum_Balances_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Balance/Balances/Show-Sum-Balances.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0a5495d6", Component.options)
  } else {
    hotAPI.reload("data-v-0a5495d6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(39);
// On some exotic environments, it's not clear which object `setimmeidate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Wallet_Wallet_vue__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Mining_Mining_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_Wallet_Address_Address_vue__ = __webpack_require__(17);
//
//
//
//
//
//
//
//
//







/* harmony default export */ __webpack_exports__["a"] = ({

    components:{
        Wallet: __WEBPACK_IMPORTED_MODULE_1__Wallet_Wallet_vue__["a" /* default */],
        Mining: __WEBPACK_IMPORTED_MODULE_2__Mining_Mining_vue__["a" /* default */],
    },

    props:[
        "startAutomatically",
    ],

    data: () => {
        return {
            addresses: [],
            currency: "0x01",
        }
    },

    mounted(){

        if (typeof window === "undefined") return ;

          WebDollar.Blockchain.Wallet.emitter.on("wallet/address-changes", (address)=>{
              console.log("wallet/address-changes", address);
              this.addNewAddress(address);
          });

          WebDollar.Blockchain.Wallet.emitter.on("wallet/changes", ()=>{
              this.loadAllAddresses();
          });

        this.loadAllAddresses();

    },

    methods: {

        loadAllAddresses(){

            for (let index in this.addresses){
                WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[index ].subscription);
                this.addresses[ index ].subscription = null;
                console.log("unsubscribe....");
            }

            this.addresses = [];

            for (let i=0; i<WebDollar.Blockchain.Wallet.addresses.length; i++) {
                this.addAddressToWalletWatch(WebDollar.Blockchain.Wallet.addresses[i].address);
            }

        },

        addNewAddress(address){

            if (address === null || address === undefined) return false;

            for (let i=0; i<this.addresses.length; i++)
                if (address.toString() === this.addresses[i].address.toString()){
                    return false;
                }

            this.addAddressToWalletWatch(address);
        },


        addAddressToWalletWatch(address){

            let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{

                for (let i=0; i<this.addresses.length; i++)
                    if (this.addresses[i].address === address ){

                        this.addresses[i].balances = data.balances;
                        this.addresses[i] = Object.assign( {}, this.addresses[i], { });

                        this.$refs['refMining'].$refs['refShowSumBalances'].refreshSum(this.addresses, this.currency);
                        this.$refs['refMining'].$refs['refShowSumAvailableBalances'].refreshSum(this.addresses, this.currency);
                        this.$refs['refMining'].$refs['refShowSumPotentialBalances'].refreshSum(this.addresses, this.currency);

                        this.$refs['refWallet'].$refs['refShowSumBalances'].refreshSum(this.addresses, this.currency);

                        break;
                    }

                // immutable array
                // this.addresses = Object.assign( {}, this.addresses, { });

                this.$forceUpdate();

            });

            if (data !== null && data.result) {

                let element =  {address: address, balances: data.balances, subscription: data.subscription};
                this.addresses.push (element);

            }

        },

        deleteAddress(address){

            if (address === null || address === undefined) return false;

            for (let keyAddress in this.addresses)
                if (address.toString() === this.addresses[keyAddress].address.toString()){

                    WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[keyAddress].subscription);
                    this.addresses.splice(i,1);
                    return true;
                }

            return false;
        },

    }

});


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_icons_icon_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Address_Address_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_helpers_Browser_helpers__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Address_Balance_Balances_Show_Sum_Balances_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

    var Vue = __webpack_require__(4);

    
    
    
    
    

    /* harmony default export */ __webpack_exports__["a"] = ({

        components:{
            icon: __WEBPACK_IMPORTED_MODULE_0_components_UI_icons_icon_vue__["a" /* default */],
            "Address": __WEBPACK_IMPORTED_MODULE_1__Address_Address_vue__["a" /* default */],
            ShowSumBalances: __WEBPACK_IMPORTED_MODULE_3__Address_Balance_Balances_Show_Sum_Balances_vue__["a" /* default */],
        },

        props: ['addresses', 'currency'],

        data:  () => {
            return {
                opened: false,
                balanceHover: false,
                miningAddress: '',

                isMobile:false,

                sendingMoney:{},
                receivingMoney:{},

                walletButtonMarginOpened: 0,
                walletButtonMarginClosed: 0,
                buttonTopDistanceOpen: 0,
                buttonTopDistanceClose: 0,
                walletMarginOpened: 0,
                walletMarginClosed: 0,
                walletMenuMarginTopOpen: 0,
                walletMenuMarginTopClose: 0,
                walletMenuHeightOpen: 0,
                walletMenuHeightClosed: 0,
                walletContentHeight: 315,
                walletButtonRadiusLeftOpen: 0,
                walletButtonRadiusLeftClose: 0,
                walletButtonRadiusRightOpen: 0,
                walletButtonRadiusRightClose: 0,
            }
        },

        mounted(){

            //in browser
            if (typeof window === "undefined") return false;

            this.changeScreenBehavior();
            __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].setVueInstance(this);

            WebDollar.StatusEvents.on("blockchain/mining/address", (data)=>{
                this.miningAddress = data.address;
            });
            this.miningAddress = WebDollar.Blockchain.Mining.minerAddress;

            //onLoad
            __WEBPACK_IMPORTED_MODULE_2_helpers_Browser_helpers__["a" /* default */].addEvent(window, "load", (event) => {
                this.changeScreenBehavior();
                this.walletResizeFix();
            });

          //onResize
            __WEBPACK_IMPORTED_MODULE_2_helpers_Browser_helpers__["a" /* default */].addEvent(window, "resize", (event) => {
                this.changeScreenBehavior();
                this.walletResizeFix();
            });

        },

        computed:{

            isSendingMoney(){
                return Object.keys(this.sendingMoney).length !== 0;
            },

            isReceivingMoney(){
                return Object.keys(this.receivingMoney).length !== 0;
            }

        },

        methods: {

            changeScreenBehavior(){

                if (this.$refs['walletMenuButton'] === undefined) {
                    console.log("not ready..");
                    return;
                }

                if (window.screenWidth < 831){

                    this.isMobile = true;

                    this.walletButtonMarginOpened = 452;
                    this.walletButtonMarginClosed = 43;

                    this.walletMarginOpened = 42;
                    this.walletMarginClosed = -325;

                    this.buttonTopDistanceOpen = '0';
                    this.buttonTopDistanceClose = 'auto';

                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;
                    this.walletMenuMarginTopClose='0';

                    this.walletMenuHeightOpen='100%';
                    this.walletMenuHeightClosed='358px';

                    this.walletContentHeight= window.outerHeight-110;

                    this.walletButtonRadiusLeftOpen= 0;
                    this.walletButtonRadiusLeftClose= 0;

                    this.walletButtonRadiusRightOpen= 0;
                    this.walletButtonRadiusRightClose= 0;

                }else{

                    this.isMobile=false;

                    this.walletContentHeight= 315;

                    this.walletButtonMarginOpened = 392;
                    this.walletButtonMarginClosed = 30;

                    this.walletMarginOpened = 34;
                    this.walletMarginClosed = -325;

                    this.buttonTopDistanceOpen = 'auto';
                    this.buttonTopDistanceClose = 'auto';

                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;
                    this.walletMenuMarginTopClose='0';

                    this.walletMenuHeightOpen='358px';
                    this.walletMenuHeightClosed='0';

                    this.walletButtonRadiusLeftOpen= 60;
                    this.walletButtonRadiusLeftClose= 60;

                    this.walletButtonRadiusRightOpen= 0;
                    this.walletButtonRadiusRightClose= 0;

                }

            },

            toggleWallet(){

                this.opened = !this.opened;

                if(window.screenWidth < 831){
                    if (this.opened===true)
                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');
                    else
                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');

                }else
                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');


            },

            walletResizeFix(){

                if(window.screenWidth < 831)
                    if (this.opened===true)
                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');
                    else
                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');

                else
                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');


            },

            handleAddNewAddress(){

                if (WebDollar.Blockchain.Wallet.addresses.length <= 2) {

                    WebDollar.Blockchain.Wallet.createNewAddress();
                    __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "success", "Wallet Success", WebDollar.Blockchain.Wallet.addresses[WebDollar.Blockchain.Wallet.addresses.length-1].address + " has been added to your wallet!", 5000);

                } else {

                    __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "warn", "Wallet Warning", "You can't add new address if you already have 3 addresses", 5000);

                }

            },

            async handleImportAddress(){

                // dropzone tutorial https://www.html5rocks.com/en/tutorials/file/dndfiles/

                // Check for the various File API support.
                if ((window.File && window.FileReader && window.FileList && window.Blob) === false){
                    __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Import Error", "The File import is not fully supported in this browser", 5000);
                }

                let fileInput = this.$refs['importedAddress'];

                if ('files' in fileInput) {
                    if (fileInput.files.length === 0) {
                        __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Import Error", "No file selected", 5000);
                    } else {

                        for (let i = 0; i < fileInput.files.length; i++) {

                            let file = fileInput.files[i];
                            let extension = file.name.split('.').pop();

//                            console.log(file);
//                            console.log(extension);

                            if (extension === "webd") {
                                let reader = new FileReader();

                                try {
                                    reader.onload = async (e) => {

                                        //console.log(reader.result);
                                        let data = JSON.parse(reader.result);

                                        let answer = await WebDollar.Blockchain.Wallet.importAddressFromJSON(data);

                                        if (answer.result === true){
                                            __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "success", "Import Success", answer.address + " has been imported!", 5000);
                                        } else {
                                            __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Import Error", answer.message, 5000);
                                        }

                                    };

                                } catch (exception){
                                    __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Import Error","Your Uploaded file is not a valid JSON format", 5000);
                                }

                                reader.readAsText(file);
                            } else {
                                __WEBPACK_IMPORTED_MODULE_4_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error","Import Error", "File not supported!", 5000);
                            }

                        }


                    }
                }



            },


            handlePendingTransactionsChanges(){

                this.receivingMoney = {};
                this.sendingMoney = {};

                let i=-1;
                while (1===1){

                    i++;
                    let element = this.$refs['address'+i];
                    if (element === undefined) break;

                    element = element[0];

                    for (let key in element.receivingMoney)
                        Vue.set(this.receivingMoney, key, element.receivingMoney[key]);

                    for (let key in element.sendingMoney)
                        Vue.set(this.sendingMoney, key, element.sendingMoney[key]);

                }

            },


        }

    });



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

    props:{
        icon: {default: ''},
        style: {default: ''},
        width: {default: 24},
        height: {default: 24},
    },

    methods:{

        handleClick(e){
            this.$emit('click',e );
        }

    }

});


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Address_vue__ = __webpack_require__(18);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fd10b33_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Address_vue__ = __webpack_require__(97);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(51)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Address_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fd10b33_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Address_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Address.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6fd10b33", Component.options)
  } else {
    hotAPI.reload("data-v-6fd10b33", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_UI_icons_icon_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Modals_Main_Modal_Address_main_modal_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Modals_Lock_modal_vue__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Modals_Delete_modal_vue__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_Wallet_Address_Balance_Show_Balance_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_helpers_Browser_helpers__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_helpers_Notification_helpers__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//












/* harmony default export */ __webpack_exports__["a"] = ({

    //@onPendingTransactionsChanges
    props:{
        address:{default:''},
        isMiningAddress: {default: false}
    },

    components:{ AddressMainModal: __WEBPACK_IMPORTED_MODULE_3__Modals_Main_Modal_Address_main_modal_vue__["a" /* default */], LockModal: __WEBPACK_IMPORTED_MODULE_4__Modals_Lock_modal_vue__["a" /* default */], DeleteModal: __WEBPACK_IMPORTED_MODULE_5__Modals_Delete_modal_vue__["a" /* default */], ShowBalance: __WEBPACK_IMPORTED_MODULE_6_components_Wallet_Address_Balance_Show_Balance_vue__["a" /* default */], icon: __WEBPACK_IMPORTED_MODULE_2_components_UI_icons_icon_vue__["a" /* default */] },

    computed: {

        getAddressPic(){
            return WebDollar.Blockchain.Wallet.getAddressPic(this.address);
        },

        isEncrypted(){

        }

    },

    data: () => {
        return {
            addressLocked: false,
            isMining: WebDollar.Blockchain.Mining.workers.workers,

            sendingMoney: {},
            receivingMoney: {},

            subscriptionTransactions: null,

            transactions: {},
        }
    },

    async mounted(){

        if (typeof window === 'undefined') return;

        __WEBPACK_IMPORTED_MODULE_8_helpers_Notification_helpers__["a" /* default */].setVueInstance(this);

        if (await WebDollar.Blockchain.Wallet.isAddressEncrypted(this.address)){
            this.addressLocked = true;
        }

        //subscribe to transactions changes
        let data = WebDollar.Blockchain.Transactions.subscribeTransactionsChanges(this.address, (data)=>{

            if (data.transaction !== undefined)
                this._addTransaction (data.transaction);
            else
                __WEBPACK_IMPORTED_MODULE_0_vue__["default"].delete(this.transactions, data.txId);

        });

        if (data !== null && data.result) {
            this.subscription = data.subscription;
            this._addTransactions(data.transactions);
        }

    },

    methods:{

        formatMoneyNumber: __WEBPACK_IMPORTED_MODULE_7_helpers_Browser_helpers__["a" /* default */].formatMoneyNumber,

        handleTransferFunds(e){

            this.$refs['refAddressMainModal'].showModal(e);

        },

        checkIfWalletIsLock(){
            if (WebDollar.Blockchain.Wallet.isAddressEncrypted(this.address)){
                this.addressLocked = true;
            }
        },

        async handleExport(e){

            if (this.addressLocked === false){
                __WEBPACK_IMPORTED_MODULE_8_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "info", "Export Warning", "The exported address is not encrypted and can be accessed by anyone who has a copy of the file. We recommend deleting the previous downloaded file and exporting your encrypted wallet.", 20000);
            }

            let answer = await WebDollar.Blockchain.Wallet.exportAddressToJSON(this.address);

            if (answer.result){

                let addressFile = new Blob([JSON.stringify(answer.data)], {type: "application/json;charset=utf-8"});
                let fileName = "WEBD$" + WebDollar.Blockchain.Wallet.getUnencodedAddress(this.address).toString("hex") + ".webd";
                __WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver___default.a.saveAs(addressFile, fileName);
                __WEBPACK_IMPORTED_MODULE_8_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "success", "Export Success", "Your address has been exported.", 5000);

            } else {
                __WEBPACK_IMPORTED_MODULE_8_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Export Error", answer.message, 5000);
            }

        },

        handleLock(e){

            this.$refs['refLockModal'].showModal(e);
            this.verifyIfBecomeLocked(0);

        },

        verifyIfBecomeLocked(calledTime){

            this.checkIfWalletIsLock();

            setInterval(function(){

                if(this.addressLocked===false){

                    if (calledTime < 100){
                        this.verifyIfBecomeLocked(calledTime+1)
                    }

                }

            }, 2000);

        },

        handleDelete(e){

            this.$refs['refDeleteModal'].showModal(e);

        },

        _addTransaction(transaction){
            // in case it is a new transaction
            __WEBPACK_IMPORTED_MODULE_0_vue__["default"].set(this.transactions, transaction.txId, transaction);

            this._processTransactions();
        },

        _addTransactions(transactions){

            for (let key in transactions)
                this._addTransaction(transactions[key]);

        },

        _processTransactions(){

            this.receivingMoney = {};
            this.sendingMoney = {};

            for (let key in this.transactions){

                let transaction = this.transactions[key] ;

                if (transaction.confirmed) {

                    __WEBPACK_IMPORTED_MODULE_0_vue__["default"].delete(this.receivingMoney, key);
                    __WEBPACK_IMPORTED_MODULE_0_vue__["default"].delete(this.sendingMoney, key);

                } else {

                    // check if it is receiving or sending

                    let found = false;
                    transaction.from.addresses.forEach((address)=>{

                        if (!found && address.address === this.address)
                            found = true;
                    });

                    if (found) {
                        __WEBPACK_IMPORTED_MODULE_0_vue__["default"].set(this.sendingMoney, key, transaction);
                        continue;
                    }

                    transaction.to.addresses.forEach((address)=>{

                        if (!found && address.address === this.address)
                            found = true;

                    });

                    if (found)
                        __WEBPACK_IMPORTED_MODULE_0_vue__["default"].set(this.receivingMoney, key, transaction );
                }
            }

            this.$emit("onPendingTransactionsChanges", this.receivingMoney, this.sendingMoney );

        }
    }

});


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if (("function" !== "undefined" && __webpack_require__(53) !== null) && (__webpack_require__(54) !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard_dist_index_min__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard_dist_index_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard_dist_index_min__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_Wallet_Address_Balance_Show_Balance_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_Wallet_Address_Balance_Balances_Show_Sum_Balances_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_UI_icons_icon_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__parts_Transactions_Transactions_part_vue__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__parts_Transfer_part_vue__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_helpers_Notification_helpers__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var Vue = __webpack_require__(4);












Vue.use(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard_dist_index_min___default.a);

/* harmony default export */ __webpack_exports__["a"] = ({

    props: {
        address: {default: null},
        isMiningAddress: {default: false},
    },

    components: {
        ShowBalance: __WEBPACK_IMPORTED_MODULE_2_components_Wallet_Address_Balance_Show_Balance_vue__["a" /* default */],
        Modal: __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__["a" /* default */],
        Transactions: __WEBPACK_IMPORTED_MODULE_5__parts_Transactions_Transactions_part_vue__["a" /* default */],
        Transfer: __WEBPACK_IMPORTED_MODULE_6__parts_Transfer_part_vue__["a" /* default */],
        icon: __WEBPACK_IMPORTED_MODULE_4_components_UI_icons_icon_vue__["a" /* default */],
        ShowPotentialBalance: __WEBPACK_IMPORTED_MODULE_3_components_Wallet_Address_Balance_Balances_Show_Sum_Balances_vue__["a" /* default */]
    },

    data: () => {
        return {
            partActivated : 'none',

            clipboardText: 'Copy Address',
        }
    },

    computed:{
        getAddressPic(){
            return WebDollar.Blockchain.Wallet.getAddressPic(this.address);
        }
    },

    methods: {

        showTransfer() {
            this.partActivated = "transfer";
        },

        showBuy() {
            this.partActivated = "buy/sell";
        },
        showTransactions(){
            this.partActivated = "transactions";
        },

        closeModal() {
            this.$refs['refModal'].closeModal();
        },

        showModal(e) {
            if (this.$refs['refModal'].modalOpened === false){
                this.$refs['refModal'].showModal();
            }
            this.clipboardText= 'Copy Address';
        },
        copyToClipboard(){
            this.clipboardText = 'Copied';
            this.$clipboard(this.address);
        },

        handleSetAddress(){
            WebDollar.Blockchain.Mining.minerAddress = this.address;
            __WEBPACK_IMPORTED_MODULE_7_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "success", "Mining Address Changed", "You're mining now on " + this.address ,5000);
        },

        handleTransferSuccess(){
            this.showTransactions();
        }

    },

    mounted() {

        if (typeof window === 'undefined') return;

        __WEBPACK_IMPORTED_MODULE_7_helpers_Notification_helpers__["a" /* default */].setVueInstance(this);

    },

});



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_icons_icon_vue__ = __webpack_require__(8);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({

    name: "Modal",

    data: () => {
        return {
            modalOpened: false,
        }
    },

    props:{

        title: {default: 'Modal Title'},
        buttons: {default: ()=>{return [{text:"cancel"}]}}

    },

    methods:{

        closeModal(e){

            if( e !== undefined) e.stopPropagation();

            this.modalOpened = false;

        },

        showModal(e){

            if (e !== undefined) e.stopPropagation();

            this.modalOpened = true;
        },

    }

});



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_elements_Loading_Spinner_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_helpers_Browser_helpers__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({

    components:{
        LoadingSpinner: __WEBPACK_IMPORTED_MODULE_0_components_UI_elements_Loading_Spinner_vue__["a" /* default */],
    },

    props: ['address', 'currency', 'showPoolReward'],

    data(){
      return {

          balances: {},
          subscription: null,
          loaded: WebDollar.Blockchain.loaded||false,

          minerPoolTotalReward: 0,
          minerPoolConfirmedReward: 0,

          minerPoolReferralTotalReward: 0,
          minerPoolReferralConfirmedReward: 0,

        }
    },

    computed:{

        computePrice(){

            if (this.balances === null || this.balances === undefined || !this.balances.hasOwnProperty(this.currency)) return 0;

            return (this.balances[this.currency]);
        },

        computePoolReward(){

            return this.minerPoolTotalReward + this.minerPoolConfirmedReward + this.minerPoolReferralTotalReward + this.minerPoolReferralConfirmedReward;

        }

    },

    mounted(){

        if (typeof window === "undefined") return;

        this.currency = this.currency || '0x01';

        let address = this.address;
        if (typeof this.address === "object" && typeof this.address.hasOwnProperty("address") ) { //it is an address object
            address = this.address.address;
        }

        WebDollar.StatusEvents.emitter.on("blockchain/status", (data)=>{

            if (data.message === "Blockchain Ready to Mine")
                this.loaded = true;

        });

        let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{
            this.balances = data.balances;
        });

        if (data !== null && data.result) {
            this.subscription = data.subscription;
            this.balances = data.balances;
        }



        //pool reward

        if (WebDollar.Blockchain.MinerPoolManagement !== undefined) {
            this.minerPoolTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReward;
            this.minerPoolConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReward;
            this.minerPoolReferralTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReferralReward;
            this.minerPoolReferralConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReferralReward;
        }

        WebDollar.StatusEvents.on("miner-pool/total-reward", data=>  this.minerPoolTotalReward = data.totalReward );
        WebDollar.StatusEvents.on("miner-pool/confirmed-reward", data=>  this.minerPoolConfirmedReward = data.confirmedReward );

        WebDollar.StatusEvents.on("miner-pool/referral-total-reward", data=>  this.minerPoolReferralTotalReward = data.referralTotalReward );
        WebDollar.StatusEvents.on("miner-pool/referral-confirmed-reward", data=>  this.minerPoolReferralConfirmedReward = data.referralConfirmedReward );

    },

    watch: {

        address: function (newVal, oldVal) { // watch it

            WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.subscription);

            let address = newVal;
            if (typeof newVal === "object" && typeof newVal.hasOwnProperty("address") ) { //it is an address object
                address = newVal.address;
            }

            let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{
                console.log("balance changed");
                this.balances = data.balances;
            });

            if (data !== null && data.result) {
                this.subscription = data.subscription;
                this.balances = data.balances;
            }

        },

        currency: function (newVal, oldVal) { // watch it

        },

        showPoolReward: function (newVal, oldVal) { // watch it

        }


    },

    methods:{

        formatMoneyNumber: __WEBPACK_IMPORTED_MODULE_1_helpers_Browser_helpers__["a" /* default */].formatMoneyNumber,

    }

});



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Loading_Spinner_vue__ = __webpack_require__(24);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f5858e2a_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Loading_Spinner_vue__ = __webpack_require__(63);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Loading_Spinner_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f5858e2a_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Loading_Spinner_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/elements/Loading-Spinner.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f5858e2a", Component.options)
  } else {
    hotAPI.reload("data-v-f5858e2a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

    props:{
        width: {default: '40px'},
        height: {default: '40px'},
    }

});



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_elements_Loading_Spinner_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_helpers_Browser_helpers__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({

    components:{
        LoadingSpinner: __WEBPACK_IMPORTED_MODULE_0_components_UI_elements_Loading_Spinner_vue__["a" /* default */],
    },

    props: ['addresses', 'currency', 'showPoolReward'],

    data(){
      return {
          sum: 0,

          subscription: null,
          loaded: WebDollar.Blockchain.loaded||false,

          minerPoolTotalReward: 0,
          minerPoolConfirmedReward: 0,

          minerPoolReferralTotalReward: 0,
          minerPoolReferralConfirmedReward: 0,
        }
    },

    mounted(){

        if (typeof window === "undefined") return;

        WebDollar.StatusEvents.emitter.on("blockchain/status", (data)=>{

            if (data.message === "Blockchain Ready to Mine")
                this.loaded = true;

        });

        //pool reward

        if (WebDollar.Blockchain.MinerPoolManagement !== undefined) {
            this.minerPoolTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReward;
            this.minerPoolConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReward;

            this.minerPoolReferralTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReferralReward;
            this.minerPoolReferralConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReferralReward;
        }

        WebDollar.StatusEvents.on("miner-pool/total-reward", data => this.minerPoolTotalReward = data.totalReward );
        WebDollar.StatusEvents.on("miner-pool/confirmed-reward", data =>  this.minerPoolConfirmedReward = data.confirmedReward );

        WebDollar.StatusEvents.on("miner-pool/referral-total-reward", data=>  this.minerPoolReferralTotalReward = data.referralTotalReward );
        WebDollar.StatusEvents.on("miner-pool/referral-confirmed-reward", data=>  this.minerPoolReferralConfirmedReward = data.referralConfirmedReward );

    },

    methods:{

        refreshSum(addresses, currency){

            let newSum = 0;

            //it should use BigNumber as math...

            if (addresses === undefined || addresses === null) return ;

            for (let index in addresses){

                if (addresses[index].balances !== undefined && addresses[index].balances !== null && addresses[index].balances[currency] !== undefined)
                    newSum += parseFloat( addresses[index].balances[currency]);
            }

            this.sum = newSum;

            if (this.sum!==0){

                this.sum = this.sum;

            }

        },

        formatMoneyNumber: __WEBPACK_IMPORTED_MODULE_1_helpers_Browser_helpers__["a" /* default */].formatMoneyNumber,

    },

    watch: {
        addresses: function (newVal, oldVal) { // watch it

            this.refreshSum(newVal, this.currency);

        },

        currency: function (newVal, oldVal) { // watch it

            this.refreshSum(this.addresses, newVal);

        },

        showPoolReward: function (newVal, oldVal) { // watch it

            this.refreshSum(this.addresses, this.currency);

        }

    },

    computed:{

        computePoolReward(){

            return this.minerPoolTotalReward + this.minerPoolConfirmedReward + this.minerPoolReferralTotalReward + this.minerPoolReferralConfirmedReward;

        }

    },


});



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Transaction_element_vue__ = __webpack_require__(71);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({

    components:{ Transaction: __WEBPACK_IMPORTED_MODULE_1__Transaction_element_vue__["a" /* default */] },

    props:{
        address: {default: null},
    },

    data: ()=>{
        return {
            transactions : {},
            subscription: null,
            transactionsLength: 0,
        }
    },

    mounted(){

        if (typeof window === "undefined") return false;

        //subscribe to transactions changes
        let data = WebDollar.Blockchain.Transactions.subscribeTransactionsChanges(this.address, (data)=>{

            if (data.transaction !== undefined)
                this._addTransaction (data.transaction);
            else
                __WEBPACK_IMPORTED_MODULE_0_vue__["default"].delete(this.transactions, data.txId );

            this.$forceUpdate();

        });

        if (data !== null && data.result) {
            this.subscription = data.subscription;
            this._addTransactions(data.transactions);
        }

    },

    computed: {

        orderedTransactions() {

            let sortable = [];
            for (let i in this.transactions) {
                sortable.push( this.transactions[i] );
            }

            return sortable.sort(function(a, b) {
                return a._index - b._index;
            });

        }
    },

    methods:{

        _addTransaction(transaction){

            // in case it is a new transaction
            if (this.transactions[transaction.txId] === undefined) {
                transaction._index =  -( ++this.transactionsLength );
            }

            let oldTransaction = this.transactions[transaction.txId];

            __WEBPACK_IMPORTED_MODULE_0_vue__["default"].set(this.transactions, transaction.txId, transaction);

            if (transaction.confirmed && (oldTransaction !== undefined && oldTransaction.confirmed === false)){
                Notification.addAlert("error-firewall", "success", "Transaction Confirmed", "Transaction to "+ this.toAddress + " with " +  BrowserHelpers.formatMoneyNumber(amountToSend)+"WEBD has been confirmed.",5000);
            }

        },

        _addTransactions(transactions){

            for (let key in transactions)
                this._addTransaction(transactions[key]);

        },

        objectIsEmpty(obj) {

            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // If it isn't an object at this point
            // it is empty, but it can't be anything *but* empty
            // Is it empty?  Depends on your application.
            if (typeof obj !== "object") return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }

            return true;
        }

    }

});


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Transaction_From_element_vue__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Transaction_To_element_vue__ = __webpack_require__(78);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({

    components:{ TransactionFrom: __WEBPACK_IMPORTED_MODULE_0__Transaction_From_element_vue__["a" /* default */], TransactionTo: __WEBPACK_IMPORTED_MODULE_1__Transaction_To_element_vue__["a" /* default */] },

    props:{
        transaction : {default: ()=>{return null} },
    }

});



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var Vue = __webpack_require__(4);



Vue.use(__WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min___default.a);

/* harmony default export */ __webpack_exports__["a"] = ({

    props:{
        fromAddress: {default: null},
    },

    computed:{
        getAddressPic(){
            return WebDollar.Blockchain.Wallet.getAddressPic(this.fromAddress.address);
        },

        getAmount(){
            return this.fromAddress.amount / WebDollar.Applications.CoinsHelper.WEBD
        }
    },

    methods:{

        copyToClipboard(){
            this.$clipboard(this.fromAddress.address);
        },

    }

});



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var Vue = __webpack_require__(4);



Vue.use(__WEBPACK_IMPORTED_MODULE_0__node_modules_v_clipboard_dist_index_min___default.a);

/* harmony default export */ __webpack_exports__["a"] = ({

    props:{
        toAddress: {default: null},
    },

    computed:{
        getAddressPic(){
            return WebDollar.Blockchain.Wallet.getAddressPic(this.toAddress.address);
        },

        getAmount(){
            return this.toAddress.amount / WebDollar.Applications.CoinsHelper.WEBD
        }

    },

    methods:{

        copyToClipboard(){
            this.$clipboard(this.toAddress.address);
        },

    }

});



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_helpers_Notification_helpers__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_helpers_Browser_helpers__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({

    //@onTransferSuccess
    props:{
        address: {default: null},
    },

    data: () => {
        return {
            toAddress: '',
            toAmount: '',
            fee: '',

            errorMessage: '',
            errorToAddressMessage: '',
            errorToAmountMessage: '',
            successMessage: '',
        }
    },

    mounted(){

        if (typeof window === 'undefined') return;

        __WEBPACK_IMPORTED_MODULE_0_helpers_Notification_helpers__["a" /* default */].setVueInstance(this);

    },

    computed:{

        getAddressPic(){

            return WebDollar.Blockchain.Wallet.getAddressPic(this.toAddress);

        }

    },

    methods:{

        async handleCreateTransaction(){

            this.toAmount = Number(this.toAmount);
            this.fee = Number(this.fee);

            this.handleChangeToAddress();

            if (this.fee === 0) {
                this.errorToAmountMessage = 'Fee should not be 0';
                return false;
            }

            if (this.fee * WebDollar.Applications.CoinsHelper.WEBD < WebDollar.Applications.CONSTS.MINING_POOL.MINING.FEE_THRESHOLD){
                this.errorToAmountMessage = 'Fee is too small, and miners won\'t process your transaction';
                return false;
            }

            if (this.errorToAddressMessage !== '' || this.errorToAmountMessage !== '' ) return false;

            let amountToSend = parseInt(this.toAmount * WebDollar.Applications.CoinsHelper.WEBD);
            let feeToSend = parseInt(this.fee * WebDollar.Applications.CoinsHelper.WEBD);
            let answer = await WebDollar.Blockchain.Transactions.wizard.createTransactionSimple( this.address, this.toAddress, amountToSend, feeToSend );

            if (answer.result){

                __WEBPACK_IMPORTED_MODULE_0_helpers_Notification_helpers__["a" /* default */].addAlert("error-firewall", "warn", "Transaction Created", "Transaction to "+ this.toAddress + " with " +  __WEBPACK_IMPORTED_MODULE_1_helpers_Browser_helpers__["a" /* default */].formatMoneyNumber(amountToSend)+"WEBD has been created.",5000);

                this.toAddress = '';
                this.toAmount = '';
                this.fee = '';

                this.$emit('onTransferSuccess', answer.message);

            } else {
                this.errorMessage = answer.message;
                this.successMessage = '';
            }

        },

        handleChangeToAddress(e){

            try {

                if ( WebDollar.Applications.AddressHelper.getUnencodedAddressFromWIF(this.toAddress) === null ) {
                    this.errorToAddressMessage = 'Invalid Address';
                    return false;
                }

            } catch (exception){
                this.errorToAddressMessage = 'Invalid Address';
                return false;
            }

            this.errorToAddressMessage = '';

        },

        decimalPlaces(num) {
            var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) { return 0; }
            var decimalsNumber= Math.max(
                0,
                (match[1] ? match[1].length : 0)
                - (match[2] ? +match[2] : 0));

            if (decimalsNumber>4) return parseFloat(num).toFixed(4);
                else return num;
        },

        handleChangeToAmount(e){

            this.toAmount = this.decimalPlaces(this.toAmount);

            this.errorToAmountMessage = '';

            this.fee = WebDollar.Blockchain.Transactions.wizard.calculateFeeSimple ( this.toAmount * WebDollar.Applications.CoinsHelper.WEBD) / WebDollar.Applications.CoinsHelper.WEBD;

            try {

                let balance = WebDollar.Blockchain.blockchain.accountantTree.getBalance(this.address, undefined);

                if (balance === null) throw "Balance is empty";

                let total = (parseFloat(this.toAmount) + this.fee ) * WebDollar.Applications.CoinsHelper.WEBD;

                if ( balance < total ) {
                    console.error("Insufficient funds", {balance:balance, toAmount: this.toAmount, fee:this.fee})
                    throw "Insufficient Funds";
                }

            } catch (exception){

                if (typeof exception === "string")
                    this.errorToAmountMessage = exception.toString();
                else
                    this.errorToAmountMessage = exception.message;

                this.fee = '';
            }

            if (this.fee===0 || this.fee===undefined || this.errorToAmountMessage!==''){

                this.fee = 10;

            }

        },

        handleChangeToFee(e){

            this.fee = this.decimalPlaces(this.fee);

            this.errorToAmountMessage = '';

        }

    },


});


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({

    props: {
        address: {default: null},
        toAddress: {default: null},
        toAmount: {default: 0.0},
    },

    components: {
        "Modal":__WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__["a" /* default */],
    },

    data: () => {
        return {
            walletAddressPassword: '',
        }
    },

    methods: {

        closeModal() {

            this.walletAddressPassword = "";
            this.$refs['refPassModal'].closeModal();

        },

        showModal(e) {

            if (this.$refs['refPassModal'].modalOpened === false){
                this.$refs['refPassModal'].showModal();
            }

        },

        copyToClipboard(){

            this.$clipboard(this.walletAddressPassword.trim());

        },

        getRandomArbitraryNumber(min, max) {

            return Math.floor(Math.random()*(max-min+1)+min);

        },

        generateRandomWord() {

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            let numberLength = this.getRandomArbitraryNumber(5,8);

            for (var i = 0; i < numberLength; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;

        },

        generateRandomPassword(){

            this.walletAddressPassword = '';

            for (let i = 0; i < 12; ++i){

                let randomWord = this.generateRandomWord();
                let index = this.walletAddressPassword.lastIndexOf(randomWord);

                if (index === -1){
                    this.walletAddressPassword += randomWord;
                    if (i < 11)
                        this.walletAddressPassword += " ";
                } else {
                    i--;
                }
            }

        },

        async createPassword(){

            if (this.walletAddressPassword === null || this.walletAddressPassword === undefined)
                __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Password Error", "Your password is invalid!", 5000);

            let okPassword = true;
            let wordsArray = [];
            let wordsArraySize = 0;

            this.walletAddressPassword = this.walletAddressPassword.trim();
            if (0 < this.walletAddressPassword.length) {
                wordsArray = this.walletAddressPassword.split(' ');
                wordsArraySize = wordsArray.length;
            }

            if (wordsArraySize !== 12){

                __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Password Error", "The password should contain 12 words, but you have " + wordsArraySize + " words.", 5000);
                okPassword = false;

            }

            if (okPassword === true){

                for (let i = 0; i < wordsArraySize; i++){

                    let index = wordsArray.lastIndexOf(wordsArray[i]);

                    if  (index !== i){

                        __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "error", "Password Error", "The password should contain different words, but you are repeating "+wordsArray[i]+" word.", 5000);
                        okPassword = false;

                    }

                }

            }

            if(okPassword === true){

                await this.setPassword(wordsArray);
            }


        },

        async setPassword(wordsArray){

            let response = await WebDollar.Blockchain.Wallet.encryptAddress(this.address, wordsArray);

            if (response === true) {

                __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "success", "Successful Ecrypted", this.address + " has been encrypted.", 5000);
                __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "info", "Password Backup", "We have downloaded for you a backup file of the password", 6000);

                this.handleExportPassword(this.address);
                this.closeModal();

            }

            return response;
        },

        handleExportPassword(address){

            let addressFile = new Blob([this.walletAddressPassword], {type: "application/text;charset=utf-8"});

            let fileName = "Password-"+address.replace('+','').replace('=','')+".txt";
            __WEBPACK_IMPORTED_MODULE_1__node_modules_file_saver___default.a.saveAs(addressFile, fileName);

        },

    },

    mounted() {

        if (typeof window === 'undefined')
            return;

        this.walletAddressPassword = "";
        __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].setVueInstance(this);

    },

});



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


let Vue = __webpack_require__(4);





Vue.use(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default.a);

/* harmony default export */ __webpack_exports__["a"] = ({

    props: {
        address: {default: null},
        toAddress: {default: null},
        toAmount: {default: 0.0},

    },

    components: {
        "Modal":__WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__["a" /* default */],
    },

    data: () => {
        return {
            inputValue: ''
        }
    },

    methods: {

        async deleteAddress(){

            if (this.inputValue.toUpperCase().trim().toUpperCase() === 'DELETE'){

                // WebDollar.Blockchain.wallet. - DELETE
                let answer = await WebDollar.Blockchain.Wallet.deleteAddress(this.address);

                if(answer.result===true) __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].addAlert(undefined, "success", "Delete Succeeded", this.address + " has been deleted!", 5000);

            }

            this.closeModal();

        },

        closeModal(e) {
            this.inputValue = "";
            if (this.$refs['refModal'] !== undefined)
                this.$refs['refModal'].closeModal(e);
        },

        showModal(e) {

            if (this.$refs['refModal'].modalOpened === false){
                console.log("shooow modal");
                this.$refs['refModal'].showModal(e);
            }

        }

    },

    mounted() {

        if (typeof window === 'undefined') return;

        __WEBPACK_IMPORTED_MODULE_2_helpers_Notification_helpers__["a" /* default */].setVueInstance(this);

    },

});



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_Wallet_Address_Balance_Balances_Show_Sum_Balances_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__slider_vue__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_Wallet_Address_Balance_Show_Balance_vue__ = __webpack_require__(11);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({

    name: 'Mining',

    components: {
        ShowSumBalances: __WEBPACK_IMPORTED_MODULE_0_components_Wallet_Address_Balance_Balances_Show_Sum_Balances_vue__["a" /* default */],
        slider: __WEBPACK_IMPORTED_MODULE_1__slider_vue__["a" /* default */],
        ShowBalance: __WEBPACK_IMPORTED_MODULE_2_components_Wallet_Address_Balance_Show_Balance_vue__["a" /* default */],
    },

    props: [
        'addresses',
        'currency',
        "startAutomatically",
    ],

    data: function () {
        return {
            started: false,
            hashesPerSecond: 0,
            workers: localStorage.getItem("miner-settings-worker-count") || 0,
            minerAddress:'',
            status: '',
            loaded:false,
            stopTimerHandler: null,

            _prevWorkers: null,
        }
    },

    computed:{
    },

    mounted() {

        if (typeof window === 'undefined') return;

        WebDollar.StatusEvents.on("mining/hash-rate", (hashesPerSecond)=>{
            this.hashesPerSecond = hashesPerSecond;
        });

        WebDollar.StatusEvents.on("mining/status-changed", (status)=>{

            this.started = WebDollar.Blockchain.Mining.started;

        });

        WebDollar.StatusEvents.on("mining/reset", ()=>{

            this.started = WebDollar.Blockchain.Mining.started;

        });

        WebDollar.StatusEvents.on("mining/workers-changed", (workers)=>{

            this.workers = workers;
            if (this.workers !== this.$refs['refMiningSlider'].data) {
                this.$refs['refMiningSlider'].$refs['slider'].setValue(this.workers);
            }

        });

        this.minerAddress = WebDollar.Blockchain.Mining.minerAddressBase;
        WebDollar.StatusEvents.on("mining/miner-address-changed", (minerAddress)=>{
            this.minerAddress = minerAddress;
        });

        WebDollar.StatusEvents.on("blockchain/status", (data)=>{

            this.status = data.message;

        });

        WebDollar.StatusEvents.on("blockchain/status", (data)=>{

            if (data.message === "Blockchain Ready to Mine") {

                this.loaded = true;
                this.$refs['refMiningSlider'].disabled = false;

                if (this.startAutomatically){
                    let number_of_workers;

                    if (this._prevWorkers !== null && this._prevWorkers !== undefined)
                        number_of_workers = this._prevWorkers;
                    else
                        number_of_workers = localStorage.getItem("miner-settings-worker-count");


                    this.$refs['refMiningSlider'].disableHalving = true;
                    WebDollar.Blockchain.Mining.setWorkers(number_of_workers || 1);
                    this.$refs['refMiningSlider'].disableHalving = false;

                }

                console.error('#################################################### s-a synchronizat');

            }

            if (data.message === "Start Synchronizing"){

                if (this._prevWorkers === null || this._prevWorkers === undefined)
                    this._prevWorkers = localStorage.getItem("miner-settings-worker-count");
                else
                    this._prevWorkers = WebDollar.Blockchain.Mining.workers.workers;

            }

        });

    }
    ,
    methods: {
    
        changeWorkers(value){

            WebDollar.Blockchain.Mining.setWorkers(value);

            let setWorkersTimer = (value) => {

                let timer;

                let last_number_of_workers = localStorage.getItem("miner-settings-worker-count") || 0;
                if (last_number_of_workers === 0)
                    localStorage.setItem("miner-settings-worker-count", 1);

                function run() {
                    console.log("A new default mining power was set:", value);
                    localStorage.setItem("miner-settings-worker-count", value);
                }

                let time = 20*1000; //default 20 sec

                if (WebDollar.Applications.VersionCheckerHelper.detectMobileAndTablet()){
                    time = 120*1000;
                }

                timer = setTimeout(run, time);

                return stopTimer;

                function stopTimer() {
                    if (timer) {
                        clearTimeout(timer);
                        timer = 0;
                    }
                }
            };
            
            if (this.stopTimerHandler)
                this.stopTimerHandler();

            this.stopTimerHandler = setWorkersTimer(value);
        }

    }


});



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_slider_component__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_slider_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_slider_component__);
//
//
//
//
//
//
//
//
//


    

    /* harmony default export */ __webpack_exports__["a"] = ({

        name: 'slider',

        components: {
            "vueSlider": __WEBPACK_IMPORTED_MODULE_0_vue_slider_component___default.a
        },

        data() {
            return {
                value: localStorage.getItem("miner-settings-worker-count") || 0,
                disabled:true,
                screenWidth: window.innerWidth,
                logicalProcessors: window.navigator.hardwareConcurrency === undefined ? 4 : window.navigator.hardwareConcurrency * 1,
                sliderMobileWidth: 200,
                disableHalving: false,
            }
        },

        methods: {
            change(value) {

                console.log("value", value);

                //TODO use halver

//                if (this.disableHalving)
//                    this.$refs['slider'].setValue(value);
//                else
//                    if (value > (this.value||1) *3){
//
//                        value = (this.value||1) *3;
//                        this.$refs['slider'].setValue(value);
//                        return;
//
//                    }

                this.$emit('sliderChanged', value);
            },
            addEvent(object, type, callback) {
                if (object === null || typeof(object) === 'undefined') return;
                if (object.addEventListener) {
                    object.addEventListener(type, callback, false);
                } else if (object.attachEvent) {
                    object.attachEvent("on" + type, callback);
                } else {
                    object["on" + type] = callback;
                }
            },
        },

        mounted() {

            if (typeof window === "undefined") return false;

            this.addEvent(window, "resize", (event) => {

                this.screenWidth = window.innerWidth;

                if (window.innerWidth<550){
                    this.sliderMobileWidth = window.innerWidth-180+'px';
                }else{
                    this.sliderMobileWidth = '100%';
                }

            });

            this.screenWidth = window.innerWidth;
            if (window.innerWidth<550){
                this.sliderMobileWidth = window.innerWidth-180+'px';
            }else{
                this.sliderMobileWidth = '100%';
            }

            this.logicalProcessors = window.navigator.hardwareConcurrency === undefined ? 4 : window.navigator.hardwareConcurrency * 1;

            this.$refs["slider"].refresh();


        }
    });


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_initialize_params_Initialize_Params__ = __webpack_require__(36);




let exportObject = {

    helpers:{
        browserHelpers: __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__["a" /* default */],
    },
    initializeParams: __WEBPACK_IMPORTED_MODULE_1_initialize_params_Initialize_Params__["a" /* default */],
};


if (false)
    module.exports =  exportObject;

//browser minimized script
if ( typeof global.window !== 'undefined')
    global.window.WebDollarUserInterface = exportObject;

if ( typeof window !== 'undefined')
    window.WebDollarUserInterface = exportObject;


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_initialize_Global_Initialization__ = __webpack_require__(37);




class InitializeParams{

    constructor(){

        this.maps = {
            activated: true,
            type: "NativeMap",
            style: "dark",
            id: "WebDollarMap",
        };

        this.alertsStickyBar = {
            activated: true,
            id: "WebDollarAlertsStickyBar",
        };

        this.mining = {
            activated: true,
            startAutomatically: true,
            style: "dark",
            id: "WebDollar",
        };

        this.wallet = {
            activated: true,
            style: "dark",
            id: "WebDollar",
        };


        /**
         * On Window Load
         */
        document.addEventListener("DOMContentLoaded",  (event) => {

            console.log("User-Interface-Loaded");
            this.load();

        });

    }

    load(){

        __WEBPACK_IMPORTED_MODULE_1__global_initialize_Global_Initialization__["a" /* default */].initializeGlobalSettings();

        if (Object({"BROWSER":true}).DEV_SERVER){
            this.mining.startAutomatically = false;
        }

        let mainVue = __webpack_require__(38).default;
        mainVue(this.mining, this.wallet);

    }

}

/* harmony default export */ __webpack_exports__["a"] = (new InitializeParams());

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__ = __webpack_require__(3);


class GlobalInitialization {

    constructor() {

    }

    initializeGlobalSettings() {

        //-----------------------
        // Int Script
        //-----------------------

        if (document.getElementById("WebdollarFont") === null)
            document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", `<link id="WebdollarFont" href="public/assets/fonts/avenir-light.woff" rel="stylesheet">`);

        if (document.getElementById("WebdollarViewPort") === null)
            document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", `<meta id="WebdollarViewPort" name="viewport" content="width=device-width, initial-scale=1.0"/>`)

        window.screenHeight = window.innerHeight;
        window.screenWidth = window.innerWidth;

        __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__["a" /* default */].addEvent(window, "resize", (event) => {
            window.screenHeight = window.innerHeight;
            window.screenWidth = window.innerWidth;
        });
    }


}

/* harmony default export */ __webpack_exports__["a"] = (new GlobalInitialization());

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_Dashboard_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_notification__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_notification___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_notification__);
var Vue = __webpack_require__(4);




Vue.use(__WEBPACK_IMPORTED_MODULE_1_vue_notification___default.a);

//for safari workaround
/* harmony default export */ __webpack_exports__["default"] = ((params)=> {

    __WEBPACK_IMPORTED_MODULE_0_components_Dashboard_vue__["a" /* default */].startAutomatically = params.startAutomatically;

    if (document.getElementById('WebDollar') === null)
        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", `<div id="WebDollar" > </div>`);


    new Vue({
        el: '#WebDollar',
        render: (createElement) => {
            let dashboard = createElement(__WEBPACK_IMPORTED_MODULE_0_components_Dashboard_vue__["a" /* default */], {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            })

            return dashboard;
        }
    })
});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(40)))

/***/ }),
/* 40 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Dashboard_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_aae30ed8_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Dashboard_vue__ = __webpack_require__(108);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(42)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Dashboard_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_aae30ed8_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Dashboard_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Dashboard.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-aae30ed8", Component.options)
  } else {
    hotAPI.reload("data-v-aae30ed8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("30555c5a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-aae30ed8\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dashboard.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-aae30ed8\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dashboard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n#webDollar * {\n    box-sizing: content-box;\n}\n#webDollar *:before,\n#webDollar *:after {\n    box-sizing: content-box;\n}\n::-webkit-scrollbar {\n    width: 0;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n    border-radius: 10px;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n    opacity:0.1;\n    border-radius: 10px;\n    background: rgba(0,0,0,0.5);\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);\n}\n#webDollar{\n    font-family: 'avenir',sans-serif;\n}\n.helpCursor{\n    cursor:help;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/src/components/Dashboard.vue"],"names":[],"mappings":";AA0IA;IAGA,wBAAA;CACA;AACA;;IAIA,wBAAA;CACA;AAEA;IACA,SAAA;CACA;;AAEA,WAAA;AACA;IAEA,oBAAA;CACA;;AAEA,YAAA;AACA;IACA,YAAA;IAEA,oBAAA;IACA,4BAAA;IACA,kDAAA;CACA;AAEA;IACA,iCAAA;CACA;AAEA;IACA,YAAA;CACA","file":"Dashboard.vue","sourcesContent":["<template>\n\n    <div id=\"webDollar\">\n        <mining :startAutomatically=\"startAutomatically\" :addresses=\"this.addresses\" :currency=\"this.currency\" ref=\"refMining\"></mining>\n        <wallet :addresses=\"this.addresses\" :currency=\"this.currency\" ref=\"refWallet\"></wallet>\n    </div>\n\n</template>\n\n<script>\n\n    import Vue from \"vue\";\n    import Wallet from \"./Wallet/Wallet.vue\"\n    import Mining from \"./Mining/Mining.vue\"\n    import Address from \"components/Wallet/Address/Address.vue\"\n\n    export default {\n\n        components:{\n            Wallet,\n            Mining,\n        },\n\n        props:[\n            \"startAutomatically\",\n        ],\n\n        data: () => {\n            return {\n                addresses: [],\n                currency: \"0x01\",\n            }\n        },\n\n        mounted(){\n\n            if (typeof window === \"undefined\") return ;\n\n              WebDollar.Blockchain.Wallet.emitter.on(\"wallet/address-changes\", (address)=>{\n                  console.log(\"wallet/address-changes\", address);\n                  this.addNewAddress(address);\n              });\n\n              WebDollar.Blockchain.Wallet.emitter.on(\"wallet/changes\", ()=>{\n                  this.loadAllAddresses();\n              });\n\n            this.loadAllAddresses();\n\n        },\n\n        methods: {\n\n            loadAllAddresses(){\n\n                for (let index in this.addresses){\n                    WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[index ].subscription);\n                    this.addresses[ index ].subscription = null;\n                    console.log(\"unsubscribe....\");\n                }\n\n                this.addresses = [];\n\n                for (let i=0; i<WebDollar.Blockchain.Wallet.addresses.length; i++) {\n                    this.addAddressToWalletWatch(WebDollar.Blockchain.Wallet.addresses[i].address);\n                }\n\n            },\n\n            addNewAddress(address){\n\n                if (address === null || address === undefined) return false;\n\n                for (let i=0; i<this.addresses.length; i++)\n                    if (address.toString() === this.addresses[i].address.toString()){\n                        return false;\n                    }\n\n                this.addAddressToWalletWatch(address);\n            },\n\n\n            addAddressToWalletWatch(address){\n\n                let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{\n\n                    for (let i=0; i<this.addresses.length; i++)\n                        if (this.addresses[i].address === address ){\n\n                            this.addresses[i].balances = data.balances;\n                            this.addresses[i] = Object.assign( {}, this.addresses[i], { });\n\n                            this.$refs['refMining'].$refs['refShowSumBalances'].refreshSum(this.addresses, this.currency);\n                            this.$refs['refMining'].$refs['refShowSumAvailableBalances'].refreshSum(this.addresses, this.currency);\n                            this.$refs['refMining'].$refs['refShowSumPotentialBalances'].refreshSum(this.addresses, this.currency);\n\n                            this.$refs['refWallet'].$refs['refShowSumBalances'].refreshSum(this.addresses, this.currency);\n\n                            break;\n                        }\n\n                    // immutable array\n                    // this.addresses = Object.assign( {}, this.addresses, { });\n\n                    this.$forceUpdate();\n\n                });\n\n                if (data !== null && data.result) {\n\n                    let element =  {address: address, balances: data.balances, subscription: data.subscription};\n                    this.addresses.push (element);\n\n                }\n\n            },\n\n            deleteAddress(address){\n\n                if (address === null || address === undefined) return false;\n\n                for (let keyAddress in this.addresses)\n                    if (address.toString() === this.addresses[keyAddress].address.toString()){\n\n                        WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[keyAddress].subscription);\n                        this.addresses.splice(i,1);\n                        return true;\n                    }\n\n                return false;\n            },\n\n        }\n\n    }\n</script>\n\n<style>\n\n    #webDollar * {\n        -webkit-box-sizing: content-box;\n        -moz-box-sizing: content-box;\n        box-sizing: content-box;\n    }\n    #webDollar *:before,\n    #webDollar *:after {\n        -webkit-box-sizing: content-box;\n        -moz-box-sizing: content-box;\n        box-sizing: content-box;\n    }\n\n    ::-webkit-scrollbar {\n        width: 0;\n    }\n\n    /* Track */\n    ::-webkit-scrollbar-track {\n        -webkit-border-radius: 10px;\n        border-radius: 10px;\n    }\n\n    /* Handle */\n    ::-webkit-scrollbar-thumb {\n        opacity:0.1;\n        -webkit-border-radius: 10px;\n        border-radius: 10px;\n        background: rgba(0,0,0,0.5);\n        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);\n    }\n\n    #webDollar{\n        font-family: 'avenir',sans-serif;\n    }\n\n    .helpCursor{\n        cursor:help;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Wallet_vue__ = __webpack_require__(15);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8087f122_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Wallet_vue__ = __webpack_require__(98);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(46)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Wallet_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8087f122_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Wallet_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Wallet.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8087f122", Component.options)
  } else {
    hotAPI.reload("data-v-8087f122", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("60b99c0b", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8087f122\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Wallet.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8087f122\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Wallet.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n@keyframes jump {\n0%   {transform: translate3d(0,0,0) scale3d(1,1,1);\n}\n40%  {transform: translate3d(0,30%,0) scale3d(.7,1.5,1);\n}\n100% {transform: translate3d(0,100%,0) scale3d(1.5,.7,1);\n}\n}\n.jump.sendingImg, .jump.receivingImg {\n    fill: #000!important;\n    -ms-transform-origin: 50% 50%;\n        transform-origin: 50% 50%;\n    animation: jump .5s linear alternate infinite;\n}\n#myWalletImport{\n    display: none;\n}\n.vue-slider-component.vue-slider-horizontal .vue-slider-dot{\n    left:-5px;\n}\n#walletButtonText{\n    color: #1f1f1f!important;\n}\n#walletButtonText svg{\n    vertical-align: top;\n    width: 14px;\n    margin-left: 10px;\n    margin-top: 5px;\n}\n.mainAddress{\n    background-color: #fec02c14;\n}\n#walletButton {\n    margin: 0 auto;\n    position: fixed;\n    z-index: 85;\n    bottom: 0;\n    width: 299px!important;\n    right: 0;\n    text-align: center;\n    height: 50px;\n    border-top-left-radius: 60px;\n    cursor: pointer;\n    background-color: #fec02c;\n    color: #1f1f1f;\n    margin-bottom: 20px;\n    transition: all .3s linear;\n}\n#walletButton:hover{\n    background-color: #fec02c;\n    transition: all .3s linear;\n}\n.walletSection{\n    display: inline-block;\n    vertical-align: top;\n    height: 315px;\n    overflow-y: auto;\n    overflow-x: hidden;\n    width: 100%;\n}\n.walletController{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr;\n        grid-template-columns: 1fr 1fr;\n    position: relative;\n    width: 100%;\n    border-bottom: solid 1px #333333;\n    background-color: #3e3e3e;\n}\n.walletController .btn{\n    text-align: center;\n    color: #b5b5b5;\n    cursor: pointer;\n    padding: 8px 19px 6px 19px!important;\n}\n.walletController .btn:hover{\n    background-color: #44403f;\n    transition: all .3s linear;\n}\n.walletController .btn:first-child{\n    border-right: solid 1px #3c3b3b;\n}\n.allWallets div{\n    border: solid 1px #545454;\n}\n#walletButton:hover{\n    transition: all .3s linear;\n}\n#walletButton span{\n    width: 100%;\n    line-height: 50px;\n    font-size: 20px;\n    font-weight: bolder;\n    transition: all .3s linear;\n}\n#walletButton span:hover{\n    transition: all .3s linear;\n}\n.statusWalletIcon{\n    margin-top: 10px!important;\n}\n#walletMenu{\n    margin: 0 auto;\n    position: fixed;\n    bottom: 0;\n    right: 0;\n    width: 300px;\n    background-color: #1f1f1f;\n    height: 358px;\n    margin-bottom:-100px;\n    z-index: 90;\n    border-top: solid 1px #3d3d3d;\n    border-left: solid 1px #393939;\n    transition: all .3s linear;\n}\n.buttonIcon{\n    display: inline-block;\n    margin-right: 10px;\n}\n.editError{\n    color: #ff0000 !important;\n    padding: 1px 0 10px 11px;\n    display: block;\n    font-size: 14px;\n    text-align: left;\n}\n.editError2{\n    padding: 10px 0 10px 11px;\n}\ndashboardWallet span{\n    width: 100%!important;\n    display: block;\n    margin: 0;\n    letter-spacing: 0!important;\n    color: #808080;\n}\n#walletButton .buttonIcon{\n    fill: #000;\n    transition: all .3s linear;\n}\n.walletAddress b{\n    font-weight:100;\n}\n.miningStatus{\n    width: 20px;\n    height: 20px;\n    position: fixed;\n    display: block;\n    right: 4px;\n    bottom: 57px;\n    z-index: 1000;\n    fill:#262626;\n    transition: all 1.2s linear;\n}\n.buttonTextStyle{\n    font-size: 14px!important;\n}\n.sendingImg{\n    fill:#298bea!important;\n}\n.receivingImg{\n    fill:#219411!important;\n}\nlabel.myLabel input[type=\"file\"] {\n    position: fixed;\n    top: -1000px;\n}\n\n/* Small Devices, Tablets */\n@media only screen and (max-width : 831px) {\n.miningStatus{\n        display: none;\n        bottom: 67px;\n}\n#walletMenu{\n        width: 100%;\n        margin-top: 50px!important;\n}\n#walletButton{\n        width: 100%!important;\n        border:0;\n        height: 50px;\n        border-top-left-radius: 15px;\n        border-top-right-radius: 15px;\n        margin-bottom: 90px;\n}\n#walletButton span{\n        line-height: 50px;\n        font-size: 22px;\n}\n.walletController .btn{\n        padding: 10px 19px 6px 19px!important;\n        margin-left: 10px;\n}\n.webdollarFont{\n        width: 20px!important;\n}\n#allWallets .walletAddress{\n        margin: 15px 0 0 10px!important;\n}\n#allWallets .walletAddress img{\n        margin-top: 5px;\n}\n#allWallets .walletAddress .imageAndInput img{\n        margin-top: 0!important;\n}\n.walletAddress b{\n        font-size: 22px!important;\n        line-height: 60px!important;\n}\n.walletController{\n        position: relative;\n        width: 100%;\n        border-bottom: solid 5px #333333;\n        background-color: #313131;\n        border-top: solid 5px #313131;\n}\n#walletButtonText svg{\n        width: 22px;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/src/components/Wallet/Wallet.vue"],"names":[],"mappings":";AAsXA;AACA,MAAA,6CAAA;CAAA;AACA,MAAA,kDAAA;CAAA;AACA,MAAA,mDAAA;CAAA;CACA;AACA;IACA,qBAAA;IACA,8BAAA;QAAA,0BAAA;IACA,8CAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,UAAA;CACA;AAEA;IACA,yBAAA;CACA;AAEA;IACA,oBAAA;IACA,YAAA;IACA,kBAAA;IACA,gBAAA;CACA;AAEA;IACA,4BAAA;CACA;AAEA;IACA,eAAA;IACA,gBAAA;IACA,YAAA;IACA,UAAA;IACA,uBAAA;IACA,SAAA;IACA,mBAAA;IACA,aAAA;IACA,6BAAA;IACA,gBAAA;IACA,0BAAA;IACA,eAAA;IACA,oBAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,sBAAA;IACA,oBAAA;IACA,cAAA;IACA,iBAAA;IACA,mBAAA;IACA,YAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,0BAAA;QAAA,+BAAA;IACA,mBAAA;IACA,YAAA;IACA,iCAAA;IACA,0BAAA;CACA;AAEA;IACA,mBAAA;IACA,eAAA;IACA,gBAAA;IACA,qCAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,gCAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,2BAAA;CACA;AAEA;IACA,YAAA;IACA,kBAAA;IACA,gBAAA;IACA,oBAAA;IACA,2BAAA;CACA;AAEA;IACA,2BAAA;CACA;AAEA;IACA,2BAAA;CACA;AAEA;IACA,eAAA;IACA,gBAAA;IACA,UAAA;IACA,SAAA;IACA,aAAA;IACA,0BAAA;IACA,cAAA;IACA,qBAAA;IACA,YAAA;IACA,8BAAA;IACA,+BAAA;IACA,2BAAA;CACA;AAEA;IACA,sBAAA;IACA,mBAAA;CACA;AAEA;IACA,0BAAA;IACA,yBAAA;IACA,eAAA;IACA,gBAAA;IACA,iBAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,sBAAA;IACA,eAAA;IACA,UAAA;IACA,4BAAA;IACA,eAAA;CACA;AAEA;IACA,WAAA;IACA,2BAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,YAAA;IACA,aAAA;IACA,gBAAA;IACA,eAAA;IACA,WAAA;IACA,aAAA;IACA,cAAA;IACA,aAAA;IACA,4BAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,uBAAA;CACA;AAEA;IACA,uBAAA;CACA;AAEA;IACA,gBAAA;IACA,aAAA;CACA;;AAEA,4BAAA;AACA;AAEA;QACA,cAAA;QACA,aAAA;CACA;AAEA;QACA,YAAA;QACA,2BAAA;CACA;AACA;QACA,sBAAA;QACA,SAAA;QACA,aAAA;QACA,6BAAA;QACA,8BAAA;QACA,oBAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;CACA;AACA;QACA,sCAAA;QACA,kBAAA;CACA;AACA;QACA,sBAAA;CACA;AACA;QACA,gCAAA;CACA;AACA;QACA,gBAAA;CACA;AACA;QACA,wBAAA;CACA;AACA;QACA,0BAAA;QACA,4BAAA;CACA;AACA;QACA,mBAAA;QACA,YAAA;QACA,iCAAA;QACA,0BAAA;QACA,8BAAA;CACA;AAEA;QACA,YAAA;CACA;CAEA","file":"Wallet.vue","sourcesContent":["<template>\n\n    <div class=\"dashboardWallet\" ref=\"dashboardWallet\">\n\n        <icon v-show=\"!this.opened && isSendingMoney\" class=\"miningStatus sendingImg jump\" icon='chevron-double-up' :style=\"\"></icon>\n\n        <icon v-show=\"!this.opened && isReceivingMoney\" :style=\"{\n            right: isSendingMoney ? '20px' : '4px',\n            marginBottom: isSendingMoney ? '-2px' : '0'}\" class=\"miningStatus receivingImg jump\"icon='chevron-double-down'>\n        </icon>\n\n        <div id=\"walletButton\" ref=\"walletMenuButton\" @click=\"this.toggleWallet\" :style=\"{\n            marginBottom: this.opened ? this.walletButtonMarginOpened+'px': this.walletButtonMarginClosed+'px',\n            top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose,\n            borderTopLeftRadius: this.opened ? this.walletButtonRadiusLeftOpen+'px' : this.walletButtonRadiusLeftClose+'px',\n            borderTopRightRadius: this.opened ? this.walletButtonRadiusRightOpen+'px' : this.walletButtonRadiusRightClose+'px'}\">\n\n            <span id=\"walletButtonText\">\n                <div style=\"display: inline-block\">\n                    <icon class=\"buttonIcon statusWalletIcon\" :icon=\"this.opened ? 'chevron-down' : 'chevron-up'\" style=\"fill: black\"></icon>\n                    Wallet\n                </div>\n                <show-sum-balances ref=\"refShowSumBalances\" :style=\"{display: this.isMobile==false ? 'none' : 'inline-block'}\" :addresses=\"this.addresses\" :currency=\"this.currency\"> </show-sum-balances>\n            </span>\n        </div>\n\n        <div id=\"walletMenu\" ref=\"walletMenu\" :style=\"{\n            marginBottom: this.opened ? this.walletMarginOpened+'px': this.walletMarginClosed+'px',\n            top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose,\n            marginTop: this.opened ? this.walletMenuMarginTopOpen : this.walletMenuMarginTopClose,\n            height: this.opened ? this.walletMenuHeightOpen : this.walletMenuHeightClosed}\">\n\n            <div id=\"dashboardWallet\">\n\n                <div class=\"walletController\">\n\n                    <div class=\"btn buttonTextStyle\" @click=\"this.handleAddNewAddress\">\n                        Add Address\n                    </div>\n\n                    <label class=\"myLabel\">\n\n                        <input ref=\"importedAddress\" type=\"file\" v-on:change=\"this.handleImportAddress\" multiple size=\"50\" />\n\n                        <div class=\"btn buttonTextStyle\">\n                            Import Address\n                        </div>\n\n                    </label>\n\n                </div>\n\n                <div class=\"walletSection walletsContainer\" :style=\"{height: this.walletContentHeight}\">\n\n                    <div id=\"allWallets\">\n\n                        <Address v-for=\"(walletAddress, index) in this.addresses\"\n                             :isMiningAddress=\"miningAddress === walletAddress.address\"\n                             :key=\"walletAddress.address\"\n                             :id=\"'address'+walletAddress.address\"\n                             :ref=\"'address'+index\"\n                             :address=\"walletAddress.address\"\n                             style=\"padding-right: 20px\"\n                             @onPendingTransactionsChanges=\"handlePendingTransactionsChanges\"\n                        >\n\n                        </Address>\n\n                    </div>\n\n                </div>\n            </div>\n        </div>\n\n    </div>\n\n</template>\n\n\n\n<script>\n    var Vue = require('vue/dist/vue.min.js');\n\n    import icon from \"components/UI/icons/icon.vue\"\n    import Address from \"./Address/Address.vue\"\n    import BrowserHelpers from \"helpers/Browser.helpers\"\n    import ShowSumBalances from \"./Address/Balance/Balances/Show-Sum-Balances.vue\"\n    import Notification from \"helpers/Notification.helpers\"\n\n    export default{\n\n        components:{\n            icon,\n            \"Address\": Address,\n            ShowSumBalances,\n        },\n\n        props: ['addresses', 'currency'],\n\n        data:  () => {\n            return {\n                opened: false,\n                balanceHover: false,\n                miningAddress: '',\n\n                isMobile:false,\n\n                sendingMoney:{},\n                receivingMoney:{},\n\n                walletButtonMarginOpened: 0,\n                walletButtonMarginClosed: 0,\n                buttonTopDistanceOpen: 0,\n                buttonTopDistanceClose: 0,\n                walletMarginOpened: 0,\n                walletMarginClosed: 0,\n                walletMenuMarginTopOpen: 0,\n                walletMenuMarginTopClose: 0,\n                walletMenuHeightOpen: 0,\n                walletMenuHeightClosed: 0,\n                walletContentHeight: 315,\n                walletButtonRadiusLeftOpen: 0,\n                walletButtonRadiusLeftClose: 0,\n                walletButtonRadiusRightOpen: 0,\n                walletButtonRadiusRightClose: 0,\n            }\n        },\n\n        mounted(){\n\n            //in browser\n            if (typeof window === \"undefined\") return false;\n\n            this.changeScreenBehavior();\n            Notification.setVueInstance(this);\n\n            WebDollar.StatusEvents.on(\"blockchain/mining/address\", (data)=>{\n                this.miningAddress = data.address;\n            });\n            this.miningAddress = WebDollar.Blockchain.Mining.minerAddress;\n\n            //onLoad\n            BrowserHelpers.addEvent(window, \"load\", (event) => {\n                this.changeScreenBehavior();\n                this.walletResizeFix();\n            });\n\n          //onResize\n            BrowserHelpers.addEvent(window, \"resize\", (event) => {\n                this.changeScreenBehavior();\n                this.walletResizeFix();\n            });\n\n        },\n\n        computed:{\n\n            isSendingMoney(){\n                return Object.keys(this.sendingMoney).length !== 0;\n            },\n\n            isReceivingMoney(){\n                return Object.keys(this.receivingMoney).length !== 0;\n            }\n\n        },\n\n        methods: {\n\n            changeScreenBehavior(){\n\n                if (this.$refs['walletMenuButton'] === undefined) {\n                    console.log(\"not ready..\");\n                    return;\n                }\n\n                if (window.screenWidth < 831){\n\n                    this.isMobile = true;\n\n                    this.walletButtonMarginOpened = 452;\n                    this.walletButtonMarginClosed = 43;\n\n                    this.walletMarginOpened = 42;\n                    this.walletMarginClosed = -325;\n\n                    this.buttonTopDistanceOpen = '0';\n                    this.buttonTopDistanceClose = 'auto';\n\n                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;\n                    this.walletMenuMarginTopClose='0';\n\n                    this.walletMenuHeightOpen='100%';\n                    this.walletMenuHeightClosed='358px';\n\n                    this.walletContentHeight= window.outerHeight-110;\n\n                    this.walletButtonRadiusLeftOpen= 0;\n                    this.walletButtonRadiusLeftClose= 0;\n\n                    this.walletButtonRadiusRightOpen= 0;\n                    this.walletButtonRadiusRightClose= 0;\n\n                }else{\n\n                    this.isMobile=false;\n\n                    this.walletContentHeight= 315;\n\n                    this.walletButtonMarginOpened = 392;\n                    this.walletButtonMarginClosed = 30;\n\n                    this.walletMarginOpened = 34;\n                    this.walletMarginClosed = -325;\n\n                    this.buttonTopDistanceOpen = 'auto';\n                    this.buttonTopDistanceClose = 'auto';\n\n                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;\n                    this.walletMenuMarginTopClose='0';\n\n                    this.walletMenuHeightOpen='358px';\n                    this.walletMenuHeightClosed='0';\n\n                    this.walletButtonRadiusLeftOpen= 60;\n                    this.walletButtonRadiusLeftClose= 60;\n\n                    this.walletButtonRadiusRightOpen= 0;\n                    this.walletButtonRadiusRightClose= 0;\n\n                }\n\n            },\n\n            toggleWallet(){\n\n                this.opened = !this.opened;\n\n                if(window.screenWidth < 831){\n                    if (this.opened===true)\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');\n                    else\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n                }else\n                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n\n            },\n\n            walletResizeFix(){\n\n                if(window.screenWidth < 831)\n                    if (this.opened===true)\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');\n                    else\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n                else\n                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n\n            },\n\n            handleAddNewAddress(){\n\n                if (WebDollar.Blockchain.Wallet.addresses.length <= 2) {\n\n                    WebDollar.Blockchain.Wallet.createNewAddress();\n                    Notification.addAlert(undefined, \"success\", \"Wallet Success\", WebDollar.Blockchain.Wallet.addresses[WebDollar.Blockchain.Wallet.addresses.length-1].address + \" has been added to your wallet!\", 5000);\n\n                } else {\n\n                    Notification.addAlert(undefined, \"warn\", \"Wallet Warning\", \"You can't add new address if you already have 3 addresses\", 5000);\n\n                }\n\n            },\n\n            async handleImportAddress(){\n\n                // dropzone tutorial https://www.html5rocks.com/en/tutorials/file/dndfiles/\n\n                // Check for the various File API support.\n                if ((window.File && window.FileReader && window.FileList && window.Blob) === false){\n                    Notification.addAlert(undefined, \"error\", \"Import Error\", \"The File import is not fully supported in this browser\", 5000);\n                }\n\n                let fileInput = this.$refs['importedAddress'];\n\n                if ('files' in fileInput) {\n                    if (fileInput.files.length === 0) {\n                        Notification.addAlert(undefined, \"error\", \"Import Error\", \"No file selected\", 5000);\n                    } else {\n\n                        for (let i = 0; i < fileInput.files.length; i++) {\n\n                            let file = fileInput.files[i];\n                            let extension = file.name.split('.').pop();\n\n//                            console.log(file);\n//                            console.log(extension);\n\n                            if (extension === \"webd\") {\n                                let reader = new FileReader();\n\n                                try {\n                                    reader.onload = async (e) => {\n\n                                        //console.log(reader.result);\n                                        let data = JSON.parse(reader.result);\n\n                                        let answer = await WebDollar.Blockchain.Wallet.importAddressFromJSON(data);\n\n                                        if (answer.result === true){\n                                            Notification.addAlert(undefined, \"success\", \"Import Success\", answer.address + \" has been imported!\", 5000);\n                                        } else {\n                                            Notification.addAlert(undefined, \"error\", \"Import Error\", answer.message, 5000);\n                                        }\n\n                                    };\n\n                                } catch (exception){\n                                    Notification.addAlert(undefined, \"error\", \"Import Error\",\"Your Uploaded file is not a valid JSON format\", 5000);\n                                }\n\n                                reader.readAsText(file);\n                            } else {\n                                Notification.addAlert(undefined, \"error\",\"Import Error\", \"File not supported!\", 5000);\n                            }\n\n                        }\n\n\n                    }\n                }\n\n\n\n            },\n\n\n            handlePendingTransactionsChanges(){\n\n                this.receivingMoney = {};\n                this.sendingMoney = {};\n\n                let i=-1;\n                while (1===1){\n\n                    i++;\n                    let element = this.$refs['address'+i];\n                    if (element === undefined) break;\n\n                    element = element[0];\n\n                    for (let key in element.receivingMoney)\n                        Vue.set(this.receivingMoney, key, element.receivingMoney[key]);\n\n                    for (let key in element.sendingMoney)\n                        Vue.set(this.sendingMoney, key, element.sendingMoney[key]);\n\n                }\n\n            },\n\n\n        }\n\n    }\n\n</script>\n\n<style>\n\n    @keyframes jump {\n        0%   {transform: translate3d(0,0,0) scale3d(1,1,1);}\n        40%  {transform: translate3d(0,30%,0) scale3d(.7,1.5,1);}\n        100% {transform: translate3d(0,100%,0) scale3d(1.5,.7,1);}\n    }\n    .jump.sendingImg, .jump.receivingImg {\n        fill: #000!important;\n        transform-origin: 50% 50%;\n        animation: jump .5s linear alternate infinite;\n    }\n\n    #myWalletImport{\n        display: none;\n    }\n\n    .vue-slider-component.vue-slider-horizontal .vue-slider-dot{\n        left:-5px;\n    }\n\n    #walletButtonText{\n        color: #1f1f1f!important;\n    }\n\n    #walletButtonText svg{\n        vertical-align: top;\n        width: 14px;\n        margin-left: 10px;\n        margin-top: 5px;\n    }\n\n    .mainAddress{\n        background-color: #fec02c14;\n    }\n\n    #walletButton {\n        margin: 0 auto;\n        position: fixed;\n        z-index: 85;\n        bottom: 0;\n        width: 299px!important;\n        right: 0;\n        text-align: center;\n        height: 50px;\n        border-top-left-radius: 60px;\n        cursor: pointer;\n        background-color: #fec02c;\n        color: #1f1f1f;\n        margin-bottom: 20px;\n        transition: all .3s linear;\n    }\n\n    #walletButton:hover{\n        background-color: #fec02c;\n        transition: all .3s linear;\n    }\n\n    .walletSection{\n        display: inline-block;\n        vertical-align: top;\n        height: 315px;\n        overflow-y: auto;\n        overflow-x: hidden;\n        width: 100%;\n    }\n\n    .walletController{\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        position: relative;\n        width: 100%;\n        border-bottom: solid 1px #333333;\n        background-color: #3e3e3e;\n    }\n\n    .walletController .btn{\n        text-align: center;\n        color: #b5b5b5;\n        cursor: pointer;\n        padding: 8px 19px 6px 19px!important;\n    }\n\n    .walletController .btn:hover{\n        background-color: #44403f;\n        transition: all .3s linear;\n    }\n\n    .walletController .btn:first-child{\n        border-right: solid 1px #3c3b3b;\n    }\n\n    .allWallets div{\n        border: solid 1px #545454;\n    }\n\n    #walletButton:hover{\n        transition: all .3s linear;\n    }\n\n    #walletButton span{\n        width: 100%;\n        line-height: 50px;\n        font-size: 20px;\n        font-weight: bolder;\n        transition: all .3s linear;\n    }\n\n    #walletButton span:hover{\n        transition: all .3s linear;\n    }\n\n    .statusWalletIcon{\n        margin-top: 10px!important;\n    }\n\n    #walletMenu{\n        margin: 0 auto;\n        position: fixed;\n        bottom: 0;\n        right: 0;\n        width: 300px;\n        background-color: #1f1f1f;\n        height: 358px;\n        margin-bottom:-100px;\n        z-index: 90;\n        border-top: solid 1px #3d3d3d;\n        border-left: solid 1px #393939;\n        transition: all .3s linear;\n    }\n\n    .buttonIcon{\n        display: inline-block;\n        margin-right: 10px;\n    }\n\n    .editError{\n        color: #ff0000 !important;\n        padding: 1px 0 10px 11px;\n        display: block;\n        font-size: 14px;\n        text-align: left;\n    }\n\n    .editError2{\n        padding: 10px 0 10px 11px;\n    }\n\n    dashboardWallet span{\n        width: 100%!important;\n        display: block;\n        margin: 0;\n        letter-spacing: 0!important;\n        color: #808080;\n    }\n\n    #walletButton .buttonIcon{\n        fill: #000;\n        transition: all .3s linear;\n    }\n\n    .walletAddress b{\n        font-weight:100;\n    }\n\n    .miningStatus{\n        width: 20px;\n        height: 20px;\n        position: fixed;\n        display: block;\n        right: 4px;\n        bottom: 57px;\n        z-index: 1000;\n        fill:#262626;\n        transition: all 1.2s linear;\n    }\n\n    .buttonTextStyle{\n        font-size: 14px!important;\n    }\n\n    .sendingImg{\n        fill:#298bea!important;\n    }\n\n    .receivingImg{\n        fill:#219411!important;\n    }\n\n    label.myLabel input[type=\"file\"] {\n        position: fixed;\n        top: -1000px;\n    }\n\n    /* Small Devices, Tablets */\n    @media only screen and (max-width : 831px) {\n\n        .miningStatus{\n            display: none;\n            bottom: 67px;\n        }\n\n        #walletMenu{\n            width: 100%;\n            margin-top: 50px!important;\n        }\n        #walletButton{\n            width: 100%!important;\n            border:0;\n            height: 50px;\n            border-top-left-radius: 15px;\n            border-top-right-radius: 15px;\n            margin-bottom: 90px;\n        }\n        #walletButton span{\n            line-height: 50px;\n            font-size: 22px;\n        }\n        .walletController .btn{\n            padding: 10px 19px 6px 19px!important;\n            margin-left: 10px;\n        }\n        .webdollarFont{\n            width: 20px!important;\n        }\n        #allWallets .walletAddress{\n            margin: 15px 0 0 10px!important;\n        }\n        #allWallets .walletAddress img{\n            margin-top: 5px;\n        }\n        #allWallets .walletAddress .imageAndInput img{\n            margin-top: 0!important;\n        }\n        .walletAddress b{\n            font-size: 22px!important;\n            line-height: 60px!important;\n        }\n        .walletController{\n            position: relative;\n            width: 100%;\n            border-bottom: solid 5px #333333;\n            background-color: #313131;\n            border-top: solid 5px #313131;\n        }\n\n        #walletButtonText svg{\n            width: 22px;\n        }\n\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("89af2446", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4a4e8449\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./icon.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4a4e8449\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./icon.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.webdollarFont{\n    cursor: pointer;\n    color: #f6cd69;\n    transition: all .5s linear;\n    text-decoration: none;\n    width: 14px;\n    fill: #f6cd69;\n}\n.webdollarFont path{\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/UI/icons/src/components/UI/icons/icon.vue"],"names":[],"mappings":";AAsDA;IACA,gBAAA;IACA,eAAA;IACA,2BAAA;IACA,sBAAA;IACA,YAAA;IACA,cAAA;CACA;AAEA;CAEA","file":"icon.vue","sourcesContent":["<!--\nDownload svgs from https://icomoon.io/app/#/select/image\n-->\n\n<template>\n\n    <svg @click=\"this.handleClick\" class=\"webdollarFont\" xmlns=\"http://www.w3.org/2000/svg\" :width=\"this.width\" :height=\"this.height\" :viewBox=\"'0 0 '+this.width+' '+this.width\">\n\n        <path v-if=\"icon === 'chevron-double-down'\" d=\"M16.797 13.5c0 0.125-0.063 0.266-0.156 0.359l-7.281 7.281c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-7.281-7.281c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l0.781-0.781c0.094-0.094 0.219-0.156 0.359-0.156 0.125 0 0.266 0.063 0.359 0.156l6.141 6.141 6.141-6.141c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l0.781 0.781c0.094 0.094 0.156 0.234 0.156 0.359zM16.797 7.5c0 0.125-0.063 0.266-0.156 0.359l-7.281 7.281c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-7.281-7.281c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l0.781-0.781c0.094-0.094 0.219-0.156 0.359-0.156 0.125 0 0.266 0.063 0.359 0.156l6.141 6.141 6.141-6.141c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l0.781 0.781c0.094 0.094 0.156 0.234 0.156 0.359z\"></path>\n        <path v-if=\"icon === 'chevron-double-up'\" d=\"M16.797 20.5c0 0.125-0.063 0.266-0.156 0.359l-0.781 0.781c-0.094 0.094-0.219 0.156-0.359 0.156-0.125 0-0.266-0.063-0.359-0.156l-6.141-6.141-6.141 6.141c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-0.781-0.781c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l7.281-7.281c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l7.281 7.281c0.094 0.094 0.156 0.234 0.156 0.359zM16.797 14.5c0 0.125-0.063 0.266-0.156 0.359l-0.781 0.781c-0.094 0.094-0.219 0.156-0.359 0.156-0.125 0-0.266-0.063-0.359-0.156l-6.141-6.141-6.141 6.141c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-0.781-0.781c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l7.281-7.281c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l7.281 7.281c0.094 0.094 0.156 0.234 0.156 0.359z\"></path>\n\n        <path v-if=\"icon === 'chevron-down'\" d=\"M22.54 10.821l-9.938 9.924c-0.335 0.335-0.871 0.335-1.205 0l-9.938-9.924c-0.335-0.335-0.335-0.884 0-1.219l2.223-2.21c0.335-0.335 0.871-0.335 1.205 0l7.112 7.112 7.112-7.112c0.335-0.335 0.871-0.335 1.205 0l2.223 2.21c0.335 0.335 0.335 0.884 0 1.219z\" ></path>\n        <path v-if=\"icon === 'chevron-up'\" d=\"M22.54 17.826l-2.223 2.21c-0.335 0.335-0.871 0.335-1.205 0l-7.112-7.112-7.112 7.112c-0.335 0.335-0.871 0.335-1.205 0l-2.223-2.21c-0.335-0.335-0.335-0.884 0-1.219l9.938-9.924c0.335-0.335 0.871-0.335 1.205 0l9.938 9.924c0.335 0.335 0.335 0.884 0 1.219z\"></path>\n        <path v-if=\"icon === 'download' || icon === 'down'\" d=\"M12 23.25l11.25-11.25h-6.75v-12h-9v12h-6.75z\"></path>\n        <path v-if=\"icon === 'key'\" d=\"M12.804 9c1.038-1.793 2.977-3 5.196-3 3.311 0 6 2.689 6 6s-2.689 6-6 6c-2.219 0-4.158-1.207-5.196-3h-3.804l-1.506-1.503-1.494 1.503-1.48-1.503-1.52 1.503-3-3.032 2.53-2.968h10.274zm7.696 1.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z\"></path>\n        <path v-if=\"icon === 'lock-closed'\" d=\"M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z\"></path>\n        <path v-if=\"icon === 'lock-open'\" d=\"M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z\"></path>\n        <path v-if=\"icon === 'plus'\" d=\"M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z\"></path>\n        <path v-if=\"icon === 'plus-square'\" d=\"M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-5v5h-4v-5h-5v-4h5v-5h4v5h5v4z\"></path>\n        <path v-if=\"icon === 'x'\" d=\"M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z\"></path>\n        <path v-if=\"icon === 'upload' || icon === 'up'\"  d=\"M12 0.75l-11.25 11.25h6.75v12h9v-12h6.75z\"></path>\n        <path v-if=\"icon === 'mining'\"  d=\"M23.672 19.429l-7.067-7.067c-0.438-0.438-1.153-0.438-1.591 0l-0.53 0.53-4.313-4.313 7.079-7.079h-7.5l-3.329 3.329-0.33-0.329h-1.591v1.591l0.329 0.329-4.829 4.83 3.75 3.75 4.829-4.829 4.313 4.313-0.53 0.53c-0.438 0.438-0.438 1.153 0 1.591l7.067 7.067c0.438 0.438 1.153 0.438 1.591 0l2.652-2.652c0.438-0.437 0.438-1.153 0-1.591z\"></path>\n        <path v-if=\"icon === 'sun-glasses'\"  d=\"M16.5 10.707c0.063-0.010 0.126-0.021 0.19-0.035 3.203-0.802 7.718-0.765 10.041-0.409 0.28 0.043 0.325 1.215 0.075 1.256-0.459 0.169-0.655 0.59-0.655 0.59s-0.137 0.374-0.535 1.894c-0.398 1.52-1.347 1.702-1.347 1.702s-1.162 0.261-2.502 0.261c-1.34 0-2.142-0.055-3-0.446s-1.233-1.477-1.233-1.477c0 0-0.432-0.937-0.73-1.82-0.045-0.134-0.163-0.225-0.304-0.284-0.14 0.058-0.259 0.15-0.304 0.284-0.298 0.884-0.73 1.82-0.73 1.82s-0.375 1.087-1.233 1.477c-0.858 0.39-1.66 0.446-3 0.446s-2.502-0.261-2.502-0.261c0 0-0.949-0.182-1.347-1.702s-0.535-1.894-0.535-1.894c0 0-0.196-0.421-0.655-0.59-0.249-0.041-0.205-1.213 0.075-1.256 2.323-0.356 6.839-0.393 10.041 0.409 0.064 0.013 0.127 0.025 0.19 0.035zM16.5 29c6.904 0 12.5-5.596 12.5-12.5s-5.596-12.5-12.5-12.5c-6.904 0-12.5 5.596-12.5 12.5s5.596 12.5 12.5 12.5zM16.481 22c3.481 0 5.519-2 5.519-2v1c0 0-2.037 2-5.519 2s-5.481-2-5.481-2v-1c0 0 2 2 5.481 2z\"></path>\n        <path v-if=\"icon === 'sun-glasses2'\"  d=\"M26.11 10.181v0c-2.442-0.275-6.483-0.245-9.42 0.491-0.064 0.013-0.127 0.025-0.19 0.035-0.063-0.010-0.126-0.021-0.19-0.035-2.937-0.736-6.978-0.765-9.42-0.491v0c2.056-3.121 5.593-5.181 9.61-5.181s7.554 2.060 9.61 5.181zM26.856 11.494c0.733 1.513 1.144 3.212 1.144 5.006 0 6.351-5.149 11.5-11.5 11.5s-11.5-5.149-11.5-11.5c0-1.794 0.411-3.493 1.144-5.006 0.015 0.014 0.031 0.023 0.049 0.026 0.459 0.169 0.655 0.59 0.655 0.59s0.137 0.374 0.535 1.894c0.398 1.52 1.347 1.702 1.347 1.702s1.162 0.261 2.502 0.261c1.34 0 2.142-0.055 3-0.446s1.233-1.477 1.233-1.477c0 0 0.432-0.937 0.73-1.82 0.045-0.134 0.163-0.225 0.304-0.284 0.14 0.058 0.259 0.15 0.304 0.284 0.298 0.884 0.73 1.82 0.73 1.82s0.375 1.087 1.233 1.477c0.858 0.39 1.66 0.446 3 0.446s2.502-0.261 2.502-0.261c0 0 0.949-0.182 1.347-1.702s0.535-1.894 0.535-1.894c0 0 0.196-0.421 0.655-0.59 0.018-0.003 0.034-0.012 0.049-0.026v0zM16.5 29c6.904 0 12.5-5.596 12.5-12.5s-5.596-12.5-12.5-12.5c-6.904 0-12.5 5.596-12.5 12.5s5.596 12.5 12.5 12.5v0zM16.481 22c-3.481 0-5.481-2-5.481-2v1c0 0 2 2 5.481 2s5.519-2 5.519-2v-1c0 0-2.037 2-5.519 2v0z\"></path>\n        <path v-if=\"icon === 'terminal'\"  d=\"M0 2v28h32v-28h-32zM30 28h-28v-24h28v24zM28 6h-24v20h24v-20zM14 16h-2v2h-2v2h-2v-2h2v-2h2v-2h-2v-2h-2v-2h2v2h2v2h2v2zM22 20h-6v-2h6v2z\"></path>\n        <path v-if=\"icon === 'network'\" d=\"M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 30c-1.967 0-3.84-0.407-5.538-1.139l7.286-8.197c0.163-0.183 0.253-0.419 0.253-0.664v-3c0-0.552-0.448-1-1-1-3.531 0-7.256-3.671-7.293-3.707-0.188-0.188-0.442-0.293-0.707-0.293h-4c-0.552 0-1 0.448-1 1v6c0 0.379 0.214 0.725 0.553 0.894l3.447 1.724v5.871c-3.627-2.53-6-6.732-6-11.489 0-2.147 0.484-4.181 1.348-6h3.652c0.265 0 0.52-0.105 0.707-0.293l4-4c0.188-0.188 0.293-0.442 0.293-0.707v-2.419c1.268-0.377 2.61-0.581 4-0.581 2.2 0 4.281 0.508 6.134 1.412-0.13 0.109-0.256 0.224-0.376 0.345-1.133 1.133-1.757 2.64-1.757 4.243s0.624 3.109 1.757 4.243c1.139 1.139 2.663 1.758 4.239 1.758 0.099 0 0.198-0.002 0.297-0.007 0.432 1.619 1.211 5.833-0.263 11.635-0.014 0.055-0.022 0.109-0.026 0.163-2.541 2.596-6.084 4.208-10.004 4.208z\"></path>\n\n    </svg>\n\n</template>\n\n\n<script>\n\n    export default{\n\n        props:{\n            icon: {default: ''},\n            style: {default: ''},\n            width: {default: 24},\n            height: {default: 24},\n        },\n\n        methods:{\n\n            handleClick(e){\n                this.$emit('click',e );\n            }\n\n        }\n\n    }\n</script>\n\n<style>\n    .webdollarFont{\n        cursor: pointer;\n        color: #f6cd69;\n        transition: all .5s linear;\n        text-decoration: none;\n        width: 14px;\n        fill: #f6cd69;\n    }\n\n    .webdollarFont path{\n\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: this.width,
        height: this.height,
        viewBox: "0 0 " + this.width + " " + this.width
      },
      on: { click: this.handleClick }
    },
    [
      _vm.icon === "chevron-double-down"
        ? _c("path", {
            attrs: {
              d:
                "M16.797 13.5c0 0.125-0.063 0.266-0.156 0.359l-7.281 7.281c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-7.281-7.281c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l0.781-0.781c0.094-0.094 0.219-0.156 0.359-0.156 0.125 0 0.266 0.063 0.359 0.156l6.141 6.141 6.141-6.141c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l0.781 0.781c0.094 0.094 0.156 0.234 0.156 0.359zM16.797 7.5c0 0.125-0.063 0.266-0.156 0.359l-7.281 7.281c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-7.281-7.281c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l0.781-0.781c0.094-0.094 0.219-0.156 0.359-0.156 0.125 0 0.266 0.063 0.359 0.156l6.141 6.141 6.141-6.141c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l0.781 0.781c0.094 0.094 0.156 0.234 0.156 0.359z"
            }
          })
        : _vm._e(),
      _vm.icon === "chevron-double-up"
        ? _c("path", {
            attrs: {
              d:
                "M16.797 20.5c0 0.125-0.063 0.266-0.156 0.359l-0.781 0.781c-0.094 0.094-0.219 0.156-0.359 0.156-0.125 0-0.266-0.063-0.359-0.156l-6.141-6.141-6.141 6.141c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-0.781-0.781c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l7.281-7.281c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l7.281 7.281c0.094 0.094 0.156 0.234 0.156 0.359zM16.797 14.5c0 0.125-0.063 0.266-0.156 0.359l-0.781 0.781c-0.094 0.094-0.219 0.156-0.359 0.156-0.125 0-0.266-0.063-0.359-0.156l-6.141-6.141-6.141 6.141c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-0.781-0.781c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l7.281-7.281c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l7.281 7.281c0.094 0.094 0.156 0.234 0.156 0.359z"
            }
          })
        : _vm._e(),
      _vm.icon === "chevron-down"
        ? _c("path", {
            attrs: {
              d:
                "M22.54 10.821l-9.938 9.924c-0.335 0.335-0.871 0.335-1.205 0l-9.938-9.924c-0.335-0.335-0.335-0.884 0-1.219l2.223-2.21c0.335-0.335 0.871-0.335 1.205 0l7.112 7.112 7.112-7.112c0.335-0.335 0.871-0.335 1.205 0l2.223 2.21c0.335 0.335 0.335 0.884 0 1.219z"
            }
          })
        : _vm._e(),
      _vm.icon === "chevron-up"
        ? _c("path", {
            attrs: {
              d:
                "M22.54 17.826l-2.223 2.21c-0.335 0.335-0.871 0.335-1.205 0l-7.112-7.112-7.112 7.112c-0.335 0.335-0.871 0.335-1.205 0l-2.223-2.21c-0.335-0.335-0.335-0.884 0-1.219l9.938-9.924c0.335-0.335 0.871-0.335 1.205 0l9.938 9.924c0.335 0.335 0.335 0.884 0 1.219z"
            }
          })
        : _vm._e(),
      _vm.icon === "download" || _vm.icon === "down"
        ? _c("path", {
            attrs: { d: "M12 23.25l11.25-11.25h-6.75v-12h-9v12h-6.75z" }
          })
        : _vm._e(),
      _vm.icon === "key"
        ? _c("path", {
            attrs: {
              d:
                "M12.804 9c1.038-1.793 2.977-3 5.196-3 3.311 0 6 2.689 6 6s-2.689 6-6 6c-2.219 0-4.158-1.207-5.196-3h-3.804l-1.506-1.503-1.494 1.503-1.48-1.503-1.52 1.503-3-3.032 2.53-2.968h10.274zm7.696 1.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"
            }
          })
        : _vm._e(),
      _vm.icon === "lock-closed"
        ? _c("path", {
            attrs: {
              d:
                "M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"
            }
          })
        : _vm._e(),
      _vm.icon === "lock-open"
        ? _c("path", {
            attrs: {
              d:
                "M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"
            }
          })
        : _vm._e(),
      _vm.icon === "plus"
        ? _c("path", { attrs: { d: "M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z" } })
        : _vm._e(),
      _vm.icon === "plus-square"
        ? _c("path", {
            attrs: {
              d:
                "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-5v5h-4v-5h-5v-4h5v-5h4v5h5v4z"
            }
          })
        : _vm._e(),
      _vm.icon === "x"
        ? _c("path", {
            attrs: {
              d:
                "M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
            }
          })
        : _vm._e(),
      _vm.icon === "upload" || _vm.icon === "up"
        ? _c("path", {
            attrs: { d: "M12 0.75l-11.25 11.25h6.75v12h9v-12h6.75z" }
          })
        : _vm._e(),
      _vm.icon === "mining"
        ? _c("path", {
            attrs: {
              d:
                "M23.672 19.429l-7.067-7.067c-0.438-0.438-1.153-0.438-1.591 0l-0.53 0.53-4.313-4.313 7.079-7.079h-7.5l-3.329 3.329-0.33-0.329h-1.591v1.591l0.329 0.329-4.829 4.83 3.75 3.75 4.829-4.829 4.313 4.313-0.53 0.53c-0.438 0.438-0.438 1.153 0 1.591l7.067 7.067c0.438 0.438 1.153 0.438 1.591 0l2.652-2.652c0.438-0.437 0.438-1.153 0-1.591z"
            }
          })
        : _vm._e(),
      _vm.icon === "sun-glasses"
        ? _c("path", {
            attrs: {
              d:
                "M16.5 10.707c0.063-0.010 0.126-0.021 0.19-0.035 3.203-0.802 7.718-0.765 10.041-0.409 0.28 0.043 0.325 1.215 0.075 1.256-0.459 0.169-0.655 0.59-0.655 0.59s-0.137 0.374-0.535 1.894c-0.398 1.52-1.347 1.702-1.347 1.702s-1.162 0.261-2.502 0.261c-1.34 0-2.142-0.055-3-0.446s-1.233-1.477-1.233-1.477c0 0-0.432-0.937-0.73-1.82-0.045-0.134-0.163-0.225-0.304-0.284-0.14 0.058-0.259 0.15-0.304 0.284-0.298 0.884-0.73 1.82-0.73 1.82s-0.375 1.087-1.233 1.477c-0.858 0.39-1.66 0.446-3 0.446s-2.502-0.261-2.502-0.261c0 0-0.949-0.182-1.347-1.702s-0.535-1.894-0.535-1.894c0 0-0.196-0.421-0.655-0.59-0.249-0.041-0.205-1.213 0.075-1.256 2.323-0.356 6.839-0.393 10.041 0.409 0.064 0.013 0.127 0.025 0.19 0.035zM16.5 29c6.904 0 12.5-5.596 12.5-12.5s-5.596-12.5-12.5-12.5c-6.904 0-12.5 5.596-12.5 12.5s5.596 12.5 12.5 12.5zM16.481 22c3.481 0 5.519-2 5.519-2v1c0 0-2.037 2-5.519 2s-5.481-2-5.481-2v-1c0 0 2 2 5.481 2z"
            }
          })
        : _vm._e(),
      _vm.icon === "sun-glasses2"
        ? _c("path", {
            attrs: {
              d:
                "M26.11 10.181v0c-2.442-0.275-6.483-0.245-9.42 0.491-0.064 0.013-0.127 0.025-0.19 0.035-0.063-0.010-0.126-0.021-0.19-0.035-2.937-0.736-6.978-0.765-9.42-0.491v0c2.056-3.121 5.593-5.181 9.61-5.181s7.554 2.060 9.61 5.181zM26.856 11.494c0.733 1.513 1.144 3.212 1.144 5.006 0 6.351-5.149 11.5-11.5 11.5s-11.5-5.149-11.5-11.5c0-1.794 0.411-3.493 1.144-5.006 0.015 0.014 0.031 0.023 0.049 0.026 0.459 0.169 0.655 0.59 0.655 0.59s0.137 0.374 0.535 1.894c0.398 1.52 1.347 1.702 1.347 1.702s1.162 0.261 2.502 0.261c1.34 0 2.142-0.055 3-0.446s1.233-1.477 1.233-1.477c0 0 0.432-0.937 0.73-1.82 0.045-0.134 0.163-0.225 0.304-0.284 0.14 0.058 0.259 0.15 0.304 0.284 0.298 0.884 0.73 1.82 0.73 1.82s0.375 1.087 1.233 1.477c0.858 0.39 1.66 0.446 3 0.446s2.502-0.261 2.502-0.261c0 0 0.949-0.182 1.347-1.702s0.535-1.894 0.535-1.894c0 0 0.196-0.421 0.655-0.59 0.018-0.003 0.034-0.012 0.049-0.026v0zM16.5 29c6.904 0 12.5-5.596 12.5-12.5s-5.596-12.5-12.5-12.5c-6.904 0-12.5 5.596-12.5 12.5s5.596 12.5 12.5 12.5v0zM16.481 22c-3.481 0-5.481-2-5.481-2v1c0 0 2 2 5.481 2s5.519-2 5.519-2v-1c0 0-2.037 2-5.519 2v0z"
            }
          })
        : _vm._e(),
      _vm.icon === "terminal"
        ? _c("path", {
            attrs: {
              d:
                "M0 2v28h32v-28h-32zM30 28h-28v-24h28v24zM28 6h-24v20h24v-20zM14 16h-2v2h-2v2h-2v-2h2v-2h2v-2h-2v-2h-2v-2h2v2h2v2h2v2zM22 20h-6v-2h6v2z"
            }
          })
        : _vm._e(),
      _vm.icon === "network"
        ? _c("path", {
            attrs: {
              d:
                "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 30c-1.967 0-3.84-0.407-5.538-1.139l7.286-8.197c0.163-0.183 0.253-0.419 0.253-0.664v-3c0-0.552-0.448-1-1-1-3.531 0-7.256-3.671-7.293-3.707-0.188-0.188-0.442-0.293-0.707-0.293h-4c-0.552 0-1 0.448-1 1v6c0 0.379 0.214 0.725 0.553 0.894l3.447 1.724v5.871c-3.627-2.53-6-6.732-6-11.489 0-2.147 0.484-4.181 1.348-6h3.652c0.265 0 0.52-0.105 0.707-0.293l4-4c0.188-0.188 0.293-0.442 0.293-0.707v-2.419c1.268-0.377 2.61-0.581 4-0.581 2.2 0 4.281 0.508 6.134 1.412-0.13 0.109-0.256 0.224-0.376 0.345-1.133 1.133-1.757 2.64-1.757 4.243s0.624 3.109 1.757 4.243c1.139 1.139 2.663 1.758 4.239 1.758 0.099 0 0.198-0.002 0.297-0.007 0.432 1.619 1.211 5.833-0.263 11.635-0.014 0.055-0.022 0.109-0.026 0.163-2.541 2.596-6.084 4.208-10.004 4.208z"
            }
          })
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4a4e8449", esExports)
  }
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("45018b1c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6fd10b33\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Address.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6fd10b33\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Address.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.isImining {\n    animation:spin 1s linear infinite;\n}\n@keyframes spin {\n100% { transform:rotate(60deg);\n}\n}\n.actuallMiningAddress{\n    position: relative;\n    margin-left: -45px;\n    margin-top: -5px;\n    margin-right: 30px;\n}\n#allWallets .walletAddress{\n    padding: 0!important;\n    width: 100%;\n    border-top-left-radius: 50px;\n    border-bottom-left-radius: 50px;\n    margin: 15px 10px;\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 126px;\n        grid-template-columns: 1fr 126px;\n    transition: all .3s linear;\n}\n#allWallets .walletAddress .addressIdentityBox{\n    cursor: pointer;\n}\n#allWallets .walletAddress:last-child{\n    margin-bottom: 1px;\n}\n#allWallets .walletAddress img{\n    height: 40px;\n    display: inline-block;\n    vertical-align: top;\n    border-radius: 100%;\n}\n#allWallets .walletAddress:hover{\n    margin: 15px 20px;\n    background-color: #313131;\n    transition: all .3s linear;\n}\n.walletAddress b{\n    text-align: center;\n    display: inline-block;\n    color: #fcbd2d;\n    line-height: 40px;\n    padding-top: 1px;\n    margin-left: 7px;\n    font-size: 12px;\n    vertical-align: top;\n}\n.addressIdentityBox .balanceShowContent svg{\n    line-height: normal;\n    padding: 10px 0 0 0!important;\n}\n.walletAddress:hover .walletReceivingImg, .walletAddress:hover .walletSendingImg{\n    display: none;\n}\n#transactionAddressStatus{\n    display: inline-block;\n    vertical-align: top;\n}\n.addressButton{\n    display:inline-block;\n    padding: 7px 12px;\n    vertical-align: top;\n    height: 27px;\n    margin-right: -4px;\n    cursor: pointer;\n    transition: all .3s linear;\n}\n.addressButton:hover{\n    background-color: #1f1f1f;\n    transition: all .3s linear;\n}\n.actionsBox{\n    float: right;\n    text-align:right;\n    margin-right: 20px;\n    display: block!important;\n}\n.addressIdentityBox{\n    display: inline-block;\n}\n.addressIdentityBox .fontColor svg{\n    width: 16px;\n    height: 16px;\n    padding: 10px 0;\n}\n.hoverAddress:hover .actionsBox{\n    display: inline-block;\n}\n.fontColor{\n    color: #f9dc95!important;\n    fill: #f9dc95;\n}\n.walletMiningStatus{\n    margin-top: 17px;\n    vertical-align: top;\n}\n.walletSendingImg{\n    fill:#298bea!important;\n    margin-left: 3px;\n    margin-top: 7px;\n    width: 10px;\n    position: relative;\n}\n.currencyName{\n    margin-left: 2px!important;\n    margin-right: 4px!important;\n    display: none!important;\n}\n.walletReceivingImg{\n    fill:#219411!important;\n    margin-left: 0;\n    margin-top: 7px;\n    width: 10px;\n    position: relative;\n    display: inline-block;\n    vertical-align: top;\n}\n@media only screen and (max-width : 831px) {\n.actionsBox{\n        display: block;\n}\n.addressButton{\n        height: 22px;\n        padding: 9px;\n        margin: 0 5px;\n}\n.actuallMiningAddress{\n        margin-left: -45px;\n}\n.walletReceivingImg{\n        margin-top: 11px;\n}\n#allWallets .walletAddress{\n        -ms-grid-columns: 1fr 200px;\n            grid-template-columns: 1fr 200px;\n}\n.walletSendingImg, .walletReceivingImg{\n        margin-top: 11px;\n}\n.addressIdentityBox .fontColor svg{\n        width: 30px;\n        height: 26px;\n}\n.currencyName {\n        margin-left: 10px!important;\n        margin-top: -6px;\n}\n}\n@media only screen and (max-width: 600px){\n.walletSendingImg, .walletReceivingImg{\n        margin-top: 7px;\n}\n.amountCurrency{\n        display: none!important;\n}\n.walletReceivingImg{\n        display: none;\n}\n.addressButton{\n        padding: 9px 10px;\n}\n#allWallets .walletAddress{\n        -ms-grid-columns: 1fr 170px;\n            grid-template-columns: 1fr 170px;\n}\n.addressIdentityBox .fontColor svg{\n        padding: 0;\n}\n.walletAddress b{\n        margin-top: 3px;\n}\n#allWallets .walletAddress .imageAndInput img {\n        height: 38px !important;\n}\n}\n@media only screen and (max-width : 400px) {\n.addressButton{\n        margin: 0;\n}\n.actionsBox .webdollarFont {\n        width: 14px!important;\n}\n.walletSendingImg{\n        display: none;\n}\n#allWallets .walletAddress{\n        -ms-grid-columns: 1fr 130px;\n            grid-template-columns: 1fr 130px;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/src/components/Wallet/Address/Address.vue"],"names":[],"mappings":";AAyPA;IAGA,kCAAA;CACA;AAGA;AAAA,OAAA,wBAAA;CAAA;CAAA;AAEA;IACA,mBAAA;IACA,mBAAA;IACA,iBAAA;IACA,mBAAA;CACA;AAEA;IACA,qBAAA;IACA,YAAA;IACA,6BAAA;IACA,gCAAA;IACA,kBAAA;IACA,kBAAA;IAAA,cAAA;IACA,4BAAA;QAAA,iCAAA;IACA,2BAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,mBAAA;CACA;AAEA;IACA,aAAA;IACA,sBAAA;IACA,oBAAA;IACA,oBAAA;CACA;AAEA;IACA,kBAAA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,mBAAA;IACA,sBAAA;IACA,eAAA;IACA,kBAAA;IACA,iBAAA;IACA,iBAAA;IACA,gBAAA;IACA,oBAAA;CACA;AAEA;IACA,oBAAA;IACA,8BAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,sBAAA;IACA,oBAAA;CACA;AAEA;IACA,qBAAA;IACA,kBAAA;IACA,oBAAA;IACA,aAAA;IACA,mBAAA;IACA,gBAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,aAAA;IACA,iBAAA;IACA,mBAAA;IACA,yBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,YAAA;IACA,aAAA;IACA,gBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,yBAAA;IACA,cAAA;CACA;AAEA;IACA,iBAAA;IACA,oBAAA;CACA;AAEA;IACA,uBAAA;IACA,iBAAA;IACA,gBAAA;IACA,YAAA;IACA,mBAAA;CACA;AAEA;IACA,2BAAA;IACA,4BAAA;IACA,wBAAA;CACA;AAEA;IACA,uBAAA;IACA,eAAA;IACA,gBAAA;IACA,YAAA;IACA,mBAAA;IACA,sBAAA;IACA,oBAAA;CACA;AAEA;AAEA;QACA,eAAA;CACA;AAEA;QACA,aAAA;QACA,aAAA;QACA,cAAA;CACA;AAEA;QACA,mBAAA;CACA;AAEA;QACA,iBAAA;CACA;AAEA;QACA,4BAAA;YAAA,iCAAA;CACA;AAEA;QACA,iBAAA;CACA;AAEA;QACA,YAAA;QACA,aAAA;CACA;AAEA;QACA,4BAAA;QACA,iBAAA;CACA;CAEA;AAEA;AAEA;QACA,gBAAA;CACA;AAEA;QACA,wBAAA;CACA;AAEA;QACA,cAAA;CACA;AAEA;QACA,kBAAA;CACA;AAEA;QACA,4BAAA;YAAA,iCAAA;CACA;AAEA;QACA,WAAA;CACA;AAEA;QACA,gBAAA;CACA;AAEA;QACA,wBAAA;CACA;CACA;AAEA;AAEA;QACA,UAAA;CACA;AAEA;QACA,sBAAA;CACA;AAEA;QACA,cAAA;CACA;AAEA;QACA,4BAAA;YAAA,iCAAA;CACA;CAEA","file":"Address.vue","sourcesContent":["<template>\n\n    <div class=\"walletAddress hoverAddress\">\n\n        <div class=\"addressIdentityBox\" v-on:click.stop=\"handleTransferFunds\">\n            <img class=\"walletAddressImage\" :src=\"this.getAddressPic\" >\n            <icon v-if=\"this.isMiningAddress\" class=\"btn actuallMiningAddress isImining\" alt=\"Mining\" text=\"Mining Address\" icon=\"mining\" style=\"display: inline-block\" />\n\n            <b class=\"fontColor\">\n                <show-balance :showPoolReward=\"isMiningAddress\" :address=\"this.address\" currency=\"0x01\"/>\n            </b>\n            <b class=\"amountCurrency currencyName\">WEBD</b>\n\n            <div id=\"transactionAddressStatus\">\n                <icon v-show=\"Object.keys(this.sendingMoney).length !== 0\" class=\"walletMiningStatus walletSendingImg\" icon='chevron-double-up'></icon>\n                <icon v-show=\"Object.keys(this.receivingMoney).length !== 0\" class=\"walletMiningStatus walletReceivingImg\" icon='chevron-double-down'></icon>\n            </div>\n        </div>\n\n        <div class=\"actionsBox hoverAddress\" :style=\"{marginBottom: this.opened ? this.walletButtonMarginOpened+'px': this.walletButtonMarginClosed+'px'}\">\n            <div class=\"addressButton\" v-on:click.stop=\"handleExport\">\n                <icon class=\"btn\" alt=\"Secure Wallet\" text=\"Download Address\" icon=\"download\"/>\n            </div>\n\n            <div class=\"addressButton\" v-on:click.stop=\"handleLock\">\n                <icon class=\"btn\" alt=\"Secure Wallet\" text=\"Lock Address\" :icon=\"this.addressLocked ? 'lock-closed' : 'lock-open'\" />\n            </div>\n\n            <div class=\"addressButton\" v-on:click.stop=\"handleDelete\">\n                <icon class=\"btn\" alt=\"Secure Wallet\" text=\"Delete Address\" icon=\"x\" />\n            </div>\n        </div>\n\n        <address-main-modal ref=\"refAddressMainModal\" :address=\"this.address\" :isMiningAddress=\"this.isMiningAddress\" />\n        <lock-modal ref=\"refLockModal\" :address=\"this.address\" />\n        <delete-modal ref=\"refDeleteModal\" :address=\"this.address\" />\n\n    </div>\n</template>\n\n\n<script>\n\n    import Vue from \"vue\";\n    import FileSaver from './../../../../node_modules/file-saver'\n    import icon from \"components/UI/icons/icon.vue\"\n    import AddressMainModal from \"./Modals/Main-Modal/Address-main.modal.vue\"\n    import LockModal from \"./Modals/Lock.modal.vue\"\n    import DeleteModal from \"./Modals/Delete.modal.vue\"\n    import ShowBalance from \"components/Wallet/Address/Balance/Show-Balance.vue\"\n    import BrowserHelpers from \"helpers/Browser.helpers\"\n    import Notification from \"helpers/Notification.helpers\"\n\n    export default{\n\n        //@onPendingTransactionsChanges\n        props:{\n            address:{default:''},\n            isMiningAddress: {default: false}\n        },\n\n        components:{ AddressMainModal, LockModal, DeleteModal, ShowBalance, icon },\n\n        computed: {\n\n            getAddressPic(){\n                return WebDollar.Blockchain.Wallet.getAddressPic(this.address);\n            },\n\n            isEncrypted(){\n\n            }\n\n        },\n\n        data: () => {\n            return {\n                addressLocked: false,\n                isMining: WebDollar.Blockchain.Mining.workers.workers,\n\n                sendingMoney: {},\n                receivingMoney: {},\n\n                subscriptionTransactions: null,\n\n                transactions: {},\n            }\n        },\n\n        async mounted(){\n\n            if (typeof window === 'undefined') return;\n\n            Notification.setVueInstance(this);\n\n            if (await WebDollar.Blockchain.Wallet.isAddressEncrypted(this.address)){\n                this.addressLocked = true;\n            }\n\n            //subscribe to transactions changes\n            let data = WebDollar.Blockchain.Transactions.subscribeTransactionsChanges(this.address, (data)=>{\n\n                if (data.transaction !== undefined)\n                    this._addTransaction (data.transaction);\n                else\n                    Vue.delete(this.transactions, data.txId);\n\n            });\n\n            if (data !== null && data.result) {\n                this.subscription = data.subscription;\n                this._addTransactions(data.transactions);\n            }\n\n        },\n\n        methods:{\n\n            formatMoneyNumber: BrowserHelpers.formatMoneyNumber,\n\n            handleTransferFunds(e){\n\n                this.$refs['refAddressMainModal'].showModal(e);\n\n            },\n\n            checkIfWalletIsLock(){\n                if (WebDollar.Blockchain.Wallet.isAddressEncrypted(this.address)){\n                    this.addressLocked = true;\n                }\n            },\n\n            async handleExport(e){\n\n                if (this.addressLocked === false){\n                    Notification.addAlert(undefined, \"info\", \"Export Warning\", \"The exported address is not encrypted and can be accessed by anyone who has a copy of the file. We recommend deleting the previous downloaded file and exporting your encrypted wallet.\", 20000);\n                }\n\n                let answer = await WebDollar.Blockchain.Wallet.exportAddressToJSON(this.address);\n\n                if (answer.result){\n\n                    let addressFile = new Blob([JSON.stringify(answer.data)], {type: \"application/json;charset=utf-8\"});\n                    let fileName = \"WEBD$\" + WebDollar.Blockchain.Wallet.getUnencodedAddress(this.address).toString(\"hex\") + \".webd\";\n                    FileSaver.saveAs(addressFile, fileName);\n                    Notification.addAlert(undefined, \"success\", \"Export Success\", \"Your address has been exported.\", 5000);\n\n                } else {\n                    Notification.addAlert(undefined, \"error\", \"Export Error\", answer.message, 5000);\n                }\n\n            },\n\n            handleLock(e){\n\n                this.$refs['refLockModal'].showModal(e);\n                this.verifyIfBecomeLocked(0);\n\n            },\n\n            verifyIfBecomeLocked(calledTime){\n\n                this.checkIfWalletIsLock();\n\n                setInterval(function(){\n\n                    if(this.addressLocked===false){\n\n                        if (calledTime < 100){\n                            this.verifyIfBecomeLocked(calledTime+1)\n                        }\n\n                    }\n\n                }, 2000);\n\n            },\n\n            handleDelete(e){\n\n                this.$refs['refDeleteModal'].showModal(e);\n\n            },\n\n            _addTransaction(transaction){\n                // in case it is a new transaction\n                Vue.set(this.transactions, transaction.txId, transaction);\n\n                this._processTransactions();\n            },\n\n            _addTransactions(transactions){\n\n                for (let key in transactions)\n                    this._addTransaction(transactions[key]);\n\n            },\n\n            _processTransactions(){\n\n                this.receivingMoney = {};\n                this.sendingMoney = {};\n\n                for (let key in this.transactions){\n\n                    let transaction = this.transactions[key] ;\n\n                    if (transaction.confirmed) {\n\n                        Vue.delete(this.receivingMoney, key);\n                        Vue.delete(this.sendingMoney, key);\n\n                    } else {\n\n                        // check if it is receiving or sending\n\n                        let found = false;\n                        transaction.from.addresses.forEach((address)=>{\n\n                            if (!found && address.address === this.address)\n                                found = true;\n                        });\n\n                        if (found) {\n                            Vue.set(this.sendingMoney, key, transaction);\n                            continue;\n                        }\n\n                        transaction.to.addresses.forEach((address)=>{\n\n                            if (!found && address.address === this.address)\n                                found = true;\n\n                        });\n\n                        if (found)\n                            Vue.set(this.receivingMoney, key, transaction );\n                    }\n                }\n\n                this.$emit(\"onPendingTransactionsChanges\", this.receivingMoney, this.sendingMoney );\n\n            }\n        }\n\n    }\n</script>\n\n<style>\n\n    .isImining {\n        -webkit-animation:spin 1s linear infinite;\n        -moz-animation:spin 1s linear infinite;\n        animation:spin 1s linear infinite;\n    }\n    @-moz-keyframes spin { 100% { -moz-transform: rotate(60deg); } }\n    @-webkit-keyframes spin { 100% { -webkit-transform: rotate(60deg); } }\n    @keyframes spin { 100% { -webkit-transform: rotate(60deg); transform:rotate(60deg); } }\n\n    .actuallMiningAddress{\n        position: relative;\n        margin-left: -45px;\n        margin-top: -5px;\n        margin-right: 30px;\n    }\n\n    #allWallets .walletAddress{\n        padding: 0!important;\n        width: 100%;\n        border-top-left-radius: 50px;\n        border-bottom-left-radius: 50px;\n        margin: 15px 10px;\n        display: grid;\n        grid-template-columns: 1fr 126px;\n        transition: all .3s linear;\n    }\n\n    #allWallets .walletAddress .addressIdentityBox{\n        cursor: pointer;\n    }\n\n    #allWallets .walletAddress:last-child{\n        margin-bottom: 1px;\n    }\n\n    #allWallets .walletAddress img{\n        height: 40px;\n        display: inline-block;\n        vertical-align: top;\n        border-radius: 100%;\n    }\n\n    #allWallets .walletAddress:hover{\n        margin: 15px 20px;\n        background-color: #313131;\n        transition: all .3s linear;\n    }\n\n    .walletAddress b{\n        text-align: center;\n        display: inline-block;\n        color: #fcbd2d;\n        line-height: 40px;\n        padding-top: 1px;\n        margin-left: 7px;\n        font-size: 12px;\n        vertical-align: top;\n    }\n\n    .addressIdentityBox .balanceShowContent svg{\n        line-height: normal;\n        padding: 10px 0 0 0!important;\n    }\n\n    .walletAddress:hover .walletReceivingImg, .walletAddress:hover .walletSendingImg{\n        display: none;\n    }\n\n    #transactionAddressStatus{\n        display: inline-block;\n        vertical-align: top;\n    }\n\n    .addressButton{\n        display:inline-block;\n        padding: 7px 12px;\n        vertical-align: top;\n        height: 27px;\n        margin-right: -4px;\n        cursor: pointer;\n        transition: all .3s linear;\n    }\n\n    .addressButton:hover{\n        background-color: #1f1f1f;\n        transition: all .3s linear;\n    }\n\n    .actionsBox{\n        float: right;\n        text-align:right;\n        margin-right: 20px;\n        display: block!important;\n    }\n\n    .addressIdentityBox{\n        display: inline-block;\n    }\n\n    .addressIdentityBox .fontColor svg{\n        width: 16px;\n        height: 16px;\n        padding: 10px 0;\n    }\n\n    .hoverAddress:hover .actionsBox{\n        display: inline-block;\n    }\n\n    .fontColor{\n        color: #f9dc95!important;\n        fill: #f9dc95;\n    }\n\n    .walletMiningStatus{\n        margin-top: 17px;\n        vertical-align: top;\n    }\n\n    .walletSendingImg{\n        fill:#298bea!important;\n        margin-left: 3px;\n        margin-top: 7px;\n        width: 10px;\n        position: relative;\n    }\n\n    .currencyName{\n        margin-left: 2px!important;\n        margin-right: 4px!important;\n        display: none!important;\n    }\n\n    .walletReceivingImg{\n        fill:#219411!important;\n        margin-left: 0;\n        margin-top: 7px;\n        width: 10px;\n        position: relative;\n        display: inline-block;\n        vertical-align: top;\n    }\n\n    @media only screen and (max-width : 831px) {\n\n        .actionsBox{\n            display: block;\n        }\n\n        .addressButton{\n            height: 22px;\n            padding: 9px;\n            margin: 0 5px;\n        }\n\n        .actuallMiningAddress{\n            margin-left: -45px;\n        }\n\n        .walletReceivingImg{\n            margin-top: 11px;\n        }\n\n        #allWallets .walletAddress{\n            grid-template-columns: 1fr 200px;\n        }\n\n        .walletSendingImg, .walletReceivingImg{\n            margin-top: 11px;\n        }\n\n        .addressIdentityBox .fontColor svg{\n            width: 30px;\n            height: 26px;\n        }\n\n        .currencyName {\n            margin-left: 10px!important;\n            margin-top: -6px;\n        }\n\n    }\n\n    @media only screen and (max-width: 600px){\n\n        .walletSendingImg, .walletReceivingImg{\n            margin-top: 7px;\n        }\n\n        .amountCurrency{\n            display: none!important;\n        }\n\n        .walletReceivingImg{\n            display: none;\n        }\n\n        .addressButton{\n            padding: 9px 10px;\n        }\n\n        #allWallets .walletAddress{\n            grid-template-columns: 1fr 170px;\n        }\n\n        .addressIdentityBox .fontColor svg{\n            padding: 0;\n        }\n\n        .walletAddress b{\n            margin-top: 3px;\n        }\n\n        #allWallets .walletAddress .imageAndInput img {\n            height: 38px !important;\n        }\n    }\n\n    @media only screen and (max-width : 400px) {\n\n        .addressButton{\n            margin: 0;\n        }\n\n        .actionsBox .webdollarFont {\n            width: 14px!important;\n        }\n\n        .walletSendingImg{\n            display: none;\n        }\n\n        #allWallets .walletAddress{\n            grid-template-columns: 1fr 130px;\n        }\n\n    }\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Address_main_modal_vue__ = __webpack_require__(20);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fe1c3922_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Address_main_modal_vue__ = __webpack_require__(88);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(56)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Address_main_modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fe1c3922_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Address_main_modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Main-Modal/Address-main.modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fe1c3922", Component.options)
  } else {
    hotAPI.reload("data-v-fe1c3922", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("7837feb3", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fe1c3922\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Address-main.modal.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fe1c3922\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Address-main.modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.miningAddress{\n    display: block!important;\n    font-size: 12px;\n    line-height: 30px;\n    padding-top: 7px;\n}\n.addressMainModal .modifyPadding{\n    padding: 0!important;\n}\n.balanceText{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 100px;\n        grid-template-columns: 1fr 100px;\n    grid-row-gap: 10px;\n    padding-bottom: 24px;\n}\n.balanceAmount{\n    font-size: 14px;\n    text-align: left;\n}\n.balanceContent, .copyButton, .actionButton, .headerModal, .transferList{\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;\n}\n.balanceContent{\n    padding: 45px 10px 20px 10px!important\n}\n.balanceContent svg{\n    width: 20px;\n    height: 20px;\n    padding: 0!important;\n}\n.balanceTitle{\n    text-align: right;\n    font-size: 14px;\n    padding-right: 10px;\n}\n.balanceAmount .balanceContent{\n    padding: 0;\n}\n@media (max-width: 1000px){\n.balanceText{\n        -ms-grid-columns: 1fr;\n            grid-template-columns: 1fr;\n}\n}\n@media (max-width: 600px){\n.balanceContent{\n        padding: 10px!important\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/Main-Modal/src/components/Wallet/Address/Modals/Main-Modal/Address-main.modal.vue"],"names":[],"mappings":";AA8KA;IACA,yBAAA;IACA,gBAAA;IACA,kBAAA;IACA,iBAAA;CACA;AAEA;IACA,qBAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,4BAAA;QAAA,iCAAA;IACA,mBAAA;IACA,qBAAA;CACA;AAEA;IACA,gBAAA;IACA,iBAAA;CACA;AAEA;IACA,0BAAA,EAAA,6BAAA;IACA,uBAAA,KAAA,iBAAA;IACA,sBAAA,MAAA,YAAA;IACA,kBAAA;CACA;AAEA;IACA,sCAAA;CACA;AAEA;IACA,YAAA;IACA,aAAA;IACA,qBAAA;CACA;AAEA;IACA,kBAAA;IACA,gBAAA;IACA,oBAAA;CACA;AAEA;IACA,WAAA;CACA;AAEA;AAEA;QACA,sBAAA;YAAA,2BAAA;CACA;CAEA;AAEA;AAEA;QACA,uBAAA;CACA;CACA","file":"Address-main.modal.vue","sourcesContent":["<template>\n\n    <div v-if=\"this.address !== null && this.address !== undefined\">\n\n        <modal title=\"Wallet Address\" ref=\"refModal\" class=\"addressMainModal\">\n\n            <div slot=\"content\">\n\n                <div class=\"twoColumns\">\n\n                    <div class=\"section\">\n\n                        <div >\n                            <img class=\"walletAddressImage\" :src=\"this.getAddressPic\" >\n                            <b style=\"color:gray\" id=\"walletID\">{{this.address.toString()}}</b>\n                        </div>\n\n                        <div @click=\"copyToClipboard\" class=\"copyButton\" :class=\" this.clipboardText!='Copied' ? 'modalButton2' : 'modalButton2Success' \">\n                            {{this.clipboardText}}\n                        </div>\n\n                    </div>\n\n                    <div class=\"section balanceContent\">\n\n                        <div class=\"balanceText\">\n\n                            <div class=\"balanceTitle\" title=\"Balance available to be spent\">\n                                Available Balance:\n                            </div>\n                            <div class=\"balanceAmount\" title=\"Balance available to be spent\">\n                                <show-balance :address=\"this.address\" currency=\"0x01\"/>\n                            </div>\n\n                            <div class=\"balanceTitle\" style=\"letter-spacing: 0.1px\" title=\"The balance you will have at the next block mined by your pool\">\n                                Potential Balance:\n                            </div>\n                            <div class=\"balanceAmount\" title=\"The balance you will have at the next block mined by your pool\">\n                                <show-balance :showPoolReward=\"isMiningAddress\" :address=\"this.address\" currency=\"0x01\"/>\n                            </div>\n\n                        </div>\n\n                        <div class=\"miningAddress\" v-if=\"isMiningAddress\">\n                            You are mining on this Address\n                        </div>\n                        <div  v-if=\"!isMiningAddress\" @click=\"handleSetAddress\" class=\"modalButton2\">\n                            Mine on this address\n                        </div>\n\n                    </div>\n\n                </div>\n\n                <div class=\"addressActions\">\n                    <div @click=\"this.showTransfer\" :class=\"[ this.partActivated === 'transfer' ? 'actionButton activeActionButton' : 'actionButton' ]\">\n                        Transfer\n                    </div>\n                    <div @click=\"this.showTransactions\" :class=\"[ this.partActivated === 'transactions' ? 'actionButton activeActionButton' : 'actionButton' ]\">\n                        Transactions\n                    </div>\n                </div>\n\n                <transfer :address=\"this.address\" :style=\"{display: this.partActivated === 'transfer' ? 'block': 'none'}\" @onTransferSuccess=\"this.handleTransferSuccess\"/>\n\n                <transactions :address=\"this.address\" :style=\"{display: this.partActivated === 'transactions' ? 'block': 'none'}\" />\n\n            </div>\n\n\n        </modal>\n\n    </div>\n\n</template>\n\n<script>\n\n    var Vue = require('vue/dist/vue.min.js');\n\n    import Modal from \"components/UI/modal/Modal.vue\"\n    import Clipboard from '../../../../../../node_modules/v-clipboard/dist/index.min'\n    import ShowBalance from \"components/Wallet/Address/Balance/Show-Balance.vue\"\n    import ShowPotentialBalance from \"components/Wallet/Address/Balance/Balances/Show-Sum-Balances.vue\"\n    import icon from \"components/UI/icons/icon.vue\"\n\n    import Transactions from \"./parts/Transactions/Transactions.part.vue\"\n    import Transfer from \"./parts/Transfer.part.vue\"\n\n    import Notification from \"helpers/Notification.helpers\"\n\n    Vue.use(Clipboard);\n\n    export default {\n\n        props: {\n            address: {default: null},\n            isMiningAddress: {default: false},\n        },\n\n        components: {\n            ShowBalance,\n            Modal,\n            Transactions,\n            Transfer,\n            icon,\n            ShowPotentialBalance\n        },\n\n        data: () => {\n            return {\n                partActivated : 'none',\n\n                clipboardText: 'Copy Address',\n            }\n        },\n\n        computed:{\n            getAddressPic(){\n                return WebDollar.Blockchain.Wallet.getAddressPic(this.address);\n            }\n        },\n\n        methods: {\n\n            showTransfer() {\n                this.partActivated = \"transfer\";\n            },\n\n            showBuy() {\n                this.partActivated = \"buy/sell\";\n            },\n            showTransactions(){\n                this.partActivated = \"transactions\";\n            },\n\n            closeModal() {\n                this.$refs['refModal'].closeModal();\n            },\n\n            showModal(e) {\n                if (this.$refs['refModal'].modalOpened === false){\n                    this.$refs['refModal'].showModal();\n                }\n                this.clipboardText= 'Copy Address';\n            },\n            copyToClipboard(){\n                this.clipboardText = 'Copied';\n                this.$clipboard(this.address);\n            },\n\n            handleSetAddress(){\n                WebDollar.Blockchain.Mining.minerAddress = this.address;\n                Notification.addAlert(undefined, \"success\", \"Mining Address Changed\", \"You're mining now on \" + this.address ,5000);\n            },\n\n            handleTransferSuccess(){\n                this.showTransactions();\n            }\n\n        },\n\n        mounted() {\n\n            if (typeof window === 'undefined') return;\n\n            Notification.setVueInstance(this);\n\n        },\n\n    }\n\n</script>\n\n<style>\n    .miningAddress{\n        display: block!important;\n        font-size: 12px;\n        line-height: 30px;\n        padding-top: 7px;\n    }\n\n    .addressMainModal .modifyPadding{\n        padding: 0!important;\n    }\n\n    .balanceText{\n        display: grid;\n        grid-template-columns: 1fr 100px;\n        grid-row-gap: 10px;\n        padding-bottom: 24px;\n    }\n\n    .balanceAmount{\n        font-size: 14px;\n        text-align: left;\n    }\n\n    .balanceContent, .copyButton, .actionButton, .headerModal, .transferList{\n        -webkit-user-select: none;  /* Chrome all / Safari all */\n        -moz-user-select: none;     /* Firefox all */\n        -ms-user-select: none;      /* IE 10+ */\n        user-select: none;\n    }\n\n    .balanceContent{\n        padding: 45px 10px 20px 10px!important\n    }\n\n    .balanceContent svg{\n        width: 20px;\n        height: 20px;\n        padding: 0!important;\n    }\n\n    .balanceTitle{\n        text-align: right;\n        font-size: 14px;\n        padding-right: 10px;\n    }\n\n    .balanceAmount .balanceContent{\n        padding: 0;\n    }\n\n    @media (max-width: 1000px){\n\n        .balanceText{\n            grid-template-columns: 1fr;\n        }\n\n    }\n\n    @media (max-width: 600px){\n\n        .balanceContent{\n            padding: 10px!important\n        }\n    }\n\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("2c59824d", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d4961080\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Modal.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d4961080\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n::-webkit-scrollbar{\n    width:7px;height:7px\n}\n::-webkit-scrollbar-track{\n    background:rgba(100,100,100,0.1)\n}\n::-webkit-scrollbar-thumb{\n    background: rgba(41, 41, 41, 0.5);\n    border: solid 1px rgba(31, 31, 31, 0.5);\n    border-radius: 4px;\n}\ninput[type=number]::-webkit-outer-spin-button,\ninput[type=number]::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n}\ninput[type=number] {\n    -moz-appearance:textfield;\n}\n.modal input:focus, .modal textarea:focus{\n    outline: none;\n}\n.modal .content{\n    padding: 20px;\n    padding-top: 30px;\n    margin: 0!important;\n}\n.modal{\n    width: 50%;\n    height: auto;\n    border-radius: 5px;\n    max-width: 550px;\n    min-width: 450px;\n    position: fixed;\n    margin: 0 auto;\n    border: solid 1px #313131;\n    left: 0;\n    right: 0;\n    text-align: center;\n    background-color: #1f1f1f;\n    z-index: 1600;\n    top: 50%;\n    -ms-transform: translateY(-50%);\n        transform: translateY(-50%);\n}\n.modal #walletID{\n    word-wrap: break-word;\n    display: block;\n    vertical-align: middle;\n    height:40px;\n    line-height: 12px;\n    -webkit-user-select: all!important;  /* Chrome all / Safari all */\n    -moz-user-select: all!important;     /* Firefox all */\n    -ms-user-select: all!important;      /* IE 10+ */\n    user-select: all!important;\n    margin: 10px 0;\n    top: 50%;\n    -ms-transform: translateY(10%);\n        transform: translateY(10%);\n    font-weight: 100;\n}\n.modalBackground{\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    display: block;\n    z-index: 1000;\n    top:0;\n    left: 0;\n    background-color: rgba(0, 0, 0, 0.83);\n}\n.modal .close{\n    position: fixed;\n    top: -10px;\n    right: 10px!important;\n    color: #ffc12c;\n    cursor: pointer;\n    width: 20px;\n    height: 20px;    font-size: 22px;\n    display: none!important;\n    margin-top: 7px;\n}\n.modal .title{\n    background-color: #262626;\n    padding: 10px 0;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    line-height: 22px;\n    color: #ffc12c;\n    display: none;\n}\n.modal .footer .button{\n    display: inline;\n    cursor: pointer;\n}\n.modal b{\n    margin-left: 0;\n}\n.modal .twoColumns{\n    border-bottom: solid 1px #313131;\n    background-color: #151515;\n}\n.modal .balance{\n    color: #ffc12c!important;\n    font-size: 20px;\n    line-height: 50px;\n    margin: 5px 0;\n}\n.modal .transfer{\n    padding: 0 10px;\n}\n.modal .transfer input{\n    border: none;\n    background-color: #333333;\n    padding: 7px 0 7px 10px;\n    color: #fff;\n    width: 100%;\n    border-radius: 5px;\n    box-sizing: border-box!important;\n}\n.modal .transfer .imageAndInput{\n    margin: 10px 0;\n}\n.modal .transfer .address{\n    width: 100%;\n    display: block;\n    box-sizing: border-box!important;\n}\n.transactionElement .amount {\n    width: auto!important;\n    box-sizing: border-box!important;\n    display: inline-block;\n    color: #ffc12c!important;\n}\n.transactionElement .currency {\n    width: auto!important;\n    box-sizing: border-box!important;\n    display: inline-block;\n    color: #ffc12c!important;\n}\n.modal .transfer .title{\n    background-color: #1f1f1f;\n    padding-top: 20px;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    padding-bottom: 20px;\n    color: #d4d4d4;\n}\n.modal .transfer .button{\n    margin-top: 10px;\n    background-color: #ffc12c;\n    color: #1f1f1f;\n    margin-bottom: 15px;\n    width: 100%;\n    font-weight: bolder;\n    font-size: 16px;\n    border: none;\n    padding: 10px 0 10px 0;\n    border-radius: 5px;\n    transition: all 0.5s ease;\n}\n.modal .transfer .button:hover{\n    background-color: #fbdb8d;\n    color: #000000;\n    transition: all 0.5s ease\n}\n.twoColumns{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr;\n        grid-template-columns: 1fr 1fr;\n}\n.addressActions{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr;\n        grid-template-columns: 1fr 1fr;\n    border-bottom: solid 1px #313131;\n}\n.addressActions .actionButton{\n    display: inline-block;\n    background-color: #333;\n    color: #ffc12c;\n    padding: 5px;\n    cursor: pointer;\n    padding-top: 8px;\n    border-left: solid 1px #424242;\n    border-collapse: collapse;\n    transition: all 0.5s ease\n}\n.addressActions .actionButton:hover{\n    background-color: #232222;\n    color: #ffdd8c;\n    transition: all 0.5s ease\n}\n.addressActions .actionButton:first-child{\n    border-left:none;\n}\n.activeActionButton{\n    background-color: #ffc12c!important;\n    color: #000!important;\n}\n.twoColumns .section{\n    overflow: hidden;\n    padding: 20px;\n    color: #D5D5D5;\n}\n.twoColumns .section:first-child{\n    border-right: solid 1px #313131;\n}\n.modalButton2{\n    background-color: #353535;\n    border-radius: 5px;\n    padding: 7px 0 5px 0;\n    border: solid 1px #777;\n    font-size: 12px;\n    cursor: pointer;\n    padding: 7px 0 5px 0;\n    width: 150px;\n    margin: 0 auto;\n    margin-top: 10px;\n    transition: all 0.5s ease\n}\n.modalButton2:hover{\n    background-color: #000;\n    transition: all 0.5s ease\n}\n.modalButton2Success{\n    color: #149008;\n    font-size: 12px;\n    margin-top: 16px;\n}\n.buttonSpace{\n    margin-top: 20px;\n}\n\n/*.balanceContent .miningAddress{*/\n    /*padding-top: 10px;*/\n/*}*/\n@media (max-width: 1000px){\n.balanceText{\n        -ms-grid-columns: 1fr;\n            grid-template-columns: 1fr;\n}\n.balanceTitle{\n        text-align: center;\n}\n.balanceAmount{\n        text-align: center;\n}\n.WEBD .balanceAmount{\n        text-align: left;\n}\n.balanceContent .miningAddress{\n        margin-top: 10px;\n}\n.balanceContent{\n        padding: 51px 10px 15px 10px;\n}\n}\n@media (max-width:831px){\n#walletID{\n        font-size: 12px!important;\n        line-height: 14px!important;\n}\n.close{\n        font-size: 22px;\n        margin-top: 7px;\n        right: 30px!important;\n        display: none!important;\n}\n}\n@media (max-width:600px)  {\n.modal .title{\n        display: block;\n}\n.modal .transfer .title{\n        padding: 10px;\n}\n.modal{\n        width: 100%;\n        max-width: none;\n        min-width: none;\n        max-height: 100%;\n        overflow-y: auto;\n}\n.twoColumns .section:first-child {\n        border-bottom: solid 1px #313131;\n        border-right: none;\n}\n.modal .balance{\n        margin-top: 0;\n}\n.addressActions .actionButton{\n        line-height: 50px;\n        font-size: 20px;\n        border-bottom: solid 1px #000;\n        padding: 0;\n}\n.modal .transfer input{\n        padding: 10px 0 10px 10px;\n        font-size: 16px;\n        margin: 5px 0;\n        box-sizing: border-box!important;\n}\n.modal .transfer .button{\n        line-height: 26px;\n        font-size: 20px;\n        margin-bottom: 20px;\n        margin-top: 30px;\n}\n.modal .title{\n        padding: 20px 0;\n}\n.modal .close{\n        top:0;\n        right: 30px!important;\n        display: block!important;\n}\n.modal .twoColumns{\n        width: 100%;\n        -ms-grid-columns: 1fr;\n            grid-template-columns: 1fr;\n}\n.modal{\n        min-width: auto;\n}\n.balanceText{\n        display: inline-block;\n        margin-top: 0px;\n        padding-bottom: 0;\n}\n.walletAddress b {\n        font-size: 20px!important;\n        line-height: 25px!important;\n        margin-left: 4px!important;\n}\n.walletAddress b {\n        font-size: 20px!important;\n        line-height: 25px!important;\n        margin-left: 4px!important;\n        vertical-align: top;\n        margin-top: 16px;\n}\n#walletID{\n        height: auto;\n        line-height: 32px!important;\n}\n#allWallets .walletAddress img{\n        margin-top: 0;\n}\n.modalButton2{\n        padding: 10px 0!important;\n}\n.modifyPadding .twoColumns .section{\n        padding: 10px 5px 20px 0;\n}\n.modal .transfer .button{\n        margin-top: 10px!important;\n}\n#allWallets .walletAddress .imageAndInput img {\n        height: 38px !important;\n}\n.modal .transfer .address {\n        padding: 10px 0 10px 20px;\n}\n.balanceContent .miningAddress{\n        padding: 0!important;\n}\n}\n@media (max-width: 400px){\n.modal .transfer input {\n        padding: 10px 0 10px 10px;\n}\n.addressActions .actionButton {\n        line-height: 40px;\n}\n.addressActions{\n        border: none;\n}\n.modal .title {\n        padding: 10px 0;\n}\n.modal .close {\n        top: -1px;\n        right: 10px!important;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/UI/modal/src/components/UI/modal/Modal.vue"],"names":[],"mappings":";AAyEA;IACA,UAAA,UAAA;CACA;AACA;IACA,gCAAA;CACA;AACA;IACA,kCAAA;IACA,wCAAA;IACA,mBAAA;CACA;AAEA;;IAEA,yBAAA;IACA,UAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,cAAA;IACA,kBAAA;IACA,oBAAA;CACA;AAEA;IACA,WAAA;IACA,aAAA;IACA,mBAAA;IACA,iBAAA;IACA,iBAAA;IACA,gBAAA;IACA,eAAA;IACA,0BAAA;IACA,QAAA;IACA,SAAA;IACA,mBAAA;IACA,0BAAA;IACA,cAAA;IACA,SAAA;IACA,gCAAA;QAAA,4BAAA;CACA;AAEA;IACA,sBAAA;IACA,eAAA;IACA,uBAAA;IACA,YAAA;IACA,kBAAA;IACA,mCAAA,EAAA,6BAAA;IACA,gCAAA,KAAA,iBAAA;IACA,+BAAA,MAAA,YAAA;IACA,2BAAA;IACA,eAAA;IACA,SAAA;IACA,+BAAA;QAAA,2BAAA;IACA,iBAAA;CACA;AAEA;IACA,gBAAA;IACA,aAAA;IACA,YAAA;IACA,eAAA;IACA,cAAA;IACA,MAAA;IACA,QAAA;IACA,sCAAA;CACA;AAEA;IACA,gBAAA;IACA,WAAA;IACA,sBAAA;IACA,eAAA;IACA,gBAAA;IACA,YAAA;IACA,aAAA,IAAA,gBAAA;IACA,wBAAA;IACA,gBAAA;CACA;AAEA;IACA,0BAAA;IACA,gBAAA;IACA,0BAAA;IACA,oBAAA;IACA,kBAAA;IACA,eAAA;IACA,cAAA;CACA;AAEA;IACA,gBAAA;IACA,gBAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,iCAAA;IACA,0BAAA;CACA;AAEA;IACA,yBAAA;IACA,gBAAA;IACA,kBAAA;IACA,cAAA;CACA;AAEA;IACA,gBAAA;CACA;AAGA;IACA,aAAA;IACA,0BAAA;IACA,wBAAA;IACA,YAAA;IACA,YAAA;IACA,mBAAA;IACA,iCAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,YAAA;IACA,eAAA;IACA,iCAAA;CACA;AAEA;IACA,sBAAA;IACA,iCAAA;IACA,sBAAA;IACA,yBAAA;CACA;AAEA;IACA,sBAAA;IACA,iCAAA;IACA,sBAAA;IACA,yBAAA;CACA;AAEA;IACA,0BAAA;IACA,kBAAA;IACA,0BAAA;IACA,oBAAA;IACA,qBAAA;IACA,eAAA;CACA;AAEA;IACA,iBAAA;IACA,0BAAA;IACA,eAAA;IACA,oBAAA;IACA,YAAA;IACA,oBAAA;IACA,gBAAA;IACA,aAAA;IACA,uBAAA;IACA,mBAAA;IACA,0BAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,yBAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,0BAAA;QAAA,+BAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,0BAAA;QAAA,+BAAA;IACA,iCAAA;CACA;AAEA;IACA,sBAAA;IACA,uBAAA;IACA,eAAA;IACA,aAAA;IACA,gBAAA;IACA,iBAAA;IACA,+BAAA;IACA,0BAAA;IACA,yBAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,yBAAA;CACA;AAEA;IACA,iBAAA;CACA;AAEA;IACA,oCAAA;IACA,sBAAA;CACA;AAEA;IACA,iBAAA;IACA,cAAA;IACA,eAAA;CACA;AAEA;IACA,gCAAA;CACA;AAEA;IACA,0BAAA;IACA,mBAAA;IACA,qBAAA;IACA,uBAAA;IACA,gBAAA;IACA,gBAAA;IACA,qBAAA;IACA,aAAA;IACA,eAAA;IACA,iBAAA;IACA,yBAAA;CACA;AAEA;IACA,uBAAA;IACA,yBAAA;CACA;AAEA;IACA,eAAA;IACA,gBAAA;IACA,iBAAA;CACA;AAEA;IACA,iBAAA;CACA;;AAEA,mCAAA;IACA,sBAAA;AACA,KAAA;AAEA;AAEA;QACA,sBAAA;YAAA,2BAAA;CACA;AAEA;QACA,mBAAA;CACA;AAEA;QACA,mBAAA;CACA;AAEA;QACA,iBAAA;CACA;AAEA;QACA,iBAAA;CACA;AAEA;QACA,6BAAA;CACA;CAEA;AAEA;AAEA;QACA,0BAAA;QACA,4BAAA;CACA;AAEA;QACA,gBAAA;QACA,gBAAA;QACA,sBAAA;QACA,wBAAA;CACA;CAEA;AAEA;AAEA;QACA,eAAA;CACA;AAEA;QACA,cAAA;CACA;AAEA;QACA,YAAA;QACA,gBAAA;QACA,gBAAA;QACA,iBAAA;QACA,iBAAA;CACA;AAEA;QACA,iCAAA;QACA,mBAAA;CACA;AACA;QACA,cAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;QACA,8BAAA;QACA,WAAA;CACA;AACA;QACA,0BAAA;QACA,gBAAA;QACA,cAAA;QACA,iCAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;QACA,oBAAA;QACA,iBAAA;CACA;AACA;QACA,gBAAA;CACA;AACA;QACA,MAAA;QACA,sBAAA;QACA,yBAAA;CACA;AACA;QACA,YAAA;QACA,sBAAA;YAAA,2BAAA;CACA;AACA;QACA,gBAAA;CACA;AAEA;QACA,sBAAA;QACA,gBAAA;QACA,kBAAA;CACA;AAEA;QACA,0BAAA;QACA,4BAAA;QACA,2BAAA;CACA;AAEA;QACA,0BAAA;QACA,4BAAA;QACA,2BAAA;QACA,oBAAA;QACA,iBAAA;CACA;AAEA;QACA,aAAA;QACA,4BAAA;CACA;AAEA;QACA,cAAA;CACA;AAEA;QACA,0BAAA;CACA;AAEA;QACA,yBAAA;CACA;AAEA;QACA,2BAAA;CACA;AAEA;QACA,wBAAA;CACA;AAEA;QACA,0BAAA;CACA;AAEA;QACA,qBAAA;CACA;CAEA;AAEA;AAEA;QACA,0BAAA;CACA;AAEA;QACA,kBAAA;CACA;AAEA;QACA,aAAA;CACA;AAEA;QACA,gBAAA;CACA;AAEA;QACA,UAAA;QACA,sBAAA;CACA;CAEA","file":"Modal.vue","sourcesContent":["<template>\n\n    <div v-if=\"this.modalOpened\">\n        <div class=\"modalBackground\" @click=\"this.closeModal\"> </div>\n        <div class=\"modal\" ref=\"refModal\">\n\n            <div class=\"close\" @click=\"this.closeModal\">\n                x\n            </div>\n\n            <div class=\"headerModal\">\n                <div class=\"title\">\n                    {{this.title}}\n                </div>\n            </div>\n\n            <div class=\"content modifyPadding\">\n                <slot name=\"content\"></slot>\n            </div>\n\n        </div>\n    </div>\n\n</template>\n\n\n<script>\n\n    import icon from \"components/UI/icons/icon.vue\"\n\n    export default{\n\n        name: \"Modal\",\n\n        data: () => {\n            return {\n                modalOpened: false,\n            }\n        },\n\n        props:{\n\n            title: {default: 'Modal Title'},\n            buttons: {default: ()=>{return [{text:\"cancel\"}]}}\n\n        },\n\n        methods:{\n\n            closeModal(e){\n\n                if( e !== undefined) e.stopPropagation();\n\n                this.modalOpened = false;\n\n            },\n\n            showModal(e){\n\n                if (e !== undefined) e.stopPropagation();\n\n                this.modalOpened = true;\n            },\n\n        }\n\n    }\n\n</script>\n\n\n\n<style>\n\n    ::-webkit-scrollbar{\n        width:7px;height:7px\n    }\n    ::-webkit-scrollbar-track{\n        background:rgba(100,100,100,0.1)\n    }\n    ::-webkit-scrollbar-thumb{\n        background: rgba(41, 41, 41, 0.5);\n        border: solid 1px rgba(31, 31, 31, 0.5);\n        border-radius: 4px;\n    }\n\n    input[type=number]::-webkit-outer-spin-button,\n    input[type=number]::-webkit-inner-spin-button {\n        -webkit-appearance: none;\n        margin: 0;\n    }\n\n    input[type=number] {\n        -moz-appearance:textfield;\n    }\n\n    .modal input:focus, .modal textarea:focus{\n        outline: none;\n    }\n\n    .modal .content{\n        padding: 20px;\n        padding-top: 30px;\n        margin: 0!important;\n    }\n\n    .modal{\n        width: 50%;\n        height: auto;\n        border-radius: 5px;\n        max-width: 550px;\n        min-width: 450px;\n        position: fixed;\n        margin: 0 auto;\n        border: solid 1px #313131;\n        left: 0;\n        right: 0;\n        text-align: center;\n        background-color: #1f1f1f;\n        z-index: 1600;\n        top: 50%;\n        transform: translateY(-50%);\n    }\n\n    .modal #walletID{\n        word-wrap: break-word;\n        display: block;\n        vertical-align: middle;\n        height:40px;\n        line-height: 12px;\n        -webkit-user-select: all!important;  /* Chrome all / Safari all */\n        -moz-user-select: all!important;     /* Firefox all */\n        -ms-user-select: all!important;      /* IE 10+ */\n        user-select: all!important;\n        margin: 10px 0;\n        top: 50%;\n        transform: translateY(10%);\n        font-weight: 100;\n    }\n\n    .modalBackground{\n        position: fixed;\n        height: 100%;\n        width: 100%;\n        display: block;\n        z-index: 1000;\n        top:0;\n        left: 0;\n        background-color: rgba(0, 0, 0, 0.83);\n    }\n\n    .modal .close{\n        position: fixed;\n        top: -10px;\n        right: 10px!important;\n        color: #ffc12c;\n        cursor: pointer;\n        width: 20px;\n        height: 20px;    font-size: 22px;\n        display: none!important;\n        margin-top: 7px;\n    }\n\n    .modal .title{\n        background-color: #262626;\n        padding: 10px 0;\n        text-transform: uppercase;\n        letter-spacing: 4px;\n        line-height: 22px;\n        color: #ffc12c;\n        display: none;\n    }\n\n    .modal .footer .button{\n        display: inline;\n        cursor: pointer;\n    }\n\n    .modal b{\n        margin-left: 0;\n    }\n\n    .modal .twoColumns{\n        border-bottom: solid 1px #313131;\n        background-color: #151515;\n    }\n\n    .modal .balance{\n        color: #ffc12c!important;\n        font-size: 20px;\n        line-height: 50px;\n        margin: 5px 0;\n    }\n\n    .modal .transfer{\n        padding: 0 10px;\n    }\n\n\n    .modal .transfer input{\n        border: none;\n        background-color: #333333;\n        padding: 7px 0 7px 10px;\n        color: #fff;\n        width: 100%;\n        border-radius: 5px;\n        box-sizing: border-box!important;\n    }\n\n    .modal .transfer .imageAndInput{\n        margin: 10px 0;\n    }\n\n    .modal .transfer .address{\n        width: 100%;\n        display: block;\n        box-sizing: border-box!important;\n    }\n\n    .transactionElement .amount {\n        width: auto!important;\n        box-sizing: border-box!important;\n        display: inline-block;\n        color: #ffc12c!important;\n    }\n\n    .transactionElement .currency {\n        width: auto!important;\n        box-sizing: border-box!important;\n        display: inline-block;\n        color: #ffc12c!important;\n    }\n\n    .modal .transfer .title{\n        background-color: #1f1f1f;\n        padding-top: 20px;\n        text-transform: uppercase;\n        letter-spacing: 4px;\n        padding-bottom: 20px;\n        color: #d4d4d4;\n    }\n\n    .modal .transfer .button{\n        margin-top: 10px;\n        background-color: #ffc12c;\n        color: #1f1f1f;\n        margin-bottom: 15px;\n        width: 100%;\n        font-weight: bolder;\n        font-size: 16px;\n        border: none;\n        padding: 10px 0 10px 0;\n        border-radius: 5px;\n        transition: all 0.5s ease;\n    }\n\n    .modal .transfer .button:hover{\n        background-color: #fbdb8d;\n        color: #000000;\n        transition: all 0.5s ease\n    }\n\n    .twoColumns{\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n    }\n\n    .addressActions{\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        border-bottom: solid 1px #313131;\n    }\n\n    .addressActions .actionButton{\n        display: inline-block;\n        background-color: #333;\n        color: #ffc12c;\n        padding: 5px;\n        cursor: pointer;\n        padding-top: 8px;\n        border-left: solid 1px #424242;\n        border-collapse: collapse;\n        transition: all 0.5s ease\n    }\n\n    .addressActions .actionButton:hover{\n        background-color: #232222;\n        color: #ffdd8c;\n        transition: all 0.5s ease\n    }\n\n    .addressActions .actionButton:first-child{\n        border-left:none;\n    }\n\n    .activeActionButton{\n        background-color: #ffc12c!important;\n        color: #000!important;\n    }\n\n    .twoColumns .section{\n        overflow: hidden;\n        padding: 20px;\n        color: #D5D5D5;\n    }\n\n    .twoColumns .section:first-child{\n        border-right: solid 1px #313131;\n    }\n\n    .modalButton2{\n        background-color: #353535;\n        border-radius: 5px;\n        padding: 7px 0 5px 0;\n        border: solid 1px #777;\n        font-size: 12px;\n        cursor: pointer;\n        padding: 7px 0 5px 0;\n        width: 150px;\n        margin: 0 auto;\n        margin-top: 10px;\n        transition: all 0.5s ease\n    }\n\n    .modalButton2:hover{\n        background-color: #000;\n        transition: all 0.5s ease\n    }\n\n    .modalButton2Success{\n        color: #149008;\n        font-size: 12px;\n        margin-top: 16px;\n    }\n\n    .buttonSpace{\n        margin-top: 20px;\n    }\n\n    /*.balanceContent .miningAddress{*/\n        /*padding-top: 10px;*/\n    /*}*/\n\n    @media (max-width: 1000px){\n\n        .balanceText{\n            grid-template-columns: 1fr;\n        }\n\n        .balanceTitle{\n            text-align: center;\n        }\n\n        .balanceAmount{\n            text-align: center;\n        }\n\n        .WEBD .balanceAmount{\n            text-align: left;\n        }\n\n        .balanceContent .miningAddress{\n            margin-top: 10px;\n        }\n\n        .balanceContent{\n            padding: 51px 10px 15px 10px;\n        }\n\n    }\n\n    @media (max-width:831px){\n\n        #walletID{\n            font-size: 12px!important;\n            line-height: 14px!important;\n        }\n\n        .close{\n            font-size: 22px;\n            margin-top: 7px;\n            right: 30px!important;\n            display: none!important;\n        }\n\n    }\n\n    @media (max-width:600px)  {\n\n        .modal .title{\n            display: block;\n        }\n\n        .modal .transfer .title{\n            padding: 10px;\n        }\n\n        .modal{\n            width: 100%;\n            max-width: none;\n            min-width: none;\n            max-height: 100%;\n            overflow-y: auto;\n        }\n\n        .twoColumns .section:first-child {\n            border-bottom: solid 1px #313131;\n            border-right: none;\n        }\n        .modal .balance{\n            margin-top: 0;\n        }\n        .addressActions .actionButton{\n            line-height: 50px;\n            font-size: 20px;\n            border-bottom: solid 1px #000;\n            padding: 0;\n        }\n        .modal .transfer input{\n            padding: 10px 0 10px 10px;\n            font-size: 16px;\n            margin: 5px 0;\n            box-sizing: border-box!important;\n        }\n        .modal .transfer .button{\n            line-height: 26px;\n            font-size: 20px;\n            margin-bottom: 20px;\n            margin-top: 30px;\n        }\n        .modal .title{\n            padding: 20px 0;\n        }\n        .modal .close{\n            top:0;\n            right: 30px!important;\n            display: block!important;\n        }\n        .modal .twoColumns{\n            width: 100%;\n            grid-template-columns: 1fr;\n        }\n        .modal{\n            min-width: auto;\n        }\n\n        .balanceText{\n            display: inline-block;\n            margin-top: 0px;\n            padding-bottom: 0;\n        }\n\n        .walletAddress b {\n            font-size: 20px!important;\n            line-height: 25px!important;\n            margin-left: 4px!important;\n        }\n\n        .walletAddress b {\n            font-size: 20px!important;\n            line-height: 25px!important;\n            margin-left: 4px!important;\n            vertical-align: top;\n            margin-top: 16px;\n        }\n\n        #walletID{\n            height: auto;\n            line-height: 32px!important;\n        }\n\n        #allWallets .walletAddress img{\n            margin-top: 0;\n        }\n\n        .modalButton2{\n            padding: 10px 0!important;\n        }\n\n        .modifyPadding .twoColumns .section{\n            padding: 10px 5px 20px 0;\n        }\n\n        .modal .transfer .button{\n            margin-top: 10px!important;\n        }\n\n        #allWallets .walletAddress .imageAndInput img {\n            height: 38px !important;\n        }\n\n        .modal .transfer .address {\n            padding: 10px 0 10px 20px;\n        }\n\n        .balanceContent .miningAddress{\n            padding: 0!important;\n        }\n\n    }\n\n    @media (max-width: 400px){\n\n        .modal .transfer input {\n            padding: 10px 0 10px 10px;\n        }\n\n        .addressActions .actionButton {\n            line-height: 40px;\n        }\n\n        .addressActions{\n            border: none;\n        }\n\n        .modal .title {\n            padding: 10px 0;\n        }\n\n        .modal .close {\n            top: -1px;\n            right: 10px!important;\n        }\n\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return this.modalOpened
    ? _c("div", [
        _c("div", {
          staticClass: "modalBackground",
          on: { click: this.closeModal }
        }),
        _c("div", { ref: "refModal", staticClass: "modal" }, [
          _c("div", { staticClass: "close", on: { click: this.closeModal } }, [
            _vm._v("\n            x\n        ")
          ]),
          _c("div", { staticClass: "headerModal" }, [
            _c("div", { staticClass: "title" }, [
              _vm._v(
                "\n                " + _vm._s(this.title) + "\n            "
              )
            ])
          ]),
          _c(
            "div",
            { staticClass: "content modifyPadding" },
            [_vm._t("content")],
            2
          )
        ])
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d4961080", esExports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("45eedbb3", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53087030\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Show-Balance.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53087030\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Show-Balance.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.balanceContent .fontColor{\n    display: block;\n}\n.balanceContent  .show-balance-span{\n    font-size:20px;\n}\n.show-balance-span{\n    display: inline-block;\n    margin-right: 4px;\n    color: #fec02c;\n    vertical-align: top;\n    margin-top: 0;\n    text-align: center;\n}\n.balanceContent .show-balance-span{\n    margin-top: 0;\n    font-size: 14px;\n}\n.balanceShowContent{\n    box-sizing: border-box;\n}\n@media only screen and (max-width : 831px) {\n.show-balance-span{\n        margin-left: 5px;\n        line-height: 48px;\n}\n}\n@media only screen and (max-width : 600px) {\n.walletAddress b{\n        margin-top: 0!important;\n}\n.addressIdentityBox .show-balance-span{\n        line-height: 40px;\n        font-size: 14px;\n}\n.addressIdentityBox .show-balance-span svg{\n\n        margin-top: 15px;\n        display: block;\n}\n}\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Balance/src/components/Wallet/Address/Balance/Show-Balance.vue"],"names":[],"mappings":";AAsJA;IACA,eAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,sBAAA;IACA,kBAAA;IACA,eAAA;IACA,oBAAA;IACA,cAAA;IACA,mBAAA;CACA;AAEA;IACA,cAAA;IACA,gBAAA;CACA;AAEA;IACA,uBAAA;CACA;AAEA;AAEA;QACA,iBAAA;QACA,kBAAA;CACA;CAEA;AAEA;AAEA;QACA,wBAAA;CACA;AAEA;QACA,kBAAA;QACA,gBAAA;CACA;AAEA;;QAEA,iBAAA;QACA,eAAA;CAEA;CAEA","file":"Show-Balance.vue","sourcesContent":["<template>\n\n    <div style=\"display: inline-block\" class=\"balanceShowContent\">\n\n        <loading-spinner class=\"fontColor spinnerBalance\" v-if=\"!this.loaded\" />\n        <div class=\"show-balance-span\" v-if=\"this.loaded\" >\n            {{ this.formatMoneyNumber( (this.computePrice +  (this.showPoolReward === true ? this.computePoolReward : 0 )) ,2)}}\n        </div>\n\n    </div>\n\n</template>\n\n<script>\n\n    import LoadingSpinner from \"components/UI/elements/Loading-Spinner.vue\"\n    import BrowserHelpers from \"helpers/Browser.helpers\"\n\n    export default{\n\n        components:{\n            LoadingSpinner,\n        },\n\n        props: ['address', 'currency', 'showPoolReward'],\n\n        data(){\n          return {\n\n              balances: {},\n              subscription: null,\n              loaded: WebDollar.Blockchain.loaded||false,\n\n              minerPoolTotalReward: 0,\n              minerPoolConfirmedReward: 0,\n\n              minerPoolReferralTotalReward: 0,\n              minerPoolReferralConfirmedReward: 0,\n\n            }\n        },\n\n        computed:{\n\n            computePrice(){\n\n                if (this.balances === null || this.balances === undefined || !this.balances.hasOwnProperty(this.currency)) return 0;\n\n                return (this.balances[this.currency]);\n            },\n\n            computePoolReward(){\n\n                return this.minerPoolTotalReward + this.minerPoolConfirmedReward + this.minerPoolReferralTotalReward + this.minerPoolReferralConfirmedReward;\n\n            }\n\n        },\n\n        mounted(){\n\n            if (typeof window === \"undefined\") return;\n\n            this.currency = this.currency || '0x01';\n\n            let address = this.address;\n            if (typeof this.address === \"object\" && typeof this.address.hasOwnProperty(\"address\") ) { //it is an address object\n                address = this.address.address;\n            }\n\n            WebDollar.StatusEvents.emitter.on(\"blockchain/status\", (data)=>{\n\n                if (data.message === \"Blockchain Ready to Mine\")\n                    this.loaded = true;\n\n            });\n\n            let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{\n                this.balances = data.balances;\n            });\n\n            if (data !== null && data.result) {\n                this.subscription = data.subscription;\n                this.balances = data.balances;\n            }\n\n\n\n            //pool reward\n\n            if (WebDollar.Blockchain.MinerPoolManagement !== undefined) {\n                this.minerPoolTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReward;\n                this.minerPoolConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReward;\n                this.minerPoolReferralTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReferralReward;\n                this.minerPoolReferralConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReferralReward;\n            }\n\n            WebDollar.StatusEvents.on(\"miner-pool/total-reward\", data=>  this.minerPoolTotalReward = data.totalReward );\n            WebDollar.StatusEvents.on(\"miner-pool/confirmed-reward\", data=>  this.minerPoolConfirmedReward = data.confirmedReward );\n\n            WebDollar.StatusEvents.on(\"miner-pool/referral-total-reward\", data=>  this.minerPoolReferralTotalReward = data.referralTotalReward );\n            WebDollar.StatusEvents.on(\"miner-pool/referral-confirmed-reward\", data=>  this.minerPoolReferralConfirmedReward = data.referralConfirmedReward );\n\n        },\n\n        watch: {\n\n            address: function (newVal, oldVal) { // watch it\n\n                WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.subscription);\n\n                let address = newVal;\n                if (typeof newVal === \"object\" && typeof newVal.hasOwnProperty(\"address\") ) { //it is an address object\n                    address = newVal.address;\n                }\n\n                let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{\n                    console.log(\"balance changed\");\n                    this.balances = data.balances;\n                });\n\n                if (data !== null && data.result) {\n                    this.subscription = data.subscription;\n                    this.balances = data.balances;\n                }\n\n            },\n\n            currency: function (newVal, oldVal) { // watch it\n\n            },\n\n            showPoolReward: function (newVal, oldVal) { // watch it\n\n            }\n\n\n        },\n\n        methods:{\n\n            formatMoneyNumber: BrowserHelpers.formatMoneyNumber,\n\n        }\n\n    }\n\n</script>\n\n<style>\n\n    .balanceContent .fontColor{\n        display: block;\n    }\n\n    .balanceContent  .show-balance-span{\n        font-size:20px;\n    }\n\n    .show-balance-span{\n        display: inline-block;\n        margin-right: 4px;\n        color: #fec02c;\n        vertical-align: top;\n        margin-top: 0;\n        text-align: center;\n    }\n\n    .balanceContent .show-balance-span{\n        margin-top: 0;\n        font-size: 14px;\n    }\n\n    .balanceShowContent{\n        box-sizing: border-box;\n    }\n\n    @media only screen and (max-width : 831px) {\n\n        .show-balance-span{\n            margin-left: 5px;\n            line-height: 48px;\n        }\n\n    }\n\n    @media only screen and (max-width : 600px) {\n\n        .walletAddress b{\n            margin-top: 0!important;\n        }\n\n        .addressIdentityBox .show-balance-span{\n            line-height: 40px;\n            font-size: 14px;\n        }\n\n        .addressIdentityBox .show-balance-span svg{\n\n            margin-top: 15px;\n            display: block;\n\n        }\n\n    }\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticStyle: { "enable-background": "new 0 0 50 50" },
      attrs: {
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        x: "0px",
        y: "0px",
        width: this.width,
        height: this.height,
        viewBox: "0 0 50 50",
        "xml:space": "preserve"
      }
    },
    [
      _c(
        "path",
        {
          attrs: {
            d:
              "M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
          }
        },
        [
          _c("animateTransform", {
            attrs: {
              attributeType: "xml",
              attributeName: "transform",
              type: "rotate",
              from: "0 25 25",
              to: "360 25 25",
              dur: "0.6s",
              repeatCount: "indefinite"
            }
          })
        ],
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-f5858e2a", esExports)
  }
}

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "balanceShowContent",
      staticStyle: { display: "inline-block" }
    },
    [
      !this.loaded
        ? _c("loading-spinner", { staticClass: "fontColor spinnerBalance" })
        : _vm._e(),
      this.loaded
        ? _c("div", { staticClass: "show-balance-span" }, [
            _vm._v(
              "\n        " +
                _vm._s(
                  this.formatMoneyNumber(
                    this.computePrice +
                      (this.showPoolReward === true
                        ? this.computePoolReward
                        : 0),
                    2
                  )
                ) +
                "\n    "
            )
          ])
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-53087030", esExports)
  }
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("2a67aaf4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0a5495d6\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Show-Sum-Balances.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0a5495d6\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Show-Sum-Balances.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.balanceContent .fontColor{\n    display: block;\n}\n.balanceContent  .show-balance-span{\n    font-size:20px;\n}\n.show-balance-span{\n    display: inline-block;\n    margin-right: 4px;\n    color: #fec02c;\n    vertical-align: top;\n    margin-top: 0;\n    text-align: center;\n}\n.balanceContent .show-balance-span{\n    margin-top: 0;\n    font-size: 14px;\n}\n@media only screen and (max-width : 831px) {\n.show-balance-span{\n        margin-left: 5px;\n        line-height: 48px;\n}\n}\n@media only screen and (max-width : 600px) {\n.walletAddress b{\n        margin-top: 0!important;\n}\n.addressIdentityBox .show-balance-span{\n        line-height: 40px;\n        font-size: 14px;\n}\n.addressIdentityBox .show-balance-span svg{\n\n        margin-top: 15px;\n        display: block;\n}\n}\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Balance/Balances/src/components/Wallet/Address/Balance/Balances/Show-Sum-Balances.vue"],"names":[],"mappings":";AA0IA;IACA,eAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,sBAAA;IACA,kBAAA;IACA,eAAA;IACA,oBAAA;IACA,cAAA;IACA,mBAAA;CACA;AAEA;IACA,cAAA;IACA,gBAAA;CACA;AAEA;AAEA;QACA,iBAAA;QACA,kBAAA;CACA;CAEA;AAEA;AAEA;QACA,wBAAA;CACA;AAEA;QACA,kBAAA;QACA,gBAAA;CACA;AAEA;;QAEA,iBAAA;QACA,eAAA;CAEA;CAEA","file":"Show-Sum-Balances.vue","sourcesContent":["<template>\n\n    <div style=\"display: inline-block\">\n\n        <loading-spinner class=\"fontColor\" v-if=\"!this.loaded\" />\n\n        <div class=\"show-balance-span\" v-if=\"this.loaded\" >\n            {{ this.formatMoneyNumber( (this.sum + (this.showPoolReward === true ? this.computePoolReward : 0 )) ,2)}}\n        </div>\n\n    </div>\n\n</template>\n\n<script>\n\n    import LoadingSpinner from \"components/UI/elements/Loading-Spinner.vue\"\n    import BrowserHelpers from \"helpers/Browser.helpers\"\n\n    export default{\n\n        components:{\n            LoadingSpinner,\n        },\n\n        props: ['addresses', 'currency', 'showPoolReward'],\n\n        data(){\n          return {\n              sum: 0,\n\n              subscription: null,\n              loaded: WebDollar.Blockchain.loaded||false,\n\n              minerPoolTotalReward: 0,\n              minerPoolConfirmedReward: 0,\n\n              minerPoolReferralTotalReward: 0,\n              minerPoolReferralConfirmedReward: 0,\n            }\n        },\n\n        mounted(){\n\n            if (typeof window === \"undefined\") return;\n\n            WebDollar.StatusEvents.emitter.on(\"blockchain/status\", (data)=>{\n\n                if (data.message === \"Blockchain Ready to Mine\")\n                    this.loaded = true;\n\n            });\n\n            //pool reward\n\n            if (WebDollar.Blockchain.MinerPoolManagement !== undefined) {\n                this.minerPoolTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReward;\n                this.minerPoolConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReward;\n\n                this.minerPoolReferralTotalReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.totalReferralReward;\n                this.minerPoolReferralConfirmedReward = WebDollar.Blockchain.MinerPoolManagement.minerPoolReward.confirmedReferralReward;\n            }\n\n            WebDollar.StatusEvents.on(\"miner-pool/total-reward\", data => this.minerPoolTotalReward = data.totalReward );\n            WebDollar.StatusEvents.on(\"miner-pool/confirmed-reward\", data =>  this.minerPoolConfirmedReward = data.confirmedReward );\n\n            WebDollar.StatusEvents.on(\"miner-pool/referral-total-reward\", data=>  this.minerPoolReferralTotalReward = data.referralTotalReward );\n            WebDollar.StatusEvents.on(\"miner-pool/referral-confirmed-reward\", data=>  this.minerPoolReferralConfirmedReward = data.referralConfirmedReward );\n\n        },\n\n        methods:{\n\n            refreshSum(addresses, currency){\n\n                let newSum = 0;\n\n                //it should use BigNumber as math...\n\n                if (addresses === undefined || addresses === null) return ;\n\n                for (let index in addresses){\n\n                    if (addresses[index].balances !== undefined && addresses[index].balances !== null && addresses[index].balances[currency] !== undefined)\n                        newSum += parseFloat( addresses[index].balances[currency]);\n                }\n\n                this.sum = newSum;\n\n                if (this.sum!==0){\n\n                    this.sum = this.sum;\n\n                }\n\n            },\n\n            formatMoneyNumber: BrowserHelpers.formatMoneyNumber,\n\n        },\n\n        watch: {\n            addresses: function (newVal, oldVal) { // watch it\n\n                this.refreshSum(newVal, this.currency);\n\n            },\n\n            currency: function (newVal, oldVal) { // watch it\n\n                this.refreshSum(this.addresses, newVal);\n\n            },\n\n            showPoolReward: function (newVal, oldVal) { // watch it\n\n                this.refreshSum(this.addresses, this.currency);\n\n            }\n\n        },\n\n        computed:{\n\n            computePoolReward(){\n\n                return this.minerPoolTotalReward + this.minerPoolConfirmedReward + this.minerPoolReferralTotalReward + this.minerPoolReferralConfirmedReward;\n\n            }\n\n        },\n\n\n    }\n\n</script>\n\n<style>\n\n    .balanceContent .fontColor{\n        display: block;\n    }\n\n    .balanceContent  .show-balance-span{\n        font-size:20px;\n    }\n\n    .show-balance-span{\n        display: inline-block;\n        margin-right: 4px;\n        color: #fec02c;\n        vertical-align: top;\n        margin-top: 0;\n        text-align: center;\n    }\n\n    .balanceContent .show-balance-span{\n        margin-top: 0;\n        font-size: 14px;\n    }\n\n    @media only screen and (max-width : 831px) {\n\n        .show-balance-span{\n            margin-left: 5px;\n            line-height: 48px;\n        }\n\n    }\n\n    @media only screen and (max-width : 600px) {\n\n        .walletAddress b{\n            margin-top: 0!important;\n        }\n\n        .addressIdentityBox .show-balance-span{\n            line-height: 40px;\n            font-size: 14px;\n        }\n\n        .addressIdentityBox .show-balance-span svg{\n\n            margin-top: 15px;\n            display: block;\n\n        }\n\n    }\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticStyle: { display: "inline-block" } },
    [
      !this.loaded
        ? _c("loading-spinner", { staticClass: "fontColor" })
        : _vm._e(),
      this.loaded
        ? _c("div", { staticClass: "show-balance-span" }, [
            _vm._v(
              "\n        " +
                _vm._s(
                  this.formatMoneyNumber(
                    this.sum +
                      (this.showPoolReward === true
                        ? this.computePoolReward
                        : 0),
                    2
                  )
                ) +
                "\n    "
            )
          ])
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0a5495d6", esExports)
  }
}

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transactions_part_vue__ = __webpack_require__(26);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2382f042_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transactions_part_vue__ = __webpack_require__(83);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(69)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transactions_part_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2382f042_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transactions_part_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transactions.part.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2382f042", Component.options)
  } else {
    hotAPI.reload("data-v-2382f042", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("296e5b12", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2382f042\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transactions.part.vue", function() {
     var newContent = require("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2382f042\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transactions.part.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.transferListContainer{\n    list-style: none;\n    padding: 0;\n    max-height: 200px;\n    overflow: scroll;\n    overflow-x:hidden;\n}\n.transferListContainer::-webkit-scrollbar{\n    width:7px;height:7px\n}\n.transferListContainer::-webkit-scrollbar-track{\n    background:rgba(100,100,100,0.1)!important;\n}\n.transferListContainer::-webkit-scrollbar-thumb{\n    background: rgba(41, 41, 41, 0.5)!important;\n    border: solid 1px rgba(31, 31, 31, 0.5)!important;\n    border-radius: 4px;\n}\n.transferList::-webkit-scrollbar{\n    width:7px;height:7px\n}\n.transferList::-webkit-scrollbar-track{\n    background:rgba(100,100,100,0.1)!important;\n}\n.transferList::-webkit-scrollbar-thumb{\n    background: rgba(41, 41, 41, 0.5)!important;\n    border: solid 1px rgba(31, 31, 31, 0.5)!important;\n    border-radius: 4px;\n}\n.transferListElement{\n    font-size: 12px;\n    color: #fff;\n    list-style: none;\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr 60px;\n        grid-template-columns: 1fr 1fr 60px;\n    white-space: nowrap ;\n    text-align: left;\n    background-color: #151515;\n    padding: 5px 10px;\n    border-bottom: solid 1px#262626;\n    border-top: solid 1px#262626;\n}\n.transferListElement:hover{\n    background-color: #1f1f1f!important;\n    transition: all 0.5s ease;\n}\n.destinations{\n    list-style: none;\n    padding: 0;\n}\n.money, .destinationAddress{\n    display: inline-block;\n}\n.destinationAddress{\n    width: 70%;\n    overflow: hidden;\n}\n.money{\n    width: 20%;\n    padding-left: 10px;\n    display: inline-block;\n    float: right;\n    text-align: right;\n}\n.currency{\n    margin-left: 5px;\n}\n.pairListElement{\n    background-color: #333333;\n}\n.transferListContainer .money{\n    color:#ffc12c;\n    line-height: 26px;\n}\n.transferListContainer .source{\n    color: #c5c5c5;\n}\n.transferList .title{\n    margin: 10px 0;\n}\n.transferList .headerTable{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr 60px;\n        grid-template-columns: 1fr 1fr 60px;\n    background-color: #262626;\n    color: #fff!important;\n    padding: 5px 0 5px 10px;\n}\n.headerTable span{\n    width: 100%!important;\n}\n.headerElement{\n    display: inline-block;\n    color: #d4d4d4!important;\n    font-size: 14px;\n    text-align: left;\n}\n.transactionElement{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 30px 1fr;\n        grid-template-columns: 30px 1fr;\n}\n.transactionElement img{\n    height: 26px!important;\n}\n.transferList .miningAddress{\n    color: #737373 !important;\n    padding: 7px 0;\n    text-transform: uppercase;\n    letter-spacing: 2px;\n    font-size: 10px;\n    width: 90%;\n    margin: 0 auto;\n}\n.noTransactions .transferList .miningAddress{\n    letter-spacing: 1px!important;\n    width: 90%!important;\n}\n.noTransactions .miningAddress{\n    line-height: 18px;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transactions.part.vue"],"names":[],"mappings":";AA8JA;IACA,iBAAA;IACA,WAAA;IACA,kBAAA;IACA,iBAAA;IACA,kBAAA;CACA;AAEA;IACA,UAAA,UAAA;CACA;AACA;IACA,2CAAA;CACA;AACA;IACA,4CAAA;IACA,kDAAA;IACA,mBAAA;CACA;AAEA;IACA,UAAA,UAAA;CACA;AACA;IACA,2CAAA;CACA;AACA;IACA,4CAAA;IACA,kDAAA;IACA,mBAAA;CACA;AAEA;IACA,gBAAA;IACA,YAAA;IACA,iBAAA;IACA,kBAAA;IAAA,cAAA;IACA,+BAAA;QAAA,oCAAA;IACA,qBAAA;IACA,iBAAA;IACA,0BAAA;IACA,kBAAA;IACA,gCAAA;IACA,6BAAA;CACA;AAEA;IACA,oCAAA;IACA,0BAAA;CACA;AAEA;IACA,iBAAA;IACA,WAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,WAAA;IACA,iBAAA;CACA;AAGA;IACA,WAAA;IACA,mBAAA;IACA,sBAAA;IACA,aAAA;IACA,kBAAA;CACA;AAEA;IACA,iBAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,cAAA;IACA,kBAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,+BAAA;QAAA,oCAAA;IACA,0BAAA;IACA,sBAAA;IACA,wBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,sBAAA;IACA,yBAAA;IACA,gBAAA;IACA,iBAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,2BAAA;QAAA,gCAAA;CACA;AAEA;IACA,uBAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,0BAAA;IACA,oBAAA;IACA,gBAAA;IACA,WAAA;IACA,eAAA;CACA;AAEA;IACA,8BAAA;IACA,qBAAA;CACA;AAEA;IACA,kBAAA;CACA","file":"Transactions.part.vue","sourcesContent":["<template>\n\n    <div class=\"transferList\" ref=\"refTransferList\">\n\n        <div v-show=\"objectIsEmpty(transactions)\" class=\"noTransactions\">\n\n            <span class=\"miningAddress\" style=\"color: white!important\">You don't have any transaction in last 20 blocks</span>\n\n        </div>\n\n        <div v-show=\"!objectIsEmpty(transactions)\">\n\n            <span class=\"miningAddress\" style=\"color: white!important\">Transactions from last 20 blocks</span>\n\n            <div class=\"headerTable\">\n\n                <span class=\"headerElement fromItem\">From</span>\n                <span class=\"headerElement\">To</span>\n                <span class=\"headerElement\">Status</span>\n\n            </div>\n\n\n            <ul class=\"transferListContainer\">\n\n                <transaction v-for=\"(tx, index) in orderedTransactions\"\n                             :transaction = \"tx\"\n                             :key=\"'transaction'+index\"\n                >\n\n                </transaction>\n\n            </ul>\n\n        </div>\n\n    </div>\n\n</template>\n\n<script>\n\n    import Vue from \"vue\";\n    import Transaction from \"./Transaction.element.vue\"\n\n    export default {\n\n        components:{ Transaction },\n\n        props:{\n            address: {default: null},\n        },\n\n        data: ()=>{\n            return {\n                transactions : {},\n                subscription: null,\n                transactionsLength: 0,\n            }\n        },\n\n        mounted(){\n\n            if (typeof window === \"undefined\") return false;\n\n            //subscribe to transactions changes\n            let data = WebDollar.Blockchain.Transactions.subscribeTransactionsChanges(this.address, (data)=>{\n\n                if (data.transaction !== undefined)\n                    this._addTransaction (data.transaction);\n                else\n                    Vue.delete(this.transactions, data.txId );\n\n                this.$forceUpdate();\n\n            });\n\n            if (data !== null && data.result) {\n                this.subscription = data.subscription;\n                this._addTransactions(data.transactions);\n            }\n\n        },\n\n        computed: {\n\n            orderedTransactions() {\n\n                let sortable = [];\n                for (let i in this.transactions) {\n                    sortable.push( this.transactions[i] );\n                }\n\n                return sortable.sort(function(a, b) {\n                    return a._index - b._index;\n                });\n\n            }\n        },\n\n        methods:{\n\n            _addTransaction(transaction){\n\n                // in case it is a new transaction\n                if (this.transactions[transaction.txId] === undefined) {\n                    transaction._index =  -( ++this.transactionsLength );\n                }\n\n                let oldTransaction = this.transactions[transaction.txId];\n\n                Vue.set(this.transactions, transaction.txId, transaction);\n\n                if (transaction.confirmed && (oldTransaction !== undefined && oldTransaction.confirmed === false)){\n                    Notification.addAlert(\"error-firewall\", \"success\", \"Transaction Confirmed\", \"Transaction to \"+ this.toAddress + \" with \" +  BrowserHelpers.formatMoneyNumber(amountToSend)+\"WEBD has been confirmed.\",5000);\n                }\n\n            },\n\n            _addTransactions(transactions){\n\n                for (let key in transactions)\n                    this._addTransaction(transactions[key]);\n\n            },\n\n            objectIsEmpty(obj) {\n\n                // null and undefined are \"empty\"\n                if (obj == null) return true;\n\n                // Assume if it has a length property with a non-zero value\n                // that that property is correct.\n                if (obj.length > 0)    return false;\n                if (obj.length === 0)  return true;\n\n                // If it isn't an object at this point\n                // it is empty, but it can't be anything *but* empty\n                // Is it empty?  Depends on your application.\n                if (typeof obj !== \"object\") return true;\n\n                // Otherwise, does it have any properties of its own?\n                // Note that this doesn't handle\n                // toString and valueOf enumeration bugs in IE < 9\n                for (var key in obj) {\n                    if (hasOwnProperty.call(obj, key)) return false;\n                }\n\n                return true;\n            }\n\n        }\n\n    }\n</script>\n\n\n<style>\n\n    .transferListContainer{\n        list-style: none;\n        padding: 0;\n        max-height: 200px;\n        overflow: scroll;\n        overflow-x:hidden;\n    }\n\n    .transferListContainer::-webkit-scrollbar{\n        width:7px;height:7px\n    }\n    .transferListContainer::-webkit-scrollbar-track{\n        background:rgba(100,100,100,0.1)!important;\n    }\n    .transferListContainer::-webkit-scrollbar-thumb{\n        background: rgba(41, 41, 41, 0.5)!important;\n        border: solid 1px rgba(31, 31, 31, 0.5)!important;\n        border-radius: 4px;\n    }\n\n    .transferList::-webkit-scrollbar{\n        width:7px;height:7px\n    }\n    .transferList::-webkit-scrollbar-track{\n        background:rgba(100,100,100,0.1)!important;\n    }\n    .transferList::-webkit-scrollbar-thumb{\n        background: rgba(41, 41, 41, 0.5)!important;\n        border: solid 1px rgba(31, 31, 31, 0.5)!important;\n        border-radius: 4px;\n    }\n\n    .transferListElement{\n        font-size: 12px;\n        color: #fff;\n        list-style: none;\n        display: grid;\n        grid-template-columns: 1fr 1fr 60px;\n        white-space: nowrap ;\n        text-align: left;\n        background-color: #151515;\n        padding: 5px 10px;\n        border-bottom: solid 1px#262626;\n        border-top: solid 1px#262626;\n    }\n\n    .transferListElement:hover{\n        background-color: #1f1f1f!important;\n        transition: all 0.5s ease;\n    }\n\n    .destinations{\n        list-style: none;\n        padding: 0;\n    }\n\n    .money, .destinationAddress{\n        display: inline-block;\n    }\n\n    .destinationAddress{\n        width: 70%;\n        overflow: hidden;\n    }\n\n\n    .money{\n        width: 20%;\n        padding-left: 10px;\n        display: inline-block;\n        float: right;\n        text-align: right;\n    }\n\n    .currency{\n        margin-left: 5px;\n    }\n\n    .pairListElement{\n        background-color: #333333;\n    }\n\n    .transferListContainer .money{\n        color:#ffc12c;\n        line-height: 26px;\n    }\n\n    .transferListContainer .source{\n        color: #c5c5c5;\n    }\n\n    .transferList .title{\n        margin: 10px 0;\n    }\n\n    .transferList .headerTable{\n        display: grid;\n        grid-template-columns: 1fr 1fr 60px;\n        background-color: #262626;\n        color: #fff!important;\n        padding: 5px 0 5px 10px;\n    }\n\n    .headerTable span{\n        width: 100%!important;\n    }\n\n    .headerElement{\n        display: inline-block;\n        color: #d4d4d4!important;\n        font-size: 14px;\n        text-align: left;\n    }\n\n    .transactionElement{\n        display: grid;\n        grid-template-columns: 30px 1fr;\n    }\n\n    .transactionElement img{\n        height: 26px!important;\n    }\n\n    .transferList .miningAddress{\n        color: #737373 !important;\n        padding: 7px 0;\n        text-transform: uppercase;\n        letter-spacing: 2px;\n        font-size: 10px;\n        width: 90%;\n        margin: 0 auto;\n    }\n\n    .noTransactions .transferList .miningAddress{\n        letter-spacing: 1px!important;\n        width: 90%!important;\n    }\n\n    .noTransactions .miningAddress{\n        line-height: 18px;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_element_vue__ = __webpack_require__(27);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0eff801f_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_element_vue__ = __webpack_require__(82);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(72)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_element_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0eff801f_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_element_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transaction.element.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0eff801f", Component.options)
  } else {
    hotAPI.reload("data-v-0eff801f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(73);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("b9b82a5e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0eff801f\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transaction.element.vue", function() {
     var newContent = require("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0eff801f\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transaction.element.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.sources{\n    margin: 0;\n    padding: 0!important;\n}\n.statusPending{\n    background-color: #423922;\n}\n.statusConfirmed{\n    background-color: #1f2f18;\n}\n.status{\n    line-height: 26px;\n    text-align: center;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transaction.element.vue"],"names":[],"mappings":";AAoDA;IACA,UAAA;IACA,qBAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,kBAAA;IACA,mBAAA;CACA","file":"Transaction.element.vue","sourcesContent":["<template>\n\n    <li v-if=\"transaction !== null\" class=\"transferListElement\" :class=\"!this.transaction.confirmed ? 'statusPending' : 'statusConfirmed'\">\n\n        <ul class=\"sources\">\n\n            <transaction-from v-for=\"(fromAddress, index) in transaction.from.addresses\"\n                              :key=\"'transactionSource'+index\"\n                              :fromAddress=\"fromAddress\"\n            >\n            </transaction-from>\n\n        </ul>\n\n        <ul class=\"destinations\">\n\n            <transaction-to v-for=\"(toAddress, index) in transaction.to.addresses\"\n                            :key=\"'transactionDestination'+index\"\n                            :toAddress=\"toAddress\"\n            >\n            </transaction-to>\n\n        </ul>\n\n        <div class=\"status\">\n\n            {{this.transaction.confirmed ? 'Confirmed' : 'Pending'}}\n\n        </div>\n\n    </li>\n\n</template>\n\n<script>\n\n    import TransactionFrom from \"./Transaction-From.element.vue\"\n    import TransactionTo from \"./Transaction-To.element.vue\"\n\n    export default{\n\n        components:{ TransactionFrom, TransactionTo },\n\n        props:{\n            transaction : {default: ()=>{return null} },\n        }\n\n    }\n\n</script>\n\n<style>\n\n    .sources{\n        margin: 0;\n        padding: 0!important;\n    }\n\n    .statusPending{\n        background-color: #423922;\n    }\n\n    .statusConfirmed{\n        background-color: #1f2f18;\n    }\n\n    .status{\n        line-height: 26px;\n        text-align: center;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_From_element_vue__ = __webpack_require__(28);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4868e878_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_From_element_vue__ = __webpack_require__(77);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(75)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_From_element_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4868e878_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_From_element_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transaction-From.element.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4868e878", Component.options)
  } else {
    hotAPI.reload("data-v-4868e878", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(76);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("25c7fd79", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4868e878\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transaction-From.element.vue", function() {
     var newContent = require("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4868e878\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transaction-From.element.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.destinations img{\n    cursor: pointer;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transaction-From.element.vue"],"names":[],"mappings":";AAqDA;IACA,gBAAA;CACA","file":"Transaction-From.element.vue","sourcesContent":["<template>\n\n    <ul class=\"destinations\">\n        <li class=\"destinationElement transactionElement\">\n\n            <img :title=\"this.fromAddress.address\" @click=\"copyToClipboard\" class=\"walletAddressImage\" :src=\"this.getAddressPic\" >\n\n            <div class=\"money\" title=\"Amount\">\n                <span class=\"amount\">-{{ getAmount }}</span><span class=\"currency\">WEBD</span>\n            </div>\n\n        </li>\n    </ul>\n\n</template>\n\n<script>\n\n    var Vue = require('vue/dist/vue.min.js');\n\n    import Clipboard from '../../../../../../../../node_modules/v-clipboard/dist/index.min';\n\n    Vue.use(Clipboard);\n\n    export default{\n\n        props:{\n            fromAddress: {default: null},\n        },\n\n        computed:{\n            getAddressPic(){\n                return WebDollar.Blockchain.Wallet.getAddressPic(this.fromAddress.address);\n            },\n\n            getAmount(){\n                return this.fromAddress.amount / WebDollar.Applications.CoinsHelper.WEBD\n            }\n        },\n\n        methods:{\n\n            copyToClipboard(){\n                this.$clipboard(this.fromAddress.address);\n            },\n\n        }\n\n    }\n\n</script>\n\n<style>\n\n    .destinations img{\n        cursor: pointer;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("ul", { staticClass: "destinations" }, [
    _c("li", { staticClass: "destinationElement transactionElement" }, [
      _c("img", {
        staticClass: "walletAddressImage",
        attrs: { title: this.fromAddress.address, src: this.getAddressPic },
        on: { click: _vm.copyToClipboard }
      }),
      _c("div", { staticClass: "money", attrs: { title: "Amount" } }, [
        _c("span", { staticClass: "amount" }, [
          _vm._v("-" + _vm._s(_vm.getAmount))
        ]),
        _c("span", { staticClass: "currency" }, [_vm._v("WEBD")])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4868e878", esExports)
  }
}

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_To_element_vue__ = __webpack_require__(29);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6a9e5e15_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_To_element_vue__ = __webpack_require__(81);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(79)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_To_element_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6a9e5e15_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_To_element_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transaction-To.element.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6a9e5e15", Component.options)
  } else {
    hotAPI.reload("data-v-6a9e5e15", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(80);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("e75dfa28", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a9e5e15\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transaction-To.element.vue", function() {
     var newContent = require("!!../../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a9e5e15\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transaction-To.element.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.destinations img{\n    cursor: pointer;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/src/components/Wallet/Address/Modals/Main-Modal/parts/Transactions/Transaction-To.element.vue"],"names":[],"mappings":";AAsDA;IACA,gBAAA;CACA","file":"Transaction-To.element.vue","sourcesContent":["<template>\n\n    <ul class=\"destinations\">\n        <li class=\"destinationElement transactionElement\">\n\n            <img :title=\"this.toAddress.address\" @click=\"copyToClipboard\" class=\"walletAddressImage\" :src=\"this.getAddressPic\" >\n\n            <div class=\"money\" title=\"Amount\">\n                <span class=\"amount\">{{getAmount}}</span><span class=\"currency\">WEBD</span>\n            </div>\n\n        </li>\n    </ul>\n\n</template>\n\n<script>\n\n    var Vue = require('vue/dist/vue.min.js');\n\n    import Clipboard from '../../../../../../../../node_modules/v-clipboard/dist/index.min';\n\n    Vue.use(Clipboard);\n\n    export default{\n\n        props:{\n            toAddress: {default: null},\n        },\n\n        computed:{\n            getAddressPic(){\n                return WebDollar.Blockchain.Wallet.getAddressPic(this.toAddress.address);\n            },\n\n            getAmount(){\n                return this.toAddress.amount / WebDollar.Applications.CoinsHelper.WEBD\n            }\n\n        },\n\n        methods:{\n\n            copyToClipboard(){\n                this.$clipboard(this.toAddress.address);\n            },\n\n        }\n\n    }\n\n</script>\n\n<style>\n\n    .destinations img{\n        cursor: pointer;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("ul", { staticClass: "destinations" }, [
    _c("li", { staticClass: "destinationElement transactionElement" }, [
      _c("img", {
        staticClass: "walletAddressImage",
        attrs: { title: this.toAddress.address, src: this.getAddressPic },
        on: { click: _vm.copyToClipboard }
      }),
      _c("div", { staticClass: "money", attrs: { title: "Amount" } }, [
        _c("span", { staticClass: "amount" }, [_vm._v(_vm._s(_vm.getAmount))]),
        _c("span", { staticClass: "currency" }, [_vm._v("WEBD")])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6a9e5e15", esExports)
  }
}

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.transaction !== null
    ? _c(
        "li",
        {
          staticClass: "transferListElement",
          class: !this.transaction.confirmed
            ? "statusPending"
            : "statusConfirmed"
        },
        [
          _c(
            "ul",
            { staticClass: "sources" },
            _vm._l(_vm.transaction.from.addresses, function(
              fromAddress,
              index
            ) {
              return _c("transaction-from", {
                key: "transactionSource" + index,
                attrs: { fromAddress: fromAddress }
              })
            })
          ),
          _c(
            "ul",
            { staticClass: "destinations" },
            _vm._l(_vm.transaction.to.addresses, function(toAddress, index) {
              return _c("transaction-to", {
                key: "transactionDestination" + index,
                attrs: { toAddress: toAddress }
              })
            })
          ),
          _c("div", { staticClass: "status" }, [
            _vm._v(
              "\n\n        " +
                _vm._s(this.transaction.confirmed ? "Confirmed" : "Pending") +
                "\n\n    "
            )
          ])
        ]
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0eff801f", esExports)
  }
}

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { ref: "refTransferList", staticClass: "transferList" }, [
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.objectIsEmpty(_vm.transactions),
            expression: "objectIsEmpty(transactions)"
          }
        ],
        staticClass: "noTransactions"
      },
      [
        _c(
          "span",
          {
            staticClass: "miningAddress",
            staticStyle: { color: "white!important" }
          },
          [_vm._v("You don't have any transaction in last 20 blocks")]
        )
      ]
    ),
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: !_vm.objectIsEmpty(_vm.transactions),
            expression: "!objectIsEmpty(transactions)"
          }
        ]
      },
      [
        _c(
          "span",
          {
            staticClass: "miningAddress",
            staticStyle: { color: "white!important" }
          },
          [_vm._v("Transactions from last 20 blocks")]
        ),
        _vm._m(0),
        _c(
          "ul",
          { staticClass: "transferListContainer" },
          _vm._l(_vm.orderedTransactions, function(tx, index) {
            return _c("transaction", {
              key: "transaction" + index,
              attrs: { transaction: tx }
            })
          })
        )
      ]
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "headerTable" }, [
      _c("span", { staticClass: "headerElement fromItem" }, [_vm._v("From")]),
      _c("span", { staticClass: "headerElement" }, [_vm._v("To")]),
      _c("span", { staticClass: "headerElement" }, [_vm._v("Status")])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2382f042", esExports)
  }
}

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transfer_part_vue__ = __webpack_require__(30);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_cff1114e_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transfer_part_vue__ = __webpack_require__(87);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(85)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transfer_part_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_cff1114e_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transfer_part_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Main-Modal/parts/Transfer.part.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cff1114e", Component.options)
  } else {
    hotAPI.reload("data-v-cff1114e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(86);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("766dc98e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cff1114e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transfer.part.vue", function() {
     var newContent = require("!!../../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cff1114e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Transfer.part.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.modal .title {\n    background-color: #262626;\n    padding: 10px 0;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    line-height: 22px;\n    color: #ffc12c;\n}\n.transferError{\n    color: red;\n}\n.transferSuccess{\n    color: #ffc12c;\n    padding: 20px;\n    display: block;\n}\n.transferFee{\n    color: white;\n    text-align: left;\n}\n.transferWalletAddressImage{\n    position: relative;\n    height: 28.5px!important;\n    margin: 0 auto;\n    border-radius: 0!important;\n}\n.imageAndInput{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 28px 1fr;\n        grid-template-columns: 28px 1fr;\n    background-color: #333;\n}\n.moneyBox{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 100px;\n        grid-template-columns: 1fr 100px;\n    grid-column-gap: 10px;\n}\n.hide{\n    display: none!important;\n}\n.transfer .button{\n    cursor: pointer;\n}\ninput[type=number]::-webkit-inner-spin-button,\ninput[type=number]::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n}\n@media only screen and (max-width: 600px){\n.imageAndInput{\n        display: -ms-grid;\n        display: grid;\n        -ms-grid-columns: 38px 1fr;\n            grid-template-columns: 38px 1fr;\n        background-color: #333;\n}\n.modal .transfer .address {\n        padding: 6px 0 4px 10px;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/Main-Modal/parts/src/components/Wallet/Address/Modals/Main-Modal/parts/Transfer.part.vue"],"names":[],"mappings":";AAqNA;IACA,0BAAA;IACA,gBAAA;IACA,0BAAA;IACA,oBAAA;IACA,kBAAA;IACA,eAAA;CACA;AAEA;IACA,WAAA;CACA;AAGA;IACA,eAAA;IACA,cAAA;IACA,eAAA;CACA;AAEA;IACA,aAAA;IACA,iBAAA;CACA;AAEA;IACA,mBAAA;IACA,yBAAA;IACA,eAAA;IACA,2BAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,2BAAA;QAAA,gCAAA;IACA,uBAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,4BAAA;QAAA,iCAAA;IACA,sBAAA;CACA;AAEA;IACA,wBAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;;IAEA,yBAAA;IACA,UAAA;CACA;AAEA;AAEA;QACA,kBAAA;QAAA,cAAA;QACA,2BAAA;YAAA,gCAAA;QACA,uBAAA;CACA;AAEA;QACA,wBAAA;CACA;CAEA","file":"Transfer.part.vue","sourcesContent":["<template>\n    <div class=\"transferList\">\n\n        <p class=\"title\">Transfer WEBD</p>\n\n        <div class=\"transfer\" @keyup.enter=\"handleCreateTransaction\">\n            <div >\n                <div class=\"imageAndInput\">\n\n                    <div>\n                        <img class=\"walletAddressImage transferWalletAddressImage\" :src=\"this.getAddressPic\" :class=\"this.errorToAddressMessage==='Invalid Address' ? 'hide' : ''\" >\n                    </div>\n                    <div>\n                        <input class=\"address \" @keyup=\"this.handleChangeToAddress\" v-model=\"toAddress\" placeholder=\"Recipient Address\"/>\n                    </div>\n\n                </div>\n\n                <span class=\"editError\" v-html=\"this.errorToAddressMessage\" :class=\"this.errorToAddressMessage ? '' : 'hide'\"></span>\n\n            </div>\n\n            <div>\n                <div class=\"moneyBox\">\n                    <input v-model=\"toAmount\" @keyup=\"this.handleChangeToAmount\" type=\"number\" class=\"amount\" placeholder=\"WEBD Amount\"/>\n                    <input v-model=\"fee\" @keyup=\"this.handleChangeToFee\" class=\"amount\" type=\"number\" placeholder=\"Fee\"/>\n                </div>\n            </div>\n\n            <span class=\"editError editError2\" v-html=\"this.errorToAmountMessage\" :class=\"this.errorToAmountMessage ? '' : 'hide'\"></span>\n\n            <!--<div>-->\n                <!--<span class=\"transferError\" v-html=\"this.errorMessage\" :class=\"this.errorMessage ? '' : 'hide'\"/>-->\n                <!--<span class=\"transferSuccess\" v-html=\"this.successMessage\" :class=\"this.successMessage ? '' : 'hide'\"/>-->\n            <!--</div>-->\n\n            <button class=\"button\" @click=\"this.handleCreateTransaction\" :class=\"this.successMessage ? 'hide' : ''\" >\n                SEND WEBD\n            </button>\n        </div>\n\n    </div>\n</template>\n\n<script>\n\n    import Notification from \"helpers/Notification.helpers\"\n    import BrowserHelpers from \"helpers/Browser.helpers\"\n\n    export default {\n\n        //@onTransferSuccess\n        props:{\n            address: {default: null},\n        },\n\n        data: () => {\n            return {\n                toAddress: '',\n                toAmount: '',\n                fee: '',\n\n                errorMessage: '',\n                errorToAddressMessage: '',\n                errorToAmountMessage: '',\n                successMessage: '',\n            }\n        },\n\n        mounted(){\n\n            if (typeof window === 'undefined') return;\n\n            Notification.setVueInstance(this);\n\n        },\n\n        computed:{\n\n            getAddressPic(){\n\n                return WebDollar.Blockchain.Wallet.getAddressPic(this.toAddress);\n\n            }\n\n        },\n\n        methods:{\n\n            async handleCreateTransaction(){\n\n                this.toAmount = Number(this.toAmount);\n                this.fee = Number(this.fee);\n\n                this.handleChangeToAddress();\n\n                if (this.fee === 0) {\n                    this.errorToAmountMessage = 'Fee should not be 0';\n                    return false;\n                }\n\n                if (this.fee * WebDollar.Applications.CoinsHelper.WEBD < WebDollar.Applications.CONSTS.MINING_POOL.MINING.FEE_THRESHOLD){\n                    this.errorToAmountMessage = 'Fee is too small, and miners won\\'t process your transaction';\n                    return false;\n                }\n\n                if (this.errorToAddressMessage !== '' || this.errorToAmountMessage !== '' ) return false;\n\n                let amountToSend = parseInt(this.toAmount * WebDollar.Applications.CoinsHelper.WEBD);\n                let feeToSend = parseInt(this.fee * WebDollar.Applications.CoinsHelper.WEBD);\n                let answer = await WebDollar.Blockchain.Transactions.wizard.createTransactionSimple( this.address, this.toAddress, amountToSend, feeToSend );\n\n                if (answer.result){\n\n                    Notification.addAlert(\"error-firewall\", \"warn\", \"Transaction Created\", \"Transaction to \"+ this.toAddress + \" with \" +  BrowserHelpers.formatMoneyNumber(amountToSend)+\"WEBD has been created.\",5000);\n\n                    this.toAddress = '';\n                    this.toAmount = '';\n                    this.fee = '';\n\n                    this.$emit('onTransferSuccess', answer.message);\n\n                } else {\n                    this.errorMessage = answer.message;\n                    this.successMessage = '';\n                }\n\n            },\n\n            handleChangeToAddress(e){\n\n                try {\n\n                    if ( WebDollar.Applications.AddressHelper.getUnencodedAddressFromWIF(this.toAddress) === null ) {\n                        this.errorToAddressMessage = 'Invalid Address';\n                        return false;\n                    }\n\n                } catch (exception){\n                    this.errorToAddressMessage = 'Invalid Address';\n                    return false;\n                }\n\n                this.errorToAddressMessage = '';\n\n            },\n\n            decimalPlaces(num) {\n                var match = (''+num).match(/(?:\\.(\\d+))?(?:[eE]([+-]?\\d+))?$/);\n                if (!match) { return 0; }\n                var decimalsNumber= Math.max(\n                    0,\n                    (match[1] ? match[1].length : 0)\n                    - (match[2] ? +match[2] : 0));\n\n                if (decimalsNumber>4) return parseFloat(num).toFixed(4);\n                    else return num;\n            },\n\n            handleChangeToAmount(e){\n\n                this.toAmount = this.decimalPlaces(this.toAmount);\n\n                this.errorToAmountMessage = '';\n\n                this.fee = WebDollar.Blockchain.Transactions.wizard.calculateFeeSimple ( this.toAmount * WebDollar.Applications.CoinsHelper.WEBD) / WebDollar.Applications.CoinsHelper.WEBD;\n\n                try {\n\n                    let balance = WebDollar.Blockchain.blockchain.accountantTree.getBalance(this.address, undefined);\n\n                    if (balance === null) throw \"Balance is empty\";\n\n                    let total = (parseFloat(this.toAmount) + this.fee ) * WebDollar.Applications.CoinsHelper.WEBD;\n\n                    if ( balance < total ) {\n                        console.error(\"Insufficient funds\", {balance:balance, toAmount: this.toAmount, fee:this.fee})\n                        throw \"Insufficient Funds\";\n                    }\n\n                } catch (exception){\n\n                    if (typeof exception === \"string\")\n                        this.errorToAmountMessage = exception.toString();\n                    else\n                        this.errorToAmountMessage = exception.message;\n\n                    this.fee = '';\n                }\n\n                if (this.fee===0 || this.fee===undefined || this.errorToAmountMessage!==''){\n\n                    this.fee = 10;\n\n                }\n\n            },\n\n            handleChangeToFee(e){\n\n                this.fee = this.decimalPlaces(this.fee);\n\n                this.errorToAmountMessage = '';\n\n            }\n\n        },\n\n\n    }\n</script>\n\n<style>\n\n    .modal .title {\n        background-color: #262626;\n        padding: 10px 0;\n        text-transform: uppercase;\n        letter-spacing: 4px;\n        line-height: 22px;\n        color: #ffc12c;\n    }\n\n    .transferError{\n        color: red;\n    }\n\n\n    .transferSuccess{\n        color: #ffc12c;\n        padding: 20px;\n        display: block;\n    }\n\n    .transferFee{\n        color: white;\n        text-align: left;\n    }\n\n    .transferWalletAddressImage{\n        position: relative;\n        height: 28.5px!important;\n        margin: 0 auto;\n        border-radius: 0!important;\n    }\n\n    .imageAndInput{\n        display: grid;\n        grid-template-columns: 28px 1fr;\n        background-color: #333;\n    }\n\n    .moneyBox{\n        display: grid;\n        grid-template-columns: 1fr 100px;\n        grid-column-gap: 10px;\n    }\n\n    .hide{\n        display: none!important;\n    }\n\n    .transfer .button{\n        cursor: pointer;\n    }\n\n    input[type=number]::-webkit-inner-spin-button,\n    input[type=number]::-webkit-outer-spin-button {\n        -webkit-appearance: none;\n        margin: 0;\n    }\n\n    @media only screen and (max-width: 600px){\n\n        .imageAndInput{\n            display: grid;\n            grid-template-columns: 38px 1fr;\n            background-color: #333;\n        }\n\n        .modal .transfer .address {\n            padding: 6px 0 4px 10px;\n        }\n\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "transferList" }, [
    _c("p", { staticClass: "title" }, [_vm._v("Transfer WEBD")]),
    _c(
      "div",
      {
        staticClass: "transfer",
        on: {
          keyup: function($event) {
            if (
              !("button" in $event) &&
              _vm._k($event.keyCode, "enter", 13, $event.key)
            ) {
              return null
            }
            _vm.handleCreateTransaction($event)
          }
        }
      },
      [
        _c("div", [
          _c("div", { staticClass: "imageAndInput" }, [
            _c("div", [
              _c("img", {
                staticClass: "walletAddressImage transferWalletAddressImage",
                class:
                  this.errorToAddressMessage === "Invalid Address"
                    ? "hide"
                    : "",
                attrs: { src: this.getAddressPic }
              })
            ]),
            _c("div", [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.toAddress,
                    expression: "toAddress"
                  }
                ],
                staticClass: "address ",
                attrs: { placeholder: "Recipient Address" },
                domProps: { value: _vm.toAddress },
                on: {
                  keyup: this.handleChangeToAddress,
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.toAddress = $event.target.value
                  }
                }
              })
            ])
          ]),
          _c("span", {
            staticClass: "editError",
            class: this.errorToAddressMessage ? "" : "hide",
            domProps: { innerHTML: _vm._s(this.errorToAddressMessage) }
          })
        ]),
        _c("div", [
          _c("div", { staticClass: "moneyBox" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.toAmount,
                  expression: "toAmount"
                }
              ],
              staticClass: "amount",
              attrs: { type: "number", placeholder: "WEBD Amount" },
              domProps: { value: _vm.toAmount },
              on: {
                keyup: this.handleChangeToAmount,
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.toAmount = $event.target.value
                }
              }
            }),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.fee,
                  expression: "fee"
                }
              ],
              staticClass: "amount",
              attrs: { type: "number", placeholder: "Fee" },
              domProps: { value: _vm.fee },
              on: {
                keyup: this.handleChangeToFee,
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.fee = $event.target.value
                }
              }
            })
          ])
        ]),
        _c("span", {
          staticClass: "editError editError2",
          class: this.errorToAmountMessage ? "" : "hide",
          domProps: { innerHTML: _vm._s(this.errorToAmountMessage) }
        }),
        _c(
          "button",
          {
            staticClass: "button",
            class: this.successMessage ? "hide" : "",
            on: { click: this.handleCreateTransaction }
          },
          [_vm._v("\n            SEND WEBD\n        ")]
        )
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-cff1114e", esExports)
  }
}

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return this.address !== null && this.address !== undefined
    ? _c(
        "div",
        [
          _c(
            "modal",
            {
              ref: "refModal",
              staticClass: "addressMainModal",
              attrs: { title: "Wallet Address" }
            },
            [
              _c(
                "div",
                { attrs: { slot: "content" }, slot: "content" },
                [
                  _c("div", { staticClass: "twoColumns" }, [
                    _c("div", { staticClass: "section" }, [
                      _c("div", [
                        _c("img", {
                          staticClass: "walletAddressImage",
                          attrs: { src: this.getAddressPic }
                        }),
                        _c(
                          "b",
                          {
                            staticStyle: { color: "gray" },
                            attrs: { id: "walletID" }
                          },
                          [_vm._v(_vm._s(this.address.toString()))]
                        )
                      ]),
                      _c(
                        "div",
                        {
                          staticClass: "copyButton",
                          class:
                            this.clipboardText != "Copied"
                              ? "modalButton2"
                              : "modalButton2Success",
                          on: { click: _vm.copyToClipboard }
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(this.clipboardText) +
                              "\n                    "
                          )
                        ]
                      )
                    ]),
                    _c("div", { staticClass: "section balanceContent" }, [
                      _c("div", { staticClass: "balanceText" }, [
                        _c(
                          "div",
                          {
                            staticClass: "balanceTitle",
                            attrs: { title: "Balance available to be spent" }
                          },
                          [
                            _vm._v(
                              "\n                            Available Balance:\n                        "
                            )
                          ]
                        ),
                        _c(
                          "div",
                          {
                            staticClass: "balanceAmount",
                            attrs: { title: "Balance available to be spent" }
                          },
                          [
                            _c("show-balance", {
                              attrs: { address: this.address, currency: "0x01" }
                            })
                          ],
                          1
                        ),
                        _c(
                          "div",
                          {
                            staticClass: "balanceTitle",
                            staticStyle: { "letter-spacing": "0.1px" },
                            attrs: {
                              title:
                                "The balance you will have at the next block mined by your pool"
                            }
                          },
                          [
                            _vm._v(
                              "\n                            Potential Balance:\n                        "
                            )
                          ]
                        ),
                        _c(
                          "div",
                          {
                            staticClass: "balanceAmount",
                            attrs: {
                              title:
                                "The balance you will have at the next block mined by your pool"
                            }
                          },
                          [
                            _c("show-balance", {
                              attrs: {
                                showPoolReward: _vm.isMiningAddress,
                                address: this.address,
                                currency: "0x01"
                              }
                            })
                          ],
                          1
                        )
                      ]),
                      _vm.isMiningAddress
                        ? _c("div", { staticClass: "miningAddress" }, [
                            _vm._v(
                              "\n                        You are mining on this Address\n                    "
                            )
                          ])
                        : _vm._e(),
                      !_vm.isMiningAddress
                        ? _c(
                            "div",
                            {
                              staticClass: "modalButton2",
                              on: { click: _vm.handleSetAddress }
                            },
                            [
                              _vm._v(
                                "\n                        Mine on this address\n                    "
                              )
                            ]
                          )
                        : _vm._e()
                    ])
                  ]),
                  _c("div", { staticClass: "addressActions" }, [
                    _c(
                      "div",
                      {
                        class: [
                          this.partActivated === "transfer"
                            ? "actionButton activeActionButton"
                            : "actionButton"
                        ],
                        on: { click: this.showTransfer }
                      },
                      [
                        _vm._v(
                          "\n                    Transfer\n                "
                        )
                      ]
                    ),
                    _c(
                      "div",
                      {
                        class: [
                          this.partActivated === "transactions"
                            ? "actionButton activeActionButton"
                            : "actionButton"
                        ],
                        on: { click: this.showTransactions }
                      },
                      [
                        _vm._v(
                          "\n                    Transactions\n                "
                        )
                      ]
                    )
                  ]),
                  _c("transfer", {
                    style: {
                      display:
                        this.partActivated === "transfer" ? "block" : "none"
                    },
                    attrs: { address: this.address },
                    on: { onTransferSuccess: this.handleTransferSuccess }
                  }),
                  _c("transactions", {
                    style: {
                      display:
                        this.partActivated === "transactions" ? "block" : "none"
                    },
                    attrs: { address: this.address }
                  })
                ],
                1
              )
            ]
          )
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-fe1c3922", esExports)
  }
}

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Lock_modal_vue__ = __webpack_require__(31);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b585992_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Lock_modal_vue__ = __webpack_require__(92);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(90)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Lock_modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b585992_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Lock_modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Lock.modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3b585992", Component.options)
  } else {
    hotAPI.reload("data-v-3b585992", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("74e0d8fa", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b585992\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Lock.modal.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b585992\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Lock.modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.descriptionTextPass{\n    color: #bdbdbd;\n    padding: 30px 10px;\n}\n.inputDeleteModalPass{\n    width: 100%;\n    width: -webkit-fill-available;\n    background-color: #2d2d2d;\n    border: none;\n    margin: 0 auto;\n    left: 0;\n    right: 0;\n    color: #ccc;\n    padding: 7px 0;\n    font-weight: 100;\n    font-size: 14px;\n    padding-left: 5px;\n}\n.modalButtonPass{\n    background-color: #131313;\n    color: #969696;\n    font-size: 12px;\n    width: 140px;\n    font-weight: bolder;\n    border-radius: 5px;\n    letter-spacing: 2px;\n    text-transform: uppercase;\n    padding: 8px 20px;\n    margin: 0 auto;\n    cursor: pointer;\n    border: solid 1px #5f5d5d;\n    transition: all .3s linear;\n}\n.modalButtonPass:hover{\n    background-color: #f6ba2c;\n    color: #000000;\n    transition: all .3s linear;\n}\n.inputAndGeneratorPass{\n    width: 100%;\n    margin: 0 auto;\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr;\n        grid-template-columns: 1fr;\n    border: solid 1px #5f5d5d;\n    margin-bottom: 20px;\n}\n.generatorButtonPass{\n    margin: 0!important;\n    width: 100%!important;\n    border-radius: 0!important;\n    border: none;\n    height: 15px!important;\n    padding: 8px 0!important;\n}\n.errorMessage{\n    color: #de604d;\n    padding-bottom: 20px;\n    display: block;\n}\n.info{\n    color: #ffd36c;\n    padding-bottom: 20px;\n    text-transform: uppercase;\n    display: block;\n    font-size: 12px;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/src/components/Wallet/Address/Modals/Lock.modal.vue"],"names":[],"mappings":";AA0NA;IACA,eAAA;IACA,mBAAA;CACA;AAEA;IACA,YAAA;IACA,8BAAA;IACA,0BAAA;IACA,aAAA;IACA,eAAA;IACA,QAAA;IACA,SAAA;IACA,YAAA;IACA,eAAA;IACA,iBAAA;IACA,gBAAA;IACA,kBAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,gBAAA;IACA,aAAA;IACA,oBAAA;IACA,mBAAA;IACA,oBAAA;IACA,0BAAA;IACA,kBAAA;IACA,eAAA;IACA,gBAAA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,2BAAA;CACA;AAEA;IACA,YAAA;IACA,eAAA;IACA,kBAAA;IAAA,cAAA;IACA,sBAAA;QAAA,2BAAA;IACA,0BAAA;IACA,oBAAA;CACA;AAEA;IACA,oBAAA;IACA,sBAAA;IACA,2BAAA;IACA,aAAA;IACA,uBAAA;IACA,yBAAA;CACA;AAEA;IACA,eAAA;IACA,qBAAA;IACA,eAAA;CACA;AAEA;IACA,eAAA;IACA,qBAAA;IACA,0BAAA;IACA,eAAA;IACA,gBAAA;CACA","file":"Lock.modal.vue","sourcesContent":["<template>\n\n    <div>\n\n        <div ref=\"refClipboardCopy\"></div>\n\n        <Modal title=\"Wallet Address Secure\" ref=\"refPassModal\">\n\n            <div slot=\"content\">\n\n                <div >\n\n                    <span class=\"info\">Misplacement of your password will result in loss of access to your WEBD.</span>\n\n                    <div class=\"inputAndGeneratorPass\">\n                        <div>\n                            <input placeholder=\"Your 12 words Password\" v-model=\"walletAddressPassword\" class=\"inputDeleteModalPass\"/>\n                        </div>\n                        <div>\n                            <div @click=\"this.generateRandomPassword\" class=\"modalButtonPass generatorButtonPass\">\n                                Generate random password\n                            </div>\n                        </div>\n                    </div>\n\n                    <span class=\"errorMessage\">{{this.errorMessage}}</span>\n\n                    <div @click=\"this.createPassword\" class=\"modalButtonPass\">\n                        Set Password\n                    </div>\n\n                </div>\n\n            </div>\n\n        </Modal>\n\n    </div>\n\n</template>\n\n<script>\n\n    import Modal from \"components/UI/modal/Modal.vue\";\n    import FileSaver from './../../../../../node_modules/file-saver';\n    import Notification from \"helpers/Notification.helpers\"\n\n    export default {\n\n        props: {\n            address: {default: null},\n            toAddress: {default: null},\n            toAmount: {default: 0.0},\n        },\n\n        components: {\n            \"Modal\":Modal,\n        },\n\n        data: () => {\n            return {\n                walletAddressPassword: '',\n            }\n        },\n\n        methods: {\n\n            closeModal() {\n\n                this.walletAddressPassword = \"\";\n                this.$refs['refPassModal'].closeModal();\n\n            },\n\n            showModal(e) {\n\n                if (this.$refs['refPassModal'].modalOpened === false){\n                    this.$refs['refPassModal'].showModal();\n                }\n\n            },\n\n            copyToClipboard(){\n\n                this.$clipboard(this.walletAddressPassword.trim());\n\n            },\n\n            getRandomArbitraryNumber(min, max) {\n\n                return Math.floor(Math.random()*(max-min+1)+min);\n\n            },\n\n            generateRandomWord() {\n\n                var text = \"\";\n                var possible = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\";\n\n                let numberLength = this.getRandomArbitraryNumber(5,8);\n\n                for (var i = 0; i < numberLength; i++)\n                    text += possible.charAt(Math.floor(Math.random() * possible.length));\n\n                return text;\n\n            },\n\n            generateRandomPassword(){\n\n                this.walletAddressPassword = '';\n\n                for (let i = 0; i < 12; ++i){\n\n                    let randomWord = this.generateRandomWord();\n                    let index = this.walletAddressPassword.lastIndexOf(randomWord);\n\n                    if (index === -1){\n                        this.walletAddressPassword += randomWord;\n                        if (i < 11)\n                            this.walletAddressPassword += \" \";\n                    } else {\n                        i--;\n                    }\n                }\n\n            },\n\n            async createPassword(){\n\n                if (this.walletAddressPassword === null || this.walletAddressPassword === undefined)\n                    Notification.addAlert(undefined, \"error\", \"Password Error\", \"Your password is invalid!\", 5000);\n\n                let okPassword = true;\n                let wordsArray = [];\n                let wordsArraySize = 0;\n\n                this.walletAddressPassword = this.walletAddressPassword.trim();\n                if (0 < this.walletAddressPassword.length) {\n                    wordsArray = this.walletAddressPassword.split(' ');\n                    wordsArraySize = wordsArray.length;\n                }\n\n                if (wordsArraySize !== 12){\n\n                    Notification.addAlert(undefined, \"error\", \"Password Error\", \"The password should contain 12 words, but you have \" + wordsArraySize + \" words.\", 5000);\n                    okPassword = false;\n\n                }\n\n                if (okPassword === true){\n\n                    for (let i = 0; i < wordsArraySize; i++){\n\n                        let index = wordsArray.lastIndexOf(wordsArray[i]);\n\n                        if  (index !== i){\n\n                            Notification.addAlert(undefined, \"error\", \"Password Error\", \"The password should contain different words, but you are repeating \"+wordsArray[i]+\" word.\", 5000);\n                            okPassword = false;\n\n                        }\n\n                    }\n\n                }\n\n                if(okPassword === true){\n\n                    await this.setPassword(wordsArray);\n                }\n\n\n            },\n\n            async setPassword(wordsArray){\n\n                let response = await WebDollar.Blockchain.Wallet.encryptAddress(this.address, wordsArray);\n\n                if (response === true) {\n\n                    Notification.addAlert(undefined, \"success\", \"Successful Ecrypted\", this.address + \" has been encrypted.\", 5000);\n                    Notification.addAlert(undefined, \"info\", \"Password Backup\", \"We have downloaded for you a backup file of the password\", 6000);\n\n                    this.handleExportPassword(this.address);\n                    this.closeModal();\n\n                }\n\n                return response;\n            },\n\n            handleExportPassword(address){\n\n                let addressFile = new Blob([this.walletAddressPassword], {type: \"application/text;charset=utf-8\"});\n\n                let fileName = \"Password-\"+address.replace('+','').replace('=','')+\".txt\";\n                FileSaver.saveAs(addressFile, fileName);\n\n            },\n\n        },\n\n        mounted() {\n\n            if (typeof window === 'undefined')\n                return;\n\n            this.walletAddressPassword = \"\";\n            Notification.setVueInstance(this);\n\n        },\n\n    }\n\n</script>\n\n<style>\n\n    .descriptionTextPass{\n        color: #bdbdbd;\n        padding: 30px 10px;\n    }\n\n    .inputDeleteModalPass{\n        width: 100%;\n        width: -webkit-fill-available;\n        background-color: #2d2d2d;\n        border: none;\n        margin: 0 auto;\n        left: 0;\n        right: 0;\n        color: #ccc;\n        padding: 7px 0;\n        font-weight: 100;\n        font-size: 14px;\n        padding-left: 5px;\n    }\n\n    .modalButtonPass{\n        background-color: #131313;\n        color: #969696;\n        font-size: 12px;\n        width: 140px;\n        font-weight: bolder;\n        border-radius: 5px;\n        letter-spacing: 2px;\n        text-transform: uppercase;\n        padding: 8px 20px;\n        margin: 0 auto;\n        cursor: pointer;\n        border: solid 1px #5f5d5d;\n        transition: all .3s linear;\n    }\n\n    .modalButtonPass:hover{\n        background-color: #f6ba2c;\n        color: #000000;\n        transition: all .3s linear;\n    }\n\n    .inputAndGeneratorPass{\n        width: 100%;\n        margin: 0 auto;\n        display: grid;\n        grid-template-columns: 1fr;\n        border: solid 1px #5f5d5d;\n        margin-bottom: 20px;\n    }\n\n    .generatorButtonPass{\n        margin: 0!important;\n        width: 100%!important;\n        border-radius: 0!important;\n        border: none;\n        height: 15px!important;\n        padding: 8px 0!important;\n    }\n\n    .errorMessage{\n        color: #de604d;\n        padding-bottom: 20px;\n        display: block;\n    }\n\n    .info{\n        color: #ffd36c;\n        padding-bottom: 20px;\n        text-transform: uppercase;\n        display: block;\n        font-size: 12px;\n    }\n\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("div", { ref: "refClipboardCopy" }),
      _c(
        "Modal",
        { ref: "refPassModal", attrs: { title: "Wallet Address Secure" } },
        [
          _c("div", { attrs: { slot: "content" }, slot: "content" }, [
            _c("div", [
              _c("span", { staticClass: "info" }, [
                _vm._v(
                  "Misplacement of your password will result in loss of access to your WEBD."
                )
              ]),
              _c("div", { staticClass: "inputAndGeneratorPass" }, [
                _c("div", [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.walletAddressPassword,
                        expression: "walletAddressPassword"
                      }
                    ],
                    staticClass: "inputDeleteModalPass",
                    attrs: { placeholder: "Your 12 words Password" },
                    domProps: { value: _vm.walletAddressPassword },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.walletAddressPassword = $event.target.value
                      }
                    }
                  })
                ]),
                _c("div", [
                  _c(
                    "div",
                    {
                      staticClass: "modalButtonPass generatorButtonPass",
                      on: { click: this.generateRandomPassword }
                    },
                    [
                      _vm._v(
                        "\n                            Generate random password\n                        "
                      )
                    ]
                  )
                ])
              ]),
              _c("span", { staticClass: "errorMessage" }, [
                _vm._v(_vm._s(this.errorMessage))
              ]),
              _c(
                "div",
                {
                  staticClass: "modalButtonPass",
                  on: { click: this.createPassword }
                },
                [_vm._v("\n                    Set Password\n                ")]
              )
            ])
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3b585992", esExports)
  }
}

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Delete_modal_vue__ = __webpack_require__(32);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dc2c73dc_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Delete_modal_vue__ = __webpack_require__(96);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(94)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Delete_modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dc2c73dc_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Delete_modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Delete.modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dc2c73dc", Component.options)
  } else {
    hotAPI.reload("data-v-dc2c73dc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(95);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("278bc59e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dc2c73dc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Delete.modal.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dc2c73dc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Delete.modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.descriptionText{\n\n    color: #bdbdbd;\n    padding: 30px 10px;\n}\n.inputDeleteModal{\n    width: 90%;\n    background-color: #2d2d2d;\n    border: solid 1px #565656;\n    margin: 0 auto;\n    left: 0;\n    right: 0;\n    color: #ccc;\n    padding: 7px;\n    font-weight: 100;\n    text-align: center;\n    font-size: 14px;\n    margin-bottom: 20px;\n}\n.modalButton{\n    background-color: #131313;\n    color: #969696;\n    cursor: pointer;\n    font-size: 12px;\n    width: 140px;\n    border: solid 1px #5f5d5d;\n    font-weight: bolder;\n    border-radius: 5px;\n    letter-spacing: 2px;\n    text-transform: uppercase;\n    padding: 8px;\n    margin: 0 auto;\n    margin-bottom: 20px;\n    transition: all .3s linear;\n}\n.modalButton:hover{\n    background-color: #f6ba2c;\n    color: #000000;\n    transition: all .3s linear;\n}\n.coloredText{\n    color: #f6ba2c;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/src/components/Wallet/Address/Modals/Delete.modal.vue"],"names":[],"mappings":";AA4GA;;IAEA,eAAA;IACA,mBAAA;CAEA;AAEA;IACA,WAAA;IACA,0BAAA;IACA,0BAAA;IACA,eAAA;IACA,QAAA;IACA,SAAA;IACA,YAAA;IACA,aAAA;IACA,iBAAA;IACA,mBAAA;IACA,gBAAA;IACA,oBAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,gBAAA;IACA,gBAAA;IACA,aAAA;IACA,0BAAA;IACA,oBAAA;IACA,mBAAA;IACA,oBAAA;IACA,0BAAA;IACA,aAAA;IACA,eAAA;IACA,oBAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,2BAAA;CACA;AAEA;IACA,eAAA;CACA","file":"Delete.modal.vue","sourcesContent":["<template>\n\n    <div>\n\n        <Modal title=\"Delete Address\" ref=\"refModal\">\n\n            <div slot=\"content\" @keyup.enter=\"deleteAddress\">\n\n                <div class=\"descriptionText\">\n\n                    To delete this address please type <span class=\"coloredText\">DELETE</span>\n\n                </div>\n\n                <div >\n\n                    <input v-model=\"inputValue\" class=\"inputDeleteModal\"/>\n\n                    <div @click=\"this.deleteAddress\" class=\"modalButton\">\n                        Delete\n                    </div>\n\n                </div>\n\n            </div>\n\n        </Modal>\n\n    </div>\n\n</template>\n\n<script>\n\n    let Vue = require('vue/dist/vue.min.js');\n    import Modal from \"components/UI/modal/Modal.vue\"\n\n    import Clipboard from './../../../../../node_modules/v-clipboard'\n    import Notification from \"helpers/Notification.helpers\"\n\n    Vue.use(Clipboard);\n\n    export default {\n\n        props: {\n            address: {default: null},\n            toAddress: {default: null},\n            toAmount: {default: 0.0},\n\n        },\n\n        components: {\n            \"Modal\":Modal,\n        },\n\n        data: () => {\n            return {\n                inputValue: ''\n            }\n        },\n\n        methods: {\n\n            async deleteAddress(){\n\n                if (this.inputValue.toUpperCase().trim().toUpperCase() === 'DELETE'){\n\n                    // WebDollar.Blockchain.wallet. - DELETE\n                    let answer = await WebDollar.Blockchain.Wallet.deleteAddress(this.address);\n\n                    if(answer.result===true) Notification.addAlert(undefined, \"success\", \"Delete Succeeded\", this.address + \" has been deleted!\", 5000);\n\n                }\n\n                this.closeModal();\n\n            },\n\n            closeModal(e) {\n                this.inputValue = \"\";\n                if (this.$refs['refModal'] !== undefined)\n                    this.$refs['refModal'].closeModal(e);\n            },\n\n            showModal(e) {\n\n                if (this.$refs['refModal'].modalOpened === false){\n                    console.log(\"shooow modal\");\n                    this.$refs['refModal'].showModal(e);\n                }\n\n            }\n\n        },\n\n        mounted() {\n\n            if (typeof window === 'undefined') return;\n\n            Notification.setVueInstance(this);\n\n        },\n\n    }\n\n</script>\n\n<style>\n\n    .descriptionText{\n\n        color: #bdbdbd;\n        padding: 30px 10px;\n\n    }\n\n    .inputDeleteModal{\n        width: 90%;\n        background-color: #2d2d2d;\n        border: solid 1px #565656;\n        margin: 0 auto;\n        left: 0;\n        right: 0;\n        color: #ccc;\n        padding: 7px;\n        font-weight: 100;\n        text-align: center;\n        font-size: 14px;\n        margin-bottom: 20px;\n    }\n\n    .modalButton{\n        background-color: #131313;\n        color: #969696;\n        cursor: pointer;\n        font-size: 12px;\n        width: 140px;\n        border: solid 1px #5f5d5d;\n        font-weight: bolder;\n        border-radius: 5px;\n        letter-spacing: 2px;\n        text-transform: uppercase;\n        padding: 8px;\n        margin: 0 auto;\n        margin-bottom: 20px;\n        transition: all .3s linear;\n    }\n\n    .modalButton:hover{\n        background-color: #f6ba2c;\n        color: #000000;\n        transition: all .3s linear;\n    }\n\n    .coloredText{\n        color: #f6ba2c;\n    }\n\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("Modal", { ref: "refModal", attrs: { title: "Delete Address" } }, [
        _c(
          "div",
          {
            attrs: { slot: "content" },
            on: {
              keyup: function($event) {
                if (
                  !("button" in $event) &&
                  _vm._k($event.keyCode, "enter", 13, $event.key)
                ) {
                  return null
                }
                _vm.deleteAddress($event)
              }
            },
            slot: "content"
          },
          [
            _c("div", { staticClass: "descriptionText" }, [
              _vm._v("\n\n                To delete this address please type "),
              _c("span", { staticClass: "coloredText" }, [_vm._v("DELETE")])
            ]),
            _c("div", [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.inputValue,
                    expression: "inputValue"
                  }
                ],
                staticClass: "inputDeleteModal",
                domProps: { value: _vm.inputValue },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.inputValue = $event.target.value
                  }
                }
              }),
              _c(
                "div",
                {
                  staticClass: "modalButton",
                  on: { click: this.deleteAddress }
                },
                [_vm._v("\n                    Delete\n                ")]
              )
            ])
          ]
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-dc2c73dc", esExports)
  }
}

/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "walletAddress hoverAddress" },
    [
      _c(
        "div",
        {
          staticClass: "addressIdentityBox",
          on: {
            click: function($event) {
              $event.stopPropagation()
              _vm.handleTransferFunds($event)
            }
          }
        },
        [
          _c("img", {
            staticClass: "walletAddressImage",
            attrs: { src: this.getAddressPic }
          }),
          this.isMiningAddress
            ? _c("icon", {
                staticClass: "btn actuallMiningAddress isImining",
                staticStyle: { display: "inline-block" },
                attrs: { alt: "Mining", text: "Mining Address", icon: "mining" }
              })
            : _vm._e(),
          _c(
            "b",
            { staticClass: "fontColor" },
            [
              _c("show-balance", {
                attrs: {
                  showPoolReward: _vm.isMiningAddress,
                  address: this.address,
                  currency: "0x01"
                }
              })
            ],
            1
          ),
          _c("b", { staticClass: "amountCurrency currencyName" }, [
            _vm._v("WEBD")
          ]),
          _c(
            "div",
            { attrs: { id: "transactionAddressStatus" } },
            [
              _c("icon", {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: Object.keys(this.sendingMoney).length !== 0,
                    expression: "Object.keys(this.sendingMoney).length !== 0"
                  }
                ],
                staticClass: "walletMiningStatus walletSendingImg",
                attrs: { icon: "chevron-double-up" }
              }),
              _c("icon", {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: Object.keys(this.receivingMoney).length !== 0,
                    expression: "Object.keys(this.receivingMoney).length !== 0"
                  }
                ],
                staticClass: "walletMiningStatus walletReceivingImg",
                attrs: { icon: "chevron-double-down" }
              })
            ],
            1
          )
        ],
        1
      ),
      _c(
        "div",
        {
          staticClass: "actionsBox hoverAddress",
          style: {
            marginBottom: this.opened
              ? this.walletButtonMarginOpened + "px"
              : this.walletButtonMarginClosed + "px"
          }
        },
        [
          _c(
            "div",
            {
              staticClass: "addressButton",
              on: {
                click: function($event) {
                  $event.stopPropagation()
                  _vm.handleExport($event)
                }
              }
            },
            [
              _c("icon", {
                staticClass: "btn",
                attrs: {
                  alt: "Secure Wallet",
                  text: "Download Address",
                  icon: "download"
                }
              })
            ],
            1
          ),
          _c(
            "div",
            {
              staticClass: "addressButton",
              on: {
                click: function($event) {
                  $event.stopPropagation()
                  _vm.handleLock($event)
                }
              }
            },
            [
              _c("icon", {
                staticClass: "btn",
                attrs: {
                  alt: "Secure Wallet",
                  text: "Lock Address",
                  icon: this.addressLocked ? "lock-closed" : "lock-open"
                }
              })
            ],
            1
          ),
          _c(
            "div",
            {
              staticClass: "addressButton",
              on: {
                click: function($event) {
                  $event.stopPropagation()
                  _vm.handleDelete($event)
                }
              }
            },
            [
              _c("icon", {
                staticClass: "btn",
                attrs: {
                  alt: "Secure Wallet",
                  text: "Delete Address",
                  icon: "x"
                }
              })
            ],
            1
          )
        ]
      ),
      _c("address-main-modal", {
        ref: "refAddressMainModal",
        attrs: { address: this.address, isMiningAddress: this.isMiningAddress }
      }),
      _c("lock-modal", {
        ref: "refLockModal",
        attrs: { address: this.address }
      }),
      _c("delete-modal", {
        ref: "refDeleteModal",
        attrs: { address: this.address }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6fd10b33", esExports)
  }
}

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { ref: "dashboardWallet", staticClass: "dashboardWallet" },
    [
      _c("icon", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: !this.opened && _vm.isSendingMoney,
            expression: "!this.opened && isSendingMoney"
          }
        ],
        staticClass: "miningStatus sendingImg jump",
        attrs: { icon: "chevron-double-up" }
      }),
      _c("icon", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: !this.opened && _vm.isReceivingMoney,
            expression: "!this.opened && isReceivingMoney"
          }
        ],
        staticClass: "miningStatus receivingImg jump",
        style: {
          right: _vm.isSendingMoney ? "20px" : "4px",
          marginBottom: _vm.isSendingMoney ? "-2px" : "0"
        },
        attrs: { icon: "chevron-double-down" }
      }),
      _c(
        "div",
        {
          ref: "walletMenuButton",
          style: {
            marginBottom: this.opened
              ? this.walletButtonMarginOpened + "px"
              : this.walletButtonMarginClosed + "px",
            top: this.opened
              ? this.buttonTopDistanceOpen
              : this.buttonTopDistanceClose,
            borderTopLeftRadius: this.opened
              ? this.walletButtonRadiusLeftOpen + "px"
              : this.walletButtonRadiusLeftClose + "px",
            borderTopRightRadius: this.opened
              ? this.walletButtonRadiusRightOpen + "px"
              : this.walletButtonRadiusRightClose + "px"
          },
          attrs: { id: "walletButton" },
          on: { click: this.toggleWallet }
        },
        [
          _c(
            "span",
            { attrs: { id: "walletButtonText" } },
            [
              _c(
                "div",
                { staticStyle: { display: "inline-block" } },
                [
                  _c("icon", {
                    staticClass: "buttonIcon statusWalletIcon",
                    staticStyle: { fill: "black" },
                    attrs: { icon: this.opened ? "chevron-down" : "chevron-up" }
                  }),
                  _vm._v("\n                Wallet\n            ")
                ],
                1
              ),
              _c("show-sum-balances", {
                ref: "refShowSumBalances",
                style: {
                  display: this.isMobile == false ? "none" : "inline-block"
                },
                attrs: { addresses: this.addresses, currency: this.currency }
              })
            ],
            1
          )
        ]
      ),
      _c(
        "div",
        {
          ref: "walletMenu",
          style: {
            marginBottom: this.opened
              ? this.walletMarginOpened + "px"
              : this.walletMarginClosed + "px",
            top: this.opened
              ? this.buttonTopDistanceOpen
              : this.buttonTopDistanceClose,
            marginTop: this.opened
              ? this.walletMenuMarginTopOpen
              : this.walletMenuMarginTopClose,
            height: this.opened
              ? this.walletMenuHeightOpen
              : this.walletMenuHeightClosed
          },
          attrs: { id: "walletMenu" }
        },
        [
          _c("div", { attrs: { id: "dashboardWallet" } }, [
            _c("div", { staticClass: "walletController" }, [
              _c(
                "div",
                {
                  staticClass: "btn buttonTextStyle",
                  on: { click: this.handleAddNewAddress }
                },
                [_vm._v("\n                    Add Address\n                ")]
              ),
              _c("label", { staticClass: "myLabel" }, [
                _c("input", {
                  ref: "importedAddress",
                  attrs: { type: "file", multiple: "", size: "50" },
                  on: { change: this.handleImportAddress }
                }),
                _c("div", { staticClass: "btn buttonTextStyle" }, [
                  _vm._v(
                    "\n                        Import Address\n                    "
                  )
                ])
              ])
            ]),
            _c(
              "div",
              {
                staticClass: "walletSection walletsContainer",
                style: { height: this.walletContentHeight }
              },
              [
                _c(
                  "div",
                  { attrs: { id: "allWallets" } },
                  _vm._l(this.addresses, function(walletAddress, index) {
                    return _c("Address", {
                      key: walletAddress.address,
                      ref: "address" + index,
                      refInFor: true,
                      staticStyle: { "padding-right": "20px" },
                      attrs: {
                        isMiningAddress:
                          _vm.miningAddress === walletAddress.address,
                        id: "address" + walletAddress.address,
                        address: walletAddress.address
                      },
                      on: {
                        onPendingTransactionsChanges:
                          _vm.handlePendingTransactionsChanges
                      }
                    })
                  })
                )
              ]
            )
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8087f122", esExports)
  }
}

/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Mining_vue__ = __webpack_require__(33);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0954b78f_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Mining_vue__ = __webpack_require__(107);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(100)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Mining_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0954b78f_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Mining_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Mining/Mining.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0954b78f", Component.options)
  } else {
    hotAPI.reload("data-v-0954b78f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(101);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("c89c56c6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0954b78f\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Mining.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0954b78f\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Mining.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.hoverBalanceInfo{\n    position: fixed;\n    float: right;\n    background-color: #383838;\n    color: #fff;\n    border-top: solid 1px #3a3939;\n    border-left: solid 1px #3a3939;\n    height: 80px;\n    width: 300px;\n    bottom: 37px;\n    padding: 15px 10px;\n    box-sizing: border-box!important;\n    right: -330px;\n    z-index: 1;\n    transition: all 0.5s ease;\n}\n.WEBD:hover + .hoverBalanceInfo, .hoverBalanceInfo:hover{\n    right: 0px;\n    transition: all 0.5s ease\n}\n.hoverBalanceInfo .balanceTitle{\n    text-align: left;\n}\n.hoverBalanceInfo .balanceText{\n    -ms-grid-columns: 126px 1fr;\n        grid-template-columns: 126px 1fr;\n    grid-row-gap: 15px;\n}\n.hoverBalanceInfo svg{\n    margin: 0;\n    width: 16px;\n    height: 16px;\n    padding: 0;\n}\n#miningLoader{\n    vertical-align: top;\n    width: 24px;\n    height: 24px;\n}\n#dashboardMining{\n    overflow: hidden;\n    position: fixed;\n    bottom: 0px;\n    height: 33px;\n    background-color: #262626;\n    display: block;\n    left: 0;\n    padding-bottom: 3px;\n    right: 0;\n    z-index: 95;\n    border-top: solid 1px #3a3939;\n}\n.miningPowerThreads{\n    font-size: 14px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 8px;\n    text-transform: uppercase;\n    padding-bottom: 5px;\n    color: #fff;\n    letter-spacing: 5px;\n    margin: 0;\n}\n.walletStartMining{\n    position: relative;\n    display: inline-block!important;\n    vertical-align: top;\n    left: 0;\n    right: 0;\n    font-size: 20px;\n    color: #f20;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n.walletStartMining a{\n    padding-top: 5px;\n    display: block;\n    color: #000;\n}\n.walletStartMining a:hover{\n    color: #ffc12c;\n}\n.walletStartMining:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n.minningController p{\n    font-size: 20px;\n    margin-right: -4px;\n}\n#miningDetails{\n    vertical-align: top;\n    display: inline-block;\n    line-height: 32px;\n    margin-top: 1px;\n    margin-left: 35px;\n}\n#miningDetails p{\n    margin-top: 0;\n    font-size: 12px;\n    color: #D5D5D5;\n}\n#threadsControll{\n    display: inline-block;\n    vertical-align: top;\n    width: 100%;\n    background-color: #1f1f1f;\n}\n#threadsControll .leftButton {\n    float: left;\n}\n#threadsControll .rightButton {\n    float: right;\n}\n#threadsControll .button p{\n    padding-top: 3px;\n    padding-bottom: 4px;\n    line-height: 27px;\n    margin: 0;\n}\n#allWallets{\n    /*border-top: solid 1px #7b7b7b;*/\n    display: block;\n    /*padding-top: 10px;*/\n}\n.miningPowerText{\n    font-size: 10px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 5px;\n    margin: 0;\n    color: #fff;\n}\n.miningPowerText .secondWord{\n    height: auto;\n    line-height: 10px;\n    margin: 0;\n    font-weight: bold;\n    color: #fff;\n    margin-right: -4px;\n}\n#threadsControll .button{\n    display: inline-block;\n    background-color: #1f1f1f;\n    color: #fff;\n    font-size: 26px;\n    border: solid 1px #565656;\n    width: 31px;\n    border-top: none;\n    border-bottom: none;\n    text-align: center;\n    cursor: pointer;\n    transition: all .3s linear;\n}\n#threadsControll .button:hover{\n    background-color: #000;\n    transition: all .3s linear;\n}\n#threadsControll .button:first-child{\n    margin-top: 0;\n}\n#threadsNumber{\n    font-size: 20px;\n    padding: 0 10px;\n    text-align: center;\n    padding-bottom: 8px;\n    line-height: 25px;\n    display: inline-block;\n    color: #fff;\n    background-color: #d23c25;\n    vertical-align: top;\n    padding-top: 6px;\n    border-right: solid 1px #3a3939;\n    width: 40px;\n    padding-left: 0;\n    padding-right:0;\n}\n.whiteText{\n    color: #c5c5c5;\n    font-weight: 100;\n    margin-left: 5px;\n}\n#minningController{\n    width: 100%;\n    border-top:none;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n    vertical-align: top;\n}\n#createWalletAddress{\n    border: solid 1px #7b7b7b;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n}\n#createWalletAddress p:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n#createWalletAddress p{\n    padding: 10px;\n    padding-top: 14px;\n    background-color: #353535;\n    color: #bbb;\n    display: inline-block;\n    width: 214px;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n.WEBD{\n    display: inline-block;\n    margin-left: 20px;\n    font-size: 20px;\n    color: #fec02c;\n    vertical-align: top;\n    margin-top: 0;\n    float: right;\n    min-width: 300px;\n    text-align: center;\n    border-left: solid 1px #333;\n    line-height: 42px;\n}\n#miningDetails p{\n    display: inline-block;\n}\n.miningBar{\n    display: inline-block;\n    width: 330px;\n    margin-left: 0;\n}\n.miningLoader{\n    margin-top: 5px;\n}\n.showSumBallance{\n    vertical-align: top;\n    display: inline-block;\n}\n@media only screen and (max-width : 831px) {\n.hoverBalanceInfo{\n        display: none;\n}\n.miningBar{\n        padding: 4px 0px;\n}\n.show-balance-span{\n        font-size: 20px;\n}\n#dashboardMining{\n        margin-bottom: 0;\n}\n#minningController, .walletStartMining, .WEBD{\n        display: inline-block;\n        width: 100%;\n}\n#minningController{\n        background-color: #0000;\n        margin-bottom: 0;\n        height: 33px;\n        border-top: none;\n        margin-top: 50px;\n}\n#threadsControll .button p{\n        line-height: 43px;\n}\n#threadsControll .button{\n        width: 80px;\n}\n.miningPowerThreads{\n        line-height: 38px;\n        font-size: 16px;\n        margin-right: -4px;\n}\n#miningDetails{\n        line-height: 41px;\n        color: #969696;\n        float: right;\n        margin-right: 15px;\n}\n.miningPowerText{\n        display: none;\n}\n#threadsNumber{\n        margin: 0 auto;\n        text-align: center;\n        float:left;\n        position: relative;\n        display: block;\n        line-height: 34px;\n        width: 35px;\n        padding-top: 6px;\n        padding-left: 0;\n}\n.WEBD{\n        text-align: right;\n        margin-right: 10px;\n        min-width: auto;\n        width: auto;\n        border:none;\n        line-height: 42px;\n        display: none;\n}\n.miningPowerThreads{\n        display:none;\n}\n#threadsControll .button{\n        float:left;\n}\n.walletStartMining{\n        margin-top:-29px;\n}\n#threadsControll{\n        background-color: #f200;\n}\n#threadsControll .button p {\n        line-height: 35px;\n        font-size: 35px;\n        padding-top: 7px;\n}\n#threadsControll .button:first-child{\n        border:none;\n}\n#minningController{\n        margin-top:0\n}\n#dashboardMining{\n        height:40px;\n}\n.walletStartMining:hover{\n        background-color: #f200;\n}\n#walletButton span{\n        width: auto!important;\n        color: #000;\n        margin-left: 10px;\n}\n}\n@media only screen and (max-width : 600px) {\n.whiteText{\n            display: none;\n}\n}\n@media only screen and (max-width : 500px) {\n.miningBar{\n        width: 50%;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Mining/src/components/Mining/Mining.vue"],"names":[],"mappings":";AA4OA;IACA,gBAAA;IACA,aAAA;IACA,0BAAA;IACA,YAAA;IACA,8BAAA;IACA,+BAAA;IACA,aAAA;IACA,aAAA;IACA,aAAA;IACA,mBAAA;IACA,iCAAA;IACA,cAAA;IACA,WAAA;IACA,0BAAA;CACA;AAEA;IACA,WAAA;IACA,yBAAA;CACA;AAEA;IACA,iBAAA;CACA;AAEA;IACA,4BAAA;QAAA,iCAAA;IACA,mBAAA;CACA;AAEA;IACA,UAAA;IACA,YAAA;IACA,aAAA;IACA,WAAA;CACA;AAEA;IACA,oBAAA;IACA,YAAA;IACA,aAAA;CACA;AAEA;IACA,iBAAA;IACA,gBAAA;IACA,YAAA;IACA,aAAA;IACA,0BAAA;IACA,eAAA;IACA,QAAA;IACA,oBAAA;IACA,SAAA;IACA,YAAA;IACA,8BAAA;CACA;AAEA;IACA,gBAAA;IACA,sBAAA;IACA,gBAAA;IACA,oBAAA;IACA,iBAAA;IACA,0BAAA;IACA,oBAAA;IACA,YAAA;IACA,oBAAA;IACA,UAAA;CACA;AAGA;IACA,mBAAA;IACA,gCAAA;IACA,oBAAA;IACA,QAAA;IACA,SAAA;IACA,gBAAA;IACA,YAAA;IACA,gBAAA;IACA,mBAAA;IACA,2BAAA;CACA;AAEA;IACA,iBAAA;IACA,eAAA;IACA,YAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,gBAAA;IACA,mBAAA;CACA;AAEA;IACA,oBAAA;IACA,sBAAA;IACA,kBAAA;IACA,gBAAA;IACA,kBAAA;CACA;AAEA;IACA,cAAA;IACA,gBAAA;IACA,eAAA;CACA;AAEA;IACA,sBAAA;IACA,oBAAA;IACA,YAAA;IACA,0BAAA;CACA;AAEA;IACA,YAAA;CACA;AAEA;IACA,aAAA;CACA;AAEA;IACA,iBAAA;IACA,oBAAA;IACA,kBAAA;IACA,UAAA;CACA;AAEA;IACA,kCAAA;IACA,eAAA;IACA,sBAAA;CACA;AAEA;IACA,gBAAA;IACA,sBAAA;IACA,gBAAA;IACA,oBAAA;IACA,iBAAA;IACA,UAAA;IACA,YAAA;CACA;AAGA;IACA,aAAA;IACA,kBAAA;IACA,UAAA;IACA,kBAAA;IACA,YAAA;IACA,mBAAA;CACA;AAGA;IACA,sBAAA;IACA,0BAAA;IACA,YAAA;IACA,gBAAA;IACA,0BAAA;IACA,YAAA;IACA,iBAAA;IACA,oBAAA;IACA,mBAAA;IACA,gBAAA;IACA,2BAAA;CACA;AAEA;IACA,uBAAA;IACA,2BAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,gBAAA;IACA,gBAAA;IACA,mBAAA;IACA,oBAAA;IACA,kBAAA;IACA,sBAAA;IACA,YAAA;IACA,0BAAA;IACA,oBAAA;IACA,iBAAA;IACA,gCAAA;IACA,YAAA;IACA,gBAAA;IACA,gBAAA;CACA;AAEA;IACA,eAAA;IACA,iBAAA;IACA,iBAAA;CACA;AAEA;IACA,YAAA;IACA,gBAAA;IACA,kBAAA;IACA,oBAAA;IACA,sBAAA;IACA,oBAAA;CACA;AAEA;IACA,0BAAA;IACA,kBAAA;IACA,oBAAA;IACA,sBAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,cAAA;IACA,kBAAA;IACA,0BAAA;IACA,YAAA;IACA,sBAAA;IACA,aAAA;IACA,gBAAA;IACA,mBAAA;IACA,2BAAA;CACA;AAEA;IACA,sBAAA;IACA,kBAAA;IACA,gBAAA;IACA,eAAA;IACA,oBAAA;IACA,cAAA;IACA,aAAA;IACA,iBAAA;IACA,mBAAA;IACA,4BAAA;IACA,kBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,sBAAA;IACA,aAAA;IACA,eAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,oBAAA;IACA,sBAAA;CACA;AAEA;AAEA;QACA,cAAA;CACA;AAEA;QACA,iBAAA;CACA;AAEA;QACA,gBAAA;CACA;AAEA;QACA,iBAAA;CACA;AACA;QACA,sBAAA;QACA,YAAA;CACA;AACA;QACA,wBAAA;QACA,iBAAA;QACA,aAAA;QACA,iBAAA;QACA,iBAAA;CACA;AACA;QACA,kBAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;QACA,mBAAA;CACA;AACA;QACA,kBAAA;QACA,eAAA;QACA,aAAA;QACA,mBAAA;CACA;AACA;QACA,cAAA;CACA;AACA;QACA,eAAA;QACA,mBAAA;QACA,WAAA;QACA,mBAAA;QACA,eAAA;QACA,kBAAA;QACA,YAAA;QACA,iBAAA;QACA,gBAAA;CACA;AACA;QACA,kBAAA;QACA,mBAAA;QACA,gBAAA;QACA,YAAA;QACA,YAAA;QACA,kBAAA;QACA,cAAA;CACA;AACA;QACA,aAAA;CACA;AACA;QACA,WAAA;CACA;AACA;QACA,iBAAA;CACA;AACA;QACA,wBAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;QACA,iBAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,wBAAA;CACA;AAEA;QACA,sBAAA;QACA,YAAA;QACA,kBAAA;CACA;CAEA;AAEA;AAEA;YACA,cAAA;CACA;CAEA;AAEA;AAEA;QACA,WAAA;CACA;CAGA","file":"Mining.vue","sourcesContent":["<template>\n    <div id=\"dashboardMining\" class=\"walletSection\" >\n\n        <div id=\"minningController\">\n            <p class=\"miningPowerText\">Mining <br/> <span class=\"secondWord\">Power</span></p>\n            <strong id=\"threadsNumber\" :style=\"{background: this.workers ? 0 : '#d23c25'}\">{{this.workers}}</strong>\n\n            <div type=\"button\" class=\"miningBar\">\n                <slider ref=\"refMiningSlider\" @sliderChanged=\"this.changeWorkers\" />\n            </div>\n\n            <div id=\"miningDetails\">\n                <p class=\"\" :style=\"{display: this.hashesPerSecond==0 && this.started==true ? 'none' : 'inline-block'}\">{{this.started ? this.hashesPerSecond + ' hash/sec' : 'not started'}} </p>\n                <svg :style=\"{display: this.hashesPerSecond==0 && this.started==true ? 'inline-block' : 'none'}\" version=\"1.1\" id=\"miningLoader\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                     width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n                      <path fill=\"#fec02c\" d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\n                        <animateTransform attributeType=\"xml\"\n                          attributeName=\"transform\"\n                          type=\"rotate\"\n                          from=\"0 25 25\"\n                          to=\"360 25 25\"\n                          dur=\"0.6s\"\n                          repeatCount=\"indefinite\"/>\n                        </path>\n                </svg>\n            </div>\n            <p class=\"WEBD\">\n                <svg :style=\"{display: this.loaded==false ? 'inline-block' : 'none'}\" version=\"1.1\" id=\"miningLoader\" class=\"miningLoader\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                     width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n                      <path fill=\"#fec02c\" d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\n                        <animateTransform attributeType=\"xml\"\n                          attributeName=\"transform\"\n                          type=\"rotate\"\n                          from=\"0 25 25\"\n                          to=\"360 25 25\"\n                          dur=\"0.6s\"\n                          repeatCount=\"indefinite\"/>\n                        </path>\n                </svg>\n\n                <show-sum-balances :showPoolReward=\"true\" :style=\"{display: this.loaded==false ? 'none' : 'inline-block'}\" :addresses=\"this.addresses\" :currency=\"this.currency\" ref=\"refShowSumBalances\" class=\"showSumBallance\"/> <b class=\"whiteText\">WEBD</b>\n\n                <div class=\"hoverBalanceInfo\" >\n                    <div class=\"balanceText\">\n\n                        <div class=\"balanceTitle helpCursor\" title=\"Balance available to be spent\">\n                            Available Balance:\n                        </div>\n                        <div class=\"balanceAmount helpCursor\" title=\"Balance available to be spent\">\n                            <show-sum-balances :addresses=\"this.addresses\" :currency=\"this.currency\" ref=\"refShowSumAvailableBalances\" />\n                        </div>\n\n                        <div class=\"balanceTitle helpCursor\" style=\"letter-spacing: 0.1px\" title=\"The balance you will have at the next block mined by your pool\">\n                            Potential Balance:\n                        </div>\n                        <div class=\"balanceAmount helpCursor\" title=\"The balance you will have at the next block mined by your pool\">\n                            <show-sum-balances :showPoolReward=\"true\" :addresses=\"this.addresses\" :currency=\"this.currency\" ref=\"refShowSumPotentialBalances\"/>\n                        </div>\n\n                    </div>\n                </div>\n            </p>\n        </div>\n\n    </div>\n</template>\n\n<script>\n\n    import ShowSumBalances from \"components/Wallet/Address/Balance/Balances/Show-Sum-Balances.vue\"\n    import slider from \"./slider.vue\";\n    import ShowBalance from \"components/Wallet/Address/Balance/Show-Balance.vue\"\n\n    export default{\n\n        name: 'Mining',\n\n        components: {\n            ShowSumBalances,\n            slider,\n            ShowBalance,\n        },\n\n        props: [\n            'addresses',\n            'currency',\n            \"startAutomatically\",\n        ],\n\n        data: function () {\n            return {\n                started: false,\n                hashesPerSecond: 0,\n                workers: localStorage.getItem(\"miner-settings-worker-count\") || 0,\n                minerAddress:'',\n                status: '',\n                loaded:false,\n                stopTimerHandler: null,\n\n                _prevWorkers: null,\n            }\n        },\n\n        computed:{\n        },\n\n        mounted() {\n\n            if (typeof window === 'undefined') return;\n\n            WebDollar.StatusEvents.on(\"mining/hash-rate\", (hashesPerSecond)=>{\n                this.hashesPerSecond = hashesPerSecond;\n            });\n\n            WebDollar.StatusEvents.on(\"mining/status-changed\", (status)=>{\n\n                this.started = WebDollar.Blockchain.Mining.started;\n\n            });\n\n            WebDollar.StatusEvents.on(\"mining/reset\", ()=>{\n\n                this.started = WebDollar.Blockchain.Mining.started;\n\n            });\n\n            WebDollar.StatusEvents.on(\"mining/workers-changed\", (workers)=>{\n\n                this.workers = workers;\n                if (this.workers !== this.$refs['refMiningSlider'].data) {\n                    this.$refs['refMiningSlider'].$refs['slider'].setValue(this.workers);\n                }\n\n            });\n\n            this.minerAddress = WebDollar.Blockchain.Mining.minerAddressBase;\n            WebDollar.StatusEvents.on(\"mining/miner-address-changed\", (minerAddress)=>{\n                this.minerAddress = minerAddress;\n            });\n\n            WebDollar.StatusEvents.on(\"blockchain/status\", (data)=>{\n\n                this.status = data.message;\n\n            });\n\n            WebDollar.StatusEvents.on(\"blockchain/status\", (data)=>{\n\n                if (data.message === \"Blockchain Ready to Mine\") {\n\n                    this.loaded = true;\n                    this.$refs['refMiningSlider'].disabled = false;\n\n                    if (this.startAutomatically){\n                        let number_of_workers;\n\n                        if (this._prevWorkers !== null && this._prevWorkers !== undefined)\n                            number_of_workers = this._prevWorkers;\n                        else\n                            number_of_workers = localStorage.getItem(\"miner-settings-worker-count\");\n\n\n                        this.$refs['refMiningSlider'].disableHalving = true;\n                        WebDollar.Blockchain.Mining.setWorkers(number_of_workers || 1);\n                        this.$refs['refMiningSlider'].disableHalving = false;\n\n                    }\n\n                    console.error('#################################################### s-a synchronizat');\n\n                }\n\n                if (data.message === \"Start Synchronizing\"){\n\n                    if (this._prevWorkers === null || this._prevWorkers === undefined)\n                        this._prevWorkers = localStorage.getItem(\"miner-settings-worker-count\");\n                    else\n                        this._prevWorkers = WebDollar.Blockchain.Mining.workers.workers;\n\n                }\n\n            });\n\n        }\n        ,\n        methods: {\n        \n            changeWorkers(value){\n\n                WebDollar.Blockchain.Mining.setWorkers(value);\n\n                let setWorkersTimer = (value) => {\n\n                    let timer;\n\n                    let last_number_of_workers = localStorage.getItem(\"miner-settings-worker-count\") || 0;\n                    if (last_number_of_workers === 0)\n                        localStorage.setItem(\"miner-settings-worker-count\", 1);\n\n                    function run() {\n                        console.log(\"A new default mining power was set:\", value);\n                        localStorage.setItem(\"miner-settings-worker-count\", value);\n                    }\n\n                    let time = 20*1000; //default 20 sec\n\n                    if (WebDollar.Applications.VersionCheckerHelper.detectMobileAndTablet()){\n                        time = 120*1000;\n                    }\n\n                    timer = setTimeout(run, time);\n\n                    return stopTimer;\n\n                    function stopTimer() {\n                        if (timer) {\n                            clearTimeout(timer);\n                            timer = 0;\n                        }\n                    }\n                };\n                \n                if (this.stopTimerHandler)\n                    this.stopTimerHandler();\n\n                this.stopTimerHandler = setWorkersTimer(value);\n            }\n\n        }\n\n\n    }\n\n</script>\n\n<style>\n\n    .hoverBalanceInfo{\n        position: fixed;\n        float: right;\n        background-color: #383838;\n        color: #fff;\n        border-top: solid 1px #3a3939;\n        border-left: solid 1px #3a3939;\n        height: 80px;\n        width: 300px;\n        bottom: 37px;\n        padding: 15px 10px;\n        box-sizing: border-box!important;\n        right: -330px;\n        z-index: 1;\n        transition: all 0.5s ease;\n    }\n\n    .WEBD:hover + .hoverBalanceInfo, .hoverBalanceInfo:hover{\n        right: 0px;\n        transition: all 0.5s ease\n    }\n\n    .hoverBalanceInfo .balanceTitle{\n        text-align: left;\n    }\n\n    .hoverBalanceInfo .balanceText{\n        grid-template-columns: 126px 1fr;\n        grid-row-gap: 15px;\n    }\n\n    .hoverBalanceInfo svg{\n        margin: 0;\n        width: 16px;\n        height: 16px;\n        padding: 0;\n    }\n\n    #miningLoader{\n        vertical-align: top;\n        width: 24px;\n        height: 24px;\n    }\n\n    #dashboardMining{\n        overflow: hidden;\n        position: fixed;\n        bottom: 0px;\n        height: 33px;\n        background-color: #262626;\n        display: block;\n        left: 0;\n        padding-bottom: 3px;\n        right: 0;\n        z-index: 95;\n        border-top: solid 1px #3a3939;\n    }\n\n    .miningPowerThreads{\n        font-size: 14px;\n        display: inline-block;\n        padding: 0 10px;\n        vertical-align: top;\n        padding-top: 8px;\n        text-transform: uppercase;\n        padding-bottom: 5px;\n        color: #fff;\n        letter-spacing: 5px;\n        margin: 0;\n    }\n\n\n    .walletStartMining{\n        position: relative;\n        display: inline-block!important;\n        vertical-align: top;\n        left: 0;\n        right: 0;\n        font-size: 20px;\n        color: #f20;\n        cursor: pointer;\n        text-align: center;\n        transition: all .3s linear;\n    }\n\n    .walletStartMining a{\n        padding-top: 5px;\n        display: block;\n        color: #000;\n    }\n\n    .walletStartMining a:hover{\n        color: #ffc12c;\n    }\n\n    .walletStartMining:hover{\n        background-color: #191919;\n        transition: all .3s linear;\n    }\n\n    .minningController p{\n        font-size: 20px;\n        margin-right: -4px;\n    }\n\n    #miningDetails{\n        vertical-align: top;\n        display: inline-block;\n        line-height: 32px;\n        margin-top: 1px;\n        margin-left: 35px;\n    }\n\n    #miningDetails p{\n        margin-top: 0;\n        font-size: 12px;\n        color: #D5D5D5;\n    }\n\n    #threadsControll{\n        display: inline-block;\n        vertical-align: top;\n        width: 100%;\n        background-color: #1f1f1f;\n    }\n\n    #threadsControll .leftButton {\n        float: left;\n    }\n\n    #threadsControll .rightButton {\n        float: right;\n    }\n\n    #threadsControll .button p{\n        padding-top: 3px;\n        padding-bottom: 4px;\n        line-height: 27px;\n        margin: 0;\n    }\n\n    #allWallets{\n        /*border-top: solid 1px #7b7b7b;*/\n        display: block;\n        /*padding-top: 10px;*/\n    }\n\n    .miningPowerText{\n        font-size: 10px;\n        display: inline-block;\n        padding: 0 10px;\n        vertical-align: top;\n        padding-top: 5px;\n        margin: 0;\n        color: #fff;\n    }\n\n\n    .miningPowerText .secondWord{\n        height: auto;\n        line-height: 10px;\n        margin: 0;\n        font-weight: bold;\n        color: #fff;\n        margin-right: -4px;\n    }\n\n\n    #threadsControll .button{\n        display: inline-block;\n        background-color: #1f1f1f;\n        color: #fff;\n        font-size: 26px;\n        border: solid 1px #565656;\n        width: 31px;\n        border-top: none;\n        border-bottom: none;\n        text-align: center;\n        cursor: pointer;\n        transition: all .3s linear;\n    }\n\n    #threadsControll .button:hover{\n        background-color: #000;\n        transition: all .3s linear;\n    }\n\n    #threadsControll .button:first-child{\n        margin-top: 0;\n    }\n\n    #threadsNumber{\n        font-size: 20px;\n        padding: 0 10px;\n        text-align: center;\n        padding-bottom: 8px;\n        line-height: 25px;\n        display: inline-block;\n        color: #fff;\n        background-color: #d23c25;\n        vertical-align: top;\n        padding-top: 6px;\n        border-right: solid 1px #3a3939;\n        width: 40px;\n        padding-left: 0;\n        padding-right:0;\n    }\n\n    .whiteText{\n        color: #c5c5c5;\n        font-weight: 100;\n        margin-left: 5px;\n    }\n\n    #minningController{\n        width: 100%;\n        border-top:none;\n        padding-bottom: 0;\n        margin-bottom: 15px;\n        display: inline-block;\n        vertical-align: top;\n    }\n\n    #createWalletAddress{\n        border: solid 1px #7b7b7b;\n        padding-bottom: 0;\n        margin-bottom: 15px;\n        display: inline-block;\n    }\n\n    #createWalletAddress p:hover{\n        background-color: #191919;\n        transition: all .3s linear;\n    }\n\n    #createWalletAddress p{\n        padding: 10px;\n        padding-top: 14px;\n        background-color: #353535;\n        color: #bbb;\n        display: inline-block;\n        width: 214px;\n        cursor: pointer;\n        text-align: center;\n        transition: all .3s linear;\n    }\n\n    .WEBD{\n        display: inline-block;\n        margin-left: 20px;\n        font-size: 20px;\n        color: #fec02c;\n        vertical-align: top;\n        margin-top: 0;\n        float: right;\n        min-width: 300px;\n        text-align: center;\n        border-left: solid 1px #333;\n        line-height: 42px;\n    }\n\n    #miningDetails p{\n        display: inline-block;\n    }\n\n    .miningBar{\n        display: inline-block;\n        width: 330px;\n        margin-left: 0;\n    }\n\n    .miningLoader{\n        margin-top: 5px;\n    }\n\n    .showSumBallance{\n        vertical-align: top;\n        display: inline-block;\n    }\n\n    @media only screen and (max-width : 831px) {\n\n        .hoverBalanceInfo{\n            display: none;\n        }\n\n        .miningBar{\n            padding: 4px 0px;\n        }\n\n        .show-balance-span{\n            font-size: 20px;\n        }\n\n        #dashboardMining{\n            margin-bottom: 0;\n        }\n        #minningController, .walletStartMining, .WEBD{\n            display: inline-block;\n            width: 100%;\n        }\n        #minningController{\n            background-color: #0000;\n            margin-bottom: 0;\n            height: 33px;\n            border-top: none;\n            margin-top: 50px;\n        }\n        #threadsControll .button p{\n            line-height: 43px;\n        }\n        #threadsControll .button{\n            width: 80px;\n        }\n        .miningPowerThreads{\n            line-height: 38px;\n            font-size: 16px;\n            margin-right: -4px;\n        }\n        #miningDetails{\n            line-height: 41px;\n            color: #969696;\n            float: right;\n            margin-right: 15px;\n        }\n        .miningPowerText{\n            display: none;\n        }\n        #threadsNumber{\n            margin: 0 auto;\n            text-align: center;\n            float:left;\n            position: relative;\n            display: block;\n            line-height: 34px;\n            width: 35px;\n            padding-top: 6px;\n            padding-left: 0;\n        }\n        .WEBD{\n            text-align: right;\n            margin-right: 10px;\n            min-width: auto;\n            width: auto;\n            border:none;\n            line-height: 42px;\n            display: none;\n        }\n        .miningPowerThreads{\n            display:none;\n        }\n        #threadsControll .button{\n            float:left;\n        }\n        .walletStartMining{\n            margin-top:-29px;\n        }\n        #threadsControll{\n            background-color: #f200;\n        }\n        #threadsControll .button p {\n            line-height: 35px;\n            font-size: 35px;\n            padding-top: 7px;\n        }\n        #threadsControll .button:first-child{\n            border:none;\n        }\n        #minningController{\n            margin-top:0\n        }\n        #dashboardMining{\n            height:40px;\n        }\n        .walletStartMining:hover{\n            background-color: #f200;\n        }\n\n        #walletButton span{\n            width: auto!important;\n            color: #000;\n            margin-left: 10px;\n        }\n\n    }\n\n        @media only screen and (max-width : 600px) {\n\n            .whiteText{\n                display: none;\n            }\n\n        }\n\n        @media only screen and (max-width : 500px) {\n\n        .miningBar{\n            width: 50%;\n        }\n\n\n    }\n\n</style>\n\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_slider_vue__ = __webpack_require__(34);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2b39a900_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_slider_vue__ = __webpack_require__(106);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(103)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_slider_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2b39a900_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_slider_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Mining/slider.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b39a900", Component.options)
  } else {
    hotAPI.reload("data-v-2b39a900", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(104);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("539512a0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b39a900\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./slider.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b39a900\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./slider.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.miningSlider {\n    padding-top: 15px !important;\n    padding-bottom: 15px !important;\n    padding-left: 20px !important;\n    background-color: #262626;\n}\n.vue-slider-component .vue-slider-piecewise {\n    background-color: #424242 !important;\n}\n.vue-slider-component .vue-slider-process {\n    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fec02c+29,bc0505+100 */\n    background: #fec02c !important; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n    background: linear-gradient(to right, #fec02c 29%, #bc0505 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fec02c', endColorstr='#bc0505', GradientType=1) !important; /* IE6-9 */\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Mining/src/components/Mining/slider.vue"],"names":[],"mappings":";AAiGA;IACA,6BAAA;IACA,gCAAA;IACA,8BAAA;IACA,0BAAA;CACA;AAEA;IACA,qCAAA;CACA;AAEA;IACA,kHAAA;IACA,+BAAA,CAAA,kBAAA,CACA,cAAA,CACA,6BAAA;IACA,4EAAA,CAAA,sDAAA;IACA,8HAAA,CAAA,WAAA;CACA","file":"slider.vue","sourcesContent":["<template>\n    <div>\n        <vue-slider id=\"miningWorkersSlider\" class=\"miningSlider\" ref=\"slider\" @callback=\"this.change\" :piecewise=\"true\"\n                    :width=\"this.screenWidth < 750 ? this.sliderMobileWidth : 330\" :tooltip=\"false\" :min=\"0\" :max=\"this.logicalProcessors\"\n                    v-model=\"value\" :disabled=\"this.disabled\"></vue-slider>\n    </div>\n</template>\n\n\n<script>\n\n    import vueSlider from 'vue-slider-component';\n\n    export default {\n\n        name: 'slider',\n\n        components: {\n            \"vueSlider\": vueSlider\n        },\n\n        data() {\n            return {\n                value: localStorage.getItem(\"miner-settings-worker-count\") || 0,\n                disabled:true,\n                screenWidth: window.innerWidth,\n                logicalProcessors: window.navigator.hardwareConcurrency === undefined ? 4 : window.navigator.hardwareConcurrency * 1,\n                sliderMobileWidth: 200,\n                disableHalving: false,\n            }\n        },\n\n        methods: {\n            change(value) {\n\n                console.log(\"value\", value);\n\n                //TODO use halver\n\n//                if (this.disableHalving)\n//                    this.$refs['slider'].setValue(value);\n//                else\n//                    if (value > (this.value||1) *3){\n//\n//                        value = (this.value||1) *3;\n//                        this.$refs['slider'].setValue(value);\n//                        return;\n//\n//                    }\n\n                this.$emit('sliderChanged', value);\n            },\n            addEvent(object, type, callback) {\n                if (object === null || typeof(object) === 'undefined') return;\n                if (object.addEventListener) {\n                    object.addEventListener(type, callback, false);\n                } else if (object.attachEvent) {\n                    object.attachEvent(\"on\" + type, callback);\n                } else {\n                    object[\"on\" + type] = callback;\n                }\n            },\n        },\n\n        mounted() {\n\n            if (typeof window === \"undefined\") return false;\n\n            this.addEvent(window, \"resize\", (event) => {\n\n                this.screenWidth = window.innerWidth;\n\n                if (window.innerWidth<550){\n                    this.sliderMobileWidth = window.innerWidth-180+'px';\n                }else{\n                    this.sliderMobileWidth = '100%';\n                }\n\n            });\n\n            this.screenWidth = window.innerWidth;\n            if (window.innerWidth<550){\n                this.sliderMobileWidth = window.innerWidth-180+'px';\n            }else{\n                this.sliderMobileWidth = '100%';\n            }\n\n            this.logicalProcessors = window.navigator.hardwareConcurrency === undefined ? 4 : window.navigator.hardwareConcurrency * 1;\n\n            this.$refs[\"slider\"].refresh();\n\n\n        }\n    }\n</script>\n\n<style>\n\n    .miningSlider {\n        padding-top: 15px !important;\n        padding-bottom: 15px !important;\n        padding-left: 20px !important;\n        background-color: #262626;\n    }\n\n    .vue-slider-component .vue-slider-piecewise {\n        background-color: #424242 !important;\n    }\n\n    .vue-slider-component .vue-slider-process {\n        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fec02c+29,bc0505+100 */\n        background: #fec02c !important; /* Old browsers */\n        background: -moz-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* FF3.6-15 */\n        background: -webkit-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* Chrome10-25,Safari5.1-6 */\n        background: linear-gradient(to right, #fec02c 29%, #bc0505 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fec02c', endColorstr='#bc0505', GradientType=1) !important; /* IE6-9 */\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define("vue-slider-component",[],e):"object"==typeof exports?exports["vue-slider-component"]=e():t["vue-slider-component"]=e()}(this,function(){return function(t){function e(s){if(i[s])return i[s].exports;var r=i[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var i={};return e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,i){i(7);var s=i(5)(i(1),i(6),null,null);t.exports=s.exports},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"VueSliderComponent",data:function(){return{flag:!1,size:0,currentValue:0,currentSlider:0}},props:{width:{type:[Number,String],default:"auto"},height:{type:[Number,String],default:6},data:{type:Array,default:null},dotSize:{type:Number,default:16},dotWidth:{type:Number,required:!1},dotHeight:{type:Number,required:!1},min:{type:Number,default:0},max:{type:Number,default:100},interval:{type:Number,default:1},show:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1},piecewise:{type:Boolean,default:!1},tooltip:{type:[String,Boolean],default:"always"},eventType:{type:String,default:"auto"},direction:{type:String,default:"horizontal"},reverse:{type:Boolean,default:!1},lazy:{type:Boolean,default:!1},clickable:{type:Boolean,default:!0},speed:{type:Number,default:.5},realTime:{type:Boolean,default:!1},stopPropagation:{type:Boolean,default:!1},value:{type:[String,Number,Array],default:0},piecewiseLabel:{type:Boolean,default:!1},sliderStyle:[Array,Object,Function],tooltipDir:[Array,String],formatter:[String,Function],piecewiseStyle:Object,piecewiseActiveStyle:Object,processStyle:Object,bgStyle:Object,tooltipStyle:[Array,Object,Function],labelStyle:Object,labelActiveStyle:Object},computed:{dotWidthVal:function(){return"number"==typeof this.dotWidth?this.dotWidth:this.dotSize},dotHeightVal:function(){return"number"==typeof this.dotHeight?this.dotHeight:this.dotSize},flowDirection:function(){return"vue-slider-"+this.direction+(this.reverse?"-reverse":"")},tooltipDirection:function(){var t=this.tooltipDir||("vertical"===this.direction?"left":"top");return Array.isArray(t)?this.isRange?t:t[1]:this.isRange?[t,t]:t},tooltipStatus:function(){return"hover"===this.tooltip&&this.flag?"vue-slider-always":this.tooltip?"vue-slider-"+this.tooltip:""},tooltipClass:function(){return["vue-slider-tooltip-"+this.tooltipDirection,"vue-slider-tooltip"]},isDisabled:function(){return"none"===this.eventType||this.disabled},disabledClass:function(){return this.disabled?"vue-slider-disabled":""},isRange:function(){return Array.isArray(this.value)},slider:function(){return this.isRange?[this.$refs.dot0,this.$refs.dot1]:this.$refs.dot},minimum:function(){return this.data?0:this.min},val:{get:function(){return this.data?this.isRange?[this.data[this.currentValue[0]],this.data[this.currentValue[1]]]:this.data[this.currentValue]:this.currentValue},set:function(t){if(this.data)if(this.isRange){var e=this.data.indexOf(t[0]),i=this.data.indexOf(t[1]);e>-1&&i>-1&&(this.currentValue=[e,i])}else{var s=this.data.indexOf(t);s>-1&&(this.currentValue=s)}else this.currentValue=t}},currentIndex:function(){return this.isRange?this.data?this.currentValue:[(this.currentValue[0]-this.minimum)/this.spacing,(this.currentValue[1]-this.minimum)/this.spacing]:(this.currentValue-this.minimum)/this.spacing},indexRange:function(){return this.isRange?this.currentIndex:[0,this.currentIndex]},maximum:function(){return this.data?this.data.length-1:this.max},multiple:function(){var t=(""+this.interval).split(".")[1];return t?Math.pow(10,t.length):1},spacing:function(){return this.data?1:this.interval},total:function(){return this.data?this.data.length-1:(~~((this.maximum-this.minimum)*this.multiple)%(this.interval*this.multiple)!=0&&console.error("[Vue-slider warn]: Prop[interval] is illegal, Please make sure that the interval can be divisible"),(this.maximum-this.minimum)/this.interval)},gap:function(){return this.size/this.total},position:function(){return this.isRange?[(this.currentValue[0]-this.minimum)/this.spacing*this.gap,(this.currentValue[1]-this.minimum)/this.spacing*this.gap]:(this.currentValue-this.minimum)/this.spacing*this.gap},limit:function(){return this.isRange?[[0,this.position[1]],[this.position[0],this.size]]:[0,this.size]},valueLimit:function(){return this.isRange?[[this.minimum,this.currentValue[1]],[this.currentValue[0],this.maximum]]:[this.minimum,this.maximum]},wrapStyles:function(){return"vertical"===this.direction?{height:"number"==typeof this.height?this.height+"px":this.height,padding:this.dotHeightVal/2+"px "+this.dotWidthVal/2+"px"}:{width:"number"==typeof this.width?this.width+"px":this.width,padding:this.dotHeightVal/2+"px "+this.dotWidthVal/2+"px"}},sliderStyles:function(){return Array.isArray(this.sliderStyle)?this.isRange?this.sliderStyle:this.sliderStyle[1]:"function"==typeof this.sliderStyle?this.sliderStyle(this.val,this.currentIndex):this.isRange?[this.sliderStyle,this.sliderStyle]:this.sliderStyle},tooltipStyles:function(){return Array.isArray(this.tooltipStyle)?this.isRange?this.tooltipStyle:this.tooltipStyle[1]:"function"==typeof this.tooltipStyle?this.tooltipStyle(this.val,this.currentIndex):this.isRange?[this.tooltipStyle,this.tooltipStyle]:this.tooltipStyle},elemStyles:function(){return"vertical"===this.direction?{width:this.width+"px",height:"100%"}:{height:this.height+"px"}},dotStyles:function(){return"vertical"===this.direction?{width:this.dotWidthVal+"px",height:this.dotHeightVal+"px",left:-(this.dotWidthVal-this.width)/2+"px"}:{width:this.dotWidthVal+"px",height:this.dotHeightVal+"px",top:-(this.dotHeightVal-this.height)/2+"px"}},piecewiseDotStyle:function(){return"vertical"===this.direction?{width:this.width+"px",height:this.width+"px"}:{width:this.height+"px",height:this.height+"px"}},piecewiseDotWrap:function(){if(!this.piecewise&&!this.piecewiseLabel)return!1;for(var t=[],e=0;e<=this.total;e++){var i="vertical"===this.direction?{bottom:this.gap*e-this.width/2+"px",left:0}:{left:this.gap*e-this.height/2+"px",top:0},s=this.reverse?this.total-e:e,r=this.data?this.data[s]:this.spacing*s+this.min;t.push({style:i,label:this.formatter?this.formatting(r):r,inRange:s>=this.indexRange[0]&&s<=this.indexRange[1]})}return t}},watch:{value:function(t){this.flag||this.setValue(t,!0)},max:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},min:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},show:function(t){var e=this;t&&!this.size&&this.$nextTick(function(){e.refresh()})}},methods:{bindEvents:function(){document.addEventListener("touchmove",this.moving,{passive:!1}),document.addEventListener("touchend",this.moveEnd,{passive:!1}),document.addEventListener("mousemove",this.moving),document.addEventListener("mouseup",this.moveEnd),document.addEventListener("mouseleave",this.moveEnd),window.addEventListener("resize",this.refresh)},unbindEvents:function(){window.removeEventListener("resize",this.refresh),document.removeEventListener("touchmove",this.moving),document.removeEventListener("touchend",this.moveEnd),document.removeEventListener("mousemove",this.moving),document.removeEventListener("mouseup",this.moveEnd),document.removeEventListener("mouseleave",this.moveEnd)},formatting:function(t){return"string"==typeof this.formatter?this.formatter.replace(/\{value\}/,t):this.formatter(t)},getPos:function(t){return this.realTime&&this.getStaticData(),"vertical"===this.direction?this.reverse?t.pageY-this.offset:this.size-(t.pageY-this.offset):this.reverse?this.size-(t.clientX-this.offset):t.clientX-this.offset},wrapClick:function(t){if(this.isDisabled||!this.clickable)return!1;var e=this.getPos(t);this.isRange&&(this.currentSlider=e>(this.position[1]-this.position[0])/2+this.position[0]?1:0),this.setValueOnPos(e)},moveStart:function(t,e){if(this.stopPropagation&&t.stopPropagation(),this.isDisabled)return!1;this.isRange&&(this.currentSlider=e),this.flag=!0,this.$emit("drag-start",this)},moving:function(t){if(this.stopPropagation&&t.stopPropagation(),!this.flag)return!1;t.preventDefault(),t.targetTouches&&t.targetTouches[0]&&(t=t.targetTouches[0]),this.setValueOnPos(this.getPos(t),!0)},moveEnd:function(t){if(this.stopPropagation&&t.stopPropagation(),!this.flag)return!1;this.$emit("drag-end",this),this.lazy&&this.isDiff(this.val,this.value)&&this.syncValue(),this.flag=!1,this.setPosition()},setValueOnPos:function(t,e){var i=this.isRange?this.limit[this.currentSlider]:this.limit,s=this.isRange?this.valueLimit[this.currentSlider]:this.valueLimit;if(t>=i[0]&&t<=i[1]){this.setTransform(t);var r=(Math.round(t/this.gap)*(this.spacing*this.multiple)+this.minimum*this.multiple)/this.multiple;this.setCurrentValue(r,e)}else t<i[0]?(this.setTransform(i[0]),this.setCurrentValue(s[0]),1===this.currentSlider&&(this.currentSlider=0)):(this.setTransform(i[1]),this.setCurrentValue(s[1]),0===this.currentSlider&&(this.currentSlider=1))},isDiff:function(t,e){return Object.prototype.toString.call(t)!==Object.prototype.toString.call(e)||(Array.isArray(t)&&t.length===e.length?t.some(function(t,i){return t!==e[i]}):t!==e)},setCurrentValue:function(t,e){if(t<this.minimum||t>this.maximum)return!1;this.isRange?this.isDiff(this.currentValue[this.currentSlider],t)&&(this.currentValue.splice(this.currentSlider,1,t),this.lazy&&this.flag||this.syncValue()):this.isDiff(this.currentValue,t)&&(this.currentValue=t,this.lazy&&this.flag||this.syncValue()),e||this.setPosition()},setIndex:function(t){if(Array.isArray(t)&&this.isRange){var e=void 0;e=this.data?[this.data[t[0]],this.data[t[1]]]:[this.spacing*t[0]+this.minimum,this.spacing*t[1]+this.minimum],this.setValue(e)}else t=this.spacing*t+this.minimum,this.isRange&&(this.currentSlider=t>(this.currentValue[1]-this.currentValue[0])/2+this.currentValue[0]?1:0),this.setCurrentValue(t)},setValue:function(t,e,i){var s=this;if(this.isDiff(this.val,t)){var r=this.limitValue(t);this.val=!1!==r?this.isRange?r.concat():r:this.isRange?t.concat():t,this.syncValue(e)}this.$nextTick(function(){return s.setPosition(i)})},setPosition:function(t){this.flag||this.setTransitionTime(void 0===t?this.speed:t),this.isRange?(this.currentSlider=0,this.setTransform(this.position[this.currentSlider]),this.currentSlider=1,this.setTransform(this.position[this.currentSlider])):this.setTransform(this.position),this.flag||this.setTransitionTime(0)},setTransform:function(t){var e=("vertical"===this.direction?this.dotHeightVal/2-t:t-this.dotWidthVal/2)*(this.reverse?-1:1),i="vertical"===this.direction?"translateY("+e+"px)":"translateX("+e+"px)",s=(0===this.currentSlider?this.position[1]-t:t-this.position[0])+"px",r=(0===this.currentSlider?t:this.position[0])+"px";this.isRange?(this.slider[this.currentSlider].style.transform=i,this.slider[this.currentSlider].style.WebkitTransform=i,this.slider[this.currentSlider].style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=s,this.$refs.process.style[this.reverse?"top":"bottom"]=r):(this.$refs.process.style.width=s,this.$refs.process.style[this.reverse?"right":"left"]=r)):(this.slider.style.transform=i,this.slider.style.WebkitTransform=i,this.slider.style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=t+"px",this.$refs.process.style[this.reverse?"top":"bottom"]=0):(this.$refs.process.style.width=t+"px",this.$refs.process.style[this.reverse?"right":"left"]=0))},setTransitionTime:function(t){if(t||this.$refs.process.offsetWidth,this.isRange){for(var e=0;e<this.slider.length;e++)this.slider[e].style.transitionDuration=t+"s",this.slider[e].style.WebkitTransitionDuration=t+"s";this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"}else this.slider.style.transitionDuration=t+"s",this.slider.style.WebkitTransitionDuration=t+"s",this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"},limitValue:function(t){var e=this;if(this.data)return t;var i=!1;return this.isRange?t=t.map(function(t){return t<e.min?(i=!0,e.min):t>e.max?(i=!0,e.max):t}):t>this.max?(i=!0,t=this.max):t<this.min&&(i=!0,t=this.min),i&&t},syncValue:function(t){t||this.$emit("callback",this.val),this.$emit("input",this.isRange?this.val.concat():this.val)},getValue:function(){return this.val},getIndex:function(){return this.currentIndex},getStaticData:function(){this.$refs.elem&&(this.size="vertical"===this.direction?this.$refs.elem.offsetHeight:this.$refs.elem.offsetWidth,this.offset="vertical"===this.direction?this.$refs.elem.getBoundingClientRect().top+window.pageYOffset||document.documentElement.scrollTop:this.$refs.elem.getBoundingClientRect().left)},refresh:function(){this.$refs.elem&&(this.getStaticData(),this.setPosition())}},mounted:function(){var t=this;"undefined"!=typeof window&&"undefined"!=typeof document&&this.$nextTick(function(){t.getStaticData(),t.setValue(t.value,!0,0),t.bindEvents()})},beforeDestroy:function(){this.unbindEvents()}}},function(t,e,i){"use strict";var s=i(0);t.exports=s},function(t,e,i){e=t.exports=i(4)(),e.push([t.i,'.vue-slider-component{position:relative;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.vue-slider-component.vue-slider-disabled{opacity:.5;cursor:not-allowed}.vue-slider-component.vue-slider-has-label{margin-bottom:15px}.vue-slider-component.vue-slider-disabled .vue-slider-dot{cursor:not-allowed}.vue-slider-component .vue-slider{position:relative;display:block;border-radius:15px;background-color:#ccc}.vue-slider-component .vue-slider:after{content:"";position:absolute;left:0;top:0;width:100%;height:100%;z-index:2}.vue-slider-component .vue-slider-process{position:absolute;border-radius:15px;background-color:#3498db;transition:all 0s;z-index:1}.vue-slider-component.vue-slider-horizontal .vue-slider-process{width:0;height:100%;top:0;left:0;will-change:width}.vue-slider-component.vue-slider-vertical .vue-slider-process{width:100%;height:0;bottom:0;left:0;will-change:height}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-process{width:0;height:100%;top:0;right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-process{width:100%;height:0;top:0;left:0}.vue-slider-component .vue-slider-dot{position:absolute;border-radius:50%;background-color:#fff;box-shadow:.5px .5px 2px 1px rgba(0,0,0,.32);transition:all 0s;will-change:transform;cursor:pointer;z-index:3}.vue-slider-component.vue-slider-horizontal .vue-slider-dot{left:0}.vue-slider-component.vue-slider-vertical .vue-slider-dot{bottom:0}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-dot{right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-dot{top:0}.vue-slider-component .vue-slider-tooltip-wrap{display:none;position:absolute;z-index:9}.vue-slider-component .vue-slider-tooltip{display:block;font-size:14px;white-space:nowrap;padding:2px 5px;min-width:20px;text-align:center;color:#fff;border-radius:5px;border:1px solid #3498db;background-color:#3498db}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top{top:-9px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom{bottom:-9px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left{top:50%;left:-9px;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right{top:50%;right:-9px;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top .vue-slider-tooltip:before{content:"";position:absolute;bottom:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-top-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip:before{content:"";position:absolute;top:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-bottom-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left .vue-slider-tooltip:before{content:"";position:absolute;top:50%;right:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-left-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right .vue-slider-tooltip:before{content:"";position:absolute;top:50%;left:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-right-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-dot.vue-slider-hover:hover .vue-slider-tooltip-wrap{display:block}.vue-slider-component .vue-slider-dot.vue-slider-always .vue-slider-tooltip-wrap{display:block!important}.vue-slider-component .vue-slider-piecewise{position:absolute;width:100%;padding:0;margin:0;left:0;top:0;height:100%;list-style:none}.vue-slider-component .vue-slider-piecewise-item{position:absolute;width:8px;height:8px}.vue-slider-component .vue-slider-piecewise-dot{position:absolute;left:50%;top:50%;width:100%;height:100%;display:inline-block;background-color:rgba(0,0,0,.16);border-radius:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:2;transition:all .3s}.vue-slider-component .vue-slider-piecewise-item:first-child .vue-slider-piecewise-dot,.vue-slider-component .vue-slider-piecewise-item:last-child .vue-slider-piecewise-dot{visibility:hidden}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-horizontal .vue-slider-piecewise-label{position:absolute;display:inline-block;top:100%;left:50%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(-50%,8px);transform:translate(-50%,8px);visibility:visible}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-vertical .vue-slider-piecewise-label{position:absolute;display:inline-block;top:50%;left:100%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(8px,-50%);transform:translate(8px,-50%);visibility:visible}.vue-slider-component .vue-slider-sr-only{clip:rect(1px,1px,1px,1px);height:1px;width:1px;overflow:hidden;position:absolute!important}',""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var i=this[e];i[2]?t.push("@media "+i[2]+"{"+i[1]+"}"):t.push(i[1])}return t.join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var s={},r=0;r<this.length;r++){var n=this[r][0];"number"==typeof n&&(s[n]=!0)}for(r=0;r<e.length;r++){var o=e[r];"number"==typeof o[0]&&s[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(t,e){t.exports=function(t,e,i,s){var r,n=t=t||{},o=typeof t.default;"object"!==o&&"function"!==o||(r=t,n=t.default);var l="function"==typeof n?n.options:n;if(e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns),i&&(l._scopeId=i),s){var a=Object.create(l.computed||null);Object.keys(s).forEach(function(t){var e=s[t];a[t]=function(){return e}}),l.computed=a}return{esModule:r,exports:n,options:l}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],ref:"wrap",class:["vue-slider-component",t.flowDirection,t.disabledClass,{"vue-slider-has-label":t.piecewiseLabel}],style:t.wrapStyles,on:{click:t.wrapClick}},[i("div",{ref:"elem",staticClass:"vue-slider",style:[t.elemStyles,t.bgStyle],attrs:{"aria-hidden":"true"}},[t.isRange?[i("div",{ref:"dot0",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[0]],on:{mousedown:function(e){t.moveStart(e,0)},touchstart:function(e){t.moveStart(e,0)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[0],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[0]},[t._v(t._s(t.formatter?t.formatting(t.val[0]):t.val[0]))])],{value:t.val[0],index:0})],2)]),t._v(" "),i("div",{ref:"dot1",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[1]],on:{mousedown:function(e){t.moveStart(e,1)},touchstart:function(e){t.moveStart(e,1)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[1],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[1]},[t._v(t._s(t.formatter?t.formatting(t.val[1]):t.val[1]))])],{value:t.val[1],index:1})],2)])]:[i("div",{ref:"dot",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles],on:{mousedown:t.moveStart,touchstart:t.moveStart}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection,"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles},[t._v(t._s(t.formatter?t.formatting(t.val):t.val))])],{value:t.val})],2)])],t._v(" "),i("ul",{staticClass:"vue-slider-piecewise"},t._l(t.piecewiseDotWrap,function(e,s){return i("li",{key:s,staticClass:"vue-slider-piecewise-item",style:[t.piecewiseDotStyle,e.style]},[t._t("piecewise",[t.piecewise?i("span",{staticClass:"vue-slider-piecewise-dot",style:[t.piecewiseStyle,e.inRange?t.piecewiseActiveStyle:null]}):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1,active:e.inRange}),t._v(" "),t._t("label",[t.piecewiseLabel?i("span",{staticClass:"vue-slider-piecewise-label",style:[t.labelStyle,e.inRange?t.labelActiveStyle:null]},[t._v("\n            "+t._s(e.label)+"\n          ")]):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1,active:e.inRange})],2)})),t._v(" "),i("div",{ref:"process",staticClass:"vue-slider-process",style:t.processStyle})],2),t._v(" "),t.isRange||t.data?t._e():i("input",{directives:[{name:"model",rawName:"v-model",value:t.val,expression:"val"}],staticClass:"vue-slider-sr-only",attrs:{type:"range",min:t.min,max:t.max},domProps:{value:t.val},on:{__r:function(e){t.val=e.target.value}}})])},staticRenderFns:[]}},function(t,e,i){var s=i(3);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);i(8)("743d98f5",s,!0)},function(t,e,i){function s(t){for(var e=0;e<t.length;e++){var i=t[e],s=h[i.id];if(s){s.refs++;for(var r=0;r<s.parts.length;r++)s.parts[r](i.parts[r]);for(;r<i.parts.length;r++)s.parts.push(n(i.parts[r]));s.parts.length>i.parts.length&&(s.parts.length=i.parts.length)}else{for(var o=[],r=0;r<i.parts.length;r++)o.push(n(i.parts[r]));h[i.id]={id:i.id,refs:1,parts:o}}}}function r(){var t=document.createElement("style");return t.type="text/css",d.appendChild(t),t}function n(t){var e,i,s=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(s){if(f)return v;s.parentNode.removeChild(s)}if(m){var n=c++;s=p||(p=r()),e=o.bind(null,s,n,!1),i=o.bind(null,s,n,!0)}else s=r(),e=l.bind(null,s),i=function(){s.parentNode.removeChild(s)};return e(t),function(s){if(s){if(s.css===t.css&&s.media===t.media&&s.sourceMap===t.sourceMap)return;e(t=s)}else i()}}function o(t,e,i,s){var r=i?"":s.css;if(t.styleSheet)t.styleSheet.cssText=g(e,r);else{var n=document.createTextNode(r),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(n,o[e]):t.appendChild(n)}}function l(t,e){var i=e.css,s=e.media,r=e.sourceMap;if(s&&t.setAttribute("media",s),r&&(i+="\n/*# sourceURL="+r.sources[0]+" */",i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}var a="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!a)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var u=i(9),h={},d=a&&(document.head||document.getElementsByTagName("head")[0]),p=null,c=0,f=!1,v=function(){},m="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());t.exports=function(t,e,i){f=i;var r=u(t,e);return s(r),function(e){for(var i=[],n=0;n<r.length;n++){var o=r[n],l=h[o.id];l.refs--,i.push(l)}e?(r=u(t,e),s(r)):r=[];for(var n=0;n<i.length;n++){var l=i[n];if(0===l.refs){for(var a=0;a<l.parts.length;a++)l.parts[a]();delete h[l.id]}}}};var g=function(){var t=[];return function(e,i){return t[e]=i,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t,e){for(var i=[],s={},r=0;r<e.length;r++){var n=e[r],o=n[0],l=n[1],a=n[2],u=n[3],h={id:t+":"+r,css:l,media:a,sourceMap:u};s[o]?s[o].parts.push(h):i.push(s[o]={id:o,parts:[h]})}return i}}])});

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("vue-slider", {
        ref: "slider",
        staticClass: "miningSlider",
        attrs: {
          id: "miningWorkersSlider",
          piecewise: true,
          width: this.screenWidth < 750 ? this.sliderMobileWidth : 330,
          tooltip: false,
          min: 0,
          max: this.logicalProcessors,
          disabled: this.disabled
        },
        on: { callback: this.change },
        model: {
          value: _vm.value,
          callback: function($$v) {
            _vm.value = $$v
          },
          expression: "value"
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2b39a900", esExports)
  }
}

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "walletSection", attrs: { id: "dashboardMining" } },
    [
      _c("div", { attrs: { id: "minningController" } }, [
        _vm._m(0),
        _c(
          "strong",
          {
            style: { background: this.workers ? 0 : "#d23c25" },
            attrs: { id: "threadsNumber" }
          },
          [_vm._v(_vm._s(this.workers))]
        ),
        _c(
          "div",
          { staticClass: "miningBar", attrs: { type: "button" } },
          [
            _c("slider", {
              ref: "refMiningSlider",
              on: { sliderChanged: this.changeWorkers }
            })
          ],
          1
        ),
        _c("div", { attrs: { id: "miningDetails" } }, [
          _c(
            "p",
            {
              style: {
                display:
                  this.hashesPerSecond == 0 && this.started == true
                    ? "none"
                    : "inline-block"
              }
            },
            [
              _vm._v(
                _vm._s(
                  this.started
                    ? this.hashesPerSecond + " hash/sec"
                    : "not started"
                ) + " "
              )
            ]
          ),
          _c(
            "svg",
            {
              staticStyle: { "enable-background": "new 0 0 50 50" },
              style: {
                display:
                  this.hashesPerSecond == 0 && this.started == true
                    ? "inline-block"
                    : "none"
              },
              attrs: {
                version: "1.1",
                id: "miningLoader",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                x: "0px",
                y: "0px",
                width: "40px",
                height: "40px",
                viewBox: "0 0 50 50",
                "xml:space": "preserve"
              }
            },
            [
              _c(
                "path",
                {
                  attrs: {
                    fill: "#fec02c",
                    d:
                      "M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                  }
                },
                [
                  _c("animateTransform", {
                    attrs: {
                      attributeType: "xml",
                      attributeName: "transform",
                      type: "rotate",
                      from: "0 25 25",
                      to: "360 25 25",
                      dur: "0.6s",
                      repeatCount: "indefinite"
                    }
                  })
                ],
                1
              )
            ]
          )
        ]),
        _c(
          "p",
          { staticClass: "WEBD" },
          [
            _c(
              "svg",
              {
                staticClass: "miningLoader",
                staticStyle: { "enable-background": "new 0 0 50 50" },
                style: {
                  display: this.loaded == false ? "inline-block" : "none"
                },
                attrs: {
                  version: "1.1",
                  id: "miningLoader",
                  xmlns: "http://www.w3.org/2000/svg",
                  "xmlns:xlink": "http://www.w3.org/1999/xlink",
                  x: "0px",
                  y: "0px",
                  width: "40px",
                  height: "40px",
                  viewBox: "0 0 50 50",
                  "xml:space": "preserve"
                }
              },
              [
                _c(
                  "path",
                  {
                    attrs: {
                      fill: "#fec02c",
                      d:
                        "M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                    }
                  },
                  [
                    _c("animateTransform", {
                      attrs: {
                        attributeType: "xml",
                        attributeName: "transform",
                        type: "rotate",
                        from: "0 25 25",
                        to: "360 25 25",
                        dur: "0.6s",
                        repeatCount: "indefinite"
                      }
                    })
                  ],
                  1
                )
              ]
            ),
            _c("show-sum-balances", {
              ref: "refShowSumBalances",
              staticClass: "showSumBallance",
              style: {
                display: this.loaded == false ? "none" : "inline-block"
              },
              attrs: {
                showPoolReward: true,
                addresses: this.addresses,
                currency: this.currency
              }
            }),
            _c("b", { staticClass: "whiteText" }, [_vm._v("WEBD")])
          ],
          1
        ),
        _c("div", { staticClass: "hoverBalanceInfo" }, [
          _c("div", { staticClass: "balanceText" }, [
            _c(
              "div",
              {
                staticClass: "balanceTitle helpCursor",
                attrs: { title: "Balance available to be spent" }
              },
              [
                _vm._v(
                  "\n                        Available Balance:\n                    "
                )
              ]
            ),
            _c(
              "div",
              {
                staticClass: "balanceAmount helpCursor",
                attrs: { title: "Balance available to be spent" }
              },
              [
                _c("show-sum-balances", {
                  ref: "refShowSumAvailableBalances",
                  attrs: { addresses: this.addresses, currency: this.currency }
                })
              ],
              1
            ),
            _c(
              "div",
              {
                staticClass: "balanceTitle helpCursor",
                staticStyle: { "letter-spacing": "0.1px" },
                attrs: {
                  title:
                    "The balance you will have at the next block mined by your pool"
                }
              },
              [
                _vm._v(
                  "\n                        Potential Balance:\n                    "
                )
              ]
            ),
            _c(
              "div",
              {
                staticClass: "balanceAmount helpCursor",
                attrs: {
                  title:
                    "The balance you will have at the next block mined by your pool"
                }
              },
              [
                _c("show-sum-balances", {
                  ref: "refShowSumPotentialBalances",
                  attrs: {
                    showPoolReward: true,
                    addresses: this.addresses,
                    currency: this.currency
                  }
                })
              ],
              1
            )
          ])
        ]),
        _c("p")
      ])
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "miningPowerText" }, [
      _vm._v("Mining "),
      _c("br"),
      _c("span", { staticClass: "secondWord" }, [_vm._v("Power")])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0954b78f", esExports)
  }
}

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "webDollar" } },
    [
      _c("mining", {
        ref: "refMining",
        attrs: {
          startAutomatically: _vm.startAutomatically,
          addresses: this.addresses,
          currency: this.currency
        }
      }),
      _c("wallet", {
        ref: "refWallet",
        attrs: { addresses: this.addresses, currency: this.currency }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-aae30ed8", esExports)
  }
}

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(7));
	else if(typeof define === 'function' && define.amd)
		define(["vue"], factory);
	else if(typeof exports === 'object')
		exports["vue-notification"] = factory(require("vue"));
	else
		root["vue-notification"] = factory(root["vue"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_20__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return events; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);

var events = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a();

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Notifications_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Notifications_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Notifications_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__events__ = __webpack_require__(1);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };




var Notify = {
  install: function install(Vue) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this.installed) {
      return;
    }

    this.installed = true;
    this.params = params;

    Vue.component('notifications', __WEBPACK_IMPORTED_MODULE_0__Notifications_vue___default.a);

    var notify = function notify(params) {
      if (typeof params === 'string') {
        params = { title: '', text: params };
      }

      if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
        __WEBPACK_IMPORTED_MODULE_1__events__["a" /* events */].$emit('add', params);
      }
    };

    Vue.prototype.$notify = notify;
    Vue.notify = notify;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Notify);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(17)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(5),
  /* template */
  __webpack_require__(15),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'CssGroup',
  props: ['name']
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__defaults__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__VelocityGroup_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__VelocityGroup_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__VelocityGroup_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CssGroup_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CssGroup_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__CssGroup_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__parser__ = __webpack_require__(8);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









var STATE = {
  IDLE: 0,
  DESTROYED: 2
};

var Component = {
  name: 'Notifications',
  components: {
    VelocityGroup: __WEBPACK_IMPORTED_MODULE_4__VelocityGroup_vue___default.a,
    CssGroup: __WEBPACK_IMPORTED_MODULE_5__CssGroup_vue___default.a
  },
  props: {
    group: {
      type: String,
      default: ''
    },

    width: {
      type: [Number, String],
      default: 300
    },

    reverse: {
      type: Boolean,
      default: false
    },

    position: {
      type: [String, Array],
      default: function _default() {
        return __WEBPACK_IMPORTED_MODULE_3__defaults__["a" /* default */].position;
      }
    },

    classes: {
      type: String,
      default: 'vue-notification'
    },

    animationType: {
      type: String,
      default: 'css',
      validator: function validator(value) {
        return value === 'css' || value === 'velocity';
      }
    },

    animation: {
      type: Object,
      default: function _default() {
        return __WEBPACK_IMPORTED_MODULE_3__defaults__["a" /* default */].velocityAnimation;
      }
    },

    animationName: {
      type: String,
      default: __WEBPACK_IMPORTED_MODULE_3__defaults__["a" /* default */].cssAnimation
    },

    speed: {
      type: Number,
      default: 300
    },

    cooldown: {
      type: Number,
      default: 0
    },

    duration: {
      type: Number,
      default: 3000
    },

    delay: {
      type: Number,
      default: 0
    },

    max: {
      type: Number,
      default: Infinity
    }
  },
  data: function data() {
    return {
      list: [],
      velocity: __WEBPACK_IMPORTED_MODULE_0__index__["default"].params.velocity
    };
  },
  mounted: function mounted() {
    __WEBPACK_IMPORTED_MODULE_1__events__["a" /* events */].$on('add', this.addItem);
  },

  computed: {
    actualWidth: function actualWidth() {
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__parser__["a" /* default */])(this.width);
    },
    isVA: function isVA() {
      return this.animationType === 'velocity';
    },
    componentName: function componentName() {
      return this.isVA ? 'VelocityGroup' : 'CssGroup';
    },
    styles: function styles() {
      var _listToDirection = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__util__["a" /* listToDirection */])(this.position),
          x = _listToDirection.x,
          y = _listToDirection.y;

      var width = this.actualWidth.value;
      var suffix = this.actualWidth.type;

      var styles = _defineProperty({
        width: width + suffix
      }, y, '0px');

      if (x === 'center') {
        styles['left'] = 'calc(50% - ' + width / 2 + suffix + ')';
      } else {
        styles[x] = '0px';
      }

      return styles;
    },
    active: function active() {
      return this.list.filter(function (v) {
        return v.state !== STATE.DESTROYED;
      });
    },
    botToTop: function botToTop() {
      return this.styles.hasOwnProperty('bottom');
    }
  },
  methods: {
    addItem: function addItem(event) {
      var _this = this;

      event.group = event.group || '';

      if (this.group !== event.group) {
        return;
      }

      if (event.clean || event.clear) {
        this.destroyAll();
        return;
      }

      var duration = typeof event.duration === 'number' ? event.duration : this.duration;

      var speed = typeof event.speed === 'number' ? event.speed : this.speed;

      var title = event.title,
          text = event.text,
          type = event.type,
          data = event.data;


      var item = {
        id: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__util__["b" /* Id */])(),
        title: title,
        text: text,
        type: type,
        state: STATE.IDLE,
        speed: speed,
        length: duration + 2 * speed,
        data: data
      };

      if (duration >= 0) {
        item.timer = setTimeout(function () {
          _this.destroy(item);
        }, item.length);
      }

      var direction = this.reverse ? !this.botToTop : this.botToTop;

      var indexToDestroy = -1;

      if (direction) {
        this.list.push(item);

        if (this.active.length > this.max) {
          indexToDestroy = 0;
        }
      } else {
        this.list.unshift(item);

        if (this.active.length > this.max) {
          indexToDestroy = this.active.length - 1;
        }
      }

      if (indexToDestroy !== -1) {
        this.destroy(this.active[indexToDestroy]);
      }
    },
    notifyClass: function notifyClass(item) {
      return ['notification', this.classes, item.type];
    },
    notifyWrapperStyle: function notifyWrapperStyle(item) {
      return this.isVA ? null : {
        transition: 'all ' + item.speed + 'ms'
      };
    },
    destroy: function destroy(item) {
      clearTimeout(item.timer);
      item.state = STATE.DESTROYED;

      if (!this.isVA) {
        this.clean();
      }
    },
    destroyAll: function destroyAll() {
      this.active.forEach(this.destroy);
    },
    getAnimation: function getAnimation(index, el) {
      var animation = this.animation[index];

      return typeof animation === 'function' ? animation.call(this, el) : animation;
    },
    enter: function enter(_ref) {
      var el = _ref.el,
          complete = _ref.complete;

      var animation = this.getAnimation('enter', el);

      this.velocity(el, animation, {
        duration: this.speed,
        complete: complete
      });
    },
    leave: function leave(_ref2) {
      var el = _ref2.el,
          complete = _ref2.complete;

      var animation = this.getAnimation('leave', el);

      this.velocity(el, animation, {
        duration: this.speed,
        complete: complete
      });
    },
    clean: function clean() {
      this.list = this.list.filter(function (v) {
        return v.state !== STATE.DESTROYED;
      });
    }
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Component);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'VelocityGroup',
  methods: {
    enter: function enter(el, complete) {
      this.$emit('enter', { el: el, complete: complete });
    },
    leave: function leave(el, complete) {
      this.$emit('leave', { el: el, complete: complete });
    },
    afterLeave: function afterLeave() {
      this.$emit('afterLeave');
    }
  }
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  position: ['top', 'right'],
  cssAnimation: 'vn-fade',
  velocityAnimation: {
    enter: function enter(el) {
      var height = el.clientHeight;

      return {
        height: [height, 0],
        opacity: [1, 0]
      };
    },
    leave: {
      height: 0,
      opacity: [0, 1]
    }
  }
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export parse */
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var floatRegexp = '[-+]?[0-9]*.?[0-9]+';

var types = [{
  name: 'px',
  regexp: new RegExp('^' + floatRegexp + 'px$')
}, {
  name: '%',
  regexp: new RegExp('^' + floatRegexp + '%$')
}, {
  name: 'px',
  regexp: new RegExp('^' + floatRegexp + '$')
}];

var getType = function getType(value) {
  if (value === 'auto') {
    return {
      type: value,
      value: 0
    };
  }

  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    if (type.regexp.test(value)) {
      return {
        type: type.name,
        value: parseFloat(value)
      };
    }
  }

  return {
    type: '',
    value: value
  };
};

var parse = function parse(value) {
  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'number':
      return { type: 'px', value: value };
    case 'string':
      return getType(value);
    default:
      return { type: '', value: value };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (parse);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Id; });
/* unused harmony export split */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return listToDirection; });
var directions = {
  x: ['left', 'center', 'right'],
  y: ['top', 'bottom']
};

var Id = function (i) {
  return function () {
    return i++;
  };
}(0);

var split = function split(value) {
  if (typeof value !== 'string') {
    return [];
  }

  return value.split(/\s+/gi).filter(function (v) {
    return v;
  });
};

var listToDirection = function listToDirection(value) {
  if (typeof value === 'string') {
    value = split(value);
  }

  var x = null;
  var y = null;

  value.forEach(function (v) {
    if (directions.y.indexOf(v) !== -1) {
      y = v;
    }
    if (directions.x.indexOf(v) !== -1) {
      x = v;
    }
  });

  return { x: x, y: y };
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)();
// imports


// module
exports.push([module.i, ".notifications{display:block;position:fixed;z-index:5000}.notification-wrapper{display:block;overflow:hidden;width:100%;margin:0;padding:0}.notification{display:block;box-sizing:border-box;background:#fff;text-align:left}.notification-title{font-weight:600}.vue-notification{font-size:12px;padding:10px;margin:0 5px 5px;color:#fff;background:#44a4fc;border-left:5px solid #187fe7}.vue-notification.warn{background:#ffb648;border-left-color:#f48a06}.vue-notification.error{background:#e54d42;border-left-color:#b82e24}.vue-notification.success{background:#68cd86;border-left-color:#42a85f}.vn-fade-enter-active,.vn-fade-leave-active,.vn-fade-move{transition:all .5s}.vn-fade-enter,.vn-fade-leave-to{opacity:0}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(4),
  /* template */
  __webpack_require__(16),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(6),
  /* template */
  __webpack_require__(14),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition-group', {
    attrs: {
      "css": false
    },
    on: {
      "enter": _vm.enter,
      "leave": _vm.leave,
      "after-leave": _vm.afterLeave
    }
  }, [_vm._t("default")], 2)
},staticRenderFns: []}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "notifications",
    style: (_vm.styles)
  }, [_c(_vm.componentName, {
    tag: "component",
    attrs: {
      "name": _vm.animationName
    },
    on: {
      "enter": _vm.enter,
      "leave": _vm.leave,
      "after-leave": _vm.clean
    }
  }, _vm._l((_vm.list), function(item) {
    return (item.state != 2) ? _c('div', {
      key: item.id,
      staticClass: "notification-wrapper",
      style: (_vm.notifyWrapperStyle(item)),
      attrs: {
        "data-id": item.id
      }
    }, [_vm._t("body", [_c('div', {
      class: _vm.notifyClass(item),
      on: {
        "click": function($event) {
          _vm.destroy(item)
        }
      }
    }, [(item.title) ? _c('div', {
      staticClass: "notification-title",
      domProps: {
        "innerHTML": _vm._s(item.title)
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "notification-content",
      domProps: {
        "innerHTML": _vm._s(item.text)
      }
    })])], {
      item: item,
      close: function () { return _vm.destroy(item); }
    })], 2) : _vm._e()
  }))], 1)
},staticRenderFns: []}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition-group', {
    attrs: {
      "name": _vm.name
    }
  }, [_vm._t("default")], 2)
},staticRenderFns: []}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(18)("2901aeae", content, true);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(19)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_20__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=WebDollar-User-Interface-bundle.js.map