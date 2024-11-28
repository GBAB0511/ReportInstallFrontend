<template>
  <!-- 阶梯统计报表 -->
  <div class="ChargeReportOfLadderNetReceipts">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="main-container">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <!-- <el-form-item class="form-left"> -->
            <el-form-item label="统计方式：" class="width-200">
              <el-select ref="select1" v-model="tableQuery.statisticsWay" placeholder="请选择" @change="selectChanged">
                <el-option
                  v-for="item in statisticsWayData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
               <el-checkbox v-model="tableQuery.showEndLevel" @change="handleShowEndLevel">显示末级</el-checkbox>
            </el-form-item>
            <el-form-item label="账期：" class="width-150">
              <el-select ref="select2" v-model="periodWay" placeholder="请选择" @change="selectChanged2">
                <el-option
                  v-for="item in periodWayData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <!-- <el-form-item v-else>
              <el-date-picker v-model="Time2" @change="getDatePicker2" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item> -->

            <!-- <el-form-item label="用水类型：">
              <el-select ref="select1" clearable v-model="tableQuery.code" placeholder="请选择" class="waterTypeSelect">
                <el-option v-for="item in waterTypeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="营业区域：" prop="businessArea" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>
            <el-form-item label="用水类型：" prop="waterTypeId" class="width-200">
              <el-cascader v-model="tableQuery.waterTypeId" clearable :options="useWaterTypeData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item>

            <el-form-item label="费用类型：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.costNo" placeholder>
                <el-option
                  v-for="(item,index) in costIdOption"
                  :key="index"
                  :label="item.costName"
                  :value="item.costNo"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          <!-- </el-form-item> -->
        </el-form>
      </div>
      <!-- <div class="company-content"> -->
        <!-- <div class="company-left" v-if="tableQuery.statisticsWay == 1 || tableQuery.statisticsWay == 2">
          <auto-tree
            :treeData="treeDatas"
            @sendTreeData="backTreeData"
          ></auto-tree>
        </div> -->
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal' :data="tableData" class="ChargeReportOfLadderNetReceipts-table">

              <el-table-column type="index" label="NO." width="50" fixed="left">
              </el-table-column>

              <!--el-table-column prop="businessAbodeId" min-width="120" label="营业所" show-overflow-tooltip>
              </el-table-column-->

              <el-table-column v-if="showWaterTypeDialog" prop="useWaterType" min-width="120" label="用水类型">
              </el-table-column>

              <el-table-column v-if="showAreaNoDialog" prop="businessArea" min-width="120" label="营业区域" show-overflow-tooltip>
              </el-table-column>

            <el-table-column label="合计" align="center">
              <el-table-column prop="billCount" min-width="120" label="合计户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="waterSum" min-width="120" label="合计水量" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="totalWaterDifference" min-width="120" label="差额水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="moneySum" min-width="120" label="合计金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="overStepWaterSum" min-width="120" label="超阶梯水量" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="diffMoneySum" min-width="120" label="差额金额" show-overflow-tooltip>
              </el-table-column> -->
            </el-table-column>

            <el-table-column label="超阶梯合计" align="center">
              <el-table-column prop="overCountSum" min-width="120" label="合计户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="overStepWaterSum" min-width="120" label="合计水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="overMoneySum" min-width="120" label="合计金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="overStepWaterSum" min-width="120" label="超阶梯水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="diffMoneySum" min-width="120" label="差额金额" show-overflow-tooltip align="right">
              </el-table-column>
            </el-table-column>

            <el-table-column label="一阶" align="center">
              <el-table-column prop="countJ1" min-width="120" label="户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="waterJ1" min-width="120" label="水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="priceJ1" min-width="120" label="单价" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="moneyJ1" min-width="120" label="金额" show-overflow-tooltip align="right">
              </el-table-column>

        
            </el-table-column>


              <el-table-column label="二阶" align="center">
              <el-table-column prop="countJ2" min-width="120" label="户数" show-overflow-tooltip align="right">
              </el-table-column>
                
              <el-table-column prop="waterJ2" min-width="120" label="水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="priceJ2" min-width="120" label="单价" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="moneyJ2" min-width="120" label="金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="waterJ2Difference" min-width="120" label="差额水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="diffMoneyJ2" min-width="120" label="差额金额" show-overflow-tooltip align="right">
              </el-table-column>
            </el-table-column>

            <el-table-column label="三阶" align="center">
              <el-table-column prop="countJ3" min-width="120" label="户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="waterJ3" min-width="120" label="水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="priceJ3" min-width="120" label="单价" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="moneyJ3" min-width="120" label="金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="waterJ3Difference" min-width="120" label="差额水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="diffMoneyJ3" min-width="120" label="差额金额" show-overflow-tooltip align="right">
              </el-table-column>
            </el-table-column>
            <el-table-column label="四阶" align="center">
              <el-table-column prop="countJ4" min-width="120" label="户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="waterJ4" min-width="120" label="水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="priceJ4" min-width="120" label="单价" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="moneyJ4" min-width="120" label="金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="waterJ3Difference" min-width="120" label="差额水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="diffMoneyJ4" min-width="120" label="差额金额" show-overflow-tooltip align="right">
              </el-table-column>
            </el-table-column>
            <el-table-column label="五阶" align="center">
              <el-table-column prop="countJ5" min-width="120" label="户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="waterJ5" min-width="120" label="水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="priceJ5" min-width="120" label="单价" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="moneyJ5" min-width="120" label="金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="waterJ3Difference" min-width="120" label="差额水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="diffMoneyJ5" min-width="120" label="差额金额" show-overflow-tooltip align="right">
              </el-table-column>
            </el-table-column>

            <el-table-column label="六阶" align="center">
              <el-table-column prop="countJ6" min-width="120" label="户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="waterJ6" min-width="120" label="水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="priceJ6" min-width="120" label="单价" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="moneyJ6" min-width="120" label="金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="waterJ3Difference" min-width="120" label="差额水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="diffMoneyJ6" min-width="120" label="差额金额" show-overflow-tooltip align="right">
              </el-table-column>
            </el-table-column>

            <el-table-column label="七阶" align="center">
              <el-table-column prop="countJ7" min-width="120" label="户数" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="waterJ7" min-width="120" label="水量" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="priceJ7" min-width="120" label="单价" show-overflow-tooltip align="right">
              </el-table-column>

              <el-table-column prop="moneyJ7" min-width="120" label="金额" show-overflow-tooltip align="right">
              </el-table-column>

              <!-- <el-table-column prop="waterJ3Difference" min-width="120" label="差额水量" show-overflow-tooltip>
              </el-table-column> -->

              <el-table-column prop="diffMoneyJ7" min-width="120" label="差额金额" show-overflow-tooltip align="right">
              </el-table-column>
            </el-table-column>


    

            </el-table>
          </div>
          <!-- 分页 -->
            <!-- <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
            </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "ChargeReportOfLadderNetReceipts",
  components: {
    autoTree
  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,


      Time:[],
      Time2:[],
      // 列表数据
      tableData: [],
      totalData: {},
      //查询条件对象
      tableQuery: {
        // page: 1,
        // pageCount: 20,
        // code: '',
        // startAccountPeriod: '',
        // endAccountPeriod: '',
        statisticsWay: "2", // 统计方式
        businessArea: "", //营业区域
        waterTypeId:"", //用水类型
        // startChargeTime: '',
        // endChargeTime: '',
        showEndLevel:false,
        costNo: '',//用水类型
      },
      waterTypeData:[],
      // 详情页面所需数据
      editNeedData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "阶梯统计报表" }]
      },
      tableShow: false,
      maxHeight: 0,
      spanArr: [],
      // 统计方式下拉数据
      statisticsWayData: [
        { name: "用水类型", value: "2" },
        { name: "营业区域", value: "1" },
      ],
      // 切换账期
      periodWayData: [
        { name: "应收账期", value: "1" },
        { name: "实收账期", value: "2" },
      ],
      areaTreeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children",
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点",
        },
        sendTreeProp: [
          "code",
          "name",
          "districtArr",
          "children",
          "id",
          "group",
          "isLeaf",
          "isParent",
          "parent",
          "sonData",
        ],
        rootName: "总部0",
        defaultOpen: {
          nodeKey: "id",
        },
      },
      typeTreeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children",
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点",
        },
        sendTreeProp: [
          "code",
          "name",
          "districtArr",
          "children",
          "id",
          "group",
          "isLeaf",
          "isParent",
          "parent",
          "sonData",
        ],
        rootName: "总部0",
        defaultOpen: {
          nodeKey: "id",
        },
      },
      treeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children",
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点",
        },
        sendTreeProp: [
          "code",
          "name",
          "districtArr",
          "children",
          "id",
          "group",
          "isLeaf",
          "isParent",
          "parent",
          "sonData",
        ],
        rootName: "总部0",
        defaultOpen: {
          nodeKey: "id",
        },
      },
      showWaterTypeDialog: true, //用水类型
      showAreaNoDialog: false, //营业区域
      periodWay: "1",
      accountPeriodShow: true,
      chargeTimeShow: false,
      startPeriod: '',
      endPeriod: '',
      // 营业区域下拉数据
      businessAreaData: [],
      // 用水类型下拉数据
      useWaterTypeData: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      // 用水类型数据
      costIdOption: []
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    this.Time2 = [time.getFullYear() + month, time.getFullYear() + month]
    // this.init()
    // this.getWaterType()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    // this.getTreeDatas();
    // this.businessAreaSelect(); 
    this.getBusinessAreaData() 
    this.getUseWaterTypeData()
    this.$set(this,'treeDatas',this.typeTreeDatas);
    this.parentId = this.treeDatas.tree.id;
    this.getCostIdOption();
    this.common.changeTable(this, ".ChargeReportOfLadderNetReceipts", [
      ".ChargeReportOfLadderNetReceipts .main-container .toolbar",
      ".ChargeReportOfLadderNetReceipts .main-container .block",
      ".ChargeReportOfLadderNetReceipts #crumbs"
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
      if (this.accountPeriodShow) {
        _this.tableQuery.startAccountPeriod = _this.startPeriod
        _this.tableQuery.endAccountPeriod = _this.endPeriod
        delete _this.tableQuery.startChargeTime
        delete _this.tableQuery.endChargeTime
      }else{
        _this.tableQuery.startChargeTime = _this.startPeriod
        _this.tableQuery.endChargeTime = _this.endPeriod
        delete _this.tableQuery.startAccountPeriod
        delete _this.tableQuery.endAccountPeriod
      }
      if (this.tableQuery.costNo == '' || this.tableQuery.costNo == null) {
        this.$message.error("请选择费用类型")
        return
      }
      let params = {
        busicode: "LadderProceedsReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.list
        _this.totalData = res.total
        // this.getSpanArr(this.tableData.list);
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "LadderProceedsReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(param){
      //console.log(this.totalData);
      // let arr = ['合计', '']
      // for (const key in this.totalData) {
      //   if (this.totalData[key] != '合计') {
      //     arr.push(this.totalData[key])
      //   }
      // }
      // return arr
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
     getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].businessAbodeId === data[i - 1].businessAbodeId) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
        console.log(this.spanArr)
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '营业所') {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowspan:${_row} colspan:${_col}`)
        return { // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getWaterType() {
      let _this = this
      let params = {
        busicode: "WaterTypeTopList",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.waterTypeData = res
      })
    },
    // 用水类型下拉框
    getUseWaterTypeData() {
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res)
        this.$set(this, "useWaterTypeData", data.children)
      }).catch(res => {
        this.$set(this, "useWaterTypeData", [])
      });
    },
    //树结构数据处理
    getArr(data) {
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
    // 营业区域下拉框
    getBusinessAreaData() {
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
        _this.businessAreaData = data.children;
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
    // 查询
    search() {
      // this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.startPeriod = date[0]
        this.endPeriod = date[1]
      } else {
        this.startPeriod = ''
        this.endPeriod = ''
      }
    },
    getDatePicker2(date) {
      if (date !== undefined && date !== null) {
       this.tableQuery.startChargeTime = date[0]
          this.tableQuery.endChargeTime = date[1]
      } else {
        this.tableQuery.startChargeTime = ''
        this.tableQuery.endChargeTime = ''
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
    // 获取树的数据
    getTreeDatas() {
      let _this = this;
      let params = {
        busicode: "WaterTypeTree",
        data: {},
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          _this.typeTreeDatas.tree = res;
          _this.waterTypeNo = res.code;
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
        _this.areaTreeDatas.tree = res;
      })
    },
    // 树的点击
    backTreeData(val) {
      let _this = this;
      this.parentId = val.id;
      this.waterTypeNo = val.code;
      //this.tableQuery.page = 1;
      if(this.tableQuery.statisticsWay == 1)
        this.tableQuery.businessArea = val.id;
      if(this.tableQuery.statisticsWay == 2)
        this.tableQuery.waterTypeId = val.id;
      let params = {
        busicode: "LadderProceedsReport",  
        data: this.tableQuery,
      };
      this.$api.fetch({ params: params }).then((res) => {
        _this.tableData = res.list
        _this.totalData = res.total
      });
    },
    selectChanged(val) {
      if(val == 2) {
        this.$set(this,'treeDatas',this.typeTreeDatas)
        this.parentId = this.treeDatas.tree.id;
      }
      else if(val == 1) {
          this.$set(this,'treeDatas',this.areaTreeDatas)
          this.parentId = this.treeDatas.tree.id;
      }
    },
    selectChanged2(val){

    },
    //
    handleShowEndLevel(value){
      this.showEndLevel = value
    },
    //用水分类下拉数据
    getCostIdOption() {
      var params = { busicode: "CostList" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "costIdOption", res);
          this.tableQuery.costNo = '01'
        })
        .catch(res => {
          this.$set(this, "costIdOption", []);
        });
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    Time(val) {
      if(val && val.length > 0) {
        // this.tableQuery.startAccountPeriod = val[0]
        // this.tableQuery.endAccountPeriod = val[1]
        this.startPeriod = val[0]
        this.endPeriod = val[1]
      }
    },
    Time2(val) {
      if(val && val.length > 0) {
        this.tableQuery.startChargeTime = val[0]
        this.tableQuery.endChargeTime = val[1]
      }
    },
    "tableQuery.statisticsWay": {
      handler: function (newval, oldval) {
          this.tableQuery.businessArea = "";
          this.tableQuery.waterTypeId = "";
          this.tableData = [];
          this.totalData = {};
        if (newval == "1") {
          //营业区域
          this.showWaterTypeDialog = false;
          this.showAreaNoDialog = true;  
        } else if (newval == "2") {
          //用水类型
          this.showWaterTypeDialog = true;
          this.showAreaNoDialog = false;
        }
      },
      deep: true,
    },
    "periodWay": {
      handler: function (newval, oldval) {
        if (newval == "1") {
          //营业区域
          this.accountPeriodShow = true;
          this.chargeTimeShow = false;  
        } else {
          this.accountPeriodShow = false;
          this.chargeTimeShow = true;
        }
      },
      deep: true,
    },
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfLadderNetReceipts {
  width: 100%;
  height: 100%;
  // .index-page {
  //   height:calc(100% - 41px);
  // }
  .main-container {
    height: calc(100% - 42px);  
    //      .company-content {
    //     width: 100%;
    //     height: 100%;
    //     // margin: 1% 0px;
    //     overflow: hidden;
    //     // box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
    // }
    /*左侧div样式*/
    .company-left {
        width: calc(20% - 10px);  /*左侧初始化宽度*/   
        height: 90%;
        background: #FFFFFF;
        float: left;
    }
    /*右侧div'样式*/
    .company-right{
        float: left;
        width: 80%;   /*右侧初始化宽度*/
        height: 100%;
        background: #fff;
        // box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
    }
    
  }
}
</style>

<style lang="scss">
.ChargeReportOfLadderNetReceipts {
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
