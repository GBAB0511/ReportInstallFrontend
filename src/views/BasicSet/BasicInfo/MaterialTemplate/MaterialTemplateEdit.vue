<template>
    <div class="MaterialTemplateEdit">
        <div  class="toolbar">
            <div class="info">
                <div class="toolbar-line"></div>模板信息
            </div>
        </div>
        <el-form :inline="true" class="formBill-Two" size="mini" ref="MaterialTemplateEditForm" :rules="rules" :model="formData" label-width="100px">
            <el-form-item label="模板名称：" prop="templateName">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.templateName" maxlength="50" clearable  placeholder="请输入模板名称"></el-input>
            </el-form-item>
            <el-form-item label="材料数量：" prop="matrNum">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" disabled v-model.number="formData.matrNum" maxlength="10" clearable >
                </el-input>
            </el-form-item>
            <el-form-item label="排序号：" prop="sortNo">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model.number="formData.sortNo" maxlength="6" clearable
                    placeholder="请输入排序号">
                </el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-select v-model="formData.status" placeholder="请选择状态" clearable>
                <el-option label="启用" :value="1"></el-option>
                <el-option label="停用" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="formData.comments" show-word-limit maxlength="150" clearable
                        placeholder="请输入备注"
                        type="textarea">
                </el-input>
            </el-form-item>
        </el-form>
        <div  class="toolbar" style="clear: both;height: 50px;">
            <div style="float: left;" class="info">
                <div class="toolbar-line"></div>模板明细信息
            </div>
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="MaterialList" style="float: right;">添加明细</el-button>
        </div>
        <el-table  stripe border :data="formData.useMatrTemplateList" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50">
            </el-table-column>
            <el-table-column prop="matrNo" min-width="100" label="材料编号">
            </el-table-column>
            <el-table-column prop="matrName" min-width="100" label="材料名称">
            </el-table-column>
            <el-table-column prop="matrMode" min-width="100" label="材料规格">
            </el-table-column>
            <el-table-column prop="matrNum" min-width="100" label="材料数量">
                <template slot-scope="scope">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="number" v-model="scope.row.matrNum" @change="getTotleMatrNum" placeholder="请输入材料数量">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="matrUnit" min-width="100" label="材料单位">
            </el-table-column>
            <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                    <el-button type="text" @click.native="deleteRow(scope.$index, scope.row)" style="font-size:12px;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>  
</template>
<script>
export default {
  name: "MaterialTemplateEdit",
  data() {
    return {
      formData: {
        id: "",
        templateName: "",
        matrNum: "",
        status: "",
        sortNo: "",
        tenantId: "",
        comments: "",
        useMatrTemplateList: []
      },
      useMatrTemplateList: [],
      rules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ],
        matrNum: [
          { required: true, message: "请输入材料数量", trigger: "blur" },
          { type: "number", message: "材料数量必须为数字值" }
        ],
        sortNo: [
          { required: true, message: "请输入排序号", trigger: "blur" },
          { type: "number", message: "排序号必须为数字值" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        matrNo: [
          { required: true, message: "请输入材料编号", trigger: "blur" }
        ],
        matrName: [
          { required: true, message: "请输入材料名称", trigger: "blur" }
        ],
        matrMode: [
          { required: true, message: "请输入材料规格", trigger: "blur" }
        ],
        matrNum: [
          { required: true, message: "请输入材料数量", trigger: "blur" }
        ],
        matrUnit: [
          { required: true, message: "请输入材料单位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 删除行·
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.formData.useMatrTemplateList.splice(index, 1);
          this.getTotleMatrNum();
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
    resetForm() {
      this.$refs.MaterialTemplateEditForm.resetFields();
    },
    //保存按钮
    submitForm(type) {

      let _this = this;
      let params = {};
      if (type === "UseMatrTemplateAdd") {
        params = {
          busicode: "UseMatrTemplateAdd",
          data: this.formData
        };
      } else {
        // this.formData.matrCodeBeanList=[],
        params = {
          busicode: "UseMatrTemplateUpdate",
          data: this.formData
        };
      }
      this.$api.fetch({ params: params }).then(res => {
        _this.$message({
          showClose: true,
          message: "保存成功",
          type: "success"
        });
        _this.$parent.init();
        _this.$parent.closeDialog();
      });
    },
    editData(val) {
      this.formData = val;
    },
    getTotleMatrNum() {
      let num = 0;
      this.formData.useMatrTemplateList.forEach(item => {
        if (typeof item.matrNum != "number") {
          item.matrNum = Number(item.matrNum);
        }
        num += item.matrNum;
      });

      this.formData.matrNum = num;
    },
    MaterialList() {
      this.$parent.MaterialList()
    }
  }
};
</script>
<style lang="scss">
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.MaterialTemplateEdit {
  height: calc(100% - 40px);
  width: 100%;
  margin: 0 auto;
  padding-right: 30px;
  padding-bottom: 10px;
  overflow-y: auto;
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
  .el-form-item{
    margin-bottom:30px!important;
  }
  .wuserInfo-table {
    margin-left: 20px;
  }
}
</style>
