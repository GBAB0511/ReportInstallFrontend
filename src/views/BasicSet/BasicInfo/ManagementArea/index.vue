<template>
  <div>
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('ManagementAreaEdit')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      <div v-show="EditVisible">
        <ManagementAreaEdit ref="ManagementAreaEdit"></ManagementAreaEdit>
      </div>
      
      <div  v-show="!EditVisible" class="company-content">
        <div class="company-left">
          <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
        </div>
        <div class="company-right">
     
           <el-table 
              stripe
              border 
              :data="tableData" 
              v-if="tableShow" 
              :max-height="maxHeight" 
              class="wuserInfo-table">

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="areaName" min-width="200" label="区域名称"> </el-table-column>
            <el-table-column prop="sortNo" min-width="80" label="排序号">
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
            </el-table-column>

            <el-table-column prop="areaComments" min-width="150" label="备注" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button type="text" @click.native="add(scope.row)" style="font-size:12px;text-align:center;">编辑</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>

        </div>
      </div>

</template>
<script>
import ManagementAreaEdit from "./ManagementAreaEdit"
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "management-area-index",
  components:{
      ManagementAreaEdit,
      autoTree
  },
  data() {
    return {
      EditVisible:false,//弹出表单
      formData: {
        areaName:'',
        sortNo:'',
        status:'',
        areaComments:"",
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessArea' },
          { title: '区域配置', method: () => { window.histroy.back() } },
          { title: '营业区域', method: () => { window.histroy.back() } }
        ],
      },
      treeDatas: {
        tree: [
          { 
            shortName: '根目录', 
            id: '2', 
            children: [
            ] 
          }
        ],
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: '请输入节点'
        },
        sendTreeProp: ['code', 'name', 'districtArr', 'children', 'id', 'group', 'isLeaf','isParent','parent','sonData'],
        rootName: '根目录',
        defaultOpen: {
          nodeKey: 'id',
          // nodeItem:164
        }
      },
      tableData:[
      ],
      parentId:"",
      maxHeight: 0,
      tableShow: false,
      areaNo:"",
      treeParantId:"",
    }
  }, 
  mounted() {
    this.getTreeDatas();
    
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.business-area1 .business-area1-right-content', []);
    })
  },
  methods: {
    // 添加按钮点击事件
      add(val) {
        this.EditVisible = true;
        if(val==='add'){
            this.$refs.ManagementAreaEdit.editData({
              areaName:'',
              sortNo:'',
              status:'',
              areaComments:"",
            });
          this.$set(this.crumbsData.titleList,"4",{title:'添加',method:()=>{window.histroy.back()}});
          this.common.chargeObjectEqual(this,this.formData,'set','ManagementAreaEdit');
        }else{
            this.$set(this.crumbsData.titleList,"4",{title:'编辑',method:()=>{window.histroy.back()}});
            let _this = this;
            let params = {
                "busicode": "ManageAreaQuery",
                "data": {
                  manageAreaId:val.manageAreaId,
                },
            }
            this.$api.fetch({
              params: params,//参数
            }).then(res => {
              this.$refs.ManagementAreaEdit.editData(res);
              this.common.chargeObjectEqual(this,res,'set','ManagementAreaEdit');
            })
        }
        
      },
      // 列表的NO列
      indexMethod(index) {
        return index+1 ;
      },
      init() {
        let _this = this;
        
        let params = {
            "busicode": "ManageAreaList",
            "data": {areaNo:this.areaNo},
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
            _this.tableData = res.pageInfo.list;      
          
          
        })
       
      },
      // 获取树的数据
      getTreeDatas(){
        let _this = this
        let params = {
          "busicode": "ManageAreaTree",
          "data": {},
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.treeDatas.tree = res;
          _this.areaNo = res.code;
          _this.treeParantId = res.id;
          _this.$set(_this.crumbsData.titleList,"3",{title:res.name,method:()=>{window.histroy.back()}});
          _this.init();
        })
      },
      closeDialog(){
        this.EditVisible = false;
        // this.crumbsData.titleList.pop();
      },
      // 返回
      handleClose() {
        
        this.$refs.ManagementAreaEdit.handleClose();
      },
      // 树的点击
      backTreeData(val) { 
        let _this = this;
        this.treeParantId = val.id;
        this.areaNo = val.code;
        // this.$set(this.crumbsData.titleList,"3",{title:val.name,method:()=>{window.histroy.back()}});
        let params = {
            "busicode": "ManageAreaList",
            "data":  {areaNo:this.areaNo},
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {

          _this.tableData = res.pageInfo.list; 

        })
      },
      //保存按钮
      submitForm(formName) {
        let type = this.crumbsData.titleList[4].title;
        this.$refs.ManagementAreaEdit.submitForm(formName,type,this.treeParantId);
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

