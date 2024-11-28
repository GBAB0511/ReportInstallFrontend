


<template>
    <div class="CommonFormManagementEdit">

         <div class="backfillSubmitForm">
            <el-form class="basicInfoForm" :inline="true" size="mini" :model="backfillSubmitForm" label-width="150px">
            <el-form-item label="发布常用表格：" prop="userNume">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action=""
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                    <div slot="tip" class="el-upload__tip">(支持.xlsx、.xls、.docx、doc格式)</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="文件名：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="CommonFormManagementEditForm.fileName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="描述：">
                <el-input type="textarea" :rows="4" v-model="CommonFormManagementEditForm.userNume" placeholder=""></el-input>
            </el-form-item>
 
        </el-form>
    </div>

    </div>
</template>
<script>
export default {
    name:"CommonFormManagementEdit",
    data(){
        return{
            CommonFormManagementEditForm:{

               
                desc:"",
                userNume:"",
                descoptions:[],
                fileName:""
            },
            rules:{
                userNume:[
                    { required: true, message: '请输入用户编号', trigger: 'blur' },
                ],
                desc:[
                    { required: true, message: '请输入用户编号', trigger: 'blur' },
                ]
            },
            fileList:[]
                
        }
    },
    mounted(){

    },
     methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
}
</script>
<style lang="scss">
.CommonFormManagementEdit{
    height: 100%;
    width: 80%;
    margin: 0 auto;
    legend{
        background: #f5f5f5;
        font-weight: 700;
        font-size: 12px;
        padding: 5px 20px;
        font-size: 14px;
    }

        .Btngroup{
            width: 100%;
            .el-form-item__content{
                width:calc(100% - 160px);
            }
        }
    
    .el-steps--horizontal{
        margin: 0 auto;
        width: 50%;
        padding-bottom: 20px;
    }

}
</style>

