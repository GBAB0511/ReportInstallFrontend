<template>
  <div class="MenuManageEdit">
    <div class="toolbar">
      <div class="info">
        <div class="toolbar-line"></div>添加菜单
      </div>
    </div>
    <el-form :inline="true" class="formBill-Two" size="mini" ref="MenuManageEditEditForm" :rules="rules" :model="formData" label-width="100px">
      <el-form-item label="菜单名称：" prop="opName">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.opName" maxlength="50" clearable placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="opFlag">
        <el-select v-model="formData.opFlag" placeholder="请选择菜单类型" clearable>
          <el-option label="菜单" :value="1"></el-option>
          <el-option label="按钮" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单路径：" prop="url">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="formData.url" clearable placeholder="请输入菜单路径">
        </el-input>
      </el-form-item>
      <el-form-item label="菜单标志：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="formData.symbol" clearable placeholder="请输入菜单标志">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "MenuManageEdit",
  props: ['editNeedData'],
  data() {
    return {
      formData: {
        opName: "",
        opFlag: "",
        url: "",
        symbol: "",
      },
      rules: {
        opName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        opFlag: [
          { required: true, message: "请输入类型", trigger: "change" },
        ],
      }
    };
  },
  mounted() {
    // console.log(this.editNeedData)
  },
  methods: {
    save() {
      let _this = this
      this.$refs['MenuManageEditEditForm'].validate((valid) => {
        if (valid) {
          this.formData.foreignkey = this.editNeedData.opCode
          var params = {
            "busicode": 'AddOperation',
            "data": this.formData,
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$message({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            });
            _this.$parent.closeDialog()
          })
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.MenuManageEdit {
  height: 95%;
  width: 95%;
  margin: 0 auto;
  .toolbar-line {
    width: 4px;
    background: #c4d600;
    border-radius: 4px;
    height: 1.5rem;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .info {
    margin: 10px 0px;
    font-weight: 700;
    color: #000;
    height: 1.5rem;
    line-height: 1.5rem;
    padding: 0 1rem;
    font-size: 14px;
  }
  .el-form-item {
    margin-bottom: 30px !important;
  }
}
</style>
