
<template>
  <div class="InformationReleaseManagementEditFrom">

    <!-- <div class="backfillSubmitForm"> -->
    <el-form :inline="true" class="basicInfoForm" size="mini" :model="formData" label-width="150px" ref="ruleForm"  :rules="rules"  :disabled="disabledAll">



      <el-form-item label="标题：" prop="messageTitle">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.messageTitle" placeholder="" :class="{ready_only:editNeedData.editGet}" :readonly='editNeedData.editGet'></el-input>
      </el-form-item>

      <el-form-item  label="内容：" prop="userNume" class="userAdress">
        <div v-if="editNeedData.editGet" v-html="ckEditorContent"></div>
      <InformationReleaseManagementEdit ref="ckeditor" v-else></InformationReleaseManagementEdit>
      <div></div>
      </el-form-item>

    </el-form>

  </div>

  <!-- </div> -->
</template>
<script>
// 富文本

import InformationReleaseManagementEdit from "./InformationReleaseManagementEdit";

export default {
  name: "InformationReleaseManagementEditFrom",
  components: {
    InformationReleaseManagementEdit
  },
  props: ['editNeedData', 'disabledAll'],
  data() {
    return {
      // 富文本初始化内容
      ckEditorContent: '',

        rules: {
        messageTitle: [{ required: true, message: "请输入标题", trigger: "blur" }],

        userNume: [{ required: true, message: "请输入留言", trigger: "blur" }]
      },
      editor:{},
      // 图标地址
      imageUrl: false,
      // 表单数据
      formData: {

        messageTitle: '',

        // 链接/内容（富文本）
        releaseContent: '',
   
      },

    };
  },
  mounted() {
    var _this = this
    // window.UE.delEditor('editor')
    // // // 富文本实例
    // this.editor = window.UE.getEditor()
    // // 设置富文本高度
    // this.editor.addListener("ready", function () {
    //   _this.editor.setHeight(171);
    //   if(_this.disabledAll){
    //     _this.editor.setDisabled()
    //   }
    // })

    if (this.editNeedData.saveType != 'add') {
      this.init()
    } 

  },
  methods: {
    // 表单初始化
    init() {
      var _this = this
      var params = {
        "busicode": "NoticeQuery",
        "data": {
          id: _this.editNeedData.id
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {

        _this.formData.id = res.id
        if(_this.editNeedData.editGet){
           _this.ckEditorContent = res.releaseContent;
        }else{
              _this.$refs.ckeditor.setContent(res.releaseContent)
        }
        
        _this.formData.messageTitle = res.messageTitle
      
      })
    },


    // 保存方法（由父页面调用）
    save() {
      let _this = this


      var saveData = {
        "id": _this.formData.id,

        "messageTitle": _this.formData.messageTitle,

        // 内容
        "releaseContent": _this.$refs.ckeditor.getContent(),
      }

      var params = {
        "busicode": "",
        "data": saveData
      }
      if (this.editNeedData.saveType == 'add') {// 添加-保存
        params.busicode = 'NoticeAdd'
      } else if (this.editNeedData.saveType == 'edit') {// 修改-保存
        params.busicode = 'NoticeUpdate'
        params.data.id = _this.formData.id
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$notify({
          title: '成功',
          message: params.busicode == 'NoticeAdd' ? '添加成功！' : '修改成功！',
          type: 'success'
        });
        _this.$parent.closeDialog()
        _this.$parent.init()
      })
    },


  }
};
</script>
<style lang="scss" scoped>
.InformationReleaseManagementEditFrom {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  overflow-y: scroll;
  .el-tag {
    margin-right: 10px;
  }
  .avatar-uploader {
    /deep/ {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
      }
    }
  } 
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  fieldset {
    padding-block-start: 0.35em;
    padding-inline-start: 0.75em;
    padding-inline-end: 0.75em;
    padding-block-end: 0.625em;
    min-inline-size: min-content;
    border-width: 1px;
    border-style: ridge;
    border-color: threedface;
    border-image: initial;
    width: 65%;
    margin: 0px 0px 20px 145px;
  }
  legend {
    //background: #f5f5f5;
    font-weight: 700;
    font-size: 12px;
    padding: 5px 8px;
    font-size: 14px;
  }
  fieldset .el-form-item {
    width: 90% !important;
  }
  .basicInfoForm {
    margin: 10px 0px;
  }
  .userAdress {
    //margin-bottom: 130px !important;
  }
  .backfillSubmitForm {
    .userAdress {
      width: 100%;

      .el-form-item__content {
        width: calc(100% - 160px);
        .el-form-item__label {
          width: 100px !important;
        }
      }
    }
    .selectClass {
      width: 36.5% !important;
    }

    .Btngroup {
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
  .edui-editor-breadcrumb {
    display: none !important;
  }
  #editor {
    //border: 1px solid var(--ck-color-toolbar-border);
    //height: 200px;
  }
  .edui-defaultr {
    width: 100%;
    .edui-editor-iframeholder {
      width: 100%;
    }
  }
  /deep/ {
    .el-form-item__content {
      .el-select {
        width: 200px !important;
        .el-input__inner {
          width: 100%;
        }
      }
      .el-input {
        width: 100%;
        .el-input__inner {
          width: 100%;
        }
      }
    }
  }
}
.button-dialog {
  min-width: 964px;
}
.el-form-item__content .el-date-editor {
  width: 220px !important;
}
#area-one {
  width: 100%;
  .el-input {
    width: 300px;
    .el-input__inner {
      width: 100%;
    }
  }
}
</style>


<style lang="scss">
.InformationReleaseManagementEditFrom{
  .userAdress{
    figure.image{
      img{
          width: 100%;
      }
    }
  }
}
</style>