import axios from "axios";

export function saveUserInfo(params) {
    const url = "/api/userInfo/saveUserInfo"
    return axios.post(url, params).then((resp) => {
        return Promise.resolve(resp)
    }).catch((err) => {
        console.log(err)
    })
}

