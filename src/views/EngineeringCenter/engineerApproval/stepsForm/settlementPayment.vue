<template>
  <div class="settlementCompile">
    <legend v-if="!nolegend" class="legendColumn">
      结算收款
    </legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill-Three" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="backFillMoney" label="找补金额：" class="disable-item">
        <span>{{form.backFillMoney}}</span>
      </el-form-item>
      <el-form-item prop="setmtPayDate" label="结算日期：" :class="{'disable-item': disabled}">
        <el-date-picker v-if="!disabled" v-model="form.setmtPayDate" value-format="yyyy-MM-dd"></el-date-picker>
        <span v-else>{{form.setmtPayDate}}</span>
      </el-form-item>
      <br>
      <el-form-item prop="refundWay" label="余额退款方式：" class="col-2" :class="{'disable-item': disabled}">
        <el-radio-group v-if="!disabled" v-model="form.refundWay">
          <el-radio v-for="item in dict.PBT" :key="item.value" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
        <span v-else>{{form.refundWayName}}</span>
      </el-form-item>
      <br>
      <template v-if="form.refundWay == '10'">
        <el-form-item prop="openAccountBank" label="开户行：" :class="{'disable-item': disabled}">
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
        <el-form-item prop="openAccountName" label="户名：" :class="{'disable-item': disabled}">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.openAccountName"></el-input>
          <span v-else>{{form.openAccountName}}</span>
        </el-form-item>
        <br>
        <el-form-item prop="bankAccount" label="账户号：" :class="{'disable-item': disabled}">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.bankAccount"></el-input>
          <span v-else>{{form.bankAccount}}</span>
        </el-form-item>
        <el-form-item prop="comments" label="备注：" :class="{'disable-item': disabled}">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.comments"></el-input>
          <span v-else>{{form.comments}}</span>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  props:['dict', 'editData', 'disabled', 'nolegend'],
  data() {
    return {
      form: {
        backFillMoney: '',
        setmtPayDate: '',
        refundWay: '',
        openAccountBank: '',
        openAccountName: '',
        bankAccount: '',
        comments: ''
      },
      rules: {

      },
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
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.settlementCompile {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>