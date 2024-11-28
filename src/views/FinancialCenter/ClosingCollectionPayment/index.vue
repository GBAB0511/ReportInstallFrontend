<template>
  <!-- 代收支付关闭 模块 -->
  <div class="ClosingCollectionPayment">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <font v-if="indexShow">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
        </font>
        <font v-else>
          <el-button v-if="buttomShow" size="mini" type="primary" @click="submit();">保存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
      </div>
    </div>

    <div v-if="indexShow"  class="indexContent">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="单据日期：">
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

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder>
              <el-option
                v-for="(item,index) in approvalStatusOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="单据编号" placement="top">
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
          <el-table-column type="index" label="NO." width="50" fixed="left"></el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip="true"></el-table-column>

          <el-table-column prop="billNo" min-width="90" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期"></el-table-column>

          <el-table-column prop="beginDate" min-width="100" label="开始时间"></el-table-column>

          <el-table-column prop="endDate" min-width="100" label="结束日期"></el-table-column>

          <el-table-column prop="comments" min-width="100" label="说明"></el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click.native="details(scope.$index, scope.row)">详情</el-button>
              <el-button type="text" v-if="scope.row.processState===''||scope.row.processState==='DRAFT'" @click.native="deleteRow(scope.$index, scope.row)">删除</el-button>
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
    
    <div v-else class="indexContent">
      <ClosingCollectionPaymentEdit
        :formStute="formStute"
        ref="childWarehousing"
      ></ClosingCollectionPaymentEdit>
    </div>
  </div>
</template>
<script>
import ClosingCollectionPaymentEdit from "./ClosingCollectionPaymentEdit";
export default {
  name: "ClosingCollectionPayment",
  components: {
    ClosingCollectionPaymentEdit
  },
  data() {
    return {
      buttomShow: true,
      DateChoosevalue: [],
      indexShow: true,
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "代收支付关闭" }
        ]
      },
      //审批状态下拉框
      approvalStatusOptions: this.common.processState(),
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        fuzzyQuery: "",
        processState: ""
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      formStute: {
        idFinaEdit: "",
        billStute: ""
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.getDatePicker()
    this.common.changeTable(this, ".ClosingCollectionPayment ", [
      ".ClosingCollectionPayment .toolbar",
      ".ClosingCollectionPayment .block",
      '.ClosingCollectionPayment .bread-contain'
    ]);
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
        busicode: "InternetCloseList",
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
    search() {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
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

    closeDialog() {
      //关闭会话
      this.indexShow = true;
      this.init();
    },
      //提交
    submit() {
      this.$refs.childWarehousing.submit();
    },
    add() {
      this.formStute.billStute = "InternetCloseAdd";
      this.formStute.idFinaEdit = "";
      this.buttomShow = true;
      this.indexShow = false;
    },
    details(index, row) {
      this.formStute.billStute = "InternetCloseUpdate";
      this.formStute.idFinaEdit = row.id;
      if (row.processState == "approval" || row.processState == "END") {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
      this.indexShow = false;
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
            busicode: "InternetCloseDelete",
            data: {id:row.id}
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
.ClosingCollectionPayment {
  width: 100%;
  height: 100%;
}
</style>
