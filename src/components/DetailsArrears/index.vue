<template>
  <div class="DetailsArrears">
    <el-table stripe border :data="tableData" class="change-tables-table">
      <el-table-column type="index" label="NO." width="50" fixed="left"></el-table-column>

      <el-table-column prop="accountPeriod" min-width="150" label="账期"></el-table-column>

      <el-table-column prop="costName" min-width="100" label="费用名称"></el-table-column>

      <el-table-column prop="calculateWater" min-width="180" label="计量水量/m³"></el-table-column>

      <el-table-column prop="receivableMoney" min-width="180" label="应收金额/元"></el-table-column>

      <el-table-column prop="penaltyMoney" min-width="180" label="实收违约金/元"></el-table-column>

      <el-table-column prop="totalMoney" min-width="180" label="合计/元"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "DetailsArrears",
  props: ["formData"],
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let params = {
        busicode: "ChargeLackDetail",
        data: {
          userNo: this.formData.userNo
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.tableData = res;
          this.$parent.DetailsArrearsShow = true;
        });
    }
  }
};
</script>
<style lang="scss">
.DetailsArrears {
  padding: 10px 20px;
  .el-table {
    b {
      color: red;
    }
  }
}
</style>
