<template>
    <div class="CustomerNotification">
         <div class="bread-contain">
            <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
            <!-- <h2 class="tab-title">
            <i></i>
            {{tabTitle}}</h2> -->
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
         
            <el-tab-pane label="水费通知" name="WaterBill" class="WaterBill">
                
                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        <div class="form-left">
                            <el-form-item label="账期：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.AccountPeriod" placeholder="账期"></el-input>
                            </el-form-item>

                            <el-form-item label="抄表日期：">
                                <el-date-picker
                                v-model="formData.meterDate"
                                type="month"
                                placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="营业所：">
                                <el-select  clearable v-model="formData.waterMeterCaliber" placeholder="全部">
                                    <el-option  v-for="(item,index) in formData.waterMeterCaliberOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="册本号：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.book" placeholder="册本"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="模糊查询：" class="searchInput">
                                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userNum" placeholder="用户编号/用户地址/手机号码"></el-input> -->
                                <el-tooltip class="item" effect="dark" content="用户编号、用户地址、手机号码" placement="top">
                                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userNum" clearable size="mini"></el-input>
                                </el-tooltip>
                            </el-form-item> 
                            
                            
                            <el-form-item>
                                <el-button type="primary" size="mini" @click.native="hidden" icon="el-icon-arrow-down upchange" class="soce-query">高级查询</el-button>
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                        </div>

                        <div class="form-right">

                            <el-button size="mini"  type="primary">打印</el-button>
                            <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button>
                        </div>
                        <el-form-item v-show="isActive" class="advancedQuery">
                            
                            <el-form-item label="是否大客户：">
                                <el-select  clearable v-model="formData.IsBigUser" placeholder="是">
                                    <el-option  v-for="(item,index) in formData.IsBigUserOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            
                            <el-form-item label="缴费方式：">
                                <el-select  clearable v-model="formData.waterMeterManufacturer" placeholder="全部">
                                    <el-option  v-for="(item,index) in formData.waterMeterManufacturerOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>

                            
                            <el-form-item label="通知状态：">
                                <el-select  clearable v-model="formData.notificationStatus" placeholder="">
                                    <el-option  v-for="(item,index) in formData.notificationStatus" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form-item>

                    </el-form>
                </div>
                <div class="kl-table">
                    <el-table       
                    stripe
                    highlight-current-row
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
                        prop="bookNum"
                        min-width="100"
                        label="册本号">
                    </el-table-column>


                    <el-table-column
                        prop="code"
                        min-width="80"
                        label="用户编号">

                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="100"
                        label="用户名称">
                    </el-table-column>

                    <el-table-column
                        prop="address"
                        min-width="200"
                        label="用户地址">
                    </el-table-column>

                    <el-table-column
                        prop="concentrator"
                        min-width="80"
                        label="账期">
                    </el-table-column>

                    <el-table-column
                        prop="areaId"
                        min-width="100"
                        label="抄表日期">
                    </el-table-column>

                    <el-table-column
                        prop="connect"
                        min-width="80"
                        label="上期抄码">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="本期抄码">
                    </el-table-column>

                    <el-table-column
                        prop="endTime"
                        min-width="80"
                        label="本期用水">
                    </el-table-column>

                    <el-table-column
                        prop="fcode"
                        min-width="100"
                        label="增减水量">
                    </el-table-column>
                    
                    <el-table-column
                        prop="endTime"
                        min-width="100"
                        label="分摊水量">
                    </el-table-column>
                    
                    <el-table-column
                        prop="fcode"
                        min-width="100"
                        label="实际用水量">
                    </el-table-column>

                    <el-table-column
                        prop="fix"
                        min-width="80"
                        label="合计金额">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="通知状态">
                    </el-table-column>

                     <el-table-column
                        prop="callTime"
                        min-width="200"
                        label="通知时间">
                    </el-table-column>
                    
                    <el-table-column label="操作" fixed="right" width="85">
                        <template slot-scope="scope">
                        <el-button type="text">预览</el-button> 
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
            </el-tab-pane>
            <el-tab-pane label="欠费通知" name="NoticeArrears">
                <NoticeArrears></NoticeArrears>
            </el-tab-pane>
            <el-tab-pane label="缴费通知" name="SuccessfulReminderOfPayment">
               <SuccessfulReminderOfPayment></SuccessfulReminderOfPayment>
            </el-tab-pane>
            <el-tab-pane label="停水通知" name="WaterShutOffNotice">
               <WaterShutOffNotice></WaterShutOffNotice>
            </el-tab-pane>
            <el-tab-pane label="短信发送" name="ShortMessageSending">
               <ShortMessageSending></ShortMessageSending>
            </el-tab-pane>
            <el-tab-pane label="定制短信" name="CustomNotification">

                <div class="toolbar">
                    <el-form :inline="true" size="mini" :rules="rules" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
                      
                        <el-form-item label="营业所：">
                            <el-select  clearable v-model="formData.waterMeterCaliber" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.waterMeterCaliberOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="管理区域：">
                            <el-select  clearable v-model="formData.waterMeterCaliber" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.waterMeterCaliberOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                        <el-form-item label="册本号：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.CostType" placeholder=""></el-input>
                        </el-form-item>

                            <el-form-item>
                                <el-button type="primary" size="mini" @click.native="hidden" icon="el-icon-arrow-down upchange" class="soce-query">高级查询</el-button>
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        <el-form-item class="form-right">
                            <el-form-item label="选择短语：" class="bigSelect">
                                <el-select  clearable v-model="formData.waterMeterType" placeholder="全部">
                                    <el-option  v-for="(item,index) in formData.waterMeterTypeOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-button size="mini"  type="primary">选择发送</el-button>
                            <el-button @click="exportExcel" size="mini" type="primary">全部发送</el-button>
                        </el-form-item>
                        <!-- 高级查询内容 -->
                    <el-form-item v-show="isActive" class="advancedQuery">
                        <el-form-item label="抄表员：">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.PaymentMethod" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="用水类型：" class="bigSelect">
                            <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                        <el-form-item label="行业分类：">
                            <el-select  clearable v-model="formData.MeterReader" placeholder="全部">
                                <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="模糊查询：" class="searchInput">
                            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="用户编号/用户名称/用户地址"></el-input> -->
                            <el-tooltip class="item" effect="dark" content="用户编号、用户地址、用户名称" placement="top">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" clearable size="mini"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-form-item>
                    </el-form>
                </div>
                <div class="kl-table" :style="{height: maxHeight + 'px'}">
                <el-table
                    v-if="tableShow"
                    :max-height="maxHeight"         
                    stripe
                    highlight-current-row
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
                        type="index"  
                        label="NO."
                        width="50" 
                        fixed="left"
                        :index="indexMethod">
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        min-width="100"
                        label="册本号">

                    </el-table-column>

                    <el-table-column
                        prop="code"
                        min-width="80"
                        label="用户编号">

                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="用户名称">

                    </el-table-column>

                    <el-table-column
                        prop="factoryName"
                        min-width="120"
                        label="用户地址">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="100"
                        label="联系人">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="联系方式">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="手机号码">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="预存余额">
                    </el-table-column>
                                
                    <el-table-column label="操作" fixed="right" width="85">
                        <template slot-scope="scope">

                        <el-button type="text" @click.native="edit(scope.$index, scope.row)">预览</el-button> 
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
            <el-tab-pane label="短信明细" name="NotificationDetails">
                <NotificationDetails></NotificationDetails>
            </el-tab-pane>
            
            <el-tab-pane label="短信短语" name="ShortMessagePhraseManagement">
            <div v-if="EditVisible">

                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        
                        <el-form-item class="form-left">
                        <el-form-item label="状态：">
                            <el-select  clearable v-model="formData.watermeterWarehouse" placeholder=" 启用">
                                <el-option  v-for="(item,index) in formData.waterMeterStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                            </el-select>
                        </el-form-item>
                            <el-form-item label="模糊查询：" class="searchInput">
                                <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="短语名称/短信内容"></el-input> -->
                                <el-tooltip class="item" effect="dark" content="短语名称、短信内容" placement="top">
                                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" clearable size="mini"></el-input>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item>
                            
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item>
                        <el-form-item class="form-right">
                            <el-button size="mini" @click="add" type="primary" icon="el-icon-plus">添加</el-button>
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
                        prop="meter"
                        min-width="100"
                        label="短信编号">
                    </el-table-column>

                    <el-table-column
                        prop="model"
                        min-width="100"
                        label="短语名称">
                    </el-table-column>

                    <el-table-column
                        prop="modifyBy"
                        min-width="400"
                        label="短语内容">
                    </el-table-column>

                    <el-table-column
                        prop="isxz"
                        min-width="80"
                        label="状态">

                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="120">
                        <template slot-scope="scope">
    
                        <el-button type="text" @click.native="edit(scope.$index, scope.row)">编辑</el-button> 
                        <el-button size="mini" type="text">删除</el-button>

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
            
        <!-- 弹出表单增加 -->
            <div v-else>
                <div  class="toolbar">
                    <div class="form-left">
                    </div>
                    <div class="form-right">
                        <el-button size="mini" type="primary">保存</el-button>
                        <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
                    </div>
                </div>
                <ShortMessagePhraseManagementEdit ref="childShortMessagePhraseManagement"></ShortMessagePhraseManagementEdit>
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
    name:"CustomerNotification",
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
      EditVisible:true,//弹出表单

        activeName: 'WaterBill',
        crumbsData :{  //面包屑
            titleList:[
                {title:'服务中心',path:'/ServiceCentre'},
                {title:'客户通知',method:()=>{window.histroy.back()}},
                {title:'水费通知',method:()=>{window.histroy.back()}},

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
            subordinateDepartmentsOptions:[
                {
                    name:"一月",
                    value:"1"
                },
                {
                    name:"三月",
                    value:"2"
                },
                {
                    name:"偶月",
                    value:"3"
                },
            ],
            meterDate:"",
            AccountPeriod:"",
            userNum:"",
            book:"",
            notificationStatus:[
                {
                    name:"全部",
                    value:"1"
                },
                {
                    name:"未通知",
                    value:"2"
                },
                {
                    name:"已打印通知",
                    value:"3"
                },
                {
                    name:"已短信通知",
                    value:"4"
                },
                {
                    name:"已微信通知",
                    value:"5"
                },
            ],
            IsBigUser:"",
            IsBigUserOptions:[
                {
                    name:"是",
                    value:"1"
                },
                {
                    name:"否",
                    value:"2"
                },
            ],

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
        histroyData:{ },
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
        isActive:false
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
                        callTime:'2019-07-04',
                        bookNum: "0001",
                        code: "000030",
                        areaName: "袁正林",
                        address: "东湖小区",
                        concentrator: "201908",
                        areaId:'2018-07-04',
                        connect: "11.40",
                        daytime: "12",
                        endTime: "4.20",
                        fcode: "0.80",
                        fix: "20",
                        fixValue: "已通知",

                       
                    },
                     {
                        callTime:'2019-07-04',
                        bookNum: "0002",
                        code: "000030",
                        areaName: "袁超",
                        address: "东湖小区",
                        concentrator: "201907",
                        areaId: '2018-07-09',
                        connect: "11.40",
                        daytime: "13",
                        endTime: "4.20",
                        fcode: "0.80",
                        fix: "20",
                        fixValue: "已通知",

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
          this.crumbsData.titleList[2].title = tab.label;
  
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
      cellClick(row, column, cell, event) { //点击文件名
        let that = this;
        
      },
      indexMethod(index) {//获取表格序号
        //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
        return  (this.histroyData.pageSize-20)*this.histroyData.pages + (index+1) ;
    
      },
      
        add(){//添加
        this.EditVisible = false;
        this.$set(this.crumbsData.titleList, "3", { title: '添加', method: () => { window.histroy.back() } })

        },
        edit(){
        this.$set(this.crumbsData.titleList, "3", { title: '编辑', method: () => { window.histroy.back() } })
        this.EditVisible = false;
        },
        closeDialog(){ //关闭会话
        this.crumbsData.titleList.splice(3, 1);
        this.EditVisible = true;
        },
        //弹出框
        submit(formName){	//提交
            this.$refs.childShortMessagePhraseManagement.submit()
            // this.ShortMessagePhraseManagementVisible = false;
        },
         hidden() {
            if (this.isActive == true) {
            $('.upchange').addClass('el-icon-arrow-down').removeClass('el-icon-arrow-up')
            this.isActive = false;
            //   $('.el-table--fit').css('height', '66%');
            
            } else {
            $('.upchange').addClass('el-icon-arrow-up').removeClass('el-icon-arrow-down')
            
            this.isActive = true;
            }
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
  };
</script>
<style lang="scss">
.CustomerNotification{
    // padding:20px;
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
    .WaterBill .toolbar .form-left{
        width: 65%;
    }
    .demo-form{
        width:65%;
        margin: 20px auto;
        .el-input,.el-textarea{
            width: 100% !important;
        }
    }
    .el-tabs__header{
        padding: 0px 20px;

    }
}
</style>