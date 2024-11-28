<template>
  <div class="eSign">
    <el-row>
      <el-col :span="20">
        <img id="esign-img" :src="url" width="100%" height="100px" />
      </el-col>
      <el-col :span="4" style="padding-left:15px">
        <!-- <div><el-button type="primary" size="mini">重签</el-button>  </div>  -->
        <div>
          <el-button
            v-if="showBtn"
            type="primary"
            @click="startSign"
            size="mini"
            >启动签名板</el-button
          >
        </div></el-col
      >
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    url: { //签名图片url
      type: String,
      default: ""
    },
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  name: "eSign",
  components: {},
  data() {
    return {};
  },
  mounted(){
    if(this.url){
      this.showBtn = false; //已经展示的不能再签名
    }
  },
  methods: {
    startSign() {
      if (webSocket.readyState != webSocket.OPEN) {
        this.$message({
          message: "请正确连接设备或设备驱动未启动，请检查",
          type: "error"
        });
        return;
      }

      let begin_data = "data:image/png;base64,";
      this.gwq.GWQ_CancelOperate(); //取消操作
      this.gwq.DoGWQ_SignName("D:\\hw.xml", "D:\\test.png");
      this.gwq.OnAfterGWQ_SignName = data => {
        let imgbase64 = begin_data + data.base64;
        $("#esign-img")[0].src = imgbase64;
        let params = {
          busicode: "PicUpload",
          data: {
            receiptId: localStorage.getItem("billId"),
            accessoryNo: "signature",
            data: imgbase64
          }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$emit("uploadDone", res);
            console.log(res, "uploadDone");
          });
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.eSign {
  padding: 10px;
  width: calc(100% - 20px);
}
</style>
