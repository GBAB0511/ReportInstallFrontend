<template>
  <div class="projectPayment" style="height:150px;">
    <el-form
      ref="collectForm1"
      :model="collectForm"
      :rules="collectFormRules"
      size="mini"
      inline
      label-width="150px"
      label-position="center"
    >
      <el-form-item prop="money" label="收款金额：" class="money">
        <el-input oninput ="value=value.replace(/[^0-9.]/g,'')"  placeholder="请输入金额" v-model="collectForm.money"></el-input>
      </el-form-item>
      <!--
      <el-form-item prop="pjType" label="收款类型：">
        <el-select v-model="collectForm.type" style="width:200px">
          <el-option
            style="width:200px"
            v-for="item in dict.BPT"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="sourceFlag" label="备注：" class="sourceFlag">
        <el-input :rows="3" placeholder="请输入备注" type="textarea" v-model="collectForm.notes"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["dict", "editData"],
  data() {
    return {
      id:'',
      collectForm: {
        money: "",
        type: "2",
        notes: "",
        projectCode: "",
        projectName: "",
        projectDate: "",
        projectAddress: "",
        clientName: "",
        constructionUnit: ""
      },
      collectFormRules: {
        money: [
          { required: true, message: "收款金额不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    initData(){
      this.collectForm.money=''
      this.collectForm.notes=''
    },
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    pjClSave({ consult, ctmInfo }) {
        //console.log('consult', consult)
      this.$refs["collectForm1"].validate(valid => {
        if (valid) {
          this.collectForm.projectCode = consult.billNo;
          this.collectForm.projectName = consult.pjName;
          this.collectForm.projectDate = consult.createTime;
          this.collectForm.projectAddress = consult.installAddr;
          this.collectForm.clientName = ctmInfo.ctmName;
          this.collectForm.constructionUnit = consult.constructionUnit;
          let params = {
            busicode: "PjCollectionInsert",
            data: { ...this.collectForm }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then((res) => {
               this.$message({
                type: "success",
                message:'工程收款新增成功'
              });
             this.$emit('success');
             const params={
                        "busicode": "ProcessCommit",
                        "data":{
                            "billId":res,
                            "formVariables":{},
                            "operation":32,
                            "receiptType":"pj_collection",
                            "title":"审批流配置:报装(工程收款)"
                        },

                        token: sessionStorage.getItem('token'),
                    }
                    this.$api.fetch({
                        params: params,//参数
                    })
            });
        } else {
          return false;
        }
      });
    },
    resetField() {
      this.$refs.collectForm1.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.projectPayment {
  .col-2 {
    width: calc(46% + 10px);
  }
  .money  >>>  .el-input__inner {
    padding-right: 0px !important;
    width: 100%;
    font-size: 14px;
}
/deep/ .el-form-item{
  // text-align: center;
  margin-top: 20px;
  .el-select{
    lable-width:100%
  }
  .el-input__inner{
    width:250px
  }
  .el-textarea__inner{
    width:250px
  }
}
}
</style>
