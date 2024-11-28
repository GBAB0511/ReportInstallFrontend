<template>
  <div class="DownloadPage">
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow"  :data="downloadData" stripe border :max-height="maxHeight" style="width:100%">
          <el-table-column prop="accessoryName" label="标题" min-width="300" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="accessoryVersion" label="版本" min-width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="accessorySize" label="文件大小" min-width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime" label="上传时间" min-width="300" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="downloadCount" label="下载次数" min-width="200" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="accessoryPath" label="缩略图" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-popover placement="top-start" trigger="click">
                <a :href="scope.row.accessoryPath" target="_blank" title="查看最大化图片"><img :src="scope.row.accessoryPath" style="width: 300px;height: 300px" /></a>
                <img slot="reference"  :src="scope.row.accessoryPath" style="width: 30px;height: 30px;cursor:pointer" v-if="scope.row.accessoryPath">
              </el-popover>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" fixed="right" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="download(scope.row)">下载</el-button>
              
            </template>
          </el-table-column >
        </el-table>
      </div>
    </div>
</template>

<script>
export default {
  name:"DownloadPage",
  data(){
    return{
      indexShow:true,
      tableShow: false,
      tableQuery: {
        page: 1,
        pageCount: 50,
      },
      maxHeight: 0,
      downloadData:[],
    }
  },
  mounted(){
    this.init()
    this.common.changeTable(this, ".DownloadPage", [
      ".DownloadPage .toolbar",
      ".DownloadPage .block",
      '.DownloadPage .bread-contain'
    ]);
  },
  methods:{
    init(){
      let params = {
        "busicode": "ToolDownloadList",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.downloadData = res.list
        console.log(res);
        this.$nextTick(() => {
          this.common.changeTable(this, ".DownloadPage", [
            ".DownloadPage .toolbar",
            ".DownloadPage .block",
            '.DownloadPage .bread-contain'
          ]);
        })
      }) 
    },
    //下载按钮事件
    download(row){
      console.log(row);
      console.log(row.accessoryPath);
      var params = {
        busicode:"ToolDown",
        type: "downTown",
        data: {
          id:row.id
        },
        token:"0256662c-162a-4cf1-a029-2a4fe2326330",
        sysType:"002"
      };
      let myConfig = {
        method: 'get',
        params: params
      }
      this.$api
        .fetch({
        params: params,
      })
        .then(res => {
        });
        window.open(row.accessoryPath);
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
}
</script>

<style lang="scss">
  .DownloadPage {
  width: 100%;
  height: 100%;
  padding: 10px;
    .el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color:#c0c0c0;
  }
  .el-table--enable-row-hover /deep/.el-table__body tr:hover>td {
    /*更改鼠标悬停时表格高亮色*/
    background-color: #c0c0c0 !important;
}
.kl-table{
    margin-top: 15px;
  }
  }
</style>