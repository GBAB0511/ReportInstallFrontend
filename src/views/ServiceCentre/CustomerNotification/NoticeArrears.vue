<template>
  <div class="NoticeArrears">

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

        <el-form-item class="form-left">
            
          <el-form-item label='账期：'>
            <el-date-picker v-model="formData.DateChoosevalue" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="营业所：">
            <el-select clearable v-model="formData.BusinessArea" placeholder="全部">
              <el-option v-for="(item,index) in formData.waterMeterTypeOptions" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="册本号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.book" placeholder="册本号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click.native="hidden" icon="el-icon-arrow-down upchange" class="soce-query">高级查询</el-button>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>

        <el-form-item class="form-right">
          <el-button size="mini" @click="add" type="primary">欠费停用</el-button>
          <el-button @click="exportExcel" size="mini" type="primary">打印</el-button>
          <el-button icon="el-icon-upload2" @click="exportExcel" size="mini" type="primary">导出</el-button>
        </el-form-item>

        <!-- 高级查询内容 -->
        <el-form-item v-show="isActive" class="advancedQuery">

          <el-form-item label="抄表员：">
            <el-select clearable v-model="formData.MeterReader" placeholder="全部">
              <el-option v-for="(item,index) in formData.MeterReaderOption" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用水类型：">
            <el-select clearable v-model="formData.PriceType" placeholder="">
              <el-option v-for="(item,index) in formData.PriceTypeOption" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>

          <el-form-item label="费用名称：">
            <el-select clearable v-model="formData.CostType" placeholder="全部">
              <el-option v-for="(item,index) in formData.CostTypeOption" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>

          <el-form-item label="缴费方式：">
            <el-select clearable v-model="formData.PaymentMethod" placeholder="全部">
              <el-option v-for="(item,index) in formData.PaymentMethodOptions" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>

          <el-form-item label="期数>=：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.waterMeterCaliber" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="欠费>=：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.waterMeterStatus" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="水量>=：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.subordinateDepartments" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="通知状态：">
            <el-select clearable v-model="formData.notificationStatus" placeholder="全部">
              <el-option v-for="(item,index) in formData.notificationStatus" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="searchInput">
            <!--<el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="用户编号/用户名称/用户地址/银行账号"></el-input> -->
            <el-tooltip class="item" effect="dark" content="用户编号、用户名称、用户地址、银行账号" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.inputContent" clearable size="mini"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-form-item>

      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" class="change-tables-table">

        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="book" min-width="100" label="册本号">
        </el-table-column>

        <el-table-column prop="code" min-width="80" label="用户编号">

        </el-table-column>

        <el-table-column prop="areaName" min-width="100" label="用户名称">
        </el-table-column>

        <el-table-column prop="factoryName" min-width="120" label="用户地址">
        </el-table-column>

        <el-table-column prop="fix" min-width="80" label="欠费期数">
        </el-table-column>

        <el-table-column prop="lvalue" min-width="100" label="欠费起始">
        </el-table-column>

        <el-table-column prop="concentrator" min-width="100" label="欠费结束">
        </el-table-column>

        <el-table-column prop="fixValue" min-width="80" label="水量合计">
        </el-table-column>

        <el-table-column prop="fcode" min-width="80" label="金额合计">
        </el-table-column>

        <el-table-column prop="endTime" min-width="80" label="通知状态">
        </el-table-column>

        <el-table-column prop="flux" min-width="100" label="通知时间">
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="85">
          <template slot-scope="scope">

            <el-button type="text" @click.native="edit(scope.$index, scope.row)">预览</el-button>
          </template>
        </el-table-column>

      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
        </el-pagination>
      </div>

  </div>
