<template>
  <div class="water-meter">
    <div class="table-content">
      <div class="kl-table">
        <el-form
          label-width="100px"
          class="demo-ruleForm">
          <el-row>
            <el-col :span="2"><el-checkbox v-model="checked0"></el-checkbox> 全选 </el-col>
            <el-col :span="4"></el-col>
            <el-col :span="18"></el-col>
          </el-row>

          <el-row
            style="margin-top: 6px; margin-bottom: 6px"
          >
            <el-col :span="2">
              <el-checkbox v-model="checked1"></el-checkbox>
            </el-col>
            <el-col :span="4"> 客户证件号码 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked1==true"
                v-model="text1"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checked2"></el-checkbox>
            </el-col>
            <el-col :span="4"> 客户名称 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked2==true"
                type="text"
                v-model="text2"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row
            style="margin-top: 6px; margin-bottom: 6px"
          >
            <el-col :span="2">
              <el-checkbox v-model="checked3"></el-checkbox>
            </el-col>
            <el-col :span="4"> 手机号码 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked3==true"
                type="text"
                v-model="text3"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checked4"></el-checkbox>
            </el-col>
            <el-col :span="4"> 传真号码 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked4==true"
                type="text"
                v-model="text4"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row
            style="margin-top: 6px; margin-bottom: 6px"
          >
            <el-col :span="2">
              <el-checkbox v-model="checked5"></el-checkbox>
            </el-col>
            <el-col :span="4"> 单位名称 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked5==true"
                type="text"
                v-model="text5"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checked6"></el-checkbox>
            </el-col>
            <el-col :span="4"> 纳税人识别号 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked6==true"
                type="text"
                v-model="text6"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row
            style="margin-top: 6px; margin-bottom: 6px"
          >
            <el-col :span="2">
              <el-checkbox v-model="checked7"></el-checkbox>
            </el-col>
            <el-col :span="4"> 联系地址 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked7==true"
                type="text"
                v-model="text7"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checked8"></el-checkbox>
            </el-col>
            <el-col :span="4"> 座机号码 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked8==true"
                type="text"
                v-model="text8"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row
            style="margin-top: 6px; margin-bottom: 6px"
          >
            <el-col :span="2">
              <el-checkbox v-model="checked9"></el-checkbox>
            </el-col>
            <el-col :span="4"> 开户银行 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked9==true"
                type="text"
                v-model="text9"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checked10"></el-checkbox>
            </el-col>
            <el-col :span="4"> 银行账户 </el-col>
            <el-col :span="16">
              <el-input
                v-if="checked10==true"
                type="text"
                v-model="text10"
                oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row
            style="margin-top: 6px; margin-bottom: 6px"
          >
            <el-col :span="2">
              <el-checkbox v-model="checked11"></el-checkbox>
            </el-col>
            <el-col :span="4"> 用水类型 </el-col>
            <el-col :span="14">
              <el-cascader
                v-if="checked11==true"
                style="color: black"
                :props="props"
                v-model="text11"
                :options="waterTypeData"
                :show-all-levels="false"
                clearable
              ></el-cascader>
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checked12"></el-checkbox>
            </el-col>
            <el-col :span="4"> 增值税标记 </el-col>
            <el-col :span="16">
              <el-select v-model="text12" v-if="checked12==true">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row
            style="margin-top: 6px; margin-bottom: 6px"
          >
            <el-col :span="2">
              <el-checkbox v-model="checked13"></el-checkbox>
            </el-col>
            <el-col :span="4"> 预开票标记 </el-col>
            <el-col :span="16">
              <el-select v-model="text13" v-if="checked13==true">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>

          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checked14"></el-checkbox>
            </el-col>
            <el-col :span="4"> 合并开票 </el-col>
            <el-col :span="16">
              <el-select v-model="text14" v-if="checked14==true">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import concentratorInfo from "@/components/concentratorInfo"; //选择集中器
