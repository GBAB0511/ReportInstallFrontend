<template>
  <!-- 用水人口变更 -->
  <div class="wPopulation">
    <el-form class="formBill" size="mini" :inline="true" :model="wPopulation" :disabled="editType==0||permission!=1" label-width="130px" ref="ruleForm">
      <!-- <legend class="legendColumn">用水人口</legend> -->
      <!-- <el-form-item label="用水人数：" style="margin-left: -3px">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableData.list.length" disabled="disabled" class="read-only" placeholder=""></el-input>
      </el-form-item> -->
      <el-form-item class="f2 btn-group">
        <el-button type="primary" size="mini" icon="el-icon-bottom" @click="exportTemplate">下载模板</el-button>
        <el-upload action="/" style="display: inline-block;" :http-request="importExcel" :show-file-list="false">
          <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
        </el-upload>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addTable">添加</el-button>
      </el-form-item>
      

      <el-table stripe border :data="tableData.list" :max-height="maxHeight" class="change-tables-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">

        </el-table-column>

        <el-table-column prop="name" label="用户姓名">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @change="getName()" v-model="scope.row.name"></el-input>
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
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  placeholder="证件号码" v-model="scope.row.certNo" :class="[{showRed:getShowRed(scope.$index)}]" 
              @change="checkCertNo(scope.row,scope.$index)">
              <el-button slot="append" class="scanning-btn" icon="el-icon-reading" type="primary" @click="idCard(scope.row)" size='mini'></el-button>
            </el-input>
          </template>

        </el-table-column>

        <el-table-column prop="linkTel" label="联系方式">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.linkTel"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="comments" min-width="120" label="备注">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.comments"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="connect" min-width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="removeTable(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-form>
     <div style="display: none">
      <object TYPE="application/x-itst-activex" clsid="{36C2AA6E-FE75-4EB0-A1F1-FCD918754506}" id="IDCardOper"></object>
      <table>
        <tbody>
          <tr>
            <td>
              水印文字：<input id="LogoMsg" type="text" value="捷宇专用" size="54">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <form>
                        设 备 ： <select id="Device" style="width:100px">
                          <option value="HID">HID</option>
                          <option value="COM1">COM1</option>
                          <option value="COM2">COM2</option>
                          <option value="COM3">COM3</option>
                          <option value="COM4">COM4</option>
                          <option value="COM5">COM5</option>
                          <option value="COM6">COM6</option>
                        </select>
                        波 特 率： <select id="Baud" style="width:100px">
                          <option value="9600">9600</option>
                          <option value="19200">19200</option>
                          <option value="38400">38400</option>
                          <option value="115200">115200</option>
                        </select>
                      </form>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <form>
                        扩展口： <select id="ExtPort" style="width:100px">
                          <option value="">无</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="K">K</option>
                        </select>
                        超时(秒)： <input id="Timeout" type="text" size="13" value="5">
                      </form>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <textarea id="CardInfo" rows="12" cols="64">身份证信息</textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      图片路径：<input id="ImgPath" type="text" value="D:\head.bmp" size="54">
                    </td>
                  </tr>

                  <tr>
                    <td>图片类型：<select id="ImgType" style="width:370px">
                        <option value="0">头像</option>
                        <option value="1">正面图片</option>
                        <option value="2">反面图片</option>
                        <option value="3">完整图片</option>
                        <option value="4">正面图片带水印</option>
                      </select></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="button" value="读身份证" onclick="ReadIDCard( )">
                      <input type="button" value="读居留证" onclick="ReadIDCardForeigner( )">
                      <input type="button" value="保存图片" onclick="SaveImg( )">
                      <input type="button" value="读取图片BASE64编码" onclick="GetImgBase64( )">
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td><img id="CardImg" src="" width="329" height="420" alt="图片" content="no-cache"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  

