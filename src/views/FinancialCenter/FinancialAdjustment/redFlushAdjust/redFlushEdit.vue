<template>
  <div class="RedFlushingEdit">
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="100px"
      ref="ruleForm"
      :rules="rules"
    >
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.busicode!='FnRedRushAdd'" ref="billInfo"></billInfo>
      <div v-if="editNeedData.busicode=='FnRedRushAdd'">
        <br>
      <el-form-item label="用户编号：" class="disable-item" v-if="editNeedData.busicode=='FnRedRushAdd'">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :disabled="!NotDisabled" v-model="tableQuery.userNo" placeholder="" clearable @keydown.enter.native="handleSelect()"></el-input>
      </el-form-item>
      <el-form-item label="红冲开始账期：" class="disable-item" v-if="editNeedData.busicode=='FnRedRushAdd'">
         <el-date-picker :disabled="!NotDisabled" v-model="tableQuery.redRushStart" size="mini" type="month" format="yyyy-MM" value-format="yyyyMM" placeholder="选择月" @keydown.enter.native="handleSelect()"></el-date-picker>
      </el-form-item>
      <el-form-item label="红冲结束账期：" class="disable-item" v-if="editNeedData.busicode=='FnRedRushAdd'">
         <el-date-picker :disabled="!NotDisabled" v-model="tableQuery.redRushEnd" size="mini" type="month" format="yyyy-MM" value-format="yyyyMM" placeholder="选择月" @keydown.enter.native="handleSelect()"></el-date-picker>
      </el-form-item>
      <el-form-item label="是否核销：" class="disable-item" v-if="editNeedData.busicode=='FnRedRushAdd'">
        <el-select :disabled="!NotDisabled" v-model="tableQuery.chargingFlag" placeholder="">
            <el-option label="全部" value=""></el-option>
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
      </el-form-item>
        <el-button v-if="editNeedData.busicode=='FnRedRushAdd'" class="searchBtn " icon="el-icon-search " @click="handleSelect()" size='mini' @keydown.enter.native="handleSelect()" ></el-button>
      </div>
      <legend class="legendColumn">用户信息</legend>
      <el-form-item label="用户编号：" class="disable-item">
        <span>{{formData.userNo}}</span>
      </el-form-item>
      <el-form-item label="客户名称：" class="disable-item">
        <span>{{formData.ctmName}}</span>
      </el-form-item>
      <el-form-item label="客户地址：" class="disable-item">
        <span>{{formData.ctmAddr}}</span>
      </el-form-item>
      <el-form-item label="用水类型：" class="disable-item">
        <span>{{formData.useWaterType}}</span>
      </el-form-item>
        <legend class="legendColumn" >待红冲信息
          <!--el-checkbox-group v-model="costs" @change="changeCost" class="inlineBox" v-if="NotDisabled">
            <el-checkbox v-for="item in costData" :value="item.costNo" :key="item.costNo" :label="item.costNo">{{item.costName}}</el-checkbox>
          </el-checkbox-group-->
        </legend>
      <el-table tripe border :data="detailList" class="change-tables-table" ref="elTable" highlight-current-row
            :show-summary="true" :summary-method="detailListSummary" @selection-change="getSelectData">
          <el-table-column type="selection"  width="55" fixed="left" >
        </el-table-column>
          <el-table-column prop="accountPeriod" min-width="60" label="账期"></el-table-column>
          <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期"></el-table-column>

          <el-table-column prop="priorPeriodNum" min-width="100" label="上期抄码" align="right"></el-table-column>
          <el-table-column prop="currendPeriodNum" min-width="100" label="本期抄码" align="right"></el-table-column>
          <el-table-column prop="costName" min-width="90" label="费用类型"></el-table-column>
          <el-table-column :prop="'waterJ'+item" min-width="80" :label="'阶梯水量'+item" align="right"
            v-for="(item,index) in detailLevel" :key="index">
          </el-table-column>
          <el-table-column :prop="'priceJ'+item" min-width="80" :label="'阶梯水价'+item" align="right"
            v-for="(item,index) in detailLevel" :key="index">
          </el-table-column>
          <el-table-column prop="amount" min-width="80" label="金额" align="right"></el-table-column>
          <el-table-column prop="chargingFlag" min-width="80" label="是否核销"></el-table-column>
      </el-table>
      <legend class="legendColumn">调整信息</legend>
      <el-form-item label="退款方式：" prop="refundWay" :class="{'disable-item': NotDisabled}" label-width="100px">
        <el-select :disabled="!NotDisabled" v-model="formData.refundWay" @change="changeWay">
            <el-option v-for="(item,index) in dictionaryData.YET" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item v-if="showFormItem" label="开户银行：" prop="bankName" :class="{'disable-item':editType==0}">
          <span  v-if="!NotDisabled">{{formData.bankName}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankName" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="showFormItem" label="户名：" prop="bankAccountName" style="width: calc(46% + 10px)" :class="{'disable-item':editType==0}">
          <span  v-if="!NotDisabled">{{formData.bankAccountName}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankAccountName" placeholder="" clearable></el-input>
        </el-form-item>
      <el-form-item v-if="showFormItem" label="银行账户：" prop="bankAccount" style="width: calc(46% + 10px)" :class="{'disable-item':editType==0}">
          <span  v-if="!NotDisabled">{{formData.bankAccount}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankAccount" placeholder="" clearable></el-input>
        </el-form-item>
      <el-form-item label="调整类型：" :class="{'disable-item': NotDisabled}">
        <el-select :disabled="!NotDisabled" clearable v-model="formData.redRushType" @change="clearTable">
            <el-option v-for="(item,index) in dictionaryData.HCT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
      </el-form-item>
       <el-form-item v-show="rushVisble" label="新用水类型：" :class="{'disable-item': NotDisabled}">
        <el-cascader
          :disabled="!NotDisabled"
          v-model="formData.newUseWaterType"
          :options="waterTypeData"
          :show-all-levels="false"
          :props="props"
          @change="changeWaterType"
        ></el-cascader>
      </el-form-item>
      <el-form-item v-show="rushVisble" label="水价版本：" :class="{'disable-item': NotDisabled}">
        <el-select :disabled="!NotDisabled" clearable v-model="formData.usePriceVersion" placeholder>
          <el-option
            v-for="item in waterPriceData"
            :key="item.id"
            :label="item.effectiveDate+':'+item.remark"
            :value="item.id"
          ></el-option>
        </el-select>

      </el-form-item>
      <el-form-item v-show="rushVisble" label="更新年水量：" prop="updateYearWater" :class="{'disable-item': NotDisabled}">
        <el-select :disabled="!NotDisabled" clearable v-model="formData.updateYearWater" placeholder>
          <el-option :key="0" label="否" :value="0"></el-option>
          <el-option :key="1" label="是" :value="1"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item v-show="rushVisble" label="上期抄码：" :class="{'disable-item': NotDisabled}">
        <el-input v-if="NotDisabled" v-model.number="formData.priorPeriodNum" @input="caculate" @keydown.native="handleKeyDown"></el-input>
        <span v-else>{{formData.priorPeriodNum}}</span>
      </el-form-item>
      <el-form-item v-show="rushVisble" label="本期抄码：" :class="{'disable-item': NotDisabled}" >
        <el-input v-if="NotDisabled" v-model.number="formData.currendPeriodNum" @input="caculate" @keydown.native="handleKeyDown"></el-input>
        <span v-else>{{formData.currendPeriodNum}}</span>
      </el-form-item>
      <el-form-item v-show="rushVisble" label="追加水量：" :class="{'disable-item': NotDisabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="NotDisabled" v-model.number="formData.addWater" @keydown.native="handleKeyDown"></el-input>
        <span v-else>{{formData.addWater}}</span>
      </el-form-item>
      <el-form-item v-show="rushVisble" label="更新抄码：" prop="updateMeterReading" :class="{'disable-item': NotDisabled}">
        <el-select :disabled="!NotDisabled" clearable v-model="formData.updateMeterReading" placeholder>
          <el-option :key="0" label="否" :value="0"></el-option>
          <el-option :key="1" label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="rushVisble" class="f2" label="备注：">
        <el-input :disabled="!NotDisabled" type="textarea" v-model="formData.comments" placeholder></el-input>
      </el-form-item>
       <span v-show="rushVisble" class="f2"> <el-button size="mini"  v-show="NotDisabled" @click="calCulateWater()" class="calculate">计算</el-button></span>
      <!-- <el-form-item v-show="rushVisble" class="f2">
        <el-button  v-show="NotDisabled" @click="calCulateWater()" class="calculate">计算</el-button>
      </el-form-item> -->
      <div class="kl-table" v-show="rushVisble">
        <el-table stripe border :data="tableData" class="change-tables-table" :show-summary="true" :summary-method="detailListSummary">
          <el-table-column prop="accountPeriod" min-width="60" label="账期"></el-table-column>
          <el-table-column prop="costName" min-width="90" label="费用类型"></el-table-column>
          <el-table-column :prop="'waterJ'+item" min-width="80" :label="'阶梯水量'+item"
            v-for="(item,index) in level" :key="index">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  size="mini" :disabled="!NotDisabled" v-model="scope.row['waterJ'+item]" @blur="totalAmount(scope.row,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column :prop="'priceJ'+item" min-width="80" :label="'阶梯水价'+item"
            v-for="(item,index) in level" :key="index">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  size="mini" :disabled="!NotDisabled" v-model="scope.row['priceJ'+item]" @blur="totalAmount(scope.row,scope.$index)"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="amount" min-width="80" label="金额"></el-table-column>
        </el-table>
      </div>
      <!--legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile-->
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo"; //单据信息
import userInfo from "@/views/publicModule/infmtnManagement/userInfo"; //用户信息
export default {
  name: "RedFlushingEdit",
  props: ["editNeedData","NotDisabled","userNo"],
  components: {
    uploadFile,
    billInfo,
    userInfo
  },
  data() {
    return {
      rushVisble:true,
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "bill_rush_red#2",
      waterTypeData: [], //用水类型
      costData:[],
      showFormItem:false,
      costs:[],
      tableData:[],
      accountPeriod:"",
      detailLevel:1,
      cPeriodNum:'',//记录本期抄码
      formData: {
        id:"",
        ctmAddr:"",
        ctmName:"",
        redRushType:"0",
        refundWay:"1",
        bankName:"",
        bankAccount:"",
        bankAccountName:"",
        currendPeriodNum:"",
        priorPeriodNum:"",
        usePriceVersion:"",
        useWaterType:"",
        newUseWaterType:"",
        userNo:"",
        updateMeterReading:"",
        updateYearWater:"",
        addWater:0,
      },
      tableQuery:{
        userNo:"",
        redRushStart:"",
        redRushEnd:"",
        chargingFlag:"",
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      approveFlag: 0,
      searchUserNum: "C0101310",
      wayOpen: "LiquidatedDamagesEdit",
      rules: {
        updateMeterReading: [
          { required: true, message: '请选择是否更新抄码', trigger: 'change' }
        ],
        updateYearWater: [
          { required: true, message: '请选择是否更新年水量', trigger: 'change' }
        ],
        refundWay: [
          { required: true, message: '请选择余额退款方式', trigger: 'change' }
        ],
      },
      rushWater:0,//红冲水量
      detailList:[],
      waterPriceData:[],
      billDetailIds:"",
      allTableData:[],
      waterNum:"",
      ladderList:[],
      level:0,
      props: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath:false,
      },
      dictionaryData: {},
      updateReadingNumFlagOption: [
         {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ]
    };
  },
  mounted() {
    if (this.editNeedData.saveType != 'add') {
      this.init(this.editNeedData.id)
    }else{
      console.log(this.userNo)
      if(this.userNo){
        this.tableQuery.userNo = this.userNo
      }
      this.getHtmlData();
    }

    this.getDictionary()
    this.waterTypeDataOption();
  },
  methods: {
    init(id){
      let _this =this
      let params = {
        busicode: "FnRedRushQuery",
        data: {id:id}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res.detail.processState==='' || res.detail.processState==='register'){
            this.approveFlag=0
          }else{
            this.approveFlag=1
          }
          _this.tableQuery.userNo=res.detail.userNo;
          _this.tableQuery.redRushStart=res.detail.redRushStart;
          _this.tableQuery.redRushEnd=res.detail.redRushEnd;
          _this.tableQuery.chargingFlag=res.detail.chargingFlag;
          _this.formData = res.detail;
          _this.detailList = res.detailList;
          _this.allTableData=res.detailList;
          _this.billDetailIds=res.detail.billDetailIds;
          _this.tableData = res.redDetailList;

          _this.cPeriodNum = res.detail.currendPeriodNum

          _this.level=res.level
          _this.costData=res.costsName
          _this.costs = res.costs
          _this.WaterPriceList(res.detail.newUseWaterType);
          _this.$refs.billInfo.init(res.detail);
          this.getHtmlData();
          _this.showRush(res.detail.redRushType);
          // 获取完数据调用
          this.$nextTick(function(){
            this.$refs.elTable.toggleAllSelection()
          })
          //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        });
    },
    handleKeyDown(e){
      let key = null;
      if (window.event === undefined) {
        key = e.keyCode;
      } else {
        key = window.event.keyCode;
      }
      if (key === 13) {
        //触发的事件
        this.calCulateWater();
      }
    },
    getSelectData(data) {
      let ids = []
      let hcWater = 0;
      data.forEach(element =>{
        ids.push(element.id)
        if(element.costNo == '01')
            hcWater = Number(hcWater)+Number(element.realityWater)
      })
      this.$set(this, "billDetailIds", ids.toString());
      this.rushWater = hcWater
    },
    selectShow(){
      return this.NotDisabled
    },
    clearTable(val){
      if(val=='0'){
        this.tableData=[]
        this.formData.currendPeriodNum = this.formData.priorPeriodNum
        this.formData.addWater = 0
      }
    },
    changeWay(item){
      if(item==2){
        this.showFormItem=true
      }else{
        this.showFormItem=false
      }
    },
    showRush(item){
      if(item==='0'){
        this.rushVisble=true;
      }else{
        this.rushVisble=true;
      }
    },
    handleSelect(){
      //输入户号账期后查询详情
      var _this = this;
      var params = {
        busicode: "FnRedRushQueryDetail",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          //_this.formData = res.detail;
          if(_this.formData.redRushType=='0') {
            _this.waterNum = 0
            _this.cPeriodNum = res.detail.currendPeriodNum
            res.detail.currendPeriodNum = res.detail.priorPeriodNum
          }else{
            _this.waterNum=res.detail.currendPeriodNum-res.detail.priorPeriodNum
          }
       
          _this.initFormData(res.detail)
          _this.detailList = res.detailList;
          let ids = []
          _this.detailList.forEach(element =>{
            ids.push(element.id)
          })
          _this.billDetailIds=ids.toString();
          _this.detailLevel=res.level;
          //保存所有返回的数据
          _this.allTableData= res.detailList
          _this.costData = res.cost;
          _this.accountPeriod=res.accountPeriod;
          _this.WaterPriceList(res.detail.newUseWaterType);
          this.costs=[]
          _this.costData.forEach(element => {
            this.costs.push(element.costNo)
          });
          this.$nextTick(function(){
            this.$refs.elTable.toggleAllSelection()
          })
        });
    },
    //不覆盖用户选择的调整类型
    initFormData(detail){
      this.formData={
        id:detail.id,
        ctmAddr:detail.ctmAddr,
        ctmName:detail.ctmName,
        redRushType:this.formData.redRushType,
        refundWay:this.formData.refundWay,
        bankName:this.formData.bankName,
        bankAccount:this.formData.bankAccount,
        bankAccountName:this.formData.bankAccountName,
        currendPeriodNum:detail.currendPeriodNum,
        priorPeriodNum:detail.priorPeriodNum,
        usePriceVersion:detail.usePriceVersion,
        useWaterType:detail.useWaterType,
        newUseWaterType:detail.newUseWaterType,
        userNo:detail.userNo,
        updateMeterReading:this.formData.updateMeterReading,
        updateYearWater:this.formData.updateYearWater,
        addWater:this.waterNum,
      }
    },
    calCulateWater(){
      let _this = this
      if(_this.formData.redRushType=='0'){
        this.$message({
              type: "warning",
              message: "计算失败，当前红冲类型不追加单据!"
            });
        return
      }
      let costNos = []
      this.costs.forEach(element => {
        this.costData.forEach(element1 => {
          if(element==element1.costNo)
            costNos.push({costNo:element1.costNo,costName:element1.costName})
        })
      });
      console.log(3333)
      console.log(_this.rushWater)
      let params = {
        busicode: "FnRedRushCalculate",
        data: {
          costNos:costNos,
          addWater:this.formData.addWater,
          waterPriceId:this.formData.usePriceVersion,
          userNo:this.tableQuery.userNo,
          redRushType:this.formData.redRushType,
          rushWater:_this.rushWater
        }
      }
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res.list;
          _this.level=res.level;
        });
    },
    caculate(val){
      // this.formData.addWater=Number(val?val:0)-Number(this.formData.priorPeriodNum)
       this.formData.addWater=Number(this.formData.currendPeriodNum?this.formData.currendPeriodNum:0)-Number(this.formData.priorPeriodNum)
    },
    caculate1(val){
      this.formData.currendPeriodNum=Number(this.formData.priorPeriodNum)+Number(val?val:0)
    },
    changeCost(val){
      let _this=this
      let redRush = []
      this.detailList = _this.allTableData.filter(v => val.indexOf(v.costNo)>-1)
      this.detailList.forEach(item => {
        val.forEach(item1 => {
          if(item1==item.costNo){
            redRush.push(item.id)
          }
        });
      });
      this.billDetailIds=redRush.toString();
    },
    totalAmount(row,index){
      const amount = (row.priceJ1*row.waterJ1+row.priceJ2*row.waterJ2+row.priceJ3*row.waterJ3+row.priceJ4*row.waterJ4).toFixed(2);
      let data = this.tableData[index]
      data.amount=amount
      this.$set(this.tableData,index,data);
    },
    changeWaterType(val){
      this.WaterPriceList(val)
    },
    changePrice(id){
      var _this = this;
      var params = {
        busicode: "WaterPriceQueryLadder",
        data: {
          id:id,
        } //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          let con = []
          this.ladderList=res
          this.tableData.forEach(item => {
            res.forEach(item1 => {
              let i = item
              if(item1.costNo==item.costNo && item1.ladders.length>0){
                i.priceJ1=item1.ladders.length>0 ? item1.ladders[0].price : item1.fixedPrice
                i.priceJ2=item1.ladders.length>1 ? item1.ladders[1].price : i.priceJ1
                i.priceJ3=item1.ladders.length>2 ? item1.ladders[2].price : i.priceJ2
                i.priceJ4=item1.ladders.length>3 ? item1.ladders[3].price : i.priceJ3
                con.push(i)
              }else if(item1.costNo==item.costNo && item1.ladders.length==0){
                i.priceJ1=item1.fixedPrice
                i.priceJ2=item1.fixedPrice
                i.priceJ3=item1.fixedPrice
                i.priceJ4=item1.fixedPrice
                con.push(i)
              }
            });
          });
          if(con.length>0)
            _this.$set(_this,"tableData",con)
        });
    },
    getCurrentDate(){
      var nowDate = new Date();
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1):nowDate.getMonth() + 1;
      var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      var dateStr = year + "" + month;
      return dateStr
    },
    detailListSummary({columns, data}) {
      console.log(columns, data);
       const sums = [];
      columns.forEach((item, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if(item.property !== 'amount') {
          sums[index] = ''
          return
        }
        const values = data.map(d => Number(d[item.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0).toFixed(2)
          } else {
            sums[index] = ''
          }
      })
      return sums
    },
    //用水价格下拉框
    WaterPriceList(id){
      var _this = this;
      var params = {
        busicode: "WaterPriceList",
        data: {
          waterTypeId:id,
          page:1,
          pageCount:999,
          processState:'END',
          status:'1',
        } //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.waterPriceData = res.list;
        });
    },
    getFormbData(){
      let detail = {
        id:this.formData.id,
        userNo:this.tableQuery.userNo,
        redRushStart:this.tableQuery.redRushStart,
        redRushEnd:this.tableQuery.redRushEnd,
        redRushType:this.formData.redRushType,
        refundWay:this.formData.refundWay,
        bankName:this.formData.bankName,
        bankAccount:this.formData.bankAccount,
        bankAccountName:this.formData.bankAccountName,
        useWaterType:this.formData.useWaterType,
        newUseWaterType:this.formData.newUseWaterType,
        usePriceVersion:this.formData.usePriceVersion,
        comments:this.formData.comments,
        updateYearWater:this.formData.updateYearWater,
        priorPeriodNum:this.formData.priorPeriodNum,
        currendPeriodNum:this.formData.currendPeriodNum,
        addWater:this.formData.addWater,
        updateMeterReading:this.formData.updateMeterReading,
        costs:this.costs.toString(),
        billDetailIds:this.billDetailIds,
      }
      let list = []
      if(this.tableData.length>0){
        this.tableData.forEach(item =>{
          let bean = {
            id:item.id,
            billDetailId:item.billDetailId,
            accountPeriod:item.accountPeriod,
            meterReadingDate:item.meterReadingDate,
            currendPeriodNum:item.currendPeriodNum,
            costName:item.costName,
            costNo:item.costNo,
            waterJ1:item.waterJ1,
            waterJ2:item.waterJ2,
            waterJ3:item.waterJ3,
            waterJ4:item.waterJ4,
            waterJ5:item.waterJ5,
            waterJ6:item.waterJ6,
            waterJ7:item.waterJ7,
            waterJ8:item.waterJ8,
            priceJ1:item.priceJ1,
            priceJ2:item.priceJ2,
            priceJ3:item.priceJ3,
            priceJ4:item.priceJ4,
            priceJ5:item.priceJ5,
            priceJ6:item.priceJ6,
            priceJ7:item.priceJ7,
            priceJ8:item.priceJ8,
            amount:item.amount,
          }
          list.push(bean)
        })
      }
      if(this.approveFlag==1){
        return {detail:detail,list:list,formVariables:{"refundWay":this.formData.refundWay}}
      }else{
        return {detail:detail,list:list}
      }
    },
    submit(){
      var _this = this;
      if(!_this.billDetailIds || _this.billDetailIds.length==0){
        this.$notify({
          title: "警告",
          message: "请勾选带红冲项目",
          type: "warning"
        });
        return;
      }
      if(!_this.formData.redRushType){
        this.$notify({
          title: "警告",
          message: "调整类型不能为空",
          type: "warning"
        });
        return;
      }
      console.log(_this.formData.redRushType);

      if(_this.formData.redRushType!=='0' && this.tableData.length==0){
        this.$notify({
          title: "警告",
          message: "调整类型需要追加水费，请先计算！",
          type: "warning"
        });
        return;
      }
      if(!_this.formData.addWater){
        _this.formData.addWater=0
      }
      var params = {
        busicode: "FnRedRushSave",
        data: this.getFormbData()
      };
      this.$refs['ruleForm'].validate((valid) => {
        if(valid) {
          this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "保存成功!"
            });
            // this.$parent.closeDialog();
          if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
              // 流程中心模块触发
              this.$parent.$parent.closeDialog();
            } else {
              // 普通模块触发
              this.$parent.closeDialog(); // 提交后回调方法
            }
          });
        }else{
          return false;
        }
      });

    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "HCT,YET" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    indexMethod(index) {
      //获取表格序号
      return index + 1;
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
    // 用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree"
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = this.getArr(res.children);
          this.waterTypeData = data
        })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "red_rush",
        "审批流配置:" +
          _this.formData.processName +
          "(" +
          _this.formData.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf('WaterSideIndex') > 0 || window.location.href.indexOf('HallBusiness') > 0) {// 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog()
          } else {// 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        "FnRedRushSave"
      );
    },
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.RedFlushingEdit {
  height: 100%;
  overflow-y: auto;
  //margin-top: 10px;
  .el-form .disable-item .el-form-item__content{
    border-bottom:none;
  }
  .inlineBox{
    display: inline-block;
    margin-left: 10px;
  }
  .calculate{
    background-color:#66b1ff;
    color:#FFF;
    margin-left:3%
  }
  .el-form-item__error{
    padding-top:4px;
    color:#F56C6C !important;
  }
}
</style>

