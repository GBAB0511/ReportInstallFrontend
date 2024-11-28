<template>
  <div class="ApartAccountDetail">
    <el-form :model="formData" ref="billForm" class="formBill" :inline="true" size="mini" label-width="130px">
      <billInfo v-if="billStute == 'Update'" ref="billInfo" :editType="0"></billInfo>
      <el-form-item v-if="disabledEdit" label="证件号码：" class="width450" :class="{ 'disable-item': disabledEdit}">
        <span>{{ctmData.certNo}}</span>
      </el-form-item>

      <div :class="{ submitEditRight: isActive, submitEditRightNone: !isActive }">
        <div class="toolbar" v-if="!disabledEdit">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="130px" @submit.native.prevent>
            <el-form-item label="证件号码：" class="width450">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.certNo" @input="e => input = inputMe(e)" placeholder="请输入需要拆户的证件号码" clearable @keydown.enter.native="demand"></el-input>
            </el-form-item>
            <el-form-item label="营业区域：" class="item">
              <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea" :show-all-levels="false" :props="tprops">
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>

          <div class="table-count">
            <span>
              共<span class="num">{{tableData.length}}</span>客户，已勾选<span class="num">{{multipleSelection.length}}</span>客户
            </span>
          </div>
          <div class="bread-contain-right">
            <!-- <span class="tips" v-if="tableIndex == 0">左键点击弹出选择框，右键进行选中(当前没有选中)</span>
            <span class="tips" v-else>左键点击弹出选择框，右键进行选中(当前选中的是第<span style="color: red; font-size: 16px">{{tableIndex}}</span>行，
              <span v-if="tableType == 'ctmNo'">客户编号<span style="color: red; font-size: 16px">{{copyVal.ctmNo}})</span></span>
              <span v-else>账户编号<span style="color: red; font-size: 16px">{{copyVal.accountNo}})</span></span>
            </span>；点击复制后，可复制到复选已勾选行内 -->
            <!-- <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="copyCell">复制</el-button> -->
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="rebackMore">批量还原</el-button>
          </div>
          <!-- <div class="bread-contain-right">
            <span class="tips" style="font-size:12px;">点击弹出选择框，右键进行复制</span>
          </div> -->
        </div>

        <div class="kl-table">
          <el-table ref="currTable"  @selection-change="handleSelectionChange" border max-height="500" :data="tableData" class="change-tables-table" highlight-current-row @row-click="rowClick">

            <el-table-column :selectable="getIsEditable" type="selection" width="55" v-if="hasCheckBox">
            </el-table-column>

            <el-table-column type="index" label="NO." width="50" fixed="left">
            </el-table-column>
            <!-- <el-table-column prop="mainCtmFlag" label="是否为主客户" min-width="200" fixed="left">
              <template slot-scope="scope">
                <el-radio v-model="tableData[scope.$index].mainCtmFlag" :label="1" @change="change(1, scope.$index, scope.row)" :disabled="disabledEdit">主客户</el-radio>
                <el-radio v-model="tableData[scope.$index].mainCtmFlag" :label="0" @change="change(0, scope.$index, scope.row)" :disabled="disabledEdit">次客户</el-radio>
              </template>
            </el-table-column> -->
            <el-table-column prop="userNo" min-width="160" label="用户编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="ctmNo" min-width="200" label="客户编号" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <el-select v-model="scope.row.ctmNo" @change="ctmNoChange(scope)" @click.native="setCopyVal(scope)" :disabled="disabledEdit">
                  <el-option v-for="item in ctmNoList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </template> -->
              <!-- <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabledEdit" id="test" type="text" v-model="scope.row.ctmNo" readonly  @click.prevent.native="setCopyVal(scope,'ctmNo')" @contextmenu.prevent.native="rightCopy(scope,'ctmNo')"></el-input>
                <span style="color:black;" v-else>{{scope.row.ctmNo}}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="accountNo" min-width="200" label="账户编号" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <el-select v-model="scope.row.accountNo" @visible-change="setCopyVal(scope)" @click.native="setCopyVal(scope)" :disabled="disabledEdit">
                  <el-option v-for="item in scope.row.accountNoList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </template> -->
               <!-- <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="!disabledEdit" type="text" v-model="scope.row.accountNo" readonly @click.prevent.native="setCopyVal(scope,'accountNo')" @contextmenu.prevent.native="rightCopy(scope,'accountNo')"></el-input>
                 <span style="color:black;" v-else>{{scope.row.accountNo}}</span>
              </template> -->
            </el-table-column>

            <el-table-column prop="setupMeterAddr" min-width="300" label="装表地址" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="ctmName" min-width="200" label="客户名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="businessAreaName" min-width="200" label="营业区域" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="ctmAddr" min-width="300" label="客户地址" show-overflow-tooltip>
            </el-table-column>
            <el-table-column v-if="processInfo.processState !='END' &&processInfo.processState!='PROCESSING'" prop="rebackStatus" min-width="100" label="还原状态" show-overflow-tooltip>
              <template>

              </template>
            </el-table-column>
            <!-- <el-table-column prop="ctmUserAmount" min-width="120" label="客户所属用户数">
            </el-table-column>

            <el-table-column prop="accountUserAmount" min-width="120" label="账户所属用户数" show-overflow-tooltip>
            </el-table-column> -->

            <el-table-column min-width="100" label="操作" fixed="right" v-if="!disabledEdit">
              <template slot-scope="scope">
                <el-button type="text" @click="remove(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="reback(scope.$index,scope.row)">还原</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
      </div>

      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>

    <el-dialog title="用户列表" :visible.sync="openDialogShow" width="80%">
      <el-table ref="table"  border max-height="400" :data="dialogTableData" class="change-tables-table">
            <el-table-column  width="35"  fixed="left">
              <template slot-scope="scope">
                <el-radio-group v-model="defaultVal">
                  <el-radio :label="scope.$index" v-model="showRadio" @click.native="getChooseVal(scope)">&nbsp;</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <!-- <el-table-column :selectable="getIsEditable" type="selection" width="55" v-if="hasCheckBox">
            </el-table-column> -->
            <el-table-column type="index" label="NO." width="50" fixed="left">
            </el-table-column>
            <template v-if="dialogType == 'ctmNo'">
              <el-table-column v-if="dialogType == 'ctmNo'" prop="ctmNo" min-width="200" fixed="left" label="客户编号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-if="dialogType == 'ctmNo'" prop="ctmName" min-width="200" label="客户名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-if="dialogType == 'ctmNo'" prop="ctmAddr" min-width="300" label="客户地址" show-overflow-tooltip>
              </el-table-column>
            </template>
            <template v-else-if="dialogType == 'accountNo'">
              <el-table-column v-if="dialogType == 'accountNo'" prop="accountNo" min-width="200" fixed="left" label="账户编号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-if="dialogType == 'accountNo'" prop="openAccountBankName" min-width="300" label="开户银行名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-if="dialogType == 'accountNo'" prop="openAccountName" min-width="300" label="开户名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-if="dialogType == 'accountNo'" prop="vatFlagName" min-width="120" label="增值税标记" show-overflow-tooltip>
              </el-table-column>
            </template>
            
          </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button id="btn" type="primary" @click.native="determineChoose()">确 定</el-button>
        <el-button @click="openDialogShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
