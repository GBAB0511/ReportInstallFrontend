<template>
  <div class="bankDetails">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="销账标记：">
          <el-select clearable v-model="tableQuery.chargingFlag" placeholder="全部" @change="init">
            <el-option v-for="(item,index) in chargingFlagOptions" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="模糊查询：">
          <el-tooltip class="item" effect="dark" content="用户编号/客户名称/开户行/银行账户" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" class="searchInput" placeholder="" clearable></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item>
          <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @selection-change="selectChange" class="change-tables-table">

        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="accountNo" min-width="100" label="用户编号">
        </el-table-column>

        <el-table-column prop="ctmName" min-width="80" label="客户名称">
        </el-table-column>

        <el-table-column prop="bankName" min-width="180" label="开户行">
        </el-table-column>

        <el-table-column prop="bankAccountName" min-width="100" label="开户名">
        </el-table-column>

        <el-table-column prop="bankAccount" min-width="180" label="银行账号">
        </el-table-column>

        <el-table-column prop="amountMoney" min-width="80" label="合计" align="right">
        </el-table-column>

        <el-table-column prop="amount" min-width="80" label="笔数" align="right">
        </el-table-column>

        <el-table-column prop="chargingFlag" min-width="100" label="销账标记">
        </el-table-column>

        <el-table-column prop="result" min-width="200" label="结果">
        </el-table-column>

      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          ></el-pagination>
      </div>
      <el-dialog :visible.sync="messageContentDia" title="短信模板-查看" width="50%" center :show-close="false" :close-on-click-modal="false">
      <div class="messageContent">{{messageContent}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageContentDiaClose" size="mini">关 闭</el-button>
        <el-button type="primary" @click="confirmSend" size="mini">确认发送</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "bankDetails",
  props: ['idCuster'],
  data() {
    return {
      tableQuery: {        
        "page": 1,
        "pageCount": 20,
        "bankOutInId": "",
        "chargingFlag": "",
        "fuzzyQuery":""
       },
      chargingFlagOptions: [
        {name: '是', value: '1'},
        {name: '否', value: '0'},
      ],
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      selectData: [], 
      messageContentDia: false,
      messageContent: "",
      sendParams: {},
    };
  },
  mounted() {
      this.tableQuery.bankOutInId = this.idCuster 
      console.log();
      
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".BankCharges ", [
      ".BankCharges .toolbar",
      ".BankCharges .block",
    ]);
  },
  methods: {
    init() {
       this.idCuster 
      let params = {
        busicode: "FnBankDetailList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        });
    },
    demand() {
      //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    //   导出
    exportExcel() {
        let params = {
          "busicode": "FnBankDetailExport",
          "data": this.tableQuery,
          // token: 'krrjdev123',
          token: sessionStorage.getItem('token'),
          sysType: '002'
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
        },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      
    },
    selectChange(val){
      this.selectData = val;
    },
    sendMsg(){
        let type = this.$parent.sendType;
        if(this.tableQuery.chargingFlag == ""){
            this.$message({
                type: 'warning',
                message: "请选择销账标记"
            })
            return;
        }
        let queryParams = {}
        if(type == '1'){ // 勾选
          if(this.selectData.length == 0){
              this.$message({
                  type: 'warning',
                  message: "请选择发送的用户",
              })
              return;
          }
          queryParams = {
            busicode: "WithholdingShortMessageContent",
            data: {
                listUserNos: this.selectData.map(item => { return item.id }),
                chargingFlag: this.tableQuery.chargingFlag,
                bankOutInId: this.tableQuery.bankOutInId
            }
          }
        }else if(type == '2'){ // 全部发送
          if(this.tableData.total == 0){
            this.$message({
                  type: 'warning',
                  message: "当前查询条件无记录，请更换条件重新查询",
            })
            return;
          }
          queryParams = {
            busicode: "WithholdingShortMessageContent",
            data: this.tableQuery
          }
        }else{
            this.$message({
                  type: 'warning',
                  message: "请选择发送范围",
            })
            return;
        }
        this.$api.fetch({params: queryParams}).then(res => {
            // if(res && res != ""){
                this.messageContentDia = true;
                this.messageContent = res;
                this.sendParams = queryParams;
            // }
            // else{
            //   this.$message({
            //     type: 'warning',
            //     message: "短信模板为空！",
            //   })
            // }
        })
    },
    messageContentDiaClose () {
      this.messageContentDia = false;
      this.messageContent = "";
      this.title = "";
      this.$message({
        type: 'info',
        message: "已取消发送"
      })
    },
    // 确定发送
    confirmSend(){
      this.sendParams.busicode = "WithholdingShortMessage"; // 发送接口
      this.$api.fetch({
            params:this.sendParams
        }).then(res => {
          console.log(res);
          this.sendParams = {};
          this.messageContentDia = false;
          this.messageContent = "";
          this.$message({
            dangerouslyUseHTMLString: true,
            message: '<p>短信已成功提交！</p><p class="attention">注意：短信发送时间较长，请勿重复提交，否则会导致用户收到重复短信</p>',
            type: 'success',
            offset: 250,
            duration: 4500,
            customClass: 'successTip',
          });
      })
    },
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
.BankCharges {
  width: 100%;
  height: calc(100% - 41px);
  .successTip {
  font-size: 20px;
  .el-message__content {
    p {
      margin: 10px 5px;
      font-size: 16px;
      font-weight: 600;
    }
    .attention {
      color: #f56c6c;
    }
  }
}
}
</style>