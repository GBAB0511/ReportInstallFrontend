<template>
  <div class="insideEngingEdit">
    <el-form :rules="rules" :model="formData" class="formBill" size="mini" :inline="true" ref="insideEngineeringForm" label-width="130px">
      <!-- 单据信息 -->
      <billInfo v-if="keySon.type=='update'||keySon.type=='DRAFT'" ref="billInfo"></billInfo>

      <legend class="legendColumn">工程信息</legend>

      <el-form-item label="工程名称：" prop="inpjName">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.inpjName" size="mini" clearable></el-input>
      </el-form-item>

      <el-form-item label="工程类型：" prop="pjType">
        <el-select v-model="formData.register.pjType" clearable size="mini">
          <el-option v-for="item in dictionaryData.IPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="紧急程度：" prop="urgentFlag">
        <el-select v-model="formData.register.urgentFlag" clearable size="mini">
          <el-option v-for="item in dictionaryData.EGD" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用水地址：" prop="pjAddr">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.pjAddr" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="linkMan">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.linkMan" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="linkTel">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.register.linkTel" size="mini" clearable></el-input>
      </el-form-item>
      <!-- <br> -->
      <el-form-item label="申请原因：" class="Remarks" prop="applDesc">
        <el-input type="textarea" v-model="formData.register.applDesc"></el-input>
      </el-form-item>
      <el-form-item label="派单说明：" class="Remarks" prop="acceptDesc">
        <el-input type="textarea" v-model="formData.register.acceptDesc"></el-input>
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
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "insideEngingEdit",
  props: ["keySon"],
  components: {
    billInfo,
    uploadFile
  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程管理" }, { title: "内部工程" }]
      },
      dictionaryData: [],
      formData: {
        register:{
          id: "",
          pjType: "1", //工程类型
          urgentFlag: "1", //紧急程度
          pjAddr: "", //地址
          linkMan: "", //联系人
          linkTel: "", //联系电话
          applDesc: "", //申请原因
          acceptDesc: "", //派单原因
          inpjName: "" //工程名称
        }
      },
      uploadIcon: "el-icon-minus",
      uploadFileShow: true,
      receiptType: "PJ_INTERNAL",
      maxHeight: 0,
      tableShow: false,
      rules: {
        register:{
          inpjName: [
            { required: true, message: '请输入工程名称', trigger: 'blur' }
          ],
          pjType: [
            { required: true, message: '请选择工程类型', trigger: 'change' }
          ],
          urgentFlag: [
            { required: true, message: '请选择紧急程度', trigger: 'change' }
          ],
          pjAddr: [
            { required: true, message: '请输入用水地址', trigger: 'blur' }
          ],
        }
      },
    };
  },
  mounted() {
    if (this.keySon.type == "DRAFT") {
      //this.formData = this.keySon.formData;
      // 单据信息
      this.billData = {
        billNo: this.keySon.formData.billNo, //单据编号
        billDate: this.keySon.formData.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    }
    if(this.keySon.type == "add") {
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)   //添加时 附件临时ID
      this.formData.tempId = tempId
    }else{
      this.init(this.keySon.formData.id);
      eventBus.$emit('receiptId', this.keySon.formData.id)
    }
    //数据字典接口
    this.getDictionary();
    this.getHtmlData();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".engineer-center .engineer-center-right", [
        ".engineer-center .table-top"
      ]);
    });
  },
  methods: {
    init(val){
      let params = {
        busicode: "PjInternalQuery",
        data: {
          id: val
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.formData = res
          this.operationShow = res.processState
          this.$emit('detail', res)
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "PJ_INTERNAL",
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
        0, // 不等于1时，先保存后提交
        "PjInternalSave"
      );
    },
    // 展示更多
    showMore(val, icon) {
      if (this[val]) {
        this[val] = false;
        this[icon] = "el-icon-plus";
      } else {
        this[val] = true;
        this[icon] = "el-icon-minus";
      }
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "IPT,EGD"
        //工程类型、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    getFormbData() {
      return this.formData
    },
    submit(type) {
      let _this = this
      
      this.$refs['insideEngineeringForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: "PjInternalSave",
            data: this.getFormbData()
          };
          _this.$api.fetch({ params }).then(res => {
            _this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            _this.formData.id = res.id;
            _this.$parent.closeDialog();
          });
        } else {
          return false;
        }
      });
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
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.insideEngingEdit {
  height: 100%;
  overflow-y: auto;
}
</style>
