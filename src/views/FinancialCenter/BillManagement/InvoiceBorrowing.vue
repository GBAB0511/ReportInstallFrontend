

<template>

  <div class="InvoiceBorrowing">
    <!-- 弹出表单编辑 -->

    <!-- 弹出表单用户过户 -->
    <el-dialog title="调用" :visible.sync="callVisible" :close-on-click-modal="false" class="CallDialog" @close="closeDialog">

      <el-form class="formBill " :inline="true" size="mini" label-width="130px" :model="formData">
        <el-form-item label="开始号码：">
          <el-input v-model="formData.rinvoiceBeginNum" placeholder="请输入开始号码" @input="changeNum"></el-input>
        </el-form-item>
        <el-form-item label="结束号码：">
          <el-input v-model="formData.rinvoiceEndNum" placeholder="请输入结束号码" @input="changeNum"></el-input>
        </el-form-item>
        <el-form-item label="发票数量：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.invoiceAmount" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="submit">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="InvoiceBorrowingVisible">
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button type="primary" size="mini" @click="UseList">调用历史</el-button>
      </div>
    </div>
    <div class="indexContent" v-if="InvoiceBorrowingVisible">
      <InvoiceBorrowingEdit ref="childWarehousing"></InvoiceBorrowingEdit>
    </div>
    <div class="indexContent" v-if="InvoiceBorrowingShow">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='注册年份：'>
            <el-date-picker v-model="tableTime" @change="getDatePicker" type="monthrange" format="yyyy-MM" value-format="yyyyMM" range-separator="至"  :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="所属人：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.formerName" placeholder="所属人" @keydown.enter.native="demand"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="invoiceTypeName" min-width="100" label="票据类型">
          </el-table-column>

          <el-table-column prop="invoiceCode" min-width="80" label="发票代码">
          </el-table-column>
          <el-table-column prop="regMonth" min-width="80" label="注册年份">
          </el-table-column>

          <el-table-column prop="invoiceBeginNum" min-width="100" label="开始号码">
          </el-table-column>

          <el-table-column prop="invoiceEndNum" min-width="100" label="结束号码">
          </el-table-column>

          <el-table-column prop="invoiceAmount" min-width="100" label="发票数量" align="right">
          </el-table-column>

          <el-table-column prop="formerName" min-width="80" label="所属人">
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click.native="borrow(scope.row)">调用</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 
        <div class="block">
          <el-pagination @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="tableQuery.page" 
          :page-sizes="[20, 100, 500, 1000]" 
          :page-size="tableQuery.pageCount" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="tableData.total">
          </el-pagination>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import InvoiceBorrowingEdit from "./InvoiceBorrowingEdit";
export default {
  name: "InvoiceBorrowing",
  components: {
    InvoiceBorrowingEdit
  },
  data() {
    return {
      tableTime: ["", ""],
      tableQuery: {
        //page: 1,//当前页码
        //pageCount: 20,//当前页展示多少条数据
        beginTime:"",
	      endTime:"",
	      invokeName:"",
	      formerName:"",
      },
      
      tableData:{},
      callVisible: false,
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "票据管理" },
          { title: "票据调用" }
        ]
      },
      formData: {
        rinvoiceBeginNum:0,
        rinvoiceEndNum:0,
        formerName:"",
        invoiceCode:"",
        invoiceAmount:0,
      },
      limit:{
        invoiceBeginNum:0,
        invoiceEndNum:0,
        invoiceAmount:0,
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      InvoiceBorrowingVisible: false, //综合查询的显示和隐藏
      InvoiceBorrowingName: "票据领用-领用",
      InvoiceBorrowingShow: true,
    };
  },
  mounted() {
    //this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".InvoiceBorrowing", [
          ".InvoiceBorrowing .toolbar",
          ".InvoiceBorrowing .block",
          ".InvoiceBorrowing #crumbs"
        ]);
    })
    
  },
  methods: {
    init() {
      let _this = this
      if(_this.tableQuery.formerName.length===0){
        _this.$notify({
            title: '警告',
            message: '请输入所属人查询',
            type: 'warning'
        });
        return;
      }
      let params = {
          "busicode": "FnInvoiceRentList",
          "data": _this.tableQuery,
      }
      _this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.tableData = res;
      })
    },
    UseList(){
      this.InvoiceBorrowingShow=false;
      this.InvoiceBorrowingVisible=true;
    },
    changeNum(){
      this.formData.invoiceAmount=this.formData.rinvoiceEndNum-this.formData.rinvoiceBeginNum+1;
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
      //this.tableQuery.page = 1
      //this.tableQuery.pageCount = 20
      this.init();
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      //this.tableQuery.pageCount = val
      //this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      //this.tableQuery.page = val
      this.init();
    },

    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      //return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return index+1;
      //return (
      //  (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1)
      //);
    },
    closeDialog() {
      //关闭会话
      this.InvoiceBorrowingVisible = false;
      this.backfillVisible = false;
      this.InvoiceBorrowingShow = true;
      this.callVisible = false;
      this.crumbsData.titleList.splice(3, 1);
      //this.init();
    },
    //弹出框
    submit() {
      //提交
      
      let _this = this
      // if(_this.formData.rinvoiceBeginNum==='' || _this.formData.rinvoiceEndNum===''){
      //       _this.$notify({
      //         title: '警告',
      //         message: '请输入需调用号码段',
      //         type: 'warning'
      //       });
      //       return false;
      //     }
      // if(_this.formData.rinvoiceBeginNum<_this.limit.invoiceBeginNum 
      //     || _this.formData.rinvoiceEndNum>_this.limit.invoiceEndNum 
      //   ){
      //   _this.$notify({
      //       title: '警告',
      //       message: '号码不能小于'+_this.limit.invoiceBeginNum +',或大于'+_this.limit.invoiceEndNum ,
      //       type: 'warning'
      //   });
      //   return false;
      // }
      if( _this.formData.invoiceAmount<=0 || 
            _this.limit.invoiceEndNum-_this.limit.invoiceBeginNum+1<_this.formData.invoiceAmount){
        _this.$notify({
            title: '警告',
            message: '发票数量不能小于0或大于可调用发票数',
            type: 'warning'
        });
        return false;
      }
      let params = {
          "busicode": "FnInvoiceRent",
          "data": _this.formData,
      }
      _this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.$notify({
          title: '成功',
          message: '调用成功',
          type: 'success'
        });
         _this.closeDialog();
      })
      // this.InvoiceBorrowingVisible = false;
    },
    add() {
      this.InvoiceBorrowingVisible = true;
      this.InvoiceBorrowingShow = false;
      this.$set(this.crumbsData.titleList, "3", { title: "借用" });
    },
    borrow(row) {
      this.formData.rinvoiceBeginNum=row.invoiceBeginNum;
      this.formData.rinvoiceEndNum=row.invoiceEndNum;
      this.formData.formerName=row.formerName;
      this.formData.invoiceCode=row.invoiceCode;
      this.formData.invoiceAmount=this.formData.rinvoiceEndNum-this.formData.rinvoiceBeginNum+1;
      this.limit.invoiceBeginNum=row.invoiceBeginNum;
      this.limit.invoiceEndNum=row.invoiceEndNum;
      this.limit.invoiceAmount=this.formData.invoiceAmount;
      this.callVisible = true;
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
.InvoiceBorrowing {
  width: 100%;
  height: 100%;
  .CallDialog {
    .el-dialog {
      //width: 50% !important;
      //height: 40% !important;
      .formBill {
        //padding: 10px;
        .el-form-item {
          width: 80%;
        }
      }
    }
  }
}
</style>
