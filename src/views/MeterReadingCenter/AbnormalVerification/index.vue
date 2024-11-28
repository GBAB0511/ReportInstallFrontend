<template>
  <div class="AbnormalVerification">
    <!-- 水表异常模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else></div>
    </div>
    <AbnormalVerificationEdit
      v-if="EditVisible"
      ref="AbnormalVerificationEdit"
      :abnormalVerificationEditNeedData="abnormalVerificationEditNeedData"
    ></AbnormalVerificationEdit>
    <div v-else>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="抄表日期：">
            <el-date-picker
              v-model="tableTime"
              @change="getDatePicker"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="抄表员：">
            <el-select ref="select1" v-model="tableQuery.meterReadingStaffAccount" size="mini">
              <el-option
                v-for="item in meterReaderList"
                :key="item.userAccount"
                :label="item.userName"
                :value="item.userAccount"
              ></el-option>
            </el-select>
          </el-form-item>
               <el-form-item label="异常状态：">
            <el-select ref="select1" v-model="tableQuery.meterAbnormalStatus" size="mini" clearable>
              <el-option
                v-for="item in dictionaryData.MAS"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select ref="select2" v-model="tableQuery.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="0"></el-option>
            <el-option label="已处理" value="1"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：">
            <el-tooltip class="item" effect="dark" content="册本号、用户编号" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table
          stripe
          border
          :data="tableData.list"
          @cell-click="cellClick"
          class="wuserInfo-table"
          highlight-current-row
          :max-height="maxHeight"
          v-if="tableShow"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>
          <el-table-column prop="bookNo" min-width="120" label="册本号"></el-table-column>
          <el-table-column prop="userNo" min-width="130" label="用户编号"></el-table-column>
          <el-table-column prop="ctmName" min-width="200" label="客户名称"></el-table-column>
          <el-table-column prop="businessAreaName" min-width="110" label="营业区域" show-overflow-tooltip></el-table-column>
          <el-table-column prop="setupMeterAddr" min-width="150" label="装表地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="meterReadingDate" min-width="110" label="抄表日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="currendPeriodWater" min-width="80" label="本期水量"></el-table-column>
          <el-table-column prop="meterReadingStaffName" min-width="80" label="抄表员"></el-table-column>
          <el-table-column prop="meterAbnormalStatusName" min-width="80" label="异常状态"></el-table-column>
          <el-table-column prop="abnormalDescription" min-width="80" label="异常描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="abnormalPhoto" min-width="80" label="异常照片"></el-table-column>
          <el-table-column prop="handleStaff" min-width="80" label="处理人"></el-table-column>
          <el-table-column prop="handleTime" min-width="150" label="处理时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" :formatter="handlestatus" min-width="80" label="状态"></el-table-column>
          <el-table-column prop="changeMeterFlagName" min-width="80" label="是否换表"></el-table-column>
          <el-table-column prop="handleResult" min-width="80" label="处理结果" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click.native="edit(scope.row)" size="mini">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import AbnormalVerificationEdit from "./AbnormalVerificationEdit";

export default {
  components: {
    AbnormalVerificationEdit
  },
  name: "AbnormalVerification",
  data() {
    return {
      EditVisible: false, //弹出表单
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      maxHeight: 0,
      tableShow: false,
      businessAreaData: [], //营业区域下拉框
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "检查" },
          { title: "水表异常" }
        ]
      },
      isActive: false, //控制高级查询内容的显示
      // 查询条件对象
      tableQuery: {
        // meterReadingStaffAccount: '全部',
        meterAbnormalStatus:'',
        status:'0',
        businessArea: '',
        groupCode:''
      },
      // 初始化数据
      tableData: {},
      // 占位，无用
      tableTime: [this.getFirstDayOfMonth(),this.common.date()],
      // 子页面所需数据
      abnormalVerificationEditNeedData: {},
      // 抄表员
      meterReaderList: [],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      dictionaryData:[],//数据字典
      waterAddVisible: false, //综合查询的显示和隐藏
      WaterEditorName: "综合查询",
      ruleFormData: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false,
      meterReader: "0",
      meterReadDate: "0"
    };
  },
  mounted() {
    var currentCode = localStorage.getItem('companyNo')
    this.tableQuery.groupCode =  currentCode
    var _this = this
    _this.selectBAreaOptions();
    this.getDatePicker(_this.tableTime);
    this.getDictionary();
    this.init();
    this.getMeterReader();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".AbnormalVerification", [
      ".AbnormalVerification .toolbar",
      ".AbnormalVerification .block",
      ".AbnormalVerification bread-contain"
    ]);
  },
  methods: {
        // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MAS"
        //水表类型、用水对象、水表用途、抄表方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
        //营业区域
    selectBAreaOptions(id) {
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
        _this.businessAreaData = data.children;
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
    // 初始化
    init() {
      let _this = this;
      if(_this.tableQuery.meterReadingStaffAccount=='全部'){
        _this.tableQuery.meterReadingStaffAccount = ''
      }
      let params = {
        busicode: "MrAbMeterList",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;

          // 格式化是否换表字段
          res.list.forEach((item, i) => {
            if (item.changeMeterFlag == 0) {
              _this.$set(_this.tableData.list[i], "changeMeterFlagName", "是");
            } else if (item.changeMeterFlag == 1) {
              _this.$set(_this.tableData.list[i], "changeMeterFlagName", "否");
            }
          });
        });
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
    handlestatus(row){
      return row.status===1?"已处理":"待处理";
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
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0];
        this.tableQuery.endDate = date[1];
      } else {
        this.tableQuery.beginDate = "";
        this.tableQuery.endDate = "";
      }
    },
    // 处理按钮
    edit(row) {
      this.abnormalVerificationEditNeedData = row;
      this.abnormalVerificationEditNeedData.saveType = "edit";
      this.EditVisible = true;
    },
    // 保存按钮（调用子页面保存方法）
    save() {
      this.$refs.AbnormalVerificationEdit.save();
    },

    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.tableQuery.businessArea=this.common.handleTreeData(this.tableQuery.businessArea)
      this.init();
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

    closeDialog() {
      //关闭会话
      // this.crumbsData.titleList.splice(3, 1);
      this.EditVisible = false;
    },

    //   查看历史
    viewHistory(index, row) {},
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (
        (this.tableData.pageSize - 20) * this.tableData.pages + (index + 1)
      );
    },

    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterAddVisible = false;
    },
    // 添加
    add() {},
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        // $('.el-table--fit').css('height', '66%');
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
        // $('.el-table--fit').css('height', '50%');
      }
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }
};
</script>
<style lang="scss">
.AbnormalVerification {
  width: 100%;
}
</style>
