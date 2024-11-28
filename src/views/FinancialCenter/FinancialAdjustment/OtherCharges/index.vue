<template>
  <div class="other-charges">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="showEdit">
        <el-button icon="el-icon-download" size="mini" @click="exportExcel" type="primary">导出</el-button>
        <el-button icon="el-icon-plus" size="mini" @click="add" type="primary">添加</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button v-if="buttomShow" :disabled="EditShow" size="mini" type="primary" @click="submit();">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div v-if="showEdit">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <el-form-item label="收费时间：">
            <el-date-picker
              v-model="DateChoosevalue"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              @change="getDatePicker"
              :picker-options="pickerOptions"
              :clearable="true"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="费用类型：" class="width-150">
            <el-select ref="select1" clearable v-model="tableQuery.costType" placeholder="费用类型">
              <el-option
                v-for="(item,index) in costIdOption"
                :key="index"
                :label="item.costName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-150" >
            <el-tooltip class="item" effect="dark" content="单据编号/用户编号/用户名称/装表地址" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          :data="tableData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="userNo" min-width="90" label="用户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="90" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="costTypeName" min-width="100" label="费用类型"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="costMoney" min-width="80" label="费用金额" align="right"></el-table-column>

          <el-table-column prop="chargingTime" min-width="150" label="收费时间"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="chargingStaff" min-width="100" label="收费员"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="invoiceNo" min-width="80" label="发票号码"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="comments" min-width="150" label="备注"  show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.$index, scope.row)">详情</el-button>
              <span v-if="scope.row.processStateName=='草稿'">|</span>
              <el-button
                v-if="scope.row.processStateName=='草稿'"
                type="text"
                @click="deleteRow(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          ></el-pagination>
        </div>
    </div>
    <OtherChargesEdit ref="OtherChargesEdit" :editNeedData="editNeedData" v-else></OtherChargesEdit>
  </div>
</template>
<script>
import OtherChargesEdit from "./OtherChargesEdit";
export default {
  name: "otherCharges",
  components: {
    OtherChargesEdit
  },
  data() {
    return {
      showEdit: true,
      tableData: {},
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "账务调整" },
          { title: "其他收费" }
        ]
      },
      tableQuery: {
        page: 1, //当前页码
        pageCount: 20, //当前页展示多少条数据
        beginDate: "", //开始日期
        endDate: "", //结束日期
        costType: "", //费用类型
        fuzzyQuery: "" //模糊查询
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
      costIdOption: [],
      // 子页面所需数据
      editNeedData: {},
      buttomShow: true,
      EditShow:false,
    };
  },
  mounted() {
    this.init();
    this.getDatePicker()
    this.getCostIdOption();
     this.$nextTick(() => {
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".other-charges", [
            ".other-charges .toolbar",".other-charges .bread-contain",
            ".other-charges .block"
          ]);
    });
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let params = {
        busicode: "OtherChageList",
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
    EditShowVisable(value){
      this.EditShow=value;
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
    //用水分类下拉数据
    getCostIdOption() {
      var params = { busicode: "CostList" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "costIdOption", res);
        })
        .catch(res => {
          this.$set(this, "costIdOption", []);
        });
    },
    add() {
      this.editNeedData.busicode = "OtherChageAdd";
      this.editNeedData.saveType = "add";
      this.buttomShow = true;
      this.showEdit = false;
    },
    details(index, row) {
      this.editNeedData = row
      this.editNeedData.busicode = "OtherChageUpdate";
      this.editNeedData.saveType = 'edit';
      if (row.processState == "approval" || row.processState == "END") {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
      this.showEdit = false;
    },
    closeDialog() {
      this.showEdit = true;
      this.init();
    },

    search() {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    // 导出按钮
    exportExcel() {
      var _this = this;
      var params = {
        busicode: "OtherChageExport",
        data: JSON.parse(JSON.stringify(this.tableQuery)),
        token: sessionStorage.getItem('token'),
        // token: "krrjdev123",
        sysType: "002"
      };
      // 入参不需要分页
      delete params.data.page;
      delete params.data.pageCount;
       window.open(
          this.common.getExportExcelIp() +
          "/project/exportExcel.api?json=" +
          encodeURI(JSON.stringify(params))
      );
    },
    submit() {
      //提交
      this.$refs.OtherChargesEdit.submit();
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
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "OtherChageDelete",
            data: row.id
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
.other-charges {
  width: 100%;
  height: 100%;
}
</style>