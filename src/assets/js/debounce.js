/**
 * @description 函数防抖 触发高频时间后n秒内函数只会执行一次,如果n秒内高频时间再次触发,则重新计算时间。
 * @param {Function} func 需要执行的函数
 * @param {Number} wait 间隔时间 默认200ms
 * @param {Boolean} immediate  是否立即执行 true(默认) 表立即执行，false 表非立即执行
 * @return {*}
 * @author syc
 */
 export function VueDebounce(func, wait = 500, immediate = true) {
  let timeout = null;  // 定时器
  return function () {
      let that = this, // this对象
          args = arguments; // 参数
      if (timeout) clearTimeout(timeout);
      if (immediate === true) { // 立即执行
          var callNow = !timeout;
          timeout = setTimeout(() => {
              timeout = null;
          }, wait)
          if (callNow) {
              // func.apply(that, args); // 普通用法
              that[func](...args); // vue用法
          }
      }
      else { // 非立即执行
          timeout = setTimeout(() => {
              // func.apply(this, args); // 普通用法
              that[func](...args); // vue用法
          }, wait);
      }
  }
}
/**
 * @description 函数节流
 * @param {Function} func 函数
 * @param {Number} wait 延迟执行毫秒数,默认200
 * @param {Number} type 1 表时间戳版，2 表定时器版
 */
 export function VueThrottle(func, wait=2000 ,type) {
  if(type===1){
      let previous = 0;
  }else if(type===2){
      let timeout;
  }
  return function() {
      let that= this;
      let args = arguments;
      if(type===1){
          let now = Date.now();

          if (now - previous > wait) {
              // func.apply(that, args); // 普通用法
              that[func](...args); // vue用法
              previous = now;
          }
      }else if(type===2){
          if (!timeout) {
              timeout = setTimeout(() => {
                  timeout = null;
                  // func.apply(that, args)
                  that[func](...args); // vue用法
              }, wait)
          }
      }
  }
}