<template>
  <div class="BatchOpening">
    <!-- 按册开账模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <div class="bread-contain-right">
          <el-button size="mini" type="primary" @click="batchOpenAccount">开账</el-button>
          <el-button size="mini" type="primary" @click="batchOffAccount">取消开账</el-button>
        </div>
      </div>
      <div class="bread-contain-right" v-else>
        <div class="bread-contain-right">
          <el-button size="mini" type="primary" @click="openAccount">开账</el-button>
          <el-button size="mini" type="primary" @click="offAccount">取消开账</el-button>
          <el-button size="mini" type="primary" @click="toVoid">作废</el-button>
        </div>
      </div>
    </div>

    <el-tabs @tab-click="tabClick" class="tabsBlock" type="border-card">
      <el-tab-pane label="按册开账">
        <span slot="label">
          <i class="el-icon-document-remove"></i> 按册开账
        </span>

        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <el-form-item label="账期：">
                <el-date-picker
                  v-model="tableQuery.accountPeriod"
                  size="mini"
                  type="month"
                  unlink-panels
                  format="yyyy-MM"
                  value-format="yyyyMM"
                  placeholder="选择月"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="册本号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" clearable size="mini" @keydown.enter.native="demand" palceholder="请输入册本号"></el-input>
              </el-form-item>
              <el-form-item label="开账状态：">
                <el-select ref="select1" clearable v-model="tableQuery.openAccountStatus" placeholder="全部">
                  <el-option
                    v-for="(item,index) in openAccountStatusData"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
         <el-form-item>
        <el-form-item label="抄表员：">
          <el-select ref="select1" v-model="tableQuery.meterReadingStaff" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业区域：">
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
            :show-all-levels="false" :props="props"  >
          </el-cascader>
        </el-form-item >
            </el-form-item>
              <el-form-item>
                <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
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
            @selection-change="getItemList"
            :data="tableData.list"
            class="change-tables-table"
            @row-click="handleTableCellClick"
            :cell-style="cellStyle"
            ref="eltableCurrentRow"
          >
            <el-table-column type="selection" fixed="left" width="55"></el-table-column>

            <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod"></el-table-column>

            <el-table-column
              prop="openAccountStatus"
              min-width="120"
              label="开账状态"
              show-overflow-tooltip
            ></el-table-column>

            <el-table-column prop="bookNo" min-width="100" label="册本号"></el-table-column>

            <el-table-column prop="bookName" min-width="100" label="册本名称" show-overflow-tooltip></el-table-column>

            <el-table-column prop="meterReadingStaff" min-width="80" label="抄表员"></el-table-column>

            <el-table-column prop="planMeterReadingAmount" min-width="100" label="计划抄表" align="right"></el-table-column>

            <el-table-column prop="meterReadingAmount" min-width="80" label="已抄表" align="right"></el-table-column>

            <el-table-column prop="unReadingMeterAmount" min-width="80" label="未抄表" align="right"></el-table-column>

            <el-table-column prop="meterReadingRatio" min-width="120" label="抄表率" align="right"></el-table-column>

            <el-table-column prop="planOpenAccountAmount" min-width="80" label="计划开账" align="right"></el-table-column>

            <el-table-column prop="openAccountAmount" min-width="80" label="开账数" align="right"></el-table-column>
            <el-table-column prop="reviewAmount" min-width="80" label="复核数" align="right"></el-table-column>
          </el-table>

        </div>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按户开账">
        <span slot="label">
          <i class="el-icon-user"></i> 按户开账
        </span>
        <RegularOpening ref="RegularOpening" v-if="!EditVisible"></RegularOpening>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import RegularOpening from "./RegularOpening";
