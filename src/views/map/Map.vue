<template>
  <baidu-map id="register" :center="center" :zoom="zoom" @ready="handler">
    <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
    <!-- <button @click="startPosition" class="start-button">开始记录</button> -->
  </baidu-map>
</template>

<script>
import { Toast } from "mint-ui";
import locIcon from "@/assets/image/blue-loc1.png";
export default {
  name: "register",
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 9,
      mk:''
    };
  },
  methods: {
    handler({ BMap, map }) {
      var vm = this;
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
      this.zoom = 9;
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
    //   map.addEventListener("click", function (e) {
    //       if(vm.$route.path === '/punch') {
    //           var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
    //              anchor: new BMap.Size(20, 32),
    //              imageSize: new BMap.Size(40, 40)
    //           });
    //           map.clearOverlays();
    //           var gc = new BMap.Geocoder();
    //           gc.getLocation(e.point,(rs) => {
    //               vm.mk = new BMap.Marker(e.point, {
    //                   icon:locPoint
    //               });
    //               map.addOverlay(vm.mk);
    //               map.panTo(e.point)
    //               if(rs.surroundingPois.length === 0) {
    //                   Toast({
    //                         message: "未获取到地点,请重新点击或手动输入兴趣点!",
    //                         iconClass: "icon icon-success"
    //                   })
    //                 vm.$emit('clickAddress', {
    //                     address: "",
    //                     bdx : e.point.lng,
    //                     bdy : e.point.lat
    //                 });
    //                 //   return;
    //               }else {
    //                 vm.$emit('clickAddress', {
    //                     address: rs.surroundingPois[0].title ,
    //                     bdx : rs.surroundingPois[0].point.lng,
    //                     bdy : rs.surroundingPois[0].point.lat
    //                 });
    //               }
    //           })
    //       }
    //   })
      var xArr = [];//存放横坐标
      var yArr = [];//存放纵坐标
      
       map.addEventListener("touchstart", function(e){ 
        //手指触摸屏幕的时候清空两个数组
            xArr.length = 0;
            yArr.length = 0;
      });
       
       map.addEventListener("touchmove",function(e){
        //如果滑动了屏幕，xArr和yArr将各存入两个坐标值，即始末坐标值
            xArr.push(e.targetTouches[0].pageX);
            yArr.push(e.targetTouches[0].pageY);
      });

      map.addEventListener('touchend',function(e){
            var far;
            var flag = true;
            //计算平移距离，区分滑动事件和点击事件
            if((xArr.length > 1) && (yArr.length > 1)){
                far = (Math.abs(xArr[0]-xArr[1]))^2 + (Math.abs(yArr[0]-yArr[1]))^2;
                if(far > 0){
                    flag = false;
                }
            }
            if(flag){
              if(vm.$route.path === '/punch') {
                    var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
                        anchor: new BMap.Size(20, 32),
                        imageSize: new BMap.Size(40, 40)
                    });
                    map.clearOverlays();
                    var gc = new BMap.Geocoder();
                    gc.getLocation(e.point,(rs) => {
                        vm.mk = new BMap.Marker(e.point, {
                            icon:locPoint
                        });
                        map.addOverlay(vm.mk);
                        map.panTo(e.point)
                        if(rs.surroundingPois.length === 0) {
                            Toast({
                                    message: "未获取到地点,请重新点击或手动输入兴趣点!",
                                    iconClass: "icon icon-success"
                            })
                            vm.$emit('clickAddress', {
                                address: "",
                                bdx : e.point.lng,
                                bdy : e.point.lat
                            });
                            //   return;
                        }else {
                            vm.$emit('clickAddress', {
                                address: rs.surroundingPois[0].title ,
                                bdx : rs.surroundingPois[0].point.lng,
                                bdy : rs.surroundingPois[0].point.lat
                            });
                        }
                    })
                }
            }
      });


      let _this = this; 
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

    //   map.setMapStyle({ styleJson: styleJson });
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

