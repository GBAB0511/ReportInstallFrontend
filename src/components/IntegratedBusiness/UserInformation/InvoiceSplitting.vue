

<template>
    <div class="InvoiceSplitting">
        
        <!-- 弹出表单 发票分票 -->
        <el-dialog title="发票分票详情" :close-on-click-modal="false" append-to-body :visible.sync="InvoiceSplittingEdit" class="addDialog" @close="closeDialog">
            <InvoiceSplittingEdit ref="childcountManagement"></InvoiceSplittingEdit>
        </el-dialog>

        <div class="toolbar">
            <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                
                <el-form-item class="form-left">
                    <el-form-item label='账期：'>
                        <el-date-picker
                            v-model="DateChoosevalue"
                            type="monthrange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            :picker-options="pickerOptions"
                            :clearable=false
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="模糊查询：">
                        <el-tooltip class="item" effect="dark" content="账户编号、用户编号、用户名称、发票号" placement="top">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.con" clearable size="mini" @keydown.enter.native="demand"></el-input>
                        </el-tooltip>
                    </el-form-item>
                        <el-checkbox v-model="CombinedStrike">合打</el-checkbox>
                        <el-checkbox v-model="CombinedStrike1">预开票</el-checkbox>
   

                    <el-form-item>
                        <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                    </el-form-item>
                    
                    <br>
                    <el-form-item label="票据提醒：" class="width-350">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" @input="e => input = inputMe(e)" v-model=" formData.noteReminderDate" placeholder="" ></el-input>
                    </el-form-item>
                </el-form-item>
                
                <el-form-item class="form-right">
                    <el-button @click="exportExcel" size="mini" type="primary">打印普通发票</el-button>
                    <el-button @click="exportExcel" size="mini" type="primary">打印电子发票</el-button>
                    <el-button @click="exportExcel" size="mini" type="primary">打印财政收据</el-button>
                    <el-button @click="exportExcel" size="mini" type="primary">打印增值税发票</el-button>
                    <!-- <el-button @click="exportExcel" size="mini" type="primary">票据作废</el-button> -->

    
                
                
                </el-form-item>
            </el-form>
        </div>
        <div class="kl-table common-diaTab" :style="{height: maxHeight + 'px'}">
            <el-table
            highlight-current-row        
            stripe
            border
            v-if="tableShow"
            :max-height="maxHeight"   
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
                prop="code"
                
                min-width="100"
                label="用户编号">
            </el-table-column>

            <el-table-column
                prop="daytime"
                min-width="200"
                label="用户名称">
            </el-table-column>

            <el-table-column
                prop="lvalue"
                min-width="80"
                label="账期">
            </el-table-column>


            <el-table-column
                prop="flux"
                min-width="80"
                label="计费水量">
            </el-table-column>


            <el-table-column
                prop="money"
                min-width="80"
                label="合计金额">
            </el-table-column>

            <el-table-column
                prop="flux"
                
                min-width="100"
                label="收费日期">
            </el-table-column>

            <el-table-column
                prop="fixValue"
                min-width="80"
                label="收费员">
            </el-table-column>

            

            <el-table-column
                prop="flux"
                min-width="120"
                label="已开金额">
            </el-table-column>

            <el-table-column
                prop="flux"
                min-width="120"
                label="已开数量">
            </el-table-column>


            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text"  @click.native="edit(scope.row)">详情</el-button>
              </template>
            </el-table-column>

            </el-table>
            
        </div>
        <!-- 分页 -->
            <div class="block">
                <!-- <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="1"
                    :page-sizes="[20, 100, 500, 1000]"
                    :page-size="20"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="histroyData.total">
                </el-pagination> -->
            </div>
    </div>
</template>
<script>
import InvoiceSplittingEdit from "./InvoiceSplittingEdit"
export default {
    name:"InvoiceSplitting",
    components:{
        InvoiceSplittingEdit,
    },
     data(){
        return{
            tableShow:false,
            maxHeight:0,
            formData:{
                con:"",
                noteReminderDate:'水费发票(100张)：20190909/污水费发票(32张)：20129023',
                watermeterWarehouse:"",
                watermeterWarehouseOptions:[],
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
            histroyData:{
                
            },
            InvoiceSplittingEdit:false,  //综合查询的显示和隐藏
            InvoiceSplittingName:'发票领用-领用',
            ruleFormData:{},
            PrintPayer:"",
            CombinedStrike:"",
 
        }
    },
    mounted(){
        this.init();
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      
        this.common.changeTable(this,'.water-meter-inquiry .kl-table',['.water-meter-inquiry .toolbar','.water-meter-inquiry .block','.water-meter-inquiry #crumbs'])
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
                areaId:"",
                endRow: 5,
                hasNextPage: false,
                hasPreviousPage: false,
                isFirstPage: true,
                isLastPage: true,
                list: [
                    {
                        areaId: null,
                        areaName: "东深小区",
                        code: "XX220-002-00",
                        concentrator: "",
                        connect: null,
                        daytime: "中国建设银行股份有限公司梅州",
                        endTime: null,
                        factoryName: "东井",
                        fcode: "0.00",
                        fix: false,
                        fixValue: "-",
                        fixValue2: "水费",
                        money:'10',
                        flux: "-",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "201802",
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
                        code: "XX220-002-00",
                        concentrator: "",
                        connect: null,
                        daytime: "中国建设银行股份有限公司梅州",
                        endTime: null,
                        factoryName: "东井",
                        fcode: "0.00",
                        fix: false,
                        fixValue: "-",
                        fixValue2: "污水费",
                        money:'5',

                        flux: "-",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "201802",
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

      indexMethod(index) {//获取表格序号
         //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
        return  (this.histroyData.pageSize-20)*this.histroyData.pages + (index+1) ;
    
      },
        closeDialog(){ //关闭会话
            this.InvoiceSplittingEdit = false;
            this.backfillVisible = false;
            this.init()
        },
        //弹出框
        submit(formName){	//提交
            this.$refs.childInvoiceSplitting.submit()
            // this.InvoiceSplittingEdit = false;
        },
        edit(){
            this.InvoiceSplittingEdit = true;
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
.InvoiceSplitting{
    width: 100%;
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom:8px;
    }
    .el-form--inline .el-form-item:first-of-type{
        margin-right: 0px;
    }
}
</style>
