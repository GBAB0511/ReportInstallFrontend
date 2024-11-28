
<template>
    <div class="QualityReadingHuiTian">

        <el-dialog
            title="选择水表"
            :visible.sync="dialogVisible"
            width="80%"
            close-on-click-modal
            :before-close="handleClose">

          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="formData" >
              <el-form-item label="抄表日期：">
                <el-date-picker :editable="false" size="mini" v-model="formData.dataList" type="daterange" align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              
              <el-form-item label="抄表员：">
                <el-select v-model="formData.meterReader" size="mini">
                  <el-option v-for="item in meterReaderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="模糊查询：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="册本号/用户编号"></el-input>
              </el-form-item>

              <el-form-item label="抽检比率：">
                  
                <el-select v-model="formData.meterReader" size="mini">
                    <el-option v-for="item in option5" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>

              </el-form-item>
              <el-form-item>
                <el-button class="searchBtn" icon="el-icon-search"></el-button>

              </el-form-item>
            </el-form>
          </div>
          <div class="kl-table">
            <el-table stripe border :data="histroyData.list" class="wuserInfo-table"
            @selection-change="handleSelectionChange" @toggleRowSelection="selectData" highlight-current-row >
                <el-table-column
                type="selection"
                width="55"></el-table-column>
              <el-table-column type="index" label="NO." width="50" fixed="left">

              </el-table-column>
              <el-table-column prop="bookNum" min-width="100"  label="册本号"></el-table-column>
              <el-table-column prop="userNum" min-width="100" label="用户编号"></el-table-column>
              <el-table-column prop="userName" min-width="80" label="用户名称"></el-table-column>
              <el-table-column prop="userAddress" min-width="80" label="用户地址"></el-table-column>
              <el-table-column prop="meterAddress" min-width="80" label="水表口径"></el-table-column>
              <el-table-column prop="meterAddress" min-width="80" label="上期抄码"></el-table-column>
              <el-table-column prop="meterAddress" min-width="80" label="本期抄码"></el-table-column>
              <el-table-column prop="meterAddress" min-width="80" label="本期用水">
              </el-table-column>
          
              <el-table-column prop="meterAddress" min-width="80" label="异常类型"></el-table-column>
              <el-table-column prop="meterAddress" min-width="80" label="异常描述"></el-table-column>
              <el-table-column prop="meterAddress" min-width="80" label="异常照片"></el-table-column>
              <!-- <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click.native="handle(scope.$index, scope.row)" size='mini'>处理</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>

          <span slot="footer" class="dialog-footer">
          <el-button  size="mini" type="primary" @click="getMeterData">确 定</el-button>

              <el-button  size="mini" @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>

         <div class="backfillSubmitForm">
            <el-form :inline="true" size="mini" :model="form" label-width="130px" >
                
            <commonPart :parentToChild="'3'"></commonPart>
            <legend  class="legendColumn">抄表抽查</legend>

                  <el-form-item label="账期：">
                       <el-date-picker
                        v-model="form.month"
                        type="month"
                        placeholder="选择账期">
                        </el-date-picker>
                  </el-form-item>
                  <!-- <el-form-item label="抄表日期：">
                      <el-date-picker
                        v-model="form.month"
                        type="date"
                        placeholder="选择抄表日期">
                        </el-date-picker>
                  </el-form-item> -->

                  <el-form-item label="备注：">
                    <el-input v-model="form.remark" autocomplete="off" type="textarea" placeholder="请输入备注"></el-input>
                  </el-form-item>
            </el-form>
          

             <el-table 
                    stripe border 
                    :data="tableList" 
                    
                    class="wuserInfo-table">

              <el-table-column type="index" label="NO." width="50" fixed="left">
              </el-table-column>

              <el-table-column prop="bookNum" min-width="100" label="册本号">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.bookNum"
                    placeholder="请输入册本号">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="userNum" min-width="80" label="用户编号">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.userNum"
                    placeholder="请输入用户编号">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="price" min-width="80" label="用户名称">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.price"
                    placeholder="请输入用户名称">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="coefficient" min-width="80" label="用户地址">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.startUsage"
                    placeholder="请输入用户地址">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="80" label="水表口径">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入水表口径">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="80" label="抄表日期">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入抄表日期">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="coefficient" min-width="80" label="上期抄码">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.startUsage"
                    placeholder="请输入上期抄码">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="80" label="本期抄码">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入本期抄码">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="coefficient" min-width="80" label="本期用水">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.startUsage"
                    placeholder="请输入本期用水">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="80" label="日均水量">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入日均水量">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="80" label="预估抄码">
                <!-- <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入日均水量">
                  </el-input>
                </template> -->
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="80" label="本次抄码">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="本次抄码">
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="80" label="检查结果">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="检查结果">
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="100" label="备注">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="备注">
                  </el-input>
                </template>
              </el-table-column>

              <!-- <el-table-column prop="coefficient" min-width="100" label="分摊水量">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.startUsage"
                    placeholder="请输入分摊水量">
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="100" label="实际用水量">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入实际用水量">
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column prop="coefficient" min-width="100" label="上期用水">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.startUsage"
                    placeholder="请输入上期用水">
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column prop="stageMoney" min-width="100" label="六期平均">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入六期平均">
                  </el-input>
                </template>
              </el-table-column> -->

              <el-table-column label="操作" width="70" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click.native="edit(scope.$index, scope.row)" style="font-size:12px;">删除</el-button>
                </template>
              </el-table-column>

            </el-table>

            <!-- <legend  class="legendColumn">上传附件</legend>
            <uploadFile ></uploadFile> -->
            
            <legend class="legendColumn">流程处理</legend>
            <procedure ></procedure>
            
        </div>
    </div>
