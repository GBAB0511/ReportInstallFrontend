<template>
  <div class="structuralAddressManagement">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" icon="el-icon-refresh-right" @click="synchronous" type="primary">刷新营业所</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
      </div>
    </div>
    <div class="company-content">
      <div class="company-left ">
        <div class="table-tree">
          <div class="tree-box">
            <div class="zTreeDemoBackground">
              <el-tree ref="asyncTree" :data="treeData" :props="defaultProps" icon-class="none" @node-click="handleNodeClick" :expand-on-click-node="true" :highlight-current="true" :load="loadNode" :node-key="id" @node-expand="nodeExpand" lazy></el-tree>
              <!-- <ul id="treeDemo" class="ztree"></ul> -->
            </div>
          </div>
        </div>

      </div>
      <div class="resize" title="收缩侧边栏">
        ⋮
      </div>
      <div class="company-right">
        <div class="kl-table" :style="{height: maxHeight + 'px'}">

          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData">

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>

            <el-table-column show-overflow-tooltip prop="fullName" min-width="170" label="区域全称"></el-table-column>
            <el-table-column prop="sname" min-width="100" label="区域简称"></el-table-column>
            <el-table-column prop="status" min-width="100" label="状态" :formatter="formatStatus"></el-table-column>

            <el-table-column label="操作" width="130">
              <template slot-scope="scope">
                <!-- style="font-size:12px;text-align:center;" -->
                <el-button type="text" size="mini" @click="handleEdit( scope.row)">修改</el-button>
                <el-button type="text" size="mini" @click="addChild( scope.row)">添加下级</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>

      </div>
    </div>
    <!-- 弹出的添加框 -->
    <el-dialog :title="'添加'" width="600px" top="8vh" :visible.sync="addFormVisible" :close-on-click-modal="false" :before-close="handleClose">
      <el-form :model="addForm" :rules="addFormRules" ref="ruleForm" label-width="120px" size="mini" class="demo-ruleForm add-form" label-position="right" v-if="addFormVisible">
        <el-row>
          <el-form-item :label="formItem.label" :prop="formItem.prop" v-for="(formItem,index) in itemArr" :key="index">
            <el-select v-model="addForm[formItem.prop]" allow-create value-key="id" clearable default-first-option filterable placeholder="请输入" :disabled="formItem.disabled||false" @change="changeMethod(formItem,index)">
              <el-option v-for="item in formItem.options||[]" :key="item.id" :label="item.label" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model="addForm.status" size="mini" placeholder="请选择">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
            <!-- <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="select" v-model="addForm.status" placeholder="请输入"></el-input> -->
          </el-form-item>
          <el-form-item label="坐标:" prop="position">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" size="mini" v-model="addForm.position" placeholder="请选择">
              <i slot="suffix" class="el-input__icon el-icon-location" @click="openMap"></i>
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="confirm">确 定</el-button>
        <el-button type="info" size="mini" plain @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹出的修改框 -->
    <el-dialog :title="'修改'" width="600px" :visible.sync="editFormVisible" :close-on-click-modal="false" :before-close="handleCloseEditForm">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" size="mini" v-if="editFormVisible" label-width="120px" class="demo-ruleForm update-form" label-position="right">
        <el-row>
          <!-- <el-form-item label="区域全称:" prop="fullName">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" v-model="editForm.fullName" placeholder="请输入"></el-input>
            </el-form-item> -->
          <el-form-item label="区域简称:" prop="sname">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" v-model="editForm.sname" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model="editForm.status" placeholder="请选择">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="坐标:" prop="position">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" v-model="editForm.position" placeholder="请选择" :readonly="true">
              <i slot="suffix" class="el-input__icon el-icon-location" @click="openMap"></i>
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="confirmEdit">确 定</el-button>
        <el-button type="info" size="mini" plain @click="handleCloseEditForm">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 地图坐标选择 -->
    <el-dialog :title="'选择坐标'" :visible.sync="isShowMap" :close-on-click-modal="false" :before-close="closeMap" width="80%" top="4vh" class="map-dialog">
      <el-amap-search-box class="search-box" v-if="isShowMap" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
      <!-- <div class="infoBox">
          <span>当前选中：</span>
          <span>经纬度{{point}}</span>
        </div>-->
      <el-switch class="citySwitch" @change="changeCity" v-model="mapCity" active-text="银川市区" inactive-text="全国"></el-switch>
      <div id="addressInfo" v-if="isShowMap"></div>
      <el-amap ref="amap" vid="amap" :center="center" v-if="isShowMap" :zoom="zoom" class="manage-division-amap" :events="events">
        <!-- 点标记在地图上显示的位置，默认为地图中心点， -->
        <el-amap-marker v-for="(marker,index) in markers" :key="'marker'+index" :position="marker.position" :icon="markerIcon"></el-amap-marker>
        <el-amap-text v-for="(text,index) in markers" :offset="text.offset" :key="'text'+index" :position="text.position" :text="text.text"></el-amap-text>

        <!-- 遮罩层 -->
        <el-amap-polygon strokeColor="rgb(0,139,0)" strokeOpacity="1" fillColor="rgba(245,245,220)" fillOpacity="1" strokeStyle="solid" v-for="(polygon, index) in polygons" :key="index+'polygons'" strokeWeight="2" :path="polygon.Ce.path"></el-amap-polygon>
      </el-amap>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="confirmMap">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeMap">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: "structuralAddressManagement",
  components: {
  },
  data () {
    return {
      areaNameList: [],//地区名数组
      tableData: [],
      tableQuery: {
        page: 1,
        pageCount: 20,
      },

      crumbsData: {  //面包屑
        titleList: [
          { title: '区域配置', method: () => { window.histroy.back() } },
          { title: '结构化地址管理', method: () => { window.histroy.back() } }
        ],
      },

      maxHeight: 0,
      tableShow: false,
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
          disabled: true,
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
      treeData: [],
      maxHeight: 700,
      tableShow: true,
      treeNode: "",
      defaultProps: {
        children: "children",
        label: "areaName",
        isLeaf (data, node) {
          if (data.isLeaf === 1) {
            return true;
          } else {
            return false;
          }
        }
      },
      areaNo: -1,
      zoom: 13,
      center: [114.161054492, 22.8356011687],
      events: this.eventsFun(),
      iconImg: [],
      zoom: 13,
      markers: {},
      windows: [],
      window: "",
      polygons: [],
      district: null,
      point: null,
      node: {},
      lastNode: {},
      map: null,
      currentNode: {},
      editForm: {},
      editFormRules: {
        fullName: {
          required: true,
          message: "请输入"
        },
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
      currentId: -1,
      placeSearch: null,
      parentName: "",
    }
  },
  mounted () {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow1')
    this.dragControllerDiv()
    this.getTreeData();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".structuralAddressManagement .company-right", [
        ".structuralAddressManagement .company-right .block", ".structuralAddressManagement .bread-contain",
      ]);
    })
  },
  watch: {
    "addForm.province": {
      handler (val) {
        let index = 1;
        this.handleChange(val, index);
      }
    },
    "addForm.city": {
      handler (val) {
        let index = 2;
        this.handleChange(val, index);
      }
    },
    "addForm.district": {
      handler (val) {
        let index = 3;
        this.handleChange(val, index);
      }
    },
    "addForm.road": {
      handler (val) {
        let index = 4;
        this.handleChange(val, index);
      }
    },
    maxHeight () {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  },

  methods: {
    inputMe (e) {
      let str = e.replace(/\ +/g, "")
      str = str.replace(/[\r\n]/g, "")
      //console.log(str);
      return str;
    },
    disableItem (index, status) {
      this.isInitForm = true;
      let props = ["city", "district", "road", "roadNum"];
      for (let i = index; i <= 4; i++) {
        this.addForm[props[i - 1]] = "";
        this.$set(this.itemArr[i], "disabled", status);
        this.$set(this.itemArr[i], "options", []);
      }
      this.isInitForm = false;
    },
    dragControllerDiv () {
      var resize = document.getElementsByClassName('resize');
      var left = document.getElementsByClassName('company-left');
      var mid = document.getElementsByClassName('company-right');
      var box = document.getElementsByClassName('company-content');
      for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function (e) {
          //颜色改变提醒
          resize[i].style.background = '#818181';
          var startX = e.clientX;
          resize[i].left = resize[i].offsetLeft;
          // 鼠标拖动事件
          document.onmousemove = function (e) {
            var endX = e.clientX;
            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

            if (moveLen < 32) moveLen = 32; // 左边区域的最小宽度为32px
            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px

            resize[i].style.left = moveLen; // 设置左侧区域的宽度

            for (let j = 0; j < left.length; j++) {
              left[j].style.width = moveLen + 'px';
              mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
            }
          };
          // 鼠标松开事件
          document.onmouseup = function (evt) {
            //颜色恢复
            resize[i].style.background = '#d6d6d6';
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          };
          resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false;
        };
      }
    },
    //清空下级
    clearData (index) {
      this.isInitForm = true;
      let props = ["city", "district", "road", "roadNum"];
      for (let i = index; i <= 4; i++) {
        console.log("props[i - 1]", props[i - 1]);
        this.addForm[props[i - 1]] = "";
        this.$set(this.itemArr[i], "options", []);
      }
      this.isInitForm = false;
    },
    handleChange (val, index) {
      let props = ["city", "district", "road", "roadNum"];
      if (val) {
        console.log("val", val);
        //只有是下拉选择的才可以继续填写
        if (!this.isInitForm) {
          if (val.id) {
            this.$set(this.itemArr[index], "disabled", false);
            this.clearData(index);
            //如果是从下拉框中选择的
            this.getDataByParentId(val, index);
          } else {
            this.disableItem(index, true);
          }
        }
      } else {
        this.disableItem(index, true);
      }
    },
    nodeExpand (data) {
      this.handleNodeClick(data)
      this.refreshNodeBy(data.id)
    },
    refreshNodeBy (id) {
      this.$nextTick(() => {
        console.log("id", id);
        let node = this.$refs.asyncTree.getNode(id); // 通过节点id找到对应树节点对象
        if (node) {
          node.loaded = false;
          node.isLeaf = false;
          node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
        }
      });
    },
    //修改弹框确定按钮
    confirmEdit () {
      this.$refs.editForm.validate(vaild => {
        if (vaild) {
          let position = this.editForm.position.split(",");
          let fullName = this.parentName + this.editForm.sname;
          let params = {
            busicode: "AdminAreaUpdate",
            data: {
              id: this.editForm.id,
              status: this.editForm.status,
              fullName: fullName, // fullName作为全称
              areaName: this.editForm.sname, // areaName与sname一致，都为简称
              sname: this.editForm.sname,
              longitude: position[0],
              latitude: position[1],
              parentId: this.editForm.parentId,
            }
          };
          console.log('params', params)
          //   return;
          this.$api
            .fetch({
              method: "post", //请求方法
              params: params, //参数
            })
            .then(res => {

              this.editFormVisible = false;
              this.getTableData();
              this.refreshNodeBy(this.editForm.parentId);

            });
        }
      });
    },
    //修改弹框的取消按钮
    handleCloseEditForm () {
      this.editFormVisible = false;
      this.markers = [];
      this.poinit = null;
    },
    //地图搜索
    onSearchResult (pois) {
      let s = this;
      let latSum = 0;
      let lngSum = 0;
      console.log("pois", pois);
      if (pois.length > 0) {
        // pois.forEach(poi => {
        //   const { lng, lat } = poi;
        //   lngSum += lng;
        //   latSum += lat;
        // });
        // const center = {
        //   lng: lngSum / pois.length,
        //   lat: latSum / pois.length
        // };
        //取第一个
        this.center = [pois[0].lng, pois[0].lat];
        s.getAddress(this.center);
      }
    },
    //远程搜索框数据变化
    changeMethod (val) {
      console.log("变化了");
    },

    getAddress (center) {
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
      geocoder.getAddress(s.center, function (status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.regeocode) {
            s.address = result.regeocode.formattedAddress;
            s.$set(s.markers[0], "text", s.address);
            s.$nextTick();
          }
        }
      });
    },
    getNearBy (keyword, LngLat, radius) {
      let map = this.$refs.amap.$amap;
      let s = this;

      if (s.placeSearch) {
        s.placeSearch.render && s.placeSearch.render.markerList.clear();
        s.placeSearch.clear();
      }
      AMap.service(["AMap.PlaceSearch"], function () {
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
        s.placeSearch.searchNearBy(keyword, LngLat, radius, function (
          status,
          result
        ) {
          console.log(status, result);
          let detailAddressList = {};
          let coordinate = [];
          if (result.info == "OK") {
            result.poiList.pois.forEach(function (val) {
              detailAddressList[val.address] =
                val.pname + val.cityname + val.adname + val.name;
              coordinate = [val.location.lng, val.location.lat];
            });
          }
        });
        s.placeSearch.on("selectChanged", function (e) {
          let p = [e.selected.data.location.lng, e.selected.data.location.lat];
          s.point = p.toString();
          s.markers = [];
        });
      });
    },
    eventsFun () {
      let s = this;
      return {
        click (e) {
          let { lng, lat } = e.lnglat;
          s.lng = lng;
          s.lat = lat;
          s.center = [e.lnglat.lng, e.lnglat.lat];
          //这里通过高德 SDK 完成。
          s.getAddress(s.center);
        },
        complete () {
          s.drawBounds("银川市");
        }
      };
    },
    drawBounds (city) {
      //遮罩地图
      var that = this;
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
      that.district.search(city, function (status, result) {
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
            that.polygons.push(polygon);
          }
        }
        AMap.Polygon.bind(that.polygons); // 交给amap进行值处理
      });
    },
    //切换城市
    changeCity (data) {
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
    openMap () {
      this.isShowMap = true;
    },
    confirmMap () {
      if (!this.point) {
        this.$message({
          type: "error",
          message: "请选择一个位置"
        });
      } else {
        this.mapCity = true;
        if (this.status == "add") {
          this.addForm.position = this.point;
        } else {
          this.editForm.position = this.point;
        }

        // this.$set(this.addForm, "position", this.point);
        this.isShowMap = false;
      }
    },
    closeMap () {
      this.mapCity = true;
      this.isShowMap = false;
      this.markers = [];
      this.placeSearch = null;
    },
    //添加表单确认回调
    confirm () {
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

              this.handleClose();
              this.getTableData();
              let node;
              if (this.status === "add") {
                node = this.node;
              } else {
                node = this.currentNode;
              }
              this.refreshNodeBy(node.id);

            });
        }
      });
    },
    //添加表单取消
    handleClose () {
      this.addFormVisible = false;
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
    //点击左侧树节点，查询表单信息
    handleNodeClick (node) {
      this.areaNo = node.areaNo || -1;
      this.node = node;
      this.tableQuery.page = 1;
      this.getTableData();
    },
    //获取表格数据
    getTableData () {
      if (this.areaNo === -1) return;
      let params = {
        busicode: "AdminAreaListPading",
        data: {
          areaNo: this.areaNo,
          page: this.tableQuery.page,
          pageCount: this.tableQuery.pageCount
        }
      };
      this.$api
        .fetch({
          //请求方法
          params: params, //参数
        })
        .then(res => {
          this.tableData = res.list;
          this.tableData.total = res.total;
        });
    },
    init () {
      this.getTreeData();
    },
    getTreeData () {
      let that = this;
      let params = {
        busicode: "AdminAreaListGroup",
        data: {}
      };
      this.$api
        .fetch({
          //请求方法
          params: params, //参数
        })
        .then(res => {

          this.treeData = res;
          //初始化显示第一个的数据
          if (res.length > 0) {
            this.areaNo = res[0].areaNo;
            this.node = res[0];
            // this.currentNode = res.data[0];
            // this.$nextTick(() => {
            //   if (this.$refs.asyncTree) {
            //     this.$refs.asyncTree.setCurrentKey(this.node.id);
            //   }
            // });
            // this.getTableData();
          }
        });
    },
    //懒加载节点
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData);
      } else {
        this.getChildrenNode(node, resolve);
      }
    },
    //获取子节点
    getChildrenNode (node, resolve) {
      let params = {
        busicode: "AdminAreaListGroup",
        data: {
          id: node.data.id
        }
      };
      this.$api
        .fetch({
          //请求方法
          params: params, //参数
        })
        .then(res => {
          resolve(res);
        });
    },
    //修改表格内容
    handleEdit (row) {
      this.status = "edit";
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      console.log(this.node)
      let params = {
        busicode: "AdminAreaParentList",
        data: {
          id: this.node.id
        }
      };
      this.$api.fetch({
        params: params, //参数
      }).then(res => {
        this.parentName = "";
        res.forEach(item => {
          this.parentName += item.areaName
        })
      });
      const { latitude, longitude } = row;
      if (latitude && longitude) {
        this.editForm.position = [latitude, longitude].toString();
      } else {
        this.editForm.position = "";
      }
    },
    // getLevelIdx(areaNo){//根据no获取对应数组层级 5位一级
    //   return (areaNo.length/5) - 1;
    // },
    //表格添加下级
    addChild (row) {
      // let currentLevelNum =this.getLevelIdx(row.areaNo);//通过当前级别去改变对应级别的值，5位一级
      // let areaNameList = [...this.areaNameList];
      // areaNameList[currentLevelNum] = row.areaName; //对对应级进行地区名替换
      // // this.node.areaNameList = this.areaNameList;
      // console.log(areaNameList)
      this.currentNode = { ...row }; //node里的areaNameList供添加页面回显
      // this.areaNameList = areaNameList;
      this.status = "addChild";
      this.addFun();
    },
    //   getLeafKeys(a,b){
    //   var parentList = []
    //   var areaNoList = []
    //   var areaNameList = [b.data.areaName]
    //   function getParent (node) {

    //         // 判断当前节点是否有父节点，并且父节点上的data不能是数组
    //         if (node.parent && !Array.isArray(node.parent.data)) {  console.log(node.parent,9999999);
    //           // 将父节点上data的menuid存储在 `parentlist` 里
    //           node.parent.data instanceof Object && parentList.push(node.parent.data.id)
    //           node.parent.data instanceof Object && areaNameList.unshift(node.parent.data.areaName)
    //           // 递归调用 父节点上有父节点
    //           getParent(node.parent)
    //           // 当父节点上data是数组时点击对象为当前tree最高目录 并且parentList必须是0
    //         }
    //         //  else if (parentList.length === 0) {
    //         //   // 存储当前节点的id到parentList
    //         //   parentList.push(node.data.id)
    //         //   areaNameList.unshift(node.data.areaName)
    //         // }
    //       }

    //       if(b.data.areaNo.length > 5){
    //              getParent(b)
    //       }

    //       console.log(parentList)//获取所有父节点id
    //       console.log(areaNameList);
    // },
    getParentListById (id) {
      let params = {
        busicode: "AdminAreaParentList",
        data: {
          id
        }
      };
      return this.$api
        .fetch({
          //请求方法
          params: params, //参数
        })
        .then(res => {
          return res;
        });
    },
    async addFun () {
      this.isInitForm = true;
      this.addFormVisible = true;
      let arr = [];
      let node;

      if (this.status === "add") {
        node = this.node;
      } else {
        node = this.currentNode;
      }
      console.log('node', node)
      //获取当前节点的所有父级列表供回显
      let allParentList = await this.getParentListById(node.id);
      arr = allParentList.map(item => item.areaName);
      //拷贝后对应级进行替换，记录节点中文

      //  arr.splice(this.getLevelIdx(node.areaNo),arr.length,node.areaName);

      this.areaNameList = arr;

      console.log(arr);
      if (arr.length >= 1) {
        this.addForm.province = arr[0];
        this.$set(this.itemArr[0], "disabled", true);
      }
      if (arr.length >= 2) {
        this.addForm.city = arr[1];
        this.$set(this.itemArr[1], "disabled", true);
      }
      if (arr.length >= 3) {
        this.addForm.district = arr[2];
        this.$set(this.itemArr[2], "disabled", true);
      }
      if (arr.length >= 4) {
        this.addForm.road = arr[3];
        this.$set(this.itemArr[3], "disabled", true);
      }
      if (arr.length >= 5) {
        this.addForm.roadNum = arr[4];
        this.$set(this.itemArr[4], "disabled", true);
      }
      //设置当前下级可以被选择
      if (arr.length <= 4) {
        this.$set(this.itemArr[arr.length], "disabled", false);
        this.$set(this.addFormRules, `${this.itemArr[arr.length].prop}`, {
          required: true,
          message: "请输入或选择"
        });
        this.$nextTick(() => {
          this.isInitForm = false;
        });
        this.getDataByParentId(node, arr.length);
      }

      //设置当前下一级的下拉选择内容
      // console.log("node", this.currentNode);
    },
    //添加内容
    add () {
      this.status = "add";
      this.addFun();
    },
    //获取下级列表
    getDataByParentId (val, setIndex) {

      let params = {
        busicode: "AdminAreaQueryList",
        data: {
          id: val.id
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

    getLastInputData () {
      let node = this.status === "add" ? this.node : this.currentNode;
      let objCount = 0;
      let dataArr = [];
      let arr = this.areaNameList;
      console.log(arr)
      //如果只有一级的话，要拿这个areaNO,否则从数据里面取
      for (let key in this.addForm) {
        if (key === "province") {
          dataArr[0] = this.addForm[key];
        } else if (key === "city") {
          dataArr[1] = this.addForm[key];
        } else if (key === "district") {
          dataArr[2] = this.addForm[key];
        } else if (key === "road") {
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
    checkIsObj (obj) {
      return obj.constructor === Object;
    },
    formatStatus (row) {
      //转义
      return row.status === 1 ? "启用" : "停用";
    },

    // 列表的NO列
    indexMethod (index) {
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },

    handleSizeChange (val) { //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.getTableData();
    },
    handleCurrentChange (val) {  //页码点击
      this.tableQuery.page = val;
      this.getTableData();
    },
    // 刷新营业所
    synchronous () {
      let params = {
        busicode: "UserAdminBusiAreaList",
        data: {}
      };
      this.$api.fetch({
        params: params, //参数
      }).then(res => {
          console.log('刷新营业所', res)
        this.$message({
          type: "success",
          message: "刷新营业所成功"
        });
      });
    },
  }
}
</script>
<style lang="scss">
.structuralAddressManagement {
  width: 100%;
  height: 100%;
  .company-content {
    width: 100%;
    height: 100%;
    // margin: 1% 0px;
    overflow: hidden;
    // box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
  }
  /*左侧div样式*/
  .company-left {
    width: calc(22% - 10px); /*左侧初始化宽度*/
    height: 90%;
    background: #ffffff;
    float: left;
  }
  /*拖拽区div样式*/
  .resize {
    cursor: col-resize;
    float: left;
    position: relative;
    top: 45%;
    background-color: #d6d6d6;
    border-radius: 5px;
    margin-top: -10px;
    width: 10px;
    height: 50px;
    background-size: cover;
    background-position: center;
    /*z-index: 99999;*/
    font-size: 32px;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  .resize:hover {
    color: #444444;
  }
  /*右侧div'样式*/
  .company-right {
    float: left;
    width: 78%; /*右侧初始化宽度*/
    height: 100%;
    background: #fff;
    // box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
  }
  .tableContainerIndex {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .formBill .el-form-item {
    width: 100%;
    margin-bottom: 15px !important;
  }
  .manage-division-amap {
    height: 600px;
  }
  .citySwitch {
    position: absolute;
    right: 60px;
    top: 15px;
  }
  .search-box {
    position: absolute;
    left: 30px;
    top: 60px;
  }
  .demo-ruleForm /deep/ .el-form-item {
    margin-bottom: 15px !important;
  }
  #addressInfo {
    padding: 10px 20px;
    margin-bottom: 80px;
    border-radius: 5px;
    position: absolute;
    bottom: -70px;
    background-color: white;
    width: auto;
    min-width: 300px;
    border-width: 0;
    z-index: 999;
    right: 20px;
    // display: none;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color: black;
  }

  // /deep/ .el-tree-node:focus > .el-tree-node__content {
  //   background-color: #4a9de7 !important;
  //   color: #fff !important;
  // }
  // /*节点失焦时的背景颜色*/
  /deep/
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #4a9de7 !important;
    color: #fff !important;
    padding-right: 10px;
  }
  .company-content .company-left {
    overflow-x: auto;
  }

  .el-form-item__content .el-input--suffix,
  .el-dialog__body .el-input__inner {
    width: 100% !important;
  }
  .el-select {
    width: 100%;
  }
}
.update-form,
.add-form {
  .el-form-item--mini.el-form-item {
    margin-bottom: 20px;
  }
}
</style>

