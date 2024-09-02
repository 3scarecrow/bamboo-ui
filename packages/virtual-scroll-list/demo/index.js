// packages/virtual-scroll-list/demo/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false,
    noMore: false,
    startIndex: 0,
    endIndex: 0,
    visibleData: [],
    listData: []
  },

  ready() {
    this.query()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    query() {
      this.setData({
        listData: Array.from({ length: 10}).map((_, i) => ({
          id: i
        }))
      })
    },
    onVisibleDataChange(e) {
      const { visibleData, startIndex, endIndex } = e.detail
      this.setData({ visibleData, startIndex, endIndex })
    },
    loadMore() {
      setTimeout(() => {
        const { listData } = this.data
        if (listData.length < 100) {
          listData.push(...Array.from({ length: 10}).map((_, i) => ({
            id: listData.length + i
          })))
        }
        this.setData({
          listData,
          noMore: listData.length > 100,
          loading: false
        })
      }, 2000)
    }
  }
})