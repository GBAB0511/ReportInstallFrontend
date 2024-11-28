<template>
  <div class="BatchOpeningReviewRecordEdit" style="height:100%;overflow-y:auto">
    <div class="toolbar">
    <el-form :inline="true" :model="formData" :disabled="NotDisabled" ref="ruleForm" class="formBill" size="mini" label-width="130px">
      <!-- 单据信息 -->
      <billInfo ref="billInfo"></billInfo>
      <legend class="legendColumn">复核信息</legend>
      <el-form-item label="新用水类型：" class="disable-item">
          <span  >{{formData.newUseWaterType}}</span>
        </el-form-item>
        <el-form-item label="新用水价格：" class="disable-item">
          <span  >{{formData.usePriceVersion}}</span>
        </el-form-item>
        <!--el-form-item label="是否更新年水量：" class="disable-item">
          <span  >{{formData.updateYearWater}}</span>
        </el-form-item-->
    </el-form>
    </div>
    <div class="kl-table">
      <el-form :inline="true" size="mini" :model="tableQuery" class="formBill" label-width="130px">
        <el-form-item label="模糊查询:">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="户号\户名\装表地址" clearable @keydown.enter.native="init"></el-input>
        </el-form-item>
        <el-form-item>
              <el-button class='searchBtn' @click="init" icon="el-icon-search"></el-button>
            </el-form-item>
      </el-form>
        <el-table class="wuserInfo-table"  highlight-current-row stripe border :data="formData.list">

          <el-table-column type="index" label="NO." min-width="50" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingStaffName" min-width="80" label="抄表员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="oldUseWaterType" min-width="120" label="旧用水类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="oldUsePriceVersion" min-width="120" label="旧用水价格" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="costName" min-width="80" label="费用类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="priceJ1" min-width="70" label="单价1" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="priceJ2" min-width="70" label="单价2" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="priceJ3" min-width="70" label="单价3" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="priceJ4" min-width="70" label="单价4" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="priceJ5" min-width="70" label="单价5" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="priceJ6" min-width="70" label="单价6" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="priceJ7" min-width="70" label="单价7" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="priceJ8" min-width="70" label="单价8" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ1" min-width="70" label="水量1" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ2" min-width="70" label="水量2" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ3" min-width="70" label="水量3" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ4" min-width="70" label="水量4" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ5" min-width="70" label="水量5" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ6" min-width="70" label="水量6" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ7" min-width="70" label="水量7" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="waterJ8" min-width="70" label="水量8" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money1" min-width="70" label="金额1" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money2" min-width="70" label="金额2" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money3" min-width="70" label="金额3" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money4" min-width="70" label="金额4" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money5" min-width="70" label="金额5" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money6" min-width="70" label="金额6" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money7" min-width="70" label="金额7" show-overflow-tooltip :formatter="format" align="right"></el-table-column>
        <el-table-column prop="money8" min-width="70" label="金额8" show-overflow-tooltip :formatter="format" align="right"></el-table-column>

        </el-table>

      </div>
    <legend class="legendColumn">流程处理</legend>
    <div id="workflowDiv"></div>
    </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo";
//import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "BatchOpeningReviewRecordEdit",
  components: {
    //uploadFile,
    billInfo,
  },
  props: ['editNeedData'],
  data() {
    return {
      //表单是否可以修改
      NotDisabled: false,
       maxHeight: 0,
       tableShow: false,
      // 是否需要保存
      approveFlag: 0,
      formData: {
        detail:{},
        list:[],
      },


      // 分页数据
      tableQuery:{
        fuzzyQuery:'',
        page:1,
        pageCount:20,
      },
    };
  },
  mounted() {
    if(this.editNeedData.id){
      this.init()
    }
  },
  methods: {
    init(){
      let _this = this;
      let params = {
        busicode: "MrOpenAccountReviewRecordDetail",
        data: {id:this.editNeedData.id,fuzzyQuery:this.tableQuery.fuzzyQuery}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
     
        _this.formData = res.detail
        _this.formData.list = res.list

        _this.getBillData(res.detail)
         _this.getHtmlData();
        
       this.common.changeTable(this, ".BatchOpeningReviewRecordEdit", [
          ".BatchOpeningReviewRecordEdit .toolbar",
        ]);
      })
      
    },
    format(row, column, cellValue, index){
      if(cellValue>0){
        return Number(cellValue)
      }
      return ''
    },
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.getMsStorageQuery();
    },
    handleCurrentChange(val) {  //页码点击
      this.tableQuery.page = val;
      this.getMsStorageQuery();
    },
    getFormbData(){
      
      return {formVariables:{}};
    },
    getBillData(res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },
    // 获取审批流前端代码
    getHtmlData() {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "bill_review_open_account",
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
          if (window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        1, // 等于0时，先保存后提交 等于1时，直接提交
        ''
      );
    },
    
    indexMethod(index) {
      //获取表格序号
      return ( index + 1 );
    },
  },
};
</script>
<style lang="scss" scoped>
  
</style>

