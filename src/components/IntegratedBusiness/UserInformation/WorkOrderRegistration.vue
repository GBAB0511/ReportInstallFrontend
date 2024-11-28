<template>
  <div class="WorkOrderRegistration">
    <div class="toolbar">
      <el-form ref="form" :inline="true" :rules="rules" size="mini" :model="tableQuery" class="demo-form-inline formBill-Two">

        <legend class="legendColumn">工单登记</legend>

        <el-form-item label="联系人：" prop="linkMan" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.linkMan" placeholder="联系人" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>

        <el-form-item label="联系电话：" prop="contactNum" class="searchInput">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.contactNum" placeholder="联系电话" @input="e => input = inputMe(e)"></el-input>
        </el-form-item>

        <el-form-item label="服务分类：" prop="customerBizType">
          <el-cascader ref="cascaderSelect" v-model="tableQuery.customerBizType" :options="customerBizTypeData" :props='cateListProps' @change="handleChange"></el-cascader>
        </el-form-item>

        <el-form-item label="紧急程度：" prop="urgencyLevel">
          <el-select clearable v-model="tableQuery.urgencyLevel" placeholder="">
            <el-option v-for="item in urgencyLevelData" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发生地址：" prop="occurAddress" class="f3">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.occurAddress" placeholder="发生地址" style="width:62%" @input="e => input = inputMe(e)"></el-input>
          <i class="el-icon-location-outline map" @click="openMap"></i>
          <!-- <el-button type="primary" size="mini" @click="getTableData">工单查询</el-button> -->
        </el-form-item>

        <el-form-item label="服务描述：" prop="detailDescription" class="f4">
          <el-input type="textarea" v-model="tableQuery.detailDescription" placeholder @input="e => input = inputMe(e)"></el-input>
        </el-form-item>

        <el-form-item>

        </el-form-item>

      </el-form>
    </div>
    <el-dialog title="选择发生地址" :destroy-on-close="true" :append-to-body="true" :visible.sync="mapShow" :close-on-click-modal="false" class="button-dialog" @close="closeDialog">
      <div v-if="mapShow" id="GDMap" style="height: 100%;">
        <el-amap-search-box class="search-box" :search-option="searchOption" @keyup.enter="onSearchResult" :on-search-result="onSearchResult">
        </el-amap-search-box>
        <el-amap vid="amapDemo" class="amap-demo" :center="center" :zoom="zoom" :events="events">
          <!-- <el-amap-text :position="marker.position" :events="marker.events" :text="marker.text" :visible="marker.visible"></el-amap-text> -->
          <el-amap-text v-for="text in markers" :key="text.text" :position="text.position" :events="text.events" :text="text.text"></el-amap-text>
          <el-amap-marker v-for="marker in markers" :key="marker.text" :position="marker.position" :events="marker.events" :text="marker.text" :visible="marker.visible"></el-amap-marker>
        </el-amap>
        <div id="mapDetail"></div>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="getOccurAddress">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: "WorkOrderRegistration",
  components: {
  },
  data() {
    var _this = this
    return {
      // 工单系统后台ip
      // orderIP: 'http://192.168.137.172:9999/css',
      orderIP: 'http://10.13.1.26:8012/css',
      // 服务分类级联框数据
      customerBizTypeData: [],
      cateListProps: {
        value: 'classCode',
        label: 'name',
        children: 'sonList'
      },
      // 紧急程度下拉框数据
      urgencyLevelData: [],
      crumbsData: {  //面包屑
        titleList: [
          { title: '账务中心', path: '/FinancialCenter' },
          { title: '柜台收费', method: () => { window.histroy.back() } },
          { title: '工程类收费', method: () => { window.histroy.back() } }
        ],
      },
      tableQuery: {
        linkMan: '',
        contactNum: '',
        customerBizType: '',
        urgencyLevel: '',
        occurAddress: '',
        detailDescription: '',
        needDispatch: '',
      },
      // 地图弹出框的显示与隐藏
      mapShow: false,
      rules: {
        linkMan: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        contactNum: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        customerBizType: [
          { required: true, message: '请选择服务分类', trigger: 'change' }
        ],
        urgencyLevel: [
          { required: true, message: '请选择紧急程度', trigger: 'change' }
        ],
        occurAddress: [
          { required: true, message: '请输入发生地址', trigger: 'blur' }
        ],
        detailDescription: [
          { required: true, message: '请输入服务描述', trigger: 'blur' }
        ],
      },

      map: '',

      markers: [
        {
          position: [116.405467, 39.907761],
          text: 'hahah'
        }
      ],
      windows: [],
      window1: '',
      zoom: 16,
      center: [116.405467, 39.907761],
      mapStyle: "amap://styles/8b6be8ec497009e17a708205348b899a", //设置地图样式
      searchOption: {
        city: '全国',
        citylimit: true
      },
      marker: {
        position: [116.405467, 39.907761],
        text: 'hahah'
      },
      address: '',
      lng: 0,
      lat: 0,
      events: {
        click(e) {
          console.log(e)
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });

          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                _this.address = self.address
                console.log(self.address)
                _this.markers = [
                  {
                    position: [self.lng, self.lat],
                    text: self.address,
                    // visible: true,
                    // offset: [0, -50],
                    events: {
                      click(e) {
                        console.log(e)
                      }
                    }
                  }
                ]

                // var placeSearch = new AMap.PlaceSearch({
                //   type: '', // 兴趣点类别
                //   pageSize: 5, // 单页显示结果条数
                //   pageIndex: 1, // 页码
                //   city: "010", // 兴趣点城市
                //   citylimit: true,  //是否强制限制在设置的城市内搜索
                //   // map: this.map, // 展现结果的地图实例
                //   panel: "mapDetail", // 结果列表将在此容器中进行展示。
                //   autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                // });
                // console.log(lng, lat)
                // // var cpoint = [116.405467, 39.907761]; //中心点坐标
                // var cpoint = [lng, lat]; //中心点坐标
                // placeSearch.searchNearBy('', cpoint, 200, function (status, result) {
                //   console.log(status, result)
                //   if (status == 'complete') {
                //     result.poiList.pois.forEach((item) => {
                //       _this.markers.push({
                //         position: [item.location.lng, item.location.lat],
                //         text: item.address,
                //         visible: false,
                //         offset: [0, -50],
                //         events: {
                //           click(e) {
                //             console.log(e)
                //           }
                //         }
                //       })
                //     })
                //     console.log(_this.markers)
                //   }

                // });
              }
            }
          });
        }
      },
    };
  },
  mounted() {
    this.common.changeTable(this, ".WorkOrderRegistration", [
      ".WorkOrderRegistration .toolbar",
      ".WorkOrderRegistration .block",
    ]);
    this.getCustomerBizTypeData()
    this.getUrgencyLevelData()

  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    getOccurAddress() {
      this.tableQuery.occurAddress = this.address
      this.mapShow = false
    },



    // 打开地图弹出框
    openMap() {

      // this.point()

      this.mapShow = true
      setTimeout(() => {
        // $('.v-modal').css('z-index', '0')

      }, 1000);
    },
    onSearchResult(pois) {
      console.log(pois)
      var _this = this
      var lng = pois[0].lng
      var lat = pois[0].lat
      this.center = [lng, lat];
      this.marker.position = [lng, lat]
      //地址转换中文
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      geocoder.getAddress([lng, lat], function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            _this.address = result.regeocode.formattedAddress;
            _this.$nextTick();
            _this.markers = [
              {
                position: [lng, lat],
                text: _this.address,
                visible: true,
                offset: [0, -50],
                events: {
                  click(e) {
                    console.log(e)
                  }
                }
              }
            ]
          }
        }
      });
      // var placeSearch = new AMap.PlaceSearch({
      //   type: '', // 兴趣点类别
      //   pageSize: 5, // 单页显示结果条数
      //   pageIndex: 1, // 页码
      //   city: "010", // 兴趣点城市
      //   citylimit: true,  //是否强制限制在设置的城市内搜索
      //   // map: this.map, // 展现结果的地图实例
      //   panel: "mapDetail", // 结果列表将在此容器中进行展示。
      //   autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      // });

      // // var cpoint = [116.405467, 39.907761]; //中心点坐标
      // placeSearch.searchNearBy('', [lng, lat], 200, function (status, result) {
      //   if (status == 'complete') {
      //     result.poiList.pois.forEach((item) => {
      //       _this.markers.push({
      //         position: [item.location.lng, item.location.lat],
      //         text: item.address,
      //         visible: false,
      //         offset: [0, -50],
      //         events: {

      //         }
      //       })
      //     })
      //   }
      // });
    },
    handleChange(value) {
      console.log(value);
    },
    // 获取服务分类级联框数据
    getCustomerBizTypeData() {
      let _this = this
      let params = {
        "busicode": "WorkOrderQuery",
        "data": {
          isShow: 1,
          isShowWorkOrderChange: 0,
        },
      }

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.customerBizTypeData = _this.getTreeData(res)
      })
      // axios({
      //   method: 'post',
      //   url: this.orderIP + '/WorkOrderQuery',
      //   data: {
      //     isShow: 1,
      //     isShowWorkOrderChange: 0,
      //   },
      //   headers: {
      //     "Content-Type": "application/json;charset=UTF-8",
      //     "ticket": sessionStorage.getItem('token')
      //   },
      // }).then((res) => {
      //   this.customerBizTypeData = this.getTreeData(res.data.data)
      // })
    },
    // 服务分类数据处理
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].sonList.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].sonList = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].sonList);
        }
      }
      return data;
    },
    // 获取紧急程度下拉框数据
    getUrgencyLevelData() {
      let _this = this
      let params = {
        "busicode": "WorkOrderDictQuery",
        "data": {
          isShow: 1,
          isShowWorkOrderChange: 0,
        },
      }

      this.$api.fetch({
        params: params,
      }).then(res => {
        res.forEach(item => {
          if (item.code == "urgelevel") {
            _this.urgencyLevelData = item.list
          }
        });
      })
      // axios({
      //   method: 'get',
      //   url: this.orderIP + '/pubDictAll',
      //   // data: {
      //   //   isShow: 1,
      //   //   isShowWorkOrderChange: 0,
      //   // },
      //   headers: {
      //     // "Content-Type": "application/json;charset=UTF-8",
      //     "ticket": sessionStorage.getItem('token')
      //   },
      // }).then((res) => {
      //   res.data.data.forEach(item => {
      //     if (item.code == "urgelevel") {
      //       this.urgencyLevelData = item.list
      //     }
      //   });

      // })
    },

    // 保存方法（由父页面调用）
    submit() {

      this.$refs.form.validate((valid) => {
        let _this = this
        if (valid) {
          let params = {
            busicode: "WorkOrderAdd",
            data: {
              cssFlag: 1,
              infoSource: '9',
              createBy: sessionStorage.getItem('account'),
              groupCode: localStorage.getItem('companyNo'),
              linkMan: this.tableQuery.linkMan,
              contactNum: this.tableQuery.contactNum,
              customerBizType: this.tableQuery.customerBizType[this.tableQuery.customerBizType.length - 1],
              urgencyLevel: this.tableQuery.urgencyLevel,
              occurAddress: this.tableQuery.occurAddress,
              detailDescription: this.tableQuery.detailDescription,
              needDispatch: this.$refs.cascaderSelect.getCheckedNodes()[0].data.needDispatch,
            }
          }

          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              type: 'success',
              message: '添加成功!'
            });
            _this.$parent.$parent.closeDialog()
          })

          // axios({
          //   method: 'post',
          //   url: this.orderIP + '/addOrder',
          //   data: params,
          //   headers: {
          //     "Content-Type": "application/json;charset=UTF-8",
          //     "ticket": sessionStorage.getItem('token')
          //   },
          // }).then((res) => {
          //   _this.$message({
          //     type: 'success',
          //     message: '添加成功!'
          //   });
          //   _this.$parent.$parent.closeDialog()
          // })
        } else {
          return false;
        }
      })
    },
    // 关闭地图弹出框
    closeDialog() {
      this.mapShow = false
      this.address = ''
    },

  },
}
</script>
<style lang="scss">
.WorkOrderRegistration {
  width: 100%;
  height: 100%;
  .el-dropdown {
    color: #1f9fff;
  }
  .map {
    font-size: 18px;
    color: #1e9fff;
    margin: 0 10px;
    cursor: pointer;
  }
  .search-box {
    position: absolute;
    top: 70px;
    left: 40px;
  }
  #mapDetail {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 25%;
    right: 13%;
    width: 280px;
    border-bottom: solid 1px silver;
  }
  .amap-marker {
    display: block !important;
    z-index: 9999 !important;
  }
  .amap-marker img {
    z-index: 9999 !important;
  }
}
</style>
