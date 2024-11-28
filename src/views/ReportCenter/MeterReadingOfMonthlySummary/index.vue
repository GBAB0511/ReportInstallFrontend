<template>
  <div class="MeterReadingOfMonthlySummary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button
          @click="Print"
          size="mini"
          icon="el-icon-printer"
          type="primary"
          >打印</el-button
        >
        <el-button
          @click="exportExcel"
          size="mini"
          icon="el-icon-upload2"
          type="primary"
          >导出</el-button
        >
      </div>
    </div>
    <div class="main-container">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form
          :inline="true"
          size="mini"
          :model="tableQuery"
          class="demo-form-inline"
        >
          <el-form-item label="统计方式：">
            <el-select ref="select1" v-model="tableQuery.statisticsWay" placeholder="请选择" @change="selectChanged">
              <el-option
                v-for="item in statisticsWayData"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="账期：">
            <el-date-picker
              v-model="tableQuery.accountPeriod"
              size="mini"
              type="month"
              unlink-panels
              format="yyyyMM"
              value-format="yyyyMM"
              placeholder="选择月"
            ></el-date-picker>
          </el-form-item>

          <!--<el-form-item label="水量>=：">
            <el-input
              v-model="tableQuery.waterYield"
              placeholder="10"
              clearable
              @keydown.enter.native="search"
            ></el-input>
          </el-form-item>-->

          <el-form-item v-if="showStatisticsDialog" label="抄表员：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.readingStaff" size="mini" clearable @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              class="searchBtn"
              @click="search"
              icon="el-icon-search"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div :class="{ 'company-content': tableQuery.statisticsWay == 1 ||  tableQuery.statisticsWay == 2}">
        <div class="company-left" v-if="tableQuery.statisticsWay == 1 || tableQuery.statisticsWay == 2">
          <auto-tree
            :treeData="treeDatas"
            @sendTreeData="backTreeData"
          ></auto-tree>
        </div>
         <div class="resize" title="收缩侧边栏">
		         	⋮
		       </div>
        <div
          class="kl-table"
          :class="[
            { 'company-right': tableQuery.statisticsWay == 1 },
            { 'index-page': tableQuery.statisticsWay == 1 },
          ]"
        >
          <el-table
            v-if="tableShow"
            :max-height="maxHeight"
            show-summary
            :summary-method="getTotal"
            stripe
            border
            :data="tableData"
            class="MeterReadingOfYearSummary-table"
          >
            <!-- <el-table-column type="selection" width="50" fixed="left">
            </el-table-column> -->

            <el-table-column
              type="index"
              label="NO."
              width="50"
              fixed="left"
              :index="indexMethod"
            >
            </el-table-column>

            <el-table-column
              v-if="showWaterTypeDialog"
              prop="statisticsType"
              min-width="120"
              label="用水类型"
            >
            </el-table-column>

            <el-table-column
              v-if="showBoreNoDialog"
              prop="statisticsType"
              min-width="120"
              label="口径"
            >
            </el-table-column>

            <el-table-column
              v-if="showAreaNoDialog"
              prop="statisticsType"
              min-width="120"
              label="营业区域"
            >
            </el-table-column>

            <el-table-column
              v-if="showStatisticsDialog"
              prop="statisticsType"
              min-width="120"
              label="抄表员"
            >
            </el-table-column>

            <el-table-column
              prop="currendPeriodWater"
              min-width="100"
              label="本期水量"
              align="right"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              prop="priorPeriodWater"
              min-width="100"
              label="上期水量"
              align="right"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              prop="samePeriodLastYearWater"
              min-width="100"
              label="去年同期水量"
              align="right"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              prop="momRatio"
              min-width="100"
              label="环比增长率"
              align="right"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              prop="yoyRatio"
              min-width="100"
              label="同比增长率"
              align="right"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
        </div>
       
        <!-- 分页 -->
        <!-- <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div> -->
      </div>
    </div>
    
  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'

