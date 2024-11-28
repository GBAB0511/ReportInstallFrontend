


<template>
  <div class="Findings">
    <!-- 弹出表单增加 -->
    <el-dialog class="common-dialog" :title="FindingsName" :close-on-click-modal="false" v-if="FindingsVisible" :visible.sync="FindingsVisible">
      <PreviewQuestionnaire ref="PreviewQuestionnaire" :Question="Question.list"></PreviewQuestionnaire>
    </el-dialog>
    <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

        <el-form-item class="form-left">
          <el-form-item label='日期：'>
            <el-date-picker v-model="DateChoosevalue" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="答卷渠道：">
            <el-select ref="select1" v-model="tableQuery.answerChannel" clearable placeholder="请选择" >
              <el-option v-for="(item,index) in anwerType" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="问卷主题/答卷人" @keydown.enter.native="demand"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form-item>
        <el-form-item class="form-right">
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="questTheme" min-width="80" label="问卷主题">

        </el-table-column>

        <el-table-column prop="answerMan" min-width="100" label="答卷人">
        </el-table-column>

        <el-table-column prop="linkTel" min-width="100" label="联系方式">
        </el-table-column>

        <el-table-column prop="answerScore" min-width="120" label="答卷分数">
        </el-table-column>

        <el-table-column prop="answerTime" min-width="120" label="答卷时间">
        </el-table-column>

        <el-table-column prop="answerChannelName" min-width="80" label="答卷渠道">
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="details(scope.$index, scope.row)">答卷明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      
    </div>
    <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="tableQuery.page" 
            :page-sizes="[20, 100, 500, 1000]" 
            :page-size="tableQuery.pageCount" 
            layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
      </div>

  </div>
</template>
<script>
import FindingsEdit from "./FindingsEdit";
import PreviewQuestionnaire from "./PreviewQuestionnaire";
export default {
  name: "Findings",
  components: {
    FindingsEdit,
    PreviewQuestionnaire,
  },
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "服务中心", path: "/ServiceCentre" },
          {
            title: "问卷调查",
            method: () => {
              window.histroy.back();
            }
          },
          {
            title: "调查结果",
            method: () => {
              window.histroy.back();
            }
          }
        ]
      },
      formData: {
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      FindingsVisible: false,
      FindingsName: "调查结果-答卷明细",
      tableData:[],
      anwerType:[
        { value: "1", name: "微信营业厅" },
        { value: "2", name: "网上营业厅" },
        { value: "3", name: "其它" },
      ],
      tableQuery:{
        page: 1,//当前页码
        pageCount: 20,//当前页展示多少条数据
        beginDate:"",
        endDate:"",
        answerChannel:"",
        fuzzyQuery:"",
      },
      Question:{},
    };
  },
  mounted() {
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
          this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".Findings", [
          ".Findings .bread-contain",
          ".Findings .toolbar",
          ".Findings .block",
        ]);
      });
  },
  methods: {
       enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let params = {
        "busicode": "QuestResultList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        console.log(res)
        this.tableData=res;

      })
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    demand() {
      //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init();
    },
    //   导出
    exportExcel() {
      //   	let listData = {}
      //   	this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
      //     let params ={
      //       "busicode":"MeterReadingList",
      //       "data": this.tableQuery
      //     }
      //     this.$api.fetch({
      //       apiUrl: 'interface.api',//路径
      //       method: 'post',//请求方法
      //       params:params,//参数
      //       needErrorCallback:true
      //     }).then(res =>{
      //     	if(res.code===0){
      //         listData = res.data
      //         if (!listData.list[0]) {
      //         		this.$notify({
      //               title: '警告',
      //               message:'表格没有相关数据',
      //               type: 'error'
      //             })
      //         	} else {
      //         		import('@/vendor/Export2Excel').then(excel => {
      // 			        const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
      // 			        const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
      // 			        const list = listData.list
      // 			        const data = this.formatJson(filterVal, list)
      // 			        excel.export_json_to_excel({
      // 			          header: tHeader,
      // 			          data,
      // 			          filename: this.tableQuery.daytime + '抄表数据',
      // 			          autoWidth: '100'
      // 			        })
      // 			      })
      //         		this.tableQuery.pageCount = 20
      //         	}
      //       }
      //     })
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
      this.tableQuery.page = val
      this.init();
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
    },
    add() {},
    closeDialog() {
      //关闭会话
      this.FindingsVisible = false;
      this.backfillVisible = false;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childFindings.submit();
      // this.FindingsVisible = false;
    },
    details(index,row) {
      let params = {
          "busicode": "QuestResultDetail",
          "data": {"id":row.questId}
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.Question=res;
        })
      this.FindingsVisible = true;
    }
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
<style lang="scss" scoped>
.Findings {
  padding: 20px;
  height:100%;
}
</style>