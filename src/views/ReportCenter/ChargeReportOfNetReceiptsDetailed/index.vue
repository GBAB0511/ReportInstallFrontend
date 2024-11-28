<template>
  <!-- 收费明细 -->
  <div class="ChargeReportOfNetReceiptsDetailed">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="75px" label-position="left">
            <el-form-item label='实收日期：' class="width-330">
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="缴费方式：">
              <el-select ref="select1" clearable v-model="tableQuery.payMethod" placeholder="缴费方式">
                <el-option v-for="item in dictionaryData.BPI" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="缴费渠道：">
              <el-select ref="select2" clearable v-model="tableQuery.payChannel" placeholder="缴费渠道">
                <el-option v-for="item in dictionaryData.BPC" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="收款员:">
              <el-select ref="select3" clearable v-model="tableQuery.chargeStaffName" placeholder="收款员">
                <el-option v-for="item in staffs" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="进账银行：" prop="incomeBank">
          <el-select  clearable v-model="tableQuery.incomeBank"  placeholder="进账银行" >
              <el-option v-for="(item,index) in incomeBankList" :key="index" :label="item.bankName+' '+item.bankAccount" :value="item.id" ></el-option>
            </el-select>
             </el-form-item>
                <el-form-item label="用水类型：">
              <el-cascader
                v-model="tableQuery.waterTypeId"
                :options="useWaterTypeOptions"
                :show-all-levels="false"
                clearable
                :props="props">
              </el-cascader>
            </el-form-item>

             <el-form-item label="营业区域：">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
               :show-all-levels="false" :props="props"  >
            </el-cascader>
            </el-form-item >

            <el-form-item label="缴费情况：">
            <el-select clearable v-model="tableQuery.jfStatus" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="及时缴费" value="1"></el-option>
              <el-option label="延迟缴费" value="2"></el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="是否税票：">
            <el-select clearable v-model="tableQuery.vatFlag" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="0"></el-option>
              <el-option label="否" value="1"></el-option>
            </el-select>
          </el-form-item>

           <!-- 抄表员 -->
            <el-form-item class="readingStaff" label="抄表员：">
              <el-select v-model="tableQuery.meterReadingStaffName" size="mini" placeholder="抄表员">
                <el-option v-for="item in meterReaderList" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
              </el-select>
            </el-form-item>

            <!--<el-form-item >
              <el-checkbox-group v-model="tableQuery.qfList">
                    <el-checkbox label="欠费" ></el-checkbox>
                </el-checkbox-group>
            </el-form-item>  -->

             <el-form-item label="册本号：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本号" clearable @keydown.enter.native="search"></el-input>
            </el-form-item>

             <el-form-item label="营业厅:"  v-if="businessHallButton">
              <el-select ref="businessHall" clearable v-model="tableQuery.businessHallId" placeholder="营业厅">
                <el-option v-for="item in businessHallOptions" :key="item.id" :label="item.hallName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            

            <el-form-item label="模糊查询：">
              <el-tooltip class="item" effect="dark" content="用户编号、客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search"></el-input>
            </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border show-summary :summary-method='getTotal'  :data="tableData.list" class="ChargeReportOfNetReceiptsDetailed-table" @selection-change="getSelectList" @row-click="handleTableCellClick" :cell-style="cellStyle" ref="eltableCurrentRow">
          <el-table-column type="selection" width="60" fixed="left"></el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>
           <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="chargeStaffName" min-width="100" label="收费员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="chargeTime" min-width="150" label="收费时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="meterReadingDate" min-width="150" label="抄表日期" show-overflow-tooltip>
          </el-table-column>

          <!--el-table-column prop="invoiceNo" min-width="100" label="发票号" show-overflow-tooltip>
          </el-table-column-->

          <el-table-column prop="payMethod" min-width="100" label="缴费方式" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="payChannel" min-width="80" label="续费渠道" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="80" label="账期" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="priorPeriodNum" min-width="100" label="上期读数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="currendPeriodNum" min-width="100" label="本期读数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="150" label="用水类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="realityWater" min-width="100" label="水量" show-overflow-tooltip align="right">
          </el-table-column>

           <el-table-column :label="item.costName" min-width="120" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip align="right">
              <template slot-scope="scope">
                <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
              </template>
        </el-table-column>

         <!-- <el-table-column prop="waterFee" min-width="120" label="水费" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="sweageFee" min-width="120" label="污水费" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="waterResourceFee" min-width="120" label="水资源费" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="garbage" min-width="120" label="垃圾费" show-overflow-tooltip>
          </el-table-column>-->
          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="subTotal" min-width="120" label="费用合计" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priorPeriodMoney" min-width="120" label="上期余额" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="currendPeriodMoney" min-width="120" label="本期余额" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="vatFlag" min-width="120" label="是否税票" show-overflow-tooltip>
          </el-table-column>
          <!--el-table-column prop="proceedsMoney" min-width="80" label="实收金额" show-overflow-tooltip>
          </el-table-column-->

        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <div class="noteReminder chargeRemind"><span style="color:#606266;font-size:14px">合计金额：</span><span style="color:#30B110;font-size:14px">{{receivableMoney}}</span>；<span style="color:#606266;font-size:14px">笔数：</span><span style="color:#30B110;font-size:14px">{{calculateNum}}</span>；<span style="color:#606266;font-size:14px">水量：</span><span style="color:#30B110;font-size:14px">{{calculateWater}}</span></div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfNetReceiptsDetailed",
  components: {

  },
  data() {
    return {
      meterReaderList:[],
      // 主页面显示与隐藏
      indexShow: true,

      // 列表数据
      tableData: {},
      totalData: {},
      costNameList:[],
      staffs:[],//收款员
      incomeBankList: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        fuzzyQuery: '',
        payChannel:'',
        chargeStaffName:'',
        payMethod:'',
        startDate: '',
        endDate: '',
        qfList:[],
        waterTypeId:'',
        businessArea:'',
        jfStatus:'',
        meterReadingStaffName:'全部',
        vatFlag:'',
        bookNo:'',
        businessHallId:'',
        incomeBank:'',
      },
      // 查询条件日期
      businessArea:[],
      Time: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      tprops:{
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      // 数据字典数据
      dictionaryData: {},
       useWaterTypeOptions:[],//用水类型下拉框
       businessHallOptions:[],//营业厅 下拉框

      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "收费明细" }]
      },
      tableShow: false,
      maxHeight: 0,
      businessHallButton:false,
      selectList: [],
      // 收费提醒
      receivableMoney: 0,  // 应缴金额
      calculateNum: 0,// 笔数
      accountPeriods: [], // 账期集合
      calculateWater: 0, // 水量
    };
  },
  mounted() {

    this.Time = [this.common.date(), this.common.date()]
    this.getDatePicker(this.Time)

    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    // this.tableQuery.startDate = `${time.getFullYear()}-${(Number(month) - 1) > 9 ? (Number(month) - 1) : '0' + (Number(month) - 1)}-${day}`
    this.tableQuery.startDate = `${time.getFullYear()}-${month}-${day}`
    this.tableQuery.endDate = `${time.getFullYear()}-${month}-${day}`
    this.Time = [this.tableQuery.startDate, this.tableQuery.endDate]
    // this.init()
    this.showBusinessHall()
    this.getReadingStaff()
    this.getDictionary()
    this.staffSelect()
    this.businessAreaSelect();
    this.selectBusinessHall();
    this.getIncomeBankList();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfNetReceiptsDetailed .index-page", [
      ".ChargeReportOfNetReceiptsDetailed .toolbar",
      ".ChargeReportOfNetReceiptsDetailed .block"
    ]);
    this.SelectUseWaterTypeOptions()
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
    // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    getIncomeBankList() { //进账银行获取
      let _this = this;
      let params = {
        busicode: "IncomeBankList",
        data: {status:'1'},
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {
          this.incomeBankList = res.list;
          this.$emit('getIncomeBankListData',res.list)
        });
    },
    businessAreaSelect() {   //营业所下拉框
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
        _this.businessArea = data.children;
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
    //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
      })
    },
      //树结构数据处理
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "ProceedsDetailReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        _this.costNameList = res.total.costList.map(item => {
            return {costName: item.costName}
        })
      })
    },
    //营业厅下拉框
    selectBusinessHall() {
      let params = {
        "busicode": "BaseBusinessHallList",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {    
        this.businessHallOptions = res;
      })
    },
     //获取营业厅 显示配置
    showBusinessHall() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'business_hall_condition_shaw',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

          if(res.list.length>0){
                  this.businessHallButton = res.list[0].configValue==1?true:false;            
          }
        })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "ProceedsDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(total){
    //   console.log(this.totalData);
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] !== '合计') {
          arr.push(this.totalData[key]);
          if(key == 'realityWater') {
            this.totalData.costList.forEach(item=>{
                arr.push(item.money)
            })
          }
        }
      }
      return arr
    },
     // 勾选
    getSelectList (e) {
      this.selectList = e
      this.receivableMoney = 0
      this.accountPeriods = []
      this.calculateNum = 0
      this.calculateWater = 0
      this.selectList.forEach(item => {
        this.receivableMoney += Number(item.subTotal || 0)
        // let userAndAccountPeriod = {
        //   userNo: item.userNo,
        //   accountPeriod: item.accountPeriod
        // }
        // if (JSON.stringify(this.accountPeriods).indexOf(JSON.stringify(userAndAccountPeriod)) !== -1) {
        // } else {
        //   this.accountPeriods.push(userAndAccountPeriod)
        //   this.calculateNum++
        // }
        this.calculateNum++
        this.calculateWater += Number(item.realityWater || 0)
      })
      this.receivableMoney = this.receivableMoney.toFixed(2)   //保留两位小数
    },
    handleTableCellClick (row, cell, event) {
      //把这个flag 变成当前的行的私有物,这样一来,每次变化的时候, 变化的都是你当前行的布尔值, 
      // row.flag = !row.flag;  
      // this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);    
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.list.findIndex(item => item.id === row.id)
      var select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if (this.selectList.some(item => select.some(val => val.id === item.id))) { //取消该账期勾选
        this.getSelectList(this.selectList.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else { //恢复该账期勾选
        this.getSelectList(this.selectList.concat(select))
        this.selectList.concat(select).forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }
    },
    cellStyle (data) {
      return "cursor:pointer;"
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPC,BPI"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
     /*staffSelect() {   //营业所下拉框
      let _this = this
      let params = {
        busicode: "ChargeStaffSelect",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.staffs = res
      })
    },*/
    // 收费人员数据获取
    staffSelect() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "1" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.staffs = [...res];
        });
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
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
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
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
.ChargeReportOfNetReceiptsDetailed {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .chargeRemind {
    margin-left: 50px;
    .el-form-item__content {
      color: #606266;
    }
  }
  .noteReminder {
    width: 30%;
    float: left;
    text-align: left !important;
    line-height: 32px;
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
  .width-330 > .el-form-item__content .el-date-editor{
    width: 330px !important;
  }
}
</style>
