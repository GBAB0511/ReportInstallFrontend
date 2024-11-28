
<template>
  <div class="RoleManage">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">增加用户</el-button>
        <el-button size="mini" type="primary">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else-if="rightVisible">
        <el-button size="mini" type="primary">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
      </div>
    </div>

    <div v-if="EditVisible" class="test">
      <RoleManageEdit ref="RoleManageEdit"></RoleManageEdit>
    </div>
    <div v-else-if="rightVisible" class="test">
      <RoleManageRight ref="RoleManageRight"></RoleManageRight>
    </div>

    <div v-else>

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

          <el-form-item class="form-left">
            <el-form-item label="角色名称：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData">
          <el-table-column type="index" label="NO." width="50" fixed="left"  :index="indexMethod">
          </el-table-column>
           <el-table-column prop="roleCode" min-width="100" label="角色编码">
          </el-table-column>
          <el-table-column prop="roleName" min-width="300" label="角色名称">
          </el-table-column>
          <el-table-column prop="roleStatus" min-width="80" :formatter="formatStatus" label="状态">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="add(scope.$index, scope.row)">修改</el-button>
              <span>|</span>
              <el-button type="text" @click="right(scope.$index, scope.row)">授权</el-button>
              <span>|</span>
              <el-button type="text" @click.native="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="editData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>

import RoleManageEdit from "../RoleManage/RoleManageEdit"
import RoleManageRight from "../RoleManage/RoleManageRight"
export default {
  name: "RoleManage",
  components: {
    RoleManageEdit,
    RoleManageRight
  },
  data() {
    return {
      EditVisible: false,//弹出表单
      rightVisible: false,//弹出表单
      crumbsData: {  //面包屑
        titleList: [
          { title: '系统管理' },
          { title: '权限管理' },
        ],
      },
      formData: {

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
      editData: {
      },
      rules: {
        watermeterWarehouse: [
          { required: true, message: '请选择短语', trigger: 'blur' },
        ],
        desc: [
          { required: true, message: '请输入用户编号', trigger: 'blur' },
        ]
      },
      RoleManageVisible: false,
      RoleManageName: '信息发布管理-添加',
      tableQuery:{
        page:1,
        pageCount:20,
        userName:"",
      },
      tableData:[],
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.ShortMessageNotification .kl-table', ['.ShortMessageNotification .toolbar', '.ShortMessageNotification .block', '.ShortMessageNotification #crumbs'])
  },
  methods: {
    init() {
      var params = {
            busicode: "PubRoleList",
            data:{},
          }
          this.$api.fetch({
           params: params,//参数
          }).then(res => {
            this.tableData=res;
      })
    },

    handleClick(tab, event) {
      this.editData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            id: null,
            roleName: "抄表员",
            remak: "抄表员",
            status: "1",
          },
          {

            id: null,
            roleName: "收费员",
            remak: "收费员",
            status: "1",
          },
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5,
      };
    },
    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    formatStatus(row) { //格式化状态
      return row.roleStatus == 0 ? "启用" : "停用";
    },

    add() {//添加
      this.EditVisible = true;
      this.rightVisible = false;
      // this.$set(this.crumbsData.titleList, "2", { title: '添加', method: () => { window.histroy.back() } })

    },
    right() {//授权
      this.EditVisible = false;
      this.rightVisible = true;
      // this.$set(this.crumbsData.titleList, "2", { title: '授权', method: () => { window.histroy.back() } })

    },
    edit() {
      // this.$set(this.crumbsData.titleList, "2", { title: '编辑', method: () => { window.histroy.back() } })
      this.EditVisible = true;
      this.EditVisible = false;
    },
    closeDialog() { //关闭会话
      // this.crumbsData.titleList.splice(2, 1);
      this.EditVisible = false;
      this.rightVisible = false;
    },

    //分页
    handleSizeChange(val) { //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      // this.tableQuery.page = val
      this.init()
    },
    cellClick(row, column, cell, event) { //点击文件名
      let that = this;

    },
    indexMethod(index) {//获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)

    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editData.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
};
</script>
<style lang="scss">
.RoleManage {
  .test {
    height: calc(100% - 41px);
  }
}
</style>