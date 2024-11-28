<template>
    <div class="ShortMessageSending">
        
         <div class="backfillSubmitForm">
        <el-form :model="formData" size="mini"  class="basicInfoForm"   label-width="150px">
            <el-form-item label="用户编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="200101" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名称：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.watermeterWarehouse" placeholder="用户名称" clearable disabled class="read-only"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.waterMeterManufacturer" placeholder="手机号码" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="操作人：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.waterMeterType" placeholder="管理员" clearable disabled class="read-only"></el-input>
            </el-form-item> -->
            <el-form-item label="短信内容：">
                <el-input type="textarea" v-model="formData.waterMeterCaliber" placeholder="短信内容" :rows="7" clearable></el-input>
            </el-form-item>

            <el-form-item class="sentMesg">
                
                <el-button  type="primary"  @click="demand" >发送</el-button>
                <el-button  type="primary"  @click="demand" >重填</el-button>
            </el-form-item>
        </el-form>
         </div>
    </div>
</template>
<script>
export default {
    name:"ShortMessageNotification",
    data() {
      return {
        crumbsData :{  //面包屑
            titleList:[
                {title:'服务中心',path:'/ServiceCentre'},
                {title:'客户通知',method:()=>{window.histroy.back()}}
            ],
            
        },
        formData:{
            con:"",
            watermeterWarehouse:"",
            watermeterWarehouseOptions:[],
            waterMeterManufacturer:"",
            waterMeterManufacturerOptions:[],
            waterMeterType:"",
            waterMeterTypeOptions:[],
            waterMeterCaliber:"",
            waterMeterCaliberOptions:[],
            waterMeterStatus:"",
            waterMeterStatusOptions:[],
            subordinateDepartments:"",
            subordinateDepartmentsOptions:[]

        },
        rules:{
            watermeterWarehouse:[
                { required: true, message: '请选择短语', trigger: 'blur' },
            ],
            desc:[
                { required: true, message: '请输入用户编号', trigger: 'blur' },
            ]
        },

      };
    },
    methods: {
        init(){

        },

       demand() {  //查询
        // this.tableQuery.page = 1
        // this.tableQuery.pageCount = 20
        this.init()
      },
   

    },

  };
</script>
<style lang="scss">
.ShortMessageSending{
    
    height: 100%;
    width: 80%;
    margin: 0 auto;
    .backfillSubmitForm{
        .sentMesg{
            .el-form-item__content{
                margin-left: 330px !important;
            }
        }
        .el-form-item  { 
            margin-bottom: 30px;
            } 
        .el-input--mini /deep/ .el-input__inner{
                width: 100%;
        }
    }
}



</style>

