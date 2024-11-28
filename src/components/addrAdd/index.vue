<template>
   <div class="addrAdd">
<el-dialog title="结构地址添加" class="addrAddDialog"  top="8vh"  :close-on-click-modal="false"  width="500px" :modal="false" :visible.sync="addrVisible" @close="closeDialog">
       <el-form
          :model="addForm"
          :rules="addFormRules"
            label-width="120px"
          class="demo-ruleForm"
          label-position="right"
          ref="ruleForm"
        >
          <el-row>
            <el-form-item 
              :label="formItem.label"
              :prop="formItem.prop"
              v-for="(formItem,index) in itemArr"
              :key="index"
            >
              <el-select
                v-model="addForm[formItem.prop]"
                allow-create
                value-key="id"
                clearable
                  size="mini"
                default-first-option
                filterable
                placeholder="请输入"
                :disabled="formItem.disabled||false"
                @change="changeMethod(formItem,index)"
              >
                <el-option
                  v-for="item in formItem.options||[]"
                  :key="item.id"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
              <el-select   size="mini" v-model="addForm.status" placeholder="请选择">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="坐标:" prop="position">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="text"   size="mini" v-model="addForm.position" placeholder="请选择" :readonly="true" @input="e => input = inputMe(e)">
                <i slot="suffix" class="el-input__icon el-icon-location" @click="openMap"></i>
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>
 
    
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="primary" size="mini" plain  @click="confirm">确 定</el-button>
          <el-button type="info" size="mini" plain  @click="handleClose">取 消</el-button>
        </div>
    </el-dialog>
     <!-- 地图坐标选择 -->
      <el-dialog
        :title="'选择坐标'"
        :visible.sync="isShowMap"
        :modal="false" 
        :before-close="closeMap"
        width="80%"
        top="8vh"
        style="margin-top:-3%"
       class="map-dialog"
      >
        <el-amap-search-box
          class="search-box"
          v-if="isShowMap"
          :search-option="searchOption"
          :on-search-result="onSearchResult"
        ></el-amap-search-box>
        <!-- <div class="infoBox">
          <span>当前选中：</span>
          <span>经纬度{{point}}</span>
        </div>-->
        <el-switch
          class="citySwitch"
          @change="changeCity"
          v-model="mapCity"
          active-text="银川市区"
          inactive-text="全国"
        ></el-switch>
        <div id="addressInfo" v-if="isShowMap"></div>
        <el-amap
          ref="amap"
          vid="amap"
          :center="center"
          v-if="isShowMap"
          :zoom="zoom"
          class="manage-division-amap"
          :events="events"
        >
          <!-- 点标记在地图上显示的位置，默认为地图中心点， -->
          <el-amap-marker
            v-for="(marker,index) in markers"
            :key="'marker'+index"
            :position="marker.position"
            :icon="markerIcon"
          ></el-amap-marker>
          <el-amap-text
            v-for="(text,index) in markers"
            :offset="text.offset"
            :key="'text'+index"
            :position="text.position"
            :text="text.text"
          ></el-amap-text>

          <!-- 遮罩层 -->
          <el-amap-polygon
            strokeColor="rgb(0,139,0)"
            strokeOpacity="1"
            fillColor="rgba(245,245,220)"
            fillOpacity="1"
            strokeStyle="solid"
            v-for="(polygon, index) in polygons"
            :key="index+'polygons'"
            strokeWeight="2"
            :path="polygon.Ce.path"
          ></el-amap-polygon>
        </el-amap>
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button  type="primary" size="mini" plain  @click="confirmMap">确 定</el-button>
          <el-button  type="info" size="mini" plain  @click="closeMap">取 消</el-button>
        </div>
      </el-dialog>

      </div>
</template>
<script>

