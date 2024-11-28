<template>
  <div class="commonPart">
    <el-form v-if="commonPartForm.parentToChild == '1'" size="mini" class="commonPartFormOne commonPartForm" :inline="true" :model="commonPartForm" label-width="130px" ref="ruleForm" :rules="rules">

      <el-tooltip class="item" effect="dark" v-if="Dimens==1" content="请输入水表编号" placement="top">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="keyword-input"  v-model=" commonPartForm.ctmNo" placeholder="" @keydown.enter.native="demand"></el-input>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" v-else-if='Dimens==2' content="请输入册本号" placement="top">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="keyword-input"  v-model=" commonPartForm.ctmNo" placeholder="请输入册本号" @keydown.enter.native="demand"></el-input>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" v-else content="请输入户号/账号/客户编号/手机号/身份证号" placement="top">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="keyword-input"  v-model=" commonPartForm.ctmNo" placeholder="" @keydown.enter.native="demand"></el-input>
      </el-tooltip>
      <div class="keyword-bottom">
        <el-button size="mini" class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
      </div>

      <el-form-item label="单据编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmNo" placeholder="01003152"></el-input>
      </el-form-item>
      <el-form-item label="单据日期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmName" placeholder="2019年11月21日"></el-input>
      </el-form-item>
    </el-form>

    <el-form v-if="commonPartForm.parentToChild == '2'" size="mini" class="commonPartFormTwo commonPartForm " :inline="true" :model="commonPartForm" label-width="130px" ref="ruleForm" :rules="rules">
      <el-tooltip class="item" effect="dark" content="请输入户号/账号/客户编号/手机号/身份证号" placement="top">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="keyword-input" v-model=" commonPartForm.ctmNo" placeholder="" @keydown.enter.native="demand"></el-input>
      </el-tooltip>
      <div class="keyword-bottom">
        <el-button size="mini" class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
      </div>

      <el-form-item label="单据编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmNo" placeholder="01003152"></el-input>
      </el-form-item>
      <el-form-item label="单据日期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmName" placeholder="2019年11月21日"></el-input>
      </el-form-item>

      <legend class="legendColumn">用户信息</legend>
      <el-form-item label="客户编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmNo" placeholder="01003152"></el-input>
      </el-form-item>
      <el-form-item label="客户名称：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmName" placeholder="谢顺新"></el-input>
      </el-form-item>
      <el-form-item label="客户地址：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmAddr" placeholder="宝积山路、体育巷"></el-input>
      </el-form-item>
      <el-form-item label="用户编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.ctmNo" placeholder="01003152"></el-input>
      </el-form-item>
      <el-form-item label="证件号码：" style="width: calc(46% + 10px)">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model=" commonPartForm.mobile" placeholder="444210199909100030092"></el-input>
      </el-form-item>

    </el-form>

    <el-form v-if="commonPartForm.parentToChild == '3'" size="mini" class="commonPartFormThree commonPartForm" :inline="true" :model="commonPartForm" label-width="130px" ref="ruleForm" :rules="rules">
      <el-form-item label="单据编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model="commonPartForm.billNo" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="单据日期：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" class="read-only" disabled="disabled" v-model="commonPartForm.billDate" placeholder=""></el-input>
      </el-form-item>
    </el-form>

  </div>

</template>
<script>
export default {
  name: "commonPart",
  props: ['commonPartForm', 'Dimens'],
  data() {
    return {
      tabsName: "after",
      rules: {
        userNume: [
          { required: true, message: '请输入用户编号', trigger: 'blur' },
        ],
        // desc: [
        //   { required: true, message: '请输入发票类型', trigger: 'blur' },
        // ]
      },
      histroyData: {},

    }
  },
  mounted() {
    this.init();
    console.log(this.commonPartForm);

  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {

    },
    demand() {

    }

  }
}
</script>
<style lang="scss">
.commonPart {
  margin-top: 20px;
  .commonPartFormOne {
    height: 50px;
  }
  .commonPartFormTwo {
    // height: 150px;
  }
  .commonPartFormThree {
    // height: 30px;
  }
  .keyword-input {
    width: 195px;
    margin-right: 10px;
    margin-left: 50px;
  }
  .keyword-bottom {
    display: inline-block;
    height: 40px;
    line-height: 40px;
  }
  .el-form-item {
    // margin-bottom: 0px !important;
  }
  .el-input__inner {
    height: 30px;
  }
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  .commonPartForm {
    .el-form-item {
      width: 26%;
      .el-form-item__content {
        width: calc(100% - 130px);
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
        width: calc(100% - 130px);
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
        width: calc(100% - 130px);
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
        width: calc(100% - 130px);
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