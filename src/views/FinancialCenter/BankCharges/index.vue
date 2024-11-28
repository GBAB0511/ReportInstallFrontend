<template>
  <div class="BankCharges">
    <!-- 银行代扣模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="SellOutVisible">
        <el-button type="primary" size="mini" @click="exportExcelSon();">确 定</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="invoiceVisible">
        <el-button @click="exportExcel" size="mini" type="primary">生成电子发票</el-button>
        <el-button @click="exportExcel" size="mini" type="primary">打印发票</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="BankChargesEditShow">
        <span style="font-size:14px">发送范围：</span>
        <el-radio @change="getCurrentSendType" v-model="sendType" label="1">勾选</el-radio>
        <el-radio @change="getCurrentSendType" v-model="sendType" label="2">全选</el-radio>
        <el-button size="mini" type="primary" @click="sending">发送短信通知</el-button>
        <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-show="BankChargesCon">
        <!-- <el-upload class="upload-demo" multiple action="/" :http-request="importExcel">
          <el-button icon="el-icon-download" size="mini" type="primary">农商行协议导入</el-button>
        </el-upload> -->
        <!-- <el-upload class="upload-demo" multiple action="/" :http-request="importOtherExcel">
          <el-button icon="el-icon-download" size="mini" type="primary">协议导入</el-button>
        </el-upload> -->
        <el-button size="mini" type="primary" @click="SellOutShow">出盘</el-button>
      </div>
    </div>
    <bankDetails ref="BankChargesEdit" :idCuster="idCuster" v-if="BankChargesEditShow"></bankDetails>
    <SellOut ref="SellOut" v-if="SellOutVisible"></SellOut>
    <invoice :idCuster="idCuster" v-if="invoiceVisible"></invoice>
    <!-- 代扣出盘 -->
    <div v-show="BankChargesCon" class="DeductionOffer">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <el-form-item label="出盘日期：">
            <el-date-picker
              v-model="DateChoosevalue"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              :picker-options="pickerOptions"
              :clearable="true"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="收费类型：">
            <el-select ref="select1" clearable v-model="tableQuery.chargingType" placeholder="银行代扣">
              <el-option
                v-for="(item,index) in chargingTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="回盘时间：">
            <el-date-picker
              v-model="BackDateChoosevalue"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              :picker-options="pickerOptions"
              :clearable="true"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="出盘银行：">
            <el-select ref="select1" clearable v-model="tableQuery.outBank" placeholder="出盘银行" >
              <el-option
                v-for="(item,index) in BankSelectOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <!--el-form-item label="营业所：">
            <el-select clearable v-model="tableQuery.businessAbode" placeholder="营业所">
              <el-option
                v-for="item in businessAbodeData"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item-->

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
          class="change-tables-table"
          highlight-current-row show-summary :summary-method='getTotal'
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="outBank" min-width="100" label="银行名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="chargingTypeName" min-width="80" label="收费类型"></el-table-column>

          <!--el-table-column prop="businessAbodeName" min-width="80" label="营业所"></el-table-column-->

          <el-table-column prop="outMoney" min-width="80" label="出盘金额" align="right"></el-table-column>

          <el-table-column prop="outAmount" min-width="80" label="出盘笔数" align="right"></el-table-column>

          <el-table-column prop="outTime" min-width="100" label="出盘时间" show-overflow-tooltip></el-table-column>

         <!-- <el-table-column prop="returnMoney" min-width="80" label="回盘金额"></el-table-column>

          <el-table-column prop="returnAmount" min-width="80" label="回盘笔数"></el-table-column>-->

          <el-table-column prop="successMoney" min-width="80" label="回盘成功金额" align="right"></el-table-column>

          <el-table-column prop="returnTime" min-width="100" label="回盘时间" show-overflow-tooltip></el-table-column>

          <el-table-column prop="successAmount" min-width="60" label="成功数" align="right"></el-table-column>

          <el-table-column prop="loseAmount" min-width="60" label="失败数" align="right"></el-table-column>

          <el-table-column prop="flux" min-width="120" label="操作">
            <template slot-scope="scope">
              <div class="cell" v-if="scope.row.status == 1">
                <el-button type="text" @click="details(scope.row)">详情</el-button>
                <span>|</span>
                <el-button type="text" @click="invoiceShow(scope.row)">发票</el-button>
              </div>
              <div class="cell" v-else-if="scope.row.status == 0">
                <el-upload
                  class="upload-demo"
                  action="/"
                  multiple
                  :show-file-list="false"
                  :data="scope.row"
                  :http-request="counteroffer"
                >
                  <el-button type="text" size="mini">回盘</el-button>
                </el-upload>
                <span>|</span>
                <el-button type="text" @click="revoke(scope.row)">撤销</el-button>
              </div>
              <div class="cell" v-if="scope.row.status == 2">
                <el-button type="text" disabled style="color:red;">已撤销</el-button>
              </div>
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
import bankDetails from "./bankDetails";
import SellOut from "./SellOut";
import invoice from "./invoice";
export default {
  name: "BankCharges",
  components: {
    bankDetails,
    SellOut,
    invoice
  }, 
  data() {
    return {
      idCuster: "",
      crumbsData: {
        //面包屑
        titleList: [{ title: "收费管理" }, { title: "银行代扣" }]
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "", //开始日期
        endDate: "", //结束日期
        backBeginDate:"",//回盘开始时间
        backEndDate:"", // 回盘结束时间
        chargingType: "1", //收费类型
        outBank:"",
        //businessAbode: "" //营业所
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //数据字典存值
      dictionaryData: [],
      //营业所存值
      //businessAbodeData: [],
      DateChoosevalue: [],
      BackDateChoosevalue:[],
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      totalData: {},
      DeductionOffer: true,
      DeductionRebate: false,
      DeductionList: false,
      WithholdingInvoice: false,
      BankChargesEditShow: false,
      TypesOfWaterUseName: "详情",
      SellOutName: "出盘",
      SellOutVisible: false,
      invoiceName: "发票",
      invoiceVisible: false,
      BankChargesCon: true,
      chargingTypeOptions: [
        {
          name: "代扣",
          id: "1"
        },
        {
          name: "托收",
          id: "2"
        }
      ],
      BankSelectOptions:[],
      sendType: "1"
    };
  },
  mounted() {
    eventBus.$emit("asideMenuShow", "businessMenuShow4");
    this.init();
    this.getDictionary();
    this.getBankSelect();
    //this.tradeClassifyDataOptions();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".BankCharges", [
      ".BankCharges .toolbar",
      ".BankCharges .block",
      ".BankCharges #crumbs"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      this.tableQuery.beginDate = this.DateChoosevalue[0];
      this.tableQuery.endDate = this.DateChoosevalue[1];
      this.tableQuery.backBeginDate = this.BackDateChoosevalue[0];
      this.tableQuery.backEndDate = this.BackDateChoosevalue[1];
      let params = {
        busicode: "FnBankList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.totalData = res.total
          this.tableData = res.detail;
          console.log(res)
        });
    },
    //出盘银行
    getBankSelect(){
      let params = {
        busicode: "BankSelect",
        data:{}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.BankSelectOptions=res
        });
    },
    // 数据字典
    getDictionary() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPC,BPW" //缴费渠道、缴费方式
      };
      this.$api
        .fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        })
        .catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    //合计
    getTotal(param){
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=['合计']
      selectedColm.forEach(a => {
          if(vm.totalData[a.property]||vm.totalData[a.property]==0||vm.totalData[a.property]=='0'){//与表格列进行匹配
            newArray.push(vm.totalData[a.property])
          }else{
            if(a.property!=undefined){//序号列不push
              newArray.push('')
            }
          }
        });
      sums=newArray;
      sums[2] = ''
      // console.log(sums,999999)
      return sums;
    },
    //营业所：
    /*
    tradeClassifyDataOptions() {
      let params = { busicode: "BusinessAbodeSelect", data: "" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "businessAbodeData", res);
        })
        .catch(res => {
          this.$set(this, "businessAbodeData", []);
        });
    },*/
    demand() {
      //查询
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    // 导入按钮
    importExcel(file) {
      let _this = this;
      let params = {
        busicode: "NsBankImport",
        type: "import", //导入
        data: {
          file: file.file
        }
      };
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          _this.$message({
            message: "导入数据成功！",
            type: "success"
          });
        });
    },
    importOtherExcel(file) {
      let _this = this;
      let params = {
        busicode: "OtherBankImport",
        type: "import", //导入
        data: {
          file: file.file
        }
      };
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          _this.$message({
            message: "导入数据成功！",
            type: "success"
          });
        });
    },
    //   导出
    exportExcel() {
      this.$refs.BankChargesEdit.exportExcel();
    },
    exportExcelSon() {
      this.$refs.SellOut.exportExcel();
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
      this.SellOutVisible = false;
      this.BankChargesEditShow = false;
      this.invoiceVisible = false;
      this.BankChargesCon = true;
    },
    details(row) {
      this.idCuster = row.id;
      this.BankChargesEditShow = true;
      this.BankChargesCon = false;
    },
    SellOutShow() {
      this.SellOutVisible = true;
      this.BankChargesCon = false;
    },
    invoiceShow(row) {
      this.idCuster = row.id;
      this.invoiceVisible = true;
      this.BankChargesCon = false;
    },
    counteroffer(file) {
      let params = {
        busicode: "FnBankBack",
        type: "import",
        data: {
          file: file.file,
          id: file.data.id
        }
      };
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          this.$message({
            message: "导入数据成功！",
            type: "success"
          });
        });
    },
    revoke(row) {
      this.$confirm('是否确认撤销？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         let params = {
          busicode: "FnBankCancle",
          data: {
            id: row.id
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$message({
              showClose: true,
              message: "撤消成功",
              type: "success"
            });
            this.init();
          });
      }).catch(() => {
        this.$message({
          message: '已取消操作',
          type: 'info'
        })
      })
     
    },
    getCurrentSendType(val){},
    sending(){
        this.$refs.BankChargesEdit.sendMsg();
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
.BankCharges {
  width: 100%;
  height: 100%;
  .upload-demo {
    display: inline-block;
  }
}
</style>

