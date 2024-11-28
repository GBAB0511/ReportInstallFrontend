
<template>
  <div class="DataCollectionEdit">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="册本号：" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bBookNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="-" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.eBookNo" placeholder="" style="margin-left: 10px"></el-input>
        </el-form-item>
        <el-form-item label="最大容忍天数：" class="width-100">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.days" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="营业区域：">
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
          </el-cascader>
        </el-form-item>
        <!-- 抄表员 -->
        <el-form-item class="readingStaff" label="抄表员：">
          <el-select v-model="tableQuery.meterReadingStaff" size="mini" placeholder="抄表员">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用水类型：">
          <el-cascader ref="cascader-a" v-model="tableQuery.useWaterType" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="用户编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" clearable size="mini"></el-input>
        </el-form-item>
        <!-- <el-form-item label="册本名称：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookName" clearable size="mini"></el-input>
          </el-form-item> -->
        <el-form-item label="是否已抄：">
          <el-select clearable v-model="tableQuery.isRead" placeholder="是否已抄">
            <el-option v-for="(item,index) in isReadOption" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否异常：">
          <el-select clearable v-model="tableQuery.abnormal" placeholder="是否异常">
            <el-option v-for="(item,index) in abnormalOption" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否开账：">
          <el-select clearable v-model="tableQuery.openAccount" placeholder="是否开账">
            <el-option v-for="(item,index) in openAccountOption" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取整方式：">
          <el-select v-model="tableQuery.round" clearable size="mini">
            <el-option v-for="item in roundOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" icon="el-icon-upload2" size="mini" @click="exportExcel">导出</el-button>
        </el-form-item>
        <br>
        <el-form-item label="抄表日期：">
          <el-date-picker v-model="tableQuery.date" size="mini" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="账期：">
          <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" class='searchBtn' @click="init">抄读</el-button>
        </el-form-item>
        <br>
        <el-form-item label="总数：">
          <font color="red">{{tableData.total}}</font>
        </el-form-item>
        <el-form-item label="未抄：">
          <font color="red">{{tableData.notCopied}}</font>
        </el-form-item>
        <el-form-item label="已抄：">
          <font color="red">{{tableData.copied}}</font>
        </el-form-item>
        <el-button size="mini" @click="linkCollect" type="primary">查看实时数据</el-button>
      </el-form>
    </div>

    <div class="kl-table">
      <ux-grid stripe border v-show="tableShow" :max-height="maxHeight" :data="tableData.list" class="change-tables-table" highlight-current-row @selection-change="handleSelectionChange">
        <ux-table-column type="checkbox" fixed="left" width="50" resizable>
        </ux-table-column>

        <ux-table-column type="index" title="NO." width="50" fixed="left" :index="indexMethod" resizable>
        </ux-table-column>

        <ux-table-column field="abnormalName" min-width="80" title="是否异常" resizable>
          <template slot-scope="scope">
            <p v-if="scope.row.abnormal === '1'" style="color: red;">{{scope.row.abnormalName}}</p>
            <p v-if="scope.row.abnormal === '0'" style="color: rgb(28, 184, 96)">{{scope.row.abnormalName}}</p>
          </template>
        </ux-table-column>

        <ux-table-column field="ctmName" min-width="250" title="用户名称" show-overflow-tooltip resizable>
        </ux-table-column>

        <ux-table-column field="meterReadingStaffName" min-width="100" title="抄表员" resizable>
        </ux-table-column>

        <ux-table-column field="userNo" min-width="120" title="用户编号" resizable>
          <template slot-scope="scope">
            <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
          </template>
        </ux-table-column>

        <ux-table-column field="setupMeterDate" min-width="100" title="装表日期" resizable>
        </ux-table-column>

        <ux-table-column field="priorPeriodDate" min-width="100" title="上期抄表日" resizable>
        </ux-table-column>

        <ux-table-column field="haveDate" min-width="100" title="已抄日期" resizable>
        </ux-table-column>

        <ux-table-column field="haveWater" min-width="80" title="已抄水量" align="right" resizable>
        </ux-table-column>

        <ux-table-column field="meterReadingDate" min-width="100" title="抄表日期" resizable>
        </ux-table-column>

        <ux-table-column field="priorPeriodNum" min-width="80" title="上次抄码" align="right" resizable>
        </ux-table-column>

        <ux-table-column field="currendPeriodNum" min-width="80" title="本次抄码" align="right" resizable>
        </ux-table-column>

        <ux-table-column field="priorPeriodWater" min-width="80" title="上期水量" align="right" resizable>
        </ux-table-column>

        <ux-table-column field="currendPeriodWater" min-width="80" title="水量" align="right" sortable resizable>
        </ux-table-column>

        <ux-table-column field="ringRatioWater" min-width="100" title="水量环比" align="right" sortable resizable>
        </ux-table-column>

        <ux-table-column field="useWaterTypeName" min-width="150" title="用水类型" resizable>
        </ux-table-column>

        <ux-table-column field="bookNo" min-width="150" title="表册号" resizable>
        </ux-table-column>

        <ux-table-column field="bookName" min-width="150" title="表册名称" resizable>
        </ux-table-column>

        <ux-table-column field="factoryNo" min-width="150" title="表身码" resizable>
        </ux-table-column>

        <ux-table-column field="meterFactoryName" min-width="80" title="水表厂家" resizable>
        </ux-table-column>

        <ux-table-column field="setupMeterAddr" min-width="280" title="装表地址" resizable>
        </ux-table-column>

        <ux-table-column title="操作" fixed="right" width="80px" resizable>
          <template slot-scope="scope">
            <el-button type="text" @click="reMove(scope.row.userNo)">删除</el-button>
          </template>
        </ux-table-column>

      </ux-grid>
    </div>
  </div>
