Component({
  properties: {
      showCancel: {
          type: Boolean,
          value: true
      }
  },
  data: {
      tapValue: 0,
      show: true,
      actions: [
          { text: 'item 1', value: 1 },
          { text: 'item 2', value: 2 },
          { text: 'item 3', type: 'warn', value: 3 }
      ]
  },
  methods: {
      actiontap(event) {
          this.setData({
              tapValue: event.detail.value
          })
      },
      close() {
          this.setData({
              show: false
          })
      }
  }
})
