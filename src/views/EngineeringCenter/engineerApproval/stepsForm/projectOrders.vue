<template>
  <div class="projectOrders">
    <!-- 
    <legend class="legendColumn">施工计划</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="constBeginDate" label="施工开始日期：" :class="{'disable-item': disabled}">
        <el-date-picker v-if="!disabled" value-format="yyyy-MM-dd" v-model="form.constBeginDate"></el-date-picker>
        <span v-else>{{form.constBeginDate}}</span>
      </el-form-item>
      <el-form-item prop="constEndDate" label="施工结束日期：" :class="{'disable-item': disabled}">
        <el-date-picker v-if="!disabled" value-format="yyyy-MM-dd" v-model="form.constEndDate"></el-date-picker>
        <span v-else>{{form.constEndDate}}</span>
      </el-form-item>
    </el-form>
    --->
  </div>
</template>

<script>
export default {
  props: ['editData', 'disabled'],
  data() {
    return {
      form: {
        constBeginDate: '',
        constEndDate: '',
      },
      rules: {
       // constBeginDate: [{ required: true, message: '施工日期不能为空', trigger: 'change' }],
       // constEndDate: [{ required: true, message: '施工日期不能为空', trigger: 'change' }]
      },
      workerNameList: []
    }
  },
  created() {
    if(this.editData) {
      this.form = {...this.editData}
        //this.form.constEndDate=this.$store.state.plantime
    }
   if(!this.disabled){
      //this.form.constEndDate = new Date();
      
   }
    this.getWorkStaffList()
  },
  methods: {
    // 施工人员数据获取
    getWorkStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "8" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.workerNameList = res;
        });
    },
    validate () {
      let data1=new Date(this.form.constBeginDate)
      let data2=new Date(this.form.constEndDate)
      let time1=data1.getTime()
      let time2=data2.getTime()
      if(time1>time2){
        return false
      }
      return true
    }
  },

  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.projectOrders {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>