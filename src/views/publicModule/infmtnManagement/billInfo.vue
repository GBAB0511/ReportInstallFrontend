<template>
  <div class="billInfo">
      <legend class="legendColumn">单据信息</legend>
        <el-form-item label="单据编号：" class="disable-item">
          <span  >{{formData.billNo}}</span>
        </el-form-item>
        <el-form-item label="单据日期：" class="disable-item">
          <span  >{{formData.billDate}}</span>
        </el-form-item>
  </div>
</template>
<script>
export default {
  name: "billInfo",
  props: ['editType'],
  components: {
  },
  data() {
    return {
        formData:{
          billNo:'',
          billDate:'',
        }
    }
  },
  mounted() {
  },
  
  watch: {
  },
  methods: {
    // 数据初始化
    init(val) {
      if (val) {
        this.formData = val
      }
      
    },
  },
}
</script>
<style lang="scss">
.billInfo {    
  height: 100%;
}
</style>