
<template>
  <div class="WaterTypeEdit">
    <div>
      <el-form class="formBill-One" ref="WaterTypeEditForm" :rules="rules" :inline="true" size="mini" :model="formData" label-width="100px">
        <el-form-item label="类型名称：" prop="waterTypeName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.waterTypeName" maxlength="50" clearable placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sortNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="formData.sortNo" placeholder="排序号" maxlength="6" clearable></el-input>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "WaterTypeEdit",
  data() {
    return {
      formData: {
        id: "",
        waterTypeNo: "",
        waterTypeName: "",
        sortNo: "",
        status: "",
        parentId:"",
      },
      rules: {
        waterTypeName: [
          { required: true, message: "请输入类型名称", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        sortNo: [
          { required: true, message: "请输入排序号", trigger: "blur" },
          { type: "number", message: "排序号必须为数字值" }
        ]
      }
    };
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //保存按钮
    resetForm() {
      this.$refs.WaterTypeEditForm.resetFields();
    },
    submitForm(type, parentId) {
      let _this = this;
      let params = {};
      if (type === "WaterTypeAdd") {
        this.formData.parentId = parentId;
        params = {
          busicode: "WaterTypeAdd",
          data: this.formData
        };
      } else {
        params = {
          busicode: "WaterTypeUpdate",
          data: this.formData
        };
      }
      this.$api.fetch({ params: params})
        .then(res => {
          _this.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          });
          // if (type === "WaterTypeAdd") {
            _this.$parent.getTreeDatas();
          // } else {
            _this.$parent.init();
          // }
          _this.$parent.closeDialog();
        });
    },
    handleClose() {
      this.common.chargeObjectEqual(this,this.formData,'get','WaterTypeEdit',this.$parent.closeDialog);
    },
    editData(val) {
      this.formData = val;
    }
  } 
};
</script>
<style lang="scss">
.WaterTypeEdit {
  height: 100%;
  width: 100%;
}
</style>
