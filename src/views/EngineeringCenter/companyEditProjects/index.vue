<template>
  <div class="companyEditProjects">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <!-- 修改页面 -->
        <div class="waterQuery" v-if="EditShow">
          <el-button size="mini" type="primary" @click="submitForm()"
            >保存</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-caret-left"
            @click="closeDialog()"
            >返回</el-button
          >
        </div>
      </div>
    </div>

    <companyEditIndex
      ref="companyEdit"
      style="height:calc(100% - 41px)"
      :keySon="keySon"
      :editNeedData="editNeedData"
      v-if="EditShow"
    ></companyEditIndex>
    <div v-if="IndexShow" class="companyEditProjectsIndex">
      <div
        class="toolbar"
        style="outline:none"
        tabindex="0"
        @keydown="enterEvents($event)"
      >
        <el-form
          :inline="true"
          size="mini"
          :model="tableQuery"
          class="demo-form-inline"
        >
          <el-form-item label="拟开工时间：">
            <el-date-picker
              :editable="false"
              size="mini"
              v-model="dataList"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item class="width-200" label="项目名称：">
            <el-input
              clearable
              v-model="tableQuery.xmName"
              @keydown.enter.native="init"
              @input="e => input = inputMe(e)"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              class="searchBtn"
              @click="init"
              icon="el-icon-search"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table" :style="{ height: maxHeight + 'px' }">
        <el-table
          stripe
          border
          v-if="tableShow"
          :max-height="maxHeight"
          :data="tableData.list"
        >
          <el-table-column
            type="index"
            label="NO."
            width="50"
            :index="indexMethod"
            fixed="left"
          ></el-table-column>

          <el-table-column
            prop="xmName"
            min-width="180"
            label="项目名称"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="nkgTime"
            min-width="120"
            label="拟开工时间"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="jsPlace"
            min-width="100"
            label="建设地点"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="jsEssence"
            min-width="100"
            label="建设性质"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="xmUnit"
            min-width="120"
            label="项目(法人)单位"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="jsDetails"
            min-width="120"
            label="建设规模及内容"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="uscCode"
            min-width="130"
            label="统一社会信用代码"
          ></el-table-column>

          <el-table-column
            prop="lxPeople"
            min-width="80"
            label="联系人"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="lxPhone"
            min-width="120"
            label="联系电话"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="clPeople"
            min-width="80"
            label="处理人"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="cjTime"
            min-width="120"
            label="创建时间"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="clTime"
            min-width="120"
            label="处理时间"
            show-overflow-tooltip
          ></el-table-column>

          <!-- <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click.native="edit(scope.row)"
                style="font-size:12px;"
                >修改</el-button
              >
            </template>
          </el-table-column> -->
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import companyEditIndex from "./companyEditIndex";
export default {
  name: "companyEditProjects",
  components: {
    companyEditIndex
  },

  data() {
    return {
      testData: {
        data: {
          list: [
            {
              xmName: "test", //项目名称
              itemstartDate: "2021-12-01", //拟开工时间
              constructionSite: "白宫", //建设地点
              constructionprOperty: "私人", //建设性质
              itemLegalDept: "白宫", //项目（法人）单位
              constructionScaleAnddesc: "白宫test",
              itemLegalCreditCode: "1111",
              contractPerson: "22",
              contractPhone: "13333333333",
              clPeople: "18888888888",
              cjTime: "2021-9-01",
              clTime: "2021-5-19"
            }
          ],
          navigateFirstPage: 1,
          navigateLastPage: 1,
          navigatePages: 8,
          navigatepageNums: [1],
          nextPage: 0,
          pageNum: 1,
          pageSize: 1,
          pages: 1,
          prePage: 0,
          size: 1,
          startRow: 0
        }
      },
      //表格是否显示
      tableShow: false,
      //表格高度控制
      maxHeight: 0,
      keySon: { id: "", type: "", formData: {} },
      editNeedData: null,
      EditShow: false,
      IndexShow: true,
      tableData: [],
      crumbsData: {
        //面包屑
        titleList: [{ title: "工程管理" }, { title: "工改系统" }]
      },
      //数据字典存值
      dictionaryData: [],
      //咨询日期段
      dataList: [
        this.common.date(-60 * 24 * 60 * 60 * 1000),
        this.common.date()
      ],
      tableQuery: {
        page: 1, //当前页码
        pageCount: 20, //当前页展示多少条数据
        beginDate: "", //咨询日期开始日期
        endDate: "", //咨询日期结束日期
        // itemstartDate:"",
        xmName: "", //
      }
    };
  },
  mounted() {
    this.init()
    this.common.changeTable(this, ".companyEditProjectsIndex", [
      ".companyEditProjectsIndex .toolbar",
      ".companyEditProjectsIndex .block"
    ]);
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    enterEvents(e) {
      if (e.keyCode == 13) {
        this.init();
        this.$refs.select1.blur();
        this.$refs.select2.blur();
      }
    },
    closeDialog() {
      this.EditShow = false;
      this.IndexShow = true;
      (this.keySon = { id: "", type: "", formData: {} }), this.init();
    },
    init() {
      let _this = this;
      if(this.dataList){
      this.tableQuery.beginDate = this.dataList[0];
      this.tableQuery.endDate = this.dataList[1];
      }
      let params = {
        busicode: "PjReformList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        })
        .catch((this.tableData = {}));
    },

    // 详情按钮事件
    edit(row) {
      this.editNeedData = row;
      this.keySon.id = row.id;
      this.keySon.formData = row;
      this.EditShow = true;
      this.IndexShow = false;
    },
    //弹出框
    submitForm() {
      //提交
      this.$refs.companyEdit.submit(true);
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
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
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
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
.companyEditProjects {
  width: 100%;
  height: 100%;
  .el-upload-list {
    display: none;
  }
  .companyEditProjectsIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
  .el-range-separator {
    padding: 0px 0px !important;
  }
}
</style>
