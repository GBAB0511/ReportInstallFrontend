<template>
  <!--
  选择用户
  用此页面
-->
  <div class="userInfoChangeEdit">
       <el-form size="mini" :model="userInfoForm" label-width="110px"
       label-position="right"
       :inline="true"
        ref="userInfoForm">

        <el-form-item label="用户名称：" prop="ctmName" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userInfoForm.ctmName" clearable size="mini"></el-input>
        </el-form-item>

        <el-form-item label="证件号码：" prop="certNo" class="width-250">
          <el-input  @input="validateNum1()"  v-model="userInfoForm.certNo" clearable size="mini"></el-input>
        </el-form-item>

         <el-form-item label="手机号码：" prop="mobile" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userInfoForm.mobile" clearable size="mini"></el-input>
        </el-form-item>

          <el-form-item label="不动产登记号：" prop="realEstateNo" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userInfoForm.realEstateNo" clearable size="mini"></el-input>
        </el-form-item>
          <el-form-item label="用户地址：" prop="ctmAddr" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userInfoForm.ctmAddr" clearable size="mini"></el-input>
        </el-form-item>

       <el-form-item label="水表厂家："  class="width-250">
            <el-select clearable v-model="userInfoForm.meterFactory" placeholder="水表厂家">
              <el-option key="" value="" label="全部"></el-option>
              <el-option v-for="item in meterFactoryData.list" :key="item.id" :label="item.factoryName" :value="item.factoryName"></el-option>
            </el-select>
          </el-form-item>
      <el-form-item label="用户备注：" prop="comments" class="width-250">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   @input="e => input = inputMe(e)" v-model="userInfoForm.comments" clearable size="mini"></el-input>
        </el-form-item>

      <el-form-item label="采样点："  class="width-250">
        <el-select clearable v-model="userInfoForm.miiccyd" placeholder="请选择">
          <el-option value="0.1" label="0.1"></el-option>
          <el-option value="1" label="1"></el-option>
        </el-select>
      </el-form-item>

      </el-form>
      
    <!-- <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitUserChangeForm">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeUserChangeDialog">取 消</el-button>
      </div> -->
  </div>
</template>
<script>

export default {
  name: "userInfoChangeEdit",
  props: ["listData", "formDataUserNo"],
  data() {
    return {
              // 水表厂家下拉框数据
         meterFactoryData: [],
         showBillVisible:true,//修改开票资料
         billVisibleName:'客户变更',
         userInfoForm:{
            ctmName: "",
            userNo:"",
            certNo: "",//
            mobile: "",
            realEstateNo: "",
            ctmAddr: "",
            meterFactory: "",
            comments:"",
            miiccyd:"",
      },
    };
  },
  mounted() {
      this.listData.forEach( v =>{
        if(v.userNo == this.formDataUserNo){
          this.listData = v
        }
      })
      console.log(this.listData);
      this.getMeterFactory()
     for (var i in this.listData) {
        for (var j in this.userInfoForm) {
          if (i == j) {
            this.userInfoForm[i] = this.listData[j];
          }
        }
      }
      this.userInfoForm.ctmName = this.listData.userName
      // this.userInfoForm.ctmAddr = this.listData[0].userAddr
      console.log(this.userInfoForm);
      console.log(this.listData);
      this.userInfoForm.miiccyd = this.listData.samplingPlace
  },
  methods: {
    
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        // 水表厂家下拉数据
    getMeterFactory() {
      var _this = this
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 100
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterFactoryData = res
      })
    },
    // 输入银行卡号
    validateNum1 () {
      this.setNum1(this.userInfoForm)
    },
    // 设置银行卡号,每四位添加一个空格
    setNum1 (data) {
      data.certNo = data.certNo.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.$set(data, 'certNo', data.certNo)
    },
   closeBillDialog(){
     this.showBillVisible = false
    },
    submitUserChangeForm(){

    },
    closeUserChangeDialog(){
     this.showBillVisible = false
    },

  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>

<style lang="scss">
.userInfoChangeEdit {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.pageDisableStyle {
  color: #C0C4CC;
}
  .pageBlock {
    text-align: center
  }
</style>
