<template>
  <div class="invoiceInfo">

    <legend class="legendColumn">开票信息</legend>
    <el-form :model="formData" class="formBill-Two" size="mini" :rules="rules" ref="ruleForm">
      <!-- <el-form-item label="发票类型：" prop="invoiceType" :class="{'disable-item':editType==0}">
          <span v-if="editType==0">{{formData.invoiceTypeName}}</span> -->
      <!-- <el-select v-if="editType==0" clearable v-model="formData.invoiceType" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.BBT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
      <!-- <el-select v-else clearable v-model="formData.invoiceType" placeholder="">
            <el-option v-for="(item,index) in dictionaryData.BBT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
      <el-form-item label="单位名称：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceTitle}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceTitle" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceTax}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceTax" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系地址：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceAddr}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceAddr" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="座机号码：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceLink}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceLink" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="开户银行：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.invoiceBank}}</span>
        <!-- <el-cascader
            v-if="editType==0"
            disabled
            v-model="formData.invoiceBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
            >
          </el-cascader> -->
        <!-- <el-cascader
            v-else
            v-model="formData.invoiceBank"
            :options="bankTreeData"
            :show-all-levels="false"
            :props="props"
          >
          </el-cascader> -->
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceBank" placeholder="" clearable></el-input>
      </el-form-item>
      <!--style="width: calc(46% + 10px)"-->
      <el-form-item label="银行账户：" :class="{'disable-item':editType==0}" style="width: calc(46% + 10px)">
        <span v-if="editType==0">{{formData.invoiceAccount}}</span>
        <el-input v-else v-model="formData.invoiceAccount" placeholder="" clearable @input="validateNum1()"></el-input>
      </el-form-item>
      <el-form-item label="增值税标记：" prop="vatFlag" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.vatFlagName}}</span>
        <el-select v-else clearable v-model="formData.vatFlag" placeholder="">
          <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预开票标记：" prop="preInvoicing" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.preInvoicing == 1 ? '是' : '否'}}</span>
        <el-select v-else v-model="formData.preInvoicing" placeholder="">
          <el-option v-for="item in isPreInvoiceNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合并开票：" prop="mergeInvoicing" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.mergeInvoicing == 1 ? '是' : '否'}}</span>
        <el-select v-else v-model="formData.mergeInvoicing" placeholder="">
          <el-option v-for="item in isPreInvoiceNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "invoiceInfo",
  props: ['editType', 'wayOpen'],
  components: {
  },
  data () {
    return {
      dictionaryData: [],
      //开户行
      bankTreeData: [],
      props: {//树结构格式
        value: 'id',
        label: 'name'
      },
      isNot: [{ label: "否", value: '0' }, { label: "是", value: '1' }],
      isPreInvoiceNot: [{ label: "否", value: 0 }, { label: "是", value: 1 }],
      formData: {

        // 开票信息
        invoiceType: "1",//发票类型
        invoiceTypeName: "",//发票类型
        invoiceTitle: "",//单位名称
        invoiceTax: "",//纳税人识别号
        invoiceAddr: "",//联系地址
        invoiceLink: "",//座机号码
        invoiceBank: "",//开户银行
        invoiceAccount: "",//银行账户
        vatFlag: "0",//增值税标识
        vatFlagName: "否",//增值税标识
        preInvoicing: 0,// 预开票标记
        mergeInvoicing: 1, //合并开票,1为是，默认开启
      },
      rules: {
        // invoiceType:[{ required: true, message:"发票类型不能为空", trigger: 'blur'}],
        vatFlag: [{ required: true, message: "增值税标识不能为空", trigger: 'blur' }],
      },
    }
  },
  mounted () {
    if (this.editType != 0) {
      this.dictionaryOptions()
      this.bankTreeDataOptions()
    }
  },

  watch: {
  },
  methods: {
    // 数据初始化
    init (val) {
      if (val) {
        this.formData = val
        //console.log(val);
        this.validateNum1();
      }
    },
    // 输入银行卡号
    validateNum1 () {
      this.setNum1(this.formData)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum1 (data) {
      data.invoiceAccount = data.invoiceAccount.replace(/\s/g, '').replace(/[^\0-9\-]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'invoiceAccount', data.invoiceAccount)
    },
    // 数据字典
    dictionaryOptions () {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BBT"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    //树结构数据处理
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
    //开户银行
    bankTreeDataOptions () {
      let params = { busicode: "BankTree", data: "" };
      this.$api.fetch({ params }).then(res => {
        let data = this.getArr(res)
        this.bankTreeData = data.children;
      }).catch(res => {
        this.bankTreeData = [];
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.invoiceInfo {
  height: 100%;
  /deep/ .formBill-Two {
    .el-form-item__label {
      // width: 150px;
      line-height: 28px;
    }
  }
}
</style>
