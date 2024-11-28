<template>
  <div class="WorkOrderQuery">
    <div class="toolbar">
      <el-form ref="form" :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
				<!-- <el-form-item label='登记时间：' class="dateAndTime">
					<el-date-picker v-model="registerDate" @change="getDatePicker" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item> -->

				<el-form-item label='登记时间：' class="dateAndTime">
					<el-date-picker v-model="tableQuery.registerTimeStart" type="datetime" placeholder="开始日期"></el-date-picker>
					<span style="margin:0 10px">-</span>
					<el-date-picker v-model="tableQuery.registerTimeEnd" type="datetime" placeholder="结束日期"></el-date-picker>
				</el-form-item>

				 <el-form-item label="工单状态：">
					<el-select v-model="tableQuery.status" placeholder="请选择">
						<el-option value="" label="全部"></el-option>
						<el-option value="0" label="草稿"></el-option>
						<el-option value="1" label="待派单"></el-option>
						<el-option value="2" label="待接收"></el-option>
						<el-option value="3" label="待处理"></el-option>
						<el-option value="4" label="待回访"></el-option>
						<el-option value="5" label="结束"></el-option>
						<el-option value="6" label="待审批"></el-option>
						<el-option value="7" label="待归档"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模糊查询：" class="width-200">
					<el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)"  v-model="tableQuery.fuzzyQuery" placeholder="工单编号、手机号码、用户编号" @keydown.enter.native="search" class="userNo" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
				</el-form-item>
      </el-form>
    </div>
		 <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table  v-if="tableShow" highlight-current-row :max-height="maxHeight" border :data="tableData.list" class="ChargeReportOfRealReceivablesDetailed-table">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>
					<el-table-column prop="WOCode" label="工单编号" min-width="120">
          </el-table-column>
					<el-table-column prop="registerTime" label="登记时间" min-width="170">
          </el-table-column>
					<el-table-column prop="registerName" label="登记人" min-width="120">
          </el-table-column>
					<el-table-column prop="bizType" label="服务分类" min-width="200">
          </el-table-column>
					<el-table-column prop="occurAddress" label="发生地址" min-width="300" show-overflow-tooltip	>
          </el-table-column>
					<el-table-column prop="detailDescription" label="服务描述" min-width="120">
          </el-table-column>
					<el-table-column prop="statusName" label="工单状态" min-width="120">
          </el-table-column>
					<el-table-column prop="currentProcessBy" label="当前处理人" min-width="120">
          </el-table-column>
					<el-table-column prop="processOpinion" label="处理结果" min-width="120">
          </el-table-column>
					<el-table-column prop="finalHandler" label="处理人" min-width="120">
          </el-table-column>
					<el-table-column prop="infoSourceName" label="工单来源" min-width="120">
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
			<div class="block">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
			</div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: "WorkOrderQuery",
  components: {
  },
  data() {
		return{
			registerDate: [],
			Time: [],
			tableQuery: {
        page: 1,
        pageCount: 20,
				groupCode: localStorage.getItem('companyNo'),
				registerBy: sessionStorage.getItem('account'),
				registerTimeStart: '',
				registerTimeEnd: '',
				status: '',
      },
			tableData: {},
      tableShow: false,
      maxHeight: 0,
		}
  },
  mounted() {
		let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(),month,0).getDate();
    this.registerDate = [time.getFullYear() +"-"+ month+'-01' + ' ' + "00:00:00", time.getFullYear() +"-"+ month +"-"+ lastDay+ ' ' + "23:59:59"];
		this.Time = [time.getFullYear() +"-"+ month+'-01' + ' ' + "00:00:00", time.getFullYear() +"-"+ month +"-"+ lastDay+ ' ' + "23:59:59"];
		this.tableQuery.registerTimeStart = time.getFullYear() +"-"+ month+'-01' + ' ' + "00:00:00"
		this.tableQuery.registerTimeEnd = time.getFullYear() +"-"+ month +"-"+ lastDay+ ' ' + "23:59:59"
		this.init()
    this.common.changeTable(this, ".WorkOrderQuery", [
      ".WorkOrderQuery .toolbar",
      ".WorkOrderQuery .block",
    ]);

  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
		// 列表初始化
    init() {
      let _this = this;
      let temQuery = JSON.parse(JSON.stringify(this.tableQuery))
      let params = {
        busicode: "WorkOrderDetailList",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
				this.tableData = res
      })
    },

    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
		// 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.registerTimeStart = date[0]
        this.tableQuery.registerTimeEnd = date[1]
      } else {
        this.tableQuery.registerTimeStart = ''
        this.tableQuery.registerTimeEnd = ''
      }
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
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
  },
	watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
		// Time(val) {
    //   if(val && val.length > 0) {
    //     this.tableQuery.registerTimeStart = val[0]
    //     this.tableQuery.registerTimeEnd = val[1]
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.WorkOrderQuery {
  width: 100%;
  height: 100%;
	/deep/{
		.dateAndTime .el-form-item__content{
			display: inline-flex;
		}
	}

}
</style>
