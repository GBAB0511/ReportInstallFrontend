
<template>
  <div class="TableValveManagementEdit">
    <el-form :inline="true" class="formBill-One" size="mini" ref="TableValveManagementEditForm" :rules="rules" :model="formData" label-width="100px">
      <el-form-item label="用户编号：" prop="userNo">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.userNo" @blur="getUserMsg" placeholder="请先输入用户编号查询相关信息" maxlength="50" class="read-only" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="客户名称：" prop="ctmName">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.ctmName" placeholder="" maxlength="50" class="read-only" disabled></el-input>
      </el-form-item>
      <el-form-item label="装表地址：" prop="setupMeterAddr">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.setupMeterAddr" placeholder="" maxlength="50" class="read-only" disabled></el-input>
      </el-form-item>
      <el-form-item label="阀门状态：" prop="valveStatus">
        <el-select v-if="!disabled" clearable v-model="formData.valveStatus" placeholder="请选择阀门状态">
          <el-option v-for="item in dictionaryData.MVS" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="disabled" v-model="formData.valveStatus" placeholder="" maxlength="200" class="read-only" disabled></el-input>
      </el-form-item>
      <el-form-item label="是否通知：" prop="isNotice">
        <el-radio-group v-model="formData.isNotice">
          <el-radio :label='1'>通知（用户缴费后，是否通知抄表员）</el-radio>
          <el-radio :label='0'>不通知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开关人员：" prop="switchStaff">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.switchStaff" placeholder="" maxlength="200" class="read-only" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="开关时间：" prop="switchTime">
        <el-date-picker v-if="!disabled" v-model="formData.switchTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开关时间" class="read-only" :disabled="disabled">
        </el-date-picker>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="disabled" v-model="formData.switchTime" placeholder="" maxlength="200" class="read-only" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="formData.comments" type="textarea" :rows="3" show-word-limit maxlength="150" placeholder="" class="read-only" :disabled="disabled"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "TableValveManagementEdit",
  props: ['tableValveManagementEditNeedData'],
  data() {
    return {
      // 是否可修改
      disabled: false,
      // 表单数据
      formData: {
        id:'',
        userNo: '',
        isNotice: 1,
        ctmName: '',
        setupMeterAddr: '',
        valveStatus:'',
        valveStatusName:'',
      },
      // 数据字典数据
      dictionaryData: {},


      rules: {
        branchNo: [
          { required: true, message: '请输入用户编号', trigger: 'blur' }
        ],
        branchName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        branchOpsition: [
          { required: true, message: '请输入用户坐标', trigger: 'blur' }
        ],
        branchAddr: [
          { required: true, message: '请输入用户地址', trigger: 'blur' }
        ],
        businessTime: [
          { required: true, message: '请选择营业时间', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '请输入排序号', trigger: 'blur' },
          { type: 'number', message: '排序号必须为数字值' }
        ],
      },
    }
  },
  mounted() {
    if (this.tableValveManagementEditNeedData.type == 'add') {
      this.getDictionary()
    } else if (this.tableValveManagementEditNeedData.type == 'details') {
      this.disabled = true
      this.init()
    }
  },
  methods: {
    // 表单初始化
    init() {
      let _this = this
      let params = {
        "busicode": "MrMeterValveQuery",
        "data": {
          id: this.tableValveManagementEditNeedData.id
        },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.formData = res
      })
    },
    // 添加-查询用户信息
    getUserMsg() {
      let _this = this
      if (this.formData.userNo == '') {
        return
      }
      let params = {
        "busicode": "UserMeterValveQuery",
        "data": {
          userNo: this.formData.userNo
        },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        if (res == '') {
          _this.$message({
            showClose: true,
            message: '无该用户信息！',
            type: 'warning'
          });
        }
        _this.formData.ctmName = res.ctmName
        _this.formData.setupMeterAddr = res.setupMeterAddr
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MVS"// 阀门状态
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 保存方法（由父页面调用）
    save() {
      if (this.formData.ctmName == '') {
        this.$message({
          showClose: true,
          message: '无该用户信息，无法保存！',
          type: 'warning'
        });
        return
      }
      let _this = this
      let params = {
        "busicode": "MrMeterValveSave",
        "data": this.formData,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$message({
          message: '保存成功！',
          type: 'success'
        });
        _this.$parent.closeDialog()
        _this.$parent.init()
      })
    },







    //保存按钮
    resetForm() {
      this.$refs.TableValveManagementEditRuleForm.resetFields();
    },
    submitForm(formName, type) {
      let _this = this;
      let params = {};

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData = this.common.handleData(this.formData, this.formData);
          if (type === '添加') {

            params = {
              "busicode": "BusinessBranchAdd",
              "data": this.formData
            }
          } else {
            params = {
              "busicode": "BusinessBranchUpdate",
              "data": this.formData
            };
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success',
            });
            _this.$parent.init();
            _this.$parent.closeDialog();
          })

        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.common.chargeObjectEqual(this, this.formData, 'get', 'TableValveManagementEdit', this.$parent.closeDialog);
    },
    editData(val) {
      this.formData = val;
    }
  },
}
</script>
<style lang="scss">
.TableValveManagementEdit {
  .formBill-One {
    width: 70%;
    margin-left: 10%;
  }
}
</style>
    

