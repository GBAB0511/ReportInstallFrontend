<template>
  <!-- 阶梯实收报表 -->
  <div class="MeterReadingOfReadingReport">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <div class="bread-contain-right">
        <!-- <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button> -->
      </div>
    </div>
    <!-- index页面 -->
    <div class="index-page">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="统计方式：" class="width-200">
              <el-select v-model="tableQuery.statics" clearable size="mini">
              <el-option
                v-for="item in dictionaryData.CMT"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            </el-form-item>
        <el-form-item label="账期：">
            <el-date-picker  v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
          </el-form-item>
         <el-form-item label="营业区域：">
              <el-cascader
              clearable
              v-model="tableQuery.businessArea"
              @change="getBusinessArea"
              :options="businessAreaData"
              :show-all-levels="false"
              :props="props"
            >
            </el-cascader>
          </el-form-item>
        <el-form-item label="抄表员：">
            <el-select  v-model="tableQuery.meterReadingStaff" placeholder="请选择" clearable  @keydown.enter.native="search" @change="changeMeterReadingStaff">

                   <el-option-group
                  v-for="group in staffList"
                  :key="group.businessAreaName"
                  :label="group.businessAreaName">
                  <el-option
                    v-for="item in group.userInfos"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userName">
                  </el-option>
                </el-option-group>
            </el-select>
        </el-form-item>
        <el-form-item label="册本：">
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
        <el-form-item label="用水类型：" class="width-200">
            <el-cascader
              ref="cascader-a"
              v-model="tableQuery.useWaterType"
              :options="useWaterTypeOptions"
              :show-all-levels="false"
              clearable
              :props="props">
            </el-cascader>
          </el-form-item>
        <el-form-item label="显示末级：">
          <el-checkbox v-model="tableQuery.isShowEndLevel"></el-checkbox>
        </el-form-item>
        <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border  show-summary :summary-method='getTotal'   :data="tableData.list" class="MeterReadingOfReadingReport-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="staticsName" min-width="100" label="统计方式" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="planReadingCount" min-width="120" label="应抄户数" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="readingCount" min-width="120" label="实抄户数" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="currendPeriodWater" min-width="120" label="实抄水量" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="out5" min-width="120" label="大五方户数" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="outWater5" min-width="120" label="大五方水量" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="on5" min-width="120" label="小五方户数" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="onWater5" min-width="120" label="小五方水量" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="notReadingCount" min-width="120" label="未抄户数" show-overflow-tooltip align="right">
            <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="handleDetail(scope.row)">{{scope.row.notReadingCount}}</span>
             </template>
          </el-table-column>
          <el-table-column prop="openCount" min-width="120" label="已开帐户数" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="openAccountWater" min-width="120" label="已开帐水量" show-overflow-tooltip align="right">
          </el-table-column>
          <!-- <el-table-column prop="openAccountWater" min-width="120" label="已开帐水量" show-overflow-tooltip align="right">
          </el-table-column> -->
          <el-table-column prop="notOpenCount" min-width="120" label="未开帐户数" show-overflow-tooltip align="right">
          </el-table-column>
          <el-table-column prop="notOpenAccountWater" min-width="120" label="未开帐水量" show-overflow-tooltip align="right">
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableQuery.page"
          :page-sizes="[20, 100, 500, 1000]"
          :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"></el-pagination>
        </div>
    </div>

    <el-dialog title="未抄详情" v-if="showDetail" :visible.sync="showDetail" class="common-dialog">
      <MeterNotReadingOfDetail/>
       <!-- <div class="dialog-detail" style="height: 100%;">
         <div class="toolbar">
            <el-form :inline="true" size="mini" :model="dialogTableQuery" class="demo-form-inline" label-width="auto">
              <el-form-item label="册本号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="dialogTableQuery.bookNo" placeholder="请输入册本号" clearable></el-input>
              </el-form-item>

              <el-form-item>
                <el-button class="searchBtn" icon="el-icon-search" @click="dialogSearch">查询</el-button>
              </el-form-item>
               <el-form-item style="float:right">
              <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
              </el-form-item>

            </el-form>
          </div>
              <div class="kl-table">
           <template>

            <el-table highlight-current-row stripe border :data="detailData.list" show-summary :summary-method='getDetailDataTotal'  class="change-tables-table">
              <el-table-column type="index" label="序号" min-width="40" fixed="left" :index="detailIndexMethod"></el-table-column>
              <el-table-column prop="bookNo" min-width="120" label="册本号"></el-table-column>
              <el-table-column prop="userNo" min-width="120" label="用户编号"></el-table-column>
              <el-table-column prop="ctmName" min-width="120" label="客户名称"></el-table-column>
              <el-table-column prop="ctmAddr" min-width="150" label="客户地址"></el-table-column>
              <el-table-column prop="businessArea" min-width="80" label="营业区域" show-overflow-tooltip></el-table-column>
              <el-table-column prop="meterType" min-width="80" label="水表类型"></el-table-column>
              <el-table-column prop="meterBore" min-width="60" label="水表口径"></el-table-column>
              <el-table-column prop="fatoryNo" min-width="80" label="表身码"></el-table-column>
              <el-table-column prop="lastReadingDate" min-width="80" label="上期抄表日"></el-table-column>
              <el-table-column prop="lastReadingNum" min-width="80" label="上期抄码"></el-table-column>
            </el-table>

          <div class="block">
            <el-pagination @size-change="detailHandleSizeChange" @current-change="detailHandleCurrentChange" :current-page="dialogTableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="dialogTableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total"></el-pagination>
          </div>
                  </template>
     </div>

        </div> -->



      </el-dialog>
  </div>
