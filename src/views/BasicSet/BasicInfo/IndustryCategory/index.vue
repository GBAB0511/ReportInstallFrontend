<template>
  <div class="industry-category">
    
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('IndustryCategoryEditForm')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>

      <div v-show="EditVisible">
          <IndustryCategoryEdit ref="IndustryCategoryEdit"></IndustryCategoryEdit>
        </div>

        <div v-show="!EditVisible" class="industry-category-right-content">
          <div class="toolbar">
              <el-form :inline="true" size="mini" class="demo-form-inline">
                  
                  <el-form-item class="form-left">

                      <el-form-item label="行业名称：" class="">
                          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.tradeName" clearable placeholder="行业名称" @keyup.enter.native="search"></el-input>
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
              center
              :data="tableData.list" 
              class="wuserInfo-table">


              <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
              </el-table-column>


              <el-table-column prop="tradeName" min-width="100"  label="行业名称">
              </el-table-column>
              <el-table-column prop="sortNo" min-width="80" label="排序号" >
              </el-table-column>
              <el-table-column prop="status" min-width="80" label="状态" >
              </el-table-column>
              <el-table-column prop="comments" min-width="200" label="备注"  show-overflow-tooltip>
              </el-table-column>

              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <el-button type="text" @click.native="add(scope.row)" style="font-size:12px;text-align:center;">编辑</el-button>
                </template>
              </el-table-column>
              
            </el-table>
            
          </div>
          <!-- 分页 -->
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
              </el-pagination>
            </div>

      </div>
  </div>
</template>
<script>
import IndustryCategoryEdit from "./IndustryCategoryEdit"

export default {
  components:{
      IndustryCategoryEdit,
  },
  name: "industry-category-index",
  data() {
    return {

      dialogFormVisible:false,//弹出表单
      formData: {
          tradeName:'',
          sortNo:'',
          status:'',
          comments:'',
        },
      crumbsData: {  //面包屑
        titleList: [
          { title: '系统设置', path: '/BusinessArea' },
          { title: '系统设置', path: '/BusinessArea' },
          { title: '行业分类', method: () => { window.histroy.back() } }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      tableData:[

      ],
      EditVisible:false,//弹出表单,
      tableQuery:{
        page:1,
        pageCount:50
      }
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.industry-category .industry-category-right-content', ['.industry-category .block','.industry-category .toolbar'])
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
          "busicode": "TradeClassifyList",
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
          this.$refs.IndustryCategoryEdit.editData({
            tradeName:'',
            sortNo:'',
            status:'',
            comments:'',
          });
          this.crumbsData.titleList.push({title:'添加',method:()=>{window.histroy.back()}});
          this.common.chargeObjectEqual(this,this.formData,'set','IndustryCategoryEdit');
        }else{
          this.crumbsData.titleList.push({title:'编辑',method:()=>{window.histroy.back()}});
          let _this = this;
          let params = {
              "busicode": "TradeClassifyQuery",
              "data": {
                tradeClassifyId:val.tradeClassifyId,
              },
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$refs.IndustryCategoryEdit.editData(res);
            this.common.chargeObjectEqual(this,res,'set','IndustryCategoryEdit');
          })
        }
        
      },
      // 列表的NO列
      indexMethod(index) {
        return (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      },
      handleSizeChange(val) { //显示多少数据一页
        this.tableQuery.pageCount = val
        this.tableQuery.page = 1
        this.init()
      },
      handleCurrentChange(val) {  //页码点击
        this.tableQuery.page = val
        this.init()
      },
      closeDialog(){
        this.crumbsData.titleList.pop();
        this.EditVisible = false;
      },
      // 返回
      handleClose() {
        
        this.$refs.IndustryCategoryEdit.handleClose();
      },
      //保存按钮
      submitForm(formName) {
        let type = this.crumbsData.titleList[3].title;
        this.$refs.IndustryCategoryEdit.submitForm(formName,type);
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
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.industry-category {
  width: 100%;
  height: 100%;
  .industry-category-right-content{
    width: 100%;
    height: calc(100% - 40px);
  }
  .kl-table {
    padding: 0px 20px;
    width: calc(100% - 40px);
    height: 100%;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  
}
</style>



