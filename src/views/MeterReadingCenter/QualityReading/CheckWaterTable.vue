<template>
  <div class="checkWaterTable">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

        <!-- <el-form-item label="账期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.accountPeriod"></el-input>
        </el-form-item> -->

        <el-form-item label="账期：">
            <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择账期">
            </el-date-picker>
          </el-form-item>

        <el-form-item label="用户编号：" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" @keydown.enter.native="search" placeholder="请输入用户编号"></el-input>
        </el-form-item>

        <el-form-item label="抄表员：">
          <el-select v-model="tableQuery.meterReadingStaffName" size="mini" placeholder="抄表员">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="水量状态：">
          <el-select v-model="tableQuery.abnormalStatus" clearable placeholder="请选择">
            <el-option :value="1" label="偏小"></el-option>
            <el-option :value="2" label="偏大"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="比例：" v-if="abnormalNumberShow">
          <el-input-number controls-position="right" v-model="tableQuery.abnormalNumber" @keydown.enter.native="search"></el-input-number>
        </el-form-item>

        <el-form-item label="抽查时间：">
            <el-date-picker v-model="Time" size="mini" type="monthrange" unlink-panels format="yyyy-MM" value-format="yyyyMM" start-placeholder="开始日期" end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>

        <el-form-item>
          <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border center :data="tableData.list" 
      @selection-change="getSelectData" class="change-tables-table">

        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="bookNo" min-width="100" label="册本号">
        </el-table-column>

        <el-table-column prop="userNo" min-width="120" label="用户编号">
        </el-table-column>

        <el-table-column prop="ctmName" min-width="100" label="客户名称">
        </el-table-column>

        <el-table-column prop="useWaterType" min-width="100" label="用水类型" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="priorPeriodNum" min-width="120" label="上期抄码" align="right">
        </el-table-column>

        <el-table-column prop="currendPeriodNum" min-width="120" label="本期抄码" align="right">
        </el-table-column>

        <el-table-column prop="currendPeriodWater" min-width="120" label="本期水量" show-overflow-tooltip align="right">
        </el-table-column>

        <el-table-column prop="addWater" min-width="100" label="增减水量" show-overflow-tooltip align="right">
        </el-table-column>

        <el-table-column prop="shareWater" min-width="100" label="分摊水量" show-overflow-tooltip align="right">
        </el-table-column>

        <el-table-column prop="realityWater" min-width="100" label="实际用水量" show-overflow-tooltip align="right">
        </el-table-column>
        <el-table-column prop="changeMeterDate" min-width="120" label="换表日期" ></el-table-column>
      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
          <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="tableQuery.page" 
            :page-sizes="[20, 100, 500, 1000]" 
            :page-size="tableQuery.pageCount" 
            layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "checkWaterTable",
  data() {
    return {
      // 表格数据
      tableData: [],
      tableShow:false,
      maxHeight: 0,
      installationDate:[],//装表日期
      // 查询条件数据
      tableQuery: {
        "page": 1,
        "pageCount": 20,
        "userNo":"",
        "accountPeriod":"",
        meterReadingStaffName: "",
        abnormalNumber: null,
        startCheckMonth: null,
        endCheckMonth: null
      },
      Time: [],
      selectData: [],
      meterReaderList: [],
      isActive: false,
      abnormalNumberShow: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    this.getNowDate();
    this.getReadingStaff()
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.getDatePicker()
      var _this = this;
      let params = {
        busicode: "MrQualityCheckWaterTable",//抽查条件选择原接口MrMsInfoList
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res
        this.common.changeTable(_this, ".checkWaterTable", [
          ".checkWaterTable .toolbar",
          ".checkWaterTable .block",
        ]);
      })
    },
    // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    getNowDate(){
      var period = new Date();
      let year = period.getFullYear();
      let month = period.getMonth()+1;
      if(month<10){
        month="0"+month
      }else{
        month=""+month
      }
      this.tableQuery.accountPeriod=(year+month+"");
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
        this.tableQuery.page = 1
        this.tableQuery.pageCount = 20
        this.init()
    },
    // 列表选中数据事件（获取列表已勾选数据）
    getSelectData(data){
      
      this.$set(this, "selectData",data);
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
    },
    closeDialog() {
      //关闭会话
      this.waterChoooseVisible = false;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return   this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      
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
    },
    'tableQuery.abnormalStatus' (val) {
      if(val) {
        this.tableQuery.abnormalNumber = 50
        this.abnormalNumberShow = true
      } else {
        this.tableQuery.abnormalNumber = null
        this.abnormalNumberShow = false
      }
    },
    Time(val) {
      if(val && val.length > 0) {
        this.tableQuery.startCheckMonth = val[0]
        this.tableQuery.endCheckMonth = val[1]
      } else {
        this.tableQuery.startCheckMonth = null
        this.tableQuery.endCheckMonth = null
      }
    }
  }
};
</script>

<style lang="scss">
.checkWaterTable {
  padding: 10px;
  width: 100%;
  height: 100%;
}
</style>