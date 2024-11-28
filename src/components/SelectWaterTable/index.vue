<template>
  <!--
  选择水表
  用此页面
  1、抄表抽查-添加/详情 仅水表状态：在用  formType：QualityReadingEdit
  2、换表-添加/详情 仅水表状态：在用、在库 fotmType：ChangeTablesHandle
  3、水表变更-添加/详情 -仅水表状态：所有 fotmType：wMeterEdit
-->
  <div class="chooseWaterMeter">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">
        <el-form-item label="入库日期："> 
          <el-date-picker v-model="installationDate" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至 " :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="isFuzzyQuery == null || isFuzzyQuery == '' || isFuzzyQuery == '1'" label="模糊查询：" class="width-150">
          <el-tooltip class="item" effect="dark" content="用户编号、水表编号、水表表身号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search" ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="isFuzzyQuery == '0'" label="关键字查询：">
            <el-select v-model="tableQuery.queryTypeEn" placeholder="请选择" clearable>
              <el-option v-for="item in dictionaryData.MQT" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item >
          <el-form-item v-if="isFuzzyQuery == '0'">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.exactQuery" clearable size="mini" class="fuzzy-query-input" @keydown.enter.native="init"></el-input>
          </el-form-item>
        <el-form-item v-if="formType=='QualityReadingEdit'" class="Remarks">
          <el-checkbox true-label=1 false-label=0 v-model="tableQuery.isZeroWaterPay">0水量查缴</el-checkbox>
        </el-form-item>

        <el-form-item label="水表状态：">
          <el-select :disabled='formType=="ChangeTablesHandle"' clearable v-model="tableQuery.meterStatus" placeholder="水表状态">
            <el-option key="" value="" label="全部"></el-option>
            <el-option v-for="item in dictionaryData.MMS" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="button-group">
          <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>

        <!-- 高级查询 -->
        <div v-show="isActive" class="advancedQuery">

          <el-form-item label="客户地址：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.ctmAddr"></el-input>
          </el-form-item>

          <el-form-item label="客户名称：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.ctmName"></el-input>
          </el-form-item>

          <el-form-item label="水表厂家：">
            <el-select clearable v-model="tableQuery.meterFactory" placeholder="水表厂家">
              <el-option key="" value="" label="全部"></el-option>
              <el-option v-for="item in meterFactoryData.list" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="新旧表：">
            <el-select clearable v-model="tableQuery.meterForm" placeholder="新旧表">
              <el-option key="" value="" label="全部"></el-option>
              <el-option v-for="item in dictionaryData.MMF" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="水表型号：">
            <el-select clearable v-model="tableQuery.meterModel" placeholder="水表型号">
              <el-option key="" value="" label="全部"></el-option>
              <el-option v-for="item in meterModelData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="水表口径：">
            <el-select clearable v-model="tableQuery.meterBore" placeholder="水表口径">
              <el-option key="" value="" label="全部"></el-option>
              <el-option v-for="item in dictionaryData.MMC" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="册本号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.bookNo"></el-input>
          </el-form-item>
        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border center :data="tableData.list" @selection-change="getSelectData" class="change-tables-table" @row-click="handleTableCellClick" ref="eltableCurrentRow"  :cell-style="cellStyle">

        <el-table-column type="selection" :selectable="selectTable" width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="meterStatusName" min-width="80" label="水表状态" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="userNo" v-if="!(tableQuery.meterStatus=='1')" min-width="140" label="用户编号"> </el-table-column>

        <el-table-column prop="ctmName" v-if="!(tableQuery.meterStatus=='1')" min-width="250" label="客户名称" show-overflow-tooltip> </el-table-column>

        <el-table-column prop="bookNo" v-if="!(tableQuery.meterStatus=='1')" min-width="150" label="册本号" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="meterNo" min-width="140" label="水表编号">
        </el-table-column>

        <el-table-column prop="factoryNo" min-width="200" label="水表表身号">
        </el-table-column>

        <el-table-column prop="meterBoreName" min-width="100" label="水表口径">
        </el-table-column>

        <el-table-column prop="meterFactoryName" min-width="100" label="水表厂家">
        </el-table-column>

        <el-table-column prop="meterFormName" min-width="120" label="新旧表">
        </el-table-column>

        <el-table-column prop="meterModelName" min-width="200" label="水表型号">
        </el-table-column>

        <el-table-column prop="createTime" min-width="120" label="入库日期">
        </el-table-column>

        <el-table-column prop="ctmAddr" min-width="300" label="客户地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>

    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "chooseWaterMeter",
  props: ["formType", "waterChooseType", "disabledData","isFuzzyQuery",'selectDataLength'],
  data() {
    return {
      // 表格数据
      tableData: [],
      installationDate: [],//装表日期
   
      // 查询条件数据
      tableQuery: {
        "page": 1,
        "pageCount": 20,
        "fuzzyQuery": "",
        "exactQuery":"",
        "ctmName": "",
        "beginDate": "",
        "endDate": "",

        "meterFactory": "",
        "meterType": "",
        "meterForm": "",
        "meterModel": "",

        "meterStatus": "",
        "meterBore": "",
        "upperNum": '',

        "ctmAddr": "",
        "bookNo": "",
        'isZeroWaterPay': "1",//是否是0水量查缴：1为是，0为否
        "beginDate":"",
        "endDate":"",
        "queryTypeEn":"factory_no"
      },
      // 水表厂家下拉框数据
      meterFactoryData: [],
      // 数据字典数据
      dictionaryData: [],
      // 水表型号下拉框数据
      meterModelData: {},
      // 列表勾选数据
      selectData: [],
      tableShow: false,
      maxHeight: 0,
      isActive: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {

    this.getDatePicker()
    if (this.formType == 'QualityReadingEdit') {
      this.initQuaRead()
    }else {
      this.init()
    }
    this.getMeterFactory()
    this.getDictionary()
    this.getMeterModel()
    this.common.changeTable(this, ".chooseWaterMeter", [
      ".chooseWaterMeter .toolbar",
      ".chooseWaterMeter .block",
      ".chooseWaterMeter #crumbs",
      '.chooseWaterMeter .toggle-btn'
    ]);
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 初始化 抄表抽查
    initQuaRead() {
      let _this = this
      let params = {
        busicode: "MsInfoList",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res
      })

    },
    // 初始化
    init() {
      // name: "在库", value: "1"}
      // name: "在用", value: "2"}
      // name: "在途", value: "3"}
      // name: "报废", value: "4"}
      delete this.tableQuery.isZeroWaterPay
      if (this.waterChooseType == 'chooseNewMater' ) {
        this.tableQuery.meterStatus = '1'//在库
        this.tableQuery.isMsChg = 1 
      } else if (this.waterChooseType == 'chooseOldMeter') {
        this.tableQuery.meterStatus = '2'//在用
      } else {

      }
      let params = {
        busicode: "MsInfoList",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res
      })
    },
    // 列表数据勾选禁用
    selectTable(row, index){

      if (this.disabledData != undefined && this.disabledData.length > 0) {
        for (let i = 0; i < this.disabledData.length; i++) {
          if (row.id == this.disabledData[i].id) {
            return false
          }else if (row.id != this.disabledData[i].id && i == (this.disabledData.length - 1)) {
            return true
          }
        }
      }else {
        return true
      }
    },
    // 水表厂家下拉数据
    getMeterFactory() {
      var _this = this
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 999
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterFactoryData = res
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMT,MMS,MMC,MMF,MQT"//水表类型、水表状态、水表口径
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 水表型号下拉数据
    getMeterModel() {
      var _this = this
      var params = {
        "busicode": "WaterMeModelOpList",
        "data": {}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterModelData = res
      })
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (this.installationDate !== undefined && this.installationDate !== null) {
        this.tableQuery.beginDate = this.installationDate[0];
        this.tableQuery.endDate = this.installationDate[1];
      } else {
        this.tableQuery.beginDate = "";
        this.tableQuery.endDate = "";
      }
    },
    // 查询按钮
    search() {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      //if(){

      // }
      if (this.formType == 'QualityReadingEdit') {
        this.initQuaRead()
      } else {
        this.init()
      }
    },
    // 列表选中数据事件（获取列表已勾选数据）
    getSelectData(data) {
      if (this.waterChooseType == 'chooseNewMater' && data.length > 1) {
        this.$message({
          message: '新水表仅可选择一个',
          type: 'warning'
        });
      }
      this.$set(this, "selectData", data);
      this.$emit('update:selectDataLength',data.length);//更新长度
    },
    handleTableCellClick(row,cell,event){
      row.flag = !row.flag;  
      this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);     
    },
    cellStyle(data){
      return "cursor:pointer;"
    },
    getSelectDataForBiaoWu() {
      // 表务需要，不影响其他页面，请不要删
      var meterNoArr = []
      this.selectData.forEach(item => {
        meterNoArr.push(item.meterNo)
      })
      eventBus.$emit('selectData', meterNoArr)
    },
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
      this.$nextTick(() => {
        this.common.changeTable(this, ".chooseWaterMeter", [
          ".chooseWaterMeter .toolbar",
          ".chooseWaterMeter .block",
          ".chooseWaterMeter #crumbs",
          '.chooseWaterMeter .toggle-btn'
        ]);
      })
    },
    closeDialog() {
      //关闭会话
      this.waterChoooseVisible = false;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)

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
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.chooseWaterMeter {
  width: 100%;
  height: 100%;
  padding: 10px;
  .kl-table{
    margin-top: 15px;
  }
  .searchBtn {
    background: #faa646;
    color: #fff;
  }
}
</style>
