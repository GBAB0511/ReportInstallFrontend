<template>

  <div class="userSearch">

    <div class="userInfoIndex">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="营业所：">
            <el-select clearable v-model="tableQuery.businessAbode" placeholder="">
              <el-option v-for="(item,index) in businessAbodeOptions" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：">
            <el-tooltip class="item" effect="dark" content="用户编号、用户名称、用户地址、册本号、手机号码" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            <!-- <el-button type="primary" size="mini" @click="ComprehensiveQuery" class="soce-query">综合查询</el-button> -->
          </el-form-item>

        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" ref="table" @selection-change="getSelectData" :max-height="maxHeight" center stripe border :data="tableData.list" class="wuserInfo-table">
          <el-table-column type="selection" width="50" fixed="left">
          </el-table-column>

          <el-table-column type="index" label="NO." width="50" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="ctmNo" min-width="100" label="客户编号">
          </el-table-column>

          <el-table-column prop="accountNo" min-width="100" label="账户编号">
          </el-table-column>

          <el-table-column prop="bookNo" min-width="100" label="册本号">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称">

          </el-table-column>

          <el-table-column align="left" prop="ctmAddr" min-width="120" label="客户地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="businessAbode" min-width="80" label="营业所">
          </el-table-column>

          <el-table-column prop="openDate" width="120" label="立户日期">
          </el-table-column>

          <el-table-column prop="meterReadingCycle" width="100" label="抄表周期">
          </el-table-column>

          <el-table-column prop="status" width="80" label="用户状态">

          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>

      <!-- 弹出表单综合查询 -->
      <!-- <el-dialog :title="WaterEditorName" :close-on-click-modal="false" :visible.sync="waterAddVisible" class="button-dialog" @close="closeDialog">
        <ComprehensiveQuery ref="comprehensiveQuery" :tableQuery='tableQuery.l'></ComprehensiveQuery>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="submit('ruleForm');">查询</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog('ruleForm')">取 消</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
// import ComprehensiveQuery from "./ComprehensiveQuery"

export default {
  name: "userInfo",
  // components: {
  //   ComprehensiveQuery,
  // },
  props: ['parentSelectData'],
  data() {
    return {
      // 勾选数据
      selectData: [],





      CustomerChangesEditData: {//变动情况
        userNo: '',
      },
      WaterUseOverTheYearsData: {//费用信息
        userNo: '',
      },
      MeterReadingInfoData: {//抄表信息
        userNo: '',
      },
      PredepositDdetailsInfoData: {//账户流水
        accountNo: '',
      },
      lockFlagStr: '锁定',
      DataChangeVisibleName: "资料变更",
      DataChangeVisible: false,
      countManagementName: '查看客户资料',
      test: '测试',
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户管理' },
          { title: '查询' }
        ],

      },
      crumbsData1: {  //面包屑
        titleList: [
          { title: '客户管理', path: '/CustomerCenter' },
          { title: '查询', method: () => { window.histroy.back() } },
          // { title: '编辑', method: () => { window.histroy.back() } },
        ],

      },
      isActive: false,  //控制高级查询内容的显示
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessAbode: "",
        fuzzyQuery: '',
        // list: []
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {
        list: [
        ]
      },
      formData: {//编辑页面的id
        userNo: '',
      },
      waterAddVisible: false,  //综合查询的显示和隐藏
      WaterEditorName: '综合查询',
      ruleFormData: {},
      userInfoName: "用户资料-编辑",
      CustomerChangesVisible: false,
      ctmChangeName: '变动情况',
      ruleFormData: {},
      payInfoName: "费用信息",
      payInfoVisible: false,
      MeterReadingName: "抄表信息",
      MeterReadingVisible: false,
      PredepositDdetailsName: "账户流水",
      PredepositDdetailsVisible: false,
      AttachmentViewName: "查看附件",
      AttachmentViewVisible: false,
      businessAbodeOptions: [],//营业所下拉框
    }
  },
  mounted() {
    this.init();
    this.businessInit()
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.userInfoIndex', ['.userInfoIndex .toolbar', '.userInfoIndex .block',])
    });
  },
  methods: {
    init() {
      let _this = this
      let params = {
        "busicode": "UserInfoList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params,//参数

      }).then(res => {
        _this.tableData = res;
        setTimeout(() => {
          for (let i = 0; i < _this.tableData.list.length; i++) {
            for (let j = 0; j < _this.parentSelectData.length; j++) {
              if (_this.parentSelectData[j].value == _this.tableData.list[i].userNo) {
                _this.$refs.table.toggleRowSelection(_this.tableData.list[i], true)
              }
            }
          }
        }, 0);
      })
    },
    // 营业所下拉框的初始化
    businessInit() {
      let _this = this
      let params = {
        "busicode": "BusinessAbodeSelect",
        "data": {},
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.businessAbodeOptions = res;
      })
    },
    // 表格勾选对象数组
    getSelectData(itemList) {
      this.selectData = []
      itemList.forEach(item => {
        this.selectData.push({
          value: item.userNo,
          name: `${item.ctmName}(${item.userNo})`,
        })
      })
      console.log();
    },
    // 返回勾选数据给父页面（由父页面调用）
    setSelectData() {
      return this.selectData
    },
    hidden() {
      if (this.isActive == true) {
        $('.upchange').addClass('el-icon-arrow-down').removeClass('el-icon-arrow-up')
        this.isActive = false;
        $('.el-table--fit').css('height', '66%');

      } else {
        $('.upchange').addClass('el-icon-arrow-up').removeClass('el-icon-arrow-down')

        this.isActive = true;
        $('.el-table--fit').css('height', '50%');
      }
    },
    search() {  //查询
      this.init()
    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod(index) {//获取表格序号
      return this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1);
    },
    closeDialog() { //关闭会话
      this.waterAddVisible = false
    },
    //弹出框
    submit(formName) {	//提交
      // this.$refs.comprehensiveQuery.submit()
      let that = this;
      let list = that.tableQuery.list;
      let gridData = that.$refs.comprehensiveQuery.gridData;
      let message = '';
      for (let i = 0; i < gridData.length; i++) {
        if (!gridData[i].FieldName || !gridData[i].Operator || !gridData[i].LogicalValue || !gridData[i].QueryValue) {
          if (!gridData[i].FieldName) {
            message = "字段名不能为空";
          } else if (!gridData[i].Operator) {
            message = "操作符不能为空";
          } else if (!gridData[i].QueryValue) {
            message = "查询值不能为空";
          } else if (!gridData[i].LogicalValue) {
            message = "逻辑值不能为空";
          }
          this.$message({
            message,
            type: 'warning'
          });
          return
        }
      }
      that.tableQuery.list = that.$refs.comprehensiveQuery.gridData;
      that.init()
      that.waterAddVisible = false;
    },
    // 综合查询
    ComprehensiveQuery() {
      this.waterAddVisible = true;
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.userSearch {
  height: 100%;
  width: 100%;
  .userInfoIndex {
    height: 100%;
  }
  .bread-contain #crumbs {
    width: 20% !important;
  }
  .bread-contain .bread-contain-right {
    width: 78% !important;
  }
  // .wuserInfo-table {
  //   .el-table__body {
  //     tr {
  //       td:nth-child(2) {
  //         div {
  //           color: #3195f4;
  //           cursor: pointer;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>
