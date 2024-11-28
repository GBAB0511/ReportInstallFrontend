<template>
  <div class="priceInfo">
    <legend class="legendColumn">用户-价格信息</legend>
    <el-form :model="formData" class="formBill" size="mini" :rules="rules" ref="ruleForm"> 
      <el-form-item label="用水类型：" v-if="wayOpen!=='changeMangement'" prop="useWaterType" :class="{'disable-item':editType==0}">
        <span v-if="editType==0 && formData.useWaterType =='6'" class="clickable" @click="showUserMixture">{{formData.useWaterTypeName}}</span>
        <span v-else-if="editType==0 && formData.useWaterType !='6'">{{formData.useWaterTypeName}}</span>

        <el-cascader :disabled="permission!=1" @change="(val)=>{waterTypeChange(val)}" v-else v-model="formData.useWaterType" :options="waterTypeData" :show-all-levels="false" :props="props" clearable>
        </el-cascader>

        <!-- <el-select v-else  v-model="formData.useWaterType" clearable placeholder="">

          <el-option v-for="(item,index) in dictionaryData.BWT" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="详细价格：" v-if="wayOpen!=='changeMangement'">
        <el-button size="mini" type="text" @click="showPrice">查看</el-button>
      </el-form-item>

      <el-form-item v-if="userMixtureFlag" label="混合用水：">
        <el-button size="mini" type="text" @click="showUserMixture">查看</el-button>
      </el-form-item>

      <el-form-item label="费用折扣：" v-if="wayOpen!=='changeMangement'">
        <el-button size="mini" type="text" @click="showDiscount">查看</el-button>
      </el-form-item>

      <!-- <el-form-item label="用水人口：" v-if="wayOpen!=='changeMangement'">
      <span v-if="editType==0">{{formData.ladderPersonNum}}</span>
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.ladderPersonNum" placeholder=""></el-input>
    </el-form-item> -->
      <el-form-item label="用水人口：" v-if="wayOpen!=='changeMangement'" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.ladderPersonNum}}</span>
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.ladderPersonNum" placeholder="">
          <el-button slot="append" type="primary" size='mini' @click="openPersonNumDialog">添加</el-button>
        </el-input>
         <el-button v-if="editType==0" size="mini" type="text" @click="showladderPerson">查看</el-button>
      </el-form-item>
      <el-form-item label="优惠策略：" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefStrategyName}}</span>
        <el-select :disabled="permission!=1" v-else v-model="formData.prefStrategyId" placeholder="" clearable @change="changePrefStrategyId">
          <el-option v-for="(item,index) in prefStrategyData" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠证件号码：" prop="prefCertNo" style="width: calc(46% + 10px)" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefCertNo}}</span>
        <el-input :disabled="permission!=1" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else v-model="formData.prefCertNo" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="优惠策略开始日期：" prop="prefBeginDate" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefBeginDate}}</span>
        <el-date-picker :disabled="permission!=1" v-else :picker-options="pickerOptions" v-model="formData.prefBeginDate" value-format='yyyy-MM-dd' type="date" placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠策略结束日期：" prop="prefEndDate" :class="{'disable-item':editType==0}">
        <span v-if="editType==0">{{formData.prefEndDate}}</span>
        <el-date-picker :disabled="permission!=1" v-else :picker-options="pickerOptions1" v-model="formData.prefEndDate" value-format='yyyy-MM-dd' type="date" placeholder="">
        </el-date-picker>
      </el-form-item>

      <el-dialog title="用水人口列表" v-if="personNumDialogShow" :visible.sync="personNumDialogShow" :close-on-click-modal="false" append-to-body class="button-dialog" :before-close="closeDialog">
        <wPopulation v-bind="$attrs" v-if="personNumDialogShow" :needData='personNumNeedData' :editType="wPopulationType" :wayOpen="wayOpen" ref="wPopulation"></wPopulation>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" size="mini" plain @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="详细价格" v-if="EditVisible" :visible.sync="EditVisible" :close-on-click-modal="false" append-to-body class="button-dialog" @close="closeDialog">
        <WaterPriceEdit ref="WaterPriceEdit"></WaterPriceEdit>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" size="mini" plain @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog title="用户混合用水" :visible.sync="userMixtureVisible" append-to-body :close-on-click-modal="false" class="button-dialog" :before-close="handleDialogClose1">
        <userMixtureEdit v-bind="$attrs" ref="userMixtureEdit" :mixtureData="mixtureData" :isEdit="mixtureEdit" :userNo="userNo"></userMixtureEdit>
        <div slot="footer" class="dialog-footer" v-if="wayOpen=='OpenAccount'">
          <!--<el-button type="primary" size="mini" plain @click="userMixtureSave">保存</el-button>-->
          <el-button type="info" size="mini" plain @click="closeDialog1()">确定</el-button>
        </div>
      </el-dialog> 
      <el-dialog title="用户费用折扣" :visible.sync="userDiscountVisible" :close-on-click-modal="false" append-to-body class="button-dialog" :before-close="handleDialogClose2">
        <userDiscountEdit  v-bind="$attrs" ref="userDiscountEdit" :discountData="discountData" :isEdit="discountEdit" :userNo="userNo"></userDiscountEdit>
        <div slot="footer" class="dialog-footer">
          <!--<el-button type="primary" size="mini" plain @click="userMixtureSave">保存</el-button>-->
          <el-button type="info" size="mini" plain @click="closeDialog2()">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="用水人口" v-if="ladderPersonVisible" :visible.sync="ladderPersonVisible" :close-on-click-modal="false" append-to-body class="button-dialog">
        <userLadderNum v-bind="$attrs" v-if="ladderPersonVisible" ref="ladderPerson" :userNo="wayOpen!='userInfo'?idCuster:userNo" :wayOpen="wayOpen"></userLadderNum>
        <div slot="footer" class="dialog-footer">
          <!--<el-button type="primary" size="mini" plain @click="userMixtureSave">保存</el-button>-->
          <el-button type="info" size="mini" plain @click="closeDialog3()">关闭</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import WaterPriceEdit from "@/views/FinancialCenter/PriceContrl/WaterPrice/WaterPriceEdit"; //
