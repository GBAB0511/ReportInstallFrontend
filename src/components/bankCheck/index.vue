<template>
    <div class="bankCheck">
      <el-form class="" :inline="true" :model="formData" label-width="130px" ref="form" :rules="rules">
         <el-row>
             <el-form-item label="进账银行：" prop="incomeBank">
          <el-select  v-model="formData.incomeBank"  placeholder="" >
              <el-option v-for="(item,index) in incomeBankList" :key="index" :label="item.bankName+' '+item.bankAccount" :value="item.id" ></el-option>
            </el-select>
             </el-form-item>
         </el-row>
         <br>
           <!-- <el-row>
          <el-form-item label="银行流水：" prop="bankStatement" >
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.bankStatement" placeholder="请输入银行流水" ></el-input>
        </el-form-item>
             </el-row>
              <br>
              <el-row>
                 <uploadFile ref="uploadFiles" :receiptType="receiptType" @onOCRdone="onOCRdone"></uploadFile>
              </el-row>
              <br>
                <el-row>
          <el-form-item label="" >
          <el-input
          :style="{'width':'600px'}"
          type="textarea"
          :rows="9"
          placeholder="进账单文字识别区"
          v-model="OCRtext">
        </el-input>
        </el-form-item>
             </el-row>
             -->
      </el-form>
    </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件

export default {
  name: "bankCheck",
  components: {
    uploadFile,
  },
  data() {
    return {
      // 查询条件对象
      OCRtext:'',
      incomeBankList: [],
      formData: {
        incomeBank: "",
          // billPicture: "",
        // bankStatement: "",
      },
      receiptType: "income_bill",
        rules: {
        // bankStatement: [
        //   { required: true, message: '请输入银行流水', trigger: 'blur' }
        // ],
        incomeBank: [
          { required: true, message: '请选择进账银行', trigger: 'change' }
        ],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {

      getFormData(){
          let flag = null
          this.$refs.form.validate((valid) => {
              let _this = this
              if (valid) {
                // if(this.$refs.uploadFiles.picList.length == 0){
                //     this.$message.warning(`请上传进账单照片`);
                // flag = true
                // }
                flag =  this.formData;
              } else {
               flag = false
              }
            })
            return flag;
      },
    init() {
      this.getIncomeBankList();
      // let tempId = this.util.generateUUID();
      // eventBus.$emit("receiptId", tempId);
      // this.formData.billPicture = tempId;
    },

    // onOCRdone(text) {
    //   this.OCRtext = text;
    // },
    getIncomeBankList() {
      let _this = this;
      let params = {
        busicode: "IncomeBankList",
        data: {status:'1'},
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {
          this.incomeBankList = res.list;
          this.$emit('getIncomeBankListData',res.list)
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.bankCheck {
  padding: 10px;
  width: calc(100% - 20px);
  .kl-table {
    padding: 0px;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
}
</style>
