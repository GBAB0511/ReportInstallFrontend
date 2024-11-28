<template>
  <!-- 表阀门管理 -->
  <div class="TableValveManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <font v-if='indexShow'>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
        </font>
        <font v-else>
          <el-button type="primary" size="mini" @click="save">保存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
      </div>
    </div>
    <div v-if='indexShow'  class='indexContent'>

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label='开关日期：'>
              <el-date-picker v-model="tableTime" @change="getDatePicker" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="阀门状态：" class="width-150">
              <el-select clearable v-model="tableQuery.valveStatus" placeholder="阀门状态">
                <el-option v-for="item in dictionaryData.MVS" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="实际开关阀：" class="width-150">
              <el-select clearable v-model="tableQuery.realValveStatus" placeholder="实际开关阀">
                <el-option v-for="item in dictionaryData.MVS" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="模糊查询：" class="width-250">
              <el-tooltip class="item" effect="dark" content="用户编号、用户名称、开关人员" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="用户编号、用户名称、开关人员" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left">
          </el-table-column>

          <el-table-column prop="userNo" min-width="60" label="用户编号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户姓名">
          </el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="100" label="装表地址">
          </el-table-column>

          <el-table-column prop="valveStatus" min-width="100" label="阀门状态">
          </el-table-column>

          <el-table-column prop="realValveStatus" min-width="100" label="实际开关阀">
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>

    <div v-else  class='indexContent'>
      <TableValveManagementEdit ref="TableValveManagementEdit" :tableValveManagementEditNeedData='tableValveManagementEditNeedData'></TableValveManagementEdit>
    </div>
  </div>
</template>
<script>
import TableValveManagementEdit from './TableValveManagementEdit'
export default {
  name: "TableValveManagement",
  components: {
    TableValveManagementEdit,
  },
  data() {
    return {
      tableEdit: false,
      activeName: 'EngineeringAccountOpening',
      indexShow: true,
      crumbsData: {  //面包屑
        titleList: [
          { title: '抄表开账' },
          { title: '计划维护' },
          { title: '表阀门管理' },
        ],
      },
      // 列表数据
      tableData: {},
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: '',
        endDate: '',
        fuzzyQuery: "",
      },
      // 占位，无用
      tableTime: [],
      // 数据字典数据
      dictionaryData: {},
      // 详情页所需数据
      tableValveManagementEditNeedData: {},
      tableShow: false,
      maxHeight: 0,

      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  mounted() {
    this.init()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.TableValveManagement', ['.TableValveManagement .toolbar', '.TableValveManagement .block', '.TableValveManagement .bread-contain'])
  },
  methods: {
    // 初始化
    init() {
      let _this = this
      let params = {
        "busicode": "MrMeterValveList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res
      })
    },
    // 查询按钮
    search() {  //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init()
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MVS"// 阀门状态
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
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
    //   开户
    add() {
      this.indexShow = false
      this.tableValveManagementEditNeedData.type = 'add'
    },
    // 保存按钮(调用子页面保存方法)
    save(){
      this.$refs.TableValveManagementEdit.save()
    },

    closeDialog() { //关闭会话
      this.indexShow = true;
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
    },
    // 详情
    details(item) {
      this.indexShow = false
      this.tableValveManagementEditNeedData = item
      this.tableValveManagementEditNeedData.type = 'details'
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
<style lang="scss">
.TableValveManagement {
  width: 100%;
  height: 100%;
}
</style>
