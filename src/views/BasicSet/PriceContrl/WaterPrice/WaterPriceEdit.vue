
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
        <el-input type="textarea" v-model="waterPriceForm.remark" placeholder="请输入备注"></el-input>
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
        <el-form-item label=" " prop="noChargingBool" title="打开此开关，则该费用不会收款">
          <el-checkbox v-model="waterPriceForm.details[costNameIndex].noChargingBool">仅计费不收款</el-checkbox>
        </el-form-item>
        <el-form-item label="固定收取：" class="f2">
          <el-input
            @input="e => input = inputMe(e)"
            v-model.number="waterPriceForm.details[costNameIndex].fixedMoney"
            placeholder
            clearable
            style="width:90px !important"
          ></el-input>元
          <div style="display:inline">
            <el-radio-group
              v-model="waterPriceForm.details[costNameIndex].fixedMoneyUnit"
              size="mini"
            >
              <el-radio-button
                v-for="(item,index) in dictionaryOptions.BMU"
                :key="item.value"
                :label="item.value"
              >{{item.name}}</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="阶梯类型：" prop="ladderType" class="f4">
          <el-radio-group v-model="waterPriceForm.details[costNameIndex].ladderType" 
            size="mini">
            <el-radio-button
              v-for="(item,index) in dictionaryOptions.BLT"
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
            v-model.number="waterPriceForm.details[costNameIndex].fixedPrice"
            placeholder
            size="mini"
            @input="e => input = inputMe(e)"
            clearable
            style="width:90px !important"
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
        <el-form-item label="计算方式：" v-if="waterPriceForm.details[costNameIndex].ladderType != '1'">
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
          v-if="waterPriceForm.details[costNameIndex].ladderType != '1'"
        >
          <el-input
            v-model.number="waterPriceForm.details[costNameIndex].personBase"
            placeholder="请输入人口基数"
            @input="e => input = inputMe(e)"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          label
          prop="waterBase"
          class="f2"
          v-if="waterPriceForm.details[costNameIndex].ladderType != '1' && waterPriceForm.details[costNameIndex].ladderCalculateWay=='1'"
        >
          <font>超过人口基数，每增加一人增加</font>
          <el-input
            v-model.number="waterPriceForm.details[costNameIndex].waterBase"
            placeholder
            @input="e => input = inputMe(e)"
            clearable
            style="width:90px !important"
          ></el-input>
          <font>方水</font>
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

            <el-table-column prop="beginWater" min-width="100" label="阶梯起水量">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.beginWater"
                  type="number"
                  @input="e => input = inputMe(e)"
                  maxlength="10"
                  clearable
                  placeholder="请输入开始水量"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="endWater" min-width="100" label="阶梯结束水量">
              <template slot-scope="scope">
                <el-input
                  @input="e => input = inputMe(e)"
                  v-model="scope.row.endWater"
                  type="number"
                  maxlength="10"
                  clearable
                  placeholder="请输入结束水量"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="price" min-width="100" label="单价">
              <template slot-scope="scope">
                <el-input
                  @input="e => input = inputMe(e)"
                  v-model="scope.row.price"
                  type="number"
                  maxlength="10"
                  clearable
                  step="0.0001"
                  placeholder="请输入单价"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ladderBeginMoney" min-width="100" label="阶段起始金额">
              <template slot-scope="scope">
                <el-input
                  @input="e => input = inputMe(e)"
                  v-model="scope.row.ladderBeginMoney"
                  type="number"
                  maxlength="14"
                  clearable
                  step="0.0001"
                  placeholder="请输入阶段起始金额"
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

    <legend class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
    <div>
      <h3>计算说明：</h3>
      <h5>固定收取金额为每月或每日固定要收取的费用，会和其它费用累加</h5>
      <h5>无阶梯计算举例：</h5>
      <h5>假设无阶梯单价5元每吨，本月用水10吨，固定收取金额1元每天，本月计费天数28天</h5>
      <h5>金额=10*5+1*28=78元</h5>
      <h5>日阶梯计算举例：</h5>
      <h5>假设阶梯计算方式为按水量，人口基数为4，超过人口基数，每增加一人增加2方水，本月计费天数28天</h5>
      <h5>第一阶1-10 单价1元/方，第二阶11以上 单价2元/方</h5>
      <h5>某户用水人口6人，则该计费周期的最终第一阶为0-（6-4）</h5>
    </div>
  </div>
</template>
<script>
export default {
  name: "WaterPriceEdit",
  data() {
    return {
      waterPriceForm: {},
      EditRight:true,
      formData: {
        waterPriceId: "",
        waterTypeId: "",
        penaltyStrategy: "",
        effectiveDate: "",
        status: "",
        details: []
      },
      waterTypeIdOptions: [], //用水类型
      penaltyStrategyOptions: [], //违约金策略
      costNameOptions: [], //费用类型
      dictionaryOptions: {}, //数据字典
      rules: {
        // waterTypeId: [
        //   { required: true, message: "请选择用水类型", trigger: "blur" }
        // ],
        // penaltyStrategy: [
        //   { required: true, message: "请选择违约金策略", trigger: "blur" }
        // ],
        // effectiveDate: [
        //   { required: true, message: "请选择生效日期", trigger: "blur" }
        // ],
        // status: [{ required: true, message: "请选择状态", trigger: "blur" }]
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
      // 级联选择器
      props: {
        label: "name",
        children: "children",
        value: "id",
        emitPath: false,
        checkStrictly: false
      }
    };
  },
  mounted() {
    this.getData();
    this.$nextTick(() => {
      this.common.changeTable(this, ".WaterPriceEdit", [
        ".WaterPriceEdit .WaterPriceEditFrom"
      ]);
    });
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 获取下拉框数据
    getData() {
      let _this = this;
      //用水类型
      this.$api
        .fetch({
          params: {
            busicode: "WaterTypeNameSelect",
            data: {}
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
      if (_this.waterPriceForm.waterTypeId == "") {
        _this.$message({
          showClose: true,
          message: "用水类型不能为空",
          type: "error"
        });
        return;
      }
      if (_this.waterPriceForm.effectiveDate == "") {
        _this.$message({
          showClose: true,
          message: "生效日期不能为空",
          type: "error"
        });
        return;
      }
      

      if (_this.waterPriceForm.id) {
        params = {
          busicode: "WaterPriceUpdate",
          data: _this.waterPriceForm
        };
      } else {
        params = {
          busicode: "WaterPriceAdd",
          data: _this.waterPriceForm
        };
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
        "用水价格:" + _this.waterPriceForm.remark, // 流程标题,一般是单据类型加单据编号
        _this.waterPriceForm.id, // 任务id
        _this.waterPriceForm.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          _this.$parent.closeDialog(); // 提交后回调方法
        },
        0, // 不等于1时，先保存后提交
        () => {
          _this.submitForm();
        }
      );
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
<style lang="scss">
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
