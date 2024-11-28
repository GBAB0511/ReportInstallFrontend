

<template>
    <div class="InvoiceAcquisitionEdit">
 
        <el-form class="BillManagementForm" :inline="true" :model="DefaultData" label-width="160px">
            <el-form-item label="票据类型：" prop="userNum">
                <el-select  clearable v-model="DefaultData.invoiceType" disabled>
                    <el-option v-for="item in invoiceType" :key="item.invoiceNo" :label="item.invoiceName" :value="item.invoiceNo"></el-option>
                </el-select>
            </el-form-item>           
            <el-form-item label="领用人：" prop="getInvoiceStaff">
                <!--el-input v-model="DefaultData.getInvoiceStaff" placeholder=""></el-input-->
                <el-select v-model="DefaultData.getInvoiceStaff" size="mini" placeholder="领用人">
                    <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发票代码：" prop="invoiceCode">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="DefaultData.invoiceCode" disabled></el-input>

            </el-form-item>

            <el-form-item label="开始号码：" prop="invoiceBeginNum">
                <el-input type="text" v-model="DefaultData.invoiceBeginNum" @input="changeNum"></el-input>

            </el-form-item>

            <el-form-item label="结束号码：" prop="invoiceEndNum">
                <el-input type="text" v-model="DefaultData.invoiceEndNum" @input="changeNum"></el-input>
                
            </el-form-item>
            <el-form-item label="张数：" prop="invoiceAmount">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="DefaultData.invoiceAmount"></el-input>

            </el-form-item>


           
            
        </el-form>

    </div>
</template>
<script>
export default {
    name: "InvoiceAcquisitionEdit",
    props: ["rowData"],
    data(){
        return{
            meterReaderList:[],
            label:0,
            dictionaryData:[],
            invoiceType:[],
            DefaultData:{
                getInvoiceStaffId: "",
                getInvoiceStaff: "",
                invoiceAmount: "",
                invoiceBeginNum: "",
                invoiceCode: "",
                invoiceEndNum: "",
                id: "",
            },
            beginNum:"",
            endNum:"",
            spanvisible:true,
        }
    },
    mounted(){
        this.getInvoiceType();
        this.getReadingStaff();
        this.init(this.rowData);
    },
    methods:{
        init(row){
            let _this=this;
            let data = {
                getInvoiceStaff: sessionStorage.getItem('account'),
                invoiceAmount: Number(row.invoiceAmount)-Number(row.uinvoiceAmount),
                invoiceBeginNum:row.invoiceBeginNum[0] !== '0' ? Number(row.invoiceBeginNum)+Number(row.uinvoiceAmount):row.invoiceBeginNum,
                invoiceCode: row.invoiceCode,
                invoiceEndNum: row.invoiceEndNum,
                invoiceType: row.invoiceType,
                id: row.invoiceRegId,
            }
            _this.DefaultData = data
            _this.beginNum=_this.DefaultData.invoiceBeginNum;
            _this.endNum=_this.DefaultData.invoiceEndNum;
        },
        // 收费人员数据获取
        getReadingStaff() {
            var _this = this;
            var params = {
                "busicode": "PostUserSelect",
                "data": { "postNo": "1" },
            };
            this.$api
                .fetch({
                params: params //参数
                })
                .then(res => {
                _this.meterReaderList = [...[{ userAccount: sessionStorage.getItem('account'),userName: sessionStorage.getItem('userName') }], ...res];
                });
        },
        // 获取发票类型
        getInvoiceType() {
          var _this = this
          var params = {
            "busicode": "InvoiceTypeList",
         }
          this.$api.fetch({
           params: params,//参数
          }).then(res => {
            _this.invoiceType= res
          })
        },
    changeNum(){
      this.DefaultData.invoiceAmount=Number(this.DefaultData.invoiceEndNum)-Number(this.DefaultData.invoiceBeginNum)+1;
    },
        // 数据字典数据获取
        getDictionary() {
          var _this = this
          var params = {
            "busicode": "DictionarySelect",
            "data": "BBT"
         }
          this.$api.fetch({
           params: params,//参数
          }).then(res => {
            _this.dictionaryData = res
          })
            },
        }
}
</script>
<style lang="scss">
$theme-font-color:#3680CD;
.InvoiceAcquisitionEdit{

    .BillManagementForm{
        margin-top: 15px;
    }
    .BillManagementForm{
        padding: 10px 20px;
        width: 93%;
        .el-form-item{
            width: 32%;
            margin-bottom: 10px;
            .el-form-item__content{
                width: 48%;
                .el-select,.el-input__inner{
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                }
            }
            .el-input__icon{
                line-height: 30px;
            }
        }
        .Remarks{
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
    .theme-color .cell{
        color:$theme-font-color;
    }

}
</style>

