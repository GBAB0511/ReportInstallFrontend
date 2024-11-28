<template>
  <div class="reconnaissance">
    <legend class="legendColumn">施工勘察</legend>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="formBill"
      :inline="true"
      size="mini"
      label-width="130px"
      label-position="right"
      :disabled="disabled"
    >

  <!-- <el-form-item prop="meterNum" label="装表个数：" :class="{'disable-item': disabled}">
    <span v-if="disabled">{{form.meterNum}}</span>
    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" type="number" min="0" @input="e => input = inputMe(e)" v-else v-model="form.meterNum"></el-input>
  </el-form-item>
  <el-form-item  prop="meterBore" label="水表口径：" :class="{'disable-item': disabled}">
    <span v-if="disabled">{{form.meterBoreName}}</span>
    <el-select  v-else v-model="form.meterBore">
      <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
    </el-select>
  </el-form-item> -->
    <el-form-item
    prop="redLineConstruction"
    label="红线外施工："
    class="col-2"
    :class="{'disable-item': disabled}"
  >
    <span v-if="disabled">{{form.redLineConstructionName}}</span>
    <el-radio-group v-else v-model="form.redLineConstruction">
      <el-radio style="float:left" :label="1">需要</el-radio>
      <el-radio style="float:left" :label="0">不需要</el-radio>
    </el-radio-group>
  </el-form-item>
      


  <el-form-item
    prop="surveyDate"
    label="勘察日期："
    :class="{'disable-item': disabled}"
  >
    <span v-if="disabled">{{form.surveyDate}}</span>
    <el-date-picker v-else v-model="form.surveyDate" value-format="yyyy-MM-dd"></el-date-picker>
  </el-form-item>

  <el-form-item
        prop="beforeMeterLength"
        label="表前管长（米）："
        :class="{'disable-item': disabled}"
      >
        <span v-if="disabled">{{form.beforeMeterLength}}</span>
        <el-input
          v-else
          v-model="form.beforeMeterLength"
          @input="e => input = inputMe(e)"
          oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[^0-9.]/g,'')"
        ></el-input>
      </el-form-item><el-form-item
    prop="surveyResult"
    label="勘察结论："
    class="col-2"
    :class="{'disable-item': disabled}"
  >
    <span v-if="disabled">{{form.surveyResult}}</span>
    <el-input v-else type="textarea" v-model="form.surveyResult"></el-input>
  </el-form-item>

  

  <el-form-item class="col-2" >
    <div slot="label">&nbsp;&nbsp;&nbsp;&nbsp;</div>
    <el-checkbox v-model="form.workFlag">满足施工条件</el-checkbox>
    <el-checkbox v-model="form.designFlag">需要设计</el-checkbox>
    <el-checkbox v-model="form.branchRoadFlag">需要办破路手续</el-checkbox>
    <el-checkbox v-model="form.exceedHigh">超高标</el-checkbox>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
export default {
  props: ['editData', 'disabled'],
  data() {
    return {
      form: {
        beforeMeterLength: '',
        surveyResult: '',
        workFlag: true,
        designFlag: true,
        branchRoadFlag: false,
        exceedHigh: false,
        surveyDate: '',
        redLineConstruction:'',
        redLineConstructionName:'',
        meterNum: "",
        meterBore: "",
        meterBoreName: "",
      },
      rules: {
        surveyResult: [{ required: true, message: '勘察结论不能为空', trigger: 'blur' }],
        surveyDate: [{ required: true, message: '勘察日期不能为空', trigger: 'change' }],
        redLineConstruction: [{ required: true, message: '红线外施工未选择', trigger: 'change' }],
        meterNum: [{ required: true, message: '装表个数不能为空', trigger: ['blur','change'] }],
      },
      meterBoreData: [],
    }
  },
  created() {
    console.log(this.editData);
    if(this.editData){
      this.form = {...this.editData, workFlag: !!this.editData.workFlag, designFlag: !!this.editData.designFlag, branchRoadFlag: !!this.editData.branchRoadFlag, exceedHigh: !!this.editData.exceedHigh,}
    }
  },
  mounted(){
    this.getMeterBore();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
      // 水表口径下拉数据
    getMeterBore () {
      var _this = this
      var params = {
        "busicode": "MeterBoreList",
        "data": { page: 1, pageCount: 999 }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterBoreData = res.list
      })
    },
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val, workFlag: !!val.workFlag, designFlag: !!val.designFlag, branchRoadFlag: !!val.branchRoadFlag, exceedHigh: !!val.exceedHigh,}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reconnaissance {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>
