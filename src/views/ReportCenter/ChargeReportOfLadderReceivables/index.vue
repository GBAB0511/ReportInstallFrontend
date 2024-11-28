<template>
  <!-- 阶梯应收报表 -->
  <div class="ChargeReportOfLadderReceivables">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
        <el-button @click="print" size="mini" icon="el-icon-upload2" type="primary">打印</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='账期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="用水类型：" class="width-150">
              <el-select ref="select1" clearable v-model="tableQuery.code" placeholder="请选择" class="waterTypeSelect">
                <el-option v-for="item in waterTypeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="营业区域：" class="width-150">
             <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" @change="getBusinessArea"
              :options="businessAreaData"
              :show-all-levels="false"
              :props="props">
            </el-cascader>
            </el-form-item>

            <el-form-item label="费用类型：" class="width-150">
            <el-select ref="select1" clearable v-model="tableQuery.costType" placeholder="请选择">
              <el-option
                v-for="(item,index) in costIdOption"
                :key="index"
                :label="item.costName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border  show-summary :summary-method='getTotal' :span-method="objectSpanMethod" :data="tableData.list" class="ChargeReportOfLadderReceivables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <!--el-table-column prop="businessAbodeId" min-width="120" label="营业所" show-overflow-tooltip>
          </el-table-column-->

          <el-table-column prop="businessAreaId" min-width="100" label="营业区域" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="totalWater" min-width="120" label="水量合计" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="totalMoney" min-width="120" label="合计金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="waterJ1" min-width="120" label="一阶水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priceJ1" min-width="80" label="一阶单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="moneyJ1" min-width="120" label="一阶金额" show-overflow-tooltip align="right">
          </el-table-column>

           <el-table-column prop="waterJ2" min-width="120" label="二阶水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priceJ2" min-width="80" label="二阶单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="moneyJ2" min-width="120" label="二阶金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="waterJ3" min-width="120" label="三阶水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priceJ3" min-width="80" label="三阶单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="moneyJ3" min-width="120" label="三阶金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="waterJ4" min-width="120" label="四阶水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priceJ4" min-width="80" label="四阶单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="moneyJ4" min-width="120" label="四阶金额" show-overflow-tooltip align="right">
          </el-table-column>


          <el-table-column prop="waterJ5" min-width="120" label="五阶水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priceJ5" min-width="80" label="五阶单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="moneyJ5" min-width="120" label="五阶金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="waterJ6" min-width="120" label="六阶水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priceJ6" min-width="80" label="六阶单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="moneyJ6" min-width="120" label="六阶金额" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="waterJ7" min-width="120" label="七阶水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="priceJ7" min-width="80" label="七阶单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="moneyJ7" min-width="120" label="七阶金额" show-overflow-tooltip align="right">
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
  name: "ChargeReportOfLadderReceivables",
  components: {
  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },
      // 主页面显示与隐藏
      indexShow: true,


      Time:[],
      // 列表数据
      tableData: {},
      totalData:  {},//合计
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        code: '',
        startAccountPeriod: '',
        endAccountPeriod: ''
      },
      businessAreaData: [], //营业区域
      waterTypeData:[],
      // 详情页面所需数据
      editNeedData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "阶梯应收报表" }]
      },
      tableShow: false,
      maxHeight: 0,
      spanArr: [],
      costIdOption: []
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
     let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.Time = [time.getFullYear() + month, time.getFullYear() + month]

    // this.init()
    this.getWaterType()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfLadderReceivables", [
      ".ChargeReportOfLadderReceivables .toolbar",
      ".ChargeReportOfLadderReceivables .block",
      ".ChargeReportOfLadderReceivables #crumbs"
    ]);
    this.selectBAreaOptions();
    this.getCostIdOption();
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
      let params = {
        busicode: "LadderReceivableReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        this.getSpanArr(this.tableData.list);
      })
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "LadderReceivableReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    //营业区域
    getBusinessArea(val) {
      val = this.common.handleTreeData(val);
      return val;
    },
    //用水分类下拉数据
    getCostIdOption() {
      var params = { busicode: "CostList" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "costIdOption", res);
        })
        .catch(res => {
          this.$set(this, "costIdOption", []);
        });
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
     // 返回合计数据
    getTotal({columns}){
      let arr = []
      for (const column of columns) {
        arr.push(this.totalData[column.property] || '')
      }
      arr[0] = '合计'
      arr[1] = ''
      return arr
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
      for(let i = 0; i < list.length; i++) {
        data += `<tr>
      <td>${i+ 1}</td>
      <td>${list[i].businessAbodeId}</td>
      <td>${list[i].businessAreaId}</td>
      <td>${list[i].totalWater}</td>
      <td>${list[i].totalMoney}</td>
      <td>${list[i].waterJ1}</td>
      <td>${list[i].priceJ1}</td>
      <td>${list[i].moneyJ1}</td>
      <td>${list[i].waterJ2}</td>
      <td>${list[i].priceJ2}</td>
      <td>${list[i].moneyJ2}</td>
      <td>${list[i].waterJ3}</td>
      <td>${list[i].priceJ3}</td>
      <td>${list[i].moneyJ3}</td>

      <td>${list[i].waterJ4}</td>
      <td>${list[i].priceJ4}</td>
      <td>${list[i].moneyJ4}</td>

      <td>${list[i].waterJ5}</td>
      <td>${list[i].priceJ5}</td>
      <td>${list[i].moneyJ5}</td>

      <td>${list[i].waterJ6}</td>
      <td>${list[i].priceJ6}</td>
      <td>${list[i].moneyJ6}</td>

      <td>${list[i].waterJ7}</td>
      <td>${list[i].priceJ7}</td>
      <td>${list[i].moneyJ7}</td>
     
      </tr>`
      }
      data += `<tr>
      <td>合计</td>
      <td></td>
      <td></td>
      <td>${this.totalData.totalWater}</td>
      <td>${this.totalData.totalMoney}</td>
      <td>${this.totalData.waterJ1}</td>
      <td>${this.totalData.priceJ1}</td>
      <td>${this.totalData.moneyJ1}</td>
      <td>${this.totalData.waterJ2}</td>
      <td>${this.totalData.priceJ2}</td>
      <td>${this.totalData.moneyJ2}</td>
      <td>${this.totalData.waterJ3}</td>
      <td>${this.totalData.priceJ3}</td>
      <td>${this.totalData.moneyJ3}</td>

      <td>${this.totalData.waterJ4}</td>
      <td>${this.totalData.priceJ4}</td>
      <td>${this.totalData.moneyJ4}</td>

      <td>${this.totalData.waterJ5}</td>
      <td>${this.totalData.priceJ5}</td>
      <td>${this.totalData.moneyJ5}</td>

      <td>${this.totalData.waterJ6}</td>
      <td>${this.totalData.priceJ6}</td>
      <td>${this.totalData.moneyJ6}</td>

      <td>${this.totalData.waterJ7}</td>
      <td>${this.totalData.priceJ7}</td>
      <td>${this.totalData.moneyJ7}</td>

      
      </tr>`
      const str = `<table border=1 cellpadding=0 cellspacing=0>
      <theader>
      <tr>
      <th>NO.</th>
      <th>营业所</th>
      <th>营业区域</th>
      <th>水量合计</th>
      <th>水费合计</th>
      <th>一阶水量</th>
      <th>一阶单价</th>
      <th>一阶金额</th>
      <th>二阶水量</th>
      <th>二阶单价</th>
      <th>二阶金额</th>
      <th>三阶水量</th>
      <th>三阶单价</th>
      <th>三阶金额</th>
      
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
    }
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
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfLadderReceivables {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  /deep/{
    .el-table__body .el-table__row td:nth-child(1),.el-table__body .el-table__row td:nth-child(2),
    .el-table__header th:nth-child(1),.el-table__header th:nth-child(2),
    .el-table__footer td:nth-child(1),.el-table__footer td:nth-child(2){
      .cell{
       text-align: center !important;
      }
    }
    .cell{
      text-align: right !important;
    }
  }
}
</style>

<style lang="scss">
.ChargeReportOfLadderReceivables {
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
