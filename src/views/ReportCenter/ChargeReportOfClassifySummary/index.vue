<template>
  <!-- 分类应收汇总 -->
  <div class="ChargeReportOfClassifySummary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>
    <div v-if="indexShow" class="company-content">
      <div class="company-left">
          <auto-tree ref="tree" :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
      </div>
    <!-- index页面 -->
    <div v-if="indexShow" class="company-right index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='账期：'>
              <el-date-picker v-model="tableQuery.accountPeriod" type="month" value-format="yyyyMM" >
              </el-date-picker>
            </el-form-item>
             <el-form-item>
                <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
              </el-form-item>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal'  :data="tableData.list" class="ChargeReportOfClassifySummary-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="120" label="用水类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="totalAmount" min-width="100" label="总户数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="haveReadingAmount" min-width="100" label="已抄数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="notReadingAmount" min-width="100" label="未抄数" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="newAmount" min-width="80" label="新增户" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="stopAmount" min-width="100" label="报停户" show-overflow-tooltip align="right">
          </el-table-column> 

           <el-table-column prop="price" min-width="80" label="水费单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="sweagePrice" min-width="80" label="污水单价" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column align="center" label="当月应收">
            <el-table-column prop="receivableWater" min-width="100" label="水量" show-overflow-tooltip align="right">
            </el-table-column>

             <el-table-column :label="item.costName" min-width="120" v-for="(item,index) in costNameList" align="right" :key="'info_'+index" show-overflow-tooltip>
              <template slot-scope="scope">              
                <span style="color:black;">{{ scope.row.ysCostList[index] && scope.row.ysCostList[index].money }}</span>
              </template>
             </el-table-column>
            <el-table-column prop="receivableMoney" min-width="120" label="总额" show-overflow-tooltip align="right">
            </el-table-column>
            
          </el-table-column>

          <el-table-column  align="center" label="当月实收">
            <el-table-column prop="proceedsWater" min-width="100" label="水量" align="right" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="item.costName" min-width="120" v-for="(item,index) in costNameList" align="right" :key="'info_'+index" show-overflow-tooltip>
              <template slot-scope="scope">              
                <span style="color:black;">{{ scope.row.ssCostList[index] && scope.row.ssCostList[index].money }}</span>
              </template>
          </el-table-column>
            <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip align="right">
            </el-table-column>

            <el-table-column prop="proceedsMoney" min-width="120" label="总额" show-overflow-tooltip align="right">
            </el-table-column>

          </el-table-column>
          <el-table-column prop="timelyRecoveryRatio" min-width="100" label="及时回收率" show-overflow-tooltip align="right">
          </el-table-column>

          <el-table-column prop="totalRecoveryRatio" min-width="90" label="总回收率" show-overflow-tooltip align="right">
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
  name: "ChargeReportOfClassifySummary",
  components: {
      autoTree  
  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,

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
      tableData: {},
      totalData: {},
      costNameList:[],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: '',
        waterTypeNo:'',
      },
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "分类应收汇总" }]
      },
      tableShow: false,
      maxHeight: 0,
      waterTypeNo:'',
      parentId:'',
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    this.tableQuery.accountPeriod = time.getFullYear() + month

    this.getTreeDatas();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfClassifySummary", [
      ".ChargeReportOfClassifySummary .toolbar",
      ".ChargeReportOfClassifySummary .block",
      ".ChargeReportOfClassifySummary #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "ClassifyReceivableReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        console.log(res)
        _this.tableData = res.detail
        _this.totalData = res.total
        _this.costNameList = res.costNameList
      })
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ClassifyReceivableReportExport",
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
          if(key == 'receivableWater') {
             this.totalData.ysCostList.forEach(item=>{
                arr.push(item.money)
            })
          }
          if(key == 'proceedsWater') {
             this.totalData.ssCostList.forEach(item=>{
                arr.push(item.money)
            })
          }
        }
      }
      return arr
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
        busicode: "ClassifyReceivableReport",
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
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfClassifySummary {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
  .company-content .company-right table tbody tr td{
    // text-align: left;
  }
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
