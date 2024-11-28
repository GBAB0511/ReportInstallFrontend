<template>
  <div class="insideEnging">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <!-- index -->
        <div class="waterQuery" v-if="IndexShow">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="margin-right: 1.5%"
            @click="add"
          >添加</el-button>
        </div>
        <!-- 添加页面 -->
        <div class="waterQuery" v-if="EditShow">
          <el-button
            size="mini"
            type="primary"
            @click="submitForm()"
            v-if="keySon.formData.processState!='CANCEL'&&keySon.formData.processState!='END'"
          >暂存</el-button>
          <el-button size="mini" icon="el-icon-caret-left" @click="closeDialog()">返回</el-button>
        </div>
        <!-- 编辑/详情页面 -->
        <div class="waterQuery" v-if="handleShow">
          <font v-if="HandleVal=='register' || HandleVal=='Process-task11'">
            <el-upload
                class="upload-file"
                multiple action="/" 
                :http-request="uploadAttachment"
                style="display:inline-block;margin-right:10px;"
                :show-file-list="false"
              >
                <el-button size="mini" type="primary">上传附件</el-button>
              </el-upload>
              <el-button type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="submitForm()"
              v-if="keySon.formData.processState=='register'"
            >暂存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
          </font>

          <font v-else-if="HandleVal =='surveyDesign' || HandleVal=='Process-task9'">
            <el-button size="mini" icon="el-icon-caret-left" @click="closeDialog">返回</el-button>
          </font>
          <font v-else-if="HandleVal =='budget' || HandleVal=='Process-task7'">
            <el-button size="mini" icon="el-icon-caret-left" @click="closeDialog">返回</el-button>
          </font>
          <font v-else-if="HandleVal =='install' || HandleVal=='Process-task3'">
            <el-button size="mini" icon="el-icon-caret-left" @click="closeDialog">返回</el-button>
          </font>
          <font v-else-if="HandleVal =='check' || HandleVal=='Process-task5'">
            <el-button size="mini" icon="el-icon-caret-left" @click="closeDialog">返回</el-button>
          </font>
          <font v-else-if="HandleVal =='setmt' || HandleVal=='Process-task1'">
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
          </font>
        </div>
      </div>
    </div>

    <insideEngingEdit
      ref="insideEngingEdit"
      style="height:calc(100% - 41px)"
      @fromChild="getChild"
      :keySon="keySon"
      :editNeedData="editNeedData"
      v-if="EditShow"
    ></insideEngingEdit>
    <insideHandleInfo
      :keySon="keySon"
      ref="insideHandleInfo"
      style="height:calc(100% - 41px)"
      @fromHandleChild="getChildHandle"
      :editNeedData="editNeedData"
      @detail="handleDetail"
      @closeAttachment="initAccessory"
      v-if="handleShow"
    ></insideHandleInfo>
    <div v-if="IndexShow" class="insideEngingIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="单据日期：">
            <el-date-picker
              :editable="false"
              size="mini"
              v-model="dataList"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select  ref="select1" v-model="tableQuery.processState" size="mini" clearable>
              <el-option
                v-for="item in dictionaryData.PCS"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="紧急程度：">
            <el-select  ref="select2" v-model="tableQuery.urgentFlag" size="mini" clearable>
              <el-option
                v-for="item in dictionaryData.EGD"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="width-200" label="模糊查询：">
            <el-tooltip class="item" effect="dark" content="工程编号、工程名称、申请人、联系人、联系电话" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" @click="init" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table stripe border v-if="tableShow" :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed="left"></el-table-column>

          <el-table-column prop="theme" min-width="180" label="主题" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processState" min-width="60" label="状态"  :formatter="getProcessState" show-overflow-tooltip></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度" show-overflow-tooltip></el-table-column>

          <el-table-column
            prop="processHandleMan"
            min-width="100"
            label="当前处理人"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column prop="urgentFlagName" min-width="80" label="紧急程度" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="80" label="单据编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期"></el-table-column>

          <el-table-column prop="linkMan" min-width="80" label="联系人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="linkTel" min-width="120" label="联系电话" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click.native="details(scope.row) " style="font-size:12px;">详情</el-button>
              <el-button type="text" v-if="scope.row.processState==='草稿'" @click.native="deleteRow(scope.$index, scope.row)" style="font-size:12px;">删除</el-button>
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
          ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import insideHandleInfo from "./insideHandleInfo";
