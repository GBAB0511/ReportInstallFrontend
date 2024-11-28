
<template>
  <div class="register">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <!-- <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('ManagementAreaEdit')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div> -->
      </div>

      

      <div class="register-right-content">
            <div class="toolbal">
                <el-form :inline="true" size="mini">
                    <el-form-item class="form-left">
                        <el-form-item label="请选择您想要新建单据类型：">
                            <el-cascader :options="options" :show-all-levels="false" v-model="document"></el-cascader>
                        </el-form-item>
                    </el-form-item>
                </el-form>
                
            </div>

        <div class="kr-table">

        </div>

        </div>
      </div>

</template>
<script>
export default {
  name: "management-area-index",
  data() {
    return {
        document:[],
        EditVisible:false,//弹出表单
        crumbsData: {  //面包屑
            titleList: [
            { title: '流程审批', path: '/ProcessApproval' },
            { title: '新建', path: '/ProcessApproval' },
            ],
        },
        options:[
            { 
                label: '工程管理', 
                value: '222', 
                children: [
                { label: '用水需求咨询', value: '22' }, 
                { label: '内部工程', value: '222' }, 
                ] 
            },
            { 
                label: '客户管理', 
                value: '122', 
                children: [
                { label: '用户资料变更', value: '121' }, 
                { label: '用水类型变更', value: '122' }, 
                { label: '用水人口变更', value: '123' }, 
                { label: '优惠用水变更', value: '124' },
                { label: '缴费方式变更', value: '125' }, 
                { label: '开票资料变更', value: '126' }, 
                ] 
            },
            { 
                label: '表计管理', 
                value: '222', 
                children: [
                { label: '换表', value: '321' }, 
                { label: '复表', value: '322' }, 
                { label: '校表', value: '323' }, 
                ] 
            }
        ],
    }
  }, 
  
 
}
</script>
<style lang="scss"> 
.register {
  width: 100%;
  height: 100%;
  .register-right-content {
    height: calc(100% - 41px);
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    .kr-right{
      width: 20%;
      height: 100%;
      // border: 2px solid red;
    }
    .kr-left{
      margin-top: 10px;
      width: 80%;
      padding-left:1rem;
      padding-right:1rem;
    }
  }
  .btn-area{
    div{
      width: 100%;
      float: right;
      .el-button{
        float: right;
      }
    }
  }
}
</style>
