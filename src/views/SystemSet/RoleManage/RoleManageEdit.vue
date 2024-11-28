
<template>
  <div class="RoleManageEdit common-bdiv">

    <div class="backfillSubmitForm">
      <!-- class="formBill-Two" -->
      <el-form :inline="true"  size="mini" :model="RoleManageEditForm" label-width="150px" ref="ruleForm" :rules="rules">
        <el-form-item label="角色名称：" prop="noticeType">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="RoleManageEditForm.title" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="RoleManageEditForm.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述：" prop="factoryName" class="w-60">
          <el-input type="textarea" placeholder="请输入短信通知内容" v-model="RoleManageEditForm.smsContent" maxlength="500" show-word-limit>
          </el-input>
        </el-form-item>
        <legend class="common-legend">所属用户</legend>
        <div class="fixCheckbox">
          <el-checkbox v-model="checked1" checked="checked" label="张三"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="李四"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="王五"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="吴二麻子"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="张三"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="张三"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="李四"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="王五"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="吴二麻子"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="张三"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="李四"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="王五"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="吴二麻子"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="张三"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="张三"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="李四"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="王五"></el-checkbox>
          <el-checkbox v-model="checked1" checked="checked" label="吴二麻子"></el-checkbox>
        </div>
      </el-form>
    </div>

  </div>
</template>
<script>
export default {
  name: "RoleManageEdit",
  components: {
  },
  data() {
    return {
      RoleManageEditForm: {
        informationType: [
          {
            label: "文章",
            value: "1",
          },
          {
            label: "链接",
            value: "0",
          },
        ],
        // 查询内容
        backfillInput: [
          {
            label: "用户名称：",
            value: "",
            tips: "xx319"
          },
          {
            label: "用户地址：",
            value: "",
            tips: "登封路"
          },
          {
            label: "联系人：",
            value: "",
            tips: ""
          },
          {
            label: "联系方式：",
            value: "",
            tips: ""
          },
        ],

        desc: "",
        userNume: "",
        descoptions: [
          {
            name: "停水通知",
            value: "1"
          },
          {
            name: "水厂开放日",
            value: "2"
          },
          {
            name: "新闻公告",
            value: "3"
          },
          {
            name: "其它",
            value: "3"
          },
        ],
        title: "",
        describe: "",
        type: "1",
        LeavingMessage: "",
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
        LeavingMessage: [
          { required: true, message: '请输入留言', trigger: 'blur' },
        ],
        userNume: [
          { required: true, message: '请输入留言', trigger: 'blur' },
        ]
      },
      fileList: []

    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },


  }
}
</script>
<style lang="scss">
.RoleManageEdit {
  .backfillSubmitForm {
    .el-form-item {
      width: 30%;
      margin-top: 20px;
      .el-form-item__content {
        width: calc(100% - 150px);
      }
      input {
        width: 100%;
      }
    }
    .w-60{
      width: 60%;
    }
    .fixCheckbox {
      margin: 0px 20px;
      .el-checkbox {
        width: 60px;
      }
    }
  }
}
</style>

