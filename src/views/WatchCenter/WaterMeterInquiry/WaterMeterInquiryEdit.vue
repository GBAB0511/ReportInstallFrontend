<template>
  <div class="WaterMeterInquiryEdit">

    <el-form size="mini" class="formBill" :inline="true" :model="formData" label-width="130px" ref="ruleForm" :rules="rules">
      <!-- 水表基本信息 -->
      <meterBasicInfo  ref="meterBasicInfo" :wayOpen="wayOpen" :editType="0" pageType="WaterMeterInquiryEdit"></meterBasicInfo>

      <legend class="legendColumn">操作历史</legend>

      <div class="kl-table">
        <el-table  stripe border :data="tableData.list" class="WaterMeterInquiryEditTable">

          <el-table-column type="index" label="NO." width="50" fixed="left">
          </el-table-column>

          <el-table-column prop="operateTypeName" min-width="100" label="操作类型">
          </el-table-column>

          <el-table-column prop="operateTime" min-width="100" label="操作日期">
          </el-table-column>

          <el-table-column prop="operateStaff" min-width="100" label="操作人">
          </el-table-column>

          <el-table-column prop="createTime" min-width="100" label="建立时间">
          </el-table-column>

          <el-table-column prop="createName" min-width="120" label="建立人">
          </el-table-column>

        </el-table>
      </div>

    </el-form>
  </div>
</template>
<script>
import meterBasicInfo from "@/views/publicModule/infmtnManagement/meterBasicInfo";//水表信息
export default {
  name: "WaterMeterInquiryEdit",
  components: {
    meterBasicInfo,
  },
  props: ['editNeedData'],
  data() {
    return {
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      formData: {},
      rules: {},
      wayOpen:"inquiry",
    };
  },
  mounted() {
    this.getFormData()
    this.getTableData()
  },
  methods: {
    // 上半部数据
    getFormData() {
      this.$api.fetch({ 
        params: { busicode: "MsInfoList", data: {  meterNo: this.editNeedData.meterNo }}, 
      })
      .then(res => {
        this.$refs.meterBasicInfo.init(res.list[0])
      })
      // // 水表型号查出的信息
      // this.$api.fetch({ 
      //   params: { busicode: "MeterModelQuery", data: {  id: this.editNeedData.meterModel }}, 
      // })
      // .then(res => {
      //   this.$refs.meterBasicInfo.getWaterMeterInquiryData(res)
      // })
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
          receiptId: this.editNeedData.meterNo,
          meterNo:this.editNeedData.meterNo,
          receiptType: "MS_INFO",
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
          _this.$parent.attachmentQty+=1
        });
    },
    // 下半部列表数据
    getTableData() {
      this.$api.fetch({ 
        params: { busicode: "MsInfoHistoryList", data: {  meterNo: this.editNeedData.meterNo }},
      })
      .then(res => {
        this.tableData = res
      })
    },
    // 列表的NO列
    indexMethod(index) {
      return  (index + 1) ;
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
.WaterMeterInquiryEdit {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
