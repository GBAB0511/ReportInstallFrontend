<template>
  <div class="preview">
    <el-dialog v-if="!isImg" :visible.sync="show" title="预览" class="button-dialog" append-to-body>
      <div v-if="type === 'txt'" class="text-word" v-html="textData"></div>
      <div v-else-if="type === 'xml'" class="text-word">{{ textData }}</div>
      <div class="pdf" v-else-if="type === 'pdf'">
        <p class="arrow">
          <!-- 上一页 -->
          <el-button type="primary" size="mini" :disabled="loading" @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</el-button>
          {{currentPage}} / {{pageCount}}
          <!-- 下一页 -->
          <el-button type="primary" size="mini" :disabled="loading" @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">下一页</el-button>
        </p>
        <!-- 自己引入就可以使用,这里我的需求是做了分页功能,如果不需要分页功能,只要src就可以了
              src需要展示的PDF地址
              page当前展示的PDF页码
              @num-pages PDF文件总页码
              @page-loaded 一开始加载的页面
              @loaded 加载事件
         -->
        <pdf
          v-loading="loading"
           element-loading-text="加载中"
           element-loading-spinner="el-icon-loading"
          v-if="show"
          ref="pdf"
          :src="src"
          :page="currentPage"
          @num-pages="pageCount=$event"
          @page-loaded="currentPage=$event"
          @loaded="loadPdfHandler">
        </pdf>
      </div>
      <span v-else class="error">该文件类型暂不支持预览，请下载后在本地查看</span>
    </el-dialog>
    <div v-show="showImg" class="img-preview-wrap">
      <span class="el-image-viewer__btn el-image-viewer__close close" @click="show = false"><i class="el-icon-close" /></span>
      <img :src="url" alt="" class="img" id="draggable" @mousedown="startMove" />
      <div class=" el-image-viewer__btn el-image-viewer__actions toolbox">
        <div class="el-image-viewer__actions__inner">
          <i class="el-icon-zoom-out" @click="subPercent"></i>
          <i class="el-icon-zoom-in" @click="addPercent"></i>
          <i class="el-icon-refresh-left" @click="rotateLeft"></i>
          <i class="el-icon-refresh-right" @click="rotateRight"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import pdf from 'vue-pdf'
export default {
  components: {pdf},
  data() {
    return {
      show: false,
      textData: '',
      url: '',
      type: '',
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      src: '', // pdf文件地址
      percent: 0.5,
      rotate: 0,
      imgSize: {
        height: 0,
        width: 0
      },
      loading: false
    }
  },
  computed: {
    isImg() {
      const images = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp']
      return images.includes(this.type)
    },
    showImg() {
      return this.isImg && this.show
    }
  },
  methods: {
    open(url, type) {
      this.show = true
      this.url = url
      this.type = type
      if (type === 'txt' || type === 'xml') {
        this.urlToBlob(url).then(res => {
          this.textData = res.replaceAll('\n', '<br/>')
        })
      }
      if (type === 'pdf') {
        this.loading = true
        this.src = pdf.createLoadingTask(url)
      }
      if(this.isImg) {
        this.percent = 0.5
        this.rotate = 0
        $('.img-preview-wrap .img').css('transform', `translate(-50%,-50%) scale(${this.percent}) rotate(${this.rotate * 90}deg)`)
        $(document).on('mousewheel DOMMouseScroll', this.onMouseScroll);
      }
    },
    urlToBlob(url) {
      return axios.post(
        url,
        // 将responseType的默认json改为blob
        {
        responseType: 'blob',
        emulateJSON: true
      }).then(res => {
        if (res.data) {
          return Promise.resolve(res.data)
        } else {
          throw res
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage (val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },

    // pdf加载时
    loadPdfHandler (e) {
      this.currentPage = 1 // 加载的时候先加载第一页
      this.loading = false
    },
    subPercent() {
      this.percent-=0.1
      if(this.percent<0.1) {
        this.percent = 0.1
      }
      $('.img-preview-wrap .img').css('transform', `translate(-50%,-50%) scale(${this.percent}) rotate(${this.rotate * 90}deg)`)
    },
    addPercent() {
      this.percent+=0.1
      if(this.percent>3) {
        this.percent = 3
      }
      $('.img-preview-wrap .img').css('transform', `translate(-50%,-50%) scale(${this.percent}) rotate(${this.rotate * 90}deg`)
    },
    rotateLeft() {
      this.rotate -=1
      $('.img-preview-wrap .img').css('transform', `translate(-50%,-50%) scale(${this.percent}) rotate(${this.rotate * 90}deg`)
    },
    rotateRight() {
      this.rotate +=1
      $('.img-preview-wrap .img').css('transform', `translate(-50%,-50%) scale(${this.percent}) rotate(${this.rotate * 90}deg`)
    },
    onMouseScroll(e){
      e.preventDefault();
      var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
      var delta = Math.max(-1, Math.min(1, wheel) );
      if(delta<0){//向下滚动
        this.percent-=0.02
        if(this.percent<0.1) {
          this.percent = 0.1
        }
      }else{//向上滚动
        this.percent+=0.02
        if(this.percent>3) {
          this.percent = 3
        }
      }
      $('.img-preview-wrap .img').css('transform', `translate(-50%,-50%) scale(${this.percent}) rotate(${this.rotate * 90}deg`)
    },
    startMove(e) {
      // 鼠标按下，计算当前元素距离可视区的距离
      const _this = this
      const startTime = new Date()
      const dragDom = document.querySelector('#draggable')
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
      const disX = e.clientX - dragDom.offsetLeft
      const disY = e.clientY - dragDom.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
      let moved = false
      document.onmousemove = function (ev) {
        moved = true
        // 通过事件委托，计算移动的距离
        const l = ev.clientX - disX
        const t = ev.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l > document.body.clientWidth ? document.body.clientWidth : l}px`
        dragDom.style.top = `${t > document.body.clientHeight ? document.body.clientHeight : t}px`

        ev.preventDefault()
      }

      document.onmouseup = function (ev) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        if(!val) {
          $(document).off('mousewheel DOMMouseScroll', this.onMouseScroll);
          this.currentPage = 0
          this.pageCount = 0
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .text-word {
    word-break: break-all;
    max-height: 100%;
    overflow-y: auto;
  }
  .img {
    width: 100%;
    margin: 0 auto;
  }
  .pdf {
    max-height: 100%;
    overflow-y: auto;
    .arrow {
      padding-top: 10px;
    }
  }
  .error {
    font-size: 24px;
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 50px;
  }
}
.img-preview-wrap {
  display: block; 
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-color: #00000088;
  z-index: 10000;
  .close {
    background-color: #606266;
    color: #fff;
    font-size: 24px;
  }
  .toolbox {
    text-align: center;
    cursor: pointer;
    z-index: 10010;
    user-select: none;

    span {
      background-color: #fff;
      margin: 0 10px;
      width: 24px;
      display: inline-block;
    }
  }
  .img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    cursor: move;
    transition: transform 0.3s ease 0s;
  }
}
</style>