<template>
  <div class="QuickChangeEdit">

    <div class="toolbar">
      <el-form :model="formData" ref="quickChangeForm" class="formBill" :rules="rules" :inline="true" size="mini" label-width="110px">
        <!-- 用户信息 -->
        <legend class="legendColumn">用户信息</legend>
        <el-form-item label="用户编号：" prop="userNo" :rules="editType == 1 || editType == 2?rules.userNo:[]" class="userNo">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="editType == 1 || editType == 2" v-model="formData.userNo" clearable size="mini" placeholder="请输入用户编号(回车查询)" @keydown.native.enter="search">
            <el-button slot="append" class="searchBtn"  @click="search" icon="el-icon-search" ></el-button>
          </el-input>
          <span v-else>{{formData.userNo}}</span>
        </el-form-item>
        <!-- <el-button class="searchBtn"  @click="search" icon="el-icon-search" ></el-button> -->
        <el-form-item label="用户名称：" prop="ctmName" class="ctmName">
          <span>{{formData.ctmName}}</span>
        </el-form-item>
        <el-form-item label="用户地址：" prop="ctmAddr" class="ctmAddr">
          <span>{{formData.ctmAddr}}</span>
        </el-form-item>

        <!-- 旧水表信息 -->
        <legend class="legendColumn">旧水表信息</legend>
        <el-form-item label="水表表身码：" prop="oldFactoryNo">
          <span>{{formData.oldFactoryNo}}</span>
        </el-form-item>
        <el-form-item label="口径：" prop="oldMeterBoreName">
          <span>{{formData.oldMeterBoreName}}</span>
        </el-form-item>
        <el-form-item label="水表编号：" prop="oldMeterNo">
          <span>{{formData.oldMeterNo}}</span>
        </el-form-item>
        <el-form-item label="水表型号：" prop="oldMeterModel">
          <span>{{formData.oldMeterModel}}</span>
        </el-form-item>

        <!-- 新水表信息 -->
        <legend class="legendColumn">新水表信息</legend>
        <!-- <el-form-item label="水表编号：" prop="newMeterNo" :rules="editType == 1?rules.newMeterNo:[]">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="editType == 1" v-model="formData.newMeterNo" size="mini" placeholder="请选择水表编号" @focus="chooseWaterMeter('chooseNewMater')"></el-input>
          <span v-else>{{formData.newMeterNo}}</span>
        </el-form-item> -->
         <el-form-item label="水表表身码：" prop="newFactoryNo" :rules="editType == 1 || editType == 2?rules.newFactoryNo:[]">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="editType == 1 || editType == 2" v-model="formData.newFactoryNo" size="mini" clearable placeholder="请输入水表表身码" @keydown.native.enter="queryWaterMeter" >
            <el-button slot="append" class="searchBtn"  @click="queryWaterMeter" icon="el-icon-search" ></el-button>
          </el-input>
          <span v-else>{{formData.newFactoryNo}}</span>
        </el-form-item>
         <el-form-item  label="水表型号：" prop="newMeterModelName" :rules="editType == 1 || editType == 2?rules.newMeterModelName:[]">
            <el-autocomplete v-if="newEdit == 1" :popper-append-to-body="false" v-model="formData.newMeterModelName" :trigger-on-focus="false" :fetch-suggestions="meterModelSearch" placeholder="请输入水表类型"
            @select="getMeterData" @blur="newMeterModelBlur"></el-autocomplete>
            <span v-else>{{formData.newMeterModelName}}</span>
        </el-form-item>
        <el-form-item label="口径：" prop="newMeterBore" :rules="editType == 1 || editType == 2?rules.newMeterBore:[]">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="newEdit == 1" v-model="formData.newMeterBoreName" disabled clearable size="mini" placeholder="请输入口径"></el-input> -->
          <el-select v-if="newEdit == 1" v-model="formData.newMeterBore" size="mini" placeholder="请选择水表口径">
            <el-option v-for="item in newMeterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
          </el-select>
          <span v-else>{{formData.newMeterBoreName}}</span>
        </el-form-item>
        <!-- <el-form-item label="水表表身码：" prop="newFactoryNo">
          <span>{{formData.newFactoryNo}}</span>
        </el-form-item> -->
        <el-form-item label="水表编号：" prop="newMeterNo">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="newEdit == 1" v-model="formData.newMeterNo" clearable size="mini" placeholder="请输入水表编号"></el-input>
            <span v-else>{{formData.newMeterNo}}</span>
        </el-form-item>

        <!--
        <el-form-item label="水表型号：" prop="newMeterModel">
          <el-select v-if="newEdit == 1"  v-model="formData.newMeterModel"  clearable size="mini" placeholder="请选择水表型号" @change="getMeterData">
            <el-option v-for="item in newMeterModelData" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <span v-else>{{formData.newMeterModelName}}</span>
        </el-form-item>
        -->
        <el-form-item label="水表厂家：" prop="newMeterFactory" :rules="editType == 1 || editType == 2?rules.newMeterFactory:[]">
          <el-select v-if="newEdit == 1 && newEdit2 == 1" v-model="formData.newMeterFactory"  clearable size="mini" placeholder="请选择水表厂家">
            <el-option v-for="item in newMeterFactoryData" :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
          </el-select>
          <span v-else>{{formData.newMeterFactoryName}}</span>
        </el-form-item>
        <el-form-item label="水表类型：" prop="newMeterType" :rules="editType == 1 || editType == 2?rules.newMeterType:[]">
          <el-select v-if="newEdit == 1 && newEdit2 == 1" v-model="formData.newMeterType"  clearable size="mini" placeholder="请选择水表类型">
            <el-option v-for="item in newMeterTypeData" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <span v-else>{{formData.newMeterTypeName}}</span>
        </el-form-item>
        <el-form-item label="IMEI：" prop="imei">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="newEdit == 1" v-model="formData.imei" clearable size="mini" placeholder="请输入IMEI号"></el-input>
          <span v-else>{{formData.imei}}</span>
        </el-form-item>
        <el-form-item label="IMSI：" prop="imsi">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="newEdit == 1" v-model="formData.imsi" clearable size="mini" placeholder="请输入IMSI号"></el-input>
          <span v-else>{{formData.imsi}}</span>
        </el-form-item>
         <el-form-item label="满码值：" prop="maxValue" :rules="editType == 1 || editType == 2?rules.maxValue:[]">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="newEdit == 1 && newEdit2 == 1" v-model.number="formData.maxValue" clearable size="mini" placeholder="请输入满码值" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
              <span v-else>{{formData.maxValue}}</span>
        </el-form-item>
        <!-- 换表信息 -->
        <legend class="legendColumn">换表信息</legend>
        <el-form-item label="旧表底码：" prop="oldMeterNum" :rules="editType == 1 || editType == 2?rules.oldMeterNum:[]">
          <el-input v-if="editType == 1 || editType == 2" v-model.number="formData.oldMeterNum" size="mini" placeholder="请输入旧表底码" @input="caculate" onkeyup="value=value.replace(/[^\d]/g,'')" ></el-input>
          <span v-else>{{formData.oldMeterNum}}</span>
        </el-form-item>
        <el-form-item label="余量：" prop="margin" :rules="editType == 1 || editType == 2? rules.margin:[]">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="editType == 1 || editType == 2" disabled v-model="formData.margin" size="mini"></el-input>
          <span v-else>{{formData.margin}}</span>
        </el-form-item>
        <el-form-item label="旧表上期抄码：" prop="upperNum">
          <el-input v-if="editType == 1 || editType == 2" disabled v-model.number="formData.upperNum" size="mini" placeholder="" @input="caculate" onkeyup="value=value.replace(/[^\d]/g,'')" ></el-input>
          <span v-else>{{formData.upperNum}}</span>
        </el-form-item>
        <el-form-item label="新表起码：" prop="newMeterNum" :rules="editType == 1 || editType == 2?rules.newMeterNum:[]">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  value="0" v-if="editType == 1 || editType == 2" v-model.number="formData.newMeterNum" size="mini" placeholder="请输入新表起码" onkeyup="value=value.replace(/[^\d]/g,'')" ></el-input>
          <span v-else>{{formData.newMeterNum}}</span>
        </el-form-item>
        <el-form-item label="换表日期：" prop="replaceDate" :rules="editType == 1 || editType == 2?rules.replaceDate:[]">
           <el-date-picker v-if="editType == 1 || editType == 2" v-model="formData.replaceDate" size="mini" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
           <span v-else>{{formData.replaceDate}}</span>
        </el-form-item>
        <el-form-item label="换表原因：" prop="replaceReason" :rules="editType == 1 || editType == 2?rules.replaceReason:[]">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="editType == 1 || editType == 2" v-model="formData.replaceReason" size="mini" placeholder="请输入换表原因"></el-input>
          <span v-else>{{formData.replaceReason}}</span>
        </el-form-item>
        <el-form-item label="换表员：" prop="replaceStaffName" :rules="editType == 1 || editType == 2?rules.replaceStaffName:[]">
          <!--
          <el-select v-if="editType == 1" v-model="formData.replaceStaff" clearable placeholder="请选择换表员">
            <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
            </el-option>
          </el-select>
          -->
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-if="editType == 1 || editType == 2" v-model="formData.replaceStaffName" size="mini" placeholder="请输入换表员"></el-input>
          <span v-else>{{formData.replaceStaffName}}</span>
        </el-form-item>
        <el-form-item label="旧水表处理方式：" prop="oldHandleWay" :rules="editType == 1 || editType == 2?rules.oldHandleWay:[]" label-width="130px">
           <el-select v-if="editType == 1 || editType == 2" v-model="formData.oldHandleWay"  clearable>
              <el-option v-for="item in dictionaryData.OMD" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span v-else>{{formData.oldHandleWayName}}</span>
        </el-form-item>
        <br>
        <el-form-item class="registration" v-if="editType == 1">
          <el-button @click="register" class="searchBtn">登记</el-button>
        </el-form-item>
        <el-form-item class="registration" v-if="editType == 2">
          <el-button @click="edit" class="searchBtn">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
     <!-- 弹出表单选择水表 -->
    <el-dialog title="水表选择" v-if="waterChooseVisible" :visible.sync="waterChooseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectWater">
      <SelectWaterTable ref="SelectWaterTable" :waterChooseType='waterChooseType' :isFuzzyQuery='isFuzzyQuery' :formType='formType'></SelectWaterTable>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="fixDialogSelectWater">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogSelectWater">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectWaterTable from "@/components/SelectWaterTable";//选择水表
