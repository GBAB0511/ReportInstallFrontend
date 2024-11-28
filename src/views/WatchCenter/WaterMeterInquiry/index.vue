<template>
  <div class="water-meter-inquiry">
     <el-dialog title="查看附件" :visible.sync="viewAttachmentShow" :close-on-click-modal="false" class="button-dialog" @close="closeAttachDialog">
      <attachment-view-info
        v-if="viewAttachmentShow"
        :receiptAccessory="receiptAccessory"
        busicode=""
      ></attachment-view-info>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeAttachDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="wmeterInquiryConShow">
        <el-button type="primary" size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-upload
                  class="upload-file"
                  multiple action="/" 
                  :http-request="uploadAttachment"
                  style="display:inline-block;"
                  :show-file-list="false"
                >
                  <el-button size="mini" type="primary">上传附件</el-button>
        </el-upload>
        <el-button size="mini" type="primary" @click="AttachmentView">查看附件({{attachmentQty}})</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div class="wmeterInquiryCon" v-if="wmeterInquiryConShow"> 
      
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline multiple-floor">
          
      
              <!--el-select clearable v-model="tableQuery.departBelong" placeholder="营业所">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="(item,index) in businessOutletsData" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select-->
               <!-- <el-form-item label="营业区域：">
              <el-cascader ref="cascader" clearable v-model="tableQuery.departBelong" :options="businessOutletsData" :show-all-levels="false" :props="props">
              </el-cascader>
            </el-form-item> -->
            
            <el-form-item label='注册日期：'>
              <el-date-picker v-model="tableTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="关键字查询：">
              <el-select ref="select1" v-model="tableQuery.queryType">
                <el-option v-for="item in dictionaryData.METER_QUERY_TYPE" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="width-200">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" @keyup.enter.native="search"></el-input>
            </el-form-item>

            <el-form-item class="button-group">
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          <!-- 高级查询内容 -->
          <div v-show="isActive" class="advancedQuery">

            <el-form-item label="水表厂家：">
              <el-select ref="select2" clearable v-model="tableQuery.meterFactory" placeholder="水表厂家">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="item in meterFactoryData.list" :key="item.factoryId" :label="item.factoryName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水表分类：">
              <el-select ref="select3" clearable v-model="tableQuery.meterType" placeholder="水表分类">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="item in dictionaryData.MMT" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水表型号：">
              <el-select ref="select4" clearable v-model="tableQuery.meterModel" placeholder="水表型号">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="item in meterModelData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水表口径：">
              <el-select ref="select5" clearable v-model="tableQuery.meterBore" placeholder="水表口径">
                <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in meterBoreData" :key="item.id" :label="item.boreName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水表状态：">
              <el-select ref="select6" clearable v-model="tableQuery.meterStatus" placeholder="水表状态">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="item in dictionaryData.MMS" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="通讯类型：">
              <el-select ref="select6" clearable v-model="tableQuery.transmittalModel" placeholder="通讯类型">
                <el-option key="" label="全部" value=""></el-option>
                <el-option v-for="item in dictionaryData.TPW" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否超期：">
              <el-radio v-model="tableQuery.overdue" label="1">是</el-radio>
              <el-radio v-model="tableQuery.overdue" label="2">否</el-radio>
            </el-form-item>

          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table"
        :style="{height: maxHeight + 'px'}"
      >
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="water-meter-inquiry-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="meterNo" min-width="100" label="水表编号">
          </el-table-column>

          <el-table-column prop="factoryNo" min-width="100" label="水表表身号">
          </el-table-column>

          <el-table-column prop="meterBoreName" min-width="100" label="水表口径">
          </el-table-column>

          <el-table-column prop="meterFactoryName" min-width="100" label="水表厂家">
          </el-table-column>

          <el-table-column prop="meterModelName" min-width="120" label="水表型号">
          </el-table-column>

          <el-table-column prop="meterStatusName" min-width="120" label="水表状态" show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="85">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          >
          </el-pagination>
        </div>
    </div>
    <div v-else class="wmeterInquiryCon">
    <WaterMeterInquiryEdit ref="waterMeterInquiryEdit" :editNeedData ='editNeedData'></WaterMeterInquiryEdit>
  </div>
  </div>
