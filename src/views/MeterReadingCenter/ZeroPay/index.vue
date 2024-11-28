<template>
  <div class="zero-pay">
        
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <!-- <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button> -->
        </div>
      </div>
    
 
      <!-- <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            
            <el-button size="mini" type="primary">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
        </div>
      </div> -->
      
      <div v-if="EditVisible">
        <!-- <BusinessAreaEdit ref="childWarehousing"></BusinessAreaEdit> -->
      </div>

      <div v-else >
        <div class="toolbar">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
            <!-- <el-form-item class="form-left"> -->
                <el-form-item label="查缴日期：">
                     <el-date-picker
                        v-model="formData.payTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            <el-form-item label="缴费渠道：">
            <el-select v-model="formData.engineerType" clearable size="mini" style="width:100%">
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="抄表员：">
                <el-select v-model="formData.meterReader" size="mini">
                <el-option v-for="item in meterReaderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模糊查询：" class="longinput">
              <el-tooltip class="item" effect="dark" content="册本号、用户编号、用户名称" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.searchType"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item>


            <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>
            <!-- </el-form-item> -->
            <!-- <el-form-item style="float: right;">
            <el-button size="mini" type="primary">保存</el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload2">导出</el-button>
            </el-form-item> -->

        </el-form>
        </div>

          <div class="zero-pay-right-content">
              <div class="kl-table">

                <el-table 
                          stripe border 
                          :data="tableData"
                          highlight-current-row
                          @cell-click="cellClick" 
                          class="wuserInfo-table">

                  <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed>
                  </el-table-column>
                  
                  <el-table-column prop="paytype" min-width="100" label="缴费渠道">
                  </el-table-column>

                  <el-table-column prop="payTime" min-width="200" label="查缴时间">
                  </el-table-column>
                  <el-table-column prop="book" min-width="100" label="册本号">
                  </el-table-column>
                  <el-table-column prop="num" min-width="120" label="用户编号">
                  </el-table-column>

                  <el-table-column prop="name" min-width="100" label="用户名称">
                  </el-table-column>
                  <el-table-column prop="address" min-width="220" label="用户地址" show-overflow-tooltip>
                  </el-table-column>

                  <el-table-column prop="wtype" min-width="100" label="用水类型">
                  </el-table-column>
                  <el-table-column prop="caliber" min-width="120" label="水表口径">
                  </el-table-column>

                  <el-table-column prop="checkTime" min-width="100" label="最后抄表日">
                  </el-table-column>
                  <el-table-column prop="transcription" min-width="120" label="最后抄码">
                  </el-table-column>
                  <el-table-column prop="average" min-width="120" label="六期平均">
                  </el-table-column>
                  <!-- <el-table-column prop="areaDesc" min-width="150" label="备注" show-overflow-tooltip>
                  </el-table-column> -->

                  <!-- <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                      <el-button type="text" @click.native="edit(scope.$index, scope.row)" style="font-size:12px;text-align:center;">编辑</el-button>
                    </template>
                  </el-table-column> -->

                </el-table>
            </div>
          
        </div>
        
      </div>
  </div>
</template>
<script>
export default {
  name: "zero-pay-index",
  data() {
    return {
      EditVisible:false,//弹出表单
      formLabelWidth: '120px',
      crumbsData: {  //面包屑
        titleList: [
          { title: '基础配置', path: '/BusinessArea' },
          { title: '基础信息', path: '/BusinessArea' },
          { title: '零水量查缴记录', method: () => { window.histroy.back() } }
        ],
      },
     
      options6: [
        {
          value: 1,
          label: '全部'
        },
        {
          value: 2,
          label: '城区'
        },
        {
          value: 3,
          label: '农村'
        },
      ],
      meterReaderList:[
        {
          value: 1,
          label: '全部'
        },
        {
          value: 2,
          label: '单飞'
        },
        {
          value: 3,
          label: '胡国飞'
        },
        {
          value: 4,
          label: '胡晓玲'
        },
        {
          value: 5,
          label: '胡志金'
        },
        {
          value: 6,
          label: '蒋保平'
        },
        {
          value: 7,
          label: '李明'
        },
      ],
     
      options2: [
        {
          value: 1,
          label: '柜台收费'
        },
        {
          value: 2,
          label: '微信营业厅'
        },
        {
          value: 3,
          label: '网上营业厅'
        },
        {
          value: 4,
          label: '支付宝'
        },
        {
          value: 5,
          label: '自助缴费机'
        },
        {
          value: 6,
          label: '银行代收'
        },
        {
          value: 7,
          label: '上门走收'
        },
        {
          value: 8,
          label: '其他'
        },
      ],
      options1: [
        {
          value: '01',
          label: '启用'
        },
        {
          value: '02',
          label: '禁用'
        },
      ],
      histroyData: {},
      tableData:[
        {

          paytype:'微信营业厅',
          book:'0001',
          payTime:'2019-07-08 10：10',
          areaLevel:'10023210',
          name:  "张三",
          address: "1栋3单元",
          wtype:"",
          caliber:"15",
          checkTime: '2019-07-07',
          transcription: '90',
          average: '4',
          areaDesc: '-',
        }, {
          paytype:'柜台收费',
          book:'0002',
          payTime:'2019-07-08 21：10',
          areaLevel:'10023210',
          name:  "张三",
          address: "1栋4单元",
          wtype:"",
          caliber:"15",
          checkTime: '2019-07-07',
          transcription: '90',
          average: '4',
          areaDesc: '-',
        },
      ],
      
      formData: {
        searchType:'',
        engineerType: 1,
        BusinessAreaId:'',
        con: "",
        meterReader:"",
        payTime:  [new Date(),new Date()],
        watermeterWarehouseOptions: [],
        waterMeterManufacturer: "",

      },
    }
  },
  mounted() {
    this.init();
    
  },
  methods: {
      
    demand() {  //查询
    //   this.init()
    },
    init() {
     
    },
    add(){//添加
      this.EditVisible = true;
      this.$set(this.crumbsData.titleList, "3", { title: '添加', method: () => { window.histroy.back() } })

    },
    edit(){
      this.$set(this.crumbsData.titleList, "3", { title: '编辑', method: () => { window.histroy.back() } })
      this.EditVisible = true;
    },
    closeDialog(){ //关闭会话
      this.crumbsData.titleList.splice(3, 1);
      this.EditVisible = false;
    },
    backTreeData(){},
  },
  watch: {
  }
}
</script>
<style lang="scss"> 
@import "../../../assets/styles/scss/base/fn";

$imgWidth: 200px;
$theme-color: #297acc;
.zero-pay {
  .zero-pay-right-content {
    height: 87%;
    overflow-y: auto;
    .kl-table{
      padding: 0px 20px;
      .block {
        text-align: right;
        padding: 10px 0px;
    }

    }
  }
}
</style>
