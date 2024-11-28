<template>
  <!-- 垃圾费定价历史查询 模块 -->
  <div class="GarbagePricingHistorical">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item class="form-left">
            <el-form-item label='修改时间：'>
                <el-date-picker
                    v-model="billTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="用户状态">
              <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="请选择" >
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in dictionaryData.CUS" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="模糊查询：" class="searchInput">
              <el-tooltip class="item" effect="dark" content="用户编号、用户地址、修改人" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableList.list" class="change-tables-table">

            <el-table-column type="index" label="NO." width="50" fixed="left">
            </el-table-column>

            <el-table-column prop="userNo" min-width="60" label="用户编号">
            </el-table-column>

            <el-table-column prop="ctmName" min-width="100" label="用户名称">
            </el-table-column>

            <el-table-column prop="ctmAddr" min-width="100" label="用户地址">
            </el-table-column>

            <el-table-column prop="useWaterTypeName" min-width="100" label="用水类型">
            </el-table-column>

             <el-table-column prop="garbateType"   min-width="100" label="垃圾费类型">
                <!--<template slot-scope="scope">
                <el-select 
                    size="mini"
                    v-model="scope.row.calculateType"  
                    disabled>
              
                    <el-option label="按水量" value="1"></el-option>
                    <el-option label="按公式" value="2"></el-option>
                </el-select>
                </template>-->
            </el-table-column>

             <el-table-column prop="changeItem" min-width="300" label="收费描述" show-overflow-tooltip>
            </el-table-column>
            
            <el-table-column prop="createName" min-width="60" label="修改人">
            </el-table-column>

            <el-table-column prop="createTime" min-width="100" label="修改时间">
            </el-table-column>
        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableList.total">
          </el-pagination>
        </div>

  </div>
</template>
<script>
export default {
  name: "GarbagePricingHistorical",
  data() {
    return {
      tableEdit: false,
      activeName: 'EngineeringAccountOpening',
      indexShow: true,
      crumbsData: {  //面包屑
        titleList: [
            { title: '收费管理' },
            { title: '价格管理' },
            { title: '垃圾费定价' },
            ],
      },
      //审批状态下拉框
      approvalStatusOptions: [
        { value: '1', label: '全部' },
        { value: '2', label: '正常' },
        { value: '3', label: '非正常' },
      ],
      tableQuery: {
        page:1,
        pageCount:20,
        // beginDate:billTime[0],
        // endDate:billTime[1],
        fuzzyQuery: "",
        startDate:'',
        endDate:'',
        status:'',
      },
      billTime:'',
      tableShow: false,
      maxHeight: 0,
      tableList: {
        list: [
          {
          },
        ]
      },
      dictionaryData:[],
      costData:[],
      monthFixedShow:false,//每月定额垃圾 显示控制
      industrialFixedShow:false,//工业定额垃圾 显示控制
      businessFixedShow:false,//商业定额垃圾 显示控制
      transportFixedShow:false,//垃圾清运费 显示控制
      otherFixedShow:false,//其它定额垃圾 显示控制
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  mounted() {
     this.getCostList();
    this.init();
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.GarbagePricingHistorical', ['.GarbagePricingHistorical .toolbar', '.GarbagePricingHistorical .block', '.GarbagePricingHistorical .bread-contain'])
  },
  methods: {
     enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let _this = this
      let params = {
        "busicode": "UserGarbageHisList",
        "data": _this.tableQuery,
      }
       this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res)
          _this.tableList = res;
        });
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "CUS"
     }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    getCostList() {   //获取费用类型 状态
        let _this = this;
        let params = {
            "busicode": "CostListYW",
            "data":{},
        }
        this.$api.fetch({
        params: params,//参数
        
        }).then(res => {
            _this.costData = res;
            if(res!=null && res.length > 0) {
              res.forEach((item)=>{
                  if(item.costNo === '15')
                      _this.monthFixedShow = item.used;
                  else if(item.costNo === '16') 
                      _this.industrialFixedShow = item.used;
                  else if(item.costNo === '17') 
                      _this.businessFixedShow = item.used;
                  else if(item.costNo === '18') 
                      _this.transportFixedShow = item.used;
                  else if(item.costNo === '19') 
                      _this.otherFixedShow = item.used;
              })
            }
        })
      },
    search() {  //查询
      console.log(this.tableQuery.billTime)
      if(this.billTime != null) {
        this.tableQuery.startDate = this.billTime[0]
        this.tableQuery.endDate = this.billTime[1]
      }

      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    exportExcel() {
    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      this.tableQuery.page = val
      this.init()
    },
    //   开户
    add() {
      this.indexShow = false;
    },

    closeDialog() { //关闭会话
      this.TransferDetailsVisible = false;
      this.indexShow = true;
      // this.crumbsData.titleList.pop();
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
    },
    // 编辑
    edit(val) {
      this.indexShow = false;
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.GarbagePricingHistorical {
  width: 100%;
  height: 100%;
}
</style>
