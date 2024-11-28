<template>
  <div class="CustomSms">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    
    <div class="toolbar" v-if="divChange==1">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" style="margin-top:100px;margin-left:400px" @submit.native.prevent>
        <el-form-item>
          <el-button icon="el-icon-bottom" @click="downloadTemplate" type="primary" style="width: 150px;height: 35px;">下载模板</el-button>
        </el-form-item>

        <el-form-item>
          <el-upload class="upload-demo" multiple action="/" :http-request="importExcel">
            <el-button icon="el-icon-download" type="primary" style="width: 150px;height: 35px;">导入</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button class="searchBtn" style="width: 150px;height: 35px;" @click="History">发送历史</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 导入 -->
    <div class="bread-contain-right" v-else-if="divChange==0">
        <el-button icon="el-icon-caret-left" size="mini" @click="callBack">返回</el-button>
    </div>
    <!-- 发送历史 -->
    <div class="bread-contain-right" v-else-if="divChange==2">
        <el-button icon="el-icon-caret-left" size="mini" @click="callBack">返回</el-button>
    </div>
  </div>
    <!-- 导入 -->
    <CustomSmsImport  @calback="closeDialog" :booksVal="booksVal" v-if="divChange==0"></CustomSmsImport>
    <!-- 发送历史 -->
    <SendHistory @calback="closeDialog" :booksVal="booksVal" v-else-if="divChange==2"></SendHistory>
  </div>
</template>
<script>
import CustomSmsImport from './CustomSmsImport.vue';
import SendHistory from './SendHistory.vue';

export default {
  name: "CustomSms",
  components:{
    CustomSmsImport,
    SendHistory
  },
  data() {
    return {
      //列表存值
      tableData: [],
      divChange: 1,
      booksVal: {
        //index: "",
        userPhone: "", //发送手机号
        ctmName: "", //客户名称
        userNo: "", //用户编号
        ctmAddr: "", //客户地址
        content: "", //短信内容
      },
      crumbsData: {
        titleList: [
          { title: "客户通知" },
          { title: "短信通知" },
          { title: "自定义短信" },
        ],
      },
      SellOutVisible: false,
      tableQuery: {
        //查询表单数据
        page: 1,
        pageCount: 20,
      },
      maxHeight: 0,
    };
  },
  mounted(){
  
  },
  methods:{
    //下载模板
    downloadTemplate () {
      var params = {
        busicode: "MessageTemplateOut",
        data: {
  
        },
        token: sessionStorage.getItem('token'),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    // 导入按钮
    importExcel (file) {
      let _this = this;
      console.log(file);
      let params = {
        busicode: "CustomSmsImport",
        type: "import", //导入
        data: {
          file: file.file

        }
      };
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          _this.$message({
            message: "导入数据成功！",
            type: "success"
          });
          console.log(res);
          _this.booksVal = res;
          console.log(_this.booksVal);
          this.divChange = 0;
        });
    },
 /*    ImportShow (scope) {
      //this.booksVal = {}
      if (scope.$index || scope.$index >= 0) {
          this.booksVal.index = this.tableData.index;
          this.booksVal.userNo = scope.row.userNo
        }
        this.divChange = 0;
        console.log(this.booksVal);
    }, */
    History () {
      this.divChange = 2;
    },
    callBack () {
      this.divChange = 1;
      //this.init();
      // this.booksVal = {
      //   bookNo: "",
      //   index: ""
      // };
      // this.clearTreeDate();
      console.log('返回')
      //this.backTreeData()
    },
    closeDialog (val) {
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
.CustomSms{
  width: 100%;
  height: 100%;
}
</style>