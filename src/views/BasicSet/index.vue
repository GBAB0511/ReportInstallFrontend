<template>
  <div class="base-info">

    <section class="base-info-right">
      <router-view></router-view>
    </section>
  </div>
</template>
<script>

export default {
  name: "base-info-index",

  data() {
    return {

    }
  },
  mounted() {

  },

}
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.base-info {
  &:after {
    @include _clearBoth();
  }
  .base-info-left,
  .base-info-right {
    height: 100%;
  }
  .base-info-right {
    width: 100% ;
    height: 100%;
    .el-table td, #app .el-table .el-table__body th {
      // padding: 0px 0 !important;
    }
    .el-form .el-form-item .el-form-item__content .el-select .el-input--mini{
      font-size: 14px;
    }
    .el-table .el-select .el-input .el-input__inner{
      font-size: 14px;
    }
    .el-table .el-date-editor .el-input__icon {
      line-height: 0px;
    } 
  }
}
</style>
