<template>
  <div class="MeterReadingDataEntry">
    <div class="DataEntry-right">
      <div class="DataEntry-right-detail">
        <div class="my-input-detail">
          <div class="label-detail">
            <span>客户名称：</span>
          </div>
          <div class="dialogcontent-detail">
            <span :title="formData.ctmName">{{formData.ctmName}}</span>
          </div>
        </div>

        <div class="my-input-detail">
          <div class="label-detail">
            <span>用户编号：</span>
          </div>
          <div class="dialogcontent-userno-detail">
            <span>{{formData.userNo}}</span>
          </div>
          <div v-if="formData.changeMeterFlag == 1">
            <el-badge class="mark" value="换" />
          </div>
        </div>

        <div class="my-input-detail">
          <div class="label-detail">
            <span>装表地址：</span>
          </div>
          <div class="dialogcontent-detail">
            <span :title="formData.setupMeterAddr">{{formData.setupMeterAddr}}</span>
          </div>
        </div>

        <div class="my-input-detail">
          <div class="label-detail">
            <span>用水类型：</span>
          </div>
          <div class="dialogcontent-detail">
            <span>{{formData.useWaterType}}</span>
          </div>
        </div>

        <div class="my-input-detail">
          <span></span>
          <div class="label-detail">
            <span>上期抄表日：</span>
          </div>
          <div class="dialogcontent-detail">
            <span>{{formData.priorPeriodDate}}</span>
          </div>
        </div>
      </div>

      <div class="DataEntry-righ-search">
        <el-form :model="formData" class="formBill-One" ref="form" label-width="100px">
          <el-form-item label="抄表日期：">
            <el-date-picker v-model="formData.meterReadingDate" size="mini" type="date" placeholder="选择日期" disabled></el-date-picker>
          </el-form-item>
          <el-form-item class="Thickening" label="抄表状态：">
            <el-select v-model="formData.status" @change="statusChange" clearable size="mini">
              <el-option v-for="item in TableStatusOption" :key="item.value" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上期水量：" prop="priorPeriodWater">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.priorPeriodWater" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="上期抄码：" prop="priorPeriodNum">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.priorPeriodNum" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="本期抄码：" class="Thickening" prop="currendPeriodNum">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @keyup.enter.native="saveMeterEntry" v-model="formData.currendPeriodNum" @change="currendPeriodNumChange" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="本期水量：" prop="currendPeriodWater">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.currendPeriodWater" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="增减水量：" class="Thickening" prop="addWater">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.addWater" @change="addWaterChange" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="分摊水量：" prop="shareWater">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.shareWater" disabled size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="实际用水量：" prop="realityWater">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.realityWater" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注：" class="Thickening" prop="comments">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.comments" size="mini" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="DataEntry-righ-search_1">
        <el-form :model="formData" class="formBill-Two" ref="form" label-width="120px">
          <el-form-item label="是否换表：">
            <div class="dialogcontent3">
              <span class="inputcontent">{{formData.changeMeterFlag===0?'否':'是'}}</span>
            </div>
          </el-form-item>
          <el-form-item label="旧表止码：">
            <div class="dialogcontent3">
              <span class="inputcontent">{{formData.oldMeterNum}}</span>
            </div>
          </el-form-item>
          <el-form-item label="余量：">
            <div class="dialogcontent3">
              <span class="inputcontent">{{formData.margin}}</span>
            </div>
          </el-form-item>
          <el-form-item label="新表起码：">
            <div class="dialogcontent3">
              <span class="inputcontent">{{formData.newMeterNum}}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="DataEntry-button">
        <el-upload class="upload-file" multiple action="/" :http-request="uploadAttachment">
          <el-button size="mini" type="primary">上传附件</el-button>
        </el-upload>
        <el-button size="mini" v-preventReClick @click="saveMeterEntry" type="primary">保存</el-button>
        <el-button size="mini" v-preventReClick v-if="formData.statusName === '正常' " @click="deleteData(formData)" type="danger">删除</el-button>
      </div>
    </div>

    <div class="DataEntry-left">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="账期：">
            <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
          </el-form-item>

          <el-form-item label="册本号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" clearable placeholder="册本号" class="input-bookNo"></el-input>
          </el-form-item>

          <el-form-item label="是否抄表：">
            <el-select v-model="tableQuery.readingStatus" clearable size="mini">
              <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <!--el-form-item label="用户编号：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo"></el-input>
            </el-form-item-->

          <el-form-item label="异常类型：">
            <el-select v-model="tableQuery.abnormalStatus" size="mini" clearable>
              <el-option v-for="item in dictionaryData.WEP" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.comments" clearable @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
          <el-form-item label="" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="type" placeholder="请输入用户编号" clearable @keydown.enter.native="location"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" class="searchBtn" @click="location">定位</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table border highlight-current-row v-if="tableShow" :max-height="maxHeight" :row-class-name="rowClassName" @row-click="handleRowChange" :data="tableData.list" class="change-tables-table" ref="klTableData" :cell-style="cellStyle" @sort-change='getSort'>
          <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed="left"></el-table-column>

          <el-table-column prop="statusName" min-width="80" label="抄表状态" fixed="left">
            <template slot-scope="scope">
              <p v-if="scope.row.statusName === '正常'" style="color: rgb(28, 184, 96)">{{scope.row.statusName}}</p>
              <p v-else style="color: red;">{{scope.row.statusName}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="userNo" min-width="130" label="用户编号" fixed="left"></el-table-column>

          <el-table-column prop="ctmName" min-width="230" label="客户名称" fixed="left" show-overflow-tooltip></el-table-column>

          <el-table-column prop="useWaterType" min-width="180" label="用水类型" show-overflow-tooltip></el-table-column>

          <el-table-column prop="priorPeriodNum" min-width="80" label="上期抄码" align="right"></el-table-column>

          <el-table-column prop="currendPeriodNum" min-width="120" label="本期抄码" align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>

          <el-table-column prop="currendPeriodWater" min-width="120" label="本期水量" align="right" :sort-orders="['descending','ascending',null]" :sortable="'custom'"></el-table-column>

          <el-table-column prop="addWater" min-width="80" label="增减水量" align="right"></el-table-column>

          <el-table-column prop="shareWater" min-width="80" label="分摊水量" align="right"></el-table-column>

          <el-table-column prop="realityWater" min-width="120" label="实际用水量" align="right" show-overflow-tooltip></el-table-column>
          <el-table-column prop="setupMeterAddr" min-width="250" label="装表地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期" show-overflow-tooltip></el-table-column>

          <el-table-column prop="priorPeriodWater" min-width="100" label="上期水量" align="right" show-overflow-tooltip></el-table-column>

          <el-table-column prop="priorPeriodDate" min-width="100" label="上期抄表日" show-overflow-tooltip></el-table-column>

          <el-table-column prop="newMeterNum" min-width="100" label="新表起码" align="right" show-overflow-tooltip></el-table-column>

          <el-table-column prop="oldMeterNum" min-width="100" label="旧表底码" align="right" show-overflow-tooltip></el-table-column>

          <el-table-column prop="linkRelativeRatio" min-width="100" label="环比" align="right" show-overflow-tooltip></el-table-column>

          <el-table-column prop="ringRatio" min-width="100" label="环比率" align="right" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.ringRatio}}%</template>
          </el-table-column>

          <el-table-column prop="threePeriodAvgWater" min-width="100" label="三期均量" align="right" show-overflow-tooltip></el-table-column>

          <el-table-column prop="meterType" min-width="100" label="水表分类"></el-table-column>

          <el-table-column prop="setupMeterAddr" min-width="100" label="装表地址" show-overflow-tooltip></el-table-column>

          <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip></el-table-column>

          <el-table-column prop="changeMeterFlag" min-width="100" label="是否换表" :formatter="changeMFgformatter" show-overflow-tooltip></el-table-column>

          <el-table-column prop="margin" min-width="100" label="余量" align="right" show-overflow-tooltip></el-table-column>

          <el-table-column prop="createName" min-width="100" label="录单员" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" fixed="right" width="80px">
            <template slot-scope="scope">
              <el-button type="text" @click="viewAttachment(scope.row)" style="font-size:12px;">查看附件</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[100, 200, 300]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <el-dialog title="查看附件" :visible.sync="viewAttachmentShow" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <attachment-view-info v-if="viewAttachmentShow" :receiptAccessory="receiptAccessory" busicode="ReceiptAccessoryList"></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
