<template>
  <div class="BusinessArea">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add','')" type="primary">添加</el-button>
        </div>
      </div>
      <BusinessAreaEdit v-show="EditVisible" ref="BusinessAreaEdit" :departInfo='departInfo' :checkInfo='checkInfo'></BusinessAreaEdit>

      <div  v-show="!EditVisible" class="company-content">
        <div class="company-left">
          
          <el-row class="tac" style="width:100%;">
            <el-col :span="12">
              <el-menu >
                <el-menu-item index="1" @click="getPageIndex(1)">验收配置</el-menu-item>
                <el-menu-item index="2" @click="getPageIndex(0)">报装权限配置</el-menu-item>
              </el-menu>
              
            </el-col>
            <el-col :span="12" v-if="pageIndex==0">
              <el-menu >
                
                <template v-for="(item,index) in departInfo">
                  <el-menu-item :index="index.toString()" :key="index.toString()" @click="ShowApprovalData(item)">{{item}}</el-menu-item>
                </template>
              </el-menu>
              
            </el-col>
            <el-col :span="12" v-if="pageIndex==1">
              <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                >
                <template v-for="(item1,index1) in departInfo">
                  <el-submenu :index="index1.toString()" :key="index1">
                  <template slot="title"  >
                    <span>{{item1}}</span>
                  </template>
                  <template v-for="(item2,index2) in checkInfo">
                    <template v-for="(item3,index3) in item2.split(',')">
                      <el-menu-item @click="showData(item1,item3)" v-if="index1==index2" :index="+index1.toString()+'-'+index2.toString()+index3.toString()" :key="index1.toString()+'-'+index2.toString()+index3.toString()" >{{item3}}</el-menu-item>
                    </template>
                  </template>
                </el-submenu>
                </template>
              </el-menu>
            </el-col>
          </el-row>
        </div>
       <!-- <div class="resize" title="收缩侧边栏">
		         	⋮
		       </div> -->
        <div class="company-right" >
          <!-- <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="addRow()"
            style="float:right"
          ></el-button> -->
          <div class="kl-table" style="height:500px;overflow-y: scroll;" >
            <el-table v-if="pageIndex==1" :data="resData" :max-height="maxheight"  class="wuserInfo-table" :header-cell-style="{'text-align':'center'}"  :row-style="{height:'60px'}">
              <el-table-column prop="departBelong" min-width="100" label="验收部门"></el-table-column>
              <el-table-column prop="checkItem" min-width="100" label="验收项分类"></el-table-column>
              <el-table-column prop="checkSubitem" min-width="250" label="验收子项"></el-table-column>
              <el-table-column prop="stopFlag" min-width="100" label="是否启用">
                <template slot-scope="scope">
                  <span v-if="scope.row.stopFlag==1" style="color:black">是</span>
                  <span v-if="scope.row.stopFlag==0" style="color:black">否</span>
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" style="font-size:13px" size="mini" @click.native="add('change',scope.row)">编辑</el-button>
                  <el-button type="text" style="font-size:13px" size="mini" @click="remove(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-table v-if="pageIndex==0" :data="approvalData" class="wuserInfo-table" :header-cell-style="{'text-align':'center'}"  :row-style="{height:'60px'}">
              <el-table-column prop="departBelong" label="验收部门"></el-table-column>
              <el-table-column prop="checkStaff" label="验收人员">
                <template slot-scope="scope">
                  <span style="color:black">
                    {{scope.row.checkStaffName}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="moneyFlag" label="是否允许查看金额">
                <template slot-scope="scope">
                  <span v-if="scope.row.moneyFlag==1" style="color:black">是</span>
                  <span v-if="scope.row.moneyFlag==0" style="color:black">否</span>
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" style="font-size:13px" size="mini" @click.native="add('changeApproval',scope.row)">编辑</el-button>
                  <el-button type="text" style="font-size:13px" size="mini" @click="removeApproval(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

</template>
<script>
import BusinessAreaEdit from "./BusinessAreaEdit";
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "BusinessArea",
  components: {
    BusinessAreaEdit,
    autoTree
  },
  data() {
    return {
      pageIndex:1,
      approvalData:[],
      copyApprovalData:[],
      EditVisible: false, //弹出表单
      dictionaryData:[],//数据字典
      departInfo:[], 
      checkInfo:[], 
      resData:'',
      formData: {
        id:"",
        parentId: "0",
        areaNo: "",
        areaName: "",
        groupCode:"",
        tenantId:"",
        sortNo: "",
        status: "",
        areaComments: ""
      },
      crumbsData: {
        //面包屑
        titleList: [
          {
            title: "其他配置",
            method: () => {
              window.histroy.back();
            }
          },
          {
            title: "工程验收",
            method: () => {
              window.histroy.back();
            }
          }
        ]
      },
      treeDatas: {
        tree: [
          {
            children: [],
            id: "",
            abodeName: "全部"
          }
        ],
        defaultProps: {
          label: "name",
          children: "children"
        },
        inputProp: {
          showSearch: true,
          Inp_placeholder: "请输入节点"
        },
        sendTreeProp: [
          "id",
          "name",
          "sortNo",
          "status",
          "comments",
          "groupCode",
          "tenantId",
          "parentId",
        ],
        rootName: "根目录",
        defaultOpen: {
          nodeKey: "id"
        }
      },
      tableData: [],
      tableQuery:{
        page:1,
        pageCount:10,
        areaName:"",
        parentId:"0",
      },
      parentId: "",
      parentName:"",
      tableShow: false,
      maxHeight: 0,
      abodeName: "",
      formType:'add'
    };
  },
  mounted() {
    this.getDictionary();
    this.getTableData();
    this.getApprovalTableData();
    // this.dragControllerDiv()
    // this.init();
    // console.log(this.getTreeDatas)
    // this.$nextTick(() => {
    //   //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    //   // this.common.changeTable(this, '.business-area1 .business-area1-right-content', []);
    //   this.common.changeTable(this, ".BusinessArea .company-right", [
    //     ".BusinessArea .toolbar",
    //     ".BusinessArea .block"
    //   ]);
    //   console.log(this.maxHeight)
    // });
  },
  
  methods: {
    ShowApprovalData(name){
      this.approvalData=this.copyApprovalData
      let n=[]
      for(let i=0;i<this.approvalData.length;i++){

        if(name==this.approvalData[i].departBelong){
          n.push(this.approvalData[i])
        }
      }
      this.approvalData=n
    },
    removeApproval(data){
      var params = {
          busicode: "PjCheckTemplateStaffDelete",
          data: {
            id:data.id
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
          this.getApprovalTableData()
          })
    },
    //报装配置界面请求数据
    getApprovalTableData(){
      var params = {
          busicode: "PjCheckTemplateStaffList",
          //         "data": "MMT,UWS,CMC,RTP,CTL"
          data: {
            departBelong:''
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            // console.log(JSON.stringify(res));
            this.approvalData=res
            this.copyApprovalData=res
          })
    },
    getPageIndex(n){
      this.pageIndex=n
      // console.log('pageIndex',this.pageIndex);
    },
    showData(a,b){
      this.resData=this.tableData
      let m=[]
      for(let i=0;i<this.resData.length;i++){
        if(this.resData[i].departBelong==a&&this.resData[i].checkItem==b){
          m.push(this.resData[i])
        }
      }
      this.resData=m
    },
    remove(data){
      var params = {
          busicode: "PjCheckTemplateDelete",
          //         "data": "MMT,UWS,CMC,RTP,CTL"
          data: {
            id:data.id
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
          this.getTableData()
          })
    },
    getTableData(){
      var params = {
          busicode: "PjCheckTemplateList",
          //         "data": "MMT,UWS,CMC,RTP,CTL"
          data: {
            id:''
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.resData=res
            this.tableData=res
            this.departInfo=[]
            // console.log(JSON.stringify(this.resData));
            for(let i=0;i<this.resData.length;i++){
              //获取departBelong及其checkItem
              this.departInfo.push(this.resData[i].departBelong)
            }
            this.departInfo=this.unique(this.departInfo)
            // console.log(this.departInfo);
            let info=[]
            for(let i=0;i<this.resData.length;i++){ 
              for(let j=0;j<this.departInfo.length;j++){
                if(this.resData[i].departBelong==this.departInfo[j]){
                  // console.log(this.resData[i].checkItem);
                  if(info[j]!=undefined&&info[j]!=''){
                    info[j]=''+info[j]+','+this.resData[i].checkItem
                  }else{
                    info[j]=this.resData[i].checkItem
                  }
                  
                }
              }
            }
            for(let i=0;i<info.length;i++){
              let m=info[i].split(',')
              m=this.unique(m)
              this.checkInfo[i]=m.join(',')
            }
            // console.log(this.checkInfo);
          });
    },
    unique(arr){
		//定义一个新的临时数组 
		var newArr=[]; 
		 //遍历当前数组 
			for(var i=0;i<arr.length;i++){
			 //如果当前数组的第i已经保存进了临时数组，那么跳过，
			 //否则把当前项push到临时数组里面 
			if(newArr.indexOf(arr[i]) === -1){  //indexOf() 判断数组中有没有字符串值，如果没有则返回 -1 
				 newArr.push(arr[i]);
			}
		 }
    return newArr
	},

    // 添加按钮点击事件
      add(m,n) {
        console.log(this.departInfo);
        setTimeout(()=>{
          eventBus.$emit("AllTableConfig",{
          departInfo:this.departInfo,
          checkInfo:this.checkInfo,
          pageIndex:this.pageIndex,
        })
        },200)
        
        if(m=='change'){
          // console.log('=============');
          setTimeout(()=>{
            eventBus.$emit('changeProjectAcceptanceData',n)
            // console.log('changeProjectAcceptanceData');
          },200)
          
        }else if(m=='add'){
          if(this.pageIndex==1){
            setTimeout(()=>{
            eventBus.$emit('addProjectAcceptanceData',n)
            // console.log('addProjectAcceptanceData');
          },200)
          }else if(this.pageIndex==0){
            setTimeout(()=>{
            eventBus.$emit('addProjectApprovalData',n)
            // console.log('addProjectAcceptanceData');
          },200)
          }
          
        }else if(m=='changeApproval'){
          setTimeout(()=>{
            eventBus.$emit('changeProjectApprovalData',n)
          })
        }
        this.EditVisible = true;
      },
    //获取部门等信息
    getDictionary() {
        var _this = this;
        var params = {
          busicode: "DictionarySelect",
          //         "data": "MMT,UWS,CMC,RTP,CTL"
          data: "PROJECT_CHECK_UNIT"
          //部门
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            _this.dictionaryData = res.PROJECT_CHECK_UNIT;
            // console.log(JSON.stringify(this.dictionaryData));
          });
    },
    closeDialog() {
      this.EditVisible = false;
      // this.crumbsData.titleList.pop();
    },
    // 返回
    handleClose() {
      this.$refs.BusinessAreaEdit.handleClose();
    },
    //保存按钮
    submitForm() {
      this.$refs.BusinessAreaEdit.submitForm();
    },
  },
  watch: {
  }
};
</script>
<style lang="scss">
 /deep/.kl-table{
  width: 90% !important;
  margin-left: 10% !important;
}
/deep/.el-table {
		 border: 0;
		 th,
		 tr,
		 td{
			  border: 0;
			  background-color: #fff;
		 }
		 &::before {
			  height: 0px;
		  }
		  &::after {
			 width: 0;
		  }
		 .el-table__fixed:before {
			 height: 0;
		  }
	 } 
