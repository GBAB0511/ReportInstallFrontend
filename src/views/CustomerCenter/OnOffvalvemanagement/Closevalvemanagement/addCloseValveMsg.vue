<template>
  <div class='addValveHandleInfoIndex'>
    <!-- 弹出表单选择用户 -->
    <el-dialog title="添加用户" v-if="userChooseVisible" :visible.sync="userChooseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectUser">
      <SelectUserTable ref="SelectUserTable"></SelectUserTable>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="fixDialogSelectUser">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogSelectUser">取 消</el-button>
      </div>
    </el-dialog>

    <legend class="legendColumn">单据信息</legend>
    <el-form :model="formData" ref="billForm" class="formBill" :disabled="NotDisabled" :inline="true" size="mini" :rules="rules" label-width="130px">

      <span v-if="hideContent">
        <el-form-item label="单据编号：" class="disable-item">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled v-model="formData.billNo" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="单据日期：" class="disable-item">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled v-model="formData.receiptTime" placeholder=""></el-input>
        </el-form-item>
        <br>
      </span>

      <el-form-item label="计划关停数量" prop="planCloseNum" class="disable-item">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.planCloseNum" size="mini" clearable class="read-only" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="计划完成时间：" prop="planTime" :class="{'disable-item': NotDisabled}">
        <el-date-picker v-model="formData.planTime" type="date" clearable unlink-panels format="yyyy-MM-dd" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <br>
      <el-form-item label="关阀原因：" class="f2" prop="reason" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" :rows="2" v-model="formData.reason" placeholder="关阀原因"></el-input>
        <span v-else>{{formData.reason}}</span>
      </el-form-item>
    </el-form>

    <legend class="legendColumn">用户信息</legend>
    <span v-if="hideContent">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline width-150">
          <!-- <el-form-item class="form-left"> -->
          <!-- class="longinput" -->
          <el-form-item label="用户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.userNo" placeholder="" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>

          <el-form-item label="客户名称：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.userName" placeholder="" @keydown.enter.native="demand" clearable></el-input>
          </el-form-item>

          <el-form-item label="阀门状态：">
            <el-select clearable v-model="tableQuery.valveStatus" placeholder="请选择">
              <el-option v-for="item in dictionaryData.MVS" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
    </span>
    <div class="kl-table">
      <el-button size="mini" type="primary" @click="chooseUserList('chooseOldMeter')" class="select-btn" v-if="!NotDisabled">添加用户</el-button>
      <el-table highlight-current-row stripe border :data="tableData.list" class="wuserInfo-table">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->

        <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed="left">
        </el-table-column>

        <el-table-column prop="userNo" min-width="120" label="用户编号" fixed="left">
        </el-table-column>

        <el-table-column prop="userName" min-width="230" label="客户名称" fixed="left" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="userAddr" min-width="250" label="客户地址" fixed="left" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="tel" min-width="100" label="手机号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="hideContent" prop="valveStatusName" min-width="80" label="阀门状态">
          <!-- <template slot-scope="scope">
             <span style="color:#606266" v-if="scope.row.valveStatus == 1">已开阀</span>
             <span style="color:#606266" v-if="scope.row.valveStatus == 2">待开阀</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 3">已关阀</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 4">待关阀</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 6">开阀异常</span>
              <span style="color:#606266" v-if="scope.row.valveStatus == 7">关阀异常</span>
             </template> -->
        </el-table-column>

        <el-table-column prop="feeStatus" min-width="80" label="欠费状态">
        </el-table-column>

        <el-table-column prop="arrearage" min-width="100" label="欠费金额">
        </el-table-column>

        <el-table-column prop="arrearageNum" min-width="80" label="欠费笔数">
        </el-table-column>

        <el-table-column prop="remoteFlag" min-width="80" label="是否远程">
        </el-table-column>

        <el-table-column prop="valveControlFlag" min-width="80" label="是否阀控">

        </el-table-column>
        <el-table-column prop="cancelFlag" min-width="100" label="是否取消">

        </el-table-column>
        <el-table-column prop="closeTime" min-width="120" label="关阀时间">
        </el-table-column>

        <el-table-column v-if="!hideContent" prop="meterReader" min-width="100" label="处理人员">
        </el-table-column>

        <el-table-column v-if="hideContent" prop="closeOperator" min-width="100" label="关阀处理人">
        </el-table-column>

        <el-table-column v-if="hideContent" prop="paymentTime" min-width="120" label="缴费时间">
        </el-table-column>

        <el-table-column v-if="hideContent" prop="openTime" min-width="120" label="开阀时间">
        </el-table-column>

        <el-table-column v-if="hideContent" prop="openOperator" min-width="100" label="开阀处理人">
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="deleteRow(scope.$index,scope.row)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页  -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
    </div>
    <legend class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
  </div>
</template>
<script>
import SelectUserTable from '@/components/SelectUserTable'

