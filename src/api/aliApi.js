/* eslint-disable no-console */
import axios from "axios";
import {
  getURL
} from "@/common/tool/tool";
// 获取所有省会
export function getProvinceList(params) {
  const url = getURL("/enterprise/getProvinceArea");
  return axios
    .get(url, {
      params: params
      // headers: { Authorization: "APPCODE 06fa92c24ef74f3084ccca081dfbd5e5" }
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
  const url = getURL("/enterprise/getSubArea");
  return axios
    .get(url, {
      params: params
      // headers: { Authorization: "APPCODE 06fa92c24ef74f3084ccca081dfbd5e5" }
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
