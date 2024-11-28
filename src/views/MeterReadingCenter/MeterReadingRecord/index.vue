<template>
  <div class="Meter-Reading-Record">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- //初始化按钮 -->
      <div class="bread-contain-right" v-if="divChange==1">
        <el-button size="mini" type="primary" @click="dataEntryShow">录入</el-button>
        <el-button size="mini" type="primary" @click="CollectionImportShow" icon="el-icon-download">集抄导入</el-button>
        <el-button size="mini" type="primary" icon="el-icon-bottom" @click="downloadTemplate">下载模板</el-button>
        <el-upload class="upload-demo" multiple action="/" :http-request="importExcel">
          <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
        </el-upload>
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
      </div>
      <!-- //录入 -->
      <div class="bread-contain-right" v-else-if="divChange==0">
        <el-button icon="el-icon-caret-left" size="mini" @click="callBack">返回</el-button>
      </div>
      <!-- //集抄导入 -->
      <div class="bread-contain-right" v-else-if="divChange==2">
        <el-button size="mini" type="primary" @click="clearDate">清除异常数据</el-button>
        <el-button size="mini" type="primary" @click="submitDataCollec">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="callBack">返回</el-button>
      </div>
    </div>
    <!-- 主界面列表 -->
    <div class="company-content" ref="company-content" v-show="divChange==1">
      <div class="company-left">
        <div class="toolbarRecord">
          <el-form :inline="true" size="mini" :rules="treeFormRules" :model="tableQuery" ref="treeForm" class="demo-form-inline">
            <!-- 账期 -->
            <el-form-item label>
              <el-date-picker v-model="tableQuery.accountPeriod" @change="accountPeriodChange" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
            </el-form-item>
            <!-- 抄表员 -->
            <el-form-item class="readingStaff" label>
              <el-select v-model="tableQuery.meterReadingStaff" @change="meterReadingStaffChange" size="mini" placeholder="抄表员">
                <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="businessArea" label=" " prop="businessArea" :show-message="false">
              <el-cascader ref="cascader" placeholder="请选择营业区域" v-model="tableQuery.businessArea" @change="businessAreaChange" :options="businessAreaData" :show-all-levels="false" :props="props" />
            </el-form-item>

          </el-form>
        </div>
        <BookNoTree ref="tree" :treeData="treeDatas" @sendTreeData="getTreeChildren"></BookNoTree>
      </div>
      <div class="resize" title="收缩侧边栏">
        ⋮
      </div>
      <div class="company-right">
        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="账期：">{{tableQuery.accountPeriod}}</el-form-item>
            <el-form-item label="册本号：">{{treeBooks.bookNo}}</el-form-item>
            <el-form-item label="册本：">{{treeBooks.bookName}}</el-form-item>
            <el-form-item label="总水量：">
              <font color="red">{{treeBooks.totalWater}}</font>
            </el-form-item>
            <el-form-item label="应抄：">
              <font color="red">{{treeBooks.totalUser}}</font>
            </el-form-item>
            <el-form-item label="异常户数：">
              <font color="red">{{treeBooks.abnormalAmount}}</font>
            </el-form-item>
            <el-form-item label="已抄：">
              <font color="green">{{treeBooks.meterReadingAmount}}</font>
            </el-form-item>
            <br />

            <el-form-item label="用户编号：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" clearable @keydown.enter.native="search"></el-input>
            </el-form-item>

            <el-form-item label="水量状态：">
              <el-select ref="select1" v-model="tableQuery.abnormalStatus" size="mini" clearable>
                <el-option v-for="item in dictionaryData.WEP" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="册本号：" >
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" clearable placeholder="册本号"></el-input>
            </el-form-item>-->

            <el-form-item label="是否抄表：">
              <el-select ref="select2" v-model="tableQuery.readingStatus" clearable size="mini">
                <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注：" class="width-200">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.comments" clearable @keydown.enter.native="search"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table">
          <div class="rightBtn">
            <el-button type="primary" size="mini" @click="batchDelete">批量删除</el-button>
          </div>
          <el-table ref="meterReadRecordTable" highlight-current-row v-if="tableShow" :max-height="maxHeight-10" stripe border :data="tableData.list" class="wuserInfo-table" @sort-change="sortChange" @selection-change="handleSelection" @select-all="selectAll">
            <el-table-column type="index" label="NO." min-width="50" :index="indexMethod" fixed="left"></el-table-column>
            <el-table-column type="selection" width="50" fixed="left" :selectable="canSelect"></el-table-column>
            <el-table-column prop="userNo" min-width="150" label="用户编号">
              <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="priorPeriodNum" min-width="90" label="上期抄码" show-overflow-tooltip align="right"></el-table-column>
            <el-table-column prop="currendPeriodNum" min-width="110" label="本期抄码" show-overflow-tooltip align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>
            <el-table-column prop="currendPeriodWater" min-width="110" label="本期水量" show-overflow-tooltip align="right" :sort-orders="['descending', 'ascending',null]" :sortable="'custom'"></el-table-column>
            <el-table-column prop="addWater" min-width="90" label="增减水量" align="right"></el-table-column>
            <el-table-column prop="shareWater" min-width="90" label="分摊水量" align="right"></el-table-column>
            <el-table-column prop="realityWater" min-width="110" label="实际用水量" align="right"></el-table-column>
            <el-table-column prop="setupMeterAddr" min-width="200" label="装表地址" show-overflow-tooltip align="left"></el-table-column>
            <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期"></el-table-column>
            <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createName" min-width="100" label="录单员" show-overflow-tooltip></el-table-column>
            <el-table-column prop="meterReadFlagName" min-width="100" label="抄表标记" show-overflow-tooltip></el-table-column>
            <el-table-column prop="statusName" min-width="80" label="抄表状态" fixed="left">
              <template slot-scope="scope">
                <p v-if="scope.row.statusName === '正常'" style="color: rgb(28, 184, 96)">{{scope.row.statusName}}</p>
                <p v-else style="color: red;">{{scope.row.statusName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100px">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="dataEntryShow(scope)">详情</el-button>
                <el-button size="mini" type="text" v-if="scope.row.statusName !== '未抄' " @click="deleteData(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <!-- 录入 -->
    <MeterReadingDataEntry @calback="closeDialog" :booksVal="booksVal" v-if="divChange==0"></MeterReadingDataEntry>
    <!-- 集抄导入 -->
    <DataCollectionEdit ref="DataCollectionEdit" @calback="closeDialog" :booksVal="booksVal" v-else-if="divChange==2"></DataCollectionEdit>
  </div>
</template>
<script>
import MeterReadingDataEntry from "./MeterReadingDataEntry";
import DataCollectionEdit from "./DataCollectionEdit";
import BookNoTree from "./BookNoTree"
export default {
  name: "Meter-Reading-Record-index",
  components: {
    MeterReadingDataEntry,
    DataCollectionEdit,
    BookNoTree
  },
  data () {
    return {
      //列表存值
      tableData: [],
      businessAreaData: [], //营业区域下拉框
      props: {
        emitPath: false,
      },
      booksVal: {
        accountPeriod: "",
        bookNo: "",
        userNo: "",
        index: "",
        readingStatus: "",
      },
      treeBooks: {
        bookNo: "", //册本号
        //showName: "", //册本号
        bookName: "", //册本名称
        showName: "", //树显示名称
        totalWater: "", //总水量
        totalUser: "", //总户数
        abnormalAmount: "", //异常户数
        meterReadingAmount: "" //已抄
      },
      treeFormRules: {
        businessArea: [
          { type: "string", required: true, message: '请输入营业区域', trigger: 'blur' }
        ]
      },
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "抄表" },
          { title: "抄表录入" }
        ]
      },
      statusOption: [
        {
          //树结构格式
          value: 1,
          label: "已抄"
        },
        {
          value: 0,
          label: "未抄"
        },
        {
          value: "",
          label: '全部'
        }
      ],
      isActive: false, //控制高级查询内容的显示
      dialogFormVisible: false, //弹出表单
      dialogCollectionImportShow: false, //集抄弹出表单
      tableQuery: {
        //查询表单数据
        page: 1,
        pageCount: 20,
        accountPeriod: this.common.date('month'), //账期
        bookNo: "", //册本号
        userNo: "", //用户编号
        meterReadingStaff: "", //抄表员
        readingStatus: "", //抄表状态
        abnormalStatus: "", //异常状态
        businessArea: "",
        comments: "",
        sortField: "",
        sortOrder: "",
      },

      //数据字典
      dictionaryData: [],
      //抄表员
      meterReaderList: [],
      maxHeight: 0,
      tableShow: false,
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      divChange: 1,
      //公司组件树
      treeDatas: {
        // 树数据
        tree: [
          {
            books: [],
            businessAbode: "",
            showName: "全部",
            nodeId: 'all'
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
        rootName: "全部",
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
          "abnormalAmount",
          "nodeId"
        ],
        // 默认展开某一个节点
        defaultOpen: {
          // 节点的唯一key
          nodeKey: "nodeId",
          // 默认展开的节点 ，和key对应
          // nodeItem: ["41"],
        }
      },
      clickNode: null,
      multipleSelectData: [], // 多选数据
      isBatchDelete: false, // 是否批量删除
    };
  },
  mounted () {
    this.dragControllerDiv();
    let _this = this;
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow3");
    _this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      _this.common.changeTable(_this, ".Meter-Reading-Record .company-right", [
        ".Meter-Reading-Record .toolbar",
        ".Meter-Reading-Record .block",
        // ".Meter-Reading-Record .bread-contain",
      ]);
    });
    this.selectBAreaOptions();
    // 抄表员下拉数据
    this.getReadingStaff()
    //数据字典接口
    this.getDictionary();
  },
  methods: {
    toDetail (userNo) {
      console.log(userNo);
      // window.open('#/UserInfoSearchDetail','')
      //  this.$router.push('/UserInfoSearchDetail')
      let routeUrl = this.$router.resolve({ path: '/UserInfoSearchDetail' });
      sessionStorage.setItem('userNo', userNo)
      window.open(routeUrl.href, '_blank');
      sessionStorage.removeItem('userNo')
    },
    enterEvents (e) {
      if (e.keyCode == 13) {
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
    //树接口
    backTreeData () {
      let _this = this;
      let params = {
        busicode: "BookCheckTree",
        data: {
          accountPeriod: this.tableQuery.accountPeriod, //账期
          meterReadingStaff: this.tableQuery.meterReadingStaff, //抄表员
          businessArea: this.tableQuery.businessArea//营业区域
        }
      };

      this.$refs['treeForm'].validate((valid) => {
        if (valid) {
          this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              _this.treeDatas.tree[0].books = res;
              if (this.clickNode) {
                this.$set(this.treeDatas.defaultOpen, 'nodeItem', [this.clickNode])
                this.$nextTick(() => {
                  this.$refs.tree.refreshChecked(this.clickNode)
                })
              }
            });
        } else {
          this.$message({
            type: "error",
            message: "请选择营业区域"
          });
          return false;
        }
      });



    },
    selectBAreaOptions (id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res)
        _this.businessAreaData = data.children;
        if (_this.businessAreaData.length === 1 && _this.businessAreaData[0].isParent == false) {
          this.tableQuery.businessArea = _this.businessAreaData[0].value
          this.backTreeData()
        }
      })
    },
    //树结构数据处理
    getArr (data) {
      function abc (arr) {
        arr.map(i => {
          i.label = i.name
          i.value = i.id
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
    //初始化
    init () {
      let tableQuery = { ...this.tableQuery }
      delete tableQuery.businessArea;
      let _this = this;
      let params = {
        busicode: "MrRecordList",
        data: tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
          if (res.list.length > 0) {
            this.tableQuery.bookNo = res.list[0].bookNo; //册本号
          }
          //改变表格高度
          _this.common.changeTable(_this, ".Meter-Reading-Record .company-right", [
            ".Meter-Reading-Record .toolbar",
            ".Meter-Reading-Record .block",
            ".Meter-Reading-Record .bread-contain",
          ]);
          _this.$nextTick(() => {
            this.$refs.meterReadRecordTable.doLayout();
          })
        })
        .catch(() => {
          this.clearTreeDate()
        });
    },
    // 数据字典数据获取
    getDictionary () {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "WEP," //异常类型
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    // 抄表员数据获取
    getReadingStaff () {
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
    //下载模板
    downloadTemplate () {
      var params = {
        busicode: "MrRecordImportTemplate",
        data: {
          accountPeriod: this.tableQuery.accountPeriod,
          bookNo: this.treeBooks.bookNo
        },
        token: sessionStorage.getItem('token'),
        // token: "krrjdev123",//
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    getTreeChildren (val) {
      if (val.books.length > 0) {
        if (val.businessAbode == "暂无") {
          this.tableQuery.bookNo = val.bookNo; //册本号
          this.treeBooks.bookNo = val.bookNo; //册本号
          this.treeBooks.bookName = val.bookName; //册本名称
          this.treeBooks.showName = val.showName; //树显示名称
          this.treeBooks.totalWater = val.totalWater; //总水量
          this.treeBooks.totalUser = val.totalUser; //总户数
          this.treeBooks.abnormalAmount = val.abnormalAmount; //异常户数
          this.treeBooks.meterReadingAmount = val.meterReadingAmount; //已抄
          this.clickNode = val.nodeId
          this.init();
        } else {
          this.clearTreeDate();
        }
      } else {
        this.$notify({
          title: "警告",
          message: val.showName + "暂无册本",
          type: "warning"
        });
        this.clearTreeDate();
      }
    },
    handleCollapse () {
      this.expandNode = null
    },
    clearTreeDate () {
      this.tableQuery.bookNo = ""; //册本号
      this.treeBooks.bookNo = ""; //册本号
      this.treeBooks.bookName = ""; //册本名称
      this.treeBooks.showName = ""; //树显示名称
      this.treeBooks.totalWater = ""; //总水量
      this.treeBooks.totalUser = ""; //总户数
      this.treeBooks.abnormalAmount = ""; //异常户数
      this.treeBooks.meterReadingAmount = ""; //已抄
      this.tableData = [];
    },

    //集抄导入 删除异常数据
    clearDate () {
      this.$refs.DataCollectionEdit.clearDate(); //
    },
    //集抄导入 保存数据
    submitDataCollec () {
      this.$refs.DataCollectionEdit.submitDataCollec(); //
    },
    //查询
    search () {
      this.init();
    },
    //查询
    accountPeriodChange () {
      this.backTreeData();
      this.clearTreeDate();
    },
    //查询
    meterReadingStaffChange () {
      this.backTreeData();
      this.clearTreeDate();
    },
    //查询
    businessAreaChange () {
      this.backTreeData();
      this.clearTreeDate();
    },
    // 高级查询按钮事件
    hidden () {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        // this.common.changeTable(
        //   this,
        //   ".Meter-Reading-Record .Meter-Reading-Record-right",
        //   [".Meter-Reading-Record .table-top"]
        // );
        _this.common.changeTable(_this, ".Meter-Reading-Record .company-right", [
          ".Meter-Reading-Record .toolbar",
          ".Meter-Reading-Record .block",
          // ".Meter-Reading-Record .bread-contain",
        ]);

      });
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    //显示集抄界面
    CollectionImportShow () {
      this.divChange = 2;
      this.booksVal.bookNo = this.tableQuery.bookNo;
      this.dialogCollectionImportShow = true;
    },
    // 导入按钮
    importExcel (file) {
      let _this = this;
      console.log(file);
      let params = {
        busicode: "MrRecordImport",
        type: "import", //导入
        data: {
          file: file.file
        }
      };
      this.$api
        .fetch({
          params: params
        })
        .then(res => {
          _this.$message({
            message: "导入数据成功！",
            type: "success"
          });
        });
    },
    // 导出按钮
    exportExcel () {
      var _this = this;
      // 添加册本不能为空限制条件，减少导出数据量
      if (this.tableQuery.bookNo == "") {
        this.$notify({
          title: "警告",
          message: "请在先在左侧选择册本",
          type: "warning"
        });
        return;
      }
      var params = {
        busicode: "MrRecordExport",
        data: JSON.parse(JSON.stringify(this.tableQuery)),
        token: sessionStorage.getItem('token'),
        //token: "krrjdev123",
        sysType: "002"
      };
      // 入参不需要分页
      delete params.data.page;
      delete params.data.pageCount;
      window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    //显示录入界面
    dataEntryShow (scope) {
      this.booksVal = {}
      if (this.tableQuery.bookNo == "") {
        this.$notify({
          title: "警告",
          message: "请在先在左侧选择册本",
          type: "warning"
        });
      } else {
        if (scope.$index || scope.$index >= 0) {
          this.booksVal.index = this.tableData.index;
          this.booksVal.userNo = scope.row.userNo
        }
        this.booksVal.accountPeriod = this.tableQuery.accountPeriod
        this.booksVal.bookNo = this.tableQuery.bookNo;
        this.booksVal.readingStatus = this.tableQuery.readingStatus;
        this.divChange = 0;
      }
    },
    deleteData (scope) {
      let _this = this;
      let params = {
        busicode: "MrOpenAccountInvalid",
        data: []
      };
      if (_this.isBatchDelete) { // 批量删除
        params.data = _this.multipleSelectData;
      } else { // 单条数据删除
        if (!scope.row) {
          _this.$message({
            type: "warning",
            message: "请先选择至少一行记录"
          });
          return;
        }
        params.data = [scope.row]
      }
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        console.log('delte params', params)
        // return;
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
            this.isBatchDelete = false;
          });
      }).catch(() => {
        _this.$message({
          type: "info",
          message: "已取消作废"
        });
        this.isBatchDelete = false;
      });
    },
    callBack () {
      this.divChange = 1;
      this.init();
      // this.booksVal = {
      //   bookNo: "",
      //   index: ""
      // };
      // this.clearTreeDate();
      console.log('返回')
      this.backTreeData()
    },
    closeDialog (val) {
    },
    sortChange (column) {
      this.tableQuery.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery.sortOrder = 2
      } else {
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.init()
    },
    handleSelection (val) {
      this.multipleSelectData = val;
    },
    // 批量删除
    batchDelete () {
      if (this.multipleSelectData.length <= 0) {
        this.$message({
          message: '请选择需要删除的行',
          type: 'warning'
        })
        return;
      }
      this.isBatchDelete = true;
      this.deleteData();
    },
    canSelect (row) {
      return row.statusName === '正常' ? true : false
    },
    selectAll (selections) {
    }
  },
  watch: {
    maxHeight () {
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
.Meter-Reading-Record {
  height: 100%;
  width: 100%;
  /* 拖拽相关样式 */
  /*包围div样式*/
  .company-content {
    width: 100%;
    height: 100%;
    // margin: 1% 0px;
    overflow: hidden;
    // box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
  }
  /*左侧div样式*/
  .company-left {
    width: calc(22% - 10px); /*左侧初始化宽度*/
    height: 95%;
    background: #ffffff;
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
  .company-right {
    float: left;
    width: 78%; /*右侧初始化宽度*/
    height: 100%;
    background: #fff;
    // box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
  }
  .toolbarRecord {
    padding: 10px 10px 0px;
    border-right: 1px solid #eaebec;
    width: 100%;
    .el-form {
      width: 100%;
      .el-form-item {
        width: 48%;
        margin-bottom: 0px;
        margin-right: 3px;
        .el-form-item__content {
          width: 100%;
          .el-input__inner {
            width: 100% !important;
          }
        }
      }
      .readingStaff {
        width: 49%;
        margin-bottom: 0px;
        margin-right: 0px;
      }
      .el-cascader {
        width: 100%;
        padding-top: 5px;
      }
      .businessArea {
        width: inherit;
        .el-form-item__content {
          width: 93%;
        }
      }
    }
  }
  #tree {
    height: calc(100% - 38px);
    .search {
      padding: 10px 10px;
      height: 60px;
    }
    .el-tree {
      height: calc(100% - 60px) !important;
    }
  }
  .kl-table {
    &::after {
      content: "";
      display: block;
      visibility: hidden;
      clear: both;
    }
    .rightBtn {
      float: right;
      padding-bottom: 5px;
    }
  }
  .toolbar {
    padding: 0 20px;
  }
}
</style>

