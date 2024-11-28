<template>
  <div class="batchDelTable">
    <el-table center stripe border v-if="tableShow" :data="batchDelTableData.list" @selection-change="selectChange" :max-height="maxHeight">
      <el-table-column type="selection" min-width="50"></el-table-column>

      <el-table-column align="center" type="index" label="NO." width="80"></el-table-column>

      <!--<el-table-column prop="bookNo" min-width="120" label="册本号"></el-table-column> -->

      <el-table-column prop="userGroupName" min-width="120" label="组名称"></el-table-column>

      <el-table-column prop="num" min-width="120" label="人数"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="batchDelTableData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BatchDelUserGroup',
  data () {
    return {
      batchDelTableData: [],
      selectData: [],
      totalUser: 0,
      maxHeight: 0,
      tableShow: false,
      tableQuery: {
        userGroupNo: "",
        fuzzyQuery: "",
        batchDel: '1',
        page: 1,
        pageCount: 20,
      }
    }
  },
  mounted () {
    this.init();
    this.common.changeTable(this, ".batchDelTable", [
      ".batchDelTable .block",
    ]);
  },
  methods: {
    init () {
      let _this = this;
      let params = {
        busicode: "UserGroupList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.batchDelTableData = res;
          _this.totalUser = res.total
        })
    },
    selectChange (val) {
      this.selectData = val;
      this.$emit('hasSelect', val.length > 0 ? false : true)
    },
    //分页
    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange (val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
}
</script>

<style lang="sass" scoped>
.batchDelTable
    height: 100%

.block
</style>

