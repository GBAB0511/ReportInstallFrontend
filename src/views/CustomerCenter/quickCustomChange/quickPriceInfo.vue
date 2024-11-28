<template>
  <div class="priceInfo">
    <legend class="legendColumn">用户-价格信息</legend>
    <el-form :model="formData" class="formBill" size="mini" :rules="rules" ref="ruleForm">
      
      <el-form-item label="优惠策略：" v-show="checkQuickConfig('prefStrategyId')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefStrategyName}}</span>
        <el-select v-else v-model="formData.prefStrategyId" placeholder="" clearable @change="changePrefStrategyId">
          <el-option v-for="(item,index) in prefStrategyData" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠证件号码：" prop="prefCertNo" v-show="checkQuickConfig('prefCertNo')" style="width: calc(46% + 10px)" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefCertNo}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-else v-model="formData.prefCertNo" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="优惠策略开始日期：" prop="prefBeginDate" v-show="checkQuickConfig('prefBeginDate')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefBeginDate}}</span>
        <el-date-picker v-else :picker-options="pickerOptions" v-model="formData.prefBeginDate" value-format='yyyy-MM-dd' type="date" placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠策略结束日期：" prop="prefEndDate" v-show="checkQuickConfig('prefEndDate')" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefEndDate}}</span>
        <el-date-picker v-else :picker-options="pickerOptions1" v-model="formData.prefEndDate" value-format='yyyy-MM-dd' type="date" placeholder="">
        </el-date-picker>
      </el-form-item>

     
    </el-form>
  </div>
</template>
<script>
export default {
  name: "priceInfo",
  components: {
  },
  props: ['editType', 'wayOpen', 'idCuster','quickConfig'],
  data() {
    var _this = this
    return {
      rules: {
        useWaterType: [{ required: true, message: "用水类型不能为空", trigger: 'change' }],
        prefBeginDate: [{ required: false, message: "优惠策略开始日期不能为空", trigger: 'change' }],
        prefEndDate: [{ required: false, message: "优惠策略结束日期不能为空", trigger: 'change' }],
      },
      userNo: "",

      EditVisible: false,
      dictionaryData: [],
      prefStrategyData: [],
      waterTypeData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      formData: {
        // 用户-价格信息
        useWaterTypeName: '',//用水类型： 
        useWaterType: '',
        prefStrategyName: '',//优惠策略： 
        prefStrategyId: '',
        prefCertNo: '',//优惠证件号码： 
        prefBeginDate: '',//优惠策略开始日期：
        prefEndDate: '',//优惠策略结束日期： 
        ladderPersonNum: '4',//用水人口： 
      },
   


      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          if (_this.formData.prefEndDate) {// 策略开始日期小于策略结束日期
            let d = new Date(_this.formData.prefEndDate)
            return time.getTime() > d.getTime()
          }
        }
      },
      // 日期选择器
      pickerOptions1: {
        disabledDate(time) {
          if (_this.formData.prefBeginDate) {// 策略结束日期大于策略开始日期
            let d = new Date(_this.formData.prefBeginDate)
            return time.getTime() < d.getTime()
          }
        }
      },
    }
  },
  mounted() {
    if (this.idCuster) {
      // 详情时主动获取用水人口列表数据
      this.wPopulationInit()
    }
    if (this.editType != 0) {
      this.dictionaryOptions()
      this.prefStrategyDataOptions()
      this.waterTypeDataOption()
    }
    eventBus.$on('userNo', (userNo) => {
      this.userNo = userNo
    })
  },
  beforeDestroy() {
    eventBus.$off('userNo')
  },
  watch: {
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 数据初始化
    init(val) {
      if (val) {
        this.formData = val
        if (val.prefStrategyId.length > 0) {
          this.changePrefStrategyId(val.prefStrategyId);
        }
      }
    },
    changePrefStrategyId(val) {
      if (val.length > 0) {
        this.rules.prefBeginDate[0].required = true;
        this.rules.prefEndDate[0].required = true;
      } else {
        this.rules.prefBeginDate[0].required = false;
        this.rules.prefEndDate[0].required = false;
        this.$refs['ruleForm'].clearValidate();
      }

    },
    // 数据字典
    dictionaryOptions() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BWT"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    //优惠策略
    prefStrategyDataOptions() {
      let params = { busicode: "PrefStrategySelect", data: "" };
      this.$api.fetch({ params }).then(res => {
        this.prefStrategyData = res;
      }).catch(res => {
        this.prefStrategyData = [];
      });
    },
     checkQuickConfig(val) {
      let config = 0
      if(this.quickConfig!=null && this.quickConfig.length> 0) {
          this.quickConfig.forEach(item=> {
              if(item == val) {
                  config = 1
              }               
          })
      }else
        return false
      if(config == 1) 
        return true
      else
        return false
    },
    waterTypeChange(val) {
      console.log(val)
      let value = this.common.handleTreeData(val)
      if (value == '6')
        this.userMixtureFlag = true
      else
        this.userMixtureFlag = false
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
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
    //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree",
      };
      this.$api.fetch({ params })
        .then(res => {
          let data = this.getArr(res)
          this.$set(this, "waterTypeData", data.children);
        }).catch(res => {
          this.$set(this, "waterTypeData", []);
        });
    },
   
  

  },
}
</script>
<style lang="scss">
.priceInfo {
  height: 100%;
  .formBill {
    .el-form-item__label {
      width: 130px;
    }
  }
  .el-button--primary:focus,
  .el-button--primary {
    background-color: #409eff !important;
    color: #fff !important;
  }
}
</style>
