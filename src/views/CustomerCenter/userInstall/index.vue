<template>
  <div class="userInstall">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button v-if="!showIndex" size="mini" type="primary" @click="save">保存</el-button>
        <el-button v-if="!showIndex" size="mini" @click="back">返回</el-button>
      </div>
    </div>
    <div class="pageIndex" v-if="showIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
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
           <el-form-item label="报装日期：" class="width-250">
              <el-date-picker type="daterange" v-model="date" start-placeholder="请选择" end-placeholder="请选择"></el-date-picker>
            </el-form-item>
          <el-form-item class="button-group">
            <el-button type="primary" @click="add">立户</el-button>
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row stripe border :max-height="maxHeight" :data="tableData.list" @selection-change="handleSelection">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="billNo" min-width="120" label="工程编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjType" min-width="80" label="工程类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installAddr" min-width="180" label="报装地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctmName" min-width="120" label="用户名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" min-width="150" label="手机号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="meterNum" min-width="80" label="装表数量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createName" min-width="80" label="受理人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" min-width="80" label="受理时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="completionDate" min-width="80" label="完工日期" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <user-install-edit ref="edit" v-else @success="back" />
  </div>
</template>

<script>
import userInstallEdit from './userInstallEdit.vue'
export default {
  components: { userInstallEdit },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "用户管理" },
          { title: "立户" },
        ]
      },
      tableQuery: {
        fuzzyItems: [],
        fuzzyQuery: '',
        beginDate: '',
        endDate: '',
        page: 1,
        pageCount: 20
      },
      date: [],
      tableData: {
        list: [],
        total: 0
      },
      maxHeight: 0,
      showIndex: true,
      dictionaryData: {},
      selected: ''
    }
  },
  mounted() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    const twoMonthAgo = month < 2 ? (year - 1).toString() + '-' + (12 - month + 1) + '-' + day : (year.toString() + '-' + (month === 11 ? '' : '0') + (month - 1)) + '-' + day
    this.date = [twoMonthAgo, this.common.date()]
    this.tableQuery.beginDate = twoMonthAgo
    this.tableQuery.endDate = this.common.date()
    this.getDictionary()
    this.init()
    this.$nextTick(() => {
      this.common.changeTable(this, ".userInstall", [
        ".userInstall .toolbar",
        ".userInstall .bread-contain",
        ".userInstall .toggle-btn",
        ".userInstall .block"
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
         }
    },
    init() {
      var _this = this
      var params = {
        "busicode": "PjUserInstallList",
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
        "data": "PQI" //查询项
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
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
    add() {
      if(this.selected == '') {
        this.$message({
          type: 'warning',
          message: '请先选择至少一条数据'
        })
        return
      }

      this.showIndex = false
      this.$nextTick(() => {
        this.$refs.edit.init(this.selected)
      })
    },
    back() {
      this.showIndex = true
      this.init()
    },
    save() {
      this.$refs.edit.submit()
    },
    handleSelection(selection) {
      this.selected = selection.map(item => item.billNo).join(',')
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
.userInstall {
  height: 100%;
}
</style>