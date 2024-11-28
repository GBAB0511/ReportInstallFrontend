<template>
  <div class="businessBranch">
        
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('BusinessBranchEditForm')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      
      <BusinessBranchEdit v-show="EditVisible" ref="BusinessBranchEdit"></BusinessBranchEdit>

      <div class="businessBranchIndex" v-show="!EditVisible">
        <div class="toolbar"><el-form :inline="true" size="mini" :model="formData" class="demo-form-inline" @submit.native.prevent>
                  <el-form-item class="form-left">

                    <el-form-item label="营业网点名称：" class="width-200">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                        v-model="tableQuery.branchName"
                        @keyup.enter.native="search"
                        placeholder="营业网点名称"
                        @input="e => input = inputMe(e)"
                      >
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
            highlight-current-row 
            stripe border 
            :data="tableData.list" 
            class="wuserInfo-table">

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            
            <el-table-column prop="branchNo" width="80" label="网点编号">
            </el-table-column>

            <el-table-column prop="branchName"  width="120" label="网点名称">
            </el-table-column>

            
            <el-table-column prop="branchAddr"  label="网点地址" > 
            </el-table-column>

            <el-table-column prop="branchOpsition" width="150" label="网点坐标">
            </el-table-column>
            <el-table-column prop="telephone" width="150" label="联系电话">
            </el-table-column>
            <el-table-column prop="businessTime" width="120" label="营业时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sortNo" width="70" label="排序号">
            </el-table-column>

            <el-table-column prop="status" width="60" label="状态">
            </el-table-column>

            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <!-- style="font-size:12px;text-align:center;" -->
                <el-button type="text" size="mini" @click.native="add(scope)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange"
             @current-change="handleCurrentChange" 
             :current-page="tableQuery.page" :page-sizes="[10, 50, 100, 500, 1000]" 
             :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
      
      </div>

  </div>
</template>
<script>
import BusinessBranchEdit from "./BusinessBranchEdit"

export default {
  name: "businessBranch",
  components:{
      BusinessBranchEdit,
  },
  data() {
    return {
      tableData:[],
      EditVisible:false,//弹出表单
      tableQuery:{
        page:1,
        pageCount:10,
        branchName:"",
      },
      formData: {
        branchNo:'',
        branchName:'',
        branchOpsition:'',
        branchAddr:'',
        telephone:"",
        businessTime:"",
        groupCode:"",
        tenantId:"",
        status:'',
        comments:'',
        sortNo:"",
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessBranch' },
          { title: '区域配置', method: () => { window.histroy.back() } },
          { title: '营业网点', method: () => { window.histroy.back() } }
        ],
      },
      
      maxHeight: 0,
      tableShow: false,
    }
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow1')
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".businessBranchIndex", [
            ".businessBranchIndex .toolbar",
            ".businessBranchIndex .block",
          ]);
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
          "busicode": "BusinessBranchList",
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
          this.$refs.BusinessBranchEdit.editData({
            branchNo:'',
            branchName:'',
            branchOpsition:'',
            branchAddr:'',
            telephone:"",
            businessTime:"",
            status:1,
            comments:'',
            sortNo:"",
          });
          this.common.chargeObjectEqual(this,this.formData,'set','BusinessBranchEdit');
        }else{
          let _this = this;
          let params = {
              "busicode": "BusinessBranchQuery",
              "data": {
                id:val.row.id,
              },
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$refs.BusinessBranchEdit.editData(res);
            this.common.chargeObjectEqual(this,res,'set','BusinessBranchEdit');
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
        
        this.$refs.BusinessBranchEdit.handleClose();
      },
      //保存按钮
      submitForm(formName) {
        this.$refs.BusinessBranchEdit.submitForm(formName);
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
.businessBranch {
  width: 100%;
  height: 100%;
  .businessBranchIndex{
  width: 100%;
  height: calc(100% - 41px);

  }
}
</style>

