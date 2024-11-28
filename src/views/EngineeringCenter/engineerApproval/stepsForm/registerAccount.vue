<template>
  <div class="registerAccount">
    <legend class="legendColumn">立户</legend>
    <div class="water-meter">
      <div class="table-content">
        <div class="bread-contain">
          <!-- <div style="float:left;">
              单客户的复选框
              <el-radio v-model="radio1" label="1" :value=1>是</el-radio>
              <el-radio v-model="radio1" label="2">否</el-radio>
            </div> -->
            <div class="bread-contain-left">
              <div class="left_content11" style="font-size:12px;margin-left:20px;">
                <!-- 单客户标志
              <el-radio v-model="singleCustomerFlag" :label='1'  @change="SingleCustomer">是</el-radio>
              <el-radio v-model="singleCustomerFlag" :label='0'  @change="SingleCustomer">否</el-radio> -->
              <span>
                <el-tooltip class="item" effect="dark" content="用户编号、装表地址" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" class="fuzzyQueryInput" size="mini" v-model="fuzzyQuery" placeholder="用户编号、装表地址" clearable @keydown.enter.native="demand"></el-input>
                </el-tooltip>
                <el-button size="mini" class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
              </span>
              </div>

            </div>
          <div class="bread-contain-right">
            <el-button style="margin-right:-10px" icon="el-icon-edit" size="mini" type="primary" @click="EditMore()" :disabled='currentStep!=12||permissions!=1'>批量编辑</el-button>
            <!-- <el-button icon="el-icon-download" size="mini" type="primary" @click="dowloadModule">下载模板</el-button> -->
            <el-button icon="el-icon-download" size="mini" type="primary" @click="dowloadModuleNew">下载模板</el-button>
            <el-upload action="/" class="upload-demo" multiple   :http-request="importExcel">
              <el-button  icon="el-icon-download" size="mini" type="primary" :disabled='currentStep!=12||permissions!=1'>导入</el-button>
            </el-upload>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="addRow"
              :disabled='currentStep!=12||permissions!=1'
              >添加</el-button
            >
          </div>
        </div>
      </div>
      <div class="kl-table">
        <el-table

          stripe
          border
          highlight-current-row
          :data="tableData"
          class="wuserInfo-table"
          @selection-change="getSelectList"
        >
        <el-table-column type="selection"  width="40"></el-table-column>
          <el-table-column
            type="index"
            fixed="left"
            label="NO."
            width="50"
            :index="indexMethod"
          ></el-table-column>

            <el-table-column prop="ctmInfo.ctmNo" min-width="130" label="客户编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="accountInfo.accountNo" min-width="130" label="账户编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userInfo.userNo" min-width="130" label="用户编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ctmInfo.ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userInfo.businessAreaName" min-width="150" label="营业区域"></el-table-column>
            <el-table-column prop="userInfo.setupMeterAddr" min-width="200" label="装表地址"></el-table-column>
            <el-table-column prop="userInfo.setupMeterDate" min-width="120" label="装表日期"></el-table-column>

          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">

              <el-button
                type="text"
                @click.native="detail(scope.$index, scope.row)"

              >
                编辑</el-button
              >
                   <el-button
                type="text"
                @click.native="deleteRow(scope.$index,scope.row)"
                :disabled='currentStep!=12||permissions!=1'
              >
                删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
        <!-- 弹出表单添加客户 -->
    <el-dialog title="添加客户" append-to-body v-if="addCtm" :visible.sync="addCtm" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectWater">
      <registerAccountEdit v-if="addCtm" ref="childWarehousing" :sonPermissions='sonPermissions' :permissions='permissions' :singleCustomerFlag='singleCustomerFlag'  :wayOpen="wayOpen"  :idCuster="detailId" :editData="editData" :listIds="listIds"></registerAccountEdit>

      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="fixDialogSelectWater" :disabled='currentStep!=12||permissions!=1'>确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogSelectWater" >取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量编辑 -->
    <el-dialog title="批量编辑"  :visible.sync='showEdit' class="common-dialog showEdit" style="height:100%">
      <registerSingle style="margin-top:60px"  @changeRegisterInfo='changeRegisterInfo' ref='getRegisterSingle' :selectData='selectData'></registerSingle>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="editMoreData">确 定</el-button>
        <el-button type="info" size="mini" plain @click="showEdit=!showEdit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import registerAccountEdit from './registerAccountEdit'
