const generateData = (data) => {
  const newDatas = Array.from({ length: 5 })
  return newDatas.map((_, i) => ({
    id: data.length + i + 1
  }))
}

Component({
  data: {
    loading: false,
    noMore: false,
    listData: [],
    refresherTriggered: false,
    // 虚拟列表数据
    visibleData: [],
  },

  methods: {
    load() {
      if (this.data.noMore) return
      this.setData({loading: true})
      setTimeout(() => {
        const { listData } = this.data
        const noMore = listData.length >= 60
        const _listData = noMore ? listData : listData.concat(generateData(listData))
        this.setData({
          noMore,
          loading: false,
          listData: _listData,
        })
      }, 2000)
    },
  
    refresh() {
      this.setData({
        noMore: false,
        refresherTriggered: true
      })
      setTimeout(() => {
        const { listData } = this.data
        const noMore = listData.length >= 60
        this.setData({
          noMore,
          refresherTriggered: false,
          listData: generateData([])
        })
      }, 2000)
    },
  
    visibleDataChange(e) {
      const { visibleData } = e.detail
      this.setData({ visibleData })
    }
  }
})
