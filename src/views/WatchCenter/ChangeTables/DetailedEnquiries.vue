<template>
  <div class="DetailedEnquiries">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">
          <el-form-item label='换表日期：'>
            <el-date-picker v-model="tableTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="tableQuery.fuzzyQuery" placeholder="用户编号/旧水表编号"></el-input>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
          <el-form-item label="抄表员：">
            <el-select v-model="tableQuery.meterReadingStaffAccount" size="mini">
              <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
         </el-form-item>
          <!-- 高级查询内容 -->
          <div v-show="isActive" class="advancedQuery">
            <el-form-item label="换表员：" size="mini" prop="replaceStaff">
              <el-select v-model="tableQuery.replaceStaff" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="新表口径：" prop="newMeterBore">
            <el-select clearable v-model="tableQuery.newMeterBore" placeholder="水表口径" >
              <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.boreName" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="旧表口径：" prop="oldMeterBore">
            <el-select clearable v-model="tableQuery.oldMeterBore" placeholder="水表口径" id="oldMeterBore">
              <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.boreName" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="水表厂家：">
            <el-select clearable v-model="tableQuery.meterFactory" placeholder="水表厂家">
              <el-option key="" label="全部" value=""></el-option>
              <el-option v-for="item in meterFactoryData.list" :key="item.factoryId" :label="item.factoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" @change="getBusinessArea"
              :options="businessAreaData"
              :show-all-levels="false"
              :props="props">
            </el-cascader>
          </el-form-item>
          </div>
          
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="DetailedEnquiries-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="billNo" min-width="120" label="换表单号">
        </el-table-column>

        <el-table-column prop="replaceDate" min-width="100" label="换表日期">
        </el-table-column>

        <el-table-column prop="bookNo" min-width="120" label="册本">
        </el-table-column>

        <el-table-column prop="userNo" min-width="120" label="用户编号">
        </el-table-column>

        <el-table-column prop="ctmName" min-width="120" label="客户名称">
        </el-table-column>

        <el-table-column prop="ctmAddr" min-width="120" label="客户地址" show-overflow-tooltip>
        </el-table-column> 

         <el-table-column prop="businessArea" min-width="100" label="营业区域" show-overflow-tooltip>
        </el-table-column> 

         <el-table-column prop="meterFactory" min-width="100" label="水表厂家" show-overflow-tooltip>
        </el-table-column> 

        <el-table-column prop="replaceStaffName" min-width="80" label="换表员">
        </el-table-column>

        <el-table-column prop="upperNum" min-width="80" label="上期抄码">
        </el-table-column>

        <el-table-column prop="oldMeterNum" min-width="80" label="旧表底码">
        </el-table-column>

        <el-table-column prop="newMeterNum" min-width="80" label="新表起码" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="margin" min-width="80" label="余量" show-overflow-tooltip>
        </el-table-column>

         <el-table-column prop="useWaterType" min-width="80" label="用水类型" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="oldMeterBore" min-width="100" label="旧水表口径" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="newMeterBore" min-width="100" label="新水表口径">
        </el-table-column>

        <el-table-column prop="oldMeterNo" min-width="120" label="旧水表编号" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="newMeterNo" min-width="120" label="新水表编号">
        </el-table-column>

        <el-table-column prop="oldFactoryNo" min-width="120" label="旧水表水表表身号">
        </el-table-column>

        <el-table-column prop="newFactoryNo" min-width="120" label="新水表水表表身号">
        </el-table-column>

        <el-table-column prop="oldMeterCert" min-width="120" label="旧合格证号">
        </el-table-column>

        <el-table-column prop="newMeterCert" min-width="120" label="新合格证号">
        </el-table-column>

        <el-table-column prop="oldHandleWayName" min-width="120" label="旧表处理方式" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip>
        </el-table-column>

      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "DetailedEnquiries",
  data() {
    return {
       props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },

      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 50,
        replaceStaff: '',
        fuzzyQuery:'',
        oldMeterBore:'',
        newMeterBore:'',
        processState:'END',
        receiptType:'1',
        beginDate:'',
        endDate:'',
        meterFactory:'',
        businessArea:'',
        meterReadingStaffAccount:''
      },
      isActive:false,
      tableTime:[],
      // 表格数据
      tableData: {},
      // 换表员下拉数据
      replaceStaffData: [],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      meterFactoryData: {},
      meterBoreData:[],
      meterReaderList: [],
      businessAreaData: [] //营业区域
    };
  },
  mounted() {
    this.init()
    this.getReplaceStaffData()
    this.getMeterBore();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".DetailedEnquiries", [
      ".DetailedEnquiries .toolbar",
      ".DetailedEnquiries .block",
      ".DetailedEnquiries .toggle-btn"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this;
      this.getDatePicker(this.tableTime);
      this.getMeterFactory();
      this.getMeterReader();
      this.selectBAreaOptions();
      let params = {
        busicode: "MsChgHistory",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".DetailedEnquiries", [
          ".DetailedEnquiries .toolbar",
          ".DetailedEnquiries .block",
          ".DetailedEnquiries .toggle-btn"
        ]);
      });
    },
    //营业区域
    getBusinessArea(val) {
      val = this.common.handleTreeData(val);
      return val;
    },
    selectBAreaOptions(id) {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res);
          let data = this.getArr(res);
          // console.log(data);
          _this.businessAreaData = data.children;
          // console.log(this.businessAreaData);
        });
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map((i) => {
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
    // 水表口径下拉数据
    getMeterBore() {
      var _this = this
      var params = {
        "busicode": "MeterBoreList",
        "data": {page:1,pageCount:999}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterBoreData = res.list
      })
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
    // 水表厂家下拉数据
    getMeterFactory() {
      var _this = this
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 9999
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterFactoryData = res;
      })
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
    // 导入按钮方法
    exportExcel() {
      var _this = this
      this.getDatePicker(this.tableTime)
      var params = {
        busicode: "MsChgExport",
        data: _this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 搜索
    search() {
      if (this.tableQuery.Time !== undefined) {
        this.tableQuery.beginDate = this.tableQuery.Time[0];
        this.tableQuery.endDate = this.tableQuery.Time[1];
        delete this.tableQuery.Time;

      }
      console.log(this.tableQuery);
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取换表员数据
    getReplaceStaffData() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { "postNo": "4" }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.replaceStaffData = res
      })
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
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    }
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
.DetailedEnquiries {
  width: 100%;
  height: 100%;
  .kl-table{
    margin-top: 15px;
  }
}
</style>
