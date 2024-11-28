<template>
  <div class="accountInfo">
    <legend class="legendColumn">
      账户信息
      <i class="fontRight" :class="showIcon" @click="toggleShow"></i>
    </legend>
    <el-form v-show="show" ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="accountNo" label="账户编号：" class="disable-item">
        <span>{{form.accountNo}}</span>
      </el-form-item>
      <el-form-item prop="accountType" label="账户类型：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.accountType">
          <el-option v-for="item in dict.ACT" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.accountTypeName}}</span>
      </el-form-item>
      <el-form-item prop="payWay" label="缴费方式：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.payWay">
          <el-option v-for="item in dict.BPW" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.payWayName}}</span>
      </el-form-item>
      <el-form-item prop="entrustNo" label="托号：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.entrustNo"></el-input>
        <span v-else>{{form.entrustNo}}</span>
      </el-form-item>
      <el-form-item prop="openAccountBank" label="开户银行：" :class="{'disable-item': disabled}">
        <el-cascader
          ref="cascader"
          v-if="!disabled"
          v-model="form.openAccountBank"
          :options="openABankOptions"
          :show-all-levels="false"
          :props="props"
          @change="handleCascaderChange"
        >
        </el-cascader>
        <span v-else>{{form.openAccountBankName}}</span>
      </el-form-item>
      <el-form-item prop="openAccountName" label="开户名称：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.openAccountName"></el-input>
        <span v-else>{{form.openAccountName}}</span>
      </el-form-item>
      <el-form-item prop="bankAccount" label="银行账号：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.bankAccount"></el-input>
        <span v-else>{{form.bankAccount}}</span>
      </el-form-item>
      <el-form-item prop="entrustContract" label="银行协议号：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.entrustContract"></el-input>
        <span v-else>{{form.entrustContract}}</span>
      </el-form-item>
      <el-form-item prop="deliverAddr" label="投递地址：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.deliverAddr"></el-input>
        <span v-else>{{form.deliverAddr}}</span>
      </el-form-item>
      <el-form-item prop="emailAddr" label="邮箱地址：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.emailAddr"></el-input>
        <span v-else>{{form.emailAddr}}</span>
      </el-form-item>
      <el-form-item prop="deliverWay" label="投递方式：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.deliverWay">
          <el-option v-for="item in dict.SDW" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.deliverWayName}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props:['dict', 'editData', 'disabled'],
  data() {
    return {
      form: {
        accountNo: '',
        accountType: '1',
        payWay: '3',
        entrustNo: '',
        openAccountBank: '',
        openAccountName: '',
        bankAccount: '',
        entrustContract: '',
        deliverAddr: '',
        emailAddr: '',
        deliverWay: '1'
      },
      rules: {},
      show: false,
      showIcon: 'el-icon-plus',
      openABankOptions: [],
       props: {//树结构格式
        value: 'id',
        label: 'name',
        checkStrictly: true
      },
    }
  },
  created() {
    this.selectOABankOptions()
    if(this.editData) {
      this.form = {...this.editData}
    }
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 开户银行
    selectOABankOptions() {
      let _this = this
      let params = {
        "busicode": "BankTree",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res)
        _this.openABankOptions = data.children;
      })
    },
    getArr(data) {
      function abc(arr) {

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
    handleCascaderChange() {
      this.$refs.cascader ? this.$refs.cascader.dropDownVisible = false : null
      if(this.form.openAccountBank instanceof Array) {
        // 开户银行 只需要传最后一个值过去
      this.form.openAccountBank = this.common.handleTreeData(this.form.openAccountBank);
      }
    },
    toggleShow() {
      this.show = !this.show
      this.showIcon === 'el-icon-minus' ? this.showIcon = 'el-icon-plus' : this.showIcon = 'el-icon-minus'
    }
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    },
    'form.payWay'(val) {
      if(val === '1') {
        this.$set(this.rules,"openAccountBank",[{ required:true, message:"代扣时，开户银行不能为空", trigger: 'change'}]);
        this.$set(this.rules,"openAccountName",[{ required:true, message:"代扣时，开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"bankAccount",[{ required:true, message:"代扣时，银行账户不能为空", trigger: 'blur'}]);
      } else {
        const names = ['openAccountBank', 'openAccountName', 'bankAccount']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
      }
      if(val==='2'){
        this.$set(this.rules,"openAccountBank",[{ required:true, message:"托收时，开户银行不能为空", trigger: 'change'}]);
        this.$set(this.rules,"openAccountName",[{ required:true, message:"托收时，开户名称不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"bankAccount",[{ required:true, message:"托收时，银行账户不能为空", trigger: 'blur'}]);
        
        this.$set(this.rules,"entrustNo",[{ required:true, message:"托收时，托号不能为空", trigger: 'blur'}]);
        this.$set(this.rules,"entrustContract",[{ required:true, message:"托收时，银行协议号不能为空", trigger: 'blur'}]);
      }else{
        const names = ['entrustNo', 'entrustContract']
        names.forEach(item => {
          if(this.rules.hasOwnProperty(item)){
            this.$delete(this.rules,item)
          }
        })
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.accountInfo {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>