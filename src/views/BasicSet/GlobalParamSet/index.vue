<template>
  <div class="GlobalParamSet">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="submitForm('GlobalParamSetEditForm')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>

    <div v-show="EditVisible" >
      <GlobalParamSetEdit ref="GlobalParamSetEdit"></GlobalParamSetEdit>
    </div>

    <div v-show="!EditVisible" >

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="状态：">
            <el-select v-model="tableQuery.status" placeholder="请选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip effect="dark" content="参数名称/参数信息/备注" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.searchContent" @keyup.enter.native="search" clearable placeholder=""></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">

          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="configName" min-width="100" label="参数名称">
          </el-table-column>

          <el-table-column prop="configValue" min-width="80" label="参数内容">
          </el-table-column>

          <el-table-column prop="status" min-width="80" label="状态">
          </el-table-column>

          <el-table-column prop="comments" min-width="150" label="备注" show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <el-button type="text" @click.native="add(scope.row)" style="font-size:12px;">编辑</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import GlobalParamSetEdit from "./GlobalParamSetEdit"

export default {
  components: {
    GlobalParamSetEdit,
  },
  name: "global-param-set-index",
  data() {
    return {
      EditVisible: false,//弹出表单

      formData: {
        configId: "",
        configName: "",
        configValue: "",
        comments: "",
        status: "",

      },
      tableData: [
      ],
      crumbsData: {  //面包屑
        titleList: [
          { title: '其他配置' },
          { title: '其他参数配置' }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      tableQuery: {
        page: 1,
        pageCount: 50,
        status: "",
        searchContent: "",
      }
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.GlobalParamSet', ['.GlobalParamSet .toolbar', '.GlobalParamSet .block'])
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this
      let params = {
        "busicode": "ConfigList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res;

      })

    },
    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init()
    },
    // 添加按钮点击事件
    add(val) {
      // this.bankLinkShow = false;
      this.EditVisible = true;
      if (val === 'add') {
        this.$refs.GlobalParamSetEdit.editData({
          configId: "",
          configName: "",
          configValue: "",
          comments: "",
          status: "",
        });
        this.crumbsData.titleList.push({ title: '添加', method: () => { window.histroy.back() } });
        this.common.chargeObjectEqual(this, this.formData, 'set', 'GlobalParamSetEdit');
      } else {
        this.crumbsData.titleList.push({ title: '编辑', method: () => { window.histroy.back() } });
        let _this = this;
        let params = {
          "busicode": "ConfigQuery",
          "data": {
            configId: val.configId,
          },
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.$refs.GlobalParamSetEdit.editData(res);
          this.common.chargeObjectEqual(this, res, 'set', 'GlobalParamSetEdit');
        })
      }

    },
    // 列表的NO列
    indexMethod(index) {
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {  //页码点击
      this.tableQuery.page = val;
      this.init();
    },
    closeDialog() {
      this.crumbsData.titleList.pop();
      this.EditVisible = false;
    },
    // 返回
    handleClose() {

      this.$refs.GlobalParamSetEdit.handleClose();
    },
    //保存按钮
    submitForm(formName) {
      let type = this.crumbsData.titleList[2].title;
      this.$refs.GlobalParamSetEdit.submitForm(formName, type);
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.GlobalParamSet {
  width: 100%;
  height: calc(100% - 40px);
}
</style>