export default {
  name: "BatchOpening",
  components: {
    RegularOpening
  },
  data() {
    return {
      //抄表员
      meterReaderList: [],
      // 异常类型
      showContentsList: [],
      // 水量偏差
      proportionList: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      // 查询条件对象
      tableQuery: {
        // 账期
        accountPeriod: this.common.date('month'),
        // 抄表员
        // meterReadingStaff: "",
        // 开账状态
        openAccountStatus: "",
        businessArea:'',
        // 册本号
        bookNo: "",

        page: 1,
        pageCount: 100
      },
      businessArea:[],
      // 开账状态下拉数据
      openAccountStatusData: [
        { value: "", name: "全部" },
        { value: "0", name: "未开账" },
        { value: "1", name: "部分开账" }
      ],
      // 列表数据
      tableData: {},
      // 选中数据的id数组
      bookNoList: [],
      EditVisible: "true",
      crumbsData: {
        //面包屑
        titleList: [
          // { title: '业务管理', path: '/MeterReadingCenter' },
          { title: "抄表开账" },
          { title: "开账" }
          // { title: '按册开账', method: () => { window.histroy.back() } }
        ]
      },
      isActive: false, //控制高级查询内容的显示
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      backfillVisible: false
    };
  },
  mounted() {
    this.businessAreaSelect();
    this.init();
    this.getMeterReader()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
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
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "MrOpenAccountListByBook",
        data: {
          accountPeriod: this.tableQuery.accountPeriod, // 账期
          meterReadingStaff: this.tableQuery.meterReadingStaff, // 抄表员
          openAccountStatus: this.tableQuery.openAccountStatus, // 开账状态
          bookNo: this.tableQuery.bookNo, // 册本号
          businessArea:this.tableQuery.businessArea,
          page:this.tableQuery.page,
          pageCount:this.tableQuery.pageCount,
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          _this.tableData = res;
          this.common.changeTable(this, ".BatchOpening", [
            ".BatchOpening .toolbar",".BatchOpening .block",".BatchOpening .bread-contain",".BatchOpening .el-tabs__header"
          ]);
        });
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
    demand(){
      // this.tableQuery.page=1,
      // this.tableQuery.pageCount=20,
      this.init();
    },
    // 获取列表选中的数据
    getItemList(itemList) {
      this.bookNoList = [];
      itemList.forEach(item => {
        this.bookNoList.push(item);
      });
    },
    handleTableCellClick(row,cell,event){ 
      const len = row.rowspan != undefined? row.rowspan : 1 
      const ind = this.tableData.list.findIndex(item => item.bookNo === row.bookNo)
      var select = []
      for(let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if(this.bookNoList.some(item => select.some(val => val.bookNo === item.bookNo))) { //取消勾选
        this.getItemList(this.bookNoList.filter(item => select.every(val => val.bookNo !== item.bookNo)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else { //恢复勾选
        this.getItemList(this.bookNoList.concat(select))
        this.bookNoList.concat(select).forEach(item =>{
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }   
    },
    cellStyle(data){
      return "cursor:pointer;"
    },
    // 按册开账-开账按钮
    batchOpenAccount() {
      let temBookNoList = []
      this.bookNoList.forEach(item => {
        temBookNoList.push(item.bookNo)
      });
      if(!temBookNoList || temBookNoList.length == 0) {
         this.$message({
          message: "请选择需开帐的册本",
          type: "error"
        });
        return
      }
      let _this = this;
      this.$confirm("是否确定开账?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let params = {
            busicode: "MrOpenAccountByBook",
            data: {
              accountPeriod: this.tableQuery.accountPeriod,
              books: temBookNoList
            }
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              _this.$message({
                message: "已放入开账队列中，请稍后再次查询该页面查看结果。",
                type: "success"
              });
              _this.init();
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消开账"
          });
        });
    },
    // 按册开账-销账按钮
    batchOffAccount() {
      let temBookNoList = []
      this.bookNoList.forEach(item => {
        temBookNoList.push(item.bookNo);
      });
      let _this = this;
      this.$confirm("是否确定销账?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let params = {
            busicode: "MrOpenAccountCannelByBook",
            data: {
              accountPeriod: this.tableQuery.accountPeriod,
              books: temBookNoList
            }
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              _this.$message({
                message: "已放入销账队列中，请稍后再次查询该页面查看结果。",
                type: "success"
              });
              _this.init();
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消销账"
          });
        });
    },
    // 按户开账-开账按钮（调用子页面开账方法）
    openAccount() {
      this.$refs.RegularOpening.openAccount();
    },
    // 按户开账-销账按钮（调用子页面销账方法）
    offAccount() {
      this.$refs.RegularOpening.offAccount();
    },
    // 按户开账-作废按钮（调用子页面作废方法）
    toVoid() {
      this.$refs.RegularOpening.toVoid();
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
    tabClick(tab, event) {
      if (tab.label == "按册开账") {
        this.EditVisible = true;
      } else {
        this.EditVisible = false;
        this.$nextTick(() => {
          this.$refs.RegularOpening.init();
        })
      }
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
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
    closeDialog() {
      //关闭会话
      this.backfillVisible = false;
      this.init();
    },
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
    }
  }
};
</script>
<style lang="scss">
.BatchOpening {
  width: 100%;
  height: 100%;
  .tabsBlock {
    height: calc(100% - 42px);
    .el-tabs--border-card {
      border: 1px solid #eaf4ff;
    }

    .el-tabs__conten {
      padding: 5px;
    }
  }
  .el-tabs--border-card > .el-tabs__content {
    height: calc(100% - 40px);
    padding: 5px;
  }
  .el-tab-pane {
    height: 100%;
  }
}
</style>
