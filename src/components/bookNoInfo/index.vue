<template>
  <div class="bookNoInfoList">
    <!-- <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <h2 class="tab-title">
        <i></i>
        册本信息</h2>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="edit('add')" icon="el-icon-plus">添加</el-button>
         <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
      </div>
    </div> -->

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150">
        <!-- <el-form-item class="form-left"> -->

        <el-form-item label="营业区域：">
<!--          <el-select v-model="tableQuery.businessArea" clearable size="mini" >-->
<!--            <el-option v-for="item in businessAreaData"  :key="item.value" :label="item.name" :value="item.id"> </el-option>-->
<!--          </el-select>-->
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props"/>
        </el-form-item>
        <el-form-item label="抄表员：">
          <el-select  v-model="tableQuery.meterReadingStaffAccount" size="mini" clearable>
           <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>
        <!-- class="longinput" -->
        <el-form-item label="模糊查询：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="册本号" @keydown.enter.native="demand" @input="e => input = inputMe(e)"></el-input>
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
      <el-table v-if="tableShow" highlight-current-row @selection-change="selectOne" :max-height="maxHeight" stripe border :data="tableData.list"  class="wuserInfo-table"  @row-click="handleTableCellClick" :cell-style="cellStyle" :row-class-name="tableRowClassName">
    <el-table-column label="选择"  width="50"  fixed="left">
	<template slot-scope="scope">
		<el-radio v-model="radio" :label="scope.$index" 
		@change.native="radioChange(scope.row, scope.$index)"
		>&nbsp;
		</el-radio>
	</template>
</el-table-column>

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <!-- <el-table-column prop="usn" min-width="120" label="开账状态" show-overflow-tooltip>
        </el-table-column> -->

        <!--el-table-column prop="businessAbodeName" min-width="80" label="营业所">
        </el-table-column-->

        <el-table-column prop="bookNo" min-width="100" label="册本号">
        </el-table-column>

          <el-table-column prop="businessAreaName" min-width="100" label="营业区域">
        </el-table-column>

        <!-- <el-table-column prop="bookName" min-width="100" label="册本名称">
        </el-table-column> -->

        <!-- <el-table-column prop="areaName" min-width="80" label="用户编号">
        </el-table-column> -->

        <!-- <el-table-column prop="meterReadingCycleName" min-width="60" label="抄表周期">
        </el-table-column>

        <el-table-column prop="meterReadingDay" min-width="60" label="抄表日">
        </el-table-column> -->

        <el-table-column prop="meterReadingStaffName" min-width="80" label="抄表员">
        </el-table-column>
<!-- 
        <el-table-column prop="statusName" min-width="60" label="状态">
        </el-table-column>

        <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip>
        </el-table-column> -->

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
// import BookInfoUserEdit from "./BookInfoUserEdit";
export default {
  name: "bookNoInfoList",
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      radio: '',
      radioSelect: '',//选中的数据赋值给它 
      tableData: {},
      bookNo:"",
      bookName: "",
      tableQuery:{
        page:1,
        pageCount:20,
        //businessAbode:"",
        meterReadingStaff:"",
        fuzzyQuery:"",
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
        meterReadingCycle: '',
        //businessAbode: '',
        meterReadingDay: '',
        businessArea:'',
      },
      rules:{
        status:[{ required:true, message:"状态不能为空", trigger: 'change'}],
        bookNo:[{ required:true, message:"册本号不能为空", trigger: 'blur'}],
        meterReadingStaffName:[{ required:true, message:"抄表员不能为空", trigger: 'change'}],
        bookName:[{ required:true, message:"册本名称不能为空", trigger: 'blur'}],
        meterReadingCycle:[{ required:true, message:"抄表周期不能为空", trigger: 'change'}],
        //businessAbode:[{ required:true, message:"营业所不能为空", trigger: 'change'}],
        meterReadingDay:[{ required:true, message:"抄表日不能为空", trigger: 'blur'}],
        businessArea:[{ required:true, message:"抄表日不能为空", trigger: 'change'}],
      },
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow4')
    this.init();
    this.selectBAreaOptions();
    this.getDictionary();
    this.getReadingStaff();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, '.bookNoInfoList',
        ['.bookNoInfoList .toolbar',
          '.bookNoInfoList .block',
          '.bookNoInfoList .bread-contain'])
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
        "busicode": "BaseBookList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
  radioChange(row, index) {
		this.radioSelect = row;
    //  this.selectData = currentData;
     var addType = Object.keys(this.radioSelect).length == 0
     var addClass = true
      if(addType == true){
        addClass = true
      } else {
         addClass = false
      }
      this.$emit('addBookNoChange',addClass)
	},
   handleTableCellClick(row,cell,event){
     this.$nextTick(()=>{
      this.radio = row.index
      this.radioChange(row)
     })
   },
   cellStyle(data){
      return "cursor:pointer;"
    },
    tableRowClassName({row, rowIndex}){
      row.index = rowIndex;
      return 'rows'
    },
    selectOne(currentData) {
      this.selectData = currentData;
     var addType = Object.keys(this.selectData).length == 0
     var addClass = true
      if(addType == true){
        addClass = true
      } else {
         addClass = false
      }
      this.$emit('addBookNoChange',addClass)
    },
    showUserEdit(row){
      this.bookNo=row.bookNo
      this.bookName = row.bookName
      this.editContent=2
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
        _this.meterReaderList = [...[{ userName: "全部" }], ...res];
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
    //   if (this.tableQuery.businessArea){
    //     this.tableQuery.businessArea = this.tableQuery.businessArea[this.tableQuery.businessArea.length-1];
    //   }
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
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
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
          status: '1',
          bookNo: '',
          meterReadingStaffAccount: '',
          meterReadingStaffName: '',
          bookName: '',
          meterReadingCycle: '',
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
.bookNoInfoList {
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
