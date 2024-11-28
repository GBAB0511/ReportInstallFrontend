<template>
  <div class="BreakSetEdit">
    <div class="backForm">


      <el-form :inline="true" size="mini" ref="BreakSetEditForm" :rules="rules" :model="ruleForm"  label-width="150px">
              
        <el-form-item label="违约金名称："  prop="strategyName">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.strategyName" maxlength="50" clearable></el-input>
        </el-form-item>
        
        <el-form-item class="company" label="计算方式：">
          <el-form-item>
            <el-radio :label="1" v-model="ruleForm.calculateWay" @change="changeCalWay">从下个月</el-radio>
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="breakPrice1" :disabled="ruleForm.calculateWay=='2'||ruleForm.calculateWay=='3'" 
              maxlength="3" clearable 
              onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
              onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
              ></el-input>
              <span style=" font-size: 12px;color: #606266;">号开始计算违约金</span>
            </el-form-item>
            <el-form-item>
            <el-radio :label="2" v-model="ruleForm.calculateWay" @change="changeCalWay">开账</el-radio>
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="breakPrice2"  :disabled="ruleForm.calculateWay=='1'||ruleForm.calculateWay=='3'" 
                maxlength="3" clearable
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                ></el-input>
                <span style=" font-size: 12px;color: #606266;">日后开始计算违约金</span>
            </el-form-item>
            <el-form-item>
            <el-radio :label="3" v-model="ruleForm.calculateWay" @change="changeCalWay">开账</el-radio>
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="breakPrice3"  :disabled="ruleForm.calculateWay=='1'||ruleForm.calculateWay=='2'"
                maxlength="3" clearable
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
                <span style=" font-size: 12px;color: #606266;">月后的</span>

                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="breakPrice4"  :disabled="ruleForm.calculateWay=='1'||ruleForm.calculateWay=='2'"
                maxlength="3" clearable
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
                <span style=" font-size: 12px;color: #606266;">号开始计算违约金</span>
            </el-form-item>
          
            <el-form-item>
                <el-checkbox v-model="ruleForm.vacationFlag">假期除外</el-checkbox>
            </el-form-item>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="最低计算金额：" prop="minCalculateMoney">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" :precision="ruleForm.decimalPlacse"  v-model="ruleForm.minCalculateMoney" maxlength="10" clearable></el-input>
            </el-form-item>

            <el-form-item label="最低违约金额：" prop="minPenaltyMoney">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" :precision="ruleForm.decimalPlacse"  v-model="ruleForm.minPenaltyMoney" maxlength="10" clearable></el-input>
            </el-form-item>
            <el-row>
              <el-form-item label="收取比例：" prop="dailyScaling">
              <el-col :span="14">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" :precision="ruleForm.decimalPlacse"  v-model="ruleForm.dailyScaling" maxlength="7" clearable></el-input>
              </el-col>
              <el-col :span="10">
                <el-select v-model="ruleForm.chargeWay" clearable placeholder="请选择">
                  <el-option label="按天" :value="0"></el-option>
                  <el-option label="按月(30天)" :value="1"></el-option>
                </el-select>
              </el-col>
              </el-form-item>
            </el-row>
          
          </el-col>
          <el-col  :span="10">
            <el-form-item label="保留小数位数："  prop="decimalPlacse">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="ruleForm.decimalPlacse" maxlength="6" onkeyup="value=(value.replace(/\D/g,'')==''?'':parseInt(value))"></el-input>
            </el-form-item>

            <el-form-item label="最高违约金额："  prop="maxPenaltyMoney">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" :precision="ruleForm.decimalPlacse"  v-model="ruleForm.maxPenaltyMoney" maxlength="10" clearable></el-input>
            </el-form-item>
            <el-form-item label="最高收取比例："  prop="maxScaling">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" :precision="ruleForm.decimalPlacse"  v-model="ruleForm.maxScaling" maxlength="7" clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <!-- <el-form-item label="是否计算余额：">
          <el-select v-model="ruleForm.calculateBalance" placeholder="请选择是否计算余额">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item> -->
                
        <el-form-item label="状态：" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="ruleForm.comments" show-word-limit maxlength="150" clearable
                    placeholder="请输入备注"
                    type="textarea">
          </el-input>
        </el-form-item>
            
      </el-form>
    </div>

  </div>
