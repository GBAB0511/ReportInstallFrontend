
<template>
  <div class="CustomerChange">
    <!-- 变更选择框 -->
    <div  class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div v-if="CustEditVisible" class="bread-contain-right">
              <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right:10px;" 
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>

        <el-button type="primary" size="mini" @click="submit(status);" v-if="buttomShow">保 存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
      </div>
      <div v-else class="bread-contain-right">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="salesAdd">添加</el-button>
      </div>
    </div>
    <!--变更事项-->
    <el-dialog
        :title="ctmChangeName"
        :close-on-click-modal="false"
        :visible.sync="CustomerChangesVisible"
        class="common-dialog"
        @close="closeDialog1"
      >
        <CustomerChangeItemEdit
          ref="ctmChangeEditor"
          v-if="CustomerChangesVisible"
          :CustomerChangesEditData="CustomerChangesEditData"
        ></CustomerChangeItemEdit>
      </el-dialog>
    <div class='indexContent'  v-if="CustEditVisible">
      <CustomerChangeEdit
        ref="CustomerChangeEdit"
        :idCuster="idCuster"
        :billStute="status"
      ></CustomerChangeEdit>
    </div>
    <div class='indexContent' v-else>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="单据日期：">
              <el-date-picker
                v-model="billTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                :picker-options="pickerOptions"
                :clearable="true"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="未审">
                <el-option
                  v-for="(item,index) in approvalStatusOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模糊查询：" class="searchInput">
              <el-tooltip class="item" effect="dark" content="单据编号、用户编号、旧用户编号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="init"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          highlight-current-row
          stripe
          border
          :data="tableData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="100" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期"></el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号"></el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人" show-overflow-tooltip></el-table-column>
          <!--el-table-column prop="changeItems" min-width="160" label="变更事项" show-overflow-tooltip></el-table-column-->

          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="changeItems(scope.$index, scope.row)">变动情况</el-button>
              <el-button type="text" size="mini" @click="details(scope.$index, scope.row)">详情</el-button>
              <el-button
                type="text"
                size="mini"
                v-if="scope.row.processState=='草稿'"
                @click="deleteRow(scope.$index, scope.row)"
              >删除</el-button>
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
import CustomerChangeEdit from "./CustomerChangeEdit";
import CustomerChangeItemEdit from "@/components/IntegratedBusiness/UserInformation/CustomerChanges";
export default {
  name: "CustomerChange",
  components: {
    CustomerChangeEdit,
    CustomerChangeItemEdit
  },
  data() {
    return {
           AttachmentQty:0,//附件个数
      NotDisabled: false,//判断是否可编辑
      idCuster: { id: ""},
      buttomShow: false, //保存按钮的显示与隐藏
      status: "ChangeUserAdd", //add 新增 updata 修改
      userStatus: "草稿", //流程状态
      CustEditVisible: false,
      //面包屑
      crumbsData: { titleList: [{ title: "客户管理" }, { title: "变更" }] },
      approvalStatusOptions: this.common.processState(), //审批状态下拉框
      billTime: [],
      CustomerChangesVisible: false,
      ctmChangeName: "变动情况",
      CustomerChangesEditData: {
        //变动情况
        receiptId: "",
        temp:2
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate: "",
        endDate: "",
        fuzzyQuery: "",
        status: ""
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {}
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".CustomerChange", [
        ".CustomerChange .toolbar",
        ".CustomerChange .block",
        ".CustomerChange #crumbs"
      ]);
    })

  },
  methods: {

     uploadAttachment(file) {
        this.$refs.CustomerChangeEdit.uploadAttachment(file);
    },
    viewAttachment() {
        this.$refs.CustomerChangeEdit.viewAttachment('show');
    },

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
      let _this = this;
      if (!_this.billTime) {
        _this.tableQuery.beginDate = "";
        _this.tableQuery.endDate = "";
      } else {
        _this.tableQuery.beginDate = _this.billTime[0];
        _this.tableQuery.endDate = _this.billTime[1];
      }
      let data = _this.tableQuery;
      let params = {
        busicode: "ChangeUserList",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    changeItems(index,row){
      this.CustomerChangesEditData.receiptId=row.id
      this.CustomerChangesVisible=true
    },
    closeDialog1(){
      this.CustomerChangesVisible=false
    },
    demand() {
      //查询
      this.init();
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
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    closeDialog() {
      //关闭会话
      this.backfillVisible = false;
      this.CustEditVisible = false;
      this.init();
    },
    //弹出框
    submit(type) {
      //提交
      this.$refs.CustomerChangeEdit.submit(type);
    },
    deleteRow(index, row) {
      this.$confirm("此操作将永久删除该单据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.remove(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    remove(row) {
      let params = {
        busicode: "ChangeUserDelete",
        data: {
          id: row.id
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.$message({
            message:'删除成功！',
            type: "success"
          });
          this.init();
        });
    },
    details(i, row) {
      this.idCuster.id = row.id;
      this.userStatus = row.status;
      this.status = "ChangeUserUpdate";
      this.CustEditVisible = true;
      if (row.processName != "起草节点" && (row.processState == "进行中" || row.processState == "已办结" || row.processState == '已废弃')) {
        this.buttomShow = false;
        this.NotDisabled = true
      } else {
        this.buttomShow = true;
        this.NotDisabled = false
      }
    },
    salesAdd() {
      this.idCuster.id = "";
      this.status = "ChangeUserAdd";
      this.userStatus = "";
      this.CustEditVisible = true;
      this.buttomShow = true;
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
.CustomerChange {
  width: 100%;
  height: 100%;
   .el-upload-list {
    display: none;
  }
}
</style>
