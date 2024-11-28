<template>
  <div class="GroupInfoCopy">
    <!-- 账单打印 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>

      <div class="bread-contain-right">
        <el-button size="mini" @click.native="Print" type="primary">打印本期账单</el-button>
        <el-button size="mini" @click.native="PrintArrea" type="primary">打印历史欠费</el-button>
      </div>
    </div>
    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="账期：">
          <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" format="yyyy-MM" value-format="yyyyMM" placeholder="选择月"></el-date-picker>
        </el-form-item>
             <el-form-item label="营业区域：">
<!--          <el-select v-model="tableQuery.businessArea" clearable size="mini" >-->
<!--            <el-option v-for="item in businessAreaData"  :key="item.value" :label="item.name" :value="item.id"> </el-option>-->
<!--          </el-select>-->
          <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props1" @change="changeBusinessArea"/>
        <el-form-item label="用水类型：">
            <el-cascader
              ref="cascader-a"
              v-model="tableQuery.useWaterType"
              :options="useWaterTypeOptions"
              :show-all-levels="false"
              clearable
              :props="props">
            </el-cascader>
          </el-form-item>
        </el-form-item>
               <el-form-item label="抄表员：">
          <!-- <el-select v-model="tableQuery.meterReader" size="mini" clearable>
           <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
          </el-select> -->
          <el-select v-model="tableQuery.meterReader" placeholder="请选择" @change="changeMeterReadingStaff" class="shouldWater" clearable>
              <el-option-group v-for="group in meterReaderList" :key="group.businessAreaName" :label="group.businessAreaName">
                <el-option v-for="item in group.userInfos" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
                </el-option>
              </el-option-group>
            </el-select>
        </el-form-item>
       <el-form-item label="册本号：">
          <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="册本号" @keydown.enter.native="demand" clearable></el-input> -->
          <el-select v-model="tableQuery.bookNos" multiple placeholder="请选择" filterable class="shouldWater" clearable>
            <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span>
            <el-option-group v-for="group in bookNos" :key="group.index" :label="group.areaStaffName">
              <el-option v-for="item in group.baseBookListVOList" :key="item.index" :label="item.bookNo" :value="item.bookNo">
                <span style="float: left">{{ item.bookNo }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="是否打印：">
            <el-select clearable v-model="tableQuery.printCount" placeholder="">
              <el-option v-for="item in isNot" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="模糊查询：" class="searchInput">
          <el-tooltip class="item" effect="dark" content="用户组编号/用户组名称" placement="top">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="demand"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-form-item label="显示费种">
            <el-select v-model="costNos"  placeholder="综合水费" multiple class="shouldWater" clearable filterable>
              <span slot="prefix" v-if="showCostNames!=''">{{showCostNames}}</span>
              <el-option
                v-for="item in costNoList"
               :key="item.costNo"
                :label="item.costName"
                :value="item.costNo"
                :title="item.costName"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border @row-click = "btn" ref="eltableCurrentRow" @selection-change="getSelectList" :data="tableData.list" class="change-tables-table" v-if="tableShow" :max-height="maxHeight">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

        <el-table-column prop="accountPeriod" min-width="100" label="账期" show-overflow-tooltip></el-table-column>

        <el-table-column prop="bookNo" min-width="100" label="册本号" show-overflow-tooltip></el-table-column>

        <el-table-column prop="userGroupNo" min-width="120" label="用户组编号" show-overflow-tooltip></el-table-column>

        <el-table-column prop="userGroupName" min-width="80" label="用户组名称" show-overflow-tooltip></el-table-column>

        <el-table-column prop="printCount" min-width="80" label="打印次数"></el-table-column>

        <el-table-column prop="updateTime" min-width="130" label="打印时间"></el-table-column>

        <el-table-column prop="businessArea" min-width="150" label="营业区域" show-overflow-tooltip></el-table-column>
       
        <el-table-column prop="meterReader" min-width="120" label="抄表员" show-overflow-tooltip></el-table-column>

        <el-table-column prop="updateName" min-width="80" label="操作人"></el-table-column>
      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: "GroupInfoCopy",
  components: {},
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath:false,
      },
      props1: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath:false,
        checkStrictly: true,
      },
      isNot:[{label:"全部",value:''},{label:"否",value:'0'},{label:"是",value:'1'}],
      meterReaderList:[],
      bookNos: [],
      costNos:['zh'],
      costNoList:[],
      showbookNosData: [],
      businessAreaData: [], //营业区域下拉框
      flag:false,//行点击boolean值
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "打印管理" },
          { title: "分组账单打印" }
        ]
      },
      useWaterTypeOptions:[],//用水类型下拉框
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        accountPeriod: this.common.date("month"),
        fuzzyQuery: "",
        // bookNo:"",
        bookNos: [],
        printCount:"",
        businessArea:"",
        useWaterType:"",
        groupCode: localStorage.getItem('companyNo'),
      },
      meterReadingStaffName: '',
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      selectList: [],
    };
  },
  mounted() {
    this.init();
    this.SelectUseWaterTypeOptions();
    this.selectBAreaOptions();
    this.getReadingStaff();
    this.getBooks()
    this.getCostList()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, '.GroupInfoCopy', ['.GroupInfoCopy .toolbar', '.GroupInfoCopy .block', ".GroupInfoCopy .bread-contain"])
  },
  computed: {
    showbookNos () {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
       showCostNames(){
       return this.costNoList && this.costNoList.filter(item => this.costNos.includes(item.costNo) ).map(item => item.costName).join(', ')
      
    }
  },
  methods: {
    init() {
      let params = {
        busicode: "GroupBillPrintList",
        data: this.tableQuery
      };
      this.$api.fetch({ params: params }).then(res => {
        this.$set(this, "tableData", res);
      })
    },
     btn(row,col,event){
 //把这个flag 变成当前的行的私有物,这样一来,每次变化的时候, 变化的都是你当前行的布尔值, 
      row.flag = !row.flag;  
      this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);      
    },
        getCostList(){
      let params = {
        busicode: "CostListZH",
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.costNoList = res;
        });
    },
    getSelectList(e) {
      this.selectList = e
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
    Print() {
      let arr = [];
      this.selectList.forEach(function (element) { 
        arr.push(element.userGroupNo) 
      });
      if (arr.length == 0) {
        this.$message({
          message: '请先勾选需要打印的数据！',
          type: 'warning'
        });
        return
      }
      let params = {
        busicode: "GroupBillPrint",
        data: { groupNos: arr,accountPeriod:this.tableQuery.accountPeriod,costNos:this.costNos}
      };
      
      this.$api.fetch({ params: params }).then(async res => {
        let data = res
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        for(let i = 0; i < data.length; i++) {
          await this.common.print('view', 'GroupBillPrint', '', data[i], this);
        }
      })
    },
    PrintArrea() {
      let arr = [];
      this.selectList.forEach(function (element) { 
        arr.push(element.userGroupNo) 
      });
      if (arr.length == 0) {
        this.$message({
          message: '请先勾选需要打印的数据！',
          type: 'warning'
        });
        return
      }
      let params = {
        busicode: "GroupBillPrintArrear",
        data: { groupNos: arr,accountPeriod:this.tableQuery.accountPeriod,costNos:this.costNos}
      };
      
      this.$api.fetch({ params: params }).then(async res => {
        let data = res
        this.$notify({
          title: '成功',
          message: '正在打印...',
          type: 'success'
        })
        for(let i = 0; i < data.length; i++) {
          await this.common.print('view', 'UserGroupPrintArreage', '', data[i], this);
        }
      })
    },
      //营业区域
    selectBAreaOptions(id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res)
        _this.businessAreaData = data.children;
      })
    },
        //树结构数据处理
    getArr(data) {
      function abc(arr) {
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
        // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserList",
        "data": { "postNo": "2", businessArea: this.tableQuery.businessArea },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = res;
        //  _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    handleClick(tab, event) {
      this.$set(this.crumbsData.titleList, "3", {
        title: tab.label,
        method: () => {
          window.histroy.back();
        }
      });
    },
    demand() {
      //查询
      this.tableQuery.page = 1;
      if (this.tableQuery.businessArea){
        this.tableQuery.businessArea = this.common.handleTreeData(this.tableQuery.businessArea);
      }
      this.init();
    },
    // 营业区域、抄表员、册本号关联
    changeBusinessArea () {
      if (this.tableQuery.businessArea) {
        this.getBooks();
      } else {
        this.getBooks();
      }
      this.getReadingStaff();
    },
    changeMeterReadingStaff () {
      if (this.tableQuery.meterReader) {
        this.meterReaderList.forEach(v => {
          v.userInfos.forEach(res => {
            if (res.userAccount == this.tableQuery.meterReader) {
              this.meterReadingStaffName = res.userName
            }
          })
        })
      } else {
        this.meterReadingStaffName = ''
      }

      this.getBooks();
    },
    getBooks () {
      // if (this.meterReadingStaffName){
      if (this.meterReadingStaffName == null || this.meterReadingStaffName == undefined) {
        this.meterReadingStaffName = ''
      }
      let params = {
        busicode: 'baseAllBooks',
        data: {
          businessArea: this.tableQuery.businessArea,
          meterReadingStaff: this.meterReadingStaffName,
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
      // }else {
      //   this.bookNos = [];
      //   this.showbookNosData = [];
      // }
    },
    //   导出
    exportExcel() { },
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
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
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
.GroupInfoCopy {
  width: 100%;
  height: 100%;
}
</style>