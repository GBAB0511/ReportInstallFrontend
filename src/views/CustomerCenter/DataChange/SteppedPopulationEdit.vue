

<template>
    <div class="SteppedPopulationEdit">

        <el-form class="SteppedPopulationForm" :inline="true" :model="SteppedPopulationEditForm" label-width="160px">
            <el-form-item label="用户编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="SteppedPopulationEditForm.userNume" :disabled="isEdit" placeholder=""></el-input>
                <!-- <el-button class='searchBtn' icon="el-icon-search"></el-button> -->
            </el-form-item>
            <el-form-item :label="v.label" v-for="(v,i) in SteppedPopulationEditForm.backfillInput" :key="i">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="v.value" :placeholder="v.tips" :disabled="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="证件类型：">
                <el-select  clearable v-model="SteppedPopulationEditForm.Remarks" placeholder="" disabled>
                    <el-option  v-for="(item,index) in SteppedPopulationEditForm.descoptions" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件号码：" style="margin-left: -3px width: calc(46% + 10px)" >
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="证件号码" v-model="SteppedPopulationEditForm.documentNumber" class="input-with-select" clearable disabled>
                    <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="用水人数：" style="margin-left: -3px">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="SteppedPopulationEditForm.userNum" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="备注：" class="long_textarea">
                <el-input type="textarea" :rows="2" v-model="SteppedPopulationEditForm.year" placeholder=""></el-input>
            </el-form-item>
            <el-form-item style="float: right;" class="btnBox">
                <el-button size="mini" type="primary" style="float: right;" icon="el-icon-plus" @click="addTable">添加行</el-button>
            </el-form-item>
            <el-table      
                stripe
                border
                :data="histroyData.list"
                class="change-tables-table">

                <el-table-column 
                    type="index"  label="NO."
                    width="50" 
                    fixed="left"
                    :index="indexMethod">
                     
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="用户姓名">
                    <template slot-scope="scope">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                    
                <el-table-column
                    prop="type"
                    label="证件类型">
                    <template slot-scope="scope">
                        <el-select  clearable v-model="scope.row.type" placeholder="">
                            <el-option  v-for="(item,index) in SteppedPopulationEditForm.descoptions" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="num"
                    min-width="160"
                    label="证件号码">
                    <template slot-scope="scope">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" placeholder="证件号码" v-model="scope.row.num" class="input-with-select" clearable>
                            <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" @click="idCard()" size='mini'></el-button>
                        </el-input>
                    </template>

                </el-table-column>

                <el-table-column
                    prop="connect"
                    label="座机号码">
                    <template slot-scope="scope">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="scope.row.connect"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="des"
                    min-width="180"
                    label="备注">
                    <template slot-scope="scope">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="scope.row.des"></el-input>
                    </template>
                </el-table-column>



                </el-table>


            
        </el-form>

    </div>
</template>
<script>
export default {
    name:"SteppedPopulationEdit",
    components:{
    },
    props:{
        isEdit:{
            type:Boolean,
        }
    },
    data(){
        return{
            SteppedPopulationEditForm:{
                // 查询内容
                backfillInput:[

                     {
                        label:"用户名称：",
                        value:"",
                        tips:""
                    },
                    
                    {
                        label:"用户地址：",
                        value:"",
                        tips:""
                    },
                    
                    {
                        label:"联系人：",
                        value:"",
                        tips:""
                    },
                    {
                        label:"座机号码：",
                        value:"",
                        tips:""
                    },
                     {
                        label:"手机号码：",
                        value:"",
                        tips:""
                    },

                   
                ],
                desc:"",
                userNume:"",
                descoptions:[
                    {
                        name:'居民身份证',
                        value:'0'
                    },
                    {
                        name:'护照',
                        value:'1'
                    },
                    {
                        name:'户口本',
                        value:'2'
                    },
                    {
                        name:'回乡证',
                        value:'3'
                    },
                    {
                        name:'台胞证',
                        value:'4'
                    },
                ],
                userNum:"",
                PriceStrategy:"",
                isfines:"",
                UpdateCodeCopye:"",
                Remarks:"",
                year:""
            },
            histroyData:{
                
            },
    
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        init(){
            this.histroyData = {
                list: [
                    {
                    name: "张三",
                    type: "身份证",
                    num: "444210199909100030092",
                    connect: "1990000003",
                    des: "",   
                    },
                     {
                    name: "张三",
                    type: "身份证",
                    num: "444210199909100030092",
                    connect: "1990000003",
                    des: "",   
                    },
                ],
                nextPage: 0,
                pageNum: 1,
                pageSize: 20,
                pages: 1,
                prePage: 0,
                size: 5,
                startRow: 1,
                total: 5,
            }
        },
        addTable(){
            this.histroyData.list.push({});
        },
        
        indexMethod(index) {//获取表格序号
            return (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1);
        },

    }
}
</script>
<style lang="scss">
.SteppedPopulationEdit{
    height: 83%;
    overflow-y: auto;
    .SteppedPopulationForm{
        // margin-top: 15px;
        .el-input__inner{
            height: 30px;
        }
    }
    .SteppedPopulationForm{
        padding: 0 10px;
        width: 98%;
        .el-form-item{
            width: 32%;
            margin-bottom: 10px;
            .el-form-item__content{
                width: 48%;
                .el-select{
                    width: 100%;
                    height: 30px !important;
                    line-height: 30px;
                    .el-input__inner{
                        height: 30px !important;
                        line-height: 30px;
                        .el-input__icon{
                            line-height: 30px;
                        }
                    }
                }
            }
        }
        .long_textarea {
            width: 100%;
            .el-form-item__content{
                width: 81.5%;
                .el-select{
                    width: 100%;
                    height: 30px !important;
                    line-height: 30px;
                    .el-input__inner{
                        height: 30px !important;
                        line-height: 30px;
                        .el-input__icon{
                            line-height: 30px;
                        }
                    }
                }
            }
        }
        .btnBox{
            .el-form-item__content{
                width: 100%;
                float: right;
            }
        }
        .Remarks{
            width: 100%;
            .el-form-item__content{
                width:calc(100% - 160px);
            }
        }

    }
    .el-steps--horizontal{
        margin: 0 auto;
        width: 50%;
        padding-bottom: 20px;
    }

}
</style>

