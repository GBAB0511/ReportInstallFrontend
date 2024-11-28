<template>
  <div  class="ICHistoryList">
        <el-table
                  :max-height="maxHeight"
                  center
                  :height="maxHeight"
                  stripe
                  border
                  :data="data"
                  class="wuserInfo-table"
                >
                  <el-table-column
                    align="center"
                    type="index"
                    label="NO."
                    fixed="left"
                    width="50"
                    :index="indexMethod"
                  ></el-table-column>
                  <el-table-column
                    prop="date"
                    label="日期"
                    fixed="left"
                    min-width="100"
                    show-overflow-tooltip
                  ></el-table-column>
                      <el-table-column
                    prop="lastReadNum"
                    min-width="80"
                    fixed="left"
                    label="上期抄码"
                    align="right"
                  ></el-table-column>
                  <el-table-column
                    prop="curReadNum"
                    min-width="80"
                    fixed="left"
                    label="本期抄码"
                    align="right"
                  ></el-table-column>
                     <el-table-column
                    prop="checkWater"
                    label="校验水量"
                    align="right"
                  ></el-table-column>
                  <el-table-column
                    prop="waterNum"
                    label="水量"
                    align="right"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="useWaterType"
                    label="用水类型"
                  ></el-table-column>
                  <el-table-column
                    prop="receivableMoney"
                    label="应收金额"
                    align="right"
                  ></el-table-column>
                  <el-table-column
                    prop="basicPrice"
                    label="基本水价"
                    align="right"
                  ></el-table-column>
                  <el-table-column
                    prop="affair"
                    min-width="100"
                    label="IC事物"
                  ></el-table-column>
                  <el-table-column
                    prop="buyNum"
                    min-width="100"
                    label="IC购买次数"
                    align="right"
                  ></el-table-column>
               <el-table-column
                    prop="payStatus"
                    min-width="80"
                    label="缴费状态"
                  ></el-table-column>
                </el-table>
  </div>
</template>
<script>
export default {
    name: "ICHistoryList",
   props: ['data','wayOpen'],
  components:{
  },
  data() {
    return {
        maxHeight:"100%"
    }
  },
  methods:{
        indexMethod(index) {
      //获取表格序号
      return index + 1;
    },
  }

}
</script>
<style lang="scss" scoped>
.ICHistoryList {
  width: 100%;
  height: 100%;
}
</style>
