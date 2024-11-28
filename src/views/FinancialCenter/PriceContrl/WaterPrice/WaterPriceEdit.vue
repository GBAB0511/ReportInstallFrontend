
<template>
  <div class="WaterPriceEdit">
    <el-form
      :inline="true"
      ref="WaterPriceEditFrom"
      class="formBill"
      :rules="rules"
      size="mini"
      :model="waterPriceForm"
      label-width="130px"
      :disabled="!EditRight"
    >
      <el-form-item label="用水类型：" prop="waterTypeId">
        <el-cascader
          :props="props"
          :options="waterTypeIdOptions"
          :show-all-levels="false"
          clearable
          v-model="waterPriceForm.waterTypeId"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="生效日期：" prop="effectiveDate">
        <el-date-picker
          v-model="waterPriceForm.effectiveDate"
          type="date"
          placeholder="生效日期"
          clearable
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="状态：" prop="status">
        <el-select v-model="waterPriceForm.status" placeholder="请选择状态" clearable>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：" prop="remark" class="f4">
        <el-input  type="textarea" v-model="waterPriceForm.remark" placeholder="请输入备注"></el-input>
      </el-form-item>

      <div v-for="(costNameItem,costNameIndex) in costNameOptions" :key="costNameIndex">
        <legend class="legendColumn">{{costNameItem.name}}</legend>
        <el-form-item label="违约金策略：" prop="detailName">
          <el-select
            v-model="waterPriceForm.details[costNameIndex].penaltyStrategyId"
            placeholder="请选择违约策略"
          >
            <el-option
              v-for="(item,index) in penaltyStrategyOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
       <!-- <el-form-item label=" " prop="noChargingBool" title="打开此开关，则该费用不会收款">
          <el-checkbox v-model="waterPriceForm.details[costNameIndex].noChargingBool">仅计费不收款</el-checkbox>
        </el-form-item>-->
        <el-form-item label="固定收取：" >
          <el-input
            v-model="waterPriceForm.details[costNameIndex].fixedMoney"
            placeholder
            clearable
            style="width:90px !important"
            @keyup.native='keyupEvent($event,input)'
          ></el-input>元
          <div style="display:inline">
            <el-radio-group
              v-model="waterPriceForm.details[costNameIndex].fixedMoneyUnit"
              size="mini"
            >
              <el-radio-button
                v-for="(item) in dictionaryOptions.BMU"
                :key="item.value"
                :label="item.value"
              >{{item.name}}</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>

         <el-form-item label="最低金额：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" 
            v-model.number="waterPriceForm.details[costNameIndex].minMoney"
            placeholder
            clearable
            style="width:90px !important"
            @keyup.native='keyupEvent($event,input)'
          ></el-input>元

        </el-form-item>
       <el-form-item label="封顶金额：" >
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" 
            v-model.number="waterPriceForm.details[costNameIndex].maxMoney"
            placeholder
            clearable
            style="width:90px !important"
            @keyup.native='keyupEvent($event,input)'
          ></el-input>元

        </el-form-item>



        <el-form-item label="阶梯类型：" prop="ladderType" class="f4">
          <el-radio-group v-model="waterPriceForm.details[costNameIndex].ladderType" 
            size="mini">
            <el-radio-button
              v-for="(item) in dictionaryOptions.BLT"
              :key="item.value"
              :label="item.value"
            >{{item.name}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="无阶梯单价："
          class="f2"
          v-if="waterPriceForm.details[costNameIndex].ladderType == '1'"
        >
          <el-input
            v-model="waterPriceForm.details[costNameIndex].fixedPrice"
            placeholder
            size="mini"
            clearable
            style="width:90px !important"
            @keyup.native='keyupEvent($event,input)'
          ></el-input>
          <font style="font-size:12px ;color:#606266">元</font> 
          <el-select
            v-model="waterPriceForm.details[costNameIndex].fixedPriceUnit"
            style="width:80px !important"
          >
            <el-option
              v-for="(item,index) in dictionaryOptions.BPU"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计算方式：" v-if="waterPriceForm.details[costNameIndex].ladderType != '1' && waterPriceForm.details[costNameIndex].ladderType != '6'">
          <el-select v-model="waterPriceForm.details[costNameIndex].ladderCalculateWay">
            <el-option
              v-for="(item,index) in dictionaryOptions.BLC"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="人口基数："
          prop="personBase"
          v-if="waterPriceForm.details[costNameIndex].ladderType != '1' && waterPriceForm.details[costNameIndex].ladderType != '6'"
        >
          <el-input
            v-model.number="waterPriceForm.details[costNameIndex].personBase"
            placeholder="请输入人口基数"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          label
          prop="waterBase"
          class="f2"
          v-if="waterPriceForm.details[costNameIndex].ladderType != '1' && waterPriceForm.details[costNameIndex].ladderType != '6' && waterPriceForm.details[costNameIndex].ladderCalculateWay=='1'"
        >
          <font>超过人口基数，每增加一人增加</font>
          <el-input
            v-model="waterPriceForm.details[costNameIndex].waterBase"
            placeholder
            clearable
            style="width:90px !important"
            @keyup.native='keyupEvent($event,input)'
          ></el-input>
          <font>m³水量</font>
        </el-form-item>

        <div class="kl-table" v-if="waterPriceForm.details[costNameIndex].ladderType != '1'">
          <div class="table-content">
            <font>阶梯明细</font>
            <el-button-group class="add-line">
              <el-button
                type="info"
                size="mini"
                @click="addRow(waterPriceForm.details[costNameIndex])"
                icon="el-icon-plus"
              ></el-button>
            </el-button-group>
          </div>
          <el-table
            stripe
            border
            :data="waterPriceForm.details[costNameIndex].ladders"
            class="wuserInfo-table"
          >
            <el-table-column type="index" label="NO." width="50"></el-table-column>

            <el-table-column prop="beginWater" min-width="100" label="阶梯起水量 >">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.beginWater"
				  :type="waterPriceForm.details[costNameIndex].ladderType != '6' ? 'number' : 'text'"
                  :maxlength="waterPriceForm.details[costNameIndex].ladderType != '6' ? 10 : 1000"
                  clearable
                  placeholder="请输入开始水量"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="endWater" min-width="100" label="阶梯结束水量 ≤">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.endWater"
				  :type="waterPriceForm.details[costNameIndex].ladderType != '6' ? 'number' : 'text'"
                  :maxlength="waterPriceForm.details[costNameIndex].ladderType != '6' ? 10 : 1000"
                  clearable
                  placeholder="请输入结束水量"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="price" min-width="100" label="单价">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.price"
                  type="number"
                  maxlength="10"
                  clearable
                  step="0.0001"
                  placeholder="请输入单价"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native="deleteRow(scope.$index, scope.row,waterPriceForm.details[costNameIndex].ladders)"
                  style="font-size:12px;"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>
    <legend class="legendColumn">上传附件
              <i class="fontRight" :class="uploadIcon" @click="showMore('uploadFileShow','uploadIcon')"></i>
            </legend>
       <uploadFile ref="uploadFiles" :receiptType="receiptType" v-if="uploadFileShow"></uploadFile>
    <legend v-if="EditShow"  class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
    <div>
      <h3>计算说明：</h3>
      <h5>&emsp;&emsp;固定收取金额为每月或每日固定要收取的费用，会和其它费用累加</h5>
      <h5>无阶梯计算举例：</h5>
      <h5>&emsp;&emsp;假设无阶梯单价5元每吨，本月用水10吨，固定收取金额1元每天，本月计费天数28天，金额=(5*10)+(1*28)=78元</h5>
      <h5>日阶梯计算举例：</h5>
      <h5>&emsp;&emsp;（1）假设阶梯计算方式为按水量，人口基数为4，超过人口基数，每增加一人增加5方水，计费天数30天</h5>
      <h5>&emsp;&emsp;第一阶水量0-22单价1元/方，第二阶水量22-40单价2元/方，第三阶水量40以上单价3元/方</h5>
      <h5>&emsp;&emsp;某户用水人口为6人，本月计费天数28天，</h5>
      <h5>&emsp;&emsp;则该计费周期的最终用水阶梯为：</h5>
      <h5>&emsp;&emsp;先计算用水天数比例28/30=0.9333，再根据用水人口计算添加水量(6-4)*5=10</h5>
      <h5>&emsp;&emsp;计算第一阶为0 - (22+10)*0.9333，最终为0 - 29.87(保留2位小数)</h5>
      <h5>&emsp;&emsp;计算第二阶为(22+10)*0.9333 - (40+10)*0.9333，最终为29.87 - 46.67(保留2位小数)</h5>
      <h5>&emsp;&emsp;计算第三阶为46.67以上(保留2位小数)</h5>
      <h5>&emsp;&emsp;（2）假设阶梯计算方式为按人口，人口基数为4，计费天数30天</h5>
      <h5>&emsp;&emsp;第一阶水量0-5单价1元/方，第二阶水量5-8单价2元/方，第三阶水量8以上单价3元/方</h5>
      <h5>&emsp;&emsp;某户用水人口为6人，本月计费天数28天，</h5>
      <h5>&emsp;&emsp;则该计费周期的最终用水阶梯为：</h5>
      <h5>&emsp;&emsp;先计算用水天数比例28/30=0.9333</h5>
      <h5>&emsp;&emsp;计算第一阶为0 - (5*6)*0.9333，最终为0 - 28.00(保留2位小数)</h5>
      <h5>&emsp;&emsp;计算第二阶为(5*6)*0.9333 - (8*6)*0.9333，最终为28.00 - 44.80(保留2位小数)</h5>
      <h5>&emsp;&emsp;计算第三阶为44.80以上(保留2位小数)</h5>
    </div>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "WaterPriceEdit",
  components :{
    uploadFile,
  },
  data() {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "BASE_WATER_PRICE",
      waterPriceForm: {},
      EditRight:true,
      EditShow:true,
      formData: {
        waterPriceId: "",
        waterTypeId: "",
        penaltyStrategy: "",
        effectiveDate: "",
        status: "",
        details: [],
        processState:"",
        billNo:"",
        billDate:"",
      },
      waterTypeIdOptions: [], //用水类型
      penaltyStrategyOptions: [], //违约金策略
      costNameOptions: [], //费用类型
      dictionaryOptions: {}, //数据字典
      rules: {
        waterTypeId: [
           { required: true, message: "请选择用水类型", trigger: "change" }
        ],
        //penaltyStrategy: [
        //   { required: true, message: "请选择违约金策略", trigger: "blur" }
        //],
        effectiveDate: [
           { required: true, message: "请选择生效日期", trigger: "change" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        // remark: [{ required: true, message: "请输入备注", trigger: "change" }]
      },
      list: {
        costDetailId: ""
      },
      editList: {
        costDetailId: "",
        waterPriceDetailId: ""
      },
      maxHeight: 0,
      tableShow: false,
      process:"",
      // 级联选择器
      props: {
        label: "name",
        children: "children",
        value: "id",
        emitPath: false,
        checkStrictly: false
      },
    };
  },
  mounted() {
    this.getData();
      this.common.changeTable(this, ".WaterPriceEdit", [
        ".WaterPriceEdit .WaterPriceEditFrom"
      ]);

  },
  methods: {
    keyupEvent(e,input){
      e.target.value=e.target.value.replace(/[^\d.]/g, '');
      e.target.value=e.target.value.replace(/\.{2,}/g, '.');
      e.target.value=e.target.value.replace(/^\./g, '0.');
      e.target.value=e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0,e.target.value.length-1));  
      e.target.value=e.target.value.replace(/^0[^\.]+/g, '0')
      e.target.value=e.target.value.replace(/^(\d+)\.(\d\d\d\d).*$/, '$1.$2')
      this.input=e.target.value
      //console.log(this.input)
    },
    // 获取下拉框数据
    getData() {
      
      let _this = this;
      //用水类型
      this.$api
        .fetch({
          params: {
            busicode: "WaterTypeNameSelect",
            data: {
              status: _this.$parent.process=="WaterPriceAdd" ? 1:0,
            }
          } //参数
        })
        .then(res => {
          _this.waterTypeIdOptions = _this.treeData(res);
        });
      //违约金策略
      this.$api
        .fetch({
          params: {
            busicode: "StrategyNameSelect",
            data: {}
          } //参数
        })
        .then(res => {
          _this.penaltyStrategyOptions = res;
        });
      //阶梯类型等数据字典
      this.$api
        .fetch({
          params: {
            busicode: "DictionarySelect",
            data: "UWJ,BMU,BLT,BPU,BLC"
          } //参数
        })
        .then(res => {
          _this.dictionaryOptions = res;
        });
    },
    //保存按钮
    resetForm() {
      this.$refs.WaterPriceEditFrom.resetFields();
    },
    addRow(val) {
      val.ladders.push({});
      //this.$forceUpdate();
    },
    // 删除行
    deleteRow(index, row, list) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitForm(formName, type) {
      let _this = this;
      let params = {};
      let flag = false;
      this.$refs.WaterPriceEditFrom.validate((valid)=>{
        if(!valid){
          flag=true
        }
      })
      if (flag) {
        _this.$notify({
          title: "验证失败",
          message: "当前必填项未完善，请检查",
          type: "error"
        });
        return;
      }

      if (_this.waterPriceForm.id) {
        params = {
          busicode: "WaterPriceUpdate",
          data: _this.waterPriceForm
        };
        _this.process="WaterPriceUpdate";
      } else {
        params = {
          busicode: "WaterPriceAdd",
          data: _this.waterPriceForm
        };
        _this.process="WaterPriceAdd";
      }
      //去掉为空的阶梯
      for (let i = 0; i < _this.waterPriceForm.details.length; i++) {
        for (
          let j = _this.waterPriceForm.details[i].ladders.length - 1;
          j >= 0;
          j--
        ) {
          let ob = _this.waterPriceForm.details[i].ladders[j];
          if (
            (ob.beginWater == undefined ||
              ob.beginWater == "" ||
              ob.beginWater == "0") &&
            (ob.beginWater == undefined ||
              ob.endWater == "" ||
              ob.endWater == "0")
          ) {
            _this.waterPriceForm.details[i].ladders.splice(j, 1);
          }
        }
      }
      _this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.waterPriceForm.id = res.id;
          if (!type) {
            _this.startProcess();
          } else {
            _this.$message({
              showClose: true,
              message: "保存成功",
              type: "success"
            });
            _this.$parent.init();
            _this.$parent.closeDialog();
          }
        });
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "BASE_WATER_PRICE",
        "审批流配置:" +  
          _this.waterPriceForm.processName +
          "(" +
          _this.waterPriceForm.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.waterPriceForm.id, // 任务id
        _this.waterPriceForm.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          _this.$parent.closeDialog(); // 提交后回调方法
        },
        0, // 不等于1时，先保存后提交
        _this.$parent.process,
      );
    },
    //审核需要用到的方法
    getFormbData(){
      return this.waterPriceForm
    },
    startProcess() {
      // 保存后启动审批
      this.common.startProcess(
        //receiptType单据类型，一般是启用工作流的表的数据库名称
        "BASE_WATER_PRICE",
        "用水价格:" + this.waterPriceForm.remark, // 流程标题,一般是单据类型加单据编号
        //billId单据Id
        this.waterPriceForm.id,
        //that:"页面的this对象"
        this,
        //_then 提交后的回调函数，一般用来执行界面跳转
        () => {
          this.$parent.closeDialog();
        }
      );
    },
    handleClose() {
      this.common.chargeObjectEqual(
        this,
        this.waterPriceForm,
        "get",
        "WaterPriceEdit",
        this.$parent.closeDialog
      );
    },
    editData(val) {
      this.waterPriceForm = val;
      
      if(val.id != undefined && val.id != '') {
          eventBus.$emit('receiptId', val.id)
          this.$refs.uploadFiles.getAccessoryList()
      }
      else {      
        let tempId = this.util.generateUUID()
        eventBus.$emit('receiptId', tempId)
        this.waterPriceForm.tempId= tempId
      }
    },
    //  用水类型数据处理（过滤掉children为空）
    treeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          if (data[i].children.length === 0) {
            data[i].children = undefined;
          } else {
            this.treeData(data[i].children);
          }
        }
      }
      return data;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.WaterPriceEdit {
  height: calc(100% - 41px);
  width: 100%;
  margin: 0 auto;
  padding: 10px 0px;
  overflow-y: auto;
  font {
    font-size: 12px;   
    color: #606266;
  }
  /deep/ {
    .is-disabled {
      .el-input__inner, .el-textarea__inner {
        color: black;
      }
    }
    .is-active .el-radio-button__orig-radio:disabled+.el-radio-button__inner {
      color: black;
    }
  }
  .is-disabled .el-input__inner{
    color: black;
  }
  .table-content {
    height: 30px;
    border-top: 1px solid #edeff3;
    padding: 5px 0px 0px 0px;
    font {
      font-weight: 700;
      padding: 5px 20px;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .add-line {
      float: right;
      margin-right: 20px;
      // margin-bottom: 5px;
      .el-button--info {
        background-color: #b5bac3;
        border-color: #b5bac3;
      }
    }
  }
}
</style>
