
<template>
    <div class="FlowingDate">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

            <el-form-item class="form-left">

              <el-form-item label='账期：'>
                <el-date-picker 
                v-model="DateChoosevalue" 
                value-format="yyyyMM" 
                clearable type="monthrange" 
                range-separator="至" 
                start-placeholder="开始账期" end-placeholder="结束账期">
                </el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
              </el-form-item>

            </el-form-item>
          </el-form>
        </div>

         <div class="kl-table">
            <el-table  stripe center border :data="tableData.list" class="change-tables-table">


              <el-table-column type="index" label="NO." width="50"  :index="indexMethod">
              </el-table-column>

              <el-table-column prop="userNo" min-width="180" label="用户编号">
              </el-table-column>

              <el-table-column prop="payTime" min-width="180" label="收款时间">
              </el-table-column>

              <!-- <el-table-column prop="code" min-width="180" label="项目">
              </el-table-column> -->

              <el-table-column prop="payMoney" min-width="100" label="收费金额">
              </el-table-column>

              <el-table-column prop="currendPeriodMoney" min-width="100" label="本期余额">
              </el-table-column>
              
              <el-table-column prop="chargingStaff" min-width="100" label="收费员">
              </el-table-column>

              <el-table-column prop="comments" min-width="180" label="备注">
              </el-table-column>

            </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="1" :page-sizes="[20, 100, 500, 1000]" 
            :page-size="20" layout="total, sizes, prev, pager, next, jumper" 
            :total="tableData.total">
            </el-pagination>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name:"FlowingDate",
  props: ['accountNoData'],
  data(){
    return{
      DateChoosevalue:[],
      tableData:[],
      FlowingTableVisible:true,
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountNo: "",
        beginDate: "",
        endDate: ""
      },
    }
  },
  mounted() {
    this.init();
  },
    
  methods: {
    init() {
      if (this.DateChoosevalue == null) {
        this.tableQuery.beginDate = '';
        this.tableQuery.endDate = '';
      } else {
        this.tableQuery.beginDate = this.DateChoosevalue[0];
        this.tableQuery.endDate = this.DateChoosevalue[1];
      }
      this.tableQuery.accountNo = this.accountNoData
      let _this = this
      let data = _this.tableQuery
      let params = {
        "busicode": "AccountFlowList",
        "data":_this.tableQuery
      }
      _this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    
    indexMethod(index) {
      return (index + 1);

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

    demand() {  //查询
      this.init()
    },
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
 @import "../../../assets/styles/scss/base/fn";

  $imgWidth: 200px;
$theme-color:#297acc;
.FlowingDate{
    height: 100%;
    margin: 0 auto;
}
</style>
