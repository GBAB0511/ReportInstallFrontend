<template>
  <div class="AccountPair">
    <!--<div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="模糊查询：">
          <el-tooltip class="item" effect="dark" content="客户编号、账户编号、用户编号" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>

          <el-button size="mini" class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>-->
    <el-row>
      <el-col :span="12">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent style="padding-left: 25px;padding-top: 15px">
          <el-form-item>
            <div>银行流水</div>
          </el-form-item>
          <el-form-item style="float: right;margin-right: 25px">
            <el-button size="mini" type="primary" @click="bankAdd" icon="el-icon-circle-plus" >添加</el-button>
          </el-form-item>
        </el-form>
        <div class="kl-table" :style="{ height: maxHeight + 'px' }">
          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="bankData" class="change-tables-table" >

            <el-table-column type="index" label="序号" width="50" fixed="left" >
            </el-table-column>

            <el-table-column prop="toBankName" min-width="250" label="入账银行名称">
            </el-table-column>

            <el-table-column prop="toAccountNo" min-width="200" label="入账银行账号">
            </el-table-column>

            <el-table-column prop="fromName" min-width="250" label="对方银行户名">
            </el-table-column>

            <el-table-column prop="dateTime" min-width="150" label="银行交易时间">
            </el-table-column>

            <el-table-column prop="amount" min-width="110" label="银行金额" align="right" header-align="left">
            </el-table-column>

            <el-table-column prop="accountPeriod" min-width="100" label="银行账期">
            </el-table-column>

            <el-table-column class="cell" label="操作" fixed="right" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" @click="delBankRow(scope.row)" size="mini" style="line-height: 9px">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent style="padding-left: 25px;padding-top: 15px">
          <el-form-item>
            <div>营收流水</div>
          </el-form-item>
          <el-form-item style="float: right;margin-right: 25px">
            <el-button size="mini" type="primary" @click="cssAdd" icon="el-icon-circle-plus" >添加</el-button>
          </el-form-item>
        </el-form>
        <div class="kl-table" :style="{ height: maxHeight + 'px' }">
          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="cssData" class="change-tables-table">

            <el-table-column type="index" label="序号" width="50" fixed="left" >
            </el-table-column>

            <el-table-column prop="cssInTypeName" min-width="100" label="营收入账类型">
            </el-table-column>

            <el-table-column prop="cssCtmno" min-width="250" label="营收用户名称">
            </el-table-column>

            <el-table-column prop="cssDateTime" min-width="150" label="营收交易时间">
            </el-table-column>

            <el-table-column prop="cssAmount" min-width="110" label="营收金额" align="right" header-align="left">
            </el-table-column>

            <el-table-column prop="cssAccountPeriod" min-width="100" label="营收账期">
            </el-table-column>

            <el-table-column class="cell" label="操作" fixed="right" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" @click="delCssRow(scope.row)" size="mini" style="line-height: 9px">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-col>
    </el-row>
     <el-dialog :title="title" :visible.sync="addVisible" v-if="addVisible" @close="closeDialog" :close-on-click-modal="false" class="button-dialog" append-to-body>
      <AddShow :accountPeriod="this.accountPeriod" :accountIds="accountIds" :cssIds="cssIds" :addType="addType" ref="AddShow"></AddShow>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="addRow">确 定</el-button>
        <el-button type="info" size="mini" @click="closeDialog">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddShow from "./AddShow";
export default {
  name: "AccountPair",
  props: ["accountPeriod","rowData","statusName"],
  components: {
    AddShow
  },
  data() {
    return {
      tableQuery: {
        page: 1,
        pageCount: 20,
      },
      tableShow: false,
      maxHeight: 0,
      // 添加银行/营收流水弹窗
      addVisible: false,
      title: "",
      addType: "",
      bankData: JSON.parse(JSON.stringify(this.rowData)),
      cssData: [],
      //银行ids
      accountIds: [],
      //营收ids
      cssIds: [],
    };
  },
  mounted() {
    this.rowData.forEach(item => {
      this.accountIds.push(item.id);
    })
    if (this.statusName == '自动配对' || this.statusName == '手动配对') {
      this.cssData = JSON.parse(JSON.stringify(this.rowData))
      this.rowData.forEach(item => {
        this.cssIds.push(item.id);
      })
    }
    //this.init();
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".AccountPair",[
      ".AccountPair .demo-form-inline",
    ]);
  },
  methods: {
    init() {
      // let companyInfo = localStorage.getItem("companyNo");
      // this.tableQuery.groupCode = companyInfo;
      // this.tableQuery.cssAccountPeriod = this.accountPeriod
      // let params = {
      //   busicode: "BillBalanceCss",
      //   data: this.tableQuery
      // };
      // this.$api
      //   .fetch({
      //     params: params //参数
      //   })
      //   .then(res => {
      //     this.pairData = res;
      //   });
    },

    bankAdd() {
      this.addVisible = true;
      this.title = "添加银行流水"
      this.addType = "bank"
    },
    cssAdd(){
      this.addVisible = true;
      this.title = "添加营收流水"
      this.addType = "css"
    },
    closeDialog(){
      this.addVisible = false
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    // 配对
    pairAccount(index, row) {
      let updateData={
        id:this.pairIndex,
        status:2,
        cssid:row.id,
        cssInType:row.cssInType,
        cssCtmno:row.cssCtmno,
        cssDateTime:row.cssDateTime,
        cssAmount:row.cssAmount,
        cssAccountPeriod: row.cssAccountPeriod,
      }
      let params = {
        busicode: "BillBalanceAccountUpdate",
        data: updateData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message:
               "配对成功！",
            type: "success"
          });
          this.$emit('closeDialog');
        });
    },
    addRow(){
      if (this.addType == 'bank') {
        let list = this.$refs.AddShow.bankSelectData;
        console.log(list);
        if (!this.bankData) {
          this.bankData = list
          list.forEach(element => {
            this.accountIds.push(element.id);
          });
        }else{
          list.forEach(element => {
            if (this.bankData.every(item => item.id !== element.id)) {
              this.bankData.push(element)
              this.accountIds.push(element.id);
            }
          });
        }
        // console.log(this.bankData);
        console.log(this.accountIds);
        this.closeDialog();
      }else{
        let list = this.$refs.AddShow.cssSelectData;
        if (!this.cssData) {
          this.cssData = list
          list.forEach(element => {
            this.cssIds.push(element.id);
          });
        }else{
          list.forEach(element => {
            if (this.cssData.every(item => item.id !== element.id)) {
              this.cssData.push(element)
              this.cssIds.push(element.id);
            }
          });
        }
        this.closeDialog();
      }
    },
    delBankRow(row){
      for (let i = 0; i < this.bankData.length; i++) {
        if (this.bankData[i].id == row.id) {
          this.bankData.splice(i,1)
        }
      }
      this.accountIds.forEach((item,index) => {
        if (item == row.id) {
          this.accountIds.splice(index,1)
        }
      })
      console.log(this.accountIds);
    },
    delCssRow(row){
      for (let i = 0; i < this.cssData.length; i++) {
        if (this.cssData[i].id == row.id) {
          this.cssData.splice(i,1)
        }
      }
      this.cssIds.forEach((item,index) => {
        if (item == row.id) {
          this.cssIds.splice(index,1)
        }
      })
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.AccountPair {
  width: 100%;
  height: 100%;
}
</style>
