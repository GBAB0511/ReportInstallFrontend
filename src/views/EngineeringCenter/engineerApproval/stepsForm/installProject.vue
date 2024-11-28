<template>
  <div class="installProject">
    <legend class="legendColumn">安装施工</legend>
    <el-form ref="form" :model="form" class="formBill" :inline="true" size="mini" label-width="130px" :rules="rules" label-position="right" :disabled="disabled">
      <el-form-item prop="constComments" label="安装说明：" class="col-2" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" type="textarea" v-model="form.constComments"></el-input>
        <span v-else>{{form.constComments}}</span>
      </el-form-item>
      <el-form-item prop="wateringTime" label="通水时间：" class="col-2" :class="{'disable-item': disabled}">
        <el-date-picker v-if="!disabled" :clearable="false" v-model="form.wateringTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择时间"></el-date-picker>
        <span v-else>{{form.wateringTime}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['editData', 'disabled'],
  data() {
    return {
      form: {
        constComments: '',
        wateringTime: "",
      },
      rules: {
        wateringTime: [{ required: true, message: '通水时间不能为空', trigger: 'change' }]
      },
    }
  },
  created() {
    if(this.editData) {
      this.form = {...this.editData}
      if(this.form.wateringTime == ""){
        const date = new Date();
        this.form.wateringTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());//默认当前时间
      }
    }

  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    }
  },
  methods:{
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
  }
}
</script>

<style lang="scss" scoped>
.installProject {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>