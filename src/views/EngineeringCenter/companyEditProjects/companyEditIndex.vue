<template>
  <div class="companyEditIndex">
    <el-form :rules="rules" :model="formData" class="formBill" size="mini" :inline="true" ref="companyEditForm" label-width="130px">
    
      <legend class="legendColumn">项目信息</legend>

      <el-form-item label="项目名称：" prop="itemName">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.itemName" size="mini" clearable></el-input>
      </el-form-item>

      <el-form-item label="拟开工时间：" prop="itemstartDate">
         <el-date-picker v-model="formData.itemstartDate"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item label="建设地点：" prop="constructionSite">
         <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.constructionSite" size="mini" clearable></el-input>
      </el-form-item>

      <el-form-item label="建设性质：" prop="constructionprOperty">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.constructionprOperty" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="项目（法人）单位：" prop="itemLegalDept">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.itemLegalDept" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="建设规模及内容：" prop="constructionScaleAnddesc">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.constructionScaleAnddesc" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码：" prop="itemLegalCreditCode">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.itemLegalCreditCode" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="contractPerson">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.contractPerson" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="contractPhone">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.contractPhone" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="处理人：" prop="clPeople">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.clPeople" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" prop="cjTime">
         <el-date-picker v-model="formData.cjTime"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="处理时间："  prop="clTime">
       <el-date-picker v-model="formData.clTime"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "companyEditIndex",
  props: ["keySon","editNeedData"],
  components: {
  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程管理" }, { title: "内部工程" }]
      },
      dictionaryData: [],
      formData: {
       itemName:'',//项目名称
       itemstartDate:'',//拟开工时间
       constructionSite:'',//建设地点
       constructionprOperty:'',//建设性质
       itemLegalDept:'',//项目（法人）单位
       constructionScaleAnddesc:'',
       itemLegalCreditCode:'',
       contractPerson:'',
       contractPhone:'',
       clPeople:'',
       cjTime:'',
       clTime:''
      },
      uploadIcon: "el-icon-minus",
      maxHeight: 0,
      tableShow: false,
      rules: {
        register:{
          inpjName: [
            { required: true, message: '请输入工程名称', trigger: 'blur' }
          ],
          pjType: [
            { required: true, message: '请选择工程类型', trigger: 'change' }
          ],
          urgentFlag: [
            { required: true, message: '请选择紧急程度', trigger: 'change' }
          ],
          pjAddr: [
            { required: true, message: '请输入用水地址', trigger: 'blur' }
          ],
        }
      },
    };
  },
  mounted() {
    //数据字典接口
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".engineer-center .engineer-center-right", [
        ".engineer-center .table-top"
      ]);
    });
    if(this.editNeedData){
         this.formData = this.editNeedData
    }    
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    getFormbData() {
      return this.formData
    },
    submit(type) {
      let _this = this
      
      // this.$refs['companyEditForm'].validate((valid) => {
      //   if (valid) {
      //     let params = {
      //       busicode: "PjInternalSave",
      //       data: this.getFormbData()
      //     };
      //     return
      //     _this.$api.fetch({ params }).then(res => {
      //       _this.$notify({
      //         title: "成功",
      //         message: "操作成功",
      //         type: "success"
      //       });
      //       _this.formData.id = res.id;
      //       _this.$parent.closeDialog();
      //     });
      //   } else {
      //     return false;
      //   }
      // });
    }
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
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.companyEditIndex {
  height: 100%;
  overflow-y: auto;
}
</style>
