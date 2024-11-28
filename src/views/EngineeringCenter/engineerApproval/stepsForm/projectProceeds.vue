<template>
  <div class="projectProceeds">
    <legend class="legendColumn">工程收款</legend>
    <el-form ref="form" :model="form" :rules="rules" class="formBill" :inline="true" size="mini" label-width="130px" label-position="right" :disabled="disabled">
      <el-form-item prop="budgetMoney" label="预算金额：" class="disable-item">
        <span >{{form.budgetMoney}}</span>
      </el-form-item>
      <el-form-item prop="depositMoney" label="押金：" class="disable-item">
        <span>{{form.depositMoney}}</span>
      </el-form-item>
      <el-form-item label="应收合计：" class="disable-item">
        <span>{{form.budgetTotal}}</span>
      </el-form-item>
      <br>
      <el-form-item prop="budgetPayWay" label="预缴方式：" :class="{'disable-item': disabled}">
        <el-select v-if="!disabled" v-model="form.budgetPayWay">
          <el-option v-for="item in dict.BPP" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{form.budgetPayWayName}}</span>
      </el-form-item>
      <el-form-item prop="actuallyReceived" label="预缴款：" :class="{'disable-item': disabled}">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabled" v-model="form.actuallyReceived"></el-input>
        <span v-else>{{form.actuallyReceived}}</span>
      </el-form-item>
      <br>
      <el-form-item prop="budgetComments" label="预缴说明：" class="col-2" :class="{'disable-item': disabled}">
        <el-input v-if="!disabled" type="textarea" v-model="form.budgetComments"></el-input>
        <span v-else>{{form.budgetComments}}</span>
      </el-form-item>      
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['dict', 'editData', 'disabled'],
  data() {
    return {
      form: {
        budgetMoney: '',
        depositMoney: '',
        actuallyReceived: '',
        budgetComments: '',
        budgetPayWay: ''
      },
      rules: {

      }
    }
  },
  created() {
    if(this.editData) {
      this.form = {...this.editData}
      this.form.budgetTotal = Number(this.form.budgetMoney) + Number(this.form.depositMoney) 
      this.form.actuallyReceived = this.form.actuallyReceived && this.form.actuallyReceived.length > 0 ? this.form.actuallyReceived : this.form.budgetTotal
    }
  },
  watch: {
    editData(val) {
      if(val) {
        this.form = {...val}
        this.form.budgetTotal = Number(this.form.budgetMoney) + Number(this.form.depositMoney) 
        this.form.actuallyReceived = this.form.actuallyReceived && this.form.actuallyReceived.length > 0 ? this.form.actuallyReceived : this.form.budgetTotal
      }
    }
  },
  methods:{
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
  }
}
</script>

<style lang="scss" scoped>
.projectProceeds {
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>