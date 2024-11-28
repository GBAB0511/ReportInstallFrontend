<template>
  <!-- 短信汇总 -->
  <div class="OtherReportOfSMSStatistics">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <el-dialog :title="smsDetailName" :close-on-click-modal="false" :visible.sync="smsDetailFlag" class="common-dialog" @close="closeDialog">
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="detailData.list" class="OtherReportOfSMSStatistics-table" @sort-change="sortChange">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="noticeTypeName" min-width="80" label="通知渠道">
          </el-table-column>

          <el-table-column prop="noticeWayName" min-width="80" label="通知类型">
          </el-table-column>

          <el-table-column prop="businessArea" min-width="120" label="营业区域">
          </el-table-column>

          <el-table-column prop="bookNo" min-width="140" label="册本号">
          </el-table-column>

          <el-table-column prop="userNo" min-width="140" label="用户编号">
          </el-table-column>

          <el-table-column prop="userName" min-width="100" label="用户名称">
          </el-table-column>

          <el-table-column prop="mobile" min-width="120" label="手机号码">
          </el-table-column>

          <el-table-column prop="noticeContent" min-width="250" label="短信内容" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="areaName" min-width="80" label="通知人">
          </el-table-column>

          <el-table-column prop="sendDate" min-width="160" label="通知日期" :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="stateName" min-width="80" label="通知状态">
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="tableQuery1.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery1.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total"></el-pagination>
      </div>
    </el-dialog>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item>
            <el-form-item label='发送日期：'>
              <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="短信类型：">
              <el-select ref="select1" clearable v-model="tableQuery.noticeWay" placeholder="短信类型" class="width-150">
                <el-option v-for="item in dictionaryData.NTY" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="营业区域：">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" @change="changeBusinessArea" :show-all-levels="false" :props="props" class="shouldWater">
              </el-cascader>
            </el-form-item>

            <el-form-item label="抄表员：">
              <!-- <el-select ref="select1" v-model="tableQuery.readerAccount" class="width-150">
                <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select> -->

              <el-select v-model="tableQuery.readerAccount" placeholder="请选择" @change="changeMeterReadingStaff" class="shouldWater" clearable>
                <el-option-group v-for="group in meterReaderList" :key="group.businessAreaName" :label="group.businessAreaName">
                  <el-option v-for="item in group.userInfos" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
                  </el-option>
                </el-option-group>
                <!-- <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option> -->
              </el-select>
            </el-form-item>

            <el-form-item label="册本号：">
              <el-select v-model="tableQuery.bookNo" placeholder="请选择" filterable class="shouldWater" clearable>
                <!-- <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span> -->
                <el-option-group v-for="group in bookNos" :key="group.index" :label="group.areaStaffName">
                  <el-option v-for="item in group.baseBookListVOList" :key="item.index" :value="item.bookNo">
                    <span style="float: left">{{ item.bookNo }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <!-- <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="OtherReportOfSMSStatistics-table"> -->
        <el-table v-if="tableShow" :max-height="maxHeight" highlight-current-row stripe border :data="tableData.list" class="OtherReportOfSMSStatistics-table" show-summary :summary-method='getTotal'>
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="businessAreaName" min-width="100" label="营业区域">
          </el-table-column>

          <el-table-column prop="bookNo" min-width="80" label="册本号">
          </el-table-column>

          <el-table-column prop="readerName" min-width="80" label="抄表员">
          </el-table-column>

          <el-table-column prop="count" min-width="80" label="总数量">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" class="noclick" @click="detail(scope)">查看详情</el-button>
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
  name: "OtherReportOfSMSStatistics",
  components: {

  },
  data () {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      smsDetailFlag: false,
      smsDetailName: '短信详情',
      dictionaryData: {},
      // 列表数据
      tableData: {},
      totalData: {}, //合计
      detailData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        noticeWay: '',
        startDate: '',
        endDate: '',
        businessArea: '', // 营业区域
        readerAccount: '', // 抄表员
        bookNo: '', // 册本号
      },
      tableQuery1: {
        page: 1,
        pageCount: 20,
        // noticeWay: '',
        startDate: '',
        endDate: '',
        businessArea: '', // 营业区域
        bookNo: '', // 册本号
        readerAccount: '', // 抄表员账户
        sortField: '',
        sortOrder: '',
      },
      // 查询条件日期
      Time: [],
      // 数据字典数据
      //面包屑
      crumbsData: {
        titleList: [{ title: "其它报表" }, { title: "短信统计表" }]
      },
      tableShow: false,
      maxHeight: 0,

      businessAreaData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false,
      },
      //抄表员
      meterReaderList: [],
      showbookNosData: [],
      bookNos: [],
    };
  },
  mounted () {
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    const day = date.getDate()
    this.tableQuery.startDate = `${year}-${month}-01 00:00:00`
    this.tableQuery.endDate = `${year}-${month}-${day} 23:59:59`
    this.Time = [`${year}-${month}-01`, `${year}-${month}-${day}`]
    // this.init()
    this.getDictionary();
    this.selectBAreaOptions();
    this.getReadingStaff();
    this.getBooks();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".OtherReportOfSMSStatistics .index-page", [
      ".OtherReportOfSMSStatistics .toolbar",
      ".OtherReportOfSMSStatistics .block",
    ]);
  },
  computed: {
    showbookNos () {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNo.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    formateWay (val) {
      var way = ''
      if (this.dictionaryData.NTY != undefined) {

        this.dictionaryData.NTY.forEach((item) => {
          if (item.value === val.noticeWay) {
            way = item.name;
          }
        })
      }
      return way;
    },
    detail (val) {
      let _this = this
      this.smsDetailFlag = true;
      if (val) {
        this.tableQuery1 = val.row;
        this.tableQuery1.beginSendDate = this.tableQuery.startDate;
        this.tableQuery1.endSendDate = this.tableQuery.endDate;
        this.tableQuery1.page = 1;
        this.tableQuery1.pageCount = 20;
        delete this.tableQuery1.count;
        delete this.tableQuery1.businessAreaName;
        delete this.tableQuery1.readerName;
      }

      let params = {
        busicode: "MessageList",
        data: _this.tableQuery1
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.detailData = res
      })
    },
    // 列表初始化
    init () {
      let _this = this
      if (!_this.tableQuery.startDate || !_this.tableQuery.endDate) {
        vm.$message({
          showClose: true,
          message: '请选择发送日期',
          type: "warning"
        });
        return
      }
      let query = _this.tableQuery;
      delete query.meterReadingStaffName;
      let params = {
        busicode: "SmsMessageReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.list
        _this.totalData = res.total
        delete _this.totalData.businessArea;
        delete _this.totalData.readerAccount;
        _this.getTotal();
      })
    },
    // 数据字典（查询框）
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "NTY"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 导出
    exportExcel () {
      let params = {
        busicode: 'SmsMessageReportExport',
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 返回合计数据
    getTotal (total) {
      let arr = ['合计']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },
    // 查询
    search () {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0] + ' 00:00:00'
        this.tableQuery.endDate = date[1] + ' 23:59:59'
        this.tableQuery1.startDate = date[0] + ' 00:00:00'
        this.tableQuery1.endDate = date[1] + ' 23:59:59'
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
        this.tableQuery1.startDate = ''
        this.tableQuery1.endDate = ''
      }
    },
    closeDialog () {
      this.smsDetailFlag = false;
      this.tableQuery1.page = 1
      this.tableQuery1.noticeWay = ''
      this.init();
    },

    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    //分页
    handleSizeChange1 (val) {
      //显示多少数据一页
      this.tableQuery1.pageCount = val
      this.tableQuery1.page = 1
      this.detail();
    },
    handleCurrentChange1 (val) {
      //显示多少页码
      this.tableQuery1.page = val
      this.detail();
    },
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },

    //营业区域
    selectBAreaOptions (id) {
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
        _this.businessAreaData = data.children;
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

    // //抄表员下拉框数据
    // getMeterReader () {
    //   let _this = this
    //   let params = {
    //     "busicode": "PostUserSelect",
    //     "data": { "postNo": "2" },
    //   }
    //   this.$api.fetch({
    //     params,//参数
    //   }).then(res => {
    //     console.log('获取抄表员')
    //     console.log(res)
    //     _this.meterReaderList = [...[{ userName: "全部" }], ...res];
    //     console.log(_this.meterReaderList)
    //   })
    // },

    // 抄表员数据获取
    getReadingStaff () {
      var _this = this;
      var params = {
        "busicode": "PostUserList",
        "data": {
          "postNo": "2",
          businessArea: this.tableQuery.businessArea
        },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = res;
          // _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },

    // 营业区域改变
    changeBusinessArea () {
      if (this.tableQuery.businessArea) {
        this.getBooks();
      } else {
        this.getBooks();
      }
      this.getReadingStaff();
    },

    sortChange (column) {
      this.tableQuery1.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery1.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery1.sortOrder = 2
      } else {
        this.tableQuery1.sortOrder = ''
        this.tableQuery1.sortField = ''
      }
      this.detail()
    },
    // 获取册本号
    getBooks () {
      if (this.tableQuery.meterReadingStaffName == null || this.tableQuery.meterReadingStaffName == undefined) {
        this.tableQuery.meterReadingStaffName = ''
      }
      let params = {
        busicode: 'baseAllBooks',
        data: {
          businessArea: this.tableQuery.businessArea,
          meterReadingStaff: this.tableQuery.meterReadingStaffName,
          //   meterReadingStaff: this.tableQuery.readerAccount,
        }
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.tableQuery.bookNo = '';
          this.bookNos = [...res];
          this.showbookNosData = []
          this.bookNos.forEach(item => {
            item.baseBookListVOList.forEach(child => {
              this.showbookNosData.push(child)
            })
          })
        });

    },
    // 选择抄表员
    changeMeterReadingStaff () {
      if (this.tableQuery.readerAccount) {
        this.meterReaderList.forEach(v => {
          v.userInfos.forEach(res => {
            if (res.userAccount == this.tableQuery.readerAccount) {
              this.tableQuery.meterReadingStaffName = res.userName
            }
          })
        })
      } else {
        this.tableQuery.meterReadingStaffName = ''
      }

      this.getBooks();
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
<style lang="scss" scoped>
.OtherReportOfSMSStatistics {
  width: 100%;
  height: 100%;

  /deep/ {
    .item {
      width: 22%;
      .el-form-item__content {
        width: calc(100% - 73px);
      }
    }
    .shouldWater {
      width: 100%;
      .el-input__inner {
        width: 100%;
      }
    }
    .searchInput {
      width: 300px;
      .el-form-item__content {
        width: calc(100% - 73px);
      }
    }
  }
  .kl-table {
    margin-top: 15px;
  }
  .chargeRemind {
    margin-left: 50px;
    .el-form-item__content {
      color: #606266;
    }
  }
  .noteReminder {
    width: 30%;
    float: left;
    text-align: left !important;
    line-height: 32px;
  }
  .block el-pagination {
    width: 60%;
    float: right;
  }
}
</style>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.OtherReportOfSMSStatistics {
  width: 100%;
  height: 100%;
  .index-page {
    height: calc(100% - 41px);
  }
}
</style>
