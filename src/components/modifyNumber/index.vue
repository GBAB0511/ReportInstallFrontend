<template>
  <div class="modifyNumber">
    <el-dialog width="30%" v-if="diaVisible" :title="'修改通知人号码'" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="diaVisible" @close="closeUpdateMobileDialog">
      <el-form :inline="true" id="modifyNumberForm" size="mini" @submit.native.prevent label-width="120px" label-position="right">
        <el-form-item label="手机号码：" style="width: 100%">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="editFormData.mobile" clearable @keyup.enter.native="search" placeholder="手机号码" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>
        <el-form-item label="通知人手机号码：" style="width: 100%">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="editFormData.stopWaterLinkMobile" clearable @keyup.enter.native="search" @input="e => input = inputMe(e)" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <p class="tips">【<span class="warnTip">发催费短信、推送发票</span>】是通过<span class="warnTip"> 通知人手机号 </span>进行推送</p>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit()">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeUpdateMobileDialog()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "modifyNumber",
  props: ["diaVisible", "formData", "refreshNode"], // refreshNode 刷新数据组件name
  data () {
    return {
      editFormData: {
        userNo: "",
        ctmNo: "",
        mobile: "",
        stopWaterLinkMobile: "",
      },
    }
  },
  mounted () {
    this.editFormData = JSON.parse(JSON.stringify(this.formData));
  },
  methods: {
    inputMe (e) {
      let str = e.replace(/\ +/g, "")
      str = str.replace(/[\r\n]/g, "")
      //console.log(str);
      return str;
    },
    // 修改号码
    submit () {
      if (this.editFormData.ctmNo == '' || this.editFormData.userNo == '') {
        this.$message({
          message: '当前用户账号或客户编号为空',
          type: 'error'
        })
        return;
      }
      let params = {
        busicode: 'ModifyNumber',
        data: {
          ...this.editFormData
        }
      }
      let parentNode = this.refreshNode == undefined || this.refreshNode == '' ? null : this.getParentVNode(this, 'userInfoSearchDetail')
      this.$api.fetch({
        params: params
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        });
        this.closeUpdateMobileDialog();
        if (parentNode != null) {
          parentNode.init()
        }
        
        this.$emit('submitDone',this.editFormData);
      }).catch(err => {
        console.log(err)
      })
    },
    closeUpdateMobileDialog () {
      this.$emit("update:diaVisible", false)
    },
    getParentVNode (obj, targetName) {
      if (obj.$vnode == undefined) return null
      if (obj.$vnode.tag.includes(targetName)) {
        return obj
      } else {
        return this.getParentVNode(obj.$parent, targetName)
      }
    },

  },
  watch: {
    formData (val) {
      this.editFormData = JSON.parse(JSON.stringify(val));
    },
    diaVisible: {
      handler (newV, oldV) {
        if (newV) {
          console.log('vis')
          console.log(this.editFormData, this.formData)
          this.editFormData = JSON.parse(JSON.stringify(this.formData))
        }
      }
    }
  }
}
</script>

<style lang="scss">
.modifyNumber {
  .tips {
    font-size: 14px;
    .warnTip {
      color: #f56c6c;
      font-weight: 600;
    }
  }
  #modifyNumberForm {
    .el-form-item {
      margin-bottom: 15px !important;
      .el-form-item__content {
        width: calc(100% - 130px);
        .el-input {
          width: 100% !important;
          .el-input__inner {
            height: 30px;
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>

