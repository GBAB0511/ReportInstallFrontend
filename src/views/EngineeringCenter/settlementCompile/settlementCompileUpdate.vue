<template>
  <div class="settlementCompileUpdate">

    <legend class="legendColumn">编制结算（单位：元）</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right">
      <div style="width:2px;height:100%;position:absolute;backgroundColor:rgb(220 220 220);margin-left:68%;"></div>
      <el-row min-height='80'>
        <el-col :span="8">
          <el-form-item prop="budgetMatrMeterBefore" label="表前材料费预算：" class="disable-item">
            <span>{{ form.budgetMatrMeterBefore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementMatrMeterBefore" label="表前材料费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.settlementMatrMeterBefore" @input="calcConstructionCost" type="number" ></el-input>
            <span v-else>{{ form.settlementMatrMeterBefore }}</span>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);margin-left:20px;"></div> -->
          <el-form-item prop="consultBillNo" label="工程编码：" class="disable-item">
            <span>{{ form.consultBillNo }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="8" style="margin-top:0px">
          <el-form-item prop="budgetLaborMeterBefore" label="表前人工费预算：" class="disable-item">
            <span>{{ form.budgetLaborMeterBefore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementLaborMeterBefore" label="表前人工费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.settlementLaborMeterBefore" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.settlementLaborMeterBefore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);margin-left:20px"></div> -->
          <el-form-item prop="consultName" label="工程名称：" class="disable-item">
            <span>{{ form.consultName }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="budgetMatrMeterAfter" label="表后材料费预算：" class="disable-item">
            <span>{{ form.budgetMatrMeterAfter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementMatrMeterAfter" label="表后材料费结算："  :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.settlementMatrMeterAfter" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.settlementMatrMeterAfter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="disposableChargeFlag" label="一次性收费：" class="disable-item">
        <!-- <el-select v-model="form.disposableChargeFlag" disabled>
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select> -->
        <span v-if="form.disposableChargeFlag==1">是</span>
        <span v-else>否</span>
      </el-form-item>
          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);margin-left:20px;z-index:0"></div> -->

        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="budgetLaborMeterAfter" label="表后人工费预算：" class="disable-item">
            <span>{{ form.budgetLaborMeterAfter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementLaborMeterAfter" label="表后人工费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.settlementLaborMeterAfter" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.settlementLaborMeterAfter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtResult" label="结算结果：">
            <el-select v-model="form.setmtResult" @blur="showResult" disabled>
              <el-option label="无" :value="0"></el-option>
              <el-option label="退款" :value="1"></el-option>
              <el-option label="补交" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);margin-left:20px"></div> -->

        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="budgetCost" label="预算费：" class="disable-item">
            <span>{{ form.budgetCost }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementCost" label="预算费结算：" :class="{'disable-item': disabled}">
            <!-- <div slot="label">
              <span style="color: red">*</span>预算费结算：
            </div> -->
            <el-input v-if="!disabled" v-model="form.settlementCost" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.settlementCost }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementAmount" label="退补金额：" class="disable-item">
            <span>{{ form.settlementAmount }}</span>
          </el-form-item>
          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);margin-left:20px"></div> -->

        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="designCost" label="设计费：" class="disable-item">
            <span>{{ form.designCost }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementDesignCost" label="设计费结算：" :class="{'disable-item': disabled}">
            <!-- <div slot="label">
              <span style="color: red">*</span>设计费结算：
            </div> -->
            <el-input v-if="!disabled" v-model="form.settlementDesignCost" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.settlementDesignCost }}</span> 
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="settlementDate" label="结算日期：" :class="{'disable-item': disabled}">
          <!-- <el-date-picker type="date" v-model="form.settlementDate" value-format="yyyy-MM-dd" disabled></el-date-picker> -->
            <el-date-picker v-if="!disabled" v-model="form.settlementDate" value-format="yyyy-MM-dd"></el-date-picker>
            <span v-else>{{form.settlementDate}}</span>
        </el-form-item>

          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);margin-left:20px"></div> -->

        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="budgetMoney" label="预算金额：" class="disable-item">
            <span>{{ form.budgetMoney }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="constructionCost" label="工程造价：" class="disable-item">
            <span>{{ form.constructionCost }}</span>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="refundType" label="余额退款方式：" v-if="form.setmtResult==1"  class="refundWay">
              <el-select v-model="form.refundType" :disabled="disabled">
                <el-option  v-for="item in dict.PBT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);margin-left:20px"></div> -->

        </el-col>
      </el-row>


      <el-row>
        <el-col :span="8">
          <el-form-item prop="depositMoney" label="押金：" class="disable-item">
            <span>{{ form.depositMoney }}</span>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item prop="costShare" label="总管分摊费用：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.costShare" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.costShare }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="refundBank" v-if="form.refundType==10" label="退款银行名称：">
            <el-input v-if="!disabled" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable type="text" size="main" v-model="form.refundBank"></el-input>
            <span v-else>{{ form.refundBank }}</span>
          </el-form-item>
          <!-- <div style="width:2px;height:80px;backgroundColor:rgb(220 220 220);margin-left:20px"></div> -->

        </el-col>
      </el-row>
      <el-row min-height='80'>
        <el-col :span="8">
          <el-form-item prop="redLineInMoney" label="红线内施工费用：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.redLineInMoney" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.redLineInMoney }}</span>
          </el-form-item>

        </el-col>
          <el-col :span="8">
            <el-form-item prop="redLineOutMoney" label="红线外施工费用：" :class="{'disable-item': disabled}">
              <el-input v-if="!disabled" v-model="form.redLineOutMoney" @input="calcConstructionCost" type="number"></el-input>
              <span v-else>{{ form.redLineOutMoney }}</span>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="refundAccount" v-if="form.refundType==10" label="退款银行账户：" :class="{'disable-item': disabled}">
              <el-input v-if="!disabled" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable type="text" size="main" v-model="form.refundAccount"></el-input>
              <span v-else>{{ form.refundAccount }}</span>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row min-height='80'>
        <el-col :span="8">
          <el-form-item prop="utensilMoney" label="计量器具：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.utensilMoney" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.utensilMoney }}</span>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item prop="accruedMoney" label="预缴金额：" class="disable-item">
            <span>{{ form.accruedMoney }}</span>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item prop="refundName" v-if="form.refundType==10" label="退款银行户名：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable type="text" size="main" v-model="form.refundName"></el-input>
            <span v-else>{{ form.refundName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row min-height='80'>
        
          <el-col :span="8">
            <el-form-item prop="setmtMoney" label="合计总额：" class="disable-item">
            <span>{{ form.setmtMoney }}</span>
          </el-form-item>
          </el-col>
      </el-row>

      <el-row>
        <el-col :span='8'></el-col>
        <el-col :span='8'></el-col>
        <el-col :span='8'>
          
        </el-col>

      </el-row>


    </el-form>
    <materialsBill ref="materialsBill" :editData="data" :disabled="disabled" ></materialsBill>
    <legend class="legendColumn">上传附件</legend>
    <uploadFile ref="uploadFiles" :receiptType="'pj_settlement'" :pdfList="pdfList" :editData="data" v-if="uploadFileShow" :disabledUpload="!!data.processState && data.processState !== ''&& data.processState !== 'register' && data.processState !== 'PROCESSING'"></uploadFile>
    <legend class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
    <!-- 工程收款 -->

  </div>
</template>

<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import materialsBill from '../engineerApproval/stepsForm/materialsBill.vue'
export default {
  props: ["id", "dict","data","disabled"],
  components: { 
    uploadFile,
    materialsBill
  },
  data () {
    const checkBudgetCost = (rule, value, callback) => {
      if (!value || value.length == 0) {
        return callback(new Error("预算费结算不能为空"));
      }
      return callback();
    };
    const checkDesignCost = (rule, value, callback) => {
      if (!value || value.length == 0) {
        return callback(new Error("设计费结算不能为空"));
      }
      return callback();
    };
    return {
      moneyFlag:1,
      uploadFileShow: true,
      form: {
        consultBillNo:'',
        budgetMatrMeterBefore: "", // 表前材料费预算
        settlementMatrMeterBefore: "", // 表前材料费结算
        budgetLaborMeterBefore: "", // 表前人工费预算
        settlementLaborMeterBefore: "", // 表前人工费结算
        budgetMatrMeterAfter: "", // 表后材料费预算
        settlementMatrMeterAfter: "", // 表后材料费结算
        budgetLaborMeterAfter: "", //表后人工费预算
        settlementLaborMeterAfter: "", // 表后人工费结算
        budgetCost: "", // 预算费
        settlementCost: "", // 预算费结算
        designCost: "", // 设计费
        settlementDesignCost: "", // 设计费结算
        constructionCost: "", // 工程造价
        depositMoney: "", // 押金
        costShare: "", // 总管分摊费用
        settlementDate: "", // 编制结算日期
        refundBank: "", // 银行名称
        refundName: "", // 银行户名（退款人姓名）
        refundAccount: "", // 银行账户
        consultId: "", // 工程报装id
        setmtResult: 0, // 结算结果 0：无；1：退款；2：补交 前端计算
        settlementAmount: 0, // 结算金额  前端计算
        setmtMoney: "", // 合计金额，前端计算
        type: "", // 退款方式
        accruedMoney: "", // 预缴金额 getAccruedMoney接口获取
        billNo: "", // 编号
        pjMeterMaterialList: [], // 材料清单的内容
      },
      openABankOptions: [],
      rules: {
        settlementMatrMeterBefore: [
          {
            required: true,
            message: "表前材料费结算不能为空",
            trigger: "blur",
          },
        ],
        settlementLaborMeterBefore: [
          {
            required: true,
            message: "表前人工费结算不能为空",
            trigger: "blur",
          },
        ],
        settlementMatrMeterAfter: [
          {
            required: true,
            message: "表后材料费结算不能为空",
            trigger: "blur",
          },
        ],
        settlementLaborMeterAfter: [
          {
            required: true,
            message: "表后人工费结算不能为空",
            trigger: "blur",
          },
        ],
        settlementCost: [
          {
            required: true,
            message: "预算费结算不能为空",
            trigger: ["blur",'change'],
          },
        ],
        settlementDesignCost: [
          {
            required: true,
            message: "设计费结算不能为空",
            trigger: ["blur",'change'],
          },
        ],
        settlementDate: [
          { required: true, message: "结算日期不能为空", trigger: "change" },
        ],
        costShare: [
          { required: true, message: "总管分摊费用不能为空", trigger: "blur" },
        ],
      },
      updateFlag: 0,//为0表示没有更新过内容
      pdfList:[],
      editData: {}
    };
  },
  created () {
    this.selectOABankOptions();
    this.getApprovalTableData();
    // this.getCollectionInfo();
    // this.selectOABankOptions();
  },
  mounted(){
    eventBus.$emit('receiptId', this.id);
    // console.log(JSON.stringify(this.form));
    this.form.settlementCost = this.data.budgetCost;
    eventBus.$on("BudgetMatrial", (BudgetMatrial) => {
      // 这里要回显材料清单中的表前材料费结算跟表后材料费结算
      this.form.settlementMatrMeterBefore = BudgetMatrial.budgetMatrialBefore;
      this.form.settlementMatrMeterAfter = BudgetMatrial.budgetMatrialAfter;
      this.calcConstructionCost(); // 要计算工程造价、退补金额的金额
    })
  },
  watch:{

  },
  methods: {
    submitForm() {
      // 编制结算提交按钮
      let _this = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.accruedMoney > this.form.setmtMoney) {
            // 结算结果为退款
            if (this.form.refundType == "") {
              this.$message({
                message: "请选择余额退款方式",
                type: "warning",
              });
              return;
            } else if (
              this.form.refundType == "10" &&
              (this.form.refundBank == "" ||
                this.form.refundName == "" ||
                this.form.refundAccount == "")
            ) {
              this.$message({
                message: "请完整填写退款银行信息",
                type: "warning",
              });
              return;
            }
            this.updateSave();
          }
          if (this.form.accruedMoney < this.form.setmtMoney) {
            // 补交
            // return (this.isPjCollectShow = true);
            // 改为走PjSettlemetInsert接口
            this.form.refundType = "";
            this.updateSave();
          }
          if (this.form.accruedMoney === this.form.setmtMoney) {
            // 无需退款或补交
            // 改为走PjSettlemetInsert接口
            this.form.refundType = "";
            this.updateSave();
            return;
          }
        }
      });
    },
    async updateSave(){
      let params = {
        busicode: "PjSettlemetUpdate",
        data: this.form,
      };
      // 提交前要进行校验
      let tempMessage =  this.$refs.materialsBill.validateMaterialsBill();
      if(tempMessage != ""){
        return this.$message({
          type: "error",
          message: tempMessage,
        });;
      }
      // 从子组件获得材料清单的信息
      let promisematerial = await this.$refs.materialsBill.saveMBill();
      if(promisematerial){
        this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: "保存成功",
          });
          this.$emit("success");
        });
      }
    },
    showResult(){
      this.$forceUpdate()
    },
    //报装权限获取
    getApprovalTableData(){
      var params = {
          busicode: "PjCheckTemplateStaffList",
          data: {
            checkStaff:this.$store.state.account
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.getCollectionInfo();
            if(res[0].moneyFlag!=undefined){
              this.moneyFlag=res[0].moneyFlag
              if(this.moneyFlag!=0){
                this.getCollectionInfo();
              }else{
                this.form.budgetMatrMeterBefore='***'
                this.form.settlementMatrMeterBefore='***'
                this.form.budgetLaborMeterBefore='***'
                this.form.settlementLaborMeterBefore='***'
                this.form.budgetMatrMeterAfter='***'
                this.form.settlementMatrMeterAfter='***'
                this.form.budgetLaborMeterAfter='***'
                this.form.settlementLaborMeterAfter='***'
                this.form.budgetCost='***'
                this.form.settlementCost='***'
                this.form.redLineInMoney='***'
                this.form.redLineOutMoney='***'
                this.form.utensilMoney='***'
                this.form.designCost='***'
                this.form.settlementDesignCost='***'
                this.form.constructionCost='***'
                this.form.depositMoney='***'
                this.form.settlementAmount='***'
                this.form.costShare='***'
                this.form.accruedMoney='***'
                this.form.setmtMoney='***'
              }
            }
          })
    },
    getCollectionInfo () {
      let params = {
        busicode: "PjSettlemetSingle",
        data: {
          id: this.id
        }
        //收款状态
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          // console.log(res)
          this.form = {...res};
          if(this.form.updateTime!==''){
            this.updateFlag = 1;
          }
          this.getHtmlData(res);
          this.getAccruedMoney();
          // this.calcConstructionCost()
          this.form.settlementDate=res.settlementDate
        });
    },
    async BeforeSubmit(){
      if (this.form.accruedMoney > this.form.setmtMoney) {
        // 结算结果为退款
        if (this.form.refundType == "") {
          return "请选择余额退款方式";
        } else if (
          this.form.refundType == "10" &&
          (this.form.refundBank == "" ||
            this.form.refundName == "" ||
            this.form.refundAccount == "")
        ) {
          return "请完整填写退款银行信息";
        }
      }
      if (this.form.accruedMoney < this.form.setmtMoney) {
        this.form.refundType = "";
      }
      if (this.form.accruedMoney === this.form.setmtMoney) {
        this.form.refundType = "";
      }
      // 提交前要进行校验
      let tempMessage =  this.$refs.materialsBill.validateMaterialsBill();
      if(tempMessage != ""){
        return this.$message({
          type: "error",
          message: tempMessage,
        });;
      }
      // 从子组件获得材料清单的信息
      let promisematerial = await this.$refs.materialsBill.saveMBill();
      if(promisematerial){
        var pass = false;
        let params = {
          busicode: "PjSettlemetUpdate",
          data: this.form,
        };
        await this.$api.fetch({
          params: params, //参数
        })
        .then((res) => {
          pass = true;
          this.$message({
            type: "success",
            message: "保存成功",
          });
          this.$emit("success");
        }).catch(err =>{
          return err.description;
        });
        if(pass){
          return null;
        }else{
          return '接口调用失败';
        }
      }
    },
    // 获取审批流前端代码
    getHtmlData (pcsData) {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "pj_settlement",
        "审批流配置:" + pcsData.processName + "(" + _this.id + ")",
        pcsData.id,
        pcsData.processInstanceId,
        "workflowDiv",
        _this,
        res => {
          if (
            window.location.href.indexOf("HallBusiness") > -1 ||
            window.location.href.indexOf("PendingTrial") > -1 ||
            window.location.href.indexOf("WaterSideIndex") > -1
          ) {
            // 流程中心模块触发
            this.$parent.$parent.closeDialog
              ? this.$parent.$parent.closeDialog()
              : this.$parent.closeDialog();
          } else {
            // 普通模块触发
            this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        1
      );
    },
    getFormbData () {
      return {};
    },
    calcConstructionCost () {
      // console.log('form', JSON.stringify(this.form))
      this.form.constructionCost =
        Number((Number(this.form.settlementMatrMeterBefore) +
        Number(this.form.settlementLaborMeterBefore) +
        Number(this.form.settlementMatrMeterAfter) +
        Number(this.form.settlementLaborMeterAfter) +
        Number(this.form.settlementCost) +
        Number(this.form.settlementDesignCost)).toFixed(2));
      // 结算合计金额 = (工程造价 + 总管分摊费用 + 红线内施工费用 + 红线外施工费用 + 计量器具) - 预缴金额
      this.form.setmtMoney = Number((Number(this.form.constructionCost) +
        Number(this.form.costShare) + 
        Number(this.form.redLineInMoney) +
        Number(this.form.redLineOutMoney) +
        Number(this.form.utensilMoney)).toFixed(2));
      // 计算结收方式
      if (this.form.setmtMoney > this.form.accruedMoney) {
        this.form.setmtResult = 2;
      } else if (this.form.setmtMoney < this.form.accruedMoney) {
        this.form.setmtResult = 1;
      } else {
        this.form.setmtResult = 0;
      }
      this.form.settlementAmount = Number(Number(this.form.setmtMoney) - Number(this.form.accruedMoney)).toFixed(2);
    },
    selectOABankOptions () {
      let _this = this;
      let params = {
        busicode: "BankTree",
        data: {
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          let data = _this.getArr(res);
          _this.openABankOptions = data.children;
        });
    },
    getArr (data) {
      function abc (arr) {
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
    getAccruedMoney () { // 获取预缴金额
      let params = {
        busicode: "PjCollectionCountMoney",
        data: {
          projectCode: this.form.consultBillNo
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          // console.log(res)
          setTimeout(()=>{

          },100)
          this.form.accruedMoney = res;
          //要回显到页面上
          if(this.updateFlag==0){//没有更新过才显示预算的值
            this.form.settlementMatrMeterBefore = this.form.budgetMatrMeterBefore;
            this.form.settlementLaborMeterBefore = this.form.budgetLaborMeterBefore;
            this.form.settlementMatrMeterAfter = this.form.budgetMatrMeterAfter;
            this.form.settlementLaborMeterAfter = this.form.budgetLaborMeterAfter;
            this.form.settlementCost = this.data.budgetCost;
            this.form.settlementDesignCost = this.data.designCost;
          }
          this.calcConstructionCost();
          this.showResult()
        });
    },
    handleCascaderChange () {

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
/deep/ .el-form-item{
  width:100%;
}
.settlementCompileUpdate {
  height: 92%;
  overflow: scroll;
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
}
</style>
