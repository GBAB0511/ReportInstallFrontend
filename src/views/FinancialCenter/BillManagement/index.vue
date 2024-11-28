

<template>
  <div class="BillManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="BillManagementVisible">
        <el-button v-if="status!=1" size="mini" type="primary" @click="save()">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="BillManagementCon">
        <el-button icon="el-icon-plus" size="mini" @click="add()" type="primary">添加</el-button>
      </div>
    </div>
    <div class="indexContent" v-if="BillManagementVisible">
      <BillManagementEdit ref="BillManagementEdit" :rowData="rowData" :indexAddDate="indexAddDate" :status="status"></BillManagementEdit>
    </div>
    <div class="indexContent" v-if="BillManagementCon">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="票据类型：" class="width-150">
            <el-select  ref="select1" clearable v-model="tableQuery.invoicetype" placeholder="票据类型">
              <el-option
                v-for="item in invoiceType"
                :key="item.invoiceNo"
                :label="item.invoiceName"
                :value="item.invoiceNo"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="营业区域：" class="width-150">
            <!--el-select v-model="tableQuery.businessabode" clearable size="mini">
              <el-option
                v-for="item in businessAbodeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select-->
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessabode" :options="businessAbodeOptions" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          :data="tableData.list"
          highlight-current-row
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="invoicetypename" min-width="100" label="票据类型"></el-table-column>

          <el-table-column prop="businessabodename" min-width="100" label="营业区域"></el-table-column>

          <el-table-column prop="regmonth" min-width="80" label="年份"></el-table-column>

          <el-table-column prop="invoicecode" min-width="120" label="票据代码"></el-table-column>

          <el-table-column prop="invoicebeginnum" min-width="100" label="开始编号"></el-table-column>

          <el-table-column prop="invoiceendnum" min-width="100" label="结束编号"></el-table-column>

          <el-table-column prop="invoiceamount" min-width="80" label="总张数" align="right"></el-table-column>

          <el-table-column prop="useAmount" min-width="80" label="领用次数" align="right"></el-table-column>

          <el-table-column prop="createname" min-width="80" label="建立人"></el-table-column>

          <el-table-column prop="createtime" min-width="80" label="建立时间" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" v-if="Number(scope.row.useAmount)>0?false:true" @click.native="detail(scope.row)">编辑</el-button>
              <el-button class="btn-color" type="text" v-if="Number(scope.row.useAmount)>0?false:true" @click.native="deleteRow(scope.row)">删除</el-button>
              <el-button type="text" v-if="Number(scope.row.useAmount)>0?true:false" @click.native="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import BillManagementEdit from "./BillManagementEdit";
export default {
  name: "BillManagement",
  components: {
    BillManagementEdit
  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      indexAddDate: "",
      rowData: "",
      dictionaryData: [],
      businessAbodeOptions: [],
      tableData: [],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "票据管理" },
          { title: "票据注册" }
        ]
      },
      tableQuery: {
        page: 1, //当前页码
        pageCount: 20, //当前页展示多少条数据
        invoicetype: "",
        businessabode: ""
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      invoiceType: {},
      BillManagementVisible: false, //综合查询的显示和隐藏
      BillManagementCon: true,
      status:0,
    };
  },
  mounted() {
    this.init();
    this.selectBAbodeOptions();
    this.getDictionary();
    this.getInvoiceType();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".BillManagement", [
      ".BillManagement .toolbar",
      ".BillManagement .block",
      ".BillManagement #crumbs"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.cascader.dropDownVisible = false
         }
    },
    init() {
      let _this = this;
      this.tableQuery.businessabode=this.common.handleTreeData(this.tableQuery.businessabode)
      let params = {
        busicode: "FnInvoiceRegList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    // 获取发票类型
    getInvoiceType() {
      var _this = this;
      var params = {
        busicode: "InvoiceTypeList"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.invoiceType = res;
        });
    },
    save() {
      this.$refs.BillManagementEdit.save();
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
          _this.businessAbodeOptions = data.children;
        });
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
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "BBT"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },

    demand() {
      //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog() {
      //关闭会话
      this.BillManagementVisible = false;
      this.backfillVisible = false;
      this.BillManagementCon = true;
      this.init();
    },
    add() {
      this.rowData = "";
      this.indexAddDate = "add";
      this.status = 0 ;
      this.BillManagementVisible = true;
      this.BillManagementCon = false;
      // this.$set(this.crumbsData.titleList,"2",{title:'注册',method:()=>{window.histroy.back()}})
    },
    detail(row) {
      this.rowData = row.id;
      this.indexAddDate = "detail";
      if(Number(row.useAmount)>0){
        this.status=1;
      }else{
        this.status=0;
      }
      this.BillManagementVisible = true;
      this.BillManagementCon = false;
    },
    // 删除行
    deleteRow(row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = {
            busicode: "FnInvoiceRegDelete",
            data: {
              id: row.id
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success"
              });
              this.closeDialog();
            });
        })
        .catch(() => {
          this.$notify({
            title: "取消",
            message: "取消成功",
            type: "warning"
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
.BillManagement {
  width: 100%;
  height: 100%;
}
.btn-color{
  color:red;
}
</style>
