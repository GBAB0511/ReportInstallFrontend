export default {}.install = (Vue, options = {}) => {
    Vue.directive('preventReClick', {
      inserted(el, binding) {
        el.addEventListener('click', e => {
          if (!el.disabled) {
            el.disabled = true
            el.style.cursor = 'not-allowed'
            setTimeout(() => {
              el.style.cursor = 'pointer'
              el.disabled = false
            }, 2000)
          }
        })
      }
    })
  }
