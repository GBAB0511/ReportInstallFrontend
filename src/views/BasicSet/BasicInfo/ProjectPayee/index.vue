<template>
  <div class="ProjectPayee">
        
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('ProjectPayeeEditForm')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      
      <ProjectPayeeEdit v-if="EditVisible" ref="ProjectPayeeEdit"></ProjectPayeeEdit>
      <div class="ProjectPayeeIndex" v-show="!EditVisible">
        
        <div class="toolbar">
            <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline" @submit.native.prevent>
                  <el-form-item class="form-left">
                    <el-form-item label="工程收款主体：" class="width-250">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                        @input="e => input = inputMe(e)"
                        v-model="tableQuery.subjectName"
                        @keyup.enter.native="search"
                        placeholder="请输入工程收款主体"
                      >
                      </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class='searchBtn'  @click="search" icon="el-icon-search"></el-button>
                    </el-form-item>
                    
                </el-form-item>
              </el-form>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">

          <el-table 
            v-if="tableShow" 
            :max-height="maxHeight" 
            stripe border 
            :data="tableData.list" 
            class="wuserInfo-table">
            <el-table-column type="index" label="NO."  :index="indexMethod">
            </el-table-column>
            <el-table-column prop="subjectName" label="工程收款主体">
            </el-table-column>
            <el-table-column prop="status" label="状态">
            </el-table-column>
            <el-table-column prop="comments"  label="备注">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <!-- style="font-size:12px;text-align:center;" -->
                <el-button type="text " size="mini" @click.native="add(scope)">编辑</el-button>
                <el-button type="text " size="mini" @click.native="deleteRow(scope)">删除</el-button>
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
      </div>
  </div>
</template>
<script>
import ProjectPayeeEdit from "./ProjectPayeeEdit"

export default {
  name: "ProjectPayee",
  components:{
      ProjectPayeeEdit,
  },
  data() {
    return {
      tableData:[],
      tableQuery:{
        page:1,
        pageCount:10,
        subjectName:"",
      },
      EditVisible:false,//弹出表单
      formData: {
        subjectName:'',
        status:'',
        comments:'',
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessBranch' },
          { title: '其他配置', method: () => { window.histroy.back() } },
          { title: '工程收款主体', method: () => { window.histroy.back() } }
        ],
      },
      tableShow: false,
      maxHeight: 0,
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow1')
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".ProjectPayeeIndex", [
        ".ProjectPayeeIndex .toolbar",
        ".ProjectPayeeIndex .block",
      ]);
    })
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
          "busicode": "ProjectPayeeList",
          "data": this.tableQuery,
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
      
    },
    //删除
    deleteRow(val){
      let _this = this
      let params = {
          "busicode": "ProjectPayeeDelete",
          "data": {
            id:val.row.id,
          },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.init();
      })
    },
    // 添加按钮点击事件
      add(val) {
        // this.bankLinkShow = false;
        this.EditVisible = true;
        console.log(this.$refs.ProjectPayeeEdit)
        if(val==='add'){
          // this.$refs.ProjectPayeeEdit.editData({
          //   subjectName:'',
          //   status:'1',
          //   comments:'',
          // },'add');
          this.common.chargeObjectEqual(this,this.formData,'set','ProjectPayeeEdit');
        }else{
          let _this = this;
          let params = {
              "busicode": "ProjectPayeeQuery",
              "data": {
                id:val.row.id,
              },
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$refs.ProjectPayeeEdit.editData(res,'update');
            this.common.chargeObjectEqual(this,res,'set','ProjectPayeeEdit');
          })
        }
        
      },
    
     // 搜索
    search(){
      this.tableQuery.page = 1;
      this.init()
    },
      // 列表的NO列
      indexMethod(index) {
        return (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      },
      
      handleSizeChange(val) { //显示多少数据一页
        this.tableQuery.pageCount = val;
        this.tableQuery.page = 1;
        this.init();
      },
      handleCurrentChange(val) {  //页码点击
        this.tableQuery.page = val;
        this.init();
      },
      closeDialog(){
        // this.crumbsData.titleList.pop();
        this.EditVisible = false;
      },
      // 返回
      handleClose() {
        this.$refs.ProjectPayeeEdit.handleClose();
      },
      //保存按钮
      submitForm(formName) {
        this.$refs.ProjectPayeeEdit.submitForm(formName);
      },
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
.ProjectPayee {
  width: 100%;
  height: 100%;
  .ProjectPayeeIndex{
  width: 100%;
  height: calc(100% - 41px);

  }
}
</style>

