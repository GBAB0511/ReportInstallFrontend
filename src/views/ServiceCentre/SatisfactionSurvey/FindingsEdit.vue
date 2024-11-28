<template>
  <div class="FindingsEdit">
    <div class="kl-table">
      <el-table stripe border :data="histroyData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50">
        </el-table-column>

        <el-table-column prop="questionCon" min-width="400" label="主题">

        </el-table-column>

        <el-table-column prop="lvalue" min-width="100" label="评分111">
        </el-table-column>

      </el-table>

    </div>
    <label>其他评价：</label>
    <el-input type="textarea" :rows="4" v-model="OtherEvaluations" />
  </div>
</template>
<script>
export default {
  name: "FindingsEdit",
  data() {
    return {
      OtherEvaluations: "",
      histroyData: {
      }
    };
  },
  methods:{
    init(){
      
    },
  }
};
</script>
<style lang="scss">
.FindingsEdit {
  padding-top: 15px;
  label {
    padding-left: 20px;
  }
  .el-textarea {
    width: 60%;
    margin-top: 20px;
    vertical-align: middle;
  }
}
</style>
