<template>
  <div class="custInfo">
    <legend class="legendColumn">客户信息</legend>

    <el-form :model="formData" class="formBill" size="mini" :rules="rules" ref="ruleForm">
      <!--wayOpen=='OpenAccount'||wayOpen=='Transfer' ||wayOpen=='changeMangement' -->
      

      <el-form-item label="客户编号：" prop="ctmNo" class="disable-item">
        <span>{{formData.ctmNo}}</span>
      </el-form-item>
      <el-form-item label="客户名称：" prop="ctmName" v-show="checkQuickConfig('ctmName')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.ctmName}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else @input="e => input = inputMe(e)" v-model="formData.ctmName" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="客户地址：" v-show="checkQuickConfig('clientAddr,clientAddrDetail,ctmAddr')" prop="clientAddr" :class="{'disable-item':editType==0, 'two-input': true}">
        <span v-if="editType==0">{{formData.ctmAddr}}</span>
        <template v-else>
          <el-select
          v-show="isShowclientAddr"
            v-model="formData.clientAddr"
            filterable
            remote
            clearable
            reserve-keyword
            :remote-method="adminAreaDataOptions"
            ref="addrselect"
            :loading="false">
            <template v-for="item in adminAreaData">
              <el-option
                :key="item.id"
                :label="item.fullName"
                :value="item.id">
              </el-option>
            </template>
             <template slot="empty">
              <p class="el-select-dropdown__empty">
                无数据
              </p>
              <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
                <div style="height:30px;line-height: 30px;text-align:right" >
                  <span  style="cursor: pointer;" @click="showAddrAddDialog">
                    <i class="el-icon-plus"></i>
                  <span>添加</span>
                  </span>
                </div>
              </div>
              </template>
              <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
                <div style="height:30px;line-height: 30px;text-align:right" >
                  <span  style="cursor: pointer;" @click="showAddrAddDialog">
                    <i class="el-icon-plus"></i>
                  <span>添加</span>
                  </span>
                </div>
              </div>
          </el-select>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.clientAddrDetail" placeholder="" clearable></el-input>
          </template>
      </el-form-item>

      <el-form-item label="客户类型：" prop="ctmType" v-show="checkQuickConfig('ctmType')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.ctmTypeName}}</span>
        <!-- <el-select v-if="editType==0" clearable v-model="formData.ctmType" disabled placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.CTT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
        <el-select v-else clearable v-model="formData.ctmType" placeholder="">
          <el-option v-for="(item,index) in dictionaryData.CTT" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="证件类型：" prop="certType" v-show="checkQuickConfig('certType')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.certTypeName}}</span>
        <!-- <el-select v-if="editType==0" clearable v-model="formData.certType"  disabled placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.IDT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
       <el-select v-else clearable v-model="formData.certType" placeholder="">
          <el-option v-for="(item,index) in dictionaryData.IDT" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="证件号码：" prop="certNo" v-if="!disableCertNo" v-show="checkQuickConfig('certNo')" style="width: calc(46% + 10px)" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.certNo}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-else v-model="formData.certNo" placeholder="" clearable>
          <el-button slot="append" class="searchBtn " icon="el-icon-search " @click="handleSelect(formData.certNo)" size='mini'></el-button>
        </el-input>
      </el-form-item>

      <el-form-item label="信用等级：" v-show="checkQuickConfig('creditLevel')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.creditLevelName}}</span>
        <!-- <el-select v-if="editType==0" clearable v-model="formData.creditLevel" disabled  placeholder="" >
            <el-option v-for="(item,index) in dictionaryData.CDL" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
        <el-select v-else clearable v-model="formData.creditLevel" placeholder="">
          <el-option v-for="(item,index) in dictionaryData.CDL" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="固定电话：" v-show="checkQuickConfig('linkTel')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.linkTel}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-else v-model="formData.linkTel" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="手机号码：" prop="mobile" v-show="checkQuickConfig('mobile')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.mobile}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-else v-model="formData.mobile" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="传真号码：" v-show="checkQuickConfig('faxNumber')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.faxNumber}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-else v-model="formData.faxNumber" placeholder="" clearable></el-input>
      </el-form-item>
    </el-form>
    <el-dialog v-if="certVisible" title="请选择客户" class="miniDialog" :visible.sync="certVisible">
      <div class="kl-table">
        <el-table :data="ctmNoData" highlight-current-row stripe border @row-click="handleRowChange">
          <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column property="ctmNo" label="客户编号：" width=""></el-table-column>
          <el-table-column property="ctmName" label="客户名称" width=""></el-table-column>
          <el-table-column property="ctmAddr" label="客户地址"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="chooseCert">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <addrAdd :addrVisible="addrVisible" v-if="addrVisible" @closeAddrAddVisible="closeAddrAddVisible"></addrAdd>
  </div>
