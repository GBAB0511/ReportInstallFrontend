
<template>
  <div class="UserAuthorization">
    <div class="role-left">
      <div class="role-title">
        角色
        <!-- <el-button type="primary" size="mini" class="el-icon-plus add-role" @click="openAddDialog('left')">新增角色</el-button> -->
      </div>
      <div class="role-user">
        <dir class="role-item" v-for="item in userData" :key="item.roleCode">
          <div class="role-item-name" :id="item.roleCode" @click="getTableData(item)">{{item.roleName}}</div>
          <!-- <div class="role-item-delete el-icon-delete" title="删除" @click="userDetele(item)"></div> -->
        </dir>
      </div>
    </div>

    <div class="role-right">
      <div class="role-title">人员列表</div>
      <div class="bread-contain">
        <div class="bread-contain-right">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="openAddDialog('right')">添加</el-button>
        </div>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="account" min-width="100" label="账号">
          </el-table-column>

          <el-table-column prop="userName" min-width="100" label="用户名">
          </el-table-column>

          <el-table-column prop="departmentName" min-width="100" label="部门">
          </el-table-column>

          <el-table-column prop="mobile" min-width="100" label="手机">
          </el-table-column>

          <el-table-column prop="email" min-width="100" label="邮箱">
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination v-if="paginationShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>

    <el-dialog title="新增角色" :visible.sync="userAddShow" width="30%">
      <el-form ref="addForm" :model="formData" :rules="rules" class="demo-form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userAdd">确 定</el-button>
        <el-button @click="userAddShow = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加人员" :visible.sync="listAddShow" class="button-dialog">
      <div class="add-user-container" style="height: 100%;">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>

            <el-form-item label="模糊查询：" class="width-200">
              <el-tooltip class="item" effect="dark" content="名称、账号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="名称、账号" v-model="tableQuery.fuzzyQuery" @keyup.enter.native="search"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table ref="dialogTable" v-if="tableShow" :max-height="maxHeight" stripe border :data="dialogTableData.list">

            <el-table-column type="selection" width="55">
            </el-table-column>

            <el-table-column type="index" label="NO." width="50" fixed="left">
            </el-table-column>

            <el-table-column prop="account" min-width="100" label="账号">
            </el-table-column>

            <el-table-column prop="userName" min-width="100" label="用户名">
            </el-table-column>

            <el-table-column prop="departmentName" min-width="100" label="部门">
            </el-table-column>

            <el-table-column prop="mobile" min-width="100" label="手机">
            </el-table-column>

            <el-table-column prop="email" min-width="100" label="邮箱">
            </el-table-column>

          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleDialogSizeChange" @current-change="handleDialogCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="dialogTableData.total">
            </el-pagination>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="listAdd">确 定</el-button>
        <el-button size="mini" @click="listAddShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: "UserAuthorization",
  data() {
    return {
      // 左侧角色列表数据
      userData: [],
      paginationShow:true,
      treelist:false,
      // 左侧当前点击的角色（存储作他用）
      clickUserData: {},

      // 新增角色弹出框显示与隐藏
      userAddShow: false,
      // 新增列表人员弹出框显示与隐藏
      listAddShow: false,
      // 新增角色弹出框数据
      formData: {
        roleName: '',
      },
      // 右侧添加按钮弹出框查询条件对象
      tableQuery: {
        fuzzyQuery: '',
        page: 1,
        pageCount: 20
      },
      // 列表数据
      tableData: [
        {}
      ],
      // 右侧弹出框列表数据
      dialogTableData: [
        {}
      ],
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".UserAuthorization .role-right", [
        ".UserAuthorization .role-title",
          '.UserAuthorization .bread-contain',
        ".UserAuthorization .block",
      
      ]);
    });
  },
  methods: {
    // 初始化（角色）
    init() {
      let _this = this
      var params = {
        busicode: "PubRoleList",
        data: {
        },
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.userData = res
          _this.getTableData(_this.userData[0])
        // 默认点击第一个角色
      })
    },
     indexMethod(index) {
      //  console.log(index)
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
        // 获取人员列表（左侧角色点击事件）
    getTableData(item) {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      // this.treelist = true
      let _this = this

      setTimeout(() => {
        // 角色选中状态（样式）
        $('.role-item-name').css('color', 'black')
        $('#' + item.roleCode).css('color', '#3193f5')
      }, 0);

      this.clickUserData = item
      var params = {
        busicode: "RoleUserList",
        data: {
          roleCode: item.roleCode,
          page:this.tableQuery.page,
          pageCount:this.tableQuery.pageCount

        },
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.tableData = res
        //点击左侧树列表切换数据强制刷新列表界面为page:1
        this.paginationShow = false
       this.handleCurrentChange(1)
       this.$nextTick(function () {
       this.paginationShow = true;

       })
      })
    },
    // 获取人员列表（左侧角色分页点击事件，不刷新）
    getDefaultTableData(item) {
      // this.treelist == false
      let _this = this

      setTimeout(() => {
        // 角色选中状态（样式）
        $('.role-item-name').css('color', 'black')
        $('#' + item.roleCode).css('color', '#3193f5')
      }, 0);

      this.clickUserData = item
      var params = {
        busicode: "RoleUserList",
        data: {
          roleCode: item.roleCode,
          page:this.tableQuery.page,
          pageCount:this.tableQuery.pageCount

        },
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.tableData = res
      })
    },
    // 添加按钮（左侧+右侧）
    openAddDialog(type) {
      if (type == 'left') {
        this.userAddShow = true
      } else if (type == 'right') {
        if (!this.clickUserData.roleCode) {
          this.$message({
            showClose: true,
            message: '请先选择一个角色！',
            type: 'warning'
          });
          return
        }
        this.listAddShow = true
        this.getDialogTableData()
        this.$nextTick(() => {
          this.common.changeTable(this, '.add-user-container', [
            '.add-user-container .toolbar',
            '.add-user-container .block'
          ])
        })
        
      }
    },
    // 获取添加列表人员数据（右侧添加按钮）
    getDialogTableData() {
      let _this = this
      var params = {
        busicode: "OrgUserList",
        data: this.tableQuery,
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.dialogTableData = res
      })
    },
    // 右侧弹出框查询按钮
    search() {
      this.getDialogTableData()
    },
    // 右侧弹出框确定按钮
    listAdd() {
      let _this = this
      console.log(_this.$refs.dialogTable.selection)
      // 获取列表已勾选的数据account数组
      let accounts = [];
      _this.$refs.dialogTable.selection.forEach(item => {
        accounts.push(item.account);
      });

      var params = {
        busicode: "AddRoleUser",
        data: {
          roleCode: this.clickUserData.roleCode,
          account: accounts,
        },
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.listAddShow = false
        _this.$message({
          type: 'success',
          message: '添加成功!'
        });
        _this.getTableData(_this.clickUserData)
      })
    },
    // 新增角色弹出框确定按钮
    userAdd() {
      let _this = this
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          var params = {
            busicode: "AddRole",
            data: {
              roleName: this.formData.roleName,
              page: this.tableQuery.page,
              pageCount: this.tableQuery.pageCount
            },
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.userAddShow = false
            this.$message({
              message: '新增角色：' + _this.formData.roleName + '成功！',
              type: 'success'
            });
            _this.init()
          })
        } else {
          return false;
        }
      })

    },
    // 左侧角色删除按钮
    userDetele(item) {
      let _this = this
      this.$confirm('是否确定删除角色：' + item.roleName + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          busicode: "DeleteRole",
          data: {
            roleCode: item.roleCode
          },
        }
        this.$api.fetch({
          params: params,
        }).then(res => {
          _this.$message({
            type: 'success',
            message: '删除成功!'
          });
          _this.init()
        })

      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 列表删除按钮
    remove(item) {
      let _this = this
      var array = new Array();
      array[0] = item.account;
      this.$confirm('是否确定删除人员：' + item.userName + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          busicode: "DeleteRoleUser",
          data: {
            roleCode: _this.clickUserData.roleCode,
            account: array
          },
        }
        this.$api.fetch({
          params: params,
        }).then(res => {
          _this.$message({
            type: 'success',
            message: '删除成功!'
          });
          _this.getTableData(_this.clickUserData)
        })

      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },


    //分页
    handleSizeChange(val) { //显示多少数据一页
    var list = Object.keys(this.clickUserData)//判断是否点击左侧树列表
    if (list.length == 0) {
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    } else {
        this.tableQuery.pageCount = val
        this.tableQuery.page = 1
        this.getDefaultTableData(this.clickUserData)
      }
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      // this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
     var list = Object.keys(this.clickUserData)//判断是否点击左侧树列表
      if(list.length == 0){
        this.tableQuery.pageCount = val
        this.tableQuery.page = 1
        this.init()
      } else {
        this.tableQuery.page = val
        this.getDefaultTableData(this.clickUserData)
      }
    },
     handleDialogSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.getDialogTableData()
    },
    handleDialogCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      this.getDialogTableData()
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    listAddShow(val) {
      if(!val) {
         this.common.changeTable(this, ".UserAuthorization", [
          ".UserAuthorization .toolbar",
          ".UserAuthorization .block",
          '.UserAuthorization .bread-contain-right'
        ]);
      }
    }
  }
};
</script>
<style lang="scss">
.UserAuthorization {
  width: 100%;
  height: 100%;
  padding: 10px;
  .role-left {
    width: 20%;
    height: 100%;
    float: left;
    border: 1px solid #e6e6e6;
  }
  .role-user {
    height: calc(100% - 35px);
    overflow-y: auto;
    padding: 0 4px 10px;
    .role-item {
      padding: 14px 10px;
      font-size: 14px;
      .role-item-name {
        cursor: pointer;
        float: left;
        width: calc(100% - 16px);
      }
      .role-item-name:hover {
        color: #3193f5;
      }
      .role-item-delete {
        cursor: pointer;
        float: right;
        // color: #3193f5;
      }
      .role-item-delete:hover {
        color: #3193f5;
      }
    }
  }

  .role-title {
    height: 35px;
    font-size: 14px;
    background-color: #f5f6f8;
    padding: 6px;
    width: 100%;
  }
  .role-right {
    width: 78%;
    height: 100%;
    float: right;
    margin-left: 10px;
    border: 1px solid #e6e6e6;
  }
  .role-right .el-button {
    // float: right;
    margin-right: 10px;
  }
  .add-role {
    float: right;
    padding: 5px 8px;
  }
  .demo-form {
    .el-form-item__label {
      width: 90px;
    }
    .el-form-item__content .el-input {
      width: calc(100% - 90px);
      input {
        height: 30px;
      }
    }
    .el-form-item__content .el-form-item__error {
      margin-left: 90px;
    }
  }
  .button-dialog .el-dialog__body {
    height: calc(100% - 110px) !important;
  }
}
</style>