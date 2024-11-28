<template>
  <div class="ShortMessage">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" icon="el-icon-refresh" @click="init()" class="searchBtn" type="primary">刷新</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="submitForm()" type="primary">保存</el-button>
      </div>
    </div>
    <div class="ShortMessageEdit">
      <div class="ShortMessageEditForm">
        <el-form class="backfillSubmitForm" :inline="true" :model="ruleForm" label-width="40px" ref="ruleForm" :rules="rules">
          <div v-for="(item, index) in tableData" :key="index">
            <legend class="common-legend">{{item.phraseName}}</legend>
            <el-row>
              <el-col :span="12">
                <el-form-item style="width: 100%;" label=" " :prop="item.phraseNo">
                  <el-input type="textarea" :rows="6" v-model="ruleForm[item.phraseNo]" placeholder="" :id="item.phraseNo" @focus="e => selectInput(e, item)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :ref="item.phraseNo" label="可定制内容:"  label-width="100px" class="Btngroup" style="visibility: hidden">
                  <template v-for='(col) in btnList'>
                    <el-button type="primary" size="mini" @click="makeActive(col)" :key="col">
                      {{col}}
                    </el-button>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- <el-button type="primary" size="mini" @click="makeActive('[userNo]')" round>用户编号:userNo</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[userName]')" round>用户名称:userName</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[userAddr]')" round>用户地址:userAddr</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[period]')" round>账期:period</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[userBalance]')" round>用户余额:userBalance</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[billAmount]')" round>账单金额:billAmount</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[meterNo]')" round>水表编号:meterNo</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[arrearNoPenalty]')" round>欠费合计(不含违约金):arrearNoPenalty</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[arrearHasPenalty]')" round>欠费合计(含违约金):arrearHasPenalty</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[Penalty]')" round>违约金:Penalty</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[CurrenDate]')" round>当前日期:CurrenDate</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[waterRate]')" round>水费:waterRate</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[sewageRate]')" round>污水费:sewageRate</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[garbageRate]')" round>垃圾费:garbageRate</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[lastIssueStopCode]')" round>上期止码:lastIssueStopCode</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[thisIssueStopCode]')" round>本期止码:thisIssueStopCode</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[monthRate]')" round>欠费月份:monthRate</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[hotline]')" round>客服热线:hotline</el-button>
            <el-button type="primary" size="mini" @click="makeActive('[payLink]')" round>支付链接:payLink</el-button> -->
          <!-- </el-form-item> -->
        </el-form>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "ShortMessage",
  // components: {
  // },
  data () {
    return {
      // ruleForm: {
      //   waterBill: "尊敬的[用户名称],您[账期]的账单金额为[账单金额]，最后缴费日期[最后缴费日期]，请及时缴费",
      //   oweFee: "尊敬的[用户名称],您当前欠费合计[欠费合计（含违约金）],其中违约金[违约金]，请及时缴费",
      //   payFee: "尊敬的[用户名称],您于[缴费日期]日成功缴费[缴费金额]元，感谢您的支持",
      // },
      jfDialog: false,
      sfDialog: false,
      qfDialog: false,
      fDialog: false,
      yhDialog: false,
      ztDialog: false,
      btnAllList: [],
      btnList: [
      ],
      ruleForm: {
      },
      tableData: [],
      formData: [],
      rules: {
        // waterBill: [
        //   { required: true, message: '请输入水费账单模板', trigger: 'blur' },
        // ],
        // oweFee: [
        //   { required: true, message: '请输入欠费催缴模板', trigger: 'blur' },
        // ],
        // payFee: [
        //   { required: true, message: '请输入缴费通知模板', trigger: 'blur' },
        // ],
        // couponExiration: [
        //   { required: true, message: '请输入优惠到期提醒模板', trigger: 'blur' },
        // ],
        // pauseServiceNotification: [
        //   { required: true, message: '请输入暂停服务通知模板', trigger: 'blur' },
        // ]
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessArea' },
          { title: '模板配置', method: () => { window.histroy.back() } },
          { title: '短信模板', method: () => { window.histroy.back() } }
        ],
      },
      histroyData: {},
      maxHeight: 0,
      tableShow: false,
      focusId: "",
    }
  },
  mounted () {
    this.init();
    this.getModelList()
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      // this.common.changeTable(this, '.ShortMessage .kl-table', [])
    })
  },
  methods: {
    inputMe (e) {
      let str = e.replace(/\ +/g, "")
      str = str.replace(/[\r\n]/g, "")
      //console.log(str);
      return str;
    },
    init () {
      let params = {
        "busicode": "MsgPhraseList",
        "data": {},
      }
      this.$api.fetch({
        params: params
      }).then(res => {
        res.forEach(item => {
          this.rules[item.phraseNo] = [
            { required: true, message: `请输入${item.phraseName}`, trigger: 'blur' },
          ]
          this.$set(this.ruleForm, item.phraseNo, item.phraseContent);
        })
        this.tableData = res;
        // this.setData();
      })
    },
    getModelList () {
      let params = {};
      params = {
        "busicode": "PhraseFieldQuery",
        "data": {
          //  "phraseNo":focusNo
        },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.btnAllList = res
      })
    },
    selectInput (val, row) {
      this.btnList = []
      this.focusId = row.phraseNo;
      this.tableData.forEach(item => {
        if (item.phraseNo == row.phraseNo) {
          this.$refs[row.phraseNo][0].$el.style.visibility = "visible";
        } else {
          this.$refs[item.phraseNo][0].$el.style.visibility = "hidden";
        }
      })
      for (var i in this.btnAllList) {
        if (i == row.phraseNo) {
          this.btnList = this.btnAllList[i]
        }
      }

    },
    makeActive (item) {
      var textItem = item
      textItem = '[' + this.getStr(item, ':') + ']'
      var elInput = document.getElementById(this.focusId) // 根据id选择器选中对象
      var startPos = elInput.selectionStart// input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd// 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value
      // 将表情添加到选中的光标位置
      var result = txt.substring(0, startPos) + textItem + txt.substring(endPos)
      elInput.value = result// 赋值给input的value
      // 重新定义光标位置
      elInput.focus()
      elInput.selectionStart = startPos + textItem.length
      elInput.selectionEnd = startPos + textItem.length
      this.ruleForm[this.focusId] = result;
    },
    getStr (string, str) {
      // var str_before = string.split(str)[0]; 
      var str_after = string.split(str)[1];
      return str_after
      // alert('前：'+str_before+' - 后：'+str_after); 
    },
    setData () {
      // let arr = this.tableData;
      // let arr = this.tableData;
      // arr.forEach((item) => {
      //   if (item.phraseName === '水费账单模板') {
      //     this.ruleForm.waterBill = item.phraseContent;
      //   } else if (item.phraseName === '欠费催缴模板') {
      //     this.ruleForm.oweFee = item.phraseContent;
      //   } else if (item.phraseName === '缴费通知模板') {
      //     this.ruleForm.payFee = item.phraseContent;
      //   } else if (item.phraseName === '优惠到期提醒模板') {
      //     this.ruleForm.couponExiration = item.phraseContent
      //   } else if (item.phraseName === '暂停服务通知模板') {
      //     this.ruleForm.pauseServiceNotification = item.phraseContent

      //   }
      // })
    },
    getData () {
      this.formData = [];
      for (let key in this.ruleForm) {
        this.tableData.forEach(item => {
          if (item.phraseNo == key) {
            this.formData.push({
              phraseNo: key,
              phraseName: item.phraseName,
              phraseContent: this.ruleForm[key],
            })
          }
        })
      }
    },
    //保存按钮
    submitForm () {
      this.getData();
      let params = {};
      params = {
        "busicode": "MsgPhraseSave",
        "data": this.formData,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success',
        });
        this.formData = [];
        this.init();
      })
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.ShortMessage {
  width: 100%;
  height: 100%;
  .ShortMessageEdit {
    height: calc(100% - 41px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-textarea {
    width: 600px;
  }
  legend {
    i {
      float: right;
      margin-top: 5px;
      cursor: pointer;
    }
  }
  .searchBtn {
    border: none;
  }
}
</style>
