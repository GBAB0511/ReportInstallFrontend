<template>
  <el-dialog
    title="查询详情"
    :visible.sync="show"
    :close-on-click-modal="false"
    class="button-dialog search-dialog"
    @close="handleClose"
  >
    <div class="searchQuery">
      <div class="search">
        <el-input
          v-model="tableQuery.fuzzyQuery"
          @keyup.native.enter="search"
          ref="fuzzyQuerySearch"
          clearable
          size="larger"
          placeholder="客户编号/客户名称/客户地址/账户编号/用户编号/手机号码/固定电话" 
          @change="inputChange"
          @input="e => input = inputMe(e)"
        ></el-input>
        <el-button class="searchBtn" @click="search" icon="el-icon-search"
          >搜索</el-button
        >
        <el-checkbox style="margin-left:20px" v-model="isArrearage" @change="handleIsArrearageChange">只看欠费</el-checkbox>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
           <el-table highlight-current-row stripe :max-height="maxHeight" border :data="tableData" class="change-tables-table" @selection-change="getSelectData" @row-dblclick="handleSelectionChange">
             <el-table-column type="selection" width="50" fixed="left"  ></el-table-column>
        <el-table-column type="index" label="NO." width="50" fixed="left"></el-table-column>

        <el-table-column prop="ctmNo" min-width="120" label="客户编号"></el-table-column>

        <el-table-column prop="accountNo" min-width="120" label="账户编号"></el-table-column>

        <el-table-column prop="ctmName" min-width="120" label="客户名称"></el-table-column>

        <el-table-column prop="payWay" min-width="80" label="缴费方式"></el-table-column>

        <el-table-column prop="userNo" min-width="120" label="用户编号"></el-table-column>

        <el-table-column prop="setupMeterAddr" min-width="150" label="装表地址" show-overflow-tooltip></el-table-column>

        <el-table-column prop="useWaterType" min-width="100" label="用水类型" show-overflow-tooltip></el-table-column>

        <el-table-column prop="isArrearage" min-width="80" label="是否欠费" show-overflow-tooltip></el-table-column>
         <el-table-column prop="statusName" min-width="80" label="用户状态" show-overflow-tooltip>
           <template slot-scope="{row}" ><div :class="row.statusName === '正常' ? 'green':'red'">{{row.statusName}}</div></template>
         </el-table-column>
      </el-table>
      </div>
      
    </div>
     <div class="footer" slot="footer">
        <el-button type="primary" size="mini" @click="handleSubmit"
          >确定</el-button
        >
        <el-button size="mini" @click="handleClose">取消</el-button>
      </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tableShow: false,
      maxHeight: 0,
      show: false,
      
      tableData:[],
      resData:[],
      // 选中数据拼接字符串
      selectData:'',
      // 选中数据
      selectListData:[],
      tableQuery:{
        fuzzyQuery: "",
        isFuzzy:1,
        customTableData:[],
        accountTableData:[],
        userTableData:[],
        unionSizeData:[]
      },
      isArrearage:false,
      parentfuzzyQuery: "",
      isUnionQuery: false, // 是否为联合编号查询
    };
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    open(res, fuzzyQuery) {
      this.resData = [];
      this.tableQuery.customTableData = [];
      this.tableQuery.accountTableData = [];
      this.tableQuery.userTableData = [];
      this.tableQuery.unionSizeData = [];

      this.show = true;
      this.tableQuery.fuzzyQuery = fuzzyQuery;
      this.parentfuzzyQuery = fuzzyQuery;
      this.tableQuery.isFuzzy = 0;
      const customTableData = res[0].list
      const customSize = res[0].size || 0
      const accountTableData = res[1].list
      const accountSize = res[1].size || 0
      const userTableData = res[2].list
      const userSize = res[2].size || 0
      const unionSizeData = res[3].list
      const unionSize = res[3].size || 0

      if(customSize > 0)
          this.tableQuery.customTableData = customTableData;
      if(accountSize > 0)
          this.tableQuery.accountTableData = accountTableData;
      if(userSize > 0)
          this.tableQuery.userTableData = userTableData;
      if(unionSize > 0){
        this.tableQuery.unionSizeData = unionSizeData;
        this.isUnionQuery = true;
      }
          


      this.search();
      this.$nextTick(() => {
        this.common.changeTable(this, ".searchQuery", [
          ".searchQuery .search",
          // ".searchQuery .footer",
        ]);
        // this.maxHeight -= 30;
      });
    },
    inputChange(){
      this.tableQuery.isFuzzy = 1
    },
     handleSubmit() {
       this.isArrearage = false
       this.selectListData = []
       if(this.isUnionQuery && this.parentfuzzyQuery == this.selectData){ // 联合编号查询，并且选中了与联合编号一样的用户编号
        this.$parent.unionSubmit();
        this.isUnionQuery = false;
       }else{
        this.$parent.fuzzyManySubmit();
       }
       
      this.show = false;
    },
    handleClose() {
      this.isArrearage = false
      this.show = false;
    },
    init(res) {    
     
      const size = res.length || 0;
      if (size === 0) {
        this.$message({
          type: "warning",
          message: "未查询到相关内容",
        });
        return;
      }
      this.resData = res
      this.tableData = this.resData
      this.handleIsArrearageChange(this.isArrearage)
    },
    getSelectData(data){
      const selects=[]
      this.selectListData = data
      console.log(data);
      if(data.length>0){
        data.forEach((item)=>{
          selects.push(item.userNo)
        })
      }
      if(selects.length > 0)
        this.selectData = selects.join(',')
    },
    handleSelectionChange(selection) {
      console.log(this.selectListData);
      if (this.selectListData.length == 0 || (this.selectListData.length == 1 && this.selectListData[0].userNo == selection.userNo)) {
        let select = []
        select.push(selection)
        this.getSelectData(select)
        this.handleSubmit()
      }
    },
    // 筛选是否欠费
    handleIsArrearageChange(value){
      if (value) {
        this.tableData = this.resData.filter(item=>{
          return item.isArrearage == '是'
        })
      }else{
        this.tableData = this.resData.filter(item=>{
          return item
        })   
      }
    },
    search() {
      if (this.tableQuery.isFuzzy === 1 && (!this.tableQuery.fuzzyQuery || this.tableQuery.fuzzyQuery.length === 0)) {
        this.$message({
          type: "error",
          message: "搜索内容不能为空",
        });
        return;
      } /* else if(this.fuzzyQuery.length < 5) {
                this.$message({
                type: 'warning',
                message: '搜索内容长度需要不低于5位'
                })
                return
            }*/
      const params = {
        busicode: "ChargeManyFuzzyQuery",
        data:this.tableQuery
      };
      this.$api.fetch({ params }).then((res) => {
        this.init(res);
      });
    },

  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    userMaxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
};
</script>

<style lang="scss">
.search-dialog {
  .searchQuery {
    height: 100%;
  }
  // .footer {
  //   margin-left: 45%;
  //   height: 50px;
  //   // line-height: 50px;
  //   padding-top: 20px;
  // }
  // .elx-table--main-wrapper{
  //     .elx-table--empty-placeholder{
  //         top: 50%;
  //     }
  // }
  .green{
    color: #67c23a;
  }
  .red{
    color: red;
  }
  .search,
  .content {
    // margin-top: 10px;
    .el-input {
      width: 500px;
      .el-input__inner {
        width: 100%;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
        // padding-left: 0px;
        &::-webkit-input-placeholder {
          font-size: 14px;
        }
        &::-moz-placeholder {
          font-size: 14px;
        }
        &:-ms-input-placeholder {
          font-size: 142px;
        }
      }
    }

    .table-row td .cell {
      font-size: 14px;
      line-height: 2em;
    }

    .table-header th .cell {
      font-size: 14px;
    }
  }
  .search{
      padding: 10px 20px;
    }
  .elx-body--column{
    height: auto !important;
  }
}
</style>