

<template>
    <div class="InvoiceBorrowingEdit">

        <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item class="form-left">
            <el-form-item label='调用时间：'>
              <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" format="yyyy-MM-dd" 
                value-format="yyyy-MM-dd" range-separator="至"  
                :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="调用人：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.invokeName" placeholder="请输入调用人："></el-input>
            </el-form-item>

            <el-form-item label="所属人：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.formerName" placeholder="请输入所属人："></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

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

          <el-table-column prop="invokeName" min-width="100" label="调用人">
          </el-table-column>

          <el-table-column prop="formerName" min-width="80" label="所属人">
          </el-table-column>

          <el-table-column prop="invokeTime" min-width="100" label="调用时间">
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="tableQuery.page" 
            :page-sizes="[20, 100, 500, 1000]" 
            :page-size="tableQuery.pageCount" 
            layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>

    </div>
</template>
<script>
export default {
    name:"InvoiceBorrowingEdit",
    data(){
        return{
            tableData:{},
            tableQuery:{
                page: 1,
                pageCount: 20,
            },
            tableTime:['',''],
            maxHeight:0,
        }
    },
    mounted(){
        this.init();
        this.common.changeTable(this, ".InvoiceBorrowingEdit", [
            ".toolbar",
            ".block",
            ".kl-table",
        ]);
    },
    methods:{
        init(){
            let _this = this
            let params = {
                "busicode": "FnInvoiceRentHistoryList",
                "data": this.tableQuery,
            }
            this.$api.fetch({
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
        //分页
        handleSizeChange(val) {
            //显示多少数据一页
            this.tableQuery.pageCount = val
            this.tableQuery.page = 1
            this.init();
        },
        handleCurrentChange(val) {
            //显示多少页码
            this.tableQuery.page = val
            this.init();
        },
        indexMethod(index) {
        //获取表格序号

            return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
        },
        demand() {
        //查询
        this.tableQuery.page = 1
        this.tableQuery.pageCount = 20
        this.init();
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
<style lang="scss">
$theme-font-color:#3680CD;
.InvoiceBorrowingEdit{

  width: 100%;
  height: 100%;
  .CallDialog {
    .el-dialog {
      width: 50% !important;
      height: 40% !important;
      .formBill {
        padding: 10px;
        .el-form-item {
          width: 80%;
        }
      }
    
  }
}

}
</style>

