<template>
  <div class="engineerFeeAdjustEdit">
    <el-form ref="form" :model="form" :rules="rules" class="formBill form" :inline="true" size="mini" label-width="130px" label-position="right">
      <el-form-item prop="billNo" label="工程编号：" class="disable-item">
        <span>{{form.billNo}}</span>
      </el-form-item>
      <el-form-item prop="billDate" label="申请日期：" class="disable-item">
        <span>{{form.billDate}}</span>
      </el-form-item>
      <br>
        <el-form-item prop="ctmName" label="客户名称：" class="col-2 disable-item">
          <span>{{form.ctmName}}</span>
        </el-form-item>
        <el-form-item prop="ctmAddr" label="客户地址：" class="col-2 disable-item">
          <span>{{form.ctmAddr}}</span>
        </el-form-item>
        <br>
        <el-form-item prop="comments" label="备注：" class="col-2">
          <el-input type="textarea" v-model="form.comments"></el-input>
        </el-form-item>
        <br>
        <el-form-item prop="actuallyReceived" label="预缴金额：" class="disable-item">
          <span>{{form.actuallyReceived}}</span>
        </el-form-item>
        <el-form-item prop="addedMoney" label="已补录金额：" class="disable-item">
          <span>{{form.addedMoney}}</span>
        </el-form-item>
        <br>
        <el-form-item prop="addMoney" label="补录金额：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="form.addMoney"></el-input>
        </el-form-item>
        <el-form-item prop="setmtPayWay" label="交款形式：">
          <el-select v-model="form.setmtPayWay">
            <el-option v-for="item in dictionaryData.BPP" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="chargeDate" label="收款日期：" class="disable-item">
          <span>{{form.chargeDate}}</span>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        id: '',
        billNo: '',
        billDate: '',
        ctmName: '',
        ctmAddr: '',
        comments: '',
        actuallyReceived: '',
        addedMoney: '',
        addMoney: '',
        setmtPayWay: '1',
        chargeDate: ''
      },
      rules: {
        addMoney: [
          {required: true, message: '补录金额不能为空', trigger: 'blur'},
          {pattern: /(^[0-9]+$)|(^[0-9]+[\.]{1}[0-9]{1,2}$)/, message: '请输入正确的金额', trigger: 'blur'},
        ]
      },
      dictionaryData: {}
    }
  },
  created() {
    this.getDictionary()
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init(id) {
      var _this = this
      var params = {
        "busicode": "PjAdjustQuery",
        "data": {id}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        for(const key in res) {
          _this.form[key] = res[key]
        }
        _this.form.chargeDate = this.common.date()
        this.form.id = id
      })
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPP"
        //交款形式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    submit() {
      this.$refs.form.validate(val => {
        if(!val) {
          return
        }
        var _this = this
        var params = {
          "busicode": "PjAdjustAdd",
          "data": {
            id: this.form.id,
            comments: this.form.comments,
            addMoney: this.form.addMoney,
            setmtPayWay: this.form.setmtPayWay
          }
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.$emit('success')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.engineerFeeAdjustEdit {
  .form {
    margin-top: 20px;
  }
  .col-2 {
    width: calc(46% + 10px);
  }
}
</style>