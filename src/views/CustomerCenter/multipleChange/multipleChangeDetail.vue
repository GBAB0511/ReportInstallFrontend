<template>
  <div class="multipleChangeDetail">
    <legend class="legendColumn">单据信息</legend>
    <el-form ref="billInfo" :model="billInfo" class="formBill-Two" :inline="true" size="mini" label-position="right">
      <el-form-item label="单据编号：" class="disable-item">
        <span>{{billInfo.billNo}}</span>
      </el-form-item>
      <el-form-item label="单据日期："  class="disable-item">
        <span>{{billInfo.billDate}}</span>
      </el-form-item>
    </el-form>
    <legend class="legendColumn">变更信息</legend>
    <div>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="用户编号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.userNo" @keydown.enter.native="init" clearable></el-input>
          </el-form-item>
          <el-form-item label="变动字段：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.item" @keydown.enter.native="init" clearable></el-input>
          </el-form-item>
          <el-form-item label="旧值：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.oldVal" @keydown.enter.native="init" clearable></el-input>
          </el-form-item>
          <el-form-item label="新值：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.newVal" @keydown.enter.native="init" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            <el-button size="mini" type="primary" @click="restore" v-if="processState=='END'">还原</el-button>
            <!-- <el-upload action="/" class="upload-demo" multiple  :http-request="reImport">
              <el-button icon="el-icon-download" size="mini" type="primary">重新导入</el-button>
            </el-upload> -->
          </el-form-item>
          <el-form-item style="float:right;" v-if="processState!='END'">
            <el-upload action="/" class="upload-demo" multiple  :http-request="reImport">
              <el-button icon="el-icon-download" size="mini" type="primary">重新导入</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table highlight-current-row :data="tableData.list" stripe border :max-height="230">
          <el-table-column align="center" type="index" label="NO." width="80" :index="indexMethod"></el-table-column>
          <el-table-column label="用户编号" prop="userNo" min-width="120px"></el-table-column>
          <el-table-column label="变动字段" prop="changeItem" min-width="120px"></el-table-column>
          <el-table-column label="旧值" prop="oldItemValue" min-width="120px"></el-table-column>
          <el-table-column label="新值" prop="newItemValue" min-width="120px"></el-table-column>
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
     <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
  </div>
</template>

<script>
export default {
  props: ["id","processState"],
  data() {
    return {
      form: {},
      tableQuery: {
        userNo: '',
        item: '',
        oldVal: '',
        newVal: '',
        id:'',
        page: 1,
        pageCount: 20
      },
      tableData: {
        list: [],
        total: 0
      },
      billInfo:{

      }
    }
  },
  mounted(){
    this.init();
    
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      this.tableQuery.id=this.id
      let params = {
        busicode: "ChangeUserImportQuery",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.billInfo=res.bill;
          this.getHtmlData();
          this.tableData = res.items;
        })
    },
    restore(){
      this.$confirm("此操作将还原该单据做出的变更, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.remove();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    remove(){
      let params = {
        busicode: "ChangeUserImportRestore",
        data: {id:this.id}
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.$message({
            message: "还原成功。",
            type: "success"
          });
        })
    },
    search() {
      this.page = 1
      this.pageCount = 20
      this.init()
    },
    reImport(file) {
      let _this = this;
      let params = {
        busicode: "ChangeUserImport",
        type: 'import',
        data: {
          file: file.file,
          id:this.id,
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.init();
        this.$parent.setId(res.id)
        this.$parent.showDetailMethod(true,false,false)
      })
    },
    getFormbData(){
      return {}
    },
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "user_change_import",
        "审批流配置:" + _this.billInfo.processName + "(" + _this.billInfo.billNo + ")",
        _this.billInfo.id,
        _this.billInfo.processInstanceId,
        "workflowDiv",
        _this, (res) => {
          if (window.location.href.indexOf("HallBusiness") > -1 || window.location.href.indexOf("PendingTrial") > -1 || window.location.href.indexOf("WaterSideIndex") > -1) {
            // 流程中心模块触发
            this.$parent.$parent.closeDialog ? this.$parent.$parent.closeDialog() : this.$parent.closeDialog();
          } else {
            // 普通模块触发
            this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        1,
        ''
      );
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
      this.tableQuery.page = val;
      this.init();
    },
  }
}
</script>

<style lang="scss" scoped>
.formBill-Two {
  height: 50px;
}
</style>