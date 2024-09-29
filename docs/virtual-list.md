# virtual-list
virtual-list 虚拟列表组件用于展示长列表数据

## 代码引入
在 page.json 中引入组件
```json
{
  "usingComponents": {
    "virtual-list": "mini-candy/virtual-list"
  }
}
```

## Props
| 属性 | 类型 | 默认值 | 必填 | 说明 |
| ---- | ---- | ------ | -------- | ---- |
| sourceData | array | [] | 是 | 源数据 |
| itemHeight | string\number | - | 是 | 列表项的高度，像素单位：px 和 rpx |
| height | string\number | - | 是 | 列表高度 |
| immediateCheck | boolean | true | 否 | 是否立即检查容器是否撑满，以防初始状态下内容无法撑满容器 |
| intervalCheck | boolean | false | 否 | 是否间隔检查容器是否撑满 |
| checkDelay | number | 1000 | 否 | 检查间隔时长 |

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