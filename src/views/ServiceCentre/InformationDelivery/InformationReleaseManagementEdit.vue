
<template>
  <div class="tinymce-container editor-container">
    <!-- 工具栏容器 -->
    <div id="toolbar-container"></div>

    <!-- 编辑器容器 -->
    <div id="editor" style="height:500px">
      <p></p>
    </div>
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn";
const upload = require('@/assets/js/ckEditorUpload.js')
export default {
  data() {
    return {
      editor: null //编辑器实例
    };
  },
  mounted() {
    this.initCKEditor();

  },
  methods: {
    initCKEditor() {
      CKEditor.create(document.querySelector("#editor"), {
        ckfinder: {
          // uploadUrl: "/upload"
          //后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        },
        height:'500',  
        language: "zh-cn",
        extraPlugins: [ upload.MyCustomUploadAdapterPlugin ],
        placeholder: '请输入编辑内容...'
      })
        .then(editor => {
          const toolbarContainer = document.querySelector("#toolbar-container");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          this.editor = editor; //将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
          //console.log(this.editor);
        })
        .catch(error => {
          //console.error(error);
        });
    },
    setContent(data){
      this.editor.setData(data)
    },
    getContent() {
      console.log(CKEditor);
      return this.editor.getData()
    },
  }
};
</script>

<style lang="scss" scoped>
.ck-editor__editable_inline {
  height: 300px !important;
}
.tinymce-container {
  position: relative;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
/deep/ {
  .ck.ck-editor__editable_inline{
    border-color: #ccc;
  }
}
</style>
