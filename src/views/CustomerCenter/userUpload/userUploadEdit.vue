<template>
  <div class="ChangeTablesHandle">
    <el-form :model="formData" ref="billForm" class="formBill" 
    :inline="true" :disabled="!NoDisabled" size="mini" label-width="130px">
      <el-form-item  label="客户名称："  class="disable-item">
        <span>{{formData.ctmName}}</span>
      </el-form-item>
      <el-form-item  label="用户编号："  class="disable-item">
        <span>{{formData.userNo}}</span>
      </el-form-item>
      <el-form-item  label="水表编号："  class="disable-item">
        <span>{{formData.meterNo}}</span>
      </el-form-item>
    </el-form>
    <div class="table-index1">
    <legend class="legendColumn">用户附件管理</legend>
    <el-form  ref="billForm" class="formBill" :inline="true" size="mini" label-width="130px">
      <div >
        <div class="kl-table">

          <el-table stripe highlight-current-row border :max-height="maxHeight1" :data="tableData1" ref="klTableData" >
            <el-table-column type="index" label="NO." width="50" fixed="left"></el-table-column>
            <el-table-column prop="accessoryName" min-width="200" label="附件名称" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button type="text"  @click="deleteRow(scope.row)">删除</el-button>
                <span style="color: #409eff; cursor: pointer;" @click="download(scope.row)">下载</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      </el-form>
    </div>
    <div class="table-index2">
      <legend class="legendColumn">水表附件管理</legend>
      <el-form  ref="billForm" class="formBill" :inline="true" size="mini" label-width="130px">
      <div >
        <div class="kl-table">

          <el-table stripe highlight-current-row border :max-height="maxHeight2" :data="tableData2" ref="klTableData" >
            <el-table-column type="index" label="NO." width="50" fixed="left"></el-table-column>
            <el-table-column prop="accessoryName" min-width="200" label="附件名称" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button type="text"  @click="deleteRow(scope.row)">删除</el-button>
                <span style="color: #409eff; cursor: pointer;" @click="download(scope.row)">下载</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      </el-form>
      </div>
    </div>
    
</template>
<script>
export default {
  name: "userUploadEdit",
  components: {

  },
  props: ["formData"],
  data() {
    return {
      uploadIcon: "el-icon-minus",
      receiptType: "USER_UPLOAD",

      // 列表数据
      tableData1: [], //用户附件
      tableData2: [],//水表附件

      tableShow: false,
      maxHeight1: 100,
      maxHeight2:100,
    };
  },
  mounted() {
     this.initByUserNo(); 
     this.initByMeterNo();
  },
  methods: {
    initByUserNo(){
      let _this = this;
      let params = {
        busicode: "AccessoryAboutUserList",
        data: {
          userNo: this.formData.userNo
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData1 = res;
           this.maxHeight1 = $('.table-index1').outerHeight()  - 80
        });
    },
    initByMeterNo(){
      let _this = this;
      let params = {
        busicode: "AccessoryAboutUserList",
        data: {
          meterNo: this.formData.meterNo
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData2 = res;
           this.maxHeight2 = $('.table-index2').outerHeight()  - 80
        });
    },
    download(row){
      window.open(row.accessoryMetadata.accessoryPath);
    },
    deleteRow(row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            busicode: "AccessoryDelete",
            data: row.id
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
                this.initByUserNo();
            });
        }).catch(e => {
          console.error(e)
          this.$message({
            message: "取消删除！",
            type: "info"
          });
        })
    },
    //上传附件
    uploadAttachment(file) {
      let _this = this;
      //console.log(file)
      // const isJPG = file.file.type === 'image/jpg';
      // const isPNG = file.file.type === 'image/png';
      // if (!isJPG&&!isPNG) {
      //   this.$message.error('上传图片的格式只能是 JPG或PNG 格式!');
      //   return
      // }
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.formData.userNo,
          userNo:this.formData.userNo,
          ctmNo:this.formData.ctmNo,
          receiptType: "USER_UPLOAD",
          accessoryNo: "000",
          file: file.file
        },
        //token: "krrjdev123", //
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });
          _this.initByUserNo();
        });
    },
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChangeTablesHandle {
  height: 100%;
  width:100%;
  .formBill{
    .el-form-item__label{
      width: 130px;
    }
  }
  .select-btn {
    float: right;
    margin-bottom: 0.2rem;
  }
   .table-index1, .table-index2 {
    height: calc(50% - 40px);
    .kl-table {
      height: calc(100% - 60px);
    }
  }
  
}

</style>
