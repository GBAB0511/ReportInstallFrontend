<template>
    <div class="ShortMessageNotification">
        <!-- 弹出表单增加 -->
    	<el-dialog :title="ShortMessagePhraseManagementName" :visible.sync="ShortMessagePhraseManagementVisible" class="button-dialog" @close="closeDialog" >
            <ShortMessagePhraseManagementEdit
                ref="childShortMessagePhraseManagement" 
            ></ShortMessagePhraseManagementEdit>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="submit">保 存</el-button>
             
		      <el-button type="info" size="mini" plain @click="closeDialog">返 回</el-button>

		    </div>
    	</el-dialog>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="短信发送" name="ShortMessageSending">
               <ShortMessageSending></ShortMessageSending>
            </el-tab-pane>
     
            <el-tab-pane label="水费通知" name="WaterFeeNotice">
                <div class="bread-contain">
                    <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
                    <!-- <h2 class="tab-title">
                    <i></i>
                    水费通知</h2> -->
                </div>
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
                            <!-- <el-form-item label="抄表周期：">
                                <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="全部">
                                    <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item> -->
                        <el-form-item label="缴费方式：">
                            <el-select  clearable v-model="formData.waterMeterManufacturer" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.waterMeterManufacturerOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                            <el-form-item label='发送时间：'>
                                <el-date-picker
                                    v-model="DateChoosevalue"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    :picker-options="pickerOptions"
                                    :clearable=false
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="营业区域：">
                                <el-select  clearable v-model="formData.waterMeterCaliber" placeholder="全部">
                                    <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item label="抄表日期：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                            </el-form-item>
                             <el-form-item label="账期：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                            </el-form-item>
                             <el-form-item label="户号：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                            </el-form-item>
                             <el-form-item label="册本：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                            </el-form-item>

                            <el-form-item>
                            
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        <el-form-item class="form-right">
                            <el-button size="mini" @click="add" type="primary">选择发送</el-button>

                            <el-button size="mini" @click="add" type="primary">全部发送</el-button>

                            <el-button size="mini" @click="add" type="primary">打印</el-button>
                            <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button>

            
                        
                        
                        </el-form-item>
                    </el-form>
                </div>
                <div class="kl-table" :style="{height: maxHeight + 'px'}">
                <el-table
                    v-if="tableShow"
                    :max-height="maxHeight"
                    highlight-current-row        
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
                        prop="areaName"
                        min-width="80"
                        label="用户编号">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="地址">
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="用户名称">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="账期">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="用水量">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="应收">
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="手机号码">
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="污水费">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="垃圾费">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="上行行度">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="本次起始">
                    </el-table-column>

                     <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="上期抄表日">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="本期抄表日">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="最后发送时间">
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
            
            <el-tab-pane label="欠费催缴通知" name="NoticeArrears">
               
                <NoticeArrears></NoticeArrears>
            </el-tab-pane>
            
            <el-tab-pane label="缴费成功提醒" name="SuccessfulReminderOfPayment">
               <SuccessfulReminderOfPayment></SuccessfulReminderOfPayment>
            </el-tab-pane>
            
            <el-tab-pane label="停水通知" name="WaterShutOffNotice">
               <WaterShutOffNotice></WaterShutOffNotice>
            </el-tab-pane>
            
            <el-tab-pane label="定制通知" name="CustomNotification">
                <div class="bread-contain">
                    <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
                    <h2 class="tab-title">
                    <i></i>
                    定制通知</h2>
                </div>
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :rules="rules" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
                        <el-form-item label="用水类型：">
                            <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择短语：" prop="watermeterWarehouse">
                            <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.waterMeterTypeOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                        <el-form-item label="营业区域：">
                            <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.waterMeterCaliberOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                        <el-form-item label="册本：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="抄表员：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="序号：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="街区：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="小区：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="模糊查询：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="用户编号/用户名称/用户地址"></el-input>
                        </el-form-item>

                            <el-form-item>
                            
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        <el-form-item class="form-right">
                            <el-button size="mini" @click="add" type="primary">选择发送</el-button>
                            <el-button @click="exportExcel" size="mini" type="primary">全部发送</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="kl-table" :style="{height: maxHeight + 'px'}">
                <el-table
                    v-if="tableShow"
                    :max-height="maxHeight"
                    highlight-current-row        
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
                        prop="areaName"
                        min-width="80"
                        label="用户编号">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="地址">
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="用户名称">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="用户余额">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="水表编号">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="违约金">
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="欠费合计">
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
            
            <el-tab-pane label="通知明细" name="NotificationDetails">
                <NotificationDetails></NotificationDetails>
            </el-tab-pane>
            
            <el-tab-pane label="短信短语管理" name="ShortMessagePhraseManagement">
                <div class="bread-contain">
                    <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
                    <h2 class="tab-title">
                    <i></i>
                    短信短语管理</h2>
                </div>
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
                        <el-form-item label="状态：">
                            <el-select  clearable v-model="formData.watermeterWarehouse" placeholder=" 启用">
                                <el-option  v-for="(item,index) in formData.waterMeterStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                            <el-form-item label="模糊查询：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="状态/短信编号/短语名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                            
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        <el-form-item class="form-right">
                            <el-button size="mini" @click="add" type="primary" icon="el-icon-plus">增加</el-button>
                            <el-button size="mini" type="primary">删除</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="kl-table" :style="{height: maxHeight + 'px'}">
                <el-table
                    v-if="tableShow"
                    :max-height="maxHeight"         
                    stripe
                    border
                    highlight-current-row
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
                        prop="areaName"
                        min-width="80"
                        label="状态">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="短信编号">
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="短语名称">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="400"
                        label="短语内容">
                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="85">
                        <template slot-scope="scope">
    
                        <el-button type="text" @click.native="edit(scope.$index, scope.row)">编辑</el-button> 
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
        </el-tabs>
    </div>
