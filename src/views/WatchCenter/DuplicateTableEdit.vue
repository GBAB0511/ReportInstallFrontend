<template>
  <div class="DuplicateTableEdit">
    <el-form size="mini" :inline="true" :model="formData" class="formBill" label-width="130px">

      <commonPart :parentToChild="'3'"></commonPart>

      <legend class="legendColumn">复表信息</legend>

      <el-form-item label="水表编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.meterNo" placeholder="水表编号" :disabled="!tableEdit"></el-input>
      </el-form-item>

      <el-form-item label="复表日期：">
        <el-date-picker v-model="formData.reuseDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :disabled="!tableEdit">
        </el-date-picker>
      </el-form-item>

      <el-form-item label='复表员：'>
        <el-select clearable v-model="formData.reuseStaff" placeholder="请选择" :class="{ready_only:tableEdit}" :readonly='tableEdit'>
          <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="复表起码：">
        <el-tooltip class="item" effect="dark" content="请上传底码照片" placement="top-start">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.newMeterNum" :disabled="tableEdit" placeholder="">
            <el-button slot="append" icon="el-icon-upload2" type="primary" class="scanning-btn" @click="idCard()" size='mini'></el-button>
          </el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="备注：" class="f2">
        <el-input type="textarea" :rows="2" v-model="formData.comments" placeholder="备注" :disabled="!tableEdit"></el-input>
      </el-form-item>

      <legend class="legendColumn">流程处理</legend>
      <procedure></procedure>
    </el-form>
  </div>
</template>
<script>
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"//公告模块
import uploadFile from '@/components/uploadPic';//上传附件
import procedure from "@/components/procedure"//流程审核
export default {
  name: "DuplicateTableEdit",
  components: {
    uploadFile,
    procedure,
    commonPart,
  },
  props: ['DuplicateTableEditNeedData'],
  data() {
    return {
      // 是否可编辑
      tableEdit: true,
      // 复表员下拉数据
      replaceStaffData: [],



      formData: {

        backfillInput: [

          {
            label: "水表编号：",
            value: "",
            tips: ""
          },
          {
            label: "复表日期：",
            value: "",
            tips: ""
          },
          {
            label: "复表员：",
            value: "",
            tips: ""
          },

        ],
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: '',
    }
  },
  mounted() {
    this.tableEdit = this.DuplicateTableEditNeedData.tableEdit
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getFormData()
      this.getReplaceStaffData()
    },
    // 获取表单数据
    getFormData(){
      let _this = this
      let params = {
        busicode: "MsReuseList",
        data: {
          id: _this.DuplicateTableEditNeedData.id
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.formData = res.list[0]
      })
    },
    // 获取复表员数据
    getReplaceStaffData() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { "postNo": "6" }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.replaceStaffData = res
      })
    },
    // 暂存按钮（添加/修改）
    save() {
      var _this = this

      var params = {
        "busicode": "MsReuseBackfill",
        "data": {
          id: _this.formData.id,
          // 水表编号
          meterNo: _this.formData.meterNo,
          // 复表日期
          reuseDate: _this.formData.reuseDate,
          // 复表员value
          reuseStaff: _this.formData.reuseStaff,
          // 复表起码
          newMeterNum: _this.formData.newMeterNum,
          // 备注
          comments: _this.formData.comments,
        }
      }
      // 复表员name
      for (let i = 0; i < _this.replaceStaffData.length; i++) {
        if (_this.replaceStaffData[i].userAccount == _this.formData.reuseStaff) {
          params.data.reuseStaffName = _this.replaceStaffData[i].userName
        }
        
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
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.DuplicateTableEdit {
  height: calc(100% - 41px);
  overflow-y: auto;
}
</style>

