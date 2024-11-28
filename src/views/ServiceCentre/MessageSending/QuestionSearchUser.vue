
<template>
  <div class="QuestionSearchUser">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>

        <el-form-item label="模糊查询：">
          <el-tooltip class="item" effect="dark" content="用户编号、客户名称、手机号码" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="demand"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border v-if="tableShow" :max-height="maxHeight" :data="tableData.list" class="wuserInfo-table" @current-change="selectOne">

        <el-table-column type="index" fixed="left" label="NO." width="70" :index="indexMethod"></el-table-column>

        <el-table-column prop="userNo" min-width="80" label="用户编号"></el-table-column>

        <el-table-column prop="ctmName" min-width="80" label="客户名称"></el-table-column>

        <el-table-column prop="linkTel" min-width="80" label="手机号码"></el-table-column>

        <el-table-column prop="ctmAddr" min-width="80" label="用户地址"></el-table-column>

      </el-table>

    </div>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //流程审核
export default {
  name: "QuestionSearchUser",
  components: {
    commonPart,
    uploadFile,
    procedure
  },
  data () {
    return {
      tableData: [],
      tableList: [
        {
          userNo: "0001",
          userName: "颤三",
          userAddress: "副楼401",
          userDepart: "研发部",
          userPhone: "123"
        },
        {
          userNo: "0002",
          userName: "张三",
          userAddress: "副楼402",
          userDepart: "研发部",
          userPhone: "1234"
        },
        {
          userNo: "0003",
          userName: "李三",
          userAddress: "副楼403",
          userDepart: "研发部",
          userPhone: "12345"
        }
      ],

      form: {
        ladderType: "month",
        waterSelect: "",
        priceModel: "",
        mixtrueSelect: "",
        waterLevel: "",
        waterValue: false,
        startTime: "",
        endTime: "",
        bulidReson: "",
        priceDetail: "04",
        state: "1",
        bulidTime: "",
        updateReson: "",
        updataTime: "",
        remark: ""
      },
      dialogVisible: false,
      multipleSelection: [],
      tableQuery: {
        page: 1,
        pageCount: 20,
        fuzzyQuery: "",
      },
      selectData: {},
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted () {
    this.init();
    eventBus.$on("ccccc", params => {
      this.dialogVisible = true;
    });
    this.common.changeTable(this, ".QuestionSearchUser", [
      ".QuestionSearchUser .toolbar",
      ".QuestionSearchUser .block"
    ]);
  },
  methods: {
    init () {
      let params = {
        busicode: "UserPhoneList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
          this.$nextTick(() => {

          })
        });
    },
    demand () {
      this.init();
    },
    selectOne (currentRow, oldCurrentRow) {
      this.selectData = currentRow;
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
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.QuestionSearchUser {
  height: calc(100% - 60px);
  // overflow-y: auto;
  .backfillSubmitForm {
    // margin-top: 15px;
    // padding: 10px 20px;
    // // width: 93%
    .el-input--mini /deep/ .el-input__inner {
      width: 100%;
    }
    .toolbar-line {
      width: 4px;
      background: #c4d600;
      border-radius: 4px;
      height: 1.5rem;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    .info {
      margin: 10px 0px;
      // background: #f5f5f5;
      font-weight: 700;
      color: #000;
      height: 1.5rem;
      line-height: 1.5rem;
      padding: 0 1rem;
      font-size: 14px;
    }
    .el-form-item {
      width: 33%;
      margin-right: 0px;
      .el-form-item__content {
        width: calc(100% - 130px) !important;
        .el-input__inner,
        .el-select {
          width: 100% !important;
        }
      }
    }
  }
}
</style>
