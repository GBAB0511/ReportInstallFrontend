<template>
  <!-- 垃圾费定价 模块 -->
  <div class="GarbagePricing">
    <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <font v-if='indexShow==true'>
              <el-button type="primary" size="mini"  @click.native="historicalShow">查看历史</el-button>
                <el-button type="primary" size="mini"  @click="submitGarbage">保存</el-button>
          </font>
          <font v-else>
              <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog"  >返回</el-button>
          </font>
        </div>
    </div>


    <div v-if='indexShow' class='indexContent'>

      <div  class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item label="模糊查询：" class="searchInput">
            <el-tooltip class="item" effect="dark" content="用户编号、用户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.fuzzyQuery" clearable size="mini"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        
        <el-table highlight-current-row v-if="tableShow"  @select='onTableSelect' @selection-change="handleSelectionChange" ref="multipleTable" :max-height="maxHeight" center stripe border :data="tableList.list" class="change-tables-table">

            <el-table-column type="selection" width="50" fixed="left">
            </el-table-column>

            <el-table-column type="index" label="NO." width="50" fixed="left">
            </el-table-column>

            <el-table-column prop="userNo" min-width="80" label="用户编号">
            </el-table-column>

            <el-table-column prop="ctmName" min-width="100" label="用户名称">
            </el-table-column>

            <el-table-column prop="ctmAddr" min-width="100" label="用户地址">
            </el-table-column>

            <el-table-column prop="useWaterTypeName" min-width="100" label="用水类型">
            </el-table-column>
          
            <el-table-column prop="calculateType"   min-width="100" label="计算类型" >
                <template slot-scope="scope">
                <el-select 
                    size="mini"
                    v-model="scope.row.calculateType"  
                    :change="changeCalculation(scope.row.calculateType)" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
               
                    <el-option label="按水量" value="1"></el-option>
                    <el-option label="按公式" value="2"></el-option>
                </el-select>
                </template>
            </el-table-column>
            
            <el-table-column v-if="CollectionRatioShow" prop="calculateValue"   min-width="100" label="收取比例" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    @input="e => input = inputMe(e)"
                    size="mini" v-model="scope.row.calculateValue" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column>
            
            <el-table-column v-else prop="calculateValue"   min-width="100" label="计算值" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    @input="e => input = inputMe(e)"
                    size="mini" v-model="scope.row.calculateValue" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column>
            
            <el-table-column prop="calculateAmount"   min-width="100" label="计算数量" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    @input="e => input = inputMe(e)"
                    size="mini" v-model="scope.row.calculateAmount" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column>

            <el-table-column prop="calculateUnit"   min-width="100" label="计算单位" >
                <template slot-scope="scope">
                <el-select 
                    size="mini"
                    v-model="scope.row.calculateUnit" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
               
                    <el-option label="按月" value="1"></el-option>
                    <el-option label="定额" value="2"></el-option>
                </el-select>
                </template>
            </el-table-column>
            
            <el-table-column prop="comments"   min-width="100" label="备注" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    @input="e => input = inputMe(e)"
                    size="mini" v-model="scope.row.comments"  >
                </el-input>
                </template>
            </el-table-column>

        <!--  <el-table-column label="操作" width="85">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="addGarbage(scope.row)">编辑</el-button>
            </template>
          </el-table-column>-->

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableList.total">
          </el-pagination>
        </div>
    </div>

    <div v-else class='indexContent'>
      <GarbagePricingHistorical ref="ManualCollectionEdit" ></GarbagePricingHistorical>
    </div>
  </div>
