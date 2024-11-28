<template>
  <div class="settlementCompile">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="formBill-Three"
      :inline="true"
      size="mini"
      label-width="130px"
      label-position="right"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="budgetMatrMeterBefore"
            label="表前材料费预算："
            class="disable-item"
          >
            <span>{{ form.budgetMatrMeterBefore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtMatrMeterBefore" label="表前材料费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled"
              v-model="form.setmtMatrMeterBefore"
              @input="calcConstructionCost"
              type="number"
            ></el-input>
            <span v-else>{{form.setmtMatrMeterBefore}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width: 2px;height: 100px;backgroundColor: rgb(220 220 220);position: fixed;margin-left: 20px;"></div> -->
          <el-form-item prop="disposableChargeFlag" label="一次性收费：" class="disable-item">
        <span v-if="form.disposableChargeFlag==1">是</span>
        <span v-else>否</span>
      </el-form-item>
          
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="budgetLaborMeterBefore"
            label="表前人工费预算："
            class="disable-item"
          >
            <span>{{ form.budgetLaborMeterBefore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtLaborMeterBefore" label="表前人工费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled"
              v-model="form.setmtLaborMeterBefore"
              @input="calcConstructionCost"
              type="number"
            ></el-input>
            <span v-else>{{form.setmtLaborMeterBefore}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width: 2px;height: 100px;backgroundColor: rgb(220 220 220);position: fixed;margin-left: 20px;"></div> -->
          <el-form-item
            prop="setmtResult"
            label="结算结果："
            style="float: left"
          >
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
          <el-form-item
            prop="budgetMatrMeterAfter"
            label="表后材料费预算："
            class="disable-item"
          >
            <span>{{ form.budgetMatrMeterAfter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtMatrMeterAfter" label="表后材料费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled"
              v-model="form.setmtMatrMeterAfter"
              @input="calcConstructionCost"
              type="number"
            ></el-input>
            <span v-else>{{form.setmtMatrMeterAfter}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width: 2px;height: 100px;backgroundColor: rgb(220 220 220);position: fixed;margin-left: 20px;"></div> -->
          <el-form-item
            prop="settlementAmount"
            label="退补金额："
            class="disable-item"
          >
            <span>{{ form.settlementAmount }}</span>
          </el-form-item>
          
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="budgetLaborMeterAfter"
            label="表后人工费预算："
            class="disable-item"
          >
            <span>{{ form.budgetLaborMeterAfter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtLaborMeterAfter" label="表后人工费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled"
              v-model="form.setmtLaborMeterAfter"
              @input="calcConstructionCost"
              type="number"
            ></el-input>
            <span v-else>{{form.setmtLaborMeterAfter}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width: 2px;height: 100px;backgroundColor: rgb(220 220 220);position: fixed;margin-left: 20px;"></div> -->
          <el-form-item prop="setmtDate" label="结算日期：" :class="{'disable-item': disabled}">
            <el-date-picker v-if="!disabled"
              v-model="form.setmtDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span v-else>{{form.setmtDate}}</span>
          </el-form-item>
          
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="budgetCost" label="预算费：" class="disable-item">
            <span>{{ form.budgetCost }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtBudgetCost" label="预算费结算：" :class="{'disable-item': disabled}">
            <div slot="label">
              <span style="color: red">*</span>预算费结算：
            </div>
            <el-input v-if="!disabled"
              v-model="form.setmtBudgetCost"
              @input="calcConstructionCost"
              type="number"
            ></el-input>
            <span v-else>{{form.setmtBudgetCost}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width: 2px;height: 100px;backgroundColor: rgb(220 220 220);position: fixed;margin-left: 20px;"></div> -->
          <el-form-item
            prop="refundType"
            label="余额退款方式："
            v-if="form.setmtResult == 1"
            class="refundWay"
          >
            <el-select v-model="form.refundType" >
                <el-option  v-for="item in dict.PBT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="designCost" label="设计费：" class="disable-item">
            <span>{{ form.designCost }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtDesignCost" label="设计费结算：" :class="{'disable-item': disabled}">
            <div slot="label">
              <span style="color: red">*</span>设计费结算：
            </div>
            <el-input v-if="!disabled"
              v-model="form.setmtDesignCost"
              @input="calcConstructionCost"
              type="number"
            ></el-input>
            <span v-else>{{form.setmtDesignCost}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width: 2px;height: 100px;backgroundColor: rgb(220 220 220);position: fixed;margin-left: 20px;"></div> -->
          <el-form-item
            prop="refundBank"
            label="退款银行名称："
            v-if="form.setmtResult == 1 && form.refundType == '10'"
          >
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="text" size="main" v-model="form.refundBank"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="redLineInMoney"
            label="红线内施工费用："
            :class="{'disable-item': disabled}"
          >
            <el-input v-if="!disabled"
              v-model="form.redLineInMoney"
              type="number" @input="calcConstructionCost"
            ></el-input>
            <span v-else>{{form.redLineInMoney}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="redLineOutMoney"
            label="红线外施工费用："
            :class="{'disable-item': disabled}"
          >
            <el-input v-if="!disabled"
              v-model="form.redLineOutMoney"
              type="number" @input="calcConstructionCost"
            ></el-input>
            <span v-else>{{form.redLineOutMoney}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="utensilMoney"
            label="计量器具："
            :class="{'disable-item': disabled}"
          >
            <el-input v-if="!disabled"
              v-model="form.utensilMoney"
              type="number" @input="calcConstructionCost"
            ></el-input>
            <span v-else>{{form.utensilMoney}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="accruedMoney"
            label="预缴金额："
            class="disable-item"
          >
            <span>{{ accruedMoney }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="budgetMoney"
            label="预算金额："
            class="disable-item"
          >
            <span>{{ form.budgetMoney }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="constructionCost"
            label="工程造价："
            class="disable-item"
          >
            <span>{{ form.constructionCost }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item
            prop="refundAccount"
            label="退款银行账户："
            v-if="form.setmtResult == 1 && form.refundType == '10'"
          >
            <el-input
              @input="(e) => (input = inputMe(e))"
              v-model="form.refundAccount"
            ></el-input>
          </el-form-item>
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
            <el-input v-if="!disabled"
              v-model="form.costShare"
              @input="calcConstructionCost"
              type="number"
            ></el-input>
            <span v-else>{{form.costShare}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width: 2px;height: 100px;backgroundColor: rgb(220 220 220);position: fixed;margin-left: 20px;"></div> -->
          <el-form-item
            prop="refundName"
            label="退款银行户名："
            v-if="form.setmtResult == 1 && form.refundType == '10'"
          >
            <el-input
              v-model="form.refundName"
            ></el-input>
          </el-form-item>
        </el-col>     
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="setmtMoney"
            label="合计总额："
            class="disable-item"
          >
            <span>{{ form.setmtMoney }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);position:fixed;margin-left:30px"></div> -->
        </el-col>
        <el-col :span="8">
          <!-- <div style="width:2px;height:100px;backgroundColor:rgb(220 220 220);position:fixed;margin-left:30px"></div> -->
        </el-col>
      </el-row>
    </el-form>
    <!-- 编制结算-退款方式 -->
    <el-dialog
      title="编制结算"
      :visible.sync="pjst1Show"
      :close-on-click-modal="false"
      :modal="false"
      @close="pjst1Show = false"
    >
      <el-form
        ref="pjStForm1"
        :model="pjStForm1"
        :inline="true"
        size="mini"
        label-width="130px"
        label-position="right"
      >
        <el-form-item prop="refundType" label="余额退款方式：" class="col-2">
          <el-radio-group v-model="pjStForm1.refundType">
            <el-radio
              v-for="item in dict.PBT"
              :key="item.value"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <template v-if="pjStForm1.refundType == '10'">
          <el-form-item prop="openAccountBank" label="开户行：" class="col-2">
            <el-cascader
              ref="cascader"
              v-model="pjStForm1.openAccountBank"
              :options="openABankOptions"
              :show-all-levels="false"
              :props="props"
              @change="handleCascaderChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="bankAccount" class="bankAccount" label="账户号：">
            <el-input
              @input="(e) => (input = inputMe(e))"
              v-model="pjStForm1.bankAccount"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primery" size="mini" @click="pjStForm1Submit"
          >提 交</el-button
        >
        <el-button type="info" size="mini" plain @click="closePjStForm1"
          >关 闭</el-button
        >
      </div>
    </el-dialog>

    <!-- 工程收款 -->
    <el-dialog
      title="工程收款"
      :visible.sync="isPjCollectShow"
      :close-on-click-modal="false"
      :modal="false"
      width="600px"
      @close="closePjClDialog"
    >
      <projectPayment
        ref="projectPayment"
        :dict="dict"
        @success="closePjClDialog"
      ></projectPayment>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button
          type="primery"
          size="mini"
          @click="$refs.projectPayment.pjClSave(editData)"
          >保 存</el-button
        >
        <el-button type="info" size="mini" plain @click="closePjClDialog"
          >关 闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import projectPayment from "./projectPayment"; //欠费明细
export default {
  components: { projectPayment },
  props: ["editData", "dict","disabled"],
  data() {
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
      isPjCollectShow: false,
      pjst1Show: false,
      openABankOptions: [],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      pjStForm1: {
        refundType: "",
        bankAccount: "",
        openAccountBank: "",
      },
      accruedMoney: "",
      form: {
        setmtMatrMeterBefore: "",
        setmtLaborMeterBefore: "",
        setmtMatrMeterAfter: "",
        setmtLaborMeterAfter: "",
        setmtBudgetCost: "",
        setmtBudgetCostFlag: false,
        setmtDesignCost: "",
        setmtDesignCostFlag: false,
        constructionCost: "",
        setmtDate: "",
        costShare: "",
        setmtMoney: "",
        depositBackFlag: 0,
        depositMoney: "",
        accruedMoney: "",
        // 新增
        redLineInMoney:0,
        redLineOutMoney:0,
        utensilMoney:0,
        settlementAmount: 0, // 结算金额
        setmtResult: "", // 结算结果 0：无；1：退款；2：补交
        refundType: "", // 退款方式
        refundBank: "", // 银行名称
        refundName: "", // 银行户名（退款人姓名）
        refundAccount: "", // 银行账户
        consultId: "", // 工程报装id
        disposableChargeFlag: 0, // 是否一次性收费
      },
      collectForm: {},
      rules: {
        setmtMatrMeterBefore: [
          {
            required: true,
            message: "表前材料费结算不能为空",
            trigger: "blur",
          },
        ],
        setmtLaborMeterBefore: [
          {
            required: true,
            message: "表前人工费结算不能为空",
            trigger: "blur",
          },
        ],
        setmtMatrMeterAfter: [
          {
            required: true,
            message: "表后材料费结算不能为空",
            trigger: "blur",
          },
        ],
        setmtLaborMeterAfter: [
          {
            required: true,
            message: "表后人工费结算不能为空",
            trigger: "blur",
          },
        ],
        setmtBudgetCost: [
          {
            validator: checkBudgetCost,
            message: "预算费结算不能为空",
            trigger: "blur",
          },
        ],
        setmtDesignCost: [
          {
            validator: checkDesignCost,
            message: "设计费结算不能为空",
            trigger: "blur",
          },
        ],
        setmtDate: [
          { required: true, message: "结算日期不能为空", trigger: "change" },
        ],
        costShare: [
          { required: true, message: "总管分摊费用不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.selectOABankOptions();
    this.getAccruedMoney();
    if (this.editData) {
      console.log("editData", JSON.stringify(this.editData));
      this.form = { ...this.editData.consult };
      this.form.setmtMatrMeterBefore = this.form.budgetMatrMeterBefore;
      this.form.setmtLaborMeterBefore = this.form.budgetLaborMeterBefore;
      this.form.setmtMatrMeterAfter = this.form.budgetMatrMeterAfter;
      this.form.setmtLaborMeterAfter = this.form.budgetLaborMeterAfter;
      this.form.setmtBudgetCost = this.form.budgetCost;
      this.form.setmtDesignCost = this.form.designCost;
      this.form.setmtBudgetCostFlag = !!this.form.setmtBudgetCostFlag;
      this.form.setmtDesignCostFlag = !!this.form.setmtDesignCostFlag;
      // this.form['redLineInMoney']=0.0
      // this.form['redLineOutMoney']=0.0
      // this.form['utensilMoney']=0.0
      // 初始化结算金额、结算结果、退款方式
      this.form.consultId = this.form.id;
      this.collectForm.ctmNo = this.editData.ctmInfo.ctmName;
      this.$set(this.form, "settlementAmount", 0);
      this.$set(this.form, "setmtResult", 0);
      this.$set(this.form, "refundType", "0");
      this.$set(this.form, "refundBank", "");
      this.$set(this.form, "refundName", "");
      this.$set(this.form, "refundAccount", "");
      this.$set(this.form, "redLineInMoney", 0);
      this.$set(this.form, "redLineOutMoney", 0);
      this.$set(this.form, "utensilMoney", 0);
      //   this.calcConstructionCost();
    }
    // console.log("form", this.form);
    // console.log("dict", this.dict);
  },
  mounted() {
    // console.log("mounted");
    // console.log(JSON.stringify(this.editData));
    // this.form.redLineInMoney=0.0
    // this.form.redLineOutMoney=0.0
    // this.form.utensilMoney=0.0
  },
  methods: {
    inputMe(e) {
      let str = e.replace(/\ +/g, "");
      str = str.replace(/[\r\n]/g, "");
      //console.log(str);
      return str;
    },
    submit() {
      // 编制结算提交按钮
      let _this = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.accruedMoney > this.form.setmtMoney) {
            // 结算结果为退款
            if (this.form.refundType == "") {
              this.$message({
                message: "请余额选择退款方式",
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
            this.refundOperate();
          }
          if (this.accruedMoney < this.form.setmtMoney) {
            // 补交
            // return (this.isPjCollectShow = true);
            // 改为走PjSettlemetInsert接口
            this.form.refundType = "";
            this.refundOperate();
          }
          if (this.accruedMoney === this.form.setmtMoney) {
            // 无需退款或补交
            // 改为走PjSettlemetInsert接口
            this.form.refundType = "";
            this.refundOperate();
            return;
          }
        }
      });
    },
    getAccruedMoney() {
      let params = {
        busicode: "PjCollectionCountMoney",
        data: {
          projectCode: this.editData.consult.billNo,
        },
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.accruedMoney = res;
          this.calcConstructionCost();
        });
    },
    closePjStForm1() {
      this.$refs.pjStForm1.resetFields();
      this.pjst1Show = false;
    },
    handleCascaderChange() {
      this.$refs.cascader
        ? (this.$refs.cascader.dropDownVisible = false)
        : null;
      if (this.form.openAccountBank instanceof Array) {
        // 开户银行 只需要传最后一个值过去
        this.form.openAccountBank = this.common.handleTreeData(
          this.form.openAccountBank
        );
      }
    },
    closePjClDialog() {
      this.$refs.projectPayment.resetField();
      this.isPjCollectShow = false;
    },
    PjSettlementInsert(data){
      const params={
                        "busicode": "PjProcessCommit",
                        "data":{
                            "billId":data,
                            "formVariables":{},
                            "operation":32,
                            "receiptType":"pj_settlement",
                            "title":"审批流配置:报装(编制结算)"
                        },

                        token: sessionStorage.getItem('token'),
                    }
                    this.$api.fetch({
                        params: params,//参数
                    }).then(act=>{
                      // this.$parent.init()
                    })
    },
    pjStForm1Submit() {
      this.pjStForm1.projectCode = this.editData.consult.billNo;
      this.pjStForm1.projectName = this.editData.consult.pjName;
      this.pjStForm1.projectDate = this.editData.consult.createTime;
      this.pjStForm1.projectAddress = this.editData.consult.installAddr;
      this.pjStForm1.clientName = this.editData.consult.ctmName;
      let params = {
        busicode: "PjCollectionInsert",
        data: { ...this.pjStForm1 },
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(() => {
          //新增后调用processCommit
          //调用
          this.$message({
            type: "success",
            message: "保存成功",
          });
          this.pjst1Show = false;
          this.$refs.pjStForm1.resetFields();
        });
    },
    // 开户银行
    selectOABankOptions() {
      let _this = this;
      let params = {
        busicode: "BankTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          let data = _this.getArr(res);
          // console.log(JSON.stringify(res));
          _this.openABankOptions = data.children;
        });
    },
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

    calcConstructionCost() {
      this.form.constructionCost =
        Number((Number(this.form.setmtMatrMeterBefore) +
        Number(this.form.setmtLaborMeterBefore) +
        Number(this.form.setmtMatrMeterAfter) +
        Number(this.form.setmtLaborMeterAfter) +
        Number(this.form.setmtBudgetCost) +
        Number(this.form.setmtDesignCost)).toFixed(2));
      // 结算合计金额 = (工程造价 + 总管分摊费用 + 红线内施工费用 + 红线外施工费用 + 计量器具) - 预缴金额
      this.form.setmtMoney = Number((Number(this.form.constructionCost) +
        Number(this.form.costShare) + 
        Number(this.form.redLineInMoney) +
        Number(this.form.redLineOutMoney) +
        Number(this.form.utensilMoney)).toFixed(2));
      // 计算结算方式，结算金额。当在预算编制节点设置一次性收费为是时，结算方式始终为无，结算金额为0
      if (this.form.disposableChargeFlag === 0) {
        if (this.form.setmtMoney > this.accruedMoney) {
          this.form.setmtResult = 2;
        } else if (this.form.setmtMoney < this.accruedMoney) {
          this.form.setmtResult = 1;
        } else {
          this.form.setmtResult = 0;
        }
      } else {
        this.form.setmtResult = 0;
      }
      this.form.settlementAmount =
        this.form.disposableChargeFlag === 1
          ? 0
          : Number(this.form.setmtMoney) - Number(this.accruedMoney);
    },
    refundOperate() {
      //
      let params = {
        busicode: "PjSettlemetInsert",
        data: {
          budgetLaborMeterBefore: this.form.budgetLaborMeterBefore,
          budgetLaborMeterAfter: this.form.budgetLaborMeterAfter,
          budgetMatrMeterBefore: this.form.budgetMatrMeterBefore,
          budgetMatrMeterAfter: this.form.budgetMatrMeterAfter,
          settlementLaborMeterBefore: this.form.setmtLaborMeterBefore,
          settlementLaborMeterAfter: this.form.setmtLaborMeterAfter,
          settlementMatrMeterBefore: this.form.setmtMatrMeterBefore,
          settlementMatrMeterAfter: this.form.setmtMatrMeterAfter,
          budgetCost: this.form.budgetCost,
          settlementCost: this.form.setmtBudgetCost,
          designCost: this.form.designCost,
          settlementDesignCost: this.form.setmtDesignCost,
          constructionCost: this.form.constructionCost,
          costShare: this.form.costShare,
          depositMoney: this.form.depositMoney,
          settlementDate: this.form.setmtDate,
          redLineInMoney:this.form.redLineInMoney,
          redLineOutMoney:this.form.redLineOutMoney,
          utensilMoney:this.form.utensilMoney,
          refundBank: this.form.refundBank,
          refundAccount: this.form.refundAccount,
          refundName: this.form.refundName,
          consultId: this.form.consultId,
          type: this.form.refundType,
        },
      };
      // console.log("新接口：", params);
      //   return;
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: "提交成功",
          });
          // console.log(res);
          this.PjSettlementInsert(res)
           var params = {
            busicode: "PjInfoUpdate",
            data: {
              id: this.editData.consult.id,
              settlementFlag: 1,
            },
          };
          this.$api
            .fetch({
              params: params, //参数
            })
            .then((res) => {
              // console.log(res);
            });
          this.pjst1Show = false;
          this.$emit("success");
          this.$emit('settlementFlag',1)
        });
    },
    autoProjectPay() {
      this.collectForm.projectCode = this.form.billNo;
      this.collectForm.projectName = this.form.pjName;
      this.collectForm.projectDate = this.form.createTime;
      this.collectForm.projectAddress = this.form.installAddr;
      this.collectForm.money = this.form.settlementAmount;
      this.collectForm.type = "3"; // 结算款
      this.collectForm.notes = "";
      let params = {
        busicode: "PjCollectionInsert",
        data: { ...this.collectForm },
      };
      // console.log(params);
      //   return
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: "工程收款新增成功",
          });
          this.$emit("success");
        });
    },
  },
  watch: {
    editData(val) {
      if (val) {
        this.form = { ...val };
        this.form.setmtMatrMeterBefore = this.form.budgetMatrMeterBefore;
        this.form.setmtLaborMeterBefore = this.form.budgetLaborMeterBefore;
        this.form.setmtMatrMeterAfter = this.form.budgetMatrMeterAfter;
        this.form.setmtLaborMeterAfter = this.form.budgetLaborMeterAfter;
        this.form.setmtBudgetCost = this.form.budgetCost;
        this.form.setmtDesignCost = this.form.designCost;
        this.form.setmtBudgetCostFlag = !!this.form.setmtBudgetCostFlag;
        this.form.setmtDesignCostFlag = !!this.form.setmtDesignCostFlag;
        this.calcConstructionCost();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.settlementCompile {
  .col-2 {
    width: calc(46% + 10px);
  }
  .bankAccount >>> .el-input__inner {
    padding-right: 0px !important;
    width: 100%;
    font-size: 14px;
  }
  .refundWay {
    width: 100%;
  }
}
.el-form-item {
  width: 100%;
}
</style>
