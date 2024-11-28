
<template>
    <div class="BusinessAreaEdit">
        <el-form v-if="pageIndex==1" class="formBill-One" ref="BusinessAreaEdit" :inline="true" size="mini" label-width="100px">
            <el-form-item label="部门名称：">
            <el-select v-model="form.departBelong" placeholder="请选择" ref="searchSelect" @change="changeSelect" filterable  @blur="selectBlur1">
              <el-option
                v-for="(item,index) in brandOptions"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>

            </el-form-item>
            <el-form-item label="验收项分类：">
              <el-select v-model="form.checkItem" placeholder="请选择" @click='getSecondNav' @input='showCheck' filterable  @blur="selectBlur2">
                <el-option
                  v-for="(item,index) in typeOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="验收子项：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.checkSubitem" type="text" size="main"></el-input>
            </el-form-item>
            <el-form-item label="是否启用：">
              <el-select v-model="form.stopFlag" placeholder="请选择">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
        </el-form>
        <!-- <div class="block">
          <span>asd</span>
        </div> -->

        <el-form v-if="pageIndex==0" class="formBill-One" ref="BusinessAreaEdit" :inline="true" size="mini" label-width="100px">
            <el-form-item label="部门名称：">
            <el-select v-model="approvalForm.departBelong" placeholder="请选择">
              <el-option
                v-for="(item,index) in brandOptions"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>

            </el-form-item>
            <el-form-item label="验收人员：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="text" size="main" v-model="approvalForm.checkStaff"></el-input>
            </el-form-item>
            <el-form-item label="允许查看金额：">
              <el-select v-model="approvalForm.moneyFlag" placeholder="请选择">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
        </el-form>




    </div>
