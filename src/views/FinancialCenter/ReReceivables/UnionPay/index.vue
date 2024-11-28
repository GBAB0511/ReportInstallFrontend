<template>
  <div class="UnionPay">
    <!-- 互联网对账 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-show="!leftTableShow">
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="indexContent" v-if="leftTableShow">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <el-form-item label="收费日期：">
            <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="代收单位：">
            <el-select ref="select1" clearable v-model="tableQuery.chargingUnit" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in dictionaryData.BTU"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="对账状态：">
            <el-select ref="select2" clearable v-model="tableQuery.checkResult" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item,index) in checkResultOption"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态：">
            <el-select ref="select3" clearable v-model="tableQuery.handleFlag" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item,index) in handleFlagOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
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
          show-summary 
          :summary-method='getTotal'
          highlight-current-row
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="chargingDate" min-width="100" label="收费日期"></el-table-column>

          <el-table-column prop="chargingUnit" min-width="80" label="代收单位"></el-table-column>

          <el-table-column prop="chargingAmount" min-width="80" label="代收笔数" align="right"></el-table-column>

          <el-table-column prop="chargingMoney" min-width="120" label="代收金额" align="right"></el-table-column>

          <el-table-column prop="serviceCharge" min-width="80" label="手续费" align="right"></el-table-column>

          <el-table-column prop="clearingForm" min-width="80" label="结算方式"></el-table-column>

          <el-table-column prop="checkDate" min-width="100" label="对账日期"></el-table-column>

          <el-table-column prop="checkFile" min-width="250" label="文件名"></el-table-column>

          <el-table-column prop="checkResult" min-width="80" label="对账状态"></el-table-column>

          <el-table-column prop="handleFlag" min-width="80" label="处理状态"></el-table-column>

          <el-table-column min-width="80" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.native="downloadCheckBill(scope.$index, scope.row)" v-if="scope.row.checkResult=='未对账'&&scope.row.chargingUnit=='微信'">下载对账</el-button>
              <el-button type="text" @click.native="details(scope.$index, scope.row)" v-if="scope.row.checkResult!='未对账'">详情</el-button>
              <span v-if="scope.row.checkResult=='异常'">|</span>
              <el-button type="text" @click="handle(scope.$index, scope.row)" v-if="scope.row.checkResult=='异常'">处理</el-button>
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
    <!-- UnionPayEdit 给页面传值 -->
    <div class="indexContent" v-if="detalisShow">
    <UnionPayEdit
      ref="UnionPayEdit"
      :formStute="formStute"
      
    ></UnionPayEdit>
    </div>
    <!-- UnionPayHandle 给页面传值 -->
    <div class="indexContent" v-if="HandleShow">
      <UnionPayHandle
        ref="waterQueryEdit"
        :formStute="formStute"
      ></UnionPayHandle>
    </div>
  </div>
</template>
<script>
import UnionPayEdit from "./UnionPayEdit";
import UnionPayHandle from "./UnionPayHandle";
export default {
  components: {
    UnionPayHandle,
    UnionPayEdit
  },
  name: "UnionPay",
  data() {
    return {
      formStute:{
        id:'',
      },
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "收款对账" },
          { title: "互联网对账" }
        ]
      },
      // 查询条件日期
      Time: [],
      dictionaryData:[],
      handleFlagOptions: [
        //0未处理，1已处理
        {
          value: "0",
          name: "未处理"
        },
        {
          value: "1",
          name: "已处理"
        }
      ],
      checkResultOption: [
        //1正常，2异常
        {
          value: "1",
          name: "正常"
        },
        {
          value: "0",
          name: "异常"
        },
        {
          value: "-1",
          name: "未对账"
        }
      ],
      tableQuery: {
        page:1,
        pageCount:20,
        startDate: "", //收费日期
        endDate: "", //收费日期
        chargingUnit: "", //代收单位，数据字典BTU
        checkResult: "", //对账结果，1正常，2异常
        handleFlag: "" //处理结果，0未处理，1已处理

      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: [],
      // 合计数据
      totalData: {},
      leftTableShow: true,
      detalisShow: false,
      HandleShow: false
    };
  },
  mounted() {
    let time = new Date()
    time.setMonth(time.getMonth() - 1)
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    let time2 = new Date()
    let month2 = (time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1)
    let day2 = time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate()
    this.tableQuery.startDate = `${time.getFullYear()}-${month}-${day}`
    this.tableQuery.endDate = `${time2.getFullYear()}-${month2}-${day2}`
    this.Time = [this.tableQuery.startDate, this.tableQuery.endDate]
    this.init();
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".UnionPay", [
      ".UnionPay .toolbar",
      ".UnionPay .block",
      '.UnionPay .bread-contain'
    ]);
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
         }
    },
    init() {
      let params = {
        busicode: "FnAlipayList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res.detail;
          this.totalData = res.total
        });
    },

    demand() {
      //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },

    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },
    
    // 数据字典数据获取
    getDictionary() {
      var params = {
        busicode: "DictionarySelect",
        data: "BTU" 
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.dictionaryData = res;
        });
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
      //获取表格序号
    //indexMethod(index) {
    //  return index + 1;
    //},
    closeDialog() {
      //关闭会话
      this.HandleShow = false;
      this.detalisShow = false;
      this.leftTableShow = true;
      this.init();
    },
    //弹出框
    submit() {
      //提交
      this.$refs.childUnionPay.submit();
    },
    handle(index,row) {
      this.formStute.id = row.id
      this.HandleShow = true;
      this.leftTableShow = false;
    },
    details(index,row) {
      this.formStute.id = row.id
      this.leftTableShow = false;
      this.detalisShow = true;
    },
    downloadCheckBill(index,row) {
      let params = {
        busicode: "downloadCheckBill",
        data: {
          "chargingDate" : row.chargingDate,
          "chargingUnit" : row.chargingUnitNo
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$message({
            message: "请1-5分钟稍后查看结果。",
            type: "success"
          });
        });
    },
     // 返回合计数据
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
      // sums[1] = ''
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
<style lang="scss">
.UnionPay {
  width: 100%;
  height: 100%;
}
</style>