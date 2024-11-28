<template>
  <div class="BookEdit">

    <el-form class="formBill" size="mini" :inline="true" :model="userInforForm" label-width="130px" ref="ruleForm" :rules="rules">
        <commonPart :parentToChild="'1'" :Dimens="'2'"></commonPart>

        <legend class="legendColumn">册本信息</legend>
            <el-form-item label="册本号：" prop="year">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.year" disabled class="read-only" placeholder="003E"></el-input>
            </el-form-item>
            <el-form-item label="册本名称：" prop="userNume">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.userNume" disabled class="read-only" placeholder="09024334" ></el-input>
            </el-form-item>
            <el-form-item label="营业所：" prop="isfines">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.isfines" disabled class="read-only" placeholder="有限公司"></el-input>
            </el-form-item>
            <el-form-item label="管理区域：" prop="isfines">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.isfines" disabled class="read-only"  placeholder="有限公司"></el-input>
            </el-form-item>
            <el-form-item label="抄表周期：" prop="isfines">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.isfines" disabled class="read-only"  placeholder="有限公司"></el-input>
            </el-form-item>
            <el-form-item label="抄表员：" prop="isfines">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.isfines" disabled class="read-only"  placeholder="有限公司"></el-input>
            </el-form-item>
            <el-form-item label="抄表日：" prop="isfines">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.isfines" disabled class="read-only"  placeholder="有限公司"></el-input>
            </el-form-item>
            <el-form-item label="备注：" class="Remarks">
                <el-input type="textarea" v-model="userInforForm.desc1" disabled placeholder="请输入备注"  ></el-input>
            </el-form-item>

        <legend class="legendColumn" >抄表信息</legend>
            <el-form-item label="账期：" prop="year">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.year" placeholder="003E"></el-input>
            </el-form-item>
            <el-form-item label="上期抄表日期：" prop="year">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.year" placeholder="003E"></el-input>
            </el-form-item>
            <el-form-item label="本期抄表日期：" prop="year">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userInforForm.year" placeholder="003E"></el-input>
            </el-form-item>

        <legend class="legendColumn">变更事项</legend>
            <changeMatters class=""></changeMatters>

        <legend class="legendColumn">流程处理</legend>
            <procedure></procedure>

    </el-form>

  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //流程审核
import changeMatters from "@/components/changeMatters"//变更事项
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
export default {
  name: "BookEdit",
  components: {
    uploadFile,
    commonPart,
    changeMatters,
    procedure
  },
  data() {
    return {
      redTime: "",
      beginYearM: "",
      userInforForm: {
        // 查询内容
        cDate: "",
        cTime: "",
        backfillInput: [
          {
            label: "用户名称：",
            value: "",
            tips: ""
          },

          {
            label: "用户地址：",
            value: "",
            tips: ""
          },
          {
            label: "用水类型：",
            value: "",
            tips: ""
          },
          {
            label: "联系人：",
            value: "",
            tips: ""
          },
          {
            label: "座机号码：",
            value: "",
            tips: ""
          }
        ],

        desc: "",
        userNume: "",
        descoptions: [
          {
            name: "0040__生活用水2.85",
            value: "1"
          },
          {
            name: "0041__免费用水",
            value: "2"
          }
        ],
        IsFine: [
          {
            name: "是",
            value: "1"
          },
          {
            name: "否",
            value: "2"
          }
        ],
        UpdateCodeCopying: [
          {
            name: "是",
            value: "1"
          },
          {
            name: "否",
            value: "2"
          }
        ],
        userNum: "",
        PriceStrategy: "",
        isfines: "2",
        UpdateCodeCopye: "2",
        Remarks: "",
        priorPeriodNum: "",
        currendPeriodNum: "",
        currendPeriodWater: ""
      },
      rules: {
        userNum: [
          { required: true, trigger: "blur", message: "请输入用户编号" }
        ],
        desc: [{ required: true, trigger: "blur" }]
      },
      histroyData: {},
      label: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
     
    }
  }
};
</script>
<style lang="scss">
$theme-font-color: #3680cd;
.BookEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
}
</style>

 