import { VueDebounce } from "@/assets/js/debounce.js";
export default {
  name: "MeterReadingDataEntry",
  props: ["booksVal"],
  components: {
    AttachmentViewInfo
  },
  data () {
    return {
      isActive: false, //控制高级查询内容的显示
      tableData: [],
      // 存储当前查询的列表数据（不能变动）
      constTableData: [],
      formDataIndex: 0,//修改表单索引号
      formData: {
        row: "",
        id: "",
        ctmName: "", //客户名称
        userNo: "", //用户编号
        setupMeterAddr: "", //装表地址
        useWaterType: "", //用水类型
        priorPeriodDate: 0, //上期抄表日

        meterReadingDate: "", //抄表日期
        status: 0, //抄表状态ID
        statusName: "", //抄表状态名称
        priorPeriodNum: 0, //上期抄码
        currendPeriodNum: 0, //本期抄码
        addWater: 0, //增减水量
        shareWater: 0, //分摊水量
        realityWater: 0, //实际用水量
        currendPeriodWater: 0, //本期水量
        comments: "", //备注

        changeMeterFlag: 0, //是否换表
        oldMeterNum: 0, //旧表止码
        margin: 0, //余量
        newMeterNum: 0, //新表起码

        priorPeriodWater: 0, //上期水量
        linkRelativeRatio: 0, //环比
        ringRatio: 0, //环比率
        threePeriodAvgWater: 0, //三期均量
        meterType: "" //水表分类
      },
      tableQuery: {
        //查询表单数据
        page: 1,
        pageCount: 100,
        accountPeriod: "202004", //账期
        bookNo: "", //册本号
        userNo: "", //用户编号
        meterReadingStaff: "", //抄表员
        readingStatus: 0, //抄表状态
        abnormalStatus: "", //异常状态
        comments: '',
        // sortFlag: '',
        sortField: '',
        sortOrder: '',
      },
      type: '',
      // 记录表格高度
      tableRowHeight: 0,
      //数据字典
      dictionaryData: [],
      //抄表员
      meterReaderList: [],
      //是否抄表
      statusOption: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "未抄"
        },
        {
          value: 1,
          label: "已抄"
        }
      ],
      // 抄表状态下拉框
      TableStatusOption: [],
      //数据字典
      dictionaryData: [],
      maxHeight: 0,
      tableShow: false,
      enterMeterDataShow: false,
      enterMeterDate: "",
      fileList: [],
      // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      receiptAccessory: {},
      attachmentData: [],
    };
  },
  mounted () {
    this.tableQuery.accountPeriod = this.booksVal.accountPeriod;
    this.tableQuery.bookNo = this.booksVal.bookNo;
    this.tableQuery.userNo = this.booksVal.userNo;
    this.tableQuery.readingStatus = this.booksVal.readingStatus;
    //抄表状态
    this.getMeterStatusOption();
    //数据字典接口
    this.getDictionary();
    //初始化接口

    this.init();

    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".DataEntry-left", [
        ".DataEntry-left .toolbar",
        ".DataEntry-left .block"
      ]);
    });
  },
  methods: {
    search () {
      this.tableQuery.page = 1
      this.init()
    },
    //初始化
    init () {
      let _this = this;
      let params = {
        busicode: "MrRecordList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
          // _this.constTableData = JSON.parse(JSON.stringify(res.list))
          var data = {};
          if (this.booksVal.index) {
            data = JSON.parse(
              JSON.stringify(_this.tableData.list[booksVal.index])
            );
          } else {
            data = JSON.parse(JSON.stringify(_this.tableData.list[0]));
          }
          this.formDataIndex = 0
          _this.formData = data;
          this.common.changeTable(this, ".DataEntry-left", [
            ".DataEntry-left .toolbar",
            ".DataEntry-left .block"
          ]);
          this.$nextTick(() => {
            let tableRowHeight = $(".kl-table .el-table__body-wrapper .el-table__body .el-table__row").children(":last").height()
            console.log(tableRowHeight);
            this.tableRowHeight = tableRowHeight
            this.$refs.klTableData.doLayout();
            this.$refs.klTableData.setCurrentRow(this.tableData.list[0]);
          })
        });
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
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".DataEntry-left", [
          ".DataEntry-left .toolbar",
          ".DataEntry-left .block"
        ]);
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
    //抄表状态下拉框
    getMeterStatusOption () {
      let _this = this;
      let params = {
        busicode: "MeterStatusSelect",
        data: {
          abnormalFlag: "0"
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.TableStatusOption = res;
        });
    },
    //上传附件
    uploadAttachment (file, fileList) {
      let _this = this;
      /** const isJPG = file.file.type === 'image/jpg';
      const isPNG = file.file.type === 'image/png';
       const isLt10M = file.file.size / 1024 / 1024 < 10;
      if (!isJPG&&!isPNG) {
        this.$message.error('上传图片的格式只能是 JPG或PNG 格式!');
        return
      }
      if (!isLt10M) {
        this.$message.error('上传图片的大小不能超过 10M!');
        return
      } **/
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: this.formData.id,
          receiptType: "MR_INFO",
          accessoryNo: "000",
          file: file.file,
          userNo: this.formData.userNo,
          ctmNo: this.formData.ctmNo
        },
        //token: "krrjdev123", //
        sysType: "002"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });
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
    statusChange (val) {
      if (val == "0") {
        //正常
      } else if (val == "3") {
        //过圈
      }
    },
    changeMFgformatter (row, column, cellValue, index) {
      return row.changeMeterFlag === 0 ? "否" : "是";
    },
    //当改变 本期抄码时 数据变化
    currendPeriodNumChange (val) {
      if (this.formData.changeMeterFlag === 0) {
        this.formData.currendPeriodWater = Number(val) - this.formData.priorPeriodNum;
        this.formData.realityWater = this.formData.currendPeriodWater + this.formData.addWater + this.formData.shareWater;
      } else {
        //换表计算公式
        this.formData.currendPeriodWater = this.formData.margin + (Number(val) - this.formData.newMeterNum);
        this.formData.realityWater = this.formData.currendPeriodWater + this.formData.addWater + this.formData.shareWater;
      }
    },
    //当改变 增减水量时 数据变化
    addWaterChange (val) {
      this.formData.realityWater =
        this.formData.currendPeriodWater +
        Number(val) +
        this.formData.shareWater;
    },
    rowClassName ({ row, rowIndex }) {
      row.index = rowIndex; 
    },
    handleRowChange (row, column, event) {
      var data = JSON.parse(JSON.stringify(row));
      this.formDataIndex = row.index
      this.formData = data;
    },
    //保存方法
    saveMeterEntry: VueDebounce("getSaveData"),//引入防抖函数
    getSaveData () {
      var data = [];
      data[0] = {
        accountPeriod: this.tableData.list.length && this.tableData.list[0].accountPeriod, //账期
        id: this.formData.id, //
        userNo: this.formData.userNo, //用户编号
        meterReadingDate: this.formData.meterReadingDate, //抄表日期
        status: this.formData.status, //抄表状态ID
        currendPeriodNum: this.formData.currendPeriodNum, //本期抄码
        addWater: this.formData.addWater, //增减水量
        comments: this.formData.comments, //备注
        meterReadFlag:1
      };
      var params = {
        busicode: "MrRecordSave",
        data: data
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message: "表单保存成功",
            type: "success"
          });
          //初始化表单
          this.getSheetData()
        });
    },
    //初始化
    getSheetData () {
      let params = {
        busicode: "MrRecordList",
        data: {
          //查询表单数据
          page: 1,
          pageCount: this.tableQuery.pageCount,
          accountPeriod: this.tableQuery.accountPeriod, //账期
          bookNo: this.tableQuery.bookNo, //册本号
          userNo: this.formData.userNo, //用户编号
          meterReadingStaff: "", //抄表员
          readingStatus: 1, //抄表状态
          abnormalStatus: "" //异常状态
        },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          // 给已修改好的行赋值
          this.tableData.list[Number(this.formDataIndex)] = JSON.parse(JSON.stringify(res.list[0]))
          //高亮下一行
          if (this.tableData.list.length - 1 == this.formDataIndex) {
            // this.$message({
            //   message: '这是最后一条可修改数据了噢！',
            //   type: 'warning'
            // });
            if (this.tableData.total - 1 == (this.tableQuery.page - 1) * this.tableQuery.pageCount + this.formDataIndex) {
              this.$message({
                message: '这是最后一条可修改数据了噢！',
                type: 'warning'
              });
              return
            }
            this.handleCurrentChange(this.tableQuery.page + 1)
            this.formDataIndex = 0
          } else {
            this.formDataIndex = Number(this.formDataIndex + 1)
          }
          this.$refs.klTableData.setCurrentRow(this.tableData.list[Number(this.formDataIndex)]);
          this.$refs.klTableData.bodyWrapper.scrollTop = (this.tableRowHeight + 1) * (this.formDataIndex);
          // 给表单赋值下一行数据
          this.formData = JSON.parse(JSON.stringify(this.tableData.list[Number(this.formDataIndex)]))
        });
    },
    // 排序
    getSort (column) {
      //   if (sort.order === 'descending') {
      //     this.tableQuery.sortFlag = sort.prop + ' DESC';
      //   } else if (sort.order === 'ascending') {
      //     this.tableQuery.sortFlag = sort.prop + ' ASC';
      //   } else {
      //     this.tableQuery.sortFlag = '';
      //   }
      this.tableQuery.sortField = column.prop
      if (column.order === 'ascending') {
        this.tableQuery.sortOrder = 1
      } else if (column.order === 'descending') {
        this.tableQuery.sortOrder = 2
      } else {
        this.tableQuery.sortOrder = ''
        this.tableQuery.sortField = ''
      }
      this.init();
    },
    deleteData (formData) {
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let params = {
            busicode: "MrOpenAccountInvalid",
            data: [formData]
          };
          this.$api
            .fetch({
              params //参数
            })
            .then(res => {
              this.$message({
                message: "作废成功！",
                type: "success"
              });
              this.init();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废"
          });
        });
    },
    // 查看附件按钮
    viewAttachment (row) {
      this.receiptAccessory = {
        receiptType: "MR_INFO",
        receiptId: row.id
      }
      this.$nextTick(() => {
        this.viewAttachmentShow = true;
      })
    },
    closeAttachDialog () {
      this.viewAttachmentShow = false;
    },
    //定位
    location () {
      let _this = this
      let index = -1;
      var reg = new RegExp(' ', "g")
      var reg2 = new RegExp('\\t', "g")
      this.type = this.type.replace(reg, '');
      this.type = this.type.replace(reg2, '');
      let dataQuery = {
        queryBean: this.tableQuery,
        userNo: this.type
      }
      let params = {
        busicode: "MrRecordListByUserNo",
        data: dataQuery,
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
          this.tableQuery.page = res.pageNum
          _this.constTableData = JSON.parse(JSON.stringify(res.list))
          // var data = {};
          // if (this.booksVal.index) {
          //   data = JSON.parse(
          //     JSON.stringify(_this.tableData.list[booksVal.index])
          //   );
          // } else {
          //   data = JSON.parse(JSON.stringify(_this.tableData.list[0]));
          // }
          // this.formDataIndex = 0
          // _this.formData = data;
          this.common.changeTable(this, ".DataEntry-left", [
            ".DataEntry-left .toolbar",
            ".DataEntry-left .block"
          ]);
          this.$nextTick(() => {
            let tableRowHeight = $(".kl-table .el-table__body-wrapper .el-table__body .el-table__row").children(":last").height()
            this.tableRowHeight = tableRowHeight
          })
          if (this.type.length > 0) { // 用户编号
            this.constTableData.forEach((item, i) => {
              if (this.type == item.userNo) {
                index = i
                _this.$refs.klTableData.setCurrentRow(this.tableData.list[Number(i)]);
              }
            })
          }
          this.formDataIndex = index
          this.formData = this.tableData.list[Number(index)]
          console.log(index);
          if (index != -1) {
            this.$refs.klTableData.bodyWrapper.scrollTop = (this.tableRowHeight + 1) * (index);
          }
        });
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (row.statusName === '正常') {
        return 'background-color:#ecf5ff';
      } else {
        return ''
      }
    },
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    formData:{
        handler(newVal, oldVal){
            // 上期抄码计算
            let m=this.formData.priorPeriodNum.toString().split('')
            let num=9 //过圈值
            for(let i=0;i<m.length-1;i++){
              num=num*10+9
            }
            console.log(num);
            console.log(m.length);
            console.log(this.formData.status);
            if(this.formData.status==3){
              this.formData.currendPeriodWater=num-this.formData.priorPeriodNum+this.formData.currendPeriodNum
            }
        },
        deep: true
    }
    // tableData: function() {
    //   this.$nextTick(function() {
    //     this.$refs.klTableData.setCurrentRow(this.tableData.list[0]);
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.MeterReadingDataEntry {
  height: calc(100% - 41px);
  display: flex;
  .el-upload-list {
    display: none;
  }
  // //行变色
  // .change-tables-table {
  //   .el-table__body {
  //     tr {
  //       td:nth-child(3) {
  //         div {
  //           color: #3195f4;
  //           cursor: pointer;
  //         }
  //       }
  //     }
  //   }
  // }
  .DataEntry-right {
    width: 27%;
    border-right: 1.5px solid rgb(234, 244, 255);
    height: 100%;
    overflow-y: auto;
    .DataEntry-right-detail {
      padding: 10px 20px;
      border-bottom: 1.5px solid #eaf4ff;
      height: 145px;

      .my-input-detail {
        height: 22px;
        width: 100%;
        float: left;
        margin-bottom: 5px;
      }
      .label-detail {
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #606266;
        line-height: 20px;
        padding: 0 10px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100px;
      }
      .dialogcontent-detail {
        text-align: left;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #121315;
        line-height: 20px;
        padding: 0 10px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin-left: 5px;
        width: calc(100% - 110px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .dialogcontent-userno-detail {
        text-align: left;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #121315;
        line-height: 20px;
        padding: 0 10px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin-left: 5px;
        width: calc(100% - 64%);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .DataEntry-righ-search {
      border-bottom: 1.5px solid #eaf4ff;
      padding: 0px 20px 5px;
    }
    .DataEntry-button {
      padding: 10px 0px;
      text-align: center;
      .upload-file {
        display: inline-block;
      }
    }
    .DataEntry-righ-search_1 {
      padding: 5px 0px;
      height: 60px;
    }
  }
  .DataEntry-left {
    width: 73%;
  }
  .dialogcontent3 {
    width: 40%;
    display: inline-block;
  }
  .dialogcontent3 .inputcontent {
    width: 100%;
    display: inline-block;
  }
  /deep/ .input-bookNo .el-input__inner {
    width: 150px !important;
  }
  // 鼠标悬停样式
  /deep/ .el-table__body .el-table__row.hover-row td {
    background-color: #b9d9dca8 !important;
  }
  // 固定列样式
  /deep/ .el-table__body tr.current-row > td {
    background-color: #b9d9dca8 !important;
  }
}
</style>

