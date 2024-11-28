
<template>
  <div class="MaterialPrice">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="!EditVisible">
        <el-button size="mini" type="primary" @click="submitForm(tableData.list)">保存</el-button>
        <!-- <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button> -->
      </div>
    </div>
    <!-- <MaterialPriceEdit v-show="EditVisible" ref="MaterialPriceEdit"></MaterialPriceEdit> -->
    <div v-show="!EditVisible" class="company-content">
      <div class="company-left">
        <auto-tree :treeData="treeDatas" @sendTreeData="backTreeData"></auto-tree>
      </div>
      <div class="company-right MaterialPriceIndex">
        <div class="toolbar">
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed>
            </el-table-column>
            <el-table-column prop="matrNo" min-width="80" label="材料编号">
            </el-table-column>
            <el-table-column prop="matrName" min-width="80" label="材料名称">
            </el-table-column>
            <el-table-column prop="matrPrice" min-width="80" label="标准单价">
            </el-table-column>
            <el-table-column prop="price" min-width="80" label="材料单价">
              <template slot-scope="scope">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" v-model="scope.row.price" maxlength="10" placeholder="请输入材料单价" @keyup.native="keyupEvent($event,input)">
                </el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="70" fixed='right'>
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="submitForm(scope.row)" style='font-size:12px;'>保存</el-button>
            </template>
          </el-table-column> -->
          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
// import MaterialPriceEdit from "./MaterialPriceEdit"
export default {
  components: {
    autoTree,
  },
  name: "MaterialPrice",
  data() {
    return {
      EditVisible: false,//弹出表单
      tableData: {},
      tableQuery: {
        page: 1,
        pageCount: 10,
        matrNo: "",
      },
      formData: {
        id: "",
        matrNo: "",
        matrPrice: "",
      },
      treeDatas: {
        tree: [{
          foreignkey: '全部', id: '222',
          _child: []
        }],
        defaultProps: {
          label: 'matrName',
          children: 'children'
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: '请输入节点'
        },
        sendTreeProp: ['id', 'matrPriceId', 'matrNo', 'matrName', 'matrMode', 'matrUnit', 'matrPrice', 'parent', 'idLeaf', 'isParent', 'classCode'],
        rootName: '总部',
        defaultOpen: {
          nodeKey: 'id',
        }
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '系统设置', path: '/BusinessArea' },
          { title: '其他配置' },
          { title: '材料定价' }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      formType: "",
    }
  },

  mounted() {
    this.getTreeDatas();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      // .bank-info-right-content
      this.common.changeTable(this, '.MaterialPrice .company-right', ['.MaterialPrice .toolbar', '.MaterialPrice .block']);
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
      let _this = this;
      let params = {
        "busicode": "MatrList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.formType = 'matrUpdate',
          _this.tableData = res;
      })
    },
    keyupEvent(e, input) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '');
      e.target.value = e.target.value.replace(/\.{4,}/g, '.');
      e.target.value = e.target.value.replace(/^\./g, '0.');
      e.target.value = e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0, e.target.value.length - 1));
      e.target.value = e.target.value.replace(/^0[^\.]+/g, '0')
      e.target.value = e.target.value.replace(/^(\d+)\.(\d\d\d\d).*$/, '$1.$2')
      this.input = e.target.value
    },
    // 获取树的数据
    getTreeDatas() {
      let _this = this
      let params = {
        "busicode": "MatrTemplateTree",
        "data": {},
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.treeDatas.tree = res;
        _this.init();
      })
    },
    // 树的点击
    backTreeData(val) {
      let _this = this;
      this.tableQuery.matrNo = val.matrNo;
      let params = {
        "busicode": "MatrList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
      })
    },
    submitForm(formName) {
      console.log(formName);
      if (formName.length <= 0) {
        this.$message({
          message: '没有需要保存的数据！',
          type: 'warning'
        });
        return
      }
      let _this = this
      let params = {};
      params = {
        "busicode": "MatrSave",
        "data": formName
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success',
        });
        _this.getTreeDatas();
        _this.init();
        _this.closeDialog();
      })
    },
    // 列表的NO列
    indexMethod(index) {
      return index + 1;
    },
    closeDialog() {
      this.EditVisible = false;
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
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

<style lang="scss" scoped>
.MaterialPrice {
  height: 100%;
}
</style>
