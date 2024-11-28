<template>
  <div class="Approval">
    <el-form :inline="true" :model="formData" class="formBill" label-width="130px">

      <commonPart :parentToChild="'3'"></commonPart>
      <el-form-item label="单据编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.billNo" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="单据日期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model="formData.billDate" placeholder=""></el-input>
      </el-form-item>
      <legend class="legendColumn">校验信息</legend>

      <el-form-item label="水表口径：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.meterBoreName" :disabled="true" class="read-only" placeholder="-"></el-input>
      </el-form-item>

      <el-form-item label="水表厂家：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.meterFactoryName" :disabled="true" class="read-only" placeholder="-"></el-input>
      </el-form-item>

      <el-form-item label="水表型号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.meterModelName" :disabled="true" class="read-only" placeholder="-"></el-input>
      </el-form-item>

      <el-form-item label="总表数：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.stroageCount" :disabled="true" class="read-only" placeholder="-"></el-input>
      </el-form-item>

      <el-form-item label="已校核数：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="formData.checkAmount" :disabled="true" class="read-only" placeholder="-"></el-input>
      </el-form-item>

      <legend class="legendColumn">校核信息</legend>

      <div class="kl-table">
        <el-table stripe border :data="tableData" class="Warehousing-table">

          <el-table-column prop="factoryNo" min-width="120" label="水表表身号" show-overflow-tooltip>
          </el-table-column>

        </el-table>
        <div class="factoryNo">
          <el-label>水表表身号：</el-label>
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="factoryNo" ref="factoryNoCheck" @keyup.enter.native="toCheck"></el-input>
        </div>

      </div>
      <!--legend class="legendColumn">流程处理</legend>
      <procedure></procedure-->
    </el-form>
  </div>
</template>
<script>
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"//公告模块
import uploadFile from '@/components/uploadPic';//上传附件
import procedure from "@/components/procedure"//流程审核
export default {
  name: "Approval",
  props: ['WarehousingValidatorNeedData'],
  components: {
    uploadFile,
    procedure,
    commonPart,
  },
  data() {
    return {
      // 初始化数据
      formData: {},
      // 出厂列表编号数据
      tableData: [],




      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: '',
      tableEdit: true,
      factoryNo: "",
    }
  },
  mounted() {
    this.init()
    // 使输入框默认获取焦点
    this.$refs.factoryNoCheck.focus()
  },
  methods: {
    // 初始化
    init() {
      let _this = this;
      let params = {
        busicode: "MsStorageList",
        data: {
          id: this.WarehousingValidatorNeedData.id
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.formData = res.list[0]
      })
    },
    toCheck() {
      let _this = this;
      let params = {
        busicode: "MeterCheck",
        data: _this.factoryNo
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.formData.checkAmount = res
        _this.$message({
          message: '水表表身号（' + _this.factoryNo + '）校验成功！',
          type: 'success',
          center: true,
        });
        // 若 > 5，则删除最后一个元素
        if (_this.tableData.length >= 5) {
          _this.tableData.pop()
        }
        // 数组前面添加元素
        _this.tableData.unshift({factoryNo: _this.factoryNo})
        _this.factoryNo = ''
        // 使输入框默认获取焦点
        _this.$refs.factoryNoCheck.focus()
      }).catch(err => {
        _this.$refs.factoryNoCheck.focus()
        // _this.$message({
        //   message: '水表表身号：' + _this.factoryNo + '校验失败！',
        //   type: 'warning',
        //   center: true,
        // });
      })
    },








    indexMethod(index) {//获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1);

    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      // this.tableQuery.page = val
      this.init()
    },
    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.histroyData.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    add() {
      this.histroyData.list.push({})
    },
    downFile() {

    },
    uploading() {

    }
  }
}
</script>
<style lang="scss">
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.Approval {
  height: 100%;
  overflow-y: auto;
  .kl-table {
    zoom: 1;
    &:after {
      @include _clearBoth();
    }
    .factoryNo {
      float: right;
      width: 40%;
      .el-input {
        display: inline-block;
        width: calc(100% - 70px);
      }
    }
    .el-table {
      float: left;
      width: 40%;
    }
  }
  .el-table__body-wrapper td {
    height: 28px;
    line-height: 28px;
  }
  .el-input__icon {
    line-height: 25px;
  }
}
</style>

