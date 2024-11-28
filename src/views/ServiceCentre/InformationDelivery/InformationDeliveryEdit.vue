

<template>
  <div class="InformationDeliveryEdit">
    <div class="backfillSubmitForm">
      <el-form size="mini" class="basicInfoForm" :inline="true" :model="InformationDeliveryEditForm" label-width="150px" ref="ruleForm" :rules="rules">

        <el-form-item label="水厂名称：" prop="factoryName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="InformationDeliveryEditForm.factoryName" placeholder=""></el-input>

        </el-form-item>
        <el-form-item label="水厂地址：" prop="area">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="InformationDeliveryEditForm.area" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="userNume">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="InformationDeliveryEditForm.userNume" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="座机号码：" prop="userNum">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="InformationDeliveryEditForm.userNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="开放日期：" prop="OpeningDate">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="InformationDeliveryEditForm.OpeningDate" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="报名截止日期：" prop="RegistrationDeadline">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="InformationDeliveryEditForm.RegistrationDeadline" placeholder=""></el-input>
            </el-form-item> -->

        <el-form-item label="文章链接：" prop="OpeningDate">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="InformationDeliveryEditForm.desc" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :rows="5" v-model="InformationDeliveryEditForm.RegistrationDeadline" placeholder="备注"></el-input>
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>
<script>
export default {
  name: "InformationDeliveryEdit",
  data() {
    return {
      InformationDeliveryEditForm: {
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
            label: "南沙自来水厂",
            value: "",
            tips: "登封路"
          },
          {
            label: "南沙污水厂",
            value: "",
            tips: ""
          },
          {
            label: "南沙原水厂",
            value: "",
            tips: ""
          },],
        area: "",
        factoryName: "",
        userNum: "",
        OpeningDate: "",
        RegistrationDeadline: ""
      },
      rules: {
        userNume: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        desc: [
          { required: true, message: '请输入用户编号', trigger: 'blur' },
        ],
        area: [
          { required: true, message: '请输入水厂地址', trigger: 'blur' },
        ],
        factoryName: [
          { required: true, message: '请输入水厂名称', trigger: 'blur' },
        ],
        userNum: [
          { required: true, message: '请输入座机号码', trigger: 'blur' },
        ],
        OpeningDate: [
          { required: true, message: '请输入开放日期', trigger: 'blur' },
        ],
        RegistrationDeadline: [
          { required: true, message: '请输入开放日期', trigger: 'blur' },
        ],
      },

    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },

  }
}
</script>
<style lang="scss">
.InformationDeliveryEdit {
  height: 100%;
  width: 80%;
  margin: 0 auto;
  legend {
    background: #f5f5f5;
    font-weight: 700;
    font-size: 12px;
    padding: 5px 20px;
    font-size: 14px;
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
}
</style>

