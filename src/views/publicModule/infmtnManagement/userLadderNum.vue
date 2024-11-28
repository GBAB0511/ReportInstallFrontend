
<template>
  <div class="userLadderNum">
    <div  class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table stripe border :data="tableData.list" class="Warehousing-table" :max-height="maxHeight">
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="name" label="用户姓名">
        </el-table-column>

        <el-table-column prop="certType" label="证件类型">
        </el-table-column>

        <el-table-column prop="certNo" min-width="130" label="证件号码">
        </el-table-column>

        <el-table-column prop="linkTel" label="联系方式">
        </el-table-column>

        <el-table-column prop="comments" min-width="120" label="备注">
        </el-table-column>
        </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableQuery.page"
          :page-sizes="[50, 100, 500, 1000]"
          :page-size="tableQuery.pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        >
        </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "userLadderNum",
  props: ['userNo','wayOpen'],
  data() {
    return {
      tableShow: false,
      maxHeight: 0,
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      tableData:{},
      tableQuery: {
        page: 1,
        pageCount: 50,
        userNo:'',
      },
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.common.changeTable(this, ".userLadderNum", [
        ".userLadderNum .block"
      ]);
    });
  },

  methods: {
    init(){
      let _this=this
      console.log(this.wayOpen);
      
      if(this.wayOpen=='userInfo'){
         _this.tableQuery.userNo=_this.userNo;
        var params = {
          busicode: "UserPersonLadderNum",
          data:_this.tableQuery
        };
        this.$api.fetch({ params })
          .then(res => {
            _this.tableData=res
          })
      }else{
        this.wPopulationInit();
      }
    },
    // 用水人口列表临时详情数据
    wPopulationInit() {
      let _this = this
      _this.tableQuery.userNo=_this.userNo;
      let params = {
        "busicode": "UserPersonTempLadderNum",
        "data":_this.tableQuery
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData=res
      })
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
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
.userLadderNum {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  //padding: 10px 0px;
  //overflow-y: auto;
}
</style>
