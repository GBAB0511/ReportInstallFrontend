
<template>
    <div class="UserManage">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="update">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button type="primary" icon="el-icon-plus" size='mini' ref="member" :class="{'active':activeShow}" @click="treeToggle">添加</el-button>
        </div>
      </div>
      <div v-if="EditVisible" class="test">
        <UserManageEdit ref="UserManageEdit" :rowData="rowData"></UserManageEdit>
      </div>
      <div class="indexContent" v-else>
          <div class="toolbar">
              <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>
                <el-form-item label="用户名称：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userName" placeholder="" @keydown.enter.native="demand"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                </el-form-item>
              </el-form>
          </div>
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table
              v-if="tableShow"
              :max-height="maxHeight"         
              stripe
              border
              :data="formData.list"
              class="change-tables-table">
              <el-table-column 
                  type="index"  label="NO."
                  width="50" 
                  fixed="left"
                  :index="indexMethod">
              </el-table-column>

              <el-table-column
                  prop="userName"
                  min-width="180"
                  label="用户名称">
              </el-table-column>

              <el-table-column
                  prop="account"
                  min-width="200"
                  label="用户账号">
              </el-table-column>
            <el-table-column
                  prop="departmentName"
                  min-width="250"
                  label="部门">
              </el-table-column>
              <el-table-column
                  prop="businessAreaName"
                  min-width="250"
                  label="营业区域">
              </el-table-column>
              <el-table-column
                  prop="postName"
                  min-width="240"
                  label="岗位">
              </el-table-column>

              <el-table-column
                  prop="roleName"
                  min-width="240"
                  label="所属角色">
              </el-table-column>

              <el-table-column
                  prop="status"
                  width="100"
                  :formatter="formatStatus"
                  label="状态">
              </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="text" @click="del(scope.$index, scope.row)">删除</el-button>
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
                    :total="formData.total">
                </el-pagination>
            </div>
        <tree-table v-if="treeShow" :data="treeData" :columns="columns" border @treeTableData="treeTableData"></tree-table>
        <div :class="{'select-tree':true,'hide-tree':!authTreeShow,'show-tree':authTreeShow}">
            <authTree @treeClick="getAddData" ref='treePeople' @add-success="init"></authTree>
        </div>
      </div>
    </div>
