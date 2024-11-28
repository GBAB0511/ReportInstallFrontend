<template>
  <div class="water-meter" :key="keylength">
    <div class="table-content">
      <div class="kl-table">
      <el-table
        stripe
        border
        class="wuserInfo-table"
        highlight-current-row
        :data="tableData"
        style="width: 100%">
        <!-- <el-table-column
          prop="setupMeterAddr"
          label="装表地址"
          width="180">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="text" v-model="scope.row.setupMeterAddr"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="planMeterInstallDate"
          label="计划日期"
          width="180">
             <template slot-scope="scope">
                <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="scope.row.planMeterInstallDate">
                </el-date-picker>

                
            </template>
        </el-table-column>
        <el-table-column
          prop="meterBuilder"
          label="施工人员"
          >
          <template slot-scope="scope">
              <el-select v-model="scope.row.meterBuilder" @change="meterBuilderChange(scope.row)"  size="mini" >
                <el-option
                  v-for="item in workerNameList"
                  :key="item.userAccount"
                  :label="item.userName"
                  :value="item.userAccount"

                ></el-option>
              </el-select>
            </template>
        </el-table-column>


        <!-- <el-table-column
          prop="meterSite"
          label="表位">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.meterSite"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
        prop="meterBjms"
        label="表井模式">
        <template slot-scope="scope">
            <el-select
              clearable
              v-model="scope.row.meterBjms"
              placeholder
            >
              <el-option
                v-for="(item, index) in dictionaryData.CTL"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
      </el-table-column>
        <el-table-column
          prop="meterBjxs"
          label="表井形式">
          <template slot-scope="scope">
            <el-select
              clearable
              v-model="scope.row.meterBjxs"
              placeholder
            >
              <el-option
                v-for="(item, index) in dictionaryData.BJXS"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column> -->
      </el-table>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align:center;margin-top:60px" ref="ruleForm">
        <el-button type="primery" size="mini" plain @click="changeTab()">确 定</el-button>
        <el-button type="info" size="mini" plain @click="dialogClose()">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import concentratorInfo from "@/components/concentratorInfo"; //选择集中器
    export default {
        components: {
          concentratorInfo
        },
        props:['func'],
        data() {
            return {
              dictionaryData: [], //数据字典
              isSgpdShow:true,
              keylength:0,
              workerNameList: [],
              selectList:[],
              //meterBuilder:'',    
                NewtableData: [
                //   {
                //     planMeterInstallDate: '',
                //     meterBuilder: '',
                //     setupMeterAddr: '',
                //     meterSite:'',
                //     meterBjms:'',
                //     meterBjxs:'',
                // }
                ],
                tableData:[
                    {
                    planMeterInstallDate: '',
                    meterBuilder: '',
                    setupMeterAddr: '',
                    meterSite:'',
                    meterBjms:'',
                    meterBjxs:'',
                }
                ]
            }


            
        },
        mounted(){
          this.getDictionary();
          this.getWorkStaffList();
          eventBus.$on("sendSelectList",data=>{
            this.NewtableData=[]
            this.selectList=data
            let meterBjmsName="";
            let meterBjxsName="";
            this.keylength=this.selectList.length
            //console.log("Single:"+JSON.stringify(this.selectList));
            for(let i=0;i<this.selectList.length;i++){
              //console.log(this.selectList[i].planMeterInstallDate);
              if(this.selectList[i].userInfo.meterBjms==1){
                meterBjmsName='管道井'
              }else if(this.selectList[i].userInfo.meterBjms==2){
                meterBjmsName='地表井'
              }else{
                meterBjmsName='入户表'
              }

              if(this.selectList[i].userInfo.meterBjxs=='1'){
                meterBjxsName='一井一表'
              }else{
                meterBjxsName='一井多表'
              }
              this.NewtableData[i]={
                planMeterInstallDate:this.selectList[i].planMeterInstallDate,
                meterBuilder:this.selectList[i].userInfo.meterBuilder,
                // setupMeterAddr:this.selectList[i].userInfo.setupMeterAddr,
                // meterSite:this.selectList[i].userInfo.meterSite,
                // meterBjms:meterBjmsName,
                // meterBjxs:meterBjxsName,
              }
            }
            //console.log(this.NewtableData);
            
          })
          
        },
        methods:{
          getDictionary() {
            var _this = this;
            var params = {
              busicode: "DictionarySelect",
              //         "data": "MMT,UWS,CMC,RTP,CTL"
              data: "BJXS,CTL"
              //表井形式、模式
            };
            this.$api
              .fetch({
                params: params //参数
              })
              .then(res => {
                _this.dictionaryData = res;
              });
          },
          //确定事件
          changeTab(){
            eventBus.$emit("changeTable",this.tableData)
            this.$emit("closeSGDialog",false);
            //eventBus.$emit("changeStatus",1)
            //console.log("tableData2:"+JSON.stringify(this.tableData));
            // for(let i=0;i<this.selectList.length;i++){
            //   this.selectList[i].planMeterInstallDate=this.tableData[i].planMeterInstallDate
            //   this.selectList[i].userInfo.meterBuilderName=this.tableData[i].meterBuilderName
            // }
          },
          dialogClose(){
                this.$emit("closeSGDialog",false);
                
            },
          meterBuilderChange(userinfo){
            userinfo.meterBuilder = this.workerNameList.filter(item=>item.userAccount ===  userinfo.meterBuilder)[0].userName;
            //this.meterBuilder=this.workerNameList.filter(item=>item.userAccount ===  userinfo.meterBuilder)[0].userName;

          },
          // 施工人员数据获取
          getWorkStaffList() {
            var _this = this;
            var params = {
              busicode: "PostUserSelect",
              data: { postNo: "8" }
            };
            this.$api
              .fetch({
                params: params //参数
              })
              .then(res => {
                _this.workerNameList = res;
                //console.log( _this.workerNameList);
              });
          },
        }
    }
</script>
<style lang="scss" scoped>
.water-meter {
  height: 200px;
  width: 100%;
  overflow: auto;
  .col-2 {
    width: calc(46% + 10px);
  }

  #sendOrderDialog {
    .formBill {
      padding-top: 20px;
    }

    /deep/ .el-dialog {
      height: 40%;
    }
  }

  .button-dialog .el-dialog {
    height: 50%;
  }
  .el-input__icon {
    line-height: 0 !important;
  }
  .table-content {
    height: 40px;
    padding: 5px 0px 0px 0px;
    margin: 0 20px;

    font {
      font-weight: 700;
      padding: 5px 20px;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .add-line {
      float: right;
      margin-right: 20px;
      // margin-bottom: 5px;
      .el-button--info {
        background-color: #b5bac3;
        border-color: #b5bac3;
      }
    }
  }
}
</style>
