<template>
    <div class="CounterCharges">
        <div class="bread-contain">
            <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
            <!-- <h2 class="tab-title">
            <i></i>
            现金收费</h2> -->
        </div>
        <IntegratedBusiness></IntegratedBusiness>
    </div>
</template>
<script>
import IntegratedBusiness from "@/components/IntegratedBusiness"
export default {
    name:"CounterCharges",
    components:{
        IntegratedBusiness
    },
    data(){
        return{
            crumbsData :{  //面包屑
                titleList:[
                    {title:'账务中心',path:'/FinancialCenter'},
                    {title:'柜台收费',method:()=>{window.histroy.back()}},
                    {title:'现金收费',method:()=>{window.histroy.back()}}
                ],
                
            },
        }
    }
}
</script>
<style lang="scss">
.CounterCharges{
        padding:0px 20px;
    .el-form--inline .el-form-item{
        margin-right:15px;
    }
    .el-radio,.el-checkbox{
        margin-right:10px;
    }
    .el-radio__label{
        font-size: 12px;
    }
}

           
        
  
</style>

