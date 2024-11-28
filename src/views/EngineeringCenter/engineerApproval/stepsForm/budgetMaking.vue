<template>
  <div class="budgetMaking">
    <legend class="legendColumn">结算编制</legend>
    <settlement-compile ref="settlementCompile" style="padding:10px;" @settlementFlag='getSettlement' :editData="editData" :disabled="disabledCom" :dict="{PBT:dictionaryData.PBT,BPT:dictionaryData.BPT}"></settlement-compile>
  </div>
</template>

<script>
import SettlementCompile from '../stepsForm/settlementCompile.vue'
export default {
  props: ['editData', 'disabled'],
   components: {
    SettlementCompile
   },
  data() {
    return {
      form: {
        beforeMeterLength: '',
        surveyResult: '',
        workFlag: true,
        designFlag: true,
        branchRoadFlag: false,
        exceedHigh: false,
        surveyDate: '',
        redLineConstruction:'',
        redLineConstructionName:''
      },
      rules: {
        surveyResult: [{ required: true, message: '勘察结论不能为空', trigger: 'blur' }],
        surveyDate: [{ required: true, message: '勘察日期不能为空', trigger: 'change' }],
        redLineConstruction: [{ required: true, message: '红线外施工未选择', trigger: 'change' }],
      },
      dictionaryData: {
        PPT: [],
        UWD: [],
        EGD: [],
        CTT: [],
        CDL: [],
        IDT: [],
        ACT: [],
        BPW: [],
        SDW: [],
        BBT: [],
        PCW: [],
        BPP: [],
        PBT: [],
        PIS: [],
        BPT: []
      },
      disabledCom:''
    }
  },
  created() {
    this.disabledCom = this.disabled;
    if(this.editData){
      this.form = {...this.editData, workFlag: !!this.editData.workFlag, designFlag: !!this.editData.designFlag, branchRoadFlag: !!this.editData.branchRoadFlag, exceedHigh: !!this.editData.exceedHigh,}
    }
  },
  mounted(){
    this.getDictionaryOptions();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
      // 获取字典数据
    getDictionaryOptions () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PPT,UWD,EGD,CTT,CDL,IDT,ACT,BPW,SDW,BBT,PCW,BPP,PBT,PJC,PIS,BPT,PSZ"
        // 工程类型、用水期、紧急程度、客户类型、信用等级、客户（经办人）证件类型、账户类型、缴费方式、投递方式、发票类型、结算方式、预缴方式、余额退款形式、收款主体、信息来源
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    getSettlement(msg){
      this.settlementFlag=msg
      this.$emit('settlementFlag',1)
    },
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val, workFlag: !!val.workFlag, designFlag: !!val.designFlag, branchRoadFlag: !!val.branchRoadFlag, exceedHigh: !!val.exceedHigh,}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.budgetMaking {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>