export default {
  name: "addrAdd",
  props: ["addrVisible",'closeAddrAddVisible'],
  components: {
  
  },
  data() {
    return {
      allParentList:[],//所有父级列表
       markerIcon: "",
      id: "id",
      mapCity: true,
      address: "",
      isShowMap: false,
      addFormVisible: false,
      editFormVisible: false,
      addForm: {
        status: 1,
        position: "",
        province: "",
        city: "",
        district: "",
        road: "",
        roadNum: ""
      },
      itemArr: [
        {
          label: "省/市/自治区",
          prop: "province",
          disabled: false,
          options: []
        },
        {
          label: "市",
          prop: "city",
          disabled: true,
          options: []
        },
        {
          label: "区/县",
          prop: "district",
          disabled: true,
          options: []
        },
        {
          label: "道路/巷/街",
          prop: "road",
          disabled: true,
          options: []
        },
        {
          label: "路号-小区",
          prop: "roadNum",
          disabled: true,
          options: []
        }
      ],
      searchOption: {
        city: "银川市",
        citylimit: false
      },
      addFormRules: {
        status: {
          required: true,
          message: "请输入"
        },
        position: {
          required: true,
          message: "请选择"
        }
      },
      areaNo: -1,
      zoom: 13,
      center: [114.161054492, 22.8356011687],
      events: this.eventsFun(),
      iconImg: [],
      zoom: 13,
      markers: {},
   
      polygons: [],
      district: null,
      point: null,
      node: {},
      lastNode: {},
      map: null,
      currentNode: {},
      editForm: {},
      editFormRules: {
        areaName: {
          required: true,
          message: "请输入"
        },
        sname: {
          required: true,
          message: "请输入"
        },
        status: {
          required: true,
          message: "请输入"
        },
        position: {
          required: true,
          message: "请选择"
        }
      },
      status: "add",
      isInitForm: true,
      placeSearch: null
    };
  },
      mounted(){
     
        this.isInitForm=false
           this.getServAreaList();
      // this.getTreeData();
    },
    watch: {
   "addForm.province": {
      handler(val) {
        let index = 1;
        this.handleChange(val, index);
      }
    },
    "addForm.city": {
      handler(val) {
        let index = 2;
        this.handleChange(val, index);
      }
    },
    "addForm.district": {
      handler(val) {
        let index = 3;
        this.handleChange(val, index);
      }
    },
    "addForm.road": {
      handler(val) {
        let index = 4;
        this.handleChange(val, index);
      }
    },
  },

    methods: {
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
      getServAreaList() {
      let params = {
        busicode: "AdminAreaQueryList",
      };
      this.$api
        .fetch({
         //请求方法
          params: params, //参数
        })
        .then(res => {
            let data = res;
               if (data.length > 0) {
              this.areaNo = data[0].areaNo;
              this.node = data[0];
              // this.currentNode = res.data[0];
              
            }
               data.map(item => {
              item.label = item.areaName;
              item.value = item.areaName;
            });
             this.allParentList = [data[0].areaName]
            this.$set(this.itemArr[0], "options", data);
                 //初始化显示第一个的数据
            this.addFun()
            // this.isInitForm = false;
        });
    },
          disableItem(index, status) {
      this.isInitForm = true;
      let props = ["city", "district", "road", "roadNum"];
      for (let i = index; i <= 4; i++) {
        this.addForm[props[i - 1]] = "";
        this.$set(this.itemArr[i], "disabled", status);
        this.$set(this.itemArr[i], "options", []);
      }
      this.isInitForm = false;
    },
    //清空下级
    clearData(index) {
      this.isInitForm = true;
      let props = ["city", "district", "road", "roadNum"];
      for (let i = index; i <= 4; i++) {
        console.log("props[i - 1]", props[i - 1]);
        this.addForm[props[i - 1]] = "";
        this.$set(this.itemArr[i], "options", []);
      }
      this.isInitForm = false;
    },
    handleChange(val, index) {
      let props = ["city", "district",  "road", "roadNum"];
      if (val) {
        console.log("val", val);
        //只有是下拉选择的才可以继续填写
        if (!this.isInitForm) {
          if (val.id) {
            this.$set(this.itemArr[index], "disabled", false);
            this.clearData(index);
            //如果是从下拉框中选择的
            this.getDataByParentId(val.id, index);
          } else {
            this.disableItem(index, true);
          }
        }
      } else {
        this.disableItem(index, true);
      }
    },
    //地图搜索
    onSearchResult(pois) {
      let s = this;
      if (pois.length > 0) {
        //取第一个
        this.center = [pois[0].lng, pois[0].lat];
        s.getAddress(this.center);
      }
    },
    //远程搜索框数据变化
    changeMethod(val) {
      console.log("变化了");
    },
    remoteMethod(query) {
      if (query != "") {
      }
 
    },
    getAddress(center) {
      let s = this;
      let geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      s.point = center.toString();
      s.markers = [];
      let m = {
        position: center,
        offset: [0, -50]
      };

      s.markers.push(m);
      s.getNearBy("", center, 10000);
      geocoder.getAddress(s.center, function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.regeocode) {
            s.address = result.regeocode.formattedAddress;
            s.$set(s.markers[0], "text", s.address);
            s.$nextTick();
          }
        }
      });
    },
    getNearBy(keyword, LngLat, radius) {
      let map = this.$refs.amap.$amap;
      let s = this;

      if (s.placeSearch) {
        s.placeSearch.render && s.placeSearch.render.markerList.clear();
        s.placeSearch.clear();
      }
      AMap.service(["AMap.PlaceSearch"], function() {
        s.placeSearch = new AMap.PlaceSearch({
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          type: "", // 兴趣点类别
          extensions: "all",
          fillColor: "0",
          map: map, // 展现结果的地图实例
          panel: "addressInfo", // 结果列表将在此容器中进行展示。
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        }); //关键字查询
        s.placeSearch.searchNearBy(keyword, LngLat, radius, function(
          status,
          result
        ) {
          console.log(status, result);
          let detailAddressList = {};
          let coordinate = [];
          if (result.info == "OK") {
            result.poiList.pois.forEach(function(val) {
              detailAddressList[val.address] =
                val.pname + val.cityname + val.adname + val.name;
              coordinate = [val.location.lng, val.location.lat];
            });
          }
        });
        s.placeSearch.on("selectChanged", function(e) {
          let p = [e.selected.data.location.lng, e.selected.data.location.lat];
          s.point = p.toString();
          s.markers = [];
        });
      });
    },
    eventsFun() {
      let s = this;
      return {
        click(e) {
          let { lng, lat } = e.lnglat;
          s.lng = lng;
          s.lat = lat;
          s.center = [e.lnglat.lng, e.lnglat.lat];
          //这里通过高德 SDK 完成。
          s.getAddress(s.center);
        },
        complete() {
          s.drawBounds("银川市");
        }
      };
    },
    drawBounds(city) {
       var that = this;
         AMap.service('AMap.DistrictSearch',function(){//回调函数
      //遮罩地图
     
      if (city === "银川市") {
        that.center = [106.230909, 38.487193];
        that.zoom = 10;
      } else {
        that.center = [114.161054492, 22.8356011687];
        that.zoom = 12;
        that.polygons = [];
        return;
      }
      //加载行政区划插件
      if (!that.district) {
        // 实例化DistrictSearch
        var opts = {
          subdistrict: 0, // 获取边界不需要返回下级行政区
          extensions: "all", //返回行政区边界坐标组等具体信息
          level: "city" // 查询行政级别为 市
        };
        that.district = new AMap.DistrictSearch(opts);
      }
      // 行政区查询
      that.district.search(city, function(status, result) {
        that.polygons = [];
        // 外圈
        var outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true)
        ];
        var bounds = result.districtList[0].boundaries; // 这里的bounds是一个数组,但是里面只有一个元素就是bounds[0]
        if (bounds) {
          for (var i = 0, l = bounds.length; i < l; i++) {
            // 所以这个循环只会执行一次
            // 生成行政区划polygon
            var polygon = new AMap.Polygon({
              path: [outer, bounds[i]]
            });
            if(polygon.Ce){
               that.polygons.push(polygon);
            }
          
          }
        }
        AMap.Polygon.bind(that.polygons); // 交给amap进行值处理
      });
     });
    },
    //切换城市
    changeCity(data) {
      if (data) {
        this.drawBounds("银川市");
        this.searchOption = {
          city: "银川市",
          citylimit: false,
          input: "autoText_all"
        };
      } else {
        this.drawBounds("全国");
        this.searchOption = {
          city: "全国",
          citylimit: false,
          input: "autoText_all"
        };
      }
    },
    //地图选择坐标
    openMap() {
      this.isShowMap = true;
      this.$nextTick(()=>{
        let mapDialogHeight = $(".map-dialog .el-dialog").height()
        let mapDialogHeightHeader = $(".map-dialog .el-dialog .el-dialog__header").height()
        let mapDialogHeightFooter = $(".map-dialog .el-dialog .el-dialog__footer").height()
        let mapDialogHeightBody = mapDialogHeight - mapDialogHeightHeader - mapDialogHeightFooter - 105
        $(".manage-division-amap").css('height',mapDialogHeightBody +'px')
      })
    },
    confirmMap() {
      if (!this.point) {
        this.$message({
          type: "error",
          message: "请选择一个位置"
        });
      } else {
        this.mapCity = true;
      this.addForm.position = this.point;
 
        // this.$set(this.addForm, "position", this.point);
        this.isShowMap = false;
      }
    },
    closeMap() {
      this.mapCity = true;
      this.isShowMap = false;
      this.markers = [];
      this.placeSearch = null;
    },
    //添加表单确认回调
    confirm() {
      this.$refs.ruleForm.validate(vaild => {
        if (vaild) {
          const { parentId, areaNo, areaName } = this.getLastInputData();
          const p = this.addForm.position.split(",");
          let params = {
            busicode: "AdminAreaAdd",
            data: {
              parentId: parentId,
              areaNo: areaNo,
              areaName: areaName,
              status: this.addForm.status,
              longitude: p[0],
              latitude: p[1]
            }
          };
          this.$api
            .fetch({
              params: params, //参数
            })
            .then(res => {
            this.$message({
            message: '添加成功',
            type: 'success'
          });
                this.handleClose();
            });
        }
      });
    },
    //添加表单取消
    handleClose() {
      this.addrVisible = false;
      (this.addForm = {
        status: 1,
        position: "",
        province: "",
        city: "",
        district: "",
        road: "",
        roadNum: ""
      }),
        (this.addFormRules = {
          status: {
            required: true,
            message: "请输入"
          },
          position: {
            required: true,
            message: "请选择"
          }
        });
      this.itemArr.map(i => {
        i.disabled = true;
        i.options = [];
      });
      this.markers = [];
      this.poinit = null;
      this.isInitForm = false;
      //重置数据
    },

    getParentListById(id){
     let params = {
        busicode: "AdminAreaParentList",
        data:{
          id
        }
      };
    return  this.$api
        .fetch({
         //请求方法
          params: params, //参数
        })
        .then(res => {
            return res.map(item=>item.areaName);
        });
    },
     addFun() {
      this.isInitForm = true;
      this.addFormVisible = true;
      let arr =this.allParentList;
      let node = this.node;
      // if (arr.length > 1) {
      //   this.addForm.province = arr[0];
      //   this.$set(this.itemArr[0], "disabled", false);
      // }
      // if (arr.length > 2) {
      //   this.addForm.city = arr[1];
      //   this.$set(this.itemArr[1], "disabled", false);
      // }
      // if (arr.length > 3) {
      //   this.addForm.district = arr[2];
      //   this.$set(this.itemArr[2], "disabled", false);
      // }

      // if (arr.length > 4) {
      //   this.addForm.road = arr[3];
      //   this.$set(this.itemArr[3], "disabled", false);
      // }
      // if (arr.length > 5) {
      //   this.addForm.roadNum = arr[4];
      //   this.$set(this.itemArr[4], "disabled", false);
      // }
      //设置当前下级可以被选择
      if (arr.length <= 4) {
        this.$set(this.itemArr[arr.length-1], "disabled", false);//设置当前服务区域可选
        this.$set(this.addFormRules, `${this.itemArr[arr.length].prop}`, {
          required: true,
          message: "请输入或选择"
        });
        this.$nextTick(() => {
          this.isInitForm = false;
        });
        // this.getDataByParentId(node.id, arr.length - 1); //设置当前服务区域可选
      }
      //设置当前下一级的下拉选择内容
      // console.log("node", this.currentNode);
    },
    //下拉列表根据id获取下级
    getDataByParentId(id, setIndex) {
      let params = {
        busicode: "AdminAreaQueryList",
        data: {
          id: id
        }
      };
      this.$api
        .fetch({
         //请求方法
          params: params, //参数
        })
        .then(res => {
            let data = res;
            data.map(item => {
              item.label = item.areaName;
              item.value = item.areaName;
            });
            this.$set(this.itemArr[setIndex], "options", data);
            // this.isInitForm = false;
        });
    },
    getLastInputData() {
      let node = this.node ;
      let objCount = 0;
      let dataArr = [];
    // let allParentList=  await this.getParentListById(node.id);
     let  arr =this.allParentList;

   
      //如果只有一级的话，要拿这个areaNO,否则从数据里面取
      for (let key in this.addForm) {
        if (key === "province") {
          dataArr[0] = this.addForm[key];
        } else if (key === "city") {
          dataArr[1] = this.addForm[key];
        } else if (key === "district") {
          dataArr[2] = this.addForm[key];
        }  else if (key === "road") {
          dataArr[3] = this.addForm[key];
        } else if (key === "roadNum") {
          dataArr[4] = this.addForm[key];
        }
      }
      let lastChoiceData = {};
      let parentIndex = -1;
      let lastIndex = -1;
      let parentData = {};
      let resultData = {};
      //从预填充之外的数据来判断
      for (let i = arr.length; i <= 5; i++) {
        //如果有数据，那么就一直覆盖
        if (dataArr[i]) {
          let isObj = this.checkIsObj(dataArr[i]);
          if (isObj) {
            objCount++;
          }
          lastIndex = i;
          lastChoiceData = dataArr[i];
          parentData = dataArr[i - 1];
          parentIndex = i - 1;
          // console.log("isObj", i, isObj);
        }
      }
      if (parentIndex + 1 === arr.length) {
        resultData.areaNo = node.areaNo;
        resultData.parentId = node.id;
        if (this.checkIsObj(lastChoiceData)) {
          resultData.areaName = lastChoiceData.areaName;
        } else {
          resultData.areaName = lastChoiceData;
        }
      } else {
        resultData.areaNo = parentData.areaNo;
        resultData.parentId = parentData.id;
        if (this.checkIsObj(lastChoiceData)) {
          resultData.areaName = lastChoiceData.areaName;
        } else {
          resultData.areaName = lastChoiceData;
        }
      }
      return resultData;
      //获取最后一个填写的内容
    },
    closeDialog(){
      this.$emit('closeAddrAddVisible');
    },
    checkIsObj(obj) {
      return obj.constructor === Object;
    },
    formatStatus(row) {
      //转义
      return row.status === 1 ? "启用" : "停用";
    },
  },
};
</script>

