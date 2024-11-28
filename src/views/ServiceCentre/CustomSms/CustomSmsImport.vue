
<template>
  <div class="CustomSmsImport">

    <div class="CustomSmsImportIndex">
      <div class="toolbar" style="outline:none" tabindex="0">
        <div class="left">
        <el-form :inline="true" size="mini" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableData.userNo" placeholder="请输入用户编号" clearable @keydown.enter.native="location"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" class="searchBtn" @click="location">定位</el-button>
          </el-form-item>
        </el-form>
        </div>
        <div class="right">
        <span style="font-size:14px">发送范围：</span>
        <el-radio @change="getCurrentSendType" v-model="sendType" label="1">勾选</el-radio>
        <el-radio @change="getCurrentSendType" v-model="sendType" label="2">全选</el-radio>
        <el-button size="mini" type="primary" @click="sending">发送</el-button>

        </div>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table stripe border highlight-current-row v-if="tableShow" :max-height="maxHeight" :row-class-name="rowClassName" :data="tableData" @row-click="handleTableCellClick" class="change-tables-table" ref="klTableData" :cell-style="cellStyle" @sort-change='getSort' @selection-change="handleSelect">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          
          <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed="left"></el-table-column>


          <el-table-column prop="userNo" min-width="130" label="用户编号" fixed="left"></el-table-column>

          <el-table-column prop="userPhone" min-width="130" label="发送手机号" fixed="left" show-overflow-tooltip></el-table-column>

        

          <el-table-column prop="ctmName" min-width="250" label="客户名称"></el-table-column>

          <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip></el-table-column>

          <el-table-column prop="content" min-width="300" label="短信内容" show-overflow-tooltip></el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[100, 200, 300]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "CustomSmsImport",
  props: ["booksVal"],
  components: {
    
  },
  data () {
    return {
      tableData:{
        userNo: "",
        userPhone: "",
        ctmName: "",
        ctmAddr: "",
        content: "",
      },
      // 存储当前查询的列表数据（不能变动）
      constTableData: [],
      formDataIndex: 0,//修改表单索引号
      formData: {
       // row: "",
        //id: "",
        //ctmName: "", //客户名称
        userNo: "", //用户编号
        //ctmAddr: "", //客户地址
        content: "", //短信内容
        userPhone: "", // 发送手机号
      },
      tableQuery: {
        //查询表单数据
        page: 1,
        pageCount: 100,
        userNo: "", //用户编号
        userPhone: "", //发送手机号
        ctmName: "",//客户名称
        ctmAddr: "", // 客户地址
        content: "", //短信内容

      },
      sendType: '', //发送范围
      selected: [],
      type: '',
      // 记录表格高度
      tableRowHeight: 0,
      //数据字典
      dictionaryData: [],
      
      
      //数据字典
      dictionaryData: [],
      maxHeight: 0,
      tableShow: false,
      enterMeterDataShow: false,
      enterMeterDate: "",
      
      attachmentData: [],
    };
  },
  mounted () {
    this.init();
    

    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".CustomSmsImportIndex", [
        ".CustomSmsImportIndex .toolbar",
        ".CustomSmsImportIndex .block"
      ]);
    });
  },
  methods: {
    search () {
      this.tableQuery.page = 1
      this.init()
    },
    //初始化
    init () {
      let _this = this;
       _this.tableData = this.booksVal;
      console.log(_this.tableData);
    },
    hidden () {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        $(".el-table--fit").css("height", "66%");
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
        $(".el-table--fit").css("height", "50%");
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".DataEntry-left", [
          ".DataEntry-left .toolbar",
          ".DataEntry-left .block"
        ]);
      });
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
    indexMethod (index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    
    getCurrentSendType () { //勾选
    },
    handleSelect (selection) {
      this.selected = selection
    },
    handleTableCellClick (row, cell, event) {
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.findIndex(item => item.userNo === row.userNo)
      var select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData[i])
      }
      if (this.selected.some(item => select.some(val => val.userNo === item.userNo))) { //取消该账期勾选
        this.handleSelect(this.selected.filter(item => select.every(val => val.userNo !== item.userNo)))
        select.forEach(item => {
          this.$refs.klTableData.toggleRowSelection(item, false);
        })
      } else { //恢复该账期勾选
        this.handleSelect(this.selected.concat(select))
        this.selected.concat(select).forEach(item => {
          this.$refs.klTableData.toggleRowSelection(item, true);
        })
      }
    },
    rowClassName ({ row, rowIndex }) {
      row.index = rowIndex; 
    },
    /* handleRowChange (row, column, event) {
      var data = JSON.parse(JSON.stringify(row));
      this.formDataIndex = row.index
      this.formData = data;
    }, */
    // 排序
    getSort (column) {
      //   if (sort.order === 'descending') {
      //     this.tableQuery.sortFlag = sort.prop + ' DESC';
      //   } else if (sort.order === 'ascending') {
      //     this.tableQuery.sortFlag = sort.prop + ' ASC';
      //   } else {
      //     this.tableQuery.sortFlag = '';
      //   }
      this.tableQuery.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery.sortOrder = 2
      } else {
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.init();
    },
    //定位
    location () {
      let _this = this
      let index = -1;
      this.$nextTick(() => {
        let tableRowHeight = $(".kl-table .el-table__body-wrapper .el-table__body .el-table__row").children(":last").height()
        this.tableRowHeight = tableRowHeight
      })
      if (this.tableData.userNo.length > 0) { // 用户编号
        console.log(this.tableData.userNo);
        this.tableData.forEach((item, i) => {
          if (this.tableData.userNo == item.userNo) {
            index = i;
            _this.$refs.klTableData.setCurrentRow(this.tableData[Number(i)]);
          }
        })
      }
      if (index != -1) {
        console.log(index);
        console.log(this.tableRowHeight);
        this.$refs.klTableData.bodyWrapper.scrollTop = this.tableRowHeight * (index + 1);
      }
    },

    sending () {
      console.log(this.sendType);
      var sendNotice = ''
      var sendUserList = ''
      //let state = false;
      if (!this.sendType) {
        this.$message.error('请选择发送范围')
        return
      }
      //let params = {}
      let ruleForm = JSON.parse(JSON.stringify(this.tableData))

      if (this.sendType == '1') { // 勾选
        if (this.selected.length === 0) {
          this.$message.error('请选择至少一条记录')
          //state = true;
          return
        }
        sendNotice = '该用户';
        //this.title = "短信模板-查看"
        //sendUserList = this.selected.map(item => item.userNo)
        ruleForm = this.selected
        ruleForm.forEach(function (item,index){
        delete ruleForm[index].ctmName
        delete ruleForm[index].ctmAddr
        delete ruleForm[index].index
      });
      } else if (this.sendType == '2') { // 全选
        if (this.tableData.total === 0) {
          this.$message.error('当前查询条件无记录，请更换条件重新查询')
          //state = true;
          return
        }
        sendNotice = '全部用户';
        //this.title = "短信模板-查看";
        //sendUserList = []
        ruleForm.forEach(function (item,index){
        delete ruleForm[index].ctmName
        delete ruleForm[index].ctmAddr
        delete ruleForm[index].index
      });
      }
      console.log(ruleForm);
      this.$confirm('是否对' + sendNotice + '发送【自定义】短信？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
        "busicode": "SendCustomSMS",
        "data": ruleForm
      }
      this.$api.fetch({
        params,
      }).then(res => {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '<p>短信已成功提交！</p><p class="attention">注意：短信发送时间较长，请勿重复提交，否则会导致用户收到重复短信</p>',
          type: 'success',
          offset: 250,
          duration: 4500,
          customClass: 'successTip',
        })
        this.tableQuery.page = 1
        this.init()
      })
    }).catch(() => {
      this.$message({
        message: '取消发送',
        type: 'info'
      })
    })
    },
    cellStyle (data) {
      return "cursor:pointer;"
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    // tableData: function() {
    //   this.$nextTick(function() {
    //     this.$refs.klTableData.setCurrentRow(this.tableData.list[0]);
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
.CustomSmsImport {
    width: 100%;
    height: 100%;
    .CustomSmsImportIndex {
        height: calc(100% - 40px);
    }
}
</style>
<style lang="scss">
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
</style>
