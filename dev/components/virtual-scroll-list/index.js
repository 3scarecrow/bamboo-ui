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


/*
 * @Descripttion: 分页组件
 * @version: 1.0.0
 * @Author: hweei
 * @Date: 2021-07-27 09:05:06
 * @LastEditors: hweei
 * @LastEditTime: 2021-07-29 11:10:47
 */
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
/**
 * 组件的属性列表
 */
// components/virtual-list/index.js
Component({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
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
  ready: function ready() {
    this.init();
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 可视列表前的元素高度
    // beforeHeight: 0,
    // 可视列表后的元素高度
    // afterHeight: 0,
    // showList: [],
    scrollTop: 0,
    _size: 0,
    _scrollTop: 0,
    _startIndex: 0,
    _isReady: false,
    itemSize: 0,
    refresherTriggered: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init: function init() {
      /** 屏幕可视的数据 */
      var size = Math.ceil(wx.getWindowInfo().windowHeight / this.data.itemSize);
      this.setData({ _size: size, _isReady: true });
    },
    scrollToTop: function scrollToTop() {
      this.setData({ scrollTop: 0, _scrollTop: 0 });
    },
    _refresh: function _refresh(scrollTop) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _data = this.data,
          sourceData = _data.sourceData,
          size = _data._size,
          _isReady = _data._isReady;

      if (!_isReady) {
        return;
      }
      var maxEndIndex = sourceData.length;
      // 可视的数量（包含上一屏、当前屏和下一屏的数据）
      var visibleSize = Math.min(size * 5, maxEndIndex);
      var curStart = Math.floor(scrollTop / this.data.itemSize);
      var startIndex = Math.max(curStart - 2 * size, 0);
      var endIndex = Math.min(startIndex + visibleSize, maxEndIndex);
      // if (startIndex > endIndex - visibleSize) {
      //   startIndex = endIndex - visibleSize
      // }
      // const beforeHeight = sourceData.slice(0, startIndex).length * itemHeight
      var visibleData = sourceData.slice(startIndex, endIndex);
      // const afterHeight = sourceData.slice(endIndex).length * itemHeight
      if (force || this.data._startIndex !== startIndex) {
        this.setData({ _scrollTop: scrollTop, _startIndex: startIndex });
        this.triggerEvent('visibleDataChange', { visibleData: visibleData, startIndex: startIndex, endIndex: endIndex });
        if (endIndex >= maxEndIndex) {
          this.triggerEvent('scrolltolower');
        }
      } else {
        this.setData({ _scrollTop: scrollTop });
      }
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