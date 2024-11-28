<template>
  <div class="files-wrap">
    <div v-for="(attachment, i) in attachmentData" :key="i" class="file-content">
      <div class="file" @click="preview(attachment)">
        <img :src="getThumbnailPath(attachment)" width="200px" height="200px" />
        <div class="download" @click.prevent.stop="download(attachment)">
          <img src="@/assets/images/download.png" width="20px" height="20px" />
        </div>
        <span class="el-image-viewer__btn el-image-viewer__close remove" @click.prevent.stop="remove(attachment.id)"><i class="el-icon-close" /></span>
      </div>
      <span class="filename">{{attachment.accessoryName}}</span>
    </div>
     <!-- 附件预览 -->
    <FilePreview ref="filePreview" />
  </div>
</template>
<script>
import FilePreview from '@/components/FilePreview'
export default {
    props:['receiptAccessory', 'busicode'],
    name:"AttachmentViewInfo",
    components: {
      FilePreview
    },
     data(){
        return{
            attachmentData:[]
        }
    },
    mounted(){
         this.init();
    },
    methods:{
       init(){
            let _this = this;
              let params = {
                busicode: this.busicode || "AccessoryAboutUserList",
                data:_this.receiptAccessory
           };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              _this.attachmentData = res;
              
            });
        },
        // 查看附件弹出框下载按钮
        download(row) {
          const url = row.accessoryMetadata.accessoryPath
          const type = url.split('.')[url.split('.').length - 1]
          const images = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp']
          if (images.includes(type)) {
            const tag = document.createElement('a');
            // 此属性的值就是下载时图片的名称，注意，名称中不能有半角点，否则下载时后缀名会错误
            tag.setAttribute('download', row.accessoryName);

            const image = new Image();
            // 设置 image 的 url, 添加时间戳，防止浏览器缓存图片
            image.src = row.accessoryMetadata.accessoryPath
            //重要，设置 crossOrigin 属性，否则图片跨域会报错
            image.setAttribute('crossOrigin', 'Anonymous');
            // 图片未加载完成时操作会报错
            image.onload = () => {
              tag.href = this.getImageDataURL(image);
              tag.click();
            };
          } else {
            window.open(row.accessoryMetadata.accessoryPath);
          }
          
        },
        getThumbnailPath(attachment) {
          const url = attachment.accessoryMetadata.accessoryPath
          const type = url.split('.')[url.split('.').length - 1]
          const pictures = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp']
          if (pictures.includes(type)) {
            return attachment.accessoryMetadata.accessoryPath
          } else if(type === 'doc' || type === 'docx'){
            return require('@/assets/images/doc.png')
          } else if(type === 'xls' || type === 'xlsx'){
            return require('@/assets/images/xlsx.png')
          } else if(type === 'txt'){
            return require('@/assets/images/txt.png')
          } else if(type === 'xml'){
            return require('@/assets/images/xml.png')
          } else if(type === 'ppt' || type === 'pptx'){
            return require('@/assets/images/ppt.png')
          } else if(type === 'pdf'){
            return require('@/assets/images/pdf.png')
          } else {
            return require('@/assets/images/unknow.png')
          }
        },
        preview(row) {
          const url = row.accessoryMetadata.accessoryPath
          const type = url.split('.')[url.split('.').length - 1]
          const canPreview = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'pdf', 'txt', 'xml']
          if (canPreview.includes(type)) {
            this.$refs.filePreview.open(url, type)
          } else {
            this.$message.error({
              type: 'error',
              message: '该文件类型暂不支持预览，请下载后在本地查看'
            })
          }
        },
        getImageDataURL(image) {
          // 创建画布
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          // 以图片为背景剪裁画布
          ctx.drawImage(image, 0, 0, image.width, image.height);
          // 获取图片后缀名
          const extension = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
          // 某些图片 url 可能没有后缀名，默认是 png
          return canvas.toDataURL('image/' + extension, 1);
      },
      remove(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            busicode: "AccessoryDelete",
            data: id
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
                this.init();
            });
        }).catch(e => {
          console.error(e)
          this.$message({
            message: "取消删除！",
            type: "info"
          });
        })
      }
    },

}
</script>
<style lang="scss" scoped>
</style>
