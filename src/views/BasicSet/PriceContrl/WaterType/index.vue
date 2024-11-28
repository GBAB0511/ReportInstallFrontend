<template>
  <div class="WaterType">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>
    <WaterTypeEdit v-if="EditVisible" ref="WaterTypeEdit"></WaterTypeEdit>
    
    <div v-else class="company-content indexContent">
      <div class="company-left">
        <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
      </div>
       <div class="resize" title="收缩侧边栏">
		         	⋮
		       </div>
      <div class="company-right">
          <div class="toolbar">
            <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline" @submit.native.prevent>
              <el-form-item label="类型名称：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.waterTypeName" @keyup.enter.native="search" clearable placeholder="请输入类型名称">
                </el-input>
              </el-form-item>
              <el-form-item>
                  <el-button class='searchBtn'  @click="search" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="waterTypeNo" min-width="100" label="类型编号">
            </el-table-column>
            <el-table-column prop="waterTypeName" min-width="100" label="类型名称">
            </el-table-column>
            <el-table-column prop="sortNo" min-width="100" label="排序" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" min-width="100" label="状态">
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
import WaterTypeEdit from "./WaterTypeEdit";
import autoTree from '@/components/companyTree/autoTree'
export default {
  components: {
    WaterTypeEdit,
    autoTree
  },
  name: "WaterType",
  data() {
    return {
      EditVisible: false, //弹出表单
      tableData: [],
      formData: {
        id:"",
        waterTypeNo: "",
        waterTypeName: "",
        sortNo: "",
        status: "",
        parentId:"",
      },
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "价格管理" },
          { title: "用水类型" }
        ]
      },
      maxHeight: 0,
      tableShow: false,
      treeDatas: {
        tree: [{ foreignkey: "全部", id: "222", _child: [] }],
        defaultProps: {
          label: "name",
          children: "children"
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点"
        },
        sendTreeProp: [
          "code",
          "name",
          "districtArr",
          "children",
          "id",
          "group",
          "isLeaf",
          "isParent",
          "parent",
          "sonData"
        ],
        rootName: "总部",
        defaultOpen: {
          nodeKey: "id"
        }
      },
      tableQuery:{
        page:1,
        pageCount:10,
        waterTypeNo:"",
        waterTypeName:"",
        parentId:"",
      },
      waterTypeNo: "",
      parantId: "",
      formType:"",
    };
  },
  mounted() {
    this.dragControllerDiv()
    this.getTreeDatas();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".WaterType .water-type-right-content", [
        ".WaterType .toolbar",
        ".WaterType .block",
      ]);
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
    add(val) {
      this.EditVisible = true;
      if (val === "add") {
        this.formType='WaterTypeAdd';
        this.$refs.WaterTypeEdit.editData({
          waterTypeNo: "",
          waterTypeName: "",
          sortNo: "",
          status: "",
          parentId:"",
        });
      } else {
        this.formType='WaterTypeUpdate';
        let _this = this;
        let params = {
          "busicode": "WaterTypeQuery",
          "data": {
            waterTypeId: val.id
            },
        };
        _this.$api.fetch({
          params:params,
        }).then(res=>{
        _this.$refs.WaterTypeEdit.editData(res);
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
    init() {
      let _this = this;
      this.tableQuery.waterTypeNo=_this.waterTypeNo;
      let params = {
        busicode: "WaterTypeList",
        data: this.tableQuery,
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res.pageInfo;
        });
    },
    // 获取树的数据
    getTreeDatas() {
      let _this = this;
      let params = {
        busicode: "WaterTypeTree",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.treeDatas.tree = res;
          _this.waterTypeNo = res.code;
          _this.parentId=res.id;
          _this.init();
        });
    },
    closeDialog() {
      this.EditVisible = false;
    },
    // 返回
    handleClose() {
      this.$refs.WaterTypeEdit.handleClose();
    },
    // 树的点击
    backTreeData(val) {
      let _this = this;
      this.parentId = val.id;
      this.waterTypeNo = val.code;
      this.tableQuery.page = 1;
      this.tableQuery.waterTypeNo=val.code;
      let params = {
        busicode: "WaterTypeList",
        data: this.tableQuery
      };
      this.$api
        .fetch({params: params})
        .then(res => {
          _this.tableData = res.pageInfo;
        });
    },
    //保存按钮
    submitForm() {
      this.$refs.WaterTypeEdit.submitForm(this.formType,this.parentId);
    },
     // 搜索
    search(){
      this.tableQuery.page = 1;
      this.init()
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
.WaterType {
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
}
</style>
