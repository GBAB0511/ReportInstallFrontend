
<template>

  <div class="OfferWaterContract">
    <!-- <div class="bread-contain">
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="submitTemplate(i.fjName)" v-for="i in templateList" :key="i.id">打印{{i.templateName}}</el-button>
        <el-button size="mini" type="primary" @click="save" v-if="editType == 1">保存</el-button>
        <el-button size="mini" type="primary" @click="resignContract" v-if="editType == 0">重签 </el-button>
      </div>
    </div>  -->
    <div class="toolbar">
      <el-form :model="tableQuery" class="demo-form-inline" :inline="true"  label-width="130px"  size="mini" :rules="rules" ref="form">
        <!-- <el-form-item label="户号：" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.userNo" placeholder="" clearable @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.certNo" placeholder="" clearable @input="e => input = inputMe(e)"></el-input>
        </el-form-item> -->

        <el-form-item style="width: 50%">
          <span>户号：{{ tableQuery.userNo }}，身份证号：{{ tableQuery.certNo }}，户名：{{ tableQuery.ctmName }}，用户地址：{{ tableQuery.ctmAddr }}</span>
        </el-form-item>

      <!--
        <el-form-item label=" ">
          <el-button size="mini" type="primary" v-if="eleContract" @click="newContract" :disabled="elecDisabled">创建电子合同</el-button>
        </el-form-item>
         -->
        <br>
        <!-- <el-form-item label="户名：" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.name" placeholder="" clearable @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" class="width-150">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.mobile" placeholder="" clearable @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="类型：" class="width-150">
          <el-select clearable v-model="tableQuery.contractType" placeholder="">
            <el-option v-for="(item,index) in dictionaryData.CONTRACT_TYPE" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" class="width-150">
          <el-select clearable v-model="tableQuery.contractStatus" placeholder="">
            <el-option v-for="(item,index) in dictionaryData.CONTRACT_STATUS" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </div>

    <div class="kl-table" :style="{height: maxHeight + 'px'}" style="margin-top:10px">
      <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border :data="tableData.list">
        <el-table-column type="index" label="序号" width="50" fixed="left" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="name" min-width="120" label="名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="certNo" min-width="180" label="证件号码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userNo" min-width="180" label="户号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractNo" min-width="150" label="合同编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractTypeName" min-width="120" label="类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractStatusName" min-width="110" label="状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="comments" min-width="110" label="备注" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" min-width="180" label="创建时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createName" min-width="110" label="创建人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="updateTime" min-width="180" label="更新时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="updateName" min-width="110" label="更新人" show-overflow-tooltip>
        </el-table-column>
        <!-- 
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-upload
              v-if="scope.row.contractStatus && scope.row.contractStatus =='7'"
              action="/"
              :http-request="(file) => {
                return uploadAttachmentRow(file, scope.row);
              }"
              style="display:inline-block;margin-right: 10px;"
              :show-file-list="false"
            >
              <el-button type="text">上传合同附件</el-button>
            </el-upload>
            <el-button type="text" v-if="scope.row.contractStatus ==='1' || scope.row.contractStatus == '2' || scope.row.contractStatus == '3'|| scope.row.contractStatus == '5'|| scope.row.contractStatus == '6' || scope.row.contractStatus == '7'" @click.stop="priview(scope.row)">预览</el-button>
            <el-button type="text" v-if="scope.row.contractFileAddr && scope.row.contractFileAddr!==''" @click.stop="priview(scope.row)">预览</el-button>
             <el-button type="text" v-if="scope.row.contractStatus && scope.row.contractStatus!=='6'" @click.stop="cancel(scope.row)">作废</el-button> 
            <el-button type="text" v-if="scope.row.contractStatus && scope.row.contractStatus == '1'" @click.stop="urgeSign(scope.row)">发送催签消息</el-button> 
            <el-button type="text" v-if="scope.row.contractStatus && scope.row.contractStatus == '7'" @click.stop="finishSign(scope.row)">签约完成</el-button>
          </template>
        </el-table-column>
        -->
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
    </div>

    <el-dialog :destroy-on-close="true" :close-on-click-modal="false" :title="contractTitle" :visible.sync="contractVisible" append-to-body @close="closeDialog">
      <div class="toolbar" style="text-align:center">
        <el-button size="mini" type="primary" v-if="visibleType == 'ordinary'" @click="priviewContract()">预览合同模板</el-button>
        <!-- <el-upload
          v-if="visibleType == 'ordinary'"
          action="/"
          :http-request="uploadAttachment"
          style="display:inline-block;margin-right: 10px;"
          :show-file-list="false"
        >
          <el-button size="mini" type="primary">上传合同附件</el-button>
        </el-upload> -->
      </div>
      <el-form :model="dialogForm" ref="dialogForm" :rules="diaRules" label-width="100px" class="formBill-Two" :inline="true">
        <el-form-item label="合同类型：" prop="contractType">
          <el-select clearable v-model="dialogForm.contractType" placeholder="">
            <el-option v-for="(item,index) in dictionaryData.CONTRACT_TYPE" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同编号：" prop="contractNo">
          <el-input  v-model="dialogForm.contractNo" size="mini" clearable :disabled="visibleType == 'electron'"></el-input>
        </el-form-item>
        <el-form-item label="户号：" prop="userNo">
          <el-input v-model="dialogForm.userNo" size="mini" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="户名：" prop="name">
          <el-input v-model="dialogForm.name" size="mini" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="证件类型：" prop="certTypeName">
          <el-input v-model="dialogForm.certTypeName" size="mini" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="证件号码：" prop="certNo">
          <el-input v-model="dialogForm.certNo" size="mini" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="dialogForm.mobile" size="mini" clearable disabled></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="visibleType == 'ordinary'" label="附件：" prop="contractFileAddr">
          <span>{{ dialogForm.contractFileName }}</span>
          <el-button v-if="dialogForm.contractFileName" type="primary" size="mini" @click="deleteFile()">删除</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="save()">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="templateShow" append-to-body style="width:50%;margin-left:22%" title="请选择合同模板">
      <el-form :inline="true">
        <el-form-item label="合同模板：" class="with300">
          <el-select v-model="contractTemplate" placeholder="">
            <el-option v-for="(item,index) in contractTemplateData" :key="index" :label="item.contractName" :value="item.ecCategoryId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="createContract('electron')">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeTemplateShow">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadPic"; //上传附件
