# mini-candy

## 安装

### 通过 npm 安装 (推荐)

小程序已经支持使用 npm 安装第三方包，详见 [npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?search-key=npm)

```bash
# 通过 npm 安装
npm i mini-candy -S --production

# 通过 yarn 安装
yarn add mini-candy --production
```

## 使用组件

以虚拟列表组件为例，只需要在 json 文件中引入按钮对应的自定义组件即可

```json
{
  "usingComponents": {
    "virtual-list": "mini-candy/lib/virtual-list/index"
  }
}
```

接着就可以在 wxml 中直接使用组件

```html
<virtual-list></virtual-list>
```

## 在开发者工具中预览

```bash
# 安装项目依赖
npm install

# 执行组件编译
npm run dev
```

打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，把`mini-candy/dev`目录添加进去就可以预览示例了。