</template>
<script>
import ShortMessageSending from "./ShortMessageSending"
import NoticeArrears from "./NoticeArrears"
import SuccessfulReminderOfPayment from "./SuccessfulReminderOfPayment"
import WaterShutOffNotice from "./WaterShutOffNotice"
import NotificationDetails from "./NotificationDetails"
import ShortMessagePhraseManagementEdit from "./ShortMessagePhraseManagementEdit"

export default {
    name:"ShortMessageNotification",
    components:{
        ShortMessagePhraseManagementEdit,
        ShortMessageSending,
        NoticeArrears,
        SuccessfulReminderOfPayment,
        WaterShutOffNotice,
        NotificationDetails
    },
    data() {
      return {
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
                        name:"0038__工业用水3.54",
                        value:"1"
                    },
                    {
                        name:"0015__特种用水3.54",
                        value:"2"
                    },
                    {
                        name:"0029__区域用水3.54",
                        value:"3"
                    },
                    {
                        name:"0030__基本水价3.54",
                        value:"4"
                    },
                    {
                        name:"0039__特种用水3.54",
                        value:"5"
                    },
                    {
                        name:"0040__生活用水3.54",
                        value:"6"
                    },
                    {
                        name:"0041__免费用水3.54",
                        value:"7"
                    },
            ],
            waterMeterManufacturer:"",
            waterMeterManufacturerOptions:[
                {
                    name:"全部",
                    value:"1"
                },
                {
                    name:"现金",
                    value:"2"
                },
                {
                    name:"代扣",
                    value:"3"
                },
                {
                    name:"托收",
                    value:"4"
                },
                {
                    name:"预存",
                    value:"5"
                },
            ],
            waterMeterType:"",
            waterMeterTypeOptions:[
                {
                    name:"19年5月调价通知",
                    value:"1"
                },
            ],
            waterMeterCaliber:"",
            waterMeterCaliberOptions:[
                {
                    name:"全部",
                    value:"1"
                },
                {
                    name:"营业部",
                    value:"2"
                },
            ],
            waterMeterStatus:"",
            waterMeterStatusOptions:[
                {
                    name:"启用",
                    value:"1"
                },
                {
                    name:"停用",
                    value:"2"
                },
            ],
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
        rules:{
            watermeterWarehouse:[
                { required: true, message: '请选择短语', trigger: 'blur' },
            ],
            desc:[
                { required: true, message: '请输入用户编号', trigger: 'blur' },
            ]
        },
        ShortMessagePhraseManagementVisible:false, 
        ShortMessagePhraseManagementName:'短信通知-短信短语管理-增加',
      };
    },
    mounted(){
        this.init();
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      
      this.common.changeTable(this,'.ShortMessageNotification .kl-table',['.ShortMessageNotification .toolbar','.ShortMessageNotification .block','.ShortMessageNotification #crumbs'])
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
      edit(){

      },
      closeDialog(){ //关闭会话
            this.ShortMessagePhraseManagementVisible = false;
            this.backfillVisible = false;
            this.init()
        },
        //弹出框
        submit(formName){	//提交
            this.$refs.childShortMessagePhraseManagement.submit()
            // this.ShortMessagePhraseManagementVisible = false;
        },
        add(){
            this.ShortMessagePhraseManagementVisible = true;
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
  };
</script>
<style lang="scss">
.ShortMessageNotification{
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
    .demo-form{
        width:25%;
        margin: 20px auto;
        .el-input,.el-textarea{
            width: 100% !important;
        }
    }
}
</style>