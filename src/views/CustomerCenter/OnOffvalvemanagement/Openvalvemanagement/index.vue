<template>

  <div class="Openvalvemanagement">
     <el-dialog
           title="转办人员列表"
           :visible.sync="administrativeDialog"
           width="30%"
           >
       <el-form size="mini" :model="tableQuery">
         <el-form-item label="转办人员：">
            <el-select class="selectf1" filterable clearable v-model="tableQuery.administrativeName" placeholder="请选择">
            <el-option-group
                v-for="group in administrativeOptions"
                :key="group.account"
                :label="group.userName">
              <el-option
               v-for="item in group.options"
               :key="item.account"
               :label="item.userName"
               :value="item.account">
             </el-option>
           </el-option-group>
            </el-select>
          </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
    <el-button @click="administrativeDialog = false">取 消</el-button>
    <el-button type="primary" @click="confirmadministrative">确 定</el-button>
  </span>
      </el-dialog>
  <!-- 弹出表单查看操作历史 -->
    <el-dialog title="操作历史" v-if="valveHistoryDialog" :visible.sync="valveHistoryDialog" :close-on-click-modal="false" class="button-dialog" @close="closeDialogValveHistory">
      <ValveHistory ref="ValveHistory" :editNeedId="editNeedId"></ValveHistory>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="fixDialogValveHistory">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogValveHistory">取 消</el-button>
      </div>
    </el-dialog>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- <div class="bread-contain-right">
         <el-button @click="add" size="mini" icon="el-icon-plus" type="primary">添加</el-button>
      </div> -->
    </div>
