<template>
  <!-- 应收明细 -->
  <div class="ChargeReportOfReceivablesDetailed">
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
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" label-width="75px" label-position="left">
       <!-- <el-row>
          <el-col :span="6">-->

          <el-form-item label="开账时间：" label-width="65px" class="width-150" style="white-space:nowrap">
          <el-date-picker v-model="tableQuery.startAccountPeriod" type="date"  value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <!-- <span class="separator">-</span> -->
        <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">-</span>
          <el-form-item label="" class="width-150">
          <el-date-picker v-model="tableQuery.endAccountPeriod" type="date"  value-format="yyyy-MM-dd" placeholder="结束日期" ></el-date-picker>
        </el-form-item>

          <!--</el-col>
          <el-col :span="6">-->
            <el-form-item label="销账时间：" label-width="65px" class="width-150" style="white-space:nowrap">
          <el-date-picker v-model="tableQuery.startChargeTime" type="date"  value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <!-- <span class="separator">-</span> -->
        <span style="line-height:28px;margin-left:-10px;display:inline-block;text-align:center">-</span>
          <el-form-item label="">
          <el-date-picker v-model="tableQuery.endChargeTime" type="date"  value-format="yyyy-MM-dd"  placeholder="结束日期" ></el-date-picker>
        </el-form-item>
        <el-form-item label='账期：' label-width="35px" class="width-250" style="white-space:nowrap">
              <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始账期" end-placeholder="结束账期">
              </el-date-picker>
            </el-form-item>
         <!-- </el-col>
          <el-col :span="6">-->
            
                      <el-form-item class="button-group">
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
   
         <!-- </el-col>
          <el-col :span="6">-->
            
            <el-form-item label="营业区域：" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea"
                           :show-all-levels="false" :props="tprops" @change="changeBusinessArea">
              </el-cascader>
            </el-form-item>
            <el-form-item label="用水类型：" class="width-150">
              <el-cascader
                v-model="tableQuery.waterTypeId"
                :options="useWaterTypeOptions"
                :show-all-levels="false"
                clearable
                :props="props">
              </el-cascader>
            </el-form-item>
            <el-form-item label="缴费渠道：" class="width-150">
          <el-select  clearable v-model="tableQuery.payChannel" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPC" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div v-show="isActive" class="advancedQuery">
        <el-form-item label="缴费方式：" class="width-150">
          <el-select  clearable v-model="tableQuery.payMethod" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
            
        <!--  </el-col>
        </el-row>-->
        <!-- <el-row> -->
          <!-- <el-col :span="3"> -->
            <el-form-item label="册本：" class="width-150">
              <el-select v-model="tableQuery.bookNos" multiple placeholder="请选择" filterable clearable>
                <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span>
                <el-option-group
                  v-for="group in bookNos"
                  :key="group.index"
                  :label="group.areaStaffName">
                  <el-option
                    v-for="item in group.baseBookListVOList"
                    :key="item.index"
                    :label="item.bookNo"
                    :value="item.bookNo">
                    <span style="float: left">{{ item.bookNo }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="抄表员：" class="width-150">
              <el-select v-model="tableQuery.meterReadingStaffName" placeholder="请选择" @change="changeMeterReadingStaff"  clearable>
                <el-option-group
                  v-for="group in staffAccounts"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userName">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item >

            <el-form-item label="模糊查询：" class="width-150">
               <el-tooltip effect="dark" content="用户编号、客户名称、联合编号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.fuzzyQuery" placeholder="用户编号、客户名称、联合编号" @keydown.enter.native="search" class="userNo"></el-input>
               </el-tooltip>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="3"> -->
            
            <el-form-item label="水表分类：" class="width-150">
          <el-select filterable  ref="select5" clearable v-model="tableQuery.meterType" placeholder="全部">
            <el-option v-for="item in dictDataOptions.MMT" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="3"> -->
            <el-form-item label="应收类型：" class="width-150">
              <el-select v-model="tableQuery.openType" multiple placeholder="请选择">
                <span slot="prefix" v-if="showOpenTypes!=''">{{showOpenTypes}}</span>
                <el-option
                  v-for="(item,index) in dictDataOptions.BTYPE"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="3"> -->
            <el-form-item label="销账状态：" class="width-150">
              <el-select v-model="tableQuery.chargingFlag" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="已销"></el-option>
                <el-option value="0" label="未销"></el-option>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="3"> -->
            <el-form-item label="超阶梯：" class="width-150">
              <el-select v-model="tableQuery.overLadder" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="是"></el-option>
                <el-option value="0" label="否"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否优惠：" class="width-150">
                <el-select v-model="tableQuery.isPref" placeholder="请选择" clearable>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="6"> -->
             <el-form-item label="旧行政区域：" label-width="100px" class="width-150">
              <el-cascader ref="cascader" clearable v-model="tableQuery.oldArea" :options="oldArea"
                           :show-all-levels="false" :props="oprops" >
              </el-cascader>
            </el-form-item>
            
        <el-form-item label="是否专用发票：" label-width="100px" class="width-100">
              <el-select v-model="tableQuery.vatFlag" placeholder="请选择" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            
          <!-- </el-col> -->
        <!-- </el-row> -->
        <!-- <el-row> -->
          <el-form-item label="应收水量：" class="width-100">
            <el-select v-model="tableQuery.more" placeholder="请选择">
              <el-option
                v-for="item in moreOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-100">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldWaterAmountStart" placeholder="应收水量" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item class="width-100">
            <el-select v-model="tableQuery.less" placeholder="请选择">
              <el-option
                v-for="item in lessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-100">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldWaterAmountEnd" placeholder="应收水量" @keydown.enter.native="search" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item label="合计费用："  class="width-100">
            <el-select v-model="tableQuery.moreMoney" placeholder="请选择">
              <el-option
                v-for="item in moreOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="width-100">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldAmountStart" placeholder="合计费用" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item  class="width-100">
            <el-select v-model="tableQuery.lessMoney" placeholder="请选择">
              <el-option
                v-for="item in lessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="width-100">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldAmountEnd" placeholder="合计费用" class="shouldWaterInput"></el-input>
          </el-form-item>
          <!-- </el-row> -->


<!--          <el-form-item label="费用类型">-->
<!--            <el-select v-model="tableQuery.costNos" placeholder="请选择" multiple>-->
<!--              <el-option-->
<!--                v-for="item in costNoList"-->
<!--                :key="item.costNo"-->
<!--                :label="item.costName"-->
<!--                :value="item.costNo">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
       </div>
  <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border show-summary :summary-method='getTotal'  @sort-change='getSort' :data="tableData.list" class="ChargeReportOfReceivablesDetailed-table" @selection-change="getSelectList" @row-click="handleTableCellClick" :cell-style="cellStyle" ref="eltableCurrentRow">
          <el-table-column type="selection" width="60" fixed="left"></el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="130" label="用户编号" fixed="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="200" label="客户名称" fixed="left" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="linkTel" min-width="130" label="手机号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="realityWater" min-width="120" label="应收水量" align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="total" min-width="120" label="合计费用" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column :prop="item.costAttr" :label="item.costName" align="right" min-width="150" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
            <template slot-scope="scope">
              <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="subTotal" min-width="120" label="综合水费" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column> -->

          <el-table-column prop="ctmAddr" min-width="200" label="客户地址" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="账期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingStaffName" min-width="100" label="账单抄表员" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bookNo" min-width="100" label="册本号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="icCardNo" min-width="100" label="IC卡号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="chargeStaffName" min-width="100" label="收费员名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="waterTypeName" min-width="200" label="用水类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="meterTypeName" min-width="100" label="水表分类" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="chargingFlagName" min-width="80" label="销账状态" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="setMeterAddr" min-width="200" label="装表地址" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="businessArea" min-width="120" label="营业区域" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="baseWaterTotal" min-width="120" label="基本水费" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column> -->
          <el-table-column prop="prefPrice" min-width="120" label="优惠单价" align="right" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="prefWater" min-width="120" label="优惠水量" align="right" show-overflow-tooltip >
          </el-table-column>
          <el-table-column prop="waterJ1" min-width="110" label="一阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
           <el-table-column prop="priceJ1" min-width="110" label="一阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
           <el-table-column prop="ladderJ1" min-width="110" label="一阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ2" min-width="110" label="二阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ2" min-width="110" label="二阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ2" min-width="110" label="二阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ3" min-width="110" label="三阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ3" min-width="110" label="三阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ3" min-width="110" label="三阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>


          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="createTime" min-width="180" label="开账时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="informTime" min-width="180" label="通知时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="chargeTime" min-width="180" label="销账时间" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="priorPeriodNum" min-width="80" label="上期始码" align="right" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="currendPeriodNum" min-width="80" label="本期止码" align="right" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="openType" min-width="80" label="应收类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="comments" min-width="180" label="备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="vatFlag" min-width="80" label="是否税票" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="reviewName" min-width="70" label="复核人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="reviewTime" min-width="120" label="复核时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="reviewFlag" min-width="80" label="复核标记" show-overflow-tooltip>
          </el-table-column>
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
  name: "ChargeReportOfReceivablesDetailed",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
       isActive: false, // 控制高级查询内容的显示
      moreOptions:[
        {
          value:"大于等于",
          label:"大于等于"
        },
        {
          value:"大于",
          label:"大于"
        },
        {
          value:"等于",
          label:"等于"
        },
      ],
      lessOptions:[
        {
          value:"小于等于",
          label:"小于等于"
        },
        {
          value:"小于",
          label:"小于"
        },
        {
          value:"等于",
          label:"等于"
        },
      ],
      // 列表数据
      tableData: {},
      totalData: {},
      costNameList:[],
      costNoList:[],
      bookNos:[],
      staffAccounts:[],
      openAccountDate: [],
      businessAreaName:'',
      //查询条件对象
      tableQuery: {
        startChargeTime:'',
        endChargeTime:'',
        page: 1,
        pageCount: 20,
        bookNos:[],
        fuzzyQuery:'',
        startAccountPeriod:'',
        endAccountPeriod:'',
        startPeriod:'',
        endPeriod:'',
        waterTypeId: '',
        businessArea:'',
        oldArea:'',
        shouldAmountStart:'',
        shouldAmountEnd:'',
        chargingFlag:"",
        openType:[],
        vatFlag:'',
        shouldWaterAmountStart:"",
        shouldWaterAmountEnd:"",
        meterReadingStaffName:'',
        more:'大于等于',
        less:'小于',
        moreMoney:'大于等于',
        lessMoney:'小于',
        sort:'',
        meterType: '',//水表分类
        isPref:'',
        payChannel:'',
        payMethod:'',
        overLadder:'',
      },
      //数据字典存值
      dictionaryData: {},
      //展示的册本号
      // showbookNos: '',
      showbookNosData:[],
      // 查询条件日期
      Time: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      tprops:{
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      oprops:{
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      businessArea:[],//营业区域
      oldArea:[],//旧行政区域
      useWaterTypeOptions:[],//用水类型下拉框
      dictDataOptions:[],//水表分类下拉框
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "应收明细" }]
      },
      tableShow: false,
      maxHeight: 0,
      selectList: [],
      // 收费提醒
      receivableMoney: 0,  // 应缴金额
      calculateNum: 0,// 笔数
      accountPeriods: [], // 账期集合
      calculateWater: 0, // 水量
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate()
    // this.Time = [time.getFullYear() +"-"+ month+'-01', time.getFullYear() +"-"+ month +"-"+ lastDay];
  //  this.tableQuery.startAccountPeriod = time.getFullYear() +"-"+ month+'-01';
  //  this.tableQuery.endAccountPeriod = time.getFullYear() +"-"+ month +"-"+ lastDay;

   this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    // this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfReceivablesDetailed .index-page", [
      ".ChargeReportOfReceivablesDetailed .toolbar",
      ".ChargeReportOfReceivablesDetailed .block",
    ]);
    this.SelectUseWaterTypeOptions()
    this.businessAreaSelect();
    this.oldAreaSelect();
    this.getMeterReader();
    this.getCostList();
    this.getDictDataOptions();
    this.getDictionary();
  },
  created() {
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate();
    this.openAccountDate = [time.getFullYear() +"-"+ month+'-01', time.getFullYear() +"-"+ month +"-"+ lastDay];

  },
  computed: {
    showbookNos() {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
    showOpenTypes() {
      return this.dictDataOptions.BTYPE && this.dictDataOptions.BTYPE.filter(item => this.tableQuery.openType.includes(item.value)).map(item => item.name).join(', ')
    },
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this;
      if (this.tableQuery.meterReadingStaffName === '全部'){
        this.tableQuery.meterReadingStaffName = '';
      }
   /*   if (this.tableQuery.less === '<'){
        this.tableQuery.less = '&lt;'
      }
      if (this.tableQuery.lessMoney === '<'){
        this.tableQuery.lessMoney = '&lt;'
      }*/
      let temQuery = JSON.parse(JSON.stringify(this.tableQuery))
      let params = {
        busicode: "ReceivableDetailReport",
        data: this.tableQuery
      };
      params.data.groupCode = localStorage.getItem('companyNo')
      // var bookNos = []
      // temQuery.bookNo.forEach((item,index)=>{
      //   _this.showbookNosData.forEach(item1 => {
      //     if (temQuery.bookNo[index] == item1.bookNo) {
      //       bookNos.push(item1.bookNo);
      //     }
      //   });
      // })
      // params.data.bookNo = bookNos.toString()
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
        _this.costNameList =res.costNameList
        if(_this.tableData.list){
          _this.tableData.list.forEach(item => {
          item.total = this.formatFloat(item.total)
          item.subTotal = this.formatFloat(item.subTotal)
          item.baseWaterTotal = this.formatFloat(item.baseWaterTotal)
          if(item.prefPrice !=="") {
            item.prefPrice = this.formatFloat(item.prefPrice)
          }
          if(item.prefWater !=="") {
            item.prefWater = this.formatFloat(item.prefWater)
          }
          item.waterJ1 = this.removeZero(item.waterJ1)
          item.priceJ1 = this.removeZero(item.priceJ1)
          item.waterJ2 = this.removeZero(item.waterJ2)
          item.priceJ2 = this.removeZero(item.priceJ2)
          item.waterJ3 = this.removeZero(item.waterJ3)
          item.priceJ3 = this.removeZero(item.priceJ3)
          item.waterJ4 =this.removeZero(item.waterJ4)
          item.priceJ4 = this.removeZero(item.priceJ4)
          item.waterJ5 =this.removeZero(item.waterJ5)
          item.priceJ5 = this.removeZero(item.priceJ5)
          item.waterJ6 =this.removeZero(item.waterJ6)
          item.priceJ6 = this.removeZero(item.priceJ6)
          if (item.priceJ1!=="") {
            item.priceJ1 = this.formatFloat(item.priceJ1)
          }
          if (item.priceJ2!=="") {
            item.priceJ2 = this.formatFloat(item.priceJ2)
          }
          if (item.priceJ3!=="") {
            item.priceJ3 = this.formatFloat(item.priceJ3)
          }
          if (item.priceJ4!=="") {
            item.priceJ4 = this.formatFloat(item.priceJ4)
          }
          if (item.priceJ5!=="") {
            item.priceJ5 = this.formatFloat(item.priceJ5)
          }
          if (item.priceJ6!=="") {
            item.priceJ6 = this.formatFloat(item.priceJ6)
          }
          item.costList.forEach(child => {
            child.money = this.formatFloat(child.money)
          })
          item.penaltyMoney = this.formatFloat(item.penaltyMoney)
        })

        }

        if(_this.totalData){
          _this.totalData.total = this.formatFloat(_this.totalData.total)
          _this.totalData.subTotal = this.formatFloat(_this.totalData.subTotal)
          _this.totalData.znFee = this.formatFloat(_this.totalData.znFee)
          _this.totalData.ecFee = this.formatFloat(_this.totalData.ecFee)
          _this.totalData.wsWater = this.formatFloat(_this.totalData.wsWater)
          _this.totalData.bzsWater = this.formatFloat(_this.totalData.bzsWater)
          _this.totalData.wasteFee = this.formatFloat(_this.totalData.wasteFee)
          _this.totalData.baseWaterTotal = this.formatFloat(_this.totalData.baseWaterTotal)
          _this.totalData.prefWater = this.formatFloat(_this.totalData.prefWater)
          _this.totalData.penaltyMoney = this.formatFloat(_this.totalData.penaltyMoney)
        }
        
       

      })
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 数据字典
    getDictionary() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BPI,BPC"//收费类型、缴费方式
      };
      this.$api.fetch({
        params: dictionaryDataParams
      }).then(res => {
        res.BPI = [...[{ name: "全部", value: "" }], ...res.BPI]
        res.BPC = [...[{ name: "全部", value: "" }], ...res.BPC]
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startPeriod = date[0]
        this.tableQuery.endPeriod = date[1]
      } else {
        this.tableQuery.startPeriod = ''
        this.tableQuery.endPeriod = ''
      }
    },
    changeBusinessArea(){
      if (this.tableQuery.businessArea){
        this.getBooks();
      }else {
        this.bookNos = [];
      }
      this.getMeterReader();

    },

    changeMeterReadingStaff(){
      this.getBooks();
    },
    getBooks(){
      // if (this.tableQuery.meterReadingStaffName){
        let params ={
          busicode:'baseAllBooks',
          data:{
            businessArea:this.tableQuery.businessArea,
            meterReadingStaff:this.tableQuery.meterReadingStaffName,
          }
        };
        this.$api
          .fetch({
            params, //参数
          })
          .then((res) => {
            this.tableQuery.bookNos = []
            this.bookNos = [...res];
            this.showbookNosData = []
            this.bookNos.forEach(item => {
              item.baseBookListVOList.forEach(child => {
                this.showbookNosData.push(child)
              })
            })
          });
      // }else {
      //   this.bookNos = [];
      //   this.showbookNosData = [];
      // }

    },
    getDatePickerCharge(date){
      if (date !== undefined && date !== null) {
        this.tableQuery.startChargeTime = date[0]
        this.tableQuery.endChargeTime = date[1]
      } else {
        this.tableQuery.startChargeTime = ''
        this.tableQuery.endChargeTime = ''
      }
    },
    // 获取水表分类下拉数据
    getDictDataOptions() {
      let params = {
        "busicode": "DictionarySelect",
        "data": 'MMT,BTYPE'
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
       this.dictDataOptions = res
      })
    },
    //抄表员下拉框数据
    getMeterReader() {
      let _this = this;
      let params = {
        busicode: "PostUserList",
        data: {
          postNo: "2",
          businessArea:this.tableQuery.businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.staffAccounts = res;
        });
    },
    // 导出
    exportExcel() {
      // let temQuery = JSON.parse(JSON.stringify(this.tableQuery))
      // var bookNos = []
      // temQuery.bookNo.forEach((item,index)=>{
      //   this.showbookNosData.forEach(item1 => {
      //     if (temQuery.bookNo[index] == item1.bookNo) {
      //       bookNos.push(item1.bookNo);
      //     }
      //   });
      // })
      let params = {
        "busicode": "ReceivableDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
       params.data.groupCode = localStorage.getItem('companyNo')
      // params.data.bookNo = bookNos.toString()
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    getSort(sort){
      console.log(sort);
      if (sort.prop === '智能表改造费'){
        sort.prop = 'znFee'
      }else if (sort.prop === '二次供水服务费'){
        sort.prop = 'ecFee'
      }else if (sort.prop === "不征税自来水"){
        sort.prop = 'bzsWater'
      }else if (sort.prop === '污水费'){
        sort.prop = 'wsWater'
      }else if (sort.prop === '垃圾费'){
        sort.prop = 'wasteFee'
      }
      /*if (sort.prop === 'waterJ1' || sort.prop === 'priceJ1' || sort.prop === 'waterJ2' || sort.prop === 'priceJ2' || sort.prop === 'waterJ3' || sort.prop === 'priceJ3'
        || sort.prop === 'waterJ4' || sort.prop === 'priceJ4' || sort.prop === 'waterJ5' || sort.prop === 'priceJ5' || sort.prop === 'waterJ6' || sort.prop === 'priceJ6'){
        sort.prop = sort.prop.substring(0,5) + '_'+ sort.prop.substring(5);
      }*/
      /*if(sort.prop === 'setMeterAddr'){
        sort.prop = 'SETUP_METER_ADDR'
      }else if (sort.prop === 'ctmName'){
        sort.prop = 'ctm_name'
      }
      if(sort.prop === 'chargeTime'){
        sort.prop = 'CHARGE_TIME'
      }*/
      if (sort.order === 'descending'){
          this.tableQuery.sort = 'a.' + sort.prop + ' DESC';
      }else if (sort.order === 'ascending'){
          this.tableQuery.sort = 'a.' + sort.prop + ' ASC';
      }else {
        this.tableQuery.sort = '';
      }
      this.init();
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
      this.tableData.list = this.selectList
      this.totalData.list = this.selectList
      console.log(this.totalData.list);
      const list = this.tableData.list 
      for(let i = 0; i < list.length; i++) {
        data += `<tr>
      <td>${i+ 1}</td>
      <td>${list[i].userNo}</td>
      <td>${list[i].ctmName}</td>
      <td>${list[i].linkTel}</td>

      <td>${list[i].realityWater}</td>
      <td>${list[i].total}</td>
      <td>${list[i].subTotal}</td>
      <td>${list[i].sf}</td>
      <td>${list[i].ctmAddr}</td>
      <td>${list[i].accountPeriod}</td>
      <td>${list[i].meterReadingDate}</td>
      <td>${list[i].meterReadingStaffName}</td>
      <td>${list[i].bookNo}</td>
      <td>${list[i].icCardNo}</td>
      <td>${list[i].chargeStaffName}</td>
      <td>${list[i].waterTypeName}</td>
      <td>${list[i].meterTypeName}</td>
      <td>${list[i].chargingFlagName}</td>
      <td>${list[i].setMeterAddr}</td>
      <td>${list[i].businessArea}</td>
      <td>${list[i].prefPrice}</td>
      <td>${list[i].prefWater}</td>
      <td>${list[i].waterJ1}</td>
      <td>${list[i].priceJ1}</td>
      <td>${list[i].ladderJ1}</td>
      <td>${list[i].waterJ2}</td>
      <td>${list[i].priceJ2}</td>
      <td>${list[i].ladderJ2}</td>
      <td>${list[i].waterJ3}</td>
      <td>${list[i].priceJ3}</td>
      <td>${list[i].ladderJ3}</td>
      <td>${list[i].penaltyMoney}</td>
      <td>${list[i].createTime}</td>
      <td>${list[i].informTime}</td>
      <td>${list[i].chargeTime}</td>
      <td>${list[i].priorPeriodNum}</td>
      <td>${list[i].currendPeriodNum}</td>
      <td>${list[i].openType}</td>
      <td>${list[i].comments }</td>
      <td>${list[i].vatFlag}</td>
      <td>${list[i].reviewName}</td>
      <td>${list[i].reviewTime}</td>
      <td>${list[i].reviewFlag}</td>
      </tr>`
      }
      let j = 0
      let sRealityWater = 0 //勾选的应收水量合计
      let sTotal = 0 //勾选的合计费用合计
      let sSubTotal = 0
      let sSf = 0
      let sPrefWater = 0
      let sWaterJ1 = 0
      let sLadderJ1 =0
      let sLadderJ2 = 0
      let sLadderJ3 = 0
      let sPenaltyMoney = 0
      for ( j; j < this.totalData.list.length; j++) {
        sRealityWater += this.totalData.list[j].realityWater;
        sTotal += this.totalData.list[j].total;
        sSubTotal += this.totalData.list[j].subTotal;
        sSf += this.totalData.list[j].sf;
        sPrefWater += this.totalData.list[j].prefWater;
        sWaterJ1 += this.totalData.list[j].waterJ1;
        sLadderJ1 += this.totalData.list[j].ladderJ1;
        sLadderJ2 += this.totalData.list[j].ladderJ2;
        sLadderJ3 += this.totalData.list[j].ladderJ3;
        sPenaltyMoney += this.totalData.list[j].penaltyMoney;
      }
      data += `<tr>
      <td>合计</td>
      <td></td>
      <td></td>
      <td></td>
      <td>${sRealityWater}</td>
      <td>${sTotal}</td>
      <td>${sSubTotal}</td>
      <td>${sSf}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>${sPrefWater}</td>
      <td>${sWaterJ1}</td>
      <td></td>
      <td>${sLadderJ1}</td>
      <td></td>
      <td></td>
      <td>${sLadderJ2}</td>
      <td></td>
      <td></td>
      <td>${sLadderJ3}</td>
      <td>${sPenaltyMoney}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      </tr>`
      let str = `<table border=1 cellpadding=0 cellspacing=0>
      <theader>
      <tr>
      <th>NO.</th>
      <th>用户编号</th>
      <th>客户名称</th>
      <th>手机号</th>
      <th>应收水量</th>
      <th>合计费用</th>
      <th>综合水费</th>
      <th>水费</th>
      <th>客户地址</th>
      <th>账期</th>
      <th>抄表日期</th>
      <th>账单抄表员</th>
      <th>册本号</th>
      <th>IC卡号</th>
      <th>收费员名称</th>
      <th>用水类型</th>
      <th>水表分类</th>
      <th>销账状态</th>
      <th>装表地址</th>
      <th>营业区域</th>
      <th>优惠单价</th>
      <th>优惠水量</th>
      <th>一阶水量</th>
      <th>一阶水价</th>
      <th>一阶金额</th>
      <th>二阶水量</th>
      <th>二阶水价</th>
      <th>二阶金额</th>
      <th>三阶水量</th>
      <th>三阶水价</th>
      <th>三阶金额</th>
      <th>违约金</th>
      <th>开账时间</th>
      <th>通知时间</th>
      <th>销账时间</th>
      <th>上期始码</th>
      <th>本期止码</th>
      <th>应收类型</th>
      <th>备注</th>
      <th>是否税票</th>
      <th>复核人</th>
      <th>复核时间</th>
      <th>复核标记</th>
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
    getTotal(param){
      // let arr = ['合计', '']
      // for (const key in this.totalData) {
      //   if (this.totalData[key] != '合计') {
      //     arr.push(this.totalData[key])
      //     /*if(key === 'costList') {
      //       this.totalData.costList.forEach(item=>{
      //           arr.push(item.money)
      //       })
      //     }*/
      //   }
      // }
      // console.log(arr);
      // return arr
      // console.log(param.columns,33121)
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=['合计','']
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
      sums[2] = ''
      // console.log(sums,999999)
      return sums;
    },
    getCostList(){
      let params = {
        busicode: "CostList",
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.costNoList = res;
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
    oldAreaSelect() {   //旧行政区域下拉框
      let _this = this
      let params = {
        "busicode": "OldAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.oldArea = data.children;
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
    // 勾选
    getSelectList (e) {
      this.selectList = e
      this.receivableMoney = 0
      this.accountPeriods = []
      this.calculateNum = 0
      this.calculateWater = 0
      this.selectList.forEach(item => {
        this.receivableMoney += Number(item.total || 0)
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
    // 快捷查询
    toDetail(userNo){
      let routeUrl = this.$router.resolve({ path: '/UserInfoSearchDetail'});
      sessionStorage.setItem('userNo',userNo)
      window.open(routeUrl.href, '_blank');
      sessionStorage.removeItem('userNo')
    },
    formatFloat(num){
      var value = Math.round(parseFloat(num) * 100 ) / 100;
      var arrayNum = value.toString().split(".");
      if (arrayNum.length == 1) {
        return value.toString() + ".00"
      }
      if (arrayNum.length > 1) {
        //小数点右侧 如果小于两位则补一个0
        if ( arrayNum[1].length < 2) {
          return value.toString() +"0" ;
        }
        return value;
      }
    },
    removeZero(value){
      if (value==0) {
        return value = ''
      }else{
        return value
      }
    },
     // 高级查询按钮
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up")
        this.isActive = false
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down")

        this.isActive = true
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
     this.common.changeTable(this, ".ChargeReportOfReceivablesDetailed .index-page", [
      ".ChargeReportOfReceivablesDetailed .toolbar",
      ".ChargeReportOfReceivablesDetailed .block",
    ]);
    this.maxHeight -= 1;
      })
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
        this.tableQuery.startPeriod = val[0]
        this.tableQuery.endPeriod = val[1]
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.ChargeReportOfReceivablesDetailed {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 42px);
  }
}
/deep/{
  .el-table {
    margin-top: 15px;
    .el-table__fixed { // 左固定列
      height: auto !important;
    }
    .el-table__fixed-right { // 右固定列
      height: auto !important;
    }
    .el-table__body-wrapper{
      z-index: 2;
    }
  }
}

/deep/{
  // 第一行
  .item{
    width: 22%;
    .el-form-item__content{
      width: calc(100% - 73px);
    }
  }
  .dateAndTime{
    width: 25%;
    .el-form-item__content{
      width: 75%;
      .el-date-editor{
        width: 100%;
      }
    }
  }
  .shouldWater{
    width: 100%;
    .el-input__inner{
      width: 100%;
    }
  }

  // 第二行
  .el-col-3{
    width: auto;
  }

  // 第三行
  .shouldWaterInput{
    width: auto;
  }
}
.userNo >>> .el-input__inner{
  width: 100%;
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
/deep/{
    .el-table__body .el-table__row{
      td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
        .cell{
          text-align: right !important;
        }
      }
    }
    .el-table__header{
      th:nth-child(5),th:nth-child(6),th:nth-child(13),th:nth-child(29),th:nth-child(30),th:nth-child(31),th:nth-child(32),th:nth-child(33),th:nth-child(34){
        .cell{
          text-align: right !important;
        }
      }
    }
    .el-table__footer{
      td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
        .cell{
          text-align: right !important;
        }
      }
    }
  }
</style>

<style lang="scss">
.ChargeReportOfReceivablesDetailed{
      .el-table__row .is-right {
        .cell {
          text-align: right !important;
        }
      }
}
</style>
