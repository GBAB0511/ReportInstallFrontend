<template>
  <div class="useWaterTypeInfo">
    <legend v-if="labelStyle" class="legendColumn">{{ labelNames }}</legend>
    <dynamic-form v-bind="$attrs" :formConfig="formConfig" :checkForm="addWay" ref="dynamicForm" class="construction-form" :editType="editType" :formData="formData" :openWay="wayOpen"></dynamic-form>
  </div>
</template>
<script>
import dynamicForm from "@/components/autoForm/dynamicForm"
export default {
  name: "useWaterTypeInfo",
  //edittype=0不可编辑 //wayopen-各模块调用时传值是否显示隐藏该输入框
  props: ["editType", "wayOpen", "addWay"],
  components: {
    dynamicForm
  },
  data () {
    return {
      openWay: '',
      labelNames: "",//标题名称
      labelStyle: false,
      editFormData: {},
      loading: false,
      options: [],
      formConfig: {
        itemArr: [
        ],
      },
      formData: {
        // userInfo:{
        useWaterType: '',
        useWaterTypeName: '',
        // }
      },
      rules: {},
    };
  },
  mounted () {
    this.getFormPage()
  },
  watch: {},
  methods: {
    // 数据初始化
    init (val) {
      if (val) {
        this.formData = val;
        this.getFormPage()
      }
    },
    getFormDetail (form) {
      this.$set(this, 'formData', form)
    },
    getFormData () {
      return this.$refs.dynamicForm.getFormData();
    },
    //动态获取用户信息表单
    getFormPage () {
      let _this = this;
      let params = {
        "busicode": "UserFieldConfigSelect",
        "data": { pageName: this.wayOpen },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        res.forEach((v) => {
          if (v.group == "用户用水类型") {
            this.labelStyle = true
            this.labelNames = v.group;
            var tmp = [];
            this.tmpIndex = res;
            tmp.push(this.tmpIndex);
            this.formConfig.itemArr = v.fields;
          }

        });
        _this.$refs.dynamicForm.init()
      })
    },
    clearForm () {
      this.formData = {
        // userInfo:{
        useWaterType: '',
        useWaterTypeName: '',
        // }
      };
    },
    remoteMethod (query) {
      if (query !== '') {
        let _this = this
        let params = {
          "busicode": "UserGroupList",
          "data": { remote: 1, fuzzyQuery: query, page: 1, pageCount: 10 },
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.options = res.list
        })
      } else {
        this.options = [];
      }
    },
  }
};
</script>
<style lang="scss">
.useWaterTypeInfo {
  height: 100%;
  .formBill {
    .el-form-item__label {
      width: 130px;
    }
  }
}
</style>
