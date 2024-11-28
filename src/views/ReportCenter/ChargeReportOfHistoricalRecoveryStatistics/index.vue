<template>
  <!-- 未收统计表 -->
  <div class="ChargeReportOfHistoricalRecoveryStatistics">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
       <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>
    <div v-if="indexShow" class="company-content">
      <div class="company-left">
          <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
      </div>
      <!-- index页面 -->
      <div  class="company-right index-page">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item class="form-left">
              <el-form-item label='账期：'>
                <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="营业区域：">
          <el-cascader
            ref="cascader"
            clearable
            v-model="tableQuery.area"
            @change="getBusinessArea"
            :options="businessAreaData"
            :show-all-levels="false"
            :props="props"
          >
          </el-cascader>
              </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
              </el-form-item>

            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table highlight-current-row v-if="tableShow" style="width: 100%" :max-height="maxHeight" show-summary :summary-method='getTotal' stripe border :data="tableData.list" class="ChargeReportOfHistoricalRecoveryStatistics-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="demo" min-width="80" label="用水类型" show-overflow-tooltip>
          </el-table-column>

           <el-table-column prop="demo" min-width="80" label="总户数" show-overflow-tooltip>
          </el-table-column>

            <el-table-column prop="demo" min-width="80" label="已抄数" show-overflow-tooltip>
          </el-table-column>

           <el-table-column prop="demo" min-width="80" label="未抄数" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="80" label="新增户" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="80" label="报停户" show-overflow-tooltip>
          </el-table-column>

        <el-table-column label="往期应收" align="center">
          <el-table-column prop="demo" min-width="100" label="基本水费" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="100" label="污水费" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="智能水表改造费" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="加压费" show-overflow-tooltip>
          </el-table-column>

         <el-table-column prop="demo" min-width="120" label="不征税自来水" show-overflow-tooltip>
          </el-table-column>

         <el-table-column prop="demo" min-width="120" label="总额" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="水量" show-overflow-tooltip>
          </el-table-column>

    
        </el-table-column>


          <el-table-column label="当月回收" align="center">
          <el-table-column prop="demo" min-width="120" label="基本水费" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="污水费" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="智能水表改造费" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="加压费" show-overflow-tooltip>
          </el-table-column>

           <el-table-column prop="demo" min-width="120" label="不征税自来水" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="总额" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="demo" min-width="120" label="水量" show-overflow-tooltip>
          </el-table-column>

        </el-table-column>

          <el-table-column prop="demo" min-width="120" label="往期回收率" show-overflow-tooltip>
          </el-table-column>
             <el-table-column prop="demo" min-width="120" label="总回收率" show-overflow-tooltip>
          </el-table-column> 

           
          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "ChargeReportOfHistoricalRecoveryStatistics",
  components: {
     autoTree
  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,
      businessAreaData:[],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      treeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children"
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点"
        },
        sendTreeProp: [
          "code",
          "name",
          "districtArr",
          "children",
          "id",
          "group",
          "isLeaf",
          "isParent",
          "parent",
          "sonData"
        ],
        rootName: "总部",
        defaultOpen: {
          nodeKey: "id"
        }
      },
      // 列表数据
      tableData: {list:[]},
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        startAccountPeriod: '',
        endAccountPeriod: '',
        waterTypeNo:'',
      },
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "历史回收统计" }]
      },
      tableShow: false,
      maxHeight: 0,
      waterTypeNo:'',
      parentId:'',
      totalData:{}
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    this.selectBAreaOptions();
     let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)

    this.Time = [time.getFullYear() + month, time.getFullYear() + month]
    this.getTreeDatas();
    this.common.changeTable(this, ".ChargeReportOfHistoricalRecoveryStatistics", [
      ".ChargeReportOfHistoricalRecoveryStatistics .toolbar",
      ".ChargeReportOfHistoricalRecoveryStatistics .block",
      ".ChargeReportOfHistoricalRecoveryStatistics #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      this.tableQuery.waterTypeNo=_this.waterTypeNo;
      let params = {
        busicode: "ArrearsSummaryReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total

      })
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ArrearsSummaryReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 返回合计数据
    getTotal(total){
      //console.log(this.totalData);
      let arr = ['合计', '']
      for (const key in this.totalData) {
        if (this.totalData[key] != '合计') {
          arr.push(this.totalData[key])
        }
      }
      return arr
    },
       //营业区域
    getBusinessArea(val) {
      console.log(val);
      val = this.common.handleTreeData(val);
      return val;
    },
        selectBAreaOptions(id) {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {},
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          // console.log(res);
          let data = this.getArr(res);
          // console.log(data);
          _this.businessAreaData = data.children;
          // console.log(this.businessAreaData);
        });
    },
    //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map((i) => {
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
        // 获取树的数据
    getTreeDatas() {
      let _this = this;
      let params = {
        busicode: "WaterTypeTree",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.treeDatas.tree = res;
          _this.waterTypeNo = res.code;
          _this.parentId=res.id;
          // _this.init();
        });
    },
        // 树的点击
    backTreeData(val) {
      let _this = this;
      this.parentId = val.id;
      this.waterTypeNo = val.code;
      this.tableQuery.page = 1;
      this.tableQuery.waterTypeNo=val.code;
      let params = {
        busicode: "ArrearsSummaryReport",
        data: this.tableQuery
      };
      this.$api
        .fetch({params: params})
        .then(res => {
          _this.tableData = res.detail
          _this.totalData = res.total
        });
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startAccountPeriod = date[0]
        this.tableQuery.endAccountPeriod = date[1]
      } else {
        this.tableQuery.startAccountPeriod = ''
        this.tableQuery.endAccountPeriod = ''
      }
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

  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    Time(val) {
      if(val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfHistoricalRecoveryStatistics {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>
