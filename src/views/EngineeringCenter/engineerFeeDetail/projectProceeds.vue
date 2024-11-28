<template>
  <div class="projectProceeds">
    <el-tabs type="border-card" tab-position="top" v-model="activeName">
      <el-tab-pane label="基础信息" name='basic'>
        <legend class="legendColumn">工程收款</legend>
        <el-form
          ref="form"
          :model="data"
          class="formBill"
          :inline="true"
          size="mini"
          label-width="130px"
          label-position="right"
        >
          <el-form-item prop="budgetMoney" label="工程编码：" class="disable-item">
            <span>{{ data.projectCode }}</span>
          </el-form-item>
          <el-form-item prop="depositMoney" label="工程名称：" class="disable-item">
            <span>{{ data.projectName }}</span>
          </el-form-item>
          <el-form-item label="工程地址：" class="disable-item col-2">
            <span>{{ data.projectAddress }}</span>
          </el-form-item>
          <el-form-item label="客户名称：" class="disable-item">
            <span>{{ data.clientName }}</span>
          </el-form-item>
          <el-form-item label="报装日期：" class="disable-item">
            <span>{{ data.projectDate.split(' ')[0] }}</span>
          </el-form-item>
          <el-form-item label="账单日期：" class="disable-item">
            <span>{{ data.createTime }}</span>
          </el-form-item>
          <el-form-item label="收款日期：" class="disable-item">
            <span>{{ data.paymentDate }}</span>
          </el-form-item>
          <el-form-item label="收款状态：" class="disable-item">
          <span>{{data.statusName}}</span>
          </el-form-item>
          <el-form-item label="收款金额（元）：" :class="{'disable-item': !(data.processState!='END')}">
            <el-input v-if="data.processState!='END'" v-model="data.money"></el-input>
            <span v-else>{{ data.money }}</span>
          </el-form-item>
            <el-form-item label="收款类型：" class="disable-item">
            <span>{{ typeName }}</span>
          </el-form-item>
          <el-form-item label="收款主体：" class="disable-item">
            <span>{{ data.constructionUnit }}</span>
          </el-form-item>
          <el-form-item label="备注：" :class="{'disable-item': !(data.processState!='END')}">
            <el-input type="textarea" v-model="data.notes" v-if="data.processState!='END'"></el-input>
            <span v-else>{{ data.notes }}</span>
          </el-form-item>
          <el-form-item label="收款方式：" :class="{'disable-item': !(data.processState!='END')}">
            <el-select v-if="data.processState!='END'" ref="paymentMethod" v-model="data.paymentMethod" clearable>
              <el-option v-for="item in paymentMethodList.BPP" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span v-else>{{ paymentMethodName }}</span>
          </el-form-item>
          <el-form-item label="收款渠道：" :class="{'disable-item': !(data.processState!='END')}">
            <el-select v-if="data.processState!='END'" ref="paymentApproaches" v-model="data.paymentApproaches" clearable>
              <el-option v-for="item in paymentMethodList.BPC" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span v-else>{{ paymentApproachesName }}</span>
          </el-form-item>
          <el-form-item label="收款人：" :class="{'disable-item': !(data.processState!='END')}">
            <el-select v-if="data.processState!='END'" ref="paymentStaff" v-model="data.paymentStaff" clearable>
              <el-option v-for="item in paymentStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
            <span v-else>{{paymentStaffName}}</span>
          </el-form-item>
          <br />
        </el-form>
        <el-dialog title="查看附件" :visible.sync="viewAttachmentShow"    :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
          <attachment-view-info
            v-if="viewAttachmentShow"
            :receiptAccessory="receiptAccessory"
            busicode="ReceiptAccessoryList"
          ></attachment-view-info>
          <div slot="footer" class="dialog-footer" ref="ruleForm">
            <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
          </div>
        </el-dialog>
        <legend class="legendColumn">上传附件</legend>
        <uploadFile ref="uploadFiles" :receiptType="'pj_collection'" :pdfList="pdfList" :editData="data" v-if="uploadFileShow" :disabledUpload="!!data.processState && data.processState !== '' && data.processState !== 'PROCESSING'"></uploadFile>
        <legend class="legendColumn">流程处理</legend>
        <div id="workflowDiv"></div>
      <!-- 工程收款 -->
      </el-tab-pane>
      <el-tab-pane label="水表信息" name='watch'>
        <waterMeterPj ref="buildwaterMeter" :data="{}" :stepIdx="10" :currentStep="10" :id="pjId" :installAddr="''" :NotDisabled="false" v-on="$listeners"></waterMeterPj>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import uploadFile from "@/components/uploadPic"; //上传附件
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
import waterMeterPj from '../engineerApproval/stepsForm/waterMeterPj.vue';
export default {
  props: ["id","dict","pjId"],
  components: { 
    uploadFile,
    AttachmentViewInfo,
    waterMeterPj
  },
  data() {
    return {
      uploadFileShow: true,
      oldMoney:0,
      data: {
        processState:'',
        projectCode: "",
        projectName: "",
        projectAddress: "",
        clientName: "",
        projectDate: "",
        createTime: "",
        paymentDate: "",
        status: "",
        money:"",
        constructionUnit: "",
        paymentMethod: "",
        paymentApproaches: "",
        paymentStaff: "", // 收款人
      },
      paymentApproachesName: "",
      paymentMethodName: "",
      typeName: "",
      paymentStaffName: "", // 收款人名称
      paymentMethodList: [],
      pdfList:[],
      viewAttachmentShow: false,
      receiptAccessory: {},
      activeName: 'basic',
      paymentStaffList: [], // 收款人数据
    };
  },
  created() {
    this.initData();
  },
  mounted(){
    // this.getDictionary();
    eventBus.$emit('receiptId', this.id);
    this.initAccessory();
  },
  methods: {

    getCollectionInfo() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "BPP,BPC,BPT"//收款方式
      }
      let getDictDara = this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.paymentMethodList = res;
      })
      let collectionSingleData = this.$api.fetch({
        params: {
          busicode: "PjCollectionSingle",
          data: {
            id: this.id
          }
        } //参数
      })
      .then(res => {
        this.data = res;
        this.status=res.status
        this.oldMoney=res.money
        this.getHtmlData(res);
      });
      // 获取收款人数据
      var paramsPost = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "1" }, // 收费员
      };
      let getPostUserData = this.$api.fetch({
        params: paramsPost //参数
      }).then(res => {
        _this.paymentStaffList = res;
      });
      let pData = [];
      pData.push(collectionSingleData)
      pData.push(getDictDara);
      pData.push(getPostUserData);
      return new Promise((resolve,reject) => {
        Promise.all(pData).then(() => {
          resolve();
        })
      })
    },
    initData(){
      this.getCollectionInfo().then(() => {
        this.paymentMethodList.BPT.forEach(item => {
          if(Number(item.value) == this.data.type){
            this.typeName = item.name;
          }
        })
        this.data.paymentMethod = String(this.data.paymentMethod);
        this.data.paymentApproaches = String(this.data.paymentApproaches);
        this.paymentMethodList.BPP.forEach(item => {
          if(item.value == this.data.paymentMethod){
            this.paymentMethodName = item.name;
          }
        })
        this.paymentMethodList.BPC.forEach(item => {
          if(item.value == this.data.paymentApproaches){
            this.paymentApproachesName = item.name;
          }
        })
        this.paymentStaffList.forEach(item => {
          if(item.userAccount == this.data.paymentStaff){
            this.paymentStaffName = item.userName;
          }
        })
      })
    },
    // 数据字典数据获取
    // getDictionary() {
    //   var _this = this
    //   var params = {
    //     "busicode": "DictionarySelect",
    //     "data": "BPP"//收款方式
    //   }
    //   this.$api.fetch({
    //     params: params,//参数
    //   }).then(res => {
    //     _this.paymentMethodList = res;
    //   })
    // },
    getPaymentMethod(value){
      this.data.paymentMethod = value;
    },
    // 获取审批流前端代码
    getHtmlData(pcsData) {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "pj_collection",
        "审批流配置:" + pcsData.processName + "(" + _this.id + ")",
        pcsData.id,
        pcsData.processInstanceId,
        "workflowDiv",
        _this,
        res => {
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
          }
        },
        1
      );
    },
    initAccessory(){    //初始化附件个数
        let _this = this;
          let params = {
            busicode: "ReceiptAccessoryList",
             data: {
              receiptType:"pj_collection",
              receiptId: this.id
            }
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res != null && res.length > 0) {
            _this.$parent.AttachmentQty = res.length
          }else{
            _this.$parent.AttachmentQty=0
          }

        });
    },
    //上传附件
    uploadAttachment(file) {
      let _this = this;
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.id,
          receiptType: "pj_collection",
          accessoryNo: "000",
          file: file.file
        },
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });
          _this.viewAttachment();
          _this.$parent.AttachmentQty = _this.$parent.AttachmentQty + 1
        });
    },
    // 查看附件按钮
    viewAttachment(type) {
      this.receiptAccessory = {
        receiptType: "pj_collection",
        receiptId: this.id
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    closeAttachDialog(){
      this.viewAttachmentShow = false;
      this.$emit('closeAttachment')
    },

    async changeBeforeSubmit (b) { //提交前进行校验
      let message = null
      message = await this.validate();
      return message
    },
    async validate() {

      return new Promise(resolve => {
            // if(this.oldMoney!=this.data.money){
        let params = {
        busicode: "PjCollectionUpdate",
        data: { 
          id: this.data.id,
          money: this.data.money,
          notes: this.data.notes,
          paymentMethod: this.data.paymentMethod,
          paymentApproaches: this.data.paymentApproaches,
          paymentStaff: this.data.paymentStaff, // 收款人
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(() => {
           resolve('')
        });
      // }
      // else{
      //   resolve('')
      // }
          })

    },

      getFormbData() {
        if(this.data.processState  =='COLLECTION'&&this.oldMoney!=this.data.money){
          // console.log('changeMoney');
            return {
                formVariables:{
                  changeFlag:1
                }
              };
        }
        else if(this.data.processState  =='COLLECTION'&&this.oldMoney==this.data.money){
          // console.log('notChangeMoney');
          return {
                formVariables:{
                  changeFlag:0
                }
              };
        }
      else if(this.data.processState  =='PROCESSING'&&this.oldMoney!=this.data.money){
        return {
                formVariables:{
                  changeFlag:1
                }
              };
      }
      return {
          formVariables:{

          }
        };
    },
  }
};
</script>

<style lang="scss" scoped>
.projectProceeds {
    height: 92%;
    overflow: scroll;
    overflow-x:hidden;
  .col-2 {
    width: calc(46% + 10px);
  }
    #text-box {
    padding: 50px 0px;
    font-size: 30px;
    & > div{
      text-align: center;
      }
  }
}
</style>
