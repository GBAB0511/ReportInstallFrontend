<template>
  <div class="userInstallEdit">
    <el-table :data="list" border stripe :max-height="maxHeight">
      <el-table-column label="序号" width="50" type="index"></el-table-column>
      <el-table-column prop="userNo" label="用户编号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="bookNo" label="册本号" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="scope.row.bookNo"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="houseCert" label="房产证号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="meterType" label="水表分类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="meterUse" label="水表用途" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="useWterObject" label="用水对象" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tradeClassify" label="行业分类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="useWaterType" label="用水类型" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="inflate" label="是否加压" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="meterNo" label="水表编号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="setupMeterAddr" label="装表地址" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="setupMeterDate" label="装表日期" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      maxHeight: 0
    }
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init(ids) {
      var _this = this
      var params = {
        "busicode": "PjInstallUserList",
        "data":{ arrbillNo: ids }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.list= res
        this.$nextTick(() => {
          this.common.changeTable(this, ".userInstallEdit", []);
        })
      })
    },
    submit() {
      const params = {
        "busicode": "PjInstallUserSave",
        "data": this.list
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        this.$emit('success')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.userInstallEdit {
  height: 100%;
  width: 100%;
  padding: 10px 10px 10px;
}
</style>