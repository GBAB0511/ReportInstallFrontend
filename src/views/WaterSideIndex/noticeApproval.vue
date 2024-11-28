<template>
  <div class="noticeApproval">
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline">

        <el-form-item label="提醒类别：" class="searchInput">
          <el-select clearable v-model="formInline.noticeType" placeholder="提醒类别">
            <el-option v-for="(item,index) in dictionaryData.NTT" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
       <!-- <el-form-item label="关键字：" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formInline.fuzzyQuery" placeholder="通知内容"></el-input>
        </el-form-item>
        <el-form-item label="状态：" class="searchInput">
          <el-select clearable v-model="formInline.status" placeholder="状态">
            <el-option key="" label="全部" value=""></el-option>
            <el-option key="0" label="待处理" :value="0"></el-option>
            <el-option key="1" label="已处理" :value="1"></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item>
          <el-button class="searchBtn" icon="el-icon-search" @click="search()"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table class="listTable dataTable" border stripe :data="listTable.list" v-if="tableShow" :max-height="maxHeight">
        <el-table-column min-width="45" type="index" fixed="left" label="No."></el-table-column>
        <el-table-column prop="noticeTypeName" min-width="100" label="提醒类别"></el-table-column>
        <el-table-column prop="noticeContent" min-width="150" label="通知内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="noticeObject" min-width="120" label="通知对象"></el-table-column>
        <!--<el-table-column prop="noticeTime" min-width="120" label="通知时间"></el-table-column>-->
        <el-table-column prop="statusName" min-width="120" label="状态"></el-table-column>
        <el-table-column min-width="110" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              plain
              size="mini"
              @click.native="details(scope.$index, scope.row.noticeType)"
            >详情</el-button>
            <!--<el-button
              type="text"
               plain
               size="mini"
              @click="noNotice(scope.row)"
               >不再提醒</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listTable.page"
          :page-sizes="[20, 100, 500, 1000]"
          :page-size="listTable.pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listTable.total"
        ></el-pagination>
      </div>

    <!-- 弹出审批界面 -->
    <!-- <el-dialog append-to-body class="TwoModel" :title="approvalPageName" :close-on-click-modal="false" :visible.sync="approvalPageVisible" @close="closeDialog">
            <approvalPage :approvalPageType="approvalPageType" ref="approvalPage"></approvalPage>
    </el-dialog>-->
  </div>
</template>
<script>
// import approvalPage from "@/views/ProcessApproval/approvalPage"
export default {
  name: "noticeApproval",
  // components: {
  //     approvalPage
  // },
  // props:["noticeApprovalType"],
  data() {
    return {
      showType: "",

      approvalPageType: "",
      //   查询表单
      formInline: {
        page:1,
        pageCount:20,
        status:0,
      },
      listTable: {},
      dictionaryData:{},
      tableShow:false,
      maxHeight:0,
      //   申请日期
      applicationDate: ["全部", "今天", "3天内", "7天内", "30天内", "指定时间"],
      //   单据状态
      approvalDate: ["全部", "待处理", "已处理"],
      total: 2,
      rightShow: "1-1",
      isActive: false, //控制高级查询内容的显示
      documentoOptions: [],
      
      documentoOptions1: [
        { label: "全部", value: "5" },
        { label: "水表到期提醒", value: "121" },
        { label: "微信对账异常提醒", value: "122" }
      ],
      approvalPageName: "办理",
      approvalPageVisible: false
    };
  },
  mounted() {
    //   console.log( this.noticeApprovalType );
    // this.handleSelect(this.noticeApprovalType)
    // this.showType = this.noticeApprovalType;
    this.getDictionary();
    this.init();
    this.common.changeTable(this, ".noticeApproval", [
      ".noticeApproval .toolbar",
      ".noticeApproval .block",
    ]);
  },
  methods: {
    init(){
      let _this = this;
      let params = {
        busicode: "HomePageWaterElf",
        data: _this.formInline
      };
      this.$api
        .fetch({
          params: params, //参数
          
        })
        .then(res => {
          _this.listTable = res;
        });
    },
    noNotice(row){
      let _this = this;
      let params = {
        busicode: "HomePageWaterElfNoticeSet",
        data: {id:row.id}
      };
      this.$api
        .fetch({
          params: params, //参数
          
        })
        .then(res => {
          this.$notify({
          title: "提示",
          message: "操作成功",
          type: "success"
        });
        this.init();
        });
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "NTT"
      };
      this.$api
        .fetch({
          params: params, //参数
          
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    search() {
      this.init();
    },
    closeDialog() {
      this.approvalPageVisible = false;
    },
    //   详情
    details(index, row) {
      // console.log(this.$parent.$parent.addTab);

      if (row === "1") {
        //对账异常
        this.$parent.$parent.addTab("微信对账异常提醒");
      } else if (row === "2") {
        //流程超过
        this.$parent.$parent.addTab("流程超时提醒");
      } else if (row === "3") {
        //抄表异常
        this.$parent.$parent.addTab("抄表异常提醒");
      } else if (row === "4") {
        //水表过期
        this.$parent.$parent.addTab("水表到期提醒");
      }
      // this.approvalPageType =row.themeTitle
      // this.approvalPageVisible = true
    },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
    },
    handleSelect(key, keyPath) {
      this.rightShow = key;

      if (key == "1-1") {
        //待办
      } else if (key == "2-1") {
        //工程管理
        this.documentoOptions1 = this.dOptionsEngineering1;
      } else if (key == "2-3") {
        //客户管理
        this.documentoOptions1 = this.dOptionsCustomer1;
      } else if (key == "2-4") {
        //表计管理
        this.documentoOptions1 = this.dOptionsMeter1;
      } else if (key == "2-6") {
        //抄表开账
        this.documentoOptions1 = this.MeterReadingRecord;
      } else if (key == "2-7") {
        //收费管理
        this.documentoOptions1 = this.ChargeManagement;
      } else if (key == "2-8") {
        //客户通知
        this.documentoOptions1 = this.CustomerNotCenter;
      }
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.formInline.pageCount = val
      this.formInline.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.formInline.page = val
      this.init();
    }
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
$imgWidth: 200px;
$theme-color: #297acc;
.noticeApproval {
  height: calc(100% - 20px);
  width: calc(100% - 40px);
  margin: 10px 20px;
  .TwoModel {
    .el-dialog__body {
      height: calc(100% - 55px);
    }
  }
  .isactive {
    color: #328ed1;
    font-weight: 700;
    & > .el-form-item__label {
      color: #328ed1;
      font-weight: 700;
    }
  }

  .applicationDate {
    padding: 8px 0;
    border-bottom: 1px dashed #ccc;
    width: 100%;
    height: 20px;
    &:after {
      // @include _clearBoth()
    }
    & > p {
      float: left;
      padding: 3px 0px;
    }
    & > ul {
      float: left;
      padding-left: 10px;
      &:after {
        // @include _clearBoth()
      }
      & > li {
        float: left;
        padding: 3px 24px;
        border-radius: 2px;
      }
      & > li:first-child {
        background: #328ed1;
        color: #fff;
      }
    }
  }
  .dataTable {
    margin-top: 10px;
    width: 100% !important;
  }

  .block {
    text-align: right;
    padding: 10px 0px;
  }
}
</style>
