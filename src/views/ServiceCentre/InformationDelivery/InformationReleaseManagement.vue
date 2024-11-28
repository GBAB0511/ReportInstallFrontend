
<template>
  <div class="InformationReleaseManagement">
    <!-- 通知公共模块 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" v-if="editNeedData.saveType != 'details'" type="primary" @click="save">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
      </div>
    </div>

    <div v-if="EditVisible" class="test" style="height:calc(100% - 41px)">
      <InformationReleaseManagementEdit ref="InformationReleaseManagementEdit" :editNeedData="editNeedData"></InformationReleaseManagementEdit>
    </div>
    <div style="height:calc(100% - 41px)" v-else>

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="标题：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="请输入标题" v-model="tableQuery.messageTitle" @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="messageTitle" min-width="200" label="标题" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="releaseName" min-width="60" label="发布人">
        </el-table-column>
      <el-table-column prop="createName" min-width="60" label="起草人">
        </el-table-column>
        <el-table-column prop="releaseTime" min-width="150" label="发布日期">
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
             <el-button type="text" v-if="scope.row.releaseTime === ''"  @click="publish(scope.row)">发布</el-button>
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="details(scope.row)">详情</el-button>
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
          </template>
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
    

  </div>
</template>
<script>
import InformationReleaseManagementEdit from "./InformationReleaseManagementEditFrom";
export default {
  name: "InformationReleaseManagement",
  components: {
    InformationReleaseManagementEdit
  },
  data() {
    return {
      // 查询条件对象
      tableQuery: {
        messageTitle: '',// 标题
        page: 1,
        pageCount: 20,
      },

      // 列表数据
      tableData: {},
      // 添加/编辑页所需数据
      editNeedData: {},
      EditVisible: false, //弹出表单
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户通知" }, { title: "通知公告" }]
      },
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow6");
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    if (this.$route.query.showEdit) {
      this.EditVisible = true;
    }
    this.common.changeTable(this, ".InformationReleaseManagement", [
      ".InformationReleaseManagement .toolbar",
      ".InformationReleaseManagement .block",
      ".InformationReleaseManagement .bread-contain"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this

      let params = {
        "busicode": "NoticeList",
        "data": {
          'messageTitle': this.tableQuery.messageTitle,
          'page': this.tableQuery.page,
          'pageCount': this.tableQuery.pageCount,
        },
      }
      this.$api.fetch({
        params,
      }).then(res => {
        _this.tableData = res
      })
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 添加按钮
    add() {
      this.EditVisible = true
      this.editNeedData.saveType = 'add'
      this.editNeedData.busicode = 'NoticeAdd'
      this.editNeedData.editGet = false
    },
    //发布按钮
    publish(row) {
      let _this = this
      this.$confirm('是否确认发布该内容？')
        .then(_ => {
          let params = {
            "busicode": "NoticePublish",
            "data": {
              "id": row.id,
            },
          }
          this.$api.fetch({
            params,
          }).then(res => {
            _this.$message({
              message: '发布成功！',
              type: 'success'
            })
            _this.init()
          })
        })
        .catch(_ => { });
    },
    // 详情按钮
    edit(row){
        this.EditVisible = true
        this.editNeedData = row
         this.editNeedData.saveType = 'edit'
        this.editNeedData.busicode = 'NoticeUpdate'
        this.editNeedData.editGet = false
    },
    details(row) {
        this.EditVisible = true
        this.editNeedData = row
        this.editNeedData.saveType = 'details'
        this.editNeedData.busicode = 'NoticeUpdate'
        this.editNeedData.editGet = true
    },
    // 保存按钮（调用子页面保存方法）
    save() {
      this.$refs.InformationReleaseManagementEdit.save()
    },
    remove(row) {
      let _this = this;
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            "busicode": "NoticeDelete",
            "data": {
              id: row.id
            },
          }
          _this.$api.fetch({
            params,
          }).then(res => {
            _this.$message({
              type: "success",
              message: "删除成功！"
            });
            _this.init()
          })
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },







    handleClick(tab, event) {
      this.histroyData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5
      };
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },

    closeDialog() {
      //关闭会话
      this.init();
      // this.crumbsData.titleList.splice(3, 1);
      this.EditVisible = false;
    },

    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.histroyData.list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
};
</script>
<style lang="scss">
.InformationReleaseManagement {
  width: 100%;
  height: 100%;
}
</style>