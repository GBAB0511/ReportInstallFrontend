<template>
  <!-- 工程中心-多水表录入 -->
  <div class="water-meter">
        <div class='table-content' v-if="!NotDisabled">
          <el-button-group class="add-line">
            <el-button type="primary" size="mini"  icon="el-icon-plus" @click="addRow()" ></el-button>
          </el-button-group>
        </div>
      <div class="kl-table">
      
        <el-table 
          v-if="tableShow"        
          stripe border
          highlight-current-row
          :data="tableData" 
          class="wuserInfo-table">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="userNo" min-width="130" label="用户编号"  >
              <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.userNo" :disabled="true" @input="e => input = inputMe(e)">
                  </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="houseCert" min-width="100" label="房产证号"  >
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.houseCert" :disabled="NotDisabled" @input="e => input = inputMe(e)">
                </el-input>
              </template>
            </el-table-column>

            <el-table-column prop="contractNo" min-width="120" label="供水合同编号" >
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.contractNo" :disabled="NotDisabled" @input="e => input = inputMe(e)">
                </el-input>
              </template>
            </el-table-column>

            <el-table-column prop="contractAddr" min-width="150" label="供水合同签订地址" >
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.contractAddr" :disabled="NotDisabled" @input="e => input = inputMe(e)">
                </el-input>
              </template>
            </el-table-column>

          <el-table-column prop="contractDate" min-width="120" label="合同签订日期">
            <template slot-scope="scope">
                <el-date-picker v-model="scope.row.contractDate" :disabled="NotDisabled" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" >
                </el-date-picker>
            </template>
          </el-table-column>

          <el-table-column prop="openDate" min-width="120" label="开户日期" >
            <template slot-scope="scope">
                <el-date-picker v-model="scope.row.openDate" :disabled="NotDisabled" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" >
                </el-date-picker>
              </template>
          </el-table-column> 
          
          <el-table-column prop="documentType"   min-width="100" label="行业分类" >
            <template slot-scope="scope">
              <el-select 
                v-model="scope.row.tradeClassify" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                  <el-option v-for="item in tradeClassifyOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column prop="meterType"   min-width="100" label="水表类型" >
            <template slot-scope="scope">
              <el-select 
                v-model="scope.row.meterType" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                  <el-option v-for="item in dictionaryData.MMT" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column prop="useWaterObject"   min-width="100" label="用水对象" >
            <template slot-scope="scope">
              <el-select 
                v-model="scope.row.useWaterObject" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                  <el-option v-for="item in dictionaryData.UWS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column prop="meterUse"   min-width="100" label="水表用途" >
            <template slot-scope="scope">
              <el-select 
                v-model="scope.row.meterUse" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                  <el-option v-for="item in dictionaryData.CMC" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="fatherMeterNo" min-width="100" label="总表编号">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   v-model="scope.row.fatherMeterNo" :disabled="NotDisabled"  size="mini" clearable @input="e => input = inputMe(e)" >
              </el-input>
            </template>
          </el-table-column>

          <el-table-column prop="meterNo" min-width="100" label="水表编号">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   v-model="scope.row.meterNo" :disabled="NotDisabled" size="mini" clearable @input="e => input = inputMe(e)">
              </el-input>
            </template>
          </el-table-column>

           <el-table-column prop="concentratorNo" min-width="100" label="集中器">
            <template slot-scope="scope">
              <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   v-model="scope.row.meterNo" :disabled="NotDisabled" size="mini" clearable >
              </el-input> -->
            <el-select
                   v-model="scope.row.concentratorNo"
                  clearable
                 size="mini"
                >
            <template v-for="item_s in concentratorList">
              <el-option
                :key="item_s.code"
                :label="item_s"
                :value="item_s"
              ></el-option>
            </template>
          </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="100" label="装表地址">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.setupMeterAddr" :disabled="NotDisabled" @input="e => input = inputMe(e)">
              </el-input>
            </template>
          </el-table-column>
  
          
          <el-table-column prop="setupMeterLocation" min-width="100" label="装表位置">
            <template slot-scope="scope">
              <!--<el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.setupMeterLocation" :disabled="NotDisabled">
              </el-input>-->
              <el-select clearable v-model="scope.row.setupMeterLocation" placeholder :disabled="NotDisabled">
                <el-option
                  v-for="(item,index) in dictionaryData.CTL"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="setupMeterDate" min-width="130" label="装表日期">
            <template slot-scope="scope">
                <el-date-picker v-model="scope.row.setupMeterDate" :disabled="NotDisabled" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" >
                </el-date-picker>
              </template>
          </el-table-column> 

          <el-table-column prop="bookNo" min-width="100" label="册本号">
            <template slot-scope="scope">
              <!--el-input v-model="scope.row.bookNo" :disabled="NotDisabled">
              </el-input-->
              <el-select v-model="scope.row.bookNo"  placeholder=""  clearable :disabled="NotDisabled">
                <el-option v-for="(item) in businessAreaOptions" :key="item.bookNo" :label="item.bookNo" :value="item.bookNo"></el-option>
              </el-select>
            </template>
          </el-table-column>
  
          
          <el-table-column prop="sortNo" min-width="100" label="排序号">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.sortNo" :disabled="NotDisabled" @input="e => input = inputMe(e)">
              </el-input>
            </template>
          </el-table-column>
          
          <el-table-column prop="meterReadingCycle"   min-width="100" label="抄表周期">
            <template slot-scope="scope">
              <el-select 
                v-model="scope.row.meterReadingCycle" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                  <el-option v-for="item in dictionaryData.RTP" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column prop="useWaterType"   min-width="100" label="用水类型">
            <template slot-scope="scope">
              <el-cascader
                  :disabled="NotDisabled"
                  v-model="scope.row.useWaterType"
                  :options="useWaterTypeOptions"
                  :show-all-levels="false"
                  :props="props">
                </el-cascader>
              <!-- <el-select 
                v-model="scope.row.useWaterType" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                
                <el-option label="机械表" value="0"></el-option>
                <el-option label="智能表" value="1"></el-option>
              </el-select> -->
            </template>
          </el-table-column>
          
          <el-table-column prop="inflate"   min-width="100" label="是否加压">
            <template slot-scope="scope">
              <el-select 
                v-model="scope.row.inflate" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                <el-option label="是" :value="0"></el-option>
                <el-option label="否" :value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column prop="secondaryWater"   min-width="100" label="是否二供">
            <template slot-scope="scope">
              <el-select 
                v-model="scope.row.secondaryWater" :disabled="NotDisabled"
                @keyup.esc.native="cancel(scope.$index, scope.row)">
                <el-option label="是" :value="0"></el-option>
                <el-option label="否" :value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>

            <el-table-column label="操作" fixed="right" width="100" >
              <template slot-scope="scope">
                <el-button 
                  type="text" 
                  @click.native="reMove(scope.$index)" 
                  :disabled="NotDisabled"
                >
                删除</el-button>
                <el-button 
                  type="text" 
                  @click.native="copyRow(scope.row)" 
                  :disabled="NotDisabled"
                >
                复制</el-button>
              </template>
            </el-table-column>

        </el-table>


      </div>
  </div>
