<template>
  <!-- 拆表 -->
  <div class="OtherReportOfCustomerInfoSummary">
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
               <div class="resize" title="收缩侧边栏">
		         	⋮
		       </div>
      <!-- index页面 -->
      <div v-if="indexShow" class="company-right">
         <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">
            <el-form-item label='年份：'>
              <el-date-picker v-model="tableQuery.year" type="year" value-format="yyyy"  :clearable="true">
              </el-date-picker>
            </el-form-item>


             <!-- <el-form-item label="营业区域：">
              <el-select clearable v-model="tableQuery.businessArea" placeholder="营业区域">
                <el-option v-for="item in businessArea" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>  -->
          <el-form-item label="营业区域：" class="width-150">
          <el-cascader
            ref="cascader"
            clearable
            v-model="tableQuery.businessArea"
            @change="getBusinessArea"
            :options="businessAreaData"
            :show-all-levels="false"
            :props="props"
          >
          </el-cascader>
              </el-form-item>
               <el-form-item > 
          <el-checkbox-group v-model="tableQuery.isShowEndLevel">
                    <el-checkbox label='1'>显示末级</el-checkbox>
                </el-checkbox-group>
               </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border show-summary :summary-method='getTotal' :data="tableData.list" class="OtherReportOfCustomerInfoSummary-table">

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="waterTypeName" min-width="60" label="用水类型">
            </el-table-column>

            <el-table-column prop="oldYearCountNum"  label="上年总户数(户)" align="right">
            </el-table-column>

            <el-table-column prop="newYearAddNum" label="本年增加户数(户)" align="right">
            </el-table-column>

            <el-table-column prop="newYearLessNum"  label="本年减少户数(户)" align="right">
            </el-table-column>

            <el-table-column prop="newYearCountNum"  label="本年末合计总户数(户)" align="right">
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
  name: "OtherReportOfUseType",
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
      },
      // 主页面显示与隐藏
      indexShow: true,
      businessAreaData: [],
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
      //查询条件对象
      tableQuery: {
        page: 1,
        year:"2021",
        pageCount: 20,
        waterTypeNo : '',
        businessArea: '',
        isShowEndLevel:[],
      },
      //面包屑
      crumbsData: {
        titleList: [{ title: "其它报表" }, { title: "用水类型统计表" }]
      },
      tableShow: false,
      maxHeight: 0,
      waterTypeNo:'',
      parentId:'',
      totalData:{},
    };
  },
  mounted() {
     this.selectBAreaOptions();
     this.dragControllerDiv()
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow5')
    this.getTreeDatas()
    // this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.init()
    this.common.changeTable(this, ".OtherReportOfCustomerInfoSummary", [
      ".OtherReportOfCustomerInfoSummary .toolbar",
      ".OtherReportOfCustomerInfoSummary .block",
      ".OtherReportOfCustomerInfoSummary #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
     this.tableQuery.businessArea = this.common.handleTreeData(
        this.tableQuery.businessArea
      );
      // console.log(this.tableQuery.isShowEndLevel)
      if(this.tableQuery.isShowEndLevel.length == 0){
        this.tableQuery.isShowEndLevel = ['0']
      }else if(this.tableQuery.isShowEndLevel.length > 1){
        this.tableQuery.isShowEndLevel = ['1']
      }
      let _this = this
      let params = {
        busicode: "WaterTypeSummaryReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res.detail
        _this.totalData = res.total
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
      // 导出
    exportExcel() {
      let params = {
        "busicode": "WaterTypeSummaryReportExport",
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
            if(vm.totalData[a.property]){
                newArray.push(vm.totalData[a.property])
                }else{newArray.push('')}            
          });
        sums=newArray;
        sums[0] = "合计";
        return sums;
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
        busicode: "WaterTypeSummaryReport",
        data: this.tableQuery
      };
      this.$api
        .fetch({params: params})
        .then(res => {
          _this.tableData = res.detail
          _this.totalData = res.total
        });
    },
      businessAreaSelect() {   //营业所下拉框
      let _this = this
      let params = {
        busicode: "BusinessAreaSelect",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.businessArea = res
      })
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
.OtherReportOfCustomerInfoSummary {
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
  // .index-page {
  //   height:calc(100% - 41px);
  // }
//   .el-table .cell{
//     text-align: left;
//   }
}
</style>
