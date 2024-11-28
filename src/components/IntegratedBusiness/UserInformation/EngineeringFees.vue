<template>
  <div class="EngineeringFees">
    <!-- 弹出表单用户过户 -->
    <el-dialog title="开票" v-if="callVisible" append-to-body :visible.sync="callVisible" :close-on-click-modal="false" class="CallDialog" @close="closeOpenFlag">

      <el-form size="mini" label-width="330px" :model="formData">
        <el-form-item label="发票类型：">

          <el-select v-model="formData.invoiceType" clearable style="width: inherit;">
            <el-option v-for="item in dictionaryData.GCT" :key="item.value" :label="item.name"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票代码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.invoiceCode" placeholder="发票代码" clearable style="width:180px;" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="发票号码：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.invoiceNo" placeholder="发票号码" clearable style="width:180px;" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="submitInvoice">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeOpenFlag">取 消</el-button>
      </div>
    </el-dialog>
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label='单据日期：'>
          <el-date-picker size="mini" :disabled="Notdisabled" v-model="dataList" @change="getDatePicker" :picker-options="pickerOptions" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单据类型：">
          <el-select clearable v-model="tableQuery.billType" placeholder="" :disabled="Notdisabled">
            <el-option v-for="(item,index) in billTypeOptions" :key="index" :label="item.receiptName" :value="item.receiptNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据编号：" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :disabled="Notdisabled" v-model="tableQuery.billNo" placeholder="单据编号" @keydown.enter.native="search" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="是否缴费：">
          <el-select :disabled="Notdisabled" clearable v-model="tableQuery.chargeFlag" placeholder="">
            <el-option v-for="(item,index) in chargingFlagOptions" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>

          <el-button class='searchBtn' @click="search" icon="el-icon-search" :disabled="Notdisabled"></el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border v-if="tableShow" show-summary :summary-method='getTotal' :max-height="maxHeight" :data="tableData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="billDate" min-width="100" label="单据日期">
        </el-table-column>

        <el-table-column prop="billNo" min-width="100" label="单据编号">
        </el-table-column>

        <el-table-column prop="userName" min-width="80" label="客户名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="projectCharge" min-width="120" label="工程收款主体" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="receivableMoney" min-width="80" label="应收金额">
        </el-table-column>

        <el-table-column prop="depositMoney" min-width="100" label="用水保证金">
        </el-table-column>

        <el-table-column prop="totalMoney" min-width="100" label="合计金额">
        </el-table-column>

        <el-table-column prop="chargeTypeName" min-width="100" label="收费类型">
        </el-table-column>

        <el-table-column prop="payChannel" min-width="110" label="缴费渠道">
          <template slot-scope="scope">
            <el-select v-if="!Notdisabled && scope.row.chargeFlag ==0" v-model="scope.row.payChannel" @keyup.esc.native="cancel(scope.$index, scope.row)">
              <el-option v-for="item in dictionaryData.BPC" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span style="color:#606266" v-else>{{scope.row.payChannelName}}</span>
          </template>

        </el-table-column>

        <el-table-column prop="payWay" min-width="110" label="缴费方式">
          <template slot-scope="scope">
            <el-select v-if="!Notdisabled && scope.row.chargeFlag ==0" v-model="scope.row.payWay" @keyup.esc.native="cancel(scope.$index, scope.row)">
              <el-option v-for="item in dictionaryData.BPP" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span style="color:#606266" v-else>{{scope.row.payWayName}}</span>
          </template>
          
        </el-table-column>

        <el-table-column prop="chargeTime" min-width="150" label="收费时间">
        </el-table-column>

        <el-table-column prop="chargeStaffName" min-width="80" label="收费员" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="invoiceType" min-width="80" label="发票类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="invoiceCode" min-width="80" label="发票代码" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="invoiceNo" min-width="80" label="发票号码" show-overflow-tooltip>
        </el-table-column>

        <el-table-column class="cell" label="操作" fixed="right" width="120" v-if="!Notdisabled">
          <template slot-scope="scope">
            <el-button v-if="scope.row.chargeFlag ==0" type="text" @click.native="engineeCharge(scope.row)">收费</el-button>
            <span v-if="scope.row.chargeFlag ==0">|</span>
            <el-button v-if="scope.row.chargeFlag ==1" type="text" @click="invoice(scope.row)">开票</el-button>
            <span v-if="scope.row.chargeFlag ==1">|</span>
            <!--el-button type="text" @click="Print(scope.row)">收据</el-button-->
            <!-- <span>|</span>
            <el-button type="text">详情</el-button> -->

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
</template>
<script>
export default {
  name: "EngineeringFees",
  props: ['editNeedData','showOpertions'],
  components: {
  },
  data() {
    return {
      Notdisabled:false,
      tableShow: false,
      maxHeight: 0,
      callVisible:false,
      formData:{
        invoiceType:"",
        invoiceCode:"",
        invoiceNo:"",
        id:"",
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '账务中心', path: '/FinancialCenter' },
          { title: '柜台收费', method: () => { window.histroy.back() } },
          { title: '工程类收费', method: () => { window.histroy.back() } }
        ],
      },
      tableQuery: {
        beginDate: '',
        endDate: '',
        billNo: '',//单据编号
        billType: '',//单据类型
        chargeFlag: '',//
      },
      id:"",
      // 是否缴费
      chargingFlagOptions: [{ name: '是', value: 1 }, { name: '否', value: 0 }],
      // 单据类型存值
      billTypeOptions: [{receiptName:"用水咨询",receiptNo:"PJ_CONSULT"},{receiptName:"用水安装",receiptNo:"PJ_INSTALL"}],
      //数据字典存值
      dictionaryData: [],
      //日期段
      dataList: [this.common.date(-30 * 24 * 60 * 60 * 1000), this.common.date()],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableData: {},
      tableTotal:{},
    }
  },
  mounted() {
    this.tableQuery.beginDate = this.dataList[0]
    this.tableQuery.endDate = this.dataList[1]
    this.init();
    //this.getBillTypeOptions();
    this.getDictionary();
     this.common.changeTable(this, ".EngineeringFees", [
          ".EngineeringFees .toolbar",
          ".EngineeringFees .block",
        ]);
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this
      if(_this.editNeedData && _this.editNeedData.billNo!=null){
        _this.tableQuery.billNo=_this.editNeedData.billNo
      }
      let params = {
        "busicode": "ProjectReceiptList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res.detail;
        _this.tableTotal = res.total;
        if(_this.showOpertions){//用水安装要求隐藏操作列
          _this.Notdisabled=true
        }
      })
    },
    // 获取日期框数据
    getDatePicker(date) { 
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计','','','','']
      for (const key in this.tableTotal) {
        if (key === 'receivableMoney') {
          arr.push(this.tableTotal[key])
        }else if(key === 'depositMoney'){
          arr.push(this.tableTotal[key])
        }else if(key === 'totalMoney'){
          arr.push(this.tableTotal[key])
        }
      }
      arr.push(['','','','','','',''])
      return arr
    },
    // 单据类型数据获取
    getBillTypeOptions() {
      var _this = this
      var params = {
        "busicode": "ReceiptList",
        "data": {
          pageCount: 100
        },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.billTypeOptions = res.list
      })
    },

    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPC,BPP,GCT"//缴费渠道、缴费方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 收费
    engineeCharge(row) {
      var _this = this
      var params = {
        "busicode": "ProjectReceiptCharge",
        "data": {
          "id": row.id,
          'payChannel': row.payChannel,
          'payWay': row.payWay,
        },
      }
      this.$confirm(`<p>确认收取单据编号:<span class="no">${ row.billNo }</span></p><p>合计:<span class="price">${ row.totalMoney }</span>元</p>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'ensureFee',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.$notify({
            title: '成功',
            message: '收费成功',
            type: 'success'
          });
          _this.init();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消收费'
        });
      });
    },
    search() {  //查询
      this.init()
    },
    // 发票按钮
    invoice(row) {
      this.id=row.id
      this.formData.invoiceType=row.invoiceType
      this.formData.invoiceNo=row.invoiceNo
      this.formData.invoiceCode=row.invoiceCode
      this.callVisible=true
    },
    submitInvoice(){
      let _this = this
      let params = {
        busicode: "ProjectReceiptInvoice",
        data: {
          id: this.id,
          invoiceNo:this.formData.invoiceNo,
          invoiceType:this.formData.invoiceType,
          invoiceCode:this.formData.invoiceCode,
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.closeOpenFlag();
          this.init()
          _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
        })
    },
    // 收据按钮
    Print(row) {
      let _this = this
      let params = {
        busicode: "ProjectReceiptPrint",
        data: {
          id: row.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {

          _this.common.print('print', 'ProjectReceiptPrint', '', res, this);
        })
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
      return (index + 1)
    },
    closeDialog() { //关闭会话
      this.backfillVisible = false
      this.crumbsData.titleList.splice(3, 1);
      this.init()
    },
    closeOpenFlag(){
      this.callVisible=false
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childEngineeringFees.submit()
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
  },
}
</script>
<style lang="scss" scoped>
.EngineeringFees {
  width: 100%;
  height: 100%;
  .el-dropdown {
    color: #1f9fff;
  }
  .el-table .el-input__inner{
    padding-right:0!important;
  }

}  
.el-input--mini .el-input__inner{
  width: 180px;
}
.ensureFee {
  .el-message-box__message {
    p {
      font-size: 18px;
      line-height: 30px;
      .no {
        color: #1f9fff;
        margin: 0 4px;
      }
      .price {
        color:#F56C6C;
        margin: 0 4px;
      }
    }
  }
}
</style>
