<template>
  <div class="cusAccountMixInfo">
    <div class="custInfo">
      <legend class="legendColumn">客户信息</legend>

      <el-form-item label="客户证件号码：" style="width: calc(46% + 10px)">
        <el-input
          v-if="wayOpen=='OpenAccount'|| wayOpen=='Transfer'"
          v-model="formData.certNo"
          placeholder
          @change="handleSelect"
          clearable
        >
          <el-button
            slot="append"
            class="searchBtn"
            icon="el-icon-search "
            @click="handleSelect(formData.certNo)"
            size="mini"
          ></el-button>
        </el-input>
        <span v-else>{{formData.certNo}}</span>
      </el-form-item>

      <el-form-item label="客户编号：">
        <span>{{formData.ctmNo}}</span>
      </el-form-item>

      <el-form-item label="客户名称：">
        <span v-if="editType==0">{{formData.ctmName}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.ctmName" placeholder clearable></el-input>
      </el-form-item>

      <el-form-item label="客户地址：">
        <span v-if="editType==0">{{formData.ctmAddr}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.ctmAddr" placeholder clearable></el-input>
      </el-form-item>

      <el-form-item label="客户类型：">
        <!-- <span  v-if="editType==0">{{formData.ctmType}}</span> -->
        <el-select v-if="editType==0" clearable v-model="formData.ctmType" disabled placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.CTT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-else clearable v-model="formData.ctmType" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.CTT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="证件类型：">
        <!-- <span  >{{formData.certType}}</span> -->
        <el-select v-if="editType==0" clearable v-model="formData.certType" disabled placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.IDT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-else clearable v-model="formData.certType" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.IDT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="信用等级：">
        <!-- <span  >{{formData.creditLevel}}</span> -->
        <el-select v-if="editType==0" clearable v-model="formData.creditLevel" disabled placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.CDL"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-else clearable v-model="formData.creditLevel" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.CDL"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="固定电话：">
        <span v-if="editType==0">{{formData.linkTel}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.linkTel" placeholder clearable></el-input>
      </el-form-item>

      <el-form-item label="手机号码：">
        <span v-if="editType==0">{{formData.mobile}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.mobile" placeholder clearable></el-input>
      </el-form-item>

      <el-form-item label="传真号码：">
        <span v-if="editType==0">{{formData.faxNumber}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.faxNumber" placeholder clearable></el-input>
      </el-form-item>

      <el-dialog v-if="certVisible" title="请选择客户" class="miniDialog" :visible.sync="certVisible">
        <div class="kl-table">
          <el-table
            :data="ctmNoData"
            highlight-current-row
            stripe
            border
            @row-click="handleRowChange"
          >
            <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
            <el-table-column property="ctmNo" label="客户编号：" width></el-table-column>
            <el-table-column property="ctmName" label="客户名称" width></el-table-column>
            <el-table-column property="ctmAddr" label="客户地址"></el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="chooseCert">确 定</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="accountInfo">
      <legend class="legendColumn">账户信息</legend>
      <el-form-item label="账户编号：">
        <el-select
          v-if="wayOpen=='OpenAccount'||wayOpen=='Transfer'"
          v-model="formData.accountNo"
          filterable
          allow-create
          @change="chooseAccount"
          default-first-option
        >
          <el-option
            v-for="item in accountlist"
            :key="item.id"
            :label="item.openAccountName"
            :value="item.accountNo"
          ></el-option>
        </el-select>
        <span v-else>{{formData.accountNo}}</span>
      </el-form-item>
      <el-form-item label="缴费方式：">
        <el-select v-if="editType==0" clearable v-model="formData.payWay" disabled placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.BPW"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-else clearable v-model="formData.payWay" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.BPW"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户类型：">
        <el-select v-if="editType==0" clearable v-model="formData.accountType" disabled placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.ACT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-else clearable v-model="formData.accountType" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.ACT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开户银行：">
        <el-cascader
          v-if="editType==0"
          disabled
          v-model="formData.openAccountBank"
          :options="bankTreeData"
          :show-all-levels="false"
          :props="props"
        ></el-cascader>
        <el-cascader
          v-else
          v-model="formData.openAccountBank"
          :options="bankTreeData"
          :show-all-levels="false"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="开户名称：">
        <span v-if="editType==0">{{formData.openAccountName}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.openAccountName" placeholder clearable></el-input>
      </el-form-item>

      <el-form-item label="银行账户：" style="width: calc(46% + 10px)">
        <span v-if="editType==0">{{formData.bankAccount}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.bankAccount" placeholder clearable></el-input>
      </el-form-item>
      <el-form-item label="托号：">
        <span v-if="editType==0">{{formData.entrustNo}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.entrustNo" placeholder clearable></el-input>
      </el-form-item>
      <el-form-item label="银行协议号：">
        <span v-if="editType==0">{{formData.entrustContract}}</span>
        <template v-else>
          <el-tooltip :disabled="entrustContractAddrToolShow" effect="dark" :content="formData.entrustContract" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="entrustContract" v-model="formData.entrustContract" placeholder clearable></el-input>
          </el-tooltip>
        </template>
      </el-form-item>

      <el-form-item label="投递方式：" prop="deliverWay">
        <el-select v-if="editType==0" clearable v-model="formData.deliverWay" disabled placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.SDW"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-else clearable v-model="formData.deliverWay" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.SDW"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="投递地址：">
        <span v-if="editType==0">{{formData.deliverAddr}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.deliverAddr" placeholder clearable></el-input>
      </el-form-item>

      <el-form-item label="邮箱地址：">
        <span v-if="editType==0">{{formData.emailAddr}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.emailAddr" placeholder clearable></el-input>
      </el-form-item>
    </div>
    <div class="invoiceInfo">
      <legend class="legendColumn">开票信息</legend>
      <!-- <el-form-item label="发票类型："> -->
        <!-- <span  >{{formData.invoiceType}}</span> -->
        <!-- <el-select v-if="editType==0" clearable v-model="formData.invoiceType" disabled placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.BBT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-else clearable v-model="formData.invoiceType" placeholder>
          <el-option
            v-for="(item,index) in dictionaryData.BBT"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="单位名称：">
        <span v-if="editType==0">{{formData.invoiceTitle}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceTitle" placeholder clearable></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号：">
        <span v-if="editType==0">{{formData.invoiceTax}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceTax" placeholder clearable></el-input>
      </el-form-item>
      <el-form-item label="联系地址：">
        <span v-if="editType==0">{{formData.invoiceAddr}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceAddr" placeholder clearable></el-input>
      </el-form-item>
      <el-form-item label="座机号码：">
        <span v-if="editType==0">{{formData.invoiceLink}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceLink" placeholder clearable></el-input>
      </el-form-item>
      <el-form-item label="开户银行：">
        <!-- <span  v-if="editType==0">{{formData.invoiceBankName}}</span> -->
        <el-cascader
          v-if="editType==0"
          disabled
          v-model="formData.invoiceBank"
          :options="bankTreeData"
          :show-all-levels="false"
          :props="props"
        ></el-cascader>
        <el-cascader
          v-else
          v-model="formData.invoiceBank"
          :options="bankTreeData"
          :show-all-levels="false"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="银行账户：" style="width: calc(46% + 10px)">
        <span v-if="editType==0">{{formData.invoiceAccount}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.invoiceAccount" placeholder clearable></el-input>
      </el-form-item>
    </div>
  </div>
</template>
<script>
export default {
  name: "cusAccountMixInfo",
  props: ["editType", "wayOpen"],
  components: {},
  data() {
    return {
      certVisible: false,
      //账户下拉框数据
      accountlist: [],
      dictionaryData: [],
      //开户行
      bankTreeData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      formData: {
        ctmInfo: {
          ctmNo: "新开户", //客户编号：
          ctmName: "", //客户名称：
          certNo: "", //客户身份证号：
          certType: "", //证件类型：
          ctmAddr: "", //客户地址：
          ctmType: "", //客户类型：
          creditLevel: "", //信用等级：
          faxNumber: "", //传真号码
          linkTel: "", //固定电话：
          mobile: "" //手机号码：}
        },
        accountInfo: {
          // 账户信息
          accountNo: "新开户", //账户编号
          payWay: "", //缴费方式
          accountType: "", //账户类型
          openAccountBank: "", //开户银行
          openAccountName: "", //开户名称
          bankAccount: "", //银行账户
          entrustNo: "", //托号
          entrustContract: "", //托收合同
          deliverWay: "", //投递方式
          deliverAddr: "", //投递地址
          emailAddr: "", //邮箱地址

          // 开票信息
          invoiceType: "", //发票类型
          invoiceTitle: "", //单位名称
          invoiceTax: "", //纳税人识别号
          invoiceAddr: "", //联系地址
          invoiceLink: "", //座机号码
          invoiceBank: "", //开户银行
          invoiceAccount: "" //银行账户
        }
      },
      ctmNoData: [],
      custDate: [],
      entrustContractAddrToolShow: true
    };
  },
  mounted() {
    this.getDictionarySelect();
    this.bankTreeDataOptions();
  },

  watch: {
    'formData.entrustContract': {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if(!/^[0-9a-zA-Z]*$/.test(val) && val !== '') {
          if(oldVal === '' || oldVal === null || oldVal === undefined) {
            this.formData.entrustContract = ''
          } else {
            this.formData.entrustContract = oldVal
          }
        }
        const entrustContract = document.querySelector('.entrustContract .el-input__inner')
        entrustContract && (this.entrustContractAddrToolShow = (entrustContract.scrollWidth <= entrustContract.offsetWidth) || !(val && val.length > 0))
      }
    },
  },
  methods: {
    // 数据初始化
    init(val) {
      if (val) {
        this.$set(this, "formData", val);
      }
    },
    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CTT,IDT,CDL,CUS,BPW,ACT,SDW"
      };
      this.$api
        .fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        })
        .catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    //开户银行
    bankTreeDataOptions() {
      let params = { busicode: "BankTree", data: "" };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = this.getArr(res);
          this.bankTreeData = data.children;
        })
        .catch(res => {
          this.bankTreeData = [];
        });
    },

    async handleSelect(val) {
      let params = { busicode: "QuerySameClient", data: { certNo: val } };
      let testA = await this.$api.fetch({ params });
      this.$set(this, "ctmNoData", testA);
      if (this.ctmNoData.length == 1) {
        this.formData = this.ctmNoData[0];
        this.getaccountCusData(this.formData.ctmNo);
      } else if (this.ctmNoData.length > 1) {
        this.certVisible = true;
      } else {
        this.formData = {
          ctmNo: "新开户", //客户编号：
          ctmName: "", //客户名称：
          certNo: val, //客户身份证号：
          certType: "", //证件类型：
          ctmAddr: "", //客户地址：
          ctmType: "", //客户类型：
          creditLevel: "", //信用等级：
          faxNumber: "", //传真号码
          linkTel: "", //固定电话：
          mobile: "" //手机号码：
        };
        // this.$parent.$parent.getAccoInvoData("", "clear");
      }
    },
    handleRowChange(row, column, event) {
      this.custDate = [];
      var data = JSON.parse(JSON.stringify(row));
      this.custDate.push(data);
    },
    chooseCert() {
      this.formData = this.custDate[0];
      this.getaccountCusData();
      // this.$parent.$parent.custEditType = 0;
      this.certVisible = false;
    },
    chooseAccount(val) {
      if (val == "") {
        this.formData = { accountNo: "" }; //清空账户信息 开票信息
        // this.$parent.$parent.getAccoInvoData(this.formData,'clear')
      } else {
        this.formData = JSON.parse(
          JSON.stringify(this.accountlist.find(item => val == item.accountNo))
        ); //找到账户下框中的值给 账户信息、开票信息赋值
        // this.$parent.$parent.getAccoInvoData(this.formData,'getValue')
      }
    },

    //切换客户时，查询客户下的账户号 
    // 分为三种情况 
    // 当有1个账户时 直接赋值
    async getaccountCusData() {
      let QuerySameAcPar = {
        busicode: "QuerySameAccount",
        data: { ctmNo: this.formData.ctmNo }
      };
      let a = await this.$api.fetch({ params: QuerySameAcPar });
      let b = {};
      //清空账户下拉框数据
      this.$refs.accountInfo.accountlist = [];
      if (a.length == 1) {
        b.accountInfo = a[0];
        this.getAccountData(b);
        this.getInvoiceData(b);
        //账户信息
        this.accountEditType = 0;
        this.invoiceEditType = 0;
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);
      } else if (a.length < 1) {
        b.accountInfo = {};
        this.getAccountData(b);
        this.getInvoiceData(b);

        this.accountEditType = 1;
        this.invoiceEditType = 1;
        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);
      } else if (a.length > 1) {
        b.accountInfo = a[0];
        this.getAccountData(b);
        this.getInvoiceData(b);
        //账户信息
        this.$refs.accountInfo.init(this.accountData);
        //开票信息
        this.$refs.invoiceInfo.init(this.invoiceData);

        let c = {
          accountNo: "",
          openAccountName: "新开账户",
          id: "123456"
        };
        a.unshift(c);

        this.accountEditType = 0;
        this.invoiceEditType = 0;
        this.$refs.accountInfo.accountlist = a;
      }
    },

    closeDialog() {
      this.certVisible = false;
    },
    indexMethod(index) {
      //获取表格序号
      return index + 1;
    }
  }
};
</script>
<style lang="scss">
.cusAccountMixInfo {
  height: 100%;
}
</style>
