<template>
  <div class="engineerTerminationEdit">
    <legend class="legendColumn">
      终止申请
    </legend>
    <el-form :model="form" :rules="rules" ref="form" class="formBill-Three" :inline="true" size="mini" label-width="130px" label-position="right">
      <el-form-item prop="pjName" label="终止节点：">
        <span @click="show = true" class="node-name">{{nodeName}}</span>
      </el-form-item>
      <!-- <br> -->
      <div v-if="moreShow">
        <settlement-compile
          v-if="processState == 'PROCESSING'"
          ref="settlementCompile"
          :editData="editData"
          :noLegend="true"
        />
        <settlement-payment
          v-if="processState == 'terminationSetmt' || processState == 'END' || processState == 'CANCEL'"
          ref="settlementPayment"
          :dict="{PBT: dictionaryData.PBT}"
          :editData="editData"
          :nolegend="true"
          :disabled="processState == 'END' || processState == 'CANCEL'"
        />
      </div>
      <el-form-item prop="terminationReason" label="终止原因：" style="margin-left:50px">
            <el-select v-model="form.terminationReason" size="mini" style="width:140px" :disabled="processState == 'CANCEL' || processState == 'END'">
                <el-option v-for="item in Reason" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>  
      </el-form-item>
      <el-form-item prop="comments" label="备注：" class="f2" v-if="processState !== 'terminationSetmt'">
        <el-input type="textarea" v-model="form.comments" :disabled="processState == 'CANCEL' || processState == 'END'"></el-input>
      </el-form-item>
      <br/>
      <span>备注：点击终止节点可以查看流程详细信息</span>
        
      
      
      <div class="btns">
        <el-button v-show="hiddenBtton||hiddenBtton==undefined" type="primary" @click="handleSave" class=" el-button el-button--info el-button--mini is-plain sur" style="width:60px;background:#F4F4F5;background:#FFFFFF">确 定</el-button>
        <el-button v-show="hiddenBtton||hiddenBtton==undefined" @click="dialogClose()" class=" el-button el-button--info el-button--mini is-plain canc" style="width:60px;background:#F4F4F5">取 消</el-button>
      </div>
    </el-form>
    <legend v-show="!(hiddenBtton||hiddenBtton==undefined)" class="legendColumn">流程处理
      <i class="fontRight" ></i>
    </legend>
    <div v-show="!(hiddenBtton||hiddenBtton==undefined)" id="workflowDiv"></div>


    <el-dialog :visible.sync="show" title="工程详情" class="common-dialog" :append-to-body="true">
      <engineer-approval-edit v-if="show" :id="form.pjId" :noProcess="true" :append-to-body="true"/>
    </el-dialog>

  </div>
</template>

