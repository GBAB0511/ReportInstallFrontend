<template>
    <div class="PendingTrial">
    
      <div class="bread-contain">
        <div id="crumbs" >
           <i class='titleApproval'>流程中心</i>
        </div>
        <div class="bread-contain-right" >
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
      </div>
        <mydestop></mydestop>
    </div>
</template>
<script>
import mydestop from "@/views/ProcessApproval/mydestop"

export default {
    name:"PendingTrial",
    components:{
        mydestop
    },
    methods: {
        
      // 返回
      handleClose() {
        // this.$router.push('/WaterSideIndex')
        this.$parent.PendingTrialShow = false
      },
    }

}
</script>
<style lang="scss">
.PendingTrial{
    width: 100%;
    height: 100%;
    #crumbs{
      height: 41px;
      line-height: 41px;
      .titleApproval{
        font-size: 20px;
        font-style: normal;
        margin-left: 10px;
      }
    }
}
</style>
