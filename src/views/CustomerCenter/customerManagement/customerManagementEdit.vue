<template>
  <div class="customerManagementEdit">

    <el-form class="formBill" size="mini"  :inline="true" :model="customerManagementEditForm" label-width="130px" ref="ruleForm" :rules="rules">
      <!-- <legend>客户信息</legend> -->
      <el-form-item label="客户编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="customerManagementEditForm.ctmNo" placeholder="" disabled class="read-only"></el-input>
      </el-form-item>
      <el-form-item label="客户名称：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="customerManagementEditForm.ctmName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="客户地址：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="customerManagementEditForm.ctmAddr" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="客户类型：">
        <el-select v-model="customerManagementEditForm.ctmType" placeholder="">
          <el-option v-for="item in cmeDicData.cttData" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="信用等级：">
        <el-select v-model="customerManagementEditForm.creditLevel" placeholder="">
          <el-option v-for="item in cmeDicData.cdlData" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="customerManagementEditForm.linkTel" placeholder="" ></el-input>
      </el-form-item>
      <el-form-item label="座机号码：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="customerManagementEditForm.linkTel" placeholder="" ></el-input>
      </el-form-item>
      <el-form-item label="手机号码：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="customerManagementEditForm.linkTel" placeholder="" ></el-input>
      </el-form-item>
      <!-- <div class="content">
        <div class="account-left">
          <legend class="legendColumn">
            账户列表
          </legend>
            <el-table stripe border :data="histroyData.list" class="change-tables-table">
              <el-table-column type="index" label="NO." width="50" fixed="left" >
              </el-table-column>

              <el-table-column prop="code" min-width="180" label="账户编号">
              </el-table-column>


              <el-table-column prop="code" min-width="180" label="账户类型">
              </el-table-column>

              <el-table-column prop="code1" min-width="80" label="缴费方式">
              </el-table-column>

              <el-table-column label="操作" fixed="right" width="80">
                <template slot-scope="scope">

                  <el-button type="text" class="noclick" @click="edit(scope.$index, scope.row)">详情</el-button>
                </template>
              </el-table-column>

            </el-table>
        </div>
        <div class="user-right">
          <legend class="legendColumn">
            用户列表
          </legend>
            <el-table stripe border :data="histroyData.list" class="change-tables-table">
              <el-table-column type="index" label="NO." width="80" fixed="left" >
              </el-table-column>

              <el-table-column prop="code" min-width="120" label="用户编号">
              </el-table-column>

              <el-table-column prop="daytime" min-width="160" label="用户名称">
              </el-table-column>

              <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">

                  <el-button type="text" class="noclick" @click="edit1(scope.$index, scope.row)">详情</el-button>
                  <el-button type="text" class="noclick" @click="changeAccount(scope.$index, scope.row)">切换账户</el-button>
                </template>
              </el-table-column>

            </el-table>
        </div>
      </div> -->
    </el-form>
    
<!-- 账户详情 -->
    <el-dialog :title="customerManagementName"   :close-on-click-modal="false" :visible.sync="customerManagementVisible" class="addDialog">

      <el-form size="mini"  class="formBill" :inline="true" :model="countManagementEditForm" label-width="130px" ref="ruleForm">

          <legend class="legendColumn">账户信息</legend>
          <el-form-item label="账户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy" placeholder="101801012001" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="余额：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="1000" disabled class="read-only"></el-input>
          </el-form-item>
          <el-form-item label="账户类型：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="" disabled class="read-only"></el-input>
            <!-- <el-select clearable v-model="countManagementEditForm.aaaa" placeholder="">
              <el-option v-for="(item,index) in countManagementEditForm.aaaas" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select> -->
          </el-form-item>
          <el-form-item label="缴费方式：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="现金支付" disabled class="read-only"></el-input>
            <!-- <el-select clearable v-model="countManagementEditForm.isfines" placeholder="">
              <el-option v-for="(item,index) in countManagementEditForm.PaymentMethod" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select> -->
          </el-form-item>
          
          <!-- <el-form-item :label="v.label" v-for="(v,i) in countManagementEditForm.countMsg" :key="i">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="v.value" :placeholder="v.tips"></el-input>
          </el-form-item> -->
          <el-form-item label="开户行：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="中国银行" disabled class="read-only"></el-input>
            <!-- <el-select clearable v-model="countManagementEditForm.UpdateCodeCopye" placeholder="">
              <el-option v-for="(item,index) in countManagementEditForm.bankName" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select> -->
          </el-form-item>
          <el-form-item label="开户名：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="张三" disabled class="read-only"></el-input>
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.bankCountNum1" placeholder=""> -->
            <!-- </el-input> -->
          </el-form-item>
          <el-form-item label="银行账户：" class='' style="width: calc(46% + 10px)">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="434328953295832432" disabled class="read-only"></el-input>
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.UpdateCodeCopye1" placeholder="">
              <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" size='mini'></el-button>
            </el-input> -->
          </el-form-item>
          <el-form-item label="托号：" class=''>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="4343289532" disabled class="read-only"></el-input>
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.UpdateCodeCopye1" placeholder="">
              <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" size='mini'></el-button>
            </el-input> -->
          </el-form-item>
          <el-form-item label="托收合同号：" class=''>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.PriceStrategy1" placeholder="434328953295832432" disabled class="read-only"></el-input>
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.UpdateCodeCopye1" placeholder="">
              <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" size='mini'></el-button>
            </el-input> -->
          </el-form-item>

          <el-form-item label="备注:" class="Remarks">
            <el-input v-model="countManagementEditForm.remark" autocomplete="off" type="textarea" placeholder="请输入备注"></el-input>
          </el-form-item>

          <legend class="legendColumn">开票信息</legend>
          <!-- <el-form-item label="发票类型：" prop="desc">
             <el-select  clearable v-model="countManagementEditForm.desc" placeholder="">
              <el-option  v-for="(item,index) in countManagementEditForm.descType" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="countManagementEditForm.desc" placeholder=""></el-input> -->
          <el-form-item :label="v.label" v-for="(v,i) in countManagementEditForm.InvoiceInformation" :key="i">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="v.value" :placeholder="v.tips"></el-input>
          </el-form-item>
          <el-form-item label="开户行：">
            <el-select  clearable v-model="countManagementEditForm.year" placeholder="">
              <el-option  v-for="(item,index) in countManagementEditForm.bankName" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行账号：" class=''>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="countManagementEditForm.bankCountNum" placeholder="">
              <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" size='mini'></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="投递方式：">
            <el-select clearable v-model="countManagementEditForm.year" placeholder="自取">
              <el-option v-for="(item,index) in countManagementEditForm.yyy" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="customerManagementVisible = false" size='mini'>保存</el-button>
        <el-button @click="customerManagementVisible = false" size='mini'>返回</el-button>
      </div>
    </el-dialog>