<script>
    import engineerApprovalEdit from '../engineerApproval/engineerApprovalEdit.vue'
    import settlementCompile from '../engineerApproval/stepsForm/settlementCompile.vue'
    import settlementPayment from '../engineerApproval/stepsForm/settlementPayment.vue'
    export default {
        components: { engineerApprovalEdit, settlementCompile, settlementPayment },
        props: ['terminationData',"hidd",'terminationFlag'],
        data() {
            return {
                hiddenBtton:true,
                form: {
                    pjId: '',
                    // settlement: 0,
                    comments: '',
                    nodeCode: '',
                    terminationReason:'',
                },
                Reason:[],
                rules: {
                    // comments: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
                    terminationReason: [{ required: true, message: '终止原因未选择', trigger: 'blur' }]
                },
                nodeName: '',
                processState: '',
                processStateName: '',
                processInstanceId: '',
                show: false,
                moreShow: false,
                editData: {},
                dictionaryData: {
                    PBT: []
                }
            }
        },
        created() {
            this.getDictionary()
            if(this.terminationData.id) {
                this.getDetailById(this.terminationData.id)
            }
            if(this.terminationData.terminationId) {
                this.getDetailByDelayId(this.terminationData.terminationId)
            }
            //this.getDictionaryOptions()
            this.hiddenBtton=this.hidd
            if(this.hiddenBtton==false){

            }
            //this.getHtmlData()
        },
        mounted(){
            
        },
        watch:{
            processState(){
                console.log(this.processState);
            }
        },
        methods: {
            terminationUpdate(){
                const params = {
                    "busicode": "PjTerminationUpdate",
                    "data":{
                        'id':this.terminationData.terminationId,
                        // 'settlement':this.form.settlement,
                        "comments":this.form.comments,
                        'terminationReason':this.form.terminationReason
                    }
                }
                this.$api.fetch({
                    params: params,//参数
                }).then(res => {

                })
            },
            getDictionary() {
            var params = {
                "busicode": "DictionarySelect",
                "data": "PROJECT_TERMINATION_REASON"
            }
            this.$api.fetch({
                params: params,//参数
            }).then(res => {
                this.Reason=res.PROJECT_TERMINATION_REASON
                // console.log(JSON.stringify(Reason));
            })
            },
            inputMe(e){
                let str=e.replace(/\ +/g,"")
                str=str.replace(/[\r\n]/g,"")
                //console.log(str);
                return str;
            },
            dialogClose(){
                // console.log('11111');
                this.$emit("func",this.dialogClose);
                
            },
            //前端校验
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
                     if(this.form.terminationReason===""){
                        this.$message({
                            showClose: true,
                            message: '终止原因未选择',
                            type: 'warning'
                        });
                        return;
                    }
                    res(null);
                }).then(res=>{
                    return res;
                })
            },
            async changeBeforeSubmit (b) { //提交前进行校验
                let message = null
                message = await this.validate();
                this.terminationUpdate()
                return message
            },
            async handleSave(){
              let _this = this;
                await this.validate();
                
                
                const params = {
                    "busicode": "PjTerminationInsert",
                    "data":{
                        "pjId":this.form.pjId,
                        // "settlement":this.form.settlement,
                        "comments":this.form.comments,
                        "nodeCode":this.form.nodeCode,
                        'terminationReason':this.form.terminationReason
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
                            "formVariables":{
                              "sourceFlag":_this.terminationData.sourceFlag,
                            },
                            "operation":32,
                            "receiptType":"pj_termination",
                            "title":"审批流配置:报装(工程终止)"
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
                                terminationFlag:1,
                                delayFlag:1,
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
            getDetailById(id) {
                const params = {
                    "busicode": "PjInfoQuery",
                    "data":{id}
                }
                this.$api.fetch({
                    params: params,//参数
                }).then(res => {
                    const consult = res.consult
                    this.form.pjId = id
                    this.nodeName = consult.processName
                    this.form.nodeCode = consult.processState
                    this.processInstanceId = consult.processInstanceId
                    this.getHtmlData()
                })
            },
            getDetailByDelayId(id) {

                const params = {
                    busicode: 'PjTerminationQuery',
                    data: {
                        id:id
                    }
                }
                this.$api.fetch({
                    params:params
                }).then(res => {
                    this.processInstanceId=res.processInstanceId
                    this.form = {
                        pjId: res.pjId,
                        // settlement: res.settlement,
                        comments: res.comments,
                        nodeCode: res.nodeCode,
                    }
                    this.$set(this.form,'terminationReason',""+res.terminationReason)
                    // this.form.terminationReason=""+res.terminationReason
                    const pjInfo = res.pjInfo
                    this.editData = {
                        // budgetMatrMeterBefore: pjInfo.budgetMatrMeterBefore, // 表前材料费预算
                        // setmtMatrMeterBefore: pjInfo.setmtMatrMeterBefore, // 表前材料费结算
                        // budgetLaborMeterBefore: pjInfo.budgetLaborMeterBefore, // 表前人工费预算
                        // setmtLaborMeterBefore: pjInfo.setmtLaborMeterBefore, // 表前人工费结算
                        // budgetMatrMeterAfter: pjInfo.budgetMatrMeterAfter, // 表后材料费预算
                        // setmtMatrMeterAfter: pjInfo.setmtMatrMeterAfter, // 表后材料费结算
                        // budgetLaborMeterAfter: pjInfo.budgetLaborMeterAfter, // 表后人工费预算
                        // setmtLaborMeterAfter: pjInfo.setmtLaborMeterAfter, // 表后人工费结算
                        // budgetCost: pjInfo.budgetCost, // 预算费
                        // setmtBudgetCostFlag: pjInfo.setmtBudgetCostFlag, // 是否勾选预算费结算
                        // setmtBudgetCost: pjInfo.setmtBudgetCost, // 预算费结算
                        // designCost: pjInfo.designCost, // 设计费
                        // setmtDesignCostFlag: pjInfo.setmtDesignCostFlag, // 是否勾选设计费结算
                        // setmtDesignCost: pjInfo.setmtDesignCost, // 设计费结算
                        // budgetPayWayName: pjInfo.budgetPayWayName, // 结算方式
                        // budgetMoney: pjInfo.budgetMoney, // 预算金额
                        // constructionCost: pjInfo.constructionCost, // 工程造价
                        // setmtDate: pjInfo.setmtDate, // 结算日期
                        // accruedMoney: pjInfo.accruedMoney, // 预缴金额
                        // costShare: pjInfo.costShare, // 总管分摊费用
                        // setmtMoney: pjInfo.setmtMoney, // 合计总额
                        // depositMoney: pjInfo.depositMoney, // 押金
                        // depositBackFlag: pjInfo.depositBackFlag, // 是否退押金
                        // depositBackFlagName: pjInfo.depositBackFlagName, // 是否退押金
                        // backFillMoney: pjInfo.backFillMoney, // 找补金额
                        // setmtPayDate: pjInfo.setmtPayDate, // 结算日期
                        // refundWay: pjInfo.refundWay, // 余额退款方式
                        // refundWayName: pjInfo.refundWayName, // 余额退款方式
                        // openAccountBank: pjInfo.openAccountBank, // 开户行
                        // openAccountBankName: pjInfo.openAccountBankName, // 开户行
                        // openAccountName: pjInfo.openAccountName, // 户名
                        // bankAccount: pjInfo.bankAccount, // 账户号
                        // comments: pjInfo.comments // 备注
                    },
                        this.nodeName = res.nodeCode
                    this.processState = res.processState
                    console.log(this.processState);
                    this.processInstanceId = res.processInstanceId
                    this.getHtmlData()

                })
            },
            // 获取审批流前端代码
            getHtmlData() {
                let _this = this;
                //************启用流程代码************** */
                _this.common.getProcessShowView(
                    "pj_termination",
                    "审批流配置:" + _this.processStateName + "(" + _this.billNo + ")",
                    _this.terminationData.terminationId,
                    _this.processInstanceId,
                    //undefined,
                    "workflowDiv",
                    _this, (res) => {
                        if (window.location.href.indexOf("HallBusiness") > -1 || window.location.href.indexOf("PendingTrial") > -1 || window.location.href.indexOf("WaterSideIndex") > -1) {
                            // 流程中心模块触发
                            this.$parent.$parent.closeDialog ? this.$parent.$parent.closeDialog() : this.$parent.closeDialog();
                        } else {
                            // 普通模块触发
                            this.$parent.closeDialog(); // 提交后回调方法
                            // this.terminationUpdate()
                            // console.log(windows.data.operation);
                        }
                    },
                    //0,
                    1,
                    (this.processState == '' || this.processState == 'terminationApply') ? 'PjTermination' : (this.processState == 'terminationSetmt' ? 'PjTerminationCharge' : 'PjTerminationSetmt'),//保存方法的接口名称
                    'ProcessCommit'
                );
            },

            // 获取字典数据
//     getDictionaryOptions() {
//       var _this = this
//       var params = {
//         "busicode": "DictionarySelect",
//         "data": "PBT"
//         // 余额退款形式
//       }
//       this.$api.fetch({
//         params: params,//参数
//       }).then(res => {
//         _this.dictionaryData = res
//       })
//     },
            getFormbData() {
                if(this.processState == '' || this.processState == 'terminationApply') {
                    return {
                        ...this.form,
                        id: this.terminationData.terminationId
                    }
                }
                if(this.processState == 'PROCESSING'||this.processState =='register') {
                    const settlementCompile = this.$refs.settlementCompile && this.$refs.settlementCompile.form || {}
                    return {
                        ...this.form,
                        id: this.terminationData.terminationId,
                        pjInfo: {
                            setmtLaborMeterBefore: settlementCompile.setmtLaborMeterBefore,
                            setmtLaborMeterAfter: settlementCompile.setmtLaborMeterAfter,
                            setmtMatrMeterBefore: settlementCompile.setmtMatrMeterBefore,
                            setmtMatrMeterAfter: settlementCompile.setmtMatrMeterAfter,
                            constructionCost: settlementCompile.constructionCost,
                            setmtBudgetCost: settlementCompile.setmtBudgetCost,
                            setmtDesignCost: settlementCompile.setmtDesignCost,
                            setmtBudgetCostFlag: settlementCompile.setmtBudgetCostFlag ? 1 : 0,
                            setmtDesignCostFlag: settlementCompile.setmtDesignCostFlag ? 1 : 0,
                            depositBackFlag: settlementCompile.depositBackFlag,
                            costShare: settlementCompile.costShare,
                            setmtMoney: settlementCompile.setmtMoney,
                            setmtDate: settlementCompile.setmtDate,
                        },
                        formVariables: {
                            // settlement:1,
                            // comments:this.form.comments,
                            // terminationReason:this.form.terminationReason
                        },
                    }
                }

                if(this.processState == 'terminationSetmt'){
                    const settlementPayment = this.$refs.settlementPayment && this.$refs.settlementPayment.form || {}
                    return {
                        id: this.form.pjId,
                        openAccountBank: settlementPayment.openAccountBank,
                        openAccountName: settlementPayment.openAccountName,
                        bankAccount: settlementPayment.bankAccount,
                        setmtPayComments: settlementPayment.comments,
                        setmtPayDate: settlementPayment.setmtPayDate,
                        refundWay: settlementPayment.refundWay
                    }
                }

            },
            BeforeSubmit() {
                return new Promise(resolve => {
                    this.$refs.form.validate(valid => {
                        if(!valid) {
                            resolve('终止申请有必填字段未填写！')
                        } else {
                            resolve('')
                        }
                    })
                })
            },
        },
        watch: {
            form:{
                handler(newVal, oldVal){
                    // console.log("1111");
                    this.$forceUpdate()
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss" scoped>
  .engineerTerminationEdit {
    height: calc(100% - 50px);
    overflow-y: auto;
    .col-2 {
      width: calc(46% + 10px);
    }
    .node-name {
      color: red;
      font-weight: bold;
      cursor: pointer;
    }
    .btns {
      display: flex;
      justify-content: center;
    }
    .sur:hover,.sur:active{
      background-color:#97CBFF;
      color:#000000;
    }
    .canc:hover,.canc:active{
      background-color:#4F4F4F;
      color:#000000;
    }

  }
</style>