</template>
<script>
export default {
  // SetAccount 立户节点
  //id 单据id
  //NotDisabled 是否可修改
  props:["NotDisabled","bookNoShow","SetAccount","id"],
  data(){
    return {
      businessAreaOptions:[],
      maxHeight: 0,
      oldData:[],
      tableShow: true,
      tableData:[],
      tableQuery:{
        consultId:'',
        userInfo:[]
      },
      
      props: {//树结构格式
        value: 'id',
        label: 'name'
      },
      dictionaryData:[],//数据字典
      tradeClassifyOptions:[],
      useWaterTypeOptions:[],//用水类型
      concentratorList:[],//集中器
    };
  },
  mounted(){
    this.getDictionary();
    this.SelectTradeClassifyOptions();
    this.SelectUseWaterTypeOptions();
    
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.water-meter .kl-table', ['.water-meter .block'])
      if(this.tableData.length===0){
        this.addRow();
      }
    })
    eventBus.$on('openInit', (item) => { 
      this.init();
    })

  },
  methods:{
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    	//初始化
     init() {
      let _this = this
      this.tableQuery.consultId = this.id;
      
      let params = {
          "busicode": "PjMeterListOld",
          "data": {'consultId':this.tableQuery.consultId},
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        
        //this.tableData = JSON.parse(JSON.stringify(res)); 
        this.$nextTick(()=>{
          _this.tableData=undefined
          res.forEach(item=>{
          item.accountNos =  item.accountNos === ""?[]:  item.accountNos;
          });  
          //this.$set(this,'tableData',JSON.parse(JSON.stringify(res))) 
          _this.tableData = JSON.parse(JSON.stringify(res));
           _this.getConcentartorOptions(_this.tableData[0].adminArea)
          if(this.tableData.length===0){
            this.addRow();
          }
        })
      })
    }, 
    
    	//初始化
     initDraft(val) {
      let _this = this
      this.tableQuery.consultId = val;
      let params = {
          "busicode": "PjMeterListOld",
          "data": {'consultId':this.tableQuery.consultId},
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res; 
        // _this.getConcentartorOptions(_this.tableData.adminArea)
      })
      
    },
