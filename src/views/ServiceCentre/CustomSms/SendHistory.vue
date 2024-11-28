<template>
  <div class="SendHistory">
    <div class="SendHistoryIndex">
      <div class="toolbar" style="outline: none" tabindex="0">
        <el-form
          :inline="true"
          size="mini"
          :model="tableQuery"
          class="demo-form-inline"
        >
        <el-form-item label="发送时间：">
            <el-date-picker
              v-model="sendTime"
              @change="getDatePicker"
              type="daterange"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="模糊查询：" class="width-200">
            <el-input
              oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              clearable
              v-model="tableQuery.fuzzyQuery"
              placeholder="用户编号/客户名称/客户地址/发送手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="发送内容：" class="width-200">
            <el-input
              oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              clearable
              v-model="tableQuery.content"
              placeholder="请输入发送内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="发送状态：">
            <el-select
              ref="select1"
              v-model="tableQuery.state"
              placeholder="发送状态"
              clearable
              size="mini"
            >
              <el-option
                v-for="item in dictionaryData.SMS"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="button-group">
            <el-button
              class="searchBtn"
              @click="search"
              icon="el-icon-search"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{ height: maxHeight + 'px' }">
        <el-table
          highlight-current-row
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          :data="tableData.list"
          class="DetailedEnquiries-table"
          @sort-change="sortChange"
        >
          <el-table-column
            type="index"
            label="NO."
            width="50"
            fixed="left"
            :index="indexMethod"
          >
          </el-table-column>

          <el-table-column prop="stateName" min-width="120" label="发送状态">
          </el-table-column>

          <el-table-column prop="sendDate" min-width="150" label="发送时间" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column
            prop="areaName"
            min-width="120"
            label="通知人"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="userNo" min-width="120" label="用户编号">
          </el-table-column>

          <el-table-column prop="mobile" min-width="120" label="发送手机号">
          </el-table-column>

          <el-table-column prop="ctmName" min-width="120" label="客户名称">
          </el-table-column>

          <el-table-column
            prop="noticeContent"
            min-width="100"
            label="短信内容"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableQuery.page"
          :page-sizes="[20, 100, 500, 1000]"
          :page-size="tableQuery.pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SendHistory",
  data() {
    return {
      sendTime: ["", ""],
      //查询条件对象
      tableQuery: {
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginSendDate: "",
        endSendDate: "",
        state: "",
        fuzzyQuery: "",
        readerAccount:'',
        noticeType: "",
        noticeWay: "17",
        createUser: '',
        sortField: "sendDate", //排序字段
        sortOrder: '', //排序顺序，1升序2倒序\
        content: '',
      },
      // 表格数据
      tableData: {},
      dictionaryData: [],
      formData: {},

      // 日期选择器
      pickerOptions: {
        onPick: ({ minDate, maxDate }) => {
          this.selectedDate = minDate
        },
        disabledDate: (time) => {
          // if(this.selectedDate) {
          //   return time.getMonth() !== this.selectedDate.getMonth() || time.getTime() > Date.now()
          // }
          return time.getTime() > Date.now();
        }
      },
      selectedDate: null,
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
    };
  },
  mounted() {
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    const day = date.getDate()
    this.tableQuery.beginSendDate = `${year}-${month}-01 00:00:00`
    this.tableQuery.endSendDate = `${year}-${month}-${day} 23:59:59`
    this.sendTime = [`${year}-${month}-01`, `${year}-${month}-${day}`]
    this.getDictionary();
    this.init();
    //this.getReplaceStaffData()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".SendHistoryIndex", [
      ".SendHistoryIndex .toolbar",
      ".SendHistoryIndex .block",
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this;
      let params = {
        busicode: "MessageList",
        data: _this.tableQuery,
      };
      this.$api
        .fetch({
          params: params, //参数
        })
        .then((res) => {
          _this.tableData = res;
        });
    },
    // 搜索
    search() {
      if (this.tableQuery.Time !== undefined) {
        this.tableQuery.beginDate = this.tableQuery.Time[0];
        this.tableQuery.endDate = this.tableQuery.Time[1];
        delete this.tableQuery.Time;
      }
      console.log(this.tableQuery);
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker (date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginSendDate = date[0] + ' 00:00:00'
        this.tableQuery.endSendDate = date[1] + ' 23:59:59'
      } else {
        this.tableQuery.beginSendDate = ''
        this.tableQuery.endSendDate = ''
        this.selectedDate = null
      }
    },
    // 数据字典数据获取
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "SMS,SMC,SMT"
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.pageCount - 20) * this.tableQuery.page + (index + 1)
      );
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
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.SendHistory {
  width: 100%;
  height: 100%;
  .SendHistoryIndex {
    height: calc(100% - 40px);
  }
}
</style>