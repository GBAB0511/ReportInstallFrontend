<template>
  <div class="DetailedEnquiries">
    
    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item class="form-left">
          <el-form-item label='拆表日期：'>
            <el-date-picker v-model="tableTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="模糊查询：" class="searchInput">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  clearable v-model="tableQuery.fuzzyQuery"  @keydown.enter.native="search" placeholder="用户编号/旧水表编号"></el-input>
          </el-form-item>

          <el-form-item label="拆表员：">
            <el-select ref="select1" v-model="tableQuery.replaceStaff" placeholder="请选择">
                <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
                </el-option>
              </el-select>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>

        <el-form-item class="form-right">
        </el-form-item>
      </el-form>
    </div>
    
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" class="DetailedEnquiries-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="billNo" min-width="120" fixed="left" label="拆表单号">
          </el-table-column>

          <el-table-column prop="replaceDate" min-width="100" fixed="left" label="拆表日期">
          </el-table-column>

          <el-table-column prop="bookNo" min-width="120" label="册本号">
          </el-table-column>

          <el-table-column prop="userNo" min-width="120" label="用户编号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="200" label="客户名称">
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="200" label="客户地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="replaceStaffName" min-width="80" label="拆表员">
          </el-table-column>

          <el-table-column prop="upperNum" min-width="80" label="上期抄码">
          </el-table-column>

          <el-table-column prop="oldMeterNum" min-width="120" label="旧表底码">
          </el-table-column>

          <el-table-column prop="newMeterNum" min-width="120" label="新表起码" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="margin" min-width="100" label="余量" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="oldMeterBore" min-width="100" label="旧水表口径" show-overflow-tooltip>
          </el-table-column>
          
          <el-table-column prop="newMeterBore" min-width="120" label="新水表口径">
          </el-table-column>

          <el-table-column prop="oldMeterNo" min-width="100" label="旧水表编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="newMeterNo" min-width="120" label="新水表编号">
          </el-table-column>

          <el-table-column prop="oldFactoryNo" min-width="150" label="旧水表水表表身号">
          </el-table-column>

          <el-table-column prop="newFactoryNo" min-width="150" label="新水表水表表身号">
          </el-table-column>

          <el-table-column prop="oldMeterCert" min-width="150" label="旧合格证号">
          </el-table-column>

          <el-table-column prop="newMeterCert" min-width="150" label="新合格证号">
          </el-table-column>

          <el-table-column prop="oldHandleWayName" min-width="150" label="旧表处理方式" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip>
          </el-table-column>

        </el-table>
        
      </div>
    
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
          :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" 
          :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" 
          :total="histroyData.total">
          </el-pagination>
        </div>
    
  </div>
</template>
<script>
export default {
  name: "DetailedEnquiries",
  data() {
    return {
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        receiptType: 2,
        processState:'END',
        beginDate:'',
        endDate:''
      },
      tableTime:[],
      // 表格数据
      tableData: {},
      // 拆表员下拉数据
      replaceStaffData: [],




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
    };
  },
  mounted() {
    this.init()
    this.getReplaceStaffData()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".DetailedEnquiries", [
      ".DetailedEnquiries .toolbar",
      ".DetailedEnquiries .block"
    ]);
  },
  methods: {
      enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    // 列表初始化
    init() {
      let _this = this;
      this.getDatePicker(this.tableTime)
      let params = {
        busicode: "MsChgHistory",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.histroyData = res
      })
    },
    
    // 导入按钮方法
    exportExcel() {
      var _this = this
      var params = {
        busicode: "MsChgHistoryExport",
        data: _this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      console.log('http://' + this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
      window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 搜索
    search() {
      if (this.tableQuery.Time !== undefined) {
        this.tableQuery.beginDate = this.tableQuery.Time[0]
        this.tableQuery.endDate = this.tableQuery.Time[1]
        delete this.tableQuery.Time
      }
      console.log(this.tableQuery);
      this.tableQuery.page = 1;
      this.init();
    },
    //拆表员数据获取
    getReplaceStaffData() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "5" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.replaceStaffData = [...[{ userName: "全部" }], ...res];
        });
    },

    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
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
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;

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
.DetailedEnquiries {
  width: 100%;
  height: 100%;
  .formBill-One{
  line-height: 0px;
  
  }
}

</style>