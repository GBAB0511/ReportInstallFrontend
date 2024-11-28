<template>
  <div class="ProjectOpinionConfig">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item>
            <el-button size="mini" class='searchBtn' @click="init()" icon="el-icon-search">查询</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData" class="ProjectOpinionConfig-table">

        <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="receiptName" min-width="150" label="单据名称">
        </el-table-column>

        <el-table-column prop="nodeCode" min-width="150" label="节点编号">
        </el-table-column>

        <el-table-column prop="nodeName" min-width="150" label="节点名称">
        </el-table-column>

        <el-table-column prop="comment" min-width="150" label="审批意见">
        </el-table-column>

        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click.native="edit(scope.row)" style="font-size:12px;">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="diaVisible" title="审批意见" width="35%" @close="handelClose" :close-on-click-modal="false">
      <el-form size="mini" :model="formData" :rules="updateRules" class="demo-ruleForm">
        <el-form-item>
          <el-input type="textarea" v-model="formData.comment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handelClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProjectOpinionConfig',
  data () {
    return {
      tableQuery: {
        page: 1,
        pageCount: 20
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '其他配置' },
          { title: '工程审批意见配置' }
        ],
      },
      tableData: [],
      formData: {
        setCode: "",
        processCode: "",
        taskCode: "",
        comment: "",
      },
      maxHeight: 0,
      indexShow: true,
      tableShow: false,
      diaVisible: false,
      updateRules: {
        name: [{ required: true, message: "请填写", trigger: "blur" }],
      }
    }
  },
  mounted () {
    this.init();
    this.$nextTick(() => {
      this.common.changeTable(this, '.ProjectOpinionConfig', ['.ProjectOpinionConfig .toolbar', '.ProjectOpinionConfig .block'])
    })
  },
  methods: {
    init () {
        let params = {
          busicode: "ProcessNodeList",
          data: {
            companyNo: localStorage.getItem('companyNo'),
            receiptType: "pj_info_new",
            type: "2"
          }
        };
        this.$api.fetch({ params }).then(res => {
          this.tableData = res;
        })
    },
    edit (row) {
      this.diaVisible = true;
      this.formData.setCode = row.setCode;
      this.formData.taskCode = row.nodeCode;
      this.formData.processCode = row.receiptType;
      this.formData.comment = row.comment;
    },
    confirm () {
      let params = {
        busicode: "ApprovalCommentConfigUpdate",
        data: this.formData
      };
      this.$api.fetch({ params }).then(res => {
        this.$message({
            type: 'success',
            message: '提交成功'
        })
        this.diaVisible = false;
        this.init();
      })
    },
    handelClose () {
      this.diaVisible = false;
      this.formData.setCode = "";
      this.formData.taskCode = "";
      this.formData.processCode = "";
      this.formData.comment = "";
    },
    save () { },
    indexMethod (index) {
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {  //页码点击
      this.tableQuery.page = val;
      this.init();
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>

<style lang="scss">
.ProjectOpinionConfig {
  width: 100%;
  height: calc(100% - 40px);
  .demo-ruleForm /deep/ .el-form-item {
    margin-bottom: 15px !important;
    width: 100%;
  }
  .el-form-item__content .el-input--suffix,
  .el-dialog__body .el-input__inner {
    width: 100% !important;
  }
}
</style>