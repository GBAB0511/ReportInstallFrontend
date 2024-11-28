<template>
  <div class="engineerPendingEdit process">
    <legend class="legendColumn">挂起申请</legend>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      class="formBill"
      :inline="true"
      size="mini"
      label-width="100px"
      label-position="right"
    >
    <el-form-item prop="processStateName" label="挂起节点：" class="col-2">
        <span class="node-name">{{
          processStateName
        }}</span>
      </el-form-item>
      <el-form-item prop="processStateName" label="申请日期：" v-if="disabledNot">
        <span >{{billDate}}</span>
      </el-form-item>
      <el-form-item prop="processStateName" label="工程编号：" v-if="disabledNot">
        <span >{{pjNo}}</span>
      </el-form-item>
      <el-form-item prop="processStateName" label="工程名称：" v-if="disabledNot">
        <span >{{pjName}}</span>
      </el-form-item>
      <el-form-item prop="processStateName" label="工程类型：" v-if="disabledNot">
        <span >{{pjTypeName}}</span>
      </el-form-item>
      <el-form-item prop="processStateName" label="工程地址：" v-if="disabledNot">
        <span >{{installAddr}}</span>
      </el-form-item>
      <el-form-item prop="processStateName" label="客户名称：" v-if="disabledNot">
        <span >{{ctmName}}</span>
      </el-form-item>
      <el-form-item prop="processStateName" label="手机号码：" v-if="disabledNot">
        <span >{{mobile}}</span>
      </el-form-item>
      
      <el-form-item prop="pendingReason" label="挂起说明：" class="col-2">
        <el-input :disabled="disabledNot"
          @input="(e) => (input = inputMe(e))"
          type="textarea"
          v-model="form.pendingReason"
        ></el-input>
      </el-form-item>
      <!-- <br />
      <span class="remark">备注：点击挂起节点可以查看流程详细信息</span> -->
      <div class="btns">
        <el-button v-show="hiddenBtton||hiddenBtton==undefined" type="primary" @click="handleSave" class="el-button  el-button--mini is-plain sur">提 交</el-button>
        <el-button v-show="hiddenBtton||hiddenBtton==undefined" @click="dialogClose()" class="el-button el-button--info el-button--mini is-plain canc" style="width:60px;background:#F4F4F5">取 消</el-button>
      </div>
    </el-form>

    <legend class="legendColumn" v-show="!(hiddenBtton||hiddenBtton==undefined)">
      流程处理
      <i class="fontRight"></i>
    </legend>
    <div id="workflowDiv" v-show="!(hiddenBtton||hiddenBtton==undefined)"></div>
    <el-dialog
      :visible.sync="show"
      title="工程详情"
      class="common-dialog"
      :append-to-body="true"
    >
      <engineer-approval-edit
        v-if="show"
        :id="consultId"
        :billNo="billNo"
        :noProcess="true"
        :append-to-body="true"
      />
    </el-dialog>
  </div>
</template>

