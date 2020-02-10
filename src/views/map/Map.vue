<template>
  <baidu-map id="register" :center="center" :zoom="zoom" @ready="handler">
    <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
    <!-- <button @click="startPosition" class="start-button">开始记录</button> -->
  </baidu-map>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3
    };
  },
  methods: {
    handler({ BMap, map }) {
      window.baseMap = map;
      map.addEventListener("zoomend", function (e) {
         var ZoomNum = map.getZoom();
         var layers =  window.baseMap.getOverlays();
         if(ZoomNum >= 13) {
            layers.map((v) => {
                if(v.content&&v.content !=="shadow") {
                    //  console.log(v.content);
                    v.show();
                }
            })
         }else {
             layers.map((v) => {
                if(v.content&&v.content !=="shadow") {
                    //  console.log(v.content);
                    v.hide();
                }
            })
         }   
      });
      map.addEventListener("moveend", function (e) {
      var ZoomNum = map.getZoom();
         var layers =  window.baseMap.getOverlays();
         if(ZoomNum >= 13) {
            layers.map((v) => {
                if(v.content&&v.content !=="shadow") {
                    //  console.log(v.content);
                    v.show();
                }
            })
         }else {
             layers.map((v) => {
                if(v.content&&v.content !=="shadow") {
                    //  console.log(v.content);
                    v.hide();
                }
            })
         } 
      })
      let _this = this; 
      this.zoom = 15;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // var mk = new BMap.Marker(r.point);
            // map.addOverlay(mk);
            map.panTo(r.point);
            console.log("您的位置：" + r.point.lng + "," + r.point.lat);
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
        var styleJson = [
            {
                featureType: "poilabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "estatelabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "estatelabel",
                elementType: "labels",
                stylers: {
                    visibility: "on"
                }
            },
            {
                featureType: "estatelabel",
                elementType: "labels.text",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "poilabel",
                elementType: "labels.text",
                stylers: {
                    fontsize: "24"
                }
            },
            {
                featureType: "medicallabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "on"
                }
            },
            {
                featureType: "medicallabel",
                elementType: "labels.text",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "restaurantlabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "hotellabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "carservicelabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "transportationlabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "financelabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "scenicspotslabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "scenicspotslabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "restaurantlabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "hotellabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "carservicelabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "lifeservicelabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "lifeservicelabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "poilabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "entertainmentlabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "entertainmentlabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "businesstowerlabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "businesstowerlabel",
                elementType: "labels.text",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "companylabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "companylabel",
                elementType: "labels.text",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "shoppinglabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "shoppinglabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "educationlabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "transportationlabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "financelabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "governmentlabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "airportlabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "airportlabel",
                elementType: "labels.icon",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "educationlabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "businesstowerlabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "companylabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "governmentlabel",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "medicallabel",
                elementType: "labels",
                stylers: {
                    visibility: "on"
                }
            },
            {
                featureType: "village",
                elementType: "labels",
                stylers: {
                    visibility: "on"
                }
            },
            {
                featureType: "transportation",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "education",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "manmade",
                elementType: "labels",
                stylers: {
                    visibility: "on"
                }
            },
            {
                featureType: "scenicspots",
                elementType: "labels",
                stylers: {
                    visibility: "off"
                }
            },
            {
                featureType: "medical",
                elementType: "labels",
                stylers: {
                    visibility: "on"
                }
            }
        ];

      map.setMapStyle({ styleJson: styleJson });
      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r){
      // 	if(this.getStatus() == BMAP_STATUS_SUCCESS){
      // 		var mk = new BMap.Marker(r.point);
      // 		map.addOverlay(mk);
      // 		map.panTo(r.point);
      // 		alert('您的位置：'+r.point.lng+','+r.point.lat);
      // 	}
      // 	else {
      // 		alert('failed'+this.getStatus());
      // 	}
      // },{enableHighAccuracy: true})
    },
    addressDetail() {
      //获取地理位置
      var self = this;
      //全局的this在方法中不能使用，需要重新定义一下
      var geolocation = new BMap.Geolocation();
      //调用百度地图api 中的获取当前位置接口
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          //获取当前位置经纬度
          var myGeo = new BMap.Geocoder();
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(
            result
          ) {
            // console.log(result);
            console.log(result);
            alert(result.address);
            // if (result) {
            //   //根据当前位置经纬度解析成地址
            //   self.ADDRESS_DETAIL(
            //     result.addressComponents.district +
            //       result.addressComponents.street
            //   );

            //   self.geohash = result.point.lat + "," + result.point.lng;
            //   self.SAVE_GEOHASH(self.geohash);

            //   self.latitude = result.point.lat;
            //   self.longitude = result.point.lng;
            //   // console.log(result.point.lat); self.RECORD_ADDRESS({'latitude':result.point.lat,'longitude':result.point.lng});
            // }
          });
        }
      });
    },
    startPosition() {
      this.addressDetail();
    }
  },
  components: {}
};
</script>
<style lang="less" scoped>
#register {
  height: 100%;
  .start-button {
    position: absolute;
    left: 10px;
    top: 10px;
  }
}
</style>

