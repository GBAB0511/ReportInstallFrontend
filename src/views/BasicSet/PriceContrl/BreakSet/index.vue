
<template>
  <div class="BreakSet">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="submitForm('BreakSetEditForm')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>
    <div v-if="EditVisible" class="indexContent">
      <BreakSetEdit ref="BreakSetEdit"></BreakSetEdit>
    </div>

    <div v-else class="indexContent">
      <div class="toolbar">
        <el-form :inline="true" size="mini" class="demo-form-inline">
            <el-form-item label="违约金名称：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.strategyName" @keyup.enter.native="search" clearable placeholder="违约金名称"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row stripe border :data="tableData.list" v-if="tableShow" :max-height="maxHeight" class="wuserInfo-table">

          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="strategyName" min-width="100" label="违约金名称">
          </el-table-column>

          <el-table-column prop="calculateWay" min-width="100" label="计算方式">
          </el-table-column>

          <el-table-column prop="minCalculateMoney" min-width="120" label="最低计算金额">
          </el-table-column>

          <el-table-column prop="minPenaltyMoney" min-width="120" label="最低违约金额">
          </el-table-column>

          <el-table-column prop="maxPenaltyMoney" min-width="120" label="最高违约金额">
          </el-table-column>

          <el-table-column prop="dailyScaling" min-width="120" label="每天收取比例">
          </el-table-column>

          <el-table-column prop="maxScaling" min-width="120" label="最高收取比例">
          </el-table-column>

          <el-table-column prop="decimalPlacse" min-width="120" label="保留小数位数">
          </el-table-column>

          <el-table-column prop="status" min-width="80" label="状态">
          </el-table-column>

          <el-table-column prop="comments" min-width="120" label="备注" show-overflow-tooltip>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="85">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click.native="add(scope.row)">编辑</el-button>
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
import BreakSetEdit from "./BreakSetEdit";
export default {
  name: "BreakSet-index",
  components: {
    BreakSetEdit
  },
  data() {
    return {
      EditVisible: false, //弹出表单
      formType: "PenaltyStrategyAdd",
      formData: {
        penaltyId: "",
        strategyName: "",
        minCalculateMoney: "",
        decimalPlacse: "",
        minPenaltyMoney: "",
        maxPenaltyMoney: "",
        dailyScaling: "",
        maxScaling: "",
        calculateBalance: "",
        calculateWay: "1",
        calculateValue: "",
        vacationFlag: "",
        comments: "",
        status: ""
      },
      tableData: {
        list:[{}]
      },
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "价格管理" },
          { title: "违约策略" }
        ]
      },
      tableShow: false,
      maxHeight: 0,
      tableQuery: {
        page: 1,
        pageCount: 50,
        strategyName: ""
      }
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".BreakSet .indexContent", [
        ".BreakSet .block",
        ".BreakSet .toolbar"
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
    init() {
      let _this = this;
      let params = {
        busicode: "PenaltyStrategyList",
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
      // this.bankLinkShow = false;
      this.EditVisible = true;
      if (val === "add") {
        this.formType= 'PenaltyStrategyAdd'; 
        this.$refs.BreakSetEdit.editData({
          penaltyId: "",
          strategyName: "",
          minCalculateMoney: "",
          decimalPlacse: "",
          minPenaltyMoney: "",
          maxPenaltyMoney: "",
          dailyScaling: "",
          maxScaling: "",
          calculateBalance: "",
          calculateWay: "1",
          calculateValue: "",
          vacationFlag: "",
          comments: "",
          status: ""
        });
        // this.crumbsData.titleList.push({title:'添加',method:()=>{window.histroy.back()}});
        this.common.chargeObjectEqual(
          this,
          this.formData,
          "set",
          "BreakSetEdit"
        );
      } else {
        // this.crumbsData.titleList.push({title:'编辑',method:()=>{window.histroy.back()}});
        let _this = this;
        this.formType= 'PenaltyStrategyEdit'; 
        let params = {
          busicode: "PenaltyStrategyQuery",
          data: {
            penaltyId: val.penaltyId
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$refs.BreakSetEdit.editData(res);
            res.vacationFlag = Boolean(res.vacationFlag);
            this.common.chargeObjectEqual(this, res, "set", "BreakSetEdit");
          });
      }
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
      // this.crumbsData.titleList.pop();
      this.EditVisible = false;
    },
    // 返回
    handleClose() {
      this.$refs.BreakSetEdit.handleClose();
    },
    //保存按钮
    submitForm(formName) {
      let type = this.crumbsData.titleList[2].title;
      this.$refs.BreakSetEdit.submitForm(formName, this.formType);
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
.BreakSet {
  width: 100%;
  height: 100%;
}
</style>


