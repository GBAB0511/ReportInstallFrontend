


<template>

  <div class="InvoiceInvalidated ">
    <!-- 弹出表单还原选项 -->
    
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini"  :disabled="isAble" @click="sub('0')" type="primary">还原</el-button>
        <el-button size="mini"  :disabled="isAble" @click="sub('2')" type="primary">作废</el-button>
        <el-button size="mini"  @click="turnto" type="primary">修改</el-button>
      </div>
    </div>
    <div class="indexContent" >
    
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="发票号码：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.beginNum" placeholder="" @keydown.enter.native="demand"></el-input>
          </el-form-item>

          <el-form-item label="-">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endNum" placeholder="" @keydown.enter.native="demand"></el-input>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="发票号码" @keydown.enter.native="demand"></el-input>
          </el-form-item>
          <el-form-item label="增减值：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.addValue" placeholder="1" @keydown.enter.native="demand"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" ref = "multipleTable" @selection-change="onTableSelect" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="selection" width="50" fixed="left">
          </el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="invoiceCode" min-width="150" label="发票代码">
          </el-table-column>

          <el-table-column prop="invoiceTypeName" min-width="150" label="票据类型">
          </el-table-column>

          <el-table-column prop="invoiceStatusName" min-width="80" label="发票状态">
          </el-table-column>


          <el-table-column prop="amountMoney" min-width="80" label="总金额" align="right">
          </el-table-column>

          <el-table-column prop="invoiceNo" min-width="100" label="发票号码">
          </el-table-column>

          <el-table-column prop="ninvoiceNo" min-width="100" label="新发票号码">
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination 
              v-if="flag"
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :current-page="tableQuery.page" 
              :page-sizes="[20, 100, 500, 1000]" 
              :page-size="tableQuery.pageCount" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="tableData.total">
            </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "InvoiceInvalidated",
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "票据管理" },
          { title: "票据修改" }
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
      DateChoosevalue: [],
      tableShow: false,
      tableQuery: {
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginNum:"",
	      endNum:"",
        fuzzyQuery:"",
        addValue:"1",
      },
      isAble:true,
      callVisible:false,
      tableData:{},
      maxHeight: 0,
      InvoiceInvalidatedVisible: true, //综合查询的显示和隐藏
      flag: true
    };
  },
  mounted() {
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".InvoiceInvalidated", [
        ".InvoiceInvalidated .toolbar",
        ".InvoiceInvalidated .block",
        ".InvoiceInvalidated #crumbs"
      ]);
    })
    
  },
  methods: {
    init() {
      let _this = this
      let params = {
          "busicode": "FnInvoiceList",
          "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.tableData = res;
      })
    },
    turnto(){
      if(!this.tableData.list){
        this.$notify({
              title: '警告',
              message: '未获取到列表数据，修改失败',
              type: 'error'
          });
        return
      }
      this.$confirm("确定修改列表上发票为新发票号码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.callVisible=false;
          let _this = this
          let params = {
              "busicode": "FnInvoiceUpdateNo",
              "data": this.tableData.list,
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.tableData = res; 
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
          });
            _this.init();
          })
          
        }).catch(() => {
          this.$notify({
              title: '取消',
              message: '取消成功',
              type: 'warning'
          });
        });
    },
    onTableSelect(rows,row){
      if(rows.length>0){
        this.isAble=false;
      }else{
        this.isAble=true;
      }
    },
    sub(Istatus){
      let tep;
      if(Istatus==="0"){
        tep="确认还原选中发票？"
      }else{
        tep="确认作废选中发票？"
      }
      let _this = this
      let data = _this.$refs.multipleTable.selection;
      for(let i=0;i<data.length;i++){
        let item = data[i];
        if(Istatus==="2" && item.invoiceStatus==="2"){
          this.$notify({
            title: '警告',
            message: '已作废发票不可再次作废，请检查',
            type: 'warning'
          });
          return;
        }
      }
      this.$confirm(tep, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          
          this.callVisible=false;
          
          let params = {
              "busicode": "FnInvoiceUpdate",
              "data": {
                "status":Istatus,
                "list": data
              },
          }
          this.flag = false
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.tableData = res; 
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
          });
          this.flag = true
            _this.init();
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
    demand() {
      let _this=this;
      //查询
      if(Object.keys(_this.tableQuery.beginNum).length==0 || Object.keys(_this.tableQuery.endNum).length==0){
        _this.$notify.error({
              title: '警告',
              message: '发票起始号码不能为空',
              type: 'error'
            });
      }else{
        _this.tableQuery.page=1;
        _this.tableQuery.pageCount=20;
        _this.init();
      }
      
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
      //return (
      //  (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1)
      //);
    },
    closeDialog() {
      //关闭会话
      this.InvoiceInvalidatedVisible=true;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childInvoiceInvalidated.submit();
      // this.InvoiceInvalidatedVisible = false;
    },
    add() {

      this.InvoiceInvalidatedVisible = false; //综合查询的显示和隐藏
      this.InvoiceRestorationVisiable=true;
      
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
.InvoiceInvalidated {
  width: 100%;
  height: 100%;
}
</style>
