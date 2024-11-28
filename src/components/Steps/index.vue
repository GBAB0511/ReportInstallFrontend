<template>
    <div class="Steps">
        <ul>
            <li @click="getNum(v)" v-for="(v,i) in step" :key="i" class="stepCon">
                <b>{{v.num}}</b>
                <span>{{v.title}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:"Steps",
    props:{
        step:{
            type:Array,
            default:[],
        },
        active:{
            type:Number,
            default:2
        }
    },
    data(){
        return{

        }
    },
    mounted(){
        $(`.stepCon:lt(${this.active})`).addClass("Completed")
        $(".stepCon").eq(this.active).addClass("HaveInHand")
        $(`.stepCon:gt(${this.active})`).addClass("NotProceeding")

        $(".stepCon").eq(0).addClass("is-active").siblings().removeClass('is-active')
    
    },
    methods: {
        getNum(item){
            if(item.num < 11){
                eventBus.$emit('operation', item);
                let num = Number(item.num) - 1;
                console.log(item);
                $(".stepCon").eq(num).addClass("is-active").siblings().removeClass('is-active')
            }
        },
    },
}
</script>
<style lang="scss">
.Steps{
    & > ul{
        padding-bottom: 15px;
        zoom: 1;
        &::after{
            content: "";
            display:block;
            clear: both;
        }
        li{
            float: left;
            padding: 0px 3px;   
            line-height: 38px;  
            background: #50abe4;    
            color: #fff;  
            position: relative; 
            padding-left: 29px;
            margin-right: 10px;
            b{
                font-size:18px;
                color: #48cc7c;
                // margin-right: 10px;
                margin-right:1px ;
                background: #fff;
                border-radius: 50%;
                // padding:3px 8px;
                padding:3px 5px;
            }
            span{
                font-size: 16px;
            }
            &:first-child{
                border-radius: 5px 0px 0px 5px;
                padding-left: 14px;
            }
            // &:last-child{
            //     border-radius: 0px 5px 5px 0px;
            // }
            &:after{  
                content: '';  
                display: block;  
                border-top: 20px solid transparent;
                border-bottom: 18px solid transparent;
                border-left: 20px solid #48cc7c;
                position: absolute;   
                right: -20px;   
                top: 0;  
                z-index: 11;
            }
            &:before{  
                content: '';  
                display: block;  
                border-top: 20px solid transparent;  
                border-bottom: 20px solid transparent;  
                border-left: 20px solid #FFF;  
                position: absolute;   
                left: 0px;   
                top: 0;  
            }
        }
        
        .Completed{
            background: #48cc7c; 
            &:after{
                border-left: 20px solid #48cc7c;
            }
        }
        
        .HaveInHand{
            background: #46b5e8; 
            &:after{
                border-left-color: #46b5e8; 
            }
            b{
                color:#46b5e8;
            }

        }
        .NotProceeding{
            background: #ededee; 
            color:#bababb;
            &:after{
                border-left-color: #ededee; 
            }
            b{
                color:#bababb;
            }
        }
        .is-active{
            // color: red;
            // width: 8%;
            span{
                font-weight: 1000 !important;
            }
        }
        // .NotProceeding:last-child:after{
        //     display: none;            
        // }
        li:first-child:before{    
            display: none !important;
            z-index: 111;    
        }    
    }
}
</style>
