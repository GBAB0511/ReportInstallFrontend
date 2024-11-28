<template>
  <!-- 智能转账待销账 模块 -->
  <div class="IntelligentChargeOffs">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>

    <div v-if="indexShow" class="indexContent">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent label-width="80px">
          <el-form-item label="缴费日期：">
            <el-date-picker v-model="DateChoosevalue" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="进账银行：" class="width-150">
            <!-- <el-input v-model="tableQuery.payChannel" size="mini" clearable placeholder="进账银行"></el-input> -->
            <el-select clearable v-model="tableQuery.payChannel" placeholder="进账银行">
              <el-option v-for="(item,index) in incomeBankList" :key="index" :label="item.bankName+' '+item.bankAccount" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户编号：" class="width-150">
            <el-input v-model="tableQuery.userNo" size="mini" clearable placeholder="用户编号"></el-input>
          </el-form-item>
          <el-form-item label="状态：" class="width-150">
            <el-select v-model="tableQuery.status">
              <el-option v-for="(item, index) in statusDict" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" :highlight-current-row="true" border :data="tableData.list" class="change-tables-table" ref="table" :span-method="arraySpanMethod">
          <el-table-column prop="index" label="NO." width="50" fixed="left" align="center"></el-table-column>

          <el-table-column prop="chargeTime" min-width="150" label="缴费时间" align="center"></el-table-column>

          <el-table-column prop="payChannel" min-width="80" label="进账银行" align="center"></el-table-column>

          <el-table-column prop="totalMoney" min-width="80" label="缴费金额" align="right"></el-table-column>

          <el-table-column prop="serialNo" min-width="80" label="银行流水号" align="center"></el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" align="center"></el-table-column>

          <el-table-column prop="userName" min-width="200" label="用户名称" align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="status" min-width="80" label="处理状态" align="center"></el-table-column>

          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click.native="deal(scope.$index, scope.row)">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "IntelligentChargeOffs",
  components: {},
  data () {
    return {
      DateChoosevalue: [], //缴费日期
      indexShow: true,
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "智能转账待销账" }
        ]
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "", // 缴费开始时间
        endDate: "", // 缴费结束时间
        payChannel: "", //进账银行
        userNo: "", // 用户编号
        status: '', // 处理状态 
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      statusDict: [{ label: "全部", value: '' }, { label: "未处理", value: 0 }, { label: "已处理", value: 1 }],
      incomeBankList: [], // 进账银行
    };
  },
  mounted () {
    let time = new Date()
    time.setMonth(time.getMonth() - 1)
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    let time2 = new Date()
    let month2 = (time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1)
    let day2 = time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate()
    this.tableQuery.beginDate = `${time.getFullYear()}-${month}-${day}`
    this.tableQuery.endDate = `${time2.getFullYear()}-${month2}-${day2}`
    this.DateChoosevalue = [this.tableQuery.beginDate, this.tableQuery.endDate]
    this.getIncomeBankList();
    this.init();
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".IntelligentChargeOffs", [
      ".IntelligentChargeOffs .toolbar",
      ".IntelligentChargeOffs .block",
      '.IntelligentChargeOffs .bread-contain'
    ]);
  },
  methods: {
    init () {
      let params = {
        busicode: "FnTransferWaitCancelList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
          console.log('res', res)
          let data = [];
          for (let i = 0; i < res.list.length; i++) {
            let userList = res.list[i].userArray.split(',');
            console.log('userList', userList)
            if (userList.length > 0) {
              for (let x = 0; x < userList.length; x++) {
                let temp = JSON.parse(JSON.stringify(res.list[i]));
                temp.userNo = userList[x];
                temp.userName = res.list[i].users[x];
                temp.status = temp.status == 1 ? "已处理" : "未处理";
                console.log('temp', temp)
                data.push(temp)
              }
            }
          }
          console.log('data', data)
          // this.tableData.list = data;
          for (let x = data.length - 1; x > 0; x--) {
            if (!data[x].rowspan) {
              data[x].rowspan = 0;
            }
            if (data[x].id == data[x - 1].id) {
              if (data[x].rowspan == 0) {
                data[x].rowspan = 1;
              }
              data[x - 1].rowspan = data[x].rowspan + 1;
              data[x].rowspan = 0;
            } else {
              if (data[x].rowspan == 0) {
                data[x].rowspan = 1;
              }
            }
            if (!data[0].rowspan) {
              data[0].rowspan = 1;
            }
          }
          let index = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i].rowspan && data[i].rowspan > 0) {
              data[i].index = ++index
            }
          }
          this.tableData.list = data;
          this.$nextTick(() => {
            this.$refs.table.doLayout();
          })
        });
    },
    search () {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    // 处理
    deal (index, row) {
      this.$confirm('确认处理？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "FnTransferWaitCancel",
          data: {
            id: row.id
          }
        };
        console.log('deal', params)
        // return
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "处理成功！"
            })
            this.init();
          });

      }).catch(e => {
        this.$message({
          type: "info",
          message: "已取消处理"
        })
      })
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    getIncomeBankList () { //进账银行获取
      let _this = this;
      let params = {
        busicode: "IncomeBankList",
        data: { status: '1' },
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {
          this.incomeBankList = res.list;
        });
    },
    // 合并行
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === 'chargeTime' ||
        column.property === 'payChannel' ||
        column.property === 'serialNo' ||
        column.property === 'totalMoney' ||
        column.property === 'status' ||
        column.label === '操作' ||
        column.label === 'NO.'
      ) {
        if (row.rowspan != 0) {
          return {
            rowspan: row.rowspan || 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      console.log(row, column, rowIndex, columnIndex)
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
.IntelligentChargeOffs {
  width: 100%;
  height: 100%;
}
</style>
