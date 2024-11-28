
<template>
  <div class="multiplexing">
    <!-- 弹出表单选择用户 -->
    <el-dialog :title="chooseuserName" :visible.sync="chooseuserVisible" :close-on-click-modal="false" class="button-dialog" @close="closeChooseuser">
      <chooseuser ref="childWaterEditor"></chooseuser>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain>确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeChooseuser">取 消</el-button>
      </div>
    </el-dialog>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div v-if="multiplexingEditVisible" class='bread-contain-right'>
        <!-- <el-button type="primary" size="mini">上传附件</el-button> -->
        <el-button type="primary" size="mini" @click="submit(status)" v-if="buttomShow">保 存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
      </div>
      <div v-else class="bread-contain-right">
        <el-button @click="acceptFormPrint" size="mini" type="primary">复用受理单打印</el-button>
        <el-button icon="el-icon-plus" size="mini" @click="multAdd" type="primary">添加</el-button>
        <!-- <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button> -->
      </div>
    </div>

    <div class='indexContent' v-if="multiplexingEditVisible">
      <multiplexingEdit ref="childmultiplexing" :billStute="status" :idCuster="multiplexingEditData"></multiplexingEdit>
    </div>

    <div class='indexContent' v-else>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='单据日期：'>
            <el-date-picker v-model="billTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="未审">
              <el-option v-for="(item,index) in approvalStatusOptions" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="单据编号、用户编号、旧用户编号、客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" fixed="left">
          </el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号">

          </el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称">
          </el-table-column>
          <!--
          <el-table-column prop="reuseMeterFlag" :formatter="formatter" min-width="80" label="是否复表">
          </el-table-column> -->

          <el-table-column prop="comments" min-width="80" label="复用说明" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createName" min-width="80" label="制单人" >
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">

              <el-button type="text" size="mini" @click="details(scope.$index, scope.row)">详情</el-button>
              <el-button type="text" size="mini" v-if="scope.row.processState=='草稿'" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
import multiplexingEdit from './multiplexingEdit'
import chooseuser from "../Transfer/chooseuser"
export default {
  name: "multiplexing",
  components: {
    multiplexingEdit,
    chooseuser
  },
  data () {
    return {
      buttomShow: false, //删除按钮的显示与隐藏
      status: 'ReuseUserAdd',//add新增 updata修改
      multiplexingEditData: {
        id: '',
      },
      chooseuserName: "选择用户",
      chooseuserVisible: false,
      multiplexingEditVisible: false,
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户管理' },
          { title: '复用' }
        ],

      },
      approvalStatusOptions: this.common.processState(),//审批状态下拉框
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        fuzzyQuery: "",
        status: "",
      },
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      billTime: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      userNos: [],
      selectData: [],

    }
  },
  mounted () {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.multiplexing', ['.multiplexing .toolbar', '.multiplexing .block', '.multiplexing #crumbs'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    init () {
      let _this = this
      if (!_this.billTime) {
        _this.tableQuery.beginDate = '';
        _this.tableQuery.endDate = '';
      } else {
        _this.tableQuery.beginDate = _this.billTime[0];
        _this.tableQuery.endDate = _this.billTime[1];
      }
      let data = _this.tableQuery;
      let params = {
        "busicode": "ReuseUserList",
        data,
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },

    demand () {  //查询
      this.init()
    },
    deleteRow (index, row) {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove(row)
      }).catch((res) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    remove (row) {//删除
      let params = {
        "busicode": "ReuseUserDelete",
        "data": {
          id: row.id,
        }
      };
      let message = '删除成功！';
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.$message({
          message,
          type: 'success'
        });
        this.init()
      })
    },
    formatter (row, column, cellValue, index) {
      return row.reuseMeterFlag == '1' ? '是' : '否'
    },
    //   导出
    exportExcel () {
    },
    //分页
    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange (val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod (index) {//获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)

    },
    closeDialog () { //关闭会话
      this.multiplexingEditVisible = false;
      this.init()
    },
    closeChooseuser () {
      this.chooseuserVisible = false;
    },

    //保存
    submit (type) {
      this.$refs.childmultiplexing.submit(type);
    },
    details (i, row) {
      this.multiplexingEditData.id = row.id;
      this.status = 'ReuseUserUpdate';
      this.multiplexingEditVisible = true;
      if (
        row.processState == "进行中" ||
        row.processState == "已办结" ||
        row.processState == '已废弃'
      ) {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
    },
    multAdd () {
      this.multiplexingEditData.id = '';
      this.status = 'ReuseUserAdd';
      this.multiplexingEditVisible = true;
      this.buttomShow = true;
    },
    // 打印复用受理单
    acceptFormPrint () {
      let command = 3; // 复表受理单
      if (this.userNos.length == 0) {
        this.$message.warning('请至少选择一条受理单')
        return
      }
      let params = {
        busicode: "ChangeUserAcceptPrint",
        data: {
          printType: command,
          userNos: this.userNos
        }
      };
      this.$api.fetch({ params: params }).then(async res => {
        let data = res
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        for (let i = 0; i < data.length; i++) {
          await this.common.print('print', 'ChangeUserAcceptPrint', '', data[i], this);
        }
        this.selectData.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
        this.userNos = []
        let select = []
        this.handleSelectionChange(select)
      })
    },
    // 选中事件
    handleSelectionChange (val) {
      this.selectData = val;
      this.userNos = [];
      //   this.multipleSelection = val;
      val.forEach(item => {
        if (this.userNos.every(userNoItem => userNoItem !== item.userNo)) {
          this.userNos.push(item.userNo);
        }
      })
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.multiplexing {
  width: 100%;
  height: 100%;
}
</style>
