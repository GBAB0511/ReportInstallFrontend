

<template>

    <div class="Alipay">
        <div class="bread-contain">
            <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
            <!-- <h2 class="tab-title">
            <i></i>
            支付宝对账</h2> -->
        </div>
        <div class="toolbar">
            <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                
                <el-form-item class="form-left">
                    <el-form-item label='日期：'>
                        <el-date-picker
                            v-model="DateChoosevalue"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            :picker-options="pickerOptions"
                            :clearable="true"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="成功">
                            <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="模糊查询：" class="searchInput">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="用户编号/流水号"></el-input>
                    </el-form-item>

                    <el-form-item>
                        
                        <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                    </el-form-item>
                    
                </el-form-item>

            </el-form>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
            v-if="tableShow"
            :max-height="maxHeight"         
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
                prop="areaName"
                
                min-width="80"
                label="状态">
            </el-table-column>

            <el-table-column
                prop="concentrator"
                min-width="100"
                label="总金额">
            </el-table-column>

            <el-table-column
                prop="code"
                
                min-width="150"
                label="流水号">
            </el-table-column>

            <el-table-column
                prop="factoryName"
                min-width="80"
                label="用户编号">

            </el-table-column>

            <el-table-column
                prop="lvalue"
                min-width="100"
                label="用户名称">
            </el-table-column>

            <el-table-column
                prop="lvalue"
                min-width="100"
                label="支付金额">
            </el-table-column>

            <el-table-column
                prop="fixValue"
                min-width="80"
                label="扣款金额">
            </el-table-column>

            <el-table-column
                prop="flux"
                min-width="80"
                label="手续费">
            </el-table-column>

            <el-table-column
                prop="daytime"
                min-width="80"
                label="支付时间">
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">
                <el-button type="text" @click.native="edit(scope.$index, scope.row)">详情</el-button>
                </template>
            </el-table-column>

            </el-table>
            
        </div>
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
</template>
<script>
export default {
    name:"Alipay",
     data(){
        return{
            crumbsData :{  //面包屑
                titleList:[
                    {title:'账务中心',path:'/Alipay'},
                    {title:'互联网收费',method:()=>{window.histroy.back()}},
                    {title:'支付宝对账',method:()=>{window.histroy.back()}}

                ],
                
            },
            formData:{
                con:"",
                watermeterWarehouse:"",
                watermeterWarehouseOptions:[
                    {
                        name:"成功",
                        value:"1"
                    },
                    {
                        name:"失败",
                        value:"2"
                    },
                ],
                waterMeterManufacturer:"",
                waterMeterManufacturerOptions:[],
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
            tableShow:false,
            maxHeight:0,
            histroyData:{
                
            },
 
        }
    },
    mounted(){
        this.init();
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      
      this.common.changeTable(this,'.water-meter-inquiry .kl-table',['.water-meter-inquiry .toolbar','.water-meter-inquiry .block','.water-meter-inquiry #crumbs'])
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
                        areaId: null,
                        areaName: "成功",
                        code: "C7551990000003",
                        concentrator: "2346441",
                        connect: null,
                        daytime: "20190702",
                        endTime: null,
                        factoryName: "124571",
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
                        areaName: "失败",
                        code: "C7551990000003",
                        concentrator: "2346441",
                        connect: null,
                        daytime: "20190702",
                        endTime: null,
                        factoryName: "124571",
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
         //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
        return  (this.histroyData.pageSize-20)*this.histroyData.pages + (index+1) ;
    
      },
        edit(){
            this.AlipayVisible = true;
        }
    },
    watch:{
        maxHeight(){
        this.tableShow = false
        this.$nextTick(()=>{
          this.tableShow = true
        })
      },
    }
}
</script>
<style lang="scss">
.Alipay{
    width: 100%;
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom:8px;
    }
    .kl-table{
        padding: 0px 20px;
        .block{
            text-align: right;
            padding:10px 0px;
        }
    }
}
</style>