import registerSingle from './registerSingle'
export default {
  components:{registerAccountEdit,registerSingle},
  props: ["editData", "disabled",'currentStep','detailInfo'],
  data() {
    return {
      sonPermissions:1,
      permissions:1,
      selectData:[],
      showEdit:false,
      singleCustomerFlag:1,
      fuzzyQuery: "",
      tableData: [],
      addCtm: false,
      listIds:[],
       detailId:"",
       busicode:"",
      wayOpen:"PjMeterDetail"
    };
  },
  mounted() {
    this.init();
    //立户 权限处理， 当前用户不在范围内只读
        let names=this.detailInfo.consult.processHandleMan.split(',')
        if(names.indexOf(this.$store.state.userName)>-1){
          // console.log('当前用户存在权限');
          // this.permissions=0
          // this.sonPermissions=0
        }else{
          this.permissions=0
          this.sonPermissions=0
        }

    eventBus.$on("waterValidate",item=>{
        eventBus.$emit("waterLength2",this.tableData.length)
        //console.log(this.tableData.length);
    })
    eventBus.$on("initBusinessArea",item=>{
      this.init()
    })
    if(this.detailInfo!=undefined&&this.detailInfo.consult.pjType==4){
      this.singleCustomerFlag=1
    }else{
      this.singleCustomerFlag=0
    }
    // console.log(this.detailInfo.consult.PjType);
    // console.log(this.singleCustomerFlag);
    eventBus.$on('rePrintSGHT',item=>{
      this.printAll(item)
    })
  },
  destroyed(){

    eventBus.$off("waterValidate")
    eventBus.$off("initBusinessArea")
    eventBus.$off('rePrintSGHT')
  },
  methods: {
    demand(){
      let _this = this;
      let params = {
        busicode: "PjMeterList",
        data: { 
          consultId: this.editData.consultId,
          fuzzyQuery: this.fuzzyQuery
        }
      };
      this.$api.fetch({
        params: params //参数
      }).then(res => {
        _this.tableData = res;
        this.listIds = res.map(item => item.id);
      });
    },
    EditMore(){
      if(this.selectData.length==0){
        this.$message({
          message: '请先选择要批量修改的数据',
          type: 'error'
        });
        return
      }
      this.showEdit=true
      this.$refs.getRegisterSingle.clearTable()
    },
    printAll (name) {
      let myPjMeterIdList=[]
      if(this.selectData.length==0){
        this.$message({
          type:'warning',
          message:'请先勾选需要打印的数据'
        })
        return
      }
      for(let i=0;i<this.selectData.length;i++){
        myPjMeterIdList.push(this.selectData[i].id)
      }
      let params = {
        busicode: name,
        data: { pjMeterIdList:myPjMeterIdList}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'NonResidentWaterSupplyContract', '', data[i], this);
        }
        // this.$notify({
        //   title: '成功',
        //   message: '正在打印...',
        //   type: 'success'
        // })
      })

    },
    dowloadModule(){
      var params = {
        busicode:"PjMeterRegisterAccountExport",
        data: {
            consultId: this.detailInfo.consult.id,
            pjMeterIdList: this.listIds,
            page:1,
            pageCount:99999
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
          "/project/exportExcel.api?json=" +
          encodeURIComponent(JSON.stringify(params))
      );
    },
    dowloadModuleNew(){
      var params = {
        busicode:"NewPjMeterRegisterAccountExport",
        data: {
            consultId: this.detailInfo.consult.id,
            // pjMeterIdList: this.listIds,
            page:1,
            pageCount:99999
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
          "/project/export.api?json=" +
          encodeURIComponent(JSON.stringify(params))
      );
    },
    changeRegisterInfo(e){
      for(let j=0;j<this.selectData.length;j++){
        this.selectData[j].ctmInfo.certNo=e[0].certNo==undefined?undefined:e[0].certNo
        this.selectData[j].ctmInfo.ctmName=e[0].ctmName==undefined?undefined:e[0].ctmName
        this.selectData[j].ctmInfo.mobile=e[0].mobile==undefined?undefined:e[0].mobile
        this.selectData[j].ctmInfo.faxNumber=e[0].faxNumber==undefined?undefined:e[0].faxNumber
        this.selectData[j].accountInfo.invoiceTitle=e[0].invoiceTitle==undefined?undefined:e[0].invoiceTitle
        this.selectData[j].accountInfo.invoiceTax=e[0].invoiceTax==undefined?undefined:e[0].invoiceTax
        this.selectData[j].accountInfo.invoiceAddr=e[0].invoiceAddr==undefined?undefined:e[0].invoiceAddr
        this.selectData[j].accountInfo.invoiceLink=e[0].invoiceLink==undefined?undefined:e[0].invoiceLink
        this.selectData[j].accountInfo.invoiceBank=e[0].invoiceBank==undefined?undefined:e[0].invoiceBank
        this.selectData[j].accountInfo.invoiceAccount=e[0].invoiceAccount==undefined?undefined:e[0].invoiceAccount
        this.selectData[j].accountInfo.vatFlag=e[0].vatFlag==undefined?undefined:e[0].vatFlag
        this.selectData[j].accountInfo.preInvoicing=e[0].preInvoicing==undefined?undefined:e[0].preInvoicing
        this.selectData[j].accountInfo.mergeInvoicing=e[0].mergeInvoicing==undefined?undefined:e[0].mergeInvoicing
        // console.log(e[0].useWaterType);
        let k=e[0].useWaterType==undefined?undefined:e[0].useWaterType.length
        this.selectData[j].userInfo.useWaterType=k==undefined?undefined:e[0].useWaterType[k-1]
        if(this.selectData[j].userInfo.accountNos==''){
          this.selectData[j].userInfo.accountNos=undefined
        }
        if(this.selectData[j].userMixtureData==''){
          this.selectData[j].userMixtureData=undefined
        }
        if(this.selectData[j].discountData==''){
          this.selectData[j].discountData=undefined
        }
      }
      var params = {
        busicode: "PjMeterBatchUpdate",
        data: this.selectData
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res!==''){
            this.$message({
              message: res,
              type: 'success'
            });
            this.showEdit=false
            this.init()
          }else{
            this.$message({
              message: '立户批量数据更新失败',
              type: 'error'
            });
          }
          // console.log(res);

        });
    },
    //批量编辑确定
    editMoreData(){
      // eventBus.$emit('editMoreData',this.editData)
      this.$refs.getRegisterSingle.submit()
    },
    getSelectList(e){
      this.selectData=e
      this.$emit('selectTableData',this.selectData.length)
    },
    SingleCustomer(data){
      this.singleCustomerFlag=data
    },
    fixDialogSelectWater() {
      let _this = this;
      let validateMsg = this.$refs.childWarehousing.validateFrom();
      validateMsg.then(
        function (data){
          let ctmData = JSON.parse(JSON.stringify(_this.$refs.childWarehousing.getFormbData()));
          // ctmData.singleCustomerFlag=this.singleCustomerFlag
          // console.log(JSON.stringify(_this.$refs.childWarehousing.getFormbData()));
          //console.log("ctmData",JSON.stringify(ctmData));
          let params = {
            busicode: _this.busicode,
            data: ctmData
          };
          _this.$api.fetch({ params }).then(res => {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
            // this.$refs.childWarehousing.$refs.priceInfo.userMixtureSave(res.id);
            // this.$refs.childWarehousing.$refs.priceInfo.userDiscountSave(res.id);
            _this.$refs.childWarehousing.$refs.priceInfo.wPopulationSubmit(res.id)
            _this.init()
            _this.closeDialogSelectWater();
          });
        },
        function (reason){
          _this.$message({
            type: 'error',
            message: reason
          });
        })
    },
        //将详情变成列表行数据
    getRowData(res){
      let val={
        id:res.id,
        ctmNo:res.ctmNo,
        accountNo:res.accountNo,
        userNo:res.userNo,
        ctmName:res.ctmName,
        bookNo:res.bookNo,
        businessAreaName:res.businessAreaName,
        setupMeterAddr:res.setupMeterAddr,
        clientContractAddr:res.clientContractAddr,
        setupMeterDate:res.setupMeterDate,
      }
      return val
    },

    choosectm() {
      this.choosectmVisible = true;
    },
        importExcel(file){
      let _this = this;
      let params = {
        // busicode: "PjMeterImport",
        busicode:'PjMeterRegisterAccountImport',
        type: 'import',
        singleCustomerFlag: _this.singleCustomerFlag,
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
          this.$message({
            type: "success",
            message: "导入成功"
          });
        // this.$refs.childList.addList(res.returnMap);
        // this.errorShow = res.flag>0?true:false;
        // if(res.flag>0){
        //   this.$message({
        //     type: "warning",
        //     message: "存在导入失败数据，请下载错误修改后再导入"
        //   });
        // }else{
        //   this.$message({
        //     type: "success",
        //     message: "导入成功"
        //   });
        //   this.tableData=res
        // }

        // for(let i=0;i<res.length;i++){
        //   this.tableData.push(res[i])
        // }
        this.init()
      })
    },
        // 删除行
    deleteRow(index,row) {
      //console.log(row)
        this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "pjMeterDelete",
          data: {id:row.id}
        };
        this.$api.fetch({ params }).then(res => {
          this.init()
          console.log('删除');
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.addCtm=false;
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    chooseAccount() {
      this.chooseAccountVisible = true;
    },
        addRow(){
        this.detailId=""
        this.busicode="PjMeterInsert"
        this.addFlag=-1,
        this.addCtm=true;

    },
    closeDialogSelectWater(){
        this.addCtm=false;
    },
        detail(index,row){
        let _this = this
        _this.busicode="PjMeterUpdate"
        _this.addFlag=index;
        _this.detailId=row.id
        _this.addCtm=true;
        for(let i=0;i<this.tableData.length;i++){
          if(row.id==this.tableData[i].id){
              // eventBus.$emit('setRegisterAddr',this.tableData[i].userInfo.setupMeterAddr)
              localStorage.setItem('setRegisterAddr',this.tableData[i].userInfo.setupMeterAddr)
              break;
          }
        }
    },
        //添加
   addRow(){
        this.detailId=""
        this.busicode="PjMeterInsert"
        this.addFlag=-1,
        this.addCtm=true;
        setTimeout(()=>{
          if(this.singleCustomerFlag==0&&this.tableData.length!=0){
            eventBus.$emit('setTableAddr',{
              no:4,
              data:{},
              singleCustomerFlag:this.singleCustomerFlag
            })
          }
        },200)
    },
       // 导入错误按钮
    exportErrorExcel() {
      var params = {
        busicode: "OExport",
        data: {
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
       window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },

    //初始化
    init() {
      let _this = this;
      let params = {
        busicode: "PjMeterList",
        data: { consultId: this.editData.consultId }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
          // console.log('PjMeterList',JSON.stringify(res));
          //提交前校验
          //console.log('init');
          eventBus.$emit('validateRegister',res)
          this.listIds = res.map(item => item.id);
        });
    },
        indexMethod(index) {//获取表格序号
      return   (index+1)
    },
  },
  watch: {
    editData(val) {
      if (val) {
        this.form = { ...val };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.common-dialog .el-dialog__body{
  height: 400px !important;
}
/deep/.common-dialog{
  height: 540px !important;
  width:70%;
  margin-left:17%
}
/deep/.common-dialog .el-dialog__headerbtn{
  margin-top: -5px;
}
/deep/.bread-contain-left{
  float: left;
  width: 50%;
  text-align: left;
  line-height: 40px;
}
.registerAccount {
  .col-2 {
    width: calc(46% + 10px);
  }
  .el-input{
    width: 200px;
  }
  /deep/ .el-input--mini .el-input__inner{
    width: 200px;
  }
}
.fuzzyQueryInput .el-input__inner{
  width: 200px !important;
}
</style>
