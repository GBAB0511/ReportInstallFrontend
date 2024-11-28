<template>
  <!--
  选择用户
  用此页面
-->
  <div class="ICRepairList">
    <div class="toolbar">
      <el-form
        :inline="true"
        size="mini"
        :model="tableQuery"
        class="demo-form-inline"
      >
        <el-form-item label="操作时间：">
          <el-date-picker
            clearable
            v-model="dataList"
            @change="getDatePicker"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作类型：" class="width-150">
          <!-- <el-input
            clearable
            v-model="tableQuery.operaType"
            placeholder="操作类型"
            @keydown.enter.native="search"
          ></el-input> -->
          <el-select v-model="tableQuery.operaType" clearable>
            <el-option
              v-for="item in dictionaryData.ICOPS"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户编号：" class="width-150">
          <el-input
            clearable
            v-model="tableQuery.userNo"
            placeholder="用户编号"
            @keydown.enter.native="search"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
        <el-form-item label="卡号：" class="width-150">
          <el-input
            clearable
            v-model="tableQuery.icCardNo"
            placeholder="卡号"
            @keydown.enter.native="search"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
              <el-form-item label="水表厂家：" class="width-150">
          <el-select v-model="tableQuery.meterFactory" clearable>
            <el-option
              v-for="item in MeterFactoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作员：" class="width-150">
          <el-input
            clearable
            v-model="tableQuery.operator"
            placeholder="操作员"
            @keydown.enter.native="search"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="抄表员：">
          <el-select ref="select1" v-model="tableQuery.meterReadingStaff" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <!-- <el-button type="primary" size="mini" @click.native="hidden" icon="el-icon-arrow-down upchange" class="soce-query">高级查询</el-button> -->
          <el-button
            class="searchBtn"
            @click="search"
            icon="el-icon-search"
          ></el-button>
          <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{ height: maxHeight + 'px' }">
      <el-table
        v-if="tableShow"
        :max-height="maxHeight"
        highlight-current-row
        stripe
        border
        center
        :data="tableData.list"
        @selection-change="getSelectData"
        class="change-tables-table"
      >
        <!-- <el-table-column
          type="selection"
          :selectable="selectTable"
          width="50"
          fixed="left"
        >
        </el-table-column> -->

        <el-table-column
          type="index"
          label="NO."
          width="50"
          :index="indexMethod"
          fixed="left"
        >
        </el-table-column>
        <el-table-column prop="date" min-width="180" label="时间">
        </el-table-column>
        <el-table-column prop="userNo" min-width="130" label="用户编号">
        </el-table-column>
        <el-table-column prop="icCardNo" min-width="130" label="卡号">
        </el-table-column>
        <el-table-column prop="userName" min-width="130" label="用户名称">
        </el-table-column>

        <el-table-column prop="userAddr" min-width="250" label="地址">
        </el-table-column>

        <el-table-column prop="margin" min-width="100" label="余量">
        </el-table-column>

        <el-table-column prop="operaType" min-width="120" label="操作类型">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" clearable v-model="scope.row.operaType" placeholder="请选择">
              <el-option
                v-for="item in dictionaryData.ICOPS"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <span style="color:#606266" v-if="!scope.row.isEdit">{{scope.row.operaType}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="operator" min-width="100" label="操作员">
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button size="mini" v-if="!scope.row.isEdit" type="text" @click.native="del(scope.row)"
              >删除</el-button
            >
            <el-button size="mini" type="text" v-if="!scope.row.isEdit" @click.native="updateRow(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" v-if="scope.row.isEdit" @click.native="save(scope.row)">保存</el-button>
            <el-button size="mini" type="text" v-if="scope.row.isEdit" @click.native="cancleRow(scope.row)">取消</el-button>
            <!-- <el-button size="mini" type="text" @click.native="details(scope.row)">费用信息</el-button> -->
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
        :total="tableData.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "ICRepairList",
  // props: ["formType", "waterChooseType", "disabledData"],
  data() {
    return {
      dictionaryData: [], //数据字典
      dataList: [], //操作时间
      MeterFactoryList:[],
      //抄表员
      meterReaderList: [],
      WaterUseOverTheYearsData: {
        userNo: "",
      },
      // 表格数据
      tableData: {
        list: [],
      },
      // 查询条件数据
      tableQuery: {
        page: 1,
        pageCount: 20,
        meterFactory:'',
        operaStartTime: "",
        operaEndTime: "",
        operaType: "",
        userNo: "",
        icCardNo: "",
        operator: "",
      },
      // 列表勾选数据
      selectData: [],
      tableShow: false,
      maxHeight: 0,
      isActive: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  mounted() {
    this.getMeterReader();
    this.getDictionary();
    this.getMeterFactoryList();
    // this.init()
    this.common.changeTable(this, ".ICRepairList", [
      ".ICRepairList .toolbar",
      ".ICRepairList .block",
      ".ICRepairList #crumbs",
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
    init() {
      let _this = this;
      let params = {
        busicode: "ICFixChgReport",
        data: this.tableQuery,
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          console.log(res);
          this.tableData = res;
        });
    },
       getMeterFactoryList() {
      let _this = this;
      let params = {
        busicode: "MeterFactoryList",
        data: {page:1,pageCount:999},
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.MeterFactoryList = res.list;
        });
    },
    del(row) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            busicode: "ICLogDelete",
            data: {
              id: row.id,
              userNo: row.userNo,
            },
          };
          this.$api
            .fetch({
              params: params, //参数
            })
            .then((res) => {
              this.$message({
                message: "删除成功！",
                type: "success",
              });
              this.init();
            });
        })
        .catch((e) => {
          console.error(e);
          this.$message({
            message: "取消删除！",
            type: "info",
          });
        });
    },
    updateRow(row){
      this.$set(row,"isEdit",true)
    },
    save(row){
      let _this = this;
      let params = {
        busicode: "ICFixChgUpdate",
        data: {id: row.id, operaType: row.operaType}
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$message({
          showClose: true,
          message: '修改成功!',
          type: 'success'
        });
        _this.init()
      })
    },
    cancleRow(row){
      this.$set(row,"isEdit",false)
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "ICOPS",
        //水表类型、用水对象、水表用途、抄表方式
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          _this.dictionaryData = res;
        });
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.operaStartTime = date[0];
        this.tableQuery.operaEndTime = date[1];
      } else {
        this.tableQuery.operaStartTime = "";
        this.tableQuery.operaEndTime = "";
      }
    },
    //抄表员下拉框数据
    getMeterReader() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { postNo: "2" },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    // 详情
    details(row) {
      this.WaterUseOverTheYearsData.userNo = row.userNo;
      console.log(this.WaterUseOverTheYearsData.userNo);
      this.payInfoVisible = true;
    },
    // 列表数据勾选禁用
    selectTable(row, index) {
      if (this.disabledData != undefined && this.disabledData.length > 0) {
        for (let i = 0; i < this.disabledData.length; i++) {
          if (row.id == this.disabledData[i].id) {
            return false;
          } else if (
            row.id != this.disabledData[i].id &&
            i == this.disabledData.length - 1
          ) {
            return true;
          }
        }
      } else {
        return true;
      }
    },
    // 查询按钮
    search() {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      //if(){

      // }
      this.init();
    },
    // 列表选中数据事件（获取列表已勾选数据）
    getSelectData(data) {
      this.$set(this, "selectData", data);
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
        this.common.changeTable(this, ".ICRepairList", [
          ".ICRepairList .toolbar",
          ".ICRepairList .block",
          ".ICRepairList #crumbs",
        ]);
      });
    },
    closeDialog() {
      //关闭会话
      this.waterChoooseVisible = false;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      if (val > 0) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "ICFixChgReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ICRepairList {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.pageDisableStyle {
  color: #c0c4cc;
}
.pageBlock {
  text-align: center;
}
/deep/{
  .el-select .el-input .el-select__caret {
    line-height: 28px;
  }
}
</style>
