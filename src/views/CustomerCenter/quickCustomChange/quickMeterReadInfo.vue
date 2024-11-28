<template>
  <div class="meterReadInfo">
      <legend class="legendColumn">用户-抄表信息</legend>
      <el-form
          :model="formData"
          class="formBill"
          size="mini"
          :rules="rules"
          ref="ruleForm"
        >
        <el-form-item label="册本号：" prop="bookNo"  v-show="checkQuickConfig('bookNo')">
          <span  v-if="editType==0">{{formData.bookNo}}</span>
          <!--el-input v-else v-model="formData.bookNo" clearable placeholder=""  @change="CheckBookNo"></el-input-->
          <el-select v-else v-model="formData.bookNo" value-key="bookNo" placeholder=""  clearable @change="changeNo($event)">
            <el-option v-for="(item) in businessAreaOptions" :key="item.bookNo" :label="item.bookNo" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号：" v-show="checkQuickConfig('sortNo')">
          <span  v-if="editType==0">{{formData.sortNo}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else @input="e => input = inputMe(e)" v-model="formData.sortNo" clearable placeholder=""  ></el-input>
        </el-form-item>

        <el-form-item label="抄表周期：" prop="meterReadingCycle" v-show="checkQuickConfig('meterReadingCycle')">
          <span  v-if="editType==0">{{formData.meterReadingCycleName}}</span>
          <el-select v-else v-model="formData.meterReadingCycle"  placeholder=""  clearable >
            <el-option v-for="(item,index) in dictionaryData.RTP" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="最后抄码：" prop="lastReadingNum" >
          <span  v-if="editType==0 || wayOpen==='quickChangeMangement'">{{formData.lastReadingNum}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.lastReadingNum" clearable placeholder=""  ></el-input>
        </el-form-item> -->
      </el-form>
  </div>
</template>
<script>
export default {
  name: "meterReadInfo",
  props: ['editType','wayOpen','quickConfig'],
  components: {
  },
  data() {
    return {
        dictionaryData:[],
        businessAreaOptions:[],//营业区域下的册本号
        formData:{
            // 用户-抄表信息
            bookNo:'',//册本号： 
            sortNo:'',//排序号： 
            lastReadingDate:'',//抄表日： 
            meterReadingCycle:'',//抄表周期： 
            meterReadingCycleName:'', //抄表周期
            // lastReadingNum:'0',//  最后抄码：
        },
        rules:{
          bookNo:[{ required:true, message:"册本号不能为空", trigger: 'change'}],
          meterReadingCycle:[{ required:true, message:"抄表周期不能为空", trigger: 'change'}],
          //lastReadingNum:[{ required:true, message:"最后抄码不能为空", trigger: 'change'}],
        },
    }
  },
  mounted() {
    if(this.editType!=0){
      this.dictionaryOptions()
    }
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
    init(val) {
      if (val) {
        this.formData = val
        this.changeArea();
      }
    },
    changeNo(val){
      this.formData.meterReadingCycle=val.meterReadingCycle;
      this.formData.meterReadingCycleName=val.meterReadingCycleName;
      this.formData.bookNo=val.bookNo;
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
    // 数据字典
    dictionaryOptions() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "RTP"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData",res);
      }).catch(res => {
        this.$set(this, "dictionaryData",[]);
      });
    },
    clearBookNo(){
      this.formData.bookNo='';
    },
    changeArea(val){
      let _this = this;

      if( val){
        let businessArea = val;
        let params = {
          busicode: "BaseBookList",
          data: {"businessArea":businessArea,"page":1,"pageCount":99}
        };
          this.$api.fetch({
            params: params,//参数 
          }).then(res => {
            this.businessAreaOptions = res.list;
          })
        
      }
    }
  },
}
</script>
<style lang="scss">
.meterReadInfo {    
  height: 100%;
  .formBill{
    .el-form-item__label{
      width: 130px;
    }
  }
}
</style>
