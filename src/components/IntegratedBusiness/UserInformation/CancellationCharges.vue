
<template>

  <div class="UnsettledAccountsStatistics">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="模糊查询：">
          <el-tooltip class="item" effect="dark" content="客户编号、账户编号、用户编号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search" @input="e => input = inputMe(e)"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>

          <el-button size="mini" class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{ height: maxHeight + 'px' }">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" highlight-current-row>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="payTime" min-width="120" label="收费时间">
        </el-table-column>

        <el-table-column prop="payChannel" min-width="80" label="收费渠道">
        </el-table-column>

        <el-table-column prop="payMethod" min-width="80" label="收费方式">
        </el-table-column>

        <el-table-column prop="ctmName" min-width="100" label="客户名称">
        </el-table-column>

        <el-table-column prop="accountNo" min-width="110" label="账户编号">
        </el-table-column>

        <el-table-column prop="userNo" min-width="110" label="用户编号">
        </el-table-column>

        <el-table-column prop="transactionMoney" min-width="85" label="交易金额">
        </el-table-column>

        <el-table-column prop="chargingStaff" min-width="70" label="收费员">
        </el-table-column>

        <el-table-column prop="comments" min-width="80" label="备注">
        </el-table-column>

        <el-table-column class="cell" label="操作" fixed="right" min-width="50">
          <template slot-scope="scope">
            <el-button type="text" @click="cancelCharges(scope.row)" size="mini">取消</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="this.tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "UnsettledAccountsStatistics",
  props:['fuzzyQuery'],
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '财务中心', path: '/UnsettledAccountsStatistics' },
          { title: '票据管理', method: () => { window.histroy.back() } }
        ],
      },
      // 列表数据
      tableData: {},
      // 列表勾选数据 [{id,billDetailId,billMoney}, {...}]
      checkData: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,

        fuzzyQuery: '',
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
      histroyData: {

      },
      UnsettledAccountsStatisticsVisible: false,  //综合查询的显示和隐藏
      UnsettledAccountsStatisticsName: '发票领用-领用',
      ruleFormData: {},
      PrintPayer: "",
      CombinedStrike: "",

    }
  },
  mounted() {
    this.fuzzyQuery&&(this.tableQuery.fuzzyQuery = this.fuzzyQuery); //带上工作台的户号一起查
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, '.UnsettledAccountsStatistics', ['UnsettledAccountsStatistics .toolbar', '.UnsettledAccountsStatistics .block'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "BillCancelList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    // 查询按钮
    search() {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init()
    },
    // 取消收费按钮
    cancelCharges(row) {
      let _this = this
      this.$confirm('是否确定取消收费?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "BillCancelDayCharge",
          data: {
            flowId : row.id
          }
        };
        this.$api.fetch({
          params: params,//参数

        }).then(res => {
          _this.$message({
            type: "success",
            message: "已提交取消申请，等待授权。"
          });
          _this.init()
        })
      });
    },
    //复选框禁用
    checkboxT(row, index) {
      if (row.status == 0) {
        return true;
      } else {
        return false;
      }
    },











    //   导出
    exportExcel() {
      //   	let listData = {}
      //   	this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
      //     let params ={
      //       "busicode":"MeterReadingList",
      //       "data": this.tableQuery
      //     }
      //     this.$api.fetch({
      //       apiUrl: 'interface.api',//路径
      //       method: 'post',//请求方法
      //       params:params,//参数
      //       needErrorCallback:true
      //     }).then(res =>{
      //     	if(res.code===0){
      //         listData = res.data
      //         if (!listData.list[0]) {
      //         		this.$notify({
      //               title: '警告',
      //               message:'表格没有相关数据',
      //               type: 'error'
      //             })
      //         	} else {
      //         		import('@/vendor/Export2Excel').then(excel => {
      // 			        const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
      // 			        const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
      // 			        const list = listData.list
      // 			        const data = this.formatJson(filterVal, list)
      // 			        excel.export_json_to_excel({
      // 			          header: tHeader,
      // 			          data,
      // 			          filename: this.tableQuery.daytime + '抄表数据',
      // 			          autoWidth: '100'
      // 			        })
      // 			      })
      //         		this.tableQuery.pageCount = 20
      //         	}
      //       }
      //     })
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

    cellClick(row, column, cell, event) { //点击文件名
      let that = this;

    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog() { //关闭会话
      this.UnsettledAccountsStatisticsVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childUnsettledAccountsStatistics.submit()
      // this.UnsettledAccountsStatisticsVisible = false;
    },
    add() {
      this.UnsettledAccountsStatisticsVisible = true;
    },
    edit() {

    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.UnsettledAccountsStatistics {
  width: 100%;
  height: calc(100% - 50px);
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  // .kl-table {
  //   padding: 0px 10px;
  //   width: calc(100% - 20px);
  //   // .block {
  //   //   text-align: right;
  //   //   padding: 10px 0px;
  //   // }
  // }
  .el-form--inline .el-form-item:first-of-type {
    margin-right: 0px;
  }
}
</style>
