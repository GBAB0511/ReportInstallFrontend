<template>
  <div class="BIlTypeEdit">
        <div class="BIlTypeEditIndex">
            <el-form class="formBill-One" :model="rowData" size="mini" label-width="120px">
                <el-form-item label="票据编号：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="rowData.invoiceNo" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="票据名称：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="rowData.invoiceName" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select v-model="rowData.type" placeholder="请选择">
                            <el-option :value="0" label="衔头发票"></el-option>
                            <el-option :value="1" label="电子发票"></el-option>
                        </el-select>
                </el-form-item>
                <!-- <el-form-item label="支持专用发票：">
                    <el-select v-model="rowData.isPro" placeholder="请选择">
                            <el-option :value="0" label="否"></el-option>
                            <el-option :value="1" label="是"></el-option>
                        </el-select>
                </el-form-item> -->
                
                <el-form-item label="状态：">
                    <el-select v-model="rowData.status" placeholder="请选择">
                        <el-option :value="0" label="启用"></el-option>
                        <el-option :value="1" label="停用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收费后自动打印：">
                    <el-select v-model="rowData.autoPrint" placeholder="请选择">
                        <el-option :value="1" label="是"></el-option>
                        <el-option :value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="备注：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="rowData.comments" placeholder=""></el-input>
                </el-form-item>
            </el-form>
        </div>
  </div>
</template>
<script>

export default {
  name: "BIlTypeEdit",
  props:[
      "rowData"
  ],
  data() {
    return {
        
        stuteOption: [{
            value: 1,
            label: '启用'
            }, {
            value: 2,
            label: '停用'}, 
        ],
      
    }
  },
  mounted() {

  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
    },
    init() {
      
    },
    //保存按钮
    submitForm(type) {
        let _this = this
        let params ={
            data:_this.rowData,
            busicode: "BaseInvoiceTypeUpdate",
        }
        if(type=="add"){
            params.busicode = "BaseInvoiceTypeAdd"
        }
        delete params.data.autoPrintName;
        console.log(params)
        // return;
        this.$api.fetch({  params: params, }).then(res => {
            this.$parent.handleClose();
            _this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
            });
        }) 
    },
  },    
  watch: {
  }
}
</script>
<style lang="scss">
.BIlTypeEdit {
  width: 100%;
  height: 100%;
  .BIlTypeEditIndex{    
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
