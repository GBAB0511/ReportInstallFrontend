<template>
    <div class="WaterTablesDetails">
        <!-- 弹出表单含添加和修改 -->
    	<!-- <el-dialog :title="echartsDetailsName" :close-on-click-modal="false" append-to-body :visible.sync="echartsDetailsVisible" @close="closeDialog" >
            <echartsDetails
             :echartName="echartsDetailsName"
            ></echartsDetails>

    	</el-dialog> -->
          <!-- 表格 -->
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                <el-form-item class="form-left">
                        
                    <el-form-item label="水司名称：">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.waterMeterCaliber" placeholder="请输入水司名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                    </el-form-item>
                    
               
                </el-form-item>
                    
                       
                        

                <el-form-item class="form-right">
                
                    <!-- <el-button  @click="add" size="mini" icon="el-icon-plus" type="primary">登记</el-button> -->
                    <!-- <el-button size="mini" type="primary" @click="backfill">回填</el-button> -->
                    <!-- <el-button size="mini" type="primary" @click="DetailedEnquiries">历史查询</el-button> -->
                </el-form-item>
            </el-form>

        </div>
        <el-table v-if="tableShow" class="listTable" border stripe :data="histroyData.list"
         >
          <el-table-column align="left"  min-width="60" label="NO." type="index"></el-table-column>

          <el-table-column align="left" prop="name" min-width="200" label="水司名称"></el-table-column>

          <el-table-column prop="value" min-width="200" label="用户总数（万）"></el-table-column>
          <el-table-column prop="Wvalue" min-width="200" label="微厅用户数（万）"></el-table-column>
          <el-table-column prop="Wvalue" min-width="200" label="网厅用户数（万）"></el-table-column>

        </el-table>
          <!-- 表格 -->
        <el-table v-if="!tableShow" class="listTable" border stripe :data="listData.list"
         >
          <el-table-column align="left"  min-width="60" label="NO." type="index"></el-table-column>

          <el-table-column align="left" prop="name" min-width="150" label="水司名称"></el-table-column>

          <el-table-column prop="month" min-width="120" :label="`本期（${unit}）`"></el-table-column>


          <el-table-column prop="circle" min-width="120" :label="`上年同期（${unit}）`"></el-table-column>

          <el-table-column prop="LMonth" min-width="120" label="同比（%）"></el-table-column>
          <el-table-column prop="circle" min-width="120" :label="`本年（${unit}）`"></el-table-column>

          <el-table-column prop="year" min-width="120" label="年累计同比（%）"></el-table-column>


        </el-table>
    </div>
</template>
<script>
import echartsDetails from "./echartsDetails"
export default {
    name:"WaterTablesDetails",
    components:{
        echartsDetails,
    },
    props:{
        histroyData:{
            type:Object,
            default:{
 
                list:[
                    {
                        name:"南沙",
                        value:"10万"
                    },
                    {
                        name:"梧州",
                        value:"10万"
                    },
                    {
                        name:"南沙",
                        value:"10万"
                    },
                ]

            }
        },
        listData:{
            type:Object,
            default:{
 
                list:[
                    {
                        name:"肇庆",
                        month:"98%",
                        year:"97%",
                        LMonth:"96%",
                        circle:"95%"
                    },
                ]

            }
        },
        echartsDetailsName:{
            type:String,
            default:""
        },
        tableShow:{
            type:Boolean
        },
        unit:{
            type:String
        }
    },
    data(){
        return{
            echartsDetailsVisible:false,
            // tableShow:true,
            formData:{}
        }
    },
    // created(){
    //     if(this.echartsDetailsName==="用户总数"){
    //         this.tableShow = true;
    //     }else{
    //         this.tableShow = false;
    //     }
    // },
    mounted(){

    },
    methods:{
        inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        // cellClick(row, column, cell, event){
        //     if(column.label==="水司名称"){
        //         this.echartsDetailsVisible = true;
        //     }
        // },
        // closeDialog(){ //关闭会话
        //     this.echartsDetailsVisible = false;
        // },
    },
    watch:{
        // echartsDetailsName(newval){
        //     if(newval==="用户总数"){
        //         this.tableShow = true;
        //     }else{
        //         this.tableShow = false;
        //     }
        // }
    }
}
</script>
<style lang="scss">
    .WaterTablesDetails{
        padding: 10px 20px; 
        .el-table td,.el-table th,.el-table__body-wrapper td{
            text-align: center;
        }
        .toolbar{
            padding:0px;
        }
    }
    .listTable{
        width: 100%;
        margin: 0 auto;
        height: 100%;
        overflow: auto;
        // .el-table__body-wrapper tr td:nth-child(2) .cell {
        //     color: #31b7fa;
        //     cursor: pointer;
        // }
        
    }
</style>
