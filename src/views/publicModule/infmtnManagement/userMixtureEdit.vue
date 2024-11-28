
<template>
  <div class="userMixtureEdit">
    <!--<el-form
      :inline="true"
      ref="userMixtureEditFrom"
      class="formBill"
      :rules="rules"
      size="mini"
      :model="mixtureData"
      label-width="130px"
    >
      <div v-for="(costNameItem,costNameIndex) in mixtureData.detail" :key="costNameIndex">
        <legend class="legendColumn">{{mixtureData.detail[costNameIndex].costName}}</legend>
        <el-form-item label="水量占比" prop="waterRatio">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   @keyup.native='keyupEvent($event,input)' v-model="mixtureData.detail[costNameIndex].waterRatio"></el-input>
        </el-form-item>
         <el-form-item label="包余：" class="MultipleInvestigations">
            <el-radio v-model="mixtureData.detail[costNameIndex].residue" :label='1'>是</el-radio>
            <el-radio v-model="mixtureData.detail[costNameIndex].residue" :label='0'>否</el-radio>
        </el-form-item>
  
      </div>
    </el-form>-->
     <el-button  v-if="!isEdit" @click="addRow" style="float:right" class="add-line" size="mini"  type="primary" :disabled="permission!=1">添加行</el-button>

      <el-table stripe border :data="mixtureData.list" class="Warehousing-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="useWaterType" min-width="120" label="用水类型">
            <template slot-scope="scope" >
            <el-cascader
              v-model="scope.row.useWaterType"
              :options="waterTypeData"
              :show-all-levels="false"
             :props="props" 
             :disabled="isEdit"
             style="width: 100%"
            ></el-cascader>
            </template>
          </el-table-column>

           <el-table-column label="费用类型：" prop="costNo" v-if="showCostNo == '1'">          
            <template slot-scope="scope" >
              <span v-if="isEdit">{{scope.row.costName}}</span>
              <el-select  v-model="scope.row.costNo" placeholder="" :disabled="isEdit" v-else>
                <el-option v-for="item in costData" :key="item.costNo" :label="item.costName" :value="item.costNo" ></el-option>
              </el-select>
              </template>
            </el-table-column>

          <el-table-column prop="waterRatio" min-width="80" label="水量占比(%)">
            <template slot-scope="scope"  >
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @keyup.native='keyupEvent($event,input)' v-model="scope.row.waterRatio" size="mini" :disabled="isEdit"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="residue" min-width="80" label="包余">
            <template slot-scope="scope"  >
              <el-select  v-model="scope.row.residue" placeholder="" clearable :disabled="isConfig">
                <el-option v-for="(item,index) in residueData" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="80"   >
            <template slot-scope="scope">
              <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row)" :disabled="isEdit||permission!=1">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

  </div>