</template>
<script>
import loginVue from '../../../login.vue'
export default {
    name:"BusinessAreaEdit",
    props:['departInfo','checkInfo'],
    data(){
        return{
          dictionaryData:'',
          pageIndex:-1,
          changeType:1, //0为验收添加，1为验收修改，2，为报装权限添加，3位报装权限修改
          brandOptions: [],
          brandObj:  [] ,
          typeOptions: [],
          form: {
            id:undefined,
            departBelong: '',
            checkItem: '',
            checkSubitem:'',
            stopFlag: 1
          },

          approvalForm:{
            id:undefined,
            departBelong:'',//验收部门
            checkStaff:'',//验收人员
            moneyFlag:'',//是否允许查看金额

          }
        }
    },
    mounted(){
      // this.form=''
      this.brandOptions=this.$parent.unique(this.departInfo)
      console.log(this.brandOptions);
      this.brandObj=this.checkInfo
      eventBus.$on("AllTableConfig",item=>{
        this.brandOptions=item.departInfo
        console.log(this.brandOptions);
        this.brandObj=item.checkInfo
        this.pageIndex=item.pageIndex
        this.dictionaryData=item.dictionaryData
        // console.log("------------"+this.dictionaryData);
      })
      eventBus.$on('changeProjectAcceptanceData',item=>{
        this.changeType=1
        //console.log(item);
        this.form={...item}
        //console.log('change');
      })
      eventBus.$on('addProjectAcceptanceData',item=>{
        this.changeType=0
        //console.log(item);
         this.form={}
        //console.log('add');
      })
      eventBus.$on('changeProjectApprovalData',item=>{
        this.changeType=3
        // console.log('工程报装权限修改');
        this.approvalForm={...item}
      })
      eventBus.$on('addProjectApprovalData',item=>{
        this.changeType=2
        // console.log('工程报装权限添加');
        this.approvalForm={}
      })
    },
    destroyed(){
      eventBus.$off('AllTableConfig')
      eventBus.$off('changeProjectAcceptanceData')
      eventBus.$off('addProjectAcceptanceData')
      eventBus.$off('changeProjectApprovalData')
    },
    watch:{
      
    },
    methods: {
      showCheck(){
        this.$forceUpdate()
      },
      selectBlur1(even) {
        if (even.target.value) {
          this.form.departBelong= even.target.value;
          this.$forceUpdate()
        }
      },
      selectBlur2(even) {
        if (even.target.value) {
          this.form.checkItem= even.target.value;
          this.$forceUpdate()
        }
      },
      //添加验收配置
      submitForm(){
        // console.log('changeType',this.changeType);
        // console.log('1111111',this.form.departBelong);
        if(this.pageIndex==1){//工程验收配置
          if(this.form.departBelong==''||this.form.departBelong==undefined||this.form.checkItem==''||this.form.checkItem==undefined||this.form.checkSubitem==''||this.form.checkSubitem==undefined||this.form.stopFlag==''||this.form.stopFlag==undefined){
          this.$message({
                type: "error",
                message: "验收配置数据未填完成"
              });
              return false
          }
        }else if(this.pageIndex==0){//报装权限添加
          if(this.approvalForm.departBelong==''||this.approvalForm.departBelong==undefined||this.approvalForm.checkStaff==''||this.approvalForm.checkStaff==undefined){
          // console.log('moneyFlag',this.approvalForm.moneyFlag);
          // console.log('departBelong',this.approvalForm.departBelong);
          // console.log('checkStaff',this.approvalForm.checkStaff);
          this.$message({
                type: "error",
                message: "报装权限数据未填完成"
              });
              return false
          }
        }
        
        // console.log('changeType',this.changeType);
        if(this.changeType==0){
          //console.log('111111111111111');
          //console.log("----------"+this.brandOptions);
          var _this = this;
          var params = {
            busicode: "PjCheckTemplateInsert",
            data: {
              ...this.form
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              _this.dictionaryData = res;
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$parent.handleClose()
              this.$parent.getTableData()
            });
          }

        if(this.changeType==1){
          //console.log('111111111111111');
          //console.log("----------"+this.brandOptions);
          var _this = this;
          var params = {
            busicode: "PjCheckTemplateUpdate",
            data: {
              ...this.form
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.$parent.handleClose()
              this.$parent.getTableData()
            });
        }

        if(this.changeType==2){
          // console.log(this.approvalForm);
          //报装添加
          var _this = this;
          var params = {
            busicode: "PjCheckTemplateStaffInsert",
            data: {
              ...this.approvalForm
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              _this.dictionaryData = res;
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$parent.handleClose()
              this.$parent.getApprovalTableData()
            });
        }

        if(this.changeType==3){
          //报装修改
          var _this = this;
          var params = {
            busicode: "PjCheckTemplateStaffUpdate",
            data: {
              ...this.approvalForm
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.$parent.handleClose()
              this.$parent.getApprovalTableData()
            });
        }
        
      },
      getSecondNav(){
        // 遍历手机品牌的下拉选项数组
        for (let i=0;i<this.brandOptions.length;i++) {
        // 手机品牌内容 是否等于 手机品牌的下拉选择数组中的某一项
        if (this.form.departBelong === this.brandOptions[i]) {
          if(this.brandObj){
            this.typeOptions = this.brandObj[i].split(',')
          }
          
        }
      }
      },
      changeSelect() {
      // 清空手机型号内容
      this.form.checkItem = ''

      // 遍历手机品牌的下拉选项数组
      for (let i=0;i<this.brandOptions.length;i++) {
        // 手机品牌内容 是否等于 手机品牌的下拉选择数组中的某一项
        if (this.form.departBelong === this.brandOptions[i]) {
          if(this.brandObj){
            this.typeOptions = this.brandObj[i].split(',')
          }
          
        }
      }
    },
      //保存按钮
      resetForm() {
        this.$refs.BusinessAreaEdit.resetFields();
      },
      handleClose() {
        // this.common.chargeObjectEqual(this,this.ruleForm,'get','BusinessAreaEdit',this.$parent.closeDialog);
        this.$parent.closeDialog()
      },
      editData(val){
        
      }
    },
}
</script>
<style lang="scss" scoped>
>>>.el-form-item label:after {
        content: "";
        display: inline-block;
        width: 100%;
    }

    .el-form-item__label {
        text-align: justify;
        height: 50px;
    }
    
    .el-form-item.is-required .el-form-item__label:before {
        content: none !important;
    }

.BusinessAreaEdit {
  width: 50%;
  height: calc(100% - 41px);
  margin:  0 auto;
  .formBill-One{
      line-height: 43px;
      .el-form-item__label {
        // line-height: 43px;
        vertical-align:middle ;
      }
  }
  /deep/{
    .desc{
      .el-form-item__content{
        font-size:15px;
        margin-left:100px;
        color:rgb(96, 98, 102)
      }
    }
  }
}
</style>

