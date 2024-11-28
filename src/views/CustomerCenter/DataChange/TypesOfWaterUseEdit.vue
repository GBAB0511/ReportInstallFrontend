

<template>
    <div class="TypesOfWaterUseEdit">

        <el-form class="TypesOfWaterUseForm" :inline="true" :model="TypesOfWaterUseEditForm" label-width="160px">
            <el-form-item label="用户编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.userNo" :disabled="isEdit" class='read-only' placeholder=""></el-input>
                <!-- <el-button class='searchBtn' icon="el-icon-search"></el-button> -->
            </el-form-item>
            <el-form-item label="用户名称：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.userName" :disabled="isEdit" class='read-only' placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="用户地址：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.userAddr" :disabled="isEdit" class='read-only' placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="联系人：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.linkMan" :disabled="isEdit" class='read-only' placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="座机号码：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.linkTel" :disabled="isEdit" class='read-only' placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.mobile" :disabled="isEdit" class='read-only' placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.email" :disabled="isEdit" class='read-only' placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="原用水类型：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="TypesOfWaterUseEditForm.userNume" :disabled="isEdit" class='read-only' placeholder=""></el-input>
            </el-form-item>
             <el-form-item label="新用水类型：">
                <el-select  clearable v-model="TypesOfWaterUseEditForm.desc" placeholder="">
                    <el-option  v-for="(item,index) in TypesOfWaterUseEditForm.descoptions" :key="index" :label="item.name" :value="item.value"></el-option>

                </el-select>
            </el-form-item>
            <el-form-item label="备注：" style="width: 98%">
                <el-input type="textarea" :rows="2" v-model="TypesOfWaterUseEditForm.Remarks" placeholder=""></el-input>

            </el-form-item>



            
        </el-form>

    </div>
</template>
<script>
export default {
    name:"TypesOfWaterUseEdit",
    components:{
    },
    props:{
        isEdit:{
            type:Boolean,
        }
    },
    data(){
        return{
            TypesOfWaterUseEditForm:{
                userNo:"",
                userName:"",
                userAddr:"",
                linkMan:"",
                linkTel:"",
                mobile:"",
                email:"",
                desc:"",
                userNume:"",
                descoptions:[],
                Remarks:""
            },
    
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        init(){
            
        },

    }
}
</script>
<style lang="scss">
.TypesOfWaterUseEdit{
    .el-input__inner {
    height: 30px;
  }

    .TypesOfWaterUseForm{
        // margin-top: 15px;
    }
    .TypesOfWaterUseForm{
        // padding: 10px 20px;
        width: 98%;
        .el-form-item{
            width: 32%;
            .el-form-item__content{
                width: 50%;
                .el-select{
                    width: 100%;
                }
            }
        }
        .Remarks{
            width: 50%;
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

