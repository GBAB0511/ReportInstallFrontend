<template>
    <div class="payWay">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
            <el-form-item label="收费方式：">
                <el-select  clearable v-model="formData.payWay" placeholder="全部">
                    <el-option  v-for="(item,index) in formData.payWayOptions" :key="index" :label="item.name" :value="item.value"></el-option>

                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name:"payWay",
    data(){
        return{
            formData:{
                payWay:"",
                payWayOptions:[
                    {
                        name:"全部",
                        value:"1"
                    },
                    {
                        name:"现金",
                        value:"2"
                    },
                    {
                        name:"支票",
                        value:"3"
                    },
                    {
                        name:"刷卡",
                        value:"4"
                    },
                    {
                        name:"转账",
                        value:"5"
                    },
                    {
                        name:"预存",
                        value:"6"
                    },
                ],
            }
        }
    }
}
</script>
<style lang="scss">
.payWay{
    padding:10px 20px;
}
</style>
