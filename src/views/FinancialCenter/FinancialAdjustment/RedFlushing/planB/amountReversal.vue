

<template>
  <div class="waterFlushing">
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="100px"
      ref="ruleForm"
      :rules="rules"
    >

      <div class="kl-table">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          style="float:right;"
          @click="addTable"
        >添加</el-button>
        <el-table stripe border :data="histroyData" class="change-tables-table">
          <el-table-column type="index" label="NO." width="80" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column label="用户编号" min-width prop="accountPeriod"></el-table-column>

          <el-table-column label="客户名称" min-width prop="meterReadingDate"></el-table-column>

          <el-table-column label="用水类型" min-width prop="costName">
            <template slot-scope="scope">
                <el-cascader
                  v-model="scope.row.useWaterType"
                  :options="waterTypeData"
                  :show-all-levels="false"
                  :props="props"
                ></el-cascader>
            </template>
          </el-table-column>

          <el-table-column label="红冲金额" min-width prop="realityWater">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.priorPeriodNum" type="number" placeholder></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import billInfo from "@/views/publicModule/infmtnManagement/billInfo"; //单据信息
import userInfo from "@/views/publicModule/infmtnManagement/userInfo"; //用户信息
export default {
  name: "waterFlushing",
  props: ["formStute"],
  components: {
    uploadFile,
    billInfo,
    userInfo
  },
  data() {
    return {
      waterTypeData: [], //用水类型
      formData: {
        id: "",
        userNo: "",
        accountPeriod: "",
        useWaterType: "",
        priorPeriodNum: "",
        currendPeriodNum: "",
        rushRedWater: "",
        rushRedMoney: "",
        updateReadingNumFlag: "",
        comments: "",
        meterRead: {
          meterReadingDate: "",
          addWater: "",
          shareWater: "",
          realityWater: "",
          changeMeterFlag: "",
          margin: ""
        }
      },
      histroyData: [{}],
      NotDisabled: false, //是否可编辑
      approveFlag: 0,
      searchUserNum: "C0101310",
      wayOpen: "LiquidatedDamagesEdit",
      rules: {},
      props: {
        //树结构格式
        value: "id",
        label: "name"
      }
    };
  },
  mounted() {
    if (this.formStute.idFinaEdit) {
      this.init();
    } else {
      this.getHtmlData();
    }
    this.waterTypeDataOption();
  },
  methods: {
    indexMethod(index) {
      //获取表格序号
      return index + 1;
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
    //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree"
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = this.getArr(res);
          this.$set(this, "waterTypeData", data.children);
        })
        .catch(res => {
          this.$set(this, "waterTypeData", []);
        });
    },
    init() {
      let params = {
        busicode: "FnBillInfoList",
        data: {
          id: this.formStute.idFinaEdit
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res;
          this.initUserNo(res.userNo);
          if (
            this.formData.processState == "approval" ||
            this.formData.processState == "END"
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
          }
          this.getHtmlData();
          //单据信息
          this.getBillData(res);
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_penalty_remission",
        "审批流配置:" +
          _this.formData.processName +
          "(" +
          _this.formData.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          _this.$parent.closeDialog(); // 提交后回调方法
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.formStute.billStute
      );
    },
    addTable() {
      this.histroyData.push({});
    },
    initUserNo(val) {
      //用户编号查询
      if (val == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "warning"
        });
        return;
      }
      let data = {
        userNo: val
      };
      let params = {
        busicode: "UserSelect",
        data
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          if (this.formStute.billStute == "FnRushRedAdd") {
            this.getTableDate(res.userInfo.userNo);
          }
          this.formData.userNo = res.userInfo.userNo;
          this.getFormData(res);
        });
    },
    getTableDate(val) {
      this.$api
        .fetch({
          params: {
            busicode: "FnRushRedQuery",
            data: { userNo: val }
          }
        })
        .then(res => {
          this.histroyData = res.details;
        });
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    getUserData(res) {
      // 用户信息
      this.userData = {
        userNo: res.userInfo.userNo, //用户编号
        lockFlag: res.userInfo.lockFlag, //锁定状态
        status: res.userInfo.status, //用户状态
        houseCert: res.userInfo.houseCert, //户口簿号
        comments: res.userInfo.comments, //备注
        fatherMeterNo: res.userInfo.fatherMeterNo, //用水期限

        reformFlag: res.userInfo.reformFlag, //户表改造标记
        contractNo: res.userInfo.contractNo, //合同编号
        contractAddr: res.userInfo.contractAddr, //合同地址
        contractDate: res.userInfo.contractDate, //合同日期
        businessAbodeName: res.userInfo.businessAbodeName, //营业所
        businessAbode: res.userInfo.businessAbode, //营业所
        adminAreaName: res.userInfo.adminAreaName, //行政区域
        adminArea: res.userInfo.adminArea, //行政区域
        businessAreaName: res.userInfo.businessAreaName, //营业区域
        businessArea: res.userInfo.businessArea, //营业区域
        tradeClassifyName: res.userInfo.tradeClassifyName, //行业分类
        tradeClassify: res.userInfo.tradeClassify, //行业分类
        openDate: res.userInfo.openDate, //立户日期
        stopDate: res.userInfo.stopDate, //停用日期
        cancelDate: res.userInfo.cancelDate, //注销日期
        useTimeLimit: res.userInfo.useTimeLimit //用水期限
      };
    },
    getFormData(res, type) {
      this.getUserData(res);
      //用户信息
      this.$refs.userInfo.init(this.userData);
    },
    getFormbData() {
      let val = JSON.parse(JSON.stringify(this.formData));
      if (
        typeof val.useWaterType == "object" &&
        val.useWaterType != undefined
      ) {
        val.useWaterType = val.useWaterType[val.useWaterType.length - 1];
      }
      delete val.meterRead;
      return val;
    },
    submit() {
      let params = {
        busicode: this.formStute.billStute,
        data: this.getFormbData()
      };
      this.$api.fetch({ params }).then(res => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success"
        });
        this.$parent.closeDialog();
      });
    }
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.waterFlushing {
  height: 100%;
  overflow-y: auto;
}
</style>

