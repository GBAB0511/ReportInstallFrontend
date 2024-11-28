<template>
  <div class="engineerDelayEdit process">
    <legend class="legendColumn">延期申请</legend>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      class="formBill"
      :inline="true"
      size="mini"
      label-width="150px"
      label-position="right"
    >
      <el-form-item prop="processStateName" label="延期节点：">
        <span @click="show = true" class="node-name">{{
          processStateName
        }}</span>
      </el-form-item>
      <el-form-item
        prop="oldTimeOut"
        label="原节点超期时间："
        class="disable-item"
        label-width="170px"
      >
        <span style="margin-left: -5px">{{ form.oldTimeOut }}</span>
      </el-form-item>
      <el-form-item
        prop="timeOut"
        label="申请调整为（小时）："
        label-width="170px"
      >
        <el-input
          oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
          v-model="form.timeOut"
          :controls="false"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item
        prop="timeOut"
        label="延期原因："
        label-width="170px"
      >
        <el-select v-model="form.delayReason">
          <el-option v-for="item in delayReasonArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <br />
      <el-form-item prop="comments" label="延期说明：" class="col-2">
        <el-input
          @input="(e) => (input = inputMe(e))"
          type="textarea"
          v-model="form.comments"
        ></el-input>
      </el-form-item>
      <br />
      <span class="remark">备注：点击延期节点可以查看流程详细信息</span>
      <div class="btns">
        <el-button v-show="hiddenBtton||hiddenBtton==undefined" type="primary" @click="handleSave" class=" el-button  el-button--mini is-plain sur">确 定</el-button>
        <el-button v-show="hiddenBtton||hiddenBtton==undefined" @click="dialogClose()" class=" el-button el-button--info el-button--mini is-plain canc" style="width:60px;background:#F4F4F5">取 消</el-button>
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
  props: ["delayData",'hidd'],
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
        oldTimeOut: "",
        timeOut: "",
        comments: "",
        nodeCode: "",
        // delayReason:"",
        // delayReasonName:""
      },
      processStateName: "",
      processInstanceId: "",
      rules: {
        timeOut: [
          { required: true, message: "新延期时间不能为空", trigger: "blur" },
        ],
        comments: [
          { required: true, message: "延期说明不能为空", trigger: "blur" },
        ],
        // delayReason: [
        //   { required: true, message: "延期说明不能为空", trigger: "blur" }
        // ]
      },
      show: false,
    };
  },
  watch: {
    // form: {
    //   handler(newVal, oldVal) {
    //     for(let i=0;i<this.delayReasonArr.length;i++){
    //       if(this.delayReasonArr[i].value==this.form.delayReason){
    //         console.log('----------');
    //         this.submitData.delayReasonName=this.delayReasonArr[i].name
    //         break;
    //       }
    //     }
    //     this.$forceUpdate();
    //   },
    //   deep: true,
    // },
    show() {
      console.log(this.form.pjId);
    },
  },
  created() {
    
  },
  mounted(){
    console.log(this.hidd);
    this.hiddenBtton=this.hidd
    // this.getDictionaryOptions()
    if (this.delayData.id) {
      this.getDetailById(this.delayData.id);
    }
    if (this.delayData.delayId) {
      this.getDetailByDelayId(this.delayData.delayId);
    }
  },
  methods: {
    handleSave(){

    },
    dialogClose(){
      this.$emit("func",this.dialogClose);
    },
                // 获取字典数据
    getDictionaryOptions() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PROJECT_DELAY_REASON"
        // 延期原因
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.delayReasonArr= res.PROJECT_DELAY_REASON
        // console.log(this.delayData)
    if (this.delayData.id) {
      this.getDetailById(this.delayData.id);
    }
    if (this.delayData.delayId) {
      this.getDetailByDelayId(this.delayData.delayId);
    }
      })
    },
    inputMe(e) {
      let str = e.replace(/\ +/g, "");
      str = str.replace(/[\r\n]/g, "");
      //console.log(str);
      return str;
    },
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
      this.submitData.overdueTime = this.form.timeOut * 3600;
      this.submitData.comment = this.form.comments;
      // this.submitData.delayReason=this.form.delayReason
      const params = {
        busicode: "PjDelayUpdate",
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
            oldTimeOut: res.oldDelayTime,
            timeOut: res.overdueTime / 3600,
            comments: res.comment,
            nodeCode: res.nodeCode,
          };
          this.processStateName = res.nodeName;
          this.processInstanceId = res.processInstanceId;
          this.consultId = res.consultId;
          this.getHtmlData();
        });
    },
    getDetailByDelayId(id) {
      const params = {
        busicode: "PjDelaySingle",
        data: {
          id: id,
        },
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
            oldTimeOut: res.oldDelayTime,
            timeOut: res.overdueTime / 3600,
            comments: res.comment,
            nodeCode: res.nodeCode,
            // delayReason:res.delayReason
          };
          this.processStateName = res.nodeName;
          this.processInstanceId = res.processInstanceId;
          this.consultId = res.consultId;
          this.getHtmlData();
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "pj_delay",
        "审批流配置:" + _this.processStateName + "(" + _this.billNo + ")",
        _this.delayData.delayId,
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
        _this.delayData.delayId ? 0 : 1,
        "PjDelayUpdate", //保存方法的接口名称
        "ProcessCommit"
      );
    },
    getFormbData() {
      console.log(this.form);
      return {
        ...this.form,
        id:this.submitData.id,
        pjId:undefined,
        timeOut:undefined,
        overdueTime:this.form.timeOut*3600,
        comments:undefined,
        oldDelayTime:this.form.oldTimeOut,
        oldTimeOut:undefined,
        // delayReasonName:this.submitData.delayReasonName,
        comment:this.form.comments,

      };
    },
    validate(){
                return new Promise((res,rej)=>{
                    // if(this.form.comments===""){
                    //     this.$message({
                    //         showClose: true,
                    //         message: '终止说明不能为空',
                    //         type: 'warning'
                    //     });
                    //     return;
                    // }
                     if(this.form.timeOut===""){
                        this.$message({
                            showClose: true,
                            message: '调整时间未选择',
                            type: 'warning'
                        });
                        return;
                    }
                    // if(this.form.delayReason===""){
                    //     this.$message({
                    //         showClose: true,
                    //         message: '延期原因未填写',
                    //         type: 'warning'
                    //     });
                    //     return;
                    // }
                    if(this.form.timeOut===""){
                        this.$message({
                            showClose: true,
                            message: '调整时间填写  ',
                            type: 'warning'
                        });
                        return;
                    }
                    if(this.form.comments===""){
                        this.$message({
                            showClose: true,
                            message: '延期说明未填写  ',
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
                billId:this.delayData.id,
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
                
                console.log(JSON.stringify(this.form));
                const params = {
                    "busicode": "PjDelayInsert",
                    "data":{
                        pjBillNo:this.resData.consult.billNo,
                        pjType:this.resData.consult.pjType,
                        installAddr:this.resData.consult.installAddr,
                        ctmName:this.resData.ctmInfo.ctmName,
                        phone:this.resData.ctmInfo.mobile,
                        nodeName:this.resData.consult.processName,
                        oldDelayTime:this.form.oldTimeOut,
                        overdueTime:parseFloat(this.form.timeOut)*3600,
                        // delayReason:this.form.delayReason,
                        // delayReasonName:this.submitData.delayReasonName,
                        comment:this.form.comments,
                        processName:this.resData.consult.processName,
                        tenantId:this.resData.consult.tenantId
                    }
                }
                this.$api.fetch({
                    params: params,//参数
                }).then(res => {
                    this.$message({
                        showClose: true,
                        message: '确定完成',
                        type: 'success'
                    });
                    
                    const params={
                        "busicode": "ProcessCommit",
                        "data":{
                            "billId":res,
                            "formVariables":{},
                            "operation":32,
                            "receiptType":"pj_delay",
                            "title":"审批流配置:报装(工程延期)"
                        },

                        token: sessionStorage.getItem('token'),
                    }
                    this.$api.fetch({
                        params: params,//参数
                    }).then(act=>{    
                        var params = {
                            busicode: "PjInfoUpdate",
                            data: {
                                id:this.form.pjId,
                                delayFlag:1
                            }
                            };
                            // let data=window.getSubmitData();
                            // console.log(data);
                            // if(data.operation!=undefined&&data.operation==32){
                                this.$api
                                .fetch({
                                    params: params //参数
                                })
                                .then(res => {
                                    // console.log(res);
                                    this.$emit("func",this.dialogClose);
                                })
                            // }
                            
                            })
                    
                })
            },
  },
};
</script>

<style lang="scss" scoped>
.engineerDelayEdit {
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
    width: calc(46% + 10px);
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
      margin-top:14%;
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