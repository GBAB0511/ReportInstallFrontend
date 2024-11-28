<template>
  <!-- 污水发票汇总 -->
  <div class="WSInvoiceSummay">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <div class="bread-contain-right">
        <!--<el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>-->
      </div>
    </div>
    <div v-if="indexShow" class="company-content">
      <!-- index页面 -->
      <div  class=" index-page">
        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item class="form-left">
            <el-form-item label="开始号码：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.beginInvoiceNo" placeholder="" @keydown.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="结束号码：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endInvoiceNo" placeholder="" @keydown.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="发票代码：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.invoiceCode" placeholder="" @keydown.enter.native="search"></el-input>
            </el-form-item>

            <el-form-item label="收费情况：" >
            <el-select ref="select1" v-model="tableQuery.noCharging" placeholder="请选择">
              <el-option label="所有情况" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
              </el-form-item>

            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table">
          <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight"  stripe border :data="tableData" class="WSInvoiceSummay-table">


            <el-table-column prop="costName" min-width="80" label="收费项目">
            </el-table-column>

            <el-table-column prop="water" min-width="60" label="数量">
            </el-table-column>

            <el-table-column prop="price" min-width="60" label="单价">
            </el-table-column>

            <el-table-column prop="money" min-width="60" label="金额">
            </el-table-column>

           
          </el-table>
           <table el-table total-table>
              <tr>
                <td class="table-td"  colspan="2">开票总数: {{amount.totalAmount}}</td>
              </tr>
              <tr>
                <td class="table-td"  colspan="2">有效发票: {{amount.zcAmount}}</td>
              </tr>
              <tr>
                <td class="table-td"  colspan="2">作废发票: {{amount.zfAmount}}</td>
              </tr>
              <tr>
                <td class="table-td"  colspan="2">红字发票: {{amount.hzAmount}}</td>
              </tr>
   
          </table>
          <!-- 分页 
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WSInvoiceSummay",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,


      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        beginInvoiceNo: '',
        endInvoiceNo: '',
        invoiceCode:'',
        noCharging:''
      },
      amount:{},
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "污水发票汇总" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')

    this.common.changeTable(this, ".WSInvoiceSummay", [
      ".WSInvoiceSummay .toolbar",
      ".WSInvoiceSummay .block",
      ".WSInvoiceSummay #crumbs"
    ]);
  },
  methods: {
        enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "WSInvoiceReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        console.log(res)
        _this.tableData = res.invoiceList
        _this.amount = res.amount

      })
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "WSInvoiceReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },

    // 查询
    search() {
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
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.WSInvoiceSummay {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
   .table-td{
    border-right:1px solid #EBEEF5;width:25%;text-align:center;
  }
}
</style>
