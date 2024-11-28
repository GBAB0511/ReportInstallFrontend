<template>
  <div class="NotificationDetails">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div>
    </div>

    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor" label-width="80px">
        <el-form-item label='通知日期：' class="width-330">
          <el-date-picker v-model="sendTime" @change="getDatePicker" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="通知状态：">
          <el-select ref="select1" clearable v-model="tableQuery.state" placeholder="通知状态">
            <el-option v-for="item in dictionaryData.SMS" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知人：" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.createUser" placeholder="通知人"></el-input>
        </el-form-item>
        <el-form-item label="模糊查询：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="用户编号/手机号码" @keydown.enter.native="demand"></el-input>
        </el-form-item>
        <el-form-item class="button-group">
          <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
        <!-- 高级查询内容 -->
        <div v-if="isActive" class="advancedQuery">
          <el-form-item label="通知渠道：">
            <!-- <el-select clearable v-model="tableData.noticeWay" placeholder="全部">
              <el-option v-for="(item,index) in formData.noticeChannelOptions" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select> -->
            <el-select ref="select2" clearable v-model="tableQuery.noticeType" placeholder="通知渠道">
              <el-option v-for="item in dictionaryData.SMC" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="短信类型：">
            <el-select ref="select3" clearable v-model="tableQuery.noticeWay" placeholder="全部"> 
              <el-option v-for="item in dictionaryData.SMT" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="营业区域：" class="item">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" @change="changeBusinessArea" class="shouldWater" :props="props">
            </el-cascader>
          </el-form-item> -->

          <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" @change="changeBusinessArea" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>

                <el-form-item label="抄表员：">
            <el-select  v-model="tableQuery.readerAccount" placeholder="请选择" clearable  @keydown.enter.native="search" @change="changeMeterReadingStaff">

                   <el-option-group
                  v-for="group in staffList"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userAccount"
                    :label="item.userName"
                    :value="item.userAccount">
                  </el-option>
                </el-option-group>
            </el-select>
        </el-form-item>


                <el-form-item label="册本号：">
            <el-select v-model="tableQuery.bookNos" clearable size="mini" multiple  placeholder="请选择" filterable>
                  <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span>
                <el-option-group
                  v-for="group in bookNos"
                  :key="group.index"
                  :label="group.areaStaffName">
                  <el-option
                    v-for="item in group.baseBookListVOList"
                    :key="item.index"
                    :label="item.bookNo"
                    :value="item.bookNo">
                    <span style="float: left">{{ item.bookNo }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
                  </el-option>
                </el-option-group>
        </el-select>
        </el-form-item>

          <!-- <el-form-item label="册本号：" class="searchInput">
            <el-select v-model="tableQuery.bookNo" multiple placeholder="请选择" filterable class="shouldWater" clearable>
              <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span>
              <el-option-group v-for="group in bookNos" :key="group.index" :label="group.areaStaffName">
                <el-option v-for="item in group.baseBookListVOList" :key="item.index" :label="item.bookNo" :value="item.bookNo">
                  <span style="float: left">{{ item.bookNo }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item> -->

        </div>
        <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" @sort-change="sortChange">

        <!--el-table-column type="selection" width="50" fixed="left">
        </el-table-column-->

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="noticeTypeName" min-width="80" label="通知渠道">
        </el-table-column>

        <el-table-column prop="noticeWayName" min-width="80" label="短信类型">
        </el-table-column>

        <el-table-column prop="businessArea" min-width="100" label="营业区域">
        </el-table-column>

        <el-table-column prop="bookNo" min-width="100" label="册本号">
        </el-table-column>
         <el-table-column prop="reader" min-width="100" label="抄表员">
        </el-table-column>

        <el-table-column prop="userNo" min-width="100" label="用户编号">
        </el-table-column>

        <el-table-column prop="userName" min-width="100" label="用户名称">
        </el-table-column>

        <el-table-column prop="mobile" min-width="100" label="手机号码">
        </el-table-column>

        <el-table-column prop="noticeContent" min-width="250" label="短信内容" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="areaName" min-width="80" label="通知人">
        </el-table-column>

        <el-table-column prop="sendDate" min-width="100" label="通知日期" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
        </el-table-column>

        <el-table-column prop="stateName" min-width="80" label="通知状态">
        </el-table-column>

        <!-- <el-table-column prop="daytime" min-width="80" label="备注">
        </el-table-column> -->

      </el-table>

    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import MassageDetailsEdit from "./MassageDetailsEdit";

export default {
  name: "NotificationDetails",
  components: {
    MassageDetailsEdit
  },
  data () {
    return {
      isActive: false, //控制高级查询内容的显示
      EditVisible: false, //弹出表单
      activeName: "ShortMessageSending",
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户通知" }, { title: "消息查询" }]
      },
      formData: {

      },
        // 抄表员下拉选择数据
      staffList: [],
      sendTime: ["", ""],
      tableQuery: {
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginSendDate: "",
        endSendDate: "",
        state: "",
        fuzzyQuery: "",
        readerAccount:'',
        noticeType: "",
        noticeWay: "",
        createUser: '',
        businessArea: '',//营业区域
        sortField: "sendDate", //排序字段
        sortOrder: '', //排序顺序，1升序2倒序
      },
      props: {
        //树结构格式
        value: "code",
        label: "name",
        checkStrictly: true,
        emitPath: false,
      },
      meterReadStaffList:[],
      bookNos: [],
      showbookNosData: [],
      businessAreaData: [],
      tableData: [],
      dictionaryData: [],
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
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
    };
  },
  mounted () {
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    const day = date.getDate()
    this.tableQuery.beginSendDate = `${year}-${month}-01 00:00:00`
    this.tableQuery.endSendDate = `${year}-${month}-${day} 23:59:59`
    this.sendTime = [`${year}-${month}-01`, `${year}-${month}-${day}`]
    this.getDictionary();
    this.init();
    this.selectBAreaOptions();
    // this.getBooks();

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    /*this.common.changeTable(this, ".ShortMessageNotification .kl-table", [
      ".ShortMessageNotification .toolbar",
      ".ShortMessageNotification .block",
      ".ShortMessageNotification #crumbs"
    ]);*/
    this.common.changeTable(this, ".NotificationDetails", [
      ".NotificationDetails .bread-contain",
      ".NotificationDetails .toolbar",
      ".NotificationDetails .block",
      '.NotificationDetails .toggle-btn'
    ]);
  },
  computed: {

      showbookNos() {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    }
  
  },
  methods: {
        //营业区域
    changeMeterReadingStaff(){
      this.getBooks();
    },
    changeBusinessArea() {
         if (this.tableQuery.businessArea){
        this.getBooks();
      }else {
        this.bookNos = [];
      }

       this.getMeterReader(this.common.handleTreeData(this.tableQuery.businessArea));
    },
            //抄表员下拉框数据
    getMeterReader(businessArea = businessArea || "") {
      let _this = this;
      let params = {
        busicode: "PostUserList",
        data: {
          postNo: "2",
          businessArea:businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.staffList = res;
          this.meterReadStaffList = res.reduce((pre,curr)=>{return pre.concat(curr.userInfos)},[]) //合并下所有抄表员
        });
    },
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
        this.$refs.select3.blur()
      }
    },
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
        this.common.changeTable(this, ".NotificationDetails", [
          ".NotificationDetails .bread-contain",
          ".NotificationDetails .toolbar",
          ".NotificationDetails .block",
          '.NotificationDetails .toggle-btn'
        ]);
      });
    },
    editMassege () {
      this.EditVisible = true;
    },
    init () {
      let _this = this;
      let params = {
        "busicode": "MessageList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData = res
      }).catch(e => {
        console.log(e)
      })
    },
    //   导出
    exportExcel () {
      let params = {
        "busicode": "MessageExport",
        "data": JSON.parse(JSON.stringify(this.tableQuery)),
        token: sessionStorage.getItem('token'),
        // token: 'krrjdev123',
        sysType: '002'
      }
      params.data.page = 1;
      params.data.pageCount = 999999;
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
    demand () {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
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
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);

    },
    add () {
      this.ShortMessagePhraseManagementVisible = true;
    },
    // 获取册本
    getBooks () {
      //   if (this.tableQuery.meterReadingStaffName == null || this.tableQuery.meterReadingStaffName == undefined) {
      // this.tableQuery.meterReadingStaffName = ''
      //   }
      let params = {
        busicode: 'baseAllBooks',
        data: {
          businessArea: this.tableQuery.businessArea,
            meterReadingStaff:this.meterReadStaffList.length?this.meterReadStaffList.find(i=>i.userAccount === this.tableQuery.readerAccount).userName:"" , //通过账号拿出人名
        }
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          //   this.tableQuery.bookNo = '';
          this.bookNos = [...res];
          this.showbookNosData = []
          this.bookNos.forEach(item => {
            item.baseBookListVOList.forEach(child => {
              this.showbookNosData.push(child)
            })
          })
        });
    },


    //营业区域
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
        let data = this.getArr1(res)
        _this.businessAreaData = data.children;
      })
    },

    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
        arr.map(i => {
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
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.NotificationDetails {
  width: calc(100% - 20px);
  height: 100%;
  .kl-table {
    margin-top: 15px;
  }
}
</style>

<style lang="scss">
.NotificationDetails{
.width-330 > .el-form-item__content .el-date-editor{
  width: 330px !important;
}
}
</style>