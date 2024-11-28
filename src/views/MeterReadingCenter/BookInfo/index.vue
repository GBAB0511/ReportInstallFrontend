<template>

  <div class="MeterReadingCircuit" v-if="editContent==1">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="add('add')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeEdit">返回</el-button>
      </div>
    </div>

    <el-form :model="dialogForm" ref="ruleForm" :rules="rules" label-width="100px" class="formBill-Two bookInfo-editForm">

        <el-form-item label="册本编号：" prop="bookNo">
          <el-input v-model="dialogForm.bookNo" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="抄 表 员：" prop="meterReadingStaffName">
          <el-select v-model="dialogForm.meterReadingStaffName" clearable size="mini" @change="meterReaderChange">
            <el-option v-for="item in meterReaderList" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="册本名称：" prop="bookName">
          <el-input v-model="dialogForm.bookName" size="mini" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="抄表周期：" prop="meterReadingCycle">
          <el-select v-model="dialogForm.meterReadingCycle" clearable size="mini">
            <el-option v-for="(item,index) in dictionaryData.RTP" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
<!--        <el-form-item label="营业所：" prop="businessAbode">-->
<!--          <el-select v-model="dialogForm.businessAbode" clearable size="mini" @change="changeBAbode(dialogForm.businessAbode)">-->
<!--            <el-option v-for="item in businessAbodeOptions"  :key="item.value" :label="item.name" :value="item.id"> </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="营业区域：" prop="businessArea">
            <el-cascader ref="cascader" clearable v-model="dialogForm.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
        </el-cascader>
        </el-form-item>
        <el-form-item label="抄 表 日：" prop="meterReadingDay">
          <el-input v-model="dialogForm.meterReadingDay" size="mini" clearable type="text" onkeyup="value=(value.replace(/\D/g,'')==''?'0':parseInt(value));if(value<0){value=0}else if(value>31){value=31}"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="dialogForm.status" clearable size="mini">
            <el-option v-for="item in statusDict" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：" prop="describe" class="f4">
          <el-input type="textarea" v-model="dialogForm.comments"></el-input>
        </el-form-item>
    </el-form>
  </div>
  <div class="MeterReadingCircuit" v-else-if="editContent==2">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="closeEdit">返回</el-button>
      </div>
    </div>
    <BookInfoUserEdit :bookNo="bookNo" :bookName="bookName" v-if="editContent==2"></BookInfoUserEdit>
  </div>
  <div class="MeterReadingCircuit" v-else>
    <el-dialog title="变更记录" :visible.sync="bookInfoChangeItemVisible" width="80%" class="common-dialog" @close="changeItemColse">
      <BookInfoChangeItem v-if="bookInfoChangeItemVisible" :bookNo="changeItemBookNo" ref="BookInfoChangeItem"></BookInfoChangeItem>
    </el-dialog>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- <h2 class="tab-title">
        <i></i>
        册本信息</h2> -->
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="edit('add')" icon="el-icon-plus">添加</el-button>
         <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
      </div>
    </div>

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150">
        <!-- <el-form-item class="form-left"> -->

        <el-form-item label="营业区域：">
