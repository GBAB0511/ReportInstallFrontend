<template>
  <!-- 应收回收汇总 -->
  <div class="ChargeReportOfRecoverySummary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
        <el-button @click="print" size="mini" icon="el-icon-upload2" type="primary">打印</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='账期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>


            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal' :data="tableData.list" class="ChargeReportOfRecoverySummary-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="120" label="用水类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="price" min-width="80" label="水费单价" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="sweagePrice" min-width="80" label="污水单价" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column label="应收项目" align="center">
            <el-table-column prop="receivableAmount" min-width="80" label="笔数" show-overflow-tooltip align="right">
            </el-table-column>

            <el-table-column prop="receivableWater" min-width="120" label="水量" show-overflow-tooltip align="right">
            </el-table-column> 

            <el-table-column :label="item.costName" min-width="120" align="right" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip>
              <template slot-scope="scope">              
                <span style="color:black;">{{ scope.row.ysCostList[index] && scope.row.ysCostList[index].money }}</span>
              </template>
          </el-table-column>


            <el-table-column prop="receivableSubtotal" min-width="120" label="小计" show-overflow-tooltip align="right">
            </el-table-column>
          </el-table-column>

          <el-table-column label="回收项目" align="center">
            <el-table-column prop="proceedsAmount" min-width="80" label="笔数" show-overflow-tooltip align="right">
            </el-table-column>

            <el-table-column prop="proceedsWater" min-width="120" label="水量" show-overflow-tooltip align="right">
            </el-table-column>

            <el-table-column :label="item.costName" min-width="120" align="right" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip>
              <template slot-scope="scope">              
                <span style="color:black;">{{ scope.row.ssCostList[index] && scope.row.ssCostList[index].money }}</span>
              </template>
          </el-table-column>
            <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right">
            </el-table-column>
            <el-table-column prop="proceedsSubtotal" min-width="120" label="小计" show-overflow-tooltip align="right">
            </el-table-column>
          </el-table-column>

        </el-table>
       
      </div>
       <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChargeReportOfRecoverySummary",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,



      // 列表数据
      tableData: {},
      totalData:{},
      costNameList:[],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startAccountPeriod: '',
        endAccountPeriod: ''
      },
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "应收回收汇总" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
     let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".ChargeReportOfRecoverySummary", [
      ".ChargeReportOfRecoverySummary .toolbar",
      ".ChargeReportOfRecoverySummary .block",
      ".ChargeReportOfRecoverySummary .bread-contain"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "ReceivableRecoveryReport",
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
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ReceivableRecoveryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    print() {
      if(!this.tableData || !this.tableData.list || this.tableData.list.length === 0) {
        this.$message({
          type: 'warning',
          message: '当前表格无数据，无法打印！'
        })
        return
      }
      let data = ''
      const list = this.tableData.list 
      let ysSize = this.costNameList.length + 3 
      let ssSize = this.costNameList.length + 4 
      for(let i = 0; i < list.length; i++) {
        data += `<tr>
      <td>${i+ 1}</td>
      <td>${list[i].waterTypeName}</td>
      <td>${list[i].price}</td>
      <td>${list[i].sweagePrice}</td>
      <td>${list[i].receivableAmount}</td>
      <td>${list[i].receivableWater}</td>`
      for(let j=0;j<this.costNameList.length;j++) {
        data +=`<td>${ list[i].ysCostList[j].money}</td>`
      }
      data+=`
      <td>${list[i].receivableSubtotal}</td>
      <td>${list[i].proceedsAmount}</td>`
      for(let x=0;x<this.costNameList.length;x++) {
        data +=`<td>${ list[i].ssCostList[x].money}</td>`
      }
      data+=`<td>${list[i].proceedsWater}</td>
      <td>${list[i].penaltyMoney}</td>
      <td>${list[i].proceedsSubtotal}</td>
      </tr>`
      }
      data += `<tr>
      <td>合计</td>
      <td></td>
      <td>${this.totalData.price}</td>
      <td>${this.totalData.sweagePrice}</td>
      <td>${this.totalData.receivableAmount}</td>
      <td>${this.totalData.receivableWater}</td>`
      for(let i=0;i<this.costNameList.length;i++) {
        data +=`<td>${this.totalData.ysCostList[i].money}</td>`
      }
      data+=`
      <td>${this.totalData.receivableSubtotal}</td>
      <td>${this.totalData.proceedsAmount}</td>
      <td>${this.totalData.proceedsWater}</td>`
      for(let i=0;i<this.costNameList.length;i++) {
        data +=`<td>${this.totalData.ssCostList[i].money}</td>`
      }
      data+=`
      <td>${this.totalData.penaltyMoney}</td>
      <td>${this.totalData.proceedsSubtotal}</td>
      </tr>`
      let str = `<table border=1 cellpadding=0 cellspacing=0>
      <theader>
      <tr>
      <th rowspan=2>NO.</th>
      <th rowspan=2>用水类型</th>
       <th rowspan=2>水费单价</th>
      <th rowspan=2>污水单价</th>
      <th colspan=`
      str+=ysSize+`>应收项目</th>
      <th colspan=`
      str+=ssSize+`>回收项目</th>
      </tr>
      <tr>
      <th>笔数</th>
      <th>水量</th>`
      for(let i=0;i<this.costNameList.length;i++) {
        str +=`<th>${this.costNameList[i].costName}</th>`
      }
      str+=`
      <th>小计</th>
      <th>笔数</th>
      <th>水量</th>`
      for(let i=0;i<this.costNameList.length;i++) {
        str +=`<th>${this.costNameList[i].costName}</th>`
      }
      str+=`
      <th>违约金</th>
      <th>小计</th>
      </tr>
      </theader>
      <tbody>
      ${data}
      </tbody>
      </table>
      `
      const frame = document.createElement('iframe')
      document.body.appendChild(frame)
      var doc = frame.contentWindow.document;
      doc.write(str);
      var ys="th,td{padding:2px 4px; max-width:200px; text-align: center;word-break:break-all;}";
      var style=document.createElement("style");
      style.innerText=ys;
      doc.getElementsByTagName("head")[0].appendChild(style)
      doc.close();
      frame.contentWindow.print()
      setTimeout(() => {
        document.body.removeChild(frame)
      }, 500)
    },
     // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key]) 
          if(key == 'receivableWater') {
             this.totalData.ysCostList.forEach(item=>{
                arr.push(item.money)
            })
          }
          if(key == 'proceedsWater') {
             this.totalData.ssCostList.forEach(item=>{
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
    },
    Time(val) {
      if(val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfRecoverySummary {
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
