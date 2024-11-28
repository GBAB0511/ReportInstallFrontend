<template>
  <!-- 换表 -->
  <div class="change-tables">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="DetailedEnquiriesVisible">
        <el-button type="primary" size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="ChangeTablesShow">
        <el-button size="mini" type="primary" @click="DetailedEnquiries">历史查询</el-button>
        <el-button @click="add" size="mini" icon="el-icon-plus" type="primary">添加</el-button>
      </div>
      <!-- 详情界面 -->
      <div class="bread-contain-right" v-if="ChangeTablesHandleVisible">
        <font v-if="editNeedData.processState==''">
          <el-button size="mini" type="primary" @click="save">暂存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
        <font v-else-if="editNeedData.processState == 'backfill' ">
          <el-button icon="el-icon-bottom" @click="exportExcel" size="mini" type="primary">下载模板</el-button>
          <el-upload  class="upload-demo" multiple  action="/"   :http-request="importExcel">
            <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
          </el-upload>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
        <font v-else>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </font>
      </div>
    </div>
    <!-- 历史查询 -->
    <div v-if="DetailedEnquiriesVisible" class='indexContent'>
      <DetailedEnquiries ref="DetailedEnquiries"></DetailedEnquiries>
    </div>
    <!-- 详情 -->
    <div v-if="ChangeTablesHandleVisible" class='indexContent'>
      <ChangeTablesHandle ref="ChangeTablesHandle" :editNeedData ='editNeedData'></ChangeTablesHandle>
    </div>

    <div class='indexContent' v-if="ChangeTablesShow">

      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='单据日期：'>
            <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="状态">
              <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="换表类型：">
            <el-select ref="select2" clearable v-model="tableQuery.replaceType" placeholder="换表类型">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in dictionaryData.MCM" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

       <el-form-item label="用户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" clearable placeholder="请输入用户编号" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item label="单据编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.billNo" placeholder="请输入单据编号" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item class="button-group">
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="nodeName" min-width="100" label="进度">
          </el-table-column>

          <el-table-column prop="operator" min-width="100" label="当前处理人"  show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="90" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期">
          </el-table-column>

          <el-table-column prop="replaceTypeName" min-width="100" label="换表类型">
          </el-table-column>

          <el-table-column prop="planFinishDate" min-width="100" label="计划完工日期">
          </el-table-column>

          <el-table-column prop="replaceStaffName" min-width="80" label="换表员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterAmount" min-width="80" label="换表量" align="right">
          </el-table-column>

          <el-table-column prop="backfillAmount" min-width="80" label="已换量" align="right">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" class="noclick" @click="details(scope.row)">详情</el-button>
               <!-- <span>|</span> -->
              <!-- <el-button type="text" class="noclick" @click="check(scope.row)">校验</el-button> -->
              <!-- <span>|</span> -->
              <el-button type="text" class="noclick" v-if="scope.row.processState == '' || scope.row.processState == 'register'" @click="remove(scope.row)">删除</el-button>
           
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
          >
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import DetailedEnquiries from "./DetailedEnquiries";//历史查询
import ChangeTablesHandle from "./ChangeTablesHandle";//添加
export default {
  name: "change-tables",
  components: {
    DetailedEnquiries,// 历史查询
    ChangeTablesHandle,// 添加
  },
  data() {
    return {
      
      // 详情页面所需数据
      editNeedData : {},
      // 列表数据
      tableData: [],
      Time: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        processState: '',
        receiptType: 1,
        replaceType: '',
        beginDate:"",
        endDate:"",
        userNo:""
      },
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 高级查询
      isActive: false,
      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "换表" }]
      },
      tableShow: false,
      maxHeight: 0,
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      ChangeTablesHandleVisible: false,
      DetailedEnquiriesVisible: false,
      ChangeTablesShow: true,
      meterBoreData:[],
    };
  },
  mounted() {
    this.init()
    this.getDictionary()
    this.getMeterBore()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".change-tables", [
      ".change-tables .toolbar",
      ".change-tables .block",
      ".change-tables #crumbs"
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
      let _this = this;
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
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MCM"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 水表口径下拉数据
    getMeterBore() {
      var _this = this
      var params = {
        "busicode": "MeterBoreList",
        "data": {page:1,pageCount:999}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterBoreData = res.list
      })
    },
    //   详情按钮
    details(row) {
      this.ChangeTablesShow = false
      this.editNeedData  = row
      this.editNeedData.busicode  = 'MsChgUpdate'
      this.editNeedData.saveType  = 'edit'
      this.ChangeTablesHandleVisible = true
    },
     // 主页面列表删除按钮
    remove(row) {
      var _this = this
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = {
            "busicode": "MsChgDelete",
            "data": row.id
          }
          _this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$message({
              type: "success",
              message: "删除成功!"
            })
            _this.init()
          })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加
    add() {
      this.editNeedData.processState  = ''
      this.editNeedData.id  = ''
      this.editNeedData.busicode  = 'MsChgAdd'
      this.editNeedData.saveType  = 'add'
      this.ChangeTablesHandleVisible = true;
      this.ChangeTablesShow = false;
    },
    // 暂存（调子页面保存方法）
    save() {
      this.$refs.ChangeTablesHandle.save()
    },
    //导入
    importExcel(file){
      this.$refs.ChangeTablesHandle.importExcel(file)
    },
    // 下载模板/导出（调子页面下载模板/导出方法）
    exportExcel() {
      if (this.ChangeTablesHandleVisible) {
        this.$refs.ChangeTablesHandle.exportExcel()
      } else if (this.DetailedEnquiriesVisible) {
        this.$refs.DetailedEnquiries.exportExcel()
      }

    },
    // 高级查询
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".change-tables", [
          ".change-tables .toolbar",
          ".change-tables .block",
          ".change-tables #crumbs"
        ]);
      });
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
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    // 子页面的返回按钮
    closeDialog() {
        this.ChangeTablesHandleVisible = false //详情页面
        this.DetailedEnquiriesVisible = false //查看历史界面
        this.ChangeTablesShow = true //index页面
        this.init()
    },
    // 明细查询
    DetailedEnquiries() {
      this.DetailedEnquiriesVisible = true;
      this.ChangeTablesShow = false;
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
.change-tables {
  width: 100%;
  height: 100%;
}
</style>
