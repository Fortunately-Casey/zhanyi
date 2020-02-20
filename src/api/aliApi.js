import axios from "axios";

export function getProvinceList(params) {
    const url = "https://api02.aliyun.venuscn.com/area/all"
    return axios.get(url, {
        params:params,
        headers: {'Authorization': "APPCODE 06fa92c24ef74f3084ccca081dfbd5e5"}
    }).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

export function getCityList(params) {
    const url = "https://api02.aliyun.venuscn.com/area/query"
    return axios.get(url, {
        params:params,
        headers: {'Authorization': "APPCODE 06fa92c24ef74f3084ccca081dfbd5e5"}
    }).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}