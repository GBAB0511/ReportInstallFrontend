<template>
    <div class="CustomerManagement">
        <div class="bread-contain">
            <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        </div>
        <CustomerManagements class="Customer" :areaShow="false"></CustomerManagements>
    </div>
</template>
<script>
import CustomerManagements from "../../ChargeAnalysisStatement"
export default {
    name:"CustomerManagement",
    components:{
        CustomerManagements
    },
    data(){
        return{ 
            crumbsData :{  //面包屑
                titleList:[
                    { title: '统计报表' },
                    { title: '客户管理中心' }
                ],
                
            },
        }
    },
}
</script>
<style lang="scss">
.CustomerManagement{
    width: 100%;
    height: 100%;
    .Customer{
        height: calc(100% - 40px);
        width: 100% ;
    }
}
</style>
