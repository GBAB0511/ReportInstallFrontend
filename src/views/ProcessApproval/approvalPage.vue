
<template>
    <div class="approvalPage">
      
        <addInfo style="height:100%" :codeStep="codeStep" v-if="showType=='用水咨询'"></addInfo>
        <survey style="height:100%" :codeStep="codeStep" v-else-if="showType=='勘察'"></survey>
        <DiscontinueUse  v-else-if="showType=='停用'"></DiscontinueUse>
        <SalesAccount  v-else-if="showType=='销户'"></SalesAccount>
        <BalanceTransfer  v-else-if="showType=='余额过户'"></BalanceTransfer>
        <LiquidatedDamagesEdit  v-else-if="showType=='违约金减免'"></LiquidatedDamagesEdit>
        <RedFlushingEdit  v-else-if="showType=='红冲'"></RedFlushingEdit>
        <ComparisonTableEdit  v-else-if="showType=='校表'"></ComparisonTableEdit>
        
    </div>
</template>
<script>

import addInfo from '@/views/EngineeringCenter/waterQuery/waterQueryApproval'
import survey from '@/views/EngineeringCenter/waterQuery/waterQueryApproval'
import DiscontinueUse from '@/views/CustomerCenter/DiscontinueUse/DisuseProcedureEdit'
import SalesAccount from '@/views/CustomerCenter/SalesAccount/SalesAccountEdit'
import BalanceTransfer from '@/views/FinancialCenter/CounterCharges/BalanceTransferEdit'
import LiquidatedDamagesEdit from '@/views/FinancialCenter/FinancialAdjustment/LiquidatedDamages/LiquidatedDamagesEdit'
import RedFlushingEdit from '@/views/FinancialCenter/FinancialAdjustment/RedFlushing/RedFlushingEdit'
import ComparisonTableEdit from '@/views/WatchCenter/ComparisonTable/ComparisonTableHandle'
export default {
    name:"approvalPage",
    components: {
        addInfo,
        DiscontinueUse,
        SalesAccount,
        survey,
        BalanceTransfer,
        LiquidatedDamagesEdit,
        ComparisonTableEdit,
        RedFlushingEdit
    },
    props:["approvalPageType","codeStep"],
    data(){
        return{
          showType:"",
        }
    },
    mounted() {

      this.showType = this.approvalPageType

    },
    methods: {
      //保存按钮
      resetForm() {
        this.$refs.approvalPageForm.resetFields();
      },
      submitForm(formName,type,id) {
        let _this = this;
        let params = {};
        
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
             if(type === '添加'){
               this.ruleForm.parentId = id;
               params = {
                  "busicode": "BankAdd",
                  "data": this.ruleForm
              }
             }else{
                this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
               params = {
                  "busicode": "BankUpdate",
                  "data": this.ruleForm
              };
             }
              this.$api.fetch({
                params: params,//参数
              }).then(res => {
                _this.$message({
                  showClose:true,
                  message:'保存成功',
                  type:'success',
                });
                if(type === '添加') {
                  _this.$parent.getTreeDatas(); 
                }else{
                    _this.$parent.init();
                }
                
                _this.$parent.closeDialog();   
                
              })
              
          } else {
            return false;
          }
        });
      },
      handleClose() {
        this.common.chargeObjectEqual(this,this.ruleForm,'get','approvalPage',this.$parent.closeDialog);
      },
    },
    watch:{
      approvalPageType(val) {
        this.showType = val;
      },
      codeStep(val,old){
        
      }
    }
}
</script>
<style lang="scss">

.approvalPage{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    .Engineering-Registration-content{
      .bread-contain{
        display: none;
      }
      .engineer-center-right-content{
        height: 100%;
      }
    }
}
</style>