export default {
  name: "MeterReadingOfMonthlySummary",
  components: {
    autoTree
  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },
      showStatisticsDialog: false, //抄表员
      showWaterTypeDialog: true, //用水类型
      showAreaNoDialog: false, //营业区域
      showBoreNoDialog: false, //口径
      crumbsData: {
        //面包屑
        titleList: [{ title: "抄表水量报表" }, { title: "水量月汇总" }],
      },
      // 施工日期
      TimeList: [],
      // 查询条件对象
      tableQuery: {
        // page: 1,
        // pageCount: 20,
        accountPeriod: "", // 账期
        statisticsWay: "1", // 统计方式
       // waterYield: "", //水量
        businessArea: "", //营业区域
        readingStaff: "", //抄表员名称
        waterTypeId:""
      },
      // 列表数据
      tableData: [],
      // 合计数据
      totalData: {},
      // 统计方式下拉数据
      statisticsWayData: [
        { name: "用水类型", value: "1" },
        { name: "营业区域", value: "2" },
        { name: "口径", value: "3" },
        { name: "按抄表员", value: "4" },
      ],
      businessAreaData: [], //营业区域
      // 类型表头字段名（动态化）
      statisticsTypeName: "用水类型",
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      tableShow: false,
      maxHeight: 0,
      parentId:"",
      areaTreeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children",
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点",
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
          "sonData",
        ],
        rootName: "总部0",
        defaultOpen: {
          nodeKey: "id",
        },
      },

      typeTreeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children",
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点",
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
          "sonData",
        ],
        rootName: "总部0",
        defaultOpen: {
          nodeKey: "id",
        },
      },
      treeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children",
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点",
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
          "sonData",
        ],
        rootName: "总部0",
        defaultOpen: {
          nodeKey: "id",
        },
      },
    };
  },
  mounted() {
      this.dragControllerDiv()
    // 侧边栏
    eventBus.$emit("asideMenuShow", "reportMenuShow3");
    this.getTreeDatas();
    this.businessAreaSelect();   
    this.$set(this,'treeDatas',this.typeTreeDatas);
     console.log(this.treeDatas)
    this.parentId = this.treeDatas.tree.id;
    let time = new Date();
    let month =
      time.getMonth() + 1 > 9
        ? (time.getMonth() + 1).toString()
        : "0" + (time.getMonth() + 1);
    this.tableQuery.accountPeriod = time.getFullYear() + month;

    //this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".MeterReadingOfMonthlySummary .main-container", [
      ".MeterReadingOfMonthlySummary .toolbar",
    ]);
  },
  methods: {
       enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
          dragControllerDiv () {
                var resize = document.getElementsByClassName('resize');
                var left = document.getElementsByClassName('company-left');
                var mid = document.getElementsByClassName('company-right');
                var box = document.getElementsByClassName('company-content');
                for (let i = 0; i < resize.length; i++) {
                    // 鼠标按下事件
                    resize[i].onmousedown = function (e) {
                        //颜色改变提醒
                        resize[i].style.background = '#818181';
                        var startX = e.clientX;
                        resize[i].left = resize[i].offsetLeft;
                        // 鼠标拖动事件
                        document.onmousemove = function (e) {
                            var endX = e.clientX;
                            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
                            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

                            if (moveLen < 32) moveLen = 32; // 左边区域的最小宽度为32px
                            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px

                            resize[i].style.left = moveLen; // 设置左侧区域的宽度

                            for (let j = 0; j < left.length; j++) {
                                left[j].style.width = moveLen + 'px';
                                mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
                            }
                        };
                        // 鼠标松开事件
                        document.onmouseup = function (evt) {
                            //颜色恢复
                            resize[i].style.background = '#d6d6d6';
                            document.onmousemove = null;
                            document.onmouseup = null;
                            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                        };
                        resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                        return false;
                    };
                }
            },
    // 初始化
    init() {
      this.tableQuery.area = this.common.handleTreeData(this.tableQuery.area);
      let _this = this;
      let params = {
        busicode: "MonthWaterStatisticsReport",
        data: _this.tableQuery,
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
           _this.tableData = res.detail
        _this.totalData = res.total
          // this.tableData = res;
          // this.getTotal(res.total)
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
    // 返回合计数据
    // getTotal(total) {
    //   // console.log(total);
    //   let arr = ["合计", ""];
    //   for (const key in this.totalData) {
    //     if (this.totalData[key] != "合计") {
    //       arr.push(this.totalData[key]);
    //     }
    //   }
    //   return arr;
    // },
    getTotal(param){
      let vm = this;
      let sums = [];           
        var selectedColm = param.columns;
        let newArray=[]
        selectedColm.forEach(a => {
            if(vm.totalData[a.property]){
                newArray.push(vm.totalData[a.property])
                }else{newArray.push('')}            
          });
        sums=newArray;
        sums[0] = "合计";
        sums[1]=""
        return sums;
    },
    selectChanged(val) {
        if(val == 1) {
          this.$set(this,'treeDatas',this.typeTreeDatas)
          this.parentId = this.treeDatas.tree.id;
        }
        else if(val == 2) {
           this.$set(this,'treeDatas',this.areaTreeDatas)
            this.parentId = this.treeDatas.tree.id;
        }
    },
    // 获取树的数据
    getTreeDatas() {
      let _this = this;
      let params = {
        busicode: "WaterTypeTree",
        data: {},
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          _this.typeTreeDatas.tree = res;
          _this.waterTypeNo = res.code;
        });
    },
      businessAreaSelect() {   //营业所下拉框
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.areaTreeDatas.tree = res;
      })
    },
    // 树的点击
    backTreeData(val) {
      let _this = this;
      this.parentId = val.id;
      this.waterTypeNo = val.code;
      //this.tableQuery.page = 1;
      if(this.tableQuery.statisticsWay == 1)
        this.tableQuery.waterTypeId = val.id;
      if(this.tableQuery.statisticsWay == 2)
        this.tableQuery.businessArea = val.id;
      let params = {
        busicode: "MonthWaterStatisticsReport",  
        data: this.tableQuery,
      };
      this.$api.fetch({ params: params }).then((res) => {
        _this.tableData = res.detail
        _this.totalData = res.total
      });
    },
    // 打印
    Print() {
      let arr = [];
      let params = {
        busicode: "MonthWaterStatisticsReportPrint",
        data: this.tableQuery,
      };
      this.$api.fetch({ params: params }).then((res) => {
        this.$notify({
          title: "成功",
          message: "正在打印...",
          type: "success",
        });
        this.common.print(
          "print",
          "MrMonthStatisticsReportPrint",
          "",
          res,
          this
        );
      });
    },
    // 导出
    exportExcel() {
      let params = {
        busicode: "MonthWaterStatisticsReportExport",
        data: this.tableQuery,
        token: sessionStorage.getItem("token"),
        sysType: "002",
      };
      window.open(
        this.common.getExportExcelIp() +
          "/project/exportExcel.api?json=" +
          encodeURI(JSON.stringify(params))
      );
    },
    // 获取施工日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.constBeginDate = date[0];
        this.tableQuery.constEndDate = date[1];
      } else {
        this.tableQuery.constBeginDate = "";
        this.tableQuery.constEndDate = "";
      }
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      if (this.tableQuery.statisticsWay == 1) {
        this.statisticsTypeName = this.statisticsWayData[0].name;
      } else if (this.tableQuery.statisticsWay == 2) {
        this.statisticsTypeName = this.statisticsWayData[1].name;
      } else if (this.tableQuery.statisticsWay == 3) {
        this.statisticsTypeName = this.statisticsWayData[2].name;
      } else if (this.tableQuery.statisticsWay == 4) {
        this.statisticsTypeName = this.statisticsWayData[3].name;
      }
      this.init();
    },
    // //分页
    // handleSizeChange(val) {
    //   //显示多少数据一页
    //   this.tableQuery.pageCount = val;
    //   this.tableQuery.page = 1;
    //   this.init();
    // },
    // handleCurrentChange(val) {
    //   //显示多少页码
    //   this.tableQuery.page = val;
    //   this.init();
    // },
    indexMethod(index) {
      //获取表格序号
      return (1 - 1) * 20 + (index + 1);
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    "tableQuery.statisticsWay": {
      handler: function (newval, oldval) {
          this.tableQuery.businessArea = "";
          this.tableQuery.waterTypeId = "";
          this.tableQuery.readingStaff = "";
          this.tableData = [];
          this.totalData = {};
        if (newval == "4") {
          //抄表员
          this.showStatisticsDialog = true;
          this.showBoreNoDialog = false;
          this.showAreaNoDialog = false;
          this.showWaterTypeDialog = false;
          //this.tableQuery.waterTypeNo = "";
        } else if (newval == "3") {
          //口径
          this.showStatisticsDialog = false;
          this.showBoreNoDialog = true;
          this.showAreaNoDialog = false;
          this.showWaterTypeDialog = false;
         // this.tableQuery.waterTypeNo = "";
        } else if (newval == "2") {
          //营业区域
          this.showStatisticsDialog = false;
          this.showAreaNoDialog = true;
          this.showBoreNoDialog = false;
          this.showWaterTypeDialog = false;
          //this.tableQuery.waterTypeNo = "";
        } else if (newval == "1") {
          //用水类型
          this.showStatisticsDialog = false;
          this.showWaterTypeDialog = true;
          this.showAreaNoDialog = false;
          this.showBoreNoDialog = false;
        } else {
          this.showStatisticsDialog = false;
          this.showBoreNoDialog = false;
          this.showWaterTypeDialog = true;
          this.showAreaNoDialog = false;
          //this.tableQuery.waterTypeNo = "";
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" >
.MeterReadingOfMonthlySummary {
  width: calc(100% - 20px);
  height: 100%;
  .main-container {
    height: calc(100% - 42px);  
         .company-content {
        width: 100%;
        height: 100%;
        // margin: 1% 0px;
        overflow: hidden;
        // box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
    }
    /*左侧div样式*/
    .company-left {
        width: calc(20% - 10px);  /*左侧初始化宽度*/   
        height: 90%;
        background: #FFFFFF;
        float: left;
    }
    /*拖拽区div样式*/
    .resize {
        cursor: col-resize;
        float: left;
        position: relative;
        top: 45%;
        background-color: #d6d6d6;
        border-radius: 5px;
        margin-top: -10px;
        width: 10px;
        height: 50px;
        background-size: cover;
        background-position: center;
        /*z-index: 99999;*/
        font-size: 32px;
        color: white;
    }
    /*拖拽区鼠标悬停样式*/
    .resize:hover {
        color: #444444;
    }
    /*右侧div'样式*/
    .company-right{
        float: left;
        width: 80%;   /*右侧初始化宽度*/
        height: 100%;
        background: #fff;
        // box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
    }
    
    
  }
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
  
}
// .el-table .cell {
//       text-align: left;
//     }
</style>