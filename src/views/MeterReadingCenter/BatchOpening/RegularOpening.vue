<template>
  <div class="Regular-Opening">
    <!-- 按户开账模块 -->
    <div v-if="indexShow==1" class="company-content">
      <div class="company-left">
        <auto-tree :treeData="treeDatas" @sendTreeData="getTreeChildren"></auto-tree>
      </div>
            <div class="resize" title="收缩侧边栏">
		         	⋮
		       </div>
      <div class="company-right">
        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="账期：">
              <el-date-picker  @change="accountPeriodChange"
                v-model="tableQuery.accountPeriod"
                size="mini"
                type="month"
                unlink-panels
                format="yyyy-MM"
                value-format="yyyyMM"
                placeholder="选择月"
                class="accountPeriod"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="开账状态：">
              <el-select ref="select1" clearable v-model="tableQuery.openAccountStatus" placeholder="全部">
                <el-option
                  v-for="(item,index) in openAccountStatusData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户编号：" class="width-250">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" clearable size="mini" @keydown.enter.native="demand" palceholder="请输入用户编号"></el-input>
              </el-form-item>
              <el-form-item label="抄表员：">
                <el-select ref="select2" v-model="tableQuery.meterReadingStaff" size="mini">
                  <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="抄表日期：" class="width-250">
            <el-date-picker v-model="meterReadingDate" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
            highlight-current-row
            stripe
            border
            :data="tableData.list"
            @selection-change="getItemList"
            class="change-tables-table"
            @row-click = "btn"
            ref="eltableCurrentRow"
            @sort-change='getSort'
          >
            <el-table-column type="selection" fixed="left" width="55"></el-table-column>
            <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="status" min-width="80" fixed="left" label="开账状态"></el-table-column>
            <el-table-column prop="userNo" min-width="150" fixed="left" label="用户编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ctmName" min-width="250" label="客户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员"></el-table-column>
            <el-table-column prop="useWaterType" min-width="200" label="用水类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="priorPeriodNum" min-width="100" label="上期抄码" align="right"></el-table-column>
            <el-table-column prop="currendPeriodNum" min-width="100" label="本期抄码" align="right"></el-table-column>
            <el-table-column prop="currendPeriodWater" min-width="120" label="本期用水" align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>
            <el-table-column prop="addWater" min-width="100" label="增减水量" align="right"></el-table-column>
            <el-table-column prop="shareWater" min-width="100" label="分摊水量" align="right"></el-table-column>
            <el-table-column prop="realityWater" min-width="100" label="实际用水量" align="right"></el-table-column>
            <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期"></el-table-column>
            <el-table-column prop="openAccountTime" min-width="120" label="开帐时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="openAccountStaffName" min-width="120" label="开账人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="reviewName" min-width="120" label="复核人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="reviewFlag" min-width="120" label="复核状态" show-overflow-tooltip></el-table-column>
            <el-table-column prop="reviewTime" min-width="120" label="复核时间" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="position7" min-width="100" label="六期平均"></el-table-column>
            <el-table-column prop="usn1" min-width="100" label="用水分类"></el-table-column>
            <el-table-column prop="usn" min-width="100" label="费用合计"></el-table-column>-->
            <!-- <el-table-column label="操作" fixed="right" width="85">
              <template slot-scope="scope">
                <el-button type="text" @click="details(scope.row)" style="font-size:12px;">详情</el-button>
              </template>
            </el-table-column>-->
          </el-table>

        </div>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableQuery.page"
          :page-sizes="[20, 100, 500, 1000]"
          :page-size="tableQuery.pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog :close-on-click-modal="false" title="开账详情" :visible.sync="enterMeterDataShow">
      <RegularOpeningEdit
        v-if="enterMeterDataShow"
        :regularOpeningEditNeedData="regularOpeningEditNeedData"
      ></RegularOpeningEdit>
    </el-dialog>
  </div>
