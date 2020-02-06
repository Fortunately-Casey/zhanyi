import axios from "axios";
import { getURL } from "@/common/tool/tool"
// 注册
export function saveUserInfo(params) {
    const url = getURL("/userInfo/saveUserInfo")
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

