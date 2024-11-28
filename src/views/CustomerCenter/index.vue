<template>
    <div class="customerCenter">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:"customerCenter",
    data(){
        return{}
    },

}
</script>
<style lang="scss">
    @import "../../assets/styles/scss/base/fn";
    $imgWidth: 200px;
    $theme-color:#297acc;
    .customerCenter{
        &:after{
            @include _clearBoth()
        }
        width: 100%;
        height: 100%;
        &> div{
            height: 100%;
            
        }
        // .formBill span {
        //     font-size: 12px;
        // }
    }
</style>
