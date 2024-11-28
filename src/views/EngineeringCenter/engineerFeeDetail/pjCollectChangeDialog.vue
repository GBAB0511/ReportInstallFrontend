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
          <!-- 收款<span style="color:#F56C6C;">{{data.money}}元</span> -->
          收款<el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="data.money"></el-input>元
        </div>

      </div>

      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" @click="pjClSave"
          >确 定</el-button
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
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        pjClSave() {
      let params = {
        busicode: "PjCollectionUpdate",
        data: { id :this.data.id, money:this.data.money }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "变更金额成功！"
          });
          this.isPjCollectShow = false;
          this.$emit('success');
        });
    },
    closePjClDialog() {
      this.isPjCollectShow = false;
    },
    pjCollectChangeShow() {
      this.isPjCollectShow = true;
    },

  }
};
</script>

<style lang="scss" scoped>

/deep/ .el-input{
  width: 120px;
}
/deep/ .el-input__inner {
	width: 100%;
  font-size: 25px;
	border-top-width: 0px;
	border-left-width: 0px;
	border-right-width: 0px;
	border-bottom-width: 1px;
  border-radius:0px;
	/*outline: medium;*/
  color:rgb(245,108,108)
}
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
