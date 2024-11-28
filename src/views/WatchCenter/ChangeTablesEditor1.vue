<template>
  <div class="ChangeTablesEdit">
    <el-form :inline="true" size="mini" :model="formData" class="formBill-Three" label-width="130px">

      <!-- 单据信息 -->
      <billInfo  ref="billInfo"></billInfo>
      <!-- v-if="formStute.billStute!='OtherChageAdd'" -->

      <legend class="legendColumn">拆表信息</legend>

      <el-form-item label="拆表类型：">
        <el-select clearable v-model="formData.replaceType" placeholder="拆表类型" :disabled="!tableEdit">
          <el-option v-for="item in dictionaryData.MRM" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="计划完工日期：">
        <el-date-picker v-model="formData.planFinishDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :disabled="!tableEdit">
        </el-date-picker>
      </el-form-item>

      <el-form-item label='拆表员：'>
        <el-select clearable v-model="formData.replaceStaff" placeholder="请选择" :disabled="!tableEdit">
          <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="拆表原因：" class="f2">
        <el-input type="textarea" :rows="2" v-model="formData.replaceReason" placeholder="拆表原因" :disabled="!tableEdit"></el-input>
      </el-form-item>

      <div class="kl-table">
        <el-table stripe border :data="tableData" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="bookNo" min-width="100" label="册本">
          </el-table-column>

          <el-table-column prop="bookNo" min-width="80" label="用户编号">
          </el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址">
          </el-table-column>

          <el-table-column prop="oldMeterNo" min-width="80" label="水表编号">
          </el-table-column>

          <el-table-column prop="meterForm" min-width="80" label="水表形态">
          </el-table-column>

          <el-table-column prop="oldMeterBore" min-width="80" label="水表口径">
          </el-table-column>

          <el-table-column prop="setupMeterDate" min-width="80" label="装表日期">
          </el-table-column>

          <el-table-column prop="upperNum" min-width="80" label="表读数" show-overflow-tooltip>
          </el-table-column>


          <el-table-column prop="term" min-width="80" label="使用期限">
          </el-table-column>

          <el-table-column prop="usedTerm" min-width="80" label="已用周期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="backfill(scope.$index, scope.row)">查看附件</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <!-- <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="1"
                            :page-sizes="[20, 100, 500, 1000]"
                            :page-size="20"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="histroyData.total">
                        </el-pagination>
                    </div> -->
      </div>
      <legend class="legendColumn">流程处理</legend>
        <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
export default {
  name: "ChangeTablesEdit",
  components: {
    billInfo,
  },
  props: ['ChangeTablesEditor1NeedData'],
  data() {
    return {
      // 详情数据
      formData: {},
      // 数据字典数据
      dictionaryData: {},
      // 列表数据
      tableData: [],
      // 是否可编辑
      tableEdit: true,
      // 拆表员下拉数据
      replaceStaffData: [],
      formData: {},
      NotDisabled: false, //是否可编辑
      approveFlag: 0,//是否可bian
    };
  },
  mounted() {
    this.tableEdit = this.ChangeTablesEditor1NeedData.tableEdit
      this.getFormData()
      this.getTableData()
      this.getDictionary()
      this.getReplaceStaffData()
  },
  methods: {
    getFormbData() {
      
      var _this = this
      var saveData = {
        receiptType: 2,
        id: _this.formData.id,
        // 换表类型
        replaceType: _this.formData.replaceType,
        // 计划完工日期
        planFinishDate: _this.formData.planFinishDate,
        // 拆表员
        replaceStaff: _this.formData.replaceStaff,
        // 拆表原因
        replaceReason: _this.formData.replaceReason,
      }
      return saveData;
    },
    // 详情数据
    getFormData() {
      let _this = this;
      let params = {
        busicode: "MsChgList",
        data: {
          id: _this.ChangeTablesEditor1NeedData.id,
          receiptType: 2
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        // 上半部数据
        _this.formData = res.list[0]
        if (
          this.formData.processState == "approval" ||
          this.formData.processState == "END"
        ) {
          this.NotDisabled = true;
          this.approveFlag = 1;
        }
        this.getHtmlData()
        //单据信息
        this.getBillData(res.list[0]);
      })
    },
    
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "ms_chg_plan",
        "审批流配置:" +
          _this.formData.processStateName +
          "(" +
          _this.formData.billNo +
          ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          _this.$parent.closeDialog(); // 提交后回调方法
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        'MsChgUpdate'
      );
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MRM"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 获取拆表员数据
    getReplaceStaffData() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { "postNo": "5" }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.replaceStaffData = res
      })
    },
    // 获取列表数据
    getTableData(request, data) {
      let _this = this
      var params = {
        "busicode": "MsChgQuery",
        "data": {
          receiptId: this.ChangeTablesEditor1NeedData.id,
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res.list
      })
    },
    // 暂存按钮（添加/修改）
    save() {
      var _this = this
      var saveData = this.getFormbData()
      var params = {
        "busicode": "MsChgUpdate",
        "data": saveData
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$notify({
          title: '成功',
          message: '修改成功！',
          type: 'success'
        });
        _this.$parent.closeDialog()
      })
    },

    closeDialog() {
      //关闭会话
      this.waterChooseVisible = false;
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
    },
    indexMethod(index) {
      return (index + 1)
    },
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.ChangeTablesEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
  .select-btn {
    float: right;
    margin-bottom: 0.2rem;
  }
  .formBill-One,
  .formBill-Two,
  .formBill-Three,
  .formBill .f4 .el-form-item__content {
    width: 100%;
  }
}
</style>
