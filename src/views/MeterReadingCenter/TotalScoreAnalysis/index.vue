<template>
  <div class="MeterRelationship">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if='this.activeName == "four" && !GeneralSubTableShow'>
        <!-- 总分表分析 -->
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel('index')">导出</el-button>
      </div>
      <div class="bread-contain-right" v-if='this.activeName == "four" && GeneralSubTableShow'>
        <!-- 总分表分析 -->
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel('Son')">导出</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="callBack">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else-if='this.activeName == "two" && !FireMeterShow'>
        <!-- 消防表分析 -->
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel('index')">导出</el-button>
      </div>
      <div class="bread-contain-right" v-else-if='this.activeName == "two" && FireMeterShow'>
        <!-- 消防表分析 -->
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel('Son')">导出</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="callBack">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else-if='this.activeName == "three" && !MonitoringTable'>
        <!-- 监控表分析 -->
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel('index')">导出</el-button>
      </div>
      <div class="bread-contain-right" v-else-if='this.activeName == "three" && MonitoringTable'>
        <!-- 监控表分析 -->
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel('Son')">导出</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="callBack">返回</el-button>
      </div>
    </div>
    <el-tabs class='tabsBlock' type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="总分表分析" name="four">

        <section class="contentIndex" v-if="GeneralSubTableShow">
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <span class="meter-type">子表</span>
            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe border v-if="tableShow" highlight-current-row :max-height="maxHeight" :data="tableSonData.list" class="change-tables-table" show-summary :summary-method='getTotal'>

              <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="bookNo" min-width="100" label="册本号">
              </el-table-column>

              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodWater" min-width="80" label="本期用水" align="right">
              </el-table-column>

              <el-table-column prop="addWater" min-width="80" label="增减水量" align="right">
              </el-table-column>

              <el-table-column prop="realityWater" min-width="80" label="实际用水" align="right">
              </el-table-column>

            </el-table>

          </div>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange1($event, 'GeneralSubTableShow')" @current-change="handleCurrentChange1($event ,'GeneralSubTableShow')" :current-page.sync="tableSonQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableSonQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableSonData.total">
            </el-pagination>
          </div>
        </section>
        <section class="contentIndex" v-if="!GeneralSubTableShow">
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <span class="meter-type">总表</span>

              <el-form-item label="账期：">
                <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="营业所：">
                <el-select clearable v-model="tableQuery.businessAbode" placeholder>
                  <el-option
                    v-for="item in businessAbodeData"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="模糊查询：" class="width-150">
                <el-tooltip class="item" effect="dark" content="册本号、用户编号、客户名称、装表地址" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="demand"></el-input>
                </el-tooltip>
              </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe border highlight-current-row v-if="tableShow" :max-height="maxHeight" :data="tableData.list" class="change-tables-table"
              :summary-method="getTotal1" show-summary >

              <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="bookNo" min-width="100" label="册本号">
              </el-table-column>

              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>

              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>
              <!--
              <el-table-column prop="ctmAddr" min-width="80" label="客户地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="账期">
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="营业所">
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="总表编号">
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="总表名称">
              </el-table-column>-->

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址">
              </el-table-column>

              <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodWater" min-width="80" label="本期用水" align="right">
              </el-table-column>

              <el-table-column prop="pointsWaterTotal" min-width="100" label="子表总用水量" align="right">
              </el-table-column>

              <el-table-column prop="addWater" min-width="80" label="增减水量" align="right">
              </el-table-column>

              <el-table-column prop="totalPoints" min-width="80" label="分摊水量" align="right">
              </el-table-column>

              <el-table-column prop="realityWater" min-width="80" label="实际用水" align="right">
              </el-table-column>


              <el-table-column prop="mom" min-width="80" label="环比%" align="right">
              </el-table-column>

              <el-table-column label="操作" fixed="right" width="80">
                <template slot-scope="scope">

                  <el-button type="text" size='mini' @click="details('GeneralSubTableShow',scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </section>

      </el-tab-pane>
      <el-tab-pane label="监控表分析" name="three">
        <section class="contentIndex" v-if="MonitoringTable">
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <span class="meter-type">子表</span>
            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe v-if="tableShow" highlight-current-row :max-height="maxHeight" border :data="tableSonData.list" class="change-tables-table" show-summary :summary-method='getTotal'>

              <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="bookNo" min-width="100" label="册本号">
              </el-table-column>

              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>

              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodWater" min-width="80" label="本期用水" align="right">
              </el-table-column>

              <el-table-column prop="addWater" min-width="80" label="增减水量" align="right">
              </el-table-column>

              <el-table-column prop="realityWater" min-width="80" label="实际用水" align="right">
              </el-table-column>
            </el-table>

          </div>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange1($event, 'MonitoringTable')" @current-change="handleCurrentChange1($event, 'MonitoringTable')" :current-page.sync="tableSonQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableSonQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableSonData.total">
            </el-pagination>
          </div>
        </section>
        <section class="contentIndex" v-if="!MonitoringTable">

          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <span class="meter-type">监控表</span>

              <el-form-item label="账期：">
                <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月">
                </el-date-picker>
              </el-form-item>

              <!-- <el-form-item label="营业所：">
                <el-select clearable v-model="tableQuery.businessAbode" placeholder>
                  <el-option
                    v-for="item in businessAbodeData"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item label="模糊查询：" class="width-150">
                <el-tooltip class="item" effect="dark" content="册本号、用户编号、客户名称、装表地址" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="demand"></el-input>
                </el-tooltip>
              </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
              </el-form-item>

            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe border v-if="tableShow" highlight-current-row :max-height="maxHeight" :data="tableData.list" class="change-tables-table">

              <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="bookNo" min-width="100" label="册本号">
              </el-table-column>

              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>

              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>
              <!--
              <el-table-column prop="ctmName" min-width="80" label="账期">
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="营业所">
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="总表编号">
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="总表名称">
              </el-table-column>

              <el-table-column prop="ctmAddr" min-width="80" label="客户地址" show-overflow-tooltip>
              </el-table-column>-->

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodWater" min-width="80" label="本期用水" align="right">
              </el-table-column>

              <el-table-column prop="addWater" min-width="80" label="增减水量" align="right">
              </el-table-column>

              <el-table-column prop="realityWater" min-width="80" label="实际用水" align="right">
              </el-table-column>

