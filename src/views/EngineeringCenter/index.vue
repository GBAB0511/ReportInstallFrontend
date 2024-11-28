<template>
  <div class="engineer-center">

    <section class="engineer-center-right">
      <router-view></router-view>
    </section>
  </div>
</template>
<script>

export default {
  name: "engineer-center-index",

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
.engineer-center {
  width: 100%;
  height: 100%;
  &:after {
    @include _clearBoth();
  }
  .engineer-center-left,
  .engineer-center-right {
    height: 100%;
  }
  .engineer-center-right {
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
    .idCard{
        width: 99%;
        height: 28px;
        line-height: 28px;
        margin-top:6px;
        // border: 1px solid #b4bccc;
        border-radius: 4px;
        .el-button,i{
          float: right;
          height: 28px;
          // line-height: 28px;
        }
        .el-input__inner{
          font-size: 14px;
        }
      }
  }
}
</style>
