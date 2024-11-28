<template>
  <div class="MeterCycleConfigEdit">
    <div class="MeterCycleConfigEditIndex">
      <el-form
        class="formBill-One"
        ref="MeterCycleConfigEditForm"
        :rules="rules"
        :inline="true"
        size="mini"
        :model="formData"
        label-width="130px"
      >
        <el-form-item label="抄表周期类型：" prop="cycleType">
          <el-select v-model="formData.cycleType">
            <el-option
              v-for="item in dictionaryData.MRCT"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="formData.cycleType == 1"
          label="间隔月份数量："
          prop="addMonth"
        >
          <el-select v-model="formData.addMonth">
            <el-option
              v-for="item in month"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="formData.cycleType == 2"
          label="周期固定月份："
          prop="fixedMonth"
        >
          <el-select
            v-model="formData.fixedMonth"
            multiple
            placeholder="请选择"
          >
            <span slot="prefix">{{ fixedMonth }}</span>
            <el-option
              v-for="item in month"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="抄表周期名称：" prop="name">
          <el-input
          @input="e => input = inputMe(e)"
            v-model="formData.name"
            maxlength="200"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sortNo">
          <el-input
            @input="e => input = inputMe(e)"
            v-model="formData.sortNo"
            maxlength="200"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="formData.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "MeterCycleConfigEdit",
  data() {
    return {
      dictionaryData: [],
      month: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      formData: {
        addMonth: "",
        cycleType: "",
        name: "",
        fixedMonth: [],
        sortNo: "",
        status: ""
      },

      rules: {
        cycleType: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ],
        name: [{ required: true, message: "请选择参数内容", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getDictionary();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 数据字典数据获取
    getDictionary() {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "MRCT"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
        });
    },
    //保存按钮
    resetForm() {
      this.$refs.MeterCycleConfigEditForm.resetFields();
    },
    submitForm(formName, type) {
      let _this = this;
      let params = {};
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          let  data = {
                ...this.formData
            }
            if(data.cycleType == 1){
                data.fixedMonth = undefined;
            }
            if(data.cycleType == 2){
                data.addMonth = undefined;
                data.fixedMonth = this.formData.fixedMonth.join();
            }
              if(data.cycleType == 3){
                data.addMonth = undefined;
                data.fixedMonth = undefined;
            }
          if (type === "添加") {
            params = {
              busicode: "BaseReadCycleSave",
              data
            };
          } else {
 
            params = {
              busicode: "BaseReadCycleUpdate",
              data
            };
          }
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              _this.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
              _this.$parent.init();
              _this.$parent.closeDialog();
            });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.common.chargeObjectEqual(
        this,
        this.formData,
        "get",
        "MeterCycleConfigEdit",
        this.$parent.closeDialog
      );
    },
    editData({id,cycleType,addMonth,name,fixedMonth,sortNo,status}) {
      this.formData = {
            id,
            addMonth:String(addMonth),
            cycleType: String(cycleType),
            name,
            fixedMonth:fixedMonth.split(','),
            sortNo,
            status
      };
    }
  },
  computed: {
    fixedMonth() {
      return (
        this.month &&
        this.month
          .filter(item => this.formData.fixedMonth.includes(item))
          .map(item => item)
          .join()
      );
    }
  }
};
</script>
<style lang="scss">
.MeterCycleConfigEdit {
  width: 100%;
  height: 100%;
  .MeterCycleConfigEditIndex {
    height: calc(100% - 41px);
    width: 60%;
    margin: 0 auto;
    overflow-y: hidden;
    overflow-x: hidden;
    .formBill-One .el-form-item .el-form-item__content {
      width: calc(95% - 100px);
    }
  }
}
</style>
