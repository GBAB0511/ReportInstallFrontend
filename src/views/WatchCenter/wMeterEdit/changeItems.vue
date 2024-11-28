<template>
  <div class="changeItems">
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="list">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <!-- <el-table-column prop="billNo" min-width="100" label="单据编号" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column prop="meterNo" min-width="100" label="水表编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" min-width="120" label="变动时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="changeItem" min-width="75" label="变动事项" >
        </el-table-column>
        <el-table-column prop="oldItemValue" min-width="120" label="旧值" >
        </el-table-column>
        <el-table-column prop="newItemValue" min-width="120" label="新值" >
        </el-table-column>
        <!-- <el-table-column prop="receiptType" min-width="100" label="操作类型" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column prop="createName" min-width="100" label="操作员" show-overflow-tooltip>
        </el-table-column>

      </el-table>
      
    </div>
  </div>
</template>
<script>
export default {
  name: "changeItems",
  data() {
    return {
      tableShow: false,
      maxHeight: 0,
      list: [],
    }
  },
  methods: {
    init(id) {
      let params = {
        "busicode": "MsChaHistoryQuery",
        data: {
          changeId: id
        }
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.list = res;
        this.common.changeTable(this, '.CustomerChanges')
      })
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
<style lang="scss" scoped>
.changeItems {
  width: 100%;
  height:100%;
}
</style>
