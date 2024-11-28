<template>
  <div class="settlementCompile">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button v-if="(!showIndex)&&rowData.status === 1" size="mini" type="primary" @click="collect(rowData)">收款</el-button>
        <el-button v-if="rowData.processState=='' || rowData.processState == 'register'" size="mini" type="primary" @click="submitForm()">保存</el-button>
        <el-button v-if="!showIndex" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="pageIndex" v-if="showIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form inline size="mini" label-position="right" label-width="80px" class="multiple-floor">
          <el-form-item label="流程状态：" class="width-200">
            <el-select ref="select1" v-model="tableQuery.processState" clearable>
              <el-option v-for="item in processStateDict" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据日期：" class="width-250">
            <el-date-picker type="daterange" value-format='yyyy-MM-dd' v-model="date"></el-date-picker>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
          <el-form-item label="工程编号：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.pjBillNo" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="工程名称：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.pjName" placeholder="" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row ref="table" stripe border :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
              <el-button type="text" size="mini" style="color: red;" v-if="scope.row.processState === '' || scope.row.processState === 'register'" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="processName" min-width="80" label="流程状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.processName === ''" style="color: #000">草稿</span>
              <span v-else style="color: #000">{{scope.row.processName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="billNo" min-width="100" label="单据编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billDate" min-width="80" label="单据日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="consultBillNo" min-width="100" label="工程编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="consultName" min-width="150" label="工程名称" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>

    <settlementCompileUpdate ref="settlementCompileUpdate" v-else :id="detailId" :data="rowData" :editData="editData" :dict="dictionaryData" :disabled="rowData.processState!=='' && rowData.processState!=='register'"></settlementCompileUpdate>

    <!-- <pjCollectDialog :data="rowData" @success="showIndex? init():closeDialog()" ref="pjCollectDialog"></pjCollectDialog> -->
  </div>
</template>

<script>
import settlementCompileUpdate from './settlementCompileUpdate.vue';
// import pjCollectDialog from './pjCollectDialog.vue';

export default {
  components: { settlementCompileUpdate },
  data () {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "工程管理" },
          { title: "用户工程" },
          { title: "编制结算" }
        ]
      },
      tableQuery: {
        processState: "",
        startTime: "",
        endTime: "",
        page: 1,
        pageCount: 20
      },
      date: [],
      isActive: false,
      tableData: {
        list: [],
        total: 0
      },
      rowData: {},
      money: ' - ',
      showIndex: true,
      maxHeight: 0,
      dictionaryData: {},
      detailShow: false,
      detailId: '',
      selected: [],
      processStateDict: [{
        value: 'processing',
        name: '审核中'
      }, {
        value: 'end',
        name: '已结束'
      }],
      editData: {},
    }
  },
  mounted () {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    const twoMonthAgo = month < 2 ? (year - 1).toString() + '-' + (12 - (Math.abs(month - 1) % 12)) + '-' + day : (year.toString() + '-' + (month === 11 ? '' : '0') + (month - 1)) + '-' + day
    this.date = [twoMonthAgo, this.common.date()];
    this.tableQuery.startTime = twoMonthAgo
    this.tableQuery.endTime = this.common.date()
    this.getDictionary()
    this.init()
    this.$nextTick(() => {
      this.common.changeTable(this, ".settlementCompile", [
        ".settlementCompile .toolbar",
        ".settlementCompile .bread-contain",
        ".settlementCompile .toggle-btn",
        ".settlementCompile .block"
      ]);
    })
  },
  methods: {
    incr_date(date_str){
      var parts = date_str.split("-");
      var dt = new Date(
        parseInt(parts[0], 10),      // year
        parseInt(parts[1], 10) - 1,  // month (starts with 0)
        parseInt(parts[2], 10)       // date
      );
      dt.setDate(dt.getDate() + 1);
      parts[0] = "" + dt.getFullYear();
      parts[1] = "" + (dt.getMonth() + 1);
      if (parts[1].length < 2) {
        parts[1] = "0" + parts[1];
      }
      parts[2] = "" + dt.getDate();
      if (parts[2].length < 2) {
        parts[2] = "0" + parts[2];
      }
      return parts.join("-");
},
    changeDate(){
      let startDate=this.date[0]
      let endDate=this.date[1]
      this.date[1]=this.incr_date(endDate)

    },
    submitForm(){
      this.$nextTick(() => {
        this.$refs.settlementCompileUpdate.submitForm();
      })
    },
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    init () {
      var _this = this
      var params = {
        "busicode": "PjSettlemetList",
        "data": this.tableQuery
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData= res
      })
    },
    formatDate (value) {
      console.log('-----------');
      var date = new Date(value);
      var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
      if (m < 10) { m = '0' + m; }
      if (d < 10) { d = '0' + d; }
      if (h < 10) { h = '0' + h; }
      if (i < 10) { i = '0' + i; }
      if (s < 10) { s = '0' + s; }
      var t = y + '-' + m + '-' + d + ' ';
      //console.log('t',t);
      return t;
    },
    search () {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    test () {
      this.$nextTick(() => {
        this.detailShow = true
      })
      this.showIndex = false
    },
    // 数据字典数据获取
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PROJECT_PAYMENT_STATUS,BPT,PBT"
        //收款状态
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
        console.log('_this.dictionaryData', _this.dictionaryData)
      })
    },
    hidden () {
      this.isActive = !this.isActive
      this.$nextTick(() => {
        this.common.changeTable(this, ".settlementCompile", [
          ".settlementCompile .toolbar",
          ".settlementCompile .bread-contain",
          ".settlementCompile .toggle-btn",
          ".settlementCompile .block"
        ]);
      })
    },
    closeDialog () {
      this.showIndex = true
      this.init()
    },
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    back () {
      this.detailShow = false
    },
    detail (rowData) {
      this.detailId = rowData.id;
      this.rowData = Object.assign({}, rowData);
      this.$nextTick(() => {
        this.detailShow = true
      })
      this.showIndex = false
    },
    del (rowData) {
     this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          let params = {
            busicode: "PjSettlemetDelete",
            data: { id: rowData.id }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.search();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    collect (rowData) {
      this.rowData = Object.assign({}, rowData);
      this.$nextTick(() => {
        this.$refs.pjCollectDialog.pjCollectShow();
      })

    },
    submit () {
      this.$refs.add.submit()
    },
    close () {
      this.back()
      this.init()
    },
    handleSelection (selection) {
      this.selected = selection
    },
  },
  watch: {
    date (val) {
      if (val && val.length > 0) {
        this.tableQuery.startTime = val[0]
        this.tableQuery.endTime = val[1]
      } else {
        this.tableQuery.startTime = ''
        this.tableQuery.endTime = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.settlementCompile {
  height: 100%;
}
.kl-table {
  margin-top: 15px;
}
</style>
