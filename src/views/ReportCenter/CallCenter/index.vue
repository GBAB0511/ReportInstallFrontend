<template>
    <div class="CallCenter">
        <div class="bread-contain">
            <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        </div>
        <CallCenters class="Call" :areaShow="false"></CallCenters>
    </div>
</template>
<script>
import CallCenters from "../../AnalysisCenter/StatementAnalysisReport"
export default {
    name:"CallCenter",
    components:{
        CallCenters
    },
    data(){
        return{ 
            crumbsData :{  //面包屑
                titleList:[
                    { title: '统计报表' },
                    { title: '呼叫中心分析' }
                ],
                
            },
        }
    },
}
</script>
<style lang="scss">
.CallCenter{
    width: 100%;
    height: 100%;
    .Call{
        height: calc(100% - 40px);
        width: 100% ;
    }
}
</style>
