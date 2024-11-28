<template>
  <div class="BigUsers">
    <!-- <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <h2 class="tab-title">
        <i></i>
        大用户</h2>
    </div> -->

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

        <!-- <el-form-item label="抄表日期：">
          <el-date-picker :editable="false" size="mini" v-model="formData.dataList" style="width:210px" type="daterange" align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="账期：">
          <el-date-picker v-model="formData.dataList" size="mini" type="month" unlink-panels format="yyyyMM" value-format="yyyyMM" placeholder="选择月" style="width:100%;">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="水表口径大于：">
          <el-select v-model="formData.watermeterWarehouse" size="mini">
            <el-option label="50" value="0"></el-option>
            <el-option label="55" value="1"></el-option>
            <el-option label="60" value="2"></el-option>
            <el-option label="70" value="3"></el-option>
            <el-option label="80" value="4"></el-option>
            <el-option label="100" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="水量大于：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.caliber" placeholder="请输入水量">

          </el-input>
          <!-- <el-select v-model="formData.caliber" size="mini">
            <el-option label="等于" value="0"></el-option>
            <el-option label="大于等于" value="1"></el-option>
            <el-option label="小于等于" value="2"></el-option>
          </el-select> -->
        </el-form-item>

        <!-- <el-form-item>
          <el-select v-model="formData.auditLevel" size="mini">
            <el-option label="已审" value="0"></el-option>
            <el-option label="未审" value="1"></el-option>
            <el-option label="已删除" value="2"></el-option>
            <el-option v-for="item in inforList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="模糊查询：">
           <el-select v-model="formData.auditLevel" size="mini" @change="getAuditLevel">
            <el-option label="客户编号" value="0"></el-option>
            <el-option label="客户名称" value="1"></el-option>
            <el-option label="用户编号" value="2"></el-option>
            <el-option label="用户名称" value="3"></el-option>
            <el-option label="册本号" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.searchType" :placeholder="formData.auditLevelName"></el-input>

        </el-form-item> -->
        <el-form-item label="模糊查询:">
          <el-tooltip class="item" effect="dark" content="客户编号、客户名称、用户编号、用户名称、册本号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.searchType"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>

        <el-form-item style="float: right">
          <!-- <el-button size="mini" type="primary" icon="el-icon-plus">添加</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" @cell-click="cellClick" class="wuserInfo-table">

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="codeBook" min-width="100" label="册本号">
        </el-table-column>

        <el-table-column prop="connect" min-width="80" label="用户编号">
        </el-table-column>

        <el-table-column prop="connect" min-width="80" label="用户名称">

        </el-table-column>

        <el-table-column prop="flux" min-width="80" label="水表口径">
        </el-table-column>


        <el-table-column prop="flux" min-width="80" label="上期抄码">
        </el-table-column>


        <el-table-column prop="concentrator" min-width="80" label="本期抄码">
        </el-table-column>

        <!-- <el-table-column prop="status" min-width="80" label="差异额">
        </el-table-column> -->

        <!-- <el-table-column prop="concentrator" min-width="120" label="漏失率">
        </el-table-column> -->

        <el-table-column prop="status" min-width="80" label="本期水量">
        </el-table-column>
        <el-table-column prop="fixValue" min-width="80" label="上期水量">
        </el-table-column>
        

        <!-- <el-table-column prop="status" min-width="80" label="环比差额">
        </el-table-column> -->

        <el-table-column prop="concentrator" min-width="80" label="环比率">
        </el-table-column>

        <el-table-column prop="status" min-width="80" label="去年同期水量">
        </el-table-column>

        <el-table-column prop="concentrator" min-width="80" label="同比率">
        </el-table-column>

        <el-table-column prop="lvalue" min-width="80" label="用户地址" show-overflow-tooltip>
        </el-table-column>
        
        <el-table-column prop="fixValue" min-width="80" label="用水类型">
        </el-table-column>

        <!-- <el-table-column label="操作" fixed="right" width="85">
          <template slot-scope="scope">
            <el-button type="text" size='mini' @click.native="editContent = true">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
     
    </div>
     <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
        </el-pagination>
      </div>
    <el-dialog :close-on-click-modal="false" title="大用户-编辑" :visible.sync="editContent">
      <el-form :model="dialogForm" ref="form" :rules="rules" label-width="100px">
        <div class="my-input1">
          <el-form-item label="大用户编号：" prop="bigUserNum">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.bigUserNum" size="mini" clearable></el-input>
          </el-form-item>
        </div>
        <div class="my-input1">
          <el-form-item label="单位名称：" prop="companyName">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.companyName" size="mini" clearable></el-input>
          </el-form-item>
        </div>
        <div class="my-input1">
          <el-form-item label="单位地址：" prop="companyAddress">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.companyAddress" size="mini" clearable></el-input>
          </el-form-item>
        </div>
        <div class="my-input1">
          <el-form-item label="联系人：" prop="contacts">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.contacts" size="mini" clearable></el-input>
          </el-form-item>
        </div>
        <div class="my-input1">
          <el-form-item label="座机号码：" prop="contactNumber">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.contactNumber" size="mini" clearable></el-input>
          </el-form-item>
        </div>
        <div class="my-input1">
          <el-form-item label="联系邮箱：" prop="contactMailbox">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogForm.contactMailbox" size="mini" clearable></el-input>
          </el-form-item>
        </div>
        <div class="my-input1">
          <el-form-item label="行业分类：" prop="industryClassification">
            <el-select v-model="dialogForm.industryClassification" size="mini" style="width: 100%">
            </el-select>
          </el-form-item>
        </div>
        <div class="my-input1">
          <el-form-item label="状态：" prop="state">
            <el-select v-model="dialogForm.state" size="mini" style="width: 100%">
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom:1%;margin-right:2%;float:right" size='mini'>增加用户</el-button>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" @cell-click="cellClick" class="wuserInfo-table">
          <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column prop="userNum" min-width="100" label="册本"></el-table-column>
          <el-table-column prop="userName" min-width="80" label="用户编号"></el-table-column>
          <el-table-column prop="userAddress" min-width="80" label="用户名称"></el-table-column>
          <el-table-column prop="userAddress" min-width="80" label="用户地址"></el-table-column>
          <el-table-column prop="meterAddress" min-width="80" label="用水类型"></el-table-column>
          <el-table-column label="操作" fixed="right" width="85">
            <template slot-scope="scope">
              <el-button type="text" size='mini'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
          </el-pagination>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editContent = false" size='mini'>附件上传</el-button>
        <el-button type="primary" @click="editContent = false" size='mini'>保存</el-button>
        <el-button @click="editContent = false" size='mini'>返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "BigUsers",
  components: {

  },
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '抄表中心', path: '/MeterReadingCenter' },
          { title: '统计', path: '/PrecedenceTable' },
          { title: '大用户', method: () => { window.histroy.back() } }
        ],

      },
      isActive: false,  //控制高级查询内容的显示
      formData: {
        auditLevel: '0',
        auditLevelName: '客户编号',

        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [],
        waterMeterManufacturer: "",
        waterMeterManufacturerOptions: [],
        waterMeterType: "",
        waterMeterTypeOptions: [],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: []

      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {

      },
      waterAddVisible: false,  //综合查询的显示和隐藏
      WaterEditorName: '综合查询',
      ruleFormData: {},
      dialogForm: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false,
      editContent: false,
    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.BigUsers .kl-table', ['.BigUsers .toolbar', '.BigUsers .block', '.BigUsers bread-contain'])
  },
  methods: {
    init() {

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
    getAuditLevel(item){
      console.log(item);
      if (item == 0) {
        this.formData.auditLevelName = '客户编号'
      }else if (item == 1) {
        this.formData.auditLevelName = '客户名称'
      }else if (item == 2) {
        this.formData.auditLevelName = '用户编号'
      }else if (item == 3) {
        this.formData.auditLevelName = '用户名称'
      }else if (item == 4) {
        this.formData.auditLevelName = '册本号'
      }
    },
    hidden() {
      if (this.isActive == true) {
        $('.upchange').addClass('el-icon-arrow-down').removeClass('el-icon-arrow-up')
        this.isActive = false;
        $('.el-table--fit').css('height', '66%');

      } else {
        $('.upchange').addClass('el-icon-arrow-up').removeClass('el-icon-arrow-down')

        this.isActive = true;
        $('.el-table--fit').css('height', '50%');
      }
    },
    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    exportExcel() {
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
    //   查看历史
    viewHistory(index, row) {

    },
    cellClick(row, column, cell, event) { //点击文件名
      let that = this;

    },
    indexMethod(index) {//获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1);

    },
    closeDialog() { //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
      // this.waterAddVisible = false;
    },
    // 添加
    add() {

    },
    // 编辑
    edit() {
      this.backfillVisible = true;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.BigUsers {
  width: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .kl-table {
    // padding: 0px 20px;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  .btnBox {
    display: inline-block;
    width: 100%;
    text-align: center;
    margin-bottom: 2%;
  }
  .btnBox .el-button {
    margin-left: 2%;
    font-size: 14px;
  }
  .my-input1 {
    width: 35%;
    display: inline-block;
    padding-left: 8%;
    .el-input__inner {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }
  .my-input1 .el-input {
    width: 100% !important;
  }
  .my-input1 .el-select .el-input {
    width: 100%;
  }
  .gocenter2 {
    width: 78.4%;
  }
}
</style>
