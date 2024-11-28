
<template>
    <div class="AccountSplittingEdit">

        <el-form class="AccountSplittingForm" :inline="true" :model="AccountSplittingEditForm" label-width="160px" ref="ruleForm" :rules="rules">
            <el-form-item :label="v.label" v-for="(v,i) in AccountSplittingEditForm.backfillInput" :key="i">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="v.value" :placeholder="v.tips" disabled class="read-only"></el-input>
            </el-form-item>

            <el-table      
                stripe
                border
                :data="histroyData.list"
                class="change-tables-table">

                
                <el-table-column 
                    type="index"  label="NO."
                    min-width="100" 
                    :index="indexMethod">
                    
                </el-table-column>
      
                <el-table-column 
                    label="拆分水量"
                    min-width="100" 
                    prop="code"
                    >
                    
                </el-table-column>
                <el-table-column 
                    label="拆分金额"
                    min-width="100" 
                    prop="flux"
                    >
                    
                </el-table-column>
                </el-table>


            
        </el-form>

    </div>
</template>
<script>
export default {
    name:"AccountSplittingEdit",
    data(){
        return{
            AccountSplittingEditForm:{
                // 查询内容
                backfillInput:[
                    {
                        label:"客户编号：",
                        value:"",
                        tips:"165497974"
                    },
                    {
                        label:"年月：",
                        value:"",
                        tips:""
                    },

                     {
                        label:"水量：",
                        value:"",
                        tips:""
                    },
                    
                    {
                        label:"金额：",
                        value:"",
                        tips:""
                    },
                     {
                        label:"客户名称：",
                        value:"",
                        tips:"165497974"
                    },
                    {
                        label:"费用类型：",
                        value:"",
                        tips:""
                    },

                     {
                        label:"水量单价：",
                        value:"",
                        tips:""
                    },
                    
                    {
                        label:"容量单价：",
                        value:"",
                        tips:""
                    },
                   
                ],

               
                desc:"",
                userNume:"",
                descoptions:[]
            },
            rules:{
                userNume:[
                    { required: true, message: '请输入用户编号', trigger: 'blur' },
                ],
                desc:[
                    { required: true, message: '请输入用户编号', trigger: 'blur' },
                ]
            },
            histroyData:{
                
            },
            label:0
    
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.histroyData = {
                areaId:"",
                endRow: 5,
                hasNextPage: false,
                hasPreviousPage: false,
                isFirstPage: true,
                isLastPage: true,
                list: [
                    {
                        label:0,
                        areaId: null,
                        areaName: "东深小区",
                        code: "C7551990000003",
                        concentrator: "",
                        connect: null,
                        daytime: "2019-07-02",
                        endTime: null,
                        factoryName: "东井",
                        fcode: null,
                        fix: false,
                        fixValue: "-",
                        flux: "-",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "-",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1栋3单元",
                        protocolName: null,
                        rowNumber: 0,
                        sensorModel: null,
                        sn: null,
                        status: "未上传",
                        totalPage: 0,
                        type: 5,
                        unusual: null,
                        usn: "00",
                        waterGroup: null,
                    },
                     {
                        areaId: null,
                        areaName: "东深小区",
                        code: "C7551990000003",
                        concentrator: "",
                        connect: null,
                        daytime: "2019-07-02",
                        endTime: null,
                        factoryName: "东井",
                        fcode: null,
                        fix: false,
                        fixValue: "-",
                        flux: "-",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "-",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1栋3单元",
                        protocolName: null,
                        rowNumber: 0,
                        sensorModel: null,
                        sn: null,
                        status: "未上传",
                        totalPage: 0,
                        type: 5,
                        unusual: null,
                        usn: "00",
                        waterGroup: null,
                    },
                     {
                        areaId: null,
                        areaName: "东深小区",
                        code: "C7551990000003",
                        concentrator: "",
                        connect: null,
                        daytime: "2019-07-02",
                        endTime: null,
                        factoryName: "东井",
                        fcode: null,
                        fix: false,
                        fixValue: "-",
                        flux: "-",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "-",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1栋3单元",
                        protocolName: null,
                        rowNumber: 0,
                        sensorModel: null,
                        sn: null,
                        status: "未上传",
                        totalPage: 0,
                        type: 5,
                        unusual: null,
                        usn: "00",
                        waterGroup: null,
                    },
                     {
                        areaId: null,
                        areaName: "东深小区",
                        code: "C7551990000003",
                        concentrator: "",
                        connect: null,
                        daytime: "2019-07-02",
                        endTime: null,
                        factoryName: "东井",
                        fcode: null,
                        fix: false,
                        fixValue: "-",
                        flux: "-",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "-",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1栋3单元",
                        protocolName: null,
                        rowNumber: 0,
                        sensorModel: null,
                        sn: null,
                        status: "未上传",
                        totalPage: 0,
                        type: 5,
                        unusual: null,
                        usn: "00",
                        waterGroup: null,
                    }
                ],
                navigateFirstPage: 1,
                navigateLastPage: 1,
                navigatePages: 8,
                navigatepageNums: Array(1),
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

    }
}
</script>
<style lang="scss">
$theme-font-color:#3680CD;
.AccountSplittingEdit{

    .AccountSplittingForm{
        margin-top: 15px;
    }
    .AccountSplittingForm{
        padding: 10px 20px;
        width: 93%;
        .el-form-item{
            width: 40%;
            .el-form-item__content{
                width: 50%;
                .el-select{
                    width: 100%;
                }
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
    .theme-color .cell{
        color:$theme-font-color;
    }

}
</style>

