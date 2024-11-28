

<template>

  <div class="BookInfoChangeItem">
    <div class="toolbar">
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" highlight-current-row stripe border :data="tableData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="createTime" min-width="120" label="变动时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="changeItem" min-width="75" label="变动事项" >
        </el-table-column>
        <el-table-column prop="oldItemValue" min-width="120" label="旧值" >
        </el-table-column>
        <el-table-column prop="newItemValue" min-width="120" label="新值" >
        </el-table-column>
        <el-table-column prop="receiptType" min-width="100" label="操作类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createName" min-width="100" label="操作员" show-overflow-tooltip>
        </el-table-column>

      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
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
  name: "BookInfoChangeItem",
  props:['bookNo'],
  data() {
    return {
      tableQuery: {
        page: 1,
        pageCount: 20,
        receiptId: "",
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
    }
  },
  mounted() {
    this.init();
    //data 里面定义一个maxHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, '.BookInfoChangeItem', ['.BookInfoChangeItem .toolbar', '.BookInfoChangeItem .block'])
  },
  methods: {
    init() {
      let _this = this
      _this.tableQuery.receiptId = this.bookNo;
      let params = {
        "busicode": "BaseBookChangeList",
        data: _this.tableQuery,
      }
      _this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    indexMethod(index) {//获取表格序号
        return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.BookInfoChangeItem {
  width: 100%;
  height:100%;
}
</style>
