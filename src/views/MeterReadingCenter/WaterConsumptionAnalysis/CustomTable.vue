<template>
  <div class="CustomTable">
    <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">
          <el-form-item label="账期：" class="width-150">
            <el-date-picker v-model="tableQuery.accountPeriod" 
              type="month" 
              size="mini" 
              format="yyyy-MM"
              value-format="yyyyMM">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="客户类型：">
            <el-select ref="select1" clearable v-model="tableQuery.ctmType" placeholder="客户类型" >
              <el-option v-for="(item,index) in dictionaryData.CTT" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="排序：">
            <el-select ref="select2" v-model="tableQuery.sort" size="mini">
              <el-option label="上期水量" value="priorPeriodWater"></el-option>
              <el-option label="环比水量" value="momAddWater"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>
          <!-- 高级查询 -->
          <div v-show="isActive" class="advancedQuery">
            <el-form-item label="环比增减率：" label-width="80px" style="white-space:nowrap;">
              <el-select ref="select3" v-model="tableQuery.addRateCompare" size="mini">
                <el-option label="等于" value="equal"></el-option>
                <el-option label="大于等于" value="more"></el-option>
                <el-option label="小于等于" value="less"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="noLabelInput">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.addRate"></el-input>%
            </el-form-item>
            
            <el-form-item label="排名前：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.num" placeholder="300" @keydown.enter.native="demand"></el-input>
            </el-form-item>
            
            <el-form-item label="上期水量：">
              <el-select ref="select4" v-model="tableQuery.priWaterCompare" size="mini">
                <el-option label="等于" value="equal"></el-option>
                <el-option label="大于等于" value="more"></el-option>
                <el-option label="小于等于" value="less"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="noLabelInput">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.priorPeriodWater" @keydown.enter.native="demand"></el-input>m³
            </el-form-item>
        <el-form-item>
            <el-form-item label="本期水量：" label-width="80px">
              <el-select ref="select5" v-model="tableQuery.curWaterCompare" size="mini">
                <el-option label="等于" value="equal"></el-option>
                <el-option label="大于等于" value="more"></el-option>
                <el-option label="小于等于" value="less"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="noLabelInput">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" clearable v-model="tableQuery.currendPeriodWater" @keydown.enter.native="demand"></el-input>m³
            </el-form-item>

            <el-form-item label="增减率：">
              <el-radio v-model="tableQuery.compareTime" label="month">比上月</el-radio>
              <el-radio v-model="tableQuery.compareTime" label="year">比上年</el-radio>
            </el-form-item>
          </el-form-item>
        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border :data="tableData.list"  class="wuserInfo-table" v-if="tableShow"
        :max-height="maxHeight">
        <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
        <el-table-column prop="ctmNo" min-width="100" label="客户编号"></el-table-column>
        <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creditLevel" min-width="80" label="信用等级"></el-table-column>
        <el-table-column prop="userNum" min-width="80" label="用户数量" align="right"></el-table-column>
        <el-table-column prop="currendPeriodWater" min-width="100" label="本期水量" align="right"></el-table-column>
        <el-table-column prop="priorPeriodWater" min-width="100" label="上期水量" align="right"></el-table-column>
        <el-table-column prop="momAddWater" min-width="80" label="环比水量" align="right"></el-table-column>
        <el-table-column prop="momAddWaterRate" min-width="80" label="环比增减率%" align="right"></el-table-column>
        <el-table-column prop="lastYearPeriodWater" min-width="100" label="同比水量" align="right"></el-table-column>
        <el-table-column prop="yoyAddWater" min-width="120" label="同比增减" align="right"></el-table-column>
        <el-table-column prop="yoyAddWaterRate" min-width="120" label="同比增减率%" align="right"></el-table-column>
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
</template>
<script>
export default {
  name: "CustomTable",
  components: {},
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      tableQuery: {
        "page": 1,
        "pageCount": 20,
        "accountPeriod": this.common.date("month"),//账期：
        "ctmType":"",//客户类型：
        "priorPeriodWater":'',//上期水量
        "priWaterCompare":"equal",//上期水量比较
        "currendPeriodWater":"",//本期水量
        "curWaterCompare":"equal",//本期水量比较
        "addRate":"",//增减率
        "addRateCompare":"equal",//增减率比较
        "compareTime":"month",//年月比较
        "num":'',//限制数量/排名前
        'sort':'priorPeriodWater',//排序

      },
      tableShow: false,
      maxHeight: 0,
      isActive: false,  //控制高级查询内容的显示
      dictionaryData:[],
      tableData: {},
    };
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
           this.$refs.select4.blur()
           this.$refs.select5.blur()
         }
    },
    init() {
      var _this = this;
      let params = {
        busicode: "MrCusWaterList",
        data: this.tableQuery
      };
      this.$api.fetch({params: params }) .then(res => {
          this.$set(this, "tableData", res);
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.changeTable()
      })
    },

    demand() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    //   导出
    exportExcel() {
        let params = {
          "busicode": "MrCusWaterListExport",
          "data": this.tableQuery,
          token: sessionStorage.getItem('token'),
          sysType: '002'
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        //$('.el-table--fit').css('height', '66%');
        
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
        //$('.el-table--fit').css('height', '50%');

      }
      this.$nextTick(() => {
        this.common.changeTable(this, ".CustomTable", [
          ".CustomTable .toolbar", 
          ".CustomTable .block",
          '.CustomTable .toggel-btn'
        ])
      })
    },
    changeTable() {
      this.common.changeTable(this, ".CustomTable", [
        ".CustomTable .toolbar", 
        ".CustomTable .block",
        '.CustomTable .toggel-btn'
      ])
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
<style lang="scss" scoped>
.CustomTable {
  width: 100%;
  height: 100%;
  .kl-table{
    margin-top: 15px;
  }
  .input-250{
  .el-input{
    width: 89%!important;
    .el-input--mini{
     display: inline-block;
  }
  // /deep/ .el-input__inner{
  //   width:180px !important
  // }
  }
}
.input-200{
  .el-input{
    width: 86%!important;
    .el-input--mini{
     display: inline-block;
  }
  // /deep/ .el-input__inner{
  //   width:180px !important
  // }
  }
}
.noLabelInput{
        width: 150px !important;
        .el-input{
            width: 120px !important;
            margin-right: 8px !important;
        }
    }
}
</style>

<style lang="scss">
.CustomTable{
    .noLabelInput{
        width: 150px !important;
        .el-input{
            width: 120px !important;
            margin-right: 8px !important;
        }
    }
    .is-right {
      .cell{
          text-align: right !important;
      }
    }
}
</style>
