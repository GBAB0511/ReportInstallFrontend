<template>
  <div class="AnomalyAnalysis">
    <!-- 水量异常模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <!-- <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button> -->
         <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleExportExcel">导出</el-button>
      </div>
    </div>

    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="抄表日期：">
          <el-date-picker :editable="false" size="mini" v-model="tableTime"  type="daterange" align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抄表员：">
          <el-select ref="select1" v-model="tableQuery.meterReadingStaffAccount" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="营业区域：">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
               :show-all-levels="false" :props="tprops"  >
            </el-cascader>
            </el-form-item >
        <el-form-item label="异常类型：">
          <el-select ref="select2" v-model="tableQuery.abnormalStatus" size="mini" clearable>
            <el-option v-for="item in dictionaryData.WEP" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常比例：" v-if="tableQuery.abnormalStatus == '2' || tableQuery.abnormalStatus == '3'">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   type="Number" v-model="tableQuery.abnormalNumber" @keydown.enter.native="search" ></el-input>
        </el-form-item>
        <el-form-item label="模糊查询：">
          <el-tooltip class="item" effect="dark" content="册本号、用户编号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="8">
            <el-form-item label="上期水量：">
              <el-select  ref="select6" v-model="tableQuery.priWaterCompare" size="mini">
                <el-option label="等于" value="equal"></el-option>
                <el-option label="大于等于" value="more"></el-option>
                <el-option label="小于等于" value="less"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="noLabelInput">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.priorPeriodWater" @keydown.enter.native="search"></el-input>m³
            </el-form-item>
            </el-col>
            <el-col :span="8">
        <el-form-item label="本期水量：">
            <el-select  ref="select7" v-model="tableQuery.curWaterCompare" size="mini">
              <el-option label="等于" value="equal"></el-option>
              <el-option label="大于等于" value="more"></el-option>
              <el-option label="小于等于" value="less"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="noLabelInput">
            <el-input
              v-model="tableQuery.currendPeriodWater"
              @keydown.enter.native="search"
              clearable
            ></el-input>m³
          </el-form-item>
        </el-col>
        <el-col :span="2">
            <el-button class='searchBtn' size="mini" @click="search" icon="el-icon-search"></el-button>
        </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="wuserInfo-table">
        <el-table-column type="index" label="NO." width="60" :index="indexMethod" fixed></el-table-column>
        <el-table-column prop="userNo" min-width="120" label="用户编号" fixed="left"></el-table-column>
        <el-table-column prop="ctmName" min-width="220" label="客户名称" fixed="left" show-overflow-tooltip sortable></el-table-column>
       <el-table-column prop="businessAreaName" min-width="120" label="营业区域" fixed="left"></el-table-column>
        <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" fixed="left"></el-table-column>
        <el-table-column prop="ctmAddr" min-width="220" label="客户地址" show-overflow-tooltip></el-table-column>
         <el-table-column prop="bookNo" min-width="120" label="表册号" ></el-table-column>
        <!-- <el-table-column prop="linkTel" min-width="120" label="联系电话"></el-table-column>-->
        <!--<el-table-column prop="mobile" min-width="120" label="手机号码"></el-table-column>-->
        <el-table-column prop="accountPeriod" min-width="80" label="账期"></el-table-column>

         <!--<el-table-column prop="meterReadingDate" min-width="120" label="抄表日期"></el-table-column>-->

        <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right"></el-table-column>
        <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right"></el-table-column>
        <el-table-column prop="sixAverage" min-width="120" label="六期平均" align="right" :formatter='parseNumber' sortable></el-table-column>
        <el-table-column prop="priorPeriodWater" min-width="80" label="上期用水" align="right"></el-table-column>
        <el-table-column prop="currendPeriodWater" min-width="80" label="本期用水" align="right"></el-table-column>
        <el-table-column prop="addWater" min-width="80" label="增减水量" align="right"></el-table-column>
        <el-table-column prop="shareWater" min-width="80" label="分摊水量" align="right"></el-table-column>
        <el-table-column prop="realityWater" min-width="120" label="实际用水量" align="right" :formatter='parseNumber' sortable></el-table-column>
        <el-table-column prop="meterBore" min-width="80" label="水表口径"></el-table-column>
          <el-table-column prop="statusName" min-width="80" label="抄表状态" fixed="right">
             <template slot-scope="scope">
                  <span :class="scope.row.statusName == '正常'?'greenFont':'redFont'">
                    {{ scope.row.statusName }}
                  </span>
                </template>
          </el-table-column>
        <el-table-column prop="comments" min-width="80" label="备注"></el-table-column>
      </el-table>

    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
       <el-dialog
        v-if="exportDialogShow"
        title="导出内容"
        :close-on-click-modal="false"
        :visible.sync="exportDialogShow"
        class="button-dialog"
        @close="closeDialog"
        :append-to-body="true"
      >
        <ExportFieldCheckbox ref="exportField" ></ExportFieldCheckbox>
        <div slot="footer">
          <el-button type="primary" size="mini" @click="handleEnsureExport">确定</el-button>
          <el-button size="mini" @click="closeDialog">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import ExportFieldCheckbox from './ExportFieldCheckbox.vue';
