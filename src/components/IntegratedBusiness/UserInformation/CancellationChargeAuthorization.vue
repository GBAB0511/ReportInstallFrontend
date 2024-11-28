
<template>

  <div class="CancellationChargeAuthorization">
    <div class="toolbar">
      <div class="form-right">
        <el-button size="mini" type="primary" @click="authorize">授权</el-button>
      </div>
    </div>
    <div class="kl-table common-diaTab" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" @selection-change="getItemList" stripe border :data="tableData.list" class="change-tables-table">

        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>

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
      </el-table>
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "CancellationChargeAuthorization",
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '财务中心', path: '/CancellationChargeAuthorization' },
          { title: '票据管理', method: () => { window.histroy.back() } }
        ],

      },
      // 列表数据
      tableData: {},
      // 列表勾选数据 [{id}, {...}]
      checkData: [],
      // 查询条件对象
      tableQuery: {
          page: 1,
          pageCount: 20,
      },
      
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: "",
      tableShow: false,
      maxHeight: 0,
      histroyData: {

      },
      CancellationChargeAuthorizationVisible: false,  //综合查询的显示和隐藏
      CancellationChargeAuthorizationName: '发票领用-领用',
      ruleFormData: {},
      PrintPayer: "",
      CombinedStrike: "",

    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.CancellationChargeAuthorization', ['CancellationChargeAuthorization .toolbar', '.CancellationChargeAuthorization .block', 'CancellationChargeAuthorizationy #crumbs'])
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "BillCancelAuthorizeList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    // 取消收费按钮
    authorize() {
      let _this = this
      this.$confirm('是否确定授权?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "BillCancelAuthorize",
          data: _this.checkData,
        };
        this.$api.fetch({
          params: params,//参数

        }).then(res => {
          _this.$message({
            type: "success",
            message: "授权成功!"
          });
          _this.init()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消授权'
        });
      });
    },
    // 获取列表选中数据
    getItemList(itemList) {
      this.checkData = []
      itemList.forEach(item => {
        this.checkData.push({
          id: item.id,
        })
      })
    },

    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
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
        (1 - 1) * 20 + (index + 1)
      );
    },
    closeDialog() { //关闭会话
      this.CancellationChargeAuthorizationVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childCancellationChargeAuthorization.submit()
      // this.CancellationChargeAuthorizationVisible = false;
    },
    add() {
      this.CancellationChargeAuthorizationVisible = true;
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
<style lang="scss" scoped>
.CancellationChargeAuthorization {
  width: 100%;
  height: calc(100% - 30px);
  .form-right {
    margin-right: 20px;
  }
}
</style>
