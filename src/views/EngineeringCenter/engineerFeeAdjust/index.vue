<template>
  <div class="engineerFeeAdjust">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
      </div>
    </div>
    <div class="pageIndex">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form inline size="mini" label-position="right" label-width="80px" class="multiple-floor">
          <el-form-item label="查询项：" class="width-200">
            <el-select ref="select1" v-model="tableQuery.fuzzyItems" placeholder="请选择" multiple clearable>
              <span slot="prefix">{{fuzzyItems}}</span>
              <el-option v-for="item in dictionaryData.PQI" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询内容：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="工程类型：" class="width-200">
            <el-select ref="select2" v-model="tableQuery.pjType" placeholder="请选择" multiple clearable>
              <span slot="prefix">{{pjType}}</span>
              <el-option v-for="item in dictionaryData.PPT" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
          
          <div v-show="isActive" class="advancedQuery">
            <el-form-item label="信息来源：" class="width-200">
              <el-select ref="select3" v-model="tableQuery.sourceFlag" placeholder="请选择" clearable>
                <el-option v-for="item in dictionaryData.PIS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流程节点：" class="width-200">
              <el-select ref="select4" v-model="tableQuery.schedule" placeholder="请选择" multiple clearable>
                <el-option v-for="(item,index) in scheduleOptions" :key="index" :label="item.nodeName" :value="item.nodeCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流程状态：" class="width-200">
              <el-select ref="select5" v-model="tableQuery.processState" placeholder="请选择" clearable>
                <el-option v-for="item in dictionaryData.PCS" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报装日期：" class="width-250">
              <el-date-picker type="daterange" v-model="date" start-placeholder="请选择" end-placeholder="请选择"></el-date-picker>
            </el-form-item>
          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row stripe border :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column fixed="left" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="detail(scope.row.id)">详情</el-button>
              <el-button type="text" size="mini" @click="add(scope.row.id)">补录预缴款</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="billNo" min-width="120" label="工程编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjName" min-width="120" label="工程名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjType" min-width="80" label="工程类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processName" min-width="100" label="流程节点" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processHandleMan" min-width="120" label="当前处理人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installAddr" min-width="180" label="报装地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctmName" min-width="120" label="用户名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" min-width="120" label="手机号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billDate" min-width="120" label="报装日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="meterNum" min-width="80" label="装表个数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="budgetMoney" min-width="100" label="预算金额" fixed="right" show-overflow-tooltip></el-table-column>
          <el-table-column prop="accruedMoney" min-width="100" label="已缴金额" fixed="right" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="addShow" title="补录预缴款" class="button-dialog">
      <engineerFeeAdjustEdit v-if="addShow" ref="add" @success="close"/>
      <div slot="footer">
        <el-button type="danger" size="mini" @click="submit">收款确认</el-button>
        <el-button type="primary" size="mini">打印收据</el-button>
        <el-button size="mini" @click="back">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="detailShow" title="工程详情" class="common-dialog">
      <engineer-approval-edit v-if="detailShow" :id="detailId" :noProcess="true"></engineer-approval-edit>
    </el-dialog>
  </div>
</template>

<script>
import engineerApprovalEdit from '../engineerApproval/engineerApprovalEdit.vue';
import engineerFeeAdjustEdit from './engineerFeeAdjustEdit.vue'
export default {
  components: { engineerApprovalEdit, engineerFeeAdjustEdit },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "工程管理" },
          { title: "用户工程" },
          { title: "工程款调整" }
        ]
      },
      tableQuery: {
        fuzzyItems: [],
        fuzzyQuery: '',
        pjType: [],
        beginDate: '',
        endDate: '',
        sourceFlag: '',
        schedule: [],
        processState: '',
        page: 1,
        pageCount: 20
      },
      date: [],
      isActive: false,
      tableData: {
        list: [],
        total: 0
      },
      maxHeight: 0,
      dictionaryData: {},
      scheduleOptions: [],
      detailShow: false,
      detailId: '',
      addShow: false
    }
  },
  mounted() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
       const twoMonthAgo = month < 2 ? (year - 1).toString() + '-' + (12 - (Math.abs(month - 1) % 12)) + '-' + day : (year.toString() + '-' + (month === 11 ? '' : '0') + (month - 1)) + '-' + day
    this.date = [twoMonthAgo, this.common.date()]
    this.tableQuery.beginDate = twoMonthAgo
    this.tableQuery.endDate = this.common.date()
    this.getProcessStateData()
    this.getDictionary()
    this.init()
    this.$nextTick(() => {
      this.common.changeTable(this, ".engineerFeeAdjust", [
        ".engineerFeeAdjust .toolbar",
        ".engineerFeeAdjust .bread-contain",
        ".engineerFeeAdjust .toggle-btn",
        ".engineerFeeAdjust .block"
      ]);
    })
  },
  methods: {
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
           this.$refs.select4.blur()
           this.$refs.select5.blur()
          //  this.$refs.select6.blur()
         }
    },
    init() {
      var _this = this
      var params = {
        "busicode": "PjAdjustList",
        "data": this.tableQuery
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData= res
      })
    },
    search() {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PQI,PPT,PIS,PCS" //查询项、工程类型、信息来源、流程状态
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 获取流程节点
    getProcessStateData() {
      this.common.getProcessStateData('pj_info_new', this, (res) => {
        this.scheduleOptions = res
      })
    },
    hidden() {
      this.isActive = !this.isActive
      this.$nextTick(() => {
        this.common.changeTable(this, ".engineerFeeAdjust", [
          ".engineerFeeAdjust .toolbar",
          ".engineerFeeAdjust .bread-contain",
          ".engineerFeeAdjust .toggle-btn",
          ".engineerFeeAdjust .block"
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
    add(id) {
      this.addShow = true
      this.$nextTick(() => {
        this.$refs.add.init(id)
      })
    },
    submit() {
      this.$refs.add.submit()
    },
    close() {
      this.back()
      this.init()
    },
    back() {
      this.detailShow = false
      this.addShow = false
    },
    detail(id) {
      this.detailId = id
      this.$nextTick(() => {
        this.detailShow = true
      })
    }
  },
  watch: {
    date(val) {
      if(val && val.length > 0) {
        this.tableQuery.beginDate = val[0]
        this.tableQuery.endDate = val[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    }
  },
  computed: {
    fuzzyItems() {
      return this.dictionaryData.PQI && this.dictionaryData.PQI.filter(item => this.tableQuery.fuzzyItems.includes(item.value)).map(item => item.name).join('，')
    },
    pjType() {
      return this.dictionaryData.PPT && this.dictionaryData.PPT.filter(item => this.tableQuery.pjType.includes(item.value)).map(item => item.name).join('，')
    },
  }
}
</script>

<style lang="scss" scoped>
.engineerFeeAdjust {
  height: 100%;
}
.kl-table {
  margin-top: 15px;
}
</style>