<template>
  <div class="engineeringSettlement">
    <legend class="legendColumn">编制结算（单位：元）</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right">
      <div style="width:2px;height:100%;position:absolute;margin-left:68%;"></div>
      <el-row min-height='80'>
        <el-col :span="8">
          <el-form-item prop="budgetMatrMeterBefore" label="表前材料费预算：" class="disable-item">
            <span>{{ form.budgetMatrMeterBefore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtMatrMeterBefore" label="表前材料费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.setmtMatrMeterBefore" @input="calcConstructionCost" type="number" ></el-input>
            <span v-else>{{ form.setmtMatrMeterBefore }}</span>
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
          <el-form-item prop="setmtLaborMeterBefore" label="表前人工费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.setmtLaborMeterBefore" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.setmtLaborMeterBefore }}</span>
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
          <el-form-item prop="setmtMatrMeterAfter" label="表后材料费结算："  :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.setmtMatrMeterAfter" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.setmtMatrMeterAfter }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="budgetLaborMeterAfter" label="表后人工费预算：" class="disable-item">
            <span>{{ form.budgetLaborMeterAfter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="setmtLaborMeterAfter" label="表后人工费结算：" :class="{'disable-item': disabled}">
            <el-input v-if="!disabled" v-model="form.setmtLaborMeterAfter" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.setmtLaborMeterAfter }}</span>
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
            <el-input v-if="!disabled" v-model="form.setmtBudgetCost" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.setmtBudgetCost }}</span>
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
            <el-input v-if="!disabled" v-model="form.setmtDesignCost" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.setmtDesignCost }}</span> 
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="budgetMoney" label="预算合计金额：" class="disable-item">
            <span>{{ form.budgetMoney }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="constructionCost" label="工程造价：" class="disable-item">
            <span>{{ form.constructionCost }}</span>
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
            <el-input v-if="!disabled" v-model="form.costShare" @input="calcConstructionCost" type="number"></el-input>
            <span v-else>{{ form.costShare }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="refundBank" v-if="form.refundType==10" label="退款银行名称：">
            <el-input v-if="!disabled" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable type="text" size="main" v-model="form.refundBank"></el-input>
            <span v-else>{{ form.refundBank }}</span>
          </el-form-item>
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
    </el-form>
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
      },
      rules: {
        setmtMatrMeterBefore: [
          { required: true, message: "表前材料费结算不能为空", trigger: ["change","blur"]},
        ],
        setmtLaborMeterBefore: [
          { required: true, message: "表前人工费结算不能为空", trigger: ["change","blur"]},
        ],
        setmtMatrMeterAfter: [
          { required: true, message: "表后材料费结算不能为空", trigger: ["change","blur"]},
        ],
        setmtLaborMeterAfter: [
          { required: true, message: "表后人工费结算不能为空", trigger: ["change","blur"]},
        ],
        setmtBudgetCost: [
          { required: true, message: "预算费结算不能为空", trigger: ["change","blur"]},
        ],
        setmtDesignCost: [
          { required: true, message: "设计费结算不能为空", trigger: ["change","blur"]},
        ],
        costShare: [
          { required: true, message: "总管分摊费用不能为空", trigger: ["change","blur"]},
        ],
      },
      updateFlag: 0,//为0表示没有更新过内容
    };
  },
  mounted(){
    if (this.editData) {
      //console.log("editData",this.editData);
      this.form = { ...this.editData.consult }
      // 如果有结算日期说明之前已经有提交过结算的相应金额，就需要回显之前填写的相应金额，要是之前没有提交过则回填预算金额到对应内容中
      if(this.form.setmtDate !== ''){
        this.updateFlag = 1;
      }
      this.getAccruedMoney();
      // console.log('form', this.form)
    }
    eventBus.$on("BudgetMatrial", (BudgetMatrial) => {
      // 这里要回显材料清单中的表前材料费结算跟表后材料费结算
      this.form.setmtMatrMeterBefore = BudgetMatrial.budgetMatrialBefore;
      this.form.setmtMatrMeterAfter = BudgetMatrial.budgetMatrialAfter;
      this.calcConstructionCost(); // 要计算工程造价、退补金额的金额
    })
  },
  watch:{

  },
  methods: {
    calcConstructionCost () {
      // 工程造价 = 表前材料费结算 + 表前人工费结算 + 表后材料费结算 + 表后人工费结算 + 预算费结算 + 设计费结算
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
      // 计算结收方式
      if (this.form.setmtMoney > this.form.accruedMoney) {
        this.form.setmtResult = 2;
      } else if (this.form.setmtMoney < this.form.accruedMoney) {
        this.form.setmtResult = 1;
      } else {
        this.form.setmtResult = 0;
      }
      this.form.settlementAmount = Number(this.form.setmtMoney) - Number(this.form.accruedMoney);
    },
    getAccruedMoney () { // 获取预缴金额
      let params = {
        busicode: "PjCollectionCountMoney",
        data: {
          projectCode: this.form.billNo
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.form.accruedMoney = res;
          //要回显到页面上
          if(this.updateFlag == 0){//没有更新过才显示预算的值
            this.$set(this.form, "setmtMatrMeterBefore",  Number(this.form.budgetMatrMeterBefore));
            this.$set(this.form, "setmtLaborMeterBefore",  Number(this.form.budgetLaborMeterBefore));
            this.$set(this.form, "setmtMatrMeterAfter",  Number(this.form.budgetMatrMeterAfter));
            this.$set(this.form, "setmtLaborMeterAfter",  Number(this.form.budgetLaborMeterAfter));
            this.$set(this.form, "setmtBudgetCost",  Number(this.form.budgetCost));
            this.$set(this.form, "setmtDesignCost",  Number(this.form.designCost));
          }
          this.calcConstructionCost();
        });
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
.engineeringSettlement {
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