export default {
  name: "ApartAccountDetail",
  components: {
    billInfo,
  },
  props: ["billStute", "billNo", "id"],
  data () {
    return {
      billId:'',
      disabledEdit: false,
      disabled: true,
      num: 0,
      tprops: {
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      formData: {},
      ctmData: {
        certNo: "",
      },
      ctmNoList: [],
      // 是否需要保存
      approveFlag: 0,
      //是否可显示回填表单
      isActive: true,
      multipleSelection: [], //被选中的客户
      tableQuery: {
        certNo: "",
        businessArea: ""
      },
      businessArea: [],
      copyVal: {},
      // 列表数据
      tableData: [],
      // 选择框列表数据
      dialogTableData: [],
      // 弹窗是账户编号还是客户编号
      dialogType: '',
      // 表格勾选数据
      selectData: [],
      // 复制是账户编号还是客户编号
      tableType: '',
      // 当前行
      tableIndex: 0,
      processInfo: {
        processState: ""
      },
      // 是否显示多选框
      hasCheckBox: false,
      // 是否打卡弹框
      openDialogShow:false,
      showRadio:false,//默认都是不选中
      dialogCopyVal:{},
      tableCopyVal:{},
      defaultVal:0,
      tempData:{}
    };
  },
  watch:{
    tableData:{
        handler(newVal, oldVal){
            let arr=[]
            for(let i=0;i<this.selectData.length;i++){
              arr.push(this.selectData[i].userNo)
            }
            // console.log(JSON.stringify(this.selectData));
            this.selectData=[]

            for(let i=0;i<this.tableData.length;i++){
              for(let j=0;j<arr.length;j++){
                if(this.tableData[i].userNo==arr[j]){
                  this.selectData.push(this.tableData[i])
                }
              }
            }
          // console.log(JSON.stringify(this.selectData));
        },
        deep: true
    }
  },
  mounted () {
    if (this.billNo) {
      this.init();

    } else {
      this.getHtmlData();
      this.businessAreaSelect();
    }
    // console.log('state', this.billStute)
    if (this.billStute == 'Add') {
      this.hasCheckBox = true;
    }
  },
  methods: {
    
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    rowClick(){
      if (this.tableIndex != 0) {
        this.$refs.currTable.setCurrentRow(this.tableData[this.tableIndex-1]);
      }else{
        this.$refs.currTable.setCurrentRow(-1);
      }
    },
    rightCopy(scope,type){
      // console.log(scope)
      this.tableType = type
      this.tableIndex = scope.$index + 1
      this.$refs.currTable.setCurrentRow(this.tableData[scope.$index]);
      //保存当前焦点输入框的值
      // this.copyVal = {
      //   col: scope.column.property,
      //   val: scope.row[scope.column.property],
      // };
      // console.log(this.copyVal)
      // if (!this.ctmNoList.length) {
      //   this.getCtmList(this.tableQuery.certNo);
      // }
      this.copyVal = scope.row
      // console.log(this.copyVal)

    },
    copyCell () {
      let copyVal = this.copyVal;
      // console.log(copyVal)
      if (JSON.stringify(copyVal)==="{}") {
        this.$message({
          message: "请先选择要复制的用户！",
          type: "warning",
        });
        return;
      }
      if (this.selectData.length == 0) {
        this.$message({
          message: "请勾选需要复制的用户！",
          type: "warning",
        });
        return;
      }
      this.tableData.forEach(item => {
        this.selectData.forEach(select => {
          if (item.userNo == select.userNo) {
            if (this.tableType == 'ctmNo') {
              item.ctmNo = copyVal.ctmNo
            }else if (this.tableType == 'accountNo') {
              item.accountNo = copyVal.accountNo
            }
          }
        })
      })

      // for (let idx in this.tableData) {
      //   //把对应的单元格data重新更新

      //   if (
      //     copyval.col === "ctmNo" &&
      //     this.ctmNoList.includes(copyval.val)
      //   ) {
      //     console.log('jhhwertyh')
      //     this.tableData[idx][copyval.col] = copyval.val;
      //   }
      //   if (
      //     copyval.col === "accountNo" &&
      //     this.tableData[idx].accountNoList.includes(copyval.val)
      //   ) {
      //     //accountNoList的值没有获取到
      //     console.log('jhhh')
      //     this.tableData[idx][copyval.col] = copyval.val;
      //   }
      // }
    },
    // 弹框
    openDialog() {
      this.openDialogShow = true
    },
    init () {
      var _this = this;
      var params = {
        busicode: "UserInfoSplitSingle",
        data: { billNo: _this.billNo }, // （参数）
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          _this.tableData = res.userInfoSplitDetailList;
          // _this.dialogTableData = JSON.parse(JSON.stringify(res.userInfoMergeDetailList));
          if (res.userInfoSplitDetailList.length > 0) {
            this.processInfo = res;
            // console.log('res', res)
            // console.log('processState', this.processInfo.processState)
            // console.log(this.formData.userOpenInfo.processState)
            if (
              this.processInfo.processState == "" ||
              this.processInfo.processState == "DRAFT"
            ) {
              //修改动态表单可编辑判断-节点驳回：登记以及 草稿状态可编辑
              this.disabledEdit = false; //草稿节点不能disable
              this.hasCheckBox = true; // 显示多选框
            } else {
              this.approveFlag = 1;
              this.NoDisabled = true;
              this.disabledEdit = true;//其他节点可以disable
              this.hasCheckBox = false;// 隐藏多选框
            }
            this.getBillData(res);
            this.ctmData.certNo = res.certNo
            this.getHtmlData();
            if (!this.disabledEdit) {
              this.tableQuery.certNo = res.certNo;
              this.$refs.currTable.toggleAllSelection();
            }
          }
        });
    },
    businessAreaSelect () {   //营业所下拉框
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessArea = data.children;
      })
    },
    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    getIsEditable () {
      return !this.disabledEdit;
    },

    getFormbData () {
      let data = {
        id: this.id,
        certNo: this.tableQuery.certNo,
        userInfoSplitDetailList: this.selectData,
      };
      if (this.billStute === "Add") {
        delete data.id;
      }
      return data;
    },
    ctmNoChange (scope) { //重设账户下拉框数据
      let params = {
        busicode: "GetAccountByCtm",
        data: {
          ctmNo: scope.row.ctmNo,
          accountNo: scope.row.accountNo,
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res)
          this.tableData[scope.$index].accountNoList = res;
        });

      this.setCopyVal(scope);
    },
    //获得table中所点击的内容
    setCopyVal (scope,type) {
      this.tableCopyVal=scope
      this.dialogType = type
      // this.defaultVal=this.tableCopyVal.$index
      // console.log(this.defaultVal);
      // $('#btn').prop('disabled','disabled')
      // if (this.dialogType == 'ctmNo') {
      //   this.getCtmNoDialogData()
      // }else{
      //   this.getAccountNoDialogData(scope.row.ctmNo)
      // }
      this.getCtmNoDialogData()
      this.openDialog()
      //保存当前焦点输入框的值
      // this.copyVal = {
      //   col: scope.column.property,
      //   val: scope.row[scope.column.property],
      // };
      // console.log(this.copyVal)
      // if (!this.ctmNoList.length) {
      //   this.getCtmList(this.tableQuery.certNo);
      // }
    },
    getCtmNoDialogData(){
      this.dialogTableData = []
      let _this = this;
      let params = {
        busicode: "GetCtmListByCertNo",
        data: {
          certNo: _this.tableQuery.certNo,
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          if (this.dialogType == 'ctmNo') {
            this.dialogTableData = res.ctmInfoBeanList;
          }else{
            this.dialogTableData = res.accountInfoBeanList;
          }
          this.defaultVal = 0
          this.dialogCopyVal = this.dialogTableData[0]
        });
    },
    getAccountNoDialogData(ctmNo){
      this.dialogTableData = []
      let _this = this;
      let params = {
        busicode: "GetAccountListByCtmNo",
        data: {
          certNo: _this.tableQuery.certNo,
          ctmNo: ctmNo,
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res)
          this.dialogTableData = res;
        });
    },
    determineChoose(){
      if (Object.keys(this.dialogCopyVal).length == 0) {
        this.$message.error("请选取用户回填！")
        return
      }
      if (this.dialogType == 'ctmNo') {
        this.tableCopyVal.row.ctmNo = this.dialogCopyVal.ctmNo
         this.tableCopyVal.row.ctmName = this.dialogCopyVal.ctmName
          this.tableCopyVal.row.ctmAddr = this.dialogCopyVal.ctmAddr
      }else if (this.dialogType == 'accountNo') {
        this.tableCopyVal.row.accountNo = this.dialogCopyVal.accountNo
      }
      
      this.openDialogShow = false
      this.dialogCopyVal = {}
    },
    getChooseVal(scope){
      // $('#btn').attr('disabled',false)
      // if(scope.$index==this.defaultVal){
      //    $('#btn').attr('disabled',true)
      // }else{
      //    $('#btn').attr('disabled',false)
      // }
      // console.log(scope)
      this.dialogCopyVal=scope.row
      
    },

    change (status, num, row) {
      if (status == 1) {
        this.$set(row, "mainCtmFlag", status);
        this.tableData.forEach((v) => {
          //   if (v.ctmNo == row.ctmNo) {
          if (v.userNo == row.userNo) {
            v.mainCtmFlag = 1;
          } else {
            v.mainCtmFlag = 0;
          }
        });
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: "请勾选你所需的拆户！",
            type: "warning",
          });
          return;
        }
        this.multipleSelection.forEach((s) => {
          //   if (s.ctmNo == row.ctmNo) {
          if (s.userNo == row.userNo) {
            s.mainCtmFlag = 1;
          } else {
            s.mainCtmFlag = 0;
          }
        });
      } else {
        this.tableData[num].mainCtmFlag = 0;
        this.$set(this.tableData[num], "mainCtmFlag", 0);

        this.$set(this.multipleSelection[num], "mainCtmFlag", 0);
      }
    },
    //获取到下拉列表的内容（也即弹框的内容）
    getCtmList () {

      let _this = this;
      let params = {
        busicode: "GetCtmNoListByCertNo",
        data: {
          certNo: _this.tableQuery.certNo,
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res)
          this.ctmNoList = res;
        });
    },
    //查询
    demand () {
      this.tableData = [];
      if (this.tableQuery.certNo == "") {
        this.$message({
          message: "证件号码不能为空！",
          type: "warning",
        });
        return;
      }
      let _this = this;
      let params = {
        busicode: "UserInfoSplitDetailListByCertNoAndBusinessArea",
        data: {
          certNo: _this.tableQuery.certNo,
          businessArea: _this.tableQuery.businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {

          // if (_this.tableData.length !== 0) {
          //   for (let i = 0; i < _this.tableData.length; i++) {
          //     for (let k = 0; k < res.length; k++) {
          //       if (res[k].ctmNo == _this.tableData[i].ctmNo) {
          //         this.$message({
          //           message: "不能重复查询相同的证件号",
          //           type: "warning",
          //         });
          //         return;
          //       }
          //     }
          //   }
          // } else {
          // if (res.length > 0) {
            // res[0].mainCtmFlag = 1;
          // }
          // }
          let arr = [];
          // for (let k = 0; k < res.length; k++) {
          //   if (res[k].mainCtmFlag !== 1) {
          //     res[k].mainCtmFlag = 0;
          //   }
          // }
          _this.tableData = res;
          // _this.dialogTableData = JSON.parse(JSON.stringify(res));
          this.tableIndex = 0
          this.copyVal = {}
          // this.$refs.table.toggleAllSelection();
          // _this.num++;
          this.$nextTick(() => {
            this.common.changeTable(this, ".ApartAccountDetail", [
              ".ApartAccountDetail .bread-contain",
              ".ApartAccountDetail .toolbar",
              ".ApartAccountDetail .tip",
              ".ApartAccountDetail .tip",
            ]);
          });
        });
    },
    unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
},
    validate () {
      // console.log('this.copyVal',JSON.stringify(this.copyVal));
      // console.log('tableData',this.tableData);
      return new Promise((res, rej) => {
        if (this.processInfo.processState != "DRAFT" && this.billStute != 'Add') { // 修改非草稿状态时，无需选择，因此跳过多选验证
          res(null)
          return
        }
        //添加阶段
        if(this.processInfo.processState!='PROCESSING'&&this.processInfo.processState!='END'){
          if(this.selectData.length==0){
            this.$message({
              type:'warning',
              message:'至少勾选一条数据'
            })
            return
          }

          //勾选的数据中有还原失败的不让提交
          for(let i=0;i<this.selectData.length;i++){
            if(this.selectData[i].rebackStatus==undefined||this.selectData[i].rebackStatus==''){
              this.$message({
                type:'warning',
                message:'勾选的数据中包含未还原的数据,请先还原数据'
              })
              return
            }
            else if(this.selectData[i].rebackStatus=='失败'){
              this.$message({
                type:'warning',
                message:'勾选的数据中包含还原失败的数据，请联系管理'
              })
              return
            }
          }
        }
        
        // if (this.multipleSelection.length < 2) {
        //   this.$message({
        //     message: "并户的客户数量不能小于2！",
        //     type: "warning",
        //   });
        //   rej()
        //   return;
        // }
        let j = 0;
        for (let i = 0; i < this.multipleSelection.length; i++) {
          // console.log(this.multipleSelection[i].mainCtmFlag == 1);
          if (this.multipleSelection[i].mainCtmFlag == 1) {
            j++;
          }
        }
        // console.log(j);
        // if (j == 0) {
        //   this.$message({
        //     message: "请选择一个主客户！",
        //     type: "warning",
        //   });
        //   rej()
        //   return;
        // } else if (j > 1) {
        //   this.$message({
        //     message: "主客户的数量只能为一个！",
        //     type: "warning",
        //   });
        //   rej()
        //   return;
        // }
        //一个账户编号仅隶属于一个客户编号
        let accountNos=[]
        let sameNum=[]
        for(let i=0;i<this.selectData.length;i++){
          accountNos.push(this.selectData[i].accountNo)

        }
        accountNos=this.unique(accountNos)
        // console.log('accountNos',accountNos);
        for(let i=0;i<accountNos.length;i++){
          //console.log(accountNos[i]);
          for(let j=0;j<this.selectData.length;j++){
            // console.log('accountNo',this.selectData[j].accountNo);
            // console.log('ctmNo',this.selectData[j].ctmNo);
            if(accountNos[i]==this.selectData[j].accountNo){
              sameNum.push({
                accountNo:this.selectData[j].accountNo,
                ctmNo:this.selectData[j].ctmNo
              })
              // console.log();
            }
          }
        }
        //sameNum=this.unique(sameNum)
        // console.log('sameNum',sameNum);
        for(let i=0;i<sameNum.length;i++){
          for(let j=0;j<sameNum.length;j++){
            if(sameNum[i].accountNo==sameNum[j].accountNo){
              if(sameNum[i].ctmNo!=sameNum[j].ctmNo){
                this.$message({
                  message: "一个账户编号仅隶属于一个客户编号",
                  type: "warning",
                });
                rej()
                return;
              }
            }
          }
        }
        res(null);
      }).then((res) => {
        
        return res;
      })
    },
    async changeBeforeSubmit (b) { //提交前进行校验
      let message = null
      message = await this.validate();
      return message
    },
    //确定并户
    async save () {
      // console.log(3);
      await this.validate();

      let _this = this;
      let params = {
        busicode: _this.billStute == "Update"
          // ? "UserInfoMergeUpdate"
          ? "UserInfoSplitInsert"
          : "UserInfoSplitInsert",
        data: {
          id: this.id,
          certNo: this.tableQuery.certNo,
          userInfoSplitDetailList:this.tableData,
        },
      };

      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.billId=res
          this.$message({
            message: "拆户成功",
            type: "success",
          });
          // console.log(res)
          // this.billNo = res;
          // for (let i = 0; i < _this.tableData.length; i++) {
          //   if (_this.tableData[i].mainCtmFlag == 1) {
          //     let data = _this.tableData[i];
          //     _this.tableData = [];
          //     _this.tableData.push(data);
          //   }
          // }
          _this.$parent.closeDialog(); // 提交后回调方法

        });
    },
    //批量还原
    rebackMore(){
      if(this.selectData.length==0){
        this.$message({
            type:'warning',
            message:'请选择需还原的数据'
          })
          return 
      }
      let cNo=[]
      let aNo=[]
      for(let i=0;i<this.selectData.length;i++){
        cNo.push('2'+this.selectData[i].userNo.slice(1))
        aNo.push('3'+this.selectData[i].userNo.slice(1))
      }
      let params = {
        busicode: "UserInfoSplitCheckList",
        data: {
          ctmNoList:cNo,
          accountNoList:aNo,
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(this.selectData);
          this.$message({
            type:'success',
            message:'还原成功'
          })
          for(let i=0;i<this.selectData.length;i++){
            for(let j=0;j<this.tableData.length;j++){
              if(this.selectData[i].userNo==this.tableData[j].userNo){
                this.$set(this.tableData[j],'ctmNo',cNo[i])
                this.$set(this.tableData[j],'accountNo',aNo[i])
                this.$set(this.tableData[j],'rebackStatus','成功')
              }
            }
          }
        }).catch((error)=>{
          let arr=error.description.split(',')
          let arr2=[]
          for(let i=0;i<arr.length/2;i++){
            let m=2*i
            arr2.push('1'+arr[m].slice(1))
          }
            for(let i=0;i<this.tableData.length;i++){
              for(let j=0;j<this.selectData.length;j++){
                if(this.tableData[i].userNo==this.selectData[j].userNo){
                  this.$set(this.tableData[i],'ctmNo',cNo[i])
                  this.$set(this.tableData[i],'accountNo',aNo[i])
                  this.$set(this.tableData[i],'rebackStatus','成功')
                }
              }
            }
            for(let j=0;j<this.tableData.length;j++){
              // console.log(this.tableData[j].userNo);
              for(let i=0;i<arr2.length;i++){
                if(arr2[i]==this.tableData[j].userNo){
                  this.$set(this.tableData[j],'rebackStatus','失败')
                }
              }
          }
          
        })
    },
    //还原
    reback(index,row){
      let cNo=[]
      cNo.push('2'+row.userNo.slice(1))
      let aNo=[]
      aNo.push('3'+row.userNo.slice(1))
      // console.log(JSON.stringify(row));
      let params = {
        busicode: "UserInfoSplitCheckList",
        data: {
          ctmNoList:cNo,
          accountNoList:aNo,
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          if(res==''){
            this.$message({
              type:'success',
              message:'还原成功'
            })
            this.$set(this.tableData[index],'ctmNo',cNo[0])
            this.$set(this.tableData[index],'accountNo',aNo[0])
            this.$set(this.tableData[index],'rebackStatus','成功')
            // console.log(this.tableData[index]);
          }
          
        }).catch((error)=>{
          this.$set(this.tableData[index],'rebackStatus','失败')
          // console.log(this.tableData[index]);
        })
    },
    // 删除
    remove (i, row) {
      // console.log(i, row);
      this.$confirm("此操作将删除此客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.tableData.splice(i, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    getBillData (res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate, //单据日期
      };
      if (this.billStute == "Update") {
        this.$refs.billInfo.init(this.billData);
      }
    },
    // 获取审批流前端代码
    getHtmlData () {
      // console.log(this.tableData);
      //this.userInfoMergeDetailList=this.tableData
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "user_info_split",
        "审批流配置:" +
        _this.processInfo.processName +
        "(" +
        _this.processInfo.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.processInfo.id, // 任务id
        _this.processInfo.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        (res) => {
          if (
            window.location.href.indexOf("WaterSideIndex") > -1 ||
            window.location.href.indexOf("HallBusiness") > -1
          ) {
            // 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        _this.billStute == "Update"
          ? "UserInfoSplitInsert"
          : "UserInfoSplitInsert" //0提交流程前调接口的busicode
      );
    },
    handleSelectionChange (val) {
      this.selectData = val
      // //勾选字段去空
      // this.multipleSelection = val.map((item) => {
      //   for (let key in item) {
      //     if (item[key] === "") {
      //       delete item[key];
      //     }
      //   }
      //   return item;
      // });

      // if (this.multipleSelection.length > 0) {
      //   this.disabled = false;
      // } else {
      //   this.disabled = true;
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ApartAccountDetail {
  height: 100%;
  overflow-y: auto;
  /deep/ .el-input__suffix .el-input__icon {
    line-height: inherit;
  }
  /deep/ .el-table__body .el-table__row.hover-row td{
	   	background-color: #b9d9dca8 !important;
	}
  // 固定列样式
  /deep/ .el-table__body tr.current-row>td{
    background-color: #b9d9dca8 !important;
  }
 // 非固定列样式
  /deep/ .el-table .el-table__body-wrapper .el-table__body .current-row>td{
    background-color: #b9d9dca8 !important;
  }
  .table-count {
    float: left;
    line-height: 40px;
    span.num {
      font-size: 1.1rem;
      font-weight: bolder;
    }
  }
  .submitEditRightNone {
    width: 100%;
    display: inline-block;
  }
  .checkboxHide {
    display: none;
  }
  .bread-contain-right{
    width: 80%;
  }
}
</style>
