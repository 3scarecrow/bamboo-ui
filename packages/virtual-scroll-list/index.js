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

Component({
  options: {
    pureDataPattern: /^_/,
    multipleSlots: true
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
    refresherTriggered: false,
  },

  attached() {
    this.calcKeeps()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 计算可视区域展示项数量
     */
    calcKeeps() {
      const _keeps = Math.ceil(this.data.height / this.data.itemSize)
      this.setData({_keeps})
    },
    scrollToTop() {
      this.setData({scrollTop: 0, _scrollTop: 0})
    },
    _refresh(scrollTop) {
      const {sourceData, _keeps} = this.data
      const maxEndIndex = sourceData.length
      // 可视区域显示的数据项数量（包含上一屏、当前屏和下一屏的数据），避免滚动白屏
      const visibleSize = Math.min(_keeps * 3, maxEndIndex)
      const curStart = Math.floor(scrollTop / this.data.itemSize)
      let startIndex = Math.max(curStart - _keeps, 0)
      const endIndex = Math.min(startIndex + visibleSize, maxEndIndex)
      if (startIndex > endIndex - visibleSize) {
        startIndex = endIndex - visibleSize
      }
      const visibleData = sourceData.slice(startIndex, endIndex)
      this.setData({_scrollTop: scrollTop})
      this.triggerEvent('visibleDataChange', {visibleData, startIndex, endIndex})
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
