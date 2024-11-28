
<template>
    <div class="ServiceCentre">

        <aside class="ServiceCentre-right">
                <router-view></router-view>
        </aside>
    </div>
</template>
<script>
// import CustomerNotification from './CustomerNotification'
export default {
    name:"ServiceCentre",
    data(){
        return{

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
    .ServiceCentre{
        width: 100%;
        height: 100%;
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
        .ServiceCentre-right{
            width: 100%;
            height: 100%;
        }

        
        
    }
</style>