export default {
    name:"QuickChangeEdit",
    props: ["id","detailId","editType"],
    components: {
      SelectWaterTable,//选择水表
    },
    data () {
      return {
        crumbsData: {
          //面包屑
          titleList: [{ title: "表计管理" }, { title: "快捷换表" }]
        },
        // 快捷换表信息
        formData: {
          userNo: '',//用户编号
          ctmName: '',//用户名称
          ctmAddr: '',//用户地址

          oldMeterNo: '',//旧水表编号
          oldMeterBoreName: '',//旧口径
          oldFactoryNo: '',//旧出厂编号
          oldMeterModel: '',//旧水表型号
          oldMeterType:'',//旧水表型号值
          oldMeterBore: '',//旧水表口径
          oldMeterCert: '',//旧合格证号

          newMeterNo: '',//新水表编号
          newMeterBoreName: '',//新口径
          newFactoryNo: '',//新出厂编号
          newMeterModel: '',//新水表型号
          newMeterModelName: '',
          // newMeterType:'',//新水表型号值
          newMeterBore: '',//新水表口径
          newMeterCert: '',//新合格证号
          newMeterFactory: '',//新水表厂家
          newMeterType: '',//新水表类型
          imei:'',
          imsi:'',
          maxValue: '',

          replaceStaff: [],//换表员
          newMeterNum: 0,//新表起码
          upperNum: 0,//上期抄码
          oldMeterNum: 0,//旧表起码
          replaceDate: this.common.date(),//换表日期
          margin: 0,//余量
          replaceReason: '',//换表原因
          oldHandleWay: '2'//就水表处理方式
        },
        //选择水表 选择数据获取类型
        waterChooseType: '',
        //选择水表
        waterChooseVisible:false,
        //选择水表 选择数据获取类型
        waterChooseType: '',
        isFuzzyQuery:'',
        //选择水表 弹框类型
        formType: 'ChangeTablesHandle',
        // 换表员下拉数据
        replaceStaffData: [],
        // 数据字典
        dictionaryData: {},

        restaurants:{
          
        },
       
        rules: {
          userNo: [{ required: true, message: "用户编号不能为空", trigger: 'change' }],
          newFactoryNo: [{ required: true, message: "水表表身码不能为空", trigger: 'change' }],
          newMeterModelName:[{required: true, message: "水表型号不能为空", trigger: 'change'}],
          newMeterBore:[{required: true, message: "口径不能为空", trigger: 'change'}],
          newMeterFactory:[{required: true, message: "水表厂家不能为空", trigger: 'change'}],
          newMeterType:[{required: true, message: "水表类型不能为空", trigger: 'change'}],
          replaceStaffName: [{ required: true, message: "换表员不能为空", trigger: 'change' }],
          newMeterNum: [{ required: true, message: "新表起码不能为空", trigger: 'change' }],
          oldMeterNum: [{ required: true, message: "旧表底码不能为空", trigger: 'change' }],
          replaceDate: [{ required: true, message: "换表日期不能为空", trigger: 'change' }],
          replaceReason: [{ required: true, message: "换表原因不能为空", trigger: 'change' }],
          margin: [{ required: true, message: "余量不能为空", trigger: 'change' }],
          maxValue: [{ required: true, message: "满码值不能为空", trigger: 'change' }],
          oldHandleWay: [{ required: true, message: "请选择旧水表处理方式", trigger: 'change' }],
        },
        newEdit: 0, //是否可编辑
        newEdit2: 0, // 
        // 水表型号下拉数据
        newMeterModelData: [],
        // 水表厂家下拉数据
        newMeterFactoryData: [],
        // 水表类型下拉数据
        newMeterTypeData: [],
        // 水表口径下拉数据
        newMeterBoreData: [],
      }
    },
    mounted () {
      this.getBaseConfig()
      // 换表员数据
     // this.getReplaceStaffData();
      // 数据字典数据
      this.getDictionary();
      // this.formData = this.editData
      this.getDetail(this.id)
    },
    computed: {
      replaceStaffName() {
        return this.replaceStaffData && this.replaceStaffData.filter(item => this.formData.replaceStaff.includes(item.userAccount)).map(item => item.userName).join(', ')
      },
    },
    methods: {
      //用户查询
      search(){
        if (!this.formData.userNo) {
          this.$message.error('请输入用户编号！')
          return
        }
        var reg = new RegExp( ' ' , "g" )
        var reg2 = new RegExp( '\\t' , "g" )
        this.formData.userNo = this.formData.userNo.replace( reg , '' ); 
        this.formData.userNo = this.formData.userNo.replace( reg2 , '' ); 
        let params = {
          busicode: "UserInfoQuery",
          data: { userNo: this.formData.userNo }
        };
        this.$api.fetch({ params }).then(res => {
          if(res.userInfo.status == 0){
              this.$message.error('该用户已注销！')
              return
          }
          if(res.userInfo.status == 2){
              this.$message.error('该用户已停用！')
              return
          }
          this.formData.userNo = res.userInfo.userNo;
          this.formData.ctmName = res.userInfo.ctmName
          this.formData.ctmAddr = res.userInfo.ctmAddr

          this.formData.oldMeterNo = res.msInfo.meterNo
          this.formData.oldMeterBoreName = res.msInfo.meterBoreName
          this.formData.oldFactoryNo = res.msInfo.factoryNo 
          this.formData.oldMeterModel = res.msInfo.meterModel
          this.formData.oldMeterType = res.msInfo.meterType

          // 换表登记更新、编辑不更新
          if (this.editType == 1) {
            this.formData.upperNum = res.userInfo.lastReadingNum
          }

          this.formData.oldMeterBore = res.msInfo.meterBore
          this.formData.oldMeterCert = res.msInfo.meterCert
        });
      },
      getDetail(id){
        if (id !='') {
          let params = {
            busicode: "MsChgQueryNew",
            data: { id: id }
          };
          this.$api.fetch({ params }).then(res => {
            console.log(res);
            this.formData = res
            if (this.editType == 2) {
              this.search()
            }
          });
        }
      },
      // change(val){
      //   console.log(val);
      //   this.$forceUpdate()
      //   this.$set(this.formData,this.formData.replaceStaff,val)
      // },
      // 选择水表按钮
      chooseWaterMeter(val) {
        this.waterChooseType = val;
        this.waterChooseVisible = true;
      },
      // 选择水表弹出框确定按钮
      fixDialogSelectWater() {
        let meterNoArr = []
        let val = this.$refs.SelectWaterTable.selectData
        if (this.waterChooseType == 'chooseNewMater') {
          this.$set(this.formData, "newMeterNo", val[0].meterNo);
          this.$set(this.formData, "newMeterBoreName", val[0].meterBoreName);
          this.$set(this.formData, "newFactoryNo", val[0].factoryNo);
          // this.$set(this.formData, "newMeterModel", val[0].meterModel);
          this.$set(this.formData, "newMeterModelName", val[0].meterModelName);
          this.$set(this.formData, "newMeterType", val[0].meterType);
          this.$set(this.formData, "newMeterBore", val[0].meterBore);
          this.$set(this.formData, "newMeterCert", val[0].meterCert);
          this.waterChooseVisible = false;
          return
        }
      },
      // 选择水表弹出框取消按钮
      closeDialogSelectWater() {
        this.waterChooseVisible = false;
      },
      //水表表身号查询
      queryWaterMeter(){
        if (!this.formData.newFactoryNo) {
          this.$message.error('请输入水表表身号！')
          return
        }
        var reg = new RegExp( ' ' , "g" )
        var reg2 = new RegExp( '\\t' , "g" )
        this.formData.newFactoryNo = this.formData.newFactoryNo.replace( reg , '' ); 
        this.formData.newFactoryNo = this.formData.newFactoryNo.replace( reg2 , '' ); 
        let _this = this
        let params = {
          busicode: "MsInfoList",
          data:{
            factoryNo: this.formData.newFactoryNo
          }
        };
        this.$api.fetch({
          params: params,//参数

        }).then(res => {
          if (res.list.length == 0) {
            this.$confirm('水表表身码不存在，是否立即添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.newEdit = 1;
              this.newEdit2 = 1;
              this.$set(this.formData, "newMeterNo", '');
              this.$set(this.formData, "newMeterBore", '');
              this.$set(this.formData, "newMeterBoreName", '');
              this.$set(this.formData, "newMeterType", '');
              this.$set(this.formData, "newMeterTypeName", '');
              this.$set(this.formData, "newMeterModel", '');
              this.$set(this.formData, "newMeterModelName", '');
              this.$set(this.formData, "newMeterFactory", '');
              this.$set(this.formData, "newMeterFactoryName", '');
              this.$set(this.formData, "maxValue", '');
              this.newMeterModelName = '';
              // 水表厂家下拉
              this.getMeterFactoryData()
              // 水表类型下拉
              this.getMeterTypeData()
               // 水表类型下拉
              this.getMeterBoreData()
            }).catch(() => {
              this.newEdit = 0 
            });
          }else{
            this.newEdit = 0 
            let val = res.list
            if (val[0].meterStatus != 1) {
                this.$message.error('该水表表身码已被使用请重新输入');
                return;
            }
            this.$set(this.formData, "newMeterNo", val[0].meterNo);
            this.$set(this.formData, "newMeterBore", val[0].meterBore);
            this.$set(this.formData, "newMeterBoreName", val[0].meterBoreName);
            this.$set(this.formData, "newMeterFactory", val[0].meterFactory);
            this.$set(this.formData, "newMeterFactoryName", val[0].meterFactoryName);
            this.$set(this.formData, "newFactoryNo", val[0].factoryNo);
            this.$set(this.formData, "newMeterModel", val[0].meterModel);
            this.$set(this.formData, "newMeterModelName", val[0].meterModelName);
            this.$set(this.formData, "newMeterType", val[0].meterType);
            this.$set(this.formData, "newMeterTypeName", val[0].meterTypeName);
            this.$set(this.formData, "newMeterCert", val[0].meterCert);
            this.$set(this.formData, "imei", val[0].imei);
            this.$set(this.formData, "imsi", val[0].imsi);
            this.$set(this.formData, "maxValue", val[0].maxValue);
          }
        })
      },
      /*
      getMeterModelData(){
        let params = {
          busicode: "WaterMeModelOpList",
          data:{}
        };
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.newMeterModelData = res
        })
      },*/
      meterModelSearch(queryString, cb) {
        let params = {
          busicode: "MsMeterModelSelect",
          data:{
            page: 1,
            pageCount: 100,
            fuzzyQuery: queryString
          }
        };
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          if(res && res.length == 0){
            this.$set(this.formData, "newMeterModel", "");
          }
          cb(res);
        })
      },

      getMeterData(item){
        this.formData.newMeterModel = item.id;
        this.formData.newMeterModelName = item.name;
        if(this.formData.newMeterModel != '100'){
          let params = {
            busicode: "MeterModelQuery",
            data:{
              id: this.formData.newMeterModel
            }
        };
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.newEdit2 = 0;
          this.formData.newMeterBoreName = res.meterBoreName
          this.formData.newMeterBore = res.meterBore
          this.$set(this.formData, "newMeterFactory", res.factoryId);
          this.$set(this.formData, "newMeterFactoryName", res.factoryName);
          this.$set(this.formData, "newMeterType", res.meterType);
          this.$set(this.formData, "newMeterTypeName", res.meterTypeName);
          this.$set(this.formData, "newMeterBore", res.meterBore);
          this.$set(this.formData, "maxValue", res.maxValue);
        })
        }else{
          this.$set(this.formData, "maxValue", '');
          this.newEdit2 = 1;
        }
      },
      getMeterFactoryData(){
        let params = {
          busicode: "MeterFactoryList",
          data:{
            page: 1,
            pageCount: 9999
          }
        };
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.newMeterFactoryData = res.list
        })
      }, 
      getMeterTypeData(){
        let params = {
          busicode: "DictionarySelect",
          data: "MMF,MMT,TXS,TPW"
        };
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.newMeterTypeData = res.MMT
        })
      },
      getMeterBoreData(){
        let params = {
          busicode: "MeterBoreList",
          data:{
            page: 1,
            pageCount: 999
          }
        };
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.newMeterBoreData = res.list
        })
      },
      newMeterModelBlur(){
        if(this.formData.newMeterModel == ""){
          this.$set(this.formData, "newMeterModel", this.formData.newMeterModelName);
        }
      },
      //登记
      register(){
        let _this = this
        this.$refs["quickChangeForm"].validate(valid => {
          if (valid) {
            if (Number(this.formData.oldMeterNum?this.formData.oldMeterNum:0)-Number(this.formData.upperNum?this.formData.upperNum:0) < 0) {
              _this.$message.error('旧表底码不可小于上期抄码！')
              return
            }
            let saveData = {};
            saveData.userNo = _this.formData.userNo;
            saveData.oldMeterNo = _this.formData.oldMeterNo;
            saveData.newMeterNo = _this.formData.newMeterNo;
            saveData.newMeterNum = _this.formData.newMeterNum;
            saveData.oldMeterNum = _this.formData.oldMeterNum;
            saveData.replaceDate = _this.formData.replaceDate;
            saveData.margin = _this.formData.margin;
            saveData.replaceReason = _this.formData.replaceReason;
            saveData.oldHandleWay = _this.formData.oldHandleWay;
            saveData.oldMeterBore = _this.formData.oldMeterBore;
            saveData.oldFactoryNo = _this.formData.oldFactoryNo;
            saveData.oldMeterCert = _this.formData.oldMeterCert;
            saveData.oldMeterModel = _this.formData.oldMeterModel;
            saveData.upperNum = _this.formData.upperNum;
            saveData.newMeterBore = _this.formData.newMeterBore;
            saveData.newFactoryNo = _this.formData.newFactoryNo;
            saveData.newMeterCert = _this.formData.newMeterCert;
            saveData.newMeterType = _this.formData.newMeterType;
            saveData.newMeterFactory = _this.formData.newMeterFactory;
            saveData.newMeterModel = _this.formData.newMeterModel;
            saveData.oldMeterType = _this.formData.oldMeterType;
            saveData.imei = _this.formData.imei;
            saveData.imsi = _this.formData.imsi;
            saveData.maxValue = _this.formData.maxValue;

            // 换表员value
            saveData.replaceStaffName = _this.formData.replaceStaffName.toString();
            /*
            // 换表员name
            let name = []
            //console.log(_this.activeData.replaceStaff);
            
              _this.replaceStaffData.forEach(item1 => {
                if (_this.formData.replaceStaff == item1.userAccount) {
                  saveData.replaceStaffName = item1.userName;
                }
              });*/
            console.log(saveData);
            let params = {
                busicode: "MsChgAddNew",
                data: saveData
              };
              _this.$api
                .fetch({
                  params //参数
                })
                .then(res => {
                  this.$message({
                    message: "登记成功",
                    type: "success"
                  });
                  this.$emit('closeEdit')
                });
          }else{
            return false;
          }
        })
        
      },
      //修改
      edit(){
        let _this = this
        this.$refs["quickChangeForm"].validate(valid => {
          if (valid) {
            if (Number(this.formData.oldMeterNum?this.formData.oldMeterNum:0)-Number(this.formData.upperNum?this.formData.upperNum:0) < 0) {
              _this.$message.error('旧表底码不可小于上期抄码！')
              return
            }
            let saveData = {};
            saveData.userNo = _this.formData.userNo;
            saveData.oldMeterNo = _this.formData.oldMeterNo;
            saveData.newMeterNo = _this.formData.newMeterNo;
            saveData.newMeterNum = _this.formData.newMeterNum;
            saveData.oldMeterNum = _this.formData.oldMeterNum;
            saveData.replaceDate = _this.formData.replaceDate;
            saveData.margin = _this.formData.margin;
            saveData.replaceReason = _this.formData.replaceReason;
            saveData.oldHandleWay = _this.formData.oldHandleWay;
            saveData.oldMeterBore = _this.formData.oldMeterBore;
            saveData.oldFactoryNo = _this.formData.oldFactoryNo;
            saveData.oldMeterCert = _this.formData.oldMeterCert;
            saveData.oldMeterModel = _this.formData.oldMeterModel;
            saveData.upperNum = _this.formData.upperNum;
            saveData.newMeterBore = _this.formData.newMeterBore;
            saveData.newFactoryNo = _this.formData.newFactoryNo;
            saveData.newMeterCert = _this.formData.newMeterCert;
            saveData.newMeterType = _this.formData.newMeterType;
            saveData.newMeterFactory = _this.formData.newMeterFactory;
            saveData.newMeterModel = _this.formData.newMeterModel;
            saveData.oldMeterType = _this.formData.oldMeterType;
            saveData.imei = _this.formData.imei;
            saveData.imsi = _this.formData.imsi;
            saveData.maxValue = _this.formData.maxValue;

            // 换表员value
            saveData.replaceStaffName = _this.formData.replaceStaffName.toString();

            saveData.id = this.detailId
            saveData.receiptId = this.id
            /*
            // 换表员name
            let name = []
            //console.log(_this.activeData.replaceStaff);
            
              _this.replaceStaffData.forEach(item1 => {
                if (_this.formData.replaceStaff == item1.userAccount) {
                  saveData.replaceStaffName = item1.userName;
                }
              });*/
            console.log(saveData);
            let params = {
              busicode: "MsChgUpdateNew",
              data: saveData
            };
            _this.$api.fetch({
              params //参数
            })
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$emit('closeEdit')
            });
          }else{
            return false;
          }
        })
      },
      caculate(val){
        this.formData.margin = Number(this.formData.oldMeterNum?this.formData.oldMeterNum:0)-Number(this.formData.upperNum?this.formData.upperNum:0)
      },
      // checkCaculate(rule, value, cb) {
      //   if (!value) {
      //     cb(new Error('旧表底码不能为空'))
      //   } else {
      //     console.log(this.formData.oldMeterNum);
      //     console.log(value);
      //     if (Number(this.formData.oldMeterNum?this.formData.oldMeterNum:0)-Number(this.formData.upperNum?this.formData.upperNum:0)) {
      //       cb(new Error('旧表底码不可小于上次抄码'))
      //     }
      //   }
      //   cb()
      // },
      getBaseConfig() { //获取水量异常比例配置
        let _this = this
        var params = {
          busicode: "ConfigList",
          data:{searchContent:'MR_INFO_SELECT_IS_FUZZYQUERY'}
        };
        this.$api
          .fetch({ params })
          .then(res => {
            let data = res.list
            if(data!=null && data.length > 0) {
              this.isFuzzyQuery = data[0].configValue
            }
          })
          .catch(res => {

          });
      },
      //拆表员数据获取
      getReplaceStaffData() {
        var _this = this;
        var params = {
          "busicode": "PostUserSelect",
          "data": { "postNo": "4" },
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            _this.replaceStaffData = [...res];
          });
      },
      // 数据字典（查询框）
      getDictionary() {
        var _this = this;
        var params = {
          busicode: "DictionarySelect",
          data: "OMD,MCM" // （旧表处理方式）
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            _this.dictionaryData = res;
          });
      },
    }
}
</script>

<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.QuickChangeEdit{
    height: 100%;
    overflow-y: auto;
    .registration{
      text-align: center;
      margin: 20px auto auto;
      display: block;
    }
    /deep/{
      .userNo {
        width: 25%;
        .el-form-item__content{
          width: calc(100% - 110px);
        }
      }
      .el-autocomplete-suggestion{
        width: auto!important;
      }
      .ctmName{
        label{
          width: 90px !important;
        }
      }
      .ctmAddr{
        width: 45%;
        label{
          width: 85px !important;
        }
      }
    }
}
</style>