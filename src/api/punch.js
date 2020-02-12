import axios from "axios";
import {
    getURL
} from "@/common/tool/tool";

// 根据微信id获取信息
export function getHistoryIDCardMobile(params) {
    const url = getURL("/clockin/getHistoryIDCardMobile")
    return axios.get(url, {
        params:params
    }).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}
// 打卡
export function savePeriodPlace(params) {
    const url = getURL("/clockin/savePeriodPlace")
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}
// 健康查询
export function healthAnalysis(params) {
    const url = getURL("/clockin/healthAnalysis")
    return axios.get(url, {
        params:params
    }).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}


