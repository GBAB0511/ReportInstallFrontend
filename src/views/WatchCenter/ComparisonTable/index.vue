<template>
  <div class="ComparisonTable">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="backfillVisible">
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="waterAddVisible">
        <el-button size="mini" type="primary" @click="save">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="ComparisonTableShow">
        <el-button icon="el-icon-plus" @click="add" size="mini" type="primary">添加</el-button>
      </div>
    </div>
    <!-- 详情 -->
    <ComparisonTableHandle v-if="backfillVisible" :editNeedData='editNeedData' ref="ComparisonTableHandle"></ComparisonTableHandle>

    <!-- 添加 -->
    <ComparisonTableEdit v-if="waterAddVisible" :editNeedData='editNeedData' ref="ComparisonTableEdit"></ComparisonTableEdit>

    <section style='height:calc(100% - 41px)' v-show="ComparisonTableShow">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label='单据日期：'>
              <el-date-picker v-model="tableTime" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="状态">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水表类型：">
              <el-select ref="select2" clearable v-model="tableQuery.meterType" placeholder="水表类型">
                <el-option v-for="item in dictionaryData.MMT" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="模糊查询：" class="width-200">
              <el-tooltip class="item" effect="dark" content="用户编号、水表编号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="用户编号、水表编号" v-model="tableQuery.fuzzyQuery" @keydown.enter.native="search"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
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

          <el-table-column prop="operator" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号">
          </el-table-column>

          <el-table-column prop="meterNo" min-width="80" label="水表编号">
          </el-table-column>
          
          <el-table-column prop="meterTypeName" min-width="80" label="水表类型">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="checkResultName" min-width="80" label="校核结果" show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)" class="noclick">详情</el-button>
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
    </section>
  </div>
</template>
<script>
import ComparisonTableEdit from "./ComparisonTableEdit";
import ComparisonTableHandle from "./ComparisonTableHandle";
export default {
  name: "ComparisonTable",
  components: {
    ComparisonTableEdit,
    ComparisonTableHandle
  },
  data() {
    return {
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate:'',
        endDate:'',
        processState:'',
        meterType:'',
        fuzzyQuery:'',
      },
      // 列表数据
      tableData: [],
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 单据日期数组
      tableTime: [],
      test:this.common.date(-1*24*60*60*1000),

      // 详情页所需数据
      editNeedData: {},
      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "校表" }]
      },
      tableShow: false,
      maxHeight: 0,
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      waterAddVisible: false, //添加弹窗的显示和隐藏
      backfillVisible: false,
      ComparisonTableShow: true
    };
  },
  mounted() {
    this.init()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, '.ComparisonTable', ['.ComparisonTable .toolbar', '.ComparisonTable .block', '.ComparisonTable #crumbs'])
    })
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
      this.getDatePicker(this.tableTime)
      var params = {
        "busicode": "MsVeriList",
        "data": this.tableQuery
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res
        
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMT"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
        _this.dictionaryData.MMT.unshift({
          name: '全部',
          value: '',
          id: 0
        })
      })
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
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 添加
    add() {
      this.editNeedData.processState  = ''
      this.editNeedData.id  = ''
      this.editNeedData.busicode  = 'MsVeriAdd'
      this.editNeedData.saveType  = 'add'
      this.waterAddVisible = true
      this.ComparisonTableShow = false
    },
    // 添加-暂存
    save() {
      this.$refs.ComparisonTableEdit.save()
    },
    // 详情
    details(row) {
      this.editNeedData  = row
      this.editNeedData.busicode  = 'MsVeriUpdate'
      this.editNeedData.saveType  = 'edit'
      this.backfillVisible = true;
      this.ComparisonTableShow = false;
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
      //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.DetailedEnquiriesVisible = false;
      this.DetailsOfTableChangeVisible = false;
      this.ComparisonTableShow = true;

      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterAddVisible = false;
    },
    
    backfillSubmit() { }
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
// @import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.ComparisonTable {
  width: 100%;
  height: 100%;
}
</style>