export default {
  name: "addCloseValveMsg",
  props: ['editNeedData'],
  components: {
    SelectUserTable,
  },
  data () {
    return {
      time: [],
      formData: {
        planCloseNum: "",
        id: "",
        processStateName: "",
        processInstanceId: "",
        planTime: "",
        //  planStartTime:"",
      },
      //后端数据字典
      // 数据字典数据
      dictionaryData: {},
      valveStateOptions: [
        {
          id: '1',
          name: '已开阀'
        },
        {
          id: '2',
          name: '待开阀'
        },
        {
          id: '3',
          name: '已关阀'
        },
        {
          id: '4',
          name: '待关阀'
        },

        {
          id: '6',
          name: '开阀异常'
        },
        {
          id: '7',
          name: '关阀异常'
        },
      ],
      currentBusicode: "",
      hideContent: false,
      NotDisabled: false,
      // 添加用户按钮弹窗
      userChooseVisible: false,
      tableData: {},
      tableQuery: {
        page: 1,
        pageCount: 20,
        valveCloseId: this.editNeedData.id,
      },
      rules: {
        planTime: [
          { required: true, message: '请选择计划完成日期', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入关阀原因', trigger: 'blur' }
        ],
      },
      userNoList: [], // 已添加的用户编号列表
    }
  },
  mounted () {

    this.getDictionary()
    // this.init();//数据初始化


    if (
      this.editNeedData.processState == "END" || //完结
      this.editNeedData.processState == "CANCEL" || //终止
      this.editNeedData.processState == "approval" //进行中-审批
    ) {
      //表单 不可修改
      this.NotDisabled = true;
      this.approveFlag = 1;
    } else {
      //进行中-登记、草稿、回填
      if (
        this.editNeedData.processState == "" || //草稿
        this.editNeedData.processState == "register" //登记
        || this.editNeedData.billNo == undefined
      ) {
        //表单 可修改
        this.NotDisabled = false;
        this.approveFlag = 0;
      }
    }
    if (this.editNeedData.id) {
      // 列表信息数据
      this.init();
    } else {
      this.getHtmlData();
      // this.tempId = this.util.generateUUID()
    }
  },
  methods: {
    inputMe (e) {
      let str = e.replace(/\ +/g, "")
      str = str.replace(/[\r\n]/g, "")
      //console.log(str);
      return str;
    },
    //初始化
    init () {

      if (this.editNeedData.id !== undefined || this.editNeedData.billNo !== undefined) {
        this.hideContent = true
        this.getList()
      } else {
        this.hideContent = false
      }
      // this.getCurrentBusicode()
    },
    // getFormbData() {
    //       let val={
    //          billNo:this.formData.billNo
    //       }
    //     },
    daterangeChange (e) {
      let _this = this
      _this.$nextTick(() => {
        _this.$set(_this, "time", [e[0], e[1]]);
        _this.$forceUpdate();
      });
    },
    //查询
    demand () {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init()
    },
    // 数据字典（查询框）
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MVS"// 缴费方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    getList () {
      let _this = this
      let params = {
        "busicode": "ValveCloseQuery",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res.list;

        _this.formData = res.ValveCloseVo;

        //  _this.time[0] = res.ValveCloseVo.planStartTime

        //  _this.time[1] = res.ValveCloseVo.planTime

        _this.formData.planCloseNum = _this.tableData.list.length
        console.log('yyy', this.tableData.list);

        this.daterangeChange(this.time)//回显时间范围

        if (_this.formData.processState == '' || this.editNeedData.billNo == undefined) {
          this.approveFlag = 0
        } else {
          this.approveFlag = 1
        }
        // //后端返回
        // _this.tableData.list.forEach(ele =>{
        //   if(ele.valveControlFlag == "0"){
        //     ele.valveControlFlag = "否"
        //   } else if(ele.valveControlFlag == "1") {
        //     ele.valveControlFlag = "是"
        //   }
        //   if(ele.remoteFlag == "0"){
        //     ele.remoteFlag = "否"
        //   } else if(ele.remoteFlag == "1") {
        //     ele.remoteFlag = "是"
        //   }
        //   if(ele.cancelFlag == "0"){
        //     ele.cancelFlag = "否"
        //   } else if(ele.cancelFlag == "1") {
        //     ele.cancelFlag = "是"
        //   }
        //    if(ele.feeStatus == "0"){
        //     ele.feeStatus = "否"
        //   } else if(ele.feeStatus == "1") {
        //     ele.feeStatus = "是"
        //   }
        // })

        this.getHtmlData()
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        _this.common.changeTable(this, ".closeValveHandleInfoIndex", [
          ".closeValveHandleInfoIndex.toolbar",
          ".closeValveHandleInfoIndex.block",
        ]);
      })
        .catch((this.tableData = {}));
    },
    // 删除行
    deleteRow (index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.list.splice(index, 1)
        this.userNoList = this.userNoList.filter(item => {
          return item != row.userNo
        })
        this.getPlanNo()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getPlanNo () {
      this.formData.planCloseNum = this.tableData.list.length

    },
    chooseUserList () {
      // this.waterChooseType = val
      this.userChooseVisible = true
    },
    indexMethod (index) {
      //获取表格序号
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    // 选择用户弹出框取消按钮
    closeDialogSelectUser () {
      this.userChooseVisible = false;
      // this.ViewAttachmentVisible = false;
    },
    //列表去重
    uniqueFunc (...args) {
      const paramsLength = arguments.length;
      if (paramsLength == 1) {
        return [...new Set(arr)];
      } else {
        const res = new Map();
        const flag = arguments[1];
        return arguments[0].filter(item => !res.has(item[flag]) && res.set(item[flag], item));
      }
    },
    // 选择用户弹出框确定按钮
    fixDialogSelectUser () {
      let meterNoArr = []
      let val = this.$refs.SelectUserTable.selectData
      if (val.length == 0) {
        this.$message({
          type: 'error',
          message: '请选择用户'
        })
        return
      }
      if(this.tableData.list == undefined){
          this.tableData.list = []
      }
      this.userChooseVisible = false;
      let tempNoList = val.map(item => {
        return item.userNo;
      })
      if (this.userNoList.length != 0) { // 已存在列表
        // userNoList去重
        this.userNoList = this.userNoList.concat(tempNoList);
        this.userNoList = Array.from(new Set(this.userNoList));
      } else {
        this.userNoList = tempNoList
      }
      console.log('userNoList', this.userNoList)
    //   if (this.tableData.length != 0 && JSON.stringify(tempNoList.sort()) === JSON.stringify(this.userNoList.sort())) { // 一致则不请求
    //     this.getPlanNo()
    //     console.log(this.userNoList)
    //     return;
    //   }
      this.$api.fetch({
        params: {
          busicode: "ValveCloseUserQuery",
          data: {
            page: 1,
            pageCount: 20,
            arrearage: "",
            arrearageNum: "",
            userNoList: this.userNoList,
            meterReadingStaff: ""
          }
        }
      }).then(res => {
        this.tableData.list = res.list;
        this.getPlanNo()
      })
    },
    // 获取审批流前端代码
    getHtmlData () {

      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "valve_close",
        "审批流配置:" +
        _this.formData.processStateName +
        "(" +
        _this.formData.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf('WaterSideIndex') > 0 || window.location.href.indexOf('HallBusiness') > 0) {// 流程中心模块触发/工作台触发
            _this.$parent.$parent.closeDialog()
          } else {// 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.editNeedData.busicode
      );

    },

    getCurrentBusicode () {
      if (this.hideContent) {
        this.currentBusicode = "ValveCloseUpdate"
      } else {
        this.currentBusicode = "ValveCloseAdd"
      }
      //  this.getHtmlData();
    },
    getFormbData () {
      let meterNoArr = []
      this.tableData.list.forEach(item => {
        meterNoArr.push({
          userNo: item.userNo,
          arrearage: item.arrearage,
          arrearageNum: item.arrearageNum
        })
      })
      console.log(this.tableData.list);
      if (this.hideContent) {
        //修改传参
        let data = {
          id: this.formData.id,
          userNoList: meterNoArr,
          planTime: this.formData.planTime,
          // planStartTime:this.time[0],
          reason: this.formData.reason
        }
        return data
      } else {
        //新增传参
        //     if(this.time===null){
        //    this.time = ['','']
        //  }

        let data = {
          userNoList: meterNoArr,
          planTime: this.formData.planTime,
          // planStartTime:this.time[0],
          reason: this.formData.reason
        }
        return data
      }
    },
    save () {
      this.$refs['billForm'].validate((valid) => {
        if (valid) {
          if (this.hideContent) {
            let params = {
              busicode: "ValveCloseUpdate",
              data: this.getFormbData()
            };
            this.$api.fetch({ params })
              .then(res => {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                })
                this.$parent.closeDialog()
              });
          } else {
            let params = {
              busicode: "ValveCloseAdd",
              data: this.getFormbData()
            };
            this.$api.fetch({ params })
              .then(res => {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })

                this.$parent.closeDialog()
              });

          }

        }
      })
    },
    //分页
    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange (val) {  //显示多少页码
      if (val) {
        this.tableQuery.page = val
        this.init()
      }
    },
    indexMethod (index) {//获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
  }
}
</script>
<style lang="scss">
.select-btn {
  float: right;
  margin-bottom: 0.2rem;
}
.date-change {
  width: 90%;
}
.formBill .f1 {
  width: 26.85%;
}
/* .formBill-One,.formBill-Two,.formBill-Three, */
.formBill .f1 .el-form-item__content {
  width: calc(100% - 130px);
}
</style>
