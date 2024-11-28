<template>
  <div class="engineeringPayment">
    <legend class="legendColumn">编制结算（单位：元）</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right">
      <div style="width:2px;height:100%;position:absolute;margin-left:68%;"></div>
      <el-row min-height='80'>
        <el-col :span="8">
          <el-form-item prop="billNo" label="工程编码：" class="disable-item">
            <span>{{ form.billNo }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="pjName" label="工程名称：" class="disable-item">
            <span>{{ form.pjName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="disposableChargeFlag" label="一次性收费：" class="disable-item">
          <span v-if="form.disposableChargeFlag==1">是</span>
          <span v-else>否</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="setmtResult" label="结算结果：">
            <el-select v-model="form.setmtResult" disabled>
              <el-option label="无" :value="0"></el-option>
              <el-option label="退款" :value="1"></el-option>
              <el-option label="补交" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="backFillMoney" label="退补金额：" class="disable-item">
            <span>{{ form.backFillMoney }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="setmtDate" label="结算日期：" :class="{'disable-item': disabled}">
            <el-date-picker v-if="!disabled" disabled v-model="form.setmtDate" value-format="yyyy-MM-dd"></el-date-picker>
            <span v-else>{{form.setmtDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="refundWay" label="余额退款方式：" v-if="form.setmtResult==1"  class="refundWay">
            <el-select v-model="form.refundWay" :disabled="disabled" @change="changeRefundWay">
              <el-option v-for="item in dict.PBT" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="bankName" v-if="form.refundWay==10" label="退款银行名称：">
            <el-input v-if="!disabled" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable type="text" size="main" v-model="form.bankName"></el-input>
            <span v-else>{{ form.bankName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row min-height='80'>
        <el-col :span="8">
          <el-form-item prop="bankAccount" v-if="form.refundWay==10" label="退款银行账户：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable type="text" size="main" v-model="form.bankAccount"></el-input>
            <span v-else>{{ form.bankAccount }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row min-height='80'>
        <el-col :span="8">
          <el-form-item prop="bankAccountName" v-if="form.refundWay==10" label="退款银行户名：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable type="text" size="main" v-model="form.bankAccountName"></el-input>
            <span v-else>{{ form.bankAccountName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 结算结果：退款， 余额退款方式：转余额 才显示这里 -->
      <div v-if="form.refundWay == 5">
        <legend class="legendColumn">余额退款</legend>
        <el-row min-height='80'>
          <el-col :span="6">
            <el-form-item label="余额分配方式：" class="width-200" prop="balanceAllocWay">
              <el-select v-model="form.balanceAllocWay" :disabled="disabled" @change="changeMethod">
                <el-option v-for="item in dict.PJ_MOENY_DIVIDE_WAY" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收款方式：" class="width-200" prop="setmtPayWay">
              <el-select  v-model="form.setmtPayWay" :disabled="disabled" clearable>
                <el-option v-for="item in dict.BPG" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收费时间：" class="width-200" prop="setmtPayDate">
              <el-date-picker type="date" value-format='yyyy-MM-dd' :disabled="disabled" v-model="form.setmtPayDate"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <span style="margin-left:20px;">
              <el-button size="mini" icon="el-icon-plus" type="primary" :disabled="disabled" @click="showAddDia">添加</el-button>
              <el-button size="mini" type="primary" icon="el-icon-upload2" :disabled="disabled" @click.native="exportExcel">导出</el-button>
            </span>
          </el-col>
        </el-row>
        <div class="kl-table" style="margin-top:8px;">
          <el-table stripe border highlight-current-row :data="tableData" class="wuserInfo-table" style="padding-bottom:5px;" :max-height="400">
            <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="userInfo.ctmNo" min-width="130" label="客户编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userInfo.accountNo" min-width="130" label="账户编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userInfo.userNo" min-width="130" label="用户编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userInfo.ctmName" min-width="130" label="客户名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userInfo.businessAreaName" min-width="130" label="营业区域" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userInfo.setupMeterAddr" min-width="160" label="装表地址" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userInfo.setupMeterDate" min-width="130" label="装表日期" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="accountInfo.accountBalance" min-width="130" label="预存金额" align="right">
              <template slot-scope="scope">
                <el-input-number v-if="!disabled" v-model="scope.row.accountInfo.accountBalance" size="mini" controls-position="right" :step-strictly="true" 
                :step="0.01" :min="0" :precision="2" @keyup.native ='keyupEvent($event)' @change="inputChangeMethod"></el-input-number>
                <span v-else style="color:black;">{{scope.row.accountInfo.accountBalance}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100" >
              <template slot-scope="scope">
                <el-button type="text" :disabled="disabled" @click.native="deleteRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="sumStyle">
            <span style="margin-right: 50px;">合计：{{sumAccount}}</span>
            <span style="margin-right: 20px;">剩余金额：<span style="color:red;">{{remainingAmount}}</span></span>
          </div>
        </div>
      </div>
    </el-form>
    <el-dialog title="添加用户" :visible.sync="showAddUserNoDialog" class="button-dialog" append-to-body>
      <div class="toolbar">
        <el-form inline size="mini" label-position="right" label-width="220px">
          <el-form-item class="width-200" style="margin-left:20px;">
            <el-tooltip class="item" effect="dark" content="用户编号、装表地址" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" size="mini" v-model="tableQuery.fuzzyQuery" placeholder="用户编号、装表地址" clearable></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" style="background-color: #faa646;color: #fff" @click="searchDia" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{ height: 460 + 'px' }">
        <el-table highlight-current-row stripe border :data="tableDataDia.list" ref="tableData" :max-height="450" @selection-change="selectTableRow">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column prop="userInfo.ctmNo" min-width="130" label="客户编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userInfo.accountNo" min-width="130" label="账户编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userInfo.userNo" min-width="130" label="用户编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userInfo.ctmName" min-width="130" label="客户名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userInfo.businessAreaName" min-width="130" label="营业区域" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userInfo.setupMeterAddr" min-width="130" label="装表地址" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userInfo.setupMeterDate" min-width="130" label="装表日期" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page"
        :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper"
        :total="tableDataDia.total">
        </el-pagination>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["dict","editData","disabled"],
  components: {
  },
  data () {
    return {
      form: {
        billNo:'',
        budgetMatrMeterBefore: "", // 表前材料费预算
        setmtMatrMeterBefore: "", // 表前材料费结算
        budgetLaborMeterBefore: "", // 表前人工费预算
        setmtLaborMeterBefore: "", // 表前人工费结算
        budgetMatrMeterAfter: "", // 表后材料费预算
        setmtMatrMeterAfter: "", // 表后材料费结算
        budgetLaborMeterAfter: "", //表后人工费预算
        setmtLaborMeterAfter: "", // 表后人工费结算
        budgetCost: "", // 预算费
        setmtBudgetCost: "", // 预算费结算
        designCost: "", // 设计费
        setmtDesignCost: "", // 设计费结算
        constructionCost: "", // 工程造价
        depositMoney: "", // 押金
        utensilMoney: "", // 计量器具
        redLineInMoney: "", // 红线内施工费用
        redLineOutMoney: "", // 红线外施工费用
        costShare: "", // 总管分摊费用
        settlementDate: "", // 编制结算日期
        consultId: "", // 工程报装id
        setmtResult: 0, // 结算结果 0：无；1：退款；2：补交 前端计算
        settlementAmount: 0, // 结算金额  前端计算
        setmtMoney: "", // 合计金额，前端计算
        type: "", // 退款方式
        accruedMoney: "", // 预缴金额 getAccruedMoney接口获取
        billNo: "", // 编号
        setmtDate: "", // 结算日期
        refundWay: "", // 余额退款方式
        balanceAllocWay: "1", // 余额分配方式
        setmtPayWay: "", // 收款方式
        setmtPayDate: "", // 收费时间
        bankName: "", // 退款银行名称
        bankAccount: "", // 退款银行账户
        bankAccountName: "", // 退款银行户名
        accountInfoList: [],//用来传添加的用户跟预存金额
      },
      rules: {
        setmtDate: [
          { required: true, message: "结算日期不能为空", trigger: ["change", "blur"] },
        ],
      },
      updateFlag: 0,//为0表示没有更新过内容
      pdfList:[],
      tableQueryParams: {
        fuzzyQuery: "",//模糊查询
      },
      // 弹出框中的查询条件
      tableQuery: {
        page: 1,
        pageCount: 20,
        fuzzyQuery: "",//模糊查询
        consultId: "",//单据id
      },
      showAddUserNoDialog: false, // 添加用户弹出框
      sumAccount: 0,//合计
      remainingAmount: 0,//剩余金额
      tableData: [], //表格是数据
      tableDataDia: {}, // 添加用户弹出框中的数据
      selectTable: [], // 选中的用户
    };
  },
  mounted(){
    if (this.editData) {
      // console.log("editData",this.editData);
      this.form = { ...this.editData.consult }
      this.tableQuery.consultId = this.form.id;//获得单据id
      this.getAccruedMoney();
      // console.log('form', this.form)
    }
    this.getPjMeterList();
  },
  watch:{

  },
  methods: {
    keyupEvent(e){
      console.log(e.target.value)
      e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[^\d|\.]/g, '');
    },
    calcConstructionCost () {
      // 工程造价 = 表前材料费结算 + 表前人工费结算 + 表后材料费结算 + 表后人工费结算 + 预算费结算 + 设计费结算
      this.form.constructionCost =
        Number(this.form.setmtMatrMeterBefore) +
        Number(this.form.setmtLaborMeterBefore) +
        Number(this.form.setmtMatrMeterAfter) +
        Number(this.form.setmtLaborMeterAfter) +
        Number(this.form.setmtBudgetCost) +
        Number(this.form.setmtDesignCost);
        console.log(this.form.constructionCost)
        // 结算合计金额 = (工程造价 + 总管分摊费用 + 红线内施工费用 + 红线外施工费用 + 计量器具) - 预缴金额
      this.form.setmtMoney = Number(this.form.constructionCost) +
        Number(this.form.costShare) + 
        Number(this.form.redLineInMoney) +
        Number(this.form.redLineOutMoney) +
        Number(this.form.utensilMoney);
      // 计算结收方式
      if (this.form.setmtMoney > this.form.accruedMoney) {
        this.form.setmtResult = 2;
      } else if (this.form.setmtMoney < this.form.accruedMoney) {
        this.form.setmtResult = 1;
      } else {
        this.form.setmtResult = 0;
      }
      // 退款的时候需要选择余额退款方式，加上校验规则
      if(this.form.setmtResult == 1){
        this.$set(this.rules, "refundWay", [{ required: true, message: "余额退款方式不能为空", trigger: ["change", "blur"]}]);
      }else {
        const names = ["refundWay"];
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
      }
      this.form.backFillMoney = Number((Number(this.form.setmtMoney) - Number(this.form.accruedMoney)).toFixed(2));
      this.remainingAmount = this.form.backFillMoney;
    },
    changeRefundWay(){
      // 如果有切换选择余额方式为转余额，校验规则需要动态的进行显示
      if(this.form.refundWay == 5){
        this.$set(this.rules, "balanceAllocWay", [{ required: true, message: "余额分配方式不能为空", trigger: ["change", "blur"]}]);
        this.$set(this.rules, "setmtPayWay",[{ required: true, message: "收款方式不能为空", trigger: ["change", "blur"]}]);
        this.$set(this.rules, "setmtPayDate",[{ required: true, message: "收款时间不能为空", trigger: ["change", "blur"]}]);
        this.$set(this.form, "balanceAllocWay", "1");
      }else if(this.form.refundWay == 10){
        // 切换为转账
        this.$set(this.rules, "bankName", [{ required: true, message: "退款银行名称不能为空", trigger: ["change", "blur"]}]);
        this.$set(this.rules, "bankAccount",[{ required: true, message: "退款银行账户不能为空", trigger: ["change", "blur"]}]);
        this.$set(this.rules, "bankAccountName",[{ required: true, message: "退款银行户名不能为空", trigger: ["change", "blur"]}]);
      }else {
        const names = ['balanceAllocWay', 'setmtPayWay', 'setmtPayDate','bankName', 'bankAccount', 'bankAccountName']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item);
          }
        })
      }
    },
    getAccruedMoney () { // 获取预缴金额
      let params = {
        busicode: "PjCollectionCountMoney",
        data: {
          projectCode: this.form.billNo
        }
      };
      this.$api.fetch({
        params: params //参数
      })
      .then(res => {
        this.form.accruedMoney = res;
        this.calcConstructionCost();
      });
    },
    getPjMeterList(){
      let _this = this;
      let params = {
        busicode: "PjMeterList",
        data: { 
          consultId: this.form.id,
          balanceRefundFlag: 1,
        }
      };
      this.$api.fetch({
        params: params //参数
      }).then(res => {
        _this.tableData = res;
        this.changeMethod(this.form.balanceAllocWay);
      });
    },
    searchDia(){
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.getUserNoList();
    },
    // 导出内容
    exportExcel(){
      let params = {
        busicode: 'PjSettlementPaymentExport',
        "data": {
          consultId: this.form.id,
        },
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)));
    },
    saveEngineeringPayment(){
      if(this.form.refundWay == 5){
        if(this.remainingAmount > 0){
          return "退补余额小于退补金额、请重新分配！";
        }else if(this.remainingAmount < 0){
          return "退补余额大于退补金额，请重新分配！";
        }else{
          this.form.accountInfoList = [];
          for(let i=0;i<this.tableData.length;i++){
            if(this.tableData[i].accountInfo.accountBalance == "" || this.tableData[i].accountInfo.accountBalance == undefined){
              return "第"+ (i + 1) + "行的预存金额不能为空";
            }
          }
          this.tableData.forEach(item=>{
            this.form.accountInfoList.push({
              accountNo: item.accountInfo.accountNo,
              accountBalance: item.accountInfo.accountBalance,
            })
          })
          this.$set(this.form, "accountInfoList", this.form.accountInfoList);
          return "";
        }
      }else{
        return "";
      }
    },
    // 余额分配方式发生变化
    changeMethod(){
      let total = Math.abs(this.form.backFillMoney);
      let numberLength = this.tableData.length;
      // 平均分配，添加的用户平均分配退补金额，四舍五入取2位小数，最后一位包余
      if(this.form.balanceAllocWay == 1){
        let totalAmount  = 0;
        const evenSplit = total / numberLength;
        let tempVal = parseFloat(evenSplit).toFixed(3);
        let realVal = Number(tempVal.substring(0, tempVal.length - 1));//截取最后的两位小数，不进行四舍五入
        for (let i = 0; i < numberLength; i++) {
          // 最后一个是通过减去前面的获得的
          if(i == numberLength - 1){
            let tempRest = Number((total.toFixed(2) - totalAmount.toFixed(2)).toFixed(2));
            this.tableData[i].accountInfo.accountBalance = tempRest;
            totalAmount += tempRest;
          }else{
            totalAmount += realVal;
            this.tableData[i].accountInfo.accountBalance = realVal;
          }
        }
        this.sumAccount = totalAmount.toFixed(2); // 合计
        this.remainingAmount = (total - totalAmount).toFixed(2); // 剩余金额
      }else if(this.form.balanceAllocWay == 2){
        // 手工分配，输入预存金额，保存、提交时验证是否与退补金额-致
        let rest = total;
        this.tableData.forEach(item =>{
          rest = Number(rest) - Number(item.accountInfo.accountBalance);
        })
        this.sumAccount = (total - rest).toFixed(2); // 合计
        this.remainingAmount = rest.toFixed(2); // 剩余金额
      }
    },
    inputChangeMethod(val){
      let total = Math.abs(this.form.backFillMoney);
      let rest = total;
      this.tableData.forEach(item =>{
        rest = Number(rest) - Number(item.accountInfo.accountBalance);
      })
      this.sumAccount = (total - rest).toFixed(2); // 合计
      this.remainingAmount = rest.toFixed(2); // 剩余金额
    },
    // 添加用户弹出框中勾选的用户
    selectTableRow(row){
      this.selectTable = row;
    },
    getUserNoList(){
      let _this = this;
      let params = {
        busicode: "PjMeterPageList",
        data: _this.tableQuery,
      };
      this.$api.fetch({
        params: params, //参数
      })
      .then(res => {
        this.tableDataDia = res;
      });
    },
    showAddDia(){
      this.getUserNoList();//添加用户弹出框的用户信息
      this.showAddUserNoDialog = true;
    },
    handleSubmit(){
      // 勾选数据之后回显到页面上
      let tempTableData = JSON.parse(JSON.stringify(this.tableData));
      this.selectTable.forEach(item=>{
        let exist = false;
        if(tempTableData.length > 0){
          tempTableData.forEach(item2=>{
            if(item.userInfo.userNo == item2.userInfo.userNo){
              exist = true;
            }
          })
        }
        if(exist == false){
          this.tableData.push(item);
        }
      })
      if(tempTableData.length == this.tableData.length){
        this.$message({
          type: "info",
          message: "勾选的用户已添加"
        });
        return;
      }
      this.changeMethod(this.form.balanceAllocWay);
      this.handleClose();
    },
    // 删除行
    deleteRow(index) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.tableData.splice(index, 1);
          console.log(this.tableData)
          this.changeMethod(); // 删除行要重新计算预存金额
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClose(){
      // 弹出框关闭
      this.showAddUserNoDialog = false;
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.tableQuery.fuzzyQuery = "";
      this.$refs.tableData.clearSelection();
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.getUserNoList();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.getUserNoList();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-row {
  // height: 40px;
    margin-bottom: 0px;
    display: flex;
    flex-wrap: wrap
  }
/deep/ .formBill .el-form-item{
  width:100%;
}
.engineeringPayment {
  height: 92%;
  // overflow: scroll;
  overflow-x: hidden;
  .col-2 {
    width: calc(46% + 10px);
  }
  #text-box {
    padding: 50px 0px;
    font-size: 30px;
    & > div {
      text-align: center;
    }
  }
  .button-group{
    float: right;
  }
  .sumStyle{
    margin: 15px;
    float: right;
    font-size: 14px;
  }
}
</style>
