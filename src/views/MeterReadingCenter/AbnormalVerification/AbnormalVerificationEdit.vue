<template>
  <div class="AbnormalVerificationEdit">
      <el-form class="formBill-One" :inline="true" size="mini" :model="formData" label-width="100px">
        <el-form-item label="处理人：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.handleStaff" placeholder="处理人" clearable></el-input>
        </el-form-item>
        <el-form-item label="处理时间：">
          <el-date-picker v-model="formData.handleTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开关时间" class="read-only" :disabled="disabled">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否换表：">
          <el-select v-model="formData.changeMeterFlag" placeholder="请选择状态">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="待处理" :value="0"></el-option>
            <el-option label="已处理" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理结果：">
          <el-input v-model="formData.handleResult" type="textarea" :rows="5" placeholder="处理结果" clearable></el-input>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
export default {
  name: "AbnormalVerificationEdit",
  props: ['abnormalVerificationEditNeedData'],
  data() {
    return {
      formData: {

      },
    };
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.abnormalVerificationEditNeedData))
  },
  methods: {
    // 保存方法（由父页面调用）
    save() {
      let _this = this
      let saveData = {
        "id": this.formData.id,// 异常处理主键
        "meterReadingId": this.formData.meterReadingId,// 抄表主键
        "handleStaff": this.formData.handleStaff,// 处理人
        "handleTime": this.formData.handleTime,// 处理时间
        "changeMeterFlag": this.formData.changeMeterFlag,// 是否换表(0:是 1:否)
        "handleResult": this.formData.handleResult,// 处理结果
        "status":this.formData.status,//状态
      }
      let params = {
        "busicode": "MrAbMaterSave",
        "data": saveData,
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
  },
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.AbnormalVerificationEdit {
  height: calc(100% - 41px);
  width: 50%;
  margin: 0 auto;
}
</style>
