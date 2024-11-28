<template>
    <div class="procedure">
                    <img :src='scrAdd' alt="">
    </div>
</template>
<script>
export default {
    name:"procedure",
    props:{
    },
    data(){
        return{
            scrAdd:require("@/assets/images/Process.png")
        }
    }
}
</script>
<style lang="scss">
.procedure{
    width: 100%;
    height: 100%;
    padding-top:10px;
    img{
        margin: 10px 0px 0px 30px;
        height: 100%;
        width:  calc(100% - 157px);
    }
}
</style>
