<template>
  <div class="meterReadInfo" v-if="(wayOpen !== 'OpenAccount' && wayOpen !== 'PjMeterDetail') || showBookNo">
      <legend class="legendColumn">用户-抄表信息</legend>
      <el-form
          :model="formData"
          class="formBill"
          size="mini"
          :rules="rules"
          ref="ruleForm"
        >
        <el-form-item label="册本号：" prop="bookNo" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0 || wayOpen==='changeMangement'">{{formData.bookNo}}</span>
          <!--el-input v-else v-model="formData.bookNo" clearable placeholder=""  @change="CheckBookNo"></el-input-->
          <el-select v-else v-model="formData.bookNo" value-key="bookNo" filterable placeholder=""  clearable @change="changeNo($event)">
            <el-option v-for="(item, index) in businessAreaOptions" :key="index" :label="item.bookNo" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号：" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0 || wayOpen==='changeMangement'">{{formData.sortNo}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.sortNo" clearable placeholder=""  ></el-input>
        </el-form-item>
        <el-form-item label="最后抄表日期：" v-if="wayOpen=='userInfo'" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0 || wayOpen==='changeMangement'">{{formData.lastReadingDate}}</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.lastReadingDate" clearable placeholder=""  ></el-input>
        </el-form-item>
        <el-form-item label="抄表周期：" prop="meterReadingCycle" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.meterReadingCycleName}}</span>
          <el-select v-else v-model="formData.meterReadingCycle"  placeholder=""  clearable >
            <el-option v-for="item in readCycleOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下次抄表月：" prop="nextMonthid" :class="{'disable-item':editType==0}">
          <span  v-if="editType==0">{{formData.nextMonthid}}</span>
          <el-date-picker v-else v-model="formData.nextMonthid" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择下次抄表月"></el-date-picker>
        </el-form-item>
        <el-form-item  v-if="editType==0" label="三期均量：" prop="threePeriodAvgWater" :class="{'disable-item':editType==0}"> 
          <span  v-if="editType==0">{{formData.threePeriodAvgWater}}</span>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.threePeriodAvgWater" clearable placeholder=""  ></el-input> -->
        </el-form-item>
         <el-form-item  v-if="editType==0" label="最后开账账期：" prop="openAccountLastMonth" :class="{'disable-item':editType==0}">
          <span>{{formData.openAccountLastMonth}}</span>
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.openAccountLastMonth" clearable placeholder=""  ></el-input> -->
        </el-form-item>
         <el-form-item v-if="wayOpen == 'userInfo'" label="抄表员：" prop="meterReadingStaff" class="disable-item">
          <span >{{formData.meterReadingStaff}}</span>        
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
export default {
  name: "meterReadInfo",
  props: ['editType','wayOpen'],
  components: {
  },
  data() {
    return {
        readCycleOption:[],
        businessAreaOptions:[],//营业区域下的册本号
        showBookNo:false,
        formData:{
            bookNo:'',//册本号： 
            sortNo:'',//排序号： 
            lastReadingDate:'',//抄表日： 
            meterReadingCycle:'',//抄表周期： 
            meterReadingCycleName:'', //抄表周期
            threePeriodAvgWater:'',//三期均量
            openAccountLastMonth:'',//最后开账账期
            nextMonthid: '', // 下次抄表月
        },
        rules:{
          bookNo:[{ required:true, message:"册本号不能为空", trigger: 'change'}],
          meterReadingCycle:[{ required:true, message:"抄表周期不能为空", trigger: 'change'}],
          nextMonthid:[{ required:true, message:"下次抄表月不能为空", trigger: 'change'}]
        },
        isInit: false,
    }
  },
  mounted() {
    this.getConfig();
    if(this.editType!=0){
      this.getReadCycleList()
    }
    console.log(this.wayOpen)
  },
  
  watch: {
  },
  methods: {
    // 数据初始化
    init(val) {
      if (val) {
        this.formData = val
        if(typeof this.formData.nextMonthid == 'number' && !isNaN(this.formData.nextMonthid)){
            this.formData.nextMonthid = this.formData.nextMonthid.toString();
        }
        this.isInit = true;
        this.changeArea();
      }
    },
    getConfig(){//获取现金缴存配置
            let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'OPEN_USER_BOOK_NO',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if(res.list.length>0){
            this.showBookNo = res.list[0].configValue==1?true:false;
          }
        })
    },
    changeNo(val){
      this.formData.meterReadingCycle=val.meterReadingCycle;
      this.formData.meterReadingCycleName=val.meterReadingCycleName;
      this.formData.bookNo=val.bookNo;
    },

    // 抄表周期数据
    getReadCycleList () {
      var _this = this
      var params = {
        "busicode": "ReadCycleList",
        "data": {}// 抄表周期
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.readCycleOption = res;
            if(this.wayOpen == 'OpenAccount' && !this.isInit){
          this.formData.meterReadingCycle = res[0].id
         }
         this.isInit = false;
      }).catch(res => {
         _this.readCycleOption = [];
      });
    },

    clearBookNo(){
      this.formData.bookNo='';
    },
    AreaInit(val){
      let _this = this;
        let businessArea = val;
        let params = {
          busicode: "BaseBookList",
          data: {"businessArea":businessArea,"page":-1,"pageCount":99999}
        };
          this.$api.fetch({
            params: params,//参数 
          }).then(res => {
            this.businessAreaOptions = res.list;
          if(this.wayOpen == 'OpenAccount'){
          // this.formData.bookNo = this.businessAreaOptions[0].bookNo
          this.formData.meterReadingCycle = this.readCycleOption[0].id
         }
          })
    },
    changeArea(val, changeCycle){
      let _this = this;
      changeCycle = changeCycle != undefined ? changeCycle : true;
      if( val){
        let businessArea = val;
        let params = {
          busicode: "BaseBookList",
          data: {"businessArea":businessArea,"page":-1,"pageCount":99999}
        };
          this.$api.fetch({
            params: params,//参数 
          }).then(res => {
            this.businessAreaOptions = res.list;
          if(this.wayOpen == 'OpenAccount' && changeCycle){
          this.formData.meterReadingCycle = this.readCycleOption[0].id
         }
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
