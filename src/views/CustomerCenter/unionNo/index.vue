<template>
  <div class="unionNo">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" v-if="!editContent" @click="edit('add')">添加</el-button>
        <el-button size="mini" type="primary" v-if="editContent" @click="save">保存</el-button>
        <el-button icon="el-icon-caret-left" v-if="editContent" size="mini" @click="closeEdit">返回</el-button>
      </div>
    </div>

    <div class="indexContent" v-if="editContent">
      <UnionNoEdit ref="UnionNoEdit" @closeEdit="closeEdit" :unionNo="unionNo" :unionName="unionName" :id="id"></UnionNoEdit>
    </div>
    <!--主列表界面-->
    <div class="unionNo" v-else>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150" @submit.native.prevent>
          <el-form-item label="联合编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.unionNo" placeholder="联合编号" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>
          <el-form-item label="联合名称：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.unionName" placeholder="联合名称" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>
          <el-form-item label="模糊查询：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" placeholder="模糊查询" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list"  class="wuserInfo-table">

          <el-table-column type="index" label="NO." width="50" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="unionNo" min-width="100" label="编号">
          </el-table-column>

          <el-table-column prop="unionName" min-width="100" label="名称">
          </el-table-column>

          <el-table-column prop="createName" min-width="100" label="创建人">
          </el-table-column>

          <el-table-column prop="createTime" min-width="100" label="创建时间">
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="edit(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click.native="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      
    </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
 
  </div>
</template>
<script>
import UnionNoEdit from "./unionNoEdit";//添加/编辑
export default {
  name: "unionNo",
  components: {
    UnionNoEdit
  },
  data() {
    return {
      searchMeterReadingStaffAccount:"",
      searchMeterReadingStaffName:"",//带入添加用户的抄表员下拉菜单
      addBtn:true,
      tableData: {},
      userData:{
        list:[]
      },
      userQuery:{
        fuzzyQuery:"",
      },
      tableQuery:{
        page:1,
        pageCount:20,
        unionNo:"",
        unionName:"",
        fuzzyQuery:""
      },
      totalUser:0,
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户管理' },
          { title: '联合编号' }
        ],

      },
      bookNoData: [],//册本号数据下拉框
      tableShow: false,
      maxHeight: 0,
      editMaxHeight: 100,
      editGroupMaxHeight: 0,
      ruleFormData: {},
      editContent: false,
      // 联合编号数据
      unionNo:"",
      unionName:"",
      id:""
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow4')
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, '.unionNo', 
        ['.unionNo .toolbar', 
          '.unionNo .block', 
          '.unionNo .bread-contain'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this
      let params = {
        "busicode": "UnionInfoList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    demand() {  //查询
      this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
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
    indexMethod(index) {//获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    },
    // 编辑
    edit(val) {
      console.log(val);
      if(val==='add'){
        this.editContent = true
        this.unionNo = ""
        this.unionName = ""
        this.id = ""
      }else{
        this.editContent = true;
        this.unionNo = val.unionNo
        this.unionName = val.unionName
        this.id = val.id
        console.log(this.unionNo);
        // let params = {
        //     "busicode": "UnionInfoUserList",
        //     "data": {unionNo:val.unionNo},
        //   }
        //   this.$api.fetch({
        //     params: params,//参数
        //   }).then(res => {
        //     this.formData.userNo = val.unionNo
        //     this.formData.userName = val.userName
        //     this.formData.userList = res
        //   })
      }
    },
    save(){
      this.$refs.UnionNoEdit.add()
    },
    del(row){
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            "busicode": "UnionInfoDelete",
            "data": {unionNo:row.unionNo},
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.init();
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    closeEdit() {
      this.editContent = false;
      this.init();
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
<style lang="scss" scoped>
.unionNo {
  width: 100%;
  height: 100%;
}
</style>
