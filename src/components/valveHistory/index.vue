<template>
  <!-- 
  选择用户
  用此页面
-->
  <div class="ValveHistory">
          <!-- 弹出表单操作历史 -->

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border center :data="tableData.list" class="change-tables-table">


  
        <el-table-column type="index" label="序号" width="50" :index="indexMethod">
        </el-table-column>

      <el-table-column prop="sponsor" min-width="80" label="转办发起人">
        </el-table-column>
        
        <el-table-column prop="mandatary" min-width="80" label="转办受理人">
        </el-table-column>

        <el-table-column prop="createTime" min-width="100" label="转办发起时间">
        </el-table-column>

      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>

export default {
  name: "ValveHistory",
  components:{

  },
  props: ["editNeedId"],
  data() {
    return {
      // 查询条件数据
      tableQuery: {
        "page": 1,
        "pageCount": 20,
        "detailId": this.editNeedId
      },
      //操作历史
      payInfoVisible: false,
      WaterUseOverTheYearsData: {
        "userNo": ""
      },
       payInfoName: "操作历史",
      // 表格数据
      tableData: [],
      // 列表勾选数据
      selectData: [],
      tableShow: false,
      maxHeight: 0,
      isActive: false,
    };
  },
  mounted() {
    this.init()
    this.common.changeTable(this, ".ValveHistory", [
      ".ValveHistory .toolbar",
      ".ValveHistory .block",
      ".ValveHistory #crumbs"
    ]);
  },
  methods: {
    // 初始化
    init() {
      // let _this = this
     let params = {
        busicode: "ValveHistory",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res
      })

    },
    closeDialog1(){
       this.payInfoVisible = false
    },
    // 列表数据勾选禁用
    // selectTable(row, index){
      
    //   if (this.disabledData != undefined && this.disabledData.length > 0) {
    //     for (let i = 0; i < this.disabledData.length; i++) {
    //       if (row.id == this.disabledData[i].id) {
    //         return false
    //       }else if (row.id != this.disabledData[i].id && i == (this.disabledData.length - 1)) {
    //         return true
    //       }
    //     }
    //   }else {
    //     return true
    //   }
    // },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        $(".el-table--fit").css("height", "66%");
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
        $(".el-table--fit").css("height", "50%");
      }
      this.$nextTick(() => {
        this.common.changeTable(this, ".ValveHistory", [
          ".ValveHistory .toolbar",
          ".ValveHistory .block",
          ".ValveHistory #crumbs"
        ]);
      })
    },
    closeDialog() {
      //关闭会话
      this.waterChoooseVisible = false;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)

    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
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
.ValveHistory {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>