</template>
<script>
export default {
  name: "ShortMessageNotification",
  data() {
    return {
      activeName: "ShortMessageSending",
      crumbsData: {
        //面包屑
        titleList: [
          { title: "服务中心", path: "/ServiceCentre" },
          {
            title: "客户通知",
            method: () => {
              window.histroy.back();
            }
          }
        ]
      },
      formData: {
        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [
          // {
          //     name:"全部",
          //     value:"1"
          // },
          {
            name: "现金",
            value: "2"
          },
          {
            name: "代扣",
            value: "3"
          },
          {
            name: "托收",
            value: "4"
          },
          {
            name: "预存",
            value: "5"
          }
        ],
        waterMeterManufacturer: "",
        waterMeterManufacturerOptions: [
          // {
          //     name:"全部",
          //     value:"1"
          // },
          {
            name: "每月抄",
            value: "2"
          },
          {
            name: "奇月抄",
            value: "3"
          },
          {
            name: "偶月抄",
            value: "4"
          },
          {
            name: "三月抄",
            value: "5"
          }
        ],
        waterMeterType: "",
        waterMeterTypeOptions: [
          {
            name: "城区",
            value: "1"
          },
          {
            name: "农村",
            value: "2"
          }
        ],

        notificationStatus: [
          {
            name: "全部",
            value: "1"
          },
          {
            name: "未通知",
            value: "2"
          },
          {
            name: "已打印通知",
            value: "3"
          },
          {
            name: "已短信通知",
            value: "4"
          },
          {
            name: "已微信通知",
            value: "5"
          }
        ],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: [],
        CostType: "",
        CostTypeOption: [
          {
            name: "全部",
            value: "1"
          },
          {
            name: "水费",
            value: "2"
          },
          {
            name: "垃圾费",
            value: "5"
          },
          {
            name: "园区污水费",
            value: "3"
          },
          {
            name: "维修费",
            value: "6"
          }
        ],
        PaymentMethod: "",
        PaymentMethodOptions: [
          {
            name: "全部",
            value: "1"
          },
          {
            name: "现金",
            value: "2"
          },
          {
            name: "代扣",
            value: "3"
          },
          {
            name: "托收",
            value: "4"
          },
          {
            name: "预存",
            value: "5"
          }
        ],
        MeterReader: "",
        MeterReaderOption: [
          {
            name: "管理员",
            value: "5"
          }
        ],
        PriceType: "",
        PriceTypeOption: [],
        MeterReadingPeriod: "",
        MeterReadingPeriodOptions: [
          {
            name: "一月",
            value: "1"
          },
          {
            name: "三月",
            value: "2"
          },
          {
            name: "偶月",
            value: "3"
          }
        ],
        BusinessArea: "",
        BusinessAreaOptions: [
          {
            name: "营业部",
            value: "2"
          }
        ],
        book: "",
        bankCount: "",
        num: "",
        num1: ""
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
      histroyData: {},
      rules: {
        watermeterWarehouse: [
          { required: true, message: "请选择短语", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请输入用户编号", trigger: "blur" }]
      },
      isActive: false //控制高级查询内容的显示
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".ShortMessageNotification .kl-table", [
      ".ShortMessageNotification .toolbar",
      ".ShortMessageNotification .block",
      ".ShortMessageNotification #crumbs"
    ]);
  },
  methods: {
    init() {
      this.histroyData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            book: "001",
            areaId: 4,
            areaName: "袁正林",
            code: "2000030",
            concentrator: "201807",
            connect: "11.40",
            daytime: "13852399576",
            endTime: "已通知",
            factoryName: "雨露村",
            fcode: "0.80",
            fix: 2,
            fixValue: "24",
            flux: "20180603",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            book: "001",
            areaId: 4,
            areaName: "袁超",
            code: "2000030",
            concentrator: "201807",
            connect: "11.40",
            daytime: "13852399576",
            endTime: "已通知",
            factoryName: "雨露村",
            fcode: "0.80",
            fix: 1,
            fixValue: "24",
            flux: "20180603",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5
      };
      this.ArrearsDetails = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
            sub: "",
            Total: ""
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
            sub: "",
            Total: ""
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            areaId: null,
            areaName: "",
            code: "",
            concentrator: "",
            connect: null,
            daytime: "",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "合计：",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "笔数：",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
            sub: "3",
            Total: "17.7"
          }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5
      };
    },
    handleClick(tab, event) {
      this.histroyData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null
          }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5
      };
    },
    demand() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
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
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (
        (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1)
      );
    },
    edit() {},

    add() {
      this.ShortMessagePhraseManagementVisible = true;
    },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        //   $('.el-table--fit').css('height', '66%');
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
        //   $('.el-table--fit').css('height', '50%');
      }
    }
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