</template>
<script>
export default {
  name: "wPopulation",
  props: ['editType', 'wayOpen', 'needData','permissions'],
  data() {
    return {
      permission:1,
      idCardCheck: 0,
      wPopulation: {
        userNum: 0,
      },
      dictionaryData: [],
      WpopDicData: {},
      tableData: {
        list: [],
      },
      testNum: '',
      currentIndex :[],
      maxHeight: 200
    }
  },
  mounted() {
    if(this.permissions!=undefined&&this.permissions==0){
      // console.log('1111111111111');
      this.permission=this.permissions
    }
    this.getDictionarySelect()
    // 从详情进还是从添加按钮进
    // if (this.needData.idCuster) {
    //   this.init()
    // } else {
    //   if (Number(this.needData.ladderPersonNum) && this.needData.saveType == 'add') {
    //     for (let i = 0; i < Number(this.needData.ladderPersonNum); i++) {
    //       this.addTable()
    //     }
    //   }
    // }
    // this.$emit()
    this.tableData.list = this.needData.tableData
    this.$nextTick(() => {
      this.common.changeTable(this, '.wPopulation', ['.btn-group'])
      this.maxHeight = this.maxHeight - 20
    })

  },
  methods: {
    // 详情数据
    init() {
      let _this = this
      let params = {
        "busicode": "UserPersonQuery",
        "data": {
          changeId: this.needData.idCuster
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        
      })
    },
    idCard (row) {
      if (this.common.myBrowser() === 'IE') {
        this.$message.error('请使用其他浏览器，如谷歌，360浏览器等访问此页面')
        return
      }
      let IDCardName = 'IDCard';
      if(this.$store.state.photographic){
        // 使用同一段内容，但是通过名称来判断是用的方正高拍仪还是科荣高拍仪
        IDCardName = 'IDCardFangZheng';
      }
      if (!this[IDCardName].online) {
        this.$message.error('请连接高拍仪')
        return
      }
      this[IDCardName].ReadIDCard("certNo")
      setTimeout(() => {
        let idCardData = this[IDCardName].getAllData();
        const certNo = this.$store.state.photographic ? (idCardData.cardID || "") : (idCardData.CardId || "");
        const name = this.$store.state.photographic ? (idCardData.name || ""): (idCardData.Name || "");
        row.certNo = (certNo && certNo.length > 0) && certNo;
        row.name = (name && name.length > 0) && name;
      }, 2000);
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
    checkIDCard(code){
    // 加权因子
      const city={11:'北京',12:'天津',13:'河北',14:'山西',15:'内蒙古',21:'辽宁',22:'吉林',23:'黑龙江 ',31:'上海',32:'江苏',33:'浙江',34:'安徽',35:'福建',36:'江西',37:'山东',41:'河南',42:'湖北 ',43:'湖南',44:'广东',45:'广西',46:'海南',50:'重庆',51:'四川',52:'贵州',53:'云南',54:'西藏 ',61:'陕西',62:'甘肃',63:'青海',64:'宁夏',65:'新疆',71:'台湾',81:'香港',82:'澳门',91:'国外 '};
      return (code && /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) && (city[code.substr(0,2)]);
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
      }
    },
    validateSame() {
      return new Promise(resolve => {
        let data = []
        let tableData = this.tableData.list
        tableData.forEach((item,index)=>{
          data.push(item.certNo)
        })
          let params = {
            "busicode": "UserPersonQuerySame",
            "data": data,
          }
          this.$api.fetch({
            params,//参数
          }).then(res => {
            let currentIndex=[]
            // res.forEach((item,index)=>{
            //   currentIndex.push(item);
            // })
            currentIndex=res
            this.currentIndex=res
            if(currentIndex.length>0){
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch(() => {
            resolve(true)
          })
      })
    },
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
    getTableData() {
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
        obj.name = data[i].name || '';
        obj.certType = data[i].certType || '';
        obj.certNo = data[i].certNo || '';
        obj.linkTel = data[i].linkTel || '';
        obj.comments = data[i].comments || '';
        list.push(obj)
      }
      return list;
    },
    getName() {
      console.log((this.tableData.list));

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
      this.tableData.list.push({name: "",certType: "1",certNo: "",linkTel: "",comments: "",});
    },
    removeTable(i, row) {
      this.wPopulation.userNum--;
      this.tableData.list.splice(i, 1)
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
  height: 100%;
  .formBill {
    height: 100%;
    /deep/ {
      .el-select__caret {
        line-height: 28px;
      }
    }
  }
  .btn-group {
    float: right;
    text-align: right;
    margin: 4px 0 4px 0;
  }
  .showRed {
    /deep/ {
      .el-input__inner {
        color:red;
      }
    }
  }
  .scanning-btn{
    background: #409eff !important;
    color: #fff !important;
  }
}
</style>