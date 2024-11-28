<template>
  <div class="cheap-strategy">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="addRow">添加行</el-button>
        <el-button size="mini" type="primary" @click="submitForm('CheapStrategyEditForm')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>
    <div v-if="EditVisible" class="indexContent">
      <CheapStrategyEdit ref="CheapStrategyEdit"></CheapStrategyEdit>
    </div>
    <div v-else class="indexContent">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="状态：">
              <el-select  ref="select1" v-model="tableQuery.status" placeholder="请选择状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="启用" :value="1"></el-option>
                <el-option label="停用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模糊查询：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.searchContent" @keyup.enter.native="search" clearable placeholder="策略名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">
          <el-table-column type="index" label="序号" fixed="left" width="50" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="strategyName" min-width="80" label="策略名称">
          </el-table-column>
          <el-table-column prop="status" min-width="120" label="状态">
          </el-table-column>
          <el-table-column prop="comments" min-width="120" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <el-button type="text" style="font-size: 12px;" @click.native="add(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10,50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import CheapStrategyEdit from "./CheapStrategyEdit";
export default {
  components: {
    CheapStrategyEdit
  },
  name: "cheap-strategy-index",
  data() {
    return {
      EditVisible: false, //弹出表单
      tableData: {
        list:[{}],
      },
      //   查询表单
      formData: {
        strategyName: "",
        status: "",
        comments: "",
        prefStrategyList: []
      },
      crumbsData: {
        //面包屑`
        titleList: [
          { title: "收费管理" },
          { title: "价格管理" },
          { title: "优惠策略" }
        ]
      },
      tableShow: false,
      maxHeight: "",
      tableQuery: {
        page: 1,
        pageCount: 10,
        status: "",
        searchContent: ""
      },
      formType:"",
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(
        this,
        ".cheap-strategy .indexContent",
        [".cheap-strategy .toolbar", ".cheap-strategy .block"]
      );
    });
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let _this = this;
      let params = {
        busicode: "PrefStrategyList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 添加按钮点击事件
    add(val) {
      this.EditVisible = true;
      this.$nextTick(() => {
        if (val === "add") {
          this.$refs.CheapStrategyEdit.editData({
            strategyName: "",
            status: "",
            comments: "",
            prefStrategyList: []
          });
          this.formType='PrefStrategyAdd'
        } else {
          let _this = this;
          _this.formType='PrefStrategyUpdate'
          let params = {
            busicode: "PrefStrategyQuery",
            data: {
              id: val.id
            }
          };
          this.$api
            .fetch({params: params})
            .then(res => {
              this.$refs.CheapStrategyEdit.editData(res);
            });
        }
      });
    },
    // 列表的NO列
    indexMethod(index) {
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //页码点击
      this.tableQuery.page = val;
      this.init();
    },
    closeDialog() {
      this.crumbsData.titleList.pop();
      this.EditVisible = false;
    },
    // 返回
    handleClose() {
      this.$refs.CheapStrategyEdit.handleClose();
    },
    //保存按钮
    submitForm() {
      this.$refs.CheapStrategyEdit.submitForm(this.formType);
    },
    // 添加行
    addRow() {
      this.$refs.CheapStrategyEdit.addRow();
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
.cheap-strategy {
  width: 100%;
  height: 100%;
}
</style>

