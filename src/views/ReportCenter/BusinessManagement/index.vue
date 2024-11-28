<template>
    <div class="BusinessManagement">
        <div class="bread-contain">
            <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        </div>
        <BusinessManagements class="Business" :areaShow="false"></BusinessManagements>
    </div>
</template>
<script>
import BusinessManagements from "../../EngineeringAnalysisReport"
export default {
    name:"BusinessManagement",
    components:{
        BusinessManagements
    },
    data(){
        return{ 
            crumbsData :{  //面包屑
                titleList:[
                    { title: '统计报表' },
                    { title: '业务办理分析' }
                ],
                
            },
        }
    },
}
</script>
<style lang="scss">
.BusinessManagement{
    width: 100%;
    height: 100%;
    .Business{
        height: calc(100% - 40px);
        width: 100% ;
    }
}
</style>
