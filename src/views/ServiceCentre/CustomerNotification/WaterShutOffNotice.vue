<template>
    <div class="WaterShutOffNotice">
        <div v-if="EditVisible">
            <MassageDetailsEdit ref="childWarehousing"></MassageDetailsEdit>
        </div>
        <div v-else >
            <div class="toolbar">
                <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                    
                    <el-form-item class="form-left">
                    <el-form-item label="营业所：">
                        <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="农村">
                            <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管理区域：">
                        <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="全部">
                            <el-option  v-for="(item,index) in formData.waterMeterManufacturerOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="册本号：">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.waterMeterCaliber" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="模糊查询：" class="searchInput">
                        <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userNum" placeholder="用户编号/用户地址"></el-input> -->
                        <el-tooltip class="item" effect="dark" content="用户编号、用户地址" placement="top">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userNum" clearable size="mini"></el-input>
                        </el-tooltip>
                    </el-form-item>
                        <el-form-item>
                            <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                        </el-form-item>
                        
                    </el-form-item>
                    <el-form-item class="form-right">

                    </el-form-item>
                    
                </el-form>
            </div>
            <div class="kl-table">
                <el-table    
                    stripe
                    border
                    :data="histroyData.list"
                    class="change-tables-table">

                    <el-table-column 
                        type="selection" 
                        width="50" 
                        fixed="left"
                            >
                    </el-table-column>

                    <el-table-column 
                        type="index"  label="NO."
                        width="50" 
                        fixed="left"
                        :index="indexMethod">
                    </el-table-column>

                    <el-table-column
                        prop="Mtype"
                        min-width="80"
                        label="制单日期">

                    </el-table-column>

                    <el-table-column
                        prop="code"
                        min-width="100"
                        label="制单人">
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        min-width="80"
                        label="通知类型">

                    </el-table-column>

                    <el-table-column
                        prop="concentrator"
                        min-width="100"
                        label="通知方式">
                    </el-table-column>

                    <el-table-column
                        prop="factoryName"
                        min-width="100"
                        label="通知时间">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="通知内容">
                    </el-table-column>

                    <el-table-column
                        prop="endTime"
                        min-width="100"
                        label="通知用户数">
                    </el-table-column>

                    <el-table-column
                        prop="endTime"
                        min-width="100"
                        label="通知状态">
                    </el-table-column>

                    <el-table-column
                        prop="connect"
                        min-width="120"
                        label="通知成功数">
                    </el-table-column>

                    <el-table-column
                        prop="connect"
                        min-width="100"
                        label="通知完毕时间">
                    </el-table-column>
                                        
                    <el-table-column label="操作" fixed="right" width="150">
                        <template slot-scope="scope">
                            <el-button type="text" @click.native="editMassege(scope.$index, scope.row)">编辑</el-button> 
                            <el-button type="text" @click.native="edit(scope.$index, scope.row)">审批</el-button> 
                            <el-button type="text" @click.native="edit(scope.$index, scope.row)">通知明细</el-button> 
                        </template>
                    </el-table-column>
                    </el-table>
                <!-- 分页 -->
                <div class="block">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="1"
                        :page-sizes="[20, 100, 500, 1000]"
                        :page-size="20"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="histroyData.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import MassageDetailsEdit from "./MassageDetailsEdit"
export default {
    name:"WaterShutOffNotice",
    components:{
        MassageDetailsEdit,
    },
    data() {
      return {
          
        EditVisible:false,//弹出表单
        activeName: 'ShortMessageSending',
        crumbsData :{  //面包屑
            titleList:[
                {title:'服务中心',path:'/ServiceCentre'},
                {title:'客户通知',method:()=>{window.histroy.back()}}
            ],
            
        },
        formData:{
            con:"",
            watermeterWarehouse:"",
            watermeterWarehouseOptions:[
                {
                    name:"城区",
                    value:"1"
                },
                {
                    name:"农村",
                    value:"2"
                },
            ],
            waterMeterManufacturer:"",
            waterMeterManufacturerOptions:[
               {
                    name:"A",
                    value:"1"
                },
                {
                    name:"B",
                    value:"2"
                },
                {
                    name:"C",
                    value:"3"
                },
            ],
            waterMeterType:"",
            waterMeterTypeOptions:[],
            waterMeterCaliber:"",
            waterMeterCaliberOptions:[],
            waterMeterStatus:"",
            waterMeterStatusOptions:[],
            subordinateDepartments:"",
            subordinateDepartmentsOptions:[]

        },
        // 日期选择器
        pickerOptions: {
            disabledDate(time) {
            return time.getTime() > Date.now() ;
            }
        },
        DateChoosevalue: [],
        histroyData:{
            
        },
        rules:{
            watermeterWarehouse:[
                { required: true, message: '请选择短语', trigger: 'blur' },
            ],
            desc:[
                { required: true, message: '请输入用户编号', trigger: 'blur' },
            ]
        },

      };
    },
    mounted(){
        this.init();
        },
    methods: {
        editMassege(){
            console.log(111);
            debugger
            this.EditVisible = true

        },
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
                        areaId: 4,
                        areaName: "袁正林",
                        code: "2000030",
                        concentrator: "201807",
                        connect: "13852399576",
                        daytime: "13852399576",
                        endTime: "2019-09-07",
                        factoryName: "雨露村",
                        fcode: "0.80",
                        fix: "已通知",
                        fixValue: "24",
                        flux: "00000111",
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
                        areaId: 4,
                        areaName: "袁超",
                        code: "2000030",
                        concentrator: "201807",
                        connect: "-",
                        daytime: "13852399576",
                        endTime: "2019-09-07",
                        factoryName: "雨露村",
                        fcode: "0.80",
                        fix: "已通知",
                        fixValue: "24",
                        flux: "00000112",
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
            };
        
        },

        demand() {  //查询
            // this.tableQuery.page = 1
            // this.tableQuery.pageCount = 20
            this.init()
        },
        //分页
        handleSizeChange(val) { //显示多少数据一页
            // this.tableQuery.pageCount = val
            // this.tableQuery.page = 1
            this.init()
        },
        handleCurrentChange(val) {  //显示多少页码
            // this.tableQuery.page = val
            this.init()
        },
        cellClick(row, column, cell, event) { //点击文件名
            let that = this;
        },
        indexMethod(index) {//获取表格序号
            return  (this.histroyData.pageSize-20)*this.histroyData.pages + (index+1) ;
        },
        edit(){
        },

        add(){
            this.ShortMessagePhraseManagementVisible = true;
        },
    },
    watch:{
    }
  };
</script>
<style lang="scss">
.WaterShutOffNotice{
    height: 100%;
    .form-br{
        width: 50%;
        .el-form-item__content{
            width: 100%;
            .el-form-item{
                width: 100%;
                .el-form-item__content{
                    width: calc(100% - 62px);
                }
            }

        }
    }
}
</style>