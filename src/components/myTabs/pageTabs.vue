<template>
  <section class="__common-layout-pageTabs">
    <!-- <el-scrollbar> -->
      <span v-if="scrollable" :class="['__tabs__nav-prev', scrollable.prev ? '' : 'is-disabled']" @click="scrollPrev"><i class="el-icon-arrow-left"></i></span>
      <span v-if="scrollable" :class="['__tabs__nav-next', scrollable.next ? '' : 'is-disabled']" @click="scrollNext"><i class="el-icon-arrow-right"></i></span>
      <div class='__tabs__nav-scroll clearfix' ref="navScroll">
        <div :class="['__tabs', scrollable ? 'is-scrollable' : '']" ref="nav" :style="navStyle">
          <div
            class="__tab-item"
            v-for="(item, index) in openedPageRouters"
            :class="{
              '__is-active': item.fullPath == $route.fullPath,
            }"
            :key="item.fullPath"
            @click="onClick(item)"
            @dblclick="onClose(item)"
          >
          <!-- 鼠标右击事件：@contextmenu.prevent="showContextMenu($event, item)" -->
            {{ item.meta.title }}
            <span
            
              class="el-icon-close tab-close"
              @click.stop="onClose(item)"
              @contextmenu.prevent.stop=""
              :style="index === 0 ? 'width:0;' : ''"
            ></span>
          </div>
        </div>
      </div>
      
      
    <!-- </el-scrollbar> -->
    <div v-show="contextMenuVisible">
      <ul
        :style="{ left: contextMenuLeft + 'px', top: contextMenuTop + 'px' }"
        class="__contextmenu"
      >
        <li>
          <el-button type="text" @click="reload()" size="mini">
            重新加载
          </el-button>
        </li>
        <li>
          <el-button
            type="text"
            @click="closeOtherLeft"
            :disabled="false"
            size="mini"
            >关闭左边</el-button
          >
        </li>
        <li>
          <el-button
            type="text"
            @click="closeOtherRight"
            :disabled="false"
            size="mini"
            >关闭右边</el-button
          >
        </li>
        <li>
          <el-button type="text" @click="closeOther" size="mini"
            >关闭其他</el-button
          >
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import { addResizeListener, removeResizeListener } from './utils/resize-event';
const firstUpperCase = str => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};
export default {
  props: {
    keepAliveComponentInstance: null, //keep-alive控件实例对象
    blankRouteName: {
      type: String,
      default: "blank",
    }, //空白路由的name值
  },
  data() {
    return {
      contextMenuVisible: false, //右键菜单是否显示
      contextMenuLeft: 0, //右键菜单显示位置
      contextMenuTop: 0, //右键菜单显示位置
      contextMenuTargetPageRoute: null, //右键所指向的菜单路由
      openedPageRouters: [
        {
          fullPath:"/EngineeringManagement/engineerApproval",
          meta: {title: "工程报装"},
          path:"/EngineeringManagement/engineerApproval",
          params:{},
          query:{}
        }
      ], //已打开的路由页面
      scrollable: false,
      navOffset: 0,
      sizeName:"width"
    };
  },
  watch: {
    //当路由变更时，执行打开页面的方法
    $route: {
      handler(v) {
        if(v.fullPath !== '/' && v.fullPath !== '/UserInfoSearchDetail' && this.keepAliveComponentInstance) {
          
          this.openPage(v);
          
          this.$nextTick(_=>{
            this.scrollToActiveTab()
          })
        }
        
      },
      immediate: true,
    }
  },
  computed: {
    navStyle() {
      return {
        transform: `translateX(-${this.navOffset}px)`
      };
    }
  },
  mounted() {
    //添加点击关闭右键菜单
    // window.addEventListener("click", this.closeContextMenu);
    addResizeListener(this.$el, this.update);
  },
  destroyed() {
    // window.removeEventListener("click", this.closeContextMenu);
    if (this.$el && this.update) removeResizeListener(this.$el, this.update);
  },
  updated() {
    this.update();
    
  },
  methods: {
    //打开页面
    openPage(route) {
      if (route.name == this.blankRouteName) {
        return;
      }
      let isExist = this.openedPageRouters.some(
        (item) => item.fullPath == route.fullPath
      );
      if (!isExist) {
        let openedPageRoute = this.openedPageRouters.find(
          (item) => item.path == route.path
        );
        //判断页面是否支持不同参数多开页面功能，如果不支持且已存在path值一样的页面路由，那就替换它
        if (!route.meta.canMultipleOpen && openedPageRoute != null) {
          this.delRouteCache(openedPageRoute.fullPath);
          this.openedPageRouters.splice(
            this.openedPageRouters.indexOf(openedPageRoute),
            1,
            route
          );
        } else {
          this.openedPageRouters.push(route);
        }
      }
    },
    //点击页面标签卡时
    onClick(route) {
      if (route.fullPath !== this.$route.fullPath) {
        this.$emit("changeTabs", route.fullPath)
        // this.$router.push(route.fullPath);
      }
    },
    //关闭页面标签时
    onClose(route) {
      let index = this.openedPageRouters.indexOf(route);
      // 第一个页签不能删除
      if(index == 0) { return false }
      this.delPageRoute(route);
      if (route.fullPath === this.$route.fullPath) {
        let nextPath = this.openedPageRouters[index == 0 ? 0 : index - 1];
        this.$emit("changeTabs", nextPath.fullPath)
        //删除页面后，跳转到上一页面
        // this.$router.replace(
        //   nextPath
        // );
      }
    },
    //右键显示菜单
    showContextMenu(e, route) {
      this.contextMenuTargetPageRoute = route;
      this.contextMenuLeft = e.layerX;
      this.contextMenuTop = e.layerY;
      this.contextMenuVisible = true;
    },
    //隐藏右键菜单
    closeContextMenu() {
      this.contextMenuVisible = false;
      this.contextMenuTargetPageRoute = null;
    },
    //重载页面
    reload() {
      this.delRouteCache(this.contextMenuTargetPageRoute.fullPath);
      if (this.contextMenuTargetPageRoute.fullPath === this.$route.fullPath) {
        this.$router.replace({ name: this.blankRouteName }).then(() => {
          this.$router.replace(this.contextMenuTargetPageRoute);
        });
      }
    },
    //关闭其他页面
    closeOther() {
      for (let i = 0; i < this.openedPageRouters.length; i++) {
        let r = this.openedPageRouters[i];
        if (r !== this.contextMenuTargetPageRoute) {
          this.delPageRoute(r);
          i--;
        }
      }
      if (this.contextMenuTargetPageRoute.fullPath != this.$route.fullPath) {
        this.$router.replace(this.contextMenuTargetPageRoute);
      }
    },
    //根据路径获取索引
    getPageRouteIndex(fullPath) {
      for (let i = 0; i < this.openedPageRouters.length; i++) {
        if (this.openedPageRouters[i].fullPath === fullPath) {
          return i;
        }
      }
    },
    //关闭左边页面
    closeOtherLeft() {
      let index = this.openedPageRouters.indexOf(
        this.contextMenuTargetPageRoute
      );
      let currentIndex = this.getPageRouteIndex(this.$route.fullPath);
      if (index > currentIndex) {
        this.$router.replace(this.contextMenuTargetPageRoute);
      }
      for (let i = 0; i < index; i++) {
        let r = this.openedPageRouters[i];
        this.delPageRoute(r);
        i--;
        index--;
      }
    },
    //关闭右边页面
    closeOtherRight() {
      let index = this.openedPageRouters.indexOf(
        this.contextMenuTargetPageRoute
      );
      let currentIndex = this.getPageRouteIndex(this.$route.fullPath);
      for (let i = index + 1; i < this.openedPageRouters.length; i++) {
        let r = this.openedPageRouters[i];
        this.delPageRoute(r);
        i--;
      }
      if (index < currentIndex) {
        this.$router.replace(this.contextMenuTargetPageRoute);
      }
    },
    //删除页面
    delPageRoute(route) {
      let routeIndex = this.openedPageRouters.indexOf(route);
      if (routeIndex >= 0) {
        this.openedPageRouters.splice(routeIndex, 1);
      }
      this.delRouteCache(route.fullPath);
    },
    //删除页面缓存
    delRouteCache(key) {
      let cache = this.keepAliveComponentInstance.cache;
      let keys = this.keepAliveComponentInstance.keys;
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] == key) {
          keys.splice(i, 1);
          if (cache[key] != null) {
            delete cache[key];
          }
          break;
        }
      }
    },
    scrollPrev() {
      const containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
      const currentOffset = this.navOffset;

      if (!currentOffset) return;

      let newOffset = currentOffset > containerSize ? currentOffset - containerSize : 0;
      this.navOffset = newOffset;
    },
    scrollNext() {
      const navSize = this.$refs.nav[`offset${firstUpperCase(this.sizeName)}`];
      const containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
      const currentOffset = this.navOffset;

      if (navSize - currentOffset <= containerSize) return;

      let newOffset = navSize - currentOffset > containerSize * 2 ? currentOffset + containerSize : (navSize - containerSize);

      this.navOffset = newOffset;
    },
    update() {
      if (!this.$refs.nav) return;
      const sizeName = this.sizeName;
      const navSize = this.$refs.nav[`offset${firstUpperCase(sizeName)}`];
      const containerSize = this.$refs.navScroll[`offset${firstUpperCase(sizeName)}`];
      const currentOffset = this.navOffset;
      if (containerSize < navSize) {
        const currentOffset = this.navOffset;
        this.scrollable = this.scrollable || {};
        this.scrollable.prev = currentOffset;
        this.scrollable.next = currentOffset + containerSize < navSize;
        if (navSize - currentOffset < containerSize) {
          this.navOffset = navSize - containerSize;
        }
      } else {
        this.scrollable = false;
        if (currentOffset > 0) {
          this.navOffset = 0;
        }
      }
    },
    scrollToActiveTab() {
      if (!this.scrollable) return;
      const nav = this.$refs.nav;
      const activeTab = this.$el.querySelector('.__is-active');
      if (!activeTab) return;
      const navScroll = this.$refs.navScroll;
      const activeTabBounding = activeTab.getBoundingClientRect();
      const navScrollBounding = navScroll.getBoundingClientRect();
      const maxOffset = nav.offsetWidth - navScrollBounding.width
      const currentOffset = this.navOffset;
      let newOffset = currentOffset;

      if (activeTabBounding.left < navScrollBounding.left) {
        newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
      }
      if (activeTabBounding.right > navScrollBounding.right) {
        newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
      }
      newOffset = Math.max(newOffset, 0);
      this.navOffset = Math.min(newOffset, maxOffset);
    },
  },
};
</script>
<style lang="scss">
.__common-layout-pageTabs {
  position: relative;
  height: 35px;
  line-height: 35px;
  overflow: hidden;
  .__tabs__nav-next, .__tabs__nav-prev {
    position: absolute;
    cursor: pointer;
    line-height: 35px;
    font-size: 16px;
    color: #909399;
    width: 15px;
    background: #fff;
    z-index: 5;
  }
  .__tabs__nav-prev {
    left: 0;
  }
  .__tabs__nav-next {
    right: 0;
  }
  .__tabs__nav-scroll{
    height: 100%;
    overflow: hidden;
  }
  .__contextmenu {
    // width: 100px;
    margin: 0;
    border: 1px solid #e4e7ed;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.1);
    li {
      margin: 0;
      padding: 0px 15px;
      &:hover {
        background: #f2f2f2;
        cursor: pointer;
      }
      button {
        color: #2c3e50;
      }
    }
  }

  $c-tab-border-color: #dcdfe6;
  position: relative;
  &::before {
    content: "";
    border-bottom: 1px solid $c-tab-border-color;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
  }
  .__tabs {
    height: 100%;
    float: left;
    white-space: nowrap;
    position: relative;
    transition: transform .3s;
    &.is-scrollable {
      padding: 0 20px;
      box-sizing: border-box;
    }
    .__tab-item {
      position: relative;
      min-width: 100px;
      width: auto;
      height: 100%;
      white-space: nowrap;
      font-size: 14px;
      border: 1px solid $c-tab-border-color;
      border-left: none;
      border-bottom: 0px;
      padding: 0 20px;
      box-sizing: border-box;
      line-height: 35px;
      display: inline-block;
      cursor: pointer;
      transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:first-child {
        border-left: 1px solid $c-tab-border-color;
        border-top-left-radius: 2px;
      }
      &:last-child {
        border-top-right-radius: 2px;
      }
      &:not(.__is-active):hover {
        color: #409eff;
        .el-icon-close {
          width: 12px;
          margin-right: 0px;
        }
      }
      &.__is-active {
        padding-right: 30px;
        border-bottom: 1px solid #fff;
        color: #409eff;
        .el-icon-close {
          width: 12px;
          margin-right: 0px;
          margin-left: 2px;
        }
      }
      .el-icon-close {
        width: 0px;
        height: 12px;
        overflow: hidden;
        border-radius: 50%;
        font-size: 12px;
        margin-right: 12px;
        transform-origin: 100% 50%;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        vertical-align: text-top;
        &.tab-close{
          position: absolute;
          right: 5px;
          top: 10px;
        }
        &:hover {
          background-color: #c0c4cc;
          color: #fff;
        }
      }
    }
  }
}
</style>