<template>
    <div class="changeMatters">
        <span>{{changeMattersData}}</span>
    </div>

</template>
<script>
export default {
    name:"changeMatters",
    props:['changeMattersData'],
    data(){
        return{
        }
    },
    mounted() {
        
    },
}
</script>
<style lang="scss">
.changeMatters{    
    padding-top: 10px;
    margin: 10px 0px 10px 80px;
    font-size: 12px;
    .changeContent{
        display: inline-block;   
        margin-right: 10px;
        .changeContent-num{
            font-style: initial;
        }
        .changeContent-lable{
            font-style: initial;
            color: #a0a0a0;
        }
        .el-icon-right{
            font-weight: 700;
            color: #1d51c5;
        }
        .weightFont{
            font-style: initial;
            font-weight: 700
        }
    }
}
</style>
