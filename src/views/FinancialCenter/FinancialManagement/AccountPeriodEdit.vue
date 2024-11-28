<template>
    <div class="AccountPeriodEdit">
        <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账期：" prop="userNum">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.userNum"></el-input>
            </el-form-item>
            <el-form-item label="开始日期：" prop="PriceStrategy">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.PriceStrategy"></el-input>
            </el-form-item>
            <el-form-item label="结束日期：" prop="isfines">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.isfines"></el-input>
            </el-form-item>
            <el-form-item label="本次预存：" prop="aaa">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.isfines"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name:"AccountPeriodEdit",
    data(){
        return{
            rules: {
                userNum: [
                        { required: true, message: '请输入实收账期', trigger: 'blur' },
                    ],
                PriceStrategy: [
                    { required: true, message: '请输入开始日期', trigger: 'blur' },
                ],
                isfines: [
                    { required: true, message: '请输入结束日期', trigger: 'blur' },
                ],
                aaa: [
                    { required: true, message: '请输入本次预存', trigger: 'blur' },
                ],
            },
            ruleForm:{
                userNum:"",
                PriceStrategy:"",
                isfines:"",
            }
        }
    }
}
</script>
<style lang="scss">
.AccountPeriodEdit{
    .demo-ruleForm{
        width: 60%;
        margin:10px auto;
        .el-form-item{
            width: 100%;
            .el-form-item__content{
                width: calc(80% - 100px);
                .el-input__inner{
                    width: 100%;
                }
            }
        }
    }
    
}
</style>