getConcentartorOptions(val){
      let params = { 
        busicode: 'ConcentratorSelect',
            data: {"adminArea":val} 
        };
       this.$api.fetch({ params }).then((res) => {
            this.concentratorList = res
         })    
      
    },
    changeAreaNull(val){
      for(let i =0;i<this.tableData.length;i++){
          this.tableData[i].bookNo='';
      }
      this.changeArea(val)
    },
    changeArea(val){
      let _this = this;

      if(val){
        let businessArea = this.common.handleTreeData(val);
        let params = {
          busicode: "BaseBookList",
          data: {"businessArea":businessArea,"page":1,"pageCount":99}
        };
          this.$api.fetch({
            params: params,//参数 
          }).then(res => {
            this.businessAreaOptions = res.list;

          })
      }
    },
    //水表录入-删除
    reMove(index){
      this.$confirm('确认删除该行数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index,1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    copyRow(row) {
      let data = {
        id: "",
        userNo: "",//用户编号
        houseCert: "",//房产证号
        contractNo: "",//供水合同编号
        contractAddr: "",//供水合同签订地址
        contractDate: row.contractDate,//供水合同签订时间
        openDate: row.openDate,//开户日期
        comments: row.comments,//备注
        tradeClassify: row.tradeClassify,//行业分类
        meterType: row.meterType,//水表类型
        useWaterObject: row.useWaterObject,//用水对象
        meterUse: row.meterUse,//水表用途
        fatherMeterNo: row.fatherMeterNo,//总表编号
        meterNo: row.meterNo,//水表编号
        setupMeterAddr: row.setupMeterAddr,//装表地址
        setupMeterLocation: row.setupMeterLocation,//装表位置
        setupMeterDate: row.setupMeterDate,//装表日期
        bookNo: row.bookNo,//册本号
        sortNo: row.sortNo,//排序号
        meterReadingCycle: row.meterReadingCycle,//抄表周期
        useWaterType: row.useWaterType,//用水类型
        inflate: row.inflate,//是否加压
        secondaryWater: row.secondaryWater,//是否二供
        concentratorNo:row.concentratorNo,//集中器
      }
      this.tableData.push(data);
    },
    // 添加行
    addRow() {
      this.tableData.push({
        id: "",
        userNo: "",//用户编号
        houseCert: "",//房产证号
        contractNo: "",//供水合同编号
        contractAddr: "",//供水合同签订地址
        contractDate: "",//供水合同签订时间
        openDate: "",//开户日期
        comments: "",//备注
        tradeClassify: "",//行业分类
        meterType: "",//水表类型
        useWaterObject: "",//用水对象
        meterUse: "",//水表用途
        fatherMeterNo: "",//总表编号
        meterNo: "",//水表编号
        setupMeterAddr: "",//装表地址
        setupMeterLocation: "",//装表位置
        setupMeterDate: "",//装表日期
        bookNo: "",//册本号
        sortNo: "",//排序号
        meterReadingCycle: "",//抄表周期
        useWaterType: "",//用水类型
        inflate: "",//是否加压
        secondaryWater: "",//是否二供
        concentratorNo:"",//集中器
      });
    },
    
    //行业分类下拉框
    SelectTradeClassifyOptions() {
      let _this = this
      let params = {
        "busicode": "TradeClassifySelect",
        "data": {
          // "businessAbodeId":id
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tradeClassifyOptions = res;
      })
    },
    
    //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let _this = this
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.useWaterTypeOptions = data;
      })
    },
    //树结构数据处理
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMT,UWS,CMC,RTP,CTL"
        //水表类型、用水对象、水表用途、抄表方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    downloadExcel() {
      var params = {
        busicode: "PjConsultMsExport",
        data: {
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(this.common.getExportExcelIp() +"/project/exportExcel.api?json=" +encodeURIComponent(JSON.stringify(params))
      );
    },
    indexMethod(index) {//获取表格序号
      return   (index+1)
    },
    //多水表保存
    SaveWaterMeter(val){
      var _this = this
      let test = [];
      console.log(this.tableData);
      for(let i =0;i<this.tableData.length;i++){
        let data ={
          'id': _this.tableData[i].id ,
          'userNo': _this.tableData[i].userNo ,//用户编号
          'houseCert': _this.tableData[i].houseCert ,//房产证号
          'contractNo': _this.tableData[i].contractNo ,//供水合同编号
          'contractAddr': _this.tableData[i].contractAddr ,//供水合同签订地址
          'contractDate': _this.tableData[i].contractDate ,//供水合同签订时间
          'openDate': _this.tableData[i].openDate ,//开户日期
          'comments': _this.tableData[i].comments ,//备注
          'tradeClassify': _this.tableData[i].tradeClassify ,//行业分类
          'meterType': _this.tableData[i].meterType ,//水表类型
          'useWaterObject': _this.tableData[i].useWaterObject ,//用水对象
          'meterUse': _this.tableData[i].meterUse ,//行业分类
          'fatherMeterNo': _this.tableData[i].fatherMeterNo ,//总表编号
          'meterNo': _this.tableData[i].meterNo ,//水表编号
          'setupMeterAddr': _this.tableData[i].setupMeterAddr ,//装表地址
          'setupMeterLocation': _this.tableData[i].setupMeterLocation ,//装表位置
          'setupMeterDate': _this.tableData[i].setupMeterDate ,//装表日期
          'bookNo': _this.tableData[i].bookNo ,//册本号
          'sortNo': _this.tableData[i].sortNo ,//排序号
          'meterReadingCycle': _this.tableData[i].meterReadingCycle ,//抄表周期
          'useWaterType': this.common.handleTreeData(_this.tableData[i].useWaterType) ,//用水类型
          'inflate': _this.tableData[i].inflate ,//是否加压
          'secondaryWater': _this.tableData[i].secondaryWater ,//是否二供
          'concentratorNo': _this.tableData[i].concentratorNo ,//集中器
        }
        test.push(data) 
      }
      var params = {
        "busicode": "PjMeterSave",
        "data": {
          'consultId': val,
          'userInfo' : test
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        /*用水咨询只显示保存成功一次，故去掉这个
        this.$notify({
          title: '成功',
          message: '多水表保存成功',
          type: 'success'
        });*/
      })
    },
    getData(){
      var _this = this
      let test = [];
      for(let i =0;i<this.tableData.length;i++){
        let data ={
          'id': _this.tableData[i].id ,
          'userNo': _this.tableData[i].userNo ,//用户编号
          'houseCert': _this.tableData[i].houseCert ,//房产证号
          'contractNo': _this.tableData[i].contractNo ,//供水合同编号
          'contractAddr': _this.tableData[i].contractAddr ,//供水合同签订地址
          'contractDate': _this.tableData[i].contractDate ,//供水合同签订时间
          'openDate': _this.tableData[i].openDate ,//开户日期
          'comments': _this.tableData[i].comments ,//备注
          'tradeClassify': _this.tableData[i].tradeClassify ,//行业分类
          'meterType': _this.tableData[i].meterType ,//水表类型
          'useWaterObject': _this.tableData[i].useWaterObject ,//用水对象
          'meterUse': _this.tableData[i].meterUse ,//行业分类
          'fatherMeterNo': _this.tableData[i].fatherMeterNo ,//总表编号
          'meterNo': _this.tableData[i].meterNo ,//水表编号
          'setupMeterAddr': _this.tableData[i].setupMeterAddr ,//装表地址
          'setupMeterLocation': _this.tableData[i].setupMeterLocation ,//装表位置
          'setupMeterDate': _this.tableData[i].setupMeterDate ,//装表日期
          'bookNo': _this.tableData[i].bookNo ,//册本号
          'sortNo': _this.tableData[i].sortNo ,//排序号
          'meterReadingCycle': _this.tableData[i].meterReadingCycle ,//抄表周期
          'useWaterType': this.common.handleTreeData(_this.tableData[i].useWaterType) ,//用水类型
          'inflate': _this.tableData[i].inflate ,//是否加压
          'secondaryWater': _this.tableData[i].secondaryWater ,//是否二供
        }
        test.push(data) 
      }
      return test
    },
  },
  
  watch:{
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  },
}
</script>
<style lang="scss">
  .water-meter{
    height: 100%;
    width: 100%;

    .el-input__icon{
      line-height: 0 !important;
    }
    .table-content{
      height: 40px;
      padding: 5px 0px 0px 0px;
      margin: 0 20px;

      font{
        font-weight: 700;
        padding: 5px 20px;
        font-size: 12px;
        margin-bottom: 5px;
      }
      .add-line {
        float: right;
        margin-right: 20px;
        // margin-bottom: 5px;
        .el-button--info{
          background-color: #b5bac3;
          border-color: #b5bac3;
        }
      }
    }
  }
  
</style>