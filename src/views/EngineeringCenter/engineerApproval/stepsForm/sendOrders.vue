<template>
  <div class="sendOrders">
    <legend class="legendColumn">勘察邀约</legend>
    <el-form ref="form" v-show="show" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="surveyStaff" label="邀约人：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.surveyStaff" multiple>
          <span slot="prefix">{{surveyStaffName}}</span>
          <el-option v-for="item in surveyNameList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
        </el-select>
        <span v-else>{{form.surveyStaffName}}</span>
      </el-form-item>

    <el-form-item prop="surveyInviteDate" label="勘察邀约时间：" :class="{'disable-item': disabled}">
        <el-date-picker :picker-options="pickerOptions" v-if="!disabled" v-model="form.surveyInviteDate"  format="yyyy-MM-dd" value-format="yyyy-MM-dd"  placeholder="选择日期" type="date"></el-date-picker>
        <span v-else>{{form.surveyInviteDate}}</span>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  props: ['editData', 'disabled'],
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          // 如果没有后面的-8.64e7就是不可以选择今天的
          return date.getTime() < Date.now() - 8.64e7;
        }
      },
      form: {
        surveyStaff: [],
        surveyInviteDate:''
      },
      rules: {
        surveyStaff: [{ required: true, message: '邀约人不能为空', trigger: 'change' }],
        surveyInviteDate: [{ required: true, message: '勘察邀约时间不能为空', trigger: 'change' }]
      },
      surveyNameList: [],
      show: true
    }
  },
  created() {
    this.getSurveyStaffList()
    if(this.editData) {
      this.form = {...this.editData}
    }
  },
  methods: {
    // 勘察人员数据获取
    getSurveyStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "7" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.surveyNameList = res;
        });
    },
  },
  computed: {
    surveyStaffName() {
      return this.surveyNameList && this.surveyNameList.filter(item => this.form.surveyStaff.includes(item.userAccount)).map(item => item.userName).join(', ')
    }
  },
   watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sendOrders {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>