<!--              <el-table-column prop="mom" min-width="80" label="环比%" align="right">-->
<!--              </el-table-column>-->

              <el-table-column prop="pointsWaterTotal" min-width="80" label="分表水量和" align="right">
              </el-table-column>

              <el-table-column prop="lossRate" min-width="80" label="漏失率%" align="right">
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="80">
                <template slot-scope="scope">

                  <el-button type="text" size='mini' @click="details('MonitoringTable',scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </section>

      </el-tab-pane>
      <el-tab-pane label="消防表分析" name="two">
        <section class="contentIndex" v-if="FireMeterShow">
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <span class="meter-type">分摊表</span>
            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe border v-if="tableShow" highlight-current-row :max-height="maxHeight" :data="tableSonData.list" class="change-tables-table" show-summary :summary-method='getTotal'>

              <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="bookNo" min-width="100" label="册本号">
              </el-table-column>

              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>

              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodWater" min-width="80" label="本期用水" align="right">
              </el-table-column>

              <el-table-column prop="addWater" min-width="80" label="增减水量" align="right">
              </el-table-column>

              <el-table-column prop="realityWater" min-width="80" label="实际用水" align="right">
              </el-table-column>

            </el-table>

          </div>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange1($event, 'FireMeterShow')" @current-change="handleCurrentChange1($event, 'FireMeterShow')" :current-page.sync="tableSonQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableSonQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableSonData.total">
            </el-pagination>
          </div>
        </section>
        <section class="contentIndex" v-if="!FireMeterShow">

          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <span class="meter-type">消防表</span>

              <el-form-item label="账期：">
                <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月">
                </el-date-picker>
              </el-form-item>

              <!-- <el-form-item label="营业所：">
                <el-select clearable v-model="tableQuery.businessAbode" placeholder>
                  <el-option
                    v-for="item in businessAbodeData"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item label="模糊查询：" class="width-150">
                <el-tooltip class="item" effect="dark" content="册本号、用户编号、客户名称、装表地址" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keydown.enter.native="demand"></el-input>
                </el-tooltip>
              </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table stripe border v-if="tableShow" highlight-current-row :max-height="maxHeight" :data="tableData.list" class="change-tables-table">

              <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="bookNo" min-width="100" label="册本号">
              </el-table-column>

              <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip>

              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <!--
              <el-table-column prop="ctmAddr" min-width="80" label="客户地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="账期">
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="营业所" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="总表编号" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmName" min-width="80" label="总表名称" show-overflow-tooltip>
              </el-table-column>-->

              <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodNum" min-width="80" label="本期抄码" align="right">
              </el-table-column>

              <el-table-column prop="currendPeriodWater" min-width="80" label="本期用水" align="right">
              </el-table-column>

              <el-table-column prop="addWater" min-width="80" label="增减水量" align="right">
              </el-table-column>

              <el-table-column prop="realityWater" min-width="80" label="实际用水" align="right">
              </el-table-column>

              <el-table-column prop="mom" min-width="80" label="环比%" align="right">
              </el-table-column>

              <el-table-column prop="shareWater" min-width="80" label="分摊水量" align="right">
              </el-table-column>

              <el-table-column label="操作" fixed="right" width="80">
                <template slot-scope="scope">

                  <el-button type="text" size='mini' @click="details('FireMeterShow',scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </section>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "MeterRelationship",
  components: {

  },
  data () {
    return {
      GeneralSubTableShow: false,//总分表分析
      FireMeterShow: false,//消防表
      MonitoringTable: false,//监控表
      crumbsData: {  //面包屑
        titleList: [
          { title: '抄表开账' },
          { title: '统计' },
          { title: '总分分析' },
        ],

      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: this.common.date('month'),// this.common.date("month"),
        meterUse: '',//"水表用途，总分表为4,监控表为3，消防表为2",
        businessAbode: "",
        fuzzyQuery: ""
      },
      // 查询条件对象
      tableSonQuery: {
        page: 1,
        pageCount: 20,
      },
      //营业所
      businessAbodeData: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      activeName: 'four',
      tableSonData: {},
      totalData: {},
      useNoData: ''
    }
  },
  mounted () {
    this.tradeClassifyDataOptions();
    this.tableQuery.meterUse = '4'
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.MeterRelationship .contentIndex',
      ['.MeterRelationship .contentIndex .toolbar ',
        '.MeterRelationship .contentIndex .block',])
  },
  methods: {
    init () {
      let _this = this
      let params = {
        "busicode": "MrAnalysisList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.tableData = res.list
        _this.totalData = res.total
      })
    },
    //营业所：
    tradeClassifyDataOptions () {
      let params = { busicode: "BusinessAbodeSelect", data: "" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.businessAbodeData = res;
        })
        .catch(res => {
          this.businessAbodeData = [];
        });
    },
    handleClick () {
      this.tableQuery = {
        page: 1,
        pageCount: 20,
        accountPeriod: this.common.date('month'),// this.common.date("month"),
        meterUse: '',//"水表用途，总分表为4,监控表为3，消防表为2",
        businessAbode: "",
        fuzzyQuery: ""
      },
        this.GeneralSubTableShow = false//总分表分析
      this.FireMeterShow = false//消防表
      this.MonitoringTable = false//监控表
      if (this.activeName == 'two') {
        //消防表分析
        this.tableQuery.meterUse = '2'
      } else if (this.activeName == 'three') {
        // 监控表分析
        this.tableQuery.meterUse = '3'
      } else if (this.activeName == 'four') {
        // 总分表分析
        this.tableQuery.meterUse = '4'
      }
      this.init();

    },
    // 返回合计数据
    getTotal (total) {
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },
    // 返回合计数据
    getTotal1 (param) {
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray = ['合计']
      console.log(vm.totalData)
      selectedColm.forEach(a => {
        console.log(a.property)
        if (vm.totalData[a.property] || vm.totalData[a.property] == 0 || vm.totalData[a.property] == '0') {//与表格列进行匹配
          newArray.push(vm.totalData[a.property])
        } else {
          if (a.property != undefined) {//序号列不push
            newArray.push('')
          }
        }
      });
      sums = newArray;
      sums[2] = ''
      return sums;
    },
    demand () {  //查询
      this.init()
    },
    //   导出
    exportExcel (type) {

      if (type == 'index') {
        let params = {
          "busicode": "MrAnalysisListExport",
          "data": this.tableQuery,
          // token: 'krrjdev123',
          token: sessionStorage.getItem('token'),
          sysType: '002'
        }
        window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
      } else {
        let params = {
          "busicode": "MrAnalysisQueryExport",
          "data": {
            "page": this.tableSonQuery.page,
            "pageCount": this.tableSonQuery.pageCount,
            "userNo": this.useNoData,
            "accountPeriod": this.tableQuery.accountPeriod
          },
          // token: 'krrjdev123',
          token: sessionStorage.getItem('token'),
          sysType: '002'
        }
        window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
      }
    },
    //分页
    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange (val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    //子表分页
    handleSizeChange1 (val, tabName) { //显示多少数据一页
      this.tableSonQuery.pageCount = val
      this.tableSonQuery.page = 1
      this.details(tabName)
    },
    handleCurrentChange1 (val, tabName) {  //显示多少页码
      this.tableSonQuery.page = val
      this.details(tabName)
    },
    indexMethod (index) {//获取表格序号
      return (index + 1);

    },
    details (val, row) {
      if (row) {
        this.useNoData = row.userNo
      }
      let params = {
        busicode: "MrAnalysisQuery",
        data: {
          "page": this.tableSonQuery.page,
          "pageCount": this.tableSonQuery.pageCount,
          "userNo": this.useNoData,
          "accountPeriod": this.tableQuery.accountPeriod
        }
      };
      this.$api
        .fetch({ params })
        .then(res => {
          this.tableSonData = res.detail;
          this.totalData = res.total;
        })
        .catch(res => {
          this.tableSonData = [];
        });
      this[val] = true;
    },
    callBack () {
      this.GeneralSubTableShow = false;
      this.FireMeterShow = false;
      this.MonitoringTable = false;
      this.tableSonQuery.page = 1;
      this.tableSonQuery.pageCount = 20;
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.MeterRelationship {
  width: 100%;
  height: 100%;
  .el-tabs {
    .contentIndex {
      height: 100%;
      overflow: hidden;
    }
    .el-tabs--border-card {
      border: 1px solid #eaf4ff;
    }
    height: calc(100% - 50px);
    .el-tabs__content {
      padding: 5px;
      height: calc(100% - 55px);
      .options {
        padding-left: 15px;
      }
    }
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .meter-type {
    font-weight: bolder;
    display: inline-block;
    line-height: 30px;
    height: 100%;
    font-size: 1rem;
  }
  .el-tabs__content > div {
    height: 100%;
    overflow: auto;
  }
  .is-right{
    .cell{
      text-align: right !important;
    }
  }
}
</style>
