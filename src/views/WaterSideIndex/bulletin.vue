
<template>
  <div class="bulletin">
    <!-- 主列表页 -->
    <div class="kl-table">
      <el-table class="dataTable" border stripe :data="tableData.list">
        <el-table-column min-width="45" type="index" :index="indexMethod" fixed="left" label="No."></el-table-column>
        <el-table-column  prop="messageTitle" min-width="150" label="通知标题">
           <template slot-scope="scope">
              <div @click="getMoreMsg(scope.row)" class="messageTitle">{{scope.row.messageTitle}}</div>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="messageType" min-width="80" label="消息类型"></el-table-column>
        <el-table-column prop="releaseContent" min-width label="发布内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" min-width label="描述" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="createName" min-width="80" label="创建人"></el-table-column>
        <el-table-column prop="releaseName" min-width="80" label="发布人"></el-table-column>
        <el-table-column prop="releaseTime" min-width label="发布时间"></el-table-column>

        <!-- <el-table-column min-width="60" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text" 
              plain
              @click.native="details(scope.$index, scope.row.themeTitle)"
            >详情</el-button>
          </template>
        </el-table-column>-->
      </el-table>
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
        ></el-pagination>
      </div>
       <!-- 弹出公告详情 -->
    <el-dialog title='通知公告' class="common-dialog" append-to-body :close-on-click-modal="false" :visible.sync="noticeDialog" @close="closeDialog">
      <div v-if="noticeDialog" class="noticeContentBody">
        <div class="noticeTitleForm" v-html="noticeTitle"></div>
        <br>
        <div v-html="noticeContent"></div>
      </div>
    </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: "bulletin",
  data() {
    return {
      noticeDialog: false,
      noticeTitle:'',
      noticeContent: '',
      tableData: {},
      tableQuery: {
        //查询表单数据
        page: 1,
        pageCount: 20,
        status:2
      },

      approvalPageVisible: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      let _this = this;
      let params = {
        busicode: "NoticeList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params, //参数
          
        })
        .then(res => {
          _this.tableData = res;
          _this.$nextTick(() => {
            // data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
            _this.common.changeTable(_this, ".bulletin ", [".bulletin .block"]);
          });
        });
    },
    getMoreMsg(row){
     console.log(row)
     this.noticeDialog = true
      const params = {
        "busicode": "NoticeQuery",
        "data": {
          id: row.id
        }
      }
      this.$api.fetch({
        params: params,//参数
        
      }).then(res => {
        this.noticeTitle = res.messageTitle
        this.noticeContent = res.releaseContent
      })
    },
    closeDialog() {
      //关闭会话
     this.noticeDialog = false
    },
    //获取表格序号
    indexMethod(index) {
      return  (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
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
    }
  },
  watch: {}
};
</script>
<style lang="scss">
.bulletin {
  height: calc(100% - 20px);
  width: calc(100% - 40px);
  margin: 10px 0px;
  overflow-y: auto;
  .messageTitle{
    color:#02A7f0;
    cursor:pointer
  }
}
  .noticeContentBody {
    padding: 20px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    .noticeTitleForm{
      text-align: center;
    }
    figure.image{
      img{
          width: 100%;
      }
    }
  }
</style>
