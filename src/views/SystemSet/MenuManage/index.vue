<template>
  <div class="MenuManage">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
      </div>
      <div class="bread-contain-right" v-if="!indexShow">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div v-if="indexShow">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>

          <el-form-item label="菜单名称：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.opName" placeholder="" @keydown.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <!-- <el-table-column type="selection" width="50" fixed="left">
        </el-table-column> -->

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="opName" min-width="100" label="菜单名称">
          </el-table-column>

          <el-table-column prop="opFlagName" min-width="100" label="菜单标识">
          </el-table-column>

          <el-table-column prop="opStatusName" min-width="100" label="菜单状态">
          </el-table-column>

          <el-table-column prop="opCode" min-width="100" label="用户权限标识编码">
          </el-table-column>

          <!-- <el-table-column class="cell" label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="menuAdd(scope.row)">添加</el-button>
              <span>|</span>
              <el-button type="text" @click="remove(scope.row)">删除</el-button>
              <span  >|</span>
                <el-button type="text" class="noclick" @click="record(scope.$index, scope.row)">撤回</el-button>

            </template>
          </el-table-column> -->

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
    <MenuManageEdit ref="MenuManageEdit" :editNeedData='editNeedData' v-else></MenuManageEdit>

  </div>
</template>
<script>
import MenuManageEdit from '../MenuManage/MenuManageEdit'
export default {
  name: "MenuManage",
  components: {
    MenuManageEdit
  },
  data() {
    return {
      // 首页显示与隐藏
      indexShow: true,
      crumbsData: {
        //面包屑
        titleList: [{ title: "系统管理" }, { title: "菜单管理" }]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
      },
      // 列表数据
      tableData: {},
      tableShow: false,
      maxHeight: 0,
      // 子页面所需数据
      editNeedData: {},
    }
  },
  mounted() {
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".MenuManage", [
      ".MenuManage .toolbar",
      ".MenuManage .block",
      ".MenuManage #crumbs"
    ])
  },
  methods: {
    // 初始化
    init() {
      let _this = this
      let params = {
        "busicode": "OperationList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res
        for (let i = 0; i < this.tableData.list.length; i++) {
          if (this.tableData.list[i].opFlag == 1) {
            this.tableData.list[i].opFlagName = '菜单'
          } else if (this.tableData.list[i].opFlag == 2) {
            this.tableData.list[i].opFlagName = '按钮'
          }
          if (this.tableData.list[i].opStatus == 1) {
            this.tableData.list[i].opStatusName = '启用'
          } else if (this.tableData.list[i].opStatus == 0) {
            this.tableData.list[i].opStatusName = '禁用'
          }
        }
      })
    },
    // 查询按钮
    search() {
      this.init()
    },
    // 添加按钮
    menuAdd(row) {
      this.editNeedData = row
      this.indexShow = false

    },
    // 子页面保存按钮
    save() {
      this.$refs.MenuManageEdit.save()
    },
    // 列表删除按钮
    remove(row) {
      let _this = this
      this.$confirm('此操作将删除此菜单（按钮）？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          "busicode": 'DeleteOperation',
          "data": row.opCode,
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.$message({
            type: 'success',
            message: '删除成功！'
          });
          _this.init()
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 子页面返回按钮
    closeDialog() {
      this.indexShow = true
      this.init()
    },




    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)

    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    }
  }
}
</script>
<style lang="scss">
.MenuManage {
  width: calc(100% - 20px);
  height: calc(100% - 0px);
  .el-date-range-picker {
    position: absolute;
    top: 176px;
    left: 221px !important;
  }
  .el-button {
    font-size: 12px;
  }
}
</style>