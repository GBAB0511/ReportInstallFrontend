

<template>
  <div class="RedFlushingEdit">
    <el-form
      class="formBill"
      size="mini"
      :inline="true"
      :model="formData"
      label-width="100px"
      :disabled="NotDisabled"
      ref="ruleForm"
      :rules="rules"
    >
      <!-- 单据信息 -->
      <billInfo v-if="editNeedData.busicode!='FnRushRedAdd'" ref="billInfo"></billInfo>

      <legend class="legendColumn">实收减免信息</legend>
      <el-form-item label="账期：" prop ="accountPeriod">
            <el-date-picker
              :picker-options="pickerOptions"
              v-model="formData.accountPeriod"
              size="mini"
              type="month"
              format="yyyy-MM"
              value-format="yyyyMM"
              placeholder="选择月"
            ></el-date-picker>
          </el-form-item>
      <el-form-item class="f2" label="备注：">
        <el-input type="textarea" v-model="formData.comments" placeholder></el-input>
      </el-form-item>

      <div class="kl-table">
        <el-button
          type="primary"
          size="mini"
          v-if="!NotDisabled"
          icon="el-icon-plus"
          style="float:right; margin-bottom: 5px"
          @click="addTable"
        >添加行</el-button>
        <el-table stripe border :data="formData.details" class="change-tables-table">
          <el-table-column type="index" label="NO." width="80" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column label="用户编号" min-width prop="userNo">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.userNo"
                @change="initUserNo(scope.row.userNo,scope.$index)"
                placeholder
              >
                <el-button
                  slot="append"
                  v-if="!NotDisabled"
                  size="mini"
                  class="searchBtn scanning-btn"
                  @click="initUserNo(scope.row.userNo,scope.$index)"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
            </template>
          </el-table-column>

          <el-table-column label="客户名称" min-width prop="ctmName"></el-table-column>

          <!--<el-table-column label="用水类型" min-width prop="useWaterType">
            <template slot-scope="scope">
              <el-cascader
                disabled
                v-model="scope.row.useWaterType"
                :options="waterTypeData"
                :show-all-levels="false"
                :props="props"
                placeholder
              ></el-cascader>
            </template>
          </el-table-column>-->

          <el-table-column label="费用类型：" prop="costId">
            <template slot-scope="scope">
              <el-select  v-model="scope.row.costId" placeholder="">
                <el-option v-for="item in costData" :key="item.id" :label="item.costName" :value="item.id"></el-option>
              </el-select>
              </template>
            </el-table-column>

          <el-table-column label="红冲金额" min-width prop="rushRedMoney">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.rushRedMoney" :precision="2" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
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
  name: "RedFlushingEdit",
  props: ["editNeedData"],
  components: {
    uploadFile,
    billInfo,
    userInfo
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "bill_rush_red#2",
      //waterTypeData: [], //用水类型
      costData:[],
      formData: {
        id: "",
        accountPeriod: "", //账期
        comments: "", //备注
        rushType: 2, // 1 红冲水量 2 红冲金额
        details: [
          {
            userNo: "",
            // billDetailId: "", //账单明细
            rushRedMoney: "", //红冲金额
            //useWaterType: "" //用水类型
            costId:"",
          }
        ]
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
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
    this.costSelect()
    if (this.editNeedData.saveType != 'add') {
      this.init();
       eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId= tempId
      this.getHtmlData();
    }
    //this.waterTypeDataOption();
  },
  methods: {
    // 下载模板
    exportExcel() {
      var params = {
        busicode: "FnRushRedExport",
        data: {
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
       window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    indexMethod(index) {
      //获取表格序号
      return index + 1;
    },
    //树结构数据处理
    // getArr(data) {
    //   function abc(arr) {
    //     arr.map(i => {
    //       if (i.isParent === false) {
    //         delete i.children;
    //       } else {
    //         abc(i.children);
    //       }
    //     });
    //   }
    //   abc(data.children);
    //   return data;
    // },
    //用水分类下拉数据
    // waterTypeDataOption() {
    //   var params = {
    //     busicode: "WaterTypeTree"
    //   };
    //   this.$api
    //     .fetch({ params })
    //     .then(res => {
    //       let data = this.getArr(res);
    //       this.$set(this, "waterTypeData", data.children);
    //     })
    //     .catch(res => {
    //       this.$set(this, "waterTypeData", []);
    //     });
    // },
    costSelect() {    //初始化费用类型下拉
      var _this = this
      var params = {
        busicode: "CostList"
      };
      this.$api
        .fetch({ params })
        .then(res => {
            _this.costData = res
        })
        .catch(res => {

        });
    },
    init() {
      let params = {
        busicode: "FnRushRedQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          res.accountPeriod = res.accountPeriod + ""
          this.formData = res;
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
        "bill_rush_red#2",
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
          if (window.location.href.indexOf('WaterSideIndex') > 0 || window.location.href.indexOf('HallBusiness') > 0) {// 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog()
          } else {// 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.editNeedData.busicode
      );

    },
    addTable() {
      this.formData.details.push({
        userNo: "",
        // billDetailId: "", //账单明细
        rushRedMoney: "", //红冲金额
        useWaterType: "" //用水类型
      });
    },
    initUserNo(val, index) {

      //用户编号查询
      if (val == "") {
        this.$message({
          message: "用户编号不能为空。",
          type: "error"
        });
        return;
      }
      let data = {
        userNo: val,
        status: 5 //实收减免
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
          this.$set(this.formData.details[index], 'ctmName', res.ctmInfo.ctmName)
          this.$set(this.formData.details[index], 'userNo', res.userInfo.userNo)
          // this.formData.details[index].ctmName = res.ctmInfo.ctmName;
          // this.formData.details[index].userNo = res.userInfo.userNo;
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
    validate () {
      return new Promise((res, rej) => {
        for (let i = 0; i < this.formData.details.length; i++) {
          console.log(this.formData.details[i].userNo);
          console.log(this.formData.details[i].costId);
          console.log(this.formData.details[i].rushRedMoney);
//           if (this.formData.details[i].userNo == '') {
//             this.$message({
//               message: "用户编号不能为空！",
//               type: "error",
//             });
//             rej()
//             return;
//           }
//
                    if (this.formData.details[i].costId == '' || !this.formData.details[i].costId) {
            this.$message({
              message: "费用类型不能为空！",
              type: "error",
            });
            rej()
            return;
          }
          if (this.formData.details[i].rushRedMoney == '') {
            this.$message({
              message: "红冲金额不能为空！",
              type: "error",
            });
            rej()
            return;
          }
          if (this.formData.details[i].rushRedMoney < 0.01) {
            this.$message({
              message: "红冲金额不能小于0.01 ",
              type: "error",
            });
            rej()
            return;
          }
        }
        res(null);
      }).then((res) => {
        return res;
      })
    },
    async changeBeforeSubmit (b) { //提交前进行校验
      let message = null
      message = await this.validate();
      return message
    },
    getFormbData() {
      let val = JSON.parse(JSON.stringify(this.formData));
      // if (
      //   typeof val.useWaterType == "object" &&
      //   val.useWaterType != undefined
      // ) {
      //   val.useWaterType = val.useWaterType[val.useWaterType.length - 1];
      // }
      delete val.meterRead;
      val.details.forEach(item=> {
        delete item.costName;
      })
      return val;
    },
    async submit() {
      await this.validate();
      let params = {
        busicode: this.editNeedData.busicode,
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
    },
    deleteRow(index, row){
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.formData.details.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.RedFlushingEdit {
  height: 100%;
  overflow-y: auto;
  margin-top: 10px;
}
</style>

