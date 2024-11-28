
<template>
    <div class="MassageDetailsEdit">
        <div class="backfillSubmitForm">   
            <el-form :inline="true" :model="formData" class="demo-form-inline formEdit" label-width="120px">
                    <el-form-item label='通知类型'>
                        <el-select  clearable v-model="formData.watermeterWarehouse" placeholder="通知类型">
                            <el-option  v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="通知时间：">
                        <el-date-picker
                        v-model="formData.con"
                        type="date"
                        placeholder="通知时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label='通知方式：'>
                        <el-select  clearable v-model="formData.watermeterWarehouse1" placeholder="通知方式">
                            <el-option  v-for="(item,index) in formData.changeMeterPeople" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item label="通知内容：" class="remark">
                    <el-input type="textarea" :rows="2" v-model="formData.reason" placeholder="通知内容"></el-input>
                </el-form-item>
            </el-form>
            <div class="kl-table">
                <el-table       
                    stripe
                    border
                    :data="tabelData.list"
                     highlight-current-row
                    class="change-tables-table">

                    <el-table-column 
                        type="index"  label="NO."
                        width="50" 
                        fixed="left"
                        :index="indexMethod">
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="册本">
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="80"
                        label="用户编号">

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="80"
                        label="装表地址">
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="水表编号">
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="水表形态">
                    </el-table-column>

                    <el-table-column
                        prop="meter"
                        min-width="80"
                        label="水表口径"
                        >
                    </el-table-column>

                    <el-table-column
                        prop="meter"
                        min-width="120"
                        label="装表日期">
                    </el-table-column>
                                            
                    <el-table-column
                        prop="meter"
                        min-width="120"
                        label="表读数"
                        show-overflow-tooltip>
                    </el-table-column>


                    <el-table-column 
                        prop="meter" 
                        min-width="100" 
                        label="累计流量" 
                        show-overflow-tooltip>
                    </el-table-column>
                    
                    <el-table-column
                        prop="meter"
                        min-width="120"
                        label="使用期限">
                    </el-table-column>
                                            
                    <el-table-column
                        prop="meter"
                        min-width="120"
                        label="已用周期"
                        show-overflow-tooltip>
                    </el-table-column>

                    </el-table>
                </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"MassageDetailsEdit",
    data(){
        return{
            formData:{
                watermeterWarehouse:"",
                watermeterWarehouseOptions:[
                    {
                        name:"临时换表",
                        value:"1"
                    },
                    {
                        name:"正常换表",
                        value:"2"
                    },
                    {
                        name:"异常换表",
                        value:"3"
                    },
                    

                ],
                changeMeterPeople:[
                    {
                        name:"詹 杰",
                        value:"1"
                    },
                    {
                        name:"刘帅军",
                        value:"2"
                    },
                    {
                        name:"吴希",
                        value:"3"
                    },
                    {
                        name:"杜忠杰",
                        value:"4"
                    },
                    {
                        name:"于鹏飞",
                        value:"5"
                    },
                    

                ],
                con:"",
                reason:""
            },
            tabelData:{
                list:[]
            },

            backfillSubmitForm:{
                superiorArea:'',
                areaNum:'',
                state:'0',
                areaName:'',
                desc:"",
                postion:'',
                address:'',
                time:'',
            },
        }
    }
}
</script>
<style lang="scss">
 @import "../../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
$theme-color:#297acc;
.MassageDetailsEdit{
    height: 100%;
    width: 100%;
    margin: 0 auto;
    .backfillSubmitForm{
        .el-input--mini /deep/ .el-input__inner{
                width: 100%;
        }
    }
}
</style>
