export function debounce (fn, delta, context) {
  var timeoutID = null

  return function () {
    clearTimeout(timeoutID)

    var args = arguments
    timeoutID = setTimeout(function () {
      fn.apply(context, args)
    }, delta)
  }
}

export function throttle (fn, delta, context) {
  var safe = true

  return function () {
    var args = arguments

    if (safe) {
      fn.call(context, args)
      safe = false
      setTimeout(function () {
        safe = true
      }, delta)
    }
  }
}

export const history = {
  get: function (key) {
    let list = JSON.parse(localStorage.getItem(key) || '[]')
    return list
  },
  save: function (key, list) {
    localStorage.setItem(key, JSON.stringify(list))
  }
}