</template>
<script>
import WaterMeterInquiryEdit from "./WaterMeterInquiryEdit";
import AttachmentViewInfo from '@/components/IntegratedBusiness/UserInformation/AttachmentViewInfo.vue';
export default {
  name: "water-meter-inquiry",
  components: {
    WaterMeterInquiryEdit,
    AttachmentViewInfo,
  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      //查看附件传参
      receiptAccessory:{meterNo:""},
      // 详情页面所需数据
      editNeedData : {},
      // 数据字典数据
      dictionaryData: {},
      // 水表厂家下拉框数据
      meterFactoryData: {},
      // 水表型号下拉框数据
      meterModelData: {},
      // 营业所下拉框数据
      businessOutletsData: [],
      // 子页面表单数据接口所需入参（主键id）
      meterId: '',
      tableShow: false,
      loadingShow: false,
      maxHeight: 0,
      wmeterInquiryConShow: true,
      crumbsData: {
        //面包屑
        titleList: [{ title: "表计管理" }, { title: "查询" }]
      },
      isActive: false, //控制高级查询内容的显示
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableShow: false,
      maxHeight: 0,
      tableData: {},
      tableTime:[],
      tableQuery: {
        page: 1,
        pageCount: 20,
        beginDate:'',
        endDate:'',
        meterFactory: "", //水表厂家
        meterType: "", //水表制式
        meterModel: "", //水表型号
        meterBore: "", //水表口径
        meterStatus: "", //水表状态
        departBelong: "", //所属部门
        fuzzyQuery: "", //模糊查询
        overdue: "", //是否超期,
        transmittalModel: "", //通讯类型
        queryType: '1'
      },
      meterBoreData:[],
      // 查看附件弹出框显示与隐藏
      viewAttachmentShow: false,
      attachmentData: [],
      attachmentQty:0,
    };
  },
  mounted() {
    eventBus.$emit("asideMenuShow", "businessMenuShow5");
    this.init();
    this.getDictionary()
    this.getMeterFactory()
    this.getMeterModel()
    // this.getBusinessOutlets()
    this.getMeterBore()
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".water-meter-inquiry", [
        ".water-meter-inquiry .toolbar",
        ".water-meter-inquiry .block",
        '.water-meter-inquiry .bread-contain',
        '.water-meter-inquiry .toggle-btn'
      ]);
    });
  },
  methods: {
        enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
           this.$refs.select2.blur()
           this.$refs.select3.blur()
           this.$refs.select4.blur()
           this.$refs.select5.blur()
           this.$refs.select6.blur()
           this.$refs.cascader.dropDownVisible = false
         }
    },
    // 列表初始化
    init() {
      this.loadingShow = true
      this.getDatePicker(this.tableTime)
      let _this = this;
      this.tableQuery.departBelong=this.common.handleTreeData(this.tableQuery.departBelong)
      let params = {
        busicode: "MsInfoListOpt",
        data: this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      }).finally(() => {
        this.loadingShow = false
      })
    },
    initAccessory() { //初始化附件
        let _this = this;
          let params = {
            busicode: "AccessoryAboutUserList",
            data:_this.receiptAccessory
        };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          if(res !=null && res.length > 0) {
            _this.attachmentData = res;
            _this.attachmentQty =res.length
          }            
        });
    },
    // 获取日期框数据
    getDatePicker(date) {
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      } else {
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MMT,MMS,MMC,METER_QUERY_TYPE,TPW"//水表制式、水表状态、水表口径
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
        _this.dictionaryData.METER_QUERY_TYPE.push({id: "4",name:"IMEI号",value:"4"})
        _this.dictionaryData.METER_QUERY_TYPE.push({id: "5",name:"IMSI号",value:"5"})
      })
    },
    uploadAttachment(file) {
      this.$refs.waterMeterInquiryEdit.uploadAttachment(file);
    },
    
    // 水表口径下拉数据
    getMeterBore() {
      var _this = this
      var params = {
        "busicode": "MeterBoreList",
        "data": {page:1,pageCount:999}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterBoreData = res.list
      })
    },
    // 水表厂家下拉数据
    getMeterFactory() {
      var _this = this
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 9999
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterFactoryData = res
      })
    },
    // 水表型号下拉数据
    getMeterModel() {
      var _this = this
      var params = {
        "busicode": "WaterMeModelOpList",
        "data": {}
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterModelData = res
      })
    },
    // 营业所下拉数据
    getBusinessOutlets() {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessOutletsData = res.children
      })
    },
    //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    // 导出按钮
    exportExcel() {
      var _this = this
      var params = {
        "busicode": "MsInfoExport",
        "data": this.tableQuery,
        "token": sessionStorage.getItem('token'),
        "sysType": '002'
      }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");

        this.isActive = true;
      }
      this.$nextTick(() => {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        this.common.changeTable(this, ".water-meter-inquiry", [
          ".water-meter-inquiry .toolbar",
          ".water-meter-inquiry .block",
          ".water-meter-inquiry #crumbs",
          '.water-meter-inquiry .toggle-btn'
        ]);
      });
    },
    // 搜索
    search() {
      if (this.tableQuery.Time !== undefined) {
        this.tableQuery.beginTime = this.tableQuery.Time[0]
        this.tableQuery.endTime = this.tableQuery.Time[1]
        delete this.tableQuery.Time
      }
      this.tableQuery.page = 1;
      this.init();
    },
    //分页
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
    //   详情按钮
    details(index, row) {
      this.editNeedData = row
      this.wmeterInquiryConShow = false
      this.receiptAccessory.meterNo = row.meterNo
      this.initAccessory();
    },
    // 列表的NO列
    indexMethod(index) {
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    closeDialog() {
      this.wmeterInquiryConShow = true;
    },
     AttachmentView() {
      this.viewAttachmentShow = true;
    },
    closeAttachDialog(){
      this.viewAttachmentShow = false;
      this.initAccessory();
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
<style lang="scss" scoped>
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.water-meter-inquiry {
  width: 100%;
  height: 100%;
  .el-upload-list {
      display: none;
    }
  .wmeterInquiryCon {
    width: 100%;
    height: calc(100% - 40px);
  }
  .kl-table{
    margin-top: 15px;
  }
}
</style>
