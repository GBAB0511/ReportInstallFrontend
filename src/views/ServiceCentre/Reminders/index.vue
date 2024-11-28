<template>
  <div class="reminders">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="sendingAll">全部发送</el-button>
        <el-button size="mini" type="primary" @click="sending">发送</el-button>
      </div>
    </div>
    <div class="remindersIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <el-form-item label="账期：">
            <el-date-picker size="mini" v-model="tableQuery.sendMonth" type="month" format="yyyy-MM" value-format="yyyyMM" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="抄表日期：">
            <el-date-picker size="mini" v-model="tableQuery.meterReadingDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="抄表日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="用户编号：" class="width-160">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" size="mini" placeholder="用户编号" @keydown.enter.native="init" clearable />
          </el-form-item>
          <el-form-item label="册本号：" class="multiInput width-160">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.startBookNo" size="mini" placeholder="起始号码" clearable @keydown.enter.native="init" />
            <span>至</span>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endBookNo" size="mini" placeholder="结束号码" clearable @keydown.enter.native="init" />
          </el-form-item>
          <el-form-item label="营业区域：" class="width-160">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaOptions" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="缴费类型：" class="width-160">
            <el-select ref="select1" v-model="tableQuery.payMethod" clearable size="mini">
              <el-option v-for="item in dictionaryData.BPC" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送状态：" class="width-160">
            <el-select ref="select2" v-model="tableQuery.payNoticeMessageState" clearable size="mini">
              <el-option v-for="item in messageStateOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抄表员：" class="width-160">
            <el-select ref="select3" v-model="tableQuery.meterReadingStaffAccount" placeholder="请选择" clearable @keydown.enter.native="search">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="init" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" ref="eltableCurrentRow" @selection-change="handleSelect" @row-click="handleTableCellClick" :cell-style="cellStyle">
          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod" />
          <el-table-column type="selection" />
          <el-table-column prop="userNo" label="用户编号" min-width="150" />
          <el-table-column prop="userName" label="用户名称" min-width="80" show-overflow-tooltip />
          <el-table-column prop="ctmAddr" label="地址" min-width="100" show-overflow-tooltip />
          <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员"></el-table-column>
          <el-table-column prop="monthId" label="年月" min-width="80" />
          <el-table-column prop="waterNum" label="用水量" min-width="80" align="right" />
          <el-table-column prop="totalFee" label="应收" min-width="80" align="right" />
          <el-table-column prop="mobile" label="手机号码" min-width="120" />
          <el-table-column prop="sewageFee" label="污水费" min-width="100" align="right" />
          <el-table-column prop="garbageFee" label="垃圾费" min-width="100" align="right" />
          <el-table-column prop="waterFee" label="水费" min-width="100" align="right" />
          <el-table-column prop="priorNum" label="上次行度" min-width="100" align="right" />
          <el-table-column prop="currentNum" label="本次行度" min-width="100" align="right" />
          <el-table-column prop="priorDate" label="上期抄表日" min-width="100" />
          <el-table-column prop="currentDate" label="本期抄表日" min-width="100" />
          <el-table-column prop="payNoticeMessageState" label="是否发送" min-width="100" :formatter="messageStateFormat" />
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
          { title: "缴费提醒" }
        ]
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        sendMonth: this.common.date('month'),
        meterReadingDate: '',
        userNo: '',
        startBookNo: '',
        endBookNo: '',
        payMethod: '',
        businessArea: '',
        payNoticeMessageState: '',
        flag: 1,
        meterReadingStaffAccount: '',
      },
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
        value: 'id',
        label: 'name',
        emitPath: false
      },
      selected: [],
      // 抄表员下拉选择数据
      postUsers: [],
    }
  },
  created () {
    this.init()
    this.selectBAreaOptions()
    this.getDictionary()
    this.SelectUseWaterTypeOptions()
    this.getPostUser()
    this.$nextTick(() => {
      this.common.changeTable(this, ".remindersIndex", [
        ".remindersIndex .toolbar",
        ".remindersIndex .block"
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
        })
        .catch(() => {
          this.tableData = {
            list: [],
            total: 0
          }
        });
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
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else {
        this.handleSelect(this.selected.concat(select))
        this.selected.concat(select).forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
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
      this.$confirm('是否确认发送？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "BillNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '604accf55d6f1866a022abf4',
            userNoList: this.selected.map(item => item.userNo)
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
    sendingAll () {
      if (this.tableData.total === 0) {
        this.$message.error('当前查询条件无记录，请更换条件重新查询')
        return
      }
      this.$confirm('是否确认全部发送？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "BillNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            masTemplateId: '604accf55d6f1866a022abf4',
            userNoList: []
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
.reminders {
  height: 100%;
  .remindersIndex {
    height: calc(100% - 40px);
  }
}
.multiInput {
  width: 430px;
  .el-input {
    width: 160px !important;
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
.reminders{
.width-160 > .el-form-item__content .el-date-editor{
  width: 160px !important;
}
.width-160 .el-input--mini .el-input__inner{
  width: 160px !important;
}
}
</style>