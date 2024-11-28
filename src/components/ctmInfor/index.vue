<template>
    <div class="choosectm">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
            <!-- <el-form-item label="用户编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="用户编号"></el-input>
            </el-form-item> -->
            <el-form-item label="客户类型：">
                <el-select clearable v-model="formData.watermeterWarehouse" placeholder="全部">
                <el-option v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                </el-select>
          </el-form-item>
            <!-- <el-form-item label="水表编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="水表编号"></el-input>
            </el-form-item>
            <el-form-item label="册本号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="册本号"></el-input>
            </el-form-item>
            <el-form-item label="水表口径：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="水表口径"></el-input>
            </el-form-item>
            <el-form-item label="已用周期（年）：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="已用周期（年）"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-checkbox-group v-model="checkList">
                    <el-checkbox label="只显示过期"></el-checkbox>
                    <el-checkbox label="只显示超重"></el-checkbox>
                </el-checkbox-group>
            </el-form-item> -->
            <el-form-item>
                
                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>

        <div class="kl-table">
             <el-table stripe border :data="histroyData.list" class="change-tables-table" highlight-current-row>

                <el-table-column type="index" label="NO." width="50" fixed="left">
                </el-table-column>

                <el-table-column prop="connect" min-width="100" label="客户编号">
                </el-table-column>

                <el-table-column prop="areaName" min-width="180" label="客户名称">
                </el-table-column>

                <el-table-column prop="lvalue" min-width="180" label="客户地址">
                </el-table-column>

                <el-table-column prop="connect" min-width="100" label="客户类型">
                </el-table-column>

                <el-table-column prop="lvalue" min-width="100" label="联系人">
                </el-table-column>

                <el-table-column prop="fixValue" min-width="80" label="座机号码">
                </el-table-column>

                <!-- <el-table-column class="cell" label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.$index, scope.row)">编辑</el-button>
                    <span  >|</span>
                    <el-button type="text" class="noclick" @click="record(scope.$index, scope.row)">变动情况</el-button>

                </template>
                </el-table-column> -->

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
</template>
<script>
export default {
    name:"choosectm",
    data(){
        return {
            formData:{
                con:"",
                checkList:""
            },
            histroyData:{
                
            },
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.formData= {
                watermeterWarehouse: "",
                watermeterWarehouseOptions: [
                    {
                        name: "全部",
                        value: "1"
                    },
                    {
                        name: "停用",
                        value: "1"
                    },
                    {
                        name: "启用",
                        value: "1"
                    },
                ],
                con:"",
                reason:""
            };
            this.histroyData = {
                areaId: "",
                endRow: 5,
                hasNextPage: false,
                hasPreviousPage: false,
                isFirstPage: true,
                isLastPage: true,
                list: [
                {
                    areaId: null,
                    areaName: "淮汽集团盱眙汽车客运有限公司",
                    code: "C7551990000003",
                    concentrator: "",
                    connect: null,
                    daytime: "2019-07-02",
                    endTime: null,
                    factoryName: "启用",
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
                    areaName: "盱眙国联建设工程质量检测有限公司",
                    code: "C7551990000003",
                    concentrator: "",
                    connect: null,
                    daytime: "2019-07-02",
                    endTime: null,
                    factoryName: "启用",
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
                    areaName: "江苏彦亭齿轮有限公司",
                    code: "C7551990000003",
                    concentrator: "",
                    connect: null,
                    daytime: "2019-07-02",
                    endTime: null,
                    factoryName: "启用",
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
                    areaName: "盱眙县妇幼保健所",
                    code: "C7551990000003",
                    concentrator: "",
                    connect: null,
                    daytime: "2019-07-02",
                    endTime: null,
                    factoryName: "启用",
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
                    areaName: "中国电信股份有限公司盱眙分公司",
                    code: "C7551990000003",
                    concentrator: "",
                    connect: null,
                    daytime: "2019-07-02",
                    endTime: null,
                    factoryName: "启用",
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
                    areaName: "公安局看守所",
                    code: "C7551990000003",
                    concentrator: "",
                    connect: null,
                    daytime: "2019-07-02",
                    endTime: null,
                    factoryName: "启用",
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
                    areaName: "盱眙宏盛电子有限公司",
                    code: "C7551990000003",
                    concentrator: "",
                    connect: null,
                    daytime: "2019-07-02",
                    endTime: null,
                    factoryName: "启用",
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
        closeDialog(){ //关闭会话
			this.waterChoooseVisible = false
			this.init()
        },
        //弹出框
        submit(formName){	//提交
            this.$refs.childWaterEditor.submit()
            // this.waterChoooseVisible = false;
        },
        indexMethod(index) {//获取表格序号
        //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
        return  (this.histroyData.pageSize-20)*this.histroyData.pages + (index+1) ;
        
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
    }
}
</script>

<style lang="scss">
    .choosectm{
        padding: 10px;
        width: calc(100% - 20px);
        .kl-table{
            padding: 0px ;
            .block{
                text-align: right;
                padding:10px 0px;
            }
        }
    }
</style>
