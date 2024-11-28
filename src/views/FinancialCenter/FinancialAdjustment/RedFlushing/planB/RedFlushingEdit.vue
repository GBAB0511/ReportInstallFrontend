

<template>
  <div class="RedFlushingEdit">
    
      <el-tabs type="border-card" @tab-click="tabClick" class="tabsBlock">
        <el-tab-pane label="水量红冲">
          <span slot="label">
            <i class="el-icon-user"></i> 水量红冲
            
          </span>
          <waterFlushing :formStute="formStute"></waterFlushing>
        </el-tab-pane>

        <el-tab-pane label="实收减免">
          <span slot="label">
            <i class="el-icon-user"></i> 实收减免
          </span>
          <amountReversal :formStute="formStute"></amountReversal>
          
        </el-tab-pane>

      </el-tabs>
  </div>
</template>
<script>
import waterFlushing from "./waterFlushing"; //上传附件
import amountReversal from "./amountReversal"; //单据信息
export default {
  name: "RedFlushingEdit",
  props: ["formStute"],
  components: {
    waterFlushing,
    amountReversal,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {

  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.RedFlushingEdit {
  height: 100%;
  .tabsBlock {
    height: 100%;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;    
    border: 0px solid #DCDFE6;
    .el-tabs__header {
      margin: 0 0 5px;
    }
    .el-tabs--border-card {
      border: 1px solid #eaf4ff;
    }
    .el-tabs__content {
      padding: 5px;
      height: calc(100% - 40px);
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>

