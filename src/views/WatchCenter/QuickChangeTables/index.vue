<template>
  <div class="QuickChangeTables">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <!-- <el-button size="mini" type="primary" @click="DetailedEnquiries" v-if="!breadVisible">历史查询</el-button> -->
        <el-button type="primary" size="mini" icon="el-icon-upload2" v-if="DetailedEnquiriesVisible" @click="exportExcel">导出</el-button>
        <el-upload action="/" class="upload-demo" multiple  :http-request="importExcel" style="display:inline-block">
          <el-button icon="el-icon-upload" size="mini" type="primary">导入</el-button>
        </el-upload>
        <el-button size="mini" type="primary" icon="el-icon-bottom" @click="downloadTemplate" style="margin-left:10px">下载模板</el-button>
        <el-button size="mini" type="primary" @click="quickChange" v-if="!breadVisible">换表登记</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeEdit" v-else>返回</el-button>
      </div>
    </div>

  <!-- 详情 -->
    <div v-if="QuickChangeEditVisible" class='indexContent'>
      <QuickChangeEdit v-if="QuickChangeEditVisible" ref="QuickChangeEdit" :id ='id' :detailId ='detailId' :editType ='editType' @closeEdit="closeEdit"></QuickChangeEdit>
    </div>
    <!-- 历史查询 -->
    <div v-else-if="DetailedEnquiriesVisible" class='indexContent'>
      <DetailedEnquiries ref="DetailedEnquiries"></DetailedEnquiries>
    </div>
    <div class="indexContent" v-else>
      <div class="toolbar" style="outline:none" tabindex="0">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label='换表日期：'>
            <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="模糊查询：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable placeholder="用户编号/用户名称/水表编号" @keydown.enter.native="search" class="fuzzyQuery"></el-input>
          </el-form-item>

          <el-form-item class="button-group">
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="QuickChangeTables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="billNo" min-width="120" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="100" label="单据日期">
          </el-table-column>

          <el-table-column prop="userNo" min-width="130" label="用户编号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="200" label="用户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="200" label="用户地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="oldMeterNo" min-width="100" label="旧水表编号">
          </el-table-column>

          <el-table-column prop="newMeterNo" min-width="100" label="新水表编号">
          </el-table-column>

          <el-table-column prop="replaceDate" min-width="100" label="换表日期">
          </el-table-column>

          <el-table-column prop="replaceStaffName" min-width="80" label="换表员" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createName" min-width="80" label="制单人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column class="cell" label="操作" fixed="right" width="140">
            <template slot-scope="scope">
              <el-button type="text" class="noclick" @click="details(scope.row)">详情</el-button>
              <el-button type="text" class="noclick" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" class="noclick" @click="remove(scope.row)">删除</el-button>
              <!-- <el-button type="text" class="noclick" v-if="scope.row.processState == '' || scope.row.processState == 'register'" @click="remove(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>

        </el-table>

      </div>
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
import QuickChangeEdit from "./QuickChangeEdit";//选择水表
import DetailedEnquiries from "../ChangeTables/DetailedEnquiries";//历史查询
export default {
  name:"QuickChangeTables",
  components: {
    QuickChangeEdit,
    DetailedEnquiries
  },
  data () {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "快捷换表" }]
      },
      Time: [],
      // 查询条件
      tableQuery: {
        beginDate: '',
        endDate: '',
        fuzzyQuery: '',
        page: 1,
        pageCount: 20,
        receiptType: 1
      },
      QuickChangeEditVisible: false,
      DetailedEnquiriesVisible: false,
      breadVisible: false,
      // 列表数据
      tableData: [],
      tableShow: false,
      maxHeight: 0,
      editType: 1,
      id:'',
      detailId: '',
    }
  },
  mounted () {
    this.init()
    this.common.changeTable(this, ".QuickChangeTables .indexContent", [
      ".QuickChangeTables .indexContent .toolbar",
      ".QuickChangeTables .indexContent .block"
    ]);
  },
  methods: {
    //用户查询
    init(){
      var reg = new RegExp( ' ' , "g" )
      var reg2 = new RegExp( '\\t' , "g" )
      this.tableQuery.fuzzyQuery = this.tableQuery.fuzzyQuery.replace( reg , '' );
      this.tableQuery.fuzzyQuery = this.tableQuery.fuzzyQuery.replace( reg2 , '' );
      let params = {
        busicode: "MsChgListNew",
        data: this.tableQuery
      };
      this.$api.fetch({ params }).then(res => {
        this.tableData = res
      });
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    quickChange(){
      this.id = ''
      this.detailId = ''
      this.breadVisible = true
      this.QuickChangeEditVisible = true
      this.DetailedEnquiriesVisible = false
    },
    closeEdit(){
      this.breadVisible = false
      this.QuickChangeEditVisible = false
      this.DetailedEnquiriesVisible = false
      // this.editData = {}
      this.id = ''
      this.detailId = ''
      this.editType = 1
      this.init()
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    details(row){
      console.log(row);
      // this.editData = row
      this.id = row.id
      this.editType = 0
      this.breadVisible = true
      this.QuickChangeEditVisible = true
      this.DetailedEnquiriesVisible = false;
    },
    edit(row){
      console.log(row);
      // this.editData = row
      this.id = row.id
      this.detailId = row.detailId
      this.editType = 2
      this.breadVisible = true
      this.QuickChangeEditVisible = true
      this.DetailedEnquiriesVisible = false;
    },
    remove(row){
    this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "MsChgDeleteNew",
            data: {
              id: row.detailId
            }
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$message.success("删除成功！")
            this.init();
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });


    },
    // 明细查询
    DetailedEnquiries() {
      this.breadVisible = true
      this.DetailedEnquiriesVisible = true;
      this.QuickChangeEditVisible = false;
    },
    // 下载模板/导出（调子页面下载模板/导出方法）
    exportExcel() {
      if (this.DetailedEnquiriesVisible) {
        this.$refs.DetailedEnquiries.exportExcel()
      }
    },
    // 导入
    importExcel(file){
      let _this = this;
      let params = {
        busicode: "MsChgBatchAddNew",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$message.success("导入成功")
      })
    },
    //下载模板
    downloadTemplate() {
      var params = {
        busicode: "MsChgBatchTemplate",
        data: {
          // accountPeriod: this.tableQuery.accountPeriod,
          // bookNo: this.treeBooks.bookNo
        },
        token: sessionStorage.getItem('token'),
        // token: "krrjdev123",//
        sysType: "002"
      };
       window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
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
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
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

<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.QuickChangeTables{
    height: 100%;
    overflow-y: auto;
    .fuzzyQuery >>> .el-input__inner{
      width: 200px;
    }
}
</style>
