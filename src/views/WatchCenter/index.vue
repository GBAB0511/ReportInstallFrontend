<template>
    <div class="watch-center">

        <aside class="watch-center-right">
                <waterMeterInquiry v-if="$route.path==='/WaterMeterInquiry'"></waterMeterInquiry>
                <router-view v-else></router-view>
        </aside>
    </div>
</template>
<script>
import waterMeterInquiry from './WaterMeterInquiry'
export default {
    name:"watch-center",
    components:{
        waterMeterInquiry
    },
    data(){
        return{

            
           
        }
    },


}
</script>
<style lang="scss">
  @import "../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
  $theme-color:#297acc;
    .watch-center{
        .el-table{
            .el-button--text {
                line-height: 5px;
                font-size: 12px;
            }
        }
        #crumbs {
            // border-bottom: 1px solid #eaf4ff;
        }
        &:after{
            @include _clearBoth()
        }
        & > .watch-center-right{
            width: 100%;
            height: 100%;
        }
        
    }
</style>
