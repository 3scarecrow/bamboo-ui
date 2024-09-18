import { rpxToPx } from './utils'

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
        this.calcVisible(this.data._scrollTop)
      }
    },
    itemHeight: {
      type: String,
      optionalType: [Number],
      value: 100,
      observer(val) {
        this.setData({
          itemHeightValue: rpxToPx(val)
        })
      }
    },
    height: String,
    // 是否立即执行加载方法，以防初始状态下内容无法撑满容器
    immediate: {
      type: Boolean,
      value: true
    },
    upperThreshold: {
      type: Number,
      optionalType: [String],
      value: 50
    },
    lowerThreshold: {
      type: Number,
      optionalType: [String],
      value: 50
    },
    showScrollbar: {
      type: Boolean,
      value: true
    },
    refresherEnabled: {
      type: Boolean,
      value: false,
    },
    refresherThreshold: {
      type: Number,
      value: 45
    },
    refresherTriggered: {
      type: Boolean,
      value: false
    },
    refresherDefaultStyle: {
      type: String,
      value: 'black'
    },
    refresherBackground: String
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 控制scroll-view 滚动位置
    scrollTop: 0,
    itemHeightValue: 0,
    startIndex: 0,
    endIndex: 0,
    // 可视区域展示多少项
    _keeps: 0,
    // 记录数据源变化前的 scrollTop
    _scrollTop: 0,
  },

  attached() {
    this.calcKeeps()
    if (this.data.immediate) {
      this.check()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    check() {
      const { height, endIndex, itemHeightValue } = this.data
      const listHeight = rpxToPx(height)
      if ((endIndex + 1) * itemHeightValue <= listHeight) {
        this.triggerEvent('load')
      }
    },
    /**
     * 计算可视区域展示项数量
     */
    calcKeeps() {
      const { height, itemHeightValue } = this.data
      const listHeight = rpxToPx(height)
      const _keeps = Math.ceil(listHeight / itemHeightValue)
      this.setData({ _keeps })
    },

    calcVisible(scrollTop) {
      const { sourceData, _keeps } = this.data
      const maxEndIndex = sourceData.length
      // 可视区域显示的数据项数量（包含上一屏、当前屏和下一屏的数据），避免滚动白屏
      const visibleSize = Math.min(_keeps * 3, maxEndIndex)
      const curStart = Math.floor(scrollTop / this.data.itemHeightValue)
      let startIndex = Math.max(curStart - _keeps, 0)
      const endIndex = Math.min(startIndex + visibleSize, maxEndIndex)
      if (startIndex > endIndex - visibleSize) {
        startIndex = endIndex - visibleSize
      }
      const visibleData = sourceData.slice(startIndex, endIndex)
      this.setData({ _scrollTop: scrollTop, startIndex, endIndex })
      this.triggerEvent('visibleDataChange', { visibleData, startIndex, endIndex })
    },

    onScroll(event) {
      this.calcVisible(event.detail.scrollTop)
    },

    onLoad() {
      this.triggerEvent('load')
    },

    onRefresh() {
      this.triggerEvent('refresh')
    },

    onPulling() {
      this.triggerEvent('pulling')
    },

    onRestore() {
      this.triggerEvent('restore')
    },

    onAbort() {
      this.triggerEvent('abort')
    },

    scrollTo(scrollTop) {
      this.setData({ scrollTop, _scrollTop: scrollTop })
    }
  },
})
