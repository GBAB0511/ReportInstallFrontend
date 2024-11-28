<template>
  <div class="accountInfo">
    <el-form
      :inline="true"
      size="mini"
      :model="tableQuery"
      class="demo-form-inline"
    >
      <!-- <el-form-item label="结构化地址：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.clientContractAddr" placeholder="装表地址"></el-input>
            </el-form-item> -->
      <el-form-item label="模糊查询：">
        <el-tooltip
          class="item"
          effect="dark"
          content="集中器编号、集中器名称"
          placement="top"
        >
          <el-input
            v-model="tableQuery.fuzzyQuery"
            clearable
            size="mini"
            @keydown.enter.native="search"
            @input="e => input = inputMe(e)"
          ></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button
          class="searchBtn"
          @click="demand"
          icon="el-icon-search"
        ></el-button>
      </el-form-item>
    </el-form>

    <div class="kl-table">
      <el-table
        stripe
        border
        :data="concentratorData"
        @selection-change="handleSelectionChange"
        highlight-current-row
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
 <el-table-column label="选择"  width="50"  fixed="left">
	<template slot-scope="scope">
		<el-radio v-model="radio" :label="scope.$index" 
		@change.native="radioChange(scope.row, scope.$index)"
		>&nbsp;
		</el-radio>
	</template>
</el-table-column>
        <el-table-column
          type="index"
          label="NO."
          width="50"
          fixed="left"
          :index="indexMethod"
        >
        </el-table-column>

        <el-table-column prop="code" min-width="180" label="集中器编号">
        </el-table-column>

        <el-table-column prop="address" min-width="180" label="集中器地址">
        </el-table-column>

        <el-table-column prop="modelName" min-width="100" label="集中器名称">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="block">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="1"
                        :page-sizes="[20, 100, 500, 1000]"
                        :page-size="20"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="concentratorData.total">
                    </el-pagination>
                </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "concentratorInfo",
  props:["concentratorQuery"],
  data() {
    return {
      radio: '',
	    radioSelect: '',//选中的数据赋值给它 
      tableQuery: {
        fuzzyQuery: "",
        clientContractAddr: "",
      },
      concentratorData: [],
      selectData:[],
    };
  },
  mounted() {
      this.init()
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
        console.log('88888',this.concentratorQuery)
        // this.concentratorData = val
    
            // this.tableQuery.fuzzyQuery = val.fuzzyQuery
            // this.tableQuery.adminArea = val.adminArea
            this.tableQuery = this.concentratorQuery
    
          let params = {
        busicode: 'ConcentratorSelect',
            data: this.tableQuery
        };
       this.$api.fetch({ params }).then((res) => {
            this.concentratorData = res
            console.log(this.concentratorData)
         }).catch((res)=>{
           this.concentratorData = []
         })
    },
    	radioChange(row, index) {
		this.radioSelect = row;
	},
    closeDialog() {
      //关闭会话
      this.waterChoooseVisible = false;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterChoooseVisible = false;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return   (1 - 1) * 20 + (index + 1);
    },
    handleSelectionChange(val){
        console.log('12121',val)
     this.selectData = val
    },
    demand(){
     this.init()
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.accountInfo {
  padding: 10px;
  width: calc(100% - 20px);
  .kl-table {
    padding: 0px;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
}
</style>
