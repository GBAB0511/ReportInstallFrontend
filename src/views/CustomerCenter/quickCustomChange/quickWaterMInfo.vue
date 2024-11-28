<template>
  <div class="waterMInfo">
    <!-- <legend class="legendColumn">用户-水表信息</legend> -->
    <legend  v-if="labelStyle" class="legendColumn">{{ labelNames }}</legend>
    <dynamic-form
      :formConfig="formConfig"
      :checkForm="checkForm"
      ref="dynamicForm"
      class="construction-form"
      :editType="editType"
      :formData="readFormData"
      @autoForm="getForm"
    ></dynamic-form>
  </div>
</template>
<script>
import dynamicForm from "@/components/autoForm/dynamicForm";
export default {
  name: "waterMInfo",
  props: ["editType", "wayOpen", "addWay"],
  components: {
    dynamicForm,
  },
  data() {
    return {
      dictionaryData: [],
      formConfig: {
        itemArr: [],
      },
      labelNames: "",//标题名称
      labelStyle:false,//显示隐藏标题样式
      checkForm: false, // 判断是否查询详情/可输入表单
      readDetail: {},
      readFormData: {
        // 用户-水表信息
        meterNo: "", //水表编号：
        setupMeterAddr: "", //装表地址：
        setupMeterLocation: "2", //装表位置：
        setupMeterLocationName: "", //装表位置：
        virtualDesignFormulas: "", //虚拟计算公式：
        meterUse: "1", //水表用途：
        meterUseName: "", //水表用途：
        useWaterObject: "1", //用水对象：
        useWaterObjectName: "", //用水对象：
        setupMeterDate: "", //装表日期：
        changeMeterDate: "", //换表日期：
        splitMeterDate: "", //拆表日期：
        splitMeterWay: "", //拆表类型：
        splitMeterWayName: "", //拆表类型：
        fatherMeterNo: "", //总表编号：
        meterType: "", //水表类型：
        mastarNo: "",
        meterTypeName: "", //水表类型：
        // 用户-水表信息
        factoryNo: "", //水表表身号：
        meterBore: "", //水表口径：
        meterFactoryName: "", //水表厂家：
        meterFactory: "", //水表厂家：
        transmittalModel: "", //传输方式
        meterModelName: "", //水表型号：
        meterModel: "",
        transCommFee: "", //远传通讯费：
        commOperatorName: "", //通讯运营商：
        commFeeStart: "", //通讯费开始日期：
        commFeeEnd: "", //通讯费结束日期：
        meterBoreName: "", //水表口径：
        transmittalModelName: "", //传输方式
        meterSensorName: "", //传感器
        meterSensor: "", ////传感器
        maxValue: "", //"满码值"
        valveControl: "", //是否阀控,
        transmission:"",//是否远程
        protocol: "", //"下行规约"
        meterPattern: "", //水表型式
        shelfLife: "", //"使用期限"
        meterSite:"",//表位
        meterBjwz:"",//表井位置
        meterBjxs:"",//表井形式
        meterSiteName:"",//表位
        meterBjwzName:"",//表井位置
        meterBjxsName:"",//表井形式
      },
      formData: {
        userInfo: {
          // 用户-水表信息
          meterNo: "", //水表编号：
          //setupMeterAddr: "", //装表地址：
          setupMeterLocation: "2", //装表位置：
          setupMeterLocationName: "", //装表位置：
          virtualDesignFormulas: "", //虚拟计算公式：
          meterUse: "1", //水表用途：
          meterUseName: "", //水表用途：
          useWaterObject: "1", //用水对象：
          useWaterObjectName: "", //用水对象：
          setupMeterDate: "", //装表日期：
          changeMeterDate: "", //换表日期：
          splitMeterDate: "", //拆表日期：
          splitMeterWay: "", //拆表类型：
          splitMeterWayName: "", //拆表类型：
          fatherMeterNo: "", //出厂编号：
          meterType: "1", //水表类型：
          mastarNo:"",
          meterTypeName: "",//水表类型：
          meterSite:"",//表位
          meterBjwz:"",//表井位置
          meterBjxs:"",//表井形式
          meterSiteName:"",//表位
          meterBjwzName:"",//表井位置
          meterBjxsName:"",//表井形式
        },

        msInfo: {
          // 用户-水表信息
          factoryNo: "", //水表表身号：
          meterBoreName: "", //水表口径：
          meterFactoryName: "", //水表厂家：
          transmittalModel:"",//传输方式
          meterModelName: "", //水表型号：
          transCommFee: "", //远传通讯费：
          commOperatorName: "", //通讯运营商：
          commFeeStart: "", //通讯费开始日期：
          commFeeEnd: "" //通讯费结束日期：
        }
      },
      rules:{
        userInfo:{
          meterType:[{ required:true, message:"水表类型不能为空", trigger: 'change'}],
          //setupMeterAddr:[{ required:true, message:"装表地址不能为空", trigger: 'blur'}],
          meterUse:[{ required:true, message:"水表用途不能为空", trigger: 'change'}],
          useWaterObject:[{ required:true, message:"用水对象不能为空", trigger: 'change'}],
          meterNo:[],
          setupMeterLocation:[],
          setupMeterDate:[{ required:true, message:"装表日期不能为空", trigger: 'change'}],
        }
      },
      //WaterMeterInquiryForm:{}
    };
  },
  mounted() {
    // console.log(this.editType)
    this.checkForm = this.addWay
    if(this.editType!=0){
      this.dictionaryOptions();
      //this.getFormPage()
    }
    this.init()
    this.setUpBT();
  },

  watch: {},
  methods: {
    // 数据初始化
    init(val) {
      if(val){
        if (val.userInfo) {
          this.formData.userInfo = val.userInfo;
          if(val.userInfo.meterUse==='5'){
            this.$set(this.rules.userInfo,'mastarNo',[{ required:true, message:"主表编号不能为空", trigger: 'blur'}]);
          }
        }
        if (val.msInfo) {
          this.formData.msInfo = val.msInfo;
        }
        this.readFormData = Object.assign(this.formData.userInfo, this.formData.msInfo)
        console.log('ww',this.readFormData)
        this.getFormPage()
      } else {
        this.getFormPage()
      }
    },
    getForm(val){
      this.$refs.dynamicForm.editFormData = val
    },
    getFormData() {
      return this.$refs.dynamicForm.getFormData();
    },
    //动态获取用户信息表单
    getFormPage(){
      console.log('1212112',this.wayOpen)
      let params = {
        "busicode": "QuickChangeUserInfoQuery",
        "data": {pageName:this.wayOpen},
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        const smp = res.forEach((v) => {
          if (v.group == "用户-水表信息") {
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
    //查看详情-回显
    getFormDetail(form){
      this.readDetail = form
      this.$set(this,'readFormData',this.readDetail)
      this.$nextTick(() => {
        this.$refs.dynamicForm.init()
      })
    },
    // handleDetail(val){
    //      console.log('son',val)
    //      this.checkHandleDetail = val
    // },
    // async getMeterData(id) {
    //   try {
    //         // 水表型号查出的信息
    //     const resData = await this.$api.fetch({
    //       params: { busicode: "MeterModelQuery", data: {  id: id }},
    //     })
    //     this.WaterMeterInquiryForm = resData
    //   }catch(e) {
    //     console.log(e)
    //   }
    // },
    setUpBT(){
      if(this.wayOpen==='changeMangement'){
        //this.rules.userInfo.meterNo.push({ required:true, message:"水表编号不能为空", trigger: 'blur'});
        //this.$set(this.rules.userInfo,'meterNo',[{ required:true, message:"水表编号不能为空", trigger: 'blur'}]);
      }else if(this.wayOpen==='OpenAccount'){
        this.rules.userInfo.meterNo.push({ required:true, message:"水表编号不能为空", trigger: 'blur'});
        //this.rules.userInfo.setupMeterLocation.push({ required:true, message:"装表位置不能为空", trigger: 'change'});
        //this.$set(this.rules.userInfo,'meterNo',[{ required:true, message:"水表编号不能为空", trigger: 'blur'}]);
        //this.$set(this.rules.userInfo,'setupMeterLocation',[{ required:true, message:"装表位置不能为空", trigger: 'change'}]);
      }
    },
    LocationChange(){
      this.$refs.ruleForm.validateField('userInfo.setupMeterLocation');
    },
    // 数据字典
    dictionaryOptions() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "WMT,CMC,UWS,MRM,CTL"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData",res);
      }).catch(res => {
        this.$set(this, "dictionaryData",[]);
      });
    },

    async mTypeChange(val) {
      try {
        let arr = [];
        // 水表信息
        let MsInfoListParams = {
          busicode: "MsInfoList",
          data: {
            page: 1,
            pageCount: 20,
            meterNo: val,
            // factoryNo:res.userInfo.fatherMeterNo,
            meterStatus: "1"
          }
        };
        if(val.length>0){
          arr = await this.$api.fetch({ params: MsInfoListParams });
          if (arr.list.length == 0) {
            this.$notify({
              title: "警告",
              message: "无该水表信息或非在库状态",
              type: "warning"
            });
            this.formData.userInfo.meterNo = "";
            this.formData.msInfo = {
              factoryNo: "", //水表表身号：
              meterBoreName: '', //水表口径
              meterFactoryName: '', //水表厂家
              transmittalModel:'',//传输方式
              meterModelName: '', //水表型号
              transCommFee: '', //远传通讯费
              commOperatorName: '', //通讯运营商
              commFeeStart: '', //通讯费开始日期
              commFeeEnd: '' //通讯费结束日期
            };
          } else {
            this.formData.msInfo = { ...arr.list[0], };
            if(val.msInfo.meterModel && val.msInfo.meterModel != '') {
              this.getMeterData(val.msInfo.meterModel)
            }
          }
        }else{
          this.formData.userInfo.meterNo = "";
          this.formData.msInfo = {
            factoryNo: "", //水表表身号：
            meterBoreName: '', //水表口径
            meterFactoryName: '', //水表厂家
            transmittalModel:'',//传输方式
            meterModelName: '', //水表型号
            transCommFee: '', //远传通讯费
            commOperatorName: '', //通讯运营商
            commFeeStart: '', //通讯费开始日期
            commFeeEnd: '' //通讯费结束日期
          };
        }
        this.$refs.ruleForm.validateField('userInfo.meterNo');
      } catch (e) {
      }
    },
    meterUseChanged(){
      if(this.formData.userInfo.meterUse==='5'){
        this.$set(this.rules.userInfo,'mastarNo',[{ required:true, message:"主表编号不能为空", trigger: 'blur'}])
      }else{
        this.formData.userInfo.mastarNo="";
        this.$delete(this.rules.userInfo,'mastarNo')
      }
    },
    CheckmastarNo(){
      let _this = this;
      let list = [{fieldName: "a.user_no", operator: "=", logicalValue: "AND", queryValue: this.formData.userInfo.mastarNo}];
      let params = {
        busicode: "UserInfoList",
        data: {"list":list}
      };
      if(this.formData.userInfo.mastarNo.length>0){
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          if(res.list.length===0){
            this.formData.userInfo.mastarNo="";
            this.$refs.ruleForm.validateField('userInfo.mastarNo');
            this.$notify({
              title: "警告",
              message: "主表编号不符合要求，请检查",
              type: "warning"
            });
          }
        })
      }else{
        this.$refs.ruleForm.validateField('userInfo.mastarNo');
      }
    },
  }
};
</script>
<style lang="scss">
.waterMInfo {
  height: 100%;
  .formBill{
    .el-form-item__label{
      width: 130px;
    }
  }
}
</style>