<style lang="scss" scoped>
.addrAdd {
  padding: 10px;
  width: calc(100% - 20px);
  /deep/ i.el-select__caret.el-input__icon{
        line-height: initial;
  }
   .demo-ruleForm /deep/ .el-form-item{
         width: 100% !important;
    display: block !important;
    margin-bottom: 10px !important;
   }
  .demo-ruleForm /deep/ .el-form-item__content {
    margin-left: unset !important;
}
/deep/ .el-form-item__label {
    float: none;
    display: inline-block;
}
/deep/ .el-form-item__content {
  width:calc(100% - 120px);
    display: inline-block;
    vertical-align: top;
}
 /deep/ .el-input__inner {
    width: 100%;
}
/deep/ .addrAddDialog .el-dialog{
  height: auto !important;
}
/deep/ .map-dialog .el-dialog{
  height: 85% !important;
}
/deep/ .el-dialog{
  .el-dialog__body {
    padding: 30px 20px !important;
}
}
.manage-division-amap {
  height:calc(100% - 100px);
}
.citySwitch {
  position: absolute;
  right: 60px;
  top: 20px;
}
.search-box {
  position: absolute;
  left: 30px;
  top: 60px;
}
#addressInfo {
  padding: 10px 20px;
  margin-bottom: 80px;
  border-radius: 5px;
    position: absolute;
    bottom: -20px;
  background-color: white;
  width: auto;
  min-width: 300px;
  border-width: 0;
  z-index: 999;
  right: 20px;
  // display: none;
}

content .company-left {
    overflow-x: auto;
}

}
</style>
