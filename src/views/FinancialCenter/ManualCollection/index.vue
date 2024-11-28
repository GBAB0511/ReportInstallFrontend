<template>
  <!-- 手工托收 模块 -->
  <div class="ManualCollection">
    <!--弹出框 银行分类表 -->
    <el-dialog title="银行分类表" :visible.sync="BankClassificationVisible">
        <div class="kl-table">
            <el-table :data="gridData">
                <el-table-column property="date" label="序号" width="150"></el-table-column>
                <el-table-column property="name" label="银行名称" width="200"></el-table-column>
                <el-table-column property="address" label="份数"></el-table-column>
                <el-table-column property="address" label="金额（元）"></el-table-column>
            </el-table>
      </div>
    </el-dialog>
    <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
            <font v-if='indexShow'>
                <el-button size="mini" type="primary" icon="el-icon-upload2">导出</el-button>
                <el-button type="primary" size="mini"  @click="add">出盘</el-button>
                <el-button type="primary" size="mini"  @click="add">收款</el-button>
                <el-button type="primary" size="mini"  @click="add">打印凭证</el-button>
                <el-button type="primary" size="mini"  @click="add">发送短信</el-button>
                <el-button type="primary" size="mini"  @click="BankClassification">银行分类表</el-button>
            </font>
            <font v-else>
                <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog"  >返回</el-button>
            </font>
        </div>
    </div>
    <div v-if='indexShow' class="indexContent">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">
          <el-form-item label='账期：'>
              <el-date-picker
                  v-model="tableQuery.billTime"
                  type="month"
                  placeholder="账期">
              </el-date-picker>
          </el-form-item>

          <el-form-item label="回单状态：">
          <el-select clearable v-model="tableQuery.status" placeholder="">
              <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label='回单日期：'>
              <el-date-picker
                  v-model="tableQuery.billTime"
                  type="date"
                  placeholder="回单日期">
              </el-date-picker>
          </el-form-item>


          <el-form-item label="模糊查询：" class="searchInput">
          <el-tooltip class="item" effect="dark" content="托号、客户名称、金额" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini"></el-input>
          </el-tooltip>
          </el-form-item>

          <el-form-item class="button-group">
          <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
          </el-form-item>

          <div v-show="isActive" class="advancedQuery">
            <el-form-item label="开户行：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini"></el-input>
            </el-form-item>

            <el-form-item label="托收类型：">
            <el-select clearable v-model="tableQuery.status" placeholder="">
                <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            </el-form-item>
          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableList.list" class="change-tables-table">

            <el-table-column type="index" label="NO." width="50" fixed="left">
            </el-table-column>

            <el-table-column prop="state" min-width="60" label="状态">
            </el-table-column>

            <el-table-column prop="engineeringState" min-width="100" label="进度">
            </el-table-column>

            <el-table-column prop="handleName" min-width="100" label="当前处理人">
            </el-table-column>

            <el-table-column prop="connect3" min-width="100" label="单据编号">
            </el-table-column>

            <el-table-column prop="connect2" min-width="100" label="单据时间">
            </el-table-column>
            
            <el-table-column prop="connect1" min-width="60" label="开始时间">
            </el-table-column>

            <el-table-column prop="engineeringState" min-width="100" label="结束日期">
            </el-table-column>

            <el-table-column prop="connect4" min-width="100" label="说明">
            </el-table-column>


        <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
            <el-button type="text" @click.native="edit(scope.$index, scope.row)">详情</el-button>
        </template>
        </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableList.total">
          </el-pagination>
        </div>
    </div>
    <div v-else class="indexContent">
      <ManualCollectionEdit  ref="ManualCollectionEdit" ></ManualCollectionEdit>
    </div>
  </div>
</template>
<script>
import ManualCollectionEdit from './ManualCollectionEdit'
export default {
  name: "ManualCollection",
  components: {
    ManualCollectionEdit,
  },
  data() {
    return {
        gridData:[],
        BankClassificationVisible:false,
        isActive: false,
        tableEdit: false,
        activeName: 'EngineeringAccountOpening',
        indexShow: true,
        crumbsData: {  //面包屑
            titleList: [
            { title: '收费管理' },
            { title: '手工托收' },
            ],
        },
        //审批状态下拉框
        approvalStatusOptions: [
            { value: '1', label: '全部' },
            { value: '2', label: '未回单' },
            { value: '3', label: '非正常' },
        ],
        tableQuery: {
            page:1,
            pageCount:20,
            // beginDate:billTime[0],
            // endDate:billTime[1],
            fuzzyQuery: "",
            status: '1',
            billTime:'',
        },
        tableShow: false,
        maxHeight: 0,
        tableList: {
            list: [
            {
            },
            ]
        },
        // 日期选择器
        pickerOptions: {
            disabledDate(time) {
            return time.getTime() > Date.now();
            }
        },
    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.ManualCollection', ['.ManualCollection .toolbar', '.ManualCollection .block', '.ManualCollection .bread-contain', '.ManualCollection .toggle-btn'])
  },
  methods: {
    init() {
      let _this = this
      let params = {
        "busicode": "OpenUserList",
        "data": _this.tableQuery,
      }
    },
    BankClassification(){
        this.BankClassificationVisible = true;
    },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        //   $('.el-table--fit').css('height', '66%');
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
      this.$nextTick(() => {
        this.common.changeTable(this, '.ManualCollection', ['.ManualCollection .toolbar', '.ManualCollection .block', '.ManualCollection .bread-contain', '.ManualCollection .toggle-btn'])
      })
    },
    search() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    exportExcel() {
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
      this.indexShow = false;
    },

    closeDialog() { //关闭会话
      this.TransferDetailsVisible = false;
      this.indexShow = true;
      // this.crumbsData.titleList.pop();
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
    },
    // 编辑
    edit(val) {
      this.indexShow = false;
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
.ManualCollection {
  width: 100%;
  height: 100%;
  .kl-table{
    margin-top: 15px;
  }
}
</style>
