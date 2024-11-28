<template>
  <div class="PrivilegeModificationEdit">
    <!-- 按册开账模块 -->
    <el-tabs @tab-click="tabClick" class='tabsBlock' type="border-card">
      
      <el-tab-pane label="按户修改">
        <span slot="label"><i class="el-icon-user"></i> 按户修改</span>
        <SingleUserEdit></SingleUserEdit>
      </el-tab-pane>
      <el-tab-pane label="按册修改">
        <span slot="label"><i class="el-icon-document-remove"></i> 按册修改</span>
        
        <BookEdit></BookEdit>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
import BookEdit from "./BookEdit";
import SingleUserEdit from "./SingleUserEdit";
export default {
  name: "PrivilegeModificationEdit",
  components: {
    SingleUserEdit,
    BookEdit
  },
  data() {
    return {
      isActive: false,
      EditVisible: "tab-1",
      tableData: [
        {
          bookName: "--",
          jihuaNum: "100",
          chaojianNum: "50",
          jihuaKNum: "100",
          kaiZedNum: "60",
          lastPeople: "焦文",
          lastTime: "2019/07/26",
          state: "未开账",
          leveled: "60%"
        }
      ],
      options6: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "未开账"
        },
        {
          value: 2,
          label: "已开账"
        },
        {
          value: 3,
          label: "部分开"
        }
      ],
      options7go: "",
      options7: [
        {
          value: 0,
          label: "每月抄"
        },
        {
          value: 1,
          label: "奇月抄"
        },
        {
          value: 2,
          label: "偶月抄"
        },
        {
          value: 3,
          label: "季度抄"
        }
      ],
      crumbsData: {
        //面包屑
        titleList: [
          // { title: '业务管理', path: '/MeterReadingCenter' },
          { title: "抄表开账" },
          { title: "开账" }
          // { title: '按册开账', method: () => { window.histroy.back() } }
        ]
      },
      isActive: false, //控制高级查询内容的显示
      formData: {
        con: "",
        beginNumber: "全部",
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
      histroyData: {},
      waterAddVisible: false, //综合查询的显示和隐藏
      WaterEditorName: "综合查询",
      ruleFormData: {},
      backfillName: "用户基础资料管理-编辑",
      backfillVisible: false
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".PrivilegeModificationEdit .kl-table", [
      ".PrivilegeModificationEdit .toolbar",
      ".PrivilegeModificationEdit .block",
      ".PrivilegeModificationEdit bread-contain"
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
    tabClick(tab, event) {
      // this.$set(this.crumbsData.titleList,"3",{title:tab.label,method:()=>{window.histroy.back()}});

      if (tab.label == "按册开账") {
        this.EditVisible = true;
      } else {
        this.EditVisible = false;
      }
    },
    demand() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    //   导出
    exportExcel() {
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
    //   查看历史
    viewHistory(index, row) {},
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
    closeDialog() {
      //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterAddVisible = false;
    },
    // 添加
    add() {},
    // 编辑
    edit() {
      this.backfillVisible = true;
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
<style lang="scss">
.PrivilegeModificationEdit {
    width: 100%;    
    height: calc(100% - 41px);
    .tabsBlock {
        height: 100%;
        .el-tabs--border-card {
        border: 1px solid #eaf4ff;
        }
    }
    .el-tabs--border-card>.el-tabs__content {
        padding: 0px;    
        height: calc(100% - 40px);
        overflow-y: auto;
    }
}
</style>
