<template>
    <div class="punch" ref="punch">
        <div class="header">
            健康分析
            <div class="back" @click="goBack">
                首页
                <div class="back-icon"></div>
            </div>
        </div>
        <div class="top">
            <div class="item">
                <div class="name">日期</div>
                <div class="value">
                    <div class="date" @click="openPicker">{{returnDate(dateValue)}}</div>
                </div>
            </div>
            <div class="item">
                <div class="name">身份证号</div>
                <div class="value">
                    <input type="text" v-model="idCard" @blur="lostblur">
                </div>
            </div>
            <div class="item">
                <div class="name">电话号码</div>
                <div class="value">
                    <input type="text" v-model="phoneNumber" @blur="lostblur">
                </div>
            </div>
        </div>
        <div class="first">
            <div class="item">
                <div class="cross-address">1. 途径地点
                    <div class="local-icon" @click="showMap"></div>
                </div>
            </div>
            <div class="item">
                <div class="address">
                    {{addressValue}}
                </div>
            </div>
        </div>
        <div class="second">
            <div class="item">
                <div class="name">2. 途径时间</div>
                <div class="value">
                    <div class="date" @click="choseTime">{{timeValue}}</div>
                </div>
           </div>
        </div>
        <div class="third">
            <div class="item">
                <div class="name">3. 体温读数</div>
                <div class="value">
                    <input type="text" placeholder="输入体温" v-model="temperature" @blur="lostblur">
                </div>
           </div>
        </div>
        <div class="fourth">
            <div class="item">
                <div class="name">
                    <div class="health-title">
                        4. 健康症状
                    </div>
                </div>
           </div>
            <div class="item" >
                <div class="name">
                    <div class="health-item" @click="choseHealth(0)">
                        健康
                        <div class="chosed-icon" v-if="isChosedHealth"></div>
                    </div>
                </div>
           </div>
           <div class="item" >
            <div class="name">
                <div class="health-item" @click="choseHealth(1)">
                    咳嗽
                    <div class="chosed-icon" v-if="isChosedCough"></div>
                </div>
            </div>
           </div>
           <div class="item" >
            <div class="name">
                <div class="health-item"@click="choseHealth(2)">
                    发热
                    <div class="chosed-icon" v-if="isChosedHot"></div>
                </div>
            </div>
           </div>
        </div>
        <div class="fifth">
            <div class="item">
                <div class="name">
                    <div class="cross-title">
                        5. 14天内是否经过疫区？<span>（湖北省、武汉市、温州市等）</span>
                    </div>
                </div>
           </div>
            <div class="item" v-for="(item,index) in crossList" :key="index" @click="choseCross(index)">
                <div class="name">
                    <div class="cross-item">
                        {{item.value}}
                        <div class="chosed-icon" v-if="chosedCrossIndex === index?true:false"></div>
                    </div>
                </div>
           </div>
        </div>
        <div class="bottom">
            <div class="look-button" @click="searchReport">查询报告</div>
            <div class="punch-button" @click="punchTo">打卡</div>
        </div>
        <mt-datetime-picker
            ref="datepicker"
            v-model="pickerValue"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="confirmDate"
        ></mt-datetime-picker>
        <mt-datetime-picker
            ref="timepicker"
            type="time"
            v-model="timepicker"
            @confirm="confirmTime"
            >
        </mt-datetime-picker>
        <div class="map"v-show="isShowMap">
            <div class="click-box">
                <div class="map-title">
                    {{clickValue}}
                </div>
                <div class="confirm" @click="confirmAddress">确认</div>
            </div>
            <m-map @clickAddress="clickAddress">
            </m-map>
        </div>
        <div class="punch-success" v-if="isShowSuccess">
            <div class="icon-close" @click="isShowSuccess = !isShowSuccess"></div>
            <div class="red-message">
                恭喜您，打卡成功!
            </div>
            <div class="message">
                勤打卡有助于您获取更加精准的健康分析结果
            </div>
        </div>
        <div class="search-report" v-if="isShowReport">
            <div class="icon-close" @click="isShowReport = !isShowReport"></div>
            <div class="result">
                查看结果
            </div>
            <div class="health" v-if="!epidemicArea">
                <div class="health-icon"></div>
                依据现有确诊人员数据及您的打卡信息，您非密切接触人员
            </div>
            <div class="report-list" v-else>
                <div class="bad"  v-for="(item,index) in reportList" :key="index">
                    <div class="bad-icon"></div>
                    {{item.date}}{{item.time}}您经过{{item.placeName}}，5天内确诊者也在此逗留
                </div>
            </div>
            <div class="tips">
                <div class="tips-icon"></div>
                温馨提示:{{!epidemicArea?"减少外出，加强防护，关注体温":"需在家隔离14天，如有症状请及时就医"}}
            </div>
            <div class="function">
                <span class="left">分析方法</span>
                <div class="plus" v-if="!isShowFunction"></div>
                <div class="minus" v-else></div>
                <span class="right" @click="isShowFunction = !isShowFunction">（点击查看详情）</span>
                <div class="function-message" v-if="isShowFunction">依据南通市确诊人员轨迹，及您14天打卡数据进行对比分析</div>
            </div>
            <div class="bottom-message">
                确诊轨迹来源于南通市疾病预防控制中心
            </div>
        </div>
    </div>
