# virtual-list

virtual-list 虚拟列表组件用于展示长列表数据

## 代码引入

在 `app.json` 或 `index.json` 中引入组件
```json
{
  "usingComponents": {
    "virtual-list": "mini-candy/virtual-list"
  }
}
```

## 代码演示

### 基础用法

```html
<virtual-list
  sourceData="{{ listData }}"
  itemHeight="250rpx"
  height="1000rpx"
  bind:visibleDataChange="onVisibleDataChange"
  bind:load="load"
>
  <view
    wx:for="{{visibleData}}"
    wx:key="id"
    style="height: 250rpx"
  >
    {{ item.id }}
  </view>
  <view slot="footer" style="text-align: center;">
    <view wx:if="{{noMore}}">
      没有更多了
    </view>
    <view wx:if="{{loading}}">加载中...</view>
  </view>
</virtual-list>
```

```javascript
const generateData = (data) => {
  const newDatas = Array.from({ length: 5 })
  return newDatas.map((_, i) => ({
    id: data.length + i + 1
  }))
}

Page({
  data: {
    loading: false,
    noMore: false,
    listData: [],
    // 可视列表数据
    visibleData: [],
  },

  // 加载下一页数据
  load() {
    if (this.data.noMore) return
    this.setData({ loading: true })
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

  // 可视数据变化事件
  onVisibleDataChange(e) {
    const { visibleData } = e.detail
    this.setData({ visibleData })
  }
})
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| source-data | array | [] | 源数据 |
| height | string\number | - | 列表高度 |
| item-height | string\number | - | 是 | 列表项的高度，像素单位：px 和 rpx |
| immediate-check | boolean | true | 是否立即检查容器是否撑满，以防初始状态下内容无法撑满容器 |
| interval-check | boolean | false | 是否间隔检查容器是否撑满 |
| check-delay | number | 1000 | 检查间隔时长 |
| lower-threshold | number/string | 50 | 距底部多远时，触发 load 事件 |
| show-scrollbar | boolean | true | 滚动条显隐控制 |
| refresher-enabled | boolean | false | 开启自定义下拉刷新 |
| refresher-triggered | boolean | false | 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发 |
| refresher-threshold | number | 45 | 设置自定义下拉刷新阈值	|
| refresher-default-style | string | "black" | 设置自定义下拉刷新默认样式，支持设置 black | white | none， none 表示不使用默认样式	|
| refresher-background | string | - | 设置自定义下拉刷新区域背景颜色，默认为透明	|

## Events

| 事件名	 | 说明 | 回调参数 |
| ---- | ---- | ----- |
| bind:load | 滚动到底部时触发 | - |
| bind:visibleDataChange | 滚动时可视数据变化时触发，需要监听该事件，将可视数据作为插槽渲染到 virtual-list 组件 | event.detail = { visibleData, startIndex, endIndex } |
| bind:refresh | 自定义下拉刷新被触发	| - |
| bind:pulling | 自定义下拉刷新控件被下拉	| - |
| bind:restore | 自定义下拉刷新被复位		| - |
| bind:abort | 自定义下拉刷新被中止		| - |
| bind:refresh | 自定义下拉刷新被触发	| - |

## Methods

通过 selectComponent 可以获取到 virtual-list 实例并调用实例方法。

| 方法名 | 说明 |	参数 | 返回值 |
| ---- | ---- | ---- | ----- |
| scrollTo | 滚动到某个位置 | scrollTop:number/string | - |

## Slot

| 名称 | 说明 |
| ---- | ---- |
| 默认 | 渲染可视数据显示内容 |
| empty | 数据为空显示内容 |
| footer | 底部显示内容，例如显示 '加载中' 或者 '没有更多了' |
| refresher | 自定义下拉刷新内容，需要 refresher-enabled 为 true，refresher-default-style 为 'none' |