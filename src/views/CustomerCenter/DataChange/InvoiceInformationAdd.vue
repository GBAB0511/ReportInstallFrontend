<template>
    <div class="InvoiceInformationAdd">
        <el-form class="backfillSubmitForm" :inline="true" :model="InvoiceInformationAddForm" label-width="160px" ref="ruleForm" :rules="rules">
          <legend>客户信息</legend>

          <el-form-item label="客户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.ctmNo" placeholder="01003152" ></el-input>
          </el-form-item>
          <el-form-item label="客户名称：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.ctmName" placeholder="谢顺新" ></el-input>
          </el-form-item>
          <el-form-item label="客户地址：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.ctmAddr" placeholder="宝积山路、体育巷" ></el-input>
          </el-form-item>
          <el-form-item label="客户类型：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.ctmType" placeholder="普通用户" ></el-input>
          </el-form-item>
          <el-form-item label="信用等级：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.creditLevel" placeholder="二级" ></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.linkName" placeholder="谢顺新" ></el-input>
          </el-form-item>
          <el-form-item label="座机号码：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.linkTel" placeholder="13662592308" ></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.mobile" placeholder="13662592308" ></el-input>
          </el-form-item>


          <legend>账户信息</legend>
          <el-form-item label="账户编号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.PriceStrategy" placeholder="101801012001" ></el-input>
          </el-form-item>
          <el-form-item label="账户类型：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.PriceStrategy" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item label="缴费方式：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.PriceStrategy" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item :label="v.label" v-for="(v,i) in InvoiceInformationAddForm.countMsg" :key="i">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="v.value" :placeholder="v.tips" ></el-input>
          </el-form-item>
          <el-form-item label="开户行：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.PriceStrategy" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item :label="v.label" v-for="(v,i) in InvoiceInformationAddForm.countMsgOrder" :key="i">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="v.value" :placeholder="v.tips" ></el-input>
          </el-form-item>

          <legend>开票信息</legend>
          <el-form-item label="发票类型：" prop="desc">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.desc" placeholder=""></el-input>
          </el-form-item>
          <el-form-item :label="v.label" v-for="(v,i) in InvoiceInformationAddForm.InvoiceInformation" :key="i">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="v.value" :placeholder="v.tips"></el-input>
          </el-form-item>
          <el-form-item label="开户行：">
            <el-select clearable v-model="InvoiceInformationAddForm.year" placeholder="">
              <el-option v-for="(item,index) in InvoiceInformationAddForm.bankName" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="银行账号：" class="idCard">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="InvoiceInformationAddForm.bankCountNum" placeholder="">
              <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" size='mini'></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="投递方式：">
            <el-select clearable v-model="InvoiceInformationAddForm.year" placeholder="自取">
              <el-option v-for="(item,index) in InvoiceInformationAddForm.yyy" :key="index" :label="item.name" :value="item.value"></el-option>

            </el-select>
          </el-form-item>

        </el-form>
    </div>
</template>
<script>
export default {
  name: "InvoiceInformationAdd",

  data() {
    return {
      tabName:"after",
      InvoiceInformationAddForm: {
          ctmNo:"",
          ctmName:"",
          ctmAddr:"",
          ctmType:"",
          creditLevel:"",
          linkName:"",
          linkTel:"",
          mobile:"",
        
        countMsg: [
          {
            label: "余额：",
            value: "",
            tips: ""
          },

          


        ],
        aaaa: '',
        aaaas: [
          {
            name: "公户",
            value: "1"
          },
          {
            name: "私户",
            value: "2"
          }
        ],
        countMsgOrder: [
          {
            label: "开户名：",
            value: "",
            tips: "梅州粤海水务有限公司"
          },
          {
            label: "银行账户：",
            value: "",
            tips: "101801012001"
          },
          {
            label: "托号：",
            value: "",
            tips: "101801012001"
          },
          {
            label: "托收合同号：",
            value: "",
            tips: "101801012001"
          },

          // {
          //     label:"银行签约日期：",
          //     value:"",
          //     tips:"20180-02-13"
          // },
        ],
        InvoiceInformation: [
          {
            label: "单位名称：",
            value: "",
            tips: ""
          },
          {
            label: "纳税人识别号：",
            value: "",
            tips: "12441400714861777E "
          },
          {
            label: "联系地址：",
            value: "",
            tips: ""
          },
          {
            label: "座机号码：",
            value: "",
            tips: ""
          },


        ],
        bankCountNum: "",
        desc: "",
        userNume: "",
        descoptions: [
          {
            name: "普通用户",
            value: "1"
          },
          {
            name: "VIP客户",
            value: "2"
          },
          {
            name: "大客户",
            value: "3"
          },
        ],
        PaymentMethod: [
          {
            name: "托收",
            value: "4"
          }
        ],
        bankName: [
          {
            name: "中国银行",
            value: '1'
          }
        ],
        yyy: [
          {
            name: "自取",
            value: '1'
          },
          {
            name: "邮寄",
            value: '1'
          },
          {
            name: "上门派送",
            value: '1'
          },
        ],
        descoptions: [
          {
            name: "启用",
            value: '2'
          },
          {
            name: "停用",
            value: '4'
          },
        ],
        PriceStrategy: "",
        isfines: "",
        UpdateCodeCopye: "",
        Remarks: "",
        year: ""
      },
      rules: {
        userNume: [
          { required: true, message: '请输入用户编号', trigger: 'blur' },
        ],
        desc: [
          { required: true, message: '请输入发票类型', trigger: 'blur' },
        ]
      },
      histroyData: {},

    }
  },
  mounted() {
    this.init();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
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
            areaName: [],
            code: "C7551990000003",
            concentrator: "全免",
            connect: null,
            daytime: "张三",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "全免",
            lvalue: [],
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
            daytime: "李四",
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
            daytime: "王五",
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
            daytime: "赵六",
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

  }
}
</script>
<style lang="scss">
.InvoiceInformationAdd {
  .el-tabs--border-card>.el-tabs__content {
    padding: 0px 0px;
}
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-input__inner {
    height: 30px;
  }
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  legend {
    background: #f5f5f5;
    font-weight: 700;
    font-size: 12px;
    padding: 5px 20px;
    font-size: 14px;
  }
  .backfillSubmitForm {
    // margin-top: 15px;
  }
  .backfillSubmitForm {
    padding: 0px 10px;
    width: 98%;
    .el-form-item {
      width: 32%;
      .el-form-item__content {
        width: 50%;
        .el-select {
          width: 100%;
        }
      }
    }
    .right-btn {
      text-align: right;
      width: 100%;
    }
    .from-table {
      width: 100%;
      .el-form-item__content {
        width: 100%;
      }
    }
    .userAdress {
      width: 80%;
      .el-form-item__content {
        width: calc(100% - 160px);
        .el-form-item__label {
          width: 100px !important;
        }
        .el-textarea,
        .el-input {
          width: 30%;
        }
        .el-select {
          width: 20%;
        }
        .el-checkbox-group {
          display: inline-block;
          width: 50%;
        }
      }
    }
    .selectCheck {
      width: 100%;
      .el-form-item__content {
        width: calc(100% - 160px);
        .el-form-item__label {
          width: 80px !important;
        }
        .el-textarea,
        .el-input {
          width: 20%;
        }
        .el-select {
          width: 20%;
        }
        .el-checkbox-group {
          display: inline-block;
          width: 77%;
        }
      }
    }

    .Remarks {
      width: 100%;
      .el-form-item__content {
        width: calc(100% - 160px);
      }
    }
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
}
</style>