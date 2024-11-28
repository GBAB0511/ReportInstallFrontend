
<template>
  <div class="userDiscountEdit">
      <div class="bread-contain-right">
     <el-button  v-if="!isEdit" @click="addRow"  class="add-line" size="mini"  type="primary" :disabled='permission!=1'>添加行</el-button>
      </div>
    <div  class="kl-table">

      <el-table highlight-current-row stripe border :data="discountData.list" class="Warehousing-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

           <el-table-column label="费用类型：" prop="costId">
            <template slot-scope="scope">
              <el-select v-model="scope.row.costId" placeholder="" :disabled="isEdit||permission!=1" @change="check(scope.$index,scope.row)">
                <el-option v-for="item in costData" :key="item.id" :label="item.costName" :value="item.id" ></el-option>
              </el-select>
              </template>
            </el-table-column>

          <el-table-column prop="feeRatio" min-width="80" label="收取比列(%)">
            <template slot-scope="scope"  >
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @keyup.native='keyupEvent($event,input)' value=100 v-model="scope.row.feeRatio" size="mini" :disabled="isEdit||permission!=1"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="noCharging" min-width="120" label="仅计费不收款">
            <template slot-scope="scope"  >
              <el-select  v-model="scope.row.noCharging" placeholder="" clearable :disabled="isEdit||permission!=1">
                <el-option v-for="(item,index) in chargingData" :key="index" :label="item.name" :value="item.id"></el-option>
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
  </div>
</template>
<script>
export default {
  name: "userDiscountEdit",
  props: ['discountData','isEdit','userNo','permissions'],
  data() {
    return {
      permission:1,
      maxHeight: 0,
      tableShow: false,
      maxHeight: 0,
      chargingData:[{"id":1,"name":"是"},{"id":0,"name":"否"}],
      props: {
        //树结构格式
        value: "id",
        label: "name"
      },
      costData:[],
    };
  },
  mounted() {
      this.costSelect()
   // this.getWaterConfig();
    this.$nextTick(() => {
      this.common.changeTable(this, ".userDiscountEdit", [
        ".userDiscountEdit .userDiscountEditFrom"
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
            console.log(111)
            _this.costData = _this.costData.filter(item=>{
              if( item.costName==="卫生费") {
                item = null;
              }
              return !!item;
            })
        })
        .catch(res => {
         
        });
    },
    keyupEvent(e,input){

          e.target.value=e.target.value.replace(/[^\d.]/g, '');
          e.target.value=e.target.value.replace(/\.{2,}/g, '.');
          e.target.value=e.target.value.replace(/^\./g, '0.');
          e.target.value=e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0,e.target.value.length-1));  
          e.target.value=e.target.value.replace(/^0[^\.]+/g, '0')
          e.target.value=e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
          this.input=e.target.value

        //   e.target.value=e.target.value.replace(/[^\d]/g,'')
        //   this.input=e.target.value

    },
    check(index,val) {
      console.log(index)
        let _this =this
        try{
          _this.discountData.list.forEach((item,i)=>{         
                if(index != i) {
                  if(val.costId == item.costId) {
                      let costName=""
                      _this.costData.forEach((j)=>{
                            if(j.id == item.costId)
                                costName=j.costName
                      })
                      _this.$message({
                        type: "info",
                        message: costName+"费用类型重复"
                      });
                      val.costId="";
                      throw new error;
                  }
                }           
          })
        }catch(err){

        }
    },
    //保存按钮
    resetForm() {
      this.$refs.userDiscountEditFrom.resetFields();
    },
    submitForm(id) {
      let _this = this;
      this.discountData.id = id
      let params = {
        busicode: "userDiscountSave",
        data:  this.discountData
      };
      
      _this.$api.fetch({  params })  .then(res => {
          /*submitForm_this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });*/
        });
    },
      // 添加行
    addRow() {
      this.discountData.list.push({"noCharging":0,"feeRatio":100,"userNo":this.userNo})
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.discountData.list.splice(index, 1);
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
<style lang="scss">
.userDiscountEdit {
  height: calc(100% - 41px);
  width: 100%;
  margin: 0 auto;
  padding: 10px 0px;
  overflow-y: auto;
}
</style>
