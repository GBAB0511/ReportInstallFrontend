<template>

  <div class="InvoiceReplacement">
    <!--<printStyle :companyNo="tableQuery.companyNo" v-if="printStyleShow" :printStyleData="printStyleData"></printStyle>-->
    <el-dialog append-to-body width="60%" :title="billVisibleName" :destroy-on-close="true" :visible.sync="showBillVisible" :close-on-click-modal="false" @close="closeBillDialog">
      <el-form style="margin:2%" size="mini" :model="billform" label-width="130px" label-position="right" :inline="true" :rules="rules" class="formBill" ref="billform">

        <el-form-item label="单位名称：" prop="invoiceTitle" class="f2">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.invoiceTitle" clearable size="mini" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>

        <el-form-item label="纳税人识别号：" prop="invoiceTax" class="f2">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.invoiceTax" clearable size="mini" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>

        <el-form-item label="联系地址：" prop="invoiceAddr" class="f2">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.invoiceAddr" clearable size="mini" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>

        <el-form-item label="座机号码：" prop="invoiceLink" class="f2">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.invoiceLink" clearable size="mini" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="invoiceBank" class="f2">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.invoiceBank" clearable size="mini" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>

        <el-form-item label="银行账户：" prop="invoiceAccount" class="f2">
          <el-input @input="validateNum1()" v-model="billform.invoiceAccount" clearable size="mini" ></el-input>
        </el-form-item>

        <el-form-item label="增值税标记：" prop="vatFlag" style="width:calc(30% + 8px)">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.serialNo" clearable size="mini"></el-input> -->
          <el-select clearable v-model="billform.vatFlag" placeholder="">
            <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知人手机号：" prop="stopWaterLinkMobile" style="width:calc(30% + 8px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.stopWaterLinkMobile" clearable size="mini" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件：" prop="emailAddr" style="width:calc(30% + 8px)">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="billform.emailAddr" clearable size="mini" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="合并开票：" prop="mergeInvoicing" style="width:calc(30% + 8px)">
          <el-select clearable v-model="billform.mergeInvoicing" placeholder="">
            <el-option v-for="item in isMergeOrNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitBillForm">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeBillDialog">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="补录专票" width="60%" height="70%" :visible.sync="showVat" class="vat-dialog" append-to-body>

      <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
        <el-form-item label="请录入发票编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  width="200px" v-model="vatInvoiceNo" placeholder="" clearable @input="e => input = inputMe(e)"></el-input>

        </el-form-item>
        <el-form-item label="(请在开票完成后录入发票编号,并确定保存)">
        </el-form-item>

        <el-table stripe border :data="resultList" class="change-tables-table">
          <el-table-column prop="commodityName" min-width="100" label="商品名称"></el-table-column>
          <el-table-column prop="amount" min-width="120" label="数量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="price" min-width="100" label="单价"></el-table-column>
          <el-table-column prop="money" min-width="100" label="金额"></el-table-column>
          <el-table-column prop="taxRate" min-width="80" label="税率"></el-table-column>
          <el-table-column prop="taxMoney" min-width="80" label="税额"></el-table-column>
        </el-table>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveVat" size="mini">保 存</el-button>
        <el-button type="info" @click="closeVatDialog" size="mini">取 消</el-button>
      </div>

    </el-dialog>
    <!-- 电子发票预览打印弹窗-->
    <el-dialog title="电子发票" width="50%" height="40%" :destroy-on-close="true" append-to-body :close-on-click-modal="false" :visible.sync="ZBSFinvoiceShow" @close="closeZBSFinvoiceDialog">
      <el-table stripe border :data="ZBSFinvoiceData">
        <el-table-column prop="invoiceSort" min-width="60" label=""></el-table-column>
        <el-table-column prop="ZBSFinvoiceAddr" min-width="320" label="电子发票地址" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click.stop="copyRow(scope.row)">复制</el-button> -->
            <el-button type="text" @click.stop="previewRow(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

        <el-form-item v-show="chargeFlag" label="账期：">
          <el-date-picker v-model="tableQuery.accountPeriod" type="month" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
        </el-form-item>

        <el-form-item v-show="!chargeFlag" label="收费日期：">
          <el-date-picker v-model="Time" type="daterange" value-format="yyyy-MM-dd" start-placeholde="开始日期" end-placeholde="结束日期" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="模糊查询：" class="width-250">
          <el-tooltip class="item" effect="dark" content="账户编号、用户编号、用户名称、客户编号、发票号、银行账号、手机号查询、开票人" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search" @input="e => input = inputMe(e)"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-if="showInvoice" v-model="chargeFlag">预开票</el-checkbox>
          <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
        <br>
        <el-form-item v-show="!chargeFlag" label="票据类型：">
          <el-select v-model="tableQuery.invoiceType" @change="gettemplateId()" size="mini" clearable>
            <el-option v-for="item in pjList" :key="item.invoiceNo" :label="item.invoiceName" :value="item.invoiceNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="!chargeFlag" label="发票状态：">
          <el-select v-model="tableQuery.openInvoice" size="mini" clearable>
            <el-option v-for="item in pjState" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="!chargeFlag" label="收费员：">
          <el-select v-model="tableQuery.chargeStaff" size="mini" clearable>
            <el-option v-for="item in chargeStaffList" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="!chargeFlag" label="收费方式：">
           <el-select ref="select1" clearable v-model="tableQuery.payMethod" placeholder>
            <el-option v-for="(item,index) in dictionaryData.BPI" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专票用户：">
          <el-select v-model="tableQuery.vatFlag" size="mini" clearable>
            <el-option key=1 label="是" value=1></el-option>
            <el-option key=0 label="否" value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费批次号：" class="width-250">

          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.serialNo" placeholder="缴费批次号" clearable size="mini" @keydown.enter.native="search" @input="e => input = inputMe(e)"></el-input>

        </el-form-item>
        <br>
        <el-form-item label="票据提醒：" class="width-350">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.invoiceTypes" placeholder="" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <!--  <el-form-item label="发票合计金额：">
          <span><em style="font-family: normal; color: red;">{{countMoneyTotal}}</em> 元</span>
        </el-form-item>-->

        <el-form-item class="form-right">
          <el-tooltip class="item" effect="dark" content="用于卡纸等情况，采用原来的票号重新打印，不支持电子发票重开" placement="top">
            <el-checkbox v-model="formData.reprint">重打</el-checkbox>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="多行明细记录合在一张票中开具" placement="top">
            <el-checkbox v-model="formData.isTogether">合打</el-checkbox>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查询出的所有记录全部打印（不限本页）" placement="top">
            <el-checkbox v-model="formData.all">全打</el-checkbox>
          </el-tooltip>
          <!--   <el-button size="mini" type="primary" @click="openVat" class="btn-green"
             >开具专票</el-button>

         <span :key="col.invoiceNo"  v-for='(col) in typeList' @click="printInvoicenew(col.invoiceNo)">
           <el-button v-if="col.invoiceNo == 'ZBSF' && !noPrintReceipt" size="mini" type="primary"
              >开具{{col.invoiceName}}</el-button></span>f
            <span @click="printInvoicenew(col.invoiceNo)" v-for='(col) in typeList' :key="col.invoiceNo">
              <el-button size="mini" type="primary" v-if=" col.invoiceNo == 'ZBSF'&& noPrintReceipt" class="btn-green">
                开具{{col.invoiceName}}</el-button></span>
                <span @click="printInvoicenew(col.invoiceNo)" v-for='(col) in typeList' :key="col.invoiceNo">
              <el-button size="mini" type="primary" v-if="col.invoiceNo !== 'ZBSF'" class="btn-green">
                开具{{col.invoiceName}}</el-button></span> -->
          <el-dropdown @command="printDetail">
            <el-button size="mini" type="primary">
              发票明细<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(col) in typeList" v-text="col.invoiceName" :key="col.invoiceNo" :command="col.invoiceNo"></el-dropdown-item>
              <el-dropdown-item v-text="'专用发票'" command="ZYFP"></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown @command="openInvoice">
            <el-button size="mini" type="primary" class="btn-green">
              开具<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(col) in typeList" v-text="col.invoiceName" :key="col.invoiceNo" :command="col.invoiceNo"></el-dropdown-item>
              <el-dropdown-item v-text="'专用发票'" command="ZYFP"></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- <span v-else-if="col.invoiceNo == 'LJFP'">
                <el-button size="mini" type="primary" @click="printInvoicenew(col.invoiceNo)"
              v-for='(col) in typeList'
              :key="col.invoiceNo">打印{{col.invoiceName}}</el-button>
              </span> -->
          <!--el-button v-for="item in baseInvoiceData.list" :key="item.id" size="mini" type="primary" @click="printInvoice(item)">打印{{item.invoiceName}}</el-button-->
          <!--el-button size="mini" type="primary" @click="print('zhuanyong')">打印专用发票</el-button-->
          <!-- <el-button @click="exportExcel" size="mini" type="primary">打印电子发票</el-button> -->

          <!-- <el-button @click="exportExcel" size="mini" type="primary">打印增值税发票</el-button> -->
          <!-- <el-button size="mini" type="primary" @click="cancelVat"
              >作废专票</el-button>
          <el-button size="mini" type="primary" @click="voidBill(col.invoiceNo)"
              v-for='(col) in typeList'
              :key="col.invoiceNo" class="btn-margin">作废{{col.invoiceName}}</el-button> -->

          <el-dropdown @command="cancelInvoice">
            <el-button size="mini" type="primary">
              作废<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(col) in typeList" v-text="col.invoiceName" :key="col.invoiceNo" :command="col.invoiceNo"></el-dropdown-item>
              <el-dropdown-item v-text="'专用发票'" command="ZYFP"></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button size="mini" type="primary" @click="updateBill" class="btn-gray">开票资料修改</el-button>
          <!-- <el-button @click="voidBill" size="mini" type="primary">开具发票</el-button> 
          <el-button size="mini" type="primary" v-if="showReceiptButton" @click="print()">打印收据</el-button>-->
        </el-form-item>
        <br>
        <div class="costMoney-box">
         <el-form-item class="costMoney" v-for="item in costMoneyList" :key="item.costNo">
          <span v-if="item.costMoney > 0">{{item.costName}}<em style="color:red;font-size:14px">{{item.costMoney}}</em> 元</span>
        </el-form-item>
        </div>

      </el-form>
    </div>
    <div class="kl-table common-diaTab" :style="{height: maxHeight + 'px'}">
      <el-table stripe border v-if="tableShow" highlight-current-row :max-height="maxHeight" @selection-change="getSelectData" :data="tableData.list" :row-class-name="tableRowClass" class="change-tables-table" @cell-dblclick="celldblclickCopy" @cell-click="handleTableCellClick" ref="eltableCurrentRow" @sort-change='sortChange' :cell-style="cellStyle">
        <!-- <el-table-column type="selection" :selectable='checkboxT' width="50" fixed="left">
        </el-table-column> :span-method="arraySpanMethod" -->

        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod" style="cursor:pointer">
        </el-table-column>
        <el-table-column prop="userNo" min-width="160" fixed="left" :sortable="'custom'" :sort-orders="['descending','ascending',null]" label="用户编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="serialNo" min-width="200" fixed="left" label="缴费批次号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip>
        </el-table-column>

        <!-- <el-table-column prop="ctmName" min-width="200" label="客户名称">
        </el-table-column> -->
        <el-table-column prop="accountPeriod" min-width="70" label="账期">
        </el-table-column>
        <el-table-column prop="waterTypeName" min-width="120" label="用水类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="priorPeriodNum" min-width="120" label="上期抄码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="currendPeriodNum" min-width="120" label="本期抄码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="calculateWater" min-width="80" label="计费水量">
          <template slot-scope="scope">
            <span style="color:#606266;font-size:14px">{{scope.row.calculateWater}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" min-width="80" label="合计金额">
          <template slot-scope="scope">
            <span style="color:#606266;font-size:14px">{{scope.row.totalMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" min-width="90" label="水费单价">
        </el-table-column>
        <template v-for='(col) in costList'>
          <el-table-column show-overflow-tooltip :prop="col.costNo" :label="col.costName" :key="col.costNo" v-if="col.costName.length>0" :min-width="90">
          </el-table-column>
        </template>
        <!--el-table-column prop="sf" min-width="80" label="水费">
        </el-table-column>
        <el-table-column prop="wsclf" min-width="80" label="污水费">
        </el-table-column
        <el-table-column prop="ljclf" min-width="80" label="垃圾费">
        </el-table-column>-->
        <el-table-column prop="penaltyMoney" min-width="80" label="违约金">
        </el-table-column>
        <el-table-column prop="chargeTime" min-width="150" label="收费时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="payMethod" min-width="80" label="收费方式">
        </el-table-column>

        <el-table-column prop="vatFlag" min-width="80" label="专票用户">
          <template slot-scope="scope">
            <div v-if="scope.row.vatFlag == 1">是</div>
            <div v-if="scope.row.vatFlag == 0">否</div>
          </template>
        </el-table-column>

        <!--<el-table-column prop="invoiceAddr" min-width="125" label="电子发票地址">
            <template slot-scope="scope">
              <input :id="'invoiceAddr' + getIndex(scope.row.invoiceAddr)" class="table-addr" :readonly="true" @click="handleInvoiceAddrClick(scope.row.invoiceAddr)" :value="scope.row.invoiceAddr" />
            </template>
        </el-table-column>
        <el-table-column prop="ZYFP" min-width="100" label="专票票号" show-overflow-tooltip>
        </el-table-column>-->
        <!--根据票据类型显示对应发票号码
        <template v-for='(col) in typeList'>
           <el-table-column
             show-overflow-tooltip
             :prop="col.invoiceNo"
             :label="col.invoiceName+'号'"
             :key="col.invoiceNo"
             v-if="col.invoiceName.length>0"
             :min-width="20*(col.invoiceName.length+1)">
           </el-table-column>
        </template>-->
        <el-table-column :key="col.invoiceNo" :label="col.invoiceName" v-for='(col) in pjList' align="center">
          <el-table-column v-if="col.invoiceNo == 'ZBSF' || col.invoiceNo == 'CZLJ' || col.invoiceNo == 'CZWS'" :prop="col.invoiceNo+'invoiceAddr'" min-width="250">
            <template slot="header">
              <span style="color:#111">电子发票地址
                <el-tooltip placement="top" effect="light">
                  <template slot="content">
                    <div style="font-size:16px;line-height: 20px;">
                      <span style="color:#62A8F2;">提示：直接双击内容即可复制电子发票地址</span>
                    </div>
                  </template>
                  <i class="el-icon-warning-outline" style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
                </el-tooltip>
              </span>
            </template>
            <template slot-scope="scope">
              <input :id="'invoiceAddr' + getIndex(scope.row[col.invoiceNo+'invoiceAddr'])" class="table-addr" :readonly="true" @click="handleInvoiceAddrClick(scope.row[col.invoiceNo+'invoiceAddr'])" :value="scope.row[col.invoiceNo+'invoiceAddr']" />
            </template>
          </el-table-column>
          <el-table-column :prop="col.invoiceNo+'invoiceNo'" :min-width="20*(col.invoiceName.length+1)" label="票号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column :prop="col.invoiceNo+'invoiceStaff'" :min-width="20*(col.invoiceName.length+1)" label="开票人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column :prop="col.invoiceNo+'invoiceTime'" :min-width="40*(col.invoiceName.length+1)" label="开票时间" show-overflow-tooltip>
          </el-table-column>
        </el-table-column>

        <!--<el-table-column prop="invoiceStaff" min-width="80" label="开票人">
        </el-table-column>
        <el-table-column prop="invoiceTime" min-width="120" label="开票时间" show-overflow-tooltip>
        </el-table-column>-->
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block">

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 50 ,100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
//import printStyle from "@/components/printStyle.vue"
export default {
  name: "InvoiceReplacement",
  props: ['fuzzyQuery', 'accountNo', 'userNo'],
  data () {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '财务中心', path: '/InvoiceReplacement' },
          { title: '票据管理', method: () => { window.histroy.back() } }
        ],

      },
      showInvoice: false,//隐藏预开票
      rules: {
        vatFlag: [{ required: true, message: "增值税标识不能为空", trigger: 'blur' }],
      },
      isNot: [{ label: "否", value: '0' }, { label: "是", value: '1' }],
      isMergeOrNot: [{ label: "否", value: 0 }, { label: "是", value: 1 }],
      noPrintReceipt: false,//发票是否打印动态配置判断
      chargeStaffList: [],
      tableShow: false,
      printStyleShow: false,
      showBillVisible: false,//修改开票资料
      billVisibleName: '开票资料修改',
      maxHeight: 0,
      showReceiptButton: false,//收据打印按钮
      costMoneyList: [],
      dictionaryData: {},
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        fuzzyQuery: '',
        accountPeriod: '',
        invoiceType: '',
        chargeStaff: '',
        atFlag: '',
        serialNo: '',
        sortField: '',
        sortOrder: '',
        openInvoice: '',
        payMethod:''
      },
      showVat: false,//补录专票页面
      resultList: [],
      detailIds: '',
      vatInvoiceNo: '',
      Time: [],
      // 初始化数据
      tableData: {},
      countMoneyTotal: 0,
      countMoney: 0,
      costList: [],
      typeList: [],
      pjList: [],//未开票票据类型列表
      // 勾选数据
      selectData: [],
      // 预开票(1不勾选，0勾选)
      chargeFlag: false,
      billform: {
        accountNo: "",
        userNo: "",
        invoiceTitle: "",//单位名称
        invoiceTax: "",//纳税人识别号
        invoiceAddr: "",//联系地址
        invoiceLink: "",//座机号码
        invoiceBank: "",//开户银行
        invoiceBankName: "",//开户银行
        invoiceAccount: "",//银行账户
        vatFlag: "0",//增值税标识
        vatFlagName: "否",//增值税标识
        emailAddr: "", //电子邮件
        stopWaterLinkMobile: "",//通知人手机号
        mergeInvoicing: "", // 合并开票
      },
      formData: {
        isTogether: false,
        reprint: false,
        all: false,
        invoiceTypes: '',
        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [],
        waterMeterManufacturer: "",
        waterMeterManufacturerOptions: [],
        waterMeterType: "",
        waterMeterTypeOptions: [],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: []

      },
      // 日期选择器
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        },
        {
          text: '最近半年',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          },
        },
        ]
      },
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now();
      //   }
      // },
      DateChoosevalue: [],
      histroyData: {

      },
      InvoiceReplacementVisible: false,  //综合查询的显示和隐藏
      InvoiceReplacementName: '发票领用-领用',
      ruleFormData: {},
      PrintPayer: "",
      CombinedStrike: "",
      baseInvoiceData: {},
      printStyleData: {},//打印数据
      pjState: [{label: '开具', value: 1}, {label: '未开具', value: 0}],
      ZBSFinvoiceShow: false,//电子发票预览打印弹窗
      ZBSFinvoiceData: [],
      invoiceTurnUrl: '', //电子发票域名
    }
  },
  mounted () {
    // 初始化账期
    let time = new Date()
    let period = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) + '' : '0' + (time.getMonth() + 1)
    this.tableQuery.accountPeriod = time.getFullYear() + period
    //this.Time = [year + '-' + month + '-01', time.getFullYear() + '-' + time.getMonth()+1 + '-' + (time.getDate() >= 10 ? time.getDate() : '0' + time.getDate())]
    let year = time.getFullYear()
    let day = time.getDay();
    let month = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) + '' : '0' + (time.getMonth() + 1)
    // this.Time = [this.createBeginDate(), time.getFullYear() + '-' + month + '-' + time.getDate()]
    this.Time = [time.getFullYear() + '-' + month + '-' + time.getDate(), time.getFullYear() + '-' + month + '-' + time.getDate()]
    //this.tableQuery.fuzzyQuery = this.fuzzyQuery

    //this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.getBaseInvoiceType();
    this.getInvoiceCostsAndTypes();
    this.showReceiptTypeStatus()
    this.getDesignStaffList();
    this.getPayMethod();
    this.showReceipt()
    this.getInvoiceTypes()
    this.showPreOpenInvoice();
    this.getInvoiceTurnUrl()
    this.fuzzyQuery && (this.tableQuery.fuzzyQuery = this.fuzzyQuery);
    this.common.changeTable(this, '.InvoiceReplacement', ['.InvoiceReplacement .toolbar', '.InvoiceReplacement .form-right', '.InvoiceReplacement .block'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //打印表单
    printDetail (type) {
      if (this.selectData.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择需打印的发票"
        });
        return;
      }/* else if (this.selectData.length > 1) {
        this.$message({
          type: "warning",
          message: "只能选择一行"
        });
        return;
      } */else {
        let code = "";
        this.selectData.forEach(item => {
          console.log(item);
          if (type === "ZBSF") {
            code = item.ZBSFinvoiceNo;
          } else if (type === "ZZFP") {
            code = item.ZZFPinvoiceNo;
          } else if (type === "SJDY") {
            code = item.SJDYinvoiceNo;
          } else if (type === "DZCZ") {
            code = item.DZCZinvoiceNo;
          } else if (type === "LJFP") {
            code = item.LJFPinvoiceNo;
          } else if (type === "ZYFP") {
            code = item.ZYFPinvoiceNo;
          }
        })
        console.log(code);
        if (code === "" || typeof (code) == 'undefined' || code === false) {
          this.$message({
            type: "warning",
            message: "该票号为空"
          })
          return;
        } else {
          let params = {
            "busicode": "FctInvoicesBillDetail",
            "data": { invoiceCode: code },
            token: sessionStorage.getItem("token"),
            sysType: '002',
          }
          console.log("新的code" + code);
          window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
        }

      }
      return;
    },

    //获取电子发票域名
    getInvoiceTurnUrl(){
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'INVOICE_TRAN_URL',
        }
      };
      this.$api.fetch({
        params
      }).then(res => {
        if (res.list.length > 0) {
          this.invoiceTurnUrl = res.list[0].configValue
        } else {
          this.invoiceTurnUrl = '';
        }
      })
    },

    //隐藏预开票
    showPreOpenInvoice () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'pre_open_invoice'
        }
      };
      this.$api.fetch({
        params,
      }).then(res => {
        // console.log(res.list);
        if (res.list.length > 0 && res.list[0].configValue == 1) {
          this.showInvoice = true;
        } else {
          this.showInvoice = false;
        }

      })
    },
    closeBillDialog () {
      this.showBillVisible = false
    },
    //获取收据显示开关
    showReceipt () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_PRINT_SHOWRECEIPT',
        }
      };
      this.$api
        .fetch({
          params,

        })
        .then(res => {
          if (res.list.length > 0) {
            this.showReceiptButton = res.list[0].configValue == 1 ? true : false;
          }
        })
    },
    sortChange (column) {
      this.tableQuery.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery.sortOrder = 2
      } else {
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.init()
    },
    // 输入银行卡号
    validateNum1 () {
      this.setNum1(this.billform)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum1 (data) {
      data.invoiceAccount = data.invoiceAccount.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'invoiceAccount', data.invoiceAccount)
    },
    //列表去重
    uniqueFunc (...args) {
      const paramsLength = arguments.length;
      if (paramsLength == 1) {
        return [...new Set(arr)];
      } else {
        const res = new Map();
        const flag = arguments[1];
        return arguments[0].filter(item => !res.has(item[flag]) && res.set(item[flag], item));
      }
    },
    celldblclickCopy (row, column, cell, event) {
      var prop = column.property
      var copyMsg = row[prop]
      if (event.type === "dblclick") {
        var save = function (e) {
          console.log(e);
          e.clipboardData.setData('text/plain', copyMsg);
          e.preventDefault();//阻止默认行为
        }
        document.addEventListener('copy', save);
        document.execCommand("copy");
        document.removeEventListener('copy', save);
      }
      // this.$message({ message: '复制成功', type: 'success' }) //加提示
    },
    updateBill () {
      if (this.selectData.length === 'undefined' || this.selectData == null || this.selectData.length <= 0) {
        this.$message({
          showClose: true,
          message: '请勾选帐单记录',
          type: 'warning'
        });
        return;
      }
      this.showBillVisible = true
      let params = {
        busicode: "UserInfoQuery",
        data: {
          userNo: this.selectData[0].userNo
        }
      };
      this.$api
        .fetch({
          params,

        })
        .then(res => {
          console.log(res)
          this.billform = {
            invoiceTitle: res.accountInfo.invoiceTitle,//单位名称
            invoiceTax: res.accountInfo.invoiceTax,//纳税人识别号
            invoiceAddr: res.accountInfo.invoiceAddr,//联系地址
            invoiceLink: res.accountInfo.invoiceLink,//座机号码
            invoiceBank: res.accountInfo.invoiceBank,//开户银行
            invoiceBankName: res.accountInfo.invoiceBankName,//开户银行
            invoiceAccount: res.accountInfo.invoiceAccount,//银行账户
            vatFlag: res.accountInfo.vatFlag,//增值税标识
            vatFlagName: res.accountInfo.vatFlagName,//增值税标识
            emailAddr: res.accountInfo.emailAddr, //电子邮件
            stopWaterLinkMobile: res.userInfo.stopWaterLinkMobile,//通知人手机号
            mergeInvoicing: res.accountInfo.mergeInvoicing, // 合并开票
          }
        })
    },
    openInvoice (val) {//开具发票
    
      if (val == 'ZYFP') {
        this.openVat();
        return;
      }
      if (val == 'SJDY') {
        this.printReceipt();
        return;
      }
      this.printInvoicenew(val);
    },
    printReceipt () {
      let _this = this
      let data = {}

      if (this.selectData.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先勾选数据！'
        })
        return
      }
      //   if (this.selectData.length > 1) {
      //   this.$message({
      //     type: 'warning',
      //     message: '只能选择一条打印数据'
      //   })
      //   return
      // }
      // data.userNo=_this.selectData[0].userNo
      // data.accountPeriod=_this.selectData[0].accountPeriod
      //  data.serialNo=_this.selectData[0].serialNo
      let list = []
      this.selectData.forEach(item => {
        var temData = {}
        temData.userNo = item.userNo
        temData.accountPeriod = item.accountPeriod
        temData.serialNo = item.serialNo
        list.push(temData)
      })
      let params = {
        busicode: 'ReceiptPrint',
        data: {
          // isTogether: 1,
          isTogether: (this.formData.all || this.formData.isTogether) ? 1 : 0,
          list: list
        }
      };
      _this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.common.print('print', 'ReceiptPrint', '', res, _this);
      })
    },
    gettemplateId(){},

    cancelInvoice (val) {//作废发票
      if (val == 'ZYFP')
        this.cancelVat();
      else
        this.voidBill(val);
    },
    //开票资料修改
    submitBillForm () {
      this.selectData = this.uniqueFunc(this.selectData, 'userNo')
      var userNoGroup = []
      var userNameGroup = []
      this.selectData.forEach(item => {
        userNameGroup.push(item.ctmName + '(' + item.userNo + ')') //提示语
        userNoGroup.push(item.userNo) //传参
      })
      var userNoItem = userNameGroup.join(',')
      this.$confirm('是否确认更新当前勾选的' + userNameGroup.length + '个客户的发票资料？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.billform.accountNo = this.accountNo
        this.billform.userNos = userNoGroup
        this.$refs.billform.validate((valid) => {
          if (valid) {
            let params = {
              busicode: "FctInvoiceInfoUpdate",
              data: this.billform
            };
            console.log('update', params)
            // return;
            this.$api
              .fetch({
                params,

              })
              .then(res => {
                this.$notify({
                  title: '成功',
                  message: userNoItem + '发票信息变更成功',
                  type: 'success'
                })
                this.showBillVisible = false
                // 若是合并开票为是，则合打默认勾选
                console.log('billform', this.billform)
                this.billform.userNos.forEach(item => {
                  console.log('bill userno', item)
                  this.tableData.list.forEach(tList => {
                    if (item == tList.userNo) {
                      tList.mergeInvoicing = this.billform.mergeInvoicing
                    }
                  })
                  this.selectData.forEach(sList => {
                    if (item == sList.userNo) {
                      sList.mergeInvoicing = this.billform.mergeInvoicing
                    }
                  })
                })
                console.log('selectData', this.selectData)
                console.log('tableData', this.tableData)
                let state = true;
                this.selectData.forEach(item => {
                  if (state && !item.mergeInvoicing ) {
                    state = false;
                  }
                })
                this.formData.isTogether = state;
              })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });

      //  userNoGroup.push('0900001418')

    },
    //获取发票动态显示
    showReceiptTypeStatus () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'WORKBENCH_INVOICE_OPEN',
        }
      };
      this.$api
        .fetch({
          params,

        })
        .then(res => {
          console.log(res)
          if (res.list[0].configValue == '1') { //1仅开具不打印
            this.noPrintReceipt = false
          } else if (res.list[0].configValue == '2') { //2开具并打印
            this.noPrintReceipt = true
          }
          // if(res.list.length>0){
          //   this.showReceiptButton = res.list[0].configValue==1?true:false;
          // }
        })
    },
    createBeginDate () {
      var date = new Date();
      date.setMonth(date.getMonth() - 1);
      date.toLocaleDateString()
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      return time;
    },
    getIndex (addr) {
      return this.tableData.list.findIndex(item => item.ZBSFinvoiceAddr === addr)
    },
    handleInvoiceAddrClick (id) {
      const index = this.getIndex(id)
      console.log(index);
      document.getElementById('invoiceAddr' + index).select()
    },
    // 初始化
    init () {
      let _this = this;
      let data = {}
      var reg = new RegExp(' ', "g")
      var reg2 = new RegExp('\\t', "g")
      if (this.tableQuery.fuzzyQuery)
        this.tableQuery.fuzzyQuery = this.tableQuery.fuzzyQuery.replace(reg, '');
      this.tableQuery.serialNo = this.tableQuery.serialNo.replace(reg, '');
      this.tableQuery.fuzzyQuery = this.tableQuery.fuzzyQuery.replace(reg2, '');
      this.tableQuery.serialNo = this.tableQuery.serialNo.replace(reg2, '');
      if (this.chargeFlag) {
        data = {
          chargeStaff: this.tableQuery.chargeStaff,
          payMethod:this.tableQuery.payMethod,
          invoiceType: this.tableQuery.invoiceType,
          chargeFlag: 0,
          accountPeriod: this.tableQuery.accountPeriod,
          fuzzyQuery: this.tableQuery.fuzzyQuery,
          page: this.tableQuery.page,//页数
          pageCount: this.tableQuery.pageCount,//条数
          vatFlag: parseInt(this.tableQuery.vatFlag),
          serialNo: this.tableQuery.serialNo,
          sortField: this.tableQuery.sortField,
          sortOrder: this.tableQuery.sortOrder,
          openInvoice: this.tableQuery.openInvoice
        }
      } else {
        data = {
          vatFlag: parseInt(this.tableQuery.vatFlag),
          chargeStaff: this.tableQuery.chargeStaff,
          payMethod:this.tableQuery.payMethod,
          invoiceType: this.tableQuery.invoiceType,
          chargeFlag: 1,
          beginCharge: this.Time[0],
          endCharge: this.Time[1],
          fuzzyQuery: this.tableQuery.fuzzyQuery,
          page: this.tableQuery.page,//页数
          pageCount: this.tableQuery.pageCount,//条数
          serialNo: this.tableQuery.serialNo,
          sortField: this.tableQuery.sortField,
          sortOrder: this.tableQuery.sortOrder,
          openInvoice: this.tableQuery.openInvoice
        }
      }
      let params = {
        busicode: "FctInvoicesList",
        data
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
        console.log(res)
        _this.payMethod=res
        console.log(res)
        _this.getInvoiceTypes()
      })
    },
    // 收费人员数据获取
    getDesignStaffList () {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "1" },
      };
      this.$api
        .fetch({
          params: params, //参数

        })
        .then(res => {
          //let bankAccount = [{"userName":"农商行"},{"userName":"微信支付"},{"userName":"支付宝"},{"userName":"银联"}]
          _this.chargeStaffList = [...res];
        });
    },
    //收费方式
    getPayMethod(){
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "DAILY_CHT,BPI,BPC"//收费类型、缴费方式
      };
      this.$api.fetch({
        params: dictionaryDataParams
      }).then(res => {
        res.DAILY_CHT = [...[{ name: "全部", value: "" }], ...res.DAILY_CHT]
        res.BPI = [...[{ name: "全部", value: "" }], ...res.BPI]
        res.BPC = [...[{ name: "全部", value: "" }], ...res.BPC]
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    getBaseInvoiceType () {
      let _this = this
      let params = {
        "busicode": "BaseInvoiceTypeOnList",
        "data": {
          status: 0
        }
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.baseInvoiceData = res;
      })
    },
    // 获取票据提醒字段
    getInvoiceTypes () {
      let _this = this;
      let params = {
        busicode: "InvoicesTypeSelect",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.formData.invoiceTypes = res.invoiceTypes
      })
    },
    // 获取费用及票据类型
    getInvoiceCostsAndTypes () {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.costList = res.costList
        this.typeList = res.typeList
        this.pjList = JSON.parse(JSON.stringify(res.typeList))
        this.pjList.push({ invoiceNo: 'ZYFP', invoiceName: '专用发票' });

      })
    },
    changeBtnType (changeBtn) {
      this.typeList.forEach(e => {
        if (e.invoiceNo == 'ZBSF' && changeBtn == true) {
          changeBtn = true
        } else if (e.invoiceNo == 'ZBSF' && changeBtn == false) {
          changeBtn = false
        }
      })
      return changeBtn
    },
    // 查询
    search () {
      if(this.tableQuery.openInvoice !== "" && this.tableQuery.invoiceType === ""){
        this.$message({
          type: "warning",
          message: "请选择票据类型！"
        })
        return;
      }
      if(this.tableQuery.openInvoice === "" && this.tableQuery.invoiceType !== ""){
        this.$message({
          type: "warning",
          message: "请选择发票状态！"
        })
        return;
      }
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init()
    },
    //复选框禁用
    // checkboxT(row, index) {
    //   if (row.flag == 1) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    // 表格勾选对象数组
    getSelectData (itemList) {
      // console.log(itemList)
      if (itemList.length == 0) {
        this.countMoneyTotal = 0
      }
      this.selectData = []
      this.countMoney = 0
      this.costMoneyList = JSON.parse(JSON.stringify(this.costList));
      let checkTogether = true;
      itemList.forEach(item => {
        // 判断勾选的列表是否都是合开
        // console.log(item.mergeInvoicing)
        if (checkTogether && item.mergeInvoicing == '0'||item.mergeInvoicing == '') {
          checkTogether = false;
        }
        this.selectData.push(item
          /*{
          "userNo": item.userNo,
          "WSCL": item.WSCL,
          "accountPeriod": item.accountPeriod,
          /*"ctmName": item.ctmName,
          "calculateWater": item.calculateWater,
          "totalMoney": item.totalMoney,
          "costName": item.costName,
          "invoiceType": item.invoiceType,
          "invoiceForm": item.invoiceForm,
          "invoiceTypeName": item.invoiceTypeName,

          "invoiceCode": item.invoiceCode,
          "invoiceAddr": item.invoiceAddr,
          "chargeTime": item.chargeTime,
          "chargeStaffName": item.chargeStaffName,
          "payMethod": item.payMethod,

          }*/
        )


        this.costMoneyList.forEach(t => {
          if (item[t.costNo] != undefined && Number(item[t.costNo]) > 0) {
            if (t['costMoney'] == undefined) {
              this.$set(t, 'costMoney', Number(item[t.costNo]))
            } else
              t.costMoney = this.numberAdd(t.costMoney, item[t.costNo])
          }
        })


        this.countMoney += item.totalMoney || 0
        var num = this.countMoney
        num = num.toFixed(2)   //保留两位小数
        this.countMoneyTotal = num

        // console.log('uuu', this.countMoneyTotal)
      })
      // 勾选的列表都是默认合开发票，则自动勾选合打
      if (itemList.length == 0) {
        this.formData.isTogether = false
      } else {
        this.formData.isTogether = checkTogether
      }
      if (this.countMoneyTotal > 0) {
        var total = {}
        total.costNo = 'hj'
        total.costName = '总合计:'
        total.costMoney = this.countMoneyTotal
        this.costMoneyList.push(total)
      }

    },
    numberAdd (arg1, arg2) {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split(".")[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      n = (r1 >= r2) ? r1 : r2;
      return ((arg1 * m + arg2 * m) / m).toFixed(n);
    },
    closeVatDialog () {
      this.resultList = []
      this.detailIds = ""
      this.vatInvoiceNo = ""
      this.showVat = false
    },
    closeZBSFinvoiceDialog(){
      this.ZBSFinvoiceData = []
      this.ZBSFinvoiceShow = false
    },
    saveVat () {
      if (this.vatInvoiceNo === 'undefined' || this.vatInvoiceNo == null || this.vatInvoiceNo == '') {
        this.$message({
          showClose: true,
          message: '请输入专票票号',
          type: 'warning'
        });
        return;
      }
      let _this = this;
      let params = {
        busicode: "FctVatSave",
        data: {
          detailIds: _this.detailIds,
          vatInvoiceNo: _this.vatInvoiceNo
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        });
        this.showVat = false
        this.init();
      })
    },
    openVat () {  //开具专票
      if (this.selectData.length === 'undefined' || this.selectData == null || this.selectData.length <= 0) {
        this.$message({
          showClose: true,
          message: '请选择至少一个帐单',
          type: 'warning'
        });
        return;
      }

      let query = []
      this.selectData.forEach(t => {
        var item = {}
        item.id = t.id;
        item.accountPeriod = t.accoutnPeriod;
        item.userNo = t.userNo;
        item.row = t.index;
        query.push(item);
      })
      let _this = this;
      let params = {
        busicode: "FctVatList",
        data: query
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.resultList = res.resultList;
        this.detailIds = res.detailIds;
        this.showVat = true;
      })
    },
    cancelVat () {//作废专票
      if (this.selectData.length === 'undefined' || this.selectData == null || this.selectData.length <= 0) {
        this.$message({
          showClose: true,
          message: '请选择至少一个帐单',
          type: 'warning'
        });
        return;
      }
      this.$confirm('是否确认作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let query = []
        this.selectData.forEach(t => {
          var item = {}
          item.id = t.id;
          item.accountPeriod = t.accoutnPeriod;
          item.userNo = t.userNo;
          item.row = t.index;
          query.push(item);
        })
        let _this = this;
        let params = {
          busicode: "FctVatCancel",
          data: query
        };
        this.$api.fetch({
          params: params,//参数

        }).then(res => {
          _this.$message({
            showClose: true,
            message: '取消成功',
            type: 'success'
          });
          this.init();
        })
      });
    },
    getPrintData (val) {

    },
    printInvoicenew (type) { 
      console.log(type)
      let _this = this
      let data = {}
      if (this.chargeFlag) {
        data = {
          isTogether: _this.formData.isTogether === true ? 1 : 0,
          reprint: _this.formData.reprint === true ? 1 : 0,
          invoiceType: type,
          chargeFlag: this.chargeFlag ? 0 : 1,
          accountPeriod: this.tableQuery.accountPeriod,
          fuzzyQuery: this.tableQuery.fuzzyQuery,
        }
      } else {
        data = {
          isTogether: _this.formData.isTogether === true ? 1 : 0,
          reprint: _this.formData.reprint === true ? 1 : 0,
          invoiceType: type,
          chargeFlag: this.chargeFlag ? 0 : 1,
          beginCharge: this.Time[0],
          endCharge: this.Time[1],
          fuzzyQuery: this.tableQuery.fuzzyQuery,
        }
      }
      data.all = this.formData.all === true ? 1 : 0
      let sendata = []
      if (this.formData.all === false) {
        _this.selectData.forEach((item) => {
          let col = {
            userNo: item.userNo,
            accountPeriod: item.accountPeriod,
            serialNo: item.serialNo,
            waterPriceId: item.waterPriceId,
            meterReadingId: item.meterReadingId
          }
          sendata.push(col)
        })
        data.list = sendata
      }
      if (data.list.length == 0) {
        this.$notify({
          title: '错误',
          message: '未选择数据',
          type: 'error'
        })
        return
      }
      let params = {
        "busicode": "FctYCInvoicePrint",
        data
      }
      console.log(data)
      _this.$api.fetch({
        params: params,//参数

      }).then(res => {
        let data = res
        if (this.noPrintReceipt) {
          this.$notify({
            title: '成功',
            message: '正在打印...',
            type: 'success'
          })
        }
        data.forEach(element => {
          if (element.type === 1 && this.noPrintReceipt == true) {
            //this.common.print('printPDF','', '', element.key, _this);
            let ZBSFinvoiceAddr = JSON.parse(JSON.stringify(element.key))
            if (ZBSFinvoiceAddr.indexOf('http://59.37.13.30:8095') !== -1) {
              ZBSFinvoiceAddr = ZBSFinvoiceAddr.replace('http://59.37.13.30:8095/download/', this.invoiceTurnUrl)
            }
            setTimeout(() => {
              window.open(ZBSFinvoiceAddr, '_blank') //这个方法key要是https才行呀 不得劲
            }
              , 2000
            )
          } else if (element.type === 0 && this.noPrintReceipt == true) {
            this.common.print('print', 'SewageInvoicePrint', '', element.key, this);
            //this.common.print('printTD', 'SewageInvoicePrint', '', element.key, _this);
          }
        });
        this.init();
        this.formData.reprint = false;
        this.formData.isTogether = false;
        this.formData.all = false;
        this.$emit('getInvoiceTypes')
      })
    },
    printInvoice (type) {
      //0：衔头发票 1：电子发票
      let _this = this
      let sendata = []
      let flag = null;
      _this.selectData.forEach((item) => {
        //sendata.push(item.id)
        if (item.invoiceNo.length > 0 && _this.formData.isTogether === true) {
          flag = "已开票不能合打"
        }
        if (item.invoiceNo.length > 0 && _this.formData.reprint === false) {
          flag = "已开票不能再打，请选中重打"
        }
      })
      if (flag != null) {
        this.$notify({
          title: '失败',
          message: flag,
          type: 'error'
        })
        return
      }
      let params = {
        "busicode": "FctInvoicesPrint",
        "data": {
          isTogether: _this.formData.isTogether === true ? 1 : 0,
          detailIds: sendata,
        },
      }

      _this.$api.fetch({
        params: params,//参数

      }).then(res => {
        let data = res
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        data.forEach(element => {
          if (element.type === 1) {
            this.common.print('printPDF', '', '', element.key, _this);
          } else {
            this.common.print('printTD', 'SewageInvoicePrint', '', element.key, _this);
          }
        });
        this.init();
      })
    },
    // 打印财政收据按钮
    print (type) {

      let _this = this
      let data = {}
      let sendata = []
      _this.selectData.forEach((item) => {
        let col = {
          userNo: item.userNo,
          accountPeriod: item.accountPeriod,
        }
        sendata.push(col)
      })
      data.list = sendata
      if (this.selectData.length <= 0) {
        this.$message({
          type: 'success',
          message: '请先勾选数据！'
        })
        return
      }
      let params = {
        busicode: 'FctPrintReceipt',
        data: data
      };
      _this.$api.fetch({
        params: params,//参数

      }).then(res => {
        console.log(res);

        _this.common.print('printTD', 'FctPrintReceiptSet', '', res, _this);
      })
    },
    // 票据作废按钮
    voidBill (type) {
      let _this = this
      // 是否去调接口
      let toGetRes = true
      if (this.selectData.length <= 0) {
        this.$message({
          type: 'success',
          message: '请先勾选数据！'
        })
        return
      }
      let sendata = []
      this.selectData.forEach(item => {
        sendata.push({
          userNo: item.userNo,
          accountPeriod: item.accountPeriod, serialNo: item.serialNo,
          meterReadingId: item.meterReadingId, waterPriceId: item.waterPriceId
        })
      })
      this.$confirm('是否确认作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let params = {
          busicode: "FctGeneralInvoiceInvalid",
          data: {
            list: sendata,
            invoiceType: type
          }
        };
        _this.$api.fetch({
          params: params,//参数

        }).then(res => {
          _this.$message({
            type: 'success',
            message: '勾选票据已作废!'
          })
          _this.init()
          _this.$emit('getInvoiceTypes')
        })

      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 不规则列表处理
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (column.label === "用户编号" || column.label === "账期" || column.label === 'NO.' || columnIndex === 0) {
        if (row.rowspan !== undefined && row.rowspan !== null) {
          return {
            rowspan: row.rowspan,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 1,
            colspan: 1,
          };
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },

    tableRowClass ({ row, rowIndex }) {
      row.index = rowIndex + 1
      return row.vatFlag ? 'row-green' : ''
    },

    //   导出
    exportExcel () {
      //   	let listData = {}
      //   	this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
      //     let params ={
      //       "busicode":"MeterReadingList",
      //       "data": this.tableQuery
      //     }
      //     this.$api.fetch({
      //       apiUrl: 'interface.api',//路径
      //       method: 'post',//请求方法
      //       params:params,//参数
      //       needErrorCallback:true
      //     }).then(res =>{
      //     	if(res.code===0){
      //         listData = res.data
      //         if (!listData.list[0]) {
      //         		this.$notify({
      //               title: '警告',
      //               message:'表格没有相关数据',
      //               type: 'error'
      //             })
      //         	} else {
      //         		import('@/vendor/Export2Excel').then(excel => {
      // 			        const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
      // 			        const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
      // 			        const list = listData.list
      // 			        const data = this.formatJson(filterVal, list)
      // 			        excel.export_json_to_excel({
      // 			          header: tHeader,
      // 			          data,
      // 			          filename: this.tableQuery.daytime + '抄表数据',
      // 			          autoWidth: '100'
      // 			        })
      // 			      })
      //         		this.tableQuery.pageCount = 20
      //         	}
      //       }
      //     })
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

    cellClick (row, column, cell, event) { //点击文件名
      let that = this;

    },
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    closeDialog () { //关闭会话
      this.InvoiceReplacementVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit (formName) {	//提交
      this.$refs.childInvoiceReplacement.submit()
      // this.InvoiceReplacementVisible = false;
    },
    add () {
      this.InvoiceReplacementVisible = true;
    },
    edit () {

    },
    //点击前三列复选
    handleTableCellClick (row, column, cell, event) {
      console.log(row);
      if (column.label !== 'NO.' && column.label !== '用户编号' && column.label !== '缴费批次号') {
        if (column.property === "ZBSFinvoiceAddr") {
          if (row.ZBSFinvoiceAddr) {
            this.ZBSFinvoiceData = []
            let list = row.ZBSFinvoiceAddr.split(',')
            list.forEach((item,i) => {
              let obj = {
                invoiceSort: '发票'+(i+1),
                ZBSFinvoiceAddr: item
              }
              this.ZBSFinvoiceData.push(obj)
            })
            this.ZBSFinvoiceShow = true
          }
          return
        }else{
          return
        }
      }
      // row.flag = !row.flag;
      // this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.list.findIndex(item => item.id === row.id)
      var select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if (this.selectData.some(item => select.some(val => val.id === item.id))) { //取消该账期勾选
        this.getSelectData(this.selectData.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else { //恢复该账期勾选
        this.getSelectData(this.selectData.concat(select))
        this.selectData.concat(select).forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }
    },
    previewRow(row){
      // const iframe = document.createElement('iframe');
      // iframe.src = row.ZBSFinvoiceAddr;
      // iframe.style.display = 'none';
      // document.body.appendChild(iframe);
      // setTimeout(() => {
      //   document.body.removeChild(iframe);
      // }, 1000);
      let ZBSFinvoiceAddr = JSON.parse(JSON.stringify(row.ZBSFinvoiceAddr))
      if (ZBSFinvoiceAddr.indexOf('http://59.37.13.30:8095') !== -1) {
        ZBSFinvoiceAddr = ZBSFinvoiceAddr.replace('http://59.37.13.30:8095/download/', this.invoiceTurnUrl)
      }
      window.open(ZBSFinvoiceAddr)
    },
    copyRow(row){
      var save = function (e) {
        console.log(e);
        e.clipboardData.setData('text/plain', row.ZBSFinvoiceAddr);
        e.preventDefault();//阻止默认行为
      }
      document.addEventListener('copy', save);
      document.execCommand("copy");
      document.removeEventListener('copy', save);
      this.$message({ message: '复制成功', type: 'success' }) //加提示
    },
    cellStyle (data) {
      if (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3) {
        return "cursor:pointer;"
      }
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
<style lang="scss" scoped>
.InvoiceReplacement {
  width: 100%;
  height: 100%;
  .w100 {
    width: calc(46% + 10px);
  }
  .costMoney-box{
    height: 30px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .el-form--inline .el-form-item:first-of-type {
    margin-right: 0px;
  }
  .el-table .cell,
  .el-table th div {
    padding: 3px !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
  .el-table .table-addr {
    border: none;
    outline: none;
    background-color: transparent;
  }
  .el-table .table-addr:focus {
    border: none;
  }
  .vat-dialog {
    .el-dailog {
      height: 70%;
      margin-top: 100px !important;
      padding: 0 20px !important;
      overflow-y: auto;
    }
  }

  .el-table {
    /deep/ {
      .row-green {
        color: #67c23a;
        .table-addr {
          color: #67c23a;
        }
      }
    }
  }
  .btn-green {
    background-color: #67c23a;
    border-color: #67c23a;
  }
  .btn-gray {
    background-color: #909399;
    border-color: #909399;
    margin: 0;
  }
  .btn-margin {
    margin: 2px;
  }
}
</style>
