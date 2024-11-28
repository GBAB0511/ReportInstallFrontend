<template>
  <div class="multipleChange">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button type="primary" v-if="showIndex" size="mini" @click="add">批量变更</el-button>
        <el-button icon="el-icon-caret-left" v-else size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div v-if="showIndex">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @keydown="enterEvents($event)">
          <el-form-item label="单据日期:">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="单据编号:">
             <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.billNo" clearable size="mini" @keydown.enter.native="init"></el-input>
          </el-form-item>
          <el-form-item label="模糊查询:">
            <el-tooltip class="item" effect="dark" content="制单人" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            <!-- <el-button type="primary" size="mini" @click="add">批量变更</el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{ height: maxHeight + 'px' }">
        <el-table
          :data="tableData.list"
          stripe
          border
          :max-height="maxHeight"
        >
          <el-table-column align="center" type="index" label="NO." width="80" :index="indexMethod"></el-table-column>
          <el-table-column label="进度" prop="processName" min-width="100"></el-table-column>
          <el-table-column label="当前处理人" prop="processHandleMan" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="单据编号" prop="billNo" min-width="120"></el-table-column>
          <el-table-column label="单据日期" prop="billDate" min-width="100"></el-table-column>
          <el-table-column label="制单人" prop="createName" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="details(scope.row)">详情</el-button>
              <el-button v-if="scope.row.processState==''" size="mini" type="text" @click="delBill(scope.row)">删除</el-button>
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
        >
        </el-pagination>
      </div>
    </div>
    <add-multiple-change v-if="showAdd"></add-multiple-change>
    <multiple-change-detail v-if="showDetail" :id="id" :processState="processState"></multiple-change-detail>
  </div>
</template>

<script>
import AddMultipleChange from './addMultipleChange.vue';
import multipleChangeDetail from './multipleChangeDetail.vue';
export default {
  components: { multipleChangeDetail, AddMultipleChange },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户管理" }, { title: "批量变更" }]
      },
      dictionary: [],
      date: [],
      tableQuery: {
        beginDate: '',
        endDate: '',
        billNo: '',
        fuzzyQuery:'',
        page: 1,
        pageCount: 20
      },
      tableData: {
        list: [],
        total: 0
      },
      maxHeight: 0,
      showIndex: true,
      showAdd: false,
      showDetail: false,
      processState:''
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".multipleChange", [
        ".multipleChange .toolbar",
        ".multipleChange .block",
        '.multipleChange .bread-contain'
      ]);
    });
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let params = {
        busicode: "ChangeUserImportList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.tableData = res;
        })
    },
    delBill(row) {
      this.$confirm("此操作将永久删除该单据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.remove(row.id);

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    remove(id){
      let params = {
        busicode: "ChangeUserImportDel",
        data: {id:id}
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.init();
          this.$message({
          message: "删除成功。",
          type: "success"
        });
        })
    },
    showDetailMethod(bo1,bo2,bo3){
      this.showDetail = bo1
      this.showAdd = bo2
      this.showIndex = bo3
    },
    setId(id){
      this.id=id
    },
    search() {
      this.tableQuery.page=1;
      this.tableQuery.pageCount=20;
      this.init()
    },
    enterEvents(e){
      if(e.keyCode == 13){
        this.init()
        this.$refs.select.blur()
      }
    },
    details(row) {
      this.id=row.id
      this.showIndex = false
      this.showDetail = true
      this.processState = row.processState
    },
    add() {
      this.showIndex = false
      this.showAdd = true
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    getFormbData(){

    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    closeDialog() {
      this.showDetail = false
      this.showAdd = false
      this.showIndex = true
      this.init()
    },
  },
  watch: {
    date: {
      deep: true,
      handler(val) {
        if(val && val.length > 0) {
          this.tableQuery.beginDate = val[0]
          this.tableQuery.endDate = val[1]
        } else {
          this.tableQuery.beginDate = ''
          this.tableQuery.endDate = ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.multipleChange {
  width: 100%;
  height: 100%;
  overflow-y:auto;
}
</style>
