<template>
  <div class="Meter-Reading-Track">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>
    <div class="Meter-Reading-Track-right-content">
      <div class="kr-left">
        <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
          <el-form :inline="true" :label-width="isIE ? '60px' : '50px'" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="账期：">
              <el-date-picker v-model="tableQuery.accountPeriod" size="mini" type="month" unlink-panels format="yyyy-MM" value-format="yyyyMM" placeholder="选择月">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="抄表员：" label-width="70px">
              <el-select ref="select1" v-model="tableQuery.meterReadingStaff" size="mini">
                <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn' @click="init" icon="el-icon-search"></el-button>
            </el-form-item>
            <div style=" color: #c3c3c3;">选中表格行，可查看抄表员抄表轨迹噢</div>
          </el-form>
        </div>
        <div class="kl-table">
          <el-table ref='klTableData' v-show="tableShow" highlight-current-row :max-height="maxHeight" stripe border fixed="left" :data="tableData" @row-click="handleRowChange">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="meterReadingStaffName" min-width="60" label="抄表员"></el-table-column>
            <el-table-column prop="totalReading" min-width="70" label="抄表总数"></el-table-column>
            <el-table-column prop="bookNo" min-width="110" label="册本号"></el-table-column>
            <!-- <el-table-column label="轨迹" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button type="text" @click.native="editContent = true" style="font-size:12px;">轨迹查询</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
      <div class="kr-right">
        <el-amap vid="amapDemo" ref="map" :zoom="zoom" :center="center">
        </el-amap>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Meter-Reading-Track-index",
  data() {
    return {

      tableData: [
      ],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "抄表开账" },
          { title: "抄表" },
          { title: "抄表轨迹" }
        ]
      },
      tableQuery: {
        //查询表单数据
        accountPeriod: "202004",//账期
        meterReadingStaff: '',//抄表员

      },

      //抄表员
      meterReaderList: [],
      maxHeight: 0,
      tableShow: false,

      zoom: 19,
      // center: [114.138776, 22.564458],
       center: [106.26667,38.46667],
         path: [],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          // 这里通过高德 SDK 完成。
          let geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
      window: "",
      multipleTable: [],

    };
  },
  computed: {
    isIE() {
      return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
    }
  },
  mounted() {
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    this.tableQuery.accountPeriod = time.getFullYear() + '' + month
    this.init();
    // 抄表员下拉数据
    this.getReadingStaff()

    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(
        this,
        ".Meter-Reading-Track .kr-left",
        [".Meter-Reading-Track .toolbar"]
      );
    });
  },
  methods: {
       renderPath(d){
      var that = this;
    
       AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

       window.pathSimplifierIns&&window.pathSimplifierIns.setData([]); //切换时先重置轨迹数据重新渲染
        if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
        }

        var pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: that.$refs.map.$$getInstance(), //所属的地图实例
            getPath: function(pathData, pathIndex) {

                return pathData.path;
            },
            renderOptions: {

              keyPointTolerance:40,
                pathLineStyle: {
                    dirArrowStyle: true
                },
                getPathStyle: function(pathItem, zoom) {

                    return {
                        pathLineStyle: {
                            strokeStyle: 'rgba(0,0,0,0)',
                            borderWidth:0,
                            lineWidth:0
                        },
                        pathLineSelectedStyle: {
                            lineWidth:6
                        },
                        pathNavigatorStyle: {
                            fillStyle: '#303133'
                        }
                    };
              }
            }
        });

        window.pathSimplifierIns = pathSimplifierIns;

        pathSimplifierIns.setData([{name:'抄表轨迹',path:d}]);
  
            //创建一个巡航器
            window.navg0 = pathSimplifierIns.createPathNavigator(0, {
                loop: true, //循环播放
                speed: 6000
            });
            window.navg0.start();
    });

    },
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let _this = this
      let params = {
        "busicode": "MrTravelList",
        "data": this.tableQuery,
      }

      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.tableData = res
      })
    },

    indexMethod(index) {//获取表格序号
      return (index + 1)
    },
    handleRowChange(row, column, event) {
      let _this = this
      this.path = []
      let params = {
        "busicode": "MrTravelQuery",
        "data": {
          "bookNo": row.bookNo,
          "accountPeriod": _this.tableQuery.accountPeriod
        },
      }

      this.$api.fetch({
        params: params,
      }).then(res => {
        res.forEach(item => {
          if(item.longitude!="" && item.longitude!=0 && item.latitude!=0 && item.latitude!=""&&!isNaN(item.latitude)&&!isNaN( item.longitude)) {
              _this.path.push([Number(item.longitude), Number(item.latitude)])
   
          }
            
        })
         this.renderPath(this.path)
        // 定位动态中心坐标
        _this.center = _this.path[Math.ceil((_this.path.length + 1) / 2)]
      })
    },
    // 抄表员数据获取
    getReadingStaff() {
      var _this = this
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.meterReaderList = [...[{ userName: "全部" }], ...res]
      })
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    tableData: function () {
      this.$nextTick(function () {
        this.$refs.klTableData.setCurrentRow(this.tableData[0], true)
      })
    }
  }
};
</script>
<style lang="scss">
$imgWidth: 200px;
$theme-color: #297acc;
.Meter-Reading-Track {
  .demo-form-inline {
    .el-date-editor {
      width: 90%\0;
    }
    .el-form-item__label {
      font-size: 12px\0;
    }
  }
  .Meter-Reading-Track-right-content {
    height: calc(100% - 41px);
    display: flex;
    flex-direction: row;
    .kr-left {
      overflow-y: auto;
      width: 25%;
      height: 100%;
    }
    .kr-right {
      width: 75%;
      height: 100%;
      touch-action: none;
    }


    .el-vue-amap-container {
      touch-action: pan-y;
    }
    .el-vue-amap {
      touch-action: pan-y;
    }
    .amap-maps {
      touch-action: pan-y;
    }
    .amap-drags {
      touch-action: pan-y;
    }
    .amap-layers {
      touch-action: pan-y;
    }
    .amap-layer {
      touch-action: pan-y;
    }
    
  }
}
</style>

