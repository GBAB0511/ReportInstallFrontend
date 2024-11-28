
<template>

  <div class="InvoiceAcquisition">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="InvoiceAcquisitionVisible">
        <el-button size="mini" type="primary" @click.native="saveInvoice()">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="indexContent" v-if="InvoiceAcquisitionVisible">
      <InvoiceAcquisitionEdit ref="InvoiceAcquisitionEdit"
      :rowData="row"
      ></InvoiceAcquisitionEdit>
    </div>
    <div class="indexContent" v-if="InvoiceAcquisitionShow">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
            <el-form-item label='注册年份：'>
              <el-date-picker v-model="tableTime" @change="getDatePicker" type="monthrange" format="yyyy-MM" value-format="yyyyMM" range-separator="至"  :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="营业区域：" class="width-150">
              <!--el-select v-model="tableQuery.businessabode"  clearable size="mini"  >
                <el-option v-for="item in businessAbodeOptions"  :key="item.value" :label="item.name" :value="item.id"> </el-option>
              </el-select-->
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessabode" :options="businessAbodeOptions" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>


            <el-form-item label="模糊查询：" class="width-150">
              <el-tooltip class="item" effect="dark" content="发票代码/领用人" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="发票代码/领用人" clearable @keydown.enter.native="demand"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="invoiceTypeName" min-width="100" label="票据类型">
          </el-table-column>

          <el-table-column prop="regMonth" min-width="80" label="注册年份">
          </el-table-column>
          <el-table-column prop="businessAbodeName" min-width="80" label="营业区域">
          </el-table-column>

          <el-table-column prop="invoiceCode" min-width="80" label="发票代码">
          </el-table-column>

          <el-table-column prop="invoiceBeginNum" min-width="100" label="开始号码">
          </el-table-column>

          <el-table-column prop="invoiceEndNum" min-width="100" label="结束号码">
          </el-table-column>

          <el-table-column prop="invoiceAmount" min-width="100" label="发票数量" align="right">
          </el-table-column>

          <el-table-column prop="uinvoiceAmount" min-width="80" label="已用数量" align="right">
          </el-table-column>

          <el-table-column prop="useAmount" min-width="80" label="领用次数" align="right">
          </el-table-column>

          <el-table-column prop="getInvoiceStaff" min-width="80" label="领用人">
          </el-table-column>

          

          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
             <el-button type="text" v-if="Number(scope.row.invoiceAmount) > Number(scope.row.uinvoiceAmount)" @click.native="Acquisition(scope.row)">领用</el-button>
             <el-button type="text" v-if="Number(scope.row.uinvoiceAmount) > 0 " @click.native="deleteRow(scope.row)">取消</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" 
          :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" 
          :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import InvoiceAcquisitionEdit from "./InvoiceAcquisitionEdit";
export default {
  name: "InvoiceAcquisition",
  components: {
    InvoiceAcquisitionEdit
  },
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
          { title: "票据领用" }
        ]
      },

      tableData:[],
      tableQuery: {
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginTime:'',
        endTime:'',
        businessabode:'',
        fuzzyQuery:'',
      },
      businessAbodeOptions:[],
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
        list:[

        ]
      },
      InvoiceAcquisitionVisible: false, //综合查询的显示和隐藏
      InvoiceAcquisitionName: "票据领用-领用",
      InvoiceAcquisitionShow: true,
      row:"",
      tableTime: ["", ""],
    };
  },
  mounted() {
    this.selectBAbodeOptions();
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".InvoiceAcquisition", [
      ".InvoiceAcquisition .toolbar",
      ".InvoiceAcquisition .block",
      ".InvoiceAcquisition #crumbs"
    ]);
  },
  methods: {
   enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.cascader.dropDownVisible = false
         }
    },
    init() {
      let _this = this;
      this.tableQuery.businessabode=this.common.handleTreeData(this.tableQuery.businessabode)
      let params = {
          "busicode": "FnInvoiceUseList",
          "data": _this.tableQuery,
      }
      _this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.tableData = res; 
      })
    },
    deleteRow(row) {
      this.$confirm("是否确认取消领用?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = {
            "busicode": "FnInvoiceCancle",
            "data": {
              id:row.invoiceRegId,
              invoicebeginnum:row.invoiceBeginNum,
              invoiceendnum:row.invoiceEndNum
            }
           }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$notify({
              title: '成功',
              message: '领用已成功取消',
              type: 'success'
            });
            this.closeDialog();
          })
        })
        .catch(() => {
          this.$notify({
              title: '取消',
              message: '取消成功',
              type: 'warning'
            });
        });
    },
    saveInvoice(){
      let _this=this;
      var beginNum=Number(_this.$refs.InvoiceAcquisitionEdit.DefaultData.invoiceBeginNum);
      var endNum=Number(_this.$refs.InvoiceAcquisitionEdit.DefaultData.invoiceEndNum);
      var minNum=Number(_this.$refs.InvoiceAcquisitionEdit.beginNum);
      var maxNum=Number(_this.$refs.InvoiceAcquisitionEdit.endNum);
      if(beginNum<minNum || beginNum>maxNum || endNum<minNum || endNum>maxNum){
        this.$notify({
            title: '警告',
            message: '号码不能小于'+minNum+',或大于'+maxNum,
            type: 'warning'
        });
        return false;
      }
      if(endNum-beginNum+1<=0){
        this.$notify({
            title: '警告',
            message: '发票数量必须大于0',
            type: 'warning'
        });
        return false;
      }
      let params = {
          "busicode": "FnInvoiceUse",
          "data": {
              "getInvoiceStaff":_this.$refs.InvoiceAcquisitionEdit.DefaultData.getInvoiceStaff,
              "invoicecode":_this.$refs.InvoiceAcquisitionEdit.DefaultData.invoiceCode,
              "invoicebeginnum":_this.$refs.InvoiceAcquisitionEdit.DefaultData.invoiceBeginNum,
              "invoiceendnum":_this.$refs.InvoiceAcquisitionEdit.DefaultData.invoiceEndNum,
              "invoiceamount":_this.$refs.InvoiceAcquisitionEdit.DefaultData.invoiceAmount,
              "id":_this.$refs.InvoiceAcquisitionEdit.DefaultData.id,
          }
          //_this.$refs.InvoiceAcquisitionEdit.DefaultData,
      }
      _this.$api.fetch({
        params: params,//参数
      }).then(res => {
         this.$notify({
          title: '成功',
          message: '领用成功',
          type: 'success'
        });
        this.closeDialog();
      })
    },
    Acquisition(row){
      let _this=this;
      _this.row=row;
      _this.InvoiceAcquisitionVisible=true;
      _this.InvoiceAcquisitionShow=false;
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
    demand() {
      this.tableQuery.pageCount = 20
      this.tableQuery.page = 1
      this.init();
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
      this.InvoiceAcquisitionVisible = false;
      this.backfillVisible = false;
      this.InvoiceAcquisitionShow = true;
      // this.crumbsData.titleList.splice(3,1);

      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childInvoiceAcquisition.submit();
      // this.InvoiceAcquisitionVisible = false;
    },
    add() {
      this.InvoiceAcquisitionVisible = true;
      this.InvoiceAcquisitionShow = false;
      // this.$set(this.crumbsData.titleList,"3",{title:'领用',method:()=>{window.histroy.back()}})
    },
    edit() {}
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
.InvoiceAcquisition {
  width: 100%;
  height: 100%;
}
</style>
