

<template>
  <div class="ContractTemplateEdit">

    <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" class="formBill-One" label-width="100px" :inline="true">

      <el-form-item label="模板名称：" prop="templateName">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.templateName" clearable placeholder="请输入模板名称" ></el-input>
      </el-form-item>

       <el-form-item label="合同类型：" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option label="供水合同" :value="1"></el-option>
          <el-option label="施工合同" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板：" prop="fjName" class="upload-demo">
      <!--<el-upload
            ref = "uploadExcel"
            class="upload-file"
            :action="submitAction"
            accept=".doc,.docx"
            multiple
            :limit="1"
            :file-list="fileList"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
            >
            <el-button type="primary" plain size="mini">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>-->
        <el-upload
          class="upload-file"
          multiple action="/" 
          ref="uploadFile"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :http-request="uploadAttachment"
          accept=".doc,.docx"
        >
          <el-button size="mini" type="primary">上传附件</el-button>
        </el-upload>
      </el-form-item>


    </el-form>
   
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ContractTemplateEdit",
  data() {
    return {
      ruleForm: {
      },
      tableQuery:{
        page:1,
        pageCount:20,
      },
       rules: {
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择合同类型：', trigger: 'blur' }
        ]
      },
      fileList:[],
      submitAction:'#',
      fjName:'',
      receiptId:'',
    }
  },
  mounted() {
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //上传附件
    uploadAttachment(file, fileList) {
      let _this = this;
      let type1 = (file.file.name).substring((file.file.name).lastIndexOf(".")+1)
      if(this.receiptId == "")
        this.receiptId = this.util.generateUUID()
      //const isDOC = file.file.type === 'application/msword';
      if (type1!='doc' && type1!='docx') {
        this.$message.error('上传文件的格式只能是doc或者docx ');
       return
      }
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.receiptId,
          receiptType: "contract_template",
          accessoryNo: "006",
          file: file.file
        },
        //token: "krrjdev123", //
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });
        });
    },
    // httpRequest(file) {
    //   let _this = this;
    //   var token =  sessionStorage.getItem('token');
    //   var fjName = this.$refs.uploadExcel.uploadFiles[0].name
    //   let RequestObj = {
    //      method:'post',
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" }
    //   }
    //   RequestObj.url = "contractTemplateUpload.api";
    //   var formData = new FormData();
    //   formData.append(
    //     "type",this.$parent.formType
    //   );
    //   formData.append("file", file.file);
    //   formData.append("fjName",  _this.fjName);

    //   RequestObj.data = formData;
    //    axios(RequestObj).then(res => {
    //     _this.$message({
    //       message: '上传成功！',
    //       type: 'success'
    //     });

    //     _this.submitData(fjName)
    //     _this.$refs.uploadExcel.clearFiles()
    //   }).catch(() => {
    //        _this.$refs.uploadExcel.clearFiles()
    //        // this.isCheckPage = false
    //        // this.getData()
    //   });
    // },
    beforeUpload(file) {

      let extension = file.name.substring(file.name.lastIndexOf('.')+1)
      let size = file.size / 1024 / 1024
      if(extension !== 'doc' && extension !== 'docx' ) {
        this.$notify.warning({
          title: '警告',
          message: `只能上传doc/docx的文件`
        });
        return false
      }
      // if(size > 3) {
      //   this.$notify.warning({
      //     title: '警告',
      //     message: `文件大小不得超过3M`
      //   });
      // }
    },
    submitForm(type) {

       let _this = this
       this.ruleForm.tempId = this.receiptId
       // this.ruleForm.fjName = fjName
        let params = {};
        if(type === 'ContractTemplateAdd'){
          params = {
            "busicode": "ContractTemplateAdd",
            "data": this.ruleForm
          }
        }else{
          delete this.ruleForm.fileDataList
          params = {
            "busicode": "ContractTemplateUpdate",
            "data": this.ruleForm
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
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //保存按钮
    
    // submitForm(type) {
    //   let _this = this;
    //   if(_this.$refs.uploadExcel.uploadFiles.length == 0) {
    //      this.$notify.warning({
    //       title: '警告',
    //       message: `请选择文件`
    //     });
    //      return;
    //   }
    //   if(type == 'ContractTemplateAdd') {
    //      _this.$refs.uploadExcel.submit();   
    //    }else {
    //       if(_this.$refs.uploadExcel.uploadFiles[0].name == _this.ruleForm.fjName) {
    //           _this.submitData(_this.ruleForm.fjName);
    //       }else
    //           _this.$refs.uploadExcel.submit();
    //    }
      
     
    // },
    closeDialog() {
      this.dialogTableVisible = false
    },
    editData(val) {
      if(val) {
         this.ruleForm = val;
         this.receiptId = this.ruleForm.id;
         this.ruleForm.fileDataList.forEach(v => {
          var obj = {}
           this.$set(obj,'name', v.accessoryName);
           this.$set(obj,'url',''); 
            this.fileList.push(obj);
         });
      //  this.fjName = this.ruleForm.fileDataList
      // var obj = {}
      // this.$set(obj,'name', this.fjName);
      // this.$set(obj,'url','');  //修改fileList里面的结构（name,url）
      // this.fileList.push(obj);
      }

     

    },
  },

}
</script>
<style lang="scss">
.ContractTemplateEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin: 0 auto;
  .formBill-One .el-form-item {
    margin-bottom: 25px;
    .el-input__icon {
    line-height: inherit;
  }
  }
}
</style>