</template>
<script>
import { Todate, blur, Totime } from "@/common/tool/tool.js";
import locIcon from "@/assets/image/blue-loc1.png";
import MMap from "../map/Map.vue";
import { Toast } from "mint-ui";
import { getHistoryIDCardMobile, savePeriodPlace, healthAnalysis } from "@/api/punch.js";
export default {
    data() {
        return {
            weixin:"",
            date:"2020/02/11",
            healthList:[
                {
                    value:"健康"
                },
                {
                    value:"咳嗽"
                },
                {
                    value:"发热"
                }
            ],
            crossList:[
                {
                    value:"是"
                },
                {
                    value:"否"
                }
            ],
            pickerValue:"",
            timepicker:"",
            idCard:"",
            phoneNumber:"",
            dateValue:new Date(),
            timeValue:this.returnTime(new Date()),
            temperature:"",
            chosedHealthIndex:0,
            chosedCrossIndex:1,
            isChosedHealth:true,
            isChosedHot:false,
            isChosedCough:false,
            isShowMap:false,
            localPoint:"",
            clickValue:"点击地图选择位置",
            addressValue:"",
            bdx:"",
            bdy:"",
            isShowSuccess:false,
            isShowReport:false,
            epidemicArea:"",
            isShowFunction:false,
            reportList:[]
        }
    },
    created() {
        var wxid = window.localStorage.getItem("WXID");
        this.weixin = wxid;
        this.getHistoryIDCardMobile();
        setTimeout(() => {
            this.getLocalAddress();
        },1000);
    },
    mounted() {
       
    },
    methods:{
    shareList(imgUrl, link, desc, title) {
      // var url = encodeURIComponent(link)
      var url = link;
      // 分享
      const signUrl = getURL("/weixin/getSignPackage");
      axios
        .post(signUrl, { url: url })
        .then(res => {
          res = res.data.data;
          wx.config({
            debug: false, // true:是调试模式,调试时候弹窗,会打印出日志
            appId: res.appId, // 微信appid
            timestamp: res.timestamp, // 时间戳
            nonceStr: res.nonceStr, // 随机字符串
            signature: res.signature, // 签名
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              "updateTimelineShareData",
              "updateAppMessageShareData"
            ]
          });
          wx.checkJsApi({
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              "updateTimelineShareData",
              "updateAppMessageShareData"
            ],
            success: function(res) {
              // alert("checkJsApi:success");
            }
          });

          wx.ready(function() {
            // 微信分享的数据
            var shareData = {
              imgUrl: imgUrl, // 分享显示的缩略图地址
              link: link, // 分享地址
              desc: desc, // 分享描述
              title: title, // 分享标题
              success: function() {
                // 分享成功可以做相应的数据处理
                // alert('分享成功')
                // alert('appId:' + res.appId)
                // alert('timestamp:' + res.timestamp)
                // alert('nonceStr:' + res.nonceStr)
                // alert('signature:' + res.signature)
                console.log("调用成功");
              },
              fail: function() {
                // alert('调用失败')
                console.log("失败");
              },
              complete: function() {
                // alert('调用结束')
                console.log("调用结束");
              }
            };
            wx.updateAppMessageShareData(shareData);
            wx.updateTimelineShareData(shareData);
          });
          wx.error(function(res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，
            // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
            // 对于SPA可以在这里更新签名。
            console.log(res);
            //alert('分享失败')
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
        // 获取是否有打卡记录
        getHistoryIDCardMobile() {
            var vm = this;
            getHistoryIDCardMobile({
                wxID:vm.weixin
            }).then((resp) => {
                if(resp.data.data.length > 0) {
                    vm.idCard = resp.data.data[0].idCard;
                    vm.phoneNumber = resp.data.data[0].mobile;
                }
                this.shareList('https://yqfk.ntschy.com/swnt.png', window.location.href, '关注南通疫情，定位离你最近的疫区。数据来源：南通市疾病预防控制中心', '战疫图 • 南通（持续更新）');
            })
        },
        // 打卡
        punchTo() {
            var vm = this;
            if(!vm.temperature) {
                Toast({
                    message: "请输入体温读数！",
                    iconClass: "icon icon-success"
                })
                return;
            }
            if(!vm.idCard) {
                Toast({
                    message: "请输入身份证号！",
                    iconClass: "icon icon-success"
                })
                return;
            }
            if(!vm.phoneNumber) {
                Toast({
                    message: "请输入电话号码！",
                    iconClass: "icon icon-success"
                })
                return;
            }
            var params = {
                wxID:vm.weixin,
                idCard:vm.idCard,
                mobile:vm.phoneNumber,
                placeName:vm.addressValue,
                bdx:vm.bdx.toString(),
                bdy:vm.bdy.toString(),
                stime:vm.returnDate(vm.dateValue) + " " + vm.timeValue,
                healthy1:vm.isChosedHealth,
                healthy2:vm.isChosedCough,
                healthy3:vm.isChosedHot,
                temp:vm.temperature,
                epidemicArea:vm.chosedCrossIndex === 0?true:false
            }
            savePeriodPlace(params).then((resp) => {
                if(resp.data.success) {
                    vm.isShowSuccess = true;
                }else {
                    Toast({
                        message: "打卡失败!",
                        iconClass: "icon icon-success"
                    })
                }
            })
        },
        // 健康报告
        searchReport() {
            var vm = this;
            if(!vm.idCard) {
                Toast({
                        message: "当前账号并未打卡!",
                        iconClass: "icon icon-success"
                })
                return;
            }
            healthAnalysis({
                idCard:vm.idCard
            }).then((resp) => {
                if(!resp.data.success) {
                    Toast({
                        message: "查询失败!",
                        iconClass: "icon icon-success"
                    })
                    vm.isShowReport = false;
                }else {
                    vm.isShowReport = true;
                    if(resp.data.data.epidemicArea) {
                    vm.epidemicArea = resp.data.data.epidemicArea;
                    if(resp.data.data.healthAnalysisList.length > 0) {
                        var arr = []
                        resp.data.data.healthAnalysisList.map((v) => {
                            var date = v.selfPeriodPlaceTime.split(" ")[0];
                            var time = v.selfPeriodPlaceTime.split(" ")[1];
                            date = vm.changeStr(date,4,'年');
                            date = vm.changeStr(date,7,'月');
                            date = date + "日"
                            arr.push({
                                placeName:v.selfPlaceName,
                                time:time.substring(0,time.length -5),
                                date:date
                            })
                        })
                        vm.reportList = arr;
                    }
            
                } 
                }
            })
        },
        openPicker() {
            this.$refs.datepicker.open();
        },
        choseTime() {
            this.$refs.timepicker.open();
        },
        returnDate(value) {
            return Todate(value);
        },
        returnTime(value) {
            return Totime(value);
        },
        confirmDate(value) {
            this.dateValue = value;
        },
        confirmTime(value) {
            this.timeValue = value;
        },
        choseCross(index) {
            this.chosedCrossIndex = index;
        },
        choseHealth(index) {
            if(index === 0) {
                this.isChosedHealth = true;
                this.isChosedCough = false;
                this.isChosedHot = false;
            }
            if(index === 1) {
                this.isChosedCough = true;
                this.isChosedHealth = false;
            }
            if(index === 2) {
                this.isChosedHot = true;
                this.isChosedHealth = false;
            }
        },
        showMap() {
            window.baseMap.removeOverlay();
            this.location();
            this.isShowMap = true;
            this.$refs.punch.style.overflowY = "hidden";
        },
        location() {
            var vm = this;
            var geolocation = new BMap.Geolocation();
            window.baseMap.removeOverlay(vm.localPoint);
            geolocation.getCurrentPosition(
                function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
                    anchor: new BMap.Size(5, 5),
                    imageSize: new BMap.Size(40, 40)
                    });
                    var mk = new BMap.Marker(r.point, {
                    icon: locPoint
                    });
                    vm.localPoint = mk;
                    window.baseMap.addOverlay(mk);
                    window.baseMap.setZoom(17);
                    window.baseMap.panTo(r.point);
                } else {
                    alert("failed" + this.getStatus());
                }
                },
                { enableHighAccuracy: true }
            );
        },
        getLocalAddress() {
            var vm = this;
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(
                function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var gc = new BMap.Geocoder();
                    gc.getLocation(r.point,(rs) => {
                        vm.addressValue = rs.surroundingPois[0].title;
                        vm.bdx = rs.surroundingPois[0].point.lng;
                        vm.bdy = rs.surroundingPois[0].point.lat;
                    })
                } else {
                    alert("failed" + this.getStatus());
                }
                },
                { enableHighAccuracy: true }
            );
        },
        lostblur() {
            blur();
        },
        clickAddress(address) {
            this.clickValue = address.address;
            this.bdx = address.bdx;
            this.bdy = address.bdy;
        },
        confirmAddress() {
            this.$refs.punch.style.overflowY = "auto";
            this.addressValue = this.clickValue;
            this.isShowMap = false;
            this.clickValue = "点击地图选择位置";
        },
        goBack() {
            this.$router.push({
                path:"/main"
            })
        },
        changeStr(str,index,changeStr) {
            return str.substr(0, index) + changeStr+ str.substr(index + changeStr.length);
        }
    },
    components:{
        MMap
    }
}
</script>

