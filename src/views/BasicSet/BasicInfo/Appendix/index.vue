<template>
  <div class="Appendix">
    
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">保存</el-button>
      </div>
    </div>

    <div class="ShortMessageEdit">
      <el-form  class="billform" :inline="true" :model="tableData" label-width="180px"
          v-for="(item,index) in ReceiptList.list" :key="index">
        <legend class="legendColumn">
          <div class="legendColumn-title">{{item.receiptName}}</div>
          </legend>
        <span v-for="(item1,index1) in AccessoryTypeListData[index]" :key="index1">

          <el-form-item :label="accessoryTypeName[item1.accessoryNo]" >
            <el-switch v-model="item1.isUse" active-text="显示" inactive-text="" active-value="true" inactive-value="false">
            </el-switch>
            <el-switch v-model="item1.isChecked" active-text="必填" inactive-text="" active-value="true" inactive-value="false">
              </el-switch>
          </el-form-item>
        </span>
      </el-form>
    </div>

  </div>
</template>
<script>
export default {
  name: "Appendix",
  components: {
    
  },
  data() {
    return {
      tableData: {},
      tableQuery:{
        page:1,
        pageCount:100,
      },
      slelctList:[],
      isUse:false,
      isChecked:false,
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessArea' },
          { title: '其他配置' },
          { title: '附件资料' }
        ],
      },
      histroyData: {},
      maxHeight: 0,
      tableShow: false,
      ReceiptList:{},
      ReceiptListData:[],
      AccessoryTypeList:[],
      AccessoryTypeListData: [],
      // AccessoryTypeListData:[[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}],[{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false},{"isUse":false,"isChecked":false}]],
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      // this.common.changeTable(this, '.Appendix .kl-table', [])
    })
  },
  computed: {
    accessoryTypeName() {
      if(this.AccessoryTypeList.length === 0) {
        return {}
      }
      const obj = {}
      this.AccessoryTypeList.forEach(item => {
        obj[item.accessoryNo] = item.accessoryName
      })
      return obj
    }
  },
  methods: {
    init() {
      this.getReceiptList();
      this.getAccessoryTypeList();
      this.getListShow();
    },
    add(val){
      let _this = this
      let params = {
          "busicode": "AccessoryConfigSave",
          "data": {list:_this.AccessoryTypeListData},
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
         this.$notify({
          title: '消息',
          message: '保存成功',
          type: 'success'
        });
        this.getListShow();
      })
    },
    //获取列表显示的数据
    getListShow(){
      let _this = this
      let params = {
          "busicode": "AccessoryConfigQuery",
          "data": {
          },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.AccessoryTypeListData=res;
      })
    },
    //获取单据类型列表
    getReceiptList(){
      let _this = this
      let params = {
          "busicode": "ReceiptList",
          "data": {
            page:0,
            pageCount:500,
            startAccess:"1",
          },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
         _this.ReceiptList = res;
      })
    },
    //获取附件类型列表
    getAccessoryTypeList(){
      let _this = this
      let params = {
          "busicode": "AccessoryTypeList",
          "data": _this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.AccessoryTypeList = res.list;
        /*_this.ReceiptList.list.forEach((element,index) => {
          var data=[];
          _this.AccessoryTypeList.list.forEach((item,index1)=>{
            data.push({isUse:false,isChecked:false,accessoryNo:item.accessoryNo,receiptNo:element.receiptNo})
          });
          _this.AccessoryTypeListData.push(data);
        });*/

      })
    },
    //保存按钮
    submitForm(formName) {
      let type = this.crumbsData.titleList[3].title;
      this.$refs.ShortMessageEdit.submitForm(formName, type);
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
.Appendix {
  width: 100%;
  height: 100%;
  .ShortMessageEdit {
    height: calc(100% - 45px);
    overflow-y: auto;
    overflow-x: hidden;
    .legendColumn {
      width: 100%;
      background: #efefef;
      font-weight: 700;
      padding: 5px 20px;
      font-size: 14px;
      margin-bottom: 5px;
      .legendColumn-title {
        display: inline-block;
        width: 7%;
      }
    }
    legend {
      background: #f5f5f5;
      font-weight: 700;
      font-size: 12px;
      padding: 5px 20px;
      font-size: 14px;
      margin-bottom: 5px;
      i {
        float: right;
        margin-top: 5px;
        cursor: pointer;
      }
    }
    .ml-80 {
      margin-left: 80px;
    }
    .ml-120 {
      width: 100%;
      margin-left: 120px;
    }
    .ml-160 {
      margin-left: 160px;
    }
  }
}

</style>
