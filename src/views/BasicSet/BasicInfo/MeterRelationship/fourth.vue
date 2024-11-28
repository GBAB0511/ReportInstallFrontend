<template>
  <div class="fourth">
      <div class="fourth">
       <div class='fourth-right'>
          <company-tree :treeData="treeDatas" @sendTreeData="treeSearch"></company-tree>
        </div>
        <div class="fourth-center">
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline"  @submit.native.prevent>
              <span class="meter-type">消防表</span>

              <el-checkbox v-model="tableQuery.checked" style="margin-left: 2%;">存在分摊表</el-checkbox>

              <el-form-item label="">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="fuzzy-query-input" v-model="tableQuery.fuzzyQuery" placeholder="用户编号/客户名称" clearable @keydown.enter.native="demand"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe border v-if="tableShow" :max-height="maxHeight" :data="tableData.list" class="change-tables-table" @row-click="RightList" highlight-current-row>

              <el-table-column type="index" label="NO." width="50" :index="indexMethod">
              </el-table-column>


              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>

              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="shareWayName" min-width="80" label="分摊方式" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="rowCount" min-width="80" label="户数">
              </el-table-column>

            </el-table>
            
          </div>
          <div class="block">
            <el-pagination @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :current-page="tableQuery.page" 
              :page-sizes="[100, 500, 1000]" 
              :page-size="tableQuery.pageCount"
              :pager-count="3"
              layout="total, sizes, prev, pager, next, jumper" 
              :total="tableData.total">
            </el-pagination>
          </div>
        </div>
        <div class='fourth-left'>
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery1" class="demo-form-inline" @submit.native.prevent>
              <span class="meter-type">分摊表</span>

              <el-form-item label="用户编号：" style="margin-left: 2%;">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery1.fuzzyQuery1" placeholder="用户编号" style="width: 45%;" clearable @keydown.enter.native="demand1"></el-input>

              </el-form-item>
              <el-form-item>
                <el-button class="searchBtn" @click="demand1" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe border v-if="tableShow" :max-height="maxHeight" :data="tableData1.list"  class="change-tables-table" highlight-current-row>

              <el-table-column type="index" label="NO." width="50" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>

              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址" show-overflow-tooltip>
              </el-table-column>

            </el-table>
            
          </div>
          <div class="block">
            <el-pagination @size-change="handleSizeChange1" 
              @current-change="handleCurrentChange1" 
              :current-page="tableQuery1.page" 
              :page-sizes="[100, 500, 1000]" 
              :page-size="tableQuery1.pageCount" 
              :pager-count="3"
              layout="total, sizes, prev, pager, next, jumper" 
              :total="tableData1.total">
            </el-pagination>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: "fourth",
  props:[
    
  ],
  data() {
    return {
      //公司组件树
      treeDatas: {
        // 树数据
        tree: [
          {
            books: [],
            businessAbode: "",
            showName: "全部"
          }
        ],
        // 树的label和children 字段分别是对应的什么字段
        defaultProps: {
          label: "showName",
          children: "books"
        },
        // 输入框的一些选项
        inputProp: {
          // 是否显示input框
          showSearch: true,
          // placeholder提示
          Inp_placeholder: "请输入节点"
        },
        // 根节点名称
        rootName: "全部",
        // 返回的字段
        sendTreeProp: [
          "businessAbodeName",
          "businessAbode",
          "books",
          "totalWater",
          "totalUser",
          "showName",
          "meterReadingAmount",
          "bookNo",
          "bookName",
          "abnormalAmount"
        ],
        // 默认展开某一个节点
        defaultOpen: {
          // 节点的唯一key
          nodeKey: "businessAbode"
          // 默认展开的节点 ，和key对应
          // nodeItem:'',
        }
      },
      tableQuery: {
        page: 1,
        pageCount: 100,
        checked: "",
        businessAbode: "",
        userNo: "",
        accountPeriod: "202024",
        meterReadingStaff: "",
        activeType: "2",
        fuzzyQuery:"",
        fuzzyQuery1:"",
      },
      tableQuery1: {
        page: 1,
        pageCount: 100,
        checked: "",
        businessAbode: "",
        userNo: "",
        accountPeriod: "202024",
        meterReadingStaff: "",
        activeType: "2",
        fuzzyQuery:"",
        fuzzyQuery1:"",
      },
      tableData:{},
      tableData1:{},
      rowData:{},
      tableShow: false,
      maxHeight: 0,
    }
  },
  mounted() {
    this.backTreeData();
    this.common.changeTable(this, '.fourth', ['.fourth .toolbar','.fourth .block'])
    this.init();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init(){
      let _this = this;
      this.tableQuery.activeType=2
      _this.rowData={};
      let params = {
        busicode: "MrRelLeftList",
        data: this.tableQuery
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.tableData = res;
          this.tableQuery.userNo="";
        });
    },
    
    leftList(val){
      this.tableQuery.userNo=val.userNo;
      this.init();
    },
    RightList(val){
      let _this = this;
      _this.rowData=val;
      if(val){
        _this.tableQuery1.userNo=val.userNo;
        _this.tableQuery1.fuzzyQuery1="";
      }else if(!val && (_this.tableQuery1.fuzzyQuery1===null || _this.tableQuery1.fuzzyQuery1==='')){
        _this.$notify({
            type: "warning",
            message: "请输入用户编号查询"
          });
        return
      }
      let params = {
        busicode: "MrRelRightList",
        data: _this.tableQuery1
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.tableData1 = res;
          _this.tableQuery1.userNo="";
        });
    },
    demand() {
      this.tableQuery.pageCount = 100
      this.tableQuery.page = 1
      this.init();
    },
    demand1(){
      this.tableQuery1.pageCount = 100
      this.tableQuery1.page = 1
      this.RightList("");
    },
    
    treeSearch(val){
      let _this=this
      _this.clearData();
      if(val!=null && val!=""){
        this.tableQuery.businessAbode=val.businessAbode;
      }
      _this.init();
    },
    //树接口
    backTreeData() {
      let _this = this;
      let params = {
        busicode: "DmaTreeIsLeaf",
        data: {
          accountPeriod: _this.tableQuery.accountPeriod, //账期
          meterReadingStaff: _this.tableQuery.meterReadingStaff //抄表员
        }
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.treeDatas.tree[0].books = res;
        });
    },
    //分页
    handleSizeChange1(val) { //显示多少数据一页
      this.tableQuery1.pageCount = val
      this.tableQuery1.page = 1
      this.RightList(this.rowData);
    },
    handleCurrentChange1(val) {  //显示多少页码
      this.tableQuery1.page = val
      this.RightList(this.rowData);
    },
    indexMethod1(index) {//获取表格序号
      return  (this.tableQuery1.page-1)*this.tableQuery1.pageCount + (index+1) ;

    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod(index) {//获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;

    },
    clearData() {
      (this.tableData = []),
        (this.tableData1 = []),
        (this.tableQuery = {
          page: 1,
          pageCount: 100,
          checked: "",
          businessAbode: "",
          userNo: "",
          accountPeriod: "202024",
          meterReadingStaff: "",
          activeType: ""
        });
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
}
</script>

<style lang="scss" scoped >
.fourth {
  width: 100%;
     .fuzzy-query-input {
     width: 180px !important;
     /deep/ {
        .el-input__inner {
        width: 100%;
        }
      }
    }
  .fourth {
    display: flex;
    .fourth-right {
      width: 20%;
    }
    .fourth-center {
      width: 40%;
    }
    .fourth-left {
      width: 40%;
    }
  }
  .meter-type {
    font-weight: bolder;
    display: inline-block;
    line-height: 30px;
    height: 100%;
    font-size: 1rem;
  }
}
</style>