<style lang="less" scoped>
        .punch {
        height:100%;
        background-color:#eee;
        position: relative;
        .map {
            width: 100%;
            height: 100%;
            position: absolute;
            left:50%;
            top:0;
            z-index: 999;
            transform:translateX(-50%);
            padding-top:40px;
            box-sizing:border-box;
            border:1px solid #eee;
            .click-box {
                position: absolute;
                left: 0;
                bottom:0;
                z-index: 999;
                height: 40px;
                width: 100%;
                background-color: #fff;
                .map-title {
                    position: absolute;
                    left: 10%;
                    top:50%;
                    z-index: 999;
                    transform:translateY(-50%);
                }
                .confirm {
                    width: 60px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    border-radius: 10px;
                    background-color: rgb(235, 56, 39);
                    color: #fff;
                    letter-spacing: 4px;
                    position: absolute;
                    right: 40px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }

        }
        .header {
            height: 40px;
            background-color: #D22D2D;
            color: #fff;
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            position: relative;
            .back {
                width: 60px;
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                .back-icon {
                    width: 8px;
                    height: 13px;
                    background: url("../../assets/image/back-icon.png") no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
        .top {
            background-color:#fff;
            .item {
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #f2f2f2;
                font-weight: bold;
                display: flex;
                .name {
                    width: 30%;
                    padding-left: 20px;
                    box-sizing: border-box;
                    text-align: left;
                    letter-spacing: 2px;
                }
                .value {
                    width:70%;
                    display:flex;
                    padding-right:15px;
                    justify-content:flex-end;
                    input {
                        transform:translateY(1px);
                        text-align: right;
                        text-align: end;
                    }
                }
            }
            .item:first-child {
                .name {
                    letter-spacing: 28px;
                    
                }
            }
        }
        .first,.fourth,.fifth {
            margin-top:15px;
            background-color:#fff;
            .item {
                height:40px;
                line-height:40px;
                padding:0 20px;
                font-weight: bold;
                .cross-address{
                    border-bottom:1px solid #efefef;
                    position: relative;
                    .local-icon {
                        width: 20px;
                        height: 28px;
                        background:url("../../assets/image/red-local.png") no-repeat;
                        background-size:10px 14px;
                        background-position:center center;
                        position: absolute;
                        right: 5px;
                        top:50%;
                        transform:translateY(-50%);
                    }
                }
                .health-item,.cross-item {
                    border-bottom:1px solid #efefef;
                    padding-left: 10px;
                    color: #585858;
                    position: relative;
                    .chosed-icon {
                        background: url("../../assets/image/green-chosed.png") no-repeat;
                        width: 16px;
                        height: 16px;
                        background-size:100% 100%;
                        position: absolute;
                        right:20px;
                        top:50%;
                        transform:translateY(-50%);
                    }
                }
                .health-title,.cross-title {
                    border-bottom:1px solid #efefef;
                    span {
                        color: #c7c7c7;
                    }
                } 
                .address {
                    color: #585858;
                    padding-left:10px;
                }
            }
        }
        .second,.third {
            margin-top:15px;
            background-color:#fff;
            .item {
                height:40px;
                line-height:40px;
                padding:0 20px;
                font-weight: bold;
                display: flex;
                .name {
                    width: 30%;
                }
                .value {
                    width: 70%;
                    text-align: right;
                    display: flex;
                    justify-content:flex-end;
                    input {
                        width: 55px;
                    }
                }
            }
        }
        .bottom {
            height: 80px;
            background-color: #eee;
            display: flex;
            justify-content:center;
            .look-button,.punch-button {
                width: 155px;
                height: 40px;
                border-radius:20px;
                background-color: #D22D2D;
                text-align: center;
                line-height: 40px;
                color:#fff;
                font-size:15px;
                margin-top:20px;
            }
            .look-button {
                margin-right:15px;
            }
        }
        .punch-success,.search-report {
            width: 75%;
            /* height: 20%; */
            background-color: #fff;
            border: 1px solid rgb(196, 193, 193);
            border-radius: 5px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            z-index: 999;
            .icon-close {
                width: 20px;
                height: 20px;
                background:url("../../assets/image/icon-close.png") no-repeat;
                background-size:100% 100%;
                position: absolute;
                right:10px;
                top:10px;
            }
            .red-message {
                width: 150px;
                padding-left:20px;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color:red;
                margin-top:15px;
            }
            .message {
                padding:20px;
                font-size: 14px;
            }
            .result {
                width: 150px;
                padding-left:20px;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                font-weight: bold;
            }
            .health,.bad,.tips {
                width: 90%;
                padding-left: 25px;
                padding-right: 10px;
                margin: 0 auto;
                line-height: 25px;
                box-sizing: border-box;
                margin-bottom: 5px;
                border-radius: 5px;
                font-size: 12px;
                color: #fff;
            }
            .health {
                background-color: #3CC77B;
                position: relative;
                .health-icon {
                    width: 14px;
                    height: 16px;
                    background:url("../../assets/image/安全.png") no-repeat;
                    background-size:100% 100%;
                    position: absolute;
                    left:5px;
                    top:5px;
                }
            }
            .bad {
                background-color: #FF9952;
                position: relative;
                .bad-icon {
                    width: 16px;
                    height: 15px;
                    background:url("../../assets/image/警告.png") no-repeat;
                    background-size:100% 100%;
                    position: absolute;
                    left:5px;
                    top:5px;
                }
            }
            .report-list {
                height: 105px;
                overflow-y: auto;
            }
            .tips {
                border: 1px solid #E56969;
                color:#E56969;
                position: relative;
                .tips-icon {
                    width: 14px;
                    height: 13px;
                    background:url("../../assets/image/爱心.png") no-repeat;
                    background-size:100% 100%;
                    position: absolute;
                    left:5px;
                    top:5px;
                }
            }
            .function {
                padding: 0 15px;
                margin-top: 10px;
                .left {
                    color: #E56969;
                    font-weight:bold;
                }
                .right {
                    font-size: 11px;
                    color: rgba(153, 148, 148, 0.623);
                }
                .plus {
                    width: 12px;
                    height: 12px;
                    background: url("../../assets/image/加.png") no-repeat;
                    background-size: 100% 100%;
                    display: inline-block;
                    transform: translateY(2px);
                    margin-left: 5px;
                }
                .minus {
                    width: 12px;
                    height: 3px;
                    background: url("../../assets/image/减.png") no-repeat;
                    background-size: 100% 100%;
                    display: inline-block;
                    transform: translateY(-3px);
                    margin-left: 5px;
                }
                .function-message {
                    margin-top: 5px;
                    line-height: 20px;
                    color: #000;
                }
            }
            .bottom-message {
                font-size: 11px;
                color: rgb(161, 156, 156);
                text-align: center;
                margin: 10px 0 5px 0;
            }
        }
    }
</style>