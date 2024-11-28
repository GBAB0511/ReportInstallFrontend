<template>
  <div class="BalanceTransferEdit">
    <el-form
      class="formBill"
      size="mini"
      :disabled="isEdit"
      :inline="true"
      :model="formData"
      label-width="130px"
      ref="ruleForm"
      :rules="rules"
    >
      <el-form-item label="单据编号：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formData.billNo" placeholder disabled></el-input>
      </el-form-item>

      <el-form-item label="单据日期：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formData.billDate" placeholder disabled></el-input>
      </el-form-item>

      <legend class="legendColumn">转出账户</legend>

      <el-form-item label="转出账户：" :class="{'disable-item': isEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :class="{'read-only': isEdit }" v-model="tableQuery.fuzzyQueryOut" placeholder @keydown.enter.native="search('out')"></el-input>
      </el-form-item>
      <el-button
        v-if="!isEdit"
        size="mini"
        class="searchBtn"
        @click="search('out')"
        icon="el-icon-search"
      ></el-button>
      <br />

      <el-form-item label="客户编号：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataOut.ctmNo" placeholder disabled></el-input>
      </el-form-item>

      <el-form-item label="客户名称：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataOut.ctmName" placeholder disabled></el-input>
      </el-form-item>

      <el-form-item label="客户地址：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataOut.ctmAddr" placeholder disabled></el-input>
      </el-form-item>

      <el-form-item label="账户余额：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataOut.accountBalance" placeholder disabled></el-input>
      </el-form-item>

      <legend class="legendColumn">转入账户</legend>

      <el-form-item label="转入账户：" :class="{'disable-item': isEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :class="{'read-only': isEdit }" v-model="tableQuery.fuzzyQueryInp" placeholder @keydown.enter.native="search('input')"></el-input>
      </el-form-item>
      <el-button
        v-if="!isEdit"
        size="mini"
        class="searchBtn"
        @click="search('input')"
        icon="el-icon-search"
      ></el-button>
      <br />

      <el-form-item label="客户编号：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataInp.ctmNo" placeholder disabled></el-input>
      </el-form-item>

      <el-form-item label="客户名称：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataInp.ctmName" placeholder disabled></el-input>
      </el-form-item>

      <el-form-item label="客户地址：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataInp.ctmAddr" placeholder disabled></el-input>
      </el-form-item>

      <el-form-item label="账户余额：" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" v-model="formDataInp.accountBalance" placeholder disabled></el-input>
      </el-form-item>

      <legend class="legendColumn">过户金额</legend>

      <el-form-item label="过户金额：" :class="{'disable-item': isEdit}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :class="{'read-only': isEdit }" v-model="formData.outMoney" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
      </el-form-item>
      <el-button type="primary" size="mini">签名</el-button>

      <br />
      <el-form-item label="备注：" class="f2" :class="{'disable-item': isEdit}">
        <el-input
          type="textarea"
          :class="{'read-only': isEdit }"
          v-model="formData.comments"
          placeholder
        ></el-input>
      </el-form-item>

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
export default {
  name: "BalanceTransferEdit",
  components: {
    uploadFile
  },
  props: ["editNeedData"],
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "BILL_BALANCE_ASSIGNED",
      tempId:"",
      // 查询条件对象
      tableQuery: {
        // fuzzyQueryOut: "3006000210352",
        // fuzzyQueryInp: "3006000410479",
        fuzzyQueryOut: "",
        fuzzyQueryInp: "",
      },
      // 转出账户数据
      formDataOut: {},
      // 转入账户数据
      formDataInp: {},
      // 过户金额数据
      formData: {},
      // 是否可编辑
      isEdit: true,
      rules: {
        userNume: [
          { required: true, message: "请输入用户编号", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请输入用户编号", trigger: "blur" }]
      },
      bottomShow: true,
      approveFlag: 0
    };
  },
  mounted() {
    if (
      this.editNeedData.saveType != "add"
    ) {
      this.init();
      eventBus.$emit('receiptId', this.editNeedData.id)
    } else {
      this.getHtmlData();
      this.isEdit = false;
       this.tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', this.tempId)
    }
  },
  methods: {
    // 表单初始化
    init() {
      let _this = this;
      let params = {
        busicode: "FnBalanceAssignedQuery",
        data: {
          id: this.editNeedData.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.formData = res;
          _this.tableQuery.fuzzyQueryOut = _this.formData.outAccountNo;
          _this.tableQuery.fuzzyQueryInp = _this.formData.inAccountNo;
          _this.search("out");
          _this.search("input");
          _this.isEdit = true;
          if (
            _this.formData.processState == "" ||
            _this.formData.processState == "register"
          ) {
            _this.isEdit = false;
            this.approveFlag = 0;
          } else {
            this.approveFlag = 1;
          }

          this.getHtmlData();
        });
    },

    getFormbData() {
      var saveData = {
        outAccountNo: this.formDataOut.accountNo,
        outAccountBalance: this.formDataOut.accountBalance,

        inAccountNo: this.formDataInp.accountNo,
        inAccountBalance: this.formDataInp.accountBalance,

        outMoney: this.formData.outMoney,
        comments: this.formData.comments,
        id: this.formData.id,
        processState: this.formData.processState
      };
      return saveData;
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "BILL_BALANCE_ASSIGNED",
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

    // 两个查询按钮
    search(type) {
      let _this = this;
      if (this.tableQuery.fuzzyQueryOut == this.tableQuery.fuzzyQueryInp) {
        this.$message({
          showClose: true,
          message: '转出账户和转入账户不能相同！',
          type: 'warning'
        });
        return
      }

      let params = {
        busicode: "AccountBalanceQuery",
        data: {
          fuzzyQuery: ""
        }
      };
      if (type == "out") {
        params.data.fuzzyQuery = this.tableQuery.fuzzyQueryOut;
      } else if (type == "input") {
        params.data.fuzzyQuery = this.tableQuery.fuzzyQueryInp;
      }
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if (type == "out") {
            _this.formDataOut = res;
          } else if (type == "input") {
            _this.formDataInp = res;
          }
        });
    },

    // 保存方法（由父页面调用）
    save() {
      var _this = this;
      var saveData = {
        outAccountNo: _this.formDataOut.accountNo,
        outAccountBalance: _this.formDataOut.accountBalance,

        inAccountNo: _this.formDataInp.accountNo,
        inAccountBalance: _this.formDataInp.accountBalance,

        outMoney: _this.formData.outMoney,
        comments: _this.formData.comments
      };

      if (this.editNeedData.busicode == "FnBalanceAssignedAdd") {
          saveData.tempId = this.tempId
      }  
      var params = {
        busicode: "",
        data: saveData
      };
      if (this.editNeedData.busicode == "FnBalanceAssignedAdd") {
        // 添加-保存
        params.busicode = "FnBalanceAssignedAdd";
      } else if (
        this.editNeedData.busicode == "FnBalanceAssignedUpdate"
      ) {
        // 修改-保存
        params.busicode = "FnBalanceAssignedUpdate";
        params.data.id = _this.formData.id;
        params.data.processState = _this.formData.processState;
      }
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$notify({
            title: "成功",
            message:
              params.busicode == "FnBalanceAssignedAdd"
                ? "添加成功！"
                : "修改成功！",
            type: "success"
          });
          // 从收费管理-余额过户页面进来才执行
          if (window.location.href.indexOf("BalanceTransfer") >= 0) {
            _this.$parent.closeDialog();
          }else if (window.location.href.indexOf("HallBusiness") >= 0) {
            _this.$parent.$parent.closeDialog();
          }
          //工作台进来的执行

          
        });
    }
  }
};
</script>
<style lang="scss">
.BalanceTransferEdit {
  height: 100%;
  overflow-y: auto;
}
</style>

