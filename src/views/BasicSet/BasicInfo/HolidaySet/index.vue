<template>
  <div class="HolidaySet">
    
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('HolidaySetEditForm')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      
      <holidaySetEdit v-show="EditVisible" ref="holidaySetEdit"></holidaySetEdit>
    
      <div v-show="!EditVisible" class="HolidaySetIndex">
        <div class="toolbar">
            <el-form :inline="true" size="mini" class="demo-form-inline width-150">
                <el-form-item class="form-left">

                    <el-form-item label="假期名称：">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.vacationName" clearable placeholder="假期名称" @keyup.enter.native="search"></el-input>
                    </el-form-item>
                    <el-form-item label="日期：">
                      <el-date-picker
                       @keyup.enter.native="search"
                        v-model="monthDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        >
                      </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        
                        <el-button class='searchBtn'  @click="search" icon="el-icon-search"></el-button>
                    </el-form-item>
                    
                </el-form-item>
            </el-form>
        </div>
        
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table 
                    v-if="tableShow" 
                    :max-height="maxHeight" 
                    stripe border 
                    :data="tableData.list" 
                    class="wuserInfo-table">

            <el-table-column type="index" label="NO." width="50"  fixed="left" :index="indexMethod">
            </el-table-column>


            <el-table-column prop="vacationName" min-width="100" label="假期名称">
            </el-table-column>

            <el-table-column prop="vacationBeginDate" min-width="100" label="假期开始日期">
            </el-table-column>
            <el-table-column prop="vacationEndDate" min-width="100" label="假期结束日期">
            </el-table-column>
            <el-table-column prop="vacationComments" min-width="200" label="假期说明" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text" @click.native="add(scope.row)" style='font-size:12px;'>编辑</el-button>
              </template>
            </el-table-column>
            
          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10,50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
      </div>
  </div>
</template>
<script>
import holidaySetEdit from "./HolidaySetEdit"
export default {
  name:"HolidaySet",
  components:{
      holidaySetEdit,
  },
  data() {
    return {
      EditVisible:false,//弹出表单
      monthDate:[],
      formData:{
        vacationName:'',
        vacationBeginDate:'',
        vacationEndDate:'',
        vacationComments:'',
      },
      tableData:[
      
      ],
      crumbsData: {  //面包屑
        titleList: [
          // { title: '系统设置', path: '/BusinessArea' },
          { title: '其他配置' },
          { title: '假期设置' }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      tableQuery:{
        page:1,
        pageCount:10,
        vacationName:"",
        vacationBeginDate:'',
        vacationEndDate:'',
      },
      formType:"",
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() ;
        }
      },
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.HolidaySet', ['.HolidaySet .block','.HolidaySet .toolbar', '.HolidaySet .bread-contain'])
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this;
      // 点击日期清除按钮monthDate值为null需要处理
      if(this.monthDate===null){
          this.monthDate = ['','']
      }
      this.tableQuery.vacationBeginDate = this.monthDate[0];
      this.tableQuery.vacationEndDate = this.monthDate[1];
      let params = {
          "busicode": "ConfigVacationList",
          "data": this.tableQuery,
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
          _this.tableData = res;
      })
    },
     // 搜索
    search(){
      this.tableQuery.page = 1;
      this.init()
    },
    // 添加按钮点击事件
      add(val) {
        // this.bankLinkShow = false;
        this.EditVisible = true;
        if(val==='add'){
          this.formType='ConfigVacationAdd'
          // this.$refs.holidaySetEdit.editData({
          //   vacationName:'',
          //   vacationBeginDate:'',
          //   vacationEndDate:'',
          //   vacationComments:'',
          // });
          // this.common.chargeObjectEqual(this,this.formData,'set','holidaySetEdit');
        }else{
          // let _this = this;
          this.formType='ConfigVacationUpdate'
          let params = {
              "busicode": "ConfigVacationQuery",
              "data": {
                id:val.id,
              },
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$refs.holidaySetEdit.editData(res);
            // this.common.chargeObjectEqual(this,res,'set','holidaySetEdit');
          })
        }
      },
      // 列表的NO列
      indexMethod(index) {
        return (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      },
      handleSizeChange(val) { //显示多少数据一页
        this.tableQuery.pageCount = val;
        this.tableQuery.page = 1;
        this.init();
      },
      handleCurrentChange(val) {  //页码点击
        this.tableQuery.page = val;
        this.init();
      },
      closeDialog(){
        // this.crumbsData.titleList.pop();
        this.EditVisible = false;
      },
      // 返回
      handleClose() {
        this.$refs.holidaySetEdit.handleClose();
      },
      //保存按钮
      submitForm() {
        this.$refs.holidaySetEdit.submitForm(this.formType);
      },
      // submitForm(formName) {
      //   let type = this.crumbsData.titleList[3].title;
      //   this.$refs.holidaySetEdit.submitForm(formName,type);
      // },
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
  .HolidaySet {
    height: 100%;
  }
</style>




