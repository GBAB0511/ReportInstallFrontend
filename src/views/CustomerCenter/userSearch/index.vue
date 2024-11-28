<template>
  <div class="userSearch">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="客户类型：">
            <el-select clearable v-model="tableQuery.ctmType" placeholder="请选择">
              <el-option
                v-for="(item,index) in dictionaryData.CTT"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件类型：">
            <el-select clearable v-model="tableQuery.certType" placeholder="请选择">
              <el-option
                v-for="(item,index) in dictionaryData.IDT"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="客户状态：">
            <el-select v-model="tableQuery.status" placeholder="请选择" clearable  >
              <el-option v-for="item in dictionaryData.CCS" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模糊查询：" class="width-200" >
            <el-tooltip class="item" effect="dark" content="客户编号、客户名称、客户地址、客户证件号、手机号" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table"
        :style="{height: maxHeight + 'px'}"
        >
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          highlight-current-row
          center
          stripe
          border
          :data="tableData.list"
          class="wuserInfo-table"
        >
          <el-table-column align="center" type="index" label="NO." width="80" :index="indexMethod"></el-table-column>

          <el-table-column prop="ctmNo" min-width="150" label="客户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="230" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column align="left" prop="ctmAddr" min-width="360" label="客户地址" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmTypeName" min-width="80" label="客户类型" show-overflow-tooltip></el-table-column>

          <el-table-column prop="certTypeName" min-width="110" label="证件类型" show-overflow-tooltip></el-table-column>

          <el-table-column prop="certNo" min-width="210" label="客户证件号码" show-overflow-tooltip></el-table-column>

          <el-table-column prop="mobile" min-width="110" label="手机号码" show-overflow-tooltip></el-table-column>

          <el-table-column prop="creditLevelName" min-width="150" label="信用等级" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="60">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click.native="details(scope.$index, scope.row)">详情</el-button>
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

      <!-- 弹出表单客户资料 -->
      <el-dialog
        v-if="countManagementVisible"
        :title="countManagementName"
        :close-on-click-modal="false"
        :visible.sync="countManagementVisible"
        class="common-dialog"
        @close="closeDialog"
        :append-to-body="true"
      >
        <countManagementEdit :formDataUserNo="formDataUserNo" :fromPage="fromPage" ref="childcountManagement" ></countManagementEdit>
      </el-dialog>
  </div>
</template>
<script>

import countManagementEdit from "@/components/IntegratedBusiness/UserInformation/ctmInfo"; //客户资料

