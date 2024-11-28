<template>
  <!-- 开户 -->
  <div class="change-config">
    <div class="ctmInfo">
        <div class="button-group">
          <el-button type="primary" size="mini" @click="selectAll">{{isAll ? '全部取消' : '全选'}}</el-button>
          <el-button type="primary" size="mini" @click="toggleSelect">反选</el-button>
        </div>
        <el-checkbox-group v-model="check">
          <legend class="legendColumn">客户信息</legend>
          <el-checkbox v-for="ctm in userInforForm.ctmInfo" :label="ctm.value" :key="ctm.value" >{{ctm.name}}</el-checkbox>
 
          <legend class="legendColumn">用户信息</legend>
          <el-checkbox v-for="user in userInforForm.userInfo" :label="user.value" :key="user.value" >{{user.name}}</el-checkbox>

          <legend class="legendColumn">账户信息 </legend>
          <el-checkbox v-for="user in userInforForm.billInfo" :label="user.value" :key="user.value" >{{user.name}}</el-checkbox>

          <legend class="legendColumn">开票信息 </legend>
          <el-checkbox v-for="user in userInforForm.invoiceInfo" :label="user.value" :key="user.value" >{{user.name}}</el-checkbox>

          <legend class="legendColumn">用户-抄表信息 </legend>
          <el-checkbox v-for="user in userInforForm.watchInfo" :label="user.value" :key="user.value" >{{user.name}}</el-checkbox>
          <!-- 开户模块 水表信息可修改 -->
          <legend class="legendColumn">用户-水表信息 </legend>
          <el-checkbox v-for="user in userInforForm.userWaterInfo" :label="user.value" :key="user.value" >{{user.name}}</el-checkbox>
        </el-checkbox-group>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInforForm: {
        ctmInfo: [
          {
            name: "客户编号",
            value: 'ctm_no'
          },
          {
            name: "客户名称",
            value: 'ctm_name'
          },
          {
            name: "客户地址",
            value: 'ctm_addr'
          },
          {
            name: "客户类型",
            value: 'ctm_type'
          },
          {
            name: "证件类型",
            value: 'cert_type'
          },
           {
            name: "证件号码",
            value: 'cert_no'
          },
          {
            name: "信用等级",
            value: 'credit_level'
          },
          {
            name: "联系电话",
            value: 'link_tel'
          },
          {
            name: "传真号码",
            value: 'fax_number'
          },
          {
            name: "手机号码",
            value: 'mobile'
          },
        ],
        userInfo: [
           {
            name: "用户编号",
            value: 'user_no'
          },
          {
            name: "用户状态",
            value: 'status'
          },
          {
            name: "合同编号",
            value: 'contract_no'
          },
          {
            name: "合同地址",
            value: 'contract_addr'
          },
          {
            name: "签订日期",
            value: 'contract_date'
          },
          {
            name: "用水期限",
            value: 'use_time_limit'
          },
          {
            name: "行政区域",
            value: 'admin_area'
          },
          /*{
            name: "营业所",
            value: 'business_abode'
          },*/
          {
            name: "营业区域",
            value: 'business_area'
          },
          {
            name: "行业分类",
            value: 'trade_classify'
          },
          {
            name: "通知人",
            value: 'stop_water_link_man'
          },
          {
            name: "通知人手机号",
            value: 'stop_water_link_mobile'
          },
          {
            name: "用水类型",
            value: 'use_water_type'
          },
          {
            name: "1级用水类型",
            value: 'use_water_type_1'
          },
          {
            name: '立户日期',
            value:'open_date'
          },
          {
            name: '用水人口',
            value:'ladder_person_num'
          },
          {
            name: '换表日期',
            value:'change_meter_date'
          },
          {
            name: '水表编号',
            value:'meter_no'
          },
          {
            name: '最后抄表日期',
            value:'last_reading_date'
          },
          {
            name: 'IC卡号',
            value:'miicno'
          },
          {
            name: '累计购水量',
            value:'miicsl'
          },
          {
            name: '备注',
            value:'comments'
          },
          {
            name: '最后抄码',
            value:'last_reading_num'
          },
           {
            name: '定额水量',
            value:'quota_water'
          },
        ],
        billInfo: [
          {
            name: "账户编号",
            value: 'account_no'
          },
          {
            name: "账户类型",
            value: 'account_type'
          },
          {
            name: "缴费方式",
            value: 'pay_way'
          },
          {
            name: "开户银行",
            value: 'open_account_bank'
          },
          {
            name: "开户名称",
            value: 'open_account_name'
          },
          {
            name: "银行账号",
            value: 'bank_account'
          },
          {
            name: "托号",
            value: 'entrust_no'
          },
          {
            name: "托收合同号",
            value: 'entrust_contract'
          },
          {
            name: "投递方式",
            value: 'deliver_way'
          },
          {
            name: "投递地址",
            value: 'deliver_addr'
          },
          {
            name: "邮箱地址",
            value: 'email_addr'
          }
        ],
        userWaterInfo: [
          {
            name: "水表类型",
            value: 'meter_type'
          },
          {
            name:"水表传感器",
            value:'meter_sensor'
          },
          {
            name:"传输方式",
            value:'transmittal_model'
          },
          {
            name:"水表型号",
            value:'meter_model'
          },
          {
            name: "装表地址",
            value: 'setup_meter_addr'
          },
          {
            name: "装表位置",
            value: 'setup_meter_location'
          },
          {
            name: "总表编号",
            value: 'father_meter_no'
          },
          {
            name: "虚拟计算公式",
            value: 'virtual_design_formulas'
          },
          {
            name: "水表用途",
            value: 'meter_use'
          },
          {
            name: "用水对象",
            value: 'use_water_object'
          },
          {
            name: "装表日期",
            value: 'setup_meter_date'
          },
          {
            name: "拆表日期",
            value: 'split_meter_date'
          },
          {
            name: "拆表类型",
            value: 'split_meter_way'
          },
          {
            name: "水表口径",
            value: 'meter_bore'
          },
          {
            name: "水表厂家",
            value: 'meter_factory'
          },
          {
            name: "水表表身码",
            value: 'meter_factory_no'
          },
          {
            name: "imei号",
            value: 'imei'
          },
        ],
        watchInfo: [
          {
            name: "册本号",
            value: 'book_no'
          },
          
          {
            name: "排序号",
            value: 'sort_no'
          },
          {
            name: "抄表员",
            value: 'meter_reading_staff_name'
          }
        ],
        invoiceInfo: [
          {
            name: "发票类型",
            value: 'invoice_type'
          },
          {
            name: "单位名称",
            value: 'invoice_title'
          },
          {
            name: "纳税人识别号",
            value: 'invoice_tax'
          },
          {
            name: "联系地址",
            value: 'invoice_addr'
          },
          {
            name: "座机号码",
            value: 'invoice_link'
          },
          {
            name: "开户银行",
            value: 'invoice_bank'
          },
          {
            name: "银行账户",
            value: 'invoice_account'
          },
        ],
      },
      checkAll: ['ctm_no', 'ctm_name', 'ctm_addr', 'ctm_type', 'cert_type', 'cert_no', 'credit_level', 'link_tel', 'fax_number', 'mobile', 'contract_no',
      'user_no', 'status', 'contract_addr', 'contract_date', 'use_time_limit', 'admin_area', /*'business_abode',*/ 'business_area', 'trade_classify','stop_water_link_man','stop_water_link_mobile', 'use_water_type', 'open_date','ladder_person_num','change_meter_date','meter_no','last_reading_date',
      'account_no', 'account_type', 'pay_way', 'open_account_bank', 'open_account_name', 'bank_account', 'entrust_no', 'entrust_contract', 'deliver_way', 'deliver_addr', 'email_addr',
      'book_no','sort_no','meter_reading_staff_name','use_water_type_1','miicno','miicsl','comments','last_reading_num','quota_water',
      'invoice_type', 'invoice_title', 'invoice_tax', 'invoice_addr', 'invoice_link', 'invoice_bank', 'invoice_account','imei',
      'meter_type','meter_sensor','transmittal_model','meter_model','setup_meter_addr', 'setup_meter_location', 'father_meter_no', 'virtual_design_formulas', 'meter_use', 'use_water_object', 'setup_meter_date', 'split_meter_date', 'split_meter_way', 'meter_bore', 'meter_factory', 'meter_factory_no'],
      check: []
    }
  },
  computed: {
    isAll() {
      return this.check.length === this.checkAll.length
    }
  },
  methods: {
    selectAll() {
      if(!this.isAll) {
        this.check = [...this.checkAll]
      } else {
        this.check = []
      }
    },
    toggleSelect() {
      this.check = this.checkAll.filter(item => !this.check.includes(item))
    }
  }
}
</script>
<style lang="scss" scoped>
.change-config {
  margin-top: 10px;
  height: 100%;
  overflow-y: auto;
  .button-group{
    margin-bottom: 10px;
  }
  /deep/ {
    .el-checkbox{
      margin:10px 15px 10px 15px;
      .el-checkbox__label {
        margin-right: 10px;
      }
    }
  }

}
</style>
