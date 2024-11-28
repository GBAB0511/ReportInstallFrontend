<template>
  <div class="servantRegionConfiguration">
        
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      

      <div class="businessBranchIndex" >
        <div class="kl-table" :style="{height: maxHeight + 'px'}">

          <el-table 
            v-if="tableShow" 
            :max-height="maxHeight" 
            stripe border 
            :data="tableData.list" >

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            

             <el-table-column
            show-overflow-tooltip
            prop="serverAreaName"
            min-width="170"
            label="服务区域范围"
          ></el-table-column>
          <el-table-column prop="remarks" min-width="100" label="备注"></el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
              
                <el-button type="text" size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click.native="handleDel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange"
             @current-change="handleCurrentChange" 
             :current-page="tableQuery.page" :page-sizes="[10, 50, 100, 500, 1000]" 
             :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
       <el-dialog
        :title="title"
        width="600px"
        :visible.sync="addFormVisible"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-form
          v-if="addFormVisible"
          :model="addForm"
          :rules="addFormRules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-row>
            <el-form-item label="服务区域范围:" prop="fullName">
              <el-input
                type="text"
                v-model="addForm.fullName"
                placeholder="请选择"
                :readonly="true"
                @focus="openTree"
                @input="onInput()"
              ></el-input>
            </el-form-item>

            <el-form-item label="描述:" prop="remark">
              <el-input
                type="textarea"
                v-model="addForm.remark"
                placeholder="请选择"
                @input="onInput()"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button  type="primary" size="mini" plain  @click="confirmForm">确 定</el-button>
          <el-button  type="info" size="mini" plain  @click="handleClose">取 消</el-button>
        </div>
      </el-dialog>
            <el-dialog
        class="treeDialog"
        :title="'选择服务区域范围'"
        width="400px"
        :visible.sync="isShowTree"
        :close-on-click-modal="false"
        :before-close="handleCloseTreeDialog"
      >
      <div style="height: 540px;overflow-y: scroll;">
        <el-tree
          v-if="isShowTree"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :highlight-current="true"
          :load="loadNode"
          lazy
        ></el-tree>
      </div>
        <div slot="footer" class="dialog-footer">
          <el-button  type="primary" size="mini" plain @click="confirmTree">确 定</el-button>
          <el-button  type="info" size="mini" plain  @click="handleCloseTreeDialog">取 消</el-button>
        </div>
      </el-dialog>
      </div>

  </div>
</template>
<script>

export default {
  name: "servantRegionConfiguration",
  components:{
  
  },
  data() {
    return {
      isShowTree: false,

      title: "添加",
      addFormRules: {
        fullName: {
          required: true,
          message: "请选择"
        }
      },
      tableData: {},
      maxHeight: 700,
      tableShow: true,
      addFormVisible: false,
      addForm: {},
      treeData: [],
      defaultProps: {
        children: "children",
        label: "areaName",
        isLeaf(data, node) {
          if (data.isLeaf === 1) {
            return true;
          } else {
            return false;
          }
        }
      },
      node: null,
      status: "add",
      editData: {},

      tableQuery:{
        page:1,
        pageCount:10,
        branchName:"",
      },

      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessBranch' },
          { title: '区域配置', method: () => { window.histroy.back() } },
          { title: '服务区域配置', method: () => { window.histroy.back() } }
        ],
      },
      
      maxHeight: 0,
      tableShow: false,
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow1')
    this.getTableData();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".businessBranchIndex", [
            ".businessBranchIndex .block",
          ]);
    })
  },
    methods: {
    onInput() {
      this.$forceUpdate();
    },
    //添加或者修改表单的提交
    confirmForm() {
      this.$refs.ruleForm.validate(vaild => {
        if (vaild) {
          if (this.status === "add") {
            let params = {
              busicode: "ServerAreaAdd",
              data: {
                remarks: this.addForm.remark,
                serverAreaId: this.node.id,
                serverAreaName: this.node.fullName,
                serverAreaNo: this.node.areaNo
              }
            };
            this.$api
              .fetch({
                params: params, //参数
              })
              .then(res => {
             
                  this.addFormVisible = false;
                  this.addForm = {};
                  this.node = null;
                  this.getTableData();
              
              });
            console.log("params add", params);
          } else {
            if (this.node) {
              this.editData.serverAreaId = this.node.id;
              this.editData.serverAreaName = this.node.fullName;
              this.editData.serverAreaNo = this.node.areaNo;
            }
            let params = {
              busicode: "ServerAreaUpdate",
              data: {
                id: this.editData.id,
                remarks: this.addForm.remark,
                serverAreaId: this.editData.serverAreaId,
                serverAreaName: this.editData.serverAreaName,
                serverAreaNo: this.editData.serverAreaNo
              }
            };
            this.$api
              .fetch({
                params: params, //参数

              })
              .then(res => {
                  this.addFormVisible = false;
                  this.addForm = {};
                  this.node = null;
                  this.getTableData();
                
              });
            console.log("params edit", params);
          }
        }
      });
    },
    //树选择确定回调
    confirmTree() {
      if (!this.node) {
        this.$message({
          type: "error",
          message: "先请选择"
        });
      } else {
        this.$set(this.addForm, "fullName", this.node.fullName);
        this.isShowTree = false;
      }
      console.log("node", this.node);
    },
    async openTree() {
      console.log("打开树");
      let data = await this.getTreeData();
      this.isShowTree = true;
    },
    handleCloseTreeDialog() {
      this.isShowTree = false;
      this.node = null;
      this.treeData = [];
    },
    handleNodeClick(node) {
      this.node = node;
    },
    getTreeData() {
      let that = this;
      let params = {
        busicode: "AdminAreaList",
        data: {}
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {
            this.treeData = res;
        });
    },
    //懒加载节点
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData);
      } else {
        this.getChildrenNode(node, resolve);
      }
      console.log("node", node);
    },
    //获取子节点
    getChildrenNode(node, resolve) {
      let params = {
        busicode: "AdminAreaList",
        data: {
          id: node.data.id
        }
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {
            resolve(res);
        });
    },
    add() {
      this.addFormVisible = true;
      this.status = "add";
      this.title = "添加";
    },
    handleEdit(row) {
      console.log("row", row);
      this.title = "修改";
      this.status = "edit";
      this.addFormVisible = true;
      this.editData = Object.assign({}, row);
      this.addForm.fullName = row.serverAreaName;
      this.addForm.remark = this.editData.remarks;

      console.log(this.addForm);
    },
    handleDel(row) {
      console.log(row)
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        // cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
      let params = {
        busicode: "ServerAreaDelete",
        data: {
          id: row.id
        }
      };
       this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          
            this.getTableData();
        });
        })
    },
    handleClose() {
      this.addFormVisible = false;
      this.addForm = {};
    },
 // 列表的NO列
      indexMethod(index) {
        return (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      },
      
      handleSizeChange(val) { //显示多少数据一页
        this.tableQuery.pageCount = val;
        this.tableQuery.page = 1;
        this.getTableData();
      },
      handleCurrentChange(val) {  //页码点击
        this.tableQuery.page = val;
        this.getTableData();
      },
        getTableData() {
      let params = {
        busicode: "ServerAreaList",
        data: {
          page: this.tableQuery.page,
          pageCount: this.tableQuery.pageCount
        }
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then(res => {

            this.tableData = res;
       
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
}
</script>
<style lang="scss">
.servantRegionConfiguration {
  width: 100%;
  height: 100%;
  .businessBranchIndex{
  width: 100%;
  height: calc(100% - 41px);
  padding-top:10px;
  }
}
</style>

