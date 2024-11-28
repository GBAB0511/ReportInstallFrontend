<template>
  <div id="second_nav">
    <!-- 实现菜单多级分类 -->
    <el-menu
      :default-active="$route.fullPath" :unique-opened="uniqueOpened">
      <!-- 引入组件 -->
      <menu-item :menuData="navList"></menu-item>
    </el-menu>
  </div>
</template>
<script>

import MenuItem from './menu_item'
  export default {
    name: "second-Nav",
     components: {
      MenuItem
    },
    props: {
      secondNav: {
        type: Object,
        required: true,
      },
      uniqueOpened: {
        type: Boolean,
        default: false
      },
      defaultOpeneds: {
        type: Array,
        default(){
          return []
        }
      }
    },

    data() {
      return {
        navList: new Array(),
      }
    },
    watch: {
      secondNav: {
        handler(val) {
          if (val) {
            this.init()
          }
        },
        deep: true
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        var data = this.secondNav;
        this.$set(this, 'navList', data.navList)
      },
      async open(val) {
        await this.$nextTick()
        this.$refs['menu'].open(val)
      },
      handleSelect(data) {
        this.$emit('navClick',obj)
      },
    }
  }
</script>

<style >
#second_nav {
  width: 100%;
  height: 100%;
  background: #fff;
}
#second_nav .el-menu{
  border: none;
}
#second_nav .el-menu-item.is-active{
  color: #fff;
  background: #297ACC;
}

#second_nav .el-menu-item{
  font-weight: bold;
}
#second_nav  .el-submenu__title{
  font-weight: bold;
}
#second_nav .el-submenu__title i{
  color: #619DD9;
}
#second_nav .el-submenu__icon-arrow:before{
  content:"\e790";
  color: #000;
  font-size: 14px;
}
#second_nav .el-menu-item i{
  color: #619DD9;
}
#second_nav .el-menu-item.is-active i{
  color: #fff;
}
</style>