import insideEngingEdit from "./insideEngingEdit";
export default {
  name: "insideEnging",
  components: {
    insideHandleInfo,
    insideEngingEdit
  },

  data() {
    return {
      //表格是否显示
      tableShow: false,
      //表格高度控制
      maxHeight: 0,
      keySon: { id: "", type: "", formData: {} },
      editNeedData: null,
      HandleVal: 2,
      EditShow: false,
      IndexShow: true,
      tableData: [],
      // 流程下拉框
      processNodeList: [],
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程管理" }, { title: "内部工程" }]
      },
      //数据字典存值
      dictionaryData: [],
      //咨询日期段
      dataList: [
        this.common.date(-60 * 24 * 60 * 60 * 1000),
        this.common.date()
      ],
      tableQuery: {
        page: 1, //当前页码
        pageCount: 20, //当前页展示多少条数据
        beginDate: "", //咨询日期开始日期
        endDate: "", //咨询日期结束日期
        processState: "", //状态
        urgentFlag: "", //紧急程度
        fuzzyQuery: "" //模糊查询
      },
      histroyData: {},
      handleShow: false,
      AttachmentQty:0,//附件个数
    };
  },
  mounted() {
    this.init();
    this.getDictionary();
    // 接收insideHandleinfo的返回
    eventBus.$on("insideOperationReturn", bool => {
      this.handleShow = bool;
      this.IndexShow = true;
    });
    eventBus.$on("insideRegistrationReturn", item => {
      this.EditShow = item;
      this.IndexShow = true;
    });
    this.common.changeTable(this, ".insideEngingIndex", [
      ".insideEngingIndex .toolbar",
      ".insideEngingIndex .block"
    ]);
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
      enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "PCS,EGD" //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    getProcessState(row,column){
      var status = row.processState
      var str = null;
      if(status===''){
        str="草稿"
      }else if(status==='END'){
        str="已办结"
      }else if(status==='CANCEL'){
        str="已废弃"
      }else{
        str="进行中"
      }
      return str
    },
    closeDialog() {
      this.HandleVal = 2;
      this.EditShow = false;
      this.handleShow = false;
      this.IndexShow = true;
      (this.keySon = { id: "", type: "", formData: {} }), this.init();
    },
    getChild() {},
    getChildHandle(v) {
      this.HandleVal = v;
    },
    init() {
      let _this = this;
      this.tableQuery.beginDate = this.dataList[0];
      this.tableQuery.endDate = this.dataList[1];
      let params = {
        busicode: "PjInternalList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        })
        .catch((this.tableData = {}));
      
    },

    // 详情按钮事件
    // 根据单据状态判断进入的界面
    // 单据状态 processState ：
    details(row) {

      this.editNeedData = row
      this.keySon.id=row.id
      this.keySon.type=row.processState
      this.keySon.formData=row
      if(row.processState ===''){
        this.EditShow = true;
      }else{
        this.handleShow = true;
      }
      
      
      this.IndexShow = false;
      this.initAccessory();
    },
    handleDetail(res) {
      this.keySon.formData = res
      
      
      if (res.processState === "") {
        //草稿
        this.keySon.type = "DRAFT";
      } else if (res.processState === "END") {
        //已完成
        this.getChildHandle("register");
      } else if (res.processState === "CANCEL") {
        //已废弃
        this.getChildHandle("register");
      } else {
        //进行中
        //对按钮进行重置
        this.getChildHandle(res.processState);
        //给子页面赋值
      }
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "PjInternalDelete",
            data: {id:row.id}
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.init();
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
    add() {
      this.keySon.type = "add";
      this.keySon.id = "";
      this.EditShow = true;
      this.IndexShow = false;
    },
    //弹出框
    submitForm() {
      //提交
      console.log(this.keySon.type);
      
      if (this.keySon.type == "add" || this.keySon.type == "") {
        this.$refs.insideEngingEdit.submit(true);
      } else {
        this.$refs.insideHandleInfo.submit();
      }
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    uploadAttachment(file,fileList) {
        this.$refs.insideHandleInfo.uploadAttachment(file,fileList);
    },
    viewAttachment() {
        this.$refs.insideHandleInfo.viewAttachment('show');
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    initAccessory(){    //初始化附件个数
        let _this = this;
          let params = {
            busicode: "ReceiptAccessoryList",
             data: {
              receiptType: "PJ_INTERNAL",
              receiptId: this.editNeedData.id
            }
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res != null && res.length > 0) {
              _this.AttachmentQty = res.length
          }
          
        });
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
.insideEnging {
  width: 100%;
  height: 100%;
  .el-upload-list {
    display: none;
  }
  .insideEngingIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
  .el-range-separator{
    padding:0px 0px!important;
  }
}
</style>
