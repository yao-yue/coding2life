function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
    }
    console.log('节流------')
    console.log(gapTime)
    let _lastTime = null
    return function () {
      let _nowTime = + new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments)
        _lastTime = _nowTime
      }
    }
  }

module.exports = {
    throttle: throttle
}