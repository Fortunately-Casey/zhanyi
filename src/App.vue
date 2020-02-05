/* eslint-disable no-undef */
<template>
  <baidu-map id="app" :center="center" :zoom="zoom" @ready="handler">
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
  </baidu-map>
</template>
<script>
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3
    };
  },
  mounted() {
    setInterval(() => {
      // this.addressDetail();
    }, 2000);
  },
  methods: {
    handler({ BMap, map }) {
      // console.log(BMap, map);
      // this.center.lng = 121.873;
      // this.center.lat = 32.014;
      let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      this.zoom = 15;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          // console.log(r);
          // _this.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
          // _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude }; // 自定义覆盖物
          // _this.initLocation = true;
          // console.log("center:", _this.center); // 如果这里直接使用this是不行的
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            console.log("您的位置：" + r.point.lng + "," + r.point.lat);
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
      // 下面注释是百度地图API官方实现方法，因为我使用自定义图标覆盖物，所以没有使用这种方法！
      // 如使用以下这种方法，那么我Template里所写的自定义定位图标代码是不需要的
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
            if (result) {
              //根据当前位置经纬度解析成地址
              self.ADDRESS_DETAIL(
                result.addressComponents.district +
                  result.addressComponents.street
              );

              self.geohash = result.point.lat + "," + result.point.lng;
              self.SAVE_GEOHASH(self.geohash);

              self.latitude = result.point.lat;
              self.longitude = result.point.lng;
              // console.log(result.point.lat); self.RECORD_ADDRESS({'latitude':result.point.lat,'longitude':result.point.lng});
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less">
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0px;
  padding: 0px;
}
.anchorBL {
  display: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
