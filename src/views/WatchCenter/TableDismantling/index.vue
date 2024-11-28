<template>
  <!-- 拆表 -->
  <div class="TableDismantling">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right" v-if="ChangeTablesShow">
        <el-button size="mini" type="primary" @click="getDetailedEnquiries">历史查询</el-button>
      
      </div>
      <!-- 查看历史界面 -->
      <div class="bread-contain-right" v-if="DetailedEnquiriesVisible">
        <el-button type="primary" size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <!-- 详情界面 -->
      <div class="bread-contain-right" v-if="TableDismantlingHandleShow">
        <font v-if="editNeedData.processState==''">
          <el-button size="mini" type="primary" @click="save">暂存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
        <font v-else-if="editNeedData.processState == 'backfill' ">
          <el-button icon="el-icon-bottom" @click="exportExcel" size="mini" type="primary">下载模板</el-button>
          <el-upload  class="upload-demo" multiple  action="/"  :http-request="importExcel">
            <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
          </el-upload>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
        <font v-else>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
      </div>
    </div>

    <!-- 查看历史 -->
    <div v-if="DetailedEnquiriesVisible" class='indexContent'>
      <DetailedEnquiries   ref="DetailedEnquiries"></DetailedEnquiries>
    </div>
    <!-- 详情 -->
    <div v-if="TableDismantlingHandleShow" class='indexContent'>
      <TableDismantlingHandle ref="TableDismantlingHandle" :editNeedData ='editNeedData'></TableDismantlingHandle>
    </div>
    
    <!-- index页面 -->
    <div v-if="ChangeTablesShow" class='indexContent'>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='单据日期：'>
            <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="状态">
              <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="拆表类型：">
            <el-select ref="select2" clearable v-model="tableQuery.replaceType" placeholder="拆表类型">
              <el-option v-for="item in dictionaryData.MRM" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="单据编号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.billNo" placeholder="请输入单据编号" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="TableDismantling-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="nodeName" min-width="100" label="进度">
          </el-table-column>

          <el-table-column prop="operator" min-width="100" label="当前处理人"  show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期">
          </el-table-column>

          <el-table-column prop="replaceTypeName" min-width="100" label="拆表类型">
          </el-table-column>

          <el-table-column prop="planFinishDate" min-width="100" label="计划完工日期">
          </el-table-column>

          <el-table-column prop="meterAmount" min-width="80" label="水表数量" align="right">
          </el-table-column>

          <el-table-column prop="backfillAmount" min-width="80" label="已回填数量" align="right">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="60">
            <template slot-scope="scope">
              <el-button type="text" class="noclick" @click="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import DetailedEnquiries from "./DetailedEnquiries";//查看历史
import TableDismantlingHandle from "./TableDismantlingHandle";//流程处理界面
export default {
  name: "TableDismantling",
  components: {
    DetailedEnquiries,//查看历史
    TableDismantlingHandle,
  },
  data() {
    return {
      // 列表数据
      tableData:{},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        receiptType: 2,
        beginDate: '',
        endDate: '',
        processState: '',
        replaceType: ''
      },
      // 查询条件日期
      tableTime: [],
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 详情页面所需数据
      editNeedData : {},
        //面包屑
      crumbsData: {
        titleList: [{ title: "表计管理" }, { title: "拆表" }]
      },
      tableShow: false,
      maxHeight: 0,
      TableDismantlingHandleShow: false,//詳情
      backfillVisible: false,
      DetailedEnquiriesName: "拆表-历史查询",
      DetailedEnquiriesVisible: false,//查看历史
      ChangeTablesShow: true
    };
  },
  mounted() {
    this.init()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".TableDismantling", [
      ".TableDismantling .toolbar",
      ".TableDismantling .block",
      ".TableDismantling #crumbs"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "MsChgList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MRM"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
        _this.dictionaryData.MRM.unshift({
          name: '全部',
          value: '',
          id: 0
        })
      })
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
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
    //导入
    importExcel(file){
      this.$refs.TableDismantlingHandle.importExcel(file)
    },
    // 下载模板/导出（调子页面下载模板/导出方法）
    exportExcel() {
      if (this.TableDismantlingHandleShow) {
        this.$refs.TableDismantlingHandle.exportExcel()
      } else if (this.DetailedEnquiriesVisible) {
        this.$refs.DetailedEnquiries.exportExcel()
      }
    },
    // 详情按钮
    details(row) {
      this.editNeedData = row
      this.editNeedData.busicode  = 'MsChgUpdate'
      this.editNeedData.saveType  = 'edit'
      this.TableDismantlingHandleShow = true
      this.ChangeTablesShow = false
    },
    // 添加
    add() {
      this.editNeedData.processState  = ''
      this.editNeedData.id  = ''
      this.editNeedData.busicode  = 'MsChgAdd'
      this.editNeedData.saveType  = 'add'
      this.TableDismantlingHandleShow = true;
      this.ChangeTablesShow = false;
    },
    // 暂存（调详情页面保存方法）
    save() {
      this.$refs.TableDismantlingHandle.save()
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    },
    closeDialog() {
      this.DetailedEnquiriesVisible = false //查看历史
      this.TableDismantlingHandleShow = false //详情界面
      this.ChangeTablesShow = true //index页面
      this.init()
    },
    // 明细查询
    getDetailedEnquiries() {
      this.DetailedEnquiriesVisible = true
      this.ChangeTablesShow = false
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.TableDismantling {
  width: 100%;
  height: 100%;
}
</style>
