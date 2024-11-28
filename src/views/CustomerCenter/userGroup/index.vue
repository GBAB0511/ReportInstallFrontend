<template>
  <div>
    <div class="userGroup" v-if="editContent">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <el-button size="mini" type="primary" @click="add('add')">保存</el-button>
          <el-button icon="el-icon-caret-left" size="mini" @click="closeEdit">返回</el-button>
        </div>
      </div>
      <el-dialog title="添加" :visible.sync="addVisible" v-if="addVisible" @close="closeDialog1" :close-on-click-modal="false" class="button-dialog">
        <QuestionSearchUser :mainBookNo="ruleForm.bookNo" :mainMeterReadingStaffAccount="searchMeterReadingStaffAccount" :mainMeterReadingStaffName="searchMeterReadingStaffName" @addBtnChange="addBtnChange" ref="QuestionSearchUser"></QuestionSearchUser>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="addBtn" size="mini" @click="addRow">确 定</el-button>
          <el-button type="info" size="mini" @click="closeDialog1">返 回</el-button>
        </div>
      </el-dialog>

      <el-dialog title="册本选择" :visible.sync="openBookNoVisible" v-if="openBookNoVisible" @close="closeDialog1" :close-on-click-modal="false" class="button-dialog">
        <bookInfo @addBookNoChange="addBookNoChange" ref="bookInfo"></bookInfo>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="addBookNoBtn" size="mini" @click="addBookNoRow">确 定</el-button>
          <el-button type="info" size="mini" @click="closeDialog1">返 回</el-button>
        </div>
      </el-dialog>

      <div class="userGroup">
        <div class="toolbar" style="outline:none" tabindex="0">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="formBill-Two bookInfo-editForm demo-form-inline" :inline="true">

            <el-form-item label="组编号：" prop="userGroupNo">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.userGroupNo" size="mini" clearable></el-input>
            </el-form-item>

            <el-form-item label="组名称：" prop="userGroupName">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.userGroupName" size="mini" clearable></el-input>
            </el-form-item>
           <!-- <el-form-item label="册本号：" prop="bookNo">
               <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @focus="openBookNoDialog" v-model="ruleForm.bookNo" size="mini" clearable></el-input>
              <el-select v-model="ruleForm.bookNo" filterable remote clearable reserve-keyword placeholder="请输入册本号" :remote-method="booKNoDataOptions" :loading="false">
                <template v-for="item in bookNoData">
                  <el-option :key="item.bookNo" :label="item.bookNo" :value="item.bookNo">
                  </el-option>
                </template>
              </el-select>
            </el-form-item>  -->
            <!--el-form-item label="结构化地址：" prop="adminArea">
            <el-select
              v-model="ruleForm.adminArea"
              filterable
               ref="addrselect"
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="adminAreaDataOptions"
              :loading="false">
              <template v-for="item in adminAreaData">
                <el-option
                  :key="item.fullName"
                  :label="item.fullName"
                  :value="item.fullName">
                </el-option>
              </template>
                   <template slot="empty">
              <p class="el-select-dropdown__empty">
                无数据
              </p>
            <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
            <div style="height:30px;line-height: 30px;text-align:right" >
              <span  style="cursor: pointer;" @click="showAddrAddDialog">
                <i class="el-icon-plus"></i>
              <span>添加</span>
              </span>
            </div>
          </div>

              </template>
              <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
            <div style="height:30px;line-height: 30px;text-align:right" >
              <span  style="cursor: pointer;" @click="showAddrAddDialog">
                <i class="el-icon-plus"></i>
              <span>添加</span>
              </span>
            </div>
          </div>
            </el-select>
            
          </el-form-item-->
            <el-form-item label="排序号：" prop="sortNo">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.sortNo" size="mini" clearable type="text"></el-input>
            </el-form-item>
          </el-form>

          <div style="width:100%;margin-top:12%">
            <div class="bread-contain-left">
              <el-form :inline="true" size="mini" class="demo-form-inline width-150">
                <el-form-item class="userNo">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userQuery.fuzzyQuery" placeholder="请输入用户编号" @keydown.enter.native="iniuserGroupList" size="mini" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" class='searchBtn' @click="iniuserGroupList" icon="el-icon-search"></el-button>
                </el-form-item>
                <el-form-item>
                  <div> 共{{ totalUser }}个用户</div>
                </el-form-item>
              </el-form>
            </div>
            <div class="bread-contain-right">
              <el-button size="mini" type="primary" @click="addUser()">添加用户</el-button>
            </div>
          </div>
          <!-- <div class="bread-contain-class">
      <div class="bread-contain-left"> 共{{ totalUser }}个用户</div>
      
      </div> -->

        </div>
        <div class="kl-table">
          <el-table highlight-current-row center stripe border :data="userData.list" :max-height="editGroupMaxHeight" class="wuserInfo-table">
            <el-table-column align="center" type="index" label="NO." width="80"></el-table-column>


            <el-table-column prop="userNo" min-width="150" label="用户编号" show-overflow-tooltip></el-table-column>

            <!-- <el-table-column prop="userNo" min-width="150" label="用户组编号" show-overflow-tooltip></el-table-column> -->

            <el-table-column prop="ctmName" min-width="230" label="客户名称" show-overflow-tooltip></el-table-column>

            <el-table-column align="left" prop="setupMeterAddr" min-width="360" label="装表地址" show-overflow-tooltip></el-table-column>

            <el-table-column prop="meterReadingStaffName" min-width="150" label="抄表员" show-overflow-tooltip></el-table-column>

            <el-table-column prop="businessArea" min-width="110" label="营业区域" show-overflow-tooltip></el-table-column>

            <el-table-column prop="useWaterType" min-width="150" label="用水类型" show-overflow-tooltip></el-table-column>

            <el-table-column prop="status" min-width="100" label="用户状态" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" fixed="right" width="60">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click.native="delte(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>

    <el-dialog title="批量删除" :visible.sync="batchDelVisible" v-if="batchDelVisible" @close="closeDelDialog" width="80%" :close-on-click-modal="false" class="button-dialog">
      <BatchDelUserGroup ref="batchDel" @hasSelect="changeDelBtn"></BatchDelUserGroup>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="delBtn" size="mini" @click="batchDelConfirm">确认删除</el-button>
        <el-button type="info" size="mini" @click="closeDelDialog">返 回</el-button>
      </div>
    </el-dialog>

    <!--主列表界面-->
    <div class="userGroup" v-else>
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <!-- <h2 class="tab-title">
        <i></i>
        册本信息</h2> -->
        <div class="bread-contain-right">
          <el-button size="mini" type="primary" @click="batchDel()">批量删除</el-button>
          <el-button size="mini" type="primary" @click="edit('add')" icon="el-icon-plus">添加</el-button>
        </div>
      </div>

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150" @submit.native.prevent>
          <!-- <el-form-item class="form-left"> -->
          <!-- class="longinput" -->
          <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="模糊查询：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" placeholder="用户组编号" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>
         <!-- <el-form-item label="册本号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="册本号" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>-->
          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">
          <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->

          <el-table-column type="index" label="NO." width="50" :index="indexMethod">
          </el-table-column>

          <!-- <el-table-column prop="usn" min-width="120" label="开账状态" show-overflow-tooltip>
        </el-table-column> -->
          <!--<el-table-column prop="bookNo" min-width="100" label="册本号">
          </el-table-column> -->

          <el-table-column prop="userGroupNo" min-width="100" label="组编号">
          </el-table-column>

          <el-table-column prop="userGroupName" min-width="100" label="组名称">
          </el-table-column>

          <!--el-table-column prop="adminArea" min-width="220" label="结构化地址" show-overflow-tooltip>
        </el-table-column-->

          <el-table-column prop="sortNo" min-width="100" label="排序号">
          </el-table-column>
          <el-table-column prop="num" min-width="60" label="人数">
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="edit(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click.native="del(scope.row)">删除</el-button>
              <!-- <el-button type="text" size="mini" @click.native="editGroupUser(scope.row)">组用户</el-button> -->
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
    <addrAdd :addrVisible="addrVisible" v-if="addrVisible" @closeAddrAddVisible="closeAddrAddVisible"></addrAdd>
  </div>
</template>
<script>
import QuestionSearchUser from "./QuestionSearchUser";
import BatchDelUserGroup from "./BatchDelUserGroup";
import addrAdd from "@/components/addrAdd"
import bookInfo from "@/components/bookNoInfo"

export default {
  name: "userGroup",
  components: {
    QuestionSearchUser,
    addrAdd,
    bookInfo,
    BatchDelUserGroup
  },
  data () {
    return {
      searchMeterReadingStaffAccount: "",
      searchMeterReadingStaffName: "",//带入添加用户的抄表员下拉菜单
      openBookNoVisible: false,//册本号弹窗选择
      addBtn: true,
      addBookNoBtn: true,//册本号选择按钮
      tableData: {},
      addVisible: false,
      addrVisible: false,
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false,
      },
      userData: {
        list: []
      },
      userNos: [],
      businessAreaData: [], //营业区域下拉框
      userQuery: {
        fuzzyQuery: "",
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea: "",
        fuzzyQuery: "",
        bookNo: ""
      },
      totalUser: 0,
      crumbsData: {  //面包屑
        titleList: [
          // { title: '抄表中心', path: '/MeterReadingCenter' },
          { title: '客户管理' },
          { title: '用户组管理' }
        ],

      },
      //adminAreaData:[],//行政区域下拉框
      bookNoData: [],//册本号数据下拉框
      tableShow: false,
      maxHeight: 0,
      editMaxHeight: 100,
      editGroupMaxHeight: 0,
      ruleFormData: {},
      editContent: false,
      editGroup: false,
      editForm: false,
      ruleForm: {
        bookNo: '',
        userGroupNo: '',
        userGroupName: '',
        sortNo: '',
        //adminArea: '',
      },
      rules: {

        userGroupNo: [{ required: true, message: "组编号不能为空", trigger: 'change' }],
        userGroupName: [{ required: true, message: "组名称不能为空", trigger: 'change' }],
        //adminArea:[{ required:true, message:"行政区域不能为空", trigger: 'change'}],
      },
      // 批量删除
      batchDelVisible: false,
      delData: [],
      delBtn: true,
    }
  },
  mounted () {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow4')
    this.selectBAreaOptions();
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, '.userGroup',
      ['.userGroup .toolbar',
        '.userGroup .block',
        '.userGroup .bread-contain'])
  },
  methods: {
    
inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    closeAddrAddVisible () {
      this.addrVisible = false;
    },
    showAddrAddDialog () {
      this.$refs.addrselect.blur();
      this.addrVisible = true;
    },
    init () {
      let _this = this
      let params = {
        "busicode": "UserGroupList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    //选择册本号
    openBookNoDialog () {
      this.openBookNoVisible = true
    },
    //行政区域：
    adminAreaDataOptions (query) {
      if (query == null || query.length == 0) {
        return
      }
      let params = { busicode: "AdminAreaQuery", data: { areaName: query, isLeaf: 1 } };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "adminAreaData", res.list)
        })
    },
    //册本号：
    booKNoDataOptions (query) {
      if (query == null || query.length == 0) {
        return
      }
      let params = { busicode: "BaseBookList", data: { fuzzyQuery: query, page: 1, pageCount: 10 } };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "bookNoData", res.list)
        })
    },
    //营业区域
    selectBAreaOptions (id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAreaData = data.children;
        console.log(_this.businessAreaData);

      })
    },
    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    delte (row) {
      let data = {
        userGroupNo: null,
        userNos: [row.userNo]
      }
      let params = { busicode: "UserGroupNoDel", data: data };

      this.$api
        .fetch({ params })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '已从该组删除用户',
            type: 'success'
          });
          this.iniuserGroupList()
        })
    },
    addUser () {
      this.addVisible = true
      console.log(this.$refs.QuestionSearchUser)
    },
    addBtnChange (val) {
      this.addBtn = val
    },
    addBookNoChange (val) {
      this.addBookNoBtn = val
    },
    addBookNoRow () {
      let list = this.$refs.bookInfo.radioSelect;
      console.log(list);
      this.ruleForm.bookNo = list.bookNo
      this.searchMeterReadingStaffName = list.meterReadingStaffName
      this.searchMeterReadingStaffAccount = list.meterReadingStaffAccount
      this.openBookNoVisible = false
    },
    addRow () {
      let list = this.$refs.QuestionSearchUser.selectData;
      console.log(list);
      this.userNos = []
      if (!this.userData.list) {
        this.userData.list = list
        list.forEach(element => {
          this.userNos.push(element.userNo);
        });
      } else {
        list.forEach(element => {
          if (this.userData.list.every(item => item.userNo !== element.userNo)) {
            this.userNos.push(element.userNo);
            this.userData.list.push(element)
          }
        });
      }
      console.log(this.userData.list);
      // let data = {
      //   userGroupNo:this.ruleForm.userGroupNo,
      //   userNos:userNos
      // }
      // let params = { busicode: "UserGroupNoDel", data: data };
      // this.$api
      //   .fetch({ params })
      //   .then(res => {
      //     this.$notify({
      //       title: '成功',
      //       message: '添加成功',
      //       type: 'success'
      //     });
      //     this.closeDialog1();
      //     this.iniuserGroupList()
      //     this.addBtn = true
      //   })
      this.closeDialog1();
      this.addBtn = true
    },
    //树结构数据处理
    getArr (data) {
      function abc (arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },

    demand () {  //查询
      this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //分页
    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange (val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod (index) {//获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);

    },
    closeDialog () { //关闭会话
      this.init()
    },
    closeDialog1 () {
      this.addVisible = false
      this.openBookNoVisible = false
    },
    // 添加
    add (val) {
      let _this = this;
      var data = _this.ruleForm;
      //     if(this.totalUser == 0){
      //       this.$notify({
      //     title: '验证失败',
      //     message: '用户数为0，不能保存',
      //     type: 'error'
      //     });
      //   return;
      // }
      // 行政区域 只需要传最后一个值过去
      //data.adminArea = this.common.handleTreeData(data.adminArea)

      let isEdit = false;
      _this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          isEdit = true
        }
      });
      if (isEdit) {
        this.$notify({
          title: '验证失败',
          message: '当前表单必填项未完善',
          type: 'error'
        });
        return
      }
      //保存用户
      let dataUser = {
        userGroupNo: this.ruleForm.userGroupNo,
        userNos: this.userNos
      }
      let paramUser = { busicode: "UserGroupNoDel", data: dataUser };
      if (this.userNos && this.userNos.length > 0) {
        this.$api
          .fetch({ params: paramUser })
          .then(res => {
            this.userNos = []
          })
      }

      //保存用户组
      let params = {
        "busicode": "UserGroupSave",
        "data": data,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        });
        this.closeEdit();
      })
    },
    // 编辑
    edit (val) {
      if (val === 'add') {
        this.ruleForm = {
          bookNo: '',
          userGroupNo: '',
          userGroupName: '',
          sortNo: '',
          //adminArea: '',
        };
        this.userData = {}
        this.totalUser = '0'
        this.type = "add";
      } else {
        this.ruleForm = val;
        delete this.ruleForm.userGroupNoList;
        this.type = "update";
        this.iniuserGroupList();
        this.searchMeterReadingStaffName = val.meterReaderName
        this.searchMeterReadingStaffAccount = val.meterReaderAccount
      }
      this.editGroup = true //子页面组用户显示
      this.editForm = true //子页面表单显示
      this.editContent = true; //子页面显示
      //this.adminAreaDataOptions();
      this.$nextTick(() => {
        // this.editMaxHeight = $('.bookInfo-editForm').outerHeight() - $('.search-item').outerHeight() - 34
        // this.editGroupMaxHeight = $('.userGroup').outerHeight() - $('.toolbar').outerHeight() - $('.bookInfo-editForm').outerHeight() - $('.bread-contain-right').outerHeight() - $('.userGroup .bread-contain').outerHeight() - ($('.formBill-Two .el-form-item').outerHeight(true))*2
        this.editGroupMaxHeight = $('.userGroup').outerHeight() - $('.toolbar').outerHeight() - $('.bread-contain-right').outerHeight() - $('.userGroup .bread-contain').outerHeight()
        console.log($('.userGroup').outerHeight() + '  ' + $('.toolbar').outerHeight() + '  ' + $('.bread-contain-right').outerHeight());
        console.log(this.editGroupMaxHeight);
      })
    },
    editGroupUser (val) {
      this.editForm = false
      this.editContent = true
      this.editGroup = true;
      this.ruleForm = val;
      this.iniuserGroupList();
      //this.adminAreaDataOptions();
      this.$nextTick(() => {
        this.editMaxHeight = $('.userGroup').outerHeight() - $('.toolbar').outerHeight() - $('.bread-contain-right').outerHeight() - 40
      })
    },
    iniuserGroupList () {
      let _this = this;
      let params = {
        busicode: "UserInfoList",
        data: { userGroupNo: this.ruleForm.userGroupNo, fuzzyQuery: this.userQuery.fuzzyQuery, page: 1, pageCount: 999 }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.userData = res;
          _this.totalUser = res.total
        })
    },

    del (row) {
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "UserGroupDelete",
          "data": { userGroupNo: row.userGroupNo },
        }
        this.$api.fetch({
          params: params,//参数
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
    closeEdit () {
      this.editContent = false;
      this.init();
    },
    // 批量删除
    batchDel () {
      this.batchDelVisible = true;
    },
    batchDelConfirm () { //确认删除
      this.$confirm('删除后不可恢复，请谨慎操作！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        // 执行删除
        this.toBatchDel();
      }).catch(err => {
        this.$message({
          'message': '已取消删除',
          'type': 'info'
        })
      })
    },
    toBatchDel () {
      let delData = this.$refs.batchDel.selectData;
      let userGroupNoList = delData.map(item => {
        return item.userGroupNo
      })
      let data = {
        userGroupNoList: userGroupNoList,
      }
      let params = { busicode: "UserGroupBatchDelete", data: data };
      this.$api.fetch({ params })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.$refs.batchDel.init()
        })
    },
    closeDelDialog () { // 关闭
      this.batchDelVisible = false;
      this.delBtn = true;
    },
    changeDelBtn (state) {
      this.delBtn = state;
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.userGroup {
  width: 100%;
  height: 100%;
}
.bread-contain-left {
  // float: left;
  //  position: absolute;
  width: 47%;
  height: 10%;
  //  margin: 1%;
  font-size: 14px;
  /deep/ {
    .userNo {
      margin-left: 110px;
      width: 50%;
      .el-form-item__content {
        width: 100% !important;
        .el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
}
.formBill-Two {
  margin-top: 10px;
  /deep/ {
    .el-form-item__label {
      height: 30px;
      line-height: 30px;
    }
    .el-select .el-input__suffix {
      line-height: 50px;
    }
  }
}
.bookInfo-editForm {
  padding: 10px;
  // height: calc(100% - 40px);
  // .el-form-item {
  //   margin-bottom: 30px !important;
  // }
  .width-200 {
    /deep/ {
      .el-input {
        width: 200px;
      }
    }
  }
  .search-item {
    text-align: right;
    margin-bottom: 6px;
  }
}
</style>
