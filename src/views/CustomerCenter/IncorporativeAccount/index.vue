<template>
  <!-- 并户 -->
  <div class="IncorporativeAccount">

    <div v-if="indexShow" class='indexPage' style="height:100%">

      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <el-button icon="el-icon-plus" size="mini" type="primary" @click.native="add">并户</el-button>
        </div>
      </div>
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

            <el-form-item label='单据日期：'>
              <el-date-picker v-model="billTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态：">
              <el-select ref="select1" clearable v-model="tableQuery.processState" placeholder="">
                <el-option v-for="(item,index) in processStateData" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="主客户编号：">
              <el-tooltip class="item"  content="主客户编号" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.mainCtmCode" clearable size="mini"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="制单人：" >
              <el-tooltip class="item"  content="制单人" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.createName" clearable size="mini" ></el-input>
              </el-tooltip>
            </el-form-item>
            
             <el-form-item label="证件号码：" >
              <el-tooltip class="item certNo"  content="制单人" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.certNo" clearable size="mini" ></el-input>
              </el-tooltip>
            </el-form-item>


            <el-form-item>
              <el-button class="searchBtn" icon="el-icon-search" @click="search"></el-button>
            </el-form-item>
      
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50"  fixed="left">
          </el-table-column>

          <el-table-column prop="processName" min-width="60" label="状态"></el-table-column>

          <el-table-column prop="stateName" min-width="70" label="进度"></el-table-column>

          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="billNo" min-width="120" label="单据编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="200" label="单据日期">
          </el-table-column>

          <el-table-column prop="mainCtmCode" min-width="130" label="主客户编号" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="mainCtmName" min-width="200" label="主客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="createName" min-width="100" label="制单人" show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" fixed="right" >
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination v-if="pageShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          >
          </el-pagination>
        </div>
    </div>

    <div v-else style="height:100%">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <!-- <el-button type="primary" size="mini" v-if="buttomShow" @click="submit(status)">暂 存</el-button> -->
          <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
        </div>
      </div>
      <IncorporativeAccountDetail  v-if="!indexShow" ref="childList" :billStute="status" :billNo="billNo" :id="id"></IncorporativeAccountDetail>
    </div>
  </div>
</template>
<script>
import IncorporativeAccountDetail from './IncorporativeAccountDetail'
export default {
  name: "IncorporativeAccount",
  components: {
    IncorporativeAccountDetail
  },
  data() {
    return {
      pageShow:true,//分页页码显示
      id:"",
      billNo: "",//详情主键id
      status: 'Add',//添加add 修改update

      indexShow: true,
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户管理' },
          { title: '并户' },
        ],

      },
      processStateData:this.common.processState(),
      billTime: ['',''],//单据日期
      //审批状态下拉框
      tableQuery: {
        page: 1,
        pageCount: 20,
        startTime: '',
        endTime: '',
        createName:'',
        certNo:"",
        mainCtmCode:'',
        processState: '',
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
   
      buttomShow: true,//保存按钮是否展示
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  mounted() {
    this.init();
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
     
      let _this = this
      this.pageShow=false;
      if (!_this.billTime ) {
        _this.tableQuery.startTime = '';
        _this.tableQuery.endTime = '';
      } else {
        _this.tableQuery.startTime = _this.billTime[0];
        _this.tableQuery.endTime = _this.billTime[1];
      }
      let params = {
        "busicode": "UserInfoMergeList",
        "data": _this.tableQuery,
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res;
        this.pageShow=true;
        })
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.$nextTick(() => {
        this.common.changeTable(this, '.IncorporativeAccount .indexPage', 
        ['.indexPage .toolbar', '.indexPage .block', '.indexPage .bread-contain'])
        })
    },
    search() {  //查询
 
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init()
    },
    indexMethod(index) {//获取表格序号
      return index
    },
    //分页
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
      }
      this.init();
    },
    closeDialog() { //关闭会话
 
      this.indexShow = true;
      this.init()
    },
    submit(type){
      this.$refs.childList.save(type);
    },
    //添加
    add() {
      this.billNo = '';
      this.id = '';
      this.status = 'Add';
  
      this.indexShow = false;
      this.buttomShow = true;
    },
    // 编辑
    details(row) {
      
      this.status = 'Update';
      this.billNo = row.billNo;
       this.id = row.id;
      this.indexShow = false;
      if (
         row.processName == "结束" ||
        row.processName == "审批" ||
        row.processName == "进行中" ||
        row.processName == "已办结" ||
        row.processName == '已废弃'
      ) {
        this.buttomShow = false;
        
      } else {
        this.buttomShow = true;
   
      }
    }
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
  .IncorporativeAccount {
    height: 93%!important;
     .certNo {
      width: 180px !important;
      /deep/ {
        .el-input__inner {
        width: 100%;
      }
      }
    }
  }
</style>