</template>
<script>
import RegularOpeningEdit from "./RegularOpeningEdit";
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "Regular-Opening-index",
  components: {
    RegularOpeningEdit,
    autoTree
  },
  data() {
    return {
      flag:false,//行点击boolean值
      indexShow: 1, //1 index主页 2编辑页
      // 查询条件对象
      tableQuery: {
        page:1,
        pageCount:20,
        // 账期
        accountPeriod: this.common.date('month'),
        // 抄表员
        meterReadingStaff: "",
        // 开账状态
        openAccountStatus: "",
        // 册本号
        bookNo: "",
        // 营业区域
        businessArea: "",
        // page: 1,
        // pageCount: 20
        sort: "",
        startMeterReadingDate: "",
        endMeterReadingDate: "",
      },
      // 列表数据
      tableData: {},
      // 抄表员
      meterReaderList: [],

      // 选中数据的id数组
      idList: [],

      // 左侧树点击的数据的bookNo
      backTreeBookNo: "",

      // 详情页所需数据
      regularOpeningEditNeedData: {},

      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表中心", path: "/MeterReadingCenter" },
          { title: "开账", path: "/BatchOpening" },
          {
            title: "常规开账",
            method: () => {
              window.histroy.back();
            }
          }
        ]
      },
      //公司组件树
      treeDatas: {
        // 树数据
        tree: [
          {
            books: [],
            businessAbode: "",
            showName: "全部"
          }
        ],
        // 树的label和children 字段分别是对应的什么字段
        defaultProps: {
          label: "showName",
          children: "books"
        },
        // 输入框的一些选项
        inputProp: {
          // 是否显示input框
          showSearch: true,
          // placeholder提示
          Inp_placeholder: "请输入册本号"
        },
        // 根节点名称
        rootName: "总部",
        // 返回的字段
        sendTreeProp: [
          "businessAbodeName",
          "businessAbode",
          "books",
          "totalWater",
          "totalUser",
          "showName",
          "meterReadingAmount",
          "bookNo",
          "bookName",
          "abnormalAmount"
        ],
        // 默认展开某一个节点
        defaultOpen: {
          // 节点的唯一key
          nodeKey: "businessAbode"
          // 默认展开的节点 ，和key对应
          // nodeItem:'',
        }
      },
      dialogFormVisible: false, //弹出表单
      // 开账状态下拉数据
      openAccountStatusData: [
        { value: "", name: "全部" },
        { value: "0", name: "未开账" },
        { value: "1", name: "已开账" }
      ],
      rules: {
        Applicant: [
          { required: true, message: "请输入申请人", trigger: "blur" }
        ],
        applicantDate: [
          { required: true, message: "请输入申请日期", trigger: "blur" }
        ],
        engineerType: [
          { required: true, message: "请选择工程类型", trigger: "change" }
        ],
        Contacts: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        documentType: [
          { required: true, message: "请输入证件类型", trigger: "blur" }
        ],
        documentNumber: [
          { required: true, message: "请输入证件号码", trigger: "blur" }
        ],
        contactNumber: [
          { required: true, message: "请输入座机号码", trigger: "blur" }
        ],
        Emergency: [
          { required: true, message: "请选择紧急程度", trigger: "change" }
        ]
      },
      maxHeight: 0,
      tableShow: false,
      treedata: [],
      enterMeterDataShow: false,
      isActive: false,
      meterReadingDate: ["", ""], // 抄表日期
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  mounted() {
    this.init();
    this.dragControllerDiv()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".Regular-Opening", [
      ".Regular-Opening .company-right .toolbar",".Regular-Opening .company-right .block"
    ]);

    //左侧树接口
    this.backTreeData();
    //抄表员下拉框
    this.getReadingStaff();
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
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
         btn(row,col,event){
 //把这个flag 变成当前的行的私有物,这样一来,每次变化的时候, 变化的都是你当前行的布尔值,
      row.flag = !row.flag;
      this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);
    },
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "MrOpenAccountListByUser",
        data: {
          page:this.tableQuery.page,
          pageCount:this.tableQuery.pageCount,
          accountPeriod: this.tableQuery.accountPeriod, // 账期
          meterReadingStaff: this.tableQuery.meterReadingStaff, // 抄表员
          openAccountStatus: this.tableQuery.openAccountStatus, // 开账状态
          bookNo: this.tableQuery.bookNo, // 册本号
          userNo: this.tableQuery.userNo, // 用户编号
          businessArea: this.tableQuery.businessArea, // 营业区域
          sort: this.tableQuery.sort, // 排序
          startMeterReadingDate: this.tableQuery.startMeterReadingDate,
          endMeterReadingDate: this.tableQuery.endMeterReadingDate,
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    demand(){
      this.tableQuery.page=1,
      this.tableQuery.pageCount=20,
      this.init();
    },
    //查询
    accountPeriodChange() {
      this.backTreeData();
    },
    // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    //树接口
    backTreeData() {
      let _this = this;
      let params = {
        busicode: "MrOpenAccountTree",
        data: {
          accountPeriod: this.tableQuery.accountPeriod, // 账期
          meterReadingStaff: this.tableQuery.meterReadingStaff, // 抄表员
          openAccountStatus: this.tableQuery.openAccountStatus, // 开账状态
          bookNo: this.backTreeBookNo // 册本号
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.treeDatas.tree[0].books = res;
        });
    },

    // 左侧树点击事件
    getTreeChildren(val) {
       console.log(val);
      if (val.businessAbode!='暂无') {
        this.tableQuery.businessArea = val.businessAbode
      }else{
        this.tableQuery.businessArea = ''
      }
      if (val.bookNo != "暂无") {
        this.tableQuery.bookNo = val.bookNo;
        this.init();
      }else {
        this.tableQuery.bookNo = '';
        this.init();
      }
    },

    // 开账方法（由父页面调用）
    openAccount() {
      let _this = this;
      if(_this.idList.length===0){
        _this.$message({
            type: "warning",
            message: "请先选择至少一行记录"
          });
          return;
      }
      this.$confirm("是否确定开账?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let params = {
            busicode: "MrOpenAccountByUser",
            data: [...this.idList]
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              _this.$message({
                message: "已放入开账队列中，请稍后再次查询该页面查看结果。",
                type: "success"
              });
              _this.init();
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消开账"
          });
        });
    },
    // 销账方法（由父页面调用）
    offAccount() {
      let _this = this;
      if(_this.idList.length===0){
        _this.$message({
            type: "warning",
            message: "请先选择至少一行记录"
          });
          return;
      }
      this.$confirm("是否确定销账?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let params = {
            busicode: "MrOpenAccountCannelByUser",
            data: [...this.idList]
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              _this.$message({
                message: "已放入销账队列中，请稍后再次查询该页面查看结果。",
                type: "success"
              });
              _this.init();
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消销账"
          });
        });
    },
    // 作废方法（由父页面调用）
    toVoid() {
      let _this = this;
      if(_this.idList.length===0){
        _this.$message({
            type: "warning",
            message: "请先选择至少一行记录"
          });
          return;
      }
      this.$confirm("是否确定作废?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let params = {
            busicode: "MrOpenAccountInvalid",
            data: [...this.idList]
          };
          _this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              _this.$message({
                message: "作废成功！",
                type: "success"
              });
              _this.init();
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消作废"
          });
        });
    },

    // 获取列表选中的数据
    getItemList(itemList) {
      this.idList = [];
      itemList.forEach(item => {
        this.idList.push({ id: item.id, accountPeriod: this.tableQuery.accountPeriod });
      });
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
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
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        $(".el-table--fit").css("height", "66%");
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
        $(".el-table--fit").css("height", "50%");
      }
    },
    getSort(sort){
      if (sort.order === 'descending'){
        this.tableQuery.sort = 'X.CURREND_PERIOD_WATER DESC';
      }else if (sort.order === 'ascending'){
        this.tableQuery.sort = 'X.CURREND_PERIOD_WATER ASC';
      }else {
        this.tableQuery.sort = '';
      }
      this.init();
    },
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.startMeterReadingDate = date[0]
        this.tableQuery.endMeterReadingDate = date[1]
      } else {
        this.tableQuery.startMeterReadingDate = ''
        this.tableQuery.endMeterReadingDate = ''
      }
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
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.Regular-Opening {
  height: 100%;
  .company-content {
    width: 100%;
    height: 100%;
        // margin: 1% 0px;
    overflow: hidden;
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
    .company-right {
        float: left;
        width: 80%;   /*右侧初始化宽度*/
        height: 100%;
        background: #fff;
      .toolbar {
        /deep/ {
          .accountPeriod {
            padding-left: 0;
            .el-input__inner {
              width: 120px !important;
            }
          }
        }
      }
    }
  }
}
/deep/ {
  .el-tree-node>.el-tree-node__children{
    overflow: inherit;
  }
}
</style>

