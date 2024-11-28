
<template>
    <div class="bankCollection">
        <el-tabs v-model="bankCollectionActiveName" @tab-click="handleClick">
            <el-tab-pane label="托收出盘" name="DeductionOffer">
                 <div class="bread-contain">
                    <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
                    <h2 class="tab-title">
                    <i></i>
                    托收出盘</h2>
                </div>
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
               
                            <el-form-item label="托收银行：">
                                <el-select  clearable v-model="formData.subordinateDepartments" placeholder="">
                                    <el-option  v-for="(item,index) in formData.subordinateDepartmentsOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item label="开始账期：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="200101" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="截止账期：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="截止抄表日期：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="" clearable></el-input>
                            </el-form-item>

                            <el-form-item>
                                
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        
                        <el-form-item class="form-right">
                 
                            <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button>
                            <!-- <span>开户流程：</span><span>1.已签合同工程</span> -->
            
                        
                        
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
                        :index="indexMethod">
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="托收银行">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="出盘总金额">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="出盘时间">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="出盘人">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="150"
                        label="操作"
                        fixed="right">
                        <template slot-scope="scope">
                            <!-- size="mini" type="warning" plain -->
                            <el-button type="text">取消</el-button>
                 
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
            </el-tab-pane>
            <el-tab-pane label="托收回盘" name="DeductionRebate">
                <div class="bread-contain">
                    <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
                    <h2 class="tab-title">
                    <i></i>
                    托收回盘</h2>
                </div>
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
                            <el-form-item label='上传日期：'>
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
                            <el-form-item label="出盘记录：">
                                <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="未审">
                                    <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item label="回盘银行：">
                                <el-select  clearable v-model="formData.subordinateDepartments" placeholder="">
                                    <el-option  v-for="(item,index) in formData.subordinateDepartmentsOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>

                            <el-form-item>
                                
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        
                        <el-form-item class="form-right">
                 
                            <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">上传回盘文件</el-button>
                            <!-- <span>开户流程：</span><span>1.已签合同工程</span> -->
            
                        
                        
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
                        :index="indexMethod">
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="回盘银行">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="回盘总户数">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="已处理户数">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="成功数">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="失败数">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="上传时间">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="上传人">
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
            </el-tab-pane>
            <el-tab-pane label="托收清单" name="DeductionList">
                <div class="bread-contain">
                    <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
                    <h2 class="tab-title">
                    <i></i>
                    托收清单</h2>
                </div>
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
               
                            <el-form-item label="托收银行：">
                                <el-select  clearable v-model="formData.subordinateDepartments" placeholder="请选择银行">
                                    <el-option  v-for="(item,index) in formData.subordinateDepartmentsOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item label="出盘状态：">
                                <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="未出盘">
                                    <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item label="回盘状态：">
                                <el-select  clearable v-model="formData.waterMeterManufacturer" placeholder="已回盘">
                                    <el-option  v-for="(item,index) in formData.waterMeterManufacturerOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item label="开始年月：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="" clearable></el-input>
                            </el-form-item>

                            <el-form-item>
                                
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        
                        <el-form-item class="form-right">
                            <el-button @click="exportExcel" size="mini" type="primary">打印失败清单</el-button>
                            <el-button @click="exportExcel" size="mini" type="primary">打印清单</el-button>
                            <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button>
                            <!-- <span>开户流程：</span><span>1.已签合同工程</span> -->
            
                        
                        
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
                        :index="indexMethod">
                    </el-table-column>

                    <el-table-column 
                        type="selection" 
                        width="50" 
                        >
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="用户编号">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="用户名称">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="用户地址">

                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="手机号码">

                    </el-table-column>

                    
                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="银行名称">
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="银行账号">
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="开户名称">
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="银行行号">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="银行协议号">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="签约日期">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="备注">
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
            </el-tab-pane>
            <el-tab-pane label="托收发票" name="WithholdingInvoice">
                <div class="bread-contain">
                    <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
                    <h2 class="tab-title">
                    <i></i>
                    托收发票</h2>
                </div>
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
                            <el-form-item label='收费日期：'>
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
                            <el-form-item label="收费银行：">
                                <el-select  clearable v-model="formData.subordinateDepartments" placeholder="">
                                    <el-option  v-for="(item,index) in formData.subordinateDepartmentsOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item label="户号：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="200101" clearable></el-input>
                            </el-form-item>
    

                            <el-form-item>
                                
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        
                        <el-form-item class="form-right">
                 
                            <el-button @click="exportExcel" size="mini" type="primary">生成电子发票</el-button>
                            <el-button @click="exportExcel" icon="el-icon-download" size="mini" type="primary">下载电子发票</el-button>
                            <el-button @click="exportExcel" size="mini" type="primary">补打收据</el-button>
                            <el-button @click="exportExcel" size="mini" type="primary">发票作废</el-button>
                            <!-- <span>开户流程：</span><span>1.已签合同工程</span> -->
            
                        
                        
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
                        :index="indexMethod">
                    </el-table-column>

                    <el-table-column 
                        type="selection" 
                        width="50" 
                        >
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="用户编号">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="用户名称">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="用户地址">

                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="手机号码">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="银行名称">
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="银行账号">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="开户名称">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="银行行号">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="银行协议号">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="签约日期">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="备注">
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
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name:"bankCollection",
    data(){
        return{
            bankCollectionActiveName:"DeductionOffer",
            crumbsData :{  //面包屑
                titleList:[
                    {title:'财务中心',path:'/bankCollection'},
                    {title:'银行托收',method:()=>{window.histroy.back()}}
                ],
                
            },
            formData:{
                con:"",
                watermeterWarehouse:"",
                watermeterWarehouseOptions:[
                    {
                        name:"全部",
                        value:"1"
                    },
                    {
                        name:"未出盘",
                        value:"2"
                    },
                    {
                        name:"已出盘",
                        value:"3"
                    },
                ],
                waterMeterManufacturer:"",
                waterMeterManufacturerOptions:[
                    {
                        name:"全部",
                        value:"1"
                    },
                    {
                        name:"未回盘",
                        value:"2"
                    },
                    {
                        name:"已回盘",
                        value:"3"
                    },
                    {
                        name:"回盘成功",
                        value:"4"
                    },
                    {
                        name:"回盘失败",
                        value:"5"
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
    methods: {
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
            };
             this.ArrearsDetails = {
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
                        sub:"",
                        Total:""
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
                        sub:"",
                        Total:""
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
                        areaName: "",
                        code: "",
                        concentrator: "",
                        connect: null,
                        daytime: "",
                        endTime: null,
                        factoryName: "东井",
                        fcode: null,
                        fix: false,
                        fixValue: "合计：",
                        flux: "-",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "笔数：",
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
                        sub:"3",
                        Total:"17.7"
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
      handleClick(tab, event) {

        console.log(tab);
      },
       demand() {  //查询
        // this.tableQuery.page = 1
        // this.tableQuery.pageCount = 20
        this.init()
      },
    //   导出
      exportExcel(){
    //   	let listData = {}
    //   	this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
    //     let params ={
    //       "busicode":"MeterReadingList",
    //       "data": this.tableQuery
    //     }
    //     this.$api.fetch({
    //       apiUrl: 'interface.api',//路径
    //       method: 'post',//请求方法
    //       params:params,//参数
    //       needErrorCallback:true
    //     }).then(res =>{
    //     	if(res.code===0){
    //         listData = res.data
    //         if (!listData.list[0]) {
	//         		this.$notify({
	//               title: '警告',
	//               message:'表格没有相关数据',
	//               type: 'error'
	//             })
	//         	} else {
	//         		import('@/vendor/Export2Excel').then(excel => {
	// 			        const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
	// 			        const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
	// 			        const list = listData.list
	// 			        const data = this.formatJson(filterVal, list)
	// 			        excel.export_json_to_excel({
	// 			          header: tHeader,
	// 			          data,
	// 			          filename: this.tableQuery.daytime + '抄表数据',
	// 			          autoWidth: '100'
	// 			        })
	// 			      })
	//         		this.tableQuery.pageCount = 20
	//         	}
    //       }
    //     })
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
        return  (this.histroyData.pageSize-1)*this.histroyData.pages + (index+1) ;
    
      },
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
.bankCollection{
    padding:20px;
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