</template>
<script>
import GarbagePricingHistorical from './GarbagePricingHistorical'
export default {
  name: "GarbagePricing",
  components: {
    GarbagePricingHistorical,
  },
  data() {
    return {
        CollectionRatioShow:false,
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
            fuzzyQuery:''
        },
        tableShow: false,
        maxHeight: 0,
        GarbageVisible:false,
        GarbageName:'垃圾费定价',
        ruleForm:{},
        tableList: {
           
        },
        focusRow:-1,
        blurRow:-1,
        changeRow:-1,
        // 日期选择器
        pickerOptions: {
            Date(time) {
            return time.getTime() > Date.now();
            }
        },
        multipleSelection:[],
    }
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.GarbagePricing', 
    ['.GarbagePricing .toolbar', '.GarbagePricing .block', '.GarbagePricing .bread-contain'])
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    isBlur(val) {     
      this.blurRow = val.$index;
      
    },
    isFocus(val){
      let _this = this
      this.focusRow = val.$index;
      if(this.blurRow== -1 || this.changeRow == -1)
        return

      // if(this.blurRow != this.focusRow  && this.changeRow == this.blurRow) {
      //   console.log(this.tableList.list[this.blurRow])
      //   if((this.tableList.list[this.blurRow].calculateType=='' || this.tableList.list[this.blurRow].calculateType == null
      //      ) ||
      //     (this.tableList.list[this.blurRow].calculateValue == '' || this.tableList.list[this.blurRow].calculateValue == null
      //       || this.tableList.list[this.blurRow].calculateValue === '0') || (this.tableList.list[this.blurRow].calculateAmount== '' || this.tableList.list[this.blurRow].calculateAmount== null || this.tableList.list[this.blurRow].calculateAmount === '0') || (this.tableList.list[this.blurRow].calculateUnit=='' || this.tableList.list[this.blurRow].calculateUnit== null)) {
      //       _this.$message({
      //         showClose: true,
      //         message: '第'+(this.blurRow+1)+'行'+"部分数据未编辑",
      //         type: "warn"
      //       });     
      //   }
      // }
    },
    isSelect(val,index) {
      this.changeRow = index;
      if(val.calculateType!='' || (val.calculateValue != '' &&  val.calculateValue != '0') || (val.calculateAmount!= '' 
        && val.calculateAmount!= '0') || val.calculateUnit!='')
        this.$refs.multipleTable.toggleRowSelection(val,true);
      else 
        this.$refs.multipleTable.toggleRowSelection(val,false);
    },
    handleSelectionChange(val) {
       //val 为选中数据的集合
        this.multipleSelection = val;
      },
     onTableSelect(rows, row) {
      let selected = rows.length && rows.indexOf(row) !== -1
    },
    // addGarbage(val){
    //     this.ruleForm = val;
    //     this.GarbageVisible = true;
    // },
    init() {
      let _this = this
      let params = {
        "busicode": "UserGarbageList",
        "data": _this.tableQuery,
      }
       this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableList = res;
        });
    },
    historicalShow(){
        this.indexShow = false
    },
    changeCalculation(val){
        if(val == 0){
            this.CollectionRatioShow = false
        }else{
            this.CollectionRatioShow = true
        }
        
    },
    search() {  //查询
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
    submitGarbage() {
      let _this = this
      var params
       params = {
        busicode: "UserGarbageUpdate",
        data: _this.multipleSelection
      };
      let quit = 0
     _this.multipleSelection.forEach((item)=> {
        if((item.calculateType==='' || item.calculateType === null
           ) ||
          (item.calculateValue === '' || item.calculateValue === null
            ) || (item.calculateAmount=== '' || item.calculateAmount=== null ) || (item.calculateUnit==='' || item.calculateUnit=== null)) {
             _this.$message({
              showClose: true,
              message: "部分数据未编辑",
              type: "warn"
            });  
           quit = 1;
        }
     })
     if(quit == 1)
      return;
      _this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {        
            _this.$message({
              showClose: true,
              message: "保存成功",
              type: "success"
            });           
            //_this.GarbageVisible = false
            //_this.ruleForm = {}
            _this.init()         
        });
    },
    closeDialog() { //关闭会话
      this.indexShow = true;
      this.init()
    },
    // closeGarbageDialog() {
    //     this.GarbageVisible = false
    //     this.ruleForm = {}
    //     this.init()
    // },
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
.GarbagePricing {
  width: 100%;
  height: 100%;
}
</style>