</template>
<script>
import addrAdd from "@/components/addrAdd"
export default {
  name: "custInfo",
  props: ['editType', 'wayOpen', 'disableCertNo','quickConfig'],
  components: {
    addrAdd
  },
  data() {
     const checkAddr = (rule, value, callback) => {
      if(!this.formData.clientAddr || this.formData.clientAddr.trim().length == 0) {
        callback(new Error('客户地址不能为空'))
      }
      if(!this.formData.clientAddrDetail || this.formData.clientAddrDetail.trim().length == 0) {
        callback(new Error('客户地址不能为空'))
      }
      callback()
    }
    return {
      certVisible: false,
      dictionaryData: [],
      formData: {
        ctmNo: "新开户",//客户编号：
        ctmName: "",//客户名称：
        certNo: "",//客户身份证号：
        certType: "",//证件类型：
        certTypeName: "",//证件类型：
        ctmAddr: "",//客户地址：
        clientAddr: '',
        clientAddrDetail: '',
        ctmType: "",//客户类型：
        ctmTypeName: "",//客户类型：
        creditLevel: "",//信用等级：
        creditLevelName: "",//信用等级：
        faxNumber: "",//传真号码
        linkTel: "",//固定电话：
        mobile: "",//手机号码：
      },
      ctmNoData: [],
      custDate: [],
      adminAreaData: [],
      rules: {
        // ctmNo: [{ required: true, message: "客户编号不能为空", trigger: 'blur' }],
        // ctmName: [{ required: true, message: "客户名称不能为空", trigger: 'blur' }],
        //  clientAddr:[
        //     { required: true, message:"客户地址不能为空", trigger: 'blur'},
        //     { validator: checkAddr, trigger: 'blur'}
        //     ],
        // ctmType: [{ required: true, message: "客户类型不能为空", trigger: 'change' }],
        // certType: [{ required: true, message: "证件类型不能为空", trigger: 'change' }],
        // certNo: [{ required: true, message: "客户证件号码不能为空", trigger: 'blur' }],
        //mobile: [{ required: true, message: "手机号码不能为空", trigger: 'blur' }],
      },
      addrVisible:false,
      isShowclientAddr: true,
    }
  },
  mounted() {
    if (this.editType != 0) {
      this.getDictionarySelect()
    }
  },

  watch: {
    // 解决校验文字显示问题
    editType: function (oldVal, newVal) {
      if (newVal != 0) {
        $('.el-form-item--mini .el-form-item__error').hide()
      }
    }
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 数据初始化
    init(val) {
      if (val) {
        this.$set(this, "formData", val);
      }
    },
    adminAreaDataByFullName(query) {
      if(query==null || query.length==0){
        return 
      }
      let params = { busicode: "AdminAreaQuery", data: {fullName:query,isLeaf:1} };
      this.$api
        .fetch({ params })
        .then(res => {
          if(res.list.length>0){
            this.formData.clientAddr=res.list[0].id
          }
          this.$set(this,"adminAreaData",res.list)
        })
    },
    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CTT,IDT,CDL"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    checkQuickConfig(val) {
      let config = 0
      if(this.quickConfig!=null && this.quickConfig.length> 0) {
          this.quickConfig.forEach(item=> {
              if(item == val) {
                  config = 1
              }               
          })
      }else
        return false
      if(config == 1) 
        return true
      else
        return false
    },
    adminAreaDataOptions(query) {
      if(query==null || query.length==0){
        return 
      }
      let params = { busicode: "AdminAreaQuery", data: {areaName:query,isLeaf:1} };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this,"adminAreaData",res.list)
        })
    },
    async handleSelect(val) {
      let params = { "busicode": "QuerySameClient", "data": { certNo: val } }
      let testA = await this.$api.fetch({ params })
      this.$set(this, 'ctmNoData', testA)
      if (this.ctmNoData.length == 1) {
        this.$parent.$parent.custEditType = 0
        this.formData = this.ctmNoData[0]
        this.$parent.$parent.getaccountCusData(this.formData.ctmNo)
      } else if (this.ctmNoData.length > 1) {
        this.certVisible = true
      } else{

        this.$parent.$parent.custEditType = 1
        this.formData.ctmNo = "新开户";
        this.formData = {
          ctmNo: "新开户",//客户编号：
          ctmName: "",//客户名称：
          certNo: this.formData.certNo,//客户身份证号：
          certType: "",//证件类型：
          certTypeName: "",//证件类型：
          ctmAddr: "",//客户地址：
          clientAddr: '',
          clientAddrDetail: '',
          ctmType: "",//客户类型：
          ctmTypeName: "",//客户类型：
          creditLevel: "",//信用等级：
          creditLevelName: "",//信用等级：
          faxNumber: "",//传真号码
          linkTel: "",//固定电话：
          mobile: "",//手机号码：
        }
        this.$parent.$parent.getAccoInvoData('', 'clear')
      }
    },
    handleRowChange(row, column, event) {
      this.custDate = []
      var data = JSON.parse(JSON.stringify(row))
      this.custDate.push(data)
    },
    chooseCert() {
      this.formData = this.custDate[0]
      this.$parent.$parent.getaccountCusData(this.formData.ctmNo)
      this.$parent.$parent.custEditType = 0
      this.certVisible = false
    },
    closeDialog() {
      this.certVisible = false
    },
    indexMethod(index) {//获取表格序号
      return (index + 1);
    },
    showAddrAddDialog(){
      this.$refs.addrselect.blur();
      this.addrVisible = true;
    },
    closeAddrAddVisible(){
      this.addrVisible = false;
    },
  },
}
</script>
<style lang="scss">
.custInfo {
  height: 100%;
  .formBill {
    .el-form-item__label {
      width: 130px;
    }
  }
  .two-input {
      width: calc(46% + 10px);
      .el-input {
        width: 49% !important;
      }
      .el-select {
        width: 49% !important;
        .el-input {
          width: 100% !important;
        }
      }
      
    }
}
</style>
