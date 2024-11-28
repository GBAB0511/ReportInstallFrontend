<template>
    <div   class="RegularOpeningEdit">

        <el-form  class=" RegularOpeningEditForm " :inline="true" :model="regularOpeningEditNeedData" label-width="130px" ref="ruleForm">

          <legend class="legendColumn">用户信息</legend>

          <el-form-item label="上期抄码：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="regularOpeningEditNeedData.priorPeriodNum" placeholder="666" ></el-input>
          </el-form-item>
          <el-form-item label="本期抄码：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="regularOpeningEditNeedData.currendPeriodNum" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item label="本期用水：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="regularOpeningEditNeedData.currendPeriodWater" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item label="增减水量：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="regularOpeningEditNeedData.addWater" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item label="分摊水量：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="regularOpeningEditNeedData.shareWater" placeholder="" ></el-input>
          </el-form-item>
          <legend class="legendColumn">计算方式</legend>

        </el-form>
    </div>
    
</template>
<script>
export default {
  name: "RegularOpeningEdit",
  props: ['regularOpeningEditNeedData'],
  data() {
    return {
      tabsName:"after",
      histroyData: {},

    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },

  }
}
</script>
<style lang="scss">
.RegularOpeningEdit {
  .keyword-bottom{
    display: inline-block;
    height: 40px;
    line-height: 40px;
  }
  .el-form-item {
    margin-bottom: 0px !important;
}
.el-input__inner{
  height: 30px;
}
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  .RegularOpeningEditForm {
    .el-form-item {
      width: 28%;
      .el-form-item__content {    
        width: calc(100% - 130px);
        .el-select {
          width: 100%;
        }
      }
    }
    .from-table {
      width: 100%;
      .el-form-item__content {
        width: 100%;
      }
    }
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
}
</style>