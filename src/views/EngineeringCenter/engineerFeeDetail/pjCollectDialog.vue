<template>
  <div class="projectProceeds">
    <!-- 工程收款 -->
    <el-dialog
      title="工程收款"
      :visible.sync="isPjCollectShow"
      :modal="false"
      @close="closePjClDialog"
       width="20%" 
    >
      <div id="text-box">
        <div >
          收款<span style="color:#F56C6C;">{{data.money}}元</span>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" @click="pjClSave"
          >收 款</el-button
        >
        <el-button type="info" size="mini" plain @click="closePjClDialog"
          >关 闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {

      isPjCollectShow: false,
    };
  },
  methods: {
        pjClSave() {
      let params = {
        busicode: "PjCollectionUpdate",
        data: { id :this.data.id, status:this.data.status }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "收款成功"
          });
          this.isPjCollectShow = false;
          this.$emit('success');
        });
    },
    closePjClDialog() {
      this.isPjCollectShow = false;
    },
    pjCollectShow() {
      this.isPjCollectShow = true;
    },

  }
};
</script>

<style lang="scss" scoped>
.projectProceeds {
    #text-box {
    padding: 50px 0px;
    font-size: 30px;
 & > div{
  text-align: center;
  }
  }
}
</style>
