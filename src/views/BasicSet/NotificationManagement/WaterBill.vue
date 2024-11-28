<template>
  <div class="WaterBill">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" icon="el-icon-plus" @click="submitForm()" type="primary">保存</el-button>
      </div>
    </div>
    <div class="water-manage">
      <el-form class="lineForm" :model="formData" size="mini" label-width="200px" label-position = "left">
        <el-form-item class="selectRuleWay" >
          <el-select  v-model="formData.ruleWay" size="mini" placeholder="请选择规格方式">
            <el-option label="开账后" :value="1"></el-option>
            <el-option label="下个月" :value="2"></el-option>
          </el-select>
          

            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" size="mini" v-if="formData.ruleWay===1" v-model.number="formData.ruleValue" placeholder="规则值" onkeyup="value=(value.replace(/\D/g,'')==''?'0':parseInt(value))"></el-input>
            <span v-if="formData.ruleWay===1" style=" font-size: 12px;color: #606266;">天自动发送水费账单</span>
            <span v-if="formData.ruleWay===2" style=" font-size: 12px;color: #606266;">1号自动发送水费账单</span>
        </el-form-item>
        <el-form-item label="通知方式：">
          <el-checkbox-group v-model="noticeWay" @change="noticeWayChange">
            <el-checkbox v-for="v in noticeWayOption" :key="v.id" :label="v.id"  >{{v.lable}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "WaterBill",
  data() { 
    return {
      time: [],
      noticeWay:[],
      formData: {
        ruleWay: "",
        ruleValue: 1,
        noticeWay: "",
        beginTime: "",
        endTime: ""
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
            title: "水费账单精灵",
            method: () => {
              window.histroy.back();
            }
          }
        ]
      }
    };
  },
  mounted() { 
    this.time = [this.common.datetime()  ,this.common.datetime()];
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
        busicode: "WaterChargeElfList",
        data: {}
      };
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          if (res) {
            _this.formData = res;
            _this.$set(this.time, 0, this.formData.beginTime);
            _this.$set(this.time, 1, this.formData.endTime);
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
                  _this.$set(_this.noticeWay,0,realDigits[2])
             }
          }
        });
    },
    noticeWayChange(val){
      console.log(val)
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
      // 点击日期清除按钮time值为null需要处理
      if (this.time === null) {
        this.time = ["", ""];
      }
      this.formData.beginTime = this.time[0];
      this.formData.endTime = this.time[1];
      this.getNoticeWayid();
      if (this.formData.ruleWay === 2) {
        this.formData.ruleValue = 0;
      }
      let params = {
        busicode: "WaterChargeElfSave",
        data: this.formData
      };
      
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
.WaterBill {
  height: 100%;
  .selectRuleWay {
      .el-select {
        width: 120px;
      
    }
  }
  .el-input__inner{
    width: 100%
  }
  .el-form-item__content {
    .el-input--suffix {
      width: 100%;
    }
  }
}
</style>