</template>
<script>
export default {
  name: "BreakSetEdit",
  props:[
    "formType"
  ],
  data() {
    return {
      ruleForm: {
        penaltyId:"",
        strategyName: "",//违约金名称
        minCalculateMoney: "",//最低计算金额
        decimalPlacse: "",//保留小数位数
        minPenaltyMoney: "",//最低违约金额
        maxPenaltyMoney: "",//最高违约金额
        dailyScaling:"",//收取比例
        maxScaling: "",//最高收取比例
        calculateBalance: "",//是否计算余额
        calculateWay: "1",//计算方式
        calculateValue:"",
        calculateValue2:"",//几号
        vacationFlag: "",//假期除外
        comments: "",//备注
        status: "",//状态
        chargeWay:"0",
      },
      formData:{
        penaltyId:"",
        strategyName: "",
        minCalculateMoney: "",
        decimalPlacse: "",
        minPenaltyMoney: "",
        maxPenaltyMoney: "",
        dailyScaling:"",
        maxScaling: "",
        calculateBalance: "",
        calculateWay: "1",
        calculateValue:"",
        calculateValue2:"",
        vacationFlag: "",
        comments: "",
        status: "",
        chargeWay:"0",
      },
      breakPrice1:"",
      breakPrice2:"",
      breakPrice3:"",
      breakPrice4:"",
      rules: {
        strategyName: [
          { required: true, message: '请输入违约金名称', trigger: 'blur' }
        ],
        minCalculateMoney: [
          { required: true, message: '请输入最低计算金额', trigger: 'blur' }
        ],
        minPenaltyMoney: [
          { required: true, message: '请输入最低违约金额', trigger: 'change' }
        ],
        dailyScaling: [
          { required: true, message: '请输入收取比例', trigger: 'blur' }
        ],
        decimalPlacse: [
          { required: true, message: '请输入保留小数位数', trigger: 'blur' }
        ],
        maxPenaltyMoney: [
          { required: true, message: '请输入最高违约金额', trigger: 'blur' }
        ],
        maxScaling: [
          { required: true, message: '请输入最高收取比例', trigger: 'blur' }
        ],
        calculateBalance: [
          { required: true, message: '请选择是否计算余额', trigger: 'change' }
        ],
        status: [
            { required: true, message: '请选择状态', trigger: 'blur' }
        ],
      },
    }
  },
  mounted(){
    if(this.formType==="PenaltyStrategyAdd"){
      this.editData({
          penaltyId: "",
          strategyName: "",
          minCalculateMoney: "",
          decimalPlacse: "",
          minPenaltyMoney: "",
          maxPenaltyMoney: "",
          dailyScaling: "",
          maxScaling: "",
          calculateBalance: "",
          calculateWay: 1,
          calculateValue: "",
          calculateValue2:"",
          vacationFlag: "",
          comments: "",
          status: "",
          chargeWay: 0,
      })
    }
  },
  methods: {
    //保存按钮
    resetForm() {
      this.$refs.BreakSetEditForm.resetFields();
    },
    submitForm(formName,type) {
      let _this = this;
      let params = {};
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 计算方式的数据处理
          this.handleData();
            if(type === 'PenaltyStrategyAdd'){
              
              params = {
                "busicode": "PenaltyStrategyAdd",
                "data": this.ruleForm
            }
            }else{
              this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
              params = {
                "busicode": "PenaltyStrategyUpdate",
                "data": this.ruleForm
              };
            }
            if(_this.ruleForm.maxPenaltyMoney<_this.ruleForm.minPenaltyMoney){
              _this.$message({
                showClose:true,
                message:'最高违约金不能小于最低违约金',
                type:'warning',
              });
              return;
            }

            this.$api.fetch({
              params: params,//参数
            }).then(res => {
              _this.$message({
                showClose:true,
                message:'保存成功',
                type:'success',
              });
              _this.$parent.init();
              _this.$parent.closeDialog();   
            })
            
        } else {
          return false;
        }
      });
    },
    handleData(){
      if(this.ruleForm.calculateWay=='1'){
        this.ruleForm.calculateValue = this.breakPrice1;
      }else if(this.ruleForm.calculateWay=='2'){
        this.ruleForm.calculateValue = this.breakPrice2;
      }else{
        this.ruleForm.calculateValue = this.breakPrice3;
        this.ruleForm.calculateValue2 = this.breakPrice4;
      }
      this.ruleForm.vacationFlag = Number(this.ruleForm.vacationFlag);
    },
    handleClose() {
      this.handleData();
      this.common.chargeObjectEqual(this,this.ruleForm,'get','BreakSetEdit',this.$parent.closeDialog);
    },
    editData(val){
      
      this.ruleForm = val;
      this.breakPrice1 = '';
      this.breakPrice2 = '';
      this.breakPrice3 = '';
      this.breakPrice4 = '';
      if(this.ruleForm.calculateWay=='1'){
        this.breakPrice1 = this.ruleForm.calculateValue;
      }else if(this.ruleForm.calculateWay=='2'){
        this.breakPrice2 = this.ruleForm.calculateValue;
      }else{
        this.breakPrice3 = this.ruleForm.calculateValue;
        this.breakPrice4 = this.ruleForm.calculateValue2;
      }
    },
    changeCalWay(val){
      if(val=='1'){
        this.breakPrice2 = "";
        this.breakPrice3 = "";
        this.breakPrice4 = "";
      }else if(val=='2'){
        this.breakPrice1 = "";
        this.breakPrice3 = "";
        this.breakPrice4 = "";
      }else if(val=='3'){
        this.breakPrice1 = "";
        this.breakPrice2 = "";
      }
    }
  },
}
</script>
<style lang="scss">
.BreakSetEdit {
  height: 100%;
  width: 60%;
  margin: 10px auto;
  .backForm{
      margin: 0px;
      width: 100%;
      .el-form-item{
          width:100%;
          margin-top:6px;
          .el-form-item__content{
              width: calc(100% - 150px);
                .el-select {
                  width: initial;
                }
          }
      }
      .el-input--mini /deep/ .el-input__inner,.el-select,.el-date-editor{
              width: 100%;
      }
  }

  .company{
    margin-bottom: 0px !important;
    .el-form-item{
      width: 100% !important;
      .el-form-item__content{
            width: 100% !important;
            font-size: 12px;
            .el-radio{
                  margin-right: 10px;
              .el-radio__label{
                font-size: 12px;
              }
            }
              .el-input{
                width: 23% !important;

              }
      }
    }
  }
      
}
</style>

