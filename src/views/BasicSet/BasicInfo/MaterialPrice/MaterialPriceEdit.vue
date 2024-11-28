<template>
  <div>
    <el-form class="formBill-One" ref="MaterialPriceEditForm" :rules="rules" :inline="true" size="mini" :model="formData" label-width="100px">
      <el-form-item label="材料编号：" prop="matrNo">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="number" v-model="formData.matrPrice" maxlength="10" clearable >
        </el-input>
      </el-form-item>
      <el-form-item label="材料单价：" prop="matrPrice">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" v-model="formData.matrPrice" maxlength="10" clearable placeholder="请输入材料单价" onkeyup="value=(value.replace(/\D/g,'')==''?'0':parseInt(value))">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "MaterialPriceEdit",
  data() {
    return {
      formData: {
        id: "",
        matrNo: "",
        matrPrice:  "",
      },
    }
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
      this.$refs.MaterialPriceEditForm.resetFields();
    },
    submitForm() {
        let _this = this;
        let params = {};
        if(this.formData.id){
          params = {
            "busicode": "MatrUpdate",
            "data": this.formData
        }
        }else{
          params = {
            "busicode": "MatrAdd",
            "data": this.formData
        };
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.$message({
            showClose:true,
            message:'保存成功',
            type:'success',
          });
          _this.$parent.init();
          _this.$parent.closeDialog();   
        })
    },
    editData(val) {
      console.log(val);
      this.formData.id = val[0].matrPriceId;
      this.formData.matrNo=val[0].matrNo;
      this.formData.matrPrice=val[0].matrPrice;
      console.log(this.formData);
    }
  },
}
</script>

