<template>
  <div class="WeekdaySet">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="submitForm('WeekdaySetEditForm')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div> 
    <weekdaySetEdit v-if="EditVisible" ref="weekdaySetEdit"></weekdaySetEdit>
    <div v-show="!EditVisible">
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData" class="wuserInfo-table">
          <el-table-column type="index" label="NO." width="50"  fixed="left" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="weekdayName" min-width="100" label="工作日名称">
          </el-table-column>
          <el-table-column prop="months" min-width="150" label="工作月份">
            <template slot-scope="scope">
              <span style="color:black;" v-for="(item,index) in scope.row.months" :key="index">
                {{mdToChinese(item - 1)}}月{{(index >= 1 && index == scope.row.months.length - 1) ||(scope.row.months.length == 1)? "" : '、'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="80" label="上午工作时间">
            <template slot-scope="scope">
              {{scope.row.morningBeginDate}} ~ {{scope.row.morningEndDate}}
            </template>
          </el-table-column>
          <el-table-column prop="afternoonWorkingHours" min-width="80" label="下午工作时间">
            <template slot-scope="scope">
              {{scope.row.afternoonBeginDate}} ~ {{scope.row.afternoonEndDate}}
            </template>
          </el-table-column>
          <el-table-column prop="comment" min-width="150" label="工作日说明" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <el-button type="text" @click.native="add(scope.row)" style='font-size:12px;'>编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import weekdaySetEdit from "./WeekdaySetEdit"
export default {
  name:"WeekdaySet",
  components:{
    weekdaySetEdit,
  },
  data() {
    return {
      EditVisible:false,//弹出表单
      tableData:[],
      crumbsData: { //面包屑
        titleList: [
          { title: '其他配置' },
          { title: '工作日配置' }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      formType:"",
      rowData: "",
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.WeekdaySet', ['.WeekdaySet .block','.WeekdaySet .toolbar', '.WeekdaySet .bread-contain'])
    })
  },
  methods: {
    init() {
      let _this = this;
      let params = {
        "busicode": "PjWeekdayConfigurationList",
        "data": {},
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    mdToChinese(number) {
      var chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十','十一','十二'];
      return chineseNumbers[number];
    },
    // 添加按钮点击事件
    add(val) {
      this.EditVisible = true;
      this.rowData = val;
      if(val === 'add'){
        this.formType = 'PjWeekdayConfigurationAdd';
        this.common.chargeObjectEqual(this,{
          id: "",
          weekdayName: "",
          months: [],
          morningBeginDate: "09:00",
          morningEndDate: "12:00",
          afternoonBeginDate: "14:00",
          afternoonEndDate: "18:00",
          comment: "",
        },'set','WeekdaySetEdit');
      }else{
        this.common.chargeObjectEqual(this, this.rowData, 'set', 'WeekdaySetEdit');//这个是用来判断内容是否有发生改变的
      }
    },
    // 列表的NO列
    indexMethod(index) {
      return (index + 1) ;
    },
    closeDialog(){
      this.EditVisible = false;
    },
    // 返回
    handleClose() {
      this.$refs.weekdaySetEdit.handleClose();
    },
    //保存按钮
    submitForm() {
      this.$refs.weekdaySetEdit.submitForm(this.formType);
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
  .WeekdaySet {
    height: 100%;
  }
</style>




