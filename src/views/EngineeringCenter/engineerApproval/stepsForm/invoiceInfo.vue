<template>
  <div class="invoiceInfo">
    <legend class="legendColumn">
      开票信息
      <i class="fontRight" :class="showIcon" @click="toggleShow"></i>
    </legend>
    <el-form ref="form" v-show="show" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <!-- <el-form-item prop="invoiceType" label="发票类型：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.invoiceType">
          <el-option v-for="item in dict.BBT" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.invoiceTypeName}}</span>
      </el-form-item> -->
      <el-form-item prop="invoiceTax" label="纳税人识别号：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.invoiceTax"></el-input>
        <span v-else>{{form.invoiceTax}}</span>
      </el-form-item>
      <el-form-item prop="invoiceLink" label="联系电话：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.invoiceLink"></el-input>
        <span v-else>{{form.invoiceLink}}</span>
      </el-form-item>
      <el-form-item prop="vatFlag" label="增值税标记：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.vatFlag">
          <el-option value="0" label="否"></el-option>
          <el-option value="1" label="是"></el-option>
        </el-select>
        <span v-else>{{form.vatFlagName}}</span> 
      </el-form-item>
      <el-form-item prop="invoiceTitle" label="单位名称：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.invoiceTitle"></el-input>
        <span v-else>{{form.invoiceTitle}}</span>
      </el-form-item>
      <el-form-item prop="invoiceAddr" label="联系地址：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.invoiceAddr"></el-input>
        <span v-else>{{form.invoiceAddr}}</span>
      </el-form-item>
         <el-form-item prop="invoiceAccount" label="开户银行：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.invoiceBank"></el-input>
        <span v-else>{{form.invoiceBank}}</span>
      </el-form-item>
      <el-form-item prop="invoiceAccount" label="银行账号：" class="col-2" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.invoiceAccount"></el-input>
        <span v-else>{{form.invoiceAccount}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['dict', 'editData', 'disabled'],
  data() {
    return {
      form: {
        invoiceType: '1',
        invoiceTax: '',
        invoiceLink: '',
        vatFlag:'0',
        invoiceBankName:'',
        invoiceTitle: '',
        invoiceAddr: '',
        invoiceBank: '',
        invoiceAccount: ''
      },
      rules: {
        vatFlag: [{ requied: true, message: '增值税标记不能为空', trigger: 'change' }]
      },
   
      showIcon: 'el-icon-plus',
      show: false
    }
  },
  created() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.invoiceInfo {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>