export default {
  components: {
    concentratorInfo,
  },
  props: ["selectData"],
  data() {
    return {
      waterTypeData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name",
      },
      tableData: [
        {
          certNo: "", //客户证件号码
          ctmName: "", //客户名称
          mobile: "", //手机号码
          faxNumber: "", //传真号码
          invoiceTitle: "", //单位名称
          invoiceTax: "", //纳税人识别号
          invoiceAddr: "", //联系地址
          invoiceLink: "", //座机号码
          invoiceBank: "", //开户银行
          invoiceAccount: "", //银行账户
          vatFlag: "", //增值税标记
          preInvoicing: "", //预开票标记
          mergeInvoicing: "", //合并开票
          useWaterType: "", //用水类型
        },
      ],
      checked0:false,
      checked1: false,
      text1: "",
      checked2: false,
      text2: "",
      checked3: false,
      text3: "",
      checked4: false,
      text4: "",
      checked5: false,
      text5: "",
      checked6: false,
      text6: "",
      checked7: false,
      text7: "",
      checked8: false,
      text8: "",
      checked9: false,
      text9: "",
      checked10: false,
      text10: "",
      checked11: false,
      text11: "",
      checked12: false,
      text12: "",
      checked13: false,
      text13: "",
      checked14: false,
      text14: "",
    };
  },
  watch: {
    checked0(){
      if(this.checked0==true){
        this.checked1=true
        this.checked2=true
        this.checked3=true
        this.checked4=true
        this.checked5=true
        this.checked6=true
        this.checked7=true
        this.checked8=true
        this.checked9=true
        this.checked10=true
        this.checked11=true
        this.checked12=true
        this.checked13=true
        this.checked14=true
      }else{
        this.checked1=false
        this.checked2=false
        this.checked3=false
        this.checked4=false
        this.checked5=false
        this.checked6=false
        this.checked7=false
        this.checked8=false
        this.checked9=false
        this.checked10=false
        this.checked11=false
        this.checked12=false
        this.checked13=false
        this.checked14=false

      }
    }
  },
  mounted() {
    this.waterTypeDataOption();
  },
  methods: {
    clearTable(){
      this.checked1=false
      this.checked2=false
      this.checked3=false
      this.checked4=false
      this.checked5=false
      this.checked6=false
      this.checked7=false
      this.checked8=false
      this.checked9=false
      this.checked10=false
      this.checked11=false
      this.checked12=false
      this.checked13=false
      this.checked14=false
      this.text1=''
      this.text2=''
      this.text3=''
      this.text4=''
      this.text5=''
      this.text6=''
      this.text7=''
      this.text8=''
      this.text9=''
      this.text10=''
      this.text11=''
      this.text12=''
      this.text13=''
      this.text14=''
    },
    submit() {
      if (
        (this.checked1 == true && this.text1 == "") ||
        (this.checked2 == true && this.text2 == "") ||
        (this.checked3 == true && this.text3 == "") ||
        (this.checked4 == true && this.text4 == "") ||
        (this.checked5 == true && this.text5 == "") ||
        (this.checked6 == true && this.text6 == "") ||
        (this.checked7 == true && this.text7 == "") ||
        (this.checked8 == true && this.text8 == "") ||
        (this.checked9 == true && this.text9 == "") ||
        (this.checked10 == true && this.text10 == "") ||
        (this.checked11 == true && this.text11 == "") ||
        (this.checked12 == true && this.text12 === "") ||
        (this.checked13 == true && this.text13 === "") ||
        (this.checked14 == true && this.text14 === "")
      ) {
        console.log(this.checked12 == true && this.text12 == "");
        console.log(this.checked13 == true && this.text13 == "");
        console.log(this.checked14 == true && this.text14 == "");
        this.$message({
          message: "信息未填完整",
          type: "error",
        });
        return;
      }
      var partten = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (this.checked3 == true) {
        if (!partten.test(this.text3)) {
          this.$message({
            message: "手机号格式不正确",
            type: "error",
          });
          return false;
        }
      }
      (this.tableData = [
        {
          certNo: this.checked1 == true ? this.text1 : undefined, //客户证件号码
          ctmName: this.checked2 == true ? this.text2 : undefined, //客户名称
          mobile: this.checked3 == true ? this.text3 : undefined, //手机号码
          faxNumber: this.checked4 == true ? this.text4 : undefined, //传真号码
          invoiceTitle: this.checked5 == true ? this.text5 : undefined, //单位名称
          invoiceTax: this.checked6 == true ? this.text6 : undefined, //纳税人识别号
          invoiceAddr: this.checked7 == true ? this.text7 : undefined, //联系地址
          invoiceLink: this.checked8 == true ? this.text8 : undefined, //座机号码
          invoiceBank: this.checked9 == true ? this.text9 : undefined, //开户银行
          invoiceAccount: this.checked10 == true ? this.text10 : undefined, //银行账户
          useWaterType: this.checked11 == true ? this.text11 : undefined, //用水类型
          vatFlag: this.checked12 == true ? this.text12 : undefined, //增值税标记
          preInvoicing: this.checked13 == true ? this.text13 : undefined, //预开票标记
          mergeInvoicing: this.checked14 == true ? this.text14 : undefined, //合并开票
        },
      ]),
        // console.log(JSON.stringify(this.tableData[0]));
        // this.checkMobile(this.tableData[0].mobile)
        this.$emit("changeRegisterInfo", this.tableData);
    },
    //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree",
      };
      this.$api
        .fetch({ params })
        .then((res) => {
          let data = this.getArr(res);
          this.$set(this, "waterTypeData", data.children);
          // console.log(JSON.stringify(this.waterTypeData));
          let m = [];
          for (let i = 0; i < this.waterTypeData.length; i++) {
            if (this.waterTypeData[i].name !== "混合用水") {
              m.push(this.waterTypeData[i]);
            }
          }
          this.$set(this, "waterTypeData", m);
        })
        .catch((res) => {
          this.$set(this, "waterTypeData", []);
        });
    },
    //树结构数据处理
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
  },
};
</script>
<style lang="scss" scoped>
/deep/.water-meter {
  margin-top: 0px !important;
  height: 530px;
  width: 100%;
  overflow: auto;
  .col-2 {
    width: calc(46% + 10px);
  }
  .el-input--mini {
    width: 300px;
  }
  #sendOrderDialog {
    .formBill {
      padding-top: 20px;
    }

    /deep/ .el-dialog {
      height: 40%;
    }
  }

  .button-dialog .el-dialog {
    height: 50%;
  }
  .el-input__icon {
    line-height: 0 !important;
  }
  .table-content {
    height: 40px;
    padding: 5px 0px 0px 0px;
    margin: 0 20px;

    font {
      font-weight: 700;
      padding: 5px 20px;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .add-line {
      float: right;
      margin-right: 20px;
      // margin-bottom: 5px;
      .el-button--info {
        background-color: #b5bac3;
        border-color: #b5bac3;
      }
    }
  }
}
</style>