</template>
<script>
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"//公告模块
import uploadFile from '@/components/uploadPic';//上传附件
import procedure from "@/components/procedure"//流程审核
export default {
    name:"QualityReadingHuiTian",
    components: {
      commonPart,
      uploadFile,
      procedure,
    },
    data(){
        return{
            
          histroyData: {
            list:[
              {
                bookNum:"021013",
                userNum:"0236578"
              },
              {
                bookNum:"056013",
                userNum:"0233426578"
              },
              {
                bookNum:"0265613",
                userNum:"0122578"
              },
              {
                bookNum:"027813",
                userNum:"0906578"
              },
            ]
          },
          option5: [
            {
              value: 1,
              label: '3%'
            },
            {
              value: 2,
              label: '5%'
            },
            {
              value: 3,
              label: '8%'
            },
            {
              value: 4,
              label: '10%'
            },
            {
              value: 5,
              label: '15%'
            },
            {
              value: 6,
              label: '20%'
            },
            {
              value: 7,
              label: '25%'
            },
            {
              value: 8,
              label: '30%'
            },
          ],
          meterReaderList: [
            {
              value: 1,
              label: '全部'
            },
            {
              value: 2,
              label: '单飞'
            },
            {
              value: 3,
              label: '胡国飞'
            },
            {
              value: 4,
              label: '胡晓玲'
            },
            {
              value: 5,
              label: '胡志金'
            },
            {
              value: 6,
              label: '蒋保平'
            },
            {
              value: 7,
              label: '李明'
            },
          ],
          formData: {
            meterReader: 1,
            dataList: [],

            con: "",
            watermeterWarehouse: "",
            watermeterWarehouseOptions: [],
            waterMeterManufacturer: "",
            waterMeterManufacturerOptions: [],
            waterMeterType: "",
            waterMeterTypeOptions: [],
            waterMeterCaliber: "",
            waterMeterCaliberOptions: [],
            waterMeterStatus: "",
            waterMeterStatusOptions: [],
            subordinateDepartments: "",
            subordinateDepartmentsOptions: []

          },
          tableList: [
            {
              endType:'1',
              startUsage:"水费",
              endUsage: '14',
              price: "1",
              coefficient: "1.0",
              stageMoney: "0",
              bookNum:"021019",
              userNum:"0236588"
              
            },
            {
              endType:'1',
              startUsage:"污水费",
              endUsage: "28",
              price: "0",
              coefficient: "1.0",
              stageMoney: "37.52",
              bookNum:"021019",
              userNum:"0236579"
            },
            {
              endType:'2',
              startUsage:"",
              endUsage: "",
              price: "",
              coefficient: "",
              stageMoney: "",
              bookNum:"021019",
              userNum:"02365756"
            },
          ],
                
          form: {
            ladderType:'month',
            waterSelect:'',
            priceModel:'',
            mixtrueSelect:'',
            waterLevel:'',
            waterValue:false,
            startTime:'',
            endTime:'',
            bulidReson:'',
            priceDetail:'04',
            state:'1',
            bulidTime:'',
            updateReson:'',
            updataTime:'',
            remark:'',
          },
          dialogVisible: false,
          multipleSelection:[],
      }
    },   
    mounted() {
      eventBus.$on('ccccc', (params) => {
        this.dialogVisible = true;
      });
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      getMeterData(){
        this.dialogVisible = false;
        if(this.multipleSelection.length>0){
          this.multipleSelection.forEach((item)=>{
            this.tableList.push(item);
            this.histroyData.list.forEach((val, index)=>{
              if(item===val){
                this.histroyData.list.splice(index,1)
              }
            })
          })
        }
        
      },


    }
}
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
$theme-color:#297acc;
.QualityReadingHuiTian{
    height: calc(100% - 41px);
    overflow-y: auto;
    .backfillSubmitForm{
        // margin-top: 15px;
        // padding: 10px 20px;
        // // width: 93%
        .el-input--mini /deep/ .el-input__inner{
                width: 100%;
        }
        .toolbar-line{
          width: 4px;
          background: #c4d600;
          border-radius: 4px;
          height: 1.5rem;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
        }
      .info{
        margin:10px 0px;
        // background: #f5f5f5;
        font-weight: 700;
        color:#000;
        height: 1.5rem;
        line-height: 1.5rem;
        padding:0 1rem;
        font-size: 14px;
      }
      .el-form-item{
        width: 33%;
        margin-right: 0px;
        .el-form-item__content{
            width: calc(100% - 130px)!important;
            .el-input__inner,.el-select{
                width: 100% !important;
            }
        }
      }
    }
    
}
</style>
