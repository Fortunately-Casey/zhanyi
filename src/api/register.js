import axios from "axios";
import {
    getURL
} from "@/common/tool/tool";

// 注册
export function saveUserInfo(params) {
    const url = getURL("/userInfo/saveUserInfo")
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

// 定点打卡
export function savePeriodPlace(params) {
    const url = getURL("/clockin/savePeriodPlace")
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

// 轨迹打卡开始

export function startRoute(params) {
    const url = getURL("/clockin/startRoute")
    return axios.post(url,params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

// 上传坐标

export function saveRouteDetail(params) {
    const url = getURL("/clockin/saveRouteDetail")
    return axios.post(url,params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

// 轨迹打卡结束
export function endRoute(params) {
    const url = getURL("/clockin/endRoute")
    return axios.post(url,params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
} 


// 获取基本信息
export function getUserInfo(params) {
    const url = getURL("/userInfo/getUserInfo?idCard="+params.idCard)
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

// 修改基本信息
export function updateUserInfo(params) {
    // const url = getURL("userInfo/updateUserInfo?idCard="+params.idCard+"&name="+params.name+"&mobile="+params.mobile+"&address="+params.address)
    const url = getURL("/userInfo/updateUserInfo")
    console.log(params)
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

// 获取定点打卡记录
export function getPeriodPlaceList(params) {
    console.log(params)
    const url = getURL("/clockin/getPeriodPlaceList?idCard="+params.idCard+"&page="+params.page+"&pageSize="+params.pageSize)
    // const url = getURL("clockin/getPeriodPlaceList?")
    console.log(url)
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

// 获取轨迹记录
export function getRouteList(params) {
    console.log(params)
    const url = getURL("/clockin/getRouteList?idCard="+params.idCard+"&page="+params.page+"&pageSize="+params.pageSize)
    // const url = getURL("clockin/getPeriodPlaceList?")
    console.log(url)
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}