<template>
  <div class="ChangeTablesEdit">

    <!-- 弹出表单选择水表 -->
    <el-dialog :title="WaterEditorName" :visible.sync="waterChooseVisible" :close-on-click-modal="false" class="button-dialog" @close="closeDialogSelectWater">
      <SelectWaterTable ref="SelectWaterTable"></SelectWaterTable>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="fixDialogSelectWater">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialogSelectWater">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 水表编辑/详情页面 -->
    <el-form class="formBill" :inline="true" size="mini" :model="formData" label-width="130px">

      <!-- <commonPart :parentToChild="'3'"></commonPart> -->
      <legend class="legendColumn">换表信息</legend>
      <el-form-item label="换表类型：">
        <el-select clearable v-model="formData.replaceType" placeholder="换表类型" :disabled="!tableEdit">
          <el-option v-for="item in dictionaryData.MCM" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="计划完工日期：">
        <el-date-picker v-model="formData.planFinishDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :disabled="!tableEdit">
        </el-date-picker>
      </el-form-item>

      <el-form-item label='换表员：'>
        <el-select clearable v-model="formData.replaceStaff" placeholder="请选择" :disabled="!tableEdit">
          <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="换表原因：" class="Remarks">
        <el-input type="textarea" :rows="2" v-model="formData.replaceReason" placeholder="换表原因" :disabled="!tableEdit"></el-input>
      </el-form-item>

      <div class="kl-table">
        <el-button size="mini" type="primary" @click="chooseWaterMeter" class="select-btn" v-if="tableEdit">选择水表</el-button>
        <el-table  highlight-current-row stripe border :data="tableData.list">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="bookNo" min-width="100" label="册本">
          </el-table-column>

          <el-table-column prop="userNo" min-width="80" label="用户编号">
          </el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="80" label="装表地址">
          </el-table-column>

          <el-table-column prop="oldMeterNo" min-width="80" label="水表编号">
          </el-table-column>

          <el-table-column prop="meterForm" min-width="80" label="新旧表">
          </el-table-column>

          <el-table-column prop="oldMeterBore" min-width="80" label="水表口径">
          </el-table-column>

          <el-table-column prop="setupMeterDate" min-width="80" label="装表日期">
          </el-table-column>

          <el-table-column prop="upperNum" min-width="120" label="表读数" show-overflow-tooltip>
          </el-table-column>

          <!-- <el-table-column prop="upperNum" min-width="100" label="累计流量" show-overflow-tooltip>
          </el-table-column> -->

          <el-table-column prop="term" min-width="80" label="使用期限">
          </el-table-column>

          <el-table-column prop="usedTerm" min-width="80" label="已用周期" show-overflow-tooltip>
          </el-table-column>

        </el-table>
      </div>
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>

    </el-form>
  </div>
