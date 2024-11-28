
<template>
  <div class="WaterPrice">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" v-if="EditRight" @click="submitForm('WaterPriceEditFrom')">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button :disabled="addShow" size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>

    <WaterPriceEdit v-if="EditVisible" ref="WaterPriceEdit"></WaterPriceEdit>

    <div v-else class="company-content indexContent">
      <div class="company-left">
        <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
      </div>
      <div class="resize" title="收缩侧边栏">
        ⋮
      </div>
      <div class="company-right">
        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="状态：">
              <el-select ref="select1" v-model="tableQuery.status" placeholder="请选择状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="模糊查询：" class="searchInput">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.waterTypeName " @keyup.enter.native="search" clearable placeholder="用水类型名称" @keydown.enter.native="search"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table :max-height="maxHeight" v-if="tableShow" stripe border :data="tableData.list" class="wuserInfo-table">

            <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="waterTypeNo" min-width="100" label="用水类型编号">
            </el-table-column>

            <el-table-column prop="waterTypeName" min-width="120" label="用水类型名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remark" min-width="180" label="描述" show-overflow-tooltip>
              <template slot-scope="scope">

                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :id="'remark'+scope.$index" v-show="index==scope.$index" size="mini" v-model="scope.row.remark" @blur="isBlur(scope.row)">
                </el-input>
                <span v-show="index!=scope.$index" @click="editShow(scope.row,scope.$index)" style="color: #606266;height: 30px;">{{scope.row.remark}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="effectiveDate" min-width="100" label="生效时间">
            </el-table-column>

            <el-table-column prop="status" min-width="80" label="状态" :formatter="formatStatus">
            </el-table-column>

            <el-table-column prop="processState" min-width="70" label="审批状态" :formatter="formatProcessState">
            </el-table-column>
            <el-table-column prop="processName" min-width="70" label="节点名称">
            </el-table-column>

            <el-table-column prop="processHandleMan" min-width="80" label="当前处理人" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作" width="85">
              <template slot-scope="scope">
                <el-button v-if="scope.row.processState===''" type="text" size="mini" @click.native="add(scope.row)">编辑</el-button>
                <el-button v-else type="text" size="mini" @click.native="add(scope.row)">详情</el-button>
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
  </div>
</template>
<script>
import WaterPriceEdit from "./WaterPriceEdit";
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "WaterPrice-index",
  components: {
    WaterPriceEdit,
    autoTree,
  },
  data () {
    return {
      EditVisible: false, //弹出表单
      EditRight: true,//编辑权限
      formData: {
        waterTypeId: "",
        effectiveDate: "",
        status: "",
        details: []
      },
      remarkEdit: false,
      index: -1,
      addShow: true,
      tableData: [],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "价格管理" },
          { title: "用水价格" }
        ]
      },
      maxHeight: 0,
      tableShow: false,
      tableQuery: {
        page: 1,
        pageCount: 100,
        status: "",
        waterTypeName: "",
        code: "",
      },
      waterTypeId: "",
      process: '',
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
    };
  },
  mounted () {
    // 侧边栏
    this.dragControllerDiv()
    eventBus.$emit("asideMenuShow", "businessMenuShow4");
    this.getTreeDatas();
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".WaterPrice", [
        ".WaterPrice .toolbar",
        ".WaterPrice .block"
      ]);
    });
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
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
    init () {
      let _this = this;
      let params = {
        busicode: "WaterPriceList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    editShow (row, index) {
      let _this = this
      this.index = index
      this.$nextTick(() => {
        let ref = 'remark' + index
        document.getElementById(ref).focus();
      })

      this.remarkEdit = true
    },

    isBlur (row) {
      this.index = -1
      let _this = this;
      let params = {
        busicode: "WaterPriceUpdateRemark",
        data: { id: row.id, remark: row.remark }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {

        });
    },
    // 搜索
    search () {
      this.tableQuery.page = 1;
      this.init();
    },
    // 树的点击
    backTreeData (val) {

      let _this = this;
      this.tableQuery.page = 1;
      console.log(val);

      this.tableQuery.code = val.code;
      if (!val.isParent) {
        this.addShow = false;
        this.waterTypeId = val.id
      } else {
        this.addShow = true;
      }
      let params = {
        busicode: "WaterPriceList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    // 获取树的数据
    getTreeDatas () {
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
          if (this.clickNodeId) {
            _this.treeDatas.defaultOpen = {
              nodeItem: [this.clickNodeId]
            }
          }
          _this.waterTypeNo = res.code;
          _this.parentId = res.id;
          _this.init();
        });
    },
    // 添加按钮点击事件
    add (val) {
      let _this = this;
      if (val === "add") {
        _this.process = "WaterPriceAdd";
      } else {
        _this.process = "WaterPriceUpdate";
      }
      // this.bankLinkShow = false;
      this.EditVisible = true;
      this.EditRight = true;
      this.$nextTick(() => {
        this.$refs.WaterPriceEdit.EditRight = true;
        if (val === "add") {
          //费用类型
          let params = {
            busicode: "CostNameSelect",
            data: {}
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$refs.WaterPriceEdit.costNameOptions = res;
              let handleData = {
                waterTypeId: this.waterTypeId,
                // effectiveDate: "",
                status: 1,
                details: [],
              };
              //给明细表设置初始值  
              for (let i = 0; i < res.length; i++) {
                handleData.details[i] = {
                  costId: res[i].id, costName: res[i].name,
                  fixedMoneyUnit: "2", ladderType: "1", fixedPriceUnit: "1", ladderCalculateWay: "1", ladders: []
                };
              }

              this.$refs.WaterPriceEdit.editData(handleData);

              //加载流程界面
              this.$refs.WaterPriceEdit.getHtmlData();
              this.common.chargeObjectEqual(
                _this,
                _this.formData,
                "set",
                "WaterPriceEdit"
              );
            });
        } else {
          let params = {
            busicode: "WaterPriceQuery",
            data: {
              id: val.id
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              let handleData = res.WaterPricebean;
              this.$refs.WaterPriceEdit.costNameOptions = res.costlist;
              this.$refs.WaterPriceEdit.editData(handleData);
              //当流程状态为空或当前处理于起草结点时可编辑
              // debugger
              //   console.log('processState', handleData.processState)
              if (handleData.processState != undefined && handleData.processState != ''
                && handleData.processState != 'draft' && handleData.processState != 'Process-task1') {
                this.EditRight = false;
                this.$refs.WaterPriceEdit.EditRight = false;
              }
              //加载流程界面
              this.$refs.WaterPriceEdit.getHtmlData();
              this.common.chargeObjectEqual(
                _this,
                handleData,
                "set",
                "WaterPriceEdit"
              );
            });
        }
      });
    },
    // 列表的NO列
    indexMethod (index) {
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },

    formatStatus (row) {
      return row.status == 1 ? "启用" : "禁用"
    },
    formatProcessState (row) {
      if (row.processState == 'END') {
        return '审批结束';
      } else if (row.processState == 'CANCEL') {
        return '废弃';
      } else if (row.processState == '') {
        return '草稿';
      } else {
        return '审批中';
      }
    },
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //页码点击
      this.tableQuery.page = val;
      this.init();
    },
    closeDialog () {
      // this.crumbsData.titleList.pop();
      this.init();
      this.EditVisible = false;
    },
    // 返回
    handleClose () {
      // this.$refs.WaterPriceEdit.handleClose();
      this.EditVisible = false;
    },
    //保存按钮
    submitForm (formName) {
      this.$refs.WaterPriceEdit.submitForm(formName, true);
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;

.WaterPrice {
  /deep/ .company-content .company-right table tbody tr {
    height: 30px !important;
  }
  width: 100%;
  height: calc(100% - 41px);
  .company-content {
    width: 100%;
    height: 100%;
    // margin: 1% 0px;
    overflow: hidden;
    // box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
  }
  /*左侧div样式*/
  .company-left {
    width: calc(20% - 10px); /*左侧初始化宽度*/
    height: 90%;
    background: #ffffff;
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
  .company-right {
    float: left;
    width: 80%; /*右侧初始化宽度*/
    height: 30px;
    background: #fff;
    // box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
  }
}
</style>


