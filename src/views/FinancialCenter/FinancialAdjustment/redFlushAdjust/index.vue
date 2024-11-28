<template>
  <div class="RedFlushing">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="RedFlushingVisible">
        <el-button v-if="buttomShow" size="mini" type="primary" @click="submit();">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <!-- <el-button @click="exportExcel" size="mini" type="primary">打印普通发票</el-button>
        <el-button @click="exportExcel" size="mini" type="primary">打印电子发票</el-button>
        <el-button @click="exportExcel" size="mini" type="primary">打印财政收据</el-button>
        <el-button @click="exportExcel" size="mini" type="primary">打印增值税发票</el-button> -->
        <el-button icon="el-icon-plus" size="mini" @click="add" type="primary">添加</el-button>
      </div>
    </div>

    <div class="indexContent" v-if="RedFlushingVisible">
      <redFlushEdit :editNeedData="editNeedData" :NotDisabled="buttomShow" ref="childRedFlushing"></redFlushEdit>
    </div>

    <div class="indexContent" v-else>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">

          <el-form-item label="单据日期：">
            <el-date-picker v-model="DateChoosevalue" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="办结时间：">
            <el-date-picker v-model="finishTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="状态：" label-width="50px">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder>
              <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="用户编号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.trim="tableQuery.userNo" placeholder="用户编号" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>

          <el-form-item label="余额退款方式：" class="width-150" label-width="110px">
            <el-select v-model="tableQuery.refundWay" clearable>
              <el-option v-for="(item,index) in dictionaryData.YET" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.trim="tableQuery.fuzzyQuery" placeholder="单据编号/制单人" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe highlight-current-row border :data="tableData.list" class="change-tables-table">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <!--el-table-column type="selection" width="55"></el-table-column-->

          <el-table-column prop="processStateName" min-width="60" label="状态" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processName" min-width="60" label="进度" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processHandleMan" min-width="80" label="当前处理人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="90" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="120" label="单据日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userNo" min-width="120" label="用户编号"></el-table-column>
          <el-table-column prop="accountPeriod" min-width="60" label="红冲账期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createName" min-width="60" label="制单人"></el-table-column>
          <el-table-column prop="updateTime" min-width="100" label="最后更新时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="comments" min-width="60" label="备注" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="110">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.$index, scope.row)">详情</el-button>
              <el-button type="text" v-if="scope.row.processState!='approve' && scope.row.processState!='END'" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import redFlushEdit from "./redFlushEdit";
export default {
  name: "RedFlushing",
  components: {
    redFlushEdit,
  },
  data () {
    return {
      buttomShow: true,
      editNeedData: {
        saveType: "",
        busicode: "",
      },
      DateChoosevalue: ["", ""],
      finishTime: ["", ""],
      tableQuery: {
        page: 1, //当前页码
        pageCount: 20, //当前页展示多少条数据
        userNo: "",
        redRushStart: "",
        redRushEnd: "",
        fuzzyQuery: "", //模糊查询
        refundWay: "",
        processState: "", //状态
        finishStartTime: "",
        finishEndTime: "",
      },
      dictionaryData: [],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "账务调整" },
          { title: "红冲" }
        ]
      },
      //审批状态下拉框
      approvalStatusOptions: this.common.processState(),
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      RedFlushingVisible: false, // 选择红冲记录
      chooseRedFlushingVisible: false,
    };
  },
  mounted () {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.getDictionary();
    this.common.changeTable(this, ".RedFlushing", [
      ".RedFlushing .toolbar", ".RedFlushing .bread-contain",
      ".RedFlushing .block"
    ]);
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    init () {
      this.dateFormat();
      let params = {
        busicode: "FnRedRushList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        });
    },
    dateFormat(){
      this.DateChoosevalue = this.DateChoosevalue || ["", ""]
      this.tableQuery.redRushStart = this.DateChoosevalue[0];
      this.tableQuery.redRushEnd = this.DateChoosevalue[1];
      this.finishTime = this.finishTime || ["", ""]
      this.tableQuery.finishStartTime = this.finishTime[0] == "" ? "" : this.finishTime[0] + " 00:00:00";
      this.tableQuery.finishEndTime = this.finishTime[1] == "" ? "" : this.finishTime[1] + " 23:59:59";
    },
    // 数据字典数据获取
    getDictionary () {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "HCT,YET" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 下载模板（调子页面下载模板方法）
    exportExcel () {
      this.$refs.childRedFlushing.exportExcel()
    },

    demand () {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog () {
      //关闭会话
      this.RedFlushingVisible = false;
      this.init();
    },
    //弹出框
    submit () {
      //提交
      this.$refs.childRedFlushing.submit();
    },
    add () {
      this.editNeedData.busicode = "FnRedRushAdd";
      this.editNeedData.saveType = "add";
      this.buttomShow = true;
      this.RedFlushingVisible = true;
    },
    details (index, row) {
      this.editNeedData = row;
      this.editNeedData.busicode = "FnRedRushUpdate";
      this.editNeedData.saveType = 'edit';
      if (row.processState == "approval" || row.processState == "END") {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
      this.RedFlushingVisible = true;
    },
    // 删除行
    deleteRow (index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "FnRedRushDel",
            data: { id: row.id }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.init();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
.RedFlushing {
  width: 100%;
  height: 100%;

  .indexContent {
    height: calc(100% - 41px);
    overflow: hidden;
  }
}
</style>