import userMixtureEdit from "@/views/publicModule/infmtnManagement/userMixtureEdit"; //
import userDiscountEdit from "@/views/publicModule/infmtnManagement/userDiscountEdit"; //
import userLadderNum from "@/views/publicModule/infmtnManagement/userLadderNum"; //
import wPopulation from "./wPopulation"; //
export default {
  name: "priceInfo",
  components: {
    WaterPriceEdit,
    userMixtureEdit,
    userDiscountEdit,
    wPopulation,
    userLadderNum,
  },
  props: ['editType', 'wayOpen', 'idCuster','sonPermissions'],
  data() {
    var _this = this
    return {
      permission:1,
      rules: {
        useWaterType: [{ required: true, message: "用水类型不能为空", trigger: 'change' }],
        prefBeginDate: [{ required: false, message: "优惠策略开始日期不能为空", trigger: 'change' }],
        prefEndDate: [{ required: false, message: "优惠策略结束日期不能为空", trigger: 'change' }],
      },
      userNo: "",
      mixtureData: {},
      mixtureEdit: true,
      EditVisible: false,
      userMixtureVisible: false,    //混合用水
      userMixtureFlag: false,
      discountData: {},
      discountEdit: true,
      userDiscountVisible: false,   //费用折扣
      ladderPersonVisible: false,  //用水人口
      dictionaryData: [],
      prefStrategyData: [],
      waterTypeData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      formData: {
        // 用户-价格信息
        useWaterTypeName: '',//用水类型： 
        useWaterType: '',
        prefStrategyName: '',//优惠策略： 
        prefStrategyId: '',
        prefCertNo: '',//优惠证件号码： 
        prefBeginDate: '',//优惠策略开始日期：
        prefEndDate: '',//优惠策略结束日期： 
        // ladderPersonNum: '4',//用水人口： 
        ladderPersonNum: '4',//用水人口： 
      },
      // 用水人口表格的显示与隐藏
      personNumDialogShow: false,
      // 用水人口表格所需数据
      personNumNeedData: {},
      canSave:false,
      //
      wPopulationType: 1,
      // 存储用水人口列表数据（添加时默认四条空数据）
      wPopulationTableData: [{name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
        {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
        {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
        {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}],


      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          if (_this.formData.prefEndDate) {// 策略开始日期小于策略结束日期
            let d = new Date(_this.formData.prefEndDate)
            return time.getTime() > d.getTime()
          }
        }
      },
      // 日期选择器
      pickerOptions1: {
        disabledDate(time) {
          if (_this.formData.prefBeginDate) {// 策略结束日期大于策略开始日期
            let d = new Date(_this.formData.prefBeginDate)
            return time.getTime() < d.getTime()
          }
        }
      },
    }
  },
  mounted() {
    if(this.sonPermissions!=undefined&&this.sonPermissions==0){
      this.permission=this.sonPermissions
      
    }
    //console.log(this.idCuster)
    if (this.idCuster) {
      // 详情时主动获取用水人口列表数据
      this.wPopulationInit()
    }
    if (this.editType != 0) {
      this.dictionaryOptions()
      this.prefStrategyDataOptions()
      this.waterTypeDataOption()
    }
    eventBus.$on('userNo', (userNo) => {
      this.userNo = userNo
    })
  },
  beforeDestroy() {
    eventBus.$off('userNo')
  },
  watch: {
  },
  methods: {
    // 数据初始化
    init(val) {
      if (val) {
        console.log(val) 
        this.formData = val
        if (this.formData.useWaterTypeName == '混合用水' || this.formData.useWaterType == '6') {
          this.userMixtureFlag = true
        }else
          this.userMixtureFlag = false
        if (val.prefStrategyId.length > 0) {
          this.changePrefStrategyId(val.prefStrategyId);
        }
        eventBus.$emit('getCapaMoney')
      }
    },
    changePrefStrategyId(val) {
      if (val.length > 0) {
        this.rules.prefBeginDate[0].required = true;
        this.rules.prefEndDate[0].required = true;
      } else {
        this.rules.prefBeginDate[0].required = false;
        this.rules.prefEndDate[0].required = false;
        this.$refs['ruleForm'].clearValidate();
      }

    },
    // 数据字典
    dictionaryOptions() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "BWT"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    //优惠策略
    prefStrategyDataOptions() {
      let params = { busicode: "PrefStrategySelect", data: "" };
      this.$api.fetch({ params }).then(res => {
        this.prefStrategyData = res;
      }).catch(res => {
        this.prefStrategyData = [];
      });
    },
    waterTypeChange(val) {
      eventBus.$emit('getCapaMoney')
      //console.log(val)
      let value = this.common.handleTreeData(val)
      if (value == '6')
        this.userMixtureFlag = true
      else
        this.userMixtureFlag = false
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
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
    //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree",
      };
      this.$api.fetch({ params })
        .then(res => {
          let data = this.getArr(res)
          this.$set(this, "waterTypeData", data.children);
        }).catch(res => {
          this.$set(this, "waterTypeData", []);
        });
    },
    // 用水人口-点击按钮展开表格
    openPersonNumDialog() {
      this.personNumNeedData.ladderPersonNum = this.formData.ladderPersonNum
      this.personNumNeedData.saveType = 'add'
      this.personNumNeedData.idCuster = this.idCuster ? this.idCuster : ''
      
      let tableData = JSON.parse(JSON.stringify(this.wPopulationTableData)); 

      if(this.formData.ladderPersonNum>this.wPopulationTableData.length){
        for(let i=1;i<=this.formData.ladderPersonNum-this.wPopulationTableData.length;i++){
          tableData.push({name: "",certType: "1",certNo: "",linkTel: "",comments: "",})
        }
      }
      this.personNumNeedData.tableData = tableData
      this.personNumDialogShow = true
    },
    // 用水人口列表详情数据
    wPopulationInit() {
      let _this = this
      let params = {
        "busicode": "UserPersonQuery",
        "data": {
          changeId: this.idCuster
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.wPopulationTableData = res
      })
    },
    showUserMixture() {
      if(this.editType == 0) {
        this.mixtureEdit = true
      } else {
        this.mixtureEdit = false
      }
      let _this = this
      // if (window.location.href.indexOf('HallBusiness') > 0) {
      //   setTimeout(() => {
      //     $('.v-modal').css('z-index', '0')
      //   }, 1000);
      // }
      this.userMixtureVisible = true
    },
    showladderPerson(){
      this.ladderPersonVisible=true
    },
    showDiscount() {
      let _this = this
      // if (window.location.href.indexOf('HallBusiness') > 0) {
      //   setTimeout(() => {
      //     $('.v-modal').css('z-index', '0')
      //   }, 1000);
      // }
      this.userDiscountVisible = true
    },
    async showPrice() {
      let _this = this
      try {
        if (window.location.href.indexOf('HallBusiness') > 0) {
          setTimeout(() => {
            // $('.v-modal').css('z-index', '0')
          }, 1000);
        }
      console.log()
        let val = this.common.handleTreeData(this.formData.useWaterType)
        let getId = await this.$api.fetch({ params: { busicode: 'GetWaterPriceId', data: { id: val } } });
        if (getId.id) {
          let valForm = await this.$api.fetch({ params: { busicode: 'WaterPriceQuery', data: { id: getId.id } } });
          let handleData = valForm.WaterPricebean;
          _this.EditVisible = true
          setTimeout(() => {
            _this.$refs.WaterPriceEdit.costNameOptions = valForm.costlist;
            _this.$refs.WaterPriceEdit.editData(handleData);
            _this.$refs.WaterPriceEdit.EditRight = false;
            _this.$refs.WaterPriceEdit.EditShow = false
          }, 1000);

        } else {
          _this.$message({
            message: "此用水类型暂无价格信息",
            type: "warning"
          });
        }

      } catch (e) {
        console.log(e);
        return
      }
    },
    async closeDialog() {
      //console.log(this.personNumDialogShow)
      // 用水人口表格弹出框关闭前获取用水人口列表数据个数显示在输入框中
      if(this.$refs.wPopulation) {
        let flag = await this.$refs.wPopulation.validateSame()
        if(flag) {
          this.$message({
            type: 'error',
            message: '用水人口存在重复数据，请检查'
          })
          return
        }
      }
      
      if (this.personNumDialogShow) {
        this.formData.ladderPersonNum = this.$refs.wPopulation.tableData.list.length
        this.wPopulationTableData = this.$refs.wPopulation.getTableData()
        this.canSave = this.$refs.wPopulation.currentIndex.length>0?true:false
      }
      this.EditVisible = false
      this.personNumDialogShow = false

    },
    handleDialogClose1() {
      var result = this.$refs.userMixtureEdit.check("checkValue");
      if(result == "")
        this.userMixtureVisible = false
    },
    handleDialogClose2() {
      this.userDiscountVisible = false
    },
    closeDialog1() {    //关闭混合用水
      var result = this.$refs.userMixtureEdit.check();
      if(result == "")
        this.userMixtureVisible = false
    },
    closeDialog2() {    //关闭费用折扣
      this.userDiscountVisible = false
    },
    closeDialog3() {    //关闭用水人口
      this.ladderPersonVisible = false
    },
    userMixtureSave(id) {
      this.$refs.userMixtureEdit && this.$refs.userMixtureEdit.submitForm(id)
    },
    userDiscountSave(id) {
      this.$refs.userDiscountEdit && this.$refs.userDiscountEdit.submitForm(id)
    },
    // 保存用水人口列表数据接口
    wPopulationSubmit(id) {
      if(this.canSave){
        this.$notify({
          title: '警告',
          message: '列表存在相同的证件号码',
          type: 'error'
        });
        return
      }else{
        let _this = this
        let params = {
          "busicode": "UserPersonAdd",
          "data": {
            changeId: id,
            list: this.wPopulationTableData
          },
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          
        })
      }
    },
    editData(mixtureData, mixtureEdit, userNo) {
      this.mixtureData = mixtureData
      this.mixtureEdit = mixtureEdit
      this.userNo = userNo
    },
    editDiscountData(discountData, discountEdit, userNo) {
      this.discountData = discountData
      this.discountEdit = discountEdit
      this.userNo = userNo
    }
  },
}
</script>
<style lang="scss">
.priceInfo {
  height: 100%;
  .formBill {
    .el-form-item__label {
      width: 130px;
      white-space: nowrap;
    }
  }
  .el-button--primary:focus,
  .el-button--primary {
    background-color: #409eff !important;
    color: #fff !important;
  }
  .clickable {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