.company-right .el-table-column{
  background-color:red !important
}
.company-left .el-menu-item{
  background-color: unset !important; 
}
.company-left .el-menu-item:hover{
  color:rgb(64,170,255)
}
.BusinessArea {
  width: 100%;
  height: 100%;
     .company-content {
        width: 100%;
        height: 100%;
        // margin: 1% 0px;
        overflow: hidden;
        // box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
    }
    /*左侧div样式*/
    .company-left {
        width:300px;  /*左侧初始化宽度*/   
        // height: 90%;
        background: #FFFFFF;
        float: left;
        overflow-y: auto;
    }
    /*拖拽区div样式*/
    .resize {
        cursor: col-resize;
        float: left;
        position: relative;
        top: 45%;
        background-color: #d6d6d6;
        border-radius: 5px;
        margin-top: -10px;
        width: 10px;
        height: 50px;
        background-size: cover;
        background-position: center;
        /*z-index: 99999;*/
        font-size: 32px;
        color: white;
    }
    /*拖拽区鼠标悬停样式*/
    .resize:hover {
        color: #444444;
    }
    /*右侧div'样式*/
    .company-right{
        float: left;
        width: 90%;   /*右侧初始化宽度*/
        height: 100%;
        background: #fff;
        // box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
    }
  .BusinessAreaIndex {
    width: 100%;
    height: 100%;
  }
}
</style>


