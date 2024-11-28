<template>
    <div class="HallBusiness">
         <!-- <div class="bread-contain">
            <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
   
        </div> -->
        <!-- 营业大厅 -->
        <div  class="HallBusinessCon">
            <IntegratedBusiness></IntegratedBusiness>
        </div>

    </div>
</template>
<script>
import IntegratedBusiness from "@/components/IntegratedBusiness"

export default {
    name:"",
    components:{
        IntegratedBusiness
    },
    data(){
        return{
            crumbsData :{  //面包屑
                titleList:[
                    {title:'服务中心',path:'/ServiceCentre'},
                    {title:'营业大厅',method:()=>{window.histroy.back()}},
             

                ],
                
            },
        }
    }
}
</script>
<style lang="scss">
.HallBusiness{
    position: relative;
    width: 100%;
    height: 100%;
    .HallBusinessCon{
        height: 100%;
        padding-left: 10px;
    }
    .bread-contain{
        height: 41px;
    }


}
</style>
