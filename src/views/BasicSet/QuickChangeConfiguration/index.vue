<template>
  <!-- 开户 -->
  <div class="change-config">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" style="background: #faa646; color: white" @click="init">查询</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="ctmInfo">
      <el-form size="mini" class="formBill" :inline="true" :model="userInforForm" label-width="130px" ref="ruleForm">

        <legend class="legendColumn">客户信息</legend>
        <el-checkbox-group v-model="userInforForm.ctmInfoData">
          <el-checkbox v-for="ctm in userInforForm.ctmInfo" :label="ctm.value" @change="selected=>selectChange(selected,ctm)" :key="ctm.value" >{{ctm.name}}</el-checkbox>
        </el-checkbox-group>

        <legend class="legendColumn">用户信息</legend>
        <el-checkbox-group v-model="userInforForm.userInfoData">
          <el-checkbox v-for="user in userInforForm.userInfo" :label="user.value"  @change="selected=>selectChange(selected,user)" :key="user.value" >{{user.name}}</el-checkbox>
        </el-checkbox-group>

        <legend class="legendColumn">账户信息 </legend>
        <el-checkbox-group v-model="userInforForm.billInfoData">
          <el-checkbox v-for="user in userInforForm.billInfo" :label="user.value"  @change="selected=>selectChange(selected,user)" :key="user.value" >{{user.name}}</el-checkbox>
        </el-checkbox-group>

        <legend class="legendColumn">开票信息 </legend>
        <el-checkbox-group v-model="userInforForm.invoiceInfoData">
          <el-checkbox v-for="user in userInforForm.invoiceInfo" :label="user.value"  @change="selected=>selectChange(selected,user)" :key="user.value" >{{user.name}}</el-checkbox>
        </el-checkbox-group>

        <!-- 开户模块 水表信息可修改 -->
        <legend class="legendColumn">用户-水表信息 </legend>
        <el-checkbox-group v-model="userInforForm.userWaterInfoData">
          <el-checkbox v-for="user in userInforForm.userWaterInfo" :label="user.value"  @change="selected=>selectChange(selected,user)" :key="user.value" >{{user.name}}</el-checkbox>
        </el-checkbox-group>

       <!-- <legend class="legendColumn">用户-抄表信息</legend>
        <el-checkbox-group v-model="userInforForm.meterReadInfoData">
          <el-checkbox v-for="user in userInforForm.meterReadInfo" :label="user.value" :key="user.value" >{{user.name}}</el-checkbox>
        </el-checkbox-group>-->

      <!--  <legend class="legendColumn">用户-价格信息 </legend>
        <el-checkbox-group v-model="userInforForm.userPriceInfoData">
          <el-checkbox v-for="user in userInforForm.userPriceInfo" :label="user.value" :key="user.value" >{{user.name}}</el-checkbox>
        </el-checkbox-group>-->

      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "changeConfig",
  components: {

  },
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          // { title: '业务管理', path: '/OpenAccount' },
          { title: '其他配置' },
          { title: '快速变更配置' },
        ],
      },
      userInforForm: {
        ctmInfo: [

        //   {
        //     name: "客户名称",
        //     value: 'ctmName'
        //   },
        //   {
        //     name: "客户地址",
        //     value: 'clientAddr,clientAddrDetail,ctmAddr'
        //   },
        //   {
        //     name: "客户类型",
        //     value: 'ctmType'
        //   },
        //   {
        //     name: "证件类型",
        //     value: 'certType'
        //   },
        //    {
        //     name: "证件号码",
        //     value: 'certNo'
        //   },
        //   {
        //     name: "信用等级",
        //     value: 'creditLevel'
        //   },
        //   {
        //     name: "固定电话",
        //     value: 'linkTel'
        //   },
        //   {
        //     name: "传真号码",
        //     value: 'faxNumber'
        //   },
        //   {
        //     name: "手机号码",
        //     value: 'mobile'
        //   },
        ],
        ctmInfoData: [],
        userInfo: [
/*
          {
            name: "户口簿号",
            value: 'houseCert'
          },
          {
            name: "合同编号",
            value: 'contractNo'
          },
          {
            name: "合同地址",
            value: 'contractAddr'
          },
          {
            name: "签订日期",
            value: 'contractDate'
          },
          {
            name: "用水期限",
            value: 'useTimeLimit'
          },
          {
            name: "行政区域",
            value: 'adminArea'
          },
          {
            name: "营业所",
            value: 'businessAbode'
          },
          {
            name: "营业区域",
            value: 'businessArea'
          },
          {
            name: "行业分类",
            value: 'tradeClassify'
          },
          {
            name: "停水联系人",
            value: 'stopWaterLinkMan'
          },
          {
            name: "停水联系手机",
            value: 'stopWaterLinkMobile'
          },
          {
            name: "用水类型",
            value: 'useWaterType'
          },*/
        ],
        userInfoData: [],
        billInfo: [
        //   {
        //     name: "账户类型",
        //     value: 'accountType'
        //   },
        //   {
        //     name: "缴费方式",
        //     value: 'payWay'
        //   },
        //   {
        //     name: "开户银行",
        //     value: 'openAccountBank'
        //   },
        //   {
        //     name: "开户名称",
        //     value: 'openAccountName'
        //   },
        //   {
        //     name: "银行账号",
        //     value: 'bankAccount'
        //   },
        //   {
        //     name: "托号",
        //     value: 'entrustNo'
        //   },
        //   {
        //     name: "托收合同号",
        //     value: 'entrustContract'
        //   },
        //   {
        //     name: "投递方式",
        //     value: 'deliverWay'
        //   },
        //   {
        //     name: "投递地址",
        //     value: 'deliverAddr'
        //   },
        //   {
        //     name: "电子邮件",
        //     value: 'emailAddr'
        //   },
        //   {
        //     name: "开户行号",
        //     value: 'bankSn'
        //   },
        //   {
        //     name: "出盘编号",
        //     value: 'outNo'
        //   }
        ],
        billInfoData: [],
        userWaterInfo: [
          /*{
            name: "水表类型",
            value: 'meterType'
          },
          {
            name: "装表地址",
            value: 'setupMeterAddr'
          },
          {
            name: "装表位置",
            value: 'setupMeterLocation'
          },
          {
            name: "总表编号",
            value: 'fatherMeterNo'
          },
          {
            name: "虚拟计算公式",
            value: 'virtualDesignFormulas'
          },
          {
            name: "水表用途",
            value: 'meterUse'
          },
          {
            name: "用水对象",
            value: 'useWaterObject'
          },
          {
            name: "装表日期",
            value: 'setupMeterDate'
          },
          {
            name: "拆表日期",
            value: 'splitMeterDate'
          },
          {
            name: "拆表类型",
            value: 'splitMeterWay'
          },*/
        ],
        userWaterInfoData: [],
        // meterReadInfo: [
        //   {
        //     name: "册本号",
        //     value: 'bookNo'
        //   },
        //   {
        //     name: "排序号",
        //     value: 'sortNo'
        //   },
        //   {
        //     name: "抄表周期",
        //     value: 'meterReadingCycle'
        //   },
        // ],
        // meterReadInfoData: [],
        // userPriceInfo: [
        //   {
        //     name: "优惠策略：",
        //     value: 'prefStrategyId'
        //   },
        //   {
        //     name: "优惠证件号码",
        //     value: 'prefCertNo'
        //   },
        //   {
        //     name: "优惠策略开始日期",
        //     value: 'prefBeginDate'
        //   },
        //   {
        //     name: "优惠策略结束日期",
        //     value: 'prefEndDate'
        //   },

        // ],
        // userPriceInfoData: [],
        invoiceInfo: [
          // {
          //   name: "发票类型",
          //   value: 'invoiceType'
          // },
        //   {
        //     name: "单位名称",
        //     value: 'invoiceTitle'
        //   },
        //   {
        //     name: "纳税人识别号",
        //     value: 'invoiceTax'
        //   },
        //   {
        //     name: "联系地址",
        //     value: 'invoiceAddr'
        //   },
        //   {
        //     name: "座机号码",
        //     value: 'invoiceLink'
        //   },
        //   {
        //     name: "开户银行",
        //     value: 'invoiceBank'
        //   },
        //   {
        //     name: "银行账户",
        //     value: 'invoiceAccount'
        //   },
        //   {
        //     name: "预开票标记",
        //     value: 'preInvoicing'
        //   },
        //   {
        //     name: "增值税标记",
        //     value: 'vatFlag'
        //   },
        //   {
        //     name: "合并开票",
        //     value: 'mergeInvoicing'
        //   },
        ],
        invoiceInfoData: [],
      },
      changeData: [],
    }
  },
  mounted() {
      this.init();
  },
  methods: {
    init() {
      //获取用户信息和用户水表信息动态配置字段
    //   let params ={
    //     busicode: "UserChangeQuickConfigUserData",
    //     data:{
    //       pageName:"quickChangeMangement"
    //     }
    //   }
    //   this.$api.fetch({ params })
    //     .then(res =>{
    //       res.forEach(vos =>{
    //         if (vos.group === "用户-水表信息"){
    //           this.userInforForm.userWaterInfo = vos.configVOS;
    //         }else if (vos.group === "用户信息"){
    //           this.userInforForm.userInfo = vos.configVOS;
    //         }
    //       })
    //     console.log(this.userInforForm);
    //     });

      let params = {
        busicode: "UserChangeQuickConfigQuery",
        data: {}
      };
      let _this = this
      this.$api.fetch({ params }).then(res => {
          if(res!=null && res.length>0) {
            _this.userInforForm.ctmInfo = [];
            _this.userInforForm.userInfo = [];
            _this.userInforForm.billInfo = [];
            _this.userInforForm.userWaterInfo = [];
            _this.userInforForm.invoiceInfo = [];

            _this.userInforForm.ctmInfoData = [];
            _this.userInforForm.userInfoData = [];
            _this.userInforForm.billInfoData= [];
            _this.userInforForm.userWaterInfoData = [];
            _this.userInforForm.invoiceInfoData = [];
            res.forEach(item=> {
            //   if(item.name == "ctmInfoData")
            //       _this.userInforForm.ctmInfoData = item.value.split(",")
            //   else if(item.name == "userInfoData")
            //     _this.userInforForm.userInfoData = item.value.split(",")
            //   else if(item.name == "billInfoData")
            //   _this.userInforForm.billInfoData = item.value.split(",")
            //   else if(item.name == "userWaterInfoData")
            //   _this.userInforForm.userWaterInfoData = item.value.split(",")
            //   // else if(item.name == "meterReadInfoData")
            //   // _this.userInforForm.meterReadInfoData = item.value.split(",")
            //   // else if(item.name == "userPriceInfoData")
            //   // _this.userInforForm.userPriceInfoData = item.value.split(",")
            //   else if(item.name == "invoiceInfoData")
            //   _this.userInforForm.invoiceInfoData = item.value.split(",")
                if(item.type === 'ctmInfoData'){
                    _this.userInforForm.ctmInfo.push({name: item.name, value: item.code});
                    if(item.isUse == 1){
                        _this.userInforForm.ctmInfoData.push(item.code);
                    }
                }else if(item.type === 'userInfoData'){
                    _this.userInforForm.userInfo.push({name: item.name, value: item.code});
                    if(item.isUse == 1){
                        _this.userInforForm.userInfoData.push(item.code);
                    }
                }else if(item.type === 'billInfoData'){
                    _this.userInforForm.billInfo.push({name: item.name, value: item.code});
                    if(item.isUse == 1){
                        _this.userInforForm.billInfoData.push(item.code);
                    }
                }else if(item.type === 'userWaterInfoData'){
                    _this.userInforForm.userWaterInfo.push({name: item.name, value: item.code});
                    if(item.isUse == 1){
                        _this.userInforForm.userWaterInfoData.push(item.code);
                    }
                }else if(item.type === 'invoiceInfoData'){
                    _this.userInforForm.invoiceInfo.push({name: item.name, value: item.code});
                    if(item.isUse == 1){
                        _this.userInforForm.invoiceInfoData.push(item.code);
                    }
                }
            })
          }
      });

    },
    selectChange(selected, item, val){
        let hasChange = false;
        this.changeData.forEach(list => {
          if(list.code == item.value){
              list.isUse = selected ? 1 : 0;
              hasChange = true;
          }
        })
        if(!hasChange){
            this.changeData.push({code: item.value, isUse: selected ? 1 : 0})
        }
    },
    save() {
      let quickConfig = this.changeData;
    //   quickConfig.ctmInfoData = this.userInforForm.ctmInfoData.toString();
    //   quickConfig.userInfoData = this.userInforForm.userInfoData.toString();
    //   quickConfig.billInfoData = this.userInforForm.billInfoData.toString();
    //   quickConfig.userWaterInfoData = this.userInforForm.userWaterInfoData.toString();
    //   //quickConfig.meterReadInfoData = this.userInforForm.meterReadInfoData.toString();
    //   //quickConfig.userPriceInfoData = this.userInforForm.userPriceInfoData.toString();
    //   quickConfig.invoiceInfoData = this.userInforForm.invoiceInfoData.toString();

      let params = {
        busicode: "UserChangeQuickConfigSave",
        data: quickConfig
      };
      console.log(params)
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success"
        });
        this.changeData = [];
        this.init();
      });
    },
  },
  watch: {
      userInforForm:{
          handler(){

          }
      }
  }
}
</script>
<style lang="scss" scoped>
.change-config {
  height: 100%;
  .el-date-editor /deep/ .el-input__inner {
    width: 100% !important;
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
  .el-checkbox{
    margin:10px 15px 10px 15px;
  }
}
</style>
