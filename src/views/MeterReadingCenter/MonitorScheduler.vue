<template>
  <div class="Monitor-Scheduler">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <h2 class="tab-title">
        <i></i>
        监控调度</h2>
    </div>
    <div class="Monitor-Scheduler-right-content">
      <div class="kr-left">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

          <el-form-item label="输入姓名：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
            <el-button type="primary" size="mini">全部显示</el-button>
          </el-form-item>


        </el-form>

        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" @cell-click="cellClick" class="wuserInfo-table">

          <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="userNum" min-width="50" label="抄表员"></el-table-column>
          <el-table-column prop="userNum" min-width="70" label="时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click.native="editContent = true">定位</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div class="kr-right">

        <el-amap vid="amapDemo">
          <!-- <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events" :key="index"></el-amap-marker>
          <el-amap-text v-for="(text,index) in markers" :text="text.text" :offset="text.offset" :position="text.position" :events="text.events" :key="text.text"></el-amap-text>
          <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :template="window.template"></el-amap-info-window> -->
        </el-amap>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Monitor-Scheduler-index",
  data() {
    return {
      crumbsData: {  //面包屑
        titleList: [
          { title: '抄表中心', path: '/MeterReadingCenter' },
          { title: '监控调度', method: () => { window.histroy.back() } }
        ],
      },
      formData: {},
      dialogFormVisible: false,//弹出表单
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      rules: {
        Applicant: [
          { required: true, message: '请输入申请人', trigger: 'blur' }
        ],
        applicantDate: [
          { required: true, message: '请输入申请日期', trigger: 'blur' }
        ],
        engineerType: [
          { required: true, message: '请选择工程类型', trigger: 'change' }
        ],
        Contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        documentType: [
          { required: true, message: '请输入证件类型', trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入座机号码', trigger: 'blur' }
        ],
        Emergency: [
          { required: true, message: '请选择紧急程度', trigger: 'change' }
        ],
      },
      ruleForm: {
        Applicant: '',
        engineerType: ''
      },
      dialogForm: {},
      options6: [
        {
          value: 12,
          label: '用水报装'
        },
      ],
      histroyData: {},
      maxHeight: 0,
      tableShow: false,
      tabsData: [
        {
          name1: '11',
          name2: '22',
          name3: false,
          name4: '44',
          name5: '55',
          name6: '66',
          name7: '77',
          name8: '88',
          name9: '99',
          name10: '1010',
        },
        {
          name1: '111',
          name2: '222',
          name3: true,
          name4: '444',
          name5: '555',
          name6: '666',
          name7: '777',
          name8: '888',
          name9: '999',
          name10: '101010',
        },
        {
          name1: '1111',
          name2: '2222',
          name3: true,
          name4: '4444',
          name5: '5555',
          name6: '6666',
          name7: '7777',
          name8: '8888',
          name9: '9999',
          name10: '10101010',
        },
      ],
      treedata: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      beginYearM: '',
      enterMeterDataShow: false,
      enterMeterDate: '',
      zoom: 16,
      markers: [],
      windows: [],
      center: [112.83713, 23.293752],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          // 这里通过高德 SDK 完成。
          let geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
      window: "",
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.Monitor-Scheduler .Monitor-Scheduler-right', ['.Monitor-Scheduler .table-top'])
    })
  },
  methods: {
    init() {

      this.histroyData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5,
      }
    },
    add() {//添加
      this.dialogFormVisible = true;
    },
    edit() {
      this.dialogFormVisible = true;
    },
    backTreeData() { },

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
$imgWidth: 200px;
$theme-color: #297acc;
.Monitor-Scheduler {
  .Monitor-Scheduler-right-content {
    height: 87%;
    overflow-y: auto;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    .kr-left {
      width: 30%;
      height: 100%;
      // border: 2px solid red;
    }
    .kr-right {
      width: 70%;
      height: 33.8rem;
    }
  }
  .btnBox {
    display: inline-block;
    width: 100%;
    text-align: center;
    margin-top: 2%;
  }
  .btnBox .el-button {
    margin-left: 2%;
    font-size: 14px;
  }
  .my-input {
    width: 30%;
    display: inline-block;
    padding-left: 10%;
    .el-input__inner {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
  }
  .my-input .el-input {
    width: 100% !important;
  }
  .my-input .el-select .el-input {
    width: 100%;
  }
  .dialogcontent {
    width: 100%;
    display: inline-block;
  }
  .dialogcontent span {
    width: 100%;
    display: inline-block;
    border-bottom: 1px solid;
  }
  .dialogcontent1 {
    width: 58%;
    display: inline-block;
  }
  .inputcontent {
    width: 52%;
    display: inline-block;
    border-bottom: 1px solid;
  }
  .dialogcontent2 {
    width: 58%;
    display: inline-block;
  }
  .dialogcontent3 {
    width: 40%;
    display: inline-block;
  }
  .dialogcontent3 .inputcontent {
    width: 100%;
    display: inline-block;
    border-bottom: 1px solid;
  }
  .kl-table {
    padding: 0 20px;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  .el-form {
    margin-left: 3%;
  }
  .demo-form-inline .el-input__inner {
    width: 9rem;
  }
}
</style>

