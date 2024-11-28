<template>
    <div class="accountInfo">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
            <el-form-item label="账户编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="账户编号" @input="e => input = inputMe(e)"></el-input>
            </el-form-item>
            <!-- <el-form-item label="水表编号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="水表编号"></el-input>
            </el-form-item>
            <el-form-item label="册本号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="册本号"></el-input>
            </el-form-item>
            <el-form-item label="水表口径：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="水表口径"></el-input>
            </el-form-item>
            <el-form-item label="已用周期（年）：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="已用周期（年）"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-checkbox-group v-model="checkList">
                    <el-checkbox label="只显示过期"></el-checkbox>
                    <el-checkbox label="只显示超重"></el-checkbox>
                </el-checkbox-group>
            </el-form-item> -->
            <el-form-item>
                
                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>

        <div class="kl-table">
             <el-table  stripe border :data="histroyData.list" highlight-current-row >

                <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="code" min-width="180" label="账户编号">
              </el-table-column>

              <el-table-column prop="code" min-width="180" label="账户类型">
              </el-table-column>

              <el-table-column prop="concentrator" min-width="100" label="缴费方式">
              </el-table-column>

              <el-table-column prop="daytime" min-width="180" label="余额">

              </el-table-column>

              <el-table-column prop="factoryName" min-width="180" label="托号">
              </el-table-column>

              <el-table-column prop="fixValue" min-width="180" label="托收合同号">
              </el-table-column>

              <el-table-column prop="flux" min-width="80" label="开户行">
              </el-table-column>
              <el-table-column prop="meter" min-width="180" label="开户名">
              </el-table-column>

              <el-table-column prop="meter" min-width="80" label="银行账号">

              </el-table-column>

              <el-table-column prop="lvalue" min-width="80" label="状态">
              </el-table-column>

            </el-table>
                <!-- 分页 -->
                <div class="block">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="1"
                        :page-sizes="[20, 100, 500, 1000]"
                        :page-size="20"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="histroyData.total">
                    </el-pagination>
                </div>
            </div>
    </div>
</template>
<script>
export default {
    name:"accountInfo",
    data(){
        return {
            formData:{
                con:"",
                checkList:""
            },
            histroyData:{
                
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
            this.formData= {
                watermeterWarehouse:"",
                watermeterWarehouseOptions:[],
                con:"",
                reason:""
            };
            this.histroyData = {
                areaId: "",
                endRow: 5,
                hasNextPage: false,
                hasPreviousPage: false,
                isFirstPage: true,
                isLastPage: true,
                list: [
                {
                    areaId: null,
                    areaName: [],
                    code: "101801012001",
                    concentrator: "银行代扣",
                    connect: null,
                    daytime: "深圳市粤港科技有限公司",
                    endTime: null,
                    factoryName: "深圳市东湖公园水库大楼227",
                    fcode: "梅州市梅新路39号",
                    fix: false,
                    fixValue: "-",
                    flux: "-",
                    getMeter: 1,
                    id: null,
                    isxz: "13662592308",
                    lvalue: [],
                    meter: null,
                    model: null,
                    modifyBy: null,
                    modifyTime: null,
                    offset: 0,
                    page: 1,
                    pageCount: 20,
                    position: "1栋3单元",
                    protocolName: null,
                    rowNumber: 0,
                    sensorModel: null,
                    sn: null,
                    status: "未上传",
                    totalPage: 0,
                    type: 5,
                    unusual: null,
                    usn: "00",
                    waterGroup: null,
                },

                ],
                navigateFirstPage: 1,
                navigateLastPage: 1,
                navigatePages: 8,
                navigatepageNums: Array(1),
                nextPage: 0,
                pageNum: 1,
                pageSize: 20,
                pages: 1,
                prePage: 0,
                size: 5,
                startRow: 1,
                total: 5,
            }
        },
        closeDialog(){ //关闭会话
			this.waterChoooseVisible = false
			this.init()
        },
        //弹出框
        submit(formName){	//提交
            this.$refs.childWaterEditor.submit()
            // this.waterChoooseVisible = false;
        },
        indexMethod(index) {//获取表格序号
        //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
        return  (this.histroyData.pageSize-20)*this.histroyData.pages + (index+1) ;
        
        },
        //分页
        handleSizeChange(val) { //显示多少数据一页
            // this.tableQuery.pageCount = val
            // this.tableQuery.page = 1
            this.init()
        },
        handleCurrentChange(val) {  //显示多少页码
            // this.tableQuery.page = val
            this.init()
        },
    }
}
</script>

<style lang="scss" scoped>
    .accountInfo{
        padding: 10px;
        width: calc(100% - 20px);
        .kl-table{
            padding: 0px ;
            .block{
                text-align: right;
                padding:10px 0px;
            }
        }
    }
</style>
