<template>
  <div class="ExpenseBillRelationship">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini"  @click="add('add')" type="primary">保存</el-button>
      </div>
    </div>

    <div class="contain">
      <div v-for="(val,index) in fyOptions" :key="val.costNo">
        <el-form class="lineForm" :inline="true" :model="formData[index]" size="mini" label-width="100px">
          <legend class="legendColumn">{{val.costName}}</legend>
            <div class="expenseContent">
                <el-form-item label="票据类型：">
                <el-select v-model="formData[index].invoiceNo" size="mini" clearable placeholder="选择票据类型">
                    <el-option
                    v-for="item in pjoptions.list"
                    :key="item.id"
                    :label="item.invoiceName"
                    :value="item.id"
                    ></el-option>
                </el-select>
                </el-form-item>
              <el-form-item label="是否可开专票：">
                <el-select v-model="formData[index].isSpecialTax" size="mini" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否为主营收入：" label-width="120px">
                <el-select v-model="formData[index].isMain" size="mini" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="商品名称：" prop="请输入商品名称">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData[index].commodityName" placeholder></el-input>
                </el-form-item>
                <el-form-item label="商品编号：" prop="请输入商品编号">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData[index].commodityNo" placeholder></el-input>
                </el-form-item>
                <el-form-item label="商品单位：" prop="请输入商品单位">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData[index].commodityUnit" placeholder></el-input>
                </el-form-item>
                <el-form-item label="税率：" prop="请输入税率">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData[index].taxRate" placeholder></el-input>
                </el-form-item>
            </div>
          </el-form>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExpenseBillRelationship",
  data() {
    return {
      formData: [{invoiceNo:"",isMain:"",commodityName:"",commodityNo:"",commodityUnit:"",taxRate:"",costId:""}],
      fyOptions:[],
      pjoptions:{},
      options:[
        {
          id:1,
          value: "是"
        },
        {
          id:2,
          value: "否"
        },
      ],
      visable:false,
      crumbsData: {
        //面包屑
        titleList: [
          //   { title: '基础信息', path: '/BusinessArea' },
          { title: "其他配置" },
          { title: "费用票据关系" }
        ]
      }
    };
  },
  created(){
    this.init();
  },
  mounted() {
    //this.init();
    // this.getListInfo();
    this.getInvoiceType();

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
        busicode: "CostList",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          let option = res

          let form = []
          option.forEach(element => {
            let data = {invoiceNo:"",commodityName:"",commodityNo:"",commodityUnit:"",taxRate:"",costId:element.id};
            form.push(data);
          });
          //_this.formData=form;
          _this.$set(_this,"formData",form)
          _this.fyOptions = res;
          this.getListInfo()
        });
    },
    //初始化数据
    getListInfo(){
      let _this = this;
      let params = {
        busicode: "BaseInvoiceCostQuery",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.formData.forEach((element1,index1)=>{
            res.forEach((element,index) => {
              if(element.costId===element1.costId){
                _this.$set(_this.formData,index1,element)
              }
            })
          });
          //console.log(this.formData)
        });
    },
    //获取发票类型
    getInvoiceType(){

      let _this = this;
      let params = {
        busicode: "BaseInvoiceTypeList",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.pjoptions = res;
        });
    },
    add(type){
      if(type=="add"){
        let _this = this;
        let params = {
          busicode: "BaseInvoiceCostAdd",
          data: _this.formData
        };
        this.$api.fetch({
            params: params //参数
        }).then(res => {
            _this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success'
                });
          })
      }
    },
    //保存按钮
    submitForm(formName) {

    }
  },
  watch: {}
};
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.ExpenseBillRelationship {
  width: 100%;
  height: 100%;
  .contain {
    overflow-y: auto;
    height: calc(100% - 41px);
  }
  .expenseContent {
    //height: 50px;
    > span {
      height: 50px;
      line-height: 32px;
      font-weight: 700;
      width: 100px;
      display: inline-block;
    }
  }
}
</style>
