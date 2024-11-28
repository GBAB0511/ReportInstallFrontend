<template>
  <div class="UnionPayHandle">
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

        <el-table-column prop="serialNo" min-width="100" label="流水号"></el-table-column>

        <el-table-column prop="payMoney" min-width="80" label="支付金额" align="right"></el-table-column>

        <el-table-column prop="priorPeriodMoney" min-width="80" label="上期余额" align="right"></el-table-column>

        <el-table-column prop="chargingMoney" min-width="80" label="销账金额" align="right"></el-table-column>

        <el-table-column prop="serviceCharge" min-width="80" label="手续费" align="right"></el-table-column>

        <el-table-column prop="payTime" min-width="80" label="支付时间"></el-table-column>

        <el-table-column prop="abnormalComments" min-width="120" label="异常原因"></el-table-column>

        

        <el-table-column prop="handleWay" min-width="80" label="处理方式"></el-table-column>

        <el-table-column prop="handleTime" min-width="70" label="处理时间"></el-table-column>

        <el-table-column prop="handleStaff" min-width="60" label="处理人"></el-table-column>

        <el-table-column class="cell" label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-show="scope.row.abnormalFlag==='1' && scope.row.handleTime==''"
              @click.native="transferDeposit(scope.$index, scope.row)"
            >转预存</el-button>
            <span v-show="scope.row.abnormalFlag==='1' && scope.row.handleTime==''">|</span>
            <!-- <el-button
              type="text"
              v-show="scope.row.abnormalFlag==='1' && scope.row.handleTime==''"
              @click.native="refund(scope.$index, scope.row)"
            >退费</el-button> -->
            <span v-show="scope.row.abnormalFlag==='2' && scope.row.handleTime==''">|</span>
            <el-button
              type="text"
              v-show="scope.row.abnormalFlag==='2' && scope.row.handleTime==''"
              @click.native="cancellationCharges(scope.$index, scope.row)"
            >取消收费</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "UnionPayHandle",
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

    this.common.changeTable(this, ".UnionPayHandle", [
      ".UnionPayHandle .toolbar",
      ".UnionPayHandle .block"
    ]);
  },
  methods: {
    init() {
      let params = {
        busicode: "FnAlipayHandleList",
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
    },
    //转预存
    transferDeposit(index, row) {
      let params = {
        busicode: "FnAlipayStored",
        data: {
          id: row.id
        }
      };
      this.$api.fetch({ params: params }).then(res => {
        this.init();
      });
    },
    //退费
    refund(index, row) {
      let params = {
        busicode: "FnAlipayRefund",
        data: {
          serialNo: row.serialNo
        }
      };
      this.$api.fetch({ params: params }).then(res => {
        this.init();
      });
    },
    //取消收费
    cancellationCharges(index, row) {
      let params = {
        busicode: "FnAlipayCancle",
        data: {
          id: row.id
        }
      };
      this.$api.fetch({ params: params }).then(res => {
        this.init();
      });
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
.UnionPayHandle {
  width: 100%;
  height: 100%;
}
</style>