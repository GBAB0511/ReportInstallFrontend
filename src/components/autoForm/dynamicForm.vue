<template>
  <div>
    <span v-if="!checkForm">
      <el-dialog v-if="openConcentratorDialog" title="集中器" :close-on-click-modal="false" append-to-body :visible.sync="openConcentratorDialog" class="button-dialog" @close="closeDialog">
        <concentratorInfo :concentratorQuery="concentratorQuery" ref="concentratorInfoList"></concentratorInfo>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="submit">确 定</el-button>
          <el-button type="info" size="mini" plain @click="closeDialog">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 弹出修改通知人手机号码 -->
      <el-dialog width="40%" :title="'修改通知人号码'" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="mobileInfoVisible" @close="closeUpdateMobileDialog">
        <el-form :inline="true" size="mini" @submit.native.prevent>
          <el-form-item label="通知人手机号码：" style="width: calc(80% + 15px)">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="stopWaterLinkMobile" clearable @keyup.enter.native="search" placeholder="请输入手机号码" @input="e => input = inputMe(e)"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain @click="updateMobile()">保 存</el-button>
          <el-button type="info" size="mini" plain @click="closeUpdateMobileDialog()">取 消</el-button>
        </div>
      </el-dialog>
      <el-form class="formBill" :model="editFormData" :rules="editFormConfig.rules" ref="dynamicForm" size="mini" :disabled='permission!=1'>
        <el-form-item :class="{
          'disable-item': item.editable == 1 ? false : true,
          w100: item.length == 1 ? true : false,
          w200: item.length == 2 ? true : false,
          w300: item.length == 3 ? true : false,
          w400: item.length == 4 ? true : false,
        }" v-for="(item, index) in editFormConfig.itemArr" :key="index" :label="item.fieldName + '：'" :prop="item.fieldType !=6 ? item.fieldCode : item.fieldCode.split(',')[0]" :title="item.fieldName + '：'">
          <slot :name="item.fieldName" :item="item" :editFormInfo="editFormData" :value="item.value">
            <el-select v-model="editFormData[item.fieldCode]" v-if="
              item.fieldType == 4 &&
              item.editable == 1 &&
              item.fieldCode !== 'businessArea' && item.fieldCode != 'meterNo' && item.fieldCode != 'userGroupNo' && item.fieldCode !== 'concentratorNo'
            " :disabled="item.disabled" :readonly="item.readonly" :filterable="item.filterable" :clearable="!item.required || item.clearable" size="mini" :multiple="item.multiple" :placeholder="item.placeholder || '请选择'">
              <template v-for="item_s in item.seleteOption">
                <el-option :key="item_s.id" :label="item_s.name" :value="item_s.id"></el-option>
              </template>
            </el-select>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="two-input" v-else-if="item.fieldCode == 'concentratorNo' && item.editable == 1" size="mini" :rows="item.length" v-model="editFormData[item.fieldCode]" :title="item.fieldName + '：'" :disabled="item.disabled" :readonly="item.readonly" :value="item.value" @change="(val) => getConcentratorNo(val, item)">
              <span v-if="item.value">{{ item.value }}</span>
              <el-button slot="append" type="primary" size='mini' @click="openConcentratorOption(item.value)">添加</el-button>
            </el-input>
            <!-- <el-select
            v-model="editFormData[item.fieldCode]"
            v-else-if="item.fieldCode == 'concentratorNo' && item.editable == 1"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :filterable="item.filterable"
            :clearable="!item.required || item.clearable"
            size="mini"
            :multiple="item.multiple"
            :placeholder="item.placeholder || '请选择'"
          >
            <template v-for="item_s in concentratorList">
              <el-option
                :key="item_s"
                :label="item_s"
                :value="item_s"
              ></el-option>
            </template>
          </el-select> -->
            <el-cascader v-model="editFormData[item.fieldCode]" v-else-if="item.fieldCode == 'businessArea' && item.editable == 1" :disabled="item.disabled" :readonly="item.readonly" :filterable="item.filterable" :clearable="item.clearable" :title="item.fieldName + '：'" size="mini" :key="cascaderKey" :props="props" ref="cascader" :options="item.treeOption" @change="(val) => getBusinessAreaOptions(val, item)" :placeholder="item.placeholder || '请选择'"></el-cascader>
             <el-cascader v-model="editFormData[item.fieldCode]" v-else-if="item.fieldCode == 'area' && item.editable == 1" :disabled="item.disabled" :readonly="item.readonly" :filterable="item.filterable" :clearable="item.clearable" :title="item.fieldName + '：'" size="mini" :append-to-body='false' :key="cascaderKey" :props="oprops" ref="cascader" :options="item.treeOption" @change="(val) => handleCascaderChange(val, item)" :placeholder="item.placeholder || '请选择'"></el-cascader>
            <el-cascader v-model="editFormData[item.fieldCode]" v-else-if="item.fieldCode == 'clientContractAddr' && item.editable == 1" :disabled="item.disabled" :readonly="item.readonly" :filterable="item.filterable" :clearable="item.clearable" :title="item.fieldName + '：'" size="mini" :key="cascaderKey" :props="props" ref="cascader" :options="item.treeOption" @change="(val) => getConcentartorOptions(val, item)" :placeholder="item.placeholder || '请选择'">
            </el-cascader>
            <!-- <el-select
            v-else-if="item.fieldCode == 'businessArea' && item.editable == 1"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :filterable="item.filterable"
            :clearable="!item.required || item.clearable"
            size="mini"

            :multiple="item.multiple"
            :placeholder="item.placeholder || '请选择'"
            v-model="editFormData[item.fieldCode]"
            :value="item.value"
            @change="(val) => getBusinessAreaOptions(val, item)"
          >
            <template v-for="item_s in item.seleteOption">
              <el-option
                :key="item_s.id"
                :label="item_s.name"
                :value="item_s.id"
              ></el-option>
            </template>
          </el-select> -->
            <el-select v-model="editFormData[item.fieldCode]" v-else-if="item.fieldType == 3 && item.editable == 1" :disabled="item.disabled" :readonly="item.readonly" :filterable="item.filterable" :clearable="!item.required || item.clearable" size="mini" :multiple="item.multiple" :placeholder="item.placeholder || '请选择'">
              <template v-for="item_s in item.dictionaryData">
                <el-option :key="item_s.id" :label="item_s.name" :value="item_s.value"></el-option>
              </template>
            </el-select>

            <el-date-picker v-else-if="item.fieldType == 1 && item.editable == 1" v-model="editFormData[item.fieldCode]" :title="item.fieldName + '：'" type="date" size="mini" @change="(val) => inputChange(val, item)" :disabled="item.disabled" :picker-options="item.pickerOptions" :readonly="item.readonly" :clearable="item.clearable" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>

            <el-cascader v-model="editFormData[item.fieldCode]" v-else-if="item.fieldType == 5 && item.editable == 1" :disabled="item.disabled" :readonly="item.readonly" :filterable="item.filterable" :clearable="item.clearable" :title="item.fieldName + '：'" size="mini" :append-to-body='false' :key="cascaderKey" :props="props" ref="cascader" :options="item.treeOption" @change="(val) => handleCascaderChange(val, item)" :placeholder="item.placeholder || '请选择'"></el-cascader>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-else-if="
              item.fieldType == 2 &&
              item.editable == 1 && item.fieldCode != 'userGroupNo' && item.fieldCode != 'meterNo'
            " size="mini" :rows="item.length" @input="e => input = inputMe(e, item.fieldCode)" v-model="editFormData[item.fieldCode]" :title="item.fieldName + '：'" :disabled="item.disabled" :readonly="item.readonly" :value="item.value">
              <span v-if="item.value">{{ item.value }}</span>
            </el-input>
            <el-select v-model="editFormData[item.fieldCode]" v-else-if="item.fieldCode == 'userGroupNo' && item.editable == 1" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getUserGroup" :loading="false">
              <template v-for="item_s in userGroupNos">
                <el-option :key="item_s.userGroupNo" :label="item_s.userGroupNo+'：'+item_s.userGroupName" :value="item_s.userGroupNo">
                </el-option>
              </template>
            </el-select>
            <el-select v-model="editFormData[item.fieldCode]" v-else-if="item.fieldCode == 'meterNo' && item.editable == 1" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="mTypeChange" @change="setMeterNo" :loading="false">
              <template v-for="item_s in meterNos">
                <el-option :key="item_s.meterNo" :label="item_s.meterNo+'：'+item_s.factoryNo" :value="item_s.meterNo">
                </el-option>
              </template>
            </el-select>
            <template v-else-if="item.editable == 1 && item.fieldType == 6">

              <!-- 装表地址显示 -->
              <!-- <span v-if=""></span> -->


              <el-select size="mini" ref="addrselect" @change="addrSelectChange" v-show="isShowClientContractAddr" v-model="editFormData[item.fieldCode.split(',')[0]]" :title="item.fieldName + '：'" :disabled="item.disabled" :readonly="item.readonly" :clearable="true" class="two-input" filterable remote reserve-keyword :remote-method="adminAreaDataOptions" :loading="false">
                <template v-for="element in adminAreaData">
                  <el-option :key="element.id" :label="element.fullName" :value="element.id" @click.native="getConcentartorOptions(element.id, element)">
                  </el-option>
                </template>
                <template slot="empty">
                  <p class="el-select-dropdown__empty">
                    无数据
                  </p>
                  <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
                    <div style="height:30px;line-height: 30px;text-align:right">
                      <span style="cursor: pointer;" @click="showAddrAddDialog">
                        <i class="el-icon-plus"></i>
                        <span>添加</span>
                      </span>
                    </div>
                  </div>

                </template>
                <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
                  <div style="height:30px;line-height: 30px;text-align:right">
                    <span style="cursor: pointer;" @click="showAddrAddDialog">
                      <i class="el-icon-plus"></i>
                      <span>添加</span>
                    </span>
                  </div>
                </div>
              </el-select>
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  size="mini" @input="e => input = inputMe(e)" v-model="editFormData[item.fieldCode.split(',')[1]]" :title="item.fieldName + '：'" :disabled="item.disabled" :readonly="item.readonly" :clearable="true" class="two-input">

                <el-button v-if="copyVisible" slot="append" type="primary" size="mini" @click="copyUserAddressMsg">粘贴</el-button>

              </el-input>
              <el-tooltip v-if="copyVisible" class="item" effect="dark" content="复制到客户地址" placement="top-start">
                <i class="el-icon-warning-outline" @click="copyUserAddressMsg"></i>
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" plain @click="copyUserAddressMsg">粘贴</el-button> -->

              <!-- <el-tooltip v-if="copyVisible" class="item" effect="dark" content="复制到客户地址" placement="top-start">
             <el-button type="primary" size="mini" plain @click="copyUserAddressMsg">粘贴</el-button>
           </el-tooltip> -->
            </template>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-else-if="item.editable == 1 && item.fieldCode != 'userGroupNo'" size="mini" :rows="item.length" v-model="editFormData[item.fieldCode]" :title="item.fieldName + '：'" :disabled="item.disabled" :readonly="item.readonly" :clearable="true" :value="item.value" @input="e => input = inputMe(e)">
            </el-input>
            <span v-else-if="item.fieldCode == 'stopWaterLinkMobile'">
              <span v-if="formData.userNo == ''"></span>
              <span v-else-if="parentVNodeName == 'userInfoSearchDetail'" style="color:#297acc;font-weight:600" @click="updateMobileDialog(item, index)">{{ item.value == '' || item.value == null ? '修改通知人手机号码' : item.value }}</span>
              <span v-else>{{  item.value }}</span>
            </span>
            <span v-else-if="item.editable == 0 && item.fieldType == 6">{{editFormData[item.fieldCode.split(',')[2]]}}</span>
            <span v-else>{{ item.value }}</span>
          </slot>
        </el-form-item>
      </el-form>
      <addrAdd :addrVisible="addrVisible" v-if="addrVisible" @closeAddrAddVisible="closeAddrAddVisible"></addrAdd>
    </span>
    <span v-else>
      <el-form class="formBill" :model="editFormData" :rules="editFormConfig.rules" ref="editFormData" size="mini">
        <el-form-item v-for="(item, index) in editFormConfig.itemArr" :key="index" :label="item.fieldName + '：'" :prop="item.fieldType !=6 ? item.fieldCode : item.fieldCode.split(',')[0]" :title="item.fieldName + '：'" :value="item.value" :class="{
          'disable-item': true,
          w100: item.length == 1 ? true : false,
          w200: item.length == 2 ? true : false,
          w300: item.length == 3 ? true : false,
          w400: item.length == 4 ? true : false,
        }">
          <slot :name="item.fieldName" :item="item" :editFormInfo="editFormData" :value="item.value">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="false" @input="e => input = inputMe(e)" size="mini" :rows="item.length" v-model="editFormData[item.fieldCode]" :title="editFormData[item.fieldName] + '：'" :disabled="item.disabled" :readonly="item.readonly" :clearable="item.clearable" :value="item.value">
            </el-input>
            <span v-else-if="item.fieldType == 6">{{editFormData[item.fieldCode.split(',')[2]]}}</span>
            <span v-else>{{ item.value }}</span>
          </slot>
        </el-form-item>
      </el-form>
    </span>
    <modifyNumber :diaVisible.sync="modifyNumberDia" :formData="updateNumber" refreshNode="userInfoSearchDetail"></modifyNumber>
  </div>
