<template>
  <!-- 用水人口变更 -->
  <div class="wPopulation">
    <el-form class="formBill" size="mini" :inline="true" :model="wPopulation" :disabled="editType==0" label-width="130px" ref="ruleForm">
      <!-- <legend class="legendColumn">用水人口</legend> -->
      <el-form-item label="用水人数：" style="margin-left: -3px">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableData.list.length" disabled="disabled" class="read-only" placeholder=""></el-input>
      </el-form-item>
      <div style="float:right;">
        <el-button type="primary" size="mini" icon="el-icon-plus" style="float:right;margin-left:10px;" @click="addTable">添加</el-button>
        <el-upload action="/" class="upload-demo" style="float:right;margin-left:10px;" :http-request="importExcel" :show-file-list="false">
          <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
        </el-upload>
        <el-button type="primary" size="mini" icon="el-icon-bottom" style="float:right;" @click="exportTemplate">导出模板</el-button>
        
      </div>
      
      <el-table stripe border :data="tableData.list" class="change-tables-table">
        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">

        </el-table-column>

        <el-table-column prop="name" label="用户姓名">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" @change="getName()" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="certType" label="证件类型">
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.certType" placeholder="">
              <el-option v-for="(item,index) in dictionaryData.IDT" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="certNo" min-width="130" label="证件号码">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" @change="checkCertNo(scope.row,scope.$index)" placeholder="证件号码" v-model="scope.row.certNo" :class="['input-with-select',{showRed:getShowRed(scope.$index)}]" >
              <el-button slot="append" class="scanning-btn" icon="el-icon-reading" type="primary" @click="idCard()" size='mini'></el-button>
            </el-input>
          </template>

        </el-table-column>

        <el-table-column prop="linkTel" label="联系方式">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="scope.row.linkTel"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="comments" min-width="120" label="备注">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="scope.row.comments"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="connect" min-width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="removeTable(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-form>
  </div>

</template>
<script>
export default {
  name: "wPopulation",
  props: ['editType', 'wayOpen'],
  data() {
    return {
      idCardCheck: 0,
      wPopulation: {
        userNum: 4,
      },
      dictionaryData: [],
      WpopDicData: {},
      currentIndex:[],
      tableData: {
        list: [
          {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
          {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
          {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
          {name: "",certType: "1",certNo: "",linkTel: "",comments: "",},
        ],
      },
      testNum: ''
    }
  },
  mounted() {
    this.init();
    this.getDictionarySelect()
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    submit() {
      let list = [];
      let data = this.tableData.list;
      for (let i = 0; i < data.length; i++) {
        let obj = {
          // id: '',
          name: "",
          certType: "",
          certNo: "",
          linkTel: "",
          comments: "",
        };
        // obj.id = data[i].id;
        obj.name = data[i].name;
        obj.certType = data[i].certType;
        obj.certNo = data[i].certNo;
        obj.linkTel = data[i].linkTel;
        obj.comments = data[i].comments;
        list.push(obj)
      }
      return list;
    },
    // 保存用水人口列表数据接口
    // wPopulationSubmit(id) {
    //   let _this = this
    //   let params = {
    //     "busicode": "UserPersonAdd",
    //     "data": {
    //       changeId: id,
    //       list: this.submit()
    //     },
    //   }
    //   this.$api.fetch({
    //     params,//参数
    //   }).then(res => {

    //   })
    // },
    exportTemplate(){
      var params = {
        busicode: "UserPersonExport",
        data: {
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURI(JSON.stringify(params))
      );
    },
    importExcel(file){
      let _this = this;
      let params = {
        busicode: "UserPersonImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.tableData.list=res
      })
    },
    checkCertNo(row,index){
      let _this = this
      let val = row.certNo
      if("1"===row.certType && !this.checkIDCard(val)){
        if(this.currentIndex.indexOf(index)===-1){
          this.currentIndex.push(index)
        }
        this.$notify({
          title: '警告',
          message: '身份证件号码不符合格式要求，请检查证件类型',
          type: 'error'
        });
        return false
      }else {
        this.currentIndex.splice(this.currentIndex.indexOf(index),1)
      }
      /*去掉每一行请求后台
      let data = []
      this.tableData.list.forEach((item,index)=>{
        data.push(item.certNo)
      })
      data.push()
        let params = {
          "busicode": "UserPersonQuerySame",
          "data": data,
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          this.currentIndex=[]
          res.forEach((item,index)=>{
            this.currentIndex.push(item);
          })
          if(this.currentIndex.length>0){
            this.$notify({
              title: '警告',
              message: '身份证件号码存在重复，请检查',
              type: 'error'
            });
          }
        })
      */
    },
    checkIDCard(code){
    // 加权因子
      const city={11:'北京',12:'天津',13:'河北',14:'山西',15:'内蒙古',21:'辽宁',22:'吉林',23:'黑龙江 ',31:'上海',32:'江苏',33:'浙江',34:'安徽',35:'福建',36:'江西',37:'山东',41:'河南',42:'湖北 ',43:'湖南',44:'广东',45:'广西',46:'海南',50:'重庆',51:'四川',52:'贵州',53:'云南',54:'西藏 ',61:'陕西',62:'甘肃',63:'青海',64:'宁夏',65:'新疆',71:'台湾',81:'香港',82:'澳门',91:'国外 '};
      return (code && /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) && (city[code.substr(0,2)]);
  },
  getShowRed(index){
      let flag = false
      let data = this.tableData.list
      this.currentIndex.forEach((i)=>{
        if(index===i){
          flag=true
        }
      })
      return flag
    },
    getName() {
      console.log((this.tableData.list));

    },
    init(val) {
      if (val) {
        this.tableData.list = val
      } else {
        this.tableData.list = [{name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
        {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
        {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}, 
        {name: "",certType: "1",certNo: "",linkTel: "",comments: "",}]
      }
    },

    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CTT,IDT,CDL"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },

    addTable() {
      this.tableData.list.push({name: "",certType: "1",certNo: "",linkTel: "",comments: ""});
    },
    removeTable(i, row) {
      this.wPopulation.userNum--;
      this.tableData.list.splice(i, 1)
      const red = this.currentIndex.indexOf(i);
      if(red>-1){
        this.currentIndex.splice(red,1)
      }
    },

    indexMethod(index) {//获取表格序号 
      return (index + 1);
    },

  },
  watch: {
      
  },
}
</script>
<style lang="scss" scoped>
.wPopulation {
  /deep/ {
    .showRed {
      .el-input__inner {
        color:red;
      }
    }
  }
}
</style>