<div>
   <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150">
        <!-- <el-form-item class="form-left"> -->
        <!-- class="longinput" -->
          <el-form-item label="阀门状态：">
            <el-select ref="select1" clearable v-model="tableQuery.valveStatus" placeholder="请选择">
              <el-option
                v-for="(item,index) in valveStateOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="模糊查询：" class="width-200">
              <el-tooltip class="item" effect="dark" content="用户编号、客户名称、用户电话" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keyup.enter.native="search"></el-input>
              </el-tooltip>
            </el-form-item>
          <el-form-item label="处理人员：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.openOperator" @keyup.enter.native="search"></el-input>
            </el-form-item>
            
           <el-form-item label='开阀日期：'>
            <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        <el-form-item>
          <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
        <!-- <el-form-item style="float: right">
          <el-button size="mini" type="primary" icon="el-icon-plus">增加</el-button>
          <el-button size="mini" type="primary">删除</el-button>
          <el-button size="mini" type="primary" icon="el-icon-upload2">导出</el-button>
        </el-form-item> -->

        <!-- </el-form-item> -->
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list"  class="wuserInfo-table">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->

       <el-table-column type="index" label="序号" width="50" :index="indexMethod">
        </el-table-column>

        <!-- <el-table-column prop="usn" min-width="120" label="开账状态" show-overflow-tooltip>
        </el-table-column> -->


        <el-table-column prop="userNo" min-width="140" label="用户编号">
        </el-table-column>

      <el-table-column prop="userName" min-width="250" label="客户名称" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="userAddr" min-width="250" label="客户地址" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="valveStatusName" min-width="80" label="阀门状态">
        </el-table-column>

        <el-table-column prop="operator" min-width="100" label="处理人员">
        </el-table-column>

         <el-table-column prop="remoteFlag" min-width="80" label="是否远程">
        
        </el-table-column>

       <el-table-column prop="valveControlFlag" min-width="80" label="是否阀控">
  
        </el-table-column>

         <el-table-column prop="createTime" min-width="200" label="创建时间">
        </el-table-column>

        <el-table-column prop="openOverdueTime" min-width="200" label="逾期时间">
        </el-table-column>

        <el-table-column prop="openTime" min-width="200" label="开阀时间">
        </el-table-column>
  
        <el-table-column label="操作" fixed="right" width="170">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if=" (scope.row.valveStatus == 3 || scope.row.valveStatus == 4) && scope.row.remoteFlag == '否'" @click.native="checkvalvehistory(scope.row)">操作历史</el-button>
             <el-button type="text" size="mini" v-if="scope.row.valveStatus == 3 && scope.row.remoteFlag == '否'" @click.native="openValve(scope.row)">开阀</el-button>
            <el-button type="text" size="mini" v-if="scope.row.valveStatus == 3 && scope.row.remoteFlag == '否'" @click.native="getadministrative(scope.row)">转办</el-button>
             <!-- <el-button type="text"  @click.native="getadministrative(scope.row)">处理</el-button> -->
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
import ValveHistory from '@/components/valveHistory'
export default {
  name: "Openvalvemanagement",
  components: {
       ValveHistory
  },
  data() {
    return {
      //获取行ID
      userRowListId: "",
      //开阀历史弹窗
      valveHistoryDialog: false,
      //传给费用明细(子组件)的ID
      editNeedId: "",
      saveList: 0,
      userFeeListData:[],
      //转办人员弹框
       administrativeDialog: false,
       //转办人员下拉菜单
       administrativeOptions: [],
      //外勤人员下拉菜单
       fieldStaffList: [],
       //抄表人下拉菜单
       meterReadingPersonnelList: [],
       //后端返回字典
       valveStateOptions: [
          {
           id:'1',
           name: '已开阀'
         },
         {
           id:'2',
           name: '待开阀'}
       ],
       Time: [],
       //详情页面存值
      editNeedData:[],
      NotDisabled:false,
      tableData: {},
      tableQuery:{
        page:1,
        pageCount:20,
        valveStatus: "",
        userNo: "",
        userName: "",
         tel: "",
        startDate: "",
        endDate: "",
        operator: ""
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户管理' },
          { title: "开关阀管理" },
          { title: '开阀管理' }
        ],

      },
      tableShow: false,
      maxHeight: 0,
      ruleFormData: {},
      editContent: false,
      ChangeTablesHandleVisible: false,
      dialogForm: {
        OpenvalvemanagementNo: '',
        OpenvalvemanagementName:'',
        sortNo: '',
        adminArea: '',
      },
      handleContent: false
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow4')
    this.init();
    

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, '.Openvalvemanagement', 
        ['.Openvalvemanagement .toolbar', 
          '.Openvalvemanagement .block', 
          '.Openvalvemanagement .bread-contain'])
  },
  methods: {
         enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    //数据初始化
    init() {
      let _this = this
      let params = {
        "busicode": "ValveOpenList",
        "data": _this.tableQuery,
      }
      delete  _this.tableQuery.administrativeName
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
       
            _this.tableData = res;
      })
    },
      // 查看操作历史弹出框取消按钮
    closeDialogValveHistory() {
      this.valveHistoryDialog = false;
    },
    fixDialogValveHistory(){
      this.valveHistoryDialog = false;
    },
    //查看操作历史
    checkvalvehistory(row){
        this.valveHistoryDialog = true
        this.editNeedId = row.id
    },
    openValve(row){
          this.$confirm('是否确认开阀?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            "busicode": "ValveOpen",
            "data": {id:row.id,
            userNo:row.userNo},
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$message({
              type: 'success',
              message: '开阀成功!'
            });
            this.init();
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消开阀'
          });          
        });
    },
  closeDialog(){
      this.handleContent = false;
      this.ChangeTablesHandleVisible = false
      this.init()
    },
    search() {  //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
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
        //确认转办人员列表
    confirmadministrative(){
       
    //  let tempArr = [];
      let Data = [];
    
     for (let i = 0; i < this.administrativeOptions.length; i++) {
       for(let j = 0; j< this.administrativeOptions[i].options.length; j++){
           if (this.tableQuery.administrativeName === this.administrativeOptions[i].options[j].account) {
          Data.push({
            account: this.administrativeOptions[i].options[j].account,
            userName:this.administrativeOptions[i].options[j].userName
          });
        
            this.keyData = Data
        } else {
  
         }     
       }
      }
      let params = {
          "busicode": "ValveTransfer",
          "data": {
            account: Data[0].account,
            name: Data[0].userName,
            type: 2,
            id: this.userRowListId
          },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
              this.$message({
            type: "success",
            message: "转办成功!"
          });
          this.administrativeDialog = false
          this.init()
      })

    },
    //转办人员
    getadministrative(row){
      this.administrativeOptions = [];
      this.userRowListId = row.id
      this.administrativeDialog = true
      // let _this = this
      let params = {
          "busicode": "ValveTransferAccountList",
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {

        let tempArr = [] //外勤人
        let tempArrs = [] //抄表人
        var adminList = res.legworkList
        var adminLists = res.meterReaderList
       
        // 外勤人员
        for(var i = 0;i < adminList.length; i++){
          tempArr.push({
            account:adminList[i].userAccount,
            userName:adminList[i].userName
          })
    
        this.fieldStaffList.options = tempArr
        };
          // 抄表人员
        for(var i = 0;i < adminLists.length; i++){
          tempArrs.push({
            account:adminLists[i].userAccount,
            userName:adminLists[i].userName
          })
     
        this.meterReadingPersonnelList.options = tempArrs
        };
       this.administrativeOptions.push(
         {userName: '外勤人员', options:this.fieldStaffList.options},
         {userName: '抄表人员', options:this.meterReadingPersonnelList.options})
     
      })
    },
    // 添加
    add() {
      this.ChangeTablesHandleVisible = true;
    },

        // 暂存
    save() {
      this.$refs.ChangeTablesHandle.save()
    },
     // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.startDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 编辑
    edit(val) {
      if(val==='add'){
        this.dialogForm={
          OpenvalvemanagementNo: '',
          OpenvalvemanagementName:'',
          sortNo: '',
          adminArea: '',
        };
        this.type="add";
      }else{
        this.dialogForm=val;
        this.type="update";
      }
      this.editContent = true;
      this.adminAreaDataOptions();
    },
    // 详情按钮事件
    // 根据单据状态判断进入的界面
    // 单据状态 processState ：
    details(row) {

      this.editNeedData = row
      this.handleContent = true;
    },

    del(row){
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            "busicode": "UserGroupDelete",
            "data": {id:row.id},
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
.selectf1{
  width: 120px;
}
</style>
