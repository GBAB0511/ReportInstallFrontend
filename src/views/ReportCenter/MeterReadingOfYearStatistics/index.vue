<template>
  <!-- 拆表 -->
  <div class="MeterReadingOfYearStatistics">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right" v-if="indexShow">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div class="company-content">
      <div class="company-left">
        <auto-tree :treeData="treeDatas" @sendTreeData="getTreeChildren"></auto-tree>
      </div>
       <div class="resize" title="收缩侧边栏">
		         	⋮
		       </div>
      <div class="company-right">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

            <el-form-item label="年份：">
              <el-date-picker v-model="tableQuery.year" size="mini" type="year" unlink-panels format="yyyy" value-format="yyyy" placeholder="选择年"></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table">
          <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData" class="wuserInfo-table">
            <el-table-column type="index" label="NO." min-width="50" :index="indexMethod"></el-table-column>

            <el-table-column prop="useWaterType" min-width="100" label="用水类型"  show-overflow-tooltip></el-table-column>

            <el-table-column prop="month1" min-width="100" label="一月" align="right">
            </el-table-column>

            <el-table-column prop="month2" min-width="100" label="二月" align="right">
            </el-table-column>

            <el-table-column prop="month3" min-width="100" label="三月" align="right">
            </el-table-column>

            <el-table-column prop="month4" min-width="100" label="四月" align="right">
            </el-table-column>

            <el-table-column prop="month5" min-width="100" label="五月" align="right">
            </el-table-column>

            <el-table-column prop="month6" min-width="100" label="六月" align="right">
            </el-table-column>

            <el-table-column prop="month7" min-width="100" label="七月" align="right">
            </el-table-column>

            <el-table-column prop="month8" min-width="100" label="八月" align="right">
            </el-table-column>

            <el-table-column prop="month9" min-width="100" label="九月" align="right">
            </el-table-column>

            <el-table-column prop="month10" min-width="100" label="十月" align="right">
            </el-table-column>

            <el-table-column prop="month11" min-width="100" label="十一月" align="right">
            </el-table-column>

            <el-table-column prop="month12" min-width="100" label="十二月" align="right">
            </el-table-column>

            <el-table-column prop="total" min-width="100" label="合计" show-overflow-tooltip align="right">
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <!-- <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
          </div> -->
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "MeterReadingOfYearStatistics",
  components: {
       autoTree
  },
  data() {
    return {
      // 主页面显示与隐藏
      indexShow: true,



      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        year: '',
        userWaterType: '',
      },
      // 查询条件日期
      Time: [],
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 详情页面所需数据
      editNeedData: {},
      //面包屑
      crumbsData: {
        titleList: [{ title: "抄表水量报表" }, { title: "水量年统计报表" }]
      },
      tableShow: false,
      maxHeight: 0,

      //公司组件树
      treeDatas: {
        // 树数据
        tree: [
          {
            children: [],
            businessAbode: "",
            showName: "全部"
          }
        ],
        // 树的label和children 字段分别是对应的什么字段
        defaultProps: {
          label: "name",
          children: "children"
        },
        // 输入框的一些选项
        inputProp: {
          // 是否显示input框
          showSearch: true,
          // placeholder提示
          Inp_placeholder: "请输入节点"
        },
        // 根节点名称
        rootName: "所有",
        // 返回的字段
        sendTreeProp: [
          "id",
          "name",
          "children",
        ],
        // 默认展开某一个节点
        defaultOpen: {
          // 节点的唯一key
          nodeKey: "businessAbode"
          // 默认展开的节点 ，和key对应
          // nodeItem:'',
        }
      }
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow3')
    let time = new Date()
    this.tableQuery.year = time.getFullYear() + ''
    this.dragControllerDiv()
    this.backTreeData()
    // this.init()
    this.getDictionary()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".MeterReadingOfYearStatistics", [
      ".MeterReadingOfYearStatistics .toolbar",
      ".MeterReadingOfYearStatistics .block",
      ".MeterReadingOfYearStatistics #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "YearWaterStatistics",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
      })
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
    //树接口
    backTreeData() {
      let _this = this;
      let params = {
        busicode: "WaterTypeTree",
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.treeDatas.tree[0].children = res.children
        });
    },
    getTreeChildren(val) {
      console.log(val)
      if(val.id==="暂无"){
        this.tableQuery.userWaterType="";
      }else{
        this.tableQuery.userWaterType = val.id
      }
      
      this.init()
    },
    // 导出
    exportExcel() {
      let params = {
        "busicode": "YearWaterStatisticsExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },







    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MRM"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 查询
    search() {
      //this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 详情按钮
    details(row) {
      this.editNeedData = row
      this.editNeedData.busicode = 'MsChgUpdate'
      this.editNeedData.saveType = 'edit'
      this.TableDismantlingHandleShow = true
      this.indexShow = false
    },
    // 暂存（调详情页面保存方法）
    save() {
      this.$refs.TableDismantlingHandle.save()
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      //this.tableQuery.pageCount = val
      //this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      //this.tableQuery.page = val
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (1 - 1) * 20 + (index + 1);
    },
    closeDialog() {
      this.DetailedEnquiriesVisible = false //查看历史
      this.TableDismantlingHandleShow = false //详情界面
      this.indexShow = true //index页面
      this.init()
    },
    // 添加按钮
    add() {
      this.DetailedEnquiriesVisible = true
      this.indexShow = false
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
.MeterReadingOfYearStatistics {
  width: 100%;
  height: 100%;
       .company-content {
        width: 100%;
        height: 100%;
        // margin: 1% 0px;
        overflow: hidden;
        // box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
    }
    /*左侧div样式*/
    .company-left {
        width: calc(22% - 10px);  /*左侧初始化宽度*/   
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
        width: 78%;   /*右侧初始化宽度*/
        height: 100%;
        background: #fff;
        // box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
    }
    .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
  // .index-page {
  //   height: calc(100% - 41px);
  // }
}
</style>
