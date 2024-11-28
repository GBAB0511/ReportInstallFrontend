<template>
  <!-- 定额费用管理 模块 -->
  <div class="GarbagePricing">
    <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <font v-if='indexShow==true'>
              <!-- <el-button type="primary" size="mini"  @click.native="historicalShow">查看历史</el-button> -->
                <el-button type="primary" size="mini"  @click="submitGarbage">保存</el-button>
          </font>
          <font v-else>
              <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog"  >返回</el-button>
          </font>
        </div>
    </div>


    <div v-if='indexShow' class='indexContent'>

      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="用户状态：">
              <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="请选择" >
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in dictionaryData.CUS" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="模糊查询：" class="width-200" @submit.native.prevent>
            <el-tooltip class="item" effect="dark" content="用户编号、客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search" placeholder="用户编号、客户名称"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        
        <el-table v-if="tableShow"  @select='onTableSelect' @selection-change="handleSelectionChange" ref="multipleTable" :max-height="maxHeight" center stripe border :data="tableList.list" class="change-tables-table">

            <el-table-column type="selection" width="50" fixed="left">
            </el-table-column>

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="userNo" min-width="120" label="用户编号" show-overflow-tooltip >
            </el-table-column>

            <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip >
            </el-table-column>

            

            <el-table-column prop="ctmAddr" min-width="100" label="装表地址" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="waterTypeName" min-width="120" label="用水类型">
            </el-table-column>

            <el-table-column prop="statusName" min-width="80" label="用户状态">
            </el-table-column>

            <el-table-column v-for="(item, index) in costList" :key="index" :prop="item.costNo" :label="item.subCostName" min-width="120">
              <template slot-scope="scope" v-if="scope.row.list.length != 0">
                <div v-for="(o, i) in scope.row.list" :key="i">
                  <el-input v-if="item.subCostName.indexOf('备注') == -1 && item.subCostName.indexOf('零水量计费') == -1 && item.subCostName.indexOf('按定额计费') == -1 && item.subCostNo == o.subCostNo" v-model="o.quotaMoney" size="mini" @input="inputChange(scope.row)"
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\D*(\d{0,8}(?:\.\d{0,2})?).*$/g, '$1').replace(/^\./g, '')"></el-input>
                  <el-input v-if="item.subCostName.indexOf('备注') != -1 && item.subCostNo == o.subCostNo" v-model="o.comments" @input="inputChange(scope.row)" oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" size="mini"></el-input>
                  <el-checkbox v-if="item.subCostName.indexOf('零水量计费') != -1 && item.subCostNo == o.subCostNo" :true-label="1" :false-label="0" v-model="o.zeroWaterCalc" @change="inputChange(scope.row)" size="mini"></el-checkbox>
                  <el-checkbox v-if="item.subCostName.indexOf('按定额计费') != -1 && item.subCostNo == o.subCostNo" :true-label="1" :false-label="0" v-model="o.calcWay" @change="inputChange(scope.row)" size="mini"></el-checkbox>
                </div>
              </template>
            </el-table-column>
          
            <!-- <el-table-column prop="garbateType"   min-width="100" label="垃圾费类型" >
                <template slot-scope="scope">
                <el-select 
                    size="mini"
                    v-model="scope.row.garbateType"  
                    :change="changeCalculation(scope.row.garbateType)" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                     <el-option v-for="(item,index) in garbageData" :key="index" :label="item.garbageTypeName" :value="item.id"></el-option>
                </el-select>
                </template>
            </el-table-column> -->
            
            <!-- <el-table-column prop="waterRatio"  min-width="100" label="水量占比" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.waterRatio" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column> -->

            <!-- <el-table-column prop="monthFixedGarbage"  v-if="monthFixedShow" min-width="110" label="每月定额垃圾费" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.monthFixedGarbage" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column>

            <el-table-column prop="industrialFixedGarbage" v-if="industrialFixedShow"  min-width="110" label="工厂定额垃圾费" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.industrialFixedGarbage" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column>

            <el-table-column prop="businessFixedGarbage" v-if="businessFixedShow" min-width="110" label="商业定额垃圾费" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.businessFixedGarbage" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column>

            <el-table-column prop="monthTransportGarbage"  v-if="transportFixedShow" min-width="110" label="每月垃圾清运费" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.monthTransportGarbage" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column>

            <el-table-column prop="otherFixedGarbage" v-if="otherFixedShow"  min-width="120" label="其它类定额垃圾费" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.otherFixedGarbage" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column> -->
            
            <!--el-table-column v-else prop="calculateValue"   min-width="100" label="计算值" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.calculateValue" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column-->
          

         
            <!-- <el-table-column prop="fixedAmount"   min-width="100" label="定额卫生费" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.fixedAmount" @keyup.native='keyupEvent($event,input)' @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-input>
                </template>
            </el-table-column> -->

            <!-- <el-table-column prop="comments"   min-width="100" label="备注" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.comments"  >
                </el-input>
                </template>
            </el-table-column> -->

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
            { title: '定额费用管理' },
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
            status:'1',
            fuzzyQuery:''
        },
        tableShow: false,
        maxHeight: 0,
        GarbageVisible:false,
        GarbageName:'定额费用管理',
        ruleForm:{},
        tableList: {},
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
        garbageData:[],
        dictionaryData:[],
        costData:[],
        monthFixedShow:false,//每月定额垃圾 显示控制
        industrialFixedShow:false,//工业定额垃圾 显示控制
        businessFixedShow:false,//商业定额垃圾 显示控制
        transportFixedShow:false,//垃圾清运费 显示控制
        otherFixedShow:false,//其它定额垃圾 显示控制

        // 费用类型
        costList: [], // 添加备注后的费用类型
        costListRes: [], // 费用类型
    }
  },
  mounted() {
    // this.getCostList();
    this.getCostType();
    // this.getGarbageType();
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.GarbagePricing', 
    ['.GarbagePricing .toolbar', '.GarbagePricing .block', '.GarbagePricing .bread-contain'])
  },
  methods: {
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    isBlur(val) {     
      this.blurRow = val.$index;
      
    },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "CUS"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    getGarbageType() {  //获取垃圾费类型列表
      var _this = this
      var params = {
        "busicode": "GarbageTypeList",
        "data":{page:1,pageCount:999},
     }
      this.$api.fetch({
       params: params,//参数
      }).then(res => {
        _this.garbageData= res.list
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
                if(item.costNo === '30')
                    _this.monthFixedShow = item.used;
                else if(item.costNo === '31') 
                    _this.industrialFixedShow = item.used;
                else if(item.costNo === '32') 
                    _this.businessFixedShow = item.used;
                else if(item.costNo === '33') 
                    _this.transportFixedShow = item.used;
                else if(item.costNo === '34') 
                    _this.otherFixedShow = item.used;
            })
          }
      })
    },
    //2位小数计算
    keyupEvent(e,input){
      e.target.value=e.target.value.replace(/[^\d.]/g, '');
      e.target.value=e.target.value.replace(/\.{2,}/g, '.');
      e.target.value=e.target.value.replace(/^\./g, '0.');
      e.target.value=e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0,e.target.value.length-1));  
      e.target.value=e.target.value.replace(/^0[^\.]+/g, '0')
      e.target.value=e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
      this.input=e.target.value
      //console.log(this.input)
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
        "busicode": "FnQuotaList",
        "data": this.tableQuery
      }
       this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log('res', res)
          _this.tableList = res;
          _this.tableList.list.forEach(item => {
            if(item.list.length == 0){ // 为空,添加默认值
             this.costListRes.forEach(costItem => {
              item.list.push({'subCostNo': costItem.subCostNo, 'quotaMoney': "0.0", 'comments': "",'zeroWaterCalc': 0, 'calcWay': 1})
             })
            }else{
              let existList = item.list.map(uItem => {
                return uItem.subCostNo;
              })
              this.costListRes.forEach(costItem => { // 添加不存在的费用类型列表
                if(existList.indexOf(costItem.subCostNo) == -1){
                  item.list.push({'subCostNo': costItem.subCostNo, 'quotaMoney': "0.0", 'comments': "",'zeroWaterCalc': 0, 'calcWay': 1})
                }
              });
            }
          })
          this.$nextTick(() => {
            this.$refs.multipleTable.doLayout();
          })
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
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
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
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    //   开户
    add() {
      this.indexShow = false;
    },
    submitGarbage() {
      if(this.multipleSelection.length == 0){
        this.$message({
          type: "warning",
          message: "请选择需要保存的用户！"
        })
        return;
      }
      console.log('multipleSelection', this.multipleSelection)
      let hasEmpty = false;
      let data = this.multipleSelection.map(item => {
          let info = {};
          info.userNo = item.userNo;
          info.list = item.list.map(list => {
            if(list.quotaMoney == ""){
              hasEmpty = true;
            }
            return {
              subCostNo: list.subCostNo,
              quotaMoney: list.quotaMoney,
              comments: list.comments,
              zeroWaterCalc: list.zeroWaterCalc,
              calcWay: list.calcWay
            }
          })
          return info;
      })
      // if(hasEmpty){
      //   this.$message({
      //     showClose: true,
      //     message: "部分数据未编辑",
      //     type: "warning"
      //   }); 
      //   return;
      // }
      let params = {
        busicode: "FnQuotaSave",
        data: data
      }
      console.log('params', params)
      // return;
      this.$api.fetch({
        params
      }).then(res => {
        this.$message({
          type: "success",
          message: "保存成功"
        })
        this.init();
      })
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
    getCostType(){
      let params = {
        busicode: "FnQuotaCostType",
        data: {},
      }
      this.$api.fetch({
        params
      }).then(res => {
        this.costListRes = res; 
        let temp = [];
        res.forEach(item => {
          temp.push(item);
          temp.push({
            "costNo": item.costNo,
            "subCostNo": item.subCostNo,
            "subCostName": item.subCostName+"备注"
          })
          temp.push({
            "costNo": item.costNo,
            "subCostNo": item.subCostNo,
            "subCostName": item.subCostName+"零水量计费"
          })
          temp.push({
            "costNo": item.costNo,
            "subCostNo": item.subCostNo,
            "subCostName": item.subCostName+"按定额计费"
          })
        })
        this.costList = temp;
        this.init();
      })
    },
    inputChange(row){
      this.$refs.multipleTable.toggleRowSelection(row, true);
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
<style lang="scss" >
.GarbagePricing {
  width: 100%;
  height: 100%;
  .el-date-editor .el-input /deep/ .el-date-editor.el-input__inner{
    width: 100%!important;
  }
}
</style>
