<template>
  <div class="valve">
    <div class="bread-contain" v-if="!handleContent && !ChangeTablesHandleVisible">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
 
      <div class="bread-contain-right">
         <el-button @click="add" size="mini" icon="el-icon-plus" type="primary">添加</el-button>
      </div>
    </div>
    <div class="bread-contain" v-if="handleContent">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
   <!--修改用户-->
      <div class="bread-contain-right">
           <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
      </div>
    </div>
    <!--添加用户-->
       <div class="bread-contain" v-if="ChangeTablesHandleVisible">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>

      <div class="bread-contain-right">
         <!-- 判断是否欠费 -->
         <el-button size="mini" type="primary" @click="save">暂存</el-button>
           <el-button  icon="el-icon-caret-left" size="mini" @click="closeDialog" >返回</el-button>
      </div>
    </div>
<div v-if="!handleContent && !ChangeTablesHandleVisible">
   <div class="toolbar" >
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150">
    
         <el-form-item label="单据编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.trim="tableQuery.billNo" placeholder="" @keydown.enter.native="demand" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list"  class="wuserInfo-table">

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="valveCloseName" min-width="40" label="关阀进度">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.valveCloseName === '完成'" size="mini" type="success" effect="dark">{{scope.row.valveCloseName}}</el-tag>
            <el-tag v-else type="danger" size="mini" effect="dark">{{scope.row.valveCloseName}}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="processName" min-width="40" label="状态">
        </el-table-column>

        <el-table-column prop="billNo" min-width="80" label="单据编号">
        </el-table-column>

      <el-table-column prop="receiptTime" min-width="80" label="单据日期">
        </el-table-column>

        <el-table-column prop="reason" min-width="100" label="关停原因">
        </el-table-column>

        <el-table-column prop="planCloseNum" min-width="50" label="计划关停数量">
        </el-table-column>

          <el-table-column prop="closeNum" min-width="50" label="已关停数量">
        </el-table-column>

         <el-table-column prop="cancelNum" min-width="40" label="已取消数">
        </el-table-column>

        <el-table-column prop="openNum" min-width="40" label="已开数">
        </el-table-column>

        <el-table-column prop="waitOpenNum" min-width="40" label="待开数量">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.finishFlag == '草稿'" @click.native="edit(scope.row)">修改</el-button>
             <el-button type="text" size="mini" v-if="scope.row.finishFlag == '草稿'" @click.native="del(scope.row)">删除</el-button>
             <el-button type="text" size="mini" v-else @click.native="details(scope.row)">详情</el-button>
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
<!--添加/编辑-->
    <div v-if="ChangeTablesHandleVisible" class='indexContent'>
      <ChangeTablesHandle ref="ChangeTablesHandle" style="height:calc(100% - 81px)" :editNeedData="editNeedData"></ChangeTablesHandle>
    </div>
    <!--详情-->
    <div v-if="handleContent" class="indexContent">
    <handleInfo style="height:calc(100% - 81px)" 
       :editNeedData="editNeedData"
    >
    </handleInfo>
    </div>
  </div>
</template>
<script>
import handleInfo from './closeValveHandleInfo' //详情
import ChangeTablesHandle from './addCloseValveMsg'// 添加.编辑用户
export default {
  name: "valve",
  components: {
    handleInfo,
    ChangeTablesHandle
  },
  data() {
    return {
      editFormContent: 0,
      saveList: 0,
      userFeeListData:[],
       //详情页面存值
      editNeedData:[],
      NotDisabled:false,
      tableData: {},
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      tableQuery:{
        page:1,
        pageCount:20,
        billNo:"",
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '抄表中心', path: '/MeterReadingCenter' },
          { title: '客户管理' },
           { title: "开关阀管理" },
          { title: '关阀管理' }
        ],

      },

      tableShow: false,
      maxHeight: 0,
      ruleFormData: {},
      editContent: false,
      ChangeTablesHandleVisible: false,
      dialogForm: {
        valveNo: '',
        valveName:'',
        sortNo: '',
        adminArea: '',
      },
      handleContent: false
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow4')
       // 接收handleinfo的返回
    // eventBus.$on('closeDialog', (bool) => {
    //   this.handleContent = bool;
    // });
    this.init();  

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, '.valve', 
        ['.valve .toolbar', 
          '.valve .block', 
          '.valve .bread-contain'])
  },
  methods: {
    
inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //数据初始化
    init() {
      let _this = this
      let params = {
        "busicode": "ValveCloseList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
            _this.tableData = res;
          // _this.tableData.list.forEach(ele =>{
          //   if(ele.finishFlag == '1'){
          //   ele.processState = "审批完成"
          // } else {
          //   //后端转换文字
          //   if(ele.processState == 'END'){
          //        ele.processState = "进行中"
              
          //   } else if(ele.processState == '') {
          //       ele.processState = "草稿"
            
          //   }else{
          //       ele.processState = "审批中"
          //   }
          // }
          //    })
      })
    },
  closeDialog(){
      this.handleContent = false;
      this.ChangeTablesHandleVisible = false
      this.init()
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
      if(val){
      this.tableQuery.page = val
      this.init()
            }
    },
    indexMethod(index) {//获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    },
    // 添加
    add() {
      this.editNeedData = []
      this.editNeedData.busicode  = 'ValveCloseAdd'
      this.ChangeTablesHandleVisible = true;
    },
    edit(row){
      this.ChangeTablesHandleVisible = true;
       this.editNeedData = row
       this.editNeedData.busicode  = 'ValveCloseUpdate'
    },

    save() {
      this.$refs.ChangeTablesHandle.save()
    },

    // 详情按钮事件
    // 根据单据状态判断进入的界面
    // 单据状态 processState ：
    details(row) {
    
      this.editNeedData = row
      this.handleContent = true;
    },

    del(row){
      
      this.$confirm('是否删除此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            "busicode": "ValveCloseDelete",
            "data": {valveCloseId:row.id},
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

</style>
