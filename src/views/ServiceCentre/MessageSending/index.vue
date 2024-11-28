<template>
  <div class="message-sending">
    <!-- class="formBill-One" -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="sending">发送</el-button>
      </div>
    </div>

    <el-dialog class="button-dialog" title="选择用户" v-if="selectDialogVisible" :visible.sync="selectDialogVisible" width="80%" close-on-click-modal>
      <QuestionSearchUser ref="QuestionSearchUser"></QuestionSearchUser>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="add">确 定</el-button>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
      </span>

    </el-dialog>

    <div class="indexContent">
      <el-form size="mini" :model="formData" class="formBill-One" label-width="90px" :rules="rules" ref="registerForm">
        <el-form-item label="用户编号：" class="user-no" prop="userNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userNo" placeholder="请输入用户编号" @keydown.enter.native="search"></el-input>
          <el-button class="searchBtn right" icon="el-icon-search" @click="search"></el-button>
        </el-form-item>

        <el-form-item label="客户名称：" prop="userName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userName" placeholder="请输入客户名称"></el-input>
        </el-form-item>

        <el-form-item label="手机号码：" prop="userPhone">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userPhone" placeholder="请输入手机号码"></el-input>
        </el-form-item>

        <el-form-item label="发送内容：" prop="content">
          <el-input type="textarea" placeholder="请输入发送内容" v-model="formData.content" maxlength="200" rows="3"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import QuestionSearchUser from "./QuestionSearchUser";
export default {
  name: "messageSending",
  components: {
    QuestionSearchUser
  },
  data () {
    return {
      rules: {
        userNo: [{ required: true, message: "用户编号不能为空", trigger: "blur" }],
        userName: [{ required: true, message: "客户名称不能为空", trigger: "blur" }],
        userPhone: [{ required: true, message: "手机号码不能为空", trigger: "blur" }],
        content: [{ required: true, message: "发送内容不能为空", trigger: "blur" }],
      },
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户通知" }, { title: "短信发送" }]
      },
      formData: {
        userNo: "",
        userName: "",
        userPhone: "",
        content: ""
      },
      noteType: [
        { value: "1", label: "普通模板" },
        { value: "2", label: "特殊模板" }
      ],
      selectDialogVisible: false
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () { },
    add () {
      this.formData.userNo = this.$refs.QuestionSearchUser.selectData.userNo;
      this.formData.userName = this.$refs.QuestionSearchUser.selectData.ctmName;
      this.formData.userPhone = this.$refs.QuestionSearchUser.selectData.linkTel;
      this.$refs.registerForm.validate();
      this.closeDialog();
    },
    search () {
      this.selectDialogVisible = true;
    },
    closeDialog () {
      this.selectDialogVisible = false;
    },
    sending () {
      let rel = "";
      this.$refs.registerForm.validate((valid) => {
        if (!valid) {
          rel = "当前必填项未完善，请检查"
        }
      })
      if (rel.length > 0) {
        this.$notify({
          title: "警告",
          message: rel,
          type: "error"
        });
        return
      }
      let params = {
        busicode: "SendMessage",
        data: this.formData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "消息",
            message: "发送成功",
            type: "success"
          });
          this.$refs.registerForm.resetFields()
        });
    }
  },
  watch: {}
};
</script>
<style lang="scss">
.message-sending {
  width: 100%;
  height: 100%;
  .user-no {
    .el-input {
      width: 85%;
    }
  }
  .indexContent {
    width: 60%;
    margin: 0 auto;
  }
  .el-table__body tr.current-row > td {
    background: #86e9e4 !important;
  }
  .formBill-One {
    .el-form-item {
      .el-form-item__label {
        line-height: 42px !important;
      }
    }
  }
}
</style>