</template>
<script>
import SelectWaterTable from "@/components/SelectWaterTable";//选择水表
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //流程审核
export default {
  name: "ChangeTablesEdit",
  components: {
    uploadFile,
    procedure,
    SelectWaterTable,//选择水表
    commonPart
  },
  props: ['ChangeTablesEditNeedData'],
  data() {
    return {
      // 详情数据
      formData: {},
      // 数据字典数据
      dictionaryData: {},
      // 列表数据
      tableData: {
        pageSize: 20,
        pages: 1,
        list: [],
      },
      parentToChild:'0',
      // 是否可编辑
      tableEdit: true,
      // 换表员下拉数据
      replaceStaffData: [],

      waterChooseVisible: false,
      WaterEditorName: "水表选择"
    };
  },
  mounted() {
    this.tableEdit = this.ChangeTablesEditNeedData.tableEdit
    // 详情按钮进来才获取数据
    if (this.ChangeTablesEditNeedData.content == 'details') {
      this.init()
      
    }else if(this.ChangeTablesEditNeedData.content == 'add'){
      this.getHtmlData();
    }
    this.getDictionary()
    this.getReplaceStaffData()
    // 获取选择水表页面传来的勾选数据
    eventBus.$on('selectData', (selectData) => {
      this.getTableData('meterNos', selectData)
    })
  },
  methods: {
    // 初始化
    init() {
      this.getFormData();
    },
    // 详情数据
    getFormData() {
      let _this = this;
      let params = {
        busicode: "MsChgList",
        data: {
          id: _this.ChangeTablesEditNeedData.id,
          receiptType: 1
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        // 上半部数据
        _this.formData = res.list[0]
        // 下半部列表数据
        _this.getTableData('receiptId', res.list[0].id);
        _this.getHtmlData();
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MCM"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res;
      })
    },
    // 选择水表按钮
    chooseWaterMeter() {
      this.waterChooseVisible = true;
    },
    // 选择水表弹出框取消按钮
    closeDialogSelectWater() {
      this.waterChooseVisible = false;
    },
    // 选择水表弹出框确定按钮
    fixDialogSelectWater() {
      this.$refs.SelectWaterTable.getSelectDataForBiaoWu();
      this.waterChooseVisible = false;
    },
    // 获取列表数据
    getTableData(request, data) {
      let _this = this
      var params = {
        "busicode": "MsChgSelectList",
        "data": {
          receiptType: 1
        }
      }
      // 详情数据传id，查询数据传数组
      if (request == 'meterNos') {
        params.data.meterNos = data;
      } else if (request == 'receiptId') {
        params.data.receiptId = data;
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        if (request == 'meterNos') {
          for (let i = 0; i < res.list.length; i++) {
            _this.tableData.list.push(res.list[i])
          }
        } else if (request == 'receiptId') {
          _this.tableData = res
        }
      })
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      console.log(_this.formData.id);
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "MS_CHG_PLAN",
        "审批流配置:" + _this.formData.processName + "(" + _this.formData.billNo + ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          _this.$parent.closeDialog() // 提交后回调方法
        },
        _this.ChangeTablesEditNeedData.approveFlag, // 不等于1时，先保存后提交
        _this.ChangeTablesEditNeedData.subBusicode, // 不等于1时，先保存后提交
      );
    },
    // 流程所需数据
    getFormbData(){
      var _this = this
      var saveData = {
        receiptType: 1,
        // 换表类型
        replaceType: _this.formData.replaceType,
        // 计划完工日期
        planFinishDate: _this.formData.planFinishDate,
        // 换表员
        replaceStaff: _this.formData.replaceStaff,
        // 换表原因
        replaceReason: _this.formData.replaceReason,
        // 下半部列表数据
        "msChgPlanDetails": []
      }
      // 整理msChgPlanDetails列表入参
      for (let i = 0; i < _this.tableData.list.length; i++) {
        saveData.msChgPlanDetails.push({
          // 用户编号
          ctmNo: _this.tableData.list[i].ctmNo,
          // 水表编号
          oldMeterNo: _this.tableData.list[i].oldMeterNo,
          // 水表口径
          oldMeterBore: _this.tableData.list[i].oldMeterBore,
          // 表读数
          upperNum: _this.tableData.list[i].upperNum,
        })
      }
      if (this.ChangeTablesEditNeedData.content == 'details') {
        saveData.id = _this.formData.id
      }
      console.log(_this.formData);
      return saveData
    },
    // 暂存按钮（添加/修改）
    save(type) {
      var _this = this
      var saveData = {
        receiptType: 1,
        // 换表类型
        replaceType: _this.formData.replaceType,
        // 计划完工日期
        planFinishDate: _this.formData.planFinishDate,
        // 换表员
        replaceStaff: _this.formData.replaceStaff,
        // 换表原因
        replaceReason: _this.formData.replaceReason,
        // 下半部列表数据
        "msChgPlanDetails": []
      }
      // 整理msChgPlanDetails列表入参
      for (let i = 0; i < _this.tableData.list.length; i++) {
        saveData.msChgPlanDetails.push({
          // 用户编号
          ctmNo: _this.tableData.list[i].ctmNo,
          // 水表编号
          oldMeterNo: _this.tableData.list[i].oldMeterNo,
          // 水表口径
          oldMeterBore: _this.tableData.list[i].oldMeterBore,
          // 表读数
          upperNum: _this.tableData.list[i].upperNum,
        })
      }
      if (type == 'update') {
        saveData.id = _this.formData.id
      }

      var params = {
        "busicode": "",
        "data": saveData
      }
      if (type == 'add') {// 添加-暂存
        params.busicode = 'MsChgAdd'
      } else if (type == 'update') {// 修改-暂存
        params.busicode = 'MsChgUpdate'
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$notify({
          title: '成功',
          message: params.busicode == 'MsChgAdd' ? '添加成功！' : '修改成功！',
          type: 'success'
        });
        _this.$parent.closeDialog()
      })
    },
    // 获取换表员数据
    getReplaceStaffData() {
      let _this = this
      let params = {
        busicode: "PostUserSelect",
        data: { "postNo": "4" }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.replaceStaffData = res
      })
    },
    closeDialog() {
      //关闭会话
      this.waterChoooseVisible = false;
      this.waterChooseVisible = false;
      this.init();
    },

    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (
        (this.tableData.pages - 1) * this.tableData.pageSize + (index + 1)
      );
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    }
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
}
</style>
