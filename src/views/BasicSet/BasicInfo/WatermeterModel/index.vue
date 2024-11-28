<template>
  <div class="WatermeterModel">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      <WatermeterModelEdit v-if="EditVisible" ref="WatermeterModelEdit"></WatermeterModelEdit>
      <div v-else class="WatermeterModelIndex">
        <div class="toolbar">
            <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                <el-form-item class="form-left">
                    <el-form-item label="型号名称：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.modelName" clearable placeholder="型号名称" 
                       @keyup.enter.native="search">
                      </el-input>
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
            highlight-current-row
            :data="tableData.list" 
            class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="modelName" min-width="100" label="型号名称" show-overflow-tooltip>
            </el-table-column>
           <!-- <el-table-column prop="meterType" min-width="100" label="水表型式" show-overflow-tooltip>
            </el-table-column>-->
            <el-table-column prop="transWay" min-width="100" label="传输方式" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="meterSensor" min-width="100" label="水表传感器" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sortNo" min-width="100" label="排序号">
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
            </el-table-column>
            <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <!-- style="font-size:12px;" -->
                <el-button type="text" size="mini" @click.native="add(scope.row)">编辑</el-button>
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
import WatermeterModelEdit from "./WatermeterModelEdit"
export default {
  components:{
      WatermeterModelEdit,
  },
  name: "WatermeterModel",
  data() {
    return {
      EditVisible:false,//弹出表单
      formData:{
        id:"",
        modelName: "",
        meterType: "",
        transWay: "",
        meterSensor:"",
        comments:"",
        status:"",
        sortNo:"",
        tenantId:"",
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '水表配置', method: () => { window.histroy.back() } },
          { title: '水表型号', method: () => { window.histroy.back() } }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      tableData:[
      ],
      tableQuery:{
        page:1,
        pageCount:10,
        modelName:"",
      },
      formType:"",
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow2')
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.WatermeterModel .wWatermeterModelIndex', ['.WatermeterModel .block','.WatermeterModel .toolbar'])
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
      let _this = this
      let params = {
          "busicode": "MeterModelList",
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
        this.EditVisible = true;
        if(val==='add'){
          this.formType="MeterModelAdd"
        }else{
          this.formType="MeterModelUpdate"
          let params = {
            "busicode": "MeterModelQuery",
            "data": { id:val.id, },
          }
          this.$api.fetch({ params: params }).then(res => {
            this.$refs.WatermeterModelEdit.editData(res);
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
        this.EditVisible = false;
      },
      //保存按钮
      submitForm() {
        this.$refs.WatermeterModelEdit.submitForm(this.formType);
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
.WatermeterModel {
  width: 100%;
  height: 100%;
  .WatermeterModelIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>
