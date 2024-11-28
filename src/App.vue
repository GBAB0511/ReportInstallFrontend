<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
(function (doc, win) {
  // sessionStorage.setItem('token','dea555f1-c82f-427c-b77b-7b39382f5d79')
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = "100px";
      // if(clientWidth>=1024){
      //   docEl.style.fontSize = '100px';
      // }else{
      //   docEl.style.fontSize = 100 * (clientWidth / 1024) + 'px';
      // }
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
(function () {
  function getViewPortHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
  }
  function setHeight() {
    document.body.style.height = getViewPortHeight() + "px";
  }
  setHeight();
  $(window).resize(function () {
    //动态监听监听网页窗口变化
    setHeight();
  });
})();
export default {
  name: "App",
  provide: function () {
    return {
      pageReload: this.pageReload
    }
  },
  data: function () {
    return {
      isRouterAlive: true
    }
  },
  mounted() {
    function checkIE(){
      return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
    }
    if (checkIE()) {
      window.addEventListener('hashchange', () => {
        var currentPath = window.location.hash.slice(1);
        if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
      }
    }, false)
    }

  },
  methods: {
    pageReload: function () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
};
</script>

<style lang="scss">
// @import "assets/styles/resert.scss";
@import "assets/styles/commonStyle.css";

// 只能查看输入框 样式
.ready_only {
  .el-input__inner,
  .el-textarea__inner {
    border: none;
  }
  // border-bottom: 1px solid #ccc;
  background-color: transparent;
  border-radius: 0px;
  cursor: text !important;
}
// 下拉选择框字体
.el-input__suffix,
.el-input__suffix,
.el-select-dropdown__item,
.el-select-dropdown__empty {
  font-size: 12px !important;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f5f5;
}
/*loading样式*/
.el-loading-spinner .el-loading-text {
  margin: 10px 0 !important;
  font-size: 25px !important;
}
.el-loading-mask.is-fullscreen .el-loading-spinner .circular {
  height: 100px !important;
  width: 100px !important;
}
.el-popup-parent--hidden {
  padding-right: 0 !important;
}
.el-dialog__headerbtn {
  font-size: 20px;
}
#app {
  font-size: 0.16rem;
  height: 100%;
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .el-button.el-button--text:focus,
  .el-button.el-button--text:hover {
    background: transparent;
    border-color: transparent;
  }
  // 表格列居左
  .el-table__row .is-left {
    text-align: left;
  }
  // 表格列居右
  .el-table__row .is-right {
    text-align: right;
  }
}
</style>
