<template>
  <div class="AddShow">
    <div v-if="addType == 'bank'">
      <div class="toolbar">
          <el-form :inline="true" size="mini" :model="bankTableQuery"  class="demo-form-inline">
            <el-form-item label="银行账期：">
              <el-date-picker v-model="bankTableQuery.accountPeriod" type="month" value-format="yyyyMM" >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="入账银行名称：" class="width-250">
              <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="bankTableQuery.toBankName"  placeholder="请输入银行名称" clearable></el-input> -->
              <el-select v-model="bankTableQuery.toBankName" placeholder="请选择" clearable>
                <el-option v-for="item in bankData" :key="item.id" :label="item.bankName" :value="item.bankName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易日期：">
              <el-date-picker v-model="bankTransactionTime" @change="bankGetDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="金额：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="bankTableQuery.amount " placeholder="请输入金额" clearable></el-input>
            </el-form-item>
            <el-form-item label="模糊查询：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="bankTableQuery.fuzzyQuery " placeholder="模糊查询" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="searchBtn" @click="bankDemand" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
      </div>
      <div class="kl-table" :style="{ height: maxHeight + 'px' }">
        <el-table
          border
          v-if="tableShow"
          :max-height="maxHeight"
          :data="bankTableData.list"
          class="wuserInfo-table"
          highlight-current-row
          @selection-change="bankSelectOne"
          @row-click="bankHandleTableCellClick"
          ref="eltableCurrentRow"
          :cell-style="cellStyle"
        >
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="bankIndexMethod"></el-table-column>

          <el-table-column prop="toBankName" min-width="250" label="入账银行名称">
          </el-table-column>

          <el-table-column prop="toAccountNo" min-width="200" label="入账银行账号">
          </el-table-column>

          <el-table-column prop="fromName" min-width="250" label="对方银行户名">
          </el-table-column>

          <el-table-column prop="dateTime" min-width="150" label="银行交易时间">
          </el-table-column>

          <el-table-column prop="amount" min-width="110" label="银行金额" align="right" header-align="left">
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="银行账期">
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="bankHandleSizeChange"
          @current-change="bankHandleCurrentChange"
          :current-page="bankTableQuery.page"
          :page-sizes="[20, 100, 500, 1000]"
          :page-size="bankTableQuery.pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="bankTableData.total"
        >
        </el-pagination>
      </div>
    </div>
  <div v-else>
    <div class="toolbar">
        <el-form :inline="true" size="mini" :model="cssTableQuery"  class="demo-form-inline">
          <el-form-item label="银行账期：">
            <el-date-picker v-model="cssTableQuery.accountPeriod" type="month" value-format="yyyyMM" >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易日期：">
            <el-date-picker v-model="cssTransactionTime" @change="cssGetDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="金额：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="cssTableQuery.amount " placeholder="请输入金额" clearable></el-input>
            </el-form-item>
          <el-form-item label="模糊查询：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="cssTableQuery.fuzzyQuery " placeholder="模糊查询" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="cssDemand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
    </div>
    <div class="kl-table" :style="{ height: maxHeight + 'px' }">
      <el-table
        border
        v-if="tableShow"
        :max-height="maxHeight"
        :data="cssTableData.list"
        class="wuserInfo-table"
        highlight-current-row
        @selection-change="cssSelectOne"
        @row-click="cssHandleTableCellClick"
        ref="eltableCurrentRow"
        :cell-style="cellStyle"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="cssIndexMethod"></el-table-column>

        <el-table-column prop="cssInTypeName" min-width="250" label="营收入账类型">
        </el-table-column>

        <el-table-column prop="cssCtmno" min-width="200" label="营收用户名称">
          <template slot-scope="scope"><div v-html="scope.row.cssCtmno"></div></template>
        </el-table-column>

        <el-table-column prop="cssDateTime" min-width="250" label="营收交易时间">
        </el-table-column>

        <el-table-column prop="cssAmount" min-width="150" label="营收金额">
        </el-table-column>

        <el-table-column prop="cssAccountPeriod" min-width="110" label="营收账期" align="right" header-align="left">
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        @size-change="cssHandleSizeChange"
        @current-change="cssHandleCurrentChange"
        :current-page="cssTableQuery.page"
        :page-sizes="[20, 100, 500, 1000]"
        :page-size="cssTableQuery.pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cssTableData.total"
      >
      </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddShow",
  props: [
    "accountPeriod","addType","accountIds","cssIds"
  ],
  data() {
    return {
      bankTransactionTime:'',
      cssTransactionTime:'',
      bankTableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: this.accountPeriod.toString(),
        toBankName: '',
        startBankTransactionTime: '',
        endBankTransactionTime: '',
        amount: '',
        fuzzyQuery: '',
        cssAccount: 'bankAccount',
        groupCode: localStorage.getItem("companyNo"),
      },
      cssTableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: this.accountPeriod.toString(),
        startCssTransactionTime: '',
        endCssTransactionTime: '',
        fuzzyQuery: '',
        amount: '',
        cssAccount: 'css',
        groupCode: localStorage.getItem("companyNo"),
      },
      tableShow: false,
      maxHeight: 0,
      // 银行数据
      bankTableData:{
        list: []
      },
      // 银行选择数据
      bankSelectData: [],
      // 营收数据
      cssTableData:{
        list: []
      },
      // 营收选择数据
      cssSelectData: [],
      // 银行数据
      bankData: []
    };
  },
  mounted() {
    this.getBankData()
    if (this.addType == 'bank') {
      this.bankInit();
    }else{
      this.cssInit();
    }
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".AddShow", [
      ".AddShow .toolbar",
      ".AddShow .block",
    ]);
  },
  methods: {
    //银行
    bankInit() {
      let _this = this;
      let params = {
        busicode: "BillBalanceCss",
        data: _this.bankTableQuery,
      };
      _this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.bankTableData = res;
        });
      // var res = {"code":0,"description":"查询成功","data":{"total":733,"list":[{"id":1,"ids":"","remark":"现金存款","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"56.27","fromName":"宁夏银都安居物业服务有限公司<br>宁夏民生物业服务有限公司","dateTime":"2021-09-14 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":2,"ids":"","remark":"财政国库支付9月份水费9月份水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"348.0","fromName":"宁夏回族自治区自然资源和不动产确权登记中心","dateTime":"2021-09-14 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":3,"ids":"","remark":"水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"456.5","fromName":"虎梦楠","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":4,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"16193.76","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":5,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"239.03","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":6,"ids":"","remark":"财政国库支付马荣芳报7月份水费马荣芳报7月份水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"17123.79","fromName":"宁夏回族自治区公安厅","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":7,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"1751.52","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":8,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"5240.43","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":9,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"11487.88","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10,"ids":"","remark":"财政国库支付付二中水费付二中水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"16554.53","fromName":"银川市第二中学","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":11,"ids":"","remark":"水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"1851.99","fromName":"宁夏辰隆物业服务有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":12,"ids":"","remark":"现金存款","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"700.0","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":13,"ids":"","remark":"水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"5932.81","fromName":"党茜","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":14,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"98751.82","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":15,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"349.65","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":16,"ids":"","remark":"00012747材料款","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"85249.2","fromName":"宁夏第五建筑有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":17,"ids":"","remark":"货款","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"653.0","fromName":"银川中铁水务集团有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":18,"ids":"","remark":"0902费0元","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"589.12","fromName":"银联商务股份有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":19,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"46315.99","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":20,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"935.52","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""}],"pageNum":1,"pageSize":20,"size":20,"startRow":1,"endRow":20,"pages":37,"prePage":0,"nextPage":2,"isFirstPage":true,"isLastPage":false,"hasPreviousPage":false,"hasNextPage":true,"navigatePages":8,"navigatepageNums":[1,2,3,4,5,6,7,8],"navigateFirstPage":1,"navigateLastPage":8}}
      // console.log(res);
      // this.bankTableData = res.data;
      // this.$nextTick(()=>{
      //   this.bankSelect(this.accountIds)
      // })
    },
    bankSelect(list){
      var select = []
      this.bankTableData.list.forEach(item => {
        list.forEach(listItem =>{
          if (listItem == item.id) {
            select.push(item)
          }
        })
      })
      this.bankSelectOne(this.bankSelectData.concat(select))
      select.forEach(item =>{
        this.$nextTick(()=>{
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      })
    },
    bankDemand(){
      this.bankTableQuery.page = 1;
      this.bankInit();
    },
    bankGetDatePicker(date){
      if (date !== undefined && date !== null) {
        this.bankTableQuery.startBankTransactionTime = date[0]
        this.bankTableQuery.endBankTransactionTime = date[1]
      } else {
        this.bankTableQuery.startBankTransactionTime = '';
        this.bankTableQuery.endBankTransactionTime = '';
      }
    },
    bankSelectOne(currentData) {
      this.bankSelectData = currentData;
    },
    bankHandleTableCellClick(row,cell,event){
      const len = row.rowspan != undefined? row.rowspan : 1
      const ind = this.bankTableData.list.findIndex(item => item.id === row.id)
      var select = []
      for(let i = ind; i < ind + len; i++) {
        select.push(this.bankTableData.list[i])
      }
      if(this.bankSelectData.some(item => select.some(val => val.id === item.id))) { //取消勾选
        this.bankSelectOne(this.bankSelectData.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else {
        this.bankSelectOne(this.bankSelectData.concat(select))
        this.bankSelectData.concat(select).forEach(item =>{
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }
    },
    cellStyle(data){
      return "cursor:pointer;"
    },
    //分页
    bankHandleSizeChange(val) {
      //显示多少数据一页
      this.bankTableQuery.pageCount = val;
      this.bankTableQuery.page = 1;
      this.bankInit();
    },
    bankHandleCurrentChange(val) {
      //显示多少页码
      this.bankTableQuery.page = val;
      this.bankInit();
      // var res = {"code":0,"description":"查询成功","data":{"total":1568,"list":[{"id":21,"ids":"","remark":"水费","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"752.76","fromName":"银川市兴庆区大新镇卫生院","dateTime":"2021-10-01 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":22,"ids":"","remark":"1001_1612315835","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"46095.84","fromName":"财付通支付科技有限公司","dateTime":"2021-10-01 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":23,"ids":"","remark":"通用对账提现到卡","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"35499.3","fromName":"支付宝（中国）网络技术有限公司","dateTime":"2021-10-01 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":24,"ids":"","remark":"宿舍水费","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"109.23","fromName":"沈佩","dateTime":"2021-10-01 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":25,"ids":"","remark":"1002_1612315835","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"10936.65","fromName":"财付通支付科技有限公司","dateTime":"2021-10-02 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":26,"ids":"","remark":"通用对账提现到卡","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"18860.67","fromName":"支付宝（中国）网络技术有限公司","dateTime":"2021-10-02 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":27,"ids":"","remark":"1003_1612315835","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"10233.68","fromName":"财付通支付科技有限公司","dateTime":"2021-10-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":28,"ids":"","remark":"通用对账提现到卡","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"16172.61","fromName":"支付宝（中国）网络技术有限公司","dateTime":"2021-10-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":29,"ids":"","remark":"1004_1612315835","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"6474.4","fromName":"财付通支付科技有限公司","dateTime":"2021-10-04 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":30,"ids":"","remark":"通用对账提现到卡","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"19993.7","fromName":"支付宝（中国）网络技术有限公司","dateTime":"2021-10-04 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":31,"ids":"","remark":"电子汇入","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"468.0","fromName":"胡彬","dateTime":"2021-10-05 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":32,"ids":"","remark":"1005_1612315835","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"8324.94","fromName":"财付通支付科技有限公司","dateTime":"2021-10-05 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":33,"ids":"","remark":"8月份水费","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"1052.58","fromName":"银川市金凤区综合福利中心","dateTime":"2021-10-05 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":34,"ids":"","remark":"通用对账提现到卡","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"14930.56","fromName":"支付宝（中国）网络技术有限公司","dateTime":"2021-10-05 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":35,"ids":"","remark":"通用对账提现到卡","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"18914.97","fromName":"支付宝（中国）网络技术有限公司","dateTime":"2021-10-06 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":36,"ids":"","remark":"1006_1612315835","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"12708.03","fromName":"财付通支付科技有限公司","dateTime":"2021-10-06 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":37,"ids":"","remark":"1007_1612315835","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"19361.79","fromName":"财付通支付科技有限公司","dateTime":"2021-10-07 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":38,"ids":"","remark":"通用对账提现到卡","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"19959.5","fromName":"支付宝（中国）网络技术有限公司","dateTime":"2021-10-07 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":39,"ids":"","remark":"水费","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"126.0","fromName":"朱文婷","dateTime":"2021-10-08 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""},{"id":40,"ids":"","remark":"付水费","groupCode":"","accountPeriod":202110,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"152.52","fromName":"银川建发商业管理有限责任公司","dateTime":"2021-10-08 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":0,"statusName":"","cssIds":"","accountIds":"","updateAccount":"","updateName":"","updateDate":"","cssAccountPeriod":"","cssStatus":""}],"pageNum":1,"pageSize":20,"size":20,"startRow":1,"endRow":20,"pages":79,"prePage":0,"nextPage":2,"isFirstPage":true,"isLastPage":false,"hasPreviousPage":false,"hasNextPage":true,"navigatePages":8,"navigatepageNums":[1,2,3,4,5,6,7,8],"navigateFirstPage":1,"navigateLastPage":8}}
      // console.log(res);
      // this.bankTableData = res.data;
      // this.$nextTick(()=>{
      //   this.bankSelect(this.accountIds)
      // })
    },
    bankIndexMethod(index) {
      //获取表格序号
      return (
        (this.bankTableQuery.page - 1) * this.bankTableQuery.pageCount + (index + 1)
      );
    },
    getBankData(){
      let params = {
        busicode: "BankDetailQuery",
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.bankData = res
      })
    },
    // 营收
    cssInit() {
      let _this = this;
      let params = {
        busicode: "BillBalanceCss",
        data: _this.cssTableQuery,
      };
      _this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.cssTableData = res;
        });
      // var res = {"code":0,"description":"查询成功","data":{"total":733,"list":[{"id":10563,"ids":"","remark":"现金存款","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"56.27","fromName":"","dateTime":"2021-09-14 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"宁夏银都安居物业服务有限公司<br>宁夏民生物业服务有限公司","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10566,"ids":"","remark":"财政国库支付9月份水费9月份水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"348.0","fromName":"宁夏回族自治区自然资源和不动产确权登记中心","dateTime":"2021-09-14 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10575,"ids":"","remark":"水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"456.5","fromName":"虎梦楠","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10576,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"16193.76","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10578,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"239.03","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10581,"ids":"","remark":"财政国库支付马荣芳报7月份水费马荣芳报7月份水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"17123.79","fromName":"宁夏回族自治区公安厅","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10582,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"1751.52","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10583,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"5240.43","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10586,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"11487.88","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10587,"ids":"","remark":"财政国库支付付二中水费付二中水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"16554.53","fromName":"银川市第二中学","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10589,"ids":"","remark":"水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"1851.99","fromName":"宁夏辰隆物业服务有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10590,"ids":"","remark":"现金存款","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"700.0","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10591,"ids":"","remark":"水费","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"5932.81","fromName":"党茜","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10592,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"98751.82","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10593,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"349.65","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10594,"ids":"","remark":"00012747材料款","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"85249.2","fromName":"宁夏第五建筑有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10595,"ids":"","remark":"货款","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"653.0","fromName":"银川中铁水务集团有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10596,"ids":"","remark":"0902费0元","groupCode":"","accountPeriod":202109,"toBankName":"中国建设银行股份有限公司银川东城支行","toAccountNo":"64001170100050010385","runningAccountNo":"","amount":"589.12","fromName":"银联商务股份有限公司","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10599,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"46315.99","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""},{"id":10600,"ids":"","remark":"商户收单","groupCode":"","accountPeriod":202109,"toBankName":"中国银行银川市玉皇阁北街支行","toAccountNo":"106003313951","runningAccountNo":"","amount":"935.52","fromName":"","dateTime":"2021-09-03 00:00:00","cssid":"","refId":"","cssInType":"","cssInTypeName":"","cssCtmno":"","cssDateTime":"","cssAmount":"","status":"","statusName":"","cssAccountPeriod":"","cssStatus":""}],"pageNum":1,"pageSize":20,"size":20,"startRow":1,"endRow":20,"pages":37,"prePage":0,"nextPage":2,"isFirstPage":true,"isLastPage":false,"hasPreviousPage":false,"hasNextPage":true,"navigatePages":8,"navigatepageNums":[1,2,3,4,5,6,7,8],"navigateFirstPage":1,"navigateLastPage":8}}
      // console.log(res);
      // this.cssTableData = res.data;
      //  this.$nextTick(()=>{
      //   this.cssSelect(this.cssIds)
      // })
    },
    cssSelect(list){
      var select = []
      this.cssTableData.list.forEach(item => {
        list.forEach(listItem =>{
          if (listItem == item.id) {
            select.push(item)
          }
        })
      })
      this.cssSelectOne(this.cssSelectData.concat(select))
      select.forEach(item =>{
        this.$nextTick(()=>{
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      })
    },
    cssDemand(){
      this.cssTableQuery.page = 1;
      this.cssInit();
    },
    cssGetDatePicker(date){
      if (date !== undefined && date !== null) {
        this.cssTableQuery.startCssTransactionTime = date[0]
        this.cssTableQuery.endCssTransactionTime = date[1]
      } else {
        this.cssTableQuery.startCssTransactionTime = '';
        this.cssTableQuery.endCssTransactionTime = '';
      }
    },
    cssSelectOne(currentData) {
      this.cssSelectData = currentData;
    },
    cssHandleTableCellClick(row,cell,event){
      const len = row.rowspan != undefined? row.rowspan : 1
      const ind = this.cssTableData.list.findIndex(item => item.id === row.id)
      var select = []
      for(let i = ind; i < ind + len; i++) {
        select.push(this.cssTableData.list[i])
      }
      if(this.cssSelectData.some(item => select.some(val => val.id === item.id))) { //取消勾选
        this.cssSelectOne(this.cssSelectData.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else {
        this.cssSelectOne(this.cssSelectData.concat(select))
        this.cssSelectData.concat(select).forEach(item =>{
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }
    },
    //分页
    cssHandleSizeChange(val) {
      //显示多少数据一页
      this.cssTableQuery.pageCount = val;
      this.cssTableQuery.page = 1;
      this.cssInit();
    },
    cssHandleCurrentChange(val) {
      //显示多少页码
      this.cssTableQuery.page = val;
      this.cssInit();
    },
    cssIndexMethod(index) {
      //获取表格序号
      return (
        (this.cssTableQuery.page - 1) * this.cssTableQuery.pageCount + (index + 1)
      );
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.AddShow {
  width: 100%;
  height: 100%;
  .searchBtn{
    background: #faa646;
    color: #fff;
  }
}
</style>
