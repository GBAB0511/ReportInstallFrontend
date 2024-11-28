<template>
  <div class="Transfer">

    <el-dialog title="欠费明细" class="button-dialog" :close-on-click-modal="false" :visible.sync="DetailsArrearsShow" append-to-body>
      <DetailsArrears ref="detailsArrears" :formData="formData"></DetailsArrears>
    </el-dialog>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div v-if="TransferEditVisible" class="bread-contain-right">
        <el-button type="primary" size="mini" @click="detailsArrears()" v-if="arrearsShow">欠费明细</el-button>
        <el-button type="primary" size="mini" @click="submit(status)" v-if="buttomShow">保 存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
      </div>
      <div v-else class="bread-contain-right">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="add">添加</el-button>
      </div>
    </div>

    <div v-if="TransferEditVisible" class='indexContent'>
      <TransferEdit ref="childWaterEditor" :disabledAddDetail="disableForm" :idCuster="formData" :billStute="status"></TransferEdit>
    </div>

    <div class="indexContent" v-else>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='单据日期：'>
            <el-date-picker v-model="billTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="未审">
              <el-option v-for="(item,index) in processStateData" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="单据编号、用户编号、旧用户编号、客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="80" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号">
          </el-table-column>

          <el-table-column prop="changeItems" min-width="200" label="变更事项" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createName" min-width="100" label="制单人">
          </el-table-column>
          <el-table-column prop="flux" min-width="120" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="details(scope.$index, scope.row)">详情</el-button>
              <el-button type="text" size="mini" v-if="scope.row.processState=='草稿'" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
            <el-pagination @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableQuery.page"
              :page-sizes="[20, 100, 500, 1000]"
              :page-size="tableQuery.pageCount"
              layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import TransferEdit from './TransferEdit'
import DetailsArrears from "@/components/DetailsArrears/index"//欠费明细
export default {
  name: "Transfer",
  components: {
    TransferEdit,
    DetailsArrears
  },
  data() {
    return {
      disableForm:false,
      formData:{
        id:'',
        userNo:'',
      },
      DetailsArrearsShow:false,
      buttomShow:false,//只有草稿状态 删除按钮才显示
      arrearsShow: false,
      TransferEditVisible: false,
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户管理' },
          { title: '过户' }
        ],

      },

      status:'TransferUserAdd',//增加add 修改update
      processStateData: this.common.processState(),//审批状态下拉框
      billTime: [],//单据日期
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: '',
        endDate: '',
        fuzzyQuery: "",
        status: '',
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
      tableData: {},
      TransferEditVisible: false,  //编辑的显示和隐藏
    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.Transfer', ['.Transfer .toolbar', '.Transfer .block', '.Transfer #crumbs'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
         enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let _this = this
      if (!_this.billTime ) {
        _this.tableQuery.beginDate = '';
        _this.tableQuery.endDate = '';
      } else {
        _this.tableQuery.beginDate = _this.billTime[0];
        _this.tableQuery.endDate = _this.billTime[1];
      }
      let params = {
        "busicode": "TransferUserList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res;
      })
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
    // 欠费明细
    detailsArrears(){
      this.DetailsArrearsShow = true;
      this.$refs['detailsArrears'].init();
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
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    closeDialog() { //关闭会话
      this.TransferEditVisible = false;
      this.arrearsShow = false;
      this.deleteShow = false;
      this.init()
    },
    //保存
    submit(type){
      this.$refs.childWaterEditor.submit(type);
    },
    // 编辑
    details(i,row) {
      this.status = 'TransferUserUpdate';
      this.formData.id = row.id;
      this.arrearsShow = true;
      this.formData.userNo = row.userNo;
      if (
        row.processState == "进行中" ||
        row.processState == "已办结" ||
        row.processState == '已废弃'
      ) {
        this.buttomShow = false;
        this.disableForm = true
      } else {
        this.buttomShow = true;
        this.disableForm = false
      }
      this.TransferEditVisible = true;
    },
    // 添加
    add() {
      this.status = 'TransferUserAdd';
      this.formData.userNo = '';
      this.formData.id = '';
      this.arrearsShow = false;
      this.buttomShow = true;
      this.TransferEditVisible = true;
    },
    deleteRow(index,row) {
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
    //
    remove(row) {
      let params = {
        "busicode": "TransferUserDelete",
        "data":{
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
.Transfer {
  width: 100%;
  height: 100%;
}
</style>
