export function isRpx(value) {
  return /\d+(\.\d+)?rpx$/.test(value)
}

export function rpxToPx(value) {
  // 小程序所有机型屏幕宽度都是 750 rpx，依此进行换算
  const floatValue = parseFloat(value)
  if (Number.isNaN(floatValue)) return value
  if (!isRpx(value)) return floatValue
  return Math.floor(floatValue / 750 * wx.getWindowInfo().windowWidth)
}
