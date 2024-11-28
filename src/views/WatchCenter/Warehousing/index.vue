<template>
  <div class="Warehousing">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 添加 -->
      <div class="bread-contain-right" v-if="WarehousingVisible">
         
        <el-button icon="el-icon-bottom" @click="exportExcel" size="mini" type="primary" v-if="editNeedData.processState==''">下载模板</el-button>
        <el-upload v-if="editNeedData.processState==''" class="upload-demo" multiple   :http-request="importExcel">
          <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
        </el-upload>
        <el-button @click="save" size="mini" type="primary" v-if="editNeedData.processState==''">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="WarehousingCon">
        <el-button icon="el-icon-plus" @click="add" size="mini" type="primary">添加</el-button>
      </div>
      <!-- 校验按钮 -->
      <div class="bread-contain-right" v-if="WarehousingValidatorVisible">
        <el-button size="mini" @click="toCheck" type="primary">提交</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <!-- 添加修改 -->
    <div  class="WarehousingCon" v-if="WarehousingVisible">
      <WarehousingEditNotStruct v-if="structural==='0'" ref="WarehousingEdit" :editNeedData="editNeedData"></WarehousingEditNotStruct>
      <WarehousingEdit v-else ref="WarehousingEdit" :editNeedData="editNeedData"></WarehousingEdit>
    </div>
    <!-- 校验 -->
    <div  class="WarehousingCon" v-if="WarehousingValidatorVisible">
      <WarehousingValidator ref="WarehousingValidator" :WarehousingValidatorNeedData='WarehousingValidatorNeedData'></WarehousingValidator>
    </div>

    <div v-if="WarehousingCon" class="WarehousingCon">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='单据日期：'>
            <el-date-picker v-model="tableTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="状态">
              <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item  label="单据编号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="tableQuery.billNo" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' icon="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list"  class="Warehousing-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态">
          </el-table-column>

          <el-table-column prop="nodeName" min-width="100" label="进度">
          </el-table-column>

          <el-table-column prop="operator" min-width="100" label="当前处理人"  show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="80" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期">
          </el-table-column>

          <el-table-column prop="stroageCount" min-width="80" label="注册数量" align="right">
          </el-table-column>

          <el-table-column prop="meterFactoryName" min-width="80" label="水表厂家">
          </el-table-column>

          <el-table-column prop="createName" min-width="80" label="创建人">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)">详情</el-button>
              <!-- <span>|</span> -->
              <!-- <el-button type="text" class="noclick" @click="check(scope.row)">校验</el-button> -->
              <span v-if="scope.row.processState == '' || scope.row.processState == 'register'">|</span>
              <el-button type="text" class="noclick" v-if="scope.row.processState == '' || scope.row.processState == 'register'" @click="remove(scope.row)">删除</el-button>
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
            :total="tableData.total"
          >
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import WarehousingEdit from "./WarehousingEdit";
import WarehousingEditNotStruct from "./WarehousingEditNotStruct";
import WarehousingValidator from "./WarehousingValidator";
export default {
  name: "Warehousing",
  components: {
    WarehousingEdit,
    WarehousingEditNotStruct,
    WarehousingValidator
  },
  data() {
    return {
      // 表格数据
      tableData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        processState: ''
      },
      tableTime: [],
      // 添加/详情页面需要数据
      editNeedData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 校验页面所需数据
      WarehousingValidatorNeedData: {},
      crumbsData: {titleList: [{ title: "表计管理" }, { title: "注册" }]},
      tableShow: false,
      maxHeight: 0,
      WarehousingVisible: false, //添加弹窗的显示和隐藏、
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //审批状态下拉框
      approvalStatusOptions: [
        { value: "1", name: "全部" },
        { value: "2", name: "草稿" },
        { value: "3", name: "进行中" },
        { value: "4", name: "已办结" },
        { value: "5", name: "已废弃" }
      ],
      WarehousingValidatorVisible: false,
      WarehousingCon: true,
      structural:'0',//默认水表型号不结构化  0 否 1 是
    };
  },
  mounted() {
    this.init()
    this.getStruct()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".Warehousing", [
      ".Warehousing .toolbar",
      ".Warehousing .block",
      ".Warehousing .bread-contain"
    ]);
  },
  methods: {
   enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 初始化
    init() {
      let _this = this;
      this.getDatePicker(this.tableTime)
      let params = {
        busicode: "MsStorageList",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    getStruct(){  //判断当前水司水表型号是否结构化
      let _this = this
      var params = {
        busicode: "ConfigList",
        data:{searchContent:'MR_WATER_MODEL_STRUCT'}
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = res.list
          if(data!=null && data.length > 0) {
            _this.structural = data[0].configValue
          }else
            _this.structural = '0'
        })
        .catch(res => {

        });
    },

    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginTime = date[0]
        this.tableQuery.endTime = date[1]
      } else {
        this.tableQuery.beginTime = ''
        this.tableQuery.endTime = ''
      }
    },
    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 校验按钮
    check(row) {
      this.WarehousingValidatorNeedData = row
      this.WarehousingValidatorVisible = true
      this.WarehousingCon = false
    },
    // 主页面列表删除按钮
    remove(row) {
      var _this = this
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = {
            "busicode": "MsStorageDelete",
            "data": row.id
          }
          _this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$message({
              type: "success",
              message: "删除成功!"
            })
            _this.init()
          })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加按钮
    add() {
      this.WarehousingVisible = true
      this.WarehousingCon = false
      this.editNeedData.processState  = ''
      this.editNeedData.id  = ''
      this.editNeedData.busicode  = 'MsStorageAdd'
      this.editNeedData.saveType  = 'add'
    },
    // 详情按钮
    details(row) {
      this.WarehousingVisible = true;
      this.WarehousingCon = false;
      this.editNeedData  = row
      this.editNeedData.busicode  = 'MsStorageUpdate'
      this.editNeedData.saveType  = 'edit'
    },
    // 暂存（调子页面保存方法）
    save() {
      this.$refs.WarehousingEdit.save()
    },
    toCheck(){
      this.$refs.WarehousingValidator.toCheck()
    },
    // 下载模板（调子页面下载模板方法）
    exportExcel() {
      this.$refs.WarehousingEdit.exportExcel()
    },
    // 导入按钮
    importExcel(file) {
      let _this = this;
      let busicode = '';
      if(this.structural==='0')
        busicode = 'MsStorageNotStructImport'
      else
        busicode = 'MsStorageImport'
      let params = {
        busicode: busicode,
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$refs.WarehousingEdit.storageQueryData = res
        if(res != null && res.list != null)
          this.$refs.WarehousingEdit.tableQuery.pageCount = res.list.length
        this.$message({
            type: "success",
            message: "导入成功"
          });
      })
    },


    downFile() {
      // var elemIF = document.createElement("iframe")
      // elemIF.src =  `${this.url}/fileDown.htm?importType=1`
      // elemIF.style.display = "none"
      // document.body.appendChild(elemIF)
    },
    // 上传模板
    uploading() {
      // this.uploadingVisible = true
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog() {
      //关闭会话
      this.WarehousingVisible = false;
      this.WarehousingValidatorVisible = false;
      this.WarehousingCon = true;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.WarehousingEdit.submit();
    },
    
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.Warehousing {
  width: 100%;
  height: 100%;
  .WarehousingCon {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>
