import startIcon from '@/assets/image/startIcon.png';
import locationIcon from "@/assets/image/location.png";
import endIcon from "@/assets/image/record1.png";



export function Todate(chinadatetime) { //Fri Oct 31 18:00:00 UTC+0800 2008 
    var d = new Date(chinadatetime);
    var month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
    var date = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
    var datetime = d.getFullYear() + '-' + month + '-' + date;
    return datetime;
}

export function blur() {
    setTimeout(function () {
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
}

export function getURL(url) {
    let _result = '';
    if (process.env.NODE_ENV === 'development') {
        _result = `/api${url}`; // 开发环境会自动走代理
    } else if (process.env.NODE_ENV === 'production') {
        _result = `http://yqfk.ntschy.com/api${url}`; // 正式环境地址
    }
    return _result;
}

export function chinaDateTime(chinadatetime) {
    // // 转为正常的时间格式 年-月-日 时:分:秒
    // var T_pos = utc_datetime.indexOf('T');
    // var Z_pos = utc_datetime.indexOf('Z');
    // var year_month_day = utc_datetime.substr(0,T_pos);
    // var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    // var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // // 处理成为时间戳
    // timestamp = new Date(Date.parse(new_datetime));
    // timestamp = timestamp.getTime();
    // timestamp = timestamp/1000;

    // // 增加8个小时，北京时间比utc时间多八个时区
    // var timestamp = timestamp+8*60*60;

    // // 时间戳转为时间
    // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    // return beijing_datetime; // 2017-03-31 16:02:06
    var d = new Date(chinadatetime);
    var month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
    var date = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
    var hour = d.getHours() >= 10 ? d.getHours() : "0" + d.getHours();
    var minutes = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
    var datetime = d.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minutes;
    return datetime;
}

// 设置轨迹起点
export function addStartMarker(point, name, mapInit) {
    if (name == "起点") {
        var myIcon = new BMap.Icon(startIcon, new BMap.Size(45, 45), {
            anchor: new BMap.Size(0, 0), //这句表示图片相对于所加的点的位置mapStart
            imageSize: new BMap.Size(20, 20) //图标所用的图片的大小，此功能的作用等同于CSS中的background-size属性。可用于实现高清屏的高清效果
            // offset: new BMap.Size(-10, 45), // 指定定位位置
            // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
        });
        window.marker = new BMap.Marker(point, {
            icon: myIcon
        }); // 创建标注
        mapInit.addOverlay(marker); // 将标注添加到地图中
        //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    }
}

// 划线
export function drowLine(map, PointArr, PointArrNext, carMk) {
    if (PointArrNext != undefined) {
        var polyline = new BMap.Polyline(
            [
                new BMap.Point(PointArr.lng, PointArr.lat),
                new BMap.Point(PointArrNext.lng, PointArrNext.lat)
            ], {
                strokeColor: "red",
                strokeWeight: 7,
                strokeOpacity: 1
            }); //创建折线
        window.baseMap.addOverlay(polyline);
        addMarkerEnd(new BMap.Point(PointArrNext.lng, PointArrNext.lat), '人物行驶', map, PointArrNext, new BMap.Point(PointArr.lng, PointArr.lat), carMk); //添加图标
    } else {
        addMarkerEnd(new BMap.Point(PointArr.lng, PointArr.lat), '终点', map, carMk); //添加终点图标
    }
}

//添加行驶和终点图标
export function addMarkerEnd(point, name, mapInit, trackUnit, prePoint, carMk) {
    var drivingPoint = new BMap.Icon(locationIcon, new BMap.Size(10, 10), {
        anchor: new BMap.Size(5, 5),
        imageSize: new BMap.Size(10, 10)
    });
    //终点图标
    var terminalPoint = new BMap.Icon(startIcon, new BMap.Size(45, 45), {
        anchor: new BMap.Size(20, 45),
        imageSize: new BMap.Size(20, 20)
    });
    if (name == "人物行驶") {
        if (carMk) { //先判断第一次进来的时候这个值有没有定义，有的话就清除掉上一次的。然后在进行画图标。第一次进来时候没有定义也就不走这块，直接进行画图标
            mapInit.removeOverlay(carMk);
        }
        carMk = new BMap.Marker(point, {
            icon: drivingPoint
        }); // 创建标注
        carMk.setRotation(trackUnit.route); //trackUnit.route
        //getAngle(point,prePoint);// js求解两点之间的角度
        carMk.setRotation(getAngle(point, prePoint) - 90); // 旋转的角度
        mapInit.addOverlay(carMk); // 将标注添加到地图中
        //carMk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    } else {
        mapInit.removeOverlay(carMk);
        carMk = new BMap.Marker(point, {
            icon: terminalPoint
        }); // 创建标注
        mapInit.addOverlay(carMk);
    }
}
//获得角度的函数
export //获得角度的函数
function getAngle(n, next) {
    var ret
    var w1 = n.lat / 180 * Math.PI
    var j1 = n.lng / 180 * Math.PI

    var w2 = next.lat / 180 * Math.PI
    var j2 = next.lng / 180 * Math.PI

    ret = 4 * Math.pow(Math.sin((w1 - w2) / 2), 2) - Math.pow(Math.sin((j1 - j2) / 2) * (Math.cos(w1) - Math.cos(w2)), 2);
    ret = Math.sqrt(ret);

    // var temp = Math.sin(Math.abs(j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
    var temp = Math.sin((j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
    console.log(temp)
    ret = ret / temp;

    ret = Math.atan(ret) / Math.PI * 180;
    ret += 90;

    // 这里用如此臃肿的if..else是为了判定追踪单个点的具体情况,从而调整ret的值
    if (j1 - j2 < 0) {
        // console.log('j1<j2')
        if (w1 - w2 < 0) {
            // console.log('w1<w2')
            ret;
        } else {
            // console.log('w1>w2')
            ret = -ret + 180;
        }
    } else {
        // console.log('j1>j2')
        if (w1 - w2 < 0) {
            // console.log('w1<w2')
            ret = 180 + ret;
        } else {
            // console.log('w1>w2')
            ret = -ret;
        }
    }
    return ret;
}
// 获取中心点
export function getCenterPoint(path) {
    //var path =e.;
    //Array<Point> 返回多边型的点数组
    //var ret=parseFloat(num1)+parseFloat(num2);
    var x = 0.0;
    var y = 0.0;
    for (var i = 0; i < path.length; i++) {
        x = x + parseFloat(path[i].lng);
        y = y + parseFloat(path[i].lat);
    }
    x = x / path.length;
    y = y / path.length;
    //return new BMap.Point(path[0].lng,path[0].lat);
    return new BMap.Point(x, y);
    //return path[0];
}