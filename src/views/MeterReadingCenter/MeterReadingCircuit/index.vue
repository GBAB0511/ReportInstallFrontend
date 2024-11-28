<template>
  <div class="MeterReadingCircuit">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <!-- <el-button size="mini" type="primary" style="margin-left: 0;" @click="solidID()">排序号整理</el-button> -->
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="company-content">
      <div class="company-left">
        <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
      </div>
      <div class="resize" title="收缩侧边栏">
        ⋮
      </div>
      <div class="company-right">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.type" placeholder="用户编号" clearable @keydown.enter.native="location"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" class="searchBtn" @click="location">定位</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="margin-left: 0;" @click="solidID()" class="searchBtn">排序号整理</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="margin-left: 0;" @click="finalSolidID()" class="searchBtn">最终整理</el-button>
            </el-form-item>
            <el-form-item>
              <div> 共{{ totalUser }}个用户</div>
            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table">
          <el-table v-if="tableShow" @selection-change="handleSelectionChange" @select="pinSelect" :max-height="maxHeight" stripe border :data="showList" row-key="userNo" @cell-click="cellClick" class="wuserInfo-table" highlight-current-row :row-class-name="rowClassName" @sort-change="sortCompareMethod" ref="klTableData">

            <el-table-column type="selection" min-width="55" fixed>
            </el-table-column>

            <el-table-column type="index" label="NO." min-width="50" :index="indexMethod" fixed show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="sortNo" :sort-orders="['descending','ascending',null]" :sortable="'custom'" label="排序号" min-width="80">
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.sortNo" size="mini" @change="getChangeList(scope.row)"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="userNo" :sort-orders="['descending','ascending',null]" :sortable="'custom'" label="用户编号"  min-width="120" show-overflow-tooltip>

            </el-table-column>

            <el-table-column prop="ctmName" :sort-orders="['descending','ascending',null]" :sortable="'custom'" label="客户名称" min-width="120" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="ctmAddr" label="装表地址" :sort-orders="['descending','ascending',null]" :sortable="'custom'" min-width="120" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="useWaterType" label="用水类型" min-width="200" show-overflow-tooltip>
            </el-table-column>



            <!-- <el-table-column prop="tradeClassify" label="行业分类" min-width="120">
            </el-table-column> -->

            <el-table-column prop="status" label="用户状态" min-wi1dth="120" show-overflow-tooltip>
            </el-table-column>
            <!-- 添加表位 -->
            <el-table-column prop="meterSite" label="表位" min-width="80" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <!-- 分页  -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>
          </div>
        </div>
      </div>
      <el-dialog class='kr-dialog' title="抄表路线-上插入" :visible.sync="dialogFormVisible" width="90%" height="70%">
        <div class="kr-dialog-right">
          <auto-tree :treeData="treeDatas"></auto-tree>
        </div>
        <div class='kr-dialog-left'>
          <div class='kr-dialog-top'>
            <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

              <el-form-item label="排序号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.beginNumber" style="width: 47%" @keydown.enter.native="demand"></el-input>
                -
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.endNumber" style="width: 47%" @keydown.enter.native="demand"></el-input>
              </el-form-item>

              <el-form-item label="模糊查询：" class="width-200">
                <el-tooltip class="item" effect="dark" content="用户编号、用户名称、册本号" placement="top">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.searchContent" clearable @keydown.enter.native="demand"></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
              </el-form-item>
              <el-form-item style="float: right">
                <el-button size="mini" type="primary" style="margin-left: 0;">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class='kr-dialog-bottom'>
            <el-table :data="gridData" v-if="tableShow" :max-height="maxHeight" stripe border>
              <el-table-column type="selection" min-width="55" fixed>
              </el-table-column>
              <el-table-column type="index" label="NO." :index="indexMethod" fixed>
              </el-table-column>
              <el-table-column prop="bookNo" label="册本号"></el-table-column>
              <el-table-column prop="orderBy" label="排序号"></el-table-column>
              <el-table-column prop="userCode" label="用户编号"></el-table-column>
              <el-table-column prop="userName" label="用户名称"></el-table-column>
              <el-table-column prop="userAddress" label="用户地址"></el-table-column>
              <el-table-column prop="waterAddress" label="水表地址"></el-table-column>
              <el-table-column prop="waterCode" label="水表编号"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

        <el-form-item label="排序号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.beginNumber" style="width: 47%"></el-input>
          -
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.endNumber" style="width: 47%"></el-input>
        </el-form-item>

        <el-form-item label="模糊查询：" class="longinput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.searchContent" placeholder="用户编号/用户名称/册本号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>

        <el-form-item label="">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.searchType" placeholder="用户编号/排序号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary">定位</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="mini" type="primary" style="margin-left: 0;">保存</el-button>
          <el-button size="mini" type="primary">初始化</el-button>
          <el-button size="mini" type="primary">打印</el-button>
          <el-button size="mini" type="primary" icon="el-icon-upload2">导出</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <!-- <div class="kl-table">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" @cell-click="cellClick" class="wuserInfo-table">

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <el-table-column type="selection" width="55">
        </el-table-column>

        <el-table-column prop="bookNum" label="册本号">
        </el-table-column>

        <el-table-column prop="sortNum" label="排序号">
        </el-table-column>

        <el-table-column prop="userNum" label="用户编号">

        </el-table-column>

        <el-table-column prop="userName" label="用户名称">
        </el-table-column>

        <el-table-column prop="userAddress" label="用户地址">
        </el-table-column>

        <el-table-column prop="waterType" label="用水类型">
        </el-table-column>

        <el-table-column prop="paymentMethod" label="缴费方式">
        </el-table-column>

        <el-table-column prop="creditRating" label="信用等级">
        </el-table-column>

        <el-table-column prop="state" label="状态">
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
        </el-pagination>
      </div>
    </div> -->
    <!-- <span class="btnBox">
      <el-button size="mini" type="primary" style="margin-left: 0;">保存</el-button>
      <el-button size="mini" type="primary">初始化</el-button>
      <el-button size="mini" type="primary">打印</el-button>
      <el-button size="mini" type="primary">导出</el-button>
    </span> -->
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "MeterReadingCircuit",
  components: {
    autoTree
  },
  data () {
    return {
      sortChangeList: false,
      origin: -1, // 这里给一个变量作为起点
      pin: false, // 这里给一个变量，默认为false，不按住
      multipleSelection: [],
      totalUser: 0,
      lastIndexItem: '',
      // 列表数据
      tableData: [],
      //初始化列表数据
      tableFirstData: [],
      changeTableData: [],
      tableUniqueData: [],
      // 存储当前查询的列表数据（不能变动）
      constTableData: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        bookNo: '',
        sortField: '',
        sortOrder: ''

      },
      dialogFormVisible: false,
      rules: {
        severCode: [
          { required: true, message: "请输入服务器编号", trigger: "blur" }
        ],
        dbName: [
          { required: true, message: "请选择活动区域", trigger: "blur" }
        ],
        severPort: [{ required: true, message: "请选择日期", trigger: "blur" }],
        severName: [{ required: true, message: "请选择时间", trigger: "blur" }],
        ipAdress: [
          { required: true, message: "请至少选择一个活动性质", trigger: "blur" }
        ],
        station: [
          { required: true, message: "请选择活动资源", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      formLabelWidth: "120px",
      gridData: [
        {
          bookNum: "C0000001",
          orderBy: "0000001",
          userCode: "C001001",
          userName: "李小天",
          userAddress: "深圳市罗湖区东深小区",
          waterAddress: "深圳市罗湖区东深小区",
          waterCode: "C00A001"
        },
        {
          bookNum: "C0000002",
          orderBy: "0000002",
          userCode: "C001002",
          userName: "高友贵",
          userAddress: "深圳市罗湖区东深小区",
          waterAddress: "深圳市罗湖区东深小区",
          waterCode: "C00A002"
        },
        {
          bookNum: "C0000003",
          orderBy: "0000003",
          userCode: "C001003",
          userName: "焦文",
          userAddress: "深圳市罗湖区东深小区",
          waterAddress: "深圳市罗湖区东深小区",
          waterCode: "C00A003"
        }
      ],
      treeDatas: {
        tree: [
          {
            books: [],
            businessArea: "",
            showName: "全部"
          }
        ],
        defaultProps: {
          label: "showName",
          children: "books"
        },
        inputProp: {
          showSearch: true,
          Inp_placeholder: "请输入册本号"
        },
        sendTreeProp: [
          "businessArea",
          "businessAreaName",
          "bookNo",
          "bookName",
          "showName",
          "totalWater",
          "totalUser",
          "abnormalAmount",
          "meterReadingAmount"
        ],
        rootName: "总部",
        defaultOpen: {
          nodeKey: "businessArea"
          // nodeItem:164
        }
      },
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "表册管理" },
          { title: "抄表路线" }
        ]
      },
      isActive: false, //控制高级查询内容的显示
      formData: {
        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [],
        waterMeterManufacturer: "",
        waterMeterManufacturerOptions: [],
        waterMeterType: "",
        waterMeterTypeOptions: [],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: []
      },
      // 日期选择器
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      waterAddVisible: false, //综合查询的显示和隐藏
      WaterEditorName: "综合查询",
      ruleFormData: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false,
      showList: [],
      // 排序变动保存
      sortChangeTag: false,
      temData: [],
      // 记录表格高度
      tableRowHeight: 0,
    };
  },
  mounted () {
    this.getTreeData()
    this.dragControllerDiv()
    // this.init()
    // this.rowDrop()
    window.addEventListener('keydown', code => { // 这个是获取键盘按住事件
      // console.log(code); // 这个是你按住键盘打印出键盘信息，在浏览器中自行查看
      if (code.keyCode === 16 && code.shiftKey) { // 判断是否按住shift键，是就把pin赋值为true
        this.pin = true;
      }
    });
    window.addEventListener('keyup', code => { // 这个是获取键盘松开事件
      if (code.keyCode === 16) { // 判断是否松开shift键，是就把pin赋值为false
        this.pin = false;
      }
    });
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.$nextTick(() => {
      this.common.changeTable(this, ".company-right", [
        ".company-right .toolbar",
        ".company-right .block",
        ".bread-contain"
      ]);
    })



  },
  methods: {
    // 列表初始化
    init () {
      let _this = this

      let params = {
        "busicode": "MrPathList",
        "data": this.tableQuery,
      }
      delete params.data.type
      this.$api.fetch({
        params: params,
      }).then(res => {
        // console.log(res) // 后端接口返回无分页
        let startIndex = (_this.tableQuery.page - 1) * _this.tableQuery.pageCount
        let showList = res.slice(startIndex, startIndex + _this.tableQuery.pageCount)
        _this.showList = showList
        _this.tableData = res
        _this.tableFirstData = JSON.parse(JSON.stringify(res))
        _this.tableUniqueData = JSON.parse(JSON.stringify(res))
        var endIndex = _this.tableFirstData.length - 1
        _this.lastIndexItem = _this.tableFirstData[endIndex]
        _this.constTableData = JSON.parse(JSON.stringify(res))
        if (_this.tableData) {
          _this.totalUser = _this.tableData.length
        }
        // 存储排序数据
        this.temData = JSON.parse(JSON.stringify(this.tableData))
        this.temData.forEach((item,index)=>{
          item.sortNo = index + 1
        })
        console.log(this.temData);
        this.$nextTick(() => {
          let tableRowHeight = $(".kl-table .el-table__body-wrapper .el-table__body .el-table__row").children(":last").height()
          this.tableRowHeight = tableRowHeight
        })
        // this.rowDrop();
      })
    },
    sortCompareMethod (column) {
      console.log(column);
      this.tableQuery.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery.sortOrder = 2
      } else {
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.sortChangeTag = true

      if(this.tableQuery.sortField === 'userNo'){
        this.tableQuery.sortField = 'user_no'
      }
      this.init()
    },
    //  sortCompareMethod({prop,order}){
    //    if(order == null){
    //     this.init()
    //    }else{
    //      this.tableData.sort(this.compare(prop, order))     
    //    }
    //    this.sortChangeList = true
    //    this.save()
    //   },
    compare (propertyName, sort) {
      return function (obj1, obj2) {
        var value1 = obj1[propertyName]
        var value2 = obj2[propertyName]
        if (typeof value1 === "string" && typeof value2 === "string") {
          const res = value1.localeCompare(value2, "zh");
          return sort === "ascending" ? res : -res
        } else {
          if (value1 <= value2) {
            return sort == "ascending" ? -1 : 1;
          } else if (value1 > value2) {
            return sort == "ascending" ? 1 : -1;
          }
        }
      }
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.klTableData.toggleRowSelection(row);
        });
      } else {
        this.$refs.klTableData.clearSelection();
      }
    },
    handleSelectionChange () {
      this.multipleSelection = this.$refs.klTableData.selection
      console.log(this.multipleSelection)
    },
    // 这里是select事件开始
    pinSelect (item, index) {
      const data = this.$refs.klTableData.tableData; // 获取所以数据
      const origin = this.origin; // 起点数 从-1开始
      const endIdx = index.index; // 终点数   
      if (this.pin && item.includes(data[origin])) { // 判断按住
        const sum = Math.abs(origin - endIdx) + 1;// 这里记录终点
        const min = Math.min(origin, endIdx);// 这里记录起点
        let i = 0;
        while (i < sum) {
          const index = min + i;
          this.$refs.klTableData.toggleRowSelection(data[index], true); // 通过ref打点调用toggleRowSelection方法，第二个必须为true
          i++;
        }
      } else {
        this.origin = index.index; // 没按住记录起点
      }
    },
    // 行拖拽
    rowDrop () {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      const _this = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: ".el-table__row",
        onEnd ({ newIndex, oldIndex }) {
          console.log(newIndex, oldIndex)
          if (_this.multipleSelection.length > 1) {
            oldFirstItem = _this.tableFirstData[0]
            const currRow = _this.tableData.splice(oldIndex, _this.multipleSelection.length);//当前行
            _this.tableData.splice(newIndex, 0, ...currRow);
            let params = {
              "busicode": "MrPathSave",
              "data": _this.tableData.map((item, idx) => {
                return {
                  userNo: item.userNo,
                  sortNo: idx + 1
                }
              })
            }
            console.log(params)
            _this.$api.fetch({
              params: params,
            }).then(res => {
              _this.$message({
                message: '保存成功！',
                type: 'success'
              });
              _this.init()
            })
          } else {//单选拖拽
            var preItem = ''//前一个索引值
            var afterItem = ''//后一个索引值
            var lastItem = ''//末位索引
            var changePreItem = ''//前一个对象
            var changeAfterItem = ''//后一个对象
            //  var changeLastItem = ''//末位对象
            var currentIndex = newIndex//当前拖拽行索引值
            var oldFirstItem = ''//原首位对象
            //  var oldLastItem = ''//原末位对象
            oldFirstItem = _this.tableFirstData[0]
            const currRow = _this.tableData.splice(oldIndex, 1)[0];//当前行
            _this.tableData.splice(newIndex, 0, currRow);

            lastItem = _this.tableData.length - 1
            if (currentIndex == 0) {//若当前拖拽到首位时
              //  preItem = currentIndex
              //  changePreItem = _this.tableData[preItem]
              currRow.sortNo = Math.round(oldFirstItem.sortNo / 2)
            } else if (currentIndex === lastItem) {//若当前拖拽到末位
              // lastItem = currentIndex
              // oldLastItem = _this.tableData[currentIndex]
              currRow.sortNo = _this.lastIndexItem.sortNo + 1
            } else {//若拖拽不为首位、末位
              preItem = currentIndex - 1
              afterItem = currentIndex + 1
              changePreItem = _this.tableData[preItem]
              changeAfterItem = _this.tableData[afterItem]
              currRow.sortNo = Math.round((changePreItem.sortNo + changeAfterItem.sortNo) / 2)
            }
            var tmpData = []
            tmpData.push(currRow)
            let params = {
              "busicode": "MrPathSave",
              "data": tmpData.map((item, idx) => {
                return {
                  userNo: item.userNo,
                  sortNo: item.sortNo
                }
              })
            }
            _this.$api.fetch({
              params: params,
            }).then(res => {
              _this.$message({
                message: '保存成功！',
                type: 'success'
              });
              _this.init()
            })
          }


        }
      });
    },
    getChangeList (row) {
      var rowItem = row
      this.changeTableData = this.formateArrObjData(this.changeTableData, rowItem, "userNo")
      if (this.sortChangeTag) {
        this.temData = this.formateArrObjTemData(this.temData, rowItem, "userNo")
      }
      console.log(this.temData);
    },

    /**
     * 判断数组对象中是否有某个对象，有则替换无则添加
     * @param {*} initialArr 源数组
     * @param {*} obj 判定的对象
     * @param {*} pro 对象中的某个属性名（唯一，通常为id）
     */
    formateArrObjData (initialArr, obj, pro) {
      // 判定数据是否为数组
      if (!(initialArr instanceof Array)) {
        return '请传入正确格式的数组'
      }
      // 判定数据是否为对象
      if (!(obj instanceof Object)) {
        return '请传入正确格式的对象'
      }
      if (!pro) {
        return '请传入正确格式的属性名'
      }

      let index = initialArr.findIndex((val) => val[pro] === obj[pro])
      // 如果有就替换  没有就添加

      if (initialArr.findIndex((val) => val[pro] === obj[pro]) !== -1) {
        console.log(obj[[pro]]);
        console.log(obj);
        this.changeTableData.splice(index, 1, obj);
      } else {
        this.changeTableData.push(obj);
      }
      return this.changeTableData
    },

    // 排序+排序号变动
    formateArrObjTemData (initialArr, obj, pro) {
      // 判定数据是否为数组
      if (!(initialArr instanceof Array)) {
        return '请传入正确格式的数组'
      }
      // 判定数据是否为对象
      if (!(obj instanceof Object)) {
        return '请传入正确格式的对象'
      }
      if (!pro) {
        return '请传入正确格式的属性名'
      }

      let index = initialArr.findIndex((val) => val[pro] === obj[pro])
      // 如果有就替换  没有就添加

      if (initialArr.findIndex((val) => val[pro] === obj[pro]) !== -1) {
        console.log(obj[[pro]]);
        console.log(obj);
        this.temData.splice(index, 1, obj);
      } else {
        this.temData.push(obj);
      }
      return this.temData
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
    // 获取左侧树数据
    getTreeData () {
      let _this = this
      let params = {
        "busicode": "BookCheckAreaTree",
        "data": {},
      }

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.treeDatas.tree[0].books = res;
      })
    },
    // 树的点击
    backTreeData (val) {
      console.log(val);
      let _this = this;
      this.tableQuery.bookNo = val.bookNo;
      this.tableQuery.page = 1, // 切换树重置页码
        this.init()
    },

    // 保存按钮
    save () {
      let _this = this
      let params = {}
      if (!this.sortChangeList) {
        if (this.sortChangeTag) { //点击排序后可保存
          console.log(this.temData);
          params = {
            "busicode": "MrPathSave",
            "data": this.temData.map((item, idx) => {
              return {
                userNo: item.userNo,
                sortNo: item.sortNo
              }
            })
          }
        }else{
          if (this.changeTableData.length <= 0) {
            _this.$message({
              message: '没有要保存的数据！',
              type: 'warning'
            });
            return
          }
          this.tableData.sort(function (a, b) {
            return a.sortNo - b.sortNo
          })
          params = {
            "busicode": "MrPathSave",
            "data": this.changeTableData.map((item, idx) => {
              return {
                userNo: item.userNo,
                sortNo: item.sortNo
              }
            })
          }
        }
      } else {
        params = {
          "busicode": "MrPathSave",
          "data": this.$refs.klTableData.tableData.map((item, idx) => {
            return {
              userNo: item.userNo,
              sortNo: idx + 1
            }
          })
        }
      }
      console.log(params)

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$message({
          message: '保存成功！',
          type: 'success'
        });
        _this.changeTableData = []
        if (this.sortChangeTag) {
          // this.tableQuery.sortOrder = ''
          // this.tableQuery.sortField = ''
          this.$refs.klTableData.sort(this.tableQuery.sortField ,'');
        }
        this.sortChangeTag = false
        _this.init()
        this.sortChangeList = false
      })
    },






    //编辑
    edit (index, row) {
      console.log(row.bookNum);
      this.dialogFormVisible = true;
    },
    hidden () {
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
    location () {
      let _this = this
      let index = -1;
      this.$nextTick(() => {
        let tableRowHeight = $(".kl-table .el-table__body-wrapper .el-table__body .el-table__row").children(":last").height()
        this.tableRowHeight = tableRowHeight
      })
      if (this.tableQuery.type.length > 0) { // 用户编号
        this.constTableData.forEach((item, i) => {
          if (this.tableQuery.type == item.userNo) {
            index = i;
            _this.$refs.klTableData.setCurrentRow(this.tableData[Number(i)]);
          }
        })
      }
      if (index != -1) {
        console.log(index);
        console.log(this.tableRowHeight);
        this.$refs.klTableData.bodyWrapper.scrollTop = this.tableRowHeight * (index + 1);
      }
    },
    rowClassName ({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // location() {
    //   if (this.tableQuery.type.length > 0) {// 用户编号
    //     this.constTableData.list.forEach(item => {
    //       if (this.tableQuery.type == item.userNo) {
    //         this.tableData.list = []
    //         this.tableData.list.push(item)
    //       }
    //     });
    //     for (let i = 0; i < this.constTableData.list.length; i++) {
    //       if (this.tableQuery.type == this.constTableData.list[i].userNo) {
    //         break
    //       } else if (this.tableQuery.type !== this.constTableData.list[i].userNo && i == (this.constTableData.list.length - 1)) {
    //         this.$message({
    //           showClose: true,
    //           message: '用户编号不存在！',
    //           type: 'warning'
    //         });
    //         this.tableData = {list: []}
    //       }
    //     }
    //   } else if (this.tableQuery.type.length == 0) {
    //     this.tableData = JSON.parse(JSON.stringify(_this.constTableData))
    //   }
    // },
    // location() {
    //   // 定位：点击“定位”，前端根据输入框中数据长度判断定位的数据是用户编号还是排序号（一般情况下排序号不超过6位，超过6位的算用户编号），
    //   // 如果是用户编号，则作精确定位，即用户编号不存在时，则前端提示“用户编号/排序号不存在”；如果是排序号，则作模糊定位，即定位到最接近输
    //   // 入数据的那个排序号数据行。
    //   let _this = this
    //   if (this.tableQuery.type.length <= 6 && this.tableQuery.type.length > 0) {// 序列号
    //     let numList = []
    //     this.constTableData.list.forEach((item, i) => {
    //       numList[i] = {
    //         num: Math.abs(Number(this.tableQuery.type) - Number(item.sortNo)),
    //         index: i
    //       }
    //     });
    //     let minNum = numList[0]
    //     numList.forEach((item, i) => {
    //       if (numList[i].num < minNum.num) {
    //         minNum = numList[i];
    //       }
    //     });
    //     this.tableData.list = []
    //     this.tableData.list.push(this.constTableData.list[minNum.index])
    //   } else if (this.tableQuery.type.length > 6) {// 用户编号
    //     this.constTableData.list.forEach(item => {
    //       if (this.tableQuery.type == item.userNo) {
    //         this.tableData.list = []
    //         this.tableData.list.push(item)
    //       }
    //     });
    //     for (let i = 0; i < this.constTableData.list.length; i++) {
    //       if (this.tableQuery.type == this.constTableData.list[i].userNo) {
    //         break
    //       } else if (this.tableQuery.type !== this.constTableData.list[i].userNo && i == (this.constTableData.list.length - 1)) {
    //         this.$message({
    //           showClose: true,
    //           message: '用户编号不存在！',
    //           type: 'warning'
    //         });
    //       }
    //     }
    //   } else if (this.tableQuery.type.length == 0) {
    //     this.tableData = JSON.parse(JSON.stringify(_this.constTableData))
    //   }
    // },
    solidID () {
      //排序号整理
      let _this = this
      if (this.tableQuery.bookNo == '') {
        _this.$message({
          message: '请先选择一个册本号！',
          type: 'warning'
        })
        return
      }
      let params = {
        "busicode": "MrPathOrder",
        "data": {
          bookNo: this.tableQuery.bookNo
        },
      }
      console.log(params)

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$message({
          message: '排序号整理成功！',
          type: 'success'
        })
        _this.init()
      })
    },
    finalSolidID () {
      let temTableData = JSON.parse(JSON.stringify(this.tableData))
      temTableData.forEach(item => {
        return item.sortNo = item.sortNo / 10
      })
      // console.log(this.tableData);
      let params = {
        "busicode": "MrPathSave",
        "data": temTableData.map(item => {
          return {
            userNo: item.userNo,
            sortNo: item.sortNo
          }
        }),
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        this.$message({
          message: '最终整理成功！',
          type: 'success'
        });
        this.init()
      })
    },
    demand () {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    //   导出
    exportExcel () {
      //   	let listData = {}
      //   	this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
      //     let params ={
      //       "busicode":"MeterReadingList",
      //       "data": this.tableQuery
      //     }
      //     this.$api.fetch({
      //       apiUrl: 'interface.api',//路径
      //       method: 'post',//请求方法
      //       params:params,//参数
      //       needErrorCallback:true
      //     }).then(res =>{
      //     	if(res.code===0){
      //         listData = res.data
      //         if (!listData.list[0]) {
      //         		this.$notify({
      //               title: '警告',
      //               message:'表格没有相关数据',
      //               type: 'error'
      //             })
      //         	} else {
      //         		import('@/vendor/Export2Excel').then(excel => {
      // 			        const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
      // 			        const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
      // 			        const list = listData.list
      // 			        const data = this.formatJson(filterVal, list)
      // 			        excel.export_json_to_excel({
      // 			          header: tHeader,
      // 			          data,
      // 			          filename: this.tableQuery.daytime + '抄表数据',
      // 			          autoWidth: '100'
      // 			        })
      // 			      })
      //         		this.tableQuery.pageCount = 20
      //         	}
      //       }
      //     })
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    //   查看历史
    viewHistory (index, row) { },
    cellClick (row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod (index) {
      //获取表格序号
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    closeDialog () {
      //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.init();
    },
    //弹出框
    submit (formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterAddVisible = false;
    },
    // 添加
    add () { },
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
.MeterReadingCircuit {
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
    width: calc(22% - 10px); /*左侧初始化宽度*/
    height: 90%;
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
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .searchBtn {
    border-color: #faa646;
  }
  .el-button:focus,
  .el-button:hover {
    border-color: #c6e2ff;
  }
}
</style>
