

<template>
  <div class="LiquidatedDamages">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="LiquidatedDamagesVisible">
        <el-button v-if="buttomShow" size="mini" type="primary" @click="submit();">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button icon="el-icon-plus" size="mini" @click="add" type="primary">添加</el-button>
      </div>
    </div>
    <div v-if="LiquidatedDamagesVisible" class="indexContent">
      <LiquidatedDamagesEdit  :editNeedData="editNeedData" ref="childLiquidatedDamages"></LiquidatedDamagesEdit>
    </div>

    <div v-else class="indexContent">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="状态：">
              <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="未审">
                <el-option
                  v-for="(item,index) in approvalStatusOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="单据日期：" class="width-150">
              <el-date-picker
                v-model="tableQuery.billDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="用户编号：" class="width-150">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" placeholder="用户编号" @keydown.enter.native="demand"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          highlight-current-row
          :data="tableData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="processStateName" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="processName" min-width="100" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip></el-table-column>

          <el-table-column prop="billNo" min-width="90" label="单据编号"></el-table-column>

          <el-table-column prop="billDate" min-width="80" label="单据日期"></el-table-column>

          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ctmName" min-width="90" label="客户名称" show-overflow-tooltip></el-table-column>

          <el-table-column prop="penaltyDays" min-width="50" label="违约天数"></el-table-column>

          <el-table-column prop="remissionComments" min-width="80" label="减免原因" show-overflow-tooltip></el-table-column>

          <el-table-column prop="createName" min-width="80" label="制单人"></el-table-column>

          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="text"  @click="details(scope.$index, scope.row)">详情</el-button>
              <span v-if="scope.row.processStateName=='草稿'">|</span>
              <el-button
                v-if="scope.row.processStateName=='草稿'"
                type="text"
                @click="deleteRow(scope.$index, scope.row)"
              >删除</el-button>
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
          ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import LiquidatedDamagesEdit from "./LiquidatedDamagesEdit";
export default {
  name: "LiquidatedDamages",
  components: {
    LiquidatedDamagesEdit
  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "账务调整" },
          { title: "违约金减免" }
        ]
      },
      // 子页面所需数据
      editNeedData: {},
      tableQuery: {
        page: 1,
        pageCount: 20,
        processState:'',//状态
        userNo:'',//用户编号
        billDate:'',//减免日期
      },
      // 列表数据
      tableData: {},
      //审批状态下拉框
      approvalStatusOptions: this.common.processState(),
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      LiquidatedDamagesVisible: false,
      buttomShow: true,
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".LiquidatedDamages", [
      ".LiquidatedDamages .toolbar",
      ".LiquidatedDamages .block",
      ".LiquidatedDamages #crumbs"
    ]);
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 列表初始化
    init() {
      let params = {
        busicode: "FnPenaltyRemissionList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        });
    },

    demand() {
      //查询
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
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
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    },
    closeDialog() {
      //关闭会话
      this.LiquidatedDamagesVisible = false;
      this.init();
    },
    //弹出框
    submit() {
      //提交
      this.$refs.childLiquidatedDamages.submit();
    },
    add() {
      this.editNeedData.busicode = "FnPenaltyRemissionAdd";
      this.editNeedData.saveType = "add";
      this.buttomShow = true;
      this.LiquidatedDamagesVisible = true;
    },
    details(index, row) {
      this.editNeedData = row
      this.editNeedData.busicode = "FnPenaltyRemissionUpdate";
      this.editNeedData.saveType = 'edit';
      if (row.processState == "approval" || row.processState == "END") {
        this.buttomShow = false;
      } else {
        this.buttomShow = true;
      }
      this.LiquidatedDamagesVisible = true;
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            busicode: "FnPenaltyRemissionDelete",
            data: row.id
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.init();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
.LiquidatedDamages {
  width: 100%;
  height: 100%;
  .indexContent {
    height: calc(100% - 41px);
  }
}
</style>