</template>
<script>
export default {
  name: "DataCollectionEdit",
  props: ['booksVal'],
  data () {
    return {

      //列表存值
      tableData: [],
      //查询表单数据
      tableQuery: {
        bBookNo: "",//起始册本号
        eBookNo: "",//结束册本号
        date: this.common.date(),//抄表日期
        days: '2',//容忍天数
        abnormal: '',//是否异常 0否，1是
        openAccount: '',//是否开账，0否，1是
        round: '2',//取整方式
        accountPeriod: this.common.date('month'),//账期
        businessArea: "",//营业区域
        useWaterType: [],//用水类型
        meterReadingStaff: "",//抄表员
        userNo: '',//用户编号
        // bookName:''//册本名称
        isRead: '',//是否已抄
      },
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false,
      },
      props1: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      businessAreaData: [], //营业区域下拉框
      useWaterTypeOptions: [],//用水类型下拉框
      meterReaderList: [],//抄表员下拉框
      // 取整方式
      roundOption: [{
        value: '1',
        label: '四舍五入'
      }, {
        value: '2',
        label: '向下取整'
      }, {
        value: '3',
        label: '向上取整'
      }],
      //是否异常
      abnormalOption: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      //是否开账
      openAccountOption: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      //是否已抄
      isReadOption: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      treeBooks: {
        Wtotal: 455,
        notCopied: 400,
        Copied: 395,
      },
      DateChoosevalue: "",
      maxHeight: 0,
      tableShow: false,
      multipleSelection: [], // 多选
    };
  },
  mounted () {
    this.getReadingStaff()
    this.SelectUseWaterTypeOptions()
    this.selectBAreaOptions();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".DataCollectionEdit", [".DataCollectionEdit .toolbar", ".DataCollectionEdit .block",]);
    });
  },
  methods: {
    //初始化
    init () {
      let _this = this

      let data = JSON.parse(JSON.stringify(_this.tableQuery))
      if (data.eBookNo.length == 0) {
        data.eBookNo = data.bBookNo
      }
      if (data.bBookNo.length == 0) {
        data.bBookNo = data.eBookNo
      }
      let params = {
        "busicode": "MrRecordCopyList",
        "data": data,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    //删除异常数据
    clearDate () {
      this.$set(this.tableData, 'list', this.tableData.list.filter(item => item.abnormal != 1))
    },
    //删除行
    reMove (userNo) {
      console.log(userNo)
      for (let idx in this.tableData.list) {
        if (userNo === this.tableData.list[idx].userNo) {
          this.tableData.list.splice(idx, 1)
          console.log(idx)
          return;
        }
      }
    },
    //保存按钮
    submitDataCollec () {
      let _this = this
      let val = true;
      if (_this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择需要保存的数据',
          type: 'warning'
        });
        return;
      }
      let abnormalDate = this.multipleSelection.filter(item => item.abnormal == 1)
      if (abnormalDate.length > 0) {
        this.$notify.error({
          title: '错误',
          message: '保存失败，此次数据中有状态为异常的数据不可保存！'
        });
      } else {
        var data = []
        // this.tableData.list.forEach(function (element, index) {
        this.multipleSelection.forEach(function (element, index) {
          let val = {}
          val.id = element.id,//
            val.userNo = element.userNo,//用户编号
            val.meterReadingDate = element.meterReadingDate,//抄表日期
            val.currendPeriodNum = element.currendPeriodNum,//本期抄码
            val.accountPeriod = _this.tableQuery.accountPeriod,//账期
            val.addWater = '',//增减水量
            val.status = 0,//抄表状态ID
            val.comments = ''//备注
            val.meterReadFlag = 2,
          data.push(val);
        })
        var params = {
          "busicode": "MrRecordSave",
          "data": data
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
        })
      }
    },
    //跳转至集抄系统
    linkCollect () {
      // var currentCode = localStorage.getItem('companyNo')
      // //  console.log('1111',currentCode)
      // var currentUrl = window.location.href
      console.log(localStorage.getItem("appSSOUrl")+'http://oa.ds.com:8080/cas/login?service=http://jc.gdhwater.com/cas.htm')
        window.open(localStorage.getItem("appSSOUrl")+'http://oa.ds.com:8080/cas/login?service=http://jc.gdhwater.com/cas.htm');
        // window.open("http://uma.gdhwater.com/ekp/wanhu?url=http://oa.ds.com:8080/cas/login?service=http://jc.gdhwater.com/cas.htm")

      // if (currentCode == '01' || currentUrl.indexOf('36.103.225.121:9012') > -1 || currentUrl.indexOf('localhost:8083') > -1) {
      //   window.open('http://rsa.yinchuanwater.com:9001/login.html?url=http://prod.yinchuanwater.com:9036/cas.htm', '_blank') //银川集抄
      // } else {
      //   // window.open('http://jc.uat.gdhwater.com/cas.htm', '_blank')
      
      // }

    },
    indexMethod (index) {//获取表格序号
      return (index + 1)
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
    // 抄表员数据获取
    getReadingStaff () {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
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
    // 导出
    exportExcel () {
      let params = {
        "busicode": "MrRecordCopyListExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 快捷查询
    toDetail (userNo) {
      let routeUrl = this.$router.resolve({ path: '/UserInfoSearchDetail' });
      sessionStorage.setItem('userNo', userNo)
      window.open(routeUrl.href, '_blank');
      sessionStorage.removeItem('userNo')
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val;
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
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.DataCollectionEdit {
  height: calc(100% - 41px);
  margin: 0 auto;
}
</style>
