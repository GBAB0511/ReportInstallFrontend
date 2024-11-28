<template>
  <div class="FinancialManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="!historyShow">
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="FinancialManagementCon indexContent"  v-if="historyShow">
      <ul>
        <li>上次月结账日期：
          <span>{{formData.beginDate}}</span>
        </li>
        <li>本次月结账日期：
          <el-date-picker @change="init" v-model="formData.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </li>
      </ul>
      <p>本次账期{{formData.accountPeriod}}，本次预存余额为{{formData.accountBalance}}元，当前预存余额为{{formData.currAccountBalance}}元，请核对预收报表是否一致！</p>
      <h4>
        <el-button type="primary" @click="monthlyKnot">月结</el-button>
        <el-button type="primary" @click="history">历史查询</el-button>
      </h4>
    </div>
      <AccountPeriod class="indexContent" v-if="!historyShow"></AccountPeriod>
  </div>
</template>
<script>
import AccountPeriod from "./AccountPeriod";
export default {
  name: "FinancialManagement",
  components: {
    AccountPeriod
  },
  data() {
    return {
      closingDateOfMonth: '',
      crumbsData: {
        //面包屑
        titleList: [{ title: "收费管理" }, { title: "月结" }]
      },
      // 表单数据
      formData: {
        beginDate: '',
        endDate: '',
      },
      historyShow: true
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    // 查询预存金额
    init() {
      let _this = this;
      let params = {
        busicode: "FnLastMonthly",
        data: {
          "beginDate": this.formData.beginDate,
          "endDate": this.formData.endDate,
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res) {
            _this.formData = res
          }
        });
    },
    // 月结按钮
    monthlyKnot() {
      let _this = this
      this.$confirm('是否确认月结?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "FnMonthlySettle",
          data: {
            "beginDate": _this.formData.beginDate,
            "endDate": _this.formData.endDate,
            "accountBalance": _this.formData.currAccountBalance,
          }
        };
        _this.$api
          .fetch({
            params: params
          })
          .then(res => {
            _this.$message({
              type: 'success',
              message: '月结成功!'
            });
          });
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },


    // 历史查询按钮
    history() {
      this.historyShow = false;
    },
    closeDialog() {
      this.historyShow = true;
      this.crumbsData.titleList.splice(3, 1);
    }
  }
};
</script>
<style lang="scss">
.FinancialManagement {
  height: 100%;
  .FinancialManagementCon {
    width: 60%;
    margin: 20px auto;
    .el-date-editor{
      width: 160px;
      /deep/{
        .el-input__inner {
          width: 160px !important;
        }
      } 
    } 
    & > ul {
      padding: 20px;
      width: 100%;
      zoom: 1;
      &::after {
        display: block;
        content: "";
        clear: both;
      }
      & > li {
        width: 50%;
        text-align: center;
        float: left;
        font-size: 18px;
        line-height: 50px;
        &:first-of-type {
          color: #3680cd;
        }
      }
    }
    & > p {
      text-align: center;
      color: #555;
      font-size: 16px;
    }
    & > h4 {
      text-align: center;
      padding: 30px;
      .el-button--primary {
        padding: 12px 100px;
      }
    }
  }
}
</style>

