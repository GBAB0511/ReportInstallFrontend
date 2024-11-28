<template>
  <div class="userInfo">
    <!-- <legend class="legendColumn">用户信息</legend> -->
    <legend v-if="labelStyle" class="legendColumn">{{ labelNames }}</legend>
    <dynamic-form :formConfig="formConfig" :checkForm="checkForm" ref="dynamicForm" class="construction-form" :editType="editType" :formData="formData" :openWay="openWay"></dynamic-form>
  </div>
</template>
<script>
import dynamicForm from "@/components/autoForm/dynamicForm"
export default {
  name: "userInfo",
  //edittype=0不可编辑 //wayopen-各模块调用时传值是否显示隐藏该输入框
  props: ["editType", "wayOpen", "addWay"],
  components: {
    dynamicForm
  },
  data () {
    return {
      openWay: 'userInfo',
      editFormData: {},
      labelNames: "",//标题名称
      labelStyle: false,
      adminAreaData: [], //行政区域下拉框
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      loading: false,
      businessAbodeData: [], //营业所下拉框
      businessAreaData: [], //营业区域下拉框
      tradeClassifyData: [], //行业分类
      dictionaryData: [],
      options: [],
      formConfig: {
        itemArr: [
        ],
      },
      checkForm: false,
      formData: {

        userNo: "", //用户编号：
        lockFlag: 0, //锁定状态：
        status: "0", //用户状态：
        statusName: "", //用户状态
        houseCert: "", //房地产编号：
        comments: "", //备注：
        reformFlag: 0, //户表改造标记：
        contractNo: "", //合同编号：
        contractAddr: "", //合同地址：
        contractDate: "", //签订日期：
        adminAreaName: "", //行政区域：
        adminArea: null, //行政区域：
        businessAreaName: "", //营业区域：
        businessArea: "",
        tradeClassifyName: "", //行业分类：
        tradeClassify: "", //行业分类：
        openDate: "", //立户日期：
        stopDate: "", //停用日期：
        stopWaterLinkMan: "",
        stopWaterLinkMobile: "",
        cancelDate: "", //注销日期：
        useTimeLimit: "", //用水期限：
        oldUserNo: "",//旧用户编号
        userGroupNo: "",//用户组编号
        realEstateNo: '',//不动产单元号
        bankCode: '', // 子银行账户
        bankSubAccount: '', // 子银行
        clientContractAddr: "",
        clientContractAddrDetail: "",
        quotaWater: "",
      },
      rules: {
        adminArea: [{ required: true, message: "行政区域不能为空", trigger: 'change' }],
        businessAbode: [{ required: true, message: "营业所不能为空", trigger: 'change' }],
        businessArea: [{ required: true, message: "营业区域不能为空", trigger: 'change' }],
      },
    };
  },
  mounted () {
    this.checkForm = this.addWay
    this.getFormPage()


  },
  watch: {},
  methods: {
    // 数据初始化
    init (val) {
      if (val) {
        this.formData = val;
        if (val.adminArea && val.adminArea instanceof Array && val.adminArea.length === 1)
          this.formData.adminArea = val.adminArea[0]
        // this.selectBAreaOptions(this.formData.businessAbode);
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
      let params = {
        "busicode": "QuickChangeUserInfoQuery",
        "data": { pageName: this.wayOpen },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        const smp = res.forEach((v) => {
          if (v.group === "用户信息") {
            this.labelStyle = true
            this.labelNames = v.group;
            var tmp = [];
            this.tmpIndex = res;
            tmp.push(this.tmpIndex);
            this.formConfig.itemArr = v.fields;
          }
        });
        this.$refs.dynamicForm.init()
      })
    },
    clearForm () {
      this.formData = {
        userNo: "", //用户编号：
        lockFlag: 0, //锁定状态：
        status: "0", //用户状态：
        statusName: "", //用户状态
        houseCert: "", //房地产编号：
        comments: "", //备注：
        reformFlag: 0, //户表改造标记：
        contractNo: "", //合同编号：
        contractAddr: "", //合同地址：
        contractDate: "", //签订日期：
        businessAbodeName: "", //营业所：
        adminAreaName: "", //行政区域：
        adminArea: null, //行政区域：
        businessAreaName: "", //营业区域：
        businessArea: "",
        tradeClassifyName: "0", //行业分类：
        tradeClassify: "", //行业分类：
        openDate: "", //立户日期：
        stopDate: "", //停用日期：
        stopWaterLinkMan: "",
        stopWaterLinkMobile: "",
        cancelDate: "", //注销日期：
        useTimeLimit: "", //用水期限：
        oldUserNo: "",//旧用户编号
        userGroupNo: "",//用户组编号
        clientContractAddr: "",
        clientContractAddrDetail: "",
        quotaWater: "",
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
    changeArea (val) {
      if (this.wayOpen === 'changeMangement') {
        this.$parent.$parent.$parent.$parent.$refs.meterReadInfo.changeArea(val);
        this.$parent.$parent.$parent.$parent.$refs.meterReadInfo.clearBookNo();
      } else {
        this.$parent.$parent.$refs.meterReadInfo.changeArea(val);
        this.$parent.$parent.$refs.meterReadInfo.clearBookNo();
      }
      this.formData.businessAreaName = val.name
    },
    // 数据字典
    dictionaryOptions () {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CUS"
      };
      this.$api
        .fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        })
        .catch(res => {
          this.$set(this, "dictionaryData", []);
        });
    },
    //树结构数据处理
    getArr (data) {
      function abc (arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    //行政区域：
    adminAreaDataOptions () {
      let params = { busicode: "DistrictTree", data: "" };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = this.getArr(res);
          this.$nextTick(() => {
            if (!data.children || data.children.length == 0) {
              delete data.children;
              this.adminAreaData = [JSON.parse(JSON.stringify(data))];
              this.formData.adminArea = [data.id]
            } else {
              this.adminAreaData = JSON.parse(JSON.stringify(data.children));
            }
          })
        })
        .catch(res => {
          this.adminAreaData = [];
        });
    },
    handleCascaderChange () {
      this.$refs.cascader ? this.$refs.cascader.dropDownVisible = false : null
    },
    //行业分类：
    businessAreaDataOptions () {
      let params = { busicode: "TradeClassifySelect", data: "" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.tradeClassifyData = res;
          if (this.formData.tradeClassify === '') {
            this.formData.tradeClassify = res[0].id
          }
        })
        .catch(res => {
          this.businessAreaData = [];
        });
    },
    //营业所：
    tradeClassifyDataOptions () {
      let params = { busicode: "BusinessAbodeSelect", data: "" };
      this.$api
        .fetch({ params })
        .then(res => {
          this.businessAbodeData = res;
        })
        .catch(res => {
          this.businessAbodeData = [];
        });
    },
    changeBAbode (id) {
      //营业区域
      this.selectBAreaOptions(id);
      this.formData.businessArea = null;
    },
    //营业区域
    selectBAreaOptions (id) {
      let _this = this;
      let params = {
        busicode: "BusinessAreaSelect",
        data: { businessAbodeId: id }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.businessAreaData = res;
        });
    }
  }
};
</script>
<style lang="scss">
.userInfo {
  height: 100%;
  .formBill {
    .el-form-item__label {
      width: 130px;
    }
  }
}
</style>
