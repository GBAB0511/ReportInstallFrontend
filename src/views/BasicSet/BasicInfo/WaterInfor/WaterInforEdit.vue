
<template>
    <div class="WaterInforEdit">
         <div class="backfillSubmitForm">
            <el-form class="basicInfoForm" :inline="true" size="mini" :model="backfillSubmitForm" label-width="150px">
                    <el-form-item label="水厂名称:">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                                @input="e => input = inputMe(e)"
                            v-model="backfillSubmitForm.name"
                            placeholder="请输入水厂名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="水厂地址:">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            @input="e => input = inputMe(e)"
                            v-model="backfillSubmitForm.name"
                            placeholder="请输入水厂地址">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="状态:">
                        <el-select v-model="backfillSubmitForm.state" placeholder="请选择状态">
                            <el-option label="启用" value="0"></el-option>
                            <el-option label="停用" value="1"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="排序号:">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            @input="e => input = inputMe(e)"
                            v-model="backfillSubmitForm.sort"
                            placeholder="请输入排序号">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="备注:">
                        <el-input 
                            type="textarea"
                            v-model="backfillSubmitForm.desc"
                            placeholder="请输入备注">
                        </el-input>
                    </el-form-item>
                <!-- <el-form-item label="描述：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="backfillSubmitForm.desc" type="textarea" :rows="5" placeholder="描述" clearable  ></el-input>
                </el-form-item> -->
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:"WaterInforEdit",
    data(){
        return{
            backfillSubmitForm:{
                name:'',
                areaNum:'',
                state:'0',
                areaName:'',
                desc:"",
                sort:''
            },
        }
    },
    methods:{
        inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      }
    }
}
</script>
<style lang="scss">
 @import "../../../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
$theme-color:#297acc;
.WaterInforEdit{
    height: 100%;
    width: 80%;
    margin: 0 auto;
    .backfillSubmitForm{
        // margin-top: 15px;
        // padding: 10px 20px;
        // // width: 93%
        .el-input--mini /deep/ .el-input__inner{
                width: 100%;
        }
    }
}
</style>
