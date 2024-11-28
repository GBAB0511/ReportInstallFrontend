<template>
  <div class="PlanAdjustment">
    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="营业区域：">
          <el-select ref="select1" v-model="tableQuery.businessArea" clearable size="mini" style="width:100%">
            <el-option v-for="item in businessAreaData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄表员：">
          <el-select ref="select2" v-model="tableQuery.meterReadingStaff" size="mini">
            <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="册本号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" ref="table" @selection-change="getSelectData" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="wuserInfo-table">
        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>
        <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed>
        </el-table-column>
        <el-table-column prop="bookNo" min-width="100" label="册本号" fixed>
        </el-table-column>
        <el-table-column prop="bookName" min-width="100" label="册本名称" fixed>
        </el-table-column>
        <el-table-column prop="meterReadingCycle" min-width="120" label="抄表周期" fixed>
        </el-table-column>
        <el-table-column prop="meterReadingStaffName" min-width="120" label="抄表员" fixed>
        </el-table-column>
        <el-table-column prop="meterReadingDay" min-width="150" label="抄表日">
        </el-table-column>
      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "PlanAdjustment",
  props: ['parentSelectData'],
  components: {},
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "表册管理" },
          { title: "抄表计划" }
        ]
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        bookNo: '',
        businessArea: '',
        meterReadingStaff: '',
      },
      // 列表数据
      tableData: {},
      // 营业所下拉数据
      businessAreaData: [],
      // 勾选数据
      selectData: [],












      meterReaderList: [
       
      ],
      isActive: false, //控制高级查询内容的显示
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
      backfillVisible: false,
      meterReaderWeek: "1",
    };
  },
  mounted() {
    this.init();
    this.getBusinessAreaData()
    this.getReadingStaff()

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".PlanAdjustment", [
      ".PlanAdjustment .toolbar",
      ".PlanAdjustment .block",
      ".PlanAdjustment bread-contain"
    ]);
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
         }
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
    // 列表初始化
    init() {
      let _this = this
      let params = {
        "busicode": "MrPlanList",
        "data": this.tableQuery,
      }

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.tableData = res
        setTimeout(() => {
          for (let i = 0; i < _this.tableData.list.length; i++) {
            for (let j = 0; j < _this.parentSelectData.length; j++) {
              if (_this.parentSelectData[j].value == _this.tableData.list[i].bookNo) {
                _this.$refs.table.toggleRowSelection(_this.tableData.list[i], true)
              }
            }
          }
        }, 0);
      })
    },

    //营业区域下拉框数据
    getBusinessAreaData() {
      let _this = this
      let params = {
        "busicode": "BusinessAreaSelect",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.businessAreaData = [...[{ id: "", name: "全部" }], ...res];
        console.log(_this.businessAreaData);
      })
    },
    // 表格勾选对象数组
    getSelectData(itemList) {
      this.selectData = []
      itemList.forEach(item => {
        this.selectData.push({
          value: item.bookNo,
          name: item.bookName,
        })
      })
      console.log();
    },
    // 返回勾选数据给父页面（由父页面调用）
    setSelectData() {
      return this.selectData
    },



    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        // $('.el-table--fit').css('height', '66%');
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
        // $('.el-table--fit').css('height', '50%');
      }
    },
    search() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
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
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
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
.PlanAdjustment {
  width: 100%;
  height: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
}
</style>
