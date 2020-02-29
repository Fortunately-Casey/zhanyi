/* eslint-disable no-console */
import axios from "axios";
// 获取所有省会
export function getProvinceList(params) {
  const url = "https://api02.aliyun.venuscn.com/area/all";
  return axios
    .get(url, {
      params: params,
      headers: { Authorization: "APPCODE 06fa92c24ef74f3084ccca081dfbd5e5" }
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
// 获取下级城市
export function getCityList(params) {
  const url = "https://api02.aliyun.venuscn.com/area/query";
  return axios
    .get(url, {
      params: params,
      headers: { Authorization: "APPCODE 06fa92c24ef74f3084ccca081dfbd5e5" }
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
