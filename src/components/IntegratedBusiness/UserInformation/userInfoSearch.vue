<template>
    <div class="userInfoSearch">
        <!-- 弹出表单客户变动情况 -->
    	<el-dialog :title="WaterEditorName" append-to-body :close-on-click-modal="false" :visible.sync="CustomerChangesVisible" @close="closeDialog" >
            <CustomerChangesEdit
                ref="childWaterEditor"
            ></CustomerChangesEdit>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="submit('ruleForm')">保 存</el-button>
		      <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
		    </div>
    	</el-dialog>
        <!-- 弹出表单费用信息 -->
    	<el-dialog :title="backfillName" append-to-body :close-on-click-modal="false" :visible.sync="backfillVisible" class="backfill" @close="closeDialog" >
            <WaterUseOverTheYears
                ref="backfillEditor"
            ></WaterUseOverTheYears>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="backfillSubmit('ruleForm')">保 存</el-button>
		      <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
		    </div>
    	</el-dialog>
        <!-- 弹出表单抄表信息 -->
    	<el-dialog :title="MeterReadingName" append-to-body :close-on-click-modal="false" :visible.sync="MeterReadingVisible" class="backfill" @close="closeDialog" >
            <MeterReadingInfo
                ref="MeterReading"
            ></MeterReadingInfo>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="backfillSubmit">保 存</el-button>
		      <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
		    </div>
    	</el-dialog>
        <!-- 弹出表单账户流水 -->
    	<el-dialog :title="PredepositDdetailsName" append-to-body :close-on-click-modal="false" :visible.sync="PredepositDdetailsVisible" class="backfill" @close="closeDialog" >
            <PredepositDdetailsInfo
                ref="PredepositDdetails"
            ></PredepositDdetailsInfo>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="backfillSubmit">保 存</el-button>
		      <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
		    </div>
    	</el-dialog>
        <!-- 弹出表单附件查看 -->
    	<el-dialog :title="AttachmentViewName" append-to-body :close-on-click-modal="false" :visible.sync="AttachmentViewVisible" class="AttachmentView" @close="closeDialog" >
            <AttachmentViewInfo
                ref="AttachmentView"
            ></AttachmentViewInfo>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="backfillSubmit">保 存</el-button>
		      <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
		    </div>
    	</el-dialog>
        <div class="toolbar">
                <el-form :inline="true" :model="formData" class="demo-form-inline" @submit.native.prevent>
                    <el-form-item class="form-left">

                        <el-form-item label="模糊查询：">
                            <el-tooltip class="item" effect="dark" content="用户编号、用户名称、用户地址、册本号" placement="top">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" @keydown.enter.native="demand" @input="e => input = inputMe(e)"></el-input>
                            </el-tooltip>
                            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="用户编号/用户名称/用户地址/册本"></el-input> -->
                        </el-form-item>
                        <el-form-item>

                            <el-button  size="mini" class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                        </el-form-item>

                    </el-form-item>

                    <el-form-item class="form-right">
                        <el-button size="mini" type="primary">上一户</el-button>
                        <el-button size="mini" type="primary">下一户</el-button>

                        <el-button size="mini" type="primary" @click="CustomerChanges">变动情况</el-button>
                        <el-button size="mini" type="primary" @click="WaterUse">费用信息</el-button>
                        <el-button size="mini" type="primary" @click="MeterReading">抄表信息</el-button>
                        <el-button size="mini" type="primary" @click="PredepositDdetails">账户流水</el-button>
                        <el-button size="mini" type="primary">打印合同</el-button>
                        <el-button size="mini" type="primary">打印新卡</el-button>
                        <el-button size="mini" type="primary" @click="AttachmentView">查看附件</el-button>

                    </el-form-item>

                </el-form>
            </div>
        <userInfo :parentToChild="'1'" :isEdit="isEdit"></userInfo>

    </div>
