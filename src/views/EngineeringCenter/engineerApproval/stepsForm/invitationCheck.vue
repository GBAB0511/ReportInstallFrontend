<template>
  <div class="invitationCheck">
    <legend class="legendColumn">验收邀约</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="checkInviteDate" label="验收日期：" :class="{'disable-item': disabled}">
        <el-date-picker v-if="!disabled" v-model="form.checkInviteDate" value-format="yyyy-MM-dd"></el-date-picker>
        <span v-else>{{form.checkInviteDate}}</span>
      </el-form-item>
      <el-form-item prop="checkInviteStaff" label="验收人员：" :class="{'disable-item': disabled}" >
        <el-select v-if="!disabled" v-model="form.checkInviteStaff" multiple>
          <span slot="prefix">{{checkInviteStaffName}}</span>
          <el-option v-for="item in checkNameList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
        </el-select>
        <span v-else>{{form.checkInviteStaffName}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['editData', 'disabled'],
  data () {
    return {
      form: {
        checkInviteDate: '',
        checkInviteStaff: ''
      },
      rules: {
        checkInviteDate: [{ required: true, message: '验收日期不能为空', trigger: 'change' }],
        checkInviteStaff: [{ required: true, message: '请选择验收人员', trigger: 'change' }]
      },
      checkNameList: [],
    }
  },
  computed: {
    checkInviteStaffName() {
      return this.checkNameList && this.checkNameList.filter(item => this.form.checkInviteStaff.includes(item.userAccount)).map(item => item.userName).join(', ')
    }
  },
  watch:{
    "form.checkInviteStaff": {
      handler(val) {
        console.log(val);
      }
    },
  },
  created () {
    this.getCheckStaffList()
    if (this.editData) {
      this.form = { ...this.editData }
    }
    console.log('ini', JSON.stringify(this.editData))
  },
  methods: {
    // 验收人员数据获取
    getCheckStaffList () {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "10" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.checkNameList = res;
          console.log(_this.checkNameList)
        });
    },

  },
  watch: {
    editData (val) {
      if (val) {
        this.form = { ...val }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.invitationCheck {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>
