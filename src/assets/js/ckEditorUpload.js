import api from './api.js'
import util from './util.js'
class MyUploadAdapter {
  constructor( loader ) {
      // 要在上载期间使用的文件加载器实例
      this.loader = loader;
  }

  // 启动上载过程
  upload() {
      return this.loader.file
              .then( file => new Promise( ( resolve, reject ) => {
                  this._sendRequest( resolve, reject, file );
              } ) );
  }

  // 中止上载过程
  abort() {
      if ( this.xhr ) {
          this.xhr.abort();
      }
  }

  // 准备数据并发送请求
  _sendRequest( resolve, reject, file ) {
      var params = {
        busicode: "accessoryUpload",
        type: "upload",
        data: {
          receiptId: util.generateUUID(),
          receiptType: "infomation_release",
          accessoryNo: "000",
          file: file
        },
        sysType: "002"
      };
      api.fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res);
          resolve( {
            default: res[0]
        } );
          _this.$message({
            message: "上传附件成功！",
            type: "success"
          });
        }).catch(e => {
          reject(e)
        })
  }
}

function MyCustomUploadAdapterPlugin( editor ) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      // 在这里将URL配置为后端上载脚本
      return new MyUploadAdapter( loader );
  };
}

export {
  MyUploadAdapter,
  MyCustomUploadAdapterPlugin
}