<template>
  <div class="WeekdaySetEdit">
    <div class="backfillSubmitForm">
      <el-form ref="WeekdaySetEditForm" class="formBill-One" :rules="rules" :inline="true" size="mini" :model="formData" label-width="120px">
        <el-form-item label="工作日名称：" prop="weekdayName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" @input="e => input = inputMe(e)" v-model="formData.weekdayName" clearable placeholder="请输入工作日名称" maxlength="50">
          </el-input>
        </el-form-item>
        <el-form-item label="工作日月份：" prop="months">
          <el-select v-model="formData.months" multiple placeholder="请选择工作日月份" clearable>
            <span slot="prefix" v-if="showWorkMonth!=''">{{showWorkMonth}}</span>
            <el-option v-for="item in workMonthOption" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{item.label}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上午工作时间：" required>
          <el-time-picker style="width:200px !important;" v-model="formData.morningBeginDate" :clearable="false"
            placeholder="请选择" @change="changeDate" format="HH:mm" value-format="HH:mm"
            :picker-options="{selectableRange: selectableRangeBeginMorning}">
          </el-time-picker>
          <span>至</span>
          <el-time-picker style="width:200px !important;" v-model="formData.morningEndDate" :clearable="false"
            placeholder="请选择" @change="changeDate" format="HH:mm" value-format="HH:mm"
            :picker-options="{selectableRange: selectableRangeEndMorning}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下午工作时间：" required>
          <el-time-picker style="width:200px !important;" v-model="formData.afternoonBeginDate" :clearable="false"
            placeholder="请选择" @change="changeDate" format="HH:mm" value-format="HH:mm" 
            :picker-options="{selectableRange: selectableRangeBeginAfternoon}">
          </el-time-picker>
          <span>至</span>
          <el-time-picker style="width:200px !important;" v-model="formData.afternoonEndDate" :clearable="false"
            placeholder="请选择" @change="changeDate" format="HH:mm" value-format="HH:mm" 
            :picker-options="{selectableRange: selectableRangeEndAfternoon}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="工作日说明：">
          <el-input v-model="formData.comment" show-word-limit maxlength="100" clearable
            type="textarea" placeholder="请输入工作日说明">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name:"WeekdaySetEdit",
  data(){
    return{
      formData: {
        id: "",
        weekdayName: "",
        months: [],
        morningBeginDate: "09:00",
        morningEndDate: "12:00",
        afternoonBeginDate: "14:00",
        afternoonEndDate: "18:00",
        comment: "",
      },
      rules: {
        weekdayName: [
          {required: true, message: '请输入工作日名称', trigger: 'blur' }
        ],
        months: [
          {required: true, message: '请输入工作日月份', trigger: ['blur', 'change'] }
        ],
      },
      workMonthOption: [],//工作月份数据
      selectableRangeBeginMorning: ['00:00:00 - 12:00:00'],//上午的工作时间的范围
      selectableRangeEndMorning: ['9:00:00 - 14:00:00'],//上午的工作时间的范围
      selectableRangeBeginAfternoon: ['12:00:00 - 18:00:00'],//下午的工作时间的范围
      selectableRangeEndAfternoon: ['14:00:00 - 23:59:00'],//下午的工作时间的范围
    }
  },
  mounted(){
    this.getWorkMonthOption();
    this.editData(this.$parent.rowData);
  },
  computed: {
    showWorkMonth() {
      return this.workMonthOption && this.workMonthOption.filter(item => this.formData.months.includes(item.value)).map(item => item.label).join(', ');
    }
  },
  methods: {
    inputMe(e){
      let str=e.replace(/\ +/g,"");
      str = str.replace(/[\r\n]/g,"");
      return str;
    },
    //保存按钮
    resetForm() {
      this.$refs.WeekdaySetEditForm.resetFields();
    },
    changeDate(){
      // 时间选择的限制范围
      this.selectableRangeBeginMorning = ['00:00:00 -' + this.formData.morningEndDate + ':00'];
      this.selectableRangeEndMorning = [this.formData.morningBeginDate + ':00' + ' -' + this.formData.afternoonBeginDate + ':00'];
      this.selectableRangeBeginAfternoon = [this.formData.morningEndDate + ':00' + ' -' + this.formData.afternoonEndDate + ':00'];
      this.selectableRangeEndAfternoon = [this.formData.afternoonBeginDate + ':00' +' - 23:59:00'];
    },
    getWorkMonthOption(){
      for(let i = 1;i <= 12; i++){
        this.workMonthOption.push({
          value: i,
          label: this.mdToChinese(i - 1) + "月",//转成中文的月份
        })
      }
    },
    mdToChinese(number) {
      var chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十','十一','十二'];
      return chineseNumbers[number];
    },
    submitForm(type) {
      let _this = this;
      let params = {};
      this.$refs.WeekdaySetEditForm.validate((valid) => {
        if (valid) {
          if(type === 'PjWeekdayConfigurationAdd'){
            params = {
              "busicode": "PjWeekdayConfigurationAdd",
              "data": this.formData
            }
          }else{
            params = {
              "busicode": "PjWeekdayConfigurationAdd",
              "data": this.formData
            };
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            _this.$message({
              showClose:true,
              message:'保存成功',
              type:'success',
            });
            _this.$parent.init();
            _this.$parent.closeDialog();
            this.formData.morningWorkingHours = []; 
            this.formData.afternoonWorkingHours = [];  
          });
        } else {
          _this.$message({
            showClose: true,
            message:'数据未填写完整！',
            type:'error',
          });
          return
        }
      })
    },
    handleClose() {
      this.common.chargeObjectEqual(this, this.formData, 'get', 'WeekdaySetEdit', this.$parent.closeDialog);
    },
    editData(val){
      if(val !== 'add'){
        this.formData = JSON.parse(JSON.stringify(val));
        this.changeDate();
      }
    }
  },
}
</script>
<style lang="scss">
.WeekdaySetEdit {
  width: 100%;
  height: 100%;
  .backfillSubmitForm{    
    height: calc(100% - 41px);
    width: 60%;
    margin: 0 auto;
    overflow-y:hidden;
    overflow-x:hidden;
    .formBill-One .el-form-item .el-form-item__content{
      width:calc(95% - 100px); 
    }
  }
}
</style>