</template>
<script>
import treeTable from './authindex'
import authTree from './authTree'
import UserManageEdit from "../UserManage/UserManageEdit"
import { mapState, mapMutations } from 'vuex'
export default {
    name:"UserManage",
    components:{
        treeTable,
        authTree,
        UserManageEdit
    },
    data() {
      return {
        EditVisible:false,//弹出表单
        crumbsData :{  //面包屑
            titleList:[
                { title: '系统管理' },
                { title: '用户管理' },
            ],
            
        },
        formData:{

        },
        tableQuery:{
          page:1,
          pageCount:20,
          userName:"",
        },
        // 日期选择器
        pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() ;
            }
        },
        DateChoosevalue: [],
        tableShow:false,
        maxHeight:0,
        editData:{
            
        },
        UserManageVisible:false, 
        UserManageName:'信息发布管理-添加',
        showMemComp:false,
        treeShow: false,
        treeData: [],
        authTreeShow: false, // 组织树展示状态
        activeShow: false, // 输入框激活展示状态
        rowData:{},
      };
    },
    mounted(){
        this.init();
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this,'.indexContent',
            ['.indexContent .block','.indexContent .toolbar'])
    },
    methods: {
        init(){
          var params = {
            busicode: "OrgUserList",
            data:this.tableQuery,
          }
          this.$api.fetch({
           params: params,//参数
          }).then(res => {
            this.formData=res;
          })
        },
        test(){
          
        },
        del(index, row){
          this.$confirm("是否确认删除该账户?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
        .then(() => {
          let params = {
            busicode: "OrgUserDelete",
            data: { account: row.account }
          };
          this.$api.fetch({
              params: params //参数
            })
            .then(res => {
              this.demand();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
        },
        update(){
          console.log(this.$refs.UserManageEdit.rowData);
          var postNo = this.$refs.UserManageEdit.postNoCheck;
          var roleCode = this.$refs.UserManageEdit.roleCodeCheck;
          var status = this.$refs.UserManageEdit.status;
          var businessArea = this.$refs.UserManageEdit.rowData.businessArea==null?"":this.$refs.UserManageEdit.rowData.businessArea;
          let data={
            id:this.$refs.UserManageEdit.rowData.id,
            userName:this.$refs.UserManageEdit.rowData.userName,
            account:this.$refs.UserManageEdit.rowData.account,
            postNo:postNo.join(','),
            status:status,
            roleCode:roleCode.join(','),
            businessArea:businessArea
          }
          var params = {
            busicode: "PubOrgUserUpdate",
            data:data,
          }
          this.$api.fetch({
           params: params,//参数
          }).then(res => {
            this.$message({
                type: 'success',
                message: '保存成功!'
            });
            this.closeDialog()
            this.demand();
          });
        },
        // 输入框点击控制组织树展示
        treeToggle() {
        this.activeShow = true;
        this.authTreeShow = true
        },
        handleClick(tab, event) {
        },
        backMemberCompany(){
        },
       demand() {  //查询
        this.tableQuery.page = 1
        this.tableQuery.pageCount = 20
        this.init()
      },
    
      formatStatus(row) { //格式化状态
        return row.status == 0 ?"启用" : "停用";
      },
        
      add(){//添加
            //alert('直接弹出员工选择公共组件，选择完成后直接调用ajax接口，完成员工新增功能，');
        this.showMemComp=true;
      },
      edit(index,row){
        var roleCode = [], postNo = [];
        if(row.postNo != ''){
          postNo = row.postNo.split(',');
        }
        if(row.roleCode != ''){
          roleCode = row.roleCode.split(',');
        }
        this.rowData.roleCode = roleCode;
        this.rowData.userName = row.userName;
        this.rowData.account = row.account;
        this.rowData.id = row.id;
        this.rowData.status = row.status + "";
        this.rowData.postNo = postNo;
        this.rowData.businessArea = row.businessArea;
        this.EditVisible = true;
      },
      closeDialog(){ //关闭会话
          // this.crumbsData.titleList.splice(2, 1);
          this.EditVisible = false;
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
      cellClick(row, column, cell, event) { //点击文件名
        let that = this;
        
      },
      indexMethod(index) {//获取表格序号
        return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      },
        // 删除行
      deleteRow(index, row){
          this.$confirm('是否确认删除该行?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.editData.list.splice(index,1)
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
      },
    
    // 获取子组件添加人员信息数据
    getAddData(data) {
      let canteenManages = this.RepastMember
      let addManages = data
      let added = ''
      let adding = ''
      for (let i in addManages) {
        let item = {};
        let count = 0;
        item = JSON.stringify(addManages[i]);
        item = JSON.parse(item)
        for (let j in canteenManages) {
          if (addManages[i].id === canteenManages[j].id) {
            added += item.name + ','
            count++
          }
        }
        if (count === 0) {
          canteenManages.push(item);
          adding += item.name + ',';
        }
      }
      if (adding === '' && added === '') {
        this.$message({
          showClose: true,
          message: `请选择添加人员`
        });
      } else if (adding === '' && added !== '') {
        this.$message({
          showClose: true,
          message: `${added} 重复添加！`,
          type: 'error'
        });
      } else if (adding !== '' && added === '') {
        this.$message({
          showClose: true,
          message: `${adding} 已经添加！`,
          type: 'success'
        });
      } else {
        this.$message({
          showClose: true,
          message: `${adding} 已经添加！，${added} 重复添加！`,
          type: 'warning'
        });
      }
      this.$refs.member.validate();
    },
    treeTableData(data) {
      if (!Array.isArray(data)) {
        data = [data]
      }
      let arr = []

      data.forEach(val => {
        let id = val.id
        let flag = false
        let flag1 = false
        let obj1 = {}
        let obj2 = {}
        if (val.children) {
          val.children.forEach(el => {
            //是否有三级的处理
            if (el.children.length === 0) {
              let obj = {}
              obj.moduleId = el.id
              if (el.selectchecked.length) {
                obj.operation = el.selectchecked.reduce(function (total, i) {
                  return total + '' + i
                })
                flag = true
                arr.push(obj)
              }
            } else {
              el.children.forEach(val => {
                let obj = {}
                obj.moduleId = val.id
                if (val.selectchecked.length) {
                  obj.operation = val.selectchecked.reduce(function (total, i) {
                    return total + '' + i
                  })
                  flag1 = true
                  arr.push(obj)
                }
              })
              if (flag1) {
                obj2.moduleId = el.id
                obj2.operation = ''
                arr.push(obj2)
              }
            }
          })
        }
        //父级的id
        if (flag) {
          obj1.moduleId = id
          obj1.operation = ''
          arr.push(obj1)
        }
      })
      this.ruleForm.rModuleBeans = arr
    },
    ...mapMutations(['setTreeBread'])
    },
    watch:{
        maxHeight(){
        this.tableShow = false
        this.$nextTick(()=>{
          this.tableShow = true
        })
      },
    }
  };
</script>
<style lang="scss">
.UserManage{
    width: 100%;
    height: 100%;

    .test{
        height:calc(100% - 41px);
    } 
}
</style>