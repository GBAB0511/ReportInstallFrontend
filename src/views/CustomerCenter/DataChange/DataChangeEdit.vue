
<template>
    <div class="DataChangeEdit">
      <userInfo :isEdit="isEdit"></userInfo>
    </div>
</template>
<script>
import userInfo from "@/components/userInfo/ctmInfo.vue"
export default {
  name:"DataChangeEdit",
  components:{
    userInfo
  },
  data(){
    return{
      isEdit:false
    }
  }
}
</script>
<style lang="scss">
.DataChangeEdit{
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}
</style>


