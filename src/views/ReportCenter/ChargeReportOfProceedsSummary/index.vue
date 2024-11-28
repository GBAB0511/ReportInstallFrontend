<template>
  <!-- 拆表 -->
  <div class="ChargeReportOfProceedsSummary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="refreshData" size="mini" icon="el-icon-upload2" type="primary">刷新</el-button>
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="统计方式：" class="width-150">
              <el-select ref="select1" v-model="tableQuery.statisticsWay" placeholder="统计方式">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="用水类型：" class="width-200">
          <el-cascader         
            v-model="tableQuery.waterTypeId"
            :options="useWaterTypeOptions"
            :show-all-levels="false"
            :props="tprops" 
            clearable
            @change="(val) => changeWaterType(val)" 
          ></el-cascader>
        </el-form-item>
             <el-form-item label="营业区域：" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
               :show-all-levels="false" :props="props" @change="(val) => changeBusinessArea(val)" >
            </el-cascader>
            <el-form-item > 
             <el-checkbox-group v-model="tableQuery.isShowEndLevel">
                    <el-checkbox label="显示末级"></el-checkbox>
                </el-checkbox-group>
            </el-form-item> 
            </el-form-item> 
              <el-form-item label='账期：'>
              <!-- <el-date-picker v-model="tableQuery.accountPeriod" type="month" value-format="yyyyMM" >
              </el-date-picker> -->
              <el-date-picker v-model="Time2" @change="getDatePicker2" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始账期" end-placeholder="结束账期">
              </el-date-picker>
            </el-form-item>
            <!--<el-form-item label='收费日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item> -->
        <!--
            <el-form-item label="收款员:">
              <el-select ref="select2" clearable v-model="tableQuery.chargeStaffName" placeholder="收款员">
                <el-option v-for="item in staffs" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
       
              </el-select>
            </el-form-item>-->

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal'  :data="tableData" class="ChargeReportOfProceedsSummary-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

           <el-table-column v-if="tableQuery.statisticsWay == 1" prop="statisticsType" min-width="100" label="用水类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="tableQuery.statisticsWay == 2" prop="statisticsType" min-width="100" label="收款方式" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="tableQuery.statisticsWay == 3" prop="statisticsType" min-width="100" label="收费员" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="tableQuery.statisticsWay == 4" prop="statisticsType" min-width="100" label="营业区域" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="totalAmount" min-width="70" label="笔数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="calculateWater" min-width="100" label="总用水量" show-overflow-tooltip align="right">
          </el-table-column>

         

          <el-table-column prop="addWater" min-width="120" label="追加水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="subTotal" min-width="120" label="水费合计" show-overflow-tooltip align="right">
          </el-table-column> 

            <el-table-column :label="item.costName" min-width="120" align="right" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip>
              <template slot-scope="scope">              
                <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
              </template>
          </el-table-column>


           <el-table-column prop="totalMoney" min-width="120" label="总金额" show-overflow-tooltip align="right">
          </el-table-column>

          <!--<el-table-column prop="priorBalance" min-width="120" label="上期余额" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="curBalance" min-width="120" label="本期余额" show-overflow-tooltip>
          </el-table-column>-->

          <el-table-column prop="proceedsMoney" min-width="120" label="实收金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="ycMoney" min-width="120" label="预存金额" show-overflow-tooltip align="right">
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <!-- <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div> -->
    </div>
  </div>
</template>
<script>
 import axios from 'axios'
export default {
  name: "ChargeReportOfProceedsSummary",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      props: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      tprops: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
       //用水类型
     useWaterTypeOptions: [],
      businessArea: [],
      // 列表数据
      tableData: [],
      totalData: {},
      costNameList:[],
      staffs:[],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        statisticsWay: 1,
        // accountPeriod:this.common.date('month','yyyyMM'),
        startAccountPeriod: this.common.date('month','yyyyMM'),
        endAccountPeriod: this.common.date('month','yyyyMM'),
        startDate: '',
        endDate: '',
        businessArea:'',
        chargeStaffName:'',
        waterTypeId:'',
        isShowEndLevel:[],
      },
      // 查询条件日期
      Time: [],
      Time2: [this.common.date('month','yyyyMM'),this.common.date('month','yyyyMM')],
      // 统计方式下拉框数据
      processStateData: [{name:'按用水类型',value:1},{name:'按收费方式',value:2},{name:'按收费员',value:3},{name:'按营业区域',value:4}],
      // 详情页面所需数据
      editNeedData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "实收月汇总" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    this.staffSelect();
    this.businessAreaSelect();
    this.SelectUseWaterTypeOptions();
    // let time = new Date()
    // let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    // let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    // this.tableQuery.accountPeriod = time.getFullYear() + month
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfProceedsSummary", [
      ".ChargeReportOfProceedsSummary .toolbar",
      ".ChargeReportOfProceedsSummary .block",
      '.ChargeReportOfProceedsSummary .bread-contain'
    ]);
  },
  methods: {
    //   staffSelect() {   //营业所下拉框
    //   let _this = this
    //   let params = {
    //     busicode: "ChargeStaffSelect",
    //     data: {}
    //   };
    //   this.$api.fetch({
    //     params: params,//参数

    //   }).then(res => {
    //     _this.staffs = res
    //   })
    // },
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
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
     changeWaterType(val) {
      this.tableQuery.waterTypeId =  this.common.handleTreeData(val);
    },
    changeBusinessArea(val) {
        this.tableQuery.businessArea =  this.common.handleTreeData(val);
    },
    refreshData() {
      axios({
        method: 'post',
        url: '/task/monthProceeds.htm',
        data:{},
        headers : {
          "returntype" : "ajax/json"
        },
      }).then((res) =>{
        if (res.status === 200) {
          if(res.data.code != 0){
            this.$message({
              type: 'error',
              message: res.data.description
            })
          }
          else{
            this.$message({
              type: 'success',
              message: res.data.description
            })
          }

        }
        
        
      }).catch(() => {
         this.$message({
              type: 'error',
              message: '刷新错误'
            })
      })
    },
    // 列表初始化
    init() {
      let _this = this

  
      let params = {
        busicode: "MonthProceedsReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        _this.costNameList = res.costNameList
      })
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
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.useWaterTypeOptions = data;
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
     // 导出
    exportExcel() {
      let params = {
        "busicode": "MonthProceedsReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计','']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
          if(key == 'subTotal') {
             this.totalData.costList.forEach(item=>{
                arr.push(item.money)
            })
          }
        }
      }
      return arr
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
    // 获取日期框数据
    getDatePicker2(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startAccountPeriod = date[0]
        this.tableQuery.endAccountPeriod = date[1]
      } else {
        this.tableQuery.startAccountPeriod = ''
        this.tableQuery.endAccountPeriod = ''
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
.ChargeReportOfProceedsSummary {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
