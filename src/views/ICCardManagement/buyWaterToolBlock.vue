<template>
    <div class="buyWaterToolBlock">
      <!-- ic购水工作台页面 -->
    <section class="toolBlock">
      <div class="leftForm">
        <div class="left-con">
          <div class="leftFormOption">
            <el-form :inline="true" size="mini" :model="buyWaterModel"  label-width="130px"  class="demo-form-inline" @submit.native.prevent>
              <el-row>
                <el-col  :span="17">
                          <el-form-item class="fullSearch"  label="请选择购水子表号：">
                       <el-select  @change="subMeterNoChange" v-model="buyWaterModel.subMeterNo" placeholder="请选择" style="width:100%">
                      <el-option
                        v-for="item in userInfoList"
                        :key="item.icSubMeterNo"
                        :label="item.icSubMeterNo"
                        :value="item.subMeterNo">
                      </el-option>
                    </el-select>
              </el-form-item>
                <el-form-item class="fullSearch" label="请输入购水量：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="buyWaterModel.waterNum" @keyup.enter.native="calcFee" type="number" ref="waterNum"  placeholder="水量"></el-input>
              </el-form-item>
                </el-col>
                <el-col :span="6">
                 <el-form-item  >
                <el-button class="billingBtn"  type="primary" @click="calcFee" >计费</el-button>
              </el-form-item>
                </el-col>
              </el-row>
      
         
            </el-form>
            <ul class="userInfo">
              <li class="userDetails">
                <span class="userInfoLabel test">客户编号：</span>
                <span class="ctmNo" @click="getCtmInfoShow">{{ctmInfoData.ctmNo}}</span>
              </li>
              <li key="0">
                <span class="userInfoLabel">客户名称：</span>

                <span class="userInfoValue">{{ctmInfoData.ctmName}}</span>
              </li>
              <li key="1">
                <span class="userInfoLabel">账户编号：</span> 

                <span class="userInfoValue">{{ctmInfoData.accountNo}}<em v-if="ctmInfoData.accountBalance">(</em><em style="color: #faa646;">{{ctmInfoData.accountBalance}}</em><em v-if="ctmInfoData.accountBalance">元)</em></span>
              </li>
              <li key="2">
                <span class="userInfoLabel">联系电话：</span>

                <span class="userInfoValue">{{ctmInfoData.linkTel}}</span>
              </li>
              <li key="3">
                <span class="userInfoLabel">客户地址：</span>

                <span class="userInfoValue">{{ctmInfoData.ctmAddr}}</span>
              </li>
              <!-- <li>
                <span class="userInfoLabel">发票类型：</span>

                <span class="userInfoValue">{{ctmInfoData.invoiceTypeName}}</span>
              </li> -->
            </ul>
          </div>
          <div class="leftFormPaymentOption">
            <ol class="costInfo">
              <li>
                合计金额：
                <b>{{receivableMoney}}</b>
              </li>
              <li>
                应缴金额：
                <b>{{receivableTotal}}</b>
              </li>
              <li class="changeMoney">
                找零：
                <b>{{changeMoney}}</b>
              </li>
              <li>
                结存：
                <b>{{balanceMoney}}</b>
              </li>
              <li class="AmountCharged">
                收取金额：
                <el-input ref="chargeInput" size="mini" placeholder="0" v-model="chargeAmount" @input="calculation" style="width: 500px;" @keydown.enter.native="gojiaohuji"></el-input>
              </li>

              <el-button type="danger" icon="el-icon-wallet" size="mini" style="font-size:20px; padding: 7px;" @click="gojiaohuji">收费</el-button>
            </ol>
            <el-form :inline="true" size="mini" :model="formInline" class="PayForm" label-width="90px">
              <el-form-item label="收费方式：">
                <el-radio-group v-model="payMethod" @change="changePayMethod">
                  <el-radio :label="item.value" v-for="item in dictionaryData.ICBPG" :key="item.id">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="收费项目：" class="form-item-checkbox">
                <el-checkbox-group v-model="chargeClickData" :disabled="!workbenchCostSelect" @change="chargeClickMethod">
                  <el-checkbox :label="item.costNo" v-for="item in chargeData" :key="item.id" :disabled="item.isMust=='1'">{{item.costName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="结存方式：">
                <el-radio-group v-model="balanceWay" :disabled="disabledChangeBalanceWay" @change="changeBalanceWay">
                  <el-radio label="1" :disabled="disabledBackChange">全额找零</el-radio>
                  <el-radio label="2">剩余结存</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="打印选项：">
                <el-radio-group style="line-height: 28px;" v-model="PrintingModel" @change="printChange">
                  <el-radio label="1">不打印</el-radio>
                  <el-radio label="2">打票据</el-radio>
                  <el-radio label="3" v-if="showReceiptButton">打收据</el-radio>
                </el-radio-group>
                <el-checkbox label="合打" :disabled="printChangeModel" class="afterPay" v-model="PrintingModel1"></el-checkbox>
              </el-form-item>
              <el-form-item label="发票抬头：" class="invioce">{{ctmInfoData.invoiceTitle}}</el-form-item>
              <!-- <el-form-item label="备注：" class="searchInput remark">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="comments" class="read-only" placeholder="备注"></el-input>
              </el-form-item> -->

              <el-form-item label="票据提醒：" class="noteReminder">{{invoiceTypes}}</el-form-item>
            </el-form>
          </div>
        </div>
        <div class="kl-table-IntegratedBusiness">
          <div class="tableMore" @click="detailsClick">
            <i :class="tabMore"></i>
          </div>
          <el-table
            ref="table"
            fit
            @selection-change="handleSelectionChange"
            @select="handleSelect"
            :span-method="arraySpanMethod"
            border
            :data="tableData"
            class="change-tables-table"
            :row-class-name="tableRowClass"
            @cell-click="handleTableCellClick"
            >
            <el-table-column prop="index" label="NO." width="45" align="center"></el-table-column>
            <el-table-column prop="type" width="50" type="selection" :selectable="selectable"></el-table-column>

            <el-table-column prop="lvalue" min-width="150">
              <template slot="header">
                <span>用户
                  <el-tooltip placement="top" effect="light">
                    <template slot="content">
                      <div style="font-size:16px;line-height: 20px;">
                        <span style="color:#F56C6C;">红色：已经代扣或托收出盘；</span>
                        <span style="color: #A040FF;">紫色：拆表；</span>
                        <span style="color:#0B417A;">深蓝色：代扣用户；</span>
                        <span style="color:#E6A23C;">黄色：托收用户；</span>
                        <span style="color:#62A8F2;">蓝色：用户锁；</span>
                        <span style="color:#30B110;"> 绿色：增值税用户；</span>
                      </div>
                    </template>
                    <i class="el-icon-warning-outline" style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
                  </el-tooltip>
                  </span>
              </template>
              <template slot-scope="scope">
                <p style="text-align: left;">{{scope.row.ctmName}}</p>
                <h3 style="text-align: left;">
                  <span></span>
                  <span style="color:#297ACC;cursor:pointer;" @click="userInfoSearch('用户资料','UserInformationShow', scope.row.userNo)">{{scope.row.userNo}}</span>
                </h3>
                <!-- <h3 style="text-align: left;"><span style="color:#909399;">用水类型：</span><span style="color:#000;">{{scope.row.Wtype}}</span></h3> -->
                <h3 style="text-align: left;">
                  <span style="color:#909399;"></span>
                  <span style="color:#000;">{{scope.row.userAddr}}</span>
                </h3>
                <!-- <h3>{{scope.row.areaName}}</h3> -->
              </template>
            </el-table-column>

            <el-table-column prop="useWaterType" min-width="80" label="用水类型"></el-table-column>

            <!-- <el-table-column prop="typeMonth" width="50" type="selection"></el-table-column> -->

            <el-table-column prop="accountPeriod" min-width="80" label="账期" class-name="font14">
              <template slot-scope="scope">
                <p style="color:#297ACC;cursor:pointer;font-weight:normal;">{{scope.row.accountPeriod}}</p>
                <!-- <p>{{scope.row.daytime}} / {{scope.row.code}}</p>
                <p>{{scope.row.areaName}}</p>-->
              </template>
            </el-table-column>

            <el-table-column v-if="BreachOfContract" prop="priorPeriodNum" min-width="80" label="上期抄码"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="currendPeriodNum" min-width="80" label="本期抄码"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="addWater" min-width="80" label="增减水量">
              <!-- <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="消防分摊：5方、总表分摊：5方" placement="top-start">
                  <p>{{scope.row.addWater}}</p>
                </el-tooltip>
              </template> -->
            </el-table-column>

            <el-table-column prop="calculateWater" min-width="80" label="计费水量" class-name="font14"></el-table-column>

            <el-table-column prop="receivableTotalByMonth" min-width="100" label="应缴合计" class-name="font14"></el-table-column>


            <el-table-column prop="costName" min-width="100" label="费用名称"></el-table-column>

            <el-table-column prop="synthesizePrice" min-width="80" label="综合单价"></el-table-column>

            <el-table-column prop="receivableMoney" min-width="90" label="金额"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="prefPrice" min-width="80" label="优惠单价"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="prefWater" min-width="80" label="优惠水量"></el-table-column>

            <el-table-column v-if="BreachOfContract" prop="prefMoney" min-width="80" label="优惠金额"></el-table-column>

            <!-- BreachOfContract:true,//违约明细
                  CopyInstructions:true,//抄表明细
                  Discount:true,  //    优惠明细
            Balance:true,//结存明细-->
            <el-table-column v-if="BreachOfContract" prop="penaltyDays" min-width="70" label="违约天数"></el-table-column>

            <!-- <el-table-column v-if="BreachOfContract" prop="unusual" min-width="90" label="应收违约金"></el-table-column> -->

            <el-table-column prop="penaltyMoney" min-width="90" label="违约金"></el-table-column>

            <el-table-column prop="deductBalance" min-width="90" label="预存抵扣"></el-table-column>

            <el-table-column prop="receivableTotal" v-if="false" min-width="100" label="应缴合计-每行"></el-table-column>

          </el-table>
        </div>
      </div>
    </section>
      <!-- 弹窗刷卡缴费 -->
      <el-dialog append-to-body :title="cashDepositName" :destroy-on-close="true" width="450px" height="400px" :visible.sync="cashDepositNameVisible" :close-on-click-modal="false" class="cashDeposit-dialog" @close="closeDialog">
      <BankCheck v-if="isCashDeposit" ref="BankCheck" ></BankCheck>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('cashDeposit');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
   <!-- 弹窗刷卡缴费 -->
     <el-dialog append-to-body :title="cardDepositName" :destroy-on-close="true" width="30%" :visible.sync="cardDepositNameVisible" :close-on-click-modal="false" class="charge-dialog" @close="closeDialog">
      <!-- <BankCheck v-if="isCashDeposit" ref="BankCheck" ></BankCheck> -->
         <div style="font-size:30px;padding:50px 0px;text-align: center;" id="card-box">
      <div>
        <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  ref="chargeContent" v-model="chargeContent" class="chargeContent" disabled :placeholder="'请付费'+this.chargeAmount+'元'"></el-input> -->
        请付费<span style="color:#F56C6C;">{{chargeAmount}}元</span>
      </div>
    </div>
    <div style="text-align: center;">
      <el-button :autofocus="true" class="paid-btn" style="width: 120px;height: 60px;font-size: 20px;" type="primary" @click="submit('cardDeposit')">确 认</el-button>
      <el-button style="width: 120px;height: 60px;font-size: 20px;" @click="closeDialog">取 消</el-button>
      </div>
      <!-- <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit('cardDeposit');">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div> -->
    </el-dialog>
    <!-- 选择收费方式，收费按钮触发 -->
    <el-dialog class="charge-dialog"  title="收取费用" :v-if="chargeShow" :visible.sync="chargeShow" width="30%"  @close='paidAndClose' close-on-press-escape :modal="false" :show-close='false'>
    <el-radio-group v-model="payWay" @change="payWayChange" v-if='(paySucceed === false)&&(isWechatPay||isAliPay)' >
    <el-radio label="cash" >现金</el-radio>
    <el-radio label="wechat" v-if="isWechatPay">微信</el-radio>
    <el-radio label="ali" v-if="isAliPay">支付宝</el-radio>
  </el-radio-group>
    <div id="text-box">
      <div>
         <div  v-if='payWay === "cash"'>
        <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  ref="chargeContent" v-model="chargeContent" class="chargeContent" disabled :placeholder="'请付费'+this.chargeAmount+'元'"></el-input> -->
        请付费<span style="color:#F56C6C;">{{chargeAmount}}元</span>
      </div>
      <div v-if='(payWay !== "cash") && !paySucceed'>
        支付中... 等待付款<span style="color:#F56C6C;">{{chargeAmount}}元</span>
      </div>
       <div v-if='(payWay !== "cash")&&paySucceed'>
        支付完成，已收款<span style="color:#F56C6C;">{{chargeAmount}}元</span>
      </div>
      </div>
    </div>
      <el-button :autofocus="true"  v-if="payWay === 'cash'" class="paid-btn" style="width: 200px;height: 60px;font-size: 20px;" type="primary" @click="charge">已收费</el-button>
      <!-- <el-button v-if='payWay !=="cash"' class="paid-btn" style="height: 60px;font-size: 20px;" type="primary" @click="payWayChange(payWay)">生成付款码</el-button>
   -->
      <el-button style="width: 120px;height: 60px;font-size: 20px;" @click="paidAndClose">取 消</el-button>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paidAndClose">已收现</el-button>
        <el-button @click="paidAndClose">取 消</el-button>
      </span> -->
    </el-dialog>
    <object classid="clsid:96BB8ADA-D348-4414-8892-DC79C8818841" id="GWQ" width="0" height="0"></object>

    </div>
</template>
<script>
import BankCheck from "@/components/bankCheck";
import '../../../static/interactiveMachine/js/gwq.js'
import axios from "axios";
export default {
  name: "buyWaterToolBlock",
  props:['userInfoList'],
  components: {
    BankCheck
  },
    data() {
    return {
      isAliPay:false,//是否启用支付宝二维码支付
      isWechatPay:false,
      payWay:'cash',
      paySucceed:false,
      buyWaterModel:{
        
         subMeterNo:this.userInfoList[0].subMeterNo,
          waterNum:""
      },
      selectData:[],
      userNo:this.userInfoList[0].userNo,
      // 启动列表勾选和收费项目勾选联通
      tableAndChargeShow: false,

      cashDepositName: "刷卡",
      cashDepositNameVisible: false,//刷卡银行弹窗
      isCashDeposit:false,

      cardDepositName: "刷卡",
      cardDepositNameVisible: false,//刷卡弹窗
      isCardDeposit:false,

      formDataUserNo: "",
      // 查询条件对象
  
      // 列表数据
      tableData: [],
      // 客户信息数据
      ctmInfoData: {},

       // 欠费金额
      receivableMoney: 0,

      // 应缴金额字段
      receivableTotal: 0,
      // 找零字段
      changeMoney: "",
      // 结存字段
      balanceMoney: "",
      // 收取金额字段
      chargeAmount: "",

      // 收费方式字段
      payMethod: "1",
      // 票据提醒字段
      invoiceTypes: "",
      // 结存方式字段
      balanceWay: "2",
      // 禁止修改结存方式
      disabledChangeBalanceWay: false,
      // 备注字段
      // comments: "",
      // 收费项目数据
      chargeData: [],
      // 收费项目勾选数据
      chargeClickData: [],
            //   查询表单
      formInline: {
        con: "",
        document: "",
        proposer: "",
        application: "",
        options: []
      },

      // 数据字典数据
      dictionaryData: {},
      tabMore: "el-icon-d-arrow-right",
      // 缴费类型
      PrintingModel: "1",
      PrintingModel1: false,


      currentName: "",
      tableShow: false,
      maxHeight: 200,
      btnsHeight: 0,
  
      BreachOfContract: false, //违约明细
      CopyInstructions: false, //抄表明细
      Discount: false, //    优惠明细
      Balance: false, //结存明细
      lastPage: 1,
      total: 2,

      showSum: true,
          // 禁止找零
      disabledBackChange: false,
      // 收费弹出框显示与隐藏
      chargeShow: false,
      // 收费方式(收费按钮弹出框选择)
      chargeMethod: '0',
      // 水司编号
      groupCode: '',
      // 收费方式按钮显示与隐藏
      radioShow: true,
      // 收费按钮弹出框显示字样
      chargeContent: '',
      printChangeModel:true,

      //打印选项是否显示打印收据
      showReceiptButton:true,
      workbenchCostSelect: 1, // 1允许选择， 0默认全选不允许修改（收费项目）
      balanceToNumberWay: '1', //结存时采用向上取整还是向下取整,'1'向上取整，'2'向下取整
    };
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
  mounted() {
    this.$refs.waterNum.focus();
    this.getCashDepositConfig();
    this.getIsQrCodeAlipay();
    this.getIsQrCodeWeChat();
    this.getInvoiceTypes();
    this.getChargeData();
    this.getDictionary();
    this.showReceipt();
    this.showBalanceMethod();
    this.showPrintItem();
    this.balanceToNumber()
    this.getCtmInfoData(this.userInfoList[0].userNo);
   
  },
  methods: {
    
    getIsQrCodeAlipay(){//获取支付宝电子屏二维码配置
            let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'ALIPAY_OR_NOT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

       if(res.list.length&&res.list[0].configValue == "1"){//为1则启用
          _this.isAliPay = true;
       }
        })
    },
    getIsQrCodeWeChat(){
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'WECHAT_OR_NOT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {

       if(res.list.length&&res.list[0].configValue == "1"){
          _this.isWechatPay = true;
       }
        })
    },
        payWayChange(val){
     clearTimeout(window.pollTimer);
    if(val === 'cash'){
      return;
    }
    if(webSocket.readyState != webSocket.OPEN){
      this.$message({
          message: '请正确连接设备或设备驱动未启动，请检查',
          type: 'error'
        });
         this.paidAndClose();
          // return ;
      }

        //清除计时器轮询状态
       this.gwq.GWQ_CancelOperate(); //关闭电子屏支付页
      if(	window.gwqConnFail){
        	window.gwqConnFail = false;
          // return;
      }
        let verification = this.selectData.map(item=>{
          return { billId:item.id};
        })
        let params = {
        busicode:val === 'wechat'?'WeChatPayWay':'AliPayWay',
        data: {
          paymentType:1,
        waterNum:this.buyWaterModel.waterNum,
        isPrestore: this.receivableTotal == 0 ? 1 : 0,
        groupCode: localStorage.getItem('companyNo'),
        accountNo: this.selectData[0].userNo,//账户编号
        payType: val === 'wechat'?2:3,
        payMoney: this.chargeAmount,
        verification,
        feeType: 1,
        payChannel:4,
        payWay:this.payWay,
        }
      }
      let that = this;
      window.pollTimer  = null;
      function queryStatus(){
         window.clearTimeout(window.pollTimer)
       axios({//使用axios，不显示加载中弹窗
        method: 'post',
        url:  'interface.api',
            withCredentials: true,
            timeout: 0,
           headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": sessionStorage.getItem('token')
        },
        data: {
          busicode:val === 'wechat'?'WeChatResultQuery':'aliResultQuery',
          token:sessionStorage.getItem('token'),
          sysType:"002",
          data:{
           order: params.order,
          groupCode: params.groupCode,
          accountNo: params.accountNo,

          }
        },

      }).then((res) => {
          res = res.data.data;
          if(res.payStatus == 0){
            if(val)
             window.pollTimer =   setTimeout(()=>{
           return queryStatus(); //轮询查询支付状态3s
           },3000)
         }
         if((res.payStatus == 2)||(res.payStatus == 1)){ //支付成功，关闭弹窗
              that.paySucceed = true;
              window.pollTimer && window.clearTimeout(window.pollTimer)
                 that.chargeShow = false
                  that.getInvoiceTypes();
                  that.getChargeData();
                  that.getDictionary();
                  that.printInvoice();
                  that.balanceMoney = 0;
                  that.$emit('buyWaterSubmit',{...that.buyWaterModel})
          setTimeout(()=>{
            that.gwq.GWQ_CancelOperate();
            that.paidAndClose();

              }
              ,5000)
         }
      })
      }
       that.$api
        .fetch({
          params,//参数
        })
        .then(res => { //获取支付链接和订单信息
         params = params.data;
          params.order = res.order;
          console.log(res)
           window.delayTimer = null;
          window.clearTimeout( window.delayTimer);
        window.delayTimer = setTimeout(()=>{
        if(val === 'ali'&&this.isAliPay){ //支付宝支付
              // window.open('http://10.11.227.211:8083/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params))+'&qrcodeUrl='+encodeURI(res.url))
          
            //  //调用跳转电子屏页面中生成二维码
            //线上地址
      this.gwq.GWQ_OpenURL('http://' + window.location.host + '/css2/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params))+'&qrcodeUrl='+encodeURI(res.url))

   }
      if(val === 'wechat'&&this.isWechatPay){//微信支付

            //  window.open('http://10.11.227.211:8083/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params))+'&qrcodeUrl='+encodeURI(res.url));

         this.gwq.GWQ_OpenURL('http://' + window.location.host + '/css2/static/interactiveMachine/qrcodePay.html?params=' + encodeURI(JSON.stringify(params))+'&qrcodeUrl='+encodeURI(res.url))
      }

    },1000);
     queryStatus();//开始轮询支付的状态
        });
    },


     getCashDepositConfig(){//获取现金缴存配置
            let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'Cash_deposit_in_bank',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
       if(res.list.length&&res.list[0].configValue === "01"){//为01则启用
        this.isCashDeposit =  true;

       }
        })
    },
     changeBalanceWay(val) {
        this.calcTableData()
    },
    getCtmInfoData(userNo){ //获取工作台的客户信息
      let _this = this;
          const params = {
        busicode: "ICWaterCharging",
        data: { 
          userNo,
          isOnlyShowCtmInfo:1
        }
      }
      this.$api.fetch({ params }).then(res => {
        this.groupCode = res.curWaterCode
    
          // 用户编号
          this.formDataUserNo = res.ctmInfo.ctmNo;
        
  
                  
          // 客户信息数据
          _this.ctmInfoData = res.ctmInfo;
        
          
      })      .catch(err => {
        console.log(err)
          if (err.code == 11006) {
            _this.$message({
              message: err.description,
              type: "error"
            });
        
            // 客户信息数据
            _this.ctmInfoData = err.data.ctmInfo;
    
          }
        });


    },
             printChange(val){
      if(val==='1'){
        this.printChangeModel=true;
        this.PrintingModel1=false;
      }else{
        this.printChangeModel=false;
      }
      
    },
          chargeClickMethod(itemList) {
      let _this = this;
      // 获取所有勾选数据id
      let allItemList = [];
      for (let i = 0; i < this.chargeData.length; i++) {
        allItemList.push(this.chargeData[i].costNo);
      }
      // 勾选
      for (let i = 0; i < itemList.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (itemList[i] == this.tableData[j].costNo && this.tableData[j].diyFlag !== 1 && this.tableData[j].diyFlag !== 2) {
            this.$refs.table.toggleRowSelection(this.tableData[j], true);
          }
        }
      }

      // 取交集
      let jiao = allItemList.filter(item => !new Set(itemList).has(item));
      // 取消勾选
      for (let i = 0; i < jiao.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (jiao[i] == this.tableData[j].costNo) {
            this.$refs.table.toggleRowSelection(this.tableData[j], false);
          }
        }
      }
      this.calcTableData()
    },
        // 获取数据字典数据
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "ICBPG" // 收费方式
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
       calcFee() {
              let _this = this;
               for(let i in this.userInfoList){
        if((this.userInfoList[i].subMeterNo === this.buyWaterModel.subMeterNo)&&(this.userInfoList[i].userStatus !== "正常")){
              this.$message({
                      message: "用户停用，不允许购水",
                      type: "error"
                    });
        return;
        }
      }
  
       if(this.buyWaterModel.subMeterNo == ""){
           this.$message({
          type: 'error',
          message: '请请选择子表'
        })
        return
       }

   if(isNaN(Number(this.buyWaterModel.waterNum))||(this.buyWaterModel.waterNum <= 0)||(this.buyWaterModel.waterNum > 50)) {
        this.$message({
          type: 'error',
          message: '请输入正确的购水量,购水量不能大于50'
        })
        return
      } 
      this.$emit('verifyMeterType',{...this.buyWaterModel});
      const params = {
        busicode: "ICWaterCharging",
        data: { 
          userNo: this.userNo,
          waterNum: this.buyWaterModel.waterNum
        }
      }
      this.$api.fetch({ params }).then(res => {
    this.groupCode = res.curWaterCode

     for(let i = 0; i < _this.tableData.length; i++) {
            this.$refs.table.toggleRowSelection(_this.tableData[i], false)
          }
          // 列表数据
          
          _this.tableData = res.chargeDetails;
          // 用户编号
          this.formDataUserNo = res.ctmInfo.ctmNo;
          this.deductBalanceAccountList = res.accountList.filter(item => Number(item.accountBalance) > 0)
          // 处理数据，从后向前遍历
          for (let i = _this.tableData.length - 1; i > 0; i--) {
            // 设置初始值
            if (!_this.tableData[i].rowspan) {
              _this.tableData[i].rowspan = 0;
              _this.tableData[i].receivableTotalByMonth = _this.tableData[i].receivableTotal;
            }
            // 当前抄表主键相同时
            if (_this.tableData[i].meterReadingId == _this.tableData[i - 1].meterReadingId) {
              // 设置rowspan
              if (_this.tableData[i].rowspan == 0){
                _this.tableData[i].rowspan = 1;
              }
              _this.tableData[i - 1].rowspan = _this.tableData[i].rowspan + 1;
              _this.tableData[i].rowspan = 0;
              // 合计应缴
              _this.tableData[i - 1].receivableTotalByMonth = Number(_this.tableData[i - 1].receivableTotal) + Number(_this.tableData[i].receivableTotalByMonth);
              _this.tableData[i].receivableTotalByMonth = 0;
              // 保留2位小数
              _this.tableData[i - 1].receivableTotalByMonth = Number(_this.tableData[i - 1].receivableTotalByMonth).toFixed(2);
            } else {
              if (_this.tableData[i].rowspan == 0){
                _this.tableData[i].rowspan = 1;
              }
            }
            //
          }

          let index = 0
          for(let i = 0; i < _this.tableData.length; i++) {
            if(_this.tableData[i].rowspan && _this.tableData[i].rowspan > 0) {
              _this.tableData[i].index = ++index
            }
            // this.$refs.table.toggleRowSelection(_this.tableData[i], false)
          }
                    
          // 客户信息数据
          _this.ctmInfoData = res.ctmInfo;
          if(!res.ctmInfo || res.ctmInfo.length === 0) {
            this.balanceWay = '1'
            this.disabledChangeBalanceWay = true
          } else {
            this.disabledChangeBalanceWay = false
          }
          // 默认全部勾选列表数据
          //::start 新增点击搜索默认选中所有
          let chargeData=_this.chargeData;
          if(this.workbenchCostSelect) {
            _this.chargeClickData=[];
            for (let i = 0; i < chargeData.length; i++) {
              if (chargeData[i].used) {
                for(let j = 0; j< this.tableData.length; j++) {
                  if(chargeData[i].costNo == this.tableData[j].costNo)
                      _this.chargeClickData.push(chargeData[i].costNo);
                }

              }
            }
            _this.chargeClickData = Array.from(new Set(_this.chargeClickData))
          }
          //::end
          setTimeout(() => {
            this.$refs.chargeInput.focus()
            _this.chargeClickMethod(_this.chargeClickData.toString().split(','));
            this.$nextTick(() => {
              this.$refs.chargeInput.select()
            })
          }, 0);
          //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
          this.common.changeTable(
            this,
            ".IntegratedBusiness .kl-table-IntegratedBusiness",
            []
          );
          
      })      .catch(err => {
          if (err.code == 11006) {
            _this.$message({
              message: err.description,
              type: "success"
            });
            _this.chargeAmount=0;
            _this.receivableTotal=0;
            _this.tableData=[];
            _this.groupCode=null;
            _this.deductBalanceAccountList=null;
            if(this.workbenchCostSelect) {
              _this.chargeClickData=[];
            }
            // 客户信息数据
            _this.ctmInfoData = err.data.ctmInfo;
            this.$refs.chargeInput.focus()
            this.$nextTick(() => {
              this.$refs.chargeInput.select()
            })
          }
        });
      
    },
    submit(pageName){
      if(pageName === 'cashDeposit' || pageName === 'cardDeposit') {
        this.charge();
      }
    },
    closeDialog(){
     this.cashDepositNameVisible = false
     this.cardDepositNameVisible = false
    },
        // 获取票据提醒字段
    getInvoiceTypes() {
      let _this = this;
      let params = {
        busicode: "InvoicesTypeSelect",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.invoiceTypes = res.invoiceTypes;
        });
    },
       // 获取收费项目数据
    getChargeData() {
      let _this = this;
      let params = {
        busicode: "WorkbenchCostList",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.workbenchCostSelect = res.workbenchCostSelect
           _this.chargeData = [];
            _this.chargeClickData = [];
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].used) {
              _this.chargeData.push(res.list[i]);
              _this.chargeClickData.push(res.list[i].costNo);
            }
          }
        });
    },
       //获取收据显示开关
    showReceipt() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'WORKBENCH_PRINT_SHOWRECEIPT',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if(res.list.length>0){
            this.showReceiptButton = res.list[0].configValue==1?true:false;
          }
        })
    },
     //获取结存方式
    showBalanceMethod() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'WORKBENCH_BALANCE_METHOD',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if(res.list.length>0){
            this.balanceWay = res.list[0].configValue;
          }
        })
    },
        balanceToNumber() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'WORKBENCH_CHARGE_ROUND_WAY',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if(res.list.length>0){
            this.balanceToNumberWay = res.list[0].configValue;
          }
        })
    },
      //获取打印选项
    showPrintItem() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'WORKBENCH_PRINT_ITEM',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if(res.list.length>0){
            this.PrintingModel = res.list[0].configValue;
          }
        })
    },

      charge() {
       
      let _this = this;
      // 获取列表已勾选的数据id数组
      let ids = [];
      _this.$refs.table.selection.forEach(item => {
        ids.push(item.id);
      });
      let params = {
        busicode: "ICChargerMoney",
        data: {
        "chargeIds":ids,
        "userNo": this.userNo,
        "waterNum":String(this.buyWaterModel.waterNum),
        "payMoney":String(this.chargeAmount),
        "balanceWay": this.balanceWay, //结存方式
        "payType": this.payMethod, //收费方式
        "changeMoney": this.changeMoney, //找零金额
        }
      };
      // if(this.cashDepositNameVisible){
      //   let formData =  this.$refs.BankCheck.getFormData();
      //   if(formData){
      //   params.data.incomeBank = formData.incomeBank;
      // //   params.data.bankStatement = formData.bankStatement;
      // //  params.data.billPicture = formData.billPicture;
      //   }else{
      //     return;
      //   }
      // }
      this.$api
        .fetch({
          params: params //参数 
        })
        .then(res => {
          _this.$message({
            message: "收费成功！",
            type: "success"
          });
          this.$emit('buyWaterSubmit',{...this.buyWaterModel})
          // this.gwq.GWQ_CancelOperate()
      
          this.chargeShow = false;
          this.getInvoiceTypes();
          this.getChargeData();
          this.getDictionary();
          this.printInvoice();
           this.printDZFP();//单户开具电子发票

            this.balanceMoney = 0;
      
          if(this.cardDepositNameVisible){
             this.cardDepositNameVisible = false;
           }
  
        })
        .catch(err =>{
          // this.gwq.GWQ_CancelOperate()
          this.chargeShow = false
        });
    },
        printInvoice(){
      //0：衔头发票 1：电子发票
      let _this=this
      let sendata = []
      let flag = false;
      if(_this.PrintingModel==2){
        let data={
          isTogether:0,
          reprint:0,
          invoiceType:'LJFP',
          chargeFlag: 1,
          beginCharge: '',
          endCharge: '',
          fuzzyQuery: '',
        }
        _this.$refs.table.selection.forEach((item)=>{
          if(!sendata.find(sdata => sdata.userNo === item.userNo && sdata.accountPeriod === item.accountPeriod)){
            sendata.push({userNo:item.userNo,accountPeriod:item.accountPeriod});
          }
        })
        data.list=sendata
        let params = {
          "busicode":"FctYCInvoicePrint",
          "data":data
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
          //只打印污水票
          data.forEach(element => {
            //this.common.print('printTD', 'SewageInvoicePrint', '', element.key, _this);
            this.common.print('print', 'SewageInvoicePrint', '', element.key, _this);
          });
          _this.PrintingModel=1;
          this.init();
        })
      }
    },
    printDZFP(){    //单户开通电子发票
      let _this=this
      let sendata = []
      // let userData = []
      let isTogether = 1;

      // if(_this.PrintingModel1==true)    //若勾选合打
      //     isTogether = 1;
        let data={
          isTogether:isTogether,
          reprint:0,
          invoiceType:'ZBSF',
          chargeFlag: 1,
          beginCharge: '',
          endCharge: '',
          fuzzyQuery: '',
        }
        _this.$refs.table.selection.forEach((item)=>{
          if(!sendata.find(sdata => sdata.userNo === item.userNo && sdata.accountPeriod === item.accountPeriod)){
            sendata.push({userNo:item.userNo,accountPeriod:item.accountPeriod});
          }
          //  if(!userData.find(sdata => sdata.userNo === item.userNo )){
          //   userData.push({userNo:item.userNo});
          // }
        })
        if(sendata != undefined && sendata.length == 1) {
          data.list=sendata
          let params = {
            "busicode":"FctYCInvoicePrint",
            "data":data
          }
          _this.$api.fetch({
            params: params,//参数
          }).then(res => {
              this.$notify({
                title: '成功',
                message: '开具电子发票成功',
                type: 'success'
              })
          })
        }

    },
    subMeterNoChange(val){
      this.userInfoList.forEach(i=>{
        if(i.subMeterNo===val.toString()){
              this.userNo = i.userNo;
        }
      })
        this.getCtmInfoData(this.userNo);
    },
       gojiaohuji() {
      if(!this.selectData.length){
         this.$message({
          message: '请先计费再进行收费操作！',
          type: 'warning'
        });
        return;
      }
       if ((Number(this.ctmInfoData.accountBalance) > Number(this.receivableMoney)) && Number(this.chargeAmount) !== 0 && Number(this.receivableMoney) !== 0) {
        this.$message({
          message: '当前余额充足，请先抵扣余额！',
          type: 'warning'
        });
        return
      }
      if (Number(this.chargeAmount) < 0 || isNaN(Number(this.chargeAmount))) {
        this.$message({
          message: '请输入正确的收取金额！',
          type: 'warning'
        });
        return
      }
      if(this.balanceToNumberWay === '2' && this.balanceWay === '2') {
        if(Number(this.chargeAmount) < Math.floor(Number(this.receivableTotal))) {
          this.$message({
            message: '请输入正确的收取金额！',
            type: 'warning'
          });
          return
        }
      } else if(Number(this.chargeAmount) < Number(this.receivableTotal)) {
        this.$message({
          message: '请输入正确的收取金额！',
          type: 'warning'
        });
        return
      }
      console.log(this.payMethod);
      console.log(this.isCashDeposit);
     if(this.payMethod == "7"){//刷卡
        this.cardDepositNameVisible = true;
        return;
        }
      this.chargeShow = true
      this.$refs.chargeInput.blur()
      setTimeout(() => {
        document.addEventListener('keypress', this.enterKeyDown)
      }, 50)
    },

    // 客户资料
    getCtmInfoShow() {
      if (this.ctmInfoData.ctmNo) {
        this.countManagementVisible = true;
      } else {
        this.$message({
          showClose: true,
          message: "请先选择用户",
          type: "error"
        });
      }
    },
        detailsClick(val) {
      if (this.BreachOfContract) {
        this.tabMore = "el-icon-d-arrow-right";
        this.BreachOfContract = false;
      } else {
        this.tabMore = "el-icon-d-arrow-left";
        this.BreachOfContract = true;
      }
    },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
       if (column.label === "NO." ||
          column.property === 'type' ||
          column.label === "用户" ||
          column.label === "用水类型" ||
          column.label === "账期" ||
          column.label === "计费水量" ||
          column.label === "上期抄码" ||
          column.label === "本期抄码" ||
          column.label === "增减水量" ||
          // column.label === "违约天数" ||
          column.label === "应缴合计" ||
          // column.label === "上期余额" ||
          // column.label === "结存余额" ||
          column.property === 'lvalue') {
        if (row.rowspan != 0) {
          return {
            rowspan: row.rowspan || 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    tableRowClass({ row, rowIndex }) {
      const className = ['', 'table-row-light-blue', 'table-row-red', 'table-row-green', 'table-row-purple', 'table-row-dark-blue', 'table-row-yellow']
      return className[row.diyFlag]
    },
       // 计算表格扣除金额，应缴合计
    calcTableData() {
      const accountMoney = {}
      for(const account of this.deductBalanceAccountList) {
        accountMoney[account.accountNo] = Number(account.accountBalance)
      }
      this.tableData.forEach((item, index) => {
        const needMoney = (Number(item.penaltyMoney) + Number(item.receivableMoney))
        let result = 0
        let total = 0
        if (this.selectData.some(select => select.id === item.id)) {
          if (needMoney <= accountMoney[item.accountNo]) {
            result = needMoney
            accountMoney[item.accountNo] -= needMoney
          } else if(accountMoney[item.accountNo] > 0) {
            result = accountMoney[item.accountNo]
            accountMoney[item.accountNo] -= accountMoney[item.accountNo]
          } else {
            result = 0
          }
          total = needMoney - result
        } else {
          result = 0
        }
        this.$set(this.tableData[index], 'deductBalance', result.toFixed(2))
        this.$set(this.tableData[index], 'receivableTotalByMonth', total.toFixed(2))
      })
      // 处理数据，从后向前遍历
      for (let i = this.tableData.length - 1; i > 0; i--) {
        // 当前抄表主键相同时
        if (this.tableData[i].meterReadingId == this.tableData[i - 1].meterReadingId) {
          // 合计应缴
          this.tableData[i - 1].receivableTotalByMonth = Number(this.tableData[i - 1].receivableTotalByMonth) + Number(this.tableData[i].receivableTotalByMonth);
          this.tableData[i].receivableTotalByMonth = 0;
          // 保留2位小数
          this.tableData[i - 1].receivableTotalByMonth = Number(this.tableData[i - 1].receivableTotalByMonth).toFixed(2);

        }
      }
      this.receivableMoney = 0
      this.selectData.forEach(item => {
        this.receivableMoney += (Number(item.receivableMoney) + Number(item.penaltyMoney))
      })
      this.receivableMoney = this.receivableMoney.toFixed(2)
      this.receivableTotal = 0
      this.tableData.forEach(item => {
        this.receivableTotal += Number(item.receivableTotalByMonth)
      })
      this.receivableTotal = Number(this.receivableTotal).toFixed(2);
      const accountBalance = isFinite(Number(this.ctmInfoData.accountBalance)) ? Number(this.ctmInfoData.accountBalance) : 0
      this.chargeAmount = Number(this.ctmInfoData.accountBalance) >= 0 ? Number(this.receivableTotal) : Number(this.receivableTotal) - accountBalance;
      if(this.payMethod == '1' && this.balanceWay == '2') {
        if(this.balanceToNumberWay == '1') {
          this.chargeAmount = Math.ceil(Number(this.ctmInfoData.accountBalance) >= 0 ? Number(this.receivableTotal) : Number(this.receivableTotal) - accountBalance);
        } else if(this.balanceToNumberWay == '2') {
          this.chargeAmount = Math.floor(Number(this.ctmInfoData.accountBalance) >= 0 ? Number(this.receivableTotal) : Number(this.receivableTotal) - accountBalance);
        }
      }
      this.chargeAmount = this.chargeAmount.toFixed(2)
      this.calculation(this.chargeAmount);
    },

      // 列表勾选事件
    handleSelectionChange(val) {
      this.selectData = val

      // 重新刷新列表以便重新合计
      this.showSum = false;
      this.$nextTick()
        .then(() => {
          this.showSum = true;
        })

      // 当默认勾选所有数据执行完毕，此代码控制下面代码块启动
      if (this.selectData.length == this.tableData.length) {
        this.tableAndChargeShow = true
      }

      if (this.tableAndChargeShow && this.workbenchCostSelect) {
        // 列表勾选与取消勾选与收费项目字段联通，例：当列表上所有水费手动取消勾选时，收费项目上的水费勾选取消
        for (let i = 0; i < this.chargeClickData.length; i++) {
          for (let j = 0; j < this.selectData.length; j++) {
            if (this.chargeClickData[i] == this.selectData[j].costNo) {
              break
            } else if (this.chargeClickData[i] != this.selectData[j].costNo && j == this.selectData.length - 1) {
              this.chargeClickData.splice(i, 1);
            }
          }
        }
        // 勾选列表中其中一个水费，也会引起收费项目中的水费处于勾选状态（许海宜要求）
        for (let i = 0; i < this.selectData.length; i++) {
          for (let j = 0; j < this.chargeData.length; j++) {
            if (this.selectData[i].costNo == this.chargeData[j].costNo) {
              this.chargeClickData.push(this.selectData[i].costNo)
              break
            }else if (this.selectData[i].costNo != this.chargeData[j].costNo && j == this.chargeClickData.length - 1) {
              break
            }
          }
        }
      }
      // if(this.selectData.length == 0) {
      //   this.chargeClickData = []
      // }
      this.chargeClickData = Array.from(new Set(this.chargeClickData))
      this.calcTableData()
    },
    handleSelect(selection, row) {
      this.$nextTick(() => {
        const meterReadingId = row.meterReadingId
        if(selection.some(select => select.id === row.id)) {
          this.tableData.forEach(item => {
            if(item.meterReadingId === meterReadingId) {
              this.$refs.table.toggleRowSelection(item, true)
            }
          })
        } else {
          this.tableData.forEach(item => {
            if(item.meterReadingId === meterReadingId) {
              this.$refs.table.toggleRowSelection(item, false)
            }
          })
        }
      })
    },
        // 表格点击账期时切换勾选的状态
    handleTableCellClick(row, column, cell, event) {
      if(column.property !== "accountPeriod") {
        return
      }
      // if(!this.workbenchCostSelect) {
      //   return
      // }
      const len = row.rowspan
      const ind = this.tableData.findIndex(item => item.id === row.id)
      const select = []
      for(let i = ind; i < ind + len; i++) {
        select.push(this.tableData[i])
      }
      if(this.selectData.some(item => select.some(val => val.id === item.id))) { //取消该账期勾选
        this.handleSelectionChange(this.selectData.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.table.toggleRowSelection(item, false);
        })
        this.$message({
          type: 'success',
          message: `已取消用户：${row.ctmName}(${row.userNo})，账期：${row.accountPeriod}的费用`
        })
      } else { //恢复该账期勾选
        this.handleSelectionChange(this.selectData.concat(select))
        this.selectData.concat(select).forEach(item =>{
          this.$refs.table.toggleRowSelection(item, true);
        })
        this.$message({
          type: 'success',
          message: `已统计用户：${row.ctmName}(${row.userNo})，账期：${row.accountPeriod}的费用`
        })
      }
    },
        selectable(row) {
      return row.diyFlag !== 1 && row.diyFlag !== 2 && this.workbenchCostSelect
    },
        // 已收现/取消按钮
    paidAndClose() {
      this.chargeShow = false 
    },
       calculation(num) {
      // num = this.chargeAmount(收取金额)，this.receivableTotal(应收金额),this.changeMoney(找零)this.balanceMoney(结存)
      // balanceWay: 1.找零，2.剩余结存
      // balanceToNumberWay: '1'向上；'2'向下
      if(this.balanceWay == '1') {
        this.changeMoney = Number(num) - Number(this.receivableTotal)
        this.balanceMoney = 0
      } else {
        this.balanceMoney = Number(num) - Number(this.receivableTotal)
        this.changeMoney = 0
      }

      this.balanceMoney = this.balanceMoney.toFixed(2);
      this.changeMoney = this.changeMoney.toFixed(2)

    },
        changePayMethod(val) {
      if(val === '1') {
        this.disabledBackChange = false
      } else {
        this.disabledBackChange = true
        this.balanceWay = '2'
      }
      this.calcTableData()
    }

  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/scss/base/fn";
$theme-color: #297acc;
.buyWaterToolBlock {
  zoom: 1;
  padding-top: 10px;
  width: 100%;
  height: calc(100% - 10px);
  .billingBtn{
    width: 100px;
    height: 100px;
  }

#text-box {
 padding: 50px 0px;
font-size: 30px;
text-align: center;
}
#card-box {
 padding: 50px 0px;
font-size: 30px;
}
  .button-dialog {
    .el-dialog__body {
      overflow: auto !important;
    }
  }
  .chargeContent .el-input__inner {
    width: 50%;
    font-size: 18px;
    border: none;
  }
  .charge-dialog /deep/ .el-radio__label {
    font-size: 18px !important;
  }
  .charge-dialog /deep/ .el-dialog__body {
    text-align: center;
    padding: 15px 20px;
  }
  .charge-dialog /deep/ .el-dialog {
    width: 40% !important;
  }
  .el-table__footer-wrapper {
    .has-gutter {
      td:last-of-type .cell {
        color: red;
        font-size: 18px;
      }
    }
  }
  &:after {
    @include _clearBoth();
  }
  & > section {
    zoom: 1;
    height: 100%;
    &:after {
      @include _clearBoth();
    }
  }
  .leftForm {
    float: left;
 
    width: 100%;
    height: 100%;
    zoom: 1;
    &:after {
      @include _clearBoth();
    }
    .left-con {
      // float: left;
      height: 340px;
      // width: calc(100% - 320px);
      width: 100%;
      .leftFormOption {
        width: 100%;
        zoom: 1;
        &:after {
          @include _clearBoth();
        }
        .demo-form-inline {
          float: left;
          width: calc(40% - -36px);
          height: 125px;
          padding: 10px 20px;
          .fullSearch {
            width: 100%;
            margin-bottom: 15px;
            .el-form-item__content {
              width: 100%;
              .el-input__inner {
                width: 100%;
                font-size: 18px;
                height: 40px;
                line-height: 40px;
                // padding-left: 0px;
                &::-webkit-input-placeholder {
                  font-size: 14px;
                }
                &::-moz-placeholder {
                  font-size: 14px;
                }
                &:-ms-input-placeholder {
                  font-size: 14px;
                }
              }
            }
          }
          .el-form-item__label {
            font-size: 16px;
            text-align: justify;
          }

        }
        .userInfo {
          width: calc(60% - 50px);
          float: right;
          height: 125px;
          padding: 10px 20px 0px;
          text-align: justify;
        }
      }
      .leftFormPaymentOption {
        height: 208px;
        padding: 10px 20px 15px;
        .remark {
          margin-right: 0px !important;
          .el-form-item__content {
            width: calc(100% - 90px);
            .el-input {
              width: 80%;
            }
          }
        }
        .costInfo {
          width: 100%;
          font-size: 16px;
          margin-top: 0px;
          border-bottom: 1px dashed #dfe3e6;
          padding-bottom: 10px;
          & > li {
            width: 18%;
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            b {
              margin-right: 5px;
              font-size: 24px;
            }
          }
          .changeMoney, .balanceMoney {
            width: 14%;
          }
          & > li:nth-of-type(1) > b {
            color: red;
            font-weight: 300;
          }
          & > li:nth-of-type(2) > b {
            color: red;
            font-weight: 300;
          }
          & > li:nth-of-type(3) > b {
            color: $theme-color;
          }
          & > li:nth-of-type(4) > b {
            color: #faa646;
          }
        }
        .PayForm {
          padding-top: 5px;
          overflow-y: auto;
          height: calc(100% - 35px);
          .invioce {
            .el-checkbox__label {
              color: #909399 !important;
            }
          }
          .el-form-item {
            width: 40%;
            &:nth-of-type(2n) {
              width: 55%;
            }
            &:nth-of-type(5) {
              // width: 150px;
              // margin-right: 20px;
              .el-checkbox {
                margin-left: 20px;
              }
            }
            .el-radio {
              height: 27px;
              line-height: 27px;
            }
            .el-form-item__label,
            .el-radio__label,
            .el-checkbox__label {
              font-size: 14px;
            }
            .el-radio__label,
            .el-checkbox__label {
              color: #000;
            }
            .el-form-item__label {
              text-align: justify;
              text-align-last: justify;
            }
          }
          .form-item-checkbox {
            .el-form-item__content {
              max-width: calc(100% - 90px);
              .el-checkbox{
                .is-disabled {
                  .el-checkbox__inner::after {
                    border-color: #409eff;
                  }
                }
              }
            }
          }
          .afterPay {
            height: 32px;
            line-height: 27px;
            vertical-align: top;
          }
        }
      }
    }
  }
  .rightBtn {
    text-align: right;
    border: 1px solid #aebbc342;
    margin-right: 10px;
    border-radius: 5px;
    zoom: 1;
    position: relative;
    height: 100%;
    float: right;
    width: 200px;
    box-sizing: border-box;
    overflow: auto;
    .el-button {
      display: block;
    }
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05);
    &:after {
      @include _clearBoth();
    }
    & > h5 {
      font-size: 16px;
      text-align: left;
      padding: 5px 8px;
      background: #aebbc342;
      zoom: 1;
      &:after {
        @include _clearBoth();
      }
      .setTip {
        color: $theme-color;
        float: right;
        line-height: 20px;
        font-size: 16px;
      }
      span {
        float: left;
        line-height: 20px;
      }
    }
    .btnsBlock {
      zoom: 1;
      &:after {
        @include _clearBoth();
      }
    }
    .btnTop {
      height: 42%;
    }
    div {
      margin-top: 12px;
      width: 49%;
      float: left;
      text-align: center;
      &:hover {
        cursor: pointer;
      }
      p {
        color: #54575f;
        font-size: 13px;
        font-weight: 500;
      }
      img {
        width: 20px;
        height: 20px;
      }
      .el-badge {
        width:100%;
        margin-top: 4px;
        .el-badge__content {
          right: 32px;
        }
      }
    }
    .moreBtn {
      position: absolute;
      bottom: 0px;
      left: 0px;
      height: 0px;
      width: 100%;
      // padding-right: 15px;
      .spagination {
        position: absolute;
        bottom: 5px;
        right: 27%;
        text-align: center;
        .up,
        .down {
          width: 0px;
        }
        .pageNum {
          padding-top: 5px;
        }
      }
      .set {
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 5px;
        height: 5px;
        border-right: 1px solid $theme-color;
        border-bottom: 1px solid $theme-color;
      }
    }
    .menuLeft,
    .menuRight {
      position: absolute;
      // top: 50%;
      top: 71%;
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 50%;
      -moz-border-radius: 50%;
      background: rgba(0, 0, 0, 0.2);
      i {
        font-size: 14px;

        color: #fff;
        line-height: 25px;
      }
    }
    .menuLeft {
      left: 0px;
    }
    .menuRight {
      right: 0px;
    }
  }
  .el-form--inline {
    width: 100%;
    margin-top: 0px;
  }
  .el-form--inline .el-form-item {
    margin-right: 15px;
  }
  .el-radio,
  .el-checkbox {
    margin-right: 10px;
  }
  .el-table .el-checkbox {
    margin-right: 0px;
  }
  .el-radio__label {
    font-size: 12px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
  .userInfo,
  .costInfo {
    zoom: 1;

    &:after {
      @include _clearBoth();
    }
    & > li {
      float: left;
      & > span {
        color: #000;
      }
    }
    .el-button {
      width: 90px;
      height: 40px;
      line-height: 24px;
      font-size: 20px;
    }
    .AmountCharged {
      width: 300px !important;
      font-weight: 700;
      .el-input {
        width: 65% !important;

        .el-input__inner {
          // color: red !important;
          font-size: 28px;
          margin-right: 5px;
          height: 40px;
          line-height: 40px;
          width: 100%;
        }
      }
    }
  }
  .userInfo {
    .userDetails {
      color: $theme-color;
      cursor: pointer;
      .ctmNo {
        text-decoration: underline;
        color: $theme-color;
      }
    }
    & > li {
      color: #909399;
      width: 50%;
      margin-bottom: 15px;
      font-size: 14px;
      &:last-of-type {
        color: #a24848;
      }
      .userInfoLabel {
        color: #111;
        font-weight:550;
        display: inline-block;
        width: 80px;
        text-align: justify;
        text-align-last: justify;
      }
    }
  }

  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .el-table__body tr.current-row > td,
  .el-table__body tr.hover-row.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped > td,
  .el-table__body tr.hover-row > td {
    background-color: #fff;
    word-wrap: break-word;
  }
  .leftFormOption .demo-form-inline,
  .leftFormPaymentOption,
  .userInfo {
    border: 1px solid #aebbc342;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .kl-table-IntegratedBusiness {
    position: relative;
    //   padding: 0px;
    //   width: 100%;
    height: calc(100% - 340px);
    width: 100%;
    .el-table {
      margin-top: 10px;
      //     width: 100%;
      // height: calc(100% - 10px);
      .el-table__body-wrapper {
        overflow-y: auto;
        height: calc(100% - 31px);
      }
      .el-table__footer-wrapper {
        height: 0px;
        .el-table__footer {
          border-collapse: collapse;
        }
      }

      .table-row-red {
        color: #F56C6C;
      }
      .table-row-purple {
        color:#A040FF;
      }
      .table-row-dark-blue {
        color:#0B417A;
      }
      .table-row-yellow {
        color:#E6A23C;
      }
      .table-row-light-blue {
        color:#62A8F2;
      }
      .table-row-green {
        color: #67C23A;
      }
      .el-checkbox{
        .is-disabled {
          .el-checkbox__inner::after {
            border-color: #409eff;
          }
        }
      }
    }
    //   .table-tool {
    //     .el-checkbox-group {
    //       width: 280px;
    //       display: inline-block;
    //     }
    //     .payLabel {
    //       font-size: 15px;
    //     }
    //   }
    .tableMore {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 111;
      cursor: pointer;
    }
  }
  .border-line {
    width: 1px;
    border-right: 1px dashed #dfe3e6;
    height: 18px;
    margin-top: 5px;
  }
  .el-table__body-wrapper .el-table_97_column_1181 .cell {
    height: 90px;
    line-height: 90px;
    word-wrap: break-word;
  }
}
.el-tooltip__popper.is-light {
  border: 1px solid #297acc;
  color: #297acc;
}

</style>
