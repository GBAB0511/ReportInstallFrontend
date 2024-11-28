<template>
  <!-- 未收统计表 -->
  <div class="ChargeReportOfUncollectedSummary">
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
      <div  class="company-right">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item class="form-left">
         <el-form-item label="账期：">
            <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
          </el-form-item>
              <!-- <el-form-item label='账期：'>
                <el-date-picker v-model="Time" @change="getDatePicker" type="monthrange" value-format="yyyyMM" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item> -->

              <el-form-item label="营业区域：" class="width-150">
          <el-cascader
            ref="cascader"
            clearable
            v-model="tableQuery.businessAreaId"
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
          <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" show-summary :summary-method='getTotal' stripe border :data="tableData.list" class="ChargeReportOfUncollectedSummary-table">

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="waterTypeName" min-width="100" label="用水类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userNum" min-width="80" label="未收户数" show-overflow-tooltip align="right">
               <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.userNum}}</span>
             </template>
            </el-table-column>

            <template v-for='(col) in costList'>
              <el-table-column
                show-overflow-tooltip
                :prop="col.costNameEn"
                :label="col.costName"
                :key="col.costNo"
                v-if="col.costName.length>0"
                 align="right"
                min-width="100">
              </el-table-column>
            </template>
            <el-table-column v-if="lj" prop="ljclf" min-width="120" label="垃圾处理费" show-overflow-tooltip align="right">
            </el-table-column>
            <el-table-column prop="totalCost" min-width="120" label="未收合计" show-overflow-tooltip align="right">
            </el-table-column>

           
          </el-table>
          
        </div>
        <!-- 分页 -->
          <!-- <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
          </div> -->
      </div>
      <el-dialog title="应收明细" :visible.sync="showDetail" class="common-dialog" @close="closeDialog">
        <div class="dialog-detail" style="height: 100%;">
          <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border show-summary :summary-method='getDetailTotal'  @sort-change='getSort' :data="detailData.list" class="ChargeReportOfReceivablesDetailed-table" ref="eltableCurrentRow">
              
              <el-table-column type="index" label="NO." width="50" fixed="left" :index="detailIndexMethod">
              </el-table-column>

              <el-table-column prop="userNo" min-width="130" label="用户编号" fixed="left" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="ctmName" min-width="200" label="客户名称" fixed="left" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="linkTel" min-width="130" label="手机号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="realityWater" min-width="120" label="应收水量" align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="total" min-width="120" label="合计费用" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="subTotal" min-width="120" label="综合水费" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="ctmAddr" min-width="200" label="客户地址" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="accountPeriod" min-width="100" label="账期" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="meterReadingStaffName" min-width="100" label="账单抄表员" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="bookNo" min-width="100" label="册本号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="icCardNo" min-width="100" label="IC卡号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="chargeStaffName" min-width="100" label="收费员名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="waterTypeName" min-width="200" label="用水类型" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="meterTypeName" min-width="100" label="水表分类" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="chargingFlagName" min-width="80" label="销账状态" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="setMeterAddr" min-width="200" label="装表地址" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="businessArea" min-width="120" label="营业区域" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="baseWaterTotal" min-width="120" label="基本水费" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column :prop="item.costAttr" align="right" :label="item.costName" min-width="150" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
                <template slot-scope="scope">
                  <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="waterJ1" min-width="110" label="一阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="priceJ1" min-width="110" label="一阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="ladderJ1" min-width="110" label="一阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="waterJ2" min-width="110" label="二阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="priceJ2" min-width="110" label="二阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="ladderJ2" min-width="110" label="二阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="waterJ3" min-width="110" label="三阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="priceJ3" min-width="110" label="三阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="ladderJ3" min-width="110" label="三阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="waterJ4" min-width="110" label="四阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="priceJ4" min-width="110" label="四阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="ladderJ4" min-width="110" label="四阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="waterJ5" min-width="110" label="五阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="priceJ5" min-width="110" label="五阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="ladderJ5" min-width="110" label="五阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="waterJ6" min-width="110" label="六阶水量" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="priceJ6" min-width="110" label="六阶水价" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="ladderJ6" min-width="110" label="六阶金额" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="penaltyMoney" min-width="120" label="违约金" align="right" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>
              <el-table-column prop="createTime" min-width="180" label="开账时间" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="informTime" min-width="180" label="通知时间" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="chargeTime" min-width="180" label="销账时间" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
              </el-table-column>

              <el-table-column prop="priorPeriodNum" min-width="80" label="上期始码" align="right" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="currendPeriodNum" min-width="80" label="本期止码" align="right" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="openType" min-width="80" label="开账类型" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="comments" min-width="180" label="备注" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="vatFlag" min-width="80" label="是否税票" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="reviewName" min-width="70" label="复核人" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="reviewTime" min-width="120" label="复核时间" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="reviewFlag" min-width="80" label="复核标记" show-overflow-tooltip>
              </el-table-column>
            </el-table>

          </div>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="detailHandleSizeChange" @current-change="detailHandleCurrentChange" :current-page="dialogTableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="dialogTableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total"></el-pagination>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "ChargeReportOfUncollectedSummary",
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
        emitPath:false,
      },
      lj:null,
      costList:[],
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
        // page: 1,
        // pageCount: 20,
        // startAccountPeriod: '',
        // endAccountPeriod: '',
        accountPeriod:'',
        useWaterTypeNo:'',
        businessAreaId:'',
      },
      // 查询条件日期
      Time: [],
      //面包屑
      crumbsData: {
        titleList: [{ title: "收费管理报表" }, { title: "未收统计表" }]
      },
      tableShow: false,
      maxHeight: 0,
      useWaterTypeNo:'',
      parentId:'',
      totalData:{},
      // 弹窗详情显示
      showDetail: false,
      // 详情数据
      detailData: {},
      detailTotalData: {},
      costNameList:[],
      dialogTableQuery: {
        page: 1,
        pageCount: 20,
        bookNos:[],
        fuzzyQuery:'',
        // waterTypeId: this.tableQuery.useWaterTypeNo,
        // businessArea: this.tableQuery.businessAreaId,
        shouldAmountStart:'',
        shouldAmountEnd:'',
        chargingFlag:"0",
        openType:'',
        vatFlag:'',
        shouldWaterAmountStart:"",
        shouldWaterAmountEnd:"",
        meterReadingStaffName:'',
        more:'大于等于',
        less:'小于',
        moreMoney:'大于等于',
        lessMoney:'小于',
        sort:'',
        meterType: '', //水表分类
        groupCode: localStorage.getItem('companyNo'),
      },
      row: {}
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    this.selectBAreaOptions();
    this.dragControllerDiv()
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    this.tableQuery.accountPeriod = time.getFullYear() + month
    this.getTreeDatas();
    this.getInvoiceCostsAndTypes();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ChargeReportOfUncollectedSummary", [
      ".ChargeReportOfUncollectedSummary .toolbar",
      ".ChargeReportOfUncollectedSummary .block",
      ".ChargeReportOfUncollectedSummary #crumbs"
    ]);
  },
  methods: {
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
    // 列表初始化
    init() {
      let _this = this
      this.tableQuery.useWaterTypeNo=_this.useWaterTypeNo;
      let params = {
        busicode: "ArrearsReport",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
        _this.totalData = res.detail
        this.common.changeTable(this, ".ChargeReportOfUncollectedSummary", [
          ".ChargeReportOfUncollectedSummary .toolbar",
          ".ChargeReportOfUncollectedSummary .block",
          ".ChargeReportOfUncollectedSummary #crumbs"
        ]);
      })
    },
    // 获取费用及票据类型
    getInvoiceCostsAndTypes() {
      let _this = this;
      let params = {
        busicode: "FctInvoiceGetCost",
        data: {}
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        let cost = []
        this.lj=res.ljclf
        let lj = res.ljclf
        res.costList.forEach((item)=>{
          if(!lj || lj.indexOf(item.costNameEn)==-1){
            cost.push(item)
          }
        })
        this.costList=cost
      })
    },
     // 导出
    exportExcel() {
      let params = {
        "busicode": "ArrearsReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
     // 返回合计数据
    getTotal(total){
      const columns=  total.columns
      let arr = ['合计']
      for (const column of columns) {
        if (typeof(column.property) !== "undefined" && this.totalData[column.property] != '合计') {
          arr.push(this.totalData[column.property])
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
          _this.useWaterTypeNo = res.code;
          _this.parentId=res.id;
          // _this.init();
        });
    },
        // 树的点击
    backTreeData(val) {
      let _this = this;
      this.parentId = val.id;
      this.useWaterTypeNo = val.code;
      // this.tableQuery.page = 1;
      this.tableQuery.useWaterTypeNo=val.code;
      this.tableQuery.businessAreaId = this.common.handleTreeData(
        this.tableQuery.businessAreaId
      );
      // this.tableQuery.accountPeriod = parseInt(this.tableQuery.accountPeriod)
      let params = {
        busicode: "ArrearsReport",
        data: this.tableQuery
      };
      this.$api
        .fetch({params: params})
        .then(res => {
         _this.tableData = res
        _this.totalData = res.detail
        });
    },
    // 查询
    search() {
      // this.tableQuery.page = 1;
      this.init();
    },
    // 未收户数钻取
    handleDetail(row) {

      this.row = row

      this.showDetail = true
      this.$nextTick(() => {
        this.common.changeTable(this, '.dialog-detail', [
          '.dialog-detail .toolbar',
          '.dialog-detail .block'
        ])
      })

      this.dialogTableQuery.waterTypeId = row.useWaterType
      this.dialogTableQuery.businessArea = this.tableQuery.businessAreaId

      let params = {
      busicode: "ReceivableDetailReport",
      data: this.dialogTableQuery
    }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.detailData = res.detail
        this.detailTotalData = res.total
        this.costNameList =res.costNameList
        this.detailData.list.forEach(item => {
          item.total = this.formatFloat(item.total)
          item.subTotal = this.formatFloat(item.subTotal)
          item.baseWaterTotal = this.formatFloat(item.baseWaterTotal)
          item.waterJ1 = this.removeZero(item.waterJ1)
          item.priceJ1 = this.removeZero(item.priceJ1)
          item.waterJ2 = this.removeZero(item.waterJ2)
          item.priceJ2 = this.removeZero(item.priceJ2)
          item.waterJ3 = this.removeZero(item.waterJ3)
          item.priceJ3 = this.removeZero(item.priceJ3)
          item.waterJ4 =this.removeZero(item.waterJ4)
          item.priceJ4 = this.removeZero(item.priceJ4)
          item.waterJ5 =this.removeZero(item.waterJ5)
          item.priceJ5 = this.removeZero(item.priceJ5)
          item.waterJ6 =this.removeZero(item.waterJ6)
          item.priceJ6 = this.removeZero(item.priceJ6)
          if (item.priceJ1!=="") {
            item.priceJ1 = this.formatFloat(item.priceJ1)
          }
          if (item.priceJ2!=="") {
            item.priceJ2 = this.formatFloat(item.priceJ2)
          }
          if (item.priceJ3!=="") {
            item.priceJ3 = this.formatFloat(item.priceJ3)
          }
          if (item.priceJ4!=="") {
            item.priceJ4 = this.formatFloat(item.priceJ4)
          }
          if (item.priceJ5!=="") {
            item.priceJ5 = this.formatFloat(item.priceJ5)
          }
          if (item.priceJ6!=="") {
            item.priceJ6 = this.formatFloat(item.priceJ6)
          }
          item.costList.forEach(child => {
            child.money = this.formatFloat(child.money)
          })
          item.penaltyMoney = this.formatFloat(item.penaltyMoney)
        })

        this.detailTotalData.total = this.formatFloat(this.detailTotalData.total)
        this.detailTotalData.subTotal = this.formatFloat(this.detailTotalData.subTotal)
        this.detailTotalData.znFee = this.formatFloat(this.detailTotalData.znFee)
        this.detailTotalData.ecFee = this.formatFloat(this.detailTotalData.ecFee)
        this.detailTotalData.wsWater = this.formatFloat(this.detailTotalData.wsWater)
        this.detailTotalData.bzsWater = this.formatFloat(this.detailTotalData.bzsWater)
        this.detailTotalData.wasteFee = this.formatFloat(this.detailTotalData.wasteFee)
        this.detailTotalData.baseWaterTotal = this.formatFloat(this.detailTotalData.baseWaterTotal)
        this.detailTotalData.penaltyMoney = this.formatFloat(this.detailTotalData.penaltyMoney)
      })
    },
    closeDialog(){
      this.showDetail = false
      this.common.changeTable(this, ".ChargeReportOfUncollectedSummary", [
        ".ChargeReportOfUncollectedSummary .toolbar",
        ".ChargeReportOfUncollectedSummary .block",
        ".ChargeReportOfUncollectedSummary #crumbs"
      ]);
    },
     // 返回合计数据
    getDetailTotal(param){
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray=['合计','']
      selectedColm.forEach(a => {
          if(vm.detailTotalData[a.property]||vm.detailTotalData[a.property]==0||vm.detailTotalData[a.property]=='0'){//与表格列进行匹配
            newArray.push(vm.detailTotalData[a.property])
          }else{
            if(a.property!=undefined){//序号列不push
              newArray.push('')
            }
          }
        });
      sums=newArray;
      sums[2] = ''
      return sums;
    },
    getSort(sort){
      console.log(sort);
      if (sort.prop === '智能表改造费'){
        sort.prop = 'znFee'
      }else if (sort.prop === '二次供水服务费'){
        sort.prop = 'ecFee'
      }else if (sort.prop === "不征税自来水"){
        sort.prop = 'bzsWater'
      }else if (sort.prop === '污水费'){
        sort.prop = 'wsWater'
      }else if (sort.prop === '垃圾费'){
        sort.prop = 'wasteFee'
      }
      if (sort.prop === 'waterJ1' || sort.prop === 'priceJ1' || sort.prop === 'waterJ2' || sort.prop === 'priceJ2' || sort.prop === 'waterJ3' || sort.prop === 'priceJ3'
        || sort.prop === 'waterJ4' || sort.prop === 'priceJ4' || sort.prop === 'waterJ5' || sort.prop === 'priceJ5' || sort.prop === 'waterJ6' || sort.prop === 'priceJ6'){
        sort.prop = sort.prop.substring(0,5) + '_'+ sort.prop.substring(5);
      }
      if(sort.prop === 'ctmAddr'){
        sort.prop = 'ctm_addr'
      }else if (sort.prop === 'ctmName'){
        sort.prop = 'ctm_name'
      }
      if(sort.prop === 'chargeTime'){
        sort.prop = 'CHARGE_TIME'
      }
      if (sort.order === 'descending'){
        this.dialogTableQuery.sort = 'a.' + sort.prop + ' DESC';
      }else if (sort.order === 'ascending'){
        this.dialogTableQuery.sort = 'a.' + sort.prop + ' ASC';
      }else {
        this.dialogTableQuery.sort = null;
      }
      this.handleDetail(this.row);
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
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
   indexMethod(index) {
      //获取表格序号
      return (
        (1 - 1) * 20 + (index + 1)
      );
    },
    //详情分页
    detailHandleSizeChange(val) {
      //显示多少数据一页
      this.dialogTableQuery.pageCount = val
      this.dialogTableQuery.page = 1
      this.handleDetail(this.row);
    },
    detailHandleCurrentChange(val) {
      //显示多少页码
      this.dialogTableQuery.page = val
      this.handleDetail(this.row);
    },
    detailIndexMethod(index) {
      //获取表格序号
      return (this.dialogTableQuery.page - 1) * this.dialogTableQuery.pageCount + (index + 1);
    },
    formatFloat(num){
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
    Time(val) {
      if(val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }
    },
    "tableQuery.accountPeriod": {
      handler: function (newval, oldval) {
        var curYear = newval.toString().slice(0,4)
        var curMonth = newval.toString().slice(-2)
        // console.log(curYear,curMonth);
        
        let firstDate = new Date(curYear,Number(curMonth)-1,1)
        let lastDay = new Date(curYear,curMonth,0)

        let firstDateYear = firstDate.getFullYear().toString(),
        firstDateMonth = (firstDate.getMonth() + 1) > 9 ? (firstDate.getMonth() + 1).toString() : '0' + (firstDate.getMonth() + 1),
        firstDateDay = '0' + firstDate.getDate().toString();

        let lastDateYear = lastDay.getFullYear().toString(),
        lastDateMonth = (lastDay.getMonth() + 1) > 9 ? (lastDay.getMonth() + 1).toString() : '0' + (lastDay.getMonth() + 1),
        lastDateDay = lastDay.getDate().toString();

        this.dialogTableQuery.startAccountPeriod = firstDateYear+'-'+firstDateMonth+'-'+firstDateDay
        this.dialogTableQuery.endAccountPeriod = lastDateYear+'-'+lastDateMonth+'-'+lastDateDay
        
      },
      deep: true,
    }
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.ChargeReportOfUncollectedSummary {
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
  .kl-table{
    padding: 10px 20px 0px;
  }
}
</style>

<style lang="scss">
.ChargeReportOfUncollectedSummary {
  .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>