<!--          <el-select v-model="tableQuery.businessArea" clearable size="mini" >-->
<!--            <el-option v-for="item in businessAreaData"  :key="item.value" :label="item.name" :value="item.id"> </el-option>-->
<!--          </el-select>-->
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" @change="changeBusinessArea" :options="businessAreaData" :show-all-levels="false" :props="props"/>
        </el-form-item>
        <el-form-item label="抄表员：">
                   <el-select v-model="tableQuery.meterReadingStaff" placeholder="请选择" size="mini" clearable>
                <el-option-group
                  v-for="group in staffAccounts"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userName">
                  </el-option>
                </el-option-group>
              </el-select>
        </el-form-item>
        <!-- class="longinput" -->
        <el-form-item label="模糊查询：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="册本号" @keydown.enter.native="demand"></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select  v-model="tableQuery.status" size="mini" clearable>
            <!-- <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option> -->
            <el-option v-for="item in statusDict" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
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
      <el-table ref="table" highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list"  class="wuserInfo-table"
          @sort-change="sortChange"    >
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <!-- <el-table-column prop="usn" min-width="120" label="开账状态" show-overflow-tooltip>
        </el-table-column> -->

        <!--el-table-column prop="businessAbodeName" min-width="80" label="营业所">
        </el-table-column-->

        <el-table-column prop="businessAreaName" width="160" label="营业区域" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="bookNo" min-width="100" label="册本号">
        </el-table-column>

        <el-table-column prop="bookName" min-width="100" label="册本名称">
        </el-table-column>

        <!-- <el-table-column prop="areaName" min-width="80" label="用户编号">
        </el-table-column> -->


        <el-table-column prop="meterReadingStaffName" width="130" label="抄表员">
        </el-table-column>

        <el-table-column prop="statusName" width="100" label="状态">
        </el-table-column>
        <el-table-column prop="meterReadingDay" label="抄表日">
        </el-table-column>
        <el-table-column prop="userCount" :sort-orders="['descending','ascending',null]" :sortable="'custom'" width="100" label="总户数" align="right">
        </el-table-column>

        <el-table-column prop="comments" label="备注" show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click.native="showChangeItem(scope.row)">修改记录</el-button>
            <el-button type="text" size="mini" @click.native="showUserEdit(scope.row)">用户管理</el-button>
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
</template>
<script>
import BookInfoUserEdit from "./BookInfoUserEdit";
import BookInfoChangeItem from "./BookInfoChangeItem";
export default {
  name: "MeterReadingCircuit",
  components: {
    BookInfoUserEdit,
    BookInfoChangeItem,
  },
  data() {
    return {
      scrollTop: null,
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      tableData: {},
      bookNo:"",
      bookName: "",
      tableQuery:{
        page:1,
        pageCount:20,
        //businessAbode:"",
        meterReadingStaff:"",
        fuzzyQuery:"",
        status: 1,
      },
      dictionaryData :[],
      type:"",
      crumbsData: {  //面包屑
        titleList: [
          // { title: '抄表中心', path: '/MeterReadingCenter' },
          // { title: '其他配置' },
          { title: '抄表开账' },
          { title: '表册管理' },
          { title: '册本信息' }
        ],

      },
      isActive: false,  //控制高级查询内容的显示
      formData: {

      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      businessAbodeOptions:[],
      staffAccounts:[],
      meterReaderList: [

      ],
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {

      },
      businessAreaData: [], //营业区域下拉框
      waterAddVisible: false,  //综合查询的显示和隐藏
      WaterEditorName: '综合查询',
      ruleFormData: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false,
      options6: [
        {
          value: 12,
          label: '用水报装'
        },
      ],
      editContent: 0,
      dialogForm: {
        status: '1',
        bookNo: '',
        meterReadingStaffAccount:'',
        meterReadingStaffName: '',
        bookName: '',
        // meterReadingCycle: '',
        //businessAbode: '',
        meterReadingDay: '',
        businessArea:'',
      },
      bookInfoChangeItemVisible: false,
      changeItemBookNo: "",
      rules:{
        status:[{ required:true, message:"状态不能为空", trigger: 'change'}],
        bookNo:[{ required:true, message:"测本号不能为空", trigger: 'blur'}],
        meterReadingStaffName:[{ required:true, message:"抄表员不能为空", trigger: 'change'}],
        bookName:[{ required:true, message:"册本名称不能为空", trigger: 'blur'}],
        // meterReadingCycle:[{ required:true, message:"抄表周期不能为空", trigger: 'change'}],
        //businessAbode:[{ required:true, message:"营业所不能为空", trigger: 'change'}],
        meterReadingDay:[{ required:true, message:"抄表日不能为空", trigger: 'blur'}],
        businessArea:[{ required:true, message:"抄表日不能为空", trigger: 'change'}],
      },
      statusDict: [{label: '启用', value: 1}, {label: '停用', value: 2}],
    }
  },
   activated() {
      this.saveScroll()
    },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow4')
    this.init();
    this.selectBAreaOptions();
    this.getDictionary();
    this.getMeterReader();
     this.getReadingStaff();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, '.MeterReadingCircuit',
        ['.MeterReadingCircuit .toolbar',
          '.MeterReadingCircuit .block',
          '.MeterReadingCircuit .bread-contain'])
  },
   beforeDestroy() {
      this.$refs.table.bodyWrapper.removeEventListener('scroll', (res) => {
        let height = res.target
        this.scrollTop = height.scrollTop
      },false)
    },
  methods: {
    init() {
      let _this = this
      let params = {
        "busicode": "BaseBookList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
            // console.log(this.$refs.table);
       this.$refs.table.bodyWrapper.addEventListener('scroll', (res) => {
        let height = res.target
        this.scrollTop = height.scrollTop
      },false)
      })
    },
    sortChange(column){
      console.log(column);
      this.tableQuery.sortField = column.prop
      if(column.order === 'ascending'){
        this.tableQuery.sortOrder = 1
      } else if(column.order === 'descending'){
        this.tableQuery.sortOrder = 2
      }else{
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.init()
    },

        // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = [...res];
        });
    },
    // 这里如果直接赋值给this.$el.querySelector('.el-table__body-wrapper').scrollTop会失效，需要加上setTimeout才行。
      saveScroll() {
        this.$nextTick(()=> {
        setTimeout(() => {
          var scrollTop = this.$el.querySelector('.el-table__body-wrapper')
          scrollTop.scrollTop = this.scrollTop
          }, 13)
        })
      },
    showUserEdit(row){
      this.bookNo=row.bookNo
      this.bookName = row.bookName
      this.editContent=2
    },
    showChangeItem(row){
      this.changeItemBookNo = row.bookNo;
      this.bookInfoChangeItemVisible = true;
    },
    changeItemColse(){
      this.bookInfoChangeItemVisible = false;
      this.$refs.BookInfoChangeItem.tableData = {};
      this.$refs.BookInfoChangeItem.tableQuery.receiptId = "";
    },
    meterReaderChange(val) {
        this.meterReaderList.forEach((item)=>{
            if(item.userName == val)
              this.dialogForm.meterReadingStaffAccount = item.userAccount;
        })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "RTP"
     }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    //营业所
    selectBAbodeOptions() {
      let _this = this
      let params = {
        "busicode": "BusinessAreaSelect",
        "data": {},
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.businessAbodeOptions = res;
      })
    },
    /*
    changeBAbode(id) {
      //营业区域
      this.selectBAreaOptions(id);
    },*/
    //营业区域
    selectBAreaOptions(id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res)
        _this.businessAreaData = data.children;
      })
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
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
       //抄表员下拉框数据
     changeBusinessArea(){
      this.getMeterReader(this.common.handleTreeData(this.tableQuery.businessArea));

    },
        //抄表员下拉框数据
    getMeterReader(businessArea = businessArea || "") {
      let _this = this;
      let params = {
        busicode: "PostUserList",
        data: {
          postNo: "2",
          businessArea:businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.staffAccounts = res;
        });
    },
    hidden() {
      if (this.isActive == true) {
        $('.upchange').addClass('el-icon-arrow-down').removeClass('el-icon-arrow-up')
        this.isActive = false;
        $('.el-table--fit').css('height', '66%');

      } else {
        $('.upchange').addClass('el-icon-arrow-up').removeClass('el-icon-arrow-down')

        this.isActive = true;
        $('.el-table--fit').css('height', '50%');
      }
    },
    demand() {  //查询
      this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      if (this.tableQuery.businessArea){
        this.tableQuery.businessArea = this.common.handleTreeData(this.tableQuery.businessArea);
      }
      this.init()
    },
    //   导出
    exportExcel() {
        let data = JSON.parse(JSON.stringify(this.tableQuery));
        data.pageCount=999999;
        let params = {
          "busicode": "BaseBookExport",
          "data": data,
          // token: 'krrjdev123',
          token: sessionStorage.getItem('token'),
          sysType: '002'
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      //若切换页码则滚动条重新回到顶部
      this.scrollTop = 0
      this.saveScroll()
      this.init()
    },
    indexMethod(index) {//获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;

    },
    closeDialog() { //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.editContent=0
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
      // this.waterAddVisible = false;
    },
    // 添加
    add(val) {
      let _this = this;
      var data = _this.dialogForm;
      var value = _this.dialogForm.meterReadingDay;
      let isEdit = false;
      _this.$refs.ruleForm.validate(valid=>{
        if(!valid){
          isEdit=true
        }
      });
      if(isEdit){
        this.$notify({
          title: '验证失败',
          message: '当前表单必填项未完善',
          type: 'error'
          });
          return
      }
      if(value<0){value=0}else if(value>31){value=31}
      data.meterReadingDay=value;

      data.businessArea=this.common.handleTreeData(data.businessArea)

      if(this.type==='add'){
        let params = {
          "busicode": "BaseBookAdd",
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
      }else{
        let params = {
          "busicode": "BaseBookUpdate",
          "data": data,
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
          });
        this.closeEdit();
        })
      }

    },
    // 编辑
    edit(val) {
      if(val==='add'){
        this.dialogForm={
          status: 1,
          bookNo: '',
          meterReadingStaffAccount: '',
          meterReadingStaffName: '',
          bookName: '',
          // meterReadingCycle: '',
          businessAbode: '',
          meterReadingDay: '',
          businessArea:'',
        };
        this.type="add";
      }else{
        this.dialogForm=val;
        this.type="update";
        //this.changeBAbode(val.businessAbode)
      }
      this.editContent = 1;

    },
    closeEdit() {
      this.editContent = 0;
      this.saveScroll()
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
.MeterReadingCircuit {
  width: 100%;
  height: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .el-form-item__content{
    line-height: 55px!important;
  }
  .el-form-item__label{
    line-height: 55px!important;
  }
  .el-form-item__error{
    line-height: 0px!important;
    padding-top:0px;
  }
}
.formBill-Two {
  margin-top: 10px;
}
.bookInfo-editForm {
  .el-form-item {
    margin-bottom: 30px !important;
  }
}
.el-popper[x-placement^=bottom] {
  margin: 0;
}
</style>
