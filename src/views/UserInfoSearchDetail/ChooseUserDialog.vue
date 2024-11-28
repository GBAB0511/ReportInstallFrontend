<template>
  <el-dialog :visible.sync="show" title="选择用户" class="button-dialog">
    <div class="kl-table">
      <el-table :data="tableData" height="100%" stripe border @cell-dblclick="handleDbclick">
        <el-table-column label="册本号" prop="bookNo" min-width="100" ></el-table-column>
        <el-table-column label="缴费方式" prop="payWay" min-width="80"></el-table-column>
        <el-table-column label="用户状态" prop="status" min-width="80"></el-table-column>
        <el-table-column label="户号" prop="userNo" min-width="100"></el-table-column>
        <el-table-column label="户名" prop="ctmName" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="装表地址" prop="setupMeterAddr" min-width="260" show-overflow-tooltip></el-table-column>
        <el-table-column label="身份证" prop="certNo" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="固定电话" prop="linkTel" min-width="105" show-overflow-tooltip></el-table-column>
        <el-table-column label="手机" prop="mobile" min-width="105"></el-table-column>
      </el-table>
    </div>

  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      tableData: [],
      show: false
    }
  },
  methods: {
    open(data) {
      this.tableData = data
      this.show = true
    },
    handleDbclick(row, column) {
      this.$emit('submit', row)
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.button-dialog {
  .kl-table {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
