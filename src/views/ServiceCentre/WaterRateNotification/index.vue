<template>
  <div class="water-rate">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="sendingAll">全部发送</el-button>
        <el-button size="mini" type="primary" @click="sending">发送</el-button>
      </div>
    </div>
    <div class="waterRateIndex" v-if="IndexShow">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <el-form-item label="账期：" label-width="70px">
            <el-date-picker size="mini" v-model="tableQuery.sendMonth" type="month" format="yyyy-MM" value-format="yyyyMM" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="抄表日期：">
            <el-date-picker size="mini" v-model="tableQuery.meterReadingDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="抄表日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="用户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" size="mini" placeholder="用户编号" @keydown.enter.native="init" clearable />
          </el-form-item>
          <el-form-item label="册本号：" class="multiInput" label-width="60px">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.startBookNo" size="mini" placeholder="起始号码" @keydown.enter.native="init" clearable />
            <span>至</span>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endBookNo" size="mini" placeholder="结束号码" @keydown.enter.native="init" clearable />
          </el-form-item>
          <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaOptions" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="用水类型：" class="width-150">
            <el-cascader v-model="tableQuery.waterPriceId" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props">
            </el-cascader>
          </el-form-item>
          <!-- <el-form-item label="缴费类型：">
            <el-select ref="select1" v-model="tableQuery.payMethod" clearable size="mini">
              <el-option v-for="item in dictionaryData.BPC" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="发送状态：">
            <el-select ref="select2" v-model="tableQuery.billNoticeMessageState" clearable size="mini">
              <el-option v-for="item in messageStateOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开账日期：" class="dateAndTime">
            <el-date-picker v-model="openAccountTimeRange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="起始日期" end-placeholder="截至日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="抄表员：">
            <el-select ref="select3" v-model="tableQuery.meterReadingStaffAccount" placeholder="请选择" clearable @keydown.enter.native="search">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="tableQuery.excludeInvalidMobile">
              <el-checkbox label='1'>显示有效号码</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="init" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row ref="table" v-if="tableShow" @sort-change='sortChange' :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" @selection-change="handleSelect" @row-click="handleTableCellClick" :cell-style="cellStyle">
          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod" />
          <el-table-column type="selection" />
          <el-table-column prop="billNoticeMessageState" label="是否发送" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="110" :formatter="messageStateFormat" />
          <el-table-column prop="billNoticeTime" label="发送时间" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="140" />
          <el-table-column prop="userNo" label="用户编号" min-width="140" />
          <el-table-column prop="userName" label="用户名称" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="230" show-overflow-tooltip />
          <el-table-column prop="ctmAddr" label="客户地址" min-width="250" show-overflow-tooltip />
          <el-table-column prop="openAccountTime" min-width="160" label="开账日期" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="businessArea" min-width="160" label="营业区域" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="monthId" label="账期" min-width="80" />
          <el-table-column prop="waterNum" label="用水量" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="90" align="right" />
          <el-table-column prop="totalFee" label="应收" min-width="80" align="right" />
          <el-table-column prop="mobile" label="手机号码" min-width="120" />

          <template v-for='(col) in costList'>
            <el-table-column show-overflow-tooltip :prop="col.costNameEn" :label="col.costName" :key="col.costNo" v-if="col.costName.length>0 && col.costName !== '基本水费'" min-width="120" align="right" >
            </el-table-column>
            <el-table-column show-overflow-tooltip :prop="col.costNameEn" :label="col.costName" :key="col.costNo" :sort-orders="['descending','ascending',null]" :sortable="'custom'" v-else-if="col.costName.length>0 && col.costName == '基本水费'" min-width="120" align="right" >
            </el-table-column>
          </template>
          <el-table-column v-if="lj" prop="ljclf" label="垃圾处理费" min-width="100" align="right" />
          <el-table-column prop="priorNum" label="上次行度" min-width="100" align="right" />
          <el-table-column prop="currentNum" label="本次行度" min-width="100" align="right" />
          <el-table-column prop="priorDate" label="上期抄表日" min-width="100" />
          <el-table-column prop="currentDate" label="本期抄表日" min-width="100" />

          <el-table-column prop="meterReadingStaffName" label="抄表员" min-width="100" />
          <el-table-column prop="notificationSender" label="发送人" min-width="120" />
        </el-table>

      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="messageContentDia" :title="title" width="50%" center :show-close="false" :close-on-click-modal="false">
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
  data () {
    return {
      crumbsData: {
        titleList: [
          { title: "客户通知" },
          { title: "短信通知" },
          { title: "水费通知" }
        ]
      },
      IndexShow: true,
      openAccountTimeRange: [],
      tableQuery: {
        page: 1,
        pageCount: 20,
        openAccountStartTime: '',
        openAccountEndTime: '',
        sortOrder: '',
        sortField: '',
        sendMonth: this.common.date('month'),
        meterReadingDate: '',
        userNo: '',
        startBookNo: '',
        endBookNo: '',
        excludeInvalidMobile: [],
        // payMethod: '',
        businessArea: '',
        waterPriceId: '',
        billNoticeMessageState: '',
        flag: 0,
        meterReadingStaffAccount: '',
      },
      // 抄表员下拉选择数据
      postUsers: [],
      dataList: [],
      tableShow: true,
      maxHeight: 0,
      tableData: {
        list: [],
        total: 0
      },
      businessAreaOptions: [],
      useWaterTypeOptions: [],
      dictionaryData: [],
      messageStateOptions: [
        {
          name: '未发',
          id: 0
        },
        {
          name: '已发',
          id: 1
        },
        {
          name: '发送成功',
          id: 2
        },
        {
          name: '发送失败',
          id: 3
        }
      ],
      props: {//树结构格式
        //树结构格式
        value: "code",
        label: "name",
        checkStrictly: true,
        emitPath: false,
      },
      selected: [],
      lj: null,
      costList: [],
      messageContentDia: false, // 发送确认弹窗
      messageContent: "", // 短信模板
      sendType: '', // 发送类型（发送check 或 全部发送all）
      title: '', // 发送弹窗标题
      confirmBtnShow: false, // 确认按钮的显示隐藏
    }
  },
  created () {
    this.init()
    this.selectBAreaOptions()
    this.getPostUser();
    this.getDictionary()
    this.SelectUseWaterTypeOptions()
    this.getInvoiceCostsAndTypes();
    this.getDynamicCostsColumn()
    this.$nextTick(() => {
      this.common.changeTable(this, ".waterRateIndex", [
        ".waterRateIndex .toolbar",
        ".waterRateIndex .block"
      ]);
    })
  },
  methods: {

    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
      }
    },
    init () {
      if (this.tableQuery.excludeInvalidMobile.length == 0) {
        this.tableQuery.excludeInvalidMobile = ['0']
      } else if (this.tableQuery.excludeInvalidMobile.length > 1) {
        this.tableQuery.excludeInvalidMobile = ['1']
      }
      if (this.openAccountTimeRange == null) {
        this.tableQuery.openAccountStartTime = '';
        this.tableQuery.openAccountEndTime = '';
      } else {
        this.tableQuery.openAccountStartTime = this.openAccountTimeRange[0];
        this.tableQuery.openAccountEndTime = this.openAccountTimeRange[1];
      }
      let params = {
        busicode: "BillNoticeList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
          this.selected = []
        })
        .catch(() => {
          this.tableData = {
            list: [],
            total: 0
          }
          this.selected = []
        })
    },
    sortChange (column) {
      this.tableQuery.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery.sortOrder = 2
      } else {
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.init()
    },
    getPostUser () {
      const params = {
        busicode: 'PostUserSelect',
        data: {
          postNo: '2'
        }
      }
      this.$api.fetch({
        params
      }).then(res => {
        this.postUsers = res
      })
    },
    // 获取费用及票据类型
    getInvoiceCostsAndTypes () {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        // let cost = []
        this.lj = res.ljclf
        // let lj = res.ljclf
        // res.costList.forEach((item)=>{
        //   if(!lj || lj.indexOf(item.costNameEn)==-1){
        //     cost.push(item)
        //   }
        // })
        // this.costList=cost

      })
    },
    // 获取费用及票据类型列
    getDynamicCostsColumn () {
      let _this = this;
      let params = {
        busicode: "CostListYW",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        let cost = []
        console.log(res)
        // this.lj=res.ljclf
        let lj = res.ljclf
        res.forEach((item) => {
          if (!lj || lj.indexOf(item.costNameEn) == -1) {
            cost.push(item)
          }
        })
        this.costList = res

      })
    },
    //营业区域
    selectBAreaOptions () {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        this.businessAreaOptions = data.children;
      })
    },
    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    // 数据字典数据获取
    getDictionary () {
      var params = {
        busicode: "DictionarySelect",
        data: "BPC" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.dictionaryData = res;
        });
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions () {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
      })
    },
    //树结构数据处理
    getArr (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    handleSelect (selection) {
      this.selected = selection
    },
    handleTableCellClick (row, cell, event) {
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.list.findIndex(item => item.meter_reading_id === row.meter_reading_id)
      var select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if (this.selected.some(item => select.some(val => val.meter_reading_id === item.meter_reading_id))) { //取消该账期勾选
        this.handleSelect(this.selected.filter(item => select.every(val => val.meter_reading_id !== item.meter_reading_id)))
        select.forEach(item => {
          this.$refs.table.toggleRowSelection(item, false);
        })
      } else { //恢复该账期勾选
        this.handleSelect(this.selected.concat(select))
        this.selected.concat(select).forEach(item => {
          this.$refs.table.toggleRowSelection(item, true);
        })
      }
    },
    cellStyle (data) {
      return "cursor:pointer;"
    },
    sending () {
      if (this.selected.length === 0) {
        this.$message.error('请选择至少一条记录')
        return
      }
      this.sendType = 'check';
      this.title = "短信模板-查看"
      this.messageContentDia = true;
      let params = {
        busicode: 'BillNoticeMessageContent',
        data: {
          ...this.tableQuery,
          masTemplateId: '6049cff330611a5e28c8b4a0',
          userNoList: this.selected.map(item => item.userNo),
          meterReadingList:this.selected.map(item=>item.meter_reading_id),
        }
      }
      this.$nextTick(() => {
        this.$api.fetch({ params }).then(res => {
          this.messageContent = res;
          if(res != ""){
              this.confirmBtnShow = true
          }
        })
      })
    },
    confirmSend () {
      let params = {};
      if (this.sendType == "all") { // 全部发送
        params = {
          "busicode": "BillNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '6049cff330611a5e28c8b4a0',
            userNoList: []
          }
        }
        console.log('全部发送', params)
      } else { // 勾选发送
        params = {
          "busicode": "BillNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '6049cff330611a5e28c8b4a0',
            userNoList: this.selected.map(item => item.userNo),
            meterReadingList:this.selected.map(item=>item.meter_reading_id),
          }
        }
        console.log('发送', params)
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '<p>短信已成功提交！</p><p class="attention">注意：短信发送时间较长，请勿重复提交，否则会导致用户收到重复短信</p>',
          type: 'success',
          offset: 250,
          duration: 4500,
          customClass: 'successTip',
        })
        this.messageContentDia = false;
        this.confirmBtnShow = false;
        this.messageContent = "";
        this.sendType = "";
        this.title = "";
        this.tableQuery.page = 1
        this.init()
      })
    },
    messageContentDiaClose () {
      this.messageContentDia = false;
      this.messageContent = "";
      this.sendType = "";
      this.title = "";
      this.confirmBtnShow = false;
      this.$message({
        type: 'info',
        message: "已取消发送"
      })
    },
    sendingAll () {
      if (this.tableData.total === 0) {
        this.$message.error('当前查询条件无记录，请更换条件重新查询')
        return
      }
      this.sendType = 'all';
      this.title = "短信模板-查看"
      this.messageContentDia = true;
      let params = {
        busicode: 'BillNoticeMessageContent',
        "data": {
          ...this.tableQuery,
          masTemplateId: '6049cff330611a5e28c8b4a0',
          userNoList: []
        }
      }
      this.$nextTick(() => {
        this.$api.fetch({ params }).then(res => {
          this.messageContent = res;
          if(res != ""){
              this.confirmBtnShow = true
          }
        })
      })
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
    indexMethod (index) {
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    messageStateFormat (row, column) {
      const arr = ['未发', '已发', '发送成功', '发送失败']
      return arr[row[column.property]]
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.water-rate {
  height: 100%;
  .waterRateIndex {
    height: calc(100% - 40px);
  }
}
.dateAndTime {
  .el-form-item__content {
    // width: 75%;
    .el-date-editor {
      width: 360px;
    }
  }
}
.multiInput {
  width: 330px;
  .el-input {
    width: 120px !important;
  }
}
.messageContent {
  min-height: 50px;
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