<!-- 用户详情 -->
    <el-dialog :title="UserInformationName" :close-on-click-modal="false" :visible.sync="userInfo" class="UserInformation" @close="closeDialog" >
        <userInfo :parentToChild="'2'"></userInfo>
    </el-dialog>
    
<!-- 切换账户 -->
    
    <el-dialog title="选择账户" class="changeAoccutTabel" :close-on-click-modal="false" :visible.sync="dialogTableVisible">
        
            <el-table highlight-current-row stripe border :data="gridData" class="change-tables-table" @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55">
            </el-table-column>
              <!-- :index="indexMethod" -->
              <el-table-column type="index" label="NO." width="50" fixed="left">
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
            <div slot="footer" class="dialog-footer">
              <el-button size="mini" @click="outerVisidialogTableVisibleble = false">取 消</el-button>
              <el-button size="mini" type="primary" @click="dialogTableVisible = false">确定切换</el-button>
            </div>
    </el-dialog>
    
  </div>
</template>
<script>

import userInfo from "@/components/IntegratedBusiness/UserInformation/userInfoSearch"
import flowingDate from "./flowingDate"
import PredepositDdetailsInfo from "@/components/IntegratedBusiness/UserInformation/PredepositDdetailsInfo"
import changeAoccutTabel from "@/components/IntegratedBusiness/UserInformation/changeAoccutTabel"
export default {
  name: "customerManagementEdit",
  props:['customerManagementEditData','CMEdicData'],
  components:{
    userInfo,
    flowingDate,
    PredepositDdetailsInfo,
    changeAoccutTabel
  },
  data() {
    return {
      cmeDicData:{},
      FlowingTableDate:[],
      cttData:[],
      cdlData:[],
      FlowingTableVisible:false,
      FlowingToolbar:{

      },
      customerManagementEditForm: {
        
      },
      customerManagementName:"账户列表编辑",
      customerManagementVisible:false,
      countManagementEditForm:{
        year: '',
        yyy: [
          {
            name: "自取",
            value: '1'
          },
          {
            name: "邮寄",
            value: '1'
          },
          {
            name: "上门派送",
            value: '1'
          },
        ],
                
        backfillInput:[

            {
                label:"客户编号：",
                value:"",
                tips:"01003152"
            },
            {
                label:"客户名称：",
                value:"",
                tips:"谢顺新"
            },
            {
                label:"客户地址：",
                value:"",
                tips:"宝积山路、体育巷"
            },
            {
                label:"客户类型：",
                value:"",
                tips:"普通用户"
            },
            {
                label:"信用等级：",
                value:"",
                tips:"二级"
            },
            {
                label:"联系人：",
                value:"",
                tips:"谢顺新"
            },
            {
                label:"座机号码：",
                value:"",
                tips:"13662592308"
            },
            {
              label:"手机号码：",
              value:"",
              tips:"13662592308"
            },
        ],
        countMsg:[
            {
                label:"余额：",
                value:"",
                tips:""
            },

            
            
            
        ],
        aaaa: '',
        aaaas: [
            {
                name:"公户",
                value:"1"
            },
            {
                name:"私户",
                value:"2"
            }
        ],
        countMsgOrder:[
            // {
            //     label:"开户名：",
            //     value:"",
            //     tips:"梅州粤海水务有限公司"
            // },
            // {
            //     label:"银行账户：",
            //     value:"",
            //     tips:"101801012001"
            // },
            {
                label:"托号：",
                value:"",
                tips:"101801012001"
            },
            {
                label:"托收合同号：",
                value:"",
                tips:"101801012001"
            },
            
            // {
            //     label:"银行签约日期：",
            //     value:"",
            //     tips:"20180-02-13"
            // },
        ],
        InvoiceInformation:[
              {
                label:"单位名称：",
                value:"",
                tips:"梧州水司"
            },
            {
                label:"纳税人识别号：",
                value:"",
                tips:"12441400714861777E "
            },
            {
                label:"联系地址：",
                value:"",
                tips:""
            },
            {
                label:"座机号码：",
                value:"",
                tips:""
            },

            
        ],
        bankCountNum:"",
        desc:"",
        userNume:"",
        descType:[
          {
            name:'收据',
            value:0,
          },
          {
            name:'普通发票',
            value:1,
          },
          {
            name:'专用发票',
            value:2,
          },
        ],
        descoptions:[
            {
                name:"普通用户",
                value:"1"
            },
            {
                name:"VIP客户",
                value:"2"
            },
            {
                name:"大客户",
                value:"3"
            },
        ],
        PaymentMethod:[
            {
                name:"托收",
                value:"1"
            },
            {
                name:"代扣",
                value:"2"
            },
            {
                name:"其他",
                value:"3"
            }
        ],
        bankName:[
            {
                name:"中国银行",
                value:'1'
            }
        ],
        descoptions:[
            {
                name:"启用",
                value:'2'
            },
            {
                name:"停用",
                value:'4'
            },
        ],
        PriceStrategy:"",
        isfines:"",
        UpdateCodeCopye:"",
        Remarks:"",
        year:""
      },
      rules: {
        userNume: [
          { required: true, message: '请输入用户编号', trigger: 'blur' },
        ],
        // desc: [
        //   { required: true, message: '请输入用户编号', trigger: 'blur' },
        // ]
      },
      histroyData: {},
      UserInformationName:"客户资料-查看",
      userInfo:false,
      dialogTableVisible:false,
      gridData: [{
            areaId: null,
            areaName: [],
            code: "101801012001",
            concentrator: "银行代扣",
            connect: null,
            daytime: "深圳市粤港科技有限公司",
            endTime: null,
            factoryName: "深圳市东湖公园水库大楼227",
            fcode: "梅州市梅新路39号",
          }, {
            areaId: null,
            areaName: [],
            code: "101801012001",
            concentrator: "银行代扣",
            connect: null,
            daytime: "深圳市粤港科技有限公司",
            endTime: null,
            factoryName: "深圳市东湖公园水库大楼227",
            fcode: "梅州市梅新路39号",
        }, {
            areaId: null,
            areaName: [],
            code: "101801012002",
            concentrator: "银行代扣",
            connect: null,
            daytime: "深圳市粤港科技有限公司",
            endTime: null,
            factoryName: "深圳市东湖公园水库大楼227",
            fcode: "梅州市梅新路39号",
        }, {
            areaId: null,
            areaName: [],
            code: "101801012003",
            concentrator: "银行代扣",
            connect: null,
            daytime: "深圳市粤港科技有限公司",
            endTime: null,
            factoryName: "深圳市东湖公园水库大楼227",
            fcode: "梅州市梅新路39号",
        }],

    }
  },
  mounted() {
    this.customerManagementEditForm = Object.assign({},this.customerManagementEditData);
    this.cmeDicData = this.CMEdicData;
    this.init();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    submit(){
      return this.customerManagementEditForm;
    },
    Flowing(){
     this.FlowingTableVisible = true

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeAccount(){
      this.dialogTableVisible = true
    },
    init() {
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
      // this.getDictionary()
    },
    //  数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": 'CTT,CDL'
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.$set(_this, 'cttData', res['CTT'])
        _this.$set(_this, 'cdlData', res['CDL'])
      })
    },
    closeDialog(){},
    edit(){
      this.customerManagementVisible = true;
    },
    edit1(){
      this.userInfo = true;
    }
  }
}
</script>
<style lang="scss">
.customerManagementEdit {
  
   .FlowingTabel{
     .el-form-item__content /deep/ .el-date-editor{
           width: 340px;
     }
    .el-dialog__body{
          padding: 10px;
    }
  }
  .UserInformation{
    .el-dialog__body{
      height: calc(100% - 60px);
      padding: 0px;
      overflow-y: auto;
    }
  }
  // .changeAoccutTabel{
  //   .el-dialog__body{
  //         padding: 10px;
  //   }
  // }
  //  .FlowingTabel{
  //    .el-form-item__content /deep/ .el-date-editor{
  //          width: 340px;
  //    }
  //   .el-dialog__body{
  //         padding: 10px;
  //   }
  // }
  .account-left{
    width: 48%;
    float: left;    
    padding: 0px 10px 0px 0px;

  }
  .user-right{    
    width: 50%;
    float: right;
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
}
</style>

