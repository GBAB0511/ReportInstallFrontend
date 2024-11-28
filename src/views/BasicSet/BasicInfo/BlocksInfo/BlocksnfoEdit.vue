
<template>
    <div class="BlocksnfoEdit">
         <div class="backfillSubmitForm">
            <el-form class="basicInfoForm" :inline="true" size="mini" :model="backfillSubmitForm" label-width="150px">
                <el-form-item label="街区编号:">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                                v-model="backfillSubmitForm.code"
                                @input="e => input = inputMe(e)"
                                placeholder="请输入内容">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="街区名称:">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                                v-model="backfillSubmitForm.areaName"
                                @input="e => input = inputMe(e)"
                                placeholder="请输入内容">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="备注:">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                                v-model="backfillSubmitForm.desc"
                                @input="e => input = inputMe(e)"
                                placeholder="请输入备注">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="状态:">
                      <el-select v-model="backfillSubmitForm.state" placeholder="">
                        <el-option label="启用" value="0"></el-option>
                        <el-option label="停用" value="1"></el-option>
                      </el-select>
                    </el-form-item> 
                    <el-form-item label="排序号:">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                                v-model="backfillSubmitForm.desc"
                                @input="e => input = inputMe(e)"
                                placeholder="请输入内容">
                      </el-input>
                    </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:"BlocksnfoEdit",
    data(){
        return{
            backfillSubmitForm:{
                code:'',
                superiorArea:'',
                areaNum:'',
                state:'0',
                areaName:'',
                desc:"",
            },
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
<style lang="scss">
 @import "../../../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
$theme-color:#297acc;
.BlocksnfoEdit{
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
