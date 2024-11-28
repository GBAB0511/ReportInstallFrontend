<template>
  <div class="FinancialAdjustmentEdit">
    <el-form
      :disabled="NotDisabled"
      class="formBill"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="130px"
      ref="ruleForm" 
      :rules="rules"
    >
      <el-form-item
        label="用户编号："
        v-if="formData.processState=='register'||formData.processState==''||editNeedData.busicode=='FnAddCostAdd'"
        class="userNo"
      >
        <el-input
          class="read-only"
          v-model="searchUserNum"
          placeholder="请输入用户编号"
          @keydown.enter.native="initUserNo(searchUserNum)"
          clearable
        >
          <el-button
            slot="append"
            class="searchBtn scanning-btn"
            @click="initUserNo"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-form-item>
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.busicode!='FnAddCostAdd'" ref="billInfo"></billInfo>

      <!-- 用户信息 -->
      <!-- <userInfo ref="userInfo" :editType="0" :wayOpen="wayOpen"></userInfo> -->
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
      <el-form-item label="营业区域：" class="disable-item">
        <span>{{formData.businessAreaName}}</span>
      </el-form-item>
      <el-form-item label="用水类型：" class="disable-item">
        <span>{{formData.useWaterTypeName}}</span>
      </el-form-item>
      <el-form-item label="上期抄表日期：" class="disable-item">
        <span>{{formData.priorPeriodMrDate}}</span>
      </el-form-item>
      <el-form-item label="上期抄码：" :class="{'disable-item': NotDisabled}">
        <el-input v-model="formData.priorPeriodNum" v-if="!NotDisabled" placeholder @input="changePriorNum" 
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
        <span v-else>{{formData.priorPeriodNum}}</span>
      </el-form-item>
      <el-form-item label="上期水量：" class="disable-item">
        <span>{{formData.priorPeriodWater}}</span>
      </el-form-item>
       <el-form-item label="年水量：" class="disable-item">
        <span>{{formData.yearWater}}</span>
      </el-form-item>

      <legend class="legendColumn">追补信息</legend>
      <el-form-item label="追补类型：" :class="{'disable-item': NotDisabled}" prop="addType">
        <el-select v-if="!NotDisabled" clearable v-model="formData.addType" placeholder>
          <el-option
            v-for="item in dictionaryData.COST_ADD_TYPE" 
            :key="item.id" :label="item.name" :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.addTypeName}}</span>
      </el-form-item>

      <el-form-item label="用水类型：" :class="{'disable-item': NotDisabled}" prop="newUseWaterType">
        <el-cascader
          v-if="!NotDisabled"
          v-model="formData.newUseWaterType"
          :options="waterTypeData"
          :show-all-levels="false"
          :props="props" 
           @change="changeWaterType"
        ></el-cascader>
        <span v-else>{{formData.newUseWaterTypeName}}</span>
      </el-form-item>

      <el-form-item label="水价版本：" :class="{'disable-item': NotDisabled}" prop="priceVersion">
        <el-select v-if="!NotDisabled" clearable v-model="formData.priceVersion" placeholder  @change="changePrice">
          <el-option
            v-for="item in waterPriceData"
            :key="item.id"
            :label="item.effectiveDate+':'+item.remark"
            :value="item.id"
          ></el-option>
        </el-select>
        <span v-else>{{formData.priceVersionName}}</span>
      </el-form-item>

      <el-form-item  label="更新年水量：" :class="{'disable-item': NotDisabled}" prop="updateYearWaterFlag">
        <el-select v-if="!NotDisabled" clearable v-model="formData.updateYearWaterFlag" placeholder >
          <el-option
            v-for="(item,index) in updateReadingNumFlagOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.updateYearWaterFlagName}}</span>
      </el-form-item>
      <el-form-item  label="更新抄码：" :class="{'disable-item': NotDisabled}" prop="updateReadingNumFlag">
        <el-select v-if="!NotDisabled" clearable v-model="formData.updateReadingNumFlag" placeholder >
          <el-option
            v-for="(item,index) in updateReadingNumFlagOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span v-else>{{formData.updateReadingNumFlagName}}</span>
      </el-form-item>


      <el-form-item  label="抄表日期：" :class="{'disable-item': NotDisabled}" prop="meterReadingDate">
        <el-date-picker
          v-if="!NotDisabled"
          v-model="formData.meterReadingDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
        <span v-else>{{formData.meterReadingDate}}</span>
      </el-form-item>

      <el-form-item  label="本期抄码：" :class="{'disable-item': NotDisabled }" prop="currendPeriodNum">
        <el-input v-model="formData.currendPeriodNum" v-if="!NotDisabled" placeholder @input="changeCurrendNum" 
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
        <span v-else>{{formData.currendPeriodNum}}</span>
      </el-form-item>

      <el-form-item label="追补水量：" :class="{'disable-item': NotDisabled }" prop="currendPeriodWater">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.currendPeriodWater" v-if="!NotDisabled" placeholder @input="changeAddWater" 
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
        <span v-else>{{formData.currendPeriodWater}}</span>
      </el-form-item>
      
      <br />
      <el-form-item class="f2" label="备注：" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments" placeholder></el-input>
        <span v-else>{{formData.comments}}</span>
      </el-form-item>
      <el-form-item :class="{'disable-item': NotDisabled}">
      <el-checkbox-group v-model="formData.notCalLadder">
                    <el-checkbox label="1" >不计阶梯</el-checkbox>
                </el-checkbox-group>
      </el-form-item>
       <el-form-item class="disable-button" >
        <el-button v-if="!NotDisabled" @click="calCulateWater()" class="calculate">计算</el-button>
      </el-form-item>

      <!--<el-table ref="elTable"  stripe border center :data="tableList"  @selection-change="getSelectData" class="change-tables-table">

        <el-table-column type="selection"  width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" >
        </el-table-column>

        <el-table-column prop="costName" min-width="80" label="费用项目" show-overflow-tooltip>
        </el-table-column> 

        <el-table-column :label="item.waterName"  v-for="(item,index) in ladderList" :key="index">
              <template slot-scope="scope">              
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row[item.waterEn]" @change="changeWater(scope.row)" :readonly="isReadOnly" :disabled="NotDisabled"></el-input>  
              </template>
        </el-table-column>

        <el-table-column :label="item.priceName"  v-for="(item,index) in ladderList" :key="'info_'+index">
              <template slot-scope="scope">              
                <span style="color:black;">{{scope.row[item.priceEn]}}</span>
              </template>
        </el-table-column>
        <el-table-column prop="money" min-width="100" label="金额">
        </el-table-column>

      </el-table>-->
      <el-table ref="elTable" stripe border :data="tableData" class="change-tables-table" @selection-change="getSelectData"  :summary-method="getSummaries" show-summary>
          <!--<el-table-column prop="accountPeriod" min-width="60" label="账期"></el-table-column>-->
          
        <el-table-column type="selection"  width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" >
        </el-table-column>
          <el-table-column prop="costName" min-width="90" label="费用类型"></el-table-column>
          <el-table-column :prop="'waterJ'+item" min-width="80" :label="'阶梯水量'+item"  
            v-for="(item,index) in level" :key="index">
            <template slot-scope="scope">             
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  size="mini" :disabled="NotDisabled" v-model="scope.row['waterJ'+item]" :readonly="isReadOnly" @change="changeWater(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column :prop="'priceJ'+item" min-width="80" :label="'阶梯水价'+item"  
            v-for="(item,index) in level" :key="index">
            <template slot-scope="scope">             
            
               <span style="color:black;">{{scope.row['priceJ'+item]}}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="money" min-width="100" label="金额"></el-table-column>
        </el-table>

      <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "FinancialAdjustmentEdit",
  props: ["editNeedData"],
  components: {
    billInfo,
    // userInfo,
    uploadFile
  },
  data() {
    return {
      costChange: 0,
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "bill_add_cost",
      NotDisabled: false, //是否可编辑
      isReadOnly:false,//是否可手动编辑水量
      approveFlag: 0,
      costIdOption: [],
      wayOpen: "FinancialAdjustmentEdit",
      waterPriceData:[],
      tableData:[],
      level:0,
      AdjustOption: [
        //{
        //  value: 1,
        //  label: "按金额"
        //},
        {
          value: 2,
          label: "按水量"
        }
      ],
      rules: {
        updateReadingNumFlag: [
          { required: true, message: '请选择是否更新抄码', trigger: 'change' }
        ],
        updateYearWaterFlag: [
          { required: true, message: '请选择是否更新年水量', trigger: 'change' }
        ],
        meterReadingDate: [
          { required: true, message: '请选择抄表日期', trigger: 'change' }
        ],
        currendPeriodWater: [
          { required: true, message: '请输入追补水量', trigger: 'blur' }
        ],
        newUseWaterType: [
          { required: true, message: '请选择追补用水类型', trigger: 'change' }
        ],
        priceVersion: [
          { required: true, message: '请选择水价版本', trigger: 'change' }
        ],
         currendPeriodNum: [
          { required: true, message: '请输入本期抄码', trigger: 'blur' }
        ],
      },
      updateReadingNumFlagOption: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      formData: {
        id: "",
        userNo: "",
        useWaterType: "",
        newUseWaterType:"",
        priorPeriodMrDate: "",
        addType: "1",
        updateReadingNumFlag: null,
        updateYearWaterFlag:null,
        accountPeriod: "",
        meterReadingDate: "",
        priorPeriodNum: "",
        priorPeriodWater: '',
        currendPeriodNum: "",
        priceVersion:'',
        currendPeriodWater:0,
        comments: "",
        notCalLadder:[],
        yearWater:null,
      },
      // 列表勾选数据
      selectData: [],
      searchUserNum: "",
      waterTypeData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath:false,
      },
      dictionaryData: {}
    };
  },
  mounted() {
    this.waterTypeDataOption();
    //console.log(this.editNeedData);
    if (this.editNeedData.saveType != 'add') {
      this.init();
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      this.getConfig();
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId= tempId
      this.getHtmlData();
    }
    
    
    this.getDictionary()
  },
  methods: {
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_add_cost",
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
        this.editNeedData.busicode
      );
    },
     // 列表选中数据事件（获取列表已勾选数据）
    getSelectData(data) {
      this.$set(this, "selectData", data);
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "COST_ADD_TYPE" //追补类型
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    init() {
      let params = {
        busicode: "FnAddCostQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          let date = {};
          date = res;
          date.accountPeriod = date.accountPeriod + "";
          this.formData = date;
          //单据信息
          this.getBillData(res);
          this.searchUserNum = this.formData.userNo;
          if (
            this.formData.processState == "approval" ||
            this.formData.processState == "END"
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
          }
          if(this.formData.notCalLadder != null && this.formData.notCalLadder != '')
            this.formData.notCalLadder = this.formData.notCalLadder.split(',')
          else
             this.formData.notCalLadder = []
          this.tableData = res.ladders 
          this.level = res.level 
          this.WaterPriceList(res.newUseWaterType,1);
          
          this.getHtmlData();

          // 获取完数据调用
          this.$nextTick(function(){
            this.$refs.elTable.toggleAllSelection()
          })
        });
    },
    changePrice(){
        this.tableData = []
        this.level = 0
    },
     changeWater(item) {
        let total = 0
        if(this.formData.priceVersion == undefined || this.formData.priceVersion == null || this.formData.priceVersion == '') {
            this.$message({
            message: "请先选择水价版本",
            type: "warning"
          });
        }     
        console.log(item)
        for(var i =1 ;i<=this.level;i++) {
            if(item['waterJ'+i] != undefined && item['waterJ'+i] != null && item['waterJ'+i] != '')
             total = this.NumberAdd(total,this.NumberMul(item['waterJ'+i],item['priceJ'+i]))
        }
        this.$set(item,'money',total);
    },
     calCulateWater(){
      let _this = this
      if(_this.formData.priceVersion == '' || _this.formData.priceVersion == null || _this.formData.priceVersion == 'undefined') {
         _this.$message.error('水价版本不能为空');
         return;
      }
      if(_this.formData.currendPeriodWater == '' || _this.formData.currendPeriodWater == null || _this.formData.currendPeriodWater == 'undefined') {
        _this.formData.currendPeriodWater = 0;
      }
      if((Number.isNaN(parseFloat(_this.formData.currendPeriodNum))?0:parseFloat(_this.formData.currendPeriodNum))
           < (Number.isNaN(parseFloat(_this.formData.priorPeriodNum))?0:parseFloat(_this.formData.priorPeriodNum))) {
         _this.$message.error('本期码不能小于上期码');
         return;
      }
      let priceDetail = []
      let costData = []
      let params = {
        busicode: "WaterPriceQueryLadder",
        data: {
          id:_this.formData.priceVersion
        }
      }
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
         priceDetail = res
         _this.calculate(priceDetail)
        });
      
     
    },
    calculate(priceDetail){
      let _this = this
      let costData = []
       if(priceDetail == null || priceDetail.length == 'undefined' || priceDetail.length<=0) {
         _this.$message.error('水价费用详情为空');
         return;
      }

      priceDetail.forEach(item=>{
        costData.push({costNo:item.costNo,costName:item.costName,id:item.costId})
      })
      let notCalLadder = 0;
      if( _this.formData.notCalLadder.length>0)
          notCalLadder = 1;
     
      let params = {
        busicode: "FnRedRushCalculate",
        data: {
          costNos:costData,
          addWater:this.formData.currendPeriodWater,
          waterPriceId:this.formData.priceVersion,
          userNo:this.formData.userNo,
          notCalLadder:notCalLadder
        }
      }
      _this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res.list;
          _this.level=res.level;
          // 获取完数据调用
          _this.$nextTick(function(){
            _this.$refs.elTable.toggleAllSelection()
          })
        });
    },
     NumberMul(arg1, arg2) {//浮点乘法
        var m = 0;
        var s1 = arg1.toString();
        var s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {}
        try {
            m += s2.split(".")[1].length;
        } catch (e) {}
    
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    NumberAdd(arg1, arg2) {//浮点加法
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
    NumberSub(arg1, arg2) {//浮点减法
      var re1, re2, m, n;
      try {
          re1 = arg1.toString().split(".")[1].length;
      } catch (e) {
      re1 = 0;
      }
      try {
          re2 = arg2.toString().split(".")[1].length;
      } catch (e) {
          re2 = 0;
      }
      m = Math.pow(10, Math.max(re1, re2)); 
      n = (re1 >= re2) ? re1 : re2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
  changeAddWater(val) {
      // const pre = Number.isNaN(parseFloat(this.formData.priorPeriodNum)) ? 0 : parseFloat(this.formData.priorPeriodNum)
      // const currendNum = Number.isNaN(parseFloat(val)) ? 0 : parseFloat(val)
      // this.formData.currendPeriodNum =  this.NumberAdd(pre,currendNum);
      this.levle = 0 ;
      this.tableData = [];
  },
  changePriorNum(val){
      const now = Number.isNaN(parseFloat(this.formData.currendPeriodNum)) ? 0 : parseFloat(this.formData.currendPeriodNum)
      const pre = Number.isNaN(parseFloat(val)) ? 0 : parseFloat(val)

      this.formData.currendPeriodWater = this.NumberSub(now ,pre);
      this.levle = 0 ;
      this.tableData = [];
    },
    changeCurrendNum(val){
      const now = Number.isNaN(parseFloat(val)) ? 0 : parseFloat(val)
      const pre = Number.isNaN(parseFloat(this.formData.priorPeriodNum)) ? 0 : parseFloat(this.formData.priorPeriodNum)

      this.formData.currendPeriodWater = this.NumberSub(now ,pre);
      this.levle = 0 ;
      this.tableData = [];
    },
     getConfig(){  //判断当前水司水表型号是否结构化
      let _this = this
      var params = {
        busicode: "ConfigList",
        data:{searchContent:'BILL_ADD_COST_EDIT_WATER'}
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = res.list
          if(data!=null && data.length > 0) {
            if(data[0].configValue == '1')
              _this.isReadOnly = false
            else
              _this.isReadOnly = true
          }else
            _this.isReadOnly = true
            console.log(_this.isReadOnly)
        })
        .catch(res => {

        });
    },

    getFormbData() {
      let _this = this
      if(_this.formData.currendPeriodWater == '' || _this.formData.currendPeriodWater == null || _this.formData.currendPeriodWater == 'undefined') {
        _this.formData.currendPeriodWater = 0;
      }


      if( _this.formData.notCalLadder.length > 0)
        _this.formData.notCalLadder = _this.formData.notCalLadder.toString()
      else
        _this.formData.notCalLadder = [];

      
      let ladders = []

      this.selectData.forEach(item=>{
        let ladder = {}
        ladder.costNo = item.costNo;
        ladder.costName = item.costName;
        ladder.priceJ1 = (item.priceJ1 == 'undefined' || item.priceJ1 == null || item.priceJ1 == ''?0:item.priceJ1 );
        ladder.priceJ2 = (item.priceJ2 == 'undefined' || item.priceJ2 == null || item.priceJ2 == ''?0:item.priceJ2 );
        ladder.priceJ3 = (item.priceJ3 == 'undefined' || item.priceJ3 == null || item.priceJ3 == ''?0:item.priceJ3 );
        ladder.priceJ4 = (item.priceJ4 == 'undefined' || item.priceJ4 == null || item.priceJ4 == ''?0:item.priceJ4 );
        ladder.priceJ5 = (item.priceJ5 == 'undefined' || item.priceJ5 == null || item.priceJ5 == ''?0:item.priceJ5 );
        ladder.priceJ6 = (item.priceJ6 == 'undefined' || item.priceJ6 == null || item.priceJ6 == ''?0:item.priceJ6 );
        ladder.priceJ7 = (item.priceJ7 == 'undefined' || item.priceJ7 == null || item.priceJ7 == ''?0:item.priceJ7 );
        ladder.priceJ8 = (item.priceJ8 == 'undefined' || item.priceJ8 == null || item.priceJ8 == ''?0:item.priceJ8 );
        ladder.waterJ1 = (item.waterJ1 == 'undefined' || item.waterJ1 == null || item.waterJ1 == ''?0:item.waterJ1 );
        ladder.waterJ2 = (item.waterJ2 == 'undefined' || item.waterJ2 == null || item.waterJ2 == ''?0:item.waterJ2 );
        ladder.waterJ3 = (item.waterJ3 == 'undefined' || item.waterJ3 == null || item.waterJ3 == ''?0:item.waterJ3 );
         ladder.waterJ4 = (item.waterJ4 == 'undefined' || item.waterJ4 == null || item.waterJ4 == ''?0:item.waterJ4 );
        ladder.waterJ5 = (item.waterJ5 == 'undefined' || item.waterJ5 == null || item.waterJ5 == ''?0:item.waterJ5 );
        ladder.waterJ6 = (item.waterJ6 == 'undefined' || item.waterJ6 == null || item.waterJ6 == ''?0:item.waterJ6 );
         ladder.waterJ7 = (item.waterJ7 == 'undefined' || item.waterJ7 == null || item.waterJ7 == ''?0:item.waterJ7 );
        ladder.waterJ8 = (item.waterJ8 == 'undefined' || item.waterJ8 == null || item.waterJ8 == ''?0:item.waterJ8 );
        ladder.money = (item.money == 'undefined' || item.money == null || item.money == ''?0:item.money );
        ladders.push(ladder);
      })
      this.$set(this.formData,'ladders',ladders);
      return {...this.formData,notCalLadder:this.formData.notCalLadder.length === 0 ?undefined : this.formData.notCalLadder};
    },
    submit() {
      console.log(this.formData)
      let params = {};
      if(this.formData.currendPeriodWater<0){
        this.$notify({
          title: "警告",
          message: "追补水量不能小于0",
          type: "warning"
        });
        return;
      }   
      if(this.selectData.length<=0) {
        this.$notify({
          title: "警告",
          message: "请勾选费用项目",
          type: "warning"
        });
        return;
      }  
      this.$refs['ruleForm'].validate((valid) => {
        if(valid) {
          params = {
            busicode: this.editNeedData.busicode,
            data: this.getFormbData()
          };
          this.$api.fetch({ params }).then(res => {
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success"
            });
            this.$parent.closeDialog();
          });
        }else{
             return false;
        }
      });
       
      
    },
     
    initUserNo() {
      //用户编号查询
      if (this.searchUserNum == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      this.tableData = []
      this.level = 0
      let data = {
        userNo: this.searchUserNum
      };
      let params = {
        busicode: "FnAddCostInitUser",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {   
          if(res.notCalLadder != '' && res.notCalLadder != null)
            res.notCalLadder = res.notCalLadder.split(',')
          else
            res.notCalLadder = []
          this.formData=res;
          if(res.newUseWaterType !=undefined && res.newUseWaterType != null && res.newUseWaterType != '')
            this.WaterPriceList(res.newUseWaterType,1);

        });
    },
    changeWaterType(val){
      this.formData.priceVersion = ''
      this.WaterPriceList(val,2) 

    },
    //用水价格下拉框
    WaterPriceList(id,type){
      var _this = this;
      if(type == 2) {
          _this.tableData = []
          _this.level = 0
      }
      
      var params = {
        busicode: "WaterPriceList",
        data: {
          waterTypeId:id,
          page:1,
          pageCount:999,
          status:"1",
          processState:'END'
        } //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$set(_this,'waterPriceData',res.list);
          if(type == 2 && res.list != null &&  res.list.length>0) {
            this.$set(this.formData,'priceVersion',res.list[res.list.length-1].id)
          }   
        });
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
    //用水分类下拉数据
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
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    // 追补信息金额合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      const arr = ['money']
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if (!arr.includes(column.property)) {
          sums[index] = ''
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              if(column.property === 'priorPeriodNum' || column.property === 'currendPeriodNum') {
                return Number(prev) + Number(curr)
              }
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = 'N/A';
        }
      });

      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>
$theme-font-color: #3680cd;
.FinancialAdjustmentEdit {
  overflow-y: auto;
  height: 100%;
  .userNo {
    width: 360px;
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
  .calculate{
    background-color:#66b1ff;
    color:#FFF
  }
}
/deep/ {
  .el-table__footer-wrapper .el-table__footer .is-leaf .cell{
    font-weight: bold;
    font-size: 14px;
  }
}
</style>

