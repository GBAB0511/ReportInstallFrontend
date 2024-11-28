<template>
  <div class="BusinessArea">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('BusinessAreaEdit')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      
      <BusinessAreaEdit v-show="EditVisible" ref="BusinessAreaEdit"></BusinessAreaEdit>

      <div  v-show="!EditVisible" class="company-content">
        <div class="company-left">
          <auto-tree :treeData="treeDatas" @sendTreeData="backAbodeData"></auto-tree>
        </div>
       <div class="resize" title="收缩侧边栏">
		         	⋮
		       </div>
        <div class="company-right">
          
          <div class="toolbar">
              <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline" @submit.native.prevent>
                  <el-form-item class="form-left">

                    <el-form-item label="区域名称：">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                        v-model="tableQuery.areaName"
                        @keyup.enter.native="search"
                        placeholder="请输入区域名称"
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
                stripe
                border 
                :data="tableData.list" 
                v-if="tableShow" 
                :max-height="maxHeight" 
                class="wuserInfo-table">
              <el-table-column type="index" label="NO." width="50" :index="indexMethod">
              </el-table-column>
              <el-table-column prop="areaNo" min-width="80" label="区域编号"> </el-table-column>
              <el-table-column prop="areaName" min-width="120" label="区域名称"> </el-table-column>
              <el-table-column prop="sortNo" min-width="80" label="排序号">
              </el-table-column>
              <el-table-column prop="status" min-width="80" label="状态">
              </el-table-column>
              <el-table-column prop="areaComments" min-width="300" label="区域描述" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" style="font-size:13px" size="mini" @click.native="add(scope.row)">编辑</el-button>
                  <el-button type="text" style="font-size:13px" size="mini" @click="add('addnext',scope.row)">添加下级</el-button>
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
      EditVisible: false, //弹出表单
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
            title: "区域配置",
            method: () => {
              window.histroy.back();
            }
          },
          {
            title: "营业区域",
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
    this.getBusinessAreaTree();
    this.dragControllerDiv()
    this.init();
    // console.log(this.getTreeDatas)
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      // this.common.changeTable(this, '.business-area1 .business-area1-right-content', []);
      this.common.changeTable(this, ".BusinessArea .company-right", [
        ".BusinessArea .toolbar",
        ".BusinessArea .block"
      ]);
      console.log(this.maxHeight)
    });
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        dragControllerDiv () {
                var resize = document.getElementsByClassName('resize');
                var left = document.getElementsByClassName('company-left');
                var mid = document.getElementsByClassName('company-right');
                var box = document.getElementsByClassName('company-content');
                for (let i = 0; i < resize.length; i++) {
                    // 鼠标按下事件
                    resize[i].onmousedown = function (e) {
                        //颜色改变提醒
                        resize[i].style.background = '#818181';
                        var startX = e.clientX;
                        resize[i].left = resize[i].offsetLeft;
                        // 鼠标拖动事件
                        document.onmousemove = function (e) {
                            var endX = e.clientX;
                            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
                            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

                            if (moveLen < 32) moveLen = 32; // 左边区域的最小宽度为32px
                            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px

                            resize[i].style.left = moveLen; // 设置左侧区域的宽度

                            for (let j = 0; j < left.length; j++) {
                                left[j].style.width = moveLen + 'px';
                                mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
                            }
                        };
                        // 鼠标松开事件
                        document.onmouseup = function (evt) {
                            //颜色恢复
                            resize[i].style.background = '#d6d6d6';
                            document.onmousemove = null;
                            document.onmouseup = null;
                            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                        };
                        resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                        return false;
                    };
                }
            },
    // 添加按钮点击事件
    add(val,item) {
      this.EditVisible = true;
      if (val === "add") {
        this.formType = 'add'
        this.$refs.BusinessAreaEdit.editData({
          areaNo: "",
          areaName: "",
          sortNo: "",
          status: 1,
          areaComments: "",
          parentId:this.parentId,
          upperAreaName:this.parentName
        });
          this.common.chargeObjectEqual(this,this.formData,'set','BusinessAreaEdit');
      }else if (val === "addnext" ) {
        this.formType = 'addnext'
        this.$refs.BusinessAreaEdit.editData({
          areaNo: "",
          areaName: "",
          sortNo: "",
          status: 1,
          areaComments: "",
          parentId:item.id,
          upperAreaName:item.areaName

        });
  
          this.common.chargeObjectEqual(this,this.formData,'set','BusinessAreaEdit');
      }else {
        
        this.formType = 'update'
        let _this = this;
        let params = {
          busicode: "BusinessAreaQuery",
          data: {
            id: val.id
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$refs.BusinessAreaEdit.editData(res);
            this.common.chargeObjectEqual(this, res, "set", "BusinessAreaEdit");
          });
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
    init() {
      let _this = this;
      let params = {
        busicode: "BusinessAreaList",
        data: this.tableQuery,
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    
     // 搜索
    search(){
      this.tableQuery.page = 1;
      this.init()
    },
    // 获取左侧营业所的数据
    getBusinessAreaTree() {
      let _this = this;
      let params = {
        busicode: "BusinessAreaTree",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.treeDatas.tree = res;

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
    // 树的点击
    backAbodeData(val) {
      if(val.id=='0'){
        this.getBusinessAreaTree();
      }
      
      let _this = this;
      this.tableQuery.page = 1;
      this.parentId=val.id;
      this.parentName = val.name;
      this.tableQuery.parentId=val.id;
      let params = {
        busicode: "BusinessAreaList",
        data:this.tableQuery,
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    //保存按钮
    submitForm(formName) {
      this.$refs.BusinessAreaEdit.submitForm(formName,this.formType,this.parentId);
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
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
        width: calc(22% - 10px);  /*左侧初始化宽度*/   
        height: 90%;
        background: #FFFFFF;
        float: left;
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
        width: 78%;   /*右侧初始化宽度*/
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


