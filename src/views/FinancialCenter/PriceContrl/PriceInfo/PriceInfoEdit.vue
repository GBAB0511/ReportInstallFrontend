
<template>
  <div class="PriceInfoEdit">
    <div class="backfillSubmitForm">
      <div class="toolbar">
        <div class="form-left">
          <div class="info">
            <div class="toolbar-line"></div>计费策略
          </div>
        </div>
      </div>
      <el-form :inline="true" ref="PriceInfoEditForm" :rules="rules" size="mini" :model="ruleForm" label-width="120px">

        <el-form-item label="违约金策略：" prop="detailName">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="ruleForm.detailName" placeholder="请输入策略名称"></el-input>
        </el-form-item>

        <el-form-item label="费用种类：" prop="costName">
          <el-select v-model="ruleForm.costName" placeholder="请选择费用种类">
            <el-option v-for="(item, index) in costNameOptions" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="阶梯类型：" prop="ladderType">
          <el-select v-model="ruleForm.ladderType" placeholder="请选择阶梯类型">
            <el-option v-for="(item,index) in ladderTypeOptions" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计算单位：" prop="calculateUnit">
          <el-select v-model="ruleForm.calculateUnit" placeholder="请选择状态">
            <el-option label="按户" :value="1"></el-option>
            <el-option label="按人" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人口基数：" prop="personBase">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="ruleForm.personBase" placeholder="请输入人口基数" maxlength="1" clearable></el-input>
        </el-form-item>

        <el-form-item label="水量基数：" prop="waterBase">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model.number="ruleForm.waterBase" placeholder="请输入水量基数" maxlength="1" clearable></el-input>
        </el-form-item>
      </el-form>

      <div class="toolbar">
        <div class="form-left">
          <div class="info">
            <div class="toolbar-line"></div>价格阶梯
          </div>
        </div>
        <div class="form-right">
          <el-button icon="el-icon-plus" type="primary" size='mini' @click="add">添加行</el-button>
        </div>
      </div>

      <el-table stripe border v-if="tableShow" :max-height="maxHeight" :data="ruleForm.ladderlist" class="wuserInfo-table">

        <el-table-column type="index" label="NO." width="50">
        </el-table-column>

        <el-table-column prop="beginWater" min-width="100" label="开始水量">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.beginWater" type="number" maxlength="10" clearable placeholder="请输入开始水量">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column prop="endWater" min-width="100" label="结束水量">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.endWater" type="number" maxlength="10" clearable placeholder="请输入结束水量">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column prop="price" min-width="100" label="单价">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.price" type="number" maxlength="10" clearable step="0.0001" placeholder="请输入单价">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column prop="coefficient" min-width="100" label="系数">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.coefficient" type="number" maxlength="10" clearable step="0.0001" placeholder="请输入系数">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column prop="ladderBeginMoney" min-width="100" label="阶段起始金额">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.ladderBeginMoney" type="number" maxlength="14" clearable step="0.0001" placeholder="请输入阶段起始金额">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="text" @click.native="deleteRow(scope.$index, scope.row)" style="font-size:12px;">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "PriceInfoEdit",
  data() {
    return {
      ruleForm: {},
      formData: {
        costDetailId: "",
        detailName: "",
        costName: "",
        ladderType: "",
        calculateUnit: "",
        personBase: "",
        waterBase: "",
        status: "",
        comments: "",
        ladderlist: []
      },
      ladderTypeOptions: [], //阶梯类型
      rules: {
        detailName: [
          { required: true, message: "请输入明细名称", trigger: "blur" }
        ],
        costName: [
          { required: true, message: "请选择费用名称", trigger: "blur" }
        ],
        ladderType: [
          { required: true, message: "请选择阶梯类型", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      costNameOptions: [], //费用名称
      maxHeight: 0,
      tableShow: false
    };
  },
  mounted() {
    this.getData();
    this.$nextTick(() => {
      this.common.changeTable(this, ".PriceInfoEdit", [
        ".PriceInfoEdit .backfillSubmitForm"
      ]);
    });
  },
  methods: {
    // 获取下拉框数据
    getData() {
      let _this = this;
      //费用名称
      this.$api
        .fetch({
          params: {
            busicode: "CostNameSelect",
            data: {}
          } //参数
        })
        .then(res => {
          _this.costNameOptions = res;
        });
      //阶梯类型
      this.$api
        .fetch({
          params: {
            busicode: "DictionarySelect",
            data: "UWJ"
          } //参数
        })
        .then(res => {
          _this.ladderTypeOptions = res;
        });
    },
    add() {
      this.ruleForm.ladderlist.push({
        beginWater: "",
        endWater: "",
        price: "",
        coefficient: "",
        ladderBeginMoney: ""
      });
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ruleForm.ladderlist.splice(index, 1);
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
    //保存按钮
    resetForm() {
      this.$refs.PriceInfoEditForm.resetFields();
    },
    submitForm(formName, type) {
      let _this = this;
      let params = {};

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.ladderlist = this.common.handleDataType(
            this.ruleForm.ladderlist,
            "costDetailId",
            "costDetailLadderId"
          );
          if (type === "添加") {
            params = {
              busicode: "CostDetailAdd",
              data: this.ruleForm
            };
          } else {
            this.ruleForm = this.common.handleData(
              this.ruleForm,
              this.formData
            );
            params = {
              busicode: "CostDetailUpdate",
              data: this.ruleForm
            };
          }
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              _this.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
              _this.$parent.init();
              _this.$parent.closeDialog();
            });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.common.chargeObjectEqual(
        this,
        this.ruleForm,
        "get",
        "PriceInfoEdit",
        this.$parent.closeDialog
      );
    },
    editData(val) {
      this.ruleForm = val;
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
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.PriceInfoEdit {
  height: 100%;
  width: 95%;
  margin: 0 auto;
  .backfillSubmitForm {
    .el-input--mini /deep/ .el-input__inner {
      width: 100%;
    }
    .toolbar-line {
      width: 4px;
      background: #c4d600;
      border-radius: 4px;
      height: 1.5rem;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    .info {
      margin: 10px 0px;
      font-weight: 700;
      color: #000;
      height: 1.5rem;
      line-height: 1.5rem;
      padding: 0 1rem;
      font-size: 14px;
    }
  }
  .el-form-item {
    width: 48%;
    margin-right: 0px;
    .el-form-item__content {
      width: calc(100% - 120px);
      .el-input__inner,
      .el-select {
        width: 100% !important;
      }
    }
  }
}
</style>