</template>
<script>
import CustomerChangesEdit from "./CustomerChanges"
import WaterUseOverTheYears from "./WaterUseOverTheYears"
import MeterReadingInfo from "./MeterReadingInfo"
import PredepositDdetailsInfo from "./PredepositDdetailsInfo"
import AttachmentViewInfo from "./AttachmentViewInfo"
import userInfo from "@/components/userInfo/ctmInfo.vue"
export default {
    name:"userInfoSearch",
    components:{
        CustomerChangesEdit,
        WaterUseOverTheYears,
        MeterReadingInfo,
        PredepositDdetailsInfo,
        AttachmentViewInfo,
        userInfo
    },
    data(){
        return{
            isEdit:true,
            userInfoEditForm: {
                userStuse:'2',
                userStuseOption:[
                    {
                        name: "注销",
                        value: "1"
                    },
                    {
                        name: "正常",
                        value: "2"
                    },
                    {
                        name: "停用",
                        value: "3"
                    },
                ],
                radio1:'1',
                workType: [
                    {
                        name: "居民",
                        value: "1"
                    },
                    {
                        name: "学校",
                        value: "1"
                    },
                    {
                        name: "公共事业",
                        value: "1"
                    },
                    {
                        name: "福利、敬老院",
                        value: "1"
                    },
                    {
                        name: "行政事业单位",
                        value: "1"
                    },
                    {
                        name: "部队",
                        value: "1"
                    },
                    {
                        name: "医疗卫生单位",
                        value: "1"
                    },
                    {
                        name: "能源",
                        value: "1"
                    },
                    ],
                radio: '1',
                bigUser: '1',
                userWaterTime:'2020-01-01',
                bankName: [
                    {
                        name: "中国银行",
                        value: '1'
                    }
                ],
                InvoiceInformation: [
                    {
                        label: "单位名称：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "纳税人识别号：",
                        value: "",
                        tips: "12441400714861777E "
                    },
                    {
                        label: "联系地址：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "座机号码：",
                        value: "",
                        tips: ""
                    },


                ],
                countMsgOrder: [
                    {
                        label: "开户名：",
                        value: "",
                        tips: "梅州粤海水务有限公司"
                    },
                    {
                        label: "银行账户：",
                        value: "",
                        tips: "101801012001"
                    },

                // {
                //     label:"银行签约日期：",
                //     value:"",
                //     tips:"20180-02-13"
                // },
                ],
                countMsg: [
                    {
                        label: "余额：",
                        value: "",
                        tips: ""
                    },

                    {
                        label: "托号：",
                        value: "",
                        tips: "101801012001"
                    },
                    {
                        label: "托收合同号：",
                        value: "",
                        tips: "101801012001"
                    },


                ],

                // 用户-基础信息
                ComparisonTableInfoForm: [
                    // {
                    //     label:"街区：",
                    //     value:"",
                    //     tips:""
                    // },
                    {
                        label: "联系人：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "座机号码：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "邮箱：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "手机号码：",
                        value: "",
                        tips: ""
                    },


                ],
                ComparisonTableInfoForm1: [
                    // {
                    //     label:"街区：",
                    //     value:"",
                    //     tips:""
                    // },
                    {
                        label: "传真号码：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "停水联系人",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "停水座机号码",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "房产证编号",
                        value: "",
                        tips: ""
                    },


                ],
                Waterworks: "",
                pumpingStation: "",
                Pipeline: "",
                // 用户合同信息
                ContractInformation: [
                    {
                        label: "身份证号：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "合同年限（月）：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "签订日期：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "供水合同号：",
                        value: "",
                        tips: ""
                    },

                ],
                // 用户分类信息
                classifyPropOptions: [
                {
                    label: "行业分类：",
                    tips: "居民",
                    value: "",
                    options: [
                    {
                        name: "居民",
                        value: "1"
                    },
                    {
                        name: "学校",
                        value: "1"
                    },
                    {
                        name: "公共事业",
                        value: "1"
                    },
                    {
                        name: "福利、敬老院",
                        value: "1"
                    },
                    {
                        name: "行政事业单位",
                        value: "1"
                    },
                    {
                        name: "部队",
                        value: "1"
                    },
                    {
                        name: "医疗卫生单位",
                        value: "1"
                    },
                    {
                        name: "能源",
                        value: "1"
                    },
                    ]
                },
                {
                    label: "计量收费标志：",
                    tips: "计量收费",
                    value: "",
                    options: [
                    {
                        name: "计量收费",
                        value: "1"
                    },
                    {
                        name: "计量不收费",
                        value: "1"
                    },
                    {
                        name: "不计量收费",
                        value: "1"
                    },
                    {
                        name: "不计量不收费",
                        value: "1"
                    },
                    ]
                },
                {
                    label: "户型：",
                    tips: "单户",
                    value: "",
                    options: [
                    {
                        name: "单户",
                        value: "1"
                    },
                    {
                        name: "多户",
                        value: "1"
                    },

                    ]
                },
                ],
                TypesWaterUse: "",
                WaterPropertie: "",
                CategorieWaterUse: "",
                ClassificationUse: "",
                // 用户抄表信息
                MeterReading: [

                    {
                        label: "抄表顺序号：",
                        value: "",
                        tips: "2753"
                    },
                    {
                        label: "新表起码：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "旧抄表码：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "邮箱：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "投递人：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "投递备注信息：",
                        value: "",
                        tips: ""
                    },

                ],
                MeterReadingOnly: [
                    {
                        label: "抄表日：",
                        value: "",
                        tips: "20"
                    },
                    {
                        label: "抄表周期：",
                        value: "",
                        tips: "每月"
                    },
                    {
                        label: "本期行度：",
                        value: "",
                        tips: ""
                    },
                ],
                yes: "",
                no: "",
                // 用户水表信息
                WaterMeter: [
                    {
                        label: "水表编号：",
                        value: "",
                        tips: "20"
                    },
                    {
                        label: "出厂编号：",
                        value: "",
                        tips: "每月"
                    },
                    {
                        label: "有效日期：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "装表日期：",
                        value: "",
                        tips: "2753"
                    },
                    {
                        label: "换表日期：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "拆表日期：",
                        value: "",
                        tips: ""
                    },
                ],
                WaterMeterpOptions: [
                 {
                    label: "表类型：",
                    tips: "机械表",
                    value: "",
                    options: [
                        {
                            name: "机械表",
                            value: "1"
                        },
                        {
                            name: "智能表",
                            value: "1"
                        },
                    ]
                },
                {
                    label: "厂家名称：",
                    tips: "宁波",
                    value: "",
                    options: [
                    {
                        name: "宁波",
                        value: "1"
                    },
                    {
                        name: "上海",
                        value: "1"
                    },
                    {
                        name: "梅花",
                        value: "1"
                    },
                    {
                        name: "常德",
                        value: "1"
                    },
                    {
                        name: "开封",
                        value: "1"
                    },
                    ]
                },
                {
                    label: "信用等级：",
                    tips: "A",
                    value: "",
                    options: [
                    {
                        name: "A",
                        value: "1"
                    },
                    {
                        name: "B",
                        value: "1"
                    },
                    {
                        name: "C",
                        value: "1"
                    },
                    {
                        name: "D",
                        value: "1"
                    },

                    ]
                },
                {
                    label: "总分表：",
                    tips: "",
                    value: "",
                    options: [
                    {
                        name: "否",
                        value: "1"
                    },
                    {
                        name: "总表",
                        value: "1"
                    },
                    {
                        name: "分表",
                        value: "1"
                    },
                    ]
                },
                {
                    label: "字母表：",
                    tips: "",
                    value: "",
                    options: [
                    {
                        name: "否",
                        value: "1"
                    },
                    {
                        name: "子表",
                        value: "1"
                    },
                    {
                        name: "母表",
                        value: "1"
                    },
                    ]
                },
                ],
                UnplannedMeterReading: "",
                caliber: "",
                caliberoptions1: [],
                caliberoptions2: [],
                caliberoptions3: [
                    {
                        name: '户内',
                        value: "1"
                    },
                    {
                        name: '户外',
                        value: "2"
                    },
                ],
                caliberoptions: [
                    {
                        name: 15,
                        value: "1"
                    },
                    {
                        name: 20,
                        value: "2"
                    },
                    {
                        name: 25,
                        value: "3"
                    },
                    {
                        name: 40,
                        value: "4"
                    },
                    {
                        name: 50,
                        value: "5"
                    },
                    {
                        name: 80,
                        value: "6"
                    },
                    {
                        name: 100,
                        value: "7"
                    },
                ],
                // 用户价格信息
                PriceInfo: [
                    {
                        label: "水费比率（%）：",
                        value: "",
                        tips: "20"
                    },
                    {
                        label: "污水费比率（%）：",
                        value: "",
                        tips: "100.00"
                    },
                    {
                        label: "最低用水量：",
                        value: "",
                        tips: "0"
                    },
                    {
                        label: "人数：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "垃圾费比率（%）：",
                        value: "",
                        tips: "2753"
                    },
                    {
                        label: "垃圾费数量：",
                        value: "",
                        tips: ""
                    },
                    {
                        label: "每月应收垃圾费：",
                        value: "",
                        tips: ""
                    },
                ],
                desc: "",
                userNume: "",
                descoptions: [
                ],
                asd: [
                    {
                        name: "计量、计费",
                        value: "1"
                    },
                    {
                        name: "计量、不计费",
                        value: "2"
                    },
                    {
                        name: "不计量、计费",
                        value: "3"
                    },
                    {
                        name: "不计量、不计费",
                        value: "4"
                    },
                ],
                areas: [
                    {
                        name: "城区",
                        value: "1"
                    },
                    {
                        name: "农村",
                        value: "2"
                    },
                ],
                BusinessSite: [
                {
                    name: "营业部",
                    value: "1"
                },
                ],
                idcardTypeList: [
                    {
                        name: "居民身份证",
                        value: "1"
                    },
                    {
                        name: "户口本",
                        value: "2"
                    },
                    {
                        name: "护照",
                        value: "3"
                    },
                    {
                        name: "回乡证",
                        value: "4"
                    },
                    {
                        name: "台胞证",
                        value: "5"
                    },
                ],
                TypesWwaterUse: [
                    {
                        name: "实体表",
                        value: "1"
                    },
                    {
                        name: "虚拟表",
                        value: "2"
                    },
                ],
                WaterProperties: [
                    {
                        name: "一般用途",
                        value: "1"
                    },
                    {
                        name: "消防表",
                        value: "2"
                    },
                    {
                        name: "监控表",
                        value: "3"
                    },
                ],
                CategoriesWaterUse: [
                {
                    name: "用户表",
                    value: "1"
                },
                {
                    name: "自用表",
                    value: "2"
                },
                ],
                ClassificationUses: [
                {
                    name: "正常表",
                    value: "1"
                },
                {
                    name: "总分总表",
                    value: "3"
                },
                {
                    name: "总分分表",
                    value: "4"
                },
                ],
                PriceType: [
                {
                    name: "0038__工业用水3.54",
                    value: "1"
                },
                {
                    name: "0015__特种用水3.54",
                    value: "2"
                },
                {
                    name: "0029__区域用水3.54",
                    value: "3"
                },
                {
                    name: "0030__基本水价3.54",
                    value: "4"
                },
                {
                    name: "0039__特种用水3.54",
                    value: "5"
                },
                {
                    name: "0040__生活用水3.54",
                    value: "6"
                },
                {
                    name: "0041__免费用水3.54",
                    value: "7"
                },
                ],
                userNum: "",
                PriceStrategy: "",
                isfines: "",
                UpdateCodeCopye: "",
                Remarks: "",
                year: "",
                countNum: "",
                PaymentMethod: "",
                bankName: "",
                status: "",
                region: "",
                BusinessSite: "",
                bankNameOptions: [
                {
                    name: "中国银行",
                    value: "1"
                }
                ],
                PaymentMethodOption: [
                {
                    name: "托收",
                    value: "1"
                }
                ],
                statusoptions: [
                {
                    name: "启用",
                    value: "1",

                },
                {
                    name: "停用",
                    value: "2"
                }
                ],

            },
            rules: {
            },
            histroyData:{},
            formData:{
                con:"",
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
            CustomerChangesVisible:false,
            WaterEditorName:'变动情况',
            ruleFormData:{},
            backfillName:"费用信息",
            backfillVisible:false,
            MeterReadingName:"抄表信息",
            MeterReadingVisible:false,
            PredepositDdetailsName:"账户流水",
            PredepositDdetailsVisible:false,
            AttachmentViewName:"查看附件",
            AttachmentViewVisible:false,

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
.userInfoSearch{
    height: 100%;
    overflow-y: auto;
    .backfillSubmitForm{
        .el-dialog__body{
            padding:0;
        }
    }
    .el-steps--horizontal{
        margin: 0 auto;
        width: 50%;
        padding-bottom: 20px;
    }


}

</style>
