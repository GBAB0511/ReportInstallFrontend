<template>
  <div class="MeterReadingCircuit">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- <h2 class="tab-title">
        <i></i>
        册本调整</h2> -->
    </div>

    <!-- <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
        <el-form-item class="form-left">
          <el-form-item label="册本号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.leftBookNum" placeholder="册本号"></el-input>
          </el-form-item>
          <br>

          <el-form-item label="序号/用户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.leftBeginNumber" style="width: 47%"></el-input>
            -
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.leftEndNumber" style="width: 47%"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

          <el-form-item label="册本号：" style="margin-left: 5%">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.rightBook" placeholder="册本号"></el-input>
          </el-form-item>
          <br>

          <el-form-item label="序号/用户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.rightBeginNumber" style="width: 47%"></el-input>
            -
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.rightEndNumber" style="width: 47%"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>
      </el-form>
    </div> -->
    <!-- <span class="btnBox">
      <el-button size="mini" type="primary" style="margin-left: 0;">保存</el-button>
      <el-button size="mini" type="primary">初始化</el-button>
      <el-button size="mini" type="primary">打印</el-button>
      <el-button size="mini" type="primary" style="margin-right:4%;">导出</el-button>
    </span> -->
    <div class="adjuge">
      <el-tabs v-model="activeName2">

        <div class="one1 fl">

          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="leftTableQuery" class="demo-form-inline">
                <el-form-item label="册本号：">
                  <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="bookNo-input" v-model="leftTableQuery.bookNo" placeholder="册本号" @keydown.enter.native="getLeftTableData"></el-input> -->
                  <el-select
                  class="bookNo-select"
                    v-model="leftTableQuery.bookNo"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请输入册本号"
                    @change="getLeftTableData"
                    @keyup.enter.native="enterQueryLeft"
                    :remote-method="leftBooKNoDataOptions"
                    :loading="false">
                    <template v-for="item in leftBookNoData">
                      <el-option
                        :key="item.bookNo"
                        :label="item.bookNo"
                        :value="item.bookNo">
                      </el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item>
                  <el-button class='searchBtn' @click="getLeftTableData" icon="el-icon-search"></el-button>
                </el-form-item> -->
                 <el-form-item>
                  <el-button class='searchBtn' @click="getLeftFilterShow">展开过滤条件</el-button>
                </el-form-item>
                <br>
                <div v-show="leftQueryShow">
                  <el-form-item label="用户编号：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="leftTableQuery.beginFuzzyQuery" style="width: 47%" @keydown.enter.native="getLeftTableData"></el-input>
                    -
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="leftTableQuery.endFuzzyQuery" style="width: 47%" @keydown.enter.native="getLeftTableData"></el-input>
                  </el-form-item>
                  <el-form-item label="客户地址：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="leftTableQuery.ctmAddr" style="width: 47%" @keydown.enter.native="getLeftTableData"></el-input>
                  </el-form-item>
                  <el-form-item label="客户名称：" class="addr">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="leftTableQuery.ctmName" @keydown.enter.native="getLeftTableData"></el-input>
                  </el-form-item>
                  <el-form-item label="装表地址：" class="addr">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="leftTableQuery.installAddr" @keydown.enter.native="getLeftTableData"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button class='searchBtn' @click="getLeftFilter" icon="el-icon-search"></el-button>
                  </el-form-item>
                </div>
            </el-form>
          </div>
          <div :style="{height: maxHeight + 'px'}">
            <el-table  ref="leftTable"  v-if="tableShow" :max-height="maxHeight" stripe border :data="leftTableData"
            @selection-change='getLeftSelect' :row-key="getLeftRowKeys" @select="leftSelect"  @cell-click="cellClickLeft" class="wuserInfo-table"
            :row-class-name="tableRowClassName" @sort-change="sortLeftCompareMethod"  highlight-current-row :cell-style="cellStyle">

              <el-table-column :reserve-selection="true" type="selection" width="45">
              </el-table-column>

              <el-table-column type="index" label="NO." width="50">
              </el-table-column>

              <el-table-column prop="userNo" sortable min-width="120" label="用户编号" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmName" sortable min-width="170" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmAddr" sortable min-width="130" label="客户地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="sortNo" sortable min-width="80" label="排序号">
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <!-- <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="leftTableQuery.page"
              :page-sizes="[20, 100, 500, 1000]"
              :page-size="leftTableQuery.pageCount"
              layout="total, sizes, prev, pager, next, jumper"
              :pager-count="5"
              :total="leftTableData.total"
            ></el-pagination>
          </div> -->
        </div>
        <div class="two1 fl">
          <div>
            <el-button type="primary" :disabled="disabledSaveBtn" @click="save" size="mini">保存</el-button>
          </div>
          <div>
            <!-- <el-tooltip content="右移一户" placement="top" effect="light"> -->
            <el-button type="primary" @click="bothRight" size="mini">右移</el-button>

            <!-- </el-tooltip> -->
          </div>
          <div>
            <!-- <el-tooltip content="左移一户" placement="top" effect="light"> -->
            <el-button type="primary" @click="bothLeft" size="mini">左移</el-button>

            <!-- </el-tooltip> -->
          </div>
          <!-- <div>
            <el-tooltip content="全部右移" placement="top" effect="light">
            <el-button type="primary" @click="reset1" size="mini">{{allRight}}</el-button>


            </el-tooltip>
          </div> -->
          <!-- <div>
            <el-tooltip content="全部左移" placement="top" effect="light">
            <el-button type="primary" @click="reset1" size="mini">{{allLeft}}</el-button>

            </el-tooltip>
          </div> -->
        </div>
        <div class="three1 fl">

          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="rightTableQuery" class="demo-form-inline">
                <el-form-item label="册本号：">
                  <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="bookNo-input" v-model="rightTableQuery.bookNo" placeholder="册本号" @keydown.enter.native="getRightTableData"></el-input> -->
                  <el-select
                  class="bookNo-select"
                    v-model="rightTableQuery.bookNo"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请输入册本号"
                    :remote-method="rightBooKNoDataOptions"
                     @keyup.enter.native="enterQueryRight"
                    @change="getRightTableData"
                    :loading="false">
                    <template v-for="item in rightBookNoData">
                      <el-option
                        :key="item.bookNo"
                        :label="item.bookNo"
                        :value="item.bookNo">
                      </el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item>
                  <el-button class='searchBtn' @click="getRightTableData" icon="el-icon-search"></el-button>
                </el-form-item> -->
                 <el-form-item>
                  <el-button class='searchBtn' @click="getRightFilterShow">展开过滤条件</el-button>
                </el-form-item>
                <br>

                <div v-show="rightQueryShow">
                  <el-form-item label="用户编号：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="rightTableQuery.beginFuzzyQuery" style="width: 47%" @keydown.enter.native="getRightTableData"></el-input>
                    -
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="rightTableQuery.endFuzzyQuery" style="width: 47%" @keydown.enter.native="getRightTableData"></el-input>
                  </el-form-item>
                  <el-form-item label="客户地址：">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="rightTableQuery.ctmAddr" style="width: 47%" @keydown.enter.native="getRightTableData"></el-input>
                  </el-form-item>
                  <el-form-item label="客户名称：" class="addr">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="rightTableQuery.ctmName" @keydown.enter.native="getLeftTableData"></el-input>
                  </el-form-item>
                  <el-form-item label="装表地址：" class="addr">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="rightTableQuery.installAddr" @keydown.enter.native="getLeftTableData"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button class='searchBtn' @click="getRightFilter" icon="el-icon-search"></el-button>
                  </el-form-item>
                </div>
            </el-form>
          </div>
          <div :style="{height: maxHeight1 + 'px'}">
            <el-table ref="rightTable"  v-if="tableShow1" :row-key="getRightRowKeys" :max-height="maxHeight1" stripe border :data="rightTableData"
            @selection-change='getRightSelect' @cell-click="cellClickRight" class="wuserInfo-table" :row-class-name="tableRowClassName" highlight-current-row
            :cell-style="cellStyle" @select="rightSelect" @sort-change="sortRightCompareMethod" >

              <el-table-column :reserve-selection="true" type="selection" width="45">
              </el-table-column>

              <el-table-column type="index" label="NO." width="50">
              </el-table-column>

              <el-table-column prop="userNo" sortable min-width="120" label="用户编号" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmName" sortable  min-width="170" label="客户名称" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="ctmAddr" sortable min-width="130" label="客户地址" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="sortNo" sortable min-width="80" label="排序号">
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <!-- <div class="block">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="rightTableQuery.page"
              :page-sizes="[20, 100, 500, 1000]"
              :page-size="rightTableQuery.pageCount"
              layout="total, sizes, prev, pager, next, jumper"
              :total="rightTableData.total"
              :pager-count="5"
            ></el-pagination>
          </div> -->
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "MeterReadingCircuit",
  components: {

  },
  data() {
    return {
      rightOrigin: -1, // 这里给一个变量作为起点
      rightPin: false, // 这里给一个变量，默认为false，不按住
      leftOrigin: -1, // 这里给一个变量作为起点
      leftPin: false, // 这里给一个变量，默认为false，不按住
      activeName2:'',
      clearRowKeyData:false,//清除每页已勾选值
      leftSelections:{},
      leftAllList:[],//未改变的左侧列表
      leftFilterList:[],//过滤后的左侧数据
      leftInitData:[],//保存刚查询的左侧数据
      leftInitSign: false,
      rightAllList:[],//未改变的右侧列表
      rightFilterList:[],//过滤后的右侧数据
      rightInitData:[],//保存刚查询的右侧数据
      rightInitSign: false,
      rightBtn:false,//右移判断
      leftBtn:false,//左移判断
      leftBookNoData: [],//册本号数据下拉框
      rightBookNoData: [],//册本号数据下拉框
      leftSortSign: false,
      rightSortSign: false,
      disabledSaveBtn:true,
      // 左侧列表数据
      leftTableData: [],
      leftTableQuery: {
        // page: 1,
        // pageCount: 20,
        bookNo: '',
        beginFuzzyQuery: '',
        endFuzzyQuery: '',
        ctmAddr:'',
        ctmName: '',
        installAddr: ''
      },
      //左侧勾选数据
      leftSelectData: [],

      // 右侧列表数据
      rightTableData: [],
      rightTableQuery: {
        // page: 1,
        // pageCount: 20,
        bookNo: '',
        beginFuzzyQuery: '',
        endFuzzyQuery: '',
        ctmAddr:'',
        ctmName: '',
        installAddr: ''
      },
      //左侧勾选数据
      rightSelectData: [],

      saveData:[],//保存传后端的数据

      crumbsData: {  //面包屑
        titleList: [
          { title: '抄表开账' },
          { title: '表册管理' },
          { title: '表册调整' }
        ],

      },
      isActive: false,  //控制高级查询内容的显示
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
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      tableShow1: false,
      maxHeight1: 0,
      histroyData: {

      },
      waterAddVisible: false,  //综合查询的显示和隐藏
      WaterEditorName: '综合查询',
      ruleFormData: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false,
      allRight: '>>',
      allLeft: '<<',
      leftIndex : 0,
      rightIndex : 0,
      leftSign: false,
      rightSign: false,
      leftRow: '',
      rightRow: '',
      // 查询条件隐藏
      leftQueryShow: false,
      rightQueryShow: false,
    }
  },
  mounted() {
    //this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
   window.addEventListener('keydown', code => { // 这个是获取键盘按住事件
      // console.log(code); // 这个是你按住键盘打印出键盘信息，在浏览器中自行查看
      if (code.keyCode === 16 && code.shiftKey) { // 判断是否按住shift键，是就把pin赋值为true
          this.leftPin = true;
          this.rightPin = true;
        }
      });
      window.addEventListener('keyup', code => { // 这个是获取键盘松开事件
        if(code.keyCode === 16){ // 判断是否松开shift键，是就把pin赋值为false
          this.leftPin = false;
          this.rightPin = false;
        }
      });
   this.common.changeTable1(this, '.MeterReadingCircuit .two1',
          ['.MeterReadingCircuit .toolbar'])
    this.common.changeTable1(this, '.MeterReadingCircuit .fl',
          ['.MeterReadingCircuit .fl .toolbar'],'maxHeight')
    this.common.changeTable1(this, '.MeterReadingCircuit .fl',
          ['.MeterReadingCircuit .fl .toolbar'],'maxHeight1')
  },
   watch: {
    //监听表格数据、使用this.$nextTick函数 保证数据和页面渲染同步！
    leftTableData(n, o) {
      this.$nextTick(() => {
        this.checkRows()
      })
    },
  },
  methods: {
    enterQueryLeft(event){
    this.leftTableQuery.bookNo = event.target.value;
      this.getLeftTableData();
    },
    enterQueryRight(event){
    this.rightTableQuery.bookNo = event.target.value;
      this.getRightTableData();
    },
    leftBooKNoDataOptions(query) {
      if(query==null || query.length==0){
        return
      }
      let params = { busicode: "BaseBookSelect", data: {bookNo:query,page:1,pageCount:20} };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this,"leftBookNoData",res.list)
        })
    },
    rightBooKNoDataOptions(query) {
      if(query==null || query.length==0){
        return
      }
      let params = { busicode: "BaseBookSelect", data: {bookNo:query,page:1,pageCount:20} };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this,"rightBookNoData",res.list)
        })
    },
    getLeftRowKeys(row){
      // console.log(row);
      if(this.clearRowKeyData){
       this.$refs.leftTable.clearSelection();
      }else{
         return row.userNo;
      }
    },
    getRightRowKeys(row){
      // console.log(row);
      if(this.clearRowKeyData){
      this.$refs.rightTable.clearSelection();
      }else{
         return row.userNo;
      }
    },
        // 勾选时候，记录[{u_id: row}, ...]
    // onSelect(selection, row) {
    //   if (this.leftSelections[row.userNo]) {
    //     delete this.leftSelections[row.userNo];
    //   } else {
    //     this.leftSelections[row.userNo] = row;
    //   }
    //   console.log(this.leftSelections);
    // },
    //  // 全选情况
    // onSelectAll(selection) {
    //   console.log(selection);
    //     // 全选
    //     if (selection.length) {
    //         selection.forEach(row => {
    //             this.leftSelections[row.userNo] = row;
    //         })
    //     } else {
    //         // 取消全选
    //         this.leftSelections.forEach(row => {
    //             delete this.leftSelections[row.userNo];
    //         })
    //     }

    // },
    // // 对已选择过的row勾选，返回到上一页时候
    // checkRows() {
    //   const keys = Object.keys(this.leftSelections);
    //   console.log(this.leftSelections);
    //   console.log(keys);
    //   const rows = this.leftTableData.filter(row => {
    //     return keys.includes(row.userNo);
    //   });
    //   // console.log(this.leftTableData);
    //   console.log('ooo',rows);
    //   rows.map(row => {
    //     this.$refs.leftTable.toggleRowSelection(row);
    //   });
    //   console.log('88888');
    // },
    // 获取左侧列表数据
    getLeftTableData() {
    //  this.disabledSaveBtn = true
      if (this.leftInitSign) {
        console.log("adasda");
        if (!(this.leftInitData.length === this.leftTableData.length &&
            this.leftInitData.every(a => this.leftTableData.some(b => a.userNo === b.userNo)) &&
            this.leftTableData.every(_b => this.leftInitData.some(_a => _a.userNo === _b.userNo)))) {
          console.log("左侧数据不一样!");
           this.$confirm('您的表册调整未保存，重新查询将放弃本次调整内容, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.leftInitSign = false
              this.getLeftTableData()
            }).catch(() => {
              return
            });
        }
        else{
          this.leftInitSign = false
          this.getLeftTableData()
        }
      }else{
        this.rightBtn = false
        this.leftBtn = false
        let _this = this
        if (this.leftTableQuery.bookNo == '') {
          _this.$message({
            message: '请输入要查询的册本号！',
            type: 'warning'
          })
          return
        }
        // else if ((this.leftTableQuery.beginFuzzyQuery == '' && this.leftTableQuery.endFuzzyQuery !== '') || (this.leftTableQuery.beginFuzzyQuery !== '' && this.leftTableQuery.endFuzzyQuery == '')) {
        //   _this.$message({
        //     message: '请输入完整的序号/用户编号！',
        //     type: 'warning'
        //   })
        //   return
        // }
        let bookBoolean = this.BookNovalidate();
        if(bookBoolean!==1){
          return;
        };
        let params = {
          "busicode": "MrPathPageList",
          "data": this.leftTableQuery,
        }

        this.$api.fetch({
          params: params,
        }).then(res => {
          _this.leftTableData = res
          _this.leftAllList = res
          _this.leftInitData = JSON.parse(JSON.stringify(res))
          this.leftInitSign = false
          this.leftSortSign = false
          // this.$refs.leftTable.setCurrentRow(-1);
          // this.leftSign = false
        })
      }

    },
    // 获取右侧列表数据
    getRightTableData() {
      //  this.disabledSaveBtn = true
      if (this.rightInitSign) {
        console.log("adasda");
        if (!(this.rightInitData.length === this.rightTableData.length &&
            this.rightInitData.every(a => this.rightTableData.some(b => a.userNo === b.userNo)) &&
            this.rightTableData.every(_b => this.rightInitData.some(_a => _a.userNo === _b.userNo)))) {
          console.log("右侧数据不一样!");
           this.$confirm('您的表册调整未保存，重新查询将放弃本次调整内容, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.rightInitSign = false
              this.getRightTableData()
            }).catch(() => {
              return
            });
        }
        else{
          this.rightInitSign = false
          this.getRightTableData()
        }
      }else{
        this.rightBtn = false
        this.leftBtn = false
        let _this = this
        if (this.rightTableQuery.bookNo == '') {
          _this.$message({
            message: '请输入要查询的册本号！',
            type: 'warning'
          })
          return
        }
        //  else if ((this.rightTableQuery.beginFuzzyQuery == '' && this.rightTableQuery.endFuzzyQuery !== '') || (this.rightTableQuery.beginFuzzyQuery !== '' && this.rightTableQuery.endFuzzyQuery == '')) {
        //   _this.$message({
        //     message: '请输入完整的序号/用户编号！',
        //     type: 'warning'
        //   })
        //   return
        // }
        let bookBoolean = this.BookNovalidate();
        if(bookBoolean!==1){
          return;
        };
        let params = {
          "busicode": "MrPathPageList",
          "data": this.rightTableQuery,
        }

        this.$api.fetch({
          params: params,
        }).then(res => {
          _this.rightTableData = res
          _this.rightAllList = res
          _this.rightInitData = JSON.parse(JSON.stringify(res))
          this.rightInitSign = false
          this.rightSortSign = false
          // this.$refs.rightTable.setCurrentRow(-1);
          // this.rightSign = false
        })
      }
    },
    getLeftFilterShow(){
      this.leftQueryShow = true
      this.$nextTick(()=>{
        this.common.changeTable1(this, '.MeterReadingCircuit .two1',
            ['.MeterReadingCircuit .toolbar'])
        this.common.changeTable1(this, '.MeterReadingCircuit .fl',
            ['.MeterReadingCircuit .fl .toolbar'],'maxHeight')
      })
    },
    getLeftFilter(){
      this.leftQueryShow = true
      this.$nextTick(()=>{
        this.common.changeTable1(this, '.MeterReadingCircuit .two1',
            ['.MeterReadingCircuit .toolbar'])
        this.common.changeTable1(this, '.MeterReadingCircuit .fl',
            ['.MeterReadingCircuit .fl .toolbar'],'maxHeight')
      })
      this.leftFilterList = []
      this.leftAllList.forEach(item=>{
        if (this.leftTableQuery.beginFuzzyQuery.length > 6 && this.leftTableQuery.endFuzzyQuery!=='') {
          var beginFuzzyQuery =  JSON.parse(JSON.stringify(this.leftTableQuery.beginFuzzyQuery))
          var endFuzzyQuery =  JSON.parse(JSON.stringify(this.leftTableQuery.endFuzzyQuery))
          //beginFuzzyQuery = this.formatBegin(beginFuzzyQuery)
          //endFuzzyQuery = this.formatEnd(endFuzzyQuery)
          if (Number(beginFuzzyQuery) <= Number(item.userNo)
            && Number(item.userNo) <= Number(endFuzzyQuery)
            && item.ctmAddr.indexOf(this.leftTableQuery.ctmAddr) != -1
            && item.ctmName.indexOf(this.leftTableQuery.ctmName) != -1
            && item.setupMeterAddr.indexOf(this.leftTableQuery.installAddr) != -1) {
            this.leftFilterList.push(item)
          }
        }else if(this.leftTableQuery.beginFuzzyQuery!=='' && this.leftTableQuery.beginFuzzyQuery.length <= 6 && this.leftTableQuery.endFuzzyQuery!==''){
          if (Number(this.leftTableQuery.beginFuzzyQuery) <= Number(item.sortNo)
            && Number(item.sortNo) <= Number(this.leftTableQuery.endFuzzyQuery)
            && item.ctmAddr.indexOf(this.leftTableQuery.ctmAddr) != -1
            && item.ctmName.indexOf(this.leftTableQuery.ctmName) != -1
            && item.setupMeterAddr.indexOf(this.leftTableQuery.installAddr) != -1) {
            this.leftFilterList.push(item)
          }
        }else{
          if (item.ctmAddr.indexOf(this.leftTableQuery.ctmAddr) != -1
            && item.ctmName.indexOf(this.leftTableQuery.ctmName) != -1
            && item.setupMeterAddr.indexOf(this.leftTableQuery.installAddr) != -1) {
            this.leftFilterList.push(item)
          }
        }
      })
      this.leftTableData = this.leftFilterList
    },
    getRightFilterShow(){
      this.rightQueryShow = true
      this.$nextTick(()=>{
        this.common.changeTable1(this, '.MeterReadingCircuit .two1',
            ['.MeterReadingCircuit .toolbar'])
        this.common.changeTable1(this, '.MeterReadingCircuit .fl',
            ['.MeterReadingCircuit .fl .toolbar'],'maxHeight1')
      })
    },
    getRightFilter(){
      this.rightQueryShow = true
      this.$nextTick(()=>{
        this.common.changeTable1(this, '.MeterReadingCircuit .two1',
            ['.MeterReadingCircuit .toolbar'])
        this.common.changeTable1(this, '.MeterReadingCircuit .fl',
            ['.MeterReadingCircuit .fl .toolbar'],'maxHeight1')
      })
      this.rightFilterList = []
      this.rightAllList.forEach(item=>{
        if (this.rightTableQuery.beginFuzzyQuery.length > 6 && this.rightTableQuery.endFuzzyQuery!=='') {
          var beginFuzzyQuery =  JSON.parse(JSON.stringify(this.rightTableQuery.beginFuzzyQuery))
          var endFuzzyQuery =  JSON.parse(JSON.stringify(this.rightTableQuery.endFuzzyQuery))
          //beginFuzzyQuery = this.formatBegin(beginFuzzyQuery)
          //endFuzzyQuery = this.formatEnd(endFuzzyQuery)
          if (Number(beginFuzzyQuery) <= Number(item.userNo)
            && Number(item.userNo) <= Number(endFuzzyQuery)
            && item.ctmAddr.indexOf(this.rightTableQuery.ctmAddr) != -1
            && item.ctmName.indexOf(this.rightTableQuery.ctmName) != -1
            && item.setupMeterAddr.indexOf(this.rightTableQuery.installAddr) != -1) {
            this.rightFilterList.push(item)
          }
        }else if(this.rightTableQuery.beginFuzzyQuery!=='' && this.rightTableQuery.beginFuzzyQuery.length <= 6 && this.rightTableQuery.endFuzzyQuery!==''){
          if (Number(this.rightTableQuery.beginFuzzyQuery) <= Number(item.sortNo)
            && Number(item.sortNo) <= Number(this.rightTableQuery.endFuzzyQuery)
            && item.ctmAddr.indexOf(this.rightTableQuery.ctmAddr) != -1
            && item.ctmName.indexOf(this.rightTableQuery.ctmName) != -1
            && item.setupMeterAddr.indexOf(this.rightTableQuery.installAddr) != -1) {
            this.rightFilterList.push(item)
          }
        }else{
          if (item.ctmAddr.indexOf(this.rightTableQuery.ctmAddr) != -1
            && item.ctmName.indexOf(this.rightTableQuery.ctmName) != -1
            && item.setupMeterAddr.indexOf(this.rightTableQuery.installAddr) != -1) {
            this.rightFilterList.push(item)
          }
        }
      })
      this.rightTableData = this.rightFilterList
    },
    formatBegin(num){
      var zeroNum = 13 - num.length
      for(var i= 0;i<zeroNum;i++){
        num = '0' + num
      }
      return num
    },
    formatEnd(num){
      var zeroNum = 13 - num.length
      for(var i= 0;i<zeroNum;i++){
        num = num + '0'
      }
      return num
    },
    BookNovalidate(){
      let val = 1
      if(this.rightTableQuery.bookNo===this.leftTableQuery.bookNo){
        this.$message({
          message: '左右侧册本号不能相同！',
          type: 'warning'
        })
        val=2
      }
      return val
    },
    //获取左侧勾选数据
    getLeftSelect(item) {
      // this.leftSelectData = item
      this.leftSelectData = this.$refs.leftTable.selection
      this.rightBtn = true
      // this.leftBtn = true
    },
    //获取右侧勾选数据
    getRightSelect(item) {
      // this.rightSelectData = item
     this.rightSelectData = this.$refs.rightTable.selection
     this.leftBtn = true
      // this.leftBtn = false
    },
    // 右移按钮
    bothRight() {
      if (this.rightTableQuery.bookNo == '') {
        this.$message({
          message: '请先查询右侧册本号！',
          type: 'warning'
        })
        return
      }
      //选中数据按顺序排
      JSON.stringify(this.leftSelectData.sort(this.compareData('sortNo')))
      for (let i = this.leftSelectData.length - 1; i >= 0; i--) {
        // 将bookNo值变为接收列表里面的bookNo的值
        this.leftSelectData[i].bookNo = this.rightTableQuery.bookNo
        this.leftSelectData[i].oldBookNo = this.leftTableQuery.bookNo
        if(this.saveData.some(item => item.userNo === this.leftSelectData[i].userNo)){
          this.saveData.splice(this.saveData.findIndex(item => item.userNo === this.leftSelectData[i].userNo),1)
        }else{
          this.saveData.unshift(this.leftSelectData[i])
        }
        // this.rightTableData.unshift(this.leftSelectData[i])
        if (this.rightSign) {
          this.rightTableData.splice(this.rightIndex+1,0,this.leftSelectData[i])
        }else{
          this.rightTableData.unshift(this.leftSelectData[i])
        }
        this.rightTableData = this.uniqueFunc(this.rightTableData, 'userNo')
        for (let j = 0; j < this.leftTableData.length; j++) {
          if (this.leftTableData[j].userNo == this.leftSelectData[i].userNo) {
            this.leftTableData.splice(j, 1)
            // this.leftTableData.total -= 1
            // this.rightTableData.total += 1
          }
        }
      }
      this.leftSelectData = []
      this.$refs.leftTable.clearSelection();//清除左侧已勾选的
     if(this.rightBtn == true){
      if(this.saveData.length == 0){
        this.disabledSaveBtn = true
      } else {
        this.disabledSaveBtn = false
      }
      } else {
        this.disabledSaveBtn = true
      }
      this.leftAllList = JSON.parse(JSON.stringify(this.leftTableData))
      this.leftInitSign = true
      this.rigtAllList = JSON.parse(JSON.stringify(this.rightTableData))
      this.rightInitSign = true
    },
       //列表去重
    uniqueFunc(...args) {
	const paramsLength = arguments.length;
	if(paramsLength == 1) {
		return [...new Set(arr)];
	} else {
		const res = new Map();
		const flag = arguments[1];
		return arguments[0].filter(item => !res.has(item[flag]) && res.set(item[flag], item));
	}
},
    // 左移按钮
    bothLeft() {
      if (this.leftTableQuery.bookNo == '') {
        this.$message({
          message: '请先查询左侧册本号！',
          type: 'warning'
        })
        return
      }
      //选中数据按顺序排
      JSON.stringify(this.rightSelectData.sort(this.compareData('sortNo')))
      for (let i = this.rightSelectData.length - 1; i >= 0; i--) {
        // 将bookNo值变为接收列表里面的bookNo的值
        this.rightSelectData[i].bookNo = this.leftTableQuery.bookNo
        this.rightSelectData[i].oldBookNo = this.rightTableQuery.bookNo
        if(this.saveData.some(item => item.userNo === this.rightSelectData[i].userNo)){
          this.saveData.splice(this.saveData.findIndex(item => item.userNo === this.rightSelectData[i].userNo),1)
        }else{

          this.saveData.unshift(this.rightSelectData[i])
        }
        // this.leftTableData.unshift(this.rightSelectData[i])
        if (this.leftSign) {
          this.leftTableData.splice(this.leftIndex + 1 ,0, this.rightSelectData[i])
        }else{
          this.leftTableData.unshift(this.rightSelectData[i])
          //  this.leftTableData.push(this.rightSelectData[i])
        }
        this.leftTableData = this.uniqueFunc(this.leftTableData, 'userNo')
        for (let j = 0; j < this.rightTableData.length; j++) {
          if (this.rightTableData[j].userNo == this.rightSelectData[i].userNo) {
            this.rightTableData.splice(j, 1)
          }
        }
      }
      this.rightSelectData = []
      this.$refs.rightTable.clearSelection();//清除右侧已勾选的
     if(this.leftBtn == true){
       if(this.saveData.length == 0){
        this.disabledSaveBtn = true
      } else {
        this.disabledSaveBtn = false
      }
      } else {
        this.disabledSaveBtn = true
      }
      this.leftAllList = JSON.parse(JSON.stringify(this.leftTableData))
      this.leftInitSign = true
      this.rigtAllList = JSON.parse(JSON.stringify(this.rightTableData))
      this.rightInitSign = true
    },
   sortLeftCompareMethod({prop,order}){
      let temLeftTableData = JSON.parse(JSON.stringify(this.leftTableData))
      temLeftTableData.sort(this.compare(prop, order))
      this.leftTableData = temLeftTableData
      this.$refs.leftTable.clearSort()
      this.leftSortSign = true
    },
   sortRightCompareMethod({prop,order}){
      // console.log(prop,order)
      let temRightTableData = JSON.parse(JSON.stringify(this.rightTableData))
      temRightTableData.sort(this.compare(prop, order))
      this.rightTableData = temRightTableData
      this.$refs.rightTable.clearSort()
      this.rightSortSign = true
    },
    compareData(property){
      return function (obj1,obj2){
        return obj1[property]-obj2[property];
      }
    },
    compare(propertyName, sort){
      return function (obj1,obj2){
        var value1 = obj1[propertyName]
        var value2 = obj2[propertyName]
        if(typeof value1 === "string" && typeof value2 === "string"){
          const res = value1.localeCompare(value2,"zh");
          return sort === "ascending" ? res : -res
        } else {
          if(value1 <= value2){
            return sort == "ascending" ? -1 : 1;
          } else if(value1 > value2){
            return sort == "ascending" ? 1 : -1;
          }
        }
      }
    },
    // 保存按钮
    save() {
      let _this = this
     this.clearRowKeyData = true//清除rowkey已绑定值
    //  console.log(this.rightTableData);
    // let rightTemData = [...this.rightTableData]
    // let leftTemData = [...this.leftTableData]
    let rightTemData = JSON.parse(JSON.stringify(this.rightTableData))
    let leftTemData = JSON.parse(JSON.stringify(this.leftTableData))
      var selectLeftItem = this.leftSelectData
      var selectRightItem = this.rightSelectData
      var mainKey = ''
      if (this.leftSortSign || this.rightSortSign) {
        for(let i=0 ; i < rightTemData.length;i++){
          rightTemData[i].sortNo = i+1
          if (rightTemData[i].oldBookNo == '') {
            rightTemData[i].oldBookNo=rightTemData[i].bookNo
          }
        }
        for(let i=0 ; i < leftTemData.length;i++){
          leftTemData[i].sortNo = i+1
          if (leftTemData[i].oldBookNo == '') {
            leftTemData[i].oldBookNo=leftTemData[i].bookNo
          }
        }
      }else{
if(selectLeftItem.length > 0){
        console.log("左");
      for(let i=0 ; i < leftTemData.length;i++){
        for(let j=0 ; j <  selectLeftItem.length;j++){
          if(leftTemData[i].userNo == selectLeftItem[j].userNo){
            mainKey = i
          }
        if (leftTemData[i].oldBookNo == '') {
         leftTemData[i].oldBookNo=leftTemData[i].bookNo
       }
        }
     }
      var delKey = []
             leftTemData.forEach((item,index) => {
              if(item.index < mainKey){
              delKey.push(item)
              }
             })
             leftTemData.forEach(items =>{
               delKey.forEach(item =>{
                 if(items.userNo == item.userNo){
                   leftTemData.splice(items,delKey.length)
                 }
               })
             })
     for(let k=0 ; k < leftTemData.length;k++){
       if(k !== 0){
           leftTemData[k].sortNo = leftTemData[k-1].sortNo +1
       }
     }

      }else if(selectRightItem.length > 0){
         console.log("右");
     for(let i=0 ; i < rightTemData.length;i++){
        for(let j=0 ; j <  selectRightItem.length;j++){
          if(rightTemData[i].userNo == selectRightItem[j].userNo){
            mainKey = i
          }
        if (rightTemData[i].oldBookNo == '') {
         rightTemData[i].oldBookNo=rightTemData[i].bookNo
       }
        }
     }
      var delKeys = []
             rightTemData.forEach((item,index) => {
              if(item.index < mainKey){
              delKeys.push(item)
              }
             })
             rightTemData.forEach(items =>{
               delKeys.forEach(item =>{
                 if(items.userNo == item.userNo){
                   rightTemData.splice(items,delKeys.length)
                 }
               })
             })
     for(let k=0 ; k < rightTemData.length;k++){
       if(k !== 0){
           rightTemData[k].sortNo = rightTemData[k-1].sortNo +1
       }
     }

      }else{
        console.log("原");
     for(let i=0 ; i < rightTemData.length;i++){
       rightTemData[i].sortNo = i+1
       if (rightTemData[i].oldBookNo == '') {
         rightTemData[i].oldBookNo=rightTemData[i].bookNo
       }
     }
     for(let i=0 ; i < leftTemData.length;i++){
       leftTemData[i].sortNo = i+1
       if (leftTemData[i].oldBookNo == '') {
         leftTemData[i].oldBookNo=leftTemData[i].bookNo
       }
     }
      }
      }
      
      let params = {
        "busicode": "MrBookUserSave",
        // "data": [...this.saveData],
        "data": [...rightTemData,...leftTemData],
      }

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.saveData=[]
        this.clearRowKeyData = false//激活rowkey绑定值方法
        this.disabledSaveBtn = true
        this.leftInitSign = false
        this.rightInitSign = false
        this.leftSortSign = false
        this.rightSortSign = false
        this.getLeftTableData()
        this.getRightTableData()
      })
    },
    init() {

    },
    hidden() {
      if (this.isActive == true) {
        $('.upchange').addClass('el-icon-arrow-down').removeClass('el-icon-arrow-up')
        this.isActive = false;
        $('.el-table--fit').css('height', '66%');

      } else {
        $('.upchange').addClass('el-icon-arrow-up').removeClass('el-icon-arrow-down')

        this.isActive = true;
        $('.el-table--fit').css('height', '50%');
      }
    },
    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    exportExcel() {
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
    handleSizeChange(val) { //显示多少数据一页
      this.leftTableQuery.pageCount = val
      this.leftTableQuery.page = 1
      this.getLeftTableData()
      this.$refs.leftTable.setCurrentRow(-1);
      this.leftSign = false
      this.leftRow = ''
    },
    handleCurrentChange(val) {  //显示多少页码
      this.leftTableQuery.page = val
      this.getLeftTableData()
      this.$refs.leftTable.setCurrentRow(-1);
      this.leftSign = false
      this.leftRow = ''
    },
    indexMethod(index) {//获取表格序号
      return  (this.leftTableQuery.page-1)*this.leftTableQuery.pageCount + (index+1) ;
      //return (this.histroyData.pageSize - 1) * this.histroyData.pages + (index + 2) - 20;

    },
    //分页
    handleSizeChange1(val) { //显示多少数据一页
      this.rightTableQuery.pageCount = val
      this.rightTableQuery.page = 1
      this.getRightTableData()
      this.$refs.rightTable.setCurrentRow(-1);
      this.rightSign = false
      this.rightRow = ''
    },
    handleCurrentChange1(val) {  //显示多少页码
      this.rightTableQuery.page = val
      this.getRightTableData()
      this.$refs.rightTable.setCurrentRow(-1);
      this.rightSign = false
      this.rightRow = ''
    },
    indexMethod1(index) {//获取表格序号
      return  (this.rightTableQuery.page-1)*this.rightTableQuery.pageCount + (index+1) ;
      //return (this.histroyData.pageSize - 1) * this.histroyData.pages + (index + 2) - 20;

    },
    //   查看历史
    viewHistory(index, row) {

    },
    cellClickLeft(row, column, cell, event) { //点击文件名
      let that = this;
      row.flag = !row.flag;
      this.leftRow = row
      if (row.flag) {
        this.$refs.leftTable.setCurrentRow(row,true);
        this.leftIndex = row.index
        this.leftSign = true
      }else{
        this.$refs.leftTable.setCurrentRow(-1);
        this.leftSign = false
      }
      // 点击行勾选
      const len = row.rowspan != undefined? row.rowspan : 1
      const ind = this.leftTableData.findIndex(item => item.userNo === row.userNo)
      var select = []
      for(let i = ind; i < ind + len; i++) {
        select.push(this.leftTableData[i])
      }
      if(this.leftSelectData.some(item => select.some(val => val.userNo === item.userNo))) { //取消勾选
        this.getLeftSelect(this.leftSelectData.filter(item => select.every(val => val.userNo !== item.userNo)))
        select.forEach(item => {
          this.$refs.leftTable.toggleRowSelection(item, false);
        })
      } else { //恢复勾选
        this.getLeftSelect(this.leftSelectData.concat(select))
        this.leftSelectData.concat(select).forEach(item =>{
          this.$refs.leftTable.toggleRowSelection(item, true);
        })
      }
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.leftTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.leftTable.clearSelection();
        }
      },
    leftSelect(item, index){
      index.flag = !index.flag;
      this.leftRow = index
      if (index.flag) {
        this.$refs.leftTable.setCurrentRow(index,true);
        this.leftIndex = index.index
        this.leftSign = true
      }else{
        this.$refs.leftTable.setCurrentRow(-1);
        this.leftSign = false
      }
      //shift多选
        const data = this.$refs.leftTable.tableData; // 获取所以数据
        const leftOrigin = this.leftOrigin; // 起点数 从-1开始
        const endIdx = index.index; // 终点数
        if (this.leftPin && item.includes(data[leftOrigin])) { // 判断按住
          const sum = Math.abs(leftOrigin - endIdx) + 1;// 这里记录终点
          const min = Math.min(leftOrigin, endIdx);// 这里记录起点
          let i = 0;
          while (i < sum) {
            const index = min + i;
              this.$refs.leftTable.toggleRowSelection(data[index], true); // 通过ref打点调用toggleRowSelection方法，第二个必须为true
            i++;

          }
        } else {
          this.leftOrigin = index.index; // 没按住记录起点
        }

    },
    cellClickRight(row, column, cell, event) { //点击文件名
      let that = this;
      row.flag = !row.flag;
      this.rightRow = row
      if (row.flag) {
        this.$refs.rightTable.setCurrentRow(row,true);
        this.rightIndex = row.index
        this.rightSign = true
      }else{
        this.$refs.rightTable.setCurrentRow(-1);
        this.rightSign = false
      }
      // 点击行勾选
      const len = row.rowspan != undefined? row.rowspan : 1
      const ind = this.rightTableData.findIndex(item => item.userNo === row.userNo)
      var select = []
      for(let i = ind; i < ind + len; i++) {
        select.push(this.rightTableData[i])
      }
      if(this.rightSelectData.some(item => select.some(val => val.userNo === item.userNo))) { //取消勾选
        this.getRightSelect(this.rightSelectData.filter(item => select.every(val => val.userNo !== item.userNo)))
        select.forEach(item => {
          this.$refs.rightTable.toggleRowSelection(item, false);
        })
      } else { //恢复勾选
        this.getRightSelect(this.rightSelectData.concat(select))
        this.rightSelectData.concat(select).forEach(item =>{
          this.$refs.rightTable.toggleRowSelection(item, true);
        })
      }
    },
     rightSelect(item, index){
      let that = this;
      index.flag = !index.flag;
      this.rightRow = index
      if (index.flag) {
        this.$refs.rightTable.setCurrentRow(index,true);
        this.rightIndex = index.index
        this.rightSign = true
      }else{
        this.$refs.rightTable.setCurrentRow(-1);
        this.rightSign = false
      }
            //shift多选
        const data = this.$refs.rightTable.tableData; // 获取所以数据
        const rightOrigin = this.rightOrigin; // 起点数 从-1开始
        const endIdx = index.index; // 终点数
        if (this.rightPin && item.includes(data[rightOrigin])) { // 判断按住
          const sum = Math.abs(rightOrigin - endIdx) + 1;// 这里记录终点
          const min = Math.min(rightOrigin, endIdx);// 这里记录起点
          let i = 0;
          while (i < sum) {
            const index = min + i;
              this.$refs.rightTable.toggleRowSelection(data[index], true); // 通过ref打点调用toggleRowSelection方法，第二个必须为true
            i++;

          }
        } else {
          this.rightOrigin = index.index; // 没按住记录起点
        }

    },
    cellStyle(data){
      return "cursor:pointer;"
    },
    tableRowClassName({row, rowIndex}){
      row.index = rowIndex;
      return 'rows'
    },
    closeDialog() { //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
      // this.waterAddVisible = false;
    },
    // 添加
    add() {

    },
    // 编辑
    edit() {
      this.backfillVisible = true;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    maxHeight1() {
      this.tableShow1 = false
      this.$nextTick(() => {
        this.tableShow1 = true
      })
    },
    rightTableData:{
      handler(newVal) {
        if (this.rightRow!='') {
          var row = newVal.filter(item=>{
            return item.userNo == this.rightRow.userNo && item.sortNo == this.rightRow.sortNo
          })
          // debugger
          if (row.length!=0) {
            this.$nextTick(() => {
              this.rightIndex = row[0].index
            })
          }else{
            this.rightIndex = 0
            this.rightSign = false
          }
        }

      },
        deep:true
    },
    leftTableData:{
      handler(newVal) {
        if (this.leftRow!='') {
          var row = newVal.filter(item=>{
            return item.userNo == this.leftRow.userNo && item.sortNo == this.leftRow.sortNo
          })
          // debugger
          if (row.length!=0) {
            this.$nextTick(() => {
              this.leftIndex = row[0].index
            })
          }else{
            this.leftIndex = 0
            this.leftSign = false
          }

        }

      },
        deep:true
    }
  }
}
</script>
<style lang="scss">
.MeterReadingCircuit {
  .toolbar{
    padding: 10px 0 10px 10px
  }
  width: 100%;
  .bookNo-input{
    .el-input__inner{
      width:300px
    }

  }
  .bookNo-select{
    .el-input__inner{
      width:200px !important
    }

  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .adjuge {
    height: calc(100% - 40px);
  }
  .el-table {
    height: 100%!important;
  }
  .btnBox {
    display: inline-block;
    width: 100%;
    text-align: right !important;
    // margin-bottom: 2%;
  }
  .btnBox .el-button {
    margin-left: 2%;
    font-size: 14px;
  }
  .el-tabs {
    height: 100%;
    .one1 {
      width: calc(47% - 20px);
      height: 100%;
      // overflow-y: scroll;
      // border: 1px solid #ebeef5;
      .role {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        text-align: center;
        // background:#f5f7fa;
        background: #dedfe0;
        font-size: 20px;
      }
      ul {
        margin: 0px auto;
        //width: 100%;
        height: 100%;
      }
      li {
        width: calc(100% - 70px);
        margin: 0 auto;
        font-size: 17px;
      }
      ul li {
        //margin-top: 15px;
      }
      ul li a {
        color: #000;
        font-size: 17px;
      }
      ul li a:hover {
        color: #006699;
      }
    }
    .two1 {
      width: calc(6% - 20px);
      height: 92%;
      text-align: center;
      div {
        margin-top: 20px;
        .el-button {
          height: 28px;
          width: 56px;
        }
      }
    }
    .three1 {
      width: calc(47% - 20px);
      height: 100%;
      // overflow: auto;
      // border: 1px solid #ebeef5;
      .rolefun {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        text-align: center;
        background: #dedfe0;
        font-size: 20px;
      }
    }
    .one1 {
      margin:0 10px;
    }
    .two1,
    .three1 {
      margin: 0 10px;
    }
    // .el-button--primary {
    //   width: 80px;
    //   height: 40px;
    //   font-size: 20px;
    //   background: #47b5e8;
    //   border-color: #47b5e8;
    // }
    .el-tree {
      height: 90%;
      overflow-y: auto;
    }
    .el-checkbox__inner {
      margin-left: 0.1rem;
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 12px;
    }
  }
  .el-tabs__content {
    // height: calc(100% - 40px);
    height: calc(100% - 15px);
    // width: 1280px;
    // width: calc(100%-220px);
    display: flex;
    flex-direction: row;
  }
  #pane-comprehensiveBusiness1,
  #pane-mydestop1 {
    width: 100%;
  }
  .form-left > .el-form-item__content {
    width: 100%;
  }
  .form-left {
    width: 100%;
  }
  .block {
    li {
      width: auto !important;
      min-width: 25.5px;
    }
  }
  .el-table tbody tr:hover>td {
    background-color:silver !important
  }
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row>td {
    // color: #fff;
    background-color:silver !important
  }
  // 地址样式
  /deep/ .addr{
    width: 47%;
    .addr .el-form-item__content{
      width: calc(100% - 72px);
      .el-input__inner{
        width: 100%;
      }
    }
  }
}
</style>
