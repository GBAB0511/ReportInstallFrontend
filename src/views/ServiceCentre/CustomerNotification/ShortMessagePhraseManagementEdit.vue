
<template>
    <div class="ShortMessagePhraseManagementEdit">

        <el-form class="backfillSubmitForm" :inline="true" :model="ShortMessagePhraseManagementEditForm" label-width="160px" ref="ruleForm" :rules="rules">
            <el-form-item label="短信编号：" prop="shortMsgNum">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ShortMessagePhraseManagementEditForm.shortMsgNum" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="短语名称：" prop="shortMsgName">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ShortMessagePhraseManagementEditForm.shortMsgName" placeholder=""></el-input>
            </el-form-item>
            <!-- <el-form-item label="定制模板：" prop="CustomizedTemplate">
                <el-select v-model="ShortMessagePhraseManagementEditForm.CustomizedTemplate" placeholder="是">
                    <el-option
                    v-for="item in ShortMessagePhraseManagementEditForm.isdescoptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
             <el-form-item label="状态：">
                <el-select v-model="ShortMessagePhraseManagementEditForm.state" placeholder="">
                    <el-option
                    v-for="item in ShortMessagePhraseManagementEditForm.descoptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item style="width: 100%;" label="短语内容：" prop="shortMsgCon">
                <el-input type="textarea"  :rows="7" v-model="ShortMessagePhraseManagementEditForm.shortMsgCon" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="可定制内容" class="Btngroup">
                <el-button type="text" size="mini">用户编号</el-button>
                <el-button type="text" size="mini">用户名称</el-button>
                <el-button type="text" size="mini">用户地址</el-button>
                <el-button type="text" size="mini">用户余额</el-button>
                <el-button type="text" size="mini">水表编号</el-button>
                <el-button type="text" size="mini">欠费合计（不含违约金）</el-button>
                <el-button type="text" size="mini">欠费合计（含违约金）</el-button>
                <el-button type="text" size="mini">违约金</el-button>
                <el-button type="text" size="mini">当前日期</el-button>
                <el-button type="text" size="mini">客服热线</el-button>
                <el-button type="text" size="mini">支付链接</el-button>

            </el-form-item>


            
        </el-form>

    </div>
</template>
<script>
export default {
    name:"ShortMessagePhraseManagementEdit",
    data(){
        return{
            ShortMessagePhraseManagementEditForm:{
                // 查询内容
                backfillInput:[
                    {
                        label:"用户名称：",
                        value:"1",
                        tips:"xx319"
                    },
                    {
                        label:"用户地址：",
                        value:"2",
                        tips:"登封路"
                    },
                    {
                        label:"联系人：",
                        value:"3",
                        tips:""
                    },
                    {
                        label:"联系方式：",
                        value:"4",
                        tips:""
                    },
                ],
               
                desc:"",
                userNume:"",
                descoptions:[
                    {
                        name:"启用",
                        value:"1"
                    },
                    {
                        name:"停用",
                        value:"2"
                    },
                ],
                isdescoptions:[
                    {
                        name:"是",
                        value:"1"
                    },
                    {
                        name:"否",
                        value:"3"
                    },
                ],
                shortMsgNum:"",
                shortMsgName:"",
                CustomizedTemplate:"",
                state:"",
                shortMsgCon:""
            },
            rules:{
                userNume:[
                    { required: true, message: '请输入用户编号', trigger: 'blur' },
                ],
                desc:[
                    { required: true, message: '请输入用户编号', trigger: 'blur' },
                ],
                userNum:[
                    { required: true, message: '请输入短信编号', trigger: 'blur' },
                ],
                shortMsgName:[
                    { required: true, message: '请输入短信标题', trigger: 'blur' },
                ],
                CustomizedTemplate:[
                    { required: true, message: '请输入短信模板', trigger: 'blur' },
                ],
                // shortMsgCon:[
                //     { required: true, message: '请输入短信状态', trigger: 'blur' },
                // ],
            },
                
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){

        },

    }
}
</script>
<style lang="scss">
.ShortMessagePhraseManagementEdit{
    legend{
        background: #f5f5f5;
        font-weight: 700;
        font-size: 12px;
        padding: 5px 20px;
        font-size: 14px;
    }
    .backfillSubmitForm{
        margin-top: 15px;
    }
    .backfillSubmitForm{
        padding: 10px 20px;
        width: 93%;
        .el-form-item{
            width: 32%;
            .el-form-item__content{
                width: calc(100% - 160px);
                .el-select{
                    width: 100%;
                }
            }
        }
        .right-btn{
            text-align: right;
            width: 100%;
        }
        .userAdress{
            width:80%;
            .el-form-item__content{
                width:calc(100% - 160px);
                .el-form-item__label{
                    width: 100px !important;
                }
                .el-textarea, .el-input{
                    width:30%;
                }
                .el-select{
                    width:20%;
                }
                .el-checkbox-group{
                    display:inline-block;
                    width: 50%;
                }
            }
        }

        .Btngroup{
            width: 100%;
            .el-form-item__content{
                width:calc(100% - 160px);
            }
        }
    }
    .el-steps--horizontal{
        margin: 0 auto;
        width: 50%;
        padding-bottom: 20px;
    }

}
</style>

