<template>
    <div class="changeAoccutTabel">
        <el-table highlight-current-row stripe border :data="gridData" class="change-tables-table" @selection-change="handleSelectionChange">

            <el-table-column   type="selection"   width="55">  
            </el-table-column>

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="code" min-width="180" label="账户编号">
            </el-table-column>

            <el-table-column prop="code" min-width="180" label="账户类型">
            </el-table-column>

            <el-table-column prop="concentrator" min-width="100" label="缴费方式">
            </el-table-column>

            <el-table-column prop="daytime" min-width="180" label="余额">

            </el-table-column>

            <el-table-column prop="factoryName" min-width="180" label="托号">
            </el-table-column>

            <el-table-column prop="fixValue" min-width="180" label="托收合同号">
            </el-table-column>

            <el-table-column prop="flux" min-width="80" label="开户行">
            </el-table-column>
            <el-table-column prop="meter" min-width="180" label="开户名">
            </el-table-column>

            <el-table-column prop="meter" min-width="80" label="银行账号">

            </el-table-column>

            <el-table-column prop="lvalue" min-width="80" label="状态">
            </el-table-column>

        </el-table>
    </div>
</template>
<script>
export default {
    name:"changeAoccutTabel",
    components:{
    },
    data(){
        return{
            gridData: [{
                    areaId: null,
                    areaName: [],
                    code: "101801012001",
                    concentrator: "银行代扣",
                    connect: null,
                    daytime: "深圳市粤港科技有限公司",
                    endTime: null,
                    factoryName: "深圳市东湖公园水库大楼227",
                    fcode: "梅州市梅新路39号",
                }, {
                    areaId: null,
                    areaName: [],
                    code: "101801012001",
                    concentrator: "银行代扣",
                    connect: null,
                    daytime: "深圳市粤港科技有限公司",
                    endTime: null,
                    factoryName: "深圳市东湖公园水库大楼227",
                    fcode: "梅州市梅新路39号",
                }, {
                    areaId: null,
                    areaName: [],
                    code: "101801012002",
                    concentrator: "银行代扣",
                    connect: null,
                    daytime: "深圳市粤港科技有限公司",
                    endTime: null,
                    factoryName: "深圳市东湖公园水库大楼227",
                    fcode: "梅州市梅新路39号",
                }, {
                    areaId: null,
                    areaName: [],
                    code: "101801012003",
                    concentrator: "银行代扣",
                    connect: null,
                    daytime: "深圳市粤港科技有限公司",
                    endTime: null,
                    factoryName: "深圳市东湖公园水库大楼227",
                    fcode: "梅州市梅新路39号",
                }],
                
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
                        areaId: null,
                        areaName: "水费",
                        code: "20100101",
                        concentrator: "",
                        connect: null,
                        daytime: "按抄表期",
                        endTime: null,
                        factoryName: "东井",
                        fcode: null,
                        fix: false,
                        fixValue: "0",
                        flux: "192",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "20501231",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1.6",
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
                        areaName: "污水处理费",
                        code: "20100101",
                        concentrator: "",
                        connect: null,
                        daytime: "按抄表期",
                        endTime: null,
                        factoryName: "东井",
                        fcode: null,
                        fix: false,
                        fixValue: "0",
                        flux: "288",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "20501231",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1.6",
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
        //   导出
        exportExcel(){
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
        //   查看历史
        viewHistory(index, row){

        },
        cellClick(row, column, cell, event) { //点击文件名
            let that = this;
            
        },
        indexMethod(index) {//获取表格序号
            //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
            return  (this.histroyData.pageSize-20)*this.histroyData.pages + (index+1) ;
        
        },
        closeDialog(){ //关闭会话
            this.CustomerChangesVisible = false;
            this.backfillVisible = false;
            this.MeterReadingVisible = false;
            this.PredepositDdetailsVisible = false;
            this.AttachmentViewVisible = false;
			this.init()
        },
        //弹出框
        submit(formName){	//提交
            this.$refs.childWaterEditor.submit()
            // this.CustomerChangesVisible = false;
        },
        // 用户变动情况
        CustomerChanges(){
            this.CustomerChangesVisible = true;
        },
        // 抄表信息
        MeterReading(){
            this.MeterReadingVisible = true;
        },
        // 预存明细
        PredepositDdetails(){
            this.PredepositDdetailsVisible = true;
        },
        // 查看附件
        AttachmentView(){
            this.AttachmentViewVisible = true;
        },
        // 导出本页
        exportPage(){

        },

        // 历年用水
        WaterUse(){
            this.backfillVisible = true;
        }
    }
}
</script>
<style lang="scss">
.changeAoccutTabel{
    height: 100%;
    overflow-y: auto;


}
                               
</style>
