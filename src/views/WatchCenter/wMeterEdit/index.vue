<template>
  <div class="wMeterEdit">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="wMeterEditVisible">
        <el-button icon="el-icon-bottom" @click="exportExcel" size="mini" type="primary" v-if="editNeedData.processState==''">下载模板</el-button>
        <el-upload v-if="editNeedData.processState==''" class="upload-demo" multiple   :http-request="importExcel">
          <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
        </el-upload>
        <el-button v-if="editNeedData.processState==''" size="mini" type="primary" @click="save">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button icon="el-icon-upload2" @click="exportList" size="mini" type="primary">导出</el-button>
        <el-button icon="el-icon-plus" @click="add" size="mini" type="primary">添加</el-button>
      </div>
    </div>
    <div v-if="wMeterEditVisible"  class="wMeterEditCon">
      <wMeterNotStructEditAdd v-if="structural==='0'" ref="wMeterEditAdd" :editNeedData="editNeedData"></wMeterNotStructEditAdd>
       <wMeterEditAdd v-else ref="wMeterEditAdd" :editNeedData="editNeedData"></wMeterEditAdd>
    </div>
    <div v-else class="wMeterEditCon">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='单据日期：'>
            <el-date-picker v-model="DateChoosevalue" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="状态">
              <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="用户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="用户编号" v-model="tableQuery.userNo" clearable size="mini" class="fuzzy-query-input" @keydown.enter.native="init"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="init" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="150" label="当前处理人"  show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="120" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="110" label="单据日期"></el-table-column>

          <el-table-column prop="userNos" min-width="140" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="updateAmount" min-width="80" label="修改数量" align="right">
          </el-table-column>

          <el-table-column prop="deleteAmount" min-width="80" label="删除数量" align="right">
          </el-table-column>

          <el-table-column prop="comments" min-width="120" label="备注"  show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="160">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.processState=='' || scope.row.processState=='register'" class="noclick" @click="deleteBill(scope.row)">删除</el-button>
              <el-button type="text" class="noclick" @click="details(scope.row)">详情</el-button>
              <el-button type="text" class="noclick" @click="showChangeItems(scope.row.id)">变动情况</el-button>
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
    <el-dialog
      title="变动情况"
      :close-on-click-modal="false"
      :visible.sync="changeItemsVisible"
      class="common-dialog"
      @close="closeDialog"
    >
      <change-items v-if="changeItemsVisible" ref="changeItems" />
    </el-dialog>
  </div>
</template>
<script>
import ChangeItems from './changeItems.vue';
import wMeterEditAdd from "./wMeterEditAdd";
import wMeterNotStructEditAdd from "./wMeterNotStructEditAdd";
export default {
  name: "wMeterEdit",
  components: {
    wMeterEditAdd,
    wMeterNotStructEditAdd,
    ChangeItems
  },
  data() {
    return {
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate:'',
        endDate:'',
        processState: '',
        userNo:'',
      },
      // 状态下拉框数据
      processStateData: this.common.processState(),
      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "变更" }]
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      wMeterEditVisible: false, //添加弹窗的显示和隐藏
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: ["",""],
      //审批状态下拉框
      approvalStatusOptions: [
        { value: "1", name: "全部" },
        { value: "2", name: "草稿" },
        { value: "3", name: "进行中" },
        { value: "4", name: "已办结" },
        { value: "5", name: "已废弃" }
      ],
      editNeedData:{},
      structural:0,//默认水表型号不结构化  0 否 1 是
      changeItemsVisible: false
    };
  },
  mounted() {
    this.init();
    this.getStruct()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".wMeterEdit", [
      ".wMeterEdit .toolbar",
      ".wMeterEdit .block",
      ".wMeterEdit .bread-contain"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let _this = this;
      this.getDatePicker(this.DateChoosevalue)
      let params = {
        busicode: "WmChgList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    deleteBill(row){
      let _this = this
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = {
            busicode: "WmChgDelete",
            data:row.id
          };
          this.$api
            .fetch({ params })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              _this.init();
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getStruct(){  //判断当前水司水表型号是否结构化
      let _this = this
      var params = {
        busicode: "ConfigList",
        data:{searchContent:'MR_WATER_MODEL_STRUCT'}
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = res.list
          if(data!=null && data.length > 0) {
            _this.structural = data[0].configValue
          }else
            _this.structural = '0'
        })
        .catch(res => {

        });
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
    // 上传模板
    uploading() {
      this.uploadingVisible = true
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
    showChangeItems(id) {
      this.changeItemsVisible = true
      this.$nextTick(() => {
        this.$refs.changeItems.init(id)
      })
    },
    closeDialog() {
      //关闭会话
      this.wMeterEditVisible = false;
      this.changeItemsVisible = false
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childwMeterEdit.submit();
    },
    // 编辑
    details( row) {
      this.wMeterEditVisible = true;
      this.editNeedData  = row
      this.editNeedData.busicode  = 'WmChgUpdate'
      this.editNeedData.saveType  = 'edit'

    },
    // 添加
    add() {
      this.editNeedData.processState  = ''
      this.editNeedData.id  = ''
      this.editNeedData.busicode  = 'WmChgAdd'
      this.editNeedData.saveType  = 'add'
      this.wMeterEditVisible = true;
    },
    // 暂存（调子页面保存方法）
    save() {
      this.$refs.wMeterEditAdd.save()
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.histroyData.list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 下载模板（调子页面下载模板方法）
    exportExcel() {
      this.$refs.wMeterEditAdd.exportExcel()
    },
    // 导入按钮
    importExcel(file) {
      let _this = this;
      let busicode = '';
      if(this.structural==='0')
        busicode = 'WmChgImport'
      else
        busicode = 'WmChgImport'
      let params = {
        busicode: busicode,
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        // this.$refs.wMeterEditAdd.updateTabelDate = res.list
        this.$refs.wMeterEditAdd.getMeterData(res.list)
        this.$message({
            type: "success",
            message: "导入成功"
          });
      })
    },
    // 导出
    exportList(){
        let params = {
          busicode: "WmChgExport",
          data: this.tableQuery,
          token: sessionStorage.getItem("token"),
          sysType: '002',
      };
      console.log('params', params)
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)));
    }
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
.wMeterEdit {
  width: 100%;
  height: 100%;
  .wMeterEditCon {
    width:100%;
    height:calc(100% - 41px)
  }
}
</style>
