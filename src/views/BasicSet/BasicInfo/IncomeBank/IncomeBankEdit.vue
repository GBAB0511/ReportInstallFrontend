<template>
  <div class="IncomeBankEdit">
    <div class="main-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="formBill-One"
        label-width="100px"
        :inline="true"
      >
        <el-form-item label="银行名称：" prop="bankName">
          <el-input
            v-model="ruleForm.bankName"
            @input="e => input = inputMe(e)"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" prop="bankAccount">
          <el-input
            @input="e => input = inputMe(e)"
            v-model="ruleForm.bankAccount"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
           <el-form-item label="默认银行：" prop="isDefault">
     <el-radio-group v-model="ruleForm.isDefault">
      <el-radio label="0">非默认</el-radio>
      <el-radio label="1">默认银行</el-radio>
    </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：" prop="status" class="select-f1">
          <el-select v-model="ruleForm.status" placeholder="请选择">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
   props:['isExistDefult'],
  name: "IncomeBankEdit",
  data() {
    return {
      ruleForm: {
        bankName: "",
        bankAccount: "",
        isDefault:"0",
        status: "1" //默认启用
      },
      status: [
        {
          label: "启用",
          value: "1"
        },
        {
          label: "停用",
          value: "0"
        }
      ],
      rules: {
        bankName: [
          { required: true, message: "请输入银行名称", trigger: "blur,change" }
        ],
        bankAccount: [
          { required: true, message: "请输入银行账号", trigger: "blur,change" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "blur,change" }
        ],
        isDefault: [
          { required: true, message: "请选择默认银行", trigger: "blur,change" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //保存按钮

    submitForm(type) {
      let _this = this;
      if(this.ruleForm.isDefault == 1 && this.isExistDefult.some((i)=>this.ruleForm.id !== i)){
           _this.$message({
                message: "提交失败，当前已存在默认银行",
                type: "error"
              });
        return;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return false;
        } else {
          
          let params = {
            busicode: type,
            data: this.ruleForm
          };

          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              _this.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
              _this.$parent.init();
              _this.$parent.closeDialog();
            });
        }
      });
    },

    editData(val) {
      this.ruleForm = val;
      this.ruleForm.isDefault = String(this.ruleForm.isDefault);
    }
  }
};
</script>
<style lang="scss">
.IncomeBankEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin: 0 auto;

  .main-content {
    border: none !important;

    width: calc(100% - 20px);
    height: calc(100% - 20px);
    .kl-table {
      height: calc(100% - 41px);
    }
  }
  .select-f1 {
    .el-input__icon {
      line-height: 0;
    }
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-form-item__error {
    position: static !important;
  }
}
</style>
