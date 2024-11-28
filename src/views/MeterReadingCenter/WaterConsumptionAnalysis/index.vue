<template>
  <div class="WaterConsumptionAnalysis">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel('index')">导出</el-button>
      </div>
    </div>

    <el-tabs @tab-click="tabClick" class='tabsBlock' type="border-card">
      <el-tab-pane label="用户用水分析">
        <span slot="label"><i class="el-icon-user"></i> 用户用水分析</span>
        <PrecedenceTable ref="PrecedenceTable"></PrecedenceTable>
      </el-tab-pane>
      <el-tab-pane label="客户用水分析">
        <span slot="label"><i class="el-icon-user"></i> 客户用水分析</span>
        <CustomTable ref="CustomTable"></CustomTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PrecedenceTable from "./PrecedenceTable";
import CustomTable from "./CustomTable";
import BigUsers from "./BigUsers";
export default {
  name: "WaterConsumptionAnalysis",
  components: {
    PrecedenceTable,
    CustomTable,
    BigUsers
  },
  data() {
    return {
      EditVisible: "0",
      crumbsData: {
        //面包屑
        // titleList: [
        //   { title: "" },
        //   { title: "" },
        // ]
      }
    };
  },
  mounted() {
    this.getCrumbsData(this.$route.path)
    this.getBoreValueData();
    this.getDictionarySelect();
    this.waterTypeDataOption();
    this.tradeClassifyDataOptions()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    /*this.common.changeTable(this, ".WaterConsumptionAnalysis .kl-table", [
      ".WaterConsumptionAnalysis .toolbar",
      ".WaterConsumptionAnalysis .block",
      ".WaterConsumptionAnalysis bread-contain"
    ]);*/
  },
  methods: {
    getCrumbsData(path){
      if (path == '/MeterReading/Statistics') {
        // this.$set(this.crumbsData.titleList,0,{title:"抄表开账"})
        // this.$set(this.crumbsData.titleList,1,{title:"检查"})
        // this.$set(this.crumbsData.titleList,2,{title:"用水分析"})
        this.$set(this.crumbsData,"titleList",[
          { title: "抄表开账" },
          { title: "检查" },
          { title: "用水分析" },
        ])
      }else {
        // this.$set(this.crumbsData.titleList,0,{title:"抄表水量报表"})
        // this.$set(this.crumbsData.titleList,1,{title:"用水分析"})
        this.$set(this.crumbsData,"titleList",[
          { title: "抄表水量报表" },
          { title: "用水分析" },
        ])
      }
    },
    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CTT"
      };
      this.$api
        .fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this.$refs.PrecedenceTable, "dictionaryData", res)
          this.$set(this.$refs.CustomTable, "dictionaryData", res);
        })
        .catch(res => {
          this.$set(this.$refs.PrecedenceTable, "dictionaryData", [])
          this.$set(this.$refs.CustomTable, "dictionaryData", []);
        });
    },
    //营业所
    tradeClassifyDataOptions() {
      let params = { busicode: "BusinessAbodeSelect", data: "" };
      this.$api.fetch({ params }).then(res => {
        this.$set(this.$refs.PrecedenceTable, "businessAbodeData", res)
      }).catch(res => {
        this.$set(this.$refs.PrecedenceTable, "businessAbodeData", [])
      });
    },
    //水表口径下拉框
    getBoreValueData(){
      
      let _this = this
      let params = {
          "busicode": "MeterBoreSelect",
          "data": '',
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
        this.$set(this.$refs.PrecedenceTable, "boreValueData", res)
          
      })
    },
    //树结构数据处理
    getArr(data) {
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
    //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree",
      };
      this.$api.fetch({ params})
      .then(res => {
        let data = this.getArr(res)
        this.$set(this.$refs.PrecedenceTable, "waterTypeData", data.children)
      }).catch(res => {
        this.$set(this.$refs.PrecedenceTable, "waterTypeData", [])
      });
    },
    exportExcel(){
      if (this.EditVisible == 0) {
        this.$refs.PrecedenceTable.exportExcel();
      } else {
        this.$refs.CustomTable.exportExcel();
      }
    },
    tabClick(tab, event) {
      this.EditVisible = tab.index
      this.$refs.PrecedenceTable.init()
      this.$refs.CustomTable.init()
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
.WaterConsumptionAnalysis {
  width: 100%;
  height: 100%;
  .tabsBlock {
    height: calc(100% - 42px);
    .el-tabs--border-card {
      border: 1px solid #eaf4ff;
    }
  }

  .el-tabs__content {
    padding: 5px;
    height: calc(100% - 40px);
    .el-tab-pane{
      height: 100%;
    }
  }
}
</style>
