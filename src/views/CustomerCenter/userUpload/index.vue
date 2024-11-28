<template>
  <div class="userUpload">
    

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="uploadVisible">
        <el-upload
                  class="upload-file"
                  multiple action="/" 
                  :http-request="uploadAttachment"
                  style="display:inline-block;" 
                >
                  <el-button size="mini" type="primary">上传附件</el-button>
        </el-upload>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <userUploadEdit ref="userUploadEdit" v-if="uploadVisible" :formData="formData"></userUploadEdit>

    <div class="userUploadIndex" v-else>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="营业区域：">
            <!--el-select clearable v-model="tableQuery.businessAbode" placeholder="请选择">
              <el-option
                v-for="(item,index) in businessAbodeOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select-->
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="用水类型：">
            <el-cascader
              v-model="tableQuery.useWaterType"
              :options="useWaterTypeOptions"
              :show-all-levels="false"
              clearable
              :props="tprops"
              class="width-200">
            </el-cascader>
          </el-form-item>
          <el-form-item label="模糊查询：" class="width-200">
            <el-tooltip
              class="item"
              effect="dark"
              content="客户编号、账户编号、用户编号、旧用户编号、客户名称、客户地址、证件号码、手机号码、册本号"
              placement="top"
            >
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini" class="fuzzy-query-input" @keydown.enter.native="init"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table"
        :style="{height: maxHeight + 'px'}"
        >
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          highlight-current-row
          center
          stripe
          border
          :data="tableData.list" 
          class="wuserUpload-table"
        >
          <el-table-column align="center" type="index" label="NO." width="50" :index="indexMethod"></el-table-column>

          <el-table-column prop="ctmNo" min-width="100" label="客户编号" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="ctmNo">{{scope.row.ctmNo}}</div>
            </template>
          </el-table-column>

          <el-table-column prop="accountNo" min-width="100" label="账户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column align="left" prop="ctmAddr" min-width="120" label="客户地址" show-overflow-tooltip></el-table-column>

          <!--el-table-column prop="businessAbode" min-width="80" label="营业所" show-overflow-tooltip></el-table-column-->

          <el-table-column prop="businessArea" min-width="80" label="营业区域" show-overflow-tooltip></el-table-column>

          <el-table-column prop="bookNo" min-width="100" label="册本号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="openDate" min-width="80" label="立户日期" show-overflow-tooltip></el-table-column>

          <!-- <el-table-column prop="meterReadingCycle" min-width="100" label="抄表周期"></el-table-column> -->

          <el-table-column prop="useWaterType" min-width="100" label="用水类型"></el-table-column>

          <el-table-column prop="status" min-width="70" label="用户状态"></el-table-column>

          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click.native="details(scope.$index, scope.row)">附件管理</el-button>
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
import userUploadEdit from "./userUploadEdit";
export default {
  name: "userUpload",
  components: {
    userUploadEdit,
  },
  data() {
    return {
      businessAreaData: [], //营业区域下拉框
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户管理" }, { title: "客户附件管理" }]
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea: "",
        fuzzyQuery: "",
        useWaterType:[],
        list: []
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      uploadVisible:false,
      maxHeight: 0,
      tableData: {
        list: []
      },
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false
      },
      tprops: {//树结构格式
        value: 'id',
        label: 'name',
      },
      formData: {
      },
      businessAbodeOptions: [],
      useWaterTypeOptions: [],
      loadingShow: false
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow2");
    this.init();
    this.selectBAreaOptions();
    this.SelectUseWaterTypeOptions();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".userUploadIndex", [
        ".userUpload .toolbar",
        ".userUpload .block"
      ]);
    });
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    //营业区域
    selectBAreaOptions(id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessAreaData = data.children;
      })
    },
    //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    init() {
      this.loadingShow = true
      let _this = this;
      let params = {
        busicode: "userInfoList",
        data: _this.tableQuery
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res;
          this.loadingShow = false
        }).catch(() => {
          this.loadingShow = false
        })
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
      })
    },
    //树结构数据处理
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
  
    // 营业所下拉框的初始化
    businessInit() {
      let _this = this;
      let params = {
        busicode: "BusinessAbodeSelect",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.businessAbodeOptions = res;
        });
    },
    search() {
      //查询
      this.tableQuery.page=1;
      this.tableQuery.pageCount=20;
      this.init();
    },
    uploadAttachment(file) {
      this.$refs.userUploadEdit.uploadAttachment(file);
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
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    // 详情
    details(i, row) {
      this.formData = row
      this.uploadVisible = true
    },
    closeDialog(){
      this.formData= {}
      this.uploadVisible = false
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
};
</script>
<style lang="scss">
.userUpload {
  height: 100%;
  width: 100%;
  .userUploadIndex {
    height: calc(100% - 41px);
  }


  .bread-contain #crumbs {
    width: 20% !important;
  }
  .bread-contain .bread-contain-right {
    width: 78% !important;
    .el-upload-list {
      display: none;
    }
  }
  .wuserUpload-table {
    .el-table__body {
      tr {
        td:nth-child(2) {
          div {
            color: #3195f4;
            cursor: pointer;
          }
        }
      }
    }
  }
}

</style>
