
<template>
    <div class="FinancialCenter">
        <aside class="FinancialCenter-right">
                <router-view ></router-view>
        </aside>
    </div>
</template>
<script>
export default {
    name:"FinancialCenter",
    data(){
        return{
            navTree:[],
            activeIndex:"/EngineeringFees",
        }
    },
    mounted(){
        
    },
    methods:{
      
    },

}
</script>
<style lang="scss">
  @import "../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
$theme-color:#297acc;
    .FinancialCenter{
        .el-table{
            .el-button--text {
                line-height: 5px;
                font-size: 12px;
            }
        }
        #crumbs {
            border-bottom: 1px solid #eaf4ff;
        }
        &:after{
            @include _clearBoth()
        }

        & > .FinancialCenter-right{
            width: 100%;
            height: 100%;
        }
        
    }
</style>
