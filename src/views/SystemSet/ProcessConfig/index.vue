
<template>
  <div class="processConfig">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>

    <div class="toolbar">
      <el-form :inline="true" :model="tableQuery" class="demo-form-inline" size="mini" @submit.native.prevent>
        <div class="toolbar-left" style="width: 80%;">
          <el-form-item label="单据类型：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="default_class" v-model="tableQuery.fuzzyQuery" size="mini" @keyup.enter.native="search" clearable></el-input>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="search" size="mini" icon="el-icon-search"></el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-row>
        <el-col
          v-for="item in selServicesData"
          :key="item.processCode"
          :span="4"
        >
          <el-button 
            type="text" 
            @click="design(item)"
            class="name-button"
          >{{ item.receiptName }}</el-button>
        </el-col>
      </el-row>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "processConfig",
  data() {
    return {
      tableShow: true,
      maxHeight: 300,
      selServicesData: [],
      processStateData: [],
      tableQuery: {
        fuzzyQuery: '',
        companyNo: localStorage.getItem('companyNo'),
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: "系统管理" }, { title: "流程配置" }
        ],

      },
      processConfigShow: true,
    }
  },
  mounted() {
    this.getData();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, '.processConfig', ['.processConfig .toolbar', '.processConfig .bread-contain']);
    console.log(this.maxHeight)
  },
  methods: {
    design(row) {
      let params = { "busicode": "ProcessPlatformSSO", "data": {
        setCode: row.setCode,
        processCode: row.processCode
      }}
      this.$api.fetch({  params: params, }).then(res => { 
        window.open(res);
      })
    },
    // 搜索
    search() {
      this.getData()
    },
    getData() {
      let _this = this;
      // ********************************获取审批状态数据
      _this.common.getProcessStateData("BASE_PROCESS_CONFIG", _this, (res) => {
        _this.processStateData = res;
        //需要先获取审批状态，才能查询数据
        let params = {
          "busicode": "ProcessConfigList",
          "data": _this.tableQuery,
        }
        _this.$api.fetch({
          params: params,//参数
        }).then(res => {
          _this.selServicesData = res
        }).catch((err) => {
        })

      });
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    }
  }
}
</script>

<style lang="scss">
.processConfig {
  width: 100%;
  height: 100%;
  .kl-table {
    overflow: hidden;
    .name-button {
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}
</style>

