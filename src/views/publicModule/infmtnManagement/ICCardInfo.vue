<template>
  <div class="ICCardInfo">
   <legend v-if="labelStyle" class="legendColumn">{{ labelNames }}</legend>
    <dynamic-form v-bind="$attrs" :formConfig="formConfig" :checkForm="addWay" ref="dynamicForm"  class="construction-form" :editType="editType" :formData="formData" :openWay="openWay"></dynamic-form>
  </div>
</template>
<script>
import dynamicForm from "@/components/autoForm/dynamicForm"
export default {
  name: "ICCardInfo",
  //edittype=0不可编辑 //wayopen-各模块调用时传值是否显示隐藏该输入框
  props: ["editType", "wayOpen", "addWay"],
  components: {
       dynamicForm
  },
  data() {
    return {
      openWay:'',
      labelNames: "",//标题名称
      labelStyle:false, 
      editFormData: {},
      loading: false,
      options:[],
      formConfig: {
          itemArr: [  
          ],
        },
      formData: {
         miicno: '', // IC卡号
          miljfje: '', // IC子表号
          miiccnt: '', // IC累计购买次数
          miicyearcnt: '', // 年次
          miicsl: '', // 累购
          miicusesl: '', // IC累计用量
          miicdisplay: '', // 显示报警量
          miicclosing: '', // 关阀报警量
          miicpurchase: '', // 限购
          miicyd: '', // 采样点
          miicpresl: '', // IC卡维修底数
          miicprehbsl: '', // IC上期换表底数
          mihbljl: '', // 累积购水量
          mihbzbl: '', // 累积追补量
          mizhgssj: '', // 最后购水时间
          mizhgsl: '', // 最后购水量
          miicmemo: '', // 卡表备注
      },
      rules:{},
    };
  },
  mounted() {
    this.getFormPage()    
  },
  watch: {},
  methods: {
    // 数据初始化
    init(val) {
      if (val) {
        this.formData = val;
        this.getFormPage()
      }
    },
   getFormDetail(form){
      this.$set(this,'formData',form)
    },
    getFormData() {
      return this.$refs.dynamicForm.getFormData();
    },
    //动态获取用户信息表单
    getFormPage(){
       let params = {
            "busicode": "UserFieldConfigSelect",
            "data": {pageName:this.wayOpen},
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            res.forEach((v) => {
            if (v.group == "用户-IC卡信息") {
              this.labelStyle = true
              // this.$set()
              this.labelNames = v.group;
              console.log(this.labelNames)
               var tmp = [];
            this.tmpIndex = res;
            tmp.push(this.tmpIndex);
            this.formConfig.itemArr = v.fields;
            console.log(this.formConfig.itemArr)
            }
           
          });
           this.$refs.dynamicForm.init()
          })
    },
    clearForm() {
      this.formData = {
         miicno: '', // IC卡号
          miljfje: '', // IC子表号
          miiccnt: '', // IC累计购买次数
          miicyearcnt: '', // 年次
          miicsl: '', // 累购
          miicusesl: '', // IC累计用量
          miicdisplay: '', // 显示报警量
          miicclosing: '', // 关阀报警量
          miicpurchase: '', // 限购
          miicyd: '', // 采样点
          miicpresl: '', // IC卡维修底数
          miicprehbsl: '', // IC上期换表底数
          mihbljl: '', // 累积购水量
          mihbzbl: '', // 累积追补量
          mizhgssj: '', // 最后购水时间
          mizhgsl: '', // 最后购水量
          miicmemo: '', // 卡表备注
      };
    },
    remoteMethod(query) {
        if (query !== '') {
          let _this = this
          let params = {
            "busicode": "UserGroupList",
            "data": {remote:1,fuzzyQuery:query,page:1,pageCount:10},
          }
          this.$api.fetch({
            params: params,//参数
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
.ICCardInfo {
  height: 100%;
  .formBill{
    .el-form-item__label{
      width: 130px;
    }
  }
}
</style>
