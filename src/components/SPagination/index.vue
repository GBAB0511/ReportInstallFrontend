<template>
    <div class="SPagination">
        
        <div :class="{up:true,currentUP:Isfirst}" @click="pre"></div>
        <i class="pageNum">{{currPage}}/{{total}}</i>
        <div :class="{down:true,currentDown:Islast}" @click="next"></div>
    </div>
</template>
<script>
export default {
    name:"SPagination",
    props:{
        lastPage:{
            type:Number,
            default:1
        },
        total:{
            type:Number,
            default:2
        },
    },
    data(){
        return{
            Isfirst:true,
            Islast:false,
            currPage:this.lastPage,
        }
    },
    mounted(){
        
    },
    methods:{
        pre(){
            if(this.currPage>2){
                this.currPage--;
                this.Isfirst = false;
                this.Islast = false;
            }else if(this.currPage===2){
                this.currPage--;
                this.Isfirst = true;
                this.Islast = false;
            }
            this.$emit('pre',this.currPage);
        },
        next(){
            if(this.currPage<this.total-1){
                this.currPage++;
                this.Isfirst = false;
                this.Islast = false;
            }else if(this.currPage===this.total-1){
                this.currPage++;
                this.Isfirst = false;
                this.Islast = true;
            }
            this.$emit('next',this.currPage);
        }
    },

}
</script>
<style lang="scss">
.SPagination{
    zoom: 1;
    &::after{
        display: block;
        content: '';
        clear: both;
    }
    .up{
        float: left;
        width: 0px;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 14px solid #000;
        font-size: 0;
        line-height: 0;
    }
    .down{
        float: left;
        width: 0px;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 14px solid #000;
        font-size: 0;
        line-height: 0;
    }
    .pageNum{
        float: left;
        padding-left: 5px;
        padding-right: 5px;
        color: #7b7b7b;
        font-size: 13px;
    }
    .currentUP{
        border-bottom-color: #aaaaaa;
        cursor:not-allowed;
    }
    .currentDown{
        border-top-color: #aaaaaa;
        cursor:not-allowed;
    }
}
</style>
