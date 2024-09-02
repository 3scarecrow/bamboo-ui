module.exports =
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isRpx(value) {
  return (/\d+(\.\d+)?rpx$/.test(value)
  );
}

function rpxToPx(value) {
  // 小程序所有机型屏幕宽度都是 750 rpx，依此进行换算
  var _value = parseFloat(value);
  if (Number.isNaN(_value)) return value;
  if (!isRpx(value)) return _value;
  return Math.floor(_value / 750 * wx.getWindowInfo().windowWidth);
}

Component({
  options: {
    pureDataPattern: /^_/,
    multipleSlots: true
  },
  properties: {
    sourceData: {
      type: Array,
      value: [],
      observer: function observer() {
        this._refresh(this.data._scrollTop, true);
      }
    },
    itemHeight: {
      type: String,
      optionalType: [Number],
      value: 100,
      observer: function observer(val) {
        this.setData({
          itemSize: rpxToPx(val)
        });
      }
    },
    height: {
      type: Number,
      optionalType: [String],
      value: 0
    },
    startIndex: {
      type: Number,
      value: 0
    },
    endIndex: {
      type: Number,
      value: 0
    },
    loading: {
      type: Boolean,
      value: false,
      observer: function observer(val) {
        if (!val) {
          this.setData({ refresherTriggered: false });
        }
      }
    },
    // 开启自定义下拉刷新
    refreshEnable: {
      type: Boolean,
      value: true
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: 0,
    // 可视区域展示多少项
    _keeps: 0,
    // 记录数据源变化前的 scrollTop
    _scrollTop: 0,
    itemSize: 0,
    refresherTriggered: false
  },

  attached: function attached() {
    this.calcKeeps();
  },


  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 计算可视区域展示项数量
     */
    calcKeeps: function calcKeeps() {
      var _keeps = Math.ceil(this.data.height / this.data.itemSize);
      this.setData({ _keeps: _keeps });
    },
    scrollToTop: function scrollToTop() {
      this.setData({ scrollTop: 0, _scrollTop: 0 });
    },
    _refresh: function _refresh(scrollTop) {
      var _data = this.data,
          sourceData = _data.sourceData,
          _keeps = _data._keeps;

      var maxEndIndex = sourceData.length;
      // 可视区域显示的数据项数量（包含上一屏、当前屏和下一屏的数据），避免滚动白屏
      var visibleSize = Math.min(_keeps * 3, maxEndIndex);
      var curStart = Math.floor(scrollTop / this.data.itemSize);
      var startIndex = Math.max(curStart - _keeps, 0);
      var endIndex = Math.min(startIndex + visibleSize, maxEndIndex);
      if (startIndex > endIndex - visibleSize) {
        startIndex = endIndex - visibleSize;
      }
      var visibleData = sourceData.slice(startIndex, endIndex);
      this.setData({ _scrollTop: scrollTop });
      this.triggerEvent('visibleDataChange', { visibleData: visibleData, startIndex: startIndex, endIndex: endIndex });
    },
    handleScroll: function handleScroll(event) {
      this._refresh(event.detail.scrollTop);
    },
    handleScrollToLower: function handleScrollToLower() {
      this.triggerEvent('scrolltolower');
    },
    onRefresherrefresh: function onRefresherrefresh() {
      this.triggerEvent('refresh');
    }
  }
});

/***/ })
/******/ ]);