</template>
<script>
export default {
  name: "userMixtureEdit",
  props: ['mixtureData','isEdit','userNo','permissions'],
  data() {
    return {
      permission:1,
      maxHeight: 0,
      tableShow: false,
      maxHeight: 0,
      residueData:[{"id":1,"name":"是"},{"id":0,"name":"否"}],
      //用水类型
      waterTypeData: [],
      props: {
        //树结构格式
        value: "id",
        label: "name",
        emitPath: false
      },
      isConfig:true,
      config:2,
      costData:[],
      showCostNo: '1'
    };
  },
  mounted() {
    this.waterTypeDataOption();
    this.getWaterConfig();
    this.costSelect();
    this.getSysConfig()
   // this.getWaterConfig();
    this.$nextTick(() => {
      this.common.changeTable(this, ".userMixtureEdit", [
        ".userMixtureEdit .userMixtureEditFrom"
      ]);
    });
    if(this.permissions!=undefined&&this.permissions==0){
      this.permission=this.permissions
      
    }
  },

  methods: {
     costSelect() {    //初始化费用类型下拉
      var _this = this
      var params = {
        busicode: "CostList"
      };
      this.$api
        .fetch({ params })
        .then(res => {
            _this.costData = res
        })
        .catch(res => {
         
        });
    },
     //树结构数据处理
    getArr(data) {
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
     //用水分类下拉数据
    waterTypeDataOption() {
      var params = {
        busicode: "WaterTypeTree"
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = this.getArr(res);
          this.$set(this, "waterTypeData", data.children);
        })
        .catch(res => {
          this.$set(this, "waterTypeData", []);
        });
    },
    //获取打印选项
    getSysConfig() {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status:'1',
          searchContent:'USER_MIXTURE_CALCULATE_WAY',
        }
      };
      this.$api
        .fetch({
          params
        })
        .then(res => {
          if(res.list.length>0){
            this.showCostNo = res.list[0].configValue;
          }
        })
    },
    keyupEvent(e,input){
      console.log(this.config)
      if(this.config == 1) {
          e.target.value=e.target.value.replace(/[^\d.]/g, '');
          e.target.value=e.target.value.replace(/\.{2,}/g, '.');
          e.target.value=e.target.value.replace(/^\./g, '0.');
          e.target.value=e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0,e.target.value.length-1));  
          e.target.value=e.target.value.replace(/^0[^\.]+/g, '0')
          e.target.value=e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
          this.input=e.target.value
      }else {
          e.target.value=e.target.value.replace(/[^\d]/g,'')
          this.input=e.target.value
      }
    },
    check(val) {
      let _this = this;
      //let sumRatio = 0;
      let isHaveResidue = 0;
      let count = 0;
      let costList=[];
      if(this.showCostNo == '1') {
        if(this.mixtureData.list && this.mixtureData.list.length > 0) {
         _this.mixtureData.list.forEach((item)=>{
          if(costList.length<=0)
              costList.push(JSON.parse(JSON.stringify(item)));
          else{
              let exits = 0;
              costList.forEach((i)=>{
                if(i.costNo === item.costNo) {
                    exits = 1;
                    i.waterRatio = parseFloat(i.waterRatio)+parseFloat(item.waterRatio)
                }                   
              })
              if(exits == 0)
                costList.push(JSON.parse(JSON.stringify(item)));
          }
          //sumRatio = sumRatio + parseFloat(item.waterRatio);
          item.useWaterType = this.common.handleTreeData(item.useWaterType);
          if(item.residue == 1) {
              isHaveResidue = 1;
              count = count + 1;
          }
            
       })
       
      }
      let costName="";
       if(costList.length>0) {
          costList.forEach((item)=>{
              if(parseInt(item.waterRatio) != 100) {
                 try{
                    this.costData.forEach((i)=>{
                      if(i.costNo == item.costNo) {
                          costName = costName+i.costName+",";
                          throw new error;
                      }                    
                    });
                 }catch(err){
                      console.log("终止循环")
                 }
              }
          })
       }
      
      if(costName!='') {
        this.$message({
            type: "info",
            message: costName+"水量比值总和不等于100"
          });
          return costName+"水量比值总和不等于100";
      }
      if(this.config == 2 && isHaveResidue == 0 && costList.length >0) {
        this.$message({
            type: "info",
            message: "必须存在包余"
          });
          return "必须存在包余";
      }

       if(this.config == 2 && count > 1  && costList.length >0) {
        this.$message({
            type: "info",
            message: "包余只能有一个"
          });
          return "包余只能有一个";
      }
      return "";
      } else {
        let percent = 0
        let isHaveResidue = 0
        let message = ''
        if(this.mixtureData.list && this.mixtureData.list.length > 0) {
          for(let i = 0; i < this.mixtureData.list.length; i++) {
            if(!this.mixtureData.list[i].useWaterType || this.mixtureData.list[i].useWaterType == '') {
               message = '用水类型不能为空'
               break
            }
            if(!this.mixtureData.list[i].waterRatio || this.mixtureData.list[i].waterRatio == '') {
               message = '水量占比不能为空'
               break
            }
            percent += Number(this.mixtureData.list[i].waterRatio)
            if(this.mixtureData.list[i].residue == 1)
            isHaveResidue++
          }
          if(message !== '') {
             this.$message({
                type: "info",
                message: message
              });
            return message
          }
          if(percent !== 100) {
             this.$message({
                type: "info",
                message: "水量占比总和不等于100"
              });
            return '水量占比总和不等于100'
          }
          if(isHaveResidue == 0) {
            this.$message({
                type: "info",
                message: "必须存在包余"
              });
              return "必须存在包余";
          }

          if(isHaveResidue > 1) {
            this.$message({
                type: "info",
                message: "包余只能有一个"
              });
              return "包余只能有一个";
          }
          return "";
        }
        return ""
      }
      
    },
    //保存按钮
    resetForm() {
      this.$refs.userMixtureEditFrom.resetFields();
    },
    submitForm(id) {
      
      this.mixtureData.id = id
      let params = {
        busicode: "UserMixtureSave",
        data:  this.mixtureData
      };
      
      this.$api.fetch({  params })  .then(res => {
          /*_this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });*/
        });
      return "";
    },
      // 添加行
    addRow() {
      if(!this.mixtureData.list) {
        this.$set(this.mixtureData, 'list', [])
      }
      this.mixtureData.list.push({"residue":0,"userNo":this.userNo})
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.mixtureData.list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // editData(val,isEdit,userNo) {
    //     this.mixtureData = val
    //     this.isEdit = isEdit
    //     this.isConfig = isEdit
    //     this.userNo = userNo
    //     this.getWaterConfig();
    // },
     //参数配置 	开账计算-水量是否使用小数查询
    getWaterConfig() {
      let _this = this
      var params = {
        busicode: "ConfigList",
        data:{searchContent:'FEE_COMPUTE_WATER_DECIMALS'}
      };
      this.$api
        .fetch({ params })
        .then(res => {
          let data = res.list
          if(data!=null && data.length > 0) {
            this.config = data[0].configValue
          }
          if(_this.config == 2 && _this.isEdit == false) {
               _this.isConfig = false
          }
        })
        .catch(res => {

        });
    },
    indexMethod(index) {
      //获取表格序号
      return ( index + 1 );
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
.userMixtureEdit {
  height: calc(100% - 41px);
  width: 100%;
  margin: 0 auto;
  padding: 10px 0px;
  overflow-y: auto;
  /deep/ {
    .el-table {
      .el-input__inner {
        color: #606266;
      }
    }
  }
}
</style>
