<template>

  <div class="MeterReadingCircuit" v-if="editContent">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="add('add')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeEdit">返回</el-button>
      </div>
    </div>
    <div class="indexContent">
    <el-form :model="dialogForm" ref="ruleForm" :rules="rules" size="mini" :inline="true" label-width="130px" class="formBill-One">
      
        <el-form-item label="垃圾费类型名称：" prop="garbageTypeName" label-width="130px">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="dialogForm.garbageTypeName" size="mini" clearable></el-input>
        </el-form-item>
         <el-form-item label="备注：" prop="comments">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="dialogForm.comments" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="dialogForm.status" clearable size="mini">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
          </el-select>
        </el-form-item>
    </el-form>
    </div>
  </div>
  <div class="MeterReadingCircuit" v-else>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- <h2 class="tab-title">
        <i></i>
        册本信息</h2> -->
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="edit('add')" icon="el-icon-plus">添加</el-button>
        <!--el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button-->
      </div>
    </div>

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150" @submit.native.prevent>
        <!-- <el-form-item class="form-left"> -->
        <!-- class="longinput" -->
        <el-form-item label="垃圾费类型名称：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.garbageTypeName" placeholder="类型名称" @keydown.enter.native="demand"></el-input>
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
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list"  class="wuserInfo-table">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <!-- <el-table-column prop="usn" min-width="120" label="开账状态" show-overflow-tooltip>
        </el-table-column> -->

        <el-table-column prop="garbageTypeName" min-width="80" label="类型名称">
        </el-table-column>

        <el-table-column prop="statusName" min-width="80" label="状态">
        </el-table-column>

        <el-table-column prop="comments" min-width="80" label="备注">
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="85">
          <template slot-scope="scope">
            <el-button type="text" @click.native="edit(scope.row)">编辑</el-button>
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
export default {
  name: "MeterReadingCircuit",
  components: {

  },
  data() {
    return {
      tableData: {},
      tableQuery:{
        page:1,
        pageCount:20,
        garbageTypeName:"",
        status:"",
        fuzzyQuery:"",
      },
      dictionaryData :[],
      type:"",
      crumbsData: {  //面包屑
        titleList: [
          // { title: '抄表中心', path: '/MeterReadingCenter' },
          { title: '其他配置' },
          { title: '垃圾费类型' }
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
      tableShow: false,
      maxHeight: 0,
      waterAddVisible: false,  //综合查询的显示和隐藏

      ruleFormData: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false,
      editContent: false,
      dialogForm: {
        status: '1',
        garbageTypeName: '',
      },
      rules:{
        status:[{ required:true, message:"状态不能为空", trigger: 'change'}],
        garbageTypeName:[{ required:true, message:"垃圾费类型名称不能为空", trigger: 'blur'}],
      },
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow4')
    this.init();
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, '.MeterReadingCircuit', 
        ['.MeterReadingCircuit .toolbar', 
          '.MeterReadingCircuit .block', 
          '.MeterReadingCircuit .bread-contain'])
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
        "busicode": "GarbageTypeList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "RTP"
     }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
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
      this.tableQuery.pageCount = 20
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

      if(this.type==='add'){
        let params = {
          "busicode": "GarbageTypeAdd",
          "data": data,
        }
        this.$api.fetch({
          params: params,//参数
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
          "busicode": "GarbageTypeUpdate",
          "data": data,
        }
        this.$api.fetch({
          params: params,//参数
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
          garbageTypeName: '',
        };
        this.type="add";
      }else{
        this.dialogForm=val;
        this.type="update";
      }
      this.editContent = true;
      
    },
    del(val){
      let _this = this;
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            "busicode": "NoticeDelete",
            "data": {
              id: row.id
            },
          }
          _this.$api.fetch({
            params,
          }).then(res => {
            _this.$message({
              type: "success",
              message: "删除成功！"
            });
            _this.init()
          })
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
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
<style lang="scss">
.MeterReadingCircuit {
  width: 100%;
  height: 100%;
  .indexContent{    
    height: calc(100% - 41px);
    width: 60%;
    margin: 0 auto;
    overflow-y:hidden;
    overflow-x:hidden;
    .formBill-One .el-form-item .el-form-item__content{
      width:calc(95% - 100px); 
    }
  }
}
</style>
