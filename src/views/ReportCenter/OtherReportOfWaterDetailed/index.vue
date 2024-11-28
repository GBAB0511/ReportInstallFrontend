<template>
  <!-- 水表明细表 -->
  <div class="OtherReportOfUserDetails">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <!-- index页面 -->
      <!-- <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div> -->
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="水表状态：">
            <el-select ref="select1" clearable v-model="tableQuery.meterStatus" placeholder="水表状态">
              <el-option key="" label="全部" value=""></el-option>
              <el-option v-for="item in dictionaryData.MMS" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="水表分类：">
            <el-select ref="select2" clearable v-model="tableQuery.meterType" placeholder="水表分类">
              <el-option key="" label="全部" value=""></el-option>
              <el-option v-for="item in dictionaryData.MMT" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业区域：" prop="businessArea">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
              </el-cascader>
          </el-form-item>
           <el-form-item label="模糊查询：" class="item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.reportQuery" placeholder="水表编号、水表厂家、口径" @keydown.enter.native="search" class="userNo"></el-input>
          </el-form-item>

          <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" border  :data="tableData.list" class="OtherReportOfUserDetails-table" >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="meterTypeName" label="水表分类" min-width="120">
          </el-table-column>
          <el-table-column prop="meterStatusName" label="水表状态" min-width="120">
          </el-table-column>
          <el-table-column prop="meterNo" label="表计编号" min-width="120">
          </el-table-column>
          <el-table-column prop="meterStatusName" label="水表状态" min-width="120">
          </el-table-column>
          <el-table-column prop="factoryNo" label="表身唯一码" min-width="160">
          </el-table-column>
          <el-table-column prop="meterFactory" label="水表厂家" min-width="120">
          </el-table-column>
          <el-table-column prop="meterBore" label="水表口径" min-width="120">
          </el-table-column>
          <el-table-column prop="valueControl" label="是否阀控" min-width="120">
             <template slot-scope="scope">
              <span v-if="scope.row.valueControl == 1" style="color: #000;">是</span>
							<span v-else style="color: #000;">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="TransmittalModelName" label="通讯类型" min-width="120">
          </el-table-column>
          <el-table-column prop="seterMeterAddr" label="安装地址" min-width="120">
          </el-table-column>
          <el-table-column prop="meterModelName" label="水表型号" min-width="200">
          </el-table-column>
          <el-table-column prop="maxValue" label="满码值" min-width="120">
          </el-table-column>
          <el-table-column prop="shelfLife" label="使用期限" min-width="120">
          </el-table-column>
          <el-table-column prop="commOperator" label="通讯运营商" min-width="120">
          </el-table-column>
          <el-table-column prop="commFeeStart" label="通讯开始时间" min-width="120">
          </el-table-column>
          <el-table-column prop="commFeeEnd" label="通讯结束时间" min-width="120">
          </el-table-column>


          <!-- <el-table-column prop="status" label="用户状态" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" style="color: #000;">正常</span>
							<span v-else style="color: #000;">注销</span>
            </template>
          </el-table-column> -->
        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OtherReportOfUserDetails",
  components: {

  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      // 列表数据
      tableData: {},
      totalData: {},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea:'', // 营业区域
        meterStatus: "", //水表状态
        meterType: "", //水表类型
        reportQuery: "", //模糊查询
        groupCode: localStorage.getItem('companyNo'),
      },
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      // 营业所下拉数据
      businessAreaData: [],
      // 数据字典数据
      dictionaryData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "水表明细表" }]
      },
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.getDictionary()
    this.getBusinessAreaData() 
    this.common.changeTable(this, ".OtherReportOfUserDetails .index-page", [
      ".OtherReportOfUserDetails .toolbar",
      ".OtherReportOfUserDetails .block",
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this;
      let temQuery = JSON.parse(JSON.stringify(this.tableQuery))
      let params = {
        busicode: "MsInfoReport",
        data: temQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        console.log(res);
        _this.tableData = res
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMT,MMS,MMC,METER_QUERY_TYPE"//水表制式、水表状态、水表口径
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 营业区域下拉框
    getBusinessAreaData() {
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
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 导出
    exportExcel() {
        if (this.tableQuery.bookNos.length == 0){
        this.tableQuery.bookNos = null;
      }
      let params = {
        "busicode": "ActualReceiveDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(param){
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=[]
      selectedColm.forEach(a => {
          if(vm.totalData[a.property]||vm.totalData[a.property]==0||vm.totalData[a.property]=='0'){//与表格列进行匹配
            newArray.push(vm.totalData[a.property])
          }else{
            if(a.property!=undefined){//序号列不push
              newArray.push('')
            }
          }
        });
      newArray[0]='合计'
      sums=newArray;
      return sums;
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
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    // 快捷查询
    toDetail(userNo){
      let routeUrl = this.$router.resolve({ path: '/UserInfoSearchDetail'});
      sessionStorage.setItem('userNo',userNo)
      window.open(routeUrl.href, '_blank');
      sessionStorage.removeItem('userNo')
    },
    formatFloat(num){
      if (num != '') {
        var value = Math.round(parseFloat(num) * 100 ) / 100;
        var arrayNum = value.toString().split(".");
        if (arrayNum.length == 1) {
          return value.toString() + ".00"
        }
        if (arrayNum.length > 1) {
          //小数点右侧 如果小于两位则补一个0
          if ( arrayNum[1].length < 2) {
            return value.toString() +"0" ;
          }
          return value;
        }
      }else{
        return num;
      }
      
    },
    removeZero(value){
      if (value==0) {
        return value = ''
      }else{
        return value
      }
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.OtherReportOfUserDetails {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 42px);
  }
}
/deep/{
  .el-table {
    .el-table__fixed { // 左固定列
      height: auto !important;
    }
    .el-table__fixed-right { // 右固定列
      height: auto !important;
    }
    .el-table__body-wrapper{
      z-index: 2;
    }
  }
}
/deep/{
  // 第一行
  .item{
    width: 22%;
    .el-form-item__content{
      width: calc(100% - 73px);
    }
  }
  .dateAndTime{
    width: 25%;
    .el-form-item__content{
      width: 75%;
      .el-date-editor{
        width: 100%;
      }
    }
  }
  .shouldWater{
    width: 100%;
    .el-input__inner{
      width: 100%;
    }
  }

  // 第二行
  .el-col-3{
    width: auto;
  }

  // 第三行
  .shouldWaterInput{
    width: auto;
  }
}
.userNo >>> .el-input__inner{
  width: 100%;
}
// /deep/{
//     .el-table__body .el-table__row{
//       td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
//         .cell{
//           text-align: right !important;
//         }
//       }
//     }
//     .el-table__header{
//       th:nth-child(5),th:nth-child(6),th:nth-child(13),th:nth-child(29),th:nth-child(30),th:nth-child(31),th:nth-child(32),th:nth-child(33),th:nth-child(34){
//         .cell{
//           text-align: right !important;
//         }
//       }
//     }
//     .el-table__footer{
//       td:nth-child(5),td:nth-child(6),td:nth-child(13),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34){
//         .cell{
//           text-align: right !important;
//         }
//       }
//     }
//   }
</style>