</template>
<script>
import MeterNotReadingOfDetail from '../MeterNotReadingOfDetail'
export default {
  name: "MeterReadingOfReadingReport",
  components: {
    MeterNotReadingOfDetail
  },
  data() {
    return {
       props: {
        //树结构格式
        value: "code",
        label: "name",
        checkStrictly: true,
        emitPath:false
      },
      dialogTableQuery:{
        page: 1,
        pageCount: 20,
        accountPeriod: '',
        businessArea: '',
        meterReadingStaff:'',
        bookNos:[],
        bookNo:'',
        statics:'2',//统计方式
        useWaterType:'',
      },
      showDetail:false,
      businessAreaData: [],
   // 抄表员下拉选择数据
      staffList: [],
      bookNoData:[],
      Time:[],
      // 列表数据
      tableData: {},
      detailData:{},
      dictionaryData:{},
      bookNos:[],
      showbookNosData:[],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: '',
        businessArea: '',
        meterReadingStaff:'',
        bookNos:[],
        statics:'2',//统计方式
        useWaterType:'',
        isShowEndLevel:'',
      },
       useWaterTypeOptions:[],//用水类型下拉框
      waterTypeData:[],
      //面包屑
      crumbsData: {
        titleList: [{ title: "抄表水量报表" }, { title: "抄表统计" }]
      },
      tableShow: false,
      maxHeight: 0,
      row:{},
    };
  },
  mounted() {
    this.selectBAreaOptions();
    this.getMeterReader();
    this.getDictionary();
    this.SelectUseWaterTypeOptions();
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    this.tableQuery.accountPeriod = `${time.getFullYear()}${month}`
    // this.init()
    // this.getWaterType()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".MeterReadingOfReadingReport", [
      ".MeterReadingOfReadingReport .toolbar",
      ".MeterReadingOfReadingReport .block",
      ".MeterReadingOfReadingReport #crumbs"
    ]);
  },
   computed: {
      showbookNos() {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    }
   },
  methods: {
      init(){
        let _this = this
        if(!_this.tableQuery.statics){
            this.$message.error('请输入统计方式进行查询！');
            return
        }
        if(!_this.tableQuery.accountPeriod){
            this.$message.error('请输入账期进行查询！');
            return
        }
        const params = {
            busicode: 'MeterReadingOfReadingReport',
            data: _this.tableQuery
        }
        _this.dialogTableQuery=JSON.parse(JSON.stringify(_this.tableQuery));
        this.$api.fetch({
            params
        }).then(res => {
            this.tableData=res
        })
      },
      // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
      //合计
      getTotal({columns, data}){
        let arr = [];
        columns.forEach((item, index) => {
          if(index == 0){
            arr.push("汇总");
          }else if(item.property === "staticsName"){
            arr.push("");
          }else{
            let sum = 0;
            data.forEach(list => {
              for(const key in list){
                if(key === item.property){
                  sum += Number(list[key]);
                }
              }
            })
            arr.push(sum || "");
          }
        })
        return arr;
      },
      getDetailDataTotal(){

      },
         changeMeterReadingStaff(){
      this.getBooks();
    },
          getBooks(){
        let params ={
          busicode:'baseAllBooks',
          data:{
            businessArea:this.tableQuery.businessArea,
            meterReadingStaff:this.tableQuery.meterReadingStaff,
          }
        };
        this.$api
          .fetch({
            params, //参数
          })
          .then((res) => {
            this.tableQuery.bookNos = []
            this.bookNos = [...res];
            this.showbookNosData = []
            this.bookNos.forEach(item => {
              item.baseBookListVOList.forEach(child => {
                this.showbookNosData.push(child)
              })
            })
          });

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
        });
    },
    handleDetail(row){
        // let _this = this;
        // _this.row=row
        // if(_this.dialogTableQuery.statics==1){
        //     _this.dialogTableQuery.businessArea=row.statics
        // }else if(_this.dialogTableQuery.statics==2){
        //     _this.dialogTableQuery.meterReadingStaff=row.statics
        // }else if(_this.dialogTableQuery.statics==3){
        //     _this.dialogTableQuery.bookNo=row.statics
        // }else if(_this.dialogTableQuery.statics==4){
        //     _this.dialogTableQuery.useWaterType=row.statics
        // }
        // let params = {
        //     busicode: "MeterReadingOfReadingDetailReport",
        //     data: _this.dialogTableQuery,
        // };
        // this.$api
        //     .fetch({
        //     params, //参数
        //     })
        //     .then((res) => {
        //         _this.detailData=res
        //         this.showDetail=true
        //     });



             this.showDetail=true
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
          let data = this.getArr1(res);
          // console.log(data);
          _this.businessAreaData = data.children;
          // console.log(this.businessAreaData);
        });
    },
        // 导出按钮
    exportExcel() {
      var _this = this
      var params = {
        busicode: "MeterReadingOfReadingDetailReportExport",
        data: JSON.parse(JSON.stringify(_this.tableQuery)),
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      // 入参不需要分页
      // delete params.data.page
      // delete params.data.pageCount
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
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
    dialogSearch(){
        this.handleDetail(this.row)
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res.children)
        this.useWaterTypeOptions = data;
      })
    },
    //树结构数据处理
    getArr1(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr1(data[i].children)
        }
      }
      return data
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
    //营业区域
    getBusinessArea() {
         if (this.tableQuery.businessArea){
        this.getBooks();
      }else {
        this.bookNos = [];
      }

       this.getMeterReader(this.common.handleTreeData(this.tableQuery.businessArea));
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params={
        "busicode": "DictionarySelect",
        "data": "CMT" //查询项
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
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
    if(val){
      this.tableQuery.page = val
      this.init()
    }
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
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
.MeterReadingOfReadingReport {
  width: 100%;
  height: 100%;
  .index-page {
    height:calc(100% - 41px);
  }
}
</style>

<style lang="scss">
.MeterReadingOfReadingReport{
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
}
</style>