export default {
  name: "AnomalyAnalysis",
  components: {
    ExportFieldCheckbox
  },
  data() {
    return {
      exportDialogShow:false,//资料导出弹窗
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "检查" },
          { title: "水量异常" }
        ]
      },
      tprops:{
      //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath:false,
      },
      // 列表数据
      tableData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea:'',
        beginDate: '',
        endDate: '',
        abnormalStatus: '',
        abnormalNumber:'',
        groupCode:'',
        priWaterCompare: 'equal',
        priorPeriodWater: '',
        curWaterCompare: 'equal',
        currendPeriodWater: '',
      },
      tableTime: [this.getFirstDayOfMonth(),this.common.date() ],
      // 数据字典数据
      dictionaryData: [],
      isActive: false, //控制高级查询内容的显示
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      meterReaderList: [],
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      waterAddVisible: false, //综合查询的显示和隐藏
      WaterEditorName: "综合查询",
      ruleFormData: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false,
      meterReader: "0",
      meterReadDate: "0",
      businessArea: []
    };
  },
  mounted() {
var currentCode = localStorage.getItem('companyNo')
    this.tableQuery.groupCode =  currentCode
    this.getMeterReader();
    this.getBaseConfig();
    this.businessAreaSelect()
    setTimeout(() => {
      this.getDictionary();
    },1000)
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".AnomalyAnalysis", [
      ".AnomalyAnalysis .toolbar",
      ".AnomalyAnalysis .block",
      ".AnomalyAnalysis .bread-contain"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
    parseNumber(row, column){//转为数字类型，防止排序错误
      return row[column.property] = Number(row[column.property])
    },
    //初始化
    init() {
      let _this = this
      if(this.tableTime && this.tableTime.length > 0) {
        this.tableQuery.beginDate = this.tableTime[0]
        this.tableQuery.endDate = this.tableTime[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
      let params = {
        "busicode": "MrAbWaterList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res
      })
    },
    //日期格式化，返回值形式为yy-mm-dd
    timeFormat: function (date) {
      if (!date || typeof(date) === "string") {
        this.error("参数异常，请检查...");
      }
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      var d = date.getDate(); //日
      return y + "-" + m + "-" + d;
    },
    //获取当月第一天
    getFirstDayOfMonth: function() {
      let date = new Date();
      date.setDate(1);
      return this.timeFormat(date);
    },
    businessAreaSelect() {   //营业区域下拉框
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessArea = data.children;
      })
    },
        //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    //抄表员下拉框数据
    getMeterReader() {
      let _this = this
      let params = {
        "busicode": "PostUserSelect",
        "data": {"postNo":"2"},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.meterReaderList = [...[{ userName: "全部"}],...res];
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "WEP,"//异常类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
        _this.tableQuery.abnormalStatus = _this.dictionaryData.WEP[0].value
        // _this.tableQuery.beginDate = (new Date()).getFullYear() + '-' + (Number((new Date()).getMonth()) + 1) + '-01'
        // _this.tableQuery.endDate = (new Date()).getFullYear() + '-' + (Number((new Date()).getMonth()) + 1) + '-' + (new Date()).getDate()
        // 由于异常类型必填，所以初始化列表方法在获取到异常类型数据后再触发
        _this.init();
      })
    },
    getBaseConfig() { //获取水量异常比例配置
      let _this = this
      var params = {
        busicode: "ConfigList",
        data:{searchContent:'MR_WATER_ABNORMAL_RATIO'}
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = res.list
          if(data!=null && data.length > 0) {
            this.tableQuery.abnormalNumber = data[0].configValue
          }
        })
        .catch(res => {

        });
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 查询按钮
    search() {
      this.tableQuery.businessArea=this.common.handleTreeData(this.tableQuery.businessArea)
      this.init();
    },
    handleExportExcel(){
       this.exportDialogShow = true
    },
     handleEnsureExport() {
      const exportList = this.$refs.exportField.check
      console.log(exportList)
      var exp = false
      if(!exportList || exportList.length === 0) {
        this.$message.error('请勾选至少一个字段来导出！')
        return
      }
      if(!exportList.includes('user_no')){
        exp = true
      }
     if(exp){
       this.$message.error('请勾选用户编号！')
        return
     }
      this.exportExcel(exportList)
    },
        // 资料导出
    DataDerivation(list) {
      let params = {
          busicode: "UserInfoExport",
          data: {
            businessArea: this.common.handleTreeData(this.tableQuery.businessArea),
            fuzzyQuery: this.tableQuery.fuzzyQuery,
            useWaterType: this.tableQuery.useWaterType,
            list: this.tableQuery.list,
            status:this.tableQuery.status,
            exportList:list
            } ,
          token: sessionStorage.getItem("token"),
          sysType: '002',
        }
        if(params.data.businessArea !== ''){
          window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)));
        }else {
          this.$message({
            type: "error",
            message: "未选营业区域无法导出"
          });
        }

    },
        // 导出按钮
    exportExcel(list) {
      var _this = this
      // 添加册本不能为空限制条件，减少导出数据量
      if (this.tableQuery.beginDate == '' || this.tableQuery.endDate == '') {
        this.$notify({
          title: '警告',
          message: '请先选择抄表日期！',
          type: 'warning'
        });
        return
      }
      this.tableQuery.exportList = list

      var params = {
        busicode: "MrAbWaterExport2",
        data: JSON.parse(JSON.stringify(this.tableQuery)),
        token: sessionStorage.getItem('token'),
        // exportList:list,
        // token: 'krrjdev123',
        sysType: '002'
      }
      // 入参不需要分页
      // delete params.data.page
      // delete params.data.pageCount
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 导出按钮
    // exportExcel() {
    //   var _this = this
    //   // 添加册本不能为空限制条件，减少导出数据量
    //   if (this.tableQuery.beginDate == '' || this.tableQuery.endDate == '') {
    //     this.$notify({
    //       title: '警告',
    //       message: '请先选择抄表日期！',
    //       type: 'warning'
    //     });
    //     return
    //   }
    //   var params = {
    //     busicode: "MrAbWaterExport",//MrAbWaterExport2
    //     data: JSON.parse(JSON.stringify(this.tableQuery)),
    //     token: sessionStorage.getItem('token'),
    //     // token: 'krrjdev123',
    //     sysType: '002'
    //   }
    //   // 入参不需要分页
    //   delete params.data.page
    //   delete params.data.pageCount
    //   window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    // },





    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        $(".el-table--fit").css("height", "66%");
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
        $(".el-table--fit").css("height", "50%");
      }
    },

    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    //   查看历史
    viewHistory(index, row) { },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    // 列表的NO列
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    closeDialog() {
      //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.exportDialogShow = false
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterAddVisible = false;
    },
    // 添加
    add() { },
    // 编辑
    edit() {
      this.backfillVisible = true;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    "tableQuery.abnormalStatus": {
      handler: function (newval, oldval) {
        console.log(newval);
        this.$nextTick(()=>{
          this.common.changeTable(this, ".AnomalyAnalysis", [
              ".AnomalyAnalysis .toolbar",
              ".AnomalyAnalysis .block",
              ".AnomalyAnalysis .bread-contain"
          ]);
        })
      },
      deep: true,
    }
  }
};
</script>
<style lang="scss">
.AnomalyAnalysis {
  width: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .greenFont{
    color: green !important;;
  }
  .redFont{
    color: red !important;
  }
  .noLabelInput{
    width: 150px !important;
    .el-input{
        width: 120px !important;
        margin-right: 8px !important;
    }
  }
}
</style>
