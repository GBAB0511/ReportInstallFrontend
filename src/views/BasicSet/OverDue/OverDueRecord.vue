<template>
  <div class="overDueRecord">
      
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>
      <div class="index-page">
        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">

            <el-form-item label="单据类型：" class="width-200">
              <!--el-input v-model="tableQuery.fuzzyQuery" placeholder="" clearable></el-input-->
              <el-select ref="select1" v-model="tableQuery.fuzzyQuery" placeholder="请选择">
                <el-option v-for="item in billData" :key="item.receiptName"  :label="item.receiptName" :value="item.receiptName"></el-option>
              </el-select>
            </el-form-item>

          
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">

          <el-table class="record-table" border stripe :data="tableData.list" :max-height="maxHeight">

            <el-table-column min-width="45" type="index" fixed="left" label="No."></el-table-column>
            <el-table-column prop="receiptName" min-width="80" label="单据类型"></el-table-column>
            <el-table-column prop="billNo" min-width="80" label="单据编号"></el-table-column>
            <el-table-column prop="billDate" min-width="80" label="单据日期"></el-table-column>
            <el-table-column prop="delayDays" min-width="80" label="延时天数"></el-table-column>
            <el-table-column prop="processState" min-width="80" label="审核状态"></el-table-column>

          </el-table>
        </div>
         <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]"  layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
      </div>
  </div>
</template>
<script>

export default {
  name: "overDueRecord",
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '流程超时配置', method: () => { window.histroy.back() } },
          { title: '超时记录', method: () => { window.histroy.back() } }
        ],
      },
      tableData: {},
      maxHeight: 0,
      tableShow: false,
      tableData:[
      ],
      tableQuery:{
        page:1,
        pageCount:20,
        fuzzyQuery:'',
      },
      formType:"",
      billData:[],
    }
  },
  mounted() {
    this.init();
    this.getReceiptType();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.overDueRecord', ['.overDueRecord .block','.overDueRecord .toolbar','.overDueRecord .bread-contain'])
    })
  },
  methods: {
       enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let _this = this
      // let params = {
      //     "busicode": "ProcessTimeConfigList",
      //     "data": this.tableQuery,
      // }
      let params = {
          "busicode": "WaterProcessOverDueRecordList",
          "data": this.tableQuery,
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
        console.log(res)
          _this.tableData = res;
      })
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "WaterProcessOverDueRecordExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
     changeReceipt(item) {

      this.tableQuery.fuzzyQuery = item.receiptName
      //this.tableQuery.receiptNo = item.receiptNo
    },
    //获取单据类型
    getReceiptType() {
      let _this = this
      let params = {
          "busicode": "ReceiptSelect",
          "data": {}
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
          _this.billData = res;        
      })
    },
     // 搜索
    search(){
      this.tableQuery.page = 1;
      this.init()
    },
      // 列表的NO列
      indexMethod(index) {
        return (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      },
      handleSizeChange(val) { //显示多少数据一页
        this.tableQuery.pageCount = val;
        this.tableQuery.page = 1;
        this.init();
      },
      handleCurrentChange(val) {  //页码点击
        this.tableQuery.page = val;
        this.init();
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
.overDueRecord {
  width: 100%;
  height: 100%;
  .overDueRecordIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>
