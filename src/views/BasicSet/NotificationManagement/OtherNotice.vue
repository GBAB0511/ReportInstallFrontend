<template>
  <div class="water-manage">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" icon="el-icon-plus" @click="submitForm()" type="primary">保存</el-button>
      </div>
    </div>
    <el-form class="lineForm" :model="formData" size="mini" label-width="100px">

      <legend class="legendColumn">对账异常通知</legend>
      <el-form-item label="通知人员：">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.noticeStaff1">
        </el-input>
      </el-form-item>

      <legend class="legendColumn">流程超时通知</legend>
      <el-form-item label="通知人员：">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.noticeStaff2">
        </el-input>
      </el-form-item>

      <legend class="legendColumn">抄表异常通知</legend>
      <el-form-item label="通知人员：">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.noticeStaff3">
        </el-input>
      </el-form-item>

      <legend class="legendColumn">水表到期通知</legend>
      <el-form-item label="通知人员：">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.noticeStaff4">
        </el-input>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>

export default {
  name: "PaymentNotice",
  data() {
    return {
      formData: {
        noticeStaff1:"",
        noticeStaff2:"",
        noticeStaff3:"",
        noticeStaff4:"",
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessArea' },
          { title: '水精灵管理', method: () => { window.histroy.back() } },
          { title: '其他精灵', method: () => { window.histroy.back() } }
        ],
      },

    }
  },
  mounted() {
    this.init();
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow5')
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this
      let params = {
        "busicode": "BaseOtherQuery",
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.formData=res;
      })
    },
    //保存按钮
    submitForm() {
      let _this = this
      let params = {
        "busicode": "BaseOtherElfAdd",
        "data": _this.formData,
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        });
        this.init();
      })
    },
  },
  watch: {
  }
}
</script>

