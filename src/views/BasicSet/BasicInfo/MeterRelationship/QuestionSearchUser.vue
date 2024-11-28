
<template>
  <div class="QuestionSearchUser">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
        <el-form-item label="客户名称：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.ctmName" clearable placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="用户编号：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.userNo" clearable placeholder="请输入用户编号"></el-input>
        </el-form-item>
        <el-form-item label="起止户号：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.startUserNo" clearable placeholder="请输入开始户号"></el-input>
        </el-form-item>
        -
        <el-form-item class="width-200" style="margin-left: 7px">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.endUserNo" clearable placeholder="请输入截止户号"></el-input>
        </el-form-item>
        <el-form-item label="册本号：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.bookNo" clearable placeholder="请输入册本号"></el-input>
        </el-form-item>
        <!--el-form-item label="模糊查询：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder></el-input>
        </el-form-item-->
        <el-form-item>
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table
        stripe
        border
        v-if="tableShow" :max-height="maxHeight"
        :data="tableData.list"
        class="wuserInfo-table"
        highlight-current-row
        @selection-change="selectOne"
      >
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

        <el-table-column prop="bookNo" min-width="100" label="册本号"></el-table-column>

        <el-table-column prop="userNo" min-width="80" label="用户编号" show-overflow-tooltip></el-table-column>

        <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>

        <el-table-column prop="mobile" min-width="80" label="手机号码" show-overflow-tooltip></el-table-column>

        <el-table-column prop="ctmAddr" min-width="80" label="用户地址" show-overflow-tooltip></el-table-column>

      </el-table>
     
    </div>
     <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //流程审核
export default {
  name: "QuestionSearchUser",
  components: {
    commonPart,
    uploadFile,
    procedure
  },
  data() {
    return {
      dialogVisible: false,
      tableData: {},
      tableQuery: {
        page: 1,
        pageCount: 20,
        userNo: "",
        ctmName:"",
        bookNo:"",
        fuzzyQuery:"",
        startUserNo: "",
        endUserNo: "",
      },
      selectData: {},
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    
    this.init();
    eventBus.$on("ccccc", params => {
      this.dialogVisible = true;
    });
    this.common.changeTable(this, '.QuestionSearchUser',
          ['.QuestionSearchUser .toolbar','.QuestionSearchUser .block'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init(){
      let _this=this;
      let params = {
          busicode: "MrUserInfoList",
          data: _this.tableQuery,
        };
        _this.$api
          .fetch({
            params //参数
          })
          .then(res => {
            _this.tableData=res;
          });
    },
    demand() {
      this.tableQuery.page = 1
      this.init();
    },
    selectOne(currentData) {
      this.selectData = currentData;
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
<style lang="scss" scoped>
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.QuestionSearchUser {
  height: 450px!important;
  //overflow-y: auto;
  .backfillSubmitForm {
    // margin-top: 15px;
    // padding: 10px 20px;
    // // width: 93%
    .el-input--mini /deep/ .el-input__inner {
      width: 100%;
    }
    .toolbar-line {
      width: 4px;
      background: #c4d600;
      border-radius: 4px;
      height: 1.5rem;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    .info {
      margin: 10px 0px;
      // background: #f5f5f5;
      font-weight: 700;
      color: #000;
      height: 1.5rem;
      line-height: 1.5rem;
      padding: 0 1rem;
      font-size: 14px;
    }
    .el-form-item {
      width: 33%;
      margin-right: 0px;
      .el-form-item__content {
        width: calc(100% - 130px) !important;
        .el-input__inner,
        .el-select {
          width: 100% !important;
        }
      }
    }
  }
  
}
.el-dialog__body{
      padding: 0 0px!important;
    }
</style>