export default {
  name: "OfferWaterContract",
  components:{uploadFile},
  props: ['OfferWaterContractParams'],
  data() {
    return {
      contractTemplate:'',// 选择的合同模板
      templateShow:false,//合同模板弹窗
      contractTemplateData: [],//合同模板数据
      eleContract: false,
      // editType:0,
      dictionaryData: {},
      rules: {
        // contractNo: [{ required: true, message: "合同编号不能为空", trigger: 'blur' }],
        // ctmName: [{ required: true, message: "客户名称不能为空", trigger: 'blur' }],
        // certNo: [{ required: true, message: "证件类型不能为空", trigger: 'blur' }],
        // certType: [{ required: true, message: "客户类型不能为空", trigger: 'change' }],
      },
      diaRules:{
        contractType: [{ required: true, message: "合同类型不能为空", trigger: ['blur', 'change'] }]
      },
      tableQuery: {
        userNo: "",
        certNo: "",
        ctmName: "",
        ctmAddr: "",
        // mobile: "",
        // contractType: "",
        // contractStatus: "",
        // businessArea:'',
        // useWaterType:[],
        page: 1,
        pageCount: 20,
      },
      tableShow: false,
      maxHeight: 0,
      // 列表数据
      tableData: {},
      userData: {},
      // 弹窗
      contractVisible: false,
      contractTitle: "",
      visibleType: "",
      dialogForm: {

      },
      elecDisabled: false,
    }
  },
  mounted() {
    if (this.OfferWaterContractParams.meterList.length >= 1) {
      this.tableQuery.userNo = this.OfferWaterContractParams.meterList[0].userInfo.userNo
      this.tableQuery.certNo = this.OfferWaterContractParams.meterList[0].userInfo.certNo
      this.tableQuery.ctmName = this.OfferWaterContractParams.meterList[0].userInfo.ctmName
      this.tableQuery.ctmAddr = this.OfferWaterContractParams.meterList[0].userInfo.ctmAddr
    }
    console.log(this.OfferWaterContractParams);
    this.getConfig()
    this.getDictionarySelect()
    this.init()
    this.common.changeTable(this, ".OfferWaterContract", [
      ".OfferWaterContract .toolbar",
      ".OfferWaterContract .block",
    ]);
  },
  methods: {
    // 合同模版
    newContract(){
      this.templateShow = true;
      var params = {
        busicode: "ContractConfigList",
        data: {
          "contractType": "2",//默认查询电子供水合同
        }
      };
      this.$api.fetch({ params: params }).then(res => {
        this.$set(this, "contractTemplateData", res);
        this.contractTemplate = res[0].ecCategoryId;
      }).catch(res => {
        this.$set(this, "contractTemplateData", []);
      });
    },
    closeTemplateShow(){
      this.templateShow = false;
      this.contractTemplate = ''
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    init() {
      let params = {
        busicode: "ContractHistoryList",
        data: {
          userNo: this.OfferWaterContractParams.meterList.map(item => {
            return item.userInfo.userNo
          }).join(','),
          projectId: this.OfferWaterContractParams.id,
          page: this.tableQuery.page,
          pageCount: this.tableQuery.pageCount,
        }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData = res.pageInfo
        this.userData = res.userInfo
        this.common.changeTable(this, ".OfferWaterContract", [
          ".OfferWaterContract .toolbar",
          ".OfferWaterContract .block",
        ]);
        let temUserNoList1 = []
        let temUserNoList2 = []
        this.OfferWaterContractParams.meterList.forEach(item1 => {
          temUserNoList1.push(item1.userInfo.userNo)
        })
        res.pageInfo.list.forEach(item2 => {
          temUserNoList2.push(item2.userNo)
        })
        try {
          // 有一户没有都可以创建
          if (this.getArrDifference(temUserNoList1, temUserNoList2).length > 0) {
            this.elecDisabled = false
            throw new Error()
          }else{ // 所有户都有，有一户合同是签约失败或者作废都可以创建
            res.pageInfo.list.forEach(item2 => { 
              let temList = []
              res.pageInfo.list.forEach(item3 => {
                if (item2.userNo == item3.userNo) {
                  temList.push(item3)
                }
              })
              if (temList.some(item => item.contractStatus !== "3" && item.contractStatus !== '6')) {
                console.log(item2.userNo);
                this.elecDisabled = true
              }else{
                console.log(item2.userNo);
                this.elecDisabled = false
                throw new Error()
              }
            })
          }
        } catch (err) {
        }
        
      })
    },
    getArrDifference(arr1, arr2){
      return arr1.concat(arr2).filter(function(value, i, arr){
        return arr.indexOf(value) === arr.lastIndexOf(value);
      })
    },
    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CONTRACT_STATUS,CONTRACT_TYPE"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData", res);
      }).catch(res => {
        this.$set(this, "dictionaryData", []);
      });
    },
    inputMe(e){
      let str=e.replace(/\ +/g,"")
      str=str.replace(/[\r\n]/g,"")
      return str;
    },
    createContract(type){
      if (type == "electron") { // 电子合同
        // if (this.userData.contractStatus !== '0' && this.userData.contractStatus !== '6' && this.userData.contractStatus !== '3') {
        //   this.$message.error(this.userData.name + "已签电子合同，如需重签请先作废旧合同！")
        //   return
        // }else{
          
        // }
        this.$confirm('是否确认签署电子合同？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // let tem = JSON.parse(JSON.stringify(this.userData))
          // tem.contractType = "0"
          // tem.contractTypeName = "电子供水合同"
          console.log(this.OfferWaterContractParams.meterList);
          let temList = []
          if (this.tableData.list.length == 0) {
            this.OfferWaterContractParams.meterList.forEach(item => {
              let tem = {
                contractType: "2",
                contractNo: item.userInfo.contractNo,
                userNo: item.userInfo.userNo,
                name: item.userInfo.ctmName,
                // contractTypeName: item.contractNo,
                certNo: item.userInfo.certNo,
                mobile: item.userInfo.mobile,
                ctmAddr: item.userInfo.ctmAddr,
                projectId: this.OfferWaterContractParams.id,
                billNo: this.OfferWaterContractParams.billNo,
              }
              temList.push(tem)
            })
          }else{
            this.OfferWaterContractParams.meterList.forEach(item => {
              if (this.tableData.list.every(item2 => item2.userNo !== item.userInfo.userNo)) {
                let tem = {
                  contractType: "2",
                  contractNo: item.userInfo.contractNo,
                  userNo: item.userInfo.userNo,
                  name: item.userInfo.ctmName,
                  // contractTypeName: item.contractNo,
                  certNo: item.userInfo.certNo,
                  mobile: item.userInfo.mobile,
                  ctmAddr: item.userInfo.ctmAddr,
                  projectId: this.OfferWaterContractParams.id,
                  billNo: this.OfferWaterContractParams.billNo,
                }
                temList.push(tem)
              }else{
                let filterList = this.tableData.list.filter(item3 => {
                  return item.userInfo.userNo === item3.userNo
                })
                if (filterList.every(item2 => item2.contractStatus === "3" || item2.contractStatus === '6')) {
                  let tem = {
                    contractType: "2",
                    contractNo: item.userInfo.contractNo,
                    userNo: item.userInfo.userNo,
                    name: item.userInfo.ctmName,
                    // contractTypeName: item.contractNo,
                    certNo: item.userInfo.certNo,
                    mobile: item.userInfo.mobile,
                    ctmAddr: item.userInfo.ctmAddr,
                    projectId: this.OfferWaterContractParams.id,
                    billNo: this.OfferWaterContractParams.billNo,
                  }
                  temList.push(tem)
                }
              }
            })
          }
          if (this.contractTemplate == '') {
            this.$message.warning('请选择合同模板');
            return
          }
          var params = {
            busicode: "NewContractManageAdd",
            data: {
              contractType: "2",
              contractManageBeanList: temList,
              ecCategoryId: this.contractTemplate
            },
          };
          this.$api.fetch({
            params: params //参数
          })
          .then(res => {
            this.$message.success(res);
            this.templateShow = false;
            this.contractTemplate = ''
            this.init()
          });
        }).catch(() => {
        });
      }else if(type == "ordinary"){ // 普通合同
        if (this.OfferWaterContractParams.meterList.length > 1) {
          this.$message.error("多水表签署合同请立户后在用户管理签署")
        }else{
          console.log(this.tableData.list.every((item) => (item.contractStatus != '1' && item.contractStatus != '2' && item.contractStatus != '5' && item.contractStatus != '7' )));
          if (this.tableData.list.every((item) => (item.contractStatus != '1' && item.contractStatus != '2' && item.contractStatus != '5' && item.contractStatus != '7' ))) {//未签署或者作废
            this.$confirm('是否确认签署普通合同？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.contractVisible = true
              this.visibleType = "ordinary"
              this.contractTitle = "创建普通合同"
              this.$set(this, 'dialogForm', {})
              this.dialogForm.userNo = this.OfferWaterContractParams.meterList[0].userInfo.userNo
              this.initContract()
            }).catch(() => {
            });
          }else{
            this.$message.error(this.tableQuery.ctmName + "已签合同，如需重签请先作废旧合同！")
            return
          }
        }

      }
    },
    priview(row){
      if (row.contractType == "2") {
        let params = {
          busicode: "EcContractPreview",
          data: {
            userNo: row.userNo,
            projectId: this.OfferWaterContractParams.id,
            contractNo: row.contractNo,
            contractType: row.contractType,
            fileId: row.fileId,
          },
          token: sessionStorage.getItem("token"),
          sysType: '002',
        };
        window.open( this.common.getExportExcelIp() + window.location.pathname + 'exportPdf.api?json=' + encodeURIComponent(JSON.stringify(params)))
      }else{
        window.open(row.contractFileAddr)
      }
      
    },
    cancel(row){
      this.$confirm('是否确认作废该合同？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "ContractManageDelete",
          data: row
        };
        params.data.projectId = this.OfferWaterContractParams.id
        this.$api.fetch({params}).then(res => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.init()
        })
      }).catch(() => {
      });

    },
    // 催签
    urgeSign(row){
      let params = {
        busicode: "ContractNotify",
        data: {
          userNo: row.userNo,
          contractNo: row.contractNo,
          contractType: row.contractType,
          contractStatus: row.contractStatus,
          projectId: this.OfferWaterContractParams.id,
        }
      };
      this.$api.fetch({params}).then(res => {
        this.$message({
          type: 'success',
          message: '催签成功!'
        });
        this.init()
      })
    },
    // 签约完成
    finishSign(row){
      this.$confirm('是否确认签约完成？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          busicode: "ContractComplete",
          data: {
            userNo: row.userNo,
            contractNo: row.contractNo,
            contractType: row.contractType,
            contractStatus: row.contractStatus,
            projectId: this.OfferWaterContractParams.id
          }
        };
        this.$api.fetch({params}).then(res => {
          this.$message({
            type: 'success',
            message: '签约成功!'
          });
          this.init()
        })
      }).catch(() => {
      });
    },
    getConfig() {
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'ec_pe_categoryId',
        }
      };
      this.$api.fetch({params}).then(res => {
        if (res.list.length && res.list[0].configValue) {//为01则启用
          this.eleContract = true;
        }
      })
    },
    initContract(){
      // let params = {
      //   busicode: "ContractGetUserInfo",
      //   data: {
      //     userNo: this.dialogForm.userNo,
      //     projectId: this.OfferWaterContractParams.id,
      //   }
      // };
      // this.$api.fetch({params}).then(res => {
      //   this.$set(this, 'dialogForm', res)
      //   // this.dialogForm = {
      //   //   contractType: res.contractType,
      //   //   contractNo: res.contractNo,
      //   //   userNo: res.userNo,
      //   //   name: res.name,
      //   //   contractTypeName: res.contractTypeName,
      //   //   certNo: res.certNo,
      //   //   mobile: res.mobile,
      //   // }
      //   console.log(this.dialogForm);
      // })
      this.dialogForm = {
        contractType: "3",
        contractNo: this.OfferWaterContractParams.meterList[0].userInfo.contractNo,
        userNo: this.OfferWaterContractParams.meterList[0].userInfo.userNo,
        name: this.OfferWaterContractParams.meterList[0].userInfo.ctmName,
        // contractTypeName: this.OfferWaterContractParams.meterList[0].userInfo.contractNo,
        certNo: this.OfferWaterContractParams.meterList[0].userInfo.certNo,
        mobile: this.OfferWaterContractParams.meterList[0].userInfo.mobile,
        ctmAddr: this.OfferWaterContractParams.meterList[0].userInfo.ctmAddr,
      }
    },
    //上传附件
    uploadAttachment(file, fileList) {
      let _this = this;
      var params = {
        busicode: "ContractAccessoryUpload",
        type: "upload",
        data: {
          file: file.file,
          projectId: this.OfferWaterContractParams.id,
        },
      };
      this.$api.fetch({
        params: params //参数
      })
      .then(res => {
        _this.$message.success("上传附件成功！");
        this.$set(this.dialogForm, 'contractFileName', res.contractFileName)
        this.$set(this.dialogForm, 'contractFileAddr', res.contractFileAddr)
      });
    },
    //上传附件
    uploadAttachmentRow(row){
      let _this = this;
      var params = {
        busicode: "ContractAccessoryUpload",
        type: "upload",
        data: {
          file: file.file,
          userNo: row.userNo,
          contractNo: row.contractNo,
          contractType: row.contractType,
          projectId: this.OfferWaterContractParams.id,
        },
      };
      this.$api.fetch({
        params: params //参数
      })
      .then(res => {
        _this.$message.success("上传附件成功！");
        this.init()
      });
    },
    deleteFile(){
      this.dialogForm.contractFileName = ""
      this.dialogForm.contractFileAddr = ""
    },
    priviewContract(){
      let params = {
        busicode: "ContractPreview",
        data: this.dialogForm,
        token: sessionStorage.getItem("token"),
        sysType: '002',
      }
      params.data.projectId = this.OfferWaterContractParams.id
      window.open( this.common.getExportExcelIp() + '/exportWord.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    save(){
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          var params = {
            busicode: "ContractManageAdd",
            data: {
              contractType: "3",
              contractManageBeanList: [this.dialogForm]
            },
          };
          params.data.contractManageBeanList[0].projectId = this.OfferWaterContractParams.id
          params.data.contractManageBeanList[0].billNo = this.OfferWaterContractParams.billNo
          this.$api.fetch({
            params: params //参数
          })
          .then(res => {
            this.$message.success(res);
            this.contractVisible = false
            this.init()
          });
        } else {

        }
      })
    },
    closeDialog(){
      this.contractVisible = false
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
    indexMethod(index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  }

}
</script>
<style lang="scss">
.OfferWaterContract {
  width: 100%;
  height: 100%;
}
.el-dialog__body{
  padding: 10px 20px;
}
.formBill-Two{
  height: 300px;
}
.with300{
  .el-form-item__content{
    width: 300px !important; 
  }
  
}
</style>