export default {
  name: "userInfo",
  components: {
    countManagementEdit,
  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      fromPage:'userSearch',
      businessAreaData: [], //营业区域下拉框
      //查看附件传参
      receiptAccessory:{userNo:""},
      //变更传参
      idCuster: { id: "", userNo: "" },
      status: "ChangeUserAdd", //add 新增 updata 修改
      OfferWaterContractParams:{
        userNo:'',
        dictionaryData:[]
      },
      lockFlagStr: "锁定",
      DataChangeVisibleName: "资料变更",
      DataChangeVisible: false,
      countManagementName: "查看客户资料",
      countManagementVisible: false,
      ContractTemplateVisible: false,
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户管理" }, { title: "查询" }]
      },
      isActive: false, //控制高级查询内容的显示
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea: "",
        queryType: '0',
        fuzzyQuery: "",
        list: [],
        status:'1'
      },
      dictionaryData: {},
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableData: {
        list: []
      },
      formData: {
        //编辑页面的id
        userNo: ""
      },
      useWaterTypeOptions:[],//用水类型下拉框
      ruleFormData: {},
      attachmentData: [],
      attachmentQty:0,
      businessAbodeOptions: [], //营业所下拉框
      formDataUserNo: "", //用户编号存值
      templateList: [],
      fjName:'',
      loadingShow: false,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow2");
    // this.getDictionary()
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".userSearch", [
        ".userSearch .toolbar",
        ".userSearch .block",
        ".userSearch .bread-contain"
      ]);
    });

      this.getDictionarySelect()
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //树结构数据处理
    getArr1(data) {
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
          // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CTT,IDT,CDL,USER_QUERY_TYPE,CCS"//客户类型、证件类型、信用级别、用户-查询类型
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
        this.OfferWaterContractParams.dictionaryData =  res;
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    init() {
      this.loadingShow = true
      let _this = this;
      let params = {
        busicode: "CmtInfoList",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res;
          this.loadingShow = false
        }).catch(() => {
          this.loadingShow = false
        })
    },

    //树结构数据处理
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    initAccessory() { //初始化附件
        let _this = this;
          let params = {
            busicode: "AccessoryAboutUserList",
            data:_this.receiptAccessory
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res !=null && res.length > 0) {
            _this.attachmentData = res;
            _this.attachmentQty =res.length
          }
        });
    },
    // 营业所下拉框的初始化
    businessInit() {
      let _this = this;
      let params = {
        busicode: "BusinessAbodeSelect",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.businessAbodeOptions = res;
        });
    },
    // 数据字典数据获取
    getDictionary(){
      let _this = this
      let params = {
        "busicode": "DictionarySelect",
        "data": "USER_QUERY_TYPE" //查询项
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    initContractTemplate() {
      let _this = this;
      let params = {
        busicode: "ContractTemplateList",
        data: {page:1,pageCount:8888,type:2}
      };

      this.$api.fetch({
        params: params,
      }).then(res => {
          _this.templateList = res.list
      })
      this.ContractTemplateVisible = true;

    },
    doPrint(type) {
      let _this = this;
      let params = {
        busicode: "XkPrint",
        data: {userNo:_this.$refs.userInfoEdit.formDataUserNo}
      };

      this.$api.fetch({
        params: params,
      }).then(res => {

        if (type == 'xk') {// 打印
          // _this.printTable('print', res)
          _this.common.print('view', 'XkPrint', '', res, _this);
        }
      })
    },

    lockFlag() {
      //锁定
      this.$confirm("此操作将"+this.lockFlagStr+"该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.lockFlagStute();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    lockFlagStute(){
      let _this = this;
      let data = this.$refs.userInfoEdit.toParentData();
      let params = {
        busicode: "UserLockFlagUpdate",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.$message({
            type: "success",
            message: this.lockFlagStr+"成功"
          });
          if (_this.lockFlagStr == "锁定") {
            _this.lockFlagStr = "解锁";
            this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData.lockFlag = 1;
            // console.log(this.$refs.userInfoEdit.$refs.userInfo.formData.lockFlag)
            this.$refs.userInfoEdit.$refs.userInfo.init(this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData)
          } else if (_this.lockFlagStr == "解锁") {
            _this.lockFlagStr = "锁定";
           this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData.lockFlag = 0;
          //  console.log(this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData)
           this.$refs.userInfoEdit.$refs.userInfo.init(this.$refs.userInfoEdit.$refs.userInfo.$refs.dynamicForm.editFormData)
          }
        })
    },

    search() {
      //查询
      this.tableQuery.page=1;
      this.tableQuery.pageCount=20;
      this.tableQuery.businessArea=this.common.handleTreeData(this.tableQuery.businessArea)
      this.init();
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
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    closeDialog() {
      //客户资料查看
      this.formDataUserNo = "";
      this.countManagementVisible = false;
    },

    // 详情
    details(i, row) {
      this.countManagementVisible = true;
      this.formDataUserNo = row.ctmNo;
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
<style lang="scss" scoped>
.userInfo {
  height: 100%;
  width: 100%;
       .formBill {
    .el-form-item__label {
      width: 130px;
    }

  }
  .userInfoIndex {
    height: calc(100% - 41px);
    .fuzzy-query-input {
      width: 180px !important;
      /deep/ {
        .el-input__inner {
        width: 100%;
      }
      }
    }
  }
  .bread-contain #crumbs {
    width: 20% !important;
  }
  .bread-contain .bread-contain-right {
    width: 78% !important;
  }
  .wuserInfo-table {
    .el-table__body {
      tr {
        td:nth-child(2) {
          div {
            color: #3195f4;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