<script>
import engineerApprovalEdit from "../engineerApproval/engineerApprovalEdit.vue";
export default {
  components: { engineerApprovalEdit },
  props: ["pendingData",'hidd'],
  data() {
    return {
      resData:{},
      hiddenBtton:true,
      delayReasonArr:[],
      submitData: "",
      consultId: "",
      billNo: "",
      form: {
        pjId: "",
        pendingReason: "",
      },
      pjNo:"",
      pjName:"",
      pjTypeName:"",
      installAddr:"",
      ctmName:"",
      mobile:"",
      billDate:"",
      processStateName: "",
      processInstanceId: "",
      rules: {
        pendingReason: [
          { required: true, message: "挂起说明不能为空", trigger: "blur" },
        ],
      },
      show: false,
      disabledNot: false,
    };
  },
  watch: {
    show() {
      console.log(this.form.pjId);
    },
  },
  created() {
    
  },
  mounted(){
    // console.log(this.hidd);
    this.hiddenBtton=this.hidd
    // console.log(this.pendingData)
    // this.getDictionaryOptions()
    if (this.pendingData.id) {
      this.disabledNot = false;
      this.getDetailById(this.pendingData.id);
    }
    if (this.pendingData.pendingId) {
      this.disabledNot = true;
      this.getDetailByPedingId(this.pendingData.pendingId);
    }
  },
  methods: {
    handleSave(){

    },
    dialogClose(){
      this.$emit("func",this.dialogClose);
    },
    inputMe(e) {
      let str = e.replace(/\ +/g, "");
      str = str.replace(/[\r\n]/g, "");
      //console.log(str);
      return str;
    },
    // 获取字典数据
//     getDictionaryOptions() {
//       var _this = this
//       var params = {
//         "busicode": "DictionarySelect",
// "data": "PROJECT_DELAY_REASON"
//         // 延期原因
//         }
//         this.$api.fetch({
//           params: params,//参数
//           }).then(res => {
//             _this.delayReasonArr= res.PROJECT_DELAY_REASON
//         // console.log(this.delayData)
//     if (this.delayData.id) {
//       this.getDetailById(this.delayData.id);
//     }
//     if (this.delayData.delayId) {
//       this.getDetailByDelayId(this.delayData.delayId);
//     }
//     })
//     },
    getDetailById(id) {
      const params = {
        busicode: "PjInfoQuery",
        data: { id: id },
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          this.resData=res
          console.log("详情获取", res);
          const consult = res.consult;
          this.form.pjId = consult.id;
          this.processStateName = consult.processName;
          this.form.nodeCode = consult.processState;
          this.processInstanceId = consult.processInstanceId;
          this.consultId=consult.id
          this.overTimeSearch()
          this.getHtmlData();
        });
    },
    getDelayDateByProcessNode(processState) {
      const params = {
        busicode: "ProcessNodeList",
        data: {
          receiptType: "pj_info_new",
          nodeCode: processState,
        },
      };
      this.$api
        .fetch({
          params: params,
        })
        .then((res) => {
          console.log("获取当前节点延期时间", res);
          this.form.oldTimeOut = res[0].timeOut;
          this.getHtmlData();
        });
    },
    save(id) {
      this.submitData.pendingReason = this.form.pendingReason;
      const params = {
        busicode: "PjPendingUpdate",
        data: this.submitData,
      };
      this.$api
        .fetch({
          params: params,
        })
        .then((res) => {
          console.log("获取详情", res);
          this.submitData = res;
          this.form = {
            pjId: res.id,
            pendingReason: res.pendingReason
          };
          this.processStateName = res.nodeName;
          this.processInstanceId = res.processInstanceId;
          this.consultId = res.consultId;
          this.getHtmlData();
        });
    },
    getDetailByPedingId(id) {
      console.log(id)
      const params = {
        busicode: "PjPendingQuery",
        data: {
          id: id,
        },
      };
      this.$api
        .fetch({
          params: params,
        })
        .then((res) => {
          this.submitData = res;
          this.form = {
            pjId: res.id,
            pendingReason: res.pendingReason,
          };
          this.processStateName = res.pjNodeName;
          this.billDate = res.billDate;
          this.pjNo = res.pjNo;
          this.pjName = res.pjName;
          this.pjTypeName = res.pjTypeName;
          this.installAddr = res.installAddr;
          this.ctmName = res.ctmName;
          this.mobile = res.mobile;
          this.processInstanceId = res.processInstanceId;
          this.consultId = res.consultId;
          this.getHtmlData();
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      console.log(this)
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "pj_pending",
        "审批流配置:报装(工程挂起)",
        _this.pendingData.pendingId,
        _this.processInstanceId,
        "workflowDiv",
        _this,
        (res) => {
          if (
            window.location.href.indexOf("HallBusiness") > -1 ||
            window.location.href.indexOf("PendingTrial") > -1 ||
            window.location.href.indexOf("WaterSideIndex") > -1
          ) {
            // 流程中心模块触发
            this.$parent.$parent.closeDialog
              ? this.$parent.$parent.closeDialog()
              : this.$parent.closeDialog();
          } else {
            // 普通模块触发
            this.$parent.closeDialog(); // 提交后回调方法
            this.$parent.init()
          }
        },
        _this.pendingData.pendingId ? 0 : 1,
        "", //保存方法的接口名称
        "ProcessCommit"
      );
    },
    getFormbData() {
      console.log(this.form);
      return {
        ...this.form,
        // id:this.submitData.id,
        pendingReason:this.form.pendingReason,
      };
    },
    validate(){
      return new Promise((res,rej)=>{
        if(this.form.pendingReason===""){
          this.$message({
            showClose: true,
            message: '挂起说明未填写  ',
            type: 'warning'
          });
          return;
        }
        res(null);
      }).then(res=>{
        return res;
      })
    },
            overTimeSearch(){
              const params = {
              "busicode": "OverdueDelayList",
              "data": {
                processSetCode:this.form.nodeCode,
                processCode:'pj_info_new',
                billId:this.pendingData.id,
                nodeName:this.processStateName
                  }
                }
                this.$api.fetch({
                  params: params,//参数
                }).then(res => {
                  if(res.length==0){
                    this.form.oldTimeOut=this.timeFormate2(new Date());
                    console.log(this.form.oldTimeOut);
                    return false;
                  }else{
                    this.form.oldTimeOut=res.predictTime;
                  }
                  return false
              })
            },
            timeFormate2 (timeStamp) {
                let year = new Date(timeStamp).getFullYear();
                let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
                let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
                let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
                let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
                let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
                timeStamp = year + "-" + month + "-" + date+' '+hh+':'+mm+':'+ss;
                return timeStamp
            },
            async changeBeforeSubmit (b) { //提交前进行校验
                let message = null
                message = await this.validate();
                return message
            },
            async handleSave(){
              await this.validate();
              const params = {
                "busicode": "PjPendingInsert",
                "data":{
                  pjId: this.pendingData.id,
                  pendingReason: this.form.pendingReason,
                }
              }
                this.$api.fetch({
                    params: params,//参数
                }).then(res => {
                    this.$message({
                      showClose: true,
                      message: '挂起新增成功',
                      type: 'success'
                    });
                    const params={
                      "busicode": "ProcessCommit",
                      "data":{
                        "billId":res,
                        "formVariables":{},
                        "operation":32,
                        "receiptType":"pj_pending",
                        "title":"审批流配置:报装(工程挂起)"
                      },
                      token: sessionStorage.getItem('token'),
                    }
                    this.$api.fetch({
                        params: params,//参数
                    }).then(act=>{
                      this.$emit("func",this.dialogClose);
                    })
                })
            },
  },
};
</script>

<style lang="scss" scoped>
.engineerPendingEdit {
  height: calc(100% - 50px);
  overflow-y: auto;
  /deep/ {
    .el-form-item__content {
      width: calc(100% - 170px);
    }
    .formBill .el-form-item .el-input__inner {
      height: 30px;
      width: 100% !important;
      /* font-size: 12px; */
      font-size: 14px;
      color: #000;
    }
  }

  .col-2 {
    width: calc(90% + 10px);
  }
  .remark {
    margin-left: 20px;
  }
  .node-name {
    color: red;
    font-weight: bold;
    cursor: pointer;
  }
  .btns {
      display: flex;
      margin-top:10%;
      justify-content: center;
    }
    .sur{
      width:60px;background:rgb(64,158,255);color:#F4F4F5
    }
    .sur:hover{
      background:rgb(102,177,255);
      // color:#000000;
    }
    .canc:hover,.canc:active{
      background-color:#4F4F4F;
      color:#000000;
    }
}
</style>