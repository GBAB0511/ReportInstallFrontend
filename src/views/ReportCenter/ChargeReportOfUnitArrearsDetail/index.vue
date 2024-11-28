<template>
  <!-- 未收明细表 -->
  <div class="ChargeReportOfUnitArrearsDetail">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
        <el-button @click="printByModel" size="mini" icon="el-icon-upload2" type="primary">打印</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

            <el-form-item label='账期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="模糊查询：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="用户编号/联合编号" clearable @keydown.enter.native="search"></el-input>
            </el-form-item>

             <el-form-item > 
             <el-checkbox-group v-model="tableQuery.isQf">
                    <el-checkbox label="1">是否欠费</el-checkbox>
                </el-checkbox-group>
            </el-form-item> 


            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border  show-summary :summary-method='getTotal' @sort-change='getSort' :data="tableData.list" class="ChargeReportOfUnitArrearsDetail-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="110" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="110" label="地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="useWaterType" min-width="100" label="用水类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="80" label="抄表月份" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="calculateWater" min-width="80" label="用水量" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="addWater" min-width="100" label="退补水量" show-overflow-tooltip align="right">
          </el-table-column>

           <el-table-column prop="zlsWaterFee" min-width="100" label="自来水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="jbWaterFee" min-width="100" label="计量水费" show-overflow-tooltip align="right">
          </el-table-column>

           <el-table-column prop="rlWaterFee" min-width="100" label="容量水费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="wsWaterFee" min-width="100" label="污水处理费" show-overflow-tooltip align="right">
          </el-table-column>

           <el-table-column prop="qjWaterFee" min-width="100" label="清洁卫生费" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="ljWaterFee" min-width="100" label="垃圾处理费" show-overflow-tooltip align="right">
          </el-table-column>

          

          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="subTotal" min-width="120" label="费用总额" show-overflow-tooltip align="right">
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
  name: "ChargeReportOfUnitArrearsDetail",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,


      Time:[],
      // 列表数据
      tableData: {},
      totalData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        fuzzyQuery:'',
        startAccountPeriod:'',
        endAccountPeriod:'',
        isQf:[]
      },
     
     
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "单位欠费明细表" }]
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

    this.common.changeTable(this, ".ChargeReportOfUnitArrearsDetail", [
      ".ChargeReportOfUnitArrearsDetail .toolbar",
      ".ChargeReportOfUnitArrearsDetail .block",
      ".ChargeReportOfUnitArrearsDetail #crumbs"
    ]);

  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "UnitArrearsDetailReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
      })
    },
     print() {
      if(!this.tableData || this.tableData.list.length === 0) {
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
      <td>${list[i].userNo}</td>
      <td>${list[i].ctmName}</td>
      <td>${list[i].ctmAddr}</td>
      <td>${list[i].useWaterType}</td>
      <td>${list[i].accountPeriod}</td>
      <td>${list[i].calculateWater}</td>
      <td>${list[i].addWater}</td>
      <td>${list[i].zlsWaterFee}</td>
      <td>${list[i].jbWaterFee}</td>
      <td>${list[i].rlWaterFee}</td>
      <td>${list[i].wsWaterFee}</td>
      <td>${list[i].qjWaterFee}</td>
      <td>${list[i].ljWaterFee}</td>
      <td>${list[i].penaltyMoney}</td>
      <td>${list[i].subTotal}</td>
      </tr>`
      }
      const str = `<table border=1 cellpadding=0 cellspacing=0>
      <theader>
      <tr>
      <th>NO.</th>
      <th>用户编号</th>
      <th>客户名称</th>
      <th>地址</th>
      <th>用水类型</th>
      <th>抄表月份</th>
      <th>用水量</th>
      <th>退补水量</th>
      <th>自来水费</th>
       <th>计量水费</th>
       <th>容量水费</th>
        <th>污水处理费</th>
         <th>清洁卫生费</th>
          <th>垃圾费处理费</th>
           <th>违约金</th>
            <th>费用总额</th>

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
    printByModel(){
      let data = this.tableQuery
      let params = {
        busicode: "UnitArrearsDetailReportPrint",
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
          this.common.print('print', 'UnitArrearsDetailReportPrint', '', data[0], this);
      })
    },
    getSort(){},
    
    exportExcel() {
      let params = {
        "busicode": "UnitArrearsDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
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
.ChargeReportOfUnitArrearsDetail {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .table-td{
    border-right:1px solid #EBEEF5;width:25%;text-align:center;
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
