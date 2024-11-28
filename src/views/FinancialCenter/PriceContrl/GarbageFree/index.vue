<template>
  <!-- 垃圾费免收 模块 -->
  <div class="GarbageFree">
    <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
    
                <el-button type="primary" size="mini"  @click="submitGarbage">保存</el-button>
    
        </div>
    </div>


    <div class="indexContent">

      <div  class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

          <el-form-item label="用户状态：">
              <el-select ref="select1" clearable v-model="tableQuery.status" placeholder="请选择" >
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in dictionaryData.CUS" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="模糊查询：" class="width-200" @submit.native.prevent>
            <el-tooltip class="item" effect="dark" content="用户编号、客户名称" placement="top">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" placeholder="用户编号、客户名称" v-model="tableQuery.fuzzyQuery" clearable size="mini" @keydown.enter.native="search"></el-input>
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

            <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip >
            </el-table-column>

            <el-table-column prop="ctmName" min-width="100" label="客户名称" show-overflow-tooltip >
            </el-table-column>

            

            <el-table-column prop="setupMeterAddr" min-width="100" label="装表地址" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="useWaterTypeName" min-width="100" label="用水类型">
            </el-table-column>
          
            
               <el-table-column prop="garbateFree"   min-width="100" label="垃圾费免收" >
                <template slot-scope="scope">
                <el-select 
                    size="mini"
                    v-model="scope.row.garbateFree" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
               
                    <el-option label="收取" :value="0"></el-option>
                    <el-option label="免收" :value="1"></el-option>
                </el-select>
                </template>
            </el-table-column>

            <el-table-column prop="freeBegin"   min-width="200" label="免收开始日期" >
                <template slot-scope="scope">
                <el-date-picker
                    v-model="scope.row.freeBegin"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-date-picker>
                </template>
            </el-table-column>

            <el-table-column prop="freeEnd"   min-width="200" label="免收结束日期" >
                <template slot-scope="scope">
                <el-date-picker
                    v-model="scope.row.freeEnd"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)">
                </el-date-picker>
                </template>
            </el-table-column>
           
            <el-table-column prop="status" min-width="80" label="用户状态" show-overflow-tooltip >
            </el-table-column>

         
            <el-table-column prop="mianShouComments"   min-width="100" label="备注" >
                <template slot-scope="scope">             
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    size="mini" v-model="scope.row.mianShouComments" @blur="isBlur(scope)" @focus="isFocus(scope)" @change="isSelect(scope.row,scope.$index)" >
                </el-input>
                </template>
            </el-table-column>
            

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableList.total">
          </el-pagination>
        </div>
    </div>

  
  </div>
</template>
<script>
export default {
  name: "GarbageFree",
  components: {
  },
  data() {
    return {
        CollectionRatioShow:false,
        tableEdit: false,
 
        crumbsData: {  //面包屑
            titleList: [
            { title: '收费管理' },
            { title: '价格管理' },
            { title: '垃圾费免收' },
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
        garbageData:[],
        dictionaryData:[],
    }
  },
  mounted() {
    this.init();
    this.getDictionary();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.GarbageFree', 
    ['.GarbageFree .toolbar', '.GarbageFree .block', '.GarbageFree .bread-contain'])
  },
  methods: {
    isBlur(val) {     
      this.blurRow = val.$index;
      
    },
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
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

    init() {
      let _this = this
      let params = {
        "busicode": "UserGarbageMSList",
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

    submitGarbage() {
      let _this = this
      var params
       params = {
        busicode: "UserGarbageMSUpdate",
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

    // closeGarbageDialog() {
    //     this.GarbageVisible = false
    //     this.ruleForm = {}
    //     this.init()
    // },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
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
<style lang="scss" scoped>
.GarbageFree {
  width: 100%;
  height: 100%;
   /deep/ {
     .el-date-editor{
       width: 180px;
      .el-input {
        .el-input__inner{
          width: 100%!important;
        }
      }
      .el-input__icon {
        line-height: 30px;
      }
   }
  
  }  
}
</style>
