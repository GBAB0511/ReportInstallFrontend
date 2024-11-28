<template>
  <div class="WaterMeterFactory">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('WaterMeterFactoryEditForm')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
    
      <div v-show="EditVisible">
        <WaterMeterFactoryEdit ref="WaterMeterFactoryEdit"></WaterMeterFactoryEdit>
      </div>

      <div  v-show="!EditVisible" class="WaterMeterFactoryIndex">
        <div class="toolbar">
            <el-form :inline="true" size="mini" class="demo-form-inline">
                <el-form-item class="form-left">
                    <el-form-item label="供应商名称：" class="">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.factoryName" clearable placeholder="供应商名称" @keyup.enter.native="search"></el-input>
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
                    highlight-current-row 
                    stripe border 
                    :data="tableData.list" 
                    class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="factoryName" min-width="100" label="供应商名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="factoryFullName" min-width="100" label="供应商全称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="factoryAddr" min-width="100" label="供应商地址" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="linkMan" min-width="100" label="联系人" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="linkTel" min-width="100" label="固定电话" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sortNo" min-width="100" label="排序号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
            </el-table-column>
            <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text" @click.native="add(scope.row)" style="font-size:12px;">编辑</el-button>
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
import WaterMeterFactoryEdit from "./WaterMeterFactoryEdit"

export default {
  components:{
      WaterMeterFactoryEdit,
  },
  name: "WaterMeterFactory",
  data() {
    return {
      EditVisible:false,//弹出表单
      formData:{
        id:'',
        factoryName:'',
        factoryFullName:'',
        factoryAddr:'',
        linkMan:'',
        linkTel:"",
        status:'',
        sortNo:'',
        comments:'',
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessArea' },
          { title: '水表配置', method: () => { window.histroy.back() } },
          { title: '水表供应商', method: () => { window.histroy.back() } }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      tableData:[
      ],
      tableQuery:{
        page:1,
        pageCount:10,
        factoryName:"",
      },
      formType:'',
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.WaterMeterFactory .WaterMeterFactoryIndex', ['.WaterMeterFactory .block','.WaterMeterFactory .toolbar'])
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
          "busicode": "MeterFactoryList",
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
          this.formType='MeterFactoryAdd'
        }else{
          this.formType='MeterFactoryUpdate'
          let params = {
              "busicode": "MeterFactoryQuery",
              "data": {
                id:val.id,
              },
          }
          this.$api.fetch({
            params: params
          }).then(res => {
            this.$refs.WaterMeterFactoryEdit.editData(res);
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
      //保存按钮
      submitForm(formName) {
        this.$refs.WaterMeterFactoryEdit.submitForm(formName,this.formType);
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
.WaterMeterFactory {
  width: 100%;
  height: 100%;
  .WaterMeterFactoryIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>

