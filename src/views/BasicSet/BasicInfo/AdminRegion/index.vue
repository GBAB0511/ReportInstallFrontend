<template>
  <div class="admin-region">
    
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('AdminRegionEditForm')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      
      <div v-show="EditVisible">
        <AdminRegionEdit ref="AdminRegionEdit"></AdminRegionEdit>
      </div>
       

      <div v-show="!EditVisible" class="admin-region-right-content">
        <div class="kr-right">
          <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
        </div>
        <div class="kr-left">
          <el-table 
            v-if="tableShow" 
            :max-height="maxHeight" 
            stripe border 
            :data="tableData" 
            class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod"> </el-table-column>
            <el-table-column prop="areaLevel" min-width="80" label="上级区域"> </el-table-column>
            <el-table-column prop="areaNo" min-width="70" label="区域编号"> </el-table-column>
            <el-table-column prop="areaName" min-width="200" label="区域名称"> </el-table-column>
            <el-table-column prop="sortNo" min-width="80" label="排序号">
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态"> </el-table-column>
            
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text" @click.native="add(scope.$index, scope.row)" style="font-size:12px;text-align:center;">编辑</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
  </div>
</template>
<script>
import AdminRegionEdit from "./AdminRegionEdit"
import autoTree from '@/components/companyTree/autoTree'
export default {
  components:{
      AdminRegionEdit,
      autoTree
  },

  name: "admin-region-index",
  data() {
    return {
      EditVisible:false,//弹出表单
      formData: {
          areaNo:'',
          areaName:'',
          sortNo:'',
          status:'',
        },
      crumbsData: {  //面包屑
        titleList: [
          { title: '基础信息', path: '/BusinessArea' },
          { title: '区域配置', method: () => { window.histroy.back() } },
          { title: '行政区域', method: () => { window.histroy.back() } }
        ],
      },
      
      maxHeight: 0,
      tableShow: false,
      treeDatas: {
        tree: [
          { 
            shortName: '根目录', 
            id: '2', 
            children: [
              { 
                shortName: '广东省', 
                id: '22', 
                children: [
                  { shortName: '深圳市', id: '222' }, 
                  { shortName: '广州市', id: '222' }, 
                  { shortName: '东莞市', id: '222' }, 
                  { shortName: '惠州市', id: '222' }
                ] 
              }
            ] 
          }
        ],
        defaultProps: {
          label: 'shortName',
          children: 'children'
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: '请输入节点'
        },
        sendTreeProp: ['code', 'shortName', 'districtArr', 'children', 'companyNo', 'group', 'isLeaf','isParent','parent','sonData'],
        rootName: '根目录',
        defaultOpen: {
          nodeKey: 'id',
          // nodeItem:164
        }
      },
      tableData:[
        {
          areaName:'南沙街道',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'珠江街道',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'龙穴街道',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'万顷街道',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'黄阁镇',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'横沥镇',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'东涌镇',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'大岗镇',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName:'榄核镇',
          areaCode:'01',
          areaState:'启用',
          areaLevel:'南沙区',
          areaDesc:"城区客服营收系统已启用",
          id: null,
          page: 1,
          pageCount: 20,
        },
      ],
      treeParantId:"",
    }
  },
  mounted() {
    // this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.admin-region .admin-region-right-content', [])
    })
  },
  methods: {
    // 添加按钮点击事件
      add(val) {
        this.EditVisible = true;
        if(val==='add'){
            this.$refs.AdminRegionEdit.editData({
              areaNo:'',
              areaName:'',
              sortNo:'',
              status:'',
            });
          this.$set(this.crumbsData.titleList,"3",{title:'添加',method:()=>{window.histroy.back()}});
          this.common.chargeObjectEqual(this,this.formData,'set','AdminRegionEdit');
        }else{
            this.$set(this.crumbsData.titleList,"3",{title:'编辑',method:()=>{window.histroy.back()}});
            let _this = this;
            let params = {
                "busicode": "BankInterfaceConfigQuery",
                "data": {
                  configId:val.row.configId,
                  companyNo:this.companyNo
                },
            }
            this.$api.fetch({
              params: params,//参数
            }).then(res => {
              this.$refs.AdminRegionEdit.editData(res);
              this.common.chargeObjectEqual(this,res,'set','AdminRegionEdit');
            })
        }
        
      },
      // 列表的NO列
      indexMethod(index) {
        return index+1 ;
      },
      init() {
        let _this = this;
        
        // let params = {
        //     "busicode": "BankInterfaceConfigList",
        //     "data": {companyNo:this.companyNo},
        // }
        // this.$api.fetch({
        //   params: params,//参数
        // }).then(res => {
        //     _this.tableData = res      
          
          
        // })
       
      },
      // 获取树的数据
      getTreeDatas(){
        let _this = this
        let params = {
          "busicode": "CompanyNameList",
          "data": {},
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.treeDatas.tree[0].children = res;
          _this.companyNo = res[0].companyNo;
        })
      },
      closeDialog(){
        this.EditVisible = false;
        this.crumbsData.titleList.pop();
      },
      // 返回
      handleClose() {
        
        this.$refs.AdminRegionEdit.handleClose();
      },
      // 树的点击
      backTreeData(val) { 
        // let _this = this;
        // this.treeParantId = val.id;
        // this.companyNo = val.companyNo;
        // this.$set(this.crumbsData.titleList,"2",{title:val.shortName,method:()=>{window.histroy.back()}});
        // let params = {
        //     "busicode": "BankInterfaceConfigList",
        //     "data":  {companyNo:this.companyNo},
        // }
        // this.$api.fetch({
        //   params: params,//参数
        // }).then(res => {

        //   _this.appServerData = res;

        // })
      },
      //保存按钮
      submitForm(formName) {
        let type = this.crumbsData.titleList[3].title;
        this.$refs.AdminRegionEdit.submitForm(formName,type,this.companyNo);
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
.admin-region {
    height: 100%;
  .admin-region-right-content {
    height: calc(100% - 41px);
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    .kr-right{
      width: 20%;
      height: 100%;
      // border: 2px solid red;
    }
    .kr-left{
      width: 80%;
      height: 100%;
      padding-left:1rem;
      padding-right:1rem;
    }
  }
  .btn-area{
    div{
      width: 100%;
      float: right;
      .el-button{
        float: right;
      }
    }
  }
}
</style>

