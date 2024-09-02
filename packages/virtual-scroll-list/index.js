/*
 * @Descripttion: 分页组件
 * @version: 1.0.0
 * @Author: hweei
 * @Date: 2021-07-27 09:05:06
 * @LastEditors: hweei
 * @LastEditTime: 2021-07-29 11:10:47
 */
function isRpx(value) {
  return /\d+(\.\d+)?rpx$/.test(value)
}

function rpxToPx(value) {
  // 小程序所有机型屏幕宽度都是 750 rpx，依此进行换算
  const _value = parseFloat(value)
  if (Number.isNaN(_value)) return value
  if (!isRpx(value)) return _value
  return Math.floor(_value / 750 * wx.getWindowInfo().windowWidth)
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
      observer() {
        this._refresh(this.data._scrollTop, true)
      }
    },
    itemHeight: {
      type: String,
      optionalType: [Number],
      value: 100,
      observer(val) {
        this.setData({
          itemSize: rpxToPx(val)
        })
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
      observer(val) {
        if (!val) {
          this.setData({refresherTriggered: false})
        }
      }
    },
    // 开启自定义下拉刷新
    refreshEnable: {
      type: Boolean,
      value: true,
    }
  },
  ready() {
    this.init()
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
    refresherTriggered: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      /** 屏幕可视的数据 */
      const size = Math.ceil(wx.getWindowInfo().windowHeight / this.data.itemSize)
      this.setData({_size: size, _isReady: true})
    },
    scrollToTop() {
      this.setData({scrollTop: 0, _scrollTop: 0})
    },
    _refresh(scrollTop, force = false) {
      const {
        sourceData,
        _size: size,
        _isReady
      } = this.data
      if (!_isReady) {
        return
      }
      const maxEndIndex = sourceData.length
      // 可视的数量（包含上一屏、当前屏和下一屏的数据）
      const visibleSize = Math.min(size * 5, maxEndIndex)
      const curStart = Math.floor(scrollTop / this.data.itemSize)
      const startIndex = Math.max(curStart - 2 * size, 0)
      const endIndex = Math.min(startIndex + visibleSize, maxEndIndex)
      // if (startIndex > endIndex - visibleSize) {
      //   startIndex = endIndex - visibleSize
      // }
      // const beforeHeight = sourceData.slice(0, startIndex).length * itemHeight
      const visibleData = sourceData.slice(startIndex, endIndex)
      // const afterHeight = sourceData.slice(endIndex).length * itemHeight
      if (force || this.data._startIndex !== startIndex) {
        this.setData({_scrollTop: scrollTop, _startIndex: startIndex})
        this.triggerEvent('visibleDataChange', {visibleData, startIndex, endIndex})
        if (endIndex >= maxEndIndex) {
          this.triggerEvent('scrolltolower')
        }
      } else {
        this.setData({_scrollTop: scrollTop})
      }
    },
    handleScroll(event) {
      this._refresh(event.detail.scrollTop)
    },
    handleScrollToLower() {
      this.triggerEvent('scrolltolower')
    },
    onRefresherrefresh() {
      this.triggerEvent('refresh')
    }
  },
})
