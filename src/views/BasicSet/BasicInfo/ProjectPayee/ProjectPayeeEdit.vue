
<template>
  <div class="ProjectPayeeEdit">
    <legend class="common-legend">收款主体</legend>
    <el-form :inline="true" class="demo-form-inline" size="mini" ref="ProjectPayeeEditForm" :rules="rules" :model="ruleForm" label-width="120px">
      <el-form-item label="工程收款主体：" prop="subjectName" class="width-250">
        <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.subjectName" placeholder="工程收款主体"  maxlength="50" clearable ></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status" class="width-250">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="停用" :value="'0'"></el-option>
          <el-option label="启用" :value="'1'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：" prop="comments">
        <el-input v-model="ruleForm.comments" type="textarea" :rows="2" style="width:250px;" show-word-limit maxlength="150" placeholder="备注"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="网厅收费：" prop="wxCharge" class="width-250">
        <el-switch v-model="ruleForm.wxCharge" inactive-text="关闭" active-text="开启" active-value="1" inactive-value="0" active-color="#13ce66">
        </el-switch>
      </el-form-item>
      <br>
      <el-form-item v-if="ruleForm.wxCharge == '1'">
        <el-form-item label="appid：" prop="appId" class="width-250">
          <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.appId" placeholder="请输入appid"  maxlength="50" clearable ></el-input>
        </el-form-item>
        <el-form-item label="mchid：" prop="mchId" class="width-250">
          <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.mchId" placeholder="请输入mchid"  maxlength="50" clearable ></el-input>
        </el-form-item>
        <el-form-item label="mchKey：" prop="mchKey" class="width-250">
          <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.mchKey" placeholder="请输入mchKey"  maxlength="50" clearable ></el-input>
        </el-form-item>
      </el-form-item>
      <legend class="common-legend" style="margin-top:10px;">开票主体
        <el-tooltip placement="top" effect="light">
          <template slot="content">
            <div  style="font-size:16px;line-height: 20px;">
              <span>如需开票，请先配置开票主体信息；<br>否则会导致开票失败</span>
            </div>
          </template>
          <i class="el-icon-warning-outline"
            style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
        </el-tooltip>
      </legend>
    <el-row>
      <el-form-item label="配置编号：" prop="invoiceNo" class="width-250">
        <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.invoiceNo" placeholder="请输入配置编号" maxlength="50" clearable ></el-input>
      </el-form-item>
    </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item style="width: 100%;" label="发票备注：">
            <el-input type="textarea" :rows="3" v-model="ruleForm.invoiceRemark" style="width:250px;" placeholder="" id="invoiceRemark" @focus="e => selectInput(e)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可定制内容:"  label-width="100px" class="Btngroup">
            <template v-for='(col) in btnList'>
              <el-button type="primary" size="mini" @click="makeActive(col)" :key="col">
                {{col}}
              </el-button>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button style="float:right;margin-right:10px;" @click="addTrade" type="primary" size="mini">新增</el-button>
      </el-row>
    </el-form>
    <div class="kl-table" :style="{height: 380 + 'px'}">
      <el-table :max-height="380" stripe border :data="tableData" class="wuserInfo-table">
        <el-table-column type="index" label="NO.">
        </el-table-column>
        <el-table-column prop="feeTypeName" label="费用种类">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称">
        </el-table-column>
        <el-table-column prop="goodsNo"  label="商品编号">
        </el-table-column>
        <el-table-column prop="goodsUnit"  label="商品单位">
        </el-table-column>
        <el-table-column prop="taxTypeName"  label="税率">
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="text " size="mini" @click.native="editContent(scope)">编辑</el-button>
            <el-button type="text " size="mini" @click.native="deleteRow(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增商品" :visible.sync="tradeShow" :close-on-click-modal="false" @close="closelDialog" width="600px">
      <el-form ref="collectForm" :model="collectForm" :rules="collectFormRules" size="mini" inline label-width="150px" label-position="center">
      <el-form-item prop="feeType" label="费用种类：" class="width-250">
        <el-select v-model="collectForm.feeType"  size="mini" clearable>
          <el-option v-for="item in expenseTypeData" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="goodsName" label="商品名称：" class="width-250">
        <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="请输入商品名称" clearable v-model="collectForm.goodsName"></el-input>
      </el-form-item>
      <el-form-item prop="goodsNo" label="商品编号：" class="width-250">
        <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="请输入商品编号" clearable v-model="collectForm.goodsNo"></el-input>
      </el-form-item>
      <el-form-item prop="goodsUnit" label="商品单位：" class="width-250">
        <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="请输入商品单位" clearable v-model="collectForm.goodsUnit"></el-input>
      </el-form-item>
      <el-form-item prop="taxType" label="税率：" class="width-250">
        <el-select v-model="collectForm.taxType"  size="mini" clearable @change="changeTaxRate">
          <el-option v-for="item in taxTypeData" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="taxRate" label=" " class="width-250" v-if="collectForm.taxType == '1'">
        <el-input oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="请输入固定税率" clearable v-model="collectForm.taxRate"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="confirm">确定新增</el-button>
      <el-button type="info" size="mini" plain @click="closelDialog">关 闭</el-button>
    </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:"ProjectPayeeEdit",
  data(){
    return{
      ruleForm:{
        wxCharge: 0,
        status: "1",
      },
      collectForm:{
        feeType: 0,
        feeTypeName: "",
        goodsName: "",
        goodsNo: "",
        goodsUnit: "",
        taxType: 0,
        taxTypeName: "",
        taxRate: "",//固定税率
        projectPayeeId: "",
      },
      expenseTypeData:[{
        value: 0,
        name: "工程款",
      }],
      taxTypeData:[{
        value: 0,
        name: "免税",
      },{
        value: 1,
        name: "固定税率",
      }],
      tableData: [],
      tableShow: false,
      maxHeight: 0,
      type:'add',
      formData:{
        id:"",
        subjectName: "",
        status: "",
        comments: "",
        wxCharge: "",
        appId: "",
        mchId: "",
        mchKey: "",
        invoiceRemark: "",
        invoiceNo: "",
      },
      rules: {
        subjectName: [
          { required: true, message: '请输入工程收款主体', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '请输入appid', trigger: 'blur' }
        ],
        mchId: [
          { required: true, message: '请输入mchid', trigger: 'blur' }
        ],
        mchKey: [
          { required: true, message: '请输入mchKey', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: ['blur', 'change'] }
        ],
      },
      collectFormRules: {
        taxType: [{ required: true, message: '请输入税率', trigger: ['blur','change'] }],
      },
      tradeShow: false,
      btnAllList: [],
      focusId: "",
      btnList: [],
      status: "",
    }
  },
  mounted() {
    // 侧边栏
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".ProjectPayeeEdit", [
        ".ProjectPayeeEdit .toolbar",
        ".ProjectPayeeEdit .block",
      ]);
    })
    // this.getModelList()
  },
  methods: {
    inputMe(e){
      let str=e.replace(/\ +/g,"")
      str=str.replace(/[\r\n]/g,"")
      //console.log(str);
      return str;
    },
    getModelList () {
    let params = {};
      params = {
        "busicode": "PhraseFieldQuery",
        "data": {
        },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.btnAllList = res;
      })
    },
    selectInput (val, row) {
      this.focusId = 'invoiceRemark';
      for (var i in this.btnAllList) {
        if (i == 'bg-dj') {
          this.btnList = this.btnAllList[i]
        }
      }
    },
    makeActive (item) {
      var textItem = item
      textItem = '[' + this.getStr(item, ':') + ']';
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
      this.ruleForm.invoiceRemark = result;
    },
    getStr (string, str) {
      var str_after = string.split(str)[1];
      return str_after
    },
    submitForm(formName) {
      let _this = this;
      let params = {};
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm = this.common.handleData(this.ruleForm,this.formData);
          if(this.tableData.length == 0){
            _this.$message({
              message:'商品信息不能为空！',
              type: 'error',
            });
            return;
          }
          this.ruleForm.invoiceInfos = this.tableData;
          if(this.type === 'update'){
            params = {
              "busicode": "ProjectPayeeUpdate",
              "data": this.ruleForm
            }
          }else{
            params = {
              "busicode": "ProjectPayeeSave",
              "data": this.ruleForm
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
          })
        } else {
          _this.$message({
            message:'必填信息未填写完整！',
            type: 'error',
          });
          return false;
        }
      });
    },
    handleClose() {
      this.common.chargeObjectEqual(this,this.ruleForm,'get','ProjectPayeeEdit',this.$parent.closeDialog);
    },
    editData(val,type){
      this.ruleForm = val;
      this.ruleForm.wxCharge = String(this.ruleForm.wxCharge);
      this.tableData = this.ruleForm.invoiceInfos;
      this.tableData.forEach((item1,i)=>{
        this.tableData[i].feeTypeName = this.expenseTypeData.filter(item=>item.value ===  item1.feeType)[0].name;
        this.tableData[i].taxTypeName = this.taxTypeData.filter(item=>item.value ===  item1.taxType)[0].name;
      })
      this.type = type
    },
    addTrade(){
      // 增加商品
      this.tradeShow = true;
      this.status = "add";
    },
    closelDialog(){
      this.tradeShow = false;
      this.collectForm = {
        feeType: 0,
        goodsName: "",
        goodsNo: "",
        goodsUnit: "",
        taxType: 0,
        taxRate: "",//固定税率
      };
    },
    changeTaxRate(val){
      this.collectForm.taxRate = "";
      if(val == "1"){
        // 如果选择的时候固定税率，要有输入
        this.$set(this.collectFormRules,'taxRate', [{ required: true, message: '请输入固定税率的值', trigger: ['blur']}])
      }else{
        const names = ['taxRate']
        names.forEach(item => {
          if(this.collectFormRules.hasOwnProperty(item)){
            this.$delete(this.collectFormRules,item)
          }
        })
      }
    },
    confirm(){
      this.$refs.collectForm.validate((valid) => {
        if (valid) {
          // 调用接口新增商品
          this.collectForm.feeTypeName = this.expenseTypeData.filter(item=>item.value ===  this.collectForm.feeType)[0].name;
          this.collectForm.taxTypeName = this.taxTypeData.filter(item=>item.value ===  this.collectForm.taxType)[0].name;
          if(this.status == "add"){
            this.tableData.push(JSON.parse(JSON.stringify(this.collectForm)));
          }else{
            this.tableData[this.tempIndex] = this.collectForm;
            this.$set(this.tableData,this.tempIndex,this.collectForm)
          }
          this.closelDialog();
        } else {
          this.$message({
            message: '必填信息未填写完整！',
            type: 'error',
          });
          return false;
        }
      });
    },
    editContent(val){
      // 编辑行内容
      this.tradeShow = true;
      this.status = "edit";
      this.tempIndex = val.$index;
      this.collectForm = JSON.parse(JSON.stringify(val.row));
    },
    deleteRow(val){
      // 删除行
      this.tableData.splice(val.$index,1);
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.ProjectPayeeEdit {
  width: 100%;
  height: calc(100% - 41px);
  overflow-y: auto;
  overflow-x: hidden;
  margin:  0 auto;

  .form {
    /deep/ {
      .el-form-item {
        .el-form-item__content {
    width: calc(100% - 120px) !important;
    }
        margin-bottom: 25px !important;
      }
    }
  }
}
</style>


