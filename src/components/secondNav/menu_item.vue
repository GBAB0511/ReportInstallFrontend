<template>
  <div class="menu_item">
    <template v-for="menu in menuData">
      <el-submenu :key="menu.opCode" :index="menu.opCode" v-if="menu.children && menu.children.length > 0">
        <template slot="title">
          <span slot="title">{{menu.opName}}</span>
        </template>
        <menu-item :menuData="menu.children"></menu-item>
      </el-submenu>
      <el-menu-item :key="menu.opCode" :index="menu.url" v-else @click="clickSubMenu(menu)">
        <span slot="title">{{menu.opName}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
 
<script>
export default {
  props: ['menuData'],
  name: 'MenuItem',
  mounted () {
    // console.log()
  },
  methods: {
    clickSubMenu (item) {
      console.log(item);
      if (item.url != this.$route.fullPath) {
        this.$router.push(item.url)
      }
    }
  }
}
</script>

<style lang="scss">
.el-submenu {
  .menu_item {
    overflow: hidden;
  }
}
</style>