<template>
  <!-- 开户 -->
  <div class="OpenAccount">

    <div v-if="indexShow" class='indexPage' style="height:100%">

      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <!--el-button icon="el-icon-plus" size="mini" type="primary" @click.native="add">添加</el-button-->
          <el-button icon="el-icon-plus" size="mini" type="primary" @click.native="add">添加</el-button>
        </div>
      </div>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <!-- <el-form-item class="form-left"> -->
            <el-form-item label='单据日期：'>
              <el-date-picker v-model="billTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="">
                <el-option v-for="(item,index) in processStateData" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="模糊查询：" class="searchInput">
              <el-tooltip class="item" effect="dark" content="单据编号、用户编号、旧用户编号、客户名称、客户编号、账户编号、客户地址" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
            </el-form-item>
          <!-- </el-form-item> -->
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed="left">
          </el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="createName" min-width="100" label="制单人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="details(scope.$index, scope.row)">详情</el-button>
              <el-button type="text" size="mini" v-if="scope.row.processState=='草稿'" @click="deleteRow(scope.$index, scope.row)">删除</el-button>

            </template>
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination v-if="pageShow"
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

    <div v-else class='EditPage' style="height:100%">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <el-button type="primary" size="mini" v-if="buttomShow" @click="submit(status)">保 存</el-button>
          <el-button icon="el-icon-bottom" v-if="errorShow" @click="exportErrorExcel" size="mini" type="primary" >导入错误</el-button>
          <el-button icon="el-icon-bottom" v-if="buttomShow" @click="exportExcel" size="mini" type="primary" >下载模板</el-button>
          <el-upload action="/" class="upload-demo" multiple   :http-request="importExcel" v-if="buttomShow">
            <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
          </el-upload>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
        </div>
      </div>
      <OpenAccountList  v-if="!indexShow" ref="childList" :billStute="status" :idCuster="id"></OpenAccountList>
      <!--OpenAccountEdit ref="childWarehousing" :billStute="status" :idCuster="id" @chooseCtm="choosectm" @chooseAccount="chooseAccount"></OpenAccountEdit lgc-->
      <!-- <OpenAccountEditTest ref="childWarehousing" :billStute="status" :idCuster="id" @chooseCtm="choosectm" @chooseAccount="chooseAccount"></OpenAccountEditTest> -->
    </div>
  </div>
</template>
<script>
import OpenAccountEdit from './OpenAccountEdit'
import OpenAccountList from './OpenAccountList'
import OpenAccountEditTest from './test1'
export default {
  name: "OpenAccount",
  components: {
    OpenAccountEdit,
    OpenAccountList,
    OpenAccountEditTest
  },
  data() {
    return {
      // disabledClose:false,
      pageShow:true,//分页页码显示
      id: "",//详情主键id
      status: 'OpenUserAdd',//添加add 修改update
      chooseAccountName: "选择账户",
      chooseAccountVisible: false,
      choosectmName: "选择客户",
      choosectmVisible: false,
      tableEdit: false,
      activeName: 'EngineeringAccountOpening',
      indexShow: true,
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户管理' },
          { title: '开户' },
        ],

      },
      processStateData:this.common.processState(),
      billTime: [],//单据日期
      //审批状态下拉框
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: '',
        endDate: '',
        fuzzyQuery: "",
        status: '',
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      errorShow:false,//导入存在错误时导出错误数据
      flag:1,//初始化时判断是否要进入详情页
      buttomShow: true,//保存按钮是否展示
      AttachmentQty:0,//附件个数
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
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {

      let _this = this
      this.pageShow=false;
      if (!_this.billTime ) {
        _this.tableQuery.beginDate = '';
        _this.tableQuery.endDate = '';
      } else {
        _this.tableQuery.beginDate = _this.billTime[0];
        _this.tableQuery.endDate = _this.billTime[1];
      }
      let params = {
        "busicode": "OpenUserList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res;
        this.pageShow=true;
        this.errorShow=false;
        // if(res.list.length===1 && this.flag===0){
        //   _this.details(0, res.list[0]);
        // }
    
        })
        
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.$nextTick(() => {
        this.common.changeTable(this, '.OpenAccount .indexPage',
        ['.indexPage .toolbar', '.indexPage .block', '.indexPage .bread-contain'])
        })
    },
    initAccessory(){    //初始化附件个数
        let _this = this;
          let params = {
            busicode: "ReceiptAccessoryList",
             data: {
              receiptType: "USER_OPEN",
              receiptId: this.id
            }
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res != null && res.length > 0) {
              _this.AttachmentQty = res.length
          }

        });
    },
    search() {  //查询
      this.flag=0
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init()
    },
    indexMethod(index) {//获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      if (val) {
        this.tableQuery.page = val;
      }
      this.init();
    },
    closeDialog() { //关闭会话
      this.flag = 1;
      this.TransferDetailsVisible = false;
      this.indexShow = true;
      this.init()
    },
    submit(type){
      this.$refs.childList.save(type);
    },
    //添加
    add() {
      this.id = '';
      this.status = 'OpenUserAdd';
      this.$store.state.isRemove = false;
      this.tableEdit = false;
      this.indexShow = false;
      this.buttomShow = true;
      this.AttachmentQty = 0;
    },
    importExcel(file){
      let _this = this;
      let params = {
        busicode: "OpenUserImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$refs.childList.addList(res.returnMap);
        this.errorShow = res.flag>0?true:false;
        if(res.flag>0){
          this.$message({
            type: "warning",
            message: "存在导入失败数据，请下载错误修改后再导入"
          });
        }else{
          this.$message({
            type: "success",
            message: "导入成功"
          });
        }

      })
    },
    // 下载模板按钮
    exportExcel() {
      var params = {
        busicode: "OpenUserExport",
        data: {
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURIComponent(JSON.stringify(params))
      );
    },
    // 导入错误按钮
    exportErrorExcel() {
      var params = {
        busicode: "OpenUserErrorExport",
        data: {
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
       window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    uploadAttachment(file) {
        this.$refs.childList.uploadAttachment(file);
    },
    viewAttachment() {
        this.$refs.childList.viewAttachment('show');
    },
    // 编辑
    details(i, row) {

      this.status = 'OpenAccUpdate';
      this.tableEdit = true;
      this.id = row.id;
      this.indexShow = false;
      this.AttachmentQty = 0;
      this.initAccessory();
      if (
        row.processState == "进行中" ||
        row.processState == "已办结" ||
        row.processState == '已废弃'
      ) {
        this.buttomShow = false;
        // this.disabledClose = true
      } else {
        this.buttomShow = true;
        // this.disabledClose = false
      }
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
    //删除
    remove(row) {
      let params = {
        "busicode": "OpenAccDelete",
        "data":{
          id: row.id,
        }
      };
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.$message({
          message: '删除成功',
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
  .OpenAccount {
    height: 93%!important;
    .el-upload-list {
    display: none;
  }
  }
</style>
