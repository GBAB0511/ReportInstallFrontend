
<template>

  <div class="InvoiceSearch">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>
    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" label-width="80px">
          <el-form-item label="营业区域：">
              <!--el-select v-model="tableQuery.businessabode"  clearable size="mini"  >
                <el-option v-for="item in businessAbodeOptions"  :key="item.value" :label="item.name" :value="item.id"> </el-option>
              </el-select-->
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessabode" :options="businessAbodeOptions" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>

          <el-form-item label="领用人：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.owerName" placeholder="请输入领用人"></el-input>
          </el-form-item>

           <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable placeholder="发票代码/发票号码" @keydown.enter.native="demand"></el-input>
          </el-form-item>

          <el-form-item class="button-group">
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

          <div v-show="isActive" class="advancedQuery">
            <el-form-item label="发票号码：" class="width-150">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.invoiceBeginNum" placeholder="" clearable @keydown.enter.native="demand"></el-input>
            </el-form-item>
            <el-form-item label="-" label-width="10px" class="width-150 linkLabel">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.invoiceEndNum" placeholder="" clearable @keydown.enter.native="demand"></el-input>
            </el-form-item>
            <el-form-item label="发票状态：">
            <el-select ref="select1" clearable v-model="tableQuery.invoiceStatus" placeholder="发票状态">
              <el-option v-for="(item,index) in dictionaryData.IVS" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="是否交票：">
              <el-select ref="select2" clearable v-model="tableQuery.putInvoiceFlag" placeholder="是否交票">
                <el-option v-for="(item,index) in PutFlag" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="票据类型：" class="width-150">
            <el-select ref="select3" v-model="tableQuery.invoicetype" size="mini" clearable>
                  <el-option v-for="item in invoiceType" :key="item.invoiceNo" :label="item.invoiceName" :value="item.invoiceNo"></el-option>
              </el-select>
          </el-form-item>
          </div>
         <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>

      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" show-summary :summary-method="getTotal">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="businessAbodeName" min-width="100" label="营业区域">
        </el-table-column>

        <el-table-column prop="owerName" min-width="100" label="领用人">
        </el-table-column>

        <el-table-column prop="invoiceTypeName" min-width="80" label="票据类型">
        </el-table-column>
        
        <el-table-column prop="invoiceCode" min-width="100" label="发票代码">
        </el-table-column>

        <el-table-column prop="invoiceNo" min-width="100" label="发票号码">
        </el-table-column>

        <el-table-column prop="invoiceStatusName" min-width="100" label="发票状态">
        </el-table-column>

        <el-table-column prop="putInvoiceFlagName" min-width="80" label="是否交票">
        </el-table-column>

        <el-table-column prop="openInvoiceStaff" min-width="80" label="交票人">
        </el-table-column>

        <el-table-column prop="openInvoiceTime" min-width="100" label="交票时间" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="amountMoney" min-width="80" label="总金额" align="right">
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
  name: "InvoiceSearch",
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "票据管理" },
          { title: "票据查询" }
        ]
      },
      tableQuery:{
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        businessabode:"",
        owerName:"",
        invoicetype:"",
        invoiceStatus:"",
        putInvoiceFlag:"",
        invoiceBeginNum:"",
        invoiceEndNum:"",
        fuzzyQuery:""
      },
      invoiceType:{},
      tableData:[],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dictionaryData:[],
      isActive:"",
      businessAbodeOptions:[],
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      InvoiceSearchVisible: false, //综合查询的显示和隐藏
      totalData: {}, // 合计
      PutFlag:[
        {"name":"未交票","value":"0"},
        {"name":"已交票","value":"1"},
      ],
    };
  },
  mounted() {
    this.selectBAbodeOptions();
    this.getDictionary();
    this.getInvoiceType();
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".InvoiceSearch", [
      ".InvoiceSearch .toolbar",
      ".InvoiceSearch .block",
      ".InvoiceSearch #crumbs",
      ".InvoiceSearch .toggle-btn"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
           this.$refs.cascader.dropDownVisible = false
         }
    },
    init() {
      let _this = this
      this.tableQuery.businessabode=this.common.handleTreeData(this.tableQuery.businessabode)
      let params = {
          "busicode": "FnInvoiceSearchList",
          "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.tableData = res.detail;
         _this.totalData = res.totalSum;
      })
    },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
           $('.el-table--fit').css('height', '66%');
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
      this.$nextTick(() => {
        this.common.changeTable(this, ".InvoiceSearch", [
          ".InvoiceSearch .toolbar",
          ".InvoiceSearch .block",
          ".InvoiceSearch #crumbs",
          ".InvoiceSearch .toggle-btn"
        ]);
      })
    },
    //营业所
    selectBAbodeOptions() {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAbodeOptions = res.children;
      })
    },
    //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    // 获取发票类型
    getInvoiceType() {
      var _this = this
      var params = {
        "busicode": "InvoiceTypeList",
     }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.invoiceType= res
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BBT,IVS"
        }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    demand() {
      //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    //   导出
    exportExcel() {
      let data = JSON.parse(JSON.stringify(this.tableQuery));
      data.pageCount=999999;
      data.page=1;
        let params = {
          "busicode": "FnInvoiceExport",
          "data": data,
          token: sessionStorage.getItem('token'),
          sysType: '002'
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
      this.InvoiceSearchVisible = false;
      this.backfillVisible = false;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childInvoiceSearch.submit();
      // this.InvoiceSearchVisible = false;
    },
    add() {
      this.InvoiceSearchVisible = true;
    },
    edit() {},
    // 合计
    getTotal (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((item, index) => {
        if(index == 0){
          sums[index] = "合计";
        }else if(index != 0){
          for(let key in this.totalData){
            if(item.property == key){
              sums[index] = this.totalData[key];
            }
          }
        }
      })
      return sums;
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
<style lang="scss" scoped>
.InvoiceSearch {
  width: 100%;
  height: 100%;
  .kl-table{
    margin-top: 15px;
  }
}
</style>

<style lang="scss">
.InvoiceSearch{
  .linkLabel{
    .el-form-item__content{
        margin-left: 10px !important;
    }
  }
}
</style>