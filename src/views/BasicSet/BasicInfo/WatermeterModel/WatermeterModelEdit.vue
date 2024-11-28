
<template>
    <div class="WatermeterModelEdit">
      <el-form class="formBill-One" ref="WatermeterModelEditForm"  :inline="true" size="mini" :model="formData" label-width="100px">
          <el-form-item label="型号名称：" prop="modelName">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.modelName" maxlength="50" clearable
                          placeholder="请输入水表型号">
                </el-input>
              </el-form-item>
             <!-- <el-form-item label="水表型式：" prop="meterType">
                <el-select v-model="formData.meterType" placeholder="请选择水表型式">
                  <el-option v-for="(item,index) in dictionaryData.MMP" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item label="传输方式：" prop="transWay">
                <el-select v-model="formData.transWay" placeholder="请选择传输方式">
                  <el-option v-for="(item,index) in dictionaryData.TPW" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="水表传感器：" prop="meterSensor">
                <el-select v-model="formData.meterSensor" clearable placeholder="请选择水表传感器">
                  <el-option v-for="(item,index) in dictionaryData.MSS" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序号：" prop="sortNo">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="formData.sortNo" maxlength="6" clearable
                          placeholder="请输入排序号">
                </el-input>
              </el-form-item>
              <el-form-item label="状态：" prop="status">
                <el-select v-model="formData.status" placeholder="请选择状态" clearable>
                  <el-option label="启用" :value="1"></el-option>
                  <el-option label="停用" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注：">
                <el-input v-model="formData.comments" show-word-limit maxlength="150" clearable
                          placeholder="请输入备注"
                          type="textarea">
                </el-input>
              </el-form-item>
      </el-form>
    </div>
</template>
<script>
export default {
    name:"WatermeterModelEdit",
    data(){
        return{
          formData:{
            id:"",
            modelName: "",
            meterType: "",
            transWay: "",
            meterSensor:"",
            comments:"",
            status:"",
            sortNo:"",
            tenantId:"",
          },
          dictionaryData:[],
        }
    }, 
    mounted(){
      this.getData();
    },
    methods: {
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
      // 获取数据字典数据
      getData(){
        let _this = this;
        this.$api.fetch({
        params: {
            "busicode": "DictionarySelect",  
            "data": "MMP,TPW,MSS",//水表形式、传输方式、水表传感器
        },
        }).then(res => {
          this.$set(this, "dictionaryData",res);
        })
      },
      //保存按钮
      resetForm() {
        this.$refs.WatermeterModelEditForm.resetFields();
      },
      submitForm(type) {
        let _this = this;
        let params = {};
          if(type === 'MeterModelAdd'){
            params = {
              "busicode": "MeterModelAdd",
              "data": this.formData
            }
          }else{
            params = {
              "busicode": "MeterModelUpdate",
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
        })
      },
      editData(val){
        this.formData = val;
        this.formData.meterType = this.formData.meterType + '';
        this.formData.transWay = this.formData.transWay + '';
        this.formData.meterSensor = this.formData.meterSensor + '';
      }
    },
}
</script>
<style lang="scss">
.WatermeterModelEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin: 0 auto;
}
</style>

