
<template>
  <div class="RoleManage">
    <div class="role-left">
      <div class="role-title">
        角色
        <!-- <el-button type="primary" size="small" class="el-icon-plus add-role" @click="openAddDialog">新增角色</el-button> -->
      </div>
      <div class="role-user">
        <dir class="role-item" v-for="item in userData" :key="item.roleCode">
          <div class="role-item-name" :id="item.roleCode" @click="getTreeData(item)">{{item.roleName}}</div>
          <!-- <div class="role-item-delete el-icon-delete" title="删除" @click="userDetele(item)"></div> -->
        </dir>
      </div>
    </div>

    <div class="role-right">
      <div class="role-title">
        菜单功能权限
        <div class="save-btn">
          <el-button type="primary" size="mini" @click="save">保存</el-button>
        </div>
      </div>
      <div class="role-tree">
        <el-tree ref="tree" class="filter-tree department" :check-strictly='true' :data="treeData" :props="defaultProps" node-key="opCode" :default-checked-keys="checkTreeData" :default-expanded-keys="[firstOpCode]" accordion show-checkbox @check="treeNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span style="display: inline-block">{{ node.label }}</span>
            <span style="display: inline-block;margin-left: 30px;">
              <el-checkbox-group v-model="allBtnList">
                <el-checkbox v-for="item in data.btnList" :label="item.opCode" :key="item.opCode">{{item.opName}}</el-checkbox>
              </el-checkbox-group>
            </span>
          </span>
        </el-tree>
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
  </div>
</template>
<script>

export default {
  name: "RoleManage",
  data() {
    return {
      allBtnList: [],
      defaultProps: {
        children: 'children',
        label: 'opName'
      },
      firstOpCode: '',
      // 左侧角色列表数据
      userData: [],
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
      // 功能菜单数据
      treeData: [],
      // 勾选的菜单数据opCode
      checkTreeData: [],

      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
      },
      tableShow: false,
      maxHeight: 0,

      // 按钮权限管理的title
      btnRoleName: '',
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".RoleManage", [
        ".RoleManage .toolbar",
        ".RoleManage .block",
      ]);
    });
  },
  methods: {
    // 初始化（角色）
    init() {
      let _this = this
      var params = {
        busicode: "PubRoleList",
        data: {},
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.userData = res
        // 默认点击第一个角色
        _this.getTreeData(_this.userData[0])
      })
    },
    // 获取右侧树（左侧角色点击事件）
    getTreeData(item) {
      let _this = this

      setTimeout(() => {
        // 角色选中状态（样式）
        $('.role-item-name').css('color', 'black')
        $('#' + item.roleCode).css('color', '#3193f5')
      }, 0);

      this.clickUserData = item
      var params = {
        busicode: "RoleOperationList",
        data: {
          roleCode: item.roleCode
        },
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        var data = res;
        _this.treeData = res
        // 获取firstOpCode是用户树控件默认展开此节点
        _this.firstOpCode = _this.treeData[0].opCode

        _this.checkTreeData = []
        this.initChecked(res)
      })
    },

    initChecked(data) {
       data.forEach(item => {
          if (item.checked) {
            this.checkTreeData.push(item.opCode)
          }
          // 获取右侧树初始化勾选按钮数据
          if (item.btnList !== '') {
            item.btnList.forEach((btnItem) => {
              if (btnItem.checked) {
                this.allBtnList.push(btnItem.opCode)
              }
            })
          }
          if(item.children && item.children.length > 0) {
            this.initChecked(item.children)
          }
        });
    },

    // 右侧树的保存按钮
    save() {
      let _this = this
      let operation = [...this.allBtnList]
      // 获取勾选数据的opCode
      this.$refs.tree.getCheckedNodes().forEach((item) => {
        operation.push(item.opCode)
      })

      if (operation.length <= 0) {
        this.$message({
          message: '菜单不能为空！',
          type: 'warning'
        });
        return
      }
      var params = {
        busicode: "AddRoleOperation",
        data: {
          roleCode: this.clickUserData.roleCode,
          operation: operation
        },
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$message({
          message: '保存成功！',
          type: 'success'
        });
      })
    },

    // 新增角色按钮
    openAddDialog() {
      this.userAddShow = true
    },
    // 新增角色弹出框确定按钮
    userAdd() {
      let _this = this
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          var params = {
            busicode: "AddRole",
            data: {
              roleName: this.formData.roleName
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
    treeNodeClick(node, { checkedNodes, checkedKeys }) {

       var checkedNode = this.$refs.tree.getNode(node.opCode)
        const keys = this.$refs.tree.getCheckedKeys() // 获取已勾选节点的key值

    if (checkedNode.checked) { // 当前节点若被选中
        for (let i = checkedNode.level; i > 1; i--) { // 判断是否有父级节点
          if (!checkedNode.parent.checked) { // 父级节点未被选中，则将父节点替换成当前节点，往上继续查询，并将此节点key存入keys数组
            checkedNode = checkedNode.parent
            keys.push(checkedNode.data.opCode)
          }
        }
      }
      this.$refs.tree.setCheckedKeys(keys)

      this.treeData.forEach(tree => {
        this.checkNodeClick(tree, node, checkedNodes.some(item => item.opCode === node.opCode))
      })

    },

    checkNodeClick(tree, clickNode, click) {

      if(!tree.children || tree.children.length === 0) {
        return
      }

      tree.children.forEach(node => {
        if(node.opCode === clickNode.opCode || tree.opCode === clickNode.opCode) {
          this.toggleChildrenClick(node, click)
          return
        }
        this.checkNodeClick(node, clickNode, click)
      })
    },

    toggleChildrenClick(tree, click) {

      if(tree.btnList && tree.btnList.length > 0) {
          this.toggleBtnClick(tree, click)
        }
      this.$refs.tree.setChecked(tree.opCode, click)
      if(!tree.children || tree.children.length === 0) {
        return
      }

      tree.children.forEach(node => {
        this.$refs.tree.setChecked(node.opCode, click)
        this.toggleChildrenClick(node, click)
      })
    },

    toggleBtnClick(node, click) {

      if(click) {
        node.btnList.forEach(item => {
          this.allBtnList.push(item.opCode)
        })
      } else {
        this.allBtnList = this.allBtnList.filter(btn => node.btnList.every(item => item.opCode !== btn))
      }

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
  .save-btn {
    float: right;
    .el-button {
      padding: 5px 8px;
    }
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
  .role-tree {
    height: calc(100% - 35px);
    overflow: auto;
  }
  .custom-tree-node {
    font-size: 12px;
  }
}
</style>