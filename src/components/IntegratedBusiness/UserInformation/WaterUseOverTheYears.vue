<template>

  <div class="WaterUseOverTheYears">
    <div class="toolbar">
      <el-form style="width:95%" :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='账期：'>
            <el-date-picker  v-model="DateChoosevalue" value-format="yyyyMM" :picker-options="pickerOptions" clearable type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" >
          </el-date-picker>
          </el-form-item>
          <el-form-item label='收费时间：'>
            <el-date-picker
              v-model="chageTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              @change="getChageTime"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="营业区域：">
            <el-cascader
            clearable
            v-model="tableQuery.businessArea"
            :options="businessAreaData"
            :show-all-levels="false"
            :props="props"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item class="chargeStaffName" label="收费员：">
          <el-select clearable v-model="tableQuery.chargeStaffName" size="mini" placeholder="收费员">
            <el-option v-for="item in chargeStaffList" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费方式：">
            <el-select clearable v-model="tableQuery.payMethod" placeholder>
              <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收费渠道：">
            <el-select clearable v-model="tableQuery.payChannel" placeholder>
              <el-option v-for="(item,index) in dictionaryData.BPC" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否核销：" style="margin-left: 10px;">
            <el-select  v-model="tableQuery.chargingFlag" clearable>
              <el-option :value="1" label="是"></el-option>
              <el-option :value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应收类型：">
            <el-select clearable v-model="tableQuery.billType" placeholder>
              <el-option v-for="(item,index) in dictionaryData.BTYPE" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="用户编号、银行账户" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="demand" @input="e => input = inputMe(e)"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
      </el-form>
      <div style="width:160px">
        <el-button size="mini" type="primary" icon="el-icon-upload2"   @click.native="exportExcel">导出</el-button>
        <el-button size="mini" type="primary" @click="print">打印</el-button>
      </div>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table
        v-if="tableShow"
        stripe
        border
        height="100%"
        :max-height="maxHeight"
        :data="tableData"
        :summary-method="getSummaries"
        show-summary
        class="change-tables-table"
        :row-class-name="tableRowClass"
        ref="tableData"
        highlight-current-row
      >

        <el-table-column  label="NO." width="50" fixed="left" type="index" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="userNo" min-width="130" label="用户编号" fixed="left" show-overflow-tooltip>
        </el-table-column>
           <el-table-column prop="ctmName" min-width="200" label="客户名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="accountPeriod" min-width="80" label="账期" show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="billType" min-width="80" label="应收类型" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期" show-overflow-tooltip  align="right">
        </el-table-column>

        <el-table-column prop="priorPeriodNum" min-width="100" label="上期抄码" show-overflow-tooltip align="right">
        </el-table-column>

        <el-table-column prop="currendPeriodNum" min-width="100" label="本期抄码" show-overflow-tooltip  align="right">
        </el-table-column>

        <el-table-column prop="realityWater" min-width="110" label="实际用水量" show-overflow-tooltip  align="right">
        </el-table-column>
        <el-table-column prop="zhFee" min-width="110" label="综合水费" show-overflow-tooltip  align="right">
        </el-table-column>
        <el-table-column prop="receivableMoneyTotal" min-width="110" label="合计" show-overflow-tooltip  align="right">
        </el-table-column>

        <el-table-column :key="col.costName" :label="col.costName"  v-for='(col,index) in costList'  align="center">

            <!--<el-table-column  min-width="110" label="金额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :class="scope.row.costList[index].chargingFlag == '否'
                  || scope.row.costList[index].chargingFlag == '部分'?'red-cell':'black-cell'"
                  >{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
                </template>
            </el-table-column>-->

           <!-- <el-table-column prop="price" min-width="80" label="综合单价" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span :class="scope.row.costList[index].chargingFlag == '否'
                  || scope.row.costList[index].chargingFlag == '部分'?'red-cell':'black-cell'"
                  >{{ scope.row.costList[index] && scope.row.costList[index].price }}</span>
                </template>
            </el-table-column> -->

            <el-table-column :key="priceIndex" min-width="90" :label="'阶梯'+(priceIndex)+'单价'"  v-for='priceIndex in col.priceNum'  align="right">
              <template slot-scope="scope">
                  <span :class="scope.row.costList[index].chargingFlag == '否'
                  || scope.row.costList[index].chargingFlag == '部分'?'red-cell':'black-cell'"
                  >{{ scope.row.costList[index] && scope.row.costList[index]['priceJ'+(priceIndex)] }}</span>
                </template>
            </el-table-column>

             <el-table-column :key="waterIndex" min-width="90" :label="'阶梯'+(waterIndex)+'水量'"  v-for='waterIndex in col.priceNum'  align="right">
              <template slot-scope="scope">
                  <span :class="scope.row.costList[index].chargingFlag == '否'
                  || scope.row.costList[index].chargingFlag == '部分'?'red-cell':'black-cell'"
                  >{{ scope.row.costList[index] && scope.row.costList[index]['waterJ'+(waterIndex)] }}</span>
                </template>
            </el-table-column>

             <el-table-column min-width="90" :key="moneyIndex" :label="'阶梯'+(moneyIndex)+'金额'" :render-header="(h, obj) => renderHeader(h, obj, col.costName, moneyIndex)" v-for='moneyIndex in col.priceNum'  align="right">
              <template slot-scope="scope">
                  <span :class="scope.row.costList[index].chargingFlag == '否'
                  || scope.row.costList[index].chargingFlag == '部分'?'red-cell':'black-cell'"
                  >{{ scope.row.costList[index] && scope.row.costList[index]['moneyJ'+(moneyIndex)] }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="chargingFlag" min-width="80" label="是否核销" >
              <template slot-scope="scope">
                  <span  :class="scope.row.costList[index].chargingFlag == '否'
                  || scope.row.costList[index].chargingFlag == '部分'?'red-cell':'black-cell'"

                  >{{ scope.row.costList[index] && scope.row.costList[index].chargingFlag }}</span>
                </template>
            </el-table-column>

         <!--   <el-table-column prop="chargeTime" :formatter="fotmatTime" min-width="100" label="收费时间" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].chargeTime }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="chargeStaffName" min-width="80" label="收费员" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].chargeStaffName }}</span>
                </template>
            </el-table-column>-->


        </el-table-column>


       <el-table-column prop="chargeTime" min-width="160" label="收费时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" min-width="160" label="开账时间" show-overflow-tooltip>
        </el-table-column>

         <el-table-column prop="chargeStaffName" min-width="100" label="收费员" show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="payMethod" min-width="100" label="收费方式" show-overflow-tooltip>
        </el-table-column>


        <el-table-column prop="penaltyMoney" min-width="100" label="违约金" show-overflow-tooltip  align="right">
        </el-table-column>



        <el-table-column prop="useWaterType" min-width="200" label="用水类型" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="recordName" min-width="100" label="录单员" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="meterReadFlag" min-width="100" label="抄表标记" show-overflow-tooltip>
        </el-table-column>
      </el-table>

    </div>
    <!-- 分页 -->
      <!-- <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div> -->
  </div>
