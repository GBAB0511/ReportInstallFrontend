<template>
  <div class="UnionPayEdit">
    <div class="toolbar"></div>
    <div class="kl-table">
      <el-table
        v-if="tableShow"
        :max-height="maxHeight"
        stripe
        border
        :data="tableData"
        highlight-current-row
        class="change-tables-table"
      >
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

        <el-table-column prop="userNo" min-width="100" label="用户编号"></el-table-column>

        <el-table-column prop="ctmName" min-width="100" label="客户名称"></el-table-column>

        <el-table-column prop="serialNo" min-width="150" label="流水号"></el-table-column>

        <el-table-column prop="payMoney" min-width="80" label="支付金额" align="right"></el-table-column>

        <el-table-column prop="priorPeriodMoney" min-width="80" label="上期余额" align="right"></el-table-column>

        <el-table-column prop="chargingMoney" min-width="80" label="销账金额" align="right"></el-table-column>

        <el-table-column prop="serviceCharge" min-width="100" label="手续费" align="right"></el-table-column>

        <el-table-column prop="payTime" min-width="150" label="缴费时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "UnionPayEdit",
  props: ["formStute"],
  data() {
    return {
      tableShow: false,
      maxHeight: 0,
      tableData: []
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".UnionPayEdit", [
      ".UnionPayEdit .toolbar",
      ".UnionPayEdit .block"
    ]);
  },
  methods: {
    init() {
      let params = {
        busicode: "FnAlipayQuery",
        data: {
          id: this.formStute.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        });
    },

    indexMethod(index) {
      //获取表格序号
      return index + 1;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
.UnionPayEdit {
  width: 100%;
  height: 100%;
}
</style>