</template>

<script>
import concentratorInfo from '@/components/concentratorInfo'
import addrAdd from "@/components/addrAdd"
import modifyNumber from "@/components/modifyNumber"
export default {
  name: "dynamicForm",
  components: {
    concentratorInfo,
    addrAdd,
    modifyNumber
  },
  props: ["formData", "formConfig", "editType", "openWay", "checkForm",'permissions'],
  data () {
    return {
      permission:1,
      singleCustomerFlag:0,
      tableAddr:0,
      addrVisible: false,
      copyVisible: false,
      openConcentratorDialog: false,
      getContratorDetailData: false,
      concentratorListNo: '',
      concentratorQuery: {},
      cascaderKey: 0,
      activeWidth: 0,
      handleDetail: false,
      checkDetail: false,
      mTypeChangeName: "",
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      oprops:{
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      adminArea: '',
      concentratorList: [],
      concentratorOptions: [],
      dictionaryData: [],
      meterNos: [],
      userGroupNos: [],
      treeOption: [],
      seleteOption: [],
      editFormData: {},
      editFormConfig: {
        labelWidth: "0",
        rules: {},
        itemArr: [],
      },
      NotDisabled: false,
      showMember: false,
      currentItem: {},
      orgMemberSelect: {},
      adminAreaData: [],
      mobileInfoVisible: false, //修改手机弹窗
      stopWaterLinkMobile: '', // 通知人手机号码
      userNo: '', // 用户编号
      mobileIndex: '',
      // 修改号码弹窗
      modifyNumberDia: false,
      updateNumber: {
        ctmNo: "",
        mobile: "",
        userNo: "",
        stopWaterLinkMobile: "",
      },
      parentVNodeName: "",
      isShowClientContractAddr: true,//是否显示结构化地址
      getUserNoStr: "",
      receiptId: "",//获得是否是添加的还是编辑的情况
    };
  },
  created () {
    // this.init();
    eventBus.$on('sendClientAddr',item=>{
      //  console.log(JSON.stringify(item));
      // console.log(JSON.stringify(this.editFormData));
      // if(item!=''){
      //   this.editFormData.clientContractAddr=item
      // }
      if(item.no==1){
        let data=item.data
        this.singleCustomerFlag=item.singleCustomerFlag
        if(data[0].userInfo!=undefined){
          this.editFormData.clientContractAddr=data[0].userInfo.clientContractAddr
          this.editFormData.clientContractAddrDetail=data[0].userInfo.clientContractAddrDetail
          this.editFormData.clientContractAddrId=data[0].userInfo.clientContractAddrId
          this.editFormData.businessArea=data[0].userInfo.businessArea
        }

      }else if(item.no==2){
        this.singleCustomerFlag=item.singleCustomerFlag
        let data=item.data
        if(data.ctmInfo!=undefined){
          this.editFormData.clientContractAddr=data.ctmInfo.clientAddr
          this.editFormData.clientContractAddrDetail=data.ctmInfo.clientAddrDetail
          this.editFormData.clientContractAddrId=data.ctmInfo.clientAddrId
          this.editFormData.businessArea=data.consult.businessArea
          this.editFormData.businessAreaName=data.consult.businessAreaName
          // console.log(data.consult.businessAreaName);
        }

        // this.editFormData.businessArea=data.ctmInfo.businessArea
      }
      else{
        //单客户标志为0时
          this.singleCustomerFlag=item.singleCustomerFlag
          // this.editFormData.clientContractAddr=''
          // this.editFormData.clientContractAddrDetail=''
          // this.editFormData.clientContractAddrId=''
          // this.editFormData.businessArea=''
          // this.editFormData.businessAreaName=''
      }
    })
  },
  beforeDestroy(){
    eventBus.$off('sendClientAddr')
  },
  //   computed: {
  //   autoClass: function () {
  //     return {
  //       width: this.activeWidth
  //     }
  //   }
  // },
  watch: {
    formData (val) {
      this.editFormData = Object.assign({}, val);
      //console.log('editFormData',JSON.parse(JSON.stringify(this.editFormData)));
      if (val.clientContractAddrId) {
          this.adminAreaDataByFullName(this.editFormData.clientContractAddr)
          this.$nextTick(() => {
          this.editFormData.clientContractAddr = this.editFormData.clientContractAddrId;
          })
        // this.concentratorListNo = val.concentratorNo
        // this.concentratorQuery.adminArea = val.clientContractAddrId
        //  this.concentratorListNo = val.concentratorNo
        // eventBus.$emit('concentratorOptions', this.concentratorQuery)
        this.getConcentartorOptions(val.clientContractAddrId)
      }
      eventBus.$on('adminArea', (adminArea) => {
        this.adminArea = adminArea
        this.getConcentartorOptions(this.adminArea)
      })
      this.setPhoneData();
      setTimeout(()=>{
      if(localStorage.getItem('setRegisterAddr')!=undefined){
        if(this.editFormData.clientContractAddr==''&&this.editFormData.clientContractAddrDetail==''){
          // this.editFormData.clientContractAddr=localStorage.getItem('setRegisterAddr')
          this.editFormData.clientContractAddrDetail=localStorage.getItem('setRegisterAddr')
        }
      }

    },4000)
    },
    isShowClientContractAddr(val){
     // if(!val && this.editFormConfig.rules.clientContractAddr.length == 2){
      //  this.editFormConfig.rules.clientContractAddr.shift();
     // }
    },

  },
  beforeDestroy () {
    eventBus.$off('concentratorOptions')
    eventBus.$off('adminArea')
    eventBus.$off('setRegisterAddr')
    // eventBus.$off('copyClientAddr')
  },
  mounted () {
    if(this.permissions!=undefined&&this.permissions==0){
      this.permission=this.permissions
    }
    this.init();
    if (this.openWay == 'changeMangement') {
      this.copyVisible = true
    } else {
      this.copyVisible = false
    }
    // 获取当前数据的单据id
    // eventBus.$on('concentratorOptions', (concentratorOptions) => {
    //   this.concentratorList = concentratorOptions
    // })
    eventBus.$on('concentratorOptions', (concentratorOptions) => {
      this.concentratorList = concentratorOptions
    });
    // 获取当前用户编号
    eventBus.$on('userNo', (userNo) => {
      this.userNo = userNo;
    })
    eventBus.$on("receiptId", (receiptId) => {
      this.receiptId = receiptId;
    })
    this.setPhoneData()
    let pnode = this.getParentVNode(this, 'userInfoSearchDetail');
    this.parentVNodeName = pnode == undefined || pnode == null ? '' : pnode.$options.name // 快捷查询时可修改通知人手机号
  },
  methods: {
    inputMe(e, val){
      if(val == 'userNo' && this.getUserNoStr.length >= 4){
        const prefixName = this.getUserNoStr; //要显示的前缀
        const inputContent = this.editFormData[val].substring(4); // 获取除前缀之外的内容
        this.editFormData[val] = prefixName + inputContent; //监听内容变化时，拼接前缀和内容
      }else{
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        return str;
      }
    },
    addrSelectChange (id) {
        this.editFormData.clientContractAddrId = id;
      if (this.openWay === "PjMeterDetail") { //当为工程立户向上发布事件
        eventBus.$emit('addrSelectChange', id)
      }
    },
    addrDeatilChange(val){
    },
    showAddrAddDialog () {
      this.$refs.addrselect[0].visible = false
      this.addrVisible = true;
    },
    closeAddrAddVisible () {
      this.addrVisible = false;
    },
    init () {
      if (this.editType !== 0 && this.checkForm == false) {
        this.$nextTick(() => {
          this.$refs.dynamicForm.clearValidate(); //可输入进行校验，先清空验证  // this.$refs.adduserform.resetFields();
        });
      }
      if (
        this.editFormData.meterNo !== "" ||
        this.editFormData.meterNo !== undefined
      ) {
        this.handleDetail == true;
      }
      this.editFormData = Object.assign({}, this.formData);
      if(this.editFormData.userNo != undefined){
        this.getUserNoStr = this.editFormData.userNo.substring(0,4);
      }
      //  this.NotDisabled = true
      let rules = {};

      this.formConfig.itemArr.map((i) => {
        // let value = null
        for (var a in this.editFormData) {
          if (i.editable == 0 || this.checkForm == true) {
            //不可编辑-查看详情
            if (i.fieldType == 3 || i.fieldType == 4 || i.fieldType == 5) {
              if (i.fieldCode == a) {
                if (i.fieldCode !== 'concentratorNo') {     //特殊：为级联菜单且字段则是他本身（集中器）
                  i.value = this.editFormData[a + "Name"];
                } else {
                  i.value = this.editFormData[a]
                }
              } else if (i.fieldCode + "Name" == a) {
                i.value = this.editFormData[a];
              }
            } else {
              if (i.fieldCode == a) {
                if (i.fieldCode == "lockFlag" || i.fieldCode == "reformFlag" || i.fieldCode == "valveControl") {
                  //锁定状态与户表标记判断转换（是/否）
                  if (this.editFormData[a] == "0") {
                    this.editFormData[a] = "否";
                  } else if (this.editFormData[a] == "1") {
                    this.editFormData[a] = "是";
                  }
                }
                i.value = this.editFormData[a];
              }
            }
          } else {
            //
            if (i.fieldCode == a) {
              if (i.fieldType == 4 && this.handleDetail !== true) {
                //调取接口的下拉菜单
                let params = {};

                if (i.fieldCode !== "meterFactory" && i.editable !== 0 && i.fieldCode !== "concentratorNo") {
                  params = { busicode: i.interfaceName, data: "" };
                  this.$api
                    .fetch({ params })
                    .then((res) => {
                      // i.seleteOption = res;
                      this.$set(i, "seleteOption", res);
                    })
                    .catch((res) => {
                      i.seleteOption = [];
                    });
                }
              } else if (
                i.fieldType == 3 &&
                this.handleDetail !== true &&
                i.editable !== 0
              ) {
                //调取数据字典的下拉菜单
                var dictionaryDataParams = {
                  busicode: "DictionarySelect",
                  data: i.interfaceName,
                };
                this.$api
                  .fetch({ params: dictionaryDataParams })
                  .then((res) => {
                    var dicIndex = i.interfaceName;
                    // i.dictionaryData = res[dicIndex]
                    this.$set(i, "dictionaryData", res[dicIndex]);
                  })
                  .catch((res) => {
                    this.$set(i, "dictionaryData", []);
                  });
              } else if (i.fieldType == 5) {
                //级联菜单渲染
                let params = { busicode: i.interfaceName, data: {} };
                this.$api
                  .fetch({ params })
                  .then((res) => {
                    let data = this.getArr(res);
                    this.$nextTick(() => {
                      if (!data.children || data.children.length == 0) {
                        delete data.children;
                        this.$set(i, "treeOption", [
                          JSON.parse(JSON.stringify(data)),
                        ]);
                      } else {
                        this.$set(
                          i,
                          "treeOption",
                          JSON.parse(JSON.stringify(data.children))
                        );
                      }
                    });
                  })
                  .catch((res) => {
                    i.treeOption = [];
                  });
              }
            }
            if (i.fieldType == 6) {
              const fields = i.fieldCode.split(',')
              fields.forEach(item => {
                this.$set(this.editFormData, item, this.editFormData[item] || '')
              })
              if (this.editFormData[i.fieldCode]) {
                delete this.editFormData[i.fieldCode]
              }
            }
            i.fieldType != 6 ? rules[i.fieldCode] = [] : rules[i.fieldCode.split(',')[0]] = [];
            if (i.mandatory === 1) {
              i.fieldType != 6 ? rules[i.fieldCode] = [] : rules[i.fieldCode.split(',')[0]] = []; //若为1，则为必填；遍历校验rule
              let message = "";
              if (i.fieldType === 2) {
                message = `请输入`;
              } else {
                message = `请选择`;
              }
              if (i.fieldType != 6) {
                rules[i.fieldCode].push({
                  required: true,
                  message: message + i.fieldName,
                  trigger: i.trigger || "change",
                });
              } else {
                const filed1 = i.fieldCode.split(',')[0]
                const filed2 = i.fieldCode.split(',')[1]
                const check = (rule, value, callback) => {
                  if(this.isShowClientContractAddr){
                    if (!this.editFormData[filed1] || this.editFormData[filed1].trim().length == 0) {
                      callback(new Error('请输入' + i.fieldName))
                    }
                  }
                  if (!this.editFormData[filed2] || this.editFormData[filed2].trim().length == 0) {
                    callback(new Error('请输入' + i.fieldName))
                  }
                  callback()
                }
                if(this.isShowClientContractAddr){
                  rules[i.fieldCode.split(',')[0]].push({
                    required: true,
                    message: '请输入' + i.fieldName,
                    trigger: i.trigger || "change",
                    trigger: 'blur',
                  });
                }
                
                rules[i.fieldCode.split(',')[0]].push({
                  required: true,
                  validator: check,
                  trigger: 'blur',
                });


              }
            }
          }
          // 合同编号要是有值就不能编辑
          if(i.fieldCode == "contractNo"){
            if(this.$parent.remenberContractNo != ""){
              i.editable = 0;
            }
          }
          this.editFormConfig.rules = Object.assign({}, rules);
        }
        if(this.receiptId == "" && i.fieldCode == "userNo" && i.status == 1){
          // 如果是添加的情况,并且是用户编号启用了
          let params = {
            busicode: "CreateUserNo",
            data: {}
          };
          this.$api.fetch({ params }).then(res => {
            this.editFormData.userNo = res;
            this.getUserNoStr = this.editFormData.userNo.substring(0,4);
          });
        }
      });
      if (this.editType == 0 && this.handleDetail == false) {
        //判断只可进入详情界面，进行表单对应赋值
        this.editFormConfig = this.formConfig;
      } else {
        this.editFormConfig = this.formConfig;
      }
      this.$emit("autoForm", this.editFormData);
      if(this.editFormData.clientContractAddrId){
          this.editFormData.clientContractAddr = this.editFormData.clientContractAddrId;
      }
    },
    // getConcentartor(val){
    //   this.concentratorList = val
    // },
    //树结构数据处理
    getArr (data) {
      function abc (arr) {
        arr.map((i) => {
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
    getConcentratorNo (val) {
      this.concentratorListNo = val
      return val
    },
    //集中器选择弹窗
    openConcentratorOption () {
      this.openConcentratorDialog = true
      if (this.concentratorList) {
        this.concentratorQuery.adminArea = this.concentratorList.adminArea
        this.concentratorQuery.concentratorNo = this.editFormData.concentratorNo
      }

      //  this.$refs.concentratorInfoList.init(this.concentratorQuery)

      // if(this.getContratorDetailData == true){
      //     this.openConcentratorDialog = true
      // }
      // else {
      //     this.$notify({
      //     title: '提示',
      //     message: '请选择装表地址',
      //     type: 'warning'
      //   });
      // }
    },
    copyUserAddressMsg () {

      let copyData = JSON.parse(JSON.stringify(this.editFormData))
      copyData.copyCtmName = this.copyCtmName
      copyData.adminData = this.adminAreaData
      if (this.editFormData.clientContractAddr || this.editFormData.clientContractAddrDetail) {
        eventBus.$emit("copyUserAddr", copyData);
        this.$notify({
          title: '提示',
          message: '已成功复制到客户地址',
          type: 'success'
        });
      }
    },
    closeDialog () {
      this.openConcentratorDialog = false
    },
    submit () {
      var list = this.$refs.concentratorInfoList.radioSelect
      this.editFormData.concentratorNo = list.code
      this.getConcentratorNo(this.concentratorListId)
      this.openConcentratorDialog = false
    },
    handleCascaderChange () {
      ++this.cascaderKey
      // this.$refs.cascader
      //   ? (this.$refs.cascader.dropDownVisible = false)
      //   : null;
    },
    adminAreaDataOptions (query) {
      if (query == null || query.length == 0) {
        return
      }
      let params = { busicode: "AdminAreaQuery", data: { areaName: query, isLeaf: 1 } };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this, "adminAreaData", res.list)
        })
    },
    adminAreaDataByFullName (query) {
      if (query == null || query.length == 0) {
        return
      }
      let params = { busicode: "AdminAreaQuery", data: { fullName: query, isLeaf: 1 } };
      this.$api
        .fetch({ params })
        .then(res => {
          if (res.list.length > 0) {
            this.editFormData.clientContractAddr = res.list[0].id
          }
          this.$set(this, "adminAreaData", res.list)
        })
    },
    isString (str) {
      return (typeof str == 'string') && str.constructor == String;
    },
    getConcentartorOptions (val, item) {
      if (this.isString(val) == false) {         //行政区域字段判断-是否为字符串
        val = this.common.handleTreeData(val);
      }
      this.concentratorQuery.adminArea = val
      this.concentratorQuery.fuzzyQuery = this.concentratorListNo
      eventBus.$emit('concentratorOptions', this.concentratorQuery)
      // 由于添加时传行政区域val无法判空，采用字符串判断是否为真/假
      // item:添加初始化空白表单时不可触发此下拉菜单 true:添加初始化时行政区域不为空 false:行政区域发生改变后需处理数据传参
      //    let params = {
      //   busicode: 'ConcentratorSelect',
      //       data: {"adminArea":val}
      //   };
      //  this.$api.fetch({ params }).then((res) => {
      //       this.concentratorOptions = res
      //    eventBus.$emit('concentratorOptions', this.concentratorOptions)
      //    }).catch((res)=>{
      //      this.concentratorData = []
      //    })
    },
    getlabelwidth () { },
    getBusinessAreaOptions (val) {
      val = this.common.handleTreeData(val);
      this.$parent.changeArea(val);
      //获取营业区域下拉列表-营业区域带出相关册本号下拉菜单
    },
    setMeterNo (val) {
      let meterObject = {}
      this.meterNos.forEach(element => {
        if (element.meterNo == val) {
          meterObject = element
        }
      });
      //若水表号存在将相关字段值带入表单内
      for (var i in this.editFormData) {
        for (var j in meterObject) {
          if (i == j) {
            this.editFormData[i] = meterObject[j];
          }
        }
      }
      this.handleDetail = true;
      this.$parent.getFormDetail(this.editFormData); //将表单进行回显
    },
    async getUserGroup (query) {
      if (query !== '') {
        let _this = this
        let arr = {}
        let params = {
          "busicode": "UserGroupList",
          "data": { remote: 1, fuzzyQuery: query, page: 1, pageCount: 5 },
        }
        arr = await this.$api.fetch({
          params: params,//参数
        })
        this.userGroupNos = arr.list
      } else {
        this.userGroupNos = [];
      }
    },
    //水表编号调接口验证是否在库
    async mTypeChange (val) {
      let arr = [];
      // 水表信息
      let MsInfoListParams = {
        busicode: "MsInfoList",
        data: {
          page: 1,
          pageCount: 10,
          fuzzyQuery: val,
          // factoryNo:res.userInfo.fatherMeterNo,
          meterStatus: "1",
        },
      };
      arr = await this.$api.fetch({ params: MsInfoListParams });
      this.$set(this, 'meterNos', arr.list)
      localStorage.setItem('RegisterAccountMsInfoList',JSON.stringify(arr))
      this.$refs.dynamicForm.validateField("editFormData.meterNo");
    },
    //表单提交校验
    getFormData () {
      return new Promise((resolve, reject) => {
        this.$refs.dynamicForm.validate((valid) => {
          if (valid) {
            let data = Object.assign({}, this.editFormData);
            resolve(data);
          } else {
            reject("未填写完整");
          }
        });
      });
    },
    //点击输入框去选择人员
    handleClickSelect () { },

    //设置表单某栏位内容
    setFormItem (prop, data) {
      this.$set(this.editFormData, prop, data);
    },
    //获取表单某栏位内容
    getFormItem (prop) {
      return this.editFormData[prop];
    },
    //值改变事件（除下拉框）
    inputChange (val, item) {
      if (item.methods) {
        item.methods(val, this.editFormData);
      }
    },
    // 修改通知人号码
    updateMobileDialog (item, index) {
      this.modifyNumberDia = true
      //   this.mobileInfoVisible = true;
      //   this.stopWaterLinkMobile = item.value;
      //   this.mobileIndex = index;
    },
    setPhoneData () {
      this.updateNumber.userNo = this.formData.userNo;
      this.updateNumber.ctmNo = this.formData.ctmNo;
      this.updateNumber.mobile = this.formData.mobile;
      this.updateNumber.stopWaterLinkMobile = this.formData.stopWaterLinkMobile;
    },
    // 关闭修改通知人号码弹窗
    closeUpdateMobileDialog () {
      this.mobileInfoVisible = false;
      this.stopWaterLinkMobile = '';
    },
    // 执行修改通知人手机号
    updateMobile () {
      if (this.stopWaterLinkMobile == '') {
        this.$message({
          message: '请输入手机号码',
          type: 'warning'
        })
        return;
      }
      let params = {
        busicode: 'NotifierMobileUpdate',
        data: {
          userNo: this.userNo,
          stopWaterLinkMobile: this.stopWaterLinkMobile
        }
      }
      this.$api.fetch({
        params: params
      }).then(res => {
        // console.log(res)
        this.$message({
          message: '用户信息变更成功！',
          type: 'success'
        })
        this.editFormConfig.itemArr[this.mobileIndex].value = this.stopWaterLinkMobile
        this.closeUpdateMobileDialog();
      }).catch(err => {
        console.log(err)
      })
    },
    getParentVNode (obj, targetName) {
      if (obj.$vnode == undefined) return null
    //   console.log(obj.$vnode)
      if (obj.$vnode.tag.includes(targetName)) {
        return obj
      } else {
        return this.getParentVNode(obj.$parent, targetName)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.w100 {
  width: calc(23% + 10px);
}
.w200 {
  width: calc(46% + 30px);
}
.w300 {
  width: calc(69% + 10px);
}
.w400 {
  width: calc(96% + 10px);
}
.el-input.two-input {
  width: calc(42% + 10px) !important;
}
.el-select.two-input {
  width: calc(47% + 10px) !important;
}
.edit-form-box {
  .h36 {
    height: 36px;
  }
  .el-checkbox {
    width: 50%;
    float: left;
    margin-right: 0;
    text-align: left;
  }
}

.el-form-item__content {
  margin-left: 0px !important;
}

.edit-form-box .el-form-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