</template>
<script>
export default {
  name: "WaterUseOverTheYears",
  props: ['WaterUseOverTheYearsData'],
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '财务中心', path: '/WaterUseOverTheYears' },
          { title: '票据管理', method: () => { window.histroy.back() } }
        ],

      },
      chageTime:[],
      chargeStaffList:[],//抄表员
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath:false,
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        userNo: "",
        beginDate: "",
        endDate: "",
        chargingFlag: '',
        fuzzyQuery: '',
        businessArea:'',
        chargeStaffName:'',
        payMethod:'',
        payChannel:'',
        chargeTimeStart:'',
        chargeTimeEnd:'',
        billType: '',
      },
      dictionaryData:[],
      businessAreaData:[],
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {

      },
      WaterUseOverTheYearsVisible: false,  //综合查询的显示和隐藏
      WaterUseOverTheYearsName: '发票领用-领用',
      ruleFormData: {},
      costList:[],
      calcType: [], // 需要计算合计的二级列表名称
    }
  },
  updated () {
    // 底部合计显示问题
    this.$nextTick(()=>{
      this.$refs.tableData.doLayout()
    })
  },
  mounted() {
    // let time = new Date()
    //  let month = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) + '' : '0' + (time.getMonth() + 1)
    // if(this.DateChoosevalue == null || this.DateChoosevalue.length==0){
    //   this.DateChoosevalue=[this.createBeginDate(),time.getFullYear() + '' + month]
    // }
    this.selectBAreaOptions();
    this.getChargeStaff();
    this.getDictionarySelect();
   this.tableQuery.fuzzyQuery = this.WaterUseOverTheYearsData.userNo;
  this.init();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
    //  console.log(this.WaterUseOverTheYearsData.userNo, this.DateChoosevalue);
      var reg = new RegExp( ' ' , "g" )
      if(this.tableQuery.fuzzyQuery)
        this.tableQuery.fuzzyQuery=this.tableQuery.fuzzyQuery.replace( reg , '' );
      if (this.DateChoosevalue == null) {
        this.tableQuery.beginDate = '';
        this.tableQuery.endDate = '';
      } else {
        this.tableQuery.beginDate = this.DateChoosevalue[0];
        this.tableQuery.endDate = this.DateChoosevalue[1];
      }

      let _this = this
      let data = _this.tableQuery
      _this.tableQuery.userNo = _this.WaterUseOverTheYearsData.userNo;

      let params = {
        "busicode": "ChargeInfoList",
        data,
      }
      _this.$api.fetch({
        params,//参数
      }).then(res => {
        console.log(res);
        _this.tableData = res.list;
        this.$set(this, "costList", res.costList); //触发数组响应式数据更新
         this.maxHeight = 0;//触发watch更新表格
         res.list.forEach(item => {
           item.costList.forEach(list => {
              this.calcType.push(list.costName)
           })
         })
        this.calcType = this.calcType.filter(function(item, index, arr) {
            return arr.indexOf(item, 0) === index;
        });
        // _this.costList = res.costList;
        // for(let i = _this.tableData.list.length - 1; i > 0; i --) {

        //   // 设置初始值
        //   if (!_this.tableData.list[i].rowspan) {
        //     _this.tableData.list[i].rowspan = 0;
        //   }
        //   if (!_this.tableData.list[i].dateRowspan) {
        //     _this.tableData.list[i].dateRowspan = 0;
        //   }

        //   if (_this.tableData.list[i].accountPeriod == _this.tableData.list[i - 1].accountPeriod && _this.tableData.list[i].userNo == _this.tableData.list[i - 1].userNo) {
        //     // 设置rowspan
        //     if (_this.tableData.list[i].rowspan == 0){
        //       _this.tableData.list[i].rowspan = 1;
        //     }
        //     _this.tableData.list[i - 1].rowspan = (_this.tableData.list[i].rowspan || 0) + 1;
        //     _this.tableData.list[i].rowspan = 0;
        //     _this.tableData.list[i - 1].receivableTotal = (Number(_this.tableData.list[i - 1].receivableTotal) + Number(_this.tableData.list[i].receivableTotal)).toFixed(2)
        //     _this.tableData.list[i].receivableTotal = 0

        //      if(_this.tableData.list[i].meterReadingDate == _this.tableData.list[i - 1].meterReadingDate) {
        //       // 设置rowspan
        //       if (_this.tableData.list[i].dateRowspan == 0){
        //         _this.tableData.list[i].dateRowspan = 1;
        //       }
        //       _this.tableData.list[i - 1].dateRowspan = (_this.tableData.list[i].dateRowspan || 0) + 1;
        //       _this.tableData.list[i].dateRowspan = 0;
        //     } else {
        //       if (_this.tableData.list[i].dateRowspan == 0){
        //         _this.tableData.list[i].dateRowspan = 1;
        //       }
        //     }
        //   } else {
        //     if (_this.tableData.list[i].rowspan == 0){
        //       _this.tableData.list[i].rowspan = 1;
        //     }
        //   }
        // }
        // let index = 0
        //   for(let i = 0; i < _this.tableData.list.length; i++) {
        //     if(_this.tableData.list[i].rowspan && _this.tableData.list[i].rowspan > 0) {
        //       _this.tableData.list[i].index = ++index
        //     }
        //     // this.$refs.table.toggleRowSelection(_this.tableData[i], false)

        //     //去除实际用水量小数点
        //     _this.tableData.list[i].realityWater = parseInt(Number(_this.tableData.list[i].realityWater))
        //   }
          this.$nextTick(()=>{
                this.common.changeTable(this, '.WaterUseOverTheYears', ['.WaterUseOverTheYears .toolbar'])
          })
      })
    },
    getChageTime(){
      if(this.chageTime[0]){
        this.tableQuery.chargeTimeStart= this.chageTime[0]
      }
      if(this.chageTime[1]){
        this.tableQuery.chargeTimeEnd= this.chageTime[1]
      }
    },
    selectBAreaOptions(id) {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res);
          let data = this.getArr(res);
          // console.log(data);
          _this.businessAreaData = data.children;
          // console.log(this.businessAreaData);
        });
    },
    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPI,BPC,BTYPE"
      };
      this.$api.fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        }).catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    // 抄表员数据获取
    getChargeStaff() {
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
          _this.chargeStaffList = [...res];
        });
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map((i) => {
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
    createBeginDate(){
        var date = new Date();
        date.setMonth(date.getMonth()-6);
        date.toLocaleDateString()
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        const time = y +''+ m
        return time;
     },
    getchargingFlag(row,column){
      if(row.chargingFlag===1){
        return "是"
      }else{
        return "否"
      }
    },
    print() {
      let _this = this;
      if (this.DateChoosevalue == null) {
        this.tableQuery.beginDate = '';
        this.tableQuery.endDate = '';
      } else {
        this.tableQuery.beginDate = this.DateChoosevalue[0];
        this.tableQuery.endDate = this.DateChoosevalue[1];
      }
      let data = _this.tableQuery
      _this.tableQuery.userNo = _this.WaterUseOverTheYearsData.userNo;

      let params = {
        busicode: "ChargeInfoPrint",
        data:data,
      };

      this.$api.fetch({
        params: params,
      }).then(res => {
          let data = res
          this.$notify({
            title: '成功',
            message: '正在打印...',
            type: 'success'
          })
          this.common.print('view', 'ChargeInfoPrintModel', '', data[0], this);
      })
    },

    //导出
    exportExcel() {
          var _this = this
          var data = JSON.parse(JSON.stringify(_this.tableQuery))
          data.page=1;
          data.pageCount=999999;
          var params = {
            busicode: "ChargeInfoExport",
            data: data,
            token: sessionStorage.getItem('token'),
            sysType: '002'
          }
          // 入参不需要分页
          delete params.data.page
          delete params.data.pageCount
          window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
          //window.open('http://localhost:8080/css2_war_exploded/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
        },

    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },

    // //分页
    // handleSizeChange(val) { //显示多少数据一页
    //   this.tableQuery.pageCount = val
    //   this.tableQuery.page = 1
    //   this.init()
    // },
    // handleCurrentChange(val) {  //显示多少页码
    //   this.tableQuery.page = val
    //   this.init()
    // },

    cellClick(row, column, cell, event) { //点击文件名
      let that = this;
    },
    // indexMethod(index) {//获取表格序号
    //       return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    //   //return (this.tableData.pageSize - 20) * this.tableData.pages + (index + 1);

    // },
    indexMethod(index) {
        return index + 1;
    },

    tableRowClass({ row, rowIndex }) {
      return row.chargingFlag==1 ? '' : 'red-cell'
    },
    closeDialog() { //关闭会话
      this.WaterUseOverTheYearsVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterUseOverTheYears.submit()
      // this.WaterUseOverTheYearsVisible = false;
    },
    add() {
      this.WaterUseOverTheYearsVisible = true;
    },
    edit() {

    },
    getSpanArr({ row, column, rowIndex, columnIndex }) {
      //console.log({ row, column, rowIndex, columnIndex })
      if ((column.label === "NO." ||column.label === "抄表日期" || column.label === "用户编号" || column.label === "账期" || column.label === '合计' || column.label === "实际用水量" || column.label === "本期抄码" || column.label === "是否核销"|| column.label === "本期抄码" || column.label === "客户名称"|| column.label === "收费时间" || column.label === "收费员"|| column.label === "用水类型" || column.label === "备注")) {
        return {
          rowspan: row.rowspan !== 0 ? row.rowspan || 1 : 0,
          colspan: 1,
        };
      }
      /*if (columnIndex != 0 && column.label === "抄表日期") {
        return {
          rowspan: row.dateRowspan !== 0 ? row.dateRowspan || 1 : 0,
          colspan: 1,
        };
      }*/
    },
    fotmatTime(row, column) {
      const time = row[column.property]
      return time ? time.split(' ')[0] : ''
    },
    renderHeader(h, { column, $index }, param, moneyIndex) {
     column.property = param;
     return "阶梯"+moneyIndex+"金额";
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      const arr = ['proceedsMoney', 'penaltyMoney', 'receivableMoneyTotal','realityWater','zhFee', ...this.calcType]; // 需要合计的列
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (!arr.includes(column.property)) {
          sums[index] = ''
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              if(column.property === 'priorPeriodNum' || column.property === 'currendPeriodNum' || column.property === 'realityWater') {
                return Number(prev) + Number(curr)
              }
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
        } else {
            if(this.calcType.indexOf(column.property) != -1){
            let next = index+1;
              if(columns[next].property === column.property){
                  sums[index] = "";
              }else{
                let total = 0;
                this.tableData.forEach(list => {
                  list.costList.forEach(i => {
                    if(column.property == i.costName){
                        total += Number(i.money);
                    }
                  })
                })
                sums[index] = total.toFixed(2);
              }
            }else{
                sums[index] = 'N/A';
            }
        }
      });

      return sums;
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
<style lang="scss" scoped>
.WaterUseOverTheYears {
  width: 100%;
  height: 100%;
  overflow:hidden!important;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    .searchBtn{
      background: #faa646;
      color: #fff;
    }
  }
  .kl-table {
    padding: 0px 20px;
    /deep/ {
      .el-table {
        .red-cell {
          color: red;
        }
        .black-cell{
          color:black;
        }
      }
    }

    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  .el-form--inline .el-form-item:first-of-type {
    margin-right: 0px;
  }
  .el-date-editor .el-range__icon,
  .el-date-editor .el-range-separator {
    line-height: 22px;
    width: 10%;
  }
}
</style>

