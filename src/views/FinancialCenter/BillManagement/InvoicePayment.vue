
<template>
  <div class="InvoicePayment">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>
    <div class="indexContent">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='日期：'>
            <el-date-picker v-model="tableTime" @change="getDatePicker" type="monthrange" format="yyyy-MM" value-format="yyyyMM" range-separator="至"  :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="所属人：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.formerName" placeholder="所属人" @keydown.enter.native="demand"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="invoiceStatus" min-width="100" label="发票状态">
          </el-table-column>

          <el-table-column prop="putInvoiceFlagName" min-width="100" label="开票状态">
          </el-table-column>

          <el-table-column prop="invoiceTypeName" min-width="100" label="票据类型">
          </el-table-column>

          <el-table-column prop="invoiceCode" min-width="100" label="发票代码">
          </el-table-column>

          <el-table-column prop="invoiceBeginNum" min-width="100" label="开始号码">
          </el-table-column>

          <el-table-column prop="invoiceEndNum" min-width="100" label="结束号码">
          </el-table-column>

          <el-table-column prop="invoiceAmount" min-width="80" label="发票数量" align="right">
          </el-table-column>

          <el-table-column prop="getinvoicestaff" min-width="80" label="所属人">
          </el-table-column>

          <el-table-column prop="flux" min-width="80" label="金额" align="right">
          </el-table-column>


          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button v-if="scope.row.putInvoiceFlag==='0'" type="text" @click.native="edit(scope.row)">交票</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "InvoicePayment",
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "票据管理" },
          { title: "票据交票" }
        ]
      },
      formData: {
        
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableTime: ["", ""],
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableData:[],
      tableQuery: {
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginTime:"",
        endTime:"",
        formerName:"",
	      //putInvoiceFlag:"",
      },
      InvoicePaymentVisible: false, //综合查询的显示和隐藏
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".InvoicePayment", [
        ".InvoicePayment .toolbar",
        ".InvoicePayment .block",
        '.InvoicePayment .bread-contain'
      ]);
    })
    
  },
  methods: {
    init() {
      let _this = this
      let params = {
          "busicode": "FnInvoiceSubmitList",
          "data": _this.tableQuery,
      }
      _this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.tableData = res;
      })
    },
    // 获取日期框数据 
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginTime = date[0]
        this.tableQuery.endTime = date[1]
      } else {
        this.tableQuery.beginTime = ''
        this.tableQuery.endTime = ''
      }
    },
    demand() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
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
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },

    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;

    },
    closeDialog() {
      //关闭会话
      this.InvoicePaymentVisible = false;
      this.backfillVisible = false;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childInvoicePayment.submit();
      // this.InvoicePaymentVisible = false;
    },
    add() {
      this.InvoicePaymentVisible = true;
    },
    edit(row) {
      this.$confirm("是否确认交票?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let _this = this
          let params = {
              "busicode": "FnInvoiceSubmit",
              "data": {
                "invoiceBeginNum":row.invoiceBeginNum,
                "invoiceEndNum":row.invoiceEndNum,
                "putInvoiceFlag":row.putInvoiceFlag,
              }
          }
          _this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$notify({
              title: '成功',
              message: '交票成功',
              type: 'success'
            });
            this.init();
          })
        })
        .catch(() => {
          this.$notify({
              title: '取消',
              message: '取消成功',
              type: 'warning'
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
.InvoicePayment {
  width: 100%;
  height: 100%;
}
</style>
