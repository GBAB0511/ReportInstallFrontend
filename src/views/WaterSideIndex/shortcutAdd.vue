
<template>
  <div class="shortcutAdd">
    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

    <el-tree
      class="filter-tree"
      show-checkbox
      node-key="code"
      :data="tableData"
      :props="defaultProps"
      default-expand-all
      highlight-current
      :filter-node-method="filterNode"
      ref="tree"
    ></el-tree>
  </div>
</template>
<script>
export default {
  name: "shortcutAdd",
  props: ["shortcutAddLength"],
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "opName"
      },
      tableData: [],
      filterText: "",
      sectionDate:[],
    };
  },
  mounted() {
    this.sectionDate = []
    this.init();
  },
  methods: {
    //初始化
    init() {
      let params = {
        busicode: "SysModuleTree",
        data: {},
      };
      this.$api
        .fetch({
          params: params, //参数
          
        })
        .then(res => {
          this.tableData = this.initTreeData(res);
        });
    },
    // handleNodeClick(data) {
    //   if(data.children.length==0){
    //     this.sectionDate.push(data.code)
    //   }
    //   console.log(this.sectionDate);
    // },
    initTreeData(data) {
      var stack = [data[0]];
      for (var i = 1; i < data.length; i++) {
        while (Number(data[i].parentMask) <= Number(stack[stack.length - 1].parentMask)) {
          stack.pop();
        }
        this.setChildrenNode(stack[stack.length - 1], data[i]);
        stack.push(data[i]);
      }
      return [data[0]];
    },
     setChildrenNode(parent, child) {
      if (!parent.children)
        parent.children = [];
      parent.children.push(child);
    },
    getCheckedNodes(){
      // 勾选的节点数组
      let checkedList = this.$refs.tree.getCheckedNodes()
      for (let i = 0; i < checkedList.length; i++) {
        if(checkedList[i].children.length == 0){
        this.sectionDate.push(checkedList[i])
      }
      }
    },
    

    filterNode(value, data) {
      if (!value) return true;
      return data.opName.indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style lang="scss">
.shortcutAdd {
  height: calc(100% - 20px);
  width: calc(100% - 40px);
  margin: 10px 0px;
  overflow-y: auto;
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #c7e1e2;
  }
}
</style>
