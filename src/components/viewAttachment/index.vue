<template>
<!--
    查看附件
  用此页面 
  1、拆表-回填 
  2、换表-回填-->

  <div class=" viewAttachment">
    
    <el-table stripe border :data="attachmentData" center>
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

        <!-- <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>-->
        <el-table-column property="accessoryName" label="文件名"></el-table-column>
        <el-table-column class="cell" label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default {
  name: " viewAttachment",
  props: ["viewAttaParams"],
  data() {
    return {
      // 表格数据
      attachmentData: [],
    };
  },
  mounted() {
      this.init()
  },
  methods: {
    // 初始化
    init() {
      let params = {
        busicode: "ReceiptAccessoryList",
        data: this.viewAttaParams
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.attachmentData = res
      })
    },
    // 查看附件弹出框下载按钮
    download(row) {
      window.open(row.accessoryMetadata.accessoryPath);
    },
    indexMethod(index) {
      //获取表格序号
      return  (index + 1)
      
    },
  }
};
</script>

<style lang="scss">
.viewAttachment {
  padding: 10px;
} 
</style>