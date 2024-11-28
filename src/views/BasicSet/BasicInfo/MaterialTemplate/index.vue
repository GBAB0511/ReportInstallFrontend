<template>
  <div class="MaterialTemplate">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <!-- <el-button size="mini" icon="el-icon-plus" type="primary" @click="MaterialList">添加明细</el-button> -->
            <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      
    <!--弹出框 材料树 -->
    <el-dialog title="材料明细" :visible.sync="MaterialListVisible" v-if="MaterialListVisible" class="button-dialog"  >
      
      <div  class="company-content">
        <div class="company-left">
              <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
        </div>
        <div class="company-right ">
          <div class="toolbar">
          </div>
          <div class="kl-table" >
            <el-table v-if="tableShow" ref="multipleTable" tooltip-effect="dark" style="width: 100%"  
            @selection-change="handleSelectionChange" :max-height="maxHeight" stripe border 
            :data="tableDataList.list" class="wuserInfo-table">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed>
              </el-table-column>
              <el-table-column prop="matrNo" min-width="80" label="材料编号">
              </el-table-column>
              <el-table-column prop="matrName" min-width="80" label="材料名称">
              </el-table-column>
              <el-table-column prop="matrMode" min-width="80" label="材料规格">
              </el-table-column>
              <el-table-column prop="matrNum" min-width="80" label="材料数量">
              </el-table-column>
              <el-table-column prop="matrUnit" min-width="80" label="材料单位">
              </el-table-column>
              <!-- <el-table-column prop="matrPrice" min-width="80" label="标准单价">
              </el-table-column>
              <el-table-column prop="price" min-width="80" label="材料单价">
              </el-table-column> -->
            </el-table>
            </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button size="mini" type="primary"  @click="saveRow()">确认</el-button>
      </div>
    </el-dialog>

      <MaterialTemplateEdit v-if="EditVisible" ref="MaterialTemplateEdit"></MaterialTemplateEdit>
      <div v-else  class="MaterialTemplateIndex">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
              <el-form-item class="form-left">
                  <el-form-item label="状态：">
                      <el-select v-model="tableQuery.status" placeholder="请选择状态">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="启用" :value="1"></el-option>
                      <el-option label="停用" :value="0"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="模糊查询：" class="width-200">
                      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.searchContent" @keyup.enter.native="search" clearable placeholder="模板名称/材料数量"></el-input>
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
            :data="tableData.list" 
            class="wuserInfo-table">
            <el-table-column type="index" label="序号" fixed="left" width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="templateName" min-width="80" label="模板名称">
            </el-table-column>
            <el-table-column prop="matrNum" min-width="80" label="材料数量">
            </el-table-column>
            <el-table-column prop="sortNo" min-width="70" label="排序号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
            </el-table-column>
            <el-table-column prop="comments" min-width="200" label="备注" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click.native="add(scope.row)">编辑</el-button>
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
import MaterialTemplateEdit from "./MaterialTemplateEdit";
import autoTree from '@/components/companyTree/autoTree'
export default {
  components: {
    MaterialTemplateEdit,
    autoTree
  },
  name: "MaterialTemplate",
  data() {
    return {
      EditVisible: false, //弹出表单
      MaterialListVisible: false,
      tableData: [],
      tableDataList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      //   查询表单
      formData: {
        templateName: "",
        matrNum: "",
        status: "",
        sortNo: "",
        comments: "",
        useMatrTemplateList: []
      },
      crumbsData: {
        //面包屑`
        titleList: [
          // { title: '系统设置', path: '/BusinessArea' },
          { title: "模板配置" },
          { title: "用料模板" }
        ]
      },
      tableShow: false,
      maxHeight: "",
      tableQuery: {
        page: 1,
        pageCount: 50,
        status: "",
        searchContent: ""
      },
      treeDatas: {
        tree: [
          {
            foreignkey: "全部",
            id: "222",
            _child: []
          }
        ],
        defaultProps: {
          label: "matrName",
          children: "children"
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: "请输入节点"
        },
        sendTreeProp: [
          "id",
          "matrPriceId",
          "matrNo",
          "matrName",
          "matrMode",
          "matrUnit",
          "matrPrice",
          "parent",
          "idLeaf",
          "isParent",
          "classCode"
        ],
        rootName: "总部",
        defaultOpen: {
          nodeKey: "id"
        }
      },
      formType: "",
      matrNo: "",
      matrNum: "",
      // 明细选择数据
      multipleSelection: [],
      useMatrTemplateList: []
    };
  },
  mounted() {
    eventBus.$emit("asideMenuShow", "basicsMenuShow3");
    // this.init();
    this.getTreeDatas();
    this.backTreeData();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(
        this,
        ".MaterialTemplate .MaterialTemplateIndex",
        [".MaterialTemplate .toolbar", ".MaterialTemplate .block"]
      );
    });
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this;
      let params = {
        busicode: "UseMatrTemplateList",
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
    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取树的数据
    getTreeDatas() {
      let _this = this;
      let params = {
        busicode: "MatrTemplateTree",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.treeDatas.tree = res;
          _this.init();
        });
    },
    // 树的点击
    backTreeData(val) {
      if (val) {
        this.matrNo = val.matrNo;
      }
      let _this = this;
      let params = {
        busicode: "MatrList",
        data: { matrNo: _this.matrNo }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableDataList = res;
        });
    },
    MaterialList() {
      this.MaterialListVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加按钮点击事件
    add(val) {
      this.EditVisible = true;
      if (val === "add") {
        this.formType = "UseMatrTemplateAdd";
      } else {
        this.formType = "UseMatrTemplateUpdate";
        let params = {
          busicode: "UseMatrTemplateQuery",
          data: {
            templateId: val.id
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$refs.MaterialTemplateEdit.editData(res);
          });
      }
    },
    // 列表的NO列
    indexMethod(index) {
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //页码点击
      this.tableQuery.page = val;
      this.init();
    },
    closeDialog() {
      this.EditVisible = false;
    },
    //保存按钮
    submitForm() {
      this.$refs.MaterialTemplateEdit.submitForm(this.formType);
    },
    // 弹框确定按钮
    saveRow() {
      this.multipleSelection.forEach(item => {
        this.useMatrTemplateList.push({
          matrNo: item.matrNo,
          matrName: item.matrName,
          matrMode: item.matrMode,
          matrNum: item.matrNum,
          matrUnit: item.matrUnit
        });
      });
      this.useMatrTemplateList = this.duplicateRemoval(
        this.useMatrTemplateList
      );
      this.$refs.MaterialTemplateEdit.formData.useMatrTemplateList = this.useMatrTemplateList;
      this.$refs.MaterialTemplateEdit.getTotleMatrNum() ;
      this.MaterialListVisible = false;
    },
    // 去重
    duplicateRemoval(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.matrNo) && res.set(arr.matrNo, 1));
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    MaterialListVisible(val) {
      if(!val) {
        this.tableDataList = {list: [], total: 0}
        this.matrNo = ''
      } else {
        this.getTreeDatas()
        this.backTreeData()
      }
    }
  }
};
</script>
<style lang="scss">
.MaterialTemplate {
  width: 100%;
  height: 100%;
  .MaterialTemplateIndex {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>

