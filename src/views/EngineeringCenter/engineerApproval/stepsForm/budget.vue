<template>
  <div class="budget">
    <legend class="legendColumn">预算编制（单位：元）</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="budgetMatrMeterBefore" label="表前材料费预算：" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" oninput ="value=value.replace(/[^0-9.]/g,'')" ref="budgetMatrMeterBefore" v-model="form.budgetMatrMeterBefore" @input="handleInput" @focus="handleFocus('budgetMatrMeterBefore')"></el-input>
        <span v-else>{{form.budgetMatrMeterBefore}}</span>
      </el-form-item>
      <el-form-item prop="budgetLaborMeterBefore" label="表前人工费预算：" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" oninput ="value=value.replace(/[^0-9.]/g,'')" ref="budgetLaborMeterBefore" v-model="form.budgetLaborMeterBefore" @input="handleInput" @focus="handleFocus('budgetLaborMeterBefore')"></el-input>
        <span v-else>{{form.budgetLaborMeterBefore}}</span>
      </el-form-item>
      <el-form-item prop="budgetMatrMeterAfter" label="表后材料费预算：" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" oninput ="value=value.replace(/[^0-9.]/g,'')" ref="budgetMatrMeterAfter" v-model="form.budgetMatrMeterAfter" @input="handleInput" @focus="handleFocus('budgetMatrMeterAfter')"></el-input>
        <span v-else>{{form.budgetMatrMeterAfter}}</span>
      </el-form-item>
      <el-form-item prop="budgetLaborMeterAfter" label="表后人工费预算：" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" oninput ="value=value.replace(/[^0-9.]/g,'')" ref="budgetLaborMeterAfter" v-model="form.budgetLaborMeterAfter" @input="handleInput" @focus="handleFocus('budgetLaborMeterAfter')"></el-input>
        <span v-else>{{form.budgetLaborMeterAfter}}</span>
      </el-form-item>
      <el-form-item prop="budgetCost" label="预算费：" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" oninput ="value=value.replace(/[^0-9.]/g,'')" ref="budgetCost" v-model="form.budgetCost" @input="handleInput" @focus="handleFocus('budgetCost')"></el-input>
        <span v-else>{{form.budgetCost}}</span>
      </el-form-item>
      <el-form-item prop="designCost" label="设计费：" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" oninput ="value=value.replace(/[^0-9.]/g,'')" ref="designCost" v-model="form.designCost" @input="handleInput" @focus="handleFocus('designCost')"></el-input>
        <span v-else>{{form.designCost}}</span>
      </el-form-item>
      <el-form-item prop="budgetMoney" label="预算金额：" class="disable-item">
        <span>{{form.budgetMoney}}</span>
      </el-form-item>
      <el-form-item prop="depositMoney" label="预收款：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/[^0-9.]/g,'')"  v-if="!disabled" ref="depositMoney" v-model="form.depositMoney" @focus="handleFocus('depositMoney')"></el-input>
        <span v-else>{{form.depositMoney}}</span>
      </el-form-item>
      <el-form-item prop="disposableChargeFlag" label="是否一次性收费：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.disposableChargeFlag">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
        <span v-else>{{form.disposableChargeFlag == 1 ? '是' : '否'}}</span>
      </el-form-item>
      
      <!-- <el-form-item prop="prepayType" label="结算方式：" class="col-2" :class="{'disable-item': disabled}">
        <el-radio-group v-if="!disabled" v-model="form.prepayType">
          <el-radio v-for="item in dict.PCW" :key="item.value" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
        <span v-else>{{form.prepayTypeName}}</span>
      </el-form-item> -->
      <el-form-item prop="constructionUnit" label="收款主体：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-if="!disabled" v-model="form.constructionUnit" :disabled=true></el-input>
        <span v-else>{{form.constructionUnit}}</span>
      </el-form-item>
      <el-form-item prop="budgetNo" label="预算编号：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-if="!disabled" v-model="form.budgetNo"></el-input>
        <span v-else>{{form.budgetNo}}</span>
      </el-form-item>
      <el-form-item prop="budgetPerson" label="预算人：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-if="!disabled" v-model="form.budgetPerson"></el-input>
        <span v-else>{{form.budgetPerson}}</span>
      </el-form-item>
      <el-form-item prop="budgetComments" label="预算意见：" class="col-2" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" type="textarea" v-model="form.budgetComments"></el-input>
        <span v-else>{{form.budgetComments}}</span>
      </el-form-item>
      <br>
      <span class="mark">备注：预算金额 = 表前材料费预算 + 表前人工费预算 + 表后材料费预算 + 表后人工费预算 + 预算费 + 设计费</span>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['dict', 'editData', 'disabled','currentStep'],
  data () {
    return {
      moneyFlag:1,
      form: {
        budgetLaborMeterBefore: '',
        budgetLaborMeterAfter: '',
        budgetMatrMeterBefore: '',
        budgetMatrMeterAfter: '',
        budgetCost: '',
        designCost: '',
        depositMoney: '',
        budgetMoney: '',
        prepayType: '',
        projectCharge: '',
        budgetComments: '',
        disposableChargeFlag: '', // 是否一次性收费
        constructionUnit: "",
        budgetPerson: "",
        budgetNo: "",
      },
      rules: {
        budgetMatrMeterBefore: [{ required: true, message: ' ', trigger: 'blur' }],
        budgetLaborMeterBefore: [{ required: true, message: ' ', trigger: 'blur' }],
        budgetMatrMeterAfter: [{ required: true, message: ' ', trigger: 'blur' }],
        budgetLaborMeterAfter: [{ required: true, message: ' ', trigger: 'blur' }],
        budgetCost: [{ required: true, message: ' ', trigger: 'blur' }],
        designCost: [{ required: true, message: ' ', trigger: 'blur' }],
        budgetMoney: [{ required: true, message: ' ', trigger: 'blur' }],
        prepayType: [{ required: true, message: '结算方式不能为空', trigger: 'change' }],
        // constructionUnit: [{ required: true, message: '收款主体不能为空', trigger: 'change' }],
        disposableChargeFlag: [{ required: true, message: '请选择是否一次性收费', trigger: 'change' }],
        budgetPerson: [{ required: true, message: '预算人不能为空', trigger: 'blur' }],
      },
      payeeData: []
    }
  },
  created () {
    this.getProjectPayee()
    console.log('editData', this.editData)
    if (this.editData) {
      //console.log("editData",this.editData);
      this.form = { ...this.editData }
      console.log('form', this.form)
      this.form.disposableChargeFlag = this.form.disposableChargeFlag == undefined ? 0 : this.form.disposableChargeFlag
      this.form.budgetMoney = this.form.budgetMoney == "" ? '0.0' : this.form.budgetMoney;
      this.form.budgetPerson = this.form.budgetPerson ? this.form.budgetPerson : sessionStorage.getItem("userName");
    }
    if(this.currentStep>5){
      //调用接口，查询用户是否可以查看金额
       this.getApprovalTableData()
    }
  },
  mounted(){
    // console.log(this.$store.state.account);
    // console.log(this.$store.state.userName);
    eventBus.$on("BudgetMatrial", (BudgetMatrial) => {
      // 这里要回显材料清单中的表前材料费预算跟表后材料费预算
      this.form.budgetMatrMeterBefore = BudgetMatrial.budgetMatrialBefore;
      this.form.budgetMatrMeterAfter = BudgetMatrial.budgetMatrialAfter;
      this.handleInput(); // 要计算预算金额、预收款的金额
    })
  },
  methods: {
    validate () {
      if(this.form.budgetMatrMeterBefore===''){
        return '表前材料费预算不能为空'
      }
      if(this.form.budgetLaborMeterBefore===''){
        return '表前人工费预算不能为空'
      }
      if(this.form.budgetMatrMeterAfter===''){
        return '表后材料费预算不能为空'
      }
      if(this.form.budgetLaborMeterAfter===''){
        return '表后人工费预算不能为空'
      }
      if(this.form.budgetCost===''){
        return '预算费不能为空'
      }
      if(this.form.designCost===''){
        return '设计费不能为空'
      }
      if(this.form.disposableChargeFlag===''){
        return '是否一次性收费未选'
      }
      return true
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
            if(res[0].moneyFlag!=undefined){
              this.moneyFlag=res[0].moneyFlag
            }
          })
    },
    // 获取工程收款主体
    getProjectPayee () {
      var _this = this
      var params = {
        "busicode": "ProjectPayeeList",
        "data": {
          page: 1,
          pageCount: 1000,
          status:1
        }
        //结算方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.payeeData = res.list
      })
    },
    handleInput () {
      this.form.budgetMoney = Number(this.form.budgetMatrMeterBefore) + Number(this.form.budgetLaborMeterBefore) + Number(this.form.budgetMatrMeterAfter) + Number(this.form.budgetLaborMeterAfter) + Number(this.form.budgetCost) + Number(this.form.designCost)
      this.form.budgetMoney = Number(this.form.budgetMoney === 0 ? this.form.budgetMoney.toFixed(1) : this.form.budgetMoney).toFixed(2)
      this.form.depositMoney =Number(this.form.budgetMoney).toFixed(2);
    },
    handleFocus (name) {
      this.$refs[name].select()
    },
    autoCollection () {
      if (Number(this.form.depositMoney) === 0) return;
      let info = this.$parent.$parent.$parent.detailInfo
      let params = {
        busicode: "PjCollectionInsert",
        data: {
          clientName: info.ctmInfo.ctmName,
          money: this.form.depositMoney,
          notes: "",
          projectAddress: info.consult.installAddr,
          projectCode: info.consult.billNo,
          projectDate: info.consult.createTime,
          projectName: info.consult.pjName,
          constructionUnit:info.consult.constructionUnit,
          type: "1" // 押金
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then((res) => {
          //   this.$message({
          //     type: "success",
          //     message: '工程收款新增成功'
          //   });
          //   this.$emit('success');
        });
    },
    // 允许查看金额为否，字段打星显示

  },
  watch: {
    editData (val) {
      if (val) {
        this.form = { ...val }
      }
    },
    moneyFlag(){
      if(this.moneyFlag==0&&this.currentStep>5){
        //修改金额显示为***

        this.form.budgetMatrMeterBefore='***'
        this.form.budgetLaborMeterBefore='***'
        this.form.budgetMatrMeterAfter='***'
        this.form.budgetLaborMeterAfter='***'
        this.form.budgetCost='***'
        this.form.designCost='***'
        this.form.depositMoney='***'
        this.form.budgetMoney='***'

      }
    }
  }
}
</script>

<style lang="scss" scoped>
.budget {
  .col-2 {
    width: calc(94% + 10px);
  }
  .mark {
    margin-left: 20px;
    margin-bottom: 10px;
    display: inline-block;
  }
}
</style>
