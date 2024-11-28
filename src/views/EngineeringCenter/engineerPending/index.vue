<template>
  <div class="engineerPending">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button icon="el-icon-caret-left" v-if="!showIndex" size="mini" @click="showIndex = !showIndex">返回</el-button>
      </div>
    </div>
    <div class="pageIndex" v-if="showIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form inline size="mini" label-position="right" label-width="80px" class="multiple-floor">
          <el-form-item label="查询项：" class="width-200">
            <el-select ref="select1" v-model="tableQuery.fuzzyItems" placeholder="" multiple clearable>
              <span slot="prefix">{{fuzzyItems}}</span>
              <el-option v-for="item in dictionaryData.PJD" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询内容：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" placeholder="" clearable></el-input>
          </el-form-item>
           <el-form-item label="单据日期：" class="width-250">
            <el-date-picker type="daterange" value-format="yyyy-MM-dd" v-model="date" start-placeholder="" end-placeholder=""></el-date-picker>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row stripe border :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
              <!-- <el-button type="text" size="mini" @click="rePending(scope.row)" v-if="scope.row.pendingState == 2">恢复</el-button> -->
            </template>
          </el-table-column>
          <el-table-column prop="billNo" min-width="120" label="单据编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billDate" min-width="120" label="单据时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color:black">{{timeFormate(scope.row.billDate).split(' ')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="processName" min-width="80" label="流程状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjNodeName" min-width="120" label="挂起节点" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjNo" min-width="120" label="工程编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjType" min-width="80" label="工程类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-for="item in PPTArray" >
                <span :key="item.value" style="color:black" v-if="item.value==scope.row.pjType">{{item.name}}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="pjName" min-width="180" label="工程名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installAddr" min-width="180" label="工程地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" min-width="120" label="手机号码" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <engineerPendingEdit v-else ref="delay" :pendingData="pendingData" :hidd="hiddenBtn" ></engineerPendingEdit>
  </div>
</template>

<script>
import engineerPendingEdit from './engineerPendingEdit.vue';
export default {
  components: { engineerPendingEdit },
  data() {
    return {
      hiddenBtn:false,
      PPTArray:[],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "工程管理" },
          { title: "用户工程" },
          { title: "工程挂起" }
        ]
      },
      tableQuery: {
        fuzzyItems: [],
        fuzzyQuery: '',
        pjTypeList: [],
        nodeNameList:'',
        processState: '',
        billStartTime: '',
        billEndTime: '',
        page: 1,
        pageCount: 20,
        overdueStartTime:'',
        overdueEndTime:''
      },
      date: [],
      delayDate:[],
      isActive: false,
      tableData: {
        list: [],
        total: 0
      },
      maxHeight: 0,
      showIndex: true,
      dictionaryData: {},
      pendingData: {}
    }
  },
  mounted() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    const twoMonthAgo = month < 2 ? (year - 1).toString() + '-' + (12 - (Math.abs(month - 1) % 12)) + '-' + day : (year.toString() + '-' + (month === 11 ? '' : '0') + (month - 1)) + '-' + day
    this.date = [twoMonthAgo, this.common.date()]
    this.tableQuery.billStartTime = twoMonthAgo
    this.tableQuery.billEndTime = this.common.date()
    this.getDictionary()
    this.init()
    this.$nextTick(() => {
      this.common.changeTable(this, ".engineerPending", [
        ".engineerPending .toolbar",
        ".engineerPending .bread-contain",
        ".engineerPending .toggle-btn",
        ".engineerPending .block"
      ]);
    })
  },
  methods: {
    timeFormate (timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
      let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
      let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
      let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
      let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
      timeStamp = year + "-" + month + "-" + date+' '+hh+':'+mm+':'+ss;
      return timeStamp
    },
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    enterEvents(e){
      if(e.keyCode == 13){
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
        this.$refs.select3.blur()
      }
    },
    init() {
      var _this = this
      var params = {
        "busicode": "PjPendingList",
        "data": {
          page: this.tableQuery.page,
          pageCount: this.tableQuery.pageCount,
          billStartDate: this.tableQuery.billStartTime,
          billEndDate: this.tableQuery.billEndTime,
          fuzzyItems: this.tableQuery.fuzzyItems,
          fuzzyQuery: this.tableQuery.fuzzyQuery
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData= res
      })
    },
    search() {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PCN,PJD,PPT,PCS,PROJECT_DELAY_REASON"
        //查询项、工程类型、流程状态
      }
      this.$api.fetch({
        params: params,//参数
        }).then(res => {
          _this.dictionaryData = res
          this.PPTArray=res.PPT
      })
    },
    detail(row) {
      console.log(row)
      this.pendingData = {pendingId: row.id}
      this.showIndex = false
    },
    rePending(row) {
      // 这个是挂起恢复，要调用接口
      this.$confirm('确认恢复该工程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
        busicode: "PjPendingRecover",
        data: {
          id: row.id,
          pjId: row.pjId,
        },
      };
      this.$api
        .fetch({
          params: params,
        })
        .then((res) => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '恢复成功'
          });
          this.init();
        });
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        });
      })
    },
    hidden() {
      this.isActive = !this.isActive
      this.$nextTick(() => {
        this.common.changeTable(this, ".engineerPending", [
          ".engineerPending .toolbar",
          ".engineerPending .bread-contain",
          ".engineerPending .toggle-btn",
          ".engineerPending .block"
        ]);
      })
    },
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
    //显示多少页码
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    back() {
      this.showIndex = true
    },
    closeDialog() {
      this.showIndex = true
    }
  },
  watch: {
    delayDate(val){
      if(val && val.length > 0) {
        this.tableQuery.overdueStartTime=val[0]
        this.tableQuery.overdueEndTime=val[1]
      }else{
        this.tableQuery.overdueStartTime=''
        this.tableQuery.overdueEndTime=''
      }
    },
    date(val) {
      if(val && val.length > 0) {
        this.tableQuery.billStartTime = val[0]
        this.tableQuery.billEndTime = val[1]
      } else {
        this.tableQuery.billStartTime = ''
        this.tableQuery.billEndTime = ''
      }
    }
  },
  computed: {
    fuzzyItems() {
      return this.dictionaryData.PJD && this.dictionaryData.PJD.filter(item => this.tableQuery.fuzzyItems.includes(item.value)).map(item => item.name).join('，')
    },
    pjType() {
      return this.dictionaryData.PPT && this.dictionaryData.PPT.filter(item => this.tableQuery.pjTypeList.includes(item.value)).map(item => item.name).join('，')
    },
    nodeNameList() {
      return this.dictionaryData.PCN && this.dictionaryData.PCN.filter(item => this.tableQuery.nodeNameList.includes(item.name)).map(item => item.name).join('，')
    },
  }
}
</script>

<style lang="scss" scoped>
.engineerPending {
  height: 100%;
}
.kl-table {
  margin-top: 15px;
}
</style>
