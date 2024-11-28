<template>
  <div class="ArrearsStopWater">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <!-- <el-button size="mini" type="primary" @click="sendingAllPause">全部发送-暂停服务</el-button> -->
        <span style="font-size:14px">发送范围：</span>
        <el-radio @change="getCurrentSendType" v-model="sendType" label="1">勾选</el-radio>
        <el-radio @change="getCurrentSendType" v-model="sendType" label="2">全选</el-radio>
        <el-button size="mini" type="primary" @click="sendingPause">发送欠费停水通知</el-button>

      </div>
    </div>
    <div class="oweWorthIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <el-form-item label="截至账期：">
            <el-date-picker size="mini" v-model="tableQuery.endMonth" type="month" format="yyyy-MM" value-format="yyyyMM" unlink-panels :clearable="false"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="费用类型：">
            <el-select ref="select1" v-model="tableQuery.costNo" clearable size="mini">
              <el-option v-for="item in costOptions" :key="item.costNo" :label="item.costName" :value="item.costNo"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="缴费方式：">
            <el-select ref="select2" v-model="tableQuery.payMethod" clearable size="mini">
              <el-option v-for="item in dictionaryData.BPC" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="抄表周期：" class="width-160">
            <el-select ref="select4" v-model="tableQuery.meterReadingCycle" clearable size="mini">
              <el-option v-for="item in readCycleOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业区域：" class="width-160">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaOptions" :show-all-levels="false" :props="props1">
            </el-cascader>
          </el-form-item>
          <el-form-item label="抄表员：" class="width-160">
            <el-select ref="select3" v-model="tableQuery.meterReadingStaffName" size="mini" clearable>
              <el-option v-for="item in meterReaderList" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="册本：" class="width-160">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="册本" clearable @keydown.enter.native="init" />
          </el-form-item>
          <el-form-item label="用水类型：" class="width-160">
            <el-cascader v-model="tableQuery.waterPriceId" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="笔数≥" class="width-160">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.count" :controls="false" clearable @keydown.enter.native="init" placeholder="笔数" />
          </el-form-item>
          <el-form-item label="欠费≥" class="width-160">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.arrears" :controls="false" clearable @keydown.enter.native="init" placeholder="欠费" />
          </el-form-item>
          <el-form-item label="户号：" class="multiInput">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.beginUserNo" size="mini" placeholder="起始号码" clearable @keydown.enter.native="init" />
            <span>至</span>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endUserNo" size="mini" placeholder="结束号码" clearable @keydown.enter.native="init" />
          </el-form-item>
          <!-- <el-form-item label="银行账号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bankAccount" placeholder="银行账号"  @keydown.enter.native="init" />
          </el-form-item> -->
          <el-form-item label="水量≥" class="width-160">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.waterNum" :controls="false" clearable placeholder="水量" @keydown.enter.native="init" />
          </el-form-item>
          <el-form-item label="用户状态：" class="width-160">
            <el-select  v-model="tableQuery.userStatus" clearable size="mini">
              <el-option v-for="item in dictionaryData.CUS" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送状态(停水)：" class="width-160" label-width="120px">
            <el-select ref="select5" v-model="tableQuery.servicePauseNoticeStatus" clearable size="mini">
              <el-option v-for="item in messageStateOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送时间≥" class="width-180">
            <el-date-picker v-model="tableQuery.arrearsSendStartTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="发送时间≤" class="width-180">
            <el-date-picker v-model="tableQuery.arrearsSendEndTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="开帐日期≥" class="width-180">
            <el-date-picker v-model="tableQuery.openAccountStartTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="开帐日期≤" class="width-180">
            <el-date-picker v-model="tableQuery.openAccountEndTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
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
        <el-table highlight-current-row ref="table" v-if="tableShow" :max-height="maxHeight" @sort-change='sortChange' stripe border :data="tableData.list" class="change-tables-table" @selection-change="handleSelect" @row-click="handleTableCellClick" :cell-style="cellStyle">
          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod" />
          <el-table-column type="selection" />
          <!-- <el-table-column prop="messageState" label="是否发送" min-width="100" :formatter="messageStateFormat" />
          <el-table-column prop="arrearsNoticeTime" :sort-orders="['descending','ascending',null]" :sortable="'custom'" label="发送时间" min-width="180" /> -->
          <el-table-column prop="servicePauseNoticeStatus" label="状态（停水）" min-width="120" :formatter="messageStateFormat" />
          <el-table-column prop="servicePauseNoticeTime" :sort-orders="['descending','ascending',null]" :sortable="'custom'" label="发送时间（停水）" min-width="160" />
          <el-table-column prop="mobile" label="手机号码" min-width="120" />
          <el-table-column prop="userNo" label="用户编号" min-width="140" />
          <el-table-column prop="ctmAddr" label="客户地址" min-width="250" show-overflow-tooltip />
          <el-table-column prop="userName" label="客户名称" min-width="230" show-overflow-tooltip />
          <!-- <el-table-column prop="currentDate" label="当前日期" min-width="100" /> -->
          <el-table-column prop="count" :sort-orders="['descending','ascending',null]" :sortable="'custom'" label="笔数" min-width="80" align="right" />
          <el-table-column prop="bookNo" label="册本号" min-width="110" />
          <el-table-column prop="waterNum" label="水量合计" min-width="80" align="right" />
          <el-table-column prop="totalFee" :sort-orders="['descending','ascending',null]" :sortable="'custom'" label="欠费合计" min-width="110" align="right" />
          <el-table-column prop="waterFee" label="基本水费" min-width="100" align="right" />
          <el-table-column prop="sewageFee" label="污水费" min-width="100" align="right" />
          <el-table-column prop="garbageFee" label="垃圾费" min-width="100" align="right" />
          <el-table-column prop="balance" label="预存金额" min-width="80" align="right" />

        </el-table>

      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
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
          { title: "欠费停水通知" }
        ]
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        sortOrder: '',
        sortField: '',
        beginMonth: '',
        endMonth: '',
        costNo: '',
        excludeInvalidMobile: [],
        // payMethod: '',
        meterReadingCycle: '',
        bookNo: '',
        beginUserNo: '',
        endUserNo: '',
        // bankAccount: '',
        count: '',
        arrears: '',
        waterNum: '',
        userStatus:'',
        businessArea: '',
        messageState: '',
        arrearsSendStartTime: '',
        arrearsSendEndTime: '',
        servicePauseNoticeStatus: '',
        openAccountStartTime: '',
        openAccountEndTime: '',

      },
      sendType: '',
      readCycleOption: {},
      dateList: [],
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
      costOptions: [],
      meterReaderList: [],
      props1: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false
      },
      selected: []
    }
  },
  created () {
    this.selectBAreaOptions()
    this.getDictionary()
    this.SelectUseWaterTypeOptions()
    this.getChargeData()
    this.getReadingStaff()
    this.getReadCycleList()
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const begin = month === 0 ? ((year - 1).toString() + '12') : (month >= 10 ? year.toString() + month : year.toString() + '0' + month)
    this.dateList = [begin, begin]
    // this.init()
    this.$nextTick(() => {
      this.common.changeTable(this, ".oweWorthIndex", [
        ".oweWorthIndex .toolbar",
        ".oweWorthIndex .block"
      ]);
    })

  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
        this.$refs.select3.blur()
        this.$refs.select4.blur()
        this.$refs.select5.blur()
      }
    },
    sortChange (column) {
      console.log(column);
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
    init () {
      if (this.tableQuery.excludeInvalidMobile.length == 0) {
        this.tableQuery.excludeInvalidMobile = ['0']
      } else if (this.tableQuery.excludeInvalidMobile.length > 1) {
        this.tableQuery.excludeInvalidMobile = ['1']
      }
      let params = {
        busicode: "ArrearsNoticeList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        })
        .catch(() => {
          this.tableData = {
            list: [],
            total: 0
          }
        });
    },
    getCurrentSendType () {
    },
    // 抄表周期数据
    getReadCycleList () {
      var _this = this
      var params = {
        "busicode": "ReadCycleList",
        "data": {}// 抄表周期
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.readCycleOption = res
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
        data: "BPC,RTP,CUS" //流程状态、紧急程度
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
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
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
    // 获取费用类型
    getChargeData () {
      let _this = this;
      _this.chargeData = []
      _this.chargeClickData = []
      let params = {
        busicode: "costList",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.costOptions = res
        });
    },
    // 抄表员数据获取
    getReadingStaff () {
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.meterReaderList = res
        });
    },
    handleSelect (selection) {
      this.selected = selection
    },
    handleTableCellClick (row, cell, event) {
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.list.findIndex(item => item.userNo === row.userNo)
      var select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if (this.selected.some(item => select.some(val => val.userNo === item.userNo))) { //取消该账期勾选
        this.handleSelect(this.selected.filter(item => select.every(val => val.userNo !== item.userNo)))
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
      console.log(this.sendType);
      var sendNotice = ''
      var sendUserList = ''
      if (!this.sendType) {
        this.$message.error('请选择发送范围')
        return
      }
      if (this.sendType == '1') {
        if (this.selected.length === 0) {
          this.$message.error('请选择至少一条记录')
          return
        }
        sendNotice = '该用户';
        sendUserList = this.selected.map(item => item.userNo)
      } else if (this.sendType == '2') {
        if (this.tableData.total === 0) {
          this.$message.error('当前查询条件无记录，请更换条件重新查询')
          return
        }
        sendNotice = '全部用户';
        sendUserList = []
      }
      this.$confirm('是否对' + sendNotice + '发送【欠费催缴】短信？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "ArrearsNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '604acf5e5d6f1866a022abf7',
            userNoList: sendUserList
          }
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
    sendingPause () {
      var sendNotice = ''
      var sendUserList = ''
      if (!this.sendType) {
        this.$message.error('请选择发送范围')
        return
      }
      if (this.sendType == '1') {
        if (this.selected.length === 0) {
          this.$message.error('请选择至少一条记录')
          return
        }
        sendNotice = '该用户';
        sendUserList = this.selected.map(item => item.userNo)
      } else if (this.sendType == '2') {
        if (this.tableData.total === 0) {
          this.$message.error('当前查询条件无记录，请更换条件重新查询')
          return
        }
        sendNotice = '全部用户';
        sendUserList = []
      }
      this.$confirm('是否对' + sendNotice + '发送【欠费停水】短信？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "ServicePauseNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '604acf5e5d6f1866a022abf7',
            userNoList: sendUserList
          }
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          //   this.$message({
          //     message: '正在发送中，请勿重复发送',
          //     type: 'success'
          //   })
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
    sendingAllPause () {
      if (this.tableData.total === 0) {
        this.$message.error('当前查询条件无记录，请更换条件重新查询')
        return
      }
      this.$confirm('是否对全部发送【暂停服务】短信？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "ServicePauseNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '604acf5e5d6f1866a022abf7',
            userNoList: []
          }
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          //   this.$message({
          //     message: '正在发送中，请勿重复发送',
          //     type: 'success'
          //   })
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
    sendingAll () {
      if (this.tableData.total === 0) {
        this.$message.error('当前查询条件无记录，请更换条件重新查询')
        return
      }
      this.$confirm('是否对全部发送【欠费催缴】短信？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "ArrearsNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '604acf5e5d6f1866a022abf7',
            userNoList: []
          }
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          //   this.$message({
          //     message: '正在发送中，请勿重复发送',
          //     type: 'success'
          //   })
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
    dateList (val) {
      if (val && val.length > 0) {
        this.tableQuery.beginMonth = val[0]
        this.tableQuery.endMonth = val[1]
      } else {
        this.tableQuery.beginMonth = ''
        this.tableQuery.endMonth = ''
      }
    },
    'tableQuery.count': {
      handler (val, oldVal) {
        if (!/^[0-9]*$/.test(val)) {
          this.tableQuery.count = oldVal
        }
      }
    },
    'tableQuery.arrears': {
      handler (val, oldVal) {
        if (val !== '' && !/^[0-9]+.?[0-9]*$/.test(val)) {
          this.tableQuery.arrears = oldVal
        }
      }
    },
    'tableQuery.waterNum': {
      handler (val, oldVal) {
        if (val !== '' && !/^[0-9]+.?[0-9]*$/.test(val)) {
          this.tableQuery.waterNum = oldVal
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ArrearsStopWater {
  height: 100%;
  .oweWorthIndex {
    height: calc(100% - 40px);
  }
}
.multiInput {
  width: 330px;
  .el-input {
    width: 120px !important;
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
.ArrearsStopWater{
    .multiInput {
  width: 430px;
  .el-input {
    width: 160px !important;
    .el-input__inner{
        width: 100% !important;
    }
  }
}
.width-160 > .el-form-item__content .el-date-editor{
  width: 160px !important;
}
.width-180 > .el-form-item__content .el-date-editor{
  width: 180px !important;
  .el-input__inner{
        width: 100% !important;
  }
}
.width-160 .el-input--mini .el-input__inner{
  width: 160px !important;
}
}
</style>