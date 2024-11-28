<template>
  <div class="CouponExpiration">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" icon="el-icon-plus" @click="submitForm()" type="primary">保存</el-button>
      </div>
    </div>
    <div class="water-manage">
      <el-form class="lineForm" :model="formData" size="mini" label-width="100px" label-position="left">
        <el-form-item class="selectRuleWay" >
          <span style="font-size: 12px;color: #606266;">优惠到期前</span>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" size="mini" v-model.number="formData.daysBeforeExpiration" onkeyup="value=(value.replace(/\D/g,'')==''?'0':parseInt(value))"></el-input>
          <span style="font-size: 12px;color: #606266;">天自动发送到期提醒</span>
        </el-form-item>
        <el-form-item label="通知方式：">
          <el-checkbox-group v-model="noticeWay" @change="noticeWayChange">
            <el-checkbox v-for="v in noticeWayOption" :key="v.id" :label="v.id">{{v.lable}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "CouponExpiration",
  data() { 
    return {
      noticeWay:[],
      formData: {
        daysBeforeExpiration: '',
        noticeWay: "",
      },
      noticeWayOption: [
        {
          id: 1,
          lable: "微信"

        },
        {
          id: 2,
          lable: "短信"
        },
       {
          id: 3,
          lable: "微信优先"
        }
      ],
      crumbsData: {
        //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessArea' },
          {
            title: "水精灵管理",
            method: () => {
              window.histroy.back();
            }
          },
          {
            title: "优惠到期提醒",
            method: () => {
              window.histroy.back();
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.init();
    // 侧边栏
    eventBus.$emit("asideMenuShow", "basicsMenuShow5");
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    
    init() {
      let _this = this;
      let params = {
        busicode: "CouponExpirationReminderQuery",
        data: {}
      };
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          if (res && res !== '') {
            _this.formData = res;
            var digits = _this.formData.noticeWay.toString().split('');
            var realDigits = digits.map(Number)
            if(digits.length == 1){
               _this.$set(_this.noticeWay,0,realDigits[0])
            } else if(digits.length == 2) {
               _this.$set(_this.noticeWay,0,realDigits[0])
               _this.$set(_this.noticeWay,realDigits[0],realDigits[1])
            } else if(digits.length > 2) {
               _this.$set(_this.noticeWay,0,realDigits[0])
               _this.$set(_this.noticeWay,realDigits[0],realDigits[1])
               _this.$set(_this.noticeWay,realDigits[1],realDigits[2])
             }
          }
        });
    },
    noticeWayChange(val){
      let currval = val[val.length - 1];//当前改变的选项
      if(currval == 3){
        this.noticeWay = [3];
      }else {
        if( this.noticeWay.indexOf(3)>-1){ //如果选了微信优先去除微信优先
           this.noticeWay.splice(this.noticeWay.indexOf(3),1);
        }
      }
       this.noticeWay = this.noticeWay.sort(function (a, b) { return a - b })
    },
    getNoticeWayid(){
      let notice="";
      this.noticeWay.forEach(function (item, index) {
          notice+=item+"";
      });
      this.formData.noticeWay=notice;
    },
    //保存按钮
    submitForm() {
      this.getNoticeWayid();
      let params = {
        busicode: "CouponExpirationReminderSave",
        data: this.formData
      };
      
      if(this.formData.noticeWay.length===0){
        this.$message({
            showClose: true,
            message: "通知方式不能为空",
            type: "warning"
          });
        return false;
      }
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          });
          this.formData ={};
          this.init();
        });
    }
  },
  watch: {

  }
};
</script>
<style lang="scss">
.CouponExpiration {
  height: 100%;
  .selectRuleWay {
      .el-select {
        width: 120px;
      
    }
  }
  .el-input__inner{
    width: 100% !important;
  }
  .el-form-item__content {
    .el-input--suffix {
      width: 100%;
    